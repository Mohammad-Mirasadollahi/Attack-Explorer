import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { RAGMCP_STEP_DURATION_SEC, evaluateRagMcpMemoryDiffState } from '../choreography';

export function buildRagMcpMemoryDiffScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x161024,
    floorTrimHex: 0xa855f7,
    wallColor: 0x221938,
    pillarColor: 0x332654,
    gridColor: 0x3b2c61,
    signTitle: 'CONTEXT BUFFER DIFF · FLAT PROMPT CONCATENATION VS ISOLATED DATA ENVELOPE',
    signSubtitle: 'UNSEPARATED SYSTEM+RETRIEVAL STREAM  VS  TAGGED UNTRUSTED DATA + MCP POLICY GATE',
    signBgHex: '#1D0E33',
    signBorderHex: '#A855F7',
    signTitleHex: '#F3E8FF',
    signSubHex: '#D8B4FE',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const leftBank = new THREE.Group();
  leftBank.position.set(-3.1, 0, 0.25);
  root.add(leftBank);
  leftBank.add(createContactDisc(materials, 2.0, 0.018));
  const leftBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.5, 1.5), materials.createToonMaterial(0x4c1d24));
  leftBox.position.y = 1.25;
  addAnimeInkEdges(leftBox, materials.inkLineMaterial, 24);
  leftBank.add(leftBox);
  const lTex = createPlaqueTexture('FLAT CONTEXT BUFFER', 'Retrieved Text Executed as Tool Command', '#2D0A14', '#E11D48', '#FECDD3');
  textures.push(lTex);
  const lFace = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.9), new THREE.MeshBasicMaterial({ map: lTex }));
  lFace.position.set(0, 1.35, 0.77);
  leftBank.add(lFace);

  const rightBank = new THREE.Group();
  rightBank.position.set(3.1, 0, 0.25);
  root.add(rightBank);
  rightBank.add(createContactDisc(materials, 2.0, 0.018));
  const rightBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.5, 1.5), materials.createToonMaterial(0x14453d));
  rightBox.position.y = 1.25;
  addAnimeInkEdges(rightBox, materials.inkLineMaterial, 24);
  rightBank.add(rightBox);
  const rTex = createPlaqueTexture('ISOLATED DATA ENVELOPE', 'Untrusted Quotes + HitL Tool Gate', '#062820', '#10B981', '#A7F3D0');
  textures.push(rTex);
  const rFace = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.9), new THREE.MeshBasicMaterial({ map: rTex }));
  rFace.position.set(0, 1.35, 0.77);
  rightBank.add(rFace);

  const sweepBeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 3.2, 2.2),
    materials.createToonMaterial(0xc084fc, { emissive: 0xa855f7, emissiveIntensity: 0.9 })
  );
  sweepBeam.position.set(-4.5, 1.6, 0.25);
  root.add(sweepBeam);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 2.9, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.1, 2.9, 0.4);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.35, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % RAGMCP_STEP_DURATION_SEC) + RAGMCP_STEP_DURATION_SEC) % RAGMCP_STEP_DURATION_SEC) /
        RAGMCP_STEP_DURATION_SEC;
      const frame = evaluateRagMcpMemoryDiffState(tNorm, cutawayMode);
      sweepBeam.position.x = -4.5 + frame.forensicSweepProgress * 9.0;
      leftBox.scale.y = 1.0 + frame.leftFlatGlow * 0.08;
      rightBox.scale.y = 1.0 + frame.rightIsolatedGlow * 0.08;
      return {
        glitchIntensity: frame.leftFlatGlow * 0.35,
        magicDustIntensity: 0.24 + frame.forensicSweepProgress * 0.3,
        stasisIntensity: frame.rightIsolatedGlow * 0.45,
        brakeReleaseBoost: 0.14,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
