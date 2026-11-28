import type {
  Section3DDescriptor,
  Section3DKey,
} from './section-3d-registry';

const SCENARIO_ID = 'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626';

export const RUNC_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: SCENARIO_ID,
    sectionKey: 'briefing',
    sceneKind: 'runc-drydock-briefing',
    stageBadge: 'BRIEFING #0 · SUBMARINE DRYDOCK BULKHEAD DIORAMA',
    mitreId: 'T1611',
    title: 'Forgotten Steel Hull Hatch - runc Leaky Vessels Container Escape',
    storyCue:
      'While sealing a cobalt diving pod inside the naval drydock, the crane leaves brass inspection hatch seven cracked open, letting a clever diver plant their boots on the outer rim and climb straight onto the shipyard engine deck until an emerald automatic latch seals the hull.',
    technicalCue:
      'runc 1.1.11 Leaks Host /sys/fs/cgroup (fd 7) -> WORKDIR /proc/self/fd/7 -> ../../../etc/shadow Escape -> Patched runc 1.1.12 verifyCwd.',
    storyMappings: [
      {
        storyTerm: 'Sealed Cobalt Diving Pod',
        technicalTerm: 'Isolated Linux Container Mount Namespace & RootFS',
        tone: 'sky',
      },
      {
        storyTerm: 'Unbolted Brass Hull Hatch Seven',
        technicalTerm: 'Leaked Host File Descriptor fd/7 Pointing to /sys/fs/cgroup',
        tone: 'amber',
      },
      {
        storyTerm: 'Tampered Floor Nameplate',
        technicalTerm: 'Malicious OCI Image WORKDIR /proc/self/fd/7 Directive',
        tone: 'rose',
      },
      {
        storyTerm: 'Three Exterior Steel Rungs',
        technicalTerm: 'Relative Parent Path Traversal (../../../etc/shadow)',
        tone: 'rose',
      },
      {
        storyTerm: 'Shipyard Master Key Locker',
        technicalTerm: 'Host /etc/shadow & /var/lib/kubelet/pki Node Certificates',
        tone: 'amber',
      },
      {
        storyTerm: 'Emerald Automatic Hull Latch',
        technicalTerm: 'Patched runc v1.1.12+ O_CLOEXEC & verifyCwd Guard',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'hull-hatch',
        tag: 'LEAKED HANDLE',
        title: 'Forgotten Hull Hatch',
        subtitle: 'fd/7 · /sys/fs/cgroup',
        tone: 'amber',
      },
      {
        id: 'engine-deck',
        tag: 'HOST BREAKOUT',
        title: 'Shipyard Engine Deck',
        subtitle: '../../../etc/shadow · Kubelet PKI',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Open Hatch',
        stageTag: 'ACT 1 · LEAK',
        title: 'Drydock Crane Leaves Brass Hatch Seven Unbolted',
        storyExcerpt:
          'After adjusting an outside hull valve, the launch crane swings away leaving small brass hatch seven cracked open.',
        technicalParallel:
          'runc v1.1.11 opens host /sys/fs/cgroup on fd 7 without closing it before chdir.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.2,
      },
      {
        id: 2,
        shortLabel: '2. Floor Pin',
        stageTag: 'ACT 2 · WORKDIR',
        title: 'Blueprint Plants Diver Boots Inside the Outer Hatch Frame',
        storyExcerpt:
          'A tampered brass floorplate seats the incoming diver directly inside the exterior hatchway before launch.',
        technicalParallel:
          'Malicious WORKDIR /proc/self/fd/7 runs chdir onto the leaked host cgroup mount.',
        accentHex: '#38BDF8',
        startSec: 4.2,
        endSec: 8.8,
      },
      {
        id: 3,
        shortLabel: '3. Deck Climb',
        stageTag: 'ACT 3 · ESCAPE',
        title: 'Diver Climbs Three Steel Rungs Onto the Shipyard Deck',
        storyExcerpt:
          'Without touching the sealed bulkhead door, the diver steps straight up the outer ladder to the master key locker.',
        technicalParallel:
          'Container shell reads ../../../etc/shadow and ../../../var/lib/kubelet/pki on host.',
        accentHex: '#E11D48',
        startSec: 8.8,
        endSec: 13.8,
      },
      {
        id: 4,
        shortLabel: '4. Hull Alarm',
        stageTag: 'ACT 4 · DETECT',
        title: 'Deck Vibration Sensors Catch Out-of-Bounds Footprints',
        storyExcerpt:
          'Hull motion beacons flare amber along the drydock catwalk as unauthorized steps hit the shipyard floor.',
        technicalParallel:
          'Falco eBPF and Linux auditd alert on container cwd outside container rootfs.',
        accentHex: '#F43F5E',
        startSec: 13.8,
        endSec: 17.0,
      },
      {
        id: 5,
        shortLabel: '5. Emerald Seal',
        stageTag: 'ACT 5 · PATCH',
        title: 'Automatic Emerald Bulkhead Latch Locks Hatch Seven Shut',
        storyExcerpt:
          'The upgraded drydock clamps an emerald hydraulic latch over hatch seven before anyone enters the pod.',
        technicalParallel:
          'Patched runc v1.1.12+ enforces O_CLOEXEC and verifyCwd, aborting breakout.',
        accentHex: '#10B981',
        startSec: 17.0,
        endSec: 20.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 7.2, 16.0], target: [0, 2.0, 0] },
      { id: 'VIEW_A', label: 'Diving Pod', position: [-6.6, 4.4, 9.4], target: [-4.8, 1.8, 0] },
      { id: 'VIEW_B', label: 'Hull Hatch', position: [0.4, 4.4, 8.8], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Engine Deck', position: [6.8, 4.8, 9.6], target: [4.8, 2.0, 0] },
    ],
  },
  'step-1': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-1',
    sceneKind: 'runc-step1-fdleak',
    stageBadge: 'STEP #1 · LEAKED HOST /sys/fs/cgroup FILE DESCRIPTOR (FD 7)',
    mitreId: 'T1611',
    title: 'Drydock Crane Leaves Hull Inspection Hatch Seven Unbolted',
    storyCue:
      'While tightening an outside pressure gauge on the cobalt diving pod, the drydock launcher forgets to close brass hatch seven, leaving an open window directly onto the shipyard frame.',
    technicalCue:
      'runc v1.1.11 openat("/sys/fs/cgroup") -> fd 7 remains open during init before execve -> CVE-2024-21626.',
    storyMappings: [
      {
        storyTerm: 'Drydock Launch Arm',
        technicalTerm: 'runc:[2:INIT] Container Initialization Process (v1.1.11)',
        tone: 'sky',
      },
      {
        storyTerm: 'Outside Pressure Valve',
        technicalTerm: 'Host /sys/fs/cgroup Resource Quota Directory',
        tone: 'amber',
      },
      {
        storyTerm: 'Cracked Brass Hatch Seven',
        technicalTerm: 'Unclosed Host File Descriptor fd/7 Exposed in /proc/self/fd',
        tone: 'rose',
      },
      {
        storyTerm: 'Drydock Inspection Gauge',
        technicalTerm: 'Linux auditd openat() Syscall 257 Telemetry Record',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step1-porthole',
        tag: 'HOST HANDLE',
        title: 'Outer Pressure Valve',
        subtitle: 'openat /sys/fs/cgroup · fd 7',
        tone: 'amber',
      },
      {
        id: 'step1-hatch',
        tag: 'UNCLOSED LEAK',
        title: 'Cracked Brass Hatch',
        subtitle: 'runc 1.1.11 · CVE-2024-21626',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Valve Open',
        stageTag: 'PHASE 1 · INIT',
        title: 'Launcher Reaches Through the Hull to Tune the Outside Valve',
        storyExcerpt:
          'A mechanical crane arm opens brass inspection hatch seven to tighten an exterior shipyard gauge.',
        technicalParallel:
          'runc:[2:INIT] calls openat("/sys/fs/cgroup", O_RDONLY|O_DIRECTORY), receiving fd 7.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Left Ajar',
        stageTag: 'PHASE 2 · LEAK',
        title: 'Crane Withdraws Leaving Brass Hatch Seven Cracked Open',
        storyExcerpt:
          'The crane pulls back to finish sealing the cabin while the brass hatch remains propped wide open.',
        technicalParallel:
          'Internal host descriptor fd 7 stays open across the container directory setup step.',
        accentHex: '#F59E0B',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Open Link',
        stageTag: 'PHASE 3 · EXPOSED',
        title: 'Glowing Rim Reveals Direct Path to the Outer Shipyard',
        storyExcerpt:
          'A crimson rim glows around hatch seven, marking a live opening straight outside the diving pod.',
        technicalParallel:
          '/proc/self/fd/7 resolves directly to the host mount namespace outside container rootfs.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Pod Cabin', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Brass Hatch', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Outer Valve', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'step-2': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-2',
    sceneKind: 'runc-step2-workdir',
    stageBadge: 'STEP #2 · MALICIOUS WORKDIR /proc/self/fd/7 CWD PIVOT',
    mitreId: 'T1611',
    title: 'Tampered Blueprint Plants Diver Boots Inside Open Hull Hatch Seven',
    storyCue:
      'A crafted brass nameplate arrives on the pod manifest directing the launcher to plant the diver starting boots right inside unbolted hatch seven, bypassing the sealed interior floor.',
    technicalCue:
      'OCI Manifest WORKDIR /proc/self/fd/7 -> runc chdir("/proc/self/fd/7") -> task_struct->fs->pwd pinned on host mount.',
    storyMappings: [
      {
        storyTerm: 'Tampered Brass Nameplate',
        technicalTerm: 'Malicious Dockerfile Directive WORKDIR /proc/self/fd/7',
        tone: 'rose',
      },
      {
        storyTerm: 'Starting Boot Pedestal',
        technicalTerm: 'Container Initial Process Working Directory (fs->pwd)',
        tone: 'amber',
      },
      {
        storyTerm: 'Bypassed Cabin Bulkhead',
        technicalTerm: 'Container pivot_root Mount Namespace Isolation Boundary',
        tone: 'sky',
      },
      {
        storyTerm: 'Manifest Audit Clipboard',
        technicalTerm: 'Kubernetes API Audit & Kyverno Admission Inspection',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step2-sign',
        tag: 'OCI MANIFEST',
        title: 'Tampered Floor Sign',
        subtitle: 'WORKDIR /proc/self/fd/7',
        tone: 'amber',
      },
      {
        id: 'step2-deck',
        tag: 'OUTSIDE ROOTFS',
        title: 'Outer Hatch Rim',
        subtitle: 'chdir -> Host Mount Namespace',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Blueprint In',
        stageTag: 'PHASE 1 · SPEC',
        title: 'Crafted Blueprint Enters the Drydock Launch Queue',
        storyExcerpt:
          'A crimson brass manifest drops onto the launcher desk naming hatch frame seven as the starting floor.',
        technicalParallel:
          'Kubernetes schedules builder-job-9f2a with OCI config process.cwd="/proc/self/fd/7".',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Boots Placed',
        stageTag: 'PHASE 2 · CHDIR',
        title: 'Launcher Moves the Diver Pedestal Straight Into the Open Hatch',
        storyExcerpt:
          'The heavy starting pedestal slides right through the hull opening before the hatch door can close.',
        technicalParallel:
          'runc calls chdir("/proc/self/fd/7") prior to execve, binding fs->pwd to host /sys/fs/cgroup.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Outside Wall',
        stageTag: 'PHASE 3 · PINNED',
        title: 'Diver Starts Standing Outside the Sealed Diving Chamber',
        storyExcerpt:
          'Even after the hatch snaps shut behind them, the diver boots remain firmly planted on the shipyard side.',
        technicalParallel:
          'Even after execve closes fd 7, the container shell retains its host working directory pointer.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Manifest', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Hull Wall', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Outer Rim', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'step-3': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-3',
    sceneKind: 'runc-step3-hostroot',
    stageBadge: 'STEP #3 · RELATIVE TRAVERSAL TO HOST ROOT & KUBELET PKI',
    mitreId: 'T1552.001',
    title: 'Diver Climbs Three Exterior Steel Rungs Into the Shipyard Key Locker',
    storyCue:
      'Already standing in the outer hatchway, the diver climbs three steel rungs up the exterior ladder, steps onto the main shipyard deck, and pulls open the master key locker while hull alarms flash.',
    technicalCue:
      '/bin/sh cat ../../../etc/shadow & ../../../var/lib/kubelet/pki -> Full Host Root Access -> Falco eBPF Alert.',
    storyMappings: [
      {
        storyTerm: 'Three Exterior Steel Rungs',
        technicalTerm: 'Relative Parent Path Traversal (../../../) Out of /sys/fs/cgroup',
        tone: 'amber',
      },
      {
        storyTerm: 'Main Shipyard Engine Deck',
        technicalTerm: 'Kubernetes Worker Node Host Root Filesystem (/)',
        tone: 'sky',
      },
      {
        storyTerm: 'Shipyard Master Key Locker',
        technicalTerm: 'Host /etc/shadow & /var/lib/kubelet/pki/kubelet-client-current.pem',
        tone: 'rose',
      },
      {
        storyTerm: 'Deck Vibration Beacon',
        technicalTerm: 'Falco eBPF & Linux auditd Container Escape Alert',
        tone: 'emerald',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'step3-climb',
        tag: 'TRAVERSAL',
        title: 'Exterior Hull Ladder',
        subtitle: '../../../ Parent Climb',
        tone: 'amber',
      },
      {
        id: 'step3-vault',
        tag: 'HOST SECRETS',
        title: 'Shipyard Key Locker',
        subtitle: '/etc/shadow · Kubelet PKI',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Three Rungs',
        stageTag: 'PHASE 1 · CLIMB',
        title: 'Diver Steps Up Three Exterior Steel Rungs',
        storyExcerpt:
          'Starting from the outer hatch frame, the diver climbs three numbered rungs straight past the pod roof.',
        technicalParallel:
          'Relative traversal ../../../ ascends from /sys/fs/cgroup to the host root filesystem.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Deck Cross',
        stageTag: 'PHASE 2 · HOST',
        title: 'Footsteps Cross the Open Shipyard Engine Deck',
        storyExcerpt:
          'No bulkhead stands in the way as the diver walks across the drydock deck toward the command locker.',
        technicalParallel:
          'Container uid=0 shell accesses host directories outside its mount namespace cleanly.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Keys Read',
        stageTag: 'PHASE 3 · SECRETS',
        title: 'Master Key Locker Swings Open While Deck Sensors Flash',
        storyExcerpt:
          'The shipyard master key box pops open in crimson glow as hull vibration alarms alert the control tower.',
        technicalParallel:
          'Shell reads host /etc/shadow and Kubelet PKI; Falco eBPF fires CRITICAL escape alert.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.8], target: [0, 1.9, 0] },
      { id: 'VIEW_A', label: 'Hull Ladder', position: [-5.2, 3.8, 7.6], target: [-3.2, 1.9, 0] },
      { id: 'VIEW_B', label: 'Engine Deck', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Key Locker', position: [5.2, 3.8, 7.6], target: [3.4, 1.9, 0] },
    ],
  },
  'step-4': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-4',
    sceneKind: 'runc-step4-patch',
    stageBadge: 'STEP #4 · PATCHED RUNC 1.1.12+ VERIFYCWD & O_CLOEXEC GUARD',
    mitreId: 'T1611',
    title: 'Emerald Automatic Bulkhead Latch Seals Hatch Seven & Halts Breakout',
    storyCue:
      'Inside the upgraded drydock, an emerald hydraulic clamp snaps brass hatch seven shut before launch while a laser boundary scanner verifies the starting floorplate and aborts the tampered pod instantly.',
    technicalCue:
      'runc v1.1.12+ O_CLOEXEC + verifyCwd -> Detects CWD Outside Container Mount Namespace -> Aborts Container Launch.',
    storyMappings: [
      {
        storyTerm: 'Emerald Hydraulic Latch',
        technicalTerm: 'O_CLOEXEC Internal Descriptor Sanitization in runc 1.1.12+',
        tone: 'emerald',
      },
      {
        storyTerm: 'Laser Floorplate Scanner',
        technicalTerm: 'runc verifyCwd Mount-Namespace Containment Check',
        tone: 'sky',
      },
      {
        storyTerm: 'Aborted Pod Launch Gate',
        technicalTerm: 'Fatal runc Create Abort Preventing Container Startup',
        tone: 'emerald',
      },
      {
        storyTerm: 'Drydock Security Siren',
        technicalTerm: 'Syslog Breakout Alert + Kyverno / Pod Security Admission',
        tone: 'amber',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step4-seal',
        tag: 'O_CLOEXEC',
        title: 'Emerald Bulkhead Latch',
        subtitle: 'runc 1.1.12+ · Hatch Sealed',
        tone: 'emerald',
      },
      {
        id: 'step4-sensor',
        tag: 'VERIFYCWD',
        title: 'Laser Boundary Gate',
        subtitle: 'Outside RootFS -> Launch Aborted',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Auto Latch',
        stageTag: 'PHASE 1 · CLOEXEC',
        title: 'Emerald Hydraulic Clamp Snaps Hatch Seven Tight',
        storyExcerpt:
          'Before any pod blueprint is read, automatic emerald bolts seal every construction hatch flush with the hull.',
        technicalParallel:
          'runc v1.1.12+ closes internal host descriptors cleanly using O_CLOEXEC before chdir.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Boundary Scan',
        stageTag: 'PHASE 2 · VERIFY',
        title: 'Laser Scanner Audits the Starting Floorplate Coordinates',
        storyExcerpt:
          'A sweeping emerald beam confirms whether the crew floorplate stays strictly inside the diving pod walls.',
        technicalParallel:
          'verifyCwd asserts that the resolved cwd resides within the container mount namespace root.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Launch Halted',
        stageTag: 'PHASE 3 · ABORT',
        title: 'Tampered Pod Halted & Shipyard Deck Stays Untouched',
        storyExcerpt:
          'The launch clamps lock down and sound the drydock alarm while the master key locker remains completely safe.',
        technicalParallel:
          'runc aborts creation with possible container breakout detected; Syslog alerts SOC.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Sealed Hatch', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Laser Audit', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Safe Deck', position: [5.2, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'memory-forensics': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'memory-forensics',
    sceneKind: 'runc-memory-fddiff',
    stageBadge: 'MEMORY FORENSICS · LEAKED FD TABLE VS PATCHED O_CLOEXEC',
    mitreId: 'T1611',
    title: 'Side-by-Side Hull Blueprint: Open Hatch fd/7 vs Patched verifyCwd Seal',
    storyCue:
      'Two submarine diving pods stand side by side under a golden inspection crane: on the left, unbolted hatch seven opens straight onto the shipyard floor, while on the right, the emerald hydraulic latch seals every hatch flush before launch.',
    technicalCue:
      'Left: runc 1.1.11 Leaked fd/7 -> Host fs->pwd | Right: runc 1.1.12+ O_CLOEXEC + verifyCwd Containment.',
    storyMappings: [
      {
        storyTerm: 'Open Left Hull Hatch',
        technicalTerm: 'Leaked fd/7 -> Host /sys/fs/cgroup (0x00007F9A00000007)',
        tone: 'rose',
      },
      {
        storyTerm: 'Outside Floorplate Pointer',
        technicalTerm: 'Escaped task_struct->fs->pwd Beyond Container RootFS',
        tone: 'amber',
      },
      {
        storyTerm: 'Golden Drydock Crane',
        technicalTerm: 'Runtime File-Descriptor Table & Mount Namespace Diff',
        tone: 'sky',
      },
      {
        storyTerm: 'Sealed Right Hull Hatch',
        technicalTerm: 'Patched runc 1.1.12+ O_CLOEXEC & verifyCwd Guard',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#10B981',
    durationSec: 15,
    callouts: [
      {
        id: 'mem-leaked',
        tag: 'VULNERABLE 1.1.11',
        title: 'Unbolted Hull Hatch',
        subtitle: 'fd/7 Open -> Host fs->pwd',
        tone: 'rose',
      },
      {
        id: 'mem-cloexec',
        tag: 'PATCHED 1.1.12+',
        title: 'Sealed Emerald Hatch',
        subtitle: 'O_CLOEXEC + verifyCwd Guard',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Leaked FD',
        stageTag: 'DIFF · VULNERABLE',
        title: 'Left Pod Exposes Host Descriptor Seven Before Launch',
        storyExcerpt:
          'On the vulnerable left plinth, brass hatch seven glows crimson with an open line straight onto the outer floor.',
        technicalParallel:
          'runc 1.1.11 leaves fd/7 open so WORKDIR /proc/self/fd/7 pins fs->pwd on host.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Crane Audit',
        stageTag: 'DIFF · COMPARE',
        title: 'Golden Crane Compares Unclosed vs Sanitized Descriptor Tables',
        storyExcerpt:
          'A golden scanner sweeps across both diving pods, highlighting how one forgotten latch defeats thick steel walls.',
        technicalParallel:
          'Comparing raw openat descriptors against O_CLOEXEC + pre-execve verifyCwd.',
        accentHex: '#FACC15',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Sealed Safe',
        stageTag: 'DIFF · PATCHED',
        title: 'Right Pod Closes Every Hatch & Verifies Containment',
        storyExcerpt:
          'On the hardened right plinth, the emerald bulkhead clamp locks flush and stops any out-of-bounds floorplate.',
        technicalParallel:
          'runc v1.1.12+ closes internal fds and aborts if cwd exits container mount namespace.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.8, 13.8], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Leaked Pod', position: [-5.6, 3.8, 8.0], target: [-3.4, 1.7, 0] },
      { id: 'VIEW_B', label: 'Patched Pod', position: [5.6, 3.8, 8.0], target: [3.4, 1.7, 0] },
      { id: 'VIEW_C', label: 'Crane Top', position: [0, 8.2, 8.2], target: [0, 1.9, 0] },
    ],
  },
};
