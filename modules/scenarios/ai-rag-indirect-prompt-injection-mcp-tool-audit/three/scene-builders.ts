import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import { createPlaqueTexture } from '@/components/three/step-stage-primitives';

export function buildLibraryBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'GRAND REFERENCE LIBRARY & RESEARCH BUTLER PNEUMATIC CHUTE',
  subline = 'POISONED PAMPHLET  ·  UNSEPARATED READING TRAY  ·  MCP CHUTE EXFIL  ·  DATA/POLICY GLASS',
  accentHex = '#A855F7'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const subFloor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 13), materials.createToonMaterial(0x130e1f));
  subFloor.position.set(0, -0.25, -0.6);
  group.add(subFloor);

  const parquet = new THREE.Mesh(new THREE.BoxGeometry(21.4, 0.06, 9.6), materials.createToonMaterial(0x211936));
  parquet.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(parquet, materials.inkLineMaterial);
  group.add(parquet);

  const carpet = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.05, 1.5), materials.createToonMaterial(0x3b1f5e));
  carpet.position.set(0, 0.08, 0.25);
  addAnimeInkEdges(carpet, materials.inkLineMaterial);
  group.add(carpet);

  const rearWall = new THREE.Mesh(new THREE.BoxGeometry(22.4, 7.2, 0.36), materials.createToonMaterial(0x19122b));
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const shelfMat = materials.createToonMaterial(0x2f234c);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.26), shelfMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  const signTex = createPlaqueTexture(headline, subline, '#1A0D2E', accentHex, '#F3E8FF', 1024, 240);
  textures.push(signTex);
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(7.8, 1.68, 0.16),
    materials.createToonMaterial(0xffffff, { map: signTex })
  );
  signBoard.position.set(0, 5.25, -2.56);
  addAnimeInkEdges(signBoard, materials.inkLineMaterial);
  group.add(signBoard);

  return { group, textures };
}

export interface ButlerDeskRig {
  group: THREE.Group;
  trayCoverPivot: THREE.Group;
  pamphletCard: THREE.Mesh;
  blendGlowBar: THREE.Mesh;
  glassPartition: THREE.Mesh;
}

export function buildButlerDesk(materials: AnimeMaterialLibrary): ButlerDeskRig {
  const group = new THREE.Group();

  const desk = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.0, 1.8), materials.createToonMaterial(0x312e81));
  desk.position.y = 1.0;
  addAnimeInkEdges(desk, materials.inkLineMaterial);
  group.add(desk);

  const trayCoverPivot = new THREE.Group();
  trayCoverPivot.position.set(0, 2.05, -0.9);
  group.add(trayCoverPivot);
  const trayCover = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.15, 1.75),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.22, depthWrite: false })
  );
  trayCover.position.set(0, -0.58, 0.9);
  trayCoverPivot.add(trayCover);

  const pamphletCard = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.14, 0.8),
    materials.createToonMaterial(0xf59e0b, { emissive: 0xd97706, emissiveIntensity: 0.85 })
  );
  pamphletCard.position.set(-2.6, 2.35, 0.35);
  addAnimeInkEdges(pamphletCard, materials.inkLineMaterial);
  group.add(pamphletCard);

  const blendGlowBar = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.24, 0.35),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  blendGlowBar.position.set(0, 2.15, 0.55);
  addAnimeInkEdges(blendGlowBar, materials.inkLineMaterial);
  group.add(blendGlowBar);

  const glassPartition = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 2.2, 1.85),
    materials.createToonMaterial(0x10b981, { emissive: 0x34d399, emissiveIntensity: 0.9 })
  );
  glassPartition.position.set(0, 4.6, 0);
  addAnimeInkEdges(glassPartition, materials.inkLineMaterial);
  group.add(glassPartition);

  return { group, trayCoverPivot, pamphletCard, blendGlowBar, glassPartition };
}

export interface PneumaticChuteRig {
  group: THREE.Group;
  capsule: THREE.Mesh;
  ledgerLamp: THREE.Mesh;
}

export function buildPneumaticChute(materials: AnimeMaterialLibrary): PneumaticChuteRig {
  const group = new THREE.Group();

  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 3.2, 16), materials.createToonMaterial(0x334155));
  tube.position.y = 1.6;
  addAnimeInkEdges(tube, materials.inkLineMaterial);
  group.add(tube);

  const capsule = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.72, 14),
    materials.createToonMaterial(0xf43f5e, { emissive: 0xe11d48, emissiveIntensity: 0.95 })
  );
  capsule.position.set(0, 0.7, 0.65);
  addAnimeInkEdges(capsule, materials.inkLineMaterial);
  group.add(capsule);

  const ledgerLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 14, 10),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  ledgerLamp.position.set(0, 3.45, 0);
  group.add(ledgerLamp);

  return { group, capsule, ledgerLamp };
}
