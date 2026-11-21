import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A remote help-desk dispatch center locks away its opening-day setup desk after launch, yet adding one extra slash to the hallway sign reopens the empty setup form. An outsider walks in, overwrites the master dispatcher roster with their own name, and uses the built-in dispatch radio to push instant orders to every managed workstation.',
        storyMappings: [
          {
            storyTerm: 'Remote dispatch center',
            technicalTerm: 'ConnectWise ScreenConnect RMM server',
            tone: 'amber',
          },
          {
            storyTerm: 'Extra slash hallway sign',
            technicalTerm: 'Path-traversal bypass on /SetupWizard.aspx/ (CVE-2024-1709)',
            tone: 'sky',
          },
          {
            storyTerm: 'Master dispatcher roster',
            technicalTerm: 'App_Data\\User.xml administrator credential file',
            tone: 'rose',
          },
          {
            storyTerm: 'Built-in dispatch radio',
            technicalTerm: 'Backstage administrative command runner',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider appends a trailing slash and random word to the closed setup-room doorway. The hallway lock checks only for an exact room name, so the setup desk swings wide open on a fully operating dispatch center.',
          storyMappings: [
            {
              storyTerm: 'Closed setup-room doorway',
              technicalTerm: 'Initial installation /SetupWizard.aspx page',
              tone: 'amber',
            },
            {
              storyTerm: 'Trailing slash and random word',
              technicalTerm: 'Path suffix bypass (/SetupWizard.aspx/anything)',
              tone: 'sky',
            },
            {
              storyTerm: 'Exact-name hallway lock',
              technicalTerm: 'Flawed URL path check (CVE-2024-1709)',
              tone: 'rose',
            },
            {
              storyTerm: 'Open setup desk',
              technicalTerm: 'HTTP 200 access to setup wizard on a live server',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Splunk SURGe and Huntress (web access log detections for SlashAndGrab): HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server (proving an unauthenticated caller reopened the initial configuration wizard). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'Sitting at the reopened setup desk, the outsider fills in a fresh owner name and password. The dispatch system dutifully wipes the old supervisor roster book, saves the newcomer as sole owner, and hands over a valid master badge.',
          storyMappings: [
            {
              storyTerm: 'Fresh owner registration form',
              technicalTerm: 'Submitted SetupWizard administrator creation POST',
              tone: 'amber',
            },
            {
              storyTerm: 'Supervisor roster book',
              technicalTerm: 'App_Data\\User.xml credential database',
              tone: 'sky',
            },
            {
              storyTerm: 'Valid master badge',
              technicalTerm: 'Authenticated administrator session cookie',
              tone: 'rose',
            },
            {
              storyTerm: 'Custom desk add-on',
              technicalTerm: 'Malicious extension file placed in App_Extensions',
              tone: 'emerald',
            },
          ],
          howItWorksInPractice:
            'Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch (overwriting existing administrator hashes with attacker-chosen credentials) and returns an authenticated administrator session cookie to the caller (granting full web console control without knowing prior passwords). Mechanically, defenders treat this stage as complete only after the T1505.003 control point is observed as live runtime state (the concrete checkpoint proving prior-stage output now drives the next action) and confirmed in host or network telemetry (the channel that timestamps the handoff).',
          detectionAndEvidence:
            'Documented in Sysmon EventID 11 (file creation and overwrite telemetry) and ScreenConnect Audit Logs: Modification of C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml and App_Extensions\\*.ashx by ScreenConnect.Service.exe (confirming administrator credential replacement and extension deployment).',
        },
        3: {
          storyAnalogy:
            'With the master badge in hand, the outsider does not need to pick a single lock on employee desks. They simply press the legitimate dispatch intercom to broadcast silent maintenance orders to hundreds of connected offices at once.',
          storyMappings: [
            {
              storyTerm: 'Legitimate dispatch intercom',
              technicalTerm: 'ScreenConnect Backstage non-interactive shell',
              tone: 'amber',
            },
            {
              storyTerm: 'Connected branch offices',
              technicalTerm: 'Managed client endpoints running ClientService',
              tone: 'sky',
            },
            {
              storyTerm: 'Master building clearance',
              technicalTerm: 'NT AUTHORITY\\SYSTEM execution privilege',
              tone: 'rose',
            },
            {
              storyTerm: 'Broadcast maintenance order',
              technicalTerm: 'Temporary batch scripts invoking cmd.exe or powershell.exe',
              tone: 'emerald',
            },
          ],
          howItWorksInPractice:
            'Without needing a single exploit on the client workstations, the operator uses the built-in Backstage command runner (a legitimate remote-management console hidden from the logged-in desktop user) to execute arbitrary commands as NT AUTHORITY\\SYSTEM across hundreds or thousands of managed endpoints simultaneously (turning one RMM server compromise into fleet-wide code execution).',
          detectionAndEvidence:
            'Documented by Huntress and Splunk SURGe (endpoint process creation indicators for abused RMM sessions): ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd (signaling mass Backstage command execution across managed workstations). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1219 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
