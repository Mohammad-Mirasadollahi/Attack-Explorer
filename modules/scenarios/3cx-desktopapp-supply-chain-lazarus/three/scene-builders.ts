import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createCleanroomSignTexture(
  title: string,
  subtitle: string,
  bgHex: string,
  borderHex: string,
  titleHex: string,
  subHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 768, 192);

  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 748, 172);

  ctx.fillStyle = titleHex;
  ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 384, 72, 710);

  ctx.fillStyle = subHex;
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillText(subtitle, 384, 138, 710);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCleanroomContactShadow(
  materials: AnimeMaterialLibrary,
  radiusX: number,
  radiusZ: number
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radiusX * 2, radiusZ * 2),
    new THREE.MeshBasicMaterial({
      map: materials.contactShadowTexture,
      transparent: true,
      opacity: 0.56,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.015;
  return mesh;
}

export interface CleanroomBackdropRig {
  group: THREE.Group;
  edrBeaconMat: THREE.MeshBasicMaterial;
  edrScreenMat: THREE.MeshBasicMaterial;
  edrNormalTex: THREE.CanvasTexture;
  edrAlertTex: THREE.CanvasTexture;
  textures: THREE.Texture[];
}

/**
 * Split Cleanroom Porcelain Floor (left) + Warm Trading Office Zone (right) +
 * Rear Glass Backdrop strictly behind z <= -4.1 + Elevated Violet Behavioral Watch Monitor.
 */
export function buildCleanroomAndOfficeFloor(
  materials: AnimeMaterialLibrary,
  accentHex = 0x10b981
): CleanroomBackdropRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Left half: sterile porcelain cleanroom slab
  const leftFloor = new THREE.Mesh(
    new THREE.BoxGeometry(10.8, 0.36, 13),
    materials.createToonMaterial(0xf1f5f9)
  );
  leftFloor.position.set(-5.4, -0.18, -0.5);
  leftFloor.receiveShadow = true;
  addAnimeInkEdges(leftFloor, materials.inkLineMaterial, 28);
  group.add(leftFloor);

  // Right half: warm trading office parquet floor
  const rightFloor = new THREE.Mesh(
    new THREE.BoxGeometry(10.8, 0.36, 13),
    materials.createToonMaterial(0xe7dfd1)
  );
  rightFloor.position.set(5.4, -0.18, -0.5);
  rightFloor.receiveShadow = true;
  addAnimeInkEdges(rightFloor, materials.inkLineMaterial, 28);
  group.add(rightFloor);

  // Dark plinth trim
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(22.0, 0.14, 13.4),
    materials.createToonMaterial(0x0f172a)
  );
  trim.position.set(0, -0.35, -0.5);
  group.add(trim);

  // Cleanroom-to-office brass threshold divider
  const divider = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.03, 12.6),
    materials.createToonMaterial(0x10b981)
  );
  divider.position.set(0, 0.014, -0.5);
  group.add(divider);

  // Rear cleanroom glass wall (strictly z = -4.3)
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 6.4, 0.32),
    materials.createToonMaterial(0xe2e8f0)
  );
  rearWall.position.set(0, 3.2, -4.3);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial, 28);
  group.add(rearWall);

  for (let i = -2; i <= 2; i += 1) {
    const bay = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.1, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
    );
    bay.position.set(i * 3.85, 4.4, -4.08);
    addAnimeInkEdges(bay, materials.inkLineMaterial, 28);
    group.add(bay);
  }

  const accentBar = new THREE.Mesh(
    new THREE.BoxGeometry(21.2, 0.14, 0.12),
    new THREE.MeshBasicMaterial({ color: accentHex })
  );
  accentBar.position.set(0, 6.1, -4.08);
  group.add(accentBar);

  // Elevated Violet Behavioral Watch Monitor (rear center-right z = -3.6)
  const edrWatch = new THREE.Group();
  edrWatch.position.set(1.2, 4.7, -3.55);

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 1.12, 0.48),
    materials.createToonMaterial(0x1e293b)
  );
  addAnimeInkEdges(housing, materials.inkLineMaterial, 24);
  edrWatch.add(housing);

  const edrNormalTex = createCleanroomSignTexture(
    'BEHAVIORAL WATCH',
    'OFFICIAL SEAL VERIFIED · MONITORING',
    '#0f172a',
    '#10b981',
    '#34d399',
    '#cbd5e1'
  );
  const edrAlertTex = createCleanroomSignTexture(
    'BEHAVIORAL ALERT!',
    'DESK PHONE ACCESSING PASSWORD DRAWER',
    '#3b0764',
    '#e11d48',
    '#fda4af',
    '#fde68a'
  );
  textures.push(edrNormalTex, edrAlertTex);

  const edrScreenMat = new THREE.MeshBasicMaterial({ map: edrNormalTex });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.86), edrScreenMat);
  screen.position.z = 0.25;
  edrWatch.add(screen);

  const edrBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), edrBeaconMat);
  beacon.position.set(0, 0.72, 0);
  edrWatch.add(beacon);

  group.add(edrWatch);

  return { group, edrBeaconMat, edrScreenMat, edrNormalTex, edrAlertTex, textures };
}

export interface CleanroomPressRig {
  group: THREE.Group;
  sabotageArm: THREE.Group;
  pressHead: THREE.Group;
  pressGlowMat: THREE.MeshBasicMaterial;
  inspectorWandBeam: THREE.Mesh;
  inspectorLampMat: THREE.MeshBasicMaterial;
  textures: THREE.Texture[];
}

/**
 * Cleanroom Conveyor + Upstream Covert Robotic Sabotage Arm + Official Gold Hologram Press +
 * Cleanroom Quality Inspector With Emerald Laser Wand (Step 1).
 */
export function buildCleanroomConveyorAndSabotageArm(
  materials: AnimeMaterialLibrary
): CleanroomPressRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  group.add(createCleanroomContactShadow(materials, 4.4, 1.35));

  // Brushed aluminum conveyor bed
  const beltBed = new THREE.Mesh(
    new THREE.BoxGeometry(8.4, 0.34, 1.55),
    materials.createToonMaterial(0x64748b)
  );
  beltBed.position.set(0, 0.96, 0);
  beltBed.castShadow = true;
  addAnimeInkEdges(beltBed, materials.inkLineMaterial, 24);
  group.add(beltBed);

  const beltTop = new THREE.Mesh(
    new THREE.BoxGeometry(8.1, 0.06, 1.24),
    materials.createToonMaterial(0x1e293b)
  );
  beltTop.position.set(0, 1.15, 0);
  group.add(beltTop);

  for (const lx of [-3.6, -1.2, 1.2, 3.6]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.94, 1.25),
      materials.createToonMaterial(0x94a3b8)
    );
    leg.position.set(lx, 0.47, 0);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 24);
    group.add(leg);
  }

  // Upstream Supplier Vent & Covert Matte-Black Articulated Sabotage Arm (left side)
  const ventHood = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.56, 0.96),
    materials.createToonMaterial(0x0f172a)
  );
  ventHood.position.set(-2.9, 4.35, -0.55);
  addAnimeInkEdges(ventHood, materials.inkLineMaterial, 24);
  group.add(ventHood);

  const sabotageArm = new THREE.Group();
  sabotageArm.position.set(-2.9, 4.1, 0);
  const armMast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.13, 1.55, 14),
    materials.createToonMaterial(0x1e293b)
  );
  armMast.position.y = -0.78;
  sabotageArm.add(armMast);
  const syringeRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.055, 10, 20),
    materials.createToonMaterial(0xe11d48)
  );
  syringeRing.rotation.x = Math.PI / 2;
  syringeRing.position.y = -1.52;
  sabotageArm.add(syringeRing);
  const clawL = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.36, 0.1),
    materials.createToonMaterial(0xe11d48)
  );
  clawL.position.set(-0.22, -1.72, 0);
  sabotageArm.add(clawL);
  const clawR = clawL.clone();
  clawR.position.x = 0.22;
  sabotageArm.add(clawR);
  group.add(sabotageArm);

  // Official Gold Hologram Signing Press (center rear-cantilevered arch z = -0.75)
  const pressPillar = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 3.85, 0.52),
    materials.createToonMaterial(0x334155)
  );
  pressPillar.position.set(0.35, 1.925, -1.05);
  addAnimeInkEdges(pressPillar, materials.inkLineMaterial, 24);
  group.add(pressPillar);

  const pressArmTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.44, 1.55),
    materials.createToonMaterial(0xd97706)
  );
  pressArmTop.position.set(0.35, 3.72, -0.35);
  addAnimeInkEdges(pressArmTop, materials.inkLineMaterial, 24);
  group.add(pressArmTop);

  const pressHead = new THREE.Group();
  pressHead.position.set(0.35, 3.32, 0);
  const piston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 1.15, 16),
    materials.createToonMaterial(0xfbbf24)
  );
  piston.position.y = -0.45;
  pressHead.add(piston);
  const stampDie = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.48, 0.24, 24),
    materials.createToonMaterial(0x10b981)
  );
  stampDie.position.y = -1.02;
  addAnimeInkEdges(stampDie, materials.inkLineMaterial, 24);
  pressHead.add(stampDie);
  const pressGlowMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    transparent: true,
    opacity: 0.25,
  });
  const pressGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 24), pressGlowMat);
  pressGlow.position.y = -1.16;
  pressHead.add(pressGlow);
  group.add(pressHead);

  const pressTex = createCleanroomSignTexture(
    'OFFICIAL GOLD SEAL PRESS',
    'GENUINE PUBLISHER HOLOGRAM',
    '#064e3b',
    '#fbbf24',
    '#fef3c7',
    '#a7f3d0'
  );
  textures.push(pressTex);
  const pressSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.65, 0.4),
    new THREE.MeshBasicMaterial({ map: pressTex })
  );
  pressSign.position.set(0.35, 3.72, 0.44);
  group.add(pressSign);

  // Cleanroom Quality Inspector Standing Behind Conveyor Right (z = -1.15)
  const inspector = new THREE.Group();
  inspector.position.set(2.45, 0, -1.15);

  const coat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.36, 1.32, 14),
    materials.createToonMaterial(0xf8fafc)
  );
  coat.position.y = 0.88;
  addAnimeInkEdges(coat, materials.inkLineMaterial, 24);
  inspector.add(coat);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 14),
    materials.createToonMaterial(0xfde68a)
  );
  head.position.y = 1.78;
  addAnimeInkEdges(head, materials.inkLineMaterial, 28);
  inspector.add(head);

  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.14, 0.16),
    materials.createToonMaterial(0x0284c7)
  );
  visor.position.set(0, 1.82, 0.18);
  inspector.add(visor);

  const inspectorLampMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
  const badgeLamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), inspectorLampMat);
  badgeLamp.position.set(0, 2.25, 0);
  inspector.add(badgeLamp);

  const inspectorWandBeam = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 1.25, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  inspectorWandBeam.position.set(0, 1.55, 0.85);
  inspectorWandBeam.rotation.x = Math.PI * 0.62;
  inspectorWandBeam.visible = false;
  inspector.add(inspectorWandBeam);

  group.add(inspector);

  return {
    group,
    sabotageArm,
    pressHead,
    pressGlowMat,
    inspectorWandBeam,
    inspectorLampMat,
    textures,
  };
}

export interface DesktopPhoneConsoleRig {
  group: THREE.Group;
  cutawayLid: THREE.Group;
  hologramSeal: THREE.Group;
  riggedGear: THREE.Group;
  prismUpper: THREE.Mesh;
  amberCore: THREE.Group;
  cipherSpool: THREE.Group;
  hoverRadio: THREE.Group;
}

/**
 * Composite Articulated Matte-White Business Desktop Phone Console:
 * - Genuine Gold-Emerald Hologram Seal on lid
 * - Detachable Cutaway Shell
 * - Internal Crimson-Toothed Brass Audio Gear (`ffmpeg.dll`)
 * - Frosted Graphics Prism (`d3dcompiler_47.dll`) with Cracking Amber Core (`0xFEEDFACE`)
 * - Unwinding Golden Cipher Spool (`RC4`) & Hovering Holographic Covert Radio (`RWX`)
 */
export function buildDesktopPhoneConsole(
  materials: AnimeMaterialLibrary
): DesktopPhoneConsoleRig {
  const group = new THREE.Group();

  // Lower sculpted matte-white phone chassis tray
  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.42, 1.22),
    materials.createToonMaterial(0xf8fafc)
  );
  chassis.position.y = 0.21;
  chassis.castShadow = true;
  addAnimeInkEdges(chassis, materials.inkLineMaterial, 24);
  addInvertedHullOutline(chassis, 0.02);
  group.add(chassis);

  // Dark internal circuit bay recess
  const cavity = new THREE.Mesh(
    new THREE.BoxGeometry(1.52, 0.14, 0.98),
    materials.createToonMaterial(0x1e293b)
  );
  cavity.position.y = 0.4;
  group.add(cavity);

  // 1) Rigged Crimson-Toothed Brass Audio Gear (`ffmpeg.dll`)
  const riggedGear = new THREE.Group();
  riggedGear.position.set(-0.38, 0.56, 0.02);
  const gearDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.14, 18),
    materials.createToonMaterial(0xd97706)
  );
  addAnimeInkEdges(gearDisc, materials.inkLineMaterial, 24);
  riggedGear.add(gearDisc);
  for (let t = 0; t < 8; t += 1) {
    const tooth = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.14, 0.11),
      materials.createToonMaterial(0xe11d48)
    );
    const ang = (t * Math.PI) / 4;
    tooth.position.set(Math.cos(ang) * 0.3, 0, Math.sin(ang) * 0.3);
    tooth.rotation.y = -ang;
    riggedGear.add(tooth);
  }
  group.add(riggedGear);

  // 2) Frosted Graphics Prism (`d3dcompiler_47.dll`) + Cracking Amber Core (`0xFEEDFACE`)
  const prismBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.16, 0.54),
    materials.createToonMaterial(0x38bdf8)
  );
  prismBase.position.set(0.38, 0.54, 0.02);
  addAnimeInkEdges(prismBase, materials.inkLineMaterial, 24);
  group.add(prismBase);

  const prismUpper = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshToonMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.78,
    })
  );
  prismUpper.position.set(0.38, 0.84, 0.02);
  addAnimeInkEdges(prismUpper, materials.inkLineMaterial, 24);
  group.add(prismUpper);

  const amberCore = new THREE.Group();
  amberCore.position.set(0.38, 0.72, 0.02);
  const corePill = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.26, 14),
    materials.createToonMaterial(0xf59e0b)
  );
  addAnimeInkEdges(corePill, materials.inkLineMaterial, 24);
  amberCore.add(corePill);
  const coreBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.035, 8, 18),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  coreBand.rotation.x = Math.PI / 2;
  amberCore.add(coreBand);
  group.add(amberCore);

  // 3) Spinning Golden Cipher Spool (`RC4`)
  const cipherSpool = new THREE.Group();
  cipherSpool.position.set(0.02, 1.15, 0.02);
  const spoolRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.045, 10, 28),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  spoolRing.rotation.x = Math.PI / 2.6;
  cipherSpool.add(spoolRing);
  cipherSpool.scale.setScalar(0.01);
  group.add(cipherSpool);

  // 4) Hovering Holographic Covert Radio (`Unbacked MEM_PRIVATE RWX`)
  const hoverRadio = new THREE.Group();
  hoverRadio.position.set(0.02, 1.48, 0.02);
  const radioCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.24, 0),
    new THREE.MeshBasicMaterial({ color: 0xe11d48 })
  );
  hoverRadio.add(radioCore);
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.62, 10),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  antenna.position.y = 0.34;
  hoverRadio.add(antenna);
  const dish = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.03, 10, 22),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  dish.rotation.x = Math.PI / 2;
  hoverRadio.add(dish);
  hoverRadio.scale.setScalar(0.01);
  group.add(hoverRadio);

  // Detachable Top White Phone Shell + Handset + Keypad + Genuine Gold-Emerald Hologram Seal
  const cutawayLid = new THREE.Group();
  const topShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.76, 0.24, 1.22),
    materials.createToonMaterial(0xffffff)
  );
  topShell.position.y = 0.56;
  addAnimeInkEdges(topShell, materials.inkLineMaterial, 24);
  cutawayLid.add(topShell);

  const handset = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.16, 1.04),
    materials.createToonMaterial(0x334155)
  );
  handset.position.set(-0.58, 0.74, 0);
  addAnimeInkEdges(handset, materials.inkLineMaterial, 24);
  cutawayLid.add(handset);

  const phoneDisplay = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.06, 0.44),
    materials.createToonMaterial(0x0ea5e9)
  );
  phoneDisplay.position.set(0.18, 0.7, -0.22);
  cutawayLid.add(phoneDisplay);

  // Genuine Gold-Emerald Authenticity Hologram Seal
  const hologramSeal = new THREE.Group();
  hologramSeal.position.set(0.28, 0.72, 0.3);
  const sealCoin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  hologramSeal.add(sealCoin);
  const sealCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16),
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  hologramSeal.add(sealCore);
  hologramSeal.visible = false;
  cutawayLid.add(hologramSeal);

  group.add(cutawayLid);

  return {
    group,
    cutawayLid,
    hologramSeal,
    riggedGear,
    prismUpper,
    amberCore,
    cipherSpool,
    hoverRadio,
  };
}

export interface PublicIconGalleryRig {
  group: THREE.Group;
  targetTile: THREE.Group;
  hiddenStrip: THREE.Mesh;
  scanBeam: THREE.Mesh;
  textures: THREE.Texture[];
}

/**
 * Framed Public Art-Gallery Wall With 6 Innocent Miniature Portrait Tiles (`GitHub IconStorages .ico`)
 * + Secret Crimson Border Strip Peeling Off Bottom of Tile #4 (Step 3).
 */
export function buildPublicIconGalleryWall(
  materials: AnimeMaterialLibrary
): PublicIconGalleryRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 2.55, 0.18),
    materials.createToonMaterial(0xf8fafc)
  );
  board.position.set(0, 2.45, 0);
  addAnimeInkEdges(board, materials.inkLineMaterial, 24);
  group.add(board);

  const headerTex = createCleanroomSignTexture(
    'PUBLIC ICON GALLERY',
    'FRAMED PORTRAIT TILES · OPEN WALL',
    '#0f172a',
    '#0284c7',
    '#e0f2fe',
    '#7dd3fc'
  );
  textures.push(headerTex);
  const headerSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.15, 0.42),
    new THREE.MeshBasicMaterial({ map: headerTex })
  );
  headerSign.position.set(0, 3.42, 0.11);
  group.add(headerSign);

  const palette = [0x38bdf8, 0x34d399, 0xfbbf24, 0x818cf8, 0xf472b6, 0x2dd4bf];
  let targetTile = new THREE.Group();
  let hiddenStrip!: THREE.Mesh;

  for (let i = 0; i < 6; i += 1) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const tile = new THREE.Group();
    tile.position.set((col - 1) * 1.05, 2.68 - row * 0.92, 0.12);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.68, 0.08),
      materials.createToonMaterial(0x334155)
    );
    addAnimeInkEdges(frame, materials.inkLineMaterial, 24);
    tile.add(frame);

    const art = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.52, 0.09),
      materials.createToonMaterial(palette[i])
    );
    tile.add(art);

    // Innocent geometric icon emblem inside each portrait tile
    const emblem = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 14),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    emblem.position.z = 0.055;
    tile.add(emblem);

    // Tile #4 (index 3) holds the concealed crimson border strip tucked under its bottom frame!
    if (i === 3) {
      targetTile = tile;
      hiddenStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.76, 0.16, 0.06),
        new THREE.MeshBasicMaterial({ color: 0xe11d48 })
      );
      hiddenStrip.position.set(0, -0.32, 0.06);
      tile.add(hiddenStrip);
    }

    group.add(tile);
  }

  // Cyan laser scan line from phone radio hitting Tile #4
  const scanBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 3.2, 10),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.72,
    })
  );
  scanBeam.position.set(-1.35, 1.92, 1.15);
  scanBeam.rotation.set(0.32, 0, -1.24);
  scanBeam.visible = false;
  group.add(scanBeam);

  return { group, targetTile, hiddenStrip, scanBeam, textures };
}

export interface TraderDeskVipVaultRig {
  group: THREE.Group;
  keycards: THREE.Mesh[];
  vipVault: THREE.Group;
  vipTether: THREE.Mesh;
}

/**
 * Walnut Trader Office Desk With Browser Keycard Folder (`ICONICSTEALER`) +
 * Elevated Selective Crimson VIP Vault (`Gopuram`) (Step 4).
 */
export function buildTraderCredentialDeskAndVipVault(
  materials: AnimeMaterialLibrary
): TraderDeskVipVaultRig {
  const group = new THREE.Group();

  group.add(createCleanroomContactShadow(materials, 2.2, 1.25));

  // Walnut trader desk
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.2, 1.75),
    materials.createToonMaterial(0x92400e)
  );
  deskTop.position.set(0, 1.05, 0);
  deskTop.castShadow = true;
  addAnimeInkEdges(deskTop, materials.inkLineMaterial, 24);
  group.add(deskTop);

  for (const lx of [-1.65, 1.65]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.04, 1.5),
      materials.createToonMaterial(0x451a03)
    );
    leg.position.set(lx, 0.52, 0);
    group.add(leg);
  }

  // Browser Keycard Tray on right end of desk
  const tray = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.24, 0.84),
    materials.createToonMaterial(0x1e293b)
  );
  tray.position.set(1.25, 1.26, 0.12);
  addAnimeInkEdges(tray, materials.inkLineMaterial, 24);
  group.add(tray);

  const keycards: THREE.Mesh[] = [];
  for (let k = 0; k < 3; k += 1) {
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.05, 0.26),
      materials.createToonMaterial(0x38bdf8)
    );
    card.position.set(1.25, 1.42 + k * 0.07, 0.12);
    addAnimeInkEdges(card, materials.inkLineMaterial, 24);
    group.add(card);
    keycards.push(card);
  }

  // Elevated Crimson Selective VIP Vault (`Gopuram`)
  const vipVault = new THREE.Group();
  vipVault.position.set(1.15, 4.35, -0.65);
  const vaultCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.46, 0),
    materials.createToonMaterial(0xe11d48)
  );
  addAnimeInkEdges(vaultCore, materials.inkLineMaterial, 24);
  addInvertedHullOutline(vaultCore, 0.025);
  vipVault.add(vaultCore);
  const crown = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.055, 10, 24),
    materials.createToonMaterial(0xfbbf24)
  );
  crown.rotation.x = Math.PI / 2;
  vipVault.add(crown);
  group.add(vipVault);

  // Crimson selective tether connecting phone to VIP vault
  const vipTether = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 2.6, 12),
    new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.78,
    })
  );
  vipTether.position.set(0.32, 3.1, -0.35);
  vipTether.rotation.z = -0.42;
  vipTether.visible = false;
  group.add(vipTether);

  return { group, keycards, vipVault, vipTether };
}
