import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an automated software workshop whose intake conveyor accidentally invites untrusted blueprints submitted by outside strangers directly into the privileged assembly vault. The instant the vault runs the stranger build script, the script lifts a temporary cloud identity voucher straight from the workshop workbench and trades it at the cloud front gate for live production AWS credentials.',
      storyMappings: [
        {
          storyTerm: 'Inviting untrusted outside blueprints straight into the privileged vault',
          technicalTerm: 'GitHub Actions pull_request_target workflow checking out untrusted fork PR HEAD',
          tone: 'amber',
        },
        {
          storyTerm: 'Lifting a temporary cloud identity voucher from the workbench',
          technicalTerm: 'Querying ACTIONS_ID_TOKEN_REQUEST_URL to mint a signed GitHub OIDC JWT',
          tone: 'sky',
        },
        {
          storyTerm: 'Trading the voucher at the cloud gate for production credentials',
          technicalTerm: 'Calling AWS sts:AssumeRoleWithWebIdentity using the forged PR-context OIDC JWT',
          tone: 'rose',
        },
        {
          storyTerm: 'Checking the fine print stamped on the cloud gate receipt',
          technicalTerm: 'Auditing AWS CloudTrail OIDC sub claim and tightening IAM trust conditions',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An external contributor opens a seemingly helpful change proposal from a public fork. Because the repository workflow triggers with full privileged vault access and explicitly checks out the untrusted stranger branch code, the workshop executes attacker code inside its trusted build zone.',
        storyMappings: [
          {
            storyTerm: 'Workflow triggering with full privileged vault access',
            technicalTerm: 'GitHub Actions pull_request_target trigger inheriting base repository secrets and OIDC rights',
            tone: 'amber',
          },
          {
            storyTerm: 'Explicitly checking out the untrusted stranger branch',
            technicalTerm: 'actions/checkout configured with ref: ${{ github.event.pull_request.head.sha }}',
            tone: 'sky',
          },
          {
            storyTerm: 'Executing attacker build commands inside the trusted zone',
            technicalTerm: 'Arbitrary code execution via modified Makefile, package.json, or test scripts in the PR',
            tone: 'rose',
          },
          {
            storyTerm: 'Classic CI/CD PwnRequest pattern',
            technicalTerm: 'Mixing untrusted fork code execution with privileged base-repo permissions',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Running inside the privileged build workbench, the stranger script reads two secret workbench notes (one holding the voucher-booth URL and one holding the booth entry pass) and requests a freshly signed OpenID identity card proving it belongs to the trusted repository.',
        storyMappings: [
          {
            storyTerm: 'Workbench note holding the voucher-booth URL',
            technicalTerm: 'Runner environment variable ACTIONS_ID_TOKEN_REQUEST_URL',
            tone: 'amber',
          },
          {
            storyTerm: 'Workbench note holding the booth entry pass',
            technicalTerm: 'Runner environment variable ACTIONS_ID_TOKEN_REQUEST_TOKEN',
            tone: 'sky',
          },
          {
            storyTerm: 'Freshly signed OpenID identity card',
            technicalTerm: 'Signed GitHub OIDC JWT issued with audience sts.amazonaws.com and id-token: write',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero static long-lived secrets needed',
            technicalTerm: 'Abusing modern keyless OIDC federation through overly broad trust policies',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Carrying that freshly signed OIDC identity card straight to the cloud front gate, the script swaps it for temporary AWS administrative credentials because the cloud trust policy checked only the repository name and forgot to insist on the protected main branch.',
        storyMappings: [
          {
            storyTerm: 'Swapping the OIDC card at the cloud front gate',
            technicalTerm: 'AWS STS AssumeRoleWithWebIdentity returning temporary production IAM credentials',
            tone: 'amber',
          },
          {
            storyTerm: 'Trust policy checking only the repository name',
            technicalTerm: 'Over-broad IAM StringLike condition repo:org/app:* allowing pull_request subjects',
            tone: 'sky',
          },
          {
            storyTerm: 'Fine print on the cloud gate receipt',
            technicalTerm: 'CloudTrail requestParameters and OIDC sub claim showing pull_request instead of refs/heads/main',
            tone: 'rose',
          },
          {
            storyTerm: 'Locking the trust gate strictly to main releases',
            technicalTerm: 'Restricting IAM trust policies strictly to repo:org/app:ref:refs/heads/main or environments',
            tone: 'emerald',
          },
        ],
      },
    },
  };
