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
  DNSTUN_STEP_DURATION_SEC,
  evaluateDnstunStep2State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DNS Tunneling Step 2 (`dnstun-step2-sysmon22`)
 * Exclusive Room: `DNS-INT-01` Postmaster Relay Tower & Offshore Brass Lighthouse Strait
 * Exclusive Props:
 *   1. Left `DNS-INT-01` Recursive Postmaster Tower (`x=-2.8`) with cutaway routing drum & `CACHE MISS -> :53` relay arch
 *   2. Center Stone Seawall Barrier blocking direct ships (`x=0.25`) + Arcing Carrier Pigeon carrying crimson hex pouch overhead
 *   3. Right Offshore Brass Lighthouse (`ns1.cdn-metrics-sync.example`, `x=3.35`) flashing `TTL=0 TXT` lantern beacon replies
 */
export function buildDnstunStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x091a2a,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x10283f,
    pillarColor: 0x1c3d5e,
    gridColor: 0x20476e,
    signTitle: 'STEP 2 · DNS-INT-01 POSTMASTER RELAY TO OFFSHORE NS',
    signSubtitle: 'UNCACHED SUBDOMAINS BYPASS SEAWALL -> NS1.CDN-METRICS-SYNC (TTL=0 TXT)',
    signBgHex: '#0A192F',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left DNS-INT-01 Internal Recursive Postmaster Tower (`x = -2.85`) ---
  const postGroup = new THREE.Group();
  postGroup.position.set(-2.85, 0, 0.25);
  root.add(postGroup);
  postGroup.add(createContactDisc(materials, 1.85, 0.018));

  const postBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 3.25, 1.45),
    materials.createToonMaterial(0x0c4a6e)
  );
  postBody.position.y = 1.625;
  addAnimeInkEdges(postBody, materials.inkLineMaterial, 24);
  postGroup.add(postBody);

  const postTex = createPlaqueTexture(
    'DNS-INT-01 · RESOLVER',
    'CACHE MISS -> FWD :53',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(postTex);

  const postSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 0.92),
    new THREE.MeshBasicMaterial({ map: postTex })
  );
  postSign.position.set(0, 2.55, 0.74);
  postGroup.add(postSign);

  // Internal Spinning Cache-Miss Routing Drum (exposed via cutaway)
  const routeDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 1.45, 16),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.65,
    })
  );
  routeDrum.rotation.z = Math.PI / 2;
  routeDrum.position.set(0, 1.15, 0.55);
  addAnimeInkEdges(routeDrum, materials.inkLineMaterial, 24);
  postGroup.add(routeDrum);

  const cutPivot = new THREE.Group();
  cutPivot.position.set(0, 1.82, 0.78);
  postGroup.add(cutPivot);

  const cutGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 1.32, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  cutGlass.position.set(0, -0.66, 0.04);
  cutPivot.add(cutGlass);

  // --- PROP 2: Center Stone Seawall Barrier + Arcing Carrier Pigeon (`x = 0.25`) ---
  const seawall = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 2.25, 2.45),
    materials.createToonMaterial(0x475569)
  );
  seawall.position.set(0.25, 1.125, 0.2);
  addAnimeInkEdges(seawall, materials.inkLineMaterial, 24);
  root.add(seawall);

  const wallTex = createPlaqueTexture(
    'PERIMETER FIREWALL',
    'HTTP BLOCKED · DNS OPEN',
    '#1F1608',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(wallTex);

  const wallSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 0.75),
    new THREE.MeshBasicMaterial({ map: wallTex })
  );
  wallSign.position.set(0.25, 1.25, 1.44);
  root.add(wallSign);

  // Articulated Carrier Pigeon carrying Crimson Hex Pouch arching over seawall
  const pigeon = new THREE.Group();
  pigeon.position.set(-2.3, 2.75, 0.25);
  root.add(pigeon);

  const pBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.55, 8, 12),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.55,
    })
  );
  pBody.rotation.z = Math.PI / 2;
  addAnimeInkEdges(pBody, materials.inkLineMaterial, 24);
  pigeon.add(pBody);

  const wingL = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.06, 0.75),
    materials.createToonMaterial(0xe0f2fe)
  );
  wingL.position.set(0, 0.14, 0.45);
  pigeon.add(wingL);

  const wingR = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.06, 0.75),
    materials.createToonMaterial(0xe0f2fe)
  );
  wingR.position.set(0, 0.14, -0.45);
  pigeon.add(wingR);

  const crimsonPouch = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.24, 0.24),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.95,
    })
  );
  crimsonPouch.position.set(0, -0.26, 0);
  pigeon.add(crimsonPouch);

  // --- PROP 3: Right Offshore Brass Lighthouse (`ns1.cdn-metrics-sync.example`, x = +3.35) ---
  const lightGroup = new THREE.Group();
  lightGroup.position.set(3.35, 0, 0.2);
  root.add(lightGroup);
  lightGroup.add(createContactDisc(materials, 1.85, 0.018));

  const towerCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 1.15, 3.15, 16),
    materials.createToonMaterial(0x334155)
  );
  towerCone.position.y = 1.575;
  addAnimeInkEdges(towerCone, materials.inkLineMaterial, 24);
  lightGroup.add(towerCone);

  const lanternMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xfacc15,
    emissiveIntensity: 0.45,
  });
  const lanternCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.54, 0.65, 16),
    lanternMat
  );
  lanternCore.position.y = 3.45;
  addAnimeInkEdges(lanternCore, materials.inkLineMaterial, 24);
  lightGroup.add(lanternCore);

  const domeCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.68, 0.48, 16),
    materials.createToonMaterial(0xe11d48)
  );
  domeCap.position.y = 4.02;
  addAnimeInkEdges(domeCap, materials.inkLineMaterial, 24);
  lightGroup.add(domeCap);

  const nsTex = createPlaqueTexture(
    'OFFSHORE ROGUE NS',
    'TTL=0 TXT TASKING',
    '#3B0A18',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(nsTex);

  const nsSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.84),
    new THREE.MeshBasicMaterial({ map: nsTex })
  );
  nsSign.position.set(0, 1.45, 1.06);
  lightGroup.add(nsSign);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.85, 3.75, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.35, 4.35, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.5, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.3, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.3, 2.4, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DNSTUN_STEP_DURATION_SEC) + DNSTUN_STEP_DURATION_SEC) %
          DNSTUN_STEP_DURATION_SEC) /
        DNSTUN_STEP_DURATION_SEC;
      const frame = evaluateDnstunStep2State(tNorm, cutawayMode);

      cutPivot.rotation.x = -frame.cutawayOpen * 1.25;
      routeDrum.rotation.x = timeSec * 3.0;

      // Carrier pigeon arcs cleanly over stone seawall to offshore lighthouse
      const arc = easeOutCubic(frame.pigeonArcProgress);
      pigeon.position.x = -2.3 + arc * 4.8;
      pigeon.position.y = 2.65 + Math.sin(arc * Math.PI) * 1.55;
      pigeon.rotation.z = Math.cos(arc * Math.PI) * 0.24;
      const flap = Math.sin(timeSec * 14) * 0.45;
      wingL.rotation.x = flap;
      wingR.rotation.x = -flap;

      // Offshore brass lantern blinks coded TTL=0 TXT replies back
      lanternMat.emissiveIntensity =
        0.35 + frame.lanternReplyPulse * (0.95 + 0.45 * Math.sin(timeSec * 8));

      return {
        glitchIntensity: frame.lanternReplyPulse * 0.32,
        magicDustIntensity: 0.25 + frame.pigeonArcProgress * 0.45,
        stasisIntensity: frame.zeekHubMonitor * 0.35,
        brakeReleaseBoost: frame.lanternReplyPulse * 0.28,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
