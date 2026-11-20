import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a smooth-talking con artist who calls a corporate campus helpdesk reciting an engineer employee number and manager name gathered from public directories, convincing the clerk to pair a brand-new pocket buzzer onto that engineer badge. Walking calmly through the front gate, the impostor reads internal instruction binders, installs commercial remote-support intercoms onto office desks, and quietly adds their own master keys to both the penthouse cloud suite and the basement server racks.',
      storyMappings: [
        {
          storyTerm: 'Con artist phoning the helpdesk to pair a rogue pocket buzzer',
          technicalTerm: 'Helpdesk vishing social engineering registering an attacker MFA device',
          tone: 'amber',
        },
        {
          storyTerm: 'Reading instruction binders and bolting on commercial intercoms',
          technicalTerm: 'SSO dashboard access harvesting Confluence/SharePoint runbooks and installing RMM tools',
          tone: 'sky',
        },
        {
          storyTerm: 'Adding a private master pass to the penthouse cloud suite',
          technicalTerm: 'AWS CreateSAMLProvider, UpdateAssumeRolePolicy, and privileged AssumeRole calls',
          tone: 'rose',
        },
        {
          storyTerm: 'Adding themselves to the basement server-rack board',
          technicalTerm: 'Active Directory privilege escalation into the VMware ESX Admins group',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Armed with personal facts scraped from public profiles, the caller phones the IT helpdesk pretending to be a locked-out engineer who lost their phone, smoothly persuading the clerk to reset the password and enroll the caller own pocket buzzer.',
        storyMappings: [
          {
            storyTerm: 'Personal facts scraped from public profiles',
            technicalTerm: 'Employee ID, birth date, and manager name gathered via OSINT reconnaissance',
            tone: 'amber',
          },
          {
            storyTerm: 'Persuading the helpdesk clerk by voice',
            technicalTerm: 'Voice phishing (vishing) targeting enterprise IT service desk personnel',
            tone: 'sky',
          },
          {
            storyTerm: 'Enrolling the caller own pocket buzzer',
            technicalTerm: 'Registering an attacker-controlled MFA authenticator or SIM-swapped number',
            tone: 'rose',
          },
          {
            storyTerm: 'Locked-out engineer badge hijacked',
            technicalTerm: 'Takeover of a high-privilege IT or DevOps engineer corporate identity',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Stepping effortlessly through the company central single-door portal, the impostor browses the internal wiki binders for vault maps and cloud keys, then installs ordinary commercial tech-support intercoms on virtual desks so they look just like routine IT staff.',
        storyMappings: [
          {
            storyTerm: 'Company central single-door portal',
            technicalTerm: 'Enterprise Okta or Entra ID Single Sign-On (SSO) dashboard',
            tone: 'amber',
          },
          {
            storyTerm: 'Internal wiki binders holding vault maps',
            technicalTerm: 'Confluence, SharePoint, and Slack runbooks containing infrastructure credentials',
            tone: 'sky',
          },
          {
            storyTerm: 'Commercial tech-support intercoms',
            technicalTerm: 'Legitimate Remote Monitoring and Management (RMM) tools deployed for stealthy access',
            tone: 'rose',
          },
          {
            storyTerm: 'Virtual desks inside the campus',
            technicalTerm: 'Corporate Citrix or VDI jump desktops providing internal network reach',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'From the trusted identity hub, the impostor walks into both the rooftop cloud control center and the basement server vault, registering a rogue backdoor identity bridge in the cloud while writing their own name onto the master hypervisor committee list.',
        storyMappings: [
          {
            storyTerm: 'Rogue backdoor identity bridge in the cloud',
            technicalTerm: 'AWS CreateSAMLProvider and UpdateAssumeRolePolicy federation backdoor',
            tone: 'amber',
          },
          {
            storyTerm: 'Stepping into supreme cloud authority',
            technicalTerm: 'Anomalous AWS STS AssumeRole calls targeting administrative roles',
            tone: 'sky',
          },
          {
            storyTerm: 'Master hypervisor committee list',
            technicalTerm: 'Active Directory ESX Admins group granting full VMware ESXi root control',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual control-plane takeover',
            technicalTerm: 'Simultaneous compromise of cloud IaaS and on-premises virtualization infrastructure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate AWS CloudTrail and Microsoft Entra Audit Logs (central cloud identity ledgers capturing control-plane mutations) for CreateSAMLProvider, UpdateAssumeRolePolicy, and anomalous AssumeRole events alongside Active Directory EventID 4728 group membership additions to ESX Admins (catching dual cloud and hypervisor takeover).',
      },
    },
  };
