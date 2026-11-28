import * as THREE from 'three';
import { addAnimeInkEdges, type AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildStepRoomShell, createContactDisc, createPlaqueTexture, disposeStepScene } from '@/components/three/step-stage-primitives';
import { RAGMCP_STEP_DURATION_SEC, evaluateRagMcpStep3State } from '../choreography';

export function buildRagMcpStep3Scene(materials: AnimeMaterialLibrary): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x161024,
    floorTrimHex: 0xe11d48,
    wallColor: 0x221938,
    pillarColor: 0x332654,
    gridColor: 0x3b2c61,
    signTitle: 'STEP 3 · HIJACKED AGENT INVOKES PRIVILEGED MCP TOOLS TO EXFILTRATE DATA',
    signSubtitle: 'READ_INTERNAL_LEDGER() -> SEND_EXTERNAL_WEBHOOK() WITHOUT HUMAN APPROVAL',
    signBgHex: '#280A14',
    signBorderHex: '#E11D48',
    signTitleHex: '#FFE4E6',
    signSubHex: '#FDA4AF',
    width: 15.0,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const cabinet = new THREE.Group();
  cabinet.position.set(-2.6, 0, 0.25);
  root.add(cabinet);
  cabinet.add(createContactDisc(materials, 2.0, 0.018));
  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.6, 1.5), materials.createToonMaterial(0x1e293b));
  cabBody.position.y = 1.3;
  addAnimeInkEdges(cabBody, materials.inkLineMaterial, 24);
  cabinet.add(cabBody);
  const cTex = createPlaqueTexture('MCP FILE TOOL', 'read_internal_ledger() -> Secret Payroll', '#2B0812', '#E11D48', '#FECDD3');
  textures.push(cTex);
  const cFace = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.9), new THREE.MeshBasicMaterial({ map: cTex }));
  cFace.position.set(0, 1.4, 0.77);
  cabinet.add(cFace);

  const chute = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 3.0, 16),
    materials.createToonMaterial(0x334155)
  );
  chute.position.set(2.8, 1.5, 0.25);
  addAnimeInkEdges(chute, materials.inkLineMaterial, 24);
  root.add(chute);

  const canister = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.75, 14),
    materials.createToonMaterial(0xf43f5e, { emissive: 0xe11d48, emissiveIntensity: 0.95 })
  );
  canister.position.set(-2.2, 1.6, 0.75);
  addAnimeInkEdges(canister, materials.inkLineMaterial, 24);
  root.add(canister);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.6, 3.0, 0.4);
  root.add(primaryAnchor);
  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.8, 3.1, 0.4);
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
      const frame = evaluateRagMcpStep3State(tNorm, cutawayMode);
      cabBody.scale.z = 1.0 + frame.cabinetUnlockProgress * 0.08;
      canister.position.x = -2.2 + frame.canisterLoadProgress * 5.0;
      canister.position.y = 1.6 + frame.chuteLaunchProgress * 2.2;
      return {
        glitchIntensity: frame.chuteLaunchProgress * 0.5,
        magicDustIntensity: 0.28 + frame.chuteLaunchProgress * 0.42,
        stasisIntensity: frame.cutawayOpen * 0.18,
        brakeReleaseBoost: 0.2,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
