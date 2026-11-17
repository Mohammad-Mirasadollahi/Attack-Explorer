import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  DOCUMENTATION_STANDARD_MODULES,
  generateMarkdownDocumentTemplate,
  getRequiredModulesForTask,
  validateMarkdownDocumentStandard,
  validateScenarioAgainstModularStandards,
} from './documentation-standards';
import { ATTACK_SCENARIOS } from './attack-scenarios';

describe('Modular Documentation & Authoring Standard System (MOD-00 .. MOD-07)', () => {
  it('registers all 8 modular standard files (MOD-00 through MOD-07) and verifies each exists on disk and passes MOD-01/MOD-02 validation', () => {
    assert.equal(DOCUMENTATION_STANDARD_MODULES.length, 8);

    for (const mod of DOCUMENTATION_STANDARD_MODULES) {
      const fullPath = path.join(process.cwd(), mod.filePath);
      assert.ok(
        fs.existsSync(fullPath),
        `Expected modular standard file ${mod.filePath} (${mod.id}) to exist on disk`
      );

      const content = fs.readFileSync(fullPath, 'utf8');
      const validation = validateMarkdownDocumentStandard(content, mod.id);
      assert.equal(
        validation.valid,
        true,
        `Module ${mod.id} (${mod.filePath}) failed Markdown standard validation: ${validation.violations.join('; ')}`
      );
      assert.ok(
        content.includes(mod.id),
        `Expected ${mod.filePath} to reference its own Module ID (${mod.id})`
      );
    }
  });

  it('routes each authoring task type to the deterministic chain of standard modules', () => {
    const newScenarioChain = getRequiredModulesForTask('NEW_SCENARIO');
    assert.deepEqual(
      newScenarioChain.map((m) => m.id),
      ['MOD-01', 'MOD-02', 'MOD-03', 'MOD-04', 'MOD-05', 'MOD-06', 'MOD-07']
    );

    const markdownDocChain = getRequiredModulesForTask(
      'MARKDOWN_TECHNICAL_DOC'
    );
    assert.deepEqual(
      markdownDocChain.map((m) => m.id),
      ['MOD-01', 'MOD-02', 'MOD-03', 'MOD-07']
    );
  });

  it('generates a compliant Markdown document from generateMarkdownDocumentTemplate and catches invalid Markdown documents', () => {
    const generated = generateMarkdownDocumentTemplate({
      moduleId: 'MOD-TEST',
      title: 'Test Forensic Telemetry Specification',
      scope: 'All synthetic Sysmon and Linux Auditd logs in /lib/scenarios/*.ts',
      enforcedBy: '/lib/documentation-standards.test.ts',
      purposeParagraph:
        'Ensures every forensic log entry maps deterministically to a MITRE ATT&CK technique and stage flow.',
      asciiDiagram: '[Stage Flow #1.1] ---> [Sysmon EventID 1] ---> [Sigma Rule]',
      rules: [
        {
          title: 'Exact PID Pairing',
          description:
            'Every process creation log must include both ProcessId and ParentProcessId.',
        },
      ],
      antiPatternExample: 'Process started with some flags.',
      canonicalExample:
        'Invoice_Q4.exe (PID 3104) calls CreateProcessW with CREATE_SUSPENDED = 0x00000004 (freezing main thread TID 4896 before code runs).',
      checklistItems: [
        'Does every event include a valid MITRE ID?',
        'Are all IP addresses RFC 1918 or RFC 5737 synthetic ranges?',
      ],
    });

    const validCheck = validateMarkdownDocumentStandard(generated, 'MOD-TEST');
    assert.equal(validCheck.valid, true);
    assert.equal(validCheck.violations.length, 0);

    const invalidCheck = validateMarkdownDocumentStandard(
      '## Missing H1 and Metadata\nSome text with فارسی characters.',
      'BAD-DOC'
    );
    assert.equal(invalidCheck.valid, false);
    assert.ok(invalidCheck.violations.length >= 3);
  });

  it('validates all 158 scenarios in ATTACK_SCENARIOS against the full modular standard suite (MOD-01 .. MOD-06) and ensures PikeRed and Jeffrey Appel ARTEX exist without duplicates', () => {
    assert.equal(ATTACK_SCENARIOS.length, 158);
    const seenIds = new Set<string>();
    for (const scenario of ATTACK_SCENARIOS) {
      assert.equal(
        seenIds.has(scenario.id),
        false,
        `Duplicate scenario ID detected: ${scenario.id}`
      );
      seenIds.add(scenario.id);

      const result = validateScenarioAgainstModularStandards(scenario);
      assert.equal(
        result.valid,
        true,
        `Scenario ${scenario.id} failed modular standard validation:\n${result.violations.join('\n')}`
      );
    }

    const pikeredMatches = ATTACK_SCENARIOS.filter(
      (s) => s.id === 'pikered-clr-profiler-trusted-binary-loader-chain'
    );
    const artexMatches = ATTACK_SCENARIOS.filter(
      (s) =>
        s.id === 'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr'
    );
    assert.equal(pikeredMatches.length, 1);
    assert.equal(artexMatches.length, 1);

    const analyticalSourcesDoc = fs.readFileSync(
      path.join(process.cwd(), 'docs/analytical-sources-and-references.md'),
      'utf8'
    );
    assert.ok(
      analyticalSourcesDoc.includes(
        'https://www.pikered.com/en/learn/abusing-the-clr-profiler-a-trusted-binary-loader-chain-for-initial-access/'
      )
    );
    assert.ok(
      analyticalSourcesDoc.includes(
        'https://jeffreyappel.nl/artex-old-attacks-at-machine-speed-and-how-microsoft-defender-keeps-up/'
      )
    );
  });
});
