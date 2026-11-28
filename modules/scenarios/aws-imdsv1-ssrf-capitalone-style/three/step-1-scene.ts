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
import { IMDS_STEP_DURATION_SEC, evaluateImdsStep1State } from '../choreography';

export function buildImdsStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0c1926,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x15273a,
    pillarColor: 0x223b54,
    gridColor: 0x26415c,
    signTitle: 'STEP 1 · HOST-HEADER SSRF PIVOT TO LINK-LOCAL IMDSV1',
    signSubtitle: 'EC2-WAF-EDGE-01 (NGINX PID 2418) · HOST: 169.254.169.254 -> ISRM-WAF-ROLE',
    signBgHex: '#1A140A',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const courierPed = new THREE.Group();
  courierPed.position.set(-4.3, 0, 0.25);
  root.add(courierPed);
  courierPed.add(createContactDisc(materials, 1.25, 0.018));
  const courierBox = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.65, 1.15),
    materials.createToonMaterial(0x450a0a)
  );
  courierBox.position.y = 0.825;
  addAnimeInkEdges(courierBox, materials.inkLineMaterial, 24);
  courierPed.add(courierBox);
  const cTex = createPlaqueTexture('ATTACKER 198.51.100.88', 'Host: 169.254.169.254', '#3B0A18', '#E11D48', '#FFE4E6');
  textures.push(cTex);
  const cFace = new THREE.Mesh(new THREE.PlaneGeometry(1.76, 0.86), new THREE.MeshBasicMaterial({ map: cTex }));
  cFace.position.set(0, 0.9, 0.59);
  courierPed.add(cFace);

  const deskGroup = new THREE.Group();
  deskGroup.position.set(0, 0, 0.25);
  root.add(deskGroup);
  deskGroup.add(createContactDisc(materials, 2.35, 0.018));
  const deskBody = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 1.4, 1.85),
    materials.createToonMaterial(0x1e3a5f)
  );
  deskBody.position.y = 0.7;
  addAnimeInkEdges(deskBody, materials.inkLineMaterial, 24);
  deskGroup.add(deskBody);
  const dTex = createPlaqueTexture('EC2-WAF-EDGE-01', 'proxy_pass $http_host', '#082F49', '#38BDF8', '#E0F2FE');
  textures.push(dTex);
  const dFace = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.86), new THREE.MeshBasicMaterial({ map: dTex }));
  dFace.position.set(0, 0.72, 0.94);
  deskGroup.add(dFace);

  const slipMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.14, 0.56),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  slipMesh.position.set(-2.6, 1.65, 0.35);
  addAnimeInkEdges(slipMesh, materials.inkLineMaterial, 24);
  root.add(slipMesh);

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.6, -0.9);
  deskGroup.add(hoodPivot);
  const hoodGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.85, 1.25, 1.8),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22, depthWrite: false })
  );
  hoodGlass.position.set(0, -0.62, 0.9);
  hoodPivot.add(hoodGlass);

  const imdsPed = new THREE.Group();
  imdsPed.position.set(4.3, 0, 0.25);
  root.add(imdsPed);
  imdsPed.add(createContactDisc(materials, 1.3, 0.018));
  const imdsTower = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.5, 1.15),
    materials.createToonMaterial(0x78350f)
  );
  imdsTower.position.y = 1.25;
  addAnimeInkEdges(imdsTower, materials.inkLineMaterial, 24);
  imdsPed.add(imdsTower);
  const iTex = createPlaqueTexture('IMDSv1 169.254.169.254', '200 OK · ISRM-WAF-Role', '#2E1905', '#F59E0B', '#FEF08A');
  textures.push(iTex);
  const iFace = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 0.95), new THREE.MeshBasicMaterial({ map: iTex }));
  iFace.position.set(0, 1.6, 0.59);
  imdsPed.add(iFace);

  const beaconSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 12),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.7 })
  );
  beaconSphere.position.set(4.3, 2.85, 0.25);
  root.add(beaconSphere);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.2, 2.5, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.0, 3.1, 0.35);
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
      const frame = evaluateImdsStep1State(tNorm, cutawayMode);
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.15;
      slipMesh.position.x = -3.4 + frame.slipForwardProgress * 6.8;
      slipMesh.position.y = 1.65 + Math.sin(frame.slipForwardProgress * Math.PI) * 0.55;
      (beaconSphere.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.4 + frame.roleNameEchoGlow * 1.1;
      beaconSphere.scale.setScalar(1 + frame.proxyRedirectPulse * 0.22);
      return {
        glitchIntensity: frame.proxyRedirectPulse * 0.3,
        magicDustIntensity: 0.25 + frame.slipForwardProgress * 0.35,
        stasisIntensity: frame.roleNameEchoGlow * 0.3,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
