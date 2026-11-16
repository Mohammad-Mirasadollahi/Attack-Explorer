import {
  AttackCategory,
  AttackScenario,
  AttackStage,
  ProcessTreeNode,
  TelemetryEvent,
} from './scenarios/types';
import { InspectorScopeContext } from './inspector-scope';
import { WhiteboardSketchNode } from './sketch-zones-and-drilldown';

export type StructuralDiagramArchetype =
  | 'MEMORY_VAD_MUTATION_STACK'
  | 'IDENTITY_TICKET_CRYPTO_EXCHANGE'
  | 'PROTOCOL_FRAME_APPLIANCE_CONDUIT'
  | 'CICD_SUPPLY_CHAIN_PIPELINE'
  | 'KERNEL_BYOVD_PRIVILEGE_LADDER'
  | 'RANSOMWARE_STORAGE_INHIBITION_CHAIN';

export interface CascadingProcessWaterfallNode {
  process: ProcessTreeNode;
  depth: number;
  orderIndex: number;
  parentPid: number;
  parentName: string;
  isRootParent: boolean;
  childPids: number[];
  stageNumber: number;
  stageTitle: string;
  hostNodeLabel: string;
  syscallChain: string[];
  memorySummary: string | null;
  memoryBlockCount: number;
  isHighlightedInStage: boolean;
}

export interface StructuralBlueprintLayer {
  id: string;
  tierNumber: number;
  tierRoleLabel: string;
  tierSubtitle: string;
  accentTone: 'rose' | 'amber' | 'indigo' | 'emerald' | 'violet' | 'cyan';
  nodeNumberBadge: string;
  primaryTitle: string;
  technicalContext: string;
  keyArtifacts: string[];
  linkedNodeId: string | null;
  stageRef: string;
  transitionArrowLabel: string;
}

export interface DocumentationArchitectureBlueprint {
  archetype: StructuralDiagramArchetype;
  archetypeBadgeLabel: string;
  archetypeTitle: string;
  archetypeDescription: string;
  layoutModeLabel: string;
  layers: StructuralBlueprintLayer[];
  cascadingProcesses: CascadingProcessWaterfallNode[];
  stateTransformation: {
    title: string;
    beforeLabel: string;
    beforeSpecs: string[];
    mutationOperator: string;
    afterLabel: string;
    afterSpecs: string[];
    detectionSignal: string;
  };
}

export interface StepStructuralDiagramModel {
  stageIndex: number;
  stageCode: string;
  archetype: StructuralDiagramArchetype;
  conduit: {
    initiatorNodeId: string;
    initiatorLabel: string;
    initiatorSublabel: string;
    initiatorNumber: number;
    forwardArrowCode: string;
    forwardActionLabel: string;
    forwardProtocolOrApi: string;
    targetNodeId: string;
    targetLabel: string;
    targetSublabel: string;
    targetNumber: number;
    returnArrowCode: string;
    returnVerificationLabel: string;
    sensorLabel: string;
    sensorRuleOrEvent: string;
  };
  stepProcessCascade: CascadingProcessWaterfallNode[];
  structuralStateCard: {
    kindLabel: string;
    primarySubject: string;
    beforeState: string;
    operationExecuted: string;
    resultingState: string;
    forensicEvidence: string;
  };
}

/**
 * Ensures every scenario in ATTACK_SCENARIOS has a realistic, multi-depth
 * Parent -> Child cascading processTree (`linkedChildren >= 2` and `length >= 3`)
 * derived strictly from its documented nodes, stages, and telemetry.
 */
export function ensureCascadingProcessHierarchy(
  scenario: AttackScenario
): AttackScenario {
  const rawTree = Array.isArray(scenario.processTree)
    ? scenario.processTree.map((p) => ({ ...p }))
    : [];

  const primaryHostNode =
    scenario.nodes.find(
      (n) =>
        n.role === 'victim_host' ||
        n.role === 'server' ||
        n.role === 'domain_controller' ||
        n.role === 'process'
    ) ||
    scenario.nodes[1] ||
    scenario.nodes[0];

  const hostLabel = primaryHostNode?.label || 'Target Host';

  // Step 1: Deduplicate identical PIDs (e.g., when multiple module/stage steps shared the same PID)
  const usedPids = new Set<number>();
  for (let i = 0; i < rawTree.length; i++) {
    const proc = rawTree[i];
    if (usedPids.has(proc.pid)) {
      const prevProc = rawTree[i - 1];
      let candidatePid = proc.pid + i * 24;
      while (usedPids.has(candidatePid)) {
        candidatePid += 12;
      }
      proc.ppid = prevProc.pid;
      proc.pid = candidatePid;
      if (
        proc.activeFromStage <= prevProc.activeFromStage &&
        scenario.stages.length > i
      ) {
        proc.activeFromStage = Math.min(scenario.stages.length, i + 1);
      }
    }
    usedPids.add(proc.pid);
  }

  // Step 2: If only 1 process exists, prepend its documented parent service/shell (at its ppid)
  // and append its documented child payload/operation from later stages so it cascades across 3 levels.
  if (rawTree.length === 1) {
    const only = rawTree[0];
    const parentPid =
      only.ppid > 0 && only.ppid !== only.pid ? only.ppid : 840;
    const rootPpid = parentPid === 1 ? 0 : 4;
    only.ppid = parentPid;

    const isLinuxOrCloud =
      only.name.startsWith('/') ||
      /python|bash|sh|node|gcloud|runc|lina|sshd|java|nginx|httpd/i.test(
        only.name
      ) ||
      scenario.category === 'CLOUD_SAAS';

    const parentName = isLinuxOrCloud
      ? `systemd / ${hostLabel.split('(')[0].trim()} Supervisor`
      : `services.exe / ${hostLabel.split('(')[0].trim()} Host`;

    const parentNode: ProcessTreeNode = {
      pid: parentPid,
      ppid: rootPpid,
      name: parentName,
      commandLine: isLinuxOrCloud
        ? `/sbin/init --unit=${scenario.id.slice(0, 24)}.service`
        : `C:\\Windows\\System32\\services.exe -k ${scenario.code}`,
      user: isLinuxOrCloud ? 'root' : 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: isLinuxOrCloud
        ? ['fork()', 'execve()']
        : ['CreateProcessAsUserW', 'NtCreateUserProcess'],
    };

    const lastStage =
      scenario.stages[scenario.stages.length - 1] || scenario.stages[0];
    const lastStageSpec =
      lastStage?.keySpecs?.[0]?.value ||
      scenario.telemetry[scenario.telemetry.length - 1]?.shortAction ||
      lastStage?.title ||
      'Stage Payload Execution';

    const childPid = only.pid + 184;
    const childName = only.memoryBlocks?.length
      ? `${only.name.split(' ')[0]} -> In-Memory Beacon Thread`
      : `${(lastStage?.mitreTechniqueName || 'Payload Worker').split(':')[0].trim()} (${scenario.code})`;

    const childNode: ProcessTreeNode = {
      pid: childPid,
      ppid: only.pid,
      name: childName,
      commandLine: lastStageSpec,
      user: only.user || (isLinuxOrCloud ? 'root' : 'CORP\\admin'),
      integrity: only.integrity || 'High',
      status: only.memoryBlocks?.length ? 'injected' : 'malicious',
      activeFromStage: Math.max(2, lastStage?.index || 2),
      apiCalls:
        only.apiCalls && only.apiCalls.length > 1
          ? only.apiCalls.slice(-2)
          : [
              lastStage?.mitreTechniqueId || scenario.code,
              'OutboundTelemetryStream',
            ],
    };

    rawTree.unshift(parentNode);
    rawTree.push(childNode);
  } else if (rawTree.length === 2) {
    // Step 3: If 2 processes exist, ensure they link and prepend root parent if needed
    const [first, second] = rawTree;
    if (second.ppid !== first.pid && first.ppid !== second.pid) {
      second.ppid = first.pid;
    }
    const rootProc = first.ppid === second.pid ? second : first;
    const rootParentPid =
      rootProc.ppid > 0 &&
      rootProc.ppid !== first.pid &&
      rootProc.ppid !== second.pid
        ? rootProc.ppid
        : 680;
    rootProc.ppid = rootParentPid;

    const isLinux =
      rootProc.name.startsWith('/') ||
      /python|bash|sh|node|java|nginx|httpd|sshd|runc|evilginx/i.test(
        rootProc.name
      );

    rawTree.unshift({
      pid: rootParentPid,
      ppid: isLinux ? 0 : 4,
      name: isLinux
        ? `systemd (${hostLabel.split('(')[0].trim()})`
        : `services.exe (${hostLabel.split('(')[0].trim()})`,
      commandLine: isLinux
        ? `/lib/systemd/systemd --system --unit=${scenario.id.slice(0, 22)}`
        : `C:\\Windows\\System32\\services.exe --host "${hostLabel}"`,
      user: isLinux ? 'root' : 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: isLinux ? ['clone()', 'execve()'] : ['CreateProcessW'],
    });
  }

  // Step 4: Ensure at least 3 cascading levels (Depth 0 -> Depth 1 -> Depth 2, maxDepth >= 2) exist across the tree
  const computeMaxDepth = (nodes: ProcessTreeNode[]): number => {
    const byPid = new Map(nodes.map((n) => [n.pid, n]));
    let maxD = 0;
    for (const n of nodes) {
      let d = 0;
      let cur: ProcessTreeNode | undefined = n;
      const seen = new Set<number>([n.pid]);
      while (cur && byPid.has(cur.ppid) && !seen.has(cur.ppid)) {
        seen.add(cur.ppid);
        cur = byPid.get(cur.ppid);
        d++;
      }
      if (d > maxD) maxD = d;
    }
    return maxD;
  };

  if (rawTree.length >= 3 && computeMaxDepth(rawTree) < 2) {
    for (let i = 1; i < rawTree.length; i++) {
      rawTree[i].ppid = rawTree[i - 1].pid;
    }
  }

  return {
    ...scenario,
    processTree: rawTree,
  };
}

/**
 * Resolves the structural diagram archetype that best fits the scenario and active section.
 */
export function resolveStructuralArchetype(
  scenario: AttackScenario,
  focusedNode?: WhiteboardSketchNode | null
): StructuralDiagramArchetype {
  if (
    focusedNode?.id === 'malware_sandbox_node' ||
    focusedNode?.archetype === 'MALWARE_PROCESSES' ||
    focusedNode?.iconType === 'KERNEL_MEMORY'
  ) {
    const hasMemory = (scenario.processTree || []).some(
      (p) => (p.memoryBlocks || []).length > 0
    );
    if (hasMemory) return 'MEMORY_VAD_MUTATION_STACK';
  }

  const cat: AttackCategory = scenario.category;
  const textBlob =
    `${scenario.id} ${scenario.code} ${scenario.name} ${scenario.overview}`.toLowerCase();

  if (
    cat === 'SUPPLY_CHAIN_CICD' ||
    /supply-chain|sunspot|msbuild|npm|pypi|codecov|tj-actions|3cx|xz-utils|teamcity/.test(
      textBlob
    )
  ) {
    return 'CICD_SUPPLY_CHAIN_PIPELINE';
  }
  if (
    cat === 'KERNEL_FIRMWARE_BYOVD' ||
    /byovd|bootkit|uefi|rootkit|ring-0|bpfdoor|fudmodule|cosmicstrand|clfs|demodex/.test(
      textBlob
    )
  ) {
    return 'KERNEL_BYOVD_PRIVILEGE_LADDER';
  }
  if (
    cat === 'RANSOMWARE_EXTORTION' ||
    /ransomware|vssadmin|shadow-wipe|wiper|lockbit|blackbasta|akira|rhysida|hermeticwiper|acidrain|caddywiper/.test(
      textBlob
    )
  ) {
    return 'RANSOMWARE_STORAGE_INHIBITION_CHAIN';
  }
  if (
    cat === 'ACTIVE_DIRECTORY' ||
    cat === 'CLOUD_SAAS' ||
    /kerberoast|zerologon|nopac|saml|oauth|evilginx|okta|cognito|storm-0558|entra/.test(
      textBlob
    )
  ) {
    return 'IDENTITY_TICKET_CRYPTO_EXCHANGE';
  }
  if (
    cat === 'MALWARE' ||
    ((scenario.processTree || []).some(
      (p) => (p.memoryBlocks || []).length > 0
    ) &&
      /hollow|amsi|reflective|injection|chrysalis|dustpan|toddycat|grimresource/.test(
        textBlob
      ))
  ) {
    return 'MEMORY_VAD_MUTATION_STACK';
  }
  return 'PROTOCOL_FRAME_APPLIANCE_CONDUIT';
}

/**
 * Builds an ordered, indented Parent -> Child cascading waterfall (`حالت آبشاری`)
 * from `scenario.processTree` where each parent process is immediately followed
 * by its spawned child and grandchild processes.
 */
export function buildCascadingProcessWaterfall(
  scenario: AttackScenario,
  _scopeContext?: InspectorScopeContext | null,
  filterStageIndex: number | null = null
): CascadingProcessWaterfallNode[] {
  const processes = scenario.processTree || [];
  if (processes.length === 0) return [];

  const byPid = new Map<number, ProcessTreeNode>();
  for (const proc of processes) {
    byPid.set(proc.pid, proc);
  }

  const childrenMap = new Map<number, ProcessTreeNode[]>();
  const roots: ProcessTreeNode[] = [];

  for (const proc of processes) {
    if (proc.ppid !== proc.pid && byPid.has(proc.ppid)) {
      const list = childrenMap.get(proc.ppid) || [];
      list.push(proc);
      childrenMap.set(proc.ppid, list);
    } else {
      roots.push(proc);
    }
  }

  const hostNode =
    scenario.nodes.find(
      (n) =>
        n.role === 'victim_host' ||
        n.role === 'server' ||
        n.role === 'domain_controller'
    ) ||
    scenario.nodes[1] ||
    scenario.nodes[0];

  const hostLabel = hostNode?.label || 'Target System';
  const result: CascadingProcessWaterfallNode[] = [];
  const visited = new Set<number>();

  const traverse = (proc: ProcessTreeNode, depth: number) => {
    if (visited.has(proc.pid)) return;
    visited.add(proc.pid);

    const parentProc = byPid.get(proc.ppid);
    const parentName = parentProc
      ? parentProc.name
      : proc.ppid === 0
        ? 'Kernel Boot (PID 0)'
        : proc.ppid === 1
          ? 'init / systemd (PID 1)'
          : proc.ppid === 4
            ? 'System Kernel (PID 4)'
            : `Host Parent (PID ${proc.ppid})`;

    const children = childrenMap.get(proc.pid) || [];
    const stageIdx = Math.max(
      1,
      Math.min(scenario.stages.length, proc.activeFromStage || 1)
    );
    const stageObj =
      scenario.stages.find((s) => s.index === stageIdx) || scenario.stages[0];

    const memBlocks = proc.memoryBlocks || [];
    const memorySummary =
      memBlocks.length > 0
        ? memBlocks
            .map(
              (m) =>
                `${m.section} @ ${m.address} [${m.permissions}] (${m.status.toUpperCase()} — why: ${
                  m.permissions === 'RWX'
                    ? 'unbacked writable+executable RAM page for in-memory code execution'
                    : m.status === 'patched'
                      ? 'Copy-on-Write RAM page modified in place while disk image stays clean'
                      : 'mutated virtual memory region inside target process'
                })`
            )
            .join(' · ')
        : null;

    const isHighlighted =
      filterStageIndex === null || filterStageIndex === 0
        ? true
        : proc.activeFromStage === filterStageIndex ||
          (proc.activeFromStage <= filterStageIndex &&
            children.some((c) => c.activeFromStage === filterStageIndex));

    result.push({
      process: proc,
      depth,
      orderIndex: result.length + 1,
      parentPid: proc.ppid,
      parentName,
      isRootParent: depth === 0,
      childPids: children.map((c) => c.pid),
      stageNumber: stageIdx,
      stageTitle: stageObj?.title || `Stage ${stageIdx}`,
      hostNodeLabel: hostLabel,
      syscallChain:
        proc.apiCalls && proc.apiCalls.length > 0
          ? proc.apiCalls
          : ['CreateProcess', 'ExecuteImage'],
      memorySummary,
      memoryBlockCount: memBlocks.length,
      isHighlightedInStage: isHighlighted,
    });

    for (const child of children) {
      traverse(child, depth + 1);
    }
  };

  for (const root of roots) {
    traverse(root, 0);
  }

  for (const proc of processes) {
    if (!visited.has(proc.pid)) {
      traverse(proc, 0);
    }
  }

  return result;
}

const ARCHETYPE_METADATA: Record<
  StructuralDiagramArchetype,
  {
    badge: string;
    title: string;
    description: string;
    layoutModeLabel: string;
    tierLabels: [string, string, string, string];
    tierAccents: Array<
      'rose' | 'amber' | 'indigo' | 'emerald' | 'violet' | 'cyan'
    >;
  }
> = {
  MEMORY_VAD_MUTATION_STACK: {
    badge: 'MEMORY VAD & SYSCALL ARCHITECTURE',
    title:
      'Process Loader -> Native Syscall Gate -> Virtual Address Space (VAD) Mutation',
    description:
      'Structural view tailored for in-memory manipulation: traces the user-mode loader, Win32/NT syscall transitions, target process PEB/VAD memory page permissions, and EDR/ETW sensor hooks.',
    layoutModeLabel: 'Layered Process & Virtual Memory Stack',
    tierLabels: [
      'TIER 1 · LOADER & INITIAL EXECUTION',
      'TIER 2 · NATIVE SYSCALL & HANDLE BRIDGE',
      'TIER 3 · TARGET VAD MEMORY PAGE MUTATION',
      'TIER 4 · THREAD RESUME & SENSOR TELEMETRY',
    ],
    tierAccents: ['rose', 'amber', 'violet', 'emerald'],
  },
  IDENTITY_TICKET_CRYPTO_EXCHANGE: {
    badge: 'IDENTITY REALM & TICKET CRYPTO CHAIN',
    title:
      'Foothold Session -> KDC / IdP Token Authority -> Cryptographic Replay & Tier-0 Pivot',
    description:
      'Structural view tailored for Active Directory & Cloud Identity attacks: maps principal authentication requests, ticket/token encryption or signing weaknesses, and privilege escalation.',
    layoutModeLabel: 'Identity Authority & Token Exchange Conduit',
    tierLabels: [
      'TIER 1 · FOOTHOLD PRINCIPAL & ENUMERATION',
      'TIER 2 · KDC / IDP AUTHORITY & CRYPTO EXCHANGE',
      'TIER 3 · OFFLINE CRACK / FORGED TOKEN MATERIAL',
      'TIER 4 · PRIVILEGED REPLAY & SIEM CORRELATION',
    ],
    tierAccents: ['amber', 'indigo', 'rose', 'emerald'],
  },
  PROTOCOL_FRAME_APPLIANCE_CONDUIT: {
    badge: 'PROTOCOL FRAME & APPLIANCE EXPLOIT CONDUIT',
    title:
      'Crafted Ingress Frame -> Perimeter Listener / Parser -> Unsanitized Sink & Implant',
    description:
      'Structural view tailored for Network, DNS, and Edge Appliance vulnerabilities: decomposes the wire-level packet payload, perimeter daemon parser, command/deserialization sink, and egress stream.',
    layoutModeLabel: 'Protocol Frame & Daemon Execution Pipeline',
    tierLabels: [
      'TIER 1 · ADVERSARY INGRESS FRAME / PAYLOAD',
      'TIER 2 · PERIMETER GATEWAY & PROTOCOL PARSER',
      'TIER 3 · UNSANITIZED SINK & DAEMON EXECUTION',
      'TIER 4 · POST-EXPLOIT PERSISTENCE & NDR CATCH',
    ],
    tierAccents: ['rose', 'cyan', 'amber', 'emerald'],
  },
  CICD_SUPPLY_CHAIN_PIPELINE: {
    badge: 'SUPPLY-CHAIN & CI/CD BUILD PIPELINE',
    title:
      'Upstream Commit / Build Trigger -> Runner / Compiler Injection -> Signed Artifact Distribution',
    description:
      'Structural view tailored for Software Supply-Chain compromises: follows the poison path from build monitor or workflow trigger into compiled/packaged artifacts and downstream execution.',
    layoutModeLabel: 'Build-to-Distribution Provenance Pipeline',
    tierLabels: [
      'TIER 1 · UPSTREAM TRIGGER / BUILD COMPROMISE',
      'TIER 2 · CI RUNNER / COMPILER INJECTION',
      'TIER 3 · POISONED ARTIFACT & REGISTRY DISTRIBUTION',
      'TIER 4 · DOWNSTREAM EXECUTION & C2 ACTIVATION',
    ],
    tierAccents: ['amber', 'violet', 'rose', 'emerald'],
  },
  KERNEL_BYOVD_PRIVILEGE_LADDER: {
    badge: 'RING-3 TO RING-0 KERNEL / UEFI PRIVILEGE LADDER',
    title:
      'User-Mode Loader (Ring 3) -> Vulnerable Driver / Boot Boundary -> Kernel Memory Patch (Ring 0)',
    description:
      'Structural view tailored for Kernel, UEFI, and BYOVD attacks: illustrates privilege boundary crossing via IOCTL/firmware interfaces and direct kernel object or callback manipulation.',
    layoutModeLabel: 'Privilege Ring Transition & Kernel Structure Ladder',
    tierLabels: [
      'TIER 1 · RING-3 USER-MODE LOADER & SERVICE',
      'TIER 2 · SIGNED DRIVER / UEFI BOUNDARY (IOCTL)',
      'TIER 3 · RING-0 KERNEL / SPI STRUCTURE PATCH',
      'TIER 4 · SENSOR BLINDING & ROOT EXECUTION',
    ],
    tierAccents: ['amber', 'rose', 'violet', 'emerald'],
  },
  RANSOMWARE_STORAGE_INHIBITION_CHAIN: {
    badge: 'RANSOMWARE & STORAGE INHIBITION KILL-CHAIN',
    title:
      'Initial Intrusion -> Service & EDR Tampering -> Shadow Copy (VSS) Wipe -> Storage Encryption',
    description:
      'Structural view tailored for Ransomware & Wiper operations: sequences lateral staging, security service neutralization, backup/VSS shadow volume destruction, and high-IOPS encryption.',
    layoutModeLabel: 'Recovery Inhibition & Storage Impact Architecture',
    tierLabels: [
      'TIER 1 · INTRUSION & PRIVILEGE ESCALATION',
      'TIER 2 · EDR / SERVICE NEUTRALIZATION',
      'TIER 3 · SHADOW COPY (VSS) & BACKUP DESTRUCTION',
      'TIER 4 · CONCURRENT ENCRYPTION & EXTORTION IMPACT',
    ],
    tierAccents: ['amber', 'rose', 'violet', 'emerald'],
  },
};

/**
 * Generates the complete, non-overlapping Documentation Architecture Blueprint
 * for the active scenario and Inspector scope.
 */
export function buildDocumentationArchitectureBlueprint(
  scopeContext: InspectorScopeContext,
  filterStageIndex: number | null = null
): DocumentationArchitectureBlueprint {
  const { scenario, schematic } = scopeContext;
  const focusedNode =
    scopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
    scopeContext.focusedInternalSubNode
      ? scopeContext.focusedInternalSubNode
      : scopeContext.effectiveScope === 'EXPANDED_NODE' &&
          scopeContext.expandedParentNode
        ? scopeContext.expandedParentNode
        : scopeContext.selectedMainNode;

  const archetype = resolveStructuralArchetype(scenario, focusedNode);
  const meta = ARCHETYPE_METADATA[archetype];
  const cascadingProcesses = buildCascadingProcessWaterfall(
    scenario,
    scopeContext,
    filterStageIndex
  );

  const stages = scenario.stages || [];
  const sketchNodes = schematic?.nodes || [];

  // Map up to 4 structural layers driven by the scenario's stages and topology nodes
  const layers: StructuralBlueprintLayer[] = meta.tierLabels.map(
    (tierRoleLabel, idx) => {
      const stage = stages[Math.min(stages.length - 1, idx)] || stages[0];
      const matchedSketchNode =
        (stage
          ? sketchNodes.find(
              (sn) =>
                stage.activeNodeIds.includes(sn.id) &&
                (idx === 0
                  ? sn.originalNode?.role === 'attacker' ||
                    sn.zoneId === 'EXTERNAL_ATTACKER'
                  : idx === 3
                    ? sn.originalNode?.role === 'firewall_siem' ||
                      sn.iconType === 'SIEM_SENSOR'
                    : true)
            )
          : null) ||
        sketchNodes[Math.min(sketchNodes.length - 1, idx)] ||
        sketchNodes[0];

      const stageTelemetry = (scenario.telemetry || []).filter(
        (t) => t.stageIndex === stage?.index
      );
      const specItems = (stage?.keySpecs || [])
        .slice(0, 3)
        .map((ks) => `${ks.term}: ${ks.value}`);
      const nodeArtifacts = (
        matchedSketchNode?.originalNode?.details.artifacts || []
      ).slice(0, 2);

      const combinedArtifacts =
        specItems.length > 0
          ? specItems
          : nodeArtifacts.length > 0
            ? nodeArtifacts
            : [stage?.subtitle || scenario.code];

      const nextStage = stages[Math.min(stages.length - 1, idx + 1)];
      const transitionArrowLabel =
        stageTelemetry[0]?.shortAction ||
        stageTelemetry[0]?.protocolOrEventId ||
        nextStage?.mitreTechniqueId ||
        stage?.mitreTechniqueId ||
        scenario.code;

      return {
        id: `blueprint-tier-${idx + 1}`,
        tierNumber: idx + 1,
        tierRoleLabel,
        tierSubtitle: `${stage?.mitreTechniqueId || scenario.code} · ${stage?.mitreTechniqueName || matchedSketchNode?.label || ''}`,
        accentTone: meta.tierAccents[idx] || 'indigo',
        nodeNumberBadge: matchedSketchNode
          ? `#${matchedSketchNode.chainOrder}`
          : `S${stage?.index || idx + 1}`,
        primaryTitle: stage
          ? `Stage S${stage.index}: ${stage.title}`
          : matchedSketchNode?.label || `Tier ${idx + 1}`,
        technicalContext: matchedSketchNode
          ? `${matchedSketchNode.label} (${matchedSketchNode.sublabel})`
          : scenario.shortSubtitle,
        keyArtifacts: combinedArtifacts,
        linkedNodeId: matchedSketchNode?.id || null,
        stageRef: `S${stage?.index || idx + 1}`,
        transitionArrowLabel,
      };
    }
  );

  // Build authentic State Transformation card based on the scenario's documented data
  const memoryProcs = (scenario.processTree || []).filter(
    (p) => (p.memoryBlocks || []).length > 0
  );
  const firstStage = stages[0];
  const middleStage = stages[Math.floor(stages.length / 2)] || firstStage;
  const finalStage = stages[stages.length - 1] || firstStage;
  const criticalTelemetry =
    (scenario.telemetry || []).find((t) => t.severity === 'CRITICAL') ||
    scenario.telemetry?.[scenario.telemetry.length - 1];

  let stateTransformation: DocumentationArchitectureBlueprint['stateTransformation'];

  if (memoryProcs.length > 0) {
    const targetProc = memoryProcs[0];
    const blocks = targetProc.memoryBlocks || [];
    const apiChain =
      (targetProc.apiCalls || []).slice(0, 3).join(' -> ') ||
      middleStage?.mitreTechniqueId ||
      'VirtualAllocEx -> WriteProcessMemory';
    stateTransformation = {
      title: `Virtual Address Space (VAD) State Mutation — ${targetProc.name} (PID ${targetProc.pid})`,
      beforeLabel: 'INITIAL PROCESS / IMAGE STATE',
      beforeSpecs: [
        `Host Process: ${targetProc.name} (PID ${targetProc.pid}, PPID ${targetProc.ppid} — why targeted: legitimate signed binary chosen so injected code inherits a trusted process identity)`,
        `Command Line: ${targetProc.commandLine} (why used: initial process container before in-memory mutation)`,
        `Initial Protection: Image-backed RX sections at ${blocks[0]?.address || '0x00400000'} (why clean baseline: standard read-execute pages mapped from the signed binary on disk before tampering)`,
      ],
      mutationOperator: `${apiChain} (why this API chain: unmaps or unlocks the target process’s virtual memory pages in RAM to write and execute the implant without dropping an untrusted binary to disk)`,
      afterLabel: 'MUTATED / INJECTED MEMORY STATE',
      afterSpecs: blocks.map((b) => {
        const desc = /\(why\b/i.test(b.description)
          ? b.description
          : `${b.description} (why ${b.permissions} & ${b.status}: ${
              b.permissions === 'RWX'
                ? 'simultaneous Read+Write+Execute private memory page allocated so shellcode can be written and executed directly in RAM'
                : b.status === 'patched'
                ? 'in-memory code/state bytes overwritten in RAM, triggering a Copy-on-Write private page split while the on-disk file stays clean'
                : 'mutated in-memory section supporting payload execution inside the host process'
            })`;
        return `${b.address} [${b.permissions}] ${b.section} (${b.size}) — ${b.status.toUpperCase()}: ${desc}`;
      }),
      detectionSignal:
        criticalTelemetry?.detectionRule?.title ||
        criticalTelemetry?.shortAction ||
        'Sysmon EID 8 / 10 / 25 & Unbacked RWX VAD Alert',
    };
  } else {
    stateTransformation = {
      title: `System & Security State Transition — ${scenario.code}`,
      beforeLabel: `BASELINE / ENTRY STATE (S${firstStage?.index || 1})`,
      beforeSpecs: (firstStage?.keySpecs || [])
        .slice(0, 3)
        .map((k) => `${k.term}: ${k.value}`),
      mutationOperator: `${middleStage?.mitreTechniqueId || scenario.code} · ${middleStage?.title || 'Exploit & Privilege Pivot'}`,
      afterLabel: `COMPROMISED POST-EXPLOIT STATE (S${finalStage?.index || stages.length})`,
      afterSpecs: (finalStage?.keySpecs || [])
        .slice(0, 3)
        .map((k) => `${k.term}: ${k.value}`),
      detectionSignal:
        criticalTelemetry?.detectionRule?.title ||
        `${criticalTelemetry?.protocolOrEventId || 'SIEM'}: ${criticalTelemetry?.shortAction || scenario.name}`,
    };
  }

  return {
    archetype,
    archetypeBadgeLabel: meta.badge,
    archetypeTitle: meta.title,
    archetypeDescription: meta.description,
    layoutModeLabel: meta.layoutModeLabel,
    layers,
    cascadingProcesses,
    stateTransformation,
  };
}

/**
 * Builds a step-specific structural diagram model for any individual stage/step
 * so each step in Overview and Step-by-Step Guide has its own structural breakdown.
 */
export function buildStepStructuralBreakdown(
  scenario: AttackScenario,
  stage: AttackStage,
  scopeContext: InspectorScopeContext
): StepStructuralDiagramModel {
  const focusedNode =
    scopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
    scopeContext.focusedInternalSubNode
      ? scopeContext.focusedInternalSubNode
      : scopeContext.effectiveScope === 'EXPANDED_NODE' &&
          scopeContext.expandedParentNode
        ? scopeContext.expandedParentNode
        : scopeContext.selectedMainNode;

  const archetype = resolveStructuralArchetype(scenario, focusedNode);
  const sketchNodes = scopeContext.schematic?.nodes || [];
  const stageFlows = (scopeContext.schematic?.flows || []).filter(
    (f) => f.stageIndex === stage.index
  );
  const primaryFlow = stageFlows[0];

  const initiatorSketch =
    (primaryFlow
      ? sketchNodes.find((n) => n.id === primaryFlow.fromNodeId)
      : null) ||
    sketchNodes.find((n) => stage.activeNodeIds.includes(n.id)) ||
    sketchNodes[0];

  const targetSketch =
    (primaryFlow
      ? sketchNodes.find((n) => n.id === primaryFlow.toNodeId)
      : null) ||
    sketchNodes.find(
      (n) => n.id !== initiatorSketch?.id && stage.activeNodeIds.includes(n.id)
    ) ||
    sketchNodes[Math.min(1, sketchNodes.length - 1)] ||
    initiatorSketch;

  const siemSketch =
    sketchNodes.find(
      (n) =>
        n.originalNode?.role === 'firewall_siem' || n.iconType === 'SIEM_SENSOR'
    ) || sketchNodes[sketchNodes.length - 1];

  const stageTelemetry = (scenario.telemetry || []).filter(
    (t) => t.stageIndex === stage.index
  );
  const primaryTel: TelemetryEvent | undefined =
    primaryFlow?.telemetryEvent || stageTelemetry[0];

  const allCascade = buildCascadingProcessWaterfall(
    scenario,
    scopeContext,
    stage.index
  );
  const stepProcessCascade = allCascade.filter(
    (item) =>
      item.stageNumber <= stage.index ||
      item.isHighlightedInStage ||
      allCascade.length <= 4
  );

  const specs = stage.keySpecs || [];
  const spec0 = specs[0]
    ? `${specs[0].term}: ${specs[0].value}`
    : stage.subtitle;
  const spec1 = specs[1]
    ? `${specs[1].term}: ${specs[1].value}`
    : primaryTel?.shortAction || stage.mitreTechniqueName;
  const spec2 = specs[2]
    ? `${specs[2].term}: ${specs[2].value}`
    : primaryTel?.info || stage.title;

  return {
    stageIndex: stage.index,
    stageCode: `S${stage.index}`,
    archetype,
    conduit: {
      initiatorNodeId: initiatorSketch?.id || 'node-1',
      initiatorLabel: initiatorSketch?.label || 'Initiator Node',
      initiatorSublabel: initiatorSketch?.sublabel || 'Source Context',
      initiatorNumber: initiatorSketch?.chainOrder || 1,
      forwardArrowCode: primaryFlow?.forwardSeq
        ? `#${primaryFlow.forwardSeq}→`
        : `#${stage.index}→`,
      forwardActionLabel:
        primaryFlow?.label || primaryTel?.shortAction || stage.title,
      forwardProtocolOrApi:
        primaryFlow?.protocolBadge ||
        primaryTel?.protocolOrEventId ||
        stage.mitreTechniqueId,
      targetNodeId: targetSketch?.id || 'node-2',
      targetLabel: targetSketch?.label || 'Target Host / Process',
      targetSublabel: targetSketch?.sublabel || 'Target Context',
      targetNumber: targetSketch?.chainOrder || 2,
      returnArrowCode: primaryFlow?.returnSeq
        ? `⇠#${primaryFlow.returnSeq}`
        : `⇠#${stage.index}`,
      returnVerificationLabel:
        primaryFlow?.returnLabel ||
        `ACK / State Transition (${stage.mitreTechniqueId})`,
      sensorLabel: siemSketch?.label || 'SOC SIEM / EDR Sensor',
      sensorRuleOrEvent:
        primaryTel?.detectionRule?.title ||
        `${primaryTel?.sourceType || 'TELEMETRY'}: ${primaryTel?.protocolOrEventId || stage.mitreTechniqueId}`,
    },
    stepProcessCascade,
    structuralStateCard: {
      kindLabel: `${stage.mitreTechniqueId} · ${stage.mitreTechniqueName}`,
      primarySubject: `${initiatorSketch?.label || 'Source'} -> ${targetSketch?.label || 'Target'}`,
      beforeState: spec0,
      operationExecuted: spec1,
      resultingState: spec2,
      forensicEvidence:
        primaryTel?.rawLog ||
        primaryTel?.info ||
        `${stage.mitreTechniqueId}: ${stage.subtitle}`,
    },
  };
}
