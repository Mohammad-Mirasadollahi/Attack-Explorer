import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createHotelSignTexture(
  headline: string,
  subline: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 240;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#140f1d';
  ctx.fillRect(0, 0, 1024, 240);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 996, 212);

  ctx.fillStyle = accentHex;
  ctx.fillRect(14, 14, 996, 14);

  ctx.fillStyle = '#FEF3C7';
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

export function createBellboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c120d';
  ctx.fillRect(0, 0, 512, 384);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 492, 364);

  ctx.fillStyle = '#fde68a';
  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VIP SUITE DIRECTORY (SPN)', 256, 56);

  const entries = [
    ['MSSQLSvc/FIN-SQL01', 'svc_sql_prod', '#f43f5e'],
    ['HTTP/ERP-WEB02', 'svc_erp_app', '#38bdf8'],
    ['CIFS/BACKUP-01', 'svc_backup', '#f59e0b'],
  ];
  entries.forEach(([spn, acct, col], idx) => {
    const y = 112 + idx * 84;
    ctx.fillStyle = '#291c14';
    ctx.fillRect(28, y, 456, 66);
    ctx.strokeStyle = col;
    ctx.lineWidth = 4;
    ctx.strokeRect(28, y, 456, 66);
    ctx.fillStyle = '#fef3c7';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(spn, 44, y + 28);
    ctx.fillStyle = col;
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText(`ACCT: ${acct}`, 44, y + 52);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildHotelLobbyBackdrop(
  materials: AnimeMaterialLibrary,
  headline = 'GRAND HOTEL CONCIERGE LOBBY & TICKET DESK',
  subline = 'VIP BELLBOARD (SPN)  ·  BRASS TICKET TUBE  ·  BASEMENT BENCH',
  accentHex = '#F59E0B'
): { group: THREE.Group; textures: THREE.Texture[] } {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Solid marble sub-floor
  const subFloor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 13),
    materials.createToonMaterial(0x13111c)
  );
  subFloor.position.set(0, -0.25, -0.6);
  group.add(subFloor);

  // Cream-gold & burgundy hotel lobby carpet runner
  const lobbyFloor = new THREE.Mesh(
    new THREE.BoxGeometry(21.4, 0.06, 9.6),
    materials.createToonMaterial(0x271e30)
  );
  lobbyFloor.position.set(0, 0.03, -0.2);
  addAnimeInkEdges(lobbyFloor, materials.inkLineMaterial);
  group.add(lobbyFloor);

  const velvetRunner = new THREE.Mesh(
    new THREE.BoxGeometry(15.6, 0.04, 1.55),
    materials.createToonMaterial(0x881337)
  );
  velvetRunner.position.set(0, 0.075, 0.25);
  addAnimeInkEdges(velvetRunner, materials.inkLineMaterial);
  group.add(velvetRunner);

  // Rear grand hotel wainscot wall
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(22.4, 7.2, 0.36),
    materials.createToonMaterial(0x1f1929)
  );
  rearWall.position.set(0, 3.6, -3.2);
  addAnimeInkEdges(rearWall, materials.inkLineMaterial);
  group.add(rearWall);

  // Brass-trimmed architectural columns strictly behind signboard
  const colMat = materials.createToonMaterial(0x4a3b5c);
  for (const px of [-9.2, -4.6, 4.6, 9.2]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.6, 0.24), colMat);
    col.position.set(px, 3.3, -2.96);
    addAnimeInkEdges(col, materials.inkLineMaterial);
    group.add(col);
  }

  // Overhead hotel hall signboard cleanly in front of pilasters (4.27:1 aspect)
  const signTex = createHotelSignTexture(headline, subline, accentHex);
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

export interface SpnBellboardRig {
  group: THREE.Group;
  screen: THREE.Mesh;
  beaconLight: THREE.Mesh;
  textures: THREE.Texture[];
}

export function buildSpnBellboard(
  materials: AnimeMaterialLibrary
): SpnBellboardRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.9, 1.15),
    materials.createToonMaterial(0x451a03)
  );
  plinth.position.set(0, 0.45, 0);
  addAnimeInkEdges(plinth, materials.inkLineMaterial);
  group.add(plinth);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 1.85, 0.24),
    materials.createToonMaterial(0x78350f)
  );
  frame.position.set(0, 1.82, 0);
  addAnimeInkEdges(frame, materials.inkLineMaterial);
  group.add(frame);

  const tex = createBellboardTexture();
  textures.push(tex);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.04, 1.56),
    materials.createToonMaterial(0xffffff, { map: tex })
  );
  screen.position.set(0, 1.82, 0.14);
  group.add(screen);

  const beaconLight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.24, 14),
    materials.createToonMaterial(0xf59e0b, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
    })
  );
  beaconLight.position.set(0, 2.86, 0);
  addInvertedHullOutline(beaconLight, materials.inkOutlineMaterial, 1.06);
  group.add(beaconLight);

  return { group, screen, beaconLight, textures };
}

export interface ConciergeTicketDeskRig {
  group: THREE.Group;
  stampArm: THREE.Group;
  rc4Voucher: THREE.Mesh;
  tubeCapsule: THREE.Mesh;
}

export function buildConciergeTicketDesk(
  materials: AnimeMaterialLibrary
): ConciergeTicketDeskRig {
  const group = new THREE.Group();

  // Grand mahogany & brass concierge counter
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.25, 1.85),
    materials.createToonMaterial(0x3b1708)
  );
  counter.position.set(0, 0.625, 0);
  addAnimeInkEdges(counter, materials.inkLineMaterial);
  group.add(counter);

  const brassTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.42, 0.14, 2.02),
    materials.createToonMaterial(0xd97706)
  );
  brassTop.position.set(0, 1.32, 0);
  addAnimeInkEdges(brassTop, materials.inkLineMaterial);
  group.add(brassTop);

  // Brass concierge arch
  for (const bx of [-1.3, 1.3]) {
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.13, 1.75, 12),
      materials.createToonMaterial(0xf59e0b)
    );
    pillar.position.set(bx, 2.24, -0.55);
    addAnimeInkEdges(pillar, materials.inkLineMaterial);
    group.add(pillar);
  }
  const archBar = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 0.22, 0.28),
    materials.createToonMaterial(0xf59e0b)
  );
  archBar.position.set(0, 3.12, -0.55);
  addAnimeInkEdges(archBar, materials.inkLineMaterial);
  group.add(archBar);

  // Pneumatic tube arch entering counter left
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 2.2, 16),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.45,
    })
  );
  (tube.material as THREE.MeshToonMaterial).depthWrite = false;
  tube.rotation.z = Math.PI / 2;
  tube.position.set(-2.2, 2.05, 0);
  group.add(tube);

  const tubeCapsule = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.46, 12),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    })
  );
  tubeCapsule.rotation.z = Math.PI / 2;
  tubeCapsule.position.set(-3.1, 2.05, 0);
  group.add(tubeCapsule);

  // Mechanical brass ticket stamp arm
  const stampArm = new THREE.Group();
  stampArm.position.set(0, 2.4, 0);
  const stampHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.45, 0.6),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.5,
    })
  );
  addAnimeInkEdges(stampHead, materials.inkLineMaterial);
  stampArm.add(stampHead);
  group.add(stampArm);

  // Bronze-crimson RC4-HMAC Service Voucher
  const rc4Voucher = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.12, 0.58),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xe11d48,
      emissiveIntensity: 0.7,
    })
  );
  rc4Voucher.position.set(0.35, 1.46, 0.35);
  addInvertedHullOutline(rc4Voucher, materials.inkOutlineMaterial, 1.06);
  group.add(rc4Voucher);

  return { group, stampArm, rc4Voucher, tubeCapsule };
}

export interface SafecrackerBenchRig {
  group: THREE.Group;
  cutawayCoverPivot: THREE.Group;
  tumblers: THREE.Mesh[];
  masterKeycard: THREE.Mesh;
}

export function buildSafecrackerBench(
  materials: AnimeMaterialLibrary
): SafecrackerBenchRig {
  const group = new THREE.Group();

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 2.25, 2.15),
    materials.createToonMaterial(0x1e293b)
  );
  housing.position.set(0, 1.125, 0);
  addAnimeInkEdges(housing, materials.inkLineMaterial);
  group.add(housing);

  // Spinning brass lock tumblers (Hashcat -m 13100 GPU wheels)
  const tumblers: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16),
      materials.createToonMaterial(i === 1 ? 0xf43f5e : 0xf59e0b, {
        emissive: i === 1 ? 0xe11d48 : 0xd97706,
        emissiveIntensity: 0.55,
      })
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(-0.78 + i * 0.78, 1.4, 0.35);
    addAnimeInkEdges(wheel, materials.inkLineMaterial);
    group.add(wheel);
    tumblers.push(wheel);
  }

  // Cutaway glass shield covering basement bench
  const cutawayCoverPivot = new THREE.Group();
  cutawayCoverPivot.position.set(0, 2.25, 1.08);
  const glassFront = new THREE.Mesh(
    new THREE.BoxGeometry(2.76, 2.15, 0.08),
    materials.createToonMaterial(0x38bdf8, {
      transparent: true,
      opacity: 0.28,
    })
  );
  (glassFront.material as THREE.MeshToonMaterial).depthWrite = false;
  glassFront.position.set(0, -1.075, 0);
  cutawayCoverPivot.add(glassFront);
  group.add(cutawayCoverPivot);

  // Freshly cut Master Brass Keycard (cracked NTLM hash)
  const masterKeycard = new THREE.Mesh(
    new THREE.BoxGeometry(0.88, 0.54, 0.08),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
    })
  );
  masterKeycard.position.set(0, 2.55, 0.45);
  addInvertedHullOutline(masterKeycard, materials.inkOutlineMaterial, 1.06);
  group.add(masterKeycard);

  return { group, cutawayCoverPivot, tumblers, masterKeycard };
}

export interface SuiteVaultDoorRig {
  group: THREE.Group;
  statusLamp: THREE.Mesh;
  aesEmeraldShield: THREE.Mesh;
}

export function buildSuiteVaultDoor(
  materials: AnimeMaterialLibrary
): SuiteVaultDoorRig {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 3.35, 1.45),
    materials.createToonMaterial(0x334155)
  );
  frame.position.set(0, 1.675, 0);
  addAnimeInkEdges(frame, materials.inkLineMaterial);
  group.add(frame);

  const doorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 2.75, 0.22),
    materials.createToonMaterial(0x1e293b)
  );
  doorPanel.position.set(0, 1.55, 0.7);
  addAnimeInkEdges(doorPanel, materials.inkLineMaterial);
  group.add(doorPanel);

  const statusLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 16),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
    })
  );
  statusLamp.position.set(0, 3.55, 0.4);
  group.add(statusLamp);

  const aesEmeraldShield = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 3.1, 0.14),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.42,
    })
  );
  (aesEmeraldShield.material as THREE.MeshToonMaterial).depthWrite = false;
  aesEmeraldShield.position.set(0, 1.65, 0.96);
  aesEmeraldShield.visible = false;
  group.add(aesEmeraldShield);

  return { group, statusLamp, aesEmeraldShield };
}
