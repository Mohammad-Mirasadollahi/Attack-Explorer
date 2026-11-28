import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  DCSYNC_TIMELINE_DURATION_SEC,
  evaluateDcsyncChoreography,
} from '../choreography';

type RosterDisplayMode = 'STANDBY' | 'ALERT' | 'LOCKED';

interface ProceduralTextureBundle {
  albedo: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function configureTexture(
  tex: THREE.CanvasTexture,
  isColor: boolean,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.wrapS = repeatX > 1 || repeatY > 1 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  tex.wrapT = repeatX > 1 || repeatY > 1 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.repeat.set(repeatX, repeatY);
  }
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Deterministic pseudo-random helper so procedural textures never flicker or diverge. */
function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

/** Cut sovereign limestone ashlar masonry albedo + bump maps. */
function createLimestoneAshlarTextures(
  repeatX: number,
  repeatY: number,
  track: THREE.Texture[]
): ProceduralTextureBundle {
  const size = 512;
  const [albedoCanvas, aCtx] = makeCanvas(size, size);
  const [bumpCanvas, bCtx] = makeCanvas(size, size);

  aCtx.fillStyle = '#b0a390';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  const rows = 8;
  const cols = 4;
  const rowH = size / rows;
  const colW = size / cols;

  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : colW * 0.5;
    for (let c = -1; c <= cols; c++) {
      const bx = c * colW + offset;
      const by = r * rowH;
      const tone = hash2d(c + 13, r + 7);
      const lum = Math.round(176 + (tone - 0.5) * 20);
      const warm = Math.round(166 + (tone - 0.5) * 18);
      const cool = Math.round(150 + (tone - 0.5) * 16);

      aCtx.fillStyle = `rgb(${lum}, ${warm}, ${cool})`;
      aCtx.fillRect(bx + 2, by + 2, colW - 4, rowH - 4);

      // Subtle mineral grain per cut limestone block
      for (let g = 0; g < 18; g++) {
        const gx = bx + 4 + hash2d(c * 31 + g, r * 17) * (colW - 8);
        const gy = by + 4 + hash2d(c * 19, r * 23 + g) * (rowH - 8);
        const alpha = 0.05 + hash2d(g, r + c) * 0.06;
        aCtx.fillStyle = g % 2 === 0 ? `rgba(76,66,54,${alpha})` : `rgba(240,232,220,${alpha})`;
        aCtx.fillRect(gx, gy, 8 + (g % 5) * 3, 2);
      }

      // Mortar groove bevels
      aCtx.strokeStyle = 'rgba(84, 74, 62, 0.65)';
      aCtx.lineWidth = 2;
      aCtx.strokeRect(bx + 1, by + 1, colW - 2, rowH - 2);

      const bumpLum = Math.round(172 + (tone - 0.5) * 28);
      bCtx.fillStyle = `rgb(${bumpLum}, ${bumpLum}, ${bumpLum})`;
      bCtx.fillRect(bx + 3, by + 3, colW - 6, rowH - 6);
      bCtx.strokeStyle = '#383838';
      bCtx.lineWidth = 3;
      bCtx.strokeRect(bx + 1, by + 1, colW - 2, rowH - 2);
    }
  }

  const albedo = configureTexture(new THREE.CanvasTexture(albedoCanvas), true, repeatX, repeatY);
  const bump = configureTexture(new THREE.CanvasTexture(bumpCanvas), false, repeatX, repeatY);
  track.push(albedo, bump);
  return { albedo, bump };
}

/** Realistic weathered city asphalt street texture with subtle aggregate & tire sheen. */
function createAsphaltTextures(
  repeatX: number,
  repeatY: number,
  track: THREE.Texture[]
): ProceduralTextureBundle {
  const size = 512;
  const [albedoCanvas, aCtx] = makeCanvas(size, size);
  const [bumpCanvas, bCtx] = makeCanvas(size, size);

  aCtx.fillStyle = '#2d3138';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#7c7c7c';
  bCtx.fillRect(0, 0, size, size);

  // Subtle horizontal tire wear bands
  const bandGrad = aCtx.createLinearGradient(0, 0, 0, size);
  bandGrad.addColorStop(0.0, 'rgba(18,21,26,0.18)');
  bandGrad.addColorStop(0.24, 'rgba(62,68,78,0.14)');
  bandGrad.addColorStop(0.5, 'rgba(20,23,28,0.22)');
  bandGrad.addColorStop(0.76, 'rgba(64,70,80,0.14)');
  bandGrad.addColorStop(1.0, 'rgba(18,21,26,0.18)');
  aCtx.fillStyle = bandGrad;
  aCtx.fillRect(0, 0, size, size);

  // Fine mineral aggregate speckle
  for (let i = 0; i < 6500; i++) {
    const x = hash2d(i * 1.13, i * 0.71) * size;
    const y = hash2d(i * 0.43, i * 1.91) * size;
    const v = Math.round(34 + hash2d(i, 9.1) * 44);
    aCtx.fillStyle = `rgb(${v}, ${v + 2}, ${v + 5})`;
    aCtx.fillRect(x, y, 2, 2);

    const bv = Math.round(90 + hash2d(i, 3.7) * 90);
    bCtx.fillStyle = `rgb(${bv}, ${bv}, ${bv})`;
    bCtx.fillRect(x, y, 2, 2);
  }

  const albedo = configureTexture(new THREE.CanvasTexture(albedoCanvas), true, repeatX, repeatY);
  const bump = configureTexture(new THREE.CanvasTexture(bumpCanvas), false, repeatX, repeatY);
  track.push(albedo, bump);
  return { albedo, bump };
}

/** Granite sidewalk paver texture. */
function createSidewalkTexture(repeatX: number, repeatY: number, track: THREE.Texture[]): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  ctx.fillStyle = '#7e858f';
  ctx.fillRect(0, 0, size, size);

  const cells = 4;
  const step = size / cells;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const n = hash2d(c + 5, r + 11);
      const v = Math.round(126 + (n - 0.5) * 16);
      ctx.fillStyle = `rgb(${v}, ${v + 2}, ${v + 5})`;
      ctx.fillRect(c * step + 2, r * step + 2, step - 4, step - 4);
      ctx.strokeStyle = 'rgba(58, 64, 72, 0.58)';
      ctx.lineWidth = 2;
      ctx.strokeRect(c * step + 1, r * step + 1, step - 2, step - 2);
    }
  }
  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, repeatX, repeatY);
  track.push(tex);
  return tex;
}

/** Procedural urban skyscraper window curtain-wall texture for the distant city skyline. */
function createSkyscraperFacadeTexture(seed: number, track: THREE.Texture[]): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 512);
  const baseTone = 46 + (seed % 3) * 14;
  ctx.fillStyle = `rgb(${baseTone}, ${baseTone + 8}, ${baseTone + 18})`;
  ctx.fillRect(0, 0, 256, 512);

  const cols = 8;
  const rows = 20;
  const cw = 256 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = hash2d(c + seed * 7, r + seed * 13);
      if (p > 0.74) {
        ctx.fillStyle = 'rgba(251, 224, 165, 0.78)';
      } else if (p > 0.42) {
        ctx.fillStyle = 'rgba(132, 168, 206, 0.46)';
      } else {
        ctx.fillStyle = 'rgba(32, 44, 62, 0.75)';
      }
      ctx.fillRect(c * cw + 4, r * rh + 4, cw - 8, rh - 8);
    }
  }
  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

/** Soft feathered radial contact shadow texture (grounds assets cleanly even on software WebGL). */
function createContactShadowTexture(track: THREE.Texture[]): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 256);
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0.0, 'rgba(8, 12, 20, 0.56)');
  grad.addColorStop(0.55, 'rgba(8, 12, 20, 0.28)');
  grad.addColorStop(1.0, 'rgba(8, 12, 20, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = configureTexture(new THREE.CanvasTexture(canvas), false, 1, 1);
  track.push(tex);
  return tex;
}

/** Brushed architectural bronze plaque with crisp engraved gold lettering. */
function createBrassPlaqueTexture(
  title: string,
  subtitle: string,
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 144);
  const bg = ctx.createLinearGradient(0, 0, 512, 144);
  bg.addColorStop(0, '#2a2218');
  bg.addColorStop(0.5, '#3b2f20');
  bg.addColorStop(1, '#241c13');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 144);

  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 128);
  ctx.strokeStyle = 'rgba(245, 208, 118, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 480, 112);

  ctx.fillStyle = '#f8e1a6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 34px Georgia, serif';
  ctx.fillText(title, 256, 54);

  ctx.fillStyle = '#d4b473';
  ctx.font = '600 21px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(subtitle, 256, 102);

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

/** Woven crimson-and-gold service ribbon texture for the forgotten gatehouse credential. */
function createServiceRibbonTexture(track: THREE.Texture[]): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 512);
  const bg = ctx.createLinearGradient(0, 0, 256, 0);
  bg.addColorStop(0, '#7c1224');
  bg.addColorStop(0.25, '#a81c33');
  bg.addColorStop(0.5, '#be223c');
  bg.addColorStop(0.75, '#a81c33');
  bg.addColorStop(1, '#7c1224');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 512);

  // Subtle woven silk horizontal ribbing
  ctx.fillStyle = 'rgba(255, 225, 225, 0.08)';
  for (let y = 0; y < 512; y += 6) {
    ctx.fillRect(0, y, 256, 2);
  }

  // Gold embroidered edge braids
  ctx.fillStyle = '#eab308';
  ctx.fillRect(14, 0, 14, 512);
  ctx.fillRect(228, 0, 14, 512);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(19, 0, 4, 512);
  ctx.fillRect(233, 0, 4, 512);

  // Gold stamped seal circle in center
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 170, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 24px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('SERVICE', 128, 155);
  ctx.fillText('RIBBON', 128, 186);

  ctx.font = '700 20px ui-monospace, monospace';
  ctx.fillStyle = '#fde68a';
  ctx.fillText('BRIDGE', 128, 300);
  ctx.fillText('COURIER', 128, 330);
  ctx.fillText('ACCESS', 128, 360);

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

/** Stamped metal side-street vehicle license plate texture. */
function createLicensePlateTexture(plateCode: string, track: THREE.Texture[]): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 224);
  const bg = ctx.createLinearGradient(0, 0, 0, 224);
  bg.addColorStop(0, '#dde3ec');
  bg.addColorStop(1, '#c3ccd8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 224);

  // Top blue state/district header bar
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(10, 10, 492, 50);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, 500, 212);

  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 24px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('MUNICIPAL SIDE-STREET COMMERCIAL', 256, 35);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 94px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(plateCode, 256, 138);

  // Corner mounting bolts
  ctx.fillStyle = '#64748b';
  for (const [bx, by] of [
    [34, 34],
    [478, 34],
    [34, 190],
    [478, 190],
  ]) {
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

/** High-contrast electronic LED Roster Board textures for the Bridge Audit Tower. */
function createAuditRosterTexture(
  mode: RosterDisplayMode,
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(640, 320);

  const bgColor =
    mode === 'ALERT' ? '#240812' : mode === 'LOCKED' ? '#072219' : '#091726';
  const borderColor =
    mode === 'ALERT' ? '#f43f5e' : mode === 'LOCKED' ? '#10b981' : '#38bdf8';
  const headerBg =
    mode === 'ALERT' ? '#be123c' : mode === 'LOCKED' ? '#047857' : '#0369a1';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 640, 320);

  // Subtle scanlines
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let y = 0; y < 320; y += 6) {
    ctx.fillRect(0, y, 640, 2);
  }

  ctx.fillStyle = headerBg;
  ctx.fillRect(10, 10, 620, 62);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 628, 308);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 28px ui-monospace, SFMono-Regular, Menlo, monospace';

  if (mode === 'STANDBY') {
    ctx.fillText('OFFICIAL MINT BRIDGE ROSTER', 320, 42);
    ctx.textAlign = 'left';
    ctx.font = '700 26px ui-monospace, monospace';
    ctx.fillStyle = '#34d399';
    ctx.fillText('[OK] TOWER I  · MINT-DC01 (PEER)', 42, 126);
    ctx.fillText('[OK] TOWER II · MINT-DC02 (PEER)', 42, 174);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText('BRIDGE MODE: PEER DIE SYNC ONLY', 42, 232);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 22px ui-monospace, monospace';
    ctx.fillText('PLATE SCANNER: MONITORING ARCHWAY', 42, 278);
  } else if (mode === 'ALERT') {
    ctx.fillText('!! ROSTER MISMATCH DETECTED !!', 320, 42);
    ctx.textAlign = 'left';
    ctx.font = '800 32px ui-monospace, monospace';
    ctx.fillStyle = '#fda4af';
    ctx.fillText('PLATE SCANNED: 482-VAN', 42, 128);
    ctx.fillStyle = '#fef08a';
    ctx.font = '700 25px ui-monospace, monospace';
    ctx.fillText('ROSTER MATCH : NONE (SIDE-STREET VAN)', 42, 184);
    ctx.fillStyle = '#fb7185';
    ctx.font = '800 26px ui-monospace, monospace';
    ctx.fillText('ACTION: LOCK BRIDGE & RECAST x2', 42, 250);
  } else {
    ctx.fillText('BRIDGE LOCKED · PEER TOWERS ONLY', 320, 42);
    ctx.textAlign = 'left';
    ctx.font = '700 26px ui-monospace, monospace';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText('[LOCKED] GATE RESTRICTED TO PEERS', 42, 126);
    ctx.fillStyle = '#fde047';
    ctx.fillText('[DONE]   CROWN SEALS RECAST TWICE', 42, 182);
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '700 23px ui-monospace, monospace';
    ctx.fillText('STOLEN VAN COPY: VOID / INVALIDATED', 42, 248);
  }

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

/** Builds a detailed metallic Master Coin Die & Sculpted Sovereign Crown Seal assembly. */
function buildCrownSealAssembly(
  goldMat: THREE.MeshStandardMaterial,
  darkBronzeMat: THREE.MeshStandardMaterial,
  accentRingMat: THREE.MeshStandardMaterial
): THREE.Group {
  const group = new THREE.Group();

  // Heavy machined cylindrical master coin die plinth
  const dieBase = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.22, 28), darkBronzeMat);
  dieBase.position.y = 0.11;
  group.add(dieBase);

  // Milled gold coin-die face
  const coinDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 28), goldMat);
  coinDisk.position.y = 0.26;
  group.add(coinDisk);

  // Outer sculpted crown band
  const crownBand = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 14, 28), goldMat);
  crownBand.rotation.x = Math.PI / 2;
  crownBand.position.y = 0.36;
  group.add(crownBand);

  // Inner embossed seal ring
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 12, 24), accentRingMat);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.34;
  group.add(innerRing);

  // 8 sculpted sovereign crown spires with top pearls
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rx = Math.cos(a) * 0.31;
    const rz = Math.sin(a) * 0.31;

    const prong = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.26, 6), goldMat);
    prong.position.set(rx, 0.5, rz);
    group.add(prong);

    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), accentRingMat);
    pearl.position.set(rx, 0.64, rz);
    group.add(pearl);
  }

  // Central sovereign orb & finial
  const centerOrb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), goldMat);
  centerOrb.position.y = 0.48;
  group.add(centerOrb);

  return group;
}

interface MintTowerHandle {
  group: THREE.Group;
  crownSpinner: THREE.Group;
  crownMat: THREE.MeshStandardMaterial;
  recastRing1: THREE.Mesh;
  recastRing2: THREE.Mesh;
  vaultLight: THREE.PointLight;
  windowMat: THREE.MeshStandardMaterial;
}

/** Builds one of the Twin Sovereign Mint Towers with neoclassical limestone architecture,
 *  sealed ground-floor bronze vault doors, warm lit windows, upper glass Master Coin Die Gallery,
 *  and patinated copper mansard roof & spire. */
function buildSovereignMintTower(
  side: 'WEST' | 'EAST',
  sharedMats: {
    limestone: THREE.MeshStandardMaterial;
    granitePlinth: THREE.MeshStandardMaterial;
    darkBronze: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    copperRoof: THREE.MeshStandardMaterial;
    galleryGlass: THREE.MeshPhysicalMaterial;
  },
  trackTextures: THREE.Texture[],
  isSoftwareGl: boolean
): MintTowerHandle {
  const group = new THREE.Group();
  const isWest = side === 'WEST';

  // Stepped granite foundation plinth
  const plinthLower = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.52, 3.8), sharedMats.granitePlinth);
  plinthLower.position.y = 0.26;
  plinthLower.castShadow = !isSoftwareGl;
  plinthLower.receiveShadow = true;
  group.add(plinthLower);

  const plinthUpper = new THREE.Mesh(new THREE.BoxGeometry(3.52, 0.56, 3.52), sharedMats.granitePlinth);
  plinthUpper.position.y = 0.8;
  plinthUpper.castShadow = !isSoftwareGl;
  plinthUpper.receiveShadow = true;
  group.add(plinthUpper);

  // Main limestone lower-to-mid tower shaft (y = 1.08 .. 4.55)
  const lowerShaft = new THREE.Mesh(new THREE.BoxGeometry(3.26, 3.48, 3.26), sharedMats.limestone);
  lowerShaft.position.y = 2.82;
  lowerShaft.castShadow = !isSoftwareGl;
  lowerShaft.receiveShadow = true;
  group.add(lowerShaft);

  // Corner architectural stone pilasters
  for (const sx of [-1.56, 1.56]) {
    for (const sz of [-1.56, 1.56]) {
      const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.55, 0.28), sharedMats.limestone);
      pilaster.position.set(sx, 2.82, sz);
      group.add(pilaster);
    }
  }

  // Mid-height bronze cornice ledge (separating main facade from upper vault gallery)
  const midCornice = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.22, 3.64), sharedMats.darkBronze);
  midCornice.position.y = 4.62;
  group.add(midCornice);

  // Ground-floor Neoclassical Portico & SEALED Double Bronze Vault Doors (front z = +1.64)
  const porticoBase = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.2, 0.52), sharedMats.granitePlinth);
  porticoBase.position.set(0, 0.22, 1.88);
  group.add(porticoBase);

  // 4 fluted limestone portico columns
  for (const cx of [-1.05, -0.58, 0.58, 1.05]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 2.1, 14), sharedMats.limestone);
    col.position.set(cx, 1.36, 1.92);
    group.add(col);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.3), sharedMats.limestone);
    cap.position.set(cx, 2.42, 1.92);
    group.add(cap);
  }

  // Portico lintel + pediment
  const porticoLintel = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.24, 0.58), sharedMats.limestone);
  porticoLintel.position.set(0, 2.58, 1.84);
  group.add(porticoLintel);

  // Heavy SEALED Bronze Vault Doors (visibly bolted shut throughout every act!)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.94, 0.18), sharedMats.darkBronze);
  doorFrame.position.set(0, 1.28, 1.63);
  group.add(doorFrame);

  for (const dx of [-0.24, 0.24]) {
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.78, 0.12), sharedMats.darkBronze);
    doorLeaf.position.set(dx, 1.24, 1.71);
    group.add(doorLeaf);

    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.44, 0.05), sharedMats.brass);
    doorPanel.position.set(dx, 1.24, 1.76);
    group.add(doorPanel);

    // Circular vault locking wheel
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 8, 16), sharedMats.brass);
    wheel.position.set(dx * 0.72, 1.22, 1.81);
    group.add(wheel);
  }

  // Brass lintel plaque reading VAULT SEALED
  const vaultPlaqueTex = createBrassPlaqueTexture(
    isWest ? 'MINT TOWER I · VAULT' : 'MINT TOWER II · PEER',
    'VAULT DOORS SEALED · NO ENTRY',
    trackTextures
  );
  const vaultPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 0.52),
    new THREE.MeshStandardMaterial({
      map: vaultPlaqueTex,
      roughness: 0.36,
      metalness: 0.45,
    })
  );
  vaultPlaque.position.set(0, 2.58, 2.14);
  group.add(vaultPlaque);

  // Warm illuminated architectural windows on middle floor (y = 3.55)
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xffe4b5,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.42,
    roughness: 0.18,
    metalness: 0.3,
  });
  for (const wx of [-0.92, 0, 0.92]) {
    // Front windows
    const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.15, 0.12), sharedMats.darkBronze);
    wFrame.position.set(wx, 3.62, 1.64);
    group.add(wFrame);
    const wPane = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 1.0), windowMat);
    wPane.position.set(wx, 3.62, 1.71);
    group.add(wPane);
    // Side exterior windows
    const sideX = isWest ? -1.64 : 1.64;
    const swFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 0.56), sharedMats.darkBronze);
    swFrame.position.set(sideX, 3.62, wx);
    group.add(swFrame);
    const swPane = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 1.0), windowMat);
    swPane.position.set(sideX + (isWest ? -0.07 : 0.07), 3.62, wx);
    swPane.rotation.y = isWest ? -Math.PI / 2 : Math.PI / 2;
    group.add(swPane);
  }

  // UPPER MASTER COIN DIE VAULT GALLERY (y = 4.73 .. 6.68) — open panoramic glass chamber!
  const galleryFloor = new THREE.Mesh(new THREE.BoxGeometry(3.26, 0.18, 3.26), sharedMats.darkBronze);
  galleryFloor.position.y = 4.82;
  group.add(galleryFloor);

  // 4 corner structural limestone piers supporting the roof above the glass gallery
  for (const sx of [-1.42, 1.42]) {
    for (const sz of [-1.42, 1.42]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.88, 0.42), sharedMats.limestone);
      pier.position.set(sx, 5.76, sz);
      group.add(pier);
      const pierTrim = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.48), sharedMats.brass);
      pierTrim.position.set(sx, 6.66, sz);
      group.add(pierTrim);
    }
  }

  // Front & outer panoramic armored glass gallery windows (clear view of the Master Crown Seal!)
  const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.42, 1.78), sharedMats.galleryGlass);
  frontGlass.position.set(0, 5.76, 1.48);
  group.add(frontGlass);

  const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.42, 1.78), sharedMats.galleryGlass);
  rearGlass.position.set(0, 5.76, -1.48);
  rearGlass.rotation.y = Math.PI;
  group.add(rearGlass);

  // Precision Master Coin Die Pedestal & Sculpted Golden Crown Seal inside upper gallery
  const pedestalBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.78, 0.34, 24),
    sharedMats.darkBronze
  );
  pedestalBase.position.y = 5.08;
  group.add(pedestalBase);

  const pedestalTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.045, 10, 28),
    sharedMats.brass
  );
  pedestalTrim.rotation.x = Math.PI / 2;
  pedestalTrim.position.y = 5.25;
  group.add(pedestalTrim);

  const crownMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    emissive: 0xb45309,
    emissiveIntensity: 0.28,
    metalness: 0.9,
    roughness: 0.22,
  });
  const crownAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
    metalness: 0.88,
    roughness: 0.2,
  });

  const crownSpinner = buildCrownSealAssembly(crownMat, sharedMats.darkBronze, crownAccentMat);
  crownSpinner.position.y = 5.26;
  group.add(crownSpinner);

  // Dual Concentric Recast Forge Rings (fire sequentially in Act 5: Pass #1 amber, Pass #2 emerald-gold)
  const recastRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.055, 12, 32),
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0,
    })
  );
  recastRing1.rotation.x = Math.PI / 2;
  recastRing1.position.y = 5.58;
  group.add(recastRing1);

  const recastRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.055, 12, 32),
    new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 2.4,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0,
    })
  );
  recastRing2.rotation.x = Math.PI / 2;
  recastRing2.position.y = 5.58;
  group.add(recastRing2);

  // Local warm golden gallery PointLight illuminating the Master Coin Die
  const vaultLight = new THREE.PointLight(0xfbbf24, isWest ? 3.4 : 2.8, 7.5, 2);
  vaultLight.position.set(0, 6.22, 0.45);
  group.add(vaultLight);

  // UPPER CORNICE, TOWER SIGNAGE FRIEZE & BEAUX-ARTS COPPER MANSARD ROOF (y = 6.7 .. 9.35)
  const upperCornice = new THREE.Mesh(new THREE.BoxGeometry(3.72, 0.28, 3.72), sharedMats.limestone);
  upperCornice.position.y = 6.84;
  group.add(upperCornice);

  const friezeBlock = new THREE.Mesh(new THREE.BoxGeometry(3.36, 0.58, 3.36), sharedMats.limestone);
  friezeBlock.position.y = 7.26;
  group.add(friezeBlock);

  const towerSignTex = createBrassPlaqueTexture(
    isWest ? 'SOVEREIGN MINT I' : 'SOVEREIGN MINT II',
    isWest ? 'MASTER COIN DIE · DC01' : 'PEER MINT TOWER · DC02',
    trackTextures
  );
  const towerSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.85, 0.52),
    new THREE.MeshStandardMaterial({
      map: towerSignTex,
      roughness: 0.34,
      metalness: 0.48,
    })
  );
  towerSign.position.set(0, 7.26, 1.7);
  group.add(towerSign);

  // Stepped patinated copper/slate mansard roof
  const mansard = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.88, 1.12, 4),
    sharedMats.copperRoof
  );
  mansard.rotation.y = Math.PI / 4;
  mansard.position.y = 8.1;
  mansard.castShadow = !isSoftwareGl;
  group.add(mansard);

  const roofCap = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.14, 1.72), sharedMats.darkBronze);
  roofCap.position.y = 8.7;
  group.add(roofCap);

  // Architectural sovereign rooftop spire
  const spireBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.34, 0.34, 8), sharedMats.darkBronze);
  spireBase.position.y = 8.92;
  group.add(spireBase);

  const spireNeedle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.08, 0.85, 8), sharedMats.brass);
  spireNeedle.position.y = 9.48;
  group.add(spireNeedle);

  return {
    group,
    crownSpinner,
    crownMat,
    recastRing1,
    recastRing2,
    vaultLight,
    windowMat,
  };
}

interface ArmoredGlassBridgeHandle {
  group: THREE.Group;
  cutawayPivot: THREE.Group;
  syncCarriage: THREE.Group;
  carriageCrown: THREE.Group;
  couplerIrisMat: THREE.MeshStandardMaterial;
  transferBeam: THREE.Mesh;
  descendingSeal: THREE.Group;
  westBlastGate: THREE.Mesh;
  eastBlastGate: THREE.Mesh;
  peerShieldBar: THREE.Mesh;
  couplerBlastCap: THREE.Mesh;
}

/** Builds the Elevated Armored Glass Skybridge joining the Twin Sovereign Mint Towers
 *  high above the city street, forming a grand open archway underneath. */
function buildArmoredGlassBridge(
  sharedMats: {
    darkBronze: THREE.MeshStandardMaterial;
    steel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    bridgeGlass: THREE.MeshPhysicalMaterial;
    limestone: THREE.MeshStandardMaterial;
  },
  isSoftwareGl: boolean
): ArmoredGlassBridgeHandle {
  const group = new THREE.Group();
  const spanLen = 8.2; // cleanly anchors inside West Tower (-5.6 + 1.6) to East Tower (+5.6 - 1.6)

  // Heavy dark-bronze structural deck slab (y = 4.66)
  const deckSlab = new THREE.Mesh(new THREE.BoxGeometry(spanLen, 0.24, 2.04), sharedMats.darkBronze);
  deckSlab.position.y = 4.66;
  deckSlab.castShadow = !isSoftwareGl;
  deckSlab.receiveShadow = true;
  group.add(deckSlab);

  // Polished steel interior walkway / track bed
  const trackBed = new THREE.Mesh(new THREE.BoxGeometry(spanLen - 0.3, 0.06, 1.56), sharedMats.steel);
  trackBed.position.y = 4.81;
  group.add(trackBed);

  // Structural steel roof box girder (y = 6.46)
  const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(spanLen, 0.22, 2.08), sharedMats.darkBronze);
  roofSlab.position.y = 6.46;
  roofSlab.castShadow = !isSoftwareGl;
  group.add(roofSlab);

  // Sweeping structural under-arch ribs framing the city street archway below (zero pillars in road!)
  for (const az of [-0.88, 0.88]) {
    const archCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-4.05, 3.62, az),
      new THREE.Vector3(0, 4.92, az),
      new THREE.Vector3(4.05, 3.62, az)
    );
    const archRib = new THREE.Mesh(
      new THREE.TubeGeometry(archCurve, 28, 0.11, 10, false),
      sharedMats.darkBronze
    );
    group.add(archRib);

    // Architectural bronze corbel brackets connecting arch ribs to tower faces
    for (const sx of [-3.78, 3.78]) {
      const corbel = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.92, 0.28), sharedMats.limestone);
      corbel.position.set(sx, 4.12, az);
      group.add(corbel);
    }

    // Diagonal structural steel struts along the underside spandrels
    for (const sx of [-3.1, -2.15, 2.15, 3.1]) {
      const strutH = Math.abs(sx) > 2.6 ? 0.58 : 0.32;
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, strutH, 0.08), sharedMats.brass);
      strut.position.set(sx, 4.55 - strutH * 0.45, az);
      group.add(strut);
    }
  }

  // Vertical armored steel mullions along rear wall & outer ends
  for (const mx of [-3.4, -2.25, -1.1, 0, 1.1, 2.25, 3.4]) {
    const rearMullion = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.66, 0.09), sharedMats.darkBronze);
    rearMullion.position.set(mx, 5.56, -0.96);
    group.add(rearMullion);
  }
  const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(spanLen - 0.6, 1.56), sharedMats.bridgeGlass);
  rearGlass.position.set(0, 5.56, -0.95);
  group.add(rearGlass);

  // Twin precision stainless-steel overhead Die-Sync Monorail tracks inside the bridge
  for (const rz of [-0.32, 0.32]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(spanLen - 0.4, 0.07, 0.07), sharedMats.steel);
    rail.position.set(0, 6.26, rz);
    group.add(rail);
  }

  // Interactive CUTAWAY Front Armored Glass Wall (pivots smoothly upward from top hinge)
  const cutawayPivot = new THREE.Group();
  cutawayPivot.position.set(0, 6.36, 0.96);
  group.add(cutawayPivot);

  const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(spanLen - 0.8, 1.54), sharedMats.bridgeGlass);
  frontGlass.position.set(0, -0.8, 0);
  cutawayPivot.add(frontGlass);

  for (const mx of [-3.3, -2.2, -1.1, 0, 1.1, 2.2, 3.3]) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.62, 0.08), sharedMats.darkBronze);
    mullion.position.set(mx, -0.8, 0.02);
    cutawayPivot.add(mullion);
  }
  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(spanLen - 0.6, 0.1, 0.1), sharedMats.brass);
  bottomRail.position.set(0, -1.58, 0.02);
  cutawayPivot.add(bottomRail);

  // Precision Master Die Transfer Carriage riding on the internal bridge rails
  const syncCarriage = new THREE.Group();
  syncCarriage.position.set(-3.1, 5.15, 0);
  group.add(syncCarriage);

  const carriageChassis = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.18, 0.86), sharedMats.steel);
  carriageChassis.position.y = 0.04;
  syncCarriage.add(carriageChassis);

  const carriageHangerL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.92, 0.66), sharedMats.darkBronze);
  carriageHangerL.position.set(-0.46, 0.54, 0);
  syncCarriage.add(carriageHangerL);
  const carriageHangerR = carriageHangerL.clone();
  carriageHangerR.position.x = 0.46;
  syncCarriage.add(carriageHangerR);

  const carriageCrownMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    emissive: 0xb45309,
    emissiveIntensity: 0.38,
    metalness: 0.9,
    roughness: 0.2,
  });
  const carriageAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xd97706,
    emissiveIntensity: 0.42,
    metalness: 0.88,
    roughness: 0.18,
  });
  const carriageCrown = buildCrownSealAssembly(
    carriageCrownMat,
    sharedMats.darkBronze,
    carriageAccentMat
  );
  carriageCrown.scale.setScalar(0.84);
  carriageCrown.position.y = 0.14;
  syncCarriage.add(carriageCrown);

  // Underside Bridge Coupler Iris at mid-archway (x = -0.55, y = 4.52)
  const couplerHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.36, 0.22, 20),
    sharedMats.darkBronze
  );
  couplerHousing.position.set(-0.55, 4.48, 0.35);
  group.add(couplerHousing);

  const couplerIrisMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.25,
    roughness: 0.3,
    metalness: 0.6,
  });
  const couplerIris = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 20), couplerIrisMat);
  couplerIris.position.set(-0.55, 4.38, 0.35);
  group.add(couplerIris);

  // Vertical golden optical transfer conduit from bridge coupler down to van roof hatch (Act 3)
  const transferBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.3, 2.75, 20, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  transferBeam.position.set(-0.55, 3.04, 0.48);
  group.add(transferBeam);

  // Exact Descending Duplicate of the Crown Seal (slides smoothly from bridge down into van in Act 3)
  const descendingSeal = buildCrownSealAssembly(
    carriageCrownMat,
    sharedMats.darkBronze,
    carriageAccentMat
  );
  descendingSeal.scale.setScalar(0.88);
  descendingSeal.position.set(-0.55, 4.6, 0.48);
  descendingSeal.visible = false;
  group.add(descendingSeal);

  // Armored Peer-Only Blast Gates at both ends of the skybridge (slam shut in Act 5)
  const gateMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.82,
    roughness: 0.28,
    emissive: 0x059669,
    emissiveIntensity: 0.12,
  });
  const westBlastGate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.56, 1.72), gateMat);
  westBlastGate.position.set(-3.58, 7.15, 0);
  group.add(westBlastGate);

  const eastBlastGate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.56, 1.72), gateMat);
  eastBlastGate.position.set(3.58, 7.15, 0);
  group.add(eastBlastGate);

  // Underside Coupler Armored Lock Cap (seals off street-level drop in Act 5)
  const couplerBlastCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.14, 20),
    new THREE.MeshStandardMaterial({
      color: 0x065f46,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
      metalness: 0.72,
      roughness: 0.26,
    })
  );
  couplerBlastCap.position.set(-0.55, 4.35, 0.35);
  couplerBlastCap.scale.setScalar(0.01);
  couplerBlastCap.visible = false;
  group.add(couplerBlastCap);

  // Crisp Emerald Verified-Peer Optical Lock Strip along the bridge girder (Act 5)
  const peerShieldBar = new THREE.Mesh(
    new THREE.BoxGeometry(spanLen - 0.5, 0.12, 2.12),
    new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.9,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0,
    })
  );
  peerShieldBar.position.set(0, 4.66, 0);
  group.add(peerShieldBar);

  return {
    group,
    cutawayPivot,
    syncCarriage,
    carriageCrown,
    couplerIrisMat,
    transferBeam,
    descendingSeal,
    westBlastGate,
    eastBlastGate,
    peerShieldBar,
    couplerBlastCap,
  };
}

interface SideStreetVanHandle {
  group: THREE.Group;
  wheels: THREE.Group[];
  roofHatchDoor: THREE.Mesh;
  ribbonBadgeEmitter: THREE.Group;
  ribbonFlashBeam: THREE.Mesh;
  brakeLightMat: THREE.MeshStandardMaterial;
  stolenCrownGroup: THREE.Group;
  stolenCrownMat: THREE.MeshStandardMaterial;
  plateHighlightMat: THREE.MeshBasicMaterial;
}

/** Builds a realistic, everyday ordinary side-street commercial utility panel van
 *  (facing left toward the West Mint archway, with rotating wheels, headlights/brake lights,
 *  crisp rear & side-visible license plate 482-VAN, and an opening roof hatch for the stolen crown seal). */
function buildSideStreetVan(
  sharedMats: {
    darkBronze: THREE.MeshStandardMaterial;
    steel: THREE.MeshStandardMaterial;
  },
  contactShadowTex: THREE.CanvasTexture,
  trackTextures: THREE.Texture[],
  isSoftwareGl: boolean
): SideStreetVanHandle {
  const group = new THREE.Group();

  // Realistic weathered burgundy-red / commercial crimson-oxide utility paint (never blooms in daylight!)
  const bodyPaint = new THREE.MeshPhysicalMaterial({
    color: 0x8f2632,
    roughness: 0.48,
    metalness: 0.22,
    clearcoat: 0.28,
    clearcoatRoughness: 0.34,
  });
  const lowerTrimMat = new THREE.MeshStandardMaterial({
    color: 0x262c36,
    roughness: 0.72,
    metalness: 0.16,
  });
  const bumperMat = new THREE.MeshStandardMaterial({
    color: 0x1b2028,
    roughness: 0.74,
    metalness: 0.22,
  });
  const cabGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x121d2b,
    roughness: 0.14,
    metalness: 0.18,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
  });
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0x9aa3af,
    roughness: 0.52,
    metalness: 0.28,
  });

  // Soft ground contact shadow attached directly under van chassis
  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.1, 2.2),
    new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    })
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0.05, 0.03, 0);
  group.add(contactShadow);

  // Main rear cargo box (x = -0.35 .. +1.55, facing -X)
  const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.24, 1.46), bodyPaint);
  cargoBox.position.set(0.48, 1.06, 0);
  cargoBox.castShadow = !isSoftwareGl;
  cargoBox.receiveShadow = true;
  group.add(cargoBox);

  // Subtle commercial utility side stripes & horizontal stamped cargo ribs
  for (const sz of [-0.74, 0.74]) {
    const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.11, 0.025), stripeMat);
    sideStripe.position.set(0.48, 0.82, sz);
    group.add(sideStripe);

    const lowerRocker = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.22, 0.03), lowerTrimMat);
    lowerRocker.position.set(0.04, 0.44, sz);
    group.add(lowerRocker);
  }

  // Forward cab section (x = -1.18 .. -0.58)
  const cabLower = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.66, 1.44), bodyPaint);
  cabLower.position.set(-0.98, 0.77, 0);
  cabLower.castShadow = !isSoftwareGl;
  group.add(cabLower);

  // Sloped engine hood nose (x = -1.52)
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 1.38), bodyPaint);
  hood.position.set(-1.38, 0.7, 0);
  hood.rotation.z = 0.16;
  hood.castShadow = !isSoftwareGl;
  group.add(hood);

  // Cab roof & raked windshield cabin
  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 1.38), bodyPaint);
  cabRoof.position.set(-0.82, 1.62, 0);
  group.add(cabRoof);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 1.3), cabGlassMat);
  windshield.position.set(-1.14, 1.32, 0);
  windshield.rotation.z = -0.44;
  group.add(windshield);

  // Side cab windows & wing mirrors
  for (const sz of [-0.72, 0.72]) {
    const sideWin = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.46, 0.04), cabGlassMat);
    sideWin.position.set(-0.84, 1.3, sz);
    group.add(sideWin);

    const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.18), bumperMat);
    mirrorArm.position.set(-1.12, 1.15, sz * 1.12);
    group.add(mirrorArm);

    const mirrorHead = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.1), bumperMat);
    mirrorHead.position.set(-1.12, 1.18, sz * 1.24);
    group.add(mirrorHead);
  }

  // Front radiator grille, bumper & warm headlights (-X end)
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.84), bumperMat);
  grille.position.set(-1.65, 0.64, 0);
  group.add(grille);

  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.5), bumperMat);
  frontBumper.position.set(-1.62, 0.42, 0);
  group.add(frontBumper);

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0xfde68a,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });
  for (const lz of [-0.52, 0.52]) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.22), headlightMat);
    lamp.position.set(-1.64, 0.68, lz);
    group.add(lamp);
  }

  // Rear step bumper & brake lights (+X end)
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 1.5), bumperMat);
  rearBumper.position.set(1.58, 0.42, 0);
  group.add(rearBumper);

  const brakeLightMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    emissive: 0xef4444,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });
  for (const lz of [-0.58, 0.58]) {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.16), brakeLightMat);
    tail.position.set(1.56, 0.84, lz);
    group.add(tail);
  }

  // Crisp legible Side-Street License Plate (mounted on rear door AND right-rear quarter for clear camera & Audit Tower view!)
  const plateTex = createLicensePlateTexture('482-VAN', trackTextures);
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTex,
    roughness: 0.48,
    metalness: 0.14,
  });
  const rearPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.25), plateMat);
  rearPlate.position.set(1.57, 0.66, 0);
  rearPlate.rotation.y = Math.PI / 2;
  group.add(rearPlate);

  // Side-quarter municipal plate badge facing camera (+Z side, rear quarter) so viewer clearly reads 482-VAN
  const sidePlate = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.3), plateMat);
  sidePlate.position.set(0.95, 0.72, 0.75);
  group.add(sidePlate);

  // Crimson highlight bracket around license plate (activates during Act 4 Audit Tower mismatch!)
  const plateHighlightMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const plateHighlightFrame = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.43, 4), plateHighlightMat);
  plateHighlightFrame.rotation.z = Math.PI / 4;
  plateHighlightFrame.scale.set(1.32, 0.65, 1);
  plateHighlightFrame.position.set(0.95, 0.72, 0.77);
  group.add(plateHighlightFrame);

  // 4 realistic rubber wheels with 5-spoke silver alloy rims (radius 0.34, center at y = 0.36 -> flush with road y = 0.02!)
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x181b20,
    roughness: 0.88,
    metalness: 0.05,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.28,
    metalness: 0.82,
  });
  const wheels: THREE.Group[] = [];
  for (const [wx, wz] of [
    [-1.08, -0.74],
    [-1.08, 0.74],
    [0.92, -0.74],
    [0.92, 0.74],
  ]) {
    const wGroup = new THREE.Group();
    wGroup.position.set(wx, 0.36, wz);

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 22), tireMat);
    tire.rotation.x = Math.PI / 2;
    wGroup.add(tire);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.26, 16), rimMat);
    rim.rotation.x = Math.PI / 2;
    wGroup.add(rim);

    // 5 spokes so wheel rotation is visibly unmistakable as the van drives
    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.27), rimMat);
      spoke.rotation.z = (s / 5) * Math.PI;
      wGroup.add(spoke);
    }

    group.add(wGroup);
    wheels.push(wGroup);
  }

  // Sliding Roof Utility Hatch (slides open beneath the archway to flash ribbon & catch duplicate crown seal)
  const hatchFrame = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.08, 0.94), bumperMat);
  hatchFrame.position.set(0.05, 1.71, 0);
  group.add(hatchFrame);

  const roofHatchDoor = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.06, 0.84), bodyPaint);
  roofHatchDoor.position.set(0.05, 1.75, 0);
  group.add(roofHatchDoor);

  // Forged Crimson Ribbon Badge Emitter rising on a small stalk to flash the gatehouse in Act 2
  const ribbonBadgeEmitter = new THREE.Group();
  ribbonBadgeEmitter.position.set(-0.42, 1.66, 0.45);
  group.add(ribbonBadgeEmitter);

  const emitterStalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.28, 8), sharedMats.steel);
  emitterStalk.position.y = 0.14;
  ribbonBadgeEmitter.add(emitterStalk);

  const emitterMedallion = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16),
    new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0xf43f5e,
      emissiveIntensity: 1.2,
      metalness: 0.65,
      roughness: 0.25,
    })
  );
  emitterMedallion.rotation.z = Math.PI / 2;
  emitterMedallion.position.y = 0.3;
  ribbonBadgeEmitter.add(emitterMedallion);
  ribbonBadgeEmitter.visible = false;

  // Diagonal ribbon flash signal cone + 3 pulsing signal rings aimed from van toward the West Mint Gatehouse Reader
  const ribbonFlashBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.24, 3.0, 14, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  ribbonFlashBeam.position.set(-1.8, 2.25, 0.68);
  ribbonFlashBeam.rotation.z = 1.25;
  ribbonFlashBeam.rotation.y = -0.22;
  group.add(ribbonFlashBeam);

  // Stolen Duplicate Crown Seal sitting inside the van's roof receiver cradle (appears once drop finishes in Act 3,
  // then tarnishes into lifeless dead steel in Act 5 once Twin Towers recast twice!)
  const stolenCrownMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    emissive: 0xb45309,
    emissiveIntensity: 0.42,
    metalness: 0.9,
    roughness: 0.2,
  });
  const stolenCrownGroup = buildCrownSealAssembly(
    stolenCrownMat,
    sharedMats.darkBronze,
    stolenCrownMat
  );
  stolenCrownGroup.scale.setScalar(0.86);
  stolenCrownGroup.position.set(0.05, 1.72, 0);
  stolenCrownGroup.visible = false;
  group.add(stolenCrownGroup);

  return {
    group,
    wheels,
    roofHatchDoor,
    ribbonBadgeEmitter,
    ribbonFlashBeam,
    brakeLightMat,
    stolenCrownGroup,
    stolenCrownMat,
    plateHighlightMat,
  };
}

interface AuditTowerHandle {
  group: THREE.Group;
  rosterMat: THREE.MeshStandardMaterial;
  rosterTextures: Record<RosterDisplayMode, THREE.CanvasTexture>;
  currentMode: RosterDisplayMode;
  beaconGroup: THREE.Group;
  beaconMat: THREE.MeshStandardMaterial;
  beaconLight: THREE.PointLight;
  scannerPod: THREE.Object3D;
}

/** Builds the Bridge Audit Tower overlooking the archway with panoramic tinted glass,
 *  interior operator console, electronic Official Mint Roster board, optical license-plate scanner,
 *  and rooftop rotating warning beacon. */
function buildBridgeAuditTower(
  sharedMats: {
    granitePlinth: THREE.MeshStandardMaterial;
    darkBronze: THREE.MeshStandardMaterial;
    steel: THREE.MeshStandardMaterial;
    galleryGlass: THREE.MeshPhysicalMaterial;
  },
  contactShadowTex: THREE.CanvasTexture,
  trackTextures: THREE.Texture[],
  isSoftwareGl: boolean
): AuditTowerHandle {
  const group = new THREE.Group();

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.03;
  group.add(shadow);

  // Tapered granite & brushed steel support pier (y = 0 .. 1.85)
  const basePad = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.18, 0.32, 8), sharedMats.granitePlinth);
  basePad.position.y = 0.16;
  group.add(basePad);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.72, 1.54, 8), sharedMats.steel);
  column.position.y = 1.08;
  column.castShadow = !isSoftwareGl;
  group.add(column);

  // Cantilevered Control Deck Floor (y = 1.92)
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.22, 2.04), sharedMats.darkBronze);
  deck.position.y = 1.94;
  deck.castShadow = !isSoftwareGl;
  group.add(deck);

  // Interior operator console desk & glowing dual monitors visible through glass cabin
  const consoleDesk = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.54, 0.54), sharedMats.steel);
  consoleDesk.position.set(0, 2.32, -0.15);
  group.add(consoleDesk);

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.75,
    roughness: 0.2,
  });
  for (const mx of [-0.36, 0.36]) {
    const mon = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, 0.05), screenMat);
    mon.position.set(mx, 2.76, -0.18);
    group.add(mon);
  }

  // Control booth corner steel mullions + panoramic glass enclosure (y = 2.06 .. 3.32)
  for (const sx of [-1.06, 1.06]) {
    for (const sz of [-0.9, 0.9]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.26, 0.11), sharedMats.darkBronze);
      post.position.set(sx, 2.68, sz);
      group.add(post);
    }
  }
  const boothGlass = new THREE.Mesh(new THREE.BoxGeometry(2.08, 1.2, 1.76), sharedMats.galleryGlass);
  boothGlass.position.y = 2.68;
  group.add(boothGlass);

  // Cantilevered overhanging roof canopy (y = 3.38)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.64, 0.18, 2.28), sharedMats.darkBronze);
  roof.position.y = 3.38;
  roof.castShadow = !isSoftwareGl;
  group.add(roof);

  // Electronic Official Mint Roster Display mounted cleanly on the upper control fascia
  const rosterTextures: Record<RosterDisplayMode, THREE.CanvasTexture> = {
    STANDBY: createAuditRosterTexture('STANDBY', trackTextures),
    ALERT: createAuditRosterTexture('ALERT', trackTextures),
    LOCKED: createAuditRosterTexture('LOCKED', trackTextures),
  };
  const rosterHousing = new THREE.Mesh(new THREE.BoxGeometry(2.44, 1.22, 0.14), sharedMats.darkBronze);
  rosterHousing.position.set(0, 4.1, 0.28);
  group.add(rosterHousing);

  const rosterMat = new THREE.MeshStandardMaterial({
    map: rosterTextures.STANDBY,
    emissiveMap: rosterTextures.STANDBY,
    emissive: 0xffffff,
    emissiveIntensity: 0.52,
    roughness: 0.28,
    metalness: 0.16,
  });
  const rosterScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 1.1), rosterMat);
  rosterScreen.position.set(0, 4.1, 0.36);
  group.add(rosterScreen);

  // Rooftop Rotating Warning Beacon
  const beaconGroup = new THREE.Group();
  beaconGroup.position.set(0, 4.78, 0.28);
  group.add(beaconGroup);

  const beaconPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.14, 16), sharedMats.steel);
  beaconGroup.add(beaconPedestal);

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 1.2,
    roughness: 0.18,
    metalness: 0.2,
  });
  const beaconDome = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.22, 16), beaconMat);
  beaconDome.position.y = 0.16;
  beaconGroup.add(beaconDome);

  const beaconLight = new THREE.PointLight(0x38bdf8, 1.4, 8.0, 2);
  beaconLight.position.set(0, 5.02, 0.34);
  group.add(beaconLight);

  // Under-deck gimbaled Optical License-Plate Scanner Camera aimed forward-left into the archway
  const scannerPod = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), sharedMats.steel);
  scannerPod.position.set(-0.62, 1.8, 0.72);
  group.add(scannerPod);

  return {
    group,
    rosterMat,
    rosterTextures,
    currentMode: 'STANDBY',
    beaconGroup,
    beaconMat,
    beaconLight,
    scannerPod,
  };
}

/** Builds a realistic multi-part cast-iron city boulevard streetlamp. */
function buildStreetLamp(
  ironMat: THREE.MeshStandardMaterial,
  bulbMat: THREE.MeshStandardMaterial
): THREE.Group {
  const lamp = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.45, 10), ironMat);
  base.position.y = 0.225;
  lamp.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 2.95, 10), ironMat);
  pole.position.y = 1.9;
  lamp.add(pole);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.055, 0.055), ironMat);
  arm.position.set(0.2, 3.3, 0);
  lamp.add(arm);

  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.14, 8), ironMat);
  hood.position.set(0.42, 3.24, 0);
  lamp.add(hood);

  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), bulbMat);
  globe.position.set(0.42, 3.12, 0);
  lamp.add(globe);

  return lamp;
}

/**
 * Photorealistic PBR Three.js Briefing Scene for Scenario #039 (`dfir-dcsync-drsuapi-replication-eid4662`):
 * Twin Sovereign Mint Towers joined high above the city by an armored glass bridge,
 * an overlooked service ribbon on the gatehouse, an ordinary side-street van pulling beneath the archway
 * to receive an exact duplicate of the crown seal without ever entering the vault,
 * and the Bridge Audit Tower scanning the side-street license plate against the official mint roster,
 * locking the bridge gate to verified peer towers only, and recasting the crown seals twice.
 */
export function buildDcsyncBriefingMintScene(isSoftwareGl: boolean): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Procedural PBR texture sets
  const limestoneTex = createLimestoneAshlarTextures(2, 3, textures);
  const asphaltTex = createAsphaltTextures(12, 2, textures);
  const sidewalkTex = createSidewalkTexture(14, 4, textures);
  const contactShadowTex = createContactShadowTexture(textures);
  const ribbonTex = createServiceRibbonTexture(textures);

  // Shared realistic PBR materials
  const limestoneMat = new THREE.MeshStandardMaterial({
    map: limestoneTex.albedo,
    bumpMap: limestoneTex.bump,
    bumpScale: 0.045,
    roughness: 0.82,
    metalness: 0.04,
  });
  const granitePlinthMat = new THREE.MeshStandardMaterial({
    color: 0x646b75,
    bumpMap: limestoneTex.bump,
    bumpScale: 0.03,
    roughness: 0.78,
    metalness: 0.08,
  });
  const darkBronzeMat = new THREE.MeshStandardMaterial({
    color: 0x352c24,
    roughness: 0.34,
    metalness: 0.78,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4a448,
    roughness: 0.24,
    metalness: 0.88,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x5c6674,
    roughness: 0.32,
    metalness: 0.8,
  });
  const copperRoofMat = new THREE.MeshStandardMaterial({
    color: 0x3c5f58,
    roughness: 0.46,
    metalness: 0.56,
  });
  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x20252d,
    roughness: 0.5,
    metalness: 0.65,
  });
  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.85,
    roughness: 0.22,
  });
  const galleryGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const bridgeGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xcbe3f8,
    roughness: 0.09,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // 1. EXPANSIVE URBAN CITY GROUND, BOULEVARD, SIDEWALKS & DISTANT METROPOLITAN SKYLINE
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x525a66,
    roughness: 0.92,
    metalness: 0.04,
  });
  const cityGround = new THREE.Mesh(new THREE.PlaneGeometry(110, 96), groundMat);
  cityGround.rotation.x = -Math.PI / 2;
  cityGround.position.set(0, 0, -14);
  cityGround.receiveShadow = true;
  root.add(cityGround);

  // Asphalt Boulevard passing cleanly beneath the armored glass bridge archway (y = 0.02)
  const roadMat = new THREE.MeshStandardMaterial({
    map: asphaltTex.albedo,
    bumpMap: asphaltTex.bump,
    bumpScale: 0.025,
    roughness: 0.86,
    metalness: 0.06,
  });
  const roadSurface = new THREE.Mesh(new THREE.BoxGeometry(68, 0.04, 4.4), roadMat);
  roadSurface.position.set(0, 0.0, 0.55);
  roadSurface.receiveShadow = true;
  root.add(roadSurface);

  // Crisp weathered dashed center lane markings & archway crosswalk bars (y = 0.036 -> zero z-fighting!)
  const stripeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0x9aa3ae,
    roughness: 0.82,
    metalness: 0.02,
  });
  const stripeAmberMat = new THREE.MeshStandardMaterial({
    color: 0xc2871e,
    roughness: 0.78,
    metalness: 0.02,
  });
  for (let x = -22; x <= 22; x += 3.2) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.012, 0.12), stripeAmberMat);
    dash.position.set(x, 0.032, 0.55);
    root.add(dash);
  }
  for (let cz = -1.1; cz <= 2.2; cz += 0.55) {
    const crossBar = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.012, 0.24), stripeWhiteMat);
    crossBar.position.set(-2.45, 0.032, cz);
    root.add(crossBar);
  }

  // Raised Granite Sidewalks flanking North & South edges of the boulevard (y = 0.0 .. 0.16)
  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: sidewalkTex,
    roughness: 0.82,
    metalness: 0.06,
  });
  const northSidewalk = new THREE.Mesh(new THREE.BoxGeometry(68, 0.16, 10.5), sidewalkMat);
  northSidewalk.position.set(0, 0.08, -6.85);
  northSidewalk.receiveShadow = true;
  root.add(northSidewalk);

  const southSidewalk = new THREE.Mesh(new THREE.BoxGeometry(68, 0.16, 6.2), sidewalkMat);
  southSidewalk.position.set(0, 0.08, 5.85);
  southSidewalk.receiveShadow = true;
  root.add(southSidewalk);

  // Sidewalk granite plaza pads directly beneath Twin Mint Towers (flush at y = 0.16)
  for (const tx of [-5.6, 5.6]) {
    const towerShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 5.4),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      })
    );
    towerShadow.rotation.x = -Math.PI / 2;
    towerShadow.position.set(tx, 0.028, 0);
    root.add(towerShadow);
  }

  // Classic Cast-Iron City Streetlamps along the boulevard
  for (const [lx, lz, rotY] of [
    [-8.6, 3.05, Math.PI],
    [-2.5, 3.05, Math.PI],
    [7.8, 3.05, Math.PI],
    [-8.6, -1.95, 0],
    [8.6, -1.95, 0],
  ] as const) {
    const lamp = buildStreetLamp(ironMat, lampBulbMat);
    lamp.position.set(lx, 0.15, lz);
    lamp.rotation.y = rotY;
    root.add(lamp);
  }

  // Warm ambient archway streetlamp light illuminating the side-street van beneath the bridge
  const archwayLight = new THREE.PointLight(0xfde68a, 2.4, 11, 2);
  archwayLight.position.set(-0.4, 3.9, 1.4);
  root.add(archwayLight);

  // Layered Metropolitan City Skyline rising behind the Twin Sovereign Mint Towers
  const skylineFacadeMats = [0, 1, 2].map((seed) => {
    const tex = createSkyscraperFacadeTexture(seed, textures);
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.56,
      metalness: 0.34,
    });
  });

  const skylineSpecs: Array<[number, number, number, number, number, number]> = [
    [-25, -18, 4.2, 12.5, 3.8, 0],
    [-19.5, -22, 4.8, 16.0, 4.2, 1],
    [-14.2, -16, 3.8, 10.2, 3.6, 2],
    [-10.4, -24, 4.6, 17.8, 4.0, 0],
    [-6.2, -28, 5.2, 14.5, 4.5, 2],
    [-2.0, -20, 4.2, 11.4, 3.8, 1],
    [2.4, -25, 4.8, 15.8, 4.2, 0],
    [7.0, -21, 4.4, 12.8, 3.8, 2],
    [11.6, -18, 4.0, 10.6, 3.6, 1],
    [15.8, -24, 5.0, 16.8, 4.4, 0],
    [21.2, -20, 4.4, 13.4, 4.0, 2],
    [26.5, -23, 4.8, 11.2, 4.2, 1],
    [-28, -32, 6.2, 19.5, 5.0, 1],
    [-16, -34, 6.0, 21.0, 5.2, 0],
    [-4, -35, 6.4, 22.5, 5.2, 2],
    [9, -34, 5.8, 20.0, 4.8, 1],
    [22, -33, 6.0, 18.2, 5.0, 0],
  ];

  for (const [bx, bz, bw, bh, bd, mIdx] of skylineSpecs) {
    const bldg = new THREE.Mesh(
      new THREE.BoxGeometry(bw, bh, bd),
      skylineFacadeMats[mIdx]
    );
    bldg.position.set(bx, bh * 0.5, bz);
    root.add(bldg);

    // Subtle rooftop mechanical penthouse silhouette
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(bw * 0.52, 0.85, bd * 0.52),
      ironMat
    );
    crown.position.set(bx, bh + 0.42, bz);
    root.add(crown);
  }

  // 2. TWIN SOVEREIGN MINT TOWERS (West Tower DC01 & East Peer Tower DC02)
  const towerShared = {
    limestone: limestoneMat,
    granitePlinth: granitePlinthMat,
    darkBronze: darkBronzeMat,
    brass: brassMat,
    copperRoof: copperRoofMat,
    galleryGlass: galleryGlassMat,
  };
  const westTower = buildSovereignMintTower('WEST', towerShared, textures, isSoftwareGl);
  westTower.group.position.set(-5.6, 0, 0);
  root.add(westTower.group);

  const eastTower = buildSovereignMintTower('EAST', towerShared, textures, isSoftwareGl);
  eastTower.group.position.set(5.6, 0, 0);
  root.add(eastTower.group);

  // 3. GATEHOUSE ARCHWAY PILLAR & FORGOTTEN SERVICE RIBBON (on West Tower inner archway face)
  const gatehouseGroup = new THREE.Group();
  gatehouseGroup.position.set(-3.72, 0, 1.38);
  root.add(gatehouseGroup);

  const gatehousePier = new THREE.Mesh(new THREE.BoxGeometry(0.68, 3.65, 0.72), limestoneMat);
  gatehousePier.position.y = 1.825;
  gatehousePier.castShadow = !isSoftwareGl;
  gatehouseGroup.add(gatehousePier);

  const gatehouseCap = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.18, 0.86), darkBronzeMat);
  gatehouseCap.position.y = 3.72;
  gatehouseGroup.add(gatehouseCap);

  // Optical Ribbon Reader mounted on street-facing inner side of Gatehouse Pillar
  const readerBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.62, 0.42), darkBronzeMat);
  readerBox.position.set(0.38, 2.25, 0);
  gatehouseGroup.add(readerBox);

  const readerLensMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.7,
    roughness: 0.18,
    metalness: 0.4,
  });
  const readerLens = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 16), readerLensMat);
  readerLens.rotation.z = Math.PI / 2;
  readerLens.position.set(0.48, 2.34, 0);
  gatehouseGroup.add(readerLens);

  const gatePlaqueTex = createBrassPlaqueTexture('GATEHOUSE', 'BRIDGE COURIER ACCESS', textures);
  const gatePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.24),
    new THREE.MeshStandardMaterial({ map: gatePlaqueTex, roughness: 0.35, metalness: 0.45 })
  );
  gatePlaque.position.set(0, 3.12, 0.37);
  gatehouseGroup.add(gatePlaque);

  // Hanging Forgotten Crimson-Gold Service Ribbon (sways naturally in breeze; unhooks & removed in Act 5!)
  const ribbonAnchor = new THREE.Group();
  ribbonAnchor.position.set(0.36, 2.68, 0.38);
  gatehouseGroup.add(ribbonAnchor);

  const brassHook = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 14), brassMat);
  ribbonAnchor.add(brassHook);

  const ribbonMat = new THREE.MeshStandardMaterial({
    map: ribbonTex,
    emissive: 0xe11d48,
    emissiveIntensity: 0.22,
    roughness: 0.58,
    metalness: 0.14,
    side: THREE.DoubleSide,
  });
  const ribbonStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 1.05, 1, 6), ribbonMat);
  ribbonStrip.position.set(0, -0.54, 0.03);
  ribbonAnchor.add(ribbonStrip);

  const ribbonMedal = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.035, 16), brassMat);
  ribbonMedal.rotation.x = Math.PI / 2;
  ribbonMedal.position.set(0, -0.32, 0.06);
  ribbonAnchor.add(ribbonMedal);

  // 4. ELEVATED ARMORED GLASS SKYBRIDGE JOINING THE TWIN TOWERS HIGH ABOVE THE STREET
  const bridge = buildArmoredGlassBridge(
    {
      darkBronze: darkBronzeMat,
      steel: steelMat,
      brass: brassMat,
      bridgeGlass: bridgeGlassMat,
      limestone: limestoneMat,
    },
    isSoftwareGl
  );
  root.add(bridge.group);

  // 5. ORDINARY SIDE-STREET DELIVERY VAN (THE IMPOSTOR) + AMBIENT DISTANT CITY SEDAN
  const van = buildSideStreetVan(
    { darkBronze: darkBronzeMat, steel: steelMat },
    contactShadowTex,
    textures,
    isSoftwareGl
  );
  const VAN_START_X = 9.4;
  const VAN_STOP_X = -0.6;
  van.group.position.set(VAN_START_X, 0, 0.55);
  root.add(van.group);

  // Subtle passing slate-blue city commuter car cruising along the far lane so the boulevard feels alive
  const trafficCar = new THREE.Group();
  const trafficBodyMat = new THREE.MeshStandardMaterial({
    color: 0x3b4d63,
    roughness: 0.44,
    metalness: 0.32,
  });
  const trafficCabinMat = new THREE.MeshStandardMaterial({
    color: 0x182330,
    roughness: 0.2,
    metalness: 0.25,
  });
  const tChassis = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.52, 1.15), trafficBodyMat);
  tChassis.position.y = 0.54;
  trafficCar.add(tChassis);
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.42, 1.02), trafficCabinMat);
  tTop.position.set(-0.08, 0.96, 0);
  trafficCar.add(tTop);
  for (const [wx, wz] of [
    [-0.72, -0.58],
    [-0.72, 0.58],
    [0.72, -0.58],
    [0.72, 0.58],
  ]) {
    const tw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.16, 14),
      ironMat
    );
    tw.rotation.x = Math.PI / 2;
    tw.position.set(wx, 0.26, wz);
    trafficCar.add(tw);
  }
  trafficCar.position.set(-16, 0, -0.72);
  root.add(trafficCar);

  // Rising Security Bollards along the boulevard archway curbing (rise up in Act 5 to lock street access!)
  const bollards: THREE.Mesh[] = [];
  const bollardMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.72,
    roughness: 0.3,
    emissive: 0x10b981,
    emissiveIntensity: 0.35,
  });
  for (const bx of [-3.05, -2.55, 2.75, 3.25]) {
    const bol = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.72, 12), bollardMat);
    bol.position.set(bx, -0.32, 2.35);
    root.add(bol);
    bollards.push(bol);
  }

  // 6. BRIDGE AUDIT TOWER (NORTH INNER-EAST ARCHWAY SIDEWALK — 0% OCCLUSION OF EAST MINT TOWER VAULT DOORS!)
  const audit = buildBridgeAuditTower(
    {
      granitePlinth: granitePlinthMat,
      darkBronze: darkBronzeMat,
      steel: steelMat,
      galleryGlass: galleryGlassMat,
    },
    contactShadowTex,
    textures,
    isSoftwareGl
  );
  audit.group.position.set(2.05, 0.15, -2.35);
  audit.group.scale.setScalar(0.68);
  audit.group.rotation.y = -0.18;
  root.add(audit.group);

  // World-space dynamic Optical License-Plate Scanner Beam (apex locked to Audit Tower pod -> spreads onto van 482-VAN plate!)
  const scannerConeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const scannerCone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.0, 20, 1, true), scannerConeMat);
  scannerCone.visible = false;
  root.add(scannerCone);
  const scanStartVec = new THREE.Vector3();
  const scanEndVec = new THREE.Vector3();
  const scanDirVec = new THREE.Vector3();
  const scanDownAxis = new THREE.Vector3(0, -1, 0);

  // Floating 3D Callout Anchors (positioned clear of signboards & top-left HUD safe zone)
  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.2, 6.95, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.1, 3.95, -2.2);
  root.add(secondaryAnchor);

  const goldColor = new THREE.Color(0xeab308);
  const voidSteelColor = new THREE.Color(0x64748b);
  const goldEmissive = new THREE.Color(0xb45309);
  const deadEmissive = new THREE.Color(0x0f172a);
  const amberRecastColor = new THREE.Color(0xfbbf24);
  const emeraldRecastColor = new THREE.Color(0x10b981);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.4, 21.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 3.65, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.3, 4.0, 0.4),
    update: (timeSec, _phaseIdx, isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_TIMELINE_DURATION_SEC) + DCSYNC_TIMELINE_DURATION_SEC) %
          DCSYNC_TIMELINE_DURATION_SEC) /
        DCSYNC_TIMELINE_DURATION_SEC;
      const frame = evaluateDcsyncChoreography(tNorm, cutawayMode);

      // Subtle atmospheric light adaptation (strict anti-washout levels in light mode)
      const windowGlow = isDark ? 0.75 : 0.08;
      westTower.windowMat.emissiveIntensity = windowGlow;
      eastTower.windowMat.emissiveIntensity = windowGlow;
      archwayLight.intensity = isDark ? 1.8 : 0.35;

      // Ambient boulevard commuter car cruising smoothly along outer north lane in Acts 1-2
      const trafficX = -20 + ((tNorm * 2.4) % 1) * 40;
      trafficCar.position.x = trafficX;
      trafficCar.visible = Math.abs(trafficX) < 17.5;

      // 1. Twin Sovereign Mint Towers — Master Crown Seals spin smoothly (accelerate during Act 5 double recast!)
      const recastBoost = frame.recastPass1 * 5.5 + frame.recastPass2 * 6.5;
      const crownSpin = timeSec * 0.95 + recastBoost * 0.45;
      westTower.crownSpinner.rotation.y = crownSpin;
      eastTower.crownSpinner.rotation.y = -crownSpin * 0.9;

      // Double Recast Forge Rings inside BOTH Twin Mint Towers (Recast #1 Amber -> Recast #2 Emerald-Gold)
      const r1Scale = 0.72 + frame.recastPass1 * 0.85;
      const r2Scale = 0.72 + frame.recastPass2 * 0.95;
      for (const tower of [westTower, eastTower]) {
        tower.recastRing1.scale.setScalar(r1Scale);
        (tower.recastRing1.material as THREE.MeshStandardMaterial).opacity =
          frame.recastPass1 * 0.92;
        tower.recastRing2.scale.setScalar(r2Scale);
        (tower.recastRing2.material as THREE.MeshStandardMaterial).opacity =
          frame.recastPass2 * 0.95;

        const peakPulse = Math.max(frame.recastPass1, frame.recastPass2);
        tower.crownMat.emissiveIntensity = 0.28 + peakPulse * 1.15;
        if (frame.recastPass2 > 0.15) {
          tower.vaultLight.color.copy(amberRecastColor).lerp(emeraldRecastColor, frame.recastPass2 * 0.65);
        } else {
          tower.vaultLight.color.copy(amberRecastColor);
        }
        tower.vaultLight.intensity = (isDark ? 2.6 : 1.4) + peakPulse * 3.2;
      }

      // 2. Gatehouse Forgotten Service Ribbon (sways naturally, flashes in Act 2, physically unhooks & drops in Act 5!)
      const drop = frame.ribbonDropProgress;
      ribbonAnchor.visible = drop < 0.96;
      if (drop < 0.96) {
        ribbonAnchor.position.y = 2.68 - drop * 2.1;
        ribbonAnchor.rotation.z = Math.sin(timeSec * 2.3) * 0.06 + drop * 0.9;
        ribbonAnchor.rotation.x = Math.cos(timeSec * 1.7) * 0.03 + drop * 0.4;
        ribbonMat.emissiveIntensity = 0.16 + frame.aclRibbonGlow * 0.45 + frame.ribbonFlash * 0.85;
      }
      if (frame.peerGateShield > 0.45) {
        readerLensMat.color.setHex(0x10b981);
        readerLensMat.emissive.setHex(0x10b981);
        readerLensMat.emissiveIntensity = 1.4;
      } else if (frame.ribbonFlash > 0.1) {
        readerLensMat.color.setHex(0xf43f5e);
        readerLensMat.emissive.setHex(0xf43f5e);
        readerLensMat.emissiveIntensity = 1.6 * frame.ribbonFlash + 0.4;
      } else {
        readerLensMat.color.setHex(0xf59e0b);
        readerLensMat.emissive.setHex(0xf59e0b);
        readerLensMat.emissiveIntensity = 0.4 + frame.aclRibbonGlow * 0.55;
      }

      // 3. Ordinary Side-Street Van rolls under archway with physically accurate wheel rotation & braking
      const vanX = THREE.MathUtils.lerp(VAN_START_X, VAN_STOP_X, frame.courierAdvance);
      van.group.position.x = vanX;
      const travelDist = VAN_START_X - vanX;
      const wheelRot = travelDist / 0.34;
      for (const w of van.wheels) {
        w.rotation.z = wheelRot;
      }
      const brakingWindow = frame.courierAdvance > 0.72 && frame.courierAdvance < 0.99 ? 1 : 0;
      van.brakeLightMat.emissiveIntensity = brakingWindow ? 2.1 : frame.courierAdvance >= 0.99 ? 1.0 : 0.3;
      van.group.rotation.z = brakingWindow ? 0.022 * Math.sin(frame.courierAdvance * Math.PI) : 0;

      // Sliding roof hatch opens cleanly beneath archway, revealing forged ribbon badge emitter
      van.roofHatchDoor.position.x = 0.05 + frame.hatchOpen * 0.76;
      van.ribbonBadgeEmitter.visible = frame.ribbonFlash > 0.04 && frame.peerGateShield < 0.4;
      van.ribbonBadgeEmitter.position.y = 1.56 + Math.min(1, frame.ribbonFlash * 1.4) * 0.24;
      (van.ribbonFlashBeam.material as THREE.MeshBasicMaterial).opacity =
        frame.ribbonFlash * 0.52 * (1 - frame.peerGateShield);

      // 4. Armored Glass Skybridge Cutaway, Back-and-Forth Peer Die-Sync Carriage & Duplicate Crown Seal Descent
      bridge.cutawayPivot.rotation.x = -frame.cutawayOpen * 1.15;

      if (frame.actIndex === 0) {
        // Act 1: Legitimate Peer Mint Die Synchronization gliding back and forth between West & East Towers!
        bridge.syncCarriage.position.x = frame.peerSyncOscillation * 2.75;
      } else if (frame.peerGateShield > 0.45) {
        // Act 5: Locked to verified peer towers only -> healthy peer-to-peer sync resumes!
        const peerSyncWave = Math.sin(timeSec * 0.9) * 2.4;
        bridge.syncCarriage.position.x = THREE.MathUtils.lerp(
          -0.55,
          peerSyncWave,
          (frame.peerGateShield - 0.45) / 0.55
        );
      } else if (frame.actIndex === 1) {
        // Act 2: Carriage parks at West Tower ready for incoming courier call
        bridge.syncCarriage.position.x = THREE.MathUtils.lerp(0, -3.1, Math.min(1, frame.courierAdvance * 1.5));
      } else {
        // Act 3-4: Carriage glides from West Tower to mid-archway coupler directly above the street van
        bridge.syncCarriage.position.x = THREE.MathUtils.lerp(-3.1, -0.55, frame.ledgerStreamProgress);
      }
      bridge.carriageCrown.rotation.y = timeSec * 1.6;

      // Underside optical conduit & exact duplicate Crown Seal descending straight into van (Act 3)
      const dropActive =
        frame.duplicateDropProgress > 0.02 &&
        frame.duplicateDropProgress < 0.98 &&
        frame.peerGateShield < 0.35;
      bridge.descendingSeal.visible = dropActive;
      bridge.descendingSeal.position.y = THREE.MathUtils.lerp(4.65, 1.88, frame.duplicateDropProgress);
      bridge.descendingSeal.rotation.y = timeSec * 2.2;

      const beamAlpha =
        frame.duplicateDropProgress > 0.02 && frame.peerGateShield < 0.35
          ? Math.sin(Math.min(1, frame.duplicateDropProgress) * Math.PI) * 0.28
          : 0;
      (bridge.transferBeam.material as THREE.MeshBasicMaterial).opacity = beamAlpha;
      bridge.couplerIrisMat.emissiveIntensity = dropActive ? 1.5 : 0.25;

      // Once duplicate reaches the van roof cradle, it stays seated inside the van — then tarnishes/voids in Act 5!
      van.stolenCrownGroup.visible = frame.duplicateDropProgress >= 0.92;
      van.stolenCrownGroup.rotation.y = timeSec * (1.2 * (1 - frame.stolenSealVoided));
      van.stolenCrownMat.color.copy(goldColor).lerp(voidSteelColor, frame.stolenSealVoided);
      van.stolenCrownMat.emissive.copy(goldEmissive).lerp(deadEmissive, frame.stolenSealVoided);
      van.stolenCrownMat.emissiveIntensity = THREE.MathUtils.lerp(0.38, 0.04, frame.stolenSealVoided);
      van.stolenCrownMat.roughness = THREE.MathUtils.lerp(0.22, 0.86, frame.stolenSealVoided);

      // Act 5: Heavy Armored Peer-Only Bridge Gates slam closed, coupler locks, & street bollards rise!
      const gateDrop = frame.peerGateShield;
      bridge.westBlastGate.position.y = THREE.MathUtils.lerp(7.15, 5.56, gateDrop);
      bridge.eastBlastGate.position.y = THREE.MathUtils.lerp(7.15, 5.56, gateDrop);
      bridge.couplerBlastCap.visible = gateDrop > 0.15;
      bridge.couplerBlastCap.scale.setScalar(Math.max(0.01, gateDrop));
      (bridge.peerShieldBar.material as THREE.MeshStandardMaterial).opacity = gateDrop * 0.85;
      for (const bol of bollards) {
        bol.position.y = THREE.MathUtils.lerp(-0.32, 0.38, gateDrop);
      }

      // 5. Bridge Audit Tower — Optical License-Plate Scan, Roster Mismatch Display & Rotating Beacon
      const scanActive = frame.plateScanProgress > 0.05 && frame.peerGateShield < 0.45;
      scannerCone.visible = scanActive;
      if (scanActive) {
        audit.group.updateMatrixWorld(true);
        audit.scannerPod.getWorldPosition(scanStartVec);
        // Convert world coordinates cleanly to root-local coordinates for exact aiming onto van's rear plate
        root.worldToLocal(scanStartVec);
        scanEndVec.set(vanX + 1.54, 0.68, 0.55);
        scanDirVec.subVectors(scanEndVec, scanStartVec);
        const beamLen = Math.max(0.2, scanDirVec.length());
        scannerCone.position.copy(scanStartVec).addScaledVector(scanDirVec, 0.5);
        scannerCone.scale.set(1, beamLen, 1);
        scannerCone.quaternion.setFromUnitVectors(scanDownAxis, scanDirVec.normalize());
        scannerConeMat.opacity = 0.24 + Math.sin(timeSec * 8) * 0.06;
        scannerConeMat.color.setHex(frame.auditAlarmLevel > 0.35 ? 0xf43f5e : 0x38bdf8);
      } else {
        scannerConeMat.opacity = 0;
      }
      van.plateHighlightMat.opacity =
        frame.auditAlarmLevel > 0.2 && frame.peerGateShield < 0.55
          ? 0.55 + Math.sin(timeSec * 9) * 0.35
          : 0;

      // Switch Audit Tower Electronic Roster Display texture cleanly across acts
      const nextMode: RosterDisplayMode =
        frame.peerGateShield >= 0.45
          ? 'LOCKED'
          : frame.auditAlarmLevel >= 0.18
            ? 'ALERT'
            : 'STANDBY';
      if (audit.currentMode !== nextMode) {
        audit.currentMode = nextMode;
        audit.rosterMat.map = audit.rosterTextures[nextMode];
        audit.rosterMat.emissiveMap = audit.rosterTextures[nextMode];
        audit.rosterMat.needsUpdate = true;
      }

      // Rooftop rotating warning beacon
      audit.beaconGroup.rotation.y = timeSec * (nextMode === 'ALERT' ? 7.5 : 1.4);
      if (nextMode === 'ALERT') {
        const pulse = 1.6 + Math.sin(timeSec * 12) * 0.9;
        audit.beaconMat.color.setHex(0xe11d48);
        audit.beaconMat.emissive.setHex(0xf43f5e);
        audit.beaconMat.emissiveIntensity = pulse;
        audit.beaconLight.color.setHex(0xf43f5e);
        audit.beaconLight.intensity = 2.6 + Math.sin(timeSec * 12) * 1.1;
      } else if (nextMode === 'LOCKED') {
        audit.beaconMat.color.setHex(0x10b981);
        audit.beaconMat.emissive.setHex(0x10b981);
        audit.beaconMat.emissiveIntensity = 1.7;
        audit.beaconLight.color.setHex(0x10b981);
        audit.beaconLight.intensity = 2.2;
      } else {
        audit.beaconMat.color.setHex(0x38bdf8);
        audit.beaconMat.emissive.setHex(0x0ea5e9);
        audit.beaconMat.emissiveIntensity = 1.0;
        audit.beaconLight.color.setHex(0x38bdf8);
        audit.beaconLight.intensity = 1.2;
      }

      return {
        glitchIntensity: Math.max(frame.duplicateDropProgress * 0.4, frame.auditAlarmLevel * 0.45),
        magicDustIntensity: 0,
        stasisIntensity: frame.peerGateShield * 0.4,
        brakeReleaseBoost: frame.ledgerStreamProgress * 0.3,
      };
    },
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      for (const tex of textures) {
        tex.dispose();
      }
    },
  };
}
