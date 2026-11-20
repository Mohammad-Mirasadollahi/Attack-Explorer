# Scenario domain modules

Attack packages live here. Shared engines stay in `lib/`. Routes stay in `app/scenarios/`.

```
modules/scenarios/<scenario-id>/
  scenario.ts          required
  index.ts             required, generated
  step-guide.ts        optional
  standard-patch.ts    optional
  telemetry.ts         optional
  choreography.ts      optional
  three/               optional presentation; load it from three-registry.ts
```

`contracts.ts` owns authoring types. `legacy/` owns the draft normalizer until those scenarios are rewritten as `AttackScenario`. `lib/scenario-step-guides.ts` only projects guides onto the workbench.

Refresh barrels after adding a package:

```bash
npm run scenarios:registry
```
