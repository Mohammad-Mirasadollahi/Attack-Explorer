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

  const malwareProcesses: EntityDrillDownData['malwareProcesses'] =
    scenario.stages.map((stage, idx) => {
      const stageEv =
        scenario.telemetry.find((t) => t.stageIndex === stage.index) ||
        scenario.telemetry[idx] ||
        null;
      const proc =
        scenario.processTree.find((p) => p.activeFromStage === stage.index) ||
        scenario.processTree[Math.min(idx, Math.max(0, scenario.processTree.length - 1))] ||
        null;

      const apiOrProcess = stageEv
        ? `${stageEv.shortAction} · ${stageEv.protocolOrEventId}`
        : stage.keySpecs[0]?.value ||
          `${stage.mitreTechniqueName} (${stage.mitreTechniqueId})`;

      const target = proc
        ? `${proc.name} (PID ${proc.pid}) · ${stage.title} (${stage.mitreTechniqueId})`
        : stageEv
        ? `${stageEv.targetLabel} · ${stage.title} (${stage.mitreTechniqueId})`
        : `${stage.title} (${stage.mitreTechniqueId})`;

      const memoryAddress =
        stage.keySpecs.find((k) =>
          /addr|base|rip|rcx|entrypoint|memory|offset|rwx|handle|section|size|ioc|hash/i.test(
            k.term
          )
        )?.value ||
        stageEv?.sizeOrCode ||
        stageMemoryAddresses[idx % stageMemoryAddresses.length];

      return {
        step: stage.index,
        apiOrProcess,
        target,
        memoryAddress,
        status: idx >= 1 ? ('INJECTED' as const) : ('EXECUTED' as const),
        detail: stage.description,
      };
    });

  const primaryProc = scenario.processTree[0];
  const secondaryProc =
    scenario.processTree[scenario.processTree.length - 1] || primaryProc;
  const firstEv = scenario.telemetry[0];
  const lastEv =
    scenario.telemetry[scenario.telemetry.length - 1] || firstEv;

  const laptopHostActivities: EntityDrillDownData['laptopHostActivities'] = [
    {
      category: 'EMAIL_OPEN',
      title: `1. Initial Delivery & Stage-1 Trigger (${scenario.stages[0]?.mitreTechniqueId || scenario.code})`,
      artifactPath:
        primaryProc?.commandLine ||
        firstEv?.info ||
        'C:\\Users\\Public\\Downloads\\Invoice_Q4.exe',
      eventIdBadge: firstEv?.protocolOrEventId || 'Sysmon EID 1 / EID 11',
      description:
        scenario.stages[0]?.description ||
        'Initial payload delivery and execution on the target host or perimeter service.',
    },
    {
      category: 'PROCESS_SPAWN',
      title: `2. Process / Execution Context on Host`,
      artifactPath:
        secondaryProc?.commandLine ||
        'C:\\Windows\\System32\\svchost.exe',
      eventIdBadge:
        scenario.telemetry[1]?.protocolOrEventId ||
        'Sysmon EID 1 & WinSec EID 4688',
      description:
        scenario.stages[1]?.description ||
        'Process creation and execution lineage logged with parent-child process telemetry and command-line arguments.',
    },
    {
      category: 'MEMORY_TAMPER',
      title: `3. Memory / Credential / Subsystem Manipulation`,
      artifactPath:
        secondaryProc?.apiCalls?.join(' -> ') ||
        'ntdll.dll!NtUnmapViewOfSection + VirtualAllocEx(RWX)',
      eventIdBadge:
        scenario.telemetry[2]?.protocolOrEventId ||
        'Sysmon EID 10 & EID 25',
      description:
        scenario.stages[2]?.description ||
        'In-memory payload staging, credential access, or defense-evasion tampering inside the target process.',
    },
    {
      category: 'REGISTRY_NET',
      title: `4. Post-Exploitation Persistence, Lateral Relay, or C2 Egress`,
      artifactPath:
        lastEv
          ? `${lastEv.sourceLabel} -> ${lastEv.targetLabel} (${lastEv.shortAction})`
          : 'LSASS / Kerberos Ticket Cache -> TCP 445 / 443',
      eventIdBadge:
        lastEv?.protocolOrEventId || 'Sysmon EID 3 & WinSec 4624',
      description:
        scenario.stages[scenario.stages.length - 1]?.description ||
        'Compromised endpoint establishes outbound C2 communications or lateral movement across the internal network.',
    },
  ];

  const lateralMovementHops: EntityDrillDownData['lateralMovementHops'] =
    scenario.stages.slice(0, 3).map((st, idx) => {
      const ev =
        scenario.telemetry.find((t) => t.stageIndex === st.index) ||
        scenario.telemetry[idx] ||
        firstEv;
      return {
        hop: idx + 1,
        sourceHost: ev?.sourceLabel || scenario.nodes[0]?.label || 'Origin Host',
        targetHost:
          ev?.targetLabel ||
          scenario.nodes[Math.min(idx + 1, scenario.nodes.length - 1)]?.label ||
          'Target Host',
        protocol: ev?.protocolOrEventId || 'TCP / Internal Protocol',
        technique: `${st.mitreTechniqueId} · ${st.mitreTechniqueName}`,
        eventId: `${ev?.protocolOrEventId || st.mitreTechniqueId} (${ev?.sizeOrCode || 'OK'})`,
        summary: st.description,
      };
    });

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
  };
}
