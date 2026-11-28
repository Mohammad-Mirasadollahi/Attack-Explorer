# Bespoke Scenario Domain Modules (`MOD-17`)

Every published attack episode lives here as a **self-contained, 100% bespoke package** authored one-by-one in exact Sidebar order under [`/docs/standards/17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md`](../../docs/standards/17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md) (`MOD-17`) and tracked in [`/docs/redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md`](../../docs/redesign-backlog/MASTER-BACKLOG-SIDEBAR-ORDER.md).

- **Golden Benchmark (`#001`)**: `modules/scenarios/process-hollowing/` — preserved untouched as the permanent craft baseline.
- **Shared Playback Shell Only**: Reusable player HUD, camera controls, WebGL lifecycle/disposal, optional material helpers, and dynamic lazy loading live in `components/three/`, `components/technical-clip/`, and `components/excalidraw/`. Shared shells never inject generic characters, props, story beats, or a fixed visual style/template.

```
modules/scenarios/<scenario-id>/
  index.ts               required — full AttackScenario + stepGuide + primary sources (MOD-01..MOD-08)
  telemetry.ts           optional — telemetry presentation helpers; re-exported from index when present
  choreography.ts        required — pure 0%..100% physical articulation math (zero Three.js imports)
  choreography.test.ts   required — pure node:test assertions for timeline monotonicity & bounds
  three/                 required — bespoke Three.js world, articulated hero mechanisms, & camera presets
  excalidraw/            required — bespoke static chalk whiteboard scenes & hover tooltip cards (MOD-13)
```

> **Note on Bespoke 2D Technical Clips (`MOD-14`)**: Per-step SVG + GSAP silent lectures live under `components/technical-clip/clips/<scenario-id>/` (or co-located clip modules) and are registered lazily in `lib/section-technical-clip-registry.ts`.

## Production Laws

1. **One-Scenario-Per-Turn**: Never scaffold or batch-generate multiple scenarios in a single turn. Draft and obtain User Approval for the Phase 0 Director's Blueprint (`/docs/screenplays/bespoke/<NNN>-<scenario-id>.md`) before creating any package directory.
2. **File-Budget Law**: Keep core scenario metadata, kill-chain stages, logs, memory forensics, and step guide in **one** `index.ts`. Do not fragment into thin barrel files.
3. **Legacy Retirement (`legacy/`)**: `contracts.ts` owns authoring types. `legacy/` is scheduled for complete removal during the Phase 1 Clean-Slate Code Purge (`MOD-17 §2.2`).

Refresh catalogs after adding a bespoke episode:

```bash
npm run scenarios:registry
```
