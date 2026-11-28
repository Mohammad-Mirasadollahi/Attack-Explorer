import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { RAGMCP_STEP_DURATION_SEC, evaluateRagMcpStep4State } from '../choreography';

export function buildRagMcpStep4Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0c1b18,
    floorTrimHex: 0x10b981,
    wallColor: 0x132b26,
    pillarColor: 0x1f4039,
    gridColor: 0x264c44,
    signTitle: 'STEP 4 · DATA-INSTRUCTION ISOLATION & HUMAN-IN-THE-LOOP MCP POLICY GATE',
    signSubtitle: 'STRUCTURED DELIMITERS + EGRESS ALLOWLIST + APPROVAL GATE BLOCK EXFILTRATION',
    signBgHex: '#062019',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const gate = new THREE.Group();
  gate.position.set(0, 0, 0.25);
  root.add(gate);
  gate.add(createContactDisc(materials, 2.4, 0.018));

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.5, 1.6), materials.createToonMaterial(0x164e3f));
  base.position.y = 1.25;
  addAnimeInkEdges(base, materials.inkLineMaterial, 24);
  gate.add(base);

  const gTex = createPlaqueTexture('MCP POLICY GATE', 'HitL Approval + Domain Allowlist -> 403 Deny', '#052E24', '#10B981', '#A7F3D0');
  textures.push(gTex);
  const gFace = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.92), new THREE.MeshBasicMaterial({ map: gTex }));
  gFace.position.set(0, 1.35, 0.82);
  gate.add(gFace);

  const glassWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 2.8, 2.0),
    materials.createToonMaterial(0x10b981, { emissive: 0x34d399, emissiveIntensity: 0.9 })
  );
  glassWall.position.set(-2.6, 4.3, 0.25);
  addAnimeInkEdges(glassWall, materials.inkLineMaterial, 24);
  root.add(glassWall);

  const valveClamp = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.14, 10, 24),
    materials.createToonMaterial(0x34d399, { emissive: 0x10b981, emissiveIntensity: 0.95 })
  );
  valveClamp.position.set(2.8, 2.2, 0.35);
  root.add(valveClamp);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.8, 2.9, 0.4);
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
        (((timeSec % RAGMCP_STEP_DURATION_SEC) + RAGMCP_STEP_DURATION_SEC) % RAGMCP_STEP_DURATION_SEC) /
        RAGMCP_STEP_DURATION_SEC;
      const frame = evaluateRagMcpStep4State(tNorm, cutawayMode);
      glassWall.position.y = 4.3 - frame.glassDropProgress * 2.5;
      valveClamp.scale.setScalar(0.85 + frame.valveClampProgress * 0.35);
      return {
        glitchIntensity: frame.auditBellGlow * 0.15,
        magicDustIntensity: 0.22 + frame.glassDropProgress * 0.35,
        stasisIntensity: frame.valveClampProgress * 0.55,
        brakeReleaseBoost: 0.12,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
