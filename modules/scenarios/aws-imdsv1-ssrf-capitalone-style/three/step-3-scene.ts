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
} from '@/components/three/step-stage-primitives';
import { IMDS_STEP_DURATION_SEC, evaluateImdsStep3State } from '../choreography';

export function buildImdsStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x140d18,
    floorTrimHex: 0xe11d48,
    wallColor: 0x1e1628,
    pillarColor: 0x2d203d,
    gridColor: 0x352547,
    signTitle: 'STEP 3 · OFF-VPC S3 BUCKET DISCOVERY & BULK SYNC EXFILTRATION',
    signSubtitle: 'AWS S3 SYNC S3://CORP-CREDIT-APPLICATIONS-PROD FROM 198.51.100.88',
    signBgHex: '#2A0A14',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const vault = new THREE.Group();
  vault.position.set(0, 0, 0.25);
  root.add(vault);
  vault.add(createContactDisc(materials, 2.4, 0.018));

  const cabinet = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 2.8, 1.7),
    materials.createToonMaterial(0x1e293b)
  );
  cabinet.position.y = 1.4;
  addAnimeInkEdges(cabinet, materials.inkLineMaterial, 24);
  vault.add(cabinet);

  const drawers: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new THREE.Mesh(
      new THREE.BoxGeometry(3.1, 0.56, 1.0),
      materials.createToonMaterial(0xe11d48, { emissive: 0xbe123c, emissiveIntensity: 0.5 })
    );
    d.position.set(0, 0.65 + i * 0.78, 0.45);
    addAnimeInkEdges(d, materials.inkLineMaterial, 24);
    vault.add(d);
    drawers.push(d);
  }

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.85, -0.85);
  vault.add(hoodPivot);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 1.3, 1.65),
    new THREE.MeshBasicMaterial({ color: 0xe11d48, transparent: true, opacity: 0.18, depthWrite: false })
  );
  hood.position.set(0, -0.65, 0.85);
  hoodPivot.add(hood);

  const crate = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.75, 0.85),
    materials.createToonMaterial(0xf59e0b, { emissive: 0xd97706, emissiveIntensity: 0.75 })
  );
  crate.position.set(3.8, 1.2, 0.45);
  addAnimeInkEdges(crate, materials.inkLineMaterial, 24);
  root.add(crate);

  const ctMon = new THREE.Group();
  ctMon.position.set(-4.3, 0, 0.25);
  root.add(ctMon);
  ctMon.add(createContactDisc(materials, 1.25, 0.018));
  const ctBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.3, 1.0), materials.createToonMaterial(0x0f172a));
  ctBox.position.y = 1.15;
  addAnimeInkEdges(ctBox, materials.inkLineMaterial, 24);
  ctMon.add(ctBox);
  const ctTex = createPlaqueTexture('CLOUDTRAIL S3', 'No vpcEndpointId', '#082F49', '#38BDF8', '#E0F2FE');
  textures.push(ctTex);
  const ctFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: ctTex }));
  ctFace.position.set(0, 1.5, 0.52);
  ctMon.add(ctFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 2.8, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.8, 2.5, 0.45);
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
        (((timeSec % IMDS_STEP_DURATION_SEC) + IMDS_STEP_DURATION_SEC) % IMDS_STEP_DURATION_SEC) /
        IMDS_STEP_DURATION_SEC;
      const frame = evaluateImdsStep3State(tNorm, cutawayMode);
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.1;
      drawers.forEach((d, idx) => {
        d.position.z = 0.45 + frame.drawerPullOut * (0.55 + idx * 0.14);
      });
      crate.position.y = 0.9 + frame.exfilCrateLift * 1.8;
      crate.rotation.y = timeSec * 1.1;
      return {
        glitchIntensity: frame.offPropertySwipeProgress * 0.4,
        magicDustIntensity: 0.25 + frame.exfilCrateLift * 0.45,
        stasisIntensity: 0.15,
        brakeReleaseBoost: 0.18,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
