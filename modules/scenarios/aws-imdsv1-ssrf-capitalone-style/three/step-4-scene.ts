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
import { IMDS_STEP_DURATION_SEC, evaluateImdsStep4State } from '../choreography';

export function buildImdsStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x091c18,
    floorTrimHex: 0x10b981,
    wallColor: 0x102822,
    pillarColor: 0x1a3d34,
    gridColor: 0x1e473c,
    signTitle: 'STEP 4 · GUARDDUTY OUTSIDEAWS & IMDSV2 HOPLIMIT=1 LOCK',
    signSubtitle: 'HTTPTOKENS=REQUIRED + HOPLIMIT=1 -> HTTP 401 UNAUTHORIZED ON PROXY SSRF',
    signBgHex: '#052E16',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const gateGroup = new THREE.Group();
  gateGroup.position.set(0, 0, 0.25);
  root.add(gateGroup);
  gateGroup.add(createContactDisc(materials, 2.4, 0.018));

  const kioskBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 2.2, 1.6),
    materials.createToonMaterial(0x1e293b)
  );
  kioskBase.position.y = 1.1;
  addAnimeInkEdges(kioskBase, materials.inkLineMaterial, 24);
  gateGroup.add(kioskBase);

  const barrier = new THREE.Mesh(
    new THREE.BoxGeometry(4.1, 0.32, 1.9),
    materials.createToonMaterial(0x10b981, { emissive: 0x34d399, emissiveIntensity: 0.9 })
  );
  barrier.position.set(0, 4.2, 0);
  addAnimeInkEdges(barrier, materials.inkLineMaterial, 24);
  gateGroup.add(barrier);

  const shieldRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.14, 12, 28),
    materials.createToonMaterial(0x34d399, { emissive: 0x10b981, emissiveIntensity: 0.85 })
  );
  shieldRing.position.set(0, 2.4, 0.95);
  gateGroup.add(shieldRing);

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.25, -0.8);
  gateGroup.add(hoodPivot);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 1.1, 1.55),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.22, depthWrite: false })
  );
  hood.position.set(0, -0.55, 0.8);
  hoodPivot.add(hood);

  const gdMon = new THREE.Group();
  gdMon.position.set(-4.3, 0, 0.25);
  root.add(gdMon);
  gdMon.add(createContactDisc(materials, 1.25, 0.018));
  const gdBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 1.0), materials.createToonMaterial(0x0f172a));
  gdBox.position.y = 1.2;
  addAnimeInkEdges(gdBox, materials.inkLineMaterial, 24);
  gdMon.add(gdBox);
  const gdTex = createPlaqueTexture('GUARDDUTY ALERT', 'OutsideAWS · Sev 8.0', '#3B0A18', '#F43F5E', '#FFE4E6');
  textures.push(gdTex);
  const gdFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: gdTex }));
  gdFace.position.set(0, 1.55, 0.52);
  gdMon.add(gdFace);

  const scpMon = new THREE.Group();
  scpMon.position.set(4.3, 0, 0.25);
  root.add(scpMon);
  scpMon.add(createContactDisc(materials, 1.25, 0.018));
  const scpBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 1.0), materials.createToonMaterial(0x064e3b));
  scpBox.position.y = 1.2;
  addAnimeInkEdges(scpBox, materials.inkLineMaterial, 24);
  scpMon.add(scpBox);
  const scpTex = createPlaqueTexture('IMDSv2 ENFORCED', 'HopLimit=1 -> 401', '#052E16', '#10B981', '#D1FAE5');
  textures.push(scpTex);
  const scpFace = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.9), new THREE.MeshBasicMaterial({ map: scpTex }));
  scpFace.position.set(0, 1.55, 0.52);
  scpMon.add(scpFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 2.6, 0.35);
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
      const frame = evaluateImdsStep4State(tNorm, cutawayMode);
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.05;
      barrier.position.y = 4.2 - frame.turnstileBarrierDrop * 1.85;
      shieldRing.rotation.z = timeSec * 1.4;
      shieldRing.scale.setScalar(0.85 + frame.hopLimitShieldGlow * 0.28);
      return {
        glitchIntensity: frame.radarAlertPulse * 0.25,
        magicDustIntensity: 0.24 + frame.hopLimitShieldGlow * 0.4,
        stasisIntensity: frame.turnstileBarrierDrop * 0.55,
        brakeReleaseBoost: 0.14,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
