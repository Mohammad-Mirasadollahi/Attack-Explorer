import type { HollowingCameraPreset } from '../choreography';

export const CYCLE_DURATION_SECONDS = 26;

export const BANK_CAMERA_PRESET_OPTIONS: ReadonlyArray<{
  id: HollowingCameraPreset;
  label: string;
  reCenterLabel?: string;
}> = [
  { id: 'DIRECTOR', label: 'Director', reCenterLabel: 'Re-Center' },
  { id: 'GARAGE', label: 'Garage' },
  { id: 'INTERIOR', label: 'Cargo Bay' },
  { id: 'GATE', label: 'Bank Gate' },
];

export const BANK_SCENE_FALLBACK_HINT =
  'The armored bank truck analogy illustrates how svchost.exe is suspended, hollowed, loaded with covert code, and resumed while keeping its trusted identity.';
