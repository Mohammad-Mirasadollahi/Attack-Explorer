import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { SUNBURST_STEP_DURATION_SEC, evaluateSunburstStep2State } from '../choreography';

export function buildSunburstStep2Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x16120c,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x241d12,
    pillarColor: 0x382d1c,
    gridColor: 0x423522,
    signTitle: 'STEP 2 · GENUINE AUTHENTICODE SIGNING & UPDATE DISTRIBUTION',
    signSubtitle: 'SOLARWINDS WORLDWIDE LLC VALID CERT · ~18,000 ENTERPRISE NETWORKS',
    signBgHex: '#241707',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const mint = new THREE.Group();
  mint.position.set(0, 0, 0.25);
  root.add(mint);
  mint.add(createContactDisc(materials, 2.4, 0.018));

  const crate = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 1.5), materials.createToonMaterial(0x1e293b));
  crate.position.y = 0.7;
  addAnimeInkEdges(crate, materials.inkLineMaterial, 24);
  mint.add(crate);

  const seal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 0.22, 20),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.8 })
  );
  seal.position.set(0, 1.52, 0);
  addAnimeInkEdges(seal, materials.inkLineMaterial, 24);
  mint.add(seal);

  const piston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.6, 1.2, 16),
    materials.createToonMaterial(0x94a3b8)
  );
  piston.position.set(0, 3.6, 0);
  addAnimeInkEdges(piston, materials.inkLineMaterial, 24);
  mint.add(piston);

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.8, -0.85);
  mint.add(hoodPivot);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 1.3, 1.7),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.2, depthWrite: false })
  );
  hood.position.set(0, -0.65, 0.85);
  hoodPivot.add(hood);

  const mon = new THREE.Group();
  mon.position.set(4.3, 0, 0.25);
  root.add(mon);
  mon.add(createContactDisc(materials, 1.25, 0.018));
  const mBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.3, 1.0), materials.createToonMaterial(0x0f172a));
  mBox.position.y = 1.15;
  addAnimeInkEdges(mBox, materials.inkLineMaterial, 24);
  mon.add(mBox);
  const mTex = createPlaqueTexture('SYSMON EID 7', 'SignatureStatus=Valid', '#052E16', '#10B981', '#D1FAE5');
  textures.push(mTex);
  const mFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: mTex }));
  mFace.position.set(0, 1.5, 0.52);
  mon.add(mFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 2.8, 0.4);
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
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % SUNBURST_STEP_DURATION_SEC) + SUNBURST_STEP_DURATION_SEC) % SUNBURST_STEP_DURATION_SEC) /
        SUNBURST_STEP_DURATION_SEC;
      const frame = evaluateSunburstStep2State(tNorm, cutawayMode);
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.1;
      piston.position.y = 3.6 - frame.stampDescend * 1.35;
      crate.position.x = frame.crateRollOut * 2.1;
      seal.position.x = frame.crateRollOut * 2.1;
      (seal.material as THREE.MeshToonMaterial).emissiveIntensity = 0.4 + frame.waxGlowIntensity * 1.0;
      return {
        glitchIntensity: frame.stampDescend * 0.2,
        magicDustIntensity: 0.25 + frame.waxGlowIntensity * 0.45,
        stasisIntensity: frame.crateRollOut * 0.3,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
