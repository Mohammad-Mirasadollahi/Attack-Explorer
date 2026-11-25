import type {
  AttackCategory,
  AttackScenario,
  AttackStage,
  DiagramNode,
  ProcessMemoryBlock,
  ProcessTreeNode,
  TelemetryEvent,
} from '@/modules/scenarios/types';
import {
  findTechnicalJargonInStory,
  listScenario3DSections,
  type Section3DKey,
} from '@/lib/section-3d-registry';
import type { BoardTopologyKind } from '@/lib/excalidraw-boards/board-primitives';
import type { MalwareClipMechanic } from '@/components/technical-clip/malware-clips/types';
import type {
  MalwareScenario2DProfile,
  Section2DSpecInput,
} from '@/lib/malware-2d-blueprints/types';

export interface Category2DConfig {
  category: Exclude<AttackCategory, 'ALL'>;
  defaultMechanic: MalwareClipMechanic;
  defaultTopology: BoardTopologyKind;
  defaultZoneHeaders: [string, string];
  defaultControl: {
    name: string;
    detail: string;
    module: string;
    explain: string;
  };
  defaultWitnessStory: string;
}

function cleanText(raw: string | undefined, fallback: string): string {
  const s = (raw ?? '')
    .replace(/`+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > 0 ? s : fallback;
}

function clipStr(raw: string, maxLen: number): string {
  const s = cleanText(raw, '');
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.55) {
    return `${cut.slice(0, lastSpace)}…`;
  }
  return `${cut}…`;
}

function summarizeExplain(raw: string | undefined, fallback: string, maxLen = 260): string {
  const cleaned = cleanText(raw, fallback);
  if (cleaned.length <= maxLen) return cleaned;
  // Prefer ending on a clean sentence boundary within maxLen
  const slice = cleaned.slice(0, maxLen);
  const lastPeriod = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (lastPeriod >= Math.floor(maxLen * 0.45)) {
    return slice.slice(0, lastPeriod + 1).trim();
  }
  return clipStr(cleaned, maxLen);
}

function stableShortHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).slice(0, 6);
}

function makeUniqueSvgPrefix(scenarioId: string, sectionKey: Section3DKey): string {
  const slug = scenarioId.replace(/[^a-z0-9]/gi, '').slice(0, 6).toLowerCase();
  const hash = stableShortHash(scenarioId);
  const sec = sectionKey.replace('step-', 's').replace('memory-forensics', 'mf');
  return `${slug}_${hash}_${sec}`;
}

function chooseMechanicForStep(
  scenario: AttackScenario,
  stage: AttackStage | null,
  sectionKey: Section3DKey,
  config: Category2DConfig,
  stepIndex: number
): MalwareClipMechanic {
  if (sectionKey === 'memory-forensics') return 'memory-diff-scanner';

  // Use stage-specific technical text ONLY so scenario-level words like "DFIR Log"
  // or "Defender XDR" do not hijack every step onto the same mechanic.
  const stageText = [
    stage?.title ?? '',
    stage?.subtitle ?? '',
    stage?.mitreTechniqueName ?? '',
    stage?.mitreTechniqueId ?? '',
    stage?.mitreTacticPhase ?? '',
  ]
    .join(' ')
    .toLowerCase();

  // Category-first authentic domain visualizers (prevent cross-domain false positives like
  // "JNDI inject" -> memory patch, "RC4 encrypted ticket" -> ransomware, "XDR" -> timestomp)
  if (config.category === 'AI_LLM_MLOPS_SECURITY') {
    if (stepIndex === 0 || /prompt|llm|agent|rag|mcp|model|inference|planner|worker|tool|vector/.test(stageText)) {
      return 'ai-pipeline-hijack';
    }
    if (/pickle|artifact|registry|package|dependency|supply|mlflow|checkpoint/.test(stageText)) {
      return 'supply-chain-conveyor';
    }
    if (/iam|cloud|key|vault|token|oauth|entra|role|pod|cluster|gpu|ray/.test(stageText)) {
      return 'cloud-controlplane-hop';
    }
    return stepIndex % 2 === 1 ? 'cloud-controlplane-hop' : 'network-packet-wire';
  }

  if (config.category === 'ACTIVE_DIRECTORY') {
    if (/lsass|ntds|dcsync|mimikatz|sam\b|secretsdump|credential dump|comsvcs/.test(stageText)) {
      return 'credential-audit-intercept';
    }
    if (stepIndex === 0 || /kerberos|tgs|tgt|spn|ntlm|golden|silver|pass-the-hash|ticket|delegation|adcs|cert|coercion|coerce|ldap|acl|gpo|dacl/.test(stageText)) {
      return 'identity-ticket-forge';
    }
    if (/persist|gpo|service|scheduled|golden|skeleton|sid history|dcshadow/.test(stageText)) {
      return 'persistence-vault-trigger';
    }
    return 'network-packet-wire';
  }

  if (config.category === 'NETWORK_WEB' || config.category === 'ZERO_DAY_APPLIANCES') {
    if (/class load|deserial|gadget|webshell|web shell|lua|implant|backdoor|cron|systemd/.test(stageText)) {
      return stepIndex % 2 === 0 ? 'loader-hijack-rail' : 'persistence-vault-trigger';
    }
    if (/sql|sqlite|db|database|query|firmware|kernel|root|ioctl|boot/.test(stageText)) {
      return /kernel|firmware|boot/.test(stageText) ? 'ring-boundary-gate' : 'protocol-bus-actuator';
    }
    if (/token|cookie|session|oauth|saml|mfa|auth bypass|credential/.test(stageText)) {
      return 'identity-ticket-forge';
    }
    if (/shellcode|virtualalloc|virtualprotect|reflective|memory patch/.test(stageText)) {
      return 'memory-patch-lens';
    }
    return stepIndex % 3 === 2 ? 'protocol-bus-actuator' : 'network-packet-wire';
  }

  if (config.category === 'CLOUD_SAAS' || config.category === 'CONTAINERS_KUBERNETES') {
    if (/oauth|saml|mfa|session|cookie|token|entra|okta|federation|consent|phish|refresh/.test(stageText)) {
      return 'identity-ticket-forge';
    }
    if (/container escape|kernel|cgroup|hostpath|privileged|mount|runc|ptrace|namespace/.test(stageText)) {
      return 'ring-boundary-gate';
    }
    if (/image|registry|ci\/cd|helm|pipeline|supply|build/.test(stageText)) {
      return 'supply-chain-conveyor';
    }
    if (/cloudtrail|audit log|disable logging|tamper/.test(stageText)) {
      return 'forensic-dual-ledger';
    }
    return stepIndex % 3 === 2 ? 'network-packet-wire' : 'cloud-controlplane-hop';
  }

  if (config.category === 'SUPPLY_CHAIN_CICD') {
    if (/dll|sideload|ld_preload|loader|hook|binary|trojan/.test(stageText)) {
      return 'loader-hijack-rail';
    }
    if (/token|secret|oidc|oauth|pat\b|github token|credential/.test(stageText)) {
      return 'identity-ticket-forge';
    }
    if (/cloud|runner|aws|azure|artifact upload|exfil|c2|beacon/.test(stageText)) {
      return stepIndex % 2 === 0 ? 'cloud-controlplane-hop' : 'network-packet-wire';
    }
    return 'supply-chain-conveyor';
  }

  if (config.category === 'RANSOMWARE_EXTORTION') {
    if (/ransom|vssadmin|shadow|wipe|locker|encrypt.*file|file.*encrypt|esxi.*encrypt|extort|impact|mass encrypt|sabotage/.test(stageText)) {
      return 'ransomware-io-destroy';
    }
    if (/lsass|ntds|dcsync|credential|mimikatz|dump/.test(stageText)) {
      return 'credential-audit-intercept';
    }
    if (/kerberos|rdp|smb|psexec|lateral|vpn|edge|exploit|exfil|rclone|mega/.test(stageText)) {
      return 'network-packet-wire';
    }
    if (/gpo|service|scheduled|persist|edr|byovd|driver|disable/.test(stageText)) {
      return /driver|byovd|kernel/.test(stageText) ? 'ring-boundary-gate' : 'persistence-vault-trigger';
    }
    return stepIndex === 0 ? 'network-packet-wire' : 'ransomware-io-destroy';
  }

  if (config.category === 'KERNEL_FIRMWARE_BYOVD') {
    if (/virtualprotect|amsi|etw|shellcode|patch|memory/.test(stageText)) {
      return 'memory-patch-lens';
    }
    if (/boot|uefi|spi|persist|registry|service/.test(stageText)) {
      return stepIndex % 2 === 1 ? 'persistence-vault-trigger' : 'ring-boundary-gate';
    }
    return 'ring-boundary-gate';
  }

  if (
    config.category === 'DATABASE_DATA_PLATFORMS' ||
    config.category === 'ICS_OT_SCADA' ||
    config.category === 'MOBILE_TELECOM_SPYWARE'
  ) {
    if (/kernel|sandbox|baseband|jailbreak|exploit|ring 0|driver|firmware/.test(stageText)) {
      return 'ring-boundary-gate';
    }
    if (/c2|beacon|exfil|http|dns|tunnel|lateral|smb|ssh|vpn|imessage|sms|ss7/.test(stageText)) {
      return stepIndex % 2 === 1 ? 'network-packet-wire' : 'protocol-bus-actuator';
    }
    if (/credential|token|oauth|session|key|password/.test(stageText)) {
      return 'identity-ticket-forge';
    }
    return 'protocol-bus-actuator';
  }

  // Generic safe fallback (narrow, non-colliding patterns)
  if (/virtualalloc|virtualprotect|shellcode|hollow|amsi|reflective dll|rwx/.test(stageText)) {
    return 'memory-patch-lens';
  }
  if (/timestomp|wevtutil|clear.*log|evtx.*tamper|mft.*mismatch/.test(stageText)) {
    return 'forensic-dual-ledger';
  }
  return config.defaultMechanic;
}

function chooseTopologyForSection(
  sectionKey: Section3DKey,
  mechanic: MalwareClipMechanic,
  config: Category2DConfig,
  stepIndex: number
): BoardTopologyKind {
  if (sectionKey === 'memory-forensics') return 'memory-vad-compare';
  if (sectionKey === 'briefing') return config.defaultTopology;

  switch (mechanic) {
    case 'network-packet-wire':
      return stepIndex % 2 === 0 ? 'network-hop-chain' : 'pipeline-flow';
    case 'identity-ticket-forge':
      return stepIndex % 2 === 0 ? 'network-hop-chain' : 'split-boundary';
    case 'cloud-controlplane-hop':
    case 'ai-pipeline-hijack':
    case 'protocol-bus-actuator':
      return stepIndex % 2 === 0 ? 'protocol-layer-stack' : 'split-boundary';
    case 'supply-chain-conveyor':
    case 'loader-hijack-rail':
      return 'supplychain-branch';
    case 'persistence-vault-trigger':
      return 'persistence-triad';
    case 'forensic-dual-ledger':
      return 'forensic-timeline';
    case 'ring-boundary-gate':
      return 'split-boundary';
    case 'memory-diff-scanner':
      return 'memory-vad-compare';
    default:
      return stepIndex % 2 === 0 ? 'pipeline-flow' : 'network-hop-chain';
  }
}

function zoneHeadersForTopology(
  topology: BoardTopologyKind,
  config: Category2DConfig,
  stage: AttackStage | null
): [string, string] | undefined {
  if (topology === 'memory-vad-compare') {
    return ['EXPECTED / CLEAN ON-DISK BASELINE', 'LIVE MEMORY / ANOMALOUS REGION'];
  }
  if (topology === 'forensic-timeline') {
    return ['OBSERVED ATTACKER ACTIVITY / MODIFIED STATE', 'IMMUTABLE AUDIT LEDGER & DFIR VERDICT'];
  }
  if (topology === 'split-boundary') {
    return [
      `UNTRUSTED / INITIAL ZONE (${clipStr(stage?.mitreTechniqueId ?? config.category, 24)})`,
      'PROTECTED / PRIVILEGED TARGET BOUNDARY',
    ];
  }
  if (topology === 'network-hop-chain' || topology === 'protocol-layer-stack') {
    return config.defaultZoneHeaders;
  }
  return undefined;
}

function pickStageTelemetry(
  scenario: AttackScenario,
  stageIndex: number
): TelemetryEvent[] {
  const exact = scenario.telemetry.filter((t) => t.stageIndex === stageIndex);
  if (exact.length > 0) return exact;
  const fallback = scenario.telemetry[stageIndex] ?? scenario.telemetry[0];
  return fallback ? [fallback] : [];
}

function findNode(
  scenario: AttackScenario,
  id: string | undefined
): DiagramNode | undefined {
  if (!id) return undefined;
  return scenario.nodes.find((n) => n.id === id);
}

function pickPrimaryNodes(
  scenario: AttackScenario,
  stage: AttackStage | null,
  events: TelemetryEvent[]
): {
  sourceNode: DiagramNode;
  targetNode: DiagramNode;
  sensorNode?: DiagramNode;
} {
  const ev0 = events[0];
  const srcFromEv = findNode(scenario, ev0?.sourceNodeId);
  const tgtFromEv = findNode(scenario, ev0?.targetNodeId);

  const activeNodes = (stage?.activeNodeIds ?? [])
    .map((id) => findNode(scenario, id))
    .filter((n): n is DiagramNode => Boolean(n));
  const compNodes = (stage?.compromisedNodeIds ?? [])
    .map((id) => findNode(scenario, id))
    .filter((n): n is DiagramNode => Boolean(n));

  const attackerNode = scenario.nodes.find((n) => n.role === 'attacker');
  const sensorNode = scenario.nodes.find((n) => n.role === 'firewall_siem');

  const sourceNode =
    srcFromEv ??
    activeNodes[0] ??
    attackerNode ??
    scenario.nodes[0];

  const targetNode =
    (tgtFromEv && tgtFromEv.id !== sourceNode.id ? tgtFromEv : undefined) ??
    compNodes.find((n) => n.id !== sourceNode.id) ??
    activeNodes.find((n) => n.id !== sourceNode.id && n.role !== 'firewall_siem') ??
    scenario.nodes.find((n) => n.id !== sourceNode.id && n.role !== 'firewall_siem') ??
    scenario.nodes[scenario.nodes.length - 1] ??
    sourceNode;

  return { sourceNode, targetNode, sensorNode };
}

function pickStageProcess(
  scenario: AttackScenario,
  stageIndex: number
): ProcessTreeNode | undefined {
  const active = scenario.processTree.filter(
    (p) => p.activeFromStage <= stageIndex
  );
  return (
    active.find((p) => p.status !== 'normal') ??
    active[active.length - 1] ??
    scenario.processTree[0]
  );
}

function collectMemoryBlocks(
  scenario: AttackScenario
): Array<{ proc: ProcessTreeNode; block: ProcessMemoryBlock }> {
  const out: Array<{ proc: ProcessTreeNode; block: ProcessMemoryBlock }> = [];
  for (const proc of scenario.processTree) {
    for (const block of proc.memoryBlocks ?? []) {
      out.push({ proc, block });
    }
  }
  return out;
}

function makeControlForStep(
  scenario: AttackScenario,
  stage: AttackStage | null,
  targetNode: DiagramNode,
  config: Category2DConfig,
  sectionKey: Section3DKey
): Section2DSpecInput['control'] {
  if (sectionKey === 'memory-forensics') {
    const cleanBlock = collectMemoryBlocks(scenario).find(
      (b) => b.block.status === 'clean'
    );
    if (cleanBlock) {
      return {
        name: `${cleanBlock.proc.name} · ${cleanBlock.block.section}`,
        detail: `${cleanBlock.block.address} (${cleanBlock.block.permissions}) untouched`,
        module: 'Clean Baseline Memory Section',
        explain: `This baseline section (${cleanBlock.block.section} at ${cleanBlock.block.address}) remains clean with expected ${cleanBlock.block.permissions} permissions, giving investigators a clear contrast against the tampered memory region.`,
      };
    }
    return {
      name: `Clean On-Disk Image (${clipStr(targetNode.label, 28)})`,
      detail: 'Signed binary & read-only system modules unchanged',
      module: 'File-Backed Baseline Invariant',
      explain: `Comparing live runtime memory against the untouched on-disk binary and clean shared libraries proves that the anomalous code or permissions were introduced dynamically at runtime.`,
    };
  }

  // Prefer a non-compromised node in the scenario if one exists (other than attacker)
  const compromisedSet = new Set(stage?.compromisedNodeIds ?? []);
  const cleanNode = scenario.nodes.find(
    (n) =>
      n.id !== targetNode.id &&
      n.role !== 'attacker' &&
      n.role !== 'firewall_siem' &&
      !compromisedSet.has(n.id)
  );
  if (cleanNode) {
    return {
      name: clipStr(cleanNode.label, 40),
      detail: clipStr(
        cleanNode.details.privilege
          ? `${cleanNode.details.osOrType} · ${cleanNode.details.privilege} intact`
          : `${cleanNode.sublabel || cleanNode.details.osOrType} untouched`,
        56
      ),
      module: cleanNode.details.osOrType || config.defaultControl.module,
      explain: cleanText(
        `${cleanNode.label} remains untouched during this step (${cleanNode.details.description}). Tracking what did not change confirms the exact blast radius and prevents false assumptions during triage.`,
        config.defaultControl.explain
      ),
    };
  }

  return config.defaultControl;
}

function safeWitnessBeatStory(config: Category2DConfig): string {
  const candidate = config.defaultWitnessStory;
  if (findTechnicalJargonInStory(candidate).length === 0) {
    return candidate;
  }
  return 'A security monitor records the completed change and compares it against the untouched baseline, alerting defenders to the mismatch.';
}

function buildBriefingSection(
  scenario: AttackScenario,
  config: Category2DConfig
): Section2DSpecInput {
  const firstStage = scenario.stages[0] ?? null;
  const lastStage = scenario.stages[scenario.stages.length - 1] ?? firstStage;
  const firstEvents = pickStageTelemetry(scenario, 0);
  const lastEvents = pickStageTelemetry(
    scenario,
    Math.max(0, scenario.stages.length - 1)
  );
  const ev0 = firstEvents[0];
  const evLast = lastEvents[0] ?? ev0;
  const { sourceNode, targetNode, sensorNode } = pickPrimaryNodes(
    scenario,
    firstStage,
    firstEvents
  );
  const finalCompId =
    lastStage?.compromisedNodeIds[lastStage.compromisedNodeIds.length - 1];
  const finalTarget = findNode(scenario, finalCompId) ?? targetNode;

  const primarySpec = scenario.specs[0];
  const secondSpec = scenario.specs[1] ?? firstStage?.keySpecs[0];
  const thirdSpec = scenario.specs[2] ?? lastStage?.keySpecs[0];

  const instrName = clipStr(
    ev0?.shortAction ?? firstStage?.mitreTechniqueName ?? scenario.code,
    34
  );
  const instrDetail = clipStr(
    ev0?.protocolOrEventId
      ? `${ev0.protocolOrEventId} · ${ev0.sizeOrCode || scenario.code}`
      : primarySpec
      ? `${primarySpec.term}: ${primarySpec.value}`
      : scenario.shortSubtitle,
    46
  );

  const witnessName = clipStr(
    evLast?.detectionRule?.title ??
      sensorNode?.label ??
      `${evLast?.sourceType ?? 'SIEM'} ${evLast?.protocolOrEventId ?? scenario.code}`,
    38
  );
  const witnessDetail = clipStr(
    evLast
      ? `${evLast.protocolOrEventId} · ${evLast.shortAction}`
      : `${scenario.code} multi-stage telemetry correlation`,
    52
  );

  const topology = chooseTopologyForSection(
    'briefing',
    config.defaultMechanic,
    config,
    0
  );

  return {
    sectionKey: 'briefing',
    boardTopology: topology,
    zoneHeaders: zoneHeadersForTopology(topology, config, firstStage),
    agent: {
      name: clipStr(sourceNode.label, 34),
      detail: clipStr(sourceNode.sublabel || sourceNode.details.osOrType, 42),
      meta: clipStr(
        sourceNode.details.pidOrPort || sourceNode.details.privilege || scenario.code,
        36
      ),
      module: sourceNode.details.osOrType || 'Initial Attack Origin',
      signature: clipStr(ev0?.info ?? scenario.shortSubtitle, 96),
      explain: cleanText(
        `${sourceNode.details.description} This origin initiates the ${scenario.stages.length}-stage chain documented for ${scenario.code}.`,
        `${sourceNode.label} initiates the attack chain against the target environment.`
      ),
    },
    instrument: {
      name: instrName,
      detail: instrDetail,
      meta: clipStr(
        `${scenario.stages.length} stages · ${firstStage?.mitreTechniqueId ?? scenario.code}`,
        38
      ),
      module: `${ev0?.sourceType ?? config.category} · ${scenario.code}`,
      signature: clipStr(
        ev0?.rawLog ??
          `${firstStage?.title ?? 'Stage 1'} -> ${lastStage?.title ?? 'Final Impact'}`,
        110
      ),
      explain: cleanText(
        `${firstStage?.description ?? scenario.overview} Across ${scenario.stages.length} stages, the attacker chains this mechanism to reach ${finalTarget.label}.`,
        scenario.overview
      ),
    },
    patient: {
      name: clipStr(finalTarget.label, 36),
      detail: clipStr(finalTarget.sublabel || finalTarget.details.osOrType, 44),
      meta: clipStr(
        finalTarget.details.privilege || finalTarget.details.pidOrPort || scenario.severity,
        34
      ),
      module: finalTarget.details.osOrType || 'Compromised Target',
      signature: clipStr(
        finalTarget.details.artifacts.slice(0, 2).join(' · ') ||
          lastStage?.subtitle ||
          scenario.shortSubtitle,
        96
      ),
      explain: cleanText(
        `${finalTarget.details.description} By the final stage (${lastStage?.title ?? 'Impact'}), this asset transitions from normal operation into attacker-controlled impact.`,
        `${finalTarget.label} is the primary target impacted by the end of the intrusion chain.`
      ),
    },
    beforeState: clipStr(
      primarySpec
        ? `Normal baseline (${primarySpec.term})`
        : `Normal ${finalTarget.details.osOrType || 'service'} state`,
      44
    ),
    afterState: clipStr(
      lastStage?.subtitle || lastStage?.title || 'Compromised execution / privilege',
      44
    ),
    control: makeControlForStep(
      scenario,
      firstStage,
      finalTarget,
      config,
      'briefing'
    ),
    witness: {
      name: witnessName,
      detail: witnessDetail,
      meta: clipStr(
        evLast?.detectionRule?.type
          ? `${evLast.detectionRule.type} · ${scenario.code}`
          : scenario.code,
        36
      ),
      module: sensorNode?.label || `${evLast?.sourceType ?? 'SIEM'} Detection`,
      signature: clipStr(evLast?.detectionRule?.ruleCode?.split('\n')[0] ?? witnessDetail, 96),
      explain: cleanText(
        `${evLast?.explanation ?? ''} Mitigation: ${evLast?.detectionRule?.mitigation ?? 'Correlate identity, network, and host telemetry across each stage to disrupt the chain early.'}`,
        'Defenders detect this intrusion by correlating the earliest anomalous stage event with downstream privilege or execution telemetry.'
      ),
    },
    cutawayRows: [
      clipStr(
        primarySpec
          ? `${primarySpec.term}: ${primarySpec.value}`
          : `Stage 1: ${firstStage?.title ?? 'Initial Access'}`,
        64
      ),
      clipStr(
        secondSpec
          ? `${secondSpec.term}: ${secondSpec.value}`
          : `Telemetry: ${ev0?.protocolOrEventId ?? scenario.code} (${ev0?.shortAction ?? 'Observed'})`,
        64
      ),
      clipStr(
        thirdSpec
          ? `${thirdSpec.term}: ${thirdSpec.value}`
          : `Final Stage: ${lastStage?.title ?? 'Impact'}`,
        64
      ),
    ],
    edges: {
      e1: clipStr(ev0?.protocolOrEventId ?? firstStage?.mitreTechniqueId ?? 'Trigger', 18),
      e2: clipStr(lastStage?.mitreTechniqueId ?? 'Chain Impact', 18),
      e3: clipStr(evLast?.detectionRule?.type ?? 'Telemetry Alert', 18),
      e4: 'Correlates',
    },
    sticky: {
      heading: clipStr(`Kill Chain · ${scenario.code}`, 24),
      lines: clipStr(
        `${scenario.stages.length} stages:\n${clipStr(firstStage?.title ?? 'Entry', 20)}\n-> ${clipStr(lastStage?.title ?? 'Impact', 18)}`,
        96
      ),
      goal: clipStr(lastStage?.subtitle ?? scenario.shortSubtitle, 72),
      next: clipStr(
        evLast?.detectionRule?.mitigation ??
          `Hunt ${ev0?.protocolOrEventId ?? scenario.code} across logs`,
        78
      ),
      explain: cleanText(
        `This overview board maps the entire ${scenario.name} intrusion chain from initial entry (${firstStage?.title ?? 'Step 1'}) to final impact (${lastStage?.title ?? 'Final Step'}). Hover any box to inspect its technical fields and plain-language meaning.`,
        `This overview maps the end-to-end attack flow and defender detection points for ${scenario.name}.`
      ),
    },
  };
}

function buildStepSection(
  scenario: AttackScenario,
  stage: AttackStage,
  stepNum: number,
  config: Category2DConfig
): Section2DSpecInput {
  const sectionKey = `step-${stepNum}` as Section3DKey;
  const events = pickStageTelemetry(scenario, stage.index);
  const ev0 = events[0];
  const ev1 = events[1] ?? ev0;
  const { sourceNode, targetNode, sensorNode } = pickPrimaryNodes(
    scenario,
    stage,
    events
  );
  const proc = pickStageProcess(scenario, stage.index);
  const spec0 = stage.keySpecs[0];
  const spec1 = stage.keySpecs[1] ?? scenario.specs[0];
  const spec2 = stage.keySpecs[2] ?? scenario.specs[1];

  const mechanic = chooseMechanicForStep(
    scenario,
    stage,
    sectionKey,
    config,
    stepNum - 1
  );
  const topology = chooseTopologyForSection(
    sectionKey,
    mechanic,
    config,
    stepNum - 1
  );

  const agentName = clipStr(
    ev0?.sourceLabel || proc?.name || sourceNode.label,
    34
  );
  const agentDetail = clipStr(
    sourceNode.sublabel ||
      (proc ? `PID ${proc.pid} · ${proc.user} (${proc.integrity})` : sourceNode.details.osOrType),
    44
  );
  const agentMeta = clipStr(
    sourceNode.details.pidOrPort ||
      (proc ? `PPID ${proc.ppid} · ${proc.integrity}` : stage.mitreTechniqueId),
    36
  );

  const instrName = clipStr(
    ev0?.shortAction ||
      proc?.apiCalls?.[0] ||
      spec0?.term ||
      stage.mitreTechniqueName,
    34
  );
  const instrDetail = clipStr(
    spec0
      ? `${spec0.term}: ${spec0.value}`
      : ev0?.info || stage.subtitle,
    46
  );
  const instrMeta = clipStr(
    ev0?.protocolOrEventId
      ? `${ev0.protocolOrEventId} · ${ev0.sizeOrCode || stage.mitreTechniqueId}`
      : stage.mitreTechniqueId,
    38
  );

  const patientName = clipStr(
    ev0?.targetLabel || targetNode.label,
    36
  );
  const patientDetail = clipStr(
    targetNode.sublabel || targetNode.details.osOrType,
    46
  );

  const beforeState = clipStr(
    spec1
      ? `Baseline: ${spec1.term}`
      : `Nominal ${targetNode.details.privilege || targetNode.details.osOrType || 'state'}`,
    44
  );
  const afterState = clipStr(
    spec0?.value || ev0?.sizeOrCode || stage.subtitle || stage.title,
    44
  );

  const witnessName = clipStr(
    ev1?.detectionRule?.title ||
      `${ev1?.protocolOrEventId ?? stage.mitreTechniqueId} (${ev1?.sourceType ?? 'SIEM'})`,
    38
  );
  const witnessDetail = clipStr(
    ev1
      ? `${ev1.protocolOrEventId} · ${ev1.shortAction}`
      : `${stage.mitreTechniqueId} · ${stage.mitreTechniqueName}`,
    52
  );
  const witnessMeta = clipStr(
    ev1?.detectionRule?.type
      ? `${ev1.detectionRule.type} · ${stage.mitreTechniqueId} (${ev1.severity})`
      : `${stage.mitreTechniqueId} · ${scenario.severity}`,
    42
  );

  const cutaway1 = clipStr(
    proc?.commandLine
      ? `CMD: ${proc.commandLine}`
      : ev0?.info
      ? `WIRE/EVENT: ${ev0.info}`
      : `${stage.mitreTechniqueId}: ${stage.subtitle}`,
    64
  );
  const cutaway2 = clipStr(
    spec0
      ? `${spec0.term} = ${spec0.value}`
      : proc?.apiCalls?.length
      ? `API: ${proc.apiCalls.slice(0, 2).join(', ')}`
      : `TARGET: ${targetNode.details.artifacts[0] ?? targetNode.label}`,
    64
  );
  const cutaway3 = clipStr(
    spec1
      ? `${spec1.term} = ${spec1.value}`
      : spec2
      ? `${spec2.term} = ${spec2.value}`
      : `LOG: ${ev1?.protocolOrEventId ?? stage.mitreTechniqueId} (${ev1?.severity ?? 'HIGH'})`,
    64
  );

  const control = makeControlForStep(
    scenario,
    stage,
    targetNode,
    config,
    sectionKey
  );

  return {
    sectionKey,
    boardTopology: topology,
    clipMechanic: mechanic,
    svgPrefix: makeUniqueSvgPrefix(scenario.id, sectionKey),
    zoneHeaders: zoneHeadersForTopology(topology, config, stage),
    agent: {
      name: agentName,
      detail: agentDetail,
      meta: agentMeta,
      module: sourceNode.details.osOrType || 'Originating Host / Process',
      signature: clipStr(
        proc?.commandLine || ev0?.info || `${agentName} -> ${instrName}`,
        110
      ),
      explain: summarizeExplain(
        `${sourceNode.details.description} In Step #${stepNum}, ${agentName} initiates ${instrName} against ${patientName}.`,
        `${agentName} drives Step #${stepNum} by dispatching ${instrName} toward ${patientName}.`,
        240
      ),
    },
    instrument: {
      name: instrName,
      detail: instrDetail,
      meta: instrMeta,
      module: `${ev0?.sourceType ?? config.category} · ${stage.mitreTechniqueId}`,
      signature: clipStr(
        ev0?.rawLog ||
          proc?.commandLine ||
          `${instrName} (${spec0 ? `${spec0.term}=${spec0.value}` : stage.subtitle})`,
        115
      ),
      explain: summarizeExplain(
        ev0?.explanation || stage.description,
        `This mechanism (${instrName}) executes ${stage.mitreTechniqueName} (${stage.mitreTechniqueId}) to shift ${patientName} into the attacker-desired state.`,
        260
      ),
    },
    patient: {
      name: patientName,
      detail: patientDetail,
      meta: clipStr(
        targetNode.details.privilege || targetNode.details.pidOrPort || stage.mitreTechniqueId,
        38
      ),
      module: targetNode.details.osOrType || 'Target System Component',
      signature: clipStr(
        targetNode.details.artifacts.slice(0, 2).join(' · ') || afterState,
        100
      ),
      explain: summarizeExplain(
        `${targetNode.details.description} During Step #${stepNum}, ${patientName} transitions from "${beforeState}" to "${afterState}".`,
        `${patientName} absorbs the technical mutation during Step #${stepNum}, moving from ${beforeState} to ${afterState}.`,
        240
      ),
    },
    beforeState,
    afterState,
    control,
    witness: {
      name: witnessName,
      detail: witnessDetail,
      meta: witnessMeta,
      module: sensorNode?.label || `${ev1?.sourceType ?? 'SIEM'} · ${ev1?.detectionRule?.type ?? 'DETECTION'}`,
      signature: clipStr(
        ev1?.detectionRule?.ruleCode?.split('\n').slice(0, 2).join(' | ') ||
          ev1?.rawLog ||
          witnessDetail,
        110
      ),
      explain: cleanText(
        `${ev1?.explanation ?? `Telemetry records ${witnessDetail}.`} Mitigation: ${ev1?.detectionRule?.mitigation ?? 'Alert on this event and isolate the affected host or identity immediately.'}`,
        `Defenders detect Step #${stepNum} via ${witnessName}, which exposes ${instrName} targeting ${patientName}.`
      ),
    },
    cutawayRows: [cutaway1, cutaway2, cutaway3],
    edges: {
      e1: clipStr(ev0?.protocolOrEventId || stage.mitreTechniqueId, 18),
      e2: clipStr(spec0?.term || 'Mutates State', 18),
      e3: clipStr(ev1?.detectionRule?.type ? `${ev1.detectionRule.type} Alert` : 'Audit Witness', 18),
      e4: 'Verifies',
    },
    sticky: {
      heading: clipStr(`Step #${stepNum} Key`, 24),
      lines: clipStr(
        `${clipStr(instrName, 20)}\n-> ${clipStr(afterState, 18)}\nWatch: ${clipStr(ev1?.protocolOrEventId ?? stage.mitreTechniqueId, 14)}`,
        96
      ),
      goal: clipStr(stage.subtitle || stage.title, 76),
      next: clipStr(
        ev1?.detectionRule?.mitigation || `Pivot on ${witnessName}`,
        78
      ),
      explain: cleanText(
        `In Step #${stepNum} (${stage.title}), the attacker uses ${instrName} against ${patientName} while ${control.name} stays untouched. Defenders catch the transition through ${witnessName}.`,
        `Step #${stepNum} demonstrates how ${instrName} alters ${patientName} and why ${witnessName} catches it.`
      ),
    },
    witnessBeatStory: safeWitnessBeatStory(config),
  };
}

function buildMemoryForensicsSection(
  scenario: AttackScenario,
  config: Category2DConfig
): Section2DSpecInput {
  const sectionKey: Section3DKey = 'memory-forensics';
  const blocks = collectMemoryBlocks(scenario);
  const anomalous =
    blocks.find((b) => b.block.status !== 'clean') ?? blocks[0];
  const clean = blocks.find((b) => b.block.status === 'clean') ?? blocks[1];
  const memEvent =
    scenario.telemetry.find((t) => t.sourceType === 'MEMORY_SCAN') ??
    scenario.telemetry[scenario.telemetry.length - 1];
  const targetNode =
    scenario.nodes.find((n) => n.role === 'memory' || n.role === 'process') ??
    scenario.nodes.find((n) => n.role === 'server' || n.role === 'victim_host') ??
    scenario.nodes[0];

  const procName = anomalous?.proc.name ?? targetNode.label;
  const procPid = anomalous?.proc.pid ? `PID ${anomalous.proc.pid}` : targetNode.sublabel;
  const regionAddr = anomalous?.block.address ?? '0x00400000';
  const regionName = anomalous?.block.section ?? 'Live Runtime Heap / Code';
  const regionPerm = anomalous?.block.permissions ?? 'RWX';
  const regionSize = anomalous?.block.size ?? '64 KB';
  const regionHex = anomalous?.block.hexPreview ?? 'Unbacked runtime payload bytes';

  const control = makeControlForStep(
    scenario,
    null,
    targetNode,
    config,
    sectionKey
  );

  return {
    sectionKey,
    boardTopology: 'memory-vad-compare',
    clipMechanic: 'memory-diff-scanner',
    svgPrefix: makeUniqueSvgPrefix(scenario.id, sectionKey),
    zoneHeaders: [
      'EXPECTED / CLEAN ON-DISK BASELINE',
      'LIVE PROCESS MEMORY / OBSERVED ANOMALY',
    ],
    agent: {
      name: clipStr(`${procName} (${procPid})`, 34),
      detail: clipStr(
        `${regionName} · ${regionAddr} (${regionPerm}, ${regionSize})`,
        46
      ),
      meta: clipStr(anomalous?.block.status?.toUpperCase() ?? 'MODIFIED', 28),
      module: 'Live Virtual Address Space (VAD)',
      signature: clipStr(`${regionAddr} | ${regionPerm} | ${regionHex}`, 105),
      explain: cleanText(
        anomalous?.block.description ??
          `Live memory inspection inside ${procName} reveals modified or injected runtime contents at ${regionAddr} that diverge from the clean on-disk baseline.`,
        `Live memory inside ${procName} contains anomalous runtime data at ${regionAddr}.`
      ),
    },
    instrument: {
      name: clipStr(`Live Memory Diff (${regionPerm})`, 34),
      detail: clipStr(`${regionAddr} · ${regionSize} · ${regionName}`, 46),
      meta: clipStr(regionHex, 36),
      module: 'VAD / Memory Scanner Inspection',
      signature: clipStr(`Compare(DiskImage, LiveVAD[${regionAddr}]) -> MISMATCH`, 105),
      explain: cleanText(
        `Scanning virtual memory descriptors and comparing live bytes (${regionHex}) against clean on-disk binaries exposes runtime tampering even when disk files remain clean.`,
        'Comparing live memory pages against the clean disk image exposes runtime tampering immediately.'
      ),
    },
    patient: {
      name: clipStr(`${procName} · ${regionName}`, 36),
      detail: clipStr(
        clean
          ? `Baseline ${clean.block.section} (${clean.block.permissions})`
          : `Expected file-backed R-X / R-- image`,
        46
      ),
      meta: clipStr(regionAddr, 32),
      module: `${procName} Memory Map`,
      signature: clipStr(`${regionAddr} (${regionSize}) -> ${regionPerm}`, 96),
      explain: cleanText(
        anomalous?.block.description ??
          `The region at ${regionAddr} shifts from its expected clean baseline into ${regionPerm} (${anomalous?.block.status ?? 'anomalous'}) inside ${procName}.`,
        `This memory section diverges from the expected clean baseline in permissions and live byte signatures.`
      ),
    },
    beforeState: clipStr(
      clean
        ? `${clean.block.section} · ${clean.block.permissions} (${clean.block.size})`
        : `File-backed clean R-X / R-- image`,
      44
    ),
    afterState: clipStr(
      `${regionName} · ${regionPerm} (${anomalous?.block.status ?? 'tampered'})`,
      44
    ),
    control,
    witness: {
      name: clipStr(
        memEvent?.detectionRule?.title ?? `Memory Scan · ${scenario.code}`,
        38
      ),
      detail: clipStr(
        `${regionAddr} (${regionPerm}) · ${clipStr(regionHex, 28)}`,
        52
      ),
      meta: clipStr(`${scenario.code} · VAD / PE-Sieve Diff`, 38),
      module: memEvent?.sourceType ?? 'MEMORY_SCAN',
      signature: clipStr(
        memEvent?.detectionRule?.ruleCode?.split('\n')[0] ??
          `VAD(${regionAddr}).Protect == ${regionPerm}`,
        105
      ),
      explain: cleanText(
        `Memory forensics tools flag ${procName} at ${regionAddr} because its live ${regionPerm} region (${regionName}) contradicts the untouched disk baseline. ${memEvent?.detectionRule?.mitigation ?? ''}`,
        `Memory forensics catches the live mismatch at ${regionAddr} inside ${procName}.`
      ),
    },
    cutawayRows: [
      clipStr(`BASELINE: ${clean ? `${clean.block.address} ${clean.block.section} (${clean.block.permissions})` : 'Signed file-backed on-disk image'}`, 64),
      clipStr(`LIVE VAD: ${regionAddr} ${regionName} (${regionPerm}, ${regionSize})`, 64),
      clipStr(`HEX/SIG: ${regionHex}`, 64),
    ],
    edges: {
      e1: 'Disk vs Live ≠',
      e2: 'Control Intact ✓',
      e3: 'Memory Alert',
    },
    sticky: {
      heading: 'Why memory diff wins',
      lines: clipStr(
        `Disk looks clean.\nLive RAM @ ${clipStr(regionAddr, 12)}\nshows ${regionPerm} mismatch.`,
        94
      ),
      goal: `Expose runtime tampering inside ${procName}`,
      next: `Dump ${regionAddr} (${regionSize}) and extract IOCs`,
      explain: cleanText(
        `Even when attackers avoid writing malware to disk, comparing live virtual memory (${regionAddr}, ${regionPerm}) against the clean on-disk baseline reveals the hidden payload immediately.`,
        'Comparing live memory regions against the clean on-disk baseline exposes runtime tampering directly.'
      ),
    },
    witnessBeatStory:
      'An overhead inspection scan sweeps both memory chambers side by side and highlights the exact altered live block while confirming the neighboring baseline stays clean.',
  };
}

export function buildCategory2DProfiles(
  scenarios: AttackScenario[],
  config: Category2DConfig
): MalwareScenario2DProfile[] {
  return scenarios.map((scenario) => {
    const registered3DKeys = new Set(
      listScenario3DSections(scenario.id).map((d) => d.sectionKey)
    );
    const sections: Section2DSpecInput[] = [];

    if (registered3DKeys.has('briefing')) {
      sections.push(buildBriefingSection(scenario, config));
    }

    scenario.stages.forEach((stage, idx) => {
      const key = `step-${idx + 1}` as Section3DKey;
      if (registered3DKeys.has(key)) {
        sections.push(buildStepSection(scenario, stage, idx + 1, config));
      }
    });

    if (registered3DKeys.has('memory-forensics')) {
      sections.push(buildMemoryForensicsSection(scenario, config));
    }

    return {
      scenarioId: scenario.id,
      sections,
    };
  });
}
