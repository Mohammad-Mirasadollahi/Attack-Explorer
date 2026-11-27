import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import {
  LOG4SHELL_STEP_DURATION_SEC,
  evaluateLog4shellStep3State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Log4Shell Step 3 (`log4j-step3-egress`)
 * Exclusive Room: `APP-JVM-01` Outbound Vacuum Egress & `auditd` Workshop Alarm Hall
 * Exclusive Props:
 *   1. Left `APP-JVM-01 (10.20.40.22)` Container Node (`x=-3.25`) launching crimson canister
 *   2. Elevated Glass `TCP/1389` LDAP Vacuum Pipe (`x=0.35`) & Overhead `Zeek` Egress Radar Arch
 *   3. Right `Annex & Linux auditd` Workshop Kiosk (`x=3.55`) with hinged cutaway exposing `java PID 4418 -> /bin/sh PID 5102` execve spawn & flaring crimson dual-proof siren
 */
export function buildLog4shellStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0b1526,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x15253f,
    pillarColor: 0x243b5e,
    gridColor: 0x2b456d,
    signTitle: 'STEP 3 · OUTBOUND TCP/1389 EGRESS & AUDITD EXECVE',
    signSubtitle: 'ZEEK LDAP CALLBACK + LINUX AUDITD SYSCALL=59 (JAVA PID 4418 -> /BIN/SH)',
    signBgHex: '#0A192F',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left APP-JVM-01 Container Node (x = -3.3) ---
  const jvmGroup = new THREE.Group();
  jvmGroup.position.set(-3.3, 0, 0.25);
  root.add(jvmGroup);
  jvmGroup.add(createContactDisc(materials, 1.75, 0.018));

  const jvmBox = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 3.05, 1.55),
    materials.createToonMaterial(0x334155)
  );
  jvmBox.position.y = 1.525;
  addAnimeInkEdges(jvmBox, materials.inkLineMaterial, 24);
  jvmGroup.add(jvmBox);

  const jvmTex = createPlaqueTexture(
    'APP-JVM-01 · DMZ',
    '10.20.40.22 -> :1389',
    '#2E1905',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(jvmTex);

  const jvmFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 1.05),
    new THREE.MeshBasicMaterial({ map: jvmTex })
  );
  jvmFace.position.set(0, 1.95, 0.79);
  jvmGroup.add(jvmFace);

  // --- PROP 2: Elevated Glass TCP/1389 LDAP Vacuum Pipe & Zeek Radar Arch (x = 0.2) ---
  const tubePipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 4.5, 16),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    })
  );
  tubePipe.rotation.z = Math.PI / 2;
  tubePipe.position.set(0.15, 2.25, 0.25);
  root.add(tubePipe);

  const canister = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.2, 0.5, 8, 14),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.95,
    })
  );
  canister.rotation.z = Math.PI / 2;
  canister.position.set(-1.75, 2.25, 0.25);
  addAnimeInkEdges(canister, materials.inkLineMaterial, 24);
  root.add(canister);

  // Overhead Zeek Egress Radar Arch
  const zeekMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x38bdf8,
    emissiveIntensity: 0.5,
  });
  const zeekArch = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.11, 10, 24, Math.PI),
    zeekMat
  );
  zeekArch.position.set(0.15, 2.25, 0.25);
  root.add(zeekArch);

  const zeekTex = createPlaqueTexture(
    'ZEEK NSM RADAR',
    'OUTBOUND TCP/1389',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(zeekTex);

  const zeekPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.95, 0.72),
    new THREE.MeshBasicMaterial({ map: zeekTex })
  );
  zeekPlaque.position.set(0.15, 3.65, 0.25);
  root.add(zeekPlaque);

  // --- PROP 3: Right Annex & Linux auditd Workshop Kiosk (x = +3.55) ---
  const annexGroup = new THREE.Group();
  annexGroup.position.set(3.55, 0, 0.25);
  root.add(annexGroup);
  annexGroup.add(createContactDisc(materials, 1.9, 0.018));

  const annexBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.95, 3.25, 1.55),
    materials.createToonMaterial(0x1e293b)
  );
  annexBody.position.y = 1.625;
  addAnimeInkEdges(annexBody, materials.inkLineMaterial, 24);
  annexGroup.add(annexBody);

  const auditTex = createPlaqueTexture(
    'AUDITD SYSCALL=59',
    'java (4418) -> /bin/sh',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(auditTex);

  const auditHeader = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 0.92),
    new THREE.MeshBasicMaterial({ map: auditTex })
  );
  auditHeader.position.set(0, 2.55, 0.79);
  annexGroup.add(auditHeader);

  // Crimson Child Shell Spawn Module inside cutaway bay
  const shellNode = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.46, 0),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.95,
    })
  );
  shellNode.position.set(0, 1.15, 0.58);
  addAnimeInkEdges(shellNode, materials.inkLineMaterial, 24);
  annexGroup.add(shellNode);

  // Hinged Cutaway Door on Annex Kiosk
  const doorPivot = new THREE.Group();
  doorPivot.position.set(0, 1.85, 0.8);
  annexGroup.add(doorPivot);

  const doorGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 1.38, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  doorGlass.position.set(0, -0.68, 0.04);
  doorPivot.add(doorGlass);

  // Dual-Proof Workshop Siren Beacon
  const sirenMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.25,
  });
  const siren = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.42, 0.54, 16),
    sirenMat
  );
  siren.position.set(0, 3.55, 0);
  addAnimeInkEdges(siren, materials.inkLineMaterial, 24);
  annexGroup.add(siren);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.9, 3.65, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.55, 3.95, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.5, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % LOG4SHELL_STEP_DURATION_SEC) + LOG4SHELL_STEP_DURATION_SEC) %
          LOG4SHELL_STEP_DURATION_SEC) /
        LOG4SHELL_STEP_DURATION_SEC;
      const frame = evaluateLog4shellStep3State(tNorm, cutawayMode);

      doorPivot.rotation.x = -frame.cutawayOpen * 1.28;

      // Crimson canister shoots through glass LDAP TCP/1389 pipe
      const travel = easeOutCubic(frame.canisterTravel);
      canister.position.x = -1.75 + travel * 3.8;
      zeekMat.emissiveIntensity = 0.4 + travel * 1.1;

      // Child /bin/sh module grows & spins when auditd execve fires
      const spawn = easeOutCubic(frame.execveSpawnProgress);
      shellNode.scale.setScalar(0.35 + spawn * 0.78);
      shellNode.rotation.y = timeSec * 3.0;
      shellNode.rotation.x = timeSec * 1.6;

      // Dual-proof siren blazes crimson
      sirenMat.emissiveIntensity =
        0.25 + frame.dualProofAlarm * (1.25 + 0.4 * Math.sin(timeSec * 10));

      return {
        glitchIntensity: frame.execveSpawnProgress * 0.55,
        magicDustIntensity: 0.25 + frame.canisterTravel * 0.45,
        stasisIntensity: frame.dualProofAlarm * 0.3,
        brakeReleaseBoost: frame.canisterTravel * 0.35,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
