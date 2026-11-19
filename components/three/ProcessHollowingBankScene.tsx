'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  evaluateHollowingSceneState,
  getActMidpointTime,
  HOLLOWING_STORY_ACTS,
  HollowingCameraPreset,
  HollowingCutawayMode,
  TRUCK_GARAGE_X,
} from '@/lib/process-hollowing-3d-choreography';
import {
  createAnimeMaterialLibrary,
  createAnimeSkyDome,
} from './anime-toon-materials';
import {
  buildArmoredBankTruck,
  buildHighSecurityBankEnvironment,
  buildStasisFreezeRig,
} from './hollowing-scene-builders';
import { computeFloatingCalloutLayout } from '@/lib/hollowing-3d-overlay-layout';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Tag,
  Truck,
} from 'lucide-react';

// Pre-allocated scratch vectors to guarantee zero GC allocations in the render loop
const _scratchPos = new THREE.Vector3();
const _scratchTarget = new THREE.Vector3();
const _scratchVecA = new THREE.Vector3();
const _scratchVecB = new THREE.Vector3();
const _scratchTruckAnchor = new THREE.Vector3();
const _scratchIntruderAnchor = new THREE.Vector3();

const CYCLE_DURATION_SECONDS = 26;

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export interface ProcessHollowingBankSceneProps {
  /** Optional class override for outer frame */
  className?: string;
}

export function ProcessHollowingBankScene({
  className = '',
}: ProcessHollowingBankSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const bankTruckLabelRef = useRef<HTMLDivElement | null>(null);
  const hiddenIntruderLabelRef = useRef<HTMLDivElement | null>(null);

  // React UI state (updated strictly on user action or throttled discrete timeline ticks)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeActIndex, setActiveActIndex] = useState<number>(0);
  const [timelinePct, setTimelinePct] = useState<number>(6);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [cutawayMode, setCutawayMode] = useState<HollowingCutawayMode>('AUTO');
  const [cameraPreset, setCameraPreset] =
    useState<HollowingCameraPreset>('DIRECTOR');
  const [dockExpanded, setDockExpanded] = useState<boolean>(true);
  const [isFullPage, setIsFullPage] = useState<boolean>(false);
  const [bloomEnabled, setBloomEnabled] = useState<boolean>(true);
  const [labelsEnabled, setLabelsEnabled] = useState<boolean>(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [manualOrbitActive, setManualOrbitActive] = useState<boolean>(false);

  // Mutable simulation refs read directly by the Three.js render loop (never tear down WebGL on HUD state changes)
  const simRef = useRef({
    normalizedTime: 0.04,
    isPlaying: true,
    playbackSpeed: 1,
    cutawayMode: 'AUTO' as HollowingCutawayMode,
    cameraPreset: 'DIRECTOR' as HollowingCameraPreset,
    bloomEnabled: true,
    labelsEnabled: true,
    viewportWidth: 1200,
    viewportHeight: 640,
    manualOrbit: false,
    snapCamera: true,
    isDark: false,
    elapsed: 0,
    lastUiSyncMs: 0,
    lastActIndex: 0,
    requestRender: () => {},
  });

  // Sync React controls -> mutable refs
  useEffect(() => {
    simRef.current.isPlaying = isPlaying;
    simRef.current.requestRender();
  }, [isPlaying]);

  useEffect(() => {
    simRef.current.playbackSpeed = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    simRef.current.cutawayMode = cutawayMode;
    simRef.current.requestRender();
  }, [cutawayMode]);

  useEffect(() => {
    simRef.current.bloomEnabled = bloomEnabled;
    simRef.current.requestRender();
  }, [bloomEnabled]);

  useEffect(() => {
    simRef.current.labelsEnabled = labelsEnabled;
    simRef.current.requestRender();
  }, [labelsEnabled]);

  useEffect(() => {
    simRef.current.cameraPreset = cameraPreset;
    simRef.current.manualOrbit = false;
    simRef.current.snapCamera = true;
    simRef.current.requestRender();
  }, [cameraPreset]);

  // Escape exits Full-Page view; H toggles dock; Space toggles play/pause when container focused
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullPage) {
        e.preventDefault();
        setIsFullPage(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (isFullPage && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setDockExpanded((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullPage]);

  // Mount Three.js WebGLRenderer, Japanese Anime Scene, Lighting, Shaders & Loop ONCE
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      queueMicrotask(() => {
        setWebglError('WebGL is unavailable in this browser environment.');
      });
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const isDarkNow = document.documentElement.classList.contains('dark');
    simRef.current.isDark = isDarkNow;
    renderer.toneMappingExposure = isDarkNow ? 0.96 : 1.02;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialW = Math.max(320, mountEl.clientWidth || 1200);
    const initialH = Math.max(360, mountEl.clientHeight || 640);
    simRef.current.viewportWidth = initialW;
    simRef.current.viewportHeight = initialH;
    renderer.setSize(initialW, initialH, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.dataset.testid = 'process-hollowing-3d-canvas';
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // Scene & Studio Environment Map (RoomEnvironment + PMREM on every device)
    const scene = new THREE.Scene();
    const fogColorLight = new THREE.Color(0xdfeffc);
    const fogColorDark = new THREE.Color(0x0b1024);

    scene.background = (isDarkNow ? fogColorDark : fogColorLight).clone();
    scene.fog = new THREE.FogExp2(
      isDarkNow ? fogColorDark.getHex() : fogColorLight.getHex(),
      isDarkNow ? 0.0085 : 0.0105
    );

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(
      42,
      initialW / initialH,
      0.2,
      240
    );
    const initialState = evaluateHollowingSceneState(
      simRef.current.normalizedTime
    );
    camera.position.set(...initialState.cameraPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minDistance = 5.5;
    controls.maxDistance = 42;
    controls.maxPolarAngle = Math.PI * 0.475;
    controls.minPolarAngle = 0.14;
    controls.target.set(...initialState.cameraTarget);
    controls.update();

    // Three-point Japanese Anime Lighting Rig (Warm Sun Key + Cool Sky/Ground Hemisphere + Crisp Rim)
    const hemiLight = new THREE.HemisphereLight(
      isDarkNow ? 0x3b82f6 : 0xdbeafe,
      isDarkNow ? 0x0f172a : 0x64748b,
      isDarkNow ? 0.46 : 0.92
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      isDarkNow ? 0xa5b4fc : 0xfff7ed,
      isDarkNow ? 1.15 : 1.72
    );
    keyLight.position.set(16, 26, 18);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 4;
    keyLight.shadow.camera.far = 75;
    keyLight.shadow.camera.left = -28;
    keyLight.shadow.camera.right = 28;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, isDarkNow ? 1.0 : 0.72);
    rimLight.position.set(-20, 14, -18);
    scene.add(rimLight);

    // Build Procedural Materials, Sky Dome, Environment, Armored Truck & Stasis Rig
    const mats = createAnimeMaterialLibrary(renderer);
    const sky = createAnimeSkyDome();
    sky.uniforms.uDarkMode.value = isDarkNow ? 1 : 0;
    scene.add(sky.mesh);

    const bankEnv = buildHighSecurityBankEnvironment(mats);
    scene.add(bankEnv.root);

    const truck = buildArmoredBankTruck(mats, isSoftwareGl);
    truck.root.position.set(TRUCK_GARAGE_X, 0, 0);
    scene.add(truck.root);

    const stasis = buildStasisFreezeRig(mats, TRUCK_GARAGE_X);
    scene.add(stasis.root);

    const pixelRatio = renderer.getPixelRatio();

    // Post-Processing High-Contrast Cel-Shaded Anime Bloom Pipeline (HalfFloat HDR RenderTarget)
    const composerTarget = new THREE.WebGLRenderTarget(initialW, initialH, {
      type: THREE.HalfFloatType,
      samples: isSoftwareGl ? 0 : 4,
    });
    const composer = new EffectComposer(renderer, composerTarget);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(initialW, initialH);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Half-resolution bloom on software WebGL keeps frame pacing responsive while preserving rich anime glow
    const bloomResX = isSoftwareGl ? Math.max(120, Math.floor(initialW / 2)) : initialW;
    const bloomResY = isSoftwareGl ? Math.max(120, Math.floor(initialH / 2)) : initialH;
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(bloomResX, bloomResY),
      isDarkNow ? 0.44 : 0.28, // strength
      isDarkNow ? 0.42 : 0.32, // radius
      isDarkNow ? 0.98 : 1.12 // threshold (strictly HDR selective so white armor & sky stay razor-sharp!)
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const renderFrame = () => {
      if (simRef.current.bloomEnabled) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Track theme (.dark class on <html>) live
    const syncTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      simRef.current.isDark = dark;
      renderer.toneMappingExposure = dark ? 0.96 : 1.02;
      sky.uniforms.uDarkMode.value = dark ? 1 : 0;
      const targetFog = dark ? fogColorDark : fogColorLight;
      if (scene.background instanceof THREE.Color) {
        scene.background.copy(targetFog);
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(targetFog);
        scene.fog.density = dark ? 0.0085 : 0.0105;
      }
      hemiLight.color.setHex(dark ? 0x3b82f6 : 0xdbeafe);
      hemiLight.groundColor.setHex(dark ? 0x0f172a : 0x64748b);
      hemiLight.intensity = dark ? 0.46 : 0.92;
      keyLight.color.setHex(dark ? 0xa5b4fc : 0xfff7ed);
      keyLight.intensity = dark ? 1.15 : 1.72;
      rimLight.intensity = dark ? 1.0 : 0.72;
    };

    const themeObserver = new MutationObserver(() => {
      syncTheme();
      requestRender();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Apply choreography state onto 3D rigs (zero allocations!)
    const applySceneState = (dt: number) => {
      const sim = simRef.current;
      sim.elapsed += dt;

      if (sim.isPlaying) {
        sim.normalizedTime =
          (sim.normalizedTime + (dt * sim.playbackSpeed) / CYCLE_DURATION_SECONDS) %
          1;
      }

      const st = evaluateHollowingSceneState(sim.normalizedTime, {
        cutawayMode: sim.cutawayMode,
        cameraPreset: sim.cameraPreset,
      });

      // Sky & shader clocks
      sky.uniforms.uTime.value = sim.elapsed;

      // 1. Armored Truck Position, Suspension & Wheel Spin
      truck.root.position.set(st.truckX, 0, 0);
      truck.bodyGroup.position.y = st.truckBounceY;
      for (let i = 0; i < truck.wheels.length; i += 1) {
        truck.wheels[i].rotation.z = -st.wheelSpin;
      }

      // Rear blast doors swing open cleanly (left door swings out -Y, right swings +Y)
      const doorAngle = st.rearDoorOpen * Math.PI * 0.64;
      truck.rearDoorLeftPivot.rotation.y = -doorAngle;
      truck.rearDoorRightPivot.rotation.y = doorAngle;

      // Side X-Ray Cutaway wall peels slightly upward and fades smoothly to reveal interior
      truck.cutawaySideMaterial.opacity = Math.max(
        0.04,
        1 - st.sideCutawayOpen * 0.96
      );
      truck.cutawaySidePanel.position.y = st.sideCutawayOpen * 0.28;
      truck.cutawaySidePanel.visible = st.sideCutawayOpen < 0.85;

      // Truck roof strobe beacon freezes completely during Cryo Stasis!
      const strobeBlink =
        st.stasisIntensity > 0.5
          ? 0.25
          : 0.6 + 0.6 * Math.sin(sim.elapsed * 8.5);
      for (let i = 0; i < truck.beaconLightbarMeshes.length; i += 1) {
        const mat = truck.beaconLightbarMeshes[i]
          .material as THREE.MeshToonMaterial;
        mat.emissiveIntensity = strobeBlink;
      }

      // Headlight beams brighten when moving
      for (let i = 0; i < truck.headlightBeams.length; i += 1) {
        const beamMat = truck.headlightBeams[i]
          .material as THREE.MeshBasicMaterial;
        beamMat.opacity =
          st.stasisIntensity > 0.5
            ? 0.04
            : sim.isDark
            ? 0.26
            : 0.14;
      }

      // Driver head subtle idle glance (completely frozen when stasis active)
      truck.driverHead.rotation.y =
        st.stasisIntensity > 0.5 ? 0 : Math.sin(sim.elapsed * 1.6) * 0.14;

      // 2. Legal Bank Gold Cargo Unloading (staggered per-crate arcs out the open rear doors)
      for (let i = 0; i < truck.legalCrates.length; i += 1) {
        const crate = truck.legalCrates[i];
        const staggerStart = i * 0.1;
        const localP = Math.max(
          0,
          Math.min(1, (st.legalCargoUnloaded - staggerStart) / 0.5)
        );
        const eased = localP * localP * (3 - 2 * localP);

        // Once truck leaves garage, keep unloaded crates parked in garage (convert world offset relative to truck)
        const worldDeltaX = TRUCK_GARAGE_X - st.truckX;
        _scratchVecA.copy(crate.unloadedPos);
        _scratchVecA.x += worldDeltaX;

        crate.group.position.lerpVectors(crate.insidePos, _scratchVecA, eased);
        // Parabolic lift while exiting through the rear doors
        crate.group.position.y += Math.sin(eased * Math.PI) * 0.85;
        crate.group.rotation.y = Math.sin(eased * Math.PI) * 0.35;
      }

      // 3. Covert Intruder Crew Boarding (staggered stealth run from alley into hollowed truck)
      for (let i = 0; i < truck.covertOperatives.length; i += 1) {
        const op = truck.covertOperatives[i];
        const staggerStart = i * 0.14;
        const localP = Math.max(
          0,
          Math.min(1, (st.covertCrewLoaded - staggerStart) / 0.62)
        );
        const eased = localP * localP * (3 - 2 * localP);

        op.group.position.lerpVectors(op.alleyPos, op.insidePos, eased);
        // Hop up into the armored cargo floor
        op.group.position.y += Math.sin(eased * Math.PI) * 0.52;

        // Subtle stealth arm swing while boarding
        const stride =
          localP > 0.02 && localP < 0.98
            ? Math.sin(sim.elapsed * 14 + i * 2) * 0.55
            : 0;
        op.leftArm.rotation.x = stride;
        op.rightArm.rotation.x = -stride;

        // Hide crew when waiting far before Act 4? No — keep them lurking in alley shadows from Act 1 so story reads immediately!
        op.group.visible = st.truckX < TRUCK_GARAGE_X + 0.5 || eased > 0.9;
      }

      // Covert Beacon Core crate loads right alongside the crew
      const coreP = Math.max(
        0,
        Math.min(1, (st.covertCrewLoaded - 0.18) / 0.65)
      );
      const coreEased = coreP * coreP * (3 - 2 * coreP);
      truck.beaconCoreCrate.group.position.lerpVectors(
        truck.beaconCoreCrate.alleyPos,
        truck.beaconCoreCrate.insidePos,
        coreEased
      );
      truck.beaconCoreCrate.group.position.y +=
        Math.sin(coreEased * Math.PI) * 0.65;
      truck.beaconCoreCrate.group.rotation.y = sim.elapsed * 0.9 * coreEased;

      // Interior Crimson Beacon Glow
      truck.interiorGlowLight.intensity = st.payloadGlow * 3.8;
      (
        truck.interiorBeaconGlowMesh.material as THREE.MeshBasicMaterial
      ).opacity = st.payloadGlow * (0.14 + 0.06 * Math.sin(sim.elapsed * 4.5));

      // 4. Cryo Time-Freeze Stasis Dome & Shattering Frost Shards
      stasis.domeUniforms.uTime.value = sim.elapsed;
      stasis.domeUniforms.uOpacity.value = st.stasisIntensity;
      stasis.domeMesh.visible = st.stasisIntensity > 0.01;

      const ringOpacity = st.stasisIntensity * 0.78;
      (stasis.runeRingOuter.material as THREE.MeshBasicMaterial).opacity =
        ringOpacity;
      (stasis.runeRingInner.material as THREE.MeshBasicMaterial).opacity =
        ringOpacity * 0.85;
      stasis.runeRingOuter.visible = ringOpacity > 0.01;
      stasis.runeRingInner.visible = ringOpacity > 0.01;
      stasis.runeRingOuter.rotation.z = sim.elapsed * 0.55;
      stasis.runeRingInner.rotation.z = -sim.elapsed * 0.85;

      for (let i = 0; i < stasis.frostShards.length; i += 1) {
        const shard = stasis.frostShards[i];
        if (st.stasisIntensity > 0.02) {
          shard.mesh.visible = true;
          shard.mesh.position.copy(shard.basePos);
          shard.mesh.position.y +=
            Math.sin(sim.elapsed * 2.2 + shard.phase) * 0.16;
          shard.mesh.rotation.y = sim.elapsed * 1.4 + shard.phase;
          shard.mesh.scale.setScalar(0.55 + st.stasisIntensity * 0.45);
        } else if (st.stasisShatter > 0.01 && st.stasisShatter < 0.99) {
          shard.mesh.visible = true;
          _scratchVecB.copy(shard.burstDir).multiplyScalar(st.stasisShatter);
          shard.mesh.position.copy(shard.basePos).add(_scratchVecB);
          shard.mesh.rotation.x = st.stasisShatter * 6;
          shard.mesh.rotation.y = st.stasisShatter * 8;
          shard.mesh.scale.setScalar(Math.max(0.01, 1 - st.stasisShatter));
        } else {
          shard.mesh.visible = false;
        }
      }

      // 5. Anime Speed Lines on Brake Release (Act 5)
      truck.speedLinesGroup.visible = st.brakeReleaseBoost > 0.05;
      if (truck.speedLinesGroup.visible) {
        truck.speedLinesGroup.scale.set(
          0.6 + st.brakeReleaseBoost * 0.9,
          1,
          1
        );
      }

      // 6. High-Security Bank Checkpoint: Boom Barrier, Guard Salute & CCTV Scan Tracking
      bankEnv.boomPivot.rotation.x = -st.gateBarrierLift * Math.PI * 0.46;

      // Guard raises right arm into a crisp salute when official truck approaches
      bankEnv.guardRightArmPivot.rotation.z = st.guardSalute * 2.15;
      bankEnv.guardRightArmPivot.rotation.x = -st.guardSalute * 0.45;
      (
        bankEnv.guardBadgeLight.material as THREE.MeshToonMaterial
      ).emissiveIntensity = 0.25 + st.guardSalute * 1.3;
      bankEnv.guardBadgeLight.rotation.y = sim.elapsed * 2.5;

      // Overhead gantry verification light bar shifts from idle sky-blue to vibrant emerald VERIFIED
      const signMat = bankEnv.verifiedSignMesh
        .material as THREE.MeshToonMaterial;
      signMat.color.setHex(st.cameraScanLock > 0.45 ? 0x10b981 : 0x38bdf8);
      signMat.emissive.setHex(st.cameraScanLock > 0.45 ? 0x10b981 : 0x38bdf8);
      signMat.emissiveIntensity = 0.65 + st.cameraScanLock * 0.85;

      // CCTV Security Cameras swivel smoothly (or snap immediately on Act jump) to track the armored truck's trusted license plate
      for (let i = 0; i < bankEnv.cctvHeads.length; i += 1) {
        const head = bankEnv.cctvHeads[i];
        const targetTrackX = Math.max(0, Math.min(12.5, st.truckX + 2.8));
        const dx = targetTrackX - head.position.x;
        const dz = 0 - head.position.z;
        const yaw =
          st.cameraScanLock > 0.05
            ? Math.atan2(-dz, -dx) * 0.45
            : Math.sin(sim.elapsed * 0.85 + i * 1.4) * 0.28;
        const pitch = 0.32 + st.cameraScanLock * 0.14;
        if (sim.snapCamera) {
          head.rotation.y = yaw;
          head.rotation.z = pitch;
        } else {
          head.rotation.y = THREE.MathUtils.damp(head.rotation.y, yaw, 5.5, dt);
          head.rotation.z = THREE.MathUtils.damp(head.rotation.z, pitch, 5.5, dt);
        }
        bankEnv.scanConeUniforms[i].uTime.value = sim.elapsed;
        bankEnv.scanConeUniforms[i].uTrustedLock.value = st.cameraScanLock;
      }

      // Front Door Ski-Mask Contrast Alarm Pulse (Act 1)
      const alarmFlash =
        st.frontDoorRejectPulse * (0.55 + 0.45 * Math.sin(sim.elapsed * 12));
      (
        bankEnv.frontAlarmSiren.material as THREE.MeshToonMaterial
      ).emissiveIntensity = 0.25 + alarmFlash * 1.6;
      for (let i = 0; i < bankEnv.frontAlarmBeams.length; i += 1) {
        (
          bankEnv.frontAlarmBeams[i].material as THREE.MeshBasicMaterial
        ).opacity = 0.28 + alarmFlash * 0.65;
      }

      // 7. Post-Processing Cel-Shaded Anime Bloom Dynamics
      const baseBloomStrength = sim.isDark ? 0.42 : 0.26;
      bloomPass.strength = baseBloomStrength * (0.72 + st.bloomStrength * 0.28);
      bloomPass.threshold = sim.isDark ? 0.98 : 1.12;
      bloomPass.radius = sim.isDark ? 0.42 : 0.32;

      // 8. Smooth Exponential Camera Damping (or instant snap on discrete Act/Preset/Scrub jump)
      if (!sim.manualOrbit) {
        _scratchPos.set(...st.cameraPos);
        _scratchTarget.set(...st.cameraTarget);
        if (sim.snapCamera) {
          camera.position.copy(_scratchPos);
          controls.target.copy(_scratchTarget);
          sim.snapCamera = false;
        } else {
          const lambda = isSoftwareGl ? 10.5 : 4.8;
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            _scratchPos.x,
            lambda,
            dt
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            _scratchPos.y,
            lambda,
            dt
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            _scratchPos.z,
            lambda,
            dt
          );
          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            _scratchTarget.x,
            lambda,
            dt
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            _scratchTarget.y,
            lambda,
            dt
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            _scratchTarget.z,
            lambda,
            dt
          );
        }
      } else {
        sim.snapCamera = false;
      }

      controls.update();

      // 9. Project 3D World Anchors -> Floating Translucent 'Bank Truck' & 'Hidden Intruder' Labels (zero React re-renders)
      const truckLabelEl = bankTruckLabelRef.current;
      const intruderLabelEl = hiddenIntruderLabelRef.current;
      if (truckLabelEl && intruderLabelEl) {
        if (!sim.labelsEnabled) {
          truckLabelEl.style.opacity = '0';
          intruderLabelEl.style.opacity = '0';
        } else {
          camera.updateMatrixWorld();
          truck.root.updateMatrixWorld(true);

          const vw = sim.viewportWidth;
          const vh = sim.viewportHeight;

          // Bank Truck anchor sits cleanly above the armored cab/roof
          _scratchTruckAnchor.set(st.truckX + 0.65, 3.68 + st.truckBounceY, 0);
          _scratchTruckAnchor.project(camera);
          const truckVisible =
            _scratchTruckAnchor.z >= -1 && _scratchTruckAnchor.z <= 1;
          const truckScreenX = (_scratchTruckAnchor.x * 0.5 + 0.5) * vw;
          const truckScreenY = (-_scratchTruckAnchor.y * 0.5 + 0.5) * vh;

          // Hidden Intruder anchor tracks the live covert crew (alley in Acts 1-3 -> boarding in Act 4 -> inside rear bay in Acts 5-6)
          if (st.covertCrewLoaded > 0.86) {
            _scratchIntruderAnchor.set(
              st.truckX - 1.15,
              2.62 + st.truckBounceY,
              0
            );
          } else {
            const leadOp = truck.covertOperatives[1] || truck.covertOperatives[0];
            leadOp.group.getWorldPosition(_scratchIntruderAnchor);
            _scratchIntruderAnchor.y += 1.72;
          }
          _scratchIntruderAnchor.project(camera);
          const intruderVisible =
            _scratchIntruderAnchor.z >= -1 && _scratchIntruderAnchor.z <= 1;
          const intruderScreenX = (_scratchIntruderAnchor.x * 0.5 + 0.5) * vw;
          const intruderScreenY = (-_scratchIntruderAnchor.y * 0.5 + 0.5) * vh;

          const layout = computeFloatingCalloutLayout({
            viewportWidth: vw,
            viewportHeight: vh,
            bankTruck: {
              x: truckScreenX,
              y: truckScreenY,
              visible: truckVisible,
            },
            hiddenIntruder: {
              x: intruderScreenX,
              y: intruderScreenY,
              visible: intruderVisible,
            },
          });

          if (layout.bankTruck.visible) {
            truckLabelEl.style.transform = `translate3d(${layout.bankTruck.x}px, ${layout.bankTruck.y}px, 0)`;
            truckLabelEl.style.opacity = '1';
          } else {
            truckLabelEl.style.opacity = '0';
          }

          if (layout.hiddenIntruder.visible) {
            intruderLabelEl.style.transform = `translate3d(${layout.hiddenIntruder.x}px, ${layout.hiddenIntruder.y}px, 0)`;
            intruderLabelEl.style.opacity = '1';
          } else {
            intruderLabelEl.style.opacity = '0';
          }
        }
      }

      // Throttled HUD React sync (<= 6Hz or immediately on Act transition)
      const nowMs = performance.now();
      if (
        st.activeActIndex !== sim.lastActIndex ||
        nowMs - sim.lastUiSyncMs > 180
      ) {
        sim.lastActIndex = st.activeActIndex;
        sim.lastUiSyncMs = nowMs;
        setActiveActIndex(st.activeActIndex);
        setTimelinePct(Math.round(st.normalizedTime * 100));
      }
    };

    // Frame scheduler honoring software-WebGL fenceSync (`afterDraw`) vs GPU `requestAnimationFrame`
    let disposed = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTickTime = performance.now();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 90);
      }
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.12, Math.max(0.004, (now - lastTickTime) / 1000));
      lastTickTime = now;

      renderDirty = false;
      applySceneState(dt);
      renderFrame();

      const finishCycle = () => {
        if (disposed) return;
        if (simRef.current.isPlaying) {
          tick();
        } else {
          renderBusy = false;
          if (renderDirty) {
            renderDirty = false;
            requestRender();
          }
        }
      };

      if (simRef.current.isPlaying) {
        if (isSoftwareGl) {
          afterDraw(finishCycle);
        } else {
          frameId = window.requestAnimationFrame(finishCycle);
        }
      } else {
        const donePaused = () => {
          renderBusy = false;
          if (renderDirty && !disposed) {
            renderDirty = false;
            requestRender();
          }
        };
        if (isSoftwareGl) {
          afterDraw(donePaused);
        } else {
          donePaused();
        }
      }
    }

    function requestRender() {
      if (disposed) return;
      if (simRef.current.isPlaying) {
        if (!renderBusy) {
          renderBusy = true;
          lastTickTime = performance.now();
          frameId = window.requestAnimationFrame(tick);
        } else {
          renderDirty = true;
        }
        return;
      }
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = window.requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        applySceneState(0.016);
        renderFrame();
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) {
            renderDirty = false;
            requestRender();
          }
        };
        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    simRef.current.requestRender = requestRender;

    // OrbitControls user takeover
    const handleControlsStart = () => {
      simRef.current.manualOrbit = true;
      setManualOrbitActive(true);
    };
    const handleControlsChange = () => {
      if (!simRef.current.isPlaying) {
        requestRender();
      }
    };
    controls.addEventListener('start', handleControlsStart);
    controls.addEventListener('change', handleControlsChange);

    // WebGL context loss safety
    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      setWebglError('WebGL rendering context paused. Reload or click reset to restore.');
    };
    const onContextRestored = () => {
      setWebglError(null);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      onContextRestored
    );

    // ResizeObserver for seamless full-width & full-page transitions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(240, Math.floor(entry.contentRect.width));
        const h = Math.max(280, Math.floor(entry.contentRect.height));
        simRef.current.viewportWidth = w;
        simRef.current.viewportHeight = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        bloomPass.resolution.set(
          isSoftwareGl ? Math.max(120, Math.floor(w / 2)) : w,
          isSoftwareGl ? Math.max(120, Math.floor(h / 2)) : h
        );
        requestRender();
      }
    });
    resizeObserver.observe(mountEl);

    // Kick off first draw + animation loop
    renderBusy = true;
    lastTickTime = performance.now();
    frameId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('change', handleControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored
      );

      // Dispose all geometries, materials, post-processing passes, and textures cleanly
      bloomPass.dispose();
      composer.dispose();
      composerTarget.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      mats.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSelectAct = useCallback((actIdx: number) => {
    const targetT = getActMidpointTime(actIdx);
    simRef.current.normalizedTime = targetT;
    simRef.current.manualOrbit = false;
    simRef.current.cameraPreset = 'DIRECTOR';
    simRef.current.snapCamera = true;
    setCameraPreset('DIRECTOR');
    setManualOrbitActive(false);
    setActiveActIndex(actIdx);
    setTimelinePct(Math.round(targetT * 100));
    simRef.current.requestRender();
  }, []);

  const handleScrubTimeline = useCallback((pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const t = clamped / 100;
    simRef.current.normalizedTime = t;
    simRef.current.snapCamera = true;
    const st = evaluateHollowingSceneState(t);
    setTimelinePct(clamped);
    setActiveActIndex(st.activeActIndex);
    simRef.current.requestRender();
  }, []);

  const handleRestart = useCallback(() => {
    simRef.current.normalizedTime = 0.01;
    simRef.current.manualOrbit = false;
    simRef.current.cameraPreset = 'DIRECTOR';
    simRef.current.snapCamera = true;
    setCameraPreset('DIRECTOR');
    setManualOrbitActive(false);
    setActiveActIndex(0);
    setTimelinePct(1);
    setIsPlaying(true);
    simRef.current.requestRender();
  }, []);

  const cycleCutawayMode = useCallback(() => {
    setCutawayMode((prev) =>
      prev === 'AUTO' ? 'OPEN' : prev === 'OPEN' ? 'SEALED' : 'AUTO'
    );
  }, []);

  const activeAct = HOLLOWING_STORY_ACTS[activeActIndex] || HOLLOWING_STORY_ACTS[0];

  return (
    <div
      ref={containerRef}
      data-testid="process-hollowing-3d-stage"
      data-active-act={activeAct.id}
      data-active-act-index={activeAct.index}
      data-is-playing={isPlaying ? 'true' : 'false'}
      data-cutaway-mode={cutawayMode}
      data-camera-preset={cameraPreset}
      data-is-fullpage={isFullPage ? 'true' : 'false'}
      data-bloom-enabled={bloomEnabled ? 'true' : 'false'}
      data-labels-enabled={labelsEnabled ? 'true' : 'false'}
      data-vfx-particles="302"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={
        isFullPage
          ? 'fixed inset-0 z-[95] w-screen h-screen p-2 bg-[#0B0F17] select-none'
          : `anime-3d-stage-frame w-full h-[calc(100vh-110px)] min-h-[600px] max-h-[860px] select-none ${className}`
      }
    >
      {/* Inner Anime-Inspired CSS Border & Pseudo-Element Canvas Bezel */}
      <div className="anime-3d-canvas-bezel relative w-full h-full bg-[#0B0F17]">
        {/* Isolated WebGL Canvas Mount Container */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Translucent 3D Callout Overlay: 'Bank Truck' (svchost.exe) */}
        <div
          ref={bankTruckLabelRef}
          data-testid="hollowing-3d-label-bank-truck"
          aria-hidden={!labelsEnabled}
          className="anime-floating-callout transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          <div className="anime-floating-callout-card bg-slate-950/72 border-sky-400/85 text-sky-400">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span className="text-[11.5px] font-extrabold tracking-normal text-white">
                Bank Truck
              </span>
            </div>
            <div className="text-[9.5px] font-mono font-semibold text-sky-200/95 leading-tight mt-0.5">
              Trusted Host · svchost.exe
            </div>
          </div>
        </div>

        {/* Floating Translucent 3D Callout Overlay: 'Hidden Intruder' (Cobalt Strike Payload) */}
        <div
          ref={hiddenIntruderLabelRef}
          data-testid="hollowing-3d-label-hidden-intruder"
          aria-hidden={!labelsEnabled}
          className="anime-floating-callout transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          <div className="anime-floating-callout-card bg-slate-950/74 border-rose-500/85 text-rose-400">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[11.5px] font-extrabold tracking-normal text-white">
                Hidden Intruder
              </span>
            </div>
            <div className="text-[9.5px] font-mono font-semibold text-rose-200/95 leading-tight mt-0.5">
              Covert Payload · Beacon PE
            </div>
          </div>
        </div>

        {/* Fallback when WebGL unavailable */}
        {webglError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
            <div className="max-w-md space-y-2 border-2 border-sky-400 bg-slate-900 p-5 rounded-xl">
              <div className="font-mono text-xs font-bold text-sky-400">
                3D ANIME SCENE FALLBACK
              </div>
              <p className="text-sm font-semibold">{webglError}</p>
              <p className="text-xs text-slate-400">
                The armored bank truck analogy illustrates how svchost.exe is
                suspended, hollowed, loaded with covert code, and resumed while
                keeping its trusted identity.
              </p>
            </div>
          </div>
        )}

        {/* Top-Left Compact Anime Storyboard Caption (Solid rgba, NO backdrop-blur over WebGL) */}
      <div
        data-testid="hollowing-3d-story-caption"
        className="pointer-events-auto absolute top-3 left-3 z-20 max-w-[min(368px,52vw)] rounded-xl bg-white/95 dark:bg-slate-950/94 border-2 border-slate-900 dark:border-slate-700 shadow-[3px_3px_0px_#0F172A] px-3 py-2 text-left space-y-1"
      >
        <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono font-bold">
          <span
            style={{ backgroundColor: activeAct.accentHex }}
            className="px-1.5 py-0.5 rounded text-slate-950 font-extrabold"
          >
            ACT 0{activeAct.index + 1} / 06
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            {activeAct.stageTag}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            ·
          </span>
          <span className="text-rose-600 dark:text-rose-400">
            {activeAct.mitreCode}
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-950 dark:text-white leading-snug">
          {activeAct.title}
        </h3>

        <p className="text-[11.5px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
          &ldquo;{activeAct.storyExcerpt}&rdquo;
        </p>

        <div className="pt-1 border-t border-slate-200 dark:border-slate-800 text-[10.5px] font-mono text-indigo-700 dark:text-sky-300 leading-snug">
          {activeAct.technicalParallel}
        </div>
      </div>

      {/* Top-Right Compact Viewport Actions (X-Ray Cutaway + Full Page Expand) */}
      <div className="pointer-events-auto absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
        <button
          type="button"
          data-testid="hollowing-3d-cutaway-btn"
          onClick={cycleCutawayMode}
          aria-label={`Toggle armored truck cutaway view, currently ${cutawayMode}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-600 text-[11px] font-mono font-bold shadow-[2px_2px_0px_#0F172A] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            cutawayMode === 'OPEN'
              ? 'bg-rose-600 text-white'
              : cutawayMode === 'SEALED'
              ? 'bg-slate-800 text-slate-100'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-sky-50 dark:hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span>Cutaway: {cutawayMode}</span>
        </button>

        <button
          type="button"
          data-testid="hollowing-3d-fullpage-btn"
          onClick={() => setIsFullPage((prev) => !prev)}
          aria-label={isFullPage ? 'Exit full page 3D view' : 'Expand 3D scene to full page'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-mono font-extrabold shadow-[2px_2px_0px_#0F172A] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isFullPage ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 shrink-0" />
              <span>Exit Full Page</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              <span>Full Page</span>
            </>
          )}
        </button>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Zero Center Occlusion) */}
      <div
        data-testid="hollowing-3d-bottom-dock"
        className="pointer-events-none absolute inset-x-0 bottom-3.5 z-20 flex flex-col items-center px-3"
      >
        {/* Collapse / Expand Toggle Handle */}
        <button
          type="button"
          data-testid="hollowing-3d-dock-toggle-btn"
          onClick={() => setDockExpanded((prev) => !prev)}
          aria-expanded={dockExpanded}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg rounded-b-md bg-slate-950/92 hover:bg-slate-900 text-slate-100 border border-slate-700 text-[10.5px] font-mono font-bold transition-colors cursor-pointer"
        >
          {dockExpanded ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Controls</span>
            </>
          )}
        </button>

        {dockExpanded && (
          <div className="pointer-events-auto w-full max-w-[960px] rounded-xl bg-white/95 dark:bg-slate-950/94 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_#0F172A] px-3.5 py-2.5 space-y-2">
            {/* Row 1: 6-Act Story Buttons + Scrub Slider */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  data-testid="hollowing-3d-play-btn"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  aria-label={isPlaying ? 'Pause 3D animation' : 'Play 3D animation'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isPlaying
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-slate-900'
                      : 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-800'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 shrink-0" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 shrink-0" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  data-testid="hollowing-3d-restart-btn"
                  onClick={handleRestart}
                  aria-label="Restart 3D animation from Act 1"
                  className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6 Interactive Story Act Steps */}
              <div
                className="flex items-center gap-1 flex-wrap"
                role="tablist"
                aria-label="Story Acts"
              >
                {HOLLOWING_STORY_ACTS.map((act) => {
                  const isCurrent = act.index === activeActIndex;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      data-testid={`hollowing-3d-act-btn-${act.index + 1}`}
                      onClick={() => handleSelectAct(act.index)}
                      className={`px-2 py-1 rounded-md text-[10.5px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isCurrent
                          ? 'bg-slate-950 dark:bg-sky-400 text-white dark:text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {act.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Speed Multiplier */}
              <div className="flex items-center gap-1 shrink-0">
                {[0.5, 1, 1.5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-1 rounded text-[10px] font-mono font-bold tabular-nums transition-colors cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Timeline Scrubber + Camera Viewpoints */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <label
                  htmlFor="hollowing-3d-timeline-range"
                  className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums shrink-0"
                >
                  {timelinePct}%
                </label>
                <input
                  id="hollowing-3d-timeline-range"
                  data-testid="hollowing-3d-timeline-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={timelinePct}
                  onChange={(e) => handleScrubTimeline(Number(e.target.value))}
                  aria-label="Scrub 3D animation timeline"
                  className="w-full h-1.5 accent-rose-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1 flex-wrap shrink-0">
                <Camera className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-0.5 shrink-0" />
                {(
                  [
                    ['DIRECTOR', manualOrbitActive ? 'Re-Center' : 'Director'],
                    ['GARAGE', 'Garage'],
                    ['INTERIOR', 'Cargo Bay'],
                    ['GATE', 'Bank Gate'],
                  ] as const
                ).map(([presetId, label]) => {
                  const isActive =
                    cameraPreset === presetId && !manualOrbitActive;
                  return (
                    <button
                      key={presetId}
                      type="button"
                      data-testid={`hollowing-3d-cam-${presetId.toLowerCase()}`}
                      onClick={() => {
                        setCameraPreset(presetId);
                        simRef.current.cameraPreset = presetId;
                        simRef.current.manualOrbit = false;
                        simRef.current.snapCamera = true;
                        setManualOrbitActive(false);
                        simRef.current.requestRender();
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
                {/* Floating 3D Callout Labels Toggle */}
                <button
                  type="button"
                  data-testid="hollowing-3d-labels-btn"
                  onClick={() => setLabelsEnabled((prev) => !prev)}
                  aria-pressed={labelsEnabled}
                  aria-label={`Toggle floating 3D component labels, currently ${labelsEnabled ? 'on' : 'off'}`}
                  className={`inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    labelsEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Tag className="w-3 h-3 shrink-0" />
                  <span>Labels {labelsEnabled ? 'ON' : 'OFF'}</span>
                </button>
                {/* Post-Processing Cel-Shaded Bloom Toggle */}
                <button
                  type="button"
                  data-testid="hollowing-3d-bloom-btn"
                  onClick={() => setBloomEnabled((prev) => !prev)}
                  aria-pressed={bloomEnabled}
                  aria-label={`Toggle anime bloom post-processing, currently ${bloomEnabled ? 'on' : 'off'}`}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    bloomEnabled
                      ? 'bg-fuchsia-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Bloom {bloomEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
