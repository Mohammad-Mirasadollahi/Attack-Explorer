import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { disposeStepScene, easeOutCubic } from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep2State,
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
 * Photorealistic PBR Standalone Scene — DCSync Step 2 (`dcsync-step2-drsr`)
 * Story: Close-up Elevated Armored Glass Express Bridge & Archway Boulevard.
 *   - Left: CORP-DC01 Mint Feeder Tower with bolted ground-floor bronze vault doors
 *     (`ZERO NTDS.DIT DISK I/O`) and upper glass RAM vault feeding golden Crown Capsules.
 *   - Overhead Center: Armored Glass MS-DRSR Express Bridge with hinged cutaway wall,
 *     gliding golden Crown-Ledger Capsules along steel rails, underside optical drop coupler,
 *     and clamped Overhead Wire Checkpoint Gantry (`Suricata SID 2043901 / Zeek DCE-RPC`).
 *   - Boulevard Below: Burgundy-red Side-Street Courier Van (`482-VAN / 10.20.14.88`) rolling
 *     under the bridge with rotating 5-spoke wheels, braking, opening its roof hatch, flashing
 *     the crimson bind beacon, and receiving the Crown-Ledger stream without entering the vault.
 */
export function buildDcsyncStep2Scene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl = false
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const palette = createMintPbrPalette(textures);

  // Boulevard ground, sidewalks & skyline
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 70),
    new THREE.MeshStandardMaterial({ color: 0x4b535e, roughness: 0.92 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, -8);
  root.add(ground);

  const road = new THREE.Mesh(new THREE.BoxGeometry(64, 0.04, 4.4), palette.asphalt);
  road.position.set(0, 0, 0.55);
  road.receiveShadow = true;
  root.add(road);

  const dashMat = new THREE.MeshStandardMaterial({ color: 0xc2871e, roughness: 0.78 });
  for (let x = -18; x <= 18; x += 3.2) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.012, 0.12), dashMat);
    dash.position.set(x, 0.03, 0.55);
    root.add(dash);
  }

  const northWalk = new THREE.Mesh(new THREE.BoxGeometry(64, 0.16, 8.5), palette.sidewalk);
  northWalk.position.set(0, 0.08, -5.85);
  root.add(northWalk);

  const southWalk = new THREE.Mesh(new THREE.BoxGeometry(64, 0.16, 5.2), palette.sidewalk);
  southWalk.position.set(0, 0.08, 5.35);
  root.add(southWalk);

  addCitySkylineBackdrop(root, palette, -2);

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.75,
    roughness: 0.25,
  });
  for (const [lx, lz, rot] of [
    [-7.6, 2.95, Math.PI],
    [6.6, 2.95, Math.PI],
  ] as const) {
    const lamp = buildStreetLamp(palette.iron, lampBulbMat);
    lamp.position.set(lx, 0.14, lz);
    lamp.rotation.y = rot;
    root.add(lamp);
  }

  // --- LEFT: CORP-DC01 Mint Feeder Tower (x = -5.1) ---
  const dcGroup = new THREE.Group();
  dcGroup.position.set(-5.1, 0, 0);
  root.add(dcGroup);

  const dcPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 3.4), palette.granitePlinth);
  dcPlinth.position.y = 0.275;
  dcGroup.add(dcPlinth);

  const dcLower = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 3.0), palette.limestone);
  dcLower.position.y = 2.15;
  dcLower.castShadow = !isSoftwareGl;
  dcGroup.add(dcLower);

  // Bolted Ground-Floor Bronze Vault Doors (visibly sealed — zero disk I/O!)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.85, 0.16), palette.darkBronze);
  doorFrame.position.set(0, 1.35, 1.52);
  dcGroup.add(doorFrame);

  for (const dx of [-0.25, 0.25]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.48, 0.06), palette.brass);
    panel.position.set(dx, 1.35, 1.62);
    dcGroup.add(panel);
  }

  const dcPlaqueTex = createBrassPlaqueTexture(
    'CORP-DC01 · RAM ONLY',
    'VAULT SEALED · ZERO NTDS.DIT I/O',
    textures
  );
  const dcPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 0.54),
    new THREE.MeshStandardMaterial({ map: dcPlaqueTex, roughness: 0.35, metalness: 0.48 })
  );
  dcPlaque.position.set(0, 2.85, 1.54);
  dcGroup.add(dcPlaque);

  // Upper RAM Vault Chamber feeding the skybridge (y = 3.8 .. 5.65)
  const dcMid = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.22, 3.3), palette.darkBronze);
  dcMid.position.y = 3.85;
  dcGroup.add(dcMid);

  for (const sx of [-1.32, 1.32]) {
    for (const sz of [-1.22, 1.22]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.82, 0.36), palette.limestone);
      pier.position.set(sx, 4.86, sz);
      dcGroup.add(pier);
    }
  }
  const dcGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.72), palette.galleryGlass);
  dcGlass.position.set(0, 4.86, 1.25);
  dcGroup.add(dcGlass);

  const crownMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    emissive: 0xb45309,
    emissiveIntensity: 0.35,
    metalness: 0.9,
    roughness: 0.2,
  });
  const crownAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xd97706,
    emissiveIntensity: 0.36,
    metalness: 0.88,
    roughness: 0.18,
  });
  const dcCrown = buildCrownSealAssembly(crownMat, palette.darkBronze, crownAccentMat);
  dcCrown.position.y = 4.18;
  dcGroup.add(dcCrown);

  const dcRoof = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.24, 3.35), palette.darkBronze);
  dcRoof.position.y = 5.88;
  dcGroup.add(dcRoof);

  // --- OVERHEAD CENTER: Armored Glass MS-DRSR Express Bridge (x = -3.5 .. +5.4) ---
  const bridgeGroup = new THREE.Group();
  root.add(bridgeGroup);

  const bridgeLen = 9.2;
  const bridgeCenterX = 0.85;

  const deck = new THREE.Mesh(new THREE.BoxGeometry(bridgeLen, 0.22, 1.96), palette.darkBronze);
  deck.position.set(bridgeCenterX, 3.88, 0.2);
  bridgeGroup.add(deck);

  const trackBed = new THREE.Mesh(new THREE.BoxGeometry(bridgeLen - 0.3, 0.06, 1.48), palette.steel);
  trackBed.position.set(bridgeCenterX, 4.02, 0.2);
  bridgeGroup.add(trackBed);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(bridgeLen, 0.22, 2.02), palette.darkBronze);
  roof.position.set(bridgeCenterX, 5.56, 0.2);
  bridgeGroup.add(roof);

  // East Bridge Support Pier (on north sidewalk edge, clear of road!)
  const eastPier = new THREE.Mesh(new THREE.BoxGeometry(1.15, 3.9, 1.55), palette.limestone);
  eastPier.position.set(5.3, 1.95, -0.35);
  bridgeGroup.add(eastPier);

  // Sweeping structural bronze arch rib beneath the span
  for (const az of [-0.7, 1.05]) {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-3.55, 3.05, az),
      new THREE.Vector3(0.85, 4.15, az),
      new THREE.Vector3(5.2, 3.05, az)
    );
    const rib = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.1, 10, false), palette.darkBronze);
    bridgeGroup.add(rib);
  }

  // Rear glass wall + Hinged Front Cutaway Glass Wall
  const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(bridgeLen - 0.6, 1.46), palette.bridgeGlass);
  rearGlass.position.set(bridgeCenterX, 4.72, -0.74);
  bridgeGroup.add(rearGlass);

  const cutawayPivot = new THREE.Group();
  cutawayPivot.position.set(bridgeCenterX, 5.46, 1.15);
  bridgeGroup.add(cutawayPivot);

  const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(bridgeLen - 0.6, 1.46), palette.bridgeGlass);
  frontGlass.position.set(0, -0.74, 0);
  cutawayPivot.add(frontGlass);

  for (const mx of [-3.6, -1.8, 0, 1.8, 3.6]) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.52, 0.08), palette.darkBronze);
    mullion.position.set(mx, -0.74, 0.02);
    cutawayPivot.add(mullion);
  }
  const bottomTrim = new THREE.Mesh(new THREE.BoxGeometry(bridgeLen - 0.5, 0.09, 0.09), palette.brass);
  bottomTrim.position.set(0, -1.48, 0.02);
  cutawayPivot.add(bottomTrim);

  // 2 Gliding Golden Crown-Ledger Capsules streaming out of CORP-DC01 across the bridge!
  const capsules: THREE.Group[] = [];
  for (let i = 0; i < 2; i++) {
    const cap = new THREE.Group();
    const sled = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 0.72), palette.steel);
    cap.add(sled);
    const miniCrown = buildCrownSealAssembly(crownMat, palette.darkBronze, crownAccentMat);
    miniCrown.scale.setScalar(0.68);
    miniCrown.position.y = 0.08;
    cap.add(miniCrown);
    cap.position.set(-3.2, 4.24, 0.2);
    bridgeGroup.add(cap);
    capsules.push(cap);
  }

  // Underside Optical Drop Coupler & Golden Beam into Van Roof (x = 1.65)
  const coupler = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.2, 18), palette.darkBronze);
  coupler.position.set(1.65, 3.7, 0.45);
  bridgeGroup.add(coupler);

  const dropBeamMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const dropBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 2.0, 18, 1, true), dropBeamMat);
  dropBeam.position.set(1.65, 2.7, 0.5);
  bridgeGroup.add(dropBeam);

  // Clamped Overhead Wire Checkpoint Gantry (Suricata SID 2043901 / Zeek DCE-RPC)
  const sensorRingMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.45,
    roughness: 0.28,
    metalness: 0.72,
  });
  const sensorArch = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.09, 12, 24, Math.PI),
    sensorRingMat
  );
  sensorArch.position.set(0.35, 3.92, 0.2);
  sensorArch.rotation.y = Math.PI / 2;
  bridgeGroup.add(sensorArch);

  const wireMonitorTex = createLedBoardTexture(
    'ZEEK / SURICATA WIRE SENSOR',
    [
      { text: 'PROTOCOL: DRSUAPI OPNUM 3', color: '#7dd3fc' },
      { text: 'CHANNEL: DYNAMIC TCP/49668', color: '#cbd5e1' },
      { text: 'MONITORING NON-DC SUBNETS', color: '#34d399' },
    ],
    'SKY',
    textures
  );
  const wireAlertTex = createLedBoardTexture(
    '!! SURICATA SID 2043901 !!',
    [
      { text: 'SRC: 10.20.14.88 (NON-DC!)', color: '#fda4af' },
      { text: 'CALL: IDL_DRSGetNCChanges', color: '#fde047' },
      { text: 'ALERT: ROGUE DCSYNC TRAFFIC', color: '#6ee7b7' },
    ],
    'EMERALD',
    textures
  );
  const sensorScreenMat = new THREE.MeshStandardMaterial({
    map: wireMonitorTex,
    emissiveMap: wireMonitorTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
    roughness: 0.28,
  });
  const sensorSignBox = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.15, 0.14), palette.darkBronze);
  sensorSignBox.position.set(0.35, 6.28, 0.2);
  bridgeGroup.add(sensorSignBox);

  const sensorSign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.04), sensorScreenMat);
  sensorSign.position.set(0.35, 6.28, 0.28);
  bridgeGroup.add(sensorSign);

  // --- STREET BELOW: Burgundy-Red Side-Street Courier Van (`482-VAN`) ---
  const van = buildRealisticCourierVan(palette.contactShadowTex, textures, isSoftwareGl, '482-VAN');
  const VAN_START = 7.4;
  const VAN_STOP = 1.6;
  van.group.position.set(VAN_START, 0, 0.55);
  root.add(van.group);

  // Bind flash cone firing up from van roof hatch to bridge coupler
  const bindBeamMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const bindBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.26, 2.0, 14, 1, true), bindBeamMat);
  bindBeam.position.set(0.05, 2.65, 0);
  van.group.add(bindBeam);

  // Received Crown Seal inside van roof cradle
  const vanCrown = buildCrownSealAssembly(crownMat, palette.darkBronze, crownAccentMat);
  vanCrown.scale.setScalar(0.8);
  vanCrown.position.set(0.05, 1.72, 0);
  vanCrown.visible = false;
  van.group.add(vanCrown);

  let wireAlertShown = false;

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.6, 5.95, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.3, 2.6, 0.6);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 4.6, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.2, 3.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 3.0, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncStep2State(tNorm, cutawayMode);

      dcCrown.rotation.y = timeSec * 1.1;
      cutawayPivot.rotation.x = -frame.cutawayOpen * 1.18;

      // Van rolls cleanly into dock with physically accurate wheel rotation & brake lights
      const dock = easeOutCubic(frame.vanDockProgress);
      const vx = THREE.MathUtils.lerp(VAN_START, VAN_STOP, dock);
      van.group.position.x = vx;
      const rot = (VAN_START - vx) / 0.34;
      for (const w of van.wheels) {
        w.rotation.z = rot;
      }
      van.brakeLightMat.emissiveIntensity = dock > 0.72 && dock < 0.99 ? 2.1 : 0.85;
      van.roofHatchDoor.position.x = 0.05 + THREE.MathUtils.clamp((dock - 0.78) / 0.22, 0, 1) * 0.74;
      bindBeamMat.opacity = frame.ribbonBindFlash * 0.45;

      // Golden Crown Capsules stream from CORP-DC01 RAM vault along bridge track
      capsules.forEach((cap, idx) => {
        const active = frame.capsuleStreamProgress > 0.02;
        cap.visible = active;
        const p = (frame.capsuleStreamProgress * 1.25 + idx * 0.5) % 1;
        cap.position.x = THREE.MathUtils.lerp(-3.2, 1.65, p);
        cap.children[1].rotation.y = timeSec * 1.8;
      });
      dropBeamMat.opacity =
        frame.capsuleStreamProgress > 0.08 ? 0.22 + 0.08 * Math.sin(timeSec * 6) : 0;
      vanCrown.visible = frame.capsuleStreamProgress > 0.45;
      vanCrown.rotation.y = timeSec * 1.5;

      // Wire checkpoint sensor flags non-DC DRSUAPI traffic in Phase 3
      const alertNow = frame.zeekWireAlert > 0.35;
      if (alertNow) {
        sensorRingMat.color.setHex(0x10b981);
        sensorRingMat.emissive.setHex(0x10b981);
        sensorRingMat.emissiveIntensity = 0.85 + 0.45 * Math.sin(timeSec * 8);
      } else {
        sensorRingMat.color.setHex(0x38bdf8);
        sensorRingMat.emissive.setHex(0x0ea5e9);
        sensorRingMat.emissiveIntensity = 0.4;
      }
      if (wireAlertShown !== alertNow) {
        wireAlertShown = alertNow;
        const nextTex = alertNow ? wireAlertTex : wireMonitorTex;
        sensorScreenMat.map = nextTex;
        sensorScreenMat.emissiveMap = nextTex;
        sensorScreenMat.needsUpdate = true;
      }

      return {
        glitchIntensity: frame.capsuleStreamProgress * 0.35,
        magicDustIntensity: 0,
        stasisIntensity: frame.zeekWireAlert * 0.25,
        brakeReleaseBoost: frame.capsuleStreamProgress * 0.25,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
