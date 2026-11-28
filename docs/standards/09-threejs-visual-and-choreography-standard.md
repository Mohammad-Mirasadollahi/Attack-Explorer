# Three.js 3D Realism, Natural Visual Craft & Technical Guardrails Standard (`MOD-09`)

> **Module ID**: `MOD-09` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: All Three.js 3D animations, PBR materials, procedural textures, lighting, post-processing, floating 3D callout overlays, camera framing, and WebGL lifecycle inside `/components/three/**` and `/modules/scenarios/*/three/**`.  
> **Status**: Mandatory Permanent Standard · Enforced by `/lib/section-3d-registry.test.ts` and per-scenario `choreography.test.ts`.

---

## 1. Core Mandate — Most Natural & Realistic Visual Presentation Possible (Zero Fixed Template)

Every 3D animation in Attack Explorer MUST be designed and rendered in the **most natural, lifelike, and physically realistic form possible** for its subject matter, while imposing **no rigid layout template, fixed act mold, or cartoonish/stylized art filter**:

1. **Mandatory Natural & Realistic 3D Rendering (Permanent Rule for All Future Scenes)**:
   - Always aim for **photorealistic, physically grounded visual fidelity**: use real physically based materials (`MeshStandardMaterial` / `MeshPhysicalMaterial`) with authentic roughness, metalness, clearcoat, glass reflectivity, and procedural high-resolution surface textures (masonry, asphalt, brushed metal, fabric weave, stamped signage, architectural glass) illuminated by natural directional sunlight/ambient/local practical lighting and image-based reflections (`RoomEnvironment`).
   - Build **authentic, multi-part, realistically proportioned real-world geometry** grounded in believable surrounding environments (urban skylines, streets, rooms, hardware racks, mechanical assemblies, contact shadows, atmospheric horizon fog)—**never** flat untextured single-primitive boxes, toy-like cartoon blocks, cel-shaded/toon shaders, or floating dioramas boxed inside empty black voids.
   - Animate objects with **natural physical weight, inertia, and realistic mechanics** (tires rotating proportionally to travel distance, smooth braking deceleration, cloth swaying gently in air currents, hydraulic doors pivoting cleanly, optical beams behaving naturally).
   - Legacy stylized/toon utilities under `/components/three/` are deprecated for new or rebuilt scenes and must **not** be used as defaults.
2. **Minimum Readable Duration & Continuous Multi-Element Physical Interactions (Permanent Rule)**:
   - **Overview 3D animations MUST run at least `40` seconds (`>= 40s`, recommended `40–50s`, roughly `8–10s` per beat/act)** so learners have comfortable time to read every act/phase card while observing every physical action unfold without rushing.
   - **Standalone Step-by-Step (`step-1..N`) and Memory Forensics (`memory-forensics`) 3D animations MUST run at least `20–24` seconds** (roughly `7–8s` per phase) so every micro-mechanism and state transition is clearly readable.
   - **Rich Multi-Element Physical Motion**: Populate scenes with genuine moving, interacting real-world elements directly illustrating the narration—vehicles driving with rotating wheels and braking, doors/hatches/blast gates opening and sliding shut, back-and-forth shuttle transit, passing ambient traffic, optical scanners locking onto plates, ribbons detaching and dropping, bollards rising, and sequential forge/recast waves. Never settle for static objects that merely change color.
   - Beyond these minimum readability and motion standards, impose **zero fixed structural template** (do not lock every scenario to one rigid act count, room box, or camera formula).
3. **Strict Anti-Washout Lighting, Exposure, Fog & Selective Bloom Discipline (Permanent Rule)**:
   - Prevent excessive light scatter, milky white glare, or blown-out highlights across both Light and Dark themes so every stone block, vehicle panel, metal bevel, and signboard stays razor-sharp and clearly legible:
     - Keep `RoomEnvironment` IBL restrained (`scene.environmentIntensity` ~ `0.25–0.35` in Light mode, `0.42–0.52` in Dark mode) instead of leaving it at `1.0`.
     - Calibrate `ACESFilmicToneMapping` exposure cleanly (`toneMappingExposure` ~ `0.82–0.90` in Light mode, `0.92–0.98` in Dark mode) and keep `HemisphereLight` + `DirectionalLight` balanced so light stone or sky surfaces never clip to pure white.
     - Keep atmospheric `FogExp2` subtle (`density <= 0.0045` in Light mode) so distant skyline silhouettes stay crisp rather than drowning in milky haze.
     - Restrict `UnrealBloomPass` strictly to genuine emissive lamps/lasers (`threshold >= 1.38`, `strength <= 0.14`, `radius <= 0.24` in Light mode; `threshold >= 1.05`, `strength <= 0.30` in Dark mode).
4. **English-Only Educational Copy**:
   - Keep all 3D canvas textures, signboards, floating callouts, HUD badges, and phase titles in clear, standard technical English (`en-US`).

---

## 2. Readability & Anti-Clutter Guardrail

Decorative visual noise should never obscure the physical mechanism being explained:

- **Avoid Distracting Clutter**:
  - Do **not** add meaningless ambient floating sparkles, spinning glitter stars, random magic-dust clouds, or noisy debris layers around hero objects when they do not represent a real part of the mechanism.
- **Purposeful Visual Signals**:
  - Visual effects, particles, beams, shards, and motion cues are encouraged whenever they directly communicate a real state transition—such as a frozen lock shattering, an X-ray scan sweeping across two assemblies, a shredded reel ejecting ribbons, or discrete packets traveling along a wire.

---

## 3. Shared Stage Container & Optional Floating 3D Labels

1. **Clean Adaptive Canvas Container**:
   - Mount each Three.js stage inside the shared responsive playback container (`AnimeSection3DStage` / `ScenarioSection3DEmbed`) so learners get consistent playback controls without constraining the visual style inside the 3D viewport.
2. **Floating Translucent 3D-Tracked Callout Labels**:
   - Project 3D anchor nodes (`primaryAnchor`, `secondaryAnchor`, or custom anchors) into 2D viewport coordinates to render readable, glass-backed floating label cards when enabled:
     - **Top Title**: Plain-language Story label (zero technical jargon).
     - **Bottom Subtitle**: Exact Technical translation in monospace.
   - Users can toggle floating labels on or off with the **Labels** button, and `/components/three/floating-callout-layout.ts` clamps coordinates inside safe viewport margins away from HUD chrome.

---

## 4. Camera Framing, Unobstructed Sightlines & Signboard Clearance

Every 3D animation should pass real-browser visual inspection at `1440×900` against these practical legibility guardrails:

1. **Zero Foreground Pillar Occlusion**:
   - Avoid placing vertical support posts, gantry legs, or walls in the camera foreground where they block the active mechanism or cutaway interior.
   - Mount structural arches, gantries, and back walls clear of the active sightline (for example, rear-supported behind the hero action) so the viewer always has an unobstructed view.
2. **Top-Left HUD Safe Zone**:
   - The top-left corner of the viewport hosts the translucent phase/act caption card. Keep 3D signboards and key focal actions clear of that safe zone so the HUD card never covers important 3D text or geometry.
3. **Signboard-to-Callout Separation**:
   - Keep floating 2D callout anchors vertically or spatially separated from background 3D signboards so projected labels never collide with 3D signage.
4. **Adaptive Camera Views & Cutaway Support**:
   - Define camera presets suited to the specific scene's geometry and teaching moments (no forced shot formula), and honor `cutawayMode` (`AUTO`, `OPEN`, `SEALED`) whenever the scene includes an exterior shell and internal mechanism.

---

## 5. Performance, Standby Activation & Resource Lifecycle

- **Standby Preview + Viewport Auto-Activation**: Heavy WebGL contexts must not mount simultaneously for every collapsed section on a long page. Render the lightweight standby preview card and activate via `IntersectionObserver` when scrolled into view, releasing inactive contexts cleanly when needed.
- **Deterministic Cleanup (`dispose()`)**: Every scene builder must track and dispose all dynamically generated `CanvasTexture`, `ShaderMaterial`, `BufferGeometry`, and `Material` instances inside `dispose()` on unmount.
- **Software WebGL Resilience**: Pass `isSoftwareGl` into builders so complex shader or post-processing effects degrade gracefully without runtime WebGL errors on headless or software-rendered GPUs.

---

## 6. Pre-Merge Visual Verification Checklist (`MOD-09`)

- [ ] Is the 3D scene rendered in the **most natural, lifelike, and physically realistic form possible** (PBR `MeshStandardMaterial`/`MeshPhysicalMaterial`, procedural textures, natural lighting, grounded architecture/environment, realistic proportions and physical motion—zero cartoon/toon/blocky shortcuts) without relying on a rigid structural template?
- [ ] Does the Overview 3D animation run **at least `40` seconds (`>= 40s`)** (and standalone Step/Memory scenes `>= 20–24s`) with continuous, readable multi-element physical interactions (moving vehicles, opening/closing hatches & gates, back-and-forth transit, scanning, lockdown)?
- [ ] Is the lighting, IBL (`environmentIntensity`), fog, and selective bloom calibrated cleanly with **zero white washout or excessive light scatter** so every architectural surface, prop, and text signboard stays crisp and legible?
- [ ] Are all 3D canvas textures, callouts, and HUD overlays written in clean, standard English (`en-US`)?
- [ ] Is the scene free of distracting decorative clutter (ambient glitter/sparkles/dust) that obscures the mechanism?
- [ ] Are all camera sightlines free of foreground geometry blocking the hero action or cutaway interior?
- [ ] Are 3D signboards and floating translucent callout labels completely legible with zero overlap against each other or HUD controls?
- [ ] Does the browser console report zero WebGL or React errors across initial mount, playback, camera switching, cutaway toggling, and unmount?
