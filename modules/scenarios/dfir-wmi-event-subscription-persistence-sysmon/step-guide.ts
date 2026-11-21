import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-wmi-event-subscription-persistence-sysmon',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for Microsoft Sysmon & Mandiant DFIR, WMI Permanent Event Subscription Persistence (EventID 19 / 20 / 21)',
          storyAnalogy: 'Imagine an intruder who skips obvious lobby sign-in boards and instead wires a three-piece hidden mousetrap straight inside the building central plumbing blueprint cabinet. Piece one is a tripwire watching for morning startup chimes; piece two is a hidden spring-loaded command card; piece three is a brass clasp tying the tripwire to the command card so every time the building wakes up, the building own maintenance supervisor launches the intruder payload with master keys.',
          storyMappings: [
              {
                  storyTerm: 'Piece one: tripwire watching for morning startup chimes',
                  technicalTerm: 'WMI __EventFilter WQL query trigger logged by Sysmon EventID 19',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Piece two: hidden spring-loaded command card',
                  technicalTerm: 'WMI CommandLineEventConsumer stored in OBJECTS.DATA logged by Sysmon EventID 20',
                  tone: 'sky',
                },
              {
                  storyTerm: 'Piece three: brass clasp tying tripwire to command card',
                  technicalTerm: 'WMI __FilterToConsumerBinding link logged by Sysmon EventID 21',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Building maintenance supervisor launching the payload with master keys',
                  technicalTerm: 'wmiprvse.exe or scrcons.exe executing the consumer payload as NT AUTHORITY\\SYSTEM',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'In this scenario (T1546.003, Microsoft Sysmon & Mandiant DFIR - WMI Permanent Event Subscription Persistence (EventID 19 / 20 / 21)), the attacker follows one continuous arc: wMI __EventFilter WQL Trigger Registration, then commandLineEventConsumer, then sYSTEM Payload Execution Under wmiprvse.exe /. Steps #1–#3 examine #1 WMI __EventFilter WQL Trigger Registration; #2 CommandLineEventConsumer; #3 SYSTEM Payload Execution Under wmiprvse.exe /. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 19 with the documented host and network chain.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Elevated PowerShell Session), Node ② (Winmgmt / WMI Core Service), Node ③ (OBJECTS.DATA CIM Repository), Node ④ (Runtime Process & Artifact Context), Node ⑤ (scrcons.exe / wmiprvse.exe), and Node ⑥ (Sysmon EID 19/20/21 & WMI Log) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Microsoft Sysinternals Sysmon v15 (EventID 19/20/21), Mandiant WMI Forensics Whitepaper & MITRE ATT&CK T1546.003',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1546.003',
              plainTitle: 'WMI __EventFilter WQL Trigger Registration (Sysmon EventID 19)',
              storyAnalogy: 'Opening the building internal automation cabinet, the intruder installs an invisible electronic tripwire tuned to fire automatically whenever the system finishes booting or a specific clock interval strikes.',
              simpleExplanation: 'Using PowerShell Set-WmiInstance or mofcomp.exe, the attacker creates a permanent __EventFilter instance in the root\\subscription CIM namespace with a WQL polling query (SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA "Win32_PerfFormattedData_PerfOS_System"). Sysmon EventID 19 (WmiEventFilter activity detected) logs the exact Query and EventNamespace (logged in Sysmon Event 19 with EventID=19 , Sysmon WmiEventFilter, Namespace=root\\subscription, FilterName=SCMUpdaterFilter, WqlQuery=SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA Win32_PerfFormattedData_PerfOS_System so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes Set-WmiInstance -Namespace root\\subscription -Class __EventFilter -Arguments @{Name="SCMUpdaterFilter"; EventNamespace="root\\cimv2"; QueryLanguage="WQL"; Query="SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA \'Win32_PerfFormattedData_PerfOS_System\'"} (which Registers permanent WMI MOF class instances , __EventFilter WQL trigger, CommandLineEventConsumer payload, and __FilterToConsumerBinding link insid so that creates fileless, repository-backed SYSTEM persistence , T1546.003 during "WMI __EventFilter WQL Trigger Registration , Sysmon EventID 19" that runs outside normal Startup folders and Services lists, detectable via Sysmon EventID 19, 20, and 21 and WMI-Activity EventID 5861). Next, the follow-up artifact Sysmon EventID 19: Operation=Created EventNamespace=root\\cimv2 Name=SCMUpdaterFilter runs (which executes the technical command / telemetry directive , Sysmon EventID 19: Operation=Created EventNamespace=root\\cimv2 Name=SCMUpdaterFilter via Sys so that advances the scenario kill-chain under MITRE T1546.003 during "WMI __EventFilter WQL Trigger Registration , Sysmon EventID 19" , Using PowerShell Set-WmiInstance or mofcomp while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Elevated PowerShell Session and Winmgmt / WMI Core Service toward OBJECTS.DATA CIM Repository and Sysmon EID 19/20/21 & WMI Log.',
              detectionAndEvidence: 'Documented in Sysmon Event 19 (recording EventID=19 , Sysmon WmiEventFilter, Namespace=root\\subscription, FilterName=SCMUpdaterFilter, WqlQuery=SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA Win32_PerfFormattedData_PerfOS_System under T1546.003): Configure Sysmon to log EventID 19 (WmiEventFilter), EventID 20 (WmiEventConsumer), and EventID 21 (WmiEventConsumerToFilter) and monitor Microsoft-Windows-WMI-Activity/Operational EventID 5861.',
              storyMappings: [
                  {
                      storyTerm: 'Invisible electronic tripwire inside the cabinet',
                      technicalTerm: 'Permanent WMI __EventFilter registered in root\\subscription namespace',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Condition tuned to boot or clock chimes',
                      technicalTerm: 'WMI Query Language (WQL) trigger watching __InstanceModificationEvent / SystemUpTime',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Cabinet security sensor stamping the tripwire',
                      technicalTerm: 'Sysmon EventID 19 (WmiEventFilter activity detected) recording Name and Query',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Hidden outside normal startup folders',
                      technicalTerm: 'Fileless persistence invisible to standard Run-key and Startup-folder audits',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1546.003',
              plainTitle: 'CommandLineEventConsumer & __FilterToConsumerBinding Persistence in OBJECTS.DATA (Sysmon EventID 20 & 21)',
              storyAnalogy: 'Next, the intruder slips two companion pieces into the same hidden database ledger: first, the action card holding the exact command line to run, and second, the binding clasp connecting that action card straight onto the tripwire.',
              simpleExplanation: 'The attacker creates a CommandLineEventConsumer specifying the payload command line (Sysmon EventID 20) and binds it to SCMUpdaterFilter via __FilterToConsumerBinding (Sysmon EventID 21 and WMI-Activity EventID 5861). Both objects are serialized into C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA (logged in Sysmon Event 20 with EventID=20 , WmiEventConsumer / 21 , WmiConsumerToFilter / 5861 , WMI-Activity, ConsumerName=SCMUpdaterConsumer, DestinationCommand=powershell.exe -NoP -W Hidden -Enc JABjAD0..., DiskRepository=C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes Set-WmiInstance -Namespace root\\subscription -Class CommandLineEventConsumer -Arguments @{Name="SCMUpdaterConsumer"; CommandLineTemplate="powershell.exe -NoP -W Hidden -Enc JABjAD0..."} (which Registers permanent WMI MOF class instances , __EventFilter WQL trigger, CommandLineEventConsumer payload, and __FilterToConsumerBinding link insid so that creates fileless, repository-backed SYSTEM persistence , T1546.003 during "CommandLineEventConsumer & __FilterToConsumerBinding Persistence in OBJECTS.DATA , Sysmon EventID 20 & 21" that runs outside normal Startup folders and Services lists, detectable via Sysmon EventID 19, 20, and 21 and WMI-Activity EventID 5861). Next, the follow-up artifact Set-WmiInstance -Namespace root\\subscription -Class __FilterToConsumerBinding -Arguments @{Filter=$Filter; Consumer=$Consumer} runs (which Registers permanent WMI MOF class instances , __EventFilter WQL trigger, CommandLineEventConsumer payload, and __FilterToConsumerBinding link insid so that creates fileless, repository-backed SYSTEM persistence , T1546.003 during "CommandLineEventConsumer & __FilterToConsumerBinding Persistence in OBJECTS.DATA , Sysmon EventID 20 & 21" that runs outside normal Startup folders and Services lists, detectable via Sysmon EventID 19, 20, and 21 and WMI-Activity EventID 5861).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Elevated PowerShell Session and Winmgmt / WMI Core Service toward OBJECTS.DATA CIM Repository and Sysmon EID 19/20/21 & WMI Log.',
              detectionAndEvidence: 'Documented in Sysmon Event 20 (recording EventID=20 , WmiEventConsumer / 21 , WmiConsumerToFilter / 5861 , WMI-Activity, ConsumerName=SCMUpdaterConsumer, DestinationCommand=powershell.exe -NoP -W Hidden -Enc JABjAD0..., DiskRepository=C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA under T1546.003): Inspect Microsoft-Windows-WMI-Activity/Operational EventID 5861 for permanent consumer bindings and parse offline OBJECTS.DATA during DFIR triage using PyWMIPersistenceFinder.',
              storyMappings: [
                  {
                      storyTerm: 'Action card holding the exact command line',
                      technicalTerm: 'WMI CommandLineEventConsumer (or ActiveScriptEventConsumer) logged by Sysmon EventID 20',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Binding clasp linking tripwire and action card',
                      technicalTerm: 'WMI __FilterToConsumerBinding entry logged by Sysmon EventID 21',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Hidden database ledger on disk',
                      technicalTerm: 'CIM Repository binary file C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Surviving reboots cleanly',
                      technicalTerm: 'Permanent subscription reloaded automatically by winmgmt on every Windows startup',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1047',
              plainTitle: 'SYSTEM Payload Execution Under wmiprvse.exe / scrcons.exe Parentage (Sysmon EventID 1)',
              storyAnalogy: 'The instant the trigger condition rings, the operating system own trusted automation foreman pulls the spring-loaded card out of the cabinet and runs the intruder command under supreme building-master authority.',
              simpleExplanation: 'When the WQL timer condition evaluates to true, the WMI Provider Host (wmiprvse.exe) or WMI Standard Event Consumer (scrcons.exe) spawns the configured CommandLineTemplate as NT AUTHORITY\\SYSTEM, creating a telltale parent-child process anomaly in Sysmon EventID 1 (logged in Sysmon Event 1 with EventID=1 , Sysmon ProcessCreate, ParentImage=C:\\Windows\\System32\\wbem\\scrcons.exe, ChildImage=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe, UserContext=NT AUTHORITY\\SYSTEM so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes ParentImage: C:\\Windows\\System32\\wbem\\scrcons.exe (or wmiprvse.exe) (which invokes the Windows Management Instrumentation command-line interface , wmic.exe or DCOM/WinRM provider host , wmiprvse.exe to execute Win32_Proces so that executes lateral movement or local process creation , T1047 via the trusted WMI provider daemon , wmiprvse.exe during "SYSTEM Payload Execution Under wmiprvse.exe / scrcons.exe Parentage , Sysmon EventID 1" to decouple the child process parent PID from the attacker\'s session). Next, the follow-up artifact Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoP -W Hidden -Enc JABjAD0... runs (which invokes the Windows PowerShell host , powershell.exe with stealth and execution-policy bypass flags , such as -NoP, -NonI, -W Hidden, -Exec Bypass so that achieves fileless in-memory staging and execution , T1047 during "SYSTEM Payload Execution Under wmiprvse.exe / scrcons.exe Parentage , Sysmon EventID 1" without writing compiled binaries to disk, while generating PowerShell Operational EventID 4104 , ScriptBlock and 4103 , Module/Pipeline telemetry).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Elevated PowerShell Session and Winmgmt / WMI Core Service toward OBJECTS.DATA CIM Repository and Sysmon EID 19/20/21 & WMI Log.',
              detectionAndEvidence: 'Documented in Sysmon Event 1 (recording EventID=1 , Sysmon ProcessCreate, ParentImage=C:\\Windows\\System32\\wbem\\scrcons.exe, ChildImage=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe, UserContext=NT AUTHORITY\\SYSTEM under T1047): Alert on any child process (powershell.exe, cmd.exe, mshta.exe, wscript.exe, rundll32.exe) spawned by C:\\Windows\\System32\\wbem\\scrcons.exe.',
              storyMappings: [
                  {
                      storyTerm: 'Trusted automation foreman pulling the card',
                      technicalTerm: 'C:\\Windows\\System32\\wbem\\wmiprvse.exe or scrcons.exe parent process',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Running the intruder command with supreme authority',
                      technicalTerm: 'Child powershell.exe or cmd.exe spawned under NT AUTHORITY\\SYSTEM',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Unmistakable process-lineage alarm',
                      technicalTerm: 'Sysmon EventID 1 flagging wmiprvse.exe or scrcons.exe spawning encoded scripts',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Forensic cleanup removing all three trap pieces',
                      technicalTerm: 'Deleting matching Filter, Consumer, and Binding objects from root\\subscription',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
