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
import { evaluateAmsiStep3State } from '../choreography';

/**
 * Standalone 3D Scene: AMSI Step 3 — Micro-Circuit Surgery Rack with 6 Copper Prologue Fuses,
 * Robotic Injection Arm seating Solid 6-Pin Brass U-Jumper (B8 57 00 07 80 C3),
 * Bouncing Scan Orb & Silenced Defender MpOav Console.
 */
export function buildAmsiStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x1c1917,
    floorTrimHex: 0xe11d48,
    wallColor: 0x292524,
    pillarColor: 0x0f172a,
    signTitle: '6-BYTE PROLOGUE MICRO-CIRCUIT RACK',
    signSubtitle: 'MARSHAL.COPY B8 57 00 07 80 C3 (E_INVALIDARG; RET) -> DEFENDER SILENCED',
    signBgHex: '#1C1917',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 14.4,
    depth: 9.8,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // 1) Precision 6-Slot Circuit Surgery Rack (Left-Center)
  const rackGroup = new THREE.Group();
  rackGroup.position.set(-1.35, 0, 0.4);
  rackGroup.add(createContactDisc(materials, 2.8));

  const rackBase = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 1.35, 2.1),
    materials.createToonMaterial(0x1e293b)
  );
  rackBase.position.y = 0.675;
  rackBase.castShadow = true;
  rackBase.receiveShadow = true;
  addAnimeInkEdges(rackBase, materials.inkLineMaterial, 24);
  rackGroup.add(rackBase);

  const socketPlate = new THREE.Mesh(
    new THREE.BoxGeometry(3.9, 0.24, 1.4),
    materials.createToonMaterial(0x0f172a)
  );
  socketPlate.position.set(0, 1.46, 0);
  addAnimeInkEdges(socketPlate, materials.inkLineMaterial, 24);
  rackGroup.add(socketPlate);

  // 6 Original Copper Inspection Fuses (4C 8B DC 49 89 5B)
  const copperMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.7,
  });
  const capMat = materials.createToonMaterial(0xf59e0b);
  const copperFuses: THREE.Group[] = [];
  for (let i = 0; i < 6; i += 1) {
    const fg = new THREE.Group();
    const x = -1.5 + i * 0.6;
    fg.position.set(x, 1.9, 0);
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.72, 14),
      copperMat
    );
    addInvertedHullOutline(tube, materials.inkOutlineMaterial, 1.07);
    fg.add(tube);
    const topCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.14, 14),
      capMat
    );
    topCap.position.y = 0.38;
    fg.add(topCap);
    rackGroup.add(fg);
    copperFuses.push(fg);
  }

  // Solid 6-Pin Crimson-Brass U-Turn Jumper (B8 57 00 07 80 C3 -> ret)
  const jumperGroup = new THREE.Group();
  jumperGroup.position.set(0, 3.1, 0);
  const jumperMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xbe123c,
    emissiveIntensity: 0.85,
  });
  const jumperBar = new THREE.Mesh(
    new THREE.BoxGeometry(3.48, 0.34, 0.42),
    jumperMat
  );
  jumperBar.position.y = 0.48;
  addAnimeInkEdges(jumperBar, materials.inkLineMaterial, 24);
  jumperGroup.add(jumperBar);

  // U-Turn return pipe atop the jumper showing immediate `ret`
  const uTurnPipe = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.1, 10, 24, Math.PI),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xd97706,
      emissiveIntensity: 0.65,
    })
  );
  uTurnPipe.position.set(0, 0.65, 0);
  jumperGroup.add(uTurnPipe);

  for (let i = 0; i < 6; i += 1) {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.56, 12),
      materials.createToonMaterial(0xfacc15)
    );
    pin.position.set(-1.5 + i * 0.6, 0.1, 0);
    jumperGroup.add(pin);
  }
  rackGroup.add(jumperGroup);

  // Hinged Glass Cover that re-locks RX (0x20) in Phase 3 + Cutaway Shroud
  const coverPivot = new THREE.Group();
  coverPivot.position.set(0, 1.56, -0.78);
  const coverMat = materials.createToonMaterial(0x7dd3fc, {
    transparent: true,
    opacity: 0.34,
  });
  const coverPanel = new THREE.Mesh(
    new THREE.BoxGeometry(4.15, 0.12, 1.56),
    coverMat
  );
  coverPanel.position.set(0, 0.85, 0.78);
  addAnimeInkEdges(coverPanel, materials.inkLineMaterial, 24);
  coverPivot.add(coverPanel);
  rackGroup.add(coverPivot);

  // Bouncing Scan Orb proving every incoming script scan immediately bounces back (ret)
  const orbMat = materials.createToonMaterial(0xfacc15, {
    emissive: 0xf59e0b,
    emissiveIntensity: 1.2,
  });
  const scanOrb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), orbMat);
  scanOrb.position.set(-2.5, 2.25, 0.9);
  addInvertedHullOutline(scanOrb, materials.inkOutlineMaterial, 1.08);
  rackGroup.add(scanOrb);

  root.add(rackGroup);

  // 2) Elevated Defender MpOav.dll Monitoring Console + Overhead Power Cable (Right)
  const defenderGroup = new THREE.Group();
  defenderGroup.position.set(3.45, 0, -0.5);
  defenderGroup.add(createContactDisc(materials, 1.75));

  const towerBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.45, 1.5),
    materials.createToonMaterial(0x1e293b)
  );
  towerBase.position.y = 1.225;
  towerBase.castShadow = true;
  addAnimeInkEdges(towerBase, materials.inkLineMaterial, 24);
  defenderGroup.add(towerBase);

  const activeTex = createPlaqueTexture(
    'DEFENDER MpOav.dll',
    'LIVE SCANNING',
    '#0C4A6E',
    '#38BDF8',
    '#7DD3FC'
  );
  const blindTex = createPlaqueTexture(
    'DEFENDER MpOav.dll',
    '0 BUFFERS · BLIND',
    '#052E16',
    '#10B981',
    '#86EFAC'
  );
  textures.push(activeTex, blindTex);

  const consoleScreenMat = new THREE.MeshBasicMaterial({ map: activeTex });
  const consoleScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.82, 0.95),
    consoleScreenMat
  );
  consoleScreen.position.set(0, 1.72, 0.77);
  defenderGroup.add(consoleScreen);

  const sirenMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
  });
  const siren = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.3, 0.36, 16),
    sirenMat
  );
  siren.position.set(0, 2.65, 0);
  addAnimeInkEdges(siren, materials.inkLineMaterial, 24);
  defenderGroup.add(siren);

  root.add(defenderGroup);

  // Overhead Power Cable linking Fuse Rack (-1.35) -> Defender Console (+3.45)
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 2.25, 0.1),
    new THREE.Vector3(1.1, 3.6, -0.2),
    new THREE.Vector3(2.5, 2.45, -0.45),
  ]);
  const cableMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.95,
  });
  const alarmCable = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 24, 0.075, 10, false),
    cableMat
  );
  root.add(alarmCable);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.35, 3.35, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.45, 3.25, -0.5);
  root.add(secondaryAnchor);

  let isBlindScreen = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 3.8, 8.6),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.0, 0.1),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.4, 2.1, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const s = evaluateAmsiStep3State(timeSec / 12, cutawayMode);

      for (let i = 0; i < copperFuses.length; i += 1) {
        const stagger = Math.max(0, Math.min(1, s.fusesExtracted * 1.4 - i * 0.08));
        copperFuses[i].position.y = 1.9 + stagger * 1.55;
        copperFuses[i].visible = stagger < 0.96;
      }

      jumperGroup.visible = s.jumperSeated > 0.02;
      jumperGroup.position.y = 1.62 + (1 - s.jumperSeated) * 1.85;

      // Overhead cable loses power as soon as brass U-jumper locks in
      if (s.wirePower > 0.25) {
        cableMat.color.setHex(0x38bdf8);
        cableMat.emissive.setHex(0x0284c7);
        cableMat.emissiveIntensity = 0.85 * s.wirePower;
        sirenMat.color.setHex(0x38bdf8);
        sirenMat.emissive.setHex(0x0284c7);
        sirenMat.emissiveIntensity = 0.85 * s.wirePower;
      } else {
        cableMat.color.setHex(0x475569);
        cableMat.emissive.setHex(0x0f172a);
        cableMat.emissiveIntensity = 0;
        sirenMat.color.setHex(0x10b981);
        sirenMat.emissive.setHex(0x059669);
        sirenMat.emissiveIntensity = 0.35;
      }

      const wantBlind = s.wirePower < 0.25;
      if (wantBlind !== isBlindScreen) {
        isBlindScreen = wantBlind;
        consoleScreenMat.map = wantBlind ? blindTex : activeTex;
        consoleScreenMat.needsUpdate = true;
      }

      // Cover opens while cutaway is active, swings closed on re-lock (VirtualProtect 0x20)
      const openAngle = Math.max(s.cutawayLift, 1 - s.hatchRelocked) * 1.35;
      coverPivot.rotation.x = -openAngle;

      // Bouncing scan orb hits U-jumper and ricochets right back
      scanOrb.visible = s.bounceProgress > 0.02;
      const bounceArc = Math.sin(s.bounceProgress * Math.PI);
      scanOrb.position.set(
        -2.7 + bounceArc * 2.1,
        2.15 + Math.sin(s.bounceProgress * Math.PI * 2) * 0.25,
        1.1 - bounceArc * 0.65
      );

      return {
        glitchIntensity: s.jumperSeated * 0.28,
        magicDustIntensity: 0.2 + (1 - s.wirePower) * 0.35,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
