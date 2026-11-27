import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  KERB_TIMELINE_DURATION_SEC,
  evaluateKerbChoreography,
} from '../choreography';
import {
  buildConciergeTicketDesk,
  buildHotelLobbyBackdrop,
  buildSafecrackerBench,
  buildSpnBellboard,
  buildSuiteVaultDoor,
} from './scene-builders';
import { buildKerbStep1Scene } from './step-1-scene';
import { buildKerbStep2Scene } from './step-2-scene';
import { buildKerbStep3Scene } from './step-3-scene';
import { buildKerbStep4Scene } from './step-4-scene';
import { buildKerbMemoryDiffScene } from './memory-diff-scene';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
    }
  });
  for (const t of textures) t.dispose();
}

function buildKerbBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(materials);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const bellboard = buildSpnBellboard(materials);
  bellboard.group.position.set(-5.2, 0, 0.15);
  textures.push(...bellboard.textures);
  root.add(bellboard.group);

  const desk = buildConciergeTicketDesk(materials);
  desk.group.position.set(-1.35, 0, 0.25);
  root.add(desk.group);

  const bench = buildSafecrackerBench(materials);
  bench.group.position.set(2.35, 0, 0.35);
  root.add(bench.group);

  const suite = buildSuiteVaultDoor(materials);
  suite.group.position.set(5.8, 0, 0.1);
  root.add(suite.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.35, 3.55, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % KERB_TIMELINE_DURATION_SEC) + KERB_TIMELINE_DURATION_SEC) %
          KERB_TIMELINE_DURATION_SEC) /
        KERB_TIMELINE_DURATION_SEC;
      const frame = evaluateKerbChoreography(tNorm, cutawayMode);

      (bellboard.beaconLight.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.3 + frame.bellboardGlow * 1.4;
      desk.tubeCapsule.position.x = -3.1 + frame.tubePacketProgress * 2.25;
      desk.stampArm.position.y = 2.4 - Math.sin(frame.voucherIssued * Math.PI) * 0.65;
      desk.rc4Voucher.visible = frame.voucherIssued > 0.1;
      desk.rc4Voucher.position.x = 0.35 + frame.voucherIssued * 1.45;

      bench.cutawayCoverPivot.rotation.x = -frame.cutawayOpen * 1.3;
      bench.tumblers.forEach((w, i) => {
        w.rotation.z = frame.tumblerSpin * Math.PI * (6 + i * 2);
      });
      bench.masterKeycard.visible = frame.keycardPivot > 0.05;
      bench.masterKeycard.position.x = frame.keycardPivot * 3.1;
      bench.masterKeycard.position.y = 2.55 + Math.sin(frame.keycardPivot * Math.PI) * 0.45;

      const lampMat = suite.statusLamp.material as THREE.MeshToonMaterial;
      if (frame.keycardPivot > 0.72) {
        lampMat.color.setHex(0xe11d48);
        lampMat.emissive.setHex(0xf43f5e);
      } else {
        lampMat.color.setHex(0x10b981);
        lampMat.emissive.setHex(0x10b981);
      }
      suite.aesEmeraldShield.visible = frame.auditLanternBeam > 0.45;

      return {
        glitchIntensity: Math.max(frame.voucherIssued * 0.5, frame.keycardPivot * 0.6),
        magicDustIntensity: Math.max(frame.bellboardGlow * 0.4, frame.tumblerSpin * 0.6),
        stasisIntensity: frame.auditLanternBeam * 0.35,
        brakeReleaseBoost: frame.keycardPivot * 0.5,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeKerbSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'kerb-lobby-briefing':
      return buildKerbBriefingScene(materials);
    case 'kerb-step1-spn':
      return buildKerbStep1Scene(materials);
    case 'kerb-step2-tgs':
      return buildKerbStep2Scene(materials);
    case 'kerb-step3-crack':
      return buildKerbStep3Scene(materials);
    case 'kerb-step4-pth':
      return buildKerbStep4Scene(materials);
    case 'kerb-memory-rc4diff':
      return buildKerbMemoryDiffScene(materials);
    default:
      return buildKerbBriefingScene(materials);
  }
}
