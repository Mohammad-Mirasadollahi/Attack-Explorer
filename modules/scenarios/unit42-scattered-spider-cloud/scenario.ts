import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'unit42-scattered-spider-cloud',
  code: 'T1078.004',
  name: 'Unit 42 & CISA — Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot',
  shortSubtitle: 'Palo Alto Unit 42 / CISA AA23-320A · Okta Identity Takeover, FleetDeck RMM & Cloud SAML Pivot',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Tracked as Muddled Libra by Palo Alto Networks Unit 42, Octo Tempest by Microsoft, and UNC3944 / Scattered Spider in CISA Advisory AA23-320A, this threat group specializes in identity provider (Okta / Entra ID) social engineering and SMS/MFA fatigue. Once inside SSO, they register rogue MFA devices, deploy legitimate Remote Monitoring and Management (RMM) tools (ScreenConnect, FleetDeck, ngrok), pivot into AWS via SAML federation (AssumeRoleWithSAML), and compromise VMware vCenter/ESXi hypervisors.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Palo Alto Networks Unit 42 (Muddled Libra) & CISA Joint Advisory AA23-320A',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1621 (MFA Fatigue) · T1219 (Remote Access Tools) · T1078.004 (Cloud Accounts)',
    },
    {
      term: 'IDENTITY & RMM TOOLS',
      value: 'Okta FastPass / TOTP Enrollment · ScreenConnect, FleetDeck, Tailscale, Ngrok',
    },
    {
      term: 'CLOUD / HYPERVISOR',
      value: 'AWS STS AssumeRoleWithSAML + VMware ESXi SSH & VMDK Impact',
    },
  ],
  nodes: [
    {
      id: 'muddled_libra_actor',
      label: 'Muddled Libra (UNC3944)',
      sublabel: 'Residential Proxy · Helpdesk Vishing',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Scattered Spider / Muddled Libra Operator',
        pidOrPort: 'Residential Proxy / Mullvad VPN',
        privilege: 'External Identity Attacker',
        artifacts: [
          '0ktapush Phishing Kit & Helpdesk Social Engineering',
          'Rogue WebAuthn / TOTP Factor Registration',
        ],
        description:
          'Threat actor using SMS phishing and IT helpdesk social engineering to trigger MFA push fatigue and enroll a rogue authenticator.',
      },
    },
    {
      id: 'okta_idp_portal',
      label: 'Okta / Entra ID SSO Portal',
      sublabel: 'corp.okta.com (Federation Hub)',
      role: 'domain_controller',
      x: 42,
      y: 26,
      details: {
        osOrType: 'Enterprise Identity Provider (IdP)',
        pidOrPort: 'SAML 2.0 / OIDC Federation',
        privilege: 'Tier-0 Identity Control Plane',
        artifacts: [
          'user.mfa.factor.activate (New TOTP Enrolled)',
          'user.authentication.sso -> AWS Production Account',
        ],
        description:
          'Corporate Single Sign-On portal where the attacker activates a secondary MFA factor and launches SAML assertions into AWS and Citrix/VPN.',
      },
    },
    {
      id: 'admin_wks_rmm',
      label: 'Admin Endpoint (RMM Persistence)',
      sublabel: 'IT-ADM-02 (10.10.8.19 · ScreenConnect)',
      role: 'victim_host',
      x: 52,
      y: 72,
      details: {
        osOrType: 'Windows 11 Admin Workstation',
        pidOrPort: 'ScreenConnect.ClientService.exe & ngrok.exe',
        privilege: 'IT Administrator',
        artifacts: [
          'C:\\Program Files (x86)\\ScreenConnect Client\\ScreenConnect.ClientService.exe',
          'ngrok.exe tcp 3389',
        ],
        description:
          'Compromised IT administrator endpoint where Muddled Libra installs legitimate signed RMM agents to maintain persistent access even if SSO passwords are reset.',
      },
    },
    {
      id: 'aws_esxi_infra',
      label: 'AWS IAM & VMware ESXi Cluster',
      sublabel: 'AWS STS + vCenter 10.10.1.50',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Hybrid Cloud (AWS Prod VPC & VMware vSphere)',
        pidOrPort: 'AWS AssumeRoleWithSAML & ESXi SSH :22',
        privilege: 'Cloud Admin & Hypervisor Root',
        artifacts: [
          'CloudTrail: AssumeRoleWithSAML (AdminRole)',
          'CloudTrail: CreateAccessKey & EC2 Secrets Manager Dump',
        ],
        description:
          'Production AWS environment and VMware ESXi hypervisor cluster accessed via federated SAML tokens to extract secrets and stage hypervisor encryption.',
      },
    },
    {
      id: 'unit42_cdr_siem',
      label: 'Prisma Cloud & SIEM',
      sublabel: 'Okta SystemLog + AWS CloudTrail + Sysmon',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Identity & Cloud Detection Platform',
        pidOrPort: 'Okta SystemLog, CloudTrail & Sysmon',
        privilege: 'SOC Monitoring',
        artifacts: [
          'Alert: New MFA Factor Followed by SAML AssumeRole',
          'Alert: Unauthorized RMM Tool Execution (ScreenConnect/FleetDeck)',
        ],
        description:
          'Correlates Okta MFA factor registration events with endpoint RMM installation and AWS CloudTrail privilege escalation.',
      },
    },
  ],
  processTree: [
    {
      pid: 7104,
      ppid: 1420,
      name: 'msiexec.exe',
      commandLine:
        'msiexec.exe /i "C:\\Users\\it.admin\\Downloads\\ScreenConnect.ClientSetup.msi" /qn',
      user: 'CORP\\it.admin',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 2,
      apiCalls: ['CreateServiceW("ScreenConnect Client")', 'StartServiceW'],
    },
    {
      pid: 7488,
      ppid: 680,
      name: 'ScreenConnect.ClientService.exe',
      commandLine:
        '"C:\\Program Files (x86)\\ScreenConnect Client (a8f2c1)\\ScreenConnect.ClientService.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['Connect("relay.screenconnect.com:443")', 'CreateProcessAsUserW'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'OKTA MFA PUSH FATIGUE & ROGUE DEVICE ENROLLMENT',
      subtitle: 'Social engineering & MFA bombing leading to user.mfa.factor.activate',
      description:
        'As detailed by Unit 42 and CISA AA23-320A, Muddled Libraharvests credentials via an AiTM phishing portal or vishing call to the IT helpdesk, bombards the target with MFA push notifications (T1621), and immediately registers their own TOTP / WebAuthn factor in Okta (user.mfa.factor.activate) for persistent identity access.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1621',
      mitreTechniqueName: 'Multi-Factor Authentication Request Generation',
      activeNodeIds: ['muddled_libra_actor', 'okta_idp_portal', 'unit42_cdr_siem'],
      compromisedNodeIds: ['okta_idp_portal'],
      keySpecs: [
        { term: 'OKTA EVENT', value: 'system.push.send_factor_verify_push -> user.mfa.factor.activate' },
        { term: 'TARGET ROLE', value: 'IT Helpdesk / Cloud SuperAdmin' },
        { term: 'SOURCE ANOMALY', value: 'Residential Proxy / Anonymizing VPN ASN' },
      ],
    },
    {
      index: 2,
      title: 'AUTHORIZED RMM TOOL DEPLOYMENT (SCREENCONNECT / NGROK)',
      subtitle: 'Living-off-the-land persistence via legitimate remote management binaries',
      description:
        'To survive identity remediation, the attacker deploys multiple commercial Remote Monitoring and Management (RMM) tools—such as ConnectWise ScreenConnect, FleetDeck, AnyDesk, and ngrok—onto admin workstations (T1219). Because these binaries are digitally signed, they bypass traditional antivirus signatures.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1219',
      mitreTechniqueName: 'Remote Access Software',
      activeNodeIds: ['okta_idp_portal', 'admin_wks_rmm', 'unit42_cdr_siem'],
      compromisedNodeIds: ['okta_idp_portal', 'admin_wks_rmm'],
      keySpecs: [
        { term: 'RMM BINARIES', value: 'ScreenConnect.ClientService.exe, fleetdeck_agent.exe, ngrok.exe' },
        { term: 'PRIVILEGE', value: 'Installed as Windows Service running as NT AUTHORITY\\SYSTEM' },
        { term: 'C2 CHANNEL', value: 'Outbound TLS :443 to tenant-specific ScreenConnect relay' },
      ],
    },
    {
      index: 3,
      title: 'SAML FEDERATION PIVOT TO AWS & VMWARE VCENTER',
      subtitle: 'AssumeRoleWithSAML into AWS Production + CreateAccessKey & ESXi SSH',
      description:
        'Using the compromised Okta SSO session, the attacker pivots into AWS via SAML 2.0 federation (AssumeRoleWithSAML), generates long-lived IAM access keys (CreateAccessKey), queries EC2/Secrets Manager, and uses harvested vSphere credentials to SSH into VMware ESXi hypervisors.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1078.004',
      mitreTechniqueName: 'Valid Accounts: Cloud Accounts',
      activeNodeIds: ['okta_idp_portal', 'aws_esxi_infra', 'unit42_cdr_siem'],
      compromisedNodeIds: ['okta_idp_portal', 'admin_wks_rmm', 'aws_esxi_infra'],
      keySpecs: [
        { term: 'AWS CLOUDTRAIL', value: 'AssumeRoleWithSAML -> iam:CreateAccessKey -> secretsmanager:GetSecretValue' },
        { term: 'HYPERVISOR PIVOT', value: 'VMware vCenter SSO & ESXi SSH Enabled' },
        { term: 'CISA ADVISORY', value: 'AA23-320A (Scattered Spider TTPs)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'u42-ss-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:05:11.402',
      sourceNodeId: 'muddled_libra_actor',
      targetNodeId: 'okta_idp_portal',
      sourceLabel: '198.51.100.210 (Proxy)',
      targetLabel: 'corp.okta.com',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Okta SystemLog',
      shortAction: 'MFA FACTOR ENROLL',
      info: 'eventType="user.mfa.factor.activate" outcome="SUCCESS" factorType="token:software:totp"',
      sizeOrCode: 'Okta MFA',
      severity: 'HIGH',
      mitreId: 'T1621',
      explanation:
        'Okta SystemLog records a burst of denied push challenges followed by a successful push and immediate activation of a new software TOTP factor from a new ASN.',
      rawLog: `{
  "eventType": "user.mfa.factor.activate",
  "outcome": { "result": "SUCCESS" },
  "actor": { "alternateId": "it.admin@corp.local", "displayName": "IT Admin" },
  "client": { "ipAddress": "198.51.100.210", "userAgent": { "rawUserAgent": "Mozilla/5.0 (X11; Linux x86_64)" } },
  "debugContext": { "debugData": { "factor": "GOOGLE_OTP", "requestUri": "/api/v1/users/00u1/factors/ost1/lifecycle/activate" } }
}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Okta New MFA Factor Enrolled After Push Fatigue Burst',
        ruleCode: `title: Okta Suspicious MFA Factor Enrollment
logsource:
  product: okta
  service: okta
detection:
  selection:
    eventType:
      - 'user.mfa.factor.activate'
      - 'user.mfa.factor.update'
    outcome.result: 'SUCCESS'
  condition: selection
level: high`,
        mitigation:
          'Enforce phishing-resistant FIDO2/WebAuthn (Okta FastPass with number matching / device-bound keys) and require identity verification out-of-band before helpdesk MFA resets.',
      },
    },
    {
      id: 'u42-ss-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:12:38.905',
      sourceNodeId: 'admin_wks_rmm',
      targetNodeId: 'unit42_cdr_siem',
      sourceLabel: 'IT-ADM-02',
      targetLabel: 'Sysmon EID 1 / 7045',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'RMM SCREENCONNECT',
      info: 'Image=ScreenConnect.ClientService.exe User=NT AUTHORITY\\SYSTEM',
      sizeOrCode: 'PID 7488',
      severity: 'HIGH',
      mitreId: 'T1219',
      explanation:
        'CISA AA23-320A highlights Scattered Spider installing unauthorized RMM agents (ScreenConnect, FleetDeck, AnyDesk) to retain persistent access across the enterprise.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>IT-ADM-02.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">7488</Data>
    <Data Name="Image">C:\\Program Files (x86)\\ScreenConnect Client (a8f2c1)\\ScreenConnect.ClientService.exe</Data>
    <Data Name="CommandLine">"C:\\Program Files (x86)\\ScreenConnect Client (a8f2c1)\\ScreenConnect.ClientService.exe" "?e=Access&amp;y=Guest&amp;h=instance-r9x.screenconnect.com&amp;p=443"</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unauthorized RMM Agent Execution (CISA AA23-320A Scattered Spider)',
        ruleCode: `title: Suspicious Remote Monitoring and Management (RMM) Execution
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith:
      - '\\ScreenConnect.ClientService.exe'
      - '\\fleetdeck_agent.exe'
      - '\\AnyDesk.exe'
      - '\\ngrok.exe'
  condition: selection
level: high`,
        mitigation:
          'Block unapproved RMM domains at the firewall/DNS layer and enforce application allowlisting for remote support binaries.',
      },
    },
    {
      id: 'u42-ss-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:19:44.112',
      sourceNodeId: 'okta_idp_portal',
      targetNodeId: 'aws_esxi_infra',
      sourceLabel: 'Okta SAML Federation',
      targetLabel: 'AWS STS / CloudTrail',
      sourceType: 'NETWORK',
      protocolOrEventId: 'CloudTrail STS/IAM',
      shortAction: 'ASSUMEROLE + KEY',
      info: 'eventName="AssumeRoleWithSAML" -> "CreateAccessKey" userName="svc-ci-deploy"',
      sizeOrCode: 'AKIA...Key',
      severity: 'CRITICAL',
      mitreId: 'T1078.004',
      explanation:
        'Following SAML federation into AWS, Muddled Libra calls iam:CreateAccessKey on privileged IAM users/roles to maintain direct API access independent of Okta.',
      rawLog: `{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROA3X7EXAMPLE:it.admin@corp.local",
    "arn": "arn:aws:sts::123456789012:assumed-role/OktaAdminRole/it.admin@corp.local"
  },
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateAccessKey",
  "sourceIPAddress": "198.51.100.210",
  "requestParameters": { "userName": "svc-ci-deploy" }
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Federated SAML Session Creating Permanent AWS IAM Access Keys',
        ruleCode: `AWSCloudTrail
| where EventSource == "iam.amazonaws.com" and EventName == "CreateAccessKey"
| where UserIdentityType == "AssumedRole" and UserIdentityPrincipalId has "@"
| project TimeGenerated, SourceIpAddress, UserIdentityArn, RequestParameters`,
        mitigation:
          'Apply AWS Service Control Policies (SCPs) prohibiting long-lived IAM Access Key creation and isolate VMware vCenter/ESXi management interfaces from standard SSO tiers.',
      },
    },
  ],
};
