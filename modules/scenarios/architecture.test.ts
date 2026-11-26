import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SCENARIOS_DIR = path.join(ROOT, 'modules/scenarios');

const ROOT_FILES = new Set([
  'README.md',
  'all-scenarios.ts',
  'all-standard-patches.ts',
  'all-step-guides.ts',
  'architecture.test.ts',
  'category-labels.ts',
  'contracts.ts',
  'three-registry.ts',
  'types.ts',
]);

const SPLIT_PARTS = new Set(['scenario.ts', 'step-guide.ts', 'standard-patch.ts']);

function packages(): string[] {
  return fs
    .readdirSync(SCENARIOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => {
      const index = path.join(SCENARIOS_DIR, id, 'index.ts');
      return (
        fs.existsSync(index) &&
        /export const scenario\s*:/.test(fs.readFileSync(index, 'utf8'))
      );
    })
    .sort();
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.open-next') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|mjs|md)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function importSpecifiers(source: string): string[] {
  const specs: string[] = [];
  const patterns = [
    /^\s*import\s[\s\S]*?\sfrom\s+['"]([^'"]+)['"]\s*;/gm,
    /^\s*export\s+(?:type\s+)?(?:\{[\s\S]*?\}|\*)\s*from\s+['"]([^'"]+)['"]\s*;/gm,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specs.push(match[1]);
  }
  return specs;
}

describe('scenario package architecture', () => {
  it('keeps generated catalogs in sync with the filesystem', () => {
    const result = spawnSync(
      process.execPath,
      ['scripts/generate-scenario-registry.mjs', '--check'],
      { cwd: ROOT, encoding: 'utf8' }
    );
    assert.equal(
      result.status,
      0,
      result.stderr || result.stdout || 'registry check failed'
    );
  });

  it('requires one merged index.ts per package (no split scenario/guide/patch files)', () => {
    const registry = fs.readFileSync(
      path.join(SCENARIOS_DIR, 'three-registry.ts'),
      'utf8'
    );
    for (const id of packages()) {
      const dir = path.join(SCENARIOS_DIR, id);
      for (const name of SPLIT_PARTS) {
        assert.equal(
          fs.existsSync(path.join(dir, name)),
          false,
          `${id} must not keep split file ${name}`
        );
      }

      const index = fs.readFileSync(path.join(dir, 'index.ts'), 'utf8');
      assert.match(index, /export const scenario\s*:/);
      const idMatch = index.match(/id:\s*'([^']+)'/);
      assert.equal(idMatch?.[1], id, `${id} scenario id`);
      assert.doesNotMatch(index, /from '\.\/three'/);

      if (/export const stepGuide\s*:/.test(index)) {
        assert.match(index, new RegExp(`scenarioId:\\s*'${id}'`));
      }

      if (fs.existsSync(path.join(dir, 'three'))) {
        assert.equal(
          fs.existsSync(path.join(dir, 'three', 'index.ts')),
          true,
          `${id} three entry`
        );
        assert.match(registry, new RegExp(`'${id}'`));
      }
    }
  });

  it('points domain imports at contracts, and Three.js only at shared stage code', () => {
    for (const id of packages()) {
      const dir = path.join(SCENARIOS_DIR, id);
      for (const file of walk(dir)) {
        const rel = path.relative(dir, file);
        const specs = importSpecifiers(fs.readFileSync(file, 'utf8'));
        const inThree = rel.startsWith(`three${path.sep}`) || rel.startsWith('three/');
        const inExcalidraw =
          rel.startsWith(`excalidraw${path.sep}`) || rel.startsWith('excalidraw/');
        const inPresentation = inThree || inExcalidraw;
        for (const spec of specs) {
          if (!spec.startsWith('.') && !spec.startsWith('@/')) {
            const nodeBuiltin = spec.startsWith('node:') || spec === 'node:test';
            assert.ok(
              inPresentation || (rel.endsWith('.test.ts') && nodeBuiltin),
              `${id}/${rel} imports package ${spec}`
            );
            continue;
          }
          if (spec.startsWith('.')) {
            const outside = spec.split('/').filter((part) => part === '..').length;
            if (inPresentation) {
              assert.ok(outside <= 1, `${id}/${rel} escapes via ${spec}`);
            } else {
              assert.ok(
                outside === 0 ||
                  spec.startsWith('../types') ||
                  spec.startsWith('../contracts') ||
                  spec.startsWith('../category-labels'),
                `${id}/${rel} imports ${spec}`
              );
            }
            continue;
          }
          if (inThree) {
            assert.ok(
              spec.startsWith('@/components/three/') ||
                spec === '@/lib/section-3d-registry' ||
                spec.startsWith('@/modules/scenarios/'),
              `${id}/${rel} imports ${spec}`
            );
            continue;
          }
          if (inExcalidraw) {
            assert.ok(
              spec.startsWith('@/modules/scenarios/') ||
                spec.startsWith('@/components/excalidraw/') ||
                spec === '@/lib/section-3d-registry' ||
                spec === '@/lib/section-excalidraw-registry',
              `${id}/${rel} imports ${spec}`
            );
            continue;
          }
          assert.ok(
            spec.startsWith('@/modules/scenarios/'),
            `${id}/${rel} must not depend on ${spec}`
          );
        }
      }
    }
  });

  it('enforces Phase 1 clean-slate purge: legacy drafts and generic template engines are removed', () => {
    assert.equal(fs.existsSync(path.join(SCENARIOS_DIR, 'legacy')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'components/three/scenes')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/section-3d-registries')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/scenario-2d-blueprints')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/malware-2d-blueprints')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'components/technical-clip/malware-clips')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/step-guides')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/scenario-cinema-profiles.ts')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/scenario-real-world-stories.ts')), false);
    assert.equal(fs.existsSync(path.join(SCENARIOS_DIR, 'process-hollowing/index.ts')), true);
  });

  it('rejects removed compatibility paths and legacy draft imports across source code', () => {
    assert.equal(fs.existsSync(path.join(ROOT, 'lib/scenarios')), false);
    assert.equal(
      fs.existsSync(path.join(ROOT, 'lib/process-hollowing-3d-choreography.ts')),
      false
    );
    assert.equal(
      fs.existsSync(path.join(ROOT, 'components/three/scenarios')),
      false
    );

    const codeRoots = ['app', 'components', 'lib', 'modules', 'scripts'].map((name) =>
      path.join(ROOT, name)
    );
    for (const root of codeRoots) {
      if (!fs.existsSync(root)) continue;
      for (const file of walk(root)) {
        if (file.endsWith(`${path.sep}architecture.test.ts`)) continue;
        const rel = path.relative(ROOT, file);
        const source = fs.readFileSync(file, 'utf8');
        assert.equal(source.includes('@/lib/scenarios'), false, rel);
        assert.equal(source.includes('lib/scenarios/'), false, rel);
        assert.equal(
          source.includes('legacy/normalize-legacy-draft-scenario'),
          false,
          `${rel} must not reference removed legacy draft normalizer`
        );
      }
    }
  });

  it('does not leave unexpected files in the scenarios root', () => {
    for (const name of fs.readdirSync(SCENARIOS_DIR)) {
      const full = path.join(SCENARIOS_DIR, name);
      if (fs.statSync(full).isDirectory()) {
        assert.ok(packages().includes(name), name);
        continue;
      }
      assert.ok(ROOT_FILES.has(name), name);
    }
  });
});
