import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import { createPlaqueTexture } from '@/components/three/step-stage-primitives';

export function buildPowerPlantBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'POWER-PLANT CONTROL ROOM & TRUSTED EMERGENCY BREAKER WRENCH',
  subline = 'SIGNED WRENCH DROP  ·  REACTOR PIT BREAKER  ·  WATCHTOWER BLACKOUT  ·  HVCI SHUTTER',
  accentHex = '#F59E0B'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const subFloor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 13), materials.createToonMaterial(0x10131a));
  subFloor.position.set(0, -0.25, -0.6);
  group.add(subFloor);

  const floor = new THREE.Mesh(new THREE.BoxGeometry(21.4, 0.06, 9.6), materials.createToonMaterial(0x1a202c));
  floor.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(floor, materials.inkLineMaterial);
  group.add(floor);

  const busbar = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.05, 1.5), materials.createToonMaterial(0x3b2f10));
  busbar.position.set(0, 0.08, 0.25);
  addAnimeInkEdges(busbar, materials.inkLineMaterial);
  group.add(busbar);

  const rearWall = new THREE.Mesh(new THREE.BoxGeometry(22.4, 7.2, 0.36), materials.createToonMaterial(0x151b26));
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const colMat = materials.createToonMaterial(0x283244);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), colMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  const signTex = createPlaqueTexture(headline, subline, '#17140D', accentHex, '#FEF3C7', 1024, 240);
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

export interface ReactorPitRig {
  group: THREE.Group;
  brassWrench: THREE.Mesh;
  pitDomePivot: THREE.Group;
  breakerDial: THREE.Mesh;
  recallShutter: THREE.Mesh;
}

export function buildReactorPit(materials: AnimeMaterialLibrary): ReactorPitRig {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.0, 1.8), materials.createToonMaterial(0x334155));
  base.position.y = 1.0;
  addAnimeInkEdges(base, materials.inkLineMaterial);
  group.add(base);

  const brassWrench = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.22, 0.45),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.85 })
  );
  brassWrench.position.set(-2.4, 2.35, 0.35);
  addAnimeInkEdges(brassWrench, materials.inkLineMaterial);
  group.add(brassWrench);

  const pitDomePivot = new THREE.Group();
  pitDomePivot.position.set(0, 2.05, -0.9);
  group.add(pitDomePivot);
  const dome = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 1.15, 1.75),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.22, depthWrite: false })
  );
  dome.position.set(0, -0.58, 0.9);
  pitDomePivot.add(dome);

  const breakerDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.25, 16),
    materials.createToonMaterial(0xe11d48, { emissive: 0xf43f5e, emissiveIntensity: 0.75 })
  );
  breakerDial.rotation.x = Math.PI / 2;
  breakerDial.position.set(0, 1.25, 0.96);
  addAnimeInkEdges(breakerDial, materials.inkLineMaterial);
  group.add(breakerDial);

  const recallShutter = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.28, 2.0),
    materials.createToonMaterial(0x10b981, { emissive: 0x34d399, emissiveIntensity: 0.85 })
  );
  recallShutter.position.set(0, 4.6, 0);
  addAnimeInkEdges(recallShutter, materials.inkLineMaterial);
  group.add(recallShutter);

  return { group, brassWrench, pitDomePivot, breakerDial, recallShutter };
}

export interface WatchtowerRowRig {
  group: THREE.Group;
  lamps: THREE.Mesh[];
}

export function buildWatchtowerRow(materials: AnimeMaterialLibrary): WatchtowerRowRig {
  const group = new THREE.Group();
  const lamps: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.8, 0.95), materials.createToonMaterial(0x1e3a5f));
    tower.position.set(-1.3 + i * 1.3, 1.4, 0);
    addAnimeInkEdges(tower, materials.inkLineMaterial);
    group.add(tower);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 14, 10),
      materials.createToonMaterial(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.9 })
    );
    lamp.position.set(-1.3 + i * 1.3, 3.15, 0);
    group.add(lamp);
    lamps.push(lamp);
  }
  return { group, lamps };
}
