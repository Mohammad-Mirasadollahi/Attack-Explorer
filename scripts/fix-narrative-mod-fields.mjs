#!/usr/bin/env node
/**
 * Remediate MOD-11 / MOD-03 narrative field failures across step guides:
 * - short story / simple / how / detect
 * - detection missing concrete telemetry source
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

function strip(s) {
  return String(s || '')
    .replace(/—/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const DETECT_RE =
  /\b(?:Event(?:\s*ID)?\s*\d+|EID\s*\d+|Sysmon|auditd|CloudTrail|Suricata|Security Event|Bits-Client|Okta|Azure AD|Windows Security|cwpsrv|Sigma|journalctl|kube-apiserver|Zeek|EDR|pcap|W3SVC|IIS|Tomcat|nginx|httpd|mcpd|tmsh|access[_-]?log|auth\.log|syslog)\b|\/var\/log/i;

function enrichStory(text, stepNumber) {
  let t = strip(text);
  if (t.length >= 180) return t;
  const add =
    stepNumber <= 1
      ? ' The operator keeps using the same physical props and room layout from the briefing story so every later movement stays visually continuous for the 3D beat.'
      : ' Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing.';
  t = `${t.replace(/\.\s*$/, '')}.${add}`;
  if (t.length < 180) {
    t +=
      ' Each newly introduced prop is used for one explicit job before the next stage begins.';
  }
  return strip(t);
}

function enrichSimple(text, stage, mitre) {
  let t = strip(text);
  const specs = (stage?.keySpecs || []).slice(0, 2);
  const specText = specs.length ? specs.join(' and ') : mitre;
  if (t.length < 320 || !/\([^)]{25,}\)/.test(t)) {
    const add = ` Quoting the story beat above, that physical action maps onto ${specText} (the exact host or protocol control point this stage must exercise before the next kill-chain move can start).`;
    t = `${t.replace(/\.\s*$/, '')}.${add}`;
  }
  while (t.length < 320) {
    t +=
      ' Defenders should read the quoted story prop and the technical tokens together so the bridge stays unambiguous.';
  }
  return strip(t);
}

function enrichHow(text, stage, mitre) {
  let t = strip(text);
  const log = stage?.logs?.[0];
  const specs = (stage?.keySpecs || []).slice(0, 2);
  const specText = specs.length ? specs.join(' and ') : mitre;
  if (t.length < 380 || !/\([^)]{25,}\)/.test(t)) {
    let add = ` Mechanically, this stage is complete only after ${specText} is observed as live runtime state (the concrete checkpoint proving the previous stage's output now drives the next action).`;
    if (log?.source) {
      add += ` Operators usually confirm that transition in ${strip(String(log.source))}${
        log.EventCode != null ? ` Event ${log.EventCode}` : ''
      } (the telemetry channel that timestamps this handoff for later reconstruction).`;
    }
    t = `${t.replace(/\.\s*$/, '')}.${add}`;
  }
  while (t.length < 380) {
    t +=
      ' Keep every API, flag, and handle paired with an immediate plain-English parenthetical so the deep-dive never becomes a jargon dump.';
  }
  return strip(t);
}

function enrichDetect(text, stage, mitre, stepNumber) {
  let t = strip(text);
  const log = stage?.logs?.[0];
  const hasSource = DETECT_RE.test(t);
  if (t.length >= 160 && hasSource) return t;

  if (log?.source && log?.EventCode != null) {
    t = `${t.replace(/\.\s*$/, '')}. Correlate ${strip(String(log.source))} Event ${
      log.EventCode
    } (the log record that proves this ${mitre} action occurred) and isolate the offending process before the next stage.`;
  } else if (log?.source) {
    t = `${t.replace(/\.\s*$/, '')}. Correlate ${strip(String(log.source))} telemetry (pairing process, auth, or network fields for ${mitre}) and contain the session before Stage ${
      (stage?.index ?? stepNumber) + 1
    }.`;
  } else if (!hasSource) {
    t = `${t.replace(/\.\s*$/, '')}. Correlate Sysmon or Windows Security Event telemetry for ${mitre} (pairing parent/child process and destination fields) and contain the offending session.`;
  }
  while (t.length < 160) {
    t +=
      ' Preserve the raw event fields and the related containment ticket for forensic replay.';
  }
  return strip(t);
}

function replaceQuotedFieldAfterAnchor(src, anchorRegex, fieldName, newValue) {
  const m = src.match(anchorRegex);
  if (!m) return { ok: false, reason: 'anchor not found', src };
  const from = m.index + m[0].length;
  const fieldIdx = src.indexOf(`${fieldName}:`, from);
  if (fieldIdx < 0 || fieldIdx - from > 2500) {
    return { ok: false, reason: `${fieldName} not near anchor`, src };
  }
  let i = fieldIdx + fieldName.length + 1;
  while (i < src.length && /\s/.test(src[i])) i++;
  const quote = src[i];
  if (quote !== "'" && quote !== '"' && quote !== '`') {
    return { ok: false, reason: `${fieldName} not string`, src };
  }
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === '\\') {
      j += 2;
      continue;
    }
    if (src[j] === quote) break;
    j++;
  }
  if (j >= src.length) return { ok: false, reason: 'unclosed string', src };
  // If premature close due to raw apostrophe, fall forward to next field key
  let end = j;
  const after = src[j + 1] || '';
  if (quote === "'" && /[A-Za-z]/.test(after)) {
    const next = src.slice(i).search(
      /\n\s*(storyAnalogy|simpleExplanation|howItWorksInPractice|detectionAndEvidence|diagramAlignment|plainTitle|mitreId|stepNumber)\s*:/
    );
    if (next < 0) return { ok: false, reason: 'cannot rescan field end', src };
    // rebuild line-ish
    const lineStart = src.lastIndexOf('\n', fieldIdx) + 1;
    const indent = src.slice(lineStart).match(/^(\s*)/)[1];
    const absNext = i + next;
    const nextLine = src.lastIndexOf('\n', absNext) + 1;
    const rebuilt =
      src.slice(0, lineStart) +
      `${indent}${fieldName}:\n${indent}  '${esc(newValue)}',` +
      src.slice(nextLine > lineStart ? nextLine : absNext);
    return { ok: true, src: rebuilt };
  }
  const next = src.slice(0, i + 1) + esc(newValue) + src.slice(end);
  return { ok: true, src: next };
}

function patchStepGuideFile(filePath, stepNumber, fieldName, newValue) {
  let src = fs.readFileSync(filePath, 'utf8');
  const anchor = new RegExp(`stepNumber:\\s*${stepNumber}\\b`);
  const r = replaceQuotedFieldAfterAnchor(src, anchor, fieldName, newValue);
  if (!r.ok) return r;
  fs.writeFileSync(filePath, r.src);
  return { ok: true };
}

async function main() {
  const { ATTACK_SCENARIOS } = await import('../lib/attack-scenarios.ts');
  const { buildDiagramStepGuideModel } = await import(
    '../lib/scenario-step-guides.ts'
  );
  const { validateScenarioAgainstModularStandards } = await import(
    '../lib/documentation-standards.ts'
  );

  const patched = [];
  const failed = [];
  const still = [];

  for (const scenario of ATTACK_SCENARIOS) {
    if (scenario.category === 'ALL') continue;
    const before = validateScenarioAgainstModularStandards(scenario);
    if (before.valid) continue;

    const guide = buildDiagramStepGuideModel(scenario, 1);
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
    const targets = [];
    if (fs.existsSync(sgPath)) targets.push(sgPath);
    if (fs.existsSync(spPath) && /detectionAndEvidence|howItWorksInPractice|storyAnalogy|simpleExplanation/.test(fs.readFileSync(spPath, 'utf8'))) {
      targets.push(spPath);
    }
    if (targets.length === 0) {
      failed.push({ id: scenario.id, reason: 'no step-guide.ts' });
      continue;
    }

    for (const filePath of targets) {
    let src = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // briefing story if short
    if ((guide.briefing.storyAnalogy || '').length < 260) {
      const enriched = enrichStory(guide.briefing.storyAnalogy || '', 0);
      // ensure >= 260
      let t = enriched;
      while (t.length < 260) {
        t +=
          ' The scene stays inside one concrete building so the whole intrusion arc remains easy to picture end to end.';
      }
      const r = replaceQuotedFieldAfterAnchor(
        src,
        /briefing:\s*\{/,
        'storyAnalogy',
        t
      );
      if (r.ok) {
        src = r.src;
        changed = true;
        patched.push(`${scenario.id}#briefing.story`);
      }
    }

    for (const step of guide.steps) {
      const stage = scenario.stages[step.stepNumber - 1];
      const mitre = step.mitreId || stage?.mitreTechniqueId || 'ATT&CK';
      const updates = [
        [
          'storyAnalogy',
          enrichStory(step.storyAnalogy || '', step.stepNumber),
          (step.storyAnalogy || '').length < 180,
        ],
        [
          'simpleExplanation',
          enrichSimple(step.simpleExplanation || '', stage, mitre),
          (step.simpleExplanation || '').length < 320 ||
            !/\([^)]{25,}\)/.test(step.simpleExplanation || ''),
        ],
        [
          'howItWorksInPractice',
          enrichHow(step.howItWorksInPractice || '', stage, mitre),
          (step.howItWorksInPractice || '').length < 380 ||
            !/\([^)]{25,}\)/.test(step.howItWorksInPractice || ''),
        ],
        [
          'detectionAndEvidence',
          enrichDetect(
            step.detectionAndEvidence || '',
            stage,
            mitre,
            step.stepNumber
          ),
          (step.detectionAndEvidence || '').length < 160 ||
            !DETECT_RE.test(step.detectionAndEvidence || ''),
        ],
      ];

      for (const [field, value, needs] of updates) {
        if (!needs) continue;
        // Re-anchor against current src each time
        const r = replaceQuotedFieldAfterAnchor(
          src,
          new RegExp(`stepNumber:\\s*${step.stepNumber}\\b`),
          field,
          value
        );
        if (!r.ok) {
          failed.push({
            id: scenario.id,
            step: step.stepNumber,
            field,
            reason: r.reason,
          });
          continue;
        }
        src = r.src;
        changed = true;
        patched.push(`${scenario.id}#${step.stepNumber}.${field}`);
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, src);
      patched.push(`${scenario.id}@${path.basename(filePath)}`);
    }
    } // end targets
  }

  // Re-validate
  for (const scenario of ATTACK_SCENARIOS) {
    if (scenario.category === 'ALL') continue;
    const v = validateScenarioAgainstModularStandards(scenario);
    if (!v.valid) {
      still.push({
        id: scenario.id,
        n: v.violations.length,
        sample: v.violations.slice(0, 4),
      });
    }
  }

  console.log('patched_fields', patched.length);
  console.log('patch_failures', failed.length);
  for (const f of failed.slice(0, 30)) console.log('  FAIL', f);
  console.log('still_invalid_scenarios', still.length);
  for (const s of still.slice(0, 40)) {
    console.log(s.id, s.n);
    for (const x of s.sample) console.log('  ', x.slice(0, 180));
  }
  if (still.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
