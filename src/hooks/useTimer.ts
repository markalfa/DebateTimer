import { useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerPhase } from '../types';
import { formatTime, getTimerColor, calculateDuration } from '../utils';

interface UseTimerOptions {
  onTimeUpdate?: (currentTime: number) => void;
  onPhaseChange?: (phase: TimerPhase) => void;
  onTimerComplete?: () => void;
  onWarningThreshold?: (currentTime: number) => void;
  onCriticalThreshold?: (currentTime: number) => void;
}

export function useTimer(
  timerState: TimerState,
  dispatch: (action: any) => void,
  options: UseTimerOptions = {}
) {
  const {
    onTimeUpdate,
    onPhaseChange,
    onTimerComplete,
    onWarningThreshold,
    onCriticalThreshold
  } = options;

  const intervalRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const pausedDurationRef = useRef<number>(0);

  // Start timer
  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const now = Date.now();
    lastUpdateRef.current = now;

    dispatch({
      type: 'SET_TIMER_PHASE',
      phase: timerState.phase === 'paused' ? 'speaking' : timerState.phase
    });

    intervalRef.current = requestAnimationFrame(updateTimer);
  }, [dispatch, timerState.phase]);

  // Pause timer
  const pause = useCallback(() => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }

    pausedDurationRef.current += calculateDuration(timerState.startTime || lastUpdateRef.current);

    dispatch({
      type: 'SET_TIMER_PHASE',
      phase: 'paused'
    });
  }, [dispatch, timerState.startTime]);

  // Stop timer
  const stop = useCallback(() => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }

    dispatch({
      type: 'SET_TIMER_PHASE',
      phase: 'idle'
    });
  }, [dispatch]);

  // Reset timer to initial time
  const reset = useCallback(() => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }

    pausedDurationRef.current = 0;
    lastUpdateRef.current = Date.now();

    dispatch({
      type: 'UPDATE_TIMER_TIME',
      currentTime: timerState.totalTime
    });

    dispatch({
      type: 'SET_TIMER_PHASE',
      phase: 'idle'
    });
  }, [dispatch, timerState.totalTime]);

  // Timer update function
  const updateTimer = useCallback(() => {
    if (!timerState.isRunning) return;

    const now = Date.now();
    const elapsed = calculateDuration(timerState.startTime || lastUpdateRef.current);
    const totalElapsed = pausedDurationRef.current + elapsed;

    const newTime = Math.max(0, timerState.totalTime - totalElapsed);

    // Update timer display
    dispatch({
      type: 'UPDATE_TIMER_TIME',
      currentTime: newTime
    });

    // Call update callback
    if (onTimeUpdate) {
      onTimeUpdate(newTime);
    }

    // Check thresholds
    if (newTime <= 0) {
      // Timer completed
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
      }

      dispatch({
        type: 'SET_TIMER_PHASE',
        phase: 'overtime'
      });

      if (onTimerComplete) {
        onTimerComplete();
      }
    } else {
      // Continue timer
      intervalRef.current = requestAnimationFrame(updateTimer);
    }
  }, [timerState, dispatch, onTimeUpdate, onTimerComplete]);

  // Handle timer state changes
  useEffect(() => {
    if (timerState.isRunning && !intervalRef.current) {
      start();
    } else if (!timerState.isRunning && intervalRef.current) {
      pause();
    }
  }, [timerState.isRunning, start, pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, []);

  // Format time for display
  const formattedTime = formatTime(timerState.currentTime);

  // Get timer color based on time remaining
  const timerColor = getTimerColor(timerState.currentTime, timerState.totalTime, 25);

  // Check if in warning zone
  const isWarning = timerState.currentTime <= (timerState.totalTime * 0.25) && timerState.currentTime > 0;

  // Check if in critical zone
  const isCritical = timerState.currentTime <= (timerState.totalTime * 0.1) && timerState.currentTime > 0;

  // Check if overtime
  const isOvertime = timerState.currentTime <= 0;

  return {
    start,
    pause,
    stop,
    reset,
    formattedTime,
    timerColor,
    isWarning,
    isCritical,
    isOvertime,
    isRunning: timerState.isRunning,
    currentTime: timerState.currentTime,
    totalTime: timerState.totalTime,
    phase: timerState.phase
  };
}