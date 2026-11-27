import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutBack,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import {
  KERB_STEP_DURATION_SEC,
  evaluateKerbStep3State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Kerberoasting Step 3 (`kerb-step3-crack`)
 * Exclusive Room: Soundproof Air-Gapped Basement Safecracker Workshop
 * Exclusive Props:
 *   1. Severed Wall Network Conduit & Silent DC Lockout Gauge (`EID 4625 = 0 · AIR-GAPPED`, left `x=-4.4`)
 *   2. Heavy Steel Safecracker Workbench (`x=0`) with acoustic glass cutaway hood, 3 spinning brass GPU tumbler wheels (`1.42 GH/s`), fracturing bronze seal halves & rising Golden Master Keycard (`Winter2024!SQL`)
 *   3. Right-Side Hashcat Mode 13100 Telemetry Rack (`best64.rule · 6.0s`, right `x=4.4`)
 */
export function buildKerbStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x111827,
    floorTrimHex: 0xf43f5e,
    wallColor: 0x1f2937,
    pillarColor: 0x374151,
    gridColor: 0x334155,
    signTitle: 'STEP 3 · AIR-GAPPED BASEMENT SAFECRACKER BENCH',
    signSubtitle: 'HASHCAT -M 13100 (1.42 GH/S) · ZERO EID 4625 LOCKOUTS · WINTER2024!SQL',
    signBgHex: '#111827',
    signBorderHex: '#F43F5E',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Severed Air-Gap Conduit & Silent DC Lockout Gauge (Left x = -4.4) ---
  const airgapGroup = new THREE.Group();
  airgapGroup.position.set(-4.4, 0, 0.2);
  root.add(airgapGroup);
  airgapGroup.add(createContactDisc(materials, 1.25, 0.018));

  const gaugeStand = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 2.35, 1.0),
    materials.createToonMaterial(0x1e293b)
  );
  gaugeStand.position.y = 1.175;
  addAnimeInkEdges(gaugeStand, materials.inkLineMaterial, 24);
  airgapGroup.add(gaugeStand);

  const silentTex = createPlaqueTexture(
    'DC LOCKOUT MONITOR',
    'EID 4625: 0 (SILENT)',
    '#052E16',
    '#38BDF8',
    '#A7F3D0'
  );
  textures.push(silentTex);

  const silentFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.75, 0.95),
    new THREE.MeshBasicMaterial({ map: silentTex })
  );
  silentFace.position.set(0, 1.65, 0.51);
  airgapGroup.add(silentFace);

  // Severed cable stubs showing physical air-gap from CORP-DC01
  const stubL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.7, 10),
    materials.createToonMaterial(0x475569)
  );
  stubL.rotation.z = Math.PI / 2;
  stubL.position.set(-0.52, 2.65, 0);
  airgapGroup.add(stubL);

  const stubR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.7, 10),
    materials.createToonMaterial(0x475569)
  );
  stubR.rotation.z = Math.PI / 2;
  stubR.position.set(0.52, 2.65, 0);
  airgapGroup.add(stubR);

  // --- PROP 2: Central Heavy Safecracker Workbench & 3 Brass GPU Tumblers (Center x = 0) ---
  const benchGroup = new THREE.Group();
  benchGroup.position.set(0, 0, 0.3);
  root.add(benchGroup);
  benchGroup.add(createContactDisc(materials, 2.45, 0.018));

  const benchBase = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 1.35, 2.0),
    materials.createToonMaterial(0x334155)
  );
  benchBase.position.y = 0.675;
  addAnimeInkEdges(benchBase, materials.inkLineMaterial, 24);
  benchGroup.add(benchBase);

  const benchDeck = new THREE.Mesh(
    new THREE.BoxGeometry(4.45, 0.16, 2.2),
    materials.createToonMaterial(0x475569)
  );
  benchDeck.position.y = 1.42;
  addAnimeInkEdges(benchDeck, materials.inkLineMaterial, 24);
  benchGroup.add(benchDeck);

  // 3 High-Speed Spinning Brass GPU Tumbler Wheels
  const tumblers: THREE.Group[] = [];
  const wheelX = [-1.2, 0.0, 1.2];
  wheelX.forEach((wx, idx) => {
    const wheel = new THREE.Group();
    wheel.position.set(wx, 2.05, -0.05);
    benchGroup.add(wheel);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.54, 0.24, 18),
      materials.createToonMaterial(idx === 1 ? 0xf43f5e : 0xd97706, {
        emissive: idx === 1 ? 0xe11d48 : 0xb45309,
        emissiveIntensity: 0.45,
      })
    );
    disc.rotation.x = Math.PI / 2;
    addAnimeInkEdges(disc, materials.inkLineMaterial, 24);
    wheel.add(disc);

    // Notches so rotation is unmistakable
    for (let n = 0; n < 4; n++) {
      const ang = (n * Math.PI) / 2;
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.26, 0.28),
        materials.createToonMaterial(0xfef08a)
      );
      tooth.position.set(Math.cos(ang) * 0.56, Math.sin(ang) * 0.56, 0);
      tooth.rotation.z = ang + Math.PI / 2;
      wheel.add(tooth);
    }

    tumblers.push(wheel);
  });

  // Fracturing Brittle Bronze RC4 Seal Halves (front cradle)
  const sealLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.36, 0.42),
    materials.createToonMaterial(0xb45309, {
      emissive: 0x92400e,
      emissiveIntensity: 0.35,
    })
  );
  sealLeft.position.set(-0.39, 1.72, 0.62);
  addAnimeInkEdges(sealLeft, materials.inkLineMaterial, 24);
  benchGroup.add(sealLeft);

  const sealRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.36, 0.42),
    materials.createToonMaterial(0xb45309, {
      emissive: 0x92400e,
      emissiveIntensity: 0.35,
    })
  );
  sealRight.position.set(0.39, 1.72, 0.62);
  addAnimeInkEdges(sealRight, materials.inkLineMaterial, 24);
  benchGroup.add(sealRight);

  // Rising Glowing Golden Master Keycard (`Winter2024!SQL`)
  const keyTex = createPlaqueTexture(
    'CRACKED · SVC_SQL_PROD',
    'Winter2024!SQL',
    '#422006',
    '#FACC15',
    '#FEF9C3'
  );
  textures.push(keyTex);

  const masterKeycard = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.92, 0.1),
    [
      materials.createToonMaterial(0xfacc15),
      materials.createToonMaterial(0xfacc15),
      materials.createToonMaterial(0xfacc15),
      materials.createToonMaterial(0xfacc15),
      new THREE.MeshBasicMaterial({ map: keyTex }),
      materials.createToonMaterial(0x713f12),
    ]
  );
  masterKeycard.position.set(0, 1.9, 0.62);
  addAnimeInkEdges(masterKeycard, materials.inkLineMaterial, 24);
  benchGroup.add(masterKeycard);

  // Acoustic Glass Cutaway Hood (hinged at rear top of bench)
  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.85, -0.95);
  benchGroup.add(hoodPivot);

  const hoodGlass = new THREE.Mesh(
    new THREE.BoxGeometry(4.15, 1.4, 1.95),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    })
  );
  hoodGlass.position.set(0, -0.68, 0.95);
  hoodPivot.add(hoodGlass);

  const hoodRib = new THREE.Mesh(
    new THREE.BoxGeometry(4.25, 0.12, 0.14),
    materials.createToonMaterial(0x94a3b8)
  );
  hoodRib.position.set(0, -1.34, 1.92);
  addAnimeInkEdges(hoodRib, materials.inkLineMaterial, 24);
  hoodPivot.add(hoodRib);

  // --- PROP 3: Right-Side Hashcat Mode 13100 Telemetry Rack (Right x = 4.4) ---
  const rigGroup = new THREE.Group();
  rigGroup.position.set(4.4, 0, 0.2);
  root.add(rigGroup);
  rigGroup.add(createContactDisc(materials, 1.25, 0.018));

  const rigTower = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 2.75, 1.05),
    materials.createToonMaterial(0x1e293b)
  );
  rigTower.position.y = 1.375;
  addAnimeInkEdges(rigTower, materials.inkLineMaterial, 24);
  rigGroup.add(rigTower);

  const rigTex = createPlaqueTexture(
    'HASHCAT -M 13100',
    '1.42 GH/s · 6.0s',
    '#2E0B16',
    '#F43F5E',
    '#FFE4E6'
  );
  textures.push(rigTex);

  const rigScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.96),
    new THREE.MeshBasicMaterial({ map: rigTex })
  );
  rigScreen.position.set(0, 1.95, 0.54);
  rigGroup.add(rigScreen);

  // 4 GPU load bars
  const gpuBars: THREE.MeshToonMaterial[] = [];
  for (let i = 0; i < 4; i++) {
    const bm = materials.createToonMaterial(0xf43f5e, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.2,
    });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.1), bm);
    bar.position.set(-0.6 + i * 0.4, 0.9, 0.54);
    rigGroup.add(bar);
    gpuBars.push(bm);
  }

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.25, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.2, 3.45, 0.55);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 13.0),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % KERB_STEP_DURATION_SEC) + KERB_STEP_DURATION_SEC) %
          KERB_STEP_DURATION_SEC) /
        KERB_STEP_DURATION_SEC;
      const frame = evaluateKerbStep3State(tNorm, cutawayMode);

      // Cutaway acoustic hood tilts backward cleanly
      hoodPivot.rotation.x = -frame.cutawayOpen * 1.18;

      // 3 brass tumblers accelerate rapidly during cracking phase
      const spinSpeed = 1.2 + frame.tumblerRpm * 9.5;
      tumblers.forEach((w, idx) => {
        w.rotation.z = timeSec * spinSpeed * (idx % 2 === 0 ? 1 : -1.15);
      });

      // Bronze seal splits open as hash is cracked
      const split = easeOutCubic(frame.sealFracture);
      sealLeft.position.x = -0.39 - split * 0.52;
      sealLeft.rotation.z = split * 0.32;
      sealRight.position.x = 0.39 + split * 0.52;
      sealRight.rotation.z = -split * 0.32;

      // Golden Master Keycard rises proudly from the fractured bronze seal
      masterKeycard.visible = frame.keycardRise > 0.04;
      masterKeycard.position.y = 1.85 + easeOutBack(frame.keycardRise) * 1.45;
      masterKeycard.rotation.y = Math.sin(timeSec * 2.0) * 0.14;

      // GPU bars cascade with cracking load
      gpuBars.forEach((bm, idx) => {
        bm.emissiveIntensity =
          frame.tumblerRpm > idx * 0.22 ? 1.25 : 0.2;
      });

      return {
        glitchIntensity: frame.sealFracture * 0.55,
        magicDustIntensity: 0.25 + frame.tumblerRpm * 0.55,
        stasisIntensity: frame.keycardRise * 0.3,
        brakeReleaseBoost: frame.sealFracture * 0.5,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
