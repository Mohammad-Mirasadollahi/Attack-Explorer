import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar who breaks into a bank security booth right before leaving and rips out every single page from every logbook on the shelf. Unbeknownst to the burglar, the moment the security logbook is ripped empty, an automatic brass stamper permanently embosses a fresh Page One declaring exactly who emptied the book and at what second, while the building master floor-tile register still keeps carbon impressions of every ripped page underneath.',
      storyMappings: [
        {
          storyTerm: 'Ripping out every single page from every logbook on the shelf',
          technicalTerm: 'wevtutil.exe el loop executing wevtutil.exe cl across all Windows EVTX channels',
          tone: 'amber',
        },
        {
          storyTerm: 'Automatic brass stamper embossing a fresh Page One receipt',
          technicalTerm: 'Immutable Security EventID 1102 and System EventID 104 audit log cleared records',
          tone: 'sky',
        },
        {
          storyTerm: 'Building master floor-tile register logging the destruction',
          technicalTerm: 'NTFS Change Journal ($Extend\\$UsnJrnl:$J) recording USN_REASON_DATA_TRUNCATION',
          tone: 'rose',
        },
        {
          storyTerm: 'Carbon impressions recovered from beneath the floor tiles',
          technicalTerm: 'Carving deleted EVTX XML chunks from unallocated disk clusters during forensics',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Trying to cover their tracks right before slipping out the door, the intruder runs an automated sweeper that lists every single diary binder on the building shelf and commands the event clerk to wipe them clean one by one.',
        storyMappings: [
          {
            storyTerm: 'Automated sweeper listing every diary binder',
            technicalTerm: 'cmd.exe /c for /F %i in (wevtutil.exe el) do wevtutil.exe cl %i',
            tone: 'amber',
          },
          {
            storyTerm: 'Commanding the event clerk to wipe each binder',
            technicalTerm: 'Native Windows utility wevtutil.exe cl invoking EvtClearLog across channels',
            tone: 'sky',
          },
          {
            storyTerm: 'Security camera catching the sweeper command line',
            technicalTerm: 'Sysmon EventID 1 (Process Creation) recording the exact wevtutil loop before clear',
            tone: 'rose',
          },
          {
            storyTerm: 'Anti-forensic trace erasure attempt',
            technicalTerm: 'MITRE ATT&CK T1070.001 indicator removal on Windows hosts',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The instant the event clerk empties the master Security binder or System binder, the operating system refuses to leave the binder truly blank and immediately stamps a single unforgeable first entry naming the exact badge holder and timestamp of the erasure.',
        storyMappings: [
          {
            storyTerm: 'Event clerk emptying the binder files',
            technicalTerm: 'svchost.exe (-s EventLog) calling EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\',
            tone: 'amber',
          },
          {
            storyTerm: 'Unforgeable Page One stamp in the Security binder',
            technicalTerm: 'Windows Security EventID 1102 (The audit log was cleared) naming SubjectUserName',
            tone: 'sky',
          },
          {
            storyTerm: 'Unforgeable Page One stamp in the System binder',
            technicalTerm: 'Windows System EventID 104 (The log file was cleared) naming the cleared channel',
            tone: 'rose',
          },
          {
            storyTerm: 'Central SIEM vault keeping copies untouched',
            technicalTerm: 'Real-time log forwarding preserving pre-clear logs off the compromised host',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even after the binders appear empty on the desk, a skilled forensic investigator checks the building automatic paper-movement ledger showing the exact truncation event and gently lifts intact torn log scraps straight out of the unallocated storage bin underneath.',
        storyMappings: [
          {
            storyTerm: 'Automatic paper-movement ledger',
            technicalTerm: 'NTFS Change Journal ($Extend\\$UsnJrnl:$J) logging USN_REASON_DATA_TRUNCATION',
            tone: 'amber',
          },
          {
            storyTerm: 'Intact torn log scraps in the storage bin underneath',
            technicalTerm: 'Deleted 64KB ElfChnk EVTX chunks still residing in unallocated NTFS disk space',
            tone: 'sky',
          },
          {
            storyTerm: 'Gently lifting and reassembling the scraps',
            technicalTerm: 'Raw disk carving tools recovering cleared binary XML event records',
            tone: 'rose',
          },
          {
            storyTerm: 'Proving deliberate cover-up with exact timestamps',
            technicalTerm: 'Correlating $UsnJrnl timestamps against EventID 1102 and carved pre-wipe logs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
