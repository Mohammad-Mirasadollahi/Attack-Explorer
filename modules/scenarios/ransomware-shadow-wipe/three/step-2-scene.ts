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
import { evaluateLockbitStep2State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LockBit Step #2 (`lockbit-step2-vsswipe`)
 * Room: Archival Microfilm Reel Destruction Vault (4 Silver Reels + Twin-Roller Shredder + Snapping WinRE Lever).
 */
export function buildLockbitStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x3b2f2f,
    floorTrimHex: 0xea580c,
    wallColor: 0x1f2937,
    pillarColor: 0x111827,
    signTitle: 'STEP 2 · BACKUP REEL DESTRUCTION',
    signSubtitle: 'VSSADMIN DELETE SHADOWS + BCDEDIT RECOVERY NO',
    signBgHex: '#18181B',
    signBorderHex: '#EA580C',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const steelMat = materials.createToonMaterial(0x475569);
  const darkIronMat = materials.createToonMaterial(0x1e293b);
  const silverMat = materials.createToonMaterial(0xe2e8f0);
  const brassMat = materials.createToonMaterial(0xd97706);
  const greenMat = materials.createToonMaterial(0x10b981);
  const orangeMat = materials.createToonMaterial(0xea580c);

  // Prop 1: Left Archival Microfilm Spindle Rack + 4 Silver Backup Reels (x = -1.35, z = 0.1)
  const rackGroup = new THREE.Group();
  rackGroup.position.set(-1.35, 0, 0.1);
  rackGroup.add(createContactDisc(materials, 1.35));

  const rackBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.34, 1.1), darkIronMat);
  rackBase.position.y = 0.17;
  addAnimeInkEdges(rackBase, materials.inkLineMaterial, 24);
  rackGroup.add(rackBase);

  const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(2.05, 3.1, 0.24), steelMat);
  rackFrame.position.set(0, 1.85, -0.32);
  rackFrame.castShadow = true;
  addAnimeInkEdges(rackFrame, materials.inkLineMaterial, 24);
  rackGroup.add(rackFrame);

  const reelStartPositions: [number, number][] = [
    [-0.56, 2.65],
    [0.56, 2.65],
    [-0.56, 1.48],
    [0.56, 1.48],
  ];
  const reels: THREE.Group[] = [];

  for (const [rx, ry] of reelStartPositions) {
    // Fixed brass spindle pin on rack
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.44, 12), brassMat);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(rx, ry, -0.1);
    rackGroup.add(pin);

    // Composite silver backup reel (outer rim + core + 3 spokes)
    const reel = new THREE.Group();
    const outerRim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 10, 24), silverMat);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 16), brassMat);
    hub.rotation.x = Math.PI / 2;
    const tapeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 20), steelMat);
    tapeDrum.rotation.x = Math.PI / 2;
    reel.add(outerRim, hub, tapeDrum);
    for (let s = 0; s < 3; s++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.07, 0.15), silverMat);
      spoke.rotation.z = (s * Math.PI) / 3;
      reel.add(spoke);
    }
    reel.position.set(rx, ry, 0.04);
    rackGroup.add(reel);
    reels.push(reel);
  }
  root.add(rackGroup);

  // Prop 2: Right Twin-Roller Industrial Steel Shredder + Ribbon Catch Bin (x = 1.65, z = 0.2)
  const shredderGroup = new THREE.Group();
  shredderGroup.position.set(1.65, 0, 0.2);
  shredderGroup.add(createContactDisc(materials, 1.45));

  const hopperBase = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.25, 1.45), darkIronMat);
  hopperBase.position.y = 0.625;
  hopperBase.castShadow = true;
  addAnimeInkEdges(hopperBase, materials.inkLineMaterial, 24);
  shredderGroup.add(hopperBase);

  // Cutaway glass front window on bin so user sees confetti rising inside
  const binFrontMat = new THREE.MeshToonMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.45,
    gradientMap: materials.gradientMap,
  });
  const binWindow = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.9, 0.06), binFrontMat);
  binWindow.position.set(0, 0.64, 0.73);
  shredderGroup.add(binWindow);

  // Twin counter-rotating toothed cutter shafts
  const rollers: THREE.Group[] = [];
  for (let r = 0; r < 2; r++) {
    const roller = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.78, 16), steelMat);
    shaft.rotation.z = Math.PI / 2;
    roller.add(shaft);
    for (let k = -3; k <= 3; k++) {
      const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.08, 8), orangeMat);
      blade.rotation.z = Math.PI / 2;
      blade.position.x = k * 0.24;
      addAnimeInkEdges(blade, materials.inkLineMaterial, 28);
      roller.add(blade);
    }
    roller.position.set(0, 1.48, r === 0 ? -0.25 : 0.25);
    shredderGroup.add(roller);
    rollers.push(roller);
  }

  // Cutaway upper throat hood
  const hoodMat = new THREE.MeshToonMaterial({
    color: 0xdc2626,
    transparent: true,
    opacity: 0.68,
    gradientMap: materials.gradientMap,
  });
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 0.82, 4), hoodMat);
  hood.rotation.y = Math.PI / 4;
  hood.position.set(0, 1.98, 0);
  addAnimeInkEdges(hood, materials.inkLineMaterial, 26);
  shredderGroup.add(hood);

  // Growing silver confetti ribbon heap inside/overflowing hopper
  const ribbonHeap = new THREE.Group();
  ribbonHeap.position.set(0, 0.32, 0.15);
  for (let i = 0; i < 14; i++) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.55 + (i % 3) * 0.18, 0.08, 0.12),
      silverMat
    );
    strip.position.set(
      ((i % 5) - 2) * 0.28,
      Math.floor(i / 5) * 0.18 + 0.1,
      ((i % 3) - 1) * 0.22
    );
    strip.rotation.set(i * 0.4, i * 0.7, i * 0.3);
    ribbonHeap.add(strip);
  }
  shredderGroup.add(ribbonHeap);

  const vssLampMat = new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false });
  const vssLamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), vssLampMat);
  vssLamp.position.set(0.88, 2.38, 0.5);
  shredderGroup.add(vssLamp);

  const shredderPlaqueTex = createPlaqueTexture(
    'VSS SHADOW DESTRUCTION',
    'EID 1 / VSS EID 7036',
    '#18181B',
    '#EA580C',
    '#FED7AA'
  );
  textures.push(shredderPlaqueTex);
  const shredderPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 0.56),
    new THREE.MeshBasicMaterial({ map: shredderPlaqueTex })
  );
  shredderPlaque.position.set(0, 0.34, 0.74);
  shredderGroup.add(shredderPlaque);
  root.add(shredderGroup);

  // Prop 3: Far-Left Green Emergency WinRE Recovery Lever (x = -3.4, z = 0.45)
  const leverBoxGroup = new THREE.Group();
  leverBoxGroup.position.set(-3.4, 0, 0.45);
  leverBoxGroup.add(createContactDisc(materials, 0.75));

  const leverPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.85, 0.65), darkIronMat);
  leverPedestal.position.y = 0.925;
  addAnimeInkEdges(leverPedestal, materials.inkLineMaterial, 24);
  leverBoxGroup.add(leverPedestal);

  const leverIntact = new THREE.Group();
  leverIntact.position.set(0, 1.48, 0.35);
  const intactShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85, 12), steelMat);
  intactShaft.position.y = 0.42;
  const intactGrip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), greenMat);
  intactGrip.position.y = 0.88;
  addAnimeInkEdges(intactGrip, materials.inkLineMaterial, 24);
  leverIntact.add(intactShaft, intactGrip);
  leverBoxGroup.add(leverIntact);

  const leverBroken = new THREE.Group();
  const brokenShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.62, 12), steelMat);
  brokenShaft.rotation.z = Math.PI / 2;
  const brokenGrip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), greenMat);
  brokenGrip.position.x = 0.34;
  leverBroken.add(brokenShaft, brokenGrip);
  leverBroken.position.set(0.35, 0.16, 0.75);
  leverBroken.visible = false;
  leverBoxGroup.add(leverBroken);

  const bcdPlaqueTex = createPlaqueTexture(
    'WINRE RECOVERY LEVER',
    'BCDEDIT: NO',
    '#052E16',
    '#10B981',
    '#ECFDF5'
  );
  textures.push(bcdPlaqueTex);
  const bcdPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.84, 0.42),
    new THREE.MeshBasicMaterial({ map: bcdPlaqueTex })
  );
  bcdPlaque.position.set(0, 0.72, 0.34);
  leverBoxGroup.add(bcdPlaque);
  root.add(leverBoxGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.4, 0.15);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.65, 3.05, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.3, 3.8, 8.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(1.65, 1.8, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLockbitStep2State(timeSec, cutawayMode);

      // Move 4 reels sequentially from spindle rack into shredder throat (world x = 1.65 -> local to rack = 3.0)
      for (let i = 0; i < 4; i++) {
        const p = s.reelProgress[i];
        const [sx, sy] = reelStartPositions[i];
        const reel = reels[i];
        if (p < 0.01) {
          reel.visible = true;
          reel.position.set(sx, sy, 0.04);
          reel.scale.setScalar(1);
          reel.rotation.z = timeSec * (1.5 + i * 0.2);
        } else if (p < 0.98) {
          reel.visible = true;
          const arcX = sx + (3.0 - sx) * easeOutCubic(p);
          const arcY = sy + Math.sin(p * Math.PI) * 0.95 - p * (sy - 1.55);
          reel.position.set(arcX, arcY, 0.04 + p * 0.1);
          const shrink = Math.max(0.14, 1 - Math.max(0, (p - 0.58) / 0.42));
          reel.scale.setScalar(shrink);
          reel.rotation.z = timeSec * 10;
        } else {
          reel.visible = false;
        }
      }

      // Twin counter-rotating cutter shafts
      const angle = timeSec * (2.5 + s.shredderSpin * 8.0);
      rollers[0].rotation.x = angle;
      rollers[1].rotation.x = -angle;

      // Cutaway hood + bin transparency
      hoodMat.opacity = 0.72 - s.cutawayOpen * 0.54;
      binFrontMat.opacity = 0.48 - s.cutawayOpen * 0.34;

      // Growing silver confetti ribbon heap
      const h = Math.max(0.01, s.ribbonHeapLevel);
      ribbonHeap.scale.set(h, h, h);

      // Snapping green emergency recovery lever
      leverIntact.visible = !s.leverSnapped;
      leverIntact.rotation.z = -s.leverStrain * 0.95;
      leverBroken.visible = s.leverSnapped;
      if (s.leverSnapped) {
        const fall = easeOutCubic(s.leverFallProgress);
        leverBroken.position.set(0.2 + fall * 0.45, 1.35 - fall * 1.19, 0.55 + fall * 0.35);
        leverBroken.rotation.y = fall * 1.4;
      }

      vssLampMat.color.setHex(s.vssStopped ? 0xdc2626 : 0x10b981);
      shell.accentStripMat.color.setHex(s.leverSnapped ? 0xdc2626 : 0xea580c);

      return {
        glitchIntensity: s.shredderSpin * 0.25 + (s.leverSnapped ? 0.18 : 0),
        magicDustIntensity: s.shredderSpin * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: s.leverSnapped ? 0.4 : 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
