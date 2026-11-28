import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { RAGMCP_STEP_DURATION_SEC, evaluateRagMcpStep1State } from '../choreography';

export function buildRagMcpStep1Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x161024,
    floorTrimHex: 0xa855f7,
    wallColor: 0x221938,
    pillarColor: 0x332654,
    gridColor: 0x3b2c61,
    signTitle: 'STEP 1 · POISONED VENDOR DOCUMENT INGESTED INTO VECTOR CORPUS',
    signSubtitle: 'HIDDEN WHITE-TEXT DIRECTIVE EMBEDDED IN PDF -> INDEXED AS TRUSTED RAG CHUNK',
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

  const stack = new THREE.Group();
  stack.position.set(0, 0, 0.25);
  root.add(stack);
  stack.add(createContactDisc(materials, 2.3, 0.018));

  const rack = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.5, 1.5), materials.createToonMaterial(0x2e1065));
  rack.position.y = 1.25;
  addAnimeInkEdges(rack, materials.inkLineMaterial, 24);
  stack.add(rack);

  const rTex = createPlaqueTexture('VECTOR CORPUS INDEX', 'Untrusted External PDF Shelved Beside Policies', '#220B44', '#A855F7', '#E9D5FF');
  textures.push(rTex);
  const rFace = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.92), new THREE.MeshBasicMaterial({ map: rTex }));
  rFace.position.set(0, 1.4, 0.77);
  stack.add(rFace);

  const pamphlet = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.16, 0.9),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  pamphlet.position.set(-3.8, 2.6, 0.45);
  addAnimeInkEdges(pamphlet, materials.inkLineMaterial, 24);
  root.add(pamphlet);

  const inkRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.1, 10, 24),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  inkRing.position.set(0, 2.8, 0.45);
  root.add(inkRing);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.5, 2.4, 0.4);
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
      const frame = evaluateRagMcpStep1State(tNorm, cutawayMode);
      pamphlet.position.x = -3.8 + frame.mailDropProgress * 3.8 + frame.stackIndexProgress * 2.6;
      pamphlet.position.y = 2.6 - frame.mailDropProgress * 0.5;
      inkRing.scale.setScalar(0.85 + frame.hiddenInkReveal * 0.35);
      return {
        glitchIntensity: frame.hiddenInkReveal * 0.35,
        magicDustIntensity: 0.24 + frame.stackIndexProgress * 0.36,
        stasisIntensity: frame.cutawayOpen * 0.2,
        brakeReleaseBoost: 0.15,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
