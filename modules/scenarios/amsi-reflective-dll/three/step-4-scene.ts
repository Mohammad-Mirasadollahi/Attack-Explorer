import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateAmsiStep4State } from '../choreography';

/**
 * Standalone 3D Scene: AMSI Step 4 — Zero-Disk Magnetic Levitation Bay with Padlocked NTFS
 * Warehouse Scale (0.0 kg), Overhead HTTPS Glass Air-Tube, Mid-Air Assembling Reflective
 * Drone (MEM_PRIVATE RWX) & CLR ETW EID 152 Radar Witness.
 */
export function buildAmsiStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f172a,
    floorTrimHex: 0xa855f7,
    wallColor: 0x1e1b4b,
    pillarColor: 0x0f172a,
    signTitle: 'ZERO-DISK MAGNETIC LEVITATION BAY',
    signSubtitle: 'HTTPS BYTE[] STREAM -> MEM_PRIVATE RWX | NTFS = 0.0 KG | CLR ETW 152',
    signBgHex: '#0F172A',
    signBorderHex: '#A855F7',
    signTitleHex: '#F3E8FF',
    signSubHex: '#C084FC',
    width: 14.4,
    depth: 9.8,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // 1) Left Zone: Padlocked NTFS Disk Vault & 0.0 kg Digital Floor Scale
  const diskZone = new THREE.Group();
  diskZone.position.set(-3.1, 0, 0.15);
  diskZone.add(createContactDisc(materials, 2.2));

  const scaleDeck = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.24, 2.3),
    materials.createToonMaterial(0x1e293b)
  );
  scaleDeck.position.y = 0.12;
  scaleDeck.receiveShadow = true;
  addAnimeInkEdges(scaleDeck, materials.inkLineMaterial, 24);
  diskZone.add(scaleDeck);

  const scaleReadoutTex = createPlaqueTexture(
    'NTFS DISK FLOOR SCALE',
    '0.0 kg · NO EID 11',
    '#052E16',
    '#10B981',
    '#6EE7B7'
  );
  textures.push(scaleReadoutTex);
  const scaleScreen = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.92, 0.18),
    [
      materials.createToonMaterial(0x0f172a),
      materials.createToonMaterial(0x0f172a),
      materials.createToonMaterial(0x0f172a),
      materials.createToonMaterial(0x0f172a),
      new THREE.MeshBasicMaterial({ map: scaleReadoutTex }),
      materials.createToonMaterial(0x0f172a),
    ]
  );
  scaleScreen.position.set(0, 1.35, -0.75);
  addAnimeInkEdges(scaleScreen, materials.inkLineMaterial, 24);
  diskZone.add(scaleScreen);

  // Sealed Disk Door behind scale with large Emerald Padlock
  const padlockBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.65, 0.28),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x059669,
      emissiveIntensity: 0.45,
    })
  );
  padlockBody.position.set(0, 0.65, 0.25);
  addAnimeInkEdges(padlockBody, materials.inkLineMaterial, 24);
  diskZone.add(padlockBody);
  const padlockShackle = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.06, 8, 18, Math.PI),
    materials.createToonMaterial(0xcbd5e1)
  );
  padlockShackle.position.set(0, 0.96, 0.25);
  diskZone.add(padlockShackle);

  root.add(diskZone);

  // 2) Right Zone: Overhead HTTPS Pneumatic Air-Tube & Mid-Air Reflective Assembly Ring
  const levZone = new THREE.Group();
  levZone.position.set(2.35, 0, 0.2);

  // Magnetic floor ring emitter (proving zero floor contact)
  const emitterRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.12, 12, 36),
    materials.createToonMaterial(0xa855f7, {
      emissive: 0x9333ea,
      emissiveIntensity: 0.75,
    })
  );
  emitterRing.rotation.x = Math.PI / 2;
  emitterRing.position.y = 0.16;
  levZone.add(emitterRing);

  // Overhead Glass Pneumatic HTTPS Tube
  const tubeMat = materials.createToonMaterial(0x38bdf8, {
    transparent: true,
    opacity: 0.3,
  });
  const glassTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 2.5, 20, 1, true),
    tubeMat
  );
  glassTube.position.set(0, 4.35, 0);
  levZone.add(glassTube);

  const tubeCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.56, 0.24, 20),
    materials.createToonMaterial(0x334155)
  );
  tubeCollar.position.set(0, 3.16, 0);
  addAnimeInkEdges(tubeCollar, materials.inkLineMaterial, 24);
  levZone.add(tubeCollar);

  // Falling 184 KB Encrypted HTTPS Capsule
  const httpsCapsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.24, 0.42, 8, 14),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xbe123c,
      emissiveIntensity: 0.9,
    })
  );
  httpsCapsule.position.set(0, 4.9, 0);
  addInvertedHullOutline(httpsCapsule, materials.inkOutlineMaterial, 1.07);
  levZone.add(httpsCapsule);

  // Mid-Air Reflective PE Drone (4 converging radial fins + brass gear + crimson core)
  const droneGroup = new THREE.Group();
  droneGroup.position.set(0, 2.05, 0);

  const droneCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.42, 0),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 1.0,
    })
  );
  addInvertedHullOutline(droneCore, materials.inkOutlineMaterial, 1.08);
  droneGroup.add(droneCore);

  const gearRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.08, 10, 24),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xd97706,
      emissiveIntensity: 0.55,
    })
  );
  gearRing.rotation.x = Math.PI / 2;
  droneGroup.add(gearRing);

  const finMat = materials.createToonMaterial(0xc084fc, {
    emissive: 0x7e22ce,
    emissiveIntensity: 0.45,
  });
  const droneFins: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i += 1) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16, 0.24), finMat);
    addAnimeInkEdges(fin, materials.inkLineMaterial, 24);
    droneGroup.add(fin);
    droneFins.push(fin);
  }
  levZone.add(droneGroup);

  // Translucent Containment Cylinder Cutaway around Levitation Bay
  const chamberHood = new THREE.Mesh(
    new THREE.CylinderGeometry(1.72, 1.72, 2.75, 24, 1, true),
    materials.createToonMaterial(0xc084fc, {
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    })
  );
  chamberHood.position.y = 1.6;
  levZone.add(chamberHood);

  root.add(levZone);

  // 3) Rear-Right CLR ETW EID 152 Witness Radar Dish
  const radarGroup = new THREE.Group();
  radarGroup.position.set(5.1, 0, -1.6);
  const radarPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 2.2, 12),
    materials.createToonMaterial(0x334155)
  );
  radarPole.position.y = 1.1;
  radarGroup.add(radarPole);

  const radarDish = new THREE.Mesh(
    new THREE.ConeGeometry(0.68, 0.35, 20, 1, true),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x059669,
      emissiveIntensity: 0.65,
      side: THREE.DoubleSide,
    })
  );
  radarDish.position.set(0, 2.35, 0);
  radarDish.rotation.z = Math.PI * 0.38;
  radarGroup.add(radarDish);

  const etw152Tex = createPlaqueTexture(
    'CLR ETW EID 152',
    'PATH = "" (RAM ONLY)',
    '#052E16',
    '#10B981',
    '#A7F3D0'
  );
  textures.push(etw152Tex);
  const etw152Plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.72),
    new THREE.MeshBasicMaterial({ map: etw152Tex })
  );
  etw152Plaque.position.set(-0.3, 3.25, 0.2);
  radarGroup.add(etw152Plaque);
  root.add(radarGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(2.35, 3.35, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-3.1, 2.35, 0.15);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 4.1, 9.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.1, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(2.35, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const s = evaluateAmsiStep4State(timeSec / 12, cutawayMode);

      httpsCapsule.visible = s.capsuleDrop < 0.96;
      httpsCapsule.position.y = 5.1 - s.capsuleDrop * 2.85;

      droneGroup.visible = s.capsuleDrop > 0.75 || s.droneAssembly > 0.02;
      droneGroup.position.y = s.droneHoverY;
      droneGroup.rotation.y = s.droneSpinRad;
      gearRing.rotation.z = -s.droneSpinRad * 1.4;

      const spread = 1.65 - s.droneAssembly * 1.02;
      for (let i = 0; i < droneFins.length; i += 1) {
        const ang = (i * Math.PI) / 2;
        droneFins[i].position.set(Math.cos(ang) * spread, 0, Math.sin(ang) * spread);
        droneFins[i].rotation.y = -ang;
      }

      radarDish.rotation.y = -0.6 + s.clrEtwLock * 0.9;
      chamberHood.position.y = 1.6 + s.cutawayLift * 2.0;
      chamberHood.visible = s.cutawayLift < 0.92;

      return {
        glitchIntensity: s.droneAssembly * 0.3,
        magicDustIntensity: 0.25 + s.clrEtwLock * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
