import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { AUKILL_STEP_DURATION_SEC, evaluateAukillStep4State } from '../choreography';

export function buildAukillStep4Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x091a16,
    floorTrimHex: 0x10b981,
    wallColor: 0x102922,
    pillarColor: 0x1a4035,
    gridColor: 0x204d40,
    signTitle: 'STEP 4 · HVCI & MICROSOFT DRIVER BLOCKLIST PRE-LOAD DENIAL',
    signSubtitle: 'CODEINTEGRITY EID 3077 · STATUS_INVALID_IMAGE_HASH (0xC0000428) · EDR ONLINE',
    signBgHex: '#052E16',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const gate = new THREE.Group();
  gate.position.set(0, 0, 0.25);
  root.add(gate);
  gate.add(createContactDisc(materials, 2.35, 0.018));

  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 1.5), materials.createToonMaterial(0x1e293b));
  frame.position.y = 1.2;
  addAnimeInkEdges(frame, materials.inkLineMaterial, 24);
  gate.add(frame);

  const shutter = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.35, 1.8),
    materials.createToonMaterial(0x10b981, { emissive: 0x34d399, emissiveIntensity: 0.9 })
  );
  shutter.position.set(0, 4.3, 0);
  addAnimeInkEdges(shutter, materials.inkLineMaterial, 24);
  gate.add(shutter);

  const mon = new THREE.Group();
  mon.position.set(4.3, 0, 0.25);
  root.add(mon);
  mon.add(createContactDisc(materials, 1.25, 0.018));
  const mBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 1.0), materials.createToonMaterial(0x064e3b));
  mBox.position.y = 1.2;
  addAnimeInkEdges(mBox, materials.inkLineMaterial, 24);
  mon.add(mBox);
  const mTex = createPlaqueTexture('CI.DLL EID 3077', '0xC0000428 BLOCKED', '#052E16', '#10B981', '#D1FAE5');
  textures.push(mTex);
  const mFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: mTex }));
  mFace.position.set(0, 1.55, 0.52);
  mon.add(mFace);

  const safeOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 12),
    materials.createToonMaterial(0x38bdf8, { emissive: 0x10b981, emissiveIntensity: 0.9 })
  );
  safeOrb.position.set(-4.0, 2.6, 0.25);
  root.add(safeOrb);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 2.6, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.35, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % AUKILL_STEP_DURATION_SEC) + AUKILL_STEP_DURATION_SEC) % AUKILL_STEP_DURATION_SEC) /
        AUKILL_STEP_DURATION_SEC;
      const frame = evaluateAukillStep4State(tNorm, cutawayMode);
      shutter.position.y = 4.3 - frame.shutterSlamDrop * 1.9;
      safeOrb.scale.setScalar(0.9 + frame.watchtowerSafeGlow * 0.35);
      return {
        glitchIntensity: frame.hashCheckProgress * 0.2,
        magicDustIntensity: 0.24 + frame.watchtowerSafeGlow * 0.4,
        stasisIntensity: frame.shutterSlamDrop * 0.55,
        brakeReleaseBoost: 0.14,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
