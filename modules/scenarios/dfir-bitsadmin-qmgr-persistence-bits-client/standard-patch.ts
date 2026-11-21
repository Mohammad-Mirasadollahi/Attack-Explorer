import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who abuses the building own patient overnight parcel-delivery courier to stay permanently inside the estate. First, the intruder registers an official background delivery job to fetch a remote parcel; second, they staple a secret post-delivery instruction card onto the parcel receipt telling the courier what program to launch the instant the box lands; third, once the parcel finishes arriving, the trusted system service host runs the intruder program automatically even across reboots.',
      storyMappings: [
        {
          storyTerm: 'Registering an official overnight parcel-delivery job',
          technicalTerm: 'bitsadmin /create and /addfile logged by Bits-Client Operational EventID 3 and 59',
          tone: 'amber',
        },
        {
          storyTerm: 'Stapling a secret post-delivery launch card onto the receipt',
          technicalTerm: 'bitsadmin /SetNotifyCmdLine serialized into persistent qmgr.db ESE database',
          tone: 'sky',
        },
        {
          storyTerm: 'Trusted system service launching the payload upon delivery',
          technicalTerm: 'Bits-Client EventID 60 completion triggering svchost.exe (-s BITS) child execution',
          tone: 'rose',
        },
        {
          storyTerm: 'Courier job ledger surviving reboots and outages',
          technicalTerm: 'C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db forensic artifact',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the background delivery desk, the intruder schedules a new polite idle-time transfer job pointed at a remote web warehouse so the operating system itself quietly downloads the payload in the background.',
        storyMappings: [
          {
            storyTerm: 'Background delivery desk',
            technicalTerm: 'Windows Background Intelligent Transfer Service (BITS) managed via bitsadmin / PowerShell',
            tone: 'amber',
          },
          {
            storyTerm: 'Scheduling a polite idle-time transfer job',
            technicalTerm: 'bitsadmin /create and /addfile queuing a remote HTTP payload download',
            tone: 'sky',
          },
          {
            storyTerm: 'Delivery desk diary recording job creation',
            technicalTerm: 'Microsoft-Windows-Bits-Client/Operational EventID 3 (Job Created) and EventID 59 (Transfer Started)',
            tone: 'rose',
          },
          {
            storyTerm: 'Blending with normal Windows Update traffic',
            technicalTerm: 'Native svchost.exe outbound HTTP downloads bypassing per-process firewall blocks',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Before starting the delivery truck, the intruder attaches a hidden completion-notification order straight onto the job slip, writing their malicious executable command permanently into the delivery service master database file.',
        storyMappings: [
          {
            storyTerm: 'Hidden completion-notification order on the job slip',
            technicalTerm: 'bitsadmin /SetNotifyCmdLine specifying an arbitrary binary to run when transfer ends',
            tone: 'amber',
          },
          {
            storyTerm: 'Delivery service master database file',
            technicalTerm: 'ESE database C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db (or qmgr0.dat)',
            tone: 'sky',
          },
          {
            storyTerm: 'Surviving network drops and machine restarts',
            technicalTerm: 'BITS automatically resuming queued jobs and firing notify commands across reboots',
            tone: 'rose',
          },
          {
            storyTerm: 'Forensic parser reading dormant traps',
            technicalTerm: 'Offline parsing of qmgr.db exposing URLs, local paths, and SetNotifyCmdLine payloads',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The moment the parcel touches down on disk, the delivery service stamps the job complete and its own trusted system host process immediately executes the stapled command line. Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced prop has one explicit job.',
        storyMappings: [
          {
            storyTerm: 'Stamping the delivery job complete',
            technicalTerm: 'Bits-Client/Operational EventID 60 recording job completion and transferred bytes',
            tone: 'amber',
          },
          {
            storyTerm: 'Trusted system host executing the stapled command',
            technicalTerm: 'svchost.exe (-k netsvcs -p -s BITS) spawning the attacker child process',
            tone: 'sky',
          },
          {
            storyTerm: 'High-signal anomalous parent-child tree',
            technicalTerm: 'Sysmon EventID 1 catching BITS svchost.exe launching cmd.exe, regsvr32.exe, or payload EXE',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing persistent rogue deliveries',
            technicalTerm: 'Running bitsadmin /list /allusers /verbose and canceling unauthorized transfer jobs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
