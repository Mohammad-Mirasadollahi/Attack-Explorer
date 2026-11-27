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
import { evaluateAmsiMemoryDiffState } from '../choreography';

/**
 * Standalone 3D Scene: AMSI Memory Forensics — 3-Pedestal Laser Comparator Lab
 * comparing Clean On-Disk amsi.dll (Left) vs Dirty CoW RAM Brass Jumper (Center)
 * vs Unbacked Floating MEM_PRIVATE RWX Drone (Right).
 */
export function buildAmsiMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f172a,
    floorTrimHex: 0x10b981,
    wallColor: 0x1e293b,
    pillarColor: 0x020617,
    signTitle: 'FORENSIC MEMORY INTEGRITY COMPARATOR',
    signSubtitle: 'ON-DISK SEC_IMAGE vs DIRTY CoW PAGE vs UNBACKED MEM_PRIVATE RWX',
    signBgHex: '#020617',
    signBorderHex: '#10B981',
    signTitleHex: '#ECFDF5',
    signSubHex: '#6EE7B7',
    width: 15.0,
    depth: 10.0,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const pedestalMat = materials.createToonMaterial(0x1e293b);
  const glassMat = materials.createToonMaterial(0x94a3b8, {
    transparent: true,
    opacity: 0.22,
  });
  const glassHoods: THREE.Mesh[] = [];

  const addPedestal = (
    x: number,
    header: string,
    body: string,
    accentHex: string
  ) => {
    const g = new THREE.Group();
    g.position.set(x, 0, 0.2);
    g.add(createContactDisc(materials, 1.55));
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.15, 1.8),
      pedestalMat
    );
    base.position.y = 0.575;
    base.castShadow = true;
    addAnimeInkEdges(base, materials.inkLineMaterial, 24);
    g.add(base);

    const tex = createPlaqueTexture(header, body, '#0F172A', accentHex);
    textures.push(tex);
    const frontPlaque = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 0.78),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    frontPlaque.position.set(0, 0.62, 0.92);
    g.add(frontPlaque);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.55, 1.6), glassMat);
    hood.position.y = 1.95;
    addAnimeInkEdges(hood, materials.inkLineMaterial, 24);
    g.add(hood);
    glassHoods.push(hood);

    root.add(g);
    return g;
  };

  // Pedestal 1 (Left): Clean On-Disk System32\amsi.dll (6 Intact Copper Fuses)
  const leftPed = addPedestal(-3.6, 'DISK SEC_IMAGE', '4C 8B DC 49 89 5B', '#10B981');
  const cleanPinMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x059669,
    emissiveIntensity: 0.65,
  });
  for (let i = 0; i < 6; i += 1) {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.62, 12),
      cleanPinMat
    );
    pin.position.set(-0.75 + i * 0.3, 1.56, 0);
    leftPed.add(pin);
  }

  // Pedestal 2 (Center): Dirty Private CoW RAM (6-Pin Brass U-Jumper)
  const centerPed = addPedestal(0.0, 'DIRTY CoW RAM', 'B8 57 00 07 80 C3', '#F59E0B');
  const dirtyJumperMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xd97706,
    emissiveIntensity: 0.7,
  });
  const dirtyBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.28, 0.36),
    dirtyJumperMat
  );
  dirtyBar.position.set(0, 1.82, 0);
  addAnimeInkEdges(dirtyBar, materials.inkLineMaterial, 24);
  centerPed.add(dirtyBar);
  for (let i = 0; i < 6; i += 1) {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.45, 10),
      dirtyJumperMat
    );
    pin.position.set(-0.75 + i * 0.3, 1.48, 0);
    centerPed.add(pin);
  }

  // Pedestal 3 (Right): Unbacked MEM_PRIVATE RWX Hovering Drone (FileObject = NULL)
  const rightPed = addPedestal(3.6, 'MEM_PRIVATE RWX', 'FILEOBJECT = NULL', '#E11D48');
  const floatDrone = new THREE.Group();
  floatDrone.position.set(0, 2.05, 0);
  const floatCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.36, 0),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.95,
    })
  );
  addInvertedHullOutline(floatCore, materials.inkOutlineMaterial, 1.08);
  floatDrone.add(floatCore);
  const floatRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.64, 0.07, 10, 24),
    materials.createToonMaterial(0xfacc15)
  );
  floatRing.rotation.x = Math.PI / 2;
  floatDrone.add(floatRing);
  rightPed.add(floatDrone);

  // Overhead Sweeping Forensic Laser Gantry
  const gantryRail = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.18, 0.22),
    materials.createToonMaterial(0x334155)
  );
  gantryRail.position.set(0, 3.65, 0.2);
  root.add(gantryRail);

  const laserCarriage = new THREE.Group();
  laserCarriage.position.set(-3.6, 3.65, 0.2);
  const laserHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.32, 0.48),
    materials.createToonMaterial(0xe11d48)
  );
  addAnimeInkEdges(laserHead, materials.inkLineMaterial, 24);
  laserCarriage.add(laserHead);
  const laserCurtainMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.36,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const laserCurtain = new THREE.Mesh(
    new THREE.PlaneGeometry(0.12, 2.85),
    laserCurtainMat
  );
  laserCurtain.rotation.y = Math.PI / 2;
  laserCurtain.position.y = -1.52;
  laserCarriage.add(laserCurtain);
  root.add(laserCarriage);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.6, 3.1, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.6, 3.3, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 10.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 1.9, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.1, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const s = evaluateAmsiMemoryDiffState(timeSec / 14, cutawayMode);
      laserCarriage.position.x = s.scannerX;
      laserCurtainMat.color.setHex(
        s.unbackedHighlight > 0.3
          ? 0xe11d48
          : s.dirtyHighlight > 0.3
            ? 0xf59e0b
            : 0x10b981
      );
      dirtyJumperMat.emissiveIntensity = 0.45 + s.dirtyHighlight * 1.1;
      floatDrone.rotation.y = s.droneSpinRad;
      floatDrone.position.y = 2.0 + Math.sin(s.droneSpinRad) * 0.14;

      for (const hood of glassHoods) {
        hood.position.y = 1.95 + s.cutawayLift * 1.6;
        hood.visible = s.cutawayLift < 0.92;
      }

      return {
        glitchIntensity: s.unbackedHighlight * 0.26,
        magicDustIntensity: 0.25 + s.dirtyHighlight * 0.3,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
