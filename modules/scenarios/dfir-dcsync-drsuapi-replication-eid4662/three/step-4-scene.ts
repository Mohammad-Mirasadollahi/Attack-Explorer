import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { disposeStepScene, easeOutCubic } from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep4State,
} from '../choreography';
import {
  addCitySkylineBackdrop,
  buildCrownSealAssembly,
  buildStreetLamp,
  createBrassPlaqueTexture,
  createLedBoardTexture,
  createMintPbrPalette,
} from './pbr-mint-assets';

/**
 * Photorealistic PBR Standalone Scene — DCSync Step 4 (`dcsync-step4-krbtgt`)
 * Story: Hardened Mint Gatehouse, Double `>= 10h` Crown Recast Forge & Verified Audit Plaza.
 *   - Left (`x = -3.6`): Limestone Sovereign Mint Gatehouse where the forgotten crimson
 *     service ribbon physically unhooks and drops into a steel quarantine bin while twin
 *     armored Emerald Peer-Mint-Only Blast Doors slide firmly shut.
 *   - Center (`x = +0.1`): Bronze-and-glass `>= 10h` Master Crown Recast Forge Pedestal with
 *     flipping brass hourglass frame, sculpted golden Master Crown Seal, 2 distinct sequential
 *     recast forge waves (`Pass #1` amber -> `Pass #2` emerald-gold), and a quarantined stolen
 *     crown copy tarnishing to dead flat gray.
 *   - Right (`x = +3.8`): Verified Audit Tower (`PROTECTED USERS · 0 ROGUE ACE`) with steady
 *     emerald rotating beacon + 4 hydraulic steel street bollards rising smoothly out of the
 *     plaza to physically block non-DC side-street traffic.
 */
export function buildDcsyncStep4Scene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl = false
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const palette = createMintPbrPalette(textures);

  // Courtyard plaza ground, asphalt perimeter lane, sidewalks & skyline
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 70),
    new THREE.MeshStandardMaterial({ color: 0x4b535e, roughness: 0.92 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, -8);
  root.add(ground);

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(24, 0.16, 8.2), palette.sidewalk);
  plaza.position.set(0, 0.08, -0.4);
  plaza.receiveShadow = true;
  root.add(plaza);

  const road = new THREE.Mesh(new THREE.BoxGeometry(64, 0.04, 3.6), palette.asphalt);
  road.position.set(0, 0, 5.2);
  road.receiveShadow = true;
  root.add(road);

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xffe4b5,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.6,
    roughness: 0.25,
  });
  for (const [lx, lz, rot] of [
    [-7.5, -2.6, Math.PI / 2],
    [7.5, -2.6, Math.PI / 2],
    [-6.2, 3.2, -Math.PI / 2],
    [6.2, 3.2, -Math.PI / 2],
  ] as Array<[number, number, number]>) {
    const lamp = buildStreetLamp(palette.iron, lampBulbMat);
    lamp.position.set(lx, 0.16, lz);
    lamp.rotation.y = rot;
    root.add(lamp);
  }

  addCitySkylineBackdrop(root, palette, -4);

  // =========================================================================
  // LEFT: HARDENED SOVEREIGN MINT GATEHOUSE (RIBBON STRIP + EMERALD BLAST DOORS)
  // =========================================================================
  const gatehouse = new THREE.Group();
  gatehouse.position.set(-3.65, 0.16, -0.1);
  root.add(gatehouse);

  const gPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.56, 3.1), palette.granitePlinth);
  gPlinth.position.y = 0.28;
  gPlinth.castShadow = !isSoftwareGl;
  gPlinth.receiveShadow = true;
  gatehouse.add(gPlinth);

  const gBody = new THREE.Mesh(new THREE.BoxGeometry(3.32, 4.25, 2.72), palette.limestone);
  gBody.position.y = 2.68;
  gBody.castShadow = !isSoftwareGl;
  gBody.receiveShadow = true;
  gatehouse.add(gBody);

  // Architectural bronze pilasters & pediment roof
  for (const px of [-1.42, 1.42]) {
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.26, 4.15, 0.34), palette.darkBronze);
    pilaster.position.set(px, 2.65, 1.32);
    gatehouse.add(pilaster);
  }
  const gCornice = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.28, 3.05), palette.darkBronze);
  gCornice.position.y = 4.92;
  gatehouse.add(gCornice);

  const gRoof = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.82, 0.85, 4), palette.copperRoof);
  gRoof.rotation.y = Math.PI / 4;
  gRoof.position.y = 5.48;
  gatehouse.add(gRoof);

  const gatePlaqueTex = createBrassPlaqueTexture(
    'PEER MINT GATEHOUSE',
    'ENTERPRISE DCs ONLY · TIER-0 LOCK',
    textures
  );
  const gatePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.65, 0.58),
    new THREE.MeshStandardMaterial({ map: gatePlaqueTex, roughness: 0.42, metalness: 0.26 })
  );
  gatePlaque.position.set(0, 4.35, 1.38);
  gatehouse.add(gatePlaque);

  // Recessed armored doorway with sliding Emerald Peer-Mint-Only Blast Doors
  const doorRecess = new THREE.Mesh(new THREE.BoxGeometry(2.05, 2.55, 0.35), palette.iron);
  doorRecess.position.set(0, 1.85, 1.24);
  gatehouse.add(doorRecess);

  const blastDoorMat = new THREE.MeshStandardMaterial({
    color: 0x0f4c3a,
    emissive: 0x059669,
    emissiveIntensity: 0.16,
    roughness: 0.34,
    metalness: 0.72,
  });
  const leftBlastDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.42, 0.16), blastDoorMat);
  leftBlastDoor.position.set(-1.12, 1.85, 1.4);
  gatehouse.add(leftBlastDoor);

  const rightBlastDoor = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.42, 0.16), blastDoorMat);
  rightBlastDoor.position.set(1.12, 1.85, 1.4);
  gatehouse.add(rightBlastDoor);

  const lockSealMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.25,
    roughness: 0.22,
    metalness: 0.6,
  });
  const centerLockSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 20), lockSealMat);
  centerLockSeal.rotation.x = Math.PI / 2;
  centerLockSeal.position.set(0, 1.85, 1.52);
  gatehouse.add(centerLockSeal);

  // Hinged glass ribbon housing on upper-right gatehouse facade
  const ribbonHousingPivot = new THREE.Group();
  ribbonHousingPivot.position.set(1.18, 3.12, 1.52);
  gatehouse.add(ribbonHousingPivot);
  const housingGlass = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.25, 0.06), palette.galleryGlass);
  housingGlass.position.set(-0.56, 0, 0);
  ribbonHousingPivot.add(housingGlass);

  // Detached Crimson Service Ribbon (unhooks and falls into steel quarantine bin)
  const ribbonMat = new THREE.MeshStandardMaterial({
    map: palette.ribbonTex,
    emissive: 0xbe123c,
    emissiveIntensity: 0.32,
    roughness: 0.5,
    metalness: 0.1,
  });
  const rogueRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.05, 0.045), ribbonMat);
  rogueRibbon.position.set(0.62, 3.12, 1.44);
  gatehouse.add(rogueRibbon);

  // Steel quarantine bin at foot of gatehouse to catch dropped crimson ribbon
  const bin = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.56, 0.64), palette.iron);
  bin.position.set(0.72, 0.84, 1.72);
  gatehouse.add(bin);
  const binRim = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.08, 0.7), palette.brass);
  binRim.position.set(0.72, 1.14, 1.72);
  gatehouse.add(binRim);

  // =========================================================================
  // CENTER: >= 10H MASTER CROWN RECAST FORGE PEDESTAL + 2 SEQUENTIAL WAVES
  // =========================================================================
  const forge = new THREE.Group();
  forge.position.set(0.1, 0.16, 0.35);
  root.add(forge);

  const anvilBase = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.72, 0.62, 8), palette.granitePlinth);
  anvilBase.position.y = 0.31;
  anvilBase.castShadow = !isSoftwareGl;
  anvilBase.receiveShadow = true;
  forge.add(anvilBase);

  const anvilTier = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.32, 0.72, 8), palette.darkBronze);
  anvilTier.position.y = 0.98;
  anvilTier.castShadow = !isSoftwareGl;
  forge.add(anvilTier);

  const forgePlaqueTex = createBrassPlaqueTexture(
    '2x KRBTGT RECAST FORGE',
    'DOUBLE ROTATION >= 10 HOURS',
    textures
  );
  const forgePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.88, 0.48),
    new THREE.MeshStandardMaterial({ map: forgePlaqueTex, roughness: 0.4, metalness: 0.28 })
  );
  forgePlaque.position.set(0, 0.94, 1.24);
  forge.add(forgePlaque);

  // Sculpted Golden Master Crown Seal rotating atop forge
  const masterGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf4c430,
    emissive: 0xd97706,
    emissiveIntensity: 0.34,
    roughness: 0.2,
    metalness: 0.9,
  });
  const masterAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.3,
    roughness: 0.24,
    metalness: 0.72,
  });
  const masterCrown = buildCrownSealAssembly(masterGoldMat, palette.darkBronze, masterAccentMat);
  masterCrown.scale.setScalar(1.22);
  masterCrown.position.y = 1.65;
  forge.add(masterCrown);

  // Rotating brass 10-Hour Hourglass Gyro Ring surrounding the Master Crown
  const gyroGroup = new THREE.Group();
  gyroGroup.position.y = 2.25;
  forge.add(gyroGroup);

  const outerGyroRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.055, 14, 40), palette.brass);
  gyroGroup.add(outerGyroRing);

  const innerGyroRing = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.04, 12, 32), palette.steel);
  innerGyroRing.rotation.y = Math.PI / 2;
  gyroGroup.add(innerGyroRing);

  // Two distinct sequential forge wave rings (Pass #1 warm amber -> Pass #2 emerald-gold)
  const wave1Mat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const wave1Ring = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.96, 36), wave1Mat);
  wave1Ring.rotation.x = -Math.PI / 2;
  wave1Ring.position.y = 1.6;
  forge.add(wave1Ring);

  const wave2Mat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const wave2Ring = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.98, 36), wave2Mat);
  wave2Ring.rotation.x = -Math.PI / 2;
  wave2Ring.position.y = 1.6;
  forge.add(wave2Ring);

  // Evidence Tray holding the Stolen Crown Copy (tarnishes dead flat gray during 2x recast)
  const trayPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.64, 0.86), palette.iron);
  trayPedestal.position.set(-1.35, 0.32, 1.52);
  forge.add(trayPedestal);

  const stolenCopyGoldMat = new THREE.MeshStandardMaterial({
    color: 0xe2b13c,
    emissive: 0x92400e,
    emissiveIntensity: 0.25,
    roughness: 0.28,
    metalness: 0.82,
  });
  const stolenCopyAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a,
    emissive: 0xb45309,
    emissiveIntensity: 0.2,
    roughness: 0.32,
    metalness: 0.65,
  });
  const stolenCopyCrown = buildCrownSealAssembly(stolenCopyGoldMat, palette.darkBronze, stolenCopyAccentMat);
  stolenCopyCrown.scale.setScalar(0.65);
  stolenCopyCrown.position.set(-1.35, 0.66, 1.52);
  forge.add(stolenCopyCrown);

  // =========================================================================
  // RIGHT: VERIFIED AUDIT TOWER + RISING HYDRAULIC STREET BOLLARDS
  // =========================================================================
  const auditTower = new THREE.Group();
  auditTower.position.set(3.85, 0.16, -0.1);
  root.add(auditTower);

  const aPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.65, 2.45), palette.granitePlinth);
  aPlinth.position.y = 0.325;
  aPlinth.castShadow = !isSoftwareGl;
  auditTower.add(aPlinth);

  const aCore = new THREE.Mesh(new THREE.BoxGeometry(2.48, 3.95, 2.08), palette.limestone);
  aCore.position.y = 2.62;
  aCore.castShadow = !isSoftwareGl;
  auditTower.add(aCore);

  for (const [cx, cz] of [
    [-1.18, -0.98],
    [1.18, -0.98],
    [-1.18, 0.98],
    [1.18, 0.98],
  ]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.1, 0.2), palette.steel);
    col.position.set(cx, 2.68, cz);
    auditTower.add(col);
  }

  const aRoof = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.24, 2.38), palette.darkBronze);
  aRoof.position.y = 4.72;
  auditTower.add(aRoof);

  const aCap = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.26, 1.75), palette.copperRoof);
  aCap.position.y = 4.96;
  auditTower.add(aCap);

  // Emerald LED board showing verified hardening status
  const verifiedTex = createLedBoardTexture(
    'TIER-0 VERIFIED GUARD',
    [
      { text: '1131f6aa/ad: DCs ONLY', color: '#6ee7b7' },
      { text: 'KRBTGT: 2x RESET (>=10h)', color: '#fde68a' },
      { text: 'PROTECTED USERS: ACTIVE', color: '#7dd3fc' },
    ],
    'EMERALD',
    textures
  );
  const verifiedBoardMat = new THREE.MeshStandardMaterial({
    map: verifiedTex,
    emissiveMap: verifiedTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.22,
    roughness: 0.3,
    metalness: 0.14,
  });
  const verifiedBoard = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 1.12), verifiedBoardMat);
  verifiedBoard.position.set(0, 3.05, 1.07);
  auditTower.add(verifiedBoard);

  const auditPlaqueTex = createBrassPlaqueTexture(
    'VERIFIED AUDIT TOWER',
    'ZERO ROGUE ACE · EID 4662 ARMED',
    textures
  );
  const auditPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.52),
    new THREE.MeshStandardMaterial({ map: auditPlaqueTex, roughness: 0.42, metalness: 0.26 })
  );
  auditPlaque.position.set(0, 1.18, 1.07);
  auditTower.add(auditPlaque);

  // Rotating steady Emerald Security Beacon on roof
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    emissive: 0x10b981,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.3,
  });
  const beaconDome = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.36, 18), beaconMat);
  beaconDome.position.set(0, 5.26, 0);
  auditTower.add(beaconDome);

  const beaconHaloMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
  });
  const beaconHalo = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.62, 28), beaconHaloMat);
  beaconHalo.rotation.x = -Math.PI / 2;
  beaconHalo.position.set(0, 5.28, 0);
  auditTower.add(beaconHalo);

  // 4 Hydraulic Steel Security Bollards rising smoothly out of the boulevard curb
  const bollards: THREE.Group[] = [];
  const bollardRingMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.2,
    roughness: 0.25,
  });
  for (const bx of [-4.6, -2.1, 2.2, 4.7]) {
    const bGroup = new THREE.Group();
    bGroup.position.set(bx, 0.16, 3.0);
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.92, 16), palette.steel);
    cyl.position.y = -0.36;
    bGroup.add(cyl);
    const ledBand = new THREE.Mesh(new THREE.CylinderGeometry(0.148, 0.148, 0.1, 16), bollardRingMat);
    ledBand.position.y = 0.02;
    bGroup.add(ledBand);
    root.add(bGroup);
    bollards.push(bGroup);
  }

  const goldColor = new THREE.Color(0xe2b13c);
  const deadGrayColor = new THREE.Color(0x525a64);
  const tmpColor = new THREE.Color();

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.65, 4.7, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.85, 4.7, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 15.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.8, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.1, 2.5, 0.35),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const f = evaluateDcsyncStep4State(tNorm, cutawayMode);

      // Cutaway ribbon glass opens so user sees crimson ribbon detach and fall into quarantine bin
      ribbonHousingPivot.rotation.y = easeOutCubic(f.cutawayOpen) * 1.15;

      const strip = easeOutCubic(f.ribbonStripProgress);
      rogueRibbon.position.set(
        0.62 + strip * 0.1,
        3.12 - strip * 2.15,
        1.44 + strip * 0.26
      );
      rogueRibbon.rotation.z = strip * 0.65;
      rogueRibbon.rotation.x = strip * 0.55;
      ribbonMat.emissiveIntensity = Math.max(0.02, 0.35 * (1 - strip));

      // Double krbtgt crown recast: gyro ring flips 360 deg + two sequential waves (amber then emerald)
      gyroGroup.rotation.z = f.doubleResetRotation * Math.PI * 2;
      gyroGroup.rotation.y = timeSec * 0.6;
      masterCrown.rotation.y = timeSec * (0.7 + (f.recastPass1 + f.recastPass2) * 2.2);
      masterGoldMat.emissiveIntensity = 0.32 + (f.recastPass1 + f.recastPass2) * 0.72;

      wave1Mat.opacity = f.recastPass1 * 0.78;
      wave1Ring.position.y = 1.55 + f.recastPass1 * 1.55;
      wave1Ring.scale.setScalar(0.85 + f.recastPass1 * 1.65);

      wave2Mat.opacity = f.recastPass2 * 0.82;
      wave2Ring.position.y = 1.55 + f.recastPass2 * 1.7;
      wave2Ring.scale.setScalar(0.85 + f.recastPass2 * 1.9);

      // Quarantined stolen crown copy tarnishes from gold -> dull flat dead gray
      const voidFrac = easeOutCubic(f.doubleResetRotation);
      tmpColor.copy(goldColor).lerp(deadGrayColor, voidFrac);
      stolenCopyGoldMat.color.copy(tmpColor);
      stolenCopyGoldMat.metalness = 0.82 - voidFrac * 0.62;
      stolenCopyGoldMat.roughness = 0.28 + voidFrac * 0.62;
      stolenCopyGoldMat.emissiveIntensity = 0.25 * (1 - voidFrac);
      stolenCopyAccentMat.color.copy(tmpColor);
      stolenCopyAccentMat.emissiveIntensity = 0.2 * (1 - voidFrac);

      // Emerald Peer-Mint-Only Blast Doors slide tightly shut & hydraulic bollards rise
      const lock = easeOutCubic(f.peerShieldLock);
      leftBlastDoor.position.x = -1.12 + lock * 0.62;
      rightBlastDoor.position.x = 1.12 - lock * 0.62;
      blastDoorMat.emissiveIntensity = 0.14 + lock * 0.42;
      lockSealMat.emissiveIntensity = 0.22 + lock * 0.78;
      centerLockSeal.rotation.z = lock * Math.PI;

      bollards.forEach((b) => {
        b.position.y = 0.16 + lock * 0.78;
      });
      bollardRingMat.emissiveIntensity = 0.18 + lock * 0.72;

      // Audit Tower emerald verification glow
      verifiedBoardMat.emissiveIntensity = 0.2 + lock * 0.18;
      beaconMat.emissiveIntensity = 0.35 + lock * (0.7 + 0.25 * Math.sin(timeSec * 4));
      beaconHaloMat.opacity = lock * (1 - ((timeSec * 0.85) % 1)) * 0.5;
      beaconHalo.scale.setScalar(1 + ((timeSec * 0.85) % 1) * 2.2);

      return {
        glitchIntensity: f.ribbonStripProgress * 0.15,
        magicDustIntensity: 0,
        stasisIntensity: f.peerShieldLock * 0.3,
        brakeReleaseBoost: (f.recastPass1 + f.recastPass2) * 0.3,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
