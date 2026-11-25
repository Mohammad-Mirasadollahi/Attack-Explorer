import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr',
    title: 'Jeffrey Appel & Microsoft Threat Intel — ARTEX Multi-Agent LLM Framework: Machine-Speed Kill-Chain Compression, Storm-0940 Spray & Defender XDR Disruption',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1110.003',
    description:
      'Grounded in security researcher Jeffrey Appel’s technical analysis ("ARTEX: Old Attacks at Machine Speed, and how Microsoft Defender keeps up") and Microsoft Threat Intelligence research on Storm-0940 and AI-accelerated intrusions: threat actors deploy ARTEX (an open-source Go + Next.js multi-agent LLM penetration testing framework powered by OpenAI/DeepSeek tool-calling APIs) to orchestrate Planner-Worker sub-agents that chain external reconnaissance (`nmap`/`curl`), Storm-0940 password spraying, Kerberoasting (`RC4-HMAC 0x17`), web shell persistence, and Azure Key Vault secret exfiltration—compressing multi-week intrusions into minutes and requiring Microsoft Defender XDR Automatic Attack Disruption, App Governance, and KQL multi-alert burst correlation.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'ARTEX Go Planner-Worker LLM Agent Console (Next.js + DeepSeek/OpenAI API)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Perimeter VPN / Entra ID Identity Edge (Storm-0940 Password Spray)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Hybrid Windows Server (Web Shell Staging & RC4 Kerberoasting)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Microsoft Defender XDR (Automatic Attack Disruption & KQL Burst Sensor)', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Entra ID OAuth Apps & Azure Key Vault (5-Minute Secret Exfil)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ARTEX Planner-Worker LLM Initialization, Autonomous `nmap`/`curl` Recon & Storm-0940 Password Spray',
        narration:
          'The attacker launches the ARTEX Go server (`artex-server --model deepseek-chat`) and Next.js operator console, where a central LLM Planner decomposes the objective into autonomous Worker tasks (executing parallel `nmap -sV -T4`, `curl` endpoint fingerprinting, and Storm-0940 distributed password spraying against Entra ID and perimeter VPN endpoints to compromise an initial identity in minutes).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Reconnaissance & Initial Access (T1595.002 - Vulnerability Scanning / T1110.003 - Password Spraying)',
        technicalCommands: [
          'artex-server --planner-model deepseek-reasoner --worker-concurrency 8 --target corp.local',
          'Worker-Recon: nmap -sV -p 80,443,445,3389 --open 172.16.10.0/24 && curl -skI https://vpn.corp.local/remote/login',
          'Worker-Auth (Storm-0940 Spray): POST /common/oauth2/token (Low-and-slow multi-IP password spray bypassing legacy lockout thresholds)',
        ],
        defenseMitigation:
          'Enforce phishing-resistant FIDO2/Passkey MFA in Entra ID Conditional Access, enable Entra ID Smart Lockout and Risky Sign-In blocking, and disable legacy non-interactive authentication protocols.',
        logs: [
          {
            id: 'artex-1',
            timestamp: '08:01:12.140',
            source: 'SIEM',
            severity: 'high',
            EventCode: 50126,
            ProcessName: 'artex-worker-recon',
            CommandLine: 'artex-server --planner-model deepseek-chat --task recon_and_spray --target vpn.corp.local',
            raw: 'SigninLogs & Defender XDR Identity Alert | ThreatActor: Storm-0940 / ARTEX Multi-Agent LLM | Event: Distributed Password Spray (ResultType 50126 -> 0 Success) | AgentFramework: ARTEX Go Planner-Worker (nmap/curl + OAuth2 ropc spray) | Reference: https://jeffreyappel.nl/artex-old-attacks-at-machine-speed-and-how-microsoft-defender-keeps-up/',
            parsedFields: {
              AgentArchitecture: 'ARTEX Go Planner-Worker Multi-Agent LLM Framework',
              InitialAccessVector: 'Storm-0940 Password Spraying + Automated Surface Recon (T1110.003 / T1595.002)',
              ReferenceUrl: 'https://jeffreyappel.nl/artex-old-attacks-at-machine-speed-and-how-microsoft-defender-keeps-up/',
            },
          },
        ],
        packets: [
          {
            id: 'artex-pkt-1',
            timestamp: '08:01:12.145',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.88',
            destIp: '172.16.10.1',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 640,
            hexDump: '50 4F 53 54 20 2F 63 6F 6D 6D 6F 6E 2F 6F 61 75 74 68 32 2F 74 6F 6B 65 6E 20 48 54 54 50 2F 31 2E 31 0D 0A 55 73 65 72 2D 41 67 65 6E 74 3A 20 67 6F 2D 72 65 73 74 79',
            decodedString: 'POST /common/oauth2/token HTTP/1.1 (ARTEX Go Worker Agent Storm-0940 Password Spray)',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Machine-Speed Web Shell Persistence (`T1505.003`), Automated Kerberoasting (`0x17`) & Lateral Pivot',
        narration:
          'Without waiting for human operator review, the ARTEX Planner parses the valid credential output and immediately dispatches a Lateral Movement Worker agent that drops an obfuscated web shell for persistence, enumerates Active Directory SPNs (`servicePrincipalName=*`), requests RC4-downgraded Kerberos TGS tickets (`EventID 4769`, `EncryptionType = 0x17`), and pivots across hybrid servers in under 15 minutes.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence, Credential Access & Lateral Movement (T1505.003 - Web Shell / T1558.003 - Kerberoasting)',
        technicalCommands: [
          'Worker-Persist: curl -X PUT https://10.10.20.14/owa/auth/healthcheck.aspx (Web shell drop via compromised admin session)',
          'Worker-AD: Invoke-Kerberoast / Rubeus.exe kerberoast /rc4opsec (Requests EventID 4769 TGS with TicketEncryptionType = 0x17)',
          'Worker-Pivot: wmiexec.py / smbexec.py CORP/svc_hybrid@10.10.0.5 (Automated lateral execution within 180 seconds of spray success)',
        ],
        defenseMitigation:
          'Enable Microsoft Defender for Endpoint Attack Surface Reduction (ASR) rules in Block mode (`Block web shell creation for Servers`, `Block credential stealing from LSASS`), enforce AES-only Kerberos encryption (`0x12`), and monitor Defender for Identity for rapid SPN enumeration.',
        logs: [
          {
            id: 'artex-2',
            timestamp: '08:09:44.510',
            source: 'Windows Security',
            severity: 'critical',
            EventCode: 4769,
            ProcessName: 'w3wp.exe',
            CommandLine: 'c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "MSExchangeOWAAppPool"',
            raw: 'EventID: 4769 (Kerberos Service Ticket Requested) & Defender ASR Alert | ServiceName: svc_azureconnect | TicketEncryptionType: 0x17 (RC4-HMAC) | ticketOptions: 0x40810000 | ParentProcess: w3wp.exe -> cmd.exe (Web Shell T1505.003) | TimeDeltaFromInitialAccess: 8m 32s (Machine-Speed Execution)',
            parsedFields: {
              KillChainCompression: 'Initial Spray to Web Shell + Kerberoast in 8 minutes 32 seconds',
              TicketEncryptionType: '0x17 (RC4-HMAC Downgrade - MITRE T1558.003)',
              WebShellParent: 'w3wp.exe spawning cmd.exe / powershell.exe (T1505.003)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: 5-Minute Cloud Secret Exfiltration (`Azure Key Vault`) & Defender XDR Automatic Attack Disruption',
        narration:
          'Pivoting from hybrid credentials or leaked GitHub/CI secrets into Azure within 5 minutes, the ARTEX Cloud Worker enumerates Entra ID OAuth app permissions and issues rapid `KeyVaultGetSecret` calls across production vaults. Microsoft Defender XDR correlates the multi-domain alert burst (`AlertInfo` + `AlertEvidence` across Endpoint, Identity, and Cloud Apps within a 10-minute window) and triggers Automatic Attack Disruption—isolating the host via `sense.exe` and revoking all Entra refresh tokens (`Revoke-MgUserSignInSession`).',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access, Exfiltration & Defensive Disruption (T1552.004 - Cloud Secrets / T1098.003 - Additional Cloud Roles)',
        technicalCommands: [
          'Worker-Cloud: az keyvault secret list --vault-name corp-prod-kv && az keyvault secret show --name prod-db-conn-string',
          'KQL Burst Hunt: AlertInfo | join AlertEvidence on AlertId | summarize AlertCount=dcount(AlertId), Categories=make_set(Category) by DeviceId, AccountUpn, bin(Timestamp, 15m) | where AlertCount >= 3',
          'Defender XDR Response: Automatic Attack Disruption -> Device Isolation (sense.exe) + Entra ID Session Revocation (Disable User & Revoke Refresh Tokens)',
        ],
        defenseMitigation:
          'Enable Microsoft Defender XDR Automatic Attack Disruption, activate Defender for Cloud Apps (App Governance) to block anomalous OAuth app secret reads, and deploy KQL multi-alert velocity rules that trigger on `>= 3` distinct MITRE tactics on a single host/user within 15 minutes.',
        logs: [
          {
            id: 'artex-3',
            timestamp: '08:14:29.880',
            source: 'SIEM',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'Microsoft.KeyVault',
            CommandLine: 'GET https://corp-prod-kv.vault.azure.net/secrets/prod-sql-master-key?api-version=7.4',
            raw: 'AzureDiagnostics & Defender XDR Incident | OperationName: SecretGet (Bulk Key Vault Enumeration in < 5 mins) | CallerIPAddress: 198.51.100.88 | DefenderAction: Automatic Attack Disruption Triggered (Host Isolated + Account Disabled in Entra ID) | Reference: Jeffrey Appel ARTEX Analysis',
            parsedFields: {
              CloudTarget: 'Azure Key Vault (Bulk SecretGet Enumeration - T1552.004)',
              DetectionMechanism: 'KQL Multi-Alert Burst Correlation (Endpoint + Identity + Cloud Apps in < 15m)',
              AutomatedDefense: 'Microsoft Defender XDR Automatic Attack Disruption (Host Isolation + Token Revocation)',
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
        'Imagine a bank heist crew that replaces slow human lockpickers with a coordinated swarm of high-speed robotic arms controlled by one central planner. Instead of inventing a brand-new laser cutter, the master planner dispatches eight worker robots that test every door handle in parallel, wedge open a service window, collect forged master vouchers, and sprint to the upstairs key vault in under fifteen minutes, forcing the building’s automated defense grid to slam down steel blast doors and shred compromised badges instantly because waiting for a human guard would be far too late.',
      storyMappings: [
        {
          storyTerm: 'Master Planner & Eight Worker Robots',
          technicalTerm: 'ARTEX Go + Next.js Multi-Agent LLM Planner-Worker Framework',
          tone: 'rose',
        },
        {
          storyTerm: 'Testing Every Door Handle in Parallel',
          technicalTerm: 'Autonomous nmap/curl Recon & Storm-0940 Distributed Password Spray',
          tone: 'amber',
        },
        {
          storyTerm: 'Service Window & Forged Vouchers',
          technicalTerm: 'Machine-Speed Web Shell (T1505.003) & RC4 Kerberoasting (etype 0x17)',
          tone: 'sky',
        },
        {
          storyTerm: 'Automated Steel Blast Doors',
          technicalTerm: 'Microsoft Defender XDR Automatic Attack Disruption & Session Revoke',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the start of the raid, the central robotic dispatcher hands out parallel checklists to a team of mechanical scouts that sweep the perimeter walls and gently test common door codes across dozens of staff entrances so the instant one lock clicks open, the next robot is already moving.',
        storyMappings: [
          {
            storyTerm: 'Central Robotic Dispatcher',
            technicalTerm: 'ARTEX Go Planner Server (artex-server) & Next.js Operator Console',
            tone: 'rose',
          },
          {
            storyTerm: 'Mechanical Scouts Sweeping Walls',
            technicalTerm: 'Autonomous Worker Agents Running Parallel nmap -sV & curl Probing',
            tone: 'amber',
          },
          {
            storyTerm: 'Gently Testing Staff Door Codes',
            technicalTerm: 'Storm-0940 Low-and-Slow Distributed Entra ID Password Spray',
            tone: 'sky',
          },
          {
            storyTerm: 'Smart Entrance Lockout',
            technicalTerm: 'FIDO2/Passkey MFA, Entra ID Smart Lockout & Risky Sign-In Blocking',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Without pausing for any human review, the central dispatcher reads the first unlocked door code and immediately sends a second robot to prop open a hidden maintenance window and request weak older-style ticket stubs inside the lobby within minutes, compressing days of manual burglary into seconds.',
        storyMappings: [
          {
            storyTerm: 'Zero-Delay Robot Handoff',
            technicalTerm: 'LLM Planner Parsing Valid Credentials & Dispatching Lateral Worker',
            tone: 'amber',
          },
          {
            storyTerm: 'Propping Open Maintenance Window',
            technicalTerm: 'Obfuscated ASPX Web Shell Drop Under IIS w3wp.exe (T1505.003)',
            tone: 'rose',
          },
          {
            storyTerm: 'Weak Older-Style Ticket Stubs',
            technicalTerm: 'Automated SPN Discovery & RC4 Kerberoasting (EventID 4769, 0x17)',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated Server Surface Block',
            technicalTerm: 'Defender ASR Rules (Block Web Shell & LSASS) & AES-Only Kerberos',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Five minutes later, the cloud scout robot races straight to the upstairs master key safe to scoop out high-value secrets, only for the building’s automated defense grid to spot three rapid alarms on the same badge within a tight window, lock the workstation behind steel doors, and shred the badge automatically.',
        storyMappings: [
          {
            storyTerm: 'Upstairs Master Key Safe',
            technicalTerm: 'Azure Key Vault Targeted by Rapid KeyVaultGetSecret Enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Three Rapid Alarms on Same Badge',
            technicalTerm: 'Defender XDR KQL Multi-Domain Alert Velocity Burst Correlation',
            tone: 'amber',
          },
          {
            storyTerm: 'Slamming Steel Blast Doors',
            technicalTerm: 'Automatic Attack Disruption Isolating Endpoint via sense.exe',
            tone: 'emerald',
          },
          {
            storyTerm: 'Shredding Compromised Badge',
            technicalTerm: 'Automated Entra ID User Containment & Active Session Revocation',
            tone: 'rose',
          },
        ],
      },
    },
  };
