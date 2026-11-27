import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  LOG4SHELL_TIMELINE_DURATION_SEC,
  evaluateLog4shellChoreography,
} from '../choreography';
import {
  buildConveyorSorter,
  buildLoggingPress,
  buildMailroomBackdrop,
  buildPneumaticEgressTube,
} from './scene-builders';
import { buildLog4shellStep1Scene } from './step-1-scene';
import { buildLog4shellStep2Scene } from './step-2-scene';
import { buildLog4shellStep3Scene } from './step-3-scene';
import { buildLog4shellStep4Scene } from './step-4-scene';
import { buildLog4shellMemoryDiffScene } from './memory-diff-scene';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
    }
  });
  for (const t of textures) t.dispose();
}

function buildLog4shellBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMailroomBackdrop(materials);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const conveyor = buildConveyorSorter(materials);
  conveyor.group.position.set(-4.7, 0, 0.25);
  root.add(conveyor.group);

  const press = buildLoggingPress(materials);
  press.group.position.set(-0.55, 0, 0.2);
  root.add(press.group);

  const egress = buildPneumaticEgressTube(materials);
  egress.group.position.set(3.25, 0, 0.2);
  root.add(egress.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.55, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(5.4, 3.65, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.1, 0.2),
    update: (timeSec, _p, _d, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % LOG4SHELL_TIMELINE_DURATION_SEC) + LOG4SHELL_TIMELINE_DURATION_SEC) %
          LOG4SHELL_TIMELINE_DURATION_SEC) /
        LOG4SHELL_TIMELINE_DURATION_SEC;
      const frame = evaluateLog4shellChoreography(tNorm, cutawayMode);

      conveyor.parcel.position.x = -1.2 + frame.conveyorParcelProgress * 2.55;
      press.cutawayCoverPivot.rotation.x = -frame.cutawayOpen * 1.3;
      press.parserGears.forEach((g, i) => {
        g.rotation.z =
          frame.egressValveClosed > 0.6
            ? 0
            : timeSec * (2.2 + i * 0.9) * (0.4 + frame.cutawayOpen * 0.8);
      });
      press.literalShield.visible = frame.egressValveClosed > 0.45;
      egress.airlockValve.visible = frame.egressValveClosed > 0.35;

      egress.canister.visible = frame.outboundTubeProgress > 0.05 && frame.egressValveClosed < 0.6;
      egress.canister.position.x = -1.8 + frame.outboundTubeProgress * 3.1;

      const alarm = egress.annexAlarm.material as THREE.MeshToonMaterial;
      if (frame.auditAlarmLevel > 0.2 && frame.egressValveClosed < 0.55) {
        alarm.color.setHex(0xe11d48);
        alarm.emissive.setHex(0xf43f5e);
      } else {
        alarm.color.setHex(0x10b981);
        alarm.emissive.setHex(0x10b981);
      }

      return {
        glitchIntensity: Math.max(frame.outboundTubeProgress * 0.5, frame.auditAlarmLevel * 0.6),
        magicDustIntensity: frame.conveyorParcelProgress * 0.45,
        stasisIntensity: frame.egressValveClosed * 0.45,
        brakeReleaseBoost: frame.outboundTubeProgress * 0.35,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeLog4shellSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'log4j-mailroom-briefing':
      return buildLog4shellBriefingScene(materials);
    case 'log4j-step1-ingress':
      return buildLog4shellStep1Scene(materials);
    case 'log4j-step2-lookup':
      return buildLog4shellStep2Scene(materials);
    case 'log4j-step3-egress':
      return buildLog4shellStep3Scene(materials);
    case 'log4j-step4-airlock':
      return buildLog4shellStep4Scene(materials);
    case 'log4j-memory-classdiff':
      return buildLog4shellMemoryDiffScene(materials);
    default:
      return buildLog4shellBriefingScene(materials);
  }
}
