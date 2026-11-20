import type { CategoryStandardPatchMap } from './types';

export const MOBILE_TELECOM_SPYWARE_PATCHES: CategoryStandardPatchMap = {
  'mobile-operation-triangulation-ios-shutdown-log-mvt-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a ghost burglar slipping into a locked smartphone apartment through an unread postcard slid under the front door without the homeowner ever tapping the screen. The burglar works strictly in the dark, burns every paper note in the hallway before leaving, and vanishes whenever the building power cycles; yet the elevator’s nightly closing log still records an unfamiliar worker lingering in the storage corridor and the utility meter permanently shows megabytes of unexplained water flowing out of an unused closet.',
      storyMappings: [
        {
          storyTerm: 'Unread Postcard Under Door',
          technicalTerm: 'Zero-Click iMessage Crafted Font/Image Attachment (CVE-2023-41990)',
          tone: 'rose',
        },
        {
          storyTerm: 'Ghost Burglar Burning Notes',
          technicalTerm: 'Ephemeral In-Memory Implant Deleting /private/var/tmp/ Artifacts',
          tone: 'amber',
        },
        {
          storyTerm: 'Elevator Nightly Closing Log',
          technicalTerm: 'iOS /private/var/db/diagnostics/Shutdown.log (Unclosed PID Record)',
          tone: 'sky',
        },
        {
          storyTerm: 'Utility Meter Closet Flow',
          technicalTerm: 'DataUsage.sqlite & netusage.sqlite ZPROCESS Cellular/Wi-Fi Counters',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before the homeowner even wakes the phone screen, the building’s automated mail sorter opens the rigged postcard in the basement mailroom, triggering an invisible print-shop jam that leaves behind a faint diagnostic receipt on the maintenance clipboard.',
        storyMappings: [
          {
            storyTerm: 'Automated Mail Sorter',
            technicalTerm: 'Apple Push (apsd), imagent & IMTranscoderAgent Background Parsers',
            tone: 'sky',
          },
          {
            storyTerm: 'Rigged Postcard',
            technicalTerm: 'Zero-Click Malicious Font/Image Attachment (CVE-2023-41990)',
            tone: 'rose',
          },
          {
            storyTerm: 'Invisible Print-Shop Jam',
            technicalTerm: 'Memory Fault Inside FontParser / CoreGraphics Rendering Engine',
            tone: 'amber',
          },
          {
            storyTerm: 'Maintenance Clipboard Receipt',
            technicalTerm: 'iOS CrashReporter .ips Plis & Unified Diagnostic Logs',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The ghost burglar runs quietly out of a temporary hallway locker and shreds their working files immediately afterward, forgetting that every time the building powers down, the master elevator log writes down the exact badge number and locker path of every worker still lingering at closing time.',
        storyMappings: [
          {
            storyTerm: 'Temporary Hallway Locker',
            technicalTerm: 'Ephemeral Implant Staged Under /private/var/tmp/',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding Working Files',
            technicalTerm: 'Self-Deleting In-Memory Payload Leaving Zero Disk Persistence',
            tone: 'rose',
          },
          {
            storyTerm: 'Master Elevator Closing Log',
            technicalTerm: '/private/var/db/diagnostics/Shutdown.log in sysdiagnose Archive',
            tone: 'sky',
          },
          {
            storyTerm: 'Lingering Worker Badge Record',
            technicalTerm: 'MVT Extracting Unclosed /private/var/tmp/ Process Path & PID',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even days after a reboot wipes the ghost burglar out of memory, the building’s permanent water-and-power billing books still display heavy outbound usage billed to a broom-closet service that should never transmit anything to the street.',
        storyMappings: [
          {
            storyTerm: 'Permanent Utility Billing Books',
            technicalTerm: '/private/var/wireless/Library/Databases/DataUsage.sqlite & netusage.sqlite',
            tone: 'sky',
          },
          {
            storyTerm: 'Broom-Closet Service Name',
            technicalTerm: 'ZPROCESS Table Entry for Non-Networked Daemon or Deleted PID',
            tone: 'amber',
          },
          {
            storyTerm: 'Heavy Outbound Flow',
            technicalTerm: 'Megabytes of Anomalous Wi-Fi & Cellular HTTPS Exfiltration Bytes',
            tone: 'rose',
          },
          {
            storyTerm: 'Forensic Billing Audit',
            technicalTerm: 'Amnesty MVT Correlation of ZPROCESS Counters Against Shutdown.log',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine an international postal bridge connecting rival national carriers so travelers can receive mail abroad. An intruder posing as a friendly foreign post office requests a private sealed mailbag lane across the bridge, stuffs unauthorized internal maintenance parcels inside those sealed bags to sail straight past the outer security checkpoints, and installs a rigged front-door lock and secret hallway chute inside the telecom headquarters.',
      storyMappings: [
        {
          storyTerm: 'International Postal Bridge',
          technicalTerm: 'Inter-Carrier GPRS Roaming Exchange (GRX / IPX Interconnect)',
          tone: 'sky',
        },
        {
          storyTerm: 'Requesting Sealed Mailbag Lane',
          technicalTerm: 'Rogue GTP-C Create PDP Context / Create Session (UDP/2123)',
          tone: 'amber',
        },
        {
          storyTerm: 'Stuffing Maintenance Parcels Inside',
          technicalTerm: 'Encapsulated GTP-U Inner IP Packets (UDP/2152) Reaching Core OAM',
          tone: 'rose',
        },
        {
          storyTerm: 'Rigged Lock & Secret Chute',
          technicalTerm: 'Backdoored PAM (/lib64/security/pam_unix_auth.so) & iptables PREROUTING',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing on the foreign end of the postal bridge, the intruder sends a counterfeit carrier dispatch slip asking the domestic sorting hub to open a brand-new sealed mailbag channel for a visiting subscriber.',
        storyMappings: [
          {
            storyTerm: 'Foreign End of Postal Bridge',
            technicalTerm: 'Unauthorized External GRX Roaming Peer Interface',
            tone: 'amber',
          },
          {
            storyTerm: 'Counterfeit Carrier Dispatch Slip',
            technicalTerm: 'GTPv1-C Create PDP Context (Type 16) / GTPv2-C Create Session (Type 32)',
            tone: 'rose',
          },
          {
            storyTerm: 'Domestic Sorting Hub',
            technicalTerm: 'Mobile Operator GGSN / PGW Listening on UDP Port 2123',
            tone: 'sky',
          },
          {
            storyTerm: 'Bridge Border Checkpoint',
            technicalTerm: 'GSMA FS.11 / FS.19 GTP Signaling Firewall Peer Validation',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once the sorting hub stamps a tracking tag onto the new sealed mailbag lane, the intruder packs private administrative commands inside the sealed pouches so outer gate guards only see harmless roaming luggage while the pouches drop straight onto the core management floor.',
        storyMappings: [
          {
            storyTerm: 'Stamped Mailbag Tracking Tag',
            technicalTerm: 'Established Tunnel Endpoint Identifier (TEID)',
            tone: 'amber',
          },
          {
            storyTerm: 'Sealed Roaming Pouches',
            technicalTerm: 'GTP-U User Plane Encapsulated Traffic on UDP Port 2152',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing Outer Gate Guards',
            technicalTerm: 'Inner IP Packets Routing Past Perimeter ACLs to Internal OAM',
            tone: 'rose',
          },
          {
            storyTerm: 'Inner Parcel X-Ray Scanner',
            technicalTerm: 'Deep GTP-U Inner-Packet Inspection Blocking RFC 1918 OAM Targets',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Inside the telecom core server room, the intruder swaps out the building’s staff badge reader for a rigged lock that accepts their secret skeleton password and cuts a hidden redirection chute in the reception desk so any call from their chosen source window slides quietly to a covert backroom listener.',
        storyMappings: [
          {
            storyTerm: 'Rigged Staff Badge Reader',
            technicalTerm: 'Modified /lib64/security/pam_unix_auth.so Referenced in /etc/pam.d/sshd',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden Reception Redirection Chute',
            technicalTerm: 'Covert iptables nat PREROUTING Source-Port Redirection Rule',
            tone: 'amber',
          },
          {
            storyTerm: 'Telecom Core Server Room',
            technicalTerm: 'Linux / Solaris Mobile Core SGSN / GGSN Infrastructure Host',
            tone: 'sky',
          },
          {
            storyTerm: 'Forensic Lock & Chute Audit',
            technicalTerm: 'Package Hash Verification of PAM Modules & iptables -t nat -L Audit',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'mobile-android-binder-gpu-selinux-audit-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a strictly walled glass playroom inside a modern smartphone where untrusted web pages are allowed to draw pictures but cannot touch the building’s master wiring. An intruder slips a rigged drawing request through the graphics pass-through slot to break the lock on the central control room, turns off the building’s master safety guardrails, and starts a silent full-privilege worker directly from memory without ever registering an app nameplate on the front lobby directory.',
      storyMappings: [
        {
          storyTerm: 'Walled Glass Playroom',
          technicalTerm: 'Sandboxed Chrome Renderer Context (u:r:isolated_app:s0)',
          tone: 'sky',
        },
        {
          storyTerm: 'Graphics Pass-Through Slot',
          technicalTerm: 'ioctl() Calls to /dev/mali0 GPU Driver or /dev/binder (CVE-2023-4211)',
          tone: 'amber',
        },
        {
          storyTerm: 'Turning Off Safety Guardrails',
          technicalTerm: 'Zeroing cred->uid/gid & Patching selinux_state.enforcing in Kernel',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlisted Full-Privilege Worker',
          technicalTerm: '/system/bin/app_process64 Loading Hidden DEX Without PackageManager APK',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Trapped inside the walled glass playroom, the compromised web viewer repeatedly shoves malformed control tokens through the graphics and intercom pass-through slots until the central control room accidentally hands back a freed memory locker it is still using.',
        storyMappings: [
          {
            storyTerm: 'Walled Glass Playroom',
            technicalTerm: 'Restricted SELinux Context u:r:isolated_app:s0',
            tone: 'sky',
          },
          {
            storyTerm: 'Graphics & Intercom Slots',
            technicalTerm: 'Kernel Device Nodes /dev/mali0 (GPU) and /dev/binder',
            tone: 'amber',
          },
          {
            storyTerm: 'Malformed Control Tokens',
            technicalTerm: 'Crafted ioctl() Syscalls Triggering Kernel Use-After-Free',
            tone: 'rose',
          },
          {
            storyTerm: 'Playroom Boundary Alarms',
            technicalTerm: 'Android logcat & SELinux avc: denied Audit Messages',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using that stolen control-room reach, the intruder erases their visitor wristband down to master superintendent zero and flips the building’s mandatory enforcement breaker from strict lock to silent permissive mode, leaving a telltale breaker-flip stamp in the engineering ring log.',
        storyMappings: [
          {
            storyTerm: 'Erasing Visitor Wristband to Zero',
            technicalTerm: 'Overwriting Kernel task_struct cred->uid and cred->gid to 0 (root)',
            tone: 'rose',
          },
          {
            storyTerm: 'Flipping Enforcement Breaker',
            technicalTerm: 'Patching selinux_state.enforcing from 1 (Enforcing) to 0 (Permissive)',
            tone: 'amber',
          },
          {
            storyTerm: 'Engineering Ring Log',
            technicalTerm: 'Android dmesg, last_kmsg & Audit Event MAC_STATUS (1404)',
            tone: 'sky',
          },
          {
            storyTerm: 'Security State Verification',
            technicalTerm: 'Bugreport Archive Inspection for Unexpected SELinux Transitions',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now holding master superintendent authority, the intruder avoids posting any visible shop sign in the phone’s main app directory and instead launches the building’s own built-in runtime engine pointing directly at a hidden blueprint stashed in a temporary closet.',
        storyMappings: [
          {
            storyTerm: 'Skipping Front App Directory',
            technicalTerm: 'Evading Android PackageManager Visible APK Installation',
            tone: 'amber',
          },
          {
            storyTerm: 'Built-In Runtime Engine',
            technicalTerm: 'Privileged Execution of /system/bin/app_process64',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden Temporary Blueprint',
            technicalTerm: 'CLASSPATH Pointing to Hidden DEX Archive in /data/local/tmp/ or memfd',
            tone: 'rose',
          },
          {
            storyTerm: 'Mobile DFIR Inspection',
            technicalTerm: 'Amnesty Tech Bugreport & Process Lineage Audit of app_process64',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a courier dropping off a fake animated greeting card that secretly conceals a dense architectural blueprint folded inside a paper disguise. Because the greeting-card label tricks the building’s automated preview booth into routing it around the armored inspection chamber, a tiny built-in typesetting machine executes seventy thousand logic steps to hijack the phone, leaving no permanent tools behind after a reboot, only crash slips and permanent cellular billing entries under a made-up maintenance worker’s name.',
      storyMappings: [
        {
          storyTerm: 'Fake Greeting Card Concealing Blueprint',
          technicalTerm: '.gif Attachment Carrying %PDF-1.3 Header & /JBIG2Decode Stream',
          tone: 'rose',
        },
        {
          storyTerm: 'Armored Inspection Chamber Bypass',
          technicalTerm: 'CoreGraphics Rendering Outside iOS BlastDoor Image Sandbox',
          tone: 'amber',
        },
        {
          storyTerm: 'Seventy Thousand Typesetting Steps',
          technicalTerm: 'CVE-2021-30860 (FORCEDENTRY) JBIG2Stream Integer Overflow',
          tone: 'sky',
        },
        {
          storyTerm: 'Made-Up Worker Cellular Billing',
          technicalTerm: 'DataUsage.sqlite ZPROCESS Anomaly (RoleAccountd / NULL Bundle ID)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'A silent incoming delivery lands in the phone’s attachment tray stamped as a harmless animated picture, but peeling back the outer wrapper reveals a compressed document stream engineered to slip straight into the core rendering office.',
        storyMappings: [
          {
            storyTerm: 'Attachment Delivery Clerk',
            technicalTerm: 'iOS IMTransferAgent Saving IMG_0041.gif in ~/Library/SMS/Attachments/',
            tone: 'sky',
          },
          {
            storyTerm: 'Harmless Picture Label',
            technicalTerm: 'Masqueraded .gif Extension Masking %PDF-1.3 File Signature',
            tone: 'amber',
          },
          {
            storyTerm: 'Compressed Document Stream',
            technicalTerm: 'Embedded /Filter /JBIG2Decode Stream Inside Disguised PDF',
            tone: 'rose',
          },
          {
            storyTerm: 'High-Risk Mailroom Lock',
            technicalTerm: 'Apple iOS Lockdown Mode Blocking Complex Attachment Parsing',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the building’s graphics press tries to lay out the disguised document outside the armored inspection chamber, the seventy-thousand-step typesetting script overflows the press’s internal counter and constructs a miniature virtual machine out of ink logic gates, leaving a crash slip in the maintenance tray.',
        storyMappings: [
          {
            storyTerm: 'Graphics Press Outside Chamber',
            technicalTerm: 'CoreGraphics Xpdf JBIG2Stream::readTextRegionSeg Outside BlastDoor',
            tone: 'sky',
          },
          {
            storyTerm: 'Seventy-Thousand-Step Logic Gates',
            technicalTerm: 'CVE-2021-30860 Bitwise AND/OR/XOR/XNOR Refinement Overflow',
            tone: 'rose',
          },
          {
            storyTerm: 'Targeted Rendering Workers',
            technicalTerm: 'IMTranscoderAgent and SpringBoard System Processes',
            tone: 'amber',
          },
          {
            storyTerm: 'Maintenance Tray Crash Slip',
            technicalTerm: '/private/var/mobile/Library/Logs/CrashReporter/IMTranscoderAgent-*.ips',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Although the spyware sweeps its temporary hallway tools away cleanly and vanishes on reboot, the phone’s permanent network billing ledgers forever keep a timestamped row showing a mystery worker with no official company badge sending megabytes of data seven seconds after the rigged card arrived.',
        storyMappings: [
          {
            storyTerm: 'Permanent Network Billing Ledgers',
            technicalTerm: 'DataUsage.sqlite (ZPROCESS / ZLIVEUSAGE) & netusage.sqlite',
            tone: 'sky',
          },
          {
            storyTerm: 'Mystery Worker Without Badge',
            technicalTerm: 'Anomalous ZPROCNAME (RoleAccountd / Stagingd) with NULL ZBUNDLENAME',
            tone: 'rose',
          },
          {
            storyTerm: 'Seven-Second Arrival Correlation',
            technicalTerm: 'Temporal Match Right After IMTransferAgent Attachment Download',
            tone: 'amber',
          },
          {
            storyTerm: 'Forensic Ledger Verification',
            technicalTerm: 'Amnesty MVT Inspection of Pre-Reboot sysdiagnose & SQLite Tables',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a modern city transit control center where every department exchanges digital work orders across a high-speed glass hallway using short-lived badge passes issued by a central registry booth. An intruder on an unauthorized maintenance terminal walks up to the registry booth to mint a high-clearance pass, walks straight to the passenger-tracking desk to pull real-time cell tower locations, and simultaneously sends spoofed cross-border roaming inquiries at the outer border gate where signaling guards flag the impossible travel speed.',
      storyMappings: [
        {
          storyTerm: 'High-Speed Glass Hallway',
          technicalTerm: '5G Core Service-Based Interface (SBI) Over HTTP/2 (3GPP TS 29.510)',
          tone: 'sky',
        },
        {
          storyTerm: 'Central Registry Booth Pass',
          technicalTerm: '5G NRF (Network Repository Function) OAuth 2.0 Token Grant',
          tone: 'amber',
        },
        {
          storyTerm: 'Passenger-Tracking Desk Query',
          technicalTerm: 'UDM /nudm-sdm/v2/ & /nudm-uecm/v1/ SUPI & Cell Tower TAI Lookup',
          tone: 'rose',
        },
        {
          storyTerm: 'Outer Border Signaling Guards',
          technicalTerm: 'Diameter S6a (Code 318 AIR / 319 IDR) & GSMA FS.19 Velocity Firewall',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Working from an unregistered maintenance terminal inside the transit building, the intruder introduces a bogus department card at the central registry booth and asks for a temporary hallway pass stamped with permission to read passenger profiles and live locations.',
        storyMappings: [
          {
            storyTerm: 'Unregistered Maintenance Terminal',
            technicalTerm: 'Unauthorized OAM Subnet Host (10.180.14.99)',
            tone: 'amber',
          },
          {
            storyTerm: 'Bogus Department Card',
            technicalTerm: 'HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ Rogue NF Registration',
            tone: 'rose',
          },
          {
            storyTerm: 'Central Registry Booth Pass',
            technicalTerm: 'NRF POST /oauth2/token Requesting nudm-sdm & nudm-uecm Scopes',
            tone: 'sky',
          },
          {
            storyTerm: 'Strict Badge-to-Certificate Check',
            technicalTerm: '3GPP TS 33.501 mTLS Client X.509 SAN vs Requested OAuth2 Scope',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Flashing that freshly stamped hallway pass at the passenger-tracking desk, the intruder queries permanent subscriber identities and reads back the exact neighborhood station and tower currently serving each targeted commuter.',
        storyMappings: [
          {
            storyTerm: 'Freshly Stamped Hallway Pass',
            technicalTerm: 'NRF-Minted Bearer JWT Used on 5G Service-Based Interface',
            tone: 'amber',
          },
          {
            storyTerm: 'Passenger-Tracking Desk',
            technicalTerm: 'Unified Data Management (UDM, 3GPP TS 29.503 / 29.504)',
            tone: 'sky',
          },
          {
            storyTerm: 'Neighborhood Station & Tower',
            technicalTerm: 'Exposed SUPI/IMSI, Serving AMF GUAMI & gNodeB Tracking Area (TAI)',
            tone: 'rose',
          },
          {
            storyTerm: 'Desk Allowlist Enforcement',
            technicalTerm: 'GSMA FS.37 Policy Limiting UDM Queries to Allowlisted AMF/SMF Nodes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Meanwhile, at the international roaming checkpoint linking older and newer transit lines, signaling guards inspect cross-border authentication slips whose sender seal does not match the physical transport lane and drop the forged frames while linking them back to the internal tracking query.',
        storyMappings: [
          {
            storyTerm: 'International Roaming Checkpoint',
            technicalTerm: '4G/5G Interworking Boundary (DEA / SEPP Signaling Firewall)',
            tone: 'sky',
          },
          {
            storyTerm: 'Cross-Border Authentication Slips',
            technicalTerm: 'Diameter S6a AIR (Command Code 318) & IDR (Command Code 319)',
            tone: 'rose',
          },
          {
            storyTerm: 'Mismatched Sender Seal & Lane',
            technicalTerm: 'Origin-Host / Origin-Realm Mismatch Against Peer SCTP/IP Binding',
            tone: 'amber',
          },
          {
            storyTerm: 'Impossible Travel Speed Guard',
            technicalTerm: 'GSMA FS.19 Category 2 Velocity & Home-Network Location Drop Alert',
            tone: 'emerald',
          },
        ],
      },
    },
  },
};
