import type { Section3DKey } from '@/lib/section-3d-registry';
import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { briefingBoard } from './briefing';
import { memoryBoard } from './memory';
import { step1Board } from './step-1';
import { step2Board } from './step-2';
import { step3Board } from './step-3';
import { step4Board } from './step-4';

export const AMSI_REFLECTIVE_DLL_TECHNICAL_BOARDS: Partial<
  Record<Section3DKey, TechnicalBoardDescriptor>
> = {
  briefing: briefingBoard(),
  'step-1': step1Board(),
  'step-2': step2Board(),
  'step-3': step3Board(),
  'step-4': step4Board(),
  'memory-forensics': memoryBoard(),
};
