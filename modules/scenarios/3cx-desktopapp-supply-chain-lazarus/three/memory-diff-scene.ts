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
import { evaluateThreeCxMemoryDiffState } from '../choreography';

/**
 * MOD-18 Standalone Diorama — 3CX Memory Forensics (`threecx-memory-diff`)
 * Room: Dual Forensic Optical Comparator Bench (Clean Stock Prism vs 0xFEEDFACE Amber Trailer + Floating Unbacked Core).
 */
export function buildThreeCxMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x262938,
    floorTrimHex: 0xe11d48,
    wallColor: 0x1a1e2e,
    pillarColor: 0x0f172a,
    signTitle: 'MEMORY FORENSICS · PRISM & RWX DIFF',
    signSubtitle: 'CLEAN MICROSOFT DLL VS. 0xFEEDFACE TRAILER + UNBACKED RWX',
    signBgHex: '#0F172A',
    signBorderHex: '#E11D48',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const skyMat = materials.createToonMaterial(0x38bdf8);
  const amberMat = materials.createToonMaterial(0xf59e0b);
  const crimsonMat = materials.createToonMaterial(0xe11d48);

  // Prop 1: Left Emerald Forensic Plinth — Clean Microsoft d3dcompiler_47.dll (Clean EOF)
  const leftGroup = new THREE.Group();
  leftGroup.position.set(-3.1, 0, 0.2);
  leftGroup.add(createContactDisc(materials, 1.75));

  const leftPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.0, 2.2), darkMat);
  leftPlinth.position.y = 0.5;
  addAnimeInkEdges(leftPlinth, materials.inkLineMaterial, 24);
  leftGroup.add(leftPlinth);

  const cleanPrism = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), skyMat);
  cleanPrism.position.y = 2.05;
  addAnimeInkEdges(cleanPrism, materials.inkLineMaterial, 22);
  leftGroup.add(cleanPrism);

  const cleanTex = createPlaqueTexture(
    'CLEAN STOCK PRISM',
    'CLEAN EOF · 0 OVERLAY',
    '#064E3B',
    '#10B981',
    '#ECFDF5'
  );
  textures.push(cleanTex);
  const cleanPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.75, 0.62),
    new THREE.MeshBasicMaterial({ map: cleanTex })
  );
  cleanPlaque.position.set(0, 0.52, 1.12);
  leftGroup.add(cleanPlaque);
  root.add(leftGroup);

  // Prop 2: Right Crimson Forensic Plinth — Trojanized Prism + 0xFEEDFACE Amber Cylinder + Floating Unbacked Core
  const rightGroup = new THREE.Group();
  rightGroup.position.set(2.2, 0, 0.2);
  rightGroup.add(createContactDisc(materials, 2.35));

  const rightPlinth = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.0, 2.2), darkMat);
  rightPlinth.position.y = 0.5;
  addAnimeInkEdges(rightPlinth, materials.inkLineMaterial, 24);
  rightGroup.add(rightPlinth);

  // Bolted Amber 0xFEEDFACE + 312 KB RC4 Trailer Cylinder beneath Prism
  const amberTrailer = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.72, 0.68, 16), amberMat);
  amberTrailer.position.set(-0.95, 1.36, 0);
  addAnimeInkEdges(amberTrailer, materials.inkLineMaterial, 24);
  rightGroup.add(amberTrailer);

  const trojanPrism = new THREE.Mesh(new THREE.OctahedronGeometry(0.76, 0), skyMat);
  trojanPrism.position.set(-0.95, 2.32, 0);
  addAnimeInkEdges(trojanPrism, materials.inkLineMaterial, 22);
  rightGroup.add(trojanPrism);

  // Floating Unbacked MEM_PRIVATE RWX Crimson Core (zero pedestal below it!)
  const floatingCore = new THREE.Group();
  const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.56, 0), crimsonMat);
  addAnimeInkEdges(coreMesh, materials.inkLineMaterial, 22);
  const coreHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.055, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xe11d48, toneMapped: false })
  );
  floatingCore.add(coreMesh, coreHalo);
  floatingCore.position.set(1.15, 2.45, 0);
  rightGroup.add(floatingCore);

  // Cutaway glass inspection bell over right plinth
  const bellMat = new THREE.MeshToonMaterial({
    color: 0xfecdd3,
    transparent: true,
    opacity: 0.42,
    gradientMap: materials.gradientMap,
  });
  const glassBell = new THREE.Mesh(new THREE.BoxGeometry(4.3, 2.4, 1.95), bellMat);
  glassBell.position.set(0, 2.22, 0);
  rightGroup.add(glassBell);

  const dirtyTex = createPlaqueTexture(
    '0xFEEDFACE + UNBACKED RWX',
    '0x1C948200000 · 312 KB',
    '#4C0519',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(dirtyTex);
  const dirtyPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 0.62),
    new THREE.MeshBasicMaterial({ map: dirtyTex })
  );
  dirtyPlaque.position.set(0, 0.52, 1.12);
  rightGroup.add(dirtyPlaque);
  root.add(rightGroup);

  // Prop 3: Overhead Sweeping Crimson/Gold Forensic X-Ray Laser Gantry
  const scanBeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 3.6, 2.8),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.28,
      toneMapped: false,
    })
  );
  scanBeam.position.set(-3.4, 2.1, 0.2);
  root.add(scanBeam);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 3.2, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.2, 3.35, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.1, 4.2, 10.2),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.1, 2.1, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateThreeCxMemoryDiffState(timeSec, cutawayMode);

      cleanPrism.rotation.y = timeSec * 1.1;
      trojanPrism.rotation.y = -timeSec * 1.1;
      amberTrailer.scale.setScalar(1 + s.amberTrailerHighlight * 0.14);

      const lift = easeOutCubic(s.floatingCoreLift);
      floatingCore.position.y = 2.25 + lift * 0.55 + Math.sin(timeSec * 3.0) * 0.12;
      floatingCore.rotation.y = timeSec * 1.8;
      coreHalo.rotation.x = timeSec * 2.2;

      scanBeam.position.x = s.laserSweepX;
      bellMat.opacity = 0.45 - s.cutawayOpen * 0.36;

      return {
        glitchIntensity: 0.12 + s.floatingCoreLift * 0.22,
        magicDustIntensity: 0.35 + s.amberTrailerHighlight * 0.25,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
