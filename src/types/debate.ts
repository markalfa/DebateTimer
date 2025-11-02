export interface Team {
  id: string;
  name: string;
  speakers: Speaker[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  timeLimit: number; // in seconds
  speakingOrder: number;
}

export interface DebateSettings {
  researchTime: number; // in minutes
  warningThreshold: number; // percentage
  autoAdvance: boolean;
  breakDuration: number; // in seconds
  soundNotifications: boolean;
}

export interface DebateState {
  phase: 'setup' | 'research' | 'speaking' | 'completed';
  currentScreen: 'start' | 'settings' | 'debate';
  topic: string;
  teamA: Team;
  teamB: Team;
  currentSpeakerIndex: number;
  currentTeam: 'A' | 'B';
  timerState: TimerState;
  settings: DebateSettings;
}

export type TopicSelectionType = 'random' | 'specific';