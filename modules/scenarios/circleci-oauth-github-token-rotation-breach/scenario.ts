import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'circleci-oauth-github-token-rotation-breach',
    title: 'CircleCI Official Security Alert, GitHub Security & CISA — CircleCI CI/CD Supply Chain Breach: Engineer macOS Infostealer, 2FA Session Theft & Customer Vault Exfiltration',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'Grounded in the official CircleCI Incident Report (January 2023), GitHub Security Advisories, and CISA CI/CD Supply Chain Guidance: an attacker compromises a CircleCI site reliability engineer’s macOS laptop with infostealer malware, steals an active 2FA-authenticated SSO session cookie from browser storage, impersonates the engineer in production, and extracts customer environment variables, AWS IAM keys, and GitHub OAuth deployment tokens.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Threat Actor (Stolen macOS SSO Session Cookie)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Engineer macOS Laptop (Infostealer Malware)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CircleCI Production Bastion & KMS Key Service', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CircleCI / GitHub OAuth & AWS CloudTrail Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Customer CI/CD Secrets, SSH Keys & GitHub Tokens', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Engineer macOS Infostealer Infection & 2FA-Backed Browser Session Cookie Theft',
        narration:
          'An engineer’s corporate macOS laptop is infected by trojanized third-party software carrying an infostealer that bypasses standard antivirus detections and extracts active browser session cookies and local SSH/GPG keys, including a valid, already-2FA-authenticated CircleCI production administrative SSO session token.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access & Credential Access (T1539 - Steal Web Session Cookie / T1555.003)',
        technicalCommands: [
          'macOS Infostealer reads ~/Library/Application Support/Google/Chrome/Default/Cookies & Keychain',
          'Exfiltrates active Okta/SSO session cookie (already authenticated with 2FA) to attacker C2',
        ],
        defenseMitigation:
          'Enforce device-bound WebAuthn / FIDO2 hardware security keys with continuous session IP/ASN binding (`Continuous Access Evaluation`) so stolen cookies cannot be replayed from foreign IPs.',
        logs: [
          {
            id: 'circleci-1',
            timestamp: '02:11:04.512',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'macos-stealer',
            raw: 'macOS Endpoint Alert | TargetFile: ~/Library/Application Support/Google/Chrome/Default/Cookies | StolenArtifact: 2FA-Authenticated Production SSO Session Cookie | Reference: CircleCI Security Alert Jan 2023',
            parsedFields: {
              EntryVector: 'Trojanized macOS software on engineer laptop',
              StolenCredential: 'Active 2FA-authenticated SSO session cookie (T1539)',
              ReplayEffect: 'Bypassed MFA challenge from remote attacker IP',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Session Replay from Foreign IP, Production Database Access & KMS Key Extraction',
        narration:
          'Replaying the stolen engineer session token from a remote proxy IP, the attacker accesses privileged internal CircleCI production hosts, extracts database encryption keys from the running runtime environment, and dumps customer project databases containing encrypted environment variables and OAuth tokens.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation & Collection (T1550.004 - Web Session Cookie / T1552)',
        technicalCommands: [
          'Replay SSO Cookie -> Access production bastion -> Dump customer context/project tables & KMS runtime decryption keys',
        ],
        defenseMitigation:
          'Require step-up hardware FIDO2 re-authentication for every production bastion login or KMS decryption key access regardless of active SSO cookie state.',
        logs: [
          {
            id: 'circleci-2',
            timestamp: '02:18:49.220',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-kms',
            raw: 'Production Access Anomaly | Principal: Engineer SSO Session | SourceIP: External Proxy ASN (Geo-Mismatch) | Action: Production Database & Runtime Encryption Key Extraction',
            parsedFields: {
              SessionAnomaly: 'SSO session cookie replayed from new ASN/IP',
              CompromisedAssets: 'Production Datastores + Runtime Encryption Keys',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Offline Decryption of Customer CI/CD Secrets & Downstream GitHub / AWS Token Replay',
        narration:
          'Combining the exfiltrated database dumps with the stolen runtime encryption keys, the attacker decrypts customer CI/CD environment variables (`AWS_SECRET_ACCESS_KEY`, `NPM_TOKEN`, SSH deploy keys, and GitHub OAuth tokens) offline and attempts unauthorized `git clone` and `aws sts get-caller-identity` calls against customer repositories and cloud accounts.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Lateral Movement & Impact (T1552.001 - Credentials In Files / T1199 - Trusted Relationship)',
        technicalCommands: [
          'Offline AES-GCM Decryption of Customer Project Contexts -> Recover AWS_ACCESS_KEY_ID, GITHUB_TOKEN, SSH Private Keys',
          'git clone https://x-access-token:<stolen_oauth>@github.com/customer-org/private-repo.git',
        ],
        defenseMitigation:
          'Replace long-lived static AWS/GCP secrets in CI/CD pipelines with short-lived OpenID Connect (OIDC) federated tokens (`sts:AssumeRoleWithWebIdentity`) that expire immediately after each build job.',
        logs: [
          {
            id: 'circleci-3',
            timestamp: '02:45:10.805',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'github-audit',
            raw: 'GitHub & AWS Audit Alert | Event: repo.clone & sts:GetCallerIdentity | Principal: CircleCI OAuth App Token & Customer CI IAM User | Remediation: Rotate all static CI secrets & migrate to OIDC',
            parsedFields: {
              ExfiltratedSecrets: 'Customer Environment Variables, SSH Deploy Keys, GitHub OAuth Tokens',
              ArchitecturalDefense: 'Short-lived OIDC Federated Tokens instead of static CI secrets',
            },
          },
        ],
        packets: [],
      },
    ],
  };
