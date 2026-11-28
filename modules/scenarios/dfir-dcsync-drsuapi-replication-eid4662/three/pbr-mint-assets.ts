import * as THREE from 'three';

export interface ProceduralTextureBundle {
  albedo: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

export interface MintPbrPalette {
  limestone: THREE.MeshStandardMaterial;
  granitePlinth: THREE.MeshStandardMaterial;
  darkBronze: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  copperRoof: THREE.MeshStandardMaterial;
  iron: THREE.MeshStandardMaterial;
  asphalt: THREE.MeshStandardMaterial;
  sidewalk: THREE.MeshStandardMaterial;
  galleryGlass: THREE.MeshPhysicalMaterial;
  bridgeGlass: THREE.MeshPhysicalMaterial;
  contactShadowTex: THREE.CanvasTexture;
  ribbonTex: THREE.CanvasTexture;
  skylineMats: THREE.MeshStandardMaterial[];
}

export function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function configureTexture(
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

export function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

export function createLimestoneAshlarTextures(
  repeatX: number,
  repeatY: number,
  track: THREE.Texture[]
): ProceduralTextureBundle {
  const size = 512;
  const [albedoCanvas, aCtx] = makeCanvas(size, size);
  const [bumpCanvas, bCtx] = makeCanvas(size, size);

  aCtx.fillStyle = '#a49682';
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
      const lum = Math.round(166 + (tone - 0.5) * 22);
      const warm = Math.round(156 + (tone - 0.5) * 18);
      const cool = Math.round(140 + (tone - 0.5) * 16);

      aCtx.fillStyle = `rgb(${lum}, ${warm}, ${cool})`;
      aCtx.fillRect(bx + 2, by + 2, colW - 4, rowH - 4);

      for (let g = 0; g < 18; g++) {
        const gx = bx + 4 + hash2d(c * 31 + g, r * 17) * (colW - 8);
        const gy = by + 4 + hash2d(c * 19, r * 23 + g) * (rowH - 8);
        const alpha = 0.06 + hash2d(g, r + c) * 0.06;
        aCtx.fillStyle = g % 2 === 0 ? `rgba(62,53,42,${alpha})` : `rgba(232,222,206,${alpha})`;
        aCtx.fillRect(gx, gy, 8 + (g % 5) * 3, 2);
      }

      aCtx.strokeStyle = 'rgba(72, 62, 50, 0.72)';
      aCtx.lineWidth = 2;
      aCtx.strokeRect(bx + 1, by + 1, colW - 2, rowH - 2);

      const bumpLum = Math.round(172 + (tone - 0.5) * 28);
      bCtx.fillStyle = `rgb(${bumpLum}, ${bumpLum}, ${bumpLum})`;
      bCtx.fillRect(bx + 3, by + 3, colW - 6, rowH - 6);
      bCtx.strokeStyle = '#323232';
      bCtx.lineWidth = 3;
      bCtx.strokeRect(bx + 1, by + 1, colW - 2, rowH - 2);
    }
  }

  const albedo = configureTexture(new THREE.CanvasTexture(albedoCanvas), true, repeatX, repeatY);
  const bump = configureTexture(new THREE.CanvasTexture(bumpCanvas), false, repeatX, repeatY);
  track.push(albedo, bump);
  return { albedo, bump };
}

export function createAsphaltTextures(
  repeatX: number,
  repeatY: number,
  track: THREE.Texture[]
): ProceduralTextureBundle {
  const size = 512;
  const [albedoCanvas, aCtx] = makeCanvas(size, size);
  const [bumpCanvas, bCtx] = makeCanvas(size, size);

  aCtx.fillStyle = '#262a31';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#7c7c7c';
  bCtx.fillRect(0, 0, size, size);

  const bandGrad = aCtx.createLinearGradient(0, 0, 0, size);
  bandGrad.addColorStop(0.0, 'rgba(14,17,22,0.22)');
  bandGrad.addColorStop(0.24, 'rgba(54,60,70,0.16)');
  bandGrad.addColorStop(0.5, 'rgba(16,19,24,0.24)');
  bandGrad.addColorStop(0.76, 'rgba(56,62,72,0.16)');
  bandGrad.addColorStop(1.0, 'rgba(14,17,22,0.22)');
  aCtx.fillStyle = bandGrad;
  aCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 6000; i++) {
    const x = hash2d(i * 1.13, i * 0.71) * size;
    const y = hash2d(i * 0.43, i * 1.91) * size;
    const v = Math.round(28 + hash2d(i, 9.1) * 40);
    aCtx.fillStyle = `rgb(${v}, ${v + 2}, ${v + 5})`;
    aCtx.fillRect(x, y, 2, 2);

    const bv = Math.round(88 + hash2d(i, 3.7) * 92);
    bCtx.fillStyle = `rgb(${bv}, ${bv}, ${bv})`;
    bCtx.fillRect(x, y, 2, 2);
  }

  const albedo = configureTexture(new THREE.CanvasTexture(albedoCanvas), true, repeatX, repeatY);
  const bump = configureTexture(new THREE.CanvasTexture(bumpCanvas), false, repeatX, repeatY);
  track.push(albedo, bump);
  return { albedo, bump };
}

export function createSidewalkTexture(
  repeatX: number,
  repeatY: number,
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  ctx.fillStyle = '#737a84';
  ctx.fillRect(0, 0, size, size);

  const cells = 4;
  const step = size / cells;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const n = hash2d(c + 5, r + 11);
      const v = Math.round(116 + (n - 0.5) * 16);
      ctx.fillStyle = `rgb(${v}, ${v + 2}, ${v + 5})`;
      ctx.fillRect(c * step + 2, r * step + 2, step - 4, step - 4);
      ctx.strokeStyle = 'rgba(48, 54, 62, 0.65)';
      ctx.lineWidth = 2;
      ctx.strokeRect(c * step + 1, r * step + 1, step - 2, step - 2);
    }
  }
  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, repeatX, repeatY);
  track.push(tex);
  return tex;
}

export function createSkyscraperFacadeTexture(
  seed: number,
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 512);
  const baseTone = 38 + (seed % 3) * 12;
  ctx.fillStyle = `rgb(${baseTone}, ${baseTone + 7}, ${baseTone + 16})`;
  ctx.fillRect(0, 0, 256, 512);

  const cols = 8;
  const rows = 20;
  const cw = 256 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = hash2d(c + seed * 7, r + seed * 13);
      if (p > 0.78) {
        ctx.fillStyle = 'rgba(235, 198, 130, 0.72)';
      } else if (p > 0.44) {
        ctx.fillStyle = 'rgba(104, 138, 174, 0.48)';
      } else {
        ctx.fillStyle = 'rgba(26, 36, 52, 0.8)';
      }
      ctx.fillRect(c * cw + 4, r * rh + 4, cw - 8, rh - 8);
    }
  }
  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

export function createContactShadowTexture(track: THREE.Texture[]): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 256);
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0.0, 'rgba(8, 12, 20, 0.62)');
  grad.addColorStop(0.55, 'rgba(8, 12, 20, 0.3)');
  grad.addColorStop(1.0, 'rgba(8, 12, 20, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = configureTexture(new THREE.CanvasTexture(canvas), false, 1, 1);
  track.push(tex);
  return tex;
}

export function createBrassPlaqueTexture(
  title: string,
  subtitle: string,
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 144);
  const bg = ctx.createLinearGradient(0, 0, 512, 144);
  bg.addColorStop(0, '#241c13');
  bg.addColorStop(0.5, '#35291b');
  bg.addColorStop(1, '#1e1710');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 144);

  ctx.strokeStyle = '#d4a038';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 128);
  ctx.strokeStyle = 'rgba(235, 198, 108, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 480, 112);

  ctx.fillStyle = '#f5dc9b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 32px Georgia, serif';
  ctx.fillText(title, 256, 54);

  ctx.fillStyle = '#cfb06e';
  ctx.font = '600 20px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(subtitle, 256, 102);

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

export function createLedBoardTexture(
  header: string,
  lines: Array<{ text: string; color: string }>,
  tone: 'SKY' | 'ROSE' | 'EMERALD' | 'AMBER',
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(640, 320);
  const palettes = {
    SKY: { bg: '#081524', border: '#38bdf8', headerBg: '#0369a1' },
    ROSE: { bg: '#220710', border: '#f43f5e', headerBg: '#be123c' },
    EMERALD: { bg: '#061f17', border: '#10b981', headerBg: '#047857' },
    AMBER: { bg: '#221406', border: '#f59e0b', headerBg: '#b45309' },
  }[tone];

  ctx.fillStyle = palettes.bg;
  ctx.fillRect(0, 0, 640, 320);

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let y = 0; y < 320; y += 6) {
    ctx.fillRect(0, y, 640, 2);
  }

  ctx.fillStyle = palettes.headerBg;
  ctx.fillRect(10, 10, 620, 62);
  ctx.strokeStyle = palettes.border;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 628, 308);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 26px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(header, 320, 42);

  ctx.textAlign = 'left';
  lines.forEach((line, idx) => {
    ctx.fillStyle = line.color;
    ctx.font = idx === 0 ? '800 25px ui-monospace, monospace' : '700 22px ui-monospace, monospace';
    ctx.fillText(line.text, 34, 122 + idx * 54);
  });

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

export function createServiceRibbonTexture(track: THREE.Texture[]): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(256, 512);
  const bg = ctx.createLinearGradient(0, 0, 256, 0);
  bg.addColorStop(0, '#6e1020');
  bg.addColorStop(0.25, '#99182e');
  bg.addColorStop(0.5, '#b21e38');
  bg.addColorStop(0.75, '#99182e');
  bg.addColorStop(1, '#6e1020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 512);

  ctx.fillStyle = 'rgba(255, 225, 225, 0.08)';
  for (let y = 0; y < 512; y += 6) {
    ctx.fillRect(0, y, 256, 2);
  }

  ctx.fillStyle = '#d99b10';
  ctx.fillRect(14, 0, 14, 512);
  ctx.fillRect(228, 0, 14, 512);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(19, 0, 4, 512);
  ctx.fillRect(233, 0, 4, 512);

  ctx.strokeStyle = '#eab308';
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
  ctx.fillText('1131F6AD', 128, 360);

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

export function createLicensePlateTexture(
  plateCode: string,
  track: THREE.Texture[]
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 224);
  const bg = ctx.createLinearGradient(0, 0, 0, 224);
  bg.addColorStop(0, '#d2dae5');
  bg.addColorStop(1, '#b8c3d1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 224);

  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(10, 10, 492, 50);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, 500, 212);

  ctx.fillStyle = '#f1f5f9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 24px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('MUNICIPAL SIDE-STREET COMMERCIAL', 256, 35);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 94px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(plateCode, 256, 138);

  const tex = configureTexture(new THREE.CanvasTexture(canvas), true, 1, 1);
  track.push(tex);
  return tex;
}

export function createMintPbrPalette(track: THREE.Texture[]): MintPbrPalette {
  const limestoneTex = createLimestoneAshlarTextures(2, 3, track);
  const asphaltTex = createAsphaltTextures(12, 2, track);
  const sidewalkTex = createSidewalkTexture(14, 4, track);
  const contactShadowTex = createContactShadowTexture(track);
  const ribbonTex = createServiceRibbonTexture(track);

  const skylineMats = [0, 1, 2].map((seed) => {
    const tex = createSkyscraperFacadeTexture(seed, track);
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.62,
      metalness: 0.28,
    });
  });

  return {
    limestone: new THREE.MeshStandardMaterial({
      map: limestoneTex.albedo,
      bumpMap: limestoneTex.bump,
      bumpScale: 0.045,
      roughness: 0.84,
      metalness: 0.04,
    }),
    granitePlinth: new THREE.MeshStandardMaterial({
      color: 0x5c636d,
      bumpMap: limestoneTex.bump,
      bumpScale: 0.03,
      roughness: 0.8,
      metalness: 0.08,
    }),
    darkBronze: new THREE.MeshStandardMaterial({
      color: 0x302720,
      roughness: 0.36,
      metalness: 0.78,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xc9963a,
      roughness: 0.26,
      metalness: 0.86,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: 0x525c6a,
      roughness: 0.36,
      metalness: 0.78,
    }),
    copperRoof: new THREE.MeshStandardMaterial({
      color: 0x355851,
      roughness: 0.48,
      metalness: 0.54,
    }),
    iron: new THREE.MeshStandardMaterial({
      color: 0x1c2129,
      roughness: 0.52,
      metalness: 0.64,
    }),
    asphalt: new THREE.MeshStandardMaterial({
      map: asphaltTex.albedo,
      bumpMap: asphaltTex.bump,
      bumpScale: 0.025,
      roughness: 0.88,
      metalness: 0.05,
    }),
    sidewalk: new THREE.MeshStandardMaterial({
      map: sidewalkTex,
      roughness: 0.84,
      metalness: 0.06,
    }),
    galleryGlass: new THREE.MeshPhysicalMaterial({
      color: 0xbcd8f0,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    bridgeGlass: new THREE.MeshPhysicalMaterial({
      color: 0xb6d3ec,
      roughness: 0.1,
      metalness: 0.08,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    contactShadowTex,
    ribbonTex,
    skylineMats,
  };
}

/** Sculpted realistic golden Sovereign Crown Seal & Master Coin Die. */
export function buildCrownSealAssembly(
  goldMat: THREE.MeshStandardMaterial,
  darkBronzeMat: THREE.MeshStandardMaterial,
  accentRingMat: THREE.MeshStandardMaterial
): THREE.Group {
  const group = new THREE.Group();

  const dieBase = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.22, 28), darkBronzeMat);
  dieBase.position.y = 0.11;
  group.add(dieBase);

  const coinDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 28), goldMat);
  coinDisk.position.y = 0.26;
  group.add(coinDisk);

  const crownBand = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 14, 28), goldMat);
  crownBand.rotation.x = Math.PI / 2;
  crownBand.position.y = 0.36;
  group.add(crownBand);

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 12, 24), accentRingMat);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.34;
  group.add(innerRing);

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

  const centerOrb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), goldMat);
  centerOrb.position.y = 0.48;
  group.add(centerOrb);

  return group;
}

/** Realistic cast-iron boulevard streetlamp. */
export function buildStreetLamp(
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

/** Distant urban city skyline backdrop for grounded outdoor architectural scenes. */
export function addCitySkylineBackdrop(
  root: THREE.Group,
  palette: MintPbrPalette,
  zOffset = 0
): void {
  const specs: Array<[number, number, number, number, number, number]> = [
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
  ];
  for (const [bx, bz, bw, bh, bd, mIdx] of specs) {
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), palette.skylineMats[mIdx]);
    bldg.position.set(bx, bh * 0.5, bz + zOffset);
    root.add(bldg);
    const crown = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.52, 0.85, bd * 0.52), palette.iron);
    crown.position.set(bx, bh + 0.42, bz + zOffset);
    root.add(crown);
  }
}

export interface RealisticCourierVanHandle {
  group: THREE.Group;
  wheels: THREE.Group[];
  roofHatchDoor: THREE.Mesh;
  brakeLightMat: THREE.MeshStandardMaterial;
  plateHighlightMat: THREE.MeshBasicMaterial;
}

/** Realistic weathered burgundy-red commercial side-street van with 5-spoke rotating wheels,
 *  opening roof utility hatch, recessed cab glass, headlights/brake lights, and stamped 482-VAN plates. */
export function buildRealisticCourierVan(
  contactShadowTex: THREE.CanvasTexture,
  track: THREE.Texture[],
  isSoftwareGl: boolean,
  plateCode = '482-VAN'
): RealisticCourierVanHandle {
  const group = new THREE.Group();

  const bodyPaint = new THREE.MeshPhysicalMaterial({
    color: 0x86232e,
    roughness: 0.46,
    metalness: 0.22,
    clearcoat: 0.28,
    clearcoatRoughness: 0.34,
  });
  const lowerTrimMat = new THREE.MeshStandardMaterial({
    color: 0x242a34,
    roughness: 0.72,
    metalness: 0.16,
  });
  const bumperMat = new THREE.MeshStandardMaterial({
    color: 0x181c24,
    roughness: 0.76,
    metalness: 0.22,
  });
  const cabGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x101a28,
    roughness: 0.14,
    metalness: 0.18,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
  });
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0x8e98a6,
    roughness: 0.52,
    metalness: 0.28,
  });

  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.1, 2.2),
    new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.84,
      depthWrite: false,
    })
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0.05, 0.03, 0);
  group.add(contactShadow);

  const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.24, 1.46), bodyPaint);
  cargoBox.position.set(0.48, 1.06, 0);
  cargoBox.castShadow = !isSoftwareGl;
  cargoBox.receiveShadow = true;
  group.add(cargoBox);

  for (const sz of [-0.74, 0.74]) {
    const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.11, 0.025), stripeMat);
    sideStripe.position.set(0.48, 0.82, sz);
    group.add(sideStripe);

    const lowerRocker = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.22, 0.03), lowerTrimMat);
    lowerRocker.position.set(0.04, 0.44, sz);
    group.add(lowerRocker);
  }

  const cabLower = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.66, 1.44), bodyPaint);
  cabLower.position.set(-0.98, 0.77, 0);
  cabLower.castShadow = !isSoftwareGl;
  group.add(cabLower);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 1.38), bodyPaint);
  hood.position.set(-1.38, 0.7, 0);
  hood.rotation.z = 0.16;
  hood.castShadow = !isSoftwareGl;
  group.add(hood);

  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 1.38), bodyPaint);
  cabRoof.position.set(-0.82, 1.62, 0);
  group.add(cabRoof);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 1.3), cabGlassMat);
  windshield.position.set(-1.14, 1.32, 0);
  windshield.rotation.z = -0.44;
  group.add(windshield);

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

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.84), bumperMat);
  grille.position.set(-1.65, 0.64, 0);
  group.add(grille);

  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.5), bumperMat);
  frontBumper.position.set(-1.62, 0.42, 0);
  group.add(frontBumper);

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0xfde68a,
    emissiveIntensity: 0.72,
    roughness: 0.22,
  });
  for (const lz of [-0.52, 0.52]) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.22), headlightMat);
    lamp.position.set(-1.64, 0.68, lz);
    group.add(lamp);
  }

  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 1.5), bumperMat);
  rearBumper.position.set(1.58, 0.42, 0);
  group.add(rearBumper);

  const brakeLightMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    emissive: 0xef4444,
    emissiveIntensity: 0.45,
    roughness: 0.22,
  });
  for (const lz of [-0.58, 0.58]) {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.16), brakeLightMat);
    tail.position.set(1.56, 0.84, lz);
    group.add(tail);
  }

  const plateTex = createLicensePlateTexture(plateCode, track);
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTex,
    roughness: 0.5,
    metalness: 0.14,
  });
  const rearPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.25), plateMat);
  rearPlate.position.set(1.57, 0.66, 0);
  rearPlate.rotation.y = Math.PI / 2;
  group.add(rearPlate);

  const sidePlate = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.3), plateMat);
  sidePlate.position.set(0.95, 0.72, 0.75);
  group.add(sidePlate);

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

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x16191f,
    roughness: 0.88,
    metalness: 0.05,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xb8c2ce,
    roughness: 0.32,
    metalness: 0.8,
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

    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.27), rimMat);
      spoke.rotation.z = (s / 5) * Math.PI;
      wGroup.add(spoke);
    }

    group.add(wGroup);
    wheels.push(wGroup);
  }

  const hatchFrame = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.08, 0.94), bumperMat);
  hatchFrame.position.set(0.05, 1.71, 0);
  group.add(hatchFrame);

  const roofHatchDoor = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.06, 0.84), bodyPaint);
  roofHatchDoor.position.set(0.05, 1.75, 0);
  group.add(roofHatchDoor);

  return {
    group,
    wheels,
    roofHatchDoor,
    brakeLightMat,
    plateHighlightMat,
  };
}
