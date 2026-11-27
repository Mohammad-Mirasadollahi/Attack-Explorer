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
  LOG4SHELL_STEP_DURATION_SEC,
  evaluateLog4shellStep1State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Log4Shell Step 1 (`log4j-step1-ingress`)
 * Exclusive Room: `EDGE-GW-02` Nginx Ingress Mailroom Customs Gate
 * Exclusive Props:
 *   1. Powered Mailroom Sorting Conveyor Belt (`x=-4.4..+3.2`) with 7 turning rollers & amber HTTP parcel carrying `${jndi:...}` `X-Api-Version` tag
 *   2. Sky-Blue Front-Desk Arch Camera (`Nginx + Suricata SID 2034649`, `x=0.15`) with hinged cutaway sensor shroud & scanning laser curtain
 *   3. Right-Side Backend `API:8080` Intake Gate & Nested-Obfuscation Warning Panel (`x=4.35`)
 */
export function buildLog4shellStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x1c1917,
    floorTrimHex: 0xf59e0b,
    wallColor: 0x292524,
    pillarColor: 0x44403c,
    gridColor: 0x57534e,
    signTitle: 'STEP 1 · INBOUND CONVEYOR & NGINX ACCESS CAMERA',
    signSubtitle: 'EDGE-GW-02 X-API-VERSION -> SURICATA SID 2034649 · OWASP CRS 944150',
    signBgHex: '#1F1608',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.2,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Powered Mailroom Sorting Conveyor Belt (x = -0.8) ---
  const beltGroup = new THREE.Group();
  beltGroup.position.set(-0.6, 0, 0.25);
  root.add(beltGroup);

  const beltBed = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 0.82, 1.55),
    materials.createToonMaterial(0x334155)
  );
  beltBed.position.y = 0.41;
  addAnimeInkEdges(beltBed, materials.inkLineMaterial, 24);
  beltGroup.add(beltBed);

  const rollers: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) {
    const r = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 1.48, 12),
      materials.createToonMaterial(0x94a3b8)
    );
    r.rotation.x = Math.PI / 2;
    r.position.set(-3.3 + i * 1.1, 0.88, 0);
    beltGroup.add(r);
    rollers.push(r);
  }

  // Crafted Amber HTTP Parcel carrying `${jndi:ldap://...}` return tag
  const parcelTex = createPlaqueTexture(
    'X-API-VERSION',
    '${jndi:ldap://...}',
    '#3B0A18',
    '#F59E0B',
    '#FEF08A'
  );
  textures.push(parcelTex);

  const parcelGroup = new THREE.Group();
  parcelGroup.position.set(-3.1, 1.48, 0);
  beltGroup.add(parcelGroup);

  const parcelBox = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.92, 1.1),
    [
      materials.createToonMaterial(0xd97706),
      materials.createToonMaterial(0xd97706),
      materials.createToonMaterial(0xf59e0b),
      materials.createToonMaterial(0x92400e),
      new THREE.MeshBasicMaterial({ map: parcelTex }),
      materials.createToonMaterial(0xb45309),
    ]
  );
  addAnimeInkEdges(parcelBox, materials.inkLineMaterial, 24);
  parcelGroup.add(parcelBox);

  // --- PROP 2: Sky-Blue Front-Desk Arch Camera (`Suricata SID 2034649`, x = 0.2) ---
  const archGroup = new THREE.Group();
  archGroup.position.set(0.2, 0, 0.25);
  root.add(archGroup);

  for (const az of [-0.95, 0.95]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 3.2, 0.36),
      materials.createToonMaterial(0x0c4a6e)
    );
    leg.position.set(0, 1.6, az);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 24);
    archGroup.add(leg);
  }

  const archBridge = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.56, 2.35),
    materials.createToonMaterial(0x0284c7)
  );
  archBridge.position.set(0, 3.25, 0);
  addAnimeInkEdges(archBridge, materials.inkLineMaterial, 24);
  archGroup.add(archBridge);

  // Hinged Cutaway Sensor Shroud exposing Cyan Camera Lens Array
  const shroudPivot = new THREE.Group();
  shroudPivot.position.set(0, 3.55, 1.2);
  archGroup.add(shroudPivot);

  const camTex = createPlaqueTexture(
    'EDGE-GW-02 · WAF',
    'SID 2034649 · LOG',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(camTex);

  const shroudDoor = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.85, 0.1),
    [
      materials.createToonMaterial(0x38bdf8),
      materials.createToonMaterial(0x38bdf8),
      materials.createToonMaterial(0x38bdf8),
      materials.createToonMaterial(0x38bdf8),
      new THREE.MeshBasicMaterial({ map: camTex }),
      materials.createToonMaterial(0x0c4a6e),
    ]
  );
  shroudDoor.position.set(0, -0.42, 0.04);
  addAnimeInkEdges(shroudDoor, materials.inkLineMaterial, 24);
  shroudPivot.add(shroudDoor);

  const scanCurtainMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const scanCurtain = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 2.15, 1.65),
    scanCurtainMat
  );
  scanCurtain.position.set(0, 1.95, 0);
  archGroup.add(scanCurtain);

  // --- PROP 3: Right-Side Backend API:8080 Intake Gate & Obfuscation Warning (x = 4.45) ---
  const gateGroup = new THREE.Group();
  gateGroup.position.set(4.45, 0, 0.25);
  root.add(gateGroup);
  gateGroup.add(createContactDisc(materials, 1.35, 0.018));

  const gateTower = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.75, 1.45),
    materials.createToonMaterial(0x1e293b)
  );
  gateTower.position.y = 1.375;
  addAnimeInkEdges(gateTower, materials.inkLineMaterial, 24);
  gateGroup.add(gateTower);

  const gateTex = createPlaqueTexture(
    'BACKEND API:8080',
    'NESTED BYPASS RISK',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(gateTex);

  const gateScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.96),
    new THREE.MeshBasicMaterial({ map: gateTex })
  );
  gateScreen.position.set(0, 1.85, 0.74);
  gateGroup.add(gateScreen);

  const warnBeaconMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.25,
  });
  const warnBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 14, 12),
    warnBeaconMat
  );
  warnBeacon.position.y = 3.02;
  addAnimeInkEdges(warnBeacon, materials.inkLineMaterial, 24);
  gateGroup.add(warnBeacon);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.25, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(0.8, 3.85, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.0, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % LOG4SHELL_STEP_DURATION_SEC) + LOG4SHELL_STEP_DURATION_SEC) %
          LOG4SHELL_STEP_DURATION_SEC) /
        LOG4SHELL_STEP_DURATION_SEC;
      const frame = evaluateLog4shellStep1State(tNorm, cutawayMode);

      shroudPivot.rotation.x = -frame.cutawayOpen * 1.25;

      // Parcel glides smoothly down conveyor rollers under arch camera toward API:8080
      const roll = easeOutCubic(frame.parcelRollProgress);
      parcelGroup.position.x = -3.1 + roll * 6.0;
      rollers.forEach((r) => {
        r.rotation.y = timeSec * 4.0;
      });

      // Arch camera laser flashes brightly as parcel passes beneath
      scanCurtainMat.opacity = 0.14 + frame.cameraFlashIntensity * 0.42;

      // Backend API warning lamp flares as obfuscated payload reaches inner mailroom
      warnBeaconMat.emissiveIntensity =
        0.25 + frame.obfuscationBypassGlow * (1.2 + 0.4 * Math.sin(timeSec * 8));

      return {
        glitchIntensity: frame.obfuscationBypassGlow * 0.42,
        magicDustIntensity: 0.25 + frame.cameraFlashIntensity * 0.4,
        stasisIntensity: frame.cameraFlashIntensity * 0.25,
        brakeReleaseBoost: frame.obfuscationBypassGlow * 0.25,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
