/**
 * Programmatic Modular Documentation & Content Authoring Standard Engine (`MOD-00` .. `MOD-07`)
 *
 * Codifies the modular documentation standards in `/docs/standards/` as executable
 * TypeScript contracts, validators, and document template generators.
 */

import { AttackScenario } from './scenarios/types';
import './attack-scenarios';
import { buildDiagramStepGuideModel } from './scenario-step-guides';
import { getScenarioAttribution } from './attack-sources-and-legal';
import { buildScenarioJsonLd } from './seo-metadata';
import {
  parseWorkbenchUrlState,
  readLastVisitedDiagramSnapshot,
  serializeWorkbenchUrlState,
} from './diagram-memory-store';

export type DocumentationModuleId =
  | 'MOD-00'
  | 'MOD-01'
  | 'MOD-02'
  | 'MOD-03'
  | 'MOD-04'
  | 'MOD-05'
  | 'MOD-06'
  | 'MOD-07';

export type AuthoringTaskType =
  | 'NEW_SCENARIO'
  | 'STEP_BY_STEP_GUIDE'
  | 'MARKDOWN_TECHNICAL_DOC'
  | 'TELEMETRY_AND_CLI'
  | 'UI_COMPONENT_COPY';

export interface DocumentationStandardModuleSpec {
  id: DocumentationModuleId;
  filePath: string;
  title: string;
  domain: string;
  keyRules: string[];
}

export const DOCUMENTATION_STANDARD_MODULES: readonly DocumentationStandardModuleSpec[] =
  [
    {
      id: 'MOD-00',
      filePath: 'docs/standards/README.md',
      title: 'Master Documentation Router & Architecture Index',
      domain: 'Modular Architecture & Task Routing',
      keyRules: [
        'Routes every authoring task to a deterministic chain of specialized modules (MOD-01..MOD-07).',
        'Links modular standards to domain reference documents in /docs/ and /seo-audit/.',
      ],
    },
    {
      id: 'MOD-01',
      filePath: 'docs/standards/01-document-template-and-structure.md',
      title: 'Canonical Document Templates, Structural Blueprints & Character Budgets',
      domain: 'Document Skeletons, Field Ordering & Length Budgets',
      keyRules: [
        'Markdown files must start with a single H1 (#), metadata blockquote (>), horizontal dividers (---), and numbered H2 sections (## 1.).',
        'Scenario slugs must be lowercase kebab-case (15-75 chars), with structured stages (>= 3), telemetry, and detectionRule.',
      ],
    },
    {
      id: 'MOD-02',
      filePath: 'docs/standards/02-writing-style-and-pedagogy.md',
      title: 'Writing Style, Tone, Voice & 3-Layer Story-to-Spec Pedagogy',
      domain: 'Prose Voice, Language Purity & 3-Layer Story-to-Spec',
      keyRules: [
        '100% English technical corpus (zero Persian/Arabic characters).',
        'Active, present-tense, deterministic engineering voice with Answer-First lead paragraphs.',
        'Every scenario and step must provide Layer 1 (Story Analogy), Layer 2 (Technical Bridge), and Layer 3 (Under the Hood & SIEM Catch).',
      ],
    },
    {
      id: 'MOD-03',
      filePath: 'docs/standards/03-inline-parentheticals-and-tokens.md',
      title: 'Technical Tokens, Inline Purpose Parentheticals & Command Breakdowns',
      domain: 'Action + Inline Why Parentheticals & CLI Token Decomposition',
      keyRules: [
        'Pair technical tokens (binaries, hex flags, syscalls, protocols, memory regions) with immediate inline purpose parentheticals (...).',
        'Preserve exact hex constants alongside symbolic names (e.g., CREATE_SUSPENDED = 0x00000004).',
      ],
    },
    {
      id: 'MOD-04',
      filePath: 'docs/standards/04-telemetry-memory-and-diagrams.md',
      title: 'Forensic Telemetry, Memory Maps, Topology Nodes & Sequence Alignment',
      domain: '6-Node Topology, Bidirectional Flows & Synthetic Telemetry',
      keyRules: [
        'Align prose with Node ①..⑥ and bidirectional arrows (#N.1→ and ⇠#N.2).',
        'Use 100% synthetic, de-identified RFC 1918 / RFC 5737 IPs, hostnames, and benign educational hex signatures.',
      ],
    },
    {
      id: 'MOD-05',
      filePath: 'docs/standards/05-sources-attribution-and-eeat.md',
      title: 'Multi-Source Threat Intelligence Attribution & E-E-A-T Triangulation',
      domain: '3-Vantage-Point Source Triangulation & CVE/Actor Cataloging',
      keyRules: [
        'Cite at least 3 independent primary sources covering Exploit Root-Cause, Implant/Memory Reverse Engineering, and SIEM/CERT Detection.',
        'Provide an explicit multiSourceSynthesis paragraph connecting the complementary sources.',
      ],
    },
    {
      id: 'MOD-06',
      filePath: 'docs/standards/06-seo-geo-and-url-deeplinking.md',
      title: 'SEO, GEO, Schema.org & URL Deep-Linking Standard',
      domain: 'Search/AI Indexing, JSON-LD Graph & Shareable Browser URLs',
      keyRules: [
        'Emit TechArticle, HowTo, and 4-level BreadcrumbList JSON-LD with visible content parity.',
        'Synchronize browser URL query and hash (?scenario=...&step=...#clause-X.Y) on every navigation action.',
      ],
    },
    {
      id: 'MOD-07',
      filePath: 'docs/standards/07-ui-copy-and-ci-validation.md',
      title: 'UI Copy Discipline, Zero-Truncation Law & Automated CI Guardrails',
      domain: 'Zero-Truncation UI Typography, Scope Badges & Unit Tests',
      keyRules: [
        'Never use CSS truncate ellipses on stage pills, node cards, or inspector narratives.',
        'Enforce all modular standards via automated unit tests in lib/*.test.ts.',
      ],
    },
  ];

const TASK_TO_MODULE_CHAIN: Record<
  AuthoringTaskType,
  readonly DocumentationModuleId[]
> = {
  NEW_SCENARIO: [
    'MOD-01',
    'MOD-02',
    'MOD-03',
    'MOD-04',
    'MOD-05',
    'MOD-06',
    'MOD-07',
  ],
  STEP_BY_STEP_GUIDE: [
    'MOD-01',
    'MOD-02',
    'MOD-03',
    'MOD-04',
    'MOD-06',
    'MOD-07',
  ],
  MARKDOWN_TECHNICAL_DOC: ['MOD-01', 'MOD-02', 'MOD-03', 'MOD-07'],
  TELEMETRY_AND_CLI: ['MOD-03', 'MOD-04', 'MOD-05', 'MOD-07'],
  UI_COMPONENT_COPY: ['MOD-02', 'MOD-06', 'MOD-07'],
};

/**
 * Returns the ordered chain of documentation standard modules required for a given authoring task.
 */
export function getRequiredModulesForTask(
  task: AuthoringTaskType
): DocumentationStandardModuleSpec[] {
  const ids = TASK_TO_MODULE_CHAIN[task];
  return ids.map(
    (id) => DOCUMENTATION_STANDARD_MODULES.find((m) => m.id === id)!
  );
}

const NON_ENGLISH_ARABIC_PERSIAN_REGEX = /[\u0600-\u06FF]/;
const FORBIDDEN_MARKETING_FLUFF_REGEX =
  /\b(super sophisticated hacker|magic trick|breaks through the firewall somehow|revolutionary cyber)\b/i;

export interface StandardValidationResult {
  valid: boolean;
  violations: string[];
}

/**
 * Validates any Markdown document against `MOD-01` (Template Skeleton) and `MOD-02` (Language & Tone).
 */
export function validateMarkdownDocumentStandard(
  markdownContent: string,
  documentLabel = 'MarkdownDocument'
): StandardValidationResult {
  const violations: string[] = [];
  const trimmed = markdownContent.trim();
  const withoutCodeFences = trimmed.replace(/```[\s\S]*?```/g, '');

  if (!trimmed.startsWith('# ')) {
    violations.push(
      `[${documentLabel}] MOD-01 Violation: Document must begin with a level-1 heading ('# Title').`
    );
  }

  const h1Lines = withoutCodeFences
    .split('\n')
    .filter((line) => /^#\s+\S+/.test(line.trim()));
  if (h1Lines.length !== 1) {
    violations.push(
      `[${documentLabel}] MOD-01 Violation: Document must contain exactly 1 top-level H1 heading outside code blocks (found ${h1Lines.length}).`
    );
  }

  if (!/>\s*\*\*(Module|Scope|Authoritative)/i.test(trimmed)) {
    violations.push(
      `[${documentLabel}] MOD-01 Violation: Document must include a metadata blockquote ('> **Scope**: ...' or '> **Module ID**: ...') below the H1.`
    );
  }

  if (!/^##\s+1\.\s+/m.test(trimmed)) {
    violations.push(
      `[${documentLabel}] MOD-01 Violation: Top-level H2 sections must be numbered starting with '## 1. ...'.`
    );
  }

  if (!trimmed.includes('---')) {
    violations.push(
      `[${documentLabel}] MOD-01 Violation: Document must include horizontal section dividers ('---').`
    );
  }

  if (NON_ENGLISH_ARABIC_PERSIAN_REGEX.test(trimmed)) {
    violations.push(
      `[${documentLabel}] MOD-02 Violation: Document contains non-English (Persian/Arabic) characters.`
    );
  }

  const proseWithoutForbiddenRuleExamples = trimmed
    .split('\n')
    .filter((line) => !line.includes('**Forbidden**:'))
    .join('\n');

  if (FORBIDDEN_MARKETING_FLUFF_REGEX.test(proseWithoutForbiddenRuleExamples)) {
    violations.push(
      `[${documentLabel}] MOD-02 Violation: Document contains forbidden vague marketing clichés.`
    );
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Validates an `AttackScenario` end-to-end across modules `MOD-01` through `MOD-06`.
 */
export function validateScenarioAgainstModularStandards(
  scenario: AttackScenario
): StandardValidationResult {
  const violations: string[] = [];

  // MOD-01: Structural & Slug checks
  if (!/^[a-zA-Z0-9-]+$/.test(scenario.id) || scenario.id.length < 10) {
    violations.push(
      `[${scenario.id}] MOD-01 Violation: Scenario id must be URL-safe kebab-case (/^[a-zA-Z0-9-]+$/, >= 10 chars).`
    );
  }
  if (!scenario.code || scenario.code.trim().length < 3) {
    violations.push(
      `[${scenario.id}] MOD-01 Violation: Scenario code must be non-empty.`
    );
  }
  if (!scenario.name || scenario.name.trim().length < 20) {
    violations.push(
      `[${scenario.id}] MOD-01 Violation: Scenario name is too short (< 20 chars).`
    );
  }
  if (!scenario.shortSubtitle || scenario.shortSubtitle.trim().length < 20) {
    violations.push(
      `[${scenario.id}] MOD-01 Violation: Scenario shortSubtitle is too short (< 20 chars).`
    );
  }
  if (!scenario.overview || scenario.overview.trim().length < 120) {
    violations.push(
      `[${scenario.id}] MOD-01 Violation: Scenario overview must be an Answer-First paragraph (>= 120 chars).`
    );
  }
  if (!scenario.stages || scenario.stages.length < 2) {
    violations.push(
      `[${scenario.id}] MOD-01/MOD-04 Violation: Scenario must define at least 2 kill-chain stages.`
    );
  }

  // MOD-02: 100% English & 3-Layer Story-to-Spec Guide
  if (
    NON_ENGLISH_ARABIC_PERSIAN_REGEX.test(scenario.name) ||
    NON_ENGLISH_ARABIC_PERSIAN_REGEX.test(scenario.overview)
  ) {
    violations.push(
      `[${scenario.id}] MOD-02 Violation: Scenario contains non-English characters.`
    );
  }

  const guide = buildDiagramStepGuideModel(scenario, 1);
  if (
    !guide.briefing.storyAnalogy ||
    guide.briefing.storyAnalogy.trim().length < 60
  ) {
    violations.push(
      `[${scenario.id}] MOD-02 Violation: Scenario briefing.storyAnalogy must be >= 60 chars.`
    );
  }
  if (
    !guide.briefing.plainSummary ||
    guide.briefing.plainSummary.trim().length < 80
  ) {
    violations.push(
      `[${scenario.id}] MOD-02 Violation: Scenario briefing.plainSummary must be >= 80 chars.`
    );
  }

  // MOD-03: Inline Purpose Parentheticals & Stage Specs
  for (const stage of scenario.stages) {
    if (!/^T\d{4}(\.\d{3})?$/.test(stage.mitreTechniqueId)) {
      violations.push(
        `[${scenario.id}] Stage ${stage.index} MOD-01 Violation: Invalid MITRE ID '${stage.mitreTechniqueId}'.`
      );
    }
    if (!stage.keySpecs || stage.keySpecs.length < 2) {
      violations.push(
        `[${scenario.id}] Stage ${stage.index} MOD-04 Violation: Must include at least 2 keySpecs.`
      );
    }
  }

  const combinedNarrative = [
    scenario.overview,
    ...scenario.stages.map((s) => s.description),
    guide.briefing.storyAnalogy,
    guide.briefing.plainSummary,
    ...guide.steps.map(
      (s) => `${s.storyAnalogy} ${s.simpleExplanation} ${s.howItWorksInPractice}`
    ),
  ].join(' ');
  if (!combinedNarrative.includes('(') || !combinedNarrative.includes(')')) {
    violations.push(
      `[${scenario.id}] MOD-03 Violation: Narrative must include inline purpose parentheticals '(...)'.`
    );
  }

  // MOD-04: Telemetry & Detection Rule
  if (!scenario.telemetry || scenario.telemetry.length === 0) {
    violations.push(
      `[${scenario.id}] MOD-04 Violation: Scenario must include synthetic forensic telemetry events.`
    );
  } else {
    const missingDetection = scenario.telemetry.some(
      (ev) =>
        !ev.detectionRule ||
        !ev.detectionRule.ruleCode ||
        !ev.detectionRule.mitigation
    );
    if (missingDetection) {
      violations.push(
        `[${scenario.id}] MOD-04 Violation: Every telemetry event must include a complete detectionRule (ruleCode and mitigation).`
      );
    }
  }

  // MOD-05: Multi-Source Threat Intelligence Attribution (>= 3 primary sources)
  const attribution = getScenarioAttribution(scenario);
  if (!attribution.primarySources || attribution.primarySources.length < 3) {
    violations.push(
      `[${scenario.id}] MOD-05 Violation: Scenario must have >= 3 independent primarySources.`
    );
  }
  if (
    !attribution.multiSourceSynthesis ||
    attribution.multiSourceSynthesis.trim().length < 50
  ) {
    violations.push(
      `[${scenario.id}] MOD-05 Violation: Scenario must have a non-empty multiSourceSynthesis.`
    );
  }

  // MOD-06: SEO JSON-LD Graph & URL Deep-Link Round-Trip
  const jsonLd = buildScenarioJsonLd(scenario);
  if (!Array.isArray(jsonLd['@graph']) || jsonLd['@graph'].length !== 3) {
    violations.push(
      `[${scenario.id}] MOD-06 Violation: buildScenarioJsonLd must emit 3 entities (TechArticle, HowTo, BreadcrumbList).`
    );
  }

  const serializedUrl = serializeWorkbenchUrlState({
    scenarioId: scenario.id,
    activeStageIndex: 1,
    expandedNodeId: null,
    selectedInternalSubNodeId: null,
    selectedNodeId: null,
    selectedTelemetryId: null,
    inspectorOpen: true,
    inspectorTab: 'STEP_GUIDE',
    viewMode: 'TOPOLOGY',
    activeEnvironment: 'WORKSTATION',
    focusedPartHash: 'clause-1.1',
  });
  const [searchPart, hashPart] = serializedUrl.split('#');
  const parsedUrl = parseWorkbenchUrlState(
    searchPart,
    hashPart ? `#${hashPart}` : '',
    readLastVisitedDiagramSnapshot(scenario.id)
  );
  if (
    parsedUrl.state.scenarioId !== scenario.id ||
    parsedUrl.state.activeStageIndex !== 1 ||
    parsedUrl.focusedPartHash !== 'clause-1.1'
  ) {
    violations.push(
      `[${scenario.id}] MOD-06 Violation: URL state round-trip failed for '${serializedUrl}'.`
    );
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export interface MarkdownDocumentTemplateInput {
  moduleId: string;
  title: string;
  scope: string;
  enforcedBy: string;
  purposeParagraph: string;
  asciiDiagram: string;
  rules: Array<{ title: string; description: string }>;
  antiPatternExample: string;
  canonicalExample: string;
  checklistItems: string[];
}

/**
 * Generates a 100% `MOD-01` & `MOD-02` compliant Markdown engineering document from structured inputs.
 */
export function generateMarkdownDocumentTemplate(
  input: MarkdownDocumentTemplateInput
): string {
  const rulesSection = input.rules
    .map(
      (r, idx) =>
        `### Rule ${idx + 1} — ${r.title}\n- ${r.description}`
    )
    .join('\n\n');

  const checklistSection = input.checklistItems
    .map((item) => `- [ ] ${item}`)
    .join('\n');

  return [
    `# ${input.title} (\`${input.moduleId}\`)`,
    '',
    `> **Module ID**: \`${input.moduleId}\`  `,
    `> **Scope**: ${input.scope}  `,
    `> **Parent Index**: [\`/docs/standards/README.md\`](./README.md) · **Enforced By**: \`${input.enforcedBy}\``,
    '',
    '---',
    '',
    '## 1. Purpose & Core Philosophy',
    '',
    input.purposeParagraph,
    '',
    '```',
    input.asciiDiagram,
    '```',
    '',
    '---',
    '',
    '## 2. Structural Anatomy & Mandatory Rules',
    '',
    rulesSection,
    '',
    '---',
    '',
    '## 3. Concrete Before & After Examples (Anti-Pattern vs. Canonical Pattern)',
    '',
    '### Anti-Pattern',
    `> ${input.antiPatternExample}`,
    '',
    '### Canonical Pattern',
    `> ${input.canonicalExample}`,
    '',
    '---',
    '',
    `## 4. Verification Checklist (\`${input.moduleId}\`)`,
    '',
    checklistSection,
    '',
  ].join('\n');
}
