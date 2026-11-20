import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a widely deployed corporate phone app whose own factory assembly line was infiltrated in a double supply-chain domino effect. Inside the legitimately signed installer, the spies slip a poisoned audio helper that unwraps a sealed parcel marked with a distinctive magic tag, fetches ordinary-looking icon pictures off a public shelf whose hidden trailing notes reveal the live command post, and silently steals browsing diaries before dropping a selective covert listening post on prized targets.',
      storyMappings: [
        {
          storyTerm: 'Poisoned audio helper inside a legitimately signed phone app',
          technicalTerm: 'Trojanized ffmpeg.dll side-loaded by signed 3CXDesktopApp.exe decrypting 0xFEEDFACE blob',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordinary icon pictures hiding secret server addresses in trailing notes',
          technicalTerm: 'Fetching icon1.ico..icon14.ico from GitHub IconStorages to decrypt C2 URLs',
          tone: 'sky',
        },
        {
          storyTerm: 'Silently reading browsing diaries and planting a selective listening post',
          technicalTerm: 'In-memory ICONICSTEALER credential/history theft and Gopuram backdoor deployment',
          tone: 'rose',
        },
        {
          storyTerm: 'Double supply-chain domino infiltration',
          technicalTerm: 'Lazarus (SmoothOperator) compromising Trading Technologies then 3CX build pipeline',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'When an employee launches the newly updated, vendor-signed desktop phone app, the app automatically loads its bundled poisoned audio helper, which pulls a hidden sealed block marked with a distinctive magic tag straight out of a companion drawer into live working space.',
        storyMappings: [
          {
            storyTerm: 'Vendor-signed desktop phone app',
            technicalTerm: 'Official signed 3CXDesktopApp.exe Electron application distributed to enterprise users',
            tone: 'amber',
          },
          {
            storyTerm: 'Bundled poisoned audio helper',
            technicalTerm: 'Trojanized ffmpeg.dll hijacking normal Electron media initialization',
            tone: 'sky',
          },
          {
            storyTerm: 'Sealed block marked with a distinctive magic tag',
            technicalTerm: 'RC4-encrypted shellcode blob prefixed by 0xFEEDFACE appended to d3dcompiler_47.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Unwrapping into live working space',
            technicalTerm: 'In-memory decryption staging the next-stage downloader without extra disk binaries',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'After waiting quietly for days to slip past impatient inspection labs, the hidden loader downloads innocent-looking small picture icons hosted on a public shelf, peeling encoded secret notes tucked at the very tail of each icon to discover which command tower is live today.',
        storyMappings: [
          {
            storyTerm: 'Innocent-looking small picture icons on a public shelf',
            technicalTerm: 'GitHub raw files raw.githubusercontent.com/IconStorages/images/main/icon1.ico..icon14.ico',
            tone: 'amber',
          },
          {
            storyTerm: 'Secret notes tucked at the tail of each icon',
            technicalTerm: 'Base64-encoded encrypted C2 URLs appended after the standard ICO image footer',
            tone: 'sky',
          },
          {
            storyTerm: 'Live command tower discovered dynamically',
            technicalTerm: 'Decrypted rotating attacker domains such as akamaicontainer.com',
            tone: 'rose',
          },
          {
            storyTerm: 'Blending with normal developer traffic',
            technicalTerm: 'Abusing trusted GitHub CDN infrastructure as a dead-drop resolver',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on DNS and proxy telemetry (or Sysmon EventID 22) showing 3CXDesktopApp.exe querying raw.githubusercontent.com/IconStorages/* or akamaicontainer.com (definitive network indicators of the SmoothOperator dead-drop stage).',
      },
      3: {
        storyAnalogy:
          'With its live command tower reached, the phone app launches a memory-only snooper that reads office browsing diaries to spot valuable finance staff, selectively deploying a durable covert spy post only onto prized victims.',
        storyMappings: [
          {
            storyTerm: 'Memory-only snooper inside the phone app',
            technicalTerm: 'ICONICSTEALER payload reading Chrome and Edge User Data\\Default\\History databases',
            tone: 'amber',
          },
          {
            storyTerm: 'Spotting prized finance and treasury targets',
            technicalTerm: 'Victim profiling filtering high-value organizations for second-stage follow-on',
            tone: 'sky',
          },
          {
            storyTerm: 'Durable covert spy post for select victims',
            technicalTerm: 'Kaspersky-documented Gopuram backdoor deployed selectively in memory',
            tone: 'rose',
          },
          {
            storyTerm: 'Unnatural file access giving the app away',
            technicalTerm: 'EDR alert flagging 3CXDesktopApp.exe reading unrelated browser History/Profile files',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor EDR file-access and memory telemetry (which logs cross-application credential and browser profile reads) for 3CXDesktopApp.exe reading Chrome or Edge User Data\\Default\\History files or loading unbacked Gopuram payloads in memory.',
      },
    },
  };
