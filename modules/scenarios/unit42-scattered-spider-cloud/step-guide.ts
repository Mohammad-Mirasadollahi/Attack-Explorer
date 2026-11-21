import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'unit42-scattered-spider-cloud',
    briefing: {
      headline: 'Scenario Briefing: Scattered Spider (Muddled Libra / UNC3944), Helpdesk Social Engineering to Cloud & ESXi Takeover',
      storyAnalogy:
        'Instead of picking the reinforced digital lock on the front door, the intruder calls the building’s IT Helpdesk pretending to be an employee who just bought a new phone, convinces the clerk to register the intruder’s own smartphone as the employee’s MFA badge, walks right into the IT Lobby (SSO Dashboard), and plugs a private tunnel cable (ngrok / Tailscale) directly into the cloud and virtual server control room.',
      plainSummary:
        'In this scenario (T1078.004, Unit 42 & CISA - Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: helpdesk Social Engineering to Register, then logging Into the SSO Dashboard, Harvesting, then federation / Cloud Control-Plane Takeover. Steps #1–#3 walk that chain end-to-end by covering Helpdesk Social Engineering to Register, then Logging Into the SSO Dashboard, Harvesting, then Federation / Cloud Control-Plane Takeover, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1/22 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Scattered Spider Operator), target Node ②/③ (IT Helpdesk & Corporate IdP / SSO Portal) to enroll a rogue MFA device, pivot into Node ④ (VDI / Intune Workstation & RMM Tunnel), and escalate privileges inside Node ⑤ (AWS / Azure Cloud & ESXi Control Plane), monitored by Node ⑥ (Cloud SIEM / Identity Logs).',
      documentedAdvisory: 'CISA Alert AA23-320A · Unit 42 Muddled Libra Profile · Mandiant UNC3944 Research · MITRE T1556 / T1078.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1556',
        plainTitle: 'Helpdesk Social Engineering ("Vishing") to Register a Rogue MFA Device',
        storyAnalogy:
          'Armed with the employee’s badge number and birthday, the caller rings the IT Helpdesk ("Hi, I got a new iPhone and lost my authenticator app") and persuades the helpdesk clerk to pair the caller’s own phone to the employee’s corporate account.',
        simpleExplanation:
          'Having gathered a target IT or DevOps engineer’s personal details (employee ID, date of birth, and manager name from LinkedIn or data brokers), the attacker calls the corporate IT Helpdesk impersonating that employee ("vishing", voice phishing) and claims they just got a new phone and lost their authenticator app. Persuaded by the caller, the helpdesk clerk triggers an administrative MFA reset (user.mfa.factor.activate, registering the attacker’s own smartphone or FIDO2 security key directly onto the employee’s Okta / Entra ID account so the attacker can approve their own MFA prompts at will).',
        howItWorksInPractice:
          'Unlike phishing attacks that try to steal a temporary session cookie, social-engineering the IT Helpdesk to enroll a new MFA factor on the Identity Provider (IdP) gives the attacker a permanent, legitimate MFA credential tied to their own device. In the documented Okta SystemLog exchange from Muddled Libra (UNC3944) to Core Identity & VLAN Switch, Core Identity & VLAN Switch responds with RESP Okta MFA (confirming that the MFA FACTOR ENROLL request succeeded on Core Identity & VLAN Switch and establishing the runtime state required for Step #2 AUTHORIZED RMM TOOL DEPLOYMENT (SCREENCONNECT / NGROK)).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Scattered Spider Operator) to Node ②/③ (IT Helpdesk & SSO Identity Provider), and return arrow ⇠#1 issuing the new MFA enrollment and SAML/OIDC session token.',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Okta System Log: user.mfa.factor.deactivate / user.mfa.factor.activate followed immediately by login (user.session.start) from a residential VPN/proxy ASN.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1219',
        plainTitle: 'Logging Into the SSO Dashboard, Harvesting Runbooks & Deploying Commercial RMM Tools',
        storyAnalogy:
          'Inside the employee’s virtual office, the intruder reads the IT team’s emergency instruction manuals (Confluence / SharePoint) and installs a genuine, IT-approved remote support tool (AnyDesk / Tailscale) so even if the front-door password is changed tomorrow, they still have a private side door straight into the machine.',
        simpleExplanation:
          'Using the newly hijacked Single Sign-On (SSO) account, the attacker logs into the company’s virtual desktop (Citrix / Azure VDI), searches internal IT documentation (Confluence / SharePoint, documented by Mandiant UNC3944 as the primary way the group locates VPN guides, CyberArk/PAM instructions, and VMware vCenter architecture diagrams), and installs commercial Remote Monitoring and Management (RMM) or mesh-VPN tools like AnyDesk, ScreenConnect, Tailscale, or ngrok (chosen because these tools are digitally signed by legitimate software vendors so antivirus does not block them, and they maintain an encrypted outbound tunnel that survives even if the victim’s SSO password and MFA are later reset).',
        howItWorksInPractice:
          'Commercial RMM agents establish persistent outbound TLS/WebSocket connections to the vendor’s relay cloud, giving the attacker full interactive desktop control without deploying any custom malware binary. In the documented Sysmon EID 1 exchange from Core Identity & VLAN Switch to Okta / Entra ID SSO Portal, Okta / Entra ID SSO Portal responds with ACK PID 7488 (confirming that the RMM SCREENCONNECT request succeeded on Okta / Entra ID SSO Portal and establishing the runtime state required for Step #3 SAML FEDERATION PIVOT TO AWS & VMWARE VCENTER).',
        diagramAlignment:
          'On the diagram, arrow #2→ authenticates from Node ③ (SSO Portal) into Node ④ (Corporate VDI / Endpoint) and establishes the RMM tunnel (⇠#2).',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Mandiant UNC3944: Sysmon EventID 1 / 22 showing installation of unauthorized RMM binaries (AnyDesk.exe, ScreenConnect, tailscaled) and DNS queries to *.ngrok.io or *.tailscale.com.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Federation / Cloud Control-Plane Takeover (AssumeRole) & VMware ESX Admins Pivot',
        storyAnalogy:
          'From the IT dashboard, the intruder attaches a second "Ghost Identity Provider" to the company’s cloud account, allowing them to mint temporary cloud master keys (AssumeRole) on demand, take over VMware ESXi hypervisors, and export customer databases from S3.',
        simpleExplanation:
          'Combining Unit 42’s and Mandiant’s findings: pivoting through the SSO dashboard into the AWS / Azure cloud management console, the attacker invokes sts:AssumeRole (minting temporary high-privilege cloud credentials) and calls CreateSAMLProvider / UpdateAssumeRolePolicy (registering a second, attacker-controlled SAML Identity Provider inside the cloud tenant, acting as a "golden SAML" backdoor that lets the attacker mint Admin cloud sessions even after the corporate Okta/Entra tenant is locked down). Simultaneously, for on-premises infrastructure, they add their compromised account to the Active Directory ESX Admins group to take direct SSH control over VMware ESXi hypervisors and export production S3 buckets.',
        howItWorksInPractice:
          'By compromising the Single Sign-On and Active Directory identity layer that governs both cloud role federation and hypervisor authentication, the attacker moves straight from a phone call to the IT Helpdesk into full control of AWS/Azure and VMware ESXi without touching a single network firewall exploit. In the documented CloudTrail STS/IAM exchange from Okta / Entra ID SSO Portal to Admin Endpoint (RMM Persistence), Admin Endpoint (RMM Persistence) responds with RESP AKIA...Key (confirming that the ASSUMEROLE + KEY request succeeded on Admin Endpoint (RMM Persistence) and completing the final execution objective of Unit 42 & CISA, Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot).',
        diagramAlignment:
          'On the diagram, arrow #3→ pivots from Node ④ into Node ⑤ (AWS / Azure Cloud Control Plane via sts:AssumeRole), while Node ⑥ (CloudTrail / SIEM) alerts on IAM federation changes.',
        detectionAndEvidence:
          'Documented in Unit 42 & AWS CloudTrail / Entra Audit Logs: CreateSAMLProvider, UpdateAssumeRolePolicy, anomalous AssumeRole calls, and AD group modifications to ESX Admins.',
      },
    ],
  };
