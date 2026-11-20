import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
