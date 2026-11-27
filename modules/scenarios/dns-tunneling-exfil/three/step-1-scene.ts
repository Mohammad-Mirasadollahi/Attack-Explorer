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
} from '@/components/three/step-stage-primitives';
import {
  DNSTUN_STEP_DURATION_SEC,
  evaluateDnstunStep1State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DNS Tunneling Step 1 (`dnstun-step1-chunk`)
 * Exclusive Room: `WKSTN-FIN-14` RFC 1035 63-Octet Label Guillotine & Sysmon EID 22 Skylight Room
 * Exclusive Props:
 *   1. Central Timber Harbor Slicing Desk (`WKSTN-FIN-14`, `x=0`) with hinged cutaway hood, articulated RFC 1035 guillotine blade & 3 lifting 56-char hex crimson strips
 *   2. Overhead Blue `Sysmon Event ID 22` Skylight Attribution Lens (`PID 6248 · telemetry_sync.exe`) casting a translucent cyan attribution cone
 *   3. Left Staged Finance Ledger Stack (`x=-4.2`) & Right `99.6% Cache Miss` Unique-Sequence Monitor (`x=4.2`)
 */
export function buildDnstunStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0c1926,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x15273a,
    pillarColor: 0x223b54,
    gridColor: 0x26415c,
    signTitle: 'STEP 1 · RFC 1035 63-OCTET CHUNKING & SYSMON EID 22',
    signSubtitle: 'WKSTN-FIN-14 TELEMETRY_SYNC.EXE (PID 6248) · 56-CHAR HEX SUBDOMAIN SLIPS',
    signBgHex: '#19140A',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Staged Finance Ledger Pedestal (`x = -4.2`) ---
  const ledgerGroup = new THREE.Group();
  ledgerGroup.position.set(-4.2, 0, 0.25);
  root.add(ledgerGroup);
  ledgerGroup.add(createContactDisc(materials, 1.2, 0.018));

  const stackBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 1.4, 1.15),
    materials.createToonMaterial(0x451a03)
  );
  stackBase.position.y = 0.7;
  addAnimeInkEdges(stackBase, materials.inkLineMaterial, 24);
  ledgerGroup.add(stackBase);

  const ledgerTex = createPlaqueTexture(
    'STAGED RECORDS',
    'NO DIRECT HTTP EGRESS',
    '#2E1905',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(ledgerTex);

  const ledgerFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.68, 0.85),
    new THREE.MeshBasicMaterial({ map: ledgerTex })
  );
  ledgerFace.position.set(0, 0.75, 0.59);
  ledgerGroup.add(ledgerFace);

  // --- PROP 2: Central Timber Harbor Slicing Desk + RFC 1035 Guillotine (`x = 0`) ---
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0, 0, 0.25);
  root.add(deskGroup);
  deskGroup.add(createContactDisc(materials, 2.35, 0.018));

  const deskBody = new THREE.Mesh(
    new THREE.BoxGeometry(4.1, 1.35, 1.9),
    materials.createToonMaterial(0x5c2b16)
  );
  deskBody.position.y = 0.675;
  addAnimeInkEdges(deskBody, materials.inkLineMaterial, 24);
  deskGroup.add(deskBody);

  const deskTex = createPlaqueTexture(
    'WKSTN-FIN-14 · PID 6248',
    'telemetry_sync.exe',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(deskTex);

  const deskSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.35, 0.86),
    new THREE.MeshBasicMaterial({ map: deskTex })
  );
  deskSign.position.set(0, 0.68, 0.96);
  deskGroup.add(deskSign);

  // Articulated Steel RFC 1035 63-Octet Label Guillotine Arm
  const bladePivot = new THREE.Group();
  bladePivot.position.set(-1.55, 1.48, 0.15);
  deskGroup.add(bladePivot);

  const bladeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 0.16, 0.08),
    materials.createToonMaterial(0x94a3b8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
    })
  );
  bladeMesh.position.set(1.45, 0, 0);
  addAnimeInkEdges(bladeMesh, materials.inkLineMaterial, 24);
  bladePivot.add(bladeMesh);

  // 3 Lifting 56-Char Encoded Crimson Subdomain Strips
  const slips: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const slip = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.12, 0.42),
      materials.createToonMaterial(0xe11d48, {
        emissive: 0xf43f5e,
        emissiveIntensity: 0.8,
      })
    );
    slip.position.set(-1.1 + i * 1.1, 1.62, 0.35);
    addAnimeInkEdges(slip, materials.inkLineMaterial, 24);
    deskGroup.add(slip);
    slips.push(slip);
  }

  // Hinged Cutaway Glass Hood over Desk
  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 2.65, -0.92);
  deskGroup.add(hoodPivot);

  const hoodGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.95, 1.35, 1.85),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  hoodGlass.position.set(0, -0.68, 0.92);
  hoodPivot.add(hoodGlass);

  // --- PROP 3: Overhead Blue Sysmon Event ID 22 Skylight Lens (`x = 0, y = 3.65`) ---
  const lensGroup = new THREE.Group();
  lensGroup.position.set(0, 3.72, 0.25);
  root.add(lensGroup);

  const lensRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.12, 10, 24),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
    })
  );
  lensRing.rotation.x = Math.PI / 2;
  lensGroup.add(lensRing);

  const lensConeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  });
  const lensCone = new THREE.Mesh(
    new THREE.ConeGeometry(1.85, 2.35, 18, 1, true),
    lensConeMat
  );
  lensCone.position.y = -1.2;
  lensGroup.add(lensCone);

  // --- PROP 4: Right-Side Sysmon EID 22 / Cache-Miss Attribution Console (`x = +4.2`) ---
  const monGroup = new THREE.Group();
  monGroup.position.set(4.2, 0, 0.25);
  root.add(monGroup);
  monGroup.add(createContactDisc(materials, 1.25, 0.018));

  const monTower = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 2.55, 1.0),
    materials.createToonMaterial(0x1e293b)
  );
  monTower.position.y = 1.275;
  addAnimeInkEdges(monTower, materials.inkLineMaterial, 24);
  monGroup.add(monTower);

  const eid22Tex = createPlaqueTexture(
    'SYSMON EID 22',
    '99.6% CACHE MISS',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(eid22Tex);

  const monFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.96),
    new THREE.MeshBasicMaterial({ map: eid22Tex })
  );
  monFace.position.set(0, 1.72, 0.51);
  monGroup.add(monFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 2.65, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.4, 3.85, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DNSTUN_STEP_DURATION_SEC) + DNSTUN_STEP_DURATION_SEC) %
          DNSTUN_STEP_DURATION_SEC) /
        DNSTUN_STEP_DURATION_SEC;
      const frame = evaluateDnstunStep1State(tNorm, cutawayMode);

      hoodPivot.rotation.x = -frame.cutawayOpen * 1.18;

      // Guillotine chops rhythmically during Phase 1
      bladePivot.rotation.z =
        0.15 + Math.abs(Math.sin(timeSec * 4.2)) * 0.42 * (1 - frame.skylightLockBeam * 0.6);

      // 3 crimson 56-char hex strips float and bob above desk
      slips.forEach((s, idx) => {
        s.position.y =
          1.62 + frame.stripLiftProgress * (0.48 + 0.16 * Math.sin(timeSec * 3.5 + idx * 1.4));
        s.rotation.y = Math.sin(timeSec * 2.2 + idx) * 0.28;
      });

      // Skylight Sysmon EID 22 lens locks onto PID 6248 desk
      lensRing.scale.setScalar(1 + 0.12 * Math.sin(timeSec * 4.5));
      lensConeMat.opacity = 0.08 + frame.skylightLockBeam * 0.28;

      return {
        glitchIntensity: frame.guillotineSlice * 0.25,
        magicDustIntensity: 0.25 + frame.stripLiftProgress * 0.4,
        stasisIntensity: frame.skylightLockBeam * 0.35,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
