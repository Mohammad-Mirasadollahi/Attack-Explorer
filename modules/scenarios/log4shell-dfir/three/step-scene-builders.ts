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

function buildLog4shellStep1Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMailroomBackdrop(
    materials,
    'STEP 1 · INBOUND CONVEYOR & NGINX ACCESS CAMERA',
    'UNTRUSTED HTTP HEADER PASSES EDGE PROXY & SURICATA SID 2034649',
    '#F59E0B'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const conveyor = buildConveyorSorter(materials);
  conveyor.group.position.set(0, 0, 0.25);
  conveyor.group.scale.setScalar(1.3);
  root.add(conveyor.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.2, 3.35, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.2, 3.65, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.0, 0.25),
    update: (timeSec) => {
      const t = (timeSec % 6) / 6;
      conveyor.parcel.position.x = -1.2 + t * 2.4;
      return {
        glitchIntensity: 0.25,
        magicDustIntensity: 0.4,
        stasisIntensity: 0.15,
        brakeReleaseBoost: 0.2,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildLog4shellStep2Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMailroomBackdrop(
    materials,
    'STEP 2 · LOG4J2 MESSAGEPATTERNCONVERTER LOOKUP',
    'LOG4J-CORE-2.14.1.JAR EVALUATES UNTRUSTED TEXT AS JNDI COMMAND',
    '#E11D48'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const press = buildLoggingPress(materials);
  press.group.position.set(0, 0, 0.25);
  press.group.scale.setScalar(1.22);
  press.cutawayCoverPivot.rotation.x = -1.3;
  root.add(press.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.5, 3.65, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.5, 3.45, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 13.0),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec, _p, _d, cutawayMode: StandardCutawayMode = 'AUTO') => {
      press.cutawayCoverPivot.rotation.x = cutawayMode === 'SEALED' ? 0 : -1.3;
      press.parserGears.forEach((g, i) => {
        g.rotation.z = timeSec * (2.6 + i * 1.1);
      });
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

function buildLog4shellStep3Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMailroomBackdrop(
    materials,
    'STEP 3 · OUTBOUND PNEUMATIC TUBE & AUDITD EXECVE',
    'ZEEK TCP/1389 EGRESS + LINUX AUDITD (JAVA -> SH) BEAT OBFUSCATION',
    '#38BDF8'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const press = buildLoggingPress(materials);
  press.group.position.set(-2.5, 0, 0.2);
  root.add(press.group);

  const egress = buildPneumaticEgressTube(materials);
  egress.group.position.set(1.35, 0, 0.2);
  root.add(egress.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.4, 3.55, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.6, 3.7, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.5, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.1, 0.2),
    update: (timeSec) => {
      const t = (timeSec % 6) / 6;
      egress.canister.position.x = -1.8 + t * 3.2;
      const alarm = egress.annexAlarm.material as THREE.MeshToonMaterial;
      alarm.color.setHex(0xe11d48);
      alarm.emissive.setHex(0xf43f5e);
      return {
        glitchIntensity: 0.55,
        magicDustIntensity: 0.5,
        stasisIntensity: 0.2,
        brakeReleaseBoost: 0.35,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildLog4shellStep4Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMailroomBackdrop(
    materials,
    'STEP 4 · LOG4J 2.17.1+ & EGRESS AIRLOCK VALVE',
    'LITERAL-ONLY LOGGING + DENY OUTBOUND TCP/389/636/1389/1099',
    '#10B981'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const press = buildLoggingPress(materials);
  press.group.position.set(-2.4, 0, 0.2);
  press.literalShield.visible = true;
  root.add(press.group);

  const egress = buildPneumaticEgressTube(materials);
  egress.group.position.set(1.4, 0, 0.2);
  egress.airlockValve.visible = true;
  egress.canister.visible = false;
  root.add(egress.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.4, 3.65, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.8, 3.55, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.1, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.2, 0.2),
    update: (timeSec) => {
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 2.2);
      (press.literalShield.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.5 + pulse * 0.45;
      return {
        glitchIntensity: 0.1,
        magicDustIntensity: 0.3,
        stasisIntensity: 0.5,
        brakeReleaseBoost: 0.1,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildLog4shellMemoryDiffScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildMailroomBackdrop(
    materials,
    'MEMORY DIFF · LOG4J 2.14.1 LOOKUP VS. 2.17.1+ LITERAL',
    'ACTIVE JNDILOOKUP PARSER (LEFT) VS. LITERAL-ONLY HARDENED JAR (RIGHT)',
    '#38BDF8'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const leftPress = buildLoggingPress(materials);
  leftPress.group.position.set(-3.1, 0, 0.2);
  leftPress.cutawayCoverPivot.rotation.x = -1.3;
  root.add(leftPress.group);

  const rightPress = buildLoggingPress(materials);
  rightPress.group.position.set(3.1, 0, 0.2);
  rightPress.literalShield.visible = true;
  root.add(rightPress.group);

  const sweepBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.6, 3.0),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.28,
    })
  );
  (sweepBar.material as THREE.MeshToonMaterial).depthWrite = false;
  sweepBar.position.set(0, 2.3, 0.2);
  root.add(sweepBar);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 4.0, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.1, 4.0, 0.25);
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
      leftPress.parserGears.forEach((g, i) => {
        g.rotation.z = timeSec * (2.6 + i);
      });
      return {
        glitchIntensity: 0.24,
        magicDustIntensity: 0.35,
        stasisIntensity: 0.35,
        brakeReleaseBoost: 0.15,
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
