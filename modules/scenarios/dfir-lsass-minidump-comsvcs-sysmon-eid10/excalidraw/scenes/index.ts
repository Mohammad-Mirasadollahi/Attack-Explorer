import type { Section3DKey } from '@/lib/section-3d-registry';
import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { lsassBriefingBoard } from './briefing';
import { lsassStep1Board } from './step-1';
import { lsassStep2Board } from './step-2';
import { lsassStep3Board } from './step-3';
import { lsassStep4Board } from './step-4';
import { lsassMemoryBoard } from './memory';

export const LSASS_COMSVCS_TECHNICAL_BOARDS: Partial<
  Record<Section3DKey, TechnicalBoardDescriptor>
> = {
  briefing: lsassBriefingBoard(),
  'step-1': lsassStep1Board(),
  'step-2': lsassStep2Board(),
  'step-3': lsassStep3Board(),
  'step-4': lsassStep4Board(),
  'memory-forensics': lsassMemoryBoard(),
};
