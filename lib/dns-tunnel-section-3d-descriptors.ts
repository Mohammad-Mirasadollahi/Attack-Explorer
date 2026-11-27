import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #048 (`dns-tunneling-exfil`).
 * Universe: Coastal Lighthouse Signal Tower, Walled Harbor Dispatch Desk, Postmaster Relay & Emerald Sinkhole Net.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const DNS_TUNNEL_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: 'briefing',
    sceneKind: 'dnstun-lighthouse-briefing',
    stageBadge: 'BRIEFING #0 · COASTAL LIGHTHOUSE HARBOR DIORAMA',
    mitreId: 'T1071.004',
    title: 'Walled Harbor Desk, Postmaster Pigeon Relay & Emerald Sinkhole Net',
    storyCue:
      'Inside a walled coastal fortress where all ocean ship departures are barred by a stone seawall, a compromised clerk slices private harbor records into tiny scrambled paper slips and ties them onto carrier pigeons routed through the central postmaster to an offshore lighthouse—until the coastguard watchtower spots the impossibly gibberish scroll patterns and drops an emerald harbor net over the rogue island.',
    technicalCue:
      'RFC 1035 63-octet subdomain chunking -> Sysmon EID 22 attribution -> Recursive DNS-INT-01 -> Authoritative NS TXT beacon -> Zeek Shannon entropy > 4.2 -> RPZ sinkhole.',
    storyMappings: [
      { storyTerm: 'Walled Harbor Desk & Scrambled Slips', technicalTerm: 'Segmented WKSTN-FIN-14 Packing Data Into RFC 1035 Subdomains', tone: 'amber' },
      { storyTerm: 'Blue Overhead Skylight Lens', technicalTerm: 'Microsoft Sysmon Event ID 22 Attributing Queries to PID 6248', tone: 'sky' },
      { storyTerm: 'Central Postmaster Relay Tower', technicalTerm: 'Internal Recursive Resolver (DNS-INT-01) Forwarding Uncached Lookups', tone: 'sky' },
      { storyTerm: 'Offshore Brass-Lantern Lighthouse', technicalTerm: 'External Authoritative NS Returning TTL=0 TXT/CNAME Replies', tone: 'rose' },
      { storyTerm: 'Crimson Watchtower Gibberish Alarm', technicalTerm: 'Zeek Passive DNS Flagging Shannon Entropy 4.41 & 99.6% Cache Misses', tone: 'rose' },
      { storyTerm: 'Emerald Harbor Sinkhole Net', technicalTerm: 'DNS Response Policy Zone (RPZ) Sinkhole + Outbound Port 53/853 Deny', tone: 'emerald' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      { id: 'dt-desk', tag: 'HARBOR DESK', title: 'Scrambled Slip Desk', subtitle: 'WKSTN-FIN-14 · Sysmon EID 22', tone: 'amber' },
      { id: 'dt-light', tag: 'OFFSHORE RELAY', title: 'Lighthouse & Harbor Net', subtitle: 'Authoritative NS TXT -> RPZ Sinkhole', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Slice Slips', stageTag: 'ACT 01 · CHUNK', title: 'Compromised Clerk Slices Private Ledger Into Tiny Scrambled Slips', storyExcerpt: 'Three glowing crimson strips lift from the timber harbor desk, cut small enough to fit pigeon leg pouches.', technicalParallel: 'telemetry_sync.exe (PID 6248) encodes staged files into 56-char hex labels under RFC 1035 bounds.', accentHex: '#F59E0B', startSec: 0, endSec: 4.2 },
      { id: 2, shortLabel: '2. Desk Lens', stageTag: 'ACT 02 · SYSMON 22', title: 'Skylight Inspection Lens Identifies Which Indoor Desk Launches Birds', storyExcerpt: 'The cutaway glass hood opens over the desk as the blue skylight lens logs the exact sender.', technicalParallel: 'Sysmon Event ID 22 records QueryName alongside originating binary path and Process ID 6248.', accentHex: '#38BDF8', startSec: 4.2, endSec: 8.8 },
      { id: 3, shortLabel: '3. Lighthouse', stageTag: 'ACT 03 · RELAY', title: 'Carrier Pigeon Arcs Over Seawall to Offshore Lighthouse Lantern', storyExcerpt: 'A sky-blue pigeon flies past the postmaster tower over the seawall while the brass lantern flashes back.', technicalParallel: 'Internal DNS-INT-01 forwards uncached queries to ns1.cdn-metrics-sync.example returning TTL=0 TXT records.', accentHex: '#E11D48', startSec: 8.8, endSec: 13.8 },
      { id: 4, shortLabel: '4. Entropy Alert', stageTag: 'ACT 04 · ZEEK', title: 'Coastguard Watchtower Beacon Turns Crimson on Gibberish Flood', storyExcerpt: 'Hundreds of random nonsense address inquiries per minute trip the crimson coastguard beacon.', technicalParallel: 'Zeek dns.log flags Shannon entropy 4.41 bits/byte, 412 unique subdomains/min, and 4-day domain age.', accentHex: '#F43F5E', startSec: 13.8, endSec: 17.0 },
      { id: 5, shortLabel: '5. Harbor Net', stageTag: 'ACT 05 · RPZ', title: 'Emerald Sinkhole Net Envelops Offshore Lighthouse Permanently', storyExcerpt: 'Coastguard engineers drop a glowing emerald net over the rogue island and calm the watchtower.', technicalParallel: 'RPZ sinkholes *.cdn-metrics-sync.example to 10.255.255.53 and firewall denies direct UDP/TCP 53/853.', accentHex: '#10B981', startSec: 17.0, endSec: 20.0 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 16.4], target: [0.1, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Harbor Desk', position: [-5.2, 3.2, 6.8], target: [-5.0, 1.7, 0.25] },
      { id: 'VIEW_B', label: 'Postmaster', position: [-0.2, 3.6, 6.8], target: [-0.2, 2.3, 0.25] },
      { id: 'VIEW_C', label: 'Lighthouse', position: [5.0, 3.8, 7.2], target: [4.8, 2.5, 0.25] },
    ],
  },

  'step-1': {
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: 'step-1',
    sceneKind: 'dnstun-step1-chunk',
    stageBadge: 'STEP #1 · INDOOR DESK & SKYLIGHT LENS',
    mitreId: 'T1071.004',
    title: 'Slicing Harbor Records Into Tiny Pigeon Slips Under the Blue Skylight Lens',
    storyCue:
      'Blocked from sending cargo ships out of the walled harbor, a rogue desk slices private sheets into equal-length scrambled strips small enough for pigeon pouches—while an overhead blue skylight lens logs exactly which desk dispatched every strip.',
    technicalCue:
      'IETF RFC 1035 limits each subdomain label to 63 octets; Sysmon Event ID 22 links high-entropy QueryName lookups directly to telemetry_sync.exe (PID 6248).',
    storyMappings: [
      { storyTerm: 'Three Equal Scrambled Strips', technicalTerm: '56-Char Hex/Base32 Chunks Packed Within RFC 1035 63-Octet Limit', tone: 'rose' },
      { storyTerm: 'Timber Indoor Dispatch Desk', technicalTerm: 'Segmented Finance Host WKSTN-FIN-14 (No Direct HTTP Egress)', tone: 'amber' },
      { storyTerm: 'Blue Overhead Skylight Lens', technicalTerm: 'Sysmon Event ID 22 Mapping Every Query to Exact Binary & PID', tone: 'sky' },
      { storyTerm: 'Zero Repeat Street Names', technicalTerm: 'Unique Per-Chunk Sequence Labels Causing 99.6% Cache Misses', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'dt-s1-desk', tag: 'RFC 1035 CHUNKS', title: 'Harbor Slicing Desk', subtitle: '56-Char Encoded Subdomain Slips', tone: 'amber' },
      { id: 'dt-s1-lens', tag: 'HOST ATTRIBUTION', title: 'Blue Skylight Lens', subtitle: 'Sysmon EID 22 -> PID 6248', tone: 'sky' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Cut Strips', stageTag: 'STEP 01 · RFC 1035', title: 'Private Ledger Sliced to Fit Tiny Pigeon Leg Capsules', storyExcerpt: 'Three crimson strips float above the timber desk, each trimmed to strict capsule size.', technicalParallel: 'telemetry_sync.exe encodes 28-byte data chunks into 56-character hexadecimal labels.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Open Hood', stageTag: 'STEP 01 · SYSMON 22', title: 'Cutaway Hood Exposes Hidden Indoor Clerk Desk', storyExcerpt: 'The transparent cover lifts so harbor inspectors can see precisely which workstation is dispatching.', technicalParallel: 'Sysmon Event ID 22 logs Image=C:\\ProgramData\\SyncCache\\telemetry_sync.exe (PID 6248).', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Attribute', stageTag: 'STEP 01 · DFIR', title: 'Endpoint Lens Closes the Network-Only Blind Spot', storyExcerpt: 'Instead of guessing among fifty desks inside the building, investigators pinpoint the exact clerk.', technicalParallel: 'Joining Sysmon EID 22 with resolver logs links the apex domain directly to the rogue binary.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.3, 12.6], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Desk Slips', position: [-2.8, 2.6, 5.4], target: [0.0, 1.9, 0.25] },
      { id: 'VIEW_B', label: 'Skylight Lens', position: [2.8, 3.2, 5.6], target: [0.0, 2.8, 0.25] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 6.8, 5.8], target: [0.0, 1.8, 0.25] },
    ],
  },

  'step-2': {
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: 'step-2',
    sceneKind: 'dnstun-step2-sysmon22',
    stageBadge: 'STEP #2 · POSTMASTER TO LIGHTHOUSE RELAY',
    mitreId: 'T1048.003',
    title: 'Carrier Pigeons Arc Over the Stone Seawall to the Offshore Brass Lighthouse',
    storyCue:
      'Even though a solid stone seawall blocks direct ships, carrier pigeons fly freely through the central harbor postmaster tower straight across the water to the offshore lighthouse, which flashes coded lantern replies back.',
    technicalCue:
      'Internal recursive resolver DNS-INT-01 forwards unique uncached queries across the perimeter to ns1.cdn-metrics-sync.example, receiving TTL=0 TXT replies.',
    storyMappings: [
      { storyTerm: 'Central Harbor Postmaster Tower', technicalTerm: 'Enterprise Recursive Resolver (DNS-INT-01) Permitted Outbound Port 53', tone: 'sky' },
      { storyTerm: 'Solid Stone Seawall Barrier', technicalTerm: 'Perimeter Firewall Blocking Direct Workstation HTTP/HTTPS Egress', tone: 'amber' },
      { storyTerm: 'Arcing Carrier Pigeon & Red Pouch', technicalTerm: 'Uncached Outbound Subdomain Query Carrying Encoded Data Chunks', tone: 'rose' },
      { storyTerm: 'Flashing Brass Lighthouse Lantern', technicalTerm: 'Authoritative NS Returning TTL=0 TXT/CNAME Encoded Tasking', tone: 'amber' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'dt-s2-post', tag: 'INTERNAL RELAY', title: 'Harbor Postmaster Tower', subtitle: 'DNS-INT-01 Uncached Forwarding', tone: 'sky' },
      { id: 'dt-s2-light', tag: 'OFFSHORE BEACON', title: 'Brass Lighthouse Lantern', subtitle: 'Rogue NS · TTL=0 TXT Replies', tone: 'amber' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Bypass Wall', stageTag: 'STEP 02 · RECURSION', title: 'Pigeons Clear the Seawall via Permitted Harbor Postal Service', storyExcerpt: 'Because every scrambled inquiry is brand-new, the postmaster cannot answer from memory and relays it offshore.', technicalParallel: 'Unique leftmost labels defeat resolver caching, forcing DNS-INT-01 to query 198.51.100.77:53.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Flash Back', stageTag: 'STEP 02 · TXT REPLY', title: 'Offshore Brass Lantern Flashes Coded Instructions Back Inside', storyExcerpt: 'The lighthouse reads the crimson leg scroll and blinks coded lantern replies back across the waves.', technicalParallel: 'Rogue NS returns TTL=0.0 TXT records containing sequence acknowledgements and base64 tasking.', accentHex: '#F59E0B', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Monitor Hub', stageTag: 'STEP 02 · EGRESS', title: 'Internal Postmaster Must Be Audited Like a Perimeter Gate', storyExcerpt: 'Watchtower guards realize the trusted postmaster tower is an active outbound bridge requiring inspection.', technicalParallel: 'Logging recursive-to-authoritative Zeek dns.log traffic exposes bidirectional OilRig-style tunnels.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.2, 4.5, 13.6], target: [0.3, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Postmaster', position: [-3.4, 3.0, 5.8], target: [-2.5, 2.2, 0.2] },
      { id: 'VIEW_B', label: 'Lighthouse', position: [4.2, 3.4, 6.0], target: [3.2, 2.7, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.2, 7.6, 6.4], target: [0.2, 2.1, 0.2] },
    ],
  },

  'step-3': {
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: 'step-3',
    sceneKind: 'dnstun-step3-txtbeacon',
    stageBadge: 'STEP #3 · WATCHTOWER RANDOMNESS GAUGE',
    mitreId: 'T1071.004',
    title: 'Calm Ordinary Harbor Names vs. Towering Crimson Gibberish Columns',
    storyCue:
      'Beside the central watchtower, calm low emerald columns represent normal readable harbor addresses, while towering pulsing crimson columns expose hundreds of gibberish scrolls streaming toward a brand-new offshore island.',
    technicalCue:
      'Zeek passive DNS scores Shannon entropy (4.41 vs ~3.0), 412 unique subdomains/min, 99.6% cache misses, 78% TXT ratio, and 4-day Newly Observed Domain age.',
    storyMappings: [
      { storyTerm: 'Low Calm Emerald Columns', technicalTerm: 'Normal Enterprise Hostnames (~2.7–3.2 Shannon Entropy, High Cache Hit)', tone: 'emerald' },
      { storyTerm: 'Towering Pulsing Crimson Columns', technicalTerm: 'Covert Tunnel Subdomains (4.41 Entropy · 56-Char Labels · 99.6% Misses)', tone: 'rose' },
      { storyTerm: 'Crimson Watchtower Beacon Lamp', technicalTerm: 'SIEM-ENTROPY-408 Correlating Zeek dns.log + Sysmon EID 22', tone: 'amber' },
      { storyTerm: 'Four-Day-Old Offshore Island', technicalTerm: 'Newly Observed Domain (NOD) With Zero Prior Business History', tone: 'sky' },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#10B981',
    durationSec: 15,
    callouts: [
      { id: 'dt-s3-calm', tag: 'BASELINE TRAFFIC', title: 'Calm Readable Names', subtitle: 'Entropy ~3.0 · Cached Normal Lookups', tone: 'emerald' },
      { id: 'dt-s3-spike', tag: 'TUNNEL ANOMALY', title: 'Crimson Gibberish Spike', subtitle: 'Entropy 4.41 · 412 Unique/Min · NOD', tone: 'rose' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Baseline', stageTag: 'STEP 03 · NORMAL', title: 'Ordinary Harbor Inquiries Stay Low, Readable, and Repeated', storyExcerpt: 'On the left, calm green gauges reflect human-readable harbor addresses answered quickly from memory.', technicalParallel: 'Normal corporate domains exhibit ~2.7–3.2 bits/byte Shannon entropy and strong resolver caching.', accentHex: '#10B981', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Gibberish', stageTag: 'STEP 03 · ENTROPY', title: 'Encoded Smuggling Slips Drive Randomness Gauges Sky-High', storyExcerpt: 'On the right, towering crimson columns surge as hundreds of unique gibberish slips pour out.', technicalParallel: 'Zeek flags 4.41 bits/byte Shannon entropy, 56-char labels, and 78% TXT query proportion.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Pinpoint', stageTag: 'STEP 03 · SIEM', title: 'Combining Randomness, Volume & Island Age Eliminates False Alarms', storyExcerpt: 'The crimson watchtower beacon locks onto the four-day-old island with zero guesswork.', technicalParallel: 'Correlating NOD age (< 30 days) + entropy + Sysmon EID 22 confirms active exfiltration (~184 KB).', accentHex: '#F59E0B', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.5, 13.6], target: [0.0, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Calm Baseline', position: [-4.4, 2.8, 6.2], target: [-3.8, 1.5, 0.35] },
      { id: 'VIEW_B', label: 'Crimson Spike', position: [4.4, 3.2, 6.2], target: [3.8, 2.1, 0.35] },
      { id: 'VIEW_C', label: 'Watchtower', position: [0.0, 4.8, 6.4], target: [0.0, 3.2, 0.25] },
    ],
  },

  'step-4': {
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: 'step-4',
    sceneKind: 'dnstun-step4-rpz',
    stageBadge: 'STEP #4 · EMERALD HARBOR NET & SEAWALL LOCK',
    mitreId: 'T1071.004',
    title: 'Dropping the Emerald Sinkhole Net & Sealing Direct Seawall Bypass Lanes',
    storyCue:
      'Coastguard defenders lower an emerald harbor net straight over the rogue offshore lighthouse to capture every rogue inquiry inside the guardhouse, while raising an emerald shield along the seawall so no pigeon can bypass the central postmaster.',
    technicalCue:
      'Deploy RPZ sinkhole rule (*.cdn-metrics-sync.example -> 10.255.255.53), deny direct workstation UDP/TCP 53, TCP/853 DoT & public DoH, and isolate WKSTN-FIN-14.',
    storyMappings: [
      { storyTerm: 'Emerald Harbor Sinkhole Net', technicalTerm: 'DNS Response Policy Zone (RPZ) Redirecting Rogue Domain to 10.255.255.53', tone: 'emerald' },
      { storyTerm: 'Tall Emerald Seawall Barrier', technicalTerm: 'Perimeter Firewall Blocking Direct Workstation UDP/53, TCP/53 & DoT/DoH', tone: 'sky' },
      { storyTerm: 'Dimmed Offshore Brass Lantern', technicalTerm: 'Severed Exfiltration & TXT Command Channel Within Milliseconds', tone: 'amber' },
      { storyTerm: 'Quarantined Indoor Clerk Desk', technicalTerm: 'Endpoint Isolation of WKSTN-FIN-14 & Volatile Memory Preservation', tone: 'emerald' },
    ],
    accentHex: '#10B981',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'dt-s4-fw', tag: 'EGRESS LOCK', title: 'Emerald Seawall Shield', subtitle: 'Deny Direct UDP/53, TCP/53 & DoT/DoH', tone: 'sky' },
      { id: 'dt-s4-net', tag: 'RPZ SINKHOLE', title: 'Emerald Harbor Net', subtitle: 'Redirect *.cdn-metrics-sync -> 10.255.255.53', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Drop Net', stageTag: 'STEP 04 · RPZ', title: 'Emerald Sinkhole Net Envelops Rogue Offshore Lighthouse', storyExcerpt: 'The glowing emerald net lowers over the island, dimming its brass signal lantern immediately.', technicalParallel: 'RPZ policy on DNS-INT-01/02 sinkholes *.cdn-metrics-sync.example to 10.255.255.53.', accentHex: '#10B981', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Seal Wall', stageTag: 'STEP 04 · EGRESS', title: 'Seawall Shield Forces Every Pigeon Through Inspected Postmaster', storyExcerpt: 'No indoor clerk can bypass the central watchtower by launching birds directly over the seawall.', technicalParallel: 'Workstation VLAN firewalls deny direct outbound UDP/53, TCP/53, TCP/853, and public DoH endpoints.', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Isolate', stageTag: 'STEP 04 · IR', title: 'Quarantine Workstation & Reconstruct Stolen Ledger Scope', storyExcerpt: 'Harbor investigators secure the compromised desk and audit which ledger pages were sliced.', technicalParallel: 'Isolate WKSTN-FIN-14, quarantine telemetry_sync.exe (PID 6248), and decode Zeek dns.log scope.', accentHex: '#F59E0B', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.1, 4.6, 13.6], target: [0.2, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Seawall Shield', position: [-1.8, 3.0, 5.8], target: [0.0, 2.0, 0.2] },
      { id: 'VIEW_B', label: 'Sinkhole Net', position: [3.8, 3.4, 6.0], target: [2.8, 2.6, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.2, 7.6, 6.6], target: [0.2, 2.0, 0.2] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: 'memory-forensics',
    sceneKind: 'dnstun-memory-entropydiff',
    stageBadge: 'MEMORY FORENSICS · STAGING BUFFER VS. SINKHOLE STATE',
    mitreId: 'T1071.004',
    title: 'In-Memory Scrambled Staging Buffer vs. Hardened RPZ Sinkhole State',
    storyCue:
      'Set the active indoor slicing desk beside the emerald-netted offshore lighthouse. A sky-blue forensic scan beam sweeps between both stations, contrasting live scrambled slip buffers on the left against the sealed harbor net on the right.',
    technicalCue:
      'Comparing active 56-char hex staging buffer (0x1D840100000) & zero-TTL Dnscache churn (0x1D840180000) against hardened RPZ sinkhole enforcement (0x1D840220000).',
    storyMappings: [
      { storyTerm: 'Left Slicing Desk & Floating Slips', technicalTerm: '0x000001D840100000 · In-Memory 56-Char Hex Chunk Staging Buffer', tone: 'rose' },
      { storyTerm: 'Zero-Memory Postal Churn', technicalTerm: '0x000001D840180000 · Dnscache Table With 99.6% Misses & TTL=0 TXT', tone: 'amber' },
      { storyTerm: 'Sky-Blue Forensic Scan Beam', technicalTerm: 'Volatile Memory Dump + Zeek dns.log Reconstruction of Exfil Scope', tone: 'sky' },
      { storyTerm: 'Right Emerald-Netted Lighthouse', technicalTerm: '0x000001D840220000 · RPZ Sinkhole 10.255.255.53 & Port 53/853 Lock', tone: 'emerald' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'dt-mem-buf', tag: 'STAGING BUFFER', title: 'Active Slip Buffer', subtitle: '0x1D840100000 · Hex Labels + TTL=0', tone: 'rose' },
      { id: 'dt-mem-rpz', tag: 'RPZ ENFORCED', title: 'Emerald Netted Island', subtitle: '0x1D840220000 · Sinkhole 10.255.255.53', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Staging', stageTag: 'DIFF · BUFFER', title: 'Left Desk Holds Live Scrambled Strips Ready for Pigeon Launch', storyExcerpt: 'Crimson strips pulse over the open desk hood before dispatching into the postal stream.', technicalParallel: '0x000001D840100000 stages 56-char hex labels and feeds Dnscache zero-TTL TXT lookups.', accentHex: '#E11D48', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Sweep', stageTag: 'DIFF · AUDIT', title: 'Sky-Blue Beam Compares Volatile Memory Against Resolver Logs', storyExcerpt: 'The cyan inspection beam sweeps across both sides to measure exactly how many slips escaped.', technicalParallel: 'Memory forensics + Zeek dns.log sequence numbers quantify the 184 KB exfiltrated scope.', accentHex: '#38BDF8', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Sealed', stageTag: 'DIFF · RPZ', title: 'Right Emerald Net Terminates Both Outbound Slips & Lantern Replies', storyExcerpt: 'Under the rotating emerald net, the offshore lantern stays dark and every inquiry drops safely.', technicalParallel: '0x000001D840220000 enforces RPZ sinkholing paired with default-deny direct port 53/853 egress.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 15.2], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Slip Buffer', position: [-5.2, 3.6, 7.6], target: [-3.4, 1.9, 0.2] },
      { id: 'VIEW_B', label: 'Sinkhole Net', position: [5.2, 3.6, 7.6], target: [3.4, 2.4, 0.2] },
      { id: 'VIEW_C', label: 'Top Audit', position: [0.0, 8.2, 7.4], target: [0.0, 2.0, 0.2] },
    ],
  },
};
