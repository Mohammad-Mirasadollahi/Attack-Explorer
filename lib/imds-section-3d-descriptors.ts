import type {
  Section3DDescriptor,
  Section3DKey,
} from './section-3d-registry';

const SCENARIO_ID = 'aws-imdsv1-ssrf-capitalone-style';

export const IMDS_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: SCENARIO_ID,
    sectionKey: 'briefing',
    sceneKind: 'imds-concierge-briefing',
    stageBadge: 'BRIEFING #0 · HOTEL CONCIERGE & VAULT DIORAMA',
    mitreId: 'T1552.005',
    title: 'Hotel Concierge Key-Card Vault - EC2 SSRF to IMDSv1 & S3 Drain',
    storyCue:
      'A street courier hands a forged room-service slip to a glass-lobby concierge, tricking the desk into dialing a private lobby key-card dispenser and carrying a fresh brass master pass straight up to the rooftop safe-deposit lockers until security desk radar drops an emerald challenge turnstile.',
    technicalCue:
      'Host: 169.254.169.254 Reverse-Proxy SSRF -> Unauthenticated IMDSv1 GET -> STS Credentials (ISRM-WAF-Role) -> Off-VPC aws s3 sync -> GuardDuty OutsideAWS + IMDSv2 HopLimit=1.',
    storyMappings: [
      {
        storyTerm: 'Glass Lobby Reception Concierge',
        technicalTerm: 'Public EC2 Reverse Proxy / WAF (nginx PID 2418 on ec2-waf-edge-01)',
        tone: 'sky',
      },
      {
        storyTerm: 'Forged Room-Service Slip',
        technicalTerm: 'Crafted HTTP Host: 169.254.169.254 SSRF Request Header',
        tone: 'rose',
      },
      {
        storyTerm: 'Private Lobby Brass Key-Card Dispenser',
        technicalTerm: 'Link-Local EC2 IMDSv1 Endpoint (169.254.169.254:80)',
        tone: 'amber',
      },
      {
        storyTerm: 'Fresh Brass Master Keycard Envelope',
        technicalTerm: 'Short-Lived AWS STS JSON Credentials (AccessKeyId + SessionToken)',
        tone: 'amber',
      },
      {
        storyTerm: 'Rooftop Safe-Deposit Locker Gallery',
        technicalTerm: 'Private Amazon S3 Bucket (corp-credit-applications-prod)',
        tone: 'rose',
      },
      {
        storyTerm: 'Emerald Two-Step Challenge Turnstile',
        technicalTerm: 'IMDSv2 PUT Session Token (HttpTokens=required, HopLimit=1)',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'imds-kiosk',
        tag: 'LINK-LOCAL DISPENSER',
        title: 'Lobby Brass Key-Card Kiosk',
        subtitle: 'IMDSv1 · 169.254.169.254:80',
        tone: 'amber',
      },
      {
        id: 's3-vault',
        tag: 'CLOUD STORAGE',
        title: 'Rooftop Safe-Deposit Gallery',
        subtitle: 'S3 Bucket · Off-VPC aws s3 sync',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Forged Slip',
        stageTag: 'ACT 1 · SSRF',
        title: 'Street Courier Redirects the Front-Desk Concierge',
        storyExcerpt:
          'A crimson room-service slip slides across the reception desk, coaxing the clerk into dialing the private lobby key-card dispenser.',
        technicalParallel:
          'nginx dynamically routes Host: 169.254.169.254 to /latest/meta-data/iam/security-credentials/.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4.2,
      },
      {
        id: 2,
        shortLabel: '2. Brass Pass',
        stageTag: 'ACT 2 · IMDSv1',
        title: 'Lobby Kiosk Prints an Unchallenged Master Keycard',
        storyExcerpt:
          'Without asking for a signed challenge pass, the brass dispenser ejects a glowing master keycard envelope straight back to the glass counter.',
        technicalParallel:
          'Unauthenticated IMDSv1 GET returns 6-hour STS JSON credentials for ISRM-WAF-Role.',
        accentHex: '#F59E0B',
        startSec: 4.2,
        endSec: 8.8,
      },
      {
        id: 3,
        shortLabel: '3. Vault Drain',
        stageTag: 'ACT 3 · S3 SYNC',
        title: 'Cloned Master Pass Empties Rooftop Lockers',
        storyExcerpt:
          'Carrying the cloned brass pass off the sidewalk, the courier unlocks rows of rooftop archive drawers and hoists crates off-property.',
        technicalParallel:
          'External host 198.51.100.88 executes aws s3 sync against corp-credit-applications-prod.',
        accentHex: '#E11D48',
        startSec: 8.8,
        endSec: 13.8,
      },
      {
        id: 4,
        shortLabel: '4. Street Alarm',
        stageTag: 'ACT 4 · GUARDDUTY',
        title: 'Security Radar Flags an Off-Property Keycard Swipe',
        storyExcerpt:
          'The security desk beacon flashes crimson when a lobby-assigned badge unlocks rooftop drawers from an outside street address.',
        technicalParallel:
          'GuardDuty fires InstanceCredentialExfiltration.OutsideAWS on CloudTrail S3 GetObject.',
        accentHex: '#F43F5E',
        startSec: 13.8,
        endSec: 17.0,
      },
      {
        id: 5,
        shortLabel: '5. Turnstile Lock',
        stageTag: 'ACT 5 · IMDSv2',
        title: 'Emerald Two-Step Turnstile Seals the Lobby Kiosk',
        storyExcerpt:
          'Hotel engineers bolt an emerald two-step turnstile over the brass dispenser, slamming shut every simple front-desk relay.',
        technicalParallel:
          'EC2 enforces HttpTokens=required and HttpPutResponseHopLimit=1 while revoking active STS sessions.',
        accentHex: '#10B981',
        startSec: 17.0,
        endSec: 20.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 7.2, 16.0], target: [0, 2.0, 0] },
      { id: 'VIEW_A', label: 'Concierge Desk', position: [-6.6, 4.4, 9.6], target: [-4.6, 1.8, 0] },
      { id: 'VIEW_B', label: 'Brass Kiosk', position: [0.6, 4.2, 8.8], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Rooftop Vault', position: [6.8, 4.6, 9.6], target: [4.8, 1.9, 0] },
    ],
  },
  'step-1': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-1',
    sceneKind: 'imds-step1-ssrf',
    stageBadge: 'STEP #1 · REVERSE-PROXY HOST-HEADER SSRF',
    mitreId: 'T1190',
    title: 'Front-Desk Concierge Redirected to Internal Brass Kiosk',
    storyCue:
      'A crimson slip addressed to the private lobby kiosk glides across the marble reception counter, making the concierge dial the internal brass intercom and read back the house cabinet label.',
    technicalCue:
      'GET /latest/meta-data/iam/security-credentials/ with Host: 169.254.169.254 -> nginx proxy_pass SSRF -> 200 OK ISRM-WAF-Role.',
    storyMappings: [
      {
        storyTerm: 'Crimson Address Slip',
        technicalTerm: 'Forged HTTP Host: 169.254.169.254 Header',
        tone: 'rose',
      },
      {
        storyTerm: 'Marble Reception Counter',
        technicalTerm: 'Public EC2 Nginx Reverse Proxy (PID 2418)',
        tone: 'sky',
      },
      {
        storyTerm: 'Private Intercom Tube',
        technicalTerm: 'Guest-Local 169.254.169.254:80 Loopback Route',
        tone: 'amber',
      },
      {
        storyTerm: 'Read-Back Cabinet Label',
        technicalTerm: 'HTTP 200 Body Exposing Role Name ISRM-WAF-Role',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step1-desk',
        tag: 'PROXY PIVOT',
        title: 'Reception Routing Desk',
        subtitle: 'nginx proxy_pass $http_host',
        tone: 'sky',
      },
      {
        id: 'step1-label',
        tag: 'ROLE ENUMERATION',
        title: 'Cabinet Name Slip',
        subtitle: '200 OK · ISRM-WAF-Role',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Slip Arrives',
        stageTag: 'PHASE 1 · INGRESS',
        title: 'Forged Room-Service Slip Hits the Front Desk',
        storyExcerpt:
          'An external courier slides a bright crimson routing slip under the reception glass window.',
        technicalParallel:
          '198.51.100.88 sends GET /latest/meta-data/iam/security-credentials/ with Host: 169.254.169.254.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Internal Dial',
        stageTag: 'PHASE 2 · PIVOT',
        title: 'Concierge Dials the Private Lobby Intercom',
        storyExcerpt:
          'Instead of rejecting the internal hotel number, the front-desk switchboard rings the private lobby kiosk.',
        technicalParallel:
          'nginx opens a local TCP socket to link-local 169.254.169.254:80 inside ec2-waf-edge-01.',
        accentHex: '#F59E0B',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Label Echo',
        stageTag: 'PHASE 3 · RESPONSE',
        title: 'Cabinet Label Echoes Back to the Street',
        storyExcerpt:
          'The brass intercom prints the exact master cabinet name and the clerk hands it straight back outside.',
        technicalParallel:
          'IMDSv1 replies HTTP 200 OK with ISRM-WAF-Role, giving the attacker the next path segment.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.7, 0] },
      { id: 'VIEW_A', label: 'Counter Slot', position: [-5.2, 3.6, 7.6], target: [-3.0, 1.6, 0] },
      { id: 'VIEW_B', label: 'Switchboard', position: [0.4, 3.8, 7.4], target: [0, 1.8, 0] },
      { id: 'VIEW_C', label: 'Intercom Echo', position: [5.4, 3.8, 7.6], target: [3.2, 1.7, 0] },
    ],
  },
  'step-2': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-2',
    sceneKind: 'imds-step2-creds',
    stageBadge: 'STEP #2 · UNAUTHENTICATED IMDSv1 STS HARVEST',
    mitreId: 'T1552.005',
    title: 'Lobby Brass Kiosk Dispenses an Unchallenged Master Keycard',
    storyCue:
      'A second front-desk call presses the brass dispenser lever for the named cabinet, ejecting a freshly stamped six-hour master keycard envelope with zero lobby challenge check.',
    technicalCue:
      'GET /latest/meta-data/iam/security-credentials/ISRM-WAF-Role -> HTTP 200 JSON (AccessKeyId ASIA5LAB..., SecretAccessKey, SessionToken).',
    storyMappings: [
      {
        storyTerm: 'Unlatched Brass Lever',
        technicalTerm: 'IMDSv1 Stateless HTTP GET Handler (No Session Token)',
        tone: 'amber',
      },
      {
        storyTerm: 'Stamped Gold Keycard',
        technicalTerm: 'Temporary STS AccessKeyId + SecretAccessKey Pair',
        tone: 'rose',
      },
      {
        storyTerm: 'Six-Hour Wax Stamp',
        technicalTerm: 'AWS STS SessionToken Valid for 6 Hours',
        tone: 'amber',
      },
      {
        storyTerm: 'Silent Lobby Chute',
        technicalTerm: 'Zero CloudTrail API Events Logged on Local IMDS Read',
        tone: 'sky',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step2-kiosk',
        tag: 'NO CHALLENGE',
        title: 'Open Brass Dispenser',
        subtitle: 'IMDSv1 GET · Zero Token Check',
        tone: 'amber',
      },
      {
        id: 'step2-card',
        tag: 'TEMP CREDENTIALS',
        title: 'Golden Master Keycard',
        subtitle: 'STS AccessKeyId + Token',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Lever Pulled',
        stageTag: 'PHASE 1 · REQUEST',
        title: 'Second Relay Pulls the Named Cabinet Lever',
        storyExcerpt:
          'The reception tube delivers a second slip naming the exact master cabinet inside the brass kiosk.',
        technicalParallel:
          'Proxied GET hits /latest/meta-data/iam/security-credentials/ISRM-WAF-Role on 169.254.169.254.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Card Minted',
        stageTag: 'PHASE 2 · DISPENSE',
        title: 'Dispenser Stamps a Six-Hour Master Keycard',
        storyExcerpt:
          'Without asking for a signed challenge pass, the brass slot pops up a glowing gold keycard envelope.',
        technicalParallel:
          'IMDSv1 returns 1,342-byte JSON carrying ASIA5LABEXAMPLE9Q2W, SecretAccessKey, and Token.',
        accentHex: '#F59E0B',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Quiet Exit',
        stageTag: 'PHASE 3 · EXFIL',
        title: 'Keycard Slides Out Without Ringing the Main Ledger',
        storyExcerpt:
          'The master envelope glides out through the glass lobby slot while the central hotel register stays completely quiet.',
        technicalParallel:
          'No CloudTrail event fires for the IMDS read; only proxy access logs record the 1,342-byte response.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Brass Slot', position: [-4.8, 3.8, 7.2], target: [-1.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Keycard Tray', position: [0.4, 4.0, 6.8], target: [0, 2.0, 0] },
      { id: 'VIEW_C', label: 'Exit Chute', position: [5.2, 3.6, 7.6], target: [3.2, 1.7, 0] },
    ],
  },
  'step-3': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-3',
    sceneKind: 'imds-step3-s3sync',
    stageBadge: 'STEP #3 · OFF-VPC S3 BUCKET SYNC EXFILTRATION',
    mitreId: 'T1530',
    title: 'Stolen Master Keycard Empties Rooftop Safe-Deposit Lockers',
    storyCue:
      'Swiping the cloned lobby keycard from an outside sidewalk terminal, the courier unlocks entire rows of rooftop safe-deposit lockers and cranes sealed archive crates off-property.',
    technicalCue:
      'External IP 198.51.100.88 exports STS creds -> aws s3 ls / aws s3 sync s3://corp-credit-applications-prod -> CloudTrail GetObject.',
    storyMappings: [
      {
        storyTerm: 'Sidewalk Swipe Terminal',
        technicalTerm: 'External Attacker AWS CLI on 198.51.100.88 (Off-VPC)',
        tone: 'rose',
      },
      {
        storyTerm: 'Over-Broad Floor Badge',
        technicalTerm: 'ISRM-WAF-Role With Wildcard s3:ListAllMyBuckets & s3:GetObject',
        tone: 'amber',
      },
      {
        storyTerm: 'Rooftop Safe-Deposit Drawers',
        technicalTerm: 'Private S3 Objects (2025-q1-applicants.parquet)',
        tone: 'sky',
      },
      {
        storyTerm: 'Hoisted Crimson Crates',
        technicalTerm: 'Bulk TLS 1.3 Data Transfer via aws s3 sync',
        tone: 'rose',
      },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      {
        id: 'step3-swipe',
        tag: 'OFF-VPC REPLAY',
        title: 'Sidewalk Keycard Reader',
        subtitle: 'External IP 198.51.100.88',
        tone: 'amber',
      },
      {
        id: 'step3-crates',
        tag: 'DATA COLLECTION',
        title: 'Lifted Archive Crates',
        subtitle: 'aws s3 sync · GetObject',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Street Swipe',
        stageTag: 'PHASE 1 · AUTH',
        title: 'Stolen Keycard Swiped From Outside the Hotel',
        storyExcerpt:
          'Standing on the outside street, the courier inserts the cloned hotel keycard into the rooftop vault reader.',
        technicalParallel:
          '198.51.100.88 signs AWS SigV4 requests using ASIA5LABEXAMPLE9Q2W outside any corporate VPC.',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Drawers Open',
        stageTag: 'PHASE 2 · ENUM',
        title: 'Over-Privileged Badge Unlocks Every Vault Row',
        storyExcerpt:
          'Whole banks of rooftop safe-deposit drawers slide open because the lobby badge was never limited to one room.',
        technicalParallel:
          'CloudTrail records ListBuckets and ListObjectsV2 on s3://corp-credit-applications-prod.',
        accentHex: '#38BDF8',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Bulk Hoist',
        stageTag: 'PHASE 3 · EXFIL',
        title: 'Archive Crates Hoisted Off-Property',
        storyExcerpt:
          'Sealed crimson crates lift cleanly out of the open drawers and glide across the roof toward the street van.',
        technicalParallel:
          'aws s3 sync issues high-rate GetObject calls logged with external sourceIPAddress and no vpcEndpointId.',
        accentHex: '#E11D48',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.6, 13.0], target: [0, 1.9, 0] },
      { id: 'VIEW_A', label: 'Card Reader', position: [-5.4, 3.8, 7.4], target: [-3.4, 1.8, 0] },
      { id: 'VIEW_B', label: 'Vault Drawers', position: [0.4, 4.0, 7.6], target: [0.4, 1.9, 0] },
      { id: 'VIEW_C', label: 'Hoist Crane', position: [5.4, 4.8, 8.2], target: [3.2, 2.2, 0] },
    ],
  },
  'step-4': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'step-4',
    sceneKind: 'imds-step4-imdsv2',
    stageBadge: 'STEP #4 · GUARDDUTY ALERT & IMDSv2 HOP-LIMIT LOCK',
    mitreId: 'T1552.005',
    title: 'Security Radar Revokes the Keycard & Bolts an IMDSv2 Turnstile',
    storyCue:
      'Hotel security radar flags a lobby keycard unlocking vaults from the outside street, instantly canceling the active pass and locking an emerald two-step challenge turnstile over the brass kiosk.',
    technicalCue:
      'GuardDuty InstanceCredentialExfiltration.OutsideAWS -> Deny-All Session Revocation -> HttpTokens=required & HttpPutResponseHopLimit=1.',
    storyMappings: [
      {
        storyTerm: 'Perimeter Radar Dish',
        technicalTerm: 'AWS GuardDuty InstanceCredentialExfiltration.OutsideAWS',
        tone: 'rose',
      },
      {
        storyTerm: 'Voided Brass Keycard',
        technicalTerm: 'Inline IAM Deny-All-Prior-Sessions Revocation Policy',
        tone: 'amber',
      },
      {
        storyTerm: 'Emerald Two-Step Turnstile',
        technicalTerm: 'IMDSv2 PUT /latest/api/token Requirement (HttpTokens=required)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Single-Step Lobby Rope',
        technicalTerm: 'HttpPutResponseHopLimit=1 Dropping Multi-Hop Proxy Relays',
        tone: 'emerald',
      },
    ],
    accentHex: '#10B981',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      {
        id: 'step4-radar',
        tag: 'DETECTION',
        title: 'Off-Property Radar Dish',
        subtitle: 'GuardDuty OutsideAWS Alert',
        tone: 'rose',
      },
      {
        id: 'step4-gate',
        tag: 'HARDENING',
        title: 'Emerald Challenge Turnstile',
        subtitle: 'IMDSv2 · HopLimit=1 Lock',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Radar Catch',
        stageTag: 'PHASE 1 · ALERT',
        title: 'Security Radar Flags the Off-Property Swipe',
        storyExcerpt:
          'A crimson beacon spins above the security desk the instant a lobby-only pass is swiped from the street.',
        technicalParallel:
          'GuardDuty correlates assumed-role instance ID i-0a9f21c84d7e301b2 with external IP 198.51.100.88.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Pass Revoked',
        stageTag: 'PHASE 2 · CONTAIN',
        title: 'Active Keycards Voided & Turnstile Lowered',
        storyExcerpt:
          'Security cancels the stolen brass pass mid-swipe and lowers an emerald challenge gate over the lobby dispenser.',
        technicalParallel:
          'EventBridge attaches an IAM Deny policy and sets HttpTokens=required via EC2 API.',
        accentHex: '#F59E0B',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Single-Hop Seal',
        stageTag: 'PHASE 3 · LOCKED',
        title: 'Two-Step Token Gate Blocks Every Proxy Relay',
        storyExcerpt:
          'Simple slips from the reception window bounce cleanly off the emerald turnstile with zero badges issued.',
        technicalParallel:
          'IMDSv2 with HttpPutResponseHopLimit=1 returns HTTP 401 to proxied GET SSRF attempts.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.4, 12.6], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'Radar Tower', position: [-5.2, 4.0, 7.6], target: [-3.2, 2.0, 0] },
      { id: 'VIEW_B', label: 'Emerald Gate', position: [0.2, 3.8, 7.2], target: [0, 1.8, 0] },
      { id: 'VIEW_C', label: 'Shielded Desk', position: [5.4, 3.8, 7.6], target: [3.2, 1.7, 0] },
    ],
  },
  'memory-forensics': {
    scenarioId: SCENARIO_ID,
    sectionKey: 'memory-forensics',
    sceneKind: 'imds-memory-tokendiff',
    stageBadge: 'MEMORY FORENSICS · IMDSv1 PROXY BUFFER VS IMDSv2 GATE',
    mitreId: 'T1552.005',
    title: 'Side-by-Side Buffer Inspection: Open IMDSv1 vs Hardened IMDSv2',
    storyCue:
      'Two lobby dispensers stand side by side under a golden inspection gantry: the open left kiosk pours live brass keycards straight into a front-desk tray, while the emerald-gated right kiosk demands a signed two-step lobby challenge and rejects every relayed slip.',
    technicalCue:
      'Left: Vulnerable IMDSv1 GET response buffer leaking STS JSON -> Right: Hardened IMDSv2 PUT /latest/api/token + HopLimit=1 returning HTTP 401.',
    storyMappings: [
      {
        storyTerm: 'Open Left Brass Dispenser',
        technicalTerm: 'Vulnerable IMDSv1 Endpoint Serving Plain HTTP GET JSON',
        tone: 'rose',
      },
      {
        storyTerm: 'Overflowing Front-Desk Tray',
        technicalTerm: 'Nginx Proxy Buffer Holding AccessKeyId + SecretAccessKey + Token',
        tone: 'amber',
      },
      {
        storyTerm: 'Golden Inspection Gantry',
        technicalTerm: 'CloudTrail & Proxy Buffer Forensic Comparison Sweep',
        tone: 'sky',
      },
      {
        storyTerm: 'Emerald-Gated Right Dispenser',
        technicalTerm: 'Hardened IMDSv2 (HttpTokens=required, HopLimit=1 -> HTTP 401)',
        tone: 'emerald',
      },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#10B981',
    durationSec: 15,
    callouts: [
      {
        id: 'mem-imds1',
        tag: 'VULNERABLE BUFFER',
        title: 'Open Key-Card Tray',
        subtitle: 'IMDSv1 · STS JSON Exposed',
        tone: 'rose',
      },
      {
        id: 'mem-imds2',
        tag: 'HARDENED BOUNDARY',
        title: 'Two-Step Token Gate',
        subtitle: 'IMDSv2 · 401 Unauthorized',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Exposed Tray',
        stageTag: 'DIFF · IMDSv1',
        title: 'Left Tray Exposes Live Brass Keycards',
        storyExcerpt:
          'On the vulnerable left plinth, a single front-desk request fills the open tray with glowing master keycards.',
        technicalParallel:
          'Proxy upstream buffer at 0x7F8A10400000 holds plaintext AccessKeyId, SecretAccessKey, and Token.',
        accentHex: '#E11D48',
        startSec: 0,
        endSec: 5.1,
      },
      {
        id: 2,
        shortLabel: '2. Gantry Sweep',
        stageTag: 'DIFF · COMPARE',
        title: 'Golden Inspection Beam Compares Both Kiosks',
        storyExcerpt:
          'An overhead forensic beam sweeps from left to right, contrasting the unguarded lever against the two-step challenge lock.',
        technicalParallel:
          'Auditing MetadataNoToken metrics distinguishes legacy GET calls from token-authenticated PUT sessions.',
        accentHex: '#FACC15',
        startSec: 5.1,
        endSec: 10.2,
      },
      {
        id: 3,
        shortLabel: '3. Gate Proof',
        stageTag: 'DIFF · IMDSv2',
        title: 'Right Turnstile Proves Relayed Slips Fail Cleanly',
        storyExcerpt:
          'On the hardened right plinth, the emerald turnstile seals shut and drops every single-step slip before a card can print.',
        technicalParallel:
          'HttpTokens=required + HttpPutResponseHopLimit=1 forces HTTP 401 on any proxied SSRF attempt.',
        accentHex: '#10B981',
        startSec: 10.2,
        endSec: 15.0,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0, 5.8, 13.8], target: [0, 1.8, 0] },
      { id: 'VIEW_A', label: 'IMDSv1 Tray', position: [-5.6, 3.8, 8.0], target: [-3.4, 1.7, 0] },
      { id: 'VIEW_B', label: 'IMDSv2 Gate', position: [5.6, 3.8, 8.0], target: [3.4, 1.7, 0] },
      { id: 'VIEW_C', label: 'Gantry Top', position: [0, 8.2, 8.2], target: [0, 1.9, 0] },
    ],
  },
};
