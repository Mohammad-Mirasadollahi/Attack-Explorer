# Scenario domain modules

Attack packages live here. Shared engines stay in `lib/`. Routes stay in `app/scenarios/`.

```
modules/scenarios/<scenario-id>/
  index.ts             required — merged scenario + optional stepGuide + standardPatch
  telemetry.ts         optional (presentation helpers; re-exported from index when present)
  choreography.ts      optional
  three/               optional presentation; load it from three-registry.ts
  excalidraw/          optional whiteboard scenes
```

File-budget law: keep related scenario data in **one** `index.ts`. Do not split into
`scenario.ts` / `step-guide.ts` / `standard-patch.ts` / thin barrels.

`contracts.ts` owns authoring types. `legacy/` owns the draft normalizer until those scenarios are rewritten as `AttackScenario`. `lib/scenario-step-guides.ts` only projects guides onto the workbench.

Refresh catalogs after adding a package:

```bash
npm run scenarios:registry
```
