import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { SUNBURST_STEP_DURATION_SEC, evaluateSunburstStep1State } from '../choreography';

export function buildSunburstStep1Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x13111c,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x1e192d,
    pillarColor: 0x2e2645,
    gridColor: 0x362d52,
    signTitle: 'STEP 1 · SUNSPOT MID-COMPILE SOURCE SWAP (4.2 SECONDS)',
    signSubtitle: 'BLD-ORION-02 TASKHOSTSVC.EXE (PID 3912) -> INVENTORYMANAGER.CS SWAP & RESTORE',
    signBgHex: '#1C1409',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const press = new THREE.Group();
  press.position.set(0, 0, 0.25);
  root.add(press);
  press.add(createContactDisc(materials, 2.4, 0.018));

  const bench = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.35, 1.85), materials.createToonMaterial(0x334155));
  bench.position.y = 0.675;
  addAnimeInkEdges(bench, materials.inkLineMaterial, 24);
  press.add(bench);

  const bTex = createPlaqueTexture('MSBUILD.EXE COMPILER', 'InventoryManager.cs (4.2s)', '#2E1905', '#F59E0B', '#FEF08A');
  textures.push(bTex);
  const bFace = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshBasicMaterial({ map: bTex }));
  bFace.position.set(0, 0.72, 0.94);
  press.add(bFace);

  const cleanPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.14, 0.95),
    materials.createToonMaterial(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.45 })
  );
  cleanPlate.position.set(0, 1.5, 0);
  addAnimeInkEdges(cleanPlate, materials.inkLineMaterial, 24);
  press.add(cleanPlate);

  const riggedPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.14, 0.95),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  riggedPlate.position.set(-2.5, 2.35, 0);
  addAnimeInkEdges(riggedPlate, materials.inkLineMaterial, 24);
  press.add(riggedPlate);

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.7, -0.9);
  press.add(hoodPivot);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 1.35, 1.8),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.2, depthWrite: false })
  );
  hood.position.set(0, -0.68, 0.9);
  hoodPivot.add(hood);

  const gitMon = new THREE.Group();
  gitMon.position.set(4.4, 0, 0.25);
  root.add(gitMon);
  gitMon.add(createContactDisc(materials, 1.25, 0.018));
  const gBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.3, 1.0), materials.createToonMaterial(0x1e293b));
  gBox.position.y = 1.15;
  addAnimeInkEdges(gBox, materials.inkLineMaterial, 24);
  gitMon.add(gBox);
  const gTex = createPlaqueTexture('GIT DIFF AUDIT', '0 COMMITS · SYSMON 11', '#082F49', '#38BDF8', '#E0F2FE');
  textures.push(gTex);
  const gFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: gTex }));
  gFace.position.set(0, 1.5, 0.52);
  gitMon.add(gFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 2.8, 0.35);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.2, 2.5, 0.35);
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
        (((timeSec % SUNBURST_STEP_DURATION_SEC) + SUNBURST_STEP_DURATION_SEC) % SUNBURST_STEP_DURATION_SEC) /
        SUNBURST_STEP_DURATION_SEC;
      const frame = evaluateSunburstStep1State(tNorm, cutawayMode);
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.15;
      const swap = frame.ghostPlateSwap * (1 - frame.cleanRestoreProgress);
      cleanPlate.position.x = swap * 2.3;
      cleanPlate.position.y = 1.5 + swap * 0.6;
      riggedPlate.position.x = -2.5 + swap * 2.5;
      riggedPlate.position.y = 2.35 - swap * 0.85;
      return {
        glitchIntensity: swap * 0.4,
        magicDustIntensity: 0.24 + frame.conveyorAdvance * 0.35,
        stasisIntensity: frame.cleanRestoreProgress * 0.35,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
