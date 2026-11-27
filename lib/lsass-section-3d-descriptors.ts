import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #020 (`dfir-lsass-minidump-comsvcs-sysmon-eid10`).
 * Universe: Armored Marble Bank Safe-Deposit Vault Hall, Brass X-Ray Vault Photographer Cart,
 * Instant Polaroid Negative & Elevated Glass Security Guard Booth.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const LSASS_COMSVCS_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'briefing',
    sceneKind: 'lsass-vault-briefing',
    stageBadge: 'BRIEFING #0 · FULL KILL-CHAIN DIORAMA',
    mitreId: 'T1003.001',
    title: 'Armored Bank Safe-Deposit Vault, X-Ray Photographer & Glass Guard Booth',
    storyCue:
      'Inside an armored marble bank safe-deposit vault hall, a rogue insider flashes an elevated golden inspector badge and wheels the bank’s own certified brass-framed vault photographer down the aisle. The photographer widens an official X-ray camera lens straight through the circular steel vault door, ejecting an instant X-ray photo negative onto a hallway packing table for quiet off-site study—while an elevated glass security guard booth records the camera badge number and locks a violet spotlight straight onto the lens.',
    technicalCue:
      'SeDebugPrivilege (EID 4672) + tasklist PID 684 -> rundll32.exe comsvcs.dll, MiniDump (#24) -> OpenProcess(0x1010) (Sysmon EID 10) -> dbgcore.dll!MiniDumpWriteDump -> C:\\Windows\\Temp\\debug.dmp (48.2 MB MDMP) -> offline pypykatz vs. RunAsPPL.',
    storyMappings: [
      {
        storyTerm: 'Elevated Golden Inspector Badge',
        technicalTerm: 'SeDebugPrivilege Token Elevation (Windows Security EID 4672)',
        tone: 'amber',
      },
      {
        storyTerm: 'Certified Bank Vault Photographer',
        technicalTerm: 'Signed rundll32.exe Calling C:\\Windows\\System32\\comsvcs.dll,#24',
        tone: 'sky',
      },
      {
        storyTerm: 'Wide-Open X-Ray Camera Lens',
        technicalTerm: 'OpenProcess(lsass.exe, 0x1010 / 0x1FFFFF — PROCESS_VM_READ)',
        tone: 'rose',
      },
      {
        storyTerm: 'Circular Steel Safe-Deposit Vault',
        technicalTerm: 'lsass.exe (PID 684) Hosting MSV1_0 NTLM & Kerberos Credentials',
        tone: 'amber',
      },
      {
        storyTerm: 'Instant X-Ray Negative on Packing Table',
        technicalTerm: 'MDMP 0x504D444D Minidump File (C:\\Windows\\Temp\\debug.dmp)',
        tone: 'rose',
      },
      {
        storyTerm: 'Glass Security Booth Camera Log',
        technicalTerm: 'Sysmon Event ID 10 (ProcessAccess) + CallTrace (comsvcs.dll + dbgcore.dll)',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'lsass-photographer',
        tag: 'SIGNED PROXY CAMERA',
        title: 'Vault Photographer Cart',
        subtitle: 'rundll32.exe · comsvcs.dll,#24 (0x1010)',
        tone: 'amber',
      },
      {
        id: 'lsass-vault',
        tag: 'CREDENTIAL VAULT',
        title: 'Safe-Deposit Vault Door',
        subtitle: 'lsass.exe (PID 684) · NTLM & Kerberos',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Badge & PID',
        stageTag: 'ACT 01 · PRIVILEGE',
        title: 'Golden Inspector Badge Flashes & Pins Vault Door Number',
        storyExcerpt:
          'At the marble reception desk, the insider flashes an elevated golden inspector badge and checks the glowing vault directory plaque.',
        technicalParallel:
          'Security EID 4672 confirms SeDebugPrivilege on cmd.exe (PID 4920), and tasklist resolves lsass.exe PID 684.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Vault Cart',
        stageTag: 'ACT 02 · LOLBIN',
        title: 'Certified Vault Photographer Rolls Up to Steel Door',
        storyExcerpt:
          'The bank’s own brass-framed X-ray photographer cart glides down the marble aisle with no contraband tools in sight.',
        technicalParallel:
          'Microsoft-signed rundll32.exe (PID 5412) loads C:\\Windows\\System32\\comsvcs.dll and invokes export MiniDump (ordinal #24).',
        accentHex: '#38BDF8',
        startSec: 4,
        endSec: 8,
      },
      {
        id: 3,
        shortLabel: '3. X-Ray 0x1010',
        stageTag: 'ACT 03 · ACCESS',
        title: 'Wide-Open X-Ray Lens Scans Golden Passkey Drawers',
        storyExcerpt:
          'With the vault glass lifted in cutaway, the brass lens widens and projects a crimson X-ray cone straight through every safety-deposit box.',
        technicalParallel:
          'OpenProcess(0x1010, FALSE, 684) grants PROCESS_VM_READ on lsass.exe so MiniDumpWriteDump reads lsasrv.dll!LogonSessionList.',
        accentHex: '#E11D48',
        startSec: 8,
        endSec: 12.8,
      },
      {
        id: 4,
        shortLabel: '4. MDMP Negative',
        stageTag: 'ACT 04 · DUMP',
        title: 'Instant X-Ray Negative Slides Into Courier Envelope',
        storyExcerpt:
          'A sharp instant X-ray photo negative slides onto the packing table and slips into a plain courier sleeve for off-site darkroom reading.',
        technicalParallel:
          'dbgcore.dll writes 48.2 MB C:\\Windows\\Temp\\debug.dmp starting with magic bytes 4D 44 4D 50 93 A7 (Sysmon EID 11).',
        accentHex: '#F43F5E',
        startSec: 12.8,
        endSec: 16.8,
      },
      {
        id: 5,
        shortLabel: '5. Booth EID 10',
        stageTag: 'ACT 05 · SYSMON 10',
        title: 'Glass Security Booth Locks Violet Spotlight Onto Lens',
        storyExcerpt:
          'Overhead, the glass guard booth flashes bright violet and beams a spotlight directly onto the certified photographer’s camera path.',
        technicalParallel:
          'Sysmon Event ID 10 records GrantedAccess 0x1010 and CallTrace (comsvcs.dll + dbgcore.dll), exposing the theft regardless of ordinal #24.',
        accentHex: '#7C3AED',
        startSec: 16.8,
        endSec: 20,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 16.4], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Badge Desk', position: [-4.8, 3.4, 7.2], target: [-4.6, 1.8, 0.2] },
      { id: 'VIEW_B', label: 'X-Ray Cart', position: [-0.2, 3.2, 6.8], target: [0.5, 2.1, 0.2] },
      { id: 'VIEW_C', label: 'Guard Booth', position: [3.2, 5.4, 11.2], target: [0.6, 2.6, -1.0] },
    ],
  },

  'step-1': {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-1',
    sceneKind: 'lsass-step1-sedebug',
    stageBadge: 'STEP #1 · GOLDEN INSPECTOR BADGE',
    mitreId: 'T1134',
    title: 'Flashing the Elevated Inspector Badge & Checking the Vault Directory',
    storyCue:
      'At the administrative marble desk, the insider presents an elevated golden inspector badge granting back-office authority and reads the glowing vault door number from the bank room plaque before summoning the photographer.',
    technicalCue:
      'Windows Security EID 4672 confirms SeDebugPrivilege on High-integrity cmd.exe (PID 4920), and tasklist resolves lsass.exe PID 684.',
    storyMappings: [
      {
        storyTerm: 'Elevated Golden Inspector Badge',
        technicalTerm: 'SeDebugPrivilege Assigned at Logon (Security Event ID 4672)',
        tone: 'amber',
      },
      {
        storyTerm: 'Glowing Vault Directory Plaque',
        technicalTerm: 'tasklist /fi "imagename eq lsass.exe" -> PID 684',
        tone: 'sky',
      },
      {
        storyTerm: 'Mahogany Reception Console',
        technicalTerm: 'Elevated cmd.exe (PID 4920 · CORP\\adm_jchen · High Integrity)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Pre-Summon Numeric Tag',
        technicalTerm: 'Mandatory Numeric Target PID Argument Required by comsvcs.dll',
        tone: 'rose',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'lsass-s1-badge',
        tag: 'PRIVILEGE GATE',
        title: 'Golden Inspector Badge',
        subtitle: 'SeDebugPrivilege · Security EID 4672',
        tone: 'amber',
      },
      {
        id: 'lsass-s1-plaque',
        tag: 'TARGET DISCOVERY',
        title: 'Vault Directory Plaque',
        subtitle: 'tasklist -> lsass.exe PID 684',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Badge Lift',
        stageTag: 'STEP 01 · TOKEN',
        title: 'Elevated Golden Inspector Badge Activates on Desk',
        storyExcerpt:
          'The hexagonal golden inspector badge rises from its velvet tray, signaling elevated back-office clearance.',
        technicalParallel:
          'Windows Security EID 4672 logs SeDebugPrivilege assigned to CORP\\adm_jchen High-integrity logon token.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Room Check',
        stageTag: 'STEP 01 · PID 684',
        title: 'Directory Plaque Illuminates Target Vault Number',
        storyExcerpt:
          'Next to the badge, the cyan bank directory lights up with the exact vault door number holding active master keys.',
        technicalParallel:
          'cmd.exe (PID 4920) runs tasklist /fi "imagename eq lsass.exe" and captures numeric PID 684.',
        accentHex: '#38BDF8',
        startSec: 5,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. Ready Summon',
        stageTag: 'STEP 01 · PRECURSOR',
        title: 'Pre-Dump Enumeration Sets Up Signed Photographer Call',
        storyExcerpt:
          'Armed with both golden clearance and the exact vault number, the insider is ready to wheel in the official camera.',
        technicalParallel:
          'Correlating EID 4672 with Sysmon EID 1 tasklist queries flags LSASS discovery prior to handle acquisition.',
        accentHex: '#10B981',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.2, 12.2], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Gold Badge', position: [-2.8, 3.2, 5.2], target: [-0.8, 2.2, 0.2] },
      { id: 'VIEW_B', label: 'PID Plaque', position: [2.8, 3.0, 5.2], target: [0.9, 2.1, 0.1] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 6.4, 5.6], target: [0.0, 1.8, 0.2] },
    ],
  },

  'step-2': {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-2',
    sceneKind: 'lsass-step2-comsvcs',
    stageBadge: 'STEP #2 · CERTIFIED PHOTOGRAPHER & 0x1010 LENS',
    mitreId: 'T1218.011',
    title: 'Wheeling the Certified X-Ray Camera Up to the Safe-Deposit Vault',
    storyCue:
      'Instead of smuggling outside tools, the insider wheels the bank’s own certified brass-framed photographer cart straight up to the circular steel vault door. Turning the brass iris ring wide open requests full X-ray viewing permission across every locked box inside.',
    technicalCue:
      'Signed rundll32.exe (PID 5412) calls comsvcs.dll, MiniDump (#24) 684 C:\\Windows\\Temp\\debug.dmp full -> OpenProcess(0x1010) triggers Sysmon EID 10.',
    storyMappings: [
      {
        storyTerm: 'Certified Brass Photographer Cart',
        technicalTerm: 'Signed rundll32.exe (PID 5412) + C:\\Windows\\System32\\comsvcs.dll',
        tone: 'amber',
      },
      {
        storyTerm: 'Secret Preset Dial #24',
        technicalTerm: 'Export Ordinal #24 Evasion Bypassing "MiniDump" String Filters',
        tone: 'sky',
      },
      {
        storyTerm: 'Wide-Open Brass Aperture Ring',
        technicalTerm: 'OpenProcess(0x1010 — PROCESS_QUERY_LIMITED_INFORMATION | VM_READ)',
        tone: 'rose',
      },
      {
        storyTerm: 'Glowing Vault Cutaway Drawers',
        technicalTerm: 'lsass.exe (PID 684) Private RAM Holding Active Credential Sessions',
        tone: 'emerald',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'lsass-s2-cart',
        tag: 'SIGNED LOLBIN',
        title: 'Vault Photographer Camera',
        subtitle: 'rundll32.exe · comsvcs.dll,#24 (0x1010)',
        tone: 'rose',
      },
      {
        id: 'lsass-s2-vault',
        tag: 'TARGET VAULT',
        title: 'Safe-Deposit Boxes',
        subtitle: 'lsass.exe (PID 684) · Unprotected PPL=0',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Cart Roll',
        stageTag: 'STEP 02 · PROXY',
        title: 'Signed Photographer Cart Rolls Into Position',
        storyExcerpt:
          'Wearing official bank markings, the brass tripod camera glides smoothly along the floor track right up to the vault.',
        technicalParallel:
          'rundll32.exe (PID 5412) loads Microsoft-signed comsvcs.dll and resolves export MiniDump (ordinal #24).',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Lens 0x1010',
        stageTag: 'STEP 02 · HANDLE',
        title: 'Brass Aperture Ring Opens Wide for Deep Vault Viewing',
        storyExcerpt:
          'The camera’s brass iris twists wide open, requesting unrestricted read-through access to the vault interior.',
        technicalParallel:
          'comsvcs.dll invokes RtlAdjustPrivilege and calls OpenProcess(0x1010, FALSE, 684), logging Sysmon Event ID 10.',
        accentHex: '#E11D48',
        startSec: 4.8,
        endSec: 9.8,
      },
      {
        id: 3,
        shortLabel: '3. X-Ray Lock',
        stageTag: 'STEP 02 · TRACE',
        title: 'Crimson X-Ray Cone Penetrates Unshielded Vault Glass',
        storyExcerpt:
          'With no armored steel blast shield in place, the crimson X-ray beam floods straight through all six golden drawers.',
        technicalParallel:
          'Because RunAsPPL is disabled on WKS-ADM-07, OpenProcess returns a live handle with PROCESS_VM_READ.',
        accentHex: '#F43F5E',
        startSec: 9.8,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.3, 4.4, 13.6], target: [0.35, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'X-Ray Lens', position: [-1.4, 3.0, 5.4], target: [-0.2, 2.4, 0.2] },
      { id: 'VIEW_B', label: 'Vault Drawers', position: [3.2, 3.1, 5.8], target: [2.8, 2.2, 0.1] },
      { id: 'VIEW_C', label: 'Side Angle', position: [-4.6, 3.6, 7.6], target: [0.8, 2.2, 0.2] },
    ],
  },

  'step-3': {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-3',
    sceneKind: 'lsass-step3-minidump',
    stageBadge: 'STEP #3 · INSTANT X-RAY NEGATIVE',
    mitreId: 'T1003.001',
    title: 'Printing the Instant X-Ray Negative Onto the Corridor Packing Table',
    storyCue:
      'In one blazing crimson X-ray flash across the open safe-deposit drawers, the certified camera prints an instant cross-section negative onto the corridor packing table and slips it quietly into an unlabeled kraft courier envelope.',
    technicalCue:
      'dbgcore.dll!MiniDumpWriteDump (MiniDumpWithFullMemory 0x2) writes 48.2 MB C:\\Windows\\Temp\\debug.dmp starting with 4D 44 4D 50 93 A7 ("MDMP").',
    storyMappings: [
      {
        storyTerm: 'Crimson X-Ray Exposure Flash',
        technicalTerm: 'dbgcore.dll!MiniDumpWriteDump Reading LogonSessionList RAM',
        tone: 'rose',
      },
      {
        storyTerm: 'Instant X-Ray Photo Negative',
        technicalTerm: '48.2 MB MDMP File (4D 44 4D 50 93 A7) -> C:\\Windows\\Temp\\debug.dmp',
        tone: 'amber',
      },
      {
        storyTerm: 'Unlabeled Kraft Courier Sleeve',
        technicalTerm: 'Renamed / Staged Dump Artifact (e.g. .txt/.png Still Carrying MDMP)',
        tone: 'sky',
      },
      {
        storyTerm: 'Packing Table Receipt',
        technicalTerm: 'Sysmon Event ID 11 (FileCreate) by rundll32.exe (PID 5412)',
        tone: 'emerald',
      },
    ],
    accentHex: '#F43F5E',
    secondaryHex: '#D97706',
    durationSec: 15,
    callouts: [
      {
        id: 'lsass-s3-neg',
        tag: 'MDMP ARTIFACT',
        title: 'Instant X-Ray Negative',
        subtitle: 'C:\\Windows\\Temp\\debug.dmp (48.2 MB)',
        tone: 'rose',
      },
      {
        id: 'lsass-s3-vault',
        tag: 'FULL SNAPSHOT',
        title: 'Scanned Passkey Boxes',
        subtitle: 'lsasrv.dll + msv1_0.dll + kerberos.dll',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. X-Ray Flash',
        stageTag: 'STEP 03 · READ RAM',
        title: 'Camera Flash Captures Full Vault Cross-Section',
        storyExcerpt:
          'The overhead crimson flash lamp fires, photographing every golden passkey drawer in one instant exposure.',
        technicalParallel:
          'MiniDumpWriteDump iterates lsass.exe virtual memory pages (lsasrv.dll!LogonSessionList & msv1_0.dll).',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 4.5,
      },
      {
        id: 2,
        shortLabel: '2. Negative Print',
        stageTag: 'STEP 03 · MDMP',
        title: 'Instant Negative Slides Out Onto Corridor Table',
        storyExcerpt:
          'A crisp white-bordered X-ray negative glides out the back of the camera onto the wooden packing tray.',
        technicalParallel:
          'Sysmon EID 11 logs rundll32.exe creating 48.2 MB debug.dmp with MDMP header 4D 44 4D 50 93 A7.',
        accentHex: '#F59E0B',
        startSec: 4.5,
        endSec: 9.8,
      },
      {
        id: 3,
        shortLabel: '3. Courier Sleeve',
        stageTag: 'STEP 03 · STAGING',
        title: 'Negative Slips Into Unlabeled Envelope for Exit',
        storyExcerpt:
          'The photo slips neatly into a plain brown envelope so it can leave the bank without raising eyebrows at the lobby.',
        technicalParallel:
          'Attackers rename or compress debug.dmp for off-host exfiltration while YARA magic-byte scans still catch MDMP.',
        accentHex: '#38BDF8',
        startSec: 9.8,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.4, 13.2], target: [0.3, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Polaroid Tray', position: [-3.2, 3.3, 4.8], target: [-1.2, 1.9, 0.25] },
      { id: 'VIEW_B', label: 'Flash Head', position: [0.4, 3.4, 5.2], target: [0.3, 2.5, 0.25] },
      { id: 'VIEW_C', label: 'Vault Interior', position: [3.6, 3.2, 5.6], target: [3.4, 2.2, 0.2] },
    ],
  },

  'step-4': {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'step-4',
    sceneKind: 'lsass-step4-sysmon10',
    stageBadge: 'STEP #4 · GLASS SECURITY GUARD BOOTH',
    mitreId: 'T1003.001',
    title: 'Glass Guard Booth Exposes the Rigged Camera Path & Locks Down the Hall',
    storyCue:
      'Although the insider plans to develop the X-ray negative quietly in an off-site darkroom, the elevated glass security guard booth has already captured every detail on its overhead monitor—beaming a violet spotlight straight onto the photographer’s camera path.',
    technicalCue:
      'SIEM correlates Sysmon EID 1 (ordinal #24), EID 10 (0x1010 + comsvcs.dll|dbgcore.dll CallTrace), and EID 11 (MDMP) before offline pypykatz abuse, followed by RunAsPPL + Credential Guard hardening.',
    storyMappings: [
      {
        storyTerm: 'Elevated Glass Security Booth',
        technicalTerm: 'Sysmon Kernel Driver (Event ID 10) & SIEM Correlation Console',
        tone: 'emerald',
      },
      {
        storyTerm: 'Violet Spotlight Locking Onto Cart',
        technicalTerm: 'CallTrace Stack Proof (ntdll -> KERNELBASE -> comsvcs.dll -> dbgcore.dll)',
        tone: 'sky',
      },
      {
        storyTerm: 'Off-Site Darkroom Development Risk',
        technicalTerm: 'Offline pypykatz / Mimikatz Parsing of debug.dmp for NTLM & Kerberos TGTs',
        tone: 'rose',
      },
      {
        storyTerm: 'Emergency Steel Vault Blast Shield',
        technicalTerm: 'LSA Protection (RunAsPPL = 1) + Windows Defender Credential Guard',
        tone: 'amber',
      },
    ],
    accentHex: '#7C3AED',
    secondaryHex: '#10B981',
    durationSec: 15,
    callouts: [
      {
        id: 'lsass-s4-booth',
        tag: 'KERNEL WITNESS',
        title: 'Glass Guard Booth',
        subtitle: 'Sysmon EID 10 · 0x1010 + CallTrace',
        tone: 'emerald',
      },
      {
        id: 'lsass-s4-cart',
        tag: 'CAUGHT RED-HANDED',
        title: 'Exposed X-Ray Cart',
        subtitle: 'comsvcs.dll + dbgcore.dll Stack Trace',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Booth Alert',
        stageTag: 'STEP 04 · EID 10',
        title: 'Guard Booth Beacon Flashes on Unauthorized Vault Scan',
        storyExcerpt:
          'High on the steel gantry, the glass security booth’s violet beacon flashes as its console flags the wide-open lens reading.',
        technicalParallel:
          'Sysmon Event ID 10 fires immediately on GrantedAccess 0x1010 against lsass.exe even when ordinal #24 hides "MiniDump".',
        accentHex: '#7C3AED',
        startSec: 0,
        endSec: 4.8,
      },
      {
        id: 2,
        shortLabel: '2. Trace Lock',
        stageTag: 'STEP 04 · CALLTRACE',
        title: 'Violet Spotlight Pins Exact Camera Mechanism Trail',
        storyExcerpt:
          'A crisp violet inspection beam shoots straight from the guard booth roof onto the photographer’s camera housing.',
        technicalParallel:
          'CallTrace explicitly links rundll32.exe -> comsvcs.dll -> dbgcore.dll, separating malicious dumps from routine AV scans.',
        accentHex: '#A855F7',
        startSec: 4.8,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. Isolate & Shield',
        stageTag: 'STEP 04 · CONTAIN',
        title: 'SOC Isolates Hall & Activates Permanent Vault Blast Shield',
        storyExcerpt:
          'Guards lock down the compromised workstation, revoke exposed keys, and bolt steel X-ray shields across every vault.',
        technicalParallel:
          'Containment isolates WKS-ADM-07, resets compromised credentials, and enforces RunAsPPL = 1 + ASR LSASS blocking.',
        accentHex: '#10B981',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.6, 13.4], target: [0.0, 2.6, 0.0] },
      { id: 'VIEW_A', label: 'Booth Screen', position: [2.0, 3.4, 4.6], target: [1.85, 2.9, -0.3] },
      { id: 'VIEW_B', label: 'Trace Beam', position: [-0.2, 4.6, 7.2], target: [-0.2, 2.5, 0.0] },
      { id: 'VIEW_C', label: 'Caught Cart', position: [-4.4, 3.1, 5.2], target: [-2.2, 2.0, 0.45] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    sectionKey: 'memory-forensics',
    sceneKind: 'lsass-memory-ppldiff',
    stageBadge: 'MEMORY FORENSICS · UNPROTECTED VS. RUNASPPL VAULT',
    mitreId: 'T1003.001',
    title: 'Unprotected LSASS Process Handle (0x1010) vs. RunAsPPL Kernel-Blocked Access',
    storyCue:
      'Place an unshielded safe-deposit vault directly beside a hardened bank vault fitted with a glowing cyan blast shield. A sweeping golden inspection beam shows why the crimson X-ray ray cuts cleanly through the left vault’s golden drawers while bouncing harmlessly off the armored shield on the right.',
    technicalCue:
      'Comparing lsass.exe with PPL disabled (OpenProcess 0x1010 reads 0x00007FF7A8100000 LogonSessionList -> MDMP) against RunAsPPL (PsProtectedSignerLsa-Light) + Credential Guard returning STATUS_ACCESS_DENIED.',
    storyMappings: [
      {
        storyTerm: 'Unshielded Left Vault & Crimson X-Ray',
        technicalTerm: 'Unprotected lsass.exe (PPL=0) -> OpenProcess(0x1010) Reads LogonSessionList',
        tone: 'rose',
      },
      {
        storyTerm: 'Glowing Cyan Blast Shield (Right Vault)',
        technicalTerm: 'LSA Protection (RunAsPPL = 1 · PsProtectedSignerLsa-Light)',
        tone: 'sky',
      },
      {
        storyTerm: 'Rebounded X-Ray Access Rejection',
        technicalTerm: 'Kernel ObRegisterCallbacks Returns STATUS_ACCESS_DENIED to rundll32.exe',
        tone: 'emerald',
      },
      {
        storyTerm: 'Sweeping Golden Audit Beam',
        technicalTerm: 'EDR & Volatility Memory Audit Verifying PPL Signer & Credential Guard VBS',
        tone: 'amber',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'lsass-mem-open',
        tag: 'EXPOSED HANDLE (0x1010)',
        title: 'Unshielded Safe-Deposit Vault',
        subtitle: 'PPL=0 · LogonSessionList Readable',
        tone: 'rose',
      },
      {
        id: 'lsass-mem-ppl',
        tag: 'KERNEL PROTECTED',
        title: 'Blast-Shielded Vault',
        subtitle: 'RunAsPPL=1 · STATUS_ACCESS_DENIED',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Unshielded RAM',
        stageTag: 'X-RAY · PPL=0',
        title: 'Unprotected Vault Allows Full X-Ray Penetration',
        storyExcerpt:
          'On the left plinth, the crimson X-ray cone cuts straight into the unshielded vault and illuminates every golden box.',
        technicalParallel:
          'Without RunAsPPL, High-integrity rundll32.exe opens lsass.exe with 0x1010 and reads 0x00007FF7A8100000.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 5,
      },
      {
        id: 2,
        shortLabel: '2. Audit Sweep',
        stageTag: 'X-RAY · DIFF',
        title: 'Golden Comparison Beam Sweeps Both Vaults',
        storyExcerpt:
          'The golden audit bar sweeps from left to right, contrasting exposed drawers against the glowing cyan barrier.',
        technicalParallel:
          'Memory & registry audits check HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL and Event ID 12 (WinInit).',
        accentHex: '#FACC15',
        startSec: 5,
        endSec: 10,
      },
      {
        id: 3,
        shortLabel: '3. PPL Blocked',
        stageTag: 'X-RAY · HARDENED',
        title: 'Cyan Blast Shield Stops Camera Cold at the Door',
        storyExcerpt:
          'On the right plinth, the armored cyan blast shield blocks any X-ray lens—even an official bank photographer—from peeking inside.',
        technicalParallel:
          'PsProtectedSignerLsa-Light blocks non-PPL user-mode processes with STATUS_ACCESS_DENIED, while Credential Guard isolates secrets in VBS.',
        accentHex: '#38BDF8',
        startSec: 10,
        endSec: 15,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 15.2], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Unshielded', position: [-5.2, 3.6, 7.6], target: [-3.15, 2.2, 0.2] },
      { id: 'VIEW_B', label: 'PPL Shield', position: [5.2, 3.6, 7.6], target: [3.25, 2.2, 0.2] },
      { id: 'VIEW_C', label: 'Top Audit', position: [0.0, 8.2, 7.4], target: [0.0, 2.1, 0.2] },
    ],
  },
};
