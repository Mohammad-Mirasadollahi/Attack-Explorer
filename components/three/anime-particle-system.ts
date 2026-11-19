import * as THREE from 'three';

export interface AnimeParticleUpdateParams {
  elapsed: number;
  truckX: number;
  glitchIntensity: number;
  magicDustIntensity: number;
  primaryHex: string;
  secondaryHex: string;
  stasisIntensity: number;
  brakeReleaseBoost: number;
}

export interface AnimeMagicGlitchParticleSystem {
  root: THREE.Group;
  totalParticleCount: number;
  setPixelRatio: (dpr: number) => void;
  update: (params: AnimeParticleUpdateParams) => void;
  dispose: () => void;
}

// Pre-allocated scratch helpers outside the render loop (zero per-frame GC)
const _dummy = new THREE.Object3D();
const _primaryColor = new THREE.Color();
const _secondaryColor = new THREE.Color();
const _instanceColor = new THREE.Color();

/**
 * Deterministic pseudo-random generator (Mulberry32) so particle fields
 * are reproducible across renders and visual tests.
 */
function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a dual-layer Three.js Anime Magic Dust & Digital Glitch particle aura
 * surrounding the armored bank truck:
 *  - Layer A: 260 GPU-driven shader sprites rendering 4-point anime star sparkles
 *    and sharp digital glitch pixel bursts with HDR intensity for UnrealBloomPass.
 *  - Layer B: 42 instanced 3D holographic glitch bars/voxels orbiting the cargo
 *    hull that snap with quantized glitch jitter during hollowing & injection.
 */
export function buildAnimeMagicGlitchParticles(
  initialPixelRatio: number
): AnimeMagicGlitchParticleSystem {
  const root = new THREE.Group();
  const rand = createSeededRandom(1055012);

  // --- LAYER A: 260 GPU Anime Magic Dust & Digital Glitch Sparkles (THREE.Points) ---
  const dustCount = 260;
  const positions = new Float32Array(dustCount * 3);
  const scales = new Float32Array(dustCount);
  const phases = new Float32Array(dustCount);
  const speeds = new Float32Array(dustCount);
  const glitchMasks = new Float32Array(dustCount);
  const colorMixes = new Float32Array(dustCount);

  for (let i = 0; i < dustCount; i += 1) {
    const angle = rand() * Math.PI * 2;
    const radiusX = 3.15 + rand() * 3.35;
    const radiusZ = 2.05 + rand() * 2.45;
    const height = 0.35 + rand() * 4.25;

    positions[i * 3] = Math.cos(angle) * radiusX;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radiusZ;

    scales[i] = 0.58 + rand() * 1.15;
    phases[i] = rand() * Math.PI * 2;
    speeds[i] = 0.45 + rand() * 1.05;
    // ~42% of sprites morph into crisp digital glitch pixels when glitchIntensity rises
    glitchMasks[i] = rand() > 0.58 ? 1.0 : 0.0;
    colorMixes[i] = rand();
  }

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  dustGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  dustGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  dustGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  dustGeometry.setAttribute(
    'aGlitchMask',
    new THREE.BufferAttribute(glitchMasks, 1)
  );
  dustGeometry.setAttribute(
    'aColorMix',
    new THREE.BufferAttribute(colorMixes, 1)
  );

  const dustUniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(2, Math.max(1, initialPixelRatio)) },
    uGlitchIntensity: { value: 0.25 },
    uDustIntensity: { value: 0.75 },
    uStasis: { value: 0 },
    uBrakeBoost: { value: 0 },
    uPrimaryColor: { value: new THREE.Color('#38BDF8') },
    uSecondaryColor: { value: new THREE.Color('#FACC15') },
  };

  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: dustUniforms,
    vertexShader: `
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uGlitchIntensity;
      uniform float uDustIntensity;
      uniform float uStasis;
      uniform float uBrakeBoost;

      attribute float aScale;
      attribute float aPhase;
      attribute float aSpeed;
      attribute float aGlitchMask;
      attribute float aColorMix;

      varying float vPhase;
      varying float vGlitch;
      varying float vColorMix;
      varying float vTwinkle;

      float hash11(float p) {
        return fract(sin(p * 127.1) * 43758.5453123);
      }

      void main() {
        vec3 pos = position;

        // Swirling anime magic-dust orbital lift around the armored truck
        float orbitRate = mix(0.32, 0.08, uStasis) * aSpeed;
        float theta = uTime * orbitRate + aPhase * 0.25;
        float cs = cos(theta);
        float sn = sin(theta);
        pos.xz = mat2(cs, -sn, sn, cs) * pos.xz;

        // Buoyant upward magic dust drift wrapping cleanly between y = 0.35 .. 4.75
        float riseSpeed = mix(0.42, 0.09, uStasis) * aSpeed;
        pos.y = mod(pos.y + uTime * riseSpeed, 4.4) + 0.35;

        // Kinetic slipstream stretch backward when brake releases in Act 5
        pos.x -= uBrakeBoost * (0.8 + fract(aPhase) * 2.2);

        // Quantized digital glitch horizontal tear during memory unmap & payload injection
        float glitchStep = floor(uTime * 11.0 + aPhase * 3.0);
        float glitchTrigger = step(0.68, hash11(glitchStep + aPhase * 17.0));
        float glitchAmt = aGlitchMask * uGlitchIntensity * glitchTrigger;
        pos.x += (hash11(glitchStep * 2.3 + aPhase) - 0.5) * 1.15 * glitchAmt;
        pos.y += (hash11(glitchStep * 3.7 + aPhase) - 0.5) * 0.38 * glitchAmt;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float twinkle = 0.55 + 0.45 * sin(uTime * (3.2 * aSpeed) + aPhase * 4.0);
        float baseSize = mix(11.5, 18.5, uDustIntensity) * aScale * (0.76 + 0.34 * twinkle);
        baseSize *= (1.0 + glitchAmt * 0.38);
        gl_PointSize = clamp(baseSize * uPixelRatio * (10.5 / max(2.0, -mvPosition.z)), 3.0, 27.0);

        vPhase = aPhase;
        vGlitch = aGlitchMask * uGlitchIntensity;
        vColorMix = aColorMix;
        vTwinkle = twinkle;
      }
    `,
    fragmentShader: `
      uniform vec3 uPrimaryColor;
      uniform vec3 uSecondaryColor;
      uniform float uDustIntensity;

      varying float vPhase;
      varying float vGlitch;
      varying float vColorMix;
      varying float vTwinkle;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        vec2 a = abs(uv);

        // Crisp 4-point Japanese anime cel-shaded star sparkle
        float diamond = 1.0 - smoothstep(0.05, 0.28, a.x + a.y);
        float crossH = (1.0 - smoothstep(0.012, 0.052, a.y)) * (1.0 - smoothstep(0.0, 0.46, a.x));
        float crossV = (1.0 - smoothstep(0.012, 0.052, a.x)) * (1.0 - smoothstep(0.0, 0.46, a.y));
        float starShape = clamp(diamond * 0.92 + max(crossH, crossV) * 0.88, 0.0, 1.0);

        // Sharp digital glitch pixel rectangle / scan-bar shape
        float glitchBox = step(a.x, 0.40) * step(a.y, 0.16);
        float glitchScan = step(0.35, fract(gl_PointCoord.y * 5.0 + vPhase));
        float glitchShape = glitchBox * (0.55 + 0.45 * glitchScan);

        float shape = mix(starShape, glitchShape, clamp(vGlitch * 1.15, 0.0, 1.0));
        if (shape < 0.05) discard;

        // Saturated HDR anime color (> 1.0 triggers selective UnrealBloomPass halo without white-out)
        vec3 baseCol = mix(uPrimaryColor, uSecondaryColor, vColorMix);
        vec3 coreTint = mix(baseCol, vec3(1.0, 1.0, 1.0), 0.48);
        vec3 hdrCol = mix(baseCol * 1.38, coreTint * 1.58, pow(shape, 2.8) * 0.55);

        float alpha = shape * (0.42 + 0.46 * vTwinkle) * clamp(uDustIntensity * 0.8 + 0.18, 0.26, 0.84);
        gl_FragColor = vec4(hdrCol, clamp(alpha, 0.0, 0.86));
      }
    `,
  });

  const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
  dustPoints.frustumCulled = false;
  dustPoints.renderOrder = 6;
  root.add(dustPoints);

  // --- LAYER B: 42 Instanced 3D Digital Glitch Shards / Pixel Bars ---
  const shardCount = 42;
  const shardGeo = new THREE.BoxGeometry(0.38, 0.048, 0.048);
  const shardMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false, // Keep pure saturated HDR glow for UnrealBloomPass
  });

  const glitchMesh = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
  glitchMesh.frustumCulled = false;
  glitchMesh.renderOrder = 7;

  interface GlitchShardSeed {
    angle: number;
    radiusX: number;
    radiusZ: number;
    baseY: number;
    speed: number;
    scaleX: number;
    scaleY: number;
    phase: number;
    useSecondary: boolean;
  }

  const shardSeeds: GlitchShardSeed[] = [];
  for (let i = 0; i < shardCount; i += 1) {
    shardSeeds.push({
      angle: rand() * Math.PI * 2,
      radiusX: 2.95 + rand() * 2.4,
      radiusZ: 1.95 + rand() * 1.65,
      baseY: 0.55 + rand() * 3.15,
      speed: 0.55 + rand() * 1.2,
      scaleX: 0.45 + rand() * 1.55,
      scaleY: 0.65 + rand() * 1.15,
      phase: rand() * Math.PI * 2,
      useSecondary: rand() > 0.48,
    });
  }
  root.add(glitchMesh);

  return {
    root,
    totalParticleCount: dustCount + shardCount,
    setPixelRatio: (dpr: number) => {
      dustUniforms.uPixelRatio.value = Math.min(2, Math.max(1, dpr));
    },
    update: (params: AnimeParticleUpdateParams) => {
      const {
        elapsed,
        truckX,
        glitchIntensity,
        magicDustIntensity,
        primaryHex,
        secondaryHex,
        stasisIntensity,
        brakeReleaseBoost,
      } = params;

      root.position.set(truckX, 0, 0);

      _primaryColor.set(primaryHex);
      _secondaryColor.set(secondaryHex);

      // Update Layer A shader uniforms
      dustUniforms.uTime.value = elapsed;
      dustUniforms.uGlitchIntensity.value = glitchIntensity;
      dustUniforms.uDustIntensity.value = magicDustIntensity;
      dustUniforms.uStasis.value = stasisIntensity;
      dustUniforms.uBrakeBoost.value = brakeReleaseBoost;
      dustUniforms.uPrimaryColor.value.copy(_primaryColor);
      dustUniforms.uSecondaryColor.value.copy(_secondaryColor);

      // Update Layer B 3D digital glitch shards
      const visibleStrength = Math.max(
        glitchIntensity,
        magicDustIntensity * 0.3
      );
      shardMat.opacity = 0.22 + visibleStrength * 0.56;

      const quantTick = Math.floor(elapsed * 10);

      for (let i = 0; i < shardCount; i += 1) {
        const s = shardSeeds[i];
        const a = s.angle + elapsed * (0.28 * s.speed) * (1 - stasisIntensity * 0.65);

        // Quantized glitch jump pulse (strongest during hollowing & covert crew injection)
        const pulse = Math.sin(quantTick * 1.7 + s.phase * 5.0);
        const glitchSnap =
          glitchIntensity > 0.15 && pulse > 0.45 ? glitchIntensity : 0;

        const gx =
          Math.cos(a) * s.radiusX +
          glitchSnap * Math.sin(s.phase * 13 + quantTick) * 0.68 -
          brakeReleaseBoost * 1.3;
        const gy =
          s.baseY +
          Math.sin(elapsed * 1.9 * s.speed + s.phase) * 0.3 +
          glitchSnap * 0.2;
        const gz = Math.sin(a) * s.radiusZ;

        // Flicker visibility subtly on high glitch so it feels like digital packet tears
        const showScale =
          visibleStrength < 0.08 || (glitchIntensity > 0.5 && pulse < -0.68)
            ? 0.0001
            : 0.4 + visibleStrength * 0.72;

        _dummy.position.set(gx, gy, gz);
        _dummy.rotation.set(
          0,
          s.phase * 0.3 + glitchSnap * 0.25,
          glitchSnap > 0 ? 0 : Math.sin(elapsed + s.phase) * 0.16
        );
        _dummy.scale.set(
          s.scaleX * showScale * (1 + glitchSnap * 0.8 + brakeReleaseBoost * 1.35),
          s.scaleY * showScale,
          showScale
        );
        _dummy.updateMatrix();
        glitchMesh.setMatrixAt(i, _dummy.matrix);

        // Saturated HDR per-instance color so Bloom illuminates glitch bars cleanly without white-out
        _instanceColor
          .copy(s.useSecondary ? _secondaryColor : _primaryColor)
          .multiplyScalar(1.25 + glitchSnap * 0.35);
        glitchMesh.setColorAt(i, _instanceColor);
      }

      glitchMesh.instanceMatrix.needsUpdate = true;
      if (glitchMesh.instanceColor) {
        glitchMesh.instanceColor.needsUpdate = true;
      }
    },
    dispose: () => {
      dustGeometry.dispose();
      dustMaterial.dispose();
      shardGeo.dispose();
      shardMat.dispose();
    },
  };
}
