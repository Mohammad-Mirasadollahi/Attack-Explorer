import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import { buildCategory2DProfiles } from './forensic-extractor';

export const AI_MLOPS_2D_PROFILES: MalwareScenario2DProfile[] =
  buildCategory2DProfiles(
    ATTACK_SCENARIOS.filter((s) => s.category === 'AI_LLM_MLOPS_SECURITY'),
    {
      category: 'AI_LLM_MLOPS_SECURITY',
      defaultMechanic: 'ai-pipeline-hijack',
      defaultTopology: 'protocol-layer-stack',
      defaultZoneHeaders: [
        'AI INFERENCE CONTEXT & AUTONOMOUS TOOL EXECUTION',
        'IMMUTABLE MODEL BASELINE & AI TELEMETRY / XDR WITNESS',
      ],
      defaultControl: {
        name: 'Signed Base Model Weights & Policy File',
        detail: 'Static model weights & system safety file unmodified on disk',
        module: 'AI / MLOps Integrity Baseline',
        explain:
          'Prompt injection, agent hijacking, and pipeline abuse redirect runtime tool execution without rewriting the underlying model weights, proving why runtime tool-call auditing is essential.',
      },
      defaultWitnessStory:
        'An automated safety monitor catches the sudden detour into unauthorized actions and alerts defenders while confirming the base blueprint remained unchanged.',
    }
  );
