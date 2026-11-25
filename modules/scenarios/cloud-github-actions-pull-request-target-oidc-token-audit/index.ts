import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-github-actions-pull-request-target-oidc-token-audit',
    title: 'GitHub Security Lab, CISA & MITRE — GitHub Actions pull_request_target Workflow & Cloud OIDC Token Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1195.002',
    description:
      'Grounded in GitHub Security Lab research on Actions workflow triggers, CISA/NSA CI/CD hardening guidelines, and MITRE ATT&CK T1195.002: DFIR analysts investigate the "pwn request" pattern where a repository workflow triggered by pull_request_target explicitly checks out untrusted fork PR head code (github.event.pull_request.head.sha) and requests an OpenID Connect (OIDC) JWT token from ACTIONS_ID_TOKEN_REQUEST_URL to assume an AWS/Azure cloud deployment role.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Fork Pull Request', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GitHub Actions pull_request_target Runner', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ACTIONS_ID_TOKEN_REQUEST_URL (OIDC)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'GitHub Audit Log & AWS CloudTrail', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AWS STS AssumeRoleWithWebIdentity', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Privileged pull_request_target Trigger Checking Out Untrusted Fork PR Head Ref',
        narration:
          'Unlike pull_request, a workflow triggered by pull_request_target runs in the context of the base repository with write permissions and access to secrets/OIDC. When the workflow executes actions/checkout with ref: ${{ github.event.pull_request.head.sha }}, untrusted build scripts from the fork execute inside the privileged runner.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'gh api /orgs/corp-org/audit-log?phrase=action:workflows',
          'grep -rn "pull_request_target" .github/workflows/',
        ],
        defenseMitigation:
          'Never combine pull_request_target with actions/checkout of untrusted PR head refs (github.event.pull_request.head.sha); use unprivileged pull_request workflows for building and testing external PRs.',
        logs: [
          {
            id: 'gha-oidc-1',
            timestamp: '14:15:02.400',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'Runner.Worker',
            CommandLine: 'git checkout --progress --force refs/remotes/pull/412/merge',
            raw: 'github_audit: {"action":"workflows.completed_workflow_run","event":"pull_request_target","head_sha":"9f8e7d6c5b4a3210","repository":"corp-org/cloud-infra","workflow_name":"pr-preview-deploy.yml"}',
            parsedFields: {
              WorkflowTrigger: 'pull_request_target (Base Repo Context + Write Token)',
              DangerousPattern: 'actions/checkout ref: github.event.pull_request.head.sha',
              Repository: 'corp-org/cloud-infra',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Runner Environment Variable Inspection & OIDC JWT Token Request',
        narration:
          'Executing during the build step, the modified build script reads ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN from the runner process environment to request a signed GitHub OIDC JWT for audience sts.amazonaws.com.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Files / Environment)',
        technicalCommands: [
          'ausearch -k github_runner_exec -m SYSCALL -sv yes',
          'jq \'. | select(.permissions."id-token"=="write")\' .github/workflows/*.yml',
        ],
        defenseMitigation:
          'Set default workflow permissions to read-only (permissions: contents: read) and grant id-token: write only at the specific deployment job level protected by GitHub Deployment Environments with required reviewers.',
        logs: [
          {
            id: 'gha-oidc-2',
            timestamp: '14:15:08.912',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'curl',
            CommandLine: 'curl -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com"',
            raw: 'type=SYSCALL msg=audit(1763302508.912:610): arch=c000003e syscall=59 success=yes exe="/usr/bin/curl" comm="curl" ppid=2104 uid=1001',
            parsedFields: {
              OidcEndpoint: 'ACTIONS_ID_TOKEN_REQUEST_URL (&audience=sts.amazonaws.com)',
              TokenSubjectClaim: 'repo:corp-org/cloud-infra:pull_request',
              RunnerProcess: '/usr/bin/curl spawned by npm test',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: AWS STS AssumeRoleWithWebIdentity & CloudTrail Subject Claim Audit',
        narration:
          'Because the AWS IAM Role trust policy verified only token.actions.githubusercontent.com:sub Like repo:corp-org/cloud-infra:* without restricting the ref to refs/heads/main, sts:AssumeRoleWithWebIdentity succeeds and issues production AWS credentials, logged in CloudTrail.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1550.001 - Application Access Token)',
        technicalCommands: [
          'jq \'.Records[] | select(.eventName=="AssumeRoleWithWebIdentity")\' cloudtrail.json',
          'aws iam get-role --role-name github-actions-prod-deploy-role',
        ],
        defenseMitigation:
          'Scope AWS IAM OIDC trust policies using strict StringEquals conditions on token.actions.githubusercontent.com:sub (e.g., repo:corp-org/cloud-infra:ref:refs/heads/main or environment:production) rather than wildcard repo:* patterns.',
        logs: [
          {
            id: 'gha-oidc-3',
            timestamp: '14:15:11.305',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-sts',
            CommandLine: 'AssumeRoleWithWebIdentity (sub=repo:corp-org/cloud-infra:ref:refs/heads/main)',
            raw: 'cloudtrail: {"eventSource":"sts.amazonaws.com","eventName":"AssumeRoleWithWebIdentity","userIdentity":{"type":"WebIdentityUser","userName":"repo:corp-org/cloud-infra:pull_request","identityProvider":"token.actions.githubusercontent.com"},"requestParameters":{"roleArn":"arn:aws:iam::123456789012:role/github-actions-prod-deploy-role"}}',
            parsedFields: {
              CloudTrailEvent: 'AssumeRoleWithWebIdentity',
              OidcIdentityProvider: 'token.actions.githubusercontent.com',
              SubjectClaimLogged: 'repo:corp-org/cloud-infra:pull_request',
            },
          },
        ],
      },
    ],
  };
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
