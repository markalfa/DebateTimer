import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaSave, FaHistory, FaLightbulb } from 'react-icons/fa';
import styles from './StartScreen.module.css';

interface TopicInputProps {
  initialTopic: string;
  onTopicSet: (topic: string) => void;
  onBack: () => void;
  topicHistory: string[];
}

const SAMPLE_TOPICS = [
  "Technology enhances human connection more than it isolates us",
  "Social media does more harm than good to society",
  "Artificial intelligence will be more beneficial than harmful to humanity",
  "Climate change is the most pressing issue facing our generation",
  "Traditional education is more effective than online learning",
  "Universal basic income is necessary for future economic stability",
  "Space exploration is worth the cost and resources",
  "Renewable energy can completely replace fossil fuels in the next decade",
  "Remote work is better than traditional office work for productivity",
  "Gaming should be considered a legitimate sport"
];

export function TopicInput({
  initialTopic,
  onTopicSet,
  onBack,
  topicHistory
}: TopicInputProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTopic = event.target.value;
    if (newTopic.length <= 200) {
      setTopic(newTopic);
    }
  };

  const handleSaveTopic = () => {
    const trimmedTopic = topic.trim();
    if (trimmedTopic) {
      onTopicSet(trimmedTopic);
    }
  };

  const handleUseSampleTopic = (sampleTopic: string) => {
    setTopic(sampleTopic);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleUseHistoryTopic = (historyTopic: string) => {
    setTopic(historyTopic);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSaveTopic();
    }
  };

  const characterCount = topic.length;
  const isValid = topic.trim().length > 0 && topic.trim().length <= 200;

  return (
    <div className={styles.topicInput}>
      <div className={styles.inputHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <FaArrowLeft size={16} />
          Back
        </button>
        <h3 className={styles.inputTitle}>Enter Debate Topic</h3>
      </div>

      <div className={styles.inputArea}>
        <div className={styles.textareaContainer}>
          <textarea
            ref={textareaRef}
            value={topic}
            onChange={handleTopicChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your debate topic here..."
            className={styles.topicTextarea}
            maxLength={200}
            rows={3}
          />
          <div className={styles.textareaFooter}>
            <div className={styles.characterCount}>
              <span className={characterCount > 180 ? styles.warning : ''}>
                {characterCount}/200
              </span>
            </div>
            <div className={styles.keyboardHint}>
              Ctrl+Enter to save
            </div>
          </div>
        </div>

        <div className={styles.inputActions}>
          <button
            className={`${styles.saveButton} ${styles.primaryButton} ${!isValid ? styles.disabled : ''}`}
            onClick={handleSaveTopic}
            disabled={!isValid}
          >
            <FaSave size={16} />
            Save Topic
          </button>
        </div>
      </div>

      {/* Topic Suggestions */}
      <div className={styles.suggestionsSection}>
        <button
          className={styles.suggestionsToggle}
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <FaLightbulb size={16} />
          {showSuggestions ? 'Hide' : 'Show'} Sample Topics
        </button>

        {showSuggestions && (
          <div className={styles.suggestionsList}>
            <h4 className={styles.suggestionsTitle}>Sample Debate Topics</h4>
            <div className={styles.sampleTopics}>
              {SAMPLE_TOPICS.map((sampleTopic, index) => (
                <div
                  key={index}
                  className={styles.sampleTopic}
                  onClick={() => handleUseSampleTopic(sampleTopic)}
                >
                  {sampleTopic}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Topic History */}
      {topicHistory.length > 0 && (
        <div className={styles.historySection}>
          <h4 className={styles.historyTitle}>
            <FaHistory size={16} />
            Recent Topics
          </h4>
          <div className={styles.historyTopics}>
            {topicHistory.slice(0, 5).map((historyTopic, index) => (
              <div
                key={index}
                className={styles.historyTopic}
                onClick={() => handleUseHistoryTopic(historyTopic)}
              >
                {historyTopic}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={styles.inputInstructions}>
        <h4 className={styles.instructionsTitle}>Topic Guidelines</h4>
        <ul className={styles.instructionsList}>
          <li>Keep topics clear and debatable with multiple viewpoints</li>
          <li>Avoid topics that are too specific or too broad</li>
          <li>Frame topics as statements that can be argued for or against</li>
          <li>Consider topics relevant to your audience and time constraints</li>
          <li>Maximum 200 characters to ensure readability</li>
        </ul>
      </div>

      {/* Validation Message */}
      {topic.trim().length > 0 && !isValid && (
        <div className={styles.validationMessage}>
          Topic must be between 1 and 200 characters
        </div>
      )}
    </div>
  );
}