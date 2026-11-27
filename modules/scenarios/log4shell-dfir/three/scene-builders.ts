import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createMailroomSignTexture(
  headline: string,
  subline: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 240;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#15121e';
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

export function buildMailroomBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'AUTOMATED PNEUMATIC MAILROOM & BLUEPRINT TUBE',
  subline = 'INBOUND CONVEYOR  ·  LOGGING PRESS  ·  EGRESS AIRLOCK VALVE',
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

  const mailFloor = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 0.06, 9.6),
    materials.createToonMaterial(0x231f2e)
  );
  mailFloor.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(mailFloor, materials.inkLineMaterial);
  group.add(mailFloor);

  const beltTrack = new THREE.Mesh(
    new THREE.BoxGeometry(15.6, 0.04, 1.55),
    materials.createToonMaterial(0x9a3412)
  );
  beltTrack.position.set(0, 0.075, 0.25);
  addAnimeInkEdges(beltTrack, materials.inkLineMaterial);
  group.add(beltTrack);

  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x1b1726)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const colMat = materials.createToonMaterial(0x3f364f);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), colMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  const signTex = createMailroomSignTexture(headline, subline, accentHex);
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

export interface ConveyorSorterRig {
  group: THREE.Group;
  parcel: THREE.Mesh;
  cameraEye: THREE.Mesh;
}

export function buildConveyorSorter(materials: AnimeMaterialLibrary): ConveyorSorterRig {
  const group = new THREE.Group();

  const beltBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.92, 1.4),
    materials.createToonMaterial(0x334155)
  );
  beltBody.position.set(0, 0.46, 0);
  addAnimeInkEdges(beltBody, materials.inkLineMaterial);
  group.add(beltBody);

  const rollerTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.45, 0.12, 1.2),
    materials.createToonMaterial(0x475569)
  );
  rollerTop.position.set(0, 0.98, 0);
  addAnimeInkEdges(rollerTop, materials.inkLineMaterial);
  group.add(rollerTop);

  // Incoming parcel with crimson lookup tag
  const parcel = new THREE.Mesh(
    new THREE.BoxGeometry(0.84, 0.56, 0.68),
    materials.createToonMaterial(0xf59e0b, {
      emissive: 0xd97706,
      emissiveIntensity: 0.55,
    })
  );
  parcel.position.set(-1.1, 1.34, 0);
  addInvertedHullOutline(parcel, materials.inkOutlineMaterial, 1.06);
  group.add(parcel);

  // Overhead ingress camera arch (Nginx / WAF)
  const arch = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 1.65, 1.48),
    materials.createToonMaterial(0x1e293b)
  );
  arch.position.set(0.2, 1.78, 0);
  addAnimeInkEdges(arch, materials.inkLineMaterial);
  group.add(arch);

  const cameraEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 14, 14),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.85,
    })
  );
  cameraEye.position.set(0.2, 2.75, 0.2);
  group.add(cameraEye);

  return { group, parcel, cameraEye };
}

export interface LoggingPressRig {
  group: THREE.Group;
  cutawayCoverPivot: THREE.Group;
  parserGears: THREE.Mesh[];
  literalShield: THREE.Mesh;
}

export function buildLoggingPress(materials: AnimeMaterialLibrary): LoggingPressRig {
  const group = new THREE.Group();

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(3.15, 2.75, 2.0),
    materials.createToonMaterial(0x1e293b)
  );
  housing.position.set(0, 1.375, 0);
  addAnimeInkEdges(housing, materials.inkLineMaterial);
  group.add(housing);

  const copperCap = new THREE.Mesh(
    new THREE.BoxGeometry(3.35, 0.24, 2.15),
    materials.createToonMaterial(0xb45309)
  );
  copperCap.position.set(0, 2.86, 0);
  addAnimeInkEdges(copperCap, materials.inkLineMaterial);
  group.add(copperCap);

  // Internal MessagePatternConverter parsing gears
  const parserGears: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const gear = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.24, 16),
      materials.createToonMaterial(i === 1 ? 0xf43f5e : 0xf59e0b, {
        emissive: i === 1 ? 0xe11d48 : 0xd97706,
        emissiveIntensity: 0.55,
      })
    );
    gear.rotation.x = Math.PI / 2;
    gear.position.set(-0.85 + i * 0.85, 1.65, 0.45);
    addAnimeInkEdges(gear, materials.inkLineMaterial);
    group.add(gear);
    parserGears.push(gear);
  }

  // Cutaway glass hood
  const cutawayCoverPivot = new THREE.Group();
  cutawayCoverPivot.position.set(0, 2.72, 1.02);
  const cover = new THREE.Mesh(
    new THREE.BoxGeometry(2.96, 2.25, 0.08),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.34,
    })
  );
  (cover.material as THREE.MeshToonMaterial).depthWrite = false;
  cover.position.set(0, -1.12, 0);
  cutawayCoverPivot.add(cover);
  group.add(cutawayCoverPivot);

  // Hardened literal-text emerald shield (Log4j 2.17.1+)
  const literalShield = new THREE.Mesh(
    new THREE.BoxGeometry(3.25, 2.85, 0.14),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.72,
      transparent: true,
      opacity: 0.42,
    })
  );
  (literalShield.material as THREE.MeshToonMaterial).depthWrite = false;
  literalShield.position.set(0, 1.5, 1.15);
  literalShield.visible = false;
  group.add(literalShield);

  return { group, cutawayCoverPivot, parserGears, literalShield };
}

export interface PneumaticEgressTubeRig {
  group: THREE.Group;
  canister: THREE.Mesh;
  airlockValve: THREE.Mesh;
  annexAlarm: THREE.Mesh;
}

export function buildPneumaticEgressTube(
  materials: AnimeMaterialLibrary
): PneumaticEgressTubeRig {
  const group = new THREE.Group();

  // Glass horizontal outbound pneumatic tube
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 4.4, 16),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.4,
    })
  );
  (tube.material as THREE.MeshToonMaterial).depthWrite = false;
  tube.rotation.z = Math.PI / 2;
  tube.position.set(0, 2.25, 0);
  group.add(tube);

  // Glowing outbound lookup canister
  const canister = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.62, 12),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.9,
    })
  );
  canister.rotation.z = Math.PI / 2;
  canister.position.set(-1.8, 2.25, 0);
  group.add(canister);

  // Emerald egress airlock gate valve across tube
  const airlockValve = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 2.8, 1.35),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.65,
    })
  );
  airlockValve.position.set(0.3, 1.4, 0);
  addAnimeInkEdges(airlockValve, materials.inkLineMaterial);
  airlockValve.visible = false;
  group.add(airlockValve);

  // External annex / workshop monitor kiosk on right end
  const annex = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.95, 1.55),
    materials.createToonMaterial(0x1e293b)
  );
  annex.position.set(2.45, 1.475, 0);
  addAnimeInkEdges(annex, materials.inkLineMaterial);
  group.add(annex);

  const annexAlarm = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 16),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
    })
  );
  annexAlarm.position.set(2.45, 3.25, 0);
  group.add(annexAlarm);

  return { group, canister, airlockValve, annexAlarm };
}
