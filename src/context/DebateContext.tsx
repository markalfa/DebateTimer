import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DebateState, Team, Speaker, DebateSettings, TimerPhase } from '../types';
import { generateTimerId, createDefaultTeam } from '../utils';

// Debate action types
type DebateAction =
  | { type: 'SET_SCREEN'; screen: 'start' | 'settings' | 'debate' }
  | { type: 'SET_TOPIC'; topic: string }
  | { type: 'SET_TEAMS'; teamA: Team; teamB: Team }
  | { type: 'SET_SETTINGS'; settings: DebateSettings }
  | { type: 'START_RESEARCH_PHASE' }
  | { type: 'START_SPEAKING_PHASE' }
  | { type: 'NEXT_SPEAKER' }
  | { type: 'PREVIOUS_SPEAKER' }
  | { type: 'SET_TIMER_PHASE'; phase: TimerPhase }
  | { type: 'UPDATE_TIMER_TIME'; currentTime: number }
  | { type: 'SET_CURRENT_SPEAKER'; speakerIndex: number; team: 'A' | 'B' }
  | { type: 'RESET_DEBATE' }
  | { type: 'COMPLETE_DEBATE' }
  | { type: 'LOAD_SAVED_STATE'; state: DebateState };

// Initial state
const createInitialState = (): DebateState => ({
  phase: 'setup',
  currentScreen: 'start',
  topic: '',
  teamA: createDefaultTeam('Team A', 'team_a'),
  teamB: createDefaultTeam('Team B', 'team_b'),
  currentSpeakerIndex: 0,
  currentTeam: 'A',
  timerState: {
    phase: 'idle',
    currentTime: 0,
    totalTime: 0,
    speakerId: null,
    isRunning: false,
    startTime: null,
    pausedTime: null
  },
  settings: {
    researchTime: 10,
    warningThreshold: 25,
    autoAdvance: true,
    breakDuration: 5,
    soundNotifications: false
  }
});

// Reducer function
function debateReducer(state: DebateState, action: DebateAction): DebateState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };

    case 'SET_TOPIC':
      return { ...state, topic: action.topic };

    case 'SET_TEAMS':
      return { ...state, teamA: action.teamA, teamB: action.teamB };

    case 'SET_SETTINGS':
      return { ...state, settings: action.settings };

    case 'START_RESEARCH_PHASE':
      return {
        ...state,
        phase: 'research',
        currentScreen: 'debate',
        timerState: {
          phase: 'research',
          currentTime: state.settings.researchTime * 60,
          totalTime: state.settings.researchTime * 60,
          speakerId: null,
          isRunning: false,
          startTime: null,
          pausedTime: null
        }
      };

    case 'START_SPEAKING_PHASE':
      const firstSpeaker = state.teamA.speakers[0];
      return {
        ...state,
        phase: 'speaking',
        currentSpeakerIndex: 0,
        currentTeam: 'A',
        timerState: {
          phase: 'speaking',
          currentTime: firstSpeaker.timeLimit,
          totalTime: firstSpeaker.timeLimit,
          speakerId: firstSpeaker.id,
          isRunning: false,
          startTime: null,
          pausedTime: null
        }
      };

    case 'NEXT_SPEAKER':
      const nextSpeakerIndex = state.currentSpeakerIndex + 1;
      const totalSpeakers = Math.max(state.teamA.speakers.length, state.teamB.speakers.length);

      if (nextSpeakerIndex >= totalSpeakers * 2) {
        // Debate is complete
        return {
          ...state,
          phase: 'completed',
          timerState: {
            ...state.timerState,
            phase: 'completed',
            isRunning: false
          }
        };
      }

      // Determine next speaker and team
      const nextTeam = nextSpeakerIndex % 2 === 0 ? 'A' : 'B';
      const nextSpeakerTeamIndex = Math.floor(nextSpeakerIndex / 2);
      const nextTeamData = nextTeam === 'A' ? state.teamA : state.teamB;
      const nextSpeaker = nextTeamData.speakers[nextSpeakerTeamIndex];

      if (!nextSpeaker) {
        // Handle case where teams have different numbers of speakers
        return debateReducer(state, { type: 'NEXT_SPEAKER' });
      }

      return {
        ...state,
        currentSpeakerIndex: nextSpeakerIndex,
        currentTeam: nextTeam,
        timerState: {
          phase: 'speaking',
          currentTime: nextSpeaker.timeLimit,
          totalTime: nextSpeaker.timeLimit,
          speakerId: nextSpeaker.id,
          isRunning: false,
          startTime: null,
          pausedTime: null
        }
      };

    case 'SET_TIMER_PHASE':
      return {
        ...state,
        timerState: { ...state.timerState, phase: action.phase }
      };

    case 'UPDATE_TIMER_TIME':
      return {
        ...state,
        timerState: { ...state.timerState, currentTime: action.currentTime }
      };

    case 'SET_CURRENT_SPEAKER':
      return {
        ...state,
        currentSpeakerIndex: action.speakerIndex,
        currentTeam: action.team
      };

    case 'RESET_DEBATE':
      return createInitialState();

    case 'COMPLETE_DEBATE':
      return {
        ...state,
        phase: 'completed',
        timerState: {
          ...state.timerState,
          phase: 'completed',
          isRunning: false
        }
      };

    case 'LOAD_SAVED_STATE':
      return action.state;

    default:
      return state;
  }
}

// Context
const DebateContext = createContext<{
  state: DebateState;
  dispatch: React.Dispatch<DebateAction>;
} | null>(null);

// Provider component
export function DebateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(debateReducer, createInitialState());

  // Load saved state on mount
  useEffect(() => {
    // In a real implementation, we would load from localStorage here
    // For now, we'll start with fresh state
  }, []);

  return (
    <DebateContext.Provider value={{ state, dispatch }}>
      {children}
    </DebateContext.Provider>
  );
}

// Hook to use the debate context
export function useDebateContext() {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebateContext must be used within a DebateProvider');
  }
  return context;
}

// Action creators for common operations
export const debateActions = {
  setScreen: (screen: 'start' | 'settings' | 'debate') => ({
    type: 'SET_SCREEN' as const,
    screen
  }),

  setTopic: (topic: string) => ({
    type: 'SET_TOPIC' as const,
    topic
  }),

  setTeams: (teamA: Team, teamB: Team) => ({
    type: 'SET_TEAMS' as const,
    teamA,
    teamB
  }),

  setSettings: (settings: DebateSettings) => ({
    type: 'SET_SETTINGS' as const,
    settings
  }),

  startResearchPhase: () => ({
    type: 'START_RESEARCH_PHASE' as const
  }),

  startSpeakingPhase: () => ({
    type: 'START_SPEAKING_PHASE' as const
  }),

  nextSpeaker: () => ({
    type: 'NEXT_SPEAKER' as const
  }),

  setTimerPhase: (phase: TimerPhase) => ({
    type: 'SET_TIMER_PHASE' as const,
    phase
  }),

  updateTimerTime: (currentTime: number) => ({
    type: 'UPDATE_TIMER_TIME' as const,
    currentTime
  }),

  resetDebate: () => ({
    type: 'RESET_DEBATE' as const
  }),

  completeDebate: () => ({
    type: 'COMPLETE_DEBATE' as const
  })
};