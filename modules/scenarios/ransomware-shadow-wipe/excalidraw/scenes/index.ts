import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { lockbitBriefingBoard } from './briefing';
import { lockbitStep1Board } from './step-1';
import { lockbitStep2Board } from './step-2';
import { lockbitStep3Board } from './step-3';
import { lockbitStep4Board } from './step-4';

export const LOCKBIT_TECHNICAL_BOARDS: Record<string, TechnicalBoardDescriptor> = {
  briefing: lockbitBriefingBoard(),
  'step-1': lockbitStep1Board(),
  'step-2': lockbitStep2Board(),
  'step-3': lockbitStep3Board(),
  'step-4': lockbitStep4Board(),
};
