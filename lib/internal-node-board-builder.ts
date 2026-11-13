import { AttackScenario, TelemetryEvent } from './attack-scenarios';
import {
  createBidirectionalFlowGeometry,
  NetworkBackboneLink,
  NetworkZoneColumn,
  SketchIconType,
  WhiteboardSketchFlow,
  WhiteboardSketchNode } from './sketch-zones-and-drilldown';

export interface SequenceLineageMeta {
  parentSequenceCode: string;
  inboundParentSeqs: string[];
  internalSeqChain: string[];
  outboundParentSeqs: string[];
  lineageBadgeText: string;
}

export interface InternalSubBoardSchematic {
  parentNode: WhiteboardSketchNode;
  boardCode: string;
  title: string;
  subtitle: string;
  /** Explicit hierarchical breadcrumb answering "Where are we right now? On which system and inside which process/component?" */
  environmentBreadcrumb: string;
  /** Explicit parent host/system label (e.g., "Host System: Victim Laptop (WKS-04 · 10.10.4.15)") */
  hostSystemLabel: string;
  currentScopeType:
    | 'MALWARE_ON_HOST'
    | 'HOST_OS_ENVIRONMENT'
    | 'NETWORK_APPLIANCE'
    | 'SERVER_INFRASTRUCTURE';
  architectureNote: string;
  sequenceLineage: SequenceLineageMeta;
  zones: NetworkZoneColumn[];
  backboneLinks: NetworkBackboneLink[];
  subNodes: WhiteboardSketchNode[];
  subFlows: WhiteboardSketchFlow[];
}

interface SubNodeBlueprint {
  id: string;
  zoneId: NetworkZoneColumn['id'];
  iconType: SketchIconType;
  label: string;
  sublabel: string;
  actionBadge: string;
  wx: number;
  wy: number;
  isCompromised: boolean;
  internalSummary: string;
}

interface InternalFlowBlueprint {
  fromIdx: number;
  toIdx: number;
  shortAction: string;
  protocolOrEventId: string;
  sizeOrCode: string;
  sourceType: TelemetryEvent['sourceType'];
  packetKind: WhiteboardSketchFlow['packetKind'];
  curveOffset: number;
  returnOffset: number;
  summary: string;
}

/**
 * Generates an interactive, spacious 2D Internal Visual Sub-Board when the user clicks ANY node
 * on the main Visual Board. Preserves and dynamically calculates hierarchical sequence numbering
 * (e.g., Node #4 -> Sub-Nodes 4.1..4.5, Attack Links 4.1 [4.1.1→ / ⇠4.1.2] .. 4.4 [4.4.1→ / ⇠4.4.2]).
 */
export function buildInternalNodeSubBoard(
  scenario: AttackScenario,
  parentNode: WhiteboardSketchNode,
  parentFlows: WhiteboardSketchFlow[] = [],
  activeStageIndex: number = 0
): InternalSubBoardSchematic {
  const isNetworkDev =
    parentNode.isNetworkDevice ||
    parentNode.iconType === 'FIREWALL_ROUTER' ||
    parentNode.iconType === 'CORE_SWITCH' ||
    parentNode.iconType === 'WAF_REVERSE_PROXY' ||
    parentNode.iconType === 'DNS_RESOLVER' ||
    parentNode.iconType === 'PHISHING_GATEWAY';

  // 1. NETWORK DEVICE INTERNAL VISUAL BOARD (Firewall, Core L3 Switch, WAF, DNS Resolver, Gateway)
  if (isNetworkDev) {
    const zones: NetworkZoneColumn[] = [
      {
        id: 'INTERNAL_SUBZONE_A',
        code: 'INGRESS · PHY/VLAN',
        title: 'INGRESS NIC & 802.1Q PARSER',
        subtitle: 'L2 Frame Reception & RX Ring',
        xStart: 18,
        xEnd: 335,
        yStart: 22,
        yEnd: 435,
        subnetBadge: 'RX-RING · 10GbE SFP+',
        accentHex: '#D97706',
        bgTintClass: 'bg-amber-500/5' },
      {
        id: 'INTERNAL_SUBZONE_B',
        code: 'STATEFUL · ACL/NAT',
        title: 'ACL RULE & STATEFUL NAT TABLE',
        subtitle: '5-Tuple Session & Conntrack Lookup',
        xStart: 355,
        xEnd: 685,
        yStart: 155,
        yEnd: 625,
        subnetBadge: 'CONNTRACK · PERMIT MATCH',
        accentHex: '#E11D48',
        bgTintClass: 'bg-rose-500/5' },
      {
        id: 'INTERNAL_SUBZONE_C',
        code: 'DPI · L7 ENGINE',
        title: 'L7 DPI / PROXY / DNS ENGINE',
        subtitle: 'Payload Header Inspection & Relay',
        xStart: 705,
        xEnd: 1045,
        yStart: 22,
        yEnd: 465,
        subnetBadge: 'L7-PARSER · BYPASS/RELAY',
        accentHex: '#0284C7',
        bgTintClass: 'bg-sky-500/5' },
      {
        id: 'INTERNAL_SUBZONE_D',
        code: 'EGRESS · FIB & SPAN',
        title: 'L3 FIB ROUTING & SPAN MIRROR',
        subtitle: 'Next-Hop VLAN Egress + SIEM Mirroring',
        xStart: 1065,
        xEnd: 1462,
        yStart: 75,
        yEnd: 630,
        subnetBadge: 'TX-TRUNK & SPAN TAP',
        accentHex: '#7C3AED',
        bgTintClass: 'bg-violet-500/5' },
    ];

    const subNodeBlueprints: SubNodeBlueprint[] = [
      {
        id: `${parentNode.id}_sub_ingress_nic`,
        zoneId: 'INTERNAL_SUBZONE_A',
        iconType: 'PACKET_ENGINE',
        label: 'Ingress 10GbE NIC & RX Ring',
        sublabel: `${parentNode.sublabel.split('·')[0].trim()} · L2/L3 Parser`,
        actionBadge: 'INT ① · Frame Ingress',
        wx: 175,
        wy: 210,
        isCompromised: false,
        internalSummary: `Receives inbound packets for ${scenario.name} on physical/VLAN trunk interface and validates L2/L3 checksums.` },
      {
        id: `${parentNode.id}_sub_acl_nat`,
        zoneId: 'INTERNAL_SUBZONE_B',
        iconType: 'FIREWALL_ROUTER',
        label: 'Stateful ACL & NAT Table',
        sublabel: 'Rule #104 PERMIT · Conntrack',
        actionBadge: 'INT ② · ACL Permit Match',
        wx: 520,
        wy: 360,
        isCompromised: true,
        internalSummary: 'Matches 5-tuple against allowed service rule (e.g., TCP :443, UDP :53, SMB :445, or Kerberos :88) and creates a stateful session entry.' },
      {
        id: `${parentNode.id}_sub_dpi_engine`,
        zoneId: 'INTERNAL_SUBZONE_C',
        iconType:
          parentNode.iconType === 'DNS_RESOLVER'
            ? 'DNS_RESOLVER'
            : 'WAF_REVERSE_PROXY',
        label:
          parentNode.iconType === 'DNS_RESOLVER'
            ? 'Recursive DNS Forwarder'
            : parentNode.iconType === 'CORE_SWITCH'
            ? 'ASIC L3 Crossbar Fabric'
            : 'L7 Proxy / DPI Engine',
        sublabel: `${scenario.telemetry[0]?.protocolOrEventId || 'L7 Stream'} · Evaded`,
        actionBadge: 'INT ③ · L7 Inspection / Relay',
        wx: 875,
        wy: 215,
        isCompromised: true,
        internalSummary: 'Processes application-layer header/query. Obfuscated payload evades static signature block and is queued for forwarding.' },
      {
        id: `${parentNode.id}_sub_egress_fib`,
        zoneId: 'INTERNAL_SUBZONE_D',
        iconType: 'CORE_SWITCH',
        label: 'Egress FIB & VLAN Trunk',
        sublabel: 'Next-Hop MAC Rewrite · TX',
        actionBadge: 'INT ④ · Egress Forwarding',
        wx: 1190,
        wy: 195,
        isCompromised: true,
        internalSummary: 'Rewrites L2 MAC header and VLAN tag, transmitting the packet onto the target internal subnet trunk.' },
      {
        id: `${parentNode.id}_sub_span_mirror`,
        zoneId: 'INTERNAL_SUBZONE_D',
        iconType: 'SIEM_SENSOR',
        label: 'SPAN Port Mirror & NetFlow',
        sublabel: 'Passive Copy -> IDS / SIEM',
        actionBadge: 'INT ⑤ · SPAN Telemetry Copy',
        wx: 1355,
        wy: 390,
        isCompromised: false,
        internalSummary: 'Mirrors raw packet frames via hardware SPAN port to NDR/IDS sensors (Suricata / Zeek / SIEM) for anomaly detection.' },
    ];

    const flowBlueprints: InternalFlowBlueprint[] = [
      {
        fromIdx: 0,
        toIdx: 1,
        shortAction: 'L2/L3 Frame -> ACL Lookup',
        protocolOrEventId: '802.1Q / IPv4',
        sizeOrCode: 'RX_OK',
        sourceType: 'NETWORK',
        packetKind: 'EMAIL',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Ingress NIC strips Ethernet preamble/VLAN tag and passes the packet descriptor to the Stateful ACL & NAT engine.' },
      {
        fromIdx: 1,
        toIdx: 2,
        shortAction: 'ACL Permit -> L7 DPI / Relay',
        protocolOrEventId: scenario.telemetry[0]?.protocolOrEventId || 'TCP/UDP',
        sizeOrCode: 'PERMIT_STATE',
        sourceType: 'NETWORK',
        packetKind: 'MALWARE_DROP',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Stateful firewall rule matches allowed port and forwards the stream to the L7 Proxy / DPI / Resolver engine.' },
      {
        fromIdx: 2,
        toIdx: 3,
        shortAction: 'L7 Relay -> FIB Next-Hop Route',
        protocolOrEventId: 'L3 FIB Lookup',
        sizeOrCode: 'FWD_VLAN',
        sourceType: 'NETWORK',
        packetKind: 'LATERAL_HOP',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'L7 engine hands off the packet to the L3 Forwarding Information Base (FIB) to route into the target VLAN.' },
      {
        fromIdx: 3,
        toIdx: 4,
        shortAction: 'Hardware SPAN Mirror -> SIEM',
        protocolOrEventId: 'SPAN / NetFlow v9',
        sizeOrCode: 'MIRROR_ACK',
        sourceType: 'IDS_ALERT',
        packetKind: 'C2_EXFIL',
        curveOffset: 42,
        returnOffset: -42,
        summary: 'Switch/Firewall mirrors a passive copy of the session frames to the SOC sensor for deep packet inspection.' },
    ];

    const backboneLinks: NetworkBackboneLink[] = [
      { id: 'int-net-1', x1: 175, y1: 210, x2: 520, y2: 360, label: 'DMA RX Bus', linkType: 'INTERNAL_BUS' },
      { id: 'int-net-2', x1: 520, y1: 360, x2: 875, y2: 215, label: 'Conntrack Pipe', linkType: 'INTERNAL_BUS' },
      { id: 'int-net-3', x1: 875, y1: 215, x2: 1190, y2: 195, label: 'FIB Crossbar', linkType: 'INTERNAL_BUS' },
      { id: 'int-net-4', x1: 1190, y1: 195, x2: 1355, y2: 390, label: 'SPAN Tap', linkType: 'SPAN_MIRROR' },
    ];

    return materializeInternalBoard(
      scenario,
      parentNode,
      'NET-DEVICE INTERNAL ARCHITECTURE',
      `Inside Network Device: ${parentNode.label}`,
      'Packet Ingress -> Stateful ACL/NAT Lookup -> L7 Inspection/Relay -> Egress VLAN Routing & SPAN Mirror',
      zones,
      backboneLinks,
      subNodeBlueprints,
      flowBlueprints,
      parentFlows,
      activeStageIndex
    );
  }

  // 2. VICTIM LAPTOP / HOST INTERNAL VISUAL BOARD
  if (parentNode.archetype === 'LAPTOP_HOST_ACTIVITY') {
    const procs = scenario.processTree;
    const p0 = procs[0];
    const p1 = procs[1] || procs[0];
    const p2 = procs[2] || p1;

    const zones: NetworkZoneColumn[] = [
      {
        id: 'INTERNAL_SUBZONE_A',
        code: 'RING-3 · DELIVERY',
        title: 'USER-SPACE DELIVERY & ENTRY',
        subtitle: 'Socket / Mail / Web Process Entry',
        xStart: 18,
        xEnd: 335,
        yStart: 22,
        yEnd: 435,
        subnetBadge: 'USER-MODE · SESSION 1',
        accentHex: '#0284C7',
        bgTintClass: 'bg-sky-500/5' },
      {
        id: 'INTERNAL_SUBZONE_B',
        code: 'PROC · TREE SPAWN',
        title: 'PROCESS MANAGER & CHILD TREE',
        subtitle: 'CreateProcessW / fork+execve Chain',
        xStart: 355,
        xEnd: 685,
        yStart: 155,
        yEnd: 625,
        subnetBadge: `PID ${p0?.pid || 4120} -> ${p1?.pid || 5820}`,
        accentHex: '#D97706',
        bgTintClass: 'bg-amber-500/5' },
      {
        id: 'INTERNAL_SUBZONE_C',
        code: 'VAD · RAM & NTDLL',
        title: 'VIRTUAL MEMORY (VAD) & NTDLL',
        subtitle: 'Private RWX Pages & Syscall Gate',
        xStart: 705,
        xEnd: 1045,
        yStart: 22,
        yEnd: 465,
        subnetBadge: 'VAD · PAGE_EXECUTE_READWRITE',
        accentHex: '#E11D48',
        bgTintClass: 'bg-rose-500/5' },
      {
        id: 'INTERNAL_SUBZONE_D',
        code: 'RING-0 · ETW/SYSMON',
        title: 'SOCKET / TOKEN & KERNEL SYSMON',
        subtitle: 'Kernel Callbacks Capturing EID 1/4688/25',
        xStart: 1065,
        xEnd: 1462,
        yStart: 75,
        yEnd: 630,
        subnetBadge: 'RING-0 · SYSMON DRV',
        accentHex: '#7C3AED',
        bgTintClass: 'bg-violet-500/5' },
    ];

    const subNodeBlueprints: SubNodeBlueprint[] = [
      {
        id: `${parentNode.id}_sub_parent_proc`,
        zoneId: 'INTERNAL_SUBZONE_A',
        iconType: 'PROCESS_THREAD',
        label: p0 ? `${p0.name} (PID ${p0.pid})` : 'Initial Host Process',
        sublabel: p0?.user || 'CORP\\user · Ring-3',
        actionBadge: 'HOST ① · Parent Process',
        wx: 175,
        wy: 210,
        isCompromised: false,
        internalSummary: p0
            ? `Executes command line: ${p0.commandLine} and invokes ${p0.apiCalls.join(', ')}.`
            : 'Initial host application receiving external input and triggering child process creation.' },
      {
        id: `${parentNode.id}_sub_child_loader`,
        zoneId: 'INTERNAL_SUBZONE_B',
        iconType: 'MALWARE_PAYLOAD',
        label: p1 ? `${p1.name} (PID ${p1.pid})` : 'Spawned Dropper / Shell',
        sublabel: `${p1?.integrity || 'Medium'} Integrity · Child`,
        actionBadge: 'HOST ② · Spawned Child Process',
        wx: 520,
        wy: 360,
        isCompromised: true,
        internalSummary: p1
            ? `Child process (${p1.commandLine}) invoking ${p1.apiCalls.join(', ')}.`
            : 'Malicious child process spawned inside host user session.' },
      {
        id: `${parentNode.id}_sub_vad_memory`,
        zoneId: 'INTERNAL_SUBZONE_C',
        iconType: 'KERNEL_MEMORY',
        label: p2 ? `${p2.name} Memory Space` : 'Virtual Memory (VAD / RWX)',
        sublabel: '0x00400000 · NTDLL Syscalls',
        actionBadge: 'HOST ③ · Memory & Syscall Space',
        wx: 875,
        wy: 215,
        isCompromised: true,
        internalSummary: p2?.memoryBlocks?.[0]?.description ||
            'Virtual Address Descriptor (VAD) region where code injection, hollowing, or in-memory execution takes place.' },
      {
        id: `${parentNode.id}_sub_cred_net`,
        zoneId: 'INTERNAL_SUBZONE_D',
        iconType: 'CREDENTIAL_VAULT',
        label: 'Host Socket / Token / I/O',
        sublabel: 'LSASS / Winsock / Disk I/O',
        actionBadge: 'HOST ④ · Local Token / Socket',
        wx: 1190,
        wy: 195,
        isCompromised: true,
        internalSummary: 'Accesses host network sockets, Kerberos ticket cache, or local files to continue lateral movement or exfiltration.' },
      {
        id: `${parentNode.id}_sub_sysmon_agent`,
        zoneId: 'INTERNAL_SUBZONE_D',
        iconType: 'SIEM_SENSOR',
        label: 'Sysmon / ETW Kernel Sensor',
        sublabel: 'EID 1 · 4688 · 25 · 4104',
        actionBadge: 'HOST ⑤ · Kernel Telemetry Hook',
        wx: 1355,
        wy: 390,
        isCompromised: false,
        internalSummary: 'Kernel callbacks (PsSetCreateProcessNotifyRoutineEx & ETW) record every process creation and memory anomaly.' },
    ];

    const flowBlueprints: InternalFlowBlueprint[] = [
      {
        fromIdx: 0,
        toIdx: 1,
        shortAction: 'CreateProcess / Child Spawn',
        protocolOrEventId: 'Sysmon EID 1 / 4688',
        sizeOrCode: `PID_${p1?.pid || 5820}`,
        sourceType: 'SYSMON',
        packetKind: 'MALWARE_DROP',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Parent process invokes OS process creation API to spawn the child loader/shell process.' },
      {
        fromIdx: 1,
        toIdx: 2,
        shortAction: 'NTDLL VirtualAlloc / WriteMem',
        protocolOrEventId: 'WIN32 / NTDLL API',
        sizeOrCode: '0x00400000',
        sourceType: 'WIN32_API',
        packetKind: 'SYSCALL',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Child process allocates executable memory pages and writes/unmaps payload sections in RAM.' },
      {
        fromIdx: 2,
        toIdx: 3,
        shortAction: 'Thread Resume -> Socket / Token',
        protocolOrEventId: 'Winsock / LSA API',
        sizeOrCode: 'HANDLE_OK',
        sourceType: 'WIN32_API',
        packetKind: 'LATERAL_HOP',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Hijacked or in-memory thread executes and opens outbound network sockets or reads local tokens.' },
      {
        fromIdx: 2,
        toIdx: 4,
        shortAction: 'ETW / Sysmon Kernel Callback',
        protocolOrEventId: 'Sysmon EID 25 / EDR',
        sizeOrCode: 'LOG_COMMITTED',
        sourceType: 'MEMORY_SCAN',
        packetKind: 'C2_EXFIL',
        curveOffset: 42,
        returnOffset: -42,
        summary: 'Kernel sensor detects unbacked executable memory / process tampering and commits an event log.' },
    ];

    const backboneLinks: NetworkBackboneLink[] = [
      { id: 'int-host-1', x1: 175, y1: 210, x2: 520, y2: 360, label: 'Process Table', linkType: 'INTERNAL_BUS' },
      { id: 'int-host-2', x1: 520, y1: 360, x2: 875, y2: 215, label: 'Syscall Gate', linkType: 'INTERNAL_BUS' },
      { id: 'int-host-3', x1: 875, y1: 215, x2: 1190, y2: 195, label: 'Winsock Bus', linkType: 'INTERNAL_BUS' },
      { id: 'int-host-4', x1: 875, y1: 215, x2: 1355, y2: 390, label: 'ETW Hook', linkType: 'SPAN_MIRROR' },
    ];

    return materializeInternalBoard(
      scenario,
      parentNode,
      'ENDPOINT HOST INTERNAL ARCHITECTURE',
      `Inside Host System: ${parentNode.label}`,
      'User-Space Delivery -> Parent-Child Process Tree -> Virtual Memory (VAD/NTDLL) -> Socket & Kernel Sysmon Hooks',
      zones,
      backboneLinks,
      subNodeBlueprints,
      flowBlueprints,
      parentFlows,
      activeStageIndex
    );
  }

  // 3. MALWARE PAYLOAD / IN-MEMORY PROCESS INTERNAL VISUAL BOARD
  if (parentNode.archetype === 'MALWARE_PROCESSES') {
    const zones: NetworkZoneColumn[] = [
      {
        id: 'INTERNAL_SUBZONE_A',
        code: 'STAGE-0 · STUB',
        title: 'PACKED STUB & DECRYPTOR',
        subtitle: 'XOR / AES Unpacking & PEB API Lookup',
        xStart: 18,
        xEnd: 335,
        yStart: 135,
        yEnd: 615,
        subnetBadge: '.text STUB · XOR/AES',
        accentHex: '#E11D48',
        bgTintClass: 'bg-rose-500/5' },
      {
        id: 'INTERNAL_SUBZONE_B',
        code: 'EVASION · UNMAP/PATCH',
        title: 'DEFENSE EVASION & UNMAPPING',
        subtitle: 'NtUnmapViewOfSection / AMSI Patch',
        xStart: 355,
        xEnd: 685,
        yStart: 22,
        yEnd: 445,
        subnetBadge: 'NTDLL · EVASION STAGE',
        accentHex: '#D97706',
        bgTintClass: 'bg-amber-500/5' },
      {
        id: 'INTERNAL_SUBZONE_C',
        code: 'INJECT · RWX & PE',
        title: 'RWX ALLOCATION & PE WRITE',
        subtitle: 'VirtualAllocEx + WriteProcessMemory',
        xStart: 705,
        xEnd: 1045,
        yStart: 145,
        yEnd: 628,
        subnetBadge: 'MEM · 0x00400000 RWX',
        accentHex: '#0284C7',
        bgTintClass: 'bg-sky-500/5' },
      {
        id: 'INTERNAL_SUBZONE_D',
        code: 'EXEC · THREAD & C2',
        title: 'THREAD HIJACK (RIP) & C2 BEACON',
        subtitle: 'ResumeThread -> Outbound C2 Tasking',
        xStart: 1065,
        xEnd: 1462,
        yStart: 22,
        yEnd: 615,
        subnetBadge: 'THREAD RIP -> ENTRYPOINT',
        accentHex: '#7C3AED',
        bgTintClass: 'bg-violet-500/5' },
    ];

    const subNodeBlueprints: SubNodeBlueprint[] = [
      {
        id: `${parentNode.id}_sub_unpacker`,
        zoneId: 'INTERNAL_SUBZONE_A',
        iconType: 'MALWARE_PAYLOAD',
        label: 'Stage-0 Unpacker & PEB Resolver',
        sublabel: 'Decrypts Payload Buffer in RAM',
        actionBadge: 'MAL ① · Decryptor Stub',
        wx: 175,
        wy: 345,
        isCompromised: true,
        internalSummary: 'Walks the Process Environment Block (PEB) to resolve NTDLL/Kernel32 APIs dynamically and decrypts the embedded payload.' },
      {
        id: `${parentNode.id}_sub_evasion`,
        zoneId: 'INTERNAL_SUBZONE_B',
        iconType: 'KERNEL_MEMORY',
        label:
          scenario.id === 'amsi-reflective-dll'
            ? 'AmsiScanBuffer 6-Byte Patch'
            : 'NtUnmapViewOfSection / Evasion',
        sublabel:
          scenario.id === 'amsi-reflective-dll'
            ? 'VirtualProtect -> mov eax, 0x80070057'
            : 'Carves Out Legitimate Image Base',
        actionBadge: 'MAL ② · Defense Evasion',
        wx: 520,
        wy: 205,
        isCompromised: true,
        internalSummary: 'Neutralizes host inspection or unmaps the legitimate executable section at 0x00400000 to prepare the hollow container.' },
      {
        id: `${parentNode.id}_sub_rwx_writer`,
        zoneId: 'INTERNAL_SUBZONE_C',
        iconType: 'KERNEL_MEMORY',
        label: 'RWX Allocator & PE Injector',
        sublabel: 'VirtualAllocEx + WriteProcessMemory',
        actionBadge: 'MAL ③ · PE Section Injector',
        wx: 875,
        wy: 355,
        isCompromised: true,
        internalSummary: 'Allocates PAGE_EXECUTE_READWRITE memory and writes MZ/PE headers plus .text/.rdata/.data sections into memory.' },
      {
        id: `${parentNode.id}_sub_thread_hijack`,
        zoneId: 'INTERNAL_SUBZONE_D',
        iconType: 'PROCESS_THREAD',
        label: 'Thread Context Hijacker',
        sublabel: 'SetThreadContext (RCX/RIP) + Resume',
        actionBadge: 'MAL ④ · Thread Hijack & Exec',
        wx: 1190,
        wy: 195,
        isCompromised: true,
        internalSummary: 'Updates the suspended thread register context to point to the injected entry point and calls ResumeThread.' },
      {
        id: `${parentNode.id}_sub_c2_module`,
        zoneId: 'INTERNAL_SUBZONE_D',
        iconType: 'PACKET_ENGINE',
        label: 'C2 / Exfil / Action Engine',
        sublabel: 'Encrypted Beacon & Task Runner',
        actionBadge: 'MAL ⑤ · C2 & Post-Exploit',
        wx: 1355,
        wy: 390,
        isCompromised: true,
        internalSummary: 'Establishes the covert communication channel or executes post-exploitation tasks under the masqueraded process identity.' },
    ];

    const flowBlueprints: InternalFlowBlueprint[] = [
      {
        fromIdx: 0,
        toIdx: 1,
        shortAction: 'PEB Resolve -> Evasion Syscall',
        protocolOrEventId: 'NTDLL.DLL Syscall',
        sizeOrCode: 'STATUS_SUCCESS',
        sourceType: 'WIN32_API',
        packetKind: 'SYSCALL',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Unpacker resolves native API addresses and invokes the defense evasion / unmapping routine.' },
      {
        fromIdx: 1,
        toIdx: 2,
        shortAction: 'VirtualAllocEx + WriteProcessMemory',
        protocolOrEventId: 'WIN32_API · RWX',
        sizeOrCode: '0x00400000',
        sourceType: 'WIN32_API',
        packetKind: 'MALWARE_DROP',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Allocates executable memory region and writes the decrypted PE headers and code sections.' },
      {
        fromIdx: 2,
        toIdx: 3,
        shortAction: 'SetThreadContext -> ResumeThread',
        protocolOrEventId: 'KERNEL32 / NTDLL',
        sizeOrCode: 'RIP_HIJACKED',
        sourceType: 'WIN32_API',
        packetKind: 'SYSCALL',
        curveOffset: -38,
        returnOffset: 38,
        summary: 'Redirects the primary thread instruction pointer to the new payload entry point and wakes the thread.' },
      {
        fromIdx: 3,
        toIdx: 4,
        shortAction: 'Init C2 Socket / Post-Exploit',
        protocolOrEventId: scenario.telemetry[scenario.telemetry.length - 1]?.protocolOrEventId || 'C2 Channel',
        sizeOrCode: 'ACTIVE_BEACON',
        sourceType: 'NETWORK',
        packetKind: 'C2_EXFIL',
        curveOffset: 42,
        returnOffset: -42,
        summary: 'Active payload thread initializes the C2 beacon / lateral movement module.' },
    ];

    const backboneLinks: NetworkBackboneLink[] = [
      { id: 'int-mal-1', x1: 175, y1: 345, x2: 520, y2: 205, label: 'PEB API Table', linkType: 'INTERNAL_BUS' },
      { id: 'int-mal-2', x1: 520, y1: 205, x2: 875, y2: 355, label: 'VAD Page Table', linkType: 'INTERNAL_BUS' },
      { id: 'int-mal-3', x1: 875, y1: 355, x2: 1190, y2: 195, label: 'ETHREAD Context', linkType: 'INTERNAL_BUS' },
      { id: 'int-mal-4', x1: 1190, y1: 195, x2: 1355, y2: 390, label: 'C2 Task Bus', linkType: 'INTERNAL_BUS' },
    ];

    return materializeInternalBoard(
      scenario,
      parentNode,
      'MALWARE INTERNAL EXECUTION PIPELINE',
      `Inside Malware Process: ${parentNode.label}`,
      'Stage-0 Decryptor Stub -> Defense Evasion / Unmapping -> RWX PE Section Write -> Thread Hijack & C2 Execution',
      zones,
      backboneLinks,
      subNodeBlueprints,
      flowBlueprints,
      parentFlows,
      activeStageIndex
    );
  }

  // 4. LATERAL SERVER / DOMAIN CONTROLLER / ATTACKER / SIEM INTERNAL VISUAL BOARD
  const isSiem = parentNode.iconType === 'SIEM_SENSOR';
  const isAttacker = parentNode.iconType === 'ATTACKER';

  const zones: NetworkZoneColumn[] = [
    {
      id: 'INTERNAL_SUBZONE_A',
      code: isSiem ? 'INGEST · COLLECTORS' : isAttacker ? 'C2 · WEAPONIZER' : 'RPC/SMB · LISTENER',
      title: isSiem
          ? 'LOG COLLECTORS & PACKET INGEST'
          : isAttacker
          ? 'PAYLOAD BUILDER & EXPLOIT SENDER'
          : 'SERVER RPC / SMB / KDC LISTENER',
      subtitle: 'Inbound Service Socket & Dispatcher',
      xStart: 18,
      xEnd: 335,
      yStart: 22,
      yEnd: 435,
      subnetBadge: isSiem ? 'SYSLOG / WEF / TAP' : isAttacker ? 'OFFENSIVE OPS' : 'TCP :88 · :445 · :135',
      accentHex: '#7C3AED',
      bgTintClass: 'bg-violet-500/5' },
    {
      id: 'INTERNAL_SUBZONE_B',
      code: isSiem ? 'PARSE · NORMALIZE' : isAttacker ? 'INFRA · RELAY/DNS' : 'AUTH · KDC / SCM',
      title: isSiem
          ? 'EVENT PARSER & NORMALIZER'
          : isAttacker
          ? 'C2 LISTENER, ROGUE LDAP & DNS'
          : 'KERBEROS KDC / SERVICE MANAGER',
      subtitle: 'Ticket Issuance / Service / Event Parse',
      xStart: 355,
      xEnd: 685,
      yStart: 155,
      yEnd: 625,
      subnetBadge: isSiem ? 'XML/JSON PARSER' : isAttacker ? 'LISTENER :443/:53' : 'LSASS / SERVICES.EXE',
      accentHex: '#D97706',
      bgTintClass: 'bg-amber-500/5' },
    {
      id: 'INTERNAL_SUBZONE_C',
      code: isSiem ? 'SIGMA · CORRELATION' : isAttacker ? 'TASK · DISPATCH' : 'STORAGE · NTDS / VSS',
      title: isSiem
          ? 'SIGMA RULE & CORRELATION ENGINE'
          : isAttacker
          ? 'OPERATOR CONSOLE & EXFIL VAULT'
          : 'NTDS.DIT DIRECTORY / VSS STORAGE',
      subtitle: 'Core Data Store / Rule Evaluation',
      xStart: 705,
      xEnd: 1045,
      yStart: 22,
      yEnd: 465,
      subnetBadge: isSiem ? 'SIGMA / YARA ENGINE' : isAttacker ? 'EXFIL VAULT' : 'TIER-0 DATA STORE',
      accentHex: '#E11D48',
      bgTintClass: 'bg-rose-500/5' },
    {
      id: 'INTERNAL_SUBZONE_D',
      code: 'AUDIT · SOC ALERT',
      title: 'EXECUTION & SECURITY AUDIT LOG',
      subtitle: 'High-Severity Detection & Forensic Trail',
      xStart: 1065,
      xEnd: 1462,
      yStart: 75,
      yEnd: 630,
      subnetBadge: 'EID 4769 · 4624 · 7045',
      accentHex: '#0284C7',
      bgTintClass: 'bg-sky-500/5' },
  ];

  const subNodeBlueprints: SubNodeBlueprint[] = [
    {
      id: `${parentNode.id}_sub_srv_listener`,
      zoneId: 'INTERNAL_SUBZONE_A',
      iconType: 'PACKET_ENGINE',
      label: isSiem
        ? 'Log & Packet Ingest Gateway'
        : isAttacker
        ? 'Weaponizer & Exploit Sender'
        : 'Server RPC / SMB / KDC Socket',
      sublabel: `${parentNode.sublabel} · Listener`,
      actionBadge: 'INT ① · Service Ingress',
      wx: 175,
      wy: 210,
      isCompromised: isAttacker,
      internalSummary: `Accepts or dispatches initial network requests on ${parentNode.label} into the internal processing pipeline.` },
    {
      id: `${parentNode.id}_sub_srv_engine`,
      zoneId: 'INTERNAL_SUBZONE_B',
      iconType: 'PROCESS_THREAD',
      label: isSiem
        ? 'Event ID & Field Normalizer'
        : isAttacker
        ? 'C2 Handler & Staging Daemon'
        : 'KDC / SCM Service Engine',
      sublabel: isSiem ? 'Extracts EID 1/4688/25/4769' : 'Handles Auth & Service Calls',
      actionBadge: 'INT ② · Core Handler Engine',
      wx: 520,
      wy: 360,
      isCompromised: true,
      internalSummary: 'Processes authentication tickets, remote service control commands, C2 staging, or telemetry normalization.' },
    {
      id: `${parentNode.id}_sub_srv_vault`,
      zoneId: 'INTERNAL_SUBZONE_C',
      iconType: 'CREDENTIAL_VAULT',
      label: isSiem
        ? 'Sigma & Behavioral Correlation'
        : isAttacker
        ? 'Exfil Reassembler & Vault'
        : 'NTDS.dit / VSS Shadow Storage',
      sublabel: isSiem ? 'MITRE ATT&CK Rule Match' : 'Sensitive Hashes / Snapshots',
      actionBadge: 'INT ③ · Core Vault / Rule Engine',
      wx: 875,
      wy: 215,
      isCompromised: !isSiem,
      internalSummary: 'Reads or modifies high-value hashes, Volume Shadow Copies, exfiltrated chunks, or correlates multi-stage indicators.' },
    {
      id: `${parentNode.id}_sub_srv_exec`,
      zoneId: 'INTERNAL_SUBZONE_D',
      iconType: 'LATERAL_SERVER',
      label: isSiem
        ? 'SOC Incident Timeline Builder'
        : isAttacker
        ? 'Interactive C2 Tasking Shell'
        : 'Privileged Session Execution',
      sublabel: 'Tier-0 Impact & Response',
      actionBadge: 'INT ④ · Execution / Response',
      wx: 1190,
      wy: 195,
      isCompromised: !isSiem,
      internalSummary: 'Completes privileged action on the server, dispatches operator commands, or constructs the correlated attack timeline.' },
    {
      id: `${parentNode.id}_sub_srv_audit`,
      zoneId: 'INTERNAL_SUBZONE_D',
      iconType: 'SIEM_SENSOR',
      label: 'Security Event Log & Alert',
      sublabel: 'EventID 4769 · 4624 · 7045',
      actionBadge: 'INT ⑤ · Forensic Audit Log',
      wx: 1355,
      wy: 390,
      isCompromised: false,
      internalSummary: 'Generates high-priority security audit records and telemetry traces for DFIR analysts.' },
  ];

  const primaryMitre = scenario.stages[0]?.mitreTechniqueId || 'MITRE Action';

  const flowBlueprints: InternalFlowBlueprint[] = [
    {
      fromIdx: 0,
      toIdx: 1,
      shortAction: 'Dispatch Request to Engine',
      protocolOrEventId: scenario.telemetry[0]?.protocolOrEventId || 'RPC / TCP',
      sizeOrCode: 'SESSION_OPEN',
      sourceType: 'NETWORK',
      packetKind: 'LATERAL_HOP',
      curveOffset: -38,
      returnOffset: 38,
      summary: 'Ingress listener accepts the connection and forwards the payload to the internal processing engine.' },
    {
      fromIdx: 1,
      toIdx: 2,
      shortAction: 'Query / Modify Vault or Rules',
      protocolOrEventId: 'Internal IPC / LSA',
      sizeOrCode: 'ACCESS_GRANTED',
      sourceType: 'WIN_EVENT',
      packetKind: 'SYSCALL',
      curveOffset: -38,
      returnOffset: 38,
      summary: 'Core handler interacts with the underlying credential store, VSS storage, or correlation database.' },
    {
      fromIdx: 2,
      toIdx: 3,
      shortAction: 'Commit Action / Issue Ticket',
      protocolOrEventId: primaryMitre,
      sizeOrCode: 'EXEC_OK',
      sourceType: 'WIN_EVENT',
      packetKind: 'MALWARE_DROP',
      curveOffset: -38,
      returnOffset: 38,
      summary: 'Returns the issued ticket, decrypted data, or execution result to the active session handler.' },
    {
      fromIdx: 3,
      toIdx: 4,
      shortAction: 'Write Security Audit Event',
      protocolOrEventId: 'EventLog 4769 / 7045',
      sizeOrCode: 'AUDIT_LOGGED',
      sourceType: 'SYSMON',
      packetKind: 'C2_EXFIL',
      curveOffset: 42,
      returnOffset: -42,
      summary: 'Commits a detailed forensic audit event capturing the internal operation and returns ACK.' },
  ];

  const backboneLinks: NetworkBackboneLink[] = [
    { id: 'int-srv-1', x1: 175, y1: 210, x2: 520, y2: 360, label: 'RPC Pipe', linkType: 'INTERNAL_BUS' },
    { id: 'int-srv-2', x1: 520, y1: 360, x2: 875, y2: 215, label: 'Storage Bus', linkType: 'INTERNAL_BUS' },
    { id: 'int-srv-3', x1: 875, y1: 215, x2: 1190, y2: 195, label: 'Exec Channel', linkType: 'INTERNAL_BUS' },
    { id: 'int-srv-4', x1: 1190, y1: 195, x2: 1355, y2: 390, label: 'Audit Bus', linkType: 'SPAN_MIRROR' },
  ];

  return materializeInternalBoard(
    scenario,
    parentNode,
    'INTERNAL SUB-BOARD SCHEMATIC',
    `Inside Node: ${parentNode.label}`,
    'Service Ingress -> Internal Handler Engine -> Core Storage / Vault -> Execution & Security Audit Trail',
    zones,
    backboneLinks,
    subNodeBlueprints,
    flowBlueprints,
    parentFlows,
    activeStageIndex
  );
}

function materializeInternalBoard(
  scenario: AttackScenario,
  parentNode: WhiteboardSketchNode,
  boardCode: string,
  title: string,
  subtitle: string,
  zones: NetworkZoneColumn[],
  backboneLinks: NetworkBackboneLink[],
  subNodeBlueprints: SubNodeBlueprint[],
  flowBlueprints: InternalFlowBlueprint[],
  parentFlows: WhiteboardSketchFlow[] = [],
  activeStageIndex: number = 0
): InternalSubBoardSchematic {
  const parentSequenceCode =
    parentNode.sequenceCode || String(parentNode.chainOrder);

  const isMalwareProcess =
    parentNode.iconType === 'MALWARE_PAYLOAD' ||
    parentNode.archetype === 'MALWARE_PROCESSES';
  const isHostEndpoint =
    parentNode.iconType === 'VICTIM_LAPTOP' ||
    parentNode.archetype === 'LAPTOP_HOST_ACTIVITY';
  const isNetworkAppliance =
    Boolean(parentNode.isNetworkDevice) ||
    parentNode.iconType === 'FIREWALL_ROUTER' ||
    parentNode.iconType === 'CORE_SWITCH' ||
    parentNode.iconType === 'WAF_REVERSE_PROXY' ||
    parentNode.iconType === 'DNS_RESOLVER';

  const currentScopeType: InternalSubBoardSchematic['currentScopeType'] =
    isMalwareProcess
      ? 'MALWARE_ON_HOST'
      : isHostEndpoint
      ? 'HOST_OS_ENVIRONMENT'
      : isNetworkAppliance
      ? 'NETWORK_APPLIANCE'
      : 'SERVER_INFRASTRUCTURE';

  const parentHostCtxEn =
    parentNode.hostContext ||
    `System: ${parentNode.label} (${parentNode.sublabel})`;

  const hostSystemLabel: string = isMalwareProcess
    ? parentHostCtxEn
    : isHostEndpoint
    ? `💻 Host OS Environment: ${parentNode.label} (${parentNode.sublabel})`
    : isNetworkAppliance
    ? `🛡️ Network Appliance: ${parentNode.label} (${parentNode.sublabel})`
    : `🗄️ System Environment: ${parentNode.label} (${parentNode.sublabel})`;

  const environmentBreadcrumb: string = isMalwareProcess
    ? `📍 YOU ARE HERE: ${parentHostCtxEn.replace(/^📍\s*/i, '')} ▸ Inside Malware Process "${parentNode.label}" ▸ Inspecting ${subNodeBlueprints.length} In-Memory & Syscall Activities`
    : isHostEndpoint
    ? `📍 YOU ARE HERE: Inside Host System "${parentNode.label}" (${parentNode.sublabel}) ▸ Inspecting ${subNodeBlueprints.length} Host OS Activities & Process Tree`
    : isNetworkAppliance
    ? `📍 YOU ARE HERE: Inside Network Appliance "${parentNode.label}" (${parentNode.sublabel}) ▸ Inspecting ${subNodeBlueprints.length} Packet & Inspection Activities`
    : `📍 YOU ARE HERE: Inside System "${parentNode.label}" (${parentNode.sublabel}) ▸ Inspecting ${subNodeBlueprints.length} Internal Service & Audit Activities`;

  const subNodeHostBadge: string = isMalwareProcess
    ? `📍 In Process: ${parentNode.label} (${parentHostCtxEn.replace(/^📍\s*/i, '')})`
    : isHostEndpoint
    ? `💻 On Host System: ${parentNode.label}`
    : `🔧 Inside: ${parentNode.label}`;

  const subNodes: WhiteboardSketchNode[] = subNodeBlueprints.map(
    (bp, index) => {
      const nodeSeqCode = `${parentSequenceCode}.${index + 1}`;
      return {
        id: bp.id,
        originalNode: parentNode.originalNode,
        zoneId: bp.zoneId,
        archetype: parentNode.archetype,
        chainOrder: index + 1,
        sequenceCode: nodeSeqCode,
        iconType: bp.iconType,
        label: bp.label,
        sublabel: bp.sublabel,
        actionBadge: `[#${nodeSeqCode}] ${bp.actionBadge}`,
        hostContext: subNodeHostBadge,
        activitySummary: bp.internalSummary,
        wx: bp.wx,
        wy: bp.wy,
        isCompromised: bp.isCompromised,
        isActive: true,
        internalSummary: bp.internalSummary };
    }
  );

  const numberedBackboneLinks: NetworkBackboneLink[] = backboneLinks.map(
    (bl, bIdx) => ({
      ...bl,
      sequenceCode: `L${parentSequenceCode}.${bIdx + 1}` })
  );

  const baseEvent = scenario.telemetry[0];
  const syntheticEvents: TelemetryEvent[] = flowBlueprints.map((fb, idx) => {
    const matchedScenarioEvent =
      scenario.telemetry[idx % scenario.telemetry.length] || baseEvent;
    const fromN = subNodes[fb.fromIdx];
    const toN = subNodes[fb.toIdx];

    return {
      ...matchedScenarioEvent,
      id: `${parentNode.id}_int_flow_${idx + 1}`,
      no: idx + 1,
      stageIndex: matchedScenarioEvent.stageIndex || idx + 1,
      sourceType: fb.sourceType,
      sourceLabel: fromN.label,
      targetLabel: toN.label,
      protocolOrEventId: fb.protocolOrEventId,
      shortAction: fb.shortAction,
      sizeOrCode: fb.sizeOrCode,
      explanation: fb.summary };
  });

  const highlightedSubFlowIdx =
    activeStageIndex > 0
      ? (activeStageIndex - 1) % flowBlueprints.length
      : 0;

  const subFlows: WhiteboardSketchFlow[] = flowBlueprints.map((fb, idx) => {
    const ev = syntheticEvents[idx];
    const nextEv = syntheticEvents[idx + 1];
    const fromNode = subNodes[fb.fromIdx];
    const toNode = subNodes[fb.toIdx];

    return createBidirectionalFlowGeometry({
      id: ev.id,
      stepNo: idx + 1,
      stageIndex: ev.stageIndex,
      fromNode,
      toNode,
      curveOffset: fb.curveOffset,
      returnOffset: fb.returnOffset,
      packetKind: fb.packetKind,
      telemetryEvent: ev,
      nextEvent: nextEv,
      isCurrentStep: idx === highlightedSubFlowIdx,
      isVisible: true,
      sequencePrefix: parentSequenceCode });
  });

  const inboundParentSeqs = parentFlows
    .filter((pf) => pf.toNodeId === parentNode.id)
    .map((pf) => `#${pf.forwardSeq}→`);

  const outboundParentSeqs = parentFlows
    .filter((pf) => pf.fromNodeId === parentNode.id)
    .map((pf) => `#${pf.forwardSeq}→`);

  const internalSeqChain = subFlows.map((sf) => sf.sequenceCode);

  const inLabel =
    inboundParentSeqs.length > 0 ? inboundParentSeqs.join(', ') : 'Entry';
  const outLabel =
    outboundParentSeqs.length > 0 ? outboundParentSeqs.join(', ') : 'Terminal';
  const internalChainText = internalSeqChain.join(' → ');

  const sequenceLineage: SequenceLineageMeta = {
    parentSequenceCode,
    inboundParentSeqs,
    internalSeqChain,
    outboundParentSeqs,
    lineageBadgeText: `In: ${inLabel} ▸ Node #${parentSequenceCode} [${internalChainText}] ▸ Out: ${outLabel}` };

  const archNoteText = `Expanded internal visual board for Node #${parentSequenceCode} "${parentNode.label}" (${hostSystemLabel}). Sequence numbers are preserved hierarchically (${internalChainText} with forward #${parentSequenceCode}.N.1→ and return ⇠#${parentSequenceCode}.N.2).`;

  return {
    parentNode,
    boardCode,
    title,
    subtitle,
    environmentBreadcrumb,
    hostSystemLabel,
    currentScopeType,
    architectureNote: archNoteText,
    sequenceLineage,
    zones,
    backboneLinks: numberedBackboneLinks,
    subNodes,
    subFlows };
}
