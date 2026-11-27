import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  KERB_TIMELINE_DURATION_SEC,
  evaluateKerbChoreography,
} from '../choreography';
import {
  buildConciergeTicketDesk,
  buildHotelLobbyBackdrop,
  buildSafecrackerBench,
  buildSpnBellboard,
  buildSuiteVaultDoor,
} from './scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
    }
  });
  for (const t of textures) t.dispose();
}

function buildKerbBriefingScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(materials);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const bellboard = buildSpnBellboard(materials);
  bellboard.group.position.set(-5.2, 0, 0.15);
  textures.push(...bellboard.textures);
  root.add(bellboard.group);

  const desk = buildConciergeTicketDesk(materials);
  desk.group.position.set(-1.35, 0, 0.25);
  root.add(desk.group);

  const bench = buildSafecrackerBench(materials);
  bench.group.position.set(2.35, 0, 0.35);
  root.add(bench.group);

  const suite = buildSuiteVaultDoor(materials);
  suite.group.position.set(5.8, 0, 0.1);
  root.add(suite.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.35, 3.55, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 16.4),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % KERB_TIMELINE_DURATION_SEC) + KERB_TIMELINE_DURATION_SEC) %
          KERB_TIMELINE_DURATION_SEC) /
        KERB_TIMELINE_DURATION_SEC;
      const frame = evaluateKerbChoreography(tNorm, cutawayMode);

      (bellboard.beaconLight.material as THREE.MeshToonMaterial).emissiveIntensity =
        0.3 + frame.bellboardGlow * 1.4;
      desk.tubeCapsule.position.x = -3.1 + frame.tubePacketProgress * 2.25;
      desk.stampArm.position.y = 2.4 - Math.sin(frame.voucherIssued * Math.PI) * 0.65;
      desk.rc4Voucher.visible = frame.voucherIssued > 0.1;
      desk.rc4Voucher.position.x = 0.35 + frame.voucherIssued * 1.45;

      bench.cutawayCoverPivot.rotation.x = -frame.cutawayOpen * 1.3;
      bench.tumblers.forEach((w, i) => {
        w.rotation.z = frame.tumblerSpin * Math.PI * (6 + i * 2);
      });
      bench.masterKeycard.visible = frame.keycardPivot > 0.05;
      bench.masterKeycard.position.x = frame.keycardPivot * 3.1;
      bench.masterKeycard.position.y = 2.55 + Math.sin(frame.keycardPivot * Math.PI) * 0.45;

      const lampMat = suite.statusLamp.material as THREE.MeshToonMaterial;
      if (frame.keycardPivot > 0.72) {
        lampMat.color.setHex(0xe11d48);
        lampMat.emissive.setHex(0xf43f5e);
      } else {
        lampMat.color.setHex(0x10b981);
        lampMat.emissive.setHex(0x10b981);
      }
      suite.aesEmeraldShield.visible = frame.auditLanternBeam > 0.45;

      return {
        glitchIntensity: Math.max(frame.voucherIssued * 0.5, frame.keycardPivot * 0.6),
        magicDustIntensity: Math.max(frame.bellboardGlow * 0.4, frame.tumblerSpin * 0.6),
        stasisIntensity: frame.auditLanternBeam * 0.35,
        brakeReleaseBoost: frame.keycardPivot * 0.5,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildKerbStep1Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(
    materials,
    'STEP 1 · VIP SUITE BELLBOARD (SPN LOOKUP)',
    'UNPRIVILEGED USER QUERIES LDAP FOR SERVICEPRINCIPALNAME ACCOUNTS',
    '#F59E0B'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const bellboard = buildSpnBellboard(materials);
  bellboard.group.position.set(0, 0, 0.2);
  bellboard.group.scale.setScalar(1.32);
  textures.push(...bellboard.textures);
  root.add(bellboard.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.1, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.25, 3.15, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.2),
    update: (timeSec) => {
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 2.4);
      (bellboard.beaconLight.material as THREE.MeshToonMaterial).emissiveIntensity = 0.4 + pulse * 1.2;
      return {
        glitchIntensity: pulse * 0.25,
        magicDustIntensity: 0.45,
        stasisIntensity: 0.1,
        brakeReleaseBoost: 0.15,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildKerbStep2Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(
    materials,
    'STEP 2 · CONCIERGE DESK STAMPS RC4 VOUCHER',
    'KERBEROS TGS-REQ 0x17 LOGS WINDOWS SECURITY EVENT ID 4769',
    '#E11D48'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const desk = buildConciergeTicketDesk(materials);
  desk.group.position.set(0.3, 0, 0.25);
  desk.group.scale.setScalar(1.18);
  root.add(desk.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.55, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.85, 3.15, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.4, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.25, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.3, 2.2, 0.25),
    update: (timeSec) => {
      const t = (timeSec % 15) / 15;
      desk.tubeCapsule.position.x = -3.1 + Math.min(1, t * 2.4) * 2.25;
      desk.stampArm.position.y = 2.4 - Math.max(0, Math.sin(t * Math.PI * 2)) * 0.65;
      desk.rc4Voucher.position.x = 0.35 + Math.max(0, t - 0.35) * 2.1;
      return {
        glitchIntensity: 0.45,
        magicDustIntensity: 0.5,
        stasisIntensity: 0.2,
        brakeReleaseBoost: 0.35,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildKerbStep3Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(
    materials,
    'STEP 3 · BASEMENT SAFECRACKER BENCH',
    'OFFLINE GPU CRACKING (HASHCAT -m 13100) · ZERO DC LOCKOUTS',
    '#F43F5E'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const bench = buildSafecrackerBench(materials);
  bench.group.position.set(0, 0, 0.25);
  bench.group.scale.setScalar(1.26);
  root.add(bench.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.55, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.5, 3.45, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 13.0),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec, _p, _d, cutawayMode: StandardCutawayMode = 'AUTO') => {
      bench.cutawayCoverPivot.rotation.x = cutawayMode === 'SEALED' ? 0 : -1.3;
      bench.tumblers.forEach((w, i) => {
        w.rotation.z = timeSec * (2.6 + i * 1.1);
      });
      bench.masterKeycard.position.y = 2.6 + Math.sin(timeSec * 3.0) * 0.14;
      return {
        glitchIntensity: 0.55,
        magicDustIntensity: 0.65,
        stasisIntensity: 0.2,
        brakeReleaseBoost: 0.4,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildKerbStep4Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(
    materials,
    'STEP 4 · MASTER KEYCARD PIVOT & AES LOCK',
    'PASS-THE-HASH SMB (EID 4624/7045) VS. AES-256 gMSA HARDENING',
    '#10B981'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const bench = buildSafecrackerBench(materials);
  bench.group.position.set(-2.6, 0, 0.25);
  root.add(bench.group);

  const suite = buildSuiteVaultDoor(materials);
  suite.group.position.set(2.8, 0, 0.2);
  root.add(suite.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.3, 3.65, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.6, 3.85, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.3, 0.2),
    update: (timeSec) => {
      const t = (timeSec % 15) / 15;
      bench.masterKeycard.position.x = Math.min(1, t * 1.8) * 4.1;
      suite.aesEmeraldShield.visible = t > 0.6;
      const lampMat = suite.statusLamp.material as THREE.MeshToonMaterial;
      if (t > 0.35 && t <= 0.6) {
        lampMat.color.setHex(0xe11d48);
        lampMat.emissive.setHex(0xf43f5e);
      } else {
        lampMat.color.setHex(0x10b981);
        lampMat.emissive.setHex(0x10b981);
      }
      return {
        glitchIntensity: t > 0.35 && t <= 0.6 ? 0.6 : 0.2,
        magicDustIntensity: 0.45,
        stasisIntensity: t > 0.6 ? 0.4 : 0.1,
        brakeReleaseBoost: 0.3,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

function buildKerbMemoryDiffScene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildHotelLobbyBackdrop(
    materials,
    'MEMORY DIFF · WEAK RC4 (0x17) VS. AES-256 gMSA',
    'UNSALTED NTLM HASH TICKET (LEFT) VS. 120-CHAR AES-256 VAULT (RIGHT)',
    '#38BDF8'
  );
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const leftBench = buildSafecrackerBench(materials);
  leftBench.group.position.set(-3.2, 0, 0.2);
  leftBench.cutawayCoverPivot.rotation.x = -1.3;
  root.add(leftBench.group);

  const rightSuite = buildSuiteVaultDoor(materials);
  rightSuite.group.position.set(3.2, 0, 0.2);
  rightSuite.aesEmeraldShield.visible = true;
  root.add(rightSuite.group);

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
  primaryAnchor.position.set(-3.2, 4.1, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.2, 4.1, 0.25);
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
      leftBench.tumblers.forEach((w, i) => {
        w.rotation.z = timeSec * (2.5 + i);
      });
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

export function buildBespokeKerbSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'kerb-lobby-briefing':
      return buildKerbBriefingScene(materials);
    case 'kerb-step1-spn':
      return buildKerbStep1Scene(materials);
    case 'kerb-step2-tgs':
      return buildKerbStep2Scene(materials);
    case 'kerb-step3-crack':
      return buildKerbStep3Scene(materials);
    case 'kerb-step4-pth':
      return buildKerbStep4Scene(materials);
    case 'kerb-memory-rc4diff':
      return buildKerbMemoryDiffScene(materials);
    default:
      return buildKerbBriefingScene(materials);
  }
}
