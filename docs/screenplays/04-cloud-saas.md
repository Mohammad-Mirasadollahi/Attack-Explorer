# Cloud & SaaS Control-Plane Real-World Screenplays

> **Count:** 25 scenarios · **100% Real-World 3D & 2D Aligned · Zero Visual Collisions**

## `aws-cognito-iam-passrole-privesc` — Office Building: IAM PassRole + Lambda CreateFunction

- **Everyday Real-World Place:** Glass Office Building & Front Reception (`office-building-reception`)
- **3D Stage Direction:** Atmosphere `azure-shinkai-day` · Hero Prop `office-reception-turnstile` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `office-building-reception` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 IAM PASSROLE → 02 LAMBDA INVOCAT → 03 CLOUDTRAIL STO → 04 IDS ALERT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a modern glass office building where visitors check in with the front-desk receptionist, scan a badge at the lobby turnstile, and walk between glass-walled meeting rooms. In the sunlit office building lobby, an unbadged visitor talks past the front-desk receptionist and persuades the desk clerk to print a temporary building pass. In this real-world scenario, the intruder steps up to the lobby badge turnstile blending in with everyday guests, then leaves a telltale trail inside the reception sign-in logbook. When building security compares the receptionist sign-in sheet against the turnstile badge swipes across the glass offices, the unescorted hallway trail is exposed.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor checks in at the office building reception desk and obtains a lobby badge.
  - **Act 2:** People walk past glass meeting rooms as the intruder slips through the turnstile into private offices.
  - **Act 3:** The receptionist logbook and hallway badge reader flag an unescorted entry.

---

## `aws-imdsv1-ssrf-capitalone-style` — Office Building: EC2 Reverse-Proxy SSRF to IMDSv1

- **Everyday Real-World Place:** Glass Office Building & Front Reception (`office-building-reception`)
- **3D Stage Direction:** Atmosphere `clinical-xray-cleanroom` · Hero Prop `office-reception-turnstile` · Camera `intimate-cutaway-dolly`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `office-building-reception` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 SSRF INJECTION → 02 EXTRACTION TEM → 03 OFF-CLOUD CRED → 04 IDS ALERT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a modern glass office building where visitors check in with the front-desk receptionist, scan a badge at the lobby turnstile, and walk between glass-walled meeting rooms. In the sunlit office building lobby, an unbadged visitor talks past the front-desk receptionist and persuades the desk clerk to print a temporary building pass. In this real-world scenario, the intruder moves quietly past the lobby badge turnstile into neighboring restricted rooms, then quietly copies a trusted access pass from the front-desk receptionist's station. When building security compares the receptionist sign-in sheet against the turnstile badge swipes across the glass offices, the unescorted hallway trail is exposed.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor checks in at the office building reception desk and obtains a lobby badge.
  - **Act 2:** People walk past glass meeting rooms as the intruder slips through the turnstile into private offices.
  - **Act 3:** The receptionist logbook and hallway badge reader flag an unescorted entry.

---

## `azure-ad-connect-pass-the-certificate` — Border Control: Entra Connect MSOL_ DKM Decryption

- **Everyday Real-World Place:** International Border Crossing & Passport Control (`border-passport-control`)
- **3D Stage Direction:** Atmosphere `golden-sunset-highway` · Hero Prop `border-passport-xray-gate` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `desert-dish-terracotta` · Architectural Motif `border-passport-control` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 QUERYING ADSYN → 02 DPAPI MCRYPT → 03 MSOL DCSYNC → 04 WIN EVENT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture an international border crossing checkpoint with glass passport inspection booths, zig-zag queue stanchions, an X-ray luggage conveyor belt, and a striped crossing barrier. Approaching the international border crossing, a traveler steps up to the glass passport booth carrying a travel booklet with a subtly altered entry stamp. In this real-world scenario, the intruder steps up to the luggage x-ray belt & barrier blending in with everyday guests, then moves quietly past the luggage x-ray belt & barrier into neighboring restricted rooms. A secondary customs officer cross-checks the border passport registry and catches a stamp serial number that was never issued by that embassy.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler presents an altered travel booklet at the international border passport booth.
  - **Act 2:** The luggage X-ray clears and the striped border crossing barrier lifts open.
  - **Act 3:** The customs passport registry flags the invalid stamp serial number.

---

## `gcp-service-account-hmac-key-pivot` — Subway Metro: GCP iam.serviceAccountKeys.create & serviceAccou

- **Everyday Real-World Place:** Underground Subway Metro & Fare Turnstiles (`subway-metro-station`)
- **3D Stage Direction:** Atmosphere `velvet-midnight-vault` · Hero Prop `subway-metro-turnstile-car` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `orbital-indigo` · Architectural Motif `subway-metro-station` · Layout `vault-cutaway-blueprint`
- **4-Act Phase Ribbon:** 01 ENUMERATING PR → 02 MINTING USER-M → 03 IMPERSONATED E → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine an underground city subway metro station with tiled tunnel walls, glowing route maps, chrome fare turnstiles, ticket kiosks, and a gleaming metro train sliding along the platform. Down in the underground subway concourse, a rider taps a replayed magnetic metro fare card at the chrome turnstile bank during evening rush hour. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the underground subway train car, then smuggles copied records out past the metro card turnstile bank in tiny disguised batches. The metro booth attendant’s fare-gate console flags a single card swiped at two distant stations within seconds and alerts transit security.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A rider taps a cloned metro card at the chrome underground subway turnstile.
  - **Act 2:** The subway doors slide open and the intruder accesses the train’s service cabin.
  - **Act 3:** The metro booth audit console flags the impossible duplicate fare-card tap.

---

## `k8s-runc-cve-2024-21626-leaky-vessels` — Train Station: "Leaky Vessels" runc WORKDIR Host

- **Everyday Real-World Place:** Central Train Station & Express Platform (`train-station-platform`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `express-station-locomotive` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `train-station-platform` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 RUNC CGROUP → 02 PERSISTENT HOS → 03 RELATIVE DOT-D → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a grand central train station with an arched iron canopy, hanging station clock, ticket turnstiles, parallel railway tracks, and a sleek express train waiting at the platform. Beneath the central train station canopy, a stowaway slips past the platform ticket barrier using a copied conductor punch card right before boarding time. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the express passenger train, then bypasses the normal inspection rule to reach the express passenger train. The station master’s glowing track-indicator board flashes a route mismatch the instant the express train leaves its scheduled platform line.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A stowaway passes the central train station ticket barrier beneath the station clock.
  - **Act 2:** A flipped track lever diverts the express passenger train away from its scheduled rail line.
  - **Act 3:** The station master’s signal board flags the unscheduled track switch immediately.

---

## `microsoft-storm-0558-msa-signing-key` — Border Control: Storm-0558: Acquired MSA Consumer Signing

- **Everyday Real-World Place:** International Border Crossing & Passport Control (`border-passport-control`)
- **3D Stage Direction:** Atmosphere `crimson-bunker-alert` · Hero Prop `border-passport-xray-gate` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `desert-dish-terracotta` · Architectural Motif `border-passport-control` · Layout `vault-cutaway-blueprint`
- **4-Act Phase Ribbon:** 01 OFFLINE TOKEN → 02 CROSS-REALM VA → 03 SILENT OWA → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture an international border crossing checkpoint with glass passport inspection booths, zig-zag queue stanchions, an X-ray luggage conveyor belt, and a striped crossing barrier. Approaching the international border crossing, a traveler steps up to the glass passport booth carrying a travel booklet with a subtly altered entry stamp. In this real-world scenario, the intruder quietly copies a trusted access pass from the border customs officer's station, then leaves a telltale trail inside the customs passport registry. A secondary customs officer cross-checks the border passport registry and catches a stamp serial number that was never issued by that embassy.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler presents an altered travel booklet at the international border passport booth.
  - **Act 2:** The luggage X-ray clears and the striped border crossing barrier lifts open.
  - **Act 3:** The customs passport registry flags the invalid stamp serial number.

---

## `okta-har-file-session-token-hijack` — Bank Branch: Support Case .har File sid

- **Everyday Real-World Place:** Downtown Bank Branch & Steel Vault (`bank-branch-vault`)
- **3D Stage Direction:** Atmosphere `velvet-midnight-vault` · Hero Prop `bank-vault-wheel-door` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `bank-branch-vault` · Layout `split-mirror-comparison`
- **4-Act Phase Ribbon:** 01 EXTRACTING LIV → 02 REPLAYING SID → 03 MINTING PERSIS → 04 IDS ALERT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a busy downtown bank branch with marble teller windows, brass counter bars, and a heavy circular steel vault at the rear. At the front marble counter, a visitor wearing a borrowed courier coat hands the bank teller an official-looking transfer slip to slip past the velvet queue. In this real-world scenario, the intruder quietly copies a trusted access pass from the bank teller's station, then quietly copies a trusted access pass from the bank teller's station. Only when the branch manager reviews the vault camera footage alongside the teller receipt book does the unauthorized vault visit stand out immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor steps up to the marble bank teller window carrying a borrowed transfer slip.
  - **Act 2:** The heavy circular steel bank vault door unlocks and swings open behind the counter.
  - **Act 3:** The branch audit camera and teller ledger record the unscheduled vault opening.

---

## `snowflake-unc5537-saas-extortion` — Courthouse: UNC5537 Campaign: Infostealer Credential Replay

- **Everyday Real-World Place:** City Courthouse Hall & Official Notary Seal Desk (`courthouse-notary-hall`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `courthouse-wax-seal-bench` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `courthouse-notary-hall` · Layout `vertical-shaft-cascade`
- **4-Act Phase Ribbon:** 01 INFOSTEALER CR → 02 FROSTBITE RAPE → 03 DBEAVER ULTIMA → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Imagine a grand city courthouse hall with fluted marble columns, an elevated wooden judge bench, a witness stand, and a brass wax-seal notary stamping desk. Entering the marble courthouse hall during a crowded docket, a forger requests a routine certified copy at the notary clerk’s brass stamping counter. In this real-world scenario, the intruder quietly copies a trusted access pass from the court notary clerk's station, then smuggles copied records out past the courtroom marble columns in tiny disguised batches. The court bailiff audits the official notary stamp registry and discovers stamped certificates that were never entered into the judge’s docket book.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A forger approaches the marble courthouse notary desk requesting a routine stamped voucher.
  - **Act 2:** Using a lifted seal impression, the forger presses official-looking passes away from the judge bench.
  - **Act 3:** The court bailiff’s stamp registry flags high-privilege certificates missing from the docket.

---

## `sysdig-scarleteel-aws-eks-terraform` — Art Museum: SCARLETEEL Operation: Kubernetes Pod RCE,

- **Everyday Real-World Place:** National Art Museum Gallery & Glass Pedestals (`museum-gallery-hall`)
- **3D Stage Direction:** Atmosphere `warm-brass-grand-hotel` · Hero Prop `museum-laser-glass-pedestal` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `grand-hotel-brass` · Architectural Motif `museum-gallery-hall` · Layout `vault-cutaway-blueprint`
- **4-Act Phase Ribbon:** 01 KUBERNETES POD → 02 TERRAFORM STAT → 03 CROSS-ACCOUNT  → 04 IDS ALERT
- **Registered Sections:** briefing, step-1, step-2, step-3, memory-forensics
- **Everyday Real-World Story Premise:** Picture a stately national art museum gallery with framed paintings on marble walls, velvet stanchion ropes, illuminated glass display pedestals, and thin security laser beams. Inside the hushed art museum hall, a thief studies how the velvet stanchions and glass pedestal sensors respond to routine curator maintenance checks. In this real-world scenario, the intruder quietly copies a trusted access pass from the museum curator's station, then moves quietly past the velvet rope gallery entrance into neighboring restricted rooms. During closing inspection, the museum curator checks the gallery motion-sensor log and spots a brief laser shadow that never matched any scheduled restoration.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An intruder approaches the velvet stanchion ropes inside the quiet art museum gallery.
  - **Act 2:** Bypassing the thin glass-case beam, the thief swaps the display piece for a convincing decoy.
  - **Act 3:** The museum guard console logs an unscheduled sensor shadow around the glass pedestal.

---

## `cloud-aws-eks-aws-auth-configmap-system-masters-audit` — Subway Metro: Amazon EKS aws-auth ConfigMap system:masters

- **Everyday Real-World Place:** Underground Subway Metro & Fare Turnstiles (`subway-metro-station`)
- **3D Stage Direction:** Atmosphere `crimson-bunker-alert` · Hero Prop `subway-metro-turnstile-car` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `orbital-indigo` · Architectural Motif `subway-metro-station` · Layout `conveyor-assembly-track`
- **4-Act Phase Ribbon:** 01 STAGE EKS → 02 STAGE PATCHING → 03 STAGE CLUSTER- → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine an underground city subway metro station with tiled tunnel walls, glowing route maps, chrome fare turnstiles, ticket kiosks, and a gleaming metro train sliding along the platform. Down in the underground subway concourse, a rider taps a replayed magnetic metro fare card at the chrome turnstile bank during evening rush hour. In this real-world scenario, the intruder quietly copies a trusted access pass from the metro station agent's station, then approaches the metro card turnstile bank disguised as a regular visitor. The metro booth attendant’s fare-gate console flags a single card swiped at two distant stations within seconds and alerts transit security.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A rider taps a cloned metro card at the chrome underground subway turnstile.
  - **Act 2:** The subway doors slide open and the intruder accesses the train’s service cabin.
  - **Act 3:** The metro booth audit console flags the impossible duplicate fare-card tap.

---

## `cloud-aws-s3-kms-external-account-encryption-extortion-audit` — Logistics Warehouse: Swapping Every Pallet Padlock

- **Everyday Real-World Place:** Logistics Warehouse & Forklift Loading Bay (`warehouse-forklift-bay`)
- **3D Stage Direction:** Atmosphere `sunrise-logistics-port` · Hero Prop `warehouse-pallet-forklift` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `warehouse-forklift-bay` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 STAGE CROSS-AC → 02 STAGE IN-PLACE → 03 STAGE PUTBUCKE → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a high-ceiling logistics warehouse with towering steel pallet racks stacked with labeled shipping crates, clipboard dock stations, and a bright yellow forklift cruising down the aisle. Inside the bustling logistics warehouse, an unverified driver climbs into a parked yellow forklift and rolls toward the high-bay customer storage racks. In this real-world scenario, the intruder quietly copies a trusted access pass from the warehouse dispatcher's station, then smuggles copied records out past the loading dock check-out clipboards in tiny disguised batches. The warehouse barcode inventory system flashes an urgent alert when hundreds of customer pallets are relabeled in minutes outside normal shift hours.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An unauthorized driver steers a yellow forklift down the logistics warehouse pallet aisle.
  - **Act 2:** Customer crates are lifted off the high racks, relabeled, and sealed with rogue padlocks.
  - **Act 3:** The warehouse barcode inventory system alerts dispatch to the mass pallet relabeling.

---

## `cloud-aws-sts-federation-token-console-signin-audit` — Airport Terminal: AWS STS GetFederationToken Console Sign-In

- **Everyday Real-World Place:** International Airport Terminal & Boarding Gate (`airport-terminal-gate`)
- **3D Stage Direction:** Atmosphere `neon-rain-cyberpunk` · Hero Prop `commercial-passenger-airplane` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `airport-terminal-gate` · Layout `vault-cutaway-blueprint`
- **4-Act Phase Ribbon:** 01 STAGE PROGRAMM → 02 STAGE FEDERATI → 03 STAGE CONSOLE → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a bustling international airport terminal with glowing departure screens, an X-ray security arch, a boarding gate counter, and a commercial passenger airplane parked right outside on the tarmac. Inside the airport terminal, a disguised passenger approaches the boarding gate carrying an altered boarding pass tucked inside an official airline jacket. In this real-world scenario, the intruder quietly copies a trusted access pass from the gate agent's station, then smuggles copied records out past the airport security scanner arch in tiny disguised batches. Airfield control tower logs and the boarding-gate manifest counter catch the mismatch when one extra passenger shows up on the jet without a matching ticket purchase.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler walks through the airport terminal security arch toward the boarding gate.
  - **Act 2:** The gate agent waves the forged boarding pass onto the parked passenger airplane.
  - **Act 3:** The airport control tower and boarding scanner flag the mismatched flight manifest.

---

## `cloud-azure-vm-custom-script-extension-managed-identity-audit` — Art Museum: Azure VM CustomScriptExtension & IMDS

- **Everyday Real-World Place:** National Art Museum Gallery & Glass Pedestals (`museum-gallery-hall`)
- **3D Stage Direction:** Atmosphere `obsidian-orbital-deck` · Hero Prop `museum-laser-glass-pedestal` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `grand-hotel-brass` · Architectural Motif `museum-gallery-hall` · Layout `vertical-shaft-cascade`
- **4-Act Phase Ribbon:** 01 STAGE ARM → 02 STAGE GUEST → 03 STAGE LOCAL → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a stately national art museum gallery with framed paintings on marble walls, velvet stanchion ropes, illuminated glass display pedestals, and thin security laser beams. Inside the hushed art museum hall, a thief studies how the velvet stanchions and glass pedestal sensors respond to routine curator maintenance checks. In this real-world scenario, the intruder smuggles copied records out past the velvet rope gallery entrance in tiny disguised batches, then quietly copies a trusted access pass from the museum curator's station. During closing inspection, the museum curator checks the gallery motion-sensor log and spots a brief laser shadow that never matched any scheduled restoration.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An intruder approaches the velvet stanchion ropes inside the quiet art museum gallery.
  - **Act 2:** Bypassing the thin glass-case beam, the thief swaps the display piece for a convincing decoy.
  - **Act 3:** The museum guard console logs an unscheduled sensor shadow around the glass pedestal.

---

## `cloud-entra-id-conditional-access-device-code-phishing-audit` — Train Station: Entra ID OAuth 2.0 Device

- **Everyday Real-World Place:** Central Train Station & Express Platform (`train-station-platform`)
- **3D Stage Direction:** Atmosphere `neon-rain-cyberpunk` · Hero Prop `express-station-locomotive` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `train-station-platform` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 STAGE OAUTH → 02 STAGE FAMILY → 03 STAGE MICROSOF → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a grand central train station with an arched iron canopy, hanging station clock, ticket turnstiles, parallel railway tracks, and a sleek express train waiting at the platform. Beneath the central train station canopy, a stowaway slips past the platform ticket barrier using a copied conductor punch card right before boarding time. In this real-world scenario, the intruder approaches the platform ticket barrier disguised as a regular visitor, then smuggles copied records out past the platform ticket barrier in tiny disguised batches. The station master’s glowing track-indicator board flashes a route mismatch the instant the express train leaves its scheduled platform line.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A stowaway passes the central train station ticket barrier beneath the station clock.
  - **Act 2:** A flipped track lever diverts the express passenger train away from its scheduled rail line.
  - **Act 3:** The station master’s signal board flags the unscheduled track switch immediately.

---

## `cloud-gcp-cloud-build-default-service-account-artifact-audit` — Factory Floor: GCP Cloud Build Default Service

- **Everyday Real-World Place:** Automated Factory Floor & Assembly Conveyor (`factory-assembly-line`)
- **3D Stage Direction:** Atmosphere `sunrise-logistics-port` · Hero Prop `factory-conveyor-robot-arm` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `factory-assembly-line` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 STAGE SUBMITTI → 02 STAGE WORKER → 03 STAGE ARTIFACT → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture an active industrial factory floor with a moving assembly conveyor belt, an articulated yellow robotic arm, steel parts bins, and a final quality-seal stamping desk. During the quiet night shift on the factory floor, a saboteur steps beside the moving assembly conveyor right before the automated quality stamp. In this real-world scenario, the intruder smuggles copied records out past the factory quality stamp station in tiny disguised batches, then smuggles copied records out past the factory quality stamp station in tiny disguised batches. Only when a quality engineer checks the finished product’s weight and internal wiring against the locked master blueprint cabinet does the factory-line swap appear.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A counterfeit part is slipped onto the moving factory assembly line before inspection.
  - **Act 2:** The robotic arm and stamping press seal the tampered box with an official factory badge.
  - **Act 3:** The quality inspection camera and blueprint check expose the altered assembly unit.

---

## `cloud-github-actions-pull-request-target-oidc-token-audit` — Factory Floor: GitHub Actions pull_request_target Workflow &

- **Everyday Real-World Place:** Automated Factory Floor & Assembly Conveyor (`factory-assembly-line`)
- **3D Stage Direction:** Atmosphere `crimson-bunker-alert` · Hero Prop `factory-conveyor-robot-arm` · Camera `symmetric-cathedral-axis`
- **2D Technical Clip Direction:** Theme `foundry-amber` · Architectural Motif `factory-assembly-line` · Layout `vault-cutaway-blueprint`
- **4-Act Phase Ribbon:** 01 STAGE PRIVILEG → 02 STAGE RUNNER → 03 STAGE AWS → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture an active industrial factory floor with a moving assembly conveyor belt, an articulated yellow robotic arm, steel parts bins, and a final quality-seal stamping desk. During the quiet night shift on the factory floor, a saboteur steps beside the moving assembly conveyor right before the automated quality stamp. In this real-world scenario, the intruder approaches the factory quality stamp station disguised as a regular visitor, then smuggles copied records out past the factory quality stamp station in tiny disguised batches. Only when a quality engineer checks the finished product’s weight and internal wiring against the locked master blueprint cabinet does the factory-line swap appear.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A counterfeit part is slipped onto the moving factory assembly line before inspection.
  - **Act 2:** The robotic arm and stamping press seal the tampered box with an official factory badge.
  - **Act 3:** The quality inspection camera and blueprint check expose the altered assembly unit.

---

## `cloud-m365-sharepoint-ediscovery-compliance-search-export-audit` — Office Building: M365 Purview New-ComplianceSearch & eDiscover

- **Everyday Real-World Place:** Glass Office Building & Front Reception (`office-building-reception`)
- **3D Stage Direction:** Atmosphere `alpine-substation-crisp` · Hero Prop `office-reception-turnstile` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `office-building-reception` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 STAGE ROLEGROU → 02 STAGE TENANT-W → 03 STAGE PST/ZIP → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a modern glass office building where visitors check in with the front-desk receptionist, scan a badge at the lobby turnstile, and walk between glass-walled meeting rooms. In the sunlit office building lobby, an unbadged visitor talks past the front-desk receptionist and persuades the desk clerk to print a temporary building pass. In this real-world scenario, the intruder smuggles copied records out past the lobby badge turnstile in tiny disguised batches, then smuggles copied records out past the lobby badge turnstile in tiny disguised batches. When building security compares the receptionist sign-in sheet against the turnstile badge swipes across the glass offices, the unescorted hallway trail is exposed.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor checks in at the office building reception desk and obtains a lobby badge.
  - **Act 2:** People walk past glass meeting rooms as the intruder slips through the turnstile into private offices.
  - **Act 3:** The receptionist logbook and hallway badge reader flag an unescorted entry.

---

## `cloud-midnight-blizzard-oauth-legacy-test-app-audit` — Border Control: 02 — Midnight Blizzard Legacy

- **Everyday Real-World Place:** International Border Crossing & Passport Control (`border-passport-control`)
- **3D Stage Direction:** Atmosphere `arctic-datacenter-cobalt` · Hero Prop `border-passport-xray-gate` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `desert-dish-terracotta` · Architectural Motif `border-passport-control` · Layout `radial-broadcast-fan`
- **4-Act Phase Ribbon:** 01 STAGE LOW-VOLU → 02 STAGE SERVICE → 03 STAGE OAUTH → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture an international border crossing checkpoint with glass passport inspection booths, zig-zag queue stanchions, an X-ray luggage conveyor belt, and a striped crossing barrier. Approaching the international border crossing, a traveler steps up to the glass passport booth carrying a travel booklet with a subtly altered entry stamp. In this real-world scenario, the intruder smuggles copied records out past the luggage x-ray belt & barrier in tiny disguised batches, then quietly copies a trusted access pass from the border customs officer's station. A secondary customs officer cross-checks the border passport registry and catches a stamp serial number that was never issued by that embassy.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler presents an altered travel booklet at the international border passport booth.
  - **Act 2:** The luggage X-ray clears and the striped border crossing barrier lifts open.
  - **Act 3:** The customs passport registry flags the invalid stamp serial number.

---

## `cloud-salesforce-connected-app-oauth-bulk-api-export-audit` — City Street: SaaS Connected App OAuth Scope

- **Everyday Real-World Place:** Downtown City Street Corner & Traffic Lights (`city-street-intersection`)
- **3D Stage Direction:** Atmosphere `golden-sunset-highway` · Hero Prop `street-traffic-light-taxi` · Camera `low-hero-right`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `city-street-intersection` · Layout `split-mirror-comparison`
- **4-Act Phase Ribbon:** 01 STAGE UNVERIFI → 02 STAGE ASYNCHRO → 03 STAGE BULK → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a lively downtown city street intersection with painted zebra crosswalks, glowing red-yellow-green traffic lights, corner shop awnings, and passing yellow taxis. At the busy downtown street corner, an impostor wearing a reflective utility vest kneels beside the metal traffic-signal control cabinet while pedestrians cross the street. In this real-world scenario, the intruder quietly copies a trusted access pass from the traffic officer's station, then quietly copies a trusted access pass from the traffic officer's station. The city intersection camera and municipal traffic control board detect the impossible all-green light timing and dispatch a traffic officer immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An impostor in a utility vest opens the street-corner traffic signal cabinet.
  - **Act 2:** The glowing traffic lights shift out of sequence as a yellow city taxi reroutes across the crosswalk.
  - **Act 3:** The downtown intersection camera alerts city traffic control to the abnormal signal timing.

---

## `dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda` — Post Office: AWS IAM PassRole + Lambda

- **Everyday Real-World Place:** Neighborhood Post Office & Mail Sorting Hub (`post-office-sorting-hub`)
- **3D Stage Direction:** Atmosphere `azure-shinkai-day` · Hero Prop `post-office-parcel-chute` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `post-office-sorting-hub` · Layout `orbital-hub-spokes`
- **4-Act Phase Ribbon:** 01 STAGE IAM → 02 STAGE LAMBDA → 03 STAGE CLOUDTRA → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Think of a classic neighborhood post office with brass P.O. boxes lining the back wall, a parcel scale counter, a blue street mailbox outside, and angled mail sorting chutes. At the neighborhood post office counter, a sender slips tiny coded lines onto the back of ordinary postcards and drops them one by one into the mail sorting slot. In this real-world scenario, the intruder bypasses the normal inspection rule to reach the brass p.o. box sorting wall, then smuggles copied records out past the postal scale & stamp window in tiny disguised batches. The postmaster reviews the evening dispatch ledger and spots hundreds of oddly coded postcards all mailed to the exact same remote P.O. box.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A sender feeds a stream of coded postcards into the neighborhood post office slot.
  - **Act 2:** Each stamped card slides down the sorting chute into the brass P.O. box wall.
  - **Act 3:** The postmaster’s dispatch ledger flags the abnormal flood of identical destination cards.

---

## `dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics` — City Park: AWS CloudTrail IMDSv1 Role Theft,

- **Everyday Real-World Place:** City Park Plaza & Central Stone Fountain (`city-park-fountain`)
- **3D Stage Direction:** Atmosphere `sunrise-logistics-port` · Hero Prop `park-water-fountain-bench` · Camera `dramatic-diagonal-sweep`
- **2D Technical Clip Direction:** Theme `biolab-emerald` · Architectural Motif `city-park-fountain` · Layout `horizontal-pipeline`
- **4-Act Phase Ribbon:** 01 STAGE EC2 → 02 STAGE OFF-INST → 03 STAGE DATA → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a sunlit city park with green lawns, shade trees, winding stone footpaths, wooden benches, and a tiered stone water fountain at the center. Strolling along the city park footpath like an ordinary afternoon walker, a covert courier sits on a wooden bench near the stone fountain and tapes a coded note underneath the armrest. In this real-world scenario, the intruder quietly copies a trusted access pass from the park ranger's station, then smuggles copied records out past the park gate footpath in tiny disguised batches. A watchful park ranger at the corner kiosk notices the exact same bench receiving repeated timed drop-offs and logs the suspicious pattern on the patrol board.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A courier walks down the tree-lined city park footpath to a bench beside the fountain.
  - **Act 2:** Coded instructions change hands quietly beside the splashing central stone fountain.
  - **Act 3:** The park ranger kiosk logs the repeated timed exchanges along the footpath.

---

## `dfir-entra-id-prt-roadtools-device-registration-forensics` — City Street: jan Mollema DFIR — Entra

- **Everyday Real-World Place:** Downtown City Street Corner & Traffic Lights (`city-street-intersection`)
- **3D Stage Direction:** Atmosphere `azure-shinkai-day` · Hero Prop `street-traffic-light-taxi` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `sunset-highway-coral` · Architectural Motif `city-street-intersection` · Layout `diagonal-escalation-bridge`
- **4-Act Phase Ribbon:** 01 STAGE TOKEN → 02 STAGE ROGUE → 03 STAGE PRIMARY → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Imagine a lively downtown city street intersection with painted zebra crosswalks, glowing red-yellow-green traffic lights, corner shop awnings, and passing yellow taxis. At the busy downtown street corner, an impostor wearing a reflective utility vest kneels beside the metal traffic-signal control cabinet while pedestrians cross the street. In this real-world scenario, the intruder quietly copies a trusted access pass from the traffic officer's station, then quietly copies a trusted access pass from the traffic officer's station. The city intersection camera and municipal traffic control board detect the impossible all-green light timing and dispatch a traffic officer immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** An impostor in a utility vest opens the street-corner traffic signal cabinet.
  - **Act 2:** The glowing traffic lights shift out of sequence as a yellow city taxi reroutes across the crosswalk.
  - **Act 3:** The downtown intersection camera alerts city traffic control to the abnormal signal timing.

---

## `dfir-gcp-cloud-audit-service-account-key-impersonation` — Bank Branch: GCP Cloud Audit ServiceAccountKey Creation

- **Everyday Real-World Place:** Downtown Bank Branch & Steel Vault (`bank-branch-vault`)
- **3D Stage Direction:** Atmosphere `storm-telecom-rooftop` · Hero Prop `bank-vault-wheel-door` · Camera `establishing-high-left`
- **2D Technical Clip Direction:** Theme `cathedral-sepia-gold` · Architectural Motif `bank-branch-vault` · Layout `horizontal-pipeline`
- **4-Act Phase Ribbon:** 01 STAGE SERVICE → 02 STAGE PERSISTE → 03 STAGE BIGQUERY → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a busy downtown bank branch with marble teller windows, brass counter bars, and a heavy circular steel vault at the rear. At the front marble counter, a visitor wearing a borrowed courier coat hands the bank teller an official-looking transfer slip to slip past the velvet queue. In this real-world scenario, the intruder quietly copies a trusted access pass from the bank teller's station, then smuggles copied records out past the brass teller window in tiny disguised batches. Only when the branch manager reviews the vault camera footage alongside the teller receipt book does the unauthorized vault visit stand out immediately.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A visitor steps up to the marble bank teller window carrying a borrowed transfer slip.
  - **Act 2:** The heavy circular steel bank vault door unlocks and swings open behind the counter.
  - **Act 3:** The branch audit camera and teller ledger record the unscheduled vault opening.

---

## `dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape` — University Hall: Kubernetes Audit Log Privileged Pod

- **Everyday Real-World Place:** University Lecture & Exam Hall (`university-exam-hall`)
- **3D Stage Direction:** Atmosphere `clinical-xray-cleanroom` · Hero Prop `university-proctor-podium` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `neural-violet` · Architectural Motif `university-exam-hall` · Layout `vertical-shaft-cascade`
- **4-Act Phase Ribbon:** 01 STAGE SERVICEA → 02 STAGE PRIVILEG → 03 STAGE HOST → 04 LINUX AUDIT
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a brick university lecture and exam hall with tiered wooden student desks, a tall green chalkboard, hallway lockers, and a wooden proctor podium at the front. Inside the quiet university exam hall, a student slips hidden extra directions written in faint pencil into the margin of a submitted study booklet. In this real-world scenario, the intruder leaves a hidden spare latch behind so they can walk back into the university hall later, then smuggles copied records out past the lecture hall attendance desk in tiny disguised batches. The university dean reviews the exam hall proctor log and flags an automated grading run that tried to access locked answer folders mid-session.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A student places hidden instructions inside a study booklet in the university exam hall.
  - **Act 2:** At the front proctor podium, the grading assistant obeys the hidden note and opens the answer key.
  - **Act 3:** The exam hall proctor log flags the unauthorized access to the locked grading folder.

---

## `dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule` — Airport Terminal: 320A DFIR — M365 Purview

- **Everyday Real-World Place:** International Airport Terminal & Boarding Gate (`airport-terminal-gate`)
- **3D Stage Direction:** Atmosphere `emerald-harbor-mist` · Hero Prop `commercial-passenger-airplane` · Camera `elevated-isometric-crane`
- **2D Technical Clip Direction:** Theme `blueprint-cyan` · Architectural Motif `airport-terminal-gate` · Layout `horizontal-pipeline`
- **4-Act Phase Ribbon:** 01 STAGE STEALTHY → 02 STAGE MAILBOX → 03 STAGE OAUTH → 04 NETWORK
- **Registered Sections:** briefing, step-1, step-2, step-3
- **Everyday Real-World Story Premise:** Picture a bustling international airport terminal with glowing departure screens, an X-ray security arch, a boarding gate counter, and a commercial passenger airplane parked right outside on the tarmac. Inside the airport terminal, a disguised passenger approaches the boarding gate carrying an altered boarding pass tucked inside an official airline jacket. In this real-world scenario, the intruder quietly copies a trusted access pass from the gate agent's station, then quietly copies a trusted access pass from the gate agent's station. Airfield control tower logs and the boarding-gate manifest counter catch the mismatch when one extra passenger shows up on the jet without a matching ticket purchase.
- **Three-Act Storyboard Beats:**
  - **Act 1:** A traveler walks through the airport terminal security arch toward the boarding gate.
  - **Act 2:** The gate agent waves the forged boarding pass onto the parked passenger airplane.
  - **Act 3:** The airport control tower and boarding scanner flag the mismatched flight manifest.

