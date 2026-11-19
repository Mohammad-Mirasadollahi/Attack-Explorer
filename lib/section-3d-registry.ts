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

export interface Section3DCalloutSpec {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  tone: 'sky' | 'rose' | 'amber' | 'emerald';
}

export interface Section3DPhaseSpec {
  id: number;
  label: string;
  caption: string;
  startSec: number;
  endSec: number;
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
}

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
        subtitle: 'svchost.exe · Official Plate BANK-01',
        tone: 'sky',
      },
      {
        id: 'hidden-intruder',
        tag: 'COVERT PAYLOAD',
        title: 'Hidden Intruder',
        subtitle: 'Cobalt Strike Beacon · Injected Cargo',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        label: 'Hire Truck',
        caption: 'Trusted armored truck arrives at dispatch garage.',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        label: 'Freeze',
        caption: 'Cryo stasis locks engine before route begins.',
        startSec: 4.5,
        endSec: 8.5,
      },
      {
        id: 3,
        label: 'Empty Cargo',
        caption: 'Legal bank bullion crates are unmapped from hold.',
        startSec: 8.5,
        endSec: 13,
      },
      {
        id: 4,
        label: 'Load Crew',
        caption: 'Covert crew boards the hollowed rear bay.',
        startSec: 13,
        endSec: 17.5,
      },
      {
        id: 5,
        label: 'Release',
        caption: 'Stasis shatters and truck launches toward gate.',
        startSec: 17.5,
        endSec: 21.5,
      },
      {
        id: 6,
        label: 'Pass Gate',
        caption: 'Security cameras approve trusted BANK-01 shell.',
        startSec: 21.5,
        endSec: 26,
      },
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
      'A stage director calls an official badge-carrying security guard onto the lit stage and hits the cyan Freeze button the instant the guard crosses the doorway—locking them mid-stride while taking the master keys.',
    technicalCue:
      'Invoice_Q4.exe (PID 3104) calls CreateProcessW(svchost.exe, CREATE_SUSPENDED = 0x00000004), freezing TID 4896 at RtlUserThreadStart and receiving master handles hProcess = 0x01C4 & hThread = 0x01C8.',
    accentHex: '#38BDF8',
    secondaryHex: '#FACC15',
    durationSec: 14,
    callouts: [
      {
        id: 'frozen-guard',
        tag: 'CREATE_SUSPENDED · 0x4',
        title: 'Frozen Guard',
        subtitle: 'svchost.exe · PID 4892 · TID 4896 Halted',
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
        label: 'Stage Call',
        caption: 'Director console summons signed guard svchost.exe through the doorway.',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        label: 'Time Freeze',
        caption: 'CREATE_SUSPENDED = 0x00000004 encases TID 4896 in cryo stasis.',
        startSec: 4.5,
        endSec: 9.5,
      },
      {
        id: 3,
        label: 'Key Return',
        caption: 'Kernel hands golden hProcess (0x01C4) & hThread (0x01C8) keys to loader.',
        startSec: 9.5,
        endSec: 14,
      },
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
      'While the armored truck stays frozen in the X-ray bay, overhead scanners locate the cargo manifest and slide every legal gold crate out the back—leaving a glowing hollow shell with its official plate intact.',
    technicalCue:
      'Loader reads PEB+0x10 (ImageBaseAddress = 0x00400000) via hProcess = 0x01C4 and invokes ntdll!NtUnmapViewOfSection, detaching the signed SEC_IMAGE VAD and returning STATUS_SUCCESS (0x00000000).',
    accentHex: '#22D3EE',
    secondaryHex: '#F59E0B',
    durationSec: 14,
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
        label: 'PEB Scan',
        caption: 'Cyan scanner reads PEB+0x10 to lock onto base address 0x00400000.',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        label: 'Unmap Cargo',
        caption: 'NtUnmapViewOfSection extracts legal gold crates & SEC_IMAGE code blocks.',
        startSec: 4.5,
        endSec: 9.8,
      },
      {
        id: 3,
        label: 'Empty Shell',
        caption: 'STATUS_SUCCESS confirms 0x00400000 is hollowed while outer badge remains.',
        startSec: 9.8,
        endSec: 14,
      },
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
      'Inside the emptied armored shell, covert gear and stacked crimson cargo modules stream into a glowing high-clearance vault while the route manual in the cab is silently rewritten.',
    technicalCue:
      'VirtualAllocEx reserves 264 KB of private PAGE_EXECUTE_READWRITE (0x40) RAM at 0x00400000; WriteProcessMemory streams 270,336 bytes of Cobalt Strike Beacon ("MZ" 4D 5A, .text, .rdata, .data).',
    accentHex: '#F43F5E',
    secondaryHex: '#A855F7',
    durationSec: 14,
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
        label: 'Alloc RWX',
        caption: 'VirtualAllocEx opens a 264 KB PAGE_EXECUTE_READWRITE (0x40) vault.',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        label: 'Write PE',
        caption: 'WriteProcessMemory streams MZ header and .text/.rdata/.data modules.',
        startSec: 4.5,
        endSec: 9.8,
      },
      {
        id: 3,
        label: 'Vault Armed',
        caption: '270,336 bytes committed in RAM; Sysmon EID 10 logs GrantedAccess 0x1FFFFF.',
        startSec: 9.8,
        endSec: 14,
      },
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
      'Before hitting Unfreeze, the intruder turns the armored cab steering wheel and snaps the holographic GPS onto their secret target—then shatters the cryo lock so the truck rockets onto the rogue route.',
    technicalCue:
      'SetThreadContext(hThread = 0x01C8) overwrites RCX → 0x004014A0; ResumeThread drops SuspendCount 1 → 0 to run Beacon inside TID 4896 while triggering Sysmon Event ID 25 (ProcessTampering).',
    accentHex: '#FB7185',
    secondaryHex: '#38BDF8',
    durationSec: 14,
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
        label: 'Hijack RCX',
        caption: 'Steering wheel & GPS needle snap from Microsoft entry to RCX = 0x004014A0.',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        label: 'Unfreeze',
        caption: 'ResumeThread decrements SuspendCount 1 → 0, shattering cryo lock.',
        startSec: 4.8,
        endSec: 9.5,
      },
      {
        id: 3,
        label: 'EID 25 Alert',
        caption: 'Execution rockets along TID 4896 while Sysmon EID 25 flags Image Replaced.',
        startSec: 9.5,
        endSec: 14,
      },
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
      'The disguised svchost.exe truck rolls past the perimeter gate guard under green clearance and opens a covert bridge to an external warehouse—until the SOC radar flags its unscheduled route.',
    technicalCue:
      'Hollowed svchost.exe (PID 4892) establishes TLS 1.3 HTTPS GET /jquery-3.3.1.min.js to 185.220.101.42:443 (60s / 20% jitter), caught by Sysmon EID 3 & Suricata JA3 72a589da586844d7f0818ce684948eea.',
    accentHex: '#10B981',
    secondaryHex: '#F43F5E',
    durationSec: 14,
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
        label: 'Gate Pass',
        caption: 'Host firewall gate reads svchost.exe signature and raises green barrier.',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        label: 'TLS 1.3 C2',
        caption: 'Encrypted /jquery-3.3.1.min.js beacons stream to 185.220.101.42:443.',
        startSec: 4.5,
        endSec: 9.5,
      },
      {
        id: 3,
        label: 'SOC Lock',
        caption: 'SOC radar correlates missing -k flag with Sysmon EID 3 & JA3 signature.',
        startSec: 9.5,
        endSec: 14,
      },
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
    durationSec: 14,
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
        label: 'Baseline',
        caption: 'Inspect signed on-disk svchost.exe layout (strict R-X .text & RW- .data).',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        label: 'VAD Diff',
        caption: 'PE-Sieve laser sweeps across 0x00400000 exposing unbacked RWX memory.',
        startSec: 4.5,
        endSec: 9.5,
      },
      {
        id: 3,
        label: 'Mismatch',
        caption: 'Sysmon EID 25 flags Image Replaced: RAM Beacon != Signed Disk File.',
        startSec: 9.5,
        endSec: 14,
      },
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
