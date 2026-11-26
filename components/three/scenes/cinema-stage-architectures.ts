import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { SpatialSetArchetype } from '@/lib/scenario-cinema-profiles-core';
export {
  buildHeroKineticMechanism,
  type BuiltHeroKinetic,
} from './real-world-heroes';

export interface BuiltSpatialArchitecture {
  group: THREE.Group;
  leftPropPos: [number, number, number];
  rightPropPos: [number, number, number];
  leftPlaquePos: [number, number, number];
  rightPlaquePos: [number, number, number];
  heroCenterPos: [number, number, number];
  boardPos: [number, number, number];
  animate: (timeSec: number, progress: number, alert: boolean) => void;
}

export interface BuiltMalwareBackdrop {
  group: THREE.Group;
  animate: (timeSec: number, progress: number, alert: boolean) => void;
}

function addBox(
  parent: THREE.Object3D,
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  ink: THREE.LineBasicMaterial,
  pos: [number, number, number],
  rot?: [number, number, number],
  receiveShadow = false
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  m.receiveShadow = receiveShadow;
  addAnimeInkEdges(m, ink, 24);
  parent.add(m);
  return m;
}

function addCyl(
  parent: THREE.Object3D,
  rt: number,
  rb: number,
  h: number,
  segs: number,
  mat: THREE.Material,
  ink: THREE.LineBasicMaterial,
  pos: [number, number, number],
  rot?: [number, number, number]
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat);
  m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  addAnimeInkEdges(m, ink, 24);
  parent.add(m);
  return m;
}

/**
 * Composite 4-part anime tree (trunk + 3 tiered foliage crowns) pivoted at y = 0.
 */
function buildParkTree(
  materials: AnimeMaterialLibrary,
  scale = 1,
  foliageHex = 0x16a34a
): THREE.Group {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;
  addCyl(g, 0.22, 0.34, 1.9, 10, materials.createToonMaterial(0x78350f), ink, [0, 0.95, 0]);
  const fMat = materials.createToonMaterial(foliageHex);
  const fLight = materials.createToonMaterial(0x22c55e);
  for (const [x, y, z, r, m] of [
    [0, 2.35, 0, 1.18, fMat],
    [-0.65, 1.95, 0.2, 0.85, fLight],
    [0.65, 2.05, -0.15, 0.88, fMat],
    [0, 3.1, 0, 0.78, fLight],
  ] as const) {
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), m);
    crown.position.set(x, y, z);
    addAnimeInkEdges(crown, ink, 26);
    g.add(crown);
  }
  g.scale.setScalar(scale);
  return g;
}

/**
 * Classic outdoor iron park / street lamp pivoted at y = 0.
 */
function buildStreetLamp(
  materials: AnimeMaterialLibrary,
  glowHex = 0xfef08a
): THREE.Group {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;
  const iron = materials.createToonMaterial(0x1e293b);
  addCyl(g, 0.08, 0.14, 4.1, 8, iron, ink, [0, 2.05, 0]);
  addBox(g, 0.95, 0.1, 0.1, iron, ink, [0.42, 4.08, 0]);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 10, 8),
    new THREE.MeshBasicMaterial({ color: glowHex, toneMapped: false })
  );
  bulb.position.set(0.82, 3.92, 0);
  g.add(bulb);
  return g;
}

/**
 * Reusable wooden park / platform bench pivoted at y = 0.
 */
function buildBench(materials: AnimeMaterialLibrary): THREE.Group {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;
  const wood = materials.createToonMaterial(0x92400e);
  const iron = materials.createToonMaterial(0x1e293b);
  addBox(g, 1.95, 0.1, 0.52, wood, ink, [0, 0.52, 0]);
  addBox(g, 1.95, 0.42, 0.08, wood, ink, [0, 0.82, -0.24], [-0.15, 0, 0]);
  addBox(g, 0.12, 0.54, 0.54, iron, ink, [-0.82, 0.27, 0]);
  addBox(g, 0.12, 0.54, 0.54, iron, ink, [0.82, 0.27, 0]);
  return g;
}

/**
 * Builds ONLY the unmistakable rear & flanking real-world architectural vista (z <= -4.7 and |x| >= 7.2)
 * so it can be mounted BOTH by full real-world sets AND as a backdrop for the 29 non-hollowing MALWARE worlds
 * without ever colliding with foreground props or the camera!
 */
function buildRealWorldBackdropStructure(
  setKind: SpatialSetArchetype,
  materials: AnimeMaterialLibrary,
  accentHex: number,
  secondaryHex: number
): { group: THREE.Group; animate: (t: number, prog: number, alert: boolean) => void } {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;
  const anims: Array<(t: number, prog: number, alert: boolean) => void> = [];

  const creamMat = materials.createToonMaterial(0xf5f5f4);
  const marbleMat = materials.createToonMaterial(0xe2e8f0);
  const slateMat = materials.createToonMaterial(0x334155);
  const darkMat = materials.createToonMaterial(0x0f172a);
  const woodMat = materials.createToonMaterial(0x7c4a26);
  const brickMat = materials.createToonMaterial(0xb45309);
  const glassMat = materials.createToonMaterial(0xbae6fd, {
    emissive: 0x38bdf8,
    emissiveIntensity: 0.25,
    transparent: true,
    opacity: 0.72,
  });
  const warmGlass = materials.createToonMaterial(0xfef3c7, {
    emissive: 0xf59e0b,
    emissiveIntensity: 0.35,
  });
  const accentMat = materials.createToonMaterial(accentHex, {
    emissive: accentHex,
    emissiveIntensity: 0.55,
  });
  const secMat = materials.createToonMaterial(secondaryHex, {
    emissive: secondaryHex,
    emissiveIntensity: 0.55,
  });
  const brassMat = materials.createToonMaterial(0xd97706);

  switch (setKind) {
    /* 1. BANK BRANCH & VAULT */
    case 'bank-branch-vault': {
      // Grand marble bank facade with fluted columns, pediment & teller windows
      addBox(g, 24, 5.4, 0.6, creamMat, ink, [0, 2.7, -5.6]);
      for (let x = -9.6; x <= 9.6; x += 3.2) {
        addCyl(g, 0.36, 0.42, 5.4, 12, marbleMat, ink, [x, 2.7, -5.05]);
        addBox(g, 0.96, 0.28, 0.96, marbleMat, ink, [x, 5.45, -5.05]);
      }
      addBox(g, 25, 0.52, 1.35, marbleMat, ink, [0, 5.8, -5.15]);
      // Teller glass cages on left and right wings
      for (const side of [-1, 1]) {
        addBox(g, 3.6, 1.15, 1.1, woodMat, ink, [side * 8.4, 0.58, -3.3]);
        addBox(g, 3.4, 1.4, 0.12, glassMat, ink, [side * 8.4, 1.85, -2.9]);
        addBox(g, 3.5, 0.16, 0.18, brassMat, ink, [side * 8.4, 2.58, -2.9]);
      }
      break;
    }

    /* 2. GLASS OFFICE BUILDING WITH ROOMS & PEOPLE */
    case 'office-building-reception': {
      // Multi-story glass curtain-wall office tower with illuminated meeting rooms & silhouette workers
      addBox(g, 24, 6.2, 0.5, darkMat, ink, [0, 3.1, -5.8]);
      for (let floor = 0; floor < 2; floor++) {
        for (let room = -2; room <= 2; room++) {
          const rx = room * 4.4;
          const ry = 1.45 + floor * 2.8;
          // Illuminated glass office room
          addBox(g, 3.85, 2.25, 0.16, (room + floor) % 2 === 0 ? warmGlass : glassMat, ink, [rx, ry, -5.45]);
          // Mullion dividers
          addBox(g, 0.18, 2.45, 0.28, slateMat, ink, [rx - 2.05, ry, -5.32]);
          // Worker silhouettes walking/working inside rooms
          const person = new THREE.Group();
          person.position.set(rx + (room % 2 === 0 ? -0.5 : 0.4), ry - 0.55, -5.28);
          addBox(person, 0.34, 0.62, 0.16, darkMat, ink, [0, 0, 0]);
          const ph = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), darkMat);
          ph.position.y = 0.48;
          person.add(ph);
          g.add(person);
          const baseX = rx;
          anims.push((t) => {
            person.position.x = baseX + Math.sin(t * 0.9 + room * 1.4 + floor) * 0.85;
          });
        }
      }
      // Flanking glass conference partitions on left/right sides
      for (const side of [-1, 1]) {
        addBox(g, 2.8, 3.6, 0.18, glassMat, ink, [side * 8.8, 1.8, -3.1], [0, side * 0.32, 0]);
        addBox(g, 2.9, 0.2, 0.26, slateMat, ink, [side * 8.8, 3.65, -3.1], [0, side * 0.32, 0]);
      }
      break;
    }

    /* 3. AIRPORT TERMINAL, CONTROL TOWER & RUNWAY */
    case 'airport-terminal-gate': {
      // Sweeping glass airport terminal concourse behind tarmac (open sky above!)
      addBox(g, 26, 2.8, 0.7, glassMat, ink, [0, 1.4, -5.9]);
      addBox(g, 27, 0.34, 1.8, materials.createToonMaterial(0xf8fafc), ink, [0, 3.0, -5.6], [-0.14, 0, 0]);
      for (let x = -10; x <= 10; x += 4) {
        addBox(g, 0.24, 3.0, 0.4, slateMat, ink, [x, 1.5, -5.45]);
      }
      // Tall unmistakable Air Traffic Control Tower on right horizon
      addCyl(g, 0.78, 1.08, 6.2, 10, materials.createToonMaterial(0xf1f5f9), ink, [9.2, 3.1, -6.4]);
      addCyl(g, 1.85, 1.25, 1.25, 10, glassMat, ink, [9.2, 6.55, -6.4]);
      addCyl(g, 2.05, 2.05, 0.28, 10, darkMat, ink, [9.2, 7.25, -6.4]);
      const radar = addBox(g, 1.65, 0.28, 0.14, secMat, ink, [9.2, 7.65, -6.4]);
      anims.push((t) => {
        radar.rotation.y = t * 2.2;
      });
      // Security metal-detector gate arch on left wing
      addBox(g, 0.28, 2.8, 0.72, slateMat, ink, [-9.8, 1.4, -3.2]);
      addBox(g, 0.28, 2.8, 0.72, slateMat, ink, [-7.8, 1.4, -3.2]);
      addBox(g, 2.35, 0.35, 0.78, accentMat, ink, [-8.8, 2.88, -3.2]);
      break;
    }

    /* 4. SUPERMARKET STOCKED AISLES & SIGNAGE */
    case 'supermarket-retail-store': {
      addBox(g, 24, 5.2, 0.45, creamMat, ink, [0, 2.6, -5.9]);
      // 4 stocked supermarket shelving racks with colorful product boxes & aisle signs
      const boxColors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6, 0xa855f7];
      for (const sx of [-8.8, -3.4, 3.4, 8.8]) {
        addBox(g, 3.4, 3.6, 0.9, materials.createToonMaterial(0xe2e8f0), ink, [sx, 1.8, -5.0]);
        for (let shelf = 0; shelf < 3; shelf++) {
          for (let p = 0; p < 5; p++) {
            addBox(
              g,
              0.52,
              0.56,
              0.45,
              materials.createToonMaterial(boxColors[(p + shelf) % boxColors.length]),
              ink,
              [sx - 1.25 + p * 0.62, 0.72 + shelf * 1.02, -4.55]
            );
          }
        }
        // Hanging neon aisle number sign
        addBox(g, 1.4, 0.48, 0.14, accentMat, ink, [sx, 4.45, -4.8]);
      }
      break;
    }

    /* 5. CITY PARK TREES, BENCHES & LAMPS (OPEN OUTDOOR) */
    case 'city-park-fountain': {
      // Natural outdoor tree grove perimeter (NO indoor wall!)
      for (const [tx, tz, sc, col] of [
        [-10.2, -4.8, 1.35, 0x15803d],
        [-6.6, -6.2, 1.15, 0x16a34a],
        [-2.2, -6.8, 1.25, 0x22c55e],
        [2.8, -6.6, 1.2, 0x15803d],
        [7.0, -5.9, 1.3, 0x16a34a],
        [10.4, -4.5, 1.18, 0x22c55e],
      ] as const) {
        const tree = buildParkTree(materials, sc, col);
        tree.position.set(tx, 0, tz);
        g.add(tree);
      }
      for (const side of [-1, 1]) {
        const bench = buildBench(materials);
        bench.position.set(side * 8.0, 0, -2.6);
        bench.rotation.y = side * -0.4;
        g.add(bench);
        const lamp = buildStreetLamp(materials, 0xfef08a);
        lamp.position.set(side * 9.5, 0, -3.5);
        lamp.rotation.y = side < 0 ? 0 : Math.PI;
        g.add(lamp);
      }
      // Low white park picket/iron fence along far edge
      for (let x = -11; x <= 11; x += 2.2) {
        addBox(g, 0.14, 0.9, 0.14, darkMat, ink, [x, 0.45, -5.4]);
      }
      addBox(g, 22.4, 0.1, 0.1, darkMat, ink, [0, 0.82, -5.4]);
      break;
    }

    /* 6. MULTI-LANE CITY HIGHWAY & OVERHEAD GREEN EXIT GANTRY */
    case 'city-highway-toll-plaza': {
      // Overhead steel highway truss gantry spanning across all lanes
      addCyl(g, 0.24, 0.28, 5.8, 10, slateMat, ink, [-9.6, 2.9, -5.2]);
      addCyl(g, 0.24, 0.28, 5.8, 10, slateMat, ink, [9.6, 2.9, -5.2]);
      addBox(g, 19.8, 0.36, 0.36, slateMat, ink, [0, 5.45, -5.2]);
      // Classic bright green highway directional signs
      const signGreen = materials.createToonMaterial(0x15803d);
      addBox(g, 4.4, 1.55, 0.2, signGreen, ink, [-4.8, 5.15, -4.95]);
      addBox(g, 4.4, 1.55, 0.2, signGreen, ink, [4.8, 5.15, -4.95]);
      addBox(g, 3.4, 0.14, 0.22, creamMat, ink, [-4.8, 5.35, -4.84]);
      addBox(g, 3.4, 0.14, 0.22, creamMat, ink, [4.8, 5.35, -4.84]);
      // Concrete highway jersey barriers along far shoulder
      for (let x = -10; x <= 10; x += 2.6) {
        addBox(g, 2.35, 0.95, 0.55, marbleMat, ink, [x, 0.475, -5.6]);
      }
      // Tall highway cobra-head streetlights
      for (const side of [-1, 1]) {
        const lamp = buildStreetLamp(materials, 0xfde047);
        lamp.position.set(side * 10.6, 0, -3.2);
        lamp.scale.setScalar(1.2);
        lamp.rotation.y = side < 0 ? 0 : Math.PI;
        g.add(lamp);
      }
      break;
    }

    /* 7. DOWNTOWN CITY STREET INTERSECTION & STOREFRONTS */
    case 'city-street-intersection': {
      // Row of colorful brick city storefronts with striped awnings & glowing windows
      const facades: Array<[number, number, number, number]> = [
        [-8.8, 5.4, 0xb45309, 0xef4444],
        [-3.0, 6.4, 0x475569, 0x0284c7],
        [3.0, 5.8, 0x9a3412, 0x10b981],
        [8.8, 6.2, 0x334155, 0xf59e0b],
      ];
      for (const [fx, fh, wallCol, awnCol] of facades) {
        addBox(g, 5.2, fh, 1.4, materials.createToonMaterial(wallCol), ink, [fx, fh * 0.5, -5.9]);
        // Storefront ground window + striped awning
        addBox(g, 3.8, 1.6, 0.14, warmGlass, ink, [fx, 1.25, -5.15]);
        addBox(g, 4.3, 0.42, 0.95, materials.createToonMaterial(awnCol), ink, [fx, 2.35, -4.85], [0.28, 0, 0]);
        // Upper apartment windows
        for (const wx of [-1.2, 1.2]) {
          addBox(g, 1.0, 1.15, 0.14, glassMat, ink, [fx + wx, 3.85, -5.15]);
        }
      }
      for (const side of [-1, 1]) {
        const lamp = buildStreetLamp(materials);
        lamp.position.set(side * 9.8, 0, -3.4);
        lamp.rotation.y = side < 0 ? 0 : Math.PI;
        g.add(lamp);
      }
      break;
    }

    /* 8. TRAIN STATION PLATFORM & IRON CANOPY */
    case 'train-station-platform': {
      // Arched Victorian steel train-shed columns & hanging station clock
      for (const x of [-9.2, -3.2, 3.2, 9.2]) {
        addCyl(g, 0.22, 0.26, 5.4, 10, darkMat, ink, [x, 2.7, -5.3]);
      }
      addBox(g, 23, 0.36, 2.8, slateMat, ink, [0, 5.55, -5.3]);
      // Classic round station clock suspended at center rear
      addCyl(g, 0.88, 0.88, 0.24, 20, creamMat, ink, [0, 4.45, -4.8], [Math.PI / 2, 0, 0]);
      addBox(g, 0.08, 0.55, 0.08, darkMat, ink, [0, 4.65, -4.64]);
      addBox(g, 0.42, 0.08, 0.08, secMat, ink, [0.18, 4.45, -4.64]);
      // Platform waiting benches
      for (const side of [-1, 1]) {
        const b = buildBench(materials);
        b.position.set(side * 8.2, 0, -3.4);
        g.add(b);
      }
      break;
    }

    /* 9. SUBWAY METRO TILED TUNNEL & ROUTE SIGN */
    case 'subway-metro-station': {
      addBox(g, 24, 5.2, 0.5, materials.createToonMaterial(0xe2e8f0), ink, [0, 2.6, -5.6]);
      // Iconic horizontal subway color tile band
      addBox(g, 24, 0.58, 0.56, accentMat, ink, [0, 3.4, -5.56]);
      // Fluted steel subway support girders
      for (let x = -9; x <= 9; x += 4.5) {
        addBox(g, 0.44, 5.2, 0.52, darkMat, ink, [x, 2.6, -5.15]);
      }
      // Illuminated subway line badge signs
      for (const sx of [-6.5, 6.5]) {
        addBox(g, 2.4, 0.72, 0.22, darkMat, ink, [sx, 4.35, -5.0]);
        addCyl(g, 0.24, 0.24, 0.26, 14, secMat, ink, [sx - 0.72, 4.35, -4.96], [Math.PI / 2, 0, 0]);
      }
      break;
    }

    /* 10. HOSPITAL TRIAGE WARD & RED CROSS SIGN */
    case 'hospital-triage-ward': {
      addBox(g, 24, 5.4, 0.5, materials.createToonMaterial(0xf8fafc), ink, [0, 2.7, -5.6]);
      // Soft clinical teal waist dado stripe
      addBox(g, 24, 1.25, 0.54, materials.createToonMaterial(0x0d9488), ink, [0, 0.625, -5.56]);
      // Glowing Red Cross Hospital emblem at rear center
      const redCrossMat = new THREE.MeshBasicMaterial({ color: 0xef4444, toneMapped: false });
      addBox(g, 0.44, 1.55, 0.14, redCrossMat, ink, [0, 3.85, -5.25]);
      addBox(g, 1.55, 0.44, 0.14, redCrossMat, ink, [0, 3.85, -5.25]);
      // Hospital privacy curtains framing left & right triage bays
      for (const side of [-1, 1]) {
        addBox(g, 3.2, 3.2, 0.16, materials.createToonMaterial(0xbae6fd), ink, [side * 8.6, 1.65, -3.5]);
      }
      break;
    }

    /* 11. POST OFFICE SORTING HUB & P.O. BOX WALL */
    case 'post-office-sorting-hub': {
      addBox(g, 24, 5.2, 0.5, creamMat, ink, [0, 2.6, -5.6]);
      // Grid of brass P.O. Boxes across rear wall
      for (let c = -4; c <= 4; c++) {
        for (let r = 0; r < 3; r++) {
          addBox(g, 1.55, 0.85, 0.32, brassMat, ink, [c * 1.9, 1.1 + r * 1.05, -5.2]);
        }
      }
      // Classic blue street mailbox standing on left wing
      addBox(g, 1.05, 1.55, 0.92, materials.createToonMaterial(0x1d4ed8), ink, [-8.8, 0.78, -3.2]);
      addCyl(g, 0.46, 0.46, 1.05, 12, materials.createToonMaterial(0x1d4ed8), ink, [-8.8, 1.55, -3.2], [0, 0, Math.PI / 2]);
      break;
    }

    /* 12. GRAND HOTEL MARBLE ATRIUM & CHANDELIER */
    case 'grand-hotel-lobby': {
      addBox(g, 24, 5.8, 0.5, materials.createToonMaterial(0xfef3c7), ink, [0, 2.9, -5.7]);
      // Arched brass elevator doors & columns
      for (const ex of [-6.4, 0, 6.4]) {
        addBox(g, 2.6, 3.5, 0.3, brassMat, ink, [ex, 1.75, -5.32]);
        addBox(g, 2.1, 3.2, 0.34, darkMat, ink, [ex, 1.6, -5.28]);
        addBox(g, 0.08, 3.2, 0.38, brassMat, ink, [ex, 1.6, -5.24]);
      }
      // Overhead golden chandelier ring
      const chand = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.14, 10, 24),
        new THREE.MeshBasicMaterial({ color: 0xfde047, toneMapped: false })
      );
      chand.rotation.x = Math.PI / 2;
      chand.position.set(0, 5.2, -4.0);
      g.add(chand);
      break;
    }

    /* 13. SHIPPING PORT GANTRY CRANES & CONTAINER STACKS */
    case 'shipping-port-container-yard': {
      // Giant red-and-blue harbor gantry cranes straddling rear pier
      const craneMat = materials.createToonMaterial(0xdc2626);
      for (const cx of [-7.5, 7.5]) {
        addBox(g, 0.48, 6.2, 0.48, craneMat, ink, [cx - 1.4, 3.1, -5.6]);
        addBox(g, 0.48, 6.2, 0.48, craneMat, ink, [cx + 1.4, 3.1, -5.6]);
        addBox(g, 5.8, 0.48, 0.52, craneMat, ink, [cx, 6.1, -5.6]);
      }
      // Stacked colorful steel shipping containers along rear edge
      const cCols = [0x0284c7, 0xf59e0b, 0x10b981, 0xe11d48];
      for (let i = 0; i < 4; i++) {
        addBox(g, 3.2, 1.35, 1.3, materials.createToonMaterial(cCols[i]), ink, [-6.6 + i * 4.4, 0.68, -6.2]);
        if (i % 2 === 0) {
          addBox(g, 3.2, 1.35, 1.3, materials.createToonMaterial(cCols[(i + 2) % 4]), ink, [-6.6 + i * 4.4, 2.04, -6.2]);
        }
      }
      break;
    }

    /* 14. FACTORY ASSEMBLY FLOOR & TRUSSES */
    case 'factory-assembly-line': {
      addBox(g, 24, 5.4, 0.5, slateMat, ink, [0, 2.7, -5.7]);
      // Yellow-black hazard safety stripe along dado
      addBox(g, 24, 0.42, 0.56, materials.createToonMaterial(0xfacc15, { map: materials.hazardStripeTexture }), ink, [0, 1.15, -5.64]);
      // Industrial overhead ventilation ducts & factory windows
      addCyl(g, 0.34, 0.34, 22, 12, materials.createToonMaterial(0x94a3b8), ink, [0, 4.85, -5.1], [0, 0, Math.PI / 2]);
      for (const wx of [-7.5, -2.5, 2.5, 7.5]) {
        addBox(g, 3.2, 1.65, 0.16, glassMat, ink, [wx, 3.2, -5.4]);
      }
      break;
    }

    /* 15. PUBLIC LIBRARY FLOOR-TO-CEILING BOOKSHELVES */
    case 'public-library-archive': {
      addBox(g, 24, 5.6, 0.5, woodMat, ink, [0, 2.8, -5.7]);
      const bookCols = [0xb91c1c, 0x1d4ed8, 0x15803d, 0xd97706, 0x6d28d9];
      for (let bay = -2; bay <= 2; bay++) {
        const bx = bay * 4.2;
        addBox(g, 3.6, 4.6, 0.65, materials.createToonMaterial(0x451a03), ink, [bx, 2.3, -5.25]);
        for (let row = 0; row < 4; row++) {
          for (let b = 0; b < 6; b++) {
            addBox(
              g,
              0.42,
              0.74,
              0.4,
              materials.createToonMaterial(bookCols[(b + row + Math.abs(bay)) % bookCols.length]),
              ink,
              [bx - 1.35 + b * 0.54, 0.72 + row * 1.05, -4.95]
            );
          }
        }
      }
      break;
    }

    /* 16. RESTAURANT KITCHEN & DRIVE-THRU WINDOW */
    case 'restaurant-kitchen-drivethru': {
      addBox(g, 24, 5.2, 0.5, materials.createToonMaterial(0xf8fafc), ink, [0, 2.6, -5.6]);
      // Stainless steel exhaust range hood & menu board
      addBox(g, 8.2, 1.35, 1.4, materials.createToonMaterial(0xcbd5e1), ink, [0, 4.4, -4.95]);
      // Glowing drive-thru order menu boards on flanks
      for (const side of [-1, 1]) {
        addBox(g, 3.4, 2.1, 0.25, darkMat, ink, [side * 7.8, 3.2, -5.2]);
        addBox(g, 3.0, 1.7, 0.28, warmGlass, ink, [side * 7.8, 3.2, -5.16]);
      }
      break;
    }

    /* 17. CINEMA THEATER MARQUEE & VELVET COLUMNS */
    case 'cinema-theater-stage': {
      addBox(g, 24, 5.6, 0.5, materials.createToonMaterial(0x4c0519), ink, [0, 2.8, -5.7]);
      // Illuminated golden Art-Deco marquee & sconces
      addBox(g, 11.4, 1.1, 0.55, darkMat, ink, [0, 4.85, -5.25]);
      addBox(g, 10.8, 0.72, 0.6, materials.createToonMaterial(0xfef3c7, { emissive: 0xfde047, emissiveIntensity: 0.45 }), ink, [0, 4.85, -5.2]);
      for (const cx of [-8.8, -4.4, 4.4, 8.8]) {
        addCyl(g, 0.34, 0.38, 5.4, 12, brassMat, ink, [cx, 2.7, -5.2]);
      }
      break;
    }

    /* 18. ART MUSEUM GALLERY WALL & FRAMED PAINTINGS */
    case 'museum-gallery-hall': {
      addBox(g, 24, 5.6, 0.5, creamMat, ink, [0, 2.8, -5.6]);
      // Ornate gold-framed gallery paintings hanging across the back wall
      const artCols = [0x0284c7, 0xe11d48, 0xf59e0b, 0x7c3aed];
      for (let i = 0; i < 4; i++) {
        const px = -7.8 + i * 5.2;
        addBox(g, 3.0, 2.2, 0.2, brassMat, ink, [px, 3.1, -5.28]);
        addBox(g, 2.5, 1.72, 0.24, materials.createToonMaterial(artCols[i]), ink, [px, 3.1, -5.24]);
        // Velvet rope stanchion posts in front of gallery wall
        addCyl(g, 0.06, 0.14, 1.05, 8, brassMat, ink, [px - 1.2, 0.52, -4.55]);
      }
      break;
    }

    /* 19. COURTHOUSE MARBLE COLUMNS & PEDIMENT */
    case 'courthouse-notary-hall': {
      addBox(g, 24, 5.6, 0.5, materials.createToonMaterial(0xe7e5e4), ink, [0, 2.8, -5.7]);
      addBox(g, 24, 2.0, 0.56, woodMat, ink, [0, 1.0, -5.64]);
      for (let x = -9; x <= 9; x += 3.6) {
        addCyl(g, 0.38, 0.42, 5.6, 14, creamMat, ink, [x, 2.8, -5.1]);
      }
      // Classical triangular courthouse pediment cornice
      addBox(g, 25, 0.48, 1.2, creamMat, ink, [0, 5.75, -5.2]);
      break;
    }

    /* 20. COFFEE SHOP CAFE AWNING & CHALKBOARD MENU */
    case 'coffee-shop-cafe': {
      addBox(g, 24, 5.2, 0.5, brickMat, ink, [0, 2.6, -5.6]);
      // Large chalkboard coffee menu at rear center
      addBox(g, 7.6, 2.3, 0.22, darkMat, ink, [0, 3.45, -5.26]);
      addBox(g, 7.8, 0.18, 0.26, woodMat, ink, [0, 4.65, -5.22]);
      // Striped cafe canopy awning above left & right windows
      for (const side of [-1, 1]) {
        addBox(g, 5.2, 0.48, 1.25, materials.createToonMaterial(0x059669), ink, [side * 7.8, 3.6, -4.85], [0.3, 0, 0]);
        addBox(g, 4.2, 2.0, 0.14, warmGlass, ink, [side * 7.8, 2.1, -5.26]);
      }
      break;
    }

    /* 21. AUTO REPAIR GARAGE SHUTTER BAY & TOOL CHEST */
    case 'car-repair-garage': {
      addBox(g, 24, 5.4, 0.5, slateMat, ink, [0, 2.7, -5.7]);
      // Twin corrugated roll-up steel garage bay doors
      for (const gx of [-5.8, 5.8]) {
        addBox(g, 5.8, 3.8, 0.32, materials.createToonMaterial(0x94a3b8), ink, [gx, 1.9, -5.32]);
        for (let rib = 0; rib < 6; rib++) {
          addBox(g, 5.85, 0.08, 0.38, darkMat, ink, [gx, 0.55 + rib * 0.6, -5.3]);
        }
      }
      // Red mechanic tool chest & stacked tires on flanks
      addBox(g, 2.2, 1.65, 1.0, materials.createToonMaterial(0xdc2626), ink, [-9.2, 0.825, -3.2]);
      for (let t = 0; t < 3; t++) {
        addCyl(g, 0.56, 0.56, 0.36, 14, darkMat, ink, [9.2, 0.18 + t * 0.37, -3.2]);
      }
      break;
    }

    /* 22. UNIVERSITY EXAM HALL CHALKBOARD & LOCKERS */
    case 'university-exam-hall': {
      addBox(g, 24, 5.4, 0.5, creamMat, ink, [0, 2.7, -5.6]);
      // Classic wide green lecture chalkboard across rear wall
      addBox(g, 11.4, 2.8, 0.18, materials.createToonMaterial(0x065f46), ink, [0, 3.1, -5.28]);
      addBox(g, 11.7, 0.18, 0.28, woodMat, ink, [0, 1.68, -5.2]);
      // Blue campus hallway lockers on flanks
      for (const side of [-1, 1]) {
        for (let l = 0; l < 3; l++) {
          addBox(g, 0.92, 3.2, 0.72, materials.createToonMaterial(0x2563eb), ink, [side * (7.2 + l * 1.02), 1.6, -4.9]);
        }
      }
      break;
    }

    /* 23. APARTMENT BUILDING BRICK LOBBY & MAILBOXES */
    case 'apartment-lobby-intercom': {
      addBox(g, 24, 5.6, 0.5, brickMat, ink, [0, 2.8, -5.7]);
      // Recessed wall of silver resident mailboxes
      addBox(g, 6.2, 2.4, 0.32, materials.createToonMaterial(0xcbd5e1), ink, [-5.6, 2.2, -5.32]);
      // Lit apartment lobby windows & balcony rail above
      for (const wx of [2.4, 7.6]) {
        addBox(g, 3.2, 2.2, 0.16, warmGlass, ink, [wx, 2.6, -5.36]);
      }
      addBox(g, 24, 0.24, 0.9, darkMat, ink, [0, 4.95, -5.2]);
      break;
    }

    /* 24. BORDER PASSPORT CONTROL BOOTHS */
    case 'border-passport-control': {
      // Overhead customs canopy spanning lanes
      addBox(g, 24, 0.55, 2.4, darkMat, ink, [0, 5.2, -5.2]);
      addBox(g, 24, 0.18, 2.45, accentMat, ink, [0, 4.88, -5.2]);
      // Glass-enclosed passport inspection booths
      for (const bx of [-7.6, 0, 7.6]) {
        addBox(g, 2.8, 3.4, 1.5, marbleMat, ink, [bx, 1.7, -5.3]);
        addBox(g, 2.4, 1.4, 1.56, glassMat, ink, [bx, 2.4, -5.3]);
        addBox(g, 0.9, 0.34, 0.3, secMat, ink, [bx, 3.65, -4.55]);
      }
      break;
    }

    /* 25. BROADCAST TV STUDIO CONTROL WINDOW & LIGHT TRUSS */
    case 'broadcast-tv-studio': {
      addBox(g, 24, 5.6, 0.5, darkMat, ink, [0, 2.8, -5.7]);
      // Wide soundproof glass control-room observation window
      addBox(g, 11.8, 2.6, 0.18, glassMat, ink, [0, 3.0, -5.35]);
      // Overhead studio lighting rig truss & glowing spotlights
      addBox(g, 22, 0.26, 0.42, slateMat, ink, [0, 5.2, -4.4]);
      for (let lx = -8; lx <= 8; lx += 4) {
        addCyl(g, 0.22, 0.34, 0.42, 10, darkMat, ink, [lx, 4.85, -4.4], [0.4, 0, 0]);
        const lamp = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 10, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a, toneMapped: false })
        );
        lamp.position.set(lx, 4.65, -4.25);
        g.add(lamp);
      }
      break;
    }

    /* 26. POWER SUBSTATION TOWERS & WATERWORKS PIPES */
    case 'power-substation-waterworks': {
      // High-voltage ceramic insulator towers & overhead power cables
      for (const tx of [-8.4, 0, 8.4]) {
        addBox(g, 0.95, 5.8, 0.95, slateMat, ink, [tx, 2.9, -5.6]);
        addBox(g, 3.2, 0.26, 0.35, slateMat, ink, [tx, 5.1, -5.6]);
        for (const ix of [-1.2, 1.2]) {
          addCyl(g, 0.2, 0.26, 0.85, 10, accentMat, ink, [tx + ix, 5.55, -5.6]);
        }
      }
      // Thick blue waterworks pressure pipes along rear yard
      addCyl(g, 0.45, 0.45, 22, 12, materials.createToonMaterial(0x0284c7), ink, [0, 1.25, -5.2], [0, 0, Math.PI / 2]);
      break;
    }

    /* 27. PHARMACY DISPENSARY WINDOW & GREEN CROSS */
    case 'pharmacy-prescription-lab': {
      addBox(g, 24, 5.4, 0.5, materials.createToonMaterial(0xf8fafc), ink, [0, 2.7, -5.6]);
      // Illuminated emerald Pharmacy Cross sign
      const greenCross = new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false });
      addBox(g, 0.44, 1.48, 0.14, greenCross, ink, [0, 3.9, -5.26]);
      addBox(g, 1.48, 0.44, 0.14, greenCross, ink, [0, 3.9, -5.26]);
      // Stocked medicine shelves flanking dispensary window
      for (const side of [-1, 1]) {
        addBox(g, 4.6, 3.6, 0.65, marbleMat, ink, [side * 7.6, 1.8, -5.15]);
        for (let r = 0; r < 3; r++) {
          for (let b = 0; b < 5; b++) {
            addCyl(g, 0.16, 0.16, 0.42, 10, materials.createToonMaterial(b % 2 === 0 ? 0xd97706 : 0x38bdf8), ink, [side * (5.8 + b * 0.85), 0.72 + r * 1.05, -4.75]);
          }
        }
      }
      break;
    }

    /* 28. LOGISTICS WAREHOUSE HIGH-BAY PALLET RACKS */
    case 'warehouse-forklift-bay':
    default: {
      addBox(g, 24, 5.6, 0.5, slateMat, ink, [0, 2.8, -5.8]);
      // Towering orange-and-blue steel warehouse pallet racks loaded with cardboard shipping boxes
      const orangeRack = materials.createToonMaterial(0xea580c);
      const boxBrown = materials.createToonMaterial(0xd97706);
      for (const rx of [-8.0, 0, 8.0]) {
        addBox(g, 0.24, 4.8, 1.2, materials.createToonMaterial(0x1d4ed8), ink, [rx - 2.2, 2.4, -5.0]);
        addBox(g, 0.24, 4.8, 1.2, materials.createToonMaterial(0x1d4ed8), ink, [rx + 2.2, 2.4, -5.0]);
        for (let level = 0; level < 3; level++) {
          const ly = 0.25 + level * 1.5;
          addBox(g, 4.6, 0.16, 1.22, orangeRack, ink, [rx, ly, -5.0]);
          for (let b = -1; b <= 1; b++) {
            addBox(g, 1.15, 0.92, 0.96, boxBrown, ink, [rx + b * 1.35, ly + 0.54, -5.0]);
          }
        }
      }
      break;
    }
  }

  return {
    group: g,
    animate: (t, prog, alert) => {
      for (const fn of anims) fn(t, prog, alert);
    },
  };
}

/**
 * Builds the unmistakable real-world architectural backdrop for all 29 non-process-hollowing
 * MALWARE 3D worlds (mounted cleanly behind the existing bespoke foreground stage).
 */
export function buildRealWorldMalwareBackdrop(
  setKind: SpatialSetArchetype,
  materials: AnimeMaterialLibrary,
  accentHex: number,
  secondaryHex: number
): BuiltMalwareBackdrop {
  const built = buildRealWorldBackdropStructure(setKind, materials, accentHex, secondaryHex);
  built.group.position.set(0, -0.1, -1.45);
  return built;
}

/**
 * Builds the complete real-world ground/terrain + architectural environment for all 28 places.
 */
export function buildSpatialSetArchitecture(
  setKind: SpatialSetArchetype,
  materials: AnimeMaterialLibrary,
  accentHex: number,
  secondaryHex: number,
  _wallHex: number,
  isMemory: boolean
): BuiltSpatialArchitecture {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;

  // 1. Place-Authentic Floor / Outdoor Terrain (disjoint Y offsets >= 0.03 to eliminate any Z-fighting!)
  const isOutdoor =
    setKind === 'city-park-fountain' ||
    setKind === 'city-highway-toll-plaza' ||
    setKind === 'city-street-intersection' ||
    setKind === 'airport-terminal-gate' ||
    setKind === 'shipping-port-container-yard' ||
    setKind === 'power-substation-waterworks' ||
    setKind === 'border-passport-control';

  const floorW = isOutdoor ? 42 : 28;
  const floorD = isOutdoor ? 24 : 16;

  let floorColor = 0x334155;
  switch (setKind) {
    case 'city-park-fountain':
      floorColor = 0x15803d; // Lush park grass
      break;
    case 'city-highway-toll-plaza':
    case 'city-street-intersection':
    case 'airport-terminal-gate':
    case 'border-passport-control':
      floorColor = 0x1e293b; // Dark asphalt / tarmac
      break;
    case 'bank-branch-vault':
    case 'grand-hotel-lobby':
    case 'museum-gallery-hall':
    case 'courthouse-notary-hall':
      floorColor = 0xe2e8f0; // Polished marble floor
      break;
    case 'supermarket-retail-store':
    case 'hospital-triage-ward':
    case 'pharmacy-prescription-lab':
      floorColor = 0xf1f5f9; // Clean bright retail/clinic tile
      break;
    case 'public-library-archive':
    case 'coffee-shop-cafe':
    case 'university-exam-hall':
      floorColor = 0x92400e; // Warm hardwood floor
      break;
    case 'cinema-theater-stage':
      floorColor = 0x881337; // Plush crimson cinema carpet
      break;
    case 'shipping-port-container-yard':
      floorColor = 0x0369a1; // Deep harbor ocean water beneath concrete pier
      break;
    case 'office-building-reception':
    case 'apartment-lobby-intercom':
      floorColor = 0xcbd5e1; // Light architectural stone lobby
      break;
    default:
      floorColor = 0x334155; // Industrial concrete deck
      break;
  }

  const baseFloor = addBox(
    g,
    floorW,
    0.44,
    floorD,
    materials.createToonMaterial(floorColor),
    ink,
    [0, -0.22, 0],
    undefined,
    true
  );
  baseFloor.receiveShadow = true;

  // Distinct surface markings / pathways seated cleanly at y = +0.03 (zero Z-fighting!)
  if (setKind === 'city-park-fountain') {
    // Cream stone park footpath + central circular plaza
    addBox(g, 24, 0.06, 3.6, materials.createToonMaterial(0xe7e5e4), ink, [0, 0.03, 0.4]);
    addCyl(g, 3.8, 3.9, 0.07, 20, materials.createToonMaterial(0xd6d3d1), ink, [0, 0.035, 0.2]);
  } else if (setKind === 'city-highway-toll-plaza') {
    // Yellow dashed highway lane dividers + white shoulder lines
    const yellowLine = materials.createToonMaterial(0xfacc15);
    const whiteLine = materials.createToonMaterial(0xf8fafc);
    for (let x = -14; x <= 14; x += 2.6) {
      addBox(g, 1.4, 0.04, 0.16, yellowLine, ink, [x, 0.03, 0.2]);
      addBox(g, 1.4, 0.04, 0.14, whiteLine, ink, [x, 0.03, -2.5]);
      addBox(g, 1.4, 0.04, 0.14, whiteLine, ink, [x, 0.03, 2.9]);
    }
  } else if (setKind === 'city-street-intersection') {
    // Concrete sidewalk curb along rear + bold white zebra crosswalk stripes!
    addBox(g, 34, 0.16, 4.2, materials.createToonMaterial(0xcbd5e1), ink, [0, 0.08, -4.4]);
    const whiteStripe = materials.createToonMaterial(0xf8fafc);
    for (let z = -1.6; z <= 2.6; z += 0.85) {
      addBox(g, 3.2, 0.04, 0.42, whiteStripe, ink, [0, 0.03, z]);
    }
  } else if (setKind === 'airport-terminal-gate') {
    // Airport runway dashed centerline & yellow taxiway guide lines
    const white = materials.createToonMaterial(0xf8fafc);
    const yellow = materials.createToonMaterial(0xfacc15);
    for (let x = -14; x <= 14; x += 3.2) {
      addBox(g, 1.8, 0.04, 0.28, white, ink, [x, 0.03, 1.4]);
    }
    addBox(g, 30, 0.04, 0.18, yellow, ink, [0, 0.03, -2.2]);
  } else if (setKind === 'shipping-port-container-yard') {
    // Concrete harbor dock pier sitting above ocean water + yellow hazard edge
    addBox(g, 24, 0.48, 12.6, materials.createToonMaterial(0x475569), ink, [0, 0.06, -1.2], undefined, true);
    addBox(
      g,
      24,
      0.1,
      0.38,
      materials.createToonMaterial(0xfacc15, { map: materials.hazardStripeTexture }),
      ink,
      [0, 0.32, 4.95]
    );
  } else if (setKind === 'grand-hotel-lobby' || setKind === 'cinema-theater-stage') {
    // Red velvet VIP runner carpet down the center aisle
    addBox(g, 22, 0.05, 3.2, materials.createToonMaterial(0xbe123c), ink, [0, 0.03, 0.6]);
    addBox(g, 22, 0.06, 0.14, materials.createToonMaterial(0xfacc15), ink, [0, 0.04, 2.2]);
    addBox(g, 22, 0.06, 0.14, materials.createToonMaterial(0xfacc15), ink, [0, 0.04, -1.0]);
  } else if (setKind === 'subway-metro-station' || setKind === 'train-station-platform') {
    // Yellow tactile platform safety edge line
    addBox(g, 26, 0.05, 0.36, materials.createToonMaterial(0xfacc15), ink, [0, 0.03, 3.4]);
  } else if (setKind === 'restaurant-kitchen-drivethru') {
    // Checkered diner/kitchen floor accents
    const darkTile = materials.createToonMaterial(0x1e293b);
    for (let x = -8; x <= 8; x += 2.6) {
      addBox(g, 1.2, 0.04, 1.2, darkTile, ink, [x, 0.03, 1.2]);
      addBox(g, 1.2, 0.04, 1.2, darkTile, ink, [x + 1.3, 0.03, -0.4]);
    }
  } else if (isMemory) {
    // Clean split comparison divider bar
    addBox(
      g,
      0.24,
      0.08,
      12.4,
      new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false }),
      ink,
      [0, 0.04, 0]
    );
  } else {
    // Subtle architectural floor trim band
    addBox(
      g,
      24,
      0.04,
      0.22,
      materials.createToonMaterial(accentHex, { emissive: accentHex, emissiveIntensity: 0.35 }),
      ink,
      [0, 0.03, 3.8]
    );
  }

  // 2. Real-World Architectural Vista & Landmarks behind the stage
  const backdrop = buildRealWorldBackdropStructure(setKind, materials, accentHex, secondaryHex);
  g.add(backdrop.group);

  // Subtle floor elevation for pier dock
  const yFloor = setKind === 'shipping-port-container-yard' ? 0.3 : 0;

  return {
    group: g,
    leftPropPos: [-4.65, yFloor, -0.45],
    rightPropPos: [4.65, yFloor, -0.45],
    leftPlaquePos: [-4.65, yFloor, 3.25],
    rightPlaquePos: [4.65, yFloor, 3.25],
    heroCenterPos: [0, yFloor, -1.65],
    boardPos: [0, 5.15, -4.15],
    animate: (t, prog, alert) => {
      backdrop.animate(t, prog, alert);
    },
  };
}
