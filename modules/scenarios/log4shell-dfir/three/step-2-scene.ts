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
  evaluateLog4shellStep2State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Log4Shell Step 2 (`log4j-step2-lookup`)
 * Exclusive Room: JVM `log4j-core-2.14.1` Copper Logger Engine Room
 * Exclusive Props:
 *   1. Left `logger.info(X-Api-Version)` Input Hopper (`x=-4.3`)
 *   2. Central Copper Printing Press (`x=0`) with hinged glass cutaway exposing 3 spinning `MessagePatternConverter` gears, stuck crimson `formatMsgNoLookups = false` toggle lever & spinning `JndiLookup` rotary dialer
 *   3. Right SBOM Nested Fat-JAR Archive Scanner Rack (`shaded < 2.17.1`, `x=4.3`)
 */
export function buildLog4shellStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x1b1218,
    floorTrimHex: 0xe11d48,
    wallColor: 0x2a1a24,
    pillarColor: 0x45283a,
    gridColor: 0x4c2b40,
    signTitle: 'STEP 2 · LOG4J-CORE-2.14.1 MESSAGEPATTERNCONVERTER',
    signSubtitle: 'FORMATMSGNOLOOKUPS = FALSE -> JNDILOOKUP.LOOKUP() · SHADED JAR SBOM AUDIT',
    signBgHex: '#260A14',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left logger.info() Input Hopper (x = -4.3) ---
  const hopperGroup = new THREE.Group();
  hopperGroup.position.set(-4.3, 0, 0.25);
  root.add(hopperGroup);
  hopperGroup.add(createContactDisc(materials, 1.25, 0.018));

  const hopperBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 2.25, 1.15),
    materials.createToonMaterial(0x334155)
  );
  hopperBase.position.y = 1.125;
  addAnimeInkEdges(hopperBase, materials.inkLineMaterial, 24);
  hopperGroup.add(hopperBase);

  const hopperTex = createPlaqueTexture(
    'JVM BILLING APP',
    'logger.info(header)',
    '#1F1608',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(hopperTex);

  const hopperFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 0.92),
    new THREE.MeshBasicMaterial({ map: hopperTex })
  );
  hopperFace.position.set(0, 1.55, 0.59);
  hopperGroup.add(hopperFace);

  // --- PROP 2: Central Copper log4j-core-2.14.1 Printing Press (x = 0) ---
  const pressGroup = new THREE.Group();
  pressGroup.position.set(0, 0, 0.3);
  root.add(pressGroup);
  pressGroup.add(createContactDisc(materials, 2.45, 0.018));

  const copperMat = materials.createToonMaterial(0xb45309);
  const pressBase = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 1.35, 1.95),
    copperMat
  );
  pressBase.position.y = 0.675;
  addAnimeInkEdges(pressBase, materials.inkLineMaterial, 24);
  pressGroup.add(pressBase);

  const pressTex = createPlaqueTexture(
    'LOG4J-CORE-2.14.1.JAR',
    'formatMsgNoLookups=false',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(pressTex);

  const pressSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.45, 0.85),
    new THREE.MeshBasicMaterial({ map: pressTex })
  );
  pressSign.position.set(0, 0.68, 0.99);
  pressGroup.add(pressSign);

  // 3 Spinning Copper/Crimson MessagePatternConverter Gears
  const parserGears: THREE.Group[] = [];
  [-1.2, 0, 1.2].forEach((gx, idx) => {
    const gg = new THREE.Group();
    gg.position.set(gx, 2.08, 0.05);
    pressGroup.add(gg);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 0.28, 16),
      materials.createToonMaterial(idx === 1 ? 0xe11d48 : 0xd97706, {
        emissive: idx === 1 ? 0xf43f5e : 0xb45309,
        emissiveIntensity: 0.55,
      })
    );
    disc.rotation.x = Math.PI / 2;
    addAnimeInkEdges(disc, materials.inkLineMaterial, 24);
    gg.add(disc);

    for (let t = 0; t < 4; t++) {
      const ang = (t * Math.PI) / 2;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.24, 0.32),
        materials.createToonMaterial(0xfef08a)
      );
      spoke.position.set(Math.cos(ang) * 0.54, Math.sin(ang) * 0.54, 0);
      spoke.rotation.z = ang + Math.PI / 2;
      gg.add(spoke);
    }

    parserGears.push(gg);
  });

  // Top JndiLookup Rotary Dialer Beacon
  const jndiOrbMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.35,
  });
  const jndiOrb = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.42, 0),
    jndiOrbMat
  );
  jndiOrb.position.set(0, 3.32, 0);
  addAnimeInkEdges(jndiOrb, materials.inkLineMaterial, 24);
  pressGroup.add(jndiOrb);

  // Hinged Cutaway Glass Inspection Hatch
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(0, 2.82, -0.92);
  pressGroup.add(hatchPivot);

  const hatchGlass = new THREE.Mesh(
    new THREE.BoxGeometry(4.05, 1.45, 1.88),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  hatchGlass.position.set(0, -0.72, 0.94);
  hatchPivot.add(hatchGlass);

  // --- PROP 3: Right SBOM Nested Fat-JAR Scanner Rack (x = +4.3) ---
  const sbomGroup = new THREE.Group();
  sbomGroup.position.set(4.3, 0, 0.25);
  root.add(sbomGroup);
  sbomGroup.add(createContactDisc(materials, 1.3, 0.018));

  const sbomRack = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.75, 1.1),
    materials.createToonMaterial(0x1e293b)
  );
  sbomRack.position.y = 1.375;
  addAnimeInkEdges(sbomRack, materials.inkLineMaterial, 24);
  sbomGroup.add(sbomRack);

  const sbomTex = createPlaqueTexture(
    'FLEET SBOM AUDIT',
    'FAT JARs < 2.17.1',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(sbomTex);

  const sbomScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.82, 0.98),
    new THREE.MeshBasicMaterial({ map: sbomTex })
  );
  sbomScreen.position.set(0, 1.92, 0.56);
  sbomGroup.add(sbomScreen);

  const jarSlots: THREE.MeshToonMaterial[] = [];
  for (let i = 0; i < 3; i++) {
    const jm = materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.25,
    });
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.36, 0.14), jm);
    slot.position.set(-0.55 + i * 0.55, 0.85, 0.56);
    sbomGroup.add(slot);
    jarSlots.push(jm);
  }

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.35, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.6, 3.15, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 13.0),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % LOG4SHELL_STEP_DURATION_SEC) + LOG4SHELL_STEP_DURATION_SEC) %
          LOG4SHELL_STEP_DURATION_SEC) /
        LOG4SHELL_STEP_DURATION_SEC;
      const frame = evaluateLog4shellStep2State(tNorm, cutawayMode);

      hatchPivot.rotation.x = -frame.cutawayOpen * 1.25;

      const speed = 1.6 + frame.gearSpinBoost * 4.5 + frame.jndiDispatchLevel * 3.5;
      parserGears.forEach((g, idx) => {
        g.rotation.z = timeSec * speed * (idx % 2 === 0 ? 1 : -1.15);
      });

      jndiOrb.rotation.y = timeSec * 2.8;
      jndiOrbMat.emissiveIntensity =
        0.35 + frame.jndiDispatchLevel * (1.2 + 0.35 * Math.sin(timeSec * 9));

      jarSlots.forEach((jm, idx) => {
        jm.emissiveIntensity = frame.sbomScanPulse > idx * 0.28 ? 1.25 : 0.2;
      });

      return {
        glitchIntensity: frame.jndiDispatchLevel * 0.52,
        magicDustIntensity: 0.25 + frame.gearSpinBoost * 0.45,
        stasisIntensity: frame.sbomScanPulse * 0.35,
        brakeReleaseBoost: frame.jndiDispatchLevel * 0.35,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
