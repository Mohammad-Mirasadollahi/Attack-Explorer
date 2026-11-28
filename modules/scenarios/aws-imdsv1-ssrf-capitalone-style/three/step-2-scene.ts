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
import { IMDS_STEP_DURATION_SEC, evaluateImdsStep2State } from '../choreography';

export function buildImdsStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0e1824,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x192536,
    pillarColor: 0x263950,
    gridColor: 0x2b415c,
    signTitle: 'STEP 2 · UNAUTHENTICATED IMDSV1 STS CREDENTIAL HARVEST',
    signSubtitle: 'GET /IAM/SECURITY-CREDENTIALS/ISRM-WAF-ROLE -> 1,342B JSON (0 CLOUDTRAIL)',
    signBgHex: '#201506',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const kiosk = new THREE.Group();
  kiosk.position.set(0, 0, 0.25);
  root.add(kiosk);
  kiosk.add(createContactDisc(materials, 2.25, 0.018));

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 2.4, 1.7),
    materials.createToonMaterial(0x78350f)
  );
  body.position.y = 1.2;
  addAnimeInkEdges(body, materials.inkLineMaterial, 24);
  kiosk.add(body);

  const kTex = createPlaqueTexture('IMDSv1 KEYCARD KIOSK', 'No PUT Token Required', '#2E1905', '#F59E0B', '#FEF08A');
  textures.push(kTex);
  const kFace = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.9), new THREE.MeshBasicMaterial({ map: kTex }));
  kFace.position.set(0, 1.3, 0.87);
  kiosk.add(kFace);

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.4, -0.85);
  kiosk.add(hoodPivot);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 1.25, 1.65),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.22, depthWrite: false })
  );
  hood.position.set(0, -0.62, 0.85);
  hoodPivot.add(hood);

  const keycard = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.16, 0.88),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  keycard.position.set(0, 2.55, 0.3);
  addAnimeInkEdges(keycard, materials.inkLineMaterial, 24);
  kiosk.add(keycard);

  const leftMon = new THREE.Group();
  leftMon.position.set(-4.3, 0, 0.25);
  root.add(leftMon);
  leftMon.add(createContactDisc(materials, 1.2, 0.018));
  const lBox = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.2, 1.0), materials.createToonMaterial(0x1e293b));
  lBox.position.y = 1.1;
  addAnimeInkEdges(lBox, materials.inkLineMaterial, 24);
  leftMon.add(lBox);
  const lTex = createPlaqueTexture('STS BUNDLE', 'ASIA5LABEXAMPLE9Q2W', '#3B0A18', '#E11D48', '#FFE4E6');
  textures.push(lTex);
  const lFace = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.88), new THREE.MeshBasicMaterial({ map: lTex }));
  lFace.position.set(0, 1.45, 0.52);
  leftMon.add(lFace);

  const rightMon = new THREE.Group();
  rightMon.position.set(4.3, 0, 0.25);
  root.add(rightMon);
  rightMon.add(createContactDisc(materials, 1.2, 0.018));
  const rBox = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.2, 1.0), materials.createToonMaterial(0x1e293b));
  rBox.position.y = 1.1;
  addAnimeInkEdges(rBox, materials.inkLineMaterial, 24);
  rightMon.add(rBox);
  const rTex = createPlaqueTexture('CLOUDTRAIL LOGS', '0 EVENTS ON IMDS READ', '#082F49', '#38BDF8', '#E0F2FE');
  textures.push(rTex);
  const rFace = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.88), new THREE.MeshBasicMaterial({ map: rTex }));
  rFace.position.set(0, 1.45, 0.52);
  rightMon.add(rFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.1, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 2.5, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.35, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.3, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % IMDS_STEP_DURATION_SEC) + IMDS_STEP_DURATION_SEC) % IMDS_STEP_DURATION_SEC) /
        IMDS_STEP_DURATION_SEC;
      const frame = evaluateImdsStep2State(tNorm, cutawayMode);
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.1;
      keycard.position.y = 2.55 + frame.keycardEjectHeight * 1.05;
      keycard.rotation.y = Math.sin(timeSec * 2.4) * 0.35;
      (keycard.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.5 + frame.tokenEnvelopeGlow * 0.9;
      return {
        glitchIntensity: frame.kioskRequestProgress * 0.25,
        magicDustIntensity: 0.25 + frame.keycardEjectHeight * 0.45,
        stasisIntensity: frame.tokenEnvelopeGlow * 0.3,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
