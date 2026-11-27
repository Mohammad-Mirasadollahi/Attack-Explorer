import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep3State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DCSync Step 3 (`dcsync-step3-eid4662`)
 * Exclusive Room: Forensic `SubjectLogonId: 0x39e4c2a` Correlation Hall
 * Exclusive Props:
 *   1. Left Attributed Crimson Street Courier (`WKS-ADMIN-07 · 10.20.14.88`, `x=-2.7`) pinned beneath spotlight
 *   2. Center Glowing Amber `SubjectLogonId: 0x39e4c2a` Correlation Bridge linking `EID 4662` to `EID 4624` (`x=0`)
 *   3. Right Azure Mint Roster Audit Tower (`EID 4662 AccessMask 0x100`, `x=2.55`) with hinged glass cutaway exposing spinning audit drum & flaring crimson P1 siren
 */
export function buildDcsyncStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0b1526,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x15253f,
    pillarColor: 0x243b5e,
    gridColor: 0x2b456d,
    signTitle: 'STEP 3 · EID 4662 + EID 4624 ROSTER CORRELATION',
    signSubtitle: 'SUBJECTLOGONID 0x39E4C2A JOINS NON-$ SVC_DIR_SYNC -> IP 10.20.14.88 (P1)',
    signBgHex: '#0A192F',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.2,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Attributed Crimson Street Courier (`WKS-ADMIN-07`, x = -2.75) ---
  const vanGroup = new THREE.Group();
  vanGroup.position.set(-2.75, 0, 0.35);
  root.add(vanGroup);
  vanGroup.add(createContactDisc(materials, 1.85, 0.018));

  const vanChassis = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 1.38, 1.45),
    materials.createToonMaterial(0xe11d48)
  );
  vanChassis.position.y = 0.98;
  addAnimeInkEdges(vanChassis, materials.inkLineMaterial, 24);
  vanGroup.add(vanChassis);

  const vanTex = createPlaqueTexture(
    'EID 4624 · SOURCE IP',
    '10.20.14.88 · WKS-07',
    '#3B0A18',
    '#F43F5E',
    '#FFE4E6'
  );
  textures.push(vanTex);

  const vanFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.85),
    new THREE.MeshBasicMaterial({ map: vanTex })
  );
  vanFace.position.set(0, 1.0, 0.74);
  vanGroup.add(vanFace);

  const spotConeMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  });
  const spotCone = new THREE.Mesh(
    new THREE.ConeGeometry(1.7, 3.2, 18, 1, true),
    spotConeMat
  );
  spotCone.position.set(0, 2.6, 0);
  vanGroup.add(spotCone);

  // --- PROP 2: Center Amber SubjectLogonId: 0x39e4c2a Correlation Bridge (x = -0.1) ---
  const joinBeamMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.35,
  });
  const joinBridge = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.18, 0.24),
    joinBeamMat
  );
  joinBridge.position.set(-0.15, 1.85, 0.35);
  addAnimeInkEdges(joinBridge, materials.inkLineMaterial, 24);
  root.add(joinBridge);

  const joinTex = createPlaqueTexture(
    'JOIN KEY · 4662 <-> 4624',
    'LogonId: 0x39e4c2a',
    '#2E1905',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(joinTex);

  const joinPlaque = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.92, 0.14),
    [
      materials.createToonMaterial(0xd97706),
      materials.createToonMaterial(0xd97706),
      materials.createToonMaterial(0xd97706),
      materials.createToonMaterial(0xd97706),
      new THREE.MeshBasicMaterial({ map: joinTex }),
      materials.createToonMaterial(0x78350f),
    ]
  );
  joinPlaque.position.set(-0.15, 2.75, 0.35);
  addAnimeInkEdges(joinPlaque, materials.inkLineMaterial, 24);
  root.add(joinPlaque);

  // --- PROP 3: Right Azure Mint Roster Audit Tower (x = +2.55) ---
  const towerGroup = new THREE.Group();
  towerGroup.position.set(2.55, 0, 0.2);
  root.add(towerGroup);
  towerGroup.add(createContactDisc(materials, 1.95, 0.018));

  const towerBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.95, 3.45, 1.45),
    materials.createToonMaterial(0x0c4a6e)
  );
  towerBody.position.y = 1.725;
  addAnimeInkEdges(towerBody, materials.inkLineMaterial, 24);
  towerGroup.add(towerBody);

  const eid4662Tex = createPlaqueTexture(
    'SECURITY EID 4662',
    '0x100 · NON-$ USER',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(eid4662Tex);

  const towerHeader = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 0.92),
    new THREE.MeshBasicMaterial({ map: eid4662Tex })
  );
  towerHeader.position.set(0, 2.75, 0.74);
  towerGroup.add(towerHeader);

  // Spinning Audit Ledger Drum inside cutaway window
  const ledgerDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 1.5, 16),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.65,
    })
  );
  ledgerDrum.rotation.z = Math.PI / 2;
  ledgerDrum.position.set(0, 1.35, 0.56);
  addAnimeInkEdges(ledgerDrum, materials.inkLineMaterial, 24);
  towerGroup.add(ledgerDrum);

  // Hinged Cutaway Glass Window
  const windowPivot = new THREE.Group();
  windowPivot.position.set(0, 2.02, 0.78);
  towerGroup.add(windowPivot);

  const windowGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 1.35, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  windowGlass.position.set(0, -0.68, 0.04);
  windowPivot.add(windowGlass);

  // Flaring Crimson P1 Siren Beacon atop Audit Tower
  const sirenMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.25,
  });
  const siren = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.42, 0.54, 16),
    sirenMat
  );
  siren.position.set(0, 3.72, 0);
  addAnimeInkEdges(siren, materials.inkLineMaterial, 24);
  towerGroup.add(siren);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.65, 2.95, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.55, 4.05, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.5, 13.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncStep3State(tNorm, cutawayMode);

      windowPivot.rotation.x = -frame.cutawayOpen * 1.28;
      ledgerDrum.rotation.x = timeSec * (2.0 + frame.eid4662Flash * 3.5);

      // Amber LogonId Join Bridge extends & brightens between EID 4662 tower & EID 4624 van
      const join = easeOutCubic(frame.logonIdJoinBeam);
      joinBridge.scale.x = 0.25 + join * 0.75;
      joinBeamMat.emissiveIntensity = 0.3 + join * 1.15;
      joinPlaque.position.y = 2.55 + join * 0.32;

      // Spotlight pins attributed van & P1 siren flares crimson
      spotConeMat.opacity = 0.08 + frame.p1SirenFlare * 0.28;
      sirenMat.emissiveIntensity =
        0.25 + frame.p1SirenFlare * (1.2 + 0.4 * Math.sin(timeSec * 10));

      return {
        glitchIntensity: frame.p1SirenFlare * 0.48,
        magicDustIntensity: 0.25 + frame.logonIdJoinBeam * 0.4,
        stasisIntensity: frame.eid4662Flash * 0.3,
        brakeReleaseBoost: frame.p1SirenFlare * 0.32,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
