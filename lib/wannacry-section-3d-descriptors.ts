import type {
  Section3DDescriptor,
  Section3DKey,
} from './section-3d-registry';

const SCENARIO_ID = 'wannacry-eternalblue-smb-worm-cve-2017-0144';

export const WANNACRY_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: SCENARIO_ID,
    sectionKey: 'briefing',
    sceneKind: 'wcry-hospital-briefing',
    stageBadge: 'BRIEFING #0 · GRAND HOSPITAL PNEUMATIC TUBE HALL DIORAMA',
    mitreId: 'T1210',
    title: 'Hospital Pneumatic Tube Hall - WannaCry Self-Propagating Worm & Hilltop Beacon',
    storyCue:
      'An overstuffed brass mail capsule jams an older hospital pneumatic tube without an overflow stopper, peeks at a dark hilltop lighthouse, slams crimson padlocks onto every patient chart drawer, and shoots fresh copies down every hallway until an emerald beacon ignites and welds the legacy pipes shut.',
    technicalCue:
      'EternalBlue MS17-010 (CVE-2017-0144) SMBv1 Pool Overflow -> DoublePulsar -> Kill-Switch Domain Check -> .WNCRY Encryption -> Sinkhole HTTP 200 & Patch.',
    storyMappings: [
      {
        storyTerm: 'Older Brass Pneumatic Tube',
        technicalTerm: 'Legacy SMBv1 Protocol Listening on TCP Port 445 (srv.sys)',
        tone: 'sky',
      },
      {
        storyTerm: 'Overstuffed Brass Mail Capsule',
        technicalTerm: 'EternalBlue MS17-010 FEA Kernel Pool Overflow (CVE-2017-0144)',
        tone: 'rose',
      },
      {
        storyTerm: 'Hidden Spring Maintenance Door',
        technicalTerm: 'DoublePulsar Ring 0 Multiplexer Backdoor (ID 0x0052)',
        tone: 'amber',
      },
      {
        storyTerm: 'Hilltop Lighthouse Lantern',
        technicalTerm: 'Hardcoded Unregistered Kill-Switch Domain Check (WinINet)',
        tone: 'sky',
      },
      {
        storyTerm: 'Crimson Combination Padlocks',
        technicalTerm: 'tasksche.exe AES-128 + RSA-2048 .WNCRY Lock & Shadow Wipe',
        tone: 'rose',
      },
      {
        storyTerm: 'Emerald Beacon & Welded Caps',
        technicalTerm: 'Kill-Switch Sinkhole HTTP 200, MS17-010 Patch & SMBv1 Off',
        tone: 'emerald',
      },
    ],
    accentHex: '#F43F5E',
    secondaryHex: '#10B981',
    durationSec: 20,
    callouts: [
      {
        id: 'brass-tube',
        tag: 'WORM INTAKE',
        title: 'Legacy Brass Tube Valve',
        subtitle: 'SMBv1 TCP/445 · EternalBlue & DoublePulsar',
        tone: 'rose',
      },
      {
        id: 'hilltop-beacon',
        tag: 'EMERGENCY BRAKE',
        title: 'Hilltop Lighthouse Beacon',
        subtitle: 'Kill-Switch Sinkhole HTTP 200 · MS17-010 Seal',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Tube Jam',
        stageTag: 'ACT 1 · EXPLOIT',
        title: 'Overstuffed Brass Capsule Bursts the Legacy Intake Valve',
        storyExcerpt:
          'A bulging brass mail parcel forces the unguarded ward intake sleeve wide open and props a hidden spring door ajar.',
        technicalParallel:
          'EternalBlue overflows srv.sys non-paged pool over TCP/445 and installs DoublePulsar.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 4.2,
      },
      {
        id: 2,
        shortLabel: '2. Beacon Peek',
        stageTag: 'ACT 2 · PROBE',
        title: 'Clockwork Capsule Peeks Up at the Dark Hilltop Lighthouse',
        storyExcerpt:
          'Seeing the distant hilltop lantern completely unlit confirms the coast is clear and unlocks the mechanical gears.',
        technicalParallel:
          'mssecsvc.exe probes the hardcoded kill-switch domain and gets NXDOMAIN.',
        accentHex: '#F59E0B',
        startSec: 4.2,
        endSec: 8.4,
      },
      {
        id: 3,
        shortLabel: '3. Chart Lock',
        stageTag: 'ACT 3 · IMPACT',
        title: 'Crimson Combination Padlocks Slam Across Every Chart Cabinet',
        storyExcerpt:
          'Heavy crimson padlocks snap onto every ward drawer while duplicate backup ledgers feed into the shredder.',
        technicalParallel:
          'tasksche.exe encrypts 176 extensions to .WNCRY and wipes Volume Shadow Copies.',
        accentHex: '#F43F5E',
        startSec: 8.4,
        endSec: 13.0,
      },
      {
        id: 4,
        shortLabel: '4. Hall Spray',
        stageTag: 'ACT 4 · WORM',
        title: 'Fresh Capsules Shoot Down Every Neighboring Hallway Tube',
        storyExcerpt:
          'Dozens of duplicate brass capsules fire down adjacent corridors trying to flood every wing in the hospital.',
        technicalParallel:
          '128 mssecsvc.exe threads scan LAN /24 and WAN IPs on TCP/445 with EternalBlue.',
        accentHex: '#38BDF8',
        startSec: 13.0,
        endSec: 16.8,
      },
      {
        id: 5,
        shortLabel: '5. Beacon Halt',
        stageTag: 'ACT 5 · CONTAIN',
        title: 'Emerald Hilltop Beacon Ignites & Welded Caps Seal Every Pipe',
        storyExcerpt:
          'A bright emerald lighthouse beam freezes every incoming capsule dead while engineers cap the legacy pipes.',
        technicalParallel:
          'Sinkhole HTTP 200 triggers ExitProcess(0) while MS17-010 and SMBv1 removal seal TCP/445.',
        accentHex: '#10B981',
        startSec: 16.8,
        endSec: 20.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.6, 16.4], target: [0, 2.5, 0] },
      { id: 'VIEW_A', label: 'Brass Tube', position: [-6.4, 4.2, 10.6], target: [-3.2, 2.1, 0] },
      { id: 'VIEW_B', label: 'Chart Vault', position: [0.2, 4.4, 10.4], target: [0.0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Beacon Tower', position: [6.8, 4.8, 10.8], target: [3.8, 2.8, 0] },
    ],
  },

  'step-1': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-1',
    sceneKind: 'wcry-step1-eternalblue',
    stageBadge: 'STEP #1 · ETERNALBLUE SMBV1 KERNEL POOL OVERFLOW',
    mitreId: 'T1210',
    title: 'Overstuffed Brass Mail Capsule Bursts Legacy Intake Valve',
    storyCue:
      'Without presenting a staff badge, an overstuffed brass capsule forces an older hospital intake valve open past its sorting sleeve and props a hidden spring door ajar.',
    technicalCue:
      'Crafted SMBv1 FEA list truncates 32-bit size to 16-bit WORD in srv.sys -> Non-Paged Pool Overflow -> DoublePulsar.',
    storyMappings: [
      {
        storyTerm: 'Overstuffed Brass Parcel',
        technicalTerm: 'Crafted SMB_COM_TRANSACTION2 Oversized FEA List Packet',
        tone: 'rose',
      },
      {
        storyTerm: 'Undersized Sorting Sleeve',
        technicalTerm: '16-Bit WORD Size Truncation in SrvOs2FeaListSizeToNt',
        tone: 'amber',
      },
      {
        storyTerm: 'Burst Pipe Wall',
        technicalTerm: 'srv.sys Non-Paged Kernel Pool Overflow Over SRVNET_HDR',
        tone: 'rose',
      },
      {
        storyTerm: 'Hidden Spring Door',
        technicalTerm: 'DoublePulsar Ring 0 Multiplexer Backdoor (ID 0x0052)',
        tone: 'sky',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 14,
    callouts: [
      {
        id: 'sorting-sleeve',
        tag: 'OVERFLOW BUG',
        title: 'Burst Brass Sorting Sleeve',
        subtitle: 'srv.sys · CVE-2017-0144 Pool Overflow',
        tone: 'rose',
      },
      {
        id: 'spring-door',
        tag: 'KERNEL BACKDOOR',
        title: 'Hidden Spring Control Door',
        subtitle: 'DoublePulsar · Multiplex ID 0x0052',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Parcel Arrives',
        stageTag: 'PHASE 1 · TRANS2',
        title: 'Oversized Brass Parcel Slides Into Legacy Intake Pipe',
        storyExcerpt:
          'A heavily stuffed brass cylinder glides straight down the unguarded ward intake line with no staff badge.',
        technicalParallel:
          'Infected peer sends anonymous IPC$ SMBv1 Trans2 FEA frames to TCP/445.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Sleeve Bursts',
        stageTag: 'PHASE 2 · OVERFLOW',
        title: 'Undersized Sorting Sleeve Splits Across Neighboring Compartments',
        storyExcerpt:
          'Because the sleeve measures only half the parcel length, overflowing brass pieces spill into the adjacent control box.',
        technicalParallel:
          'WORD truncation overflows srv.sys non-paged pool over SRVNET_BUFFER_HDR.',
        accentHex: '#E11D48',
        startSec: 4.8,
        endSec: 9.5,
      },
      {
        id: 3,
        shortLabel: '3. Spring Latch',
        stageTag: 'PHASE 3 · IMPLANT',
        title: 'Hidden Spring Door Props Open Inside the Ward Control Box',
        storyExcerpt:
          'A concealed spring latch snaps open inside the switchboard, handing full silent control to the incoming capsule.',
        technicalParallel:
          'DoublePulsar implants Ring 0 hook (0x0052) and injects mssecsvc.exe as SYSTEM.',
        accentHex: '#38BDF8',
        startSec: 9.5,
        endSec: 14.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 4.4, 12.6], target: [0, 2.3, 0] },
      { id: 'VIEW_A', label: 'Intake Pipe', position: [-5.4, 3.6, 8.6], target: [-2.6, 2.0, 0] },
      { id: 'VIEW_B', label: 'Pool Sleeve', position: [0, 3.8, 8.2], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Spring Door', position: [5.4, 3.6, 8.6], target: [2.8, 2.0, 0] },
    ],
  },

  'step-2': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-2',
    sceneKind: 'wcry-step2-killswitch',
    stageBadge: 'STEP #2 · HARDCODED KILL-SWITCH DOMAIN PROBE',
    mitreId: 'T1497.001',
    title: 'Spyglass Checks the Distant Hilltop Lighthouse Before Launch',
    storyCue:
      'Before unpacking its padlocks, the clockwork capsule raises a brass spyglass toward a lonely hilltop lighthouse; seeing complete darkness convinces it no decoy trap is watching.',
    technicalCue:
      'mssecsvc.exe calls WinINet InternetOpenUrlA -> Unregistered Domain Returns NXDOMAIN (9003) -> Authorizes Launch.',
    storyMappings: [
      {
        storyTerm: 'Brass Roof Spyglass',
        technicalTerm: 'WinINet InternetOpenUrlA Plain HTTP/80 Probe',
        tone: 'sky',
      },
      {
        storyTerm: 'Dark Hilltop Lighthouse',
        technicalTerm: 'Unregistered Hardcoded Domain Returning DNS NXDOMAIN',
        tone: 'amber',
      },
      {
        storyTerm: 'Watchtower Log Book',
        technicalTerm: 'Sysmon Event ID 22 DNSEvent & Resolver Query Log',
        tone: 'sky',
      },
      {
        storyTerm: 'Unlocked Clockwork Latch',
        technicalTerm: 'Service mssecsvc2.0 Install & tasksche.exe Extraction',
        tone: 'rose',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 14,
    callouts: [
      {
        id: 'roof-spyglass',
        tag: 'SANDBOX CHECK',
        title: 'Brass Roof Spyglass',
        subtitle: 'InternetOpenUrlA · Hardcoded Domain',
        tone: 'sky',
      },
      {
        id: 'dark-lantern',
        tag: 'DARK SIGNAL',
        title: 'Unlit Hilltop Lantern',
        subtitle: 'NXDOMAIN 9003 -> Proceed to Encrypt',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Raise Glass',
        stageTag: 'PHASE 1 · PROBE',
        title: 'Clockwork Capsule Extends Spyglass Through the Roof Skylight',
        storyExcerpt:
          'Before touching a single chart cabinet, the capsule raises a brass spyglass toward the remote ridge.',
        technicalParallel:
          'mssecsvc.exe initiates InternetOpenUrlA toward iuqerfsodp9ifj...wea.com.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Dark Ridge',
        stageTag: 'PHASE 2 · NXDOMAIN',
        title: 'Hilltop Lighthouse Lantern Returns Complete Darkness',
        storyExcerpt:
          'No light answers from the ridge, proving no automated testing hall is pretending to answer every address.',
        technicalParallel:
          'Resolver returns DNS NXDOMAIN (status 9003), logged in Sysmon Event ID 22.',
        accentHex: '#F59E0B',
        startSec: 4.8,
        endSec: 9.5,
      },
      {
        id: 3,
        shortLabel: '3. Gear Release',
        stageTag: 'PHASE 3 · UNPACK',
        title: 'Main Clockwork Latch Releases Both Locks and Worm Tubes',
        storyExcerpt:
          'Confirmed on a live ward floor, the capsule clicks its main brass latch to unpack its padlocks and hallway launchers.',
        technicalParallel:
          'mssecsvc.exe registers service mssecsvc2.0, drops tasksche.exe, and spawns scanners.',
        accentHex: '#E11D48',
        startSec: 9.5,
        endSec: 14.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 4.4, 12.6], target: [0, 2.3, 0] },
      { id: 'VIEW_A', label: 'Spyglass', position: [-5.2, 3.6, 8.6], target: [-2.4, 2.1, 0] },
      { id: 'VIEW_B', label: 'Lighthouse', position: [4.8, 4.2, 8.6], target: [2.6, 2.6, 0] },
      { id: 'VIEW_C', label: 'Clock Latch', position: [0, 3.4, 7.8], target: [0, 1.8, 0] },
    ],
  },

  'step-3': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-3',
    sceneKind: 'wcry-step3-encrypt',
    stageBadge: 'STEP #3 · HYBRID .WNCRY ENCRYPTION & SHADOW COPY WIPE',
    mitreId: 'T1486',
    title: 'Crimson Combination Padlocks Slam Shut & Duplicate Ledgers Shred',
    storyCue:
      'A spinning brass archive box unpacks hundreds of unique crimson combination padlocks onto every patient chart drawer while feeding duplicate paper ledgers into the floor shredder.',
    technicalCue:
      'tasksche.exe Unpacks t.wnry -> AES-128-CBC + RSA-2048 (.WNCRY) -> vssadmin/wbadmin Shadow Copy Deletion -> WanaDecrypt0r.',
    storyMappings: [
      {
        storyTerm: 'Sealed Brass Archive Box',
        technicalTerm: 'tasksche.exe Extracting Encrypted ZIP Archive (t.wnry)',
        tone: 'amber',
      },
      {
        storyTerm: 'Unique Crimson Padlocks',
        technicalTerm: 'Per-File AES-128-CBC Key Wrapped Under RSA-2048 (.WNCRY)',
        tone: 'rose',
      },
      {
        storyTerm: 'Floor Ledger Shredder',
        technicalTerm: 'vssadmin delete shadows & wbadmin delete catalog Wipe',
        tone: 'rose',
      },
      {
        storyTerm: 'Ticking Red Wall Clock',
        technicalTerm: '@WanaDecryptor@.exe Ransom Countdown & @Please_Read_Me@.txt',
        tone: 'amber',
      },
    ],
    accentHex: '#F43F5E',
    secondaryHex: '#F59E0B',
    durationSec: 14,
    callouts: [
      {
        id: 'chart-padlocks',
        tag: 'FILE LOCK',
        title: 'Padlocked Chart Cabinets',
        subtitle: '176 Extensions -> WANACRY! .WNCRY',
        tone: 'rose',
      },
      {
        id: 'ledger-shredder',
        tag: 'RECOVERY WIPE',
        title: 'Duplicate Ledger Shredder',
        subtitle: 'vssadmin + wbadmin · Sysmon EID 1',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Lock Cabinets',
        stageTag: 'PHASE 1 · ENCRYPT',
        title: 'Crimson Padlocks Snap Across Every Patient Chart Drawer',
        storyExcerpt:
          'Every medical chart cabinet receives its own unique crimson padlock stamped with an unmistakable red seal.',
        technicalParallel:
          't.wnry encrypts 4,120 files with AES-128-CBC + RSA-2048 appending .WNCRY.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Shred Copies',
        stageTag: 'PHASE 2 · VSS WIPE',
        title: 'Backup Paper Ledgers Feed Straight Into the Floor Shredder',
        storyExcerpt:
          'Before staff can open the spare ledger closet, spinning steel teeth shred every local copy into confetti.',
        technicalParallel:
          'vssadmin delete shadows /all /quiet & wbadmin delete catalog execute (EID 1).',
        accentHex: '#F59E0B',
        startSec: 4.8,
        endSec: 9.5,
      },
      {
        id: 3,
        shortLabel: '3. Ransom Clock',
        stageTag: 'PHASE 3 · EXTORT',
        title: 'Glowing Red Countdown Placard Bolts Onto the Ward Wall',
        storyExcerpt:
          'A flashing crimson countdown board illuminates the ward hall demanding payment before the locks become permanent.',
        technicalParallel:
          '@WanaDecryptor@.exe opens Bitcoin countdown GUI and drops @Please_Read_Me@.txt.',
        accentHex: '#F43F5E',
        startSec: 9.5,
        endSec: 14.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 4.4, 12.6], target: [0, 2.3, 0] },
      { id: 'VIEW_A', label: 'Chart Vault', position: [-5.2, 3.6, 8.6], target: [-2.6, 2.0, 0] },
      { id: 'VIEW_B', label: 'Shredder', position: [0, 3.8, 8.4], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Red Clock', position: [5.2, 3.8, 8.6], target: [2.8, 2.2, 0] },
    ],
  },

  'step-4': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-4',
    sceneKind: 'wcry-step4-sinkhole',
    stageBadge: 'STEP #4 · KILL-SWITCH SINKHOLE & MS17-010 PIPE SEAL',
    mitreId: 'T1490',
    title: 'Emerald Hilltop Beacon Freezes the Worm & Welded Caps Seal Every Pipe',
    storyCue:
      'A watchkeeper switches on the bright emerald hilltop beacon, freezing every newly arriving capsule on sight while engineers weld solid brass shutoff caps onto every legacy pneumatic intake pipe.',
    technicalCue:
      'Sinkhole Registration Returns HTTP 200 -> ExitProcess(0) -> MS17-010 Patch + SMBv1 Disablement + East-West TCP/445 Block.',
    storyMappings: [
      {
        storyTerm: 'Lit Emerald Hilltop Beacon',
        technicalTerm: 'Marcus Hutchins Kill-Switch Sinkhole Returning HTTP 200 OK',
        tone: 'emerald',
      },
      {
        storyTerm: 'Frozen Brass Capsules',
        technicalTerm: 'mssecsvc.exe Executing Immediate ExitProcess(0) Pre-Drop',
        tone: 'sky',
      },
      {
        storyTerm: 'Welded Brass Pipe Caps',
        technicalTerm: 'MS17-010 Kernel Bounds Patch & Fleet-Wide SMBv1 Removal',
        tone: 'emerald',
      },
      {
        storyTerm: 'Hallway Flow Radar',
        technicalTerm: 'KQL Detection on TCP/445 Fan-Out (>25 Distinct IPs / 60s)',
        tone: 'sky',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 14,
    callouts: [
      {
        id: 'emerald-beacon',
        tag: 'GLOBAL HALT',
        title: 'Lit Emerald Hilltop Beacon',
        subtitle: 'Sinkhole HTTP 200 -> ExitProcess(0)',
        tone: 'emerald',
      },
      {
        id: 'welded-caps',
        tag: 'PERMANENT FIX',
        title: 'Welded Brass Tube Caps',
        subtitle: 'MS17-010 Patch + SMBv1 Disabled',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Beacon Lit',
        stageTag: 'PHASE 1 · SINKHOLE',
        title: 'Watchkeeper Lights the Emerald Lantern Atop the Hill',
        storyExcerpt:
          'A steady emerald beam sweeps from the hilltop lighthouse, instantly lighting up every hospital roof skylight.',
        technicalParallel:
          'Kill-switch domain is registered and pointed at a sinkhole serving HTTP 200 OK.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Worm Halts',
        stageTag: 'PHASE 2 · SELF-EXIT',
        title: 'Every Newly Arrived Capsule Halts Silently Without Unlocking',
        storyExcerpt:
          'Spotting the bright emerald beam through their spyglasses, fresh clockwork capsules shut down cleanly with zero padlocks dropped.',
        technicalParallel:
          'mssecsvc.exe receives HTTP 200 from InternetOpenUrlA and calls ExitProcess(0).',
        accentHex: '#38BDF8',
        startSec: 4.8,
        endSec: 9.5,
      },
      {
        id: 3,
        shortLabel: '3. Pipes Capped',
        stageTag: 'PHASE 3 · PATCH',
        title: 'Engineers Weld Solid Brass Shutoff Caps Onto Every Legacy Tube',
        storyExcerpt:
          'To stop any future capsules that ignore the lighthouse, crews seal every older brass intake pipe permanently.',
        technicalParallel:
          'MS17-010 patch, SMBv1 removal, and VLAN TCP/445 segmentation lock down the fleet.',
        accentHex: '#10B981',
        startSec: 9.5,
        endSec: 14.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 4.4, 12.6], target: [0, 2.3, 0] },
      { id: 'VIEW_A', label: 'Beacon', position: [-5.2, 4.0, 8.6], target: [-2.6, 2.4, 0] },
      { id: 'VIEW_B', label: 'Frozen Pod', position: [0, 3.6, 8.2], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Pipe Caps', position: [5.2, 3.6, 8.6], target: [2.8, 2.0, 0] },
    ],
  },

  'memory-forensics': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'memory-forensics',
    sceneKind: 'wcry-memory-pooldiff',
    stageBadge: 'MEMORY FORENSICS · UNPATCHED SRV.SYS POOL VS MS17-010 GATE',
    mitreId: 'T1210',
    title: 'Side-by-Side Intake Valve: Unpatched Pool Spill vs Patched Size Gate',
    storyCue:
      'Two pneumatic intake valves sit side by side beneath a golden inspection beam: on the left, the unguarded brass sleeve bursts into neighboring compartments, while on the right, an emerald size gauge rejects the overstuffed parcel cleanly at the doorway.',
    technicalCue:
      'Left: Unpatched srv.sys 16-Bit FEA Truncation Overwrites SRVNET_HDR -> Right: Patched MS17-010 32-Bit Bounds Gate Returning STATUS_INVALID_PARAMETER.',
    storyMappings: [
      {
        storyTerm: 'Burst Left Brass Sleeve',
        technicalTerm: 'Unpatched srv.sys Non-Paged Pool Overflow (0xFFFFFA8004C21000)',
        tone: 'rose',
      },
      {
        storyTerm: 'Spilled Control Gears',
        technicalTerm: 'Corrupted SRVNET_BUFFER_HDR & DoublePulsar Ring 0 Hook',
        tone: 'rose',
      },
      {
        storyTerm: 'Golden Inspection Beam',
        technicalTerm: 'Kernel Pool Forensic Diff & SMB Dispatch Integrity Audit',
        tone: 'amber',
      },
      {
        storyTerm: 'Emerald Right Size Gauge',
        technicalTerm: 'Patched MS17-010 srv.sys Rejecting Bad FEA Sizes Pre-Alloc',
        tone: 'emerald',
      },
    ],
    accentHex: '#F43F5E',
    secondaryHex: '#10B981',
    durationSec: 14,
    callouts: [
      {
        id: 'burst-valve',
        tag: 'UNPATCHED · OVERFLOW',
        title: 'Burst Left Intake Sleeve',
        subtitle: 'srv.sys Pre-MS17-010 · Pool Overflow',
        tone: 'rose',
      },
      {
        id: 'gauged-valve',
        tag: 'PATCHED · CLEAN',
        title: 'Emerald Size-Gated Valve',
        subtitle: 'MS17-010 · STATUS_INVALID_PARAMETER',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Pool Spill',
        stageTag: 'X-RAY · UNPATCHED',
        title: 'Left Unpatched Intake Sleeve Splits Into Neighboring Compartments',
        storyExcerpt:
          'On the left bench, the overstuffed brass parcel bursts straight through the thin sleeve wall into adjacent control gears.',
        technicalParallel:
          '16-bit WORD truncation overflows srv.sys non-paged pool and plants DoublePulsar.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Beam Audit',
        stageTag: 'X-RAY · KERNEL DIFF',
        title: 'Golden Inspection Beam Sweeps Across Both Valve Chambers',
        storyExcerpt:
          'A sweeping golden scanner highlights the broken left wall and bent control levers against the spotless right chamber.',
        technicalParallel:
          'Kernel memory audit flags hooked SMB dispatch pointers vs clean MS17-010 srv.sys.',
        accentHex: '#FACC15',
        startSec: 4.8,
        endSec: 9.5,
      },
      {
        id: 3,
        shortLabel: '3. Bounds Seal',
        stageTag: 'X-RAY · MS17-010',
        title: 'Right Emerald Size Gauge Rejects Overstuffed Parcels Pre-Entry',
        storyExcerpt:
          'On the hardened right bench, an emerald measuring collar stops the oversized parcel before it ever enters the sorting sleeve.',
        technicalParallel:
          'MS17-010 validates full 32-bit FEA length and returns STATUS_INVALID_PARAMETER.',
        accentHex: '#10B981',
        startSec: 9.5,
        endSec: 14.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.2, 13.8], target: [0, 2.2, 0] },
      { id: 'VIEW_A', label: 'Unpatched Left', position: [-5.6, 3.8, 8.6], target: [-3.4, 2.0, 0] },
      { id: 'VIEW_B', label: 'Patched Right', position: [5.6, 3.8, 8.6], target: [3.4, 2.0, 0] },
      { id: 'VIEW_C', label: 'Gantry Top', position: [0, 7.6, 8.0], target: [0, 2.0, 0] },
    ],
  },
};
