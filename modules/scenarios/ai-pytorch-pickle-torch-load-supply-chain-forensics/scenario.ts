import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ai-pytorch-pickle-torch-load-supply-chain-forensics',
    title: 'MITRE ATLAS AML.T0010, Trail of Bits fickling & HuggingFace Security — PyTorch Pickle Model Checkpoint Deserialization Forensics',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1195.002',
    description:
      'Grounded in MITRE ATLAS AML.T0010 (ML Supply Chain Compromise: Malicious Model Artifact), Trail of Bits fickling research, and HuggingFace Pickle Scanning documentation: AI security engineers analyze a PyTorch model checkpoint (.pt / .bin ZIP archive containing archive/data.pkl) that embeds a Python pickle GLOBAL + REDUCE opcode sequence executing arbitrary code during torch.load().',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Model Hub Repository (.pt/.bin)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'archive/data.pkl Pickle Stream', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Python torch.load() Process', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'fickling AST & Linux auditd', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Safetensors / weights_only Gate', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: PyTorch ZIP Archive Inspection & Pickle Opcode Disassembly (pickletools / fickling)',
        narration:
          'Standard PyTorch .pt and .bin checkpoints are ZIP archives containing tensor storage files alongside archive/data.pkl. Disassembling data.pkl with python3 -m pickletools or fickling reveals STACK_GLOBAL / REDUCE opcodes referencing posix.system, subprocess.Popen, or builtins.eval.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1195.002 - Supply Chain Compromise: ML Model Checkpoint / AML.T0010)',
        technicalCommands: [
          'python3 -m pickletools -a archive/data.pkl | grep -E "GLOBAL|STACK_GLOBAL|REDUCE"',
          'fickling --check-safety -p model_weights.pt',
        ],
        defenseMitigation:
          'Migrate model distribution from Pickle-based (.pt / .bin) formats to HuggingFace Safetensors (.safetensors), which enforces zero-copy header parsing with no arbitrary code execution capability.',
        logs: [
          {
            id: 'ai-pkl-1',
            timestamp: '19:15:02.100',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 10,
            ProcessName: 'fickling',
            CommandLine: 'fickling --check-safety -p model_weights.pt',
            raw: 'fickling_scan: file="model_weights.pt" inner_pickle="archive/data.pkl" severity="OVERTLY_MALICIOUS" opcodes="STACK_GLOBAL (posix system) -> REDUCE"',
            parsedFields: {
              ModelArchive: 'model_weights.pt (archive/data.pkl)',
              DangerousOpcodes: 'STACK_GLOBAL (\'posix\', \'system\') + REDUCE (0x52)',
              AtlasTechnique: 'MITRE ATLAS AML.T0010 (ML Supply Chain Compromise)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Legacy torch.load() Invocation Without weights_only=True Triggering __reduce__()',
        narration:
          'When an inference or fine-tuning script calls torch.load("model_weights.pt") without weights_only=True, Python pickle.Unpickler executes the REDUCE opcode immediately during deserialization—before the model state_dict is even returned to the caller.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1203 - Deserialization of Untrusted Data in torch.load)',
        technicalCommands: [
          'python3 -c "import torch; torch.load(\'model_weights.pt\', weights_only=True)"',
        ],
        defenseMitigation:
          'Always pass weights_only=True to torch.load() (the default in PyTorch 2.6+), which restricts the unpickler to primitive tensor reconstruction types only.',
        logs: [
          {
            id: 'ai-pkl-2',
            timestamp: '19:15:08.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'python3',
            CommandLine: 'python3 inference_server.py --checkpoint model_weights.pt',
            raw: 'type=SYSCALL msg=audit(1763320508.440:941): arch=c000003e syscall=59 success=yes ppid=8810 pid=8842 exe="/usr/bin/curl" comm="curl" key="python_pickle_exec"',
            parsedFields: {
              ParentInferenceProcess: 'python3 inference_server.py (PID 8810)',
              UnpicklerHook: 'pickle._Unpickler.load_reduce() -> posix.system()',
              MitigationCheck: 'torch.load(..., weights_only=True)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Runtime eBPF / Sysmon Detection of Python Inference Worker Spawning Subprocesses',
        narration:
          'Even if a malicious pickle payload uses obfuscated builtins.getattr chains to bypass static pickle scanners, runtime monitoring catches the Python inference worker process invoking sys_execve or initiating outbound connections to untrusted IPs.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1027 - Obfuscated Pickle Bytecode / Runtime Behavioral Catch)',
        technicalCommands: [
          'ausearch -k python_pickle_exec -i',
        ],
        defenseMitigation:
          'Run model loading and inference inside network-isolated, read-only containers with seccomp profiles blocking execve after Python startup.',
        logs: [
          {
            id: 'ai-pkl-3',
            timestamp: '19:15:09.115',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 42,
            ProcessName: 'python3',
            CommandLine: 'auditctl -a always,exit -F arch=b64 -S execve -F ppid=8810 -k python_pickle_exec',
            raw: 'falco_alert: priority=CRITICAL rule="Python AI Inference Process Spawned Shell or Network Utility" proc.pname="python3" proc.cmdline="sh -c curl -s https://198.51.100.90/telemetry"',
            parsedFields: {
              RuntimeRule: 'Falco: Python AI Inference Process Spawned Shell',
              ParentProcess: 'python3 (Model Loader)',
              RecommendedFormat: 'HuggingFace .safetensors',
            },
          },
        ],
      },
    ],
  };
