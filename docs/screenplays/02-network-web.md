# Network & Web Exploitation Real-World Screenplays

> **Count:** 30 scenarios · **100% Real-World 3D & 2D Aligned · Zero Visual Collisions**

## `log4shell-dfir` — Grand Hotel: The Guestbook That Phoned a Stranger

- **Everyday Real-World Place:** Grand Hotel Atrium & Concierge Desk (`grand-hotel-lobby`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `hotel-concierge-key-rack` · Camera `intimate-cutaway-dolly`
- **2D Technical Clip Direction:** Theme `grand-hotel-brass` · Architectural Motif `grand-hotel-lobby` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 INJECT JNDI → 02 LOG4J JNDI → 03 JAVA SPAWNS → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, step-4
- **Everyday Real-World Story Premise:** Picture a sunlit grand hotel lobby with a polished marble concierge desk, a golden wall of numbered room-key hooks, velvet luggage carts, and brass elevator doors. Stepping up to the grand hotel concierge desk, a guest writes a cleverly worded forwarding note inside the open leather guestbook ledger. In this real-world scenario, the intruder steps up to the front-desk guestbook counter blending in with everyday guests, then completes the covert maneuver at the brass room-key rack & elevator while the hotel switchboard call log records the anomaly. The hotel switchboard call log catches an unexpected outside phone call triggered directly from a routine guestbook check-in entry.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A guest writes a hidden forwarding instruction inside the grand hotel guestbook.
  - **Act 2:** The concierge dials the outside number and pulls a master key from the brass key rack.
  - **Act 3:** The hotel switchboard log flags the unexpected outbound call from the front desk.

---

## `dns-tunneling-exfil` — Post Office: Coded Postcards Through the Mail Slot

- **Everyday Real-World Place:** Neighborhood Post Office & Mail Sorting Hub (`post-office-sorting-hub`)
- **3D Stage Direction:** Atmosphere `golden-sunset-highway` · Hero Prop `post-office-parcel-chute` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `post-office-sorting-hub` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 CHUNK HEX-ENCO → 02 RECURSIVE RELA → 03 REASSEMBLE EXF → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Think of a classic neighborhood post office with brass P.O. boxes lining the back wall, a parcel scale counter, a blue street mailbox outside, and angled mail sorting chutes. At the neighborhood post office counter, a sender slips tiny coded lines onto the back of ordinary postcards and drops them one by one into the mail sorting slot. In this real-world scenario, the intruder steps up to the postal scale & stamp window blending in with everyday guests, then smuggles copied records out past the postal scale & stamp window in tiny disguised batches. The postmaster reviews the evening dispatch ledger and spots hundreds of oddly coded postcards all mailed to the exact same remote P.O. box.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A sender feeds a stream of coded postcards into the neighborhood post office slot.
  - **Act 2:** Each stamped card slides down the sorting chute into the brass P.O. box wall.
  - **Act 3:** The postmaster’s dispatch ledger flags the abnormal flood of identical destination cards.

---

## `apache-activemq-cve-2023-46604-openwire` — Logistics Warehouse: Apache ActiveMQ OpenWire ExceptionRespons

- **Everyday Real-World Place:** Logistics Warehouse & Forklift Loading Bay (`warehouse-forklift-bay`)
- **3D Stage Direction:** Atmosphere `amber-industrial-foundry` · Hero Prop `warehouse-pallet-forklift` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `warehouse-forklift-bay` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 OPENWIRE EXCEP → 02 CREATETHROWABL → 03 SPRING PROCESS → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a high-ceiling logistics warehouse with towering steel pallet racks stacked with labeled shipping crates, clipboard dock stations, and a bright yellow forklift cruising down the aisle. Inside the bustling logistics warehouse, an unverified driver climbs into a parked yellow forklift and rolls toward the high-bay customer storage racks. In this real-world scenario, the intruder steps up to the loading dock check-out clipboards blending in with everyday guests, then bypasses the normal inspection rule to reach the high-bay pallet racks & forklift. The warehouse barcode inventory system flashes an urgent alert when hundreds of customer pallets are relabeled in minutes outside normal shift hours.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An unauthorized driver steers a yellow forklift down the logistics warehouse pallet aisle.
  - **Act 2:** Customer crates are lifted off the high racks, relabeled, and sealed with rogue padlocks.
  - **Act 3:** The warehouse barcode inventory system alerts dispatch to the mass pallet relabeling.

---

## `atlassian-confluence-cve-2023-22515-storm0062` — Airport Terminal: Storm-0062: Atlassian Confluence XWork OGNL

- **Everyday Real-World Place:** International Airport Terminal & Boarding Gate (`airport-terminal-gate`)
- **3D Stage Direction:** Atmosphere `azure-shinkai-day` · Hero Prop `commercial-passenger-airplane` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `airport-terminal-gate` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 XWORK PARAMETE → 02 ROGUE ADMIN → 03 MALICIOUS OSGI → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a bustling international airport terminal with glowing departure screens, an X-ray security arch, a boarding gate counter, and a commercial passenger airplane parked right outside on the tarmac. Inside the airport terminal, a disguised passenger approaches the boarding gate carrying an altered boarding pass tucked inside an official airline jacket. In this real-world scenario, the intruder steps up to the airport security scanner arch blending in with everyday guests, then smuggles copied records out past the airport security scanner arch in tiny disguised batches. Airfield control tower logs and the boarding-gate manifest counter catch the mismatch when one extra passenger shows up on the jet without a matching ticket purchase.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler walks through the airport terminal security arch toward the boarding gate.
  - **Act 2:** The gate agent waves the forged boarding pass onto the parked passenger airplane.
  - **Act 3:** The airport control tower and boarding scanner flag the mismatched flight manifest.

---

## `barracuda-esg-cve-2023-2868-unc4841` — Bank Branch: UNC4841: Barracuda ESG .tar Command

- **Everyday Real-World Place:** Downtown Bank Branch & Steel Vault (`bank-branch-vault`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `bank-vault-wheel-door` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `bank-branch-vault` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 MALICIOUS TAR → 02 IMPLANTING SAL → 03 DEEP PERSISTEN → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a busy downtown bank branch with marble teller windows, brass counter bars, and a heavy circular steel vault at the rear. At the front marble counter, a visitor wearing a borrowed courier coat hands the bank teller an official-looking transfer slip to slip past the velvet queue. In this real-world scenario, the intruder steps up to the brass teller window blending in with everyday guests, then leaves a hidden spare latch behind so they can walk back into the bank branch later. Only when the branch manager reviews the vault camera footage alongside the teller receipt book does the unauthorized vault visit stand out immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor steps up to the marble bank teller window carrying a borrowed transfer slip.
  - **Act 2:** The heavy circular steel bank vault door unlocks and swings open behind the counter.
  - **Act 3:** The branch audit camera and teller ledger record the unscheduled vault opening.

---

## `cisco-ios-xe-cve-2023-20198-badimplant` — Courthouse: Cisco IOS XE Web UI

- **Everyday Real-World Place:** City Courthouse Hall & Official Notary Seal Desk (`courthouse-notary-hall`)
- **3D Stage Direction:** Atmosphere `copper-archive-cathedral` · Hero Prop `courthouse-wax-seal-bench` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `courthouse-notary-hall` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 DOUBLE URL-ENC → 02 INSTALLADD COM → 03 IMPLANTING BAD → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a grand city courthouse hall with fluted marble columns, an elevated wooden judge bench, a witness stand, and a brass wax-seal notary stamping desk. Entering the marble courthouse hall during a crowded docket, a forger requests a routine certified copy at the notary clerk’s brass stamping counter. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the brass courthouse wax-seal press, then leaves a hidden spare latch behind so they can walk back into the courthouse later. The court bailiff audits the official notary stamp registry and discovers stamped certificates that were never entered into the judge’s docket book.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A forger approaches the marble courthouse notary desk requesting a routine stamped voucher.
  - **Act 2:** Using a lifted seal impression, the forger presses official-looking passes away from the judge bench.
  - **Act 3:** The court bailiff’s stamp registry flags high-privilege certificates missing from the docket.

---

## `cl0p-moveit-transfer-cve-2023-34362` — Subway Metro: CL0P : MOVEit Transfer SQLi,

- **Everyday Real-World Place:** Underground Subway Metro & Fare Turnstiles (`subway-metro-station`)
- **3D Stage Direction:** Atmosphere `neon-rain-cyberpunk` · Hero Prop `subway-metro-turnstile-car` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `orbital-indigo` · Architectural Motif `subway-metro-station` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 SESSION POISON → 02 NET DESERIALIZ → 03 AZURE BLOB → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine an underground city subway metro station with tiled tunnel walls, glowing route maps, chrome fare turnstiles, ticket kiosks, and a gleaming metro train sliding along the platform. Down in the underground subway concourse, a rider taps a replayed magnetic metro fare card at the chrome turnstile bank during evening rush hour. In this real-world scenario, the intruder quietly copies a trusted access pass from the metro station agent's station, then quietly copies a trusted access pass from the metro station agent's station. The metro booth attendant’s fare-gate console flags a single card swiped at two distant stations within seconds and alerts transit security.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A rider taps a cloned metro card at the chrome underground subway turnstile.
  - **Act 2:** The subway doors slide open and the intruder accesses the train’s service cabin.
  - **Act 3:** The metro booth audit console flags the impossible duplicate fare-card tap.

---

## `f5-bigip-request-smuggling` — Grand Hotel: F5 BIG-IP TMUI AJP Request

- **Everyday Real-World Place:** Grand Hotel Atrium & Concierge Desk (`grand-hotel-lobby`)
- **3D Stage Direction:** Atmosphere `velvet-midnight-vault` · Hero Prop `hotel-concierge-key-rack` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `grand-hotel-brass` · Architectural Motif `grand-hotel-lobby` · Layout `split-mirror-comparison`
- **4-Act Phase Ribbon:** 01 TMUI AJP → 02 ROGUE ADMIN → 03 ROOT BASH → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a sunlit grand hotel lobby with a polished marble concierge desk, a golden wall of numbered room-key hooks, velvet luggage carts, and brass elevator doors. Stepping up to the grand hotel concierge desk, a guest writes a cleverly worded forwarding note inside the open leather guestbook ledger. In this real-world scenario, the intruder approaches the front-desk guestbook counter disguised as a regular visitor, then quietly copies a trusted access pass from the hotel concierge's station. The hotel switchboard call log catches an unexpected outside phone call triggered directly from a routine guestbook check-in entry.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A guest writes a hidden forwarding instruction inside the grand hotel guestbook.
  - **Act 2:** The concierge dials the outside number and pulls a master key from the brass key rack.
  - **Act 3:** The hotel switchboard log flags the unexpected outbound call from the front desk.

---

## `fortra-goanywhere-mft-cve-2023-0669-cl0p` — Supermarket: CL0P : Fortra GoAnywhere MFT

- **Everyday Real-World Place:** Neighborhood Supermarket & Checkout Lanes (`supermarket-retail-store`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `supermarket-checkout-cart` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `supermarket-retail-store` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 ENCRYPTED BUND → 02 COMMONSBEANUTI → 03 TRUEBOT COBALT → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Think of a bright neighborhood supermarket filled with stocked grocery aisles, rolling shopping carts, barcode price stickers, and busy checkout conveyor belts. Pushing a metal shopping cart down the supermarket aisles, a shopper peels a cheap barcode sticker off a small item and presses it cleanly onto a high-value boxed product. In this real-world scenario, the intruder locks down operations around the supermarket checkout register before staff can react, then smuggles copied records out past the barcode price scanner in tiny disguised batches. When the store manager reconciles the checkout receipt tape against the aisle inventory count and overhead camera, the swapped barcode trick is caught red-handed.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A shopper pushes a cart down the stocked supermarket aisles and swaps a barcode label.
  - **Act 2:** The checkout conveyor scanner accepts the disguised box and rings up a routine receipt.
  - **Act 3:** The store inventory log and overhead checkout camera expose the mismatched price scan.

---

## `juniper-junos-jweb-cve-2023-36845-chain` — Airport Terminal: Juniper Junos OS J-Web: PHPRC

- **Everyday Real-World Place:** International Airport Terminal & Boarding Gate (`airport-terminal-gate`)
- **3D Stage Direction:** Atmosphere `sunrise-logistics-port` · Hero Prop `commercial-passenger-airplane` · Camera `intimate-cutaway-dolly`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `airport-terminal-gate` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 MANIPULATING P → 02 INJECTING AUTO → 03 FILELESS IN-ME → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a bustling international airport terminal with glowing departure screens, an X-ray security arch, a boarding gate counter, and a commercial passenger airplane parked right outside on the tarmac. Inside the airport terminal, a disguised passenger approaches the boarding gate carrying an altered boarding pass tucked inside an official airline jacket. In this real-world scenario, the intruder steps up to the airport security scanner arch blending in with everyday guests, then quietly copies a trusted access pass from the gate agent's station. Airfield control tower logs and the boarding-gate manifest counter catch the mismatch when one extra passenger shows up on the jet without a matching ticket purchase.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler walks through the airport terminal security arch toward the boarding gate.
  - **Act 2:** The gate agent waves the forged boarding pass onto the parked passenger airplane.
  - **Act 3:** The airport control tower and boarding scanner flag the mismatched flight manifest.

---

## `mandiant-apt29-teamcity-jetstream` — Train Station: APT29 : JetBrains TeamCity RCE

- **Everyday Real-World Place:** Central Train Station & Express Platform (`train-station-platform`)
- **3D Stage Direction:** Atmosphere `copper-archive-cathedral` · Hero Prop `express-station-locomotive` · Camera `intimate-cutaway-dolly`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `train-station-platform` · Layout `vertical-shaft-cascade`
- **4-Act Phase Ribbon:** 01 TEAMCITY REST → 02 DEBUG PROCESS → 03 GRAPHICALPROTO → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a grand central train station with an arched iron canopy, hanging station clock, ticket turnstiles, parallel railway tracks, and a sleek express train waiting at the platform. Beneath the central train station canopy, a stowaway slips past the platform ticket barrier using a copied conductor punch card right before boarding time. In this real-world scenario, the intruder quietly copies a trusted access pass from the station conductor's station, then leaves a hidden spare latch behind so they can walk back into the train station later. The station master’s glowing track-indicator board flashes a route mismatch the instant the express train leaves its scheduled platform line.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A stowaway passes the central train station ticket barrier beneath the station clock.
  - **Act 2:** A flipped track lever diverts the express passenger train away from its scheduled rail line.
  - **Act 3:** The station master’s signal board flags the unscheduled track switch immediately.

---

## `openssh-regreSSHion-cve-2024-6387` — Restaurant Kitchen: OpenSSH "regreSSHion": SIGALRM Async-Signa

- **Everyday Real-World Place:** Busy Restaurant Kitchen & Drive-Thru Window (`restaurant-kitchen-drivethru`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `restaurant-kitchen-order-rail` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `restaurant-kitchen-drivethru` · Layout `vertical-shaft-cascade`
- **4-Act Phase Ribbon:** 01 SSH HEAP → 02 SIGALRM INTERR → 03 GLIBC FILE → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a bustling restaurant kitchen with a stainless-steel pass-through counter, a hanging rail of paper order tickets, a glowing drive-thru window, and a line chef at the stove. Pulling up to the restaurant drive-thru window, a clever customer asks for a routine meal while sneaking an extra kitchen command onto the special-notes line of the order. In this real-world scenario, the intruder leaves a telltale trail inside the kitchen pos receipt printer, then bypasses the normal inspection rule to reach the kitchen order ticket rail. The restaurant manager inspects the kitchen receipt printer tape and spots an impossible order note that gave away stock without a matching sale.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A customer slips an extra command onto a routine restaurant drive-thru order.
  - **Act 2:** Clipped onto the kitchen ticket rail, the disguised note tricks the line chef into extra actions.
  - **Act 3:** The restaurant manager’s receipt printer log flags the abnormal kitchen instruction.

---

## `papercut-ng-cve-2023-27350-bl00dy` — Shipping Port: PaperCut MF/NG SetupCompleted Auth Bypass

- **Everyday Real-World Place:** Coastal Shipping Port & Container Pier (`shipping-port-container-yard`)
- **3D Stage Direction:** Atmosphere `sunrise-logistics-port` · Hero Prop `harbor-gantry-cargo-ship` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `harbor-teal` · Architectural Motif `shipping-port-container-yard` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 TAPESTRY SETUP → 02 DISABLING PRIN → 03 RHINO RUNTIME → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a bustling coastal shipping port with blue harbor water, stacked colorful steel cargo containers, a towering yellow overhead gantry crane, and a moored cargo ship. Out on the concrete harbor pier, a worker notices a single shipping container whose side inspection hatch was accidentally left unlatched during loading. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the stacked cargo containers & ship, then bypasses the normal inspection rule to reach the stacked cargo containers & ship. The port authority watchtower spots footsteps leaving a supposedly sealed container bay and compares the manifest seal numbers against the pier camera.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A stowaway opens an unlatched side hatch inside a stacked steel cargo container.
  - **Act 2:** Beneath the yellow gantry crane, the intruder steps onto the restricted shipping port pier.
  - **Act 3:** The port authority manifest watch detects the broken container seal on the dock.

---

## `proxyshell-exchange-cve-2021-34473` — Subway Metro: Microsoft Exchange "ProxyShell": Autodiscover SS

- **Everyday Real-World Place:** Underground Subway Metro & Fare Turnstiles (`subway-metro-station`)
- **3D Stage Direction:** Atmosphere `obsidian-orbital-deck` · Hero Prop `subway-metro-turnstile-car` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `orbital-indigo` · Architectural Motif `subway-metro-station` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 AUTODISCOVER J → 02 POWERSHELL X-R → 03 NEW-MAILBOXEXP → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine an underground city subway metro station with tiled tunnel walls, glowing route maps, chrome fare turnstiles, ticket kiosks, and a gleaming metro train sliding along the platform. Down in the underground subway concourse, a rider taps a replayed magnetic metro fare card at the chrome turnstile bank during evening rush hour. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the underground subway train car, then approaches the metro card turnstile bank disguised as a regular visitor. The metro booth attendant’s fare-gate console flags a single card swiped at two distant stations within seconds and alerts transit security.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A rider taps a cloned metro card at the chrome underground subway turnstile.
  - **Act 2:** The subway doors slide open and the intruder accesses the train’s service cabin.
  - **Act 3:** The metro booth audit console flags the impossible duplicate fare-card tap.

---

## `sharepoint-cve-2023-29357-24955-chain` — Airport Terminal: Microsoft SharePoint: JWT "alg:none" Auth

- **Everyday Real-World Place:** International Airport Terminal & Boarding Gate (`airport-terminal-gate`)
- **3D Stage Direction:** Atmosphere `toxic-biolab-green` · Hero Prop `commercial-passenger-airplane` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `airport-terminal-gate` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 FORGING UNSIGN → 02 IMPERSONATING  → 03 BUSINESS CONNE → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a bustling international airport terminal with glowing departure screens, an X-ray security arch, a boarding gate counter, and a commercial passenger airplane parked right outside on the tarmac. Inside the airport terminal, a disguised passenger approaches the boarding gate carrying an altered boarding pass tucked inside an official airline jacket. In this real-world scenario, the intruder steps up to the airport security scanner arch blending in with everyday guests, then moves quietly past the airport security scanner arch into neighboring restricted rooms. Airfield control tower logs and the boarding-gate manifest counter catch the mismatch when one extra passenger shows up on the jet without a matching ticket purchase.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler walks through the airport terminal security arch toward the boarding gate.
  - **Act 2:** The gate agent waves the forged boarding pass onto the parked passenger airplane.
  - **Act 3:** The airport control tower and boarding scanner flag the mismatched flight manifest.

---

## `splunk-citrix-bleed-session-hijack` — Highway Toll Plaza: Citrix Bleed: NetScaler OOB Memory

- **Everyday Real-World Place:** Multi-Lane City Highway & Toll Plaza (`city-highway-toll-plaza`)
- **3D Stage Direction:** Atmosphere `golden-sunset-highway` · Hero Prop `highway-toll-barrier-sedan` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `city-highway-toll-plaza` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 NETSCALER SNPR → 02 NSC AAAC → 03 CITRIX ICA → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a wide multi-lane city highway approaching an overhead exit sign gantry and a row of striped toll plaza booths with automated lifting barrier arms. Cruising down the multi-lane express highway, a driver mounts a cloned electronic toll transponder behind the windshield right before entering the fast-pass lane. In this real-world scenario, the intruder steps up to the overhead license-plate gantry blending in with everyday guests, then completes the covert maneuver at the express highway toll barrier while the highway toll camera log records the anomaly. The highway authority’s overhead license-plate camera spots two different vehicles using the same toll pass minutes apart and sounds an immediate toll-plaza alert.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A car enters the multi-lane highway express lane carrying a cloned toll pass.
  - **Act 2:** The toll plaza booth reads the pass and lifts the striped barrier arm automatically.
  - **Act 3:** The overhead highway license-plate camera catches the duplicate toll pass crossing.

---

## `splunk-ivanti-connect-secure` — Courthouse: Ivanti Connect Secure : Auth

- **Everyday Real-World Place:** City Courthouse Hall & Official Notary Seal Desk (`courthouse-notary-hall`)
- **3D Stage Direction:** Atmosphere `azure-shinkai-day` · Hero Prop `courthouse-wax-seal-bench` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `courthouse-notary-hall` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 PATH TRAVERSAL → 02 ZIPLINE ELF → 03 DSLOG CREDENTI → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a grand city courthouse hall with fluted marble columns, an elevated wooden judge bench, a witness stand, and a brass wax-seal notary stamping desk. Entering the marble courthouse hall during a crowded docket, a forger requests a routine certified copy at the notary clerk’s brass stamping counter. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the brass courthouse wax-seal press, then quietly copies a trusted access pass from the court notary clerk's station. The court bailiff audits the official notary stamp registry and discovers stamped certificates that were never entered into the judge’s docket book.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A forger approaches the marble courthouse notary desk requesting a routine stamped voucher.
  - **Act 2:** Using a lifted seal impression, the forger presses official-looking passes away from the judge bench.
  - **Act 3:** The court bailiff’s stamp registry flags high-privilege certificates missing from the docket.

---

## `splunk-screenconnect-slashandgrab` — Logistics Warehouse: ConnectWise ScreenConnect "SlashAndGrab"

- **Everyday Real-World Place:** Logistics Warehouse & Forklift Loading Bay (`warehouse-forklift-bay`)
- **3D Stage Direction:** Atmosphere `arctic-datacenter-cobalt` · Hero Prop `warehouse-pallet-forklift` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `warehouse-forklift-bay` · Layout `vertical-shaft-cascade`
- **4-Act Phase Ribbon:** 01 SETUPWIZARD AS → 02 MALICIOUS ASHX → 03 DOWNSTREAM FLE → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a high-ceiling logistics warehouse with towering steel pallet racks stacked with labeled shipping crates, clipboard dock stations, and a bright yellow forklift cruising down the aisle. Inside the bustling logistics warehouse, an unverified driver climbs into a parked yellow forklift and rolls toward the high-bay customer storage racks. In this real-world scenario, the intruder steps up to the loading dock check-out clipboards blending in with everyday guests, then smuggles copied records out past the loading dock check-out clipboards in tiny disguised batches. The warehouse barcode inventory system flashes an urgent alert when hundreds of customer pallets are relabeled in minutes outside normal shift hours.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An unauthorized driver steers a yellow forklift down the logistics warehouse pallet aisle.
  - **Act 2:** Customer crates are lifted off the high racks, relabeled, and sealed with rogue padlocks.
  - **Act 3:** The warehouse barcode inventory system alerts dispatch to the mass pallet relabeling.

---

## `talos-arcanedoor-asa` — Highway Toll Plaza: ArcaneDoor : Cisco ASA Zero-Days,

- **Everyday Real-World Place:** Multi-Lane City Highway & Toll Plaza (`city-highway-toll-plaza`)
- **3D Stage Direction:** Atmosphere `azure-shinkai-day` · Hero Prop `highway-toll-barrier-sedan` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `city-highway-toll-plaza` · Layout `horizontal-pipeline`
- **4-Act Phase Ribbon:** 01 ASA ZERO-DAY → 02 LINE DANCER → 03 SYSLOG SUPPRES → 04 MEMORY SCAN
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a wide multi-lane city highway approaching an overhead exit sign gantry and a row of striped toll plaza booths with automated lifting barrier arms. Cruising down the multi-lane express highway, a driver mounts a cloned electronic toll transponder behind the windshield right before entering the fast-pass lane. In this real-world scenario, the intruder leaves a hidden spare latch behind so they can walk back into the highway toll plaza later, then smuggles copied records out past the overhead license-plate gantry in tiny disguised batches. The highway authority’s overhead license-plate camera spots two different vehicles using the same toll pass minutes apart and sounds an immediate toll-plaza alert.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A car enters the multi-lane highway express lane carrying a cloned toll pass.
  - **Act 2:** The toll plaza booth reads the pass and lifts the striped barrier arm automatically.
  - **Act 3:** The overhead highway license-plate camera catches the duplicate toll pass crossing.

---

## `unit42-panos-midnight-eclipse` — Apartment Lobby: Operation MidnightEclipse: PAN-OS GlobalProte

- **Everyday Real-World Place:** Residential Apartment Lobby & Brass Intercom (`apartment-lobby-intercom`)
- **3D Stage Direction:** Atmosphere `golden-sunset-highway` · Hero Prop `apartment-intercom-buzzer` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `grand-hotel-brass` · Architectural Motif `apartment-lobby-intercom` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 SESSID COOKIE → 02 TELEMETRY CRON → 03 UPSTYLE PYTHON → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a brick city apartment building entrance with a glass vestibule, a wall of brass resident mailboxes, a doorman podium, and a glowing brass intercom buzzer panel. Standing outside the locked glass apartment vestibule, an uninvited caller presses a crafted sequence on the brass intercom buzzer pretending to be building maintenance. In this real-world scenario, the intruder quietly copies a trusted access pass from the building doorman's station, then leaves a hidden spare latch behind so they can walk back into the apartment lobby later. The doorman checks the visitor sign-in ledger against the intercom buzz history and realizes no maintenance visit was ever scheduled by management.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An outsider triggers the brass intercom buzzer outside the locked apartment vestibule.
  - **Act 2:** The lobby door clicks open, letting the intruder walk past the resident mailboxes to the elevator.
  - **Act 3:** The doorman’s visitor logbook exposes the unscheduled buzz-in entry.

---

## `unit42-star-blizzard-evilginx-aitm` — Cinema Theater: Star Blizzard / Storm-0539: Evilginx

- **Everyday Real-World Place:** Downtown Cinema Theater & Projection Stage (`cinema-theater-stage`)
- **3D Stage Direction:** Atmosphere `crimson-bunker-alert` · Hero Prop `cinema-velvet-stage-curtain` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `bunker-crimson` · Architectural Motif `cinema-theater-stage` · Layout `horizontal-pipeline`
- **4-Act Phase Ribbon:** 01 EVILGINX AITM → 02 WEB SESSION → 03 STEALTH INBOX → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a classic downtown cinema theater with a glowing marquee ticket booth, red-carpet aisle, velvet stage curtains, warm spotlights, and an elevated projection room. Slipping past the red-carpet ticket booth during intermission, an impostor carrying a spare film canister walks backstage behind the heavy crimson velvet curtains. In this real-world scenario, the intruder steps up to the red-carpet ticket booth blending in with everyday guests, then quietly copies a trusted access pass from the theater usher's station. The theater manager checks the projection booth reel log against the marquee schedule and immediately halts the show upon spotting the swapped canister.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An impostor slips past the red-carpet cinema ticket booth carrying a lookalike film canister.
  - **Act 2:** Behind the velvet curtains, the projector reel is swapped before the stage lights dim.
  - **Act 3:** The projection booth log catches the mismatch between the marquee and the running reel.

---

## `vmware-vcenter-cve-2023-34048-unc3886` — Border Control: UNC3886: vCenter vmdird Out-of-Bounds Write

- **Everyday Real-World Place:** International Border Crossing & Passport Control (`border-passport-control`)
- **3D Stage Direction:** Atmosphere `velvet-midnight-vault` · Hero Prop `border-passport-xray-gate` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `desert-dish-terracotta` · Architectural Motif `border-passport-control` · Layout `split-mirror-comparison`
- **4-Act Phase Ribbon:** 01 VCENTER VMDIRD → 02 EXTRACTING DEC → 03 DEPLOYING VIRT → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture an international border crossing checkpoint with glass passport inspection booths, zig-zag queue stanchions, an X-ray luggage conveyor belt, and a striped crossing barrier. Approaching the international border crossing, a traveler steps up to the glass passport booth carrying a travel booklet with a subtly altered entry stamp. In this real-world scenario, the intruder steps up to the luggage x-ray belt & barrier blending in with everyday guests, then leaves a hidden spare latch behind so they can walk back into the border control later. A secondary customs officer cross-checks the border passport registry and catches a stamp serial number that was never issued by that embassy.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler presents an altered travel booklet at the international border passport booth.
  - **Act 2:** The luggage X-ray clears and the striped border crossing barrier lifts open.
  - **Act 3:** The customs passport registry flags the invalid stamp serial number.

---

## `zyxel-firewall-cve-2023-28771-ike-rce` — Supermarket: Zyxel Firewall Pre-Auth IKEv2 Packet

- **Everyday Real-World Place:** Neighborhood Supermarket & Checkout Lanes (`supermarket-retail-store`)
- **3D Stage Direction:** Atmosphere `clinical-xray-cleanroom` · Hero Prop `supermarket-checkout-cart` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `supermarket-retail-store` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 CRAFTING IKEV2 → 02 BREAKING OUT → 03 PERIMETER FIRE → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Think of a bright neighborhood supermarket filled with stocked grocery aisles, rolling shopping carts, barcode price stickers, and busy checkout conveyor belts. Pushing a metal shopping cart down the supermarket aisles, a shopper peels a cheap barcode sticker off a small item and presses it cleanly onto a high-value boxed product. In this real-world scenario, the intruder quietly copies a trusted access pass from the checkout cashier's station, then moves quietly past the barcode price scanner into neighboring restricted rooms. When the store manager reconciles the checkout receipt tape against the aisle inventory count and overhead camera, the swapped barcode trick is caught red-handed.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A shopper pushes a cart down the stocked supermarket aisles and swaps a barcode label.
  - **Act 2:** The checkout conveyor scanner accepts the disguised box and rings up a routine receipt.
  - **Act 3:** The store inventory log and overhead checkout camera expose the mismatched price scan.

---

## `dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment` — Bank Branch: Tomcat AJP Ghostcat & /manager/text/deploy

- **Everyday Real-World Place:** Downtown Bank Branch & Steel Vault (`bank-branch-vault`)
- **3D Stage Direction:** Atmosphere `arctic-datacenter-cobalt` · Hero Prop `bank-vault-wheel-door` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `bank-branch-vault` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 STAGE AJP/1 → 02 STAGE AUTHENTI → 03 STAGE JASPER → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a busy downtown bank branch with marble teller windows, brass counter bars, and a heavy circular steel vault at the rear. At the front marble counter, a visitor wearing a borrowed courier coat hands the bank teller an official-looking transfer slip to slip past the velvet queue. In this real-world scenario, the intruder smuggles copied records out past the brass teller window in tiny disguised batches, then smuggles copied records out past the brass teller window in tiny disguised batches. Only when the branch manager reviews the vault camera footage alongside the teller receipt book does the unauthorized vault visit stand out immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor steps up to the marble bank teller window carrying a borrowed transfer slip.
  - **Act 2:** The heavy circular steel bank vault door unlocks and swings open behind the counter.
  - **Act 3:** The branch audit camera and teller ledger record the unscheduled vault opening.

---

## `dfir-exchange-ews-autodiscover-proxylogon-iis-forensics` — Office Building: 02 DFIR — Exchange HttpProxy,

- **Everyday Real-World Place:** Glass Office Building & Front Reception (`office-building-reception`)
- **3D Stage Direction:** Atmosphere `desert-satellite-dusk` · Hero Prop `office-reception-turnstile` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `office-building-reception` · Layout `horizontal-pipeline`
- **4-Act Phase Ribbon:** 01 STAGE EXCHANGE → 02 STAGE EXCHANGE → 03 STAGE ASP → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a modern glass office building where visitors check in with the front-desk receptionist, scan a badge at the lobby turnstile, and walk between glass-walled meeting rooms. In the sunlit office building lobby, an unbadged visitor talks past the front-desk receptionist and persuades the desk clerk to print a temporary building pass. In this real-world scenario, the intruder smuggles copied records out past the lobby badge turnstile in tiny disguised batches, then smuggles copied records out past the lobby badge turnstile in tiny disguised batches. When building security compares the receptionist sign-in sheet against the turnstile badge swipes across the glass offices, the unescorted hallway trail is exposed.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor checks in at the office building reception desk and obtains a lobby badge.
  - **Act 2:** People walk past glass meeting rooms as the intruder slips through the turnstile into private offices.
  - **Act 3:** The receptionist logbook and hallway badge reader flag an unescorted entry.

---

## `dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell` — Courthouse: IIS HTTP.sys Kernel URI Registration

- **Everyday Real-World Place:** City Courthouse Hall & Official Notary Seal Desk (`courthouse-notary-hall`)
- **3D Stage Direction:** Atmosphere `storm-telecom-rooftop` · Hero Prop `courthouse-wax-seal-bench` · Camera `intimate-cutaway-dolly`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `courthouse-notary-hall` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 STAGE NATIVE/M → 02 STAGE KERNEL-M → 03 STAGE LIVE → 04 WIN EVENT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a grand city courthouse hall with fluted marble columns, an elevated wooden judge bench, a witness stand, and a brass wax-seal notary stamping desk. Entering the marble courthouse hall during a crowded docket, a forger requests a routine certified copy at the notary clerk’s brass stamping counter. In this real-world scenario, the intruder smuggles copied records out past the courtroom marble columns in tiny disguised batches, then leaves a hidden spare latch behind so they can walk back into the courthouse later. The court bailiff audits the official notary stamp registry and discovers stamped certificates that were never entered into the judge’s docket book.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A forger approaches the marble courthouse notary desk requesting a routine stamped voucher.
  - **Act 2:** Using a lifted seal impression, the forger presses official-looking passes away from the judge bench.
  - **Act 3:** The court bailiff’s stamp registry flags high-privilege certificates missing from the docket.

---

## `dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace` — Highway Toll Plaza: MSSQL xp_cmdshell / Ole Automation

- **Everyday Real-World Place:** Multi-Lane City Highway & Toll Plaza (`city-highway-toll-plaza`)
- **3D Stage Direction:** Atmosphere `clinical-xray-cleanroom` · Hero Prop `highway-toll-barrier-sedan` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `city-highway-toll-plaza` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 STAGE CONFIGUR → 02 STAGE XPLOG70 → 03 STAGE CLR → 04 WIN EVENT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a wide multi-lane city highway approaching an overhead exit sign gantry and a row of striped toll plaza booths with automated lifting barrier arms. Cruising down the multi-lane express highway, a driver mounts a cloned electronic toll transponder behind the windshield right before entering the fast-pass lane. In this real-world scenario, the intruder smuggles copied records out past the overhead license-plate gantry in tiny disguised batches, then leaves a hidden spare latch behind so they can walk back into the highway toll plaza later. The highway authority’s overhead license-plate camera spots two different vehicles using the same toll pass minutes apart and sounds an immediate toll-plaza alert.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A car enters the multi-lane highway express lane carrying a cloned toll pass.
  - **Act 2:** The toll plaza booth reads the pass and lifts the striped barrier arm automatically.
  - **Act 3:** The overhead highway license-plate camera catches the duplicate toll pass crossing.

---

## `dfir-postgresql-copy-from-program-pg-log-auditd-trace` — Post Office: PostgreSQL COPY FROM PROGRAM &

- **Everyday Real-World Place:** Neighborhood Post Office & Mail Sorting Hub (`post-office-sorting-hub`)
- **3D Stage Direction:** Atmosphere `neon-rain-cyberpunk` · Hero Prop `post-office-parcel-chute` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `post-office-sorting-hub` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 STAGE PRIVILEG → 02 STAGE COPY → 03 STAGE LARGE → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Think of a classic neighborhood post office with brass P.O. boxes lining the back wall, a parcel scale counter, a blue street mailbox outside, and angled mail sorting chutes. At the neighborhood post office counter, a sender slips tiny coded lines onto the back of ordinary postcards and drops them one by one into the mail sorting slot. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the brass p.o. box sorting wall, then approaches the postal scale & stamp window disguised as a regular visitor. The postmaster reviews the evening dispatch ledger and spots hundreds of oddly coded postcards all mailed to the exact same remote P.O. box.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A sender feeds a stream of coded postcards into the neighborhood post office slot.
  - **Act 2:** Each stamped card slides down the sorting chute into the brass P.O. box wall.
  - **Act 3:** The postmaster’s dispatch ledger flags the abnormal flood of identical destination cards.

---

## `dfir-sharepoint-iis-viewstate-losformatter-deserialization` — Coffee Shop: ASP.NET / SharePoint __VIEWSTATE MachineKey

- **Everyday Real-World Place:** Corner Coffee Shop & Co-Working Cafe (`coffee-shop-cafe`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `cafe-espresso-bar-machine` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `grand-hotel-brass` · Architectural Motif `coffee-shop-cafe` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 STAGE WEB → 02 STAGE SIGNED → 03 STAGE W3WP → 04 SYSMON
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a cozy corner coffee shop and co-working cafe with a striped storefront awning, warm wooden espresso bar, glass pastry case, and laptops open across bistro tables. Sitting quietly at a corner bistro table near the espresso bar, a patron sets up a lookalike free coffee-shop guest board to attract nearby customers. In this real-world scenario, the intruder quietly copies a trusted access pass from the cafe barista's station, then quietly copies a trusted access pass from the cafe barista's station. The cafe manager notices a strange second sign-in notice taped beside the pastry case and alerts customers to the fake hotspot at the corner table.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A patron sets up a lookalike sign-in trap at a corner bistro table inside the coffee shop.
  - **Act 2:** Unsuspecting customers by the espresso bar share private slips across the rigged cafe table.
  - **Act 3:** The cafe manager’s order screen catches the rogue sign-in station beside the pastry case.

---

## `dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing` — Bank Branch: Zeek ssl.log JA3/JA4 Fingerprint &

- **Everyday Real-World Place:** Downtown Bank Branch & Steel Vault (`bank-branch-vault`)
- **3D Stage Direction:** Atmosphere `golden-sunset-highway` · Hero Prop `bank-vault-wheel-door` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `bank-branch-vault` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 STAGE TLS → 02 STAGE SERVERHE → 03 STAGE PERIODIC → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a busy downtown bank branch with marble teller windows, brass counter bars, and a heavy circular steel vault at the rear. At the front marble counter, a visitor wearing a borrowed courier coat hands the bank teller an official-looking transfer slip to slip past the velvet queue. In this real-world scenario, the intruder smuggles copied records out past the brass teller window in tiny disguised batches, then smuggles copied records out past the brass teller window in tiny disguised batches. Only when the branch manager reviews the vault camera footage alongside the teller receipt book does the unauthorized vault visit stand out immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor steps up to the marble bank teller window carrying a borrowed transfer slip.
  - **Act 2:** The heavy circular steel bank vault door unlocks and swings open behind the counter.
  - **Act 3:** The branch audit camera and teller ledger record the unscheduled vault opening.

