import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #016 (`xz-utils-cve-2024-3094-backdoor`).
 * Universe: Swiss Watchmaking Bridge, Brass Gear-Selector Clutch Gearbox,
 * Riveted Steel Railway Customs Vault Door & Half-Second Master Wall Chronometer.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const XZ_UTILS_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    sectionKey: 'briefing',
    sceneKind: 'xz-watchmaker-briefing',
    stageBadge: 'BRIEFING #0 · FULL KILL-CHAIN DIORAMA',
    mitreId: 'T1195.002',
    title: 'Swiss Watchmaking Bridge, Clutch Gearbox & Steel Customs Vault',
    storyCue:
      'On a Swiss watchmaking bridge connected to a riveted steel customs vault door, an innocent wooden test crate slides open a hidden false bottom so a brass arm slips a crimson micro-gear into a bronze flywheel. When the vault boots up, that flywheel turns a central gear-selector clutch whose fork snaps onto a secret crimson side-cam moments before a heavy steel locking bar seals it shut—letting a covert skeleton master key open a silent back hatch until an overhead master chronometer gives the plot away with a half-second stutter.',
    technicalCue:
      'm4/build-to-host.m4 extracts liblzma_la-crc64-fast.o from bad-3-corrupt_lzma2.xz -> sshd loads liblzma.so.5 via libsystemd.so.0 -> GNU IFUNC rewrites .got.plt RSA_public_decrypt @ 0x55B2C4198048 pre-RELRO -> Ed448 ChaCha20 command executes system() as root -> perf +508 ms discovery.',
    storyMappings: [
      {
        storyTerm: 'Wooden Test Crate & Hidden Micro-Gear',
        technicalTerm: 'tests/files/bad-3-corrupt_lzma2.xz -> liblzma_la-crc64-fast.o',
        tone: 'amber',
      },
      {
        storyTerm: 'Brass Packaging Arm & Bronze Flywheel',
        technicalTerm: 'm4/build-to-host.m4 Linking Backdoor Into liblzma.so.5.6.1',
        tone: 'amber',
      },
      {
        storyTerm: 'Gear-Selector Clutch & Steel Seal Bar',
        technicalTerm: 'GNU IFUNC crc64_resolve Rewriting .got.plt Before RELRO Lock',
        tone: 'rose',
      },
      {
        storyTerm: 'Steel Customs Door & Skeleton Master Key',
        technicalTerm: 'sshd RSA_public_decrypt Hook + Hardcoded Ed448 Pre-Auth Gate',
        tone: 'sky',
      },
      {
        storyTerm: 'Silent Back Hatch Opening',
        technicalTerm: 'Pre-Auth sshd PID 4182 Running system("/bin/sh -c ...") as uid=0',
        tone: 'rose',
      },
      {
        storyTerm: 'Half-Second Chronometer Stutter & Violet Loupe',
        technicalTerm: 'Andres Freund perf +508 ms CPU Spike & Valgrind Discovery',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'xz-clutch',
        tag: 'HIJACKED SELECTOR',
        title: 'Gear-Selector Clutch',
        subtitle: 'GNU IFUNC -> sshd .got.plt Pre-RELRO',
        tone: 'amber',
      },
      {
        id: 'xz-vault',
        tag: 'SILENT BYPASS',
        title: 'Steel Customs Vault',
        subtitle: 'sshd RSA_public_decrypt · Ed448 Gate',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Crate Swap',
        stageTag: 'ACT 01 · FIXTURE',
        title: 'False-Bottom Test Crate Releases Hidden Micro-Gear',
        storyExcerpt:
          'A wooden test-sample crate slides open its concealed lower tray while a brass arm seats a crimson micro-gear inside the bronze flywheel.',
        technicalParallel:
          'Tarball-only m4/build-to-host.m4 decodes bad-3-corrupt_lzma2.xz into liblzma_la-crc64-fast.o during packaging.',
        accentHex: '#D97706',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Shaft Link',
        stageTag: 'ACT 02 · LINKAGE',
        title: 'Bronze Flywheel Couples Into Vault Startup Train',
        storyExcerpt:
          'The rigged bronze flywheel glides along the brass track and locks onto the main startup shaft driving the steel customs door.',
        technicalParallel:
          '/usr/sbin/sshd transitively loads liblzma.so.5.6.1 via distribution-linked libsystemd.so.0.',
        accentHex: '#0284C7',
        startSec: 4,
        endSec: 8,
      },
      {
        id: 3,
        shortLabel: '3. Clutch Snap',
        stageTag: 'ACT 03 · IFUNC',
        title: 'Selector Fork Snaps to Secret Rail Before Seal Drops',
        storyExcerpt:
          'With the brass hood lifted in cutaway, the selector fork jumps from the blue lock rail onto the crimson side-cam rail right before the steel bar clamps shut.',
        technicalParallel:
          'GNU IFUNC crc64_resolve rewrites sshd .got.plt RSA_public_decrypt (0x55B2C4198048) before RELRO locks memory read-only.',
        accentHex: '#E11D48',
        startSec: 8,
        endSec: 12.8,
      },
      {
        id: 4,
        shortLabel: '4. Skeleton Key',
        stageTag: 'ACT 04 · ED448',
        title: 'Skeleton Master Key Opens Silent Back Hatch',
        storyExcerpt:
          'An ordinary silver key passes harmlessly while a crimson skeleton key engages the diverted side-cam and swings open the silent back hatch.',
        technicalParallel:
          'Attacker RSA certificate carrying Ed448-signed ChaCha20 command invokes system() as uid=0 before login completes.',
        accentHex: '#F43F5E',
        startSec: 12.8,
        endSec: 16.8,
      },
      {
        id: 5,
        shortLabel: '5. Clock Stutter',
        stageTag: 'ACT 05 · +508 MS',
        title: 'Half-Second Chronometer Stutter Exposes the Plot',
        storyExcerpt:
          'Overhead, the sweeping brass hand on the master wall chronometer visibly hesitates by half a second, drawing the violet watchmaker loupe straight onto the rigged clutch.',
        technicalParallel:
          'Andres Freund profiles a +508 ms SSH startup CPU spike inside liblzma.so.5.6.1 using perf and valgrind.',
        accentHex: '#7C3AED',
        startSec: 16.8,
        endSec: 20,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.1, 16.0], target: [0.0, 2.3, 0.0] },
      { id: 'VIEW_A', label: 'Test Crate', position: [-4.4, 3.3, 6.8], target: [-4.0, 1.9, 0.1] },
      { id: 'VIEW_B', label: 'Clutch Cutaway', position: [0.0, 3.0, 5.8], target: [0.0, 2.0, 0.1] },
      { id: 'VIEW_C', label: 'Chronometer', position: [4.8, 5.5, 11.8], target: [0.8, 2.7, -0.8] },
    ],
  },

  'step-1': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    sectionKey: 'step-1',
    sceneKind: 'xz-step1-fixture',
    stageBadge: 'STEP #1 · FALSE-BOTTOM TEST CRATE',
    mitreId: 'T1195.002',
    title: 'Extracting the Hidden Micro-Gear From the Wooden Test Crate',
    storyCue:
      'On the warm walnut watchmaking bench, an ordinary wooden sample crate slides open its concealed false bottom tray. A brass packaging arm lifts out a gleaming crimson micro-gear absent from public workshop drawings and seats it inside the bronze compression flywheel before shipment.',
    technicalCue:
      'Release-only m4/build-to-host.m4 decodes tests/files/bad-3-corrupt_lzma2.xz into 88.5 KB liblzma_la-crc64-fast.o and links it into liblzma.so.5.6.1.',
    storyMappings: [
      {
        storyTerm: 'Wooden Test Sample Crate',
        technicalTerm: 'tests/files/bad-3-corrupt_lzma2.xz (Corrupt Binary Fixture)',
        tone: 'amber',
      },
      {
        storyTerm: 'Brass Packaging Arm',
        technicalTerm: 'Tarball-Only m4/build-to-host.m4 Autotools Extractor',
        tone: 'sky',
      },
      {
        storyTerm: 'Crimson Micro-Gear',
        technicalTerm: 'Precompiled Backdoor Object · liblzma_la-crc64-fast.o',
        tone: 'rose',
      },
      {
        storyTerm: 'Bronze Compression Flywheel',
        technicalTerm: 'Packaged Shared Library · /usr/lib/x86_64-linux-gnu/liblzma.so.5.6.1',
        tone: 'emerald',
      },
    ],
    accentHex: '#D97706',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'xz-s1-crate',
        tag: 'FALSE BOTTOM',
        title: 'Wooden Test Crate',
        subtitle: 'bad-3-corrupt_lzma2.xz · Tarball Only',
        tone: 'amber',
      },
      {
        id: 'xz-s1-wheel',
        tag: 'RIGGED TARGET',
        title: 'Bronze Flywheel',
        subtitle: 'liblzma.so.5.6.1 (+88.5 KB Object)',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Open Tray',
        stageTag: 'STEP 01 · FIXTURE',
        title: 'Concealed False Bottom Slides Out of Test Crate',
        storyExcerpt:
          'During workshop packaging, the innocent wooden sample crate slides open a hidden lower drawer holding a crimson micro-gear.',
        technicalParallel:
          'xz-5.6.1.tar.xz pairs obfuscated test archives with tarball-only m4/build-to-host.m4 absent from Git.',
        accentHex: '#D97706',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Lift Gear',
        stageTag: 'STEP 01 · EXTRACT',
        title: 'Brass Packaging Arm Extracts Hidden Micro-Gear',
        storyExcerpt:
          'The articulated brass assembly arm pivots over the open tray, grips the crimson micro-gear, and swings it toward the bronze flywheel.',
        technicalParallel:
          'Obfuscated sed/tr commands decode bad-3-corrupt_lzma2.xz into x86_64 object liblzma_la-crc64-fast.o.',
        accentHex: '#F59E0B',
        startSec: 5,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. Seat Core',
        stageTag: 'STEP 01 · LINK',
        title: 'Rigged Micro-Gear Locks Inside Bronze Flywheel',
        storyExcerpt:
          'The crimson gear snaps cleanly into the flywheel hub so the finished compression wheel spins out with no external clue.',
        technicalParallel:
          'Debian/RPM linker builds liblzma.so.5.6.1 containing the injected IFUNC hook while Git source looks clean.',
        accentHex: '#E11D48',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.2, 4.1, 8.8], target: [0.0, 1.9, 0.2] },
      { id: 'VIEW_A', label: 'False Bottom', position: [-2.6, 3.0, 5.4], target: [-0.9, 1.7, 0.4] },
      { id: 'VIEW_B', label: 'Brass Arm', position: [0.2, 4.6, 5.6], target: [0.1, 2.3, 0.0] },
      { id: 'VIEW_C', label: 'Flywheel Hub', position: [3.2, 3.0, 5.2], target: [1.1, 2.1, 0.2] },
    ],
  },

  'step-2': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    sectionKey: 'step-2',
    sceneKind: 'xz-step2-ifunc',
    stageBadge: 'STEP #2 · GEAR-SELECTOR CLUTCH HIJACK',
    mitreId: 'T1574.006',
    title: 'Snapping the Clutch Selector Fork Before the Steel Locking Bar Drops',
    storyCue:
      'As the steel customs vault starts up, the bronze flywheel turns a transparent brass gear-selector clutch. With the cutaway roof raised, the yellow selector fork snaps off the blue main lock rail onto the concealed crimson side-cam rail just before the heavy steel locking bar clamps down permanently.',
    technicalCue:
      'sshd -> libsystemd.so.0 -> liblzma.so.5.6.1 executes GNU IFUNC crc64_resolve -> _dl_audit_preinit, rewriting .got.plt 0x55B2C4198048 pre-RELRO.',
    storyMappings: [
      {
        storyTerm: 'Incoming Bronze Flywheel & Shaft',
        technicalTerm: 'Transitive Load Chain · sshd -> libsystemd.so.0 -> liblzma.so.5',
        tone: 'amber',
      },
      {
        storyTerm: 'Blue Main Lock Rail',
        technicalTerm: 'Clean OpenSSL Target · libcrypto.so.3!RSA_public_decrypt',
        tone: 'sky',
      },
      {
        storyTerm: 'Selector Fork Snapping to Crimson Rail',
        technicalTerm: 'GNU IFUNC crc64_resolve Rewriting GOT Slot 0x55B2C4198048',
        tone: 'rose',
      },
      {
        storyTerm: 'Heavy Steel Locking Bar Clamping Shut',
        technicalTerm: 'Full RELRO mprotect(PROT_READ) Freezing Hijacked GOT Entry',
        tone: 'emerald',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#0284C7',
    durationSec: 15,
    callouts: [
      {
        id: 'xz-s2-fork',
        tag: 'PRE-SEAL REDIRECT',
        title: 'Clutch Selector Fork',
        subtitle: 'IFUNC crc64_resolve · 0x55B2C4198048',
        tone: 'rose',
      },
      {
        id: 'xz-s2-bar',
        tag: 'PERMANENT LOCK',
        title: 'Steel Locking Bar',
        subtitle: 'Full RELRO Sealing Hijacked GOT',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Hood Open',
        stageTag: 'STEP 02 · LOAD',
        title: 'Bronze Flywheel Couples Into Startup Clutch',
        storyExcerpt:
          'The brass cutaway hood lifts open as the spinning flywheel drives the vault startup shaft into the central selector clutch.',
        technicalParallel:
          'libsystemd.so.0 transitively pulls liblzma.so.5.6.1 into /usr/sbin/sshd (PID 1142) at dynamic link time.',
        accentHex: '#0284C7',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        shortLabel: '2. Fork Snap',
        stageTag: 'STEP 02 · REWRITE',
        title: 'Selector Fork Jumps From Blue Rail to Crimson Side-Cam',
        storyExcerpt:
          'Before startup finishes, the yellow selector fork snaps downward off the blue main track onto the crimson side-cam rail.',
        technicalParallel:
          'IFUNC crc64_resolve hooks _dl_audit_preinit and overwrites RSA_public_decrypt@got.plt (0x55B2C4198048).',
        accentHex: '#E11D48',
        startSec: 4.5,
        endSec: 9.8,
      },
      {
        id: 3,
        shortLabel: '3. Bar Seals',
        stageTag: 'STEP 02 · RELRO',
        title: 'Steel Locking Bar Drops and Freezes the Hijacked Track',
        storyExcerpt:
          'The heavy steel safety bar slams down right afterward—locking the diverted fork firmly in place as if it were built that way.',
        technicalParallel:
          'Full RELRO marks .got.plt read-only after IFUNC finishes, preserving the hijacked pointer inside clean on-disk sshd.',
        accentHex: '#F59E0B',
        startSec: 9.8,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.1, 8.9], target: [-0.1, 2.2, 0.2] },
      { id: 'VIEW_A', label: 'Input Shaft', position: [-4.4, 3.2, 5.4], target: [-1.8, 2.2, 0.2] },
      { id: 'VIEW_B', label: 'Selector Fork', position: [0.4, 2.9, 5.1], target: [0.2, 2.1, 0.2] },
      { id: 'VIEW_C', label: 'Locking Bar', position: [3.2, 4.8, 5.6], target: [0.2, 2.6, 0.2] },
    ],
  },

  'step-3': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    sectionKey: 'step-3',
    sceneKind: 'xz-step3-ed448',
    stageBadge: 'STEP #3 · CUSTOMS VAULT SIDE-CAM BYPASS',
    mitreId: 'T1556',
    title: 'Silver Keys Pass Normally While the Crimson Skeleton Key Opens the Back Hatch',
    storyCue:
      'At the riveted steel customs vault door, an ordinary silver traveler key turns smoothly through the upper blue cylinder with zero disruption. Moments later, a crimson skeleton master key slides into the lower side-cam actuator, silently swinging open a glowing rear hatch without ringing a single gate bell.',
    technicalCue:
      'Hooked RSA_public_decrypt forwards normal handshakes to libcrypto.so.3 while verifying attacker Ed448 signatures over ChaCha20 commands to run system() as uid=0 pre-auth.',
    storyMappings: [
      {
        storyTerm: 'Ordinary Silver Key & Blue Cylinder',
        technicalTerm: 'Normal Public-Key Users Forwarded Transparently to libcrypto.so.3',
        tone: 'sky',
      },
      {
        storyTerm: 'Crimson Skeleton Master Key',
        technicalTerm: 'Crafted Certificate Carrying Ed448-Signed ChaCha20 Payload',
        tone: 'rose',
      },
      {
        storyTerm: 'Silent Rear Root Hatch Swinging Open',
        technicalTerm: 'Pre-Auth sshd PID 4182 Calling system("/bin/sh -c ...") as uid=0',
        tone: 'rose',
      },
      {
        storyTerm: 'Unrung Doorway Bell vs. Hidden Exit Log',
        technicalTerm: 'Zero "Accepted publickey" Entry Caught by Linux SYSCALL 59 Exec Watch',
        tone: 'emerald',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'xz-s3-key',
        tag: 'EXCLUSIVE GATE',
        title: 'Crimson Skeleton Key',
        subtitle: 'Hardcoded Ed448 + ChaCha20 Payload',
        tone: 'rose',
      },
      {
        id: 'xz-s3-hatch',
        tag: 'PRE-AUTH ACCESS',
        title: 'Silent Rear Hatch',
        subtitle: 'sshd PID 4182 -> system() uid=0',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Silver Key',
        stageTag: 'STEP 03 · PASSTHROUGH',
        title: 'Ordinary Silver Key Clears Main Blue Lock Normally',
        storyExcerpt:
          'A routine traveler inserts a standard silver key into the upper blue cylinder; the door behaves completely normally.',
        technicalParallel:
          'Hooked dispatcher sees no magic header and transparently delegates normal traffic to libcrypto.so.3!RSA_public_decrypt.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.2,
      },
      {
        id: 2,
        shortLabel: '2. Skeleton Key',
        stageTag: 'STEP 03 · ED448',
        title: 'Crimson Skeleton Master Key Engages Diverted Side-Cam',
        storyExcerpt:
          'The covert visitor inserts a crimson skeleton key whose golden teeth match the secret lower side-cam exclusively.',
        technicalParallel:
          'Dispatcher verifies the hardcoded Ed448 signature inside RSA modulus N and decrypts the ChaCha20 command.',
        accentHex: '#E11D48',
        startSec: 5.2,
        endSec: 9.8,
      },
      {
        id: 3,
        shortLabel: '3. Silent Hatch',
        stageTag: 'STEP 03 · ROOT EXEC',
        title: 'Hidden Rear Root Hatch Swings Open Pre-Auth',
        storyExcerpt:
          'A concealed crimson rear panel swings open before the main vault door ever unbolts—leaving the guest ledger blank.',
        technicalParallel:
          'Pre-auth sshd worker (PID 4182) invokes system("/bin/sh -c ...") as uid=0 with zero Accepted publickey log (caught by auditd SYSCALL 59).',
        accentHex: '#F43F5E',
        startSec: 9.8,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.4, 3.8, 8.6], target: [0.0, 2.2, 0.2] },
      { id: 'VIEW_A', label: 'Blue Cylinder', position: [-2.6, 3.4, 5.2], target: [-0.3, 2.6, 0.4] },
      { id: 'VIEW_B', label: 'Skeleton Key', position: [-1.8, 2.2, 5.0], target: [-0.3, 1.8, 0.6] },
      { id: 'VIEW_C', label: 'Silent Hatch', position: [3.2, 2.6, 5.4], target: [0.8, 1.8, 0.3] },
    ],
  },

  'step-4': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    sectionKey: 'step-4',
    sceneKind: 'xz-step4-chronometer',
    stageBadge: 'STEP #4 · HALF-SECOND CHRONOMETER STUTTER',
    mitreId: 'T1556',
    title: 'Spotting the Half-Second Stutter on the Master Wall Chronometer',
    storyCue:
      'Although the steel customs door looks calm, the giant Swiss master chronometer mounted overhead betrays the sabotage: its sweeping needle visibly hesitates across a glowing red half-second wedge, prompting a sharp-eyed watchmaker to aim a violet inspection loupe straight into the rigged clutch gearbox.',
    technicalCue:
      'Andres Freund observes +508 ms SSH startup CPU overhead (299 ms -> 807 ms) and Valgrind errors traced by perf record straight to liblzma.so.5.6.1.',
    storyMappings: [
      {
        storyTerm: 'Master Wall Chronometer',
        technicalTerm: 'Linux CPU Profiling & Timing Benchmarks (perf record / time)',
        tone: 'amber',
      },
      {
        storyTerm: 'Glowing Red Half-Second Wedge',
        technicalTerm: '+508 ms Excess Startup Delay (299 ms Clean vs. 807 ms Backdoored)',
        tone: 'rose',
      },
      {
        storyTerm: 'Violet Watchmaker Inspection Loupe',
        technicalTerm: 'Andres Freund Tracing perf Flamegraph -> ldd -> readelf -> Tarball',
        tone: 'emerald',
      },
      {
        storyTerm: 'Exposed Diverted Clutch Fork',
        technicalTerm: 'Confirmed CVE-2024-3094 Hook Inside liblzma.so.5.6.1',
        tone: 'rose',
      },
    ],
    accentHex: '#7C3AED',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'xz-s4-clock',
        tag: 'TIMING ANOMALY',
        title: 'Master Chronometer',
        subtitle: '+508 ms CPU Spike · perf record',
        tone: 'rose',
      },
      {
        id: 'xz-s4-loupe',
        tag: 'FORENSIC CATCH',
        title: 'Watchmaker Loupe',
        subtitle: 'Andres Freund · Valgrind & readelf',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Smooth Tick',
        stageTag: 'STEP 04 · BASELINE',
        title: 'Master Chronometer Sweeps Cleanly at Baseline Pace',
        storyExcerpt:
          'Under clean workshop gear trains, the oversized enamel chronometer sweeps smoothly with steady rhythm.',
        technicalParallel:
          'Clean xz 5.4.5 completes routine SSH login probes in ~299 ms real time with minimal liblzma CPU usage.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. +508 ms Hesitation',
        stageTag: 'STEP 04 · STUTTER',
        title: 'Needle Hesitates Inside Glowing Red Half-Second Wedge',
        storyExcerpt:
          'Every time the hijacked clutch runs, the sweeping red needle visibly jitters inside the glowing half-second warning sector.',
        technicalParallel:
          'Backdoored liblzma.so.5.6.1 adds +508 ms CPU overhead (~807 ms total) and triggers Valgrind memory warnings.',
        accentHex: '#E11D48',
        startSec: 4,
        endSec: 9.5,
      },
      {
        id: 3,
        shortLabel: '3. Loupe Lock',
        stageTag: 'STEP 04 · DISCOVERY',
        title: 'Violet Inspection Loupe Exposes the Rigged Clutch',
        storyExcerpt:
          'A violet inspection beam shoots from the watchmaker’s loupe straight into the open clutch gearbox, catching the hidden side-cam before mass rollout.',
        technicalParallel:
          'perf record spotlights 48.7% CPU inside liblzma.so.5.6.1, leading to the March 29, 2024 oss-security disclosure.',
        accentHex: '#7C3AED',
        startSec: 9.5,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.2, 9.8], target: [-0.1, 2.2, 0.0] },
      { id: 'VIEW_A', label: 'Clock Dial', position: [2.1, 3.2, 4.2], target: [1.9, 2.8, -0.5] },
      { id: 'VIEW_B', label: 'Violet Loupe', position: [0.4, 3.4, 5.2], target: [0.0, 2.5, -0.2] },
      { id: 'VIEW_C', label: 'Exposed Clutch', position: [-3.4, 3.2, 5.6], target: [-2.2, 2.0, 0.3] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    sectionKey: 'memory-forensics',
    sceneKind: 'xz-memory-gotdiff',
    stageBadge: 'MEMORY FORENSICS · SIDE-BY-SIDE SELECTOR COMPARISON',
    mitreId: 'T1574.006',
    title: 'Clean sshd GOT/PLT Jump Table vs. IFUNC-Hijacked RSA_public_decrypt Pointer',
    storyCue:
      'Place an untouched factory gear-selector gearbox beside the live hijacked gearbox from the compromised customs vault. Both carry identical official outer steel doors, yet a sweeping golden X-ray beam reveals the left fork locked cleanly on the blue primary lock rail while the right fork is clamped permanently onto the crimson side-cam rail.',
    technicalCue:
      'ELF runtime memory forensics compares clean sshd .got.plt @ 0x55B2C4198048 (pointing to libcrypto.so.3 @ 0x7F9A20E14200) against backdoored sshd (rewritten pre-RELRO to liblzma.so.5.6.1 @ 0x7F9A2143A110).',
    storyMappings: [
      {
        storyTerm: 'Clean Factory Gearbox (Left)',
        technicalTerm: 'Clean sshd .got.plt -> libcrypto.so.3!RSA_public_decrypt (0x7F9A20E14200)',
        tone: 'sky',
      },
      {
        storyTerm: 'Hijacked Locked Gearbox (Right)',
        technicalTerm: 'Backdoored .got.plt @ 0x55B2C4198048 -> liblzma.so.5.6.1 (0x7F9A2143A110)',
        tone: 'rose',
      },
      {
        storyTerm: 'Sweeping Golden X-Ray Beam',
        technicalTerm: 'readelf -r / gdb / Volatility Live GOT Pointer Diff',
        tone: 'amber',
      },
      {
        storyTerm: 'Identical Outer Vault Door Plate',
        technicalTerm: '100% Unmodified /usr/sbin/sshd On-Disk Checksum Despite Live RAM Hook',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'xz-mem-clean',
        tag: 'CLEAN POINTER',
        title: 'Factory Selector Box',
        subtitle: 'libcrypto.so.3 · 0x7F9A20E14200',
        tone: 'sky',
      },
      {
        id: 'xz-mem-hijack',
        tag: 'PRE-RELRO HIJACK',
        title: 'Diverted Selector Box',
        subtitle: 'liblzma.so.5.6.1 · 0x7F9A2143A110',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Clean GOT',
        stageTag: 'X-RAY · CLEAN',
        title: 'Factory Gearbox Locked on Standard Blue Lock Rail',
        storyExcerpt:
          'On the left plinth, the clean selector fork sits straight on the blue main track with zero concealed side-cam.',
        technicalParallel:
          'Clean sshd resolves RSA_public_decrypt@got.plt directly into OpenSSL libcrypto.so.3 at 0x7F9A20E14200.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. X-Ray Sweep',
        stageTag: 'X-RAY · DIFF',
        title: 'Golden Comparison Beam Sweeps Both Gearboxes',
        storyExcerpt:
          'A sweeping golden beam highlights the exact fork diversion sealed beneath the steel bar on the right plinth.',
        technicalParallel:
          'Live memory inspection catches 0x55B2C4198048 pointing into liblzma.so.5.6.1 (0x7F9A2143A110) despite Full RELRO.',
        accentHex: '#FACC15',
        startSec: 5,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. Proof of Hook',
        stageTag: 'X-RAY · VERIFIED',
        title: 'Clean Outer Binary Cannot Hide Runtime Pointer Hijack',
        storyExcerpt:
          'Even though both customs doors carry untouched outer metal, the side-by-side cutaway proves the inner lock was rerouted.',
        technicalParallel:
          'Comparing live .got.plt target mappings against /proc/<pid>/maps immediately exposes dynamic linker hijacking (T1574.006).',
        accentHex: '#E11D48',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.4, 13.8], target: [0.0, 2.1, 0.0] },
      { id: 'VIEW_A', label: 'Clean Box', position: [-5.2, 3.8, 7.6], target: [-3.15, 2.0, 0.2] },
      { id: 'VIEW_B', label: 'Hijacked Box', position: [5.2, 3.8, 7.6], target: [3.15, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'X-Ray Sweep', position: [0.0, 7.8, 7.2], target: [0.0, 2.1, 0.2] },
    ],
  },
};
