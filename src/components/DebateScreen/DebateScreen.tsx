import React from 'react';
import { TopicDisplay } from '../TopicDisplay';
import { Timer, TimerControls } from '../Timer';
import { TeamDisplay } from '../TeamDisplay';
import { useDebateState, useTimer } from '../../hooks';
import styles from './DebateScreen.module.css';

export function DebateScreen() {
  const {
    state,
    getCurrentSpeaker,
    getNextSpeaker,
    getCurrentTeam,
    getOpposingTeam,
    isDebateActive,
    isDebateCompleted,
    nextSpeaker,
    resetDebate
  } = useDebateState();

  const timer = useTimer(
    state.timerState,
    (action) => {
      // Handle timer actions - this would integrate with debate context
      console.log('Timer action:', action);
    },
    {
      onTimerComplete: () => {
        if (state.settings.autoAdvance && state.phase === 'speaking') {
          nextSpeaker();
        }
      },
      onPhaseChange: (phase) => {
        console.log('Timer phase changed:', phase);
      }
    }
  );

  const currentSpeaker = getCurrentSpeaker();
  const nextSpeakerData = getNextSpeaker();
  const currentTeam = getCurrentTeam();
  const opposingTeam = getOpposingTeam();

  const handleStart = () => {
    if (state.phase === 'setup') {
      // Would dispatch start research phase
      console.log('Starting debate');
    }
  };

  const handlePause = () => {
    timer.pause();
  };

  const handleResume = () => {
    timer.start();
  };

  const handleStop = () => {
    timer.stop();
  };

  const handleNext = () => {
    nextSpeaker();
  };

  const handleReset = () => {
    timer.reset();
    resetDebate();
  };

  return (
    <div className={styles.debateScreen}>
      {/* Topic Header */}
      <header className={styles.header}>
        <TopicDisplay
          topic={state.topic}
          phase={state.phase}
          variant="header"
          showBookmark={true}
        />
      </header>

      {/* Main Debate Layout */}
      <main className={styles.mainContent}>
        <div className={styles.debateLayout}>
          {/* Left Team */}
          <div className={styles.teamColumn}>
            <TeamDisplay
              team={state.teamA}
              currentSpeakerId={currentSpeaker?.id}
              nextSpeakerId={nextSpeakerData?.id}
              isActive={state.currentTeam === 'A'}
              isLeftTeam={true}
              showSpeakerDetails={true}
            />
          </div>

          {/* Center Timer */}
          <div className={styles.timerColumn}>
            <Timer
              formattedTime={timer.formattedTime}
              timerColor={timer.timerColor}
              isWarning={timer.isWarning}
              isCritical={timer.isCritical}
              isOvertime={timer.isOvertime}
              speakerName={currentSpeaker?.name}
              speakerRole={currentSpeaker?.role}
              phase={timer.phase}
              totalTime={timer.totalTime}
              currentTime={timer.currentTime}
            />

            <TimerControls
              isRunning={timer.isRunning}
              isPaused={timer.phase === 'paused'}
              phase={timer.phase}
              canStart={state.phase !== 'completed' && !timer.isRunning}
              canPause={timer.isRunning && timer.phase !== 'paused'}
              canStop={timer.isRunning || timer.phase === 'paused'}
              canNext={state.phase === 'speaking' && !isDebateCompleted()}
              canReset={true}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onStop={handleStop}
              onNext={handleNext}
              onReset={handleReset}
              disabled={isDebateCompleted()}
            />
          </div>

          {/* Right Team */}
          <div className={styles.teamColumn}>
            <TeamDisplay
              team={state.teamB}
              currentSpeakerId={currentSpeaker?.id}
              nextSpeakerId={nextSpeakerData?.id}
              isActive={state.currentTeam === 'B'}
              isLeftTeam={false}
              showSpeakerDetails={true}
            />
          </div>
        </div>
      </main>

      {/* Debate Status Bar */}
      <footer className={styles.footer}>
        <div className={styles.statusBar}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Phase:</span>
            <span className={styles.statusValue}>{state.phase}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Current Team:</span>
            <span className={styles.statusValue}>{state.currentTeam === 'A' ? state.teamA.name : state.teamB.name}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Debate Status:</span>
            <span className={`${styles.statusValue} ${isDebateActive() ? styles.active : styles.inactive}`}>
              {isDebateActive() ? 'In Progress' : isDebateCompleted() ? 'Completed' : 'Ready'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}