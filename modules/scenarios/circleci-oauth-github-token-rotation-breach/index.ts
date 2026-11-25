import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a master build-automation vault that safeguards secret keys for thousands of software companies. An intruder infects a single senior engineer laptop with a silent pocket-picking program that lifts an already-stamped two-factor entry pass straight from the browser, replays that active pass from abroad to copy both the encrypted customer lockboxes and the live decoding key from the vault control room, and unlocks thousands of customer cloud and code keys offline.',
      storyMappings: [
        {
          storyTerm: 'Silent pocket-picking program lifting a stamped two-factor pass',
          technicalTerm: 'macOS infostealer stealing a 2FA-authenticated browser session cookie',
          tone: 'amber',
        },
        {
          storyTerm: 'Replaying the active pass from abroad to enter the control room',
          technicalTerm: 'Foreign proxy session replay accessing CircleCI production databases and KMS keys',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying both the encrypted lockboxes and the decoding key',
          technicalTerm: 'Exfiltrating customer secret databases alongside runtime encryption keys',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking customer cloud and code keys offline',
          technicalTerm: 'Offline decryption and replay of customer GitHub OAuth tokens and AWS keys',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After a senior engineer installs a trojanized helper tool on a work laptop, a quiet stealer slips inside the browser drawer and copies an already-verified security wristband, skipping the two-factor badge gate entirely because the wristband already carries its fresh stamp.',
        storyMappings: [
          {
            storyTerm: 'Trojanized helper tool on a work laptop',
            technicalTerm: 'Third-party macOS infostealer executing on a privileged engineer endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Already-verified security wristband inside the browser drawer',
            technicalTerm: 'Active 2FA-backed SSO browser session cookie stolen from disk/keychain',
            tone: 'sky',
          },
          {
            storyTerm: 'Skipping the two-factor badge gate',
            technicalTerm: 'Session cookie theft bypassing hardware MFA and antivirus detection',
            tone: 'rose',
          },
          {
            storyTerm: 'Privileged engineer identity',
            technicalTerm: 'Production access rights capable of generating customer data tokens',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Wearing the stolen wristband from an overseas relay booth, the intruder walks straight into the central vault control room, wheels out copies of the encrypted customer secret ledgers, and separately grabs the live master decoding key sitting in the vault engine room.',
        storyMappings: [
          {
            storyTerm: 'Wearing the stolen wristband from an overseas booth',
            technicalTerm: 'Replaying the hijacked session cookie from a foreign proxy IP address',
            tone: 'amber',
          },
          {
            storyTerm: 'Encrypted customer secret ledgers',
            technicalTerm: 'Exfiltrated CircleCI production database dumps containing encrypted CI secrets',
            tone: 'sky',
          },
          {
            storyTerm: 'Live master decoding key in the engine room',
            technicalTerm: 'Stolen runtime encryption / KMS key material protecting customer vaults',
            tone: 'rose',
          },
          {
            storyTerm: 'Central vault control room',
            technicalTerm: 'Privileged internal CircleCI production data and secrets infrastructure',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Safe inside their own hideout, the intruder pairs the stolen master decoding key with the copied ledgers to crack open customer build secrets offline, then replays those freshly uncovered GitHub and cloud keys across downstream company estates.',
        storyMappings: [
          {
            storyTerm: 'Pairing the master key with copied ledgers offline',
            technicalTerm: 'Offline decryption of customer environment variables, SSH keys, and OAuth tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Freshly uncovered code and cloud keys',
            technicalTerm: 'Decrypted customer GitHub OAuth tokens, AWS IAM keys, and project API tokens',
            tone: 'sky',
          },
          {
            storyTerm: 'Entering downstream company estates',
            technicalTerm: 'Downstream replay of stolen CI/CD secrets against customer repos and clouds',
            tone: 'rose',
          },
          {
            storyTerm: 'Emergency lock replacement across all tenants',
            technicalTerm: 'Mandatory global rotation of all CircleCI-stored OAuth, SSH, and cloud secrets',
            tone: 'emerald',
          },
        ],
      },
    },
  };
