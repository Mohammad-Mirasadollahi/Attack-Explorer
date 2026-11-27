import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateThreeCxStep3State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — 3CX Step #3 (`threecx-step3-icondrop`)
 * Room: Public Art-Gallery Icon Wall & Steganographic EOF Strip Slicer (icon12.ico -> C2 Dish).
 */
export function buildThreeCxStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x263242,
    floorTrimHex: 0x0284c7,
    wallColor: 0x1e293b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 3 · PUBLIC ICON GALLERY DEAD-DROP',
    signSubtitle: 'GITHUB ICON12.ICO EOF BASE64 -> C2 PIVOT',
    signBgHex: '#0F172A',
    signBorderHex: '#0284C7',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const woodMat = materials.createToonMaterial(0x78350f);
  const whiteMat = materials.createToonMaterial(0xf8fafc);
  const skyMat = materials.createToonMaterial(0x38bdf8);
  const crimsonMat = materials.createToonMaterial(0xe11d48);
  const amberMat = materials.createToonMaterial(0xf59e0b);

  // Prop 1: Public Art-Gallery Partition Wall Holding 6 Framed Portrait Tiles (x = 0.6, z = -0.55)
  const galleryGroup = new THREE.Group();
  galleryGroup.position.set(0.6, 0, -0.55);
  galleryGroup.add(createContactDisc(materials, 2.3));

  const galleryPanel = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.6, 0.34), whiteMat);
  galleryPanel.position.y = 1.8;
  galleryPanel.receiveShadow = true;
  addAnimeInkEdges(galleryPanel, materials.inkLineMaterial, 24);
  galleryGroup.add(galleryPanel);

  // Cutaway glass gallery rail covering tiles
  const galleryGlassMat = new THREE.MeshToonMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.38,
    gradientMap: materials.gradientMap,
  });
  const galleryGlass = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.6, 0.06), galleryGlassMat);
  galleryGlass.position.set(0, 2.05, 0.36);
  galleryGroup.add(galleryGlass);

  const tileCoords: [number, number][] = [
    [-1.4, 2.7],
    [0.0, 2.7],
    [1.4, 2.7],
    [-1.4, 1.5],
    [0.0, 1.5],
    [1.4, 1.5],
  ];

  const targetTile = new THREE.Group();
  const hiddenStrip = new THREE.Group();

  tileCoords.forEach(([tx, ty], idx) => {
    const isTarget = idx === 4; // icon12.ico center-bottom
    const tile = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.88, 0.12), woodMat);
    addAnimeInkEdges(frame, materials.inkLineMaterial, 24);
    const canvas = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.68, 0.14),
      materials.createToonMaterial(isTarget ? 0x0284c7 : idx % 2 === 0 ? 0x94a3b8 : 0x64748b)
    );
    tile.add(frame, canvas);

    if (isTarget) {
      const stripBar = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.18, 0.08), crimsonMat);
      addAnimeInkEdges(stripBar, materials.inkLineMaterial, 24);
      hiddenStrip.add(stripBar);
      hiddenStrip.position.set(0, -0.42, 0.04);
      tile.add(hiddenStrip);
      targetTile.add(tile);
      targetTile.position.set(tx, ty, 0.24);
      galleryGroup.add(targetTile);
    } else {
      tile.position.set(tx, ty, 0.24);
      galleryGroup.add(tile);
    }
  });
  root.add(galleryGroup);

  // Prop 2: Left Desk Telephone & Holographic Radio Emitter (x = -3.1, z = 0.85)
  const phoneStation = new THREE.Group();
  phoneStation.position.set(-3.1, 0, 0.85);
  phoneStation.add(createContactDisc(materials, 1.1));

  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.35, 1.3), darkMat);
  pedestal.position.y = 0.675;
  addAnimeInkEdges(pedestal, materials.inkLineMaterial, 24);
  phoneStation.add(pedestal);

  const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.36, 0.88), whiteMat);
  phoneBody.position.y = 1.54;
  addAnimeInkEdges(phoneBody, materials.inkLineMaterial, 24);
  phoneStation.add(phoneBody);

  const radioOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), skyMat);
  radioOrb.position.set(0, 2.22, 0);
  phoneStation.add(radioOrb);
  root.add(phoneStation);

  // Cyan Laser Scan Beam connecting Phone Radio (-3.1, 2.22, 0.85) to icon12.ico (0.6, 1.5, -0.3)
  const beamFrom = new THREE.Vector3(-3.1, 2.22, 0.85);
  const beamTo = new THREE.Vector3(0.6, 1.5, -0.25);
  const beamDir = new THREE.Vector3().subVectors(beamTo, beamFrom);
  const beamLen = beamDir.length();
  const beamMid = new THREE.Vector3().addVectors(beamFrom, beamTo).multiplyScalar(0.5);
  const scanBeamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.78,
    toneMapped: false,
  });
  const scanBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, beamLen, 10),
    scanBeamMat
  );
  scanBeam.position.copy(beamMid);
  scanBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamDir.clone().normalize());
  root.add(scanBeam);

  // Prop 3: Right C2 Relay Dish Locking Onto akamaitechcloudservices[.]com (x = 4.2, z = 0.65)
  const dishGroup = new THREE.Group();
  dishGroup.position.set(4.2, 0, 0.65);
  dishGroup.add(createContactDisc(materials, 0.95));

  const dishTower = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 1.75, 14), darkMat);
  dishTower.position.y = 0.875;
  addAnimeInkEdges(dishTower, materials.inkLineMaterial, 24);
  dishGroup.add(dishTower);

  const dishPivot = new THREE.Group();
  dishPivot.position.set(0, 2.05, 0);
  const parabola = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42),
    amberMat
  );
  parabola.rotation.x = Math.PI * 0.65;
  const feedHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 10), crimsonMat);
  feedHorn.position.set(0, 0.15, 0.45);
  feedHorn.rotation.x = Math.PI / 3;
  dishPivot.add(parabola, feedHorn);
  dishGroup.add(dishPivot);

  const c2Tex = createPlaqueTexture(
    'DECODED C2 HOST',
    'AKAMAITECHCLOUD[.]COM',
    '#18181B',
    '#E11D48',
    '#FECDD3'
  );
  textures.push(c2Tex);
  const c2Plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 0.56),
    new THREE.MeshBasicMaterial({ map: c2Tex })
  );
  c2Plaque.position.set(0, 0.62, 0.45);
  dishGroup.add(c2Plaque);
  root.add(dishGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0.6, 3.65, -0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(0.6, 1.05, 0.1);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.2, 3.6, 8.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.6, -0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.6, 2.1, -0.1),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateThreeCxStep3State(timeSec, cutawayMode);

      radioOrb.rotation.y = timeSec * 2.2;
      scanBeam.visible = s.scanBeamActive > 0.08;
      scanBeamMat.opacity = 0.35 + s.scanBeamActive * 0.5;

      galleryGlassMat.opacity = 0.42 - s.cutawayOpen * 0.32;
      targetTile.rotation.y = -easeOutCubic(s.tileTilt) * 0.36;
      const peel = easeOutCubic(s.stripPeeled);
      hiddenStrip.position.y = -0.42 - peel * 0.48;
      hiddenStrip.position.z = 0.04 + peel * 0.36;
      hiddenStrip.rotation.x = peel * 0.62;

      dishPivot.rotation.y = -0.8 + easeOutCubic(s.c2DishLocked) * 0.95;
      shell.accentStripMat.color.setHex(s.c2DishLocked > 0.5 ? 0xe11d48 : 0x0284c7);

      return {
        glitchIntensity: peel * 0.2,
        magicDustIntensity: s.scanBeamActive * 0.4,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
