import type { Section3DKey } from '@/lib/section-3d-registry';
import type { TechnicalBoardDescriptor } from '../types';
import { briefingBoard } from './briefing';
import { memoryBoard } from './memory';
import { step1Board } from './step-1';
import { step2Board } from './step-2';
import { step3Board } from './step-3';
import { step4Board } from './step-4';
import { step5Board } from './step-5';

export const PROCESS_HOLLOWING_TECHNICAL_BOARDS: Partial<
  Record<Section3DKey, TechnicalBoardDescriptor>
> = {
  briefing: briefingBoard(),
  'step-1': step1Board(),
  'step-2': step2Board(),
  'step-3': step3Board(),
  'step-4': step4Board(),
  'step-5': step5Board(),
  'memory-forensics': memoryBoard(),
};

export {
  briefingBoard,
  memoryBoard,
  step1Board,
  step2Board,
  step3Board,
  step4Board,
  step5Board,
};
