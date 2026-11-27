import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  THREECX_TIMELINE_DURATION_SEC,
  evaluateThreeCxChoreography,
} from '../choreography';
import {
  buildCleanroomAndOfficeFloor,
  buildCleanroomConveyorAndSabotageArm,
  buildDesktopPhoneConsole,
  buildPublicIconGalleryWall,
  buildTraderCredentialDeskAndVipVault,
} from './scene-builders';
import { buildThreeCxStep1Scene } from './step-1-scene';
import { buildThreeCxStep2Scene } from './step-2-scene';
import { buildThreeCxStep3Scene } from './step-3-scene';
import { buildThreeCxStep4Scene } from './step-4-scene';
import { buildThreeCxMemoryDiffScene } from './memory-diff-scene';

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
const BASE_SCAN_BEAM_LEN = 3.2;

function alignScanBeamBetweenObjects(
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
  beam.scale.set(1, dist / BASE_SCAN_BEAM_LEN, 1);
  BEAM_QUAT.setFromUnitVectors(BEAM_UP, BEAM_DIR.normalize());
  beam.quaternion.copy(BEAM_QUAT);
}

/**
 * 1) OVERVIEW HERO FILM (`threecx-cleanroom-briefing`)
 * Full 5-Act Cleanroom Conveyor -> Gold Hologram Press -> Phone Cutaway -> Icon Gallery -> VIP Vault.
 */
function buildThreeCxBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0x10b981);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  // Left Cleanroom Station: Conveyor + Covert Sabotage Arm + Gold Hologram Press + Inspector
  const cleanroom = buildCleanroomConveyorAndSabotageArm(materials);
  cleanroom.group.position.set(-3.4, 0, 0.1);
  textures.push(...cleanroom.textures);
  root.add(cleanroom.group);

  // Right Trader Desk Station: Walnut Desk + Browser Keycard Tray + Selective VIP Vault
  const desk = buildTraderCredentialDeskAndVipVault(materials);
  desk.group.position.set(2.85, 0, 0.1);
  root.add(desk.group);

  // Far-Right Rear: Public Art-Gallery Icon Wall (z = -2.35)
  const gallery = buildPublicIconGalleryWall(materials);
  gallery.group.position.set(5.4, 0, -2.35);
  gallery.group.rotation.y = -0.32;
  textures.push(...gallery.textures);
  root.add(gallery.group);

  // Hero Phone Console gliding from Cleanroom Conveyor (-6.3) -> Press (-3.05) -> Trader Desk (2.25)
  const phone = buildDesktopPhoneConsole(materials);
  phone.group.position.set(-6.3, 1.18, 0.1);
  root.add(phone.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.05, 4.1, 0.1);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.85, 3.7, 0.1);
  root.add(secondaryAnchor);

  let showingEdrAlert = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.3, 14.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.2, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 2.2, 0.1),
    update: (
      timeSec,
      _phaseIndex,
      _isDark,
      cutawayMode: StandardCutawayMode = 'AUTO'
    ) => {
      const norm =
        (timeSec % THREECX_TIMELINE_DURATION_SEC) / THREECX_TIMELINE_DURATION_SEC;
      const f = evaluateThreeCxChoreography(norm, cutawayMode);

      cleanroom.sabotageArm.position.y = 4.1 - f.sabotageArmExtend * 0.98;
      phone.riggedGear.visible = f.riggedPartsSeated > 0.25;
      phone.amberCore.visible = f.riggedPartsSeated > 0.25;

      if (f.phoneConveyorProgress <= 0.45) {
        const t = clamp01(f.phoneConveyorProgress / 0.45);
        phone.group.position.x = -6.3 + t * 3.25;
      } else {
        const t = clamp01((f.phoneConveyorProgress - 0.45) / 0.55);
        phone.group.position.x = -3.05 + t * 5.3;
      }

      cleanroom.pressHead.position.y = 3.32 - f.hologramPressDown * 0.45;
      cleanroom.pressGlowMat.opacity = 0.2 + f.hologramPressDown * 0.65;
      phone.hologramSeal.visible = f.hologramAuthentic;
      cleanroom.inspectorWandBeam.visible =
        f.inspectorGreenPass > 0.05 && f.inspectorGreenPass < 0.98;
      cleanroom.inspectorLampMat.color.setHex(
        f.inspectorGreenPass > 0.3 ? 0x10b981 : 0x94a3b8
      );

      phone.cutawayLid.position.y = f.cutawayOpen * 0.95;
      phone.cutawayLid.rotation.z = -f.cutawayOpen * 0.18;

      phone.riggedGear.rotation.y = f.riggedGearSpin;
      phone.prismUpper.position.y = 0.84 + f.prismCoreCracked * 0.36;
      phone.amberCore.position.y = 0.72 + f.prismCoreCracked * 0.22;
      phone.cipherSpool.scale.setScalar(Math.max(0.01, f.cipherSpoolUnwound));
      phone.cipherSpool.rotation.y = timeSec * 2.8;
      phone.hoverRadio.scale.setScalar(Math.max(0.01, easeOutCubic(f.cipherSpoolUnwound)));
      phone.hoverRadio.position.y = 1.48 + Math.sin(timeSec * 3.2) * 0.08;
      phone.hoverRadio.rotation.y = timeSec * 1.4;

      gallery.scanBeam.visible = f.galleryScanBeam > 0.08;
      if (gallery.scanBeam.visible) {
        alignScanBeamBetweenObjects(
          gallery.scanBeam,
          phone.hoverRadio,
          gallery.targetTile,
          gallery.group
        );
      }
      gallery.targetTile.rotation.y = -f.hiddenStripPeeled * 0.28;
      gallery.hiddenStrip.position.y = -0.32 - f.hiddenStripPeeled * 0.34;
      gallery.hiddenStrip.position.z = 0.06 + f.hiddenStripPeeled * 0.26;
      gallery.hiddenStrip.rotation.x = f.hiddenStripPeeled * 0.48;

      for (let k = 0; k < desk.keycards.length; k += 1) {
        const s = clamp01((f.keycardSiphon - k * 0.16) / 0.65);
        desk.keycards[k].position.set(
          1.25 - s * 1.85,
          1.42 + k * 0.07 + Math.sin(s * Math.PI) * 0.65,
          0.12
        );
        desk.keycards[k].rotation.z = s * 0.7;
      }
      desk.vipVault.rotation.y = timeSec * 1.1;
      desk.vipTether.visible = f.vipVaultTether > 0.15;

      const alertOn = f.edrBehavioralAlert > 0.35;
      if (alertOn !== showingEdrAlert) {
        showingEdrAlert = alertOn;
        backdrop.edrScreenMat.map = alertOn
          ? backdrop.edrAlertTex
          : backdrop.edrNormalTex;
        backdrop.edrScreenMat.needsUpdate = true;
      }
      backdrop.edrBeaconMat.color.setHex(alertOn ? 0xe11d48 : 0x10b981);

      return {
        glitchIntensity: f.edrBehavioralAlert * 0.3 + f.prismCoreCracked * 0.15,
        magicDustIntensity: f.cipherSpoolUnwound * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: f.hologramPressDown * 0.3,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

export function buildBespokeThreeCxSectionScene(
  sceneKind: Anime3DSceneKind,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'threecx-cleanroom-briefing':
      return buildThreeCxBriefingScene(materials);
    case 'threecx-step1-buildsign':
      return buildThreeCxStep1Scene(materials);
    case 'threecx-step2-feedface':
      return buildThreeCxStep2Scene(materials);
    case 'threecx-step3-icondrop':
      return buildThreeCxStep3Scene(materials);
    case 'threecx-step4-gopuram':
      return buildThreeCxStep4Scene(materials);
    case 'threecx-memory-diff':
      return buildThreeCxMemoryDiffScene(materials);
    default:
      return buildThreeCxBriefingScene(materials);
  }
}
