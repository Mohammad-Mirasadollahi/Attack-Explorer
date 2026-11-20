import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who posts a recurring work shift onto the building official wall calendar, then sneaks back with supreme master keys to rip off the permission label from that calendar index card so the public shift viewer becomes blind and refuses to list the job. Despite the clever invisibility trick, forensic investigators walk straight into the back-room task drawer where the full execution card and execution logbook remain completely intact.',
      storyMappings: [
        {
          storyTerm: 'Posting a recurring shift onto the building wall calendar',
          technicalTerm: 'schtasks /create generating C:\\Windows\\System32\\Tasks XML and EventID 4698',
          tone: 'amber',
        },
        {
          storyTerm: 'Ripping off the permission label so the public shift viewer goes blind',
          technicalTerm: 'Tarrask evasion deleting the TaskCache\\Tree\\<Task> SD registry value as SYSTEM',
          tone: 'sky',
        },
        {
          storyTerm: 'Back-room task drawer keeping the full execution card intact',
          technicalTerm: 'Forensic recovery from HKLM\\...\\TaskCache\\Tasks\\{GUID}\\Actions and TaskScheduler logs',
          tone: 'rose',
        },
        {
          storyTerm: 'Registry guard noticing the ripped permission label',
          technicalTerm: 'Sysmon EventID 12 / 13 / 14 alerting on TaskCache\\Tree SD deletion',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Registering a recurring maintenance task to relaunch their backdoor daily, the intruder writes an XML shift blueprint into the official Tasks folder while the security ledger stamps a detailed birth certificate.',
        storyMappings: [
          {
            storyTerm: 'Official Tasks folder holding shift blueprints',
            technicalTerm: 'XML task definition created under C:\\Windows\\System32\\Tasks\\',
            tone: 'amber',
          },
          {
            storyTerm: 'Detailed birth certificate in the security ledger',
            technicalTerm: 'Windows Security EventID 4698 (A scheduled task was created) containing raw XML',
            tone: 'sky',
          },
          {
            storyTerm: 'Scheduler engine operational diary',
            technicalTerm: 'TaskScheduler/Operational EventID 106 recording task registration',
            tone: 'rose',
          },
          {
            storyTerm: 'Recurring execution persistence',
            technicalTerm: 'Scheduled task configured to launch attacker payload on logon or timer',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Employing the stealthy Tarrask hiding trick with SYSTEM keys, the intruder deletes the Security Descriptor stamp from the task index card in the registry. Immediately, standard shift-listing commands skip right over the ghost task while the scheduler still faithfully runs it.',
        storyMappings: [
          {
            storyTerm: 'Deleting the Security Descriptor stamp from the index card',
            technicalTerm: 'Removing the SD binary value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\<Name>',
            tone: 'amber',
          },
          {
            storyTerm: 'Standard shift-listing tools skipping the ghost task',
            technicalTerm: 'schtasks /query and Task Scheduler GUI failing to display tasks lacking an SD value',
            tone: 'sky',
          },
          {
            storyTerm: 'Scheduler still running the ghost job faithfully',
            technicalTerm: 'Underlying TaskCache\\Tasks\\{GUID} entry remaining active and executable',
            tone: 'rose',
          },
          {
            storyTerm: 'Registry alarm catching the stealth cover-up',
            technicalTerm: 'Sysmon EventID 12/14 flagging deletion of the TaskCache\\Tree SD registry value',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Skipping the fooled front-desk viewer completely, forensic detectives open the raw registry master drawer indexed by unique task IDs and reconstruct the exact hidden command line and run history from the untouched back-room records.',
        storyMappings: [
          {
            storyTerm: 'Raw registry master drawer indexed by unique IDs',
            technicalTerm: 'HKLM\\...\\Schedule\\TaskCache\\Tasks\\{GUID}\\Actions binary registry value',
            tone: 'amber',
          },
          {
            storyTerm: 'Comparing the index shelf against the raw drawer',
            technicalTerm: 'Detecting ghost tasks present in TaskCache\\Tasks whose Tree subkey lacks an SD value',
            tone: 'sky',
          },
          {
            storyTerm: 'Execution logbook recording every hidden launch',
            technicalTerm: 'TaskScheduler/Operational EventID 200 (Action started) and EventID 201 (Completed)',
            tone: 'rose',
          },
          {
            storyTerm: 'Complete forensic recovery despite anti-forensics',
            technicalTerm: 'Extracting exact binary path, arguments, and execution timestamps for eradicated ghost tasks',
            tone: 'emerald',
          },
        ],
      },
    },
  };
