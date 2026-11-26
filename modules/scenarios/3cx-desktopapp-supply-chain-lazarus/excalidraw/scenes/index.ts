import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { threeCxBriefingBoard } from './briefing';
import { threeCxStep1Board } from './step-1';
import { threeCxStep2Board } from './step-2';
import { threeCxStep3Board } from './step-3';
import { threeCxStep4Board } from './step-4';
import { threeCxMemoryBoard } from './memory';

export const THREECX_TECHNICAL_BOARDS: Record<string, TechnicalBoardDescriptor> = {
  briefing: threeCxBriefingBoard(),
  'step-1': threeCxStep1Board(),
  'step-2': threeCxStep2Board(),
  'step-3': threeCxStep3Board(),
  'step-4': threeCxStep4Board(),
  'memory-forensics': threeCxMemoryBoard(),
};
