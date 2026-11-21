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
  validateOverviewRoadmapAltitude,
  validateSectionFullClarityStandard,
  validateStoryPropClarity,
  validateTechnicalSectionInlineClarity,
} from './documentation-standards';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  buildScopedSequenceModel,
  resolveInspectorScopeContext,
} from './inspector-scope';

describe('Modular Documentation & Authoring Standard System (MOD-00 .. MOD-12)', () => {
  it('registers all 13 modular standard files (MOD-00 through MOD-12) and verifies each exists on disk and passes MOD-01/MOD-02 validation', () => {
    assert.equal(DOCUMENTATION_STANDARD_MODULES.length, 13);

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
      [
        'MOD-01',
        'MOD-02',
        'MOD-03',
        'MOD-11',
        'MOD-04',
        'MOD-05',
        'MOD-06',
        'MOD-07',
        'MOD-12',
      ]
    );

    const markdownDocChain = getRequiredModulesForTask(
      'MARKDOWN_TECHNICAL_DOC'
    );
    assert.deepEqual(
      markdownDocChain.map((m) => m.id),
      ['MOD-01', 'MOD-02', 'MOD-03', 'MOD-07']
    );

    const interactive3dChain = getRequiredModulesForTask(
      'INTERACTIVE_3D_STORY_SECTION'
    );
    assert.deepEqual(
      interactive3dChain.map((m) => m.id),
      ['MOD-02', 'MOD-03', 'MOD-11', 'MOD-08', 'MOD-09', 'MOD-10', 'MOD-07']
    );

    const inspectorShellChain = getRequiredModulesForTask(
      'INSPECTOR_PANEL_SHELL'
    );
    assert.deepEqual(
      inspectorShellChain.map((m) => m.id),
      ['MOD-11', 'MOD-08', 'MOD-12', 'MOD-07']
    );
  });

  it('generates a compliant Markdown document from generateMarkdownDocumentTemplate and catches invalid Markdown documents', () => {
    const generated = generateMarkdownDocumentTemplate({
      moduleId: 'MOD-TEST',
      title: 'Test Forensic Telemetry Specification',
      scope: 'All synthetic Sysmon and Linux Auditd logs in /modules/scenarios/*.ts',
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

  it('validates all 188 scenarios in ATTACK_SCENARIOS against the full modular standard suite (MOD-01 .. MOD-06) and ensures PikeRed and Jeffrey Appel ARTEX exist without duplicates', () => {
    assert.equal(ATTACK_SCENARIOS.length, 188);
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

  it('permanently enforces Prop-Purpose Clarity and Per-Token Inline Plain-English Why across every section (rejecting jargon dumps and unexplained paired props, and passing all Process Hollowing sections and Sequence Exchanges)', () => {
    // 1. Must REJECT dense jargon-dump paragraphs lacking per-token plain-English why parentheticals
    const oldJargonDump =
      'When CreateProcessW is invoked with CREATE_SUSPENDED (0x00000004), ntdll!NtCreateUserProcess allocates the kernel process object (EPROCESS for PID 4892), maps ntdll.dll and the signed svchost.exe binary at base address 0x00400000, and parks the primary thread (TID 4896) at ntdll!RtlUserThreadStart with SuspendCount = 1 (keeping the child process completely inert in RAM while the parent dropper holds full PROCESS_ALL_ACCESS = 0x1FFFFF rights via handle hProcess = 0x01C4).';
    const dumpCheck = validateTechnicalSectionInlineClarity(
      oldJargonDump,
      'OldStep1DeepDive'
    );
    assert.equal(
      dumpCheck.valid,
      false,
      'validateTechnicalSectionInlineClarity MUST reject dense kernel jargon dumps lacking per-token inline parentheticals'
    );
    assert.ok(dumpCheck.violations.length >= 1);

    // 2. Must REJECT stories mentioning paired props ("two golden master keys") without explaining what EACH prop unlocks or without separate mappings
    const vaguePropStory =
      'The intruder hits a freeze switch and pockets the two golden master keys to its cargo doors and engine.';
    const vagueMappings = [
      {
        storyTerm: 'Two Golden Master Keys',
        technicalTerm: 'Kernel Handles · hProcess (0x01C4) & hThread (0x01C8)',
      },
    ];
    const propCheck = validateStoryPropClarity(
      vaguePropStory,
      vagueMappings,
      'VagueMasterKeysStory'
    );
    assert.equal(
      propCheck.valid,
      false,
      'validateStoryPropClarity MUST reject stories mentioning paired props without explaining what EACH prop unlocks'
    );
    assert.ok(
      propCheck.violations.length >= 2,
      `Expected violations for both story prose and combined mapping, got: ${propCheck.violations.join('; ')}`
    );

    // 3. Must PASS across every Sequence Exchange (storyAnalogy, technicalBridge, underTheHood) of Process Hollowing
    const hollowing = ATTACK_SCENARIOS.find(
      (s) => s.id === 'process-hollowing'
    )!;
    const scope = resolveInspectorScopeContext({
      scenario: hollowing,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    const seqModel = buildScopedSequenceModel(scope, null);
    assert.equal(seqModel.exchanges.length, 5);
    for (const ex of seqModel.exchanges) {
      const seqCheck = validateSectionFullClarityStandard(
        {
          storyAnalogy: ex.storyAnalogy,
          technicalTexts: [
            { label: 'technicalBridge', text: ex.technicalBridge },
            { label: 'underTheHood', text: ex.underTheHood },
          ],
        },
        `process-hollowing#sequence-${ex.stepNumber}`
      );
      assert.equal(
        seqCheck.valid,
        true,
        `Sequence #${ex.stepNumber} failed permanent clarity standard:\n${seqCheck.violations.join('\n')}`
      );
    }
  });

  it('enforces Overview roadmap altitude (MOD-11 Formula A2) and rejects Memory dumps / Step API replays', () => {
    const deepDiveDump =
      'In this scenario (MITRE ATT&CK T1055.012), Invoice_Q4.exe calls CreateProcessW with CREATE_SUSPENDED = 0x00000004, receives hProcess = 0x01C4 and hThread = 0x01C8, reads PEB+0x10, calls NtUnmapViewOfSection, VirtualAllocEx with PAGE_EXECUTE_READWRITE = 0x40 creating MEM_PRIVATE RWX over former SEC_IMAGE VAD pages, WriteProcessMemory, SetThreadContext, ResumeThread, then HTTPS C2.';
    const dumpCheck = validateOverviewRoadmapAltitude(
      deepDiveDump,
      'anti-pattern-overview'
    );
    assert.equal(
      dumpCheck.valid,
      false,
      `Expected deep-dive Overview dump to fail roadmap altitude, got: ${dumpCheck.violations.join('; ')}`
    );

    const roadmap =
      'In this scenario (MITRE ATT&CK T1055.012, Process Hollowing), the attacker uses Invoice_Q4.exe on Victim Laptop WKS-04 (10.10.4.15) to run Cobalt Strike Beacon inside a Microsoft-signed svchost.exe so antivirus and application-allowlisting treat the implant as a trusted Windows service host. The attack unfolds in one continuous arc: start a real svchost.exe paused, empty its legitimate code from RAM, write Beacon into that same process, wake its thread so Beacon runs under the trusted name, then open encrypted HTTPS C2 to 185.220.101.42:443. Steps #1–#4 walk that process and thread mechanics end-to-end; Step #5 covers the outbound C2 beacon and blend-in network profile; the Memory tab shows why the live process no longer matches the signed file on disk. Primary detection correlates Sysmon ProcessCreate, ProcessAccess, and ProcessTampering with bare svchost.exe opening anomalous HTTPS.';
    const roadmapCheck = validateOverviewRoadmapAltitude(
      roadmap,
      'canonical-overview'
    );
    assert.equal(
      roadmapCheck.valid,
      true,
      `Expected canonical Overview roadmap to pass: ${roadmapCheck.violations.join('; ')}`
    );

    const truncatedBulk =
      'In this scenario (T1558.003, Kerberoasting), the attacker follows one continuous arc: Enumerating SPNs & Requesting an RC4-Downgraded Kerberos TGS Ticket (..., then Offline Hashcat Cracking.... Steps #1–#2 examine #1 Enumerating SPNs...; #2 Offline Hashcat.... Primary detection pivots on correlated host and network telemetry for T1558.003 across the documented kill chain.';
    const truncatedCheck = validateOverviewRoadmapAltitude(
      truncatedBulk,
      'anti-pattern-truncated-bulk'
    );
    assert.equal(
      truncatedCheck.valid,
      false,
      'Expected ellipsis truncation + generic detection filler to fail Formula A2 quality gates'
    );

    const sqlOmitOk =
      'In this scenario (T1190, PostgreSQL COPY FROM PROGRAM), the attacker follows one continuous arc: escape a quote, run COPY ... FROM PROGRAM, then drop a shared library. Steps #1–#3 examine #1 Quote Escaping; #2 COPY FROM PROGRAM; #3 Shared Library Drop. Primary detection pivots on PostgreSQL logs and Linux auditd execve telemetry correlated across the documented kill chain.';
    const sqlOmitCheck = validateOverviewRoadmapAltitude(
      sqlOmitOk,
      'sql-omit-allowed'
    );
    assert.equal(
      sqlOmitCheck.valid,
      true,
      `Expected spaced SQL-style "COPY ... FROM" omit to pass: ${sqlOmitCheck.violations.join('; ')}`
    );
  });
});
