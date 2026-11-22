#!/usr/bin/env node
/**
 * Writes the slim sidebar catalog and one prepared JSON file per scenario.
 * The workbench fetches a single file when a scenario is opened.
 *
 * Usage: node scripts/generate-scenario-data.mjs
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'public', 'scenario-data');
const CATALOG_PATH = path.join(ROOT, 'lib', 'scenario-catalog.generated.json');
const DFIR_PATH = path.join(ROOT, 'lib', 'dfir-records.generated.json');
const BUNDLE_PATH = path.join(ROOT, '.tmp-scenario-data-source.mjs');

await esbuild.build({
  entryPoints: [path.join(ROOT, 'scripts', 'scenario-data-source.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: BUNDLE_PATH,
  alias: { '@': ROOT },
  logLevel: 'warning',
});

const source = await import(`${pathToFileURL(BUNDLE_PATH).href}?t=${Date.now()}`);
const rows = source.collectScenarioData();
fs.rmSync(BUNDLE_PATH, { force: true });

fs.mkdirSync(OUT_DIR, { recursive: true });
const keep = new Set();
const hash = createHash('sha256');

for (const row of rows) {
  const fileName = `${row.scenario.id}.json`;
  keep.add(fileName);
  const body = JSON.stringify({ scenario: row.scenario, guide: row.guide });
  hash.update(body);
  fs.writeFileSync(path.join(OUT_DIR, fileName), body);
}

for (const existing of fs.readdirSync(OUT_DIR)) {
  if (!keep.has(existing)) fs.rmSync(path.join(OUT_DIR, existing));
}

const catalog = {
  revision: hash.digest('hex').slice(0, 12),
  entries: rows.map((row) => row.catalog),
};
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog));
fs.writeFileSync(DFIR_PATH, JSON.stringify(source.collectDfirRecords()));

const catalogBytes = fs.statSync(CATALOG_PATH).size;
const dataBytes = [...keep].reduce(
  (sum, name) => sum + fs.statSync(path.join(OUT_DIR, name)).size,
  0
);
console.log(
  `scenario data: ${rows.length} files, catalog ${(catalogBytes / 1024).toFixed(0)}KB, payloads ${(dataBytes / 1024 / 1024).toFixed(1)}MB, revision ${catalog.revision}`
);
