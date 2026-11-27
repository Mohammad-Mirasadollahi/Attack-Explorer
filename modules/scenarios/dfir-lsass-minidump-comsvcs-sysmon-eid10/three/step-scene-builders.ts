import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
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
import { buildLsassStep1Scene } from './step-1-scene';
import { buildLsassStep2Scene } from './step-2-scene';
import { buildLsassStep3Scene } from './step-3-scene';
import { buildLsassStep4Scene } from './step-4-scene';
import { buildLsassMemoryDiffScene } from './memory-diff-scene';

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

      desk.badgeGroup.position.y = 1.72 + frame.badgeGlow * 0.42 + Math.sin(timeSec * 3.2) * 0.04;
      desk.badgeGroup.rotation.y = timeSec * 1.1;
      (desk.badgeHalo.material as THREE.MeshToonMaterial).opacity =
        0.15 + frame.badgeGlow * 0.85;

      cart.group.position.x = -1.35 + frame.photographerAdvance * 1.95;

      vault.cutawayWallPivot.rotation.x = -frame.cutawayOpen * 1.32;
      vault.vaultWheel.rotation.x = frame.vaultWheelAngle;
      cart.apertureRing.rotation.x = frame.lensApertureOpen * Math.PI * 1.5;
      cart.apertureRing.scale.setScalar(1 + frame.lensApertureOpen * 0.24);
      cart.xrayCone.visible = frame.xrayFlashBeam > 0.04;
      (cart.xrayCone.material as THREE.MeshToonMaterial).opacity =
        frame.xrayFlashBeam * 0.46;
      (cart.flashBulb.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.25 + frame.xrayFlashBeam * 1.4;

      cart.polaroidCard.visible = frame.polaroidEject > 0.04;
      cart.polaroidCard.position.x =
        -0.22 - frame.polaroidEject * 0.42 - frame.envelopeSealed * 0.28;
      cart.polaroidCard.position.y = 1.58 - frame.polaroidEject * 0.14;

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

export function buildBespokeLsassSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'lsass-vault-briefing':
      return buildLsassBriefingScene(materials);
    case 'lsass-step1-sedebug':
      return buildLsassStep1Scene(materials);
    case 'lsass-step2-comsvcs':
      return buildLsassStep2Scene(materials);
    case 'lsass-step3-minidump':
      return buildLsassStep3Scene(materials);
    case 'lsass-step4-sysmon10':
      return buildLsassStep4Scene(materials);
    case 'lsass-memory-ppldiff':
      return buildLsassMemoryDiffScene(materials);
    default:
      return buildLsassBriefingScene(materials);
  }
}
