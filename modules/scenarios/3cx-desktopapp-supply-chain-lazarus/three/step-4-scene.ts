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
import { evaluateThreeCxStep4State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — 3CX Step #4 (`threecx-step4-gopuram`)
 * Room: High-Value Trader Desk, Selective Crimson VIP Vault (Gopuram) & CrowdStrike Behavioral Watch.
 */
export function buildThreeCxStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x2d2438,
    floorTrimHex: 0x7c3aed,
    wallColor: 0x1c192b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 4 · ICONICSTEALER & VIP GOPURAM',
    signSubtitle: 'CHROME LOGIN DATA -> SELECTIVE STAGE-2 -> EDR CATCH',
    signBgHex: '#1E1B4B',
    signBorderHex: '#7C3AED',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const walnutMat = materials.createToonMaterial(0x78350f);
  const darkMat = materials.createToonMaterial(0x1e293b);
  const whiteMat = materials.createToonMaterial(0xf8fafc);
  const skyMat = materials.createToonMaterial(0x38bdf8);
  const crimsonMat = materials.createToonMaterial(0xe11d48);
  const goldMat = materials.createToonMaterial(0xf59e0b);
  const emeraldMat = materials.createToonMaterial(0x10b981);

  // Prop 1: Trader Desk + Gold-Sealed Phone + Browser Login Data Keycards Siphoning Mid-Air
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0.2, 0, 0.3);
  deskGroup.add(createContactDisc(materials, 2.7));

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.24, 2.2), walnutMat);
  deskTop.position.y = 1.24;
  deskTop.receiveShadow = true;
  addAnimeInkEdges(deskTop, materials.inkLineMaterial, 24);
  deskGroup.add(deskTop);
  for (const lx of [-2.2, 2.2]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.12, 1.85), darkMat);
    leg.position.set(lx, 0.56, 0);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 24);
    deskGroup.add(leg);
  }

  // Left: Gold-Sealed Business Phone (cutaway lid opens slightly)
  const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.38, 0.96), whiteMat);
  phoneBody.position.set(-1.3, 1.56, 0);
  addAnimeInkEdges(phoneBody, materials.inkLineMaterial, 24);
  const goldSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 18), emeraldMat);
  goldSeal.position.set(-1.3, 1.78, 0);
  deskGroup.add(phoneBody, goldSeal);

  // Right: Chromium Login Data Vault Tray + 3 Glowing Blue Keycards
  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.26, 1.0), darkMat);
  tray.position.set(1.4, 1.48, 0);
  addAnimeInkEdges(tray, materials.inkLineMaterial, 24);
  deskGroup.add(tray);

  const keycards: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.36), skyMat);
    addAnimeInkEdges(card, materials.inkLineMaterial, 24);
    card.position.set(1.4, 1.68 + i * 0.12, 0);
    deskGroup.add(card);
    keycards.push(card);
  }
  root.add(deskGroup);

  // Prop 2: Elevated Golden-Crowned Crimson VIP Vault (Gopuram Selective Stage-2)
  const vipVault = new THREE.Group();
  vipVault.position.set(1.4, 4.15, -0.3);
  const vaultCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 0), crimsonMat);
  addAnimeInkEdges(vaultCore, materials.inkLineMaterial, 22);
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.09, 8, 20), goldMat);
  crown.rotation.x = Math.PI / 2;
  crown.position.y = 0.45;
  vipVault.add(vaultCore, crown);
  root.add(vipVault);

  const tetherMat = new THREE.MeshBasicMaterial({
    color: 0xe11d48,
    transparent: true,
    opacity: 0.78,
    toneMapped: false,
  });
  const tetherFrom = new THREE.Vector3(1.4, 3.6, -0.3);
  const tetherTo = new THREE.Vector3(-1.1, 1.75, 0.3);
  const tetherDir = new THREE.Vector3().subVectors(tetherTo, tetherFrom);
  const tetherMid = new THREE.Vector3().addVectors(tetherFrom, tetherTo).multiplyScalar(0.5);
  const vipTether = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, tetherDir.length(), 10),
    tetherMat
  );
  vipTether.position.copy(tetherMid);
  vipTether.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    tetherDir.clone().normalize()
  );
  root.add(vipTether);

  // Prop 3: Behavioral EDR Containment Cage & Overhead Watch Monitor (x = -1.1, y = 4.2, z = -2.2)
  const edrNormalTex = createPlaqueTexture(
    'BEHAVIORAL EDR WATCH',
    'MONITORING VOIP APP',
    '#0F172A',
    '#10B981',
    '#D1FAE5'
  );
  const edrAlertTex = createPlaqueTexture(
    'CROWDSTRIKE ALERT',
    'VOIP -> CHROME VAULT',
    '#4C0519',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(edrNormalTex, edrAlertTex);
  const edrScreenMat = new THREE.MeshBasicMaterial({ map: edrNormalTex });
  const edrMonitor = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 1.15, 0.24),
    [darkMat, darkMat, darkMat, darkMat, edrScreenMat, darkMat]
  );
  edrMonitor.position.set(-1.3, 4.15, -2.35);
  addAnimeInkEdges(edrMonitor, materials.inkLineMaterial, 24);
  root.add(edrMonitor);

  // Translucent Cutaway EDR Containment Prism around Phone
  const cageMat = new THREE.MeshToonMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.0,
    gradientMap: materials.gradientMap,
  });
  const edrCage = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 1.5), cageMat);
  edrCage.position.set(-1.1, 1.95, 0.3);
  addAnimeInkEdges(edrCage, materials.inkLineMaterial, 28);
  root.add(edrCage);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0.3, 2.35, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.4, 4.65, -0.3);
  root.add(secondaryAnchor);

  let alertShown = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 4.1, 9.6),
    defaultCameraTarget: new THREE.Vector3(0.3, 2.6, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.6, 0.1),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateThreeCxStep4State(timeSec, cutawayMode);

      for (let i = 0; i < keycards.length; i++) {
        const p = Math.max(0, Math.min(1, (s.keycardSiphon - i * 0.16) / 0.65));
        const e = easeOutCubic(p);
        keycards[i].position.set(
          1.4 - e * 2.7,
          1.68 + i * 0.12 + Math.sin(e * Math.PI) * 0.9,
          0
        );
        keycards[i].rotation.z = e * 0.85;
      }

      vipVault.rotation.y = timeSec * 1.4;
      vipTether.visible = s.vipTetherActive > 0.15;
      tetherMat.opacity = 0.25 + s.vipTetherActive * 0.65;

      if (s.containmentActive !== alertShown) {
        alertShown = s.containmentActive;
        edrScreenMat.map = s.containmentActive ? edrAlertTex : edrNormalTex;
        edrScreenMat.needsUpdate = true;
      }

      edrCage.visible = s.containmentActive;
      cageMat.opacity = s.containmentActive ? 0.34 - s.cutawayOpen * 0.2 : 0;
      shell.accentStripMat.color.setHex(s.containmentActive ? 0xe11d48 : 0x7c3aed);

      return {
        glitchIntensity: s.edrAlertLevel * 0.34,
        magicDustIntensity: s.vipTetherActive * 0.42,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
