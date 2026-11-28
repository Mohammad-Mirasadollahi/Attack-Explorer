import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { AUKILL_STEP_DURATION_SEC, evaluateAukillStep2State } from '../choreography';

export function buildAukillStep2Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x16111c,
    floorTrimHex: 0xe11d48,
    wallColor: 0x22192b,
    pillarColor: 0x332642,
    gridColor: 0x3b2c4d,
    signTitle: 'STEP 2 · RING 0 IOCTL 0x8335003C BYPASSES PPL ARMOR',
    signSubtitle: '\\\\.\\PROCEXP152 ZWOPENPROCESS -> HANDLE 0x03A4 (MSMPENG PID 2188)',
    signBgHex: '#280A14',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const consoleGroup = new THREE.Group();
  consoleGroup.position.set(0, 0, 0.25);
  root.add(consoleGroup);
  consoleGroup.add(createContactDisc(materials, 2.35, 0.018));

  const box = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.3, 1.6), materials.createToonMaterial(0x1e293b));
  box.position.y = 1.15;
  addAnimeInkEdges(box, materials.inkLineMaterial, 24);
  consoleGroup.add(box);

  const dial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.28, 18),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0, 1.35, 0.88);
  addAnimeInkEdges(dial, materials.inkLineMaterial, 24);
  consoleGroup.add(dial);

  const handleKey = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.35, 0.35),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  handleKey.position.set(0, 2.8, 0.35);
  addAnimeInkEdges(handleKey, materials.inkLineMaterial, 24);
  consoleGroup.add(handleKey);

  const pplMon = new THREE.Group();
  pplMon.position.set(4.3, 0, 0.25);
  root.add(pplMon);
  pplMon.add(createContactDisc(materials, 1.25, 0.018));
  const pBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.3, 1.0), materials.createToonMaterial(0x1e3a5f));
  pBox.position.y = 1.15;
  addAnimeInkEdges(pBox, materials.inkLineMaterial, 24);
  pplMon.add(pBox);
  const pTex = createPlaqueTexture('MSMPENG PPL', 'Handle 0x03A4 Granted', '#3B0A18', '#F43F5E', '#FFE4E6');
  textures.push(pTex);
  const pFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: pTex }));
  pFace.position.set(0, 1.5, 0.52);
  pplMon.add(pFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 2.5, 0.35);
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
        (((timeSec % AUKILL_STEP_DURATION_SEC) + AUKILL_STEP_DURATION_SEC) % AUKILL_STEP_DURATION_SEC) /
        AUKILL_STEP_DURATION_SEC;
      const frame = evaluateAukillStep2State(tNorm, cutawayMode);
      dial.rotation.y = frame.dialRotation * Math.PI * 1.5;
      handleKey.position.y = 2.5 + frame.handleGrantGlow * 0.95;
      handleKey.rotation.y = timeSec * 1.5;
      return {
        glitchIntensity: frame.dialRotation * 0.35,
        magicDustIntensity: 0.24 + frame.socketConnectProgress * 0.35,
        stasisIntensity: frame.handleGrantGlow * 0.35,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
