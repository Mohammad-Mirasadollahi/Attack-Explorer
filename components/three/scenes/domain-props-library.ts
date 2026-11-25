import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildContactShadow,
  buildFilingCabinet,
  buildKeyToken,
  buildPadlockProp,
  buildServerRackTower,
  clamp01,
} from './anime-world-primitives';

export type DomainPropKind =
  | 'hotel-desk'
  | 'railway-dispatch'
  | 'mail-chute'
  | 'fortress-gate'
  | 'library-toggle'
  | 'proxy-mirror'
  | 'concierge-press'
  | 'vault-safe'
  | 'pneumatic-tube'
  | 'print-spooler'
  | 'notary-press'
  | 'robot-worker-bay'
  | 'cloud-silo'
  | 'oauth-kiosk'
  | 'mailroom-chute'
  | 'satellite-dish'
  | 'hypervisor-vault'
  | 'broadcast-tower'
  | 'gpu-cluster'
  | 'model-crate'
  | 'swarm-arena'
  | 'motherboard-spi'
  | 'kernel-courthouse'
  | 'factory-conveyor'
  | 'shipping-container'
  | 'k8s-tower'
  | 'database-vault'
  | 'heating-boiler'
  | 'substation-breakers'
  | 'centrifuge-hall'
  | 'safety-judges'
  | 'plc-toolbox'
  | 'smartphone-chassis'
  | 'telecom-bridge'
  | 'memory-xray-chamber';

export interface BuiltDomainProp {
  group: THREE.Group;
  anchorHeight: number;
  animate: (
    timeSec: number,
    phaseProgress: number,
    cutawayFactor: number,
    alertActive: boolean
  ) => void;
}

function addInkBox(
  parent: THREE.Object3D,
  materials: AnimeMaterialLibrary,
  w: number,
  h: number,
  d: number,
  hex: number,
  pos: [number, number, number],
  opts?: {
    emissive?: number;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    castShadow?: boolean;
  }
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    materials.createToonMaterial(hex, opts)
  );
  mesh.position.set(...pos);
  if (opts?.castShadow) mesh.castShadow = true;
  addAnimeInkEdges(mesh, materials.inkLineMaterial, 22);
  parent.add(mesh);
  return mesh;
}

function addInkCylinder(
  parent: THREE.Object3D,
  materials: AnimeMaterialLibrary,
  rt: number,
  rb: number,
  h: number,
  seg: number,
  hex: number,
  pos: [number, number, number],
  opts?: {
    emissive?: number;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    outline?: boolean;
  }
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, seg),
    materials.createToonMaterial(hex, opts)
  );
  mesh.position.set(...pos);
  if (opts?.outline) {
    addInvertedHullOutline(mesh, materials.inkOutlineMaterial, 1.06);
  } else {
    addAnimeInkEdges(mesh, materials.inkLineMaterial, 24);
  }
  parent.add(mesh);
  return mesh;
}

/**
 * Builds one of 35 distinct, multi-part cel-shaded anime 3D hero props so each
 * scenario depicts its literal physical story world (zero generic boxes).
 */
export function buildDomainProp(
  kind: DomainPropKind,
  materials: AnimeMaterialLibrary,
  primaryHex: number,
  accentHex: number
): BuiltDomainProp {
  const group = new THREE.Group();
  group.add(buildContactShadow(materials, 2.2, 1.6));

  switch (kind) {
    case 'hotel-desk': {
      // Marble reception counter + brass bell + open ledger + animated rotary phone handset
      addInkBox(group, materials, 3.2, 1.35, 1.45, 0x334155, [0, 0.68, 0], { castShadow: true });
      addInkBox(group, materials, 3.45, 0.16, 1.65, 0xe2e8f0, [0, 1.42, 0]);
      addInkBox(group, materials, 2.8, 0.14, 0.08, primaryHex, [0, 0.95, 0.74], {
        emissive: primaryHex,
        emissiveIntensity: 0.9,
      });
      // Open guest ledger book
      const ledgerL = addInkBox(group, materials, 0.65, 0.08, 0.82, 0xfef3c7, [-0.62, 1.56, 0.12]);
      ledgerL.rotation.z = 0.08;
      const ledgerR = addInkBox(group, materials, 0.65, 0.08, 0.82, 0xfef3c7, [0.02, 1.56, 0.12]);
      ledgerR.rotation.z = -0.08;
      // Brass call bell
      const bell = addInkCylinder(group, materials, 0.14, 0.24, 0.18, 12, 0xfacc15, [-1.2, 1.58, 0.3], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.4,
      });
      // Rotary phone base + animated ringing handset
      addInkBox(group, materials, 0.54, 0.26, 0.48, 0x0f172a, [1.0, 1.62, 0.05]);
      const handset = new THREE.Group();
      handset.position.set(1.0, 1.88, 0.05);
      addInkBox(handset, materials, 0.68, 0.12, 0.14, accentHex, [0, 0, 0], {
        emissive: accentHex,
        emissiveIntensity: 0.8,
      });
      addInkCylinder(handset, materials, 0.11, 0.11, 0.14, 10, accentHex, [-0.32, -0.05, 0]);
      addInkCylinder(handset, materials, 0.11, 0.11, 0.14, 10, accentHex, [0.32, -0.05, 0]);
      group.add(handset);
      // Key pigeonhole rack behind desk
      addInkBox(group, materials, 2.7, 1.45, 0.22, 0x1e293b, [0, 2.25, -0.68]);
      const keyOrb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28, 0),
        materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 1.1 })
      );
      keyOrb.position.set(0, 2.4, -0.3);
      addInvertedHullOutline(keyOrb, materials.inkOutlineMaterial, 1.08);
      group.add(keyOrb);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, prog, _cut, alert) => {
          handset.position.y = 1.88 + (alert ? Math.abs(Math.sin(t * 14)) * 0.18 : Math.sin(t * 3) * 0.05);
          handset.rotation.z = alert ? Math.sin(t * 22) * 0.22 : Math.sin(t * 2) * 0.06;
          bell.scale.y = 1 + (alert ? Math.sin(t * 12) * 0.12 : 0);
          keyOrb.rotation.y = t * 2.2;
          keyOrb.position.y = 2.35 + Math.sin(t * 3 + prog * 3) * 0.14;
        },
      };
    }

    case 'railway-dispatch': {
      // Steel rail sleepers + semaphore signal gantry + rolling freight car
      addInkBox(group, materials, 3.8, 0.14, 1.5, 0x1e293b, [0, 0.08, 0]);
      for (const rz of [-0.46, 0.46]) {
        addInkBox(group, materials, 3.8, 0.1, 0.1, 0x94a3b8, [0, 0.2, rz]);
      }
      // Semaphore tower on back edge
      addInkBox(group, materials, 0.26, 3.2, 0.26, 0x334155, [-1.35, 1.65, -0.58]);
      const armPivot = new THREE.Group();
      armPivot.position.set(-1.22, 2.85, -0.45);
      addInkBox(armPivot, materials, 1.25, 0.22, 0.08, accentHex, [0.58, 0, 0], {
        emissive: accentHex,
        emissiveIntensity: 0.9,
      });
      group.add(armPivot);
      // Dispatch railcar with glowing cargo core
      const railcar = new THREE.Group();
      railcar.position.set(0.2, 0.28, 0);
      addInkBox(railcar, materials, 2.2, 1.25, 1.1, primaryHex, [0, 0.82, 0], { castShadow: true });
      const hatch = addInkBox(railcar, materials, 1.8, 0.14, 1.0, 0x0f172a, [0, 1.5, 0]);
      const payload = addInkBox(railcar, materials, 1.0, 0.72, 0.65, accentHex, [0, 0.9, 0], {
        emissive: accentHex,
        emissiveIntensity: 1.0,
      });
      for (const wx of [-0.72, 0.72]) {
        for (const wz of [-0.55, 0.55]) {
          const wheel = addInkCylinder(railcar, materials, 0.22, 0.22, 0.12, 12, 0x0f172a, [wx, 0.22, wz]);
          wheel.rotation.x = Math.PI / 2;
        }
      }
      group.add(railcar);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, prog, cut, alert) => {
          armPivot.rotation.z = -0.55 + Math.sin(t * 2.4) * 0.25 + (alert ? 0.45 : 0);
          railcar.position.x = Math.sin(t * 1.3 + prog * 2) * 0.55;
          hatch.position.y = 1.5 + cut * 0.65;
          payload.position.y = 0.9 + cut * 0.55;
          payload.rotation.y = t * 1.6;
        },
      };
    }

    case 'mail-chute': {
      // Warehouse shutter bay + slanted brass mail chute + popping coded postcards
      addInkBox(group, materials, 2.8, 2.75, 1.5, 0x1e293b, [0, 1.38, -0.2], { castShadow: true });
      const shutter = addInkBox(group, materials, 2.1, 1.8, 0.14, 0x475569, [0, 1.1, 0.58]);
      const chute = addInkBox(group, materials, 1.2, 0.22, 1.85, primaryHex, [0, 1.35, 0.95], {
        emissive: primaryHex,
        emissiveIntensity: 0.45,
      });
      chute.rotation.x = 0.34;
      const cards: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i += 1) {
        const card = addInkBox(group, materials, 0.64, 0.08, 0.44, i === 1 ? accentHex : 0xfef08a, [
          (i - 1) * 0.35,
          1.7 + i * 0.25,
          0.95,
        ], { emissive: i === 1 ? accentHex : 0xfacc15, emissiveIntensity: 0.7 });
        cards.push(card);
      }
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, cut, alert) => {
          shutter.position.y = 1.1 + (0.4 + cut * 0.75);
          cards.forEach((c, idx) => {
            const cycle = (t * (alert ? 1.4 : 0.7) + idx * 0.33) % 1;
            c.position.z = 0.4 + cycle * 1.4;
            c.position.y = 1.85 - cycle * 0.55 + Math.sin(cycle * Math.PI) * 0.35;
            c.rotation.y = Math.sin(t * 2 + idx) * 0.35;
          });
        },
      };
    }

    case 'fortress-gate': {
      // Perimeter security arch + guard booth + animated striped boom barrier
      addInkBox(group, materials, 0.75, 3.1, 1.1, 0x334155, [-1.35, 1.55, 0], { castShadow: true });
      addInkBox(group, materials, 0.75, 3.1, 1.1, 0x334155, [1.35, 1.55, 0], { castShadow: true });
      addInkBox(group, materials, 3.6, 0.68, 1.25, 0x1e293b, [0, 3.15, 0], { castShadow: true });
      const scannerLight = addInkBox(group, materials, 2.4, 0.2, 0.16, primaryHex, [0, 2.95, 0.66], {
        emissive: primaryHex,
        emissiveIntensity: 1.1,
      });
      const barrierPivot = new THREE.Group();
      barrierPivot.position.set(-0.98, 1.15, 0.45);
      addInkBox(barrierPivot, materials, 2.15, 0.16, 0.14, accentHex, [1.05, 0, 0], {
        emissive: accentHex,
        emissiveIntensity: 0.65,
      });
      group.add(barrierPivot);
      // Glowing shield emblem in archway
      const shield = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        materials.createToonMaterial(primaryHex, { emissive: primaryHex, emissiveIntensity: 0.9 })
      );
      shield.position.set(0, 1.95, 0);
      addInvertedHullOutline(shield, materials.inkOutlineMaterial, 1.07);
      group.add(shield);
      return {
        group,
        anchorHeight: 3.6,
        animate: (t, prog, cut, alert) => {
          const openAngle = alert ? 1.15 : 0.25 + clamp01(prog) * 0.75 + cut * 0.25;
          barrierPivot.rotation.z = openAngle;
          shield.rotation.y = t * 1.8;
          shield.position.y = 1.95 + Math.sin(t * 3) * 0.12;
          (scannerLight.material as THREE.MeshToonMaterial).emissive.setHex(alert ? accentHex : primaryHex);
        },
      };
    }

    case 'library-toggle': {
      // Wooden bookcase + glass-walled setup toggle switch lever
      addInkBox(group, materials, 2.8, 3.0, 0.9, 0x451a03, [0, 1.5, -0.35], { castShadow: true });
      for (const sy of [0.8, 1.55, 2.3]) {
        addInkBox(group, materials, 2.45, 0.1, 0.75, 0x78350f, [0, sy, -0.22]);
        for (let b = 0; b < 5; b += 1) {
          addInkBox(
            group,
            materials,
            0.22,
            0.52,
            0.48,
            b % 2 === 0 ? primaryHex : 0x64748b,
            [-0.95 + b * 0.46, sy + 0.31, -0.18]
          );
        }
      }
      // Front glass toggle pedestal
      addInkBox(group, materials, 1.4, 1.25, 0.9, 0x1e293b, [0, 0.62, 0.7]);
      const glassCover = addInkBox(group, materials, 1.25, 0.85, 0.75, 0x38bdf8, [0, 1.65, 0.7], {
        transparent: true,
        opacity: 0.34,
      });
      const leverPivot = new THREE.Group();
      leverPivot.position.set(0, 1.35, 0.7);
      addInkCylinder(leverPivot, materials, 0.06, 0.06, 0.65, 8, 0xe2e8f0, [0, 0.32, 0]);
      addInkCylinder(leverPivot, materials, 0.16, 0.16, 0.16, 12, accentHex, [0, 0.68, 0], {
        emissive: accentHex,
        emissiveIntensity: 1.1,
      });
      group.add(leverPivot);
      return {
        group,
        anchorHeight: 3.3,
        animate: (t, _prog, cut, alert) => {
          glassCover.position.y = 1.65 + (alert ? 0.55 : cut * 0.65);
          leverPivot.rotation.z = alert ? -0.68 : 0.48 * Math.cos(t * 1.5);
        },
      };
    }

    case 'proxy-mirror': {
      // Twin angled reverse-proxy mirror panes + cache memory shelf
      addInkBox(group, materials, 3.1, 0.24, 1.9, 0x1e293b, [0, 0.12, 0]);
      const leftMirror = addInkBox(group, materials, 0.16, 2.55, 1.45, primaryHex, [-0.95, 1.5, 0], {
        transparent: true,
        opacity: 0.58,
        emissive: primaryHex,
        emissiveIntensity: 0.45,
      });
      leftMirror.rotation.y = 0.28;
      const rightMirror = addInkBox(group, materials, 0.16, 2.55, 1.45, accentHex, [0.95, 1.5, 0], {
        transparent: true,
        opacity: 0.58,
        emissive: accentHex,
        emissiveIntensity: 0.5,
      });
      rightMirror.rotation.y = -0.28;
      const prism = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        materials.createToonMaterial(0xfacc15, { emissive: 0xfacc15, emissiveIntensity: 1.0 })
      );
      prism.position.set(0, 1.65, 0);
      addInvertedHullOutline(prism, materials.inkOutlineMaterial, 1.07);
      group.add(prism);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, cut, alert) => {
          leftMirror.rotation.y = 0.28 + cut * 0.22;
          rightMirror.rotation.y = -0.28 - cut * 0.22;
          prism.rotation.y = t * (alert ? 3.5 : 1.6);
          prism.position.y = 1.65 + Math.sin(t * 3.2) * 0.22;
        },
      };
    }

    case 'concierge-press': {
      // Grand hotel mahogany concierge booth + golden wax-seal voucher press
      addInkBox(group, materials, 2.8, 1.4, 1.4, 0x451a03, [0, 0.7, 0], { castShadow: true });
      addInkBox(group, materials, 3.0, 0.18, 1.55, 0xfacc15, [0, 1.46, 0]);
      addInkBox(group, materials, 0.35, 1.5, 0.35, 0x78350f, [-0.85, 2.25, -0.3]);
      addInkBox(group, materials, 1.5, 0.28, 0.45, 0x78350f, [-0.15, 2.95, -0.3]);
      const stamper = new THREE.Group();
      stamper.position.set(0.35, 2.5, -0.1);
      addInkCylinder(stamper, materials, 0.12, 0.12, 0.75, 10, 0xfacc15, [0, 0, 0]);
      addInkCylinder(stamper, materials, 0.34, 0.38, 0.22, 16, accentHex, [0, -0.42, 0], {
        emissive: accentHex,
        emissiveIntensity: 0.95,
      });
      group.add(stamper);
      // Glowing wax-sealed voucher ticket on counter
      const ticket = addInkBox(group, materials, 0.95, 0.08, 0.56, 0xfef3c7, [0.35, 1.62, 0.1], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.45,
      });
      return {
        group,
        anchorHeight: 3.3,
        animate: (t, _prog, _cut, alert) => {
          const pressWave = Math.max(0, Math.sin(t * (alert ? 4.2 : 2.1)));
          stamper.position.y = 2.48 - pressWave * 0.44;
          ticket.position.x = 0.35 + (alert ? Math.sin(t * 2.5) * 0.25 : 0);
        },
      };
    }

    case 'vault-safe': {
      // Heavy circular armored safe with spinning spoke wheel + glowing interior secret
      addInkBox(group, materials, 2.6, 2.75, 1.9, 0x1e293b, [0, 1.38, -0.1], { castShadow: true });
      const doorPivot = new THREE.Group();
      doorPivot.position.set(-1.15, 1.38, 0.88);
      addInkBox(doorPivot, materials, 2.3, 2.35, 0.22, 0x334155, [1.15, 0, 0]);
      const wheel = new THREE.Group();
      wheel.position.set(1.35, 0, 0.18);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.46, 0.07, 8, 20),
        materials.createToonMaterial(0xfacc15, { emissive: 0xfacc15, emissiveIntensity: 0.5 })
      );
      addInvertedHullOutline(ring, materials.inkOutlineMaterial, 1.07);
      wheel.add(ring);
      for (let i = 0; i < 3; i += 1) {
        const spoke = addInkBox(wheel, materials, 0.92, 0.08, 0.08, 0xfacc15, [0, 0, 0]);
        spoke.rotation.z = (i * Math.PI) / 3;
      }
      doorPivot.add(wheel);
      group.add(doorPivot);
      const masterKey = buildKeyToken(materials, accentHex);
      masterKey.position.set(-0.25, 1.45, 0.15);
      masterKey.scale.setScalar(0.85);
      group.add(masterKey);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, prog, cut, alert) => {
          wheel.rotation.z = t * (alert ? 5.2 : 1.8);
          doorPivot.rotation.y = -(cut * 1.15 + (alert ? 0.55 : prog * 0.35));
          masterKey.rotation.y = t * 1.8;
          masterKey.position.z = 0.15 + (alert ? 0.85 : cut * 0.6);
        },
      };
    }

    case 'pneumatic-tube': {
      // Transparent brass pneumatic tube archway with zipping message capsule
      addInkCylinder(group, materials, 0.42, 0.52, 2.2, 16, 0x475569, [-1.1, 1.1, 0]);
      addInkCylinder(group, materials, 0.42, 0.52, 2.2, 16, 0x475569, [1.1, 1.1, 0]);
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(1.1, 0.24, 10, 24, Math.PI),
        materials.createToonMaterial(primaryHex, { transparent: true, opacity: 0.42 })
      );
      arch.position.set(0, 2.2, 0);
      addInvertedHullOutline(arch, materials.inkOutlineMaterial, 1.05);
      group.add(arch);
      const capsule = addInkCylinder(group, materials, 0.18, 0.18, 0.52, 12, accentHex, [0, 3.2, 0], {
        emissive: accentHex,
        emissiveIntensity: 1.1,
        outline: true,
      });
      return {
        group,
        anchorHeight: 3.6,
        animate: (t, _prog, _cut, alert) => {
          const angle = Math.PI - ((t * (alert ? 1.8 : 0.9)) % 1) * Math.PI;
          capsule.position.set(Math.cos(angle) * 1.1, 2.2 + Math.sin(angle) * 1.1, 0);
          capsule.rotation.z = angle;
        },
      };
    }

    case 'print-spooler': {
      // Industrial print roller press + driver cartridge tray + emerging sheets
      addInkBox(group, materials, 2.6, 1.7, 1.6, 0x334155, [0, 0.85, 0], { castShadow: true });
      const roller = addInkCylinder(group, materials, 0.34, 0.34, 2.1, 16, primaryHex, [0, 1.9, -0.15]);
      roller.rotation.z = Math.PI / 2;
      const driverDrawer = addInkBox(group, materials, 1.4, 0.38, 0.9, accentHex, [0, 0.85, 0.72], {
        emissive: accentHex,
        emissiveIntensity: 0.75,
      });
      const sheet = addInkBox(group, materials, 1.35, 0.06, 0.9, 0xf8fafc, [0, 2.05, 0.55]);
      return {
        group,
        anchorHeight: 2.9,
        animate: (t, _prog, cut, alert) => {
          roller.rotation.x = t * (alert ? 6 : 2.5);
          driverDrawer.position.z = 0.65 + (alert ? 0.5 : cut * 0.45);
          sheet.position.z = 0.3 + ((t * 0.8) % 1) * 0.95;
        },
      };
    }

    case 'notary-press': {
      // Certificate embossing press + glowing seal ribbon
      addInkBox(group, materials, 2.3, 1.25, 1.5, 0x1e293b, [0, 0.62, 0], { castShadow: true });
      addInkBox(group, materials, 1.8, 0.14, 1.2, 0xf8fafc, [0, 1.32, 0]);
      const arm = new THREE.Group();
      arm.position.set(0, 2.35, -0.45);
      addInkBox(arm, materials, 0.36, 0.32, 1.25, 0x475569, [0, 0, 0.45]);
      addInkCylinder(arm, materials, 0.36, 0.36, 0.22, 16, 0xfacc15, [0, -0.25, 0.88], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.9,
      });
      group.add(arm);
      const badgeSeal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16),
        materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 1.0 })
      );
      badgeSeal.position.set(0, 1.44, 0.35);
      group.add(badgeSeal);
      return {
        group,
        anchorHeight: 3.0,
        animate: (t, _prog, _cut, alert) => {
          arm.rotation.x = 0.35 * Math.sin(t * (alert ? 3.5 : 1.8));
          badgeSeal.rotation.y = t * 2;
        },
      };
    }

    case 'robot-worker-bay': {
      // Cloud glass airlock + articulated cel-shaded robot worker + floating manager badge
      addInkCylinder(group, materials, 1.6, 1.8, 0.28, 24, 0x0f172a, [0, 0.14, 0]);
      const glassWall = addInkCylinder(group, materials, 1.48, 1.48, 2.75, 20, primaryHex, [0, 1.65, 0], {
        transparent: true,
        opacity: 0.22,
      });
      // Robot worker inside bay
      const robot = new THREE.Group();
      addInkBox(robot, materials, 0.88, 1.05, 0.62, 0xe2e8f0, [0, 1.2, 0], { castShadow: true });
      addInkBox(robot, materials, 0.64, 0.52, 0.54, 0x334155, [0, 2.08, 0]);
      addInkBox(robot, materials, 0.48, 0.16, 0.08, primaryHex, [0, 2.12, 0.29], {
        emissive: primaryHex,
        emissiveIntensity: 1.2,
      });
      const robotBadge = addInkBox(robot, materials, 0.44, 0.3, 0.1, accentHex, [0, 1.28, 0.38], {
        emissive: accentHex,
        emissiveIntensity: 1.1,
      });
      group.add(robot);
      return {
        group,
        anchorHeight: 3.3,
        animate: (t, _prog, cut, alert) => {
          glassWall.visible = cut < 0.75;
          robot.position.y = Math.sin(t * 2.6) * 0.14;
          robot.rotation.y = Math.sin(t * 1.4) * 0.3;
          robotBadge.scale.setScalar(alert ? 1.25 + Math.sin(t * 8) * 0.12 : 1);
        },
      };
    }

    case 'cloud-silo': {
      // Twin cloud storage silos with glowing fill rings + key kiln
      addInkCylinder(group, materials, 0.78, 0.82, 2.65, 18, 0x334155, [-0.88, 1.35, -0.1]);
      addInkCylinder(group, materials, 0.78, 0.82, 2.65, 18, 0x334155, [0.88, 1.35, -0.1]);
      const ringL = new THREE.Mesh(
        new THREE.TorusGeometry(0.84, 0.07, 8, 24),
        new THREE.MeshBasicMaterial({ color: primaryHex, toneMapped: false })
      );
      ringL.rotation.x = Math.PI / 2;
      ringL.position.set(-0.88, 1.5, -0.1);
      group.add(ringL);
      const ringR = new THREE.Mesh(
        new THREE.TorusGeometry(0.84, 0.07, 8, 24),
        new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
      );
      ringR.rotation.x = Math.PI / 2;
      ringR.position.set(0.88, 1.5, -0.1);
      group.add(ringR);
      const padlock = buildPadlockProp(materials, accentHex);
      padlock.position.set(0, 1.2, 0.88);
      padlock.scale.setScalar(0.85);
      group.add(padlock);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, _cut, alert) => {
          ringL.position.y = 0.65 + ((Math.sin(t * 2) + 1) * 0.5) * 1.65;
          ringR.position.y = 0.65 + ((Math.cos(t * 2.4) + 1) * 0.5) * 1.65;
          padlock.scale.setScalar(alert ? 1.0 : 0.72);
          padlock.rotation.y = Math.sin(t * 2) * 0.3;
        },
      };
    }

    case 'oauth-kiosk': {
      // Holographic OAuth identity kiosk + consent badge scanner
      addInkBox(group, materials, 1.85, 2.85, 0.95, 0x1e293b, [0, 1.42, 0], { castShadow: true });
      addInkBox(group, materials, 1.45, 1.2, 0.1, primaryHex, [0, 2.02, 0.5], {
        emissive: primaryHex,
        emissiveIntensity: 0.95,
      });
      const consentBtn = addInkBox(group, materials, 0.88, 0.34, 0.18, accentHex, [0, 1.05, 0.54], {
        emissive: accentHex,
        emissiveIntensity: 1.0,
      });
      const tokenCard = addInkBox(group, materials, 0.76, 0.48, 0.08, 0xfacc15, [0, 1.9, 1.05], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.9,
      });
      return {
        group,
        anchorHeight: 3.2,
        animate: (t, _prog, _cut, alert) => {
          tokenCard.position.z = 0.95 + Math.sin(t * 2.4) * 0.32;
          tokenCard.rotation.y = Math.sin(t * 2) * 0.45;
          consentBtn.scale.setScalar(alert ? 1.12 + Math.sin(t * 10) * 0.08 : 1);
        },
      };
    }

    case 'mailroom-chute': {
      // Corporate eDiscovery sorting desk + stacked sealed folders
      addInkBox(group, materials, 3.0, 1.1, 1.45, 0x334155, [0, 0.55, 0], { castShadow: true });
      const scannerArch = addInkBox(group, materials, 0.4, 1.65, 1.55, 0x0f172a, [0, 1.9, 0]);
      addInkBox(scannerArch, materials, 0.46, 0.14, 1.4, primaryHex, [0, 0.78, 0], {
        emissive: primaryHex,
        emissiveIntensity: 1.1,
      });
      const folder = addInkBox(group, materials, 0.72, 0.24, 0.92, accentHex, [-0.9, 1.26, 0], {
        emissive: accentHex,
        emissiveIntensity: 0.75,
      });
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, _cut, alert) => {
          folder.position.x = -1.1 + ((t * (alert ? 1.1 : 0.55)) % 1) * 2.2;
        },
      };
    }

    case 'satellite-dish': {
      // Parabolic cel-shaded satellite dish + modem rack
      addInkBox(group, materials, 1.6, 1.2, 1.2, 0x334155, [-0.6, 0.6, 0], { castShadow: true });
      const dishPivot = new THREE.Group();
      dishPivot.position.set(-0.6, 1.55, 0);
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.42),
        materials.createToonMaterial(0xe2e8f0, { side: THREE.DoubleSide })
      );
      dish.rotation.x = Math.PI * 0.75;
      addInvertedHullOutline(dish, materials.inkOutlineMaterial, 1.04);
      dishPivot.add(dish);
      const feed = addInkCylinder(dishPivot, materials, 0.12, 0.12, 0.85, 8, accentHex, [0, 0.55, 0.55], {
        emissive: accentHex,
        emissiveIntensity: 1.1,
      });
      feed.rotation.x = Math.PI * 0.25;
      group.add(dishPivot);
      // Flashing modem tower beside dish
      const rack = buildServerRackTower(materials, { height: 2.2, width: 1.15, ledHex: primaryHex });
      rack.group.position.set(1.25, 0, 0.2);
      group.add(rack.group);
      return {
        group,
        anchorHeight: 3.4,
        animate: (t, _prog, cut, alert) => {
          dishPivot.rotation.y = Math.sin(t * 1.4) * 0.45;
          rack.frontDoor.visible = cut < 0.7;
          rack.ledMat.emissive.setHex(alert ? accentHex : primaryHex);
        },
      };
    }

    case 'hypervisor-vault': {
      // Multi-blade ESXi hypervisor chassis + articulated padlocking arm + backup reel
      const rack = buildServerRackTower(materials, { height: 3.1, width: 2.1, ledHex: primaryHex });
      group.add(rack.group);
      const lock = buildPadlockProp(materials, accentHex);
      lock.position.set(0, 1.65, 1.05);
      group.add(lock);
      const tapeReel = addInkCylinder(group, materials, 0.52, 0.52, 0.24, 18, 0xfacc15, [1.55, 0.9, 0.3]);
      tapeReel.rotation.x = Math.PI / 2;
      return {
        group,
        anchorHeight: 3.4,
        animate: (t, _prog, cut, alert) => {
          rack.frontDoor.visible = cut < 0.65;
          rack.coreMesh.rotation.y = t * 2.2;
          lock.position.z = alert ? 0.92 : 1.35;
          lock.scale.setScalar(alert ? 1.12 : 0.72);
          tapeReel.rotation.z = t * (alert ? 6 : 2);
          tapeReel.scale.setScalar(alert ? 0.65 : 1);
        },
      };
    }

    case 'broadcast-tower': {
      // GPO megaphone broadcast mast + glowing logbook furnace
      addInkCylinder(group, materials, 0.16, 0.55, 3.25, 8, 0x475569, [-0.7, 1.62, 0]);
      const waveRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.75, 0.06, 8, 24),
        new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
      );
      waveRing.position.set(-0.7, 3.05, 0);
      group.add(waveRing);
      // Furnace box on right
      addInkBox(group, materials, 1.45, 1.55, 1.25, 0x1e293b, [1.05, 0.78, 0.15], { castShadow: true });
      const glow = addInkBox(group, materials, 0.95, 0.68, 0.14, 0xf97316, [1.05, 0.75, 0.8], {
        emissive: 0xf97316,
        emissiveIntensity: 1.2,
      });
      return {
        group,
        anchorHeight: 3.5,
        animate: (t, _prog, _cut, alert) => {
          const pulse = 0.65 + ((t * (alert ? 1.6 : 0.8)) % 1) * 1.1;
          waveRing.scale.setScalar(pulse);
          glow.scale.y = 0.85 + Math.sin(t * 10) * 0.18;
        },
      };
    }

    case 'gpu-cluster': {
      // Liquid-cooled AI GPU blade tower with glowing cyan/violet coolant manifold
      addInkBox(group, materials, 2.35, 3.05, 1.45, 0x0f172a, [0, 1.52, 0], { castShadow: true });
      const pipes: THREE.Mesh[] = [];
      for (const px of [-0.72, 0, 0.72]) {
        const pipe = addInkCylinder(group, materials, 0.14, 0.14, 2.55, 12, primaryHex, [px, 1.55, 0.74], {
          emissive: primaryHex,
          emissiveIntensity: 1.0,
        });
        pipes.push(pipe);
      }
      const tensorCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.46, 0),
        materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 1.2 })
      );
      tensorCore.position.set(0, 3.45, 0);
      addInvertedHullOutline(tensorCore, materials.inkOutlineMaterial, 1.08);
      group.add(tensorCore);
      return {
        group,
        anchorHeight: 3.8,
        animate: (t, _prog, _cut, alert) => {
          tensorCore.rotation.y = t * (alert ? 3.5 : 1.5);
          tensorCore.rotation.x = t * 1.1;
          pipes.forEach((p, idx) => {
            (p.material as THREE.MeshToonMaterial).emissive.setHex(
              alert && idx === 1 ? accentHex : primaryHex
            );
          });
        },
      };
    }

    case 'model-crate': {
      // Glass-walled AI model shipping crate / pickle jar with coiled crimson spring trap
      addInkBox(group, materials, 2.2, 0.34, 2.2, 0x334155, [0, 0.17, 0]);
      const glassWall = addInkBox(group, materials, 1.95, 2.05, 1.95, primaryHex, [0, 1.38, 0], {
        transparent: true,
        opacity: 0.3,
      });
      const lid = addInkBox(group, materials, 2.2, 0.24, 2.2, 0x1e293b, [0, 2.52, 0]);
      const springTrap = new THREE.Group();
      springTrap.position.set(0, 0.55, 0);
      for (let i = 0; i < 4; i += 1) {
        const coil = new THREE.Mesh(
          new THREE.TorusGeometry(0.48, 0.07, 8, 20),
          materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 0.9 })
        );
        coil.rotation.x = Math.PI / 2;
        coil.position.y = i * 0.34;
        springTrap.add(coil);
      }
      const jackHead = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 1.25 })
      );
      jackHead.position.y = 1.5;
      addInvertedHullOutline(jackHead, materials.inkOutlineMaterial, 1.09);
      springTrap.add(jackHead);
      group.add(springTrap);
      return {
        group,
        anchorHeight: 3.2,
        animate: (t, _prog, cut, alert) => {
          glassWall.visible = cut < 0.8;
          const pop = alert ? 0.75 + Math.abs(Math.sin(t * 4)) * 0.5 : cut * 0.45;
          lid.position.y = 2.52 + pop * 0.95;
          lid.rotation.z = pop * 0.32;
          springTrap.scale.y = 0.7 + pop * 0.55;
        },
      };
    }

    case 'swarm-arena': {
      // Radial multi-agent AI hub + 4 orbiting drones + slamming Defender blast doors
      addInkCylinder(group, materials, 1.65, 1.85, 0.45, 24, 0x1e293b, [0, 0.22, 0]);
      addInkCylinder(group, materials, 0.55, 0.65, 1.8, 12, primaryHex, [0, 1.32, 0], {
        emissive: primaryHex,
        emissiveIntensity: 0.8,
      });
      const drones: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i += 1) {
        const d = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.28, 0),
          materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 1.15 })
        );
        addInvertedHullOutline(d, materials.inkOutlineMaterial, 1.08);
        group.add(d);
        drones.push(d);
      }
      const blastDoorL = addInkBox(group, materials, 0.9, 2.2, 0.22, 0x10b981, [-1.45, 1.35, 1.1], {
        emissive: 0x10b981,
        emissiveIntensity: 0.6,
      });
      const blastDoorR = addInkBox(group, materials, 0.9, 2.2, 0.22, 0x10b981, [1.45, 1.35, 1.1], {
        emissive: 0x10b981,
        emissiveIntensity: 0.6,
      });
      return {
        group,
        anchorHeight: 3.3,
        animate: (t, _prog, cut, alert) => {
          drones.forEach((d, i) => {
            const ang = t * (alert ? 3.2 : 1.6) + (i * Math.PI) / 2;
            d.position.set(Math.cos(ang) * 1.45, 2.15 + Math.sin(t * 4 + i) * 0.25, Math.sin(ang) * 1.2);
          });
          const slam = alert && cut < 0.6 ? 0.85 : 0;
          blastDoorL.position.x = -1.45 + slam * 0.96;
          blastDoorR.position.x = 1.45 - slam * 0.96;
        },
      };
    }

    case 'motherboard-spi': {
      // Gold-traced PCB pedestal + oversized SPI flash chip with copper pins + boot rail
      addInkBox(group, materials, 3.3, 0.24, 2.4, 0x064e3b, [0, 0.14, 0], { castShadow: true });
      addInkBox(group, materials, 1.55, 0.62, 1.35, 0x0f172a, [0, 0.58, 0]);
      for (let i = 0; i < 4; i += 1) {
        addInkBox(group, materials, 0.12, 0.22, 0.28, 0xfacc15, [-0.55 + i * 0.36, 0.34, 0.78]);
        addInkBox(group, materials, 0.12, 0.22, 0.28, 0xfacc15, [-0.55 + i * 0.36, 0.34, -0.78]);
      }
      const romCore = addInkBox(group, materials, 0.95, 0.16, 0.78, accentHex, [0, 0.96, 0], {
        emissive: accentHex,
        emissiveIntensity: 1.15,
      });
      const bootRail = addInkBox(group, materials, 2.9, 0.14, 0.18, primaryHex, [0, 2.15, -0.7], {
        emissive: primaryHex,
        emissiveIntensity: 0.95,
      });
      return {
        group,
        anchorHeight: 2.9,
        animate: (t, _prog, _cut, alert) => {
          romCore.position.y = 0.96 + (alert ? 0.35 + Math.sin(t * 6) * 0.1 : Math.sin(t * 2.5) * 0.06);
          bootRail.position.y = 2.15 + Math.sin(t * 2) * 0.08;
        },
      };
    }

    case 'kernel-courthouse': {
      // Lower kernel vault chamber + glowing brass bailiff medallion + eBPF packet sieve
      addInkBox(group, materials, 2.8, 1.6, 1.7, 0x0f172a, [0, 0.8, 0], { castShadow: true });
      const glassShield = addInkBox(group, materials, 2.6, 0.14, 1.65, primaryHex, [0, 1.78, 0], {
        transparent: true,
        opacity: 0.45,
        emissive: primaryHex,
        emissiveIntensity: 0.65,
      });
      const medallion = addInkCylinder(group, materials, 0.52, 0.52, 0.18, 6, 0xfacc15, [0, 2.45, 0.2], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.95,
        outline: true,
      });
      medallion.rotation.x = Math.PI / 2;
      const hookOrb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.36, 0),
        materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 1.2 })
      );
      hookOrb.position.set(0, 0.95, 0.65);
      group.add(hookOrb);
      return {
        group,
        anchorHeight: 3.2,
        animate: (t, _prog, cut, alert) => {
          glassShield.position.y = 1.78 + cut * 0.45;
          medallion.rotation.z = t * (alert ? 3.0 : 1.1);
          hookOrb.position.y = 0.95 + (alert ? Math.sin(t * 5) * 0.45 : 0.1);
        },
      };
    }

    case 'factory-conveyor': {
      // Motorized CI/CD assembly deck + articulated robotic microchip swap arm + package crates
      addInkBox(group, materials, 3.5, 0.72, 1.45, 0x334155, [0, 0.36, 0], { castShadow: true });
      addInkBox(group, materials, 3.3, 0.1, 1.15, 0x0f172a, [0, 0.76, 0]);
      const crate = addInkBox(group, materials, 0.88, 0.78, 0.88, primaryHex, [-0.8, 1.2, 0], {
        emissive: primaryHex,
        emissiveIntensity: 0.55,
      });
      const armBase = addInkCylinder(group, materials, 0.28, 0.35, 1.1, 12, 0x475569, [0.4, 1.25, -0.75]);
      const armPivot = new THREE.Group();
      armPivot.position.set(0.4, 1.85, -0.75);
      addInkBox(armPivot, materials, 0.24, 0.24, 1.35, 0xfacc15, [0, 0.25, 0.58]);
      const chip = addInkBox(armPivot, materials, 0.38, 0.22, 0.38, accentHex, [0, -0.05, 1.15], {
        emissive: accentHex,
        emissiveIntensity: 1.2,
      });
      group.add(armBase, armPivot);
      return {
        group,
        anchorHeight: 3.0,
        animate: (t, _prog, _cut, alert) => {
          crate.position.x = -1.1 + ((t * 0.5) % 1) * 2.2;
          armPivot.rotation.x = Math.sin(t * (alert ? 4 : 2)) * 0.35;
          chip.scale.setScalar(alert ? 1.2 : 0.9);
        },
      };
    }

    case 'shipping-container': {
      // Corrugated steel harbor shipping container + animated cutaway hatch + overhead crane hook
      addInkBox(group, materials, 3.3, 2.15, 1.75, primaryHex, [0, 1.08, 0], { castShadow: true });
      const frontSide = addInkBox(group, materials, 3.1, 1.9, 0.12, primaryHex, [0, 1.08, 0.9], {
        transparent: true,
        opacity: 0.9,
      });
      const hatch = addInkBox(group, materials, 0.85, 0.85, 0.14, accentHex, [1.22, 0.72, 0.96], {
        emissive: accentHex,
        emissiveIntensity: 0.95,
      });
      // Overhead crane hook
      const hook = new THREE.Group();
      hook.position.set(0, 3.05, 0);
      addInkBox(hook, materials, 1.8, 0.22, 0.4, 0xfacc15, [0, 0, 0]);
      addInkCylinder(hook, materials, 0.06, 0.06, 0.7, 8, 0xe2e8f0, [-0.65, -0.4, 0]);
      addInkCylinder(hook, materials, 0.06, 0.06, 0.7, 8, 0xe2e8f0, [0.65, -0.4, 0]);
      group.add(hook);
      return {
        group,
        anchorHeight: 3.4,
        animate: (t, _prog, cut, alert) => {
          (frontSide.material as THREE.MeshToonMaterial).opacity =
            cut > 0.5 ? 0.18 : 0.92;
          hatch.position.x = 1.22 + (alert || cut > 0.5 ? 0.55 : 0);
          hook.position.y = 3.05 + Math.sin(t * 2) * 0.2;
        },
      };
    }

    case 'k8s-tower': {
      // Hexagonal Kubernetes cluster control tower + spinning helm wheel + sidecar gate
      addInkCylinder(group, materials, 1.15, 1.32, 2.75, 6, 0x1d4ed8, [0, 1.38, 0]);
      const helm = new THREE.Group();
      helm.position.set(0, 3.1, 0);
      const wheelRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.08, 8, 18),
        materials.createToonMaterial(0x38bdf8, { emissive: 0x38bdf8, emissiveIntensity: 1.0 })
      );
      helm.add(wheelRing);
      for (let i = 0; i < 4; i += 1) {
        const spoke = addInkBox(helm, materials, 1.4, 0.08, 0.08, 0x38bdf8, [0, 0, 0]);
        spoke.rotation.z = (i * Math.PI) / 4;
      }
      group.add(helm);
      const sidecarPod = addInkBox(group, materials, 0.78, 0.92, 0.78, accentHex, [1.45, 0.85, 0.45], {
        emissive: accentHex,
        emissiveIntensity: 0.95,
      });
      return {
        group,
        anchorHeight: 3.7,
        animate: (t, _prog, _cut, alert) => {
          helm.rotation.z = t * (alert ? 3.2 : 1.2);
          sidecarPod.position.y = 0.85 + Math.sin(t * 3) * 0.24;
          sidecarPod.position.x = alert ? 1.05 : 1.55;
        },
      };
    }

    case 'database-vault': {
      // Warehouse roll-up door + rolling carbon-copy drum + glass calculator sandbox
      addInkCylinder(group, materials, 1.05, 1.05, 2.45, 18, 0x1e293b, [-0.55, 1.24, 0]);
      for (const ry of [0.65, 1.35, 2.05]) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.08, 0.06, 8, 24),
          new THREE.MeshBasicMaterial({ color: primaryHex, toneMapped: false })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(-0.55, ry, 0);
        group.add(ring);
      }
      const sandbox = addInkBox(group, materials, 1.25, 1.35, 1.15, accentHex, [1.05, 0.95, 0.35], {
        transparent: true,
        opacity: 0.42,
        emissive: accentHex,
        emissiveIntensity: 0.55,
      });
      const calcCore = addInkBox(group, materials, 0.56, 0.62, 0.56, 0xfacc15, [1.05, 0.95, 0.35], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.9,
      });
      return {
        group,
        anchorHeight: 3.0,
        animate: (t, _prog, cut, alert) => {
          sandbox.scale.setScalar(alert || cut > 0.6 ? 1.14 : 1);
          calcCore.rotation.y = t * 2.2;
          calcCore.position.y = 0.95 + (alert ? 0.65 : Math.sin(t * 2.5) * 0.12);
        },
      };
    }

    case 'heating-boiler': {
      // District heating industrial boiler tank + pipe gauges + rotating thermostat dial
      addInkCylinder(group, materials, 1.05, 1.05, 2.6, 18, 0x475569, [-0.35, 1.35, 0]);
      addInkCylinder(group, materials, 0.2, 0.2, 1.6, 10, 0xf97316, [0.95, 1.35, 0], {
        emissive: 0xf97316,
        emissiveIntensity: 0.9,
      });
      const dial = new THREE.Group();
      dial.position.set(-0.35, 1.6, 1.1);
      addInkCylinder(dial, materials, 0.56, 0.56, 0.14, 18, 0xf8fafc, [0, 0, 0]).rotation.x = Math.PI / 2;
      const needle = addInkBox(dial, materials, 0.08, 0.42, 0.1, accentHex, [0, 0.15, 0.1], {
        emissive: accentHex,
        emissiveIntensity: 1.1,
      });
      group.add(dial);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, _cut, alert) => {
          needle.parent!.rotation.z = alert ? -1.15 + Math.sin(t * 8) * 0.18 : 0.4 * Math.sin(t * 1.5);
        },
      };
    }

    case 'substation-breakers': {
      // High-voltage substation transformer + 4 slamming knife-switch breakers
      addInkBox(group, materials, 2.8, 1.45, 1.4, 0x334155, [0, 0.72, -0.15], { castShadow: true });
      const blades: THREE.Group[] = [];
      for (let i = 0; i < 4; i += 1) {
        const bx = -1.05 + i * 0.7;
        addInkCylinder(group, materials, 0.15, 0.2, 0.95, 10, 0x94a3b8, [bx, 1.9, -0.35]);
        const pivot = new THREE.Group();
        pivot.position.set(bx, 1.55, 0.25);
        addInkBox(pivot, materials, 0.14, 1.05, 0.14, accentHex, [0, 0.5, 0], {
          emissive: accentHex,
          emissiveIntensity: 1.0,
        });
        group.add(pivot);
        blades.push(pivot);
      }
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, _cut, alert) => {
          blades.forEach((b, i) => {
            b.rotation.x = alert ? 0.92 : Math.sin(t * 2 + i * 0.5) * 0.22;
          });
        },
      };
    }

    case 'centrifuge-hall': {
      // Trio of spinning uranium centrifuge cylinders + spoofed glass translator booth
      const rotors: THREE.Group[] = [];
      for (const rx of [-1.05, 0, 1.05]) {
        const rotor = new THREE.Group();
        rotor.position.set(rx, 0, -0.2);
        addInkCylinder(rotor, materials, 0.36, 0.38, 2.85, 14, 0xcbd5e1, [0, 1.44, 0]);
        addInkBox(rotor, materials, 0.82, 0.16, 0.16, primaryHex, [0, 2.15, 0], {
          emissive: primaryHex,
          emissiveIntensity: 1.0,
        });
        group.add(rotor);
        rotors.push(rotor);
      }
      const booth = addInkBox(group, materials, 1.25, 1.35, 0.85, accentHex, [0, 0.82, 0.95], {
        transparent: true,
        opacity: 0.42,
        emissive: accentHex,
        emissiveIntensity: 0.65,
      });
      return {
        group,
        anchorHeight: 3.3,
        animate: (t, _prog, cut, alert) => {
          rotors.forEach((r, idx) => {
            r.rotation.y = t * (alert ? 14 : 3.5) * (idx % 2 === 0 ? 1 : -1);
          });
          booth.visible = cut < 0.85;
        },
      };
    }

    case 'safety-judges': {
      // Triple-redundant Triconex safety judge cabinet + glowing brass physical key switch
      addInkBox(group, materials, 2.85, 2.55, 1.25, 0x1e293b, [0, 1.28, 0], { castShadow: true });
      const lamps: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i += 1) {
        const lamp = addInkBox(group, materials, 0.62, 1.35, 0.14, 0x10b981, [-0.82 + i * 0.82, 1.48, 0.66], {
          emissive: 0x10b981,
          emissiveIntensity: 0.95,
        });
        lamps.push(lamp);
      }
      const key = buildKeyToken(materials, 0xfacc15);
      key.position.set(0, 0.55, 0.95);
      key.scale.setScalar(0.75);
      group.add(key);
      return {
        group,
        anchorHeight: 3.0,
        animate: (t, _prog, _cut, alert) => {
          key.rotation.z = alert ? Math.PI * 0.5 : 0;
          lamps.forEach((l, idx) => {
            const hex = alert && idx === 1 ? accentHex : 0x10b981;
            (l.material as THREE.MeshToonMaterial).emissive.setHex(hex);
            (l.material as THREE.MeshToonMaterial).color.setHex(hex);
          });
          key.position.z = 0.95 + Math.sin(t * 2.5) * 0.08;
        },
      };
    }

    case 'plc-toolbox': {
      // Industrial multi-PLC ladder rack + open Swiss-army factory toolbox
      addInkBox(group, materials, 2.5, 2.65, 1.1, 0x334155, [-0.35, 1.32, -0.2], { castShadow: true });
      for (let i = 0; i < 3; i += 1) {
        addInkBox(group, materials, 1.9, 0.45, 0.14, i === 1 ? accentHex : primaryHex, [-0.35, 0.72 + i * 0.7, 0.4], {
          emissive: i === 1 ? accentHex : primaryHex,
          emissiveIntensity: 0.85,
        });
      }
      const toolbox = addInkBox(group, materials, 1.15, 0.75, 0.85, 0xf43f5e, [1.25, 0.38, 0.55]);
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, _cut, alert) => {
          toolbox.position.y = 0.38 + (alert ? Math.abs(Math.sin(t * 5)) * 0.24 : 0);
        },
      };
    }

    case 'smartphone-chassis': {
      // Oversized cutaway smartphone chassis + walled glass playroom + BlastDoor filter
      addInkBox(group, materials, 2.15, 3.35, 0.55, 0x0f172a, [0, 1.72, 0], { castShadow: true });
      const screen = addInkBox(group, materials, 1.85, 2.85, 0.1, primaryHex, [0, 1.72, 0.3], {
        transparent: true,
        opacity: 0.45,
        emissive: primaryHex,
        emissiveIntensity: 0.55,
      });
      const blastDoor = addInkBox(group, materials, 1.65, 0.24, 0.32, 0xfacc15, [0, 1.75, 0.46], {
        emissive: 0xfacc15,
        emissiveIntensity: 0.9,
      });
      const card = addInkBox(group, materials, 0.72, 0.52, 0.1, accentHex, [0, 2.45, 0.65], {
        emissive: accentHex,
        emissiveIntensity: 1.15,
      });
      return {
        group,
        anchorHeight: 3.7,
        animate: (t, _prog, cut, alert) => {
          screen.visible = cut < 0.75;
          blastDoor.scale.x = alert ? 0.35 : 1;
          card.position.y = alert ? 1.1 + Math.sin(t * 3) * 0.2 : 2.45;
          card.rotation.y = Math.sin(t * 2) * 0.3;
        },
      };
    }

    case 'telecom-bridge': {
      // International postal/roaming carrier bridge arch + 5G glass corridor
      addInkBox(group, materials, 0.55, 2.6, 1.1, 0x334155, [-1.3, 1.3, 0]);
      addInkBox(group, materials, 0.55, 2.6, 1.1, 0x334155, [1.3, 1.3, 0]);
      addInkBox(group, materials, 3.2, 0.38, 1.2, primaryHex, [0, 1.85, 0], {
        transparent: true,
        opacity: 0.65,
        emissive: primaryHex,
        emissiveIntensity: 0.7,
      });
      const packet = addInkBox(group, materials, 0.52, 0.42, 0.52, accentHex, [0, 2.25, 0], {
        emissive: accentHex,
        emissiveIntensity: 1.15,
      });
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, _cut, alert) => {
          packet.position.x = -1.1 + ((t * (alert ? 1.2 : 0.6)) % 1) * 2.2;
          packet.rotation.y = t * 2.8;
        },
      };
    }

    case 'memory-xray-chamber': {
      // Split memory chamber showing structured segments + glowing altered page
      const cab = buildFilingCabinet(materials, 0x334155, primaryHex);
      group.add(cab.group);
      const glassFrame = addInkBox(group, materials, 1.95, 2.65, 1.55, primaryHex, [0, 1.38, 0], {
        transparent: true,
        opacity: 0.24,
      });
      const anomalyBlock = addInkBox(group, materials, 1.35, 0.52, 1.22, accentHex, [0, 1.45, 0.25], {
        emissive: accentHex,
        emissiveIntensity: 1.15,
      });
      return {
        group,
        anchorHeight: 3.1,
        animate: (t, _prog, cut, alert) => {
          glassFrame.visible = cut < 0.7;
          anomalyBlock.visible = alert;
          anomalyBlock.position.z = 0.25 + (alert ? Math.sin(t * 4) * 0.14 : 0);
          cab.padlock.visible = alert;
        },
      };
    }
  }
}
