import { AttackScenario, DiagramNode, TelemetryEvent } from './attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
  tagTelemetryEventWithEnvironment } from './simulation-engine';

export type NetworkZoneId =
  | 'EXTERNAL_ATTACKER'
  | 'PERIMETER_DELIVERY'
  | 'CORE_NETWORK_FABRIC'
  | 'ENDPOINT_LAPTOP_MALWARE'
  | 'CORP_LATERAL_MOVEMENT'
  | 'INTERNAL_SUBZONE_A'
  | 'INTERNAL_SUBZONE_B'
  | 'INTERNAL_SUBZONE_C'
  | 'INTERNAL_SUBZONE_D';

export type DrillDownArchetype =
  | 'MALWARE_PROCESSES'
  | 'LAPTOP_HOST_ACTIVITY'
  | 'LATERAL_MOVEMENT'
  | 'PACKET_AND_GATEWAY';

export type SketchIconType =
  | 'ATTACKER'
  | 'PHISHING_GATEWAY'
  | 'FIREWALL_ROUTER'
  | 'CORE_SWITCH'
  | 'WAF_REVERSE_PROXY'
  | 'DNS_RESOLVER'
  | 'VICTIM_LAPTOP'
  | 'MALWARE_PAYLOAD'
  | 'LATERAL_SERVER'
  | 'SIEM_SENSOR'
  | 'KERNEL_MEMORY'
  | 'PROCESS_THREAD'
  | 'PACKET_ENGINE'
  | 'CREDENTIAL_VAULT';

export interface NetworkZoneColumn {
  id: NetworkZoneId;
  code: string;
  title: string;
  subtitle: string;
  xStart: number;
  xEnd: number;
  /** Optional 2D vertical bounds so zones form non-collinear network topology islands (defaults to 14..636) */
  yStart?: number;
  yEnd?: number;
  subnetBadge?: string;
  accentHex: string;
  bgTintClass: string;
}

export interface NetworkBackboneLink {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  linkType: 'WAN_TRUNK' | 'VLAN_TRUNK' | 'SPAN_MIRROR' | 'INTERNAL_BUS';
  /** Dynamically calculated link sequence badge (e.g., L1..L4 on main board, L4.1..L4.4 in nested node #4) */
  sequenceCode?: string;
}

export interface BidirectionalTraceMeta {
  stepNo: number;
  stageIndex: number;
  sequenceCode: string;
  forwardSeq: string;
  returnSeq: string;
  isBidirectional: boolean;
  initiatorLabel: string;
  receiverLabel: string;
  forwardAction: string;
  returnLabel: string;
  returnDescription: string;
  continuationHint: string;
}

export interface WhiteboardSketchNode {
  id: string;
  originalNode?: DiagramNode;
  zoneId: NetworkZoneId;
  archetype: DrillDownArchetype;
  chainOrder: number;
  /** Preserved & dynamically calculated hierarchical node sequence code (e.g. "4" on main board, "4.1".."4.5" inside Node #4) */
  sequenceCode?: string;
  iconType: SketchIconType;
  label: string;
  sublabel: string;
  /** Human-readable network zone name for search / toolbar display */
  zoneLabel?: string;
  actionBadge: string;
  /** Explicit Host / System / Appliance context answering "On which system / where is this running?" */
  hostContext: string;
  /** Concise summary of the activities occurring on this host or inside this process */
  activitySummary: string;
  /** Active environment tag for telemetry & malware activity correlation */
  activeEnvironmentId?: ActiveEnvironmentId;
  activeEnvironmentTag?: string;
  /** Optional linked ID between Host Node ③ and the Process Node ④ running on that Host */
  companionHostOrProcessNodeId?: string;
  /** Spacious SVG whiteboard coordinates (1480 x 650) */
  wx: number;
  wy: number;
  isCompromised: boolean;
  isActive: boolean;
  isNetworkDevice?: boolean;
  internalSummary?: string;
}

export interface StageLocationContext {
  activeEnvironment: ActiveEnvironmentId;
  environmentBadge: string;
  environmentTag: string;
  scopeBadge: string;
  currentSystemLabel: string;
  currentProcessOrComponentLabel: string;
  whereWeAreSummary: string;
  activeHostNodeId: string;
  activeProcessNodeId: string;
}

export interface CurveArrowMarker {
  x: number;
  y: number;
  angleDeg: number;
}

export interface WhiteboardSketchFlow {
  id: string;
  stepNo: number;
  stageIndex: number;
  /** Dynamically calculated sequence badge ("1".."5" on main board, "4.1".."4.4" when drilling down into Node #4) */
  sequenceCode: string;
  /** Optional parent sequence prefix when inside a nested/expanded view (e.g. "4") */
  parentSequencePrefix?: string;
  forwardSeq: string;
  returnSeq: string;
  isBidirectional: boolean;
  fromNodeId: string;
  toNodeId: string;
  initiatorLabel: string;
  targetLabel: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  controlX: number;
  controlY: number;
  pathD: string;
  xKeyframes: number[];
  yKeyframes: number[];
  forwardArrows: CurveArrowMarker[];
  returnControlX: number;
  returnControlY: number;
  returnPathD: string;
  returnXKeyframes: number[];
  returnYKeyframes: number[];
  returnArrows: CurveArrowMarker[];
  packetKind: 'EMAIL' | 'MALWARE_DROP' | 'SYSCALL' | 'LATERAL_HOP' | 'C2_EXFIL';
  label: string;
  returnLabel: string;
  protocolBadge: string;
  isCurrentStep: boolean;
  isVisible: boolean;
  telemetryEvent: TelemetryEvent;
  traceMeta: BidirectionalTraceMeta;
}

export function sampleBezierPointAndAngle(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  t: number
): CurveArrowMarker {
  const inv = 1 - t;
  const x = inv * inv * x0 + 2 * inv * t * cx + t * t * x2;
  const y = inv * inv * y0 + 2 * inv * t * cy + t * t * y2;
  const dx = 2 * inv * (cx - x0) + 2 * t * (x2 - cx);
  const dy = 2 * inv * (cy - y0) + 2 * t * (y2 - cy);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    angleDeg: Math.round(angleDeg * 10) / 10 };
}

export function trimPointFromNodeCenter(
  nodeX: number,
  nodeY: number,
  towardX: number,
  towardY: number,
  offset: number = 54
): { x: number; y: number } {
  const dx = towardX - nodeX;
  const dy = towardY - nodeY;
  const dist = Math.hypot(dx, dy) || 1;
  return {
    x: Math.round((nodeX + (dx / dist) * offset) * 10) / 10,
    y: Math.round((nodeY + (dy / dist) * offset) * 10) / 10 };
}

export function createBidirectionalFlowGeometry(params: {
  id: string;
  stepNo: number;
  stageIndex: number;
  fromNode: WhiteboardSketchNode;
  toNode: WhiteboardSketchNode;
  curveOffset: number;
  returnOffset: number;
  packetKind: WhiteboardSketchFlow['packetKind'];
  telemetryEvent: TelemetryEvent;
  nextEvent?: TelemetryEvent;
  isCurrentStep: boolean;
  isVisible: boolean;
  sequencePrefix?: string;
}): WhiteboardSketchFlow {
  const {
    id,
    stepNo,
    stageIndex,
    fromNode,
    toNode,
    curveOffset,
    returnOffset,
    packetKind,
    telemetryEvent,
    nextEvent,
    isCurrentStep,
    isVisible,
    sequencePrefix } = params;

  const traceMeta = buildBidirectionalTraceMeta(
    telemetryEvent,
    nextEvent,
    sequencePrefix
  );

  const rawFromX = fromNode.wx;
  const rawFromY = fromNode.wy;
  const rawToX = toNode.wx;
  const rawToY = toNode.wy;

  const dx = rawToX - rawFromX;
  const dy = rawToY - rawFromY;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const midX = (rawFromX + rawToX) / 2;
  const midY = (rawFromY + rawToY) / 2;

  const controlX = Math.round((midX + nx * curveOffset) * 10) / 10;
  const controlY = Math.round((midY + ny * curveOffset) * 10) / 10;

  const trimmedFrom = trimPointFromNodeCenter(
    rawFromX,
    rawFromY,
    controlX,
    controlY,
    52
  );
  const trimmedTo = trimPointFromNodeCenter(
    rawToX,
    rawToY,
    controlX,
    controlY,
    56
  );
  const fromX = trimmedFrom.x;
  const fromY = trimmedFrom.y;
  const toX = trimmedTo.x;
  const toY = trimmedTo.y;

  const pathD = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  const returnControlX = Math.round((midX + nx * returnOffset) * 10) / 10;
  const returnControlY = Math.round((midY + ny * returnOffset) * 10) / 10;

  const trimmedRetFrom = trimPointFromNodeCenter(
    rawToX,
    rawToY,
    returnControlX,
    returnControlY,
    52
  );
  const trimmedRetTo = trimPointFromNodeCenter(
    rawFromX,
    rawFromY,
    returnControlX,
    returnControlY,
    56
  );

  const returnPathD = `M ${trimmedRetFrom.x} ${trimmedRetFrom.y} Q ${returnControlX} ${returnControlY} ${trimmedRetTo.x} ${trimmedRetTo.y}`;

  const forwardArrows: CurveArrowMarker[] = [0.22, 0.78, 0.98].map((t) =>
    sampleBezierPointAndAngle(fromX, fromY, controlX, controlY, toX, toY, t)
  );
  const returnArrows: CurveArrowMarker[] = [0.22, 0.78, 0.98].map((t) =>
    sampleBezierPointAndAngle(
      trimmedRetFrom.x,
      trimmedRetFrom.y,
      returnControlX,
      returnControlY,
      trimmedRetTo.x,
      trimmedRetTo.y,
      t
    )
  );

  const xKeyframes: number[] = [];
  const yKeyframes: number[] = [];
  const returnXKeyframes: number[] = [];
  const returnYKeyframes: number[] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    xKeyframes.push(
      Math.round(
        (inv * inv * fromX + 2 * inv * t * controlX + t * t * toX) * 10
      ) / 10
    );
    yKeyframes.push(
      Math.round(
        (inv * inv * fromY + 2 * inv * t * controlY + t * t * toY) * 10
      ) / 10
    );
    returnXKeyframes.push(
      Math.round(
        (inv * inv * trimmedRetFrom.x +
          2 * inv * t * returnControlX +
          t * t * trimmedRetTo.x) *
          10
      ) / 10
    );
    returnYKeyframes.push(
      Math.round(
        (inv * inv * trimmedRetFrom.y +
          2 * inv * t * returnControlY +
          t * t * trimmedRetTo.y) *
          10
      ) / 10
    );
  }

  return {
    id,
    stepNo,
    stageIndex,
    sequenceCode: traceMeta.sequenceCode,
    parentSequencePrefix: sequencePrefix,
    forwardSeq: traceMeta.forwardSeq,
    returnSeq: traceMeta.returnSeq,
    isBidirectional: traceMeta.isBidirectional,
    fromNodeId: fromNode.id,
    toNodeId: toNode.id,
    initiatorLabel: telemetryEvent.sourceLabel,
    targetLabel: telemetryEvent.targetLabel,
    fromX,
    fromY,
    toX,
    toY,
    controlX,
    controlY,
    pathD,
    xKeyframes,
    yKeyframes,
    forwardArrows,
    returnControlX,
    returnControlY,
    returnPathD,
    returnXKeyframes,
    returnYKeyframes,
    returnArrows,
    packetKind,
    label: telemetryEvent.shortAction,
    returnLabel: traceMeta.returnLabel,
    protocolBadge: telemetryEvent.protocolOrEventId,
    isCurrentStep,
    isVisible,
    telemetryEvent,
    traceMeta };
}

export function buildBidirectionalTraceMeta(
  ev: TelemetryEvent,
  nextEv?: TelemetryEvent,
  sequencePrefix?: string
): BidirectionalTraceMeta {
  const sequenceCode = sequencePrefix
    ? `${sequencePrefix}.${ev.no}`
    : `${ev.no}`;
  const forwardSeq = `${sequenceCode}.1`;
  const returnSeq = `${sequenceCode}.2`;
  const nextSequenceCode = nextEv
    ? sequencePrefix
      ? `${sequencePrefix}.${nextEv.no}`
      : `${nextEv.no}`
    : null;
  const code = ev.sizeOrCode || 'OK';

  let returnLabel = `ACK · ${code}`;
  if (ev.sourceType === 'WIN32_API') {
    returnLabel = `RET ${code}`;
  } else if (ev.sourceType === 'NETWORK') {
    returnLabel = `RESP ${code}`;
  } else if (
    ev.sourceType === 'SYSMON' ||
    ev.sourceType === 'WIN_EVENT' ||
    ev.sourceType === 'LINUX_AUDIT'
  ) {
    returnLabel = `ACK ${code}`;
  } else if (ev.sourceType === 'IDS_ALERT' || ev.sourceType === 'MEMORY_SCAN') {
    returnLabel = `ALERT ${code}`;
  }

  const returnDescription: string = `Return leg (#${returnSeq} ⇠): ${ev.targetLabel} responds to initiator ${ev.sourceLabel} with [${returnLabel}] confirming execution/delivery of ${ev.shortAction}.`;

  const continuationHint: string =
    nextEv && nextSequenceCode
      ? `Next (#${nextSequenceCode}.1 →): ${nextEv.sourceLabel} continues the chain toward ${nextEv.targetLabel} via ${nextEv.shortAction} (${nextEv.protocolOrEventId}).`
      : `End of current sequence (#${returnSeq} ⇠): Final state recorded in telemetry & SIEM audit trail.`;

  return {
    stepNo: ev.no,
    stageIndex: ev.stageIndex,
    sequenceCode,
    forwardSeq,
    returnSeq,
    isBidirectional: true,
    initiatorLabel: ev.sourceLabel,
    receiverLabel: ev.targetLabel,
    forwardAction: ev.shortAction,
    returnLabel,
    returnDescription,
    continuationHint };
}

export interface EntityDrillDownData {
  nodeId: string;
  nodeLabel: string;
  nodeSublabel: string;
  archetype: DrillDownArchetype;
  headline: string;
  summary: string;
  malwareProcesses: {
    step: number;
    apiOrProcess: string;
    target: string;
    memoryAddress: string;
    status: 'EXECUTED' | 'INJECTED' | 'PERSISTENT';
    detail: string;
  }[];
  laptopHostActivities: {
    category: 'EMAIL_OPEN' | 'FILE_DROP' | 'PROCESS_SPAWN' | 'MEMORY_TAMPER' | 'REGISTRY_NET';
    title: string;
    artifactPath: string;
    eventIdBadge: string;
    description: string;
  }[];
  lateralMovementHops: {
    hop: number;
    sourceHost: string;
    targetHost: string;
    protocol: string;
    technique: string;
    eventId: string;
    summary: string;
  }[];
  packets: {
    id: string;
    timestamp: string;
    protocol: string;
    src: string;
    dst: string;
    flagsOrSize: string;
    payloadPreview: string;
    event: TelemetryEvent;
  }[];
}

export const NETWORK_ZONE_COLUMNS: NetworkZoneColumn[] = [
  {
    id: 'EXTERNAL_ATTACKER',
    code: 'WAN · AS64512',
    title: 'EXTERNAL WAN & C2 INFRA',
    subtitle: 'Threat Actor / Exploit & C2 Nodes',
    xStart: 18,
    xEnd: 310,
    yStart: 20,
    yEnd: 430,
    subnetBadge: 'WAN · 185.220.101.0/24',
    accentHex: '#E11D48',
    bgTintClass: 'bg-rose-500/5' },
  {
    id: 'PERIMETER_DELIVERY',
    code: 'DMZ · EDGE FW',
    title: 'PERIMETER FIREWALL & DMZ',
    subtitle: 'Stateful Firewall / WAF / Mail & DNS Relay',
    xStart: 332,
    xEnd: 650,
    yStart: 125,
    yEnd: 625,
    subnetBadge: 'DMZ · 172.16.10.0/24',
    accentHex: '#D97706',
    bgTintClass: 'bg-amber-500/5' },
  {
    id: 'ENDPOINT_LAPTOP_MALWARE',
    code: 'VLAN 20 · ACCESS',
    title: 'ENDPOINT WORKSTATION VLAN',
    subtitle: 'Click Host or Malware to Expand Internal Visual Board',
    xStart: 672,
    xEnd: 1065,
    yStart: 18,
    yEnd: 590,
    subnetBadge: 'VLAN 20 · 10.10.4.0/24',
    accentHex: '#0284C7',
    bgTintClass: 'bg-sky-500/5' },
  {
    id: 'CORP_LATERAL_MOVEMENT',
    code: 'VLAN 10/99 · CORE',
    title: 'CORE DATACENTER & SOC SIEM',
    subtitle: 'Domain Controller / Internal Server & SOC Sensor',
    xStart: 1088,
    xEnd: 1462,
    yStart: 65,
    yEnd: 632,
    subnetBadge: 'VLAN 10 · 10.10.0.0/24',
    accentHex: '#7C3AED',
    bgTintClass: 'bg-violet-500/5' },
];

export function classifyNodeDrillDownArchetype(
  node: DiagramNode
): DrillDownArchetype {
  const text = `${node.id} ${node.label} ${node.sublabel} ${node.details.osOrType}`.toLowerCase();

  if (
    node.role === 'memory' ||
    node.role === 'process' ||
    /dropper|invoice|loader|reflective|lockbit|beacon|ntdll|amsi|hollow/i.test(text)
  ) {
    return 'MALWARE_PROCESSES';
  }

  if (
    node.role === 'victim_host' ||
    /wks|laptop|workstation|host|victim|endpoint/i.test(text)
  ) {
    return 'LAPTOP_HOST_ACTIVITY';
  }

  if (
    node.role === 'domain_controller' ||
    node.role === 'server' ||
    /dc01|sql|domain|spring|fileserver|lateral|vss/i.test(text)
  ) {
    return 'LATERAL_MOVEMENT';
  }

  return 'PACKET_AND_GATEWAY';
}

interface ScenarioTopologyBlueprint {
  zones: NetworkZoneColumn[];
  nodeCoords: [
    { wx: number; wy: number },
    { wx: number; wy: number; netIcon: SketchIconType; netLabel: string; netSublabel: string; netBadge: string },
    { wx: number; wy: number },
    { wx: number; wy: number },
    { wx: number; wy: number },
    { wx: number; wy: number }
  ];
  routeChain: {
    fromIdx: number;
    toIdx: number;
    packetKind: WhiteboardSketchFlow['packetKind'];
    curveOffset: number;
    returnOffset: number;
  }[];
  backboneLinks: NetworkBackboneLink[];
}

function getScenarioTopologyBlueprint(scenario: AttackScenario): ScenarioTopologyBlueprint {
  switch (scenario.id) {
    case 'log4shell-dfir':
      return {
        zones: [
          {
            id: 'EXTERNAL_ATTACKER',
            code: 'WAN · EXPLOIT-NET',
            title: 'WAN SCANNER & ROGUE LDAP',
            subtitle: 'JNDI Exploit Injector & stage2.class HTTP Host',
            xStart: 18,
            xEnd: 315,
            yStart: 20,
            yEnd: 430,
            subnetBadge: 'WAN · 45.155.205.0/24',
            accentHex: '#E11D48',
            bgTintClass: 'bg-rose-500/5' },
          {
            id: 'PERIMETER_DELIVERY',
            code: 'DMZ · WAF & PROXY',
            title: 'DMZ INGRESS WAF / REVERSE PROXY',
            subtitle: 'TLS Termination & HTTP Header Forwarding (:443)',
            xStart: 338,
            xEnd: 660,
            yStart: 30,
            yEnd: 410,
            subnetBadge: 'DMZ-WEB · 172.16.20.0/24',
            accentHex: '#D97706',
            bgTintClass: 'bg-amber-500/5' },
          {
            id: 'ENDPOINT_LAPTOP_MALWARE',
            code: 'VLAN 30 · APP TIER',
            title: 'APP SERVER & JVM LOG4J RUNTIME',
            subtitle: 'Spring Boot Container & Deserialized Shell Process',
            xStart: 682,
            xEnd: 1072,
            yStart: 95,
            yEnd: 628,
            subnetBadge: 'VLAN 30 · 10.20.30.0/24',
            accentHex: '#0284C7',
            bgTintClass: 'bg-sky-500/5' },
          {
            id: 'CORP_LATERAL_MOVEMENT',
            code: 'VLAN 99 · CORE & IDS',
            title: 'EGRESS ROUTER, SURICATA IDS & SIEM',
            subtitle: 'SPAN Tap Inspecting Outbound TCP/1389 & Reverse Shell',
            xStart: 1095,
            xEnd: 1462,
            yStart: 20,
            yEnd: 610,
            subnetBadge: 'VLAN 99 · 10.20.99.0/24',
            accentHex: '#7C3AED',
            bgTintClass: 'bg-violet-500/5' },
        ],
        nodeCoords: [
          { wx: 165, wy: 225 },
          {
            wx: 495,
            wy: 210,
            netIcon: 'WAF_REVERSE_PROXY',
            netLabel: 'DMZ WAF & Reverse Proxy',
            netSublabel: '172.16.20.10 · HTTPS :443',
            netBadge: 'NET-DEV ② · WAF / Reverse Proxy' },
          { wx: 830, wy: 195 },
          { wx: 915, wy: 480 },
          { wx: 1235, wy: 185 },
          { wx: 1295, wy: 475 },
        ],
        routeChain: [
          { fromIdx: 0, toIdx: 1, packetKind: 'EMAIL', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 1, toIdx: 2, packetKind: 'MALWARE_DROP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 2, toIdx: 0, packetKind: 'C2_EXFIL', curveOffset: 82, returnOffset: -52 },
          { fromIdx: 2, toIdx: 3, packetKind: 'SYSCALL', curveOffset: -52, returnOffset: 52 },
          { fromIdx: 3, toIdx: 5, packetKind: 'LATERAL_HOP', curveOffset: -48, returnOffset: 48 },
        ],
        backboneLinks: [
          { id: 'bb-1', x1: 165, y1: 225, x2: 495, y2: 210, label: 'WAN HTTPS :443', linkType: 'WAN_TRUNK' },
          { id: 'bb-2', x1: 495, y1: 210, x2: 830, y2: 195, label: 'DMZ -> VLAN 30', linkType: 'VLAN_TRUNK' },
          { id: 'bb-3', x1: 830, y1: 195, x2: 1235, y2: 185, label: 'Core Trunk', linkType: 'VLAN_TRUNK' },
          { id: 'bb-4', x1: 1055, y1: 535, x2: 1295, y2: 475, label: 'SPAN Mirror', linkType: 'SPAN_MIRROR' },
        ] };

    case 'ad-kerberoasting':
      return {
        zones: [
          {
            id: 'EXTERNAL_ATTACKER',
            code: 'VLAN 24 · FOOTHOLD',
            title: 'COMPROMISED USER SUBNET (FOOTHOLD)',
            subtitle: 'Initial Domain User Session (corp\\jdoe)',
            xStart: 18,
            xEnd: 315,
            yStart: 155,
            yEnd: 625,
            subnetBadge: 'VLAN 24 · 10.10.24.0/24',
            accentHex: '#E11D48',
            bgTintClass: 'bg-rose-500/5' },
          {
            id: 'PERIMETER_DELIVERY',
            code: 'CORE L3 · INTER-VLAN',
            title: 'CORE L3 SWITCH & VLAN ROUTER',
            subtitle: '802.1Q Inter-VLAN Routing (TCP :389 / :88 / :445)',
            xStart: 338,
            xEnd: 655,
            yStart: 20,
            yEnd: 430,
            subnetBadge: 'CORE-SW · 10.10.0.1/16',
            accentHex: '#D97706',
            bgTintClass: 'bg-amber-500/5' },
          {
            id: 'ENDPOINT_LAPTOP_MALWARE',
            code: 'HOST · RUBEUS & HASHCAT',
            title: 'POWERSHELL RUBEUS & TICKET EXTRACTOR',
            subtitle: 'In-Memory TGS RC4 Extraction & Offline Cracking',
            xStart: 678,
            xEnd: 1070,
            yStart: 105,
            yEnd: 628,
            subnetBadge: 'HOST-MEM · PID 6104',
            accentHex: '#0284C7',
            bgTintClass: 'bg-sky-500/5' },
          {
            id: 'CORP_LATERAL_MOVEMENT',
            code: 'VLAN 10 · AD TIER-0',
            title: 'TIER-0 DOMAIN CONTROLLER & SQL SERVER',
            subtitle: 'DC01 KDC (:88) · MSSQLSvc (:1433) · EventID 4769',
            xStart: 1092,
            xEnd: 1462,
            yStart: 20,
            yEnd: 615,
            subnetBadge: 'VLAN 10 · 10.10.0.0/24',
            accentHex: '#7C3AED',
            bgTintClass: 'bg-violet-500/5' },
        ],
        nodeCoords: [
          { wx: 165, wy: 410 },
          {
            wx: 495,
            wy: 215,
            netIcon: 'CORE_SWITCH',
            netLabel: 'Core L3 VLAN Switch',
            netSublabel: '10.10.0.1 · 802.1Q Trunk',
            netBadge: 'NET-DEV ② · Core L3 Switch' },
          { wx: 830, wy: 210 },
          { wx: 915, wy: 480 },
          { wx: 1235, wy: 185 },
          { wx: 1295, wy: 470 },
        ],
        routeChain: [
          { fromIdx: 0, toIdx: 1, packetKind: 'LATERAL_HOP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 1, toIdx: 4, packetKind: 'LATERAL_HOP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 4, toIdx: 2, packetKind: 'MALWARE_DROP', curveOffset: 52, returnOffset: -52 },
          { fromIdx: 2, toIdx: 3, packetKind: 'SYSCALL', curveOffset: -52, returnOffset: 52 },
          { fromIdx: 3, toIdx: 4, packetKind: 'C2_EXFIL', curveOffset: 50, returnOffset: -50 },
        ],
        backboneLinks: [
          { id: 'bb-1', x1: 165, y1: 410, x2: 495, y2: 215, label: 'VLAN 24 Uplink', linkType: 'VLAN_TRUNK' },
          { id: 'bb-2', x1: 495, y1: 215, x2: 1235, y2: 185, label: '802.1Q -> Tier-0 DC01', linkType: 'VLAN_TRUNK' },
          { id: 'bb-3', x1: 495, y1: 215, x2: 830, y2: 210, label: 'Host Bus', linkType: 'INTERNAL_BUS' },
          { id: 'bb-4', x1: 1055, y1: 535, x2: 1295, y2: 470, label: 'Event 4769 Tap', linkType: 'SPAN_MIRROR' },
        ] };

    case 'dns-tunneling-exfil':
      return {
        zones: [
          {
            id: 'EXTERNAL_ATTACKER',
            code: 'WAN · AUTH DNS C2',
            title: 'AUTHORITATIVE C2 NAMESERVER (WAN)',
            subtitle: '*.c2-auth.net · Reassembling Base32 Exfil Chunks',
            xStart: 18,
            xEnd: 315,
            yStart: 20,
            yEnd: 415,
            subnetBadge: 'WAN-DNS · 198.51.100.53/32',
            accentHex: '#E11D48',
            bgTintClass: 'bg-rose-500/5' },
          {
            id: 'PERIMETER_DELIVERY',
            code: 'DMZ · DNS RESOLVER',
            title: 'CORP RECURSIVE DNS & EGRESS FIREWALL',
            subtitle: 'Blocks Direct HTTP/S · Relays Recursive UDP/53 Queries',
            xStart: 338,
            xEnd: 660,
            yStart: 165,
            yEnd: 628,
            subnetBadge: 'DMZ-DNS · 10.10.0.53/32',
            accentHex: '#D97706',
            bgTintClass: 'bg-amber-500/5' },
          {
            id: 'ENDPOINT_LAPTOP_MALWARE',
            code: 'VLAN 40 · R&D HOST',
            title: 'RESTRICTED R&D WORKSTATION & BEACON',
            subtitle: 'Reads Sensitive File & Encodes 63-Byte Subdomain Labels',
            xStart: 682,
            xEnd: 1072,
            yStart: 20,
            yEnd: 575,
            subnetBadge: 'VLAN 40 · 10.10.40.0/24',
            accentHex: '#0284C7',
            bgTintClass: 'bg-sky-500/5' },
          {
            id: 'CORP_LATERAL_MOVEMENT',
            code: 'SOC · ZEEK & NDR',
            title: 'ZEEK DNS TELEMETRY & NDR ANALYTICS',
            subtitle: 'Shannon Entropy (>4.3 bits) & TXT Volume Detector',
            xStart: 1095,
            xEnd: 1462,
            yStart: 95,
            yEnd: 628,
            subnetBadge: 'SOC-NDR · 10.10.99.20/24',
            accentHex: '#7C3AED',
            bgTintClass: 'bg-violet-500/5' },
        ],
        nodeCoords: [
          { wx: 165, wy: 210 },
          {
            wx: 498,
            wy: 415,
            netIcon: 'DNS_RESOLVER',
            netLabel: 'Corp DNS Resolver & FW',
            netSublabel: '10.10.0.53 · UDP/53 Relay',
            netBadge: 'NET-DEV ② · DNS Resolver & FW' },
          { wx: 830, wy: 185 },
          { wx: 915, wy: 445 },
          { wx: 1235, wy: 210 },
          { wx: 1295, wy: 475 },
        ],
        routeChain: [
          { fromIdx: 2, toIdx: 3, packetKind: 'SYSCALL', curveOffset: -52, returnOffset: 52 },
          { fromIdx: 3, toIdx: 1, packetKind: 'C2_EXFIL', curveOffset: 48, returnOffset: -48 },
          { fromIdx: 1, toIdx: 0, packetKind: 'C2_EXFIL', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 1, toIdx: 5, packetKind: 'LATERAL_HOP', curveOffset: 48, returnOffset: -48 },
        ],
        backboneLinks: [
          { id: 'bb-1', x1: 830, y1: 185, x2: 498, y2: 415, label: 'UDP/53 Only ACL', linkType: 'VLAN_TRUNK' },
          { id: 'bb-2', x1: 498, y1: 415, x2: 165, y2: 210, label: 'Recursive Lookup', linkType: 'WAN_TRUNK' },
          { id: 'bb-3', x1: 1055, y1: 535, x2: 1295, y2: 475, label: 'Zeek DNS Tap', linkType: 'SPAN_MIRROR' },
        ] };

    case 'amsi-reflective-dll':
      return {
        zones: [
          {
            id: 'EXTERNAL_ATTACKER',
            code: 'WAN · CDN STAGER',
            title: 'HTTPS PAYLOAD STAGER & C2',
            subtitle: 'Serves Encrypted Reflective Assembly Over TLS 1.3',
            xStart: 18,
            xEnd: 312,
            yStart: 120,
            yEnd: 590,
            subnetBadge: 'WAN · 185.199.108.0/24',
            accentHex: '#E11D48',
            bgTintClass: 'bg-rose-500/5' },
          {
            id: 'PERIMETER_DELIVERY',
            code: 'EDGE · NGFW PROXY',
            title: 'PERIMETER NGFW & WEB PROXY',
            subtitle: 'Outbound TCP :443 NAT & SSL Session Inspection',
            xStart: 335,
            xEnd: 655,
            yStart: 20,
            yEnd: 415,
            subnetBadge: 'EDGE-FW · 172.16.1.1/24',
            accentHex: '#D97706',
            bgTintClass: 'bg-amber-500/5' },
          {
            id: 'ENDPOINT_LAPTOP_MALWARE',
            code: 'VLAN 20 · CLR MEMORY',
            title: 'ENDPOINT POWERSHELL & AMSI.DLL MEMORY',
            subtitle: 'VirtualProtect RWX Patch on AmsiScanBuffer & Assembly.Load',
            xStart: 678,
            xEnd: 1072,
            yStart: 85,
            yEnd: 628,
            subnetBadge: 'VLAN 20 · 10.10.4.55/24',
            accentHex: '#0284C7',
            bgTintClass: 'bg-sky-500/5' },
          {
            id: 'CORP_LATERAL_MOVEMENT',
            code: 'SOC · EDR & EID 4104',
            title: 'EDR MEMORY SCANNER & SCRIPTBLOCK SIEM',
            subtitle: 'Detects UnbackedCLR Module & Patched .text Section',
            xStart: 1095,
            xEnd: 1462,
            yStart: 25,
            yEnd: 590,
            subnetBadge: 'SOC-EDR · 10.10.99.10/24',
            accentHex: '#7C3AED',
            bgTintClass: 'bg-violet-500/5' },
        ],
        nodeCoords: [
          { wx: 165, wy: 365 },
          {
            wx: 495,
            wy: 210,
            netIcon: 'FIREWALL_ROUTER',
            netLabel: 'Perimeter NGFW & Proxy',
            netSublabel: '172.16.1.1 · TLS :443 NAT',
            netBadge: 'NET-DEV ② · Perimeter NGFW' },
          { wx: 830, wy: 205 },
          { wx: 915, wy: 475 },
          { wx: 1235, wy: 185 },
          { wx: 1295, wy: 465 },
        ],
        routeChain: [
          { fromIdx: 2, toIdx: 3, packetKind: 'SYSCALL', curveOffset: -52, returnOffset: 52 },
          { fromIdx: 2, toIdx: 1, packetKind: 'MALWARE_DROP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 1, toIdx: 0, packetKind: 'MALWARE_DROP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 3, toIdx: 4, packetKind: 'LATERAL_HOP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 3, toIdx: 5, packetKind: 'C2_EXFIL', curveOffset: 48, returnOffset: -48 },
        ],
        backboneLinks: [
          { id: 'bb-1', x1: 165, y1: 365, x2: 495, y2: 210, label: 'WAN TLS :443', linkType: 'WAN_TRUNK' },
          { id: 'bb-2', x1: 495, y1: 210, x2: 830, y2: 205, label: 'VLAN 20 Route', linkType: 'VLAN_TRUNK' },
          { id: 'bb-3', x1: 1055, y1: 535, x2: 1295, y2: 465, label: 'EDR Stream', linkType: 'SPAN_MIRROR' },
        ] };

    case 'ransomware-shadow-wipe':
      return {
        zones: [
          {
            id: 'EXTERNAL_ATTACKER',
            code: 'VLAN 15 · ADMIN RDP',
            title: 'BREACHED RDP JUMP-HOST (INITIAL ENTRY)',
            subtitle: 'Attacker Operator Console Pushing LockBit Binary',
            xStart: 18,
            xEnd: 315,
            yStart: 25,
            yEnd: 455,
            subnetBadge: 'VLAN 15 · 10.10.15.0/24',
            accentHex: '#E11D48',
            bgTintClass: 'bg-rose-500/5' },
          {
            id: 'PERIMETER_DELIVERY',
            code: 'CORE SW · SMB FABRIC',
            title: 'DATACENTER CORE SWITCH (SMB :445 / RPC)',
            subtitle: 'High-Throughput Storage & Server VLAN Distribution',
            xStart: 338,
            xEnd: 655,
            yStart: 155,
            yEnd: 625,
            subnetBadge: 'CORE-FAB · 10.10.0.254/16',
            accentHex: '#D97706',
            bgTintClass: 'bg-amber-500/5' },
          {
            id: 'ENDPOINT_LAPTOP_MALWARE',
            code: 'VLAN 50 · FILE SERVER',
            title: 'TARGET SERVER & LOCKBIT / VSSADMIN WIPE',
            subtitle: 'vssadmin delete shadows /all & AES+RSA Encryption',
            xStart: 678,
            xEnd: 1072,
            yStart: 20,
            yEnd: 585,
            subnetBadge: 'VLAN 50 · 10.10.50.0/24',
            accentHex: '#0284C7',
            bgTintClass: 'bg-sky-500/5' },
          {
            id: 'CORP_LATERAL_MOVEMENT',
            code: 'SAN & SOC · EID 7045',
            title: 'VOLUME SHADOW STORAGE (VSS) & SOC SIEM',
            subtitle: 'EventID 7045 Service Install & High-IOPS Ransomware Alert',
            xStart: 1095,
            xEnd: 1462,
            yStart: 95,
            yEnd: 632,
            subnetBadge: 'SAN-VLAN · 10.10.80.0/24',
            accentHex: '#7C3AED',
            bgTintClass: 'bg-violet-500/5' },
        ],
        nodeCoords: [
          { wx: 165, wy: 235 },
          {
            wx: 495,
            wy: 405,
            netIcon: 'CORE_SWITCH',
            netLabel: 'Datacenter Core Switch',
            netSublabel: '10.10.0.254 · SMB :445 Trunk',
            netBadge: 'NET-DEV ② · DC Core Switch' },
          { wx: 830, wy: 185 },
          { wx: 915, wy: 465 },
          { wx: 1235, wy: 205 },
          { wx: 1295, wy: 485 },
        ],
        routeChain: [
          { fromIdx: 0, toIdx: 1, packetKind: 'LATERAL_HOP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 1, toIdx: 2, packetKind: 'MALWARE_DROP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 2, toIdx: 3, packetKind: 'SYSCALL', curveOffset: -52, returnOffset: 52 },
          { fromIdx: 3, toIdx: 4, packetKind: 'SYSCALL', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 3, toIdx: 5, packetKind: 'C2_EXFIL', curveOffset: 48, returnOffset: -48 },
        ],
        backboneLinks: [
          { id: 'bb-1', x1: 165, y1: 235, x2: 495, y2: 405, label: 'VLAN 15 -> Core', linkType: 'VLAN_TRUNK' },
          { id: 'bb-2', x1: 495, y1: 405, x2: 830, y2: 185, label: 'SMB :445 Trunk', linkType: 'VLAN_TRUNK' },
          { id: 'bb-3', x1: 915, y1: 465, x2: 1235, y2: 205, label: 'VSS Block Bus', linkType: 'INTERNAL_BUS' },
          { id: 'bb-4', x1: 1055, y1: 540, x2: 1295, y2: 485, label: 'SPAN Mirror', linkType: 'SPAN_MIRROR' },
        ] };

    case 'process-hollowing':
    default:
      return {
        zones: NETWORK_ZONE_COLUMNS,
        nodeCoords: [
          { wx: 165, wy: 225 },
          {
            wx: 495,
            wy: 390,
            netIcon: 'FIREWALL_ROUTER',
            netLabel: 'Edge Firewall & Mail GW',
            netSublabel: '172.16.10.1 · NAT & SMTP/TLS',
            netBadge: 'NET-DEV ② · Edge Firewall & GW' },
          { wx: 830, wy: 185 },
          { wx: 915, wy: 465 },
          { wx: 1235, wy: 195 },
          { wx: 1295, wy: 475 },
        ],
        routeChain: [
          { fromIdx: 0, toIdx: 1, packetKind: 'EMAIL', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 1, toIdx: 2, packetKind: 'MALWARE_DROP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 2, toIdx: 3, packetKind: 'SYSCALL', curveOffset: -54, returnOffset: 54 },
          { fromIdx: 3, toIdx: 4, packetKind: 'LATERAL_HOP', curveOffset: -48, returnOffset: 48 },
          { fromIdx: 4, toIdx: 5, packetKind: 'C2_EXFIL', curveOffset: 52, returnOffset: -52 },
        ],
        backboneLinks: [
          { id: 'bb-1', x1: 165, y1: 225, x2: 495, y2: 390, label: 'WAN Uplinks (BGP)', linkType: 'WAN_TRUNK' },
          { id: 'bb-2', x1: 495, y1: 390, x2: 830, y2: 185, label: '802.1Q -> VLAN 20', linkType: 'VLAN_TRUNK' },
          { id: 'bb-3', x1: 830, y1: 185, x2: 1235, y2: 195, label: 'VLAN 10 Route', linkType: 'VLAN_TRUNK' },
          { id: 'bb-4', x1: 1055, y1: 535, x2: 1295, y2: 475, label: 'SPAN Mirror', linkType: 'SPAN_MIRROR' },
        ] };
  }
}

interface ScenarioNodeMeta {
  label: string;
  sublabel: string;
  actionBadge: string;
  hostContext: string;
  activitySummary: string;
}

function getScenarioNodeMetas(
  scenario: AttackScenario,
  c1: ScenarioTopologyBlueprint['nodeCoords'][1]
): [
  ScenarioNodeMeta,
  ScenarioNodeMeta,
  ScenarioNodeMeta,
  ScenarioNodeMeta,
  ScenarioNodeMeta,
  ScenarioNodeMeta
] {
  const gatewayMeta: ScenarioNodeMeta = {
    label: c1.netLabel,
    sublabel: c1.netSublabel,
    actionBadge: c1.netBadge,
    hostContext: `🛡️ Network Appliance: ${c1.netLabel} (${c1.netSublabel.split('·')[0].trim()})`,
    activitySummary: 'Activities: Packet Ingress, NAT/VLAN Routing & Deep Packet Inspection' };

  switch (scenario.id) {
    case 'log4shell-dfir':
      return [
        {
          label: 'Attacker Exploit & Scanner',
          sublabel: '91.214.124.88 · JNDI Injector',
          actionBadge: 'HOST ① · External Attacker (WAN)',
          hostContext: '🌐 External Host: Attacker Scanner (91.214.124.88 · Internet)',
          activitySummary: 'Activities: Sends crafted User-Agent with ${jndi:ldap://...} payload' },
        gatewayMeta,
        {
          label: 'Java App Server (app-prod-01)',
          sublabel: '10.20.1.15 · Ubuntu 22.04 LTS',
          actionBadge: 'HOST ③ · Java App Server (app-prod-01)',
          hostContext: '💻 Host System: Linux Server app-prod-01 (10.20.1.15) · Runs Node ④',
          activitySummary: 'Host Activities: Runs Spring Boot (PID 1420), JNDI lookup & /bin/bash shell' },
        {
          label: 'Java Log4j2 → /bin/bash Shell',
          sublabel: 'PID 1420 → 1894 (On app-prod-01)',
          actionBadge: 'PROCESS ④ · Exploit ON Server app-prod-01',
          hostContext: '📍 Running ON: Java Server app-prod-01 (Node ③) · Inside JVM PID 1420',
          activitySummary: 'Process Activity: Evaluates JNDI lookup, loads Exploit.class & spawns /bin/bash' },
        {
          label: 'Rogue LDAP & HTTP Class Server',
          sublabel: '91.214.124.88:1389 & :8888',
          actionBadge: 'SERVER ⑤ · Rogue LDAP & Stage2 Host',
          hostContext: '🗄️ Staging Server: Marshalsec LDAP (:1389) & HTTP (:8888)',
          activitySummary: 'Activities: Redirects JVM lookup to http://91.214.124.88:8888/Exploit.class' },
        {
          label: 'Linux Auditd & Elastic SIEM',
          sublabel: 'SYSCALL execve · Suricata IDS',
          actionBadge: 'APPLIANCE ⑥ · Auditd & SOC SIEM',
          hostContext: '📡 SOC Platform: Collects Nginx, Suricata & Auditd from app-prod-01',
          activitySummary: 'Activities: Correlates JNDI access.log entry with SYSCALL execve(/bin/bash)' },
      ];

    case 'ad-kerberoasting':
      return [
        {
          label: 'Foothold Session (CORP\\m.karimi)',
          sublabel: '10.10.20.45 · Standard Domain User',
          actionBadge: 'SESSION ① · Domain User Foothold',
          hostContext: '🔑 User Context: Standard Domain Session CORP\\m.karimi on VLAN 24',
          activitySummary: 'Activities: Queries Active Directory LDAP for Service Principal Names (SPNs)' },
        gatewayMeta,
        {
          label: 'Finance Workstation (WS-FINANCE-04)',
          sublabel: '10.10.20.45 · Windows 11 Enterprise',
          actionBadge: 'HOST ③ · Workstation (WS-FINANCE-04)',
          hostContext: '💻 Host System: Workstation WS-FINANCE-04 (10.10.20.45) · Runs Node ④',
          activitySummary: 'Host Activities: Runs PowerShell, executes Rubeus.exe & initiates SMB PtH' },
        {
          label: 'Rubeus.exe & Hashcat / PtH',
          sublabel: 'PID 3920 (On Host WS-FINANCE-04)',
          actionBadge: 'PROCESS ④ · Tooling ON WS-FINANCE-04',
          hostContext: '📍 Running ON: Workstation WS-FINANCE-04 (Node ③) · PID 3920 Memory',
          activitySummary: 'Process Activity: Requests RC4 TGS ticket (0x17), cracks hash & runs psexec' },
        {
          label: 'DC01 (KDC) & SQL01.corp.local',
          sublabel: '10.10.1.5 (:88) · 10.10.5.20 (:445)',
          actionBadge: 'SERVER ⑤ · Domain Controller & SQL01',
          hostContext: '🗄️ Tier-0 Servers: DC01.corp.local (KDC) & SQL01.corp.local (Target)',
          activitySummary: 'Activities: DC01 issues RC4 TGS (EID 4769); SQL01 accepts PtH admin logon (EID 4624/7045)' },
        {
          label: 'SIEM Log Collector (Splunk)',
          sublabel: 'Winlogbeat · EID 4769 / 4624 / 7045',
          actionBadge: 'APPLIANCE ⑥ · Windows SIEM Collector',
          hostContext: '📡 SOC Platform: Correlates Windows Security Events from DC01 & SQL01',
          activitySummary: 'Activities: Alerts on 0x17 RC4 encryption downgrade + lateral SMB service install' },
      ];

    case 'dns-tunneling-exfil':
      return [
        {
          label: 'Attacker Authoritative DNS C2',
          sublabel: 'ns1.badactor-dns.net (45.133.1.99:53)',
          actionBadge: 'HOST ① · Authoritative DNS C2 (WAN)',
          hostContext: '🌐 External System: Rogue Authoritative NameServer (45.133.1.99 · UDP/53)',
          activitySummary: 'Activities: Reassembles hex subdomains into customers_pii.csv & replies via TXT' },
        gatewayMeta,
        {
          label: 'Isolated Backup Host (DB-BACKUP-02)',
          sublabel: '10.50.1.12 · Restricted Database Server',
          actionBadge: 'HOST ③ · Backup Server (DB-BACKUP-02)',
          hostContext: '💻 Host System: Isolated Server DB-BACKUP-02 (10.50.1.12) · Runs Node ④',
          activitySummary: 'Host Activities: Blocked from direct web; runs sync_agent.exe querying internal DNS' },
        {
          label: 'sync_agent.exe (DNS Exfil Agent)',
          sublabel: 'PID 4412 (On Host DB-BACKUP-02)',
          actionBadge: 'PROCESS ④ · Malware ON DB-BACKUP-02',
          hostContext: '📍 Running ON: Backup Host DB-BACKUP-02 (Node ③) · PID 4412 Process',
          activitySummary: 'Process Activity: Reads customers_pii.csv & encodes chunks as <hex>.c2.badactor-dns.net' },
        {
          label: 'Egress Firewall (Direct Web Blocked)',
          sublabel: '10.50.1.1 · Drops TCP 80/443',
          actionBadge: 'APPLIANCE ⑤ · Strict Egress Firewall',
          hostContext: '🗄️ Perimeter Policy: Blocks DB-BACKUP-02 direct internet, allows DNS Resolver UDP/53',
          activitySummary: 'Activities: Drops direct TCP egress from Node ③ while permitting recursive DNS from Node ②' },
        {
          label: 'Zeek DNS NDR & Sysmon EID 22',
          sublabel: '10.10.99.20 · Shannon Entropy Detector',
          actionBadge: 'APPLIANCE ⑥ · Zeek NDR & SOC SIEM',
          hostContext: '📡 SOC Platform: Inspects Sysmon EID 22 on DB-BACKUP-02 & Zeek dns.log',
          activitySummary: 'Activities: Flags high subdomain entropy (>4.2 bits) & 100% cache-miss TXT flood' },
      ];

    case 'amsi-reflective-dll':
      return [
        {
          label: 'HTTPS Payload Stager & C2',
          sublabel: '185.199.108.42:443 · TLS 1.3 Stager',
          actionBadge: 'HOST ① · External HTTPS Stager (WAN)',
          hostContext: '🌐 External System: Attacker CDN Stager (185.199.108.42 · WAN)',
          activitySummary: 'Activities: Serves encrypted C2 agent DLL byte-array directly into memory' },
        gatewayMeta,
        {
          label: 'Admin Laptop Host (DEV-WKS-09)',
          sublabel: '10.10.4.55 · Windows 11 Workstation',
          actionBadge: 'HOST ③ · Admin Laptop (DEV-WKS-09)',
          hostContext: '💻 Host System: Admin Laptop DEV-WKS-09 (10.10.4.55) · Runs Node ④',
          activitySummary: 'Host Activities: Spawns hidden powershell.exe (PID 6120) & records ScriptBlock EID 4104' },
        {
          label: 'powershell.exe (AMSI Patch + DLL)',
          sublabel: 'PID 6120 RAM (On Laptop DEV-WKS-09)',
          actionBadge: 'PROCESS ④ · In-Memory ON DEV-WKS-09',
          hostContext: '📍 Running ON: Admin Laptop DEV-WKS-09 (Node ③) · PID 6120 Virtual Memory',
          activitySummary: 'Process Activity: Patches amsi.dll!AmsiScanBuffer (6 bytes) & maps Reflective PE in Heap' },
        {
          label: 'Reflective PE Heap & C2 Agent',
          sublabel: '0x024A80000 (RWX Unbacked Commit)',
          actionBadge: 'MEMORY ⑤ · Reflective DLL on DEV-WKS-09',
          hostContext: '🧠 Memory Region ON: Laptop DEV-WKS-09 ▸ Inside powershell.exe (0x024A80000)',
          activitySummary: 'Activities: Resolves IAT imports manually, applies relocations & calls DllMain()' },
        {
          label: 'PowerShell EID 4104 & EDR Scanner',
          sublabel: '10.10.99.10 · Memory Integrity Check',
          actionBadge: 'APPLIANCE ⑥ · EDR Memory & SIEM',
          hostContext: '📡 SOC Platform: Audits Laptop DEV-WKS-09 ScriptBlocks & amsi.dll .text hash',
          activitySummary: 'Activities: Detects modified amsi.dll prologue bytes & unbacked RWX thread execution' },
      ];

    case 'ransomware-shadow-wipe':
      return [
        {
          label: 'Breached Admin RDP Jump-Host',
          sublabel: '10.10.15.8 · Operator Console',
          actionBadge: 'HOST ① · Breached RDP Jump-Host',
          hostContext: '🌐 Source Host: Compromised Admin Jump-Host (10.10.15.8 · VLAN 15)',
          activitySummary: 'Activities: Pushes LockBit v3 payload over SMB to target file server' },
        gatewayMeta,
        {
          label: 'Target File Server (FILE-SRV-01)',
          sublabel: '10.10.50.15 · Windows Server 2022',
          actionBadge: 'HOST ③ · File Server (FILE-SRV-01)',
          hostContext: '💻 Host System: File Server FILE-SRV-01 (10.10.50.15) · Runs Node ④',
          activitySummary: 'Host Activities: Runs lb3_payload.exe, spawns vssadmin.exe & encrypts D:\\Shares' },
        {
          label: 'lb3_payload.exe → vssadmin.exe',
          sublabel: 'PID 5540 → 5812 (On FILE-SRV-01)',
          actionBadge: 'PROCESS ④ · Ransomware ON FILE-SRV-01',
          hostContext: '📍 Running ON: File Server FILE-SRV-01 (Node ③) · High-Integrity PID 5540',
          activitySummary: 'Process Activity: Creates Global Mutex, stops backup services & wipes Shadow Copies' },
        {
          label: 'NTFS Shares & VSS Shadow Storage',
          sublabel: 'D:\\Shares\\Finance\\* (On FILE-SRV-01)',
          actionBadge: 'STORAGE ⑤ · NTFS & VSS on FILE-SRV-01',
          hostContext: '🗄️ Storage Subsystem ON: File Server FILE-SRV-01 (D:\\Shares & VSS Snapshots)',
          activitySummary: 'Activities: Shadow snapshots deleted (T1490) & files renamed to *.lockbit via AES-NI' },
        {
          label: 'EDR Canary Guard & SOC SIEM',
          sublabel: 'Sysmon EID 1 (vssadmin) & EID 11',
          actionBadge: 'APPLIANCE ⑥ · Anti-Ransomware EDR & SIEM',
          hostContext: '📡 SOC Platform: Monitors FILE-SRV-01 Process Creation (EID 1) & File I/O (EID 11)',
          activitySummary: 'Activities: Triggers critical containment alert on vssadmin delete shadows & mass rename' },
      ];

    case 'process-hollowing':
    default:
      return [
        {
          label: 'Attacker Phishing & C2 Server',
          sublabel: '185.220.101.42:443 · Cobalt Strike',
          actionBadge: 'HOST ① · External C2 Server (WAN)',
          hostContext: '🌐 External System: Threat Actor C2 Host (185.220.101.42 · Internet)',
          activitySummary: 'Activities: Delivers Invoice_Q4.exe dropper & receives HTTPS Beacon callbacks' },
        gatewayMeta,
        {
          label: 'Victim Laptop (WKS-04)',
          sublabel: '10.10.4.15 · Windows 11 Endpoint',
          actionBadge: 'HOST ③ · Victim Laptop (WKS-04)',
          hostContext: '💻 Host System: Victim Laptop WKS-04 (10.10.4.15) · Runs Node ④',
          activitySummary: 'Host Activities: User runs Invoice_Q4.exe → spawns suspended svchost.exe on Laptop' },
        {
          label: 'Invoice_Q4.exe → svchost.exe',
          sublabel: 'PID 3104 → 4892 (On Laptop WKS-04)',
          actionBadge: 'PROCESS ④ · Malware ON Laptop WKS-04',
          hostContext: '📍 Running ON: Victim Laptop WKS-04 (Node ③) · User-Mode Memory',
          activitySummary: 'Process Activity: Unmaps svchost.exe memory, writes Beacon PE & resumes thread' },
        {
          label: 'Corp DC01 & Internal Shares',
          sublabel: '10.10.0.5 · SMB / Active Directory',
          actionBadge: 'SERVER ⑤ · Corp Domain Controller',
          hostContext: '🗄️ Internal Server: Corp DC01 (10.10.0.5 · VLAN 10 Core)',
          activitySummary: 'Activities: Reached by hollowed svchost.exe (PID 4892) running on Laptop WKS-04' },
        {
          label: 'SOC SIEM & Sysmon EDR Sensor',
          sublabel: 'Sysmon EID 1 / 10 / 25 · Zeek NDR',
          actionBadge: 'APPLIANCE ⑥ · SOC SIEM & EDR',
          hostContext: '📡 SOC Platform: Collects Sysmon EID 1/10/25 from Laptop WKS-04 & Firewall logs',
          activitySummary: 'Activities: Detects EID 25 (ProcessTampering) on svchost.exe inside Laptop WKS-04' },
      ];
  }
}

export function buildWhiteboardSchematic(
  scenario: AttackScenario,
  activeStageIndex: number,
  activeEnvironment: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): {
  zones: NetworkZoneColumn[];
  backboneLinks: NetworkBackboneLink[];
  nodes: WhiteboardSketchNode[];
  flows: WhiteboardSketchFlow[];
} {
  const srcNodes = scenario.nodes;
  const blueprint = getScenarioTopologyBlueprint(scenario);
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  const explicitAttacker =
    srcNodes.find(
      (n) =>
        n.role === 'attacker' &&
        !/dropper|invoice|ransom|lb3/i.test(n.id)
    ) || srcNodes.find((n) => n.role === 'attacker');
  const gatewayOrig =
    srcNodes.find(
      (n) => n.role === 'firewall_siem' || n.role === 'dns_resolver'
    ) ||
    srcNodes[1] ||
    srcNodes[0];
  const laptopOrig =
    srcNodes.find((n) => n.role === 'victim_host') ||
    srcNodes.find((n) => n.role === 'server') ||
    srcNodes.find((n) => n.role === 'process') ||
    srcNodes[0];
  const malwareOrig =
    srcNodes.find(
      (n) =>
        /dropper|loader|lockbit|lb3|amsi|beacon|invoice|sync_agent/i.test(
          n.id
        ) ||
        n.role === 'memory' ||
        (n.role === 'process' && n.id !== laptopOrig?.id)
    ) ||
    srcNodes[2] ||
    srcNodes[0];
  const lateralOrig =
    srcNodes.find(
      (n) => n.role === 'domain_controller' || n.role === 'server'
    ) ||
    srcNodes[srcNodes.length - 1] ||
    srcNodes[0];

  const [c0, c1, c2, c3, c4, c5] = blueprint.nodeCoords;
  const [m0, m1, m2, m3, m4, m5] = getScenarioNodeMetas(scenario, c1);

  // Environment-driven architectural adaptation for Zones, Node coordinates/icons/labels, and Backbone links
  let adaptedZones: NetworkZoneColumn[] = blueprint.zones;
  let adaptedBackboneLinks: NetworkBackboneLink[] = blueprint.backboneLinks;

  let node1Meta = { ...m1, iconType: c1.netIcon, wx: c1.wx, wy: c1.wy };
  let node2Meta = {
    ...m2,
    iconType: 'VICTIM_LAPTOP' as SketchIconType,
    wx: c2.wx,
    wy: c2.wy };
  let node3Meta = {
    ...m3,
    iconType: 'MALWARE_PAYLOAD' as SketchIconType,
    wx: c3.wx,
    wy: c3.wy };
  let node4Meta = {
    ...m4,
    iconType: 'LATERAL_SERVER' as SketchIconType,
    wx: c4.wx,
    wy: c4.wy };
  let node5Meta = {
    ...m5,
    iconType: 'SIEM_SENSOR' as SketchIconType,
    wx: c5.wx,
    wy: c5.wy };

  if (activeEnvironment === 'SERVER') {
    adaptedZones = [
      {
        ...blueprint.zones[0],
        code: 'WAN / ORIGIN · TIER-0',
        subnetBadge: 'ORIGIN · 185.220.101.0/24',
        yStart: 28,
        yEnd: 440 },
      {
        ...blueprint.zones[1],
        code: 'CORE SW · AD FABRIC',
        title: 'DATACENTER CORE SWITCH & RPC/SMB FABRIC',
        subtitle: 'East-West Tier-0 VLAN 10 Trunk (:88 Kerberos / :445 SMB / :135 RPC)',
        subnetBadge: 'DC-CORE · 10.10.0.254/16',
        accentHex: '#D97706',
        yStart: 105,
        yEnd: 615 },
      {
        ...blueprint.zones[2],
        code: 'VLAN 10 · DOMAIN CONTROLLER',
        title: 'TIER-0 DOMAIN CONTROLLER ZONE (CORP-DC01)',
        subtitle: 'Active Environment: Windows Server 2022 AD DS · KDC, LSASS & Server Processes',
        subnetBadge: 'VLAN 10 · 10.10.0.5/24 (DC01)',
        accentHex: '#7C3AED',
        bgTintClass: 'bg-violet-500/5',
        yStart: 16,
        yEnd: 608 },
      {
        ...blueprint.zones[3],
        code: 'AD VAULT & SOC SIEM',
        title: 'NTDS.DIT CREDENTIAL VAULT & AD SIEM SENSOR',
        subtitle: 'Monitors EID 4769 / 4624 / 7045 / Sysmon Server Telemetry on CORP-DC01',
        subnetBadge: 'SOC-TIER0 · 10.10.99.5/24',
        accentHex: '#0284C7',
        yStart: 52,
        yEnd: 632 },
    ];

    node1Meta = {
      iconType: 'CORE_SWITCH',
      label: 'DC Core Switch & RPC Fabric',
      sublabel: '10.10.0.254 · Kerberos :88 & SMB :445',
      actionBadge: 'NET-DEV ② · DC Core Switch',
      hostContext: '🛡️ Datacenter Fabric: Core L3 Switch (10.10.0.254 · Tier-0 Trunk)',
      activitySummary: `Activities: [ENV:SERVER/CORP-DC01] Routes SMB/RPC & Kerberos traffic into Domain Controller VLAN 10`,
      wx: 492,
      wy: 360 };

    node2Meta = {
      iconType: 'LATERAL_SERVER',
      label: 'Domain Controller (CORP-DC01)',
      sublabel: '10.10.0.5 · Windows Server 2022 AD DS',
      actionBadge: 'SERVER ③ · Domain Controller (CORP-DC01)',
      hostContext: '🗄️ Active Host [Domain Controller]: CORP-DC01.corp.local (10.10.0.5 · Runs Node ④)',
      activitySummary: `Server Activities [ENV:SERVER/CORP-DC01]: ${m2.activitySummary.replace(/^Host Activities:\s*/i, '')}`,
      wx: 785,
      wy: 175 };

    const procShortName = m3.label.split('→')[0].trim();
    node3Meta = {
      iconType: 'KERNEL_MEMORY',
      label: `${procShortName} → lsass/svchost (DC01)`,
      sublabel: 'PID 4892 · Tier-0 Server Memory (On CORP-DC01)',
      actionBadge: 'PROCESS ④ · Malware ON Domain Controller DC01',
      hostContext: '📍 Running ON: Domain Controller CORP-DC01 (Node ③) · ENV:SERVER/CORP-DC01',
      activitySummary: `Process Activity [Domain Controller]: ${m3.activitySummary.replace(/^Process Activity:\s*/i, '')}`,
      wx: 965,
      wy: 465 };

    node4Meta = {
      iconType: 'CREDENTIAL_VAULT',
      label: 'NTDS.dit AD Vault & SYSVOL',
      sublabel: '10.10.0.5 · Tier-0 Directory Database',
      actionBadge: 'VAULT ⑤ · NTDS.dit & Tier-0 AD Store',
      hostContext: '🔐 Tier-0 Asset on CORP-DC01: Active Directory NTDS.dit & Domain Kerberos Keys',
      activitySummary: 'Activities [ENV:SERVER/CORP-DC01]: Targeted by privileged process on CORP-DC01 for credential/replication access',
      wx: 1210,
      wy: 200 };

    node5Meta = {
      iconType: 'SIEM_SENSOR',
      label: 'AD SIEM & Defender for Identity',
      sublabel: 'WinSec EID 4769/4624/7045 · ENV:SERVER',
      actionBadge: 'APPLIANCE ⑥ · Tier-0 Server SIEM & EDR',
      hostContext: '📡 SOC Platform [Domain Controller Scope]: Collects AD DS, WinSec & Sysmon logs from CORP-DC01',
      activitySummary: `Activities [ENV:SERVER/CORP-DC01]: ${m5.activitySummary.replace(/^Activities:\s*/i, '')}`,
      wx: 1355,
      wy: 475 };

    adaptedBackboneLinks = [
      { id: 'bb-1', x1: c0.wx, y1: c0.wy, x2: node1Meta.wx, y2: node1Meta.wy, label: 'Ingress -> DC Core', linkType: 'WAN_TRUNK' },
      { id: 'bb-2', x1: node1Meta.wx, y1: node1Meta.wy, x2: node2Meta.wx, y2: node2Meta.wy, label: 'VLAN 10 Tier-0 Trunk', linkType: 'VLAN_TRUNK' },
      { id: 'bb-3', x1: node2Meta.wx, y1: node2Meta.wy, x2: node4Meta.wx, y2: node4Meta.wy, label: 'NTDS / KDC Bus', linkType: 'INTERNAL_BUS' },
      { id: 'bb-4', x1: node1Meta.wx, y1: node1Meta.wy, x2: node5Meta.wx, y2: node5Meta.wy, label: 'AD Audit Stream', linkType: 'SPAN_MIRROR' },
    ];
  } else if (activeEnvironment === 'CLOUD') {
    adaptedZones = [
      {
        ...blueprint.zones[0],
        code: 'WAN · EXTERNAL API',
        title: 'EXTERNAL THREAT & CLOUD API CALLER',
        subtitle: 'Untrusted Internet Origin Targeting Cloud Ingress & Workloads',
        subnetBadge: 'PUBLIC-WAN · 185.220.101.0/24',
        yStart: 36,
        yEnd: 445 },
      {
        ...blueprint.zones[1],
        code: 'CLOUD · ALB & WAF',
        title: 'CLOUD EDGE WAF & AWS ALB INGRESS',
        subtitle: 'TLS 1.3 Termination, Kubernetes Ingress & VPC Security Group',
        subnetBadge: 'VPC-INGRESS · 172.31.1.0/24',
        accentHex: '#0D9488',
        bgTintClass: 'bg-teal-500/5',
        yStart: 100,
        yEnd: 615 },
      {
        ...blueprint.zones[2],
        code: 'AWS EKS · WORKLOAD VPC',
        title: 'CLOUD ENVIRONMENT WORKLOAD (EKS POD & CONTAINER)',
        subtitle: 'Active Environment: eks-prod-node-01 · Containerd Runtime & eBPF Namespace',
        subnetBadge: 'VPC 172.31.16.0/20 · EKS Pod',
        accentHex: '#059669',
        bgTintClass: 'bg-emerald-500/5',
        yStart: 18,
        yEnd: 605 },
      {
        ...blueprint.zones[3],
        code: 'IAM & CLOUDWATCH SOC',
        title: 'AWS IAM CONTROL PLANE, S3 & GUARDDUTY SIEM',
        subtitle: 'IMDSv2 Role Credentials, S3 Buckets & CloudTrail / Falco eBPF Alerts',
        subnetBadge: 'IAM-STS · 169.254.169.254 / S3',
        accentHex: '#0284C7',
        yStart: 58,
        yEnd: 632 },
    ];

    node1Meta = {
      iconType: 'WAF_REVERSE_PROXY',
      label: 'Cloud WAF & AWS ALB Ingress',
      sublabel: 'alb-prod-01 · VPC Security Group :443',
      actionBadge: 'CLOUD-GW ② · AWS ALB & WAF Ingress',
      hostContext: '🛡️ Cloud Perimeter: AWS Application Load Balancer & WAF (172.31.1.10 · VPC Ingress)',
      activitySummary: 'Activities [ENV:CLOUD/AWS-EKS-VPC]: Terminates TLS & forwards ingress traffic to EKS Workload Pod',
      wx: 492,
      wy: 350 };

    node2Meta = {
      iconType: 'LATERAL_SERVER',
      label: 'Cloud Workload Pod (eks-prod-01)',
      sublabel: '172.31.16.40 · AWS EKS Container Node',
      actionBadge: 'CLOUD POD ③ · eks-prod-node-01 (VPC)',
      hostContext: '☁️ Active Host [Cloud Environment]: eks-prod-node-01.aws.internal (172.31.16.40 · Runs Node ④)',
      activitySummary: `Cloud Pod Activities [ENV:CLOUD/AWS-EKS-VPC]: ${m2.activitySummary.replace(/^Host Activities:\s*/i, '')}`,
      wx: 795,
      wy: 215 };

    const procShortName = m3.label.split('→')[0].trim();
    node3Meta = {
      iconType: 'PROCESS_THREAD',
      label: `${procShortName} (Container Runtime)`,
      sublabel: 'Containerd PID 4892 (On eks-prod-01)',
      actionBadge: 'CONTAINER ④ · Payload ON Cloud Pod eks-prod-01',
      hostContext: '📍 Running ON: Cloud Workload Pod eks-prod-01 (Node ③) · ENV:CLOUD/AWS-EKS-VPC',
      activitySummary: `Container Activity [Cloud Environment]: ${m3.activitySummary.replace(/^Process Activity:\s*/i, '')}`,
      wx: 970,
      wy: 445 };

    node4Meta = {
      iconType: 'CREDENTIAL_VAULT',
      label: 'AWS IAM Role (IMDSv2) & S3 Vault',
      sublabel: '169.254.169.254 · s3://corp-prod-vault',
      actionBadge: 'CLOUD IAM ⑤ · IMDSv2 STS & S3 Bucket',
      hostContext: '☁️ Cloud Control Plane: AWS IAM STS Metadata (169.254.169.254) & Production S3 Bucket',
      activitySummary: 'Activities [ENV:CLOUD/AWS-EKS-VPC]: Reached from compromised EKS container for IAM token & S3 access',
      wx: 1210,
      wy: 220 };

    node5Meta = {
      iconType: 'SIEM_SENSOR',
      label: 'CloudTrail, GuardDuty & Falco eBPF',
      sublabel: 'GuardDuty Findings · Falco Runtime · ENV:CLOUD',
      actionBadge: 'CLOUD SOC ⑥ · GuardDuty & Falco SIEM',
      hostContext: '📡 Cloud SOC Platform [Cloud Environment]: Collects Falco eBPF syscalls, VPC Flow Logs & CloudTrail',
      activitySummary: `Activities [ENV:CLOUD/AWS-EKS-VPC]: ${m5.activitySummary.replace(/^Activities:\s*/i, '')}`,
      wx: 1355,
      wy: 475 };

    adaptedBackboneLinks = [
      { id: 'bb-1', x1: c0.wx, y1: c0.wy, x2: node1Meta.wx, y2: node1Meta.wy, label: 'Internet -> AWS ALB', linkType: 'WAN_TRUNK' },
      { id: 'bb-2', x1: node1Meta.wx, y1: node1Meta.wy, x2: node2Meta.wx, y2: node2Meta.wy, label: 'VPC CNI -> EKS Pod', linkType: 'VLAN_TRUNK' },
      { id: 'bb-3', x1: node2Meta.wx, y1: node2Meta.wy, x2: node4Meta.wx, y2: node4Meta.wy, label: 'IMDSv2 / S3 Endpoint', linkType: 'INTERNAL_BUS' },
      { id: 'bb-4', x1: node1Meta.wx, y1: node1Meta.wy, x2: node5Meta.wx, y2: node5Meta.wy, label: 'CloudWatch / GuardDuty', linkType: 'SPAN_MIRROR' },
    ];
  } else {
    // WORKSTATION (Default): Ensure explicit active environment tag is included on host/process summaries
    node2Meta = {
      ...node2Meta,
      activitySummary: `${m2.activitySummary} [${envProfile.telemetryTag}]` };
    node3Meta = {
      ...node3Meta,
      activitySummary: `${m3.activitySummary} [${envProfile.telemetryTag}]` };
  }

  const sketchNodes: WhiteboardSketchNode[] = [
    {
      id: explicitAttacker ? explicitAttacker.id : 'threat_actor_c2_node',
      originalNode: explicitAttacker || srcNodes[0],
      zoneId: 'EXTERNAL_ATTACKER',
      archetype: 'PACKET_AND_GATEWAY',
      chainOrder: 1,
      iconType: 'ATTACKER',
      label: m0.label,
      sublabel: m0.sublabel,
      actionBadge: m0.actionBadge,
      hostContext: m0.hostContext,
      activitySummary: m0.activitySummary,
      activeEnvironmentId: activeEnvironment,
      activeEnvironmentTag: envProfile.telemetryTag,
      wx: c0.wx,
      wy: c0.wy,
      isCompromised: true,
      isActive: activeStageIndex === 0 || activeStageIndex === 1 },
    {
      id: 'phishing_delivery_gateway',
      originalNode: gatewayOrig,
      zoneId: 'PERIMETER_DELIVERY',
      archetype: 'PACKET_AND_GATEWAY',
      chainOrder: 2,
      iconType: node1Meta.iconType,
      label: node1Meta.label,
      sublabel: node1Meta.sublabel,
      actionBadge: node1Meta.actionBadge,
      hostContext: node1Meta.hostContext,
      activitySummary: node1Meta.activitySummary,
      activeEnvironmentId: activeEnvironment,
      activeEnvironmentTag: envProfile.telemetryTag,
      wx: node1Meta.wx,
      wy: node1Meta.wy,
      isCompromised: false,
      isActive: activeStageIndex === 0 || activeStageIndex <= 2,
      isNetworkDevice: true },
    {
      id: 'victim_laptop_node',
      originalNode: laptopOrig,
      zoneId: 'ENDPOINT_LAPTOP_MALWARE',
      archetype: 'LAPTOP_HOST_ACTIVITY',
      chainOrder: 3,
      iconType: node2Meta.iconType,
      label: node2Meta.label,
      sublabel: node2Meta.sublabel,
      actionBadge: node2Meta.actionBadge,
      hostContext: node2Meta.hostContext,
      activitySummary: node2Meta.activitySummary,
      activeEnvironmentId: activeEnvironment,
      activeEnvironmentTag: envProfile.telemetryTag,
      companionHostOrProcessNodeId: 'malware_sandbox_node',
      wx: node2Meta.wx,
      wy: node2Meta.wy,
      isCompromised: true,
      isActive: true },
    {
      id: 'malware_sandbox_node',
      originalNode: malwareOrig,
      zoneId: 'ENDPOINT_LAPTOP_MALWARE',
      archetype: 'MALWARE_PROCESSES',
      chainOrder: 4,
      iconType: node3Meta.iconType,
      label: node3Meta.label,
      sublabel: node3Meta.sublabel,
      actionBadge: node3Meta.actionBadge,
      hostContext: node3Meta.hostContext,
      activitySummary: node3Meta.activitySummary,
      activeEnvironmentId: activeEnvironment,
      activeEnvironmentTag: envProfile.telemetryTag,
      companionHostOrProcessNodeId: 'victim_laptop_node',
      wx: node3Meta.wx,
      wy: node3Meta.wy,
      isCompromised: true,
      isActive: activeStageIndex === 0 || activeStageIndex >= 2 },
    {
      id: 'lateral_target_server',
      originalNode: lateralOrig,
      zoneId: 'CORP_LATERAL_MOVEMENT',
      archetype: 'LATERAL_MOVEMENT',
      chainOrder: 5,
      iconType: node4Meta.iconType,
      label: node4Meta.label,
      sublabel: node4Meta.sublabel,
      actionBadge: node4Meta.actionBadge,
      hostContext: node4Meta.hostContext,
      activitySummary: node4Meta.activitySummary,
      activeEnvironmentId: activeEnvironment,
      activeEnvironmentTag: envProfile.telemetryTag,
      wx: node4Meta.wx,
      wy: node4Meta.wy,
      isCompromised: activeStageIndex === 0 || activeStageIndex >= 3,
      isActive: activeStageIndex === 0 || activeStageIndex >= 3 },
    {
      id: 'siem_sensor_node',
      originalNode: gatewayOrig,
      zoneId: 'CORP_LATERAL_MOVEMENT',
      archetype: 'PACKET_AND_GATEWAY',
      chainOrder: 6,
      iconType: node5Meta.iconType,
      label: node5Meta.label,
      sublabel: node5Meta.sublabel,
      actionBadge: node5Meta.actionBadge,
      hostContext: node5Meta.hostContext,
      activitySummary: node5Meta.activitySummary,
      activeEnvironmentId: activeEnvironment,
      activeEnvironmentTag: envProfile.telemetryTag,
      wx: node5Meta.wx,
      wy: node5Meta.wy,
      isCompromised: false,
      isActive: true },
  ];

  const routeChain = blueprint.routeChain;

  const flows: WhiteboardSketchFlow[] = scenario.telemetry.map((rawEv, idx) => {
    const ev = tagTelemetryEventWithEnvironment(rawEv, activeEnvironment);
    const nextRaw = scenario.telemetry[idx + 1];
    const nextEv = nextRaw
      ? tagTelemetryEventWithEnvironment(nextRaw, activeEnvironment)
      : undefined;
    const template = routeChain[idx % routeChain.length];
    const pairCycle = Math.floor(idx / routeChain.length);
    const stagger = pairCycle * 14;

    const fromNode = sketchNodes[template.fromIdx];
    const toNode = sketchNodes[template.toIdx];

    const isCurrentStep =
      activeStageIndex > 0 ? ev.stageIndex === activeStageIndex : idx === 0;
    const isVisible =
      activeStageIndex === 0 || ev.stageIndex <= activeStageIndex;

    return createBidirectionalFlowGeometry({
      id: ev.id,
      stepNo: ev.no,
      stageIndex: ev.stageIndex,
      fromNode,
      toNode,
      curveOffset:
        template.curveOffset + (template.curveOffset >= 0 ? stagger : -stagger),
      returnOffset:
        template.returnOffset +
        (template.returnOffset >= 0 ? stagger : -stagger),
      packetKind: template.packetKind,
      telemetryEvent: ev,
      nextEvent: nextEv,
      isCurrentStep,
      isVisible });
  });

  const numberedBackboneLinks: NetworkBackboneLink[] =
    adaptedBackboneLinks.map((bl, bIdx) => ({
      ...bl,
      sequenceCode: bl.sequenceCode || `L${bIdx + 1}` }));

  const numberedNodes: WhiteboardSketchNode[] = sketchNodes.map((nd) => ({
    ...nd,
    sequenceCode: nd.sequenceCode || `${nd.chainOrder}` }));

  return {
    zones: adaptedZones,
    backboneLinks: numberedBackboneLinks,
    nodes: numberedNodes,
    flows };
}

export function getStageLocationContext(
  scenario: AttackScenario,
  nodes: WhiteboardSketchNode[],
  flows: WhiteboardSketchFlow[],
  activeStageIndex: number,
  activeEnvironment: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): StageLocationContext {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const hostNode =
    nodes.find((n) => n.id === 'victim_laptop_node') || nodes[2] || nodes[0];
  const processNode =
    nodes.find((n) => n.id === 'malware_sandbox_node') || nodes[3] || nodes[0];

  if (activeStageIndex <= 0) {
    return {
      activeEnvironment,
      environmentBadge: envProfile.badgeLabel,
      environmentTag: envProfile.telemetryTag,
      scopeBadge: `${envProfile.badgeLabel.toUpperCase()} · ${envProfile.telemetryTag}`,
      currentSystemLabel: `Target Host: ${hostNode.label} (${hostNode.sublabel})`,
      currentProcessOrComponentLabel: `Process on Host ③: ${processNode.label}`,
      whereWeAreSummary: `[${envProfile.badgeLabel}] Node ④ (${processNode.label}) is running inside Host ③ (${hostNode.label}). Click Host ③ for OS/System activities, or Process ④ for in-memory syscalls.`,
      activeHostNodeId: hostNode.id,
      activeProcessNodeId: processNode.id };
  }

  const stageObj =
    scenario.stages.find((s) => s.index === activeStageIndex) ||
    scenario.stages[0];
  const activeFlow =
    flows.find((f) => f.stageIndex === activeStageIndex) || flows[0];
  const fromNode =
    nodes.find((n) => n.id === activeFlow?.fromNodeId) || hostNode;
  const toNode =
    nodes.find((n) => n.id === activeFlow?.toNodeId) || processNode;

  const involvesEndpointProcess =
    fromNode.id === 'malware_sandbox_node' ||
    toNode.id === 'malware_sandbox_node';
  const involvesEndpointHost =
    involvesEndpointProcess ||
    fromNode.id === 'victim_laptop_node' ||
    toNode.id === 'victim_laptop_node';

  const systemTextEn = involvesEndpointHost
    ? `On System: ${hostNode.label} (${hostNode.sublabel.split('·')[0].trim()})`
    : `Active System: ${fromNode.label} → ${toNode.label}`;

  const processTextEn = involvesEndpointProcess
    ? `Inside Process: ${processNode.label} (Running on ${hostNode.label})`
    : `Active Component: ${toNode.label}`;

  const whereTextEn = `[${envProfile.telemetryTag}] ${activeFlow ? `#${activeFlow.forwardSeq}→ ${activeFlow.label}` : stageObj?.title || ''} — Executing between ${fromNode.label} and ${toNode.label}.`;

  return {
    activeEnvironment,
    environmentBadge: envProfile.badgeLabel,
    environmentTag: envProfile.telemetryTag,
    scopeBadge: `STAGE S${activeStageIndex} · ${envProfile.badgeLabel.toUpperCase()}`,
    currentSystemLabel: systemTextEn,
    currentProcessOrComponentLabel: processTextEn,
    whereWeAreSummary: whereTextEn,
    activeHostNodeId: hostNode.id,
    activeProcessNodeId: processNode.id };
}

export { buildEntityDrillDownData } from './sketch-drilldown-builder';
export {
  buildInternalNodeSubBoard,
  type InternalSubBoardSchematic } from './internal-node-board-builder';

