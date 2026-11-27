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
  evaluateDnstunStep4State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DNS Tunneling Step 4 (`dnstun-step4-rpz`)
 * Exclusive Room: RPZ Sinkhole Harbor Net & Seawall Direct-Egress Lock Bay
 * Exclusive Props:
 *   1. Left Quarantined `WKSTN-FIN-14 (PID 6248)` Desk & Descending Isolation Cage (`x=-3.75`)
 *   2. Center Tall Emerald Seawall Shield rising to slam 3 steel shutters across Direct UDP/53, TCP/853 DoT & Public DoH (`x=-0.1`)
 *   3. Right Offshore Rogue Lighthouse (`x=3.25`) enveloped by descending rotating Emerald RPZ Sinkhole Net (`10.255.255.53`) + cutaway inspection dome
 */
export function buildDnstunStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x061b17,
    floorTrimHex: 0x10b981,
    wallColor: 0x0e2e27,
    pillarColor: 0x16463b,
    gridColor: 0x1b5245,
    signTitle: 'STEP 4 · RPZ SINKHOLE NET & SEAWALL EGRESS LOCK',
    signSubtitle: 'RPZ -> 10.255.255.53 · DENY DIRECT 53 / DOT 853 / DOH · ISOLATE WKSTN-FIN-14',
    signBgHex: '#05221B',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Quarantined WKSTN-FIN-14 Desk & Isolation Cage (`x = -3.8`) ---
  const wksGroup = new THREE.Group();
  wksGroup.position.set(-3.8, 0, 0.25);
  root.add(wksGroup);
  wksGroup.add(createContactDisc(materials, 1.65, 0.018));

  const wksDesk = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 1.45, 1.35),
    materials.createToonMaterial(0x334155)
  );
  wksDesk.position.y = 0.725;
  addAnimeInkEdges(wksDesk, materials.inkLineMaterial, 24);
  wksGroup.add(wksDesk);

  const wksTex = createPlaqueTexture(
    'WKSTN-FIN-14',
    'ISOLATED · PID 6248',
    '#2E1905',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(wksTex);

  const wksFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.85),
    new THREE.MeshBasicMaterial({ map: wksTex })
  );
  wksFace.position.set(0, 0.75, 0.69);
  wksGroup.add(wksFace);

  // Descending EDR Quarantine Cage over WKSTN-FIN-14
  const cageGroup = new THREE.Group();
  cageGroup.position.set(0, 4.6, 0);
  wksGroup.add(cageGroup);

  const cageMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.45,
  });
  const cageBox = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 2.0, 1.65),
    cageMat
  );
  addAnimeInkEdges(cageBox, materials.inkLineMaterial, 24);
  cageGroup.add(cageBox);

  // --- PROP 2: Center Tall Emerald Seawall Barrier Blocking 53 / 853 / DoH (`x = -0.1`) ---
  const wallGroup = new THREE.Group();
  wallGroup.position.set(-0.1, 0, 0.2);
  root.add(wallGroup);
  wallGroup.add(createContactDisc(materials, 1.75, 0.018));

  const wallBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.15, 1.25),
    materials.createToonMaterial(0x1e293b)
  );
  wallBase.position.y = 0.575;
  addAnimeInkEdges(wallBase, materials.inkLineMaterial, 24);
  wallGroup.add(wallBase);

  const fwTex = createPlaqueTexture(
    'EGRESS DENY WALL',
    'PORT 53 / 853 / DoH',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(fwTex);

  const fwShield = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 2.35, 0.22),
    [
      materials.createToonMaterial(0x0284c7),
      materials.createToonMaterial(0x0284c7),
      materials.createToonMaterial(0x0284c7),
      materials.createToonMaterial(0x0284c7),
      new THREE.MeshBasicMaterial({ map: fwTex }),
      materials.createToonMaterial(0x0c4a6e),
    ]
  );
  fwShield.position.set(0, 0.9, 0);
  addAnimeInkEdges(fwShield, materials.inkLineMaterial, 24);
  wallGroup.add(fwShield);

  // --- PROP 3: Right Offshore Lighthouse + Descending Emerald RPZ Sinkhole Net (`x = +3.25`) ---
  const lightGroup = new THREE.Group();
  lightGroup.position.set(3.25, 0, 0.2);
  root.add(lightGroup);
  lightGroup.add(createContactDisc(materials, 1.9, 0.018));

  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.66, 1.12, 2.95, 16),
    materials.createToonMaterial(0x334155)
  );
  tower.position.y = 1.475;
  addAnimeInkEdges(tower, materials.inkLineMaterial, 24);
  lightGroup.add(tower);

  const lanternMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xfacc15,
    emissiveIntensity: 0.9,
  });
  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.58, 16),
    lanternMat
  );
  lantern.position.y = 3.22;
  addAnimeInkEdges(lantern, materials.inkLineMaterial, 24);
  lightGroup.add(lantern);

  // Cutaway Inspection Dome atop Lighthouse
  const domePivot = new THREE.Group();
  domePivot.position.set(0, 3.55, -0.5);
  lightGroup.add(domePivot);

  const domeCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.68, 0.48, 16),
    materials.createToonMaterial(0x10b981)
  );
  domeCap.position.set(0, 0.24, 0.5);
  addAnimeInkEdges(domeCap, materials.inkLineMaterial, 24);
  domePivot.add(domeCap);

  // Descending Emerald RPZ Sinkhole Net (`10.255.255.53`)
  const rpzNet = new THREE.Group();
  rpzNet.position.set(0, 5.2, 0);
  lightGroup.add(rpzNet);

  const netMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.65, 3.1, 14, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
    })
  );
  rpzNet.add(netMesh);

  const rpzTex = createPlaqueTexture(
    'RPZ SINKHOLE ACTIVE',
    '-> 10.255.255.53',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(rpzTex);

  const rpzSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.78),
    new THREE.MeshBasicMaterial({ map: rpzTex })
  );
  rpzSign.position.set(0, 1.35, 1.18);
  lightGroup.add(rpzSign);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.1, 3.75, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.25, 4.15, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.1, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DNSTUN_STEP_DURATION_SEC) + DNSTUN_STEP_DURATION_SEC) %
          DNSTUN_STEP_DURATION_SEC) /
        DNSTUN_STEP_DURATION_SEC;
      const frame = evaluateDnstunStep4State(tNorm, cutawayMode);

      domePivot.rotation.x = -frame.cutawayOpen * 1.15;

      // Phase 1: Emerald RPZ Sinkhole Net drops over offshore lighthouse & dims its lantern
      const netDrop = easeOutCubic(frame.rpzNetDrop);
      rpzNet.visible = netDrop > 0.02;
      rpzNet.position.y = 5.2 - netDrop * 3.1;
      rpzNet.rotation.y = timeSec * 0.55;
      lanternMat.emissiveIntensity = Math.max(0.08, 0.95 - netDrop * 0.87);

      // Phase 2: Tall Emerald/Sky Seawall Shield rises to block direct 53 / 853 / DoH
      const wallRise = easeOutCubic(frame.seawallShutterRaise);
      fwShield.position.y = 1.05 + wallRise * 1.35;

      // Phase 3: Quarantine cage descends over WKSTN-FIN-14
      const isoDrop = easeOutCubic(frame.workstationQuarantine);
      cageGroup.visible = isoDrop > 0.02;
      cageGroup.position.y = 4.6 - isoDrop * 3.45;

      return {
        glitchIntensity: (1 - netDrop) * 0.25,
        magicDustIntensity: 0.24 + netDrop * 0.35,
        stasisIntensity: netDrop * 0.35 + wallRise * 0.35,
        brakeReleaseBoost: 0.12,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
