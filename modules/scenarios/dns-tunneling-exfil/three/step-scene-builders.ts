import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  buildClerkDispatchDesk,
  buildHarborBackdrop,
  buildOffshoreLighthouse,
  buildPostmasterRelayTower,
} from './scene-builders';

function disposeGroup(root: THREE.Group, textures: THREE.Texture[]) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry?.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
}

export function buildStep1ChunkScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHarborBackdrop(
    materials,
    'STEP #1 · 63-LETTER SCRAMBLED SLIPS & DESK LENS',
    'LEDGER SLICING  ·  INDOOR DISPATCH DESK  ·  PROCESS ATTRIBUTION',
    '#F59E0B'
  );
  root.add(bg);

  const desk = buildClerkDispatchDesk(materials);
  desk.group.position.set(0, 0, 0.25);
  desk.group.scale.setScalar(1.22);
  root.add(desk.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 2.3, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.4, 3.6, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.9, 13.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.35, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.1, 0.25),
    update: (elapsedSec, _phaseIndex, _isDark, cutawayMode) => {
      const p = (elapsedSec % 15) / 15;
      const openFactor =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
            ? 0
            : Math.min(1, p * 1.8);
      desk.cutawayHoodPivot.rotation.x = -openFactor * 0.92;
      desk.slips.forEach((slip, i) => {
        const wave = Math.sin(elapsedSec * 3.2 + i * 1.4);
        slip.position.y = 1.78 + Math.max(0, wave) * 0.28;
        slip.rotation.y = wave * 0.25;
      });
      desk.skylightLens.scale.setScalar(1 + 0.16 * Math.sin(elapsedSec * 4.5));
      return {
        glitchIntensity: 0.14,
        magicDustIntensity: 0.34,
        stasisIntensity: 0.18,
        brakeReleaseBoost: 0.12,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildStep2Sysmon22Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHarborBackdrop(
    materials,
    'STEP #2 · POSTMASTER RELAY OVER THE SEAWALL',
    'UNCACHED LOOKUPS  ·  OFFSHORE LIGHTHOUSE  ·  CODED REPLIES',
    '#38BDF8'
  );
  root.add(bg);

  const tower = buildPostmasterRelayTower(materials);
  tower.group.position.set(-2.5, 0, 0.2);
  root.add(tower.group);

  const lighthouse = buildOffshoreLighthouse(materials);
  lighthouse.group.position.set(3.2, 0, 0.2);
  root.add(lighthouse.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.5, 3.8, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.2, 4.1, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.1, 14.8),
    defaultCameraTarget: new THREE.Vector3(0.2, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.3, 2.4, 0.2),
    update: (elapsedSec) => {
      const cycle = (elapsedSec % 5) / 5;
      lighthouse.carrierPigeon.position.x = -5.6 + cycle * 5.2;
      lighthouse.carrierPigeon.position.y =
        2.6 + Math.sin(cycle * Math.PI) * 1.75;
      lighthouse.carrierPigeon.rotation.z = Math.cos(cycle * Math.PI) * 0.28;
      tower.relayArch.rotation.z = elapsedSec * 1.6;
      const flash = 0.45 + 0.55 * Math.abs(Math.sin(elapsedSec * 4.2));
      (
        lighthouse.lanternCore.material as THREE.MeshToonMaterial
      ).emissiveIntensity = flash * 1.25;
      return {
        glitchIntensity: 0.22,
        magicDustIntensity: 0.42,
        stasisIntensity: 0.14,
        brakeReleaseBoost: 0.28,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildStep3TxtBeaconScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHarborBackdrop(
    materials,
    'STEP #3 · WATCHTOWER RANDOMNESS & VOLUME ALARM',
    'GIBBERISH SCROLL SCORE  ·  CACHE MISSES  ·  NEW ISLAND FLAG',
    '#E11D48'
  );
  root.add(bg);

  const tower = buildPostmasterRelayTower(materials);
  tower.group.position.set(0, 0, 0.25);
  tower.group.scale.setScalar(1.16);
  root.add(tower.group);

  const bars: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const isHigh = i >= 2;
    const h = isHigh ? 2.45 + (i - 2) * 0.42 : 0.95 + i * 0.22;
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, h, 0.52),
      materials.createToonMaterial(isHigh ? 0xf43f5e : 0x10b981, {
        emissive: isHigh ? 0xe11d48 : 0x059669,
        emissiveIntensity: 0.65,
      })
    );
    bar.position.set(-4.4 + i * 0.92 + (i >= 2 ? 6.2 : 0), h / 2, 0.35);
    addAnimeInkEdges(bar, materials.inkLineMaterial);
    root.add(bar);
    bars.push(bar);
  }

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.8, 2.6, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.8, 3.4, 0.4);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.0),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.3, 0.3),
    update: (elapsedSec) => {
      const pulse = 0.55 + 0.45 * Math.sin(elapsedSec * 5.2);
      const lampMat = tower.watchLamp.material as THREE.MeshToonMaterial;
      lampMat.color.setHex(0xf43f5e);
      lampMat.emissive.setHex(0xe11d48);
      lampMat.emissiveIntensity = 0.7 + pulse * 0.65;
      tower.watchLamp.scale.setScalar(1 + pulse * 0.25);
      bars.forEach((b, i) => {
        if (i >= 2) {
          b.scale.y = 0.94 + 0.14 * Math.sin(elapsedSec * 4.0 + i);
        }
      });
      return {
        glitchIntensity: 0.42,
        magicDustIntensity: 0.38,
        stasisIntensity: 0.16,
        brakeReleaseBoost: 0.22,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildStep4RpzScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHarborBackdrop(
    materials,
    'STEP #4 · EMERALD HARBOR SINKHOLE NET & EGRESS LOCK',
    'ROGUE ISLAND SEALED  ·  DIRECT SEAWALL LANES LOCKED',
    '#10B981'
  );
  root.add(bg);

  const tower = buildPostmasterRelayTower(materials);
  tower.group.position.set(-2.6, 0, 0.2);
  root.add(tower.group);

  const lighthouse = buildOffshoreLighthouse(materials);
  lighthouse.group.position.set(2.8, 0, 0.2);
  lighthouse.sinkholeNet.visible = true;
  root.add(lighthouse.group);

  const fwShield = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 3.6, 3.6),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x34d399,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.42,
    })
  );
  (fwShield.material as THREE.MeshToonMaterial).depthWrite = false;
  fwShield.position.set(0.0, 1.85, 0.2);
  root.add(fwShield);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.3, 3.6, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.8, 4.1, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.1, 14.8),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.2, 2.2, 0.2),
    update: (elapsedSec) => {
      const p = (elapsedSec % 15) / 15;
      const drop = Math.min(1, p * 1.8);
      lighthouse.sinkholeNet.position.y = 5.4 - drop * 2.85;
      lighthouse.carrierPigeon.position.set(
        -3.2,
        2.3 + Math.sin(elapsedSec * 2.5) * 0.2,
        0.4
      );
      (
        lighthouse.lanternCore.material as THREE.MeshToonMaterial
      ).emissiveIntensity = 0.15;
      const lampMat = tower.watchLamp.material as THREE.MeshToonMaterial;
      lampMat.color.setHex(0x10b981);
      lampMat.emissive.setHex(0x34d399);
      lampMat.emissiveIntensity = 0.8 + 0.2 * Math.sin(elapsedSec * 3.0);
      return {
        glitchIntensity: 0.1,
        magicDustIntensity: 0.28,
        stasisIntensity: 0.45,
        brakeReleaseBoost: 0.12,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}

export function buildMemoryEntropyDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const { group: bg, textures } = buildHarborBackdrop(
    materials,
    'MEMORY DIFF · SCRAMBLED BUFFER VS. SINKHOLE STATE',
    'LEFT: STAGING BUFFER & ZERO-CACHE  ·  RIGHT: EMERALD HARBOR NET',
    '#38BDF8'
  );
  root.add(bg);

  const leftDesk = buildClerkDispatchDesk(materials);
  leftDesk.group.position.set(-3.4, 0, 0.2);
  leftDesk.cutawayHoodPivot.rotation.x = -0.85;
  root.add(leftDesk.group);

  const rightLighthouse = buildOffshoreLighthouse(materials);
  rightLighthouse.group.position.set(3.4, 0, 0.2);
  rightLighthouse.sinkholeNet.visible = true;
  rightLighthouse.carrierPigeon.visible = false;
  root.add(rightLighthouse.group);

  const auditBeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 4.4, 2.8),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.34,
    })
  );
  (auditBeam.material as THREE.MeshToonMaterial).depthWrite = false;
  auditBeam.position.set(0, 2.2, 0.35);
  root.add(auditBeam);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.4, 3.2, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 4.1, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.25),
    update: (elapsedSec, _phaseIndex, _isDark, cutawayMode) => {
      leftDesk.cutawayHoodPivot.rotation.x =
        cutawayMode === 'SEALED' ? 0 : -0.85;
      auditBeam.position.x = Math.sin(elapsedSec * 1.15) * 3.8;
      leftDesk.slips.forEach((s, i) => {
        s.position.y =
          1.78 + Math.abs(Math.sin(elapsedSec * 3.4 + i)) * 0.24;
      });
      rightLighthouse.sinkholeNet.rotation.y = elapsedSec * 0.45;
      (
        rightLighthouse.lanternCore.material as THREE.MeshToonMaterial
      ).emissiveIntensity = 0.15;
      return {
        glitchIntensity: 0.24,
        magicDustIntensity: 0.36,
        stasisIntensity: 0.32,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeGroup(root, textures),
  };
}
