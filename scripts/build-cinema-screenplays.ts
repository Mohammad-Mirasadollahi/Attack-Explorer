import fs from 'node:fs';
import path from 'node:path';
import { ATTACK_SCENARIOS } from '../lib/attack-scenarios';
import {
  findTechnicalJargonInStory,
  getSection3DDescriptor,
  listScenario3DSections,
} from '../lib/section-3d-registry';
import {
  ALL_REAL_WORLD_SET_IDS,
  CINEMA_ATMOSPHERES,
  CLIP_2D_THEMES,
  REAL_WORLD_ENVIRONMENTS,
  type CameraCompositionStyle,
  type CinemaAtmosphereId,
  type Clip2DCinemaTheme,
  type Clip2DLayoutGeometry,
  type ScenarioCinemaProfile,
  type SpatialSetArchetype,
} from '../lib/scenario-cinema-profiles-core';
import type { AttackCategory, AttackScenario } from '../modules/scenarios/types';

const ALL_ATMOSPHERES = Object.keys(CINEMA_ATMOSPHERES) as CinemaAtmosphereId[];
const ALL_CAMERA_STYLES: CameraCompositionStyle[] = [
  'establishing-high-left',
  'low-hero-right',
  'dramatic-diagonal-sweep',
  'elevated-isometric-crane',
  'symmetric-cathedral-axis',
  'intimate-cutaway-dolly',
];
const ALL_2D_THEMES = Object.keys(CLIP_2D_THEMES) as Clip2DCinemaTheme[];
const ALL_2D_LAYOUTS: Clip2DLayoutGeometry[] = [
  'horizontal-pipeline',
  'vertical-shaft-cascade',
  'orbital-hub-spokes',
  'diagonal-escalation-bridge',
  'split-mirror-comparison',
  'conveyor-assembly-track',
  'radial-broadcast-fan',
  'vault-cutaway-blueprint',
];

/**
 * Rich everyday real-world narrative templates for all 28 physical environments.
 * 100% jargon-free everyday language describing familiar places people visit in real life.
 */
interface PlaceStoryTemplate {
  /** Vivid opening setting description */
  settingIntro: string;
  /** How an intruder enters/starts in this place */
  entryScene: string;
  /** How the intruder exploits a flaw or swaps something in this place */
  pivotScene: string;
  /** How the intruder reaches the prized room/item or escapes */
  climaxScene: string;
  /** How staff/guards/cameras catch the mismatch */
  witnessScene: string;
  /** Side-by-side forensic inspection analogy in this exact place */
  forensicsScene: string;
  /** 2 floating 3D callout titles (plain everyday story names) */
  primaryCallout: string;
  secondaryCallout: string;
  /** 4 everyday story labels mapped to technical concepts */
  mappingLabels: [string, string, string, string];
  /** Per-act short plain-English story beats */
  actBeats: [string, string, string];
}

const PLACE_STORY_TEMPLATES: Record<SpatialSetArchetype, PlaceStoryTemplate> = {
  'bank-branch-vault': {
    settingIntro:
      'Picture a busy downtown bank branch with marble teller windows, brass counter bars, and a heavy circular steel vault at the rear.',
    entryScene:
      'At the front marble counter, a visitor wearing a borrowed courier coat hands the bank teller an official-looking transfer slip to slip past the velvet queue.',
    pivotScene:
      'Behind the teller partition, the intruder quietly swaps the genuine transfer seal and spins the steel wheel of the bank vault using borrowed clerk privileges.',
    climaxScene:
      'With the heavy steel vault door swung wide open, the intruder packs high-value ledger folders into a satchel while the front lobby appears completely calm.',
    witnessScene:
      'Only when the branch manager reviews the vault camera footage alongside the teller receipt book does the unauthorized vault visit stand out immediately.',
    forensicsScene:
      'Place the untouched bank branch master vault ledger side by side with the altered teller deposit slip: both carry the same branch stamp outside, yet the inner entries tell two completely different stories.',
    primaryCallout: 'Bank Teller Counter',
    secondaryCallout: 'Steel Bank Vault',
    mappingLabels: [
      'Borrowed Teller Transfer Slip',
      'Heavy Circular Steel Bank Vault',
      'Sealed Safe-Deposit Wall',
      'Branch Vault Camera & Ledger',
    ],
    actBeats: [
      'A visitor steps up to the marble bank teller window carrying a borrowed transfer slip.',
      'The heavy circular steel bank vault door unlocks and swings open behind the counter.',
      'The branch audit camera and teller ledger record the unscheduled vault opening.',
    ],
  },
  'office-building-reception': {
    settingIntro:
      'Imagine a modern glass office building where visitors check in with the front-desk receptionist, scan a badge at the lobby turnstile, and walk between glass-walled meeting rooms.',
    entryScene:
      'In the sunlit office building lobby, an unbadged visitor talks past the front-desk receptionist and persuades the desk clerk to print a temporary building pass.',
    pivotScene:
      'Instead of staying in the public waiting chairs, the visitor taps that pass at the lobby turnstile and walks down the hallway from one glass meeting room to the next.',
    climaxScene:
      'Inside the executive glass conference room, the intruder opens the unlocked cabinet and copies private project folders while staff walk by outside thinking they belong there.',
    witnessScene:
      'When building security compares the receptionist sign-in sheet against the turnstile badge swipes across the glass offices, the unescorted hallway trail is exposed.',
    forensicsScene:
      'Compare the receptionist’s clean morning visitor sheet on the left with the live glass-office badge swipe trail on the right to see exactly which rooms the unbadged guest entered.',
    primaryCallout: 'Reception Desk & Pass',
    secondaryCallout: 'Glass Office Rooms',
    mappingLabels: [
      'Front-Desk Receptionist & Visitor Pass',
      'Glass Meeting Rooms Down the Hall',
      'Public Lobby Waiting Chairs',
      'Reception Sign-In & Badge Log',
    ],
    actBeats: [
      'A visitor checks in at the office building reception desk and obtains a lobby badge.',
      'People walk past glass meeting rooms as the intruder slips through the turnstile into private offices.',
      'The receptionist logbook and hallway badge reader flag an unescorted entry.',
    ],
  },
  'airport-terminal-gate': {
    settingIntro:
      'Picture a bustling international airport terminal with glowing departure screens, an X-ray security arch, a boarding gate counter, and a commercial passenger airplane parked right outside on the tarmac.',
    entryScene:
      'Inside the airport terminal, a disguised passenger approaches the boarding gate carrying an altered boarding pass tucked inside an official airline jacket.',
    pivotScene:
      'At the security arch and gate desk, the scanner reads the legitimate airline logo on the pass and waves the passenger straight down the boarding bridge toward the airplane.',
    climaxScene:
      'Once aboard the parked passenger airplane on the tarmac, the intruder accesses the cabin service locker and redirects flight cargo manifests before takeoff.',
    witnessScene:
      'Airfield control tower logs and the boarding-gate manifest counter catch the mismatch when one extra passenger shows up on the jet without a matching ticket purchase.',
    forensicsScene:
      'Compare the original airline manifest at the airport gate desk with the live headcount inside the parked passenger airplane to spot the unscheduled stowaway immediately.',
    primaryCallout: 'Airport Security Gate',
    secondaryCallout: 'Parked Passenger Airplane',
    mappingLabels: [
      'Altered Airline Boarding Pass',
      'Parked Commercial Passenger Airplane',
      'Public Departures Concourse',
      'Boarding Gate Scanner & Tower Log',
    ],
    actBeats: [
      'A traveler walks through the airport terminal security arch toward the boarding gate.',
      'The gate agent waves the forged boarding pass onto the parked passenger airplane.',
      'The airport control tower and boarding scanner flag the mismatched flight manifest.',
    ],
  },
  'supermarket-retail-store': {
    settingIntro:
      'Think of a bright neighborhood supermarket filled with stocked grocery aisles, rolling shopping carts, barcode price stickers, and busy checkout conveyor belts.',
    entryScene:
      'Pushing a metal shopping cart down the supermarket aisles, a shopper peels a cheap barcode sticker off a small item and presses it cleanly onto a high-value boxed product.',
    pivotScene:
      'At the checkout lane, the cashier slides the box across the glowing barcode scanner, which blindly trusts the swapped sticker instead of inspecting what is inside the box.',
    climaxScene:
      'The checkout register rings up the disguised item as a harmless penny snack and prints an official supermarket receipt, letting the cart roll right out the automatic glass doors.',
    witnessScene:
      'When the store manager reconciles the checkout receipt tape against the aisle inventory count and overhead camera, the swapped barcode trick is caught red-handed.',
    forensicsScene:
      'Hold the supermarket’s original shelf inventory list next to the checkout register receipt tape: the outer barcode looks routine, yet the missing high-value item proves the swap.',
    primaryCallout: 'Supermarket Shopping Cart',
    secondaryCallout: 'Checkout Barcode Register',
    mappingLabels: [
      'Swapped Barcode Sticker in the Aisles',
      'Supermarket Checkout Register & Belt',
      'Locked Stockroom Back Door',
      'Receipt Tape & Aisle Camera',
    ],
    actBeats: [
      'A shopper pushes a cart down the stocked supermarket aisles and swaps a barcode label.',
      'The checkout conveyor scanner accepts the disguised box and rings up a routine receipt.',
      'The store inventory log and overhead checkout camera expose the mismatched price scan.',
    ],
  },
  'city-park-fountain': {
    settingIntro:
      'Imagine a sunlit city park with green lawns, shade trees, winding stone footpaths, wooden benches, and a tiered stone water fountain at the center.',
    entryScene:
      'Strolling along the city park footpath like an ordinary afternoon walker, a covert courier sits on a wooden bench near the stone fountain and tapes a coded note underneath the armrest.',
    pivotScene:
      'Minutes later, an accomplice walks past the central park fountain, retrieves the hidden slip from the bench without speaking a word, and drops a replacement set of instructions.',
    climaxScene:
      'Hidden in plain sight among joggers and park visitors, the pair moves confidential slips across the open park lawn without ever stepping near the guarded city hall across the street.',
    witnessScene:
      'A watchful park ranger at the corner kiosk notices the exact same bench receiving repeated timed drop-offs and logs the suspicious pattern on the patrol board.',
    forensicsScene:
      'Compare a normal afternoon snapshot of the quiet city park fountain bench with the ranger’s timed patrol log to expose the hidden drop-off rhythm.',
    primaryCallout: 'Park Bench & Footpath',
    secondaryCallout: 'Central Stone Fountain',
    mappingLabels: [
      'Hidden Note Under the Park Bench',
      'Central City Park Stone Fountain',
      'Quiet Botanical Greenhouse',
      'Park Ranger Kiosk Patrol Log',
    ],
    actBeats: [
      'A courier walks down the tree-lined city park footpath to a bench beside the fountain.',
      'Coded instructions change hands quietly beside the splashing central stone fountain.',
      'The park ranger kiosk logs the repeated timed exchanges along the footpath.',
    ],
  },
  'city-highway-toll-plaza': {
    settingIntro:
      'Picture a wide multi-lane city highway approaching an overhead exit sign gantry and a row of striped toll plaza booths with automated lifting barrier arms.',
    entryScene:
      'Cruising down the multi-lane express highway, a driver mounts a cloned electronic toll transponder behind the windshield right before entering the fast-pass lane.',
    pivotScene:
      'As the car rolls beneath the overhead highway gantry, the toll booth reader recognizes the cloned pass signal and automatically lifts the striped barrier arm.',
    climaxScene:
      'The vehicle accelerates smoothly through the express toll lane onto the restricted city bypass while every ordinary commuter waits in the cash queue next door.',
    witnessScene:
      'The highway authority’s overhead license-plate camera spots two different vehicles using the same toll pass minutes apart and sounds an immediate toll-plaza alert.',
    forensicsScene:
      'Put the registered commuter’s toll pass record side by side with the live highway gantry photograph to prove a different car drove through on that exact pass.',
    primaryCallout: 'Highway Express Sedan',
    secondaryCallout: 'Toll Plaza Barrier Gate',
    mappingLabels: [
      'Cloned Express Toll Transponder',
      'Lifting Highway Toll Barrier Arm',
      'Local Side-Road Ramp',
      'Overhead License-Plate Camera',
    ],
    actBeats: [
      'A car enters the multi-lane highway express lane carrying a cloned toll pass.',
      'The toll plaza booth reads the pass and lifts the striped barrier arm automatically.',
      'The overhead highway license-plate camera catches the duplicate toll pass crossing.',
    ],
  },
  'city-street-intersection': {
    settingIntro:
      'Imagine a lively downtown city street intersection with painted zebra crosswalks, glowing red-yellow-green traffic lights, corner shop awnings, and passing yellow taxis.',
    entryScene:
      'At the busy downtown street corner, an impostor wearing a reflective utility vest kneels beside the metal traffic-signal control cabinet while pedestrians cross the street.',
    pivotScene:
      'Opening the unlocked cabinet panel, the impostor rewires the corner traffic light timer so every lane turns green at once and steers a yellow taxi down a side alley.',
    climaxScene:
      'Traffic signals flip out of rhythm across the city intersection, creating instant confusion that lets an unmarked courier slip past the corner storefront unseen.',
    witnessScene:
      'The city intersection camera and municipal traffic control board detect the impossible all-green light timing and dispatch a traffic officer immediately.',
    forensicsScene:
      'Compare the city’s standard intersection traffic-light schedule against the live corner signal cabinet state to pinpoint the tampered relay instantly.',
    primaryCallout: 'Street Corner Traffic Light',
    secondaryCallout: 'Crosswalk & City Taxi',
    mappingLabels: [
      'Tampered Corner Signal Control Box',
      'Downtown Crosswalk & Traffic Lights',
      'Neighboring Sidewalk Cafe',
      'Intersection Traffic Camera',
    ],
    actBeats: [
      'An impostor in a utility vest opens the street-corner traffic signal cabinet.',
      'The glowing traffic lights shift out of sequence as a yellow city taxi reroutes across the crosswalk.',
      'The downtown intersection camera alerts city traffic control to the abnormal signal timing.',
    ],
  },
  'train-station-platform': {
    settingIntro:
      'Picture a grand central train station with an arched iron canopy, hanging station clock, ticket turnstiles, parallel railway tracks, and a sleek express train waiting at the platform.',
    entryScene:
      'Beneath the central train station canopy, a stowaway slips past the platform ticket barrier using a copied conductor punch card right before boarding time.',
    pivotScene:
      'Walking beside the railway tracks, the stowaway flips a track-routing switch lever so the express passenger train is redirected onto an unguarded freight siding.',
    climaxScene:
      'With the station clock ticking, the express locomotive pulls onto the alternate siding where unauthorized cargo bags are transferred off the rear coach.',
    witnessScene:
      'The station master’s glowing track-indicator board flashes a route mismatch the instant the express train leaves its scheduled platform line.',
    forensicsScene:
      'Compare the train station’s printed timetable on the left with the live railway switchboard indicator on the right to uncover the unauthorized track diversion.',
    primaryCallout: 'Station Platform & Gate',
    secondaryCallout: 'Express Passenger Train',
    mappingLabels: [
      'Copied Conductor Ticket Punch',
      'Express Locomotive & Track Switch',
      'Eastbound Local Commuter Track',
      'Station Master Signal Board',
    ],
    actBeats: [
      'A stowaway passes the central train station ticket barrier beneath the station clock.',
      'A flipped track lever diverts the express passenger train away from its scheduled rail line.',
      'The station master’s signal board flags the unscheduled track switch immediately.',
    ],
  },
  'subway-metro-station': {
    settingIntro:
      'Imagine an underground city subway metro station with tiled tunnel walls, glowing route maps, chrome fare turnstiles, ticket kiosks, and a gleaming metro train sliding along the platform.',
    entryScene:
      'Down in the underground subway concourse, a rider taps a replayed magnetic metro fare card at the chrome turnstile bank during evening rush hour.',
    pivotScene:
      'The turnstile arm clicks open, letting the rider step onto the platform and slip through the driver’s unlocked service door at the front of the subway car.',
    climaxScene:
      'Inside the subway cab, the intruder reads the station relay schedule and triggers an unauthorized express skip past the next inspection stop.',
    witnessScene:
      'The metro booth attendant’s fare-gate console flags a single card swiped at two distant stations within seconds and alerts transit security.',
    forensicsScene:
      'Line up the original metro card balance record beside the live turnstile swipe log to prove the exact fare token was replayed underground.',
    primaryCallout: 'Metro Fare Turnstile',
    secondaryCallout: 'Underground Subway Car',
    mappingLabels: [
      'Replayed Subway Metro Fare Card',
      'Underground Subway Train Car',
      'Emergency Platform Exit Stairs',
      'Metro Fare-Gate Audit Console',
    ],
    actBeats: [
      'A rider taps a cloned metro card at the chrome underground subway turnstile.',
      'The subway doors slide open and the intruder accesses the train’s service cabin.',
      'The metro booth audit console flags the impossible duplicate fare-card tap.',
    ],
  },
  'hospital-triage-ward': {
    settingIntro:
      'Picture a clean city hospital ward with a red-cross triage check-in desk, curtained patient exam bays, a wall of labeled medicine cabinets, and rolling stainless-steel medical carts.',
    entryScene:
      'Walking briskly past the hospital triage desk in a borrowed white lab coat, an intruder grabs a spare clipboard and wheels a rolling medical cart down the ward corridor.',
    pivotScene:
      'Because every nurse assumes someone pushing an official medical cart belongs on shift, the intruder pulls confidential patient charts and opens the medicine supply drawer.',
    climaxScene:
      'Quietly photocopying records onto a hidden notepad while standing beside the exam bay, the intruder wheels the cart right back toward the elevator lobby.',
    witnessScene:
      'The head triage nurse checks the electronic shift roster at the nurse station and spots a lab-coat visitor who was never assigned to that hospital ward.',
    forensicsScene:
      'Compare the verified hospital shift roster at the triage desk against the live medicine-cart access sheet to expose the unauthorized hallway round.',
    primaryCallout: 'Hospital Triage Desk',
    secondaryCallout: 'Rolling Medicine Cart',
    mappingLabels: [
      'Borrowed Lab Coat & Clipboard',
      'Patient Ward & Medicine Cart',
      'Sealed Clean-Supply Closet',
      'Nurse Station Shift Roster Audit',
    ],
    actBeats: [
      'An intruder in a borrowed lab coat walks past the red-cross hospital triage desk.',
      'Pushing a rolling medical cart, the impostor pulls confidential charts along the patient ward.',
      'The nurse station roster check catches the unassigned visitor on the ward floor.',
    ],
  },
  'post-office-sorting-hub': {
    settingIntro:
      'Think of a classic neighborhood post office with brass P.O. boxes lining the back wall, a parcel scale counter, a blue street mailbox outside, and angled mail sorting chutes.',
    entryScene:
      'At the neighborhood post office counter, a sender slips tiny coded lines onto the back of ordinary postcards and drops them one by one into the mail sorting slot.',
    pivotScene:
      'Because each postcard carries valid postage and a harmless street address, the postal clerk stamps them smoothly and sends them down the brass sorting chute.',
    climaxScene:
      'One harmless postcard at a time, an entire confidential binder is smuggled right out of the post office without ever raising the heavy parcel-inspection alarm.',
    witnessScene:
      'The postmaster reviews the evening dispatch ledger and spots hundreds of oddly coded postcards all mailed to the exact same remote P.O. box.',
    forensicsScene:
      'Lay an ordinary neighbor’s postcard next to the coded stack pulled from the sorting chute to reveal the hidden message stitched across the address lines.',
    primaryCallout: 'Post Office Sorting Counter',
    secondaryCallout: 'Brass P.O. Box Wall',
    mappingLabels: [
      'Coded Postcard Batch at the Counter',
      'Mail Sorting Chute & P.O. Box Wall',
      'Registered Certified Mail Safe',
      'Postmaster Evening Dispatch Ledger',
    ],
    actBeats: [
      'A sender feeds a stream of coded postcards into the neighborhood post office slot.',
      'Each stamped card slides down the sorting chute into the brass P.O. box wall.',
      'The postmaster’s dispatch ledger flags the abnormal flood of identical destination cards.',
    ],
  },
  'grand-hotel-lobby': {
    settingIntro:
      'Picture a sunlit grand hotel lobby with a polished marble concierge desk, a golden wall of numbered room-key hooks, velvet luggage carts, and brass elevator doors.',
    entryScene:
      'Stepping up to the grand hotel concierge desk, a guest writes a cleverly worded forwarding note inside the open leather guestbook ledger.',
    pivotScene:
      'When the helpful hotel concierge reads that line aloud and phones the unlisted number written in the guestbook, the stranger on the line dictates fresh room-access orders.',
    climaxScene:
      'Following the caller’s instructions, the concierge hands over a brass master room key from the back rack and unlocks the private elevator floor.',
    witnessScene:
      'The hotel switchboard call log catches an unexpected outside phone call triggered directly from a routine guestbook check-in entry.',
    forensicsScene:
      'Compare a standard hotel guestbook registration line against the tampered page beside the concierge desk to see the exact forwarding trick that triggered the outside call.',
    primaryCallout: 'Hotel Concierge Desk',
    secondaryCallout: 'Brass Room-Key Rack',
    mappingLabels: [
      'Trick Note Written in the Guestbook',
      'Brass Room-Key Rack & Elevator',
      'Penthouse Private Safe',
      'Hotel Switchboard Call Log',
    ],
    actBeats: [
      'A guest writes a hidden forwarding instruction inside the grand hotel guestbook.',
      'The concierge dials the outside number and pulls a master key from the brass key rack.',
      'The hotel switchboard log flags the unexpected outbound call from the front desk.',
    ],
  },
  'shipping-port-container-yard': {
    settingIntro:
      'Imagine a bustling coastal shipping port with blue harbor water, stacked colorful steel cargo containers, a towering yellow overhead gantry crane, and a moored cargo ship.',
    entryScene:
      'Out on the concrete harbor pier, a worker notices a single shipping container whose side inspection hatch was accidentally left unlatched during loading.',
    pivotScene:
      'Slipping out through that open container hatch while the yellow gantry crane swings overhead, the stowaway steps straight onto the restricted customs dockyard.',
    climaxScene:
      'Now roaming freely outside the sealed steel box, the intruder walks across the shipping port pier and alters manifests bound for the moored cargo ship.',
    witnessScene:
      'The port authority watchtower spots footsteps leaving a supposedly sealed container bay and compares the manifest seal numbers against the pier camera.',
    forensicsScene:
      'Inspect a factory-sealed harbor container beside the unlatched box on the pier: identical paint outside, but a broken inner latch revealing the dockyard breakout.',
    primaryCallout: 'Harbor Gantry Crane',
    secondaryCallout: 'Stacked Cargo Containers',
    mappingLabels: [
      'Unlatched Steel Container Hatch',
      'Harbor Pier & Moored Cargo Ship',
      'Sealed Bonded Export Yard',
      'Port Authority Manifest Watch',
    ],
    actBeats: [
      'A stowaway opens an unlatched side hatch inside a stacked steel cargo container.',
      'Beneath the yellow gantry crane, the intruder steps onto the restricted shipping port pier.',
      'The port authority manifest watch detects the broken container seal on the dock.',
    ],
  },
  'factory-assembly-line': {
    settingIntro:
      'Picture an active industrial factory floor with a moving assembly conveyor belt, an articulated yellow robotic arm, steel parts bins, and a final quality-seal stamping desk.',
    entryScene:
      'During the quiet night shift on the factory floor, a saboteur steps beside the moving assembly conveyor right before the automated quality stamp.',
    pivotScene:
      'The robotic arm pauses for a heartbeat as the saboteur swaps one genuine component on the belt for an identical-looking counterfeit part carrying a hidden wire.',
    climaxScene:
      'The assembly line rolls forward, the factory press stamps the official warranty seal right onto the tampered unit, and trucks ship it to every trusting customer.',
    witnessScene:
      'Only when a quality engineer checks the finished product’s weight and internal wiring against the locked master blueprint cabinet does the factory-line swap appear.',
    forensicsScene:
      'Place an authentic unit from the factory’s master blueprint cabinet right beside a finished box from the tampered conveyor line to spot the hidden extra part immediately.',
    primaryCallout: 'Assembly Conveyor Belt',
    secondaryCallout: 'Robotic Stamp Station',
    mappingLabels: [
      'Counterfeit Part Dropped on the Belt',
      'Moving Factory Assembly Conveyor',
      'Locked Master Blueprint Cabinet',
      'Quality Inspection Line Camera',
    ],
    actBeats: [
      'A counterfeit part is slipped onto the moving factory assembly line before inspection.',
      'The robotic arm and stamping press seal the tampered box with an official factory badge.',
      'The quality inspection camera and blueprint check expose the altered assembly unit.',
    ],
  },
  'public-library-archive': {
    settingIntro:
      'Imagine a quiet city public library with towering mahogany bookshelves packed with colorful books, green banker lamps on reading tables, a checkout desk, and a locked rare-book cage.',
    entryScene:
      'Inside the calm public library reading hall, a visitor pulls an index card from the wooden catalog drawer and alters the shelf call-number to point into the staff archive.',
    pivotScene:
      'Handing that altered slip to the desk clerk under the warm green reading lamps, the visitor gets waved straight past the counter into the restricted rare-book cage.',
    climaxScene:
      'Hidden behind the tall mahogany bookshelves, the intruder photographs rare ledger volumes that were never meant to leave the locked archive room.',
    witnessScene:
      'When the head librarian audits the evening circulation ledger, a restricted rare-book call number checked out on a regular visitor card immediately raises the alarm.',
    forensicsScene:
      'Compare the original library catalog card against the tampered checkout slip under the reading lamp to reveal the unauthorized redirect into the rare-book room.',
    primaryCallout: 'Library Bookshelves & Desk',
    secondaryCallout: 'Locked Rare-Book Cage',
    mappingLabels: [
      'Altered Library Catalog Call Slip',
      'Mahogany Shelves & Rare-Book Cage',
      'General Fiction Reading Tables',
      'Library Circulation Audit Ledger',
    ],
    actBeats: [
      'A visitor alters a call-number card at the public library checkout counter.',
      'Guided past the mahogany bookshelves, the intruder gains access to the rare-book cage.',
      'The head librarian’s circulation ledger catches the restricted archive withdrawal.',
    ],
  },
  'restaurant-kitchen-drivethru': {
    settingIntro:
      'Picture a bustling restaurant kitchen with a stainless-steel pass-through counter, a hanging rail of paper order tickets, a glowing drive-thru window, and a line chef at the stove.',
    entryScene:
      'Pulling up to the restaurant drive-thru window, a clever customer asks for a routine meal while sneaking an extra kitchen command onto the special-notes line of the order.',
    pivotScene:
      'When the cashier clips that paper slip onto the stainless-steel kitchen ticket rail, the busy line chef reads the hidden note literally as a direct manager instruction.',
    climaxScene:
      'Instead of serving only the paid sandwich, the kitchen passes the back-office recipe binder and extra stock straight out through the pickup window.',
    witnessScene:
      'The restaurant manager inspects the kitchen receipt printer tape and spots an impossible order note that gave away stock without a matching sale.',
    forensicsScene:
      'Hold a clean customer order slip beside the tampered kitchen rail ticket to see the exact extra line that tricked the chef into opening the back room.',
    primaryCallout: 'Drive-Thru Order Window',
    secondaryCallout: 'Kitchen Ticket Rail',
    mappingLabels: [
      'Extra Command Written on Order Slip',
      'Restaurant Kitchen Pass-Through Rail',
      'Sealed Pantry Cold Room',
      'Kitchen POS Receipt Printer',
    ],
    actBeats: [
      'A customer slips an extra command onto a routine restaurant drive-thru order.',
      'Clipped onto the kitchen ticket rail, the disguised note tricks the line chef into extra actions.',
      'The restaurant manager’s receipt printer log flags the abnormal kitchen instruction.',
    ],
  },
  'cinema-theater-stage': {
    settingIntro:
      'Imagine a classic downtown cinema theater with a glowing marquee ticket booth, red-carpet aisle, velvet stage curtains, warm spotlights, and an elevated projection room.',
    entryScene:
      'Slipping past the red-carpet ticket booth during intermission, an impostor carrying a spare film canister walks backstage behind the heavy crimson velvet curtains.',
    pivotScene:
      'Up in the darkened projection booth, the impostor swaps the scheduled feature reel for an altered copy before the theater lights dim again.',
    climaxScene:
      'As the velvet curtains part under the spotlights, the entire audience watches the substituted reel while the front lobby box office still lists the original movie title.',
    witnessScene:
      'The theater manager checks the projection booth reel log against the marquee schedule and immediately halts the show upon spotting the swapped canister.',
    forensicsScene:
      'Inspect the original studio film canister from the box office beside the swapped reel loaded in the projection booth to uncover the backstage substitution.',
    primaryCallout: 'Cinema Ticket Booth',
    secondaryCallout: 'Velvet Stage & Projector',
    mappingLabels: [
      'Swapped Film Reel Canister',
      'Velvet Curtain Stage & Projector',
      'Front Lobby Concession Counter',
      'Projection Booth Reel Log',
    ],
    actBeats: [
      'An impostor slips past the red-carpet cinema ticket booth carrying a lookalike film canister.',
      'Behind the velvet curtains, the projector reel is swapped before the stage lights dim.',
      'The projection booth log catches the mismatch between the marquee and the running reel.',
    ],
  },
  'museum-gallery-hall': {
    settingIntro:
      'Picture a stately national art museum gallery with framed paintings on marble walls, velvet stanchion ropes, illuminated glass display pedestals, and thin security laser beams.',
    entryScene:
      'Inside the hushed art museum hall, a thief studies how the velvet stanchions and glass pedestal sensors respond to routine curator maintenance checks.',
    pivotScene:
      'Using a mirror-angle trick that satisfies the glass case laser beam, the thief lifts the cover and swaps a priceless artifact for a weight-matched replica.',
    climaxScene:
      'The glass pedestal seals back down without tripping the lobby bell, leaving visitors admiring a convincing decoy behind the velvet ropes.',
    witnessScene:
      'During closing inspection, the museum curator checks the gallery motion-sensor log and spots a brief laser shadow that never matched any scheduled restoration.',
    forensicsScene:
      'Place the museum’s certified provenance photo next to a close-up scan of the glass pedestal to expose the tiny flaw in the swapped replica.',
    primaryCallout: 'Velvet Rope Gallery',
    secondaryCallout: 'Laser Glass Pedestal',
    mappingLabels: [
      'Weight-Matched Decoy Replica',
      'Laser-Guarded Glass Display Case',
      'Permanent Restoration Wing',
      'Gallery Motion-Sensor Console',
    ],
    actBeats: [
      'An intruder approaches the velvet stanchion ropes inside the quiet art museum gallery.',
      'Bypassing the thin glass-case beam, the thief swaps the display piece for a convincing decoy.',
      'The museum guard console logs an unscheduled sensor shadow around the glass pedestal.',
    ],
  },
  'courthouse-notary-hall': {
    settingIntro:
      'Imagine a grand city courthouse hall with fluted marble columns, an elevated wooden judge bench, a witness stand, and a brass wax-seal notary stamping desk.',
    entryScene:
      'Entering the marble courthouse hall during a crowded docket, a forger requests a routine certified copy at the notary clerk’s brass stamping counter.',
    pivotScene:
      'Taking advantage of an unguarded moment at the notary desk, the forger lifts the impression of the courthouse wax seal and stamps a stack of unauthorized passes offline.',
    climaxScene:
      'Every forged document now bears the court’s own authentic wax emblem, letting the holder command authority in any neighboring municipal hall.',
    witnessScene:
      'The court bailiff audits the official notary stamp registry and discovers stamped certificates that were never entered into the judge’s docket book.',
    forensicsScene:
      'Compare the court’s bound docket book against the forged wax-stamped certificate to prove the seal was pressed outside official courthouse hours.',
    primaryCallout: 'Courthouse Notary Desk',
    secondaryCallout: 'Judge Bench & Wax Seal',
    mappingLabels: [
      'Forged Courthouse Wax-Seal Pass',
      'Marble Hall & Brass Notary Press',
      'Sealed Judicial Record Vault',
      'Court Bailiff Stamp Registry',
    ],
    actBeats: [
      'A forger approaches the marble courthouse notary desk requesting a routine stamped voucher.',
      'Using a lifted seal impression, the forger presses official-looking passes away from the judge bench.',
      'The court bailiff’s stamp registry flags high-privilege certificates missing from the docket.',
    ],
  },
  'coffee-shop-cafe': {
    settingIntro:
      'Picture a cozy corner coffee shop and co-working cafe with a striped storefront awning, warm wooden espresso bar, glass pastry case, and laptops open across bistro tables.',
    entryScene:
      'Sitting quietly at a corner bistro table near the espresso bar, a patron sets up a lookalike free coffee-shop guest board to attract nearby customers.',
    pivotScene:
      'As regulars order lattes from the barista and type in their work details at the window tables, their conversations and login slips pass straight across the eavesdropper’s table.',
    climaxScene:
      'Before the morning rush even finishes, the patron pockets copied credentials and walks out beneath the cafe awning without spilling a single cup.',
    witnessScene:
      'The cafe manager notices a strange second sign-in notice taped beside the pastry case and alerts customers to the fake hotspot at the corner table.',
    forensicsScene:
      'Compare the real coffee-shop receipt notice from the barista counter against the lookalike flyer left on the corner bistro table to expose the impostor.',
    primaryCallout: 'Cafe Espresso Bar',
    secondaryCallout: 'Corner Bistro Tables',
    mappingLabels: [
      'Lookalike Cafe Sign-In Trap',
      'Espresso Bar & Co-Working Tables',
      'Roastery Bean Storage Room',
      'Cafe Manager Order Screen',
    ],
    actBeats: [
      'A patron sets up a lookalike sign-in trap at a corner bistro table inside the coffee shop.',
      'Unsuspecting customers by the espresso bar share private slips across the rigged cafe table.',
      'The cafe manager’s order screen catches the rogue sign-in station beside the pastry case.',
    ],
  },
  'car-repair-garage': {
    settingIntro:
      'Imagine a neighborhood auto repair garage with a wide roll-up shutter bay, a red rolling tool chest, spare tire racks, and a twin-post hydraulic car lift raising a sedan off the floor.',
    entryScene:
      'Rolling a familiar customer sedan into the repair garage bay, a rogue mechanic hits the hydraulic switch to lift the car high above the concrete floor.',
    pivotScene:
      'Working underneath the raised chassis out of sight of the front waiting counter, the mechanic bolts a hidden bypass module directly onto the car’s starter wiring.',
    climaxScene:
      'Lowered back onto its wheels and washed spotless outside, the sedan drives off the garage lot carrying a hidden ignition backdoor that activates on every future start.',
    witnessScene:
      'During the next routine safety inspection, the shop foreman raises the sedan on the lift and spots the unrecorded aftermarket wire bolted beneath the frame.',
    forensicsScene:
      'Compare the car’s factory underside diagram from the parts rack against the live lifted chassis in the repair garage to spot the unauthorized bypass module instantly.',
    primaryCallout: 'Garage Service Bay',
    secondaryCallout: 'Hydraulic Car Lift & Sedan',
    mappingLabels: [
      'Hidden Bypass Module Under the Hood',
      'Sedan Raised on Hydraulic Car Lift',
      'Factory Sealed Spare-Parts Rack',
      'Garage Service Checklist Board',
    ],
    actBeats: [
      'A sedan rolls through the open auto repair garage shutter onto the twin-post hydraulic lift.',
      'Beneath the lifted car, a rogue mechanic installs a hidden bypass module into the wiring.',
      'The shop foreman’s inspection checklist flags the undocumented part bolted under the chassis.',
    ],
  },
  'university-exam-hall': {
    settingIntro:
      'Picture a brick university lecture and exam hall with tiered wooden student desks, a tall green chalkboard, hallway lockers, and a wooden proctor podium at the front.',
    entryScene:
      'Inside the quiet university exam hall, a student slips hidden extra directions written in faint pencil into the margin of a submitted study booklet.',
    pivotScene:
      'When the exam proctor at the front podium feeds that booklet into the automated grading helper, the hidden margin text overrides the proctor’s grading instructions.',
    climaxScene:
      'Following the concealed instructions verbatim, the helper opens the answer-key folder on the podium and emails the exam sheet straight back out of the hall.',
    witnessScene:
      'The university dean reviews the exam hall proctor log and flags an automated grading run that tried to access locked answer folders mid-session.',
    forensicsScene:
      'Place a clean blank exam booklet next to the tampered submission on the proctor podium to expose the hidden margin instructions that hijacked the grading helper.',
    primaryCallout: 'University Exam Desks',
    secondaryCallout: 'Proctor Podium & Board',
    mappingLabels: [
      'Hidden Margin Note in Exam Booklet',
      'Front Proctor Podium & Answer Key',
      'Locked Registrar Grade Cabinet',
      'Exam Hall Proctor Audit Log',
    ],
    actBeats: [
      'A student places hidden instructions inside a study booklet in the university exam hall.',
      'At the front proctor podium, the grading assistant obeys the hidden note and opens the answer key.',
      'The exam hall proctor log flags the unauthorized access to the locked grading folder.',
    ],
  },
  'apartment-lobby-intercom': {
    settingIntro:
      'Imagine a brick city apartment building entrance with a glass vestibule, a wall of brass resident mailboxes, a doorman podium, and a glowing brass intercom buzzer panel.',
    entryScene:
      'Standing outside the locked glass apartment vestibule, an uninvited caller presses a crafted sequence on the brass intercom buzzer pretending to be building maintenance.',
    pivotScene:
      'Fooled by the caller’s voice over the lobby intercom, the building doorman buzzes open the interior lobby door and reads out the hallway elevator code.',
    climaxScene:
      'Slipping past the brass resident mailboxes straight into the elevator, the intruder gains access to private upper-floor corridors without ever owning an apartment key.',
    witnessScene:
      'The doorman checks the visitor sign-in ledger against the intercom buzz history and realizes no maintenance visit was ever scheduled by management.',
    forensicsScene:
      'Compare the building manager’s official maintenance work-order sheet with the apartment lobby intercom buzz log to uncover the tailgater’s trick.',
    primaryCallout: 'Brass Intercom Buzzer',
    secondaryCallout: 'Apartment Lobby & Elevator',
    mappingLabels: [
      'Spoofed Maintenance Call on Intercom',
      'Apartment Lobby Door & Mailboxes',
      'Resident Locked Mailbox Bank',
      'Doorman Visitor Sign-In Book',
    ],
    actBeats: [
      'An outsider triggers the brass intercom buzzer outside the locked apartment vestibule.',
      'The lobby door clicks open, letting the intruder walk past the resident mailboxes to the elevator.',
      'The doorman’s visitor logbook exposes the unscheduled buzz-in entry.',
    ],
  },
  'border-passport-control': {
    settingIntro:
      'Picture an international border crossing checkpoint with glass passport inspection booths, zig-zag queue stanchions, an X-ray luggage conveyor belt, and a striped crossing barrier.',
    entryScene:
      'Approaching the international border crossing, a traveler steps up to the glass passport booth carrying a travel booklet with a subtly altered entry stamp.',
    pivotScene:
      'While the customs scanner checks only the outer cover of the passport, the forged interior page clears the glass booth and the striped crossing barrier swings upward.',
    climaxScene:
      'Rolling luggage smoothly off the X-ray conveyor into the secure arrival hall, the traveler crosses the border wearing an official-looking entry clearance.',
    witnessScene:
      'A secondary customs officer cross-checks the border passport registry and catches a stamp serial number that was never issued by that embassy.',
    forensicsScene:
      'Place an authentic embassy passport stamp next to the traveler’s altered page under the border booth lamp to expose the forged ink instantly.',
    primaryCallout: 'Border Passport Booth',
    secondaryCallout: 'Luggage X-Ray & Barrier',
    mappingLabels: [
      'Altered Passport Entry Stamp',
      'Border Glass Booth & Crossing Gate',
      'Diplomatic Sealed Pouch Lane',
      'Customs Passport Registry',
    ],
    actBeats: [
      'A traveler presents an altered travel booklet at the international border passport booth.',
      'The luggage X-ray clears and the striped border crossing barrier lifts open.',
      'The customs passport registry flags the invalid stamp serial number.',
    ],
  },
  'broadcast-tv-studio': {
    settingIntro:
      'Imagine a live television and radio broadcast studio with a glowing red ON AIR sign, a soundproof control-room window, a sliding mixing console, and a rooftop signal dish.',
    entryScene:
      'Slipping into the broadcast control room beside the soundproof glass window, an unlisted engineer patches a covert jumper cord straight into the live mixing console.',
    pivotScene:
      'As the red ON AIR sign lights up above the studio floor, the covert bridge silently mirrors every studio feed up to the spinning rooftop signal dish.',
    climaxScene:
      'Outside the building, the intruder tunes in to every private studio channel in real time while the broadcast director hears zero static in the headphones.',
    witnessScene:
      'The master control broadcast log spots an unscheduled auxiliary transmitter channel pulling signal off the mixing board and cuts the rogue patch.',
    forensicsScene:
      'Compare the studio’s clean patch-bay diagram with the live mixing console board to reveal the extra covert cord tapping the broadcast signal.',
    primaryCallout: 'Studio Mixing Console',
    secondaryCallout: 'ON AIR Roof Signal Dish',
    mappingLabels: [
      'Covert Jumper Cord on Mixing Board',
      'Live ON AIR Studio & Roof Dish',
      'Backup Emergency Transmitter',
      'Master Control Broadcast Log',
    ],
    actBeats: [
      'An unlisted technician connects a hidden patch cord into the TV studio mixing console.',
      'Under the glowing ON AIR sign, live feeds beam straight out through the rooftop signal dish.',
      'The master control broadcast log flags the unauthorized outbound transmitter channel.',
    ],
  },
  'power-substation-waterworks': {
    settingIntro:
      'Picture a fenced municipal power substation and waterworks yard lined with tall ceramic insulator towers, heavy steel water pipes, red manual valve wheels, and a glass control room.',
    entryScene:
      'Breaching the fenced perimeter of the municipal power substation, an impostor connects a handheld controller straight into the yard’s switchboard cabinet.',
    pivotScene:
      'Sending unauthorized commands along the control wire, the impostor trips the main high-voltage breaker arm and cranks the heavy waterworks valve wheel off balance.',
    climaxScene:
      'Even as lights flicker across the district and pressure climbs inside the pipes, a falsified dial inside the glass control room keeps displaying steady green readings.',
    witnessScene:
      'The grid shift engineer notices the physical breaker clank outside disagrees with the frozen green gauge on the desk and pulls the mechanical override.',
    forensicsScene:
      'Compare the physical substation breaker arm and pipe pressure gauge in the yard against the fake green telemetry screen inside the control room.',
    primaryCallout: 'Substation Breaker Yard',
    secondaryCallout: 'Pipe Valve & Control Room',
    mappingLabels: [
      'Rogue Switchboard Command Box',
      'High-Voltage Breaker & Pipe Valve',
      'Isolated Backup Generator Bay',
      'Control Room Gauge Recorder',
    ],
    actBeats: [
      'An intruder connects a rogue controller inside the fenced municipal power substation yard.',
      'The master breaker switch trips and heavy waterworks valves twist out of safe alignment.',
      'The control room gauge recorder catches the sudden drop in physical yard output.',
    ],
  },
  'pharmacy-prescription-lab': {
    settingIntro:
      'Think of a bright neighborhood pharmacy with a glass prescription drop-off window, rows of labeled medicine bottles on a rotating carousel wall, and a pickup counter bell.',
    entryScene:
      'At the neighborhood pharmacy drop-off window, a caller slides across a prescription slip whose dosage instructions were subtly rewritten while keeping the doctor’s header.',
    pivotScene:
      'Trusting the familiar letterhead, the pharmacy counter rotates the medicine bottle carousel and prepares a restricted bottle without double-checking the original clinic.',
    climaxScene:
      'Ringing the pickup counter bell, the intruder collects the restricted bottle in an ordinary paper pharmacy bag and steps straight out onto the sidewalk.',
    witnessScene:
      'The head pharmacist reviews the evening dispensing ledger and flags a controlled-cabinet refill that lacks a matching clinic verification signature.',
    forensicsScene:
      'Lay the original clinic prescription order beside the altered paper slip at the pharmacy window to expose the tampered dosage line immediately.',
    primaryCallout: 'Pharmacy Drop-Off Window',
    secondaryCallout: 'Medicine Bottle Carousel',
    mappingLabels: [
      'Altered Prescription Slip at Window',
      'Medicine Bottle Carousel Wall',
      'Double-Locked Controlled Cabinet',
      'Pharmacy Dispensing Ledger',
    ],
    actBeats: [
      'An altered prescription slip is slid through the neighborhood pharmacy drop-off window.',
      'The medicine bottle carousel spins to dispense a restricted item in a plain pickup bag.',
      'The pharmacy dispensing ledger flags the unverified controlled prescription.',
    ],
  },
  'warehouse-forklift-bay': {
    settingIntro:
      'Imagine a high-ceiling logistics warehouse with towering steel pallet racks stacked with labeled shipping crates, clipboard dock stations, and a bright yellow forklift cruising down the aisle.',
    entryScene:
      'Inside the bustling logistics warehouse, an unverified driver climbs into a parked yellow forklift and rolls toward the high-bay customer storage racks.',
    pivotScene:
      'Lifting stacked pallets off the shelves, the driver slaps a brand-new shipping barcode and their own heavy padlock onto every customer crate in the bay.',
    climaxScene:
      'When the real warehouse dispatcher arrives for morning pickup, every pallet is locked behind someone else’s key and rerouted toward an unknown loading dock.',
    witnessScene:
      'The warehouse barcode inventory system flashes an urgent alert when hundreds of customer pallets are relabeled in minutes outside normal shift hours.',
    forensicsScene:
      'Compare the original inbound warehouse pallet manifest against the relabeled crates stacked on the yellow forklift to trace every hijacked shipment.',
    primaryCallout: 'Warehouse Pallet Racks',
    secondaryCallout: 'Yellow Forklift & Dock',
    mappingLabels: [
      'Rogue Shipping Labels & Padlocks',
      'High-Bay Pallet Racks & Forklift',
      'Quarantined Audit Cage',
      'Warehouse Barcode Inventory Log',
    ],
    actBeats: [
      'An unauthorized driver steers a yellow forklift down the logistics warehouse pallet aisle.',
      'Customer crates are lifted off the high racks, relabeled, and sealed with rogue padlocks.',
      'The warehouse barcode inventory system alerts dispatch to the mass pallet relabeling.',
    ],
  },
};

/**
 * Curated iconic real-world place assignments for flagship & well-known scenarios
 * so every major everyday place shines right at the top of the catalog.
 */
const FLAGSHIP_PLACE_OVERRIDES: Record<
  string,
  {
    place: SpatialSetArchetype;
    atmosphere?: CinemaAtmosphereId;
    theme2D?: Clip2DCinemaTheme;
    layout2D?: Clip2DLayoutGeometry;
    filmTitle?: string;
  }
> = {
  'process-hollowing': {
    place: 'bank-branch-vault',
    atmosphere: 'azure-shinkai-day',
    theme2D: 'blueprint-cyan',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'The Hollowed Armored Transport',
  },
  'log4shell-dfir': {
    place: 'grand-hotel-lobby',
    atmosphere: 'warm-brass-grand-hotel',
    theme2D: 'grand-hotel-brass',
    layout2D: 'diagonal-escalation-bridge',
    filmTitle: 'Grand Hotel: The Guestbook That Phoned a Stranger',
  },
  'ad-kerberoasting': {
    place: 'courthouse-notary-hall',
    atmosphere: 'velvet-midnight-vault',
    theme2D: 'cathedral-sepia-gold',
    layout2D: 'vault-cutaway-blueprint',
    filmTitle: 'Courthouse Hall: The Forged Wax-Seal Voucher',
  },
  'ad-adcs-esc1-template-abuse': {
    place: 'office-building-reception',
    atmosphere: 'azure-shinkai-day',
    theme2D: 'blueprint-cyan',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Office Building: The Receptionist Blank Badge',
  },
  'ad-golden-ticket': {
    place: 'airport-terminal-gate',
    atmosphere: 'azure-shinkai-day',
    theme2D: 'alpine-grid-ice',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Airport Terminal: The All-Access Crew Boarding Pass',
  },
  'ad-dcsync-replication': {
    place: 'bank-branch-vault',
    atmosphere: 'warm-brass-grand-hotel',
    theme2D: 'cathedral-sepia-gold',
    layout2D: 'vault-cutaway-blueprint',
    filmTitle: 'Bank Branch: The Impostor Vault Ledger Sync',
  },
  'dns-tunneling-exfil': {
    place: 'post-office-sorting-hub',
    atmosphere: 'golden-sunset-highway',
    theme2D: 'sunset-highway-coral',
    layout2D: 'radial-broadcast-fan',
    filmTitle: 'Post Office: Coded Postcards Through the Mail Slot',
  },
  'sql-injection-auth-bypass': {
    place: 'restaurant-kitchen-drivethru',
    atmosphere: 'warm-brass-grand-hotel',
    theme2D: 'foundry-amber',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Restaurant Kitchen: The Extra Line on the Order Ticket',
  },
  'ssrf-cloud-metadata-imds': {
    place: 'apartment-lobby-intercom',
    atmosphere: 'neon-rain-cyberpunk',
    theme2D: 'telecom-rf-magenta',
    layout2D: 'diagonal-escalation-bridge',
    filmTitle: 'Apartment Lobby: Buzzing the Doorman Intercom',
  },
  'amsi-reflective-dll': {
    place: 'pharmacy-prescription-lab',
    atmosphere: 'clinical-xray-cleanroom',
    theme2D: 'xray-cleanroom',
    layout2D: 'split-mirror-comparison',
    filmTitle: 'Pharmacy Counter: Fogging the Inspection Glass',
  },
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': {
    place: 'hospital-triage-ward',
    atmosphere: 'clinical-xray-cleanroom',
    theme2D: 'xray-cleanroom',
    layout2D: 'vertical-shaft-cascade',
    filmTitle: 'Hospital Ward: Photocopying the Triage Clipboard',
  },
  'ai-rag-indirect-prompt-injection-mcp-tool-audit': {
    place: 'university-exam-hall',
    atmosphere: 'violet-neural-core',
    theme2D: 'neural-violet',
    layout2D: 'orbital-hub-spokes',
    filmTitle: 'University Exam Hall: The Whisper in the Booklet Margin',
  },
  'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr': {
    place: 'city-street-intersection',
    atmosphere: 'neon-rain-cyberpunk',
    theme2D: 'telecom-rf-magenta',
    layout2D: 'radial-broadcast-fan',
    filmTitle: 'City Street: Hijacking Every Corner Traffic Signal',
  },
  'cloud-aws-s3-kms-external-account-encryption-extortion-audit': {
    place: 'warehouse-forklift-bay',
    atmosphere: 'sunrise-logistics-port',
    theme2D: 'foundry-amber',
    layout2D: 'orbital-hub-spokes',
    filmTitle: 'Logistics Warehouse: Swapping Every Pallet Padlock',
  },
  'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626': {
    place: 'shipping-port-container-yard',
    atmosphere: 'emerald-harbor-mist',
    theme2D: 'harbor-teal',
    layout2D: 'vertical-shaft-cascade',
    filmTitle: 'Shipping Port: The Unlatched Cargo Container Hatch',
  },
  'solarwinds-sunburst-orion-supply-chain': {
    place: 'factory-assembly-line',
    atmosphere: 'amber-industrial-foundry',
    theme2D: 'foundry-amber',
    layout2D: 'conveyor-assembly-track',
    filmTitle: 'Factory Floor: Midnight Swap on the Assembly Line',
  },
  'ics-industroyer2-iec-60870-5-104-substation-telemetry': {
    place: 'power-substation-waterworks',
    atmosphere: 'alpine-substation-crisp',
    theme2D: 'alpine-grid-ice',
    layout2D: 'diagonal-escalation-bridge',
    filmTitle: 'Power Substation: Tripping the Municipal Grid Breakers',
  },
  'ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit': {
    place: 'power-substation-waterworks',
    atmosphere: 'amber-industrial-foundry',
    theme2D: 'foundry-amber',
    layout2D: 'conveyor-assembly-track',
    filmTitle: 'Waterworks Yard: The Frozen Green Pressure Gauge',
  },
  'fortimanager-fgd-jump-cve-2024-47575': {
    place: 'train-station-platform',
    atmosphere: 'golden-sunset-highway',
    theme2D: 'sunset-highway-coral',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Train Station: Flipping the Express Track Switchboard',
  },
  'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics': {
    place: 'museum-gallery-hall',
    atmosphere: 'velvet-midnight-vault',
    theme2D: 'orbital-indigo',
    layout2D: 'split-mirror-comparison',
    filmTitle: 'Art Museum: Slipping Past the Glass Pedestal Lasers',
  },
  'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit': {
    place: 'broadcast-tv-studio',
    atmosphere: 'storm-telecom-rooftop',
    theme2D: 'telecom-rf-magenta',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Broadcast Studio: The Covert Patch Cord on the Mixing Desk',
  },
  'blacklotus-uefi-bootkit-cve-2022-21894': {
    place: 'car-repair-garage',
    atmosphere: 'crimson-bunker-alert',
    theme2D: 'bunker-crimson',
    layout2D: 'vertical-shaft-cascade',
    filmTitle: 'Repair Garage: Bolting a Hidden Starter Bypass Under the Hood',
  },
  'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics': {
    place: 'public-library-archive',
    atmosphere: 'copper-archive-cathedral',
    theme2D: 'cathedral-sepia-gold',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Public Library: Redirecting the Rare-Book Catalog Card',
  },
  'dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics': {
    place: 'city-park-fountain',
    atmosphere: 'emerald-harbor-mist',
    theme2D: 'biolab-emerald',
    layout2D: 'vault-cutaway-blueprint',
    filmTitle: 'City Park: The Silent Drop-Off by the Stone Fountain',
  },
  'lockbit-3-black-ransomware-esxi-vmfs': {
    place: 'supermarket-retail-store',
    atmosphere: 'crimson-bunker-alert',
    theme2D: 'bunker-crimson',
    layout2D: 'radial-broadcast-fan',
    filmTitle: 'Supermarket: Locking Every Checkout Lane Before Opening',
  },
  'citrix-bleed-cve-2023-4966-session-hijack': {
    place: 'city-highway-toll-plaza',
    atmosphere: 'golden-sunset-highway',
    theme2D: 'sunset-highway-coral',
    layout2D: 'horizontal-pipeline',
    filmTitle: 'Highway Toll Plaza: Cloning the Express Lane Pass',
  },
  'ivanti-connect-secure-cve-2024-21887': {
    place: 'border-passport-control',
    atmosphere: 'desert-satellite-dusk',
    theme2D: 'desert-dish-terracotta',
    layout2D: 'diagonal-escalation-bridge',
    filmTitle: 'Border Control: Stamping Past the Passport Glass Booth',
  },
  'midnight-blizzard-oauth-app-exchange-exfil': {
    place: 'subway-metro-station',
    atmosphere: 'obsidian-orbital-deck',
    theme2D: 'orbital-indigo',
    layout2D: 'vertical-shaft-cascade',
    filmTitle: 'Subway Metro: Replaying the Underground Turnstile Card',
  },
  'okta-support-har-session-hijack': {
    place: 'coffee-shop-cafe',
    atmosphere: 'warm-brass-grand-hotel',
    theme2D: 'grand-hotel-brass',
    layout2D: 'split-mirror-comparison',
    filmTitle: 'Coffee Shop: Copying Login Slips at the Corner Table',
  },
  'polyfill-io-cdn-supply-chain-hijack': {
    place: 'cinema-theater-stage',
    atmosphere: 'crimson-bunker-alert',
    theme2D: 'bunker-crimson',
    layout2D: 'conveyor-assembly-track',
    filmTitle: 'Cinema Theater: Swapping the Feature Film Reel Backstage',
  },
};

function stableHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rotate<T>(arr: readonly T[], offset: number): T[] {
  const start = offset % arr.length;
  return [...arr.slice(start), ...arr.slice(0, start)];
}

/**
 * Ranks all 28 everyday real-world places for a given scenario based on its category,
 * techniques, and mechanics so the chosen physical environment feels intuitive and natural.
 */
function rankRealWorldPlacesForScenario(scenario: AttackScenario): SpatialSetArchetype[] {
  const kw = `${scenario.id} ${scenario.name} ${scenario.category} ${scenario.overview}`.toLowerCase();
  const prefs: SpatialSetArchetype[] = [];

  if (/hotel|concierge|log4j|jndi|ldap|directory/.test(kw)) {
    prefs.push('grand-hotel-lobby', 'office-building-reception', 'apartment-lobby-intercom');
  }
  if (/airport|flight|token|golden|ticket|saml|federat|passport|oauth|sso|entra|okta/.test(kw)) {
    prefs.push('airport-terminal-gate', 'border-passport-control', 'subway-metro-station', 'train-station-platform');
  }
  if (/office|adcs|cert|badge|delegat|gpo|rbcd|sharepoint|teams|m365|exchange|email|phish|business/.test(kw)) {
    prefs.push('office-building-reception', 'courthouse-notary-hall', 'grand-hotel-lobby');
  }
  if (/bank|vault|dcsync|ntds|kms|secret|dpapi|lsass|credential|pass-the-hash|mimikatz/.test(kw)) {
    prefs.push('bank-branch-vault', 'courthouse-notary-hall', 'museum-gallery-hall');
  }
  if (/ransom|lock|encrypt|extort|supermarket|retail|shop|pos|payment|stripe|store/.test(kw)) {
    prefs.push('supermarket-retail-store', 'warehouse-forklift-bay', 'bank-branch-vault');
  }
  if (/dns|mail|smtp|exfil|tunnel|post|beacon|c2|dropbox|onedrive/.test(kw)) {
    prefs.push('post-office-sorting-hub', 'city-park-fountain', 'airport-terminal-gate');
  }
  if (/vpn|citrix|forti|ivanti|paloalto|panos|sonicwall|sophos|checkpoint|zyxel|edge|firewall|gateway|proxy|reverse/.test(kw)) {
    prefs.push('city-highway-toll-plaza', 'border-passport-control', 'train-station-platform', 'city-street-intersection');
  }
  if (/container|docker|k8s|kubernetes|runc|helm|pod|eks|aks|gke|harbor|port|cargo|oci/.test(kw)) {
    prefs.push('shipping-port-container-yard', 'warehouse-forklift-bay', 'airport-terminal-gate');
  }
  if (/supply|cicd|github|npm|pypi|jenkins|teamcity|circleci|solarwinds|build|package|pipeline|artifact/.test(kw)) {
    prefs.push('factory-assembly-line', 'warehouse-forklift-bay', 'cinema-theater-stage', 'supermarket-retail-store');
  }
  if (/sql|postgres|mssql|mysql|oracle|mongo|redis|snowflake|database|db|query|ledger|table/.test(kw)) {
    prefs.push('public-library-archive', 'restaurant-kitchen-drivethru', 'bank-branch-vault', 'pharmacy-prescription-lab');
  }
  if (/ai|llm|rag|prompt|mcp|mlflow|pytorch|ollama|ray|model|agent|notebook|jupyter/.test(kw)) {
    prefs.push('university-exam-hall', 'office-building-reception', 'cinema-theater-stage', 'public-library-archive');
  }
  if (/ics|scada|plc|modbus|iec|substation|power|grid|boiler|water|turbine|industrial|ot/.test(kw)) {
    prefs.push('power-substation-waterworks', 'factory-assembly-line', 'train-station-platform', 'car-repair-garage');
  }
  if (/mobile|ios|android|telecom|5g|ss7|gtp|sms|imessage|pegasus|wifi|roaming|cellular|radio|satellite|viasat/.test(kw)) {
    prefs.push('broadcast-tv-studio', 'coffee-shop-cafe', 'city-street-intersection', 'subway-metro-station');
  }
  if (/kernel|byovd|driver|uefi|bootkit|firmware|bios|ebpf|rootkit|ring|sys|ioct/.test(kw)) {
    prefs.push('car-repair-garage', 'hospital-triage-ward', 'museum-gallery-hall', 'power-substation-waterworks');
  }
  if (/memory|amsi|etw|inject|hollow|dll|reflective|syscall|unhook|minidump|forensic|dfir|timestomp|evtx|mft/.test(kw)) {
    prefs.push('pharmacy-prescription-lab', 'hospital-triage-ward', 'museum-gallery-hall', 'city-park-fountain');
  }
  if (/web|http|xss|csrf|ssrf|api|graphql|jwt|cookie|session|nginx|apache|iis|browser|cdn/.test(kw)) {
    prefs.push('coffee-shop-cafe', 'restaurant-kitchen-drivethru', 'apartment-lobby-intercom', 'cinema-theater-stage');
  }

  // Category-level curated fallbacks so all 28 places stay semantically grounded
  const catFallback: Record<Exclude<AttackCategory, 'ALL'>, SpatialSetArchetype[]> = {
    MALWARE: ['pharmacy-prescription-lab', 'hospital-triage-ward', 'car-repair-garage', 'city-park-fountain', 'museum-gallery-hall', 'cinema-theater-stage'],
    NETWORK_WEB: ['coffee-shop-cafe', 'restaurant-kitchen-drivethru', 'city-street-intersection', 'apartment-lobby-intercom', 'post-office-sorting-hub', 'grand-hotel-lobby'],
    ACTIVE_DIRECTORY: ['office-building-reception', 'courthouse-notary-hall', 'bank-branch-vault', 'airport-terminal-gate', 'grand-hotel-lobby'],
    CLOUD_SAAS: ['airport-terminal-gate', 'office-building-reception', 'warehouse-forklift-bay', 'subway-metro-station', 'apartment-lobby-intercom'],
    RANSOMWARE_EXTORTION: ['supermarket-retail-store', 'warehouse-forklift-bay', 'bank-branch-vault', 'hospital-triage-ward', 'cinema-theater-stage'],
    AI_LLM_MLOPS_SECURITY: ['university-exam-hall', 'office-building-reception', 'public-library-archive', 'broadcast-tv-studio', 'city-street-intersection'],
    ZERO_DAY_APPLIANCES: ['city-highway-toll-plaza', 'border-passport-control', 'train-station-platform', 'subway-metro-station', 'apartment-lobby-intercom'],
    KERNEL_FIRMWARE_BYOVD: ['car-repair-garage', 'power-substation-waterworks', 'hospital-triage-ward', 'museum-gallery-hall', 'pharmacy-prescription-lab'],
    SUPPLY_CHAIN_CICD: ['factory-assembly-line', 'warehouse-forklift-bay', 'supermarket-retail-store', 'cinema-theater-stage', 'shipping-port-container-yard'],
    CONTAINERS_KUBERNETES: ['shipping-port-container-yard', 'warehouse-forklift-bay', 'train-station-platform', 'subway-metro-station', 'airport-terminal-gate'],
    DATABASE_DATA_PLATFORMS: ['public-library-archive', 'bank-branch-vault', 'restaurant-kitchen-drivethru', 'pharmacy-prescription-lab', 'post-office-sorting-hub'],
    ICS_OT_SCADA: ['power-substation-waterworks', 'factory-assembly-line', 'train-station-platform', 'city-highway-toll-plaza', 'car-repair-garage'],
    MOBILE_TELECOM_SPYWARE: ['broadcast-tv-studio', 'coffee-shop-cafe', 'museum-gallery-hall', 'city-street-intersection', 'city-park-fountain'],
    ICS_OT_MOBILE: ['power-substation-waterworks', 'broadcast-tv-studio', 'train-station-platform', 'city-highway-toll-plaza'],
  };

  const h = stableHash(scenario.id);
  const catList = catFallback[scenario.category as Exclude<AttackCategory, 'ALL'>] ?? [];
  return [...new Set([...prefs, ...catList, ...rotate(ALL_REAL_WORLD_SET_IDS, h)])];
}

function cleanShortTitle(raw: string): string {
  const cleaned = raw
    .replace(/^[^—–-]+(?:—|–|-)\s*/u, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/CVE-\d{4}-\d+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter((w) => w.length > 0).slice(0, 5);
  return words.join(' ');
}

function buildPhaseRibbon(scenario: AttackScenario): [string, string, string, string] {
  const s0 = scenario.stages[0]?.title ?? 'ENTRY';
  const s1 = scenario.stages[1]?.title ?? scenario.stages[0]?.subtitle ?? 'PIVOT';
  const sLast = scenario.stages[scenario.stages.length - 1]?.title ?? 'IMPACT';
  const compactTag = (raw: string, fallback: string) => {
    const clean = raw
      .replace(/[^a-zA-Z0-9\s/-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter((w) => w.length > 2 && !/^(the|and|for|with|from|via|into|over|using)$/i.test(w))
      .slice(0, 2)
      .join(' ')
      .toUpperCase();
    return (clean || fallback).slice(0, 14);
  };
  const witness =
    scenario.telemetry[scenario.telemetry.length - 1]?.sourceType?.replace(/_/g, ' ') ?? 'TELEMETRY';
  return [
    `01 ${compactTag(s0, 'ENTRY')}`,
    `02 ${compactTag(s1, 'PIVOT')}`,
    `03 ${compactTag(sLast, 'CONTROL')}`,
    `04 ${compactTag(witness, 'WITNESS')}`,
  ];
}

function paletteForTheme(themeId: Clip2DCinemaTheme): [number, number] {
  const t = CLIP_2D_THEMES[themeId];
  return [
    parseInt(t.primaryAccent.replace('#', ''), 16),
    parseInt(t.secondaryAccent.replace('#', ''), 16),
  ];
}

/**
 * Strips any forbidden technical tokens so dynamically woven phrases never leak jargon into Story text.
 */
function stripTechnicalTerms(raw: string, fallback: string): string {
  let clean = raw
    .replace(/\([^)]*\)/g, ' ')
    .replace(/0x[0-9a-f]+/gi, ' ')
    .replace(/\bCVE-\d{4}-\d+\b/gi, ' ')
    .replace(/\bT\d{4}(?:\.\d{3})?\b/g, ' ')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/g, ' ')
    .replace(/\b[A-Za-z0-9_-]+\.(?:exe|dll|sys|ps1|sh|py|class|jar|vhdx|lnk|bat|php|jsp|aspx|so|ko|elf|dit|dmp|evtx|msi|vbs|yml|yaml|json|xml|conf|cfg|log|bin|db)\b/gi, ' ')
    .replace(/[^a-zA-Z0-9\s,'’-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean || clean.length < 6 || findTechnicalJargonInStory(clean).length > 0) {
    return fallback;
  }
  return clean;
}

/**
 * Derives a short, 100% jargon-free everyday action flavor from a scenario's stage title
 * so two scenarios set in the same real-world place still tell distinct human stories.
 */
function plainActionFlavorForStage(
  stageTitle: string,
  stageIndex: number,
  totalStages: number,
  env: (typeof REAL_WORLD_ENVIRONMENTS)[SpatialSetArchetype]
): string {
  const lower = stageTitle.toLowerCase();
  if (/phish|spear|lure|initial|entry|deliver|drop|click|visit|request/.test(lower)) {
    return `approaches the ${env.defaultCheckpointLandmark.toLowerCase()} disguised as a regular visitor`;
  }
  if (/cred|dump|harvest|steal|extract|token|cookie|session|ticket|key|secret/.test(lower)) {
    return `quietly copies a trusted access pass from the ${env.defaultStaffRole.toLowerCase()}'s station`;
  }
  if (/escalat|priv|admin|system|root|ring|bypass|evad|disable|unhook|patch|tamper/.test(lower)) {
    return `bypasses the normal inspection rule to reach the ${env.defaultTargetLandmark.toLowerCase()}`;
  }
  if (/lateral|pivot|move|spread|relay|forward|link|remote|connect/.test(lower)) {
    return `moves quietly past the ${env.defaultCheckpointLandmark.toLowerCase()} into neighboring restricted rooms`;
  }
  if (/persist|sched|service|boot|startup|backdoor|implant|hook/.test(lower)) {
    return `leaves a hidden spare latch behind so they can walk back into the ${env.shortPlace.toLowerCase()} later`;
  }
  if (/exfil|tunnel|upload|steal|copy|stage|beacon|c2|command/.test(lower)) {
    return `smuggles copied records out past the ${env.defaultCheckpointLandmark.toLowerCase()} in tiny disguised batches`;
  }
  if (/encrypt|ransom|wipe|destroy|lock|sabot|trip|disrupt|impact/.test(lower)) {
    return `locks down operations around the ${env.defaultTargetLandmark.toLowerCase()} before staff can react`;
  }
  if (/detect|audit|forensic|log|monitor|hunt|alert|respond/.test(lower)) {
    return `leaves a telltale trail inside the ${env.defaultWitnessLandmark.toLowerCase()}`;
  }

  if (stageIndex === 0) {
    return `steps up to the ${env.defaultCheckpointLandmark.toLowerCase()} blending in with everyday guests`;
  }
  if (stageIndex === totalStages - 1) {
    return `completes the covert maneuver at the ${env.defaultTargetLandmark.toLowerCase()} while the ${env.defaultWitnessLandmark.toLowerCase()} records the anomaly`;
  }
  return `uses borrowed access inside the ${env.shortPlace.toLowerCase()} to slip closer to the ${env.defaultTargetLandmark.toLowerCase()}`;
}

export interface RealWorldStoryBundle {
  placeId: SpatialSetArchetype;
  placeName: string;
  cameraLabels: [string, string, string];
  calloutTitles: [string, string];
  briefing: {
    storyAnalogy: string;
    storyMappings: Array<{
      storyTerm: string;
      technicalTerm: string;
      tone: 'sky' | 'rose' | 'amber' | 'emerald';
    }>;
    phaseExcerpts: [string, string, string];
  };
  steps: Record<
    number,
    {
      storyAnalogy: string;
      storyMappings: Array<{
        storyTerm: string;
        technicalTerm: string;
        tone: 'sky' | 'rose' | 'amber' | 'emerald';
      }>;
      phaseExcerpts: [string, string, string];
      calloutTitles: [string, string];
    }
  >;
  memoryForensics?: {
    storyCue: string;
    storyMappings: Array<{
      storyTerm: string;
      technicalTerm: string;
      tone: 'sky' | 'rose' | 'amber' | 'emerald';
    }>;
    phaseExcerpts: [string, string, string];
    calloutTitles: [string, string];
  };
}

function buildScenarioRealWorldStory(
  scenario: AttackScenario,
  placeId: SpatialSetArchetype
): RealWorldStoryBundle {
  const env = REAL_WORLD_ENVIRONMENTS[placeId];
  const tpl = PLACE_STORY_TEMPLATES[placeId];

  const attackerNode =
    scenario.nodes.find((n) => n.role === 'attacker')?.label ?? 'Attacker Origin';
  const targetNode =
    scenario.nodes.find(
      (n) =>
        n.role === 'domain_controller' ||
        n.role === 'victim_host' ||
        n.role === 'memory'
    )?.label ??
    scenario.nodes[scenario.nodes.length - 1]?.label ??
    'Protected System Target';
  const controlNode =
    scenario.nodes.find(
      (n) =>
        n.role !== 'attacker' &&
        n.role !== 'firewall_siem' &&
        n.label !== targetNode
    )?.label ?? 'Untouched Baseline Component';
  const witnessNode =
    scenario.nodes.find((n) => n.role === 'firewall_siem')?.label ??
    scenario.telemetry[scenario.telemetry.length - 1]?.sourceType?.replace(/_/g, ' ') ??
    'Security Telemetry Sensor';

  const firstAction = plainActionFlavorForStage(
    scenario.stages[0]?.title ?? 'entry',
    0,
    scenario.stages.length,
    env
  );
  const lastAction = plainActionFlavorForStage(
    scenario.stages[scenario.stages.length - 1]?.title ?? 'impact',
    scenario.stages.length - 1,
    scenario.stages.length,
    env
  );

  const briefingStory = `${tpl.settingIntro} ${tpl.entryScene} In this real-world scenario, the intruder ${firstAction}, then ${lastAction}. ${tpl.witnessScene}`;

  const primaryMitre =
    scenario.stages[0]?.mitreTechniqueId ??
    scenario.telemetry[0]?.mitreId ??
    'MITRE';

  const briefingMappings: RealWorldStoryBundle['briefing']['storyMappings'] = [
    {
      storyTerm: tpl.mappingLabels[0],
      technicalTerm: `${attackerNode} · Initial Intrusion Mechanism (${primaryMitre})`,
      tone: 'rose',
    },
    {
      storyTerm: tpl.mappingLabels[1],
      technicalTerm: `${targetNode} · Compromised Target Asset`,
      tone: 'sky',
    },
    {
      storyTerm: tpl.mappingLabels[2],
      technicalTerm: `${controlNode} · Unmodified Control Boundary`,
      tone: 'amber',
    },
    {
      storyTerm: tpl.mappingLabels[3],
      technicalTerm: `${witnessNode} · Primary Detection Telemetry`,
      tone: 'emerald',
    },
  ];

  const steps: RealWorldStoryBundle['steps'] = {};
  const total = scenario.stages.length;

  for (let i = 0; i < total; i++) {
    const st = scenario.stages[i];
    const stepNum = i + 1;
    const actionFlavor = plainActionFlavorForStage(st.title, i, total, env);
    const rawDetail = st.subtitle || st.description || st.title;
    const techMethod =
      rawDetail.length > 76
        ? rawDetail.slice(0, 76).replace(/\s+\S*$/, '')
        : rawDetail;
    const stepTelemetry =
      (scenario.telemetry ?? []).find((t) => t.stageIndex === st.index) ??
      (scenario.telemetry ?? [])[Math.min(i, Math.max(0, (scenario.telemetry ?? []).length - 1))];
    const rawTelemetryText =
      stepTelemetry?.shortAction ||
      stepTelemetry?.info ||
      `Stage #${stepNum} Telemetry`;
    const witnessTech = stepTelemetry
      ? `${(stepTelemetry.sourceType ?? 'SIEM').replace(/_/g, ' ')} · ${rawTelemetryText.slice(0, 56)}`
      : `${witnessNode} · Stage #${stepNum} Detection`;

    let stepStory = '';
    if (i === 0) {
      stepStory = `${tpl.entryScene} Specifically in Step ${stepNum}, the intruder ${actionFlavor} while everyday visitors and the ${env.defaultStaffRole.toLowerCase()} go about their routine.`;
    } else if (i === total - 1) {
      stepStory = `${tpl.climaxScene} In this final step inside the ${env.shortPlace.toLowerCase()}, the intruder ${actionFlavor} until the ${env.defaultWitnessLandmark.toLowerCase()} catches the mismatch.`;
    } else if (i === 1) {
      stepStory = `${tpl.pivotScene} Here in Step ${stepNum} inside the ${env.shortPlace.toLowerCase()}, the intruder ${actionFlavor} without disturbing the ${env.defaultUntouchedLandmark.toLowerCase()}.`;
    } else {
      stepStory = `Continuing inside the ${env.placeName.toLowerCase()}, the intruder builds on the earlier foothold at the ${env.defaultCheckpointLandmark.toLowerCase()} and ${actionFlavor}. Meanwhile, the ${env.defaultUntouchedLandmark.toLowerCase()} stays untouched while the ${env.defaultWitnessLandmark.toLowerCase()} quietly logs every unusual movement.`;
    }

    const p0 =
      i === 0
        ? `At the ${env.shortPlace.toLowerCase()}, the intruder ${actionFlavor}.`
        : `Building on the earlier access inside the ${env.shortPlace.toLowerCase()}, the intruder ${actionFlavor}.`;
    const p1 =
      i === 0
        ? tpl.actBeats[0]
        : i === total - 1
          ? tpl.actBeats[1]
          : `Inside the ${env.shortPlace.toLowerCase()}, ${tpl.pivotScene}`;
    const p2 = tpl.actBeats[2];

    const stepCalloutA =
      i === 0
        ? tpl.primaryCallout
        : i === total - 1
          ? tpl.secondaryCallout
          : `${env.shortPlace} Checkpoint`;
    const stepCalloutB =
      i === total - 1
        ? `${env.shortPlace} Audit Watch`
        : tpl.secondaryCallout;

    steps[stepNum] = {
      storyAnalogy: stepStory,
      storyMappings: [
        {
          storyTerm: `${env.shortPlace}: ${tpl.mappingLabels[0]}`,
          technicalTerm: `Stage #${stepNum} Action · ${st.title} (${st.mitreTechniqueId})`,
          tone: 'rose',
        },
        {
          storyTerm: `${env.shortPlace}: ${tpl.mappingLabels[1]}`,
          technicalTerm: `${targetNode} · ${techMethod}`,
          tone: 'sky',
        },
        {
          storyTerm: tpl.mappingLabels[2],
          technicalTerm: `${controlNode} · Unchanged Baseline Reference`,
          tone: 'amber',
        },
        {
          storyTerm: tpl.mappingLabels[3],
          technicalTerm: witnessTech,
          tone: 'emerald',
        },
      ],
      phaseExcerpts: [p0, p1, p2],
      calloutTitles: [stepCalloutA, stepCalloutB],
    };
  }

  const hasMem = scenario.processTree.some(
    (p) => Array.isArray(p.memoryBlocks) && p.memoryBlocks.length > 0
  );
  const memoryForensics = hasMem
    ? {
        storyCue: tpl.forensicsScene,
        storyMappings: [
          {
            storyTerm: `Untouched Original ${env.shortPlace} Record`,
            technicalTerm: `Clean On-Disk Baseline Binary · ${targetNode}`,
            tone: 'sky' as const,
          },
          {
            storyTerm: `Altered Live ${env.shortPlace} State`,
            technicalTerm: `Tampered Live Memory Region · ${primaryMitre}`,
            tone: 'rose' as const,
          },
          {
            storyTerm: `${env.shortPlace} Side-by-Side Inspection Lamp`,
            technicalTerm: `Live Memory Diff & Forensic Scanner Audit`,
            tone: 'amber' as const,
          },
          {
            storyTerm: tpl.mappingLabels[3],
            technicalTerm: `${witnessNode} · Tampering Mismatch Proof`,
            tone: 'emerald' as const,
          },
        ],
        phaseExcerpts: [
          `On the left sits the clean, original ${env.shortPlace.toLowerCase()} record before any tampering occurred.`,
          `A bright comparison scan sweeps across both sides inside the ${env.shortPlace.toLowerCase()}, exposing the hidden swap.`,
          `The side-by-side audit proves the exterior badge stayed identical while the interior contents were replaced.`,
        ] as [string, string, string],
        calloutTitles: [
          `Original ${env.shortPlace} Record`,
          `Tampered ${env.shortPlace} State`,
        ] as [string, string],
      }
    : undefined;

  // Hard compile-time jargon verification for every generated story string
  const checkAll = [
    briefingStory,
    ...briefingMappings.map((m) => m.storyTerm),
    ...tpl.actBeats,
    tpl.primaryCallout,
    tpl.secondaryCallout,
    ...Object.values(steps).flatMap((s) => [
      s.storyAnalogy,
      ...s.storyMappings.map((m) => m.storyTerm),
      ...s.phaseExcerpts,
      ...s.calloutTitles,
    ]),
    ...(memoryForensics
      ? [
          memoryForensics.storyCue,
          ...memoryForensics.storyMappings.map((m) => m.storyTerm),
          ...memoryForensics.phaseExcerpts,
          ...memoryForensics.calloutTitles,
        ]
      : []),
  ];

  for (const txt of checkAll) {
    const hits = findTechnicalJargonInStory(txt);
    if (hits.length > 0) {
      throw new Error(
        `Jargon leak [${hits.join(', ')}] generated for ${scenario.id} (${placeId}) in: "${txt}"`
      );
    }
  }

  // Ensure stripTechnicalTerms isn't unused (used for safe title checks if needed)
  void stripTechnicalTerms;

  return {
    placeId,
    placeName: env.placeName,
    cameraLabels: env.cameraLabels,
    calloutTitles: [tpl.primaryCallout, tpl.secondaryCallout],
    briefing: {
      storyAnalogy: briefingStory,
      storyMappings: briefingMappings,
      phaseExcerpts: tpl.actBeats,
    },
    steps,
    memoryForensics,
  };
}

function main() {
  const used3D = new Set<string>();
  const used2D = new Set<string>();
  const usedTitles = new Set<string>();
  const placeCounts = new Map<SpatialSetArchetype, number>();
  for (const p of ALL_REAL_WORLD_SET_IDS) placeCounts.set(p, 0);

  const profiles: Record<string, ScenarioCinemaProfile> = {};
  const realWorldStories: Record<string, RealWorldStoryBundle> = {};

  // Maximum scenarios per place = 10 (with 28 places and 188 scenarios, ideal is 6-8 each, strictly <= 10 so every place feels fresh AND <= 18 atmospheres!)
  const MAX_PER_PLACE = 9;

  // Pass 1: Lock flagship overrides first
  for (const scenario of ATTACK_SCENARIOS) {
    const flag = FLAGSHIP_PLACE_OVERRIDES[scenario.id];
    if (!flag) continue;
    const env = REAL_WORLD_ENVIRONMENTS[flag.place];
    const atmo = flag.atmosphere ?? env.preferredAtmospheres[0];
    const theme2D = flag.theme2D ?? env.preferred2DThemes[0];
    const layout2D = flag.layout2D ?? ALL_2D_LAYOUTS[0];
    const heroKinetic = env.heroKinetic;
    const motif2D = env.clip2DMotif;

    const key3D = `${atmo}|${flag.place}|${heroKinetic}`;
    const key2D = `${theme2D}|${motif2D}|${layout2D}`;
    if (used3D.has(key3D)) {
      throw new Error(`Flagship 3D collision on ${scenario.id}: ${key3D}`);
    }
    if (used2D.has(key2D)) {
      throw new Error(`Flagship 2D collision on ${scenario.id}: ${key2D}`);
    }

    used3D.add(key3D);
    used2D.add(key2D);
    placeCounts.set(flag.place, (placeCounts.get(flag.place) ?? 0) + 1);

    const filmTitle =
      flag.filmTitle ?? `${env.shortPlace}: ${cleanShortTitle(scenario.name)}`;
    usedTitles.add(filmTitle.toLowerCase());

    const [primaryHex, secondaryHex] = paletteForTheme(theme2D);
    const h = stableHash(scenario.id);
    const story =
      scenario.id === 'process-hollowing'
        ? null
        : buildScenarioRealWorldStory(scenario, flag.place);
    if (story) realWorldStories[scenario.id] = story;

    profiles[scenario.id] = {
      scenarioId: scenario.id,
      filmTitle,
      genre: `${env.shortPlace} · Real-World Case`,
      settingLabel: env.placeName,
      realWorldPlace: env.shortPlace,
      atmosphere: atmo,
      spatialSet: flag.place,
      heroKinetic,
      cameraStyle: ALL_CAMERA_STYLES[h % ALL_CAMERA_STYLES.length],
      primaryHex,
      secondaryHex,
      clip2DTheme: theme2D,
      clip2DStoryMotif: motif2D,
      clip2DLayout: layout2D,
      phaseRibbon: buildPhaseRibbon(scenario),
      castSummary: {
        protagonist: story?.calloutTitles[0] ?? env.defaultProtagonistRole,
        targetAsset: story?.calloutTitles[1] ?? env.defaultTargetLandmark,
        untouchedControl: env.defaultUntouchedLandmark,
        witness: env.defaultWitnessLandmark,
      },
    };
  }

  // Pass 2: Assign every remaining scenario its most fitting balanced real-world place
  // with 1-to-1 matched 3D hero & 2D architectural illustration and ZERO 3D/2D collisions.
  for (const scenario of ATTACK_SCENARIOS) {
    if (profiles[scenario.id]) continue;
    const h = stableHash(scenario.id);
    const rankedPlaces = rankRealWorldPlacesForScenario(scenario);

    // Choose the highest-ranked place that still has balance headroom and an unused atmosphere
    let chosenPlace: SpatialSetArchetype = rankedPlaces[0];
    let chosenAtmo: CinemaAtmosphereId = ALL_ATMOSPHERES[0];
    let found3D = false;

    // Sort candidate places balancing semantic preference (rank index) + even distribution across all 28 places
    const placeScores = rankedPlaces.map((place, rankIdx) => {
      const count = placeCounts.get(place) ?? 0;
      // Strongly prefer places with count < 6 first so all 28 places get well-populated, while respecting semantic rank
      const balancePenalty = count >= MAX_PER_PLACE ? 500 : count * 3.2;
      return { place, score: rankIdx * 1.35 + balancePenalty };
    });
    placeScores.sort((a, b) => a.score - b.score);

    for (const { place } of placeScores) {
      const env = REAL_WORLD_ENVIRONMENTS[place];
      const atmoOrder = [
        ...new Set([...env.preferredAtmospheres, ...rotate(ALL_ATMOSPHERES, h)]),
      ];
      for (const atmo of atmoOrder) {
        const k3 = `${atmo}|${place}|${env.heroKinetic}`;
        if (!used3D.has(k3)) {
          chosenPlace = place;
          chosenAtmo = atmo;
          used3D.add(k3);
          found3D = true;
          break;
        }
      }
      if (found3D) break;
    }

    if (!found3D) {
      throw new Error(`Could not find unique 3D slot for ${scenario.id}`);
    }

    placeCounts.set(chosenPlace, (placeCounts.get(chosenPlace) ?? 0) + 1);
    const env = REAL_WORLD_ENVIRONMENTS[chosenPlace];

    // Pick unique 2D (clip2DTheme | clip2DStoryMotif (= chosenPlace!) | clip2DLayout)
    const themeOrder = [
      ...new Set([...env.preferred2DThemes, ...rotate(ALL_2D_THEMES, h >>> 2)]),
    ];
    const layoutOrder = rotate(ALL_2D_LAYOUTS, h >>> 5);

    let chosen2DTheme = themeOrder[0];
    let chosen2DLayout = layoutOrder[0];
    let found2D = false;
    outer2D: for (const t of themeOrder) {
      for (const l of layoutOrder) {
        const k2 = `${t}|${env.clip2DMotif}|${l}`;
        if (!used2D.has(k2)) {
          chosen2DTheme = t;
          chosen2DLayout = l;
          used2D.add(k2);
          found2D = true;
          break outer2D;
        }
      }
    }
    if (!found2D) {
      throw new Error(`Could not find unique 2D slot for ${scenario.id}`);
    }

    const baseTitle = `${env.shortPlace}: ${cleanShortTitle(scenario.name)}`;
    let filmTitle = baseTitle.slice(0, 62).trim();
    let suffix = 2;
    while (usedTitles.has(filmTitle.toLowerCase())) {
      filmTitle = `${baseTitle.slice(0, 50).trim()} · Case ${suffix}`;
      suffix++;
    }
    usedTitles.add(filmTitle.toLowerCase());

    const [primaryHex, secondaryHex] = paletteForTheme(chosen2DTheme);
    const story = buildScenarioRealWorldStory(scenario, chosenPlace);
    realWorldStories[scenario.id] = story;

    profiles[scenario.id] = {
      scenarioId: scenario.id,
      filmTitle,
      genre: `${env.shortPlace} · Real-World Case`,
      settingLabel: env.placeName,
      realWorldPlace: env.shortPlace,
      atmosphere: chosenAtmo,
      spatialSet: chosenPlace,
      heroKinetic: env.heroKinetic,
      cameraStyle: ALL_CAMERA_STYLES[h % ALL_CAMERA_STYLES.length],
      primaryHex,
      secondaryHex,
      clip2DTheme: chosen2DTheme,
      clip2DStoryMotif: env.clip2DMotif,
      clip2DLayout: chosen2DLayout,
      phaseRibbon: buildPhaseRibbon(scenario),
      castSummary: {
        protagonist: story.calloutTitles[0],
        targetAsset: story.calloutTitles[1],
        untouchedControl: env.defaultUntouchedLandmark,
        witness: env.defaultWitnessLandmark,
      },
    };
  }

  // Verify strict invariants before writing files
  const totalCount = Object.keys(profiles).length;
  if (totalCount !== 188) throw new Error(`Expected 188 profiles, got ${totalCount}`);
  if (used3D.size !== 188) throw new Error(`Expected 188 unique 3D fingerprints, got ${used3D.size}`);
  if (used2D.size !== 188) throw new Error(`Expected 188 unique 2D fingerprints, got ${used2D.size}`);
  if (usedTitles.size !== 188) throw new Error(`Expected 188 unique film titles, got ${usedTitles.size}`);
  for (const [place, cnt] of placeCounts.entries()) {
    if (cnt === 0) throw new Error(`Real-world place ${place} has 0 assigned scenarios!`);
  }

  // 1. Write /lib/scenario-cinema-profiles.ts
  const profilesTs = `/**
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

export const SCENARIO_CINEMA_PROFILES: Record<string, ScenarioCinemaProfile> = ${JSON.stringify(
    profiles,
    null,
    2
  )};

export function getScenarioCinemaProfile(scenarioId: string): ScenarioCinemaProfile {
  return (
    SCENARIO_CINEMA_PROFILES[scenarioId] ??
    SCENARIO_CINEMA_PROFILES['process-hollowing']
  );
}
`;
  fs.writeFileSync(
    path.join(process.cwd(), 'lib', 'scenario-cinema-profiles.ts'),
    profilesTs,
    'utf8'
  );

  // 2. Write /lib/scenario-real-world-stories.ts (all 187 non-process-hollowing scenarios)
  const storiesTs = `/**
 * Real-World Everyday Story-to-Technical Analogies for all 187 non-process-hollowing scenarios.
 * Guarantees 100% alignment between UI Story Text, 3D Three.js Real-World Architectural Sets,
 * and 2D SVG+GSAP Real-World Illustrations — 100% jargon-free in every Story field.
 * (process-hollowing remains untouched as the Armored Bank Truck canonical benchmark.)
 */
import type { SpatialSetArchetype } from './scenario-cinema-profiles-core';
import type { StoryTechnicalMapping } from '@/modules/scenarios/contracts';

export interface ScenarioRealWorldStoryBundle {
  placeId: SpatialSetArchetype;
  placeName: string;
  cameraLabels: [string, string, string];
  calloutTitles: [string, string];
  briefing: {
    storyAnalogy: string;
    storyMappings: StoryTechnicalMapping[];
    phaseExcerpts: [string, string, string];
  };
  steps: Record<
    number,
    {
      storyAnalogy: string;
      storyMappings: StoryTechnicalMapping[];
      phaseExcerpts: [string, string, string];
      calloutTitles: [string, string];
    }
  >;
  memoryForensics?: {
    storyCue: string;
    storyMappings: StoryTechnicalMapping[];
    phaseExcerpts: [string, string, string];
    calloutTitles: [string, string];
  };
}

export const SCENARIO_REAL_WORLD_STORIES: Record<string, ScenarioRealWorldStoryBundle> = ${JSON.stringify(
    realWorldStories,
    null,
    2
  )};

export function getScenarioRealWorldStory(
  scenarioId: string
): ScenarioRealWorldStoryBundle | null {
  if (scenarioId === 'process-hollowing') return null;
  return SCENARIO_REAL_WORLD_STORIES[scenarioId] ?? null;
}
`;
  fs.writeFileSync(
    path.join(process.cwd(), 'lib', 'scenario-real-world-stories.ts'),
    storiesTs,
    'utf8'
  );

  // 3. Write /docs/screenplays/ (Docs ONLY!)
  const screenplaysDir = path.join(process.cwd(), 'docs', 'screenplays');
  fs.mkdirSync(screenplaysDir, { recursive: true });

  const CATEGORY_FILES: Array<{
    category: Exclude<AttackCategory, 'ALL'>;
    file: string;
    title: string;
  }> = [
    { category: 'MALWARE', file: '01-malware.md', title: 'Malware & In-Memory Evasion Real-World Screenplays' },
    { category: 'NETWORK_WEB', file: '02-network-web.md', title: 'Network & Web Exploitation Real-World Screenplays' },
    { category: 'ACTIVE_DIRECTORY', file: '03-active-directory.md', title: 'Active Directory & Identity Real-World Screenplays' },
    { category: 'CLOUD_SAAS', file: '04-cloud-saas.md', title: 'Cloud & SaaS Control-Plane Real-World Screenplays' },
    { category: 'RANSOMWARE_EXTORTION', file: '05-ransomware-extortion.md', title: 'Ransomware & Extortion Real-World Screenplays' },
    { category: 'AI_LLM_MLOPS_SECURITY', file: '06-ai-llm-mlops.md', title: 'AI, LLM & MLOps Security Real-World Screenplays' },
    { category: 'ZERO_DAY_APPLIANCES', file: '07-zero-day-appliances.md', title: 'Zero-Day Edge Appliances Real-World Screenplays' },
    { category: 'KERNEL_FIRMWARE_BYOVD', file: '08-kernel-firmware-byovd.md', title: 'Kernel, Firmware & BYOVD Real-World Screenplays' },
    { category: 'SUPPLY_CHAIN_CICD', file: '09-supply-chain-cicd.md', title: 'Supply Chain & CI/CD Real-World Screenplays' },
    { category: 'CONTAINERS_KUBERNETES', file: '10-containers-kubernetes.md', title: 'Containers & Kubernetes Real-World Screenplays' },
    { category: 'DATABASE_DATA_PLATFORMS', file: '11-database-data-platforms.md', title: 'Database & Data Platforms Real-World Screenplays' },
    { category: 'ICS_OT_SCADA', file: '12-ics-ot-scada.md', title: 'ICS, OT & SCADA Real-World Screenplays' },
    { category: 'MOBILE_TELECOM_SPYWARE', file: '13-mobile-telecom.md', title: 'Mobile & Telecom Spyware Real-World Screenplays' },
  ];

  // Build Master README with Real-World Distribution & Full 188-Row Comparison Matrix
  const placeDistributionRows = ALL_REAL_WORLD_SET_IDS.map((placeId) => {
    const env = REAL_WORLD_ENVIRONMENTS[placeId];
    return `| \`${placeId}\` | ${env.placeName} | \`${env.heroKinetic}\` | ${placeCounts.get(placeId) ?? 0} |`;
  }).join('\n');

  const matrixRows = ATTACK_SCENARIOS.map((s, idx) => {
    const p = profiles[s.id];
    return `| ${idx + 1} | \`${s.id}\` | ${p.filmTitle} | ${p.realWorldPlace} | \`${p.atmosphere}\` | \`${p.spatialSet}\` | \`${p.heroKinetic}\` | \`${p.clip2DTheme}\` / \`${p.clip2DStoryMotif}\` / \`${p.clip2DLayout}\` |`;
  }).join('\n');

  const readmeMd = `# Real-World Cinema Screenplays & Uniqueness Matrix (All 188 Scenarios)

> **Documentation Only:** This folder documents the per-scenario real-world storyboards, architectural environments, 3D Three.js staging, and 2D SVG+GSAP technical illustrations for all 188 scenarios. It is **never** imported or rendered inside the UI.

## Real-World Alignment & Uniqueness Audit Summary

- **Total Scenarios Audited:** 188 / 188 (\`process-hollowing\` preserved untouched as the Armored Bank Truck benchmark)
- **Everyday Real-World Architectural Places:** 28 / 28 utilized in both 3D Three.js and 2D SVG+GSAP
- **Unique 3D Stage Fingerprints** (\`atmosphere | spatialSet | heroKinetic\`): **${used3D.size} / 188** (0 collisions)
- **Unique 2D Technical Clip Fingerprints** (\`clip2DTheme | clip2DStoryMotif | clip2DLayout\`): **${used2D.size} / 188** (0 collisions)
- **3-Way Semantic Lockstep:** Every scenario's UI Story Text, 3D Three.js physical architecture, 3D hero vehicle/prop, and 2D SVG+GSAP architectural illustration depict the exact same real-world place.

## Distribution Across All 28 Real-World Architectural Environments

| Environment ID | Real-World Place | Matched 3D Hero Prop / Vehicle | Assigned Scenarios |
| --- | --- | --- | ---: |
${placeDistributionRows}

## Category Screenplay Volumes

${CATEGORY_FILES.map((c) => `- [${c.title}](./${c.file})`).join('\n')}

## Full 188-Scenario Cross-Comparison Matrix

| # | Scenario ID | Film Title | Real-World Place | 3D Atmosphere | 3D Real-World Set | 3D Hero Prop | 2D Theme / Motif / Layout |
| ---: | --- | --- | --- | --- | --- | --- | --- |
${matrixRows}
`;
  fs.writeFileSync(path.join(screenplaysDir, 'README.md'), readmeMd, 'utf8');

  for (const cat of CATEGORY_FILES) {
    const items = ATTACK_SCENARIOS.filter((s) => s.category === cat.category);
    const blocks = items.map((s) => {
      const p = profiles[s.id];
      const story = realWorldStories[s.id];
      const desc = getSection3DDescriptor(s.id, 'briefing');
      const sections = listScenario3DSections(s.id);
      const storyText =
        story?.briefing.storyAnalogy ?? desc?.storyCue ?? s.overview;
      const actsText = (
        story?.briefing.phaseExcerpts ??
        desc?.phases.slice(0, 3).map((ph) => ph.storyExcerpt) ??
        []
      )
        .map((ex, idx) => `  - **Act ${idx + 1}:** ${ex}`)
        .join('\n');

      return `## \`${s.id}\` — ${p.filmTitle}

- **Everyday Real-World Place:** ${p.settingLabel} (\`${p.spatialSet}\`)
- **3D Stage Direction:** Atmosphere \`${p.atmosphere}\` · Hero Prop \`${p.heroKinetic}\` · Camera \`${p.cameraStyle}\`
- **2D Technical Clip Direction:** Theme \`${p.clip2DTheme}\` · Architectural Motif \`${p.clip2DStoryMotif}\` · Layout \`${p.clip2DLayout}\`
- **4-Act Phase Ribbon:** ${p.phaseRibbon.join(' → ')}
- **Registered Sections:** ${sections.map((x) => x.sectionKey).join(', ')}
- **Everyday Real-World Story Premise:** ${storyText}
- **Three-Act Storyboard Beats:**
${actsText}
`;
    });

    const catMd = `# ${cat.title}

> **Count:** ${items.length} scenarios · **100% Real-World 3D & 2D Aligned · Zero Visual Collisions**

${blocks.join('\n---\n\n')}
`;
    fs.writeFileSync(path.join(screenplaysDir, cat.file), catMd, 'utf8');
  }

  console.log(
    `Generated 188 real-world cinema profiles (${used3D.size} unique 3D, ${used2D.size} unique 2D), 187 real-world story bundles (0 jargon leaks), and 14 docs/screenplays files.`
  );
  console.log('Place distribution:', Object.fromEntries(placeCounts.entries()));
}

main();
