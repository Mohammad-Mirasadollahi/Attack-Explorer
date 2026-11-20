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
  /** Plain-language, non-technical story object name (e.g. "Bank Truck") */
  title: string;
  /** Direct technical equivalent rendered underneath (e.g. "Trusted Host · svchost.exe") */
  subtitle: string;
  tone: 'sky' | 'rose' | 'amber' | 'emerald';
}

export interface StoryTechnicalMapping {
  /** Plain-language story character, prop, or action */
  storyTerm: string;
  /** Exact technical OS / API / telemetry counterpart */
  technicalTerm: string;
  tone: 'sky' | 'rose' | 'amber' | 'emerald';
}

export interface Section3DPhaseSpec {
  id: number;
  shortLabel: string;
  stageTag: string;
  title: string;
  /** 100% plain-language, jargon-free story beat matching what the 3D animation plays */
  storyExcerpt: string;
  /** Direct technical translation of that exact story beat */
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
  /** 100% plain-language, jargon-free story summary (Armored Bank Truck universe) */
  storyCue: string;
  /** Technical summary paired directly underneath the story */
  technicalCue: string;
  /** Explicit Story Element -> Technical Equivalent dictionary for this section */
  storyMappings: StoryTechnicalMapping[];
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
 * jargon-free story-then-technical mapping, HUD chrome, button placement, and display modes.
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
      'Hire an official armored bank truck, freeze it inside the garage before the driver starts the route, empty out all the legal bank gold, load your covert crew into the back of that exact truck, release the brake, and roll straight past the bank gate.',
    technicalCue:
      'CreateProcessW (CREATE_SUSPENDED) → NtUnmapViewOfSection → VirtualAllocEx (RWX) → WriteProcessMemory → SetThreadContext (RCX) → ResumeThread.',
    storyMappings: [
      {
        storyTerm: 'Official Armored Bank Truck',
        technicalTerm: 'Trusted Windows Host · svchost.exe (PID 4892)',
        tone: 'sky',
      },
      {
        storyTerm: 'Freezing Truck in the Garage',
        technicalTerm: 'CreateProcessW with CREATE_SUSPENDED (0x00000004)',
        tone: 'sky',
      },
      {
        storyTerm: 'Cargo-Door Master Key (Key #1)',
        technicalTerm: 'Process Handle hProcess (0x01C4) · Unlocks RAM Edits in Steps #2–#3',
        tone: 'amber',
      },
      {
        storyTerm: 'Cab & Ignition Master Key (Key #2)',
        technicalTerm: 'Thread Handle hThread (0x01C8) · Unlocks CPU Steer & Wake in Step #4',
        tone: 'amber',
      },
      {
        storyTerm: 'Emptying Gold & Loading Covert Crew',
        technicalTerm: 'NtUnmapViewOfSection + VirtualAllocEx (RWX) + WriteProcessMemory',
        tone: 'rose',
      },
      {
        storyTerm: 'Rolling Past Gate Guard & Cameras',
        technicalTerm: 'ResumeThread + Host Firewall Trusting Signed svchost.exe',
        tone: 'emerald',
      },
    ],
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
        storyExcerpt:
          'Instead of breaking down the front door in a ski mask, the intruder hires an official armored bank truck.',
        technicalParallel:
          'CreateProcessW("svchost.exe") initiates a Microsoft-signed Windows host process.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        shortLabel: '2. Freeze',
        stageTag: 'STAGE 02 · SUSPENDED',
        title: 'Freeze Truck Before Route Starts',
        storyExcerpt:
          'The intruder freezes the armored truck inside the garage before the driver even starts the route.',
        technicalParallel:
          'CREATE_SUSPENDED = 0x00000004 halts primary thread TID 4896 before its first instruction runs.',
        accentHex: '#22D3EE',
        startSec: 4.5,
        endSec: 8.5,
      },
      {
        id: 3,
        shortLabel: '3. Empty Cargo',
        stageTag: 'STAGE 03 · UNMAP',
        title: 'Empty Legal Bank Bullion Cargo',
        storyExcerpt:
          'Every crate of legal bank gold is emptied out of the frozen truck, leaving a hollow armored shell.',
        technicalParallel:
          'NtUnmapViewOfSection(0x00400000) vacates the signed svchost.exe SEC_IMAGE from RAM.',
        accentHex: '#FACC15',
        startSec: 8.5,
        endSec: 13,
      },
      {
        id: 4,
        shortLabel: '4. Load Crew',
        stageTag: 'STAGE 04 · INJECT',
        title: 'Load Covert Intruder Crew',
        storyExcerpt:
          'The intruder loads their own covert crew and mission crates into the empty back of that exact truck.',
        technicalParallel:
          'VirtualAllocEx (RWX 0x40) + WriteProcessMemory injects 264 KB of Cobalt Strike Beacon PE.',
        accentHex: '#F43F5E',
        startSec: 13,
        endSec: 17.5,
      },
      {
        id: 5,
        shortLabel: '5. Release',
        stageTag: 'STAGE 05 · RESUME',
        title: 'Release Freeze & Redirect Route',
        storyExcerpt:
          'The freeze shatters, the brake releases, and the hijacked truck launches toward the bank gate.',
        technicalParallel:
          'SetThreadContext (RCX = 0x004014A0) + ResumeThread wakes TID 4896 on the Beacon entry point.',
        accentHex: '#FB7185',
        startSec: 17.5,
        endSec: 21.5,
      },
      {
        id: 6,
        shortLabel: '6. Pass Gate',
        stageTag: 'STAGE 06 · EGRESS',
        title: 'Roll Past Bank Gate Undetected',
        storyExcerpt:
          'Every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform.',
        technicalParallel:
          'Host firewall trusts signed svchost.exe path during outbound TLS 1.3 C2 beacon traffic.',
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
    stageBadge: 'STEP #1 · GARAGE DISPATCH & FREEZE',
    mitreId: 'T1106',
    title: 'Hiring the Armored Bank Truck & Freezing It in the Garage',
    storyCue:
      'At the bank dispatch garage, the intruder calls in an official armored bank truck instead of showing up in a ski mask. The split-second the truck rolls into the private bay—before the driver can even start the route—the intruder hits a freeze switch that locks the whole truck in ice-blue stillness and pockets two golden master keys: the first master key unlocks the rear cargo doors so they can empty the gold and load their covert crew, and the second master key unlocks the driver cab so they can later change the GPS route and release the brake.',
    technicalCue:
      'Invoice_Q4.exe (PID 3104) calls CreateProcessW(svchost.exe, CREATE_SUSPENDED = 0x00000004, pausing primary thread TID 4896 at RtlUserThreadStart before code runs) and receives two master key handles: hProcess = 0x01C4 (permission token to inspect, empty, and rewrite RAM in Steps #2-#3) and hThread = 0x01C8 (permission token to steer CPU registers and resume TID 4896 in Step #4).',
    storyMappings: [
      {
        storyTerm: 'Intruder at Dispatch Desk',
        technicalTerm: 'Stage-1 Loader · Invoice_Q4.exe (PID 3104)',
        tone: 'rose',
      },
      {
        storyTerm: 'Official Armored Bank Truck',
        technicalTerm: 'Signed Windows Host · svchost.exe (PID 4892)',
        tone: 'sky',
      },
      {
        storyTerm: 'Garage Freeze Switch',
        technicalTerm: 'CREATE_SUSPENDED = 0x00000004 (Pauses TID 4896 Before Code Runs)',
        tone: 'sky',
      },
      {
        storyTerm: 'Cargo-Door Master Key (Key #1)',
        technicalTerm: 'Process Handle hProcess (0x01C4) · Unlocks RAM Edits in Steps #2–#3',
        tone: 'amber',
      },
      {
        storyTerm: 'Cab & Ignition Master Key (Key #2)',
        technicalTerm: 'Thread Handle hThread (0x01C8) · Unlocks CPU Steer & Wake in Step #4',
        tone: 'amber',
      },
      {
        storyTerm: 'Unusual Dispatch Caller Alert',
        technicalTerm: 'Sysmon Event ID 1 (Non-services.exe Parent Spawning svchost.exe)',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#FACC15',
    durationSec: 15,
    callouts: [
      {
        id: 'frozen-truck',
        tag: 'TRUSTED SHELL · FROZEN',
        title: 'Frozen Bank Truck',
        subtitle: 'svchost.exe · PID 4892 (CREATE_SUSPENDED)',
        tone: 'sky',
      },
      {
        id: 'master-keys',
        tag: 'MASTER CONTROL',
        title: 'Two Master Keys',
        subtitle: 'hProcess (Edit RAM) · hThread (Wake CPU)',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Hire Truck',
        stageTag: 'STEP 01 · DISPATCH',
        title: 'Official Armored Bank Truck Pulls Into Garage',
        storyExcerpt:
          'The intruder summons an official armored bank truck straight into the quiet dispatch bay.',
        technicalParallel:
          'Invoice_Q4.exe calls CreateProcessW("C:\\Windows\\System32\\svchost.exe") mapping the signed binary at 0x00400000.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Freeze Bay',
        stageTag: 'STEP 01 · SUSPENDED',
        title: 'Freeze Truck Before Driver Starts Route',
        storyExcerpt:
          'The intruder slams the freeze button on the desk, locking the truck motionless inside a glowing frost field.',
        technicalParallel:
          'CREATE_SUSPENDED = 0x00000004 parks primary thread TID 4896 at RtlUserThreadStart (SuspendCount = 1).',
        accentHex: '#22D3EE',
        startSec: 5,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. Pocket Keys',
        stageTag: 'STEP 01 · HANDLES',
        title: 'Intruder Pockets Both Master Keys (Cargo Bay & Cab)',
        storyExcerpt:
          'Two golden master keys glide to the intruder’s desk: Key #1 unlocks the cargo doors to swap the load, and Key #2 unlocks the cab to steer and wake the truck.',
        technicalParallel:
          'PROCESS_INFORMATION returns hProcess = 0x01C4 (RAM edit key) & hThread = 0x01C8 (CPU steer & resume key) with PROCESS_ALL_ACCESS (0x1FFFFF).',
        accentHex: '#FACC15',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [1.8, 5.4, 12.6], target: [0.3, 2.0, 0] },
      { id: 'VIEW_A', label: 'Garage Bay', position: [-5.4, 4.4, 8.6], target: [-1.4, 2.0, 0] },
      { id: 'VIEW_B', label: 'Frozen Truck', position: [-0.8, 3.6, 7.6], target: [-1.2, 1.9, 0] },
      { id: 'VIEW_C', label: 'Master Keys', position: [6.4, 4.2, 7.4], target: [2.8, 2.2, 0.4] },
    ],
  },

  'step-2': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-2',
    sceneKind: 'hollow-cargo-unmap',
    stageBadge: 'STEP #2 · EMPTYING LEGAL BANK CARGO',
    mitreId: 'T1055.012',
    title: 'Checking the Cargo Manifest & Emptying All Legal Bank Gold',
    storyCue:
      'While the armored bank truck sits frozen inside the garage, an overhead X-ray gantry scans the truck’s cargo manifest to locate every stacked gold crate. The heavy rear blast doors swing wide open and every crate of genuine bank bullion glides out and vanishes—leaving the truck completely hollow inside while its official bank paint and license plate stay untouched outside.',
    technicalCue:
      'Loader reads PEB+0x10 (ImageBaseAddress = 0x00400000) via hProcess = 0x01C4 and invokes ntdll!NtUnmapViewOfSection, detaching the signed SEC_IMAGE VAD and returning STATUS_SUCCESS (0x00000000).',
    storyMappings: [
      {
        storyTerm: 'Overhead Cargo Manifest Scan',
        technicalTerm: 'Reading PEB + 0x10 → ImageBaseAddress = 0x00400000',
        tone: 'sky',
      },
      {
        storyTerm: 'Genuine Bank Gold Crates',
        technicalTerm: 'Original Signed svchost.exe Code (SEC_IMAGE VAD)',
        tone: 'amber',
      },
      {
        storyTerm: 'Sliding All Gold Out the Back',
        technicalTerm: 'ntdll!NtUnmapViewOfSection → STATUS_SUCCESS (0x00000000)',
        tone: 'rose',
      },
      {
        storyTerm: 'Hollow Shell With Official Plate',
        technicalTerm: 'Empty 0x00400000 Slot Keeping Trusted svchost.exe Identity',
        tone: 'emerald',
      },
    ],
    accentHex: '#22D3EE',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'hollowed-shell',
        tag: 'EMPTY ARMORED SHELL',
        title: 'Empty Bank Truck',
        subtitle: 'svchost.exe · 0x00400000 Vacated',
        tone: 'sky',
      },
      {
        id: 'unmapped-cargo',
        tag: 'UNMAPPED LEGAL CARGO',
        title: 'Removed Bank Gold',
        subtitle: 'Signed SEC_IMAGE Stripped · STATUS_SUCCESS',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Scan Manifest',
        stageTag: 'STEP 02 · QUERY PEB',
        title: 'Locate Where the Bank Gold Is Stowed',
        storyExcerpt:
          'An overhead X-ray gantry scans the frozen armored truck to read its cargo manifest and pinpoint the gold compartment.',
        technicalParallel:
          'ReadProcessMemory(hProcess = 0x01C4, PEB + 0x10) resolves ImageBaseAddress = 0x00400000.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Empty Gold',
        stageTag: 'STEP 02 · UNMAP',
        title: 'Slide Out Every Legal Bank Gold Crate',
        storyExcerpt:
          'The rear blast doors swing wide open and every crate of legal bank gold glides down the unloading ramp and vanishes.',
        technicalParallel:
          'ntdll!NtUnmapViewOfSection(hProcess = 0x01C4, 0x00400000) detaches the signed svchost.exe SEC_IMAGE.',
        accentHex: '#F59E0B',
        startSec: 5,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Hollow Shell',
        stageTag: 'STEP 02 · VACATED',
        title: 'Armored Truck Hollowed With Plate Intact',
        storyExcerpt:
          'The cargo hold is now completely empty inside, while the bank’s official paint and license plate stay spotless outside.',
        technicalParallel:
          'Kernel returns NTSTATUS = 0x00000000 (STATUS_SUCCESS); address 0x00400000 is ready for replacement code.',
        accentHex: '#22D3EE',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [-0.8, 5.4, 12.2], target: [-2.1, 2.0, 0] },
      { id: 'VIEW_A', label: 'Manifest Arch', position: [-1.6, 5.8, 8.8], target: [-1.8, 3.2, 0] },
      { id: 'VIEW_B', label: 'Hollow Bay', position: [-1.4, 2.9, 6.6], target: [-2.1, 1.9, 0] },
      { id: 'VIEW_C', label: 'Unloading Ramp', position: [-7.4, 3.8, 7.2], target: [-4.6, 1.6, 0] },
    ],
  },

  'step-3': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-3',
    sceneKind: 'rwx-vault-inject',
    stageBadge: 'STEP #3 · LOADING COVERT CREW INTO TRUCK',
    mitreId: 'T1055.012',
    title: 'Carving Out a Secret Bay & Loading the Covert Crew Inside',
    storyCue:
      'Inside the empty rear hold of that exact armored bank truck, the intruder unlocks a hidden high-clearance cargo bay with no restrictions, then marches their covert crew and mission crate right up the rear ramp into the hollowed truck—sealing the doors shut without leaving a single scratch on the bank’s official exterior.',
    technicalCue:
      'VirtualAllocEx reserves 264 KB of private PAGE_EXECUTE_READWRITE (0x40) RAM at 0x00400000; WriteProcessMemory writes 270,336 bytes of Cobalt Strike Beacon ("MZ" 4D 5A, .text, .rdata, .data) directly into RAM.',
    storyMappings: [
      {
        storyTerm: 'Unlocked Secret Cargo Bay',
        technicalTerm: 'VirtualAllocEx · 264 KB Private RWX Memory (0x40 @ 0x00400000)',
        tone: 'amber',
      },
      {
        storyTerm: 'Covert Crew & Mission Crate Boarding',
        technicalTerm: 'WriteProcessMemory · 270,336 Bytes Cobalt Strike Beacon PE',
        tone: 'rose',
      },
      {
        storyTerm: 'Untouched Bank Truck Exterior',
        technicalTerm: 'Signed svchost.exe Shell (Zero Malicious Files Written to Disk)',
        tone: 'sky',
      },
      {
        storyTerm: 'Overhead Garage Tamper Light',
        technicalTerm: 'Sysmon Event ID 10 (GrantedAccess = 0x1FFFFF) & ETW-Ti',
        tone: 'emerald',
      },
    ],
    accentHex: '#F43F5E',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'secret-cargo-bay',
        tag: 'UNLOCKED INTERIOR BAY',
        title: 'Secret Cargo Bay',
        subtitle: 'VirtualAllocEx · 264 KB RWX (0x40)',
        tone: 'amber',
      },
      {
        id: 'covert-crew',
        tag: 'BOARDING PAYLOAD',
        title: 'Covert Crew Boarding',
        subtitle: 'WriteProcessMemory · Cobalt Strike Beacon',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Secret Bay',
        stageTag: 'STEP 03 · ALLOCATE',
        title: 'Unlock Hidden Compartment Inside Empty Truck',
        storyExcerpt:
          'Inside the emptied armored truck, a glowing crimson secret bay opens up with every security lock disabled.',
        technicalParallel:
          'VirtualAllocEx(hProcess = 0x01C4, 0x00400000, 264 KB, PAGE_EXECUTE_READWRITE = 0x40) commits private RAM.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Board Crew',
        stageTag: 'STEP 03 · WRITE',
        title: 'March Covert Crew & Mission Crate Inside',
        storyExcerpt:
          'The covert crew and their glowing crimson mission crate march up the rear loading ramp into the hollow bank truck.',
        technicalParallel:
          'WriteProcessMemory streams 270,336 bytes (MZ 4D 5A header + Cobalt Strike Beacon sections) into RAM.',
        accentHex: '#F43F5E',
        startSec: 4.8,
        endSec: 10.6,
      },
      {
        id: 3,
        shortLabel: '3. Seal Doors',
        stageTag: 'STEP 03 · EID 10',
        title: 'Seal Blast Doors Around Untouched Exterior',
        storyExcerpt:
          'The rear doors swing shut, hiding the covert crew inside the bank’s own trusted paint job while a garage sensor flashes.',
        technicalParallel:
          'Sysmon Event ID 10 (GrantedAccess = 0x1FFFFF) & ETW-Ti flag unbacked 264 KB RWX memory with an MZ header.',
        accentHex: '#A855F7',
        startSec: 10.6,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [-0.8, 5.0, 11.8], target: [-0.8, 1.9, 0] },
      { id: 'VIEW_A', label: 'Secret Bay', position: [1.2, 3.1, 6.8], target: [0.4, 1.9, 0] },
      { id: 'VIEW_B', label: 'Boarding Ramp', position: [-6.4, 3.6, 7.6], target: [-3.4, 1.5, 0] },
      { id: 'VIEW_C', label: 'Roof Sensor', position: [0.5, 8.2, 5.8], target: [0.4, 1.8, 0] },
    ],
  },

  'step-4': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-4',
    sceneKind: 'cockpit-gps-hijack',
    stageBadge: 'STEP #4 · REPROGRAMMING GPS & RELEASING BRAKE',
    mitreId: 'T1055.012',
    title: 'Reprogramming the Truck GPS & Releasing the Brake',
    storyCue:
      'With the covert crew hidden in the back, the intruder leans into the frozen truck’s cab before unfreezing it. They turn the steering wheel hard, erase the bank’s scheduled route on the dashboard GPS, lock in their own secret destination, and shatter the freeze lock—releasing the handbrake so the official bank truck roars out onto the intruder’s route.',
    technicalCue:
      'SetThreadContext(hThread = 0x01C8) overwrites RCX → 0x004014A0; ResumeThread drops SuspendCount 1 → 0 to run Beacon inside TID 4896 while triggering Sysmon Event ID 25 (ProcessTampering).',
    storyMappings: [
      {
        storyTerm: 'Truck Cab Steering & Dashboard GPS',
        technicalTerm: 'Frozen Thread Context · TID 4896 (hThread = 0x01C8)',
        tone: 'sky',
      },
      {
        storyTerm: 'Dialing Secret Destination on GPS',
        technicalTerm: 'SetThreadContext · Overwrites RCX → 0x004014A0 (Beacon Entry)',
        tone: 'rose',
      },
      {
        storyTerm: 'Shattering Freeze & Releasing Brake',
        technicalTerm: 'ResumeThread · SuspendCount 1 → 0 (Starts Execution)',
        tone: 'amber',
      },
      {
        storyTerm: 'Overhead Garage Tamper Wave',
        technicalTerm: 'Sysmon Event ID 25 (ProcessTampering: "Image is replaced")',
        tone: 'emerald',
      },
    ],
    accentHex: '#FB7185',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'reprogrammed-gps',
        tag: 'ROUTE OVERWRITTEN',
        title: 'Reprogrammed Truck GPS',
        subtitle: 'SetThreadContext · RCX → 0x004014A0',
        tone: 'rose',
      },
      {
        id: 'brake-released',
        tag: 'FREEZE SHATTERED',
        title: 'Brake Released',
        subtitle: 'ResumeThread · TID 4896 Active (1 → 0)',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Hijack GPS',
        stageTag: 'STEP 04 · CONTEXT',
        title: 'Turn Steering Wheel & Lock Secret GPS Route',
        storyExcerpt:
          'Inside the frozen truck cab, the steering wheel cranks hard and the dashboard GPS snaps onto the intruder’s secret destination.',
        technicalParallel:
          'SetThreadContext(hThread = 0x01C8) overwrites KTRAP_FRAME.Rcx → 0x004014A0 (Base + EntryPoint RVA).',
        accentHex: '#F43F5E',
        startSec: 0,
        endSec: 5.2,
      },
      {
        id: 2,
        shortLabel: '2. Release Brake',
        stageTag: 'STEP 04 · RESUME',
        title: 'Shatter Freeze Lock & Launch the Bank Truck',
        storyExcerpt:
          'The ice-blue freeze dome shatters into shards, the brake releases, and the hijacked bank truck roars out of the garage.',
        technicalParallel:
          'ResumeThread(hThread = 0x01C8) decrements SuspendCount 1 → 0, waking TID 4896 to run Cobalt Strike inside svchost.exe.',
        accentHex: '#38BDF8',
        startSec: 5.2,
        endSec: 10.4,
      },
      {
        id: 3,
        shortLabel: '3. Tamper Pulse',
        stageTag: 'STEP 04 · EID 25',
        title: 'Garage Sensor Detects Swapped Interior Moving',
        storyExcerpt:
          'As the truck speeds down the exit lane, an amber security alarm wave ripples overhead after sensing the swapped cargo.',
        technicalParallel:
          'Sysmon Event ID 25 (ProcessTampering: "Image is replaced") fires as RAM @ 0x00400000 mismatches disk.',
        accentHex: '#F59E0B',
        startSec: 10.4,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.4, 5.4, 13.4], target: [0.4, 2.2, 0] },
      { id: 'VIEW_A', label: 'Cab GPS', position: [-3.4, 4.8, 7.6], target: [-2.6, 3.6, 0.2] },
      { id: 'VIEW_B', label: 'Launch Lane', position: [4.6, 3.8, 8.8], target: [2.4, 1.8, 0] },
      { id: 'VIEW_C', label: 'Tamper Wave', position: [2.8, 7.2, 8.8], target: [2.2, 2.4, 0] },
    ],
  },

  'step-5': {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-5',
    sceneKind: 'firewall-c2-bridge',
    stageBadge: 'STEP #5 · GATE PASSAGE & SECRET WAREHOUSE',
    mitreId: 'T1071.001',
    title: 'Rolling Past the Checkpoint Guard to the Secret Warehouse',
    storyCue:
      'The disguised armored truck now rolls up to the high-security checkpoint gate. The cameras read the bank’s official license plate, the uniformed guard smiles and raises the barrier, and the truck opens a hidden encrypted courier line straight to the intruder’s remote warehouse—until a watchful control-room radar notices the truck drove out on an unscheduled route.',
    technicalCue:
      'Hollowed svchost.exe (PID 4892) establishes TLS 1.3 HTTPS GET /jquery-3.3.1.min.js to 185.220.101.42:443 (60s / 20% jitter), caught by Sysmon EID 3 & Suricata JA3 72a589da586844d7f0818ce684948eea.',
    storyMappings: [
      {
        storyTerm: 'Checkpoint Gate & Saluting Guard',
        technicalTerm: 'Host Firewall Allowing Signed C:\\Windows\\System32\\svchost.exe',
        tone: 'emerald',
      },
      {
        storyTerm: 'Hidden Encrypted Courier Line',
        technicalTerm: 'TLS 1.3 HTTPS Beacon · GET /jquery-3.3.1.min.js (60s ±20%)',
        tone: 'sky',
      },
      {
        storyTerm: 'Remote Secret Warehouse',
        technicalTerm: 'Attacker C2 Server · 185.220.101.42:443',
        tone: 'rose',
      },
      {
        storyTerm: 'Watchful Control-Room Radar',
        technicalTerm: 'Sysmon Event ID 3 + Suricata IDS (JA3 Fingerprint & Bare svchost)',
        tone: 'amber',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#F43F5E',
    durationSec: 15,
    callouts: [
      {
        id: 'disguised-truck',
        tag: 'TRUSTED EXTERIOR · ALLOWED',
        title: 'Disguised Bank Truck',
        subtitle: 'svchost.exe (PID 4892) · Firewall Permitted',
        tone: 'emerald',
      },
      {
        id: 'secret-warehouse',
        tag: 'COVERT DESTINATION',
        title: 'Secret Remote Warehouse',
        subtitle: 'C2 Server · 185.220.101.42:443',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Pass Gate',
        stageTag: 'STEP 05 · BYPASS',
        title: 'Checkpoint Guard Waves Trusted Bank Truck Through',
        storyExcerpt:
          'Security cameras verify the bank’s official license plate, the guard salutes, and the striped barrier lifts.',
        technicalParallel:
          'Host application firewall trusts signed path C:\\Windows\\System32\\svchost.exe for outbound TCP/443.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Courier Line',
        stageTag: 'STEP 05 · BEACON',
        title: 'Open Encrypted Courier Line to Secret Warehouse',
        storyExcerpt:
          'Disguised courier packets arch out from the rolling bank truck straight into the intruder’s dark crimson warehouse tower.',
        technicalParallel:
          'winhttp.dll opens TLS 1.3 HTTPS GET /jquery-3.3.1.min.js to 185.220.101.42:443 (60s ±20% jitter).',
        accentHex: '#F43F5E',
        startSec: 5,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Radar Lock',
        stageTag: 'STEP 05 · SIEM / IDS',
        title: 'Control-Room Radar Spots Unscheduled Trip',
        storyExcerpt:
          'A rotating amber control-room radar locks onto the truck after spotting it left without an official service dispatch slip.',
        technicalParallel:
          'Sysmon Event ID 3 + Suricata IDS correlate bare svchost.exe (no -k flag) with Cobalt Strike JA3 signature.',
        accentHex: '#F59E0B',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.8, 6.2, 14.2], target: [0.9, 2.3, -0.2] },
      { id: 'VIEW_A', label: 'Bank Gate', position: [-3.4, 4.2, 8.6], target: [-1.2, 2.0, 0.4] },
      { id: 'VIEW_B', label: 'Warehouse', position: [7.8, 5.8, 9.6], target: [6.0, 3.6, -0.4] },
      { id: 'VIEW_C', label: 'Radar Dish', position: [2.2, 5.4, 4.8], target: [1.6, 2.0, -4.4] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'process-hollowing',
    sectionKey: 'memory-forensics',
    sceneKind: 'memory-vad-diff',
    stageBadge: 'MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON',
    mitreId: 'T1055.012',
    title: 'Official Factory Bank Truck vs. Live Highway X-Ray',
    storyCue:
      'Park the bank’s original factory truck right beside a live X-ray of the hijacked armored truck rolling down the highway. On the outside, both trucks wear the exact same official paint and license plate—but when the forensic X-ray scanner sweeps across both vehicles side by side, the factory truck holds neat sealed gold bars while the highway truck is packed inside with the glowing covert crew.',
    technicalCue:
      'PE-Sieve & Sysmon EID 25 compare signed on-disk SEC_IMAGE (R-X .text / RW- .data) against PID 4892 live RAM at 0x00400000: unbacked MEM_PRIVATE RWX (0x40) housing Cobalt Strike MZ shellcode.',
    storyMappings: [
      {
        storyTerm: 'Factory Bank Truck With Gold (Left)',
        technicalTerm: 'Signed On-Disk svchost.exe · File-Backed SEC_IMAGE (R-X / RW-)',
        tone: 'sky',
      },
      {
        storyTerm: 'Highway Truck With Covert Crew (Right)',
        technicalTerm: 'Live Hollowed RAM @ 0x00400000 · Unbacked MEM_PRIVATE RWX (0x40)',
        tone: 'rose',
      },
      {
        storyTerm: 'Sweeping Forensic X-Ray Beam',
        technicalTerm: 'PE-Sieve & Volatility malfind Comparing Disk vs. RAM Pages',
        tone: 'amber',
      },
      {
        storyTerm: 'Same License Plate, Swapped Cargo Alarm',
        technicalTerm: 'Sysmon Event ID 25 (ProcessTampering: "Image is replaced")',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#F43F5E',
    durationSec: 15,
    callouts: [
      {
        id: 'factory-truck',
        tag: 'ON-DISK ORIGINAL · CLEAN',
        title: 'Official Factory Truck',
        subtitle: 'Signed On-Disk svchost.exe (SEC_IMAGE)',
        tone: 'sky',
      },
      {
        id: 'highway-truck',
        tag: 'LIVE MEMORY · SWAPPED',
        title: 'Hijacked Highway Truck',
        subtitle: 'Hollowed RAM · MEM_PRIVATE RWX (0x40)',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Factory Truck',
        stageTag: 'X-RAY · ON-DISK',
        title: 'Inspect the Official Factory Bank Truck',
        storyExcerpt:
          'On the left sits the bank’s untouched factory truck carrying neatly sealed, legitimate gold bullion crates.',
        technicalParallel:
          'On-disk svchost.exe maps file-backed SEC_IMAGE pages: R-- Header, R-X (0x20) .text, and RW- (0x04) .data.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. X-Ray Sweep',
        stageTag: 'X-RAY · PE-SIEVE',
        title: 'Forensic X-Ray Sweeps Both Trucks Side by Side',
        storyExcerpt:
          'A golden comparison beam glides across both trucks, exposing the glowing covert crew hidden behind the matching bank paint.',
        technicalParallel:
          'PE-Sieve detects unbacked MEM_PRIVATE PAGE_EXECUTE_READWRITE (0x40) memory at 0x00400000 holding an MZ header.',
        accentHex: '#FACC15',
        startSec: 5,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Mismatch Proof',
        stageTag: 'X-RAY · EID 25',
        title: 'Matching Plates Cannot Hide the Replaced Cargo',
        storyExcerpt:
          'Both trucks share the exact same license plate outside, yet the side-by-side X-ray proves the interior was completely swapped.',
        technicalParallel:
          'Sysmon Event ID 25 ("Image is replaced") + Volatility malfind flag RCX = 0x004014A0 inside PID 4892.',
        accentHex: '#F43F5E',
        startSec: 10.2,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 6.2, 14.8], target: [0, 1.9, 0] },
      { id: 'VIEW_A', label: 'Factory Truck', position: [-6.4, 4.2, 8.8], target: [-4.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Highway Truck', position: [6.4, 4.2, 8.8], target: [4.4, 1.8, 0] },
      { id: 'VIEW_C', label: 'X-Ray Gantry', position: [0, 8.6, 8.4], target: [0, 2.2, 0] },
    ],
  },
};

const SCENARIO_SECTION_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  'process-hollowing': PROCESS_HOLLOWING_SECTION_SCENES,
};

/**
 * Technical tokens that must NEVER pollute plain-language Story blocks
 * (`storyCue`, `phase.storyExcerpt`, `callout.title`, or `storyAnalogy`).
 */
const STORY_FORBIDDEN_TECHNICAL_PATTERNS: readonly RegExp[] = [
  /\bsvchost(?:\.exe)?\b/i,
  /\binvoice_q4(?:\.exe)?\b/i,
  /\b0x[0-9a-f]+\b/i,
  /\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/,
  /\bCVE-\d{4}-\d+\b/i,
  /\bT\d{4}(?:\.\d{3})?\b/,
  /\b(?:PID|TID|PPID)\s*\d+\b/i,
  /\b(?:Sysmon|EventID|Event\s*ID|EID\s*\d+)\b/i,
  /\b[A-Za-z0-9_-]+\.(?:exe|dll|sys|ps1|sh|py|class|jar|vhdx|lnk|bat|php|jsp|aspx|so|ko|elf|dit|dmp|evtx|msi|vbs|yml|yaml|json|xml|conf|cfg|log|bin|db)\b/i,
  /(?:\/(?:etc|var|usr|tmp|proc|bin|dev|opt|root)\/|C:\\|[A-Z]:\\|HKLM\\|HKCU\\|\\\\\*\\)/i,
  /\b(?:TCP|UDP)\/\d+\b|\bport\s+\d+\b/i,
  /\$\{[^}]+\}|https?:\/\/|ldap:\/\/|smb:\/\//i,
  /\bPEB\+?/i,
  /\bRWX\b/,
  /\bRCX\b/,
  /\bMZ\b/,
  /\.(?:text|rdata|data)\b/i,
  /\b(?:CreateProcessW?|NtUnmapViewOfSection|VirtualAllocEx|WriteProcessMemory|SetThreadContext|ResumeThread|DeviceIoControl|OpenProcess|CreateRemoteThread|AmsiScanBuffer|NtCreateUserProcess|shell_exec|file_put_contents|include_once|xp_cmdshell|sp_OACreate|javaCodeBase|URLClassLoader|InitialContext|AdjustTokenPrivileges|SetNotifyCmdLine|LoadLibrary|GetProcAddress|MiniDump|UNION\s+SELECT)\b/i,
  /\b(?:SEC_IMAGE|MEM_PRIVATE|PE-Sieve|JA3|JA4|EPROCESS|KTRAP_FRAME|IOCTL|eBPF|BYOVD|CAP_SYS_ADMIN|CAP_SYS_MODULE|DRSUAPI|LSASS|NTDS|AMSI|ETW|JNDI|LDAP|Kerberos|NTLM|SMB|RDP|SSH|DNS|HTTP|HTTPS|TLS|SSL|WAF|EDR|SIEM|XDR|OAuth2?|SAML|JWT|RBAC|IAM|Kubelet|Kubernetes|Docker|JVM|CLR|WMI|WinRM|SQLi?|XSS|CSRF|SSRF|RCE|C2|API|DLL|ELF|Base64|RC4|AES|RSA|SHA256|PowerShell|Modbus|SCADA|PLC|SS7|GTP|5G|Splunk|Sysinternals|Auditd|Volatility|Suricata|Zeek|Falco|Tetragon|ModSecurity|Nginx|Apache|IIS|ESXi|vCenter|FortiGate|Ivanti|Citrix|Active\s+Directory|Domain\s+Controller|Windows\s+Registry|Mark-of-the-Web|SmartScreen|Volume\s+Shadow\s+Copy)\b/,
];

/**
 * Returns any forbidden technical jargon matches found in a plain-language story text.
 * An empty array means the story is 100% accessible and jargon-free.
 */
export function findTechnicalJargonInStory(text: string): string[] {
  const hits: string[] = [];
  for (const rx of STORY_FORBIDDEN_TECHNICAL_PATTERNS) {
    const m = text.match(rx);
    if (m) hits.push(m[0]);
  }
  return hits;
}

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
