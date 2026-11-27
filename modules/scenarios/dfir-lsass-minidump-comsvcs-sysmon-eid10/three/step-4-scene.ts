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
import { evaluateLsassStep4State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LSASS Step #4 (`lsass-step4-sysmon10`)
 * Room: Elevated Glass Sysmon Guard Booth & SOC Containment Hall (EID 10 CallTrace Spotlight + RunAsPPL Shield).
 */
export function buildLsassStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x262438,
    floorTrimHex: 0x7c3aed,
    wallColor: 0x1b192d,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 4 · SYSMON EID 10 & RUNASPPL HARDENING',
    signSubtitle: 'CALLTRACE (COMSVCS + DBGCORE) -> ISOLATION & PPL SHIELD',
    signBgHex: '#1E1B4B',
    signBorderHex: '#7C3AED',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const brassMat = materials.createToonMaterial(0xd97706);
  const violetMat = materials.createToonMaterial(0x7c3aed);
  const skyMat = materials.createToonMaterial(0x38bdf8);
  const emeraldMat = materials.createToonMaterial(0x10b981);

  // Prop 1: Right Elevated Glass Sysmon Kernel Security Guard Booth (x = 1.9, z = -0.3)
  const boothGroup = new THREE.Group();
  boothGroup.position.set(1.9, 0, -0.3);
  boothGroup.add(createContactDisc(materials, 1.55));

  const pylon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.65, 1.3), darkMat);
  pylon.position.y = 0.825;
  addAnimeInkEdges(pylon, materials.inkLineMaterial, 24);
  boothGroup.add(pylon);

  const boothGlassMat = new THREE.MeshToonMaterial({
    color: 0xc4b5fd,
    transparent: true,
    opacity: 0.44,
    gradientMap: materials.gradientMap,
  });
  const boothCabin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.45, 1.65), boothGlassMat);
  boothCabin.position.y = 2.4;
  addAnimeInkEdges(boothCabin, materials.inkLineMaterial, 26);
  boothGroup.add(boothCabin);

  const boothRoof = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.24, 1.85), darkMat);
  boothRoof.position.y = 3.22;
  boothGroup.add(boothRoof);

  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, toneMapped: false });
  const beaconDome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), beaconMat);
  beaconDome.position.y = 3.55;
  boothGroup.add(beaconDome);

  const siemTex = createPlaqueTexture(
    'SYSMON EID 10 · 0x1010',
    'COMSVCS -> DBGCORE TRACE',
    '#3B0764',
    '#A855F7',
    '#F5D0FE'
  );
  textures.push(siemTex);
  const siemScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.85),
    new THREE.MeshBasicMaterial({ map: siemTex })
  );
  siemScreen.position.set(0, 2.42, 0.84);
  boothGroup.add(siemScreen);
  root.add(boothGroup);

  // Prop 2: Left Caught Photographer Cart Pinned Under Violet CallTrace Spotlight (x = -2.2, z = 0.45)
  const caughtCart = new THREE.Group();
  caughtCart.position.set(-2.2, 0, 0.45);
  caughtCart.add(createContactDisc(materials, 1.35));

  const cartBase = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.95, 1.25), darkMat);
  cartBase.position.y = 0.475;
  addAnimeInkEdges(cartBase, materials.inkLineMaterial, 24);
  const camHead = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.85), brassMat);
  camHead.position.y = 1.45;
  addAnimeInkEdges(camHead, materials.inkLineMaterial, 24);
  caughtCart.add(cartBase, camHead);

  // Violet spotlight beam from Guard Booth beacon (1.9, 3.55, -0.3) -> Cart (-2.2, 1.45, 0.45)
  const beamFrom = new THREE.Vector3(1.9, 3.55, -0.3);
  const beamTo = new THREE.Vector3(-2.2, 1.45, 0.45);
  const beamDir = new THREE.Vector3().subVectors(beamTo, beamFrom);
  const beamMid = new THREE.Vector3().addVectors(beamFrom, beamTo).multiplyScalar(0.5);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.0,
    toneMapped: false,
  });
  const callTraceBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.72, beamDir.length(), 16),
    beamMat
  );
  callTraceBeam.position.copy(beamMid);
  callTraceBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamDir.clone().normalize());
  root.add(caughtCart, callTraceBeam);

  // Prop 3: Dropping Cyan RunAsPPL + Credential Guard Vault Blast Shield (x = -0.2, z = -0.1)
  const shieldGroup = new THREE.Group();
  const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.35, 0.22), skyMat);
  addAnimeInkEdges(shieldPlate, materials.inkLineMaterial, 22);
  const shieldBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), emeraldMat);
  shieldBadge.position.set(0, 0.2, 0.22);
  const shieldTex = createPlaqueTexture(
    'RUNASPPL = 1 ACTIVE',
    'CREDENTIAL GUARD VBS',
    '#064E3B',
    '#10B981',
    '#ECFDF5'
  );
  textures.push(shieldTex);
  const shieldPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.56),
    new THREE.MeshBasicMaterial({ map: shieldTex })
  );
  shieldPlaque.position.set(0, -0.65, 0.13);
  shieldGroup.add(shieldPlate, shieldBadge, shieldPlaque);
  shieldGroup.position.set(-0.2, 4.35, -0.1);
  root.add(shieldGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(1.9, 3.85, -0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-2.2, 2.5, 0.45);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.6, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.2, 2.4, 0.1),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLsassStep4State(timeSec, cutawayMode);

      beaconDome.scale.setScalar(1 + s.boothAlarm * 0.35 + Math.sin(timeSec * 8) * 0.06);
      boothGlassMat.opacity = 0.48 - s.cutawayOpen * 0.34;

      callTraceBeam.visible = s.callTraceBeam > 0.05;
      beamMat.opacity = s.callTraceBeam * 0.44;

      // RunAsPPL cyan blast shield drops into hardened floor lock
      shieldGroup.position.y = 4.35 - easeOutCubic(s.pplShieldDrop) * 2.85;
      shieldBadge.rotation.y = timeSec * 1.8;

      shell.accentStripMat.color.setHex(s.isolated ? 0x10b981 : 0x7c3aed);

      return {
        glitchIntensity: s.boothAlarm * 0.25,
        magicDustIntensity: s.callTraceBeam * 0.48,
        stasisIntensity: s.pplShieldDrop * 0.35,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
