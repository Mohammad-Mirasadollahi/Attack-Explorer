import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-schtasks-xml-registry-taskcache-forensics',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for Microsoft MSTIC & SANS DFIR, Scheduled Task Creation & TaskCache SD Descriptor Deletion (EventID 4698 / Sysmon EID 12)',
          storyAnalogy: 'Imagine an intruder who posts a recurring work shift onto the building official wall calendar, then sneaks back with supreme master keys to rip off the permission label from that calendar index card so the public shift viewer becomes blind and refuses to list the job. Despite the clever invisibility trick, forensic investigators walk straight into the back-room task drawer where the full execution card and execution logbook remain completely intact.',
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
          plainSummary: 'In this DFIR walkthrough (MITRE T1053.005 on a compromised Windows server), an adversary registers a SYSTEM scheduled task that launches a payload on a timer, then uses the Tarrask technique to peel the TaskCache index label so schtasks and the Task Scheduler GUI no longer list the job while the engine still runs it. Steps #1 cover lawful task creation logs and on-disk XML, Step #2 covers registry SD deletion and Sysmon alerts, and Step #3 recovers the hidden command line from TaskCache Tasks GUID storage and TaskScheduler run history. Primary detection pivots on pairing Security EventID 4698 with Sysmon registry delete events under TaskCache Tree and hunting GUID-only tasks missing Tree SD values.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Attacker Admin Session), Node ② (RPC ITaskSchedulerService), Node ③ (svchost.exe , Schedule Service), Node ④ (Runtime Process & Artifact Context), Node ⑤ (TaskCache\\Tree SD Registry Key), and Node ⑥ (Security EID 4698 & Sysmon EID 12) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Microsoft MSTIC Tarrask Research, Microsoft Security Auditing EventID 4698 & SANS DFIR Windows Forensics',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1053.005',
              plainTitle: 'Scheduled Task Registration & XML Artifact Creation (Security EventID 4698 & TaskScheduler 106)',
              storyAnalogy: 'Registering a recurring maintenance task to relaunch their backdoor daily, the intruder writes an XML shift blueprint into the official Tasks folder while the security ledger stamps a detailed birth certificate.',
              simpleExplanation: 'The attacker executes schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM. Windows Security EventID 4698 captures the full embedded TaskContent XML, while svchost.exe writes the XML definition to C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync (logged in WinEvent Event 4698 with EventID=4698 , Security / 106 , TaskScheduler/Operational, TaskName=\\Microsoft\\Windows\\NetTrace\\TelemetrySync, PrincipalSid=S-1-5-18 , NT AUTHORITY\\SYSTEM, ExecCommand=C:\\ProgramData\\sync.exe so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM (which Calls the Windows Task Scheduler CLI , schtasks.exe or ITaskService RPC interface to register, modify, or execute a scheduled task XML definition u so that establishes recurring execution persistence , T1053.005 during "Scheduled Task Registration & XML Artifact Creation , Security EventID 4698 & TaskScheduler 106" under SYSTEM or privileged account authority so the implant automatically respawns on schedule, boot, or user logon). Next, the follow-up artifact Security EventID 4698: A scheduled task was created (embeds full <Task> XML) runs (which Calls the Windows Task Scheduler CLI , schtasks.exe or ITaskService RPC interface to register, modify, or execute a scheduled task XML definition u so that establishes recurring execution persistence , T1053.005 during "Scheduled Task Registration & XML Artifact Creation , Security EventID 4698 & TaskScheduler 106" under SYSTEM or privileged account authority so the implant automatically respawns on schedule, boot, or user logon).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Attacker Admin Session and RPC ITaskSchedulerService toward svchost.exe , Schedule Service and Security EID 4698 & Sysmon EID 12.',
              detectionAndEvidence: 'Documented in WinEvent Event 4698 (recording EventID=4698 , Security / 106 , TaskScheduler/Operational, TaskName=\\Microsoft\\Windows\\NetTrace\\TelemetrySync, PrincipalSid=S-1-5-18 , NT AUTHORITY\\SYSTEM, ExecCommand=C:\\ProgramData\\sync.exe under T1053.005): Enable Audit Other Object Access Events (Success/Failure) so Windows Security EventID 4698 (Task Created) and EventID 4702 (Task Updated) log the complete XML payload.',
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
          {
              stepNumber: 2,
              mitreId: 'T1564',
              plainTitle: 'Tarrask Evasion, Deleting TaskCache\\Tree SD Value as SYSTEM (Sysmon EventID 12)',
              storyAnalogy: 'Employing the stealthy Tarrask hiding trick with SYSTEM keys, the intruder deletes the Security Descriptor stamp from the task index card in the registry. Immediately, standard shift-listing commands skip right over the ghost task while the scheduler still faithfully runs it.',
              simpleExplanation: 'Following the technique documented by Microsoft MSTIC (Hafnium / Tarrask), the attacker elevates to NT AUTHORITY\\SYSTEM (to satisfy TrustedInstaller/SYSTEM ACLs on the Schedule key) and deletes the "SD" (Security Descriptor) binary value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync and removes the XML file on disk, rendering the task invisible to schtasks /query while keeping it active in TaskCache\\Tasks\\{GUID} (logged in Sysmon Event 12 with EventID=12 , Sysmon RegistryEvent DeleteValue, TargetObject=HKLM\\...\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync\\SD, EvasionEffect=Hides task from schtasks.exe /query and Taskschd.msc GUI, ResidualArtifact=HKLM\\...\\Schedule\\TaskCache\\Tasks\\{GUID}\\Actions so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes reg.exe delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /v SD /f (which Runs reg.exe delete , or NtDeleteValueKey to strip a specific registry key or security descriptor value , such as the TaskCache\\Tree SD value from so that manipulates persistent Windows Registry configuration or credential material , T1564 during "Tarrask Evasion, Deleting TaskCache\\Tree SD Value as SYSTEM , Sysmon EventID 12" to establish persistence, alter system behavior, or harvest secrets). Next, the follow-up artifact del /f /q "C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync" runs (which executes the technical command / telemetry directive , del /f /q "C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync" via System / so that advances the scenario kill-chain under MITRE T1564 during "Tarrask Evasion, Deleting TaskCache\\Tree SD Value as SYSTEM , Sysmon EventID 12" , Following the technique documented by Microsoft MSTIC , Hafnium / Tarrask, the attacker elevates to NT AUTHORITY\\SYSTEM , to satisfy TrustedInstaller/SYSTEM ACLs on the Schedule key and deletes the "SD" , Security Descriptor binary value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync and removes the XML file on disk, rendering the task invisible to schtasks /query while keeping it active in TaskCache\\Tasks\\{GUID} while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Attacker Admin Session and RPC ITaskSchedulerService toward svchost.exe , Schedule Service and Security EID 4698 & Sysmon EID 12.',
              detectionAndEvidence: 'Documented in Sysmon Event 12 (recording EventID=12 , Sysmon RegistryEvent DeleteValue, TargetObject=HKLM\\...\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync\\SD, EvasionEffect=Hides task from schtasks.exe /query and Taskschd.msc GUI, ResidualArtifact=HKLM\\...\\Schedule\\TaskCache\\Tasks\\{GUID}\\Actions under T1564): Alert on Sysmon EventID 12 (RegistryObjectAddedOrDeleted) or Security EventID 4657 where TargetObject ends with \\Schedule\\TaskCache\\Tree\\*\\SD and EventType is DeleteValue.',
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
          {
              stepNumber: 3,
              mitreId: 'T1053.005',
              plainTitle: 'Forensic Recovery from TaskCache\\Tasks\\{GUID}\\Actions & TaskScheduler EventID 200',
              storyAnalogy: 'Skipping the fooled front-desk viewer completely, forensic detectives open the raw registry master drawer indexed by unique task IDs and reconstruct the exact hidden command line and run history from the untouched back-room records.',
              simpleExplanation: 'Even after the SD value and XML file are deleted, the Task Scheduler service continues executing the task every 15 minutes (logging TaskScheduler EventID 200 Action Started) because the binary Actions blob (starting with 0x0300 magic version header) and DynamicInfo timestamps remain intact under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\{GUID} (logged in WinEvent Event 200 with LogChannel=Microsoft-Windows-TaskScheduler/Operational, EventID=200 , Action Executed, TaskRegistryKey=HKLM\\...\\Schedule\\TaskCache\\Tasks\\{91F0C421-3812-4A99-8231-001122334455}, BinaryActionsBlob=03 00 ... C:\\ProgramData\\sync.exe , UTF-16LE so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\*" | Select-Object URI, Actions, DynamicInfo (which Calls the Windows Task Scheduler CLI , schtasks.exe or ITaskService RPC interface to register, modify, or execute a scheduled task XML definition u so that establishes recurring execution persistence , T1053.005 during "Forensic Recovery from TaskCache\\Tasks\\{GUID}\\Actions & TaskScheduler EventID 200" under SYSTEM or privileged account authority so the implant automatically respawns on schedule, boot, or user logon). Next, the follow-up artifact TaskScheduler/Operational EventID 200: Task "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" launched action "C:\\ProgramData\\sync.exe" runs (which executes the technical command / telemetry directive , TaskScheduler/Operational EventID 200: Task "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" laun so that advances the scenario kill-chain under MITRE T1053.005 during "Forensic Recovery from TaskCache\\Tasks\\{GUID}\\Actions & TaskScheduler EventID 200" , Even after the SD value and XML file are deleted, the Task Scheduler service continues executing the task every 15 minutes , logging TaskScheduler EventID 200 Action Started because the binary Actions blob , starting with 0x0300 magic version header and DynamicInfo timestamps remain intact under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\{GUID} while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Attacker Admin Session and RPC ITaskSchedulerService toward svchost.exe , Schedule Service and Security EID 4698 & Sysmon EID 12.',
              detectionAndEvidence: 'Documented in WinEvent Event 200 (recording LogChannel=Microsoft-Windows-TaskScheduler/Operational, EventID=200 , Action Executed, TaskRegistryKey=HKLM\\...\\Schedule\\TaskCache\\Tasks\\{91F0C421-3812-4A99-8231-001122334455}, BinaryActionsBlob=03 00 ... C:\\ProgramData\\sync.exe , UTF-16LE under T1053.005): Cross-reference all entries under TaskCache\\Tree against the presence of an SD value and parse the binary Actions value in TaskCache\\Tasks\\{GUID} during incident response.',
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
        ],
    };
