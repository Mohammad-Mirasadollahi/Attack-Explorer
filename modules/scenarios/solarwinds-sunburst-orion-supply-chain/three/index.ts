import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateSunburstChoreography } from '../choreography';
import {
  buildFoundryBackdrop,
  buildFoundryPress,
  buildMintSealPress,
  buildRadioClockTower,
} from './scene-builders';
import {
  buildSunburstMemoryDiffScene,
  buildSunburstStep1Scene,
  buildSunburstStep2Scene,
  buildSunburstStep3Scene,
  buildSunburstStep4Scene,
} from './step-scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry?.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
}

function buildFoundryBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildFoundryBackdrop(materials);
  root.add(bg);

  const press = buildFoundryPress(materials);
  press.group.position.set(-5.0, 0, 0.25);
  root.add(press.group);

  const mint = buildMintSealPress(materials);
  mint.group.position.set(0.0, 0, 0.25);
  root.add(mint.group);

  const clock = buildRadioClockTower(materials);
  clock.group.position.set(5.0, 0, 0.25);
  root.add(clock.group);

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
      const state = evaluateSunburstChoreography(elapsedSec);
      press.riggedPlate.position.y = 2.35 - state.plateSwapProgress * 0.85;
      press.cleanPlate.position.x = -0.3 - state.plateSwapProgress * 1.1;

      mint.stampPiston.position.y = 2.8 - state.pressStampProgress * 0.95;
      const cutawayOpen =
        cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : state.dormantShutterOpen;
      mint.cutawayHoodPivot.rotation.x = -cutawayOpen * 0.95;

      (clock.spireOrb.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.35 + state.beaconPulseIntensity * 1.1;
      clock.samlPass.position.y = 2.2 + state.forgedSealGlow * 0.85;

      mint.caliperBar.visible = state.caliperLockProgress > 0.05;
      mint.caliperBar.position.y = 4.6 - state.caliperLockProgress * 2.1;

      return {
        glitchIntensity: state.beaconPulseIntensity * 0.4,
        magicDustIntensity: 0.24 + state.pressStampProgress * 0.35,
        stasisIntensity: state.caliperLockProgress * 0.55,
        brakeReleaseBoost: state.forgedSealGlow * 0.3,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeSunburstSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'sunburst-foundry-briefing':
      return buildFoundryBriefingScene(materials);
    case 'sunburst-step1-sunspot':
      return buildSunburstStep1Scene(materials);
    case 'sunburst-step2-sign':
      return buildSunburstStep2Scene(materials);
    case 'sunburst-step3-dga':
      return buildSunburstStep3Scene(materials);
    case 'sunburst-step4-goldensaml':
      return buildSunburstStep4Scene(materials);
    case 'sunburst-memory-ildiff':
      return buildSunburstMemoryDiffScene(materials);
    default:
      return buildFoundryBriefingScene(materials);
  }
}
