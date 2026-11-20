import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar crew that lures an office worker into calling a fake subscription-cancellation hotline so the worker willingly installs a remote-support doorway, threads a quiet reverse tunnel back to the crew hideout, uses the building own gentle maintenance-restart clerk to ask busy workers to let go of locked ledgers politely, and then locks an operator-chosen percentage of every file across the building at blistering speed.',
      storyMappings: [
        {
          storyTerm: 'Fake cancellation hotline tricking a worker into opening a remote doorway',
          technicalTerm: 'Callback phishing / BatLoader delivering commercial RMM and Chisel reverse tunnel',
          tone: 'amber',
        },
        {
          storyTerm: 'Building gentle maintenance-restart clerk releasing locked ledgers',
          technicalTerm: 'Windows Restart Manager API (RstrtMgr.dll) closing processes holding open file handles',
          tone: 'sky',
        },
        {
          storyTerm: 'Shredding backup recovery binders first',
          technicalTerm: 'vssadmin.exe Volume Shadow Copy deletion prior to encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Locking an operator-chosen percentage of every file across parallel lanes',
          technicalTerm: 'OpenSSL AES-256-CBC partial encryption controlled by -ep percentage over 2x-CPU IOCP threads',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending an alarming fake renewal invoice that begs the employee to call a help desk immediately, the crew talks the employee into installing a commercial remote-management intercom and opens a quiet reverse tunnel straight into the corporate lobby.',
        storyMappings: [
          {
            storyTerm: 'Alarming fake renewal invoice urging a phone call',
            technicalTerm: 'Subscription-cancellation callback phishing (TOAD) or trojanized BatLoader SEO lure',
            tone: 'amber',
          },
          {
            storyTerm: 'Commercial remote-management intercom',
            technicalTerm: 'Legitimate RMM tools (AnyDesk, Atera, ScreenConnect) abused for hands-on access',
            tone: 'sky',
          },
          {
            storyTerm: 'Quiet reverse tunnel back to the hideout',
            technicalTerm: 'Chisel encrypted SOCKS reverse tunnel traversing corporate egress firewalls',
            tone: 'rose',
          },
          {
            storyTerm: 'Blending with routine helpdesk work',
            technicalTerm: 'Signed commercial remote-control software evading basic malware blocklists',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When ready to strike, the crew destroys all backup snapshots and calls upon the building built-in software-update clerk to politely tap every open database and document editor on the shoulder, forcing them to drop their locks on open files so nothing escapes encryption.',
        storyMappings: [
          {
            storyTerm: 'Destroying all backup snapshots',
            technicalTerm: 'vssadmin.exe delete shadows wiping Windows recovery points',
            tone: 'amber',
          },
          {
            storyTerm: 'Building built-in software-update clerk',
            technicalTerm: 'Windows Restart Manager API (RstrtMgr.dll RmStartSession / RmShutdown)',
            tone: 'sky',
          },
          {
            storyTerm: 'Forcing open editors and databases to drop their file locks',
            technicalTerm: 'Graceful termination of processes holding exclusive handles on target files',
            tone: 'rose',
          },
          {
            storyTerm: 'Custom operator job switch',
            technicalTerm: 'Command-line flags royal.exe -id <32_char_id> -ep 50 configuring encryption depth',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Spinning up twice as many parallel locksmith lanes as the building has processor cores, the crew races across local cabinets and shared network hallways locking only the exact percentage of each large file requested by the operator, finishing the entire building before responders can pull the plug.',
        storyMappings: [
          {
            storyTerm: 'Twice as many parallel locksmith lanes as processor cores',
            technicalTerm: 'Multi-threaded I/O Completion Port (IOCP) worker queue sized at 2x CPU core count',
            tone: 'amber',
          },
          {
            storyTerm: 'Exact operator-chosen percentage of each large file',
            technicalTerm: 'Configurable -ep partial encryption mode speeding corruption of huge files',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in standard steel padlock library',
            technicalTerm: 'Statically linked OpenSSL AES-256-CBC routines wrapped with RSA public key',
            tone: 'rose',
          },
          {
            storyTerm: 'Sweeping across both local cabinets and shared hallways',
            technicalTerm: 'Simultaneous encryption of local drives and reachable SMB network shares',
            tone: 'emerald',
          },
        ],
      },
    },
  };
