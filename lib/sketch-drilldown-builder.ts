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
    '0x00400000 (PEB ImageBaseAddress — why: initial executable base address mapped in RAM so the loader knows where the target binary starts)',
    '0x0000024A80000000 (MEM_COMMIT | PAGE_EXECUTE_READWRITE — why: unbacked private RWX memory page allocated so shellcode can be written and executed directly in RAM)',
    '0x00007FF81A240880 (Thread Context RIP / EntryPoint — why: CPU instruction register redirected so the thread jumps into the injected payload)',
    '0x0000024A80014000 (Injected Beacon Heap & Socket Buffer — why: in-memory C2 staging buffer inside the trusted host process)',
  ];

  const allMemBlocks = (scenario.processTree || []).flatMap((p) =>
    (p.memoryBlocks || []).map((mb) => ({ ...mb, procName: p.name, procPid: p.pid }))
  );

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

      const baseApi = stageEv
        ? `${stageEv.shortAction} · ${stageEv.protocolOrEventId}`
        : stage.keySpecs[0]?.value ||
          `${stage.mitreTechniqueName} (${stage.mitreTechniqueId})`;

      let apiWhy = `(why used in Step #${stage.index}: executes ${stage.mitreTechniqueName} [${stage.mitreTechniqueId}] to advance ${stage.title.toLowerCase()})`;
      if (/CreateProcess.*0x4|CREATE_SUSPENDED/i.test(baseApi + ' ' + stage.subtitle)) {
        apiWhy = `(why CreateProcessW with 0x4: launches the legitimate Windows binary frozen at thread creation before its entry point runs so its memory can be hollowed out safely)`;
      } else if (/NtUnmapViewOfSection|UNMAP/i.test(baseApi + ' ' + stage.title)) {
        apiWhy = `(why NtUnmapViewOfSection: strips the original signed Microsoft code from 0x00400000 so the malicious PE can occupy that exact base address)`;
      } else if (/VirtualAlloc|WriteProcessMemory|EID 10|INJECT/i.test(baseApi + ' ' + stage.title)) {
        apiWhy = `(why VirtualAllocEx + WriteProcessMemory: reserves RWX [0x40] private RAM and copies the unpacked MZ/PE payload directly into the target process without touching disk)`;
      } else if (/SetThreadContext|ResumeThread|EID 25|THREAD/i.test(baseApi + ' ' + stage.title)) {
        apiWhy = `(why SetThreadContext + ResumeThread: repoints CPU register RCX to the injected entry point [0x004014A0] and unfreezes the thread to run the implant)`;
      } else if (/HTTPS|EID 3|C2|BEACON/i.test(baseApi + ' ' + stage.title)) {
        apiWhy = `(why outbound HTTPS from hollowed process: initiates TLS C2 traffic from inside the trusted process identity so host firewalls permit the connection)`;
      } else if (/AmsiScanBuffer|VirtualProtect|AMSI/i.test(baseApi + ' ' + stage.title)) {
        apiWhy = `(why VirtualProtect + patch: unlocks the read-only amsi.dll code page in RAM to overwrite AmsiScanBuffer’s prologue with E_INVALIDARG so Defender is blinded)`;
      }

      const apiOrProcess = /\(why/i.test(baseApi)
        ? baseApi
        : `${baseApi} ${apiWhy}`;

      const procWhy = proc
        ? proc.status === 'hollowed'
          ? `why ${proc.name} PID ${proc.pid}: Microsoft-signed host binary hollowed in RAM so the implant inherits a trusted system PID`
          : proc.status === 'injected'
          ? `why ${proc.name} PID ${proc.pid}: legitimate ${proc.integrity}-integrity host process whose virtual memory is used to run foreign code without launching an untrusted .exe`
          : `why ${proc.name} PID ${proc.pid}: ${proc.status} process (${proc.integrity} integrity) orchestrating ${stage.title} (${stage.mitreTechniqueId})`
        : `why targeted: active execution target for ${stage.title} (${stage.mitreTechniqueId})`;

      const target = proc
        ? `${proc.name} (PID ${proc.pid} — ${procWhy})`
        : stageEv
        ? `${stageEv.targetLabel} (${procWhy})`
        : `${stage.title} (${procWhy})`;

      const matchedSpec = stage.keySpecs.find((k) =>
        /addr|base|rip|rcx|entrypoint|memory|offset|rwx|handle|section|size|flags|ioc|hash/i.test(
          k.term
        )
      );
      const matchedMemBlock = allMemBlocks[idx] || allMemBlocks[0] || null;
      const rawMemAddr =
        matchedSpec?.value ||
        (matchedMemBlock
          ? `${matchedMemBlock.address} · ${matchedMemBlock.section} [${matchedMemBlock.permissions}]`
          : null) ||
        stageEv?.sizeOrCode ||
        stageMemoryAddresses[idx % stageMemoryAddresses.length];

      let memWhy = `(why this memory state in Step #${stage.index}: reflects ${matchedSpec?.term || 'virtual memory / execution context'} during ${stage.title})`;
      if (/0x00000004|CREATE_SUSPENDED|PID 4892/i.test(rawMemAddr + ' ' + stage.subtitle) && stage.index === 1) {
        memWhy = `(why 0x00400000 & CREATE_SUSPENDED = 0x4: kernel maps svchost.exe at base 0x00400000 and freezes its main thread at RtlUserThreadStart before any instruction runs so the loader can safely replace its RAM)`;
      } else if (/0x00400000/i.test(rawMemAddr) && stage.index === 2) {
        memWhy = `(why 0x00400000 PEB+0x10 ImageBaseAddress: NtUnmapViewOfSection unmaps the legitimate svchost.exe binary at 0x00400000 so the hollowed address slot can be reused without breaking internal PE relocations)`;
      } else if (/264 KB|RWX|0x40|PAGE_EXECUTE_READWRITE/i.test(rawMemAddr + ' ' + stage.description)) {
        memWhy = `(why 0x00400000 · 264 KB RWX [0x40]: VirtualAllocEx reserves writable+executable private RAM at the hollowed base address so the Cobalt Strike MZ/PE headers and .text section can be written and executed in place)`;
      } else if (/0x004014A0|RCX|EID 25|EntryPoint/i.test(rawMemAddr + ' ' + stage.description)) {
        memWhy = `(why RCX = 0x004014A0 [Base 0x00400000 + RVA 0x14A0]: x64 suspended threads store their startup address in RCX, so overwriting RCX redirects ResumeThread straight into the injected Beacon entry point)`;
      } else if (stage.index === 5 && /hollowing/i.test(scenario.id)) {
        memWhy = `(why 0x00401000 .text Beacon Heap & WinHTTP Buffer: outbound TLS 1.3 C2 beacon executes from inside svchost.exe’s hollowed memory space so host firewalls see a trusted Windows binary)`;
      } else if (matchedMemBlock) {
        memWhy = `(why ${matchedMemBlock.address} [${matchedMemBlock.permissions}, ${matchedMemBlock.size}]: ${matchedMemBlock.status} region in ${matchedMemBlock.procName} PID ${matchedMemBlock.procPid} used to stage or execute code directly in RAM without dropping files to disk)`;
      }

      const memoryAddress = /\(why/i.test(rawMemAddr)
        ? rawMemAddr
        : `${rawMemAddr} ${memWhy}`;

      const rawDetail = stage.description || '';
      const enrichedDetail = /\(why\b/i.test(rawDetail)
        ? rawDetail
        : `${rawDetail} (why Step #${stage.index} mutates memory/process state: ${apiWhy.replace(/^\(|\)$/g, '')}; ${memWhy.replace(/^\(|\)$/g, '')}).`;

      return {
        step: stage.index,
        apiOrProcess,
        target,
        memoryAddress,
        status: idx >= 1 ? ('INJECTED' as const) : ('EXECUTED' as const),
        detail: enrichedDetail,
      };
    });

  const primaryProc = scenario.processTree[0];
  const secondaryProc =
    scenario.processTree[scenario.processTree.length - 1] || primaryProc;
  const firstEv = scenario.telemetry[0];
  const lastEv =
    scenario.telemetry[scenario.telemetry.length - 1] || firstEv;

  const ensureHostWhy = (text: string, fallbackWhy: string): string =>
    /\(why\b/i.test(text) ? text : `${text} (${fallbackWhy}).`;

  const laptopHostActivities: EntityDrillDownData['laptopHostActivities'] = [
    {
      category: 'EMAIL_OPEN',
      title: `1. Initial Delivery & Stage-1 Trigger (${scenario.stages[0]?.mitreTechniqueId || scenario.code})`,
      artifactPath:
        primaryProc?.commandLine ||
        firstEv?.info ||
        'C:\\Users\\Public\\Downloads\\Invoice_Q4.exe',
      eventIdBadge: firstEv?.protocolOrEventId || 'Sysmon EID 1 / EID 11',
      description: ensureHostWhy(
        scenario.stages[0]?.description ||
          'Initial payload delivery and execution on the target host or perimeter service.',
        `why Step #1 delivery matters: establishes initial execution foothold on the host so the stage-1 loader can begin process or memory preparation`
      ),
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
      description: ensureHostWhy(
        scenario.stages[1]?.description ||
          'Process creation and execution lineage logged with parent-child process telemetry and command-line arguments.',
        `why Step #2 process lineage matters: parent-to-child process creation [PPID → PID] prepares the target process container in RAM before code injection or tampering`
      ),
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
      description: ensureHostWhy(
        scenario.stages[2]?.description ||
          'In-memory payload staging, credential access, or defense-evasion tampering inside the target process.',
        `why Step #3 memory manipulation happens: modifying virtual memory pages [VAD] directly in RAM allows malicious instructions to execute inside a legitimate signed process without writing an untrusted binary to disk`
      ),
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
      description: ensureHostWhy(
        scenario.stages[scenario.stages.length - 1]?.description ||
          'Compromised endpoint establishes outbound C2 communications or lateral movement across the internal network.',
        `why Step #4 post-exploitation succeeds: outbound C2 or lateral traffic originates from the mutated in-memory process identity, blending into legitimate host network activity`
      ),
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
