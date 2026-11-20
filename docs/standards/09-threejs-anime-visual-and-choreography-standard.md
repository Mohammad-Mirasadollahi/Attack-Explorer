# Three.js Cel-Shaded Anime Visual, HUD & Clean-Scene Standard (`MOD-09`)

> **Module ID**: `MOD-09` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: All Three.js 3D scenes, cel-shaded toon materials, post-processing bloom pipelines, CSS anime canvas frames, floating 3D callout overlays, and camera framing inside `/components/three/**`.  
> **Status**: Mandatory Permanent Standard · Enforced by `/lib/section-3d-registry.test.ts` and `/modules/scenarios/process-hollowing/choreography.test.ts`.

---

## 1. Visual Identity — Cel-Shaded Japanese Anime Aesthetic (Zero Japanese Text)

Attack Explorer renders interactive 3D scenes in a crisp, high-contrast **cel-shaded Japanese anime aesthetic** matching the workbench's visual theme while preserving strict English educational clarity:

1. **Cel-Shaded Toon Materials & Ink Linework**:
   - Construct 3D meshes with quantized `THREE.MeshToonMaterial` (using a stepped gradient map from `/components/three/anime-toon-materials.ts`) rather than muddy photorealistic PBR materials.
   - Apply bold anime silhouettes via inverted-hull ink outlines (`addInvertedHullOutline`) on curved/organic props and crisp dark edge lines (`addAnimeInkEdges`) on architectural and mechanical forms.
   - Pair clean high-contrast directional key lighting + cool hemisphere fill + selective emissive accents so dark-mode and light-mode viewports both pop cleanly.
2. **Selective Post-Processing Bloom**:
   - Use `EffectComposer` + `RenderPass` + calibrated `UnrealBloomPass` (with a toggleable **Bloom** control in the HUD) so only intentional emissive indicators (cryo domes, laser/X-ray beams, status beacons, covert payload cores, network courier packets) emit a crisp anime glow without washing out readable signage or silhouettes.
3. **Strict Zero-Japanese-Text Law**:
   - The Japanese anime direction applies strictly to **visual styling** (shapes, cel-shading, outlines, lighting, framing, CSS frame accents).
   - **Zero Japanese characters** (Hiragana, Katakana, or Kanji) may appear anywhere in 3D canvas textures, overhead signboards, floating callouts, HUD badges, phase titles, or UI labels. Automated unit tests enforce `/[\u3040-\u30FF\u4E00-\u9FFF]/` absence across every descriptor and act definition.

---

## 2. Strict Anti-Clutter Law — Zero Glitter, Sparkles, Magic Dust, or Sand Particles

User testing confirmed that decorative floating sparkles, spinning glitter stars, magic dust clouds, or airborne sand/debris fields heavily clutter 3D models and reduce educational readability.

- **Forbidden Effects**:
  - Do **not** add ambient floating sparkle sprites, rotating glitter particles, swirling magic-dust point clouds, or floating sand/grit layers around 3D props.
- **Permitted Purposeful Visual Signals Only**:
  - Visual effects are allowed **only** when they directly represent a concrete story event—such as a cryo-freeze dome shattering into crisp cel-shaded frost shards when a brake is released, an overhead X-ray comparison beam sweeping across two vehicles, directional anime speed lines during launch acceleration, or discrete courier packets traveling along a single clean Bezier arc to a destination tower.
  - Every scene's `update()` callback should return `magicDustIntensity: 0` unless an explicit future user request re-enables decorative particle systems.

---

## 3. Anime-Inspired CSS Canvas Frame & Translucent Floating 3D Labels

1. **Anime-Inspired Outer Canvas Frame**:
   - Wrap every Three.js stage inside the standard anime-styled CSS frame (bold high-contrast border, accent corner registration brackets via CSS pseudo-elements/overlays, top/bottom gradient speed-bar strips, and crisp dark/light adaptive backdrop) so the 3D canvas integrates seamlessly with the workbench cards.
2. **Floating Translucent 3D-Tracked Callout Labels**:
   - Project `primaryAnchor` and `secondaryAnchor` (3D `THREE.Object3D` nodes attached to key story actors/props) into 2D viewport coordinates to render translucent, glass-backed floating label cards with pointer arrows.
   - **Two-Line Educational Hierarchy**:
     - **Top Title**: Plain-language Story label (`Bank Truck`, `Hidden Intruder`, `Official Factory Truck`, `Reprogrammed Truck GPS`).
     - **Bottom Subtitle**: Exact Technical translation in monospace (`Trusted Host · svchost.exe`, `SetThreadContext · RCX → 0x004014A0`).
   - Users can toggle floating labels on or off with the **Labels** button, and the layout helper (`/components/three/floating-callout-layout.ts`) clamps coordinates safely inside the viewport margins away from the HUD chrome.

---

## 4. Camera Framing, Unobstructed Sightlines & Signboard Clearance Rules

Every 3D scene must pass real-browser visual inspection at `1440×900` against these four spatial composition laws:

1. **Zero Foreground Pillar Occlusion**:
   - Never place vertical support posts, gantry legs, or arch columns in the camera foreground (`z > 0`) where they slice across the hero subject or cutaway interior.
   - Always mount garages, X-ray gantries, and sensor arches on **rear-supported cantilevers** (`z <= -2.2`) so the camera has a 100% unobstructed view of the hero prop and its cutaway interior.
2. **Top-Left HUD Safe Zone**:
   - The top-left corner of the viewport hosts the translucent `ACT XX / YY` story/technical card. Position overhead 3D signboards and floating holographic panels slightly right-of-center or vertically clear of the top-left safe zone so the HUD card never covers 3D text.
3. **Signboard-to-Callout Separation**:
   - Keep `primaryAnchor` and `secondaryAnchor` vertically separated from background 3D signboards (for example, placing 3D signboards at `y >= 4.45` and floating callout anchors near the roof of the hero prop at `y ~ 2.75–3.3`) so projected 2D callout badges never overlap 3D signage.
4. **4 Meaningful Camera Presets + Cutaway Support**:
   - Every scene defines 4 curated camera presets (`Director` wide hero framing + 3 targeted close-ups such as interior bay, boarding/entry point, and overhead sensor/comparison).
   - Every scene honors `cutawayMode` (`AUTO`, `OPEN`, `SEALED`) so learners can inspect the exterior disguise, automatically peel open the shell during key actions, or force X-ray inspection at any timestamp.

---

## 5. Performance, Standby Activation & Resource Lifecycle

- **Standby Preview + Viewport Auto-Activation**: Heavy WebGL contexts must not mount simultaneously for every collapsed section on a long page. Render the standardized lightweight preview card (showing stage badge, title, story quote, technical cue, callout chips, and **Launch Interactive Three.js 3D Scene** button) and auto-activate when scrolled into view via `IntersectionObserver`, while releasing inactive contexts cleanly when needed.
- **Deterministic Cleanup (`dispose()`)**: Every scene builder must track and dispose all dynamically generated `CanvasTexture`, `ShaderMaterial`, `BufferGeometry`, and `Material` instances inside `dispose()` on unmount.
- **Software WebGL Resilience**: Pass `isSoftwareGl` into builders so complex shader effects degrade gracefully without throwing runtime WebGL errors on headless or software-rendered GPUs.

---

## 6. Pre-Merge Visual Verification Checklist (`MOD-09`)

- [ ] Are all hero props cel-shaded with crisp anime ink outlines and zero photorealistic noise?
- [ ] Are there **zero** Japanese characters anywhere in 3D canvas textures, callouts, or HUD overlays?
- [ ] Are there **zero** floating glitter, sparkle, sand, or magic-dust particle clouds cluttering the scene?
- [ ] Are all foreground sightlines free of pillars/posts blocking hero props or cutaway interiors?
- [ ] Are all 3D signboards and floating translucent callout labels completely legible with zero overlap against each other or the top-left HUD Act card?
- [ ] Does the browser console report zero WebGL or React errors across initial mount, playback, camera switching, cutaway toggling, and unmount?
