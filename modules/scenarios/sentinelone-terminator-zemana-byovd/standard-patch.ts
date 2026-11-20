import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar carrying a genuinely stamped security-vendor master badge bought from an underground broker. After dropping that legitimate badge into the building engine room, the burglar walks up to an unguarded badge-enrollment desk that forgets to check identity, writes their own badge number onto the VIP master roster, and then walks in an endless loop shutting off every security camera and guard station across the building.',
      storyMappings: [
        {
          storyTerm: 'Genuinely stamped security-vendor master badge',
          technicalTerm: 'Signed vulnerable Zemana AntiMalware kernel driver (zam64.sys)',
          tone: 'amber',
        },
        {
          storyTerm: 'Unguarded badge-enrollment desk',
          technicalTerm: 'Unauthenticated IOCTL 0x80002010 self-allowlisting flaw (CVE-2021-31728)',
          tone: 'sky',
        },
        {
          storyTerm: 'VIP master roster',
          technicalTerm: 'Internal zam64.sys trusted Process ID allowlist in kernel memory',
          tone: 'rose',
        },
        {
          storyTerm: 'Endless loop shutting off every guard station',
          technicalTerm: 'Continuous while(true) IOCTL 0x80002048 Ring-0 termination of 24 EDR agents',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding administrator keys, the burglar unpacks a genuinely signed third-party security driver, stamps a random cover name onto its tag so simple filename checklists overlook it, and plugs it straight into the building core engine room.',
        storyMappings: [
          {
            storyTerm: 'Genuinely signed third-party security driver',
            technicalTerm: 'Embedded zam64.sys validly signed by Zemana Ltd. and countersigned by Microsoft',
            tone: 'amber',
          },
          {
            storyTerm: 'Random cover name on the tag',
            technicalTerm: 'Randomized driver filename written under C:\\Windows\\System32\\drivers\\',
            tone: 'sky',
          },
          {
            storyTerm: 'Burglar carrying administrator keys',
            technicalTerm: 'Terminator.exe user-mode wrapper executing with local admin rights',
            tone: 'rose',
          },
          {
            storyTerm: 'Building core engine room',
            technicalTerm: 'Windows Ring-0 kernel driver space accepting the signed driver',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Even though the driver only obeys badge numbers written on its VIP security roster, its enrollment window never checks who is asking to be added. The burglar simply taps the enrollment code and writes their own badge number straight onto the VIP list.',
        storyMappings: [
          {
            storyTerm: 'VIP security roster',
            technicalTerm: 'Internal zam64.sys allowlist of authorized caller Process IDs',
            tone: 'amber',
          },
          {
            storyTerm: 'Enrollment window that never checks identity',
            technicalTerm: 'Unauthenticated IOCTL 0x80002010 exposed by \\\\.\\ZemanaAntiMalware (CVE-2021-31728)',
            tone: 'sky',
          },
          {
            storyTerm: 'Writing their own badge number onto the list',
            technicalTerm: 'Terminator.exe registering its own PID as a trusted kernel caller',
            tone: 'rose',
          },
          {
            storyTerm: 'Privileged master controls unlocked',
            technicalTerm: 'Arbitrary Ring-0 process termination and raw disk access granted to the caller',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable kernel ETW and EDR behavioral monitoring (low-level Windows kernel event tracing that watches device handle communications) alerting on any binary opening \\\\.\\ZemanaAntiMalware and sending IOCTL 0x80002010 (catching the exact CVE-2021-31728 self-allowlist abuse).',
      },
      3: {
        storyAnalogy:
          'Now accepted as a VIP security supervisor, the burglar paces the hallways in a relentless circle, comparing every guard uniform against a pocket hit-list of 24 known security agencies and flipping the master kill switch on every matching guard before they can sound the alarm.',
        storyMappings: [
          {
            storyTerm: 'Pacing the hallways in a relentless circle',
            technicalTerm: 'Infinite while(true) loop calling CreateToolhelp32Snapshot to scan active PIDs',
            tone: 'amber',
          },
          {
            storyTerm: 'Pocket hit-list of 24 security agencies',
            technicalTerm: 'Hardcoded array of 24 AV and EDR executable names targeted by Terminator.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Master kill switch',
            technicalTerm: 'IOCTL 0x80002048 invoking kernel-level process termination via zam64.sys',
            tone: 'rose',
          },
          {
            storyTerm: 'Silenced guard stations',
            technicalTerm: 'Terminated endpoint protection agents leaving the host defenseless',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enforce pre-execution blocking of zam64.sys via the Microsoft Vulnerable Driver Blocklist and HVCI driver-load policies (which reject known vulnerable driver hashes inside the kernel loader before any IOCTL device link can be created).',
      },
    },
  };
