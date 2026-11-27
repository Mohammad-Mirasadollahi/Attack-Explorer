import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createMintSignTexture(
  headline: string,
  subline: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 240;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#120e1a';
  ctx.fillRect(0, 0, 1024, 240);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 996, 212);

  ctx.fillStyle = accentHex;
  ctx.fillRect(14, 14, 996, 14);

  ctx.fillStyle = '#FEF3C7';
  ctx.font = '900 35px "Plus Jakarta Sans", sans-serif';
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

export function buildMintPlazaBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'TWIN-TOWER SOVEREIGN MINT & LEDGER BRIDGE',
  subline = 'DOMAIN ROOT ACL  ·  MS-DRSR EXPRESS BRIDGE  ·  EID 4662 AUDIT TOWER',
  accentHex = '#F59E0B'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const subFloor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 13),
    materials.createToonMaterial(0x0f121e)
  );
  subFloor.position.set(0, -0.25, -0.6);
  group.add(subFloor);

  const plazaDeck = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 0.06, 9.6),
    materials.createToonMaterial(0x1e2436)
  );
  plazaDeck.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(plazaDeck, materials.inkLineMaterial);
  group.add(plazaDeck);

  // Obsidian-gold sovereign causeway
  const causeway = new THREE.Mesh(
    new THREE.BoxGeometry(15.8, 0.04, 1.55),
    materials.createToonMaterial(0x78350f)
  );
  causeway.position.set(0, 0.075, 0.25);
  addAnimeInkEdges(causeway, materials.inkLineMaterial);
  group.add(causeway);

  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x161b2e)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const pilasterMat = materials.createToonMaterial(0x334155);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), pilasterMat);
    pil.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(pil, materials.inkLineMaterial);
    group.add(pil);
  }

  const signTex = createMintSignTexture(headline, subline, accentHex);
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

export interface SovereignMintTowerRig {
  group: THREE.Group;
  crownCore: THREE.Mesh;
  aclRibbon: THREE.Mesh;
  peerGateShield: THREE.Mesh;
}

export function buildSovereignMintTower(materials: AnimeMaterialLibrary): SovereignMintTowerRig {
  const group = new THREE.Group();

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 0.75, 2.0),
    materials.createToonMaterial(0x334155)
  );
  plinth.position.set(0, 0.375, 0);
  addAnimeInkEdges(plinth, materials.inkLineMaterial);
  group.add(plinth);

  const shaft = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 2.65, 1.75),
    materials.createToonMaterial(0x1e293b)
  );
  shaft.position.set(0, 2.05, 0);
  addAnimeInkEdges(shaft, materials.inkLineMaterial);
  group.add(shaft);

  const goldRoof = new THREE.Mesh(
    new THREE.BoxGeometry(2.58, 0.26, 1.92),
    materials.createToonMaterial(0xd97706)
  );
  goldRoof.position.set(0, 3.48, 0);
  addAnimeInkEdges(goldRoof, materials.inkLineMaterial);
  group.add(goldRoof);

  // Glowing Crown Seal core (krbtgt secret store)
  const crownCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.46, 0),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
    })
  );
  crownCore.position.set(0, 2.15, 0.96);
  addInvertedHullOutline(crownCore, materials.inkOutlineMaterial, 1.07);
  group.add(crownCore);

  // Over-privileged ACL ribbon on gatehouse
  const aclRibbon = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.32, 0.16),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.75,
    })
  );
  aclRibbon.position.set(0, 1.12, 0.94);
  addAnimeInkEdges(aclRibbon, materials.inkLineMaterial);
  group.add(aclRibbon);

  // Peer-only emerald gate shield
  const peerGateShield = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 3.25, 0.14),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.42,
    })
  );
  (peerGateShield.material as THREE.MeshToonMaterial).depthWrite = false;
  peerGateShield.position.set(0, 1.95, 1.15);
  peerGateShield.visible = false;
  group.add(peerGateShield);

  return { group, crownCore, aclRibbon, peerGateShield };
}

export interface ArmoredLedgerBridgeRig {
  group: THREE.Group;
  cutawayGlassPivot: THREE.Group;
  ledgerCapsule: THREE.Mesh;
}

export function buildArmoredLedgerBridge(materials: AnimeMaterialLibrary): ArmoredLedgerBridgeRig {
  const group = new THREE.Group();

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.24, 1.45),
    materials.createToonMaterial(0x475569)
  );
  deck.position.set(0, 1.88, 0);
  addAnimeInkEdges(deck, materials.inkLineMaterial);
  group.add(deck);

  for (const bx of [-2.4, 2.4]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 1.88, 1.25),
      materials.createToonMaterial(0x334155)
    );
    leg.position.set(bx, 0.94, 0);
    addAnimeInkEdges(leg, materials.inkLineMaterial);
    group.add(leg);
  }

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.18, 1.45),
    materials.createToonMaterial(0xd97706)
  );
  roof.position.set(0, 3.02, 0);
  addAnimeInkEdges(roof, materials.inkLineMaterial);
  group.add(roof);

  // Cutaway glass side panel
  const cutawayGlassPivot = new THREE.Group();
  cutawayGlassPivot.position.set(0, 2.94, 0.72);
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.95, 0.08),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.34,
    })
  );
  (glass.material as THREE.MeshToonMaterial).depthWrite = false;
  glass.position.set(0, -0.48, 0);
  cutawayGlassPivot.add(glass);
  group.add(cutawayGlassPivot);

  // Golden crown-ledger packet gliding along bridge
  const ledgerCapsule = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.44, 0.56),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    })
  );
  ledgerCapsule.position.set(-2.1, 2.34, 0);
  addInvertedHullOutline(ledgerCapsule, materials.inkOutlineMaterial, 1.06);
  group.add(ledgerCapsule);

  return { group, cutawayGlassPivot, ledgerCapsule };
}

export interface RogueCourierCarRig {
  group: THREE.Group;
  beacon: THREE.Mesh;
}

export function buildRogueCourierCar(materials: AnimeMaterialLibrary): RogueCourierCarRig {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 1.15, 1.38),
    materials.createToonMaterial(0x881337)
  );
  body.position.set(0, 0.88, 0);
  addAnimeInkEdges(body, materials.inkLineMaterial);
  group.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.68, 1.24),
    materials.createToonMaterial(0xbe123c)
  );
  cabin.position.set(-0.25, 1.72, 0);
  addAnimeInkEdges(cabin, materials.inkLineMaterial);
  group.add(cabin);

  for (const wx of [-0.72, 0.72]) {
    for (const wz of [-0.66, 0.66]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.2, 14),
        materials.createToonMaterial(0x0f172a)
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.32, wz);
      group.add(wheel);
    }
  }

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 14, 14),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.85,
    })
  );
  beacon.position.set(-0.25, 2.24, 0);
  group.add(beacon);

  return { group, beacon };
}

export interface MintAuditTowerRig {
  group: THREE.Group;
  alarmBeacon: THREE.Mesh;
  rosterPlate: THREE.Mesh;
}

export function buildMintAuditTower(materials: AnimeMaterialLibrary): MintAuditTowerRig {
  const group = new THREE.Group();

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 3.15, 1.55),
    materials.createToonMaterial(0x1e293b)
  );
  tower.position.set(0, 1.575, 0);
  addAnimeInkEdges(tower, materials.inkLineMaterial);
  group.add(tower);

  const rosterPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.68, 1.52, 0.14),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
    })
  );
  rosterPlate.position.set(0, 1.85, 0.82);
  addAnimeInkEdges(rosterPlate, materials.inkLineMaterial);
  group.add(rosterPlate);

  const alarmBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 16),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
    })
  );
  alarmBeacon.position.set(0, 3.45, 0);
  group.add(alarmBeacon);

  return { group, alarmBeacon, rosterPlate };
}
