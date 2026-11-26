import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';

export function createWorkshopSignTexture(
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

export function createContactShadowDisc(
  materials: AnimeMaterialLibrary,
  radiusX: number,
  radiusZ: number
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radiusX * 2, radiusZ * 2),
    new THREE.MeshBasicMaterial({
      map: materials.contactShadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.015;
  return mesh;
}

export interface WorkshopRoomRig {
  group: THREE.Group;
  textures: THREE.Texture[];
}

/**
 * Shared studio workshop floor and rear clerestory backdrop (strictly z <= -3.6
 * so foreground camera rays are never blocked).
 */
export function buildWorkshopFloorAndBackdrop(
  materials: AnimeMaterialLibrary,
  accentHex = 0x06b6d4
): WorkshopRoomRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  // Warm sunlit concrete/oak floor slab grounded at y = 0
  const floorMat = materials.createToonMaterial(0xd6cfc2);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.36, 12.5), floorMat);
  floor.position.set(0, -0.18, -0.4);
  floor.receiveShadow = true;
  addAnimeInkEdges(floor, materials.inkLineMaterial, 28);
  group.add(floor);

  // Subtle architectural tile trim around floor perimeter
  const trimMat = materials.createToonMaterial(0x1e293b);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(20.3, 0.14, 12.8), trimMat);
  trim.position.set(0, -0.34, -0.4);
  group.add(trim);

  const grid = new THREE.GridHelper(18, 18, accentHex, 0x94a3b8);
  grid.position.set(0, 0.01, -0.4);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.24;
  group.add(grid);

  // Rear glass clerestory wall strictly behind z = -4.2 (zero camera occlusion)
  const wallMat = materials.createToonMaterial(0xcbd5e1);
  const lowerWall = new THREE.Mesh(new THREE.BoxGeometry(19.6, 2.5, 0.32), wallMat);
  lowerWall.position.set(0, 1.25, -4.4);
  lowerWall.receiveShadow = true;
  addAnimeInkEdges(lowerWall, materials.inkLineMaterial, 26);
  group.add(lowerWall);

  const steelMat = materials.createToonMaterial(0x334155);
  const upperBeam = new THREE.Mesh(new THREE.BoxGeometry(19.8, 0.32, 0.42), steelMat);
  upperBeam.position.set(0, 6.2, -4.4);
  addAnimeInkEdges(upperBeam, materials.inkLineMaterial, 26);
  group.add(upperBeam);

  // Clerestory glass panes & vertical mullions
  const glassMat = materials.createToonMaterial(0xbae6fd, {
    transparent: true,
    opacity: 0.32,
  });
  const glassBand = new THREE.Mesh(new THREE.BoxGeometry(19.2, 3.4, 0.1), glassMat);
  glassBand.position.set(0, 4.25, -4.42);
  group.add(glassBand);

  for (const x of [-9.4, -4.8, 0, 4.8, 9.4]) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.24, 6.2, 0.38), steelMat);
    mullion.position.set(x, 3.1, -4.38);
    addAnimeInkEdges(mullion, materials.inkLineMaterial, 26);
    group.add(mullion);
  }

  // Room header plaque on rear wall
  const roomSignTex = createWorkshopSignTexture(
    'PRECISION WORKSHOP · SHARED ROOM',
    'X-RAY BELT + SIDE PANEL INSIDE ONE ROOM',
    '#0F172A',
    '#06B6D4',
    '#F8FAFC',
    '#38BDF8'
  );
  textures.push(roomSignTex);
  const roomSign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 1.15),
    new THREE.MeshBasicMaterial({ map: roomSignTex })
  );
  roomSign.position.set(-4.6, 5.1, -4.18);
  group.add(roomSign);

  return { group, textures };
}

export interface XRayInspectionTunnelRig {
  group: THREE.Group;
  cutawayHood: THREE.Group;
  hatchPivot: THREE.Group;
  hatchGlassMat: THREE.MeshToonMaterial;
  boltHead: THREE.Mesh;
  rwxCavityLightMat: THREE.MeshBasicMaterial;
  dropGate: THREE.Group;
  scanCurtainMat: THREE.MeshBasicMaterial;
  statusLampMat: THREE.MeshToonMaterial;
  copperFuses: THREE.Group[];
  brassJumper: THREE.Group;
  skipOrb: THREE.Mesh;
  uvSensorMat: THREE.MeshToonMaterial;
  uvRing: THREE.Mesh;
  greenCrate: THREE.Group;
  redCanister: THREE.Group;
  textures: THREE.Texture[];
}

/**
 * Automated X-Ray Inspection Chamber (`amsi.dll!AmsiScanBuffer`) with articulated
 * steel drop-gate, bolted blue glass safety hatch, cutaway hood, 6 removable copper
 * inspection fuses, insertable 6-pin brass U-jumper, and violet UV hinge sensor.
 */
export function buildXRayInspectionTunnel(
  materials: AnimeMaterialLibrary
): XRayInspectionTunnelRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const hullMat = materials.createToonMaterial(0x1e3a5f);
  const darkMetalMat = materials.createToonMaterial(0x0f172a);
  const steelMat = materials.createToonMaterial(0x64748b);
  const beltMat = materials.createToonMaterial(0x1e293b);
  const brassMat = materials.createToonMaterial(0xd97706, {
    emissive: 0xb45309,
    emissiveIntensity: 0.25,
  });

  // Ground contact shadow
  group.add(createContactShadowDisc(materials, 3.6, 1.55));

  // Conveyor belt base bed (x: -3.2..+3.2, height: 0.95)
  const conveyorBase = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.34, 1.75), steelMat);
  conveyorBase.position.set(0, 0.78, 0);
  conveyorBase.castShadow = true;
  conveyorBase.receiveShadow = true;
  addAnimeInkEdges(conveyorBase, materials.inkLineMaterial, 26);
  group.add(conveyorBase);

  const beltTop = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.1, 1.48), beltMat);
  beltTop.position.set(0, 0.98, 0);
  beltTop.receiveShadow = true;
  addAnimeInkEdges(beltTop, materials.inkLineMaterial, 28);
  group.add(beltTop);

  // 4 conveyor legs grounded at y = 0
  for (const lx of [-2.9, -1.1, 1.1, 2.9]) {
    for (const lz of [-0.68, 0.68]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.18), darkMetalMat);
      leg.position.set(lx, 0.36, lz);
      leg.castShadow = true;
      addAnimeInkEdges(leg, materials.inkLineMaterial, 28);
      group.add(leg);
    }
  }

  // Conveyor roller cylinders along front & back
  for (let rx = -3.0; rx <= 3.01; rx += 0.75) {
    const roller = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.62, 10),
      steelMat
    );
    roller.rotation.x = Math.PI / 2;
    roller.position.set(rx, 0.92, 0);
    group.add(roller);
  }

  // Rear & lower permanent cabinet housing of X-Ray tunnel
  const rearWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.1, 0.24), hullMat);
  rearWall.position.set(0, 2.02, -0.84);
  rearWall.castShadow = true;
  addAnimeInkEdges(rearWall, materials.inkLineMaterial, 26);
  group.add(rearWall);

  // Left and right arch frames with open conveyor tunnel mouth
  for (const sideX of [-1.48, 1.48]) {
    const pillarBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.1, 0.34), hullMat);
    pillarBack.position.set(sideX, 2.02, -0.78);
    addAnimeInkEdges(pillarBack, materials.inkLineMaterial, 26);
    group.add(pillarBack);

    const pillarFront = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.1, 0.34), hullMat);
    pillarFront.position.set(sideX, 2.02, 0.78);
    addAnimeInkEdges(pillarFront, materials.inkLineMaterial, 26);
    group.add(pillarFront);

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.44, 1.9), hullMat);
    lintel.position.set(sideX, 2.86, 0);
    addAnimeInkEdges(lintel, materials.inkLineMaterial, 26);
    group.add(lintel);
  }

  // Cutaway Upper Hood (slides upward cleanly when Cutaway is OPEN/AUTO Act 3)
  const cutawayHood = new THREE.Group();
  const roofShell = new THREE.Mesh(new THREE.BoxGeometry(3.26, 0.34, 1.94), hullMat);
  roofShell.position.set(0, 3.08, 0);
  roofShell.castShadow = true;
  addAnimeInkEdges(roofShell, materials.inkLineMaterial, 26);
  cutawayHood.add(roofShell);

  const hoodSignTex = createWorkshopSignTexture(
    'X-RAY SCAN CHAMBER',
    'LIVE CIRCUIT PANEL · 0x7FF9C2142840',
    '#0F172A',
    '#38BDF8',
    '#F8FAFC',
    '#FACC15'
  );
  textures.push(hoodSignTex);
  const hoodSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.85, 0.56),
    new THREE.MeshBasicMaterial({ map: hoodSignTex })
  );
  hoodSign.position.set(0, 3.08, 0.99);
  cutawayHood.add(hoodSign);

  // Status Beacon Lamp atop hood
  const statusLampMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.75,
  });
  const statusLamp = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.28, 16),
    statusLampMat
  );
  statusLamp.position.set(1.1, 3.38, 0);
  addInvertedHullOutline(statusLamp, materials.inkOutlineMaterial, 1.07);
  cutawayHood.add(statusLamp);
  group.add(cutawayHood);

  // Volumetric X-Ray Scan Laser Curtain inside tunnel
  const scanCurtainMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const scanCurtain = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.72), scanCurtainMat);
  scanCurtain.rotation.y = Math.PI / 2;
  scanCurtain.position.set(-0.4, 1.88, 0);
  group.add(scanCurtain);

  const scanBeamStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 1.48), scanCurtainMat);
  scanBeamStrip.position.set(-0.4, 1.88, 0);
  group.add(scanBeamStrip);

  // Articulated Steel Drop-Gate Guillotine at exit side of X-Ray tunnel (x = 1.62)
  const dropGate = new THREE.Group();
  const gatePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 1.56, 1.56),
    materials.createToonMaterial(0xf8fafc, { map: materials.hazardStripeTexture })
  );
  gatePanel.castShadow = true;
  addAnimeInkEdges(gatePanel, materials.inkLineMaterial, 28);
  dropGate.add(gatePanel);

  const gateBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 1.66), darkMetalMat);
  gateBar.position.y = -0.74;
  dropGate.add(gateBar);
  dropGate.position.set(1.62, 2.86, 0); // y=2.86 raised open, y=1.78 slammed shut
  group.add(dropGate);

  // ---- FRONT-FACING 6-PIN CIRCUIT BAY (The Heart of the AMSI Bypass) ----
  const bayBackMat = materials.createToonMaterial(0x0f172a);
  const circuitBay = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.38, 0.34), bayBackMat);
  circuitBay.position.set(0, 1.98, 0.74);
  addAnimeInkEdges(circuitBay, materials.inkLineMaterial, 26);
  group.add(circuitBay);

  // Inner RWX cavity glow frame (lights up bright amber during VirtualProtect 0x40)
  const rwxCavityLightMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.0,
    toneMapped: false,
  });
  const rwxCavityFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 1.18, 0.05),
    rwxCavityLightMat
  );
  rwxCavityFrame.position.set(0, 1.98, 0.90);
  group.add(rwxCavityFrame);

  // Brass serial plaque mounted beneath circuit bay
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.08), brassMat);
  plaque.position.set(0, 1.18, 0.92);
  addAnimeInkEdges(plaque, materials.inkLineMaterial, 26);
  group.add(plaque);

  // 6 Vertical Fuse Sockets + 6 Individually Animated Glowing Copper Fuses
  const socketMat = materials.createToonMaterial(0x334155);
  const copperFuseMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x06b6d4,
    emissiveIntensity: 0.85,
  });
  const copperCapMat = materials.createToonMaterial(0xea580c);

  const copperFuses: THREE.Group[] = [];
  for (let i = 0; i < 6; i += 1) {
    const fx = -0.82 + i * 0.328;

    // Upper & lower brass socket clips
    const topClip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.18), socketMat);
    topClip.position.set(fx, 2.34, 0.94);
    group.add(topClip);

    const botClip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.18), socketMat);
    botClip.position.set(fx, 1.62, 0.94);
    group.add(botClip);

    // Animated copper fuse pin
    const fuse = new THREE.Group();
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.56, 12), copperFuseMat);
    fuse.add(core);
    const capT = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 12), copperCapMat);
    capT.position.y = 0.28;
    fuse.add(capT);
    const capB = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 12), copperCapMat);
    capB.position.y = -0.28;
    fuse.add(capB);
    fuse.position.set(fx, 1.98, 0.98);
    group.add(fuse);
    copperFuses.push(fuse);
  }

  // Insertable 6-Pin Solid Brass U-Shaped Short-Circuit Jumper (`B8 57 00 07 80 C3`)
  const brassJumper = new THREE.Group();
  const jumperBarMat = materials.createToonMaterial(0xfacc15, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.65,
  });
  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.22, 0.22), jumperBarMat);
  crossbar.position.set(0, 0.14, 0);
  addAnimeInkEdges(crossbar, materials.inkLineMaterial, 24);
  brassJumper.add(crossbar);

  // U-loop short-circuit bypass arch on front of jumper bar
  const uLoop = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.055, 8, 24, Math.PI),
    jumperBarMat
  );
  uLoop.position.set(0, 0.22, 0.12);
  brassJumper.add(uLoop);

  for (let i = 0; i < 6; i += 1) {
    const px = -0.82 + i * 0.328;
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.44, 10), brassMat);
    pin.position.set(px, -0.14, 0);
    brassJumper.add(pin);
  }
  brassJumper.position.set(0, 2.02, 1.02);
  brassJumper.visible = false;
  group.add(brassJumper);

  // Amber SKIP Bounce Orb (bounces harmlessly off the seated brass jumper in Act 4)
  const skipOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, toneMapped: false })
  );
  skipOrb.position.set(0, 2.0, 1.24);
  skipOrb.visible = false;
  group.add(skipOrb);

  // Hinged Blue Glass Safety Hatch (pivots on left hinge x = -1.16, swings 0..105 deg)
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(-1.16, 1.98, 1.12);

  const hatchGlassMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.32,
    transparent: true,
    opacity: 0.46,
  });
  const glassPane = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.32, 0.07), hatchGlassMat);
  glassPane.position.set(1.16, 0, 0);
  addAnimeInkEdges(glassPane, materials.inkLineMaterial, 28);
  hatchPivot.add(glassPane);

  // Hatch outer metal frame bars
  const frameBarT = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.1, 0.11), steelMat);
  frameBarT.position.set(1.16, 0.66, 0);
  hatchPivot.add(frameBarT);
  const frameBarB = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.1, 0.11), steelMat);
  frameBarB.position.set(1.16, -0.66, 0);
  hatchPivot.add(frameBarB);

  // Hex Lock Bolt on right edge of glass hatch (turned by brass wrench)
  const boltHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.16, 6),
    brassMat
  );
  boltHead.rotation.x = Math.PI / 2;
  boltHead.position.set(2.14, 0, 0.08);
  addAnimeInkEdges(boltHead, materials.inkLineMaterial, 24);
  hatchPivot.add(boltHead);
  group.add(hatchPivot);

  // Violet UV Hinge Crack Sensor (`EtwTiLogProtectVM` kernel witness mounted on hatch hinge)
  const uvSensorMat = materials.createToonMaterial(0x7c3aed, {
    emissive: 0xa855f7,
    emissiveIntensity: 0.25,
  });
  const uvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.28, 14), uvSensorMat);
  uvBody.position.set(-1.26, 2.72, 1.06);
  addInvertedHullOutline(uvBody, materials.inkOutlineMaterial, 1.08);
  group.add(uvBody);

  const uvRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.04, 8, 24),
    new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0,
      toneMapped: false,
    })
  );
  uvRing.position.set(-1.26, 2.72, 1.06);
  group.add(uvRing);

  // Parcel #1: Clean Emerald Box (passes through in Act 1)
  const greenCrate = new THREE.Group();
  const gBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.62, 0.76),
    materials.createToonMaterial(0x10b981, { emissive: 0x059669, emissiveIntensity: 0.22 })
  );
  gBox.position.y = 0.31;
  gBox.castShadow = true;
  addAnimeInkEdges(gBox, materials.inkLineMaterial, 24);
  greenCrate.add(gBox);
  greenCrate.position.set(-4.5, 1.03, 0);
  group.add(greenCrate);

  // Parcel #2: Crimson Contraband Canister (blocked by drop-gate in Act 1)
  const redCanister = new THREE.Group();
  const rCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.74, 16),
    materials.createToonMaterial(0xe11d48, { emissive: 0xdc2626, emissiveIntensity: 0.45 })
  );
  rCyl.position.y = 0.37;
  rCyl.castShadow = true;
  addInvertedHullOutline(rCyl, materials.inkOutlineMaterial, 1.06);
  redCanister.add(rCyl);
  const rBand = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.045, 8, 20), darkMetalMat);
  rBand.rotation.x = Math.PI / 2;
  rBand.position.y = 0.37;
  redCanister.add(rBand);
  redCanister.position.set(-5.0, 1.03, 0);
  redCanister.visible = false;
  group.add(redCanister);

  return {
    group,
    cutawayHood,
    hatchPivot,
    hatchGlassMat,
    boltHead,
    rwxCavityLightMat,
    dropGate,
    scanCurtainMat,
    statusLampMat,
    copperFuses,
    brassJumper,
    skipOrb,
    uvSensorMat,
    uvRing,
    greenCrate,
    redCanister,
    textures,
  };
}

export interface WatchtowerBoothRig {
  group: THREE.Group;
  sirenMat: THREE.MeshToonMaterial;
  screenMesh: THREE.Mesh;
  screenAlertTex: THREE.CanvasTexture;
  screenClearTex: THREE.CanvasTexture;
  alarmWireMat: THREE.MeshToonMaterial;
  textures: THREE.Texture[];
}

/**
 * Elevated Watchtower Security Booth (`Windows Defender / MpOav.dll`) + Overhead Copper Alarm Conduit.
 */
export function buildWatchtowerBooth(
  materials: AnimeMaterialLibrary
): WatchtowerBoothRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const steelMat = materials.createToonMaterial(0x1e293b);
  const trimMat = materials.createToonMaterial(0x475569);
  const glassMat = materials.createToonMaterial(0x93c5fd, {
    transparent: true,
    opacity: 0.38,
  });

  // Two steel support stanchions behind conveyor at z = -2.8
  for (const sx of [-1.25, 1.25]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.6, 0.26), steelMat);
    leg.position.set(sx, 1.8, 0);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 26);
    group.add(leg);
  }

  // Booth deck & lower hull
  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.34, 1.85), trimMat);
  deck.position.set(0, 3.6, 0);
  addAnimeInkEdges(deck, materials.inkLineMaterial, 26);
  group.add(deck);

  const boothRear = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.55, 0.22), steelMat);
  boothRear.position.set(0, 4.5, -0.78);
  addAnimeInkEdges(boothRear, materials.inkLineMaterial, 26);
  group.add(boothRear);

  const boothRoof = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.26, 2.05), steelMat);
  boothRoof.position.set(0, 5.38, 0);
  addAnimeInkEdges(boothRoof, materials.inkLineMaterial, 26);
  group.add(boothRoof);

  const windowBand = new THREE.Mesh(new THREE.BoxGeometry(3.12, 1.15, 0.08), glassMat);
  windowBand.position.set(0, 4.58, 0.88);
  group.add(windowBand);

  // Dual-state status screen visible on booth front
  const screenAlertTex = createWorkshopSignTexture(
    'WATCHTOWER · BLOCKED!',
    'THREAT STOPPED BY X-RAY GATE',
    '#450A0A',
    '#EF4444',
    '#FECACA',
    '#FCA5A5'
  );
  const screenClearTex = createWorkshopSignTexture(
    'WATCHTOWER · ALL CLEAR',
    'NO ALARM RECEIVED FROM FLOOR',
    '#052E16',
    '#10B981',
    '#ECFDF5',
    '#6EE7B7'
  );
  textures.push(screenAlertTex, screenClearTex);

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 0.82),
    new THREE.MeshBasicMaterial({ map: screenClearTex })
  );
  screenMesh.position.set(0, 4.46, 0.94);
  group.add(screenMesh);

  // Rooftop Siren Dome
  const sirenMat = materials.createToonMaterial(0xef4444, {
    emissive: 0xdc2626,
    emissiveIntensity: 0.15,
  });
  const siren = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.38, 16), sirenMat);
  siren.position.set(0, 5.7, 0);
  addInvertedHullOutline(siren, materials.inkOutlineMaterial, 1.07);
  group.add(siren);

  // Overhead Copper Alarm Conduit curving from X-Ray tunnel up into Watchtower
  const alarmWireMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0x06b6d4,
    emissiveIntensity: 0.7,
  });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, 3.05, 2.7),
    new THREE.Vector3(-1.4, 4.1, 1.6),
    new THREE.Vector3(-0.6, 4.3, 0.6),
    new THREE.Vector3(0.0, 3.9, 0.0),
  ]);
  const wireMesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 24, 0.075, 10, false),
    alarmWireMat
  );
  addAnimeInkEdges(wireMesh, materials.inkLineMaterial, 35);
  group.add(wireMesh);

  return {
    group,
    sirenMat,
    screenMesh,
    screenAlertTex,
    screenClearTex,
    alarmWireMat,
    textures,
  };
}

export interface WarehouseScaleRig {
  group: THREE.Group;
  padlock: THREE.Group;
  textures: THREE.Texture[];
}

/**
 * Sealed Warehouse Receiving Door + Digital Floor Scale (`0.0 kg` locked flat — NTFS Disk / Zero Sysmon EID 11).
 */
export function buildWarehouseDoorAndScale(
  materials: AnimeMaterialLibrary
): WarehouseScaleRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const frameMat = materials.createToonMaterial(0x334155);
  const shutterMat = materials.createToonMaterial(0x475569);
  const brassMat = materials.createToonMaterial(0xd97706);

  // Sealed steel warehouse door recessed behind floor scale (at local z = -2.2)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.1, 3.3, 0.34), frameMat);
  doorFrame.position.set(0, 1.65, -2.2);
  addAnimeInkEdges(doorFrame, materials.inkLineMaterial, 26);
  group.add(doorFrame);

  const shutter = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.8, 0.18), shutterMat);
  shutter.position.set(0, 1.5, -2.06);
  addAnimeInkEdges(shutter, materials.inkLineMaterial, 26);
  group.add(shutter);

  const doorSignTex = createWorkshopSignTexture(
    'SEALED WAREHOUSE DOOR',
    'LOCKED · 0.0 KG TOUCHED FLOOR',
    '#0F172A',
    '#64748B',
    '#F1F5F9',
    '#38BDF8'
  );
  textures.push(doorSignTex);
  const doorSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 0.55),
    new THREE.MeshBasicMaterial({ map: doorSignTex })
  );
  doorSign.position.set(0, 2.85, -1.94);
  group.add(doorSign);

  // Heavy Brass Padlock locked across shutter handle
  const padlock = new THREE.Group();
  const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.16), brassMat);
  addAnimeInkEdges(lockBody, materials.inkLineMaterial, 24);
  padlock.add(lockBody);
  const shackle = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.045, 8, 16, Math.PI),
    materials.createToonMaterial(0xcbd5e1)
  );
  shackle.position.y = 0.22;
  padlock.add(shackle);
  padlock.position.set(0, 1.25, -1.88);
  group.add(padlock);

  // Digital Floor Scale Plate resting directly on workshop floor (y = 0..0.14)
  group.add(createContactShadowDisc(materials, 1.75, 1.35));
  const scalePlate = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.14, 2.1),
    materials.createToonMaterial(0x1e293b)
  );
  scalePlate.position.set(0, 0.07, 0);
  scalePlate.receiveShadow = true;
  addAnimeInkEdges(scalePlate, materials.inkLineMaterial, 26);
  group.add(scalePlate);

  const scaleReadoutTex = createWorkshopSignTexture(
    'FLOOR SCALE: 0.0 KG',
    'ZERO CARGO TOUCHED DISK FLOOR',
    '#020617',
    '#10B981',
    '#34D399',
    '#94A3B8'
  );
  textures.push(scaleReadoutTex);
  const readoutMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.56),
    new THREE.MeshBasicMaterial({ map: scaleReadoutTex })
  );
  readoutMesh.position.set(0, 0.42, 1.06);
  readoutMesh.rotation.x = -0.35;
  group.add(readoutMesh);

  return { group, padlock, textures };
}

export interface LevitationDroneRig {
  group: THREE.Group;
  ringMesh: THREE.Mesh;
  airTubePartGroup: THREE.Group;
  droneGroup: THREE.Group;
  droneCore: THREE.Mesh;
  droneGearRing: THREE.Mesh;
  droneParts: THREE.Mesh[];
}

/**
 * Overhead Pneumatic Glass Air-Tube + Floating Levitation Assembly Ring (`y = 2.15`, zero floor contact)
 * + Articulated 6-piece Clockwork Reconnaissance Drone (`WebClient.DownloadData` + `Assembly.Load`).
 */
export function buildAirTubeAndLevitationRig(
  materials: AnimeMaterialLibrary
): LevitationDroneRig {
  const group = new THREE.Group();

  // Translucent Pneumatic Glass Air-Tube descending from ceiling down to y = 3.55
  const tubeMat = materials.createToonMaterial(0xbae6fd, {
    transparent: true,
    opacity: 0.34,
  });
  const collarMat = materials.createToonMaterial(0x475569);

  const upperTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 2.4, 20, 1, true),
    tubeMat
  );
  upperTube.position.set(0, 4.7, 0);
  group.add(upperTube);

  const nozzleCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.52, 0.24, 20),
    collarMat
  );
  nozzleCollar.position.set(0, 3.52, 0);
  addAnimeInkEdges(nozzleCollar, materials.inkLineMaterial, 28);
  group.add(nozzleCollar);

  // Falling metallic packet inside pneumatic air-tube
  const airTubePartGroup = new THREE.Group();
  const capsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.32, 6, 12),
    materials.createToonMaterial(0xa855f7, { emissive: 0xc084fc, emissiveIntensity: 0.7 })
  );
  addInvertedHullOutline(capsule, materials.inkOutlineMaterial, 1.07);
  airTubePartGroup.add(capsule);
  airTubePartGroup.position.set(0, 5.2, 0);
  airTubePartGroup.visible = false;
  group.add(airTubePartGroup);

  // Floating Levitation Assembly Ring hovering cleanly at y = 1.75 (never touches floor y = 0!)
  const ringMat = materials.createToonMaterial(0xa855f7, {
    emissive: 0x9333ea,
    emissiveIntensity: 0.78,
  });
  const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.085, 12, 36), ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(0, 1.75, 0);
  group.add(ringMesh);

  // Articulated Clockwork Reconnaissance Drone hovering at y = 2.15
  const droneGroup = new THREE.Group();
  droneGroup.position.set(0, 2.15, 0);

  const coreMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.6,
  });
  const brassMat = materials.createToonMaterial(0xfacc15, {
    emissive: 0xd97706,
    emissiveIntensity: 0.4,
  });
  const wingMat = materials.createToonMaterial(0x1e293b);

  const droneCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), coreMat);
  addInvertedHullOutline(droneCore, materials.inkOutlineMaterial, 1.08);
  droneGroup.add(droneCore);

  const droneGearRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.065, 8, 24), brassMat);
  droneGearRing.rotation.x = Math.PI / 2;
  droneGroup.add(droneGearRing);

  // 4 converging radial blade/sensor fins that snap inward onto core during Act 4
  const droneParts: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i += 1) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.2), wingMat);
    addAnimeInkEdges(fin, materials.inkLineMaterial, 24);
    droneGroup.add(fin);
    droneParts.push(fin);
  }
  droneGroup.visible = false;
  group.add(droneGroup);

  return {
    group,
    ringMesh,
    airTubePartGroup,
    droneGroup,
    droneCore,
    droneGearRing,
    droneParts,
  };
}

export interface PaperTapePrinterRig {
  group: THREE.Group;
  tapeRibbon: THREE.Mesh;
  textures: THREE.Texture[];
}

/**
 * Overhead Mechanical Paper-Tape Transcript Printer (`PowerShell EID 4104`).
 */
export function buildPaperTapePrinter(
  materials: AnimeMaterialLibrary
): PaperTapePrinterRig {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const bodyMat = materials.createToonMaterial(0x334155);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.64, 0.82), bodyMat);
  addAnimeInkEdges(body, materials.inkLineMaterial, 26);
  group.add(body);

  const printerSignTex = createWorkshopSignTexture(
    'PAPER-TAPE LOG',
    'PRE-BYPASS TRANSCRIPT',
    '#1E293B',
    '#F59E0B',
    '#FEF3C7',
    '#FBBF24'
  );
  textures.push(printerSignTex);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 0.42),
    new THREE.MeshBasicMaterial({ map: printerSignTex })
  );
  label.position.set(0, 0, 0.43);
  group.add(label);

  // Animated unrolling amber paper tape ribbon anchored at bottom slot
  const tapeMat = materials.createToonMaterial(0xfef3c7, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.32,
    side: THREE.DoubleSide,
  });
  const tapeGeo = new THREE.BoxGeometry(0.62, 1.6, 0.03);
  tapeGeo.translate(0, -0.8, 0); // anchor top at slot
  const tapeRibbon = new THREE.Mesh(tapeGeo, tapeMat);
  tapeRibbon.position.set(0, -0.32, 0.14);
  tapeRibbon.scale.y = 0.02;
  addAnimeInkEdges(tapeRibbon, materials.inkLineMaterial, 28);
  group.add(tapeRibbon);

  return { group, tapeRibbon, textures };
}

export interface CovertTechnicianRig {
  group: THREE.Group;
  rightArmPivot: THREE.Group;
  wrenchGroup: THREE.Group;
}

/**
 * Articulated Covert Technician (`powershell.exe` script actor) holding Brass Master Wrench.
 */
export function buildCovertTechnician(
  materials: AnimeMaterialLibrary
): CovertTechnicianRig {
  const group = new THREE.Group();
  const coatMat = materials.createToonMaterial(0x1e293b);
  const accentMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
  });
  const visorMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x06b6d4,
    emissiveIntensity: 0.75,
  });
  const brassMat = materials.createToonMaterial(0xfacc15, {
    emissive: 0xd97706,
    emissiveIntensity: 0.35,
  });

  group.add(createContactShadowDisc(materials, 0.55, 0.55));

  const legGeo = new THREE.CapsuleGeometry(0.11, 0.5, 6, 10);
  const leftLeg = new THREE.Mesh(legGeo, coatMat);
  leftLeg.position.set(-0.15, 0.36, 0);
  addInvertedHullOutline(leftLeg, materials.inkOutlineMaterial, 1.07);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, coatMat);
  rightLeg.position.set(0.15, 0.36, 0);
  addInvertedHullOutline(rightLeg, materials.inkOutlineMaterial, 1.07);
  group.add(rightLeg);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.82, 0.34), coatMat);
  torso.position.set(0, 1.08, 0);
  torso.castShadow = true;
  addAnimeInkEdges(torso, materials.inkLineMaterial, 24);
  group.add(torso);

  const sash = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.14, 0.37), accentMat);
  sash.position.set(0, 0.96, 0);
  group.add(sash);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), coatMat);
  head.position.set(0, 1.72, 0);
  addInvertedHullOutline(head, materials.inkOutlineMaterial, 1.07);
  group.add(head);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.11, 0.14), visorMat);
  visor.position.set(0, 1.74, 0.18);
  group.add(visor);

  // Left arm
  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.44, 6, 10), coatMat);
  leftArm.position.set(-0.42, 1.12, 0);
  leftArm.rotation.z = 0.18;
  group.add(leftArm);

  // Articulated Right Arm + Brass Master Wrench (`VirtualProtect` tool)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.4, 1.36, 0);
  const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.46, 6, 10), coatMat);
  rightArm.position.set(0.04, -0.24, 0.18);
  rightArm.rotation.x = -0.65;
  rightArmPivot.add(rightArm);

  const wrenchGroup = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.08), brassMat);
  handle.position.set(0, 0.25, 0);
  addAnimeInkEdges(handle, materials.inkLineMaterial, 24);
  wrenchGroup.add(handle);
  const jaw = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 8, 16, Math.PI * 1.45), brassMat);
  jaw.position.set(0, 0.62, 0);
  jaw.rotation.z = 0.4;
  wrenchGroup.add(jaw);
  wrenchGroup.position.set(0.05, -0.42, 0.46);
  wrenchGroup.rotation.x = Math.PI / 2;
  rightArmPivot.add(wrenchGroup);
  group.add(rightArmPivot);

  return { group, rightArmPivot, wrenchGroup };
}
