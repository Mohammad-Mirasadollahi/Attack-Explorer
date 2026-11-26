import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  CAMERA_STYLE_OFFSETS,
  CINEMA_ATMOSPHERES,
  CLIP_2D_THEMES,
  REAL_WORLD_ENVIRONMENTS,
  SCENARIO_CINEMA_PROFILES,
  getScenarioCinemaProfile,
} from './scenario-cinema-profiles';
import { ALL_SCENARIO_STEP_GUIDES } from './scenario-step-guide-index';
import {
  findTechnicalJargonInStory,
  getSection3DDescriptor,
} from './section-3d-registry';
import { resolveCinema2DLayoutPlan } from '../components/technical-clip/malware-clips/Cinema2DStoryArt';
import type { Clip2DLayoutGeometry } from './scenario-cinema-profiles-core';

const ROOT = process.cwd();
const JAPANESE_REGEX = /[\u3040-\u30FF\u4E00-\u9FFF¥]/;

function walkFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, out);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

test('100% of scenarios have a unique 3D and 2D real-world cinema profile with zero collisions and 3-way alignment', () => {
  const scenarioIds = ATTACK_SCENARIOS.map((s) => s.id);
  assert.equal(
    Object.keys(SCENARIO_CINEMA_PROFILES).length,
    scenarioIds.length,
    'Every scenario must have an entry in SCENARIO_CINEMA_PROFILES'
  );

  const seen3D = new Map<string, string>();
  const seen2D = new Map<string, string>();
  const seenTitles = new Map<string, string>();

  const usedAtmospheres = new Set<string>();
  const usedSets = new Set<string>();
  const usedHeroes = new Set<string>();
  const used2DThemes = new Set<string>();
  const used2DMotifs = new Set<string>();
  const used2DLayouts = new Set<string>();

  for (const id of scenarioIds) {
    const p = getScenarioCinemaProfile(id);
    assert.equal(p.scenarioId, id, `Profile mismatch for ${id}`);
    assert.ok(CINEMA_ATMOSPHERES[p.atmosphere], `Valid atmosphere for ${id}`);
    assert.ok(CAMERA_STYLE_OFFSETS[p.cameraStyle], `Valid camera style for ${id}`);
    assert.ok(CLIP_2D_THEMES[p.clip2DTheme], `Valid 2D theme for ${id}`);
    assert.equal(p.phaseRibbon.length, 4, `4 phase ribbon labels for ${id}`);

    const env = REAL_WORLD_ENVIRONMENTS[p.spatialSet];
    assert.ok(env, `Valid real-world environment for ${id}`);
    assert.equal(
      p.heroKinetic,
      env.heroKinetic,
      `3D hero mechanism must match real-world place 1-to-1 for ${id}`
    );
    assert.equal(
      p.clip2DStoryMotif,
      p.spatialSet,
      `2D architectural motif must match 3D real-world place 1-to-1 for ${id}`
    );

    const fp3D = `${p.atmosphere}|${p.spatialSet}|${p.heroKinetic}`;
    assert.ok(
      !seen3D.has(fp3D),
      `3D cinema collision on ${fp3D} between ${seen3D.get(fp3D)} and ${id}`
    );
    seen3D.set(fp3D, id);

    const fp2D = `${p.clip2DTheme}|${p.clip2DStoryMotif}|${p.clip2DLayout}`;
    assert.ok(
      !seen2D.has(fp2D),
      `2D cinema collision on ${fp2D} between ${seen2D.get(fp2D)} and ${id}`
    );
    seen2D.set(fp2D, id);

    const titleKey = p.filmTitle.trim().toLowerCase();
    assert.ok(
      !seenTitles.has(titleKey),
      `Film title collision "${p.filmTitle}" between ${seenTitles.get(titleKey)} and ${id}`
    );
    seenTitles.set(titleKey, id);

    usedAtmospheres.add(p.atmosphere);
    usedSets.add(p.spatialSet);
    usedHeroes.add(p.heroKinetic);
    used2DThemes.add(p.clip2DTheme);
    used2DMotifs.add(p.clip2DStoryMotif);
    used2DLayouts.add(p.clip2DLayout);

    // 3-Way Alignment Check: Story Text <-> 3D Descriptor <-> Real-World Environment
    const guide = ALL_SCENARIO_STEP_GUIDES[id];
    const desc3D = getSection3DDescriptor(id, 'briefing');
    assert.ok(guide, `Step guide exists for ${id}`);
    assert.ok(desc3D, `Briefing 3D descriptor exists for ${id}`);

    if (id === 'process-hollowing') {
      assert.match(
        desc3D.storyCue.toLowerCase(),
        /armored bank truck/,
        'process-hollowing must remain untouched as the Armored Bank Truck benchmark'
      );
    } else {
      const guideText = guide.briefing.storyAnalogy.toLowerCase();
      const descText = desc3D.storyCue.toLowerCase();
      const hasKeywordInGuide = env.storyKeywords.some((kw) =>
        guideText.includes(kw.toLowerCase())
      );
      const hasKeywordIn3D = env.storyKeywords.some((kw) =>
        descText.includes(kw.toLowerCase())
      );
      assert.ok(
        hasKeywordInGuide,
        `Step guide briefing story for ${id} must reference its real-world place (${p.spatialSet})`
      );
      assert.ok(
        hasKeywordIn3D,
        `3D briefing storyCue for ${id} must reference its real-world place (${p.spatialSet})`
      );
      assert.deepEqual(
        findTechnicalJargonInStory(guide.briefing.storyAnalogy),
        [],
        `Briefing storyAnalogy for ${id} must be 100% jargon-free`
      );
      assert.deepEqual(
        findTechnicalJargonInStory(desc3D.storyCue),
        [],
        `3D briefing storyCue for ${id} must be 100% jargon-free`
      );
    }

    // Zero Japanese characters in any cinema profile text
    const combinedText = [
      p.filmTitle,
      p.genre,
      p.settingLabel,
      p.realWorldPlace,
      ...p.phaseRibbon,
      p.castSummary.protagonist,
      p.castSummary.targetAsset,
      p.castSummary.untouchedControl,
      p.castSummary.witness,
    ].join(' ');
    assert.ok(
      !JAPANESE_REGEX.test(combinedText),
      `Japanese characters found in cinema profile for ${id}`
    );
  }

  assert.equal(usedAtmospheres.size, 18, 'All 18 3D atmospheres must be utilized');
  assert.equal(usedSets.size, 28, 'All 28 real-world 3D environments must be utilized');
  assert.equal(usedHeroes.size, 28, 'All 28 real-world 3D hero props must be utilized');
  assert.equal(used2DThemes.size, 14, 'All 14 2D themes must be utilized');
  assert.equal(used2DMotifs.size, 28, 'All 28 real-world 2D architectural motifs must be utilized');
  assert.equal(used2DLayouts.size, 8, 'All 8 2D layout geometries must be utilized');
});

test('All 188 screenplays exist in /docs/screenplays/ and are strictly excluded from UI code', () => {
  const screenplayDir = path.join(ROOT, 'docs', 'screenplays');
  const readmePath = path.join(screenplayDir, 'README.md');
  assert.ok(fs.existsSync(readmePath), 'docs/screenplays/README.md must exist');

  const readme = fs.readFileSync(readmePath, 'utf8');
  const categoryDocs = fs
    .readdirSync(screenplayDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => fs.readFileSync(path.join(screenplayDir, f), 'utf8'))
    .join('\n');

  for (const s of ATTACK_SCENARIOS) {
    assert.ok(
      readme.includes(`\`${s.id}\``),
      `Scenario ${s.id} must be listed in docs/screenplays/README.md comparison matrix`
    );
    assert.ok(
      categoryDocs.includes(`\`${s.id}\``),
      `Scenario ${s.id} must have a dedicated screenplay entry in docs/screenplays/*.md`
    );
  }

  // Strictly docs-only: zero references to docs/screenplays anywhere in app/ or components/
  const uiFiles = [
    ...walkFiles(path.join(ROOT, 'app')),
    ...walkFiles(path.join(ROOT, 'components')),
  ];
  for (const file of uiFiles) {
    const src = fs.readFileSync(file, 'utf8');
    assert.ok(
      !src.includes('docs/screenplays'),
      `UI file ${path.relative(ROOT, file)} must NOT reference docs/screenplays`
    );
  }
});

test('Cinema2DStoryArt preserves GSAP SVG safety invariants and clean 1200x640 layout bounds', () => {
  const artPath = path.join(
    ROOT,
    'components',
    'technical-clip',
    'malware-clips',
    'Cinema2DStoryArt.tsx'
  );
  const src = fs.readFileSync(artPath, 'utf8');
  assert.ok(!JAPANESE_REGEX.test(src), 'No Japanese characters in Cinema2DStoryArt.tsx');
  assert.ok(
    !/<g[^>]*className=[^>]*transform="translate|<g[^>]*transform="translate[^>]*className=/.test(
      src
    ),
    'Cinema2DStoryArt.tsx must never combine className and transform="translate(...)" on the same <g>'
  );

  const layouts: Clip2DLayoutGeometry[] = [
    'horizontal-pipeline',
    'vertical-shaft-cascade',
    'orbital-hub-spokes',
    'diagonal-escalation-bridge',
    'split-mirror-comparison',
    'conveyor-assembly-track',
    'radial-broadcast-fan',
    'vault-cutaway-blueprint',
  ];
  for (const layout of layouts) {
    const plan = resolveCinema2DLayoutPlan(layout);
    const { x, y, w, h } = plan.theaterRect;
    assert.ok(x >= 0 && x + w <= 1200, `Theater X bounds valid for ${layout}`);
    assert.ok(y >= 38 && y + h <= 550, `Theater Y bounds stay clear of header & bottom log strip for ${layout}`);
  }
});
