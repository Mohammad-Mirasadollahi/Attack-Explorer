export type Section3DKey =
  | 'briefing'
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'step-5'
  | 'memory-forensics';

export type Anime3DSceneKind =
  | 'bank-truck-briefing'
  | 'frozen-stage-guard'
  | 'hollow-cargo-unmap'
  | 'rwx-vault-inject'
  | 'cockpit-gps-hijack'
  | 'firewall-c2-bridge'
  | 'memory-vad-diff';

export type StandardCameraPresetId = 'DIRECTOR' | 'VIEW_A' | 'VIEW_B' | 'VIEW_C';
export type StandardCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface Section3DCalloutSpec {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  tone: 'sky' | 'rose' | 'amber' | 'emerald';
}

export interface Section3DPhaseSpec {
  id: number;
  shortLabel: string;
  stageTag: string;
  title: string;
  storyExcerpt: string;
  technicalParallel: string;
  accentHex: string;
  startSec: number;
  endSec: number;
}

export interface Section3DCameraPresetSpec {
  id: StandardCameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface Section3DDescriptor {
  scenarioId: string;
  sectionKey: Section3DKey;
  sceneKind: Anime3DSceneKind;
  stageBadge: string;
  mitreId: string;
  title: string;
  storyCue: string;
  technicalCue: string;
  accentHex: string;
  secondaryHex: string;
  durationSec: number;
  callouts: [Section3DCalloutSpec, Section3DCalloutSpec];
  phases: Section3DPhaseSpec[];
  cameraPresets: [
    Section3DCameraPresetSpec,
    Section3DCameraPresetSpec,
    Section3DCameraPresetSpec,
    Section3DCameraPresetSpec,
  ];
}

/**
 * Canonical UI & 3D Stage Standard modeled directly on the Process Hollowing
 * Overview section so every scenario section uses identical layout order,
 * story-then-technical typography, HUD chrome, button placement, and display modes.
 */
export const ANIME_3D_STAGE_STANDARD = {
  sectionOrder: [
    'STORY_ANALOGY',
    'TECHNICAL_EXPLANATION',
    'INTERACTIVE_3D_STAGE',
  ] as const,
  speedMultipliers: [0.5, 1, 1.5] as const,
  cutawayModes: ['AUTO', 'OPEN', 'SEALED'] as const,
  viewportHeightClasses:
    'h-[calc(100vh-110px)] min-h-[600px] max-h-[860px]' as const,
  topRightActions: ['CUTAWAY', 'FULL_PAGE'] as const,
  bottomDockFeatures: [
    'HIDE_SHOW_TOGGLE',
    'PLAY_PAUSE',
    'RESTART',
    'PHASE_TABS',
    'SPEED_MULTIPLIERS',
    'TIMELINE_SCRUBBER',
    'CAMERA_PRESETS',
    'LABELS_TOGGLE',
    'BLOOM_TOGGLE',
  ] as const,
} as const;

const PROCESS_HOLLOWING_SECTION_SCENES: Record<
  Section3DKey,
  Section3DDescriptor
> = {
  briefing: {
    scenarioId: 'process-hollowing',
    sectionKey: 'briefing',
    sceneKind: 'bank-truck-briefing',
    stageBadge: 'BRIEFING #0 · FULL KILL-CHAIN DIORAMA',
    mitreId: 'T1055.012',
    title: 'Armored Bank Truck — Process Hollowing End-to-End',
    storyCue:
      'Hire an official armored bank truck, freeze it in the garage, empty the legal bank cargo, load the covert crew inside, and roll straight past the bank gate.',
    technicalCue:
      'CreateProcessW (SUSPENDED) → NtUnmapViewOfSection → VirtualAllocEx (RWX) → WriteProcessMemory → SetThreadContext (RCX) → ResumeThread.',
    accentHex: '#38BDF8',
    secondaryHex: '#F43F5E',
    durationSec: 26,
    callouts: [
      {
        id: 'bank-truck',
        tag: 'TRUSTED SHELL',
        title: 'Bank Truck',
        subtitle: 'Trusted Host · svchost.exe',
        tone: 'sky',
      },
      {
        id: 'hidden-intruder',
        tag: 'COVERT PAYLOAD',
        title: 'Hidden Intruder',
        subtitle: 'Covert Payload · Beacon PE',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Hire Truck',
        stageTag: 'STAGE 01 · SPAWN',
        title: 'Hire Official Armored Bank Truck',
        storyExcerpt: 'Trusted armored truck arrives at dispatch garage.',
        technicalParallel:
          'CreateProcessW("svchost.exe") initiates a Microsoft-signed host.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        shortLabel: '2. Freeze',
        stageTag: 'STAGE 02 · SUSPENDED',
        title: 'Freeze Truck Before Route Starts',
        storyExcerpt: 'Cryo stasis locks engine before route begins.',
        technicalParallel:
          'CREATE_SUSPENDED = 0x00000004 halts TID 4896 before entry runs.',
        accentHex: '#22D3EE',
        startSec: 4.5,
        endSec: 8.5,
      },
      {
        id: 3,
        shortLabel: '3. Empty Cargo',
        stageTag: 'STAGE 03 · UNMAP',
        title: 'Empty Legal Bank Bullion Cargo',
        storyExcerpt: 'Legal bank bullion crates are unmapped from hold.',
        technicalParallel:
          'NtUnmapViewOfSection(0x00400000) vacates signed SEC_IMAGE.',
        accentHex: '#FACC15',
        startSec: 8.5,
        endSec: 13,
      },
      {
        id: 4,
        shortLabel: '4. Load Crew',
        stageTag: 'STAGE 04 · INJECT',
        title: 'Load Covert Intruder Crew',
        storyExcerpt: 'Covert crew boards the hollowed rear bay.',
        technicalParallel:
          'VirtualAllocEx (RWX 0x40) + WriteProcessMemory injects Beacon PE.',
        accentHex: '#F43F5E',
        startSec: 13,
        endSec: 17.5,
      },
      {
        id: 5,
        shortLabel: '5. Release',
        stageTag: 'STAGE 05 · RESUME',
        title: 'Release Freeze & Redirect Route',
        storyExcerpt: 'Stasis shatters and truck launches toward gate.',
        technicalParallel:
          'SetThreadContext (RCX=0x004014A0) + ResumeThread wakes TID 4896.',
        accentHex: '#FB7185',
        startSec: 17.5,
        endSec: 21.5,
      },
      {
        id: 6,
        shortLabel: '6. Pass Gate',
        stageTag: 'STAGE 06 · EGRESS',
        title: 'Roll Past Bank Gate Undetected',
        storyExcerpt: 'Security cameras approve trusted BANK-01 shell.',
        technicalParallel:
          'Host firewall trusts svchost.exe path during TLS 1.3 C2 egress.',
        accentHex: '#10B981',
        startSec: 21.5,
        endSec: 26,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [-6, 6.2, 16], target: [0, 2, 0] },
      { id: 'VIEW_A', label: 'Garage', position: [-14, 5.2, 11], target: [-11, 2, 0] },
      { id: 'VIEW_B', label: 'Cargo Bay', position: [-11, 3.6, 8.2], target: [-11, 1.8, 0] },
      { id: 'VIEW_C', label: 'Bank Gate', position: [12, 5.4, 12], target: [10, 2.2, 0] },
    ],
  },

  'step-1': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-1',
    sceneKind: 'frozen-stage-guard',
    stageBadge: 'STEP #1 · SUSPENDED STAGE SPAWN',
    mitreId: 'T1106',
    title: 'Frozen Stage Guard & Master Control Keys',
    storyCue:
      'Think of a stage director at a control console calling a famous, badge-carrying security guard onto the lit stage, pressing the cyan "Freeze" button the millisecond the guard crosses the doorway—locking them inside a stasis crystal—and quietly pocketing the golden master keys.',
    technicalCue:
      'Invoice_Q4.exe (PID 3104) calls CreateProcessW(svchost.exe, CREATE_SUSPENDED = 0x00000004), freezing TID 4896 at RtlUserThreadStart and receiving master handles hProcess = 0x01C4 & hThread = 0x01C8.',
    accentHex: '#38BDF8',
    secondaryHex: '#FACC15',
    durationSec: 15,
    callouts: [
      {
        id: 'frozen-guard',
        tag: 'CREATE_SUSPENDED · 0x4',
        title: 'Frozen Guard',
        subtitle: 'svchost.exe · PID 4892 (Halted)',
        tone: 'sky',
      },
      {
        id: 'master-keys',
        tag: 'PROCESS_INFORMATION',
        title: 'Master Keys',
        subtitle: 'hProcess 0x01C4 · hThread 0x01C8',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Stage Call',
        stageTag: 'STEP 01 · SPAWN',
        title: 'Director Summons Official Security Guard',
        storyExcerpt:
          'The stage director calls the trusted badge-carrying guard through the stage doorway.',
        technicalParallel:
          'CreateProcessW("C:\\Windows\\System32\\svchost.exe") maps the signed binary at 0x00400000.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Time Freeze',
        stageTag: 'STEP 01 · STASIS',
        title: 'Instant Cryo Freeze Mid-Stride',
        storyExcerpt:
          'The director slams the cyan Freeze button the instant the guard enters, locking them in stasis.',
        technicalParallel:
          'CREATE_SUSPENDED = 0x00000004 parks primary thread TID 4896 at RtlUserThreadStart (SuspendCount = 1).',
        accentHex: '#22D3EE',
        startSec: 5,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. Master Keys',
        stageTag: 'STEP 01 · HANDLES',
        title: 'Kernel Hands Back Master Control Keys',
        storyExcerpt:
          'Two glowing golden master keys float back to the director’s console granting full control.',
        technicalParallel:
          'PROCESS_INFORMATION returns hProcess = 0x01C4 & hThread = 0x01C8 with PROCESS_ALL_ACCESS (0x1FFFFF).',
        accentHex: '#FACC15',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [1.2, 5.2, 11.4], target: [0.4, 2.1, 0] },
      { id: 'VIEW_A', label: 'Stage Door', position: [-5.8, 3.8, 7.6], target: [-2.4, 2.3, -0.8] },
      { id: 'VIEW_B', label: 'Frozen Guard', position: [-0.8, 3.2, 6.4], target: [-0.6, 2.2, 0.1] },
      { id: 'VIEW_C', label: 'Master Keys', position: [5.4, 4.1, 6.8], target: [2.2, 2.2, 0.5] },
    ],
  },

  'step-2': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-2',
    sceneKind: 'hollow-cargo-unmap',
    stageBadge: 'STEP #2 · MEMORY UNMAPPING BAY',
    mitreId: 'T1055.012',
    title: 'PEB+0x10 Scan & Hollowing Original Bank Cargo',
    storyCue:
      'While the official armored truck stays frozen in the X-ray bay, an overhead scanner locates the cargo manifest (PEB+0x10) and slides every single crate of genuine bank bullion out through the rear doors, leaving a glowing hollow shell with its official plate intact.',
    technicalCue:
      'Loader reads PEB+0x10 (ImageBaseAddress = 0x00400000) via hProcess = 0x01C4 and invokes ntdll!NtUnmapViewOfSection, detaching the signed SEC_IMAGE VAD and returning STATUS_SUCCESS (0x00000000).',
    accentHex: '#22D3EE',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'hollowed-shell',
        tag: 'PEB+0x10 · 0x00400000',
        title: 'Hollowed Shell',
        subtitle: 'svchost.exe · Image Base Vacated',
        tone: 'sky',
      },
      {
        id: 'unmapped-cargo',
        tag: 'NtUnmapViewOfSection',
        title: 'Unmapped Cargo',
        subtitle: 'Signed SEC_IMAGE Stripped · 0x00000000',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. PEB Scan',
        stageTag: 'STEP 02 · QUERY PEB',
        title: 'Locate ImageBaseAddress at PEB+0x10',
        storyExcerpt:
          'Overhead X-ray gantry scans the frozen armored truck to pinpoint the exact cargo manifest.',
        technicalParallel:
          'ReadProcessMemory(hProcess=0x01C4, PEB+0x10) resolves ImageBaseAddress = 0x00400000.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Unmap Cargo',
        stageTag: 'STEP 02 · UNMAP',
        title: 'Extract Legal Bullion & SEC_IMAGE Code',
        storyExcerpt:
          'Every genuine gold crate and original code block slides out the open rear doors and dematerializes.',
        technicalParallel:
          'ntdll!NtUnmapViewOfSection(hProcess=0x01C4, BaseAddr=0x00400000) detaches signed SEC_IMAGE VAD.',
        accentHex: '#F59E0B',
        startSec: 5,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Empty Shell',
        stageTag: 'STEP 02 · VACATED',
        title: 'STATUS_SUCCESS Leaves Hollowed Shell',
        storyExcerpt:
          'The armored interior is completely hollowed out while the official BANK-01 license plate stays untouched.',
        technicalParallel:
          'Kernel returns NTSTATUS = 0x00000000 (STATUS_SUCCESS); 0x00400000 is ready for payload injection.',
        accentHex: '#22D3EE',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [-0.8, 5.4, 12.2], target: [-2.1, 2.0, 0] },
      { id: 'VIEW_A', label: 'PEB Gantry', position: [-1.6, 5.8, 8.8], target: [-1.8, 3.2, 0] },
      { id: 'VIEW_B', label: 'Hollow Bay', position: [-1.4, 2.9, 6.6], target: [-2.1, 1.9, 0] },
      { id: 'VIEW_C', label: 'Unmap Rail', position: [-7.4, 3.8, 7.2], target: [-4.6, 1.6, 0] },
    ],
  },

  'step-3': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-3',
    sceneKind: 'rwx-vault-inject',
    stageBadge: 'STEP #3 · RWX MEMORY VAULT & PE STREAM',
    mitreId: 'T1055.012',
    title: 'Allocating 264 KB RWX Vault & Injecting Beacon PE',
    storyCue:
      'Inside that emptied-out armored frame, the intruder opens a glowing high-clearance vault (RWX 0x40) and streams in stacked crimson payload modules—MZ header, covert code, and rewritten route manual—while keeping the trusted exterior shell untouched.',
    technicalCue:
      'VirtualAllocEx reserves 264 KB of private PAGE_EXECUTE_READWRITE (0x40) RAM at 0x00400000; WriteProcessMemory streams 270,336 bytes of Cobalt Strike Beacon ("MZ" 4D 5A, .text, .rdata, .data).',
    accentHex: '#F43F5E',
    secondaryHex: '#A855F7',
    durationSec: 15,
    callouts: [
      {
        id: 'rwx-vault',
        tag: 'VirtualAllocEx · 0x40',
        title: 'RWX Memory Vault',
        subtitle: '0x00400000 · 264 KB MEM_PRIVATE',
        tone: 'amber',
      },
      {
        id: 'injected-beacon',
        tag: 'WriteProcessMemory',
        title: 'Injected Beacon',
        subtitle: 'MZ (4D 5A) + .text / .rdata / .data',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Alloc RWX',
        stageTag: 'STEP 03 · ALLOCATE',
        title: 'Carve Out 264 KB RWX Memory Vault',
        storyExcerpt:
          'Inside the empty svchost.exe frame, a glowing crimson high-clearance vault expands at base 0x00400000.',
        technicalParallel:
          'VirtualAllocEx(hProcess=0x01C4, 0x00400000, 264 KB, PAGE_EXECUTE_READWRITE=0x40) commits MEM_PRIVATE RAM.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Stream PE',
        stageTag: 'STEP 03 · WRITE',
        title: 'Stream Unpacked Beacon PE Sections',
        storyExcerpt:
          'Glowing payload packets stream from the injector nozzle, stacking MZ header, .text, .rdata, and .data inside.',
        technicalParallel:
          'WriteProcessMemory writes 270,336 bytes ("MZ" 4D 5A + Cobalt Strike Beacon sections) directly into RAM.',
        accentHex: '#F43F5E',
        startSec: 5,
        endSec: 10.5,
      },
      {
        id: 3,
        shortLabel: '3. Vault Armed',
        stageTag: 'STEP 03 · EID 10',
        title: 'Payload Armed Without Touching Disk',
        storyExcerpt:
          'The covert crew and rewritten route manual sit sealed inside the trusted exterior paint job.',
        technicalParallel:
          'Sysmon EventID 10 (GrantedAccess=0x1FFFFF) & ETW-Ti flag unbacked 264 KB RWX allocation containing MZ header.',
        accentHex: '#A855F7',
        startSec: 10.5,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.4, 4.7, 11.4], target: [0.1, 2.0, 0] },
      { id: 'VIEW_A', label: 'RWX Vault', position: [1.4, 3.2, 6.8], target: [1.2, 2.0, 0] },
      { id: 'VIEW_B', label: 'PE Injector', position: [-5.6, 3.4, 6.8], target: [-2.4, 1.9, 0] },
      { id: 'VIEW_C', label: 'Top Shell', position: [1.0, 8.6, 5.2], target: [0.8, 1.8, 0] },
    ],
  },

  'step-4': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-4',
    sceneKind: 'cockpit-gps-hijack',
    stageBadge: 'STEP #4 · THREAD CONTEXT & EXECUTION LAUNCH',
    mitreId: 'T1055.012',
    title: 'Hijacking Steering & GPS (RCX) Then Releasing Freeze',
    storyCue:
      'Before pressing "Unfreeze", the intruder climbs into the cockpit, cranks the steering wheel hard, and snaps the holographic GPS needle off the bank route onto their secret target (RCX = 0x004014A0). The instant the cryo lock shatters, the thread rockets down the attacker’s track.',
    technicalCue:
      'SetThreadContext(hThread = 0x01C8) overwrites RCX → 0x004014A0; ResumeThread drops SuspendCount 1 → 0 to run Beacon inside TID 4896 while triggering Sysmon Event ID 25 (ProcessTampering).',
    accentHex: '#FB7185',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'hijacked-rcx',
        tag: 'SetThreadContext',
        title: 'Hijacked Steering & GPS',
        subtitle: 'RCX Overwritten → 0x004014A0',
        tone: 'rose',
      },
      {
        id: 'resumed-thread',
        tag: 'ResumeThread · EID 25',
        title: 'Resumed Thread',
        subtitle: 'TID 4896 Active · SuspendCount 1 → 0',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Hijack RCX',
        stageTag: 'STEP 04 · CONTEXT',
        title: 'Crank Steering Wheel & Snap GPS to RCX',
        storyExcerpt:
          'Inside the frozen cab, the steering wheel cranks hard and the holographic GPS locks onto the secret destination.',
        technicalParallel:
          'SetThreadContext(hThread=0x01C8) overwrites KTRAP_FRAME.Rcx → 0x004014A0 (Base + EntryPoint RVA).',
        accentHex: '#F43F5E',
        startSec: 0,
        endSec: 5.2,
      },
      {
        id: 2,
        shortLabel: '2. Unfreeze',
        stageTag: 'STEP 04 · RESUME',
        title: 'Shatter Cryo Lock & Wake TID 4896',
        storyExcerpt:
          'The cryo stasis shards burst apart as the brake releases and the execution core rockets forward.',
        technicalParallel:
          'ResumeThread(hThread=0x01C8) decrements SuspendCount 1 → 0, launching Beacon inside svchost.exe.',
        accentHex: '#38BDF8',
        startSec: 5.2,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. EID 25 Alert',
        stageTag: 'STEP 04 · DETECTION',
        title: 'Sysmon EID 25 Flags Replaced Image',
        storyExcerpt:
          'An amber security tamper wave pulses overhead as the kernel detects the swapped interior running.',
        technicalParallel:
          'Sysmon EventID 25 (ProcessTampering: "Image is replaced") triggers as RAM @ 0x00400000 mismatches disk.',
        accentHex: '#F59E0B',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.6, 5.0, 11.4], target: [0.4, 2.0, 0] },
      { id: 'VIEW_A', label: 'Cockpit GPS', position: [-2.4, 3.6, 6.2], target: [-2.0, 2.3, 0.3] },
      { id: 'VIEW_B', label: 'TID 4896 Rail', position: [4.2, 3.6, 7.0], target: [3.2, 1.9, -0.2] },
      { id: 'VIEW_C', label: 'EID 25 Pulse', position: [2.2, 6.8, 7.6], target: [2.4, 2.4, -0.2] },
    ],
  },

  'step-5': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-5',
    sceneKind: 'firewall-c2-bridge',
    stageBadge: 'STEP #5 · PERIMETER EGRESS & C2 BEACON',
    mitreId: 'T1071.001',
    title: 'Bypassing Host Firewall to External C2 Warehouse',
    storyCue:
      'The disguised armored truck now rolls right past the emerald perimeter firewall gate and opens an encrypted bridge to an external warehouse tower. The gate guard waves it through because its badge says svchost.exe—until the rotating SOC radar locks onto the unscheduled route.',
    technicalCue:
      'Hollowed svchost.exe (PID 4892) establishes TLS 1.3 HTTPS GET /jquery-3.3.1.min.js to 185.220.101.42:443 (60s / 20% jitter), caught by Sysmon EID 3 & Suricata JA3 72a589da586844d7f0818ce684948eea.',
    accentHex: '#10B981',
    secondaryHex: '#F43F5E',
    durationSec: 15,
    callouts: [
      {
        id: 'disguised-truck',
        tag: 'FIREWALL ALLOW · PID 4892',
        title: 'Disguised Truck',
        subtitle: 'svchost.exe · TLS 1.3 Egress',
        tone: 'emerald',
      },
      {
        id: 'external-c2',
        tag: 'MALLEABLE HTTPS · JA3',
        title: 'External C2 Server',
        subtitle: '185.220.101.42:443 · /jquery-3.3.1.min.js',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Gate Pass',
        stageTag: 'STEP 05 · BYPASS',
        title: 'Host Firewall Trusts svchost.exe Badge',
        storyExcerpt:
          'The perimeter gate scans the official svchost.exe plate, flashes green ALLOW, and raises the barrier.',
        technicalParallel:
          'Application firewall trusts signed path C:\\Windows\\System32\\svchost.exe for outbound TCP/443.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. TLS 1.3 C2',
        stageTag: 'STEP 05 · BEACON',
        title: 'Encrypted C2 Bridge to External Warehouse',
        storyExcerpt:
          'An arched encrypted tunnel streams covert tasking packets directly into the dark crimson C2 tower.',
        technicalParallel:
          'winhttp.dll opens TLS 1.3 HTTPS GET /jquery-3.3.1.min.js to 185.220.101.42:443 (60s ±20% jitter).',
        accentHex: '#F43F5E',
        startSec: 5,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. SOC Lock',
        stageTag: 'STEP 05 · SIEM / IDS',
        title: 'SOC Radar Catches Anomalous JA3 Route',
        storyExcerpt:
          'The rotating SOC radar locks onto the unscheduled trip after spotting a bare svchost.exe without -k.',
        technicalParallel:
          'Sysmon EID 3 + Suricata IDS correlate bare svchost.exe (PID 4892) with Cobalt Strike JA3 fingerprint.',
        accentHex: '#F59E0B',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.8, 6.2, 14.2], target: [0.9, 2.3, -0.2] },
      { id: 'VIEW_A', label: 'Firewall Gate', position: [-3.4, 4.2, 8.6], target: [-1.2, 2.0, 0.4] },
      { id: 'VIEW_B', label: 'C2 Tower', position: [7.8, 5.8, 9.6], target: [6.0, 3.6, -0.4] },
      { id: 'VIEW_C', label: 'SOC Radar', position: [2.2, 5.4, 4.8], target: [1.6, 2.0, -4.4] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'process-hollowing',
    sectionKey: 'memory-forensics',
    sceneKind: 'memory-vad-diff',
    stageBadge: 'MEMORY FORENSICS · ON-DISK VS LIVE RAM DIFF',
    mitreId: 'T1055.012',
    title: 'Signed On-Disk Blueprint vs Tampered RWX Memory',
    storyCue:
      'Place the bank’s original sealed truck blueprint next to an X-ray of the moving truck on the highway: the license plates match, yet the interior compartments have been completely replaced.',
    technicalCue:
      'PE-Sieve & Sysmon EID 25 compare signed on-disk SEC_IMAGE (R-X .text / RW- .data) against PID 4892 live RAM at 0x00400000: unbacked MEM_PRIVATE RWX (0x40) housing Cobalt Strike MZ shellcode.',
    accentHex: '#38BDF8',
    secondaryHex: '#F43F5E',
    durationSec: 15,
    callouts: [
      {
        id: 'disk-image',
        tag: 'SIGNED ON-DISK · SEC_IMAGE',
        title: 'Clean Disk Image',
        subtitle: 'System32\\svchost.exe · R-X / RW-',
        tone: 'sky',
      },
      {
        id: 'ram-tampered',
        tag: 'LIVE RAM · MEM_PRIVATE 0x40',
        title: 'Hollowed RWX RAM',
        subtitle: '0x00400000 · Unbacked Beacon MZ',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Disk Baseline',
        stageTag: 'VAD · ON-DISK',
        title: 'Inspect Signed Microsoft Blueprint',
        storyExcerpt:
          'On the left stands the bank’s sealed official blueprint with strict separated compartments.',
        technicalParallel:
          'On-disk svchost.exe maps file-backed SEC_IMAGE pages: R-- Header, R-X (0x20) .text, RW- (0x04) .data.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. PE-Sieve Diff',
        stageTag: 'VAD · SCANNER',
        title: 'Forensic Laser Exposes Unbacked RWX',
        storyExcerpt:
          'A golden comparison scanner sweeps across both monoliths, revealing swapped crimson cargo inside RAM.',
        technicalParallel:
          'PE-Sieve detects 0x00400000 MEM_PRIVATE PAGE_EXECUTE_READWRITE (0x40) holding injected 4D 5A MZ header.',
        accentHex: '#FACC15',
        startSec: 5,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. EID 25 Match',
        stageTag: 'VAD · TAMPERED',
        title: 'Confirmed Image Replacement Mismatch',
        storyExcerpt:
          'The plates match, but the live X-ray proves the original interior was hollowed and replaced.',
        technicalParallel:
          'Sysmon EventID 25 (Image is replaced) + Volatility malfind flag RCX = 0x004014A0 inside PID 4892.',
        accentHex: '#F43F5E',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 4.8, 11.8], target: [0, 2.1, 0] },
      { id: 'VIEW_A', label: 'Disk Image', position: [-5.2, 3.6, 7.6], target: [-3.4, 2.0, 0] },
      { id: 'VIEW_B', label: 'RWX RAM', position: [5.2, 3.6, 7.6], target: [3.4, 2.0, 0] },
      { id: 'VIEW_C', label: 'Diff Laser', position: [0, 6.6, 8.2], target: [0, 2.4, 0] },
    ],
  },
};

const SCENARIO_SECTION_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  'process-hollowing': PROCESS_HOLLOWING_SECTION_SCENES,
};

export function getSection3DDescriptor(
  scenarioId: string,
  sectionKey: Section3DKey
): Section3DDescriptor | null {
  return SCENARIO_SECTION_3D_REGISTRY[scenarioId]?.[sectionKey] ?? null;
}

export function hasSection3DScene(
  scenarioId: string,
  sectionKey: Section3DKey
): boolean {
  return getSection3DDescriptor(scenarioId, sectionKey) !== null;
}

export function listScenario3DSections(
  scenarioId: string
): Section3DDescriptor[] {
  const map = SCENARIO_SECTION_3D_REGISTRY[scenarioId];
  if (!map) return [];
  const orderedKeys: Section3DKey[] = [
    'briefing',
    'step-1',
    'step-2',
    'step-3',
    'step-4',
    'step-5',
    'memory-forensics',
  ];
  return orderedKeys
    .map((k) => map[k])
    .filter((d): d is Section3DDescriptor => Boolean(d));
}

export function stepNumberToSectionKey(
  stepNumber: number
): Section3DKey | null {
  if (stepNumber === 0) return 'briefing';
  if (stepNumber >= 1 && stepNumber <= 5) {
    return `step-${stepNumber}` as Section3DKey;
  }
  return null;
}

export function computeActivePhaseIndex(
  descriptor: Section3DDescriptor,
  timeSec: number
): number {
  const wrapped =
    ((timeSec % descriptor.durationSec) + descriptor.durationSec) %
    descriptor.durationSec;
  for (let i = 0; i < descriptor.phases.length; i += 1) {
    const p = descriptor.phases[i];
    if (wrapped >= p.startSec && wrapped < p.endSec) {
      return i;
    }
  }
  return descriptor.phases.length - 1;
}

export function getPhaseMidpointNormalized(
  descriptor: Section3DDescriptor,
  phaseIndex: number
): number {
  const clamped = Math.max(
    0,
    Math.min(descriptor.phases.length - 1, phaseIndex)
  );
  const ph = descriptor.phases[clamped];
  const mid = (ph.startSec + ph.endSec) * 0.5;
  return Math.max(0, Math.min(0.999, mid / descriptor.durationSec));
}

function normalizeSentenceForDedupe(text: string): string {
  return text
    .toLowerCase()
    .replace(/[“”"'`’‘—–-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strips any technical clause whose text is already verbatim contained inside
 * the section's Story Analogy block, and cleanly renumbers remaining clauses.
 */
export function deduplicateTechnicalClausesAgainstStory<
  T extends { clauseCode: string; fullText: string },
>(clauses: T[], storyAnalogy: string, clausePrefix: string): T[] {
  if (!clauses.length || !storyAnalogy) return clauses;
  const normStory = normalizeSentenceForDedupe(storyAnalogy);
  if (normStory.length < 24) return clauses;

  const filtered = clauses.filter((clause) => {
    const normClause = normalizeSentenceForDedupe(clause.fullText);
    if (normClause.length < 18) return true;
    return !normStory.includes(normClause);
  });

  const result = filtered.length > 0 ? filtered : clauses;
  return result.map((clause, idx) => ({
    ...clause,
    clauseCode: `${clausePrefix}.${idx + 1}`,
  }));
}
