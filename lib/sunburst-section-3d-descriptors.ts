import type {
  Section3DDescriptor,
  Section3DKey,
} from './section-3d-registry';

const SCENARIO_ID = 'solarwinds-sunburst-orion-supply-chain';

export const SUNBURST_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: SCENARIO_ID,
    sectionKey: 'briefing',
    sceneKind: 'sunburst-foundry-briefing',
    stageBadge: 'BRIEFING #0 · AUTOMATED FOUNDRY & ROYAL MINT DIORAMA',
    mitreId: 'T1195.002',
    title: 'Royal Foundry Wax-Seal Press - SUNSPOT Build Hijack & SUNBURST',
    storyCue:
      'An invisible foundry ghost swaps one brass engraving plate right as the automated blueprint press runs, letting the royal mint stamp its genuine golden wax seal over eighteen thousand crates that sleep quietly for two weeks before whispering encoded radio callsigns home.',
    technicalCue:
      'SUNSPOT MsBuild InventoryManager.cs Swap -> Genuine SolarWinds Authenticode Signing -> 14d Sleep & avsvmcloud[.]com DGA DNS -> TEARDROP & Golden SAML.',
    storyMappings: [
      {
        storyTerm: 'Automated Blueprint Conveyor',
        technicalTerm: 'SolarWinds CI/CD Build Server Running MsBuild.exe',
        tone: 'sky',
      },
      {
        storyTerm: 'Invisible Foundry Ghost',
        technicalTerm: 'SUNSPOT Build Implant (taskhostsvc.exe Swapping InventoryManager.cs)',
        tone: 'rose',
      },
      {
        storyTerm: 'Royal Mint Golden Wax-Seal Press',
        technicalTerm: 'Genuine SolarWinds Worldwide LLC Authenticode Code Signing',
        tone: 'amber',
      },
      {
        storyTerm: 'Fourteen-Day Quiet Holding Crate',
        technicalTerm: 'SUNBURST 12-14 Day Dormancy & FNV-1a Security Tool Blocklist',
        tone: 'sky',
      },
      {
        storyTerm: 'Whispered Rooftop Radio Callsigns',
        technicalTerm: 'Custom Base32 DGA DNS Beacons to *.avsvmcloud[.]com',
        tone: 'rose',
      },
      {
        storyTerm: 'Emerald Verification Caliper',
        technicalTerm: 'Hermetic Reproducible Builds (SLSA) & AD FS SAML Reconciliation',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'foundry-press',
        tag: 'TRUSTED SIGNING',
        title: 'Royal Mint Wax-Seal Press',
        subtitle: 'Valid SolarWinds Authenticode',
        tone: 'amber',
      },
      {
        id: 'radio-spire',
        tag: 'COVERT BEACON',
        title: 'Whispering Radio Spire',
        subtitle: 'DGA DNS · avsvmcloud[.]com',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Ghost Swap',
        stageTag: 'ACT 1 · SUNSPOT',
        title: 'Foundry Ghost Swaps One Blueprint Plate Mid-Press',
        storyExcerpt:
          'A translucent crimson ghost slips a rigged brass engraving plate onto the moving press and puts the clean plate right back.',
        technicalParallel:
          'SUNSPOT detects MsBuild.exe and transiently replaces InventoryManager.cs for 4.2 seconds.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 4.2,
      },
      {
        id: 2,
        shortLabel: '2. Wax Seal',
        stageTag: 'ACT 2 · SIGNING',
        title: 'Royal Press Stamps an Authentic Golden Crest Over the Backdoor',
        storyExcerpt:
          'The towering golden mint press seals the tampered crate with the genuine royal crest so every city gatekeeper trusts it.',
        technicalParallel:
          'Release automation signs trojanized SolarWinds.Orion.Core.BusinessLayer.dll with valid Authenticode.',
        accentHex: '#F59E0B',
        startSec: 4.2,
        endSec: 8.8,
      },
      {
        id: 3,
        shortLabel: '3. Quiet Beacon',
        stageTag: 'ACT 3 · DGA',
        title: 'After Two Weeks of Silence, Encoded Radio Callsigns Begin',
        storyExcerpt:
          'The frosted timer shutter opens inside the customer hall as the crate sends whispered scrambled letters from the roof.',
        technicalParallel:
          'SUNBURST sleeps 12-14 days then sends Base32 victim-domain DNS queries to *.avsvmcloud.com.',
        accentHex: '#38BDF8',
        startSec: 8.8,
        endSec: 13.8,
      },
      {
        id: 4,
        shortLabel: '4. Forged Pass',
        stageTag: 'ACT 4 · SAML',
        title: 'Stolen Signet Stamp Forges Offline Federation Passes',
        storyExcerpt:
          'Selected targets trigger a crimson pass stamp that opens cloud reading rooms without signing the front-gate ledger.',
        technicalParallel:
          'TEARDROP deploys Beacon to steal the AD FS token-signing key and mint offline Golden SAML tokens.',
        accentHex: '#F43F5E',
        startSec: 13.8,
        endSec: 17.0,
      },
      {
        id: 5,
        shortLabel: '5. Build Lock',
        stageTag: 'ACT 5 · SLSA',
        title: 'Emerald Caliper & Sinkhole Halt the Rogue Supply Line',
        storyExcerpt:
          'Foundry engineers clamp an emerald verification caliper over the press and silence the rogue dispatch spire.',
        technicalParallel:
          'Hermetic reproducible builds, DNS RPZ sinkholing, and AD FS EID 1200 correlation break the campaign.',
        accentHex: '#10B981',
        startSec: 17.0,
        endSec: 20.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 7.2, 16.0], target: [0, 2.0, 0] },
      { id: 'VIEW_A', label: 'Blueprint Belt', position: [-6.6, 4.4, 9.4], target: [-4.8, 1.8, 0] },
      { id: 'VIEW_B', label: 'Mint Press', position: [0.4, 4.5, 8.8], target: [0, 2.1, 0] },
      { id: 'VIEW_C', label: 'Radio Spire', position: [6.8, 4.8, 9.6], target: [4.8, 2.0, 0] },
    ],
  },
  'step-1': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-1',
    sceneKind: 'sunburst-step1-sunspot',
    stageBadge: 'STEP #1 · SUNSPOT TRANSIENT BUILD SWAP',
    mitreId: 'T1195.002',
    title: 'Foundry Ghost Swaps Blueprint Plate Mid-Compilation',
    storyCue:
      'As the steel conveyor feeds a clean brass blueprint plate into the compiler rollers, a translucent foundry ghost swaps in a rigged plate and restores the untouched original seconds later.',
    technicalCue:
      'SUNSPOT (taskhostsvc.exe) watches MsBuild.exe every 1s -> replaces InventoryManager.cs -> restores clean file in 4.2s with zero Git diff.',
    storyMappings: [
      {
        storyTerm: 'Steel Conveyor Rollers',
        technicalTerm: 'MsBuild.exe Automated .NET Compilation Pipeline',
        tone: 'sky',
      },
      {
        storyTerm: 'Translucent Foundry Ghost',
        technicalTerm: 'SUNSPOT Build-Server Service (taskhostsvc.exe PID 3912)',
        tone: 'rose',
      },
      {
        storyTerm: 'Rigged Brass Engraving Plate',
        technicalTerm: 'Trojanized InventoryManager.cs Injecting OrionImprovementBusinessLayer',
        tone: 'amber',
      },
      {
        storyTerm: 'Untouched Rack Original',
        technicalTerm: 'Clean Source File Restored Immediately Post-Compile (Zero Git Diff)',
        tone: 'emerald',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'step1-ghost',
        tag: 'BUILD HIJACK',
        title: 'Foundry Ghost Arm',
        subtitle: 'SUNSPOT · 4.2s Source Swap',
        tone: 'rose',
      },
      {
        id: 'step1-press',
        tag: 'COMPILER ROLLER',
        title: 'Blueprint Press Housing',
        subtitle: 'MsBuild.exe · Orion Core',
        tone: 'sky',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Belt Starts',
        stageTag: 'PHASE 1 · WATCH',
        title: 'Ghost Detects the Foundry Press Spinning Up',
        storyExcerpt:
          'The clean brass blueprint plate glides down the conveyor toward the automated foundry rollers.',
        technicalParallel:
          'SUNSPOT spots MsBuild.exe compiling the Orion Core solution on BLD-ORION-02.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Plate Swapped',
        stageTag: 'PHASE 2 · INJECT',
        title: 'Rigged Plate Slips Under the Rollers Mid-Press',
        storyExcerpt:
          'For four brief seconds, the ghost lifts the clean plate away and feeds the crimson-etched copy into the press.',
        technicalParallel:
          'SUNSPOT writes trojanized InventoryManager.cs containing OrionImprovementBusinessLayer.Initialize().',
        accentHex: '#E11D48',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Clean Restore',
        stageTag: 'PHASE 3 · COVERUP',
        title: 'Original Plate Returns With Zero Trace on the Rack',
        storyExcerpt:
          'The ghost sets the spotless original plate right back onto the rack so human craftsmen see zero scratches.',
        technicalParallel:
          'Clean source is restored after MsBuild finishes; only Sysmon Event ID 11 catches the transient write.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Source Rack', position: [-5.2, 3.8, 7.6], target: [-3.2, 1.7, 0] },
      { id: 'VIEW_B', label: 'Swap Arm', position: [0.4, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Output Belt', position: [5.2, 3.8, 7.6], target: [3.2, 1.7, 0] },
    ],
  },
  'step-2': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-2',
    sceneKind: 'sunburst-step2-sign',
    stageBadge: 'STEP #2 · AUTHENTICODE SIGNING & TRUSTED LOAD',
    mitreId: 'T1553.002',
    title: 'Royal Wax-Seal Press Stamps Genuine Trust Over Hidden Backdoor',
    storyCue:
      'The towering golden royal mint press drops smoothly onto the tampered shipping crate, sealing the hidden interior chamber beneath an authentic gold crest that passes every city checkpoint.',
    technicalCue:
      'SolarWinds Worldwide LLC Authenticode Certificate -> Signed SolarWinds.Orion.Core.BusinessLayer.dll -> Loaded as SYSTEM by BusinessLayerHost.',
    storyMappings: [
      {
        storyTerm: 'Golden Wax-Seal Ram',
        technicalTerm: 'Automated SolarWinds Worldwide LLC Authenticode Signing Pipeline',
        tone: 'amber',
      },
      {
        storyTerm: 'Hidden Crimson Interior',
        technicalTerm: 'Embedded OrionImprovementBusinessLayer MSIL Backdoor Class',
        tone: 'rose',
      },
      {
        storyTerm: 'City Gate Checkpoint',
        technicalTerm: 'Enterprise Certificate-Allowlisted Security Sensors (Sysmon EID 7)',
        tone: 'sky',
      },
      {
        storyTerm: 'Eighteen Thousand Shipments',
        technicalTerm: 'Official Orion Hotfix Distribution via Vendor Update CDN',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      {
        id: 'step2-press',
        tag: 'GENUINE SEAL',
        title: 'Royal Wax-Seal Ram',
        subtitle: 'Valid Authenticode Cert',
        tone: 'amber',
      },
      {
        id: 'step2-crate',
        tag: 'SIGNED PAYLOAD',
        title: 'Tampered Shipping Crate',
        subtitle: 'BusinessLayer.dll · SYSTEM',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Ram Drops',
        stageTag: 'PHASE 1 · STAMP',
        title: 'Golden Mint Press Seals the Tampered Crate',
        storyExcerpt:
          'The heavy golden wax-seal ram descends squarely onto the shipping crate lid without inspecting inside.',
        technicalParallel:
          'Release signing applies a valid SolarWinds Worldwide LLC certificate to BusinessLayer.dll.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Cutaway Glow',
        stageTag: 'PHASE 2 · HIDDEN',
        title: 'Cutaway Wall Reveals the Crimson Chamber Beneath Gold Wax',
        storyExcerpt:
          'Sliding the crate shell open exposes the glowing crimson mechanism resting silently beneath the authentic crest.',
        technicalParallel:
          'YARA MSIL inspection exposes OrionImprovementBusinessLayer despite SignatureStatus=Valid.',
        accentHex: '#E11D48',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Gate Cleared',
        stageTag: 'PHASE 3 · DEPLOY',
        title: 'Checkpoint Waves the Sealed Crate Straight Into Core Halls',
        storyExcerpt:
          'Trusting the royal gold emblem outside, the checkpoint barrier rises and welcomes the crate straight inside.',
        technicalParallel:
          'SolarWinds.BusinessLayerHost.exe (PID 4120) loads the signed DLL as NT AUTHORITY\\SYSTEM.',
        accentHex: '#38BDF8',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.9, 0] },
      { id: 'VIEW_A', label: 'Seal Ram', position: [-4.6, 4.4, 7.6], target: [0, 2.5, 0] },
      { id: 'VIEW_B', label: 'Crate Core', position: [0.2, 3.6, 6.8], target: [0, 1.5, 0] },
      { id: 'VIEW_C', label: 'Gate Arch', position: [5.4, 3.8, 7.6], target: [3.6, 1.8, 0] },
    ],
  },
  'step-3': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-3',
    sceneKind: 'sunburst-step3-dga',
    stageBadge: 'STEP #3 · 14-DAY DORMANCY & DGA DNS BEACON',
    mitreId: 'T1568.002',
    title: 'Two-Week Timer Unlocks Whispered Encoded Radio Callsigns',
    storyCue:
      'Inside the customer hall, a fourteen-day brass sand-timer finishes ticking, lifting the frosted shutter so a rooftop radio spire whispers scrambled callsigns and awaits a selective green-light reply.',
    technicalCue:
      '12-14d Sleep + FNV-1a Blocklist -> Custom Base32 DGA DNS (*.avsvmcloud[.]com, Sysmon EID 22) -> Selective CNAME Activation.',
    storyMappings: [
      {
        storyTerm: 'Fourteen-Day Brass Timer',
        technicalTerm: 'SUNBURST 12-14 Day Randomized Dormancy Timer',
        tone: 'amber',
      },
      {
        storyTerm: 'Watchman Checklist Dial',
        technicalTerm: 'FNV-1a Hashed Security-Tool & Analyst Blocklist Check',
        tone: 'sky',
      },
      {
        storyTerm: 'Scrambled Rooftop Pulses',
        technicalTerm: 'Base32-Encoded Victim Domain Queries to *.avsvmcloud.com',
        tone: 'rose',
      },
      {
        storyTerm: 'Selective Return Beam',
        technicalTerm: 'DNS CNAME Activation Record Directing Priority Targets to C2',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step3-timer',
        tag: 'EVASION SLEEP',
        title: 'Fourteen-Day Sand Timer',
        subtitle: '12-14d Delay · FNV-1a Gate',
        tone: 'amber',
      },
      {
        id: 'step3-spire',
        tag: 'DGA CHANNEL',
        title: 'Rooftop Dispatch Spire',
        subtitle: 'Sysmon EID 22 · avsvmcloud',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Sleep Ends',
        stageTag: 'PHASE 1 · DORMANT',
        title: 'Fourteen-Day Timer Completes Behind Frosted Glass',
        storyExcerpt:
          'After two silent weeks on the hall floor, the brass timer ring locks into place and lifts the shutter.',
        technicalParallel:
          'SUNBURST passes its 12-14 day sleep check and verifies zero FNV-1a blocklisted security tools.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. DGA Pulse',
        stageTag: 'PHASE 2 · BEACON',
        title: 'Spire Whispers Encoded Home Address Upward',
        storyExcerpt:
          'Expanding sky-blue and crimson rings carry the scrambled hall address skyward to the distant relay.',
        technicalParallel:
          'BusinessLayerHost.exe issues Sysmon EID 22 DNS query to *.appsync-api.*.avsvmcloud.com.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. CNAME Cue',
        stageTag: 'PHASE 3 · TRIAGE',
        title: 'High-Value Target Receives a Selective Activation Beam',
        storyExcerpt:
          'A sharp crimson answer beam drops back onto the spire, signaling this treasury was chosen for hands-on entry.',
        technicalParallel:
          'Attacker authoritative DNS replies with a CNAME pointing to a bespoke stage-2 C2 server.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.6, 13.0], target: [0, 2.0, 0] },
      { id: 'VIEW_A', label: 'Brass Timer', position: [-5.2, 3.8, 7.6], target: [-3.2, 1.8, 0] },
      { id: 'VIEW_B', label: 'Radio Spire', position: [0.4, 4.4, 7.8], target: [0.2, 2.2, 0] },
      { id: 'VIEW_C', label: 'Relay Dish', position: [5.4, 4.2, 7.8], target: [3.6, 2.2, 0] },
    ],
  },
  'step-4': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-4',
    sceneKind: 'sunburst-step4-goldensaml',
    stageBadge: 'STEP #4 · TEARDROP & AD FS GOLDEN SAML FORGERY',
    mitreId: 'T1552.004',
    title: 'Stolen Signet Stamp Forges Offline Passes Caught by Ledger Gap',
    storyCue:
      'An operator copies the treasury chief brass signet stamp, presses offline cloud passes from an outside desk, and is exposed when security compares cloud entry tickets against the empty front-gate ledger.',
    technicalCue:
      'TEARDROP Memory Loader -> AD FS Token-Signing Private Key Theft -> Offline Golden SAML Assertion -> Caught by Missing AD FS Event ID 1200.',
    storyMappings: [
      {
        storyTerm: 'Copied Chief Signet Stamp',
        technicalTerm: 'Exported AD FS Token-Signing Certificate Private Key',
        tone: 'amber',
      },
      {
        storyTerm: 'Outside Forgery Press',
        technicalTerm: 'Offline Golden SAML Assertion Minting (Bypasses MFA)',
        tone: 'rose',
      },
      {
        storyTerm: 'Cloud Reading Room Gate',
        technicalTerm: 'Microsoft Entra ID / Exchange Online Federated Sign-In',
        tone: 'sky',
      },
      {
        storyTerm: 'Empty Front-Gate Ledger',
        technicalTerm: 'Missing On-Premises AD FS Event ID 1200 Reconciliation Alert',
        tone: 'emerald',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step4-stamp',
        tag: 'GOLDEN SAML',
        title: 'Copied Signet Press',
        subtitle: 'Stolen AD FS Signing Key',
        tone: 'rose',
      },
      {
        id: 'step4-ledger',
        tag: 'BLUE-TEAM CATCH',
        title: 'Ledger Gap Detector',
        subtitle: 'Missing AD FS EID 1200',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Stamp Taken',
        stageTag: 'PHASE 1 · KEY THEFT',
        title: 'Memory Loader Extracts the Federation Signet Key',
        storyExcerpt:
          'A golden signet stamp lifts cleanly out of the local federation cabinet toward the outside workbench.',
        technicalParallel:
          'TEARDROP launches Beacon to export the AD FS token-signing certificate private key from ADFS-01.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Pass Forged',
        stageTag: 'PHASE 2 · FORGE',
        title: 'Forged Pass Flies Straight Into the Cloud Gate',
        storyExcerpt:
          'A freshly stamped crimson federation pass glides directly into the cloud reading room, bypassing the front desk.',
        technicalParallel:
          'Offline-signed SAML assertion authenticates to Entra ID / Exchange Online without MFA prompt.',
        accentHex: '#E11D48',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Gap Caught',
        stageTag: 'PHASE 3 · RECONCILE',
        title: 'Security Spots a Cloud Ticket With No Front-Gate Stub',
        storyExcerpt:
          'The emerald auditor lights up when the cloud guest ticket matches zero stubs in the local gatehouse ledger.',
        technicalParallel:
          'KQL left-anti join flags Entra ID SAML SigninLogs missing a matching AD FS Event ID 1200.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Signet Vault', position: [-5.2, 3.8, 7.6], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Forged Pass', position: [0.2, 4.0, 7.2], target: [0, 1.9, 0] },
      { id: 'VIEW_C', label: 'Audit Desk', position: [5.4, 3.8, 7.6], target: [3.4, 1.8, 0] },
    ],
  },
  'memory-forensics': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'memory-forensics',
    sceneKind: 'sunburst-memory-ildiff',
    stageBadge: 'MEMORY FORENSICS · CLEAN ORION MSIL VS SUNBURST HOOK',
    mitreId: 'T1195.002',
    title: 'Side-by-Side Plate Diff: Clean BusinessLayer vs SUNSPOT Hook',
    storyCue:
      'Two royal-sealed brass plates rest side by side under an emerald verification caliper: both carry the exact same golden wax crest outside, yet the scanning beam exposes one hidden crimson gear etched straight into the right-hand plate.',
    technicalCue:
      'Left: Clean SolarWinds.Orion.Core.BusinessLayer.dll (0x7FF8D4100000) -> Right: Trojanized MSIL calling OrionImprovementBusinessLayer.Initialize().',
    storyMappings: [
      {
        storyTerm: 'Clean Left Brass Plate',
        technicalTerm: 'Baseline SolarWinds.Orion.Core.BusinessLayer.dll MSIL (960 KB)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Matching Golden Wax Crests',
        technicalTerm: 'Identical Valid SolarWinds Worldwide LLC Authenticode Signature',
        tone: 'amber',
      },
      {
        storyTerm: 'Emerald Verification Caliper',
        technicalTerm: 'Reproducible-Build Hash & YARA MSIL Bytecode Diff Sweep',
        tone: 'sky',
      },
      {
        storyTerm: 'Hidden Crimson Gear',
        technicalTerm: 'Injected OrionImprovementBusinessLayer.Initialize() Hook (1,024 KB)',
        tone: 'rose',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'mem-clean-il',
        tag: 'BASELINE MSIL',
        title: 'Clean Brass Plate',
        subtitle: '960 KB · No Backdoor Hook',
        tone: 'emerald',
      },
      {
        id: 'mem-sunb-il',
        tag: 'TROJANIZED MSIL',
        title: 'Rigged Signed Plate',
        subtitle: 'OrionImprovementBusinessLayer',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Clean Plate',
        stageTag: 'DIFF · BASELINE',
        title: 'Left Plate Shows Clean Orion Polling Code',
        storyExcerpt:
          'Under the spotlight, the left brass plate holds only smooth standard clockwork grooves with zero extra teeth.',
        technicalParallel:
          'Clean BusinessLayer.dll (0x7FF8D4100000) executes RefreshInternal() with zero background threads.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Caliper Sweep',
        stageTag: 'DIFF · COMPARE',
        title: 'Verification Caliper Sweeps Across Both Royal-Sealed Plates',
        storyExcerpt:
          'A bright cyan inspection gantry glides from left to right, checking every engraved tooth beneath matching gold wax seals.',
        technicalParallel:
          'Reproducible build diff + YARA scans inspect MSIL streams rather than trusting Authenticode alone.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Hook Exposed',
        stageTag: 'DIFF · BACKDOOR',
        title: 'Crimson Gear Exposes the Injected Backdoor Thread',
        storyExcerpt:
          'On the right plate, one extra crimson gear flares brightly, proving the foundry press was tampered with before sealing.',
        technicalParallel:
          'Trojanized 1,024 KB DLL (0x7FF8D4220000) spawns OrionImprovementBusinessLayer.Initialize() in RAM.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.8, 13.8], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Clean Plate', position: [-5.6, 3.8, 8.0], target: [-3.4, 1.7, 0] },
      { id: 'VIEW_B', label: 'Rigged Plate', position: [5.6, 3.8, 8.0], target: [3.4, 1.7, 0] },
      { id: 'VIEW_C', label: 'Caliper Top', position: [0, 8.2, 8.2], target: [0, 1.9, 0] },
    ],
  },
};
