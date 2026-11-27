import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createHarborSignTexture(
  headline: string,
  subline: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 240;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0c1828';
  ctx.fillRect(0, 0, 1024, 240);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 996, 212);

  ctx.fillStyle = accentHex;
  ctx.fillRect(14, 14, 996, 14);

  ctx.fillStyle = '#FEF3C7';
  ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(headline, 512, 98);

  ctx.fillStyle = accentHex;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(subline, 512, 172);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildHarborBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'COASTAL LIGHTHOUSE & CARRIER-PIGEON RELAY',
  subline = 'WALLED HARBOR DESK  ·  POSTMASTER TOWER  ·  SINKHOLE NET',
  accentHex = '#38BDF8'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Deep maritime harbor water base
  const seaFloor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 13),
    materials.createToonMaterial(0x0b1626)
  );
  seaFloor.position.set(0, -0.25, -0.6);
  group.add(seaFloor);

  // Stone harbor quay deck
  const quayFloor = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 0.06, 9.6),
    materials.createToonMaterial(0x16253b)
  );
  quayFloor.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(quayFloor, materials.inkLineMaterial);
  group.add(quayFloor);

  // Harbor stone seawall divider lane running across middle-right
  const seawallStrip = new THREE.Mesh(
    new THREE.BoxGeometry(15.6, 0.04, 1.55),
    materials.createToonMaterial(0x1e3a5f)
  );
  seawallStrip.position.set(0, 0.075, 0.25);
  addAnimeInkEdges(seawallStrip, materials.inkLineMaterial);
  group.add(seawallStrip);

  // Night storm sky backdrop wall
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x111f34)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  // Coastal fortress stone pilasters
  const colMat = materials.createToonMaterial(0x243b55);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), colMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  // Harbor notice board (strictly ahead of pilasters)
  const signTex = createHarborSignTexture(headline, subline, accentHex);
  textures.push(signTex);
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 1.68, 0.16),
    materials.createToonMaterial(0xffffff, { map: signTex })
  );
  signBoard.position.set(0.85, 5.25, -2.56);
  addAnimeInkEdges(signBoard, materials.inkLineMaterial);
  group.add(signBoard);

  return { group, textures };
}

export interface ClerkDeskRig {
  group: THREE.Group;
  cutawayHoodPivot: THREE.Group;
  slips: THREE.Mesh[];
  skylightLens: THREE.Mesh;
}

export function buildClerkDispatchDesk(materials: AnimeMaterialLibrary): ClerkDeskRig {
  const group = new THREE.Group();

  const deskBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 1.55, 1.75),
    materials.createToonMaterial(0x1e293b)
  );
  deskBody.position.set(0, 0.775, 0);
  addAnimeInkEdges(deskBody, materials.inkLineMaterial);
  group.add(deskBody);

  const timberTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.05, 0.16, 1.88),
    materials.createToonMaterial(0x78350f)
  );
  timberTop.position.set(0, 1.63, 0);
  addAnimeInkEdges(timberTop, materials.inkLineMaterial);
  group.add(timberTop);

  // Three crimson scrambled paper slips sliced on the desk
  const slips: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const slip = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.08, 0.36),
      materials.createToonMaterial(0xf43f5e, {
        emissive: 0xe11d48,
        emissiveIntensity: 0.65,
      })
    );
    slip.position.set(-0.78 + i * 0.78, 1.76, 0.15);
    addInvertedHullOutline(slip, materials.inkOutlineMaterial, 1.07);
    group.add(slip);
    slips.push(slip);
  }

  // Transparent cutaway inspection hood (Sysmon EID 22 attribution)
  const cutawayHoodPivot = new THREE.Group();
  cutawayHoodPivot.position.set(0, 2.55, -0.88);
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 1.0, 1.76),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.28,
    })
  );
  (hood.material as THREE.MeshToonMaterial).depthWrite = false;
  hood.position.set(0, -0.45, 0.88);
  cutawayHoodPivot.add(hood);
  group.add(cutawayHoodPivot);

  // Overhead blue watchtower skylight lens (Sysmon process observer)
  const skylightLens = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 14, 14),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.85,
    })
  );
  skylightLens.position.set(0, 3.05, 0);
  group.add(skylightLens);

  return { group, cutawayHoodPivot, slips, skylightLens };
}

export interface PostmasterTowerRig {
  group: THREE.Group;
  watchLamp: THREE.Mesh;
  seawallBarrier: THREE.Mesh;
  relayArch: THREE.Mesh;
}

export function buildPostmasterRelayTower(
  materials: AnimeMaterialLibrary
): PostmasterTowerRig {
  const group = new THREE.Group();

  const towerBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.9, 1.7),
    materials.createToonMaterial(0x243b55)
  );
  towerBase.position.set(0, 1.45, 0);
  addAnimeInkEdges(towerBase, materials.inkLineMaterial);
  group.add(towerBase);

  const brassRoof = new THREE.Mesh(
    new THREE.ConeGeometry(1.55, 0.95, 4),
    materials.createToonMaterial(0xb45309)
  );
  brassRoof.rotation.y = Math.PI / 4;
  brassRoof.position.set(0, 3.38, 0);
  addAnimeInkEdges(brassRoof, materials.inkLineMaterial);
  group.add(brassRoof);

  // Stone seawall blocking low direct cargo traffic
  const seawallBarrier = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 1.55, 3.2),
    materials.createToonMaterial(0x475569)
  );
  seawallBarrier.position.set(1.55, 0.775, 0);
  addAnimeInkEdges(seawallBarrier, materials.inkLineMaterial);
  group.add(seawallBarrier);

  // Sky relay flight ring
  const relayArch = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.08, 10, 24),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.7,
    })
  );
  relayArch.position.set(0, 2.4, 0.95);
  group.add(relayArch);

  // Coastguard entropy alarm lamp atop watchtower
  const watchLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 16),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.65,
    })
  );
  watchLamp.position.set(0, 4.1, 0);
  group.add(watchLamp);

  return { group, watchLamp, seawallBarrier, relayArch };
}

export interface OffshoreLighthouseRig {
  group: THREE.Group;
  lanternCore: THREE.Mesh;
  carrierPigeon: THREE.Group;
  sinkholeNet: THREE.Mesh;
}

export function buildOffshoreLighthouse(
  materials: AnimeMaterialLibrary
): OffshoreLighthouseRig {
  const group = new THREE.Group();

  // Rocky island plinth
  const rock = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.75, 0.55, 10),
    materials.createToonMaterial(0x334155)
  );
  rock.position.set(0, 0.275, 0);
  addAnimeInkEdges(rock, materials.inkLineMaterial);
  group.add(rock);

  // Striped lighthouse tower body
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.92, 3.1, 14),
    materials.createToonMaterial(0xe2e8f0)
  );
  tower.position.set(0, 2.1, 0);
  addAnimeInkEdges(tower, materials.inkLineMaterial);
  group.add(tower);

  const crimsonBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.78, 0.72, 14),
    materials.createToonMaterial(0xe11d48)
  );
  crimsonBand.position.set(0, 2.25, 0);
  addAnimeInkEdges(crimsonBand, materials.inkLineMaterial);
  group.add(crimsonBand);

  // Brass lantern dome & glowing core (TXT reply flashes)
  const lanternCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.66, 14),
    materials.createToonMaterial(0xf59e0b, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    })
  );
  lanternCore.position.set(0, 3.98, 0);
  group.add(lanternCore);

  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(0.68, 0.65, 14),
    materials.createToonMaterial(0x0f172a)
  );
  cap.position.set(0, 4.62, 0);
  addAnimeInkEdges(cap, materials.inkLineMaterial);
  group.add(cap);

  // Carrier pigeon with glowing crimson scroll pouch
  const carrierPigeon = new THREE.Group();
  const birdBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.24, 0.28),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
    })
  );
  addInvertedHullOutline(birdBody, materials.inkOutlineMaterial, 1.07);
  carrierPigeon.add(birdBody);
  const pouch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.34, 8),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.95,
    })
  );
  pouch.rotation.z = Math.PI / 2;
  pouch.position.set(0, -0.18, 0);
  carrierPigeon.add(pouch);
  carrierPigeon.position.set(-4.5, 3.2, 0.4);
  group.add(carrierPigeon);

  // Emerald coastguard sinkhole dome net (DNS RPZ containment)
  const sinkholeNet = new THREE.Mesh(
    new THREE.CylinderGeometry(1.85, 2.05, 4.9, 12),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.72,
      transparent: true,
      opacity: 0.36,
    })
  );
  (sinkholeNet.material as THREE.MeshToonMaterial).depthWrite = false;
  sinkholeNet.position.set(0, 2.55, 0);
  sinkholeNet.visible = false;
  group.add(sinkholeNet);

  return { group, lanternCore, carrierPigeon, sinkholeNet };
}
