import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who skips obvious lobby sign-in boards and instead wires a three-piece hidden mousetrap straight inside the building central plumbing blueprint cabinet. Piece one is a tripwire watching for morning startup chimes; piece two is a hidden spring-loaded command card; piece three is a brass clasp tying the tripwire to the command card so every time the building wakes up, the building own maintenance supervisor launches the intruder payload with master keys.',
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
    },
    steps: {
      1: {
        storyAnalogy:
          'Opening the building internal automation cabinet, the intruder installs an invisible electronic tripwire tuned to fire automatically whenever the system finishes booting or a specific clock interval strikes.',
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
      2: {
        storyAnalogy:
          'Next, the intruder slips two companion pieces into the same hidden database ledger: first, the action card holding the exact command line to run, and second, the binding clasp connecting that action card straight onto the tripwire.',
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
      3: {
        storyAnalogy:
          'The instant the trigger condition rings, the operating system own trusted automation foreman pulls the spring-loaded card out of the cabinet and runs the intruder command under supreme building-master authority.',
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
    },
  };
