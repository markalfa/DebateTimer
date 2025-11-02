import React from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  formattedTime: string;
  timerColor: string;
  isWarning: boolean;
  isCritical: boolean;
  isOvertime: boolean;
  speakerName?: string;
  speakerRole?: string;
  phase: string;
  totalTime: number;
  currentTime: number;
}

export function Timer({
  formattedTime,
  timerColor,
  isWarning,
  isCritical,
  isOvertime,
  speakerName,
  speakerRole,
  phase,
  totalTime,
  currentTime
}: TimerProps) {
  const getTimerClassName = () => {
    let className = styles.timer;

    if (isOvertime) {
      className += ` ${styles.overtime}`;
    } else if (isCritical) {
      className += ` ${styles.critical}`;
    } else if (isWarning) {
      className += ` ${styles.warning}`;
    } else {
      className += ` ${styles.normal}`;
    }

    return className;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'research':
        return 'Research Time';
      case 'speaking':
        return 'Speaking Time';
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

  const getProgressPercentage = () => {
    if (totalTime <= 0) return 0;
    return Math.max(0, Math.min(100, (currentTime / totalTime) * 100));
  };

  return (
    <div className={styles.timerContainer}>
      {/* Phase indicator */}
      <div className={styles.phaseIndicator}>
        {getPhaseText()}
      </div>

      {/* Main timer display */}
      <div className={styles.timerDisplay}>
        <div
          className={getTimerClassName()}
          style={{ color: timerColor }}
        >
          {formattedTime}
        </div>

        {/* Progress ring */}
        <svg className={styles.progressRing} viewBox="0 0 200 200">
          <circle
            className={styles.progressRingBackground}
            cx="100"
            cy="100"
            r="90"
          />
          <circle
            className={styles.progressRingProgress}
            cx="100"
            cy="100"
            r="90"
            stroke={timerColor}
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
            style={{
              transition: 'stroke-dashoffset 0.3s ease',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>
      </div>

      {/* Speaker information */}
      {(speakerName || speakerRole) && (
        <div className={styles.speakerInfo}>
          {speakerName && (
            <div className={styles.speakerName}>
              {speakerName}
            </div>
          )}
          {speakerRole && (
            <div className={styles.speakerRole}>
              {speakerRole}
            </div>
          )}
        </div>
      )}

      {/* Status indicators */}
      <div className={styles.statusIndicators}>
        {isWarning && !isCritical && !isOvertime && (
          <div className={styles.statusWarning}>
            ⚠️ Warning: Low time
          </div>
        )}
        {isCritical && !isOvertime && (
          <div className={styles.statusCritical}>
            🔴 Critical: Very low time
          </div>
        )}
        {isOvertime && (
          <div className={styles.statusOvertime}>
            ⏰ Overtime!
          </div>
        )}
      </div>

      {/* Time statistics */}
      <div className={styles.timeStats}>
        <div className={styles.timeStat}>
          <span className={styles.statLabel}>Total:</span>
          <span className={styles.statValue}>{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className={styles.timeStat}>
          <span className={styles.statLabel}>Remaining:</span>
          <span className={styles.statValue} style={{ color: timerColor }}>
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}