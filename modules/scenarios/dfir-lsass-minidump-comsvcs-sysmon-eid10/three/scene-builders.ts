import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createVaultSignTexture(
  headline: string,
  subline: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 240;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 1024, 240);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 996, 212);

  ctx.fillStyle = accentHex;
  ctx.fillRect(14, 14, 996, 14);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
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

export function createPolaroidNegativeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // White Polaroid instant film border
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 512, 512);

  // Dark X-ray negative plate
  ctx.fillStyle = '#0B1120';
  ctx.fillRect(36, 36, 440, 356);

  // Glowing X-ray grid of safe-deposit boxes
  ctx.strokeStyle = '#F43F5E';
  ctx.lineWidth = 4;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.strokeRect(64 + col * 134, 72 + row * 124, 114, 96);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
      ctx.fillRect(68 + col * 134, 76 + row * 124, 106, 88);
    }
  }

  ctx.fillStyle = '#FDE68A';
  ctx.font = '900 30px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MDMP 4D 44 4D 50', 256, 356);

  ctx.fillStyle = '#0F172A';
  ctx.font = '900 32px "JetBrains Mono", monospace';
  ctx.fillText('debug.dmp · 48.2 MB', 256, 456);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBoothScreenTexture(
  topLine = 'SYSMON EID 10 · PROCESS ACCESS',
  midLine = '0x1010 -> lsass.exe (PID 684)',
  botLine = 'comsvcs.dll | dbgcore.dll'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 492, 236);

  ctx.fillStyle = '#E9D5FF';
  ctx.font = '900 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(topLine, 256, 68);

  ctx.fillStyle = '#F43F5E';
  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.fillText(midLine, 256, 134);

  ctx.fillStyle = '#FDE68A';
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText(botLine, 256, 198);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface VaultHallBackdropRig {
  group: THREE.Group;
  textures: THREE.Texture[];
}

export function buildBankVaultHallBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'ARMORED BANK SAFE-DEPOSIT VAULT HALL',
  subline = 'INSPECTOR BADGE  ·  X-RAY PHOTOGRAPHER  ·  GLASS GUARD BOOTH',
  accentHex = '#38BDF8'
): VaultHallBackdropRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Continuous solid sub-floor (y = -0.25 -> top at y = 0)
  const subFloor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 13),
    materials.createToonMaterial(0x0f172a)
  );
  subFloor.position.set(0, -0.25, -0.6);
  subFloor.receiveShadow = true;
  group.add(subFloor);

  // Left half: Warm slate bank lobby marble floor (y = 0.03)
  const leftMarble = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.06, 9.6),
    materials.createToonMaterial(0x1e293b)
  );
  leftMarble.position.set(-5.3, 0.03, -0.2);
  leftMarble.receiveShadow = true;
  addAnimeInkEdges(leftMarble, materials.inkLineMaterial);
  group.add(leftMarble);

  // Right half: Brushed vault platinum-steel floor deck (y = 0.03)
  const rightSteel = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.06, 9.6),
    materials.createToonMaterial(0x334155)
  );
  rightSteel.position.set(5.3, 0.03, -0.2);
  rightSteel.receiveShadow = true;
  addAnimeInkEdges(rightSteel, materials.inkLineMaterial);
  group.add(rightSteel);

  // Brass aisle guide track connecting Desk -> Photographer Cart -> Safe-Deposit Vault (disjoint y = 0.075)
  const brassRunner = new THREE.Mesh(
    new THREE.BoxGeometry(14.8, 0.04, 1.4),
    materials.createToonMaterial(0xd97706)
  );
  brassRunner.position.set(0, 0.075, 0.15);
  addAnimeInkEdges(brassRunner, materials.inkLineMaterial);
  group.add(brassRunner);

  // Rear marble bank hall wall (strictly behind z <= -3.0)
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x1e293b)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  // Architectural marble pilasters framing the central vault hall bay (front face at z = -2.84)
  const pilasterMat = materials.createToonMaterial(0x475569);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), pilasterMat);
    pilaster.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(pilaster, materials.inkLineMaterial);
    group.add(pilaster);
  }

  // Overhead rear signboard mounted cleanly in front of pilasters (z = -2.56, matching 4.27:1 texture aspect)
  const signTex = createVaultSignTexture(headline, subline, accentHex);
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

export interface InspectorBadgeDeskRig {
  group: THREE.Group;
  badgeGroup: THREE.Group;
  badgeHalo: THREE.Mesh;
  pidPlaque: THREE.Mesh;
}

export function buildInspectorBadgeDesk(
  materials: AnimeMaterialLibrary
): InspectorBadgeDeskRig {
  const group = new THREE.Group();

  // Heavy mahogany & steel administrative desk grounded flush at y = 0
  const deskBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.08, 1.65),
    materials.createToonMaterial(0x451a03)
  );
  deskBody.position.set(0, 0.54, 0);
  addAnimeInkEdges(deskBody, materials.inkLineMaterial);
  group.add(deskBody);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.82, 0.14, 1.85),
    materials.createToonMaterial(0x92400e)
  );
  deskTop.position.set(0, 1.15, 0);
  addAnimeInkEdges(deskTop, materials.inkLineMaterial);
  group.add(deskTop);

  // Brass corner trim rails
  const brassMat = materials.createToonMaterial(0xf59e0b);
  for (const bx of [-1.28, 1.28]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 1.68), brassMat);
    rail.position.set(bx, 0.55, 0);
    group.add(rail);
  }

  // Elevated Golden Inspector Badge (SeDebugPrivilege) hovering over velvet cushion
  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.16, 0.95),
    materials.createToonMaterial(0x881337)
  );
  cushion.position.set(-0.52, 1.3, 0.08);
  addAnimeInkEdges(cushion, materials.inkLineMaterial);
  group.add(cushion);

  const badgeGroup = new THREE.Group();
  badgeGroup.position.set(-0.52, 1.72, 0.08);

  const shieldHex = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.42, 0.14, 6),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
    })
  );
  shieldHex.rotation.x = Math.PI / 2;
  addInvertedHullOutline(shieldHex, materials.inkOutlineMaterial, 1.055);
  badgeGroup.add(shieldHex);

  const badgeStar = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.2, 0),
    materials.createToonMaterial(0xfef08a, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.65,
    })
  );
  badgeStar.position.set(0, 0, 0.1);
  badgeGroup.add(badgeStar);

  const badgeHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.045, 10, 28),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.15,
    })
  );
  badgeGroup.add(badgeHalo);
  group.add(badgeGroup);

  // Cyan Vault Directory Plaque (PID 684) mounted on right half of desk
  const plaqueStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.12, 0.52),
    materials.createToonMaterial(0x334155)
  );
  plaqueStand.position.set(0.68, 1.28, -0.05);
  group.add(plaqueStand);

  const pidPlaque = new THREE.Mesh(
    new THREE.BoxGeometry(0.96, 0.62, 0.08),
    materials.createToonMaterial(0x0284c7, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.4,
    })
  );
  pidPlaque.position.set(0.68, 1.65, -0.08);
  pidPlaque.rotation.x = -0.18;
  addAnimeInkEdges(pidPlaque, materials.inkLineMaterial);
  group.add(pidPlaque);

  return { group, badgeGroup, badgeHalo, pidPlaque };
}

export interface VaultPhotographerRig {
  group: THREE.Group;
  cameraHead: THREE.Group;
  apertureRing: THREE.Mesh;
  flashBulb: THREE.Mesh;
  xrayCone: THREE.Mesh;
  polaroidCard: THREE.Mesh;
  courierEnvelope: THREE.Group;
  textures: THREE.Texture[];
}

export function buildVaultPhotographerCart(
  materials: AnimeMaterialLibrary
): VaultPhotographerRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Rolling brass-and-slate camera dolly cart grounded flush at y = 0
  const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16);
  const wheelMat = materials.createToonMaterial(0x1e293b);
  for (const wx of [-0.95, 0.95]) {
    for (const wz of [-0.62, 0.62]) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.22, wz);
      addAnimeInkEdges(wheel, materials.inkLineMaterial);
      group.add(wheel);
    }
  }

  const cartDeck = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 0.18, 1.55),
    materials.createToonMaterial(0x475569)
  );
  cartDeck.position.set(0, 0.44, 0);
  addAnimeInkEdges(cartDeck, materials.inkLineMaterial);
  group.add(cartDeck);

  // Brass tripod column supporting the certified X-ray camera (comsvcs.dll)
  const brassMat = materials.createToonMaterial(0xd97706);
  const brightBrass = materials.createToonMaterial(0xf59e0b);
  const pedestalCol = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.28, 1.52, 16),
    brassMat
  );
  pedestalCol.position.set(0.32, 1.26, 0);
  addAnimeInkEdges(pedestalCol, materials.inkLineMaterial);
  group.add(pedestalCol);

  // Certified X-Ray Camera Housing pointing right (+X) toward the circular steel vault door
  const cameraHead = new THREE.Group();
  cameraHead.position.set(0.32, 2.24, 0);

  const cameraBox = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.92, 0.96),
    materials.createToonMaterial(0x1e293b)
  );
  addInvertedHullOutline(cameraBox, materials.inkOutlineMaterial, 1.035);
  cameraHead.add(cameraBox);

  // Brass top trim & viewfinder
  const topTrim = new THREE.Mesh(
    new THREE.BoxGeometry(1.24, 0.14, 1.02),
    brightBrass
  );
  topTrim.position.set(0, 0.5, 0);
  addAnimeInkEdges(topTrim, materials.inkLineMaterial);
  cameraHead.add(topTrim);

  // Lens barrel facing right (+X)
  const lensBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.38, 0.56, 20),
    materials.createToonMaterial(0x334155)
  );
  lensBarrel.rotation.z = Math.PI / 2;
  lensBarrel.position.set(0.76, 0, 0);
  addAnimeInkEdges(lensBarrel, materials.inkLineMaterial);
  cameraHead.add(lensBarrel);

  // Rotating brass aperture iris ring (widens on OpenProcess 0x1010)
  const apertureRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.07, 12, 24),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.35,
    })
  );
  apertureRing.rotation.y = Math.PI / 2;
  apertureRing.position.set(1.04, 0, 0);
  cameraHead.add(apertureRing);

  // Overhead crimson X-ray flash lamp
  const flashBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.25,
    })
  );
  flashBulb.position.set(0.28, 0.78, 0);
  cameraHead.add(flashBulb);

  // Volumetric crimson X-Ray scan beam extending rightward (+X) into the safe-deposit vault
  const xrayCone = new THREE.Mesh(
    new THREE.ConeGeometry(1.22, 3.25, 24, 1, true),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    })
  );
  (xrayCone.material as THREE.MeshToonMaterial).depthWrite = false;
  xrayCone.rotation.z = Math.PI / 2;
  xrayCone.position.set(2.68, 0, 0);
  xrayCone.visible = false;
  cameraHead.add(xrayCone);

  group.add(cameraHead);

  // Attached corridor packing tray on the left (-X) side of the cart receiving the Polaroid negative
  const trayTable = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.12, 1.25),
    materials.createToonMaterial(0xb45309)
  );
  trayTable.position.set(-0.72, 1.32, 0);
  addAnimeInkEdges(trayTable, materials.inkLineMaterial);
  group.add(trayTable);

  const trayLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.82, 0.16),
    materials.createToonMaterial(0x334155)
  );
  trayLeg.position.set(-0.72, 0.9, 0);
  group.add(trayLeg);

  // Instant Polaroid X-ray Negative Card (debug.dmp MDMP)
  const negTex = createPolaroidNegativeTexture();
  textures.push(negTex);
  const polaroidCard = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.04, 0.68),
    materials.createToonMaterial(0xffffff, { map: negTex })
  );
  polaroidCard.position.set(-0.22, 1.44, 0.08);
  polaroidCard.visible = false;
  addAnimeInkEdges(polaroidCard, materials.inkLineMaterial);
  group.add(polaroidCard);

  // Unlabeled kraft courier envelope sitting on the packing tray
  const courierEnvelope = new THREE.Group();
  courierEnvelope.position.set(-0.92, 1.44, -0.05);
  const envBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.1, 0.88),
    materials.createToonMaterial(0xd97706)
  );
  addAnimeInkEdges(envBody, materials.inkLineMaterial);
  courierEnvelope.add(envBody);
  const envFlap = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.05, 0.84),
    materials.createToonMaterial(0xf59e0b)
  );
  envFlap.position.set(0.32, 0.06, 0);
  courierEnvelope.add(envFlap);
  group.add(courierEnvelope);

  return {
    group,
    cameraHead,
    apertureRing,
    flashBulb,
    xrayCone,
    polaroidCard,
    courierEnvelope,
    textures,
  };
}

export interface SafeDepositVaultRig {
  group: THREE.Group;
  cutawayWallPivot: THREE.Group;
  vaultWheel: THREE.Group;
  credentialDrawers: THREE.Mesh[];
  pplBlastShield: THREE.Mesh;
}

export function buildSafeDepositVaultDoor(
  materials: AnimeMaterialLibrary
): SafeDepositVaultRig {
  const group = new THREE.Group();

  // Solid armored vault plinth grounded flush at y = 0
  const basePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(3.15, 0.42, 2.55),
    materials.createToonMaterial(0x1e293b)
  );
  basePlinth.position.set(0, 0.21, 0);
  addAnimeInkEdges(basePlinth, materials.inkLineMaterial);
  group.add(basePlinth);

  // Armored rear & right steel vault walls
  const steelMat = materials.createToonMaterial(0x475569);
  const darkSteel = materials.createToonMaterial(0x334155);

  const rearWall = new THREE.Mesh(new THREE.BoxGeometry(2.95, 3.6, 0.26), darkSteel);
  rearWall.position.set(0, 2.22, -1.08);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.6, 2.38), steelMat);
  rightWall.position.set(1.36, 2.22, 0);
  addAnimeInkEdges(rightWall, materials.inkLineMaterial);
  group.add(rightWall);

  // Heavy top vault lintel
  const topSlab = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.36, 2.48), darkSteel);
  topSlab.position.set(0, 4.18, 0);
  addAnimeInkEdges(topSlab, materials.inkLineMaterial);
  group.add(topSlab);

  // 6 Glowing Golden VIP Safe-Deposit Boxes inside the vault (lsasrv / msv1_0 / kerberos credentials)
  const credentialDrawers: THREE.Mesh[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const drawer = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.62, 0.72),
        materials.createToonMaterial(0xf59e0b, {
          emissive: 0xd97706,
          emissiveIntensity: 0.35,
        })
      );
      drawer.position.set(-0.32 + col * 0.98, 1.05 + row * 0.88, -0.35);
      addAnimeInkEdges(drawer, materials.inkLineMaterial);
      group.add(drawer);
      credentialDrawers.push(drawer);
    }
  }

  // Circular Brushed-Steel Vault Wheel mounted on the left face (-X) facing the photographer
  const vaultWheel = new THREE.Group();
  vaultWheel.position.set(-1.42, 2.2, 0.05);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.14, 12, 28),
    materials.createToonMaterial(0x94a3b8)
  );
  rim.rotation.y = Math.PI / 2;
  addInvertedHullOutline(rim, materials.inkOutlineMaterial, 1.04);
  vaultWheel.add(rim);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.24, 16),
    materials.createToonMaterial(0xf59e0b)
  );
  hub.rotation.z = Math.PI / 2;
  vaultWheel.add(hub);

  const spokeMat = materials.createToonMaterial(0xcbd5e1);
  for (let i = 0; i < 6; i++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.85, 8), spokeMat);
    spoke.rotation.x = (i * Math.PI) / 3;
    vaultWheel.add(spoke);
  }
  group.add(vaultWheel);

  // Hinged Front Biometric Cutaway Glass Panel (lifts upward when cutaway = OPEN / AUTO)
  const cutawayWallPivot = new THREE.Group();
  cutawayWallPivot.position.set(0, 4.0, 1.12);

  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(2.74, 3.44, 0.08),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.34,
    })
  );
  (glassPane.material as THREE.MeshToonMaterial).depthWrite = false;
  glassPane.position.set(0, -1.72, 0);
  addAnimeInkEdges(glassPane, materials.inkLineMaterial);
  cutawayWallPivot.add(glassPane);
  group.add(cutawayWallPivot);

  // Optional RunAsPPL Cyan Kernel Blast Shield (invisible by default; active in Memory Forensics hardened side)
  const pplBlastShield = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 3.45, 2.25),
    materials.createToonMaterial(0x06b6d4, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.65,
    })
  );
  (pplBlastShield.material as THREE.MeshToonMaterial).depthWrite = false;
  pplBlastShield.position.set(-1.62, 2.2, 0.05);
  pplBlastShield.visible = false;
  addAnimeInkEdges(pplBlastShield, materials.inkLineMaterial);
  group.add(pplBlastShield);

  return {
    group,
    cutawayWallPivot,
    vaultWheel,
    credentialDrawers,
    pplBlastShield,
  };
}

export interface GuardBoothRig {
  group: THREE.Group;
  beaconDome: THREE.Mesh;
  screenMesh: THREE.Mesh;
  callTraceBeam: THREE.Mesh;
  textures: THREE.Texture[];
}

export function buildGlassGuardBooth(
  materials: AnimeMaterialLibrary
): GuardBoothRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Raised steel booth base grounded cleanly
  const boothBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 1.25, 1.65),
    materials.createToonMaterial(0x1e293b)
  );
  boothBase.position.set(0, 0.625, 0);
  addAnimeInkEdges(boothBase, materials.inkLineMaterial);
  group.add(boothBase);

  // Glass observation enclosure frame
  const glassWalls = new THREE.Mesh(
    new THREE.BoxGeometry(2.42, 1.38, 1.52),
    materials.createToonMaterial(0xc4b5fd, {
      transparent: true,
      opacity: 0.28,
    })
  );
  (glassWalls.material as THREE.MeshToonMaterial).depthWrite = false;
  glassWalls.position.set(0, 1.94, 0);
  addAnimeInkEdges(glassWalls, materials.inkLineMaterial);
  group.add(glassWalls);

  const boothRoof = new THREE.Mesh(
    new THREE.BoxGeometry(2.68, 0.22, 1.76),
    materials.createToonMaterial(0x334155)
  );
  boothRoof.position.set(0, 2.74, 0);
  addAnimeInkEdges(boothRoof, materials.inkLineMaterial);
  group.add(boothRoof);

  // High-contrast Sysmon EID 10 console display screen inside booth
  const screenTex = createBoothScreenTexture();
  textures.push(screenTex);
  const screenMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 0.96, 0.1),
    materials.createToonMaterial(0xffffff, { map: screenTex })
  );
  screenMesh.position.set(0, 1.88, 0.25);
  addAnimeInkEdges(screenMesh, materials.inkLineMaterial);
  group.add(screenMesh);

  // Alert beacon dome on roof (lights up crimson/violet on Sysmon EID 10)
  const beaconDome = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.3, 0.34, 16),
    materials.createToonMaterial(0x7c3aed, {
      emissive: 0xa855f7,
      emissiveIntensity: 0.35,
    })
  );
  beaconDome.position.set(0, 3.02, 0);
  addInvertedHullOutline(beaconDome, materials.inkOutlineMaterial, 1.06);
  group.add(beaconDome);

  // Volumetric violet CallTrace telemetry beam connecting booth -> photographer cart
  const callTraceBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.26, 3.2, 12, 1, true),
    materials.createToonMaterial(0x8b5cf6, {
      emissive: 0xa855f7,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    })
  );
  (callTraceBeam.material as THREE.MeshToonMaterial).depthWrite = false;
  callTraceBeam.visible = false;
  group.add(callTraceBeam);

  return { group, beaconDome, screenMesh, callTraceBeam, textures };
}
