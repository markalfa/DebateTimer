import { useCallback } from 'react';
import { useDebateContext } from '../context';
import { Team, Speaker } from '../types';

export function useDebateState() {
  const { state, dispatch } = useDebateContext();

  // Navigation functions
  const goToStartScreen = useCallback(() => {
    dispatch({ type: 'SET_SCREEN', screen: 'start' });
  }, [dispatch]);

  const goToSettingsScreen = useCallback(() => {
    dispatch({ type: 'SET_SCREEN', screen: 'settings' });
  }, [dispatch]);

  const goToDebateScreen = useCallback(() => {
    dispatch({ type: 'SET_SCREEN', screen: 'debate' });
  }, [dispatch]);

  // Topic management
  const setTopic = useCallback((topic: string) => {
    dispatch({ type: 'SET_TOPIC', topic });
  }, [dispatch]);

  // Team management
  const setTeams = useCallback((teamA: Team, teamB: Team) => {
    dispatch({ type: 'SET_TEAMS', teamA, teamB });
  }, [dispatch]);

  // Settings management
  const updateDebateSettings = useCallback((settings: any) => {
    dispatch({ type: 'SET_SETTINGS', settings });
  }, [dispatch]);

  // Debate flow control
  const startResearchPhase = useCallback(() => {
    dispatch({ type: 'START_RESEARCH_PHASE' });
  }, [dispatch]);

  const startSpeakingPhase = useCallback(() => {
    dispatch({ type: 'START_SPEAKING_PHASE' });
  }, [dispatch]);

  const nextSpeaker = useCallback(() => {
    dispatch({ type: 'NEXT_SPEAKER' });
  }, [dispatch]);

  const completeDebate = useCallback(() => {
    dispatch({ type: 'COMPLETE_DEBATE' });
  }, [dispatch]);

  const resetDebate = useCallback(() => {
    dispatch({ type: 'RESET_DEBATE' });
  }, [dispatch]);

  // Helper functions
  const getCurrentSpeaker = useCallback((): Speaker | null => {
    const currentTeam = state.currentTeam === 'A' ? state.teamA : state.teamB;
    const speakerIndex = Math.floor(state.currentSpeakerIndex / 2);

    if (speakerIndex < currentTeam.speakers.length) {
      return currentTeam.speakers[speakerIndex];
    }

    return null;
  }, [state]);

  const getNextSpeaker = useCallback((): Speaker | null => {
    const nextSpeakerIndex = state.currentSpeakerIndex + 1;
    const nextTeam = nextSpeakerIndex % 2 === 0 ? 'A' : 'B';
    const nextTeamData = nextTeam === 'A' ? state.teamA : state.teamB;
    const nextSpeakerTeamIndex = Math.floor(nextSpeakerIndex / 2);

    if (nextSpeakerTeamIndex < nextTeamData.speakers.length) {
      return nextTeamData.speakers[nextSpeakerTeamIndex];
    }

    return null;
  }, [state]);

  const getCurrentTeam = useCallback((): Team => {
    return state.currentTeam === 'A' ? state.teamA : state.teamB;
  }, [state]);

  const getOpposingTeam = useCallback((): Team => {
    return state.currentTeam === 'A' ? state.teamB : state.teamA;
  }, [state]);

  const isDebateActive = useCallback((): boolean => {
    return state.phase === 'research' || state.phase === 'speaking';
  }, [state.phase]);

  const isDebateCompleted = useCallback((): boolean => {
    return state.phase === 'completed';
  }, [state.phase]);

  const canStartDebate = useCallback((): boolean => {
    return (
      state.topic.trim().length > 0 &&
      state.teamA.speakers.length > 0 &&
      state.teamB.speakers.length > 0 &&
      state.teamA.speakers.every(speaker => speaker.name.trim().length > 0) &&
      state.teamB.speakers.every(speaker => speaker.name.trim().length > 0)
    );
  }, [state]);

  const getSpeakingOrder = useCallback((): Array<{ speaker: Speaker; team: 'A' | 'B' }> => {
    const order: Array<{ speaker: Speaker; team: 'A' | 'B' }> = [];
    const maxSpeakers = Math.max(state.teamA.speakers.length, state.teamB.speakers.length);

    for (let i = 0; i < maxSpeakers; i++) {
      if (i < state.teamA.speakers.length) {
        order.push({ speaker: state.teamA.speakers[i], team: 'A' });
      }
      if (i < state.teamB.speakers.length) {
        order.push({ speaker: state.teamB.speakers[i], team: 'B' });
      }
    }

    return order;
  }, [state.teamA, state.teamB]);

  const getTotalDebateTime = useCallback((): number => {
    const researchTime = state.settings.researchTime * 60;
    const speakingTime = state.teamA.speakers.reduce((total, speaker) => total + speaker.timeLimit, 0) +
                        state.teamB.speakers.reduce((total, speaker) => total + speaker.timeLimit, 0);
    return researchTime + speakingTime;
  }, [state]);

  const getElapsedTime = useCallback((): number => {
    // This would calculate elapsed time based on timer state
    // Implementation depends on timer tracking logic
    return 0;
  }, [state.timerState]);

  // Timer state management
  const setTimerPhase = useCallback((phase: any) => {
    dispatch({ type: 'SET_TIMER_PHASE', phase });
  }, [dispatch]);

  const updateTimerTime = useCallback((currentTime: number) => {
    dispatch({ type: 'UPDATE_TIMER_TIME', currentTime });
  }, [dispatch]);

  return {
    // State
    state,

    // Navigation
    goToStartScreen,
    goToSettingsScreen,
    goToDebateScreen,

    // Topic management
    setTopic,

    // Team management
    setTeams,

    // Settings
    updateDebateSettings,

    // Debate flow
    startResearchPhase,
    startSpeakingPhase,
    nextSpeaker,
    completeDebate,
    resetDebate,

    // Timer
    setTimerPhase,
    updateTimerTime,

    // Helpers
    getCurrentSpeaker,
    getNextSpeaker,
    getCurrentTeam,
    getOpposingTeam,
    isDebateActive,
    isDebateCompleted,
    canStartDebate,
    getSpeakingOrder,
    getTotalDebateTime,
    getElapsedTime
  };
}