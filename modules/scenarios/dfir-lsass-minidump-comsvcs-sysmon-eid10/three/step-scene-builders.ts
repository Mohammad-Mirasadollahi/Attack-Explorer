import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  LSASS_TIMELINE_DURATION_SEC,
  evaluateLsassChoreography,
} from '../choreography';
import {
  buildBankVaultHallBackdrop,
  buildGlassGuardBooth,
  buildInspectorBadgeDesk,
  buildSafeDepositVaultDoor,
  buildVaultPhotographerCart,
} from './scene-builders';

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

const BEAM_UP = new THREE.Vector3(0, 1, 0);
const BEAM_FROM = new THREE.Vector3();
const BEAM_TO = new THREE.Vector3();
const BEAM_DIR = new THREE.Vector3();
const BEAM_MID = new THREE.Vector3();
const BEAM_QUAT = new THREE.Quaternion();
const BASE_BEAM_LEN = 3.2;

function alignBeamBetween(
  beam: THREE.Mesh,
  fromObj: THREE.Object3D,
  toObj: THREE.Object3D,
  beamParent: THREE.Object3D
) {
  beamParent.updateWorldMatrix(true, false);
  fromObj.updateWorldMatrix(true, false);
  toObj.updateWorldMatrix(true, false);

  fromObj.getWorldPosition(BEAM_FROM);
  toObj.getWorldPosition(BEAM_TO);
  beamParent.worldToLocal(BEAM_FROM);
  beamParent.worldToLocal(BEAM_TO);

  BEAM_DIR.subVectors(BEAM_TO, BEAM_FROM);
  const dist = Math.max(0.05, BEAM_DIR.length());
  BEAM_MID.addVectors(BEAM_FROM, BEAM_TO).multiplyScalar(0.5);

  beam.position.copy(BEAM_MID);
  beam.scale.set(1, dist / BASE_BEAM_LEN, 1);
  BEAM_QUAT.setFromUnitVectors(BEAM_UP, BEAM_DIR.normalize());
  beam.quaternion.copy(BEAM_QUAT);
}

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
    }
  });
  for (const t of textures) t.dispose();
}

/**
 * 1) OVERVIEW HERO FILM (`lsass-vault-briefing`)
 * Full 5-Act Safe-Deposit Vault Hall: Inspector Badge Desk -> Vault Photographer Cart -> Steel Vault Door -> Glass Guard Booth.
 */
function buildLsassBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildBankVaultHallBackdrop(materials);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const desk = buildInspectorBadgeDesk(materials);
  desk.group.position.set(-4.7, 0, 0.2);
  root.add(desk.group);

  const cart = buildVaultPhotographerCart(materials);
  cart.group.position.set(-1.35, 0, 0.2);
  textures.push(...cart.textures);
  root.add(cart.group);

  const vault = buildSafeDepositVaultDoor(materials);
  vault.group.position.set(4.15, 0, 0.15);
  root.add(vault.group);

  const booth = buildGlassGuardBooth(materials);
  booth.group.position.set(1.35, 1.55, -1.92);
  textures.push(...booth.textures);
  root.add(booth.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.35, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.45, 3.85, 0.15);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 2.2, 0.2),
    update: (
      timeSec: number,
      _phaseIndex: number,
      _isDark: boolean,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const tNorm =
        (((timeSec % LSASS_TIMELINE_DURATION_SEC) + LSASS_TIMELINE_DURATION_SEC) %
          LSASS_TIMELINE_DURATION_SEC) /
        LSASS_TIMELINE_DURATION_SEC;
      const frame = evaluateLsassChoreography(tNorm, cutawayMode);

      // Act 1: Golden Inspector Badge rises & glows
      desk.badgeGroup.position.y = 1.72 + frame.badgeGlow * 0.42 + Math.sin(timeSec * 3.2) * 0.04;
      desk.badgeGroup.rotation.y = timeSec * 1.1;
      (desk.badgeHalo.material as THREE.MeshToonMaterial).opacity =
        0.15 + frame.badgeGlow * 0.85;

      // Act 2: Photographer Cart rolls rightward along brass aisle runner toward Vault Door
      cart.group.position.x = -1.35 + frame.photographerAdvance * 1.95;

      // Act 3: Cutaway glass lifts; lens aperture widens (0x1010) & crimson X-ray scan fires
      vault.cutawayWallPivot.rotation.x = -frame.cutawayOpen * 1.32;
      vault.vaultWheel.rotation.x = frame.vaultWheelAngle;
      cart.apertureRing.rotation.x = frame.lensApertureOpen * Math.PI * 1.5;
      cart.apertureRing.scale.setScalar(1 + frame.lensApertureOpen * 0.24);
      cart.xrayCone.visible = frame.xrayFlashBeam > 0.04;
      (cart.xrayCone.material as THREE.MeshToonMaterial).opacity =
        frame.xrayFlashBeam * 0.46;
      (cart.flashBulb.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.25 + frame.xrayFlashBeam * 1.4;

      // Act 4: Instant MDMP Polaroid negative ejects onto packing table & slips into envelope
      cart.polaroidCard.visible = frame.polaroidEject > 0.04;
      cart.polaroidCard.position.x =
        -0.22 - frame.polaroidEject * 0.42 - frame.envelopeSealed * 0.28;
      cart.polaroidCard.position.y = 1.58 - frame.polaroidEject * 0.14;

      // Act 5: Glass Guard Booth lights up Sysmon EID 10 & shoots violet CallTrace beam
      (booth.beaconDome.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.35 + frame.boothAlarmActive * 1.45;
      const beamOn = frame.callTraceBeam > 0.04;
      booth.callTraceBeam.visible = beamOn;
      if (beamOn) {
        alignBeamBetween(
          booth.callTraceBeam,
          booth.beaconDome,
          cart.cameraHead,
          booth.group
        );
        (booth.callTraceBeam.material as THREE.MeshToonMaterial).opacity =
          frame.callTraceBeam * 0.48;
      }

      return {
        glitchIntensity: Math.max(frame.xrayFlashBeam * 0.6, frame.boothAlarmActive * 0.5),
        magicDustIntensity: Math.max(frame.badgeGlow * 0.45, frame.polaroidEject * 0.65),
        stasisIntensity: frame.lensApertureOpen * 0.35,
        brakeReleaseBoost: frame.xrayFlashBeam * 0.55,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

/**
 * 2) STEP #1 MACRO (`lsass-step1-sedebug`)
 * Elevated Golden Inspector Badge (SeDebugPrivilege) & PID 684 Directory Plaque.
 */
function buildLsassStep1SeDebugScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildBankVaultHallBackdrop(
    materials,
    'STEP 1 · GOLDEN INSPECTOR BADGE & PID 684',
    'ELEVATED PRIVILEGE TOKEN VERIFIED BEFORE SUMMONING PHOTOGRAPHER',
    '#F59E0B'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const desk = buildInspectorBadgeDesk(materials);
  desk.group.position.set(0, 0, 0.2);
  desk.group.scale.setScalar(1.38);
  root.add(desk.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.9, 3.45, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.15, 3.05, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.2, 12.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.2, 0.2),
    update: (timeSec: number) => {
      const t = (((timeSec % 15) + 15) % 15) / 15;
      const rise = easeOutCubic(t / 0.32);
      const scan = t < 0.35 ? 0 : easeOutCubic((t - 0.35) / 0.4);

      desk.badgeGroup.position.y = 1.72 + rise * 0.52 + Math.sin(timeSec * 3.5) * 0.05;
      desk.badgeGroup.rotation.y = timeSec * 1.4;
      (desk.badgeHalo.material as THREE.MeshToonMaterial).opacity = 0.2 + rise * 0.8;
      (desk.pidPlaque.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.35 + scan * 0.95;

      return {
        glitchIntensity: scan * 0.3,
        magicDustIntensity: rise * 0.55,
        stasisIntensity: 0,
        brakeReleaseBoost: scan * 0.25,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

/**
 * 3) STEP #2 MACRO (`lsass-step2-comsvcs`)
 * Certified Brass Vault Photographer Cart Opening Wide-Aperture X-Ray Lens (0x1010).
 */
function buildLsassStep2ComsvcsScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildBankVaultHallBackdrop(
    materials,
    'STEP 2 · VAULT PHOTOGRAPHER & 0x1010 LENS',
    'SIGNED RUNDLL32 + COMSVCS.DLL REQUESTS PROCESS_VM_READ HANDLE',
    '#E11D48'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const cart = buildVaultPhotographerCart(materials);
  cart.group.position.set(-1.35, 0, 0.2);
  cart.group.scale.setScalar(1.18);
  textures.push(...cart.textures);
  root.add(cart.group);

  const vault = buildSafeDepositVaultDoor(materials);
  vault.group.position.set(2.95, 0, 0.18);
  vault.group.scale.setScalar(1.02);
  root.add(vault.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.55, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.35, 3.85, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.3, 4.4, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.35, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.6, 2.2, 0.2),
    update: (
      timeSec: number,
      _phaseIndex: number,
      _isDark: boolean,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const t = (((timeSec % 15) + 15) % 15) / 15;
      const roll = easeOutCubic(t / 0.3);
      const lens = t < 0.32 ? 0 : easeOutCubic((t - 0.32) / 0.28);
      const beam = t < 0.58 ? 0 : easeOutCubic((t - 0.58) / 0.25);
      const openVal =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
            ? 0
            : easeOutCubic(Math.max(0, (t - 0.25) / 0.22));

      cart.group.position.x = -1.9 + roll * 1.15;
      cart.apertureRing.rotation.x = lens * Math.PI * 2;
      cart.apertureRing.scale.setScalar(1 + lens * 0.26);
      cart.xrayCone.visible = beam > 0.04;
      (cart.xrayCone.material as THREE.MeshToonMaterial).opacity = beam * 0.5;
      (cart.flashBulb.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.25 + beam * 1.3;
      vault.cutawayWallPivot.rotation.x = -openVal * 1.35;
      vault.vaultWheel.rotation.x = timeSec * 0.7;

      return {
        glitchIntensity: beam * 0.65,
        magicDustIntensity: lens * 0.45,
        stasisIntensity: lens * 0.35,
        brakeReleaseBoost: beam * 0.5,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

/**
 * 4) STEP #3 MACRO (`lsass-step3-minidump`)
 * Crimson X-Ray Exposure & Instant MDMP Polaroid Negative Sliding Into Courier Sleeve.
 */
function buildLsassStep3MiniDumpScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildBankVaultHallBackdrop(
    materials,
    'STEP 3 · INSTANT X-RAY NEGATIVE (MDMP)',
    '48.2 MB MEMORY SNAPSHOT WRITTEN TO C:\\WINDOWS\\TEMP\\DEBUG.DMP',
    '#F43F5E'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const cart = buildVaultPhotographerCart(materials);
  cart.group.position.set(-0.35, 0, 0.25);
  cart.group.scale.setScalar(1.26);
  textures.push(...cart.textures);
  root.add(cart.group);

  const vault = buildSafeDepositVaultDoor(materials);
  vault.group.position.set(3.55, 0, 0.2);
  root.add(vault.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 2.75, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.55, 3.65, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 13.2),
    defaultCameraTarget: new THREE.Vector3(0.3, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.6, 2.1, 0.25),
    update: (
      timeSec: number,
      _phaseIndex: number,
      _isDark: boolean,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const t = (((timeSec % 15) + 15) % 15) / 15;
      const flash = easeOutCubic(t / 0.26);
      const eject = t < 0.28 ? 0 : easeOutCubic((t - 0.28) / 0.34);
      const pack = t < 0.65 ? 0 : easeOutCubic((t - 0.65) / 0.28);
      const openVal = cutawayMode === 'SEALED' ? 0 : 1;

      vault.cutawayWallPivot.rotation.x = -openVal * 1.35;
      cart.xrayCone.visible = flash > 0.04;
      (cart.xrayCone.material as THREE.MeshToonMaterial).opacity =
        flash * (1 - pack * 0.55) * 0.5;
      (cart.flashBulb.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.3 + flash * 1.4;

      cart.polaroidCard.visible = eject > 0.03;
      cart.polaroidCard.position.x = -0.22 - eject * 0.45 - pack * 0.26;
      cart.polaroidCard.position.y = 1.62 - eject * 0.16;

      return {
        glitchIntensity: flash * 0.55,
        magicDustIntensity: eject * 0.7,
        stasisIntensity: 0.2,
        brakeReleaseBoost: pack * 0.5,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

/**
 * 5) STEP #4 MACRO (`lsass-step4-sysmon10`)
 * Elevated Glass Security Guard Booth Firing Sysmon EID 10 CallTrace Beam.
 */
function buildLsassStep4SysmonScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildBankVaultHallBackdrop(
    materials,
    'STEP 4 · GLASS SECURITY BOOTH (SYSMON EID 10)',
    'CALLTRACE LOCKS ONTO COMSVCS.DLL + DBGCORE.DLL FOR CONTAINMENT',
    '#7C3AED'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const booth = buildGlassGuardBooth(materials);
  booth.group.position.set(1.85, 0.85, -0.45);
  booth.group.scale.setScalar(1.25);
  textures.push(...booth.textures);
  root.add(booth.group);

  // Support steel gantry under elevated booth grounded at y = 0
  const gantry = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 0.85, 1.8),
    materials.createToonMaterial(0x334155)
  );
  gantry.position.set(1.85, 0.425, -0.45);
  addAnimeInkEdges(gantry, materials.inkLineMaterial);
  root.add(gantry);

  const cart = buildVaultPhotographerCart(materials);
  cart.group.position.set(-2.35, 0, 0.45);
  cart.polaroidCard.visible = true;
  cart.polaroidCard.position.set(-0.78, 1.46, 0.08);
  textures.push(...cart.textures);
  root.add(cart.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(1.85, 4.65, -0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-2.1, 3.25, 0.45);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.6, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.6, 0.0),
    update: (timeSec: number) => {
      const t = (((timeSec % 15) + 15) % 15) / 15;
      const alert = easeOutCubic(t / 0.3);
      const lock = t < 0.32 ? 0 : easeOutCubic((t - 0.32) / 0.32);

      (booth.beaconDome.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.4 + alert * 1.4 + Math.sin(timeSec * 10) * 0.25 * alert;

      booth.callTraceBeam.visible = lock > 0.04;
      if (lock > 0.04) {
        alignBeamBetween(
          booth.callTraceBeam,
          booth.beaconDome,
          cart.cameraHead,
          booth.group
        );
        (booth.callTraceBeam.material as THREE.MeshToonMaterial).opacity =
          lock * 0.55;
      }

      return {
        glitchIntensity: alert * 0.45,
        magicDustIntensity: lock * 0.65,
        stasisIntensity: lock * 0.3,
        brakeReleaseBoost: lock * 0.45,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

/**
 * 6) MEMORY FORENSICS COMPARISON (`lsass-memory-ppldiff`)
 * Left: Unprotected LSASS Vault (0x1010 X-Ray Read Succeeds) vs. Right: RunAsPPL Kernel Blast Shield (STATUS_ACCESS_DENIED).
 */
function buildLsassMemoryPplDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildBankVaultHallBackdrop(
    materials,
    'MEMORY FORENSICS · UNPROTECTED VS. RUNASPPL',
    'OPENPROCESS(0x1010) EXPOSED (LEFT) VS. KERNEL BLAST SHIELD BLOCKED (RIGHT)',
    '#38BDF8'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  // Left: Unprotected LSASS Vault (PPL = 0) penetrated by crimson X-ray ray
  const leftVault = buildSafeDepositVaultDoor(materials);
  leftVault.group.position.set(-3.15, 0, 0.2);
  leftVault.cutawayWallPivot.rotation.x = -1.32;
  root.add(leftVault.group);

  const leftRay = new THREE.Mesh(
    new THREE.ConeGeometry(0.92, 2.35, 20, 1, true),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.46,
      side: THREE.DoubleSide,
    })
  );
  (leftRay.material as THREE.MeshToonMaterial).depthWrite = false;
  leftRay.rotation.z = Math.PI / 2;
  leftRay.position.set(-4.35, 2.2, 0.22);
  root.add(leftRay);

  // Right: Hardened RunAsPPL + Credential Guard Vault with glowing cyan steel blast shield
  const rightVault = buildSafeDepositVaultDoor(materials);
  rightVault.group.position.set(3.25, 0, 0.2);
  rightVault.cutawayWallPivot.rotation.x = -1.32;
  rightVault.pplBlastShield.visible = true;
  root.add(rightVault.group);

  // Sweeping golden forensic audit beam comparing both vaults
  const sweepBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.6, 3.0),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.28,
    })
  );
  (sweepBar.material as THREE.MeshToonMaterial).depthWrite = false;
  sweepBar.position.set(0, 2.3, 0.2);
  root.add(sweepBar);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.15, 4.45, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.15, 4.45, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.2, 0.2),
    update: (timeSec: number) => {
      const sweepX = Math.sin(timeSec * 0.95) * 4.5;
      sweepBar.position.x = sweepX;
      leftVault.vaultWheel.rotation.x = timeSec * 0.9;
      rightVault.vaultWheel.rotation.x = 0;

      (rightVault.pplBlastShield.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.55 + Math.sin(timeSec * 4) * 0.2;

      return {
        glitchIntensity: 0.25,
        magicDustIntensity: 0.35,
        stasisIntensity: 0.3,
        brakeReleaseBoost: 0.15,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildBespokeLsassSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'lsass-vault-briefing':
      return buildLsassBriefingScene(materials);
    case 'lsass-step1-sedebug':
      return buildLsassStep1SeDebugScene(materials);
    case 'lsass-step2-comsvcs':
      return buildLsassStep2ComsvcsScene(materials);
    case 'lsass-step3-minidump':
      return buildLsassStep3MiniDumpScene(materials);
    case 'lsass-step4-sysmon10':
      return buildLsassStep4SysmonScene(materials);
    case 'lsass-memory-ppldiff':
      return buildLsassMemoryPplDiffScene(materials);
    default:
      return buildLsassBriefingScene(materials);
  }
}
