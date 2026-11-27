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
import { buildLockbitStep1Scene } from './step-1-scene';
import { buildLockbitStep2Scene } from './step-2-scene';
import { buildLockbitStep3Scene } from './step-3-scene';
import { buildLockbitStep4Scene } from './step-4-scene';

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
