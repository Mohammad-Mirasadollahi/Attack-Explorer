import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateDnsTunnelChoreography } from '../choreography';
import {
  buildClerkDispatchDesk,
  buildHarborBackdrop,
  buildOffshoreLighthouse,
  buildPostmasterRelayTower,
} from './scene-builders';
import {
  buildMemoryEntropyDiffScene,
  buildStep1ChunkScene,
  buildStep2Sysmon22Scene,
  buildStep3TxtBeaconScene,
  buildStep4RpzScene,
} from './step-scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry?.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
}

function buildLighthouseBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHarborBackdrop(materials);
  root.add(bg);

  const desk = buildClerkDispatchDesk(materials);
  desk.group.position.set(-5.0, 0, 0.25);
  root.add(desk.group);

  const tower = buildPostmasterRelayTower(materials);
  tower.group.position.set(-0.2, 0, 0.25);
  root.add(tower.group);

  const lighthouse = buildOffshoreLighthouse(materials);
  lighthouse.group.position.set(4.8, 0, 0.25);
  root.add(lighthouse.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-4.6, 3.0, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.6, 4.2, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.4, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.4, 0.25),
    update: (elapsedSec, _phaseIndex, _isDark, cutawayMode) => {
      const state = evaluateDnsTunnelChoreography(elapsedSec);

      desk.slips.forEach((slip, i) => {
        const lift =
          state.sliceProgress * 0.22 * (1 + 0.35 * Math.sin(elapsedSec * 4 + i));
        slip.position.y = 1.76 + lift;
      });

      const cutawayOpen =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
            ? 0
            : state.deskCutawayOpen;
      desk.cutawayHoodPivot.rotation.x = -cutawayOpen * 0.92;
      desk.skylightLens.scale.setScalar(1 + cutawayOpen * 0.22);

      const flight = state.pigeonFlightProgress;
      lighthouse.carrierPigeon.position.x = -9.6 + flight * 8.6;
      lighthouse.carrierPigeon.position.y =
        2.4 + Math.sin(flight * Math.PI) * 2.1;
      lighthouse.carrierPigeon.rotation.z = Math.cos(flight * Math.PI) * 0.26;
      tower.relayArch.rotation.z = elapsedSec * (1 + flight * 2.0);

      (
        lighthouse.lanternCore.material as THREE.MeshToonMaterial
      ).emissiveIntensity = 0.25 + state.lighthouseBeaconPulse * 1.15;

      const lampMat = tower.watchLamp.material as THREE.MeshToonMaterial;
      if (state.egressLocked) {
        lampMat.color.setHex(0x10b981);
        lampMat.emissive.setHex(0x34d399);
        lampMat.emissiveIntensity = 0.85;
      } else if (state.entropyAlarmIntensity > 0.35) {
        lampMat.color.setHex(0xf43f5e);
        lampMat.emissive.setHex(0xe11d48);
        lampMat.emissiveIntensity = 0.55 + state.entropyAlarmIntensity * 0.8;
      } else {
        lampMat.color.setHex(0x38bdf8);
        lampMat.emissive.setHex(0x0ea5e9);
        lampMat.emissiveIntensity = 0.55;
      }

      lighthouse.sinkholeNet.visible = state.sinkholeNetDrop > 0.05;
      lighthouse.sinkholeNet.position.y = 5.6 - state.sinkholeNetDrop * 3.05;
      lighthouse.sinkholeNet.rotation.y = elapsedSec * 0.4;

      return {
        glitchIntensity: state.entropyAlarmIntensity * 0.45,
        magicDustIntensity: 0.24 + state.pigeonFlightProgress * 0.35,
        stasisIntensity: state.sinkholeNetDrop * 0.5,
        brakeReleaseBoost: state.lighthouseBeaconPulse * 0.3,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeDnsTunnelSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'dnstun-lighthouse-briefing':
      return buildLighthouseBriefingScene(materials);
    case 'dnstun-step1-chunk':
      return buildStep1ChunkScene(materials);
    case 'dnstun-step2-sysmon22':
      return buildStep2Sysmon22Scene(materials);
    case 'dnstun-step3-txtbeacon':
      return buildStep3TxtBeaconScene(materials);
    case 'dnstun-step4-rpz':
      return buildStep4RpzScene(materials);
    case 'dnstun-memory-entropydiff':
      return buildMemoryEntropyDiffScene(materials);
    default:
      return buildLighthouseBriefingScene(materials);
  }
}
