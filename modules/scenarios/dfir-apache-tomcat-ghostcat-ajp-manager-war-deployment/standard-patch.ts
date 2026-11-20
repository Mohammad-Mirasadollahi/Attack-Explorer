import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'A Java application building leaves an internal freight elevator door open directly to the public street. An outsider reaches through that freight shaft to read the building staff passcode sheet, uses those passcodes at the package loading dock to upload a disguised web bundle, and triggers freshly compiled control pages inside the workshop.',
      storyMappings: [
        {
          storyTerm: 'Open street-facing freight shaft',
          technicalTerm: 'Exposed Tomcat AJP/1.3 connector on TCP port 8009',
          tone: 'amber',
        },
        {
          storyTerm: 'Staff passcode sheet',
          technicalTerm: 'Read WEB-INF/web.xml or tomcat-users.xml (CVE-2020-1938)',
          tone: 'sky',
        },
        {
          storyTerm: 'Disguised package bundle',
          technicalTerm: 'Malicious WAR archive deployed via /manager/text/deploy',
          tone: 'rose',
        },
        {
          storyTerm: 'Freshly compiled control page',
          technicalTerm: 'Jasper-compiled *_jsp.class execution inside the JVM',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Reaching straight into the unguarded freight shaft, the outsider tags a routine delivery slip with an internal storage path, persuading the elevator clerk to hand back private configuration blueprints from behind the locked wall.',
        storyMappings: [
          {
            storyTerm: 'Unguarded freight shaft',
            technicalTerm: 'Unauthenticated AJP/1.3 port 8009 listener',
            tone: 'amber',
          },
          {
            storyTerm: 'Tagged internal storage path',
            technicalTerm: 'javax.servlet.include.path_info request attribute',
            tone: 'sky',
          },
          {
            storyTerm: 'Private configuration blueprints',
            technicalTerm: 'Arbitrary webapp file read under WEB-INF/',
            tone: 'rose',
          },
          {
            storyTerm: 'Freight shaft flaw',
            technicalTerm: 'Tomcat Ghostcat file read vulnerability (CVE-2020-1938)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Armed with valid manager passcodes, the outsider walks up to the package loading dock and uploads a zipped application crate containing a hidden web control page.',
        storyMappings: [
          {
            storyTerm: 'Package loading dock',
            technicalTerm: 'Authenticated PUT /manager/text/deploy endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Zipped application crate',
            technicalTerm: 'Uploaded malicious Web Application Archive (.war)',
            tone: 'sky',
          },
          {
            storyTerm: 'Valid manager passcodes',
            technicalTerm: 'Compromised manager-script role credentials',
            tone: 'rose',
          },
          {
            storyTerm: 'Dock arrival journal',
            technicalTerm: 'Tomcat localhost_access_log HTTP deployment trace',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The moment the outsider visits their newly unpacked page, the building automatic translator compiles the script into live machine instructions inside the work directory and launches an operating system command shell.',
        storyMappings: [
          {
            storyTerm: 'Automatic script translator',
            technicalTerm: 'Tomcat Jasper JSP-to-bytecode compiler',
            tone: 'amber',
          },
          {
            storyTerm: 'Compiled machine instructions',
            technicalTerm: 'Generated work/Catalina/localhost/*/*_jsp.class artifacts',
            tone: 'sky',
          },
          {
            storyTerm: 'Application runtime engine',
            technicalTerm: 'Java Virtual Machine (java) process running Tomcat',
            tone: 'rose',
          },
          {
            storyTerm: 'Launched command shell',
            technicalTerm: 'Unexpected /bin/sh or cmd.exe child process under java',
            tone: 'emerald',
          },
        ],
      },
    },
  };
