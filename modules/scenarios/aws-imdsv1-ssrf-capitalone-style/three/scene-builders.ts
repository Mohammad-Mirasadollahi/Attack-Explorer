import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import { createPlaqueTexture } from '@/components/three/step-stage-primitives';

export function buildHotelLobbyBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'CLOUD HOTEL CONCIERGE DESK & ROOFTOP KEY-CARD VAULT',
  subline = 'FRONT-DESK PROXY  ·  LINK-LOCAL KIOSK  ·  ROOFTOP LOCKERS  ·  IMDSV2 TURNSTILE',
  accentHex = '#F59E0B'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const subFloor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 13),
    materials.createToonMaterial(0x0b1524)
  );
  subFloor.position.set(0, -0.25, -0.6);
  group.add(subFloor);

  const marbleFloor = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 0.06, 9.6),
    materials.createToonMaterial(0x162438)
  );
  marbleFloor.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(marbleFloor, materials.inkLineMaterial);
  group.add(marbleFloor);

  const brassRunway = new THREE.Mesh(
    new THREE.BoxGeometry(15.6, 0.04, 1.55),
    materials.createToonMaterial(0x3a2a10)
  );
  brassRunway.position.set(0, 0.075, 0.25);
  addAnimeInkEdges(brassRunway, materials.inkLineMaterial);
  group.add(brassRunway);

  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x101e31)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const colMat = materials.createToonMaterial(0x233852);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), colMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  const signTex = createPlaqueTexture(
    headline,
    subline,
    '#0E1726',
    accentHex,
    '#FEF3C7',
    1024,
    240
  );
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

export interface ConciergeDeskRig {
  group: THREE.Group;
  forgedSlip: THREE.Mesh;
}

export function buildConciergeDesk(materials: AnimeMaterialLibrary): ConciergeDeskRig {
  const group = new THREE.Group();
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 1.4, 1.6),
    materials.createToonMaterial(0x1e3a5f)
  );
  desk.position.y = 0.7;
  addAnimeInkEdges(desk, materials.inkLineMaterial);
  group.add(desk);

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 1.1, 0.12),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    })
  );
  glass.position.set(0, 1.95, 0.45);
  group.add(glass);

  const forgedSlip = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.08, 0.52),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.85,
    })
  );
  forgedSlip.position.set(-1.2, 1.48, 0.35);
  addAnimeInkEdges(forgedSlip, materials.inkLineMaterial);
  group.add(forgedSlip);

  return { group, forgedSlip };
}

export interface KeycardKioskRig {
  group: THREE.Group;
  cutawayHoodPivot: THREE.Group;
  brassKeycard: THREE.Mesh;
  turnstileGate: THREE.Mesh;
  radarLamp: THREE.Mesh;
}

export function buildKeycardKiosk(materials: AnimeMaterialLibrary): KeycardKioskRig {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.7, 1.5),
    materials.createToonMaterial(0x78350f)
  );
  body.position.y = 1.35;
  addAnimeInkEdges(body, materials.inkLineMaterial);
  group.add(body);

  const cutawayHoodPivot = new THREE.Group();
  cutawayHoodPivot.position.set(0, 2.7, -0.75);
  group.add(cutawayHoodPivot);

  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 1.35, 1.45),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  hood.position.set(0, -0.68, 0.75);
  cutawayHoodPivot.add(hood);

  const brassKeycard = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.1, 0.58),
    materials.createToonMaterial(0xfbbf24, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    })
  );
  brassKeycard.position.set(0, 1.85, 0.65);
  addAnimeInkEdges(brassKeycard, materials.inkLineMaterial);
  group.add(brassKeycard);

  const turnstileGate = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.24, 1.8),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.8,
    })
  );
  turnstileGate.position.set(0, 4.6, 0);
  addAnimeInkEdges(turnstileGate, materials.inkLineMaterial);
  group.add(turnstileGate);

  const radarLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 12),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.7,
    })
  );
  radarLamp.position.set(0, 3.2, 0);
  group.add(radarLamp);

  return { group, cutawayHoodPivot, brassKeycard, turnstileGate, radarLamp };
}

export interface RooftopVaultRig {
  group: THREE.Group;
  drawers: THREE.Mesh[];
}

export function buildRooftopVault(materials: AnimeMaterialLibrary): RooftopVaultRig {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 3.2, 1.7),
    materials.createToonMaterial(0x1e293b)
  );
  shell.position.y = 1.6;
  addAnimeInkEdges(shell, materials.inkLineMaterial);
  group.add(shell);

  const drawers: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const drawer = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.55, 0.9),
      materials.createToonMaterial(0xe11d48, {
        emissive: 0xbe123c,
        emissiveIntensity: 0.45,
      })
    );
    drawer.position.set(0, 0.8 + i * 0.82, 0.45);
    addAnimeInkEdges(drawer, materials.inkLineMaterial);
    group.add(drawer);
    drawers.push(drawer);
  }
  return { group, drawers };
}
