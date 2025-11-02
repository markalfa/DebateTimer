import React from 'react';
import { FaEdit, FaBookmark } from 'react-icons/fa';
import styles from './TopicDisplay.module.css';

interface TopicDisplayProps {
  topic: string;
  phase: string;
  onEditTopic?: () => void;
  onSaveTopic?: () => void;
  isEditing?: boolean;
  editable?: boolean;
  showBookmark?: boolean;
  variant?: 'header' | 'card' | 'compact';
}

export function TopicDisplay({
  topic,
  phase,
  onEditTopic,
  onSaveTopic,
  isEditing = false,
  editable = false,
  showBookmark = false,
  variant = 'header'
}: TopicDisplayProps) {
  const getClassName = () => {
    let className = styles.topicDisplay;

    switch (variant) {
      case 'header':
        className += ` ${styles.headerVariant}`;
        break;
      case 'card':
        className += ` ${styles.cardVariant}`;
        break;
      case 'compact':
        className += ` ${styles.compactVariant}`;
        break;
    }

    if (isEditing) {
      className += ` ${styles.editing}`;
    }

    return className;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'setup':
        return 'Setup Phase';
      case 'research':
        return 'Research Time';
      case 'speaking':
        return 'Debate in Progress';
      case 'completed':
        return 'Debate Completed';
      default:
        return 'Ready to Start';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'research':
        return '#2196f3';
      case 'speaking':
        return '#4caf50';
      case 'completed':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  if (!topic.trim()) {
    return (
      <div className={getClassName()}>
        <div className={styles.noTopic}>
          <span className={styles.noTopicText}>No topic selected</span>
          {editable && (
            <button className={styles.selectTopicButton} onClick={onEditTopic}>
              Select Topic
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={getClassName()}>
      {/* Topic header with phase info */}
      <div className={styles.topicHeader}>
        <div className={styles.phaseInfo}>
          <span
            className={styles.phaseIndicator}
            style={{ color: getPhaseColor() }}
          >
            {getPhaseText()}
          </span>
          {showBookmark && (
            <FaBookmark className={styles.bookmarkIcon} color={getPhaseColor()} />
          )}
        </div>

        {/* Edit/Save buttons */}
        {editable && !isEditing && (
          <button
            className={styles.editButton}
            onClick={onEditTopic}
            title="Edit topic"
          >
            <FaEdit size={14} />
          </button>
        )}

        {editable && isEditing && onSaveTopic && (
          <button
            className={styles.saveButton}
            onClick={onSaveTopic}
            title="Save topic"
          >
            Save
          </button>
        )}
      </div>

      {/* Topic content */}
      <div className={styles.topicContent}>
        <h2 className={styles.topicText}>{topic}</h2>
      </div>

      {/* Topic metadata */}
      <div className={styles.topicMetadata}>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Words:</span>
          <span className={styles.metadataValue}>{topic.split(/\s+/).length}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Characters:</span>
          <span className={styles.metadataValue}>{topic.length}</span>
        </div>
      </div>

      {/* Topic status indicator */}
      <div className={styles.topicStatus}>
        <div
          className={styles.statusBar}
          style={{ backgroundColor: getPhaseColor() }}
        />
      </div>
    </div>
  );
}