import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #037 (`zerologon-netlogon-cve-2020-1472`).
 * Universe: Alpine Vault Electronic Dial Keypad, Zero-Pin Cipher Chamber, Guard Alarm Tower & Armored Cobalt Seal Gate.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const ZEROLOGON_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    sectionKey: 'briefing',
    sceneKind: 'zlog-vault-briefing',
    stageBadge: 'BRIEFING #0 · ALPINE VAULT KEYPAD DIORAMA',
    mitreId: 'T1210',
    title: 'Alpine Vault Zero-Pin Dial, Alarm Tower Storm & Cobalt Seal Gate',
    storyCue:
      'Inside a brushed-steel alpine bank vault, a persistent outsider taps an all-zero test code across an unsealed keypad until the flawed internal scrambling wheels align on matching zeros—swapping the master brass cartridge for a blank key until the guard alarm tower catches the rapid tally storm and drops a permanent cobalt armor gate.',
    technicalCue:
      'Unsealed MS-NRPC AES-CFB8 hardcoded zero IV (1-in-256) -> 240x System EID 5805 burst -> Security EID 4742 (ANONYMOUS LOGON) -> FullSecureChannelProtection = 1 (EID 5827).',
    storyMappings: [
      { storyTerm: 'Unsealed Hallway Test Piston', technicalTerm: 'Unauthenticated MS-NRPC Caller With Sign/Seal Bit Cleared', tone: 'rose' },
      { storyTerm: 'Zero-Reset Internal Cipher Wheels', technicalTerm: 'ComputeNetlogonCredential AES-CFB8 Hardcoded 16-Byte All-Zero IV', tone: 'sky' },
      { storyTerm: 'Flashing Amber Tally Stack', technicalTerm: '240+ System Event ID 5805 Netlogon Failure Burst in 2.4s', tone: 'amber' },
      { storyTerm: 'Blank Master Brass Cartridge', technicalTerm: 'NetrServerPasswordSet2 Reset -> Security EID 4742 (ANONYMOUS LOGON)', tone: 'rose' },
      { storyTerm: 'Vault Guard Audit Tower', technicalTerm: 'SIEM Correlation + Suricata SID 2030868 + $MACHINE.ACC Verification', tone: 'amber' },
      { storyTerm: 'Armored Cobalt Seal Gate', technicalTerm: 'FullSecureChannelProtection = 1 (System Event ID 5827 Enforcement)', tone: 'emerald' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      { id: 'zlog-vault', tag: 'ZERO-IV LOCK', title: 'Alpine Steel Vault Door', subtitle: 'CORP-DC01 Netlogon · AES-CFB8 Zero IV', tone: 'sky' },
      { id: 'zlog-tower', tag: 'ALARM TELEMETRY', title: 'Guard Audit Tower', subtitle: '240x EID 5805 + EID 4742 -> EID 5827', tone: 'amber' },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Tap Zero',
        stageTag: 'ACT 01 · PROBE',
        title: 'Unsealed Mechanical Piston Rapidly Taps All-Zero Code',
        storyExcerpt:
          'Without carrying an armored pass tube, a mechanical test piston rapidly taps an all-zero combination against the vault keypad.',
        technicalParallel:
          'Unauthenticated caller opens unsealed MS-NRPC channel and sends repeated 8-byte zero NetrServerReqChallenge packets.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4.4,
      },
      {
        id: 2,
        shortLabel: '2. Zero Hit',
        stageTag: 'ACT 02 · 1-IN-256',
        title: 'Cutaway Reveals Internal Cipher Wheels Aligning on Zeros',
        storyExcerpt:
          'The armored hatch lifts to reveal three internal wheels starting from zero until one cycle aligns cleanly across all eight dials.',
        technicalParallel:
          'Hardcoded 16-byte zero IV in AES-CFB8 yields a 1-in-256 collision while logging 240+ System Event ID 5805 bursts.',
        accentHex: '#F59E0B',
        startSec: 4.4,
        endSec: 9,
      },
      {
        id: 3,
        shortLabel: '3. Blank Key',
        stageTag: 'ACT 03 · EID 4742',
        title: 'Vault Brass Cartridge Flips to Blank Key & Trips Sync Alarm',
        storyExcerpt:
          'The master brass cartridge flips to a blank metal bar, causing the vault’s backup safe and hallway indicators to lose sync.',
        technicalParallel:
          'NetrServerPasswordSet2 resets CORP-DC01$ to empty hash, firing Security EID 4742 (ANONYMOUS LOGON) and desyncing $MACHINE.ACC.',
        accentHex: '#E11D48',
        startSec: 9,
        endSec: 13.6,
      },
      {
        id: 4,
        shortLabel: '4. Audit Siren',
        stageTag: 'ACT 04 · CONTAIN',
        title: 'Guard Tower Siren Flags Frantic Tally Storm & Restores Key',
        storyExcerpt:
          'Every amber bar on the audit tower lights up at once, bringing engineers rushing in to restore the original brass cartridge.',
        technicalParallel:
          'SOC correlates EID 5805 burst + EID 4742, isolates 10.20.14.91, restores $MACHINE.ACC, and rotates krbtgt twice.',
        accentHex: '#F59E0B',
        startSec: 13.6,
        endSec: 17,
      },
      {
        id: 5,
        shortLabel: '5. Cobalt Gate',
        stageTag: 'ACT 05 · EID 5827',
        title: 'Armored Cobalt Gate Seals Vault Against Unsealed Probes',
        storyExcerpt:
          'A glowing cobalt barrier drops cleanly across the vault keypad, rejecting every unsealed hallway knock forever.',
        technicalParallel:
          'Microsoft patch + FullSecureChannelProtection = 1 enforces Netlogon Secure RPC and blocks unsealed calls with EID 5827.',
        accentHex: '#10B981',
        startSec: 17,
        endSec: 20,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 16.2], target: [0.1, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Test Piston', position: [-5.2, 3.2, 6.6], target: [-4.6, 1.7, 0.25] },
      { id: 'VIEW_B', label: 'Vault Wheels', position: [0.0, 3.3, 6.8], target: [0.0, 1.9, 0.2] },
      { id: 'VIEW_C', label: 'Audit Tower', position: [5.2, 3.4, 6.8], target: [5.1, 2.0, 0.15] },
    ],
  },

  'step-1': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    sectionKey: 'step-1',
    sceneKind: 'zlog-step1-zeroiv',
    stageBadge: 'STEP #1 · ZERO-IV CIPHER FLAW',
    mitreId: 'T1210',
    title: 'How a Fixed All-Zero Starting State Creates a 1-in-256 Keypad Alignment',
    storyCue:
      'With the steel inspection hatch lifted open, the mechanical piston taps an all-zero code directly at the vault wheels—showing why starting every scramble from zero turns a billion-combo lock into a quick one-in-two-hundred-fifty-six alignment.',
    technicalCue:
      'MS-NRPC ComputeNetlogonCredential uses AES-CFB8 with hardcoded IV=0x00..00 -> 1 in 256 session keys encrypts 8 zero bytes to 8 zero bytes.',
    storyMappings: [
      { storyTerm: 'Unsealed Hallway Piston', technicalTerm: 'Unauthenticated Caller Clearing NegotiateFlags Sign/Seal Bit', tone: 'rose' },
      { storyTerm: 'Zero-Reset Cipher Wheels', technicalTerm: 'AES-CFB8 Shift Register Initialized With Fixed 16-Byte Zero IV', tone: 'sky' },
      { storyTerm: '1-in-256 Alignment Chance', technicalTerm: '1/256 Session Keys Output First Byte 0x00 -> All 8 Bytes 0x00', tone: 'amber' },
      { storyTerm: 'Hallway Motion Sensor', technicalTerm: 'Suricata SID 2030868 Monitoring Rapid NetrServerReqChallenge Calls', tone: 'emerald' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'zlog-s1-piston', tag: 'UNSEALED CALLER', title: 'Zero-Code Test Piston', subtitle: 'TCP/135 -> TCP/49155 MS-NRPC', tone: 'rose' },
      { id: 'zlog-s1-wheels', tag: 'CRYPTO DEFECT', title: 'Zero-Reset Cipher Wheels', subtitle: 'AES-CFB8 Fixed IV · 1-in-256', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. No Seal', stageTag: 'STEP 01 · RPC', title: 'Caller Approaches Vault Without Armored Seal Tube', storyExcerpt: 'The test piston connects straight to the vault lock without presenting a sealed tunnel.', technicalParallel: 'NegotiateFlags omits Secure RPC signing/sealing on an unpatched Domain Controller.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Zero IV', stageTag: 'STEP 01 · CFB8', title: 'Internal Wheels Always Reset to All Zeros', storyExcerpt: 'Every cycle begins from the exact same zero alignment, making zero inputs feed back into zeros.', technicalParallel: 'ComputeNetlogonCredential hardcodes IV = 0x00..00 across 16 bytes in AES-CFB8.', accentHex: '#F59E0B', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Wire Alert', stageTag: 'STEP 01 · IDS', title: 'Hallway Sensor Catches Rapid Zero-Tap Bursts', storyExcerpt: 'Even before alignment hits, the rapid mechanical tapping alerts the vault security desk.', technicalParallel: 'Suricata SID 2030868 flags high-velocity zero-challenge NetrServerAuthenticate3 bursts.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.5, 13.4], target: [-0.3, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Piston Arm', position: [-3.4, 2.8, 5.8], target: [-2.4, 1.6, 0.2] },
      { id: 'VIEW_B', label: 'Cipher Wheels', position: [1.8, 2.9, 5.6], target: [1.65, 1.9, 0.25] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 6.8, 6.2], target: [0.0, 1.8, 0.2] },
    ],
  },

  'step-2': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    sectionKey: 'step-2',
    sceneKind: 'zlog-step2-eid5805',
    stageBadge: 'STEP #2 · AUDIT TOWER FAILURE STORM',
    mitreId: 'T1210',
    title: 'Two Hundred Forty Rejected Taps Light Up the Guard Alarm Tower',
    storyCue:
      'Every missed attempt against the alpine vault door increments another amber bar on the guard audit tower—piling up over two hundred forty rejection chimes in under three seconds so defenders can spot active probing immediately.',
    technicalCue:
      'CORP-DC01 logs 240+ System Event ID 5805 (NETLOGON) failures within 2.4 seconds plus Event ID 5829 in audit mode.',
    storyMappings: [
      { storyTerm: 'Rising Amber Tally Bars', technicalTerm: '240+ Consecutive System Event ID 5805 Netlogon Failures', tone: 'amber' },
      { storyTerm: 'Sub-Three-Second Chime Burst', technicalTerm: 'KQL Anomaly Threshold >= 25 EID 5805 Events / 60s Per DC', tone: 'rose' },
      { storyTerm: 'Audit Mode Warning Lamp', technicalTerm: 'System Event ID 5829 Recording Vulnerable Unsealed Channels', tone: 'sky' },
      { storyTerm: 'Immediate SOC Response', technicalTerm: 'Automated Host Containment Before Machine Password Tampering', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'zlog-s2-vault', tag: 'TARGET VAULT', title: 'Rejecting Vault Door', subtitle: 'STATUS_ACCESS_DENIED (0xC0000022)', tone: 'sky' },
      { id: 'zlog-s2-tower', tag: 'BURST SIGNAL', title: 'Flashing Audit Tower', subtitle: '240x System EID 5805 / 2.4s', tone: 'amber' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Misses', stageTag: 'STEP 02 · BURST', title: 'Dozens of Rejected Taps Begin Stacking Amber Bars', storyExcerpt: 'Rejected keypad strikes fire rapid amber warnings from the vault door toward the audit tower.', technicalParallel: 'Failed NetrServerAuthenticate3 calls return 0xC0000022 and log System EID 5805.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. 240 Spike', stageTag: 'STEP 02 · EID 5805', title: 'All Four Tally Bars Blaze Full Within Three Seconds', storyExcerpt: 'Normal traffic never produces two hundred forty rejections in three seconds—the tower alarm flares bright.', technicalParallel: 'SIEM KQL rule triggers high-severity alert at >= 25 EID 5805 failures/min on CORP-DC01.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Audit Log', stageTag: 'STEP 02 · EID 5829', title: 'Audit Channel Pinpoints Exact Unsealed Source Station', storyExcerpt: 'The tower log tags the exact corridor station responsible so guards can lock it down fast.', technicalParallel: 'System EID 5829 logs source IP and machine identity attempting unsealed Netlogon RPC.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.1, 4.5, 13.4], target: [0.2, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Audit Tower', position: [3.0, 3.0, 6.0], target: [2.55, 2.0, 0.2] },
      { id: 'VIEW_B', label: 'Vault Side', position: [-2.8, 3.0, 6.2], target: [-2.2, 1.9, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 7.2, 6.6], target: [0.0, 2.0, 0.2] },
    ],
  },

  'step-3': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    sectionKey: 'step-3',
    sceneKind: 'zlog-step3-eid4742',
    stageBadge: 'STEP #3 · BLANK CARTRIDGE SWAP',
    mitreId: 'T1098',
    title: 'Anonymous Blank Key Swap Desynchronizes the Vault From Its Internal Safe',
    storyCue:
      'Once the zero alignment accepts a session, the vault’s master brass cartridge slides forward and turns blank—breaking harmony with the sealed backup safe inside and lighting up an immediate anonymous key-change alert.',
    technicalCue:
      'NetrServerPasswordSet2 overwrites CORP-DC01$ directory hash with empty value -> Security EID 4742 (ANONYMOUS LOGON) & $MACHINE.ACC desync.',
    storyMappings: [
      { storyTerm: 'Blank Silver Cartridge Swap', technicalTerm: 'CORP-DC01$ Directory Hash Set to Empty (31d6cfe0...c089c0)', tone: 'rose' },
      { storyTerm: 'Anonymous Ledger Stamp', technicalTerm: 'Security Event ID 4742 · SubjectUserName = ANONYMOUS LOGON', tone: 'amber' },
      { storyTerm: 'Unchanged Internal Backup Safe', technicalTerm: 'HKLM\\SECURITY\\Policy\\Secrets\\$MACHINE.ACC Still Intact', tone: 'sky' },
      { storyTerm: 'Broken Hallway Sync Lamps', technicalTerm: 'Immediate Active Directory Replication & DNS Failure Symptoms', tone: 'emerald' },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'zlog-s3-vault', tag: 'CRITICAL AUDIT', title: 'Anonymous Vault Override', subtitle: 'Security EID 4742 · ANONYMOUS LOGON', tone: 'rose' },
      { id: 'zlog-s3-cart', tag: 'DESYNC STATE', title: 'Blank Master Cartridge', subtitle: 'NTDS.dit Empty vs. $MACHINE.ACC', tone: 'amber' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Intact Key', stageTag: 'STEP 03 · BASELINE', title: 'Original Brass Cartridge Matches Internal Safe', storyExcerpt: 'Before tampering, the vault cartridge and internal backup safe carry matching brass notches.', technicalParallel: 'NTDS.dit hash and local LSA $MACHINE.ACC secret stay synchronized every 30 days.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Blank Swap', stageTag: 'STEP 03 · EID 4742', title: 'Anonymous Call Replaces Cartridge With Blank Metal', storyExcerpt: 'The cartridge slides out and flashes crimson as an unnamed caller wipes its teeth completely flat.', technicalParallel: 'NetrServerPasswordSet2 sets empty hash; Security EID 4742 logs SubjectUserName=ANONYMOUS LOGON.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. P1 Alert', stageTag: 'STEP 03 · DESYNC', title: 'Mismatch Triggers Zero-False-Positive P1 Incident', storyExcerpt: 'Because no unnamed guest should ever swap a vault key, the alarm immediately escalates to P1.', technicalParallel: 'Sigma/KQL rule on EID 4742 (ANONYMOUS LOGON + TargetUserName ends with $) fires with zero false positives.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.4, 13.0], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Cartridge Slot', position: [0.0, 2.1, 5.4], target: [0.0, 1.1, 0.65] },
      { id: 'VIEW_B', label: 'Cipher Deck', position: [-3.4, 3.0, 5.8], target: [0.0, 1.9, 0.25] },
      { id: 'VIEW_C', label: 'Top Cutaway', position: [0.0, 6.8, 5.8], target: [0.0, 1.8, 0.25] },
    ],
  },

  'step-4': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    sectionKey: 'step-4',
    sceneKind: 'zlog-step4-securerpc',
    stageBadge: 'STEP #4 · ARMORED COBALT SEAL GATE',
    mitreId: 'T1003.006',
    title: 'Restoring the Original Vault Key & Sealing Every Door Behind Cobalt Armor',
    storyCue:
      'Following emergency containment procedures, alpine engineers restore the matching brass cartridge from the intact internal safe, rotate master seals twice, and lower a glowing cobalt barrier across the vault door so unsealed knocks bounce off permanently.',
    technicalCue:
      'CISA ED 20-04 remediation: restore CORP-DC01$ secret, rotate krbtgt twice, and set FullSecureChannelProtection = 1 (System Event ID 5827 enforcement).',
    storyMappings: [
      { storyTerm: 'Armored Cobalt Barrier Gate', technicalTerm: 'FullSecureChannelProtection = 1 (Enforced Netlogon Secure RPC)', tone: 'sky' },
      { storyTerm: 'Emerald Recovery Seal Badge', technicalTerm: 'System Event ID 5827 Confirming Unsealed Connections Denied', tone: 'emerald' },
      { storyTerm: 'Restored Brass Cartridge', technicalTerm: 'CORP-DC01$ Password Synchronized With Local $MACHINE.ACC', tone: 'amber' },
      { storyTerm: 'Double Master Seal Rotation', technicalTerm: 'Double krbtgt Password Reset + Audit Zero EID 4662 Replication', tone: 'emerald' },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'zlog-s4-gate', tag: 'HARDENED DOOR', title: 'Armored Cobalt Seal Gate', subtitle: 'FullSecureChannelProtection = 1', tone: 'sky' },
      { id: 'zlog-s4-audit', tag: 'VERIFIED CLEAN', title: 'Emerald Recovery Tower', subtitle: 'EID 5827 Block + Double krbtgt Reset', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Restore Key', stageTag: 'STEP 04 · SYNC', title: 'Restore Matching Cartridge From Intact Internal Safe', storyExcerpt: 'Engineers pull the intact brass template from the internal safe to restore vault harmony.', technicalParallel: 'Restore CORP-DC01$ password consistency so AD replication and DNS recover cleanly.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Drop Gate', stageTag: 'STEP 04 · RPC', title: 'Lower Cobalt Secure-Channel Gate Across Vault Keypad', storyExcerpt: 'A glowing cobalt armor barrier locks over the keypad, requiring a sealed tunnel on every call.', technicalParallel: 'Enable FullSecureChannelProtection = 1 across every Domain Controller per CISA ED 20-04.', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Verify 5827', stageTag: 'STEP 04 · VERIFY', title: 'Audit Tower Confirms Permanent Denial & Forest Hygiene', storyExcerpt: 'Green recovery lamps confirm every unsealed knock is rejected and central seals are freshly rotated.', technicalParallel: 'Verify System EID 5827 blocks unsealed RPC and complete double krbtgt reset (10+ hours apart).', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.1, 4.6, 13.6], target: [0.2, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Cobalt Gate', position: [-2.6, 3.0, 6.2], target: [-2.0, 1.9, 0.3] },
      { id: 'VIEW_B', label: 'Recovery Tower', position: [3.2, 3.1, 6.2], target: [2.6, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 7.4, 6.6], target: [0.0, 2.0, 0.2] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    sectionKey: 'memory-forensics',
    sceneKind: 'zlog-memory-ivdiff',
    stageBadge: 'MEMORY FORENSICS · ZERO-IV LOCK VS. COBALT SECURE GATE',
    mitreId: 'T1210',
    title: 'Vulnerable Zero-IV Cipher State vs. Enforced Secure-Channel Policy',
    storyCue:
      'Place the open vulnerable zero-wheel alpine vault directly beside the cobalt-armored hardened vault. A glacial audit scanner sweeps across both doors, contrasting exposed zero-start scrambling on the left against full sealed-channel protection on the right.',
    technicalCue:
      'Comparing lsass.exe netlogon.dll zero-IV AES-CFB8 state & $MACHINE.ACC desync (left) against enforced FullSecureChannelProtection = 1 policy (right).',
    storyMappings: [
      { storyTerm: 'Exposed Left Zero-Wheel Vault', technicalTerm: '0x00007FF8C2100000 · AES-CFB8 Hardcoded 16-Byte Zero IV', tone: 'rose' },
      { storyTerm: 'Armored Right Cobalt Vault', technicalTerm: '0x00007FF8C2240000 · FullSecureChannelProtection = 1 Policy', tone: 'emerald' },
      { storyTerm: 'Glacial Audit Scanner Beam', technicalTerm: 'CISA ED 20-04 Fleet Audit Verifying Patch & Enforcement Keys', tone: 'sky' },
      { storyTerm: 'Desynced Brass Cartridge', technicalTerm: '0x00007FF8C2180000 · NTDS.dit Empty Hash vs. $MACHINE.ACC', tone: 'amber' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'zlog-mem-vuln', tag: 'VULNERABLE STATE', title: 'Exposed Zero-IV Vault', subtitle: 'Fixed 16-Byte Zero IV · 1-in-256', tone: 'rose' },
      { id: 'zlog-mem-safe', tag: 'HARDENED STATE', title: 'Cobalt Armored Vault', subtitle: 'Secure RPC Enforced · EID 5827', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Zero IV', stageTag: 'DIFF · VULN', title: 'Left Vault Shows Open Zero-Reset Cipher Wheels', storyExcerpt: 'On the left, exposed scrambling wheels restart from zero on every unsealed knock.', technicalParallel: 'Unpatched netlogon.dll accepts unsealed MS-NRPC with hardcoded 0x00..00 IV.', accentHex: '#E11D48', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Audit Sweep', stageTag: 'DIFF · AUDIT', title: 'Glacial Scanner Contrasts Both Vault Configurations', storyExcerpt: 'The glowing cyan beam sweeps side to side comparing vulnerable and hardened doors.', technicalParallel: 'Defenders inspect registry FullSecureChannelProtection and check EID 5827/5829 logs.', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Enforced', stageTag: 'DIFF · FIXED', title: 'Right Cobalt Barrier Eliminates Unsealed Access Completely', storyExcerpt: 'On the right, the solid cobalt seal stops unsealed hallway testing before the keypad even wakes.', technicalParallel: 'FullSecureChannelProtection = 1 mandates signed & sealed Secure RPC on all DCs.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 15.4], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Vuln Vault', position: [-5.2, 3.6, 7.6], target: [-3.1, 2.0, 0.2] },
      { id: 'VIEW_B', label: 'Hardened Vault', position: [5.2, 3.6, 7.6], target: [3.1, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'Top Audit', position: [0.0, 8.2, 7.4], target: [0.0, 2.0, 0.2] },
    ],
  },
};
