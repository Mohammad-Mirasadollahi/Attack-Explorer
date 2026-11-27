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
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep2State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DCSync Step 2 (`dcsync-step2-drsr`)
 * Exclusive Room: MS-DRSR Express Replication Bridge & Non-DC Street Dock
 * Exclusive Props:
 *   1. Left `CORP-DC01` RAM-Only (`lsass.exe/ntdsai.dll`) Mint Feeder Tower (`x=-4.35`, Zero NTDS.dit Disk I/O)
 *   2. Elevated Transparent Glass DRSUAPI (`UUID e3514235 / Opnum 3`) Bridge Span (`x=-1.05`) with hinged cutaway roof streaming 2 golden `CN=krbtgt` ledger capsules
 *   3. Parked Crimson Side-Street Courier Van (`WKS-ADMIN-07 · 10.20.14.88`, `x=3.2`) + Overhead `Suricata SID 2043901 / Zeek DCE-RPC` Wire Arch
 */
export function buildDcsyncStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f172a,
    floorTrimHex: 0xe11d48,
    wallColor: 0x1e293b,
    pillarColor: 0x334155,
    gridColor: 0x334155,
    signTitle: 'STEP 2 · MS-DRSR EXPRESS REPLICATION BRIDGE (OPNUM 3)',
    signSubtitle: 'IDL_DRSGETNCCHANGES OVER TCP/49668 · ZERO DISK ACCESS · SURICATA SID 2043901',
    signBgHex: '#240A14',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left CORP-DC01 RAM-Only Mint Feeder Tower (x = -4.35) ---
  const dcGroup = new THREE.Group();
  dcGroup.position.set(-4.35, 0, 0.15);
  root.add(dcGroup);
  dcGroup.add(createContactDisc(materials, 1.5, 0.018));

  const dcTower = new THREE.Mesh(
    new THREE.BoxGeometry(2.25, 3.6, 1.45),
    materials.createToonMaterial(0x1e293b)
  );
  dcTower.position.y = 1.8;
  addAnimeInkEdges(dcTower, materials.inkLineMaterial, 24);
  dcGroup.add(dcTower);

  const dcTex = createPlaqueTexture(
    'CORP-DC01 · RAM ONLY',
    'ZERO NTDS.DIT I/O',
    '#0B192C',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(dcTex);

  const dcSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.95, 0.92),
    new THREE.MeshBasicMaterial({ map: dcTex })
  );
  dcSign.position.set(0, 2.75, 0.74);
  dcGroup.add(dcSign);

  // --- PROP 2: Elevated DRSUAPI Glass Bridge Span (Center x = -1.05) ---
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-1.05, 0, 0.15);
  root.add(bridgeGroup);

  // Support piers
  for (const px of [-2.0, 2.0]) {
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 2.05, 0.95),
      materials.createToonMaterial(0x475569)
    );
    pier.position.set(px, 1.025, 0);
    addAnimeInkEdges(pier, materials.inkLineMaterial, 24);
    bridgeGroup.add(pier);
  }

  const bridgeDeck = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.24, 1.25),
    materials.createToonMaterial(0x334155)
  );
  bridgeDeck.position.set(0, 2.08, 0);
  addAnimeInkEdges(bridgeDeck, materials.inkLineMaterial, 24);
  bridgeGroup.add(bridgeDeck);

  // Hinged Cutaway Glass Canopy Roof over the DRSUAPI Bridge
  const roofPivot = new THREE.Group();
  roofPivot.position.set(0, 3.05, -0.6);
  bridgeGroup.add(roofPivot);

  const glassRoof = new THREE.Mesh(
    new THREE.BoxGeometry(4.65, 0.95, 1.2),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  glassRoof.position.set(0, -0.45, 0.6);
  roofPivot.add(glassRoof);

  // Gliding Golden CN=krbtgt Hash Capsules riding down the bridge track
  const capsules: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const cap = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.22, 0.52, 8, 14),
      materials.createToonMaterial(0xfacc15, {
        emissive: 0xf59e0b,
        emissiveIntensity: 0.95,
      })
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.set(-1.9 + i * 1.4, 2.48, 0);
    addAnimeInkEdges(cap, materials.inkLineMaterial, 24);
    bridgeGroup.add(cap);
    capsules.push(cap);
  }

  // Overhead Suricata SID 2043901 / Zeek DCE-RPC Wire Sensor Arch
  const sensorMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.35,
  });
  const wireArch = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.11, 10, 24, Math.PI),
    sensorMat
  );
  wireArch.position.set(0.35, 2.25, 0);
  bridgeGroup.add(wireArch);

  // --- PROP 3: Crimson Side-Street Courier Van (WKS-ADMIN-07 · 10.20.14.88, Right x = 3.2) ---
  const vanGroup = new THREE.Group();
  vanGroup.position.set(4.1, 0, 0.45);
  root.add(vanGroup);
  vanGroup.add(createContactDisc(materials, 1.85, 0.018));

  const vanBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 1.42, 1.45),
    materials.createToonMaterial(0xe11d48)
  );
  vanBody.position.y = 1.02;
  addAnimeInkEdges(vanBody, materials.inkLineMaterial, 24);
  vanGroup.add(vanBody);

  const vanCab = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.95, 1.38),
    materials.createToonMaterial(0xbe123c)
  );
  vanCab.position.set(-1.55, 0.82, 0);
  addAnimeInkEdges(vanCab, materials.inkLineMaterial, 24);
  vanGroup.add(vanCab);

  const vanTex = createPlaqueTexture(
    'WKS-ADMIN-07 · NON-DC',
    '10.20.14.88 · OPNUM 3',
    '#3B0A18',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(vanTex);

  const vanSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 0.82),
    new THREE.MeshBasicMaterial({ map: vanTex })
  );
  vanSign.position.set(0.05, 1.05, 0.74);
  vanGroup.add(vanSign);

  // 4 Wheels
  const wheels: THREE.Mesh[] = [];
  for (const wx of [-1.25, 0.95]) {
    for (const wz of [-0.72, 0.72]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, 0.2, 14),
        materials.createToonMaterial(0x0f172a)
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.34, wz);
      vanGroup.add(wheel);
      wheels.push(wheel);
    }
  }

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.1, 3.55, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.2, 2.55, 0.45);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.5, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncStep2State(tNorm, cutawayMode);

      // Cutaway bridge canopy tilts open
      roofPivot.rotation.x = -frame.cutawayOpen * 1.28;

      // Crimson courier van rolls cleanly under the bridge dock
      const dock = easeOutCubic(frame.vanDockProgress);
      vanGroup.position.x = 4.25 - dock * 1.1;
      wheels.forEach((w) => {
        w.rotation.y = dock * 4.5;
      });

      // Golden krbtgt hash capsules stream across bridge track into rogue van
      capsules.forEach((cap, idx) => {
        const p = (frame.capsuleStreamProgress + idx * 0.42) % 1;
        cap.visible = frame.capsuleStreamProgress > 0.03;
        cap.position.x = -2.1 + p * 4.35;
      });

      // Wire arch flares emerald/amber when Zeek & Suricata SID 2043901 catch non-DC IP
      if (frame.zeekWireAlert > 0.35) {
        sensorMat.color.setHex(0x10b981);
        sensorMat.emissive.setHex(0x10b981);
        sensorMat.emissiveIntensity = 0.8 + 0.55 * Math.sin(timeSec * 8);
      } else {
        sensorMat.color.setHex(0x38bdf8);
        sensorMat.emissive.setHex(0x38bdf8);
        sensorMat.emissiveIntensity = 0.35;
      }

      return {
        glitchIntensity: frame.capsuleStreamProgress * 0.45,
        magicDustIntensity: 0.25 + frame.capsuleStreamProgress * 0.5,
        stasisIntensity: frame.zeekWireAlert * 0.35,
        brakeReleaseBoost: frame.capsuleStreamProgress * 0.3,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
