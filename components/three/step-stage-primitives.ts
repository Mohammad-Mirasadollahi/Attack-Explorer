import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from './anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function segment(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp01((t - start) / (end - start));
}

export function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

export function easeInOutQuad(x: number): number {
  const c = clamp01(x);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

export function easeOutBack(x: number): number {
  const c = clamp01(x);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2);
}

export function resolveCutaway(
  autoAmount: number,
  mode: StandardCutawayMode
): number {
  if (mode === 'OPEN') return 1;
  if (mode === 'SEALED') return 0;
  return clamp01(autoAmount);
}

/**
 * Generates a high-contrast cel-shaded anime signboard CanvasTexture (100% English, zero truncation).
 */
export function createStepSignTexture(
  title: string,
  subtitle: string,
  bgHex: string,
  borderHex: string,
  titleHex = '#F8FAFC',
  subHex = '#CBD5E1'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 224;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 1024, 224);

  // Subtle corner technical ticks
  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 1004, 204);

  ctx.fillStyle = borderHex;
  ctx.fillRect(10, 10, 26, 204);
  ctx.fillRect(988, 10, 26, 204);

  ctx.fillStyle = titleHex;
  ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 512, 86, 900);

  ctx.fillStyle = subHex;
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.fillText(subtitle, 512, 156, 900);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates a compact crisp screen/plaque CanvasTexture for in-world monitors, gauges, and badges.
 */
export function createPlaqueTexture(
  header: string,
  body: string,
  bgHex: string,
  accentHex: string,
  bodyHex = '#F8FAFC',
  width = 512,
  height = 256
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, width, Math.round(height * 0.24));

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  ctx.fillStyle = '#0F172A';
  ctx.font = `900 ${Math.round(height * 0.13)}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(header, width / 2, height * 0.125, width - 32);

  ctx.fillStyle = bodyHex;
  ctx.font = `900 ${Math.round(height * 0.22)}px "JetBrains Mono", monospace`;
  ctx.fillText(body, width / 2, height * 0.62, width - 36);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Soft radial contact shadow disc for crisp figure-ground grounding (disjoint Y >= 0.015).
 */
export function createContactDisc(
  materials: AnimeMaterialLibrary,
  radius: number,
  y = 0.018
): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({
    map: materials.contactShadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.45,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 28), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  return mesh;
}

export interface StepRoomShellOptions {
  floorColor: number;
  floorTrimHex: number;
  wallColor: number;
  pillarColor?: number;
  gridColor?: number;
  signTitle: string;
  signSubtitle: string;
  signBgHex: string;
  signBorderHex: string;
  signTitleHex?: string;
  signSubHex?: string;
  width?: number;
  depth?: number;
  wallZ?: number;
  shape?: 'rect' | 'hex' | 'round';
}

/**
 * Low-level standalone cel-shaded architectural room stage shell (rear-mounted wall z <= -3.2,
 * disjoint floor elevations, zero foreground occlusion, unobstructed top-left HUD).
 */
export function buildStepRoomShell(
  materials: AnimeMaterialLibrary,
  opts: StepRoomShellOptions
): {
  group: THREE.Group;
  textures: THREE.Texture[];
  accentStripMat: THREE.MeshBasicMaterial;
} {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const w = opts.width ?? 15.2;
  const d = opts.depth ?? 10.6;
  const wallZ = opts.wallZ ?? -3.5;

  // Base floor slab (top at y = 0)
  const floorMat = materials.createToonMaterial(opts.floorColor);
  let floorMesh: THREE.Mesh;
  if (opts.shape === 'round') {
    floorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(w * 0.52, w * 0.55, 0.36, 36),
      floorMat
    );
  } else if (opts.shape === 'hex') {
    floorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(w * 0.56, w * 0.59, 0.36, 6),
      floorMat
    );
    floorMesh.rotation.y = Math.PI / 6;
  } else {
    floorMesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.36, d), floorMat);
  }
  floorMesh.position.y = -0.18;
  floorMesh.receiveShadow = true;
  addAnimeInkEdges(floorMesh, materials.inkLineMaterial, 28);
  group.add(floorMesh);

  // Subtle floor grid at disjoint y = 0.015 (zero Z-fighting)
  const grid = new THREE.GridHelper(
    Math.min(w, d) * 0.92,
    12,
    opts.floorTrimHex,
    opts.gridColor ?? 0x334155
  );
  grid.position.y = 0.015;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.24;
  group.add(grid);

  // Luminous perimeter floor trim at disjoint y = 0.035
  const accentStripMat = new THREE.MeshBasicMaterial({
    color: opts.floorTrimHex,
    toneMapped: false,
  });
  if (opts.shape === 'round' || opts.shape === 'hex') {
    const segs = opts.shape === 'hex' ? 6 : 48;
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(w * 0.51, 0.055, 8, segs),
      accentStripMat
    );
    rim.rotation.x = Math.PI / 2;
    if (opts.shape === 'hex') rim.rotation.z = Math.PI / 6;
    rim.position.y = 0.035;
    group.add(rim);
  } else {
    const frontRail = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.3, 0.05, 0.09),
      accentStripMat
    );
    frontRail.position.set(0, 0.035, d / 2 - 0.12);
    group.add(frontRail);

    const backRail = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.3, 0.05, 0.09),
      accentStripMat
    );
    backRail.position.set(0, 0.035, wallZ + 0.24);
    group.add(backRail);
  }

  // Rear architectural backdrop wall strictly at z <= -3.2 (never blocks cameras)
  const wallMat = materials.createToonMaterial(opts.wallColor);
  const pillarMat = materials.createToonMaterial(
    opts.pillarColor ?? 0x1e293b
  );
  const wallW = w * 0.88;
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallW, 5.4, 0.32),
    wallMat
  );
  backWall.position.set(0, 2.7, wallZ);
  backWall.receiveShadow = true;
  addAnimeInkEdges(backWall, materials.inkLineMaterial, 28);
  group.add(backWall);

  // Architectural rear buttress pillars framing the room
  const pillarXPositions = [-wallW * 0.46, -wallW * 0.16, wallW * 0.16, wallW * 0.46];
  for (const px of pillarXPositions) {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 5.55, 0.46),
      pillarMat
    );
    pillar.position.set(px, 2.775, wallZ + 0.12);
    pillar.castShadow = true;
    addAnimeInkEdges(pillar, materials.inkLineMaterial, 24);
    group.add(pillar);
  }

  // Rear top cornice header bar
  const cornice = new THREE.Mesh(
    new THREE.BoxGeometry(wallW + 0.5, 0.28, 0.64),
    pillarMat
  );
  cornice.position.set(0, 5.52, wallZ + 0.14);
  addAnimeInkEdges(cornice, materials.inkLineMaterial, 25);
  group.add(cornice);

  // Overhead English Signboard (centered x=0, y=5.0, clear of top-left HUD)
  const signTex = createStepSignTexture(
    opts.signTitle,
    opts.signSubtitle,
    opts.signBgHex,
    opts.signBorderHex,
    opts.signTitleHex ?? '#F8FAFC',
    opts.signSubHex ?? '#CBD5E1'
  );
  textures.push(signTex);
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 1.38, 0.16),
    [
      pillarMat,
      pillarMat,
      pillarMat,
      pillarMat,
      new THREE.MeshBasicMaterial({ map: signTex }),
      pillarMat,
    ]
  );
  signBoard.position.set(0, 4.92, wallZ + 0.34);
  addAnimeInkEdges(signBoard, materials.inkLineMaterial, 25);
  group.add(signBoard);

  return { group, textures, accentStripMat };
}

/**
 * Deterministically disposes every geometry, material (except shared library ink materials),
 * and canvas texture inside a standalone step scene root.
 */
export function disposeStepScene(
  root: THREE.Object3D,
  textures: THREE.Texture[],
  materials: AnimeMaterialLibrary
): void {
  const disposedGeos = new Set<THREE.BufferGeometry>();
  const disposedMats = new Set<THREE.Material>();

  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Line) {
      if (obj.geometry && !disposedGeos.has(obj.geometry)) {
        obj.geometry.dispose();
        disposedGeos.add(obj.geometry);
      }
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (
          m &&
          m !== materials.inkLineMaterial &&
          m !== materials.inkOutlineMaterial &&
          !disposedMats.has(m)
        ) {
          m.dispose();
          disposedMats.add(m);
        }
      }
    }
  });

  for (const tex of textures) {
    tex.dispose();
  }
}
