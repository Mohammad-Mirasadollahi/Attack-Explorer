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
  evaluateDnstunStep3State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DNS Tunneling Step 3 (`dnstun-step3-txtbeacon`)
 * Exclusive Room: `Zeek` Passive DNS Entropy Watchtower & Telemetry Gallery
 * Exclusive Props:
 *   1. Left Calm Emerald Baseline Columns (`Entropy ~3.0 · High Cache Hit`, `x=-3.8`)
 *   2. Center `SIEM-ENTROPY-408` Coastguard Watchtower (`x=0`) with hinged glass cutaway exposing analog entropy needle, `4-Day NOD` badge & flaring crimson watchtower lamp
 *   3. Right Towering Crimson Gibberish Columns (`Entropy 4.41 · 412 Unique/Min · 78% TXT`, `x=+3.8`)
 */
export function buildDnstunStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x160f1c,
    floorTrimHex: 0xe11d48,
    wallColor: 0x24182e,
    pillarColor: 0x3b284c,
    gridColor: 0x432d57,
    signTitle: 'STEP 3 · ZEEK PASSIVE DNS SHANNON ENTROPY WATCHTOWER',
    signSubtitle: 'BASELINE ~3.0 (LEFT) VS. 4.41 ENTROPY · 412 UNIQUE/MIN · 4-DAY NOD (RIGHT)',
    signBgHex: '#240A16',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Calm Emerald Baseline Columns (`x = -3.8`) ---
  const calmGroup = new THREE.Group();
  calmGroup.position.set(-3.8, 0, 0.35);
  root.add(calmGroup);
  calmGroup.add(createContactDisc(materials, 1.85, 0.018));

  const calmPedestal = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.55, 1.45),
    materials.createToonMaterial(0x064e3b)
  );
  calmPedestal.position.y = 0.275;
  addAnimeInkEdges(calmPedestal, materials.inkLineMaterial, 24);
  calmGroup.add(calmPedestal);

  const calmHeights = [1.05, 1.35, 0.92];
  const calmBars: THREE.Mesh[] = [];
  calmHeights.forEach((h, i) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, h, 0.62),
      materials.createToonMaterial(0x10b981, {
        emissive: 0x10b981,
        emissiveIntensity: 0.55,
      })
    );
    bar.position.set(-0.9 + i * 0.9, 0.55 + h / 2, 0);
    addAnimeInkEdges(bar, materials.inkLineMaterial, 24);
    calmGroup.add(bar);
    calmBars.push(bar);
  });

  const calmTex = createPlaqueTexture(
    'NORMAL BASELINE',
    'ENTROPY ~3.0 · CACHED',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(calmTex);

  const calmSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.65, 0.5),
    new THREE.MeshBasicMaterial({ map: calmTex })
  );
  calmSign.position.set(0, 0.28, 0.74);
  calmGroup.add(calmSign);

  // --- PROP 2: Center Coastguard Watchtower & SIEM-ENTROPY-408 Gauge (`x = 0`) ---
  const watchGroup = new THREE.Group();
  watchGroup.position.set(0, 0, 0.25);
  root.add(watchGroup);
  watchGroup.add(createContactDisc(materials, 1.85, 0.018));

  const watchTower = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 3.35, 1.45),
    materials.createToonMaterial(0x1e293b)
  );
  watchTower.position.y = 1.675;
  addAnimeInkEdges(watchTower, materials.inkLineMaterial, 24);
  watchGroup.add(watchTower);

  const nodTex = createPlaqueTexture(
    'SIEM-ENTROPY-408',
    '4-DAY NOD · 184 KB EXFIL',
    '#3B0A18',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(nodTex);

  const watchHeader = new THREE.Mesh(
    new THREE.PlaneGeometry(2.45, 0.9),
    new THREE.MeshBasicMaterial({ map: nodTex })
  );
  watchHeader.position.set(0, 2.65, 0.74);
  watchGroup.add(watchHeader);

  // Analog Entropy Needle Pivot inside cutaway bay
  const needlePivot = new THREE.Group();
  needlePivot.position.set(0, 1.05, 0.65);
  watchGroup.add(needlePivot);

  const needleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.92, 0.1),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
    })
  );
  needleMesh.position.y = 0.42;
  needlePivot.add(needleMesh);

  // Hinged Glass Cutaway Cover on Watchtower
  const cutPivot = new THREE.Group();
  cutPivot.position.set(0, 1.98, 0.78);
  watchGroup.add(cutPivot);

  const cutGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.35, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  cutGlass.position.set(0, -0.68, 0.04);
  cutPivot.add(cutGlass);

  const beaconMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.3,
  });
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 16, 12),
    beaconMat
  );
  beacon.position.y = 3.72;
  addAnimeInkEdges(beacon, materials.inkLineMaterial, 24);
  watchGroup.add(beacon);

  // --- PROP 3: Right Towering Pulsing Crimson Gibberish Columns (`x = +3.8`) ---
  const spikeGroup = new THREE.Group();
  spikeGroup.position.set(3.8, 0, 0.35);
  root.add(spikeGroup);
  spikeGroup.add(createContactDisc(materials, 1.85, 0.018));

  const spikePedestal = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.55, 1.45),
    materials.createToonMaterial(0x4c0519)
  );
  spikePedestal.position.y = 0.275;
  addAnimeInkEdges(spikePedestal, materials.inkLineMaterial, 24);
  spikeGroup.add(spikePedestal);

  const spikeHeights = [2.6, 3.25, 2.85];
  const spikeBars: { mesh: THREE.Mesh; maxH: number }[] = [];
  spikeHeights.forEach((h, i) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 1.0, 0.62),
      materials.createToonMaterial(0xe11d48, {
        emissive: 0xf43f5e,
        emissiveIntensity: 0.9,
      })
    );
    bar.position.set(-0.9 + i * 0.9, 1.05, 0);
    addAnimeInkEdges(bar, materials.inkLineMaterial, 24);
    spikeGroup.add(bar);
    spikeBars.push({ mesh: bar, maxH: h });
  });

  const spikeTex = createPlaqueTexture(
    'TUNNEL ANOMALY',
    '4.41 BITS · 78% TXT',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(spikeTex);

  const spikeSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.65, 0.5),
    new THREE.MeshBasicMaterial({ map: spikeTex })
  );
  spikeSign.position.set(0, 0.28, 0.74);
  spikeGroup.add(spikeSign);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.8, 2.55, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.8, 3.85, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.5, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.3, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DNSTUN_STEP_DURATION_SEC) + DNSTUN_STEP_DURATION_SEC) %
          DNSTUN_STEP_DURATION_SEC) /
        DNSTUN_STEP_DURATION_SEC;
      const frame = evaluateDnstunStep3State(tNorm, cutawayMode);

      cutPivot.rotation.x = -frame.cutawayOpen * 1.25;

      // Calm baseline bars breathe softly
      calmBars.forEach((b, i) => {
        const s = 0.88 + 0.12 * Math.sin(timeSec * 1.8 + i);
        b.scale.y = s;
      });

      // Crimson entropy spike columns surge high & pulse in Phase 2-3
      const surge = easeOutCubic(frame.entropySpikeHeight);
      spikeBars.forEach((sb, i) => {
        const h = 0.45 + surge * (sb.maxH - 0.45) * (0.92 + 0.08 * Math.sin(timeSec * 5 + i));
        sb.mesh.scale.y = h;
        sb.mesh.position.y = 0.55 + h / 2;
      });

      // Analog entropy needle pegs hard right into crimson zone (4.41 bits/byte)
      needlePivot.rotation.z = 0.85 - surge * 1.65;

      // Watchtower crimson alarm flares in Phase 3
      beaconMat.emissiveIntensity =
        0.3 + frame.nodAlarmFlare * (1.25 + 0.4 * Math.sin(timeSec * 10));

      return {
        glitchIntensity: frame.entropySpikeHeight * 0.48,
        magicDustIntensity: 0.25 + frame.nodAlarmFlare * 0.45,
        stasisIntensity: frame.baselineCalmLevel * 0.25,
        brakeReleaseBoost: frame.entropySpikeHeight * 0.32,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
