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
import { evaluateThreeCxStep2State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — 3CX Step #2 (`threecx-step2-feedface`)
 * Room: Macro Phone Cutaway & Cipher Decryption Chamber (ffmpeg Gear + 0xFEEDFACE Prism + RC4 Spool + Hover Radio).
 */
export function buildThreeCxStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x2d2432,
    floorTrimHex: 0xd97706,
    wallColor: 0x1c192b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 2 · 0xFEEDFACE RC4 DECRYPTION',
    signSubtitle: 'FFMPEG.DLL SIDE-LOAD -> VIRTUALALLOC RWX 0x1C948200000',
    signBgHex: '#18181B',
    signBorderHex: '#D97706',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const whiteMat = materials.createToonMaterial(0xf8fafc);
  const crimsonMat = materials.createToonMaterial(0xe11d48);
  const amberMat = materials.createToonMaterial(0xf59e0b);
  const emeraldMat = materials.createToonMaterial(0x10b981);
  const skyMat = materials.createToonMaterial(0x0284c7);

  // Central Workbench Plinth
  const benchGroup = new THREE.Group();
  benchGroup.position.set(0, 0, 0.2);
  benchGroup.add(createContactDisc(materials, 2.8));

  const benchBase = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.05, 3.0), darkMat);
  benchBase.position.y = 0.525;
  benchBase.receiveShadow = true;
  addAnimeInkEdges(benchBase, materials.inkLineMaterial, 24);
  benchGroup.add(benchBase);

  // Open Phone Chassis Tray on Bench
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.45, 2.25), whiteMat);
  chassis.position.y = 1.28;
  chassis.castShadow = true;
  addAnimeInkEdges(chassis, materials.inkLineMaterial, 24);
  benchGroup.add(chassis);

  // Cutaway Upper Phone Shell carrying genuine green-gold seal
  const cutawayLid = new THREE.Group();
  const lidPlate = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.24, 2.3), whiteMat);
  lidPlate.position.y = 1.65;
  addAnimeInkEdges(lidPlate, materials.inkLineMaterial, 24);
  const lidSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 20), emeraldMat);
  lidSeal.position.set(-1.3, 1.8, 0);
  cutawayLid.add(lidPlate, lidSeal);
  benchGroup.add(cutawayLid);

  // Prop 1: Spinning Crimson-Toothed Brass Audio Gear (ffmpeg.dll side-load) on left bay
  const gearGroup = new THREE.Group();
  gearGroup.position.set(-1.35, 1.72, 0);
  const gearHub = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.28, 18), amberMat);
  addAnimeInkEdges(gearHub, materials.inkLineMaterial, 24);
  gearGroup.add(gearHub);
  for (let t = 0; t < 10; t++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.28), crimsonMat);
    const a = (t / 10) * Math.PI * 2;
    tooth.position.set(Math.cos(a) * 0.65, 0, Math.sin(a) * 0.65);
    tooth.rotation.y = -a;
    gearGroup.add(tooth);
  }
  benchGroup.add(gearGroup);

  // Prop 2: Cracking Frosted Crystal Prism (d3dcompiler_47.dll) exposing 0xFEEDFACE Amber Core
  const prismGroup = new THREE.Group();
  prismGroup.position.set(1.25, 1.55, 0);
  const prismBase = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.84, 0.22, 6), darkMat);
  prismGroup.add(prismBase);

  const amberCoreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, toneMapped: false });
  const amberCore = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.62, 16), amberCoreMat);
  amberCore.position.y = 0.42;
  prismGroup.add(amberCore);

  const prismShellMat = new THREE.MeshToonMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.68,
    gradientMap: materials.gradientMap,
  });
  const prismUpper = new THREE.Mesh(new THREE.OctahedronGeometry(0.76, 0), prismShellMat);
  prismUpper.position.y = 0.72;
  addAnimeInkEdges(prismUpper, materials.inkLineMaterial, 22);
  prismGroup.add(prismUpper);
  benchGroup.add(prismGroup);

  // Prop 3: Golden RC4 Cipher Ribbon Spool & Unbacked Hovering Holographic Micro-Radio
  const rc4Spool = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.08, 10, 32),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, toneMapped: false })
  );
  rc4Spool.rotation.x = Math.PI / 2;
  rc4Spool.position.set(0, 2.45, 0);
  benchGroup.add(rc4Spool);

  const hoverRadio = new THREE.Group();
  const radioCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), skyMat);
  addAnimeInkEdges(radioCore, materials.inkLineMaterial, 22);
  const radioRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.05, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false })
  );
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 10), crimsonMat);
  antenna.position.y = 0.56;
  hoverRadio.add(radioCore, radioRing, antenna);
  hoverRadio.position.set(0, 3.35, 0);
  benchGroup.add(hoverRadio);

  const plaqueTex = createPlaqueTexture(
    'RC4 KEY: 3jB(2bsG#@c7',
    'MEM_PRIVATE RWX',
    '#0F172A',
    '#F59E0B',
    '#FDE68A'
  );
  textures.push(plaqueTex);
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.76),
    new THREE.MeshBasicMaterial({ map: plaqueTex })
  );
  plaque.position.set(0, 0.52, 1.52);
  benchGroup.add(plaque);

  root.add(benchGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 2.85, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.25, 3.1, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.1, 7.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.3, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.6, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateThreeCxStep2State(timeSec, cutawayMode);

      cutawayLid.position.y = s.cutawayOpen * 1.45;
      cutawayLid.rotation.x = -s.cutawayOpen * 0.42;

      gearGroup.rotation.y = s.gearAngle;

      prismUpper.position.y = 0.72 + easeOutCubic(s.prismCracked) * 0.78;
      prismUpper.rotation.y = timeSec * 0.9;
      amberCore.scale.setScalar(0.85 + s.prismCracked * 0.35);

      const spoolScale = Math.max(0.01, easeOutCubic(s.rc4Unwind));
      rc4Spool.scale.setScalar(spoolScale);
      rc4Spool.rotation.z = timeSec * 3.2;

      const radScale = Math.max(0.01, easeOutCubic(s.hoverRadioScale));
      hoverRadio.scale.setScalar(radScale);
      hoverRadio.position.y = 3.25 + Math.sin(timeSec * 3.2) * 0.14;
      hoverRadio.rotation.y = timeSec * 1.6;
      radioRing.rotation.x = timeSec * 2.1;

      shell.accentStripMat.color.setHex(s.rwxAllocated ? 0x0284c7 : 0xd97706);

      return {
        glitchIntensity: s.prismCracked * 0.22,
        magicDustIntensity: s.rc4Unwind * 0.55,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
