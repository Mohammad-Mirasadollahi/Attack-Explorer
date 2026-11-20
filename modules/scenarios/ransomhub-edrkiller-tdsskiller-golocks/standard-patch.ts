import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a nimble extortion crew that brings an authentic antivirus cleanup utility and a shape-shifting driver smuggler to knock out every security guard first, then slips a special asterisk-marked wake-up note onto the building emergency-repair startup clipboard so the building reboots into stripped-down maintenance mode where guards stay asleep, and finally requires a long secret passphrase before unpacking its fast modern locking gear.',
      storyMappings: [
        {
          storyTerm: 'Authentic cleanup utility and shape-shifting driver smuggler',
          technicalTerm: 'Signed Kaspersky TDSSKiller.exe (klbg.sys) and EDRKillShifter BYOVD loader',
          tone: 'amber',
        },
        {
          storyTerm: 'Asterisk-marked note waking up inside stripped-down maintenance mode',
          technicalTerm: 'Safe-Mode RunOnce persistence (*safemode) paired with bcdedit safeboot reboot',
          tone: 'sky',
        },
        {
          storyTerm: 'Requiring a long secret passphrase before unpacking locking gear',
          technicalTerm: 'Mandatory 64-character hex -pass <sha256_key> decrypting embedded configuration',
          tone: 'rose',
        },
        {
          storyTerm: 'Fast modern locking gear sealing every volume',
          technicalTerm: 'Curve25519 key exchange and XChaCha20 multi-platform encryption',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after entering the estate, the affiliate turns an authentic signed rootkit-removal utility or a shape-shifting vulnerable-driver wrapper against the building own security monitors, silencing every guard station before staging the encryptor.',
        storyMappings: [
          {
            storyTerm: 'Authentic signed rootkit-removal utility',
            technicalTerm: 'Legitimate Kaspersky TDSSKiller.exe loading signed klbg.sys to disable EDR services',
            tone: 'amber',
          },
          {
            storyTerm: 'Shape-shifting vulnerable-driver wrapper',
            technicalTerm: 'EDRKillShifter BYOVD loader unpacking vulnerable signed kernel drivers in memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Silencing every guard station before locking doors',
            technicalTerm: 'Kernel-level termination of EDR and antivirus sensors prior to encryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Initial perimeter entry',
            technicalTerm: 'Breach via exposed VPN appliances or ZeroLogon lateral compromise',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When instructed to strike in stripped-down emergency mode, the crew pins a special asterisk-prefixed work order onto the startup board and reboots the computer into Safe Mode, where normal security guards never wake up yet the asterisk note still launches automatically to mount hidden storage shelves and wipe backups.',
        storyMappings: [
          {
            storyTerm: 'Special asterisk-prefixed work order on the startup board',
            technicalTerm: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce entry prefixed with *',
            tone: 'amber',
          },
          {
            storyTerm: 'Rebooting into stripped-down emergency mode',
            technicalTerm: 'Triggering Windows Safe Mode (-safeboot) where most third-party EDR agents do not load',
            tone: 'sky',
          },
          {
            storyTerm: 'Mounting hidden storage shelves',
            technicalTerm: 'Enumerating and mounting unmounted local volumes so hidden drives get encrypted',
            tone: 'rose',
          },
          {
            storyTerm: 'Wiping recovery snapshots before locking',
            technicalTerm: 'Automated Volume Shadow Copy deletion inside the quiet Safe Mode boot',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because the encryptor keeps its master instructions tightly sealed against curious defenders, it refuses to budge until the operator supplies a 64-character secret passkey, unlocking modern curve-based locks that seal Windows desktops, Linux hosts, and ESXi servers alike.',
        storyMappings: [
          {
            storyTerm: 'Refusing to budge without a 64-character secret passkey',
            technicalTerm: 'Mandatory -pass <sha256_key> CLI argument decrypting the embedded config',
            tone: 'amber',
          },
          {
            storyTerm: 'Tightly sealed against automated sandbox inspection',
            technicalTerm: 'Anti-analysis runtime key check preventing detonation without affiliate credentials',
            tone: 'sky',
          },
          {
            storyTerm: 'Modern curve-based locking gear',
            technicalTerm: 'Curve25519 asymmetric key exchange paired with XChaCha20 symmetric encryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Uniform Go/C++ fleet across every server room',
            technicalTerm: 'Cross-platform RansomHub payloads targeting Windows, Linux, and ESXi',
            tone: 'emerald',
          },
        ],
      },
    },
  };
