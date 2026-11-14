import {
  AttackCategory,
  AttackScenario,
  AttackStage,
  DiagramNode,
  NodeRole,
  ProcessTreeNode,
  TelemetryEvent,
  TelemetrySourceType,
} from './types';

/**
 * Draft/legacy scenario shape used by incomplete Batch 6–9 files.
 * Normalizes into the canonical AttackScenario schema without inventing
 * attack facts — only remaps fields that already exist in the draft.
 */
export interface LegacyDraftNode {
  id: string;
  label: string;
  type?: string;
  status?: string;
}

export interface LegacyDraftLog {
  id: string;
  timestamp?: string;
  source?: string;
  severity?: string;
  EventCode?: number | string;
  CommandLine?: string;
  ProcessName?: string;
  raw?: string;
  parsedFields?: Record<string, string>;
}

export interface LegacyDraftPacket {
  id: string;
  timestamp?: string;
  protocol?: string;
  sourceIp?: string;
  destIp?: string;
  port?: number;
  flag?: string;
  payloadSize?: number;
  hexDump?: string;
  decodedString?: string;
}

export interface LegacyDraftStage {
  id: number;
  title: string;
  narration: string;
  activeNodes?: string[];
  mitreTactic?: string;
  technicalCommands?: string[];
  defenseMitigation?: string;
  logs?: LegacyDraftLog[];
  packets?: LegacyDraftPacket[];
}

export interface LegacyDraftScenario {
  id: string;
  title: string;
  category: Exclude<AttackCategory, 'ALL'>;
  mitreId?: string;
  description: string;
  NodesGenerator?: () => LegacyDraftNode[];
  stages: LegacyDraftStage[];
}

function mapNodeRole(type: string | undefined): NodeRole {
  switch ((type || '').toLowerCase()) {
    case 'attacker':
      return 'attacker';
    case 'firewall':
    case 'siem':
    case 'waf':
      return 'firewall_siem';
    case 'server':
    case 'target':
      return 'server';
    case 'ad':
    case 'dc':
      return 'domain_controller';
    case 'dns':
      return 'dns_resolver';
    case 'process':
      return 'process';
    case 'memory':
      return 'memory';
    case 'workstation':
    case 'endpoint':
    case 'host':
      return 'victim_host';
    default:
      return 'victim_host';
  }
}

function extractTechniqueId(
  mitreId: string | undefined,
  mitreTactic: string | undefined
): string {
  const fromTactic = (mitreTactic || '').match(/T\d{4}(?:\.\d{3})?/);
  if (fromTactic) return fromTactic[0];
  if (mitreId && /^T\d{4}/.test(mitreId)) return mitreId;
  return mitreId || 'T1001';
}

function extractTechniqueName(mitreTactic: string | undefined, fallback: string): string {
  if (!mitreTactic) return fallback;
  const dash = mitreTactic.split(' - ').slice(1).join(' - ').trim();
  if (dash) return dash.replace(/\)$/, '').trim();
  const paren = mitreTactic.match(/\(([^)]+)\)/);
  return paren?.[1] || mitreTactic;
}

function mapSeverity(
  value: string | undefined
): TelemetryEvent['severity'] {
  const v = (value || '').toLowerCase();
  if (v === 'critical') return 'CRITICAL';
  if (v === 'high') return 'HIGH';
  if (v === 'medium') return 'MEDIUM';
  if (v === 'low') return 'LOW';
  if (v === 'info') return 'INFO';
  return 'HIGH';
}

function mapSourceType(source: string | undefined): TelemetrySourceType {
  const s = (source || '').toLowerCase();
  if (s.includes('sysmon')) return 'SYSMON';
  if (s.includes('linux') || s.includes('audit')) return 'LINUX_AUDIT';
  if (s.includes('ids') || s.includes('suricata') || s.includes('waf')) {
    return 'IDS_ALERT';
  }
  if (s.includes('network') || s.includes('dns') || s.includes('zeek')) {
    return 'NETWORK';
  }
  if (s.includes('memory') || s.includes('edr')) return 'MEMORY_SCAN';
  if (s.includes('api') || s.includes('etw')) return 'WIN32_API';
  return 'WIN_EVENT';
}

function layoutNodes(rawNodes: LegacyDraftNode[]): DiagramNode[] {
  const count = Math.max(1, rawNodes.length);
  return rawNodes.map((node, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 16 + col * 32;
    const y = 28 + row * 28;
    const role = mapNodeRole(node.type);
    return {
      id: node.id,
      label: node.label,
      sublabel: [node.type, node.status].filter(Boolean).join(' · ') || node.id,
      role,
      x,
      y: Math.min(78, y),
      details: {
        osOrType: node.type || 'Infrastructure Node',
        privilege: node.status || undefined,
        artifacts: [],
        description: node.label,
      },
    };
  }).map((node, index, arr) => {
    // Keep stable spread even for 4–5 node drafts.
    if (arr.length <= 5 && index < arr.length) {
      const xs = [14, 42, 70, 56, 28];
      const ys = [44, 28, 44, 72, 72];
      return { ...node, x: xs[index] ?? node.x, y: ys[index] ?? node.y };
    }
    return node;
  });
}

function processNameFromCommand(command: string): string {
  const token = command.split(/\s+/)[0] || 'process';
  return token.split(/[\\/]/).pop() || token;
}

function buildProcessTree(
  stages: LegacyDraftStage[]
): ProcessTreeNode[] {
  const trees: ProcessTreeNode[] = [];
  let pid = 4000;
  const seen = new Set<string>();

  const pushNode = (
    stageId: number,
    command: string,
    preferredName: string | undefined,
    apiCalls: string[]
  ) => {
    const trimmed = command.trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    trees.push({
      pid: pid++,
      ppid: 4,
      name: preferredName || processNameFromCommand(trimmed),
      commandLine: trimmed,
      user: 'CORP\\attacker',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: stageId,
      apiCalls,
    });
  };

  for (const stage of stages) {
    for (const log of stage.logs || []) {
      const fields = log.parsedFields || {};
      const command =
        log.CommandLine ||
        log.ProcessName ||
        fields.Image ||
        fields.Implant ||
        fields.MaliciousDriver ||
        fields.UserModeLoader ||
        fields.ExternalScriptUrl;
      if (command) {
        pushNode(
          stage.id,
          command,
          log.ProcessName ||
            fields.Implant ||
            fields.MaliciousDriver ||
            fields.UserModeLoader,
          Object.keys(fields)
        );
      }
    }

    for (const command of stage.technicalCommands || []) {
      pushNode(stage.id, command, undefined, []);
    }
  }

  return trees;
}

function buildTelemetry(
  scenario: LegacyDraftScenario,
  stages: LegacyDraftStage[],
  nodes: DiagramNode[]
): TelemetryEvent[] {
  const events: TelemetryEvent[] = [];
  let no = 1;
  const fallbackSource = nodes[0]?.id || 'attacker';
  const fallbackTarget = nodes[nodes.length - 1]?.id || fallbackSource;

  for (const stage of stages) {
    const techniqueId = extractTechniqueId(scenario.mitreId, stage.mitreTactic);
    for (const log of stage.logs || []) {
      const sourceNodeId =
        stage.activeNodes?.[0] ||
        nodes.find((n) => n.role === 'attacker')?.id ||
        fallbackSource;
      const targetNodeId =
        stage.activeNodes?.[1] ||
        stage.activeNodes?.[0] ||
        fallbackTarget;
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      const targetNode = nodes.find((n) => n.id === targetNodeId);
      events.push({
        id: log.id,
        no: no++,
        stageIndex: stage.id,
        timestamp: log.timestamp || '00:00:00.000',
        sourceNodeId,
        targetNodeId,
        sourceLabel: sourceNode?.label || sourceNodeId,
        targetLabel: targetNode?.label || targetNodeId,
        sourceType: mapSourceType(log.source),
        protocolOrEventId:
          log.EventCode != null
            ? `EventID ${log.EventCode}`
            : log.source || 'EVENT',
        shortAction:
          log.CommandLine ||
          log.ProcessName ||
          log.parsedFields?.Implant ||
          stage.title,
        info: Object.entries(log.parsedFields || {})
          .map(([k, v]) => `${k}=${v}`)
          .join(' · ') || stage.narration,
        sizeOrCode:
          log.EventCode != null ? String(log.EventCode) : techniqueId,
        severity: mapSeverity(log.severity),
        mitreId: techniqueId,
        explanation: stage.narration,
        rawLog: log.raw || stage.narration,
        detectionRule: {
          type: 'SIGMA',
          title: stage.title,
          ruleCode: log.raw || stage.title,
          mitigation:
            stage.defenseMitigation ||
            'Follow the documented vendor/government advisory mitigations for this technique.',
        },
      });
    }

    for (const packet of stage.packets || []) {
      events.push({
        id: packet.id,
        no: no++,
        stageIndex: stage.id,
        timestamp: packet.timestamp || '00:00:00.000',
        sourceNodeId: stage.activeNodes?.[0] || fallbackSource,
        targetNodeId: stage.activeNodes?.[1] || fallbackTarget,
        sourceLabel: packet.sourceIp || 'source',
        targetLabel: packet.destIp || 'destination',
        sourceType: 'NETWORK',
        protocolOrEventId: `${packet.protocol || 'TCP'}/${packet.port ?? ''}`,
        shortAction: packet.decodedString || packet.flag || 'Network packet',
        info: packet.decodedString || packet.hexDump || stage.narration,
        sizeOrCode: String(packet.payloadSize ?? techniqueId),
        severity: 'HIGH',
        mitreId: techniqueId,
        explanation: stage.narration,
        rawLog:
          packet.hexDump ||
          packet.decodedString ||
          `${packet.protocol} ${packet.sourceIp} -> ${packet.destIp}:${packet.port}`,
        detectionRule: {
          type: 'SURICATA',
          title: stage.title,
          ruleCode: packet.decodedString || stage.title,
          mitigation:
            stage.defenseMitigation ||
            'Follow the documented vendor/government advisory mitigations for this technique.',
        },
      });
    }
  }

  return events;
}

function buildStages(
  scenario: LegacyDraftScenario,
  stages: LegacyDraftStage[]
): AttackStage[] {
  return stages.map((stage) => {
    const techniqueId = extractTechniqueId(scenario.mitreId, stage.mitreTactic);
    const techniqueName = extractTechniqueName(
      stage.mitreTactic,
      scenario.title
    );
    const phaseMatch = (stage.mitreTactic || '').match(
      /Initial Access|Execution|Persistence|Privilege Escalation|Defense Evasion|Credential Access|Discovery|Lateral Movement|Collection|Command and Control|Exfiltration|Impact/i
    );
    const phaseMap: Record<string, number> = {
      'initial access': 1,
      execution: 2,
      persistence: 3,
      'privilege escalation': 4,
      'defense evasion': 5,
      'credential access': 6,
      discovery: 7,
      'lateral movement': 8,
      collection: 9,
      'command and control': 10,
      exfiltration: 11,
      impact: 12,
    };
    const mitreTacticPhase =
      phaseMap[(phaseMatch?.[0] || '').toLowerCase()] || 1;

    const keySpecs = [
      ...(stage.technicalCommands || []).map((command, index) => ({
        term: `COMMAND ${index + 1}`,
        value: command,
      })),
      ...(stage.defenseMitigation
        ? [{ term: 'DEFENSE / MITIGATION', value: stage.defenseMitigation }]
        : []),
      ...(stage.mitreTactic
        ? [{ term: 'MITRE CONTEXT', value: stage.mitreTactic }]
        : []),
    ];

    return {
      index: stage.id,
      title: stage.title,
      subtitle: stage.mitreTactic || techniqueId,
      description: stage.narration,
      mitreTacticPhase,
      mitreTechniqueId: techniqueId,
      mitreTechniqueName: techniqueName,
      activeNodeIds: stage.activeNodes || [],
      compromisedNodeIds: stage.activeNodes || [],
      keySpecs:
        keySpecs.length > 0
          ? keySpecs
          : [{ term: 'TECHNIQUE', value: techniqueId }],
    };
  });
}

export function normalizeLegacyDraftScenario(
  draft: LegacyDraftScenario
): AttackScenario {
  const rawNodes = draft.NodesGenerator ? draft.NodesGenerator() : [];
  const nodes = layoutNodes(rawNodes);
  const stages = buildStages(draft, draft.stages || []);
  const telemetry = buildTelemetry(draft, draft.stages || [], nodes);
  const processTree = buildProcessTree(draft.stages || []);
  const techniqueId = extractTechniqueId(
    draft.mitreId,
    draft.stages?.[0]?.mitreTactic
  );

  return {
    id: draft.id,
    code: techniqueId,
    name: draft.title,
    shortSubtitle: `${draft.category.replace(/_/g, ' ')} · ${techniqueId}`,
    category: draft.category,
    severity: 'CRITICAL',
    primaryMitrePhase: stages[0]?.mitreTacticPhase || 1,
    overview: draft.description,
    specs: [
      { term: 'PRIMARY MITRE', value: techniqueId },
      { term: 'CATEGORY', value: draft.category },
      {
        term: 'STAGE COUNT',
        value: String(stages.length),
      },
      ...(draft.stages?.[0]?.defenseMitigation
        ? [
            {
              term: 'DEFENSE HIGHLIGHT',
              value: draft.stages[0].defenseMitigation,
            },
          ]
        : []),
    ],
    nodes,
    processTree,
    stages,
    telemetry,
  };
}
