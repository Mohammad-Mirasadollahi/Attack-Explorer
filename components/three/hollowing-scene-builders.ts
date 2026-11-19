import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  AnimeMaterialLibrary,
  createScanConeMaterial,
  createStasisDomeMaterial,
} from './anime-toon-materials';

export interface ArmoredTruckRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  wheels: THREE.Group[];
  rearDoorLeftPivot: THREE.Group;
  rearDoorRightPivot: THREE.Group;
  cutawaySidePanel: THREE.Group;
  cutawaySideMaterial: THREE.MeshToonMaterial;
  interiorGlowLight: THREE.PointLight;
  interiorBeaconGlowMesh: THREE.Mesh;
  beaconLightbarMeshes: THREE.Mesh[];
  headlightBeams: THREE.Mesh[];
  driverHead: THREE.Group;
  legalCargoRoot: THREE.Group;
  legalCrates: {
    group: THREE.Group;
    insidePos: THREE.Vector3;
    unloadedPos: THREE.Vector3;
  }[];
  covertCrewRoot: THREE.Group;
  covertOperatives: {
    group: THREE.Group;
    alleyPos: THREE.Vector3;
    insidePos: THREE.Vector3;
    leftArm: THREE.Object3D;
    rightArm: THREE.Object3D;
  }[];
  beaconCoreCrate: {
    group: THREE.Group;
    alleyPos: THREE.Vector3;
    insidePos: THREE.Vector3;
  };
  speedLinesGroup: THREE.Group;
}

export interface StasisRig {
  root: THREE.Group;
  domeMesh: THREE.Mesh;
  domeUniforms: { uTime: { value: number }; uOpacity: { value: number } };
  runeRingOuter: THREE.Mesh;
  runeRingInner: THREE.Mesh;
  frostShards: {
    mesh: THREE.Mesh;
    basePos: THREE.Vector3;
    burstDir: THREE.Vector3;
    phase: number;
  }[];
}

export interface BankCheckpointRig {
  root: THREE.Group;
  boomPivot: THREE.Group;
  guardGroup: THREE.Group;
  guardRightArmPivot: THREE.Group;
  guardBadgeLight: THREE.Mesh;
  cctvHeads: THREE.Group[];
  scanConeUniforms: { uTime: { value: number }; uTrustedLock: { value: number } }[];
  verifiedSignMesh: THREE.Mesh;
  skiMaskGroup: THREE.Group;
  frontAlarmBeams: THREE.Mesh[];
  frontAlarmSiren: THREE.Mesh;
  skylineBuildings: THREE.Mesh[];
}

/**
 * Helper: build a stylized Japanese anime character (uniformed driver, gate guard, or covert operative).
 */
function buildAnimeCharacter(
  mats: AnimeMaterialLibrary,
  config: {
    suitColor: number;
    accentColor: number;
    visorOrFaceColor: number;
    helmetColor: number;
    isCovert?: boolean;
    hasCap?: boolean;
    hasSkiMask?: boolean;
  }
): {
  group: THREE.Group;
  headGroup: THREE.Group;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
} {
  const group = new THREE.Group();

  const suitMat = mats.createToonMaterial(config.suitColor);
  const accentMat = mats.createToonMaterial(config.accentColor, {
    emissive: config.isCovert ? config.accentColor : 0x000000,
    emissiveIntensity: config.isCovert ? 0.95 : 0,
  });
  const helmetMat = mats.createToonMaterial(config.helmetColor);
  const visorMat = mats.createToonMaterial(config.visorOrFaceColor, {
    emissive: config.isCovert ? config.visorOrFaceColor : 0x000000,
    emissiveIntensity: config.isCovert ? 1.75 : 0,
  });
  const bootMat = mats.createToonMaterial(0x0f172a);

  // Legs (grounded at y = 0)
  const legGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.58, 10);
  const leftLeg = new THREE.Mesh(legGeo, bootMat);
  leftLeg.position.set(-0.14, 0.29, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, bootMat);
  rightLeg.position.set(0.14, 0.29, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Torso jacket with tapered silhouette
  const torsoGeo = new THREE.BoxGeometry(0.5, 0.62, 0.3);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.set(0, 0.88, 0);
  torso.castShadow = true;
  addAnimeInkEdges(torso, mats.inkLineMaterial, 25);
  group.add(torso);

  // Chest badge / tactical rig plate
  const chestPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.22, 0.33),
    accentMat
  );
  chestPlate.position.set(0, 0.94, 0);
  group.add(chestPlate);

  // Tactical backpack for covert crew
  if (config.isCovert) {
    const pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.42, 0.2),
      mats.createToonMaterial(0x7c3aed, {
        emissive: 0x7c3aed,
        emissiveIntensity: 0.25,
      })
    );
    pack.position.set(0, 0.92, -0.22);
    addAnimeInkEdges(pack, mats.inkLineMaterial, 25);
    group.add(pack);
  }

  // Left & Right articulated arms
  const armGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.54, 10);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.33, 1.12, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
  leftArmMesh.position.set(0, -0.24, 0);
  leftArmMesh.castShadow = true;
  leftArmPivot.add(leftArmMesh);
  group.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.33, 1.12, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
  rightArmMesh.position.set(0, -0.24, 0);
  rightArmMesh.castShadow = true;
  rightArmPivot.add(rightArmMesh);
  group.add(rightArmPivot);

  // Head + Anime Visor / Cap / Ski Mask
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.38, 0);

  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 14, 12),
    config.hasSkiMask ? bootMat : helmetMat
  );
  headMesh.castShadow = true;
  addInvertedHullOutline(headMesh, mats.inkOutlineMaterial, 1.07);
  headGroup.add(headMesh);

  if (config.isCovert) {
    // Sleek anime glowing crimson visor band
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.1, 0.18),
      visorMat
    );
    visor.position.set(0, 0.02, 0.15);
    headGroup.add(visor);
  } else if (config.hasSkiMask) {
    // Red-rimmed ski mask eye cutout
    const eyeSlit = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.14),
      mats.createToonMaterial(0xfde68a)
    );
    eyeSlit.position.set(0, 0.03, 0.16);
    headGroup.add(eyeSlit);
  } else {
    // Stylized anime face plate + officer cap
    const face = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.18, 0.14),
      visorMat
    );
    face.position.set(0, -0.02, 0.15);
    headGroup.add(face);

    if (config.hasCap) {
      const capTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.22, 0.11, 14),
        mats.createToonMaterial(0x1e3a8a)
      );
      capTop.position.set(0, 0.18, 0);
      headGroup.add(capTop);

      const capBrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.04, 0.24),
        bootMat
      );
      capBrim.position.set(0, 0.13, 0.16);
      headGroup.add(capBrim);
    }
  }

  group.add(headGroup);

  return { group, headGroup, leftArmPivot, rightArmPivot };
}

/**
 * Builds the Hero Composite Armored Bank Truck (12+ procedural parts, bottom-center grounded at y = 0).
 * Faces +X (driving left-to-right from Garage to Bank Checkpoint Gate).
 */
export function buildArmoredBankTruck(
  mats: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): ArmoredTruckRig {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const armorWhiteMat = mats.createToonMaterial(0xf1f5f9);
  const armorBlueMat = mats.createToonMaterial(0x1e3a8a);
  const trimGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.72,
    roughness: 0.24,
  });
  const chassisDarkMat = mats.createToonMaterial(0x1e293b);
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.85,
    roughness: 0.18,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    metalness: 0.1,
    roughness: 0.12,
    transparent: true,
    opacity: isSoftwareGl ? 0.55 : 0.45,
    clearcoat: 1.0,
  });
  const interiorDarkMat = mats.createToonMaterial(0x0f172a);
  const tireMat = mats.createToonMaterial(0x111827);

  // Soft radial contact shadow plane directly beneath the armored truck
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(8.2, 4.2),
    new THREE.MeshBasicMaterial({
      map: mats.contactShadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.025;
  root.add(shadowPlane);

  // 1. Heavy Armored Chassis Undercarriage
  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.42, 2.55),
    chassisDarkMat
  );
  chassis.position.set(0.05, 0.78, 0);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  addAnimeInkEdges(chassis, mats.inkLineMaterial, 25);
  bodyGroup.add(chassis);

  // Front & Rear heavy steel bumpers
  const frontBumper = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.46, 2.72),
    chromeMat
  );
  frontBumper.position.set(3.48, 0.82, 0);
  addAnimeInkEdges(frontBumper, mats.inkLineMaterial, 25);
  bodyGroup.add(frontBumper);

  const rearBumper = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.36, 2.68),
    chromeMat
  );
  rearBumper.position.set(-3.36, 0.76, 0);
  addAnimeInkEdges(rearBumper, mats.inkLineMaterial, 25);
  bodyGroup.add(rearBumper);

  // 2. Cargo Box Floor, Roof, Back Wall (towards cab), and Far Left Wall (-Z)
  // Hollow cargo box spans X: [-3.15 .. +1.25] (length 4.4), Y: [1.0 .. 3.45] (height 2.45), Z: [-1.28 .. +1.28] (width 2.56)
  const cargoFloor = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 0.14, 2.54),
    interiorDarkMat
  );
  cargoFloor.position.set(-0.95, 1.04, 0);
  cargoFloor.receiveShadow = true;
  bodyGroup.add(cargoFloor);

  const cargoRoof = new THREE.Mesh(
    new THREE.BoxGeometry(4.48, 0.18, 2.62),
    armorWhiteMat
  );
  cargoRoof.position.set(-0.95, 3.44, 0);
  cargoRoof.castShadow = true;
  addAnimeInkEdges(cargoRoof, mats.inkLineMaterial, 25);
  bodyGroup.add(cargoRoof);

  // Roof armored AC / communication pod
  const roofPod = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.24, 1.5),
    armorBlueMat
  );
  roofPod.position.set(-1.1, 3.64, 0);
  addAnimeInkEdges(roofPod, mats.inkLineMaterial, 25);
  bodyGroup.add(roofPod);

  // Bulkhead separating cab from cargo bay
  const bulkhead = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 2.34, 2.54),
    interiorDarkMat
  );
  bulkhead.position.set(1.2, 2.22, 0);
  bodyGroup.add(bulkhead);

  // Far-side armored wall (-Z, exterior livery facing outward + clean bright steel bulkhead lining inside cargo bay)
  const liveryMat = mats.createToonMaterial(0xffffff, {
    map: mats.truckSideLiveryTexture,
  });
  const interiorPanelMat = mats.createToonMaterial(0xcbd5e1);
  const farSideWall = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 2.34, 0.14),
    [
      interiorDarkMat,
      interiorDarkMat,
      interiorDarkMat,
      interiorDarkMat,
      interiorPanelMat, // +Z face seen from inside cutaway bay (clean steel, zero mirrored text)
      liveryMat, // -Z exterior face
    ]
  );
  farSideWall.position.set(-0.95, 2.22, -1.24);
  farSideWall.castShadow = true;
  addAnimeInkEdges(farSideWall, mats.inkLineMaterial, 25);
  bodyGroup.add(farSideWall);

  // Subtle illuminated interior ceiling LED strip so covert crew & gold bullion pop cleanly inside cutaway
  const interiorCeilingStrip = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.06, 0.28),
    mats.createToonMaterial(0xe0f2fe, {
      emissive: 0xbae6fd,
      emissiveIntensity: 0.95,
    })
  );
  interiorCeilingStrip.position.set(-0.95, 3.31, 0);
  bodyGroup.add(interiorCeilingStrip);

  // 3. Near-side Cutaway Armor Wall (+Z) — smoothly slides/fades in X-Ray Cutaway mode so viewer sees inside!
  const cutawaySidePanel = new THREE.Group();
  const cutawaySideMaterial = mats.createToonMaterial(0xffffff, {
    map: mats.truckSideLiveryTexture,
    transparent: true,
    opacity: 1,
  });
  const cutawayWallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 2.34, 0.14),
    cutawaySideMaterial
  );
  cutawayWallMesh.position.set(-0.95, 2.22, 1.24);
  cutawayWallMesh.castShadow = true;
  addAnimeInkEdges(cutawayWallMesh, mats.inkLineMaterial, 25);
  cutawaySidePanel.add(cutawayWallMesh);

  // Cutaway side steel frame bars (always visible as subtle anime blueprint rails even when cutaway opens)
  const railMat = mats.createToonMaterial(0x1e3a8a);
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(4.44, 0.12, 0.16), railMat);
  topRail.position.set(-0.95, 3.36, 1.24);
  bodyGroup.add(topRail);
  const botRail = new THREE.Mesh(new THREE.BoxGeometry(4.44, 0.12, 0.16), railMat);
  botRail.position.set(-0.95, 1.06, 1.24);
  bodyGroup.add(botRail);
  bodyGroup.add(cutawaySidePanel);

  // 4. Hinged Dual Rear Blast Doors (at x = -3.15)
  const rearDoorLeftPivot = new THREE.Group();
  rearDoorLeftPivot.position.set(-3.15, 2.22, -1.22);
  const leftDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 2.3, 1.22),
    armorWhiteMat
  );
  leftDoorMesh.position.set(0, 0, 0.61);
  leftDoorMesh.castShadow = true;
  addAnimeInkEdges(leftDoorMesh, mats.inkLineMaterial, 25);
  const leftDoorStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.42, 1.14),
    armorBlueMat
  );
  leftDoorStripe.position.set(0, -0.35, 0.61);
  rearDoorLeftPivot.add(leftDoorMesh, leftDoorStripe);
  bodyGroup.add(rearDoorLeftPivot);

  const rearDoorRightPivot = new THREE.Group();
  rearDoorRightPivot.position.set(-3.15, 2.22, 1.22);
  const rightDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 2.3, 1.22),
    armorWhiteMat
  );
  rightDoorMesh.position.set(0, 0, -0.61);
  rightDoorMesh.castShadow = true;
  addAnimeInkEdges(rightDoorMesh, mats.inkLineMaterial, 25);
  const rightDoorStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.42, 1.14),
    armorBlueMat
  );
  rightDoorStripe.position.set(0, -0.35, -0.61);
  rearDoorRightPivot.add(rightDoorMesh, rightDoorStripe);
  bodyGroup.add(rearDoorRightPivot);

  // Rear trusted license plate mounted on right door
  const plateMat = mats.createToonMaterial(0xffffff, {
    map: mats.licensePlateTexture,
  });
  const rearPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.32, 0.84),
    plateMat
  );
  rearPlate.position.set(-0.1, -0.78, -0.62);
  rearDoorRightPivot.add(rearPlate);

  // 5. Armored Cab (+X front section) with sloped windshield, grille, headlights & official front license plate
  const cabLower = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 1.24, 2.48),
    armorBlueMat
  );
  cabLower.position.set(2.3, 1.62, 0);
  cabLower.castShadow = true;
  addAnimeInkEdges(cabLower, mats.inkLineMaterial, 25);
  bodyGroup.add(cabLower);

  // Cab roof & pillars
  const cabRoof = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.16, 2.46),
    armorWhiteMat
  );
  cabRoof.position.set(2.02, 3.24, 0);
  cabRoof.castShadow = true;
  addAnimeInkEdges(cabRoof, mats.inkLineMaterial, 25);
  bodyGroup.add(cabRoof);

  // Sloped armored windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.96, 2.26),
    glassMat
  );
  windshield.position.set(2.94, 2.7, 0);
  windshield.rotation.z = 0.24;
  bodyGroup.add(windshield);

  // Side cab windows (translucent so uniformed driver is clearly visible)
  const cabWindowL = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.82, 0.08),
    glassMat
  );
  cabWindowL.position.set(2.05, 2.66, -1.22);
  bodyGroup.add(cabWindowL);
  const cabWindowR = cabWindowL.clone();
  cabWindowR.position.z = 1.22;
  bodyGroup.add(cabWindowR);

  // Front armored hood nose
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.86, 2.38),
    armorWhiteMat
  );
  hood.position.set(3.04, 1.72, 0);
  hood.castShadow = true;
  addAnimeInkEdges(hood, mats.inkLineMaterial, 25);
  bodyGroup.add(hood);

  // Front radiator grille & gold bank crest
  const grille = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.62, 1.44),
    chassisDarkMat
  );
  grille.position.set(3.42, 1.62, 0);
  bodyGroup.add(grille);

  const frontCrest = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.18, 0),
    trimGoldMat
  );
  frontCrest.scale.set(0.4, 1.1, 1.1);
  frontCrest.position.set(3.49, 1.72, 0);
  bodyGroup.add(frontCrest);

  // Front Official Trusted License Plate (`BANK-01`)
  const frontPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.34, 0.96),
    plateMat
  );
  frontPlate.position.set(3.66, 0.88, 0);
  bodyGroup.add(frontPlate);

  // Headlights + subtle volumetric headlight beams
  const headlightMat = mats.createToonMaterial(0xfef08a, {
    emissive: 0xfef08a,
    emissiveIntensity: 1.2,
  });
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const headlightBeams: THREE.Mesh[] = [];
  for (const zOff of [-0.88, 0.88]) {
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.26, 0.34),
      headlightMat
    );
    lamp.position.set(3.42, 1.46, zOff);
    bodyGroup.add(lamp);

    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 4.2, 16, 1, true),
      beamMat
    );
    beam.rotation.z = Math.PI / 2;
    beam.position.set(5.55, 1.38, zOff);
    bodyGroup.add(beam);
    headlightBeams.push(beam);
  }

  // Roof Official Bank Amber/Cyan Lightbar
  const beaconLightbarMeshes: THREE.Mesh[] = [];
  const barBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.12, 1.4),
    chassisDarkMat
  );
  barBase.position.set(2.15, 3.38, 0);
  bodyGroup.add(barBase);
  for (const [zOff, col] of [
    [-0.45, 0xfacc15],
    [0.0, 0x38bdf8],
    [0.45, 0xfacc15],
  ] as const) {
    const pod = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.18, 0.36),
      mats.createToonMaterial(col, { emissive: col, emissiveIntensity: 0.8 })
    );
    pod.position.set(2.15, 3.5, zOff);
    bodyGroup.add(pod);
    beaconLightbarMeshes.push(pod);
  }

  // Uniformed Official Bank Driver seated inside the cab
  const driver = buildAnimeCharacter(mats, {
    suitColor: 0x1d4ed8,
    accentColor: 0xfacc15,
    visorOrFaceColor: 0xfde68a,
    helmetColor: 0x1e293b,
    hasCap: true,
  });
  driver.group.scale.setScalar(0.88);
  driver.group.position.set(2.05, 1.38, 0.38);
  driver.group.rotation.y = Math.PI / 2;
  bodyGroup.add(driver.group);

  // 6. Four Composite Multi-Part Armored Wheels (tire + rim + lug hub + wheel well)
  const wheels: THREE.Group[] = [];
  const wheelCoords: [number, number][] = [
    [-1.95, -1.26],
    [-1.95, 1.26],
    [2.15, -1.26],
    [2.15, 1.26],
  ];
  const tireGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.44, 18);
  const rimGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.47, 12);
  const spokeGeo = new THREE.BoxGeometry(0.56, 0.1, 0.5);

  for (const [wx, wz] of wheelCoords) {
    const wGroup = new THREE.Group();
    wGroup.position.set(wx, 0.62, wz);

    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.x = Math.PI / 2;
    tire.castShadow = true;
    addInvertedHullOutline(tire, mats.inkOutlineMaterial, 1.05);
    wGroup.add(tire);

    const rim = new THREE.Mesh(rimGeo, chromeMat);
    rim.rotation.x = Math.PI / 2;
    wGroup.add(rim);

    const spokeA = new THREE.Mesh(spokeGeo, chassisDarkMat);
    const spokeB = new THREE.Mesh(spokeGeo, chassisDarkMat);
    spokeB.rotation.z = Math.PI / 2;
    wGroup.add(spokeA, spokeB);

    root.add(wGroup);
    wheels.push(wGroup);
  }

  // 7. Interior Crimson Payload Aura Glow (activates when Covert Crew boards in Act 4)
  const interiorGlowLight = new THREE.PointLight(0xe11d48, 0, 6.5, 1.8);
  interiorGlowLight.position.set(-1.0, 2.35, 0);
  bodyGroup.add(interiorGlowLight);

  const interiorBeaconGlowMesh = new THREE.Mesh(
    new THREE.BoxGeometry(4.1, 2.1, 2.2),
    new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.BackSide,
    })
  );
  interiorBeaconGlowMesh.position.set(-0.95, 2.18, 0);
  bodyGroup.add(interiorBeaconGlowMesh);

  // 8. Legal Bank Gold Bullion Crates (6 composite crates starting inside cargo bay)
  const legalCargoRoot = new THREE.Group();
  bodyGroup.add(legalCargoRoot);
  const legalCrates: ArmoredTruckRig['legalCrates'] = [];

  const crateBaseMat = mats.createToonMaterial(0xf59e0b, {
    emissive: 0xd97706,
    emissiveIntensity: 0.28,
  });
  const crateLidMat = mats.createToonMaterial(0xfef08a, {
    emissive: 0xfacc15,
    emissiveIntensity: 0.32,
  });
  const crateSealMat = mats.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.55,
  });

  const crateInsidePositions: [number, number, number][] = [
    [-2.2, 1.12, -0.56],
    [-2.2, 1.12, 0.56],
    [-1.05, 1.12, -0.56],
    [-1.05, 1.12, 0.56],
    [0.1, 1.12, -0.56],
    [0.1, 1.12, 0.56],
  ];
  const crateUnloadedPositions: [number, number, number][] = [
    [-6.6, 0.02, -1.7],
    [-5.6, 0.02, -1.7],
    [-6.6, 0.02, -0.55],
    [-5.6, 0.02, -0.55],
    [-6.1, 0.72, -1.15],
    [-5.1, 0.02, -1.15],
  ];

  for (let i = 0; i < 6; i += 1) {
    const cg = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.62, 0.78),
      crateBaseMat
    );
    box.position.y = 0.31;
    box.castShadow = true;
    addAnimeInkEdges(box, mats.inkLineMaterial, 25);
    cg.add(box);

    // Stacked gold bullion bars gleaming on top
    for (const bx of [-0.22, 0.22]) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.14, 0.56),
        i % 2 === 0 ? trimGoldMat : crateLidMat
      );
      bar.position.set(bx, 0.69, 0);
      addAnimeInkEdges(bar, mats.inkLineMaterial, 25);
      cg.add(bar);
    }

    // Green "LEGAL BANK CARGO" clasp seal
    const seal = new THREE.Mesh(
      new THREE.BoxGeometry(0.89, 0.12, 0.22),
      crateSealMat
    );
    seal.position.set(0, 0.34, 0);
    cg.add(seal);

    const insidePos = new THREE.Vector3(...crateInsidePositions[i]);
    const unloadedPos = new THREE.Vector3(...crateUnloadedPositions[i]);
    cg.position.copy(insidePos);
    legalCargoRoot.add(cg);
    legalCrates.push({ group: cg, insidePos, unloadedPos });
  }

  // 9. Covert Intruder Crew (3 anime stealth operatives + glowing crimson Beacon Core case)
  const covertCrewRoot = new THREE.Group();
  bodyGroup.add(covertCrewRoot);
  const covertOperatives: ArmoredTruckRig['covertOperatives'] = [];

  const crewAlleyCoords: [number, number, number][] = [
    [-5.4, 0.0, 2.95],
    [-6.35, 0.0, 2.25],
    [-7.1, 0.0, 3.1],
  ];
  const crewInsideCoords: [number, number, number][] = [
    [0.25, 1.11, -0.5],
    [-0.95, 1.11, 0.45],
    [-2.05, 1.11, -0.45],
  ];

  for (let i = 0; i < 3; i += 1) {
    const op = buildAnimeCharacter(mats, {
      suitColor: 0x18181b,
      accentColor: 0xe11d48,
      visorOrFaceColor: 0xfb7185,
      helmetColor: 0x0f172a,
      isCovert: true,
    });
    op.group.scale.setScalar(0.92);
    const alleyPos = new THREE.Vector3(...crewAlleyCoords[i]);
    const insidePos = new THREE.Vector3(...crewInsideCoords[i]);
    op.group.position.copy(alleyPos);
    op.group.rotation.y = Math.PI * 0.5;
    covertCrewRoot.add(op.group);
    covertOperatives.push({
      group: op.group,
      alleyPos,
      insidePos,
      leftArm: op.leftArmPivot,
      rightArm: op.rightArmPivot,
    });
  }

  // Glowing Crimson-Violet "Cobalt Strike Beacon" Tactical Payload Case
  const beaconCrateGroup = new THREE.Group();
  const caseShell = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.68, 0.72),
    mats.createToonMaterial(0x18181b)
  );
  caseShell.position.y = 0.34;
  addAnimeInkEdges(caseShell, mats.inkLineMaterial, 25);
  const coreCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.28, 0),
    mats.createToonMaterial(0xf43f5e, {
      emissive: 0xf43f5e,
      emissiveIntensity: 1.95,
    })
  );
  coreCrystal.position.set(0, 0.88, 0);
  const caseStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 0.14, 0.75),
    mats.createToonMaterial(0xa855f7, {
      emissive: 0xa855f7,
      emissiveIntensity: 1.35,
    })
  );
  caseStripe.position.y = 0.42;
  beaconCrateGroup.add(caseShell, caseStripe, coreCrystal);

  const beaconAlleyPos = new THREE.Vector3(-5.95, 0.0, 3.4);
  const beaconInsidePos = new THREE.Vector3(-0.95, 1.12, -0.5);
  beaconCrateGroup.position.copy(beaconAlleyPos);
  covertCrewRoot.add(beaconCrateGroup);

  // 10. Anime Kinetic Speed Lines attached behind truck (burst during Act 5 Brake Release)
  const speedLinesGroup = new THREE.Group();
  const speedColors = [0x38bdf8, 0xfacc15, 0xe11d48, 0xa78bfa];
  for (let i = 0; i < 12; i += 1) {
    const len = 1.6 + (i % 4) * 0.65;
    const streak = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.055, 0.055),
      new THREE.MeshBasicMaterial({
        color: speedColors[i % speedColors.length],
        transparent: true,
        opacity: 0.85,
      })
    );
    streak.position.set(
      -4.2 - (i % 3) * 1.1,
      0.55 + (i % 5) * 0.62,
      (i % 2 === 0 ? 1 : -1) * (1.45 + (i % 3) * 0.35)
    );
    speedLinesGroup.add(streak);
  }
  speedLinesGroup.visible = false;
  bodyGroup.add(speedLinesGroup);

  return {
    root,
    bodyGroup,
    wheels,
    rearDoorLeftPivot,
    rearDoorRightPivot,
    cutawaySidePanel,
    cutawaySideMaterial,
    interiorGlowLight,
    interiorBeaconGlowMesh,
    beaconLightbarMeshes,
    headlightBeams,
    driverHead: driver.headGroup,
    legalCargoRoot,
    legalCrates,
    covertCrewRoot,
    covertOperatives,
    beaconCoreCrate: {
      group: beaconCrateGroup,
      alleyPos: beaconAlleyPos,
      insidePos: beaconInsidePos,
    },
    speedLinesGroup,
  };
}

/**
 * Builds the Anime Cryo Time-Freeze Stasis Dome & Floating Frost Shards inside the Garage.
 */
export function buildStasisFreezeRig(
  mats: AnimeMaterialLibrary,
  centerX: number
): StasisRig {
  const root = new THREE.Group();
  root.position.set(centerX, 0, 0);

  const { material: domeMat, uniforms: domeUniforms } =
    createStasisDomeMaterial();
  const domeMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4.65, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.52),
    domeMat
  );
  domeMesh.scale.set(1.18, 0.92, 0.78);
  domeMesh.position.y = 0.04;
  root.add(domeMesh);

  // Geometric glowing anime cryo rune rings on the garage floor
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const runeRingOuter = new THREE.Mesh(
    new THREE.RingGeometry(4.35, 4.7, 36),
    ringMat
  );
  runeRingOuter.rotation.x = -Math.PI / 2;
  runeRingOuter.position.y = 0.05;
  root.add(runeRingOuter);

  const runeRingInner = new THREE.Mesh(
    new THREE.RingGeometry(3.25, 3.45, 6),
    ringMat.clone()
  );
  runeRingInner.rotation.x = -Math.PI / 2;
  runeRingInner.position.y = 0.06;
  root.add(runeRingInner);

  // Floating hexagonal cryo frost shards that suspend during freeze and shatter outward on brake release
  const frostShards: StasisRig['frostShards'] = [];
  const shardGeo = new THREE.OctahedronGeometry(0.32, 0);
  const shardMat = mats.createToonMaterial(0x67e8f9, {
    emissive: 0x22d3ee,
    emissiveIntensity: 1.55,
    transparent: true,
    opacity: 0.94,
  });

  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2;
    const radius = 3.8 + (i % 3) * 0.6;
    const height = 0.9 + (i % 4) * 0.85;
    const mesh = new THREE.Mesh(shardGeo, shardMat);
    mesh.scale.set(0.65, 1.55, 0.65);
    addAnimeInkEdges(mesh, mats.inkLineMaterial, 20);
    const basePos = new THREE.Vector3(
      Math.cos(angle) * radius * 1.15,
      height,
      Math.sin(angle) * radius * 0.72
    );
    const burstDir = basePos.clone().normalize().multiplyScalar(5.5);
    burstDir.y += 2.2;
    mesh.position.copy(basePos);
    mesh.visible = false;
    root.add(mesh);
    frostShards.push({ mesh, basePos, burstDir, phase: i * 0.7 });
  }

  return {
    root,
    domeMesh,
    domeUniforms,
    runeRingOuter,
    runeRingInner,
    frostShards,
  };
}

/**
 * Builds the complete Neo-Tokyo High-Security Bank District, Dispatch Garage,
 * Boulevard, Checkpoint Gatehouse, Guard, CCTV Security Cameras, and Front-Door Contrast Vignette.
 */
export function buildHighSecurityBankEnvironment(
  mats: AnimeMaterialLibrary
): BankCheckpointRig {
  const root = new THREE.Group();

  const concreteMat = mats.createToonMaterial(0xe2e8f0);
  const darkSlateMat = mats.createToonMaterial(0x1e293b);
  const marbleMat = mats.createToonMaterial(0xf8fafc);
  const bankNavyMat = mats.createToonMaterial(0x1e3a8a);
  const bankGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.7,
    roughness: 0.25,
  });
  const glassFacadeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.45,
    roughness: 0.18,
  });

  // 1. Extended Ground Plane (no floating island void — fades cleanly into horizon fog)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 140),
    mats.createToonMaterial(0xcbd5e1)
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  root.add(ground);

  // Boulevard Asphalt Road connecting Garage (-16) to Bank Courtyard (+18)
  const roadMat = mats.createToonMaterial(0xffffff, {
    map: mats.roadSurfaceTexture,
  });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(58, 7.6), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(1.5, 0.02, 0);
  road.receiveShadow = true;
  root.add(road);

  // Raised Sidewalk Curbs along north & south edges of the boulevard
  for (const zCurb of [-4.6, 4.6]) {
    const curb = new THREE.Mesh(
      new THREE.BoxGeometry(58, 0.22, 1.6),
      concreteMat
    );
    curb.position.set(1.5, 0.11, zCurb);
    curb.receiveShadow = true;
    addAnimeInkEdges(curb, mats.inkLineMaterial, 28);
    root.add(curb);
  }

  // 2. BANK DISPATCH GARAGE (Left Side, around X = -12)
  const garageGroup = new THREE.Group();
  garageGroup.position.set(-12.2, 0, 0);
  root.add(garageGroup);

  // Garage floor slab
  const garagePad = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.08, 9.2),
    mats.createToonMaterial(0x94a3b8)
  );
  garagePad.position.set(0, 0.04, 0);
  garagePad.receiveShadow = true;
  garageGroup.add(garagePad);

  // Back wall (-Z) & Left rear wall (-X) so the front (+Z) and exit (+X) stay 100% open to camera!
  const garageBackWall = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 5.4, 0.45),
    darkSlateMat
  );
  garageBackWall.position.set(0, 2.7, -4.4);
  garageBackWall.castShadow = true;
  garageBackWall.receiveShadow = true;
  addAnimeInkEdges(garageBackWall, mats.inkLineMaterial, 28);
  garageGroup.add(garageBackWall);

  // Open-span cantilevered steel columns anchored at back wall (-Z) so the camera-facing front (+Z) NEVER blocks the armored truck!
  const pillarGeo = new THREE.BoxGeometry(0.52, 5.6, 0.52);
  for (const [px, pz] of [
    [-5.0, -4.2],
    [0.0, -4.2],
    [5.0, -4.2],
  ]) {
    const pillar = new THREE.Mesh(pillarGeo, bankNavyMat);
    pillar.position.set(px, 2.8, pz);
    pillar.castShadow = true;
    addAnimeInkEdges(pillar, mats.inkLineMaterial, 25);
    garageGroup.add(pillar);

    // Overhead diagonal cantilever truss supporting the open-span canopy
    const truss = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.34, 4.4),
      bankNavyMat
    );
    truss.position.set(px, 5.2, -2.0);
    truss.rotation.x = 0.22;
    addAnimeInkEdges(truss, mats.inkLineMaterial, 25);
    garageGroup.add(truss);
  }

  // Garage cantilevered canopy roof (tall enough so camera never clips)
  const garageRoof = new THREE.Mesh(
    new THREE.BoxGeometry(11.0, 0.46, 9.4),
    darkSlateMat
  );
  garageRoof.position.set(0, 5.72, 0);
  garageRoof.castShadow = true;
  addAnimeInkEdges(garageRoof, mats.inkLineMaterial, 25);
  garageGroup.add(garageRoof);

  // Garage Signage Fascia facing front (+Z) & exit (+X)
  const garageSignMat = mats.createToonMaterial(0xffffff, {
    map: mats.garageSignTexture,
  });
  const garageFrontSign = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 1.35, 0.22),
    garageSignMat
  );
  garageFrontSign.position.set(0, 6.52, 4.5);
  addAnimeInkEdges(garageFrontSign, mats.inkLineMaterial, 25);
  garageGroup.add(garageFrontSign);

  // Overhead warm-white fluorescent strip fixtures under garage roof
  const lampStripMat = mats.createToonMaterial(0xe0f2fe, {
    emissive: 0xbae6fd,
    emissiveIntensity: 0.9,
  });
  for (const lx of [-2.4, 2.4]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.12, 0.35),
      lampStripMat
    );
    strip.position.set(lx, 5.44, 0);
    garageGroup.add(strip);
  }

  // 3. HIGH-SECURITY CENTRAL BANK FORTRESS (Right Side, X = +14 .. +24)
  const bankGroup = new THREE.Group();
  bankGroup.position.set(17.6, 0, -2.2);
  root.add(bankGroup);

  // Grand stepped granite plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(11.6, 0.6, 15.2),
    concreteMat
  );
  plinth.position.set(0, 0.3, 0);
  plinth.receiveShadow = true;
  addAnimeInkEdges(plinth, mats.inkLineMaterial, 25);
  bankGroup.add(plinth);

  // Main Neo-Classical Anime Bank Tower Core
  const bankMain = new THREE.Mesh(
    new THREE.BoxGeometry(9.6, 10.6, 13.4),
    marbleMat
  );
  bankMain.position.set(0.6, 5.9, 0);
  bankMain.castShadow = true;
  bankMain.receiveShadow = true;
  addAnimeInkEdges(bankMain, mats.inkLineMaterial, 25);
  bankGroup.add(bankMain);

  // Blue architectural glass atrium inset facing the gate (-X)
  const bankGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 7.6, 8.8),
    glassFacadeMat
  );
  bankGlass.position.set(-4.22, 6.2, 0);
  bankGroup.add(bankGlass);

  // Monumental Greek-Meets-Neo-Tokyo Columns along Bank Facade
  const colGeo = new THREE.CylinderGeometry(0.42, 0.48, 9.6, 12);
  for (const cz of [-5.2, -2.6, 2.6, 5.2]) {
    const col = new THREE.Mesh(colGeo, marbleMat);
    col.position.set(-4.75, 5.4, cz);
    col.castShadow = true;
    addAnimeInkEdges(col, mats.inkLineMaterial, 35);
    bankGroup.add(col);
  }

  // Bank Crown Cornice & Illuminated Signboard
  const bankCrown = new THREE.Mesh(
    new THREE.BoxGeometry(11.4, 1.25, 14.6),
    bankNavyMat
  );
  bankCrown.position.set(0.1, 11.45, 0);
  addAnimeInkEdges(bankCrown, mats.inkLineMaterial, 25);
  bankGroup.add(bankCrown);

  const bankSignMat = mats.createToonMaterial(0xffffff, {
    map: mats.bankSignTexture,
  });
  const bankSignFront = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 1.95, 9.8),
    bankSignMat
  );
  bankSignFront.position.set(-5.64, 11.65, 0);
  addAnimeInkEdges(bankSignFront, mats.inkLineMaterial, 25);
  bankGroup.add(bankSignFront);

  // Side signboard visible from frontal 3/4 camera (+Z)
  const bankSignSide = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 1.75, 0.24),
    bankSignMat
  );
  bankSignSide.position.set(0.4, 11.65, 7.35);
  addAnimeInkEdges(bankSignSide, mats.inkLineMaterial, 25);
  bankGroup.add(bankSignSide);

  // Reinforced Bank Vault Armored Vehicle Archway (where the truck enters!)
  const vaultFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 5.2, 5.0),
    darkSlateMat
  );
  vaultFrame.position.set(-4.4, 2.9, 2.2);
  addAnimeInkEdges(vaultFrame, mats.inkLineMaterial, 25);
  bankGroup.add(vaultFrame);

  const vaultGoldTrim = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.32, 5.2),
    bankGoldMat
  );
  vaultGoldTrim.position.set(-4.4, 5.55, 2.2);
  bankGroup.add(vaultGoldTrim);

  // 4. FRONT DOOR SKI-MASK INTRUDER CONTRAST VIGNETTE (Act 1: "Instead of breaking down the front door in a ski mask...")
  const skiMaskGroup = new THREE.Group();
  skiMaskGroup.position.set(11.6, 0, -5.8);
  root.add(skiMaskGroup);

  const skiMaskIntruder = buildAnimeCharacter(mats, {
    suitColor: 0x27272a,
    accentColor: 0xe11d48,
    visorOrFaceColor: 0xfde68a,
    helmetColor: 0x09090b,
    hasSkiMask: true,
  });
  skiMaskIntruder.group.rotation.y = Math.PI * 0.45;
  skiMaskGroup.add(skiMaskIntruder.group);

  // Red Laser Alarm Grid guarding the Front Door
  const frontAlarmBeams: THREE.Mesh[] = [];
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.75,
  });
  for (const ly of [0.85, 1.55, 2.25]) {
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 3.2, 8),
      laserMat
    );
    beam.rotation.x = Math.PI / 2;
    beam.position.set(1.15, ly, 0);
    skiMaskGroup.add(beam);
    frontAlarmBeams.push(beam);
  }
  const frontAlarmSiren = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 10),
    mats.createToonMaterial(0xf43f5e, {
      emissive: 0xf43f5e,
      emissiveIntensity: 1.2,
    })
  );
  frontAlarmSiren.position.set(1.15, 3.1, 0);
  skiMaskGroup.add(frontAlarmSiren);

  // 5. SECURITY CHECKPOINT GATEHOUSE, BOOM BARRIER, GUARD & CCTV CAMERAS (X = +7.5)
  const gateX = 7.4;

  // Guard Booth on far side of road (-Z = -5.2)
  const booth = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 3.2, 2.4),
    bankNavyMat
  );
  booth.position.set(gateX, 1.6, -5.2);
  booth.castShadow = true;
  addAnimeInkEdges(booth, mats.inkLineMaterial, 25);
  root.add(booth);

  const boothWindow = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 1.25, 2.48),
    glassFacadeMat
  );
  boothWindow.position.set(gateX, 2.15, -5.2);
  root.add(boothWindow);

  const boothRoof = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.28, 3.0),
    marbleMat
  );
  boothRoof.position.set(gateX, 3.34, -5.2);
  addAnimeInkEdges(boothRoof, mats.inkLineMaterial, 25);
  root.add(boothRoof);

  // Gatehouse Boom Barrier Pedestal & Articulated Striped Boom Arm
  const boomPedestal = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 1.35, 0.75),
    darkSlateMat
  );
  boomPedestal.position.set(gateX, 0.68, -3.6);
  boomPedestal.castShadow = true;
  addAnimeInkEdges(boomPedestal, mats.inkLineMaterial, 25);
  root.add(boomPedestal);

  const boomPivot = new THREE.Group();
  boomPivot.position.set(gateX, 1.18, -3.55);
  const boomArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.2, 7.1),
    mats.createToonMaterial(0xffffff, { map: mats.hazardStripeTexture })
  );
  boomArm.position.set(0, 0, 3.55);
  boomArm.castShadow = true;
  addAnimeInkEdges(boomArm, mats.inkLineMaterial, 25);
  boomPivot.add(boomArm);
  root.add(boomPivot);

  // Opposite catch post on near curb (+Z = +3.7)
  const catchPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 1.25, 0.42),
    darkSlateMat
  );
  catchPost.position.set(gateX, 0.62, 3.7);
  root.add(catchPost);

  // Uniformed Bank Gate Guard standing right beside the checkpoint
  const guard = buildAnimeCharacter(mats, {
    suitColor: 0x1e3a8a,
    accentColor: 0x38bdf8,
    visorOrFaceColor: 0xfde68a,
    helmetColor: 0x0f172a,
    hasCap: true,
  });
  guard.group.position.set(gateX - 1.15, 0.22, -4.3);
  guard.group.rotation.y = Math.PI * 0.15;
  root.add(guard.group);

  const guardBadgeLight = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.16, 0),
    mats.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.2,
    })
  );
  guardBadgeLight.position.set(gateX - 1.15, 2.25, -4.3);
  root.add(guardBadgeLight);

  // Overhead Checkpoint Gantry Arch + 2 Articulated CCTV Security Cameras with Volumetric Scan Cones
  const gantryLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 6.2, 0.46),
    darkSlateMat
  );
  gantryLeft.position.set(gateX + 0.8, 3.1, -4.3);
  const gantryRight = gantryLeft.clone();
  gantryRight.position.z = 4.3;
  const gantryCrossbar = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.52, 9.2),
    bankNavyMat
  );
  gantryCrossbar.position.set(gateX + 0.8, 6.1, 0);
  addAnimeInkEdges(gantryCrossbar, mats.inkLineMaterial, 25);
  root.add(gantryLeft, gantryRight, gantryCrossbar);

  // LED Status Light Bar on Checkpoint Gantry (turns bright emerald when trusted plate passes)
  const verifiedSignMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.28, 3.6),
    mats.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
    })
  );
  verifiedSignMesh.position.set(gateX + 0.8, 6.48, 0);
  root.add(verifiedSignMesh);

  const cctvHeads: THREE.Group[] = [];
  const scanConeUniforms: { uTime: { value: number }; uTrustedLock: { value: number } }[] = [];

  for (const cz of [-2.4, 2.4]) {
    const camMount = new THREE.Group();
    camMount.position.set(gateX + 0.55, 5.75, cz);

    const camHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.36, 0.38),
      marbleMat
    );
    addAnimeInkEdges(camHousing, mats.inkLineMaterial, 25);
    camMount.add(camHousing);

    const camLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.16, 12),
      mats.createToonMaterial(0x10b981, {
        emissive: 0x10b981,
        emissiveIntensity: 0.9,
      })
    );
    camLens.rotation.z = Math.PI / 2;
    camLens.position.set(-0.42, 0, 0);
    camMount.add(camLens);

    // Volumetric GLSL Scan Cone extending from lens
    const { material: coneMat, uniforms: coneUniforms } =
      createScanConeMaterial();
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(2.35, 6.8, 22, 1, true),
      coneMat
    );
    cone.rotation.z = -Math.PI / 2;
    cone.position.set(-3.8, 0, 0);
    camMount.add(cone);

    root.add(camMount);
    cctvHeads.push(camMount);
    scanConeUniforms.push(coneUniforms);
  }

  // 6. Neo-Tokyo Anime Urban Background Skyline Silhouettes & Stylized Street Planters
  const skylineBuildings: THREE.Mesh[] = [];
  const skylinePalette = [0x94a3b8, 0x64748b, 0x475569, 0x334155];
  const skylineSpecs: [number, number, number, number, number][] = [
    [-26, -18, 6, 16, 6],
    [-17, -21, 7, 22, 7],
    [-7, -19, 6.5, 18, 6],
    [3, -22, 8, 26, 7],
    [13, -24, 7.5, 20, 7],
    [26, -19, 8, 24, 8],
    [-28, -9, 5, 12, 5],
    [30, -8, 6, 15, 6],
  ];

  skylineSpecs.forEach(([bx, bz, bw, bh, bd], idx) => {
    const bMat = mats.createToonMaterial(
      skylinePalette[idx % skylinePalette.length]
    );
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), bMat);
    bMesh.position.set(bx, bh / 2, bz);
    addAnimeInkEdges(bMesh, mats.inkLineMaterial, 35);
    root.add(bMesh);
    skylineBuildings.push(bMesh);
  });

  // Stylized Anime Street Trees & Bollards framing the Boulevard (natural urban boundaries)
  const trunkMat = mats.createToonMaterial(0x78350f);
  const foliageMat = mats.createToonMaterial(0x10b981);
  const cherryFoliageMat = mats.createToonMaterial(0xf9a8d4);
  const treeCoords: [number, number, boolean][] = [
    [-3.2, -6.4, false],
    [1.8, -6.4, true],
    [-3.5, 6.6, true],
    [2.4, 6.6, false],
    [11.4, 6.8, true],
  ];
  for (const [tx, tz, isSakura] of treeCoords) {
    const tree = new THREE.Group();
    tree.position.set(tx, 0, tz);
    const planter = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.45, 1.5),
      concreteMat
    );
    planter.position.y = 0.225;
    addAnimeInkEdges(planter, mats.inkLineMaterial, 28);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.2, 1.7, 8),
      trunkMat
    );
    trunk.position.y = 1.25;
    const crownA = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.05, 0),
      isSakura ? cherryFoliageMat : foliageMat
    );
    crownA.position.set(0, 2.55, 0);
    addInvertedHullOutline(crownA, mats.inkOutlineMaterial, 1.05);
    const crownB = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.75, 0),
      isSakura ? cherryFoliageMat : foliageMat
    );
    crownB.position.set(0.55, 2.25, 0.3);
    tree.add(planter, trunk, crownA, crownB);
    root.add(tree);
  }

  return {
    root,
    boomPivot,
    guardGroup: guard.group,
    guardRightArmPivot: guard.rightArmPivot,
    guardBadgeLight,
    cctvHeads,
    scanConeUniforms,
    verifiedSignMesh,
    skiMaskGroup,
    frontAlarmBeams,
    frontAlarmSiren,
    skylineBuildings,
  };
}
