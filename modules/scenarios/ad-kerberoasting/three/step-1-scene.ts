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
  KERB_STEP_DURATION_SEC,
  evaluateKerbStep1State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Kerberoasting Step 1 (`kerb-step1-spn`)
 * Exclusive Room: Grand Hotel LDAP Bellboard Hall (Warm walnut & brass architectural room)
 * Exclusive Props:
 *   1. Guest Room Badge Pedestal (`CORP\j.miller` unprivileged token card advancing to board)
 *   2. Grand Mahogany VIP Suite Bellboard (`x=0`) with 6 brass plaques, hinged cutaway glass vitrine & `MSSQLSvc/FIN-SQL01` glow
 *   3. Articulated Brass LDAP TCP/389 Sieve Scanner gliding along overhead track
 *   4. Right-Side Directory Audit Console (`Event ID 1644` & Honey-SPN Canary Sentinel)
 */
export function buildKerbStep1Scene(
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
    signTitle: 'STEP 1 · GRAND HOTEL VIP BELLBOARD (SPN LOOKUP)',
    signSubtitle: 'CORP\\J.MILLER LDAP TCP/389 · SERVICEPRINCIPALNAME=* -> SVC_SQL_PROD',
    signBgHex: '#1C1917',
    signBorderHex: '#F59E0B',
    signTitleHex: '#FEF3C7',
    signSubHex: '#FCD34D',
    width: 14.8,
    depth: 10.2,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Standard Guest Room Badge Pedestal (Left x = -4.2) ---
  const badgeStand = new THREE.Group();
  badgeStand.position.set(-4.2, 0, 0.35);
  root.add(badgeStand);
  badgeStand.add(createContactDisc(materials, 1.15, 0.018));

  const standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.72, 1.25, 16),
    materials.createToonMaterial(0x44403c)
  );
  standBase.position.y = 0.625;
  addAnimeInkEdges(standBase, materials.inkLineMaterial, 24);
  badgeStand.add(standBase);

  const standTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.055, 8, 24),
    materials.createToonMaterial(0xd97706)
  );
  standTrim.rotation.x = Math.PI / 2;
  standTrim.position.y = 1.25;
  badgeStand.add(standTrim);

  const badgeTex = createPlaqueTexture(
    'STANDARD USER',
    'CORP\\j.miller',
    '#0F172A',
    '#38BDF8',
    '#E0F2FE'
  );
  textures.push(badgeTex);

  const guestBadge = new THREE.Group();
  guestBadge.position.set(0, 1.85, 0);
  badgeStand.add(guestBadge);

  const badgeCard = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.85, 0.08),
    [
      materials.createToonMaterial(0x38bdf8),
      materials.createToonMaterial(0x38bdf8),
      materials.createToonMaterial(0x38bdf8),
      materials.createToonMaterial(0x38bdf8),
      new THREE.MeshBasicMaterial({ map: badgeTex }),
      materials.createToonMaterial(0x0f172a),
    ]
  );
  addAnimeInkEdges(badgeCard, materials.inkLineMaterial, 24);
  guestBadge.add(badgeCard);

  const ldapRayMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
  });
  const ldapRay = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.22, 3.6, 12),
    ldapRayMat
  );
  ldapRay.rotation.z = -Math.PI / 2;
  ldapRay.position.set(-2.1, 1.95, 0.35);
  root.add(ldapRay);

  // --- PROP 2: Grand Mahogany VIP Suite Bellboard (Center x = 0, z = 0.2) ---
  const boardGroup = new THREE.Group();
  boardGroup.position.set(0, 0, 0.2);
  root.add(boardGroup);
  boardGroup.add(createContactDisc(materials, 2.3, 0.018));

  const mahoganyMat = materials.createToonMaterial(0x5c2b16);
  const brassMat = materials.createToonMaterial(0xd97706);

  const boardPedestal = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.65, 1.1),
    mahoganyMat
  );
  boardPedestal.position.y = 0.325;
  addAnimeInkEdges(boardPedestal, materials.inkLineMaterial, 24);
  boardGroup.add(boardPedestal);

  const boardFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.85, 3.15, 0.65),
    mahoganyMat
  );
  boardFrame.position.y = 2.22;
  addAnimeInkEdges(boardFrame, materials.inkLineMaterial, 24);
  boardGroup.add(boardFrame);

  const boardCrown = new THREE.Mesh(
    new THREE.BoxGeometry(4.15, 0.28, 0.85),
    brassMat
  );
  boardCrown.position.y = 3.88;
  addAnimeInkEdges(boardCrown, materials.inkLineMaterial, 24);
  boardGroup.add(boardCrown);

  // 6 Suite Plaques inside the mahogany bellboard (row 1 = privileged target MSSQLSvc)
  const spnEntries = [
    { hdr: 'SPN #01 · HIGH VALUE', body: 'MSSQLSvc/FIN-SQL01', target: true },
    { hdr: 'SPN #02 · SERVICE', body: 'HTTP/ERP-WEB02', target: false },
    { hdr: 'SPN #03 · ADMIN=1', body: 'svc_sql_prod', target: true },
    { hdr: 'SPN #04 · BACKUP', body: 'TERMSRV/BKP-04', target: false },
    { hdr: 'SPN #05 · CANARY', body: 'MSSQLSvc/HONEY-01', target: false },
    { hdr: 'SPN #06 · LEGACY', body: 'CIFSSvc/FILE-03', target: false },
  ];

  const plaqueMeshes: { mesh: THREE.Mesh; mat: THREE.MeshToonMaterial; isTarget: boolean }[] = [];
  spnEntries.forEach((entry, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const px = col === 0 ? -0.92 : 0.92;
    const py = 3.05 - row * 0.86;

    const tex = createPlaqueTexture(
      entry.hdr,
      entry.body,
      entry.target ? '#3B0A18' : '#1E1B18',
      entry.target ? '#F43F5E' : '#F59E0B',
      entry.target ? '#FFE4E6' : '#FEF3C7',
      512,
      210
    );
    textures.push(tex);

    const backingMat = materials.createToonMaterial(
      entry.target ? 0x9f1239 : 0x78350f,
      {
        emissive: entry.target ? 0xf43f5e : 0xf59e0b,
        emissiveIntensity: 0.15,
      }
    );
    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(1.62, 0.68, 0.12),
      backingMat
    );
    backing.position.set(px, py, 0.34);
    addAnimeInkEdges(backing, materials.inkLineMaterial, 24);
    boardGroup.add(backing);

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.52, 0.58),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(px, py, 0.41);
    boardGroup.add(face);

    plaqueMeshes.push({ mesh: backing, mat: backingMat, isTarget: entry.target });
  });

  // Cutaway Hinged Glass Vitrine Door over the bellboard
  const vitrinePivot = new THREE.Group();
  vitrinePivot.position.set(0, 3.74, 0.46);
  boardGroup.add(vitrinePivot);

  const vitrineGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 2.9, 0.06),
    new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  vitrineGlass.position.set(0, -1.45, 0.04);
  vitrinePivot.add(vitrineGlass);

  const vitrineBrassRim = new THREE.Mesh(
    new THREE.BoxGeometry(3.64, 0.12, 0.12),
    brassMat
  );
  vitrineBrassRim.position.set(0, -2.86, 0.05);
  addAnimeInkEdges(vitrineBrassRim, materials.inkLineMaterial, 24);
  vitrinePivot.add(vitrineBrassRim);

  // --- PROP 3: Articulated LDAP TCP/389 Sieve Scanner Carriage ---
  const scanBarGroup = new THREE.Group();
  scanBarGroup.position.set(0, 3.3, 0.62);
  boardGroup.add(scanBarGroup);

  const scanBeam = new THREE.Mesh(
    new THREE.BoxGeometry(3.75, 0.11, 0.16),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 1.1,
    })
  );
  scanBarGroup.add(scanBeam);

  // --- PROP 4: Right-Side Directory Audit Console (EID 1644 & Honey-SPN) ---
  const auditGroup = new THREE.Group();
  auditGroup.position.set(4.35, 0, 0.25);
  root.add(auditGroup);
  auditGroup.add(createContactDisc(materials, 1.3, 0.018));

  const auditDesk = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.45, 1.05),
    materials.createToonMaterial(0x1e293b)
  );
  auditDesk.position.y = 1.225;
  addAnimeInkEdges(auditDesk, materials.inkLineMaterial, 24);
  auditGroup.add(auditDesk);

  const auditScreenTex = createPlaqueTexture(
    'LDAP AUDIT · EID 1644',
    'HONEY-SPN WATCH',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(auditScreenTex);

  const auditScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.75, 0.95),
    new THREE.MeshBasicMaterial({ map: auditScreenTex })
  );
  auditScreen.position.set(0, 1.75, 0.54);
  auditGroup.add(auditScreen);

  const auditBeaconMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.35,
  });
  const auditBeacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.32, 0.42, 16),
    auditBeaconMat
  );
  auditBeacon.position.set(0, 2.66, 0);
  addAnimeInkEdges(auditBeacon, materials.inkLineMaterial, 24);
  auditGroup.add(auditBeacon);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 4.15, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.35, 3.1, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.3, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.45, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % KERB_STEP_DURATION_SEC) + KERB_STEP_DURATION_SEC) %
          KERB_STEP_DURATION_SEC) /
        KERB_STEP_DURATION_SEC;
      const frame = evaluateKerbStep1State(tNorm, cutawayMode);

      // Guest badge floats and advances slightly toward bellboard
      guestBadge.position.x = easeOutCubic(frame.badgeApproach) * 0.65;
      guestBadge.position.y = 1.85 + Math.sin(timeSec * 2.4) * 0.08;
      guestBadge.rotation.y = Math.sin(timeSec * 1.4) * 0.15;

      // LDAP query ray activates during scan
      ldapRayMat.opacity = 0.08 + frame.ldapScanSweep * 0.34;

      // Hinged vitrine cutaway opens upward
      vitrinePivot.rotation.x = -frame.cutawayOpen * 1.28;

      // Sieve scanner glides vertically across the 3 rows
      scanBarGroup.position.y = 3.35 - frame.ldapScanSweep * 2.15;

      // Highlight target SPN plaques (`MSSQLSvc/FIN-SQL01` & `svc_sql_prod`)
      plaqueMeshes.forEach((p, idx) => {
        if (p.isTarget) {
          p.mat.emissiveIntensity = 0.25 + frame.targetHighlight * 1.35;
          p.mesh.position.z = 0.34 + frame.targetHighlight * 0.12;
        } else {
          const wave = Math.max(0, 1 - Math.abs(frame.ldapScanSweep * 3 - Math.floor(idx / 2)));
          p.mat.emissiveIntensity = 0.12 + wave * 0.45;
          p.mesh.position.z = 0.34;
        }
      });

      // Right-side EID 1644 Honey-SPN audit beacon pulses in phase 3
      auditBeaconMat.emissiveIntensity =
        0.3 + frame.canaryAuditPulse * (0.9 + 0.35 * Math.sin(timeSec * 6));

      return {
        glitchIntensity: frame.targetHighlight * 0.35,
        magicDustIntensity: 0.25 + frame.ldapScanSweep * 0.45,
        stasisIntensity: frame.canaryAuditPulse * 0.3,
        brakeReleaseBoost: frame.targetHighlight * 0.25,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
