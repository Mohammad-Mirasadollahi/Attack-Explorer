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
import { evaluateLsassStep1State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LSASS Step #1 (`lsass-step1-sedebug`)
 * Room: Marble Bank Reception & Privilege Token Desk (SeDebugPrivilege Medallion + PID 684 Directory Wall).
 */
export function buildLsassStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x333c4a,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x1e293b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 1 · SEDEBUGPRIVILEGE & PID 684',
    signSubtitle: 'WINSEC EID 4672 TOKEN + TASKLIST LSASS DISCOVERY',
    signBgHex: '#0F172A',
    signBorderHex: '#F59E0B',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const mahoganyMat = materials.createToonMaterial(0x7c2d12);
  const darkMat = materials.createToonMaterial(0x1e293b);
  const goldMat = materials.createToonMaterial(0xf59e0b);
  const skyMat = materials.createToonMaterial(0x38bdf8);
  const emeraldMat = materials.createToonMaterial(0x10b981);

  // Prop 1: Mahogany Reception Desk & Velvet Vitrine Lifting Golden SeDebugPrivilege Medallion
  const deskGroup = new THREE.Group();
  deskGroup.position.set(-1.35, 0, 0.2);
  deskGroup.add(createContactDisc(materials, 1.85));

  const deskBody = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.35, 1.8), mahoganyMat);
  deskBody.position.y = 0.675;
  deskBody.castShadow = true;
  addAnimeInkEdges(deskBody, materials.inkLineMaterial, 24);
  deskGroup.add(deskBody);

  const velvetPad = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 0.14, 24), darkMat);
  velvetPad.position.set(0, 1.42, 0);
  deskGroup.add(velvetPad);

  const badgeGroup = new THREE.Group();
  const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 6), goldMat);
  medallion.rotation.x = Math.PI / 2;
  addAnimeInkEdges(medallion, materials.inkLineMaterial, 22);
  const badgeHaloMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    transparent: true,
    opacity: 0.45,
    toneMapped: false,
  });
  const badgeHalo = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.045, 8, 24), badgeHaloMat);
  badgeGroup.add(medallion, badgeHalo);
  badgeGroup.position.set(0, 1.9, 0);
  deskGroup.add(badgeGroup);

  // Cutaway glass display dome over medallion
  const domeMat = new THREE.MeshToonMaterial({
    color: 0xfef3c7,
    transparent: true,
    opacity: 0.42,
    gradientMap: materials.gradientMap,
  });
  const glassDome = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 1.4, 20), domeMat);
  glassDome.position.set(0, 2.15, 0);
  deskGroup.add(glassDome);

  const tokenTex = createPlaqueTexture(
    'CMD.EXE PID 4920',
    'EID 4672 · SEDEBUG',
    '#1C1917',
    '#F59E0B',
    '#FEF3C7'
  );
  textures.push(tokenTex);
  const tokenPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 0.65),
    new THREE.MeshBasicMaterial({ map: tokenTex })
  );
  tokenPlaque.position.set(0, 0.68, 0.92);
  deskGroup.add(tokenPlaque);
  root.add(deskGroup);

  // Prop 2: Right Illuminated Bank Process Directory Wall & Brass Sliding Scanner (tasklist -> PID 684)
  const dirGroup = new THREE.Group();
  dirGroup.position.set(1.85, 0, 0.05);
  dirGroup.add(createContactDisc(materials, 1.65));

  const dirCabinet = new THREE.Mesh(new THREE.BoxGeometry(2.85, 3.25, 0.75), darkMat);
  dirCabinet.position.y = 1.625;
  dirCabinet.castShadow = true;
  addAnimeInkEdges(dirCabinet, materials.inkLineMaterial, 24);
  dirGroup.add(dirCabinet);

  // 4 horizontal process directory slots (slot #2 is lsass.exe PID 684)
  const slotMats: THREE.MeshBasicMaterial[] = [];
  const slotY = [2.65, 2.15, 1.65, 1.15];
  slotY.forEach((sy, idx) => {
    const isLsass = idx === 1;
    const mat = new THREE.MeshBasicMaterial({
      color: isLsass ? 0x38bdf8 : 0x334155,
      toneMapped: false,
    });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.28, 0.08), mat);
    bar.position.set(0, sy, 0.4);
    dirGroup.add(bar);
    slotMats.push(mat);
  });

  // Brass sliding tasklist scanner carriage
  const scannerBar = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.14, 0.22), skyMat);
  scannerBar.position.set(0, 2.95, 0.46);
  addAnimeInkEdges(scannerBar, materials.inkLineMaterial, 24);
  dirGroup.add(scannerBar);

  const pidTex = createPlaqueTexture(
    'TASKLIST DIRECTORY',
    'LSASS.EXE · PID 684',
    '#0C4A6E',
    '#38BDF8',
    '#E0F2FE'
  );
  textures.push(pidTex);
  const pidPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.62),
    new THREE.MeshBasicMaterial({ map: pidTex })
  );
  pidPlaque.position.set(0, 0.55, 0.4);
  dirGroup.add(pidPlaque);
  root.add(dirGroup);

  // Prop 3: Telemetry Link Arch Indicator
  const readyBeaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false });
  const readyBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), readyBeaconMat);
  readyBeacon.position.set(1.85, 3.45, 0.05);
  const beaconCap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.18, 16), emeraldMat);
  beaconCap.position.set(1.85, 3.25, 0.05);
  root.add(readyBeacon, beaconCap);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.2, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.85, 3.35, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.2, 12.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLsassStep1State(timeSec, cutawayMode);

      badgeGroup.position.y = 1.85 + easeOutCubic(s.badgeRise) * 0.68 + Math.sin(timeSec * 3.0) * 0.05;
      badgeGroup.rotation.y = timeSec * 1.4;
      badgeHaloMat.opacity = 0.2 + s.badgeRise * 0.78;
      domeMat.opacity = 0.46 - s.cutawayOpen * 0.36;

      // Scanner sweeps down to slot #2 (y = 2.15 -> lsass.exe PID 684)
      scannerBar.position.y = 2.95 - easeOutCubic(s.directoryScan) * 0.8;
      slotMats[1].color.setHex(s.pidLocked ? 0x10b981 : 0x38bdf8);
      readyBeaconMat.color.setHex(s.pidLocked ? 0x10b981 : 0xf59e0b);

      return {
        glitchIntensity: s.pidLocked ? 0.16 : 0.06,
        magicDustIntensity: s.badgeRise * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
