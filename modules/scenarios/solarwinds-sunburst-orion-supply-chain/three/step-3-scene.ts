import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { SUNBURST_STEP_DURATION_SEC, evaluateSunburstStep3State } from '../choreography';

export function buildSunburstStep3Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f1526,
    floorTrimHex: 0xe11d48,
    wallColor: 0x172038,
    pillarColor: 0x243254,
    gridColor: 0x2b3b63,
    signTitle: 'STEP 3 · 14-DAY DORMANCY & AVSVMCLOUD.COM DGA DNS BEACON',
    signSubtitle: 'FNV-1A EDR BLOCKLIST + BASE32 VICTIM DOMAIN -> SELECTIVE CNAME C2',
    signBgHex: '#240A16',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const spire = new THREE.Group();
  spire.position.set(0, 0, 0.25);
  root.add(spire);
  spire.add(createContactDisc(materials, 2.2, 0.018));

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.5, 1.5), materials.createToonMaterial(0x1e293b));
  body.position.y = 1.25;
  addAnimeInkEdges(body, materials.inkLineMaterial, 24);
  spire.add(body);

  const sTex = createPlaqueTexture('ORION-MON-01 (4120)', '14-Day Sleep -> DGA DNS', '#3B0A18', '#F43F5E', '#FFE4E6');
  textures.push(sTex);
  const sFace = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), new THREE.MeshBasicMaterial({ map: sTex }));
  sFace.position.set(0, 1.4, 0.77);
  spire.add(sFace);

  const waveRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.12, 10, 28),
    materials.createToonMaterial(0xf43f5e, { emissive: 0xe11d48, emissiveIntensity: 0.9 })
  );
  waveRing.position.set(0, 3.2, 0);
  waveRing.rotation.x = Math.PI / 2;
  spire.add(waveRing);

  const cnameBeam = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.2, 0.2),
    materials.createToonMaterial(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.9 })
  );
  cnameBeam.position.set(2.4, 3.2, 0);
  root.add(cnameBeam);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.3, 0.35);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.1, 3.1, 0.35);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.35, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % SUNBURST_STEP_DURATION_SEC) + SUNBURST_STEP_DURATION_SEC) % SUNBURST_STEP_DURATION_SEC) /
        SUNBURST_STEP_DURATION_SEC;
      const frame = evaluateSunburstStep3State(tNorm, cutawayMode);
      waveRing.scale.setScalar(0.75 + frame.beaconWaveExpand * 1.15);
      waveRing.rotation.z = timeSec * 1.6;
      cnameBeam.scale.x = 0.2 + frame.cnameReplyBeam * 0.95;
      return {
        glitchIntensity: frame.beaconWaveExpand * 0.35,
        magicDustIntensity: 0.24 + frame.timerTickProgress * 0.35,
        stasisIntensity: frame.cnameReplyBeam * 0.35,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
