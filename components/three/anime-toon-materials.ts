import * as THREE from 'three';

export interface AnimeMaterialLibrary {
  gradientMap: THREE.DataTexture;
  inkLineMaterial: THREE.LineBasicMaterial;
  inkOutlineMaterial: THREE.MeshBasicMaterial;
  contactShadowTexture: THREE.CanvasTexture;
  licensePlateTexture: THREE.CanvasTexture;
  truckSideLiveryTexture: THREE.CanvasTexture;
  bankSignTexture: THREE.CanvasTexture;
  garageSignTexture: THREE.CanvasTexture;
  roadSurfaceTexture: THREE.CanvasTexture;
  hazardStripeTexture: THREE.CanvasTexture;
  createToonMaterial: (
    color: number | string,
    opts?: {
      emissive?: number | string;
      emissiveIntensity?: number;
      transparent?: boolean;
      opacity?: number;
      side?: THREE.Side;
      map?: THREE.Texture;
    }
  ) => THREE.MeshToonMaterial;
  dispose: () => void;
}

/**
 * Generates a crisp 4-band Japanese anime cel-shading gradient map.
 */
function createAnimeGradientMap(): THREE.DataTexture {
  const bands = new Uint8Array([78, 148, 212, 255]);
  const tex = new THREE.DataTexture(bands, 4, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 122);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.58)');
  grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.28)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createLicensePlateTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  // White plate with official blue header strip & sumi-e anime border
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 512, 192);
  ctx.fillStyle = '#0284C7';
  ctx.fillRect(10, 10, 492, 46);

  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 182);

  // Header label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OFFICIAL CENTRAL BANK · TRUSTED', 256, 34);

  // Gold verification seal
  ctx.beginPath();
  ctx.arc(58, 120, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#FACC15';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0F172A';
  ctx.stroke();
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 22px sans-serif';
  ctx.fillText('✓', 58, 122);

  // Plate number
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 66px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BANK-01', 284, 122);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createTruckSideLiveryTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Clean cel-shaded off-white bank armor base
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, 1024, 512);

  // Deep royal-blue official armored transport band
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(0, 275, 1024, 118);

  // Vivid Attack Explorer sky-cyan & amber-gold accent stripes
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(0, 255, 1024, 20);
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(0, 393, 1024, 22);

  // Subtle architectural armor panel seam lines
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 1008, 496);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
  for (const x of [240, 512, 784]) {
    ctx.beginPath();
    ctx.moveTo(x, 16);
    ctx.lineTo(x, 496);
    ctx.stroke();
  }

  // Official Bank Shield Emblem on Left
  ctx.save();
  ctx.translate(132, 146);
  ctx.beginPath();
  ctx.moveTo(0, -68);
  ctx.lineTo(56, -42);
  ctx.lineTo(48, 34);
  ctx.lineTo(0, 72);
  ctx.lineTo(-48, 34);
  ctx.lineTo(-56, -42);
  ctx.closePath();
  ctx.fillStyle = '#FACC15';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#0F172A';
  ctx.stroke();

  ctx.fillStyle = '#1E3A8A';
  ctx.font = '900 54px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', 0, 4);
  ctx.restore();

  // Main Bank Typography
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 62px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('CENTRAL BANK', 228, 118);

  ctx.fillStyle = '#0284C7';
  ctx.font = '800 32px "JetBrains Mono", monospace';
  ctx.fillText('ARMORED TRANSPORT · TRUSTED UNIT #01', 230, 182);

  // Lower band stencil
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 34px "JetBrains Mono", monospace';
  ctx.fillText('LICENSE: BANK-01   ·   ID: SVCHOST.EXE', 44, 336);

  // Right verified stamp
  ctx.fillStyle = '#10B981';
  ctx.fillRect(806, 300, 182, 66);
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 4;
  ctx.strokeRect(806, 300, 182, 66);
  ctx.fillStyle = '#052E16';
  ctx.font = '900 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED ✓', 897, 335);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createBankSignTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 1024, 256);

  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, 1000, 232);

  ctx.fillStyle = '#FACC15';
  ctx.font = '900 72px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CENTRAL RESERVE BANK', 512, 102);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 30px "JetBrains Mono", monospace';
  ctx.fillText('HIGH-SECURITY VAULT · AUTHORIZED FLEET ONLY', 512, 184);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createGarageSignTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 1024, 256);

  // Hazard stripe bottom edge
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(0, 210, 1024, 46);
  ctx.fillStyle = '#0F172A';
  for (let x = -40; x < 1080; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 210);
    ctx.lineTo(x + 32, 210);
    ctx.lineTo(x + 6, 256);
    ctx.lineTo(x - 26, 256);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 1004, 194);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 62px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BANK DISPATCH GARAGE', 512, 82);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.fillText('BAY 04 · ARMORED FLEET DISPATCH', 512, 152);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createRoadSurfaceTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Clean stylized Japanese anime urban asphalt
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle asphalt tonal streaks
  ctx.fillStyle = 'rgba(15, 23, 42, 0.14)';
  for (let i = 0; i < 180; i += 1) {
    const x = (i * 197) % 1024;
    const y = (i * 89) % 512;
    ctx.fillRect(x, y, 28 + (i % 45), 3);
  }

  // Crisp outer white shoulder lines
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(0, 26, 1024, 14);
  ctx.fillRect(0, 472, 1024, 14);

  // Amber dashed center divider
  ctx.fillStyle = '#FACC15';
  for (let x = 24; x < 1024; x += 128) {
    ctx.fillRect(x, 248, 72, 16);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(4, 1);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createHazardStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#E11D48';
  for (let x = -32; x < 288; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 32, 0);
    ctx.lineTo(x + 12, 64);
    ctx.lineTo(x - 20, 64);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createAnimeMaterialLibrary(
  renderer: THREE.WebGLRenderer
): AnimeMaterialLibrary {
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const gradientMap = createAnimeGradientMap();
  const contactShadowTexture = createContactShadowTexture();
  const licensePlateTexture = createLicensePlateTexture(maxAniso);
  const truckSideLiveryTexture = createTruckSideLiveryTexture(maxAniso);
  const bankSignTexture = createBankSignTexture(maxAniso);
  const garageSignTexture = createGarageSignTexture(maxAniso);
  const roadSurfaceTexture = createRoadSurfaceTexture(maxAniso);
  const hazardStripeTexture = createHazardStripeTexture(maxAniso);

  const inkLineMaterial = new THREE.LineBasicMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.78,
  });

  const inkOutlineMaterial = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    side: THREE.BackSide,
  });

  const createdMaterials: THREE.Material[] = [
    inkLineMaterial,
    inkOutlineMaterial,
  ];

  const createToonMaterial: AnimeMaterialLibrary['createToonMaterial'] = (
    color,
    opts
  ) => {
    const mat = new THREE.MeshToonMaterial({
      color,
      gradientMap,
      emissive: opts?.emissive ?? 0x000000,
      emissiveIntensity: opts?.emissiveIntensity ?? 0,
      transparent: opts?.transparent ?? false,
      opacity: opts?.opacity ?? 1,
      side: opts?.side ?? THREE.FrontSide,
      map: opts?.map ?? null,
    });
    createdMaterials.push(mat);
    return mat;
  };

  return {
    gradientMap,
    inkLineMaterial,
    inkOutlineMaterial,
    contactShadowTexture,
    licensePlateTexture,
    truckSideLiveryTexture,
    bankSignTexture,
    garageSignTexture,
    roadSurfaceTexture,
    hazardStripeTexture,
    createToonMaterial,
    dispose: () => {
      gradientMap.dispose();
      contactShadowTexture.dispose();
      licensePlateTexture.dispose();
      truckSideLiveryTexture.dispose();
      bankSignTexture.dispose();
      garageSignTexture.dispose();
      roadSurfaceTexture.dispose();
      hazardStripeTexture.dispose();
      for (const m of createdMaterials) {
        m.dispose();
      }
    },
  };
}

/**
 * Adds crisp Japanese anime architectural crease lines to a Mesh.
 */
export function addAnimeInkEdges(
  mesh: THREE.Mesh,
  inkLineMaterial: THREE.LineBasicMaterial,
  thresholdAngle = 28
): THREE.LineSegments {
  const edges = new THREE.EdgesGeometry(mesh.geometry, thresholdAngle);
  const lines = new THREE.LineSegments(edges, inkLineMaterial);
  lines.raycast = () => {};
  mesh.add(lines);
  return lines;
}

/**
 * Adds a classic inverted-hull anime silhouette outline around curved/hero meshes.
 */
export function addInvertedHullOutline(
  mesh: THREE.Mesh,
  outlineMaterial: THREE.MeshBasicMaterial,
  scale = 1.045
): THREE.Mesh {
  const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
  outline.scale.setScalar(scale);
  outline.raycast = () => {};
  mesh.add(outline);
  return outline;
}

/**
 * Custom GLSL Japanese Anime Sky Dome Shader (Makoto Shinkai daylight / Neo-Tokyo twilight night).
 */
export function createAnimeSkyDome(atmosphere?: {
  dayZenith: [number, number, number];
  dayMid: [number, number, number];
  dayHorizon: [number, number, number];
  nightZenith: [number, number, number];
  nightMid: [number, number, number];
  nightHorizon: [number, number, number];
  dayCloudLit: [number, number, number];
  dayCloudShadow: [number, number, number];
  nightCloudLit: [number, number, number];
  nightCloudShadow: [number, number, number];
  sunDir: [number, number, number];
  daySunColor: [number, number, number];
  nightSunColor: [number, number, number];
  starfieldIntensity: number;
}): {
  mesh: THREE.Mesh;
  uniforms: {
    uTime: { value: number };
    uDarkMode: { value: number };
  };
} {
  const dz = atmosphere?.dayZenith ?? [0.16, 0.48, 0.88];
  const dm = atmosphere?.dayMid ?? [0.47, 0.78, 0.98];
  const dh = atmosphere?.dayHorizon ?? [0.99, 0.94, 0.86];
  const nz = atmosphere?.nightZenith ?? [0.03, 0.05, 0.14];
  const nm = atmosphere?.nightMid ?? [0.09, 0.13, 0.29];
  const nh = atmosphere?.nightHorizon ?? [0.22, 0.16, 0.34];
  const dcl = atmosphere?.dayCloudLit ?? [1.0, 0.99, 0.96];
  const dcs = atmosphere?.dayCloudShadow ?? [0.76, 0.85, 0.96];
  const ncl = atmosphere?.nightCloudLit ?? [0.32, 0.28, 0.52];
  const ncs = atmosphere?.nightCloudShadow ?? [0.14, 0.18, 0.34];
  const sdir = atmosphere?.sunDir ?? [0.48, 0.32, -0.82];
  const dsc = atmosphere?.daySunColor ?? [1.0, 0.96, 0.82];
  const nsc = atmosphere?.nightSunColor ?? [0.74, 0.88, 1.0];
  const stars = atmosphere?.starfieldIntensity ?? 0.2;

  const uniforms = {
    uTime: { value: 0 },
    uDarkMode: { value: 0 },
    uDayZenith: { value: new THREE.Vector3(...dz) },
    uDayMid: { value: new THREE.Vector3(...dm) },
    uDayHoriz: { value: new THREE.Vector3(...dh) },
    uNightZenith: { value: new THREE.Vector3(...nz) },
    uNightMid: { value: new THREE.Vector3(...nm) },
    uNightHoriz: { value: new THREE.Vector3(...nh) },
    uDayCloudLit: { value: new THREE.Vector3(...dcl) },
    uDayCloudShadow: { value: new THREE.Vector3(...dcs) },
    uNightCloudLit: { value: new THREE.Vector3(...ncl) },
    uNightCloudShadow: { value: new THREE.Vector3(...ncs) },
    uSunDir: { value: new THREE.Vector3(...sdir).normalize() },
    uDaySunCol: { value: new THREE.Vector3(...dsc) },
    uNightSunCol: { value: new THREE.Vector3(...nsc) },
    uStarIntensity: { value: stars },
  };

  const geo = new THREE.SphereGeometry(115, 32, 20);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldDir;
      uniform float uTime;
      uniform float uDarkMode;
      uniform vec3 uDayZenith;
      uniform vec3 uDayMid;
      uniform vec3 uDayHoriz;
      uniform vec3 uNightZenith;
      uniform vec3 uNightMid;
      uniform vec3 uNightHoriz;
      uniform vec3 uDayCloudLit;
      uniform vec3 uDayCloudShadow;
      uniform vec3 uNightCloudLit;
      uniform vec3 uNightCloudShadow;
      uniform vec3 uSunDir;
      uniform vec3 uDaySunCol;
      uniform vec3 uNightSunCol;
      uniform float uStarIntensity;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.05;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 dir = normalize(vWorldDir);
        float h = clamp(dir.y, -0.2, 1.0);

        vec3 daySky = mix(uDayHoriz, uDayMid, smoothstep(-0.02, 0.28, h));
        daySky = mix(daySky, uDayZenith, smoothstep(0.25, 0.85, h));

        vec3 nightSky = mix(uNightHoriz, uNightMid, smoothstep(-0.02, 0.3, h));
        nightSky = mix(nightSky, uNightZenith, smoothstep(0.28, 0.85, h));

        vec3 sky = mix(daySky, nightSky, uDarkMode);

        // Crisp procedural anime starfield for orbital / midnight / twilight atmospheres
        if (dir.y > 0.06 && uStarIntensity > 0.05) {
          vec2 starUv = floor(dir.xz / (dir.y + 0.35) * 48.0);
          float s = hash(starUv);
          float starDot = smoothstep(0.992, 0.999, s);
          float twinkle = 0.65 + 0.35 * sin(uTime * 2.4 + s * 62.8);
          float starVis = mix(uStarIntensity * 0.45, uStarIntensity, uDarkMode) * smoothstep(0.08, 0.35, dir.y);
          sky += vec3(0.92, 0.96, 1.0) * starDot * twinkle * starVis;
        }

        // Stylized cel-stepped anime cumulus clouds
        if (dir.y > 0.02) {
          vec2 cloudUv = dir.xz / (dir.y + 0.24) * 1.45 + vec2(uTime * 0.015, 0.0);
          float c = fbm(cloudUv);
          float cloudBand1 = smoothstep(0.52, 0.56, c);
          float cloudBand2 = smoothstep(0.64, 0.68, c);
          float horizonFade = smoothstep(0.02, 0.18, dir.y) * (1.0 - smoothstep(0.55, 0.92, dir.y));

          vec3 cCol = mix(
            mix(uDayCloudShadow, uNightCloudShadow, uDarkMode),
            mix(uDayCloudLit, uNightCloudLit, uDarkMode),
            cloudBand2
          );
          sky = mix(sky, cCol, cloudBand1 * horizonFade * 0.78);
        }

        // Stylized anime sun / moon disc
        float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
        float sunDisc = smoothstep(0.9965, 0.9982, sunDot);
        float sunHalo = pow(sunDot, 16.0) * 0.36;
        vec3 sunCol = mix(uDaySunCol, uNightSunCol, uDarkMode);
        sky += sunCol * (sunHalo + sunDisc * 0.92);

        gl_FragColor = vec4(sky, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -10;
  return { mesh, uniforms };
}

/**
 * Custom GLSL Hexagonal Anime Cryo Time-Freeze Stasis Dome Shader (Act 2-4).
 */
export function createStasisDomeMaterial(): {
  material: THREE.ShaderMaterial;
  uniforms: {
    uTime: { value: number };
    uOpacity: { value: number };
  };
} {
  const uniforms = {
    uTime: { value: 0 },
    uOpacity: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      uniform float uTime;
      uniform float uOpacity;

      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 3.2);
        float scan = smoothstep(0.84, 0.98, sin(vUv.y * 42.0 - uTime * 3.8) * 0.5 + 0.5);
        float gridX = smoothstep(0.92, 0.98, abs(sin(vUv.x * 38.0)));
        float gridY = smoothstep(0.92, 0.98, abs(sin(vUv.y * 19.0)));
        float grid = max(gridX, gridY) * 0.32;

        vec3 baseCyan = vec3(0.06, 0.72, 1.05);
        vec3 rimCyan = vec3(0.28, 1.08, 1.38);
        vec3 col = mix(baseCyan, rimCyan, fresnel * 0.85 + scan * 0.35);

        float alpha = (0.025 + fresnel * 0.46 + grid * 0.18 + scan * 0.14) * uOpacity;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.52));
      }
    `,
  });

  return { material, uniforms };
}

/**
 * Custom GLSL Volumetric Security Camera Scan Cone Shader (Act 6).
 */
export function createScanConeMaterial(): {
  material: THREE.ShaderMaterial;
  uniforms: {
    uTime: { value: number };
    uTrustedLock: { value: number };
  };
} {
  const uniforms = {
    uTime: { value: 0 },
    uTrustedLock: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      uniform float uTime;
      uniform float uTrustedLock;

      void main() {
        float edge = pow(abs(dot(normalize(vNormal), normalize(vViewDir))), 0.85);
        float pulse = smoothstep(0.78, 0.98, sin(vUv.y * 28.0 + uTime * 5.0) * 0.5 + 0.5);
        float verticalFade = smoothstep(0.0, 0.16, vUv.y) * (1.0 - smoothstep(0.68, 1.0, vUv.y));

        vec3 idleCyan = vec3(0.18, 0.78, 1.15);
        vec3 trustedEmerald = vec3(0.08, 1.18, 0.62);
        vec3 col = mix(idleCyan, trustedEmerald, uTrustedLock);

        float alpha = (0.12 + pulse * 0.14 + uTrustedLock * 0.14) * edge * verticalFade;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
      }
    `,
  });

  return { material, uniforms };
}
