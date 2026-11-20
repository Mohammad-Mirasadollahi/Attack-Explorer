import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an espionage operative who places two paired items inside a shared hallway closet: first, an authentic, officially stamped software-updater tool that guards wave right through, and second, a counterfeit spare part carrying the exact library name the updater automatically snaps on at startup. The moment the trusted updater wakes up, the counterfeit part decodes an encrypted data pouch purely inside live memory and quietly phones home riding right through the office\'s own outbound mail proxy.',
      storyMappings: [
        {
          storyTerm: 'Authentic officially stamped updater tool placed in a hallway closet',
          technicalTerm: 'Legitimate signed WinGUp (GUP.exe) or MsMpEng.exe staged under C:\\ProgramData\\',
          tone: 'amber',
        },
        {
          storyTerm: 'Counterfeit spare part carrying the expected library name',
          technicalTerm: 'Malicious unsigned side-loaded DLL placed alongside the signed executable',
          tone: 'sky',
        },
        {
          storyTerm: 'Decoding an encrypted data pouch purely in live memory',
          technicalTerm: 'API hashing and in-memory decryption of the chrysalis.dat shellcode blob',
          tone: 'rose',
        },
        {
          storyTerm: 'Phoning home right through the office outbound mail proxy',
          technicalTerm: 'HTTPS C2 beaconing inheriting enterprise proxy credentials from inside the signed binary',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inside a writable public utility drawer, the operative sets down a genuine, vendor-signed update helper right next to a rigged counterfeit plugin bearing the exact filename the helper blindly trusts and loads first.',
        storyMappings: [
          {
            storyTerm: 'Genuine vendor-signed update helper',
            technicalTerm: 'Signed GUP.exe (Notepad++ WinGUp) or MsMpEng.exe dropped into C:\\ProgramData\\',
            tone: 'amber',
          },
          {
            storyTerm: 'Rigged counterfeit plugin placed right beside it',
            technicalTerm: 'Unsigned malicious DLL hijacking the Windows DLL search order',
            tone: 'sky',
          },
          {
            storyTerm: 'Writable public utility drawer',
            technicalTerm: 'Non-standard execution directory outside C:\\Program Files\\',
            tone: 'rose',
          },
          {
            storyTerm: 'Borrowing the trusted uniform of a signed tool',
            technicalTerm: 'DLL Side-Loading (MITRE T1574.002) masking malware under a valid vendor signature',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Instead of spelling out its tool list in plain English where inspection tools could read it, the loaded counterfeit plugin looks up every system helper using secret numeric nicknames, unscrambles a companion data pouch straight inside working memory, and wakes up the main spy implant.',
        storyMappings: [
          {
            storyTerm: 'Looking up system helpers using secret numeric nicknames',
            technicalTerm: 'Dynamic API hashing concealing Win32 imports from static PE analysis',
            tone: 'amber',
          },
          {
            storyTerm: 'Unscrambling a companion data pouch inside memory',
            technicalTerm: 'In-memory decryption of the companion chrysalis.dat encrypted shellcode blob',
            tone: 'sky',
          },
          {
            storyTerm: 'Waking up the main spy implant',
            technicalTerm: 'Executing the decrypted Chrysalis / Elise espionage backdoor directly from RAM',
            tone: 'rose',
          },
          {
            storyTerm: 'Keeping the real engine encrypted while resting on disk',
            technicalTerm: 'Splitting loader and encrypted blob to defeat static antivirus signatures',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To stay anchored after morning reboots and slip smoothly past strict corporate gatekeepers, the active implant registers a quiet startup entry and routes its encrypted web check-ins directly through the company\'s own authenticated internet proxy.',
        storyMappings: [
          {
            storyTerm: 'Quiet startup anchor surviving morning reboots',
            technicalTerm: 'Registry Run key or scheduled task relaunching the signed side-load host',
            tone: 'amber',
          },
          {
            storyTerm: 'Riding straight through the company authenticated proxy',
            technicalTerm: 'WinHTTP / WinINet HTTPS C2 beaconing automatically inheriting corporate proxy auth',
            tone: 'sky',
          },
          {
            storyTerm: 'Suspicious sign catching the disguise',
            technicalTerm: 'Signed binary running from C:\\ProgramData\\ with an unsigned DLL making external HTTPS calls',
            tone: 'rose',
          },
          {
            storyTerm: 'Network sensor logging the covert beacon',
            technicalTerm: 'Sysmon EventID 3 outbound TCP/443 alert correlated with EventID 7 unsigned DLL load',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 3 (Network Connection tracking process-level egress) with EventID 7 (Image Loaded) alerting on outbound HTTPS connections from a signed binary executing out of C:\\ProgramData\\ that has loaded an unsigned side-loaded DLL (pinpointing Lotus Blossom Chrysalis C2).',
      },
    },
  };
