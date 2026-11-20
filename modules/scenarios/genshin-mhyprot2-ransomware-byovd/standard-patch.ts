import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a ransomware crew walking into an enterprise bank headquarters wearing an officially stamped security guard badge lifted straight from a popular video-game arcade. Because the bank front gate still trusts that arcade seal, the badge unlocks a direct hallway to the building master control switch; after speaking a scrambled sequence to initialize the switch, the crew shuts down every real bank guard and locks every vault.',
      storyMappings: [
        {
          storyTerm: 'Officially stamped guard badge from a video-game arcade',
          technicalTerm: 'Signed Genshin Impact anti-cheat kernel driver mhyprot2.sys (CVE-2020-36603)',
          tone: 'amber',
        },
        {
          storyTerm: 'Bank headquarters accepting the arcade badge',
          technicalTerm: 'Windows Domain Controller loading standalone C:\\Users\\Public\\mhyprot2.sys',
          tone: 'sky',
        },
        {
          storyTerm: 'Speaking a scrambled sequence at the control window',
          technicalTerm: 'IOCTL 0x80034000 seeding the driver 64-bit Mersenne Twister (MT19937-64) cipher',
          tone: 'rose',
        },
        {
          storyTerm: 'Shutting down every real bank guard before locking the vaults',
          technicalTerm: 'XOR-encoded IOCTL 0x81034000 Ring-0 ZwTerminateProcess loop killing AV/EDR agents',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After sneaking into the bank central headquarters with stolen supervisor keys, the intruder drops an authentic, validly stamped arcade anti-cheat guard badge onto a public hallway table and registers it with the building core, even though no game machine exists anywhere in the bank.',
        storyMappings: [
          {
            storyTerm: 'Authentic arcade anti-cheat guard badge',
            technicalTerm: 'Standalone 350KB Microsoft-signed mhyprot2.sys kernel driver',
            tone: 'amber',
          },
          {
            storyTerm: 'Public hallway table',
            technicalTerm: 'Staging path C:\\Users\\Public\\mhyprot2.sys on an enterprise server',
            tone: 'sky',
          },
          {
            storyTerm: 'Bank central headquarters',
            technicalTerm: 'Compromised Windows Domain Controller or enterprise server',
            tone: 'rose',
          },
          {
            storyTerm: 'Registering it with the building core',
            technicalTerm: 'Loading mhyprot2.sys as a Ring-0 service without any Genshin Impact game installed',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The intruder steps up to the arcade driver back window and feeds it a 24-byte starting cipher dial so both sides agree on a shared scrambling pattern, unlocking the driver hidden command panel without needing the real arcade machine.',
        storyMappings: [
          {
            storyTerm: 'Arcade driver back window',
            technicalTerm: 'Device handle opened to \\\\.\\mhyprot2 by kill_svc.exe',
            tone: 'amber',
          },
          {
            storyTerm: '24-byte starting cipher dial',
            technicalTerm: 'Initialization structure sent via DeviceIoControl IOCTL 0x80034000',
            tone: 'sky',
          },
          {
            storyTerm: 'Shared scrambling pattern',
            technicalTerm: 'Internal 64-bit Mersenne Twister (MT19937-64) encryption key stream',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden command panel unlocked',
            technicalTerm: 'Authenticated kernel command channel ready for process-termination requests',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor CreateFileW handle requests targeting \\Device\\mhyprot2 alongside behavioral EDR rules flagging the 0x80034000 followed by 0x81034000 IOCTL sequence (pinpointing active CVE-2020-36603 driver weaponization before security agents are killed).',
      },
      3: {
        storyAnalogy:
          'Sending scrambled guard badge numbers through the unlocked window one after another, the intruder commands the building core itself to evict every active security officer on the floor, clearing the way to slam padlocks across every file cabinet in the bank.',
        storyMappings: [
          {
            storyTerm: 'Scrambled guard badge numbers',
            technicalTerm: 'XOR-encrypted target security PIDs submitted via IOCTL 0x81034000',
            tone: 'amber',
          },
          {
            storyTerm: 'Building core evicting every security officer',
            technicalTerm: 'Ring-0 ZwTerminateProcess killing Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, and MsMpEng.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Slamming padlocks across every file cabinet',
            technicalTerm: 'Uncontested ransomware mass encryption across the blinded enterprise host',
            tone: 'rose',
          },
          {
            storyTerm: 'Intruder dispatcher sending the hit list',
            technicalTerm: 'kill_svc.exe enumerating and feeding endpoint protection PIDs to mhyprot2.sys',
            tone: 'emerald',
          },
        ],
      },
    },
  };
