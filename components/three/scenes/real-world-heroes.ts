import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { HeroKineticMechanism } from '@/lib/scenario-cinema-profiles-core';

export interface BuiltHeroKinetic {
  group: THREE.Group;
  animate: (
    timeSec: number,
    progress: number,
    cutaway: number,
    alert: boolean
  ) => void;
}

function addBox(
  parent: THREE.Object3D,
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  ink: THREE.LineBasicMaterial,
  pos: [number, number, number],
  rot?: [number, number, number]
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  addAnimeInkEdges(m, ink, 22);
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
 * Helper to build a sleek 3D anime car (sedan or yellow city taxi) pivoted at bottom-center (y = 0).
 */
function buildMiniVehicle(
  materials: AnimeMaterialLibrary,
  bodyHex: number,
  accentHex: number,
  isTaxi: boolean
): { group: THREE.Group; wheels: THREE.Mesh[] } {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;
  const bodyMat = materials.createToonMaterial(bodyHex);
  const darkMat = materials.createToonMaterial(0x1e293b);
  const glassMat = materials.createToonMaterial(0xbae6fd, {
    emissive: 0x38bdf8,
    emissiveIntensity: 0.25,
  });
  const wheelMat = materials.createToonMaterial(0x0f172a);
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, toneMapped: false });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false });

  // Lower chassis
  addBox(g, 2.3, 0.56, 1.12, bodyMat, ink, [0, 0.54, 0]);
  // Cabin
  addBox(g, 1.24, 0.46, 0.98, bodyMat, ink, [-0.1, 1.02, 0]);
  // Front & rear windshields
  addBox(g, 0.12, 0.36, 0.9, glassMat, ink, [0.54, 1.0, 0], [0, 0, 0.28]);
  addBox(g, 0.12, 0.34, 0.9, glassMat, ink, [-0.72, 1.0, 0], [0, 0, -0.24]);
  // Side window band
  addBox(g, 1.08, 0.3, 1.02, glassMat, ink, [-0.1, 1.03, 0]);
  // Bumpers
  addBox(g, 0.12, 0.18, 1.16, darkMat, ink, [1.18, 0.38, 0]);
  addBox(g, 0.12, 0.18, 1.16, darkMat, ink, [-1.18, 0.38, 0]);
  // Headlights & taillights
  for (const lz of [-0.36, 0.36]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.22), headMat);
    hl.position.set(1.16, 0.58, lz);
    g.add(hl);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.22), tailMat);
    tl.position.set(-1.16, 0.58, lz);
    g.add(tl);
  }
  if (isTaxi) {
    // Classic yellow taxi roof sign + checkered stripe
    const roofSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.18, 0.24),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, toneMapped: false })
    );
    roofSign.position.set(-0.08, 1.34, 0);
    addAnimeInkEdges(roofSign, ink, 22);
    g.add(roofSign);
    addBox(g, 2.32, 0.1, 1.14, darkMat, ink, [0, 0.56, 0]);
  } else {
    // Subtle racing/trim stripe
    addBox(g, 2.32, 0.08, 1.14, materials.createToonMaterial(accentHex), ink, [0, 0.52, 0]);
  }

  const wheels: THREE.Mesh[] = [];
  for (const [wx, wz] of [
    [0.72, 0.58],
    [0.72, -0.58],
    [-0.72, 0.58],
    [-0.72, -0.58],
  ] as const) {
    const w = addCyl(g, 0.26, 0.26, 0.18, 14, wheelMat, ink, [wx, 0.26, wz], [Math.PI / 2, 0, 0]);
    wheels.push(w);
  }
  return { group: g, wheels };
}

/**
 * Builds all 28 unmistakable, composite 3D real-world animated hero vehicles & props.
 * Every hero sits cleanly at bottom-center (y = 0) with zero single-primitive placeholders.
 */
export function buildHeroKineticMechanism(
  kind: HeroKineticMechanism,
  materials: AnimeMaterialLibrary,
  accentHex: number,
  secondaryHex: number
): BuiltHeroKinetic {
  const g = new THREE.Group();
  const ink = materials.inkLineMaterial;
  const darkMat = materials.createToonMaterial(0x1e293b);
  const steelMat = materials.createToonMaterial(0x64748b);
  const chromeMat = materials.createToonMaterial(0xe2e8f0);
  const woodMat = materials.createToonMaterial(0x7c4a26);
  const brassMat = materials.createToonMaterial(0xd97706);
  const accentMat = materials.createToonMaterial(accentHex, {
    emissive: accentHex,
    emissiveIntensity: 0.45,
  });
  const secMat = materials.createToonMaterial(secondaryHex, {
    emissive: secondaryHex,
    emissiveIntensity: 0.55,
  });
  const alertMat = new THREE.MeshBasicMaterial({
    color: secondaryHex,
    toneMapped: false,
  });

  switch (kind) {
    /* 1. BANK VAULT WHEEL DOOR */
    case 'bank-vault-wheel-door': {
      addBox(g, 3.2, 3.1, 0.55, steelMat, ink, [0, 1.55, -0.15]);
      // Inner gold bullion niche visible on cutaway
      const goldMat = materials.createToonMaterial(0xfacc15, {
        emissive: 0xf59e0b,
        emissiveIntensity: 0.35,
      });
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          addBox(g, 0.46, 0.24, 0.38, goldMat, ink, [-0.55 + c * 0.55, 0.42 + r * 0.28, -0.42]);
        }
      }
      const doorPivot = new THREE.Group();
      doorPivot.position.set(-1.1, 1.55, 0.16);
      const disc = addCyl(doorPivot, 1.15, 1.15, 0.28, 24, chromeMat, ink, [1.1, 0, 0], [Math.PI / 2, 0, 0]);
      disc.position.x = 1.1;
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(1.1, 0, 0.24);
      const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.075, 10, 24), brassMat);
      addAnimeInkEdges(wheelRim, ink, 22);
      wheelGroup.add(wheelRim);
      for (let i = 0; i < 6; i++) {
        const spoke = addBox(wheelGroup, 0.08, 1.2, 0.07, brassMat, ink, [0, 0, 0], [0, 0, (i / 6) * Math.PI]);
        spoke.scale.setScalar(1);
      }
      addCyl(wheelGroup, 0.18, 0.18, 0.18, 12, secMat, ink, [0, 0, 0.04], [Math.PI / 2, 0, 0]);
      doorPivot.add(wheelGroup);
      g.add(doorPivot);
      return {
        group: g,
        animate: (t, prog, cut, alert) => {
          wheelGroup.rotation.z = t * (alert ? 3.2 : 1.1);
          doorPivot.rotation.y = -THREE.MathUtils.lerp(0.05, 1.15, Math.max(cut * 0.8, prog > 0.4 ? 0.75 : 0.1));
        },
      };
    }

    /* 2. OFFICE RECEPTIONIST & GLASS TURNSTILE */
    case 'office-reception-turnstile': {
      // Curved/wide modern reception desk
      addBox(g, 3.4, 1.05, 0.95, materials.createToonMaterial(0xf8fafc), ink, [0, 0.525, -0.35]);
      addBox(g, 3.5, 0.12, 1.08, woodMat, ink, [0, 1.08, -0.35]);
      addBox(g, 3.2, 0.09, 0.08, accentMat, ink, [0, 0.84, 0.14]);
      // Desktop computer monitor + keyboard on desk
      addBox(g, 0.72, 0.44, 0.07, darkMat, ink, [-0.55, 1.46, -0.32]);
      addBox(g, 0.62, 0.34, 0.08, accentMat, ink, [-0.55, 1.46, -0.31]);
      addBox(g, 0.14, 0.16, 0.14, steelMat, ink, [-0.55, 1.18, -0.34]);
      // Receptionist figure behind desk
      const receptionist = new THREE.Group();
      receptionist.position.set(0.55, 0.92, -0.68);
      addBox(receptionist, 0.52, 0.62, 0.32, materials.createToonMaterial(0x2563eb), ink, [0, 0.36, 0]);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 14, 12),
        materials.createToonMaterial(0xfde68a)
      );
      head.position.set(0, 0.88, 0);
      addAnimeInkEdges(head, ink, 24);
      receptionist.add(head);
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.255, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58),
        darkMat
      );
      hair.position.set(0, 0.91, -0.02);
      receptionist.add(hair);
      const armPivot = new THREE.Group();
      armPivot.position.set(-0.32, 0.56, 0.05);
      addBox(armPivot, 0.14, 0.44, 0.14, materials.createToonMaterial(0x2563eb), ink, [0, -0.18, 0.08]);
      receptionist.add(armPivot);
      g.add(receptionist);

      // Stainless-steel badge turnstile gate in front-right
      addBox(g, 0.32, 0.96, 1.1, chromeMat, ink, [1.85, 0.48, 0.65]);
      addBox(g, 0.32, 0.96, 1.1, chromeMat, ink, [2.95, 0.48, 0.65]);
      const flapL = addBox(g, 0.46, 0.52, 0.06, accentMat, ink, [2.16, 0.58, 0.65]);
      const flapR = addBox(g, 0.46, 0.52, 0.06, accentMat, ink, [2.64, 0.58, 0.65]);
      const badgeReader = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.18), alertMat);
      badgeReader.position.set(1.85, 1.0, 0.98);
      g.add(badgeReader);

      return {
        group: g,
        animate: (t, prog, _cut, alert) => {
          head.rotation.y = Math.sin(t * 1.8) * 0.25;
          armPivot.rotation.x = -0.5 + Math.sin(t * 3.2) * 0.35;
          const openAmt = prog > 0.32 ? 0.24 : 0;
          flapL.position.x = 2.16 - openAmt;
          flapR.position.x = 2.64 + openAmt;
          badgeReader.scale.setScalar(alert ? 1.15 + Math.sin(t * 8) * 0.15 : 1);
        },
      };
    }

    /* 3. COMMERCIAL PASSENGER AIRPLANE ON TARMAC */
    case 'commercial-passenger-airplane': {
      const plane = new THREE.Group();
      plane.position.set(0, 1.35, 0);
      const whiteMat = materials.createToonMaterial(0xf8fafc);
      const tailMat = materials.createToonMaterial(accentHex);
      const windowBandMat = materials.createToonMaterial(0x0f172a);
      const engineGlow = new THREE.MeshBasicMaterial({ color: secondaryHex, toneMapped: false });

      // Main cylindrical fuselage + tapered nose cone + tail cone
      addCyl(plane, 0.44, 0.44, 3.6, 16, whiteMat, ink, [0, 0, 0], [0, 0, Math.PI / 2]);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.95, 16), whiteMat);
      nose.rotation.z = -Math.PI / 2;
      nose.position.set(2.26, 0, 0);
      addAnimeInkEdges(nose, ink, 24);
      plane.add(nose);
      const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.9, 16), whiteMat);
      tailCone.rotation.z = Math.PI / 2;
      tailCone.position.set(-2.22, 0.06, 0);
      addAnimeInkEdges(tailCone, ink, 24);
      plane.add(tailCone);

      // Cockpit windshield & passenger window strip
      addBox(plane, 0.46, 0.18, 0.56, windowBandMat, ink, [1.72, 0.18, 0], [0, 0, -0.2]);
      addBox(plane, 2.65, 0.12, 0.9, windowBandMat, ink, [0.1, 0.12, 0]);
      // Livery accent stripe
      addBox(plane, 3.3, 0.08, 0.91, tailMat, ink, [-0.05, -0.02, 0]);

      // Swept Main Wings
      addBox(plane, 1.05, 0.1, 2.35, chromeMat, ink, [0.1, -0.08, 1.42], [0, -0.34, 0]);
      addBox(plane, 1.05, 0.1, 2.35, chromeMat, ink, [0.1, -0.08, -1.42], [0, 0.34, 0]);
      // Twin under-wing turbofan engines
      for (const ez of [-1.05, 1.05]) {
        addCyl(plane, 0.22, 0.2, 0.82, 14, steelMat, ink, [0.35, -0.32, ez], [0, 0, Math.PI / 2]);
        const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 12), engineGlow);
        intake.rotation.z = Math.PI / 2;
        intake.position.set(0.76, -0.32, ez);
        plane.add(intake);
      }
      // Tall vertical tail fin + horizontal stabilizers
      addBox(plane, 0.92, 1.08, 0.12, tailMat, ink, [-1.92, 0.68, 0], [0, 0, 0.28]);
      addBox(plane, 0.56, 0.08, 1.65, chromeMat, ink, [-2.08, 0.14, 0]);

      // Blinking wingtip beacons
      const beaconL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0xef4444, toneMapped: false }));
      beaconL.position.set(-0.28, -0.04, 2.52);
      plane.add(beaconL);
      const beaconR = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false }));
      beaconR.position.set(-0.28, -0.04, -2.52);
      plane.add(beaconR);

      // Landing gear struts
      for (const [gx, gz] of [
        [1.45, 0],
        [-0.1, 0.58],
        [-0.1, -0.58],
      ] as const) {
        addCyl(plane, 0.05, 0.05, 0.55, 8, darkMat, ink, [gx, -0.64, gz]);
        addCyl(plane, 0.15, 0.15, 0.12, 12, darkMat, ink, [gx, -0.92, gz], [Math.PI / 2, 0, 0]);
      }
      g.add(plane);

      // Airport taxiway beacon markings on floor
      addBox(g, 4.4, 0.06, 0.18, materials.createToonMaterial(0xfacc15), ink, [0, 0.04, 0]);

      return {
        group: g,
        animate: (t, prog, _cut, alert) => {
          const lift = Math.sin(prog * Math.PI) * 0.55;
          plane.position.y = 1.15 + lift + Math.sin(t * 2.1) * 0.08;
          plane.rotation.z = lift * 0.16;
          plane.position.x = Math.sin(t * 0.9) * 0.55;
          const pulse = Math.sin(t * (alert ? 12 : 5)) > 0 ? 1.35 : 0.7;
          beaconL.scale.setScalar(pulse);
          beaconR.scale.setScalar(pulse);
        },
      };
    }

    /* 4. SUPERMARKET SHOPPING CART & CHECKOUT SCANNER */
    case 'supermarket-checkout-cart': {
      // Checkout belt counter beside cart
      addBox(g, 2.8, 0.88, 1.05, materials.createToonMaterial(0xf1f5f9), ink, [0, 0.44, -0.85]);
      addBox(g, 2.5, 0.06, 0.72, darkMat, ink, [0, 0.91, -0.85]);
      // Laser barcode scanner window glowing red
      const laserBeam = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 0.55),
        new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
          toneMapped: false,
        })
      );
      laserBeam.position.set(0.35, 1.18, -0.85);
      g.add(laserBeam);

      // Composite rolling shopping cart
      const cart = new THREE.Group();
      cart.position.set(0, 0, 0.55);
      addBox(cart, 1.55, 0.08, 0.92, chromeMat, ink, [0, 0.34, 0]);
      // Wire basket sides
      addBox(cart, 1.65, 0.72, 0.98, materials.createToonMaterial(0xcbd5e1, { transparent: true, opacity: 0.62 }), ink, [0.05, 0.95, 0]);
      // Red plastic push handle
      addCyl(cart, 0.055, 0.055, 1.02, 10, secMat, ink, [-0.88, 1.32, 0], [Math.PI / 2, 0, 0]);
      // Legs & 4 wheels
      for (const [wx, wz] of [
        [-0.62, 0.38],
        [-0.62, -0.38],
        [0.62, 0.38],
        [0.62, -0.38],
      ] as const) {
        addCyl(cart, 0.04, 0.04, 0.65, 8, steelMat, ink, [wx, 0.5, wz]);
        addCyl(cart, 0.14, 0.14, 0.09, 12, darkMat, ink, [wx, 0.14, wz], [Math.PI / 2, 0, 0]);
      }
      // Colorful grocery boxes & milk jug inside cart
      addBox(cart, 0.42, 0.52, 0.34, materials.createToonMaterial(0xf59e0b), ink, [-0.25, 1.05, 0.12]);
      addBox(cart, 0.38, 0.46, 0.32, materials.createToonMaterial(0x10b981), ink, [0.24, 1.02, -0.15]);
      addBox(cart, 0.34, 0.4, 0.34, accentMat, ink, [0.35, 0.98, 0.22]);
      g.add(cart);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          cart.position.x = Math.sin(t * 1.35) * 0.95;
          laserBeam.scale.y = alert ? 1.35 + Math.sin(t * 10) * 0.25 : 1 + Math.sin(t * 4) * 0.15;
        },
      };
    }

    /* 5. CITY PARK STONE WATER FOUNTAIN */
    case 'park-water-fountain-bench': {
      const stoneMat = materials.createToonMaterial(0xd6d3d1);
      const waterMat = materials.createToonMaterial(0x38bdf8, {
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.4,
      });
      // Outer octagonal stone basin
      addCyl(g, 1.95, 2.08, 0.58, 12, stoneMat, ink, [0, 0.29, 0]);
      // Turquoise water surface
      const waterPool = addCyl(g, 1.72, 1.72, 0.08, 16, waterMat, ink, [0, 0.55, 0]);
      // Central tiered pedestal & upper bowl
      addCyl(g, 0.34, 0.48, 1.25, 12, stoneMat, ink, [0, 1.05, 0]);
      addCyl(g, 0.98, 0.52, 0.32, 12, stoneMat, ink, [0, 1.65, 0]);
      addCyl(g, 0.22, 0.28, 0.55, 10, stoneMat, ink, [0, 2.05, 0]);

      // Animated rising water jet & splash drops
      const jet = addCyl(g, 0.14, 0.22, 0.72, 10, accentMat, ink, [0, 2.55, 0]);
      const drops: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const drop = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x7dd3fc, toneMapped: false })
        );
        drop.position.set(Math.cos(a) * 0.9, 1.5, Math.sin(a) * 0.9);
        g.add(drop);
        drops.push(drop);
      }

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          jet.scale.y = 0.85 + Math.sin(t * 6.5) * 0.25;
          waterPool.position.y = 0.55 + Math.sin(t * 3) * 0.02;
          drops.forEach((d, idx) => {
            const phase = (t * (alert ? 2.4 : 1.4) + idx / 6) % 1;
            const a = (idx / 6) * Math.PI * 2 + t * 0.4;
            const rad = 0.22 + phase * 1.25;
            d.position.set(
              Math.cos(a) * rad,
              2.55 - phase * phase * 1.95 + Math.sin(phase * Math.PI) * 0.55,
              Math.sin(a) * rad
            );
          });
        },
      };
    }

    /* 6. HIGHWAY TOLL BARRIER & COMMUTER CAR */
    case 'highway-toll-barrier-sedan': {
      // Toll booth house
      addBox(g, 1.25, 2.15, 1.2, materials.createToonMaterial(0xf8fafc), ink, [-1.95, 1.075, -0.45]);
      addBox(g, 1.48, 0.24, 1.42, accentMat, ink, [-1.95, 2.24, -0.45]);
      addBox(g, 0.88, 0.72, 1.24, materials.createToonMaterial(0xbae6fd), ink, [-1.95, 1.45, -0.45]);
      const boothBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), alertMat);
      boothBeacon.position.set(-1.95, 2.52, -0.45);
      g.add(boothBeacon);

      // Lifting red-and-white striped toll barrier arm
      const armPivot = new THREE.Group();
      armPivot.position.set(-1.25, 1.05, 0.35);
      for (let i = 0; i < 6; i++) {
        addBox(
          armPivot,
          0.46,
          0.12,
          0.1,
          materials.createToonMaterial(i % 2 === 0 ? 0xef4444 : 0xf8fafc),
          ink,
          [0.25 + i * 0.46, 0, 0]
        );
      }
      g.add(armPivot);

      const car = buildMiniVehicle(materials, accentHex, secondaryHex, false);
      car.group.position.set(0.35, 0, 0.35);
      g.add(car.group);

      return {
        group: g,
        animate: (t, prog, _cut, alert) => {
          const armOpen = prog > 0.35 || alert ? 1.12 : 0.08 + Math.sin(t * 2) * 0.05;
          armPivot.rotation.z = armOpen;
          car.group.position.x = -0.3 + Math.sin(t * 1.4) * 1.15;
          car.wheels.forEach((w) => {
            w.rotation.y = t * 5;
          });
        },
      };
    }

    /* 7. CITY STREET TRAFFIC LIGHT & YELLOW TAXI */
    case 'street-traffic-light-taxi': {
      // Tall traffic signal pole & cantilever mast
      addCyl(g, 0.11, 0.14, 3.2, 10, darkMat, ink, [-1.85, 1.6, -0.75]);
      addBox(g, 2.25, 0.14, 0.14, darkMat, ink, [-0.8, 3.1, -0.75]);
      // Traffic signal housing box
      addBox(g, 0.48, 1.24, 0.38, darkMat, ink, [0.15, 2.65, -0.75]);
      const redLamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: 0xef4444, toneMapped: false }));
      redLamp.position.set(0.15, 3.02, -0.55);
      const amberLamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15, toneMapped: false }));
      amberLamp.position.set(0.15, 2.65, -0.55);
      const greenLamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false }));
      greenLamp.position.set(0.15, 2.28, -0.55);
      g.add(redLamp, amberLamp, greenLamp);

      // Bright yellow city taxi rolling across crosswalk
      const taxi = buildMiniVehicle(materials, 0xfacc15, 0x0f172a, true);
      taxi.group.position.set(0, 0, 0.55);
      g.add(taxi.group);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          const cycle = Math.floor(t * 0.9) % 3;
          redLamp.scale.setScalar(alert || cycle === 0 ? 1.25 : 0.65);
          amberLamp.scale.setScalar(!alert && cycle === 1 ? 1.25 : 0.65);
          greenLamp.scale.setScalar(!alert && cycle === 2 ? 1.25 : 0.65);
          taxi.group.position.x = Math.sin(t * 1.3) * 1.25;
          taxi.wheels.forEach((w) => {
            w.rotation.y = t * 5.2;
          });
        },
      };
    }

    /* 8. EXPRESS TRAIN LOCOMOTIVE */
    case 'express-station-locomotive': {
      // Steel rails & wooden sleepers
      for (let i = -3; i <= 3; i++) {
        addBox(g, 0.22, 0.08, 1.65, woodMat, ink, [i * 0.68, 0.04, 0]);
      }
      addBox(g, 4.8, 0.08, 0.1, chromeMat, ink, [0, 0.11, -0.52]);
      addBox(g, 4.8, 0.08, 0.1, chromeMat, ink, [0, 0.11, 0.52]);

      const train = new THREE.Group();
      addBox(train, 3.2, 1.22, 1.22, materials.createToonMaterial(0xf8fafc), ink, [-0.15, 0.95, 0]);
      // Aerodynamic nose
      const nose = addBox(train, 0.9, 1.0, 1.18, accentMat, ink, [1.65, 0.84, 0], [0, 0, -0.28]);
      nose.scale.setScalar(1);
      // Livery stripe & passenger windows
      addBox(train, 3.25, 0.18, 1.25, secMat, ink, [-0.15, 0.68, 0]);
      for (let w = -1.1; w <= 1.0; w += 0.68) {
        addBox(train, 0.44, 0.36, 1.26, darkMat, ink, [w, 1.14, 0]);
      }
      // Roof pantograph
      addBox(train, 0.85, 0.08, 0.65, steelMat, ink, [-0.6, 1.92, 0]);
      addBox(train, 0.08, 0.42, 0.08, steelMat, ink, [-0.6, 1.72, 0], [0, 0, 0.35]);
      // Twin glowing headlamps
      for (const lz of [-0.34, 0.34]) {
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a, toneMapped: false }));
        hl.position.set(2.08, 0.65, lz);
        train.add(hl);
      }
      // Bogie wheels
      for (const wx of [-1.2, -0.55, 0.65, 1.25]) {
        addCyl(train, 0.22, 0.22, 1.26, 12, darkMat, ink, [wx, 0.28, 0], [Math.PI / 2, 0, 0]);
      }
      g.add(train);

      return {
        group: g,
        animate: (t) => {
          train.position.x = Math.sin(t * 1.15) * 0.95;
          train.position.y = Math.abs(Math.sin(t * 8)) * 0.025;
        },
      };
    }

    /* 9. SUBWAY METRO CAR WITH SLIDING DOORS */
    case 'subway-metro-turnstile-car': {
      addBox(g, 4.4, 0.1, 1.5, materials.createToonMaterial(0x334155), ink, [0, 0.05, 0]);
      addBox(g, 4.4, 0.04, 0.16, materials.createToonMaterial(0xfacc15), ink, [0, 0.11, 0.68]);

      const car = new THREE.Group();
      addBox(car, 3.6, 1.52, 1.28, chromeMat, ink, [0, 1.05, 0]);
      addBox(car, 3.64, 0.22, 1.31, accentMat, ink, [0, 0.72, 0]);
      // Warm lit interior visible behind doors
      addBox(car, 1.15, 1.08, 0.1, materials.createToonMaterial(0xfef3c7, { emissive: 0xfde68a, emissiveIntensity: 0.45 }), ink, [0, 1.05, 0.56]);
      // Sliding subway doors
      const doorL = addBox(car, 0.54, 1.08, 0.08, steelMat, ink, [-0.28, 1.05, 0.65]);
      const doorR = addBox(car, 0.54, 1.08, 0.08, steelMat, ink, [0.28, 1.05, 0.65]);
      // Side windows
      addBox(car, 0.72, 0.52, 1.32, darkMat, ink, [-1.25, 1.22, 0]);
      addBox(car, 0.72, 0.52, 1.32, darkMat, ink, [1.25, 1.22, 0]);
      // Route LED board on top
      addBox(car, 1.4, 0.24, 0.28, darkMat, ink, [0, 1.94, 0.3]);
      addBox(car, 1.24, 0.12, 0.3, alertMat, ink, [0, 1.94, 0.31]);
      g.add(car);

      return {
        group: g,
        animate: (t, prog, cut) => {
          const open = Math.max(cut * 0.45, Math.sin(prog * Math.PI) * 0.45);
          doorL.position.x = -0.28 - open;
          doorR.position.x = 0.28 + open;
          car.position.x = Math.sin(t * 0.7) * 0.25;
        },
      };
    }

    /* 10. HOSPITAL MEDICAL CRASH CART & HEART MONITOR */
    case 'hospital-triage-med-cart': {
      const cart = new THREE.Group();
      // White cabinet with crimson red drawers
      addBox(cart, 1.65, 1.25, 0.95, materials.createToonMaterial(0xf8fafc), ink, [0, 0.82, 0]);
      for (let i = 0; i < 3; i++) {
        addBox(cart, 1.42, 0.28, 0.08, secMat, ink, [0, 0.45 + i * 0.35, 0.48]);
      }
      // Red cross badge on side
      addBox(cart, 0.12, 0.46, 0.14, new THREE.MeshBasicMaterial({ color: 0xef4444, toneMapped: false }), ink, [0.85, 0.92, 0]);
      addBox(cart, 0.12, 0.14, 0.46, new THREE.MeshBasicMaterial({ color: 0xef4444, toneMapped: false }), ink, [0.85, 0.92, 0]);
      // Caster wheels
      for (const [wx, wz] of [
        [-0.68, 0.36],
        [-0.68, -0.36],
        [0.68, 0.36],
        [0.68, -0.36],
      ] as const) {
        addCyl(cart, 0.14, 0.14, 0.1, 10, darkMat, ink, [wx, 0.14, wz], [Math.PI / 2, 0, 0]);
      }
      // Top ECG heart-rate monitor
      addBox(cart, 0.88, 0.64, 0.42, darkMat, ink, [-0.15, 1.78, 0]);
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.44, 0.06),
        new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false })
      );
      screen.position.set(-0.15, 1.8, 0.21);
      cart.add(screen);
      // Tall chrome IV drip stand & glowing fluid bag
      addCyl(cart, 0.04, 0.04, 1.55, 8, chromeMat, ink, [0.68, 2.05, -0.25]);
      addBox(cart, 0.48, 0.05, 0.05, chromeMat, ink, [0.68, 2.82, -0.25]);
      addBox(cart, 0.24, 0.36, 0.12, accentMat, ink, [0.85, 2.55, -0.25]);
      g.add(cart);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          cart.position.x = Math.sin(t * 1.1) * 0.65;
          screen.scale.y = 0.9 + Math.abs(Math.sin(t * (alert ? 8 : 3.2))) * 0.22;
        },
      };
    }

    /* 11. POST OFFICE PARCEL CHUTE & ENVELOPE SORTER */
    case 'post-office-parcel-chute': {
      // Blue steel sorting table & sloped brass parcel chute
      addBox(g, 3.4, 0.88, 1.15, materials.createToonMaterial(0x1d4ed8), ink, [0, 0.44, 0]);
      addBox(g, 2.2, 0.16, 0.92, brassMat, ink, [-0.55, 1.48, 0], [0, 0, -0.34]);
      addBox(g, 1.4, 0.16, 0.92, steelMat, ink, [1.1, 1.0, 0]);
      // Overhead stamp arch
      addBox(g, 0.24, 1.35, 1.05, darkMat, ink, [0.35, 1.55, 0]);
      // Sliding parcels & sealed envelopes
      const parcels: THREE.Group[] = [];
      for (let i = 0; i < 3; i++) {
        const p = new THREE.Group();
        addBox(
          p,
          0.56,
          0.34,
          0.46,
          i === 1 ? secMat : materials.createToonMaterial(0xd97706),
          ink,
          [0, 0.17, 0]
        );
        addBox(p, 0.58, 0.06, 0.12, chromeMat, ink, [0, 0.35, 0]);
        g.add(p);
        parcels.push(p);
      }
      return {
        group: g,
        animate: (t) => {
          parcels.forEach((p, idx) => {
            const u = (t * 0.32 + idx / 3) % 1;
            const x = -1.45 + u * 3.1;
            const y = u < 0.55 ? 1.85 - u * 1.35 : 1.12;
            p.position.set(x, y, 0);
            p.rotation.z = u < 0.55 ? -0.34 : 0;
          });
        },
      };
    }

    /* 12. GRAND HOTEL BRASS KEY RACK & CONCIERGE BELL */
    case 'hotel-concierge-key-rack': {
      // Mahogany concierge desk base
      addBox(g, 3.2, 1.02, 1.0, woodMat, ink, [0, 0.51, 0.3]);
      addBox(g, 3.35, 0.12, 1.12, materials.createToonMaterial(0xfef3c7), ink, [0, 1.06, 0.3]);
      // Tall golden key-hook wall cabinet behind desk
      addBox(g, 2.75, 2.05, 0.28, woodMat, ink, [0, 2.08, -0.35]);
      const keys: THREE.Mesh[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const k = addBox(
            g,
            0.22,
            0.34,
            0.08,
            r === 1 && c === 2 ? secMat : brassMat,
            ink,
            [-0.96 + c * 0.48, 1.48 + r * 0.52, -0.16]
          );
          keys.push(k);
        }
      }
      // Classic brass concierge service bell on counter
      const bell = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
        brassMat
      );
      bell.position.set(0, 1.12, 0.55);
      addAnimeInkEdges(bell, ink, 22);
      g.add(bell);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          keys.forEach((k, i) => {
            k.rotation.z = Math.sin(t * 2.2 + i * 0.5) * 0.12;
          });
          bell.scale.setScalar(alert ? 1 + Math.abs(Math.sin(t * 10)) * 0.18 : 1);
        },
      };
    }

    /* 13. HARBOR CARGO SHIP & CRANE */
    case 'harbor-gantry-cargo-ship': {
      const ship = new THREE.Group();
      // Red lower hull + dark navy freeboard
      addBox(ship, 3.4, 0.45, 1.35, materials.createToonMaterial(0xdc2626), ink, [0, 0.26, 0]);
      addBox(ship, 3.65, 0.44, 1.42, darkMat, ink, [0.08, 0.68, 0]);
      // White bridge tower at stern
      addBox(ship, 0.78, 1.25, 1.15, materials.createToonMaterial(0xf8fafc), ink, [-1.25, 1.48, 0]);
      addBox(ship, 0.82, 0.24, 1.18, accentMat, ink, [-1.25, 1.88, 0]);
      // Stacked colorful shipping containers
      const cColors = [0x0284c7, 0xf59e0b, 0x10b981, secondaryHex];
      for (let i = 0; i < 4; i++) {
        addBox(
          ship,
          0.95,
          0.44,
          0.54,
          materials.createToonMaterial(cColors[i]),
          ink,
          [0.05 + (i % 2) * 1.05, 1.12 + Math.floor(i / 2) * 0.46, (i % 2 === 0 ? -0.32 : 0.32)]
        );
      }
      g.add(ship);

      // Swaying hoisted shipping container above deck
      const hoist = new THREE.Group();
      hoist.position.set(0.45, 2.75, 0);
      addBox(hoist, 1.15, 0.48, 0.62, secMat, ink, [0, 0, 0]);
      addCyl(hoist, 0.03, 0.03, 1.1, 6, chromeMat, ink, [-0.4, 0.75, 0]);
      addCyl(hoist, 0.03, 0.03, 1.1, 6, chromeMat, ink, [0.4, 0.75, 0]);
      g.add(hoist);

      return {
        group: g,
        animate: (t) => {
          ship.rotation.z = Math.sin(t * 1.5) * 0.04;
          ship.position.y = Math.sin(t * 1.8) * 0.06;
          hoist.position.y = 2.55 + Math.sin(t * 1.6) * 0.35;
          hoist.position.x = 0.25 + Math.cos(t * 1.1) * 0.55;
        },
      };
    }

    /* 14. FACTORY ARTICULATED ROBOT ARM */
    case 'factory-conveyor-robot-arm': {
      addCyl(g, 0.78, 0.92, 0.38, 12, darkMat, ink, [0, 0.19, 0]);
      const turret = new THREE.Group();
      turret.position.set(0, 0.38, 0);
      addCyl(turret, 0.46, 0.52, 0.52, 12, materials.createToonMaterial(0xf59e0b), ink, [0, 0.26, 0]);
      const lowerArm = new THREE.Group();
      lowerArm.position.set(0, 0.52, 0);
      addBox(lowerArm, 0.32, 1.35, 0.32, materials.createToonMaterial(0xf59e0b), ink, [0, 0.68, 0]);
      const upperArm = new THREE.Group();
      upperArm.position.set(0, 1.32, 0);
      addCyl(upperArm, 0.22, 0.22, 0.42, 12, darkMat, ink, [0, 0, 0], [Math.PI / 2, 0, 0]);
      addBox(upperArm, 1.25, 0.24, 0.24, steelMat, ink, [0.62, 0, 0]);
      // Glowing welder / gripper tip
      const spark = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), alertMat);
      spark.position.set(1.32, 0, 0);
      upperArm.add(spark);
      lowerArm.add(upperArm);
      turret.add(lowerArm);
      g.add(turret);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          turret.rotation.y = Math.sin(t * 1.15) * 0.95;
          lowerArm.rotation.z = -0.35 + Math.sin(t * 1.8) * 0.25;
          upperArm.rotation.z = -0.4 + Math.cos(t * 2.1) * 0.35;
          spark.scale.setScalar(alert ? 1.2 + Math.sin(t * 14) * 0.3 : 0.85);
        },
      };
    }

    /* 15. LIBRARY RARE-BOOK DISPLAY TABLE & BANKER LAMP */
    case 'library-rare-book-cage': {
      addBox(g, 2.9, 0.94, 1.28, woodMat, ink, [0, 0.47, 0]);
      // Open illuminated rare manuscript folio on angled lectern
      const book = new THREE.Group();
      book.position.set(-0.2, 1.14, 0.08);
      addBox(book, 0.72, 0.08, 0.92, materials.createToonMaterial(0xfef3c7), ink, [-0.36, 0.06, 0], [0.22, 0, 0.14]);
      addBox(book, 0.72, 0.08, 0.92, materials.createToonMaterial(0xfde68a), ink, [0.36, 0.06, 0], [0.22, 0, -0.14]);
      g.add(book);
      // Classic green-shaded banker's lamp
      addCyl(g, 0.18, 0.22, 0.12, 12, brassMat, ink, [1.05, 1.0, -0.2]);
      addCyl(g, 0.05, 0.05, 0.68, 8, brassMat, ink, [1.05, 1.34, -0.2]);
      addBox(g, 0.56, 0.24, 0.34, materials.createToonMaterial(0x10b981, { emissive: 0x059669, emissiveIntensity: 0.55 }), ink, [0.95, 1.72, -0.2]);
      // Protective brass vitrine bars lifting on cutaway
      const cage = new THREE.Group();
      addBox(cage, 1.78, 0.95, 1.15, materials.createToonMaterial(0xbae6fd, { transparent: true, opacity: 0.28 }), ink, [-0.2, 1.42, 0.06]);
      g.add(cage);

      return {
        group: g,
        animate: (t, _prog, cut) => {
          cage.position.y = cut * 0.75;
          book.position.y = 1.14 + Math.sin(t * 2) * 0.03;
        },
      };
    }

    /* 16. RESTAURANT KITCHEN PASS-THROUGH COUNTER & TICKET RAIL */
    case 'restaurant-kitchen-order-rail': {
      addBox(g, 3.4, 1.0, 1.15, chromeMat, ink, [0, 0.5, 0]);
      // Overhead stainless heat-lamp bar & order ticket rail
      addCyl(g, 0.06, 0.06, 1.4, 8, steelMat, ink, [-1.45, 1.65, 0]);
      addCyl(g, 0.06, 0.06, 1.4, 8, steelMat, ink, [1.45, 1.65, 0]);
      addBox(g, 3.1, 0.16, 0.32, steelMat, ink, [0, 2.38, 0]);
      // Hanging paper order tickets
      const tickets: THREE.Mesh[] = [];
      for (let i = 0; i < 5; i++) {
        const tk = addBox(
          g,
          0.28,
          0.42,
          0.04,
          i === 2 ? secMat : materials.createToonMaterial(0xfef9c3),
          ink,
          [-1.0 + i * 0.5, 2.08, 0.14]
        );
        tickets.push(tk);
      }
      // Sizzling skillet & rising steam puffs
      addCyl(g, 0.42, 0.36, 0.14, 14, darkMat, ink, [-0.35, 1.07, 0.08]);
      const steam = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 10, 8),
        materials.createToonMaterial(0xf8fafc, { transparent: true, opacity: 0.72 })
      );
      steam.position.set(-0.35, 1.45, 0.08);
      g.add(steam);
      // Serving dome cloche on right
      const cloche = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
        chromeMat
      );
      cloche.position.set(0.75, 1.02, 0.08);
      addAnimeInkEdges(cloche, ink, 22);
      g.add(cloche);

      return {
        group: g,
        animate: (t, _prog, cut) => {
          tickets.forEach((tk, i) => {
            tk.rotation.x = Math.sin(t * 2.5 + i) * 0.16;
          });
          steam.position.y = 1.35 + ((t * 0.55) % 0.65);
          steam.scale.setScalar(0.7 + ((t * 0.55) % 0.65));
          cloche.position.y = 1.02 + cut * 0.52;
        },
      };
    }

    /* 17. CINEMA THEATER PROSCENIUM & VELVET CURTAINS */
    case 'cinema-velvet-stage-curtain': {
      const velvetMat = materials.createToonMaterial(0xbe123c);
      // Raised wooden stage deck
      addBox(g, 3.9, 0.38, 1.45, woodMat, ink, [0, 0.19, 0]);
      // Proscenium frame arch & glowing movie screen behind curtains
      addBox(g, 3.6, 2.35, 0.18, darkMat, ink, [0, 1.56, -0.45]);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.15, 1.85),
        new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
      );
      screen.position.set(0, 1.56, -0.34);
      g.add(screen);
      // Top gold valance & parting crimson curtains
      addBox(g, 3.72, 0.34, 0.32, brassMat, ink, [0, 2.75, -0.1]);
      const curtainL = addBox(g, 1.68, 2.2, 0.18, velvetMat, ink, [-0.88, 1.5, -0.15]);
      const curtainR = addBox(g, 1.68, 2.2, 0.18, velvetMat, ink, [0.88, 1.5, -0.15]);

      return {
        group: g,
        animate: (t, prog, cut) => {
          const open = Math.max(cut * 0.72, Math.sin(prog * Math.PI) * 0.72);
          curtainL.scale.x = 1 - open * 0.65;
          curtainL.position.x = -0.88 - open * 0.55;
          curtainR.scale.x = 1 - open * 0.65;
          curtainR.position.x = 0.88 + open * 0.55;
          screen.scale.setScalar(0.98 + Math.sin(t * 5) * 0.015);
        },
      };
    }

    /* 18. ART MUSEUM GLASS PEDESTAL & LASER BEAMS */
    case 'museum-laser-glass-pedestal': {
      // Stepped white marble plinth
      addBox(g, 1.9, 0.24, 1.9, materials.createToonMaterial(0xe2e8f0), ink, [0, 0.12, 0]);
      addBox(g, 1.25, 1.08, 1.25, materials.createToonMaterial(0xf8fafc), ink, [0, 0.78, 0]);
      // Golden artifact rotating inside vitrine
      const artifact = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        materials.createToonMaterial(0xfacc15, { emissive: 0xf59e0b, emissiveIntensity: 0.45 })
      );
      artifact.position.set(0, 1.85, 0);
      addAnimeInkEdges(artifact, ink, 20);
      g.add(artifact);
      // Glass display hood lifting on cutaway
      const vitrine = addBox(
        g,
        1.18,
        1.12,
        1.18,
        materials.createToonMaterial(0xbae6fd, { transparent: true, opacity: 0.28 }),
        ink,
        [0, 1.88, 0]
      );
      // Crisscrossed red laser beams
      const laserMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false });
      const lasers: THREE.Mesh[] = [];
      for (const ang of [-0.55, 0.55]) {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.2, 6), laserMat);
        l.position.set(0, 1.85, 0.55);
        l.rotation.z = Math.PI / 2 + ang;
        g.add(l);
        lasers.push(l);
      }

      return {
        group: g,
        animate: (t, _prog, cut, alert) => {
          artifact.rotation.y = t * 1.4;
          artifact.position.y = 1.85 + Math.sin(t * 2.4) * 0.08;
          vitrine.position.y = 1.88 + cut * 0.85;
          lasers.forEach((l) => {
            l.visible = !alert || Math.sin(t * 14) > -0.2;
          });
        },
      };
    }

    /* 19. COURTHOUSE NOTARY WAX PRESS & SCALES */
    case 'courthouse-wax-seal-bench': {
      // Mahogany judge/notary bench
      addBox(g, 3.2, 1.05, 1.12, woodMat, ink, [0, 0.525, 0]);
      addBox(g, 1.6, 0.08, 0.92, materials.createToonMaterial(0xfef3c7), ink, [-0.45, 1.09, 0.04]);
      // Overhead brass seal embossing ram
      const ram = new THREE.Group();
      ram.position.set(-0.45, 1.92, 0.04);
      addCyl(ram, 0.28, 0.34, 0.45, 14, brassMat, ink, [0, 0, 0]);
      addCyl(ram, 0.38, 0.38, 0.1, 14, secMat, ink, [0, -0.26, 0]);
      g.add(ram);

      // Golden Scales of Justice balancing on right side of bench
      addCyl(g, 0.24, 0.32, 0.1, 12, brassMat, ink, [0.95, 1.1, 0]);
      addCyl(g, 0.06, 0.06, 1.12, 8, brassMat, ink, [0.95, 1.66, 0]);
      const balanceBeam = new THREE.Group();
      balanceBeam.position.set(0.95, 2.2, 0);
      addBox(balanceBeam, 1.18, 0.07, 0.07, brassMat, ink, [0, 0, 0]);
      addCyl(balanceBeam, 0.24, 0.14, 0.12, 12, brassMat, ink, [-0.54, -0.32, 0]);
      addCyl(balanceBeam, 0.24, 0.14, 0.12, 12, brassMat, ink, [0.54, -0.32, 0]);
      g.add(balanceBeam);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          ram.position.y = 1.62 + Math.abs(Math.sin(t * 2.4)) * 0.42;
          balanceBeam.rotation.z = Math.sin(t * 1.9) * (alert ? 0.32 : 0.14);
        },
      };
    }

    /* 20. COFFEE SHOP ESPRESSO MACHINE & STEAMING LATTE */
    case 'cafe-espresso-bar-machine': {
      // Warm wood barista counter
      addBox(g, 3.2, 1.0, 1.12, woodMat, ink, [0, 0.5, 0]);
      // Retro crimson-and-chrome espresso machine
      addBox(g, 1.48, 0.98, 0.82, materials.createToonMaterial(0xdc2626), ink, [-0.45, 1.49, -0.05]);
      addBox(g, 1.38, 0.22, 0.88, chromeMat, ink, [-0.45, 1.98, -0.02]);
      addBox(g, 1.22, 0.18, 0.36, chromeMat, ink, [-0.45, 1.12, 0.36]);
      // Coffee mug + rising steam
      addCyl(g, 0.18, 0.14, 0.26, 12, materials.createToonMaterial(0xf8fafc), ink, [0.85, 1.14, 0.18]);
      const steam = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 10, 8),
        materials.createToonMaterial(0xf8fafc, { transparent: true, opacity: 0.72 })
      );
      steam.position.set(0.85, 1.55, 0.18);
      g.add(steam);
      // Glass pastry dome
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
        materials.createToonMaterial(0xbae6fd, { transparent: true, opacity: 0.35 })
      );
      dome.position.set(0.85, 1.02, -0.22);
      g.add(dome);

      return {
        group: g,
        animate: (t) => {
          steam.position.y = 1.42 + ((t * 0.5) % 0.6);
          steam.scale.setScalar(0.65 + ((t * 0.5) % 0.6));
        },
      };
    }

    /* 21. AUTO REPAIR GARAGE HYDRAULIC CAR LIFT */
    case 'garage-hydraulic-car-lift': {
      // Twin crimson hydraulic lift posts
      for (const pz of [-0.95, 0.95]) {
        addBox(g, 0.34, 2.85, 0.34, materials.createToonMaterial(0xdc2626), ink, [0, 1.425, pz]);
        addBox(g, 0.64, 0.12, 0.64, darkMat, ink, [0, 0.06, pz]);
      }
      addBox(g, 0.24, 0.18, 2.2, darkMat, ink, [0, 2.85, 0]);
      // Lifting platform + 3D sedan raised into the air
      const liftCarriage = new THREE.Group();
      addBox(liftCarriage, 2.5, 0.14, 1.55, steelMat, ink, [0, 0.08, 0]);
      const sedan = buildMiniVehicle(materials, accentHex, secondaryHex, false);
      sedan.group.position.set(0, 0.14, 0);
      liftCarriage.add(sedan.group);
      g.add(liftCarriage);

      return {
        group: g,
        animate: (t, prog, cut) => {
          const height = 0.25 + Math.max(cut * 1.15, (0.5 + Math.sin(t * 1.2 + prog * 2) * 0.5) * 1.15);
          liftCarriage.position.y = height;
        },
      };
    }

    /* 22. UNIVERSITY EXAM PROCTOR PODIUM & TIMER */
    case 'university-proctor-podium': {
      addBox(g, 1.55, 1.38, 0.95, woodMat, ink, [0, 0.69, 0]);
      addBox(g, 1.75, 0.14, 1.12, woodMat, ink, [0, 1.42, 0.05], [0.16, 0, 0]);
      // Stacked exam booklets on podium
      for (let i = 0; i < 4; i++) {
        addBox(g, 0.58, 0.07, 0.42, materials.createToonMaterial(i === 3 ? secondaryHex : 0xf8fafc), ink, [-0.28, 1.52 + i * 0.08, 0.06]);
      }
      // Large glowing exam clock dial mounted on brass stand
      addCyl(g, 0.62, 0.62, 0.16, 20, materials.createToonMaterial(0xf8fafc), ink, [1.28, 1.95, -0.15], [Math.PI / 2, 0, 0]);
      const clockHand = new THREE.Group();
      clockHand.position.set(1.28, 1.95, -0.04);
      addBox(clockHand, 0.07, 0.46, 0.05, secMat, ink, [0, 0.2, 0]);
      g.add(clockHand);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          clockHand.rotation.z = -t * (alert ? 3.2 : 1.1);
        },
      };
    }

    /* 23. APARTMENT LOBBY INTERCOM BUZZER & GLASS DOOR */
    case 'apartment-intercom-buzzer': {
      // Brick/slate entry column with brass intercom panel
      addBox(g, 0.95, 2.35, 0.62, materials.createToonMaterial(0x9a3412), ink, [-1.15, 1.175, 0]);
      addBox(g, 0.58, 0.95, 0.1, brassMat, ink, [-1.15, 1.42, 0.34]);
      const buzzerLight = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), alertMat);
      buzzerLight.position.set(-1.15, 1.78, 0.42);
      g.add(buzzerLight);

      // Swinging lobby glass entry door in solid jamb frame
      addBox(g, 0.2, 2.55, 0.26, darkMat, ink, [-0.55, 1.275, 0]);
      addBox(g, 0.2, 2.55, 0.26, darkMat, ink, [1.35, 1.275, 0]);
      addBox(g, 2.1, 0.22, 0.28, darkMat, ink, [0.4, 2.55, 0]);
      const doorPivot = new THREE.Group();
      doorPivot.position.set(-0.45, 0, 0);
      addBox(doorPivot, 1.68, 2.4, 0.1, materials.createToonMaterial(0xbae6fd, { transparent: true, opacity: 0.48 }), ink, [0.84, 1.2, 0]);
      addBox(doorPivot, 0.08, 0.55, 0.18, brassMat, ink, [1.5, 1.12, 0.06]);
      g.add(doorPivot);

      return {
        group: g,
        animate: (t, prog, cut, alert) => {
          doorPivot.rotation.y = -Math.max(cut * 1.05, prog > 0.35 ? 0.92 : 0.1);
          buzzerLight.scale.setScalar(alert ? 1.35 + Math.sin(t * 12) * 0.25 : 1);
        },
      };
    }

    /* 24. BORDER CONTROL LUGGAGE X-RAY BELT */
    case 'border-passport-xray-gate': {
      // Conveyor belt bed
      addBox(g, 3.8, 0.65, 1.15, steelMat, ink, [0, 0.325, 0]);
      addBox(g, 3.7, 0.08, 0.96, darkMat, ink, [0, 0.69, 0]);
      // X-Ray inspection tunnel arch
      addBox(g, 1.55, 1.28, 1.22, materials.createToonMaterial(0xe2e8f0), ink, [0, 1.35, 0]);
      addBox(g, 1.6, 0.16, 1.26, accentMat, ink, [0, 1.92, 0]);
      // Overhead glowing X-ray monitor showing scan frame
      addBox(g, 0.95, 0.62, 0.16, darkMat, ink, [0, 2.42, 0.35]);
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.48, 0.06),
        new THREE.MeshBasicMaterial({ color: accentHex, toneMapped: false })
      );
      screen.position.set(0, 2.42, 0.45);
      g.add(screen);
      // Moving suitcases
      const bags: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const bag = addBox(
          g,
          0.62,
          0.44,
          0.38,
          materials.createToonMaterial(i === 1 ? secondaryHex : 0x2563eb),
          ink,
          [-1.2 + i * 1.2, 0.96, 0]
        );
        bags.push(bag);
      }
      return {
        group: g,
        animate: (t) => {
          bags.forEach((b, idx) => {
            const u = (t * 0.28 + idx / 3) % 1;
            b.position.x = -1.65 + u * 3.3;
          });
        },
      };
    }

    /* 25. BROADCAST TV STUDIO SATELLITE & ON-AIR DESK */
    case 'broadcast-studio-signal-dish': {
      // Curved news anchor desk
      addBox(g, 3.1, 0.96, 1.0, darkMat, ink, [0, 0.48, 0.25]);
      addBox(g, 3.15, 0.14, 1.06, accentMat, ink, [0, 0.98, 0.25]);
      // Glowing ON AIR red studio sign
      addBox(g, 1.42, 0.42, 0.16, darkMat, ink, [0, 2.65, -0.3]);
      const onAir = new THREE.Mesh(
        new THREE.BoxGeometry(1.26, 0.28, 0.18),
        new THREE.MeshBasicMaterial({ color: 0xef4444, toneMapped: false })
      );
      onAir.position.set(0, 2.65, -0.28);
      g.add(onAir);

      // Rotating parabolic broadcast satellite dish behind desk
      const dishPivot = new THREE.Group();
      dishPivot.position.set(0, 1.65, -0.35);
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(0.82, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42),
        chromeMat
      );
      dish.rotation.x = Math.PI * 0.65;
      addAnimeInkEdges(dish, ink, 22);
      dishPivot.add(dish);
      addCyl(dishPivot, 0.04, 0.04, 0.72, 8, secMat, ink, [0, 0.2, 0.38], [Math.PI / 2, 0, 0]);
      g.add(dishPivot);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          dishPivot.rotation.y = Math.sin(t * 1.1) * 0.85;
          onAir.scale.setScalar(alert ? 1.08 + Math.sin(t * 10) * 0.08 : 1);
        },
      };
    }

    /* 26. POWER SUBSTATION BREAKER ARM & WATER VALVE WHEEL */
    case 'substation-breaker-valve': {
      // Thick blue steel water/power manifold pipe
      addCyl(g, 0.36, 0.36, 3.6, 14, materials.createToonMaterial(0x0284c7), ink, [0, 0.95, 0], [0, 0, Math.PI / 2]);
      addBox(g, 0.52, 0.95, 0.64, darkMat, ink, [-1.4, 0.475, 0]);
      addBox(g, 0.52, 0.95, 0.64, darkMat, ink, [1.4, 0.475, 0]);
      // Spinning crimson industrial valve handwheel
      const valve = new THREE.Group();
      valve.position.set(0, 1.68, 0);
      addCyl(valve, 0.09, 0.09, 0.55, 10, chromeMat, ink, [0, -0.28, 0]);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.08, 10, 22), materials.createToonMaterial(0xef4444));
      ring.rotation.x = Math.PI / 2;
      addAnimeInkEdges(ring, ink, 22);
      valve.add(ring);
      addBox(valve, 1.06, 0.07, 0.07, materials.createToonMaterial(0xef4444), ink, [0, 0, 0]);
      addBox(valve, 0.07, 0.07, 1.06, materials.createToonMaterial(0xef4444), ink, [0, 0, 0]);
      g.add(valve);

      // High-voltage knife breaker arm on side
      const breaker = new THREE.Group();
      breaker.position.set(1.35, 1.35, 0.38);
      addBox(breaker, 0.14, 0.95, 0.12, brassMat, ink, [0, 0.45, 0]);
      addBox(breaker, 0.32, 0.16, 0.24, secMat, ink, [0, 0.94, 0]);
      g.add(breaker);

      return {
        group: g,
        animate: (t, prog, _cut, alert) => {
          valve.rotation.y = t * (alert ? 4.2 : 1.5);
          breaker.rotation.x = prog > 0.42 ? 0.85 : -0.45;
        },
      };
    }

    /* 27. PHARMACY MEDICINE BOTTLE CAROUSEL */
    case 'pharmacy-prescription-carousel': {
      addBox(g, 2.8, 0.92, 1.15, materials.createToonMaterial(0xf8fafc), ink, [0, 0.46, 0]);
      const carousel = new THREE.Group();
      carousel.position.set(0, 0.98, 0);
      addCyl(carousel, 1.05, 1.1, 0.14, 18, chromeMat, ink, [0, 0.07, 0]);
      addCyl(carousel, 0.18, 0.22, 1.05, 12, steelMat, ink, [0, 0.58, 0]);
      const amberMat = materials.createToonMaterial(0xd97706, { emissive: 0xb45309, emissiveIntensity: 0.35 });
      const whiteCap = materials.createToonMaterial(0xf8fafc);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const bx = Math.cos(a) * 0.72;
        const bz = Math.sin(a) * 0.72;
        addCyl(carousel, 0.17, 0.17, 0.44, 12, i === 0 ? secMat : amberMat, ink, [bx, 0.36, bz]);
        addCyl(carousel, 0.19, 0.19, 0.11, 12, whiteCap, ink, [bx, 0.63, bz]);
      }
      g.add(carousel);

      return {
        group: g,
        animate: (t, _prog, _cut, alert) => {
          carousel.rotation.y = t * (alert ? 2.4 : 0.95);
        },
      };
    }

    /* 28. LOGISTICS WAREHOUSE YELLOW FORKLIFT & PALLET */
    case 'warehouse-pallet-forklift':
    default: {
      const lift = new THREE.Group();
      const yellowMat = materials.createToonMaterial(0xfacc15);
      // Heavy counterweight chassis
      addBox(lift, 1.48, 0.72, 1.08, yellowMat, ink, [-0.45, 0.62, 0]);
      addBox(lift, 0.48, 0.58, 1.04, darkMat, ink, [-1.1, 0.58, 0]);
      // Overhead steel roll-cage frame & driver seat
      addBox(lift, 0.98, 0.09, 1.0, darkMat, ink, [-0.4, 1.92, 0]);
      for (const [px, pz] of [
        [-0.85, 0.46],
        [-0.85, -0.46],
        [0.05, 0.46],
        [0.05, -0.46],
      ] as const) {
        addCyl(lift, 0.045, 0.045, 0.98, 8, darkMat, ink, [px, 1.42, pz]);
      }
      // 4 rubber wheels
      for (const [wx, wz] of [
        [0.12, 0.56],
        [0.12, -0.56],
        [-0.95, 0.56],
        [-0.95, -0.56],
      ] as const) {
        addCyl(lift, 0.27, 0.27, 0.18, 12, darkMat, ink, [wx, 0.27, wz], [Math.PI / 2, 0, 0]);
      }
      // Vertical steel mast rails
      addBox(lift, 0.14, 2.45, 0.14, steelMat, ink, [0.42, 1.38, -0.34]);
      addBox(lift, 0.14, 2.45, 0.14, steelMat, ink, [0.42, 1.38, 0.34]);

      // Raising/lowering forks + wooden shipping pallet + crates
      const forks = new THREE.Group();
      forks.position.set(0.5, 0.25, 0);
      addBox(forks, 1.15, 0.07, 0.14, steelMat, ink, [0.55, 0, -0.26]);
      addBox(forks, 1.15, 0.07, 0.14, steelMat, ink, [0.55, 0, 0.26]);
      addBox(forks, 1.08, 0.14, 1.04, woodMat, ink, [0.62, 0.11, 0]);
      addBox(forks, 0.88, 0.68, 0.86, secMat, ink, [0.62, 0.52, 0]);
      lift.add(forks);
      g.add(lift);

      return {
        group: g,
        animate: (t, prog, cut) => {
          forks.position.y = 0.25 + Math.max(cut * 1.1, (0.5 + Math.sin(t * 1.6 + prog) * 0.5) * 1.1);
          lift.position.x = Math.sin(t * 0.95) * 0.55;
        },
      };
    }
  }
}
