import * as THREE from 'three';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  AMSI_TIMELINE_DURATION_SEC,
  evaluateAmsiChoreography,
} from '../choreography';
import {
  buildAirTubeAndLevitationRig,
  buildCovertTechnician,
  buildPaperTapePrinter,
  buildWarehouseDoorAndScale,
  buildWatchtowerBooth,
  buildWorkshopFloorAndBackdrop,
  buildXRayInspectionTunnel,
} from './scene-builders';
import { buildAmsiStep1Scene } from './step-1-scene';
import { buildAmsiStep2Scene } from './step-2-scene';
import { buildAmsiStep3Scene } from './step-3-scene';
import { buildAmsiStep4Scene } from './step-4-scene';
import { buildAmsiMemoryDiffScene } from './memory-diff-scene';

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * 1) OVERVIEW HERO FILM (`amsi-xray-briefing`)
 * Full 5-Act continuous workshop film matching Director's Blueprint #002.
 */
function buildAmsiBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const room = buildWorkshopFloorAndBackdrop(materials, 0x06b6d4);
  textures.push(...room.textures);
  root.add(room.group);

  const xray = buildXRayInspectionTunnel(materials);
  xray.group.position.set(-3.1, 0, 0.2);
  textures.push(...xray.textures);
  root.add(xray.group);

  const watchtower = buildWatchtowerBooth(materials);
  watchtower.group.position.set(-0.4, 0, -2.7);
  textures.push(...watchtower.textures);
  root.add(watchtower.group);

  const printer = buildPaperTapePrinter(materials);
  printer.group.position.set(-6.1, 4.35, -1.6);
  textures.push(...printer.textures);
  root.add(printer.group);

  const warehouse = buildWarehouseDoorAndScale(materials);
  warehouse.group.position.set(4.1, 0, -0.3);
  textures.push(...warehouse.textures);
  root.add(warehouse.group);

  const levitation = buildAirTubeAndLevitationRig(materials);
  levitation.group.position.set(4.1, 0, -0.1);
  root.add(levitation.group);

  const tech = buildCovertTechnician(materials);
  tech.group.position.set(-4.2, 0, 2.4);
  root.add(tech.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 3.85, 0.5);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 3.25, 0.1);
  root.add(secondaryAnchor);

  let screenShowingAlert = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 5.2, 13.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.2, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 2.2, 0.0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = clamp01(timeSec / AMSI_TIMELINE_DURATION_SEC);
      const s = evaluateAmsiChoreography(t, cutawayMode);

      xray.greenCrate.visible = s.greenCrateVisible;
      xray.greenCrate.position.x = s.greenCrateX + 3.1;

      xray.redCanister.visible = s.redCanisterVisible;
      xray.redCanister.position.x = s.redCanisterX + 3.1;

      xray.dropGate.position.y = 2.86 - s.dropGateClosed * 1.08;

      if (s.xrayAlertLevel > 0.1) {
        xray.scanCurtainMat.color.setHex(0xe11d48);
        xray.scanCurtainMat.opacity = 0.35 + s.xrayAlertLevel * 0.38;
        xray.statusLampMat.color.setHex(0xef4444);
        xray.statusLampMat.emissive.setHex(0xdc2626);
      } else if (s.brassJumperInserted > 0.5) {
        xray.scanCurtainMat.color.setHex(0xf59e0b);
        xray.scanCurtainMat.opacity = 0.18 + s.skipPulseActive * 0.3;
        xray.statusLampMat.color.setHex(0xfacc15);
        xray.statusLampMat.emissive.setHex(0xd97706);
      } else {
        xray.scanCurtainMat.color.setHex(0x06b6d4);
        xray.scanCurtainMat.opacity = 0.28;
        xray.statusLampMat.color.setHex(0x10b981);
        xray.statusLampMat.emissive.setHex(0x059669);
      }

      xray.cutawayHood.position.y = s.cutawayAmount * 1.25;

      tech.group.position.set(s.technicianX, 0, s.technicianZ);
      tech.group.rotation.y = s.technicianFacingY;
      tech.wrenchGroup.visible = s.wrenchVisible;
      tech.rightArmPivot.rotation.z = s.wrenchVisible
        ? 0.35 + Math.sin(s.wrenchTurnAngle * 2) * 0.28
        : 0;
      xray.boltHead.rotation.z = s.wrenchTurnAngle;

      xray.hatchPivot.rotation.y = -s.hatchOpenRad;
      xray.rwxCavityLightMat.opacity = s.rwxUnlockGlow * 0.55;
      if (s.rwxUnlockGlow > 0.25) {
        xray.hatchGlassMat.color.setHex(0xf59e0b);
        xray.hatchGlassMat.emissive.setHex(0xd97706);
        xray.hatchGlassMat.emissiveIntensity = 0.55;
      } else {
        xray.hatchGlassMat.color.setHex(0x38bdf8);
        xray.hatchGlassMat.emissive.setHex(0x0284c7);
        xray.hatchGlassMat.emissiveIntensity = 0.3;
      }

      for (let i = 0; i < xray.copperFuses.length; i += 1) {
        const fuse = xray.copperFuses[i];
        const stagger = clamp01(s.copperFusesExtracted * 1.35 - i * 0.06);
        fuse.position.y = 1.98 + stagger * 1.15;
        fuse.position.z = 0.98 + stagger * 0.55;
        fuse.visible = stagger < 0.96;
      }

      xray.brassJumper.visible = s.brassJumperInserted > 0.02;
      xray.brassJumper.position.y = 2.02 + (1 - s.brassJumperInserted) * 1.05;
      xray.brassJumper.position.z = 1.02 + (1 - s.brassJumperInserted) * 0.65;

      xray.skipOrb.visible = s.skipPulseActive > 0.05;
      xray.skipOrb.position.z = 1.22 + Math.sin(s.skipPulseActive * Math.PI * 3) * 0.42;

      if (s.watchtowerWireLive > 0.1) {
        watchtower.alarmWireMat.color.setHex(0xf59e0b);
        watchtower.alarmWireMat.emissive.setHex(
          s.watchtowerSirenPulse > 0.1 ? 0xef4444 : 0x06b6d4
        );
        watchtower.alarmWireMat.emissiveIntensity =
          0.4 + s.watchtowerSirenPulse * 1.1;
      } else {
        watchtower.alarmWireMat.color.setHex(0x334155);
        watchtower.alarmWireMat.emissive.setHex(0x0f172a);
        watchtower.alarmWireMat.emissiveIntensity = 0;
      }

      watchtower.sirenMat.emissiveIntensity = 0.1 + s.watchtowerSirenPulse * 1.4;
      const shouldAlert = s.watchtowerSirenPulse > 0.08;
      if (shouldAlert !== screenShowingAlert) {
        screenShowingAlert = shouldAlert;
        const mat = watchtower.screenMesh.material as THREE.MeshBasicMaterial;
        mat.map = shouldAlert
          ? watchtower.screenAlertTex
          : watchtower.screenClearTex;
        mat.needsUpdate = true;
      }

      printer.tapeRibbon.scale.y = Math.max(0.04, s.paperTapeLength);
      xray.uvSensorMat.emissiveIntensity = 0.25 + s.uvHingeBeacon * 1.35;
      (xray.uvRing.material as THREE.MeshBasicMaterial).opacity =
        s.uvHingeBeacon * 0.85;
      xray.uvRing.scale.setScalar(1 + s.uvHingeBeacon * 0.45);

      levitation.airTubePartGroup.visible =
        s.airTubeDropProgress > 0.02 && s.airTubeDropProgress < 0.96;
      levitation.airTubePartGroup.position.y = 5.2 - s.airTubeDropProgress * 3.0;

      levitation.droneGroup.visible = s.airTubeDropProgress > 0.65;
      levitation.droneGroup.position.y = s.droneHoverY;
      levitation.droneGroup.rotation.y = s.droneSpinRad;
      levitation.droneGearRing.rotation.z = -s.droneSpinRad * 1.6;

      const spread = (1 - s.droneAssemblyProgress) * 1.15;
      for (let i = 0; i < levitation.droneParts.length; i += 1) {
        const angle = (i * Math.PI) / 2;
        const dist = 0.56 + spread;
        levitation.droneParts[i].position.set(
          Math.cos(angle) * dist,
          Math.sin(s.t * 14 + i) * spread * 0.2,
          Math.sin(angle) * dist
        );
        levitation.droneParts[i].rotation.y = -angle;
      }

      return {
        glitchIntensity: s.rwxUnlockGlow * 0.35 + s.xrayAlertLevel * 0.4,
        magicDustIntensity: s.droneAssemblyProgress * 0.55 + s.uvHingeBeacon * 0.35,
        stasisIntensity: 0,
        brakeReleaseBoost: s.skipPulseActive * 0.45,
      };
    },
    dispose: () => {
      textures.forEach((tex) => tex.dispose());
    },
  };
}

export function buildBespokeAmsiSectionScene(
  sceneKind: Anime3DSceneKind,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'amsi-xray-briefing':
      return buildAmsiBriefingScene(materials);
    case 'amsi-step1-lookup':
      return buildAmsiStep1Scene(materials);
    case 'amsi-step2-protect':
      return buildAmsiStep2Scene(materials);
    case 'amsi-step3-patch':
      return buildAmsiStep3Scene(materials);
    case 'amsi-step4-reflective':
      return buildAmsiStep4Scene(materials);
    case 'amsi-memory-diff':
      return buildAmsiMemoryDiffScene(materials);
    default:
      return buildAmsiBriefingScene(materials);
  }
}
