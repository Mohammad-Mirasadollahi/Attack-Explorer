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
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep1State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DCSync Step 1 (`dcsync-step1-acl`)
 * Exclusive Room: Sovereign Mint Domain Root ACL Ledger Hall
 * Exclusive Props:
 *   1. Left Enterprise-DC-Only Tier-0 Baseline Stone Tablet (`x=-4.2`)
 *   2. Central Sovereign Mint Gatehouse & Brass `DC=corp,DC=local` ACL Ledger Vault (`x=0`) with rotating golden `CN=krbtgt` Crown Core, hinged cutaway brass grill & flaring crimson `1131f6aa / 1131f6ad -> svc_dir_sync` Ribbon
 *   3. Right Continuous `Security Event ID 5136` DACL Audit Sentinel (`x=4.2`)
 */
export function buildDcsyncStep1Scene(
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
    signTitle: 'STEP 1 · OVER-PRIVILEGED GATEHOUSE ACL RIBBON',
    signSubtitle: 'DC=CORP,DC=LOCAL GRANTS 1131F6AA & 1131F6AD TO NON-DC SVC_DIR_SYNC · EID 5136',
    signBgHex: '#1E160A',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Tier-0 Baseline Tablet (x = -4.2) ---
  const policyGroup = new THREE.Group();
  policyGroup.position.set(-4.2, 0, 0.25);
  root.add(policyGroup);
  policyGroup.add(createContactDisc(materials, 1.2, 0.018));

  const tablet = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 2.5, 0.72),
    materials.createToonMaterial(0x1e293b)
  );
  tablet.position.y = 1.25;
  addAnimeInkEdges(tablet, materials.inkLineMaterial, 24);
  policyGroup.add(tablet);

  const policyTex = createPlaqueTexture(
    'TIER-0 BASELINE',
    'ENTERPRISE DCs ONLY',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(policyTex);

  const policyFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 1.0),
    new THREE.MeshBasicMaterial({ map: policyTex })
  );
  policyFace.position.set(0, 1.62, 0.37);
  policyGroup.add(policyFace);

  // --- PROP 2: Central Sovereign Mint Gatehouse & Brass DACL Ledger Vault (x = 0) ---
  const mintGroup = new THREE.Group();
  mintGroup.position.set(0, 0, 0.25);
  root.add(mintGroup);
  mintGroup.add(createContactDisc(materials, 2.35, 0.018));

  const mintBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.85, 1.15, 1.85),
    materials.createToonMaterial(0x44403c)
  );
  mintBase.position.y = 0.575;
  addAnimeInkEdges(mintBase, materials.inkLineMaterial, 24);
  mintGroup.add(mintBase);

  const mintTower = new THREE.Mesh(
    new THREE.BoxGeometry(3.45, 2.35, 1.55),
    materials.createToonMaterial(0x292524)
  );
  mintTower.position.y = 2.32;
  addAnimeInkEdges(mintTower, materials.inkLineMaterial, 24);
  mintGroup.add(mintTower);

  // Spinning Golden CN=krbtgt Sovereign Crown Core atop pedestal
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 2.55, 0.65);
  mintGroup.add(crownGroup);

  const crownRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.14, 10, 24),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
    })
  );
  crownRing.rotation.x = Math.PI / 2;
  addAnimeInkEdges(crownRing, materials.inkLineMaterial, 24);
  crownGroup.add(crownRing);

  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.42, 6),
      materials.createToonMaterial(0xfacc15, {
        emissive: 0xf59e0b,
        emissiveIntensity: 0.75,
      })
    );
    spire.position.set(Math.cos(a) * 0.52, 0.25, Math.sin(a) * 0.52);
    crownGroup.add(spire);
  }

  // Hinged Brass Cutaway Grill covering Crown Core & ACL Ledger
  const grillPivot = new THREE.Group();
  grillPivot.position.set(0, 3.35, 0.92);
  mintGroup.add(grillPivot);

  const grillFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.95, 1.65, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  grillFrame.position.set(0, -0.82, 0.04);
  grillPivot.add(grillFrame);

  // Exposed Crimson Gatehouse ACL Ribbon (1131f6aa & 1131f6ad -> svc_dir_sync)
  const ribbonTex = createPlaqueTexture(
    'EXPOSED ACE · 1131F6AD',
    'CORP\\svc_dir_sync',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(ribbonTex);

  const ribbonMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.4,
  });
  const aclRibbon = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 0.85, 0.18),
    [
      ribbonMat,
      ribbonMat,
      ribbonMat,
      ribbonMat,
      new THREE.MeshBasicMaterial({ map: ribbonTex }),
      ribbonMat,
    ]
  );
  aclRibbon.position.set(0, 1.15, 0.98);
  addAnimeInkEdges(aclRibbon, materials.inkLineMaterial, 24);
  mintGroup.add(aclRibbon);

  // --- PROP 3: Right Security EID 5136 DACL Audit Sentinel (x = +4.2) ---
  const auditGroup = new THREE.Group();
  auditGroup.position.set(4.2, 0, 0.25);
  root.add(auditGroup);
  auditGroup.add(createContactDisc(materials, 1.25, 0.018));

  const auditBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 2.55, 0.95),
    materials.createToonMaterial(0x1e293b)
  );
  auditBody.position.y = 1.275;
  addAnimeInkEdges(auditBody, materials.inkLineMaterial, 24);
  auditGroup.add(auditBody);

  const eid5136Tex = createPlaqueTexture(
    'SECURITY EID 5136',
    'nTSecurityDescriptor',
    '#0B192C',
    '#38BDF8',
    '#BAE6FD'
  );
  textures.push(eid5136Tex);

  const auditScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.78, 0.96),
    new THREE.MeshBasicMaterial({ map: eid5136Tex })
  );
  auditScreen.position.set(0, 1.72, 0.49);
  auditGroup.add(auditScreen);

  const scanBeamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const scanBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.35, 3.2, 12),
    scanBeamMat
  );
  scanBeam.rotation.z = Math.PI / 2;
  scanBeam.position.set(2.35, 1.45, 0.6);
  root.add(scanBeam);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.75, 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.5, 2.15, 0.65);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.4, 12.8),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncStep1State(tNorm, cutawayMode);

      crownGroup.rotation.y = timeSec * (1.2 + frame.crownSpinBoost * 1.4);
      crownGroup.position.y = 2.55 + Math.sin(timeSec * 2.4) * 0.09;

      // Cutaway grill lifts upward
      grillPivot.rotation.x = -frame.cutawayOpen * 1.28;

      // Exposed crimson ribbon flares and pushes forward slightly
      ribbonMat.emissiveIntensity = 0.35 + frame.badRibbonFlare * 1.25;
      aclRibbon.position.z = 0.98 + frame.badRibbonFlare * 0.16;

      // Right-side EID 5136 scanner beam sweeps toward the exposed ACE ribbon
      scanBeamMat.opacity = 0.08 + frame.eid5136AuditScan * 0.35;

      return {
        glitchIntensity: frame.badRibbonFlare * 0.42,
        magicDustIntensity: 0.25 + frame.crownSpinBoost * 0.35,
        stasisIntensity: frame.eid5136AuditScan * 0.32,
        brakeReleaseBoost: frame.badRibbonFlare * 0.25,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
