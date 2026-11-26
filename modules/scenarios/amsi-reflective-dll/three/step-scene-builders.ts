import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
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
  createContactShadowDisc,
  createWorkshopSignTexture,
} from './scene-builders';

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

function easeInOutQuad(x: number): number {
  const c = clamp01(x);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
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

  // Left-Center: Automated X-Ray Inspection Chamber
  const xray = buildXRayInspectionTunnel(materials);
  xray.group.position.set(-3.1, 0, 0.2);
  textures.push(...xray.textures);
  root.add(xray.group);

  // Center-Back Elevated: Watchtower Security Booth (`z = -2.8`)
  const watchtower = buildWatchtowerBooth(materials);
  watchtower.group.position.set(-0.4, 0, -2.7);
  textures.push(...watchtower.textures);
  root.add(watchtower.group);

  // Overhead Left: Mechanical Paper-Tape Printer (`EID 4104`)
  const printer = buildPaperTapePrinter(materials);
  printer.group.position.set(-6.1, 4.35, -1.6);
  textures.push(...printer.textures);
  root.add(printer.group);

  // Right Zone: Sealed Warehouse Door + 0.0 kg Digital Floor Scale
  const warehouse = buildWarehouseDoorAndScale(materials);
  warehouse.group.position.set(4.1, 0, -0.3);
  textures.push(...warehouse.textures);
  root.add(warehouse.group);

  // Right Mid-Air Zone: Overhead Pneumatic Air-Tube + Floating Levitation Ring + Drone
  const levitation = buildAirTubeAndLevitationRig(materials);
  levitation.group.position.set(4.1, 0, -0.1);
  root.add(levitation.group);

  // Covert Technician inside the exact same workshop room
  const tech = buildCovertTechnician(materials);
  tech.group.position.set(-4.2, 0, 2.4);
  root.add(tech.group);

  // Floating callout anchors
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

      // Act 1 parcels & drop-gate
      xray.greenCrate.visible = s.greenCrateVisible;
      xray.greenCrate.position.x = s.greenCrateX + 3.1;

      xray.redCanister.visible = s.redCanisterVisible;
      xray.redCanister.position.x = s.redCanisterX + 3.1;

      xray.dropGate.position.y = 2.86 - s.dropGateClosed * 1.08;

      // Scan laser color (cyan normal -> crimson threat -> amber skip)
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

      // Cutaway hood lifts cleanly to expose upper scan chamber & fuse bay
      xray.cutawayHood.position.y = s.cutawayAmount * 1.25;

      // Technician motion & Brass Master Wrench bolt turn
      tech.group.position.set(s.technicianX, 0, s.technicianZ);
      tech.group.rotation.y = s.technicianFacingY;
      tech.wrenchGroup.visible = s.wrenchVisible;
      tech.rightArmPivot.rotation.z = s.wrenchVisible
        ? 0.35 + Math.sin(s.wrenchTurnAngle * 2) * 0.28
        : 0;
      xray.boltHead.rotation.z = s.wrenchTurnAngle;

      // Hinged Blue Glass Safety Hatch (0..105 deg) + amber RWX unlock cavity
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

      // 6 Copper Fuses lift out smoothly, 6-Pin Brass Jumper drops into slots 1..6
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

      // SKIP bounce orb in Act 4 proving rigged jumper bounces scans locally
      xray.skipOrb.visible = s.skipPulseActive > 0.05;
      xray.skipOrb.position.z = 1.22 + Math.sin(s.skipPulseActive * Math.PI * 3) * 0.42;

      // Watchtower wire power, siren & screen state
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

      // Forensic witnesses: Paper-tape EID 4104 ribbon & Violet UV hinge sensor
      printer.tapeRibbon.scale.y = Math.max(0.04, s.paperTapeLength);
      xray.uvSensorMat.emissiveIntensity = 0.25 + s.uvHingeBeacon * 1.35;
      (xray.uvRing.material as THREE.MeshBasicMaterial).opacity =
        s.uvHingeBeacon * 0.85;
      xray.uvRing.scale.setScalar(1 + s.uvHingeBeacon * 0.45);

      // Act 4 & 5: Overhead pneumatic air-tube drop + hovering mid-air drone assembly
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

/**
 * 2) STEP #1 DIORAMA (`amsi-step1-lookup`)
 * Macro Workshop Desk + Brass Address Magnifier locating `0x7FF9C2142840` + Paper-Tape Printer (`EID 4104`).
 */
function buildStep1LookupScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const room = buildWorkshopFloorAndBackdrop(materials, 0x38bdf8);
  textures.push(...room.textures);
  root.add(room.group);

  // Workbench pedestal holding scaled-up X-Ray Serial Blueprint Plaque
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 1.35, 2.8),
    materials.createToonMaterial(0x1e293b)
  );
  bench.position.set(-0.6, 0.675, 0);
  bench.castShadow = true;
  addAnimeInkEdges(bench, materials.inkLineMaterial, 26);
  root.add(bench);
  root.add(createContactShadowDisc(materials, 3.4, 1.8));

  const plaqueTex = createWorkshopSignTexture(
    'AMSI.DLL · EXPORT PLAQUE',
    'AmsiScanBuffer @ 0x7FF9C2142840',
    '#0F172A',
    '#F59E0B',
    '#FEF08A',
    '#38BDF8'
  );
  textures.push(plaqueTex);
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1.3),
    new THREE.MeshBasicMaterial({ map: plaqueTex })
  );
  plaque.position.set(-0.6, 1.42, 0.1);
  plaque.rotation.x = -Math.PI / 2 + 0.25;
  root.add(plaque);

  // Articulated Brass Magnifier Gantry scanning across plaque
  const magnifier = new THREE.Group();
  const lensRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.1, 10, 28),
    materials.createToonMaterial(0xd97706, { emissive: 0xb45309, emissiveIntensity: 0.35 })
  );
  lensRing.rotation.x = Math.PI / 2;
  magnifier.add(lensRing);

  const lensGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.06, 24),
    materials.createToonMaterial(0x38bdf8, { transparent: true, opacity: 0.35 })
  );
  magnifier.add(lensGlass);

  const laserBeamMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const laserCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.2, 0.9, 20, 1, true),
    laserBeamMat
  );
  laserCone.position.y = -0.45;
  magnifier.add(laserCone);
  magnifier.position.set(-2.4, 2.55, 0.1);
  root.add(magnifier);

  // Overhead Paper-Tape Printer (`EID 4104`) clearly visible on right
  const printer = buildPaperTapePrinter(materials);
  printer.group.position.set(3.8, 3.5, -0.6);
  printer.group.scale.setScalar(1.25);
  textures.push(...printer.textures);
  root.add(printer.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.6, 3.2, 0.1);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.8, 4.2, -0.6);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.8, 4.6, 8.8),
    defaultCameraTarget: new THREE.Vector3(0.4, 1.9, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.6, 2.2, 0.1),
    update: (timeSec) => {
      const p = clamp01(timeSec / 12);
      const sweep = easeInOutQuad(clamp01(p * 1.4));
      magnifier.position.x = -2.4 + sweep * 1.9;
      magnifier.position.y = 2.55 + Math.sin(timeSec * 3) * 0.06;
      const locked = p > 0.62;
      laserBeamMat.color.setHex(locked ? 0xf59e0b : 0x06b6d4);
      printer.tapeRibbon.scale.y = Math.max(0.08, easeOutCubic(p));
      return {
        glitchIntensity: locked ? 0.2 : 0,
        magicDustIntensity: 0.35,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      textures.forEach((t) => t.dispose());
    },
  };
}

/**
 * 3) STEP #2 DIORAMA (`amsi-step2-protect`)
 * Macro Mechanical Lock Chamber: Brass Wrench turning hex bolt, blue RX glass hatch swinging 105 deg,
 * amber RWX floodlight, and violet UV hinge crack sensor (`EtwTiLogProtectVM`).
 */
function buildStep2ProtectScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const room = buildWorkshopFloorAndBackdrop(materials, 0xf59e0b);
  textures.push(...room.textures);
  root.add(room.group);

  const xray = buildXRayInspectionTunnel(materials);
  xray.group.scale.setScalar(1.38);
  xray.group.position.set(0, 0, -0.4);
  xray.greenCrate.visible = false;
  xray.redCanister.visible = false;
  textures.push(...xray.textures);
  root.add(xray.group);

  const tech = buildCovertTechnician(materials);
  tech.group.position.set(2.85, 0, 2.0);
  tech.group.rotation.y = -0.65;
  tech.group.scale.setScalar(1.15);
  root.add(tech.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0.3, 3.7, 1.1);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-1.9, 4.1, 1.1);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(1.6, 3.8, 7.6),
    defaultCameraTarget: new THREE.Vector3(-0.2, 2.5, 0.5),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.6, 1.0),
    update: (timeSec, _phase, _isDark, cutawayMode) => {
      const p = clamp01(timeSec / 12);
      const wrenchP = easeInOutQuad(clamp01(p / 0.45));
      const openP = easeOutCubic(clamp01((p - 0.32) / 0.42));

      xray.boltHead.rotation.z = wrenchP * Math.PI * 2;
      tech.rightArmPivot.rotation.z = 0.25 + Math.sin(wrenchP * Math.PI * 4) * 0.35;
      xray.hatchPivot.rotation.y = -openP * ((105 * Math.PI) / 180);
      xray.rwxCavityLightMat.opacity = openP * 0.7;

      const isUnlocked = openP > 0.2;
      xray.hatchGlassMat.color.setHex(isUnlocked ? 0xf59e0b : 0x38bdf8);
      xray.hatchGlassMat.emissive.setHex(isUnlocked ? 0xd97706 : 0x0284c7);
      xray.hatchGlassMat.emissiveIntensity = isUnlocked ? 0.65 : 0.32;

      const uvPulse = openP > 0.1 ? 0.55 + 0.45 * Math.sin(timeSec * 8) : 0;
      xray.uvSensorMat.emissiveIntensity = 0.25 + uvPulse * 1.4;
      (xray.uvRing.material as THREE.MeshBasicMaterial).opacity = uvPulse * 0.9;
      xray.uvRing.scale.setScalar(1 + uvPulse * 0.55);

      const cut = cutawayMode === 'SEALED' ? 0 : cutawayMode === 'OPEN' ? 1 : openP * 0.6;
      xray.cutawayHood.position.y = cut * 1.1;

      return {
        glitchIntensity: openP * 0.38,
        magicDustIntensity: uvPulse * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      textures.forEach((t) => t.dispose());
    },
  };
}

/**
 * 4) STEP #3 DIORAMA (`amsi-step3-patch`)
 * Macro 6-Pin Fuse Rack Cutaway: 6 copper fuses lift out, 6-pin Brass U-Jumper locks in,
 * overhead Watchtower alarm wire dies, SKIP bounce triggers, and glass hatch re-locks.
 */
function buildStep3PatchScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const room = buildWorkshopFloorAndBackdrop(materials, 0xe11d48);
  textures.push(...room.textures);
  root.add(room.group);

  const xray = buildXRayInspectionTunnel(materials);
  xray.group.scale.setScalar(1.42);
  xray.group.position.set(-0.5, 0, 0);
  xray.greenCrate.visible = false;
  xray.redCanister.visible = false;
  textures.push(...xray.textures);
  root.add(xray.group);

  const watchtower = buildWatchtowerBooth(materials);
  watchtower.group.position.set(3.4, 0, -2.9);
  textures.push(...watchtower.textures);
  root.add(watchtower.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.5, 3.4, 1.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 4.9, -2.4);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.3, 3.6, 7.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.7, 0.5),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.5, 2.8, 1.2),
    update: (timeSec, _phase, _isDark, cutawayMode) => {
      const p = clamp01(timeSec / 12);
      const pullP = easeInOutQuad(clamp01(p / 0.36));
      const seatP = easeOutCubic(clamp01((p - 0.34) / 0.30));
      const relockP = easeInOutQuad(clamp01((p - 0.72) / 0.22));
      const skipP = p > 0.62 ? Math.sin(((p - 0.62) / 0.38) * Math.PI * 3) * 0.5 + 0.5 : 0;

      const hatchAngle = (1 - relockP) * ((105 * Math.PI) / 180);
      xray.hatchPivot.rotation.y = -hatchAngle;
      xray.rwxCavityLightMat.opacity = (1 - relockP) * 0.55;
      xray.hatchGlassMat.color.setHex(relockP > 0.65 ? 0x38bdf8 : 0xf59e0b);

      for (let i = 0; i < xray.copperFuses.length; i += 1) {
        const st = clamp01(pullP * 1.35 - i * 0.06);
        xray.copperFuses[i].position.y = 1.98 + st * 1.15;
        xray.copperFuses[i].position.z = 0.98 + st * 0.55;
        xray.copperFuses[i].visible = st < 0.95;
      }

      xray.brassJumper.visible = seatP > 0.02;
      xray.brassJumper.position.y = 2.02 + (1 - seatP) * 1.1;
      xray.brassJumper.position.z = 1.02 + (1 - seatP) * 0.6;

      xray.skipOrb.visible = seatP > 0.85;
      xray.skipOrb.position.z = 1.24 + skipP * 0.48;

      const wireLive = seatP < 0.85;
      watchtower.alarmWireMat.color.setHex(wireLive ? 0xf59e0b : 0x334155);
      watchtower.alarmWireMat.emissive.setHex(wireLive ? 0x06b6d4 : 0x0f172a);
      watchtower.alarmWireMat.emissiveIntensity = wireLive ? 0.65 : 0;

      const cut = cutawayMode === 'SEALED' ? 0 : cutawayMode === 'OPEN' ? 1 : 0.85;
      xray.cutawayHood.position.y = cut * 1.2;

      return {
        glitchIntensity: seatP > 0.2 && seatP < 0.9 ? 0.35 : 0,
        magicDustIntensity: skipP * 0.4,
        stasisIntensity: 0,
        brakeReleaseBoost: seatP > 0.85 ? 0.4 : 0,
      };
    },
    dispose: () => {
      textures.forEach((t) => t.dispose());
    },
  };
}

/**
 * 5) STEP #4 DIORAMA (`amsi-step4-reflective`)
 * Split Zero-Disk Chamber: Padlocked Warehouse Door & `0.0 kg` Digital Floor Scale
 * contrasted directly beneath the Overhead Pneumatic Air-Tube & Mid-Air Hovering Clockwork Drone.
 */
function buildStep4ReflectiveScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const room = buildWorkshopFloorAndBackdrop(materials, 0xa855f7);
  textures.push(...room.textures);
  root.add(room.group);

  const warehouse = buildWarehouseDoorAndScale(materials);
  warehouse.group.position.set(-2.3, 0, -0.2);
  warehouse.group.scale.setScalar(1.12);
  textures.push(...warehouse.textures);
  root.add(warehouse.group);

  const levitation = buildAirTubeAndLevitationRig(materials);
  levitation.group.position.set(2.3, 0, 0.2);
  levitation.group.scale.setScalar(1.18);
  root.add(levitation.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(2.3, 3.6, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-2.3, 2.3, -0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 4.1, 9.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.1, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(2.3, 2.4, 0.2),
    update: (timeSec) => {
      const p = clamp01(timeSec / 12);
      const dropP = easeOutCubic(clamp01(p / 0.4));
      const snapP = easeInOutQuad(clamp01((p - 0.32) / 0.46));

      levitation.airTubePartGroup.visible = dropP > 0.02 && dropP < 0.96;
      levitation.airTubePartGroup.position.y = 5.2 - dropP * 3.0;

      levitation.droneGroup.visible = p > 0.28;
      levitation.droneGroup.position.y = 2.18 + Math.sin(timeSec * 3.4) * 0.14;
      levitation.droneGroup.rotation.y = timeSec * 1.4;
      levitation.droneGearRing.rotation.z = -timeSec * 2.2;

      const spread = (1 - snapP) * 1.25;
      for (let i = 0; i < levitation.droneParts.length; i += 1) {
        const angle = (i * Math.PI) / 2;
        const dist = 0.56 + spread;
        levitation.droneParts[i].position.set(
          Math.cos(angle) * dist,
          Math.sin(timeSec * 4 + i) * spread * 0.2,
          Math.sin(angle) * dist
        );
        levitation.droneParts[i].rotation.y = -angle;
      }

      return {
        glitchIntensity: 0,
        magicDustIntensity: 0.45 + snapP * 0.35,
        stasisIntensity: 0,
        brakeReleaseBoost: snapP * 0.4,
      };
    },
    dispose: () => {
      textures.forEach((t) => t.dispose());
    },
  };
}

/**
 * 6) MEMORY FORENSICS DIORAMA (`amsi-memory-diff`)
 * Dual-Plinth Forensic Comparison Bench:
 * Left Plinth = Clean On-Disk `amsi.dll` Vault Cassette (`4C 8B DC 49 89 5B` 6 copper pins)
 * Right Plinth = Live Dirty CoW RAM Block (`B8 57 00 07 80 C3` brass jumper) + Unbacked Floating Ring (`0x000001E4A2100000`)
 */
function buildMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const room = buildWorkshopFloorAndBackdrop(materials, 0x10b981);
  textures.push(...room.textures);
  root.add(room.group);

  const plinthMat = materials.createToonMaterial(0x1e293b);
  const copperMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x06b6d4,
    emissiveIntensity: 0.75,
  });
  const brassMat = materials.createToonMaterial(0xfacc15, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.65,
  });

  // Left Plinth: Clean On-Disk amsi.dll Cassette (6 intact copper fuses)
  const leftPlinth = new THREE.Group();
  leftPlinth.position.set(-3.4, 0, 0.2);
  leftPlinth.add(createContactShadowDisc(materials, 1.9, 1.3));

  const lBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.25, 2.0), plinthMat);
  lBase.position.y = 0.625;
  addAnimeInkEdges(lBase, materials.inkLineMaterial, 26);
  leftPlinth.add(lBase);

  const lSignTex = createWorkshopSignTexture(
    'ON-DISK AMSI.DLL (CLEAN)',
    '4C 8B DC 49 89 5B · SIGNED SEC_IMAGE',
    '#052E16',
    '#10B981',
    '#ECFDF5',
    '#6EE7B7'
  );
  textures.push(lSignTex);
  const lSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 0.75),
    new THREE.MeshBasicMaterial({ map: lSignTex })
  );
  lSign.position.set(0, 0.65, 1.02);
  leftPlinth.add(lSign);

  for (let i = 0; i < 6; i += 1) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.82, 12), copperMat);
    pin.position.set(-1.0 + i * 0.4, 1.72, 0);
    addInvertedHullOutline(pin, materials.inkOutlineMaterial, 1.07);
    leftPlinth.add(pin);
  }
  root.add(leftPlinth);

  // Center-Right Plinth: Dirty CoW Live RAM Block (6-Pin Brass Jumper `B8 57 00 07 80 C3`)
  const rightPlinth = new THREE.Group();
  rightPlinth.position.set(0.7, 0, 0.2);
  rightPlinth.add(createContactShadowDisc(materials, 1.9, 1.3));

  const rBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.25, 2.0), plinthMat);
  rBase.position.y = 0.625;
  addAnimeInkEdges(rBase, materials.inkLineMaterial, 26);
  rightPlinth.add(rBase);

  const rSignTex = createWorkshopSignTexture(
    'LIVE RAM CoW DIRTY PAGE',
    'B8 57 00 07 80 C3 · E_INVALIDARG',
    '#450A0A',
    '#F59E0B',
    '#FEF08A',
    '#FCA5A5'
  );
  textures.push(rSignTex);
  const rSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 0.75),
    new THREE.MeshBasicMaterial({ map: rSignTex })
  );
  rSign.position.set(0, 0.65, 1.02);
  rightPlinth.add(rSign);

  const jumperBar = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.34, 0.34), brassMat);
  jumperBar.position.set(0, 2.02, 0);
  addAnimeInkEdges(jumperBar, materials.inkLineMaterial, 24);
  rightPlinth.add(jumperBar);
  for (let i = 0; i < 6; i += 1) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.56, 10), brassMat);
    p.position.set(-1.0 + i * 0.4, 1.56, 0);
    rightPlinth.add(p);
  }
  root.add(rightPlinth);

  // Far-Right: Floating Unbacked MEM_PRIVATE RWX Levitation Ring (0x000001E4A2100000, ZERO floor tether!)
  const levitation = buildAirTubeAndLevitationRig(materials);
  levitation.group.position.set(4.5, 0, 0.1);
  levitation.droneGroup.visible = true;
  root.add(levitation.group);

  // Sweeping red/emerald Forensic Comparison Laser Bar
  const diffScanner = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 2.4, 2.2),
    new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    })
  );
  diffScanner.position.set(-1.35, 1.85, 0.2);
  root.add(diffScanner);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.1, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.5, 3.4, 0.1);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.6, 4.4, 10.6),
    defaultCameraTarget: new THREE.Vector3(0.6, 1.9, 0.1),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.7, 2.2, 0.2),
    update: (timeSec) => {
      diffScanner.position.x = -3.4 + (Math.sin(timeSec * 1.35) * 0.5 + 0.5) * 4.1;
      levitation.droneGroup.position.y = 2.18 + Math.sin(timeSec * 3.0) * 0.15;
      levitation.droneGroup.rotation.y = timeSec * 1.2;
      levitation.droneGearRing.rotation.z = -timeSec * 1.9;
      for (let i = 0; i < levitation.droneParts.length; i += 1) {
        const angle = (i * Math.PI) / 2;
        levitation.droneParts[i].position.set(Math.cos(angle) * 0.56, 0, Math.sin(angle) * 0.56);
        levitation.droneParts[i].rotation.y = -angle;
      }
      return {
        glitchIntensity: 0.24,
        magicDustIntensity: 0.42,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      textures.forEach((t) => t.dispose());
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
      return buildStep1LookupScene(materials);
    case 'amsi-step2-protect':
      return buildStep2ProtectScene(materials);
    case 'amsi-step3-patch':
      return buildStep3PatchScene(materials);
    case 'amsi-step4-reflective':
      return buildStep4ReflectiveScene(materials);
    case 'amsi-memory-diff':
      return buildMemoryDiffScene(materials);
    default:
      return buildAmsiBriefingScene(materials);
  }
}
