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
  LOG4SHELL_STEP_DURATION_SEC,
  evaluateLog4shellMemoryDiffState,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Log4Shell Memory Forensics (`log4j-memory-classdiff`)
 * Exclusive Room: Dual JVM Heap Classloader Inspector Bay
 * Exclusive Props:
 *   1. Left Vulnerable `log4j-core-2.14.1` Heap Chamber (`0x7F9A11200000`, `x=-3.1`) with spinning `JndiLookup` gears & cutaway glass
 *   2. Right Patched `log4j-core-2.17.1+` Heap Chamber (`0x7F9A11640000`, `x=+3.1`) with inert literal-string buffer & emerald shield
 *   3. Sweeping Sky-Blue Runtime SBOM & Classpath Audit Beam
 */
export function buildLog4shellMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f172a,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x1e293b,
    pillarColor: 0x334155,
    gridColor: 0x334155,
    signTitle: 'MEMORY FORENSICS · LOG4J 2.14.1 VS. 2.17.1+ LITERAL',
    signSubtitle: '0x7F9A11200000 ACTIVE JNDILOOKUP (LEFT) VS. 0x7F9A11640000 INERT INK (RIGHT)',
    signBgHex: '#0B1628',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.6,
    depth: 10.6,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Vulnerable log4j-core-2.14.1 Heap Chamber (`x = -3.1`) ---
  const leftBench = new THREE.Group();
  leftBench.position.set(-3.1, 0, 0.2);
  root.add(leftBench);
  leftBench.add(createContactDisc(materials, 2.05, 0.018));

  const leftBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 1.35, 1.75),
    materials.createToonMaterial(0x3b0a18)
  );
  leftBase.position.y = 0.675;
  addAnimeInkEdges(leftBase, materials.inkLineMaterial, 24);
  leftBench.add(leftBase);

  const leftTex = createPlaqueTexture(
    '0x7F9A11200000 · 2.14.1',
    'JndiLookup = ENABLED',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(leftTex);

  const leftSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.88),
    new THREE.MeshBasicMaterial({ map: leftTex })
  );
  leftSign.position.set(0, 0.68, 0.89);
  leftBench.add(leftSign);

  const vulnGears: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const gg = new THREE.Group();
    gg.position.set(-0.98 + i * 0.98, 2.05, 0);
    leftBench.add(gg);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.24, 16),
      materials.createToonMaterial(0xe11d48, {
        emissive: 0xf43f5e,
        emissiveIntensity: 0.65,
      })
    );
    disc.rotation.x = Math.PI / 2;
    addAnimeInkEdges(disc, materials.inkLineMaterial, 24);
    gg.add(disc);

    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.14, 0.28),
      materials.createToonMaterial(0xfacc15)
    );
    gg.add(bar);
    vulnGears.push(gg);
  }

  // Left Cutaway Glass Hood
  const leftHoodPivot = new THREE.Group();
  leftHoodPivot.position.set(0, 2.8, -0.88);
  leftBench.add(leftHoodPivot);

  const leftHood = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 1.45, 1.75),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  leftHood.position.set(0, -0.72, 0.88);
  leftHoodPivot.add(leftHood);

  // --- PROP 2: Right Patched log4j-core-2.17.1+ Inert Literal Chamber (`x = +3.1`) ---
  const rightBench = new THREE.Group();
  rightBench.position.set(3.1, 0, 0.2);
  root.add(rightBench);
  rightBench.add(createContactDisc(materials, 2.05, 0.018));

  const rightBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 1.35, 1.75),
    materials.createToonMaterial(0x064e3b)
  );
  rightBase.position.y = 0.675;
  addAnimeInkEdges(rightBase, materials.inkLineMaterial, 24);
  rightBench.add(rightBase);

  const rightTex = createPlaqueTexture(
    '0x7F9A11640000 · 2.17.1+',
    'LITERAL BUFFER ONLY',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(rightTex);

  const rightSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.88),
    new THREE.MeshBasicMaterial({ map: rightTex })
  );
  rightSign.position.set(0, 0.68, 0.89);
  rightBench.add(rightSign);

  // Inert Emerald Literal-String Buffer Slab
  const safeMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.6,
  });
  const inertSlab = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 1.25, 0.95),
    safeMat
  );
  inertSlab.position.set(0, 2.05, 0);
  addAnimeInkEdges(inertSlab, materials.inkLineMaterial, 24);
  rightBench.add(inertSlab);

  // Right Cutaway Glass Hood
  const rightHoodPivot = new THREE.Group();
  rightHoodPivot.position.set(0, 2.8, -0.88);
  rightBench.add(rightHoodPivot);

  const rightHood = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 1.45, 1.75),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  rightHood.position.set(0, -0.72, 0.88);
  rightHoodPivot.add(rightHood);

  // --- PROP 3: Sweeping Sky-Blue Runtime SBOM Audit Beam ---
  const sweepGroup = new THREE.Group();
  sweepGroup.position.set(0, 2.2, 0.2);
  root.add(sweepGroup);

  const sweepCurtain = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.4, 2.7),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    })
  );
  sweepGroup.add(sweepCurtain);

  const sweepEmitter = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.26, 2.85),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
    })
  );
  sweepEmitter.position.y = 2.25;
  addAnimeInkEdges(sweepEmitter, materials.inkLineMaterial, 24);
  sweepGroup.add(sweepEmitter);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.1, 3.65, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % LOG4SHELL_STEP_DURATION_SEC) + LOG4SHELL_STEP_DURATION_SEC) %
          LOG4SHELL_STEP_DURATION_SEC) /
        LOG4SHELL_STEP_DURATION_SEC;
      const frame = evaluateLog4shellMemoryDiffState(tNorm, cutawayMode);

      leftHoodPivot.rotation.x = -frame.cutawayOpen * 1.18;
      rightHoodPivot.rotation.x = -frame.cutawayOpen * 1.18;

      const spin = 2.0 + frame.vulnLookupSpin * 5.5;
      vulnGears.forEach((g, idx) => {
        g.rotation.z = timeSec * spin * (idx % 2 === 0 ? 1 : -1.2);
      });

      safeMat.emissiveIntensity = 0.5 + frame.patchedShieldPulse * 0.85;
      sweepGroup.position.x = -4.2 + frame.sbomBeamSweep * 8.4;

      return {
        glitchIntensity: frame.vulnLookupSpin * 0.35,
        magicDustIntensity: 0.28 + frame.sbomBeamSweep * 0.38,
        stasisIntensity: frame.patchedShieldPulse * 0.45,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
