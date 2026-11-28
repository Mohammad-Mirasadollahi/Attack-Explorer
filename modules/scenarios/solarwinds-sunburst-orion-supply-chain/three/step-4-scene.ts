import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { SUNBURST_STEP_DURATION_SEC, evaluateSunburstStep4State } from '../choreography';

export function buildSunburstStep4Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0b1918,
    floorTrimHex: 0x10b981,
    wallColor: 0x122624,
    pillarColor: 0x1d3b38,
    gridColor: 0x224743,
    signTitle: 'STEP 4 · TEARDROP LOADER & AD FS GOLDEN SAML AUDIT',
    signSubtitle: 'OFFLINE FORGED SAML ASSERTION CAUGHT BY MISSING AD FS EVENT ID 1200',
    signBgHex: '#052E16',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const adfs = new THREE.Group();
  adfs.position.set(-3.4, 0, 0.25);
  root.add(adfs);
  adfs.add(createContactDisc(materials, 1.6, 0.018));
  const adfsBox = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.5, 1.3), materials.createToonMaterial(0x78350f));
  adfsBox.position.y = 1.25;
  addAnimeInkEdges(adfsBox, materials.inkLineMaterial, 24);
  adfs.add(adfsBox);
  const aTex = createPlaqueTexture('ADFS-01 SIGNING KEY', 'Exported Offline (PFX)', '#2E1905', '#F59E0B', '#FEF08A');
  textures.push(aTex);
  const aFace = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.9), new THREE.MeshBasicMaterial({ map: aTex }));
  aFace.position.set(0, 1.45, 0.67);
  adfs.add(aFace);

  const forgedPass = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.72, 0.16),
    materials.createToonMaterial(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 })
  );
  forgedPass.position.set(-1.5, 2.3, 0.4);
  addAnimeInkEdges(forgedPass, materials.inkLineMaterial, 24);
  root.add(forgedPass);

  const siem = new THREE.Group();
  siem.position.set(3.4, 0, 0.25);
  root.add(siem);
  siem.add(createContactDisc(materials, 1.6, 0.018));
  const siemBox = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.5, 1.3), materials.createToonMaterial(0x064e3b));
  siemBox.position.y = 1.25;
  addAnimeInkEdges(siemBox, materials.inkLineMaterial, 24);
  siem.add(siemBox);
  const sTex = createPlaqueTexture('KQL ANTI-JOIN', '0 AD FS EID 1200 -> ALERT', '#052E16', '#10B981', '#D1FAE5');
  textures.push(sTex);
  const sFace = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.9), new THREE.MeshBasicMaterial({ map: sTex }));
  sFace.position.set(0, 1.45, 0.67);
  siem.add(sFace);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.4, 2.9, 0.35);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 2.9, 0.35);
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
      const frame = evaluateSunburstStep4State(tNorm, cutawayMode);
      forgedPass.position.x = -2.6 + frame.forgedPassFly * 5.2;
      forgedPass.position.y = 2.1 + Math.sin(frame.forgedPassFly * Math.PI) * 0.75;
      forgedPass.rotation.y = Math.sin(timeSec * 2.2) * 0.35;
      return {
        glitchIntensity: frame.auditGapAlarm * 0.4,
        magicDustIntensity: 0.24 + frame.keyExportProgress * 0.35,
        stasisIntensity: frame.auditGapAlarm * 0.4,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
