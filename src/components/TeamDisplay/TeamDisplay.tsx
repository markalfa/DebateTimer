import React from 'react';
import { Team, Speaker } from '../../types';
import { formatTime } from '../../utils';
import styles from './TeamDisplay.module.css';

interface TeamDisplayProps {
  team: Team;
  currentSpeakerId?: string | null;
  nextSpeakerId?: string | null;
  isActive?: boolean;
  isLeftTeam?: boolean;
  showSpeakerDetails?: boolean;
}

export function TeamDisplay({
  team,
  currentSpeakerId,
  nextSpeakerId,
  isActive = false,
  isLeftTeam = true,
  showSpeakerDetails = true
}: TeamDisplayProps) {
  const getSpeakerStatus = (speaker: Speaker) => {
    if (speaker.id === currentSpeakerId) {
      return 'current';
    }
    if (speaker.id === nextSpeakerId) {
      return 'next';
    }
    return 'upcoming';
  };

  const getSpeakerClassName = (speaker: Speaker) => {
    const status = getSpeakerStatus(speaker);
    let className = styles.speaker;

    if (status === 'current') {
      className += ` ${styles.currentSpeaker}`;
    } else if (status === 'next') {
      className += ` ${styles.nextSpeaker}`;
    } else {
      className += ` ${styles.upcomingSpeaker}`;
    }

    return className;
  };

  const currentSpeaker = team.speakers.find(s => s.id === currentSpeakerId);
  const nextSpeaker = team.speakers.find(s => s.id === nextSpeakerId);

  return (
    <div className={`${styles.teamDisplay} ${isActive ? styles.activeTeam : ''} ${isLeftTeam ? styles.leftTeam : styles.rightTeam}`}>
      {/* Team Header */}
      <div className={styles.teamHeader}>
        <h2 className={styles.teamName}>{team.name}</h2>
        <div className={styles.teamStats}>
          <span className={styles.speakerCount}>
            {team.speakers.length} {team.speakers.length === 1 ? 'Speaker' : 'Speakers'}
          </span>
        </div>
      </div>

      {/* Current Speaker Highlight */}
      {currentSpeaker && isActive && (
        <div className={styles.currentSpeakerSection}>
          <div className={styles.currentSpeakerLabel}>
            Currently Speaking
          </div>
          <div className={styles.currentSpeakerInfo}>
            <div className={styles.currentSpeakerName}>
              {currentSpeaker.name}
            </div>
            <div className={styles.currentSpeakerRole}>
              {currentSpeaker.role}
            </div>
            <div className={styles.currentSpeakerTime}>
              Time Limit: {formatTime(currentSpeaker.timeLimit)}
            </div>
          </div>
        </div>
      )}

      {/* Next Speaker Preview */}
      {nextSpeaker && !isActive && (
        <div className={styles.nextSpeakerSection}>
          <div className={styles.nextSpeakerLabel}>
            Next Speaker
          </div>
          <div className={styles.nextSpeakerInfo}>
            <div className={styles.nextSpeakerName}>
              {nextSpeaker.name}
            </div>
            <div className={styles.nextSpeakerRole}>
              {nextSpeaker.role}
            </div>
          </div>
        </div>
      )}

      {/* Speaker List */}
      <div className={styles.speakerList}>
        <h3 className={styles.speakerListTitle}>Speaking Order</h3>
        <div className={styles.speakers}>
          {team.speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className={getSpeakerClassName(speaker)}
            >
              <div className={styles.speakerOrder}>
                {index + 1}
              </div>
              <div className={styles.speakerInfo}>
                <div className={styles.speakerName}>
                  {speaker.name}
                </div>
                {showSpeakerDetails && (
                  <>
                    <div className={styles.speakerRole}>
                      {speaker.role}
                    </div>
                    <div className={styles.speakerTime}>
                      {formatTime(speaker.timeLimit)}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.speakerStatus}>
                {getSpeakerStatus(speaker) === 'current' && (
                  <span className={styles.statusCurrent}>Speaking</span>
                )}
                {getSpeakerStatus(speaker) === 'next' && (
                  <span className={styles.statusNext}>Next</span>
                )}
                {getSpeakerStatus(speaker) === 'upcoming' && (
                  <span className={styles.statusUpcoming}>Ready</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Summary */}
      <div className={styles.teamSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Speaking Time:</span>
          <span className={styles.summaryValue}>
            {formatTime(team.speakers.reduce((total, speaker) => total + speaker.timeLimit, 0))}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Average Time:</span>
          <span className={styles.summaryValue}>
            {formatTime(Math.floor(team.speakers.reduce((total, speaker) => total + speaker.timeLimit, 0) / team.speakers.length))}
          </span>
        </div>
      </div>
    </div>
  );
}