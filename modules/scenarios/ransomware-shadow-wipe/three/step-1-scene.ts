import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateLockbitStep1State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LockBit Step #1 (`lockbit-step1-psexec`)
 * Room: Municipal Utility Service Entry Bay (SMB ADMIN$ Conduit + SYSTEM Breaker + EID 7045 Ticker).
 */
export function buildLockbitStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x334155,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x1e293b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 1 · REMOTE SERVICE DISPATCH',
    signSubtitle: 'SMB ADMIN$ -> PSEXESVC AS SYSTEM (EID 5145 / 7045)',
    signBgHex: '#0F172A',
    signBorderHex: '#F59E0B',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const steelMat = materials.createToonMaterial(0x475569);
  const darkIronMat = materials.createToonMaterial(0x1e293b);
  const brassMat = materials.createToonMaterial(0xd97706);
  const goldMat = materials.createToonMaterial(0xfbbf24);
  const crimsonMat = materials.createToonMaterial(0xdc2626);
  const paperMat = materials.createToonMaterial(0xf8fafc);

  // Prop 1: Overhead Pneumatic SMB ADMIN$ Wall Conduit (x = -4.6 to -0.55)
  const conduitGroup = new THREE.Group();
  conduitGroup.position.set(0, 0, 0.2);

  // Support stanchions
  for (const sx of [-4.2, -2.5]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.35, 0.34), darkIronMat);
    leg.position.set(sx, 1.175, 0);
    leg.castShadow = true;
    addAnimeInkEdges(leg, materials.inkLineMaterial, 24);
    conduitGroup.add(leg);
    const disc = createContactDisc(materials, 0.48);
    disc.position.set(sx, 0.018, 0);
    conduitGroup.add(disc);
  }

  // Transparent cutaway outer tube sleeve
  const glassTubeMat = new THREE.MeshToonMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.45,
    gradientMap: materials.gradientMap,
  });
  const glassTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 4.1, 20, 1, true),
    glassTubeMat
  );
  glassTube.rotation.z = Math.PI / 2;
  glassTube.position.set(-2.65, 2.48, 0);
  conduitGroup.add(glassTube);

  // Brass flange rings
  for (const rx of [-4.55, -3.3, -2.0, -0.7]) {
    const flange = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.06, 8, 20),
      brassMat
    );
    flange.rotation.y = Math.PI / 2;
    flange.position.set(rx, 2.48, 0);
    addAnimeInkEdges(flange, materials.inkLineMaterial, 25);
    conduitGroup.add(flange);
  }

  // Armored Brass Dispatch Capsule (lb3_black.exe) gliding inside conduit
  const capsule = new THREE.Group();
  const capBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.92, 16),
    goldMat
  );
  capBody.rotation.z = Math.PI / 2;
  capBody.castShadow = true;
  addAnimeInkEdges(capBody, materials.inkLineMaterial, 22);
  capsule.add(capBody);

  const capNose = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), crimsonMat);
  capNose.position.x = 0.46;
  addAnimeInkEdges(capNose, materials.inkLineMaterial, 22);
  capsule.add(capNose);

  const capTail = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.16, 14), darkIronMat);
  capTail.rotation.z = Math.PI / 2;
  capTail.position.x = -0.5;
  capsule.add(capTail);

  capsule.position.set(-4.0, 2.48, 0);
  conduitGroup.add(capsule);
  root.add(conduitGroup);

  // Prop 2: Central Heavy Service Hatch & SYSTEM Master Breaker Console (x = 0.4, z = 0.2)
  const consoleGroup = new THREE.Group();
  consoleGroup.position.set(0.4, 0, 0.2);
  consoleGroup.add(createContactDisc(materials, 1.45));

  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.1, 1.3), steelMat);
  cabinet.position.y = 1.55;
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  addAnimeInkEdges(cabinet, materials.inkLineMaterial, 24);
  consoleGroup.add(cabinet);

  // Recessed breaker bay
  const bayBack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 0.14), darkIronMat);
  bayBack.position.set(0, 1.75, 0.62);
  consoleGroup.add(bayBack);

  // Receiving hatch port on left wall of console
  const portRing = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.24, 20), brassMat);
  portRing.rotation.z = Math.PI / 2;
  portRing.position.set(-1.05, 2.48, 0);
  addAnimeInkEdges(portRing, materials.inkLineMaterial, 24);
  consoleGroup.add(portRing);

  // Hinged glass safety door over breaker (responds to Cutaway)
  const breakerDoorPivot = new THREE.Group();
  breakerDoorPivot.position.set(-0.78, 1.75, 0.72);
  const doorGlassMat = new THREE.MeshToonMaterial({
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.42,
    gradientMap: materials.gradientMap,
  });
  const doorPane = new THREE.Mesh(new THREE.BoxGeometry(1.56, 1.72, 0.06), doorGlassMat);
  doorPane.position.set(0.78, 0, 0);
  addAnimeInkEdges(doorPane, materials.inkLineMaterial, 28);
  breakerDoorPivot.add(doorPane);
  consoleGroup.add(breakerDoorPivot);

  // Heavy SYSTEM Master Breaker Lever Pivot
  const breakerPivot = new THREE.Group();
  breakerPivot.position.set(0, 1.75, 0.68);
  const leverArmL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.92, 0.12), brassMat);
  leverArmL.position.set(-0.34, 0.42, 0.16);
  const leverArmR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.92, 0.12), brassMat);
  leverArmR.position.set(0.34, 0.42, 0.16);
  const handleBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.96, 14),
    crimsonMat
  );
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0, 0.86, 0.16);
  addAnimeInkEdges(handleBar, materials.inkLineMaterial, 22);
  breakerPivot.add(leverArmL, leverArmR, handleBar);
  consoleGroup.add(breakerPivot);

  // Top amber/emerald status beacon dome
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false });
  const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.18, 16), darkIronMat);
  beaconBase.position.set(0, 3.18, 0);
  const beaconDome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), beaconMat);
  beaconDome.position.set(0, 3.35, 0);
  consoleGroup.add(beaconBase, beaconDome);

  const consolePlaqueTex = createPlaqueTexture(
    'SERVICE CONTROL MANAGER',
    'PSEXESVC · SYSTEM',
    '#0F172A',
    '#F59E0B',
    '#FDE68A'
  );
  textures.push(consolePlaqueTex);
  const consolePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.75, 0.68),
    new THREE.MeshBasicMaterial({ map: consolePlaqueTex })
  );
  consolePlaque.position.set(0, 0.56, 0.67);
  consoleGroup.add(consolePlaque);
  root.add(consoleGroup);

  // Prop 3: Right Audit Telemetry Ticker & EID 7045 Printer Stand (x = 3.2, z = -0.85)
  const tickerGroup = new THREE.Group();
  tickerGroup.position.set(3.2, 0, -0.85);
  tickerGroup.add(createContactDisc(materials, 1.05));

  const tickerStand = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.35, 0.95), darkIronMat);
  tickerStand.position.y = 1.175;
  tickerStand.castShadow = true;
  addAnimeInkEdges(tickerStand, materials.inkLineMaterial, 24);
  tickerGroup.add(tickerStand);

  const tickerScreenTex = createPlaqueTexture(
    'WINSEC + SYSTEM AUDIT',
    'EID 5145 + EID 7045',
    '#1E1B4B',
    '#38BDF8',
    '#F8FAFC'
  );
  textures.push(tickerScreenTex);
  const tickerScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.42, 0.72),
    new THREE.MeshBasicMaterial({ map: tickerScreenTex })
  );
  tickerScreen.position.set(0, 1.78, 0.49);
  tickerGroup.add(tickerScreen);

  // Paper tape ribbon emerging from printer slot
  const paperTape = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.1, 0.03), paperMat);
  paperTape.position.set(0, 1.05, 0.52);
  addAnimeInkEdges(paperTape, materials.inkLineMaterial, 28);
  tickerGroup.add(paperTape);

  // Glowing power cable connecting console to ticker
  const busCableMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false });
  const busCable = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 10), busCableMat);
  busCable.rotation.z = Math.PI / 2;
  busCable.rotation.y = 0.34;
  busCable.position.set(-1.3, 0.32, 0.52);
  tickerGroup.add(busCable);
  root.add(tickerGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.8, 3.15, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(0.7, 3.65, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.4, 3.6, 8.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.1, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLockbitStep1State(timeSec, cutawayMode);

      // Capsule slides through pneumatic SMB ADMIN$ conduit into service hatch
      capsule.position.x = -4.1 + easeOutCubic(s.capsuleTravel) * 3.15;
      capsule.rotation.x = s.capsuleTravel * Math.PI * 3;

      // Cutaway transparency on glass tube + hinged breaker door
      glassTubeMat.opacity = 0.52 - s.cutawayOpen * 0.36;
      breakerDoorPivot.rotation.y = -s.cutawayOpen * 1.45;
      doorGlassMat.opacity = 0.44 - s.cutawayOpen * 0.26;

      // Master breaker lever pulls down (from upright -0.25 rad to full down +2.05 rad)
      breakerPivot.rotation.x = -0.25 + easeOutCubic(s.breakerDown) * 2.3;

      // Beacon & bus cable shift emerald -> amber/crimson when SYSTEM service starts
      beaconMat.color.setHex(s.alarmAmber ? 0xf59e0b : 0x10b981);
      busCableMat.color.setHex(s.alarmAmber ? 0xf59e0b : 0x38bdf8);
      shell.accentStripMat.color.setHex(s.alarmAmber ? 0xdc2626 : 0xf59e0b);

      // Audit paper tape extends out of EID 7045 printer
      const tapeScale = Math.max(0.08, s.auditTickerExtend);
      paperTape.scale.set(1, tapeScale, 1);
      paperTape.position.y = 1.28 - tapeScale * 0.45;

      return {
        glitchIntensity: s.alarmAmber ? 0.22 : 0.04,
        magicDustIntensity: s.capsuleTravel * 0.3,
        stasisIntensity: 0,
        brakeReleaseBoost: s.breakerDown * 0.38,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
