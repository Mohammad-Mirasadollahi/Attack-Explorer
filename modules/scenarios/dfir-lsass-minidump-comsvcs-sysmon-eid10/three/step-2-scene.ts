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
import { evaluateLsassStep2State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LSASS Step #2 (`lsass-step2-comsvcs`)
 * Room: Signed LOLBin Corridor & Kernel Handle Gate (rundll32 + comsvcs.dll #24 Cart + 0x1010 X-Ray -> LSASS Vault).
 */
export function buildLsassStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x313644,
    floorTrimHex: 0xe11d48,
    wallColor: 0x1c2230,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 2 · COMSVCS.DLL #24 & OPENPROCESS 0x1010',
    signSubtitle: 'SIGNED RUNDLL32.EXE -> PROCESS_VM_READ ON LSASS PID 684',
    signBgHex: '#0F172A',
    signBorderHex: '#E11D48',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const steelMat = materials.createToonMaterial(0x64748b);
  const brassMat = materials.createToonMaterial(0xd97706);
  const goldMat = materials.createToonMaterial(0xfacc15);
  const crimsonMat = materials.createToonMaterial(0xe11d48);

  // Brass floor aisle rails guiding cart toward vault
  for (const rz of [-0.4, 0.8]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.06, 0.1), brassMat);
    rail.position.set(0, 0.04, rz);
    root.add(rail);
  }

  // Prop 1: Certified Brass Vault Photographer Cart (rundll32.exe + comsvcs.dll,#24)
  const cartGroup = new THREE.Group();
  cartGroup.position.set(-2.6, 0, 0.2);
  cartGroup.add(createContactDisc(materials, 1.3));

  const cartDeck = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.85, 1.35), darkMat);
  cartDeck.position.y = 0.68;
  cartDeck.castShadow = true;
  addAnimeInkEdges(cartDeck, materials.inkLineMaterial, 24);
  cartGroup.add(cartDeck);

  // Wheels
  for (const [wx, wz] of [
    [-0.65, -0.58],
    [0.65, -0.58],
    [-0.65, 0.58],
    [0.65, 0.58],
  ]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 16), steelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, 0.24, wz);
    cartGroup.add(wheel);
  }

  // Camera Housing + Brass 0x1010 Aperture Ring
  const camBody = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.85, 0.9), brassMat);
  camBody.position.set(0.1, 1.75, 0);
  addAnimeInkEdges(camBody, materials.inkLineMaterial, 24);
  cartGroup.add(camBody);

  const apertureRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.09, 10, 20), goldMat);
  apertureRing.rotation.y = Math.PI / 2;
  apertureRing.position.set(0.75, 1.75, 0);
  cartGroup.add(apertureRing);

  // Crimson X-Ray Cone (0x1010 PROCESS_VM_READ beam)
  const xrayMat = new THREE.MeshBasicMaterial({
    color: 0xe11d48,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const xrayCone = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.8, 18, 1, true), xrayMat);
  xrayCone.rotation.z = Math.PI / 2;
  xrayCone.position.set(2.15, 1.75, 0);
  cartGroup.add(xrayCone);

  const cartTex = createPlaqueTexture(
    'SIGNED RUNDLL32.EXE',
    'COMSVCS.DLL,#24 · 0x1010',
    '#1C1917',
    '#F59E0B',
    '#FEF3C7'
  );
  textures.push(cartTex);
  const cartPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.68, 0.52),
    new THREE.MeshBasicMaterial({ map: cartTex })
  );
  cartPlaque.position.set(0, 0.68, 0.69);
  cartGroup.add(cartPlaque);
  root.add(cartGroup);

  // Prop 2: Unprotected Circular Steel LSASS Safe-Deposit Vault (PPL=0) with Cutaway Drawers
  const vaultGroup = new THREE.Group();
  vaultGroup.position.set(2.8, 0, 0.15);
  vaultGroup.add(createContactDisc(materials, 1.95));

  const vaultShell = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.25, 2.1), steelMat);
  vaultShell.position.y = 1.625;
  vaultShell.castShadow = true;
  addAnimeInkEdges(vaultShell, materials.inkLineMaterial, 24);
  vaultGroup.add(vaultShell);

  // Cutaway glass side wall exposing 6 golden NTLM/Kerberos credential boxes
  const vaultGlassMat = new THREE.MeshToonMaterial({
    color: 0xbae6fd,
    transparent: true,
    opacity: 0.52,
    gradientMap: materials.gradientMap,
  });
  const vaultGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.55, 1.75), vaultGlassMat);
  vaultGlass.position.set(-1.38, 1.75, 0);
  vaultGroup.add(vaultGlass);

  // 6 glowing golden LogonSessionList passkey drawers
  const drawerMats: THREE.MeshToonMaterial[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const m = materials.createToonMaterial(0xfacc15);
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.52, 0.62), m);
      box.position.set(-0.65 + col * 0.9, 1.05 + row * 0.72, -0.38 + col * 0.76);
      addAnimeInkEdges(box, materials.inkLineMaterial, 24);
      vaultGroup.add(box);
      drawerMats.push(m);
    }
  }

  // Prop 3: Circular Steel Door Wheel & Sysmon EID 10 Laser Arch
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 10, 20), brassMat);
  wheel.rotation.y = Math.PI / 2;
  wheel.position.set(-1.45, 1.75, 0);
  vaultGroup.add(wheel);

  const vaultTex = createPlaqueTexture(
    'LSASS.EXE PID 684',
    'PPL=0 · UNPROTECTED',
    '#4C0519',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(vaultTex);
  const vaultPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.56),
    new THREE.MeshBasicMaterial({ map: vaultTex })
  );
  vaultPlaque.position.set(0, 0.45, 1.08);
  vaultGroup.add(vaultPlaque);
  root.add(vaultGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.5, 2.95, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.8, 3.45, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.3, 4.4, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.35, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.8, 2.0, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLsassStep2State(timeSec, cutawayMode);

      cartGroup.position.x = -2.6 + easeOutCubic(s.cartRoll) * 2.25;
      apertureRing.rotation.x = s.apertureOpen * Math.PI * 2;
      apertureRing.scale.setScalar(1 + s.apertureOpen * 0.35);

      xrayCone.visible = s.xrayConeActive > 0.05;
      xrayMat.opacity = s.xrayConeActive * 0.45;

      vaultGlassMat.opacity = 0.54 - s.cutawayOpen * 0.42;
      wheel.rotation.x = timeSec * 0.9;
      shell.accentStripMat.color.setHex(s.xrayConeActive > 0.4 ? 0xe11d48 : 0xf59e0b);

      return {
        glitchIntensity: s.xrayConeActive * 0.3,
        magicDustIntensity: s.apertureOpen * 0.4,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
