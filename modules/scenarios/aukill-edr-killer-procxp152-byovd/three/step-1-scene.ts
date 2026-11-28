import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { AUKILL_STEP_DURATION_SEC, evaluateAukillStep1State } from '../choreography';

export function buildAukillStep1Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x12151e,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x1c2230,
    pillarColor: 0x2b3448,
    gridColor: 0x333e54,
    signTitle: 'STEP 1 · SIGNED PROCEXP152.SYS DRIVER DROP & RING 0 LOAD',
    signSubtitle: 'AUKILL.EXE (PID 5104) -> SCM EID 7045 + SYSMON EID 6 (VALID MICROSOFT SIG)',
    signBgHex: '#1F1608',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const gate = new THREE.Group();
  gate.position.set(0, 0, 0.25);
  root.add(gate);
  gate.add(createContactDisc(materials, 2.3, 0.018));
  const arch = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.5, 1.5), materials.createToonMaterial(0x1e293b));
  arch.position.y = 1.25;
  addAnimeInkEdges(arch, materials.inkLineMaterial, 24);
  gate.add(arch);
  const gTex = createPlaqueTexture('SCM / DSE GATE', 'Valid Microsoft Sig -> Ring 0', '#2E1905', '#F59E0B', '#FEF08A');
  textures.push(gTex);
  const gFace = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.9), new THREE.MeshBasicMaterial({ map: gTex }));
  gFace.position.set(0, 1.4, 0.77);
  gate.add(gFace);

  const wrench = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.25, 0.5),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  wrench.position.set(-3.8, 2.2, 0.5);
  addAnimeInkEdges(wrench, materials.inkLineMaterial, 24);
  root.add(wrench);

  const scanRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.1, 10, 24),
    materials.createToonMaterial(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.85 })
  );
  scanRing.position.set(0, 2.8, 0.45);
  root.add(scanRing);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.8, 2.4, 0.4);
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
      const frame = evaluateAukillStep1State(tNorm, cutawayMode);
      wrench.position.x = -3.8 + frame.wrenchCarryProgress * 4.0 + frame.pitEntryProgress * 3.4;
      wrench.rotation.z = Math.sin(timeSec * 3.0) * 0.18;
      scanRing.scale.setScalar(0.85 + frame.stampScanGlow * 0.35);
      return {
        glitchIntensity: frame.pitEntryProgress * 0.3,
        magicDustIntensity: 0.25 + frame.stampScanGlow * 0.4,
        stasisIntensity: frame.stampScanGlow * 0.25,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
