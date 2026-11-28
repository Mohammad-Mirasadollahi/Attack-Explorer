import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { AUKILL_STEP_DURATION_SEC, evaluateAukillMemoryDiffState } from '../choreography';

export function buildAukillMemoryDiffScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0d1524,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x152236,
    pillarColor: 0x223654,
    gridColor: 0x273e61,
    signTitle: 'KERNEL MEMORY DIFF · RING 0 PPL BYPASS VS HVCI PRE-LOAD BLOCK',
    signSubtitle: '0xFFFFF80541200000 PROCEXP152 IOCTL  VS  VTL 1 CI.DLL BLOCKLIST',
    signBgHex: '#0C1A2A',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const leftCol = new THREE.Group();
  leftCol.position.set(-3.4, 0, 0.25);
  root.add(leftCol);
  leftCol.add(createContactDisc(materials, 1.8, 0.018));
  const leftSlab = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.5, 1.4),
    materials.createToonMaterial(0x7f1d1d, { emissive: 0xe11d48, emissiveIntensity: 0.45 })
  );
  leftSlab.position.y = 1.25;
  addAnimeInkEdges(leftSlab, materials.inkLineMaterial, 24);
  leftCol.add(leftSlab);
  const lTex = createPlaqueTexture('RING 0 BYPASS', 'IOCTL 0x8335003C/0004', '#3B0A18', '#F43F5E', '#FFE4E6');
  textures.push(lTex);
  const lFace = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.95), new THREE.MeshBasicMaterial({ map: lTex }));
  lFace.position.set(0, 1.4, 0.72);
  leftCol.add(lFace);

  const rightCol = new THREE.Group();
  rightCol.position.set(3.4, 0, 0.25);
  root.add(rightCol);
  rightCol.add(createContactDisc(materials, 1.8, 0.018));
  const rightSlab = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.5, 1.4),
    materials.createToonMaterial(0x064e3b, { emissive: 0x10b981, emissiveIntensity: 0.45 })
  );
  rightSlab.position.y = 1.25;
  addAnimeInkEdges(rightSlab, materials.inkLineMaterial, 24);
  rightCol.add(rightSlab);
  const rTex = createPlaqueTexture('HVCI VTL 1 BLOCK', '0xC0000428 Pre-Load', '#052E16', '#10B981', '#D1FAE5');
  textures.push(rTex);
  const rFace = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.95), new THREE.MeshBasicMaterial({ map: rTex }));
  rFace.position.set(0, 1.4, 0.72);
  rightCol.add(rFace);

  const sweep = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 3.3, 2.2),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, depthWrite: false })
  );
  sweep.position.set(0, 1.65, 0.25);
  root.add(sweep);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.4, 2.8, 0.35);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 2.8, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.2, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.0, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % AUKILL_STEP_DURATION_SEC) + AUKILL_STEP_DURATION_SEC) % AUKILL_STEP_DURATION_SEC) /
        AUKILL_STEP_DURATION_SEC;
      const frame = evaluateAukillMemoryDiffState(tNorm, cutawayMode);
      sweep.position.x = -3.8 + frame.forensicSweepProgress * 7.6;
      (leftSlab.material as THREE.MeshToonMaterial).emissiveIntensity = 0.25 + frame.leftBypassGlow * 0.75;
      (rightSlab.material as THREE.MeshToonMaterial).emissiveIntensity = 0.25 + frame.rightBlockGlow * 0.75;
      return {
        glitchIntensity: frame.leftBypassGlow * 0.35,
        magicDustIntensity: 0.22 + frame.forensicSweepProgress * 0.3,
        stasisIntensity: frame.rightBlockGlow * 0.45,
        brakeReleaseBoost: 0.14,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
