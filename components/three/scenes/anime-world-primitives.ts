import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';

export type { BespokeSection3DScene };

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutQuad(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function resolveCutawayFactor(
  cutawayMode: StandardCutawayMode,
  autoFactor: number
): number {
  if (cutawayMode === 'OPEN') return 1;
  if (cutawayMode === 'SEALED') return 0;
  return clamp01(autoFactor);
}

/**
 * Creates a crisp high-contrast procedural English signboard texture (zero Japanese chars).
 */
export function createSignboardTexture(
  title: string,
  subtitle: string,
  opts: {
    bgHex?: string;
    borderHex?: string;
    titleHex?: string;
    subHex?: string;
    badgeText?: string;
    badgeBg?: string;
  } = {}
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  const bgHex = opts.bgHex ?? '#0F172A';
  const borderHex = opts.borderHex ?? '#38BDF8';
  const titleHex = opts.titleHex ?? '#F8FAFC';
  const subHex = opts.subHex ?? '#7DD3FC';

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 768, 192);

  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 748, 172);

  // Subtle corner accent ticks
  ctx.fillStyle = borderHex;
  ctx.fillRect(10, 10, 32, 10);
  ctx.fillRect(726, 172, 32, 10);

  if (opts.badgeText) {
    ctx.fillStyle = opts.badgeBg ?? borderHex;
    ctx.fillRect(28, 24, 180, 34);
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.badgeText, 118, 41, 168);
  }

  const titleFontPx =
    title.length > 36 ? 26 : title.length > 28 ? 31 : 36;
  const subFontPx = subtitle.length > 44 ? 17 : 20;

  ctx.fillStyle = titleHex;
  ctx.font = `900 ${titleFontPx}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 384, opts.badgeText ? 92 : 76, 684);

  ctx.fillStyle = subHex;
  ctx.font = `700 ${subFontPx}px "JetBrains Mono", monospace`;
  ctx.fillText(subtitle, 384, opts.badgeText ? 146 : 138, 684);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates a rear-mounted overhead signboard with zero foreground pillars.
 */
export function buildOverheadSignboard(
  materials: AnimeMaterialLibrary,
  extraTextures: THREE.Texture[],
  title: string,
  subtitle: string,
  opts: {
    width?: number;
    height?: number;
    position?: [number, number, number];
    bgHex?: string;
    borderHex?: string;
    titleHex?: string;
    subHex?: string;
    badgeText?: string;
    withRearStruts?: boolean;
  } = {}
): THREE.Group {
  const g = new THREE.Group();
  const w = opts.width ?? 6.4;
  const h = opts.height ?? 1.55;
  const tex = createSignboardTexture(title, subtitle, opts);
  extraTextures.push(tex);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.24, h + 0.22, 0.24),
    materials.createToonMaterial(0x0f172a)
  );
  addAnimeInkEdges(frame, materials.inkLineMaterial, 22);
  g.add(frame);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  face.position.z = 0.13;
  g.add(face);

  if (opts.withRearStruts) {
    const strutMat = materials.createToonMaterial(0x334155);
    for (const sx of [-w * 0.34, w * 0.34]) {
      const strut = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 4.8, 0.18),
        strutMat
      );
      strut.position.set(sx, -2.5, -0.22);
      addAnimeInkEdges(strut, materials.inkLineMaterial, 25);
      g.add(strut);
    }
  }

  if (opts.position) {
    g.position.set(...opts.position);
  }
  return g;
}

export type StageFloorArchetype =
  | 'circular-tech'
  | 'workshop-tile'
  | 'split-dual'
  | 'two-level-cutaway'
  | 'conveyor-deck'
  | 'pier-dock';

/**
 * Six distinct architectural stage bases so scenarios feel spatially unique.
 */
export function buildStageFloor(
  materials: AnimeMaterialLibrary,
  archetype: StageFloorArchetype,
  accentHex: number,
  secondaryHex = 0x334155
): THREE.Group {
  const group = new THREE.Group();

  if (archetype === 'circular-tech') {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(13.5, 14.2, 0.4, 36),
      materials.createToonMaterial(0x1e293b)
    );
    base.position.y = -0.2;
    base.receiveShadow = true;
    addAnimeInkEdges(base, materials.inkLineMaterial, 26);
    group.add(base);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(13.3, 0.08, 8, 48),
      new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.03;
    group.add(rim);

    const grid = new THREE.GridHelper(20, 16, accentHex, secondaryHex);
    grid.position.y = 0.02;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.28;
    group.add(grid);
  } else if (archetype === 'workshop-tile') {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(34, 0.44, 18),
      materials.createToonMaterial(0x1e293b)
    );
    slab.position.y = -0.22;
    slab.receiveShadow = true;
    addAnimeInkEdges(slab, materials.inkLineMaterial, 22);
    group.add(slab);

    // Subtle inlaid workshop floor strips
    const stripMat = materials.createToonMaterial(0x334155);
    for (let x = -12; x <= 12; x += 4) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.02, 17.2),
        stripMat
      );
      strip.position.set(x, 0.02, 0);
      group.add(strip);
    }

    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(34.2, 0.1, 0.16),
      new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
    );
    trim.position.set(0, 0.04, 8.9);
    group.add(trim);
  } else if (archetype === 'split-dual') {
    // Left clean deck vs Right compromised deck
    const leftDeck = new THREE.Mesh(
      new THREE.BoxGeometry(9.2, 0.44, 12.6),
      materials.createToonMaterial(0x172554)
    );
    leftDeck.position.set(-5.0, -0.22, 0);
    leftDeck.receiveShadow = true;
    addAnimeInkEdges(leftDeck, materials.inkLineMaterial, 22);
    group.add(leftDeck);

    const rightDeck = new THREE.Mesh(
      new THREE.BoxGeometry(9.2, 0.44, 12.6),
      materials.createToonMaterial(0x271324)
    );
    rightDeck.position.set(5.0, -0.22, 0);
    rightDeck.receiveShadow = true;
    addAnimeInkEdges(rightDeck, materials.inkLineMaterial, 22);
    group.add(rightDeck);

    const divider = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.14, 12.6),
      new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
    );
    divider.position.set(0, 0.05, 0);
    group.add(divider);
  } else if (archetype === 'two-level-cutaway') {
    // Lower Kernel Vault floor + Upper User-Mode Mezzanine (rear-supported!)
    const lowerFloor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.44, 13),
      materials.createToonMaterial(0x0f172a)
    );
    lowerFloor.position.y = -0.22;
    lowerFloor.receiveShadow = true;
    addAnimeInkEdges(lowerFloor, materials.inkLineMaterial, 22);
    group.add(lowerFloor);

    const lowerGlow = new THREE.Mesh(
      new THREE.BoxGeometry(19.6, 0.06, 0.14),
      new THREE.MeshBasicMaterial({ color: secondaryHex, toneMapped: false })
    );
    lowerGlow.position.set(0, 0.03, 6.4);
    group.add(lowerGlow);

    // Upper mezzanine cantilevered strictly from rear wall (zero foreground pillars)
    const upperDeck = new THREE.Mesh(
      new THREE.BoxGeometry(18.5, 0.28, 6.2),
      materials.createToonMaterial(0x1e293b)
    );
    upperDeck.position.set(0, 3.1, -2.6);
    upperDeck.receiveShadow = true;
    addAnimeInkEdges(upperDeck, materials.inkLineMaterial, 22);
    group.add(upperDeck);

    const upperEdge = new THREE.Mesh(
      new THREE.BoxGeometry(18.5, 0.09, 0.12),
      new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
    );
    upperEdge.position.set(0, 3.24, 0.5);
    group.add(upperEdge);
  } else if (archetype === 'conveyor-deck') {
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(34, 0.42, 17),
      materials.createToonMaterial(0x1e293b)
    );
    deck.position.y = -0.21;
    deck.receiveShadow = true;
    addAnimeInkEdges(deck, materials.inkLineMaterial, 22);
    group.add(deck);

    // Elevated industrial conveyor track running left-to-right
    const beltFrame = new THREE.Mesh(
      new THREE.BoxGeometry(18.2, 0.56, 2.7),
      materials.createToonMaterial(0x334155)
    );
    beltFrame.position.set(0, 0.34, 0.2);
    addAnimeInkEdges(beltFrame, materials.inkLineMaterial, 22);
    group.add(beltFrame);

    const beltTop = new THREE.Mesh(
      new THREE.BoxGeometry(17.9, 0.08, 2.2),
      materials.createToonMaterial(0x0f172a)
    );
    beltTop.position.set(0, 0.65, 0.2);
    group.add(beltTop);

    const guideBarMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      toneMapped: false,
    });
    for (const gz of [-1.05, 1.45]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.08, 0.08), guideBarMat);
      rail.position.set(0, 0.7, gz);
      group.add(rail);
    }
  } else {
    // pier-dock: concrete harbor pier + stylized water border
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(26, 0.2, 16),
      materials.createToonMaterial(0x0c4a6e)
    );
    water.position.y = -0.35;
    group.add(water);

    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(19.6, 0.55, 11.4),
      materials.createToonMaterial(0x334155)
    );
    pier.position.set(0, -0.08, -0.4);
    pier.receiveShadow = true;
    addAnimeInkEdges(pier, materials.inkLineMaterial, 22);
    group.add(pier);

    const hazardTrim = new THREE.Mesh(
      new THREE.BoxGeometry(19.6, 0.12, 0.38),
      materials.createToonMaterial(0xfacc15, { map: materials.hazardStripeTexture })
    );
    hazardTrim.position.set(0, 0.22, 5.12);
    group.add(hazardTrim);
  }

  return group;
}

/**
 * Rear architectural backdrop frame placed strictly at z <= -4.2 (never obstructs camera).
 * Uses a low waist dado + side framing piers + top transom beam so each scenario's
 * bespoke anime sky dome, clouds, sun/moon, and starfield shine cleanly behind the props.
 */
export function buildRearBackdropWall(
  materials: AnimeMaterialLibrary,
  opts: {
    width?: number;
    height?: number;
    z?: number;
    wallHex?: number;
    accentHex?: number;
  } = {}
): THREE.Group {
  const g = new THREE.Group();
  g.name = 'generic-rear-backdrop-wall';
  const w = Math.max(opts.width ?? 30, 26);
  const h = Math.min(Math.max(opts.height ?? 6.4, 5.6), 7.2);
  const z = opts.z ?? -4.6;
  const accent = opts.accentHex ?? 0x38bdf8;
  const wallMat = materials.createToonMaterial(opts.wallHex ?? 0x1e293b);
  const ribMat = materials.createToonMaterial(0x0f172a);

  // Lower solid dado wall (height 2.1) grounding the scene without blocking the sky
  const lowerWall = new THREE.Mesh(new THREE.BoxGeometry(w, 2.1, 0.44), wallMat);
  lowerWall.position.set(0, 1.05, z);
  addAnimeInkEdges(lowerWall, materials.inkLineMaterial, 24);
  g.add(lowerWall);

  // Side architectural wing piers framing the wide panoramic sky window
  const wingW = Math.max(3.6, (w - 17.6) * 0.5);
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(wingW, h - 2.1, 0.44),
      wallMat
    );
    wing.position.set(side * (8.8 + wingW * 0.5), 2.1 + (h - 2.1) * 0.5, z);
    addAnimeInkEdges(wing, materials.inkLineMaterial, 24);
    g.add(wing);
  }

  // Slender architectural mullions inside the open sky window
  for (const rx of [-8.8, -4.4, 4.4, 8.8]) {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, h - 0.2, 0.24),
      ribMat
    );
    rib.position.set(rx, h * 0.5, z + 0.14);
    addAnimeInkEdges(rib, materials.inkLineMaterial, 24);
    g.add(rib);
  }

  // Subtle translucent panoramic window tint strip
  const glassStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(17.6, h - 2.35),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.055,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  glassStrip.position.set(0, 2.15 + (h - 2.35) * 0.5, z);
  g.add(glassStrip);

  // Lower dado rail + top luminous cornice lintel
  const dado = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.2, 0.16, 0.54),
    materials.createToonMaterial(0x334155)
  );
  dado.position.set(0, 2.12, z + 0.04);
  addAnimeInkEdges(dado, materials.inkLineMaterial, 24);
  g.add(dado);

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.1, 0.26, 0.52),
    ribMat
  );
  lintel.position.set(0, h - 0.12, z);
  addAnimeInkEdges(lintel, materials.inkLineMaterial, 24);
  g.add(lintel);

  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.14, 0.12, 0.56),
    new THREE.MeshBasicMaterial({
      color: accent,
      toneMapped: false,
    })
  );
  trim.position.set(0, h + 0.05, z);
  g.add(trim);

  return g;
}

/**
 * Cel-shaded anime humanoid character (clerk, guard, smuggler, detective, operator).
 */
export function buildAnimeCharacter(
  materials: AnimeMaterialLibrary,
  opts: {
    coatHex: number;
    accentHex: number;
    hatType?: 'cap' | 'visor' | 'hood' | 'none';
    scale?: number;
  }
): {
  group: THREE.Group;
  rightArmPivot: THREE.Group;
  leftArmPivot: THREE.Group;
  head: THREE.Mesh;
} {
  const g = new THREE.Group();
  const coatMat = materials.createToonMaterial(opts.coatHex);
  const darkMat = materials.createToonMaterial(0x0f172a);
  const skinMat = materials.createToonMaterial(0xfde68a);
  const accentMat = materials.createToonMaterial(opts.accentHex, {
    emissive: opts.accentHex,
    emissiveIntensity: 0.75,
  });

  const legGeo = new THREE.CapsuleGeometry(0.11, 0.46, 6, 10);
  for (const lx of [-0.15, 0.15]) {
    const leg = new THREE.Mesh(legGeo, darkMat);
    leg.position.set(lx, 0.35, 0);
    addInvertedHullOutline(leg, materials.inkOutlineMaterial, 1.07);
    g.add(leg);
  }

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.82, 0.36), coatMat);
  torso.position.set(0, 1.05, 0);
  torso.castShadow = true;
  addAnimeInkEdges(torso, materials.inkLineMaterial, 22);
  g.add(torso);

  const badge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.05, 6),
    accentMat
  );
  badge.rotation.x = Math.PI / 2;
  badge.position.set(0.16, 1.18, 0.2);
  g.add(badge);

  const armGeo = new THREE.CapsuleGeometry(0.095, 0.44, 6, 10);
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.42, 1.32, 0);
  const leftArm = new THREE.Mesh(armGeo, coatMat);
  leftArm.position.set(0, -0.26, 0);
  addInvertedHullOutline(leftArm, materials.inkOutlineMaterial, 1.08);
  leftArmPivot.add(leftArm);
  g.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.42, 1.32, 0);
  const rightArm = new THREE.Mesh(armGeo, coatMat);
  rightArm.position.set(0, -0.26, 0);
  addInvertedHullOutline(rightArm, materials.inkOutlineMaterial, 1.08);
  rightArmPivot.add(rightArm);
  g.add(rightArmPivot);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 12), skinMat);
  head.position.set(0, 1.74, 0);
  addInvertedHullOutline(head, materials.inkOutlineMaterial, 1.07);
  g.add(head);

  if (opts.hatType === 'cap') {
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.26, 0.15, 14),
      coatMat
    );
    crown.position.set(0, 1.98, 0);
    addAnimeInkEdges(crown, materials.inkLineMaterial, 24);
    g.add(crown);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.26), darkMat);
    brim.position.set(0, 1.91, 0.16);
    g.add(brim);
  } else if (opts.hatType === 'visor') {
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.14), accentMat);
    visor.position.set(0, 1.78, 0.22);
    g.add(visor);
  } else if (opts.hatType === 'hood') {
    const hood = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.65),
      darkMat
    );
    hood.position.set(0, 1.78, -0.02);
    addInvertedHullOutline(hood, materials.inkOutlineMaterial, 1.05);
    g.add(hood);
  }

  if (opts.scale) {
    g.scale.setScalar(opts.scale);
  }
  return { group: g, rightArmPivot, leftArmPivot, head };
}

/**
 * Composite 3D Padlock prop (body + curved steel shackle + keyhole emblem).
 */
export function buildPadlockProp(
  materials: AnimeMaterialLibrary,
  bodyHex: number,
  shackleHex = 0xe2e8f0
): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.56, 0.26),
    materials.createToonMaterial(bodyHex, {
      emissive: bodyHex,
      emissiveIntensity: 0.45,
    })
  );
  body.position.y = 0.28;
  addAnimeInkEdges(body, materials.inkLineMaterial, 22);
  g.add(body);

  const shackle = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.06, 8, 18, Math.PI),
    materials.createToonMaterial(shackleHex)
  );
  shackle.position.y = 0.54;
  addInvertedHullOutline(shackle, materials.inkOutlineMaterial, 1.08);
  g.add(shackle);

  const keyhole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10),
    materials.createToonMaterial(0x0f172a)
  );
  keyhole.rotation.x = Math.PI / 2;
  keyhole.position.set(0, 0.28, 0.14);
  g.add(keyhole);

  return g;
}

/**
 * Composite 3D Filing Cabinet with animated drawer & top status lamp.
 */
export function buildFilingCabinet(
  materials: AnimeMaterialLibrary,
  baseHex = 0x64748b,
  lampHex = 0x38bdf8
): {
  group: THREE.Group;
  lampMat: THREE.MeshToonMaterial;
  padlock: THREE.Group;
} {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 2.05, 1.05),
    materials.createToonMaterial(baseHex)
  );
  body.position.y = 1.025;
  body.castShadow = true;
  addAnimeInkEdges(body, materials.inkLineMaterial, 22);
  g.add(body);

  const handleMat = materials.createToonMaterial(0xe2e8f0);
  for (const dy of [0.42, 1.02, 1.62]) {
    const face = new THREE.Mesh(
      new THREE.BoxGeometry(1.02, 0.48, 0.06),
      materials.createToonMaterial(0x94a3b8)
    );
    face.position.set(0, dy, 0.53);
    addAnimeInkEdges(face, materials.inkLineMaterial, 24);
    g.add(face);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.08), handleMat);
    handle.position.set(0, dy + 0.06, 0.58);
    g.add(handle);
  }

  const lampMat = materials.createToonMaterial(lampHex, {
    emissive: lampHex,
    emissiveIntensity: 0.7,
  });
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.12, 0.18), lampMat);
  lamp.position.set(0, 2.12, 0.36);
  g.add(lamp);

  const padlock = buildPadlockProp(materials, 0xf43f5e);
  padlock.scale.setScalar(0.68);
  padlock.position.set(0, 1.05, 0.66);
  padlock.visible = false;
  g.add(padlock);

  return { group: g, lampMat, padlock };
}

/**
 * Composite 3D Golden/Crimson Key Token.
 */
export function buildKeyToken(
  materials: AnimeMaterialLibrary,
  hex: number
): THREE.Group {
  const g = new THREE.Group();
  const mat = materials.createToonMaterial(hex, {
    emissive: hex,
    emissiveIntensity: 1.0,
  });
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 10, 22), mat);
  addInvertedHullOutline(bow, materials.inkOutlineMaterial, 1.09);
  g.add(bow);

  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.11, 0.11), mat);
  shaft.position.set(0.66, 0, 0);
  addAnimeInkEdges(shaft, materials.inkLineMaterial, 20);
  g.add(shaft);

  for (const tx of [0.84, 1.0]) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.22, 0.1), mat);
    tooth.position.set(tx, -0.15, 0);
    g.add(tooth);
  }
  return g;
}

/**
 * Composite 3D Server / Appliance Tower with LED rows & cutaway front plate.
 */
export function buildServerRackTower(
  materials: AnimeMaterialLibrary,
  opts: {
    bodyHex?: number;
    ledHex?: number;
    height?: number;
    width?: number;
  } = {}
): {
  group: THREE.Group;
  frontDoor: THREE.Mesh;
  ledMat: THREE.MeshToonMaterial;
  coreMesh: THREE.Mesh;
} {
  const g = new THREE.Group();
  const h = opts.height ?? 3.6;
  const w = opts.width ?? 1.9;

  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 1.4),
    materials.createToonMaterial(opts.bodyHex ?? 0x1e293b)
  );
  shell.position.y = h * 0.5;
  shell.castShadow = true;
  addAnimeInkEdges(shell, materials.inkLineMaterial, 22);
  g.add(shell);

  const ledHex = opts.ledHex ?? 0x38bdf8;
  const ledMat = materials.createToonMaterial(ledHex, {
    emissive: ledHex,
    emissiveIntensity: 1.15,
  });

  for (let i = 0; i < 4; i += 1) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, 0.12, 0.08), ledMat);
    bar.position.set(0, 0.7 + i * (h * 0.2), 0.72);
    g.add(bar);
  }

  const coreMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.45, 0),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xf43f5e,
      emissiveIntensity: 1.2,
    })
  );
  coreMesh.position.set(0, h * 0.52, 0.1);
  addInvertedHullOutline(coreMesh, materials.inkOutlineMaterial, 1.08);
  g.add(coreMesh);

  const frontDoor = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.94, h * 0.9, 0.1),
    materials.createToonMaterial(0x334155, { transparent: true, opacity: 0.92 })
  );
  frontDoor.position.set(0, h * 0.5, 0.72);
  addAnimeInkEdges(frontDoor, materials.inkLineMaterial, 22);
  g.add(frontDoor);

  return { group: g, frontDoor, ledMat, coreMesh };
}

/**
 * Clean Bezier arc + discrete glowing courier/packet cubes traveling along the path.
 */
export function buildPacketArcTrack(
  start: THREE.Vector3,
  control: THREE.Vector3,
  end: THREE.Vector3,
  packetHex: number,
  packetCount = 4
): {
  group: THREE.Group;
  curve: THREE.QuadraticBezierCurve3;
  packets: THREE.Mesh[];
  updatePackets: (phaseT: number, visible: boolean) => void;
} {
  const group = new THREE.Group();
  const curve = new THREE.QuadraticBezierCurve3(start, control, end);
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.045, 6, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: packetHex,
    transparent: true,
    opacity: 0.55,
    toneMapped: false,
  });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tube);

  const pktGeo = new THREE.BoxGeometry(0.28, 0.22, 0.28);
  const pktMat = new THREE.MeshBasicMaterial({
    color: packetHex,
    toneMapped: false,
  });
  const packets: THREE.Mesh[] = [];
  for (let i = 0; i < packetCount; i += 1) {
    const p = new THREE.Mesh(pktGeo, pktMat);
    group.add(p);
    packets.push(p);
  }

  const updatePackets = (phaseT: number, visible: boolean) => {
    tube.visible = visible;
    for (let i = 0; i < packets.length; i += 1) {
      const pkt = packets[i];
      pkt.visible = visible;
      if (!visible) continue;
      const u = (phaseT + i / packets.length) % 1;
      curve.getPoint(u, pkt.position);
      pkt.rotation.y = u * Math.PI * 4;
      pkt.rotation.x = u * Math.PI * 2;
    }
  };

  return { group, curve, packets, updatePackets };
}

/**
 * Sweeping forensic X-Ray / UV scanner gantry mounted strictly from rear struts.
 */
export function buildForensicScannerBeam(
  materials: AnimeMaterialLibrary,
  spanWidth = 11.5,
  beamHex = 0xfacc15
): {
  group: THREE.Group;
  carriage: THREE.Group;
  beamMat: THREE.MeshBasicMaterial;
} {
  const group = new THREE.Group();
  const railMat = materials.createToonMaterial(0x334155);

  // Rear vertical columns only (z = -3.4) -> 0 foreground occlusion!
  for (const x of [-spanWidth * 0.5, spanWidth * 0.5]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, 5.2, 0.32), railMat);
    post.position.set(x, 2.6, -3.4);
    addAnimeInkEdges(post, materials.inkLineMaterial, 22);
    group.add(post);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 3.6), railMat);
    arm.position.set(x, 5.05, -1.7);
    addAnimeInkEdges(arm, materials.inkLineMaterial, 22);
    group.add(arm);
  }

  const topRail = new THREE.Mesh(
    new THREE.BoxGeometry(spanWidth + 0.5, 0.28, 0.32),
    railMat
  );
  topRail.position.set(0, 5.05, 0);
  addAnimeInkEdges(topRail, materials.inkLineMaterial, 22);
  group.add(topRail);

  const carriage = new THREE.Group();
  carriage.position.set(0, 4.9, 0);
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.42, 0.72),
    materials.createToonMaterial(0x0f172a)
  );
  addAnimeInkEdges(head, materials.inkLineMaterial, 22);
  carriage.add(head);

  const beamMat = new THREE.MeshBasicMaterial({
    color: beamHex,
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
  });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 4.7), beamMat);
  beam.position.set(0, -2.45, 0);
  carriage.add(beam);

  const crossBeam = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 4.7), beamMat);
  crossBeam.rotation.y = Math.PI / 2;
  crossBeam.position.set(0, -2.45, 0);
  carriage.add(crossBeam);

  group.add(carriage);
  return { group, carriage, beamMat };
}

/**
 * Helper to create a clean contact shadow disc beneath hero props.
 */
export function buildContactShadow(
  materials: AnimeMaterialLibrary,
  radiusX = 2.2,
  radiusZ = 1.6
): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(radiusX * 2, radiusZ * 2),
    new THREE.MeshBasicMaterial({
      map: materials.contactShadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.025;
  return m;
}
