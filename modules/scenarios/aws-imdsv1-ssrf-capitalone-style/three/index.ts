import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateImdsChoreography } from '../choreography';
import {
  buildConciergeDesk,
  buildHotelLobbyBackdrop,
  buildKeycardKiosk,
  buildRooftopVault,
} from './scene-builders';
import {
  buildImdsMemoryDiffScene,
  buildImdsStep1Scene,
  buildImdsStep2Scene,
  buildImdsStep3Scene,
  buildImdsStep4Scene,
} from './step-scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry?.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
}

function buildConciergeBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHotelLobbyBackdrop(materials);
  root.add(bg);

  const desk = buildConciergeDesk(materials);
  desk.group.position.set(-5.0, 0, 0.25);
  root.add(desk.group);

  const kiosk = buildKeycardKiosk(materials);
  kiosk.group.position.set(0.0, 0, 0.25);
  root.add(kiosk.group);

  const vault = buildRooftopVault(materials);
  vault.group.position.set(5.0, 0, 0.25);
  root.add(vault.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-4.6, 2.8, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.8, 3.8, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.4, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.4, 0.25),
    update: (elapsedSec, _phaseIndex, _isDark, cutawayMode) => {
      const state = evaluateImdsChoreography(elapsedSec);
      desk.forgedSlip.position.x = -1.2 + state.slipSlideProgress * 2.4;

      const cutawayOpen =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
            ? 0
            : state.kioskCutawayOpen;
      kiosk.cutawayHoodPivot.rotation.x = -cutawayOpen * 0.95;

      kiosk.brassKeycard.position.y = 1.85 + state.keycardDispenseProgress * 1.15;
      kiosk.brassKeycard.position.x = state.keycardDispenseProgress * 2.2;

      vault.drawers.forEach((d, i) => {
        d.position.z = 0.45 + state.vaultDrainProgress * (0.55 + i * 0.14);
      });

      const lampMat = kiosk.radarLamp.material as THREE.MeshToonMaterial;
      if (state.imdsLocked) {
        lampMat.color.setHex(0x10b981);
        lampMat.emissive.setHex(0x34d399);
        lampMat.emissiveIntensity = 0.9;
      } else if (state.outsideAlarmIntensity > 0.35) {
        lampMat.color.setHex(0xf43f5e);
        lampMat.emissive.setHex(0xe11d48);
        lampMat.emissiveIntensity = 0.6 + state.outsideAlarmIntensity * 0.7;
      } else {
        lampMat.color.setHex(0x38bdf8);
        lampMat.emissive.setHex(0x0ea5e9);
        lampMat.emissiveIntensity = 0.55;
      }

      kiosk.turnstileGate.visible = state.turnstileLockDrop > 0.05;
      kiosk.turnstileGate.position.y = 4.6 - state.turnstileLockDrop * 2.25;

      return {
        glitchIntensity: state.outsideAlarmIntensity * 0.45,
        magicDustIntensity: 0.24 + state.keycardDispenseProgress * 0.35,
        stasisIntensity: state.turnstileLockDrop * 0.55,
        brakeReleaseBoost: state.vaultDrainProgress * 0.3,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeImdsSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'imds-concierge-briefing':
      return buildConciergeBriefingScene(materials);
    case 'imds-step1-ssrf':
      return buildImdsStep1Scene(materials);
    case 'imds-step2-creds':
      return buildImdsStep2Scene(materials);
    case 'imds-step3-s3sync':
      return buildImdsStep3Scene(materials);
    case 'imds-step4-imdsv2':
      return buildImdsStep4Scene(materials);
    case 'imds-memory-tokendiff':
      return buildImdsMemoryDiffScene(materials);
    default:
      return buildConciergeBriefingScene(materials);
  }
}
