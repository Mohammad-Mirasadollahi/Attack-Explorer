import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { RAGMCP_STEP_DURATION_SEC, evaluateRagMcpStep2State } from '../choreography';

export function buildRagMcpStep2Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x161024,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x221938,
    pillarColor: 0x332654,
    gridColor: 0x3b2c61,
    signTitle: 'STEP 2 · RAG RETRIEVAL MERGES POISONED CHUNK WITH SYSTEM PROMPT',
    signSubtitle: 'FLAT CONTEXT WINDOW -> UNTRUSTED DATA INTERPRETED AS PRIVILEGED INSTRUCTION',
    signBgHex: '#221506',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const tray = new THREE.Group();
  tray.position.set(0, 0, 0.25);
  root.add(tray);
  tray.add(createContactDisc(materials, 2.3, 0.018));

  const trayBox = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.4, 1.6), materials.createToonMaterial(0x1e293b));
  trayBox.position.y = 1.2;
  addAnimeInkEdges(trayBox, materials.inkLineMaterial, 24);
  tray.add(trayBox);

  const tTex = createPlaqueTexture('LLM CONTEXT WINDOW', 'System Rules + Retrieved Data Without Delimiter', '#2B1805', '#F59E0B', '#FEF08A');
  textures.push(tTex);
  const tFace = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.92), new THREE.MeshBasicMaterial({ map: tTex }));
  tFace.position.set(0, 1.35, 0.82);
  tray.add(tFace);

  const cartChunk = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.45, 0.85),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.9 })
  );
  cartChunk.position.set(-3.8, 2.4, 0.45);
  addAnimeInkEdges(cartChunk, materials.inkLineMaterial, 24);
  root.add(cartChunk);

  const hijackHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.12, 10, 24),
    materials.createToonMaterial(0xf43f5e, { emissive: 0xe11d48, emissiveIntensity: 0.9 })
  );
  hijackHalo.position.set(0, 2.9, 0.35);
  root.add(hijackHalo);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 2.5, 0.4);
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
      const frame = evaluateRagMcpStep2State(tNorm, cutawayMode);
      cartChunk.position.x = -3.8 + frame.cartFetchProgress * 3.8;
      cartChunk.position.y = 2.4 - frame.trayMergeProgress * 0.55;
      hijackHalo.scale.setScalar(0.85 + frame.hijackGlowIntensity * 0.4);
      return {
        glitchIntensity: frame.hijackGlowIntensity * 0.45,
        magicDustIntensity: 0.26 + frame.trayMergeProgress * 0.38,
        stasisIntensity: frame.cutawayOpen * 0.2,
        brakeReleaseBoost: 0.18,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
