import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #047 (`log4shell-dfir`).
 * Universe: Automated Pneumatic Mailroom, Sorting Conveyor, Copper Printing Press, Overhead Blueprint Tube & Emerald Airlock Valve.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const LOG4SHELL_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'log4shell-dfir',
    sectionKey: 'briefing',
    sceneKind: 'log4j-mailroom-briefing',
    stageBadge: 'BRIEFING #0 · PNEUMATIC MAILROOM DIORAMA',
    mitreId: 'T1190',
    title: 'Automated Mailroom Press, Street Vacuum Tube & Emerald Egress Airlock',
    storyCue:
      'Inside an automated corporate mailroom, an incoming parcel rolls past front-desk cameras into a copper logging press that accidentally obeys pickup orders printed on envelope labels—firing a glowing canister across the street to an unverified annex warehouse until security slams the emerald airlock shut and upgrades the press to literal ink only.',
    technicalCue:
      'Untrusted HTTP header -> log4j-core-2.14.1 MessagePatternConverter JndiLookup -> Outbound TCP/1389 (Zeek) + java->sh (auditd) -> Log4j 2.17.1+ & Egress Airlock.',
    storyMappings: [
      { storyTerm: 'Inbound Parcel & Sorting Belt', technicalTerm: 'Untrusted HTTP Header Passing Through Nginx Ingress Proxy', tone: 'amber' },
      { storyTerm: 'Copper Mailroom Printing Press', technicalTerm: 'Java Billing Service Bundling log4j-core-2.14.1.jar', tone: 'rose' },
      { storyTerm: 'Spinning Lookup Sorting Gears', technicalTerm: 'MessagePatternConverter Evaluating JndiLookup (formatMsgNoLookups=false)', tone: 'rose' },
      { storyTerm: 'Street-Side Glass Vacuum Tube', technicalTerm: 'Outbound LDAP/RMI Callback on TCP/1389 Flagged by Zeek', tone: 'sky' },
      { storyTerm: 'Annex Workshop Siren Lamp', technicalTerm: 'Linux auditd syscall=execve Detecting java -> sh Child Process', tone: 'amber' },
      { storyTerm: 'Emerald Egress Airlock & Shield', technicalTerm: 'Log4j 2.17.1+ Literal Logging + Firewall Blocking Outbound 389/1389/1099', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      { id: 'l4-press', tag: 'LOGGING PRESS', title: 'Copper Mailroom Press', subtitle: 'log4j-core-2.14.1 · JndiLookup Flaw', tone: 'amber' },
      { id: 'l4-tube', tag: 'EGRESS MONITOR', title: 'Street Vacuum Airlock', subtitle: 'Zeek TCP/1389 + auditd -> 2.17.1+', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Parcel In', stageTag: 'ACT 01 · INGRESS', title: 'Labeled Parcel Rolls Past Mailroom Front Desk Camera', storyExcerpt: 'An incoming parcel bearing a bracketed return label glides smoothly down the sorting belt.', technicalParallel: 'Untrusted X-Api-Version header logged by Nginx EDGE-GW-02 and scanned by Suricata SID 2034649.', accentHex: '#F59E0B', startSec: 0, endSec: 4.4 },
      { id: 2, shortLabel: '2. Parse Gear', stageTag: 'ACT 02 · LOOKUP', title: 'Cutaway Press Obeys Envelope Label as Live Dispatch Order', storyExcerpt: 'The cutaway glass lifts to reveal brass gears obeying the return label instead of printing plain ink.', technicalParallel: 'log4j-core-2.14.1 MessagePatternConverter evaluates untrusted input via JndiLookup.', accentHex: '#E11D48', startSec: 4.4, endSec: 9.2 },
      { id: 3, shortLabel: '3. Tube Shot', stageTag: 'ACT 03 · EGRESS', title: 'Crimson Canister Shoots Outward Through Street Vacuum Tube', storyExcerpt: 'A glowing red canister streaks down the overhead glass tube toward an unverified street annex.', technicalParallel: 'Java server opens outbound TCP/1389 directory connection caught immediately by Zeek.', accentHex: '#38BDF8', startSec: 9.2, endSec: 14 },
      { id: 4, shortLabel: '4. Tool Alarm', stageTag: 'ACT 04 · AUDITD', title: 'Workshop Beacon Flashes Crimson When Clerk Grabs Heavy Tool', storyExcerpt: 'Seeing the mailroom clerk unexpectedly hoist a workshop wrench trips the facility alarm immediately.', technicalParallel: 'Linux auditd syscall=59 (execve) flags parent process java (PID 4418) spawning /bin/sh.', accentHex: '#F43F5E', startSec: 14, endSec: 17.2 },
      { id: 5, shortLabel: '5. Airlock', stageTag: 'ACT 05 · 2.17.1+', title: 'Emerald Airlock Valve & Literal Press Seal Mailroom Permanently', storyExcerpt: 'Guards slam the emerald valve across the outbound tube and fit a literal-ink shield onto the press.', technicalParallel: 'CISA ED 22-02: upgrade to Log4j 2.17.1+, block outbound 389/636/1389/1099, and rotate secrets.', accentHex: '#10B981', startSec: 17.2, endSec: 20 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 16.4], target: [0.2, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Conveyor', position: [-5.0, 3.2, 6.6], target: [-4.7, 1.5, 0.25] },
      { id: 'VIEW_B', label: 'Log Press', position: [-0.4, 3.4, 6.8], target: [-0.55, 1.7, 0.2] },
      { id: 'VIEW_C', label: 'Airlock', position: [4.2, 3.4, 6.8], target: [3.8, 2.0, 0.2] },
    ],
  },

  'step-1': {
    scenarioId: 'log4shell-dfir',
    sectionKey: 'step-1',
    sceneKind: 'log4j-step1-ingress',
    stageBadge: 'STEP #1 · INBOUND SORTING BELT',
    mitreId: 'T1190',
    title: 'Untrusted Envelope Labels Enter the Mailroom Past Front-Desk Cameras',
    storyCue:
      'Every arriving parcel glides under the blue front-desk arch camera before reaching the mailroom floor—recording the exact sender label even when crafty outsiders disguise their pickup wording.',
    technicalCue:
      'Nginx EDGE-GW-02 records raw HTTP headers while Suricata SID 2034649 / OWASP CRS 944150 provide ingress visibility.',
    storyMappings: [
      { storyTerm: 'Amber Labeled Parcel', technicalTerm: 'Incoming HTTP Request With Untrusted X-Api-Version Header', tone: 'amber' },
      { storyTerm: 'Blue Overhead Arch Camera', technicalTerm: 'Nginx Ingress Access Logs & Suricata SID 2034649 Sensor', tone: 'sky' },
      { storyTerm: 'Disguised Return Wording', technicalTerm: 'Nested Lookup String Obfuscation Evading Simple Regex WAFs', tone: 'rose' },
      { storyTerm: 'Layered Defense Rule', technicalTerm: 'Pair Ingress Logs With Egress & Host Behavioral Detection', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'l4-s1-belt', tag: 'INGRESS TRAFFIC', title: 'Mailroom Sorting Belt', subtitle: 'HTTP Headers -> Backend API:8080', tone: 'amber' },
      { id: 'l4-s1-cam', tag: 'EDGE LOGGING', title: 'Front-Desk Arch Camera', subtitle: 'Nginx Access Logs + Suricata 2034649', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Arrive', stageTag: 'STEP 01 · EDGE', title: 'External Parcel Enters Mailroom Sorting Conveyor', storyExcerpt: 'An external delivery rolls directly onto the mailroom intake belt carrying a crafted return label.', technicalParallel: 'External client 198.51.100.42 sends GET /api/v2/health with lookup syntax in X-Api-Version.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Snapshot', stageTag: 'STEP 01 · WAF', title: 'Overhead Camera Logs Full Envelope Label for Investigators', storyExcerpt: 'The glowing blue camera photographs the full return address for retrospective forensic review.', technicalParallel: 'Nginx captures request headers and Suricata SID 2034649 flags standard lookup tokens.', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Forward', stageTag: 'STEP 01 · LIMIT', title: 'Disguised Labels Prove Ingress Cameras Alone Are Not Enough', storyExcerpt: 'Because cleverly worded labels can slip past front-desk eyes, inner mailroom guards remain essential.', technicalParallel: 'Nested obfuscation bypasses naive regexes; defenders rely on patching + egress + auditd.', accentHex: '#E11D48', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.3, 12.6], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Parcel Close', position: [-2.6, 2.4, 5.4], target: [-0.4, 1.4, 0.25] },
      { id: 'VIEW_B', label: 'Arch Camera', position: [2.6, 3.0, 5.6], target: [0.2, 2.3, 0.25] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 6.8, 5.8], target: [0.0, 1.6, 0.25] },
    ],
  },

  'step-2': {
    scenarioId: 'log4shell-dfir',
    sectionKey: 'step-2',
    sceneKind: 'log4j-step2-lookup',
    stageBadge: 'STEP #2 · OVER-HELPFUL PRINTING PRESS',
    mitreId: 'T1190',
    title: 'When a Simple Logbook Printing Press Executes Envelope Labels as Live Orders',
    storyCue:
      'With the glass inspection hatch lifted open, three spinning copper gears inside the mailroom press mistakenly treat ordinary parcel text as an active remote pickup order rather than harmless flat ink.',
    technicalCue:
      'log4j-core-2.14.1.jar MessagePatternConverter invokes JndiLookup because formatMsgNoLookups defaults to false.',
    storyMappings: [
      { storyTerm: 'Spinning Copper Press Gears', technicalTerm: 'MessagePatternConverter Recursive Pattern Substitution Engine', tone: 'rose' },
      { storyTerm: 'Data Crossing Into Action', technicalTerm: 'Untrusted Header String Evaluated by JndiLookup.lookup()', tone: 'amber' },
      { storyTerm: 'Hidden Nested Mailboxes', technicalTerm: 'Shaded Fat JARs & WAR Archives Bundling Vulnerable log4j-core', tone: 'sky' },
      { storyTerm: 'SBOM Inventory Inspection', technicalTerm: 'Automated Runtime Classpath & Archive Scanning Across Fleet', tone: 'emerald' },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'l4-s2-gears', tag: 'ROOT CAUSE', title: 'Over-Helpful Press Gears', subtitle: 'MessagePatternConverter -> JndiLookup', tone: 'rose' },
      { id: 'l4-s2-sbom', tag: 'FLEET HUNTING', title: 'Nested Package Audit', subtitle: 'Scan Shaded Fat JARs (< 2.17.1)', tone: 'amber' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Ink vs Order', stageTag: 'STEP 02 · PARSE', title: 'Press Reads Bracketed Label Instead of Printing Plain Ink', storyExcerpt: 'The cutaway opens showing the press gears spinning furiously as they parse the parcel label.', technicalParallel: 'logger.info() passes untrusted X-Api-Version straight into MessagePatternConverter.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Dispatch', stageTag: 'STEP 02 · JNDI', title: 'Over-Helpful Parser Triggers Remote Directory Pickup', storyExcerpt: 'Instead of closing the ledger entry, the press prepares an outbound pneumatic dispatch canister.', technicalParallel: 'formatMsgNoLookups=false invokes JndiManager and InitialContext.lookup() automatically.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Find All', stageTag: 'STEP 02 · SBOM', title: 'Auditors Inspect Every Nested Machine for Legacy Gears', storyExcerpt: 'Engineers check every hidden side press in the building so no vulnerable gear set survives.', technicalParallel: 'SBOM and runtime JAR scans locate shaded log4j-core < 2.17.1 across containers and appliances.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.4, 13.0], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Press Gears', position: [-2.6, 2.6, 5.4], target: [0.0, 1.7, 0.4] },
      { id: 'VIEW_B', label: 'Right Cutaway', position: [2.8, 2.8, 5.6], target: [0.0, 1.7, 0.3] },
      { id: 'VIEW_C', label: 'Top View', position: [0.0, 6.8, 5.6], target: [0.0, 1.6, 0.25] },
    ],
  },

  'step-3': {
    scenarioId: 'log4shell-dfir',
    sectionKey: 'step-3',
    sceneKind: 'log4j-step3-egress',
    stageBadge: 'STEP #3 · EGRESS TUBE & WORKSHOP ALARM',
    mitreId: 'T1059.004',
    title: 'Catching Outbound Vacuum Tube Shots & Unexpected Workshop Tools',
    storyCue:
      'No matter how cleverly an outsider disguises the wording on an envelope label, firing a crimson canister out the street tube and having the mailroom clerk pick up heavy workshop tools immediately sets off dual facility alarms.',
    technicalCue:
      'Zeek flags outbound TCP/1389 directory lookup from APP-JVM-01 while Linux auditd syscall=59 (execve) flags parent process java spawning sh.',
    storyMappings: [
      { storyTerm: 'Crimson Street Vacuum Canister', technicalTerm: 'Outbound TCP/1389 LDAP/RMI Callback From DMZ Java Server', tone: 'rose' },
      { storyTerm: 'Street Tube Radar Sensor', technicalTerm: 'Zeek Network Security Monitoring Alerting on App-Tier Directory Egress', tone: 'sky' },
      { storyTerm: 'Mailroom Clerk Grabbing Wrench', technicalTerm: 'Linux auditd execve (ppid=4418 java -> comm=sh / bash / curl)', tone: 'amber' },
      { storyTerm: 'Disguise-Proof Dual Alarm', technicalTerm: 'Behavioral Detection 100% Immune to HTTP Header Obfuscation', tone: 'emerald' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'l4-s3-press', tag: 'JAVA WORKLOAD', title: 'Mailroom Press Egress', subtitle: 'APP-JVM-01 -> External TCP/1389', tone: 'amber' },
      { id: 'l4-s3-alarm', tag: 'DUAL BEHAVIORAL', title: 'Annex & Workshop Siren', subtitle: 'Zeek Egress + auditd (java -> sh)', tone: 'rose' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Shoot Tube', stageTag: 'STEP 03 · ZEEK', title: 'Outbound Canister Leaves Mailroom Toward Street Annex', storyExcerpt: 'The crimson canister shoots down the overhead glass tube straight toward an unverified street annex.', technicalParallel: 'APP-JVM-01 (10.20.40.22) initiates unexpected outbound TCP/1389 connection to 198.51.100.42.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Child Tool', stageTag: 'STEP 03 · EXECVE', title: 'Unexpected Child Tool Spawn Flashes Crimson Workshop Lamp', storyExcerpt: 'A mailroom clerk should never hoist a workshop wrench—the crimson beacon lights up instantaneously.', technicalParallel: 'Linux auditd syscall=59 (execve) records ppid=4418 (java) spawning pid=5102 (/bin/sh).', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Proof', stageTag: 'STEP 03 · DFIR', title: 'Dual Signals Separate Real Intrusions From Internet Scans', storyExcerpt: 'Together the street radar and workshop siren confirm an active breach requiring immediate rebuild.', technicalParallel: 'Correlating Zeek egress + auditd execve confirms post-exploitation beyond benign scanning.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.2, 4.5, 13.6], target: [0.4, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Vacuum Tube', position: [0.5, 3.0, 5.8], target: [0.8, 2.2, 0.2] },
      { id: 'VIEW_B', label: 'Alarm Kiosk', position: [4.2, 3.0, 5.8], target: [3.6, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.4, 7.4, 6.4], target: [0.4, 2.0, 0.2] },
    ],
  },

  'step-4': {
    scenarioId: 'log4shell-dfir',
    sectionKey: 'step-4',
    sceneKind: 'log4j-step4-airlock',
    stageBadge: 'STEP #4 · EGRESS AIRLOCK & LITERAL PRESS',
    mitreId: 'T1190',
    title: 'Slamming the Emerald Airlock Shut & Upgrading the Press to Plain Ink Only',
    storyCue:
      'Facility engineers bolt a glowing emerald literal-ink shield onto the copper press and drop a solid airlock valve straight across the street vacuum tube—ending remote blueprint lookups permanently.',
    technicalCue:
      'CISA ED 22-02: upgrade to log4j-core 2.17.1+ (disabling message lookups), enforce outbound firewall blocking 389/636/1389/1099, and re-image/rotate secrets.',
    storyMappings: [
      { storyTerm: 'Emerald Literal-Ink Shield', technicalTerm: 'Apache Log4j 2.17.1+ (Message Lookups Removed Permanently)', tone: 'emerald' },
      { storyTerm: 'Solid Emerald Airlock Valve', technicalTerm: 'Egress Firewall Blocking Outbound TCP/389, 636, 1389, 1099', tone: 'sky' },
      { storyTerm: 'Clean Rebuilt Mailroom', technicalTerm: 'Re-Image Compromised Host & Rotate Exposed API/DB Credentials', tone: 'amber' },
      { storyTerm: 'Continuous Fleet Verification', technicalTerm: 'CI/CD SBOM Gate Blocking Vulnerable log4j-core Dependencies', tone: 'emerald' },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'l4-s4-press', tag: 'PATCHED 2.17.1+', title: 'Literal-Ink Shielded Press', subtitle: 'log4j-core >= 2.17.1 · Lookups Off', tone: 'emerald' },
      { id: 'l4-s4-valve', tag: 'EGRESS LOCK', title: 'Emerald Airlock Valve', subtitle: 'Deny Outbound 389/636/1389/1099', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Drop Valve', stageTag: 'STEP 04 · EGRESS', title: 'Airlock Valve Immediately Blocks Street-Side Vacuum Tubes', storyExcerpt: 'Even before every press finishes upgrading, the emerald valve stops all outbound canisters cold.', technicalParallel: 'Default-deny outbound firewall rules block LDAP/LDAPS/RMI egress from DMZ Java subnets.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Patch Jar', stageTag: 'STEP 04 · 2.17.1+', title: 'Upgraded Press Prints Every Envelope Header Strictly as Plain Ink', storyExcerpt: 'The glowing emerald plate seals the press so crafted return labels are treated strictly as harmless ink.', technicalParallel: 'Upgrading to log4j-core 2.17.1+ (or 2.23+ LTS) removes message lookup evaluation permanently.', accentHex: '#10B981', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Rebuild', stageTag: 'STEP 04 · HYGIENE', title: 'Re-Image Compromised Stations & Rotate Exposed Badges', storyExcerpt: 'Any room where a workshop wrench alarm rang is rebuilt cleanly with brand-new staff keys.', technicalParallel: 'Rebuild compromised instances from clean images and rotate DB/cloud/API secrets.', accentHex: '#F59E0B', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.1, 4.6, 13.6], target: [0.2, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Literal Press', position: [-2.8, 3.0, 6.0], target: [-2.4, 1.7, 0.25] },
      { id: 'VIEW_B', label: 'Airlock Valve', position: [2.2, 3.0, 5.8], target: [1.6, 1.8, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.2, 7.4, 6.6], target: [0.2, 1.9, 0.2] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'log4shell-dfir',
    sectionKey: 'memory-forensics',
    sceneKind: 'log4j-memory-classdiff',
    stageBadge: 'MEMORY FORENSICS · ACTIVE LOOKUP PRESS VS. LITERAL PRESS',
    mitreId: 'T1190',
    title: 'Vulnerable log4j-core 2.14.1 Runtime vs. Patched 2.17.1+ Literal Logging',
    storyCue:
      'Place the open spinning lookup press directly beside the emerald-shielded literal-ink press. A sky-blue audit beam sweeps across both machines, contrasting active label-execution gears on the left against harmless literal printing on the right.',
    technicalCue:
      'Comparing JVM loaded log4j-core-2.14.1.jar (JndiLookup active & remote naming reference) against patched log4j-core-2.17.1+ literal logging state.',
    storyMappings: [
      { storyTerm: 'Spinning Left Lookup Press', technicalTerm: '0x00007F9A11200000 · log4j-core-2.14.1 (JndiLookup=ENABLED)', tone: 'rose' },
      { storyTerm: 'Shielded Right Literal Press', technicalTerm: '0x00007F9A11640000 · log4j-core-2.17.1+ (Literal Logging Only)', tone: 'emerald' },
      { storyTerm: 'Sky-Blue SBOM Audit Beam', technicalTerm: 'Runtime Classpath & Nested Archive Scanner Verifying Fleet Patching', tone: 'sky' },
      { storyTerm: 'External Blueprint Reference', technicalTerm: '0x00007F9A11480000 · javaNamingReference Lookup Blocked by Airlock', tone: 'amber' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'l4-mem-vuln', tag: 'LOG4J 2.14.1', title: 'Active Lookup Press', subtitle: 'formatMsgNoLookups=false (Vulnerable)', tone: 'rose' },
      { id: 'l4-mem-safe', tag: 'LOG4J 2.17.1+', title: 'Literal-Only Press', subtitle: 'Lookups Removed + Egress Airlock', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. 2.14.1', stageTag: 'DIFF · VULN', title: 'Left Press Runs Active Lookup Substitution on Every Header', storyExcerpt: 'On the left, spinning copper gears execute bracketed return labels as remote pickup orders.', technicalParallel: '0x00007F9A11200000 runs log4j-core-2.14.1 with JndiLookup enabled on untrusted messages.', accentHex: '#E11D48', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. SBOM Scan', stageTag: 'DIFF · AUDIT', title: 'Sky-Blue Audit Beam Compares Loaded Runtime Libraries', storyExcerpt: 'The glowing cyan beam sweeps across both presses flagging legacy gear sets immediately.', technicalParallel: 'Runtime JVM inspection and SBOM checks expose nested shaded log4j-core jars.', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. 2.17.1+', stageTag: 'DIFF · FIXED', title: 'Right Emerald Shield Treats Every Log Line as Inert Ink', storyExcerpt: 'On the right, crafted labels print harmlessly into the logbook with zero outbound vacuum shots.', technicalParallel: '0x00007F9A11640000 enforces Log4j 2.17.1+ literal logging backed by strict egress firewalling.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 15.2], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Vuln Press', position: [-5.2, 3.6, 7.6], target: [-3.1, 1.9, 0.2] },
      { id: 'VIEW_B', label: 'Patched Press', position: [5.2, 3.6, 7.6], target: [3.1, 1.9, 0.2] },
      { id: 'VIEW_C', label: 'Top Audit', position: [0.0, 8.2, 7.4], target: [0.0, 1.9, 0.2] },
    ],
  },
};
