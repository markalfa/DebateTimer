import React, { useState } from 'react';
import { FaUpload, FaRandom, FaEdit, FaHistory, FaArrowRight } from 'react-icons/fa';
import { TopicDisplay } from '../TopicDisplay';
import { TopicUpload } from './TopicUpload';
import { TopicInput } from './TopicInput';
import { useDebateState, useSettings, useTopicSelection } from '../../hooks';
import styles from './StartScreen.module.css';

export function StartScreen() {
  const [showTopicUpload, setShowTopicUpload] = useState(false);
  const [showTopicInput, setShowTopicInput] = useState(false);

  const { setTopic, goToSettingsScreen, goToDebateScreen, state } = useDebateState();
  const { addTopicToHistory, topicsHistory } = useSettings();
  const {
    topicType,
    specificTopic,
    uploadData,
    selectedRandomTopic,
    isUploading,
    isSelectingRandom,
    setTopicType,
    setSpecificTopic,
    handleFileUpload,
    selectRandomTopicFromUpload,
    clearUploadData,
    getCurrentTopic,
    canStartDebate
  } = useTopicSelection({
    onTopicSelected: (topic) => {
      setTopic(topic);
      addTopicToHistory(topic);
    }
  });

  const handleTopicTypeSelect = (type: 'random' | 'specific') => {
    setTopicType(type);
    if (type === 'random') {
      setShowTopicUpload(true);
      setShowTopicInput(false);
    } else {
      setShowTopicInput(true);
      setShowTopicUpload(false);
    }
  };

  const handleTopicSet = (topic: string) => {
    setTopic(topic);
    addTopicToHistory(topic);
    setShowTopicUpload(false);
    setShowTopicInput(false);
  };

  const handleStartDebate = () => {
    if (canStartDebate()) {
      goToDebateScreen();
    }
  };

  const handleGoToSettings = () => {
    goToSettingsScreen();
  };

  const currentTopic = getCurrentTopic() || state.topic;

  return (
    <div className={styles.startScreen}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Debate Timer</h1>
          <p className={styles.subtitle}>
            Professional debate timing and management system
          </p>
        </header>

        {/* Topic Selection */}
        <div className={styles.topicSection}>
          <h2 className={styles.sectionTitle}>Select Debate Topic</h2>

          {/* Topic type selection */}
          {!showTopicUpload && !showTopicInput && (
            <div className={styles.topicTypeSelection}>
              <div className={styles.topicTypeCard} onClick={() => handleTopicTypeSelect('specific')}>
                <div className={styles.topicTypeIcon}>
                  <FaEdit size={32} />
                </div>
                <h3 className={styles.topicTypeName}>Specific Topic</h3>
                <p className={styles.topicTypeDescription}>
                  Enter or manually select a debate topic
                </p>
                <button className={styles.selectButton}>
                  Choose Topic
                </button>
              </div>

              <div className={styles.topicTypeCard} onClick={() => handleTopicTypeSelect('random')}>
                <div className={styles.topicTypeIcon}>
                  <FaRandom size={32} />
                </div>
                <h3 className={styles.topicTypeName}>Random Topic</h3>
                <p className={styles.topicTypeDescription}>
                  Upload a file with topics and select randomly
                </p>
                <button className={styles.selectButton}>
                  Upload Topics
                </button>
              </div>
            </div>
          )}

          {/* Topic Upload Component */}
          {showTopicUpload && (
            <TopicUpload
              onFileUpload={handleFileUpload}
              onTopicSelect={selectRandomTopicFromUpload}
              onBack={() => setShowTopicUpload(false)}
              uploadData={uploadData}
              isUploading={isUploading}
              isSelecting={isSelectingRandom}
            />
          )}

          {/* Topic Input Component */}
          {showTopicInput && (
            <TopicInput
              initialTopic={specificTopic}
              onTopicSet={handleTopicSet}
              onBack={() => setShowTopicInput(false)}
              topicHistory={topicsHistory}
            />
          )}

          {/* Current Topic Display */}
          {currentTopic && !showTopicUpload && !showTopicInput && (
            <div className={styles.currentTopicSection}>
              <TopicDisplay
                topic={currentTopic}
                phase={state.phase}
                variant="card"
                editable={true}
                onEditTopic={() => {
                  if (topicType === 'specific') {
                    setShowTopicInput(true);
                  } else {
                    setShowTopicUpload(true);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {currentTopic && !showTopicUpload && !showTopicInput && (
          <div className={styles.quickActions}>
            <h3 className={styles.actionsTitle}>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button
                className={`${styles.actionButton} ${styles.primaryAction}`}
                onClick={handleStartDebate}
                disabled={!canStartDebate()}
              >
                <FaArrowRight size={16} />
                Start Debate
              </button>

              <button
                className={styles.actionButton}
                onClick={handleGoToSettings}
              >
                Configure Settings
              </button>

              {topicType === 'random' && uploadData && (
                <button
                  className={styles.actionButton}
                  onClick={selectRandomTopicFromUpload}
                  disabled={isSelectingRandom}
                >
                  <FaRandom size={16} />
                  {isSelectingRandom ? 'Selecting...' : 'New Random Topic'}
                </button>
              )}

              {topicType === 'random' && uploadData && (
                <button
                  className={styles.actionButton}
                  onClick={clearUploadData}
                >
                  Clear Uploaded Topics
                </button>
              )}
            </div>
          </div>
        )}

        {/* Topic History */}
        {topicsHistory.length > 0 && !showTopicUpload && !showTopicInput && (
          <div className={styles.topicHistory}>
            <h3 className={styles.historyTitle}>
              <FaHistory size={16} />
              Recent Topics
            </h3>
            <div className={styles.historyList}>
              {topicsHistory.slice(0, 3).map((topic, index) => (
                <div
                  key={index}
                  className={styles.historyItem}
                  onClick={() => handleTopicSet(topic)}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!currentTopic && !showTopicUpload && !showTopicInput && (
          <div className={styles.instructions}>
            <h3 className={styles.instructionsTitle}>Getting Started</h3>
            <div className={styles.instructionsList}>
              <div className={styles.instructionItem}>
                <span className={styles.instructionNumber}>1</span>
                <span className={styles.instructionText}>
                  Choose a topic selection method above
                </span>
              </div>
              <div className={styles.instructionItem}>
                <span className={styles.instructionNumber}>2</span>
                <span className={styles.instructionText}>
                  Select or enter your debate topic
                </span>
              </div>
              <div className={styles.instructionItem}>
                <span className={styles.instructionNumber}>3</span>
                <span className={styles.instructionText}>
                  Configure settings and start the debate
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}