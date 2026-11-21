import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
