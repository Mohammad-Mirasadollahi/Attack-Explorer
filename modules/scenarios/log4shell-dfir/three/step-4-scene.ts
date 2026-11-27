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
  LOG4SHELL_STEP_DURATION_SEC,
  evaluateLog4shellStep4State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Log4Shell Step 4 (`log4j-step4-airlock`)
 * Exclusive Room: CISA ED 22-02 Hardening Airlock & Secret Rotation Bay
 * Exclusive Props:
 *   1. Left Upgraded `log4j-core 2.17.1+` Literal-Ink Press (`x=-2.5`) with cutaway inspection cover & descending Emerald Literal-Only Shield
 *   2. Center-Right Steel Egress Airlock Valve (`x=1.45`) slamming solid barriers across `TCP 389 / 636 / 1389 / 1099`
 *   3. Far-Right Clean Re-Image & Secret Rotation Wheel (`API / DB / Cloud Keys`, `x=4.5`)
 */
export function buildLog4shellStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x071a16,
    floorTrimHex: 0x10b981,
    wallColor: 0x0f2d26,
    pillarColor: 0x17443a,
    gridColor: 0x1a4d41,
    signTitle: 'STEP 4 · EGRESS AIRLOCK & LITERAL LOG4J 2.17.1+',
    signSubtitle: 'DENY TCP 389/636/1389/1099 · LOG4J 2.17.1+ LITERAL INK · ROTATE SECRETS',
    signBgHex: '#05221B',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Patched Log4j 2.17.1+ Literal-Ink Press (`x = -2.55`) ---
  const pressGroup = new THREE.Group();
  pressGroup.position.set(-2.55, 0, 0.25);
  root.add(pressGroup);
  pressGroup.add(createContactDisc(materials, 2.0, 0.018));

  const pressBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.25, 2.85, 1.55),
    materials.createToonMaterial(0x1e293b)
  );
  pressBody.position.y = 1.425;
  addAnimeInkEdges(pressBody, materials.inkLineMaterial, 24);
  pressGroup.add(pressBody);

  // Hinged Cutaway Louver on Press
  const louverPivot = new THREE.Group();
  louverPivot.position.set(0, 2.75, 0.8);
  pressGroup.add(louverPivot);

  const louverPlate = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 1.1, 0.1),
    materials.createToonMaterial(0x475569)
  );
  louverPlate.position.set(0, -0.55, 0);
  addAnimeInkEdges(louverPlate, materials.inkLineMaterial, 24);
  louverPivot.add(louverPlate);

  // Descending Emerald Literal-Ink Shield (`log4j-core 2.17.1+`)
  const shieldTex = createPlaqueTexture(
    'LOG4J 2.17.1+ LTS',
    'LITERAL INK · NO LOOKUP',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(shieldTex);

  const literalShield = new THREE.Group();
  literalShield.position.set(0, 4.9, 0.96);
  pressGroup.add(literalShield);

  const shieldMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.72,
    transparent: true,
    opacity: 0.92,
  });
  const shieldPlate = new THREE.Mesh(
    new THREE.BoxGeometry(2.95, 2.25, 0.16),
    [
      shieldMat,
      shieldMat,
      shieldMat,
      shieldMat,
      new THREE.MeshBasicMaterial({ map: shieldTex }),
      shieldMat,
    ]
  );
  addAnimeInkEdges(shieldPlate, materials.inkLineMaterial, 24);
  literalShield.add(shieldPlate);

  // --- PROP 2: Center-Right Egress Firewall Airlock Valve (`x = +1.45`) ---
  const airlockGroup = new THREE.Group();
  airlockGroup.position.set(1.45, 0, 0.2);
  root.add(airlockGroup);
  airlockGroup.add(createContactDisc(materials, 1.8, 0.018));

  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 3.2, 16),
    materials.createToonMaterial(0x334155)
  );
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0, 2.05, 0);
  addAnimeInkEdges(pipe, materials.inkLineMaterial, 24);
  airlockGroup.add(pipe);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 3.3, 1.35),
    materials.createToonMaterial(0x0c4a6e)
  );
  frame.position.set(0, 1.65, 0);
  addAnimeInkEdges(frame, materials.inkLineMaterial, 24);
  airlockGroup.add(frame);

  const valveTex = createPlaqueTexture(
    'EGRESS AIRLOCK',
    'DENY 389/636/1389/1099',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(valveTex);

  const airlockGate = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 2.25, 1.42),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
    })
  );
  airlockGate.position.set(0, 3.9, 0);
  addAnimeInkEdges(airlockGate, materials.inkLineMaterial, 24);
  airlockGroup.add(airlockGate);

  const valveSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 0.78),
    new THREE.MeshBasicMaterial({ map: valveTex })
  );
  valveSign.position.set(0, 0.72, 0.72);
  airlockGroup.add(valveSign);

  // --- PROP 3: Far-Right Re-Image & Secret Rotation Wheel (`x = +4.65`) ---
  const rotGroup = new THREE.Group();
  rotGroup.position.set(4.65, 0, 0.25);
  root.add(rotGroup);
  rotGroup.add(createContactDisc(materials, 1.25, 0.018));

  const rotBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.78, 1.35, 16),
    materials.createToonMaterial(0x1e293b)
  );
  rotBase.position.y = 0.675;
  addAnimeInkEdges(rotBase, materials.inkLineMaterial, 24);
  rotGroup.add(rotBase);

  const rotWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.12, 10, 24),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
    })
  );
  rotWheel.position.y = 2.15;
  rotGroup.add(rotWheel);

  const rotTex = createPlaqueTexture(
    'CLEAN REBUILD',
    'ROTATE API / DB KEYS',
    '#2E1905',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(rotTex);

  const rotSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 0.72),
    new THREE.MeshBasicMaterial({ map: rotTex })
  );
  rotSign.position.set(0, 0.72, 0.78);
  rotGroup.add(rotSign);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.55, 3.65, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.45, 3.75, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.1, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.1, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % LOG4SHELL_STEP_DURATION_SEC) + LOG4SHELL_STEP_DURATION_SEC) %
          LOG4SHELL_STEP_DURATION_SEC) /
        LOG4SHELL_STEP_DURATION_SEC;
      const frame = evaluateLog4shellStep4State(tNorm, cutawayMode);

      louverPivot.rotation.x = -frame.cutawayOpen * 1.25;

      // Phase 1: Egress Airlock slams shut across LDAP/RMI ports
      const valveDrop = easeOutCubic(frame.airlockDropProgress);
      airlockGate.position.y = 3.9 - valveDrop * 1.85;

      // Phase 2: Emerald Literal-Ink 2.17.1+ Shield locks onto Press
      const patchDrop = easeOutCubic(frame.literalPatchProgress);
      literalShield.visible = patchDrop > 0.02;
      literalShield.position.y = 4.9 - patchDrop * 3.35;
      shieldMat.emissiveIntensity = 0.65 + 0.35 * Math.sin(timeSec * 3.0);

      // Phase 3: Clean Rebuild & Secret Rotation Wheel spins
      rotWheel.rotation.z = timeSec * (1.2 + frame.secretRotateProgress * 3.5);
      rotWheel.rotation.y = Math.sin(timeSec * 1.2) * 0.35;

      return {
        glitchIntensity: 0.08,
        magicDustIntensity: 0.25 + frame.secretRotateProgress * 0.3,
        stasisIntensity: frame.airlockDropProgress * 0.35 + frame.literalPatchProgress * 0.35,
        brakeReleaseBoost: 0.12,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
