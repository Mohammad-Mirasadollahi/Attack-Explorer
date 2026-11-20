import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an espionage operative who borrows the uniform of a trusted safety inspector to walk freely through a secure office. The operative places a counterfeit spare lens right beside the genuine scanner tool; while smoothly forwarding every legitimate command so the scanner keeps appearing normal, the counterfeit lens unscrambles a hidden spy radio purely inside live workspace and dials home right under the inspector\'s trusted badge.',
      storyMappings: [
        {
          storyTerm: 'Genuine safety inspector paired with a counterfeit spare lens',
          technicalTerm: 'Signed ESET Command-Line Scanner (ecls.exe) side-loading unsigned version.dll (CVE-2024-11859)',
          tone: 'amber',
        },
        {
          storyTerm: 'Forwarding legitimate commands while unscrambling a spy radio',
          technicalTerm: 'DLL export proxying while decrypting ToddyCat TCESB backdoor purely in memory',
          tone: 'sky',
        },
        {
          storyTerm: 'Dialing home under the inspector\'s trusted badge',
          technicalTerm: 'Standalone offline scanner ecls.exe initiating unexpected outbound TCP/443 C2 traffic',
          tone: 'rose',
        },
        {
          storyTerm: 'Catching the impostor module outside the official cabinet',
          technicalTerm: 'Sysmon EventID 7 flagging ecls.exe loading version.dll outside C:\\Windows\\System32',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dropping a legitimate, digitally signed security-scanner executable into a staging folder alongside a forged helper library wearing a standard system filename, the operative tricks the scanner into loading the attacker code first.',
        storyMappings: [
          {
            storyTerm: 'Digitally signed security-scanner executable',
            technicalTerm: 'Legitimate ESET Command-Line Scanner (ecls.exe) abused via CVE-2024-11859',
            tone: 'amber',
          },
          {
            storyTerm: 'Forged helper library wearing a standard system filename',
            technicalTerm: 'Malicious unsigned version.dll staged in the same directory as ecls.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Official system cabinet bypassed',
            technicalTerm: 'Windows DLL search order loading local version.dll ahead of C:\\Windows\\System32\\version.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Module load alarm',
            technicalTerm: 'Sysmon EventID 7 alerting on ecls.exe loading unsigned version.dll outside System32',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 7 (Image Loaded tracking DLL signatures and file paths) whenever signed ecls.exe loads an unsigned version.dll located outside C:\\Windows\\System32 (the exact CVE-2024-11859 ToddyCat DLL side-loading trigger).',
      },
      2: {
        storyAnalogy:
          'To keep the trusted scanner from crashing and drawing attention, the forged helper library acts like a polite relay mirror for every ordinary scanner call while quietly unwrapping the real encrypted espionage kit inside live working memory.',
        storyMappings: [
          {
            storyTerm: 'Polite relay mirror keeping the scanner alive',
            technicalTerm: 'DLL export proxying forwarding legitimate version.dll calls to the real System32 library',
            tone: 'amber',
          },
          {
            storyTerm: 'Quietly unwrapping the encrypted espionage kit in RAM',
            technicalTerm: 'In-memory decryption and execution of the ToddyCat TCESB passive backdoor',
            tone: 'sky',
          },
          {
            storyTerm: 'Clean signed process shell hiding malicious guts',
            technicalTerm: 'Malicious threads running inside the trusted ESET ecls.exe process image',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero decrypted spyware files on disk',
            technicalTerm: 'Encrypted companion payload preventing static antivirus identification',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Speaking outward through the internet wearing the trusted antivirus inspector badge, the hijacked offline scanner opens a covert encrypted phone line to the spy headquarters, giving away its cover because a standalone local scanner should never phone outside servers.',
        storyMappings: [
          {
            storyTerm: 'Hijacked offline scanner phoning outside headquarters',
            technicalTerm: 'ecls.exe establishing outbound encrypted TCP/443 C2 communications',
            tone: 'amber',
          },
          {
            storyTerm: 'Behavioral contradiction exposing the disguise',
            technicalTerm: 'Standalone command-line scanner initiating external internet network sockets',
            tone: 'sky',
          },
          {
            storyTerm: 'Network sensor recording the impossible call',
            technicalTerm: 'Sysmon EventID 3 (NetworkConnect) alerting on ecls.exe outbound TCP/443 traffic',
            tone: 'rose',
          },
          {
            storyTerm: 'Vendor fix locking the search order',
            technicalTerm: 'ESET CVE-2024-11859 patch enforcing LOAD_LIBRARY_SEARCH_SYSTEM32',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 3 (Network Connection recording process-to-IP egress) for standalone command-line scanner ecls.exe initiating outbound TCP/443 connections (a high-fidelity anomaly because local offline scanners should not beacon externally).',
      },
    },
  };
