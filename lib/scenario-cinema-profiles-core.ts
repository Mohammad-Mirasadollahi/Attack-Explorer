/**
 * Core Real-World Cinema Direction Catalog for 3D Three.js Worlds & 2D SVG+GSAP Technical Clips.
 * Zero React / Three.js runtime imports so client renderers, server docs, and node:test suites
 * share one lightweight, deterministic single source of truth across 28 everyday real-world places.
 */

export type CinemaAtmosphereId =
  | 'azure-shinkai-day'
  | 'golden-sunset-highway'
  | 'neon-rain-cyberpunk'
  | 'emerald-harbor-mist'
  | 'crimson-bunker-alert'
  | 'warm-brass-grand-hotel'
  | 'alpine-substation-crisp'
  | 'obsidian-orbital-deck'
  | 'amber-industrial-foundry'
  | 'clinical-xray-cleanroom'
  | 'desert-satellite-dusk'
  | 'velvet-midnight-vault'
  | 'storm-telecom-rooftop'
  | 'copper-archive-cathedral'
  | 'toxic-biolab-green'
  | 'arctic-datacenter-cobalt'
  | 'sunrise-logistics-port'
  | 'violet-neural-core';

/**
 * 28 recognizable everyday real-world architectural environments built literally in 3D Three.js
 * and mirrored 1-to-1 in 2D SVG+GSAP illustrations and plain-language scenario stories.
 */
export type SpatialSetArchetype =
  | 'bank-branch-vault'
  | 'office-building-reception'
  | 'airport-terminal-gate'
  | 'supermarket-retail-store'
  | 'city-park-fountain'
  | 'city-highway-toll-plaza'
  | 'city-street-intersection'
  | 'train-station-platform'
  | 'subway-metro-station'
  | 'hospital-triage-ward'
  | 'post-office-sorting-hub'
  | 'grand-hotel-lobby'
  | 'shipping-port-container-yard'
  | 'factory-assembly-line'
  | 'public-library-archive'
  | 'restaurant-kitchen-drivethru'
  | 'cinema-theater-stage'
  | 'museum-gallery-hall'
  | 'courthouse-notary-hall'
  | 'coffee-shop-cafe'
  | 'car-repair-garage'
  | 'university-exam-hall'
  | 'apartment-lobby-intercom'
  | 'border-passport-control'
  | 'broadcast-tv-studio'
  | 'power-substation-waterworks'
  | 'pharmacy-prescription-lab'
  | 'warehouse-forklift-bay';

/**
 * 28 real-world animated 3D hero props/vehicles/mechanisms matched 1-to-1 to the 28 places.
 */
export type HeroKineticMechanism =
  | 'bank-vault-wheel-door'
  | 'office-reception-turnstile'
  | 'commercial-passenger-airplane'
  | 'supermarket-checkout-cart'
  | 'park-water-fountain-bench'
  | 'highway-toll-barrier-sedan'
  | 'street-traffic-light-taxi'
  | 'express-station-locomotive'
  | 'subway-metro-turnstile-car'
  | 'hospital-triage-med-cart'
  | 'post-office-parcel-chute'
  | 'hotel-concierge-key-rack'
  | 'harbor-gantry-cargo-ship'
  | 'factory-conveyor-robot-arm'
  | 'library-rare-book-cage'
  | 'restaurant-kitchen-order-rail'
  | 'cinema-velvet-stage-curtain'
  | 'museum-laser-glass-pedestal'
  | 'courthouse-wax-seal-bench'
  | 'cafe-espresso-bar-machine'
  | 'garage-hydraulic-car-lift'
  | 'university-proctor-podium'
  | 'apartment-intercom-buzzer'
  | 'border-passport-xray-gate'
  | 'broadcast-studio-signal-dish'
  | 'substation-breaker-valve'
  | 'pharmacy-prescription-carousel'
  | 'warehouse-pallet-forklift';

export type CameraCompositionStyle =
  | 'establishing-high-left'
  | 'low-hero-right'
  | 'dramatic-diagonal-sweep'
  | 'elevated-isometric-crane'
  | 'symmetric-cathedral-axis'
  | 'intimate-cutaway-dolly';

export type Clip2DCinemaTheme =
  | 'blueprint-cyan'
  | 'foundry-amber'
  | 'grand-hotel-brass'
  | 'harbor-teal'
  | 'orbital-indigo'
  | 'bunker-crimson'
  | 'xray-cleanroom'
  | 'neural-violet'
  | 'alpine-grid-ice'
  | 'telecom-rf-magenta'
  | 'cathedral-sepia-gold'
  | 'biolab-emerald'
  | 'sunset-highway-coral'
  | 'desert-dish-terracotta';

/**
 * 28 real-world animated 2D architectural story illustrations matched 1-to-1 to the 28 places
 * (plus 'memory-xray-microscope' reserved for side-by-side Memory Forensics clips).
 */
export type Clip2DStoryMotif =
  | SpatialSetArchetype
  | 'memory-xray-microscope';

export type Clip2DLayoutGeometry =
  | 'horizontal-pipeline'
  | 'vertical-shaft-cascade'
  | 'orbital-hub-spokes'
  | 'diagonal-escalation-bridge'
  | 'split-mirror-comparison'
  | 'conveyor-assembly-track'
  | 'radial-broadcast-fan'
  | 'vault-cutaway-blueprint';

export interface RealWorldEnvironmentSpec {
  id: SpatialSetArchetype;
  placeName: string;
  shortPlace: string;
  heroKinetic: HeroKineticMechanism;
  clip2DMotif: SpatialSetArchetype;
  preferredAtmospheres: CinemaAtmosphereId[];
  preferred2DThemes: Clip2DCinemaTheme[];
  cameraLabels: [string, string, string];
  storyKeywords: string[];
  defaultProtagonistRole: string;
  defaultStaffRole: string;
  defaultTargetLandmark: string;
  defaultCheckpointLandmark: string;
  defaultUntouchedLandmark: string;
  defaultWitnessLandmark: string;
}

export const REAL_WORLD_ENVIRONMENTS: Record<
  SpatialSetArchetype,
  RealWorldEnvironmentSpec
> = {
  'bank-branch-vault': {
    id: 'bank-branch-vault',
    placeName: 'Downtown Bank Branch & Steel Vault',
    shortPlace: 'Bank Branch',
    heroKinetic: 'bank-vault-wheel-door',
    clip2DMotif: 'bank-branch-vault',
    preferredAtmospheres: ['warm-brass-grand-hotel', 'velvet-midnight-vault', 'azure-shinkai-day', 'copper-archive-cathedral'],
    preferred2DThemes: ['cathedral-sepia-gold', 'grand-hotel-brass', 'blueprint-cyan'],
    cameraLabels: ['Teller Counter', 'Steel Vault', 'Audit Camera'],
    storyKeywords: ['bank', 'vault', 'teller'],
    defaultProtagonistRole: 'Visitor in a Borrowed Uniform',
    defaultStaffRole: 'Bank Teller',
    defaultTargetLandmark: 'Circular Steel Bank Vault',
    defaultCheckpointLandmark: 'Brass Teller Window',
    defaultUntouchedLandmark: 'Sealed Safe-Deposit Wall',
    defaultWitnessLandmark: 'Branch Vault Camera & Ledger',
  },
  'office-building-reception': {
    id: 'office-building-reception',
    placeName: 'Glass Office Building & Front Reception',
    shortPlace: 'Office Building',
    heroKinetic: 'office-reception-turnstile',
    clip2DMotif: 'office-building-reception',
    preferredAtmospheres: ['azure-shinkai-day', 'clinical-xray-cleanroom', 'arctic-datacenter-cobalt', 'warm-brass-grand-hotel'],
    preferred2DThemes: ['blueprint-cyan', 'xray-cleanroom', 'orbital-indigo'],
    cameraLabels: ['Reception Desk', 'Glass Offices', 'Badge Gate'],
    storyKeywords: ['office', 'receptionist', 'meeting room'],
    defaultProtagonistRole: 'Unbadged Office Visitor',
    defaultStaffRole: 'Front-Desk Receptionist',
    defaultTargetLandmark: 'Executive Glass Meeting Room',
    defaultCheckpointLandmark: 'Lobby Badge Turnstile',
    defaultUntouchedLandmark: 'Public Lobby Waiting Area',
    defaultWitnessLandmark: 'Reception Sign-In Logbook',
  },
  'airport-terminal-gate': {
    id: 'airport-terminal-gate',
    placeName: 'International Airport Terminal & Boarding Gate',
    shortPlace: 'Airport Terminal',
    heroKinetic: 'commercial-passenger-airplane',
    clip2DMotif: 'airport-terminal-gate',
    preferredAtmospheres: ['azure-shinkai-day', 'golden-sunset-highway', 'sunrise-logistics-port', 'alpine-substation-crisp'],
    preferred2DThemes: ['blueprint-cyan', 'sunset-highway-coral', 'alpine-grid-ice'],
    cameraLabels: ['Security Gate', 'Boarding Jet', 'Control Tower'],
    storyKeywords: ['airport', 'airplane', 'boarding gate'],
    defaultProtagonistRole: 'Disguised Passenger',
    defaultStaffRole: 'Gate Agent',
    defaultTargetLandmark: 'Parked Passenger Airplane',
    defaultCheckpointLandmark: 'Airport Security Scanner Arch',
    defaultUntouchedLandmark: 'Public Departures Concourse',
    defaultWitnessLandmark: 'Boarding Pass Scanner & Tower Log',
  },
  'supermarket-retail-store': {
    id: 'supermarket-retail-store',
    placeName: 'Neighborhood Supermarket & Checkout Lanes',
    shortPlace: 'Supermarket',
    heroKinetic: 'supermarket-checkout-cart',
    clip2DMotif: 'supermarket-retail-store',
    preferredAtmospheres: ['azure-shinkai-day', 'sunrise-logistics-port', 'warm-brass-grand-hotel', 'clinical-xray-cleanroom'],
    preferred2DThemes: ['sunset-highway-coral', 'biolab-emerald', 'blueprint-cyan'],
    cameraLabels: ['Stocked Aisles', 'Checkout Belt', 'Store Office'],
    storyKeywords: ['supermarket', 'checkout', 'shopping cart'],
    defaultProtagonistRole: 'Shopper With a Swapped Barcode',
    defaultStaffRole: 'Checkout Cashier',
    defaultTargetLandmark: 'Supermarket Checkout Register',
    defaultCheckpointLandmark: 'Barcode Price Scanner',
    defaultUntouchedLandmark: 'Locked Stockroom Back Door',
    defaultWitnessLandmark: 'Receipt Tape & Aisle Camera',
  },
  'city-park-fountain': {
    id: 'city-park-fountain',
    placeName: 'City Park Plaza & Central Stone Fountain',
    shortPlace: 'City Park',
    heroKinetic: 'park-water-fountain-bench',
    clip2DMotif: 'city-park-fountain',
    preferredAtmospheres: ['azure-shinkai-day', 'emerald-harbor-mist', 'golden-sunset-highway', 'sunrise-logistics-port'],
    preferred2DThemes: ['biolab-emerald', 'harbor-teal', 'sunset-highway-coral'],
    cameraLabels: ['Park Path', 'Stone Fountain', 'Ranger Kiosk'],
    storyKeywords: ['park', 'fountain', 'bench'],
    defaultProtagonistRole: 'Bench Courier Leaving a Note',
    defaultStaffRole: 'Park Ranger',
    defaultTargetLandmark: 'Central Park Stone Fountain',
    defaultCheckpointLandmark: 'Park Gate Footpath',
    defaultUntouchedLandmark: 'Quiet Botanical Greenhouse',
    defaultWitnessLandmark: 'Park Kiosk Patrol Log',
  },
  'city-highway-toll-plaza': {
    id: 'city-highway-toll-plaza',
    placeName: 'Multi-Lane City Highway & Toll Plaza',
    shortPlace: 'Highway Toll Plaza',
    heroKinetic: 'highway-toll-barrier-sedan',
    clip2DMotif: 'city-highway-toll-plaza',
    preferredAtmospheres: ['golden-sunset-highway', 'azure-shinkai-day', 'desert-satellite-dusk', 'sunrise-logistics-port'],
    preferred2DThemes: ['sunset-highway-coral', 'foundry-amber', 'blueprint-cyan'],
    cameraLabels: ['Express Lane', 'Toll Barrier', 'Plate Camera'],
    storyKeywords: ['highway', 'toll', 'lane'],
    defaultProtagonistRole: 'Driver With a Cloned Toll Pass',
    defaultStaffRole: 'Toll Booth Attendant',
    defaultTargetLandmark: 'Express Highway Toll Barrier',
    defaultCheckpointLandmark: 'Overhead License-Plate Gantry',
    defaultUntouchedLandmark: 'Local Side-Road Ramp',
    defaultWitnessLandmark: 'Highway Toll Camera Log',
  },
  'city-street-intersection': {
    id: 'city-street-intersection',
    placeName: 'Downtown City Street Corner & Traffic Lights',
    shortPlace: 'City Street',
    heroKinetic: 'street-traffic-light-taxi',
    clip2DMotif: 'city-street-intersection',
    preferredAtmospheres: ['neon-rain-cyberpunk', 'golden-sunset-highway', 'azure-shinkai-day', 'storm-telecom-rooftop'],
    preferred2DThemes: ['sunset-highway-coral', 'telecom-rf-magenta', 'blueprint-cyan'],
    cameraLabels: ['Crosswalk', 'Traffic Signal', 'Corner Shop'],
    storyKeywords: ['street', 'traffic light', 'crosswalk'],
    defaultProtagonistRole: 'Pedestrian Tampering With the Signal Box',
    defaultStaffRole: 'Traffic Officer',
    defaultTargetLandmark: 'Street-Corner Traffic Signal Box',
    defaultCheckpointLandmark: 'Marked Pedestrian Crosswalk',
    defaultUntouchedLandmark: 'Neighboring Sidewalk Cafe',
    defaultWitnessLandmark: 'Intersection Traffic Camera',
  },
  'train-station-platform': {
    id: 'train-station-platform',
    placeName: 'Central Train Station & Express Platform',
    shortPlace: 'Train Station',
    heroKinetic: 'express-station-locomotive',
    clip2DMotif: 'train-station-platform',
    preferredAtmospheres: ['golden-sunset-highway', 'warm-brass-grand-hotel', 'copper-archive-cathedral', 'sunrise-logistics-port'],
    preferred2DThemes: ['foundry-amber', 'cathedral-sepia-gold', 'sunset-highway-coral'],
    cameraLabels: ['Ticket Gate', 'Express Train', 'Signal Box'],
    storyKeywords: ['train', 'station', 'platform'],
    defaultProtagonistRole: 'Stowaway Switching Track Levers',
    defaultStaffRole: 'Station Conductor',
    defaultTargetLandmark: 'Express Passenger Train',
    defaultCheckpointLandmark: 'Platform Ticket Barrier',
    defaultUntouchedLandmark: 'Eastbound Local Track',
    defaultWitnessLandmark: 'Station Master Signal Board',
  },
  'subway-metro-station': {
    id: 'subway-metro-station',
    placeName: 'Underground Subway Metro & Fare Turnstiles',
    shortPlace: 'Subway Metro',
    heroKinetic: 'subway-metro-turnstile-car',
    clip2DMotif: 'subway-metro-station',
    preferredAtmospheres: ['neon-rain-cyberpunk', 'velvet-midnight-vault', 'arctic-datacenter-cobalt', 'obsidian-orbital-deck'],
    preferred2DThemes: ['orbital-indigo', 'blueprint-cyan', 'telecom-rf-magenta'],
    cameraLabels: ['Fare Turnstile', 'Subway Car', 'Booth Monitor'],
    storyKeywords: ['subway', 'metro', 'turnstile'],
    defaultProtagonistRole: 'Rider Using a Replayed Fare Card',
    defaultStaffRole: 'Metro Station Agent',
    defaultTargetLandmark: 'Underground Subway Train Car',
    defaultCheckpointLandmark: 'Metro Card Turnstile Bank',
    defaultUntouchedLandmark: 'Emergency Exit Stairs',
    defaultWitnessLandmark: 'Fare-Gate Audit Console',
  },
  'hospital-triage-ward': {
    id: 'hospital-triage-ward',
    placeName: 'City Hospital Triage Desk & Patient Ward',
    shortPlace: 'Hospital Ward',
    heroKinetic: 'hospital-triage-med-cart',
    clip2DMotif: 'hospital-triage-ward',
    preferredAtmospheres: ['clinical-xray-cleanroom', 'azure-shinkai-day', 'emerald-harbor-mist', 'alpine-substation-crisp'],
    preferred2DThemes: ['xray-cleanroom', 'biolab-emerald', 'blueprint-cyan'],
    cameraLabels: ['Triage Desk', 'Medicine Cart', 'Nurse Station'],
    storyKeywords: ['hospital', 'triage', 'ward'],
    defaultProtagonistRole: 'Intruder in a Borrowed Lab Coat',
    defaultStaffRole: 'Triage Nurse',
    defaultTargetLandmark: 'Patient Chart & Medicine Cart',
    defaultCheckpointLandmark: 'Hospital Triage Check-In Desk',
    defaultUntouchedLandmark: 'Sealed Clean-Supply Closet',
    defaultWitnessLandmark: 'Nurse Station Chart Audit',
  },
  'post-office-sorting-hub': {
    id: 'post-office-sorting-hub',
    placeName: 'Neighborhood Post Office & Mail Sorting Hub',
    shortPlace: 'Post Office',
    heroKinetic: 'post-office-parcel-chute',
    clip2DMotif: 'post-office-sorting-hub',
    preferredAtmospheres: ['warm-brass-grand-hotel', 'copper-archive-cathedral', 'golden-sunset-highway', 'azure-shinkai-day'],
    preferred2DThemes: ['cathedral-sepia-gold', 'sunset-highway-coral', 'blueprint-cyan'],
    cameraLabels: ['Mail Counter', 'Sorting Chute', 'P.O. Box Wall'],
    storyKeywords: ['post office', 'mailbox', 'parcel'],
    defaultProtagonistRole: 'Sender Hiding Messages on Postcards',
    defaultStaffRole: 'Postal Clerk',
    defaultTargetLandmark: 'Brass P.O. Box Sorting Wall',
    defaultCheckpointLandmark: 'Postal Scale & Stamp Window',
    defaultUntouchedLandmark: 'Registered Certified Mail Safe',
    defaultWitnessLandmark: 'Postmaster Dispatch Ledger',
  },
  'grand-hotel-lobby': {
    id: 'grand-hotel-lobby',
    placeName: 'Grand Hotel Atrium & Concierge Desk',
    shortPlace: 'Grand Hotel',
    heroKinetic: 'hotel-concierge-key-rack',
    clip2DMotif: 'grand-hotel-lobby',
    preferredAtmospheres: ['warm-brass-grand-hotel', 'velvet-midnight-vault', 'copper-archive-cathedral', 'golden-sunset-highway'],
    preferred2DThemes: ['grand-hotel-brass', 'cathedral-sepia-gold', 'sunset-highway-coral'],
    cameraLabels: ['Concierge Desk', 'Room Key Rack', 'Lobby Elevator'],
    storyKeywords: ['hotel', 'concierge', 'guestbook'],
    defaultProtagonistRole: 'Guest Slipping a Trick Note Into the Ledger',
    defaultStaffRole: 'Hotel Concierge',
    defaultTargetLandmark: 'Brass Room-Key Rack & Elevator',
    defaultCheckpointLandmark: 'Front-Desk Guestbook Counter',
    defaultUntouchedLandmark: 'Penthouse Private Safe',
    defaultWitnessLandmark: 'Hotel Switchboard Call Log',
  },
  'shipping-port-container-yard': {
    id: 'shipping-port-container-yard',
    placeName: 'Coastal Shipping Port & Container Pier',
    shortPlace: 'Shipping Port',
    heroKinetic: 'harbor-gantry-cargo-ship',
    clip2DMotif: 'shipping-port-container-yard',
    preferredAtmospheres: ['emerald-harbor-mist', 'sunrise-logistics-port', 'azure-shinkai-day', 'arctic-datacenter-cobalt'],
    preferred2DThemes: ['harbor-teal', 'sunset-highway-coral', 'blueprint-cyan'],
    cameraLabels: ['Cargo Pier', 'Gantry Crane', 'Customs Cabin'],
    storyKeywords: ['shipping port', 'harbor', 'container'],
    defaultProtagonistRole: 'Dockworker Opening an Unlatched Crate',
    defaultStaffRole: 'Harbor Customs Inspector',
    defaultTargetLandmark: 'Stacked Cargo Containers & Ship',
    defaultCheckpointLandmark: 'Harbor Crane Inspection Pier',
    defaultUntouchedLandmark: 'Sealed Bonded Export Yard',
    defaultWitnessLandmark: 'Port Authority Manifest Watch',
  },
  'factory-assembly-line': {
    id: 'factory-assembly-line',
    placeName: 'Automated Factory Floor & Assembly Conveyor',
    shortPlace: 'Factory Floor',
    heroKinetic: 'factory-conveyor-robot-arm',
    clip2DMotif: 'factory-assembly-line',
    preferredAtmospheres: ['amber-industrial-foundry', 'sunrise-logistics-port', 'crimson-bunker-alert', 'copper-archive-cathedral'],
    preferred2DThemes: ['foundry-amber', 'sunset-highway-coral', 'bunker-crimson'],
    cameraLabels: ['Intake Hopper', 'Conveyor Belt', 'Quality Desk'],
    storyKeywords: ['factory', 'assembly line', 'conveyor'],
    defaultProtagonistRole: 'Night-Shift Saboteur Swapping Parts',
    defaultStaffRole: 'Factory Quality Inspector',
    defaultTargetLandmark: 'Moving Assembly Conveyor Belt',
    defaultCheckpointLandmark: 'Factory Quality Stamp Station',
    defaultUntouchedLandmark: 'Original Master Blueprint Cabinet',
    defaultWitnessLandmark: 'Assembly Line Inspection Camera',
  },
  'public-library-archive': {
    id: 'public-library-archive',
    placeName: 'City Public Library & Rare-Book Reading Hall',
    shortPlace: 'Public Library',
    heroKinetic: 'library-rare-book-cage',
    clip2DMotif: 'public-library-archive',
    preferredAtmospheres: ['copper-archive-cathedral', 'warm-brass-grand-hotel', 'velvet-midnight-vault', 'azure-shinkai-day'],
    preferred2DThemes: ['cathedral-sepia-gold', 'grand-hotel-brass', 'orbital-indigo'],
    cameraLabels: ['Card Catalog', 'Bookshelves', 'Rare-Book Room'],
    storyKeywords: ['library', 'bookshelf', 'librarian'],
    defaultProtagonistRole: 'Reader Slipping a Forged Card Into the Catalog',
    defaultStaffRole: 'Head Librarian',
    defaultTargetLandmark: 'Locked Rare-Book Archive Cage',
    defaultCheckpointLandmark: 'Library Check-Out Desk',
    defaultUntouchedLandmark: 'General Fiction Reading Tables',
    defaultWitnessLandmark: 'Library Circulation Audit Ledger',
  },
  'restaurant-kitchen-drivethru': {
    id: 'restaurant-kitchen-drivethru',
    placeName: 'Busy Restaurant Kitchen & Drive-Thru Window',
    shortPlace: 'Restaurant Kitchen',
    heroKinetic: 'restaurant-kitchen-order-rail',
    clip2DMotif: 'restaurant-kitchen-drivethru',
    preferredAtmospheres: ['warm-brass-grand-hotel', 'amber-industrial-foundry', 'golden-sunset-highway', 'sunrise-logistics-port'],
    preferred2DThemes: ['foundry-amber', 'sunset-highway-coral', 'grand-hotel-brass'],
    cameraLabels: ['Order Window', 'Ticket Rail', 'Manager Desk'],
    storyKeywords: ['restaurant', 'kitchen', 'order ticket'],
    defaultProtagonistRole: 'Customer Slipping Extra Instructions on a Ticket',
    defaultStaffRole: 'Line Chef',
    defaultTargetLandmark: 'Kitchen Order Ticket Rail',
    defaultCheckpointLandmark: 'Drive-Thru Order Window',
    defaultUntouchedLandmark: 'Sealed Pantry Cold Room',
    defaultWitnessLandmark: 'Kitchen POS Receipt Printer',
  },
  'cinema-theater-stage': {
    id: 'cinema-theater-stage',
    placeName: 'Downtown Cinema Theater & Projection Stage',
    shortPlace: 'Cinema Theater',
    heroKinetic: 'cinema-velvet-stage-curtain',
    clip2DMotif: 'cinema-theater-stage',
    preferredAtmospheres: ['crimson-bunker-alert', 'velvet-midnight-vault', 'warm-brass-grand-hotel', 'neon-rain-cyberpunk'],
    preferred2DThemes: ['bunker-crimson', 'grand-hotel-brass', 'neural-violet'],
    cameraLabels: ['Ticket Booth', 'Velvet Stage', 'Projector Room'],
    storyKeywords: ['cinema', 'theater', 'stage'],
    defaultProtagonistRole: 'Backstage Impostor Swapping Film Reels',
    defaultStaffRole: 'Theater Usher',
    defaultTargetLandmark: 'Velvet Curtain Stage & Projector',
    defaultCheckpointLandmark: 'Red-Carpet Ticket Booth',
    defaultUntouchedLandmark: 'Front Lobby Concession Counter',
    defaultWitnessLandmark: 'Projection Booth Reel Log',
  },
  'museum-gallery-hall': {
    id: 'museum-gallery-hall',
    placeName: 'National Art Museum Gallery & Glass Pedestals',
    shortPlace: 'Art Museum',
    heroKinetic: 'museum-laser-glass-pedestal',
    clip2DMotif: 'museum-gallery-hall',
    preferredAtmospheres: ['velvet-midnight-vault', 'clinical-xray-cleanroom', 'warm-brass-grand-hotel', 'obsidian-orbital-deck'],
    preferred2DThemes: ['grand-hotel-brass', 'xray-cleanroom', 'orbital-indigo'],
    cameraLabels: ['Gallery Hall', 'Glass Pedestal', 'Guard Desk'],
    storyKeywords: ['museum', 'gallery', 'pedestal'],
    defaultProtagonistRole: 'Art Thief Swapping a Replica Frame',
    defaultStaffRole: 'Museum Curator',
    defaultTargetLandmark: 'Laser-Guarded Glass Display Case',
    defaultCheckpointLandmark: 'Velvet Rope Gallery Entrance',
    defaultUntouchedLandmark: 'Permanent Restoration Wing',
    defaultWitnessLandmark: 'Gallery Motion-Sensor Console',
  },
  'courthouse-notary-hall': {
    id: 'courthouse-notary-hall',
    placeName: 'City Courthouse Hall & Official Notary Seal Desk',
    shortPlace: 'Courthouse',
    heroKinetic: 'courthouse-wax-seal-bench',
    clip2DMotif: 'courthouse-notary-hall',
    preferredAtmospheres: ['copper-archive-cathedral', 'warm-brass-grand-hotel', 'azure-shinkai-day', 'velvet-midnight-vault'],
    preferred2DThemes: ['cathedral-sepia-gold', 'grand-hotel-brass', 'blueprint-cyan'],
    cameraLabels: ['Notary Desk', 'Judge Bench', 'Clerk Archive'],
    storyKeywords: ['courthouse', 'notary', 'wax seal'],
    defaultProtagonistRole: 'Forger Borrowing the Official Wax Stamp',
    defaultStaffRole: 'Court Notary Clerk',
    defaultTargetLandmark: 'Brass Courthouse Wax-Seal Press',
    defaultCheckpointLandmark: 'Courtroom Marble Columns',
    defaultUntouchedLandmark: 'Sealed Judicial Record Vault',
    defaultWitnessLandmark: 'Court Bailiff Stamp Registry',
  },
  'coffee-shop-cafe': {
    id: 'coffee-shop-cafe',
    placeName: 'Corner Coffee Shop & Co-Working Cafe',
    shortPlace: 'Coffee Shop',
    heroKinetic: 'cafe-espresso-bar-machine',
    clip2DMotif: 'coffee-shop-cafe',
    preferredAtmospheres: ['warm-brass-grand-hotel', 'golden-sunset-highway', 'azure-shinkai-day', 'sunrise-logistics-port'],
    preferred2DThemes: ['grand-hotel-brass', 'sunset-highway-coral', 'cathedral-sepia-gold'],
    cameraLabels: ['Espresso Bar', 'Cafe Tables', 'Pickup Counter'],
    storyKeywords: ['coffee shop', 'cafe', 'barista'],
    defaultProtagonistRole: 'Patron Eavesdropping at the Corner Table',
    defaultStaffRole: 'Cafe Barista',
    defaultTargetLandmark: 'Espresso Counter & Pickup Shelf',
    defaultCheckpointLandmark: 'Cafe Order Register',
    defaultUntouchedLandmark: 'Roastery Bean Storage Room',
    defaultWitnessLandmark: 'Cafe Manager Order Screen',
  },
  'car-repair-garage': {
    id: 'car-repair-garage',
    placeName: 'Auto Repair Garage & Hydraulic Car Lift',
    shortPlace: 'Repair Garage',
    heroKinetic: 'garage-hydraulic-car-lift',
    clip2DMotif: 'car-repair-garage',
    preferredAtmospheres: ['amber-industrial-foundry', 'crimson-bunker-alert', 'golden-sunset-highway', 'desert-satellite-dusk'],
    preferred2DThemes: ['foundry-amber', 'bunker-crimson', 'desert-dish-terracotta'],
    cameraLabels: ['Service Bay', 'Hydraulic Lift', 'Inspection Desk'],
    storyKeywords: ['garage', 'mechanic', 'car lift'],
    defaultProtagonistRole: 'Rogue Mechanic Swapping Parts Under the Hood',
    defaultStaffRole: 'Shop Foreman',
    defaultTargetLandmark: 'Sedan Raised on Hydraulic Car Lift',
    defaultCheckpointLandmark: 'Garage Roll-Up Service Door',
    defaultUntouchedLandmark: 'Factory Sealed Spare-Parts Rack',
    defaultWitnessLandmark: 'Garage Service Checklist Board',
  },
  'university-exam-hall': {
    id: 'university-exam-hall',
    placeName: 'University Lecture & Exam Hall',
    shortPlace: 'University Hall',
    heroKinetic: 'university-proctor-podium',
    clip2DMotif: 'university-exam-hall',
    preferredAtmospheres: ['azure-shinkai-day', 'violet-neural-core', 'copper-archive-cathedral', 'clinical-xray-cleanroom'],
    preferred2DThemes: ['neural-violet', 'blueprint-cyan', 'cathedral-sepia-gold'],
    cameraLabels: ['Student Desks', 'Proctor Podium', 'Dean Office'],
    storyKeywords: ['university', 'exam hall', 'proctor'],
    defaultProtagonistRole: 'Student Sneaking Hidden Instructions Into a Booklet',
    defaultStaffRole: 'Exam Proctor',
    defaultTargetLandmark: 'Proctor Podium & Answer Key Folder',
    defaultCheckpointLandmark: 'Lecture Hall Attendance Desk',
    defaultUntouchedLandmark: 'Locked Registrar Grade Cabinet',
    defaultWitnessLandmark: 'Exam Hall Proctor Log',
  },
  'apartment-lobby-intercom': {
    id: 'apartment-lobby-intercom',
    placeName: 'Residential Apartment Lobby & Brass Intercom',
    shortPlace: 'Apartment Lobby',
    heroKinetic: 'apartment-intercom-buzzer',
    clip2DMotif: 'apartment-lobby-intercom',
    preferredAtmospheres: ['neon-rain-cyberpunk', 'warm-brass-grand-hotel', 'velvet-midnight-vault', 'golden-sunset-highway'],
    preferred2DThemes: ['grand-hotel-brass', 'telecom-rf-magenta', 'orbital-indigo'],
    cameraLabels: ['Intercom Panel', 'Mailbox Wall', 'Doorman Desk'],
    storyKeywords: ['apartment', 'intercom', 'doorman'],
    defaultProtagonistRole: 'Tailgater Buzzing the Front Intercom',
    defaultStaffRole: 'Building Doorman',
    defaultTargetLandmark: 'Brass Intercom Buzzer & Elevator',
    defaultCheckpointLandmark: 'Locked Glass Vestibule Door',
    defaultUntouchedLandmark: 'Resident Locked Mailboxes',
    defaultWitnessLandmark: 'Doorman Visitor Sign-In Book',
  },
  'border-passport-control': {
    id: 'border-passport-control',
    placeName: 'International Border Crossing & Passport Control',
    shortPlace: 'Border Control',
    heroKinetic: 'border-passport-xray-gate',
    clip2DMotif: 'border-passport-control',
    preferredAtmospheres: ['golden-sunset-highway', 'desert-satellite-dusk', 'alpine-substation-crisp', 'crimson-bunker-alert'],
    preferred2DThemes: ['desert-dish-terracotta', 'bunker-crimson', 'alpine-grid-ice'],
    cameraLabels: ['Passport Booth', 'Luggage X-Ray', 'Border Gate'],
    storyKeywords: ['border', 'passport', 'customs'],
    defaultProtagonistRole: 'Traveler Carrying a Forged Passport Stamp',
    defaultStaffRole: 'Border Customs Officer',
    defaultTargetLandmark: 'Passport Glass Inspection Booth',
    defaultCheckpointLandmark: 'Luggage X-Ray Belt & Barrier',
    defaultUntouchedLandmark: 'Diplomatic Sealed Pouch Lane',
    defaultWitnessLandmark: 'Customs Passport Registry',
  },
  'broadcast-tv-studio': {
    id: 'broadcast-tv-studio',
    placeName: 'Live TV Broadcast Studio & Roof Signal Dish',
    shortPlace: 'Broadcast Studio',
    heroKinetic: 'broadcast-studio-signal-dish',
    clip2DMotif: 'broadcast-tv-studio',
    preferredAtmospheres: ['storm-telecom-rooftop', 'neon-rain-cyberpunk', 'violet-neural-core', 'desert-satellite-dusk'],
    preferred2DThemes: ['telecom-rf-magenta', 'neural-violet', 'desert-dish-terracotta'],
    cameraLabels: ['Control Booth', 'ON AIR Stage', 'Roof Dish'],
    storyKeywords: ['broadcast', 'studio', 'signal dish'],
    defaultProtagonistRole: 'Unlisted Engineer Patching the Control Desk',
    defaultStaffRole: 'Broadcast Director',
    defaultTargetLandmark: 'Mixing Console & Roof Satellite Dish',
    defaultCheckpointLandmark: 'Soundproof ON AIR Studio Door',
    defaultUntouchedLandmark: 'Backup Emergency Transmitter',
    defaultWitnessLandmark: 'Master Control Broadcast Log',
  },
  'power-substation-waterworks': {
    id: 'power-substation-waterworks',
    placeName: 'Municipal Power Substation & Waterworks Yard',
    shortPlace: 'Power Substation',
    heroKinetic: 'substation-breaker-valve',
    clip2DMotif: 'power-substation-waterworks',
    preferredAtmospheres: ['alpine-substation-crisp', 'amber-industrial-foundry', 'arctic-datacenter-cobalt', 'crimson-bunker-alert'],
    preferred2DThemes: ['alpine-grid-ice', 'foundry-amber', 'bunker-crimson'],
    cameraLabels: ['Insulator Yard', 'Breaker Switch', 'Control Room'],
    storyKeywords: ['substation', 'power grid', 'waterworks'],
    defaultProtagonistRole: 'Impostor Flipping Master Breaker Switches',
    defaultStaffRole: 'Grid Shift Engineer',
    defaultTargetLandmark: 'High-Voltage Breaker & Pipe Valve',
    defaultCheckpointLandmark: 'Substation Fenced Entry Gate',
    defaultUntouchedLandmark: 'Isolated Backup Generator Bay',
    defaultWitnessLandmark: 'Control Room Gauge Recorder',
  },
  'pharmacy-prescription-lab': {
    id: 'pharmacy-prescription-lab',
    placeName: 'Neighborhood Pharmacy & Prescription Counter',
    shortPlace: 'Pharmacy',
    heroKinetic: 'pharmacy-prescription-carousel',
    clip2DMotif: 'pharmacy-prescription-lab',
    preferredAtmospheres: ['clinical-xray-cleanroom', 'toxic-biolab-green', 'azure-shinkai-day', 'emerald-harbor-mist'],
    preferred2DThemes: ['biolab-emerald', 'xray-cleanroom', 'harbor-teal'],
    cameraLabels: ['Drop-Off Glass', 'Bottle Shelves', 'Pickup Counter'],
    storyKeywords: ['pharmacy', 'prescription', 'pharmacist'],
    defaultProtagonistRole: 'Caller Presenting an Altered Prescription Slip',
    defaultStaffRole: 'Head Pharmacist',
    defaultTargetLandmark: 'Prescription Bottle Carousel Wall',
    defaultCheckpointLandmark: 'Pharmacy Glass Drop-Off Window',
    defaultUntouchedLandmark: 'Double-Locked Controlled Cabinet',
    defaultWitnessLandmark: 'Pharmacy Dispensing Ledger',
  },
  'warehouse-forklift-bay': {
    id: 'warehouse-forklift-bay',
    placeName: 'Logistics Warehouse & Forklift Loading Bay',
    shortPlace: 'Logistics Warehouse',
    heroKinetic: 'warehouse-pallet-forklift',
    clip2DMotif: 'warehouse-forklift-bay',
    preferredAtmospheres: ['sunrise-logistics-port', 'amber-industrial-foundry', 'arctic-datacenter-cobalt', 'golden-sunset-highway'],
    preferred2DThemes: ['foundry-amber', 'harbor-teal', 'sunset-highway-coral'],
    cameraLabels: ['Pallet Racks', 'Yellow Forklift', 'Shipping Dock'],
    storyKeywords: ['warehouse', 'forklift', 'pallet'],
    defaultProtagonistRole: 'Driver Swapping Labels on a Pallet Crate',
    defaultStaffRole: 'Warehouse Dispatcher',
    defaultTargetLandmark: 'High-Bay Pallet Racks & Forklift',
    defaultCheckpointLandmark: 'Loading Dock Check-Out Clipboards',
    defaultUntouchedLandmark: 'Quarantined Audit Cage',
    defaultWitnessLandmark: 'Warehouse Barcode Inventory Log',
  },
};

export const ALL_REAL_WORLD_SET_IDS: SpatialSetArchetype[] = Object.keys(
  REAL_WORLD_ENVIRONMENTS
) as SpatialSetArchetype[];

export interface CinemaAtmosphereSpec {
  id: CinemaAtmosphereId;
  label: string;
  dayZenith: [number, number, number];
  dayMid: [number, number, number];
  dayHorizon: [number, number, number];
  nightZenith: [number, number, number];
  nightMid: [number, number, number];
  nightHorizon: [number, number, number];
  dayCloudLit: [number, number, number];
  dayCloudShadow: [number, number, number];
  nightCloudLit: [number, number, number];
  nightCloudShadow: [number, number, number];
  sunDir: [number, number, number];
  daySunColor: [number, number, number];
  nightSunColor: [number, number, number];
  fogLightHex: number;
  fogDarkHex: number;
  fogDensityLight: number;
  fogDensityDark: number;
  hemiSkyLight: number;
  hemiGroundLight: number;
  hemiSkyDark: number;
  hemiGroundDark: number;
  keyLightColorLight: number;
  keyLightColorDark: number;
  keyLightIntensityLight: number;
  keyLightIntensityDark: number;
  keyLightPos: [number, number, number];
  rimLightColor: number;
  rimLightPos: [number, number, number];
  starfieldIntensity: number;
  exposureLight: number;
  exposureDark: number;
}

export interface Clip2DThemePalette {
  id: Clip2DCinemaTheme;
  label: string;
  bgCenter: string;
  bgMid: string;
  bgEdge: string;
  gridColor: string;
  gridOpacity: number;
  primaryAccent: string;
  secondaryAccent: string;
  panelFill: string;
  panelStroke: string;
  controlFill: string;
  controlStroke: string;
  witnessFill: string;
  witnessStroke: string;
  patternKind:
    | 'blueprint-grid'
    | 'foundry-rivets'
    | 'hotel-arches'
    | 'harbor-waves'
    | 'orbital-stars'
    | 'bunker-stripes'
    | 'xray-ticks'
    | 'neural-mesh'
    | 'alpine-contours'
    | 'rf-rings'
    | 'cathedral-ribs'
    | 'biolab-hex'
    | 'highway-lanes'
    | 'desert-radar';
}

export interface ScenarioCinemaProfile {
  scenarioId: string;
  filmTitle: string;
  genre: string;
  settingLabel: string;
  realWorldPlace: string;
  atmosphere: CinemaAtmosphereId;
  spatialSet: SpatialSetArchetype;
  heroKinetic: HeroKineticMechanism;
  cameraStyle: CameraCompositionStyle;
  primaryHex: number;
  secondaryHex: number;
  clip2DTheme: Clip2DCinemaTheme;
  clip2DStoryMotif: Clip2DStoryMotif;
  clip2DLayout: Clip2DLayoutGeometry;
  phaseRibbon: [string, string, string, string];
  castSummary: {
    protagonist: string;
    targetAsset: string;
    untouchedControl: string;
    witness: string;
  };
}

export const CINEMA_ATMOSPHERES: Record<CinemaAtmosphereId, CinemaAtmosphereSpec> = {
  'azure-shinkai-day': {
    id: 'azure-shinkai-day',
    label: 'Bright Blue-Sky Morning',
    dayZenith: [0.16, 0.48, 0.88],
    dayMid: [0.47, 0.78, 0.98],
    dayHorizon: [0.99, 0.94, 0.86],
    nightZenith: [0.03, 0.05, 0.14],
    nightMid: [0.09, 0.13, 0.29],
    nightHorizon: [0.22, 0.16, 0.34],
    dayCloudLit: [1.0, 0.99, 0.96],
    dayCloudShadow: [0.76, 0.85, 0.96],
    nightCloudLit: [0.32, 0.28, 0.52],
    nightCloudShadow: [0.14, 0.18, 0.34],
    sunDir: [0.48, 0.32, -0.82],
    daySunColor: [1.0, 0.96, 0.82],
    nightSunColor: [0.74, 0.88, 1.0],
    fogLightHex: 0xdfeffc,
    fogDarkHex: 0x0b1024,
    fogDensityLight: 0.0095,
    fogDensityDark: 0.0082,
    hemiSkyLight: 0xdbeafe,
    hemiGroundLight: 0x64748b,
    hemiSkyDark: 0x3b82f6,
    hemiGroundDark: 0x0f172a,
    keyLightColorLight: 0xfff7ed,
    keyLightColorDark: 0xa5b4fc,
    keyLightIntensityLight: 1.75,
    keyLightIntensityDark: 1.2,
    keyLightPos: [16, 26, 18],
    rimLightColor: 0x38bdf8,
    rimLightPos: [-20, 14, -18],
    starfieldIntensity: 0.2,
    exposureLight: 1.04,
    exposureDark: 0.98,
  },
  'golden-sunset-highway': {
    id: 'golden-sunset-highway',
    label: 'Golden Afternoon Sunset',
    dayZenith: [0.24, 0.2, 0.52],
    dayMid: [0.88, 0.44, 0.36],
    dayHorizon: [1.0, 0.82, 0.44],
    nightZenith: [0.1, 0.05, 0.18],
    nightMid: [0.34, 0.13, 0.24],
    nightHorizon: [0.68, 0.28, 0.16],
    dayCloudLit: [1.0, 0.88, 0.62],
    dayCloudShadow: [0.58, 0.3, 0.42],
    nightCloudLit: [0.72, 0.36, 0.26],
    nightCloudShadow: [0.24, 0.1, 0.2],
    sunDir: [-0.52, 0.14, -0.84],
    daySunColor: [1.0, 0.78, 0.38],
    nightSunColor: [1.0, 0.56, 0.34],
    fogLightHex: 0xfad2a7,
    fogDarkHex: 0x24101c,
    fogDensityLight: 0.0105,
    fogDensityDark: 0.009,
    hemiSkyLight: 0xfed7aa,
    hemiGroundLight: 0x581c87,
    hemiSkyDark: 0xfb923c,
    hemiGroundDark: 0x1e1b4b,
    keyLightColorLight: 0xfde68a,
    keyLightColorDark: 0xfdba74,
    keyLightIntensityLight: 1.85,
    keyLightIntensityDark: 1.28,
    keyLightPos: [-22, 16, 16],
    rimLightColor: 0xf43f5e,
    rimLightPos: [18, 12, -16],
    starfieldIntensity: 0.35,
    exposureLight: 1.05,
    exposureDark: 1.0,
  },
  'neon-rain-cyberpunk': {
    id: 'neon-rain-cyberpunk',
    label: 'Rainy Neon Evening',
    dayZenith: [0.06, 0.09, 0.24],
    dayMid: [0.16, 0.14, 0.38],
    dayHorizon: [0.46, 0.18, 0.52],
    nightZenith: [0.02, 0.03, 0.1],
    nightMid: [0.1, 0.07, 0.24],
    nightHorizon: [0.36, 0.09, 0.38],
    dayCloudLit: [0.68, 0.42, 0.88],
    dayCloudShadow: [0.16, 0.16, 0.34],
    nightCloudLit: [0.44, 0.2, 0.62],
    nightCloudShadow: [0.08, 0.08, 0.18],
    sunDir: [0.3, 0.24, -0.92],
    daySunColor: [0.5, 0.92, 1.0],
    nightSunColor: [0.95, 0.36, 0.88],
    fogLightHex: 0x261d46,
    fogDarkHex: 0x0d091f,
    fogDensityLight: 0.011,
    fogDensityDark: 0.01,
    hemiSkyLight: 0x818cf8,
    hemiGroundLight: 0x3b0764,
    hemiSkyDark: 0xc084fc,
    hemiGroundDark: 0x090d1e,
    keyLightColorLight: 0x67e8f9,
    keyLightColorDark: 0x38bdf8,
    keyLightIntensityLight: 1.52,
    keyLightIntensityDark: 1.35,
    keyLightPos: [14, 22, 18],
    rimLightColor: 0xe879f9,
    rimLightPos: [-18, 12, -14],
    starfieldIntensity: 0.65,
    exposureLight: 1.06,
    exposureDark: 1.02,
  },
  'emerald-harbor-mist': {
    id: 'emerald-harbor-mist',
    label: 'Coastal Morning Mist',
    dayZenith: [0.14, 0.44, 0.5],
    dayMid: [0.46, 0.78, 0.76],
    dayHorizon: [0.85, 0.96, 0.92],
    nightZenith: [0.03, 0.11, 0.16],
    nightMid: [0.07, 0.22, 0.26],
    nightHorizon: [0.15, 0.36, 0.38],
    dayCloudLit: [0.94, 1.0, 0.98],
    dayCloudShadow: [0.58, 0.78, 0.78],
    nightCloudLit: [0.22, 0.48, 0.48],
    nightCloudShadow: [0.06, 0.16, 0.2],
    sunDir: [0.6, 0.36, -0.71],
    daySunColor: [0.92, 1.0, 0.94],
    nightSunColor: [0.42, 0.94, 0.86],
    fogLightHex: 0xd0f0eb,
    fogDarkHex: 0x092228,
    fogDensityLight: 0.011,
    fogDensityDark: 0.0095,
    hemiSkyLight: 0x99f6e4,
    hemiGroundLight: 0x1e3a5f,
    hemiSkyDark: 0x2dd4bf,
    hemiGroundDark: 0x042f2e,
    keyLightColorLight: 0xf0fdfa,
    keyLightColorDark: 0x5eead4,
    keyLightIntensityLight: 1.68,
    keyLightIntensityDark: 1.24,
    keyLightPos: [20, 24, 16],
    rimLightColor: 0x10b981,
    rimLightPos: [-16, 15, -18],
    starfieldIntensity: 0.15,
    exposureLight: 1.02,
    exposureDark: 0.98,
  },
  'crimson-bunker-alert': {
    id: 'crimson-bunker-alert',
    label: 'High-Alert Dusk Glow',
    dayZenith: [0.16, 0.05, 0.09],
    dayMid: [0.34, 0.09, 0.14],
    dayHorizon: [0.62, 0.18, 0.18],
    nightZenith: [0.08, 0.02, 0.04],
    nightMid: [0.22, 0.05, 0.08],
    nightHorizon: [0.44, 0.1, 0.12],
    dayCloudLit: [0.82, 0.34, 0.34],
    dayCloudShadow: [0.24, 0.07, 0.1],
    nightCloudLit: [0.58, 0.16, 0.18],
    nightCloudShadow: [0.14, 0.03, 0.06],
    sunDir: [-0.25, 0.38, -0.88],
    daySunColor: [1.0, 0.45, 0.36],
    nightSunColor: [1.0, 0.28, 0.32],
    fogLightHex: 0x3b131b,
    fogDarkHex: 0x1c070c,
    fogDensityLight: 0.0115,
    fogDensityDark: 0.01,
    hemiSkyLight: 0xfda4af,
    hemiGroundLight: 0x1f0a10,
    hemiSkyDark: 0xf43f5e,
    hemiGroundDark: 0x140508,
    keyLightColorLight: 0xfecdd3,
    keyLightColorDark: 0xfb7185,
    keyLightIntensityLight: 1.56,
    keyLightIntensityDark: 1.38,
    keyLightPos: [10, 24, 20],
    rimLightColor: 0xf59e0b,
    rimLightPos: [-18, 12, -16],
    starfieldIntensity: 0.1,
    exposureLight: 1.05,
    exposureDark: 1.02,
  },
  'warm-brass-grand-hotel': {
    id: 'warm-brass-grand-hotel',
    label: 'Warm Sunlit Interior',
    dayZenith: [0.36, 0.28, 0.22],
    dayMid: [0.76, 0.62, 0.44],
    dayHorizon: [0.99, 0.92, 0.78],
    nightZenith: [0.12, 0.09, 0.07],
    nightMid: [0.28, 0.2, 0.13],
    nightHorizon: [0.48, 0.34, 0.2],
    dayCloudLit: [1.0, 0.96, 0.86],
    dayCloudShadow: [0.72, 0.6, 0.46],
    nightCloudLit: [0.62, 0.46, 0.26],
    nightCloudShadow: [0.22, 0.15, 0.1],
    sunDir: [0.42, 0.45, -0.78],
    daySunColor: [1.0, 0.92, 0.72],
    nightSunColor: [1.0, 0.78, 0.44],
    fogLightHex: 0xf5e8cf,
    fogDarkHex: 0x24190f,
    fogDensityLight: 0.0085,
    fogDensityDark: 0.0085,
    hemiSkyLight: 0xfef3c7,
    hemiGroundLight: 0x78350f,
    hemiSkyDark: 0xfbbf24,
    hemiGroundDark: 0x29170a,
    keyLightColorLight: 0xfffbeb,
    keyLightColorDark: 0xfde68a,
    keyLightIntensityLight: 1.8,
    keyLightIntensityDark: 1.28,
    keyLightPos: [14, 28, 18],
    rimLightColor: 0xf59e0b,
    rimLightPos: [-18, 16, -15],
    starfieldIntensity: 0.08,
    exposureLight: 1.03,
    exposureDark: 0.99,
  },
  'alpine-substation-crisp': {
    id: 'alpine-substation-crisp',
    label: 'Crisp Mountain Daylight',
    dayZenith: [0.12, 0.34, 0.72],
    dayMid: [0.56, 0.82, 0.98],
    dayHorizon: [0.93, 0.98, 1.0],
    nightZenith: [0.02, 0.08, 0.2],
    nightMid: [0.08, 0.2, 0.4],
    nightHorizon: [0.24, 0.44, 0.62],
    dayCloudLit: [1.0, 1.0, 1.0],
    dayCloudShadow: [0.72, 0.86, 0.96],
    nightCloudLit: [0.4, 0.68, 0.88],
    nightCloudShadow: [0.12, 0.24, 0.4],
    sunDir: [-0.38, 0.48, -0.79],
    daySunColor: [0.95, 0.98, 1.0],
    nightSunColor: [0.68, 0.92, 1.0],
    fogLightHex: 0xe6f4ff,
    fogDarkHex: 0x0b1f38,
    fogDensityLight: 0.0085,
    fogDensityDark: 0.008,
    hemiSkyLight: 0xe0f2fe,
    hemiGroundLight: 0x475569,
    hemiSkyDark: 0x7dd3fc,
    hemiGroundDark: 0x0f172a,
    keyLightColorLight: 0xf8fafc,
    keyLightColorDark: 0xbae6fd,
    keyLightIntensityLight: 1.82,
    keyLightIntensityDark: 1.26,
    keyLightPos: [-18, 28, 16],
    rimLightColor: 0x06b6d4,
    rimLightPos: [20, 14, -18],
    starfieldIntensity: 0.45,
    exposureLight: 1.03,
    exposureDark: 0.99,
  },
  'obsidian-orbital-deck': {
    id: 'obsidian-orbital-deck',
    label: 'Deep Starlit Night Shift',
    dayZenith: [0.02, 0.05, 0.16],
    dayMid: [0.06, 0.16, 0.38],
    dayHorizon: [0.16, 0.54, 0.78],
    nightZenith: [0.01, 0.02, 0.08],
    nightMid: [0.04, 0.1, 0.26],
    nightHorizon: [0.1, 0.38, 0.62],
    dayCloudLit: [0.34, 0.78, 0.98],
    dayCloudShadow: [0.06, 0.16, 0.34],
    nightCloudLit: [0.2, 0.56, 0.82],
    nightCloudShadow: [0.04, 0.1, 0.24],
    sunDir: [0.64, 0.22, -0.73],
    daySunColor: [0.76, 0.95, 1.0],
    nightSunColor: [0.46, 0.86, 1.0],
    fogLightHex: 0x0f2544,
    fogDarkHex: 0x061024,
    fogDensityLight: 0.0075,
    fogDensityDark: 0.0072,
    hemiSkyLight: 0x38bdf8,
    hemiGroundLight: 0x0f172a,
    hemiSkyDark: 0x0ea5e9,
    hemiGroundDark: 0x020617,
    keyLightColorLight: 0xe0f2fe,
    keyLightColorDark: 0x7dd3fc,
    keyLightIntensityLight: 1.6,
    keyLightIntensityDark: 1.4,
    keyLightPos: [22, 20, 16],
    rimLightColor: 0x22d3ee,
    rimLightPos: [-22, 10, -14],
    starfieldIntensity: 0.95,
    exposureLight: 1.06,
    exposureDark: 1.03,
  },
  'amber-industrial-foundry': {
    id: 'amber-industrial-foundry',
    label: 'Warm Amber Industrial Light',
    dayZenith: [0.24, 0.18, 0.14],
    dayMid: [0.58, 0.36, 0.2],
    dayHorizon: [0.92, 0.62, 0.3],
    nightZenith: [0.1, 0.07, 0.06],
    nightMid: [0.28, 0.16, 0.09],
    nightHorizon: [0.58, 0.3, 0.12],
    dayCloudLit: [0.98, 0.78, 0.5],
    dayCloudShadow: [0.42, 0.28, 0.18],
    nightCloudLit: [0.72, 0.4, 0.18],
    nightCloudShadow: [0.2, 0.12, 0.08],
    sunDir: [-0.45, 0.28, -0.84],
    daySunColor: [1.0, 0.78, 0.42],
    nightSunColor: [1.0, 0.58, 0.24],
    fogLightHex: 0x6b4528,
    fogDarkHex: 0x26150b,
    fogDensityLight: 0.011,
    fogDensityDark: 0.0095,
    hemiSkyLight: 0xfdba74,
    hemiGroundLight: 0x292524,
    hemiSkyDark: 0xf97316,
    hemiGroundDark: 0x1c1917,
    keyLightColorLight: 0xffedd5,
    keyLightColorDark: 0xfdba74,
    keyLightIntensityLight: 1.72,
    keyLightIntensityDark: 1.34,
    keyLightPos: [-16, 22, 18],
    rimLightColor: 0xf97316,
    rimLightPos: [18, 12, -16],
    starfieldIntensity: 0.05,
    exposureLight: 1.04,
    exposureDark: 1.0,
  },
  'clinical-xray-cleanroom': {
    id: 'clinical-xray-cleanroom',
    label: 'Bright Clinical Daylight',
    dayZenith: [0.68, 0.82, 0.92],
    dayMid: [0.86, 0.93, 0.97],
    dayHorizon: [0.97, 0.99, 1.0],
    nightZenith: [0.06, 0.12, 0.18],
    nightMid: [0.12, 0.22, 0.3],
    nightHorizon: [0.2, 0.34, 0.42],
    dayCloudLit: [1.0, 1.0, 1.0],
    dayCloudShadow: [0.84, 0.9, 0.95],
    nightCloudLit: [0.34, 0.56, 0.68],
    nightCloudShadow: [0.14, 0.22, 0.3],
    sunDir: [0.2, 0.65, -0.73],
    daySunColor: [0.96, 0.99, 1.0],
    nightSunColor: [0.62, 0.94, 1.0],
    fogLightHex: 0xf1f7fb,
    fogDarkHex: 0x0d1d29,
    fogDensityLight: 0.008,
    fogDensityDark: 0.008,
    hemiSkyLight: 0xf8fafc,
    hemiGroundLight: 0x94a3b8,
    hemiSkyDark: 0x67e8f9,
    hemiGroundDark: 0x0f172a,
    keyLightColorLight: 0xffffff,
    keyLightColorDark: 0xcffafe,
    keyLightIntensityLight: 1.84,
    keyLightIntensityDark: 1.32,
    keyLightPos: [8, 30, 18],
    rimLightColor: 0x0ea5e9,
    rimLightPos: [-16, 16, -16],
    starfieldIntensity: 0.0,
    exposureLight: 1.01,
    exposureDark: 0.98,
  },
  'desert-satellite-dusk': {
    id: 'desert-satellite-dusk',
    label: 'Warm Desert Twilight',
    dayZenith: [0.12, 0.42, 0.58],
    dayMid: [0.78, 0.56, 0.44],
    dayHorizon: [0.98, 0.78, 0.56],
    nightZenith: [0.05, 0.1, 0.2],
    nightMid: [0.26, 0.16, 0.2],
    nightHorizon: [0.56, 0.3, 0.22],
    dayCloudLit: [1.0, 0.88, 0.72],
    dayCloudShadow: [0.64, 0.42, 0.38],
    nightCloudLit: [0.64, 0.38, 0.3],
    nightCloudShadow: [0.2, 0.12, 0.16],
    sunDir: [0.58, 0.18, -0.79],
    daySunColor: [1.0, 0.84, 0.58],
    nightSunColor: [0.96, 0.64, 0.46],
    fogLightHex: 0xf0cdb0,
    fogDarkHex: 0x261515,
    fogDensityLight: 0.01,
    fogDensityDark: 0.009,
    hemiSkyLight: 0xfed7aa,
    hemiGroundLight: 0x9a3412,
    hemiSkyDark: 0xfb923c,
    hemiGroundDark: 0x291512,
    keyLightColorLight: 0xffedd5,
    keyLightColorDark: 0xfdba74,
    keyLightIntensityLight: 1.78,
    keyLightIntensityDark: 1.26,
    keyLightPos: [22, 18, 16],
    rimLightColor: 0x14b8a6,
    rimLightPos: [-20, 12, -16],
    starfieldIntensity: 0.55,
    exposureLight: 1.03,
    exposureDark: 0.99,
  },
  'velvet-midnight-vault': {
    id: 'velvet-midnight-vault',
    label: 'Late-Night Blue Hour',
    dayZenith: [0.06, 0.08, 0.26],
    dayMid: [0.14, 0.18, 0.44],
    dayHorizon: [0.28, 0.34, 0.58],
    nightZenith: [0.02, 0.03, 0.12],
    nightMid: [0.07, 0.09, 0.24],
    nightHorizon: [0.16, 0.22, 0.38],
    dayCloudLit: [0.66, 0.76, 0.98],
    dayCloudShadow: [0.18, 0.22, 0.42],
    nightCloudLit: [0.34, 0.46, 0.74],
    nightCloudShadow: [0.08, 0.1, 0.22],
    sunDir: [-0.3, 0.52, -0.8],
    daySunColor: [0.84, 0.92, 1.0],
    nightSunColor: [0.76, 0.94, 0.96],
    fogLightHex: 0x1d264a,
    fogDarkHex: 0x090d21,
    fogDensityLight: 0.01,
    fogDensityDark: 0.009,
    hemiSkyLight: 0x93c5fd,
    hemiGroundLight: 0x1e1b4b,
    hemiSkyDark: 0x60a5fa,
    hemiGroundDark: 0x090d1f,
    keyLightColorLight: 0xe2e8f0,
    keyLightColorDark: 0x93c5fd,
    keyLightIntensityLight: 1.6,
    keyLightIntensityDark: 1.35,
    keyLightPos: [-12, 26, 18],
    rimLightColor: 0x34d399,
    rimLightPos: [18, 14, -18],
    starfieldIntensity: 0.75,
    exposureLight: 1.04,
    exposureDark: 1.0,
  },
  'storm-telecom-rooftop': {
    id: 'storm-telecom-rooftop',
    label: 'Overcast Storm Skyline',
    dayZenith: [0.14, 0.16, 0.28],
    dayMid: [0.3, 0.32, 0.48],
    dayHorizon: [0.56, 0.52, 0.68],
    nightZenith: [0.05, 0.06, 0.14],
    nightMid: [0.14, 0.14, 0.28],
    nightHorizon: [0.3, 0.22, 0.44],
    dayCloudLit: [0.82, 0.8, 0.94],
    dayCloudShadow: [0.28, 0.3, 0.44],
    nightCloudLit: [0.48, 0.4, 0.68],
    nightCloudShadow: [0.12, 0.12, 0.24],
    sunDir: [0.22, 0.34, -0.91],
    daySunColor: [0.9, 0.86, 1.0],
    nightSunColor: [0.8, 0.72, 1.0],
    fogLightHex: 0x45425e,
    fogDarkHex: 0x151326,
    fogDensityLight: 0.011,
    fogDensityDark: 0.0098,
    hemiSkyLight: 0xc4b5fd,
    hemiGroundLight: 0x1e293b,
    hemiSkyDark: 0xa78bfa,
    hemiGroundDark: 0x0f172a,
    keyLightColorLight: 0xf5f3ff,
    keyLightColorDark: 0xddd6fe,
    keyLightIntensityLight: 1.62,
    keyLightIntensityDark: 1.32,
    keyLightPos: [16, 24, 18],
    rimLightColor: 0xf472b6,
    rimLightPos: [-20, 14, -16],
    starfieldIntensity: 0.3,
    exposureLight: 1.04,
    exposureDark: 1.0,
  },
  'copper-archive-cathedral': {
    id: 'copper-archive-cathedral',
    label: 'Warm Autumn Afternoon',
    dayZenith: [0.26, 0.22, 0.2],
    dayMid: [0.62, 0.48, 0.38],
    dayHorizon: [0.92, 0.82, 0.68],
    nightZenith: [0.1, 0.07, 0.06],
    nightMid: [0.24, 0.17, 0.14],
    nightHorizon: [0.42, 0.28, 0.22],
    dayCloudLit: [0.98, 0.9, 0.8],
    dayCloudShadow: [0.58, 0.46, 0.38],
    nightCloudLit: [0.54, 0.38, 0.28],
    nightCloudShadow: [0.18, 0.12, 0.1],
    sunDir: [0.0, 0.56, -0.82],
    daySunColor: [1.0, 0.9, 0.74],
    nightSunColor: [0.98, 0.72, 0.5],
    fogLightHex: 0xe6d4be,
    fogDarkHex: 0x221611,
    fogDensityLight: 0.0095,
    fogDensityDark: 0.009,
    hemiSkyLight: 0xfde68a,
    hemiGroundLight: 0x57534e,
    hemiSkyDark: 0xf59e0b,
    hemiGroundDark: 0x1c1917,
    keyLightColorLight: 0xfff7ed,
    keyLightColorDark: 0xfed7aa,
    keyLightIntensityLight: 1.75,
    keyLightIntensityDark: 1.26,
    keyLightPos: [0, 30, 18],
    rimLightColor: 0xd97706,
    rimLightPos: [-16, 14, -18],
    starfieldIntensity: 0.1,
    exposureLight: 1.02,
    exposureDark: 0.98,
  },
  'toxic-biolab-green': {
    id: 'toxic-biolab-green',
    label: 'Emerald Botanical Glow',
    dayZenith: [0.06, 0.18, 0.16],
    dayMid: [0.12, 0.36, 0.28],
    dayHorizon: [0.28, 0.64, 0.44],
    nightZenith: [0.02, 0.08, 0.07],
    nightMid: [0.05, 0.2, 0.14],
    nightHorizon: [0.12, 0.4, 0.26],
    dayCloudLit: [0.54, 0.94, 0.72],
    dayCloudShadow: [0.12, 0.3, 0.22],
    nightCloudLit: [0.24, 0.66, 0.44],
    nightCloudShadow: [0.05, 0.14, 0.1],
    sunDir: [-0.4, 0.4, -0.82],
    daySunColor: [0.74, 1.0, 0.84],
    nightSunColor: [0.42, 0.98, 0.64],
    fogLightHex: 0x1d4736,
    fogDarkHex: 0x071f15,
    fogDensityLight: 0.011,
    fogDensityDark: 0.0098,
    hemiSkyLight: 0x6ee7b7,
    hemiGroundLight: 0x064e3b,
    hemiSkyDark: 0x34d399,
    hemiGroundDark: 0x022c22,
    keyLightColorLight: 0xecfdf5,
    keyLightColorDark: 0xa7f3d0,
    keyLightIntensityLight: 1.6,
    keyLightIntensityDark: 1.32,
    keyLightPos: [-14, 24, 18],
    rimLightColor: 0x84cc16,
    rimLightPos: [18, 12, -16],
    starfieldIntensity: 0.2,
    exposureLight: 1.04,
    exposureDark: 1.0,
  },
  'arctic-datacenter-cobalt': {
    id: 'arctic-datacenter-cobalt',
    label: 'Cool Winter Sky',
    dayZenith: [0.08, 0.22, 0.56],
    dayMid: [0.28, 0.56, 0.88],
    dayHorizon: [0.78, 0.92, 1.0],
    nightZenith: [0.02, 0.06, 0.18],
    nightMid: [0.06, 0.18, 0.42],
    nightHorizon: [0.18, 0.46, 0.72],
    dayCloudLit: [0.94, 0.98, 1.0],
    dayCloudShadow: [0.56, 0.72, 0.92],
    nightCloudLit: [0.36, 0.64, 0.92],
    nightCloudShadow: [0.1, 0.2, 0.4],
    sunDir: [0.52, 0.4, -0.75],
    daySunColor: [0.92, 0.97, 1.0],
    nightSunColor: [0.58, 0.86, 1.0],
    fogLightHex: 0xcbe4fc,
    fogDarkHex: 0x091a36,
    fogDensityLight: 0.0095,
    fogDensityDark: 0.0085,
    hemiSkyLight: 0xbfdbfe,
    hemiGroundLight: 0x1e3a8a,
    hemiSkyDark: 0x3b82f6,
    hemiGroundDark: 0x0b1120,
    keyLightColorLight: 0xf0f9ff,
    keyLightColorDark: 0x93c5fd,
    keyLightIntensityLight: 1.78,
    keyLightIntensityDark: 1.28,
    keyLightPos: [18, 26, 16],
    rimLightColor: 0x60a5fa,
    rimLightPos: [-18, 14, -18],
    starfieldIntensity: 0.6,
    exposureLight: 1.03,
    exposureDark: 0.99,
  },
  'sunrise-logistics-port': {
    id: 'sunrise-logistics-port',
    label: 'Early Coral Sunrise',
    dayZenith: [0.26, 0.42, 0.74],
    dayMid: [0.92, 0.66, 0.64],
    dayHorizon: [1.0, 0.88, 0.74],
    nightZenith: [0.08, 0.1, 0.22],
    nightMid: [0.3, 0.16, 0.26],
    nightHorizon: [0.58, 0.3, 0.32],
    dayCloudLit: [1.0, 0.94, 0.88],
    dayCloudShadow: [0.76, 0.56, 0.62],
    nightCloudLit: [0.68, 0.4, 0.44],
    nightCloudShadow: [0.22, 0.14, 0.24],
    sunDir: [0.66, 0.16, -0.73],
    daySunColor: [1.0, 0.88, 0.74],
    nightSunColor: [1.0, 0.64, 0.58],
    fogLightHex: 0xf9dfd0,
    fogDarkHex: 0x24121b,
    fogDensityLight: 0.01,
    fogDensityDark: 0.009,
    hemiSkyLight: 0xfecdd3,
    hemiGroundLight: 0x334155,
    hemiSkyDark: 0xfb7185,
    hemiGroundDark: 0x1e293b,
    keyLightColorLight: 0xfff1f2,
    keyLightColorDark: 0xfda4af,
    keyLightIntensityLight: 1.8,
    keyLightIntensityDark: 1.25,
    keyLightPos: [24, 18, 16],
    rimLightColor: 0x38bdf8,
    rimLightPos: [-20, 14, -16],
    starfieldIntensity: 0.2,
    exposureLight: 1.03,
    exposureDark: 0.99,
  },
  'violet-neural-core': {
    id: 'violet-neural-core',
    label: 'Twilight Violet Horizon',
    dayZenith: [0.16, 0.08, 0.38],
    dayMid: [0.38, 0.2, 0.68],
    dayHorizon: [0.7, 0.5, 0.95],
    nightZenith: [0.06, 0.02, 0.18],
    nightMid: [0.18, 0.08, 0.38],
    nightHorizon: [0.38, 0.18, 0.62],
    dayCloudLit: [0.88, 0.78, 1.0],
    dayCloudShadow: [0.38, 0.24, 0.6],
    nightCloudLit: [0.58, 0.38, 0.88],
    nightCloudShadow: [0.16, 0.08, 0.32],
    sunDir: [-0.28, 0.44, -0.85],
    daySunColor: [0.92, 0.84, 1.0],
    nightSunColor: [0.78, 0.64, 1.0],
    fogLightHex: 0x4b2f7a,
    fogDarkHex: 0x160a2c,
    fogDensityLight: 0.01,
    fogDensityDark: 0.0092,
    hemiSkyLight: 0xd8b4fe,
    hemiGroundLight: 0x3b0764,
    hemiSkyDark: 0xc084fc,
    hemiGroundDark: 0x1e1b4b,
    keyLightColorLight: 0xf3e8ff,
    keyLightColorDark: 0xe9d5ff,
    keyLightIntensityLight: 1.65,
    keyLightIntensityDark: 1.36,
    keyLightPos: [-14, 24, 18],
    rimLightColor: 0x22d3ee,
    rimLightPos: [18, 14, -16],
    starfieldIntensity: 0.8,
    exposureLight: 1.05,
    exposureDark: 1.02,
  },
};

export const CLIP_2D_THEMES: Record<Clip2DCinemaTheme, Clip2DThemePalette> = {
  'blueprint-cyan': {
    id: 'blueprint-cyan',
    label: 'Architectural Blueprint Cyan',
    bgCenter: '#0f2744',
    bgMid: '#0a1b32',
    bgEdge: '#050d1a',
    gridColor: '#38bdf8',
    gridOpacity: 0.16,
    primaryAccent: '#38bdf8',
    secondaryAccent: '#f43f5e',
    panelFill: '#0b192e',
    panelStroke: '#38bdf8',
    controlFill: '#062b22',
    controlStroke: '#10b981',
    witnessFill: '#111c36',
    witnessStroke: '#fbbf24',
    patternKind: 'blueprint-grid',
  },
  'foundry-amber': {
    id: 'foundry-amber',
    label: 'Industrial Workshop Amber',
    bgCenter: '#2d1b0e',
    bgMid: '#1f1209',
    bgEdge: '#110904',
    gridColor: '#f59e0b',
    gridOpacity: 0.16,
    primaryAccent: '#f59e0b',
    secondaryAccent: '#ef4444',
    panelFill: '#1e130c',
    panelStroke: '#f59e0b',
    controlFill: '#0c271c',
    controlStroke: '#22c55e',
    witnessFill: '#24180d',
    witnessStroke: '#fde047',
    patternKind: 'foundry-rivets',
  },
  'grand-hotel-brass': {
    id: 'grand-hotel-brass',
    label: 'Grand Lobby Brass & Burgundy',
    bgCenter: '#2a1820',
    bgMid: '#1c1016',
    bgEdge: '#10080c',
    gridColor: '#fbbf24',
    gridOpacity: 0.14,
    primaryAccent: '#fbbf24',
    secondaryAccent: '#fb7185',
    panelFill: '#201319',
    panelStroke: '#eab308',
    controlFill: '#09281f',
    controlStroke: '#34d399',
    witnessFill: '#231622',
    witnessStroke: '#fcd34d',
    patternKind: 'hotel-arches',
  },
  'harbor-teal': {
    id: 'harbor-teal',
    label: 'Coastal Harbor Pier Teal',
    bgCenter: '#0d2b30',
    bgMid: '#081e22',
    bgEdge: '#041013',
    gridColor: '#2dd4bf',
    gridOpacity: 0.16,
    primaryAccent: '#2dd4bf',
    secondaryAccent: '#fb923c',
    panelFill: '#0a2025',
    panelStroke: '#14b8a6',
    controlFill: '#082c1d',
    controlStroke: '#4ade80',
    witnessFill: '#0d242e',
    witnessStroke: '#facc15',
    patternKind: 'harbor-waves',
  },
  'orbital-indigo': {
    id: 'orbital-indigo',
    label: 'Night Transit Metro Indigo',
    bgCenter: '#14193d',
    bgMid: '#0c102b',
    bgEdge: '#060817',
    gridColor: '#818cf8',
    gridOpacity: 0.16,
    primaryAccent: '#818cf8',
    secondaryAccent: '#38bdf8',
    panelFill: '#101433',
    panelStroke: '#6366f1',
    controlFill: '#062b26',
    controlStroke: '#2dd4bf',
    witnessFill: '#15193b',
    witnessStroke: '#f59e0b',
    patternKind: 'orbital-stars',
  },
  'bunker-crimson': {
    id: 'bunker-crimson',
    label: 'High-Security Alert Crimson',
    bgCenter: '#2e1017',
    bgMid: '#1f0a10',
    bgEdge: '#110508',
    gridColor: '#f43f5e',
    gridOpacity: 0.16,
    primaryAccent: '#fb7185',
    secondaryAccent: '#fbbf24',
    panelFill: '#210c12',
    panelStroke: '#f43f5e',
    controlFill: '#07291c',
    controlStroke: '#10b981',
    witnessFill: '#261116',
    witnessStroke: '#facc15',
    patternKind: 'bunker-stripes',
  },
  'xray-cleanroom': {
    id: 'xray-cleanroom',
    label: 'Hospital & Lab Clean Slate',
    bgCenter: '#132634',
    bgMid: '#0d1b26',
    bgEdge: '#071018',
    gridColor: '#67e8f9',
    gridOpacity: 0.18,
    primaryAccent: '#22d3ee',
    secondaryAccent: '#fb7185',
    panelFill: '#0f202c',
    panelStroke: '#06b6d4',
    controlFill: '#062c22',
    controlStroke: '#34d399',
    witnessFill: '#122434',
    witnessStroke: '#fde047',
    patternKind: 'xray-ticks',
  },
  'neural-violet': {
    id: 'neural-violet',
    label: 'Campus & Studio Violet',
    bgCenter: '#23133b',
    bgMid: '#160b27',
    bgEdge: '#0b0516',
    gridColor: '#c084fc',
    gridOpacity: 0.17,
    primaryAccent: '#c084fc',
    secondaryAccent: '#22d3ee',
    panelFill: '#1a0e2e',
    panelStroke: '#a855f7',
    controlFill: '#082a23',
    controlStroke: '#34d399',
    witnessFill: '#211338',
    witnessStroke: '#fbbf24',
    patternKind: 'neural-mesh',
  },
  'alpine-grid-ice': {
    id: 'alpine-grid-ice',
    label: 'Power Grid & Airport Ice',
    bgCenter: '#10283d',
    bgMid: '#0b1d2e',
    bgEdge: '#05101a',
    gridColor: '#7dd3fc',
    gridOpacity: 0.16,
    primaryAccent: '#7dd3fc',
    secondaryAccent: '#f97316',
    panelFill: '#0c2033',
    panelStroke: '#38bdf8',
    controlFill: '#082b20',
    controlStroke: '#22c55e',
    witnessFill: '#102438',
    witnessStroke: '#facc15',
    patternKind: 'alpine-contours',
  },
  'telecom-rf-magenta': {
    id: 'telecom-rf-magenta',
    label: 'Broadcast & City Neon Magenta',
    bgCenter: '#2b122d',
    bgMid: '#1c0b1f',
    bgEdge: '#0f0511',
    gridColor: '#e879f9',
    gridOpacity: 0.16,
    primaryAccent: '#e879f9',
    secondaryAccent: '#38bdf8',
    panelFill: '#200e24',
    panelStroke: '#d946ef',
    controlFill: '#072a20',
    controlStroke: '#2dd4bf',
    witnessFill: '#25122b',
    witnessStroke: '#fbbf24',
    patternKind: 'rf-rings',
  },
  'cathedral-sepia-gold': {
    id: 'cathedral-sepia-gold',
    label: 'Courthouse & Library Sepia Gold',
    bgCenter: '#292017',
    bgMid: '#1c150f',
    bgEdge: '#100c08',
    gridColor: '#d97706',
    gridOpacity: 0.15,
    primaryAccent: '#f59e0b',
    secondaryAccent: '#38bdf8',
    panelFill: '#211912',
    panelStroke: '#d97706',
    controlFill: '#0a291e',
    controlStroke: '#34d399',
    witnessFill: '#261d14',
    witnessStroke: '#fde047',
    patternKind: 'cathedral-ribs',
  },
  'biolab-emerald': {
    id: 'biolab-emerald',
    label: 'City Park & Pharmacy Emerald',
    bgCenter: '#0d2b1f',
    bgMid: '#081d15',
    bgEdge: '#040f0b',
    gridColor: '#34d399',
    gridOpacity: 0.16,
    primaryAccent: '#34d399',
    secondaryAccent: '#fb7185',
    panelFill: '#0a2219',
    panelStroke: '#10b981',
    controlFill: '#072b28',
    controlStroke: '#22d3ee',
    witnessFill: '#0f281d',
    witnessStroke: '#facc15',
    patternKind: 'biolab-hex',
  },
  'sunset-highway-coral': {
    id: 'sunset-highway-coral',
    label: 'City Highway & Retail Coral',
    bgCenter: '#2f1920',
    bgMid: '#201017',
    bgEdge: '#12080d',
    gridColor: '#fb923c',
    gridOpacity: 0.15,
    primaryAccent: '#fb923c',
    secondaryAccent: '#38bdf8',
    panelFill: '#241319',
    panelStroke: '#f97316',
    controlFill: '#082a1e',
    controlStroke: '#4ade80',
    witnessFill: '#28161d',
    witnessStroke: '#fde047',
    patternKind: 'highway-lanes',
  },
  'desert-dish-terracotta': {
    id: 'desert-dish-terracotta',
    label: 'Border Crossing & Garage Terracotta',
    bgCenter: '#2e1d16',
    bgMid: '#1f130e',
    bgEdge: '#120a07',
    gridColor: '#f97316',
    gridOpacity: 0.15,
    primaryAccent: '#fb923c',
    secondaryAccent: '#2dd4bf',
    panelFill: '#231610',
    panelStroke: '#ea580c',
    controlFill: '#082a22',
    controlStroke: '#2dd4bf',
    witnessFill: '#271912',
    witnessStroke: '#facc15',
    patternKind: 'desert-radar',
  },
};

export const CAMERA_STYLE_OFFSETS: Record<
  CameraCompositionStyle,
  { posDelta: [number, number, number]; targetDelta: [number, number, number]; swayAmp: number }
> = {
  'establishing-high-left': {
    posDelta: [-2.4, 1.35, 0.8],
    targetDelta: [-0.35, 0.1, 0],
    swayAmp: 0.72,
  },
  'low-hero-right': {
    posDelta: [2.5, -0.75, -0.6],
    targetDelta: [0.35, 0.35, 0],
    swayAmp: 0.58,
  },
  'dramatic-diagonal-sweep': {
    posDelta: [-3.1, 0.65, -0.4],
    targetDelta: [0.45, 0.15, -0.35],
    swayAmp: 0.85,
  },
  'elevated-isometric-crane': {
    posDelta: [1.8, 2.15, 1.2],
    targetDelta: [0, -0.1, -0.25],
    swayAmp: 0.48,
  },
  'symmetric-cathedral-axis': {
    posDelta: [0.0, 0.25, 0.9],
    targetDelta: [0, 0.3, -0.4],
    swayAmp: 0.42,
  },
  'intimate-cutaway-dolly': {
    posDelta: [1.4, -0.4, -1.35],
    targetDelta: [0, 0.15, 0.2],
    swayAmp: 0.55,
  },
};
