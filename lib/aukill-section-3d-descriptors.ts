import type {
  Section3DDescriptor,
  Section3DKey,
} from './section-3d-registry';

const SCENARIO_ID = 'aukill-edr-killer-procxp152-byovd';

export const AUKILL_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: SCENARIO_ID,
    sectionKey: 'briefing',
    sceneKind: 'aukill-reactor-briefing',
    stageBadge: 'BRIEFING #0 · POWER-PLANT CONTROL ROOM DIORAMA',
    mitreId: 'T1543.003',
    title: 'Power-Plant Emergency Breaker Wrench - AuKill Kernel Sensor Blinding',
    storyCue:
      'An intruder carries an outdated factory-stamped brass emergency wrench into the deepest reactor control pit, latches onto the unguarded shutoff dial, and flips off every sapphire security watchtower breaker until an emerald factory-recall shutter seals the pit doorway.',
    technicalCue:
      'Drop Signed PROCEXP152.SYS -> Ring 0 IOCTL 0x8335003C (ZwOpenProcess) -> IOCTL 0x83350004 Kill Loop -> Blinded PPL EDR vs HVCI Blocklist (EID 3077).',
    storyMappings: [
      {
        storyTerm: 'Factory-Stamped Brass Wrench',
        technicalTerm: 'Outdated Microsoft-Signed PROCEXP152.SYS Kernel Driver (v16.32)',
        tone: 'amber',
      },
      {
        storyTerm: 'Deep Reactor Control Pit',
        technicalTerm: 'Windows Kernel Ring 0 Execution Layer (Outranking User-Mode PPL)',
        tone: 'sky',
      },
      {
        storyTerm: 'Unguarded Master Shutoff Dial',
        technicalTerm: '\\\\.\\PROCEXP152 DeviceIoControl 0x8335003C & 0x83350004',
        tone: 'rose',
      },
      {
        storyTerm: 'Sapphire Security Watchtowers',
        technicalTerm: 'PPL-Protected Endpoint Sensors (MsMpEng, Falcon, Sentinel)',
        tone: 'sky',
      },
      {
        storyTerm: 'Darkened Turbine Hall Surge',
        technicalTerm: 'Blinded EDR Telemetry Window Preceding Ransomware Staging',
        tone: 'rose',
      },
      {
        storyTerm: 'Emerald Factory-Recall Shutter',
        technicalTerm: 'HVCI + Microsoft Vulnerable Driver Blocklist (CodeIntegrity EID 3077)',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'reactor-pit',
        tag: 'KERNEL RING 0',
        title: 'Reactor Control Pit',
        subtitle: 'PROCEXP152.SYS · IOCTL Dispatch',
        tone: 'amber',
      },
      {
        id: 'watchtowers',
        tag: 'ARMORED SENSORS',
        title: 'Sapphire Watchtowers',
        subtitle: 'PPL EDR · Terminated in Loop',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Wrench Drop',
        stageTag: 'ACT 1 · LOAD',
        title: 'Outdated Factory-Stamped Wrench Clears the Pit Gate',
        storyExcerpt:
          'Because the brass handle still carries a real factory crest, the pit checkpoint waves the obsolete wrench straight inside.',
        technicalParallel:
          'aukill.exe registers PROCEXP152.SYS as a kernel service (Sysmon EID 6, System EID 7045).',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.2,
      },
      {
        id: 2,
        shortLabel: '2. Dial Latch',
        stageTag: 'ACT 2 · HANDLE',
        title: 'Wrench Latches Onto the Unguarded Master Breaker Dial',
        storyExcerpt:
          'The glass dome lifts above the reactor bus as the brass wrench turns the master dial with zero identity check.',
        technicalParallel:
          'IOCTL 0x8335003C calls kernel ZwOpenProcess, returning handle 0x03A4 past PPL armor.',
        accentHex: '#38BDF8',
        startSec: 4.2,
        endSec: 8.8,
      },
      {
        id: 3,
        shortLabel: '3. Towers Dark',
        stageTag: 'ACT 3 · BLIND',
        title: 'Sapphire Security Watchtowers Flip Off One by One',
        storyExcerpt:
          'Each towering sapphire breaker snaps downward in sequence until every security beacon across the turbine hall goes dark.',
        technicalParallel:
          'Continuous IOCTL 0x83350004 (ZwTerminateProcess) loop kills MsMpEng and EDR (EID 7031).',
        accentHex: '#E11D48',
        startSec: 8.8,
        endSec: 13.8,
      },
      {
        id: 4,
        shortLabel: '4. Vault Surge',
        stageTag: 'ACT 4 · IMPACT',
        title: 'Crimson Surge Races Through the Darkened Turbine Hall',
        storyExcerpt:
          'With zero watchtowers left standing, a blinding crimson surge charges straight toward the plant data vaults.',
        technicalParallel:
          'With sensor heartbeats silent, affiliates launch ransomware unopposed by behavioral blocking.',
        accentHex: '#F43F5E',
        startSec: 13.8,
        endSec: 17.0,
      },
      {
        id: 5,
        shortLabel: '5. Recall Lock',
        stageTag: 'ACT 5 · HVCI',
        title: 'Emerald Factory-Recall Shutter Blocks the Obsolete Wrench',
        storyExcerpt:
          'Engineers drop an emerald recall shutter over the reactor pit entrance, rejecting the banned wrench before entry.',
        technicalParallel:
          'HVCI + Vulnerable Driver Blocklist denies load with STATUS_INVALID_IMAGE_HASH (EID 3077).',
        accentHex: '#10B981',
        startSec: 17.0,
        endSec: 20.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 7.2, 16.0], target: [0, 2.0, 0] },
      { id: 'VIEW_A', label: 'Tool Locker', position: [-6.6, 4.4, 9.4], target: [-4.8, 1.8, 0] },
      { id: 'VIEW_B', label: 'Reactor Pit', position: [0.4, 4.4, 8.8], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Watchtowers', position: [6.8, 4.8, 9.6], target: [4.8, 2.0, 0] },
    ],
  },
  'step-1': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-1',
    sceneKind: 'aukill-step1-drop',
    stageBadge: 'STEP #1 · SIGNED DRIVER DROP & RING 0 LOAD',
    mitreId: 'T1543.003',
    title: 'Factory-Stamped Emergency Wrench Passes the Reactor Pit Gate',
    storyCue:
      'An outdated brass emergency wrench glides under the checkpoint stamp scanner, clears the gate purely on its old factory crest, and drops straight into the deep reactor pit.',
    technicalCue:
      'aukill.exe drops PROCEXP152.SYS -> SCM registers kernel service (System EID 7045) -> Sysmon EID 6 logs Valid Microsoft signature.',
    storyMappings: [
      {
        storyTerm: 'Obsolete Brass Wrench',
        technicalTerm: 'Embedded Outdated PROCEXP152.SYS Driver (v16.32)',
        tone: 'amber',
      },
      {
        storyTerm: 'Crest-Only Gate Scanner',
        technicalTerm: 'Default Windows Driver Signature Enforcement Check',
        tone: 'sky',
      },
      {
        storyTerm: 'Reactor Pit Shaft',
        technicalTerm: 'Windows Kernel Ring 0 Address Space (0xFFFFF80541200000)',
        tone: 'rose',
      },
      {
        storyTerm: 'Gatehouse Log Strip',
        technicalTerm: 'Sysmon Event ID 6 DriverLoaded & System Event ID 7045 Audit',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step1-wrench',
        tag: 'SIGNED BINARY',
        title: 'Brass Emergency Wrench',
        subtitle: 'PROCEXP152.SYS · Valid Sig',
        tone: 'amber',
      },
      {
        id: 'step1-pit',
        tag: 'KERNEL ENTRY',
        title: 'Reactor Pit Shaft',
        subtitle: 'Ring 0 · System EID 7045',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Tool Dropped',
        stageTag: 'PHASE 1 · EXTRACT',
        title: 'Intruder Unpacks the Outdated Brass Wrench',
        storyExcerpt:
          'A heavy brass emergency wrench slides out of the maintenance crate toward the pit security gate.',
        technicalParallel:
          'aukill.exe writes PROCEXP152.sys into C:\\Windows\\System32\\drivers\\ with admin rights.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Stamp Scan',
        stageTag: 'PHASE 2 · VERIFY',
        title: 'Checkpoint Scanner Approves the Authentic Old Factory Crest',
        storyExcerpt:
          'The blue scanner beam confirms the real factory stamp without checking whether the tool was recalled.',
        technicalParallel:
          'Signature enforcement validates Microsoft Corporation Authenticode on outdated v16.32.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Pit Entry',
        stageTag: 'PHASE 3 · RING 0',
        title: 'Wrench Drops Straight Into the Deep Reactor Chamber',
        storyExcerpt:
          'The steel hatch slides open and lowers the wrench straight onto the master kernel bus.',
        technicalParallel:
          'Kernel service PROCEXP152 starts; Sysmon EID 6 captures its SHA-256 hash.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Tool Crate', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.7, 0] },
      { id: 'VIEW_B', label: 'Gate Scanner', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Pit Shaft', position: [5.2, 3.8, 7.6], target: [3.6, 1.8, 0] },
    ],
  },
  'step-2': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-2',
    sceneKind: 'aukill-step2-ioctl',
    stageBadge: 'STEP #2 · RING 0 IOCTL 0x8335003C PPL BYPASS',
    mitreId: 'T1068',
    title: 'Unguarded Reactor Dial Grants a Master Handle Past Armor Plates',
    storyCue:
      'Plugged into the unguarded reactor socket, the brass wrench twists the master dial and hands back a glowing crimson override key that bypasses every upstairs armor plate.',
    technicalCue:
      '\\\\.\\PROCEXP152 DeviceIoControl(0x8335003C) -> Kernel ZwOpenProcess -> Handle 0x03A4 Bypassing PsProtectedSignerAntimalware-Light.',
    storyMappings: [
      {
        storyTerm: 'Unguarded Reactor Socket',
        technicalTerm: '\\\\.\\PROCEXP152 Symbolic Link Missing Caller Verification',
        tone: 'amber',
      },
      {
        storyTerm: 'Master Breaker Twist',
        technicalTerm: 'DeviceIoControl Code 0x8335003C Invoking Kernel ZwOpenProcess',
        tone: 'sky',
      },
      {
        storyTerm: 'Upstairs Blast Armor',
        technicalTerm: 'Protected Process Light (PPL) Blocking User-Mode Termination',
        tone: 'sky',
      },
      {
        storyTerm: 'Glowing Override Key',
        technicalTerm: 'Returned PROCESS_ALL_ACCESS Handle 0x03A4 to MsMpEng.exe',
        tone: 'rose',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step2-dial',
        tag: 'KERNEL DISPATCH',
        title: 'Unguarded Master Dial',
        subtitle: 'IOCTL 0x8335003C · OpenProcess',
        tone: 'amber',
      },
      {
        id: 'step2-key',
        tag: 'PPL BYPASSED',
        title: 'Crimson Override Handle',
        subtitle: 'Handle 0x03A4 · Full Access',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Socket Plug',
        stageTag: 'PHASE 1 · LINK',
        title: 'Loader Connects to the Unguarded Reactor Socket',
        storyExcerpt:
          'A heavy brass coupler snaps onto the deep control bus without presenting any operator badge.',
        technicalParallel:
          'aukill.exe opens \\\\.\\PROCEXP152 directly from user mode (PID 5104).',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Dial Turns',
        stageTag: 'PHASE 2 · IOCTL',
        title: 'Reactor Dial Spins Inside Deep Kernel Space',
        storyExcerpt:
          'The central brass wheel rotates 180 degrees inside the cutaway dome, bypassing upstairs blast locks.',
        technicalParallel:
          'IOCTL 0x8335003C triggers Ring 0 ZwOpenProcess against PPL-armored PID 2188.',
        accentHex: '#F59E0B',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Key Granted',
        stageTag: 'PHASE 3 · HANDLE',
        title: 'Master Override Key Pops Up Into User Space',
        storyExcerpt:
          'A glowing crimson override key rises from the reactor console straight into the intruder hand.',
        technicalParallel:
          'Driver returns handle 0x000003A4 (PROCESS_ALL_ACCESS) back to aukill.exe.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Socket Bus', position: [-5.2, 3.8, 7.6], target: [-3.2, 1.8, 0] },
      { id: 'VIEW_B', label: 'Master Dial', position: [0.2, 4.0, 7.0], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Handle Slot', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'step-3': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-3',
    sceneKind: 'aukill-step3-killloop',
    stageBadge: 'STEP #3 · CONTINUOUS IOCTL 0x83350004 EDR KILL LOOP',
    mitreId: 'T1562.001',
    title: 'Three Sapphire Security Watchtowers Flip Dark in a Kill Loop',
    storyCue:
      'Using the master override handle, the intruder flips all three sapphire watchtower circuit breakers down in rapid succession, plunging the entire turbine hall into silent darkness.',
    technicalCue:
      'Infinite IOCTL 0x83350004 (nt!ZwTerminateProcess) loop kills MsMpEng, CSFalcon, and SentinelOne -> System EID 7031 & heartbeat loss.',
    storyMappings: [
      {
        storyTerm: 'Three Sapphire Breakers',
        technicalTerm: 'Protected Security Agents (MsMpEng, Falcon, SentinelOne)',
        tone: 'sky',
      },
      {
        storyTerm: 'Rapid Downward Snap',
        technicalTerm: 'Ring 0 IOCTL 0x83350004 Calling nt!ZwTerminateProcess',
        tone: 'rose',
      },
      {
        storyTerm: 'Endless Relay Cycle',
        technicalTerm: 'Continuous Loop Defeating SCM Auto-Restart Recovery',
        tone: 'amber',
      },
      {
        storyTerm: 'Silent Dark Hall',
        technicalTerm: 'System Event ID 7031 Crashes & Zero SOC Heartbeats',
        tone: 'rose',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step3-breakers',
        tag: 'KILL LOOP',
        title: 'Sapphire Breaker Bank',
        subtitle: 'IOCTL 0x83350004 · EID 7031',
        tone: 'rose',
      },
      {
        id: 'step3-silence',
        tag: 'TELEMETRY GAP',
        title: 'Darkened Watchtower',
        subtitle: '0 Sensor Heartbeats / Min',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Tower #1 Cut',
        stageTag: 'PHASE 1 · DEFENDER',
        title: 'First Sapphire Security Breaker Snaps Off',
        storyExcerpt:
          'The left watchtower lever drops violently and its blue rooftop beacon fades to black.',
        technicalParallel:
          'IOCTL 0x83350004 terminates MsMpEng.exe (PID 2188), stamping System EID 7031.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Tower #2 Cut',
        stageTag: 'PHASE 2 · AGENT',
        title: 'Second Watchtower Snaps Dark Before Auto-Restart',
        storyExcerpt:
          'The center breaker snaps down as the continuous relay prevents backup power from catching.',
        technicalParallel:
          'Continuous polling loop kills secondary endpoint sensors before SCM restarts them.',
        accentHex: '#F59E0B',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Full Blackout',
        stageTag: 'PHASE 3 · BLIND',
        title: 'All Watchtowers Go Silent Across the Hall',
        storyExcerpt:
          'The final sapphire tower clicks off, leaving a glowing crimson blackout alarm across the console.',
        technicalParallel:
          'SOC dead-man-switch flags abrupt sensor heartbeat loss paired with EID 7031 bursts.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.8], target: [0, 1.9, 0] },
      { id: 'VIEW_A', label: 'Tower #1', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.9, 0] },
      { id: 'VIEW_B', label: 'Tower #2', position: [0.2, 4.0, 7.4], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Tower #3', position: [5.2, 3.8, 7.6], target: [3.4, 1.9, 0] },
    ],
  },
  'step-4': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-4',
    sceneKind: 'aukill-step4-hvci',
    stageBadge: 'STEP #4 · HVCI & VULNERABLE DRIVER BLOCKLIST CONTAINMENT',
    mitreId: 'T1486',
    title: 'Emerald Factory-Recall Shutter Rejects the Obsolete Wrench Pre-Load',
    storyCue:
      'At the hardened sister power plant, an emerald recall scanner matches the brass wrench serial against the banned-tool bulletin, slamming the heavy pit shutter down while all sapphire watchtowers stay brightly lit.',
    technicalCue:
      'HVCI + Microsoft Recommended Driver Block Rules -> CI.dll Rejects PROCEXP152.SYS (STATUS_INVALID_IMAGE_HASH / CodeIntegrity EID 3077).',
    storyMappings: [
      {
        storyTerm: 'Factory-Recall Bulletin',
        technicalTerm: 'Microsoft Recommended Driver Block Rules (DriverSiPolicy.p7b)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Heavy Emerald Pit Shutter',
        technicalTerm: 'HVCI Hypervisor-Protected Code Integrity Load Gate (CI.dll)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Rejected Brass Wrench',
        technicalTerm: 'STATUS_INVALID_IMAGE_HASH (0xC0000428) Pre-Ring-0 Block',
        tone: 'rose',
      },
      {
        storyTerm: 'Bright Sapphire Watchtowers',
        technicalTerm: 'Uninterrupted PPL EDR Ready to Quarantine Ransomware',
        tone: 'sky',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step4-shutter',
        tag: 'PRE-LOAD BLOCK',
        title: 'Emerald Recall Shutter',
        subtitle: 'HVCI · CodeIntegrity EID 3077',
        tone: 'emerald',
      },
      {
        id: 'step4-towers',
        tag: 'SENSORS ARMED',
        title: 'Lit Sapphire Watchtowers',
        subtitle: 'PPL EDR Active · Impact Stopped',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Hash Check',
        stageTag: 'PHASE 1 · SCAN',
        title: 'Recall Scanner Matches the Outdated Wrench Hash',
        storyExcerpt:
          'Before the pit hatch can open, an emerald laser checks the wrench serial against the official recall list.',
        technicalParallel:
          'CI.dll evaluates PROCEXP152.sys SHA-256 hash against Microsoft Driver Block Rules.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Shutter Slams',
        stageTag: 'PHASE 2 · DENY',
        title: 'Heavy Emerald Shutter Slams Closed Over the Pit',
        storyExcerpt:
          'A reinforced emerald blast door drops across the reactor shaft, bouncing the brass wrench backward.',
        technicalParallel:
          'Kernel returns STATUS_INVALID_IMAGE_HASH (0xC0000428) and logs CodeIntegrity EID 3077.',
        accentHex: '#10B981',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Plant Safe',
        stageTag: 'PHASE 3 · ARMED',
        title: 'Watchtowers Stay Bright & Alert the Control Room',
        storyExcerpt:
          'Every sapphire beacon shines brightly while the recall alarm alerts defenders to the intrusion.',
        technicalParallel:
          'PPL-protected EDR stays online to block ransomware while EID 3077 alerts SOC analysts.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Blocked Tool', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Emerald Gate', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Lit Towers', position: [5.2, 3.8, 7.6], target: [3.6, 1.9, 0] },
    ],
  },
  'memory-forensics': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'memory-forensics',
    sceneKind: 'aukill-memory-ringdiff',
    stageBadge: 'MEMORY FORENSICS · RING 0 BYOVD DISPATCH VS HVCI BLOCK',
    mitreId: 'T1543.003',
    title: 'Side-by-Side Kernel Gate: Loaded PROCEXP152 vs HVCI Blocklist',
    storyCue:
      'Two reactor pit entrances stand side by side under a golden inspection gantry: on the left, the outdated brass wrench reaches deep inside to override upstairs blast armor, while on the right, the emerald recall shutter seals the shaft before the tool ever crosses the threshold.',
    technicalCue:
      'Left: Ring 0 PROCEXP152.SYS (0xFFFFF80541200000) Overriding PPL -> Right: HVCI Policy (0xFFFFF80500100000) Returning 0xC0000428.',
    storyMappings: [
      {
        storyTerm: 'Open Left Reactor Shaft',
        technicalTerm: 'Loaded PROCEXP152.SYS at 0xFFFFF80541200000 (No Blocklist)',
        tone: 'rose',
      },
      {
        storyTerm: 'Overridden Blast Armor',
        technicalTerm: 'Kernel ZwTerminateProcess Defeating User-Mode PPL Armor',
        tone: 'amber',
      },
      {
        storyTerm: 'Golden Inspection Gantry',
        technicalTerm: 'Kernel Driver Hash & CodeIntegrity Policy Comparison',
        tone: 'sky',
      },
      {
        storyTerm: 'Sealed Right Recall Shaft',
        technicalTerm: 'HVCI + DriverSiPolicy.p7b Returning 0xC0000428 (EID 3077)',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#10B981',
    durationSec: 15,
    callouts: [
      {
        id: 'mem-ring0',
        tag: 'VULNERABLE KERNEL',
        title: 'Loaded Brass Wrench',
        subtitle: 'PROCEXP152.SYS · PPL Bypassed',
        tone: 'rose',
      },
      {
        id: 'mem-hvci',
        tag: 'HARDENED KERNEL',
        title: 'Sealed Recall Gate',
        subtitle: 'HVCI · 0xC0000428 Blocked',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Ring 0 Breach',
        stageTag: 'DIFF · BYOVD',
        title: 'Left Shaft Lets the Signed Driver Override PPL',
        storyExcerpt:
          'On the vulnerable left plinth, the brass wrench sits deep inside the pit, glowing crimson beneath the armor.',
        technicalParallel:
          'PROCEXP152.SYS mapped at 0xFFFFF80541200000 runs ZwOpenProcess / ZwTerminateProcess.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Gantry Sweep',
        stageTag: 'DIFF · COMPARE',
        title: 'Forensic Beam Compares Signature-Only vs Blocklist Enforcement',
        storyExcerpt:
          'A golden gantry sweeps across both shafts, exposing why a valid old factory stamp is not enough.',
        technicalParallel:
          'Comparing default DSE against HVCI + Microsoft Vulnerable Driver Blocklist rules.',
        accentHex: '#FACC15',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. HVCI Proof',
        stageTag: 'DIFF · BLOCKED',
        title: 'Right Recall Shutter Stops the Tool Before Ring 0',
        storyExcerpt:
          'On the hardened right plinth, the emerald shutter locks tight and keeps every upstairs watchtower lit.',
        technicalParallel:
          'CI.dll rejects the banned hash with STATUS_INVALID_IMAGE_HASH (CodeIntegrity EID 3077).',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.8, 13.8], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Open Pit', position: [-5.6, 3.8, 8.0], target: [-3.4, 1.7, 0] },
      { id: 'VIEW_B', label: 'HVCI Gate', position: [5.6, 3.8, 8.0], target: [3.4, 1.7, 0] },
      { id: 'VIEW_C', label: 'Gantry Top', position: [0, 8.2, 8.2], target: [0, 1.9, 0] },
    ],
  },
};
