/**
 * Programmatic Modular Documentation & Content Authoring Standard Engine (`MOD-00` .. `MOD-12`)
 *
 * Codifies the modular documentation standards in `/docs/standards/` as executable
 * TypeScript contracts, validators, and document template generators.
 */

import { AttackScenario } from '@/modules/scenarios/types';
import './attack-scenarios';
import {
  buildDiagramStepGuideModel,
  parseStructuredExplanationClauses,
} from './scenario-step-guides';
import { getScenarioAttribution } from './attack-sources-and-legal';
import { buildScenarioJsonLd } from './seo-metadata';
import {
  parseWorkbenchUrlState,
  readLastVisitedDiagramSnapshot,
  serializeWorkbenchUrlState,
} from './diagram-memory-store';
import {
  findTechnicalJargonInStory,
  listScenario3DSections,
} from './section-3d-registry';

export type DocumentationModuleId =
  | 'MOD-00'
  | 'MOD-01'
  | 'MOD-02'
  | 'MOD-03'
  | 'MOD-04'
  | 'MOD-05'
  | 'MOD-06'
  | 'MOD-07'
  | 'MOD-08'
  | 'MOD-09'
  | 'MOD-10'
  | 'MOD-11'
  | 'MOD-12';

export type AuthoringTaskType =
  | 'NEW_SCENARIO'
  | 'STEP_BY_STEP_GUIDE'
  | 'MARKDOWN_TECHNICAL_DOC'
  | 'TELEMETRY_AND_CLI'
  | 'UI_COMPONENT_COPY'
  | 'INTERACTIVE_3D_STORY_SECTION'
  | 'INSPECTOR_PANEL_SHELL';

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
        'Routes every authoring task to a deterministic chain of specialized modules (MOD-01..MOD-12).',
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
        'Pair every technical token (binaries, hex flags, syscalls, kernel structs, handles, protocols, memory regions) with an immediate plain-English inline purpose parenthetical (...) explaining WHAT it is and WHY it is used—including inside howItWorksInPractice and underTheHood.',
        'Preserve exact hex constants alongside symbolic names (e.g., CREATE_SUSPENDED = 0x00000004) and reject dense jargon-dump sentences via validateTechnicalSectionInlineClarity().',
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
    {
      id: 'MOD-08',
      filePath: 'docs/standards/08-story-technical-section-standard.md',
      title: 'Canonical Story-to-Technical & 3D Section Standard',
      domain:
        'Story → 3D Film → Technical Ordering, Prop-Purpose Key & Per-Token Inline Clarity',
      keyRules: [
        'Keep Story Analogy 100% jargon-free (findTechnicalJargonInStory === []), explicitly state what every named Story prop does (validateStoryPropClarity), and render 4 or 6 explicit Story-to-Technical Key mappings inside the Story card when Story is shown.',
        'Canonical sectionOrder is Story → Interactive 3D film → Technical clauses (ANIME_3D_STAGE_STANDARD); Technical never sits above the film. Steps #0 Scenario Briefing uses omitStory (Overview owns Story) and expands technical detail instead.',
      ],
    },
    {
      id: 'MOD-09',
      filePath: 'docs/standards/09-threejs-anime-visual-and-choreography-standard.md',
      title: 'Three.js Cel-Shaded Anime Visual, HUD & Clean-Scene Standard',
      domain: 'Cel-Shaded Anime Aesthetics, Zero Japanese Text & Zero Clutter Particles',
      keyRules: [
        'Use cel-shaded toon materials, ink outlines, selective bloom, anime CSS canvas frames, and translucent floating Story+Technical callouts with zero Japanese characters.',
        'Eliminate decorative glitter, sparkle, dust, or sand particle clouds and keep foreground sightlines and signboards 100% unobstructed.',
      ],
    },
    {
      id: 'MOD-10',
      filePath: 'docs/standards/10-scenario-adaptive-3d-storytelling-and-rollout-playbook.md',
      title: 'Scenario-Adaptive 3D Storytelling & Cross-Scenario Rollout Playbook',
      domain: 'Domain-Native 3D Metaphor Diversity & Modular Rollout',
      keyRules: [
        'Design unique, domain-native 3D worlds and literal story-beat choreography tailored to each scenario rather than cloning one template or using abstract boxes.',
        'Add memory-forensics 3D comparisons strictly for scenarios with documented memoryBlocks and isolate builders per scenario family.',
      ],
    },
    {
      id: 'MOD-11',
      filePath: 'docs/standards/11-scenario-writing-and-narrative-blueprint.md',
      title: 'Scenario & Narrative Writing Blueprint (Field-by-Field Manual & Templates)',
      domain: 'Field-Level Writing Formulas, Prop-Purpose & Per-Token Clarity',
      keyRules: [
        'Follow deterministic field-by-field writing formulas (Formulas A-E / A2) across briefing.storyAnalogy, briefing.plainSummary (Overview roadmap), storyMappings, steps[i].simpleExplanation, steps[i].howItWorksInPractice, callouts, and phases.',
        'Enforce Prop-Purpose Clarity on Story, Overview roadmap altitude on briefing.plainSummary, and Per-Token Inline Why Parentheticals on Step/Memory deep-dives via validateSectionFullClarityStandard().',
      ],
    },
    {
      id: 'MOD-12',
      filePath: 'docs/standards/12-inspector-panel-ownership-and-ui-shell.md',
      title: 'Inspector Panel Ownership, Tab Shell, Single-Card Merge & Chrome Standard',
      domain: 'Inspector Tab Ownership, Single-Card Merges, Stage Filter, Sidebar Labels & Modular Shell',
      keyRules: [
        'Overview owns Story Analogy + roadmap; Steps #0 omits Story and expands technical briefing; Process Hierarchy owns Cascading Process; Memory owns VAD; Stage Filter is hidden on Overview/Steps/Process Hierarchy shells.',
        'Single-Card Merge Law: Overview title+Story, Steps stage pills, and Process Hierarchy title+pills+embedded tree each occupy one card — never stacked redundant white cards; sidebar labels never include (N) counts.',
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
    'MOD-11',
    'MOD-04',
    'MOD-05',
    'MOD-06',
    'MOD-07',
    'MOD-12',
  ],
  STEP_BY_STEP_GUIDE: [
    'MOD-01',
    'MOD-02',
    'MOD-03',
    'MOD-11',
    'MOD-04',
    'MOD-06',
    'MOD-07',
    'MOD-08',
    'MOD-12',
  ],
  MARKDOWN_TECHNICAL_DOC: ['MOD-01', 'MOD-02', 'MOD-03', 'MOD-07'],
  TELEMETRY_AND_CLI: ['MOD-03', 'MOD-04', 'MOD-05', 'MOD-07'],
  UI_COMPONENT_COPY: ['MOD-02', 'MOD-06', 'MOD-07', 'MOD-08', 'MOD-12'],
  INTERACTIVE_3D_STORY_SECTION: [
    'MOD-02',
    'MOD-03',
    'MOD-11',
    'MOD-08',
    'MOD-09',
    'MOD-10',
    'MOD-07',
  ],
  INSPECTOR_PANEL_SHELL: ['MOD-11', 'MOD-08', 'MOD-12', 'MOD-07'],
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

const TECHNICAL_TOKEN_SCAN_REGEX =
  /\b(?:ntdll![A-Za-z0-9_]+|nt![A-Za-z0-9_]+|CreateProcessW|NtCreateUserProcess|NtUnmapViewOfSection|MiUnmapViewOfSection|VirtualAllocEx|WriteProcessMemory|SetThreadContext|GetThreadContext|ResumeThread|NtAllocateVirtualMemory|NtWriteVirtualMemory|NtSetContextThread|NtResumeThread|NtQueryInformationProcess|CreateRemoteThread|OpenProcess|WinHttpConnect|RtlUserThreadStart|CREATE_SUSPENDED|PROCESS_ALL_ACCESS|PAGE_EXECUTE_READWRITE|STATUS_SUCCESS|EPROCESS|KTRAP_FRAME(?:\.Rcx)?|MEM_PRIVATE|SEC_IMAGE|SuspendCount|PreviousSuspendCount|GrantedAccess|hProcess|hThread|ntdll\.dll|winhttp\.dll|0x[0-9A-Fa-f]{4,}|PEB\+0x[0-9A-Fa-f]+|JA3)\b/g;

const PAIRED_STORY_PROP_REGEX =
  /\b(?:two|pair of|both)\s+(?:[a-z-]+\s+){0,3}(?:master\s+keys?|keys?|badges?|passes?|tickets?|switches?|locks?|tokens?)\b/i;

function stripParentheticalBlocks(text: string): string {
  return text.replace(/\([^()]*\)/g, ' ');
}

function countSubstantiveInlineParentheticals(text: string): number {
  const matches = text.match(/\(([^()]{20,})\)/g) || [];
  let count = 0;
  for (const raw of matches) {
    const inner = raw.slice(1, -1).trim();
    const wordCount = inner.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 4) {
      count += 1;
    }
  }
  return count;
}

function extractDistinctTechnicalTokensOutsideParens(text: string): string[] {
  const outside = stripParentheticalBlocks(text);
  const found = new Set<string>();
  const matches = outside.match(TECHNICAL_TOKEN_SCAN_REGEX) || [];
  for (const m of matches) {
    found.add(m.toLowerCase());
  }
  return Array.from(found);
}

/**
 * Permanent `MOD-03` & `MOD-11` validator: guarantees that Step/Memory deep-dive
 * technical sections (`simpleExplanation`, `howItWorksInPractice`, `underTheHood`,
 * `stages[].description`) never dump chains of unexplained technical APIs, structs,
 * flags, handles, or hex addresses without plain-English inline purpose parentheticals.
 *
 * Overview `briefing.plainSummary` is a roadmap (`MOD-11` Formula A2) and must NOT
 * be held to this Step-level API-density gate — use `validateOverviewRoadmapAltitude`.
 */

/** Memory-forensics tokens that must stay out of Overview roadmap prose. */
const OVERVIEW_FORBIDDEN_MEMORY_TOKEN_REGEX =
  /\b(?:VAD|SEC_IMAGE|MEM_PRIVATE|PEB\s*\+\s*0x|Virtual Address Descriptor)\b/i;

/**
 * Attack categories whose Overview `plainSummary` must satisfy MOD-11 Formula A2.
 * All live AttackCategory values (except `ALL`) are enforced after the full rollout.
 */
export const OVERVIEW_ROADMAP_ENFORCED_CATEGORIES: ReadonlySet<string> = new Set([
  'MALWARE',
  'NETWORK_WEB',
  'ACTIVE_DIRECTORY',
  'CLOUD_SAAS',
  'SUPPLY_CHAIN_CICD',
  'ZERO_DAY_APPLIANCES',
  'KERNEL_FIRMWARE_BYOVD',
  'RANSOMWARE_EXTORTION',
  'CONTAINERS_KUBERNETES',
  'ICS_OT_SCADA',
  'MOBILE_TELECOM_SPYWARE',
  'DATABASE_DATA_PLATFORMS',
  'AI_LLM_MLOPS_SECURITY',
  'ICS_OT_MOBILE',
]);

/**
 * Extra scenario IDs (outside enforced categories) that must already satisfy
 * Formula A2. Prefer expanding `OVERVIEW_ROADMAP_ENFORCED_CATEGORIES` instead.
 */
export const OVERVIEW_ROADMAP_PILOT_SCENARIO_IDS: ReadonlySet<string> = new Set([
  // Covered by MALWARE category enforcement after rollout.
]);

export function isOverviewRoadmapEnforced(scenario: {
  id: string;
  category: string;
}): boolean {
  return (
    OVERVIEW_ROADMAP_ENFORCED_CATEGORIES.has(scenario.category) ||
    OVERVIEW_ROADMAP_PILOT_SCENARIO_IDS.has(scenario.id)
  );
}

/**
 * Permanent `MOD-11` Formula A2 validator: Overview `plainSummary` must stay at
 * roadmap altitude (WHO/WHERE + arc + later-section map) and must not host
 * Memory forensics dumps or Step-length API walkthroughs.
 */
export function validateOverviewRoadmapAltitude(
  plainSummary: string,
  sectionLabel = 'briefing.plainSummary'
): StandardValidationResult {
  const violations: string[] = [];
  const trimmed = plainSummary.trim();
  const length = trimmed.length;

  if (length < 120) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview plainSummary must be >= 120 chars (roadmap altitude).`
    );
  }
  if (length > 950) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview plainSummary is ${length} chars (target 350–850, hard max 950). It must stay a clear roadmap, not a Step-by-Step API deep-dive.`
    );
  }

  if (OVERVIEW_FORBIDDEN_MEMORY_TOKEN_REGEX.test(trimmed)) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview must not host Memory forensics tokens (VAD, SEC_IMAGE, MEM_PRIVATE, PEB+offset). Move those facts to the Memory section.`
    );
  }

  const outsideTokens = extractDistinctTechnicalTokensOutsideParens(trimmed);
  if (outsideTokens.length >= 12) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview introduces ${outsideTokens.length} distinct technical tokens outside parentheticals (max 11 at roadmap altitude). Move per-step API chains into Steps.`
    );
  }

  // Require an explicit later-section map (not incidental words like "in memory" / "overwriting").
  const mentionsLaterSections =
    /\bSteps?\s*#/i.test(trimmed) ||
    /\bSteps?\s+\d/i.test(trimmed) ||
    /\bMemory\s+tab\b/i.test(trimmed) ||
    /\bProcess Hierarchy\b/i.test(trimmed) ||
    /\bsection map\b/i.test(trimmed);
  if (length >= 200 && !mentionsLaterSections) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview roadmap should tell the reader what later Steps and/or Memory sections will examine.`
    );
  }

  // Formula A2 readability: reject telegraphic word-truncation ("PQescapeString...", "Frame to TCP Port...").
  // Allow spaced SQL-style omits ("COPY ... FROM") which are not title cutoffs.
  if (/\w{4,}\.\.\.(?:\s|[;,]|$)/.test(trimmed)) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview plainSummary contains ellipsis truncation. Rewrite step titles into short readable phrases instead of cutting them with "...".`
    );
  }

  // Formula A2 clause #1: Answer-First WHO/WHAT/WHERE/MITRE framing.
  const hasWhoFrame =
    /^In this scenario\s*\(/i.test(trimmed) ||
    /\((?:MITRE(?:\s+ATT&CK)?|CVE-\d{4}-\d+|T\d{4}(?:\.\d{3})?)[^)]*\)/i.test(
      trimmed
    );
  if (length >= 200 && !hasWhoFrame) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview roadmap must open with Answer-First WHO/WHAT/WHERE/MITRE framing (e.g. "In this scenario (MITRE/CVE, Name)...").`
    );
  }

  // Formula A2 clause #2: one continuous attack arc in prose.
  const hasArc =
    /\b(?:one continuous arc|unfolds in one continuous arc|follows one continuous arc)\b/i.test(
      trimmed
    ) ||
    /,\s*then\s+/i.test(trimmed);
  if (length >= 200 && !hasArc) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview roadmap must describe one continuous attack arc in plain language (not a cryptic shorthand dump).`
    );
  }

  // Formula A2 clause #4: concrete detection pivot — reject the bulk-roll generic filler.
  if (
    /Primary detection pivots on correlated host and network telemetry for .+ across the documented kill chain/i.test(
      trimmed
    )
  ) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview detection pivot is generic filler. Name the concrete SIEM/EDR/log source (and Event ID when known) instead of "correlated host and network telemetry".`
    );
  }

  // Technical Overview is rendered as numbered clauses (#0.1..). Each clause must be a
  // complete explanatory sentence — never a telegraphic step-title fragment like "#2 LDAP Referral;".
  if (
    /Steps?\s*#\d+\s*[–-]\s*#\d+\s+examine\s+#\d+/i.test(trimmed) &&
    /;\s*#\d+\b/.test(trimmed)
  ) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview step map uses telegraphic "; #N Title" fragments. Write one flowing sentence that explains what each Step covers and why it matters.`
    );
  }

  const overviewClauses = parseStructuredExplanationClauses(trimmed, '0');
  if (overviewClauses.length > 5) {
    violations.push(
      `[${sectionLabel}] MOD-11 Violation: Overview plainSummary splits into ${overviewClauses.length} Technical Overview clauses (max 5). Keep 3–4 full explanatory sentences so the UI does not show meaningless fragments.`
    );
  }
  for (const clause of overviewClauses) {
    const body = clause.fullText.replace(/^[.;\s]+/, '').trim();
    if (/^#\d+\b/.test(body)) {
      violations.push(
        `[${sectionLabel}] MOD-11 Violation: Technical Overview clause #${clause.clauseCode} is a bare step-index fragment ("${body.slice(0, 48)}"). Each clause must be a complete explanatory sentence.`
      );
    }
    if (body.length > 0 && body.length < 70) {
      violations.push(
        `[${sectionLabel}] MOD-11 Violation: Technical Overview clause #${clause.clauseCode} is only ${body.length} chars. Each clause needs a short narrative explanation (why that beat matters), not a title stub.`
      );
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}
export function validateTechnicalSectionInlineClarity(
  text: string,
  sectionLabel = 'TechnicalSection'
): StandardValidationResult {
  const violations: string[] = [];
  const trimmed = text.trim();

  if (/\(\s*why\s*:|WHY\s*\/\s*(SPEC|PROTOCOL\s*EFFECT)/i.test(trimmed)) {
    violations.push(
      `[${sectionLabel}] MOD-03/MOD-11 Violation: Narrative must use natural inline explanatory parentheticals without literal '(why:' or 'WHY / SPEC' prefixes.`
    );
  }

  // Check sentence-by-sentence for dense jargon dumps lacking inline explanations
  const sentences = trimmed
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    const outsideTokens = extractDistinctTechnicalTokensOutsideParens(sentence);
    const substantiveParens = countSubstantiveInlineParentheticals(sentence);
    if (outsideTokens.length >= 4) {
      const requiredParens = Math.ceil(outsideTokens.length / 2);
      if (substantiveParens < requiredParens) {
        violations.push(
          `[${sectionLabel}] MOD-03 Violation (Sentence #${i + 1}): Found ${outsideTokens.length} technical tokens (${outsideTokens.slice(0, 6).join(', ')}) with only ${substantiveParens} substantive plain-English inline parenthetical(s) (minimum required: ${requiredParens}). Explain WHAT each technical part is and WHY it is used inline.`
        );
      }
    }
  }

  // Check overall section parenthetical density
  const totalOutsideTokens = extractDistinctTechnicalTokensOutsideParens(trimmed);
  const totalSubstantiveParens = countSubstantiveInlineParentheticals(trimmed);
  if (totalOutsideTokens.length >= 3) {
    const minRequired = Math.ceil(totalOutsideTokens.length / 2);
    if (totalSubstantiveParens < minRequired) {
      violations.push(
        `[${sectionLabel}] MOD-03 Violation: Section introduces ${totalOutsideTokens.length} distinct technical tokens with only ${totalSubstantiveParens} substantive inline parenthetical(s) (minimum required: ${minRequired}).`
      );
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Permanent `MOD-08` & `MOD-11` validator: guarantees Story Analogy prose is 100%
 * jargon-free, explicitly explains what each named/paired prop (e.g. Two Master Keys)
 * actually unlocks or does, and pairs it with clear `storyMappings`.
 */
export function validateStoryPropClarity(
  storyText: string,
  storyMappings: ReadonlyArray<{ storyTerm: string; technicalTerm: string }>,
  sectionLabel = 'StorySection'
): StandardValidationResult {
  const violations: string[] = [];

  const jargonHits = findTechnicalJargonInStory(storyText);
  if (jargonHits.length > 0) {
    violations.push(
      `[${sectionLabel}] MOD-08 Violation: Story Analogy contains leaked technical jargon (${jargonHits.join(', ')}). Keep Story 100% plain-language.`
    );
  }

  if (PAIRED_STORY_PROP_REGEX.test(storyText)) {
    const explainsBothProps =
      (/\bfirst\b/i.test(storyText) && /\bsecond\b/i.test(storyText)) ||
      (/\bkey\s*#?1\b/i.test(storyText) && /\bkey\s*#?2\b/i.test(storyText)) ||
      (/\bone\b.*\b(?:and\s+(?:one|the\s+other|another))\b/i.test(storyText));
    if (!explainsBothProps) {
      violations.push(
        `[${sectionLabel}] MOD-11 Prop-Purpose Violation: Story introduces paired props (e.g., "two master keys") without explicitly explaining what EACH prop unlocks or does (use "first ... and second ..." or "Key #1 ... and Key #2 ...").`
      );
    }

    const keyRelatedMappings = storyMappings.filter((m) =>
      /\b(?:key|badge|pass|ticket|switch|lock|token)\b/i.test(m.storyTerm)
    );
    if (storyMappings.length > 0 && keyRelatedMappings.length < 2) {
      violations.push(
        `[${sectionLabel}] MOD-08/MOD-11 Prop-Purpose Violation: Story introduces paired props, so storyMappings must map EACH prop separately with its exact technical role (found ${keyRelatedMappings.length} mapping(s)).`
      );
    }
  }

  for (const mapping of storyMappings) {
    const termJargon = findTechnicalJargonInStory(mapping.storyTerm);
    if (termJargon.length > 0) {
      violations.push(
        `[${sectionLabel}] MOD-08 Violation: storyTerm "${mapping.storyTerm}" contains technical jargon (${termJargon.join(', ')}).`
      );
    }
    if (!mapping.technicalTerm || mapping.technicalTerm.trim().length < 12) {
      violations.push(
        `[${sectionLabel}] MOD-08 Violation: technicalTerm "${mapping.technicalTerm}" is too vague; include exact technical artifact and role.`
      );
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export interface FullSectionClarityInput {
  storyAnalogy: string;
  storyMappings?: ReadonlyArray<{ storyTerm: string; technicalTerm: string }>;
  technicalTexts: ReadonlyArray<{ label: string; text: string }>;
}

/**
 * Unified permanent per-section quality gate (`MOD-03` + `MOD-08` + `MOD-11`).
 * Run this on every newly authored or upgraded scenario section (Briefing, Stage 1..N,
 * Sequence Exchange, or Memory Forensics).
 */
export function validateSectionFullClarityStandard(
  input: FullSectionClarityInput,
  sectionLabel = 'ScenarioSection'
): StandardValidationResult {
  const violations: string[] = [];

  const storyCheck = validateStoryPropClarity(
    input.storyAnalogy,
    input.storyMappings ?? [],
    `${sectionLabel}::Story`
  );
  violations.push(...storyCheck.violations);

  for (const item of input.technicalTexts) {
    const techCheck = validateTechnicalSectionInlineClarity(
      item.text,
      `${sectionLabel}::${item.label}`
    );
    violations.push(...techCheck.violations);
  }

  return {
    valid: violations.length === 0,
    violations,
  };
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
    guide.briefing.storyAnalogy.trim().length < 260
  ) {
    violations.push(
      `[${scenario.id}] MOD-11 Violation: Scenario briefing.storyAnalogy must be >= 260 chars (whole-scenario Formula A story).`
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

  // Per-step MOD-03 / MOD-11 baseline across ALL scenarios (not only 3D-upgraded).
  const DETECT_CONCRETE_SOURCE_REGEX =
    /\b(?:Event(?:\s*ID)?\s*\d+|EID\s*\d+|Sysmon|auditd|CloudTrail|Suricata|Security Event|Bits-Client|Okta|Azure AD|Windows Security|cwpsrv|Sigma|journalctl|kube-apiserver|Zeek|EDR|pcap|W3SVC|IIS|Tomcat|nginx|httpd|mcpd|tmsh|access[_-]?log|auth\.log|syslog)\b|\/var\/log/i;

  for (const step of guide.steps) {
    const stepLabel = `${scenario.id} Step ${step.stepNumber}`;

    if ((step.storyAnalogy || '').trim().length < 180) {
      violations.push(
        `[${stepLabel}] MOD-11 Violation: steps[].storyAnalogy must be >= 180 chars (stage story beat).`
      );
    }
    if ((step.simpleExplanation || '').trim().length < 320) {
      violations.push(
        `[${stepLabel}] MOD-11 Violation: steps[].simpleExplanation must be >= 320 chars (Formula C bridge).`
      );
    }
    if ((step.howItWorksInPractice || '').trim().length < 380) {
      violations.push(
        `[${stepLabel}] MOD-11 Violation: steps[].howItWorksInPractice must be >= 380 chars (Formula E deep-dive).`
      );
    }
    if ((step.detectionAndEvidence || '').trim().length < 160) {
      violations.push(
        `[${stepLabel}] MOD-11 Violation: steps[].detectionAndEvidence must be >= 160 chars (blue-team catch).`
      );
    } else if (
      !DETECT_CONCRETE_SOURCE_REGEX.test(step.detectionAndEvidence || '')
    ) {
      violations.push(
        `[${stepLabel}] MOD-11 Violation: steps[].detectionAndEvidence must name a concrete telemetry source or Event ID (not generic advice).`
      );
    }

    if (!/\([^)]{25,}\)/.test(step.simpleExplanation || '')) {
      violations.push(
        `[${stepLabel}] MOD-03 Violation: simpleExplanation must include a substantive inline purpose parenthetical (>= 25 chars) explaining technical terms.`
      );
    }
    if (!/\([^)]{25,}\)/.test(step.howItWorksInPractice || '')) {
      violations.push(
        `[${stepLabel}] MOD-03 Violation: howItWorksInPractice must include a substantive inline purpose parenthetical (>= 25 chars) explaining technical terms.`
      );
    }

    const simpleClarity = validateTechnicalSectionInlineClarity(
      step.simpleExplanation || '',
      `${stepLabel}::simpleExplanation`
    );
    violations.push(...simpleClarity.violations);
    const howClarity = validateTechnicalSectionInlineClarity(
      step.howItWorksInPractice || '',
      `${stepLabel}::howItWorksInPractice`
    );
    violations.push(...howClarity.violations);
  }

  // MOD-11 Formula A2: Overview roadmap altitude for every enforced category (3D and non-3D).
  if (isOverviewRoadmapEnforced(scenario)) {
    const overviewRoadmapCheck = validateOverviewRoadmapAltitude(
      guide.briefing.plainSummary,
      `${scenario.id}#briefing::plainSummary`
    );
    violations.push(...overviewRoadmapCheck.violations);
  }

  // Strict per-section Prop-Purpose + Per-Token Inline Why gate for all 3D-upgraded scenarios (MOD-03 + MOD-08 + MOD-11)
  const upgraded3DSections = listScenario3DSections(scenario.id);
  if (upgraded3DSections.length > 0) {
    const briefingSection = upgraded3DSections.find(
      (s) => s.sectionKey === 'briefing'
    );
    if (briefingSection) {
      // Overview briefing: Story/mapping clarity only (not Step-level API density on plainSummary)
      const briefingStoryCheck = validateStoryPropClarity(
        guide.briefing.storyAnalogy,
        briefingSection.storyMappings,
        `${scenario.id}#briefing::Story`
      );
      violations.push(...briefingStoryCheck.violations);
    }

    for (const step of guide.steps) {
      const step3d = upgraded3DSections.find(
        (s) => s.sectionKey === `step-${step.stepNumber}`
      );
      const matchingStage = scenario.stages[step.stepNumber - 1];
      const stepCheck = validateSectionFullClarityStandard(
        {
          storyAnalogy: step.storyAnalogy,
          storyMappings: step3d?.storyMappings ?? [],
          technicalTexts: [
            { label: 'simpleExplanation', text: step.simpleExplanation },
            { label: 'howItWorksInPractice', text: step.howItWorksInPractice },
            ...(matchingStage
              ? [{ label: 'stage.description', text: matchingStage.description }]
              : []),
          ],
        },
        `${scenario.id}#step-${step.stepNumber}`
      );
      violations.push(...stepCheck.violations);
    }
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
