import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  DCSYNC_TIMELINE_DURATION_SEC,
  evaluateDcsyncChoreography,
} from '../choreography';
import {
  buildArmoredLedgerBridge,
  buildMintAuditTower,
  buildMintPlazaBackdrop,
  buildRogueCourierCar,
  buildSovereignMintTower,
} from './scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
    }
  });
  for (const t of textures) t.dispose();
}

function buildDcsyncBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMintPlazaBackdrop(materials);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const mint = buildSovereignMintTower(materials);
  mint.group.position.set(-4.9, 0, 0.2);
  root.add(mint.group);

  const bridge = buildArmoredLedgerBridge(materials);
  bridge.group.position.set(-0.35, 0, 0.1);
  root.add(bridge.group);

  const courier = buildRogueCourierCar(materials);
  courier.group.position.set(2.9, 0, 0.65);
  root.add(courier.group);

  const audit = buildMintAuditTower(materials);
  audit.group.position.set(5.6, 0, 0.15);
  root.add(audit.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.35, 3.7, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(5.5, 3.85, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.2, 0.2),
    update: (timeSec, _p, _d, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_TIMELINE_DURATION_SEC) + DCSYNC_TIMELINE_DURATION_SEC) %
          DCSYNC_TIMELINE_DURATION_SEC) /
        DCSYNC_TIMELINE_DURATION_SEC;
      const frame = evaluateDcsyncChoreography(tNorm, cutawayMode);

      mint.crownCore.rotation.y = timeSec * 1.4;
      (mint.aclRibbon.material as THREE.MeshToonMaterial).emissiveIntensity =
        frame.peerGateShield > 0.5 ? 0.1 : 0.4 + frame.aclRibbonGlow * 1.1;
      mint.aclRibbon.visible = frame.peerGateShield < 0.6;
      mint.peerGateShield.visible = frame.peerGateShield > 0.35;

      courier.group.position.x = 4.1 - frame.courierAdvance * 1.4;
      bridge.cutawayGlassPivot.rotation.x = -frame.cutawayOpen * 1.3;
      bridge.ledgerCapsule.position.x = -2.1 + frame.ledgerStreamProgress * 4.2;

      const alarmMat = audit.alarmBeacon.material as THREE.MeshToonMaterial;
      if (frame.auditAlarmLevel > 0.2 && frame.peerGateShield < 0.55) {
        alarmMat.color.setHex(0xe11d48);
        alarmMat.emissive.setHex(0xf43f5e);
      } else {
        alarmMat.color.setHex(0x10b981);
        alarmMat.emissive.setHex(0x10b981);
      }

      return {
        glitchIntensity: Math.max(frame.ledgerStreamProgress * 0.55, frame.auditAlarmLevel * 0.5),
        magicDustIntensity: Math.max(frame.aclRibbonGlow * 0.4, frame.ledgerStreamProgress * 0.6),
        stasisIntensity: frame.peerGateShield * 0.45,
        brakeReleaseBoost: frame.ledgerStreamProgress * 0.35,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildDcsyncStep1Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMintPlazaBackdrop(
    materials,
    'STEP 1 · OVER-PRIVILEGED GATEHOUSE ACL RIBBON',
    'DOMAIN ROOT GRANTS NON-DC USER GUID 1131F6AD-9C07-11D1-F79F-00C04FC2DCD2',
    '#F59E0B'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const mint = buildSovereignMintTower(materials);
  mint.group.position.set(0, 0, 0.25);
  mint.group.scale.setScalar(1.22);
  root.add(mint.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.5, 3.7, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.6, 2.35, 0.45);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 12.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec) => {
      mint.crownCore.rotation.y = timeSec * 1.4;
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 3.0);
      (mint.aclRibbon.material as THREE.MeshToonMaterial).emissiveIntensity = 0.4 + pulse * 1.1;
      return {
        glitchIntensity: pulse * 0.35,
        magicDustIntensity: 0.45,
        stasisIntensity: 0.1,
        brakeReleaseBoost: 0.2,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildDcsyncStep2Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMintPlazaBackdrop(
    materials,
    'STEP 2 · ROGUE COURIER ON EXPRESS LEDGER BRIDGE',
    'MS-DRSR IDL_DRSGETNCCHANGES (OPNUM 3) FROM NON-DC HOST 10.20.14.88',
    '#E11D48'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const bridge = buildArmoredLedgerBridge(materials);
  bridge.group.position.set(-1.1, 0, 0.15);
  bridge.cutawayGlassPivot.rotation.x = -1.25;
  root.add(bridge.group);

  const courier = buildRogueCourierCar(materials);
  courier.group.position.set(3.2, 0, 0.45);
  root.add(courier.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.1, 3.65, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.1, 3.05, 0.45);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.5, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.1, 0.2),
    update: (timeSec, _p, _d, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const t = (timeSec % 6) / 6;
      bridge.cutawayGlassPivot.rotation.x = cutawayMode === 'SEALED' ? 0 : -1.25;
      bridge.ledgerCapsule.position.x = -2.1 + t * 4.2;
      return {
        glitchIntensity: 0.55,
        magicDustIntensity: 0.55,
        stasisIntensity: 0.15,
        brakeReleaseBoost: 0.35,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildDcsyncStep3Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMintPlazaBackdrop(
    materials,
    'STEP 3 · SECURITY EID 4662 + 4624 NON-DC CORRELATION',
    'SUBJECTLOGONID JOINS NON-$ REPLICATION LOG TO IP 10.20.14.88',
    '#38BDF8'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const courier = buildRogueCourierCar(materials);
  courier.group.position.set(-2.6, 0, 0.35);
  root.add(courier.group);

  const audit = buildMintAuditTower(materials);
  audit.group.position.set(2.35, 0, 0.2);
  audit.group.scale.setScalar(1.18);
  root.add(audit.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.5, 3.1, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.35, 3.95, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.5, 13.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec) => {
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 3.4);
      const beacon = audit.alarmBeacon.material as THREE.MeshToonMaterial;
      beacon.color.setHex(0xe11d48);
      beacon.emissive.setHex(0xf43f5e);
      beacon.emissiveIntensity = 0.6 + pulse * 0.9;
      return {
        glitchIntensity: 0.45,
        magicDustIntensity: 0.45,
        stasisIntensity: 0.2,
        brakeReleaseBoost: 0.3,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildDcsyncStep4Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMintPlazaBackdrop(
    materials,
    'STEP 4 · TIER-0 ACL CLEANUP & DOUBLE KRBTGT RESET',
    'PEER-ONLY DC REPLICATION GATE + PROTECTED USERS ENFORCEMENT',
    '#10B981'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const mint = buildSovereignMintTower(materials);
  mint.group.position.set(-2.2, 0, 0.2);
  mint.aclRibbon.visible = false;
  mint.peerGateShield.visible = true;
  root.add(mint.group);

  const audit = buildMintAuditTower(materials);
  audit.group.position.set(2.45, 0, 0.2);
  root.add(audit.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.2, 3.9, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.45, 3.85, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.1, 2.2, 0.2),
    update: (timeSec) => {
      mint.crownCore.rotation.y = timeSec * 1.8;
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 2.2);
      (mint.peerGateShield.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.5 + pulse * 0.45;
      return {
        glitchIntensity: 0.12,
        magicDustIntensity: 0.35,
        stasisIntensity: 0.5,
        brakeReleaseBoost: 0.1,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildDcsyncMemoryDiffScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMintPlazaBackdrop(
    materials,
    'MEMORY DIFF · EXPOSED DACL VS. PEER-DC-ONLY SEAL',
    'OVER-PRIVILEGED SVC_DIR_SYNC ACE (LEFT) VS. ENTERPRISE DC ONLY (RIGHT)',
    '#38BDF8'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const leftMint = buildSovereignMintTower(materials);
  leftMint.group.position.set(-3.1, 0, 0.2);
  root.add(leftMint.group);

  const rightMint = buildSovereignMintTower(materials);
  rightMint.group.position.set(3.1, 0, 0.2);
  rightMint.aclRibbon.visible = false;
  rightMint.peerGateShield.visible = true;
  root.add(rightMint.group);

  const sweepBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.6, 3.0),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.28,
    })
  );
  (sweepBar.material as THREE.MeshToonMaterial).depthWrite = false;
  sweepBar.position.set(0, 2.3, 0.2);
  root.add(sweepBar);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 4.1, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.1, 4.1, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.2),
    update: (timeSec) => {
      sweepBar.position.x = Math.sin(timeSec * 0.95) * 4.3;
      leftMint.crownCore.rotation.y = timeSec * 1.4;
      rightMint.crownCore.rotation.y = -timeSec * 1.4;
      return {
        glitchIntensity: 0.22,
        magicDustIntensity: 0.35,
        stasisIntensity: 0.35,
        brakeReleaseBoost: 0.15,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeDcsyncSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'dcsync-mint-briefing':
      return buildDcsyncBriefingScene(materials);
    case 'dcsync-step1-acl':
      return buildDcsyncStep1Scene(materials);
    case 'dcsync-step2-drsr':
      return buildDcsyncStep2Scene(materials);
    case 'dcsync-step3-eid4662':
      return buildDcsyncStep3Scene(materials);
    case 'dcsync-step4-krbtgt':
      return buildDcsyncStep4Scene(materials);
    case 'dcsync-memory-acldiff':
      return buildDcsyncMemoryDiffScene(materials);
    default:
      return buildDcsyncBriefingScene(materials);
  }
}
