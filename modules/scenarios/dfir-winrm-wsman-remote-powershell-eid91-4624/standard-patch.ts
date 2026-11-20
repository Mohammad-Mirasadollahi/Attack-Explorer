import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a corporate office tower linked by a fast pneumatic canister-tube system built for remote IT administration. An intruder sitting at an ordinary desk drops a sealed command canister down the tube to a database server, where the receiving dock opens a dedicated remote-command bench and executes every instruction inside while both sending and receiving ledgers stamp detailed receipts of the canister and every line of code run.',
      storyMappings: [
        {
          storyTerm: 'Dropping a sealed command canister from the sending desk',
          technicalTerm: 'Invoke-Command initiating outbound WSMan session (WinRM EventID 142 & 6 on source)',
          tone: 'amber',
        },
        {
          storyTerm: 'Receiving dock accepting the canister on the database server',
          technicalTerm: 'HTTP.sys POST /wsman on TCP/5985 logging WinRM EventID 91 and Security EventID 4624',
          tone: 'sky',
        },
        {
          storyTerm: 'Dedicated remote-command bench running the instructions',
          technicalTerm: 'wsmprovhost.exe -Embedding spawning child tools with ServerRemoteHost ScriptBlock logs',
          tone: 'rose',
        },
        {
          storyTerm: 'Paired receipts stamped on both sending and receiving desks',
          technicalTerm: 'Correlated source WinRM EventID 6, target EventID 91, and PowerShell EventID 4104',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the originating workstation, the intruder loads an automated script into a sealed remote-administration canister and launches it through the campus pneumatic tube toward the target database server, leaving an outbound dispatch ticket in the local tube log.',
        storyMappings: [
          {
            storyTerm: 'Loading a script into a remote-administration canister',
            technicalTerm: 'PowerShell Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... }',
            tone: 'amber',
          },
          {
            storyTerm: 'Campus pneumatic tube network',
            technicalTerm: 'WS-Management (WinRM) SOAP protocol over HTTP port 5985 or HTTPS 5986',
            tone: 'sky',
          },
          {
            storyTerm: 'Outbound dispatch ticket on the sending desk',
            technicalTerm: 'Microsoft-Windows-WinRM/Operational EventID 6 and 142 on source workstation',
            tone: 'rose',
          },
          {
            storyTerm: 'Target database server down the hall',
            technicalTerm: 'Destination host SRV-SQL01 receiving the remote management session',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the canister pops into the receiving tube at the database server, the front door receptionist stamps the visitor network arrival pass and immediately opens a freshly numbered remote workbench slot for the incoming session.',
        storyMappings: [
          {
            storyTerm: 'Receiving tube at the database server',
            technicalTerm: 'Windows HTTP.sys kernel listener accepting SOAP POST /wsman on port 5985',
            tone: 'amber',
          },
          {
            storyTerm: 'Front door receptionist stamping the arrival pass',
            technicalTerm: 'Windows Security EventID 4624 (LogonType 3 Network) on SRV-SQL01',
            tone: 'sky',
          },
          {
            storyTerm: 'Opening a freshly numbered remote workbench slot',
            technicalTerm: 'WinRM/Operational EventID 91 (Creating WSMan shell on server with ResourceUri)',
            tone: 'rose',
          },
          {
            storyTerm: 'Authenticated remote management session',
            technicalTerm: 'Kerberos or Negotiate-authenticated administrative session established on target',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Inside the newly opened workbench slot, a dedicated remote-host clerk wakes up to run the intruder commands and child utilities, while the room built-in security camera records the full verbatim transcript of every single script block executed.',
        storyMappings: [
          {
            storyTerm: 'Dedicated remote-host clerk waking up',
            technicalTerm: 'C:\\Windows\\System32\\wsmprovhost.exe -Embedding spawned by the WinRM service',
            tone: 'amber',
          },
          {
            storyTerm: 'Child utilities launched from the remote bench',
            technicalTerm: 'Anomalous child processes spawned under wsmprovhost.exe (Sysmon EventID 1)',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in camera recording the verbatim script transcript',
            technicalTerm: 'PowerShell Operational EventID 4104 and 400 (ServerRemoteHost engine startup)',
            tone: 'rose',
          },
          {
            storyTerm: 'Reconstructing exact lateral actions',
            technicalTerm: 'Correlating wsmprovhost.exe PID with ScriptBlock text and network LogonID',
            tone: 'emerald',
          },
        ],
      },
    },
  };
