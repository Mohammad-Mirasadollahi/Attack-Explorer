import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
