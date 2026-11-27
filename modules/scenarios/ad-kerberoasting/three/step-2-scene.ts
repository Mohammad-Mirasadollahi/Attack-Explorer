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
  evaluateKerbStep2State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Kerberoasting Step 2 (`kerb-step2-tgs`)
 * Exclusive Room: Concierge KDC Ticket Window (`CORP-DC01 · TCP/88`)
 * Exclusive Props:
 *   1. Brass Pneumatic Tube Dispatch Arch (`x=-2.7`) firing glowing `TGS-REQ 0x17` capsule
 *   2. Art-Deco Concierge KDC Stamp Press (`x=0.25`) with hinged cutaway brass shroud exposing NTLM-hash rollers & dropping crimson wax stamp
 *   3. Brittle Soft-Bronze `$krb5tgs$23$` Voucher gliding onto front-right velvet tray (`x=1.5`)
 *   4. Right-Side `Security EID 4769` Flash Ledger Pedestal (`x=4.35`)
 */
export function buildKerbStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x1e1b2e,
    floorTrimHex: 0xe11d48,
    wallColor: 0x262137,
    pillarColor: 0x3b3355,
    gridColor: 0x4c436b,
    signTitle: 'STEP 2 · CONCIERGE KDC TICKET PRESS (TGS-REQ 0x17)',
    signSubtitle: 'CORP-DC01 TCP/88 · SOFT-BRONZE RC4-HMAC VOUCHER · SECURITY EID 4769',
    signBgHex: '#1F1124',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const brassMat = materials.createToonMaterial(0xd97706);
  const darkWalnutMat = materials.createToonMaterial(0x451a03);

  // --- PROP 1: Brass Pneumatic Tube Dispatch Arch (Left x = -3.6 -> -0.7) ---
  const tubeGroup = new THREE.Group();
  root.add(tubeGroup);
  const dispatchBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.78, 1.55, 16),
    brassMat
  );
  dispatchBase.position.set(-3.75, 0.775, 0.2);
  addAnimeInkEdges(dispatchBase, materials.inkLineMaterial, 24);
  tubeGroup.add(dispatchBase);
  const disc1 = createContactDisc(materials, 1.1, 0.018);
  disc1.position.set(-3.75, 0.018, 0.2);
  root.add(disc1);

  const tubePipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 3.1, 16),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    })
  );
  tubePipe.rotation.z = Math.PI / 2;
  tubePipe.position.set(-2.2, 2.25, 0.2);
  tubeGroup.add(tubePipe);

  // Brass collar rings along tube
  for (const rx of [-3.4, -2.2, -1.0]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.055, 8, 20),
      brassMat
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.set(rx, 2.25, 0.2);
    tubeGroup.add(ring);
  }

  const reqCapsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.16, 0.36, 8, 14),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
    })
  );
  reqCapsule.rotation.z = Math.PI / 2;
  reqCapsule.position.set(-3.45, 2.25, 0.2);
  addAnimeInkEdges(reqCapsule, materials.inkLineMaterial, 24);
  tubeGroup.add(reqCapsule);

  // --- PROP 2: Art-Deco Concierge KDC Stamp Press (Center x = 0.25) ---
  const pressGroup = new THREE.Group();
  pressGroup.position.set(0.25, 0, 0.25);
  root.add(pressGroup);
  pressGroup.add(createContactDisc(materials, 2.15, 0.018));

  const counterBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.45, 1.65),
    darkWalnutMat
  );
  counterBody.position.y = 0.725;
  addAnimeInkEdges(counterBody, materials.inkLineMaterial, 24);
  pressGroup.add(counterBody);

  const marbleTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.45, 0.16, 1.85),
    materials.createToonMaterial(0xe2e8f0)
  );
  marbleTop.position.y = 1.52;
  addAnimeInkEdges(marbleTop, materials.inkLineMaterial, 24);
  pressGroup.add(marbleTop);

  // Twin brass gantry columns holding stamp arm
  for (const cx of [-1.15, 1.15]) {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 2.1, 14),
      brassMat
    );
    col.position.set(cx, 2.6, -0.15);
    addAnimeInkEdges(col, materials.inkLineMaterial, 24);
    pressGroup.add(col);
  }
  const bridgeBeam = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 0.28, 0.52),
    brassMat
  );
  bridgeBeam.position.set(0, 3.62, -0.15);
  addAnimeInkEdges(bridgeBeam, materials.inkLineMaterial, 24);
  pressGroup.add(bridgeBeam);

  // Internal NTLM-Hash Encryption Rollers (exposed when cutaway opens)
  const rollers: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const r = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 1.3, 14),
      materials.createToonMaterial(0xf59e0b, {
        emissive: 0xd97706,
        emissiveIntensity: 0.45,
      })
    );
    r.rotation.z = Math.PI / 2;
    r.position.set(0, 1.05 - i * 0.45, 0.1);
    addAnimeInkEdges(r, materials.inkLineMaterial, 24);
    pressGroup.add(r);
    rollers.push(r);
  }

  // Hinged Cutaway Brass Front Shroud
  const shroudPivot = new THREE.Group();
  shroudPivot.position.set(0, 1.44, 0.84);
  pressGroup.add(shroudPivot);

  const deskPlaqueTex = createPlaqueTexture(
    'KDC · CORP-DC01',
    'ETYPE 0x17 · RC4',
    '#2A1215',
    '#F59E0B',
    '#FDE68A'
  );
  textures.push(deskPlaqueTex);

  const shroudDoor = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 1.12, 0.08),
    [
      brassMat,
      brassMat,
      brassMat,
      brassMat,
      new THREE.MeshBasicMaterial({ map: deskPlaqueTex }),
      brassMat,
    ]
  );
  shroudDoor.position.set(0, -0.58, 0.02);
  addAnimeInkEdges(shroudDoor, materials.inkLineMaterial, 24);
  shroudPivot.add(shroudDoor);

  // Articulated Crimson Wax Stamp Arm
  const stampArm = new THREE.Group();
  stampArm.position.set(0, 2.95, 0.05);
  pressGroup.add(stampArm);

  const pistonRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.95, 12),
    materials.createToonMaterial(0x94a3b8)
  );
  pistonRod.position.y = 0.25;
  stampArm.add(pistonRod);

  const crimsonDie = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.48, 0.34, 18),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.75,
    })
  );
  crimsonDie.position.y = -0.32;
  addAnimeInkEdges(crimsonDie, materials.inkLineMaterial, 24);
  stampArm.add(crimsonDie);

  // --- PROP 3: Soft-Bronze Sealed Voucher ($krb5tgs$23$) ---
  const voucherTex = createPlaqueTexture(
    '$krb5tgs$23$',
    'RC4-HMAC · 0x17',
    '#451A03',
    '#F43F5E',
    '#FDE68A'
  );
  textures.push(voucherTex);

  const voucherGroup = new THREE.Group();
  voucherGroup.position.set(0.25, 1.66, 0.42);
  root.add(voucherGroup);

  const voucherCard = new THREE.Mesh(
    new THREE.BoxGeometry(1.32, 0.14, 0.78),
    [
      materials.createToonMaterial(0xb45309),
      materials.createToonMaterial(0xb45309),
      new THREE.MeshBasicMaterial({ map: voucherTex }),
      materials.createToonMaterial(0x78350f),
      materials.createToonMaterial(0xb45309),
      materials.createToonMaterial(0xb45309),
    ]
  );
  addAnimeInkEdges(voucherCard, materials.inkLineMaterial, 24);
  voucherGroup.add(voucherCard);

  const waxSeal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.08, 16),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.65,
    })
  );
  waxSeal.position.set(0.36, 0.1, 0.15);
  voucherGroup.add(waxSeal);

  // --- PROP 4: Right-Side Security EID 4769 Flash Ledger Pedestal ---
  const ledgerGroup = new THREE.Group();
  ledgerGroup.position.set(4.35, 0, 0.2);
  root.add(ledgerGroup);
  ledgerGroup.add(createContactDisc(materials, 1.3, 0.018));

  const ledgerPillar = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 2.55, 1.1),
    materials.createToonMaterial(0x1e293b)
  );
  ledgerPillar.position.y = 1.275;
  addAnimeInkEdges(ledgerPillar, materials.inkLineMaterial, 24);
  ledgerGroup.add(ledgerPillar);

  const eidTex = createPlaqueTexture(
    'SECURITY EID 4769',
    'NON-$ · ETYPE 0x17',
    '#2E1018',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(eidTex);

  const eidScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 1.05),
    new THREE.MeshBasicMaterial({ map: eidTex })
  );
  eidScreen.position.set(0, 1.75, 0.56);
  ledgerGroup.add(eidScreen);

  const flashLampMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.25,
  });
  const flashLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 12),
    flashLampMat
  );
  flashLamp.position.set(0, 2.8, 0);
  addAnimeInkEdges(flashLamp, materials.inkLineMaterial, 24);
  ledgerGroup.add(flashLamp);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.1, 3.25, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.65, 2.95, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.4, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.25, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.3, 2.1, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % KERB_STEP_DURATION_SEC) + KERB_STEP_DURATION_SEC) %
          KERB_STEP_DURATION_SEC) /
        KERB_STEP_DURATION_SEC;
      const frame = evaluateKerbStep2State(tNorm, cutawayMode);

      // Capsule zips through brass pneumatic tube
      reqCapsule.position.x = -3.45 + easeOutCubic(frame.capsuleTravel) * 2.75;

      // Hinged brass shroud opens to expose internal NTLM encryption rollers
      shroudPivot.rotation.x = frame.cutawayOpen * 1.32;
      rollers.forEach((r, i) => {
        r.rotation.x = timeSec * (i === 0 ? 3.2 : -3.2);
      });

      // Crimson stamp slams onto voucher
      stampArm.position.y = 2.95 - frame.stampStrike * 0.88;

      // Soft-bronze voucher slides out toward velvet tray
      voucherGroup.position.x = 0.25 + easeOutCubic(frame.voucherSlide) * 1.75;
      voucherGroup.position.y = 1.66 + Math.sin(frame.voucherSlide * Math.PI) * 0.12;
      waxSeal.visible = frame.stampStrike > 0.3 || frame.voucherSlide > 0.1;

      // Security EID 4769 flash lamp lights up in Phase 3
      flashLampMat.emissiveIntensity =
        0.25 + frame.eid4769Flash * (1.2 + 0.4 * Math.sin(timeSec * 8));

      return {
        glitchIntensity: frame.stampStrike * 0.48,
        magicDustIntensity: 0.25 + frame.capsuleTravel * 0.35 + frame.voucherSlide * 0.3,
        stasisIntensity: frame.eid4769Flash * 0.3,
        brakeReleaseBoost: frame.stampStrike * 0.45,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
