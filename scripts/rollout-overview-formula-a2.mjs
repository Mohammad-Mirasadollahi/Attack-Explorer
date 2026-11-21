#!/usr/bin/env node
/**
 * Bulk-roll MOD-11 Formula A2 Overview plainSummary across all non-MALWARE
 * scenarios that still fail validateOverviewRoadmapAltitude.
 *
 * - Scenarios with modules/scenarios/<id>/step-guide.ts → patch plainSummary
 * - Draft / generated guides → write into
 *   DFIR_FORMULA_A2_PLAIN_SUMMARIES (lib/step-guides/vulncheck-cwp-and-dfir-guides.ts)
 * - Also patch standard-patch.ts when it overrides briefing.plainSummary
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = process.cwd();

function esc(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTechNoise(text) {
  return String(text || '')
    .replace(/`+/g, '')
    .replace(/\*\*/g, '')
    .replace(/—/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildRoadmap(scenario, guide) {
  const mitre =
    scenario.mitreTechniqueIds?.[0] ||
    scenario.code ||
    guide?.steps?.[0]?.mitreId ||
    'ATT&CK';
  const name = stripTechNoise(scenario.name || scenario.id);
  const stages = scenario.stages || [];
  const n = stages.length || guide?.steps?.length || 1;

  const hostHint = (() => {
    const ov = stripTechNoise(scenario.overview || '');
    const ip = ov.match(/\b(?:10|192\.168|172\.(?:1[6-9]|2\d|3[0-1]))\.\d{1,3}\.\d{1,3}\b/);
    const host = ov.match(
      /\b(?:WKS|SRV|DC|NOC|FW|VPN|ESXi|DEV)-[A-Z0-9-]+\b|\b[A-Z]{2,}-[A-Z0-9-]{2,}\.(?:corp|local|lab)\b/
    );
    if (host && ip) return ` on ${host[0]} (${ip[0]})`;
    if (host) return ` on ${host[0]}`;
    if (ip) return ` at ${ip[0]}`;
    return '';
  })();

  const titles = (guide?.steps?.length ? guide.steps : stages).map((st, i) => {
    const title = stripTechNoise(
      st.plainTitle ||
        st.title?.replace(/^Stage\s+\d+:\s*/i, '') ||
        `Stage ${i + 1}`
    );
    return title.length > 72 ? `${title.slice(0, 69)}...` : title;
  });

  const arcBits = titles
    .slice(0, Math.min(4, titles.length))
    .map((t) => t.replace(/\([^)]{40,}\)/g, '').trim())
    .filter(Boolean);
  const arc =
    arcBits.length > 0
      ? arcBits.join(', then ').replace(/,\s*then\s*$/, '')
      : 'initial access, privilege expansion, and objective completion';

  const stepMap =
    n === 1
      ? `Step #1 examines ${titles[0] || 'the documented kill-chain stage'}`
      : n === 2
        ? `Steps #1–#2 examine ${titles[0]} then ${titles[1]}`
        : `Steps #1–#${n} examine ${titles
            .map((t, i) => `#${i + 1} ${t}`)
            .join('; ')}`;

  const hasMemory = Boolean(scenario.memoryBlocks?.length);
  const memoryClause = hasMemory
    ? ' The Memory tab shows the documented in-memory forensic contrast.'
    : '';

  const detection = (() => {
    const firstLog = stages[0]?.logs?.[0];
    if (firstLog?.source && firstLog?.EventCode != null) {
      return `Primary detection pivots on ${stripTechNoise(String(firstLog.source))} Event ${firstLog.EventCode} correlated across the documented kill chain.`;
    }
    if (firstLog?.source) {
      return `Primary detection pivots on ${stripTechNoise(String(firstLog.source))} telemetry correlated across the documented kill chain.`;
    }
    return `Primary detection pivots on correlated host and network telemetry for ${mitre} across the documented kill chain.`;
  })();

  let summary = `In this scenario (${mitre}, ${name})${hostHint}, the attacker follows one continuous arc: ${arc}. ${stepMap}.${memoryClause} ${detection}`;
  summary = stripTechNoise(summary);

  // Keep under hard max 950; prefer 350–850.
  if (summary.length > 900) {
    const shortMap =
      n <= 2
        ? stepMap
        : `Steps #1–#${n} walk the documented stages end-to-end (${titles
            .slice(0, 3)
            .join('; ')}${n > 3 ? '; ...' : ''})`;
    summary = stripTechNoise(
      `In this scenario (${mitre}, ${name})${hostHint}, the attacker follows one continuous arc: ${arcBits
        .slice(0, 3)
        .join(', then ')}. ${shortMap}.${memoryClause} ${detection}`
    );
  }
  if (summary.length > 950) {
    summary = `${summary.slice(0, 947)}...`;
  }
  if (summary.length < 120) {
    summary = `${summary} Defenders use Steps #1–#${n} to reconstruct the full chain and confirm impact.`;
  }
  return summary;
}

function replacePlainSummaryInFile(filePath, newSummary) {
  const src = fs.readFileSync(filePath, 'utf8');
  const re =
    /(plainSummary:\s*\n\s*)('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|`(?:\\`|[^`])*`)/;
  if (!re.test(src)) {
    return { ok: false, reason: 'plainSummary literal not found' };
  }
  const next = src.replace(re, `$1'${esc(newSummary)}'`);
  if (next === src) return { ok: false, reason: 'no change' };
  fs.writeFileSync(filePath, next);
  return { ok: true };
}

function upsertDfira2Map(entries) {
  const file = path.join(
    root,
    'lib/step-guides/vulncheck-cwp-and-dfir-guides.ts'
  );
  let src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf('const DFIR_FORMULA_A2_PLAIN_SUMMARIES');
  if (start < 0) throw new Error('DFIR_FORMULA_A2_PLAIN_SUMMARIES not found');
  const brace = src.indexOf('{', start);
  let i = brace + 1;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  const end = i; // after closing }
  const existingBlock = src.slice(brace, end);
  const map = new Map();
  for (const m of existingBlock.matchAll(
    /'([^']+)':\s*\n\s*'((?:\\'|[^'])*)'/g
  )) {
    map.set(m[1], m[2].replace(/\\'/g, "'"));
  }
  for (const [id, text] of Object.entries(entries)) {
    map.set(id, text);
  }
  const body = [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([id, text]) => `  '${id}':\n    '${esc(text)}',`)
    .join('\n');
  const rebuilt = `{\n${body}\n}`;
  src = src.slice(0, brace) + rebuilt + src.slice(end);
  fs.writeFileSync(file, src);
  return map.size;
}

async function main() {
  // Dynamic import compiled via tsx when invoked as: npx tsx scripts/...
  const { ATTACK_SCENARIOS } = await import('../lib/attack-scenarios.ts');
  const { getRawScenarioStepGuide } = await import(
    '../lib/scenario-step-guides.ts'
  );
  const { validateOverviewRoadmapAltitude } = await import(
    '../lib/documentation-standards.ts'
  );

  const draftIds = new Set();
  const mapEntries = {};
  const patched = [];
  const failed = [];

  for (const scenario of ATTACK_SCENARIOS) {
    if (scenario.category === 'MALWARE') continue;
    const guide = getRawScenarioStepGuide(scenario.id);
    const current = guide?.briefing?.plainSummary || '';
    const check = validateOverviewRoadmapAltitude(current, scenario.id);
    if (check.valid) continue;

    let summary = buildRoadmap(scenario, guide);
    let v = validateOverviewRoadmapAltitude(summary, scenario.id);
    // Retry once with forced Steps # mention if needed
    if (!v.valid && !/Steps?\s*#/i.test(summary)) {
      summary = `${summary.replace(/\.\s*$/, '')}. Steps #1–#${
        scenario.stages.length
      } examine the documented kill-chain stages.`;
      v = validateOverviewRoadmapAltitude(summary, scenario.id);
    }
    // Trim tokens if too many technical tokens
    if (!v.valid && v.violations.some((x) => x.includes('technical tokens'))) {
      summary = `In this scenario (${
        scenario.mitreTechniqueIds?.[0] || scenario.code || 'ATT&CK'
      }, ${stripTechNoise(scenario.name)}), the attacker completes a documented intrusion arc across the topology. Steps #1–#${
        scenario.stages.length
      } examine each stage end-to-end. Primary detection pivots on correlated host and network telemetry for this technique.`;
      v = validateOverviewRoadmapAltitude(summary, scenario.id);
    }
    if (!v.valid) {
      failed.push({ id: scenario.id, violations: v.violations, summary });
      continue;
    }

    const sgPath = path.join(
      root,
      'modules/scenarios',
      scenario.id,
      'step-guide.ts'
    );
    const spPath = path.join(
      root,
      'modules/scenarios',
      scenario.id,
      'standard-patch.ts'
    );

    if (fs.existsSync(sgPath)) {
      const r = replacePlainSummaryInFile(sgPath, summary);
      if (!r.ok) {
        // Fall back to map override for generated merge paths
        mapEntries[scenario.id] = summary;
        draftIds.add(scenario.id);
        patched.push({ id: scenario.id, via: 'map-fallback', len: summary.length });
      } else {
        patched.push({ id: scenario.id, via: 'step-guide', len: summary.length });
      }
      if (fs.existsSync(spPath)) {
        const spSrc = fs.readFileSync(spPath, 'utf8');
        if (/plainSummary\s*:/.test(spSrc)) {
          replacePlainSummaryInFile(spPath, summary);
          patched.push({
            id: scenario.id,
            via: 'standard-patch',
            len: summary.length,
          });
        }
      }
    } else {
      mapEntries[scenario.id] = summary;
      draftIds.add(scenario.id);
      patched.push({ id: scenario.id, via: 'dfir-map', len: summary.length });
    }
  }

  if (Object.keys(mapEntries).length > 0) {
    const size = upsertDfira2Map(mapEntries);
    console.log('Updated DFIR_FORMULA_A2_PLAIN_SUMMARIES size=', size);
  }

  console.log('patched', patched.length);
  for (const p of patched) {
    console.log(`  OK ${p.len}\t${p.via}\t${p.id}`);
  }
  if (failed.length) {
    console.log('FAILED_TO_BUILD', failed.length);
    for (const f of failed) {
      console.log(`  FAIL ${f.id}`, f.violations.join(' | '));
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
