import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateRagMcpChoreography } from '../choreography';
import {
  buildButlerDesk,
  buildLibraryBackdrop,
  buildPneumaticChute,
} from './scene-builders';
import {
  buildRagMcpMemoryDiffScene,
  buildRagMcpStep1Scene,
  buildRagMcpStep2Scene,
  buildRagMcpStep3Scene,
  buildRagMcpStep4Scene,
} from './step-scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry?.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
}

function buildLibraryBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildLibraryBackdrop(materials);
  root.add(bg);

  const desk = buildButlerDesk(materials);
  desk.group.position.set(-2.6, 0, 0.25);
  root.add(desk.group);

  const chute = buildPneumaticChute(materials);
  chute.group.position.set(4.1, 0, 0.25);
  root.add(chute.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.6, 2.9, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 3.4, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.4, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.4, 0.25),
    update: (elapsedSec, _phaseIndex, _isDark, cutawayMode) => {
      const state = evaluateRagMcpChoreography(elapsedSec);
      desk.pamphletCard.position.x = -2.6 + state.pamphletShelveProgress * 2.6;
      const trayOpen =
        cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : state.trayCutawayOpen;
      desk.trayCoverPivot.rotation.x = -trayOpen * 0.95;
      desk.blendGlowBar.scale.x = 0.7 + state.trayBlendProgress * 0.5;

      chute.capsule.position.y = state.chuteBlocked ? 0.7 : 0.7 + state.capsuleShootProgress * 2.4;
      const lampMat = chute.ledgerLamp.material as THREE.MeshToonMaterial;
      if (state.chuteBlocked) {
        lampMat.color.setHex(0x10b981);
        lampMat.emissive.setHex(0x34d399);
        lampMat.emissiveIntensity = 0.95;
      } else {
        lampMat.color.setHex(0xe11d48);
        lampMat.emissive.setHex(0xf43f5e);
        lampMat.emissiveIntensity = 0.4 + state.ledgerAlarmGlow * 0.6;
      }

      desk.glassPartition.visible = state.emeraldPartitionDrop > 0.05;
      desk.glassPartition.position.y = 4.6 - state.emeraldPartitionDrop * 2.6;

      return {
        glitchIntensity: state.ledgerAlarmGlow * 0.45,
        magicDustIntensity: 0.24 + state.trayBlendProgress * 0.35,
        stasisIntensity: state.emeraldPartitionDrop * 0.55,
        brakeReleaseBoost: state.capsuleShootProgress * 0.28,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeRagMcpSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'ragmcp-library-briefing':
      return buildLibraryBriefingScene(materials);
    case 'ragmcp-step1-poison':
      return buildRagMcpStep1Scene(materials);
    case 'ragmcp-step2-retrieve':
      return buildRagMcpStep2Scene(materials);
    case 'ragmcp-step3-mcptool':
      return buildRagMcpStep3Scene(materials);
    case 'ragmcp-step4-guardrail':
      return buildRagMcpStep4Scene(materials);
    case 'ragmcp-memory-ctxdiff':
      return buildRagMcpMemoryDiffScene(materials);
    default:
      return buildLibraryBriefingScene(materials);
  }
}
