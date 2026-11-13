import {
  ATTACK_SCENARIOS,
  AttackCategory,
  AttackScenario,
  AttackStage,
  TelemetryEvent,
  TelemetrySourceType } from './attack-scenarios';

export type ActiveEnvironmentId = 'WORKSTATION' | 'SERVER' | 'CLOUD';

export const DEFAULT_ACTIVE_ENVIRONMENT: ActiveEnvironmentId = 'WORKSTATION';

export interface ActiveEnvironmentProfile {
  id: ActiveEnvironmentId;
  shortLabel: string;
  badgeLabel: string;
  fullTitle: string;
  hostname: string;
  primaryHostname: string;
  ipSubnet: string;
  subnetBadge: string;
  osOrPlatform: string;
  osSummary: string;
  telemetryTag: string;
  environmentTag: string;
  logCollectorLabel: string;
  accentHex: string;
  architectureCode: string;
  architectureHeadline: string;
  architectureDescription: string;
}

export const ACTIVE_ENVIRONMENT_PROFILES: Record<
  ActiveEnvironmentId,
  ActiveEnvironmentProfile
> = {
  WORKSTATION: {
    id: 'WORKSTATION',
    shortLabel: 'Workstation',
    badgeLabel: 'Target Workstation',
    fullTitle: 'Target Workstation (WKS-04 · Windows 11 Endpoint)',
    hostname: 'WKS-04.corp.local',
    primaryHostname: 'WKS-04.corp.local',
    ipSubnet: '10.10.4.15 · VLAN 20',
    subnetBadge: '10.10.4.15 · VLAN 20',
    osOrPlatform: 'Windows 11 Enterprise 23H2 (Endpoint)',
    osSummary: 'Windows 11 Enterprise 23H2 (Endpoint)',
    telemetryTag: 'ENV:WORKSTATION/WKS-04',
    environmentTag: 'ENV:WORKSTATION/WKS-04',
    logCollectorLabel: 'Sysmon EID / WinSec Endpoint',
    accentHex: '#0284C7',
    architectureCode: 'ARCH-WKS-VLAN20',
    architectureHeadline: 'ARCHITECTURE: TARGET WORKSTATION (VLAN 20 ENDPOINT)',
    architectureDescription: 'Endpoint Access VLAN 20 (WKS-04) executing user-mode process & memory syscalls monitored by Sysmon EDR.' },
  SERVER: {
    id: 'SERVER',
    shortLabel: 'Server',
    badgeLabel: 'Domain Controller',
    fullTitle: 'Domain Controller (CORP-DC01 · Windows Server 2022 AD DS)',
    hostname: 'CORP-DC01.corp.local',
    primaryHostname: 'CORP-DC01.corp.local',
    ipSubnet: '10.10.0.5 · VLAN 10 Tier-0',
    subnetBadge: '10.10.0.5 · VLAN 10 Tier-0',
    osOrPlatform: 'Windows Server 2022 Datacenter (AD DS / KDC)',
    osSummary: 'Windows Server 2022 Datacenter (AD DS / KDC)',
    telemetryTag: 'ENV:SERVER/CORP-DC01',
    environmentTag: 'ENV:SERVER/CORP-DC01',
    logCollectorLabel: 'AD-DS KDC / WinSec Server Audit',
    accentHex: '#7C3AED',
    architectureCode: 'ARCH-DC01-TIER0',
    architectureHeadline: 'ARCHITECTURE: TIER-0 DOMAIN CONTROLLER & CORE SERVER (VLAN 10)',
    architectureDescription: 'Datacenter Core Switch routing SMB/Kerberos (:88/:445) to Tier-0 Domain Controller CORP-DC01 & NTDS.dit vault.' },
  CLOUD: {
    id: 'CLOUD',
    shortLabel: 'Cloud',
    badgeLabel: 'Cloud Environment',
    fullTitle: 'Cloud Environment (eks-prod-01 · AWS VPC & Kubernetes Cluster)',
    hostname: 'eks-prod-node-01.aws.internal',
    primaryHostname: 'eks-prod-node-01.aws.internal',
    ipSubnet: '172.31.16.40 · VPC prod-us-east-1',
    subnetBadge: '172.31.16.40 · VPC prod-us-east-1',
    osOrPlatform: 'AWS EKS Container Runtime & IAM Control Plane',
    osSummary: 'AWS EKS Container Runtime & IAM Control Plane',
    telemetryTag: 'ENV:CLOUD/AWS-EKS-VPC',
    environmentTag: 'ENV:CLOUD/AWS-EKS-VPC',
    logCollectorLabel: 'CloudTrail / GuardDuty & Falco eBPF',
    accentHex: '#059669',
    architectureCode: 'ARCH-CLOUD-VPC-EKS',
    architectureHeadline: 'ARCHITECTURE: CLOUD ENVIRONMENT (AWS VPC · EKS POD & IAM)',
    architectureDescription: 'Cloud ALB/WAF ingress into VPC Kubernetes Pod (eks-prod-01), container runtime execution & IAM IMDSv2/S3 plane.' } };

export const ACTIVE_ENVIRONMENT_LIST: ActiveEnvironmentProfile[] = [
  ACTIVE_ENVIRONMENT_PROFILES.WORKSTATION,
  ACTIVE_ENVIRONMENT_PROFILES.SERVER,
  ACTIVE_ENVIRONMENT_PROFILES.CLOUD,
];

export function getActiveEnvironmentProfile(
  envId: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): ActiveEnvironmentProfile {
  return (
    ACTIVE_ENVIRONMENT_PROFILES[envId] ||
    ACTIVE_ENVIRONMENT_PROFILES.WORKSTATION
  );
}

export interface TaggedTelemetryEvent extends TelemetryEvent {
  activeEnvironmentId: ActiveEnvironmentId;
  activeEnvironmentBadge: string;
  activeEnvironmentTag: string;
  activeEnvironmentHost: string;
  activeEnvironmentIpSubnet: string;
  environmentTaggedInfo: string;
}

export function tagTelemetryEventWithEnvironment(
  event: TelemetryEvent,
  envId: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): TaggedTelemetryEvent {
  const profile = getActiveEnvironmentProfile(envId);
  return {
    ...event,
    activeEnvironmentId: profile.id,
    activeEnvironmentBadge: profile.badgeLabel,
    activeEnvironmentTag: profile.telemetryTag,
    activeEnvironmentHost: profile.hostname,
    activeEnvironmentIpSubnet: profile.ipSubnet,
    environmentTaggedInfo: `[${profile.badgeLabel} · ${profile.telemetryTag}] ${event.info}` };
}

export function tagTelemetryListWithEnvironment(
  events: TelemetryEvent[],
  envId: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): TaggedTelemetryEvent[] {
  return events.map((ev) => tagTelemetryEventWithEnvironment(ev, envId));
}

export interface SimulationState {
  scenarioId: string;
  activeStageIndex: number; // 0 = Overview (all stages), 1..N = specific stage
  selectedTelemetryId: string | null;
  selectedNodeId: string | null;
  telemetryFilter: TelemetrySourceType | 'ALL';
  activeEnvironment: ActiveEnvironmentId;
}

export interface ComputedStageView {
  scenario: AttackScenario;
  currentStage: AttackStage | null; // null when activeStageIndex === 0
  activeMitrePhase: number;
  activeEnvironment: ActiveEnvironmentId;
  environmentProfile: ActiveEnvironmentProfile;
  visibleTelemetry: TaggedTelemetryEvent[];
  activeNodeIds: Set<string>;
  compromisedNodeIds: Set<string>;
  activeEdges: Array<{
    from: string;
    to: string;
    event: TaggedTelemetryEvent;
    isCurrentStepEdge: boolean;
  }>;
}

export type ScenarioSortOption =
  | 'DEFAULT'
  | 'NAME_ASC'
  | 'STAGES_DESC'
  | 'STAGES_ASC'
  | 'MITRE_CODE';

export type ScenarioGroupByMode = 'CATEGORY' | 'MITRE_PHASE' | 'FLAT';

export interface CategorizedScenarioGroup {
  groupKey: string;
  label: string;
  scenarios: AttackScenario[];
}

export function clampPanelDimension(
  value: number,
  min: number,
  max: number
): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function filterScenarios(
  scenarios: AttackScenario[],
  category: AttackCategory,
  searchQuery: string
): AttackScenario[] {
  const q = searchQuery.trim().toLowerCase();
  return scenarios.filter((sc) => {
    if (category !== 'ALL') {
      if (category === 'ACTIVE_DIRECTORY') {
        if (
          sc.category !== 'ACTIVE_DIRECTORY' &&
          sc.category !== 'NETWORK_WEB'
        ) {
          return false;
        }
      } else if (sc.category !== category) {
        return false;
      }
    }
    if (!q) return true;
    const haystacks = [
      sc.id,
      sc.code,
      sc.name,
      sc.shortSubtitle,
      sc.overview,
      ...sc.specs.map((s) => s.value),
      ...sc.stages.map(
        (st) => `${st.mitreTechniqueId} ${st.mitreTechniqueName} ${st.title}`
      ),
      ...sc.telemetry.map((t) => `${t.protocolOrEventId} ${t.info} ${t.mitreId}`),
    ];
    return haystacks.some((h) => h.toLowerCase().includes(q));
  });
}

export function sortScenarios(
  scenarios: AttackScenario[],
  sortBy: ScenarioSortOption
): AttackScenario[] {
  const copy = [...scenarios];
  switch (sortBy) {
    case 'NAME_ASC':
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    case 'STAGES_DESC':
      return copy.sort(
        (a, b) =>
          b.stages.length - a.stages.length ||
          a.name.localeCompare(b.name)
      );
    case 'STAGES_ASC':
      return copy.sort(
        (a, b) =>
          a.stages.length - b.stages.length ||
          a.name.localeCompare(b.name)
      );
    case 'MITRE_CODE':
      return copy.sort((a, b) => a.code.localeCompare(b.code));
    case 'DEFAULT':
    default:
      return copy;
  }
}

const CATEGORY_GROUP_META: Record<string, { label: string; order: number }> = {
  MALWARE: { label: 'Malware & Process Execution', order: 1 },
  LOG_ANALYSIS: { label: 'DFIR & Log Forensics', order: 2 },
  ACTIVE_DIRECTORY: { label: 'Active Directory & Identity', order: 3 },
  NETWORK_WEB: { label: 'Network & C2 Exfiltration', order: 4 },
};

function getMitreTacticGroupMeta(phase: number): {
  key: string;
  label: string;
  order: number;
} {
  if (phase <= 2) {
    return {
      key: 'INITIAL_EXECUTION',
      label: 'Initial Access & Execution',
      order: 1,
    };
  }
  if (phase <= 5) {
    return {
      key: 'EVASION_PRIVILEGE',
      label: 'Defense Evasion & Injection',
      order: 2,
    };
  }
  if (phase <= 8) {
    return {
      key: 'CREDENTIAL_LATERAL',
      label: 'Credential Access & Lateral',
      order: 3,
    };
  }
  return {
    key: 'C2_EXFIL_IMPACT',
    label: 'C2, Exfiltration & Impact',
    order: 4,
  };
}

export function categorizeScenarios(
  scenarios: AttackScenario[],
  groupBy: ScenarioGroupByMode
): CategorizedScenarioGroup[] {
  if (groupBy === 'FLAT') {
    return [
      {
        groupKey: 'ALL',
        label: 'All Scenarios',
        scenarios },
    ];
  }

  if (groupBy === 'MITRE_PHASE') {
    const map = new Map<
      string,
      { label: string; order: number; list: AttackScenario[] }
    >();
    for (const sc of scenarios) {
      const meta = getMitreTacticGroupMeta(sc.primaryMitrePhase);
      const existing = map.get(meta.key);
      if (existing) {
        existing.list.push(sc);
      } else {
        map.set(meta.key, {
          label: meta.label,
          order: meta.order,
          list: [sc],
        });
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => a[1].order - b[1].order)
      .map(([groupKey, val]) => ({
        groupKey,
        label: val.label,
        scenarios: val.list }));
  }

  // Default: 'CATEGORY'
  const map = new Map<
    string,
    { label: string; order: number; list: AttackScenario[] }
  >();
  for (const sc of scenarios) {
    const meta = CATEGORY_GROUP_META[sc.category] || {
      label: sc.category,
      order: 99,
    };
    const existing = map.get(sc.category);
    if (existing) {
      existing.list.push(sc);
    } else {
      map.set(sc.category, {
        label: meta.label,
        order: meta.order,
        list: [sc],
      });
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => a[1].order - b[1].order)
    .map(([groupKey, val]) => ({
      groupKey,
      label: val.label,
      scenarios: val.list }));
}

export function stepForward(scenario: AttackScenario, currentStageIndex: number): number {
  if (currentStageIndex < scenario.stages.length) {
    return currentStageIndex + 1;
  }
  return scenario.stages.length;
}

export function stepBackward(currentStageIndex: number): number {
  if (currentStageIndex > 0) {
    return currentStageIndex - 1;
  }
  return 0;
}

export function computeStageView(
  scenario: AttackScenario,
  activeStageIndex: number,
  telemetryFilter: TelemetrySourceType | 'ALL' = 'ALL',
  activeEnvironment: ActiveEnvironmentId = DEFAULT_ACTIVE_ENVIRONMENT
): ComputedStageView {
  const clampedStageIndex = Math.max(0, Math.min(activeStageIndex, scenario.stages.length));
  const currentStage =
    clampedStageIndex === 0
      ? null
      : scenario.stages.find((s) => s.index === clampedStageIndex) || null;

  const activeMitrePhase = currentStage
    ? currentStage.mitreTacticPhase
    : scenario.primaryMitrePhase;

  const environmentProfile = getActiveEnvironmentProfile(activeEnvironment);

  // In Overview (stage 0), show all telemetry events.
  // In Step 1..N, show telemetry events up to and including the current stage!
  const stageFilteredTelemetry = tagTelemetryListWithEnvironment(
    clampedStageIndex === 0
      ? scenario.telemetry
      : scenario.telemetry.filter((t) => t.stageIndex <= clampedStageIndex),
    activeEnvironment
  );

  const visibleTelemetry =
    telemetryFilter === 'ALL'
      ? stageFilteredTelemetry
      : stageFilteredTelemetry.filter((t) => t.sourceType === telemetryFilter);

  const activeNodeIds = new Set<string>();
  const compromisedNodeIds = new Set<string>();

  if (clampedStageIndex === 0) {
    scenario.nodes.forEach((n) => activeNodeIds.add(n.id));
    scenario.stages.forEach((st) =>
      st.compromisedNodeIds.forEach((id) => compromisedNodeIds.add(id))
    );
  } else if (currentStage) {
    currentStage.activeNodeIds.forEach((id) => activeNodeIds.add(id));
    currentStage.compromisedNodeIds.forEach((id) => compromisedNodeIds.add(id));
  }

  const activeEdges = stageFilteredTelemetry.map((ev) => ({
    from: ev.sourceNodeId,
    to: ev.targetNodeId,
    event: ev,
    isCurrentStepEdge: clampedStageIndex === 0 || ev.stageIndex === clampedStageIndex }));

  return {
    scenario,
    currentStage,
    activeMitrePhase,
    activeEnvironment,
    environmentProfile,
    visibleTelemetry,
    activeNodeIds,
    compromisedNodeIds,
    activeEdges };
}

export interface LogAnalysisFinding {
  title: string;
  mitreId: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  matchedPattern: string;
  explanation: string;
  recommendedScenarioId: string;
}

export function analyzeCustomLogInput(rawText: string): LogAnalysisFinding[] {
  const text = rawText.trim();
  if (!text) return [];

  const findings: LogAnalysisFinding[] = [];

  if (
    /NtUnmapViewOfSection|WriteProcessMemory|CREATE_SUSPENDED|EventID>25|Image is replaced|0x1fffff/i.test(
      text
    )
  ) {
    findings.push({
      title: 'Process Hollowing & Cross-Process Memory Tampering Detected',
      mitreId: 'T1055.012',
      severity: 'CRITICAL',
      matchedPattern: 'NtUnmapViewOfSection / WriteProcessMemory / Sysmon EID 25',
      explanation: 'Presence of memory unmapping APIs or Sysmon Event ID 10/25 indicates a legitimate process container is being hollowed out and injected with malicious code.',
      recommendedScenarioId: 'process-hollowing' });
  }

  if (/\$\{.*jndi:|ldap:\/\/|Exploit\.class|CAFEBABE/i.test(text)) {
    findings.push({
      title: 'Log4Shell JNDI Injection Exploit Signature (CVE-2021-44228)',
      mitreId: 'T1190',
      severity: 'CRITICAL',
      matchedPattern: '${jndi:ldap://...} / Remote Java Class Loading',
      explanation: 'JNDI lookup tokens in HTTP headers or outbound LDAP connections from a Java process indicate active CVE-2021-44228 exploitation.',
      recommendedScenarioId: 'log4shell-dfir' });
  }

  if (/AmsiScanBuffer|amsi\.dll|0xB8,\s*0x57,\s*0x00,\s*0x07,\s*0x80|ReflectiveLoader|EventID>4104/i.test(text)) {
    findings.push({
      title: 'In-Memory AMSI Patching & Fileless PowerShell Execution',
      mitreId: 'T1562.001',
      severity: 'CRITICAL',
      matchedPattern: 'AmsiScanBuffer / VirtualProtect / 0x80070057 Patch',
      explanation: 'The script modifies memory permissions on amsi.dll!AmsiScanBuffer to return E_INVALIDARG and blind Windows Defender before reflective loading.',
      recommendedScenarioId: 'amsi-reflective-dll' });
  }

  if (/4769|0x17|RC4|kerberoast|PSEXESVC|7045|NtLmSsp/i.test(text)) {
    findings.push({
      title: 'Active Directory Kerberoasting (0x17) / Lateral Movement Detected',
      mitreId: 'T1558.003',
      severity: 'HIGH',
      matchedPattern: 'Event ID 4769 (0x17 RC4) / Event ID 4624 / 7045',
      explanation: 'Kerberos TGS requests downgraded to RC4-HMAC (0x17) or remote service installation via SCM indicate Active Directory credential harvesting and lateral movement.',
      recommendedScenarioId: 'ad-kerberoasting' });
  }

  if (/vssadmin.*delete\s+shadows|shadowcopy\s+delete|Restore-My-Files|\.lockbit|recoveryenabled\s+No/i.test(text)) {
    findings.push({
      title: 'Ransomware Pre-Encryption Behavior: Volume Shadow Copy Deletion',
      mitreId: 'T1490',
      severity: 'CRITICAL',
      matchedPattern: 'vssadmin delete shadows /all /quiet',
      explanation: 'Deleting Volume Shadow Copies via vssadmin or WMI is a high-confidence ransomware precursor prior to mass file encryption.',
      recommendedScenarioId: 'ransomware-shadow-wipe' });
  }

  if (/EventID>22|badactor-dns|[a-f0-9]{24 }\./i.test(text)) {
    findings.push({
      title: 'High-Entropy Subdomain DNS Tunneling & Exfiltration',
      mitreId: 'T1071.004',
      severity: 'HIGH',
      matchedPattern: 'Hex/Base64 Subdomain > 24 Chars in DNS Query',
      explanation: 'Long hexadecimal subdomain labels in DNS TXT/A queries indicate covert data exfiltration or C2 tunneling over port 53.',
      recommendedScenarioId: 'dns-tunneling-exfil' });
  }

  if (findings.length === 0) {
    findings.push({
      title: 'General Security Telemetry Inspection',
      mitreId: 'T1059',
      severity: 'MEDIUM',
      matchedPattern: `Custom Input (${text.length} chars)`,
      explanation: 'No known critical exploit signature matched directly; select any scenario in the explorer to compare expected Sysmon and network telemetry.',
      recommendedScenarioId: ATTACK_SCENARIOS[0].id });
  }

  return findings;
}

export const DEFAULT_PLAYBACK_SPEED = 0.5;
export const PLAYBACK_SPEED_OPTIONS = [0.5, 1, 2] as const;

export function cyclePlaybackSpeed(currentSpeed: number): number {
  const idx = PLAYBACK_SPEED_OPTIONS.findIndex((s) => s === currentSpeed);
  if (idx === -1) return DEFAULT_PLAYBACK_SPEED;
  return PLAYBACK_SPEED_OPTIONS[(idx + 1) % PLAYBACK_SPEED_OPTIONS.length];
}

