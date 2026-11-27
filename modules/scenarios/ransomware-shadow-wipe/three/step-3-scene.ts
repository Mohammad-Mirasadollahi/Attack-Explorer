import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateLockbitStep3State } from '../choreography';

const CLEAN_HEADER = new THREE.Color(0xe0f2fe);
const SCORCHED_HEADER = new THREE.Color(0xdc2626);
const TEMP_COLOR = new THREE.Color();

/**
 * MOD-18 Standalone Diorama — LockBit Step #3 (`lockbit-step3-iocp`)
 * Room: Parallel High-Speed Filing Vault & 4-Arm Overhead Gantry Hall (Head-Only 15% Encryption).
 */
export function buildLockbitStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x2c2530,
    floorTrimHex: 0xdc2626,
    wallColor: 0x1e202c,
    pillarColor: 0x111827,
    signTitle: 'STEP 3 · PARALLEL HEADER LOCKING',
    signSubtitle: 'CREATEIOCOMPLETIONPORT · FIRST 4KB-64KB .LOCKBIT',
    signBgHex: '#18181B',
    signBorderHex: '#DC2626',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const steelMat = materials.createToonMaterial(0x475569);
  const darkIronMat = materials.createToonMaterial(0x1e293b);
  const brassMat = materials.createToonMaterial(0xd97706);
  const whitePageMat = materials.createToonMaterial(0xf8fafc);
  const crimsonMat = materials.createToonMaterial(0xdc2626);

  // Prop 1: Overhead 4-Lane Industrial I-Beam Gantry + 4 Synchronized Pneumatic Stamping Arms
  const gantryBeam = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.36, 0.72), darkIronMat);
  gantryBeam.position.set(0, 3.88, 0.15);
  addAnimeInkEdges(gantryBeam, materials.inkLineMaterial, 24);
  root.add(gantryBeam);

  for (const gx of [-4.05, 4.05]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.9, 0.42), steelMat);
    col.position.set(gx, 1.95, 0.15);
    addAnimeInkEdges(col, materials.inkLineMaterial, 24);
    root.add(col);
    const disc = createContactDisc(materials, 0.45);
    disc.position.set(gx, 0.018, 0.15);
    root.add(disc);
  }

  const laneX = [-2.55, -0.85, 0.85, 2.55];
  const shareLabels = ['FINANCE', 'HR-PAY', 'CAD-ENG', 'BACKUP'];
  const gantryArms: THREE.Group[] = [];
  const headerMats: THREE.MeshToonMaterial[] = [];
  const glassDoorMats: THREE.MeshToonMaterial[] = [];
  const padlocks: THREE.Group[] = [];

  for (let i = 0; i < 4; i++) {
    const x = laneX[i];

    // Overhead Pneumatic Stamping Arm
    const arm = new THREE.Group();
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.25, 14), brassMat);
    pistonRod.position.y = 0.55;
    const stampHead = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.24, 0.72), crimsonMat);
    stampHead.position.y = -0.05;
    addAnimeInkEdges(stampHead, materials.inkLineMaterial, 22);
    arm.add(pistonRod, stampHead);
    arm.position.set(x, 3.52, 0.15);
    root.add(arm);
    gantryArms.push(arm);

    // Prop 2: Glass-Fronted Filing Vault Cabinet containing white ledger stack + 15% header band
    const vault = new THREE.Group();
    vault.position.set(x, 0, 0.15);
    vault.add(createContactDisc(materials, 0.9));

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.42, 1.18), darkIronMat);
    plinth.position.y = 0.21;
    addAnimeInkEdges(plinth, materials.inkLineMaterial, 24);
    vault.add(plinth);

    // Side & rear steel frame
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(1.38, 2.05, 0.1), steelMat);
    backWall.position.set(0, 1.44, -0.5);
    vault.add(backWall);

    // Thick lower 85% untouched crisp-white ledger pages (proving head-only encryption!)
    const whiteBody = new THREE.Mesh(new THREE.BoxGeometry(0.96, 1.34, 0.76), whitePageMat);
    whiteBody.position.set(0, 1.09, 0);
    whiteBody.castShadow = true;
    addAnimeInkEdges(whiteBody, materials.inkLineMaterial, 28);
    vault.add(whiteBody);

    // Top 15% header band that scorches from sky-white to crimson on impact
    const headerMat = materials.createToonMaterial(0xe0f2fe);
    const topBand = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.26, 0.78), headerMat);
    topBand.position.set(0, 1.89, 0);
    addAnimeInkEdges(topBand, materials.inkLineMaterial, 26);
    vault.add(topBand);
    headerMats.push(headerMat);

    // Front glass vault door (responds to Cutaway)
    const doorMat = new THREE.MeshToonMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.36,
      gradientMap: materials.gradientMap,
    });
    const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(1.34, 1.98, 0.06), doorMat);
    glassDoor.position.set(0, 1.42, 0.56);
    addAnimeInkEdges(glassDoor, materials.inkLineMaterial, 28);
    vault.add(glassDoor);
    glassDoorMats.push(doorMat);

    const laneTex = createPlaqueTexture(
      shareLabels[i],
      '85% TAIL WHITE',
      '#0F172A',
      '#F59E0B',
      '#F8FAFC',
      256,
      128
    );
    textures.push(laneTex);
    const lanePlaque = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 0.34),
      new THREE.MeshBasicMaterial({ map: laneTex })
    );
    lanePlaque.position.set(0, 0.22, 0.6);
    vault.add(lanePlaque);

    // Prop 3: Heavy Cast-Iron Crimson .lockbit Padlock slamming onto vault latch
    const padlock = new THREE.Group();
    const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.52, 0.24), crimsonMat);
    addAnimeInkEdges(lockBody, materials.inkLineMaterial, 22);
    const shackle = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.055, 8, 16, Math.PI),
      brassMat
    );
    shackle.position.y = 0.25;
    padlock.add(lockBody, shackle);
    padlock.position.set(0, 1.35, 0.76);
    padlock.scale.setScalar(0.01);
    vault.add(padlock);
    padlocks.push(padlock);

    root.add(vault);
  }

  // Rear telemetry board showing 4,820 files locked in 11.4s
  const boardTex = createPlaqueTexture(
    'IOCP 8-THREAD BURST',
    '4,820 .LOCKBIT · 11.4s',
    '#18181B',
    '#DC2626',
    '#FECACA'
  );
  textures.push(boardTex);
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 1.05),
    new THREE.MeshBasicMaterial({ map: boardTex })
  );
  board.position.set(0, 3.05, -3.25);
  root.add(board);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.7, 3.9, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(0.85, 2.35, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 3.6, 8.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.0, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLockbitStep3State(timeSec, cutawayMode);

      for (let i = 0; i < 4; i++) {
        gantryArms[i].position.y = 3.52 - s.armPlunge[i] * 1.32;

        TEMP_COLOR.copy(CLEAN_HEADER).lerp(SCORCHED_HEADER, s.headerScorched[i]);
        headerMats[i].color.copy(TEMP_COLOR);

        glassDoorMats[i].opacity = 0.38 - s.cutawayOpen * 0.26;

        const p = easeOutCubic(s.padlockShut[i]);
        padlocks[i].scale.setScalar(Math.max(0.01, p));
        padlocks[i].position.y = 1.9 - p * 0.62;
      }

      const maxPlunge = Math.max(...s.armPlunge);
      shell.accentStripMat.color.setHex(s.padlockShut[0] > 0.3 ? 0x991b1b : 0xdc2626);

      return {
        glitchIntensity: maxPlunge * 0.24,
        magicDustIntensity: maxPlunge * 0.5,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
