import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateAmsiStep2State } from '../choreography';

/**
 * Standalone 3D Scene: AMSI Step 2 — Vault Lockroom with Copy-on-Write Hydraulic Split Plinth,
 * Bolted Blue Glass Safety Hatch, Brass Wrench & Ring 0 EtwTiLogProtectVM UV Beacon.
 */
export function buildAmsiStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x172033,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x1e293b,
    pillarColor: 0x0f172a,
    signTitle: 'MEMORY PROTECTION VAULT LOCKROOM',
    signSubtitle: 'VIRTUALPROTECT RX (0x20) -> RWX (0x40) | CoW FORK & ETW-TI',
    signBgHex: '#0F172A',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#F59E0B',
    width: 14.4,
    depth: 9.8,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // 1) Central Hydraulic Copy-on-Write Memory Slab Plinth
  const vaultGroup = new THREE.Group();
  vaultGroup.position.set(-0.2, 0, 0.35);
  vaultGroup.add(createContactDisc(materials, 3.4));

  const basePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 0.9, 2.5),
    materials.createToonMaterial(0x334155)
  );
  basePlinth.position.y = 0.45;
  basePlinth.castShadow = true;
  basePlinth.receiveShadow = true;
  addAnimeInkEdges(basePlinth, materials.inkLineMaterial, 24);
  vaultGroup.add(basePlinth);

  // Sliding hydraulic guide rails on top of plinth
  for (const rz of [-0.72, 0.72]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.08, 0.14),
      materials.createToonMaterial(0x64748b)
    );
    rail.position.set(0, 0.94, rz);
    vaultGroup.add(rail);
  }

  // Left Shared Clean SEC_IMAGE Slab (remains RX 0x20 forever)
  const rxSlabTex = createPlaqueTexture(
    'SHARED ON-DISK PAGE',
    'RX (0x20) SEALED',
    '#0C4A6E',
    '#38BDF8',
    '#E0F2FE'
  );
  textures.push(rxSlabTex);
  const sharedSlab = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 1.55, 1.45),
    materials.createToonMaterial(0x0284c7)
  );
  sharedSlab.position.set(-1.55, 1.76, 0);
  sharedSlab.castShadow = true;
  addAnimeInkEdges(sharedSlab, materials.inkLineMaterial, 24);
  vaultGroup.add(sharedSlab);

  const sharedFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.95, 1.05),
    new THREE.MeshBasicMaterial({ map: rxSlabTex })
  );
  sharedFace.position.set(-1.55, 1.82, 0.74);
  vaultGroup.add(sharedFace);

  // Right Private Copy-on-Write Forked Slab (slides rightward & flips amber RWX 0x40)
  const cowSlabGroup = new THREE.Group();
  cowSlabGroup.position.set(-1.35, 1.76, 0);
  const cowMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.35,
  });
  const cowCore = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.58, 1.48),
    cowMat
  );
  cowCore.castShadow = true;
  addAnimeInkEdges(cowCore, materials.inkLineMaterial, 24);
  cowSlabGroup.add(cowCore);

  const rwxTex = createPlaqueTexture(
    'PID 5412 PRIVATE CoW',
    'RWX (0x40) UNLOCKED',
    '#451A03',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(rwxTex);
  const cowFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.98, 1.04),
    new THREE.MeshBasicMaterial({ map: rwxTex })
  );
  cowFace.position.set(0, 0.08, 0.76);
  cowSlabGroup.add(cowFace);

  // Hinged Blue Glass Safety Hatch mounted on front-left edge of the CoW slab
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(-1.12, 0, 0.8);
  const hatchGlassMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.42,
  });
  const hatchDoor = new THREE.Mesh(
    new THREE.BoxGeometry(2.24, 1.62, 0.1),
    hatchGlassMat
  );
  hatchDoor.position.set(1.12, 0, 0);
  addAnimeInkEdges(hatchDoor, materials.inkLineMaterial, 24);
  hatchPivot.add(hatchDoor);

  // Hex Lock Bolt on right edge of glass hatch
  const hexBolt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.24, 6),
    materials.createToonMaterial(0xf59e0b, {
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
    })
  );
  hexBolt.rotation.x = Math.PI / 2;
  hexBolt.position.set(2.05, 0, 0.14);
  addAnimeInkEdges(hexBolt, materials.inkLineMaterial, 24);
  hatchPivot.add(hexBolt);

  // Articulated Brass Master Wrench clamped onto the hex bolt
  const wrenchGroup = new THREE.Group();
  wrenchGroup.position.set(2.05, 0, 0.28);
  const wrenchMat = materials.createToonMaterial(0xfacc15, {
    emissive: 0xb45309,
    emissiveIntensity: 0.35,
  });
  const wrenchJaw = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.08, 8, 16, Math.PI * 1.45),
    wrenchMat
  );
  addInvertedHullOutline(wrenchJaw, materials.inkOutlineMaterial, 1.07);
  wrenchGroup.add(wrenchJaw);
  const wrenchHandle = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.14, 0.12),
    wrenchMat
  );
  wrenchHandle.position.set(0.68, 0, 0);
  addAnimeInkEdges(wrenchHandle, materials.inkLineMaterial, 24);
  wrenchGroup.add(wrenchHandle);
  hatchPivot.add(wrenchGroup);

  cowSlabGroup.add(hatchPivot);
  vaultGroup.add(cowSlabGroup);

  // Cutaway Armored Shroud over the vault plinth
  const shroudGroup = new THREE.Group();
  const shroudMat = materials.createToonMaterial(0x475569, {
    transparent: true,
    opacity: 0.35,
  });
  const shroudTop = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 0.25, 2.3),
    shroudMat
  );
  shroudTop.position.set(0, 2.95, 0);
  addAnimeInkEdges(shroudTop, materials.inkLineMaterial, 24);
  shroudGroup.add(shroudTop);
  vaultGroup.add(shroudGroup);

  root.add(vaultGroup);

  // 2) Overhead Ring 0 Kernel ETW-Ti Witness Sensor Rig (EtwTiLogProtectVM)
  const sensorRig = new THREE.Group();
  sensorRig.position.set(-1.9, 3.65, 0.55);

  const sensorMount = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.45, 0.9),
    materials.createToonMaterial(0x1e1b4b)
  );
  addAnimeInkEdges(sensorMount, materials.inkLineMaterial, 24);
  sensorRig.add(sensorMount);

  const uvDomeMat = materials.createToonMaterial(0xa855f7, {
    emissive: 0x9333ea,
    emissiveIntensity: 0.25,
  });
  const uvDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 16, 14),
    uvDomeMat
  );
  uvDome.position.set(0, -0.35, 0.25);
  addInvertedHullOutline(uvDome, materials.inkOutlineMaterial, 1.08);
  sensorRig.add(uvDome);

  const uvPulseMat = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const uvRing = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.62, 32),
    uvPulseMat
  );
  uvRing.position.set(0, -0.35, 0.32);
  sensorRig.add(uvRing);

  const etwTex = createPlaqueTexture(
    'RING 0 KERNEL ETW-TI',
    'EtwTiLogProtectVM',
    '#2E1065',
    '#A855F7',
    '#F3E8FF'
  );
  textures.push(etwTex);
  const etwBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 0.68),
    new THREE.MeshBasicMaterial({ map: etwTex })
  );
  etwBoard.position.set(0, 0.52, 0.46);
  sensorRig.add(etwBoard);

  root.add(sensorRig);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(1.2, 3.1, 0.7);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-1.9, 4.35, 0.6);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(1.4, 3.9, 8.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.3, 0.3),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.2, 0.4),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const s = evaluateAmsiStep2State(timeSec / 12, cutawayMode);

      cowSlabGroup.position.x = -1.35 + s.cowForkSlide * 3.05;
      wrenchGroup.rotation.z = -s.wrenchAngle;
      hexBolt.rotation.y = s.wrenchAngle;
      hatchPivot.rotation.y = -s.hatchOpenRad;

      if (s.rwxGlow > 0.25) {
        cowMat.color.setHex(0xf59e0b);
        cowMat.emissive.setHex(0xd97706);
        cowMat.emissiveIntensity = 0.35 + s.rwxGlow * 0.75;
        hatchGlassMat.color.setHex(0xfbbf24);
        hatchGlassMat.emissive.setHex(0xd97706);
      } else {
        cowMat.color.setHex(0x38bdf8);
        cowMat.emissive.setHex(0x0284c7);
        cowMat.emissiveIntensity = 0.28;
        hatchGlassMat.color.setHex(0x38bdf8);
        hatchGlassMat.emissive.setHex(0x0284c7);
      }

      uvDomeMat.emissiveIntensity = 0.2 + s.ring0Beacon * 1.85;
      uvPulseMat.opacity = s.ring0Beacon * 0.7;
      uvRing.scale.setScalar(1 + s.ring0Beacon * 1.45);

      shroudGroup.position.y = s.cutawayLift * 1.7;
      shroudGroup.visible = s.cutawayLift < 0.95;

      return {
        glitchIntensity: s.rwxGlow * 0.35,
        magicDustIntensity: 0.2 + s.ring0Beacon * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
