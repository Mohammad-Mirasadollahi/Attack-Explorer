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
  ANIME_3D_STAGE_STANDARD,
  computeActivePhaseIndex,
  getPhaseMidpointNormalized,
  type Anime3DSceneKind,
  type Section3DDescriptor,
  type StandardCameraPresetId,
  type StandardCutawayMode,
} from '@/lib/section-3d-registry';
import { computeFloatingCalloutLayout } from './floating-callout-layout';
import {
  createAnimeMaterialLibrary,
  createAnimeSkyDome,
} from './anime-toon-materials';
import { detectSoftwareWebGL } from './detectSoftwareWebGL';
import { useCanvasPlayToggle } from './useCanvasPlayToggle';
import { CALLOUT_CARD_STYLES } from './calloutCardStyles';
import {
  loadBespokeSectionSceneFactory,
  type BespokeSectionSceneFactory,
} from '@/modules/scenarios/three-registry';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
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

// Pre-allocated scratch vectors for zero GC allocations in the render loop
const _scratchCamPos = new THREE.Vector3();
const _scratchCamTarget = new THREE.Vector3();
const _scratchPrimary = new THREE.Vector3();
const _scratchSecondary = new THREE.Vector3();

interface AnimeSection3DStageProps {
  descriptor: Section3DDescriptor;
  className?: string;
}

/**
 * Canonical Three.js Anime 3D Stage modeled identically on the Process Hollowing
 * Overview stage (`modules/scenarios/process-hollowing/three/BankScene.tsx`):
 * - Exact light/dark manga Top-Left Storyboard Card (Story first, Technical right below)
 * - Exact Top-Right Actions (`Cutaway: AUTO/OPEN/SEALED` + Amber `Full Page`)
 * - Exact Collapsible 2-Row Bottom Control Dock (`Hide/Show Controls`, `Pause/Play`, `Restart`,
 *   Phase tabs, `0.5x/1x/1.5x`, `% + Timeline Scrubber`, `Camera` + 4 Viewpoint Presets,
 *   Emerald `Labels ON/OFF`, Fuchsia `Bloom ON/OFF`)
 * - Direct DOM ref `.anime-floating-callout-card` 3D overlays (zero React re-renders)
 * - Software-WebGL (`SwiftShader`) `fenceSync` pacing + half-res bloom protection
 */
export function AnimeSection3DStage({
  descriptor,
  className = '',
}: AnimeSection3DStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const primaryLabelRef = useRef<HTMLDivElement | null>(null);
  const secondaryLabelRef = useRef<HTMLDivElement | null>(null);

  // Start paused — user must press Play; do not auto-loop when the timeline ends.
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [timelinePct, setTimelinePct] = useState<number>(4);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [cutawayMode, setCutawayMode] = useState<StandardCutawayMode>('AUTO');
  const [cameraPreset, setCameraPreset] =
    useState<StandardCameraPresetId>('DIRECTOR');
  const [dockExpanded, setDockExpanded] = useState<boolean>(true);
  const [isFullPage, setIsFullPage] = useState<boolean>(false);
  const [loadedFactory, setLoadedFactory] = useState<{
    scenarioId: string;
    factory: BespokeSectionSceneFactory;
  } | null>(null);
  const [bloomEnabled, setBloomEnabled] = useState<boolean>(true);
  const [labelsEnabled, setLabelsEnabled] = useState<boolean>(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [manualOrbitActive, setManualOrbitActive] = useState<boolean>(false);

  const simRef = useRef({
    normalizedTime: 0.04,
    isPlaying: false,
    playbackSpeed: 1,
    cutawayMode: 'AUTO' as StandardCutawayMode,
    cameraPreset: 'DIRECTOR' as StandardCameraPresetId,
    bloomEnabled: true,
    labelsEnabled: true,
    viewportWidth: 1200,
    viewportHeight: 640,
    manualOrbit: false,
    snapCamera: true,
    isDark: false,
    elapsed: 0,
    lastUiSyncMs: 0,
    lastPhaseIndex: 0,
    requestRender: () => {},
  });

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

  // Escape exits Full-Page view; H toggles dock when Full-Page
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

  useEffect(() => {
    let live = true;
    const targetScenarioId = descriptor.scenarioId;
    loadBespokeSectionSceneFactory(targetScenarioId).then((factory) => {
      if (live) {
        setLoadedFactory({ scenarioId: targetScenarioId, factory });
      }
    });
    return () => {
      live = false;
    };
  }, [descriptor.scenarioId]);

  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;
    if (!loadedFactory || loadedFactory.scenarioId !== descriptor.scenarioId) {
      return;
    }
    if (descriptor.sceneKind === 'bank-truck-briefing') return;

    const sceneKind = descriptor.sceneKind as Exclude<
      Anime3DSceneKind,
      'bank-truck-briefing'
    >;
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
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const initialW = Math.max(320, mountEl.clientWidth || 1200);
    const initialH = Math.max(360, mountEl.clientHeight || 640);
    simRef.current.viewportWidth = initialW;
    simRef.current.viewportHeight = initialH;
    renderer.setSize(initialW, initialH, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.dataset.testid = `section-3d-canvas-${descriptor.sectionKey}`;
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

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

    const materials = createAnimeMaterialLibrary(renderer);
    const sky = createAnimeSkyDome();
    sky.uniforms.uDarkMode.value = isDarkNow ? 1 : 0;
    scene.add(sky.mesh);

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
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      new THREE.Color(descriptor.accentHex),
      isDarkNow ? 1.0 : 0.72
    );
    rimLight.position.set(-20, 14, -18);
    scene.add(rimLight);

    const bespoke = loadedFactory.factory(sceneKind, materials, isSoftwareGl);
    scene.add(bespoke.root);

    const pixelRatio = renderer.getPixelRatio();

    const camera = new THREE.PerspectiveCamera(
      42,
      initialW / initialH,
      0.2,
      240
    );
    const initialPreset = descriptor.cameraPresets[0];
    camera.position.set(...initialPreset.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minDistance = 4.5;
    controls.maxDistance = 36;
    controls.maxPolarAngle = Math.PI * 0.475;
    controls.minPolarAngle = 0.14;
    controls.target.set(...initialPreset.target);
    controls.update();

    // Selective HDR Anime Bloom Pipeline (strictly HDR threshold + half-res on software GL)
    const composerTarget = new THREE.WebGLRenderTarget(initialW, initialH, {
      type: THREE.HalfFloatType,
      samples: isSoftwareGl ? 0 : 4,
    });
    const composer = new EffectComposer(renderer, composerTarget);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(initialW, initialH);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomResX = isSoftwareGl
      ? Math.max(120, Math.floor(initialW / 2))
      : initialW;
    const bloomResY = isSoftwareGl
      ? Math.max(120, Math.floor(initialH / 2))
      : initialH;
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(bloomResX, bloomResY),
      isDarkNow ? 0.42 : 0.26,
      isDarkNow ? 0.42 : 0.32,
      isDarkNow ? 0.98 : 1.12
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

    const applySceneState = (dt: number) => {
      const sim = simRef.current;
      sim.elapsed += dt;

      if (sim.isPlaying) {
        const next =
          sim.normalizedTime +
          (dt * sim.playbackSpeed) / descriptor.durationSec;
        if (next >= 1) {
          // Stay on the final frame; user must press Play/Restart to run again.
          sim.normalizedTime = 1;
          sim.isPlaying = false;
          setIsPlaying(false);
          setTimelinePct(100);
        } else {
          sim.normalizedTime = next;
        }
      }

      const timeSec = sim.normalizedTime * descriptor.durationSec;
      const phaseIdx = computeActivePhaseIndex(descriptor, timeSec);
      sky.uniforms.uTime.value = sim.elapsed;

      bespoke.update(timeSec, phaseIdx, sim.isDark, sim.cutawayMode);

      bloomPass.strength = sim.isDark ? 0.42 : 0.26;
      bloomPass.threshold = sim.isDark ? 0.98 : 1.12;
      bloomPass.radius = sim.isDark ? 0.42 : 0.32;

      // Smooth camera preset interpolation (with Process-Hollowing-style multi-act Director choreography)
      if (!sim.manualOrbit) {
        const preset =
          descriptor.cameraPresets.find((p) => p.id === sim.cameraPreset) ||
          descriptor.cameraPresets[0];
        _scratchCamPos.set(...preset.position);
        _scratchCamTarget.set(...preset.target);
        if (sim.cameraPreset === 'DIRECTOR') {
          const totalPhases = Math.max(1, descriptor.phases.length);
          const viewA = descriptor.cameraPresets[1];
          const viewB = descriptor.cameraPresets[2];
          const viewC = descriptor.cameraPresets[3];
          const phaseFocal =
            totalPhases >= 3
              ? phaseIdx === 0
                ? viewA
                : phaseIdx === 1
                  ? viewB
                  : phaseIdx === 2
                    ? viewC
                    : preset
              : phaseIdx === 0
                ? preset
                : viewB ?? preset;
          if (phaseFocal && phaseFocal.id !== 'DIRECTOR') {
            // Blend 42% toward the active act's hero viewpoint so the whole stage stays legible while the camera tells the story
            _scratchCamPos.lerp(
              new THREE.Vector3(...phaseFocal.position),
              0.42
            );
            _scratchCamTarget.lerp(
              new THREE.Vector3(...phaseFocal.target),
              0.42
            );
          }
          _scratchCamPos.x += Math.sin(sim.elapsed * 0.28) * 0.65;
          _scratchCamPos.y += Math.cos(sim.elapsed * 0.22) * 0.22;
        }
        if (sim.snapCamera) {
          camera.position.copy(_scratchCamPos);
          controls.target.copy(_scratchCamTarget);
          sim.snapCamera = false;
        } else {
          const lambda = isSoftwareGl ? 10.5 : 4.8;
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            _scratchCamPos.x,
            lambda,
            dt
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            _scratchCamPos.y,
            lambda,
            dt
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            _scratchCamPos.z,
            lambda,
            dt
          );
          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            _scratchCamTarget.x,
            lambda,
            dt
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            _scratchCamTarget.y,
            lambda,
            dt
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            _scratchCamTarget.z,
            lambda,
            dt
          );
        }
      } else {
        sim.snapCamera = false;
      }

      controls.update();

      // Direct DOM ref update for floating translucent 3D callout labels (zero React re-renders!)
      const pEl = primaryLabelRef.current;
      const sEl = secondaryLabelRef.current;
      if (pEl && sEl) {
        if (!sim.labelsEnabled) {
          pEl.style.opacity = '0';
          sEl.style.opacity = '0';
        } else {
          camera.updateMatrixWorld();
          bespoke.root.updateMatrixWorld(true);
          const vw = sim.viewportWidth;
          const vh = sim.viewportHeight;

          bespoke.primaryAnchor.getWorldPosition(_scratchPrimary);
          _scratchPrimary.project(camera);
          const pVisible = _scratchPrimary.z >= -1 && _scratchPrimary.z <= 1;

          bespoke.secondaryAnchor.getWorldPosition(_scratchSecondary);
          _scratchSecondary.project(camera);
          const sVisible =
            _scratchSecondary.z >= -1 && _scratchSecondary.z <= 1;

          const layout = computeFloatingCalloutLayout({
            viewportWidth: vw,
            viewportHeight: vh,
            bankTruck: {
              x: (_scratchPrimary.x * 0.5 + 0.5) * vw,
              y: (-_scratchPrimary.y * 0.5 + 0.5) * vh,
              visible: pVisible,
            },
            hiddenIntruder: {
              x: (_scratchSecondary.x * 0.5 + 0.5) * vw,
              y: (-_scratchSecondary.y * 0.5 + 0.5) * vh,
              visible: sVisible,
            },
          });

          if (layout.bankTruck.visible) {
            pEl.style.transform = `translate3d(${layout.bankTruck.x}px, ${layout.bankTruck.y}px, 0)`;
            pEl.style.opacity = '1';
          } else {
            pEl.style.opacity = '0';
          }

          if (layout.hiddenIntruder.visible) {
            sEl.style.transform = `translate3d(${layout.hiddenIntruder.x}px, ${layout.hiddenIntruder.y}px, 0)`;
            sEl.style.opacity = '1';
          } else {
            sEl.style.opacity = '0';
          }
        }
      }

      // Throttled HUD sync (<= 6Hz or immediate on phase transition)
      const nowMs = performance.now();
      if (
        phaseIdx !== sim.lastPhaseIndex ||
        nowMs - sim.lastUiSyncMs > 180
      ) {
        sim.lastPhaseIndex = phaseIdx;
        sim.lastUiSyncMs = nowMs;
        setActivePhaseIndex(phaseIdx);
        setTimelinePct(Math.round(sim.normalizedTime * 100));
      }
    };

    // Software-WebGL fenceSync frame scheduler (prevents SwiftShader CPU starvation!)
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
          const state = sync
            ? gl.getSyncParameter(sync, gl.SYNC_STATUS)
            : gl.SIGNALED;
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 8);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 90);
          }
        };
        frameId = window.setTimeout(poll, 8);
      } else {
        frameId = window.setTimeout(cb, 100);
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
        // Play may have been pressed while this paused frame was queued.
        // Upgrade to the playback loop instead of wiping renderDirty and stalling.
        if (simRef.current.isPlaying) {
          renderDirty = false;
          lastTickTime = performance.now();
          tick();
          return;
        }
        renderDirty = false;
        applySceneState(0.016);
        renderFrame();
        const done = () => {
          renderBusy = false;
          if (disposed) return;
          if (simRef.current.isPlaying || renderDirty) {
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
      bespoke.dispose();
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
      materials.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, [descriptor, loadedFactory]);

  const handleSelectPhase = useCallback(
    (phaseIdx: number) => {
      const targetT = getPhaseMidpointNormalized(descriptor, phaseIdx);
      simRef.current.normalizedTime = targetT;
      simRef.current.manualOrbit = false;
      simRef.current.cameraPreset = 'DIRECTOR';
      simRef.current.snapCamera = true;
      setCameraPreset('DIRECTOR');
      setManualOrbitActive(false);
      setActivePhaseIndex(phaseIdx);
      setTimelinePct(Math.round(targetT * 100));
      simRef.current.requestRender();
    },
    [descriptor]
  );

  const handleScrubTimeline = useCallback(
    (pct: number) => {
      const clamped = Math.max(0, Math.min(100, pct));
      const t = clamped / 100;
      simRef.current.normalizedTime = t;
      simRef.current.snapCamera = true;
      setTimelinePct(clamped);
      setActivePhaseIndex(
        computeActivePhaseIndex(descriptor, t * descriptor.durationSec)
      );
      simRef.current.requestRender();
    },
    [descriptor]
  );

  const handleTogglePlay = useCallback(() => {
    const sim = simRef.current;
    // Prefer the sim flag so we don't race React state vs the render loop.
    if (sim.isPlaying) {
      sim.isPlaying = false;
      setIsPlaying(false);
      return;
    }
    // Finished timeline: rewind first so Play actually runs again.
    if (sim.normalizedTime >= 0.999) {
      sim.normalizedTime = 0;
      sim.snapCamera = true;
      setActivePhaseIndex(0);
      setTimelinePct(0);
    }
    sim.isPlaying = true;
    setIsPlaying(true);
    sim.requestRender();
  }, []);

  const handleToggleFullPage = useCallback(() => {
    setIsFullPage((prev) => !prev);
  }, []);

  useCanvasPlayToggle(canvasMountRef, handleTogglePlay, handleToggleFullPage);

  const handleRestart = useCallback(() => {
    simRef.current.normalizedTime = 0.01;
    simRef.current.manualOrbit = false;
    simRef.current.cameraPreset = 'DIRECTOR';
    simRef.current.snapCamera = true;
    setCameraPreset('DIRECTOR');
    setManualOrbitActive(false);
    setActivePhaseIndex(0);
    setTimelinePct(1);
    // Restart only seeks to the start; user presses Play to run again.
    setIsPlaying(false);
    simRef.current.requestRender();
  }, []);

  const cycleCutawayMode = useCallback(() => {
    setCutawayMode((prev) =>
      prev === 'AUTO' ? 'OPEN' : prev === 'OPEN' ? 'SEALED' : 'AUTO'
    );
  }, []);

  const activePhase =
    descriptor.phases[activePhaseIndex] || descriptor.phases[0];
  const [primaryCallout, secondaryCallout] = descriptor.callouts;
  const primaryStyle = CALLOUT_CARD_STYLES[primaryCallout.tone];
  const secondaryStyle = CALLOUT_CARD_STYLES[secondaryCallout.tone];
  const totalPhases = descriptor.phases.length;

  return (
    <div
      ref={containerRef}
      data-testid={`section-3d-stage-${descriptor.sectionKey}`}
      data-scene-kind={descriptor.sceneKind}
      data-is-playing={isPlaying ? 'true' : 'false'}
      data-cutaway-mode={cutawayMode}
      data-camera-preset={cameraPreset}
      data-is-fullpage={isFullPage ? 'true' : 'false'}
      data-bloom-enabled={bloomEnabled ? 'true' : 'false'}
      data-labels-enabled={labelsEnabled ? 'true' : 'false'}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={
        isFullPage
          ? 'fixed inset-0 z-[95] w-screen h-screen p-2 bg-[#0B0F17] select-none'
          : `anime-3d-stage-frame w-full ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses} select-none ${className}`
      }
    >
      <div className="anime-3d-canvas-bezel relative w-full h-full bg-[#0B0F17]">
        {/* Canvas: click = Pause/Resume, double-click = full page, drag = orbit */}
        <div
          ref={canvasMountRef}
          data-testid={`section-3d-canvas-toggle-${descriptor.sectionKey}`}
          aria-label={
            isPlaying
              ? 'Pause 3D animation. Double-click for full page.'
              : 'Play 3D animation. Double-click for full page.'
          }
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Translucent 3D Callout Overlay #1 (Direct DOM ref, zero React re-renders) */}
        <div
          ref={primaryLabelRef}
          data-testid={`floating-label-primary-${descriptor.sectionKey}`}
          aria-hidden={!labelsEnabled}
          className="anime-floating-callout"
          style={{ opacity: 0 }}
        >
          <div className={`anime-floating-callout-card ${primaryStyle.card}`}>
            <div className="flex items-center gap-1.5">
              {descriptor.scenarioId === 'process-hollowing' ? (
                <Truck
                  className={`w-3.5 h-3.5 shrink-0 ${primaryStyle.icon}`}
                />
              ) : (
                <Layers
                  className={`w-3.5 h-3.5 shrink-0 ${primaryStyle.icon}`}
                />
              )}
              <span className="text-[11.5px] font-extrabold tracking-normal text-white">
                {primaryCallout.title}
              </span>
            </div>
            <div
              className={`text-[9.5px] font-mono font-semibold leading-tight mt-0.5 ${primaryStyle.sub}`}
            >
              {primaryCallout.subtitle}
            </div>
          </div>
        </div>

        {/* Floating Translucent 3D Callout Overlay #2 (Direct DOM ref, zero React re-renders) */}
        <div
          ref={secondaryLabelRef}
          data-testid={`floating-label-secondary-${descriptor.sectionKey}`}
          aria-hidden={!labelsEnabled}
          className="anime-floating-callout"
          style={{ opacity: 0 }}
        >
          <div className={`anime-floating-callout-card ${secondaryStyle.card}`}>
            <div className="flex items-center gap-1.5">
              <ShieldAlert
                className={`w-3.5 h-3.5 shrink-0 ${secondaryStyle.icon}`}
              />
              <span className="text-[11.5px] font-extrabold tracking-normal text-white">
                {secondaryCallout.title}
              </span>
            </div>
            <div
              className={`text-[9.5px] font-mono font-semibold leading-tight mt-0.5 ${secondaryStyle.sub}`}
            >
              {secondaryCallout.subtitle}
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
              <p className="text-xs text-slate-400">{descriptor.storyCue}</p>
            </div>
          </div>
        )}

        {/* Top-Left Compact Anime Storyboard Caption (EXACT Overview Manga Style: Story FIRST, Technical RIGHT BELOW) */}
        <div
          data-testid={`section-3d-caption-${descriptor.sectionKey}`}
          className="pointer-events-auto absolute top-3 left-3 z-20 max-w-[min(368px,52vw)] rounded-xl bg-white/95 dark:bg-slate-950/94 border-2 border-slate-900 dark:border-slate-700 shadow-[3px_3px_0px_#0F172A] px-3 py-2 text-left space-y-1"
        >
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono font-bold">
            <span
              style={{ backgroundColor: activePhase.accentHex }}
              className="px-1.5 py-0.5 rounded text-slate-950 font-extrabold"
            >
              ACT 0{activePhase.id} / 0{totalPhases}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {activePhase.stageTag}
            </span>
            <span aria-hidden="true" className="text-slate-400">
              ·
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              {descriptor.mitreId}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-950 dark:text-white leading-snug">
            {activePhase.title}
          </h3>

          {/* Story-like Excerpt FIRST */}
          <p className="text-[11.5px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
            &ldquo;{activePhase.storyExcerpt}&rdquo;
          </p>

          {/* Technical Explanation RIGHT BELOW */}
          <div className="pt-1 border-t border-slate-200 dark:border-slate-800 text-[10.5px] font-mono text-indigo-700 dark:text-sky-300 leading-snug">
            {activePhase.technicalParallel}
          </div>
        </div>

        {/* Top-Right Compact Viewport Actions (EXACT Overview Button Placement: Cutaway + Amber Full Page) */}
        <div className="pointer-events-auto absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          <button
            type="button"
            data-testid={`section-3d-cutaway-btn-${descriptor.sectionKey}`}
            onClick={cycleCutawayMode}
            aria-label={`Toggle cutaway view, currently ${cutawayMode}`}
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
            data-testid={`section-3d-fullpage-btn-${descriptor.sectionKey}`}
            onClick={handleToggleFullPage}
            aria-label={
              isFullPage
                ? 'Exit full page 3D view'
                : 'Expand 3D scene to full page'
            }
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

        {/* Collapsible Unified Bottom Control Dock (EXACT Overview 2-Row Standard) */}
        <div
          data-testid={`section-3d-bottom-dock-${descriptor.sectionKey}`}
          className="pointer-events-none absolute inset-x-0 bottom-3.5 z-20 flex flex-col items-center px-3"
        >
          {/* Collapse / Expand Toggle Handle */}
          <button
            type="button"
            data-testid={`section-3d-dock-toggle-${descriptor.sectionKey}`}
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
              {/* Row 1: Play/Pause + Restart | Story Phase Tabs | Speed Multiplier */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    data-testid={`section-3d-play-btn-${descriptor.sectionKey}`}
                    onClick={handleTogglePlay}
                    aria-label={
                      isPlaying ? 'Pause 3D animation' : 'Play 3D animation'
                    }
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
                    data-testid={`section-3d-restart-btn-${descriptor.sectionKey}`}
                    onClick={handleRestart}
                    aria-label="Restart 3D animation from Act 1"
                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive Story Act / Phase Steps */}
                <div
                  className="flex items-center gap-1 flex-wrap"
                  role="tablist"
                  aria-label="Story Acts"
                >
                  {descriptor.phases.map((ph, idx) => {
                    const isCurrent = idx === activePhaseIndex;
                    return (
                      <button
                        key={ph.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        onClick={() => handleSelectPhase(idx)}
                        className={`px-2 py-1 rounded-md text-[10.5px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isCurrent
                            ? 'bg-slate-950 dark:bg-sky-400 text-white dark:text-slate-950'
                            : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {ph.shortLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Speed Multiplier (0.5x / 1x / 1.5x) */}
                <div className="flex items-center gap-1 shrink-0">
                  {ANIME_3D_STAGE_STANDARD.speedMultipliers.map((spd) => (
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

              {/* Row 2: Timeline Scrubber + Camera Viewpoints + Labels ON/OFF + Bloom ON/OFF */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <label
                    htmlFor={`section-3d-timeline-${descriptor.sectionKey}`}
                    className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums shrink-0"
                  >
                    {timelinePct}%
                  </label>
                  <input
                    id={`section-3d-timeline-${descriptor.sectionKey}`}
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
                  {descriptor.cameraPresets.map((preset) => {
                    const isActive =
                      cameraPreset === preset.id && !manualOrbitActive;
                    const label =
                      preset.id === 'DIRECTOR' && manualOrbitActive
                        ? 'Re-Center'
                        : preset.label;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setCameraPreset(preset.id);
                          simRef.current.cameraPreset = preset.id;
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
                    data-testid={`section-3d-labels-btn-${descriptor.sectionKey}`}
                    onClick={() => setLabelsEnabled((prev) => !prev)}
                    aria-pressed={labelsEnabled}
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
                    data-testid={`section-3d-bloom-btn-${descriptor.sectionKey}`}
                    onClick={() => setBloomEnabled((prev) => !prev)}
                    aria-pressed={bloomEnabled}
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
