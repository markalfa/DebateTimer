export type TimerPhase = 'idle' | 'research' | 'speaking' | 'paused' | 'overtime' | 'completed';

export interface TimerState {
  phase: TimerPhase;
  currentTime: number; // in seconds
  totalTime: number; // in seconds
  speakerId: string | null;
  isRunning: boolean;
  startTime: number | null;
  pausedTime: number | null;
}

export interface TimerControls {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  nextSpeaker: () => void;
  skipSpeaker: () => void;
}