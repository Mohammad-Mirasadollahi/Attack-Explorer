
export type AttackCategory =
  | 'ALL'
  | 'MALWARE'
  | 'LOG_ANALYSIS'
  | 'NETWORK_WEB'
  | 'ACTIVE_DIRECTORY';

export type TelemetrySourceType =
  | 'SYSMON'
  | 'WIN_EVENT'
  | 'WIN32_API'
  | 'NETWORK'
  | 'IDS_ALERT'
  | 'LINUX_AUDIT'
  | 'MEMORY_SCAN';

export type NodeRole =
  | 'attacker'
  | 'victim_host'
  | 'process'
  | 'memory'
  | 'server'
  | 'domain_controller'
  | 'firewall_siem'
  | 'dns_resolver';


export interface DiagramNode {
  id: string;
  label: string;
  sublabel: string;
  role: NodeRole;
  x: number;
  y: number;
  details: {
    osOrType: string;
    pidOrPort?: string;
    privilege?: string;
    artifacts: string[];
    description: string;
  };
}

export interface ProcessMemoryBlock {
  address: string;
  section: string;
  permissions: 'R--' | 'RW-' | 'R-X' | 'RWX';
  size: string;
  status: 'clean' | 'unmapped' | 'injected' | 'patched' | 'shellcode';
  description: string;
  hexPreview: string;
}

export interface ProcessTreeNode {
  pid: number;
  ppid: number;
  name: string;
  commandLine: string;
  user: string;
  integrity: 'Low' | 'Medium' | 'High' | 'SYSTEM';
  status: 'normal' | 'suspicious' | 'hollowed' | 'injected' | 'malicious';
  activeFromStage: number;
  apiCalls: string[];
  memoryBlocks?: ProcessMemoryBlock[];
}

export interface TelemetryEvent {
  id: string;
  no: number;
  stageIndex: number;
  timestamp: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceLabel: string;
  targetLabel: string;
  sourceType: TelemetrySourceType;
  protocolOrEventId: string;
  shortAction: string;
  info: string;
  sizeOrCode: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitreId: string;
  explanation: string;
  rawLog: string;
  detectionRule: {
    type: 'SIGMA' | 'YARA' | 'SURICATA' | 'KQL';
    title: string;
    ruleCode: string;
    mitigation: string;
  };
}

export interface AttackStage {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  mitreTacticPhase: number;
  mitreTechniqueId: string;
  mitreTechniqueName: string;
  activeNodeIds: string[];
  compromisedNodeIds: string[];
  keySpecs: Array<{
    term: string;
    value: string;
  }>;
}

export interface AttackScenario {
  id: string;
  code: string;
  name: string;
  shortSubtitle: string;
  category: Exclude<AttackCategory, 'ALL'>;
  severity: 'HIGH' | 'CRITICAL';
  primaryMitrePhase: number;
  overview: string;
  specs: Array<{
    term: string;
    value: string;
  }>;
  nodes: DiagramNode[];
  processTree: ProcessTreeNode[];
  stages: AttackStage[];
  telemetry: TelemetryEvent[];
}

export const MITRE_PHASES: Array<{
  phase: number;
  shortName: string;
  fullName: string;
}> = [
  {
    phase: 1,
    shortName: 'INITIAL ACCESS',
    fullName: '1. Reconnaissance & Initial Access' },
  {
    phase: 2,
    shortName: 'EXECUTION',
    fullName: '2. Execution' },
  {
    phase: 3,
    shortName: 'PERSISTENCE',
    fullName: '3. Persistence & Privilege Escalation' },
  {
    phase: 4,
    shortName: 'DEFENSE EVASION',
    fullName: '4. Defense Evasion & Process Injection' },
  {
    phase: 5,
    shortName: 'CREDENTIAL ACCESS',
    fullName: '5. Credential Access & Discovery' },
  {
    phase: 6,
    shortName: 'LATERAL & C2',
    fullName: '6. Lateral Movement & Command/Control' },
  {
    phase: 7,
    shortName: 'EXFIL & IMPACT',
    fullName: '7. Exfiltration & Impact' },
];
