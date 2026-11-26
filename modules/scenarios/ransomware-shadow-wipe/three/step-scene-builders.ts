import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  LOCKBIT_TIMELINE_DURATION_SEC,
  evaluateLockbitChoreography,
} from '../choreography';
import {
  buildArchiveHallFloorAndBackdrop,
  buildBackupReelRackAndShredder,
  buildFourVaultFilingWallAndGantry,
  buildGlassEntranceAndRansomPress,
  buildPsExecDispatchHatch,
} from './scene-builders';

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

const CLEAN_HEADER_COLOR = new THREE.Color(0xe0f2fe);
const LOCKED_HEADER_COLOR = new THREE.Color(0xdc2626);
const TEMP_COLOR = new THREE.Color();

/**
 * 1) OVERVIEW HERO FILM (`lockbit-archive-briefing`)
 * Full 5-Act Municipal Records Vault & Archival Backup Reel Room film.
 */
function buildLockbitBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildArchiveHallFloorAndBackdrop(materials, 0xdc2626);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  // Far-Left: Remote PsExec Service Dispatch Hatch
  const hatch = buildPsExecDispatchHatch(materials);
  hatch.group.position.set(-6.4, 0, -0.3);
  textures.push(...hatch.textures);
  root.add(hatch.group);

  // Left-Center: 4 Silver Backup Reels + Twin-Roller Industrial Shredder + Green Recovery Lever
  const backupRig = buildBackupReelRackAndShredder(materials);
  backupRig.group.position.set(-3.1, 0, 0.15);
  textures.push(...backupRig.textures);
  root.add(backupRig.group);

  // Center-Right: 4 Parallel Glass Filing Vaults + 4 Overhead IOCP Stamping Arms + Crimson Padlocks
  const vaults = buildFourVaultFilingWallAndGantry(materials);
  vaults.group.position.set(2.05, 0, 0.15);
  textures.push(...vaults.textures);
  root.add(vaults.group);

  // Far-Right: Frosted Glass Entrance Door + Ransom Placard Press + Wall Display
  const entrance = buildGlassEntranceAndRansomPress(materials);
  entrance.group.position.set(6.55, 0, -0.2);
  textures.push(...entrance.textures);
  root.add(entrance.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 3.45, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.05, 3.85, 0.25);
  root.add(secondaryAnchor);

  const reelStartPos: [number, number][] = [
    [-1.3, 2.48],
    [-0.1, 2.48],
    [-1.3, 1.38],
    [-0.1, 1.38],
  ];

  let showingAuditAlert = false;
  let showingRansomWall = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 5.4, 14.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.2, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.1, 0.2),
    update: (
      timeSec,
      _phaseIndex,
      _isDark,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const norm = (timeSec % LOCKBIT_TIMELINE_DURATION_SEC) / LOCKBIT_TIMELINE_DURATION_SEC;
      const f = evaluateLockbitChoreography(norm, cutawayMode);

      // Act 2: PsExec Capsule & SYSTEM Master Breaker
      hatch.capsule.position.x = -2.3 + f.capsuleProgress * 1.45;
      hatch.breakerPivot.rotation.x = f.breakerDown * 2.1;
      hatch.statusLampMat.color.setHex(f.breakerDown > 0.5 ? 0xf59e0b : 0x10b981);

      // Act 3: 4 Silver Backup Reels spin then drop into Twin-Roller Shredder
      for (let i = 0; i < 4; i += 1) {
        const p = f.reelShredProgress[i];
        const reel = backupRig.reels[i];
        const [sx, sy] = reelStartPos[i];
        if (p < 0.01) {
          reel.visible = true;
          reel.position.set(sx, sy, -0.18);
          reel.scale.setScalar(1);
          reel.rotation.z = timeSec * (1.2 + i * 0.15);
        } else if (p < 0.98) {
          reel.visible = true;
          const arcX = sx + (1.25 - sx) * easeOutCubic(p);
          const arcY = sy + Math.sin(p * Math.PI) * 0.7 - p * (sy - 1.36);
          reel.position.set(arcX, arcY, -0.18 + p * 0.28);
          const shrink = Math.max(0.15, 1 - Math.max(0, (p - 0.55) / 0.45));
          reel.scale.setScalar(shrink);
          reel.rotation.z = timeSec * 8;
        } else {
          reel.visible = false;
        }
      }

      // Shredder cutters & ribbon confetti heap (deterministic angle from timeSec)
      const shredAngle = timeSec * (2.4 + f.shredderSpin * 6.0);
      backupRig.shredderRollers[0].rotation.x = shredAngle;
      backupRig.shredderRollers[1].rotation.x = -shredAngle;
      const hScale = Math.max(0.01, f.ribbonHeapLevel);
      backupRig.ribbonHeap.scale.set(hScale, hScale, hScale);
      (backupRig.shredderHood.material as THREE.MeshToonMaterial).opacity =
        0.72 - f.cutawayOpen * 0.54;

      // Green Recovery Lever snaps cleanly off
      const snapped = f.recoveryLeverSnapped > 0.55;
      backupRig.recoveryLeverIntact.visible = !snapped;
      backupRig.recoveryLeverIntact.rotation.z = -f.recoveryLeverSnapped * 1.1;
      backupRig.recoveryLeverBroken.visible = snapped;
      backupRig.backupLampMat.color.setHex(f.ribbonHeapLevel > 0.2 ? 0xdc2626 : 0x10b981);

      // Act 4: 4 Parallel IOCP Stamping Arms scorch ONLY top 15% header band + snap crimson padlocks
      for (let i = 0; i < 4; i += 1) {
        const plunge = f.gantryArmPlunge[i];
        vaults.gantryArms[i].position.y = 3.68 - plunge * 0.88;

        TEMP_COLOR.copy(CLEAN_HEADER_COLOR).lerp(
          LOCKED_HEADER_COLOR,
          f.ledgerHeaderLocked[i]
        );
        vaults.ledgerHeaderMats[i].color.copy(TEMP_COLOR);

        const doorMat = vaults.glassDoors[i].material as THREE.MeshToonMaterial;
        doorMat.opacity = 0.36 - f.cutawayOpen * 0.24;

        const pScale = Math.max(0.01, easeOutCubic(f.padlockShut[i]));
        vaults.padlocks[i].scale.setScalar(pScale);
        vaults.padlocks[i].position.y = 1.65 - easeOutCubic(f.padlockShut[i]) * 0.49;
      }

      // Act 5: Ransom placard bolted to glass entrance + crimson wallpaper flip + violet EID 1102 beacon
      const rScale = Math.max(0.01, easeOutCubic(f.ransomPlacardBolted));
      entrance.placardGroup.scale.setScalar(rScale);
      entrance.placardGroup.position.z = 0.85 - easeOutCubic(f.ransomPlacardBolted) * 0.72;
      entrance.pressArm.rotation.y = -f.ransomPlacardBolted * 0.65;

      const wantRansomWall = f.wallpaperCrimson > 0.45;
      if (wantRansomWall !== showingRansomWall) {
        showingRansomWall = wantRansomWall;
        entrance.monitorMat.map = wantRansomWall
          ? entrance.monitorRansomTex
          : entrance.monitorNormalTex;
        entrance.monitorMat.needsUpdate = true;
      }

      if (f.auditWipeAlarmActive !== showingAuditAlert) {
        showingAuditAlert = f.auditWipeAlarmActive;
        backdrop.auditScreenMat.map = f.auditWipeAlarmActive
          ? backdrop.auditAlertTex
          : backdrop.auditNormalTex;
        backdrop.auditScreenMat.needsUpdate = true;
      }
      backdrop.auditBeaconMat.color.setHex(
        f.auditWipeAlarmActive
          ? 0xa855f7
          : f.auditBeaconLevel > 0.3
            ? 0xf59e0b
            : 0x10b981
      );

      return {
        glitchIntensity: f.shredderSpin * 0.25 + (f.auditWipeAlarmActive ? 0.32 : 0),
        magicDustIntensity: Math.max(...f.gantryArmPlunge) * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: f.breakerDown * 0.3,
      };
    },
    dispose: () => {
      textures.forEach((t) => t.dispose());
    },
  };
}

/**
 * 2) STEP #1 DIORAMA (`lockbit-step1-psexec`)
 * Macro Remote Service Dispatch Hatch & SYSTEM Master Breaker Bay.
 */
function buildLockbitStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildArchiveHallFloorAndBackdrop(materials, 0xf59e0b);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const hatch = buildPsExecDispatchHatch(materials);
  hatch.group.position.set(0.2, 0, 0.2);
  hatch.group.scale.setScalar(1.38);
  textures.push(...hatch.textures);
  root.add(hatch.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.2, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.2, 3.5, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.4, 3.6, 8.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.1, 0.3),
    update: (timeSec) => {
      const cycle = (timeSec % 12) / 12;
      const capP = clamp01((cycle - 0.1) / 0.35);
      const brkP = clamp01((cycle - 0.42) / 0.25);
      hatch.capsule.position.x = -2.3 + easeOutCubic(capP) * 1.45;
      hatch.breakerPivot.rotation.x = easeOutCubic(brkP) * 2.1;
      hatch.statusLampMat.color.setHex(brkP > 0.5 ? 0xf59e0b : 0x10b981);
      backdrop.auditBeaconMat.color.setHex(brkP > 0.5 ? 0xf59e0b : 0x10b981);
      return {
        glitchIntensity: brkP * 0.22,
        magicDustIntensity: capP * 0.28,
        stasisIntensity: 0,
        brakeReleaseBoost: brkP * 0.35,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 3) STEP #2 DIORAMA (`lockbit-step2-vsswipe`)
 * Macro Twin-Roller Backup Reel Shredder & Snapping Green Recovery Lever.
 */
function buildLockbitStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildArchiveHallFloorAndBackdrop(materials, 0xea580c);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const backupRig = buildBackupReelRackAndShredder(materials);
  backupRig.group.position.set(0.2, 0, 0.2);
  backupRig.group.scale.setScalar(1.22);
  textures.push(...backupRig.textures);
  root.add(backupRig.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.6, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.8, 3.0, 0.2);
  root.add(secondaryAnchor);

  const reelStartPos: [number, number][] = [
    [-1.3, 2.48],
    [-0.1, 2.48],
    [-1.3, 1.38],
    [-0.1, 1.38],
  ];

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.3, 3.8, 8.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.6, 1.9, 0.2),
    update: (
      timeSec,
      _phaseIndex,
      _isDark,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const cycle = (timeSec % 14) / 14;
      for (let i = 0; i < 4; i += 1) {
        const p = clamp01((cycle - (0.08 + i * 0.14)) / 0.24);
        const reel = backupRig.reels[i];
        const [sx, sy] = reelStartPos[i];
        if (p < 0.01) {
          reel.visible = true;
          reel.position.set(sx, sy, -0.18);
          reel.scale.setScalar(1);
          reel.rotation.z = timeSec * 1.4;
        } else if (p < 0.98) {
          reel.visible = true;
          reel.position.set(
            sx + (1.25 - sx) * easeOutCubic(p),
            sy + Math.sin(p * Math.PI) * 0.65 - p * (sy - 1.36),
            -0.18 + p * 0.28
          );
          reel.scale.setScalar(Math.max(0.15, 1 - Math.max(0, (p - 0.55) / 0.45)));
          reel.rotation.z = timeSec * 9;
        } else {
          reel.visible = false;
        }
      }

      backupRig.shredderRollers[0].rotation.x = timeSec * 6.4;
      backupRig.shredderRollers[1].rotation.x = -timeSec * 6.4;
      const heap = clamp01((cycle - 0.18) / 0.55);
      backupRig.ribbonHeap.scale.setScalar(Math.max(0.01, heap));
      const snap = clamp01((cycle - 0.64) / 0.18);
      backupRig.recoveryLeverIntact.visible = snap < 0.55;
      backupRig.recoveryLeverIntact.rotation.z = -snap * 1.1;
      backupRig.recoveryLeverBroken.visible = snap >= 0.55;
      backupRig.backupLampMat.color.setHex(heap > 0.2 ? 0xdc2626 : 0x10b981);
      (backupRig.shredderHood.material as THREE.MeshToonMaterial).opacity =
        cutawayMode === 'SEALED' ? 0.78 : 0.22;

      return {
        glitchIntensity: 0.26,
        magicDustIntensity: 0.35,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 4) STEP #3 DIORAMA (`lockbit-step3-iocp`)
 * Macro 4-Lane IOCP Stamping Wall & Head-Only Ledger Encryption Cutaway.
 */
function buildLockbitStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildArchiveHallFloorAndBackdrop(materials, 0xdc2626);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const vaults = buildFourVaultFilingWallAndGantry(materials);
  vaults.group.position.set(0, 0, 0.2);
  vaults.group.scale.setScalar(1.18);
  textures.push(...vaults.textures);
  root.add(vaults.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.5, 4.1, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.6, 2.8, 0.6);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 3.6, 8.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.3),
    update: (
      timeSec,
      _phaseIndex,
      _isDark,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const cycle = (timeSec % 14) / 14;
      for (let i = 0; i < 4; i += 1) {
        const start = 0.08 + i * 0.08;
        const plunge =
          cycle >= start && cycle <= start + 0.32
            ? Math.sin(((cycle - start) / 0.32) * Math.PI)
            : 0;
        vaults.gantryArms[i].position.y = 3.68 - plunge * 0.88;

        const locked = clamp01((cycle - (start + 0.1)) / 0.14);
        TEMP_COLOR.copy(CLEAN_HEADER_COLOR).lerp(LOCKED_HEADER_COLOR, locked);
        vaults.ledgerHeaderMats[i].color.copy(TEMP_COLOR);

        const pad = clamp01((cycle - (0.48 + i * 0.07)) / 0.16);
        vaults.padlocks[i].scale.setScalar(Math.max(0.01, easeOutCubic(pad)));
        vaults.padlocks[i].position.y = 1.65 - easeOutCubic(pad) * 0.49;

        (vaults.glassDoors[i].material as THREE.MeshToonMaterial).opacity =
          cutawayMode === 'SEALED' ? 0.44 : 0.14;
      }
      return {
        glitchIntensity: 0.24,
        magicDustIntensity: 0.42,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 5) STEP #4 DIORAMA (`lockbit-step4-ransomnote`)
 * Glass Entrance Placard Press, Crimson Wallpaper Flip & Violet EID 1102 Audit Flare.
 */
function buildLockbitStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildArchiveHallFloorAndBackdrop(materials, 0x7c3aed);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const entrance = buildGlassEntranceAndRansomPress(materials);
  entrance.group.position.set(0.2, 0, 0.2);
  entrance.group.scale.setScalar(1.18);
  textures.push(...entrance.textures);
  root.add(entrance.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0.2, 2.7, 0.8);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-0.4, 4.9, -2.8);
  root.add(secondaryAnchor);

  let wallFlipped = false;
  let auditAlert = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 3.9, 9.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.4, -0.4),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.4, 0.2),
    update: (timeSec) => {
      const cycle = (timeSec % 12) / 12;
      const bolt = easeOutCubic(clamp01((cycle - 0.1) / 0.34));
      entrance.placardGroup.scale.setScalar(Math.max(0.01, bolt));
      entrance.placardGroup.position.z = 0.85 - bolt * 0.72;
      entrance.pressArm.rotation.y = -bolt * 0.65;

      const wantWall = cycle > 0.42;
      if (wantWall !== wallFlipped) {
        wallFlipped = wantWall;
        entrance.monitorMat.map = wantWall
          ? entrance.monitorRansomTex
          : entrance.monitorNormalTex;
        entrance.monitorMat.needsUpdate = true;
      }

      const wantAudit = cycle > 0.62;
      if (wantAudit !== auditAlert) {
        auditAlert = wantAudit;
        backdrop.auditScreenMat.map = wantAudit
          ? backdrop.auditAlertTex
          : backdrop.auditNormalTex;
        backdrop.auditScreenMat.needsUpdate = true;
      }
      backdrop.auditBeaconMat.color.setHex(wantAudit ? 0xa855f7 : 0xf59e0b);

      return {
        glitchIntensity: wantAudit ? 0.34 : 0.14,
        magicDustIntensity: bolt * 0.35,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

export function buildBespokeLockbitSectionScene(
  sceneKind: Anime3DSceneKind,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'lockbit-archive-briefing':
      return buildLockbitBriefingScene(materials);
    case 'lockbit-step1-psexec':
      return buildLockbitStep1Scene(materials);
    case 'lockbit-step2-vsswipe':
      return buildLockbitStep2Scene(materials);
    case 'lockbit-step3-iocp':
      return buildLockbitStep3Scene(materials);
    case 'lockbit-step4-ransomnote':
      return buildLockbitStep4Scene(materials);
    default:
      return buildLockbitBriefingScene(materials);
  }
}
