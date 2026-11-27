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
import { evaluateLsassStep3State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LSASS Step #3 (`lsass-step3-minidump`)
 * Room: Memory-to-Disk Serialization Press & Corridor Packing Table (MiniDumpWriteDump -> 48.2 MB MDMP -> Kraft Sleeve).
 */
export function buildLsassStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x332d36,
    floorTrimHex: 0xf43f5e,
    wallColor: 0x1e202c,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 3 · MINIDUMPWRITEDUMP SERIALIZATION',
    signSubtitle: 'DBGCORE.DLL -> 48.2 MB DEBUG.DMP ("MDMP" HEADER · EID 11)',
    signBgHex: '#18181B',
    signBorderHex: '#F43F5E',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const woodMat = materials.createToonMaterial(0x78350f);
  const kraftMat = materials.createToonMaterial(0xd97706);
  const whiteMat = materials.createToonMaterial(0xf8fafc);
  const crimsonMat = materials.createToonMaterial(0xf43f5e);
  const goldMat = materials.createToonMaterial(0xfacc15);

  // Prop 1: Center Serialization Printer Press & Overhead Crimson X-Ray Flash Head (x = 0.4, z = 0.2)
  const pressGroup = new THREE.Group();
  pressGroup.position.set(0.4, 0, 0.2);
  pressGroup.add(createContactDisc(materials, 1.55));

  const pressBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.35, 1.55), darkMat);
  pressBase.position.y = 0.675;
  addAnimeInkEdges(pressBase, materials.inkLineMaterial, 24);
  pressGroup.add(pressBase);

  // Cutaway glass hood showing internal dbgcore serialization rollers
  const hoodMat = new THREE.MeshToonMaterial({
    color: 0xfecdd3,
    transparent: true,
    opacity: 0.48,
    gradientMap: materials.gradientMap,
  });
  const pressHood = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.05, 1.4), hoodMat);
  pressHood.position.set(0, 1.88, 0);
  pressGroup.add(pressHood);

  // Flash lamp head mounted on top
  const flashMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false });
  const flashBulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), flashMat);
  flashBulb.position.set(0, 2.65, 0);
  pressGroup.add(flashBulb);

  const pressTex = createPlaqueTexture(
    'DBGCORE.DLL WRITER',
    'MINIDUMPWITHFULLMEMORY',
    '#4C0519',
    '#F43F5E',
    '#FFE4E6'
  );
  textures.push(pressTex);
  const pressPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.95, 0.56),
    new THREE.MeshBasicMaterial({ map: pressTex })
  );
  pressPlaque.position.set(0, 0.68, 0.8);
  pressGroup.add(pressPlaque);
  root.add(pressGroup);

  // Prop 2: Left Corridor Packing Table, Ejected Instant MDMP Negative & Kraft Courier Sleeve (x = -2.4, z = 0.25)
  const tableGroup = new THREE.Group();
  tableGroup.position.set(-2.4, 0, 0.25);
  tableGroup.add(createContactDisc(materials, 1.7));

  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 1.8), woodMat);
  tableTop.position.y = 1.25;
  addAnimeInkEdges(tableTop, materials.inkLineMaterial, 24);
  tableGroup.add(tableTop);
  for (const lx of [-1.15, 1.15]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.15, 1.45), darkMat);
    leg.position.set(lx, 0.575, 0);
    tableGroup.add(leg);
  }

  // Unlabeled Kraft Courier Sleeve waiting on left edge of table
  const sleeve = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.16, 1.15), kraftMat);
  sleeve.position.set(-0.65, 1.44, 0);
  addAnimeInkEdges(sleeve, materials.inkLineMaterial, 24);
  tableGroup.add(sleeve);

  // Instant 48.2 MB X-Ray Photo Negative (4D 44 4D 50 "MDMP") sliding out of press into sleeve
  const mdmpTex = createPlaqueTexture(
    '4D 44 4D 50 ("MDMP")',
    'DEBUG.DMP · 48.2 MB',
    '#0F172A',
    '#F43F5E',
    '#FECDD3'
  );
  textures.push(mdmpTex);
  const negativeCard = new THREE.Group();
  const cardBorder = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 1.05), whiteMat);
  const cardFace = new THREE.Mesh(
    new THREE.PlaneGeometry(0.92, 0.92),
    new THREE.MeshBasicMaterial({ map: mdmpTex })
  );
  cardFace.rotation.x = -Math.PI / 2;
  cardFace.position.y = 0.045;
  negativeCard.add(cardBorder, cardFace);
  negativeCard.position.set(2.4, 1.65, 0);
  tableGroup.add(negativeCard);
  root.add(tableGroup);

  // Prop 3: Right Source Vault Memory Drawers (LogonSessionList being serialized)
  const sourceVault = new THREE.Group();
  sourceVault.position.set(3.4, 0, 0.2);
  sourceVault.add(createContactDisc(materials, 1.3));
  const vaultRack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.75, 1.5), darkMat);
  vaultRack.position.y = 1.375;
  addAnimeInkEdges(vaultRack, materials.inkLineMaterial, 24);
  sourceVault.add(vaultRack);
  for (let i = 0; i < 3; i++) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.2), goldMat);
    drawer.position.set(0, 0.72 + i * 0.72, 0.72);
    sourceVault.add(drawer);
  }
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.5, 12), crimsonMat);
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(-1.5, 1.85, 0);
  sourceVault.add(pipe);
  root.add(sourceVault);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.6, 2.35, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 3.1, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 13.2),
    defaultCameraTarget: new THREE.Vector3(0.3, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLsassStep3State(timeSec, cutawayMode);

      flashBulb.scale.setScalar(0.85 + s.flashIntensity * 0.6);
      hoodMat.opacity = 0.5 - s.cutawayOpen * 0.38;

      // Negative ejects from press (local x=2.4) onto table (x=0.55), then slips into kraft sleeve (x=-0.65)
      const ejectX = 2.4 - easeOutCubic(s.negativeEject) * 1.85;
      const sleeveX = ejectX - easeOutCubic(s.sleeveInsert) * 1.2;
      negativeCard.position.set(
        sleeveX,
        1.65 - easeOutCubic(s.negativeEject) * 0.16,
        0
      );
      negativeCard.visible = s.negativeEject > 0.03;

      shell.accentStripMat.color.setHex(s.mdmpStamped ? 0xf43f5e : 0xd97706);

      return {
        glitchIntensity: s.flashIntensity * 0.35,
        magicDustIntensity: s.negativeEject * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
