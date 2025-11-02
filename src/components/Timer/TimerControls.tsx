import React from 'react';
import { FaPlay, FaPause, FaStop, FaForward, FaUndo } from 'react-icons/fa';
import styles from './Timer.module.css';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  phase: string;
  canStart: boolean;
  canPause: boolean;
  canStop: boolean;
  canNext: boolean;
  canReset: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onNext: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function TimerControls({
  isRunning,
  isPaused,
  phase,
  canStart,
  canPause,
  canStop,
  canNext,
  canReset,
  onStart,
  onPause,
  onResume,
  onStop,
  onNext,
  onReset,
  disabled = false
}: TimerControlsProps) {
  const getPlayPauseButton = () => {
    if (isRunning) {
      return (
        <button
          className={`${styles.controlButton} ${styles.pauseButton}`}
          onClick={onPause}
          disabled={!canPause || disabled}
          title="Pause Timer"
        >
          <FaPause size={20} />
          <span>Pause</span>
        </button>
      );
    }

    if (isPaused) {
      return (
        <button
          className={`${styles.controlButton} ${styles.resumeButton}`}
          onClick={onResume}
          disabled={disabled}
          title="Resume Timer"
        >
          <FaPlay size={20} />
          <span>Resume</span>
        </button>
      );
    }

    return (
      <button
        className={`${styles.controlButton} ${styles.startButton}`}
        onClick={onStart}
        disabled={!canStart || disabled}
        title="Start Timer"
      >
        <FaPlay size={20} />
        <span>Start</span>
      </button>
    );
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'research':
        return 'Research Phase';
      case 'speaking':
        return 'Speaking Phase';
      case 'paused':
        return 'Paused';
      case 'overtime':
        return 'Overtime';
      case 'completed':
        return 'Completed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className={styles.timerControls}>
      {/* Phase indicator */}
      <div className={styles.controlsPhase}>
        {getPhaseText()}
      </div>

      {/* Control buttons */}
      <div className={styles.controlsRow}>
        {/* Start/Pause/Resume button */}
        {getPlayPauseButton()}

        {/* Stop button */}
        <button
          className={`${styles.controlButton} ${styles.stopButton}`}
          onClick={onStop}
          disabled={!canStop || disabled}
          title="Stop Timer"
        >
          <FaStop size={20} />
          <span>Stop</span>
        </button>

        {/* Next Speaker button */}
        <button
          className={`${styles.controlButton} ${styles.nextButton}`}
          onClick={onNext}
          disabled={!canNext || disabled}
          title="Next Speaker"
        >
          <FaForward size={20} />
          <span>Next</span>
        </button>

        {/* Reset button */}
        <button
          className={`${styles.controlButton} ${styles.resetButton}`}
          onClick={onReset}
          disabled={!canReset || disabled}
          title="Reset Timer"
        >
          <FaUndo size={20} />
          <span>Reset</span>
        </button>
      </div>

      {/* Instructions */}
      <div className={styles.controlsInstructions}>
        {phase === 'idle' && 'Click Start to begin the debate timer'}
        {phase === 'research' && 'Research phase in progress - Timer will advance to speaking phase automatically'}
        {phase === 'speaking' && isRunning && 'Speaking timer is running - Controls are available during speeches'}
        {phase === 'speaking' && !isRunning && 'Timer is paused - Click Resume or Start to continue'}
        {phase === 'paused' && 'Timer is paused - Click Resume to continue'}
        {phase === 'overtime' && 'Speaker is overtime - Consider stopping or moving to next speaker'}
        {phase === 'completed' && 'Debate completed - View summary or reset for new debate'}
      </div>
    </div>
  );
}