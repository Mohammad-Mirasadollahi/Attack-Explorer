import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a research lab downloading a shared suitcase of pre-trained brain weights from a public model exchange. Tucked inside the suitcase lining is a hidden wind-up instruction card that springs open the very instant an engineer unzips the suitcase using an older loading table without a safety tray, launching covert workshop commands before the model weights are even examined.',
      storyMappings: [
        {
          storyTerm: 'Shared Suitcase of Brain Weights',
          technicalTerm: 'PyTorch Model Checkpoint Archive (.pt / .bin ZIP with archive/data.pkl)',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden Wind-Up Instruction Card',
          technicalTerm: 'Embedded Python Pickle STACK_GLOBAL + REDUCE Opcodes (AML.T0010)',
          tone: 'rose',
        },
        {
          storyTerm: 'Older Loading Table Without Safety Tray',
          technicalTerm: 'Legacy torch.load() Called Without weights_only=True Parameter',
          tone: 'amber',
        },
        {
          storyTerm: 'Workshop Floor Motion Sensor',
          technicalTerm: 'Runtime eBPF / Sysmon Catching Python Inference Worker Spawning Shells',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before putting the downloaded suitcase onto the lab bench, a cautious inspector opens the outer zipper and reads the packing manifest line by line, discovering wind-up command gears hidden right beside the harmless numeric weight pouches.',
        storyMappings: [
          {
            storyTerm: 'Outer Suitcase Zipper',
            technicalTerm: 'Standard PyTorch .pt / .bin ZIP Archive Containing archive/data.pkl',
            tone: 'sky',
          },
          {
            storyTerm: 'Inspector Reading Manifest',
            technicalTerm: 'Static Disassembly via python3 -m pickletools or Trail of Bits fickling',
            tone: 'emerald',
          },
          {
            storyTerm: 'Hidden Wind-Up Command Gears',
            technicalTerm: 'Malicious Pickle STACK_GLOBAL & REDUCE Opcodes Calling os.system',
            tone: 'rose',
          },
          {
            storyTerm: 'Harmless Numeric Weight Pouches',
            technicalTerm: 'Legitimate Tensor Storage Files Inside Checkpoint Archive',
            tone: 'amber',
          },
        ],
      },
      2: {
        storyAnalogy:
          'On an unprotected training bench, the engineer places the suitcase onto the legacy automatic unpacker without flipping the weights-only safety lock, causing the hidden wind-up card to snap open and execute its command before the model weights even reach the table.',
        storyMappings: [
          {
            storyTerm: 'Legacy Automatic Unpacker',
            technicalTerm: 'torch.load("model_weights.pt") Invoked Without weights_only=True',
            tone: 'amber',
          },
          {
            storyTerm: 'Wind-Up Card Snapping Open',
            technicalTerm: 'Python pickle.Unpickler Executing __reduce__() During Deserialization',
            tone: 'rose',
          },
          {
            storyTerm: 'Before Weights Reach Table',
            technicalTerm: 'Code Execution Completing Prior to Model state_dict Inspection',
            tone: 'sky',
          },
          {
            storyTerm: 'Safe Tensor Alternative',
            technicalTerm: 'Enforcing safetensors Format or torch.load(..., weights_only=True)',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even when the saboteur disguises the wind-up card using clever mirror chains to fool front-desk X-ray scanners, the lab’s runtime motion alarm fires the instant the quiet math-inference worker unexpectedly reaches for a power drill or dials an outside telephone line.',
        storyMappings: [
          {
            storyTerm: 'Clever Mirror-Chain Disguise',
            technicalTerm: 'Obfuscated builtins.getattr Pickle Chains Evading Static Scanners',
            tone: 'amber',
          },
          {
            storyTerm: 'Quiet Math-Inference Worker',
            technicalTerm: 'Python Model Inference / Fine-Tuning Worker Process',
            tone: 'sky',
          },
          {
            storyTerm: 'Reaching for Drill or Outside Phone',
            technicalTerm: 'Unexpected sys_execve Subprocess Spawn or Outbound Network Socket',
            tone: 'rose',
          },
          {
            storyTerm: 'Lab Runtime Motion Alarm',
            technicalTerm: 'eBPF (Tetragon / Falco) & Sysmon Event ID 1 / 3 Runtime Telemetry',
            tone: 'emerald',
          },
        ],
      },
    },
  };
