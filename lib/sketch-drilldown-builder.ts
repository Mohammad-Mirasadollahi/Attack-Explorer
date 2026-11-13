import { AttackScenario } from './attack-scenarios';
import {
  EntityDrillDownData,
  WhiteboardSketchNode } from './sketch-zones-and-drilldown';

/**
 * Generates deep drill-down data when the user clicks on Malware, Laptop, Lateral Movement Server, or Gateway.
 */
export function buildEntityDrillDownData(
  scenario: AttackScenario,
  sketchNode: WhiteboardSketchNode
): EntityDrillDownData {
  const stageMemoryAddresses = [
    '0x00400000 (PEB ImageBaseAddress)',
    '0x0000024A80000000 (MEM_COMMIT | PAGE_EXECUTE_READWRITE)',
    '0x00007FF81A240880 (Thread Context RIP / EntryPoint)',
    '0x0000024A80014000 (Injected Beacon Heap & Socket Buffer)',
  ];

  const malwareProcesses: EntityDrillDownData['malwareProcesses'] = [
    {
      step: 1,
      apiOrProcess: 'Phishing Dropper -> CreateProcessW(CREATE_SUSPENDED)',
      target: `${scenario.processTree[1]?.name || 'Invoice_Q4.exe'} (PID ${scenario.processTree[1]?.pid || 3104})`,
      memoryAddress: '0x00400000 (PEB Base)',
      status: 'EXECUTED' as const,
      detail: 'Malware binary unpacked from email attachment and spawns legitimate target container in suspended state.' },
    ...scenario.stages.map((stage, idx) => ({
      step: idx + 2,
      apiOrProcess:
        stage.keySpecs[0]?.value ||
        `${stage.mitreTechniqueName} (${stage.mitreTechniqueId})`,
      target: `${stage.title} (${stage.mitreTechniqueId})`,
      memoryAddress:
        stageMemoryAddresses[idx % stageMemoryAddresses.length],
      status: idx >= 1 ? ('INJECTED' as const) : ('EXECUTED' as const),
      detail: stage.description })),
  ];

  const laptopHostActivities: EntityDrillDownData['laptopHostActivities'] = [
    {
      category: 'EMAIL_OPEN',
      title: '1. User Opens Phishing Email Attachment on Laptop',
      artifactPath:
        'C:\\Users\\s.ahmadi\\AppData\\Local\\Temp\\Invoice_Q4.pdf.exe',
      eventIdBadge: 'Sysmon EID 11 (FileCreate)',
      description: 'Outlook/Browser writes the disguised attachment to disk in the user Temp/Downloads folder.' },
    {
      category: 'PROCESS_SPAWN',
      title: '2. Suspicious Child Process Creation on Host',
      artifactPath:
        scenario.processTree[scenario.processTree.length - 1]?.commandLine ||
        'C:\\Windows\\System32\\svchost.exe',
      eventIdBadge: 'Sysmon EID 1 & WinSec EID 4688',
      description: 'Process creation logged simultaneously in Sysmon Event ID 1 and Windows Security Event ID 4688 with abnormal parent process.' },
    {
      category: 'MEMORY_TAMPER',
      title: '3. Cross-Process Memory Injection & Tampering',
      artifactPath: 'ntdll.dll!NtUnmapViewOfSection + VirtualAllocEx(RWX)',
      eventIdBadge: 'Sysmon EID 10 & EID 25',
      description: 'Malware modifies virtual memory inside the host process and redirects thread execution.' },
    {
      category: 'REGISTRY_NET',
      title: '4. Local Credential Harvest & Outbound Socket',
      artifactPath: 'LSASS / Kerberos Ticket Cache -> TCP 445 / 443',
      eventIdBadge: 'Sysmon EID 3 & WinSec 4624',
      description: 'Compromised laptop initiates internal lateral scanning and outbound C2 beacon traffic.' },
  ];

  const lateralMovementHops: EntityDrillDownData['lateralMovementHops'] = [
    {
      hop: 1,
      sourceHost: '10.10.4.22 (Victim Laptop WKS-04)',
      targetHost: '10.10.0.5 (CORP-DC01.corp.local)',
      protocol: 'Kerberos TCP/88 & LDAP/389',
      technique: 'T1558.003 · SPN Discovery & Ticket Request',
      eventId: 'WinSec EID 4769 (0x17 RC4)',
      summary: 'From the compromised laptop, the attacker queries Active Directory and requests service tickets to pivot across the domain.' },
    {
      hop: 2,
      sourceHost: '10.10.4.22 (Victim Laptop WKS-04)',
      targetHost: '10.10.2.14 (SQL-PROD-01 / App Server)',
      protocol: 'SMB2 TCP/445 · NTLM Pass-the-Hash',
      technique: 'T1550.002 · Lateral Movement via SMB',
      eventId: 'WinSec EID 4624 (LogonType=3)',
      summary: 'Attacker authenticates laterally over SMB to the internal server using extracted hashes/tickets.' },
    {
      hop: 3,
      sourceHost: '10.10.2.14 (Internal Server)',
      targetHost: 'SCM / Remote Service Execution',
      protocol: 'DCERPC / SVCCTL (Service Control)',
      technique: 'T1569.002 · Remote Service Creation',
      eventId: 'System EID 7045 & Sysmon EID 1',
      summary: 'A remote service payload is installed and executed on the target server, completing domain compromise.' },
  ];

  const packets: EntityDrillDownData['packets'] = scenario.telemetry.map(
    (ev) => ({
      id: ev.id,
      timestamp: ev.timestamp,
      protocol: ev.protocolOrEventId,
      src: ev.sourceLabel,
      dst: ev.targetLabel,
      flagsOrSize: ev.sizeOrCode,
      payloadPreview: ev.info,
      event: ev })
  );

  return {
    nodeId: sketchNode.id,
    nodeLabel: sketchNode.label,
    nodeSublabel: sketchNode.sublabel,
    archetype: sketchNode.archetype,
    headline: sketchNode.actionBadge,
    summary:
      sketchNode.originalNode?.details.description || scenario.overview,
    malwareProcesses,
    laptopHostActivities,
    lateralMovementHops,
    packets };
}
