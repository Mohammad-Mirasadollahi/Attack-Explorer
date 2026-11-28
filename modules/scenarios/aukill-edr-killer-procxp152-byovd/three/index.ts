import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateAukillChoreography } from '../choreography';
import {
  buildPowerPlantBackdrop,
  buildReactorPit,
  buildWatchtowerRow,
} from './scene-builders';
import {
  buildAukillMemoryDiffScene,
  buildAukillStep1Scene,
  buildAukillStep2Scene,
  buildAukillStep3Scene,
  buildAukillStep4Scene,
} from './step-scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry?.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
}

function buildReactorBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildPowerPlantBackdrop(materials);
  root.add(bg);

  const pit = buildReactorPit(materials);
  pit.group.position.set(-2.6, 0, 0.25);
  root.add(pit.group);

  const towers = buildWatchtowerRow(materials);
  towers.group.position.set(4.2, 0, 0.25);
  root.add(towers.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.6, 2.9, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.2, 3.4, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.4, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.4, 0.25),
    update: (elapsedSec, _phaseIndex, _isDark, cutawayMode) => {
      const state = evaluateAukillChoreography(elapsedSec);
      pit.brassWrench.position.x = -2.4 + state.wrenchDropProgress * 2.4;
      const domeOpen =
        cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : state.pitDomeOpen;
      pit.pitDomePivot.rotation.x = -domeOpen * 0.95;
      pit.breakerDial.rotation.y = state.dialTurnProgress * Math.PI * 1.5;

      towers.lamps.forEach((lamp, i) => {
        const m = lamp.material as THREE.MeshToonMaterial;
        const dark = state.towerShutdownProgress > (i + 0.5) / 3 && !state.hvciBlocked;
        if (state.hvciBlocked) {
          m.color.setHex(0x10b981);
          m.emissive.setHex(0x34d399);
          m.emissiveIntensity = 0.95;
        } else if (dark) {
          m.color.setHex(0x475569);
          m.emissive.setHex(0xe11d48);
          m.emissiveIntensity = 0.2;
        } else {
          m.color.setHex(0x38bdf8);
          m.emissive.setHex(0x0ea5e9);
          m.emissiveIntensity = 0.85;
        }
      });

      pit.recallShutter.visible = state.recallShutterDrop > 0.05;
      pit.recallShutter.position.y = 4.6 - state.recallShutterDrop * 2.2;

      return {
        glitchIntensity: state.surgePulseIntensity * 0.45,
        magicDustIntensity: 0.24 + state.dialTurnProgress * 0.35,
        stasisIntensity: state.recallShutterDrop * 0.55,
        brakeReleaseBoost: state.towerShutdownProgress * 0.3,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeAukillSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'aukill-reactor-briefing':
      return buildReactorBriefingScene(materials);
    case 'aukill-step1-drop':
      return buildAukillStep1Scene(materials);
    case 'aukill-step2-ioctl':
      return buildAukillStep2Scene(materials);
    case 'aukill-step3-killloop':
      return buildAukillStep3Scene(materials);
    case 'aukill-step4-hvci':
      return buildAukillStep4Scene(materials);
    case 'aukill-memory-ringdiff':
      return buildAukillMemoryDiffScene(materials);
    default:
      return buildReactorBriefingScene(materials);
  }
}
