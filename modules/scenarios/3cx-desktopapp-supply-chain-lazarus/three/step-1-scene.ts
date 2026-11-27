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
import { evaluateThreeCxStep1State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — 3CX Step #1 (`threecx-step1-buildsign`)
 * Room: Cleanroom CI/CD Assembly Line (Sabotage Arm + Gold EV Hologram Press + Inspector Gate).
 */
export function buildThreeCxStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x334155,
    floorTrimHex: 0x10b981,
    wallColor: 0x1e293b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 1 · PRE-SIGNING CLEANROOM TAMPER',
    signSubtitle: 'X_TRADER PIVOT -> TROJANIZED DLLS -> VALID 3CX EV SEAL',
    signBgHex: '#0F172A',
    signBorderHex: '#10B981',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const steelMat = materials.createToonMaterial(0x64748b);
  const whiteMat = materials.createToonMaterial(0xf8fafc);
  const crimsonMat = materials.createToonMaterial(0xe11d48);
  const goldMat = materials.createToonMaterial(0xf59e0b);
  const emeraldMat = materials.createToonMaterial(0x10b981);

  // Cleanroom Conveyor Track spanning x = -4.5 .. +4.2
  const conveyor = new THREE.Group();
  conveyor.position.set(-0.15, 0, 0.2);
  const beltBed = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.28, 1.55), darkMat);
  beltBed.position.y = 1.04;
  beltBed.receiveShadow = true;
  addAnimeInkEdges(beltBed, materials.inkLineMaterial, 24);
  conveyor.add(beltBed);
  for (const lx of [-4.0, -1.2, 1.4, 4.0]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.92, 1.25), steelMat);
    leg.position.set(lx, 0.46, 0);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 24);
    conveyor.add(leg);
    const disc = createContactDisc(materials, 0.72);
    disc.position.set(lx, 0.018, 0);
    conveyor.add(disc);
  }
  root.add(conveyor);

  // Prop 1: Upstream Dark Covert Robotic Sabotage Arm (x = -3.0, z = 0.2)
  const armGantry = new THREE.Group();
  armGantry.position.set(-3.0, 0, 0.2);
  const ventBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 1.2), darkMat);
  ventBox.position.set(0, 4.25, 0);
  addAnimeInkEdges(ventBox, materials.inkLineMaterial, 24);
  armGantry.add(ventBox);

  const sabotageArm = new THREE.Group();
  const armColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.65, 14), darkMat);
  armColumn.position.y = 0.65;
  const armClaw = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.52), crimsonMat);
  armClaw.position.y = -0.15;
  addAnimeInkEdges(armClaw, materials.inkLineMaterial, 22);
  sabotageArm.add(armColumn, armClaw);
  sabotageArm.position.set(0, 3.6, 0);
  armGantry.add(sabotageArm);
  root.add(armGantry);

  // Prop 2: Official Gold EV Hologram Code-Signing Press (x = 0.35, z = 0.2)
  const pressGroup = new THREE.Group();
  pressGroup.position.set(0.35, 0, 0.2);
  for (const px of [-0.92, 0.92]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.6, 0.28), goldMat);
    post.position.set(px, 1.8, -0.45);
    addAnimeInkEdges(post, materials.inkLineMaterial, 24);
    pressGroup.add(post);
  }
  const pressCrown = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.5, 1.35), darkMat);
  pressCrown.position.set(0, 3.55, 0);
  addAnimeInkEdges(pressCrown, materials.inkLineMaterial, 24);
  pressGroup.add(pressCrown);

  const pressPlaqueTex = createPlaqueTexture(
    '3CX EV SIGNING PRESS',
    'VALID CERTIFICATE',
    '#064E3B',
    '#10B981',
    '#ECFDF5'
  );
  textures.push(pressPlaqueTex);
  const pressSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 0.44),
    new THREE.MeshBasicMaterial({ map: pressPlaqueTex })
  );
  pressSign.position.set(0, 3.56, 0.69);
  pressGroup.add(pressSign);

  const pressHead = new THREE.Group();
  const stampDie = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.34, 20), goldMat);
  addAnimeInkEdges(stampDie, materials.inkLineMaterial, 22);
  const stampGlowMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.3,
    toneMapped: false,
  });
  const stampGlow = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.54, 20), stampGlowMat);
  stampGlow.rotation.x = Math.PI / 2;
  stampGlow.position.y = -0.18;
  pressHead.add(stampDie, stampGlow);
  pressHead.position.set(0, 2.95, 0);
  pressGroup.add(pressHead);
  root.add(pressGroup);

  // Prop 3: Right Quality Inspector Archway & Green Authenticode Laser Wand (x = 3.1, z = 0.2)
  const gateGroup = new THREE.Group();
  gateGroup.position.set(3.1, 0, 0.2);
  const archL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.3, 0.32), steelMat);
  archL.position.set(0, 1.65, -0.95);
  const archR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.3, 0.32), steelMat);
  archR.position.set(0, 1.65, 0.95);
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.34, 2.2), darkMat);
  archTop.position.set(0, 3.25, 0);
  addAnimeInkEdges(archTop, materials.inkLineMaterial, 24);
  gateGroup.add(archL, archR, archTop);

  const inspectorLampMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, toneMapped: false });
  const inspectorLamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), inspectorLampMat);
  inspectorLamp.position.set(0, 3.55, 0);
  gateGroup.add(inspectorLamp);

  const scanSheetMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const scanSheet = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 2.1), scanSheetMat);
  scanSheet.rotation.y = Math.PI / 2;
  scanSheet.position.set(0, 2.15, 0);
  gateGroup.add(scanSheet);
  root.add(gateGroup);

  // Hero Gliding Desktop Phone Shell with Cutaway Top Lid + Rigged Gear + Prism + Gold Seal
  const phone = new THREE.Group();
  const baseBody = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.42, 1.02), whiteMat);
  baseBody.position.y = 0.21;
  baseBody.castShadow = true;
  addAnimeInkEdges(baseBody, materials.inkLineMaterial, 24);
  phone.add(baseBody);

  const riggedGear = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 8, 12), crimsonMat);
  riggedGear.rotation.x = Math.PI / 2;
  riggedGear.position.set(-0.34, 0.46, 0);
  phone.add(riggedGear);

  const riggedPrism = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), goldMat);
  riggedPrism.position.set(0.32, 0.48, 0);
  phone.add(riggedPrism);

  const cutawayLid = new THREE.Group();
  const lidPlate = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.16, 1.04), whiteMat);
  lidPlate.position.y = 0.56;
  addAnimeInkEdges(lidPlate, materials.inkLineMaterial, 24);
  const goldSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 18), emeraldMat);
  goldSeal.position.set(0, 0.66, 0);
  const sealRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 8, 18), goldMat);
  sealRing.rotation.x = Math.PI / 2;
  sealRing.position.set(0, 0.67, 0);
  const sealGroup = new THREE.Group();
  sealGroup.add(goldSeal, sealRing);
  cutawayLid.add(lidPlate, sealGroup);
  phone.add(cutawayLid);

  phone.position.set(-3.0, 1.19, 0.2);
  root.add(phone);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.0, 3.85, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(0.35, 3.95, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.6, 3.9, 9.6),
    defaultCameraTarget: new THREE.Vector3(-0.4, 2.2, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.4, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateThreeCxStep1State(timeSec, cutawayMode);

      sabotageArm.position.y = 3.6 - easeOutCubic(s.sabotageArmExtend) * 1.48;
      riggedGear.visible = s.riggedPartsSeated > 0.2;
      riggedPrism.visible = s.riggedPartsSeated > 0.2;
      riggedGear.rotation.z = timeSec * 2.5;
      riggedPrism.rotation.y = timeSec * 1.8;

      phone.position.x = -3.0 + s.phoneXProgress * 6.5;
      cutawayLid.position.y = s.cutawayOpen * 0.88;
      cutawayLid.rotation.z = -s.cutawayOpen * 0.22;

      pressHead.position.y = 2.95 - easeOutCubic(s.pressStampDown) * 0.92;
      stampGlowMat.opacity = 0.2 + s.pressStampDown * 0.7;
      sealGroup.visible = s.hologramAuthentic;

      scanSheet.visible = s.inspectorGreenPass > 0.08;
      inspectorLampMat.color.setHex(s.inspectorGreenPass > 0.25 ? 0x10b981 : 0x94a3b8);
      shell.accentStripMat.color.setHex(s.hologramAuthentic ? 0x10b981 : 0xf59e0b);

      return {
        glitchIntensity: s.sabotageArmExtend * 0.22,
        magicDustIntensity: s.pressStampDown * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
