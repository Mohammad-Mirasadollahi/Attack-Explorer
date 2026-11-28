import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { disposeStepScene, easeOutCubic } from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep3State,
} from '../choreography';
import {
  addCitySkylineBackdrop,
  buildCrownSealAssembly,
  buildRealisticCourierVan,
  buildStreetLamp,
  createBrassPlaqueTexture,
  createLedBoardTexture,
  createMintPbrPalette,
} from './pbr-mint-assets';

/**
 * Photorealistic PBR Standalone Scene — DCSync Step 3 (`dcsync-step3-eid4662`)
 * Story: Mint Plaza Boulevard & Bridge Roster Audit Tower Correlation (`EID 4662 + EID 4624`).
 *   - Left (`x = -2.8`): Parked burgundy-red side-street van (`482-VAN / 10.20.14.88`) with
 *     open roof hatch holding the illicitly copied golden crown seal beneath an arched
 *     EID 4624 Street Traffic License-Plate Gantry & crimson spotlight scanner.
 *   - Right (`x = +2.8`): Steel-and-glass Bridge Audit Tower (`EID 4662`) with hinged cutaway
 *     observation glass revealing a spinning brass-and-azure forensic tape ledger drum,
 *     interior dual SIEM consoles, live LED status board switching to P1 crimson match,
 *     and a rotating rooftop crimson P1 siren beacon.
 *   - Center (`x = -1.6 .. +1.6`): Curved optical `SubjectLogonId: 0x39e4c2a` join conduit
 *     carrying glowing amber correlation packets linking the Audit Tower directly to the van.
 */
export function buildDcsyncStep3Scene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl = false
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const palette = createMintPbrPalette(textures);

  // Ground, asphalt boulevard, sidewalks & city skyline
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 70),
    new THREE.MeshStandardMaterial({ color: 0x4b535e, roughness: 0.92 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, -8);
  root.add(ground);

  const road = new THREE.Mesh(new THREE.BoxGeometry(64, 0.04, 4.6), palette.asphalt);
  road.position.set(0, 0, 0.65);
  road.receiveShadow = true;
  root.add(road);

  const dashMat = new THREE.MeshStandardMaterial({ color: 0xc2871e, roughness: 0.78 });
  for (let x = -18; x <= 18; x += 3.2) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.012, 0.12), dashMat);
    dash.position.set(x, 0.03, 0.65);
    root.add(dash);
  }

  const northWalk = new THREE.Mesh(new THREE.BoxGeometry(64, 0.16, 4.4), palette.sidewalk);
  northWalk.position.set(0, 0.08, -3.5);
  northWalk.receiveShadow = true;
  root.add(northWalk);

  const southWalk = new THREE.Mesh(new THREE.BoxGeometry(64, 0.16, 2.8), palette.sidewalk);
  southWalk.position.set(0, 0.08, 4.1);
  southWalk.receiveShadow = true;
  root.add(southWalk);

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xffe4b5,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.65,
    roughness: 0.25,
  });
  for (const [lx, lz, rot] of [
    [-7.2, -1.8, Math.PI / 2],
    [7.2, -1.8, Math.PI / 2],
    [-6.6, 3.0, -Math.PI / 2],
    [6.6, 3.0, -Math.PI / 2],
  ] as Array<[number, number, number]>) {
    const lamp = buildStreetLamp(palette.iron, lampBulbMat);
    lamp.position.set(lx, 0.16, lz);
    lamp.rotation.y = rot;
    root.add(lamp);
  }

  addCitySkylineBackdrop(root, palette, -4);

  // =========================================================================
  // LEFT: PARKED SIDE-STREET COURIER VAN + EID 4624 PLATE CAMERA GANTRY
  // =========================================================================
  const vanHandle = buildRealisticCourierVan(palette.contactShadowTex, textures, isSoftwareGl, '482-VAN');
  vanHandle.group.position.set(-2.8, 0.02, 0.65);
  vanHandle.group.rotation.y = 0.06;
  // Open roof hatch slightly to reveal the illicitly duplicated golden crown seal inside
  vanHandle.roofHatchDoor.position.set(0.55, 1.76, 0);
  root.add(vanHandle.group);

  const stolenGoldMat = new THREE.MeshStandardMaterial({
    color: 0xe6b432,
    emissive: 0xc27803,
    emissiveIntensity: 0.35,
    roughness: 0.24,
    metalness: 0.88,
  });
  const stolenPearlMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.28,
    roughness: 0.3,
    metalness: 0.65,
  });
  const stolenCrown = buildCrownSealAssembly(stolenGoldMat, palette.darkBronze, stolenPearlMat);
  stolenCrown.scale.setScalar(0.62);
  stolenCrown.position.set(0.05, 1.56, 0);
  vanHandle.group.add(stolenCrown);

  // EID 4624 Street Traffic License-Plate Gantry spanning over the parked van
  const gantry = new THREE.Group();
  gantry.position.set(-2.8, 0.02, 0.65);
  root.add(gantry);

  for (const gz of [-1.95, 1.95]) {
    const footing = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.36, 0.54), palette.granitePlinth);
    footing.position.set(0, 0.18, gz);
    gantry.add(footing);

    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.85, 0.24), palette.steel);
    mast.position.set(0, 2.24, gz);
    mast.castShadow = !isSoftwareGl;
    gantry.add(mast);
  }

  const gantryBeam = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.34, 4.35), palette.darkBronze);
  gantryBeam.position.set(0, 4.18, 0);
  gantryBeam.castShadow = !isSoftwareGl;
  gantry.add(gantryBeam);

  // Brass gantry header plaque
  const gantryPlaqueTex = createBrassPlaqueTexture(
    'EID 4624 · STREET PLATE GATE',
    'IP 10.20.14.88 · WKS-ADMIN-07',
    textures
  );
  const gantryPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 0.58),
    new THREE.MeshStandardMaterial({ map: gantryPlaqueTex, roughness: 0.42, metalness: 0.24 })
  );
  gantryPlaque.position.set(0, 4.18, 2.2);
  gantry.add(gantryPlaque);

  // Optical plate-reader camera pod hanging under beam
  const camPod = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, 0.56), palette.iron);
  camPod.position.set(0.55, 3.86, 0.35);
  camPod.rotation.z = -0.22;
  gantry.add(camPod);

  const camLensMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.4,
  });
  const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.14, 16), camLensMat);
  camLens.position.set(0.48, 3.74, 0.35);
  camLens.rotation.z = -0.22;
  gantry.add(camLens);

  // Crimson tracking spotlight cone descending from gantry camera onto 482-VAN
  const trackConeMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const trackCone = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.85, 22, 1, true), trackConeMat);
  trackCone.position.set(0.45, 2.28, 0.42);
  gantry.add(trackCone);

  const groundAlertRingMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
  });
  const groundAlertRing = new THREE.Mesh(new THREE.RingGeometry(1.42, 1.58, 32), groundAlertRingMat);
  groundAlertRing.rotation.x = -Math.PI / 2;
  groundAlertRing.position.set(0.1, 0.05, 0);
  gantry.add(groundAlertRing);

  // =========================================================================
  // RIGHT: STEEL-AND-GLASS MINT ROSTER AUDIT TOWER (EID 4662)
  // =========================================================================
  const tower = new THREE.Group();
  tower.position.set(2.85, 0.0, -0.1);
  root.add(tower);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.72, 2.8), palette.granitePlinth);
  plinth.position.y = 0.36;
  plinth.castShadow = !isSoftwareGl;
  plinth.receiveShadow = true;
  tower.add(plinth);

  const plinthTrim = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.12, 2.92), palette.darkBronze);
  plinthTrim.position.y = 0.76;
  tower.add(plinthTrim);

  // Architectural steel corner columns & back masonry wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.75, 4.35, 0.34), palette.limestone);
  backWall.position.set(0, 2.98, -1.06);
  backWall.castShadow = !isSoftwareGl;
  backWall.receiveShadow = true;
  tower.add(backWall);

  for (const [cx, cz] of [
    [-1.32, -1.05],
    [1.32, -1.05],
    [-1.32, 1.05],
    [1.32, 1.05],
  ]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.5, 0.22), palette.steel);
    col.position.set(cx, 3.05, cz);
    col.castShadow = !isSoftwareGl;
    tower.add(col);
  }

  for (const sideX of [-1.32, 1.32]) {
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.2, 2.0), palette.galleryGlass);
    sideGlass.position.set(sideX, 2.95, 0);
    tower.add(sideGlass);
  }

  // Interior floor deck & rotating brass-and-azure Forensic Ledger Tape Drum
  const midDeck = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.12, 1.98), palette.darkBronze);
  midDeck.position.set(0, 2.72, 0);
  tower.add(midDeck);

  const ledgerDrumGroup = new THREE.Group();
  ledgerDrumGroup.position.set(-0.32, 1.75, 0.02);
  tower.add(ledgerDrumGroup);

  const drumCoreMat = new THREE.MeshStandardMaterial({
    color: 0x0c243d,
    emissive: 0x0284c7,
    emissiveIntensity: 0.32,
    roughness: 0.32,
    metalness: 0.64,
  });
  const drumCore = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 1.24, 24), drumCoreMat);
  ledgerDrumGroup.add(drumCore);

  for (const dy of [-0.46, 0, 0.46]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.045, 10, 24), palette.brass);
    band.rotation.x = Math.PI / 2;
    band.position.y = dy;
    ledgerDrumGroup.add(band);
  }

  // Interior twin SIEM analyst console desk on right side of lower chamber
  const consoleDesk = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.72, 1.1), palette.iron);
  consoleDesk.position.set(0.72, 1.18, -0.1);
  tower.add(consoleDesk);

  const monitorMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 0.86), monitorMat);
  monitor.position.set(0.78, 1.82, -0.1);
  monitor.rotation.y = -0.35;
  tower.add(monitor);

  // Upper chamber dynamic LED Audit Roster Board (switches SKY -> ROSE match)
  const standbyTex = createLedBoardTexture(
    'BRIDGE AUDIT · EID 4662',
    [
      { text: 'MASK: 0x100 · GUID 1131f6ad', color: '#7dd3fc' },
      { text: 'USER: CORP\\svc_dir_sync', color: '#fde68a' },
      { text: 'ROSTER: CHECKING NON-$ SID', color: '#cbd5e1' },
    ],
    'SKY',
    textures
  );
  const matchTex = createLedBoardTexture(
    'P1 ALERT · EID 4662 + 4624',
    [
      { text: 'LOGON: 0x39e4c2a -> MATCH', color: '#fda4af' },
      { text: 'SRC: 10.20.14.88 (482-VAN)', color: '#fde047' },
      { text: 'STATUS: NON-DC DCSYNC TRAP', color: '#fecdd3' },
    ],
    'ROSE',
    textures
  );
  const ledScreenMat = new THREE.MeshStandardMaterial({
    map: standbyTex,
    emissiveMap: standbyTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.24,
    roughness: 0.3,
    metalness: 0.14,
  });
  const ledHousing = new THREE.Mesh(new THREE.BoxGeometry(2.38, 1.32, 0.2), palette.iron);
  ledHousing.position.set(0, 3.68, -0.25);
  tower.add(ledHousing);

  const ledScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.22, 1.14), ledScreenMat);
  ledScreen.position.set(0, 3.68, -0.13);
  tower.add(ledScreen);

  // Hinged cutaway front glass wall on Audit Tower
  const frontGlassPivot = new THREE.Group();
  frontGlassPivot.position.set(1.26, 2.95, 1.05);
  tower.add(frontGlassPivot);

  const frontGlassFrame = new THREE.Mesh(new THREE.BoxGeometry(2.48, 4.18, 0.08), palette.galleryGlass);
  frontGlassFrame.position.set(-1.24, 0, 0);
  frontGlassPivot.add(frontGlassFrame);

  for (const fy of [-2.06, 0, 2.06]) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.07, 0.1), palette.darkBronze);
    mullion.position.set(-1.24, fy, 0);
    frontGlassPivot.add(mullion);
  }

  // Stepped copper roof crown + Brass plaque + Rotating P1 Crimson Alarm Beacon
  const roofDeck = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.24, 2.58), palette.darkBronze);
  roofDeck.position.set(0, 5.26, 0);
  tower.add(roofDeck);

  const roofCap = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.28, 1.9), palette.copperRoof);
  roofCap.position.set(0, 5.52, 0);
  tower.add(roofCap);

  const towerPlaqueTex = createBrassPlaqueTexture(
    'MINT ROSTER AUDIT TOWER',
    'SECURITY EID 4662 · SIEM CORRELATOR',
    textures
  );
  const towerPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.56),
    new THREE.MeshStandardMaterial({ map: towerPlaqueTex, roughness: 0.42, metalness: 0.26 })
  );
  towerPlaque.position.set(0, 0.42, 1.42);
  tower.add(towerPlaque);

  const sirenPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.32, 16), palette.iron);
  sirenPedestal.position.set(0, 5.82, 0);
  tower.add(sirenPedestal);

  const sirenLensMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    emissive: 0xe11d48,
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.25,
  });
  const sirenDome = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.36, 18), sirenLensMat);
  sirenDome.position.set(0, 6.14, 0);
  tower.add(sirenDome);

  const sirenRotator = new THREE.Group();
  sirenRotator.position.set(0, 6.14, 0);
  tower.add(sirenRotator);

  const sirenBeamMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (const dir of [-1, 1]) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.52, 2.2, 16, 1, true), sirenBeamMat);
    beam.rotation.z = dir * (Math.PI / 2);
    beam.position.x = dir * 1.2;
    sirenRotator.add(beam);
  }

  const sirenPulseRingMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
  });
  const sirenPulseRing = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.72, 28), sirenPulseRingMat);
  sirenPulseRing.rotation.x = -Math.PI / 2;
  sirenPulseRing.position.set(0, 6.14, 0);
  tower.add(sirenPulseRing);

  // =========================================================================
  // CENTER: SUBJECTLOGONID 0x39e4c2a OPTICAL JOIN CONDUIT + RACING PACKETS
  // =========================================================================
  const joinCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.5, 2.85, 0.2),
    new THREE.Vector3(0.1, 3.55, 0.55),
    new THREE.Vector3(-1.35, 3.65, 0.55),
    new THREE.Vector3(-2.28, 3.82, 0.65),
  ]);
  const joinCableMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    emissive: 0xd97706,
    emissiveIntensity: 0.12,
    roughness: 0.35,
    metalness: 0.72,
  });
  const joinCable = new THREE.Mesh(new THREE.TubeGeometry(joinCurve, 32, 0.055, 10, false), joinCableMat);
  root.add(joinCable);

  const joinPlaqueTex = createBrassPlaqueTexture(
    'SUBJECT LOGON ID JOIN',
    '0x39e4c2a · EID 4662 -> EID 4624',
    textures
  );
  const joinPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.54),
    new THREE.MeshStandardMaterial({ map: joinPlaqueTex, roughness: 0.42, metalness: 0.26 })
  );
  joinPlaque.position.set(0.0, 2.38, 0.55);
  root.add(joinPlaque);

  // Pedestal holding the SubjectLogonId brass junction sign
  const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 2.15, 12), palette.iron);
  signPost.position.set(0.0, 1.07, 0.48);
  root.add(signPost);

  const packetMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.65,
    roughness: 0.2,
    metalness: 0.6,
  });
  const joinPackets: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const pkt = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), packetMat);
    pkt.visible = false;
    root.add(pkt);
    joinPackets.push(pkt);
  }

  let showingMatch = false;

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.8, 3.1, 0.65);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.85, 4.9, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.6, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.8, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const f = evaluateDcsyncStep3State(tNorm, cutawayMode);

      // Hinged cutaway front glass swings smoothly open on right hinge
      frontGlassPivot.rotation.y = easeOutCubic(f.cutawayOpen) * 1.18;

      // Forensic tape ledger drum spins continuously, speeding up when EID 4662 hits
      ledgerDrumGroup.rotation.y = timeSec * (0.9 + f.eid4662Flash * 1.8);
      drumCoreMat.emissiveIntensity = 0.28 + f.eid4662Flash * 0.55;
      stolenCrown.rotation.y = timeSec * 0.85;

      // Switch Audit Tower LED board from SKY standby -> ROSE match
      const shouldShowMatch = f.logonIdJoinBeam > 0.35 || f.p1SirenFlare > 0.1;
      if (shouldShowMatch !== showingMatch) {
        showingMatch = shouldShowMatch;
        ledScreenMat.map = shouldShowMatch ? matchTex : standbyTex;
        ledScreenMat.emissiveMap = shouldShowMatch ? matchTex : standbyTex;
        ledScreenMat.needsUpdate = true;
      }
      ledScreenMat.emissiveIntensity = 0.24 + f.eid4662Flash * 0.12 + f.p1SirenFlare * 0.12;

      // SubjectLogonId 0x39e4c2a amber join packets race from Audit Tower -> Van Gantry
      joinCableMat.emissiveIntensity = 0.1 + f.logonIdJoinBeam * 0.72;
      joinPackets.forEach((pkt, idx) => {
        if (f.logonIdJoinBeam > 0.04) {
          pkt.visible = true;
          const u = (timeSec * 0.55 + idx / joinPackets.length) % 1;
          const pt = joinCurve.getPointAt(u);
          pkt.position.copy(pt);
          const sc = 0.75 + 0.35 * f.logonIdJoinBeam;
          pkt.scale.setScalar(sc);
        } else {
          pkt.visible = false;
        }
      });

      // Street gantry spotlight + plate highlight lock onto 482-VAN
      const trackPower = Math.max(f.logonIdJoinBeam * 0.85, f.p1SirenFlare);
      trackConeMat.opacity = trackPower * (0.18 + 0.06 * Math.sin(timeSec * 7));
      camLensMat.emissiveIntensity = 0.3 + trackPower * 1.1;
      groundAlertRingMat.opacity = trackPower * 0.55;
      groundAlertRing.scale.setScalar(1 + 0.08 * Math.sin(timeSec * 5));
      vanHandle.plateHighlightMat.opacity = trackPower * (0.48 + 0.25 * Math.sin(timeSec * 8));
      vanHandle.brakeLightMat.emissiveIntensity = 0.45 + trackPower * 0.65;

      // Rooftop P1 Crimson Siren rotation & radial wave
      sirenRotator.rotation.y = timeSec * (1.8 + f.p1SirenFlare * 4.5);
      sirenLensMat.emissiveIntensity = 0.25 + f.p1SirenFlare * (0.95 + 0.45 * Math.sin(timeSec * 10));
      sirenBeamMat.opacity = f.p1SirenFlare * 0.24;
      sirenPulseRingMat.opacity = f.p1SirenFlare * (1 - ((timeSec * 1.1) % 1)) * 0.55;
      const ringScale = 1 + ((timeSec * 1.1) % 1) * 2.6;
      sirenPulseRing.scale.setScalar(ringScale);

      return {
        glitchIntensity: f.p1SirenFlare * 0.35,
        magicDustIntensity: 0,
        stasisIntensity: f.eid4662Flash * 0.25,
        brakeReleaseBoost: f.logonIdJoinBeam * 0.25,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
