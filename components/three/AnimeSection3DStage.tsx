'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';
import {
  computeActivePhaseIndex,
  type Anime3DSceneKind,
  type Section3DCalloutSpec,
  type Section3DDescriptor,
} from '@/lib/section-3d-registry';
import {
  computeFloatingCalloutLayout,
  type FloatingCalloutLayout,
} from '@/lib/hollowing-3d-overlay-layout';
import {
  createAnimeMaterialLibrary,
  createAnimeSkyDome,
} from './anime-toon-materials';
import { buildAnimeMagicGlitchParticles } from './anime-particle-system';
import { buildBespokeSectionScene } from './hollowing-step-scene-builders';

interface AnimeSection3DStageProps {
  descriptor: Section3DDescriptor;
  className?: string;
}

const CALLOUT_TONE_CLASSES: Record<
  Section3DCalloutSpec['tone'],
  { border: string; dot: string; tag: string; stem: string }
> = {
  sky: {
    border: 'border-sky-400/75 text-sky-100',
    dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]',
    tag: 'text-sky-300',
    stem: 'from-sky-400/90',
  },
  rose: {
    border: 'border-rose-400/75 text-rose-100',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]',
    tag: 'text-rose-300',
    stem: 'from-rose-400/90',
  },
  amber: {
    border: 'border-amber-400/75 text-amber-100',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.9)]',
    tag: 'text-amber-300',
    stem: 'from-amber-400/90',
  },
  emerald: {
    border: 'border-emerald-400/75 text-emerald-100',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]',
    tag: 'text-emerald-300',
    stem: 'from-emerald-400/90',
  },
};

export function AnimeSection3DStage({
  descriptor,
  className = '',
}: AnimeSection3DStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [calloutLayout, setCalloutLayout] = useState<FloatingCalloutLayout>({
    bankTruck: { x: 0, y: 0, visible: false, clamped: false },
    hiddenIntruder: { x: 0, y: 0, visible: false, clamped: false },
  });

  const isPlayingRef = useRef(isPlaying);
  const bloomEnabledRef = useRef(bloomEnabled);
  const labelsVisibleRef = useRef(labelsVisible);
  const timelineTimeRef = useRef(0);
  const resetCameraFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    bloomEnabledRef.current = bloomEnabled;
  }, [bloomEnabled]);

  useEffect(() => {
    labelsVisibleRef.current = labelsVisible;
  }, [labelsVisible]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;
    if (descriptor.sceneKind === 'bank-truck-briefing') return;

    const sceneKind = descriptor.sceneKind as Exclude<
      Anime3DSceneKind,
      'bank-truck-briefing'
    >;

    const initWidth = Math.max(320, host.clientWidth || 960);
    const initHeight = Math.max(320, host.clientHeight || 540);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(initWidth, initHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const isDarkInit = document.documentElement.classList.contains('dark');
    scene.fog = new THREE.FogExp2(isDarkInit ? 0x0b1024 : 0xcbe4f9, 0.014);

    const camera = new THREE.PerspectiveCamera(
      40,
      initWidth / initHeight,
      0.1,
      200
    );

    const materials = createAnimeMaterialLibrary(renderer);
    const skyDome = createAnimeSkyDome();
    skyDome.uniforms.uDarkMode.value = isDarkInit ? 1.0 : 0.0;
    scene.add(skyDome.mesh);

    // Crisp Japanese anime key + sky hemisphere + rim lights
    const hemiLight = new THREE.HemisphereLight(
      isDarkInit ? 0x93c5fd : 0xf0f9ff,
      isDarkInit ? 0x1e1b4b : 0x334155,
      isDarkInit ? 1.15 : 1.35
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(
      isDarkInit ? 0xe0f2fe : 0xfff7ed,
      isDarkInit ? 1.9 : 2.1
    );
    sunLight.position.set(11, 16, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(
      new THREE.Color(descriptor.accentHex),
      1.05
    );
    rimLight.position.set(-10, 7, -10);
    scene.add(rimLight);

    // Build this section's bespoke anime diorama
    const bespoke = buildBespokeSectionScene(sceneKind, materials);
    scene.add(bespoke.root);

    // Dual-layer Anime Magic Dust & Digital Glitch particle aura
    const particleSystem = buildAnimeMagicGlitchParticles(dpr);
    scene.add(particleSystem.root);

    camera.position.copy(bespoke.defaultCameraPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 5.5;
    controls.maxDistance = 24;
    controls.target.copy(bespoke.defaultCameraTarget);
    controls.update();

    resetCameraFnRef.current = () => {
      camera.position.copy(bespoke.defaultCameraPos);
      controls.target.copy(bespoke.defaultCameraTarget);
      controls.update();
    };

    // Selective HDR Anime Bloom Composer (strict HDR threshold prevents white-out)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(initWidth, initHeight),
      isDarkInit ? 0.4 : 0.24,
      isDarkInit ? 0.4 : 0.3,
      isDarkInit ? 0.98 : 1.12
    );
    composer.addPass(bloomPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    let viewportW = initWidth;
    let viewportH = initHeight;

    const handleResize = () => {
      const w = Math.max(320, host.clientWidth || 960);
      const h = Math.max(320, host.clientHeight || 540);
      viewportW = w;
      viewportH = h;
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(nextDpr);
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
      particleSystem.setPixelRatio(nextDpr);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(host);

    // Pre-allocated vectors for floating callout projection (zero per-frame GC)
    const _projPrimary = new THREE.Vector3();
    const _projSecondary = new THREE.Vector3();
    let lastUiSync = 0;
    let lastPhase = -1;
    let lastFrameMs = performance.now();
    let animId = 0;

    const projectAnchor = (obj: THREE.Object3D, out: THREE.Vector3) => {
      obj.getWorldPosition(out);
      out.project(camera);
      const visible = out.z >= -1 && out.z <= 1;
      return {
        x: (out.x * 0.5 + 0.5) * viewportW,
        y: (-out.y * 0.5 + 0.5) * viewportH,
        visible,
      };
    };

    const animate = (nowMs: number) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastFrameMs) / 1000));
      lastFrameMs = nowMs;

      if (isPlayingRef.current) {
        timelineTimeRef.current =
          (timelineTimeRef.current + dt) % descriptor.durationSec;
      }

      const elapsed = timelineTimeRef.current;
      const isDark = document.documentElement.classList.contains('dark');
      skyDome.uniforms.uTime.value = nowMs * 0.001;
      skyDome.uniforms.uDarkMode.value = isDark ? 1.0 : 0.0;

      // Sync selective bloom strength/threshold for light vs dark theme
      bloomPass.strength = isDark ? 0.4 : 0.24;
      bloomPass.radius = isDark ? 0.4 : 0.3;
      bloomPass.threshold = isDark ? 0.98 : 1.12;

      const phaseIdx = computeActivePhaseIndex(descriptor, elapsed);
      const fx = bespoke.update(elapsed, phaseIdx, isDark);

      particleSystem.update({
        elapsed: nowMs * 0.001,
        truckX: bespoke.particleCenter.x,
        glitchIntensity: fx.glitchIntensity,
        magicDustIntensity: fx.magicDustIntensity,
        primaryHex: descriptor.accentHex,
        secondaryHex: descriptor.secondaryHex,
        stasisIntensity: fx.stasisIntensity,
        brakeReleaseBoost: fx.brakeReleaseBoost,
      });

      controls.update();

      if (bloomEnabledRef.current) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      // Sync React HUD / floating callouts at ~24Hz
      if (nowMs - lastUiSync > 42) {
        lastUiSync = nowMs;
        if (phaseIdx !== lastPhase) {
          lastPhase = phaseIdx;
          setActivePhaseIdx(phaseIdx);
        }
        if (labelsVisibleRef.current) {
          const p1 = projectAnchor(bespoke.primaryAnchor, _projPrimary);
          const p2 = projectAnchor(bespoke.secondaryAnchor, _projSecondary);
          setCalloutLayout(
            computeFloatingCalloutLayout({
              viewportWidth: viewportW,
              viewportHeight: viewportH,
              bankTruck: p1,
              hiddenIntruder: p2,
            })
          );
        }
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      bespoke.dispose();
      particleSystem.dispose();
      skyDome.mesh.geometry.dispose();
      (skyDome.mesh.material as THREE.Material).dispose();
      materials.dispose();
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
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [descriptor]);

  const activePhase =
    descriptor.phases[activePhaseIdx] ?? descriptor.phases[0];
  const [primaryCallout, secondaryCallout] = descriptor.callouts;
  const primaryTone = CALLOUT_TONE_CLASSES[primaryCallout.tone];
  const secondaryTone = CALLOUT_TONE_CLASSES[secondaryCallout.tone];

  return (
    <div
      ref={containerRef}
      data-testid={`section-3d-stage-${descriptor.sectionKey}`}
      data-scene-kind={descriptor.sceneKind}
      onClick={(e) => e.stopPropagation()}
      className={`${
        isExpanded
          ? 'fixed inset-3 z-[80] h-[calc(100vh-24px)]'
          : 'relative w-full h-[520px] sm:h-[580px]'
      } anime-3d-stage-frame transition-all ${className}`}
    >
      <div className="anime-3d-canvas-bezel relative w-full h-full overflow-hidden bg-[#0B0F17] select-none">
        {/* Live WebGL Canvas */}
        <div ref={canvasHostRef} className="w-full h-full" />

        {/* Top-Left Synchronized Story + Technical Cue HUD */}
        <div className="pointer-events-none absolute top-3 left-3 z-20 max-w-[385px] rounded-xl border border-sky-400/35 bg-slate-950/88 px-3.5 py-2.5 text-white shadow-xl">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-extrabold tracking-wider text-sky-300">
            <span className="px-1.5 py-0.5 rounded bg-sky-400 text-slate-950">
              {descriptor.mitreId}
            </span>
            <span>{descriptor.stageBadge}</span>
          </div>
          <div className="mt-1 text-xs sm:text-[13px] font-extrabold text-white leading-snug">
            {descriptor.title}
          </div>
          <p className="mt-1 text-[11px] text-amber-200/95 leading-snug">
            <strong className="font-mono text-amber-400">STORY:</strong>{' '}
            {activePhase?.caption || descriptor.storyCue}
          </p>
          <p className="mt-1 text-[10.5px] font-mono text-slate-300 leading-snug border-t border-slate-800/90 pt-1">
            <strong className="text-sky-400">TECH:</strong>{' '}
            {descriptor.technicalCue}
          </p>
        </div>

        {/* Top-Right Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setLabelsVisible((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10.5px] font-mono font-bold transition-colors cursor-pointer ${
              labelsVisible
                ? 'border-sky-400/70 bg-slate-950/90 text-sky-200'
                : 'border-slate-700 bg-slate-950/80 text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Labels {labelsVisible ? 'ON' : 'OFF'}</span>
          </button>
          <button
            type="button"
            onClick={() => setBloomEnabled((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10.5px] font-mono font-bold transition-colors cursor-pointer ${
              bloomEnabled
                ? 'border-amber-400/70 bg-slate-950/90 text-amber-200'
                : 'border-slate-700 bg-slate-950/80 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Bloom {bloomEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950/90 px-2.5 py-1.5 text-[10.5px] font-mono font-bold text-slate-100 hover:border-sky-400 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>Full Page</span>
              </>
            )}
          </button>
        </div>

        {/* Live 3D-Projected Floating Translucent Callout Overlays */}
        {labelsVisible && calloutLayout.bankTruck.visible && (
          <div
            data-testid={`floating-label-primary-${descriptor.sectionKey}`}
            style={{
              transform: `translate3d(${calloutLayout.bankTruck.x}px, ${calloutLayout.bankTruck.y}px, 0) translate(-50%, -100%)`,
            }}
            className={`anime-floating-callout pointer-events-none absolute top-0 left-0 z-10 w-[196px] rounded-lg border bg-slate-950/76 px-2.5 py-1.5 shadow-lg ${primaryTone.border}`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${primaryTone.dot}`}
              />
              <span
                className={`text-[9px] font-mono font-extrabold uppercase tracking-wider truncate ${primaryTone.tag}`}
              >
                {primaryCallout.tag}
              </span>
            </div>
            <div className="mt-0.5 text-[11.5px] font-extrabold tracking-normal text-white leading-tight">
              {primaryCallout.title}
            </div>
            <div className="text-[9.5px] font-mono text-slate-300 leading-tight truncate">
              {primaryCallout.subtitle}
            </div>
            <div
              className={`mx-auto mt-1 h-2.5 w-[2px] bg-gradient-to-b ${primaryTone.stem} to-transparent`}
            />
          </div>
        )}

        {labelsVisible && calloutLayout.hiddenIntruder.visible && (
          <div
            data-testid={`floating-label-secondary-${descriptor.sectionKey}`}
            style={{
              transform: `translate3d(${calloutLayout.hiddenIntruder.x}px, ${calloutLayout.hiddenIntruder.y}px, 0) translate(-50%, -100%)`,
            }}
            className={`anime-floating-callout pointer-events-none absolute top-0 left-0 z-10 w-[196px] rounded-lg border bg-slate-950/76 px-2.5 py-1.5 shadow-lg ${secondaryTone.border}`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${secondaryTone.dot}`}
              />
              <span
                className={`text-[9px] font-mono font-extrabold uppercase tracking-wider truncate ${secondaryTone.tag}`}
              >
                {secondaryCallout.tag}
              </span>
            </div>
            <div className="mt-0.5 text-[11.5px] font-extrabold tracking-normal text-white leading-tight">
              {secondaryCallout.title}
            </div>
            <div className="text-[9.5px] font-mono text-slate-300 leading-tight truncate">
              {secondaryCallout.subtitle}
            </div>
            <div
              className={`mx-auto mt-1 h-2.5 w-[2px] bg-gradient-to-b ${secondaryTone.stem} to-transparent`}
            />
          </div>
        )}

        {/* Bottom Interactive Phase & Playback Dock */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-white shadow-lg">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1 rounded-lg bg-sky-400 hover:bg-sky-300 px-2.5 py-1 text-[10.5px] font-mono font-extrabold text-slate-950 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Play</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                timelineTimeRef.current = 0;
                setActivePhaseIdx(0);
                resetCameraFnRef.current?.();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 hover:border-sky-400 px-2 py-1 text-[10.5px] font-mono font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {descriptor.phases.map((ph, idx) => {
              const active = idx === activePhaseIdx;
              return (
                <button
                  key={ph.id}
                  type="button"
                  onClick={() => {
                    timelineTimeRef.current = ph.startSec + 0.15;
                    setActivePhaseIdx(idx);
                  }}
                  className={`rounded-md px-2 py-1 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ph.id}. {ph.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
