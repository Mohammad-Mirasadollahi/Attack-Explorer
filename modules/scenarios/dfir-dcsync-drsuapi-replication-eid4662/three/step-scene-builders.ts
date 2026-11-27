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
import { buildDcsyncStep1Scene } from './step-1-scene';
import { buildDcsyncStep2Scene } from './step-2-scene';
import { buildDcsyncStep3Scene } from './step-3-scene';
import { buildDcsyncStep4Scene } from './step-4-scene';
import { buildDcsyncMemoryDiffScene } from './memory-diff-scene';

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
