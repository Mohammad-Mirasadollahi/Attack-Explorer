import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #039 (`dfir-dcsync-drsuapi-replication-eid4662`).
 * Universe: Twin-Tower Sovereign Mint, Armored Ledger Express Bridge, Rogue Side-Street Courier Car & Mint Audit Tower.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const DCSYNC_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: 'briefing',
    sceneKind: 'dcsync-mint-briefing',
    stageBadge: 'BRIEFING #0 · SOVEREIGN MINT BRIDGE DIORAMA',
    mitreId: 'T1003.006',
    title: 'Twin-Tower Sovereign Mint, Express Ledger Bridge & Non-Mint Courier Trap',
    storyCue:
      'High above a sovereign mint plaza, an elevated armored glass bridge syncs master coin dies strictly between peer towers. When an overlooked service ribbon lets an ordinary side-street van pull the crown ledger straight across the bridge without stepping inside the vault, the audit tower compares the street license plate against the official mint roster, trips a crimson alarm, and seals the bridge for verified peer towers only.',
    technicalCue:
      'Over-privileged AD ACL (1131f6ad-...) -> Rogue MS-DRSR IDL_DRSGetNCChanges (Opnum 3) from non-DC IP -> Security EID 4662 + 4624 correlation -> Tier-0 ACL cleanup & double krbtgt reset.',
    storyMappings: [
      { storyTerm: 'Over-Privileged Gatehouse Ribbon', technicalTerm: 'Domain Root ACL Granting 1131f6ad-... to CORP\\svc_dir_sync', tone: 'rose' },
      { storyTerm: 'Elevated Armored Express Bridge', technicalTerm: 'MS-DRSR / DRSUAPI Replication Protocol (UUID e3514235-...)', tone: 'amber' },
      { storyTerm: 'Side-Street Courier Van', technicalTerm: 'Non-DC Workstation WKS-ADMIN-07 (10.20.14.88) Invoking Opnum 3', tone: 'rose' },
      { storyTerm: 'Glowing Crown Seal Core', technicalTerm: 'Active Directory krbtgt & Tier-0 Password Hashes in Memory', tone: 'amber' },
      { storyTerm: 'Mint Roster Audit Tower', technicalTerm: 'Security EID 4662 JOIN EID 4624 + Suricata SID 2043901', tone: 'sky' },
      { storyTerm: 'Peer-Only Emerald Bridge Gate', technicalTerm: 'Enterprise DC-Only ACL + Protected Users + Double krbtgt Reset', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      { id: 'dc-bridge', tag: 'REPLICATION BRIDGE', title: 'Armored Ledger Bridge', subtitle: 'MS-DRSR IDL_DRSGetNCChanges (Opnum 3)', tone: 'amber' },
      { id: 'dc-audit', tag: 'ROSTER CORRELATION', title: 'Mint Audit Tower', subtitle: 'Security EID 4662 + EID 4624 -> Non-DC IP', tone: 'sky' },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Bad Ribbon',
        stageTag: 'ACT 01 · ACL',
        title: 'Forgotten Gatehouse Ribbon Grants Master Ledger Clearance',
        storyExcerpt:
          'A crimson access ribbon left pinned to the mint gatehouse mistakenly grants master courier rights to a regular street van.',
        technicalParallel:
          'DC=corp,DC=local nTSecurityDescriptor grants 1131f6aa & 1131f6ad extended rights to non-DC svc_dir_sync.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.4,
      },
      {
        id: 2,
        shortLabel: '2. Street Van',
        stageTag: 'ACT 02 · DRSR',
        title: 'Side-Street Courier Van Connects Directly to Express Bridge',
        storyExcerpt:
          'An ordinary red street courier rolls right under the elevated glass bridge pretending to be an official peer mint tower.',
        technicalParallel:
          'WKS-ADMIN-07 (10.20.14.88) binds to DRSUAPI UUID e3514235-... and invokes IDL_DRSGetNCChanges.',
        accentHex: '#E11D48',
        startSec: 4.4,
        endSec: 9.2,
      },
      {
        id: 3,
        shortLabel: '3. Crown Copy',
        stageTag: 'ACT 03 · STREAM',
        title: 'Cutaway Bridge Reveals Crown Ledger Gliding Out Without Entering Vault',
        storyExcerpt:
          'The glass bridge cutaway lifts open, showing golden crown-seal ledgers sliding to the van while zero boots touch the vault floor.',
        technicalParallel:
          'CORP-DC01 serves CN=krbtgt hashes directly from lsass.exe (ntdsai.dll) with zero NTDS.dit file access.',
        accentHex: '#FACC15',
        startSec: 9.2,
        endSec: 14,
      },
      {
        id: 4,
        shortLabel: '4. Plate Check',
        stageTag: 'ACT 04 · EID 4662',
        title: 'Mint Audit Tower Catches Non-Tower Plate in Bridge Ledger',
        storyExcerpt:
          'Comparing the bridge transfer stamp against the official mint roster triggers a bright crimson alarm immediately.',
        technicalParallel:
          'SIEM joins Security EID 4662 (non-$ svc_dir_sync) via SubjectLogonId to EID 4624 IP 10.20.14.88.',
        accentHex: '#38BDF8',
        startSec: 14,
        endSec: 17.2,
      },
      {
        id: 5,
        shortLabel: '5. Peer Seal',
        stageTag: 'ACT 05 · HARDEN',
        title: 'Officers Strip Bad Ribbon & Lock Bridge to Peer Mint Towers Only',
        storyExcerpt:
          'Guards tear down the rogue ribbon, drop an emerald peer-only shield over the gatehouse, and recast the crown seals twice.',
        technicalParallel:
          'Revoke non-DC replication ACEs, rotate krbtgt twice (>= 10h apart), and enroll Tier-0 admins in Protected Users.',
        accentHex: '#10B981',
        startSec: 17.2,
        endSec: 20,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 16.4], target: [0.2, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Mint Tower', position: [-5.2, 3.4, 6.8], target: [-4.9, 2.0, 0.2] },
      { id: 'VIEW_B', label: 'Bridge Span', position: [-0.2, 3.4, 6.8], target: [-0.35, 2.2, 0.1] },
      { id: 'VIEW_C', label: 'Audit Tower', position: [5.4, 3.5, 6.8], target: [5.6, 2.1, 0.15] },
    ],
  },

  'step-1': {
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: 'step-1',
    sceneKind: 'dcsync-step1-acl',
    stageBadge: 'STEP #1 · EXPOSED GATEHOUSE RIBBON',
    mitreId: 'T1003.006',
    title: 'Over-Privileged Mint Gatehouse Ribbon Exposes Crown Ledger Rights',
    storyCue:
      'Pinned quietly onto the front of the sovereign mint gatehouse, a forgotten crimson ribbon mistakenly gives an everyday side-street delivery account the exact master-die sync clearance intended solely for peer mint towers.',
    technicalCue:
      'DC=corp,DC=local nTSecurityDescriptor grants DS-Replication-Get-Changes (1131f6aa) & Get-Changes-All (1131f6ad) to CORP\\svc_dir_sync.',
    storyMappings: [
      { storyTerm: 'Glowing Crimson Gatehouse Ribbon', technicalTerm: 'Over-Privileged ACE for 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2', tone: 'rose' },
      { storyTerm: 'Spinning Golden Crown Core', technicalTerm: 'Active Directory krbtgt & Domain Credential Store', tone: 'amber' },
      { storyTerm: 'Gatehouse Access Registry', technicalTerm: 'Domain Root nTSecurityDescriptor Audited via Event ID 5136', tone: 'sky' },
      { storyTerm: 'Peer-Mint Only Rule', technicalTerm: 'Enterprise Domain Controllers Least-Privilege Tier-0 Baseline', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'dc-s1-crown', tag: 'CROWN SECRET', title: 'Sovereign Mint Core', subtitle: 'CN=krbtgt & Domain Root DACL', tone: 'amber' },
      { id: 'dc-s1-ribbon', tag: 'EXPOSED ACL', title: 'Misconfigured Ribbon', subtitle: 'GUID 1131f6ad-... -> svc_dir_sync', tone: 'rose' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Crown Core', stageTag: 'STEP 01 · TIER-0', title: 'Sovereign Mint Protects Master Signing Crown', storyExcerpt: 'Inside the north mint tower spins the golden crown seal backing every official coin in the city.', technicalParallel: 'Domain root DC=corp,DC=local controls replication access to krbtgt and all domain hashes.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Bad Ribbon', stageTag: 'STEP 01 · GUID', title: 'Forgotten Crimson Ribbon Grants Street Van Sync Rights', storyExcerpt: 'A glowing red clearance ribbon left over from an old migration grants full bridge replication.', technicalParallel: 'Non-DC service account svc_dir_sync retains 1131f6aa & 1131f6ad extended rights.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Audit 5136', stageTag: 'STEP 01 · AUDIT', title: 'Continuous Gatehouse Audits Spot Exposed Ribbons Early', storyExcerpt: 'Inspecting the gatehouse registry regularly catches rogue ribbons before any van pulls up.', technicalParallel: 'Monitor Security Event ID 5136 on nTSecurityDescriptor and run periodic Tier-0 ACL audits.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.4, 12.8], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'ACL Ribbon', position: [0.0, 1.8, 5.4], target: [0.0, 1.3, 0.9] },
      { id: 'VIEW_B', label: 'Crown Core', position: [-3.2, 3.0, 5.6], target: [0.0, 2.3, 0.9] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 6.8, 6.0], target: [0.0, 2.0, 0.25] },
    ],
  },

  'step-2': {
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: 'step-2',
    sceneKind: 'dcsync-step2-drsr',
    stageBadge: 'STEP #2 · EXPRESS LEDGER BRIDGE',
    mitreId: 'T1003.006',
    title: 'Rogue Side-Street Courier Pulls Crown Ledgers Over the Express Bridge',
    storyCue:
      'Parked outside the vault walls, the crimson side-street courier taps straight into the elevated glass express bridge—watching golden crown-ledger packets glide smoothly down the track without ever setting foot inside the mint building.',
    technicalCue:
      'WKS-ADMIN-07 (10.20.14.88) invokes DRSUAPI IDL_DRSGetNCChanges (Opnum 3) -> CORP-DC01 streams CN=krbtgt hashes over RPC with zero disk writes.',
    storyMappings: [
      { storyTerm: 'Elevated Glass Bridge Span', technicalTerm: 'MS-DRSR / DRSUAPI RPC Channel Over Dynamic TCP/49668', tone: 'sky' },
      { storyTerm: 'Gliding Golden Ledger Capsule', technicalTerm: 'IDL_DRSGetNCChanges (Opnum 3) Secret Replication Payload', tone: 'amber' },
      { storyTerm: 'Crimson Side-Street Van', technicalTerm: 'Non-DC Workstation WKS-ADMIN-07 Masquerading as Peer DC', tone: 'rose' },
      { storyTerm: 'Bridge Wire Checkpoint', technicalTerm: 'Zeek DCE-RPC & Suricata SID 2043901 Non-DC Subnet Alert', tone: 'emerald' },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'dc-s2-bridge', tag: 'MEMORY STREAM', title: 'Cutaway Express Bridge', subtitle: 'IDL_DRSGetNCChanges · Zero Disk Access', tone: 'amber' },
      { id: 'dc-s2-van', tag: 'NON-DC CALLER', title: 'Rogue Courier Van', subtitle: '10.20.14.88 -> Suricata SID 2043901', tone: 'rose' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Connect', stageTag: 'STEP 02 · BIND', title: 'Street Van Masquerades as Peer Mint Tower on Bridge', storyExcerpt: 'The red side-street courier connects to the elevated bridge using the over-privileged ribbon.', technicalParallel: 'Remote host binds to DRSUAPI interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2.', accentHex: '#E11D48', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Stream', stageTag: 'STEP 02 · OPNUM 3', title: 'Golden Crown Ledger Glides Out Without Touching Vault Floor', storyExcerpt: 'Through the open glass cutaway, golden ledger packets ride smoothly to the impostor van.', technicalParallel: 'CORP-DC01 fulfills IDL_DRSGetNCChanges straight from lsass.exe memory (zero NTDS.dit disk I/O).', accentHex: '#F59E0B', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Wire Trap', stageTag: 'STEP 02 · ZEEK', title: 'Bridge Wire Sensor Flags Non-Tower Street Address', storyExcerpt: 'Sensors along the span spot an ordinary street plate pulling peer-only bridge traffic.', technicalParallel: 'Suricata SID 2043901 and Zeek DCE-RPC immediately flag DRSGetNCChanges outside DC subnets.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.2, 4.5, 13.4], target: [0.4, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Cutaway Span', position: [-1.8, 3.2, 5.8], target: [-1.1, 2.3, 0.15] },
      { id: 'VIEW_B', label: 'Courier Van', position: [3.8, 2.6, 5.6], target: [3.2, 1.3, 0.45] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.4, 7.2, 6.2], target: [0.4, 2.0, 0.2] },
    ],
  },

  'step-3': {
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: 'step-3',
    sceneKind: 'dcsync-step3-eid4662',
    stageBadge: 'STEP #3 · ROSTER AUDIT CORRELATION',
    mitreId: 'T1003.006',
    title: 'Matching the Bridge Transfer Stamp Against the Street Traffic Roster',
    storyCue:
      'Even with zero footprints inside the mint vault, the towering azure audit console stamps every bridge transfer automatically and matches its badge number straight back to the crimson street courier parked outside.',
    technicalCue:
      'Security Event ID 4662 (AccessMask 0x100, GUID 1131f6ad-..., SubjectUserName=svc_dir_sync) joined via SubjectLogonId 0x39e4c2a to EID 4624 IP 10.20.14.88.',
    storyMappings: [
      { storyTerm: 'Azure Bridge Roster Console', technicalTerm: 'Windows Security Event ID 4662 (AccessMask 0x100 · Non-$ User)', tone: 'sky' },
      { storyTerm: 'Matching Badge Number Link', technicalTerm: 'SubjectLogonId 0x39e4c2a Join -> Security Event ID 4624', tone: 'amber' },
      { storyTerm: 'Caught Crimson Street Van', technicalTerm: 'Attributed Source Workstation WKS-ADMIN-07 (10.20.14.88)', tone: 'rose' },
      { storyTerm: 'Flashing Crimson Tower Siren', technicalTerm: 'High-Confidence P1 Sigma & KQL DCSync Alert', tone: 'emerald' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'dc-s3-van', tag: 'ATTRIBUTED SOURCE', title: 'Identified Street Courier', subtitle: 'WKS-ADMIN-07 · IP 10.20.14.88', tone: 'rose' },
      { id: 'dc-s3-tower', tag: 'EID 4662 + 4624', title: 'Mint Audit Roster Tower', subtitle: 'SubjectLogonId 0x39e4c2a Match', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Log 4662', stageTag: 'STEP 03 · 4662', title: 'Audit Tower Logs Non-Tower Identity Pulling Crown Ledger', storyExcerpt: 'The azure roster board flashes when a non-mint courier badge signs for a master-die transfer.', technicalParallel: 'Security EID 4662 records AccessMask=0x100 and GUID 1131f6ad-... for non-$ user svc_dir_sync.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Join 4624', stageTag: 'STEP 03 · JOIN', title: 'Badge Number Links Directly to Parked Red Street Van', storyExcerpt: 'Cross-referencing the session badge exposes the exact street address of the impostor courier.', technicalParallel: 'Joining SubjectLogonId 0x39e4c2a to Security EID 4624 reveals IpAddress=10.20.14.88.', accentHex: '#F59E0B', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. P1 Siren', stageTag: 'STEP 03 · ALERT', title: 'Flashing Crimson Beacon Dispatches Tier-0 Containment Team', storyExcerpt: 'The tower alarm flares bright crimson, launching immediate quarantine and seal rotation.', technicalParallel: 'Dual correlation of EID 4662 + Zeek DRSUAPI gives 100% fidelity despite zero DC disk IOCs.', accentHex: '#E11D48', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.5, 13.2], target: [0.0, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Audit Roster', position: [2.8, 3.0, 5.8], target: [2.35, 2.1, 0.2] },
      { id: 'VIEW_B', label: 'Street Van', position: [-3.0, 2.6, 5.8], target: [-2.6, 1.3, 0.35] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 7.2, 6.4], target: [0.0, 2.0, 0.25] },
    ],
  },

  'step-4': {
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: 'step-4',
    sceneKind: 'dcsync-step4-krbtgt',
    stageBadge: 'STEP #4 · PEER-ONLY BRIDGE & DOUBLE SEAL',
    mitreId: 'T1003.006',
    title: 'Revoking Rogue Ribbons, Locking the Bridge & Double-Recasting the Crown',
    storyCue:
      'With the rogue street van quarantined, mint security strips the over-privileged ribbon off the gatehouse, drops a glowing emerald peer-mint-only shield across the doorway, and recasts the golden crown core twice so stolen copies turn worthless.',
    technicalCue:
      'Strip 1131f6aa/1131f6ad ACEs from non-DC accounts, isolate 10.20.14.88, perform double krbtgt reset (>= 10h apart), and enforce Protected Users.',
    storyMappings: [
      { storyTerm: 'Emerald Peer-Mint Shield', technicalTerm: 'Enterprise Domain Controllers-Only Replication DACL & Firewall', tone: 'emerald' },
      { storyTerm: 'Recast Golden Crown Core', technicalTerm: 'Double krbtgt Password Rotation (>= 10 Hours Apart · EID 4738)', tone: 'amber' },
      { storyTerm: 'Stripped Gatehouse Wall', technicalTerm: 'Zero Non-DC Principals Holding 1131f6aa / 1131f6ad Rights', tone: 'sky' },
      { storyTerm: 'Green Audit Tower Beacon', technicalTerm: 'Continuous EID 4662 + Protected Users Group Enforcement', tone: 'emerald' },
    ],
    accentHex: '#10B981',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'dc-s4-mint', tag: 'HARDENED MINT', title: 'Peer-Only Emerald Gate', subtitle: 'Enterprise DC DACL + 2x krbtgt Reset', tone: 'emerald' },
      { id: 'dc-s4-audit', tag: 'CONTINUOUS GUARD', title: 'Verified Audit Tower', subtitle: 'Zero Non-DC Replication Rights', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Strip ACL', stageTag: 'STEP 04 · CLEAN', title: 'Remove Over-Privileged Ribbon From Mint Gatehouse', storyExcerpt: 'Security strips the forgotten crimson ribbon cleanly off the mint doorway registry.', technicalParallel: 'Remove svc_dir_sync ACEs for 1131f6aa and 1131f6ad from DC=corp,DC=local.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. 2x Crown', stageTag: 'STEP 04 · KRBTGT', title: 'Recast Master Crown Seal Twice to Void Stolen Copies', storyExcerpt: 'The spinning golden crown is recast twice on schedule so every forged stamp immediately fails.', technicalParallel: 'Double krbtgt reset (>= 10h apart) invalidates both current and previous Kerberos signing keys.', accentHex: '#F59E0B', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Peer Lock', stageTag: 'STEP 04 · SEAL', title: 'Emerald Peer-Only Shield Guards Express Bridge Forever', storyExcerpt: 'Only verified peer mint towers may cross the bridge while the audit tower glows steady emerald.', technicalParallel: 'Enforce Protected Users, DC-only RPC firewall rules, and persistent EID 4662 + Zeek monitoring.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.6, 13.6], target: [0.1, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Emerald Gate', position: [-2.6, 3.0, 6.2], target: [-2.2, 2.0, 0.25] },
      { id: 'VIEW_B', label: 'Audit Tower', position: [3.0, 3.1, 6.2], target: [2.45, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 7.4, 6.6], target: [0.0, 2.0, 0.2] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: 'memory-forensics',
    sceneKind: 'dcsync-memory-acldiff',
    stageBadge: 'MEMORY FORENSICS · EXPOSED DACL VS. PEER-ONLY SEAL',
    mitreId: 'T1003.006',
    title: 'Over-Privileged Domain Root Cache vs. Enterprise-DC-Only Hardened Descriptor',
    storyCue:
      'Place the exposed sovereign mint tower with its crimson gatehouse ribbon beside the hardened emerald-shielded tower. A golden audit scanner glides between both towers, comparing open side-street clearance against peer-only protection.',
    technicalCue:
      'Comparing lsass.exe ntdsai.dll DomainRootDACL containing non-DC svc_dir_sync ACE (left) against Enterprise-DC-only hardened descriptor (right).',
    storyMappings: [
      { storyTerm: 'Left Tower Crimson Ribbon', technicalTerm: '0x00007FF9D1100000 · Exposed 1131f6ad-... ACE for svc_dir_sync', tone: 'rose' },
      { storyTerm: 'Right Tower Emerald Shield', technicalTerm: '0x00007FF9D1280000 · Enterprise Domain Controllers-Only DACL', tone: 'emerald' },
      { storyTerm: 'Sweeping Golden Audit Beam', technicalTerm: 'Tier-0 AD ACL Auditor Checking 1131f6aa & 1131f6ad Principals', tone: 'amber' },
      { storyTerm: 'In-Memory Crown Transfer', technicalTerm: '0x00007FF9D11C0000 · DRSUAPI Opnum 3 Buffer (Zero Disk Footprint)', tone: 'sky' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'dc-mem-vuln', tag: 'EXPOSED DACL', title: 'Over-Privileged Mint', subtitle: '1131f6ad-... -> Non-DC Account', tone: 'rose' },
      { id: 'dc-mem-safe', tag: 'HARDENED DACL', title: 'Peer-Only Sealed Mint', subtitle: 'Enterprise DCs Only + 2x krbtgt', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Bad ACE', stageTag: 'DIFF · EXPOSED', title: 'Left Tower Exposes Non-DC Replication Entry in RAM', storyExcerpt: 'On the left, the glowing red gatehouse ribbon grants street vans full crown ledger access.', technicalParallel: '0x00007FF9D1100000 caches ACE granting 1131f6ad-... to non-machine account svc_dir_sync.', accentHex: '#E11D48', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Audit Beam', stageTag: 'DIFF · AUDIT', title: 'Golden Audit Beam Compares Both Tower Descriptors', storyExcerpt: 'The golden scanner sweeps across the plaza contrasting rogue clearance against peer-only locks.', technicalParallel: 'BloodHound / PingCastle / AD PowerShell audit enumerates every principal holding replication GUIDs.', accentHex: '#FACC15', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Peer Only', stageTag: 'DIFF · CLEAN', title: 'Right Emerald Shield Restricts Bridge Strictly to Peer Towers', storyExcerpt: 'On the right, no side-street courier can ever trigger a master-die transfer again.', technicalParallel: '0x00007FF9D1280000 enforces Enterprise DCs-only replication + double krbtgt rotation.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 15.2], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Exposed Tower', position: [-5.2, 3.6, 7.6], target: [-3.1, 2.1, 0.2] },
      { id: 'VIEW_B', label: 'Hardened Tower', position: [5.2, 3.6, 7.6], target: [3.1, 2.1, 0.2] },
      { id: 'VIEW_C', label: 'Top Audit', position: [0.0, 8.2, 7.4], target: [0.0, 2.1, 0.2] },
    ],
  },
};
