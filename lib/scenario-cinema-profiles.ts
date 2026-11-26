/**
 * Static, zero-dependency Real-World Cinema Direction Profiles for all 188 Attack Explorer scenarios.
 * Anchors every single scenario in one of 28 recognizable everyday real-world places with:
 * - 1-to-1 aligned Story Text <-> 3D Spatial Architecture <-> 3D Hero Mechanism <-> 2D Architectural Illustration
 * - 188/188 globally unique 3D fingerprints (atmosphere | spatialSet | heroKinetic)
 * - 188/188 globally unique 2D fingerprints (clip2DTheme | clip2DStoryMotif | clip2DLayout)
 *
 * Full per-scenario real-world screenplays & uniqueness tables live strictly under /docs/screenplays/.
 */
import type { ScenarioCinemaProfile } from './scenario-cinema-profiles-core';
export * from './scenario-cinema-profiles-core';

export const SCENARIO_CINEMA_PROFILES: Record<string, ScenarioCinemaProfile> = {
  "process-hollowing": {
    "scenarioId": "process-hollowing",
    "filmTitle": "The Hollowed Armored Transport",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 CREATE SUSPEND",
      "02 UNMAP LEGITIMA",
      "03 OUTBOUND BEACO",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Visitor in a Borrowed Uniform",
      "targetAsset": "Circular Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "log4shell-dfir": {
    "scenarioId": "log4shell-dfir",
    "filmTitle": "Grand Hotel: The Guestbook That Phoned a Stranger",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 INJECT JNDI",
      "02 LOG4J JNDI",
      "03 JAVA SPAWNS",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "amsi-reflective-dll": {
    "scenarioId": "amsi-reflective-dll",
    "filmTitle": "Pharmacy Counter: Fogging the Inspection Glass",
    "genre": "Pharmacy · Real-World Case",
    "settingLabel": "Neighborhood Pharmacy & Prescription Counter",
    "realWorldPlace": "Pharmacy",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "pharmacy-prescription-lab",
    "heroKinetic": "pharmacy-prescription-carousel",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 2282478,
    "secondaryHex": 16478597,
    "clip2DTheme": "xray-cleanroom",
    "clip2DStoryMotif": "pharmacy-prescription-lab",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 LOCATE AMSISCA",
      "02 PATCH BYTES",
      "03 REFLECTIVE DLL",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Pharmacy Drop-Off Window",
      "targetAsset": "Medicine Bottle Carousel",
      "untouchedControl": "Double-Locked Controlled Cabinet",
      "witness": "Pharmacy Dispensing Ledger"
    }
  },
  "ad-kerberoasting": {
    "scenarioId": "ad-kerberoasting",
    "filmTitle": "Courthouse Hall: The Forged Wax-Seal Voucher",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 REQUEST RC4-DO",
      "02 OFFLINE CRACKI",
      "03 REMOTE SERVICE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "dns-tunneling-exfil": {
    "scenarioId": "dns-tunneling-exfil",
    "filmTitle": "Post Office: Coded Postcards Through the Mail Slot",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 CHUNK HEX-ENCO",
      "02 RECURSIVE RELA",
      "03 REASSEMBLE EXF",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "ai-rag-indirect-prompt-injection-mcp-tool-audit": {
    "scenarioId": "ai-rag-indirect-prompt-injection-mcp-tool-audit",
    "filmTitle": "University Exam Hall: The Whisper in the Booklet Margin",
    "genre": "University Hall · Real-World Case",
    "settingLabel": "University Lecture & Exam Hall",
    "realWorldPlace": "University Hall",
    "atmosphere": "violet-neural-core",
    "spatialSet": "university-exam-hall",
    "heroKinetic": "university-proctor-podium",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 12616956,
    "secondaryHex": 2282478,
    "clip2DTheme": "neural-violet",
    "clip2DStoryMotif": "university-exam-hall",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE UNTRUSTE",
      "02 STAGE UNAUTHOR",
      "03 STAGE DETERMIN",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "University Exam Desks",
      "targetAsset": "Proctor Podium & Board",
      "untouchedControl": "Locked Registrar Grade Cabinet",
      "witness": "Exam Hall Proctor Log"
    }
  },
  "blacklotus-uefi-bootkit-cve-2022-21894": {
    "scenarioId": "blacklotus-uefi-bootkit-cve-2022-21894",
    "filmTitle": "Repair Garage: Bolting a Hidden Starter Bypass Under the Hood",
    "genre": "Repair Garage · Real-World Case",
    "settingLabel": "Auto Repair Garage & Hydraulic Car Lift",
    "realWorldPlace": "Repair Garage",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "car-repair-garage",
    "heroKinetic": "garage-hydraulic-car-lift",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "car-repair-garage",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE EFI",
      "02 STAGE BATON",
      "03 STAGE DISABLIN",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Garage Service Bay",
      "targetAsset": "Hydraulic Car Lift & Sedan",
      "untouchedControl": "Factory Sealed Spare-Parts Rack",
      "witness": "Garage Service Checklist Board"
    }
  },
  "cloud-aws-s3-kms-external-account-encryption-extortion-audit": {
    "scenarioId": "cloud-aws-s3-kms-external-account-encryption-extortion-audit",
    "filmTitle": "Logistics Warehouse: Swapping Every Pallet Padlock",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE CROSS-AC",
      "02 STAGE IN-PLACE",
      "03 STAGE PUTBUCKE",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics": {
    "scenarioId": "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics",
    "filmTitle": "Public Library: Redirecting the Rare-Book Catalog Card",
    "genre": "Public Library · Real-World Case",
    "settingLabel": "City Public Library & Rare-Book Reading Hall",
    "realWorldPlace": "Public Library",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "public-library-archive",
    "heroKinetic": "library-rare-book-cage",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "public-library-archive",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE MSSQL",
      "02 STAGE CONFIGUR",
      "03 STAGE IN-MEMOR",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Library Bookshelves & Desk",
      "targetAsset": "Locked Rare-Book Cage",
      "untouchedControl": "General Fiction Reading Tables",
      "witness": "Library Circulation Audit Ledger"
    }
  },
  "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics": {
    "scenarioId": "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics",
    "filmTitle": "City Park: The Silent Drop-Off by the Stone Fountain",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE MEMORY-B",
      "02 STAGE RAW",
      "03 STAGE FORENSIC",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "dfir-lsass-minidump-comsvcs-sysmon-eid10": {
    "scenarioId": "dfir-lsass-minidump-comsvcs-sysmon-eid10",
    "filmTitle": "Hospital Ward: Photocopying the Triage Clipboard",
    "genre": "Hospital Ward · Real-World Case",
    "settingLabel": "City Hospital Triage Desk & Patient Ward",
    "realWorldPlace": "Hospital Ward",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "hospital-triage-ward",
    "heroKinetic": "hospital-triage-med-cart",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 2282478,
    "secondaryHex": 16478597,
    "clip2DTheme": "xray-cleanroom",
    "clip2DStoryMotif": "hospital-triage-ward",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE SEDEBUGP",
      "02 STAGE CROSS-PR",
      "03 STAGE MDMP",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Hospital Triage Desk",
      "targetAsset": "Rolling Medicine Cart",
      "untouchedControl": "Sealed Clean-Supply Closet",
      "witness": "Nurse Station Chart Audit"
    }
  },
  "fortimanager-fgd-jump-cve-2024-47575": {
    "scenarioId": "fortimanager-fgd-jump-cve-2024-47575",
    "filmTitle": "Train Station: Flipping the Express Track Switchboard",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE FGFM",
      "03 STAGE EXFILTRA",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "ics-industroyer2-iec-60870-5-104-substation-telemetry": {
    "scenarioId": "ics-industroyer2-iec-60870-5-104-substation-telemetry",
    "filmTitle": "Power Substation: Tripping the Municipal Grid Breakers",
    "genre": "Power Substation · Real-World Case",
    "settingLabel": "Municipal Power Substation & Waterworks Yard",
    "realWorldPlace": "Power Substation",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "power-substation-waterworks",
    "heroKinetic": "substation-breaker-valve",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 8246268,
    "secondaryHex": 16347926,
    "clip2DTheme": "alpine-grid-ice",
    "clip2DStoryMotif": "power-substation-waterworks",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE LEGITIMA",
      "02 STAGE IEC",
      "03 STAGE ASDU",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Substation Breaker Yard",
      "targetAsset": "Pipe Valve & Control Room",
      "untouchedControl": "Isolated Backup Generator Bay",
      "witness": "Control Room Gauge Recorder"
    }
  },
  "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit": {
    "scenarioId": "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit",
    "filmTitle": "Waterworks Yard: The Frozen Green Pressure Gauge",
    "genre": "Power Substation · Real-World Case",
    "settingLabel": "Municipal Power Substation & Waterworks Yard",
    "realWorldPlace": "Power Substation",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "power-substation-waterworks",
    "heroKinetic": "substation-breaker-valve",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "power-substation-waterworks",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE ENGINEER",
      "02 STAGE S7COMM",
      "03 STAGE S7COMM",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Substation Breaker Yard",
      "targetAsset": "Pipe Valve & Control Room",
      "untouchedControl": "Isolated Backup Generator Bay",
      "witness": "Control Room Gauge Recorder"
    }
  },
  "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr": {
    "scenarioId": "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr",
    "filmTitle": "City Street: Hijacking Every Corner Traffic Signal",
    "genre": "City Street · Real-World Case",
    "settingLabel": "Downtown City Street Corner & Traffic Lights",
    "realWorldPlace": "City Street",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "city-street-intersection",
    "heroKinetic": "street-traffic-light-taxi",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 15235577,
    "secondaryHex": 3718648,
    "clip2DTheme": "telecom-rf-magenta",
    "clip2DStoryMotif": "city-street-intersection",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE ARTEX",
      "02 STAGE MACHINE-",
      "03 STAGE 5-MINUTE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Street Corner Traffic Light",
      "targetAsset": "Crosswalk & City Taxi",
      "untouchedControl": "Neighboring Sidewalk Cafe",
      "witness": "Intersection Traffic Camera"
    }
  },
  "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics": {
    "scenarioId": "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics",
    "filmTitle": "Art Museum: Slipping Past the Glass Pedestal Lasers",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE ZERO-CLI",
      "02 STAGE COREGRAP",
      "03 STAGE DATAUSAG",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626": {
    "scenarioId": "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626",
    "filmTitle": "Shipping Port: The Unlatched Cargo Container Hatch",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE OPEN",
      "02 STAGE RELATIVE",
      "03 STAGE HOST",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "solarwinds-sunburst-orion-supply-chain": {
    "scenarioId": "solarwinds-sunburst-orion-supply-chain",
    "filmTitle": "Factory Floor: Midnight Swap on the Assembly Line",
    "genre": "Factory Floor · Real-World Case",
    "settingLabel": "Automated Factory Floor & Assembly Conveyor",
    "realWorldPlace": "Factory Floor",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "factory-assembly-line",
    "heroKinetic": "factory-conveyor-robot-arm",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "factory-assembly-line",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE SUNSPOT",
      "02 STAGE SUNBURST",
      "03 STAGE TEARDROP",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Assembly Conveyor Belt",
      "targetAsset": "Robotic Stamp Station",
      "untouchedControl": "Original Master Blueprint Cabinet",
      "witness": "Assembly Line Inspection Camera"
    }
  },
  "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit": {
    "scenarioId": "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit",
    "filmTitle": "Broadcast Studio: The Covert Patch Cord on the Mixing Desk",
    "genre": "Broadcast Studio · Real-World Case",
    "settingLabel": "Live TV Broadcast Studio & Roof Signal Dish",
    "realWorldPlace": "Broadcast Studio",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "broadcast-tv-studio",
    "heroKinetic": "broadcast-studio-signal-dish",
    "cameraStyle": "low-hero-right",
    "primaryHex": 15235577,
    "secondaryHex": 3718648,
    "clip2DTheme": "telecom-rf-magenta",
    "clip2DStoryMotif": "broadcast-tv-studio",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE NRF",
      "02 STAGE UDM",
      "03 STAGE DIAMETER",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Studio Mixing Console",
      "targetAsset": "ON AIR Roof Signal Dish",
      "untouchedControl": "Backup Emergency Transmitter",
      "witness": "Master Control Broadcast Log"
    }
  },
  "ransomware-shadow-wipe": {
    "scenarioId": "ransomware-shadow-wipe",
    "filmTitle": "Supermarket: LockBit Ransomware Behavioral Analysis: VSS",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 INHIBIT SYSTEM",
      "02 MULTI-THREADED",
      "03 MULTI-THREADED",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "3cx-desktopapp-supply-chain-lazarus": {
    "scenarioId": "3cx-desktopapp-supply-chain-lazarus",
    "filmTitle": "Supermarket: Lazarus : 3CXDesktopApp Supply Chain",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 TROJANIZED FFM",
      "02 GITHUB ICON1",
      "03 IN-MEMORY ICON",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "apache-activemq-cve-2023-46604-openwire": {
    "scenarioId": "apache-activemq-cve-2023-46604-openwire",
    "filmTitle": "Logistics Warehouse: Apache ActiveMQ OpenWire ExceptionRespons",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 OPENWIRE EXCEP",
      "02 CREATETHROWABL",
      "03 SPRING PROCESS",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "atlassian-confluence-cve-2023-22515-storm0062": {
    "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
    "filmTitle": "Airport Terminal: Storm-0062: Atlassian Confluence XWork OGNL",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 XWORK PARAMETE",
      "02 ROGUE ADMIN",
      "03 MALICIOUS OSGI",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "aws-cognito-iam-passrole-privesc": {
    "scenarioId": "aws-cognito-iam-passrole-privesc",
    "filmTitle": "Office Building: IAM PassRole + Lambda CreateFunction",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 IAM PASSROLE",
      "02 LAMBDA INVOCAT",
      "03 CLOUDTRAIL STO",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "aws-imdsv1-ssrf-capitalone-style": {
    "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
    "filmTitle": "Office Building: EC2 Reverse-Proxy SSRF to IMDSv1",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 SSRF INJECTION",
      "02 EXTRACTION TEM",
      "03 OFF-CLOUD CRED",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "azure-ad-connect-pass-the-certificate": {
    "scenarioId": "azure-ad-connect-pass-the-certificate",
    "filmTitle": "Border Control: Entra Connect MSOL_ DKM Decryption",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 QUERYING ADSYN",
      "02 DPAPI MCRYPT",
      "03 MSOL DCSYNC",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "barracuda-esg-cve-2023-2868-unc4841": {
    "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
    "filmTitle": "Bank Branch: UNC4841: Barracuda ESG .tar Command",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 MALICIOUS TAR",
      "02 IMPLANTING SAL",
      "03 DEEP PERSISTEN",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "cisco-ios-xe-cve-2023-20198-badimplant": {
    "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
    "filmTitle": "Courthouse: Cisco IOS XE Web UI",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 DOUBLE URL-ENC",
      "02 INSTALLADD COM",
      "03 IMPLANTING BAD",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "cl0p-moveit-transfer-cve-2023-34362": {
    "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
    "filmTitle": "Subway Metro: CL0P : MOVEit Transfer SQLi,",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "low-hero-right",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 SESSION POISON",
      "02 NET DESERIALIZ",
      "03 AZURE BLOB",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "elastic-apt41-dustpan-stealthvector": {
    "scenarioId": "elastic-apt41-dustpan-stealthvector",
    "filmTitle": "Airport Terminal: APT41 : DodgeBox, Call-Stack Spoofing",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 DODGEBOX DUSTP",
      "02 CALL-STACK SPO",
      "03 CLOUDFLARE WOR",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "elastic-grimresource-msc": {
    "scenarioId": "elastic-grimresource-msc",
    "filmTitle": "Apartment Lobby: GrimResource: MMC & apds.dll XSS-to-RCE",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 MMC PARSES",
      "02 XSLT TRANSFORM",
      "03 SACRIFICIAL DL",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "elastic-lotus-blossom-chrysalis": {
    "scenarioId": "elastic-lotus-blossom-chrysalis",
    "filmTitle": "Border Control: Lotus Blossom APT: WinGUp DLL",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 WINGUP GUP",
      "02 FNV-1A MURMURH",
      "03 CHRYSALIS HTTP",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "f5-bigip-request-smuggling": {
    "scenarioId": "f5-bigip-request-smuggling",
    "filmTitle": "Grand Hotel: F5 BIG-IP TMUI AJP Request",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 TMUI AJP",
      "02 ROGUE ADMIN",
      "03 ROOT BASH",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "fortra-goanywhere-mft-cve-2023-0669-cl0p": {
    "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
    "filmTitle": "Supermarket: CL0P : Fortra GoAnywhere MFT",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 ENCRYPTED BUND",
      "02 COMMONSBEANUTI",
      "03 TRUEBOT COBALT",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "gcp-service-account-hmac-key-pivot": {
    "scenarioId": "gcp-service-account-hmac-key-pivot",
    "filmTitle": "Subway Metro: GCP iam.serviceAccountKeys.create & serviceAccou",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 ENUMERATING PR",
      "02 MINTING USER-M",
      "03 IMPERSONATED E",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "juniper-junos-jweb-cve-2023-36845-chain": {
    "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
    "filmTitle": "Airport Terminal: Juniper Junos OS J-Web: PHPRC",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 MANIPULATING P",
      "02 INJECTING AUTO",
      "03 FILELESS IN-ME",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "k8s-runc-cve-2024-21626-leaky-vessels": {
    "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
    "filmTitle": "Train Station: \"Leaky Vessels\" runc WORKDIR Host",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 RUNC CGROUP",
      "02 PERSISTENT HOS",
      "03 RELATIVE DOT-D",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "kaspersky-lazarus-byovd-fudmodule": {
    "scenarioId": "kaspersky-lazarus-byovd-fudmodule",
    "filmTitle": "Border Control: Lazarus Group : appid.sys Zero-Day",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 APPID SYS",
      "02 FUDMODULE DKOM",
      "03 UNMONITORED KA",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "kaspersky-operation-triangulation": {
    "scenarioId": "kaspersky-operation-triangulation",
    "filmTitle": "Subway Metro: Operation Triangulation: Zero-Click Font Exploit",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 ZERO-CLICK IME",
      "02 XNU INTEGER",
      "03 IN-MEMORY TRIA",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "kaspersky-toddycat-eset-dll": {
    "scenarioId": "kaspersky-toddycat-eset-dll",
    "filmTitle": "Office Building: ToddyCat APT: ESET Scanner DLL",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 ESET ECLS",
      "02 TCESB IN-MEMOR",
      "03 DPAPI COOKIE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "macos-gatekeeper-achilles-cve-2022-42821": {
    "scenarioId": "macos-gatekeeper-achilles-cve-2022-42821",
    "filmTitle": "Airport Terminal: macOS Gatekeeper \"Achilles\" Bypass via",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 APPLEDOUBLE RE",
      "02 SETXATTR COM",
      "03 GATEKEEPER LOC",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "mandiant-apt29-teamcity-jetstream": {
    "scenarioId": "mandiant-apt29-teamcity-jetstream",
    "filmTitle": "Train Station: APT29 : JetBrains TeamCity RCE",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 TEAMCITY REST",
      "02 DEBUG PROCESS",
      "03 GRAPHICALPROTO",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "microsoft-storm-0558-msa-signing-key": {
    "scenarioId": "microsoft-storm-0558-msa-signing-key",
    "filmTitle": "Border Control: Storm-0558: Acquired MSA Consumer Signing",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 OFFLINE TOKEN",
      "02 CROSS-REALM VA",
      "03 SILENT OWA",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "ms-forest-blizzard-gooseegg": {
    "scenarioId": "ms-forest-blizzard-gooseegg",
    "filmTitle": "Apartment Lobby: Forest Blizzard : Print Spooler",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 GOOSEEGG SYMLI",
      "02 SPOOLSV EXE",
      "03 WHO EXE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "ms-midnight-blizzard-oauth": {
    "scenarioId": "ms-midnight-blizzard-oauth",
    "filmTitle": "Grand Hotel: Midnight Blizzard : OAuth App",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 LOW-VOLUME PAS",
      "02 MALICIOUS OAUT",
      "03 OAUTH BEARER",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "ms-salt-typhoon-telecom": {
    "scenarioId": "ms-salt-typhoon-telecom",
    "filmTitle": "Art Museum: Salt Typhoon : Demodex Rootkit",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 BYOVD VULNERAB",
      "02 DEMODEX KERNEL",
      "03 TELECOM TACACS",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "ms-volt-typhoon-lotl": {
    "scenarioId": "ms-volt-typhoon-lotl",
    "filmTitle": "Apartment Lobby: Volt Typhoon: Living-off-the-Land ntdsutil IF",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 HANDS-ON-KEYBO",
      "02 OFFLINE NTDS",
      "03 MULTI-HOP INTE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "nopac-samaccountname-cve-2021-42278-42287": {
    "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
    "filmTitle": "Grand Hotel: Active Directory \"noPac\": sAMAccountName Spoofing",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 MACHINE ACCOUN",
      "02 RENAME BACK",
      "03 DOMAIN CONTROL",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "okta-har-file-session-token-hijack": {
    "scenarioId": "okta-har-file-session-token-hijack",
    "filmTitle": "Bank Branch: Support Case .har File sid",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 EXTRACTING LIV",
      "02 REPLAYING SID",
      "03 MINTING PERSIS",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "openssh-regreSSHion-cve-2024-6387": {
    "scenarioId": "openssh-regreSSHion-cve-2024-6387",
    "filmTitle": "Restaurant Kitchen: OpenSSH \"regreSSHion\": SIGALRM Async-Signa",
    "genre": "Restaurant Kitchen · Real-World Case",
    "settingLabel": "Busy Restaurant Kitchen & Drive-Thru Window",
    "realWorldPlace": "Restaurant Kitchen",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "restaurant-kitchen-drivethru",
    "heroKinetic": "restaurant-kitchen-order-rail",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "restaurant-kitchen-drivethru",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 SSH HEAP",
      "02 SIGALRM INTERR",
      "03 GLIBC FILE",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Drive-Thru Order Window",
      "targetAsset": "Kitchen Ticket Rail",
      "untouchedControl": "Sealed Pantry Cold Room",
      "witness": "Kitchen POS Receipt Printer"
    }
  },
  "papercut-ng-cve-2023-27350-bl00dy": {
    "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
    "filmTitle": "Shipping Port: PaperCut MF/NG SetupCompleted Auth Bypass",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 TAPESTRY SETUP",
      "02 DISABLING PRIN",
      "03 RHINO RUNTIME",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "printnightmare-spooler-cve-2021-34527": {
    "scenarioId": "printnightmare-spooler-cve-2021-34527",
    "filmTitle": "Office Building: Windows \"PrintNightmare\": RpcAddPrinterDriver",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "low-hero-right",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 RPCADDPRINTERD",
      "02 UNC DRIVER",
      "03 DLLMAIN SYSTEM",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "proxyshell-exchange-cve-2021-34473": {
    "scenarioId": "proxyshell-exchange-cve-2021-34473",
    "filmTitle": "Subway Metro: Microsoft Exchange \"ProxyShell\": Autodiscover SS",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "obsidian-orbital-deck",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 AUTODISCOVER J",
      "02 POWERSHELL X-R",
      "03 NEW-MAILBOXEXP",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "sharepoint-cve-2023-29357-24955-chain": {
    "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
    "filmTitle": "Airport Terminal: Microsoft SharePoint: JWT \"alg:none\" Auth",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "toxic-biolab-green",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 FORGING UNSIGN",
      "02 IMPERSONATING ",
      "03 BUSINESS CONNE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "snowflake-unc5537-saas-extortion": {
    "scenarioId": "snowflake-unc5537-saas-extortion",
    "filmTitle": "Courthouse: UNC5537 Campaign: Infostealer Credential Replay",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 INFOSTEALER CR",
      "02 FROSTBITE RAPE",
      "03 DBEAVER ULTIMA",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "splunk-citrix-bleed-session-hijack": {
    "scenarioId": "splunk-citrix-bleed-session-hijack",
    "filmTitle": "Highway Toll Plaza: Citrix Bleed: NetScaler OOB Memory",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 NETSCALER SNPR",
      "02 NSC AAAC",
      "03 CITRIX ICA",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "splunk-ivanti-connect-secure": {
    "scenarioId": "splunk-ivanti-connect-secure",
    "filmTitle": "Courthouse: Ivanti Connect Secure : Auth",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 PATH TRAVERSAL",
      "02 ZIPLINE ELF",
      "03 DSLOG CREDENTI",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "splunk-screenconnect-slashandgrab": {
    "scenarioId": "splunk-screenconnect-slashandgrab",
    "filmTitle": "Logistics Warehouse: ConnectWise ScreenConnect \"SlashAndGrab\"",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 SETUPWIZARD AS",
      "02 MALICIOUS ASHX",
      "03 DOWNSTREAM FLE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "sysdig-scarleteel-aws-eks-terraform": {
    "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
    "filmTitle": "Art Museum: SCARLETEEL Operation: Kubernetes Pod RCE,",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 KUBERNETES POD",
      "02 TERRAFORM STAT",
      "03 CROSS-ACCOUNT ",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "talos-arcanedoor-asa": {
    "scenarioId": "talos-arcanedoor-asa",
    "filmTitle": "Highway Toll Plaza: ArcaneDoor : Cisco ASA Zero-Days,",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 ASA ZERO-DAY",
      "02 LINE DANCER",
      "03 SYSLOG SUPPRES",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "talos-fortinet-coathanger-apt": {
    "scenarioId": "talos-fortinet-coathanger-apt",
    "filmTitle": "Train Station: NL, Talos & Mandiant —",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 FORTIOS SSLVPN",
      "02 COATHANGER PRE",
      "03 MASQUERADED HT",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "unit42-panos-midnight-eclipse": {
    "scenarioId": "unit42-panos-midnight-eclipse",
    "filmTitle": "Apartment Lobby: Operation MidnightEclipse: PAN-OS GlobalProte",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 SESSID COOKIE",
      "02 TELEMETRY CRON",
      "03 UPSTYLE PYTHON",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "unit42-scattered-spider-cloud": {
    "scenarioId": "unit42-scattered-spider-cloud",
    "filmTitle": "Grand Hotel: Scattered Spider : SSO MFA",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "violet-neural-core",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 OKTA MFA",
      "02 AUTHORIZED RMM",
      "03 SAML FEDERATIO",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "unit42-star-blizzard-evilginx-aitm": {
    "scenarioId": "unit42-star-blizzard-evilginx-aitm",
    "filmTitle": "Cinema Theater: Star Blizzard / Storm-0539: Evilginx",
    "genre": "Cinema Theater · Real-World Case",
    "settingLabel": "Downtown Cinema Theater & Projection Stage",
    "realWorldPlace": "Cinema Theater",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "cinema-theater-stage",
    "heroKinetic": "cinema-velvet-stage-curtain",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "cinema-theater-stage",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 EVILGINX AITM",
      "02 WEB SESSION",
      "03 STEALTH INBOX",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Cinema Ticket Booth",
      "targetAsset": "Velvet Stage & Projector",
      "untouchedControl": "Front Lobby Concession Counter",
      "witness": "Projection Booth Reel Log"
    }
  },
  "vmware-vcenter-cve-2023-34048-unc3886": {
    "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
    "filmTitle": "Border Control: UNC3886: vCenter vmdird Out-of-Bounds Write",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 VCENTER VMDIRD",
      "02 EXTRACTING DEC",
      "03 DEPLOYING VIRT",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "windows-clfs-ransomware-cve-2023-28252-nokoyawa": {
    "scenarioId": "windows-clfs-ransomware-cve-2023-28252-nokoyawa",
    "filmTitle": "University Hall: Windows CLFS.sys Kernel Zero-Day EoP",
    "genre": "University Hall · Real-World Case",
    "settingLabel": "University Lecture & Exam Hall",
    "realWorldPlace": "University Hall",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "university-exam-hall",
    "heroKinetic": "university-proctor-podium",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 12616956,
    "secondaryHex": 2282478,
    "clip2DTheme": "neural-violet",
    "clip2DStoryMotif": "university-exam-hall",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 MALFORMED BASE",
      "02 CCLFSBASEFILEP",
      "03 SYSTEM PRIVILE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "University Exam Desks",
      "targetAsset": "Proctor Podium & Board",
      "untouchedControl": "Locked Registrar Grade Cabinet",
      "witness": "Exam Hall Proctor Log"
    }
  },
  "xz-utils-cve-2024-3094-backdoor": {
    "scenarioId": "xz-utils-cve-2024-3094-backdoor",
    "filmTitle": "Post Office: XZ Utils IFUNC sshd Supply",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 BUILD-TIME EXT",
      "02 GLIBC IFUNC",
      "03 ED448 SSH",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "zerologon-netlogon-cve-2020-1472": {
    "scenarioId": "zerologon-netlogon-cve-2020-1472",
    "filmTitle": "Office Building: Active Directory \"Zerologon\": Netlogon AES-CF",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 ALL-ZERO AES-C",
      "02 OVERWRITING DO",
      "03 DCSYNC DOMAIN",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "zyxel-firewall-cve-2023-28771-ike-rce": {
    "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
    "filmTitle": "Supermarket: Zyxel Firewall Pre-Auth IKEv2 Packet",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 CRAFTING IKEV2",
      "02 BREAKING OUT",
      "03 PERIMETER FIRE",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "acidrain-viasat-ka-sat-modem-wiper": {
    "scenarioId": "acidrain-viasat-ka-sat-modem-wiper",
    "filmTitle": "Cinema Theater: SAT)",
    "genre": "Cinema Theater · Real-World Case",
    "settingLabel": "Downtown Cinema Theater & Projection Stage",
    "realWorldPlace": "Cinema Theater",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "cinema-theater-stage",
    "heroKinetic": "cinema-velvet-stage-curtain",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "cinema-theater-stage",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE MANAGEME",
      "02 STAGE BLOCK",
      "03 STAGE RAW",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Cinema Ticket Booth",
      "targetAsset": "Velvet Stage & Projector",
      "untouchedControl": "Front Lobby Concession Counter",
      "witness": "Projection Booth Reel Log"
    }
  },
  "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928": {
    "scenarioId": "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928",
    "filmTitle": "City Park: 2024-2928, Protect AI & MITRE",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "low-hero-right",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE RUN",
      "03 STAGE ARBITRAR",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit": {
    "scenarioId": "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit",
    "filmTitle": "Post Office: Exposed Ollama Inference API Rogue",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE ARBITRAR",
      "03 STAGE PRODUCTI",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "ai-pytorch-pickle-torch-load-supply-chain-forensics": {
    "scenarioId": "ai-pytorch-pickle-torch-load-supply-chain-forensics",
    "filmTitle": "Highway Toll Plaza: PyTorch Pickle Model Checkpoint Deserializ",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE PYTORCH",
      "02 STAGE LEGACY",
      "03 STAGE RUNTIME",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022": {
    "scenarioId": "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022",
    "filmTitle": "Subway Metro: Ray AI Framework Unauthenticated Jobs",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE EXPOSED",
      "02 STAGE UNAUTHEN",
      "03 STAGE MODEL",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "akira-ransomware-cisco-anyconnect-esxi": {
    "scenarioId": "akira-ransomware-cisco-anyconnect-esxi",
    "filmTitle": "Bank Branch: 109A)",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE CISCO",
      "02 STAGE CHISEL",
      "03 STAGE ESXCLI",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "alphv-blackcat-sphynx-rust-impacket-exmatter": {
    "scenarioId": "alphv-blackcat-sphynx-rust-impacket-exmatter",
    "filmTitle": "Airport Terminal: 353A, Mandiant & Microsoft —",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE EXMATTER",
      "02 STAGE ACCESS-T",
      "03 STAGE EMBEDDED",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "array-networks-ag-vxag-cve-2023-28461": {
    "scenarioId": "array-networks-ag-vxag-cve-2023-28461",
    "filmTitle": "Courthouse: AN-FILESHARE flags Header Bypass &",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "violet-neural-core",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE X-AN-FIL",
      "02 STAGE ARBITRAR",
      "03 STAGE INTERNAL",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "aukill-edr-killer-procxp152-byovd": {
    "scenarioId": "aukill-edr-killer-procxp152-byovd",
    "filmTitle": "Shipping Port: AuKill EDR Killer Abusing Signed",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE DROPPING",
      "02 STAGE OPENING",
      "03 STAGE RING-0",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "bianlian-extortion-go-backdoor-rdp": {
    "scenarioId": "bianlian-extortion-go-backdoor-rdp",
    "filmTitle": "Logistics Warehouse: In SOCKS5 & Pure Extortion",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE DEPLOYIN",
      "02 STAGE IN-MEMOR",
      "03 STAGE PURE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "blackbasta-qakbot-backstab-ransomware": {
    "scenarioId": "blackbasta-qakbot-backstab-ransomware",
    "filmTitle": "City Park: 131A)",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE EMAIL",
      "02 STAGE BACKSTAB",
      "03 STAGE VSSADMIN",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "cactus-ransomware-qlik-sense-ssh-batch-unpacker": {
    "scenarioId": "cactus-ransomware-qlik-sense-ssh-batch-unpacker",
    "filmTitle": "Supermarket: Cactus Ransomware: Qlik Sense Exploitation",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE QLIK",
      "02 STAGE PSEXEC",
      "03 STAGE MULTI-ST",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "caddywiper-arguepatch-gpo-destruction": {
    "scenarioId": "caddywiper-arguepatch-gpo-destruction",
    "filmTitle": "Train Station: Aware Disk Wiper",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE GPO",
      "02 STAGE DSROLEGE",
      "03 STAGE TAKEOWNE",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "check-point-vpn-cve-2024-24919-info-leak": {
    "scenarioId": "check-point-vpn-cve-2024-24919-info-leak",
    "filmTitle": "Apartment Lobby: 2024-24919)",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE HARVESTI",
      "03 STAGE VPN",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "circleci-oauth-github-token-rotation-breach": {
    "scenarioId": "circleci-oauth-github-token-rotation-breach",
    "filmTitle": "Border Control: CircleCI CI/CD Supply Chain Breach:",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "toxic-biolab-green",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE ENGINEER",
      "02 STAGE SESSION",
      "03 STAGE OFFLINE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "cl0p-truebot-flawedgrace-sdbbot-ransomware": {
    "scenarioId": "cl0p-truebot-flawedgrace-sdbbot-ransomware",
    "filmTitle": "Public Library: 158A, Microsoft & Mandiant —",
    "genre": "Public Library · Real-World Case",
    "settingLabel": "City Public Library & Rare-Book Reading Hall",
    "realWorldPlace": "Public Library",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "public-library-archive",
    "heroKinetic": "library-rare-book-cage",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "public-library-archive",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE TRUEBOT",
      "02 STAGE MASS",
      "03 STAGE RC4",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Library Bookshelves & Desk",
      "targetAsset": "Locked Rare-Book Cage",
      "untouchedControl": "General Fiction Reading Tables",
      "witness": "Library Circulation Audit Ledger"
    }
  },
  "cloud-aws-eks-aws-auth-configmap-system-masters-audit": {
    "scenarioId": "cloud-aws-eks-aws-auth-configmap-system-masters-audit",
    "filmTitle": "Subway Metro: Amazon EKS aws-auth ConfigMap system:masters",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE EKS",
      "02 STAGE PATCHING",
      "03 STAGE CLUSTER-",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "cloud-aws-sts-federation-token-console-signin-audit": {
    "scenarioId": "cloud-aws-sts-federation-token-console-signin-audit",
    "filmTitle": "Airport Terminal: AWS STS GetFederationToken Console Sign-In",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE PROGRAMM",
      "02 STAGE FEDERATI",
      "03 STAGE CONSOLE",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "cloud-azure-vm-custom-script-extension-managed-identity-audit": {
    "scenarioId": "cloud-azure-vm-custom-script-extension-managed-identity-audit",
    "filmTitle": "Art Museum: Azure VM CustomScriptExtension & IMDS",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "obsidian-orbital-deck",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE ARM",
      "02 STAGE GUEST",
      "03 STAGE LOCAL",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "cloud-entra-id-conditional-access-device-code-phishing-audit": {
    "scenarioId": "cloud-entra-id-conditional-access-device-code-phishing-audit",
    "filmTitle": "Train Station: Entra ID OAuth 2.0 Device",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE OAUTH",
      "02 STAGE FAMILY",
      "03 STAGE MICROSOF",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "cloud-gcp-cloud-build-default-service-account-artifact-audit": {
    "scenarioId": "cloud-gcp-cloud-build-default-service-account-artifact-audit",
    "filmTitle": "Factory Floor: GCP Cloud Build Default Service",
    "genre": "Factory Floor · Real-World Case",
    "settingLabel": "Automated Factory Floor & Assembly Conveyor",
    "realWorldPlace": "Factory Floor",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "factory-assembly-line",
    "heroKinetic": "factory-conveyor-robot-arm",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "factory-assembly-line",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE SUBMITTI",
      "02 STAGE WORKER",
      "03 STAGE ARTIFACT",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Assembly Conveyor Belt",
      "targetAsset": "Robotic Stamp Station",
      "untouchedControl": "Original Master Blueprint Cabinet",
      "witness": "Assembly Line Inspection Camera"
    }
  },
  "cloud-github-actions-pull-request-target-oidc-token-audit": {
    "scenarioId": "cloud-github-actions-pull-request-target-oidc-token-audit",
    "filmTitle": "Factory Floor: GitHub Actions pull_request_target Workflow &",
    "genre": "Factory Floor · Real-World Case",
    "settingLabel": "Automated Factory Floor & Assembly Conveyor",
    "realWorldPlace": "Factory Floor",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "factory-assembly-line",
    "heroKinetic": "factory-conveyor-robot-arm",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "factory-assembly-line",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE PRIVILEG",
      "02 STAGE RUNNER",
      "03 STAGE AWS",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Assembly Conveyor Belt",
      "targetAsset": "Robotic Stamp Station",
      "untouchedControl": "Original Master Blueprint Cabinet",
      "witness": "Assembly Line Inspection Camera"
    }
  },
  "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit": {
    "scenarioId": "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit",
    "filmTitle": "Office Building: M365 Purview New-ComplianceSearch & eDiscover",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE ROLEGROU",
      "02 STAGE TENANT-W",
      "03 STAGE PST/ZIP",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "cloud-midnight-blizzard-oauth-legacy-test-app-audit": {
    "scenarioId": "cloud-midnight-blizzard-oauth-legacy-test-app-audit",
    "filmTitle": "Border Control: 02 — Midnight Blizzard Legacy",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE LOW-VOLU",
      "02 STAGE SERVICE",
      "03 STAGE OAUTH",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "cloud-salesforce-connected-app-oauth-bulk-api-export-audit": {
    "scenarioId": "cloud-salesforce-connected-app-oauth-bulk-api-export-audit",
    "filmTitle": "City Street: SaaS Connected App OAuth Scope",
    "genre": "City Street · Real-World Case",
    "settingLabel": "Downtown City Street Corner & Traffic Lights",
    "realWorldPlace": "City Street",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "city-street-intersection",
    "heroKinetic": "street-traffic-light-taxi",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-street-intersection",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE UNVERIFI",
      "02 STAGE ASYNCHRO",
      "03 STAGE BULK",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Street Corner Traffic Light",
      "targetAsset": "Crosswalk & City Taxi",
      "untouchedControl": "Neighboring Sidewalk Cafe",
      "witness": "Intersection Traffic Camera"
    }
  },
  "codecov-bash-uploader-ci-env-exfil": {
    "scenarioId": "codecov-bash-uploader-ci-env-exfil",
    "filmTitle": "Courthouse: Codecov Bash Uploader CI/CD Environment",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE GCS",
      "02 STAGE UNVERIFI",
      "03 STAGE DOWNSTRE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "container-cap-sys-admin-cgroup-release-agent-notify-audit": {
    "scenarioId": "container-cap-sys-admin-cgroup-release-agent-notify-audit",
    "filmTitle": "University Hall: Privileged Container CAP_SYS_ADMIN Cgroup v1",
    "genre": "University Hall · Real-World Case",
    "settingLabel": "University Lecture & Exam Hall",
    "realWorldPlace": "University Hall",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "university-exam-hall",
    "heroKinetic": "university-proctor-podium",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 12616956,
    "secondaryHex": 2282478,
    "clip2DTheme": "neural-violet",
    "clip2DStoryMotif": "university-exam-hall",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE MOUNTING",
      "02 STAGE ENABLING",
      "03 STAGE CHILD",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "University Exam Desks",
      "targetAsset": "Proctor Podium & Board",
      "untouchedControl": "Locked Registrar Grade Cabinet",
      "witness": "Exam Hall Proctor Log"
    }
  },
  "container-cap-sys-module-kernel-ko-insmod-load-audit": {
    "scenarioId": "container-cap-sys-module-kernel-ko-insmod-load-audit",
    "filmTitle": "Shipping Port: Container CAP_SYS_MODULE Host Kernel Module",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE INSPECTI",
      "02 STAGE INVOKING",
      "03 STAGE HOST",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "crowdstrike-poortry-burntcigar-byovd": {
    "scenarioId": "crowdstrike-poortry-burntcigar-byovd",
    "filmTitle": "Cinema Theater: Signed Kernel Callback Wiper",
    "genre": "Cinema Theater · Real-World Case",
    "settingLabel": "Downtown Cinema Theater & Projection Stage",
    "realWorldPlace": "Cinema Theater",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "cinema-theater-stage",
    "heroKinetic": "cinema-velvet-stage-curtain",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "cinema-theater-stage",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE LOADING",
      "02 STAGE AUTHENTI",
      "03 STAGE EPROCESS",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Cinema Ticket Booth",
      "targetAsset": "Velvet Stage & Projector",
      "untouchedControl": "Front Lobby Concession Counter",
      "witness": "Projection Booth Reel Log"
    }
  },
  "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit": {
    "scenarioId": "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit",
    "filmTitle": "Restaurant Kitchen: Exposed MongoDB Wire Protocol Port",
    "genre": "Restaurant Kitchen · Real-World Case",
    "settingLabel": "Busy Restaurant Kitchen & Drive-Thru Window",
    "realWorldPlace": "Restaurant Kitchen",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "restaurant-kitchen-drivethru",
    "heroKinetic": "restaurant-kitchen-order-rail",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "restaurant-kitchen-drivethru",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE REPLICAT",
      "03 STAGE BULK",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Drive-Thru Order Window",
      "targetAsset": "Kitchen Ticket Rail",
      "untouchedControl": "Sealed Pantry Cold Room",
      "witness": "Kitchen POS Receipt Printer"
    }
  },
  "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094": {
    "scenarioId": "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094",
    "filmTitle": "Pharmacy: PostgreSQL UTF-8 Quote Escaping &",
    "genre": "Pharmacy · Real-World Case",
    "settingLabel": "Neighborhood Pharmacy & Prescription Counter",
    "realWorldPlace": "Pharmacy",
    "atmosphere": "toxic-biolab-green",
    "spatialSet": "pharmacy-prescription-lab",
    "heroKinetic": "pharmacy-prescription-carousel",
    "cameraStyle": "low-hero-right",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "pharmacy-prescription-lab",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE INVALID",
      "02 STAGE INTERACT",
      "03 STAGE DATABASE",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Pharmacy Drop-Off Window",
      "targetAsset": "Medicine Bottle Carousel",
      "untouchedControl": "Double-Locked Controlled Cabinet",
      "witness": "Pharmacy Dispensing Ledger"
    }
  },
  "db-redis-lua-sandbox-debian-liblua-cve-2022-0543": {
    "scenarioId": "db-redis-lua-sandbox-debian-liblua-cve-2022-0543",
    "filmTitle": "Logistics Warehouse: 5081, NIST NVD & CISA",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE REDIS",
      "03 STAGE CHILD",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "db-snowflake-unc5537-single-factor-auth-data-egress-audit": {
    "scenarioId": "db-snowflake-unc5537-single-factor-auth-data-egress-audit",
    "filmTitle": "Public Library: Snowflake Single-Factor Session & QUERY_HISTOR",
    "genre": "Public Library · Real-World Case",
    "settingLabel": "City Public Library & Rare-Book Reading Hall",
    "realWorldPlace": "Public Library",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "public-library-archive",
    "heroKinetic": "library-rare-book-cage",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "public-library-archive",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE SINGLE-F",
      "02 STAGE SCHEMA",
      "03 STAGE BULK",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Library Bookshelves & Desk",
      "targetAsset": "Locked Rare-Book Cage",
      "untouchedControl": "General Fiction Reading Tables",
      "witness": "Library Circulation Audit Ledger"
    }
  },
  "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886": {
    "scenarioId": "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886",
    "filmTitle": "Grand Hotel: AD CS ESC1 SubjectAltName Spoofing",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE ESC1",
      "02 STAGE CSR",
      "03 STAGE KERBEROS",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment": {
    "scenarioId": "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment",
    "filmTitle": "Bank Branch: Tomcat AJP Ghostcat & /manager/text/deploy",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE AJP/1",
      "02 STAGE AUTHENTI",
      "03 STAGE JASPER",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda": {
    "scenarioId": "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda",
    "filmTitle": "Post Office: AWS IAM PassRole + Lambda",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE IAM",
      "02 STAGE LAMBDA",
      "03 STAGE CLOUDTRA",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics": {
    "scenarioId": "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics",
    "filmTitle": "City Park: AWS CloudTrail IMDSv1 Role Theft,",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE EC2",
      "02 STAGE OFF-INST",
      "03 STAGE DATA",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "dfir-bitsadmin-qmgr-persistence-bits-client": {
    "scenarioId": "dfir-bitsadmin-qmgr-persistence-bits-client",
    "filmTitle": "Art Museum: BITS Job Persistence & qmgr.db",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "violet-neural-core",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE BITS",
      "02 STAGE SETNOTIF",
      "03 STAGE BITS",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "dfir-dcsync-drsuapi-replication-eid4662": {
    "scenarioId": "dfir-dcsync-drsuapi-replication-eid4662",
    "filmTitle": "Apartment Lobby: Active Directory DCSync DRSUAPI Replication",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE MS-DRSR",
      "02 STAGE DIRECTOR",
      "03 STAGE REPLICAT",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "dfir-dpapi-masterkey-lsass-browser-vault-forensics": {
    "scenarioId": "dfir-dpapi-masterkey-lsass-browser-vault-forensics",
    "filmTitle": "Grand Hotel: DPAPI MasterKey Backup RPC &",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE DPAPI",
      "02 STAGE DOMAIN",
      "03 STAGE OFFLINE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "dfir-entra-id-prt-roadtools-device-registration-forensics": {
    "scenarioId": "dfir-entra-id-prt-roadtools-device-registration-forensics",
    "filmTitle": "City Street: jan Mollema DFIR — Entra",
    "genre": "City Street · Real-World Case",
    "settingLabel": "Downtown City Street Corner & Traffic Lights",
    "realWorldPlace": "City Street",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "city-street-intersection",
    "heroKinetic": "street-traffic-light-taxi",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-street-intersection",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE TOKEN",
      "02 STAGE ROGUE",
      "03 STAGE PRIMARY",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Street Corner Traffic Light",
      "targetAsset": "Crosswalk & City Taxi",
      "untouchedControl": "Neighboring Sidewalk Cafe",
      "witness": "Intersection Traffic Camera"
    }
  },
  "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace": {
    "scenarioId": "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace",
    "filmTitle": "Supermarket: 039A & Mandiant DFIR —",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE ESXI",
      "02 STAGE MASS",
      "03 STAGE INTERMIT",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "dfir-evtx-log-clearing-wevtutil-eid1102-104": {
    "scenarioId": "dfir-evtx-log-clearing-wevtutil-eid1102-104",
    "filmTitle": "Highway Toll Plaza: 86 & Microsoft DFIR —",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE MASS",
      "02 STAGE IMMUTABL",
      "03 STAGE NTFS",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics": {
    "scenarioId": "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics",
    "filmTitle": "Office Building: 02 DFIR — Exchange HttpProxy,",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE EXCHANGE",
      "02 STAGE EXCHANGE",
      "03 STAGE ASP",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "dfir-gcp-cloud-audit-service-account-key-impersonation": {
    "scenarioId": "dfir-gcp-cloud-audit-service-account-key-impersonation",
    "filmTitle": "Bank Branch: GCP Cloud Audit ServiceAccountKey Creation",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE SERVICE",
      "02 STAGE PERSISTE",
      "03 STAGE BIGQUERY",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly": {
    "scenarioId": "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly",
    "filmTitle": "Apartment Lobby: FR & MITRE DFIR —",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE OFFLINE",
      "02 STAGE ORPHANED",
      "03 STAGE TARGET",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell": {
    "scenarioId": "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell",
    "filmTitle": "Courthouse: IIS HTTP.sys Kernel URI Registration",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE NATIVE/M",
      "02 STAGE KERNEL-M",
      "03 STAGE LIVE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape": {
    "scenarioId": "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape",
    "filmTitle": "University Hall: Kubernetes Audit Log Privileged Pod",
    "genre": "University Hall · Real-World Case",
    "settingLabel": "University Lecture & Exam Hall",
    "realWorldPlace": "University Hall",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "university-exam-hall",
    "heroKinetic": "university-proctor-podium",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 12616956,
    "secondaryHex": 2282478,
    "clip2DTheme": "neural-violet",
    "clip2DStoryMotif": "university-exam-hall",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE SERVICEA",
      "02 STAGE PRIVILEG",
      "03 STAGE HOST",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "University Exam Desks",
      "targetAsset": "Proctor Podium & Board",
      "untouchedControl": "Locked Registrar Grade Cabinet",
      "witness": "Exam Hall Proctor Log"
    }
  },
  "dfir-linux-auditd-pam-sshd-authorized-keys-persistence": {
    "scenarioId": "dfir-linux-auditd-pam-sshd-authorized-keys-persistence",
    "filmTitle": "Subway Metro: Linux auditd SSH authorized_keys &",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE LINUX",
      "02 STAGE PAM",
      "03 STAGE CORRELAT",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "dfir-linux-ld-so-preload-userland-rootkit-proc-maps": {
    "scenarioId": "dfir-linux-ld-so-preload-userland-rootkit-proc-maps",
    "filmTitle": "Power Substation: NL, Red Hat & MITRE",
    "genre": "Power Substation · Real-World Case",
    "settingLabel": "Municipal Power Substation & Waterworks Yard",
    "realWorldPlace": "Power Substation",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "power-substation-waterworks",
    "heroKinetic": "substation-breaker-valve",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 8246268,
    "secondaryHex": 16347926,
    "clip2DTheme": "alpine-grid-ice",
    "clip2DStoryMotif": "power-substation-waterworks",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE SHARED",
      "02 STAGE GLOBAL",
      "03 STAGE FORENSIC",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Substation Breaker Yard",
      "targetAsset": "Pipe Valve & Control Room",
      "untouchedControl": "Isolated Backup Generator Bay",
      "witness": "Control Room Gauge Recorder"
    }
  },
  "dfir-linux-systemd-generator-cron-udev-persistence": {
    "scenarioId": "dfir-linux-systemd-generator-cron-udev-persistence",
    "filmTitle": "Restaurant Kitchen: Linux systemd Generator & Unit",
    "genre": "Restaurant Kitchen · Real-World Case",
    "settingLabel": "Busy Restaurant Kitchen & Drive-Thru Window",
    "realWorldPlace": "Restaurant Kitchen",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "restaurant-kitchen-drivethru",
    "heroKinetic": "restaurant-kitchen-order-rail",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "restaurant-kitchen-drivethru",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE DROPPING",
      "02 STAGE EPHEMERA",
      "03 STAGE FORENSIC",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Drive-Thru Order Window",
      "targetAsset": "Kitchen Ticket Rail",
      "untouchedControl": "Sealed Pantry Cold Room",
      "witness": "Kitchen POS Receipt Printer"
    }
  },
  "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule": {
    "scenarioId": "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule",
    "filmTitle": "Airport Terminal: 320A DFIR — M365 Purview",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE STEALTHY",
      "02 STAGE MAILBOX",
      "03 STAGE OAUTH",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace": {
    "scenarioId": "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace",
    "filmTitle": "Highway Toll Plaza: MSSQL xp_cmdshell / Ole Automation",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE CONFIGUR",
      "02 STAGE XPLOG70",
      "03 STAGE CLR",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "dfir-ntds-dit-vssadmin-esentutl-extraction": {
    "scenarioId": "dfir-ntds-dit-vssadmin-esentutl-extraction",
    "filmTitle": "Grand Hotel: Volume Shadow Copy & esentutl.exe",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE VOLUME",
      "02 STAGE ESENT",
      "03 STAGE SYSTEM",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2": {
    "scenarioId": "dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2",
    "filmTitle": "Shipping Port: NTFS $MFT $STANDARD_INFORMATION vs $FILE_NAME",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "violet-neural-core",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE PAYLOAD",
      "02 STAGE USER-MOD",
      "03 STAGE OFFLINE",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "dfir-postgresql-copy-from-program-pg-log-auditd-trace": {
    "scenarioId": "dfir-postgresql-copy-from-program-pg-log-auditd-trace",
    "filmTitle": "Post Office: PostgreSQL COPY FROM PROGRAM &",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE PRIVILEG",
      "02 STAGE COPY",
      "03 STAGE LARGE",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "dfir-powershell-eid4104-4103-clm-downgrade-forensics": {
    "scenarioId": "dfir-powershell-eid4104-4103-clm-downgrade-forensics",
    "filmTitle": "Cinema Theater: PowerShell EventID 4104 / 4103,",
    "genre": "Cinema Theater · Real-World Case",
    "settingLabel": "Downtown Cinema Theater & Projection Stage",
    "realWorldPlace": "Cinema Theater",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "cinema-theater-stage",
    "heroKinetic": "cinema-velvet-stage-curtain",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "cinema-theater-stage",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE POWERSHE",
      "02 STAGE DYNAMIC",
      "03 STAGE PERSISTE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Cinema Ticket Booth",
      "targetAsset": "Velvet Stage & Projector",
      "untouchedControl": "Front Lobby Concession Counter",
      "witness": "Projection Booth Reel Log"
    }
  },
  "dfir-printspooler-spl-shd-spool-file-persistence": {
    "scenarioId": "dfir-printspooler-spl-shd-spool-file-persistence",
    "filmTitle": "Logistics Warehouse: Print Spooler Port Monitor &",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "violet-neural-core",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE MS-RPRN",
      "02 STAGE PORT",
      "03 STAGE SYSTEM",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "dfir-rdp-lateral-movement-tsclient-bitmap-cache": {
    "scenarioId": "dfir-rdp-lateral-movement-tsclient-bitmap-cache",
    "filmTitle": "Factory Floor: RDP Lateral Movement, Session Reconnection",
    "genre": "Factory Floor · Real-World Case",
    "settingLabel": "Automated Factory Floor & Assembly Conveyor",
    "realWorldPlace": "Factory Floor",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "factory-assembly-line",
    "heroKinetic": "factory-conveyor-robot-arm",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "factory-assembly-line",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE OUTBOUND",
      "02 STAGE DESTINAT",
      "03 STAGE CLIENT-S",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Assembly Conveyor Belt",
      "targetAsset": "Robotic Stamp Station",
      "untouchedControl": "Original Master Blueprint Cabinet",
      "witness": "Assembly Line Inspection Camera"
    }
  },
  "dfir-schtasks-xml-registry-taskcache-forensics": {
    "scenarioId": "dfir-schtasks-xml-registry-taskcache-forensics",
    "filmTitle": "Pharmacy: Scheduled Task Creation & TaskCache",
    "genre": "Pharmacy · Real-World Case",
    "settingLabel": "Neighborhood Pharmacy & Prescription Counter",
    "realWorldPlace": "Pharmacy",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "pharmacy-prescription-lab",
    "heroKinetic": "pharmacy-prescription-carousel",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "pharmacy-prescription-lab",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE SCHEDULE",
      "02 STAGE TARRASK",
      "03 STAGE FORENSIC",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Pharmacy Drop-Off Window",
      "targetAsset": "Medicine Bottle Carousel",
      "untouchedControl": "Double-Locked Controlled Cabinet",
      "witness": "Pharmacy Dispensing Ledger"
    }
  },
  "dfir-sharepoint-iis-viewstate-losformatter-deserialization": {
    "scenarioId": "dfir-sharepoint-iis-viewstate-losformatter-deserialization",
    "filmTitle": "Coffee Shop: ASP.NET / SharePoint __VIEWSTATE MachineKey",
    "genre": "Coffee Shop · Real-World Case",
    "settingLabel": "Corner Coffee Shop & Co-Working Cafe",
    "realWorldPlace": "Coffee Shop",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "coffee-shop-cafe",
    "heroKinetic": "cafe-espresso-bar-machine",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "coffee-shop-cafe",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE WEB",
      "02 STAGE SIGNED",
      "03 STAGE W3WP",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Cafe Espresso Bar",
      "targetAsset": "Corner Bistro Tables",
      "untouchedControl": "Roastery Bean Storage Room",
      "witness": "Cafe Manager Order Screen"
    }
  },
  "dfir-shimcache-amcache-execution-artifact-triage": {
    "scenarioId": "dfir-shimcache-amcache-execution-artifact-triage",
    "filmTitle": "Repair Garage: Application Compatibility Shimcache & Amcache.h",
    "genre": "Repair Garage · Real-World Case",
    "settingLabel": "Auto Repair Garage & Hydraulic Car Lift",
    "realWorldPlace": "Repair Garage",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "car-repair-garage",
    "heroKinetic": "garage-hydraulic-car-lift",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "car-repair-garage",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE EPHEMERA",
      "02 STAGE AMCACHE",
      "03 STAGE SYSTEM",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Garage Service Bay",
      "targetAsset": "Hydraulic Car Lift & Sedan",
      "untouchedControl": "Factory Sealed Spare-Parts Rack",
      "witness": "Garage Service Checklist Board"
    }
  },
  "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion": {
    "scenarioId": "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion",
    "filmTitle": "City Park: FR & CISA DFIR —",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "arctic-datacenter-cobalt",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE MS-EFSRP",
      "02 STAGE COERCED",
      "03 STAGE CROSS-PR",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "dfir-smb-psexec-named-pipe-eid5145-7045": {
    "scenarioId": "dfir-smb-psexec-named-pipe-eid5145-7045",
    "filmTitle": "Art Museum: SMB ADMIN$ Share, PSEXESVC Named",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE SMB",
      "02 STAGE REMOTE",
      "03 STAGE NAMED",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "dfir-vhd-iso-motw-bypass-zone-identifier-forensics": {
    "scenarioId": "dfir-vhd-iso-motw-bypass-zone-identifier-forensics",
    "filmTitle": "Supermarket: ISO / VHD Virtual Disk",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE CONTAINE",
      "02 STAGE VIRTUAL",
      "03 STAGE USRCLASS",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks": {
    "scenarioId": "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks",
    "filmTitle": "University Hall: Volatility 3 windows.malfind, psscan vs",
    "genre": "University Hall · Real-World Case",
    "settingLabel": "University Lecture & Exam Hall",
    "realWorldPlace": "University Hall",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "university-exam-hall",
    "heroKinetic": "university-proctor-podium",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 12616956,
    "secondaryHex": 2282478,
    "clip2DTheme": "neural-violet",
    "clip2DStoryMotif": "university-exam-hall",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE VOLATILI",
      "02 STAGE DIRECT",
      "03 STAGE KERNEL",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "University Exam Desks",
      "targetAsset": "Proctor Podium & Board",
      "untouchedControl": "Locked Registrar Grade Cabinet",
      "witness": "Exam Hall Proctor Log"
    }
  },
  "dfir-wer-silentprocessexit-localdumps-registry-hijack": {
    "scenarioId": "dfir-wer-silentprocessexit-localdumps-registry-hijack",
    "filmTitle": "Train Station: IFEO SilentProcessExit & WerFault.exe LSASS",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE ENABLING",
      "02 STAGE CONFIGUR",
      "03 STAGE TRIGGERI",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "dfir-windows-prefetch-srum-network-execution-trace": {
    "scenarioId": "dfir-windows-prefetch-srum-network-execution-trace",
    "filmTitle": "Public Library: 86 & SANS DFIR —",
    "genre": "Public Library · Real-World Case",
    "settingLabel": "City Public Library & Rare-Book Reading Hall",
    "realWorldPlace": "Public Library",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "public-library-archive",
    "heroKinetic": "library-rare-book-cage",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "public-library-archive",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE MASQUERA",
      "02 STAGE PREFETCH",
      "03 STAGE SRUM",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Library Bookshelves & Desk",
      "targetAsset": "Locked Rare-Book Cage",
      "untouchedControl": "General Fiction Reading Tables",
      "witness": "Library Circulation Audit Ledger"
    }
  },
  "dfir-winrm-wsman-remote-powershell-eid91-4624": {
    "scenarioId": "dfir-winrm-wsman-remote-powershell-eid91-4624",
    "filmTitle": "Office Building: WinRM / WS-Management Lateral Movement",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE OUTBOUND",
      "02 STAGE DESTINAT",
      "03 STAGE WSMPROVH",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "dfir-wmi-event-subscription-persistence-sysmon": {
    "scenarioId": "dfir-wmi-event-subscription-persistence-sysmon",
    "filmTitle": "Hospital Ward: WMI Permanent Event Subscription Persistence",
    "genre": "Hospital Ward · Real-World Case",
    "settingLabel": "City Hospital Triage Desk & Patient Ward",
    "realWorldPlace": "Hospital Ward",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "hospital-triage-ward",
    "heroKinetic": "hospital-triage-med-cart",
    "cameraStyle": "low-hero-right",
    "primaryHex": 2282478,
    "secondaryHex": 16478597,
    "clip2DTheme": "xray-cleanroom",
    "clip2DStoryMotif": "hospital-triage-ward",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE WMI",
      "02 STAGE COMMANDL",
      "03 STAGE SYSTEM",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Hospital Triage Desk",
      "targetAsset": "Rolling Medicine Cart",
      "untouchedControl": "Sealed Clean-Supply Closet",
      "witness": "Nurse Station Chart Audit"
    }
  },
  "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing": {
    "scenarioId": "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing",
    "filmTitle": "Bank Branch: Zeek ssl.log JA3/JA4 Fingerprint &",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE TLS",
      "02 STAGE SERVERHE",
      "03 STAGE PERIODIC",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "docker-buildkit-runc-cache-mount-race-cve-2024-23651": {
    "scenarioId": "docker-buildkit-runc-cache-mount-race-cve-2024-23651",
    "filmTitle": "Border Control: BuildKit RUN --mount=type=cache Race Condition",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3003583,
    "clip2DTheme": "desert-dish-terracotta",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE PARALLEL",
      "02 STAGE TOCTOU",
      "03 STAGE BUILDER",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "docker-engine-unauthenticated-tcp-2375-api-socket-audit": {
    "scenarioId": "docker-engine-unauthenticated-tcp-2375-api-socket-audit",
    "filmTitle": "Courthouse: Exposed Docker Daemon TCP Port",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE POST",
      "03 STAGE HOST",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "docker-oci-registry-manifest-layer-poisoning-cosign-audit": {
    "scenarioId": "docker-oci-registry-manifest-layer-poisoning-cosign-audit",
    "filmTitle": "Subway Metro: 190 & MITRE — OCI",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 8490232,
    "secondaryHex": 3718648,
    "clip2DTheme": "orbital-indigo",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE UPLOADIN",
      "02 STAGE OVERWRIT",
      "03 STAGE ADMISSIO",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "docker-var-run-docker-sock-mounted-socket-breakout-audit": {
    "scenarioId": "docker-var-run-docker-sock-mounted-socket-breakout-audit",
    "filmTitle": "Post Office: Container Mounted /var/run/docker.sock Unix Socke",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE DISCOVER",
      "02 STAGE SPAWNING",
      "03 STAGE ENTERING",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "eightbase-phobos-smoke-loader-process-hacker": {
    "scenarioId": "eightbase-phobos-smoke-loader-process-hacker",
    "filmTitle": "City Street: 045A & Cisco Talos —",
    "genre": "City Street · Real-World Case",
    "settingLabel": "Downtown City Street Corner & Traffic Lights",
    "realWorldPlace": "City Street",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "city-street-intersection",
    "heroKinetic": "street-traffic-light-taxi",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-street-intersection",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE SMOKELOA",
      "02 STAGE UAC",
      "03 STAGE PHOBOS",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Street Corner Traffic Light",
      "targetAsset": "Crosswalk & City Taxi",
      "untouchedControl": "Neighboring Sidewalk Cafe",
      "witness": "Intersection Traffic Camera"
    }
  },
  "genshin-mhyprot2-ransomware-byovd": {
    "scenarioId": "genshin-mhyprot2-ransomware-byovd",
    "filmTitle": "Broadcast Studio: Cheat Driver Ransomware BYOVD",
    "genre": "Broadcast Studio · Real-World Case",
    "settingLabel": "Live TV Broadcast Studio & Roof Signal Dish",
    "realWorldPlace": "Broadcast Studio",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "broadcast-tv-studio",
    "heroKinetic": "broadcast-studio-signal-dish",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 15235577,
    "secondaryHex": 3718648,
    "clip2DTheme": "telecom-rf-magenta",
    "clip2DStoryMotif": "broadcast-tv-studio",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE DROPPING",
      "02 STAGE OPENING",
      "03 STAGE RING-0",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Studio Mixing Console",
      "targetAsset": "ON AIR Roof Signal Dish",
      "untouchedControl": "Backup Emergency Transmitter",
      "witness": "Master Control Broadcast Log"
    }
  },
  "github-actions-tj-actions-changed-files-cve-2025-30066": {
    "scenarioId": "github-actions-tj-actions-changed-files-cve-2025-30066",
    "filmTitle": "Airport Terminal: actions/changed-files Runner Memory Dump",
    "genre": "Airport Terminal · Real-World Case",
    "settingLabel": "International Airport Terminal & Boarding Gate",
    "realWorldPlace": "Airport Terminal",
    "atmosphere": "violet-neural-core",
    "spatialSet": "airport-terminal-gate",
    "heroKinetic": "commercial-passenger-airplane",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "airport-terminal-gate",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE RETROACT",
      "02 STAGE SUDO",
      "03 STAGE DOUBLE-B",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Airport Security Gate",
      "targetAsset": "Parked Passenger Airplane",
      "untouchedControl": "Public Departures Concourse",
      "witness": "Boarding Pass Scanner & Tower Log"
    }
  },
  "hermeticwiper-ukraine-easeus-mbr-wipe": {
    "scenarioId": "hermeticwiper-ukraine-easeus-mbr-wipe",
    "filmTitle": "Repair Garage: Sandworm HermeticWiper Signed EaseUS Driver",
    "genre": "Repair Garage · Real-World Case",
    "settingLabel": "Auto Repair Garage & Hydraulic Car Lift",
    "realWorldPlace": "Repair Garage",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "car-repair-garage",
    "heroKinetic": "garage-hydraulic-car-lift",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "car-repair-garage",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE EXTRACTI",
      "02 STAGE DISABLIN",
      "03 STAGE RAW",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Garage Service Bay",
      "targetAsset": "Hydraulic Car Lift & Sedan",
      "untouchedControl": "Factory Sealed Spare-Parts Rack",
      "witness": "Garage Service Checklist Board"
    }
  },
  "hunters-international-hive-rust-wsus-sharpwmi": {
    "scenarioId": "hunters-international-hive-rust-wsus-sharpwmi",
    "filmTitle": "Logistics Warehouse: 321A, Unit 42 & Sophos",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "toxic-biolab-green",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE SHARPWMI",
      "02 STAGE DIRECT",
      "03 STAGE MULTI-TH",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "ics-frostygoop-modbus-tcp-district-heating-controller-audit": {
    "scenarioId": "ics-frostygoop-modbus-tcp-district-heating-controller-audit",
    "filmTitle": "Restaurant Kitchen: UA & CISA ICS —",
    "genre": "Restaurant Kitchen · Real-World Case",
    "settingLabel": "Busy Restaurant Kitchen & Drive-Thru Window",
    "realWorldPlace": "Restaurant Kitchen",
    "atmosphere": "sunrise-logistics-port",
    "spatialSet": "restaurant-kitchen-drivethru",
    "heroKinetic": "restaurant-kitchen-order-rail",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "restaurant-kitchen-drivethru",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE EXTERNAL",
      "02 STAGE BULK",
      "03 STAGE HOLDING",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Drive-Thru Order Window",
      "targetAsset": "Kitchen Ticket Rail",
      "untouchedControl": "Sealed Pantry Cold Room",
      "witness": "Kitchen POS Receipt Printer"
    }
  },
  "ics-pipedream-incontroller-codesys-modbus-opcua": {
    "scenarioId": "ics-pipedream-incontroller-codesys-modbus-opcua",
    "filmTitle": "Pharmacy: 103A, Dragos PIPEDREAM & Mandiant",
    "genre": "Pharmacy · Real-World Case",
    "settingLabel": "Neighborhood Pharmacy & Prescription Counter",
    "realWorldPlace": "Pharmacy",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "pharmacy-prescription-lab",
    "heroKinetic": "pharmacy-prescription-carousel",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "pharmacy-prescription-lab",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE INDUSTRI",
      "02 STAGE CODESYS",
      "03 STAGE DIRECT",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Pharmacy Drop-Off Window",
      "targetAsset": "Medicine Bottle Carousel",
      "untouchedControl": "Double-Locked Controlled Cabinet",
      "witness": "Pharmacy Dispensing Ledger"
    }
  },
  "ics-trisis-triton-schneider-triconex-sis-telemetry": {
    "scenarioId": "ics-trisis-triton-schneider-triconex-sis-telemetry",
    "filmTitle": "Shipping Port: ALERT-17-356-01, Mandiant & Dragos —",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "low-hero-right",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE MASQUERA",
      "02 STAGE TRISTATI",
      "03 STAGE TRISTATI",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "inc-ransom-lynx-citrix-netscaler-wmic-mega": {
    "scenarioId": "inc-ransom-lynx-citrix-netscaler-wmic-mega",
    "filmTitle": "Highway Toll Plaza: INC Ransom & Lynx: Citrix",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "neon-rain-cyberpunk",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE EDGE",
      "02 STAGE MASS",
      "03 STAGE AES-128-",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "intezer-blackberry-symbiote-linux-ldpreload": {
    "scenarioId": "intezer-blackberry-symbiote-linux-ldpreload",
    "filmTitle": "Factory Floor: Symbiote Parasitic Linux LD_PRELOAD Rootkit",
    "genre": "Factory Floor · Real-World Case",
    "settingLabel": "Automated Factory Floor & Assembly Conveyor",
    "realWorldPlace": "Factory Floor",
    "atmosphere": "violet-neural-core",
    "spatialSet": "factory-assembly-line",
    "heroKinetic": "factory-conveyor-robot-arm",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "factory-assembly-line",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE GLOBAL",
      "02 STAGE PAM",
      "03 STAGE LIBPCAP",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Assembly Conveyor Belt",
      "targetAsset": "Robotic Stamp Station",
      "untouchedControl": "Original Master Blueprint Cabinet",
      "witness": "Assembly Line Inspection Camera"
    }
  },
  "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit": {
    "scenarioId": "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit",
    "filmTitle": "Train Station: EU — Ivanti Virtual Traffic",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "violet-neural-core",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE UNAUTHOR",
      "03 STAGE AUTHENTI",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning": {
    "scenarioId": "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning",
    "filmTitle": "Cinema Theater: 249A — JetBrains TeamCity Auth",
    "genre": "Cinema Theater · Real-World Case",
    "settingLabel": "Downtown Cinema Theater & Projection Stage",
    "realWorldPlace": "Cinema Theater",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "cinema-theater-stage",
    "heroKinetic": "cinema-velvet-stage-curtain",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "cinema-theater-stage",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE CI/CD",
      "03 STAGE TROJANIZ",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Cinema Ticket Booth",
      "targetAsset": "Velvet Stage & Projector",
      "untouchedControl": "Front Lobby Concession Counter",
      "witness": "Projection Booth Reel Log"
    }
  },
  "k8s-coredns-dns-poisoning-service-account-token-audit": {
    "scenarioId": "k8s-coredns-dns-poisoning-service-account-token-audit",
    "filmTitle": "City Street: Kubernetes CoreDNS ConfigMap Modification &",
    "genre": "City Street · Real-World Case",
    "settingLabel": "Downtown City Street Corner & Traffic Lights",
    "realWorldPlace": "City Street",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "city-street-intersection",
    "heroKinetic": "street-traffic-light-taxi",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-street-intersection",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE RBAC",
      "02 STAGE COREDNS",
      "03 STAGE SERVICE-",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Street Corner Traffic Light",
      "targetAsset": "Crosswalk & City Taxi",
      "untouchedControl": "Neighboring Sidewalk Cafe",
      "witness": "Intersection Traffic Camera"
    }
  },
  "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit": {
    "scenarioId": "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit",
    "filmTitle": "City Park: Cluster-Wide Malicious DaemonSet Scheduling &",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "violet-neural-core",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE CREATING",
      "02 STAGE DAEMONSE",
      "03 STAGE CONTROL-",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "k8s-ephemeral-debug-container-process-namespace-share-audit": {
    "scenarioId": "k8s-ephemeral-debug-container-process-namespace-share-audit",
    "filmTitle": "Power Substation: Ephemeral Debug Container Shared Process",
    "genre": "Power Substation · Real-World Case",
    "settingLabel": "Municipal Power Substation & Waterworks Yard",
    "realWorldPlace": "Power Substation",
    "atmosphere": "crimson-bunker-alert",
    "spatialSet": "power-substation-waterworks",
    "heroKinetic": "substation-breaker-valve",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 8246268,
    "secondaryHex": 16347926,
    "clip2DTheme": "alpine-grid-ice",
    "clip2DStoryMotif": "power-substation-waterworks",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE SUBRESOU",
      "02 STAGE PROCESS",
      "03 STAGE INTERACT",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Substation Breaker Yard",
      "targetAsset": "Pipe Valve & Control Room",
      "untouchedControl": "Isolated Backup Generator Bay",
      "witness": "Control Room Gauge Recorder"
    }
  },
  "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974": {
    "scenarioId": "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974",
    "filmTitle": "Coffee Shop: Ingress-NGINX Admission Controller Configuration",
    "genre": "Coffee Shop · Real-World Case",
    "settingLabel": "Corner Coffee Shop & Co-Working Cafe",
    "realWorldPlace": "Coffee Shop",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "coffee-shop-cafe",
    "heroKinetic": "cafe-espresso-bar-machine",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "coffee-shop-cafe",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE ADMISSIO",
      "02 STAGE NGINX",
      "03 STAGE SERVICEA",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Cafe Espresso Bar",
      "targetAsset": "Corner Bistro Tables",
      "untouchedControl": "Roastery Bean Storage Room",
      "witness": "Cafe Manager Order Screen"
    }
  },
  "k8s-kubelet-anonymous-api-etcd-snapshot-forensics": {
    "scenarioId": "k8s-kubelet-anonymous-api-etcd-snapshot-forensics",
    "filmTitle": "Supermarket: Kubelet Read/Write Port 10250 &",
    "genre": "Supermarket · Real-World Case",
    "settingLabel": "Neighborhood Supermarket & Checkout Lanes",
    "realWorldPlace": "Supermarket",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "supermarket-retail-store",
    "heroKinetic": "supermarket-checkout-cart",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "supermarket-retail-store",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE REMOTE",
      "03 STAGE CONTROL-",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Supermarket Shopping Cart",
      "targetAsset": "Checkout Barcode Register",
      "untouchedControl": "Locked Stockroom Back Door",
      "witness": "Receipt Tape & Aisle Camera"
    }
  },
  "k8s-mutating-admission-webhook-sidecar-injection-audit": {
    "scenarioId": "k8s-mutating-admission-webhook-sidecar-injection-audit",
    "filmTitle": "Art Museum: Rogue MutatingWebhookConfiguration Pod Sidecar &",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "copper-archive-cathedral",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE CREATING",
      "02 STAGE KUBE-API",
      "03 STAGE JSONPATC",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "kaseya-vsa-revil-cve-2021-30116": {
    "scenarioId": "kaseya-vsa-revil-cve-2021-30116",
    "filmTitle": "Office Building: Day & REvil MsMpEng.exe Side-Loading",
    "genre": "Office Building · Real-World Case",
    "settingLabel": "Glass Office Building & Front Reception",
    "realWorldPlace": "Office Building",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "office-building-reception",
    "heroKinetic": "office-reception-turnstile",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 2282478,
    "secondaryHex": 16478597,
    "clip2DTheme": "xray-cleanroom",
    "clip2DStoryMotif": "office-building-reception",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE KASEYA",
      "02 STAGE KASEYA",
      "03 STAGE MSMPENG",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Reception Desk & Pass",
      "targetAsset": "Glass Office Rooms",
      "untouchedControl": "Public Lobby Waiting Area",
      "witness": "Reception Sign-In Logbook"
    }
  },
  "kaspersky-cosmicstrand-uefi-spi-rootkit": {
    "scenarioId": "kaspersky-cosmicstrand-uefi-spi-rootkit",
    "filmTitle": "University Hall: > ntoskrnl.exe Chain)",
    "genre": "University Hall · Real-World Case",
    "settingLabel": "University Lecture & Exam Hall",
    "realWorldPlace": "University Hall",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "university-exam-hall",
    "heroKinetic": "university-proctor-podium",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 12616956,
    "secondaryHex": 2282478,
    "clip2DTheme": "neural-violet",
    "clip2DStoryMotif": "university-exam-hall",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE MOTHERBO",
      "02 STAGE MULTI-HO",
      "03 STAGE PATCHGUA",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "University Exam Desks",
      "targetAsset": "Proctor Podium & Board",
      "untouchedControl": "Locked Registrar Grade Cabinet",
      "witness": "Exam Hall Proctor Log"
    }
  },
  "ledger-connect-kit-npmjs-drainer": {
    "scenarioId": "ledger-connect-kit-npmjs-drainer",
    "filmTitle": "Border Control: Kit NPM Compromise & Web3",
    "genre": "Border Control · Real-World Case",
    "settingLabel": "International Border Crossing & Passport Control",
    "realWorldPlace": "Border Control",
    "atmosphere": "obsidian-orbital-deck",
    "spatialSet": "border-passport-control",
    "heroKinetic": "border-passport-xray-gate",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "border-passport-control",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE FORMER",
      "02 STAGE UNPINNED",
      "03 STAGE ROGUE",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Border Passport Booth",
      "targetAsset": "Luggage X-Ray & Barrier",
      "untouchedControl": "Diplomatic Sealed Pouch Lane",
      "witness": "Customs Passport Registry"
    }
  },
  "linux-bpfdoor-ebpf-socket-filter-apt": {
    "scenarioId": "linux-bpfdoor-ebpf-socket-filter-apt",
    "filmTitle": "Highway Toll Plaza: BPFDoor Passive Linux Rootkit &",
    "genre": "Highway Toll Plaza · Real-World Case",
    "settingLabel": "Multi-Lane City Highway & Toll Plaza",
    "realWorldPlace": "Highway Toll Plaza",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "city-highway-toll-plaza",
    "heroKinetic": "highway-toll-barrier-sedan",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-highway-toll-plaza",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE IN-MEMOR",
      "02 STAGE ATTACHIN",
      "03 STAGE MAGIC",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Highway Express Sedan",
      "targetAsset": "Toll Plaza Barrier Gate",
      "untouchedControl": "Local Side-Road Ramp",
      "witness": "Highway Toll Camera Log"
    }
  },
  "lottie-player-npm-ace-supply-chain-2024": {
    "scenarioId": "lottie-player-npm-ace-supply-chain-2024",
    "filmTitle": "Hospital Ward: @lottiefiles/lottie-player NPM Supply Chain Com",
    "genre": "Hospital Ward · Real-World Case",
    "settingLabel": "City Hospital Triage Desk & Patient Ward",
    "realWorldPlace": "Hospital Ward",
    "atmosphere": "emerald-harbor-mist",
    "spatialSet": "hospital-triage-ward",
    "heroKinetic": "hospital-triage-med-cart",
    "cameraStyle": "low-hero-right",
    "primaryHex": 2282478,
    "secondaryHex": 16478597,
    "clip2DTheme": "xray-cleanroom",
    "clip2DStoryMotif": "hospital-triage-ward",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE COMPROMI",
      "02 STAGE OBFUSCAT",
      "03 STAGE DYNAMIC",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Hospital Triage Desk",
      "targetAsset": "Rolling Medicine Cart",
      "untouchedControl": "Sealed Clean-Supply Closet",
      "witness": "Nurse Station Chart Audit"
    }
  },
  "medusa-ransomware-gaze-abyss-pdqdeploy": {
    "scenarioId": "medusa-ransomware-gaze-abyss-pdqdeploy",
    "filmTitle": "Bank Branch: 071A & Palo Alto Unit",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE SCREENCO",
      "02 STAGE GAZE",
      "03 STAGE PDQ",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "mobile-android-binder-gpu-selinux-audit-forensics": {
    "scenarioId": "mobile-android-binder-gpu-selinux-audit-forensics",
    "filmTitle": "Public Library: Android Kernel Binder/GPU & SELinux",
    "genre": "Public Library · Real-World Case",
    "settingLabel": "City Public Library & Rare-Book Reading Hall",
    "realWorldPlace": "Public Library",
    "atmosphere": "violet-neural-core",
    "spatialSet": "public-library-archive",
    "heroKinetic": "library-rare-book-cage",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "public-library-archive",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE SANDBOXE",
      "02 STAGE SELINUX",
      "03 STAGE PRIVILEG",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Library Bookshelves & Desk",
      "targetAsset": "Locked Rare-Book Cage",
      "untouchedControl": "General Fiction Reading Tables",
      "witness": "Library Circulation Audit Ledger"
    }
  },
  "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics": {
    "scenarioId": "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics",
    "filmTitle": "Broadcast Studio: iOS Operation Triangulation Zero-Click iMess",
    "genre": "Broadcast Studio · Real-World Case",
    "settingLabel": "Live TV Broadcast Studio & Roof Signal Dish",
    "realWorldPlace": "Broadcast Studio",
    "atmosphere": "violet-neural-core",
    "spatialSet": "broadcast-tv-studio",
    "heroKinetic": "broadcast-studio-signal-dish",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 15235577,
    "secondaryHex": 3718648,
    "clip2DTheme": "telecom-rf-magenta",
    "clip2DStoryMotif": "broadcast-tv-studio",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE HIDDEN",
      "02 STAGE EPHEMERA",
      "03 STAGE ANOMALOU",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Studio Mixing Console",
      "targetAsset": "ON AIR Roof Signal Dish",
      "untouchedControl": "Backup Emergency Transmitter",
      "witness": "Master Control Broadcast Log"
    }
  },
  "npm-ua-parser-js-coa-rc-supply-chain": {
    "scenarioId": "npm-ua-parser-js-coa-rc-supply-chain",
    "filmTitle": "Factory Floor: Impact Package Hijack & DanaBot",
    "genre": "Factory Floor · Real-World Case",
    "settingLabel": "Automated Factory Floor & Assembly Conveyor",
    "realWorldPlace": "Factory Floor",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "factory-assembly-line",
    "heroKinetic": "factory-conveyor-robot-arm",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "factory-assembly-line",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE MAINTAIN",
      "02 STAGE AUTOMATI",
      "03 STAGE SILENT",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Assembly Conveyor Belt",
      "targetAsset": "Robotic Stamp Station",
      "untouchedControl": "Original Master Blueprint Cabinet",
      "witness": "Assembly Line Inspection Camera"
    }
  },
  "paloalto-expedition-cve-2024-5910-chain": {
    "scenarioId": "paloalto-expedition-cve-2024-5910-chain",
    "filmTitle": "Courthouse: 2024-5910) & Cron RCE Chain",
    "genre": "Courthouse · Real-World Case",
    "settingLabel": "City Courthouse Hall & Official Notary Seal Desk",
    "realWorldPlace": "Courthouse",
    "atmosphere": "obsidian-orbital-deck",
    "spatialSet": "courthouse-notary-hall",
    "heroKinetic": "courthouse-wax-seal-bench",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "courthouse-notary-hall",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE UNAUTHEN",
      "02 STAGE COMMAND",
      "03 STAGE DUMPING",
      "04 WIN EVENT"
    ],
    "castSummary": {
      "protagonist": "Courthouse Notary Desk",
      "targetAsset": "Judge Bench & Wax Seal",
      "untouchedControl": "Sealed Judicial Record Vault",
      "witness": "Court Bailiff Stamp Registry"
    }
  },
  "pikered-clr-profiler-trusted-binary-loader-chain": {
    "scenarioId": "pikered-clr-profiler-trusted-binary-loader-chain",
    "filmTitle": "Post Office: Abusing the .NET CLR Profiler:",
    "genre": "Post Office · Real-World Case",
    "settingLabel": "Neighborhood Post Office & Mail Sorting Hub",
    "realWorldPlace": "Post Office",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "post-office-sorting-hub",
    "heroKinetic": "post-office-parcel-chute",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "post-office-sorting-hub",
    "clip2DLayout": "conveyor-assembly-track",
    "phaseRibbon": [
      "01 STAGE VHDX",
      "02 STAGE PROCESS",
      "03 STAGE MSCOREE",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Post Office Sorting Counter",
      "targetAsset": "Brass P.O. Box Wall",
      "untouchedControl": "Registered Certified Mail Safe",
      "witness": "Postmaster Dispatch Ledger"
    }
  },
  "play-ransomware-grixba-vss-copy": {
    "scenarioId": "play-ransomware-grixba-vss-copy",
    "filmTitle": "Logistics Warehouse: 352A)",
    "genre": "Logistics Warehouse · Real-World Case",
    "settingLabel": "Logistics Warehouse & Forklift Loading Bay",
    "realWorldPlace": "Logistics Warehouse",
    "atmosphere": "azure-shinkai-day",
    "spatialSet": "warehouse-forklift-bay",
    "heroKinetic": "warehouse-pallet-forklift",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "warehouse-forklift-bay",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE DEPLOYIN",
      "02 STAGE ALPHAVSS",
      "03 STAGE WINPE",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Warehouse Pallet Racks",
      "targetAsset": "Yellow Forklift & Dock",
      "untouchedControl": "Quarantined Audit Cage",
      "witness": "Warehouse Barcode Inventory Log"
    }
  },
  "polyfill-io-cdn-domain-supply-chain": {
    "scenarioId": "polyfill-io-cdn-domain-supply-chain",
    "filmTitle": "Cinema Theater: 2024-38526)",
    "genre": "Cinema Theater · Real-World Case",
    "settingLabel": "Downtown Cinema Theater & Projection Stage",
    "realWorldPlace": "Cinema Theater",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "cinema-theater-stage",
    "heroKinetic": "cinema-velvet-stage-curtain",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16478597,
    "secondaryHex": 16498468,
    "clip2DTheme": "bunker-crimson",
    "clip2DStoryMotif": "cinema-theater-stage",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE UNPINNED",
      "02 STAGE HTTP",
      "03 STAGE FIRST-PA",
      "04 IDS ALERT"
    ],
    "castSummary": {
      "protagonist": "Cinema Ticket Booth",
      "targetAsset": "Velvet Stage & Projector",
      "untouchedControl": "Front Lobby Concession Counter",
      "witness": "Projection Booth Reel Log"
    }
  },
  "pypi-pytorch-torchtriton-dependency-confusion-supply-chain": {
    "scenarioId": "pypi-pytorch-torchtriton-dependency-confusion-supply-chain",
    "filmTitle": "Grand Hotel: PyTorch torchtriton Nightly Dependency Confusion",
    "genre": "Grand Hotel · Real-World Case",
    "settingLabel": "Grand Hotel Atrium & Concierge Desk",
    "realWorldPlace": "Grand Hotel",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "grand-hotel-lobby",
    "heroKinetic": "hotel-concierge-key-rack",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "grand-hotel-lobby",
    "clip2DLayout": "orbital-hub-spokes",
    "phaseRibbon": [
      "01 STAGE PUBLIC",
      "02 STAGE INIT",
      "03 STAGE AES-ENCR",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Hotel Concierge Desk",
      "targetAsset": "Brass Room-Key Rack",
      "untouchedControl": "Penthouse Private Safe",
      "witness": "Hotel Switchboard Call Log"
    }
  },
  "pypi-ultralytics-github-pwnrequest": {
    "scenarioId": "pypi-ultralytics-github-pwnrequest",
    "filmTitle": "Subway Metro: Ultralytics PyPI AI Package GitHub",
    "genre": "Subway Metro · Real-World Case",
    "settingLabel": "Underground Subway Metro & Fare Turnstiles",
    "realWorldPlace": "Subway Metro",
    "atmosphere": "golden-sunset-highway",
    "spatialSet": "subway-metro-station",
    "heroKinetic": "subway-metro-turnstile-car",
    "cameraStyle": "low-hero-right",
    "primaryHex": 3718648,
    "secondaryHex": 16007006,
    "clip2DTheme": "blueprint-cyan",
    "clip2DStoryMotif": "subway-metro-station",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE GITHUB",
      "02 STAGE POISONIN",
      "03 STAGE DOWNSTRE",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Metro Fare Turnstile",
      "targetAsset": "Underground Subway Car",
      "untouchedControl": "Emergency Exit Stairs",
      "witness": "Fare-Gate Audit Console"
    }
  },
  "qilin-agenda-rust-chrome-cred-harvester-esxi": {
    "scenarioId": "qilin-agenda-rust-chrome-cred-harvester-esxi",
    "filmTitle": "Apartment Lobby: Ops, Trend Micro & Group-IB",
    "genre": "Apartment Lobby · Real-World Case",
    "settingLabel": "Residential Apartment Lobby & Brass Intercom",
    "realWorldPlace": "Apartment Lobby",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "apartment-lobby-intercom",
    "heroKinetic": "apartment-intercom-buzzer",
    "cameraStyle": "elevated-isometric-crane",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "apartment-lobby-intercom",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE ACTIVE",
      "02 STAGE CREDENTI",
      "03 STAGE SIMULTAN",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Brass Intercom Buzzer",
      "targetAsset": "Apartment Lobby & Elevator",
      "untouchedControl": "Resident Locked Mailboxes",
      "witness": "Doorman Visitor Sign-In Book"
    }
  },
  "ransomhub-edrkiller-tdsskiller-golocks": {
    "scenarioId": "ransomhub-edrkiller-tdsskiller-golocks",
    "filmTitle": "Repair Garage: 242A, Symantec & Mandiant —",
    "genre": "Repair Garage · Real-World Case",
    "settingLabel": "Auto Repair Garage & Hydraulic Car Lift",
    "realWorldPlace": "Repair Garage",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "car-repair-garage",
    "heroKinetic": "garage-hydraulic-car-lift",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "car-repair-garage",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE SIGNED",
      "02 STAGE SAFE-MOD",
      "03 STAGE SHA-256",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Garage Service Bay",
      "targetAsset": "Hydraulic Car Lift & Sedan",
      "untouchedControl": "Factory Sealed Spare-Parts Rack",
      "witness": "Garage Service Checklist Board"
    }
  },
  "rhysida-ransomware-zerologon-ps-silentskill": {
    "scenarioId": "rhysida-ransomware-zerologon-ps-silentskill",
    "filmTitle": "Shipping Port: CTR",
    "genre": "Shipping Port · Real-World Case",
    "settingLabel": "Coastal Shipping Port & Container Pier",
    "realWorldPlace": "Shipping Port",
    "atmosphere": "storm-telecom-rooftop",
    "spatialSet": "shipping-port-container-yard",
    "heroKinetic": "harbor-gantry-cargo-ship",
    "cameraStyle": "establishing-high-left",
    "primaryHex": 3003583,
    "secondaryHex": 16486972,
    "clip2DTheme": "harbor-teal",
    "clip2DStoryMotif": "shipping-port-container-yard",
    "clip2DLayout": "vault-cutaway-blueprint",
    "phaseRibbon": [
      "01 STAGE PORTSTAR",
      "02 STAGE SILENTKI",
      "03 STAGE MULTI-TH",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Harbor Gantry Crane",
      "targetAsset": "Stacked Cargo Containers",
      "untouchedControl": "Sealed Bonded Export Yard",
      "witness": "Port Authority Manifest Watch"
    }
  },
  "royal-blacksuit-ransomware-chacha20-restartmanager": {
    "scenarioId": "royal-blacksuit-ransomware-chacha20-restartmanager",
    "filmTitle": "Art Museum: 061A / AA24-219A & Unit",
    "genre": "Art Museum · Real-World Case",
    "settingLabel": "National Art Museum Gallery & Glass Pedestals",
    "realWorldPlace": "Art Museum",
    "atmosphere": "amber-industrial-foundry",
    "spatialSet": "museum-gallery-hall",
    "heroKinetic": "museum-laser-glass-pedestal",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16498468,
    "secondaryHex": 16478597,
    "clip2DTheme": "grand-hotel-brass",
    "clip2DStoryMotif": "museum-gallery-hall",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE CALLBACK",
      "02 STAGE VSSADMIN",
      "03 STAGE OPENSSL",
      "04 SYSMON"
    ],
    "castSummary": {
      "protagonist": "Velvet Rope Gallery",
      "targetAsset": "Laser Glass Pedestal",
      "untouchedControl": "Permanent Restoration Wing",
      "witness": "Gallery Motion-Sensor Console"
    }
  },
  "rspack-solana-web3js-npm-supply-chain-2024": {
    "scenarioId": "rspack-solana-web3js-npm-supply-chain-2024",
    "filmTitle": "Train Station: @solana/web3.js & @rspack/core NPM Maintainer",
    "genre": "Train Station · Real-World Case",
    "settingLabel": "Central Train Station & Express Platform",
    "realWorldPlace": "Train Station",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "train-station-platform",
    "heroKinetic": "express-station-locomotive",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "train-station-platform",
    "clip2DLayout": "split-mirror-comparison",
    "phaseRibbon": [
      "01 STAGE NPM",
      "02 STAGE ADDTOQUE",
      "03 STAGE DISGUISE",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Station Platform & Gate",
      "targetAsset": "Express Passenger Train",
      "untouchedControl": "Eastbound Local Track",
      "witness": "Station Master Signal Board"
    }
  },
  "sentinelone-terminator-zemana-byovd": {
    "scenarioId": "sentinelone-terminator-zemana-byovd",
    "filmTitle": "Hospital Ward: 2021-31728)",
    "genre": "Hospital Ward · Real-World Case",
    "settingLabel": "City Hospital Triage Desk & Patient Ward",
    "realWorldPlace": "Hospital Ward",
    "atmosphere": "alpine-substation-crisp",
    "spatialSet": "hospital-triage-ward",
    "heroKinetic": "hospital-triage-med-cart",
    "cameraStyle": "low-hero-right",
    "primaryHex": 2282478,
    "secondaryHex": 16478597,
    "clip2DTheme": "xray-cleanroom",
    "clip2DStoryMotif": "hospital-triage-ward",
    "clip2DLayout": "horizontal-pipeline",
    "phaseRibbon": [
      "01 STAGE DROPPING",
      "02 STAGE SELF-ALL",
      "03 STAGE CONTINUO",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Hospital Triage Desk",
      "targetAsset": "Rolling Medicine Cart",
      "untouchedControl": "Sealed Clean-Supply Closet",
      "witness": "Nurse Station Chart Audit"
    }
  },
  "sonicwall-sslvpn-cve-2024-40766-akira": {
    "scenarioId": "sonicwall-sslvpn-cve-2024-40766-akira",
    "filmTitle": "City Street: 2024-40766)",
    "genre": "City Street · Real-World Case",
    "settingLabel": "Downtown City Street Corner & Traffic Lights",
    "realWorldPlace": "City Street",
    "atmosphere": "warm-brass-grand-hotel",
    "spatialSet": "city-street-intersection",
    "heroKinetic": "street-traffic-light-taxi",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 16486972,
    "secondaryHex": 3718648,
    "clip2DTheme": "sunset-highway-coral",
    "clip2DStoryMotif": "city-street-intersection",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE SONICOS",
      "02 STAGE NETWORK",
      "03 STAGE POWERSHE",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Street Corner Traffic Light",
      "targetAsset": "Crosswalk & City Taxi",
      "untouchedControl": "Neighboring Sidewalk Cafe",
      "witness": "Intersection Traffic Camera"
    }
  },
  "sophos-firewall-cve-2022-3236-asnarok": {
    "scenarioId": "sophos-firewall-cve-2022-3236-asnarok",
    "filmTitle": "Bank Branch: 2022-3236 / DriftingCloud)",
    "genre": "Bank Branch · Real-World Case",
    "settingLabel": "Downtown Bank Branch & Steel Vault",
    "realWorldPlace": "Bank Branch",
    "atmosphere": "obsidian-orbital-deck",
    "spatialSet": "bank-branch-vault",
    "heroKinetic": "bank-vault-wheel-door",
    "cameraStyle": "low-hero-right",
    "primaryHex": 16096779,
    "secondaryHex": 3718648,
    "clip2DTheme": "cathedral-sepia-gold",
    "clip2DStoryMotif": "bank-branch-vault",
    "clip2DLayout": "vertical-shaft-cascade",
    "phaseRibbon": [
      "01 STAGE CRAFTED",
      "02 STAGE CYBEROAM",
      "03 STAGE TROJANIZ",
      "04 MEMORY SCAN"
    ],
    "castSummary": {
      "protagonist": "Bank Teller Counter",
      "targetAsset": "Steel Bank Vault",
      "untouchedControl": "Sealed Safe-Deposit Wall",
      "witness": "Branch Vault Camera & Ledger"
    }
  },
  "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics": {
    "scenarioId": "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics",
    "filmTitle": "City Park: Telecom GPRS Tunneling Protocol &",
    "genre": "City Park · Real-World Case",
    "settingLabel": "City Park Plaza & Central Stone Fountain",
    "realWorldPlace": "City Park",
    "atmosphere": "velvet-midnight-vault",
    "spatialSet": "city-park-fountain",
    "heroKinetic": "park-water-fountain-bench",
    "cameraStyle": "intimate-cutaway-dolly",
    "primaryHex": 3462041,
    "secondaryHex": 16478597,
    "clip2DTheme": "biolab-emerald",
    "clip2DStoryMotif": "city-park-fountain",
    "clip2DLayout": "diagonal-escalation-bridge",
    "phaseRibbon": [
      "01 STAGE ROGUE",
      "02 STAGE ENCAPSUL",
      "03 STAGE CUSTOM",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Park Bench & Footpath",
      "targetAsset": "Central Stone Fountain",
      "untouchedControl": "Quiet Botanical Greenhouse",
      "witness": "Park Kiosk Patrol Log"
    }
  },
  "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit": {
    "scenarioId": "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit",
    "filmTitle": "Power Substation: Versa Director SD-WAN Port 4566",
    "genre": "Power Substation · Real-World Case",
    "settingLabel": "Municipal Power Substation & Waterworks Yard",
    "realWorldPlace": "Power Substation",
    "atmosphere": "desert-satellite-dusk",
    "spatialSet": "power-substation-waterworks",
    "heroKinetic": "substation-breaker-valve",
    "cameraStyle": "symmetric-cathedral-axis",
    "primaryHex": 8246268,
    "secondaryHex": 16347926,
    "clip2DTheme": "alpine-grid-ice",
    "clip2DStoryMotif": "power-substation-waterworks",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE PORT",
      "02 STAGE JVM",
      "03 STAGE ON-DISK",
      "04 LINUX AUDIT"
    ],
    "castSummary": {
      "protagonist": "Substation Breaker Yard",
      "targetAsset": "Pipe Valve & Control Room",
      "untouchedControl": "Isolated Backup Generator Bay",
      "witness": "Control Room Gauge Recorder"
    }
  },
  "vulncheck-cwp-preauth-module-dispatch-rce": {
    "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
    "filmTitle": "Restaurant Kitchen: Control Web Panel Pre-Auth Module",
    "genre": "Restaurant Kitchen · Real-World Case",
    "settingLabel": "Busy Restaurant Kitchen & Drive-Thru Window",
    "realWorldPlace": "Restaurant Kitchen",
    "atmosphere": "clinical-xray-cleanroom",
    "spatialSet": "restaurant-kitchen-drivethru",
    "heroKinetic": "restaurant-kitchen-order-rail",
    "cameraStyle": "dramatic-diagonal-sweep",
    "primaryHex": 16096779,
    "secondaryHex": 15680580,
    "clip2DTheme": "foundry-amber",
    "clip2DStoryMotif": "restaurant-kitchen-drivethru",
    "clip2DLayout": "radial-broadcast-fan",
    "phaseRibbon": [
      "01 STAGE ACCOUNT",
      "02 STAGE PRE-AUTH",
      "03 STAGE LOOPBACK",
      "04 NETWORK"
    ],
    "castSummary": {
      "protagonist": "Drive-Thru Order Window",
      "targetAsset": "Kitchen Ticket Rail",
      "untouchedControl": "Sealed Pantry Cold Room",
      "witness": "Kitchen POS Receipt Printer"
    }
  }
};

export function getScenarioCinemaProfile(scenarioId: string): ScenarioCinemaProfile {
  return (
    SCENARIO_CINEMA_PROFILES[scenarioId] ??
    SCENARIO_CINEMA_PROFILES['process-hollowing']
  );
}
