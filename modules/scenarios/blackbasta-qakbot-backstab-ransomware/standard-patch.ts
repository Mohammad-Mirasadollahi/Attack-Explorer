import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar who jams a victim mailbox with thousands of junk flyers and then calls right away dressed as a helpful postal technician offering to fix the jam over a built-in home intercom. Once invited onto the desk, the fake technician flashes an outdated inspector badge to unplug the security alarm wires, wheels boxes of family records out the back door, shreds the spare backup notebooks, and snaps heavy padlocks onto every filing cabinet.',
      storyMappings: [
        {
          storyTerm: 'Jamming the mailbox and calling as a helpful technician',
          technicalTerm: 'Email bombing followed by external Microsoft Teams vishing and QuickAssist.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Outdated inspector badge unplugging security alarm wires',
          technicalTerm: 'Backstab BYOVD tool abusing signed PROCEXP.SYS to strip EDR handles',
          tone: 'sky',
        },
        {
          storyTerm: 'Wheeling boxes of records out the back door',
          technicalTerm: 'SoftPerfect network discovery and Rclone cloud data exfiltration',
          tone: 'rose',
        },
        {
          storyTerm: 'Shredding backup notebooks and padlocking every cabinet',
          technicalTerm: 'vssadmin delete shadows /all /quiet followed by ChaCha20/RSA-4096 (.basta) encryption',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In this scenario (T1566.004, Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)), the attacker follows one continuous arc: email Bombing, External Microsoft Teams Vishing, then backstab EDR Handle Killer, then vssadmin Shadow Wipe. Steps #1–#3 examine #1 Email Bombing, External Microsoft Teams Vishing; #2 Backstab EDR Handle Killer; #3 vssadmin Shadow Wipe. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
    },
    steps: {
      1: {
        storyAnalogy:
          'First, the intruder floods an employee office inbox with thousands of noisy junk circulars so the desk looks overwhelmed, then immediately rings the employee on an external office intercom posing as IT support and talks them into typing a six-digit remote-control code.',
        storyMappings: [
          {
            storyTerm: 'Thousands of noisy junk circulars flooding the inbox',
            technicalTerm: 'Automated SMTP email bombing via mass newsletter subscription forms',
            tone: 'amber',
          },
          {
            storyTerm: 'External office intercom posing as IT support',
            technicalTerm: 'External tenant Microsoft Teams chat and voice phishing by Storm-1811',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in remote-control code',
            technicalTerm: 'Windows QuickAssist.exe interactive remote screen-control session',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing email attachment scanners',
            technicalTerm: 'Human-authorized screen takeover requiring zero malicious email attachments',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate sudden inbound SMTP spam bursts (thousands of subscription confirmations in minutes) with external tenant Microsoft Teams calls and Sysmon EventID 1 (Process Creation) execution of QuickAssist.exe (exposing the Storm-1811 helpdesk pretext before payload staging).',
      },
      2: {
        storyAnalogy:
          'Taking control of the mouse straight through the remote-help window, the fake technician pulls down a toolbox, flashes an older officially signed maintenance badge to sever the office alarm monitors, scans every hallway for open file rooms, and ships confidential folders out through a hidden courier tunnel.',
        storyMappings: [
          {
            storyTerm: 'Pulling down a toolbox through the remote-help window',
            technicalTerm: 'QuickAssist.exe spawning curl.exe or msiexec.exe to stage payloads',
            tone: 'amber',
          },
          {
            storyTerm: 'Older signed maintenance badge severing alarm monitors',
            technicalTerm: 'backstab.exe loading signed PROCEXP.SYS to close EDR protected process handles',
            tone: 'sky',
          },
          {
            storyTerm: 'Scanning hallways for open file rooms',
            technicalTerm: 'SoftPerfect Network Scanner enumerating internal servers and SMB shares',
            tone: 'rose',
          },
          {
            storyTerm: 'Shipping confidential folders through a courier tunnel',
            technicalTerm: 'Rclone exfiltrating staged archives to attacker cloud storage',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation capturing parent-child trees) and EventID 6 (DriverLoaded logging kernel driver images) when QuickAssist.exe spawns cmd.exe, powershell.exe, or msiexec.exe and when backstab.exe loads signed PROCEXP.SYS (catching BYOVD EDR blinding).',
      },
      3: {
        storyAnalogy:
          'Spreading rapidly down every connected corridor, the intruder runs a shredder through every backup recovery ledger on every server and snaps strong double-keyed locks across every shared cabinet, leaving a printed ransom letter on every desk.',
        storyMappings: [
          {
            storyTerm: 'Spreading down every connected corridor',
            technicalTerm: 'Domain-wide lateral propagation using PsExec or WMI across enterprise hosts',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding every backup recovery ledger',
            technicalTerm: 'vssadmin.exe delete shadows /all /quiet wiping Volume Shadow Copies',
            tone: 'sky',
          },
          {
            storyTerm: 'Double-keyed locks across every cabinet',
            technicalTerm: 'Black Basta ChaCha20 stream encryption wrapped by RSA-4096 appending .basta',
            tone: 'rose',
          },
          {
            storyTerm: 'Printed ransom letter on every desk',
            technicalTerm: 'Dropped readme.faa.txt extortion note demanding payment for decryption',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure EDR behavioral prevention to block vssadmin.exe delete shadows /all /quiet (which destroys native Windows recovery snapshots) and trigger immediate containment on rapid .basta file renames paired with readme.faa.txt creation.',
      },
    },
  };
