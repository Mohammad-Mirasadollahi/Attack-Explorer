import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { disposeStepScene } from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep1State,
} from '../choreography';
import {
  addCitySkylineBackdrop,
  buildCrownSealAssembly,
  buildStreetLamp,
  createBrassPlaqueTexture,
  createLedBoardTexture,
  createMintPbrPalette,
} from './pbr-mint-assets';

/**
 * Photorealistic PBR Standalone Scene — DCSync Step 1 (`dcsync-step1-acl`)
 * Story: Close-up Sovereign Mint Gatehouse Forecourt & Vault Access Registry.
 *   - Center: Neoclassical limestone Mint Gatehouse Tower with bolted bronze vault doors,
 *     upper panoramic Crown Gallery housing the spinning golden Sovereign Crown Seal (`CN=krbtgt`),
 *     and front glass-fronted Gatehouse Registry Case (hinged cutaway glass) displaying the
 *     forgotten woven crimson-gold Service Ribbon (`1131f6aa / 1131f6ad -> svc_dir_sync`).
 *   - Left: Carved Granite Tier-0 Policy Obelisk (`ENTERPRISE DCs ONLY`).
 *   - Right: Brushed-Steel `Security Event ID 5136` Automated Gatehouse Audit Pedestal with
 *     articulated laser inspection arm that sweeps the pinned ribbon and flips its LED display.
 */
export function buildDcsyncStep1Scene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl = false
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const palette = createMintPbrPalette(textures);

  // Ground granite forecourt plaza & asphalt curb
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(76, 66), palette.sidewalk);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0, -6);
  plaza.receiveShadow = true;
  root.add(plaza);

  const curbRoad = new THREE.Mesh(new THREE.BoxGeometry(60, 0.04, 4.2), palette.asphalt);
  curbRoad.position.set(0, -0.01, 5.2);
  root.add(curbRoad);

  addCitySkylineBackdrop(root, palette, -4);

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.75,
    roughness: 0.25,
  });
  for (const lx of [-6.4, 6.4]) {
    const lamp = buildStreetLamp(palette.iron, lampBulbMat);
    lamp.position.set(lx, 0, 2.8);
    lamp.rotation.y = lx < 0 ? 0.3 : Math.PI - 0.3;
    root.add(lamp);
  }

  // --- LEFT: Carved Granite Tier-0 Policy Obelisk (x = -4.8) ---
  const policyGroup = new THREE.Group();
  policyGroup.position.set(-4.8, 0, 0.4);
  policyGroup.rotation.y = 0.24;
  root.add(policyGroup);

  const obeliskShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 2.4),
    new THREE.MeshBasicMaterial({
      map: palette.contactShadowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    })
  );
  obeliskShadow.rotation.x = -Math.PI / 2;
  obeliskShadow.position.y = 0.02;
  policyGroup.add(obeliskShadow);

  const obeliskBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.42, 1.3), palette.granitePlinth);
  obeliskBase.position.y = 0.21;
  policyGroup.add(obeliskBase);

  const obeliskShaft = new THREE.Mesh(new THREE.BoxGeometry(2.05, 2.55, 0.85), palette.limestone);
  obeliskShaft.position.y = 1.68;
  obeliskShaft.castShadow = !isSoftwareGl;
  policyGroup.add(obeliskShaft);

  const obeliskCap = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.18, 1.05), palette.darkBronze);
  obeliskCap.position.y = 3.04;
  policyGroup.add(obeliskCap);

  const policyLedTex = createLedBoardTexture(
    'TIER-0 GATEHOUSE RULE',
    [
      { text: '[POLICY] PEER MINT TOWERS ONLY', color: '#34d399' },
      { text: 'ALLOWED: ENTERPRISE DCs ($)', color: '#a7f3d0' },
      { text: 'DENY: NON-DC SERVICE ACCOUNTS', color: '#fde047' },
    ],
    'EMERALD',
    textures
  );
  const policyScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.78, 0.94),
    new THREE.MeshStandardMaterial({
      map: policyLedTex,
      emissiveMap: policyLedTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.42,
      roughness: 0.3,
    })
  );
  policyScreen.position.set(0, 1.95, 0.44);
  policyGroup.add(policyScreen);

  // --- CENTER: Sovereign Mint Gatehouse Tower + Upper Crown Chamber + Registry Case (x = 0) ---
  const mintGroup = new THREE.Group();
  mintGroup.position.set(0, 0, -0.2);
  root.add(mintGroup);

  const mintShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 5.4),
    new THREE.MeshBasicMaterial({
      map: palette.contactShadowTex,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
  );
  mintShadow.rotation.x = -Math.PI / 2;
  mintShadow.position.y = 0.02;
  mintGroup.add(mintShadow);

  // Stepped granite foundation & limestone portico
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.52, 3.6), palette.granitePlinth);
  plinth.position.y = 0.26;
  mintGroup.add(plinth);

  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.25, 3.0), palette.limestone);
  lowerBody.position.y = 2.14;
  lowerBody.castShadow = !isSoftwareGl;
  mintGroup.add(lowerBody);

  // 4 fluted limestone portico columns framing the Gatehouse Registry
  for (const cx of [-1.72, -1.18, 1.18, 1.72]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 2.75, 14), palette.limestone);
    col.position.set(cx, 1.88, 1.72);
    mintGroup.add(col);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.36), palette.limestone);
    cap.position.set(cx, 3.3, 1.72);
    mintGroup.add(cap);
  }

  const cornice = new THREE.Mesh(new THREE.BoxGeometry(4.65, 0.26, 3.75), palette.darkBronze);
  cornice.position.y = 3.68;
  mintGroup.add(cornice);

  const gatePlaqueTex = createBrassPlaqueTexture(
    'GATEHOUSE ACCESS REGISTRY',
    'DC=CORP,DC=LOCAL · nTSecurityDescriptor',
    textures
  );
  const gatePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.62),
    new THREE.MeshStandardMaterial({ map: gatePlaqueTex, roughness: 0.36, metalness: 0.45 })
  );
  gatePlaque.position.set(0, 3.35, 1.88);
  mintGroup.add(gatePlaque);

  // Recessed Bronze Registry Bulletin Cabinet on the front facade (y = 0.75 .. 2.85, z = 1.54)
  const cabinetBack = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.95, 0.22), palette.darkBronze);
  cabinetBack.position.set(0, 1.76, 1.52);
  mintGroup.add(cabinetBack);

  const aclLedTex = createLedBoardTexture(
    'EXPOSED EXTENDED RIGHTS',
    [
      { text: 'PRINCIPAL: CORP\\svc_dir_sync', color: '#fda4af' },
      { text: 'GUID 1: 1131f6aa (Get-Changes)', color: '#fde047' },
      { text: 'GUID 2: 1131f6ad (Get-All)', color: '#fb7185' },
    ],
    'ROSE',
    textures
  );
  const aclBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.42, 0.74),
    new THREE.MeshStandardMaterial({
      map: aclLedTex,
      emissiveMap: aclLedTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.42,
      roughness: 0.3,
    })
  );
  aclBoard.position.set(-0.24, 2.15, 1.65);
  mintGroup.add(aclBoard);

  // Forgotten Crimson-Gold Woven Service Ribbon pinned inside the Gatehouse Registry
  const ribbonHookGroup = new THREE.Group();
  ribbonHookGroup.position.set(0.68, 2.38, 1.68);
  mintGroup.add(ribbonHookGroup);

  const brassPin = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 14), palette.brass);
  ribbonHookGroup.add(brassPin);

  const ribbonMat = new THREE.MeshStandardMaterial({
    map: palette.ribbonTex,
    emissive: 0xe11d48,
    emissiveIntensity: 0.18,
    roughness: 0.56,
    metalness: 0.14,
    side: THREE.DoubleSide,
  });
  const ribbonMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 1.24, 1, 6), ribbonMat);
  ribbonMesh.position.set(0, -0.64, 0.04);
  ribbonHookGroup.add(ribbonMesh);

  // Hinged Glass Cutaway Door covering the Gatehouse Registry Cabinet
  const cutawayPivot = new THREE.Group();
  cutawayPivot.position.set(0, 2.72, 1.76);
  mintGroup.add(cutawayPivot);

  const glassDoor = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 1.88), palette.galleryGlass);
  glassDoor.position.set(0, -0.94, 0);
  cutawayPivot.add(glassDoor);

  const doorTrim = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.08, 0.08), palette.brass);
  doorTrim.position.set(0, -1.88, 0.02);
  cutawayPivot.add(doorTrim);

  // Optical Clearance Conduit connecting the exposed ribbon up to the Master Crown Chamber (flares in Phase 2!)
  const leakConduitMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const leakConduit = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.14, 2.2, 14, 1, true),
    leakConduitMat
  );
  leakConduit.position.set(0.68, 3.6, 1.56);
  mintGroup.add(leakConduit);

  // Upper Panoramic Master Crown Chamber (y = 3.82 .. 5.85)
  for (const sx of [-1.78, 1.78]) {
    for (const sz of [-1.22, 1.22]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.95, 0.42), palette.limestone);
      pier.position.set(sx, 4.78, sz);
      mintGroup.add(pier);
    }
  }
  const chamberGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.15, 1.84), palette.galleryGlass);
  chamberGlass.position.set(0, 4.78, 1.24);
  mintGroup.add(chamberGlass);

  const crownPedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.74, 0.86, 0.34, 24),
    palette.darkBronze
  );
  crownPedestal.position.y = 3.98;
  mintGroup.add(crownPedestal);

  const crownMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    emissive: 0xb45309,
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.2,
  });
  const crownAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xd97706,
    emissiveIntensity: 0.32,
    metalness: 0.88,
    roughness: 0.2,
  });
  const crownSpinner = buildCrownSealAssembly(crownMat, palette.darkBronze, crownAccentMat);
  crownSpinner.scale.setScalar(1.12);
  crownSpinner.position.y = 4.16;
  mintGroup.add(crownSpinner);

  const roofCap = new THREE.Mesh(new THREE.BoxGeometry(4.55, 0.24, 3.25), palette.darkBronze);
  roofCap.position.y = 5.86;
  mintGroup.add(roofCap);

  const mansard = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 2.25, 1.05, 4),
    palette.copperRoof
  );
  mansard.rotation.y = Math.PI / 4;
  mansard.position.y = 6.5;
  mintGroup.add(mansard);

  // --- RIGHT: Automated Security EID 5136 Gatehouse Audit Pedestal (x = +4.6) ---
  const auditGroup = new THREE.Group();
  auditGroup.position.set(4.6, 0, 0.65);
  auditGroup.rotation.y = -0.32;
  root.add(auditGroup);

  const auditBase = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.08, 0.34, 12), palette.granitePlinth);
  auditBase.position.y = 0.17;
  auditGroup.add(auditBase);

  const auditColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.58, 1.6, 12), palette.steel);
  auditColumn.position.y = 1.12;
  auditGroup.add(auditColumn);

  const auditHousing = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.38, 0.56), palette.darkBronze);
  auditHousing.position.y = 2.48;
  auditGroup.add(auditHousing);

  const auditStandbyTex = createLedBoardTexture(
    'SECURITY EID 5136 MONITOR',
    [
      { text: 'WATCHING: nTSecurityDescriptor', color: '#7dd3fc' },
      { text: 'TARGET: DC=corp,DC=local', color: '#cbd5e1' },
      { text: 'STATUS: PERIODIC TIER-0 AUDIT', color: '#34d399' },
    ],
    'SKY',
    textures
  );
  const auditAlertTex = createLedBoardTexture(
    '!! EID 5136 · ROGUE ACE !!',
    [
      { text: 'FOUND: CORP\\svc_dir_sync', color: '#fda4af' },
      { text: 'RIGHTS: 1131f6aa & 1131f6ad', color: '#fde047' },
      { text: 'ACTION: REVOKE BEFORE DCSYNC', color: '#6ee7b7' },
    ],
    'EMERALD',
    textures
  );
  const auditScreenMat = new THREE.MeshStandardMaterial({
    map: auditStandbyTex,
    emissiveMap: auditStandbyTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.48,
    roughness: 0.28,
  });
  const auditScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.08, 1.18), auditScreenMat);
  auditScreen.position.set(0, 2.48, 0.3);
  auditGroup.add(auditScreen);

  // Articulated Scanner Head + World-Space Laser Scan Cone sweeping onto the pinned Ribbon
  const scanHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), palette.brass);
  scanHead.position.set(-1.18, 2.25, 0.12);
  auditGroup.add(scanHead);

  const scanConeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const scanCone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 18, 1, true), scanConeMat);
  scanCone.visible = false;
  root.add(scanCone);

  const scanStart = new THREE.Vector3();
  const scanEnd = new THREE.Vector3();
  const scanDir = new THREE.Vector3();
  const downAxis = new THREE.Vector3(0, -1, 0);
  let showingAlert = false;

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 6.2, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.25, 2.55, 1.75);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.8, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.6, 0.8),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncStep1State(tNorm, cutawayMode);

      // Master Crown spins smoothly inside upper glass chamber
      crownSpinner.rotation.y = timeSec * (0.95 + frame.crownSpinBoost * 1.1);
      crownSpinner.position.y = 4.16 + Math.sin(timeSec * 2.1) * 0.05;

      // Cutaway glass door lifts open smoothly
      cutawayPivot.rotation.x = -frame.cutawayOpen * 1.25;

      // Crimson-gold service ribbon sways & pulses when exposed in Phase 2
      ribbonHookGroup.rotation.z = Math.sin(timeSec * 2.4) * 0.07;
      ribbonMat.emissiveIntensity = 0.16 + frame.badRibbonFlare * 0.72;
      leakConduitMat.opacity = frame.badRibbonFlare * (0.22 + 0.08 * Math.sin(timeSec * 6));

      // Phase 3: EID 5136 Audit Pedestal sweeps laser onto the pinned ribbon & flips screen
      const auditActive = frame.eid5136AuditScan > 0.06;
      scanCone.visible = auditActive;
      if (auditActive) {
        auditGroup.updateMatrixWorld(true);
        scanHead.getWorldPosition(scanStart);
        root.worldToLocal(scanStart);
        const sweepY = 1.65 + Math.sin(timeSec * 3.8) * 0.45;
        scanEnd.set(0.68, sweepY, 1.5);
        scanDir.subVectors(scanEnd, scanStart);
        scanCone.position.copy(scanStart).addScaledVector(scanDir, 0.5);
        scanCone.scale.set(1, Math.max(0.2, scanDir.length()), 1);
        scanCone.quaternion.setFromUnitVectors(downAxis, scanDir.normalize());
        scanConeMat.opacity = 0.22 * frame.eid5136AuditScan;
        scanConeMat.color.setHex(frame.eid5136AuditScan > 0.55 ? 0x10b981 : 0x38bdf8);
      }

      const shouldShowAlert = frame.eid5136AuditScan > 0.45;
      if (showingAlert !== shouldShowAlert) {
        showingAlert = shouldShowAlert;
        const nextTex = shouldShowAlert ? auditAlertTex : auditStandbyTex;
        auditScreenMat.map = nextTex;
        auditScreenMat.emissiveMap = nextTex;
        auditScreenMat.needsUpdate = true;
      }

      return {
        glitchIntensity: frame.badRibbonFlare * 0.3,
        magicDustIntensity: 0,
        stasisIntensity: frame.eid5136AuditScan * 0.25,
        brakeReleaseBoost: frame.badRibbonFlare * 0.2,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
