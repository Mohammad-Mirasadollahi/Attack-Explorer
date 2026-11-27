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
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateLsassMemoryPplDiffState } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LSASS Memory Forensics (`lsass-memory-ppldiff`)
 * Room: Dual LSASS Protection Vault Comparator (Unshielded PPL=0 vs RunAsPPL + Credential Guard Blast Shield).
 */
export function buildLsassMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x262c3a,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x1a1e2e,
    pillarColor: 0x0f172a,
    signTitle: 'MEMORY FORENSICS · PPL=0 VS. RUNASPPL VAULT',
    signSubtitle: 'OPENPROCESS 0x1010 READ VS. STATUS_ACCESS_DENIED (VBS)',
    signBgHex: '#0F172A',
    signBorderHex: '#38BDF8',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkMat = materials.createToonMaterial(0x1e293b);
  const steelMat = materials.createToonMaterial(0x64748b);
  const goldMat = materials.createToonMaterial(0xfacc15);
  const crimsonMat = materials.createToonMaterial(0xe11d48);
  const skyMat = materials.createToonMaterial(0x38bdf8);

  // Prop 1: Left Unshielded LSASS Vault (PPL=0) Pierced by Crimson 0x1010 Cone
  const leftVault = new THREE.Group();
  leftVault.position.set(-3.15, 0, 0.2);
  leftVault.add(createContactDisc(materials, 2.0));

  const leftPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 2.2), darkMat);
  leftPlinth.position.y = 0.5;
  addAnimeInkEdges(leftPlinth, materials.inkLineMaterial, 24);
  leftVault.add(leftPlinth);

  const leftGlassMat = new THREE.MeshToonMaterial({
    color: 0xfecdd3,
    transparent: true,
    opacity: 0.44,
    gradientMap: materials.gradientMap,
  });
  const leftCasing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 1.8), leftGlassMat);
  leftCasing.position.y = 2.1;
  leftVault.add(leftCasing);

  for (let i = 0; i < 3; i++) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 0.9), goldMat);
    drawer.position.set(0, 1.45 + i * 0.62, 0);
    addAnimeInkEdges(drawer, materials.inkLineMaterial, 24);
    leftVault.add(drawer);
  }

  const crimsonBeam = new THREE.Mesh(
    new THREE.ConeGeometry(0.95, 2.6, 18, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xe11d48, transparent: true, opacity: 0.36, side: THREE.DoubleSide })
  );
  crimsonBeam.rotation.z = -Math.PI / 2;
  crimsonBeam.position.set(0.3, 2.1, 0);
  leftVault.add(crimsonBeam);

  const leftTex = createPlaqueTexture(
    'PPL = 0 · EXPOSED',
    '0x1010 READS NTLM RAM',
    '#4C0519',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(leftTex);
  const leftPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.66),
    new THREE.MeshBasicMaterial({ map: leftTex })
  );
  leftPlaque.position.set(0, 0.52, 1.12);
  leftVault.add(leftPlaque);
  root.add(leftVault);

  // Prop 2: Right Hardened RunAsPPL + Credential Guard Blast-Shielded Vault
  const rightVault = new THREE.Group();
  rightVault.position.set(3.25, 0, 0.2);
  rightVault.add(createContactDisc(materials, 2.0));

  const rightPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 2.2), darkMat);
  rightPlinth.position.y = 0.5;
  addAnimeInkEdges(rightPlinth, materials.inkLineMaterial, 24);
  rightVault.add(rightPlinth);

  const rightArmor = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 1.8), steelMat);
  rightArmor.position.y = 2.1;
  addAnimeInkEdges(rightArmor, materials.inkLineMaterial, 24);
  rightVault.add(rightArmor);

  // Glowing Cyan RunAsPPL Energy Blast Shield rebounding incoming probe
  const shieldMat = new THREE.MeshToonMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.62,
    gradientMap: materials.gradientMap,
  });
  const blastShield = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.35, 2.0), shieldMat);
  blastShield.position.set(-1.55, 2.1, 0);
  addAnimeInkEdges(blastShield, materials.inkLineMaterial, 22);
  rightVault.add(blastShield);

  const blockedProbe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), crimsonMat);
  blockedProbe.rotation.z = Math.PI / 2;
  blockedProbe.position.set(-2.1, 2.1, 0);
  rightVault.add(blockedProbe);

  const rightTex = createPlaqueTexture(
    'RUNASPPL = 1 + VBS',
    'STATUS_ACCESS_DENIED',
    '#0C4A6E',
    '#38BDF8',
    '#E0F2FE'
  );
  textures.push(rightTex);
  const rightPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.66),
    new THREE.MeshBasicMaterial({ map: rightTex })
  );
  rightPlaque.position.set(0, 0.52, 1.12);
  rightVault.add(rightPlaque);
  root.add(rightVault);

  // Prop 3: Sweeping Golden Forensic Audit Beam
  const auditBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 3.6, 2.9),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.3,
      toneMapped: false,
    })
  );
  auditBar.position.set(-4.2, 2.1, 0.2);
  root.add(auditBar);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.15, 3.45, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.25, 3.45, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLsassMemoryPplDiffState(timeSec, cutawayMode);

      auditBar.position.x = s.auditSweepX;
      leftGlassMat.opacity = 0.46 - s.cutawayOpen * 0.36;
      shieldMat.opacity = 0.55 + s.shieldRepelPulse * 0.35 - s.cutawayOpen * 0.2;
      blockedProbe.position.x = -2.1 - Math.sin(timeSec * 6) * 0.14 * s.shieldRepelPulse;
      shell.accentStripMat.color.setHex(s.shieldRepelPulse > 0.3 ? 0x38bdf8 : 0xe11d48);

      return {
        glitchIntensity: 0.14,
        magicDustIntensity: 0.32 + s.shieldRepelPulse * 0.3,
        stasisIntensity: s.shieldRepelPulse * 0.35,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
