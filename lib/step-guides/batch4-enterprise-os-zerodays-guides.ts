import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH4_ENTERPRISE_OS_ZERODAYS_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'atlassian-confluence-cve-2023-22515-storm0062': {
    scenarioId: 'atlassian-confluence-cve-2023-22515-storm0062',
    briefing: {
      headline: 'Scenario Briefing: Atlassian Confluence Zero-Day (CVE-2023-22515) — Storm-0062 XWork Setup Reset & OSGi Webshell',
      storyAnalogy:
        'Imagine a commercial bank vault (`Atlassian Confluence`) that has a special "First-Day Factory Setup Mode" (`setupComplete=false`) used only on the day the vault is installed so the builder can register the first master manager. Once installation finishes, a latch flips to `setupComplete=true` and locks the setup screen forever. However, the public lobby clock (`/server-info.action`) is wired to the bank’s internal control board through Apache XWork parameter chains. By adding `?bootstrapStatusProvider.applicationConfig.setupComplete=false` to a lobby clock query, Storm-0062 reaches through the wiring, flips the factory latch back to `false`, walks into the newly unlocked setup room (`/setup/setupadministrator.action`) to print a master admin badge, and flips the latch back to `true` so nobody notices!',
      plainSummary:
        'Synthesizing Microsoft Threat Intelligence (Storm-0062 / DarkShadow), Rapid7, Atlassian, and Joint CISA/FBI Advisory AA23-289A (October 2023), CVE-2023-22515 (CVSS 10.0) is a zero-day Broken Access Control / XWork parameter injection vulnerability in Atlassian Confluence Data Center and Server (8.0.0–8.5.1). An unauthenticated attacker sends an HTTP request to `/server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false` to reset the server’s installation state in memory, submits `/setup/setupadministrator.action` with `X-Atlassian-Token: no-check` to create a rogue `confluence-administrators` account, calls `/setup/finishsetup.action` to restore normal UI behavior, and uploads a malicious OSGi servlet plugin (`.jar`) via `/rest/plugins/1.0/` for full OS command execution.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Storm-0062 Operator), send the XWork `setupComplete=false` chain to Node ②/③ (Confluence Tomcat `/server-info.action`), provision the rogue admin on Node ④ (`/setup/setupadministrator.action`), and deploy the OSGi `.jar` webshell on Node ⑤ (`/rest/plugins/1.0/`) monitored by Node ⑥ (SIEM).',
      documentedAdvisory: 'CISA/FBI/MS-ISAC Joint Advisory AA23-289A · Microsoft Storm-0062 · Rapid7 CVE-2023-22515 · MITRE T1190 / T1136.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Flipping `setupComplete=false` via XWork Getter/Setter Chaining on `/server-info.action`',
        storyAnalogy:
          'By passing a chained property path in the URL of the public `/server-info.action` page, the attacker tricks Apache XWork into walking up the Java object tree and flipping the master `setupComplete` switch back to `false`.',
        simpleExplanation:
          'Storm-0062 sends an unauthenticated GET request to /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false (an HTTP query string that abuses Apache Struts / XWork OGNL parameter binding to walk through ServerInfoAction.getBootstrapStatusProvider().getApplicationConfig() and invoke setSetupComplete(false) on the global Confluence configuration singleton). Flipping setupComplete to false tricks the running Confluence Data Center server into believing its initial installation wizard has not yet finished (which immediately unlocks the unauthenticated /setup/* administrative provisioning endpoints that are normally blocked after day-one deployment).',
        howItWorksInPractice:
          'Because ServerInfoAction inherits from ConfluenceActionSupport, which exposes a public getBootstrapStatusProvider() getter returning the global BootstrapStatusProvider bean, XWork’s ParametersInterceptor automatically resolves nested dot-notation properties and calls setSetupComplete(false) in JVM memory.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Storm-0062) to Node ②/③ (Confluence Tomcat `/server-info.action`), and return arrow ⇠#1.2 confirming `setupComplete=false`.',
        detectionAndEvidence:
          'Documented in CISA AA23-289A & Rapid7: Tomcat `conf_access_log` entries for `/server-info.action` with `bootstrapStatusProvider.applicationConfig.setupComplete` in the query string or POST body.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1136.001',
        plainTitle: 'Creating a Rogue `confluence-administrators` User via `/setup/setupadministrator.action`',
        storyAnalogy:
          'With the factory setup room unlocked, the attacker submits the new-admin registration form with a special `X-Atlassian-Token: no-check` stamp, then immediately clicks "Finish Setup" (`/setup/finishsetup.action`) so regular employees don’t see a broken setup screen.',
        simpleExplanation:
          'With the setup wizard unlocked, the attacker sends a POST request to /setup/setupadministrator.action with the header X-Atlassian-Token: no-check (an Atlassian header that bypasses Cross-Site Request Forgery token validation on administrative form submissions) to register a brand-new account in the confluence-administrators group. Immediately afterward, the attacker sends POST /setup/finishsetup.action (which flips setupComplete back to true in confluence.cfg.xml so that regular users continue using the wiki normally without seeing a broken setup screen).',
        howItWorksInPractice:
          'Calling /setup/finishsetup.action is a critical operational security step for the attacker: if setupComplete were left as false, every employee visiting the company wiki would be redirected to the installation screen and immediately alert IT.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ posts to `/setup/setupadministrator.action` and `/setup/finishsetup.action` on Node ④, and ⇠#2.2 issues an authenticated administrator session.',
        detectionAndEvidence:
          'Documented in CISA AA23-289A: HTTP 200/302 requests to `/setup/setupadministrator.action` and `/setup/finishsetup.action`, plus unexpected user additions to `confluence-administrators`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Uploading a Malicious OSGi Servlet Plugin via `/rest/plugins/1.0/` for JVM Shell Execution',
        storyAnalogy:
          'Logged in with their brand-new master admin badge, the attacker uses Confluence’s official plugin installer (`/rest/plugins/1.0/`) to load a custom `.jar` add-on that runs shell commands inside the Confluence server.',
        simpleExplanation:
          'Authenticating with the newly created rogue administrator account, Storm-0062 calls the Universal Plugin Manager endpoint /rest/plugins/1.0/ to upload a malicious OSGi servlet plugin (.jar) (a compiled Java bundle that registers a hidden HTTP servlet inside the Confluence Tomcat JVM to execute arbitrary OS commands). Invoking the plugin endpoint spawns /bin/sh or cmd.exe directly beneath the Confluence java process (granting interactive remote code execution and access to all enterprise wiki pages, credentials, and database keys).',
        howItWorksInPractice:
          'Because Confluence plugins run inside the same Tomcat JVM process as the core application, a malicious OSGi plugin can both execute OS commands via Runtime.getRuntime().exec() and intercept cleartext passwords submitted by users logging into Confluence.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ uploads the `.jar` plugin to Node ⑤ (Atlassian UPM `/rest/plugins/1.0/`) and spawns `/bin/sh`, while Node ⑥ (SIEM) alerts on the Confluence `java` process spawning a shell.',
        detectionAndEvidence:
          'Documented by Microsoft & CISA AA23-289A: `POST /rest/plugins/1.0/` followed by the Confluence `java` process spawning `/bin/sh`, `bash`, `cmd.exe`, or `powershell.exe`.',
      },
    ],
  },

  'apache-activemq-cve-2023-46604-openwire': {
    scenarioId: 'apache-activemq-cve-2023-46604-openwire',
    briefing: {
      headline: 'Scenario Briefing: Apache ActiveMQ Zero-Day (CVE-2023-46604) — OpenWire ExceptionResponse to Spring XML RCE',
      storyAnalogy:
        'Imagine a message-sorting warehouse (`Apache ActiveMQ`) where delivery trucks communicate over TCP port 61616 using a binary walkie-talkie protocol called `OpenWire`. Whenever a truck encounters an error, it sends an "Exception Report" (`Command Type 31: ExceptionResponse`) listing the Java error class name and a message string so the warehouse computer can recreate the error object in memory (`Class.forName(className).getConstructor(String.class).newInstance(message)`). However, the warehouse computer forgets to check whether the named class is actually an Error class! The attacker sends an Exception Report naming Spring’s `ClassPathXmlApplicationContext` as the "error class" and a URL to a malicious `poc.xml` file as the "error message"—causing the warehouse computer to download the XML blueprint and immediately run the attacker’s shell commands!',
      plainSummary:
        'Synthesizing Rapid7, Huntress Labs, Trend Micro, and CISA KEV (October–November 2023), CVE-2023-46604 (CVSS 10.0) is an unauthenticated Remote Code Execution vulnerability in Apache ActiveMQ’s OpenWire protocol marshaller on TCP port 61616. By sending a crafted `ExceptionResponse` frame (data structure type `31` / `0x1F`), an attacker forces `BaseDataStreamMarshaller.createThrowable()` to instantiate `org.springframework.context.support.ClassPathXmlApplicationContext` with an attacker-controlled HTTP URL, causing the ActiveMQ JVM to fetch a remote Spring XML configuration and execute OS commands via `java.lang.ProcessBuilder`.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (OpenWire Exploit & XML Server), send the `0x1F ExceptionResponse` frame to Node ②/③ (ActiveMQ OpenWire Listener `:61616` & JVM `createThrowable`), fetch `/poc.xml` to initialize Node ④ (Spring `ProcessBuilder` Bean), and trace the child shell monitored by Node ⑥ (Huntress EDR / Suricata IDS).',
      documentedAdvisory: 'Rapid7 & Huntress CVE-2023-46604 Analysis · Trend Micro HelloKitty/LockBit · CISA KEV · MITRE T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending a Crafted OpenWire `ExceptionResponse` (`0x1F`) Frame to TCP Port 61616',
        storyAnalogy:
          'The attacker connects to ActiveMQ’s binary OpenWire port (`61616`) and sends a 78-byte "Exception Report" packet—except instead of naming a Java Exception, the packet names `ClassPathXmlApplicationContext` and a remote HTTP URL.',
        simpleExplanation:
          'The attacker connects to the Apache ActiveMQ broker on TCP port 61616 (the binary OpenWire messaging port exposed by default) and sends a crafted Command Type 31 (0x1F ExceptionResponse) frame. Instead of a real Java exception class, the packet specifies org.springframework.context.support.ClassPathXmlApplicationContext as the class name and http://185.220.101.44:8080/poc.xml as the exception message (abusing the fact that ExceptionResponseMarshaller unmarshals both strings directly from the wire without authenticating the client).',
        howItWorksInPractice:
          'In the OpenWire binary protocol, byte offset 4 specifies the command data structure type: 0x1F (31) routes the packet directly to ExceptionResponseMarshaller.tightUnmarshal(), which calls tightUnmarshalThrowable().',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① to Node ②/③ (ActiveMQ OpenWire TCP/61616), and return arrow ⇠#1.2 passing the class and URL strings to `createThrowable()`.',
        detectionAndEvidence:
          'Documented by Rapid7 & Suricata: TCP port 61616 packets with OpenWire command byte `0x1F` containing the ASCII string `ClassPathXmlApplicationContext`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1203',
        plainTitle: 'Reflective Instantiation in `BaseDataStreamMarshaller.createThrowable()` & Fetching `poc.xml`',
        storyAnalogy:
          'Because `createThrowable()` never checks if the requested class actually inherits from `java.lang.Throwable`, it calls the `ClassPathXmlApplicationContext(String)` constructor—which immediately reaches out over HTTP to download `poc.xml`.',
        simpleExplanation:
          'Inside the ActiveMQ broker, BaseDataStreamMarshaller.createThrowable() looks up the attacker-supplied class name and invokes its single-String constructor via Java reflection (because prior to 5.18.3, createThrowable() never verified whether the target class actually implemented java.lang.Throwable before calling Constructor.newInstance(message)). Instantiating ClassPathXmlApplicationContext with an HTTP URL forces the ActiveMQ JVM to make an outbound HTTP GET request to the attacker server and parse poc.xml as a trusted Spring IoC bean definition file.',
        howItWorksInPractice:
          'Because Apache ActiveMQ bundles spring-context in its default lib/ directory, org.springframework.context.support.ClassPathXmlApplicationContext is always present on the broker’s classpath and accepts an arbitrary http:// or https:// XML URL in its single-String constructor.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ fetches `http://185.220.101.44:8080/poc.xml` from Node ① into Node ③/④, and ⇠#2.2 logs `Loading XML bean definitions from URL` in `data/activemq.log`.',
        detectionAndEvidence:
          'Documented by Huntress & Rapid7: `data/activemq.log` entries stating `Refreshing org.springframework.context.support.ClassPathXmlApplicationContext` and `Loading XML bean definitions from URL`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.004',
        plainTitle: 'Executing Arbitrary OS Commands via Spring `<bean class="java.lang.ProcessBuilder" init-method="start">`',
        storyAnalogy:
          'As Spring builds the objects listed inside `poc.xml`, it constructs a `ProcessBuilder` object and automatically runs its `start()` method—launching the attacker’s shell or ransomware installer inside the ActiveMQ service account.',
        simpleExplanation:
          'As Spring initializes the beans defined in poc.xml, it constructs a bean of class java.lang.ProcessBuilder with constructor arguments ["/bin/sh", "-c", "..."] and triggers init-method="start" (a standard Spring XML lifecycle attribute that automatically invokes ProcessBuilder.start() the moment the bean is created in memory). This spawns a child shell or msiexec.exe directly under the ActiveMQ broker service account (used in the wild to deploy HelloKitty, LockBit, and Kinsing payloads).',
        howItWorksInPractice:
          'Apache patched CVE-2023-46604 in ActiveMQ 5.18.3 by adding a strict type check inside BaseDataStreamMarshaller.createThrowable(): if (!Throwable.class.isAssignableFrom(clazz)) throw new IOException(...).',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `ProcessBuilder.start()` on Node ④/⑤ to spawn `/bin/sh`, while Node ⑥ (Huntress EDR / SIEM) alerts on the ActiveMQ `java` process spawning a shell.',
        detectionAndEvidence:
          'Documented by Huntress & Trend Micro: Sysmon EventID 1 / Auditd `EXECVE` showing `java` or `wrapper.exe` (ActiveMQ) spawning `cmd.exe`, `powershell.exe`, `msiexec.exe`, or `/bin/sh`.',
      },
    ],
  },

  'papercut-ng-cve-2023-27350-bl00dy': {
    scenarioId: 'papercut-ng-cve-2023-27350-bl00dy',
    briefing: {
      headline: 'Scenario Briefing: PaperCut MF/NG Zero-Day (CVE-2023-27350) — SetupCompleted Auth Bypass to Rhino JS SYSTEM RCE',
      storyAnalogy:
        'Imagine a corporate print-management building (`PaperCut MF/NG`) where the "Welcome / Setup Completed" reception page (`/app?service=page/SetupCompleted`) was left unlocked years after the building opened. Even worse, clicking the "Login" button on that welcome page doesn’t ask for a password—it tells the security desk to automatically sign the visitor in as the master `admin` (`performLogin("admin")`)! Once handed the master admin cookie, the attacker walks into the printer scripting room, turns off the JavaScript safety cage (`print.script.sandboxed=N`), and writes a one-line printer script (`java.lang.Runtime.getRuntime().exec(...)`) that runs as `NT AUTHORITY\\SYSTEM` the instant they click Save.',
      plainSummary:
        'Synthesizing Horizon3.ai’s root-cause analysis, Joint CISA/FBI Advisory AA23-131A, and Microsoft Threat Intelligence (April–May 2023), CVE-2023-27350 (CVSS 9.8) is an unauthenticated session-hijacking and Remote Code Execution flaw in PaperCut MF and NG exploited by the Bl00dy Ransomware Gang, Cl0p, and LockBit. An unauthenticated attacker visits `/app?service=page/SetupCompleted` and submits the `Login` form listener to mint an authenticated `admin` `JSESSIONID` cookie, disables the Rhino JavaScript sandbox (`print.script.sandboxed=N`) in `ConfigEditor`, and injects `java.lang.Runtime.getRuntime().exec()` into a Printer Script running inside `pc-app.exe` as `NT AUTHORITY\\SYSTEM`.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Bl00dy / Cl0p Operator), trigger the `SetupCompleted` login bypass on Node ②/③ (PaperCut Tapestry Web `:9191`), disable the Rhino sandbox in Node ④ (`ConfigEditor` / `pc-app.exe`), and spawn `powershell.exe` as `SYSTEM` on Node ⑤ detected by Node ⑥ (Defender / Sysmon SIEM).',
      documentedAdvisory: 'CISA/FBI Joint Advisory AA23-131A · Horizon3.ai CVE-2023-27350 Analysis · Microsoft Threat Intel · MITRE T1190 / T1059.007',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Minting an Admin `JSESSIONID` Cookie via `/app?service=page/SetupCompleted`',
        storyAnalogy:
          'By visiting the leftover `SetupCompleted` onboarding page and submitting its form button, the attacker tricks PaperCut into calling `performLogin("admin")` without asking for a password.',
        simpleExplanation:
          'The attacker sends an HTTP GET request to /app?service=page/SetupCompleted followed by a POST request invoking the Tapestry form listener service=direct/1/SetupCompleted/$Form (an internal onboarding page in PaperCut MF/NG that remained reachable without authentication even on fully configured production servers). Inside SetupCompleted.formSubmit(), the server calls UserWebAuth.performLogin("admin", Role.ADMIN) directly (minting a valid administrator JSESSIONID cookie for the unauthenticated caller without checking a password).',
        howItWorksInPractice:
          'Why did SetupCompleted.formSubmit() call performLogin("admin")? Because during day-one installation, after an admin finishes the setup wizard, clicking "Login" on the final confirmation screen was designed to log them straight into the dashboard automatically—and the developers forgot to block access to SetupCompleted after setup finished.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Bl00dy Operator) to Node ②/③ (PaperCut Web `/app?service=page/SetupCompleted`), and return arrow ⇠#1.2 issuing the authenticated Admin `JSESSIONID`.',
        detectionAndEvidence:
          'Documented in CISA AA23-131A & Horizon3.ai: HTTP requests to `/app?service=page/SetupCompleted` and POST requests containing `SetupCompleted/$Form`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Disabling the Mozilla Rhino JavaScript Sandbox (`print.script.sandboxed=N`) in `ConfigEditor`',
        storyAnalogy:
          'Normally, PaperCut’s printer scripts run inside a safety cage (`ClassShutter`) so scripts can only count pages or check paper sizes. Using their hijacked Admin session, the attacker flips `print.script.sandboxed` to `N` to unlock full Java reflection.',
        simpleExplanation:
          'Using the hijacked Admin JSESSIONID cookie, the attacker opens /app?service=page/ConfigEditor and modifies two internal configuration keys: setting print-and-device.script.enabled=Y and print.script.sandboxed=N (which turns off the security ClassShutter inside PaperCut’s embedded Mozilla Rhino JavaScript engine so print scripts can access arbitrary Java runtime classes such as java.lang.Runtime).',
        howItWorksInPractice:
          'PaperCut embeds the Mozilla Rhino JavaScript engine (org.mozilla.javascript) so administrators can write custom JavaScript policies for print jobs. When print.script.sandboxed is set to N, Rhino scripts can bridge directly into any Java class on the JVM classpath.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ updates `print-and-device.script.enabled=Y` and `print.script.sandboxed=N` on Node ④ (`ConfigEditor`), with ⇠#2.2 disabling the Rhino sandbox.',
        detectionAndEvidence:
          'Documented by Horizon3.ai & CISA AA23-131A: PaperCut `server.log` / Admin Audit entries showing modifications to `print-and-device.script.enabled` and `print.script.sandboxed`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.001',
        plainTitle: 'Injecting `java.lang.Runtime.getRuntime().exec()` into a Printer Script to Run as `SYSTEM`',
        storyAnalogy:
          'The attacker pastes `java.lang.Runtime.getRuntime().exec("powershell.exe ...")` into a template printer script and clicks Apply—causing `pc-app.exe` to immediately evaluate the script and spawn a `SYSTEM` PowerShell window.',
        simpleExplanation:
          'The attacker navigates to /app?service=page/PrinterDetails, edits a printer script, and injects java.lang.Runtime.getRuntime().exec("powershell.exe ...") outside or inside the printJobHook() function (because PaperCut compiles and evaluates the top-level Rhino JavaScript code immediately when the administrator clicks Apply, without even waiting for a real print job to arrive). This spawns PowerShell directly beneath pc-app.exe running as NT AUTHORITY\\SYSTEM.',
        howItWorksInPractice:
          'On Windows, the PaperCut Application Server service (pc-app.exe) runs by default under NT AUTHORITY\\SYSTEM, meaning any command executed via Rhino’s Runtime.getRuntime().exec() immediately inherits full SYSTEM privileges.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `Runtime.getRuntime().exec()` inside Node ④/⑤ (`pc-app.exe` spawning `powershell.exe`), while Node ⑥ (Sysmon / Defender SIEM) triggers a critical alert.',
        detectionAndEvidence:
          'Documented in CISA AA23-131A: Sysmon EventID 1 showing `C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe` spawning `cmd.exe`, `powershell.exe`, `certutil.exe`, or `bitsadmin.exe`.',
      },
    ],
  },

  'macos-gatekeeper-achilles-cve-2022-42821': {
    scenarioId: 'macos-gatekeeper-achilles-cve-2022-42821',
    briefing: {
      headline: 'Scenario Briefing: macOS Gatekeeper "Achilles" Bypass (CVE-2022-42821) — AppleDouble Restrictive ACL Blocking Quarantine',
      storyAnalogy:
        'Imagine an airport customs checkpoint (`macOS Gatekeeper`) that only inspects suitcases that have a bright red "ARRIVED FROM OVERSEAS" sticker (`com.apple.quarantine` extended attribute) pasted on them by the baggage handler (`Safari`) the moment they come off the plane. If a suitcase has no red sticker, customs assumes it belongs to a local airport worker and waves it straight through without opening it. In the "Achilles" attack, the smuggler packs their suitcase (`Update.app`) inside a shipping crate (`Update.zip`) alongside a special macOS instruction sheet (`._Update.app` AppleDouble file) that coats the suitcase in Teflon (`NFSv4 ACL: deny writeextattr`). When Safari unpacks the crate and tries to stick the red `com.apple.quarantine` label onto the suitcase, the Teflon ACL makes the sticker slide right off (`EACCES`)—so Gatekeeper waves the unsigned malware straight through with zero warnings!',
      plainSummary:
        'Discovered by Microsoft Threat Intelligence researcher Jonathan Bar Or and analyzed with Jamf Threat Labs (December 2022), CVE-2022-42821 ("Achilles") is a logic vulnerability in macOS Gatekeeper and Lockdown Mode. By packaging an unsigned `.app` bundle inside a ZIP archive alongside an AppleDouble metadata file (`._Update.app`) carrying an NFSv4 Access Control List (`com.apple.acl.text`) that denies `writeextattr` permissions to `everyone`, the attacker causes Safari and Archive Utility’s `setxattr("com.apple.quarantine")` call to fail with `EACCES`—leaving the extracted application completely unquarantined so `syspolicyd` skips Gatekeeper and Notarization checks upon launch.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Achilles Archive Packager), extract `._Update.app` in Node ② (Safari & Archive Utility `copyfile_unpack`), block `setxattr(com.apple.quarantine)` and bypass Node ③ (`syspolicyd` Gatekeeper), and execute the unsigned Mach-O on Node ④/⑤ detected by Node ⑥ (Jamf Protect / Defender ESF).',
      documentedAdvisory: 'Microsoft Security Threat Intelligence "Achilles" Disclosure · Jamf Threat Labs · Apple HT213532 · CVE-2022-42821',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1222.002',
        plainTitle: 'Unpacking an AppleDouble (`._`) File Containing a Restrictive `deny writeextattr` ACL',
        storyAnalogy:
          'When macOS Archive Utility unzips `Update.zip`, it reads the hidden `._Update.app` AppleDouble companion file and dutifully applies its `deny writeextattr` Access Control List onto `Update.app`.',
        simpleExplanation:
          'The attacker packages an unsigned macOS application (Update.app) inside a ZIP archive alongside an AppleDouble metadata file named ._Update.app (a special prefix format used by macOS Archive Utility / copyfile_unpack() to preserve extended attributes and Access Control Lists across ZIP archives). Inside ._Update.app, the attacker embeds a com.apple.acl.text attribute containing group:everyone deny write,writeattr,writeextattr,writesecurity,chown (an NFSv4 ACL rule that explicitly forbids every user and process on the Mac from writing new extended attributes to the extracted app).',
        howItWorksInPractice:
          'macOS uses the AppleDouble format (files prefixed with ._ and starting with magic bytes 0x00051607) to serialize macOS-specific extended attributes and ACLs inside standard ZIP archives. When ArchiveService calls copyfile_unpack(), it restores com.apple.acl.text onto the target bundle immediately.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Achilles Archive) to Node ② (Safari / ArchiveService), and return arrow ⇠#1.2 restoring the restrictive `com.apple.acl.text` rule.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intel: ZIP archives containing `._*` AppleDouble entries with `com.apple.acl.text` rules specifying `deny` and `writeextattr`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1553.001',
        plainTitle: 'Blocking `setxattr("com.apple.quarantine")` With Kernel `EACCES` (Permission Denied)',
        storyAnalogy:
          'A split-second after unpacking the file, Safari tries to stamp `com.apple.quarantine` onto `Update.app`—but the macOS kernel sees the new `deny writeextattr` ACL and rejects Safari’s stamp with `Permission denied` (`EACCES`)!',
        simpleExplanation:
          'When Safari or Archive Utility finishes extracting the archive, it calls setxattr() to stamp the com.apple.quarantine extended attribute onto Update.app (the mandatory metadata flag that tells macOS a file came from the internet and must be verified by Gatekeeper). However, because the AppleDouble ACL denying writeextattr is already active on the file, the XNU kernel rejects setxattr("com.apple.quarantine") with EACCES (Permission denied) and the user-mode quarantine helper fails open without aborting the download.',
        howItWorksInPractice:
          'Because quarantine propagation in macOS Monterey and early Ventura was performed in user mode after archive extraction without stripping restrictive ACLs first, the kernel enforced the attacker’s ACL against the browser’s own setxattr() call.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ attempts `setxattr(com.apple.quarantine)` from Node ② to Node ③, and ⇠#2.2 returns `errno 13 (EACCES)` leaving `Update.app` unquarantined.',
        detectionAndEvidence:
          'Documented by Microsoft & Apple HT213532: `setxattr` syscall failures (`EACCES`) for `com.apple.quarantine` on newly extracted bundles in `~/Downloads`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1204.002',
        plainTitle: 'Bypassing Gatekeeper, Notarization & Lockdown Mode Upon Launching `Update.app`',
        storyAnalogy:
          'When the user double-clicks `Update.app`, Gatekeeper (`syspolicyd`) checks for the `com.apple.quarantine` attribute, sees it isn’t there, assumes the user built the app themselves, and runs the unsigned Mach-O binary immediately.',
        simpleExplanation:
          'When the victim double-clicks Update.app in Finder, LaunchServices invokes syspolicyd (the macOS Gatekeeper daemon) to evaluate whether the binary is allowed to run. Because Gatekeeper only enforces Apple Developer ID signatures, Notarization tickets, and Lockdown Mode binary restrictions on files that possess the com.apple.quarantine attribute (assuming any file without com.apple.quarantine was compiled or created locally by the user), syspolicyd completely skips verification and launches the unsigned Mach-O payload without a single dialog box.',
        howItWorksInPractice:
          'As Microsoft demonstrated, CVE-2022-42821 even bypassed Apple’s optional Lockdown Mode because Lockdown Mode’s binary execution policy also relied on the presence of com.apple.quarantine to identify untrusted external binaries.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ launches the unsigned Mach-O binary on Node ④/⑤ via `syspolicyd`, while Node ⑥ (Jamf Protect / Defender ESF) flags `ES_EVENT_TYPE_NOTIFY_EXEC` on an unsigned, unquarantined binary in `~/Downloads`.',
        detectionAndEvidence:
          'Documented by Jamf Threat Labs & Microsoft: Endpoint Security (`ES_EVENT_TYPE_NOTIFY_EXEC`) telemetry showing an unsigned Mach-O executing from `~/Downloads` with `has_quarantine == false`.',
      },
    ],
  },

  'windows-clfs-ransomware-cve-2023-28252-nokoyawa': {
    scenarioId: 'windows-clfs-ransomware-cve-2023-28252-nokoyawa',
    briefing: {
      headline: 'Scenario Briefing: Windows CLFS.sys Kernel Zero-Day (CVE-2023-28252) — CClfsBaseFilePersisted EoP & Nokoyawa Ransomware',
      storyAnalogy:
        'Imagine a high-security courthouse (`Windows Kernel Ring-0`) that lets any citizen on the street (`Medium Integrity User`) ask the court clerk (`CLFS.sys` — Common Log File System) to maintain a ledger book (`.blf` Base Log File) stored in a public locker (`C:\\Users\\Public\\log.blf`). The ledger book contains page-index numbers (`SignaturesOffset` and `rgClients`) that tell the clerk where to write inside the courthouse’s own memory, protected only by a simple math checksum (`CRC32`). While the ledger is sitting on disk, the attacker edits the page-index numbers to point straight at a fake instruction table (`Fake CClfsContainer vtable -> ClfsEarlierLsn`) and recalculates the `CRC32` checksum. When the clerk reads the ledger back in, it trusts the checksum, jumps to the fake instruction table, copies the Supreme Judge’s badge (`PID 4 SYSTEM EPROCESS Token`) onto the attacker’s coat, and lets them unleash `Nokoyawa` ransomware across the building!',
      plainSummary:
        'Discovered in the wild by Kaspersky GReAT and patched by Microsoft MSRC (April 2023), CVE-2023-28252 is an actively exploited Windows Common Log File System (`CLFS.sys`) kernel zero-day Elevation of Privilege vulnerability used to deploy `Nokoyawa` ransomware. A low-privileged attacker calls `CreateLogFile()` to create a `.blf` file on disk, corrupts `CLFS_LOG_BLOCK_HEADER` and `CClfsBaseFilePersisted` offsets while forging a valid `CRC32` checksum, triggers an out-of-bounds kernel write in `CClfsBaseFilePersisted::WriteMetadataBlock`, pivots through a fake `CClfsContainer` vtable and `ClfsEarlierLsn` to overwrite the process `EPROCESS` `Token` with `NT AUTHORITY\\SYSTEM`, and launches `nokoyawa.exe`.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (`clfs_eop.exe` Low-Priv Loader), pass the corrupted `.blf` file to Node ②/③ (`CLFS.sys` `CClfsBaseFilePersisted`), pivot through `ClfsEarlierLsn` on Node ④ (`ntoskrnl.exe` `EPROCESS` Token Swap), and launch `nokoyawa.exe` as `SYSTEM` on Node ⑤ detected by Node ⑥ (Kaspersky / Defender EDR).',
      documentedAdvisory: 'Kaspersky GReAT Securelist Nokoyawa/CLFS Report · Microsoft MSRC CVE-2023-28252 · Zscaler ThreatLabz · MITRE T1068 / T1134.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Creating a Base Log File (`.blf`) via `CreateLogFile()` & Forging the `CRC32` Checksum',
        storyAnalogy:
          'The attacker asks Windows to create a normal `.blf` log file in `C:\\Users\\Public\\`, then edits the raw pointer offsets inside the file on disk and recalculates the `CRC32` checksum so `CLFS.sys` won’t realize the file was tampered with.',
        simpleExplanation:
          'The attacker’s low-privileged loader (clfs_eop.exe, PID 5520) calls the standard Windows API CreateLogFile("LOG:C:\\Users\\Public\\log.blf") (which instructs the kernel driver CLFS.sys to create a Base Log File on disk) and then directly modifies the raw .blf bytes to corrupt CLFS_LOG_BLOCK_HEADER.SignaturesOffset and CLFS_BASE_RECORD_HEADER.rgClients offsets. Because CLFS.sys verifies block integrity using a standard CRC32 checksum stored in the header, the exploit recalculates and updates the CRC32 value (so the kernel driver trusts the corrupted offsets when loading the metadata block into kernel pool memory).',
        howItWorksInPractice:
          'Why is CLFS.sys such a frequent target for ransomware zero-days (CVE-2022-24521, CVE-2022-37969, CVE-2023-23376, CVE-2023-28252)? Because .blf files live in user-writable folders on disk, yet CLFS.sys parses their internal structure offsets directly into Ring-0 kernel pool memory.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (`clfs_eop.exe`) to Node ②/③ (`CLFS.sys` creating and reading `C:\\Users\\Public\\log.blf.blf`), and return arrow ⇠#1.2 accepting the forged CRC32 block.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: Sysmon EventID 11 (`FileCreate`) showing `.blf` files created in `C:\\Users\\Public\\` or `%TEMP%` by non-system processes.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1134.001',
        plainTitle: 'Triggering `CClfsBaseFilePersisted::WriteMetadataBlock` OOB Write & `ClfsEarlierLsn` Token Swap',
        storyAnalogy:
          'When `CLFS.sys` flushes the corrupted metadata block, it writes out-of-bounds and replaces a container pointer with a fake function table (`ClfsEarlierLsn`) that copies the `SYSTEM` token from PID 4 into the attacker’s process.',
        simpleExplanation:
          'The exploit calls AddLogContainer() and flushes the log, triggering CLFS!CClfsBaseFilePersisted::WriteMetadataBlock (which uses the corrupted in-memory block offsets to perform an out-of-bounds write that replaces a kernel pointer with the address of a fake CClfsContainer object crafted by the attacker). When CLFS.sys invokes a virtual method on that fake container, control flow jumps to kernel gadgets (CLFS!ClfsEarlierLsn and nt!SeSetAccessStateGenericMapping) that overwrite the current process’s EPROCESS Token pointer with the SYSTEM Token from PID 4.',
        howItWorksInPractice:
          'By combining nt!SeSetAccessStateGenericMapping with CLFS!ClfsEarlierLsn (which returns 0xFFFFFFFF), the exploit constructs an arbitrary kernel write primitive that overwrites the privileges/Token field of its own EPROCESS structure.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers `WriteMetadataBlock` from Node ②/③ into Node ④ (`ntoskrnl.exe` `EPROCESS` Token Swap), and ⇠#2.2 elevates PID 5520 to `NT AUTHORITY\\SYSTEM`.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT & Zscaler: YARA detection of `CreateLogFile` + `ClfsEarlierLsn` + `SeSetAccessStateGenericMapping` imports and kernel token elevation telemetry.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1486',
        plainTitle: 'Spawning `nokoyawa.exe` as `NT AUTHORITY\\SYSTEM` to Encrypt the Enterprise Host',
        storyAnalogy:
          'Now wearing the Supreme Judge’s `SYSTEM` badge, `clfs_eop.exe` launches the `Nokoyawa` ransomware binary (`nokoyawa.exe`), deletes Volume Shadow Copies, and encrypts the server.',
        simpleExplanation:
          'Now running as NT AUTHORITY\\SYSTEM, clfs_eop.exe spawns nokoyawa.exe (the C++ Nokoyawa ransomware payload that uses its newly acquired SYSTEM privileges to terminate security services, wipe Volume Shadow Copies, and encrypt enterprise files with ECC secp256k1 and Salsa20).',
        howItWorksInPractice:
          'Kaspersky GReAT captured this exact chain in February 2023 across multiple Windows Server intrusions, where affiliates used CVE-2023-28252 to jump from a compromised user session directly to SYSTEM before launching Nokoyawa.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ spawns `nokoyawa.exe` on Node ⑤ under `NT AUTHORITY\\SYSTEM`, while Node ⑥ (Kaspersky / Defender EDR) alerts on the elevated child process.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: Sysmon EventID 1 showing a binary in `C:\\Users\\Public\\` running as `NT AUTHORITY\\SYSTEM` and spawning `nokoyawa.exe` / `vssadmin.exe`.',
      },
    ],
  },
};
