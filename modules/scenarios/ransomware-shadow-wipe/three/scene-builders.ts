import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createArchiveSignTexture(
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
  ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
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

export function createArchiveContactShadow(
  materials: AnimeMaterialLibrary,
  radiusX: number,
  radiusZ: number
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radiusX * 2, radiusZ * 2),
    new THREE.MeshBasicMaterial({
      map: materials.contactShadowTexture,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.015;
  return mesh;
}

export interface ArchiveHallBackdropRig {
  group: THREE.Group;
  auditBeaconMat: THREE.MeshBasicMaterial;
  auditScreenMat: THREE.MeshBasicMaterial;
  auditNormalTex: THREE.CanvasTexture;
  auditAlertTex: THREE.CanvasTexture;
  textures: THREE.Texture[];
}

/**
 * Municipal Records Vault floor, recessed rear steel walls (strictly z <= -3.6),
 * and elevated SIEM Audit Console overhead.
 */
export function buildArchiveHallFloorAndBackdrop(
  materials: AnimeMaterialLibrary,
  accentHex = 0xdc2626
): ArchiveHallBackdropRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Grounded slate concrete archive floor at y = 0
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(21, 0.36, 13),
    materials.createToonMaterial(0xd6d3cd)
  );
  floor.position.set(0, -0.18, -0.5);
  floor.receiveShadow = true;
  addAnimeInkEdges(floor, materials.inkLineMaterial, 28);
  group.add(floor);

  const plinthTrim = new THREE.Mesh(
    new THREE.BoxGeometry(21.3, 0.14, 13.3),
    materials.createToonMaterial(0x1e293b)
  );
  plinthTrim.position.set(0, -0.35, -0.5);
  group.add(plinthTrim);

  // Subtle floor zone divider stripe between Backup Wing (left) and Active Filing Wing (right)
  const zoneStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.02, 9.4),
    materials.createToonMaterial(0xb45309)
  );
  zoneStripe.position.set(-1.15, 0.012, -0.3);
  group.add(zoneStripe);

  // Rear structural archive wall (z = -4.2, safely behind all cameras)
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(20.6, 6.4, 0.35),
    materials.createToonMaterial(0xe7e5e0)
  );
  rearWall.position.set(0, 3.2, -4.3);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial, 28);
  group.add(rearWall);

  // Upper steel clerestory beam & warm skylight windows
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(20.8, 0.42, 0.6),
    materials.createToonMaterial(0x334155)
  );
  beam.position.set(0, 6.2, -4.1);
  addAnimeInkEdges(beam, materials.inkLineMaterial, 28);
  group.add(beam);

  for (let i = -2; i <= 2; i += 1) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(3.1, 1.15, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xfef3c7 })
    );
    win.position.set(i * 3.7, 5.2, -4.08);
    addAnimeInkEdges(win, materials.inkLineMaterial, 28);
    group.add(win);
  }

  // Accent frieze strip along top wall
  const frieze = new THREE.Mesh(
    new THREE.BoxGeometry(20.4, 0.14, 0.12),
    new THREE.MeshBasicMaterial({ color: accentHex })
  );
  frieze.position.set(0, 4.35, -4.08);
  group.add(frieze);

  // Elevated Tamper-Proof Ceiling Audit Console (rear center z = -3.6)
  const auditConsole = new THREE.Group();
  auditConsole.position.set(-0.4, 4.55, -3.55);

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 1.12, 0.55),
    materials.createToonMaterial(0x1e293b)
  );
  addAnimeInkEdges(housing, materials.inkLineMaterial, 24);
  auditConsole.add(housing);

  const auditNormalTex = createArchiveSignTexture(
    'ARCHIVE AUDIT VAULT',
    'BACKUPS INTACT · LOGS RECORDING',
    '#0f172a',
    '#10b981',
    '#34d399',
    '#cbd5e1'
  );
  const auditAlertTex = createArchiveSignTexture(
    'TAMPER WITNESS ALERT',
    'LOG WIPE & BACKUP DESTRUCTION FLAGGED',
    '#2e1065',
    '#a855f7',
    '#f5d0fe',
    '#fde68a'
  );
  textures.push(auditNormalTex, auditAlertTex);

  const auditScreenMat = new THREE.MeshBasicMaterial({ map: auditNormalTex });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.86), auditScreenMat);
  screen.position.z = 0.29;
  auditConsole.add(screen);

  const auditBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const beaconDome = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.34, 16), auditBeaconMat);
  beaconDome.position.set(0, 0.74, 0);
  addAnimeInkEdges(beaconDome, materials.inkLineMaterial, 28);
  auditConsole.add(beaconDome);

  group.add(auditConsole);

  return {
    group,
    auditBeaconMat,
    auditScreenMat,
    auditNormalTex,
    auditAlertTex,
    textures,
  };
}

export interface PsExecDispatchHatchRig {
  group: THREE.Group;
  capsule: THREE.Group;
  breakerPivot: THREE.Group;
  statusLampMat: THREE.MeshBasicMaterial;
  textures: THREE.Texture[];
}

/**
 * Remote Brass Pneumatic Service Dispatch Hatch & Armored Capsule (Step 1).
 */
export function buildPsExecDispatchHatch(
  materials: AnimeMaterialLibrary
): PsExecDispatchHatchRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shadow = createArchiveContactShadow(materials, 1.35, 1.0);
  group.add(shadow);

  // Heavy cast-steel wall pedestal
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 2.45, 1.1),
    materials.createToonMaterial(0x334155)
  );
  base.position.set(0, 1.225, 0);
  base.castShadow = true;
  addAnimeInkEdges(base, materials.inkLineMaterial, 24);
  group.add(base);

  // Overhead curved pneumatic conduit entering from left
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 2.4, 18),
    materials.createToonMaterial(0x94a3b8)
  );
  tube.rotation.z = Math.PI / 2;
  tube.position.set(-1.3, 2.05, 0.08);
  addAnimeInkEdges(tube, materials.inkLineMaterial, 28);
  group.add(tube);

  // Socket receiver ring
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.08, 12, 24),
    materials.createToonMaterial(0xd97706)
  );
  collar.rotation.y = Math.PI / 2;
  collar.position.set(-0.92, 2.05, 0.08);
  group.add(collar);

  // Articulated Armored Brass Dispatch Capsule (3-part composite)
  const capsule = new THREE.Group();
  const capBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 0.68, 16),
    materials.createToonMaterial(0xd97706)
  );
  capBody.rotation.z = Math.PI / 2;
  addAnimeInkEdges(capBody, materials.inkLineMaterial, 28);
  addInvertedHullOutline(capBody, 0.025);
  capsule.add(capBody);

  const capNose = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 14, 12),
    materials.createToonMaterial(0xe11d48)
  );
  capNose.position.x = 0.34;
  capsule.add(capNose);

  const capRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.035, 10, 20),
    materials.createToonMaterial(0x0f172a)
  );
  capRing.rotation.y = Math.PI / 2;
  capsule.add(capRing);

  capsule.position.set(-2.3, 2.05, 0.08);
  group.add(capsule);

  // Master SYSTEM Breaker Switch Lever
  const breakerHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.86, 0.24),
    materials.createToonMaterial(0x1e293b)
  );
  breakerHousing.position.set(0.15, 1.35, 0.6);
  addAnimeInkEdges(breakerHousing, materials.inkLineMaterial, 24);
  group.add(breakerHousing);

  const breakerPivot = new THREE.Group();
  breakerPivot.position.set(0.15, 1.35, 0.72);
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.56, 0.1),
    materials.createToonMaterial(0xf59e0b)
  );
  arm.position.y = 0.26;
  addAnimeInkEdges(arm, materials.inkLineMaterial, 24);
  breakerPivot.add(arm);

  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.42, 12),
    materials.createToonMaterial(0xdc2626)
  );
  grip.rotation.z = Math.PI / 2;
  grip.position.y = 0.54;
  breakerPivot.add(grip);
  group.add(breakerPivot);

  // Status lamp & brass nameplate
  const statusLampMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), statusLampMat);
  lamp.position.set(0.62, 2.18, 0.56);
  group.add(lamp);

  const plaqueTex = createArchiveSignTexture(
    'SERVICE DISPATCH',
    'REMOTE MASTER BREAKER',
    '#1e293b',
    '#f59e0b',
    '#fde68a',
    '#cbd5e1'
  );
  textures.push(plaqueTex);
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.36),
    new THREE.MeshBasicMaterial({ map: plaqueTex })
  );
  plaque.position.set(0, 0.5, 0.57);
  group.add(plaque);

  return { group, capsule, breakerPivot, statusLampMat, textures };
}

export interface BackupReelShredderRig {
  group: THREE.Group;
  reels: THREE.Group[];
  shredderRollers: [THREE.Mesh, THREE.Mesh];
  shredderHood: THREE.Mesh;
  ribbonHeap: THREE.Group;
  recoveryLeverIntact: THREE.Group;
  recoveryLeverBroken: THREE.Group;
  backupLampMat: THREE.MeshBasicMaterial;
  textures: THREE.Texture[];
}

/**
 * 4 Spinning Silver Microfilm Backup Reels + Industrial Twin-Roller Shredder +
 * Glass-Cased Green Emergency Recovery Lever (Step 2).
 */
export function buildBackupReelRackAndShredder(
  materials: AnimeMaterialLibrary
): BackupReelShredderRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  group.add(createArchiveContactShadow(materials, 2.35, 1.4));

  // Brushed steel backup reel rack frame (left side of rig)
  const rackBack = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 3.1, 0.24),
    materials.createToonMaterial(0x475569)
  );
  rackBack.position.set(-0.7, 1.55, -0.45);
  rackBack.castShadow = true;
  addAnimeInkEdges(rackBack, materials.inkLineMaterial, 24);
  group.add(rackBack);

  const rackBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 0.22, 1.2),
    materials.createToonMaterial(0x334155)
  );
  rackBase.position.set(-0.7, 0.11, -0.05);
  addAnimeInkEdges(rackBase, materials.inkLineMaterial, 24);
  group.add(rackBase);

  // 4 Articulated Silver Microfilm Backup Reels
  const reels: THREE.Group[] = [];
  const reelPositions: [number, number][] = [
    [-1.3, 2.48],
    [-0.1, 2.48],
    [-1.3, 1.38],
    [-0.1, 1.38],
  ];
  for (let i = 0; i < 4; i += 1) {
    const reel = new THREE.Group();
    const [rx, ry] = reelPositions[i];

    // Outer silver flange
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.14, 24),
      materials.createToonMaterial(0xe2e8f0)
    );
    flange.rotation.x = Math.PI / 2;
    addAnimeInkEdges(flange, materials.inkLineMaterial, 28);
    addInvertedHullOutline(flange, 0.02);
    reel.add(flange);

    // Inner blue archival tape core
    const tapeBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.16, 20),
      materials.createToonMaterial(0x0284c7)
    );
    tapeBand.rotation.x = Math.PI / 2;
    reel.add(tapeBand);

    // 3 metallic spokes so rotation reads crisply
    for (let s = 0; s < 3; s += 1) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.06, 0.18),
        materials.createToonMaterial(0x334155)
      );
      spoke.rotation.z = (s * Math.PI) / 3;
      reel.add(spoke);
    }

    // Center hub pin
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.22, 12),
      materials.createToonMaterial(0xf59e0b)
    );
    hub.rotation.x = Math.PI / 2;
    reel.add(hub);

    reel.position.set(rx, ry, -0.18);
    group.add(reel);
    reels.push(reel);
  }

  // Industrial Twin-Roller Ribbon Shredder (right side of rig)
  const shredderGroup = new THREE.Group();
  shredderGroup.position.set(1.25, 0, 0.1);

  const shredderBin = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 1.15, 1.15),
    materials.createToonMaterial(0x1e293b)
  );
  shredderBin.position.y = 0.575;
  shredderBin.castShadow = true;
  addAnimeInkEdges(shredderBin, materials.inkLineMaterial, 24);
  shredderGroup.add(shredderBin);

  // Hazard yellow-and-black throat frame
  const throatFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.66, 0.36, 1.24),
    materials.createToonMaterial(0xd97706)
  );
  throatFrame.position.y = 1.32;
  addAnimeInkEdges(throatFrame, materials.inkLineMaterial, 24);
  shredderGroup.add(throatFrame);

  // Twin rotating steel cutter rollers
  const rollerGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.3, 12);
  const rollerMat = materials.createToonMaterial(0x94a3b8);
  const rollerL = new THREE.Mesh(rollerGeo, rollerMat);
  rollerL.rotation.z = Math.PI / 2;
  rollerL.position.set(0, 1.38, -0.18);
  addAnimeInkEdges(rollerL, materials.inkLineMaterial, 22);
  shredderGroup.add(rollerL);

  const rollerR = new THREE.Mesh(rollerGeo, rollerMat);
  rollerR.rotation.z = Math.PI / 2;
  rollerR.position.set(0, 1.38, 0.18);
  addAnimeInkEdges(rollerR, materials.inkLineMaterial, 22);
  shredderGroup.add(rollerR);

  // Translucent cutaway upper shredder hood
  const shredderHood = new THREE.Mesh(
    new THREE.BoxGeometry(1.58, 0.62, 1.18),
    new THREE.MeshToonMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.72,
    })
  );
  shredderHood.position.y = 1.8;
  addAnimeInkEdges(shredderHood, materials.inkLineMaterial, 24);
  shredderGroup.add(shredderHood);

  // Overflowing silver shredded ribbon confetti heap inside/above bin front
  const ribbonHeap = new THREE.Group();
  ribbonHeap.position.set(0, 0.12, 0.58);
  for (let r = 0; r < 14; r += 1) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.045, 0.14),
      materials.createToonMaterial(r % 3 === 0 ? 0x38bdf8 : 0xe2e8f0)
    );
    strip.position.set(
      ((r % 5) - 2) * 0.24,
      Math.floor(r / 5) * 0.08 + 0.04,
      (r % 2) * 0.14
    );
    strip.rotation.set(0.2 * r, 0.7 * r, 0.35 * (r % 3));
    ribbonHeap.add(strip);
  }
  ribbonHeap.scale.set(0.01, 0.01, 0.01);
  shredderGroup.add(ribbonHeap);

  group.add(shredderGroup);

  // Glass-Cased Green Emergency Recovery Lever (front-left pedestal)
  const leverBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.84, 0.32),
    materials.createToonMaterial(0x1e293b)
  );
  leverBox.position.set(-2.05, 1.15, 0.35);
  addAnimeInkEdges(leverBox, materials.inkLineMaterial, 24);
  group.add(leverBox);

  const recoveryLeverIntact = new THREE.Group();
  recoveryLeverIntact.position.set(-2.05, 1.15, 0.54);
  const leverStem = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.52, 0.1),
    materials.createToonMaterial(0x10b981)
  );
  leverStem.position.y = 0.24;
  recoveryLeverIntact.add(leverStem);
  const leverKnob = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 12, 12),
    materials.createToonMaterial(0x34d399)
  );
  leverKnob.position.y = 0.52;
  recoveryLeverIntact.add(leverKnob);
  group.add(recoveryLeverIntact);

  // Broken lever lying on floor once snapped
  const recoveryLeverBroken = new THREE.Group();
  recoveryLeverBroken.position.set(-2.05, 0.08, 0.92);
  const brokenStem = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.1, 0.1),
    materials.createToonMaterial(0xef4444)
  );
  brokenStem.rotation.y = 0.42;
  recoveryLeverBroken.add(brokenStem);
  recoveryLeverBroken.visible = false;
  group.add(recoveryLeverBroken);

  const backupLampMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const backupLamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), backupLampMat);
  backupLamp.position.set(-0.7, 3.22, -0.35);
  group.add(backupLamp);

  const signTex = createArchiveSignTexture(
    'BACKUP ARCHIVE REELS',
    '4 SAFETY SNAPSHOTS · RECOVERY LEVER',
    '#0f172a',
    '#38bdf8',
    '#e0f2fe',
    '#94a3b8'
  );
  textures.push(signTex);
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.25, 0.44),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  sign.position.set(-0.7, 0.48, 0.56);
  group.add(sign);

  return {
    group,
    reels,
    shredderRollers: [rollerL, rollerR],
    shredderHood,
    ribbonHeap,
    recoveryLeverIntact,
    recoveryLeverBroken,
    backupLampMat,
    textures,
  };
}

export interface FourVaultFilingWallRig {
  group: THREE.Group;
  glassDoors: THREE.Mesh[];
  ledgerHeaderMats: THREE.MeshToonMaterial[];
  gantryArms: THREE.Group[];
  padlocks: THREE.Group[];
  textures: THREE.Texture[];
}

/**
 * 4 Glass-Fronted Filing Vaults + Striped Ledgers (Top 15% Header Scorch vs Bottom 85% White) +
 * 4 Synchronized Overhead Pneumatic Stamping Arms (Rear-Cantilevered z <= -2.2) +
 * 4 Heavy Cast-Iron Crimson Padlocks (Step 3).
 */
export function buildFourVaultFilingWallAndGantry(
  materials: AnimeMaterialLibrary
): FourVaultFilingWallRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  group.add(createArchiveContactShadow(materials, 3.3, 1.35));

  const glassDoors: THREE.Mesh[] = [];
  const ledgerHeaderMats: THREE.MeshToonMaterial[] = [];
  const gantryArms: THREE.Group[] = [];
  const padlocks: THREE.Group[] = [];

  // Rear-cantilevered steel gantry rail strictly behind vaults (z = -1.25 local)
  const gantryRail = new THREE.Mesh(
    new THREE.BoxGeometry(6.3, 0.28, 0.34),
    materials.createToonMaterial(0x334155)
  );
  gantryRail.position.set(0, 3.88, -0.78);
  addAnimeInkEdges(gantryRail, materials.inkLineMaterial, 24);
  group.add(gantryRail);

  for (const sx of [-2.95, 2.95]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 3.9, 0.28),
      materials.createToonMaterial(0x475569)
    );
    post.position.set(sx, 1.95, -0.78);
    addAnimeInkEdges(post, materials.inkLineMaterial, 24);
    group.add(post);
  }

  const vaultOffsets = [-2.1, -0.7, 0.7, 2.1];

  for (let i = 0; i < 4; i += 1) {
    const vx = vaultOffsets[i];
    const vault = new THREE.Group();
    vault.position.set(vx, 0, 0);

    // Steel cabinet shell (back + sides + bottom + top)
    const cabBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 2.38, 0.14),
      materials.createToonMaterial(0x475569)
    );
    cabBack.position.set(0, 1.19, -0.48);
    addAnimeInkEdges(cabBack, materials.inkLineMaterial, 24);
    vault.add(cabBack);

    const cabBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.18, 1.04),
      materials.createToonMaterial(0x334155)
    );
    cabBase.position.set(0, 0.09, 0);
    vault.add(cabBase);

    const cabTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.14, 1.04),
      materials.createToonMaterial(0x334155)
    );
    cabTop.position.set(0, 2.32, 0);
    vault.add(cabTop);

    for (const sideX of [-0.55, 0.55]) {
      const side = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 2.24, 1.0),
        materials.createToonMaterial(0x64748b)
      );
      side.position.set(sideX, 1.19, 0);
      vault.add(side);
    }

    // Crisp Ivory Paper Ledger Stack — BOTTOM 85% ALWAYS STAYS CLEAN WHITE (Intermittent Head-Only Proof!)
    const ledgerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 1.38, 0.68),
      materials.createToonMaterial(0xf8fafc)
    );
    ledgerBody.position.set(0, 0.88, -0.02);
    addAnimeInkEdges(ledgerBody, materials.inkLineMaterial, 28);
    vault.add(ledgerBody);

    // Horizontal page grooves on untouched lower body
    for (let p = 0; p < 3; p += 1) {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(0.88, 0.025, 0.7),
        materials.createToonMaterial(0xcbd5e1)
      );
      groove.position.set(0, 0.45 + p * 0.36, -0.02);
      vault.add(groove);
    }

    // TOP 15% HEADER BAND (First 4 KB-64 KB) — scorches glowing crimson when stamped!
    const headerMat = materials.createToonMaterial(0xe0f2fe);
    const ledgerHeader = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.28, 0.71),
      headerMat
    );
    ledgerHeader.position.set(0, 1.72, -0.02);
    addAnimeInkEdges(ledgerHeader, materials.inkLineMaterial, 24);
    vault.add(ledgerHeader);
    ledgerHeaderMats.push(headerMat);

    // Translucent Glass Front Door (fades in Cutaway OPEN)
    const glassDoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.06, 2.08, 0.05),
      new THREE.MeshToonMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.34,
      })
    );
    glassDoor.position.set(0, 1.2, 0.5);
    addAnimeInkEdges(glassDoor, materials.inkLineMaterial, 24);
    vault.add(glassDoor);
    glassDoors.push(glassDoor);

    // Heavy Cast-Iron Crimson Padlock (.lockbit)
    const padlock = new THREE.Group();
    const lockBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.44, 0.22),
      materials.createToonMaterial(0xdc2626)
    );
    addAnimeInkEdges(lockBody, materials.inkLineMaterial, 24);
    addInvertedHullOutline(lockBody, 0.025);
    padlock.add(lockBody);

    const shackle = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.045, 10, 18, Math.PI),
      materials.createToonMaterial(0xfbbf24)
    );
    shackle.position.y = 0.21;
    padlock.add(shackle);

    const keyhole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.24, 10),
      materials.createToonMaterial(0x0f172a)
    );
    keyhole.rotation.x = Math.PI / 2;
    padlock.add(keyhole);

    padlock.position.set(0, 1.16, 0.65);
    padlock.scale.set(0.01, 0.01, 0.01);
    vault.add(padlock);
    padlocks.push(padlock);

    group.add(vault);

    // Overhead Pneumatic Stamping Arm (IOCP worker thread)
    const armGroup = new THREE.Group();
    armGroup.position.set(vx, 3.68, 0);

    const carriage = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.32, 0.96),
      materials.createToonMaterial(0x1e293b)
    );
    carriage.position.z = -0.35;
    addAnimeInkEdges(carriage, materials.inkLineMaterial, 24);
    armGroup.add(carriage);

    const pistonRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 1.25, 12),
      materials.createToonMaterial(0xf59e0b)
    );
    pistonRod.position.y = -0.55;
    armGroup.add(pistonRod);

    const stampHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.16, 0.56),
      materials.createToonMaterial(0xdc2626)
    );
    stampHead.position.y = -1.16;
    addAnimeInkEdges(stampHead, materials.inkLineMaterial, 24);
    armGroup.add(stampHead);

    group.add(armGroup);
    gantryArms.push(armGroup);
  }

  return { group, glassDoors, ledgerHeaderMats, gantryArms, padlocks, textures };
}

export interface GlassEntranceRansomRig {
  group: THREE.Group;
  placardGroup: THREE.Group;
  pressArm: THREE.Group;
  monitorMat: THREE.MeshBasicMaterial;
  monitorNormalTex: THREE.CanvasTexture;
  monitorRansomTex: THREE.CanvasTexture;
  textures: THREE.Texture[];
}

/**
 * Frosted Glass Entrance Door + Mechanical Placard Press Bolting Red Extortion Notice +
 * Wall Display Monitor Flipping Crimson (Step 4).
 */
export function buildGlassEntranceAndRansomPress(
  materials: AnimeMaterialLibrary
): GlassEntranceRansomRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  group.add(createArchiveContactShadow(materials, 1.35, 0.9));

  // Brushed aluminum doorway frame
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 3.15, 0.18),
    materials.createToonMaterial(0x334155)
  );
  doorFrame.position.set(0, 1.575, 0);
  addAnimeInkEdges(doorFrame, materials.inkLineMaterial, 24);
  group.add(doorFrame);

  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(1.64, 2.86, 0.08),
    new THREE.MeshToonMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.55,
    })
  );
  glassPane.position.set(0, 1.575, 0.04);
  group.add(glassPane);

  // Extortion Notice Placard bolted onto the front glass
  const placardGroup = new THREE.Group();
  const placardTex = createArchiveSignTexture(
    'VAULT LOCKED',
    'EXTORTION NOTICE BOLTED TO DOOR',
    '#7f1d1d',
    '#ef4444',
    '#fef2f2',
    '#fca5a5'
  );
  textures.push(placardTex);

  const placardBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 0.72, 0.08),
    materials.createToonMaterial(0x991b1b)
  );
  addAnimeInkEdges(placardBoard, materials.inkLineMaterial, 24);
  addInvertedHullOutline(placardBoard, 0.025);
  placardGroup.add(placardBoard);

  const placardFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.34, 0.64),
    new THREE.MeshBasicMaterial({ map: placardTex })
  );
  placardFace.position.z = 0.045;
  placardGroup.add(placardFace);

  placardGroup.position.set(0, 1.75, 0.85);
  placardGroup.scale.set(0.01, 0.01, 0.01);
  group.add(placardGroup);

  // Mechanical nail-gun press arm swinging from right
  const pressArm = new THREE.Group();
  pressArm.position.set(1.05, 1.75, 0.35);
  const armBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.14, 0.14),
    materials.createToonMaterial(0xf59e0b)
  );
  armBar.position.x = -0.45;
  pressArm.add(armBar);
  group.add(pressArm);

  // Wall Monitor mounted high beside the entrance (Wallpaper hijack)
  const monitorNormalTex = createArchiveSignTexture(
    'RECORDS LOBBY DISPLAY',
    'NORMAL OPERATIONS · OPEN ACCESS',
    '#0f172a',
    '#38bdf8',
    '#e0f2fe',
    '#94a3b8'
  );
  const monitorRansomTex = createArchiveSignTexture(
    'ALL LEDGERS LOCKED',
    'CONTACT EXTORTION PORTAL FOR KEY',
    '#450a0a',
    '#ef4444',
    '#fecaca',
    '#fde047'
  );
  textures.push(monitorNormalTex, monitorRansomTex);

  const monitorMat = new THREE.MeshBasicMaterial({ map: monitorNormalTex });
  const monitorHousing = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.95, 0.14),
    materials.createToonMaterial(0x1e293b)
  );
  monitorHousing.position.set(0, 3.65, -0.05);
  addAnimeInkEdges(monitorHousing, materials.inkLineMaterial, 24);
  group.add(monitorHousing);

  const monitorScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.58, 0.78), monitorMat);
  monitorScreen.position.set(0, 3.65, 0.04);
  group.add(monitorScreen);

  return {
    group,
    placardGroup,
    pressArm,
    monitorMat,
    monitorNormalTex,
    monitorRansomTex,
    textures,
  };
}
