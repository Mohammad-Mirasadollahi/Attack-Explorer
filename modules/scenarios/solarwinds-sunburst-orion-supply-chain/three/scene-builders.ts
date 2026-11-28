import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import { createPlaqueTexture } from '@/components/three/step-stage-primitives';

export function buildFoundryBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'AUTOMATED FOUNDRY ASSEMBLY LINE & ROYAL MINT WAX-SEAL PRESS',
  subline = 'SUNSPOT PLATE SWAP  ·  GENUINE SEAL PRESS  ·  14-DAY RADIO CLOCK  ·  GOLDEN SAML',
  accentHex = '#F59E0B'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const subFloor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 13),
    materials.createToonMaterial(0x12101a)
  );
  subFloor.position.set(0, -0.25, -0.6);
  group.add(subFloor);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 0.06, 9.6),
    materials.createToonMaterial(0x1f1b2b)
  );
  deck.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(deck, materials.inkLineMaterial);
  group.add(deck);

  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(16.0, 0.08, 1.55),
    materials.createToonMaterial(0x332b42)
  );
  belt.position.set(0, 0.09, 0.25);
  addAnimeInkEdges(belt, materials.inkLineMaterial);
  group.add(belt);

  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x181424)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const colMat = materials.createToonMaterial(0x2e2640);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), colMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  const signTex = createPlaqueTexture(headline, subline, '#16111F', accentHex, '#FEF3C7', 1024, 240);
  textures.push(signTex);
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 1.68, 0.16),
    materials.createToonMaterial(0xffffff, { map: signTex })
  );
  signBoard.position.set(0, 5.25, -2.56);
  addAnimeInkEdges(signBoard, materials.inkLineMaterial);
  group.add(signBoard);

  return { group, textures };
}

export interface FoundryPressRig {
  group: THREE.Group;
  cleanPlate: THREE.Mesh;
  riggedPlate: THREE.Mesh;
}

export function buildFoundryPress(materials: AnimeMaterialLibrary): FoundryPressRig {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.35, 1.65), materials.createToonMaterial(0x334155));
  base.position.y = 0.675;
  addAnimeInkEdges(base, materials.inkLineMaterial);
  group.add(base);

  const cleanPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.14, 0.9),
    materials.createToonMaterial(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.45 })
  );
  cleanPlate.position.set(-0.3, 1.45, 0);
  addAnimeInkEdges(cleanPlate, materials.inkLineMaterial);
  group.add(cleanPlate);

  const riggedPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.14, 0.9),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.85 })
  );
  riggedPlate.position.set(0.3, 2.35, 0);
  addAnimeInkEdges(riggedPlate, materials.inkLineMaterial);
  group.add(riggedPlate);

  return { group, cleanPlate, riggedPlate };
}

export interface MintSealRig {
  group: THREE.Group;
  stampPiston: THREE.Mesh;
  cutawayHoodPivot: THREE.Group;
  caliperBar: THREE.Mesh;
}

export function buildMintSealPress(materials: AnimeMaterialLibrary): MintSealRig {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 1.6), materials.createToonMaterial(0x78350f));
  frame.position.y = 1.4;
  addAnimeInkEdges(frame, materials.inkLineMaterial);
  group.add(frame);

  const stampPiston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.7, 16),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.85 })
  );
  stampPiston.position.set(0, 2.8, 0.2);
  addAnimeInkEdges(stampPiston, materials.inkLineMaterial);
  group.add(stampPiston);

  const cutawayHoodPivot = new THREE.Group();
  cutawayHoodPivot.position.set(0, 2.85, -0.8);
  group.add(cutawayHoodPivot);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 1.3, 1.55),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.22, depthWrite: false })
  );
  hood.position.set(0, -0.65, 0.8);
  cutawayHoodPivot.add(hood);

  const caliperBar = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.25, 1.8),
    materials.createToonMaterial(0x10b981, { emissive: 0x34d399, emissiveIntensity: 0.85 })
  );
  caliperBar.position.set(0, 4.6, 0);
  addAnimeInkEdges(caliperBar, materials.inkLineMaterial);
  group.add(caliperBar);

  return { group, stampPiston, cutawayHoodPivot, caliperBar };
}

export interface RadioClockRig {
  group: THREE.Group;
  spireOrb: THREE.Mesh;
  samlPass: THREE.Mesh;
}

export function buildRadioClockTower(materials: AnimeMaterialLibrary): RadioClockRig {
  const group = new THREE.Group();
  const tower = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.1, 1.6), materials.createToonMaterial(0x1e293b));
  tower.position.y = 1.55;
  addAnimeInkEdges(tower, materials.inkLineMaterial);
  group.add(tower);

  const spireOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 12),
    materials.createToonMaterial(0xf43f5e, { emissive: 0xe11d48, emissiveIntensity: 0.75 })
  );
  spireOrb.position.set(0, 3.55, 0);
  group.add(spireOrb);

  const samlPass = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.65, 0.14),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.85 })
  );
  samlPass.position.set(0, 2.2, 0.92);
  addAnimeInkEdges(samlPass, materials.inkLineMaterial);
  group.add(samlPass);

  return { group, spireOrb, samlPass };
}
