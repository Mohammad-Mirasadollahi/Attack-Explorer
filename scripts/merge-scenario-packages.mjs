#!/usr/bin/env node
/**
 * One-shot / idempotent: merge scenario.ts + step-guide.ts + standard-patch.ts
 * into modules/scenarios/<id>/index.ts, then delete the split files.
 *
 * process-hollowing keeps choreography.ts / telemetry.ts (and three/, excalidraw/).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCENARIOS_DIR = path.join(ROOT, 'modules/scenarios');
const SKIP_DIRS = new Set(['legacy']);
const PARTS = ['scenario.ts', 'step-guide.ts', 'standard-patch.ts'];

function listPackages() {
  return fs
    .readdirSync(SCENARIOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP_DIRS.has(entry.name))
    .map((entry) => entry.name)
    .filter((id) => {
      const dir = path.join(SCENARIOS_DIR, id);
      return (
        fs.existsSync(path.join(dir, 'scenario.ts')) ||
        (fs.existsSync(path.join(dir, 'index.ts')) &&
          /export const scenario\s*:/.test(fs.readFileSync(path.join(dir, 'index.ts'), 'utf8')))
      );
    })
    .sort();
}

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

/** Split a TS module into import block + body (best-effort for our data files). */
function splitModule(source) {
  const text = stripBom(source).replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const imports = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' && imports.length === 0) {
      i += 1;
      continue;
    }
    if (/^\s*import\b/.test(line)) {
      let chunk = line;
      while (!/;/.test(chunk) && i + 1 < lines.length) {
        i += 1;
        chunk += `\n${lines[i]}`;
      }
      imports.push(chunk.trim());
      i += 1;
      continue;
    }
    break;
  }
  const body = lines.slice(i).join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  return { imports, body };
}

function importKey(stmt) {
  const from = stmt.match(/\bfrom\s+['"]([^'"]+)['"]/);
  const typeOnly = /^\s*import\s+type\b/.test(stmt);
  return `${typeOnly ? 'type:' : 'value:'}${from ? from[1] : stmt}`;
}

/** Merge `import type { A }` + `import type { B }` from the same module. */
function mergeTypeImports(stmts) {
  const byFrom = new Map();
  const other = [];
  for (const stmt of stmts) {
    const m = stmt.match(
      /^import type \{([^}]+)\}\s*from\s+['"]([^'"]+)['"]\s*;?$/
    );
    if (!m) {
      other.push(stmt);
      continue;
    }
    const names = m[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const from = m[2];
    if (!byFrom.has(from)) byFrom.set(from, new Set());
    for (const name of names) byFrom.get(from).add(name);
  }
  const merged = [...byFrom.entries()].map(
    ([from, names]) =>
      `import type { ${[...names].join(', ')} } from '${from}';`
  );
  return [...other, ...merged];
}

function mergePackage(id) {
  const dir = path.join(SCENARIOS_DIR, id);
  const present = PARTS.filter((name) => fs.existsSync(path.join(dir, name)));
  if (present.length === 0) {
    // Already merged — ensure optional presentation re-exports remain.
    return { id, skipped: true, reason: 'already-merged' };
  }

  const importMap = new Map();
  const bodies = [];

  for (const name of present) {
    const { imports, body } = splitModule(fs.readFileSync(path.join(dir, name), 'utf8'));
    for (const stmt of imports) {
      // Drop self-barrels / cross-part relative imports that vanish after merge
      if (/\bfrom\s+['"]\.\/(scenario|step-guide|standard-patch)['"]/.test(stmt)) continue;
      const key = importKey(stmt);
      if (!importMap.has(key)) importMap.set(key, stmt);
    }
    if (body.trim()) bodies.push(body.trim());
  }

  const extras = [];
  if (fs.existsSync(path.join(dir, 'choreography.ts'))) {
    extras.push(`export * from './choreography';`);
  }
  if (fs.existsSync(path.join(dir, 'telemetry.ts'))) {
    // scenario body may already import from './telemetry' — keep that; also re-export
    extras.push(`export * from './telemetry';`);
  }

  const merged = [
    ...mergeTypeImports([...importMap.values()]),
    '',
    ...bodies,
    ...(extras.length ? ['', ...extras] : []),
    '',
  ].join('\n');

  fs.writeFileSync(path.join(dir, 'index.ts'), merged);
  for (const name of present) {
    fs.unlinkSync(path.join(dir, name));
  }

  return { id, skipped: false, merged: present, deleted: present.length };
}

const packages = listPackages();
const results = packages.map(mergePackage);
const merged = results.filter((r) => !r.skipped);
const skipped = results.filter((r) => r.skipped);

console.log(
  `merged ${merged.length} packages; skipped ${skipped.length}; deleted ${merged.reduce((n, r) => n + r.deleted, 0)} split files`
);
