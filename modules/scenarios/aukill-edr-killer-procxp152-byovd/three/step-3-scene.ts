import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { AUKILL_STEP_DURATION_SEC, evaluateAukillStep3State } from '../choreography';

export function buildAukillStep3Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x160d14,
    floorTrimHex: 0xe11d48,
    wallColor: 0x24141f,
    pillarColor: 0x381e30,
    gridColor: 0x422439,
    signTitle: 'STEP 3 · CONTINUOUS IOCTL 0x83350004 EDR KILL LOOP',
    signSubtitle: 'NT!ZWTERMINATEPROCESS LOOP -> SYSTEM EID 7031 & HEARTBEAT SILENCE',
    signBgHex: '#2A0912',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const lamps: THREE.Mesh[] = [];
  const xs = [-3.2, 0.0, 3.2];
  const labels = ['MSMPENG.EXE', 'CSFALCON', 'SENTINEL'];
  xs.forEach((x, idx) => {
    const grp = new THREE.Group();
    grp.position.set(x, 0, 0.25);
    root.add(grp);
    grp.add(createContactDisc(materials, 1.35, 0.018));
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.7, 1.2), materials.createToonMaterial(0x1e3a5f));
    tower.position.y = 1.35;
    addAnimeInkEdges(tower, materials.inkLineMaterial, 24);
    grp.add(tower);

    const tex = createPlaqueTexture(labels[idx], 'EID 7031 Crash Loop', '#3B0A18', '#F43F5E', '#FFE4E6');
    textures.push(tex);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.85), new THREE.MeshBasicMaterial({ map: tex }));
    face.position.set(0, 1.5, 0.62);
    grp.add(face);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 12),
      materials.createToonMaterial(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.9 })
    );
    lamp.position.set(0, 3.1, 0);
    grp.add(lamp);
    lamps.push(lamp);
  });

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.2, 3.3, 0.35);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.2, 3.3, 0.35);
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
        (((timeSec % AUKILL_STEP_DURATION_SEC) + AUKILL_STEP_DURATION_SEC) % AUKILL_STEP_DURATION_SEC) /
        AUKILL_STEP_DURATION_SEC;
      const frame = evaluateAukillStep3State(tNorm, cutawayMode);
      const flips = [frame.breakerFlip1, frame.breakerFlip2, frame.breakerFlip3];
      lamps.forEach((lamp, i) => {
        const m = lamp.material as THREE.MeshToonMaterial;
        if (flips[i] > 0.5) {
          m.color.setHex(0x475569);
          m.emissive.setHex(0xe11d48);
          m.emissiveIntensity = 0.2;
        } else {
          m.color.setHex(0x38bdf8);
          m.emissive.setHex(0x0ea5e9);
          m.emissiveIntensity = 0.9;
        }
      });
      return {
        glitchIntensity: (frame.breakerFlip1 + frame.breakerFlip2 + frame.breakerFlip3) * 0.2,
        magicDustIntensity: 0.24,
        stasisIntensity: frame.breakerFlip3 * 0.35,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
