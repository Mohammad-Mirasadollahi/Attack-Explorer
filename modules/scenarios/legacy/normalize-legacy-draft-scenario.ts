import {
  AttackCategory,
  AttackScenario,
  AttackStage,
  DiagramNode,
  NodeRole,
  ProcessTreeNode,
  TelemetryEvent,
  TelemetrySourceType,
} from '../types';
import { formatAttackCategoryLabel } from '../category-labels';

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

const KNOWN_BINARY_REGEX =
  /\b([A-Za-z0-9_.-]+\.(?:exe|dll|sys|sh|py|bat|ps1|vbs|msi|msp|jsp|aspx|php|jar|elf|ko|bin|so)|powershell|pwsh|cmd|bash|sh|zsh|python3?|node|npm|npx|git|sudo|curl|wget|certutil|regsvr32|rundll32|mshta|wmic|vssadmin|bcdedit|wbadmin|ntdsutil|nltest|netsh|sc|schtasks|psexec|msbuild|csc|java|javaw|tomcat\d*|w3wp|iisexpress|sqlservr|sqlcmd|mysqldump|psql|httpd|nginx|sshd|esxcli|nohup|socat|iptables|tar|chmod|chown|cp|mv|rm|echo|pgrep|pkill|kill|twine|gsutil|gcloud|aws|kubectl|runc|docker|chisel|hashcat|mimikatz|rubeus|sharpshares)\b/i;

function extractCleanProcessName(
  rawText: string,
  preferredLabel?: string
): string {
  if (preferredLabel) {
    const cleanedPref = preferredLabel
      .replace(/^["'`]+|["'`,;.)]+$/g, '')
      .trim();
    if (
      cleanedPref &&
      !/^(POST|GET|PUT|DELETE|HEAD|OPTIONS|PATCH|Body:?|Payload:?|Header:?|Cookie:?|Host:?|Crafted|Vulnerable|Inject|Injected|Drop|Execute|Upload|Read|Write|Modify|Hook|Prepend|Disable|Launch|Wipe|Direct|Extract|Overwrite|Iterate|Forks|Copies|Appends|Output:?|Attacker|Downstream|Transient|Target|Defense)$/i.test(
        cleanedPref
      )
    ) {
      return cleanedPref;
    }
  }

  // Strip leading "Label: " prefix if present (e.g. "SUNSPOT Service: C:\Windows\...")
  const colonSplit = rawText.match(/^[A-Za-z0-9 _/-]{2,32}:\s+(.+)$/);
  const candidate = (colonSplit ? colonSplit[1] : rawText).trim();

  // Look for explicit path or binary match
  const pathMatch = candidate.match(
    /(?:[A-Za-z]:\\[^\s"'`]+|\/(?:usr|bin|sbin|etc|opt|var|tmp|home|proc|dev|lib)[^\s"'`]+)/
  );
  if (pathMatch) {
    const base = pathMatch[0].split(/[\\/]/).pop() || pathMatch[0];
    if (base.length >= 2 && base.length <= 48) {
      return base.replace(/[",;.)]+$/, '');
    }
  }

  const binMatch = candidate.match(KNOWN_BINARY_REGEX);
  if (binMatch) {
    return binMatch[1];
  }

  const syscallMatch = candidate.match(
    /\b(Nt[A-Z][A-Za-z0-9]+|Zw[A-Z][A-Za-z0-9]+|DeviceIoControl|CreateServiceW|AdjustTokenPrivileges|ChangeServiceConfigW|CreateToolhelp32Snapshot|setsockopt|ioctl|eth_signTypedData_v4)\b/
  );
  if (syscallMatch) {
    return `${syscallMatch[1]}()`;
  }

  if (/^(POST|GET|PUT|DELETE)\s+(\S+)/i.test(candidate)) {
    const m = candidate.match(/^(POST|GET|PUT|DELETE)\s+(\S+)/i);
    return `http-handler (${m?.[1].toUpperCase()} ${m?.[2].slice(0, 24)})`;
  }

  const firstToken = candidate.split(/\s+/)[0] || 'runtime-worker';
  const cleaned = firstToken.replace(/^["'`<]+|["'`>,;.)]+$/g, '');
  if (
    !cleaned ||
    /^(Body|Payload|Crafted|Vulnerable|Inject|Injected|Drop|Execute|Upload|Read|Write|Modify|Hook|Prepend|Disable|Launch|Wipe|Direct|Extract|Overwrite|Iterate|Forks|Copies|Appends|Output|If|For|1\.|2\.|3\.)$/i.test(
      cleaned
    )
  ) {
    return 'stage-worker';
  }
  return cleaned;
}

function buildProcessTree(
  stages: LegacyDraftStage[],
  nodes: DiagramNode[]
): ProcessTreeNode[] {
  const trees: ProcessTreeNode[] = [];
  let nextPid = 4100;
  let currentParentPid = 880;

  // Seed a root host daemon / service parent so every scenario starts with a clear Depth-0 parent
  const primaryTargetNode =
    nodes.find(
      (n) =>
        n.role === 'victim_host' ||
        n.role === 'server' ||
        n.role === 'domain_controller'
    ) || nodes[1] || nodes[0];

  const firstStageLog = stages[0]?.logs?.[0];
  const explicitRootParent =
    firstStageLog?.parsedFields?.ParentProcess ||
    firstStageLog?.parsedFields?.ParentScript ||
    firstStageLog?.parsedFields?.TargetedBuildProcess ||
    firstStageLog?.parsedFields?.TargetProcess;

  const rootName = explicitRootParent
    ? extractCleanProcessName(explicitRootParent, explicitRootParent)
    : primaryTargetNode
      ? `${primaryTargetNode.label.split('(')[0].trim()} Daemon`
      : 'systemd / services.exe';

  const rootPid = currentParentPid;
  trees.push({
    pid: rootPid,
    ppid: 4,
    name: rootName,
    commandLine: explicitRootParent
      ? `${explicitRootParent} --service-host`
      : `${rootName} --host "${primaryTargetNode?.label || 'target-node'}"`,
    user: 'SYSTEM / root',
    integrity: 'SYSTEM',
    status: 'normal',
    activeFromStage: 1,
    apiCalls: ['InitializeServiceHost', 'ListenEndpoint'],
  });

  for (const stage of stages) {
    const stageCommands = (stage.technicalCommands || []).map((c) => c.trim()).filter(Boolean);
    const stageLogs = stage.logs || [];

    let stagePrimaryCreated = false;
    let stagePrimaryPid = currentParentPid;

    for (const log of stageLogs) {
      const fields = log.parsedFields || {};
      const preferredLabel =
        log.ProcessName ||
        fields.ExecutingProcess ||
        fields.HostBinary ||
        fields.Implant ||
        fields.Stage2Implant ||
        fields.UserModeLoader ||
        fields.MaliciousDriver ||
        fields.SystemBinaryProxy ||
        fields.CompromisedAction ||
        fields.CompromisedPackage ||
        fields.DynamicLoader;

      const rawCommand =
        log.CommandLine ||
        preferredLabel ||
        fields.Image ||
        fields.LolbinDecoder ||
        fields.BatchDropper ||
        fields.PayloadPath ||
        fields.ExternalScriptUrl ||
        stageCommands[0] ||
        stage.title;

      const cleanName = extractCleanProcessName(rawCommand, preferredLabel);
      const formattedCmd =
        log.CommandLine ||
        stageCommands[0] ||
        Object.entries(fields)
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ') ||
        rawCommand;

      const thisPid = nextPid;
      nextPid += 120;

      const status: ProcessTreeNode['status'] =
        stage.id === 1
          ? 'suspicious'
          : /inject|hollow|memory|teardrop|beacon|hook|preload|pth/i.test(
                formattedCmd + ' ' + cleanName
              )
            ? 'injected'
            : 'malicious';

      trees.push({
        pid: thisPid,
        ppid: currentParentPid,
        name:
          cleanName === 'stage-worker'
            ? `stage${stage.id}-${( preferredLabel || stage.title ).split(/\s+/)[0].toLowerCase()}`
            : cleanName,
        commandLine: formattedCmd,
        user: stage.id === 1 ? 'svc_runtime' : 'SYSTEM / root',
        integrity: stage.id === 1 ? 'High' : 'SYSTEM',
        status,
        activeFromStage: stage.id,
        apiCalls:
          stageCommands.length > 0
            ? stageCommands.slice(0, 4)
            : Object.keys(fields),
      });

      stagePrimaryPid = thisPid;
      stagePrimaryCreated = true;
    }

    if (!stagePrimaryCreated && stageCommands.length > 0) {
      const firstCmd = stageCommands[0];
      const cleanName = extractCleanProcessName(firstCmd);
      const thisPid = nextPid;
      nextPid += 120;

      trees.push({
        pid: thisPid,
        ppid: currentParentPid,
        name:
          cleanName === 'stage-worker'
            ? `stage${stage.id}-executor`
            : cleanName,
        commandLine: firstCmd,
        user: 'SYSTEM / root',
        integrity: 'High',
        status: stage.id === 1 ? 'suspicious' : 'malicious',
        activeFromStage: stage.id,
        apiCalls: stageCommands.slice(0, 4),
      });

      stagePrimaryPid = thisPid;
    }

    // Also check if a secondary distinct binary is spawned within the same stage's technicalCommands
    for (let i = 1; i < stageCommands.length; i++) {
      const cmd = stageCommands[i];
      const binMatch = cmd.match(KNOWN_BINARY_REGEX);
      if (binMatch) {
        const childBin = extractCleanProcessName(cmd, binMatch[1]);
        const prevProc = trees[trees.length - 1];
        if (prevProc && prevProc.name.toLowerCase() !== childBin.toLowerCase()) {
          const subPid = nextPid;
          nextPid += 64;
          trees.push({
            pid: subPid,
            ppid: stagePrimaryPid,
            name: childBin,
            commandLine: cmd,
            user: 'SYSTEM / root',
            integrity: 'SYSTEM',
            status: 'malicious',
            activeFromStage: stage.id,
            apiCalls: [cmd],
          });
          stagePrimaryPid = subPid;
        }
      }
    }

    // Advance parent pointer so the next stage cascades from this stage's process
    currentParentPid = stagePrimaryPid;
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
      'defense evasion': 4,
      'credential access': 5,
      discovery: 5,
      'lateral movement': 6,
      'command and control': 6,
      collection: 7,
      exfiltration: 7,
      impact: 7,
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
  const processTree = buildProcessTree(draft.stages || [], nodes);
  const techniqueId = extractTechniqueId(
    draft.mitreId,
    draft.stages?.[0]?.mitreTactic
  );

  return {
    id: draft.id,
    code: techniqueId,
    name: draft.title,
    shortSubtitle: `${formatAttackCategoryLabel(draft.category)} · ${techniqueId}`,
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
