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
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import {
  KERB_STEP_DURATION_SEC,
  evaluateKerbStep4State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Kerberoasting Step 4 (`kerb-step4-pth`)
 * Exclusive Room: Restricted Finance Suite Corridor (`FIN-SQL01 · SMB/445`)
 * Exclusive Props:
 *   1. Left Launch Pedestal & Gliding Golden Pass-the-Hash Keycard (`8846F7EA...586C` on brass SMB/445 rail)
 *   2. Restricted Finance Suite Vault Door (`FIN-SQL01`, `x=2.75`) with flipping status beacon (`EID 4624 Type 3`), cutaway lockbox exposing `SqlHealthDiag` (`EID 7045`), and descending Armored Emerald `AES-256 + gMSA` Shield
 *   3. Overhead SIEM Anomaly Sentinel Arch (`WKS-OPS-12 -> FIN-SQL01 NTLM Alert`)
 */
export function buildKerbStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f172a,
    floorTrimHex: 0x10b981,
    wallColor: 0x1e293b,
    pillarColor: 0x334155,
    gridColor: 0x334155,
    signTitle: 'STEP 4 · FINANCE SUITE PIVOT VS. AES-256 gMSA SHIELD',
    signSubtitle: 'PASS-THE-HASH SMB/445 (EID 4624 / 7045) -> EMERALD AES-256 + 120-CHAR gMSA',
    signBgHex: '#062019',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.2,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Launch Pedestal & Brass SMB/445 Rail (x = -3.8 -> +1.5) ---
  const launchGroup = new THREE.Group();
  launchGroup.position.set(-3.8, 0, 0.25);
  root.add(launchGroup);
  launchGroup.add(createContactDisc(materials, 1.35, 0.018));

  const wksDesk = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 1.5, 1.25),
    materials.createToonMaterial(0x334155)
  );
  wksDesk.position.y = 0.75;
  addAnimeInkEdges(wksDesk, materials.inkLineMaterial, 24);
  launchGroup.add(wksDesk);

  const wksTex = createPlaqueTexture(
    'WKS-OPS-12 · PTH',
    'NTLM 8846...586C',
    '#2E1018',
    '#F59E0B',
    '#FEF3C7'
  );
  textures.push(wksTex);

  const wksScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.78, 0.9),
    new THREE.MeshBasicMaterial({ map: wksTex })
  );
  wksScreen.position.set(0, 1.0, 0.64);
  launchGroup.add(wksScreen);

  // Brass SMB/445 elevated transport rail
  const railBar = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 0.12, 0.26),
    materials.createToonMaterial(0xd97706)
  );
  railBar.position.set(-0.6, 1.95, 0.25);
  addAnimeInkEdges(railBar, materials.inkLineMaterial, 24);
  root.add(railBar);

  // Gliding Golden Master Keycard
  const cardTex = createPlaqueTexture(
    'PASS-THE-HASH',
    'SMB TCP/445',
    '#422006',
    '#FACC15',
    '#FEF9C3'
  );
  textures.push(cardTex);

  const keycard = new THREE.Mesh(
    new THREE.BoxGeometry(1.38, 0.78, 0.09),
    [
      materials.createToonMaterial(0xfacc15),
      materials.createToonMaterial(0xfacc15),
      materials.createToonMaterial(0xfacc15),
      materials.createToonMaterial(0xfacc15),
      new THREE.MeshBasicMaterial({ map: cardTex }),
      materials.createToonMaterial(0x78350f),
    ]
  );
  keycard.position.set(-3.3, 2.38, 0.35);
  addAnimeInkEdges(keycard, materials.inkLineMaterial, 24);
  root.add(keycard);

  // --- PROP 2: Restricted Finance Suite Vault Door (`FIN-SQL01`, Right x = 2.8) ---
  const suiteGroup = new THREE.Group();
  suiteGroup.position.set(2.8, 0, 0.2);
  root.add(suiteGroup);
  suiteGroup.add(createContactDisc(materials, 2.0, 0.018));

  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 3.65, 1.35),
    materials.createToonMaterial(0x1e293b)
  );
  doorFrame.position.y = 1.825;
  addAnimeInkEdges(doorFrame, materials.inkLineMaterial, 24);
  suiteGroup.add(doorFrame);

  const suiteTex = createPlaqueTexture(
    'FIN-SQL01 · SUITE',
    'EID 4624 TYPE 3',
    '#0F172A',
    '#38BDF8',
    '#E0F2FE'
  );
  textures.push(suiteTex);

  const suiteHeader = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 0.72),
    new THREE.MeshBasicMaterial({ map: suiteTex })
  );
  suiteHeader.position.set(0, 3.15, 0.69);
  suiteGroup.add(suiteHeader);

  // Status beacon lamp atop Finance Suite Door
  const beaconMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.6,
  });
  const beaconLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 12),
    beaconMat
  );
  beaconLamp.position.set(0, 3.92, 0.1);
  addAnimeInkEdges(beaconLamp, materials.inkLineMaterial, 24);
  suiteGroup.add(beaconLamp);

  // Internal SqlHealthDiag (EID 7045) Service Module behind cutaway door plate
  const svcTex = createPlaqueTexture(
    'EID 7045 · SERVICE',
    'SqlHealthDiag',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(svcTex);

  const svcModule = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.05, 0.45),
    [
      materials.createToonMaterial(0x9f1239),
      materials.createToonMaterial(0x9f1239),
      materials.createToonMaterial(0x9f1239),
      materials.createToonMaterial(0x9f1239),
      new THREE.MeshBasicMaterial({ map: svcTex }),
      materials.createToonMaterial(0x4c0519),
    ]
  );
  svcModule.position.set(0, 1.6, 0.42);
  addAnimeInkEdges(svcModule, materials.inkLineMaterial, 24);
  suiteGroup.add(svcModule);

  // Hinged Steel Cutaway Door Leaf
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-1.12, 1.6, 0.7);
  suiteGroup.add(doorPivot);

  const doorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(2.24, 2.25, 0.14),
    materials.createToonMaterial(0x475569)
  );
  doorLeaf.position.set(1.12, 0, 0);
  addAnimeInkEdges(doorLeaf, materials.inkLineMaterial, 24);
  doorPivot.add(doorLeaf);

  // Descending Armored Emerald AES-256 + 120-Char gMSA Shield
  const shieldTex = createPlaqueTexture(
    'HARDENED · 0x12',
    'AES-256 + gMSA',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(shieldTex);

  const emeraldShield = new THREE.Group();
  emeraldShield.position.set(0, 4.9, 0.95);
  suiteGroup.add(emeraldShield);

  const shieldMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.9,
  });
  const shieldSlab = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 2.65, 0.16),
    [
      shieldMat,
      shieldMat,
      shieldMat,
      shieldMat,
      new THREE.MeshBasicMaterial({ map: shieldTex }),
      shieldMat,
    ]
  );
  addAnimeInkEdges(shieldSlab, materials.inkLineMaterial, 24);
  emeraldShield.add(shieldSlab);

  // --- PROP 3: Overhead SIEM Anomaly Arch (Center x = -0.5) ---
  const archGroup = new THREE.Group();
  archGroup.position.set(-0.5, 0, -1.25);
  root.add(archGroup);

  for (const ax of [-1.45, 1.45]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 3.6, 0.24),
      materials.createToonMaterial(0x334155)
    );
    post.position.set(ax, 1.8, 0);
    addAnimeInkEdges(post, materials.inkLineMaterial, 24);
    archGroup.add(post);
  }
  const archBeam = new THREE.Mesh(
    new THREE.BoxGeometry(3.25, 0.32, 0.34),
    materials.createToonMaterial(0x0ea5e9, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.55,
    })
  );
  archBeam.position.set(0, 3.65, 0);
  addAnimeInkEdges(archBeam, materials.inkLineMaterial, 24);
  archGroup.add(archBeam);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.1, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.8, 4.1, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % KERB_STEP_DURATION_SEC) + KERB_STEP_DURATION_SEC) %
          KERB_STEP_DURATION_SEC) /
        KERB_STEP_DURATION_SEC;
      const frame = evaluateKerbStep4State(tNorm, cutawayMode);

      // Golden Keycard glides along SMB/445 rail toward FIN-SQL01
      const glide = easeOutCubic(frame.keycardGlide);
      keycard.position.x = -3.3 + glide * 4.7;
      keycard.position.y = 2.38 + Math.sin(glide * Math.PI) * 0.25;

      // Cutaway vault door swings open to reveal SqlHealthDiag (EID 7045)
      doorPivot.rotation.y = -frame.cutawayOpen * 1.25;
      svcModule.visible = frame.serviceInstall > 0.1 || frame.cutawayOpen > 0.2;
      svcModule.position.z = 0.42 + frame.serviceInstall * 0.18;

      // Status beacon turns crimson on breach, then restores to emerald when AES shield locks
      if (frame.doorBreach > 0.25 && frame.emeraldShieldDrop < 0.5) {
        beaconMat.color.setHex(0xe11d48);
        beaconMat.emissive.setHex(0xf43f5e);
        beaconMat.emissiveIntensity = 1.25;
      } else {
        beaconMat.color.setHex(0x10b981);
        beaconMat.emissive.setHex(0x10b981);
        beaconMat.emissiveIntensity = 0.65 + frame.emeraldShieldDrop * 0.7;
      }

      // Armored Emerald AES-256 + gMSA shield descends cleanly across FIN-SQL01
      const shieldDrop = easeOutCubic(frame.emeraldShieldDrop);
      emeraldShield.visible = shieldDrop > 0.02;
      emeraldShield.position.y = 4.9 - shieldDrop * 3.15;

      return {
        glitchIntensity:
          frame.doorBreach * (1 - frame.emeraldShieldDrop) * 0.6,
        magicDustIntensity: 0.25 + frame.keycardGlide * 0.4,
        stasisIntensity: frame.emeraldShieldDrop * 0.55,
        brakeReleaseBoost: frame.doorBreach * 0.35,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
