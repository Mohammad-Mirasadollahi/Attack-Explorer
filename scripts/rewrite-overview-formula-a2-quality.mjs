#!/usr/bin/env node
/**
 * Quality rewrite for MOD-11 Formula A2 Overview plainSummary.
 * Rebuilds roadmaps that fail the strengthened validateOverviewRoadmapAltitude
 * (ellipsis truncation, generic detection filler, missing WHO/arc framing).
 */
import fs from 'node:fs';
import path from 'node:path';

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

const TRAILING_STOP = new Set([
  'the',
  'a',
  'an',
  'into',
  'via',
  'to',
  'of',
  'for',
  'and',
  'or',
  'with',
  'in',
  'on',
  'from',
  'over',
  'as',
  'by',
  'at',
]);

function stripTrailingStops(words) {
  const out = [...words];
  while (out.length > 1 && TRAILING_STOP.has(out[out.length - 1].toLowerCase())) {
    out.pop();
  }
  return out;
}

/** Short readable phrase from a step/stage title — never uses "...". */
function toPlainPhrase(title, max = 52) {
  let t = stripTechNoise(title);
  t = t.replace(/\s*\((?:CVE|T\d)[^)]*\)\s*/gi, ' ');
  t = t.replace(/\s*\([^)]{0,100}\)\s*/g, ' ');
  t = t.replace(/\.{3,}/g, ' ');
  // Semicolons become Technical Overview clause breaks in the UI.
  t = t.replace(/;/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  if (t.includes(' & ')) t = t.split(' & ')[0].trim();
  if (t.includes(', then ')) t = t.split(', then ')[0].trim();
  let words = t.split(/\s+/).filter(Boolean);
  if (words.join(' ').length > max) {
    const out = [];
    for (const w of words) {
      const next = [...out, w].join(' ');
      if (next.length > max) break;
      out.push(w);
    }
    words = out;
  }
  words = stripTrailingStops(words);
  t = words.join(' ') || t.slice(0, max);
  return t.replace(/[.,;:]+$/g, '').trim();
}

function hostHint(scenario) {
  const ov = stripTechNoise(scenario.overview || '');
  const ip = ov.match(
    /\b(?:10|192\.168|172\.(?:1[6-9]|2\d|3[0-1]))\.\d{1,3}\.\d{1,3}\b/
  );
  const host = ov.match(
    /\b(?:WKS|SRV|DC|NOC|FW|VPN|ESXi|DEV)-[A-Z0-9-]+\b|\b[A-Z]{2,}-[A-Z0-9-]{2,}\.(?:corp|local|lab)\b/
  );
  if (host && ip) return ` on ${host[0]} (${ip[0]})`;
  if (host) return ` on ${host[0]}`;
  if (ip) return ` at ${ip[0]}`;
  return '';
}

function detectionPivot(scenario, guide) {
  const stages = scenario.stages || [];
  const firstLog = stages[0]?.logs?.[0];
  const detText = (guide?.steps || [])
    .map((s) => s.detectionAndEvidence || '')
    .join(' ');

  if (firstLog?.source && firstLog?.EventCode != null) {
    return `Primary detection pivots on ${stripTechNoise(String(firstLog.source))} Event ${firstLog.EventCode} correlated across the documented kill chain.`;
  }

  const sysmon = detText.match(
    /Sysmon(?:\s+(?:EID|Event(?:\s*ID)?))?\s*(\d+(?:\s*(?:\/|,|and|&)\s*\d+)*)/i
  );
  if (sysmon) {
    const ids = sysmon[1].replace(/\s*(?:and|&)\s*/gi, '/').replace(/\s+/g, '');
    return `Primary detection correlates Sysmon Event ${ids} with the documented host and network chain.`;
  }

  const eid = detText.match(/\bEvent(?:\s*ID|Code)?\s*(\d{1,5})\b/i);
  const sourceMatch = detText.match(
    /\b(Windows Security|Sysmon|auditd|Suricata|CloudTrail|Okta|Azure AD|Microsoft 365|Bits-Client|cwpsrv|SIEM|EDR|Zeek|Kubernetes audit)\b/i
  );
  if (sourceMatch && eid) {
    return `Primary detection pivots on ${sourceMatch[0]} Event ${eid[1]} correlated across the documented kill chain.`;
  }
  if (sourceMatch) {
    return `Primary detection pivots on ${sourceMatch[0]} telemetry correlated across the documented kill chain.`;
  }
  if (firstLog?.source) {
    return `Primary detection pivots on ${stripTechNoise(String(firstLog.source))} telemetry correlated across the documented kill chain.`;
  }

  const mitre =
    scenario.mitreTechniqueIds?.[0] || scenario.code || 'this technique';
  return `Primary detection correlates process, authentication, and network telemetry for ${mitre} across the documented kill chain.`;
}

/** Short plain-English "why this beat matters" for Overview clauses. */
function briefWhy(step, title) {
  const se = stripTechNoise(step?.simpleExplanation || step?.storyAnalogy || '');
  const clean = (s) =>
    String(s || '')
      .replace(/[.;]/g, ',')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[,:]+$/g, '');
  const paren = se.match(/\(([^)]{24,88})\)/);
  if (paren) {
    return clean(paren[1]);
  }
  const first = se.split(/(?<=[.!?])\s+/)[0] || '';
  if (first.length >= 40 && first.length <= 110) {
    return clean(first);
  }
  const label = String(title || 'this stage').toLowerCase().replace(/;/g, ' ');
  return `so the next stage can build on ${label}`;
}

/**
 * Formula A2 with explanatory Technical Overview clauses.
 * Uses periods only (no "; #N Title" lists) so the UI renders 3–4 full sentences.
 */
function buildRoadmap(scenario, guide) {
  const mitre =
    scenario.mitreTechniqueIds?.[0] ||
    scenario.code ||
    guide?.steps?.[0]?.mitreId ||
    'ATT&CK';
  const name = stripTechNoise(scenario.name || scenario.id);
  const stages = scenario.stages || [];
  const steps = guide?.steps?.length ? guide.steps : [];
  const n = stages.length || steps.length || 1;
  const hint = hostHint(scenario);

  const titles = (steps.length ? steps : stages).map((st, i) =>
    toPlainPhrase(
      st.plainTitle ||
        st.title?.replace(/^Stage\s+\d+:\s*/i, '') ||
        `Stage ${i + 1}`,
      44
    )
  );

  const who = `In this scenario (${mitre}, ${name})${hint}, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible.`;

  const arcSlice = titles.slice(0, Math.min(4, titles.length));
  const arcBits = arcSlice.map((t, i) => {
    const beat = t.charAt(0).toLowerCase() + t.slice(1);
    const why = briefWhy(steps[i], t);
    return `${beat} (${why})`;
  });
  const arc =
    arcBits.length > 0
      ? `The attack unfolds in one continuous arc: ${arcBits.join(', then ')}.`
      : 'The attack unfolds in one continuous arc: initial access, privilege expansion, then objective completion.';

  // One flowing sentence — never "examine #1 X; #2 Y;" which becomes meaningless UI fragments.
  const covered = titles
    .map((t, i) => {
      const why = briefWhy(steps[i], t);
      return `${t} (${why})`;
    })
    .join(', then ');

  const hasMemory = Boolean(scenario.memoryBlocks?.length);
  const hasProcessTree = Boolean(
    scenario.processTree || scenario.cascadingProcessHierarchy
  );
  const laterBits = [];
  if (hasProcessTree) {
    laterBits.push(
      'the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload'
    );
  }
  if (hasMemory) {
    laterBits.push(
      'the Memory tab shows why the live process image no longer matches the signed file on disk'
    );
  }
  const laterTail =
    laterBits.length > 0 ? `, while ${laterBits.join(' and ')}` : '';

  const stepMap =
    n === 1
      ? `Step #1 covers ${covered}${laterTail}.`
      : `Steps #1–#${n} walk that chain end-to-end by covering ${covered}${laterTail}.`;

  const detection = detectionPivot(scenario, guide);

  let summary = stripTechNoise(`${who} ${arc} ${stepMap} ${detection}`);

  // Prefer <= 900; hard max 950. Shorten whys first, then drop later-tab tail.
  if (summary.length > 900) {
    const shortMap =
      n === 1
        ? `Step #1 covers ${titles[0]}${laterTail}.`
        : `Steps #1–#${n} walk that chain end-to-end by covering ${titles.join(', then ')}${laterTail}.`;
    const shortArcBits = arcSlice.map((t) => t.charAt(0).toLowerCase() + t.slice(1));
    const shortArc = `The attack unfolds in one continuous arc: ${shortArcBits.join(', then ')}.`;
    summary = stripTechNoise(`${who} ${shortArc} ${shortMap} ${detection}`);
  }
  if (summary.length > 900) {
    const shortMap =
      n === 1
        ? `Step #1 covers ${titles[0]}.`
        : `Steps #1–#${n} walk that chain end-to-end by covering ${titles.join(', then ')}.`;
    const shortArcBits = arcSlice.map((t) => t.charAt(0).toLowerCase() + t.slice(1));
    const shortArc = `The attack unfolds in one continuous arc: ${shortArcBits.join(', then ')}.`;
    summary = stripTechNoise(`${who} ${shortArc} ${shortMap} ${detection}`);
  }
  if (summary.length > 950) {
    summary = `${summary.slice(0, 947).replace(/\s+\S*$/, '')}.`;
  }
  if (summary.length < 350) {
    summary = `${summary.replace(/\.\s*$/, '')}. Defenders use Steps #1–#${n} to reconstruct the full chain and confirm impact.`;
  }
  return summary;
}

/** Replace first plainSummary string literal safely (handles unescaped apostrophes in old text). */
function replacePlainSummaryInFile(filePath, newSummary) {
  const src = fs.readFileSync(filePath, 'utf8');
  const key = 'plainSummary:';
  const keyIdx = src.indexOf(key);
  if (keyIdx < 0) return { ok: false, reason: 'plainSummary key not found' };

  let i = keyIdx + key.length;
  while (i < src.length && /\s/.test(src[i])) i++;
  const quote = src[i];
  if (quote !== "'" && quote !== '"' && quote !== '`') {
    return { ok: false, reason: 'plainSummary not a string literal' };
  }

  // Prefer matching a balanced quoted string with escapes; if old text has
  // raw apostrophes inside single quotes, fall forward to the comma after the
  // intended field by finding the next top-level field key.
  let j = i + 1;
  let closed = -1;
  while (j < src.length) {
    const ch = src[j];
    if (ch === '\\') {
      j += 2;
      continue;
    }
    if (ch === quote) {
      closed = j;
      break;
    }
    j++;
  }

  let end = closed;
  if (end < 0 || (quote === "'" && /[A-Za-z]/.test(src[end + 1] || ''))) {
    // Broken / unescaped old string — cut at next known sibling field.
    const nextField = src.slice(i).search(
      /\n\s*(diagramTopologySummary|documentedAdvisory|storyAnalogy|headline)\s*:/
    );
    if (nextField < 0) return { ok: false, reason: 'cannot locate end of plainSummary' };
    end = i + nextField;
    // trim trailing whitespace/comma inside the cut
    let cut = end;
    while (cut > i && /[\s,]/.test(src[cut - 1])) cut--;
    const indentMatch = src.slice(keyIdx).match(/\n(\s*)plainSummary:/);
    // Actually keyIdx points at plainSummary - get indent from line start
    const lineStart = src.lastIndexOf('\n', keyIdx) + 1;
    const indent = src.slice(lineStart).match(/^(\s*)/)[1];
    const nextStart = src.indexOf('\n', end);
    const rebuilt =
      src.slice(0, lineStart) +
      `${indent}plainSummary:\n${indent}  '${esc(newSummary)}',` +
      src.slice(nextStart >= 0 ? nextStart : end);
    fs.writeFileSync(filePath, rebuilt);
    return { ok: true, via: 'rescan' };
  }

  const lineStart = src.lastIndexOf('\n', keyIdx) + 1;
  const indent = src.slice(lineStart).match(/^(\s*)/)[1];
  // Keep `plainSummary:\n  '...'` shape when original was multiline
  const afterClose = end + 1;
  let commaEnd = afterClose;
  while (commaEnd < src.length && /[ \t]/.test(src[commaEnd])) commaEnd++;
  if (src[commaEnd] === ',') commaEnd++;

  const originalIsMultiline = /\n/.test(src.slice(keyIdx, i));
  const replacement = originalIsMultiline
    ? `${indent}plainSummary:\n${indent}  '${esc(newSummary)}',`
    : `${indent}plainSummary: '${esc(newSummary)}',`;

  // Include leading indent+key through old literal (comma already consumed in commaEnd)
  const next = src.slice(0, lineStart) + replacement + src.slice(commaEnd);
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
  const end = i;
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
  const { ATTACK_SCENARIOS } = await import('../lib/attack-scenarios.ts');
  const { getRawScenarioStepGuide } = await import(
    '../lib/scenario-step-guides.ts'
  );
  const { validateOverviewRoadmapAltitude } = await import(
    '../lib/documentation-standards.ts'
  );

  const mapEntries = {};
  const patched = [];
  const failed = [];
  const skipped = [];

  const forceIds = new Set(
    (process.env.FORCE_IDS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
  const forceAwkward =
    process.env.FORCE_AWKWARD === '1' || process.argv.includes('--force-awkward');

  for (const scenario of ATTACK_SCENARIOS) {
    if (scenario.category === 'ALL') continue;
    const guide = getRawScenarioStepGuide(scenario.id);
    const current = guide?.briefing?.plainSummary || '';
    const check = validateOverviewRoadmapAltitude(current, scenario.id);
    const awkward =
      forceAwkward &&
      (/\b(?:into|via|to|of|for|and|with|the|a|an)\s*[;.]/.test(current) ||
        /into the[;.]/.test(current) ||
        /O Event \d+/.test(current) ||
        /EventID?\s*\d+[^(]{0,60}\([^)]{0,60}\s+Event\s*\d+/i.test(current));
    if (check.valid && !forceIds.has(scenario.id) && !awkward) {
      skipped.push(scenario.id);
      continue;
    }

    let summary = buildRoadmap(scenario, guide);
    let v = validateOverviewRoadmapAltitude(summary, scenario.id);

    // Token density fallback
    if (!v.valid && v.violations.some((x) => x.includes('technical tokens'))) {
      const mitre =
        scenario.mitreTechniqueIds?.[0] || scenario.code || 'ATT&CK';
      const n = scenario.stages?.length || 3;
      summary = `In this scenario (${mitre}, ${stripTechNoise(scenario.name)}), the attacker follows one continuous arc: initial access, privilege expansion, then objective completion. Steps #1–#${n} examine each documented stage end-to-end. ${detectionPivot(scenario, guide)}`;
      v = validateOverviewRoadmapAltitude(summary, scenario.id);
    }

    if (!v.valid) {
      failed.push({ id: scenario.id, violations: v.violations, summary });
      continue;
    }

    const indexPath = path.join(
      root,
      'modules/scenarios',
      scenario.id,
      'index.ts'
    );

    // Hardcoded VULNCHECK_CWP_STEP_GUIDE owns this overview — patch that block only.
    if (scenario.id === 'vulncheck-cwp-preauth-module-dispatch-rce') {
      const vcPath = path.join(
        root,
        'lib/step-guides/vulncheck-cwp-and-dfir-guides.ts'
      );
      let vcSrc = fs.readFileSync(vcPath, 'utf8');
      const marker =
        "const VULNCHECK_CWP_STEP_GUIDE: RawScenarioStepGuideData = {";
      const mIdx = vcSrc.indexOf(marker);
      if (mIdx < 0) {
        failed.push({
          id: scenario.id,
          violations: ['VULNCHECK_CWP_STEP_GUIDE not found'],
          summary,
        });
        continue;
      }
      const psKey = vcSrc.indexOf('plainSummary:', mIdx);
      const quoteIdx = vcSrc.indexOf("'", psKey + 'plainSummary:'.length);
      // walk escaped single-quoted string
      let k = quoteIdx + 1;
      while (k < vcSrc.length) {
        if (vcSrc[k] === '\\') {
          k += 2;
          continue;
        }
        if (vcSrc[k] === "'") break;
        k++;
      }
      vcSrc =
        vcSrc.slice(0, quoteIdx + 1) + esc(summary) + vcSrc.slice(k);
      fs.writeFileSync(vcPath, vcSrc);
      mapEntries[scenario.id] = summary;
      patched.push({
        id: scenario.id,
        via: 'vulncheck-guide+map',
        len: summary.length,
      });
      continue;
    }

    if (fs.existsSync(indexPath)) {
      const r = replacePlainSummaryInFile(indexPath, summary);
      if (!r.ok) {
        mapEntries[scenario.id] = summary;
        patched.push({
          id: scenario.id,
          via: 'map-fallback',
          len: summary.length,
          reason: r.reason,
        });
      } else {
        patched.push({ id: scenario.id, via: 'index', len: summary.length });
      }
    } else {
      mapEntries[scenario.id] = summary;
      patched.push({ id: scenario.id, via: 'dfir-map', len: summary.length });
    }
  }

  if (Object.keys(mapEntries).length > 0) {
    const size = upsertDfira2Map(mapEntries);
    console.log('Updated DFIR_FORMULA_A2_PLAIN_SUMMARIES size=', size);
  }

  console.log('skipped_ok', skipped.length);
  console.log('patched', patched.length);
  for (const p of patched) {
    console.log(
      `  OK ${p.len}\t${p.via}\t${p.id}${p.reason ? ' (' + p.reason + ')' : ''}`
    );
  }
  if (failed.length) {
    console.log('FAILED_TO_BUILD', failed.length);
    for (const f of failed) {
      console.log(`  FAIL ${f.id}`, f.violations.join(' | '));
      console.log('   summary:', f.summary.slice(0, 180));
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
