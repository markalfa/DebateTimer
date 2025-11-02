import React, { useRef } from 'react';
import { FaUpload, FaRandom, FaArrowLeft, FaFileAlt, FaCheck, FaSpinner } from 'react-icons/fa';
import { TopicUploadData } from '../../types';
import { getDisplayFileName } from '../../utils';
import styles from './StartScreen.module.css';

interface TopicUploadProps {
  onFileUpload: (file: File) => void;
  onTopicSelect: () => void;
  onBack: () => void;
  uploadData: TopicUploadData | null;
  isUploading: boolean;
  isSelecting: boolean;
}

export function TopicUpload({
  onFileUpload,
  onTopicSelect,
  onBack,
  uploadData,
  isUploading,
  isSelecting
}: TopicUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const file = files.find(f => f.type.startsWith('text/') || f.name.endsWith('.csv'));

    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.topicUpload}>
      <div className={styles.uploadHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <FaArrowLeft size={16} />
          Back
        </button>
        <h3 className={styles.uploadTitle}>Upload Topics File</h3>
      </div>

      {!uploadData ? (
        <div className={styles.uploadArea}>
          <div
            className={styles.dropZone}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
            <div className={styles.dropZoneContent}>
              <FaUpload size={48} className={styles.uploadIcon} />
              <h4 className={styles.dropZoneTitle}>
                {isUploading ? 'Processing file...' : 'Drop file here or click to browse'}
              </h4>
              <p className={styles.dropZoneDescription}>
                Accepts .txt and .csv files (max 1MB)
              </p>
              <p className={styles.dropZoneFormat}>
                One topic per line, empty lines will be ignored
              </p>
              {isUploading && (
                <div className={styles.uploadingSpinner}>
                  <FaSpinner className={styles.spinner} size={24} />
                  <span>Processing your topics...</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.uploadInstructions}>
            <h4 className={styles.instructionsTitle}>File Format Instructions</h4>
            <ul className={styles.instructionsList}>
              <li>Create a plain text file (.txt) or CSV file (.csv)</li>
              <li>Write each topic on a separate line</li>
              <li>Empty lines and lines starting with # will be ignored</li>
              <li>Maximum file size: 1MB (approximately 1000 topics)</li>
              <li>Encoding: UTF-8 supported</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className={styles.uploadSuccess}>
          <div className={styles.successHeader}>
            <FaCheck size={32} className={styles.successIcon} />
            <h4 className={styles.successTitle}>Topics Loaded Successfully</h4>
          </div>

          <div className={styles.fileInfo}>
            <div className={styles.fileDetails}>
              <FaFileAlt className={styles.fileIcon} />
              <div className={styles.fileMeta}>
                <div className={styles.fileName}>
                  {getDisplayFileName(uploadData.file)}
                </div>
                <div className={styles.fileStats}>
                  {uploadData.topics.length} topics loaded
                </div>
              </div>
            </div>
          </div>

          <div className={styles.topicsPreview}>
            <h5 className={styles.previewTitle}>Topic Preview</h5>
            <div className={styles.topicsList}>
              {uploadData.topics.slice(0, 5).map((topic, index) => (
                <div key={index} className={styles.previewTopic}>
                  {topic}
                </div>
              ))}
              {uploadData.topics.length > 5 && (
                <div className={styles.moreTopics}>
                  ... and {uploadData.topics.length - 5} more topics
                </div>
              )}
            </div>
          </div>

          <div className={styles.uploadActions}>
            <button
              className={`${styles.selectButton} ${styles.primaryButton}`}
              onClick={onTopicSelect}
              disabled={isSelecting}
            >
              {isSelecting ? (
                <>
                  <FaSpinner className={styles.spinner} size={16} />
                  Selecting Random Topic...
                </>
              ) : (
                <>
                  <FaRandom size={16} />
                  Select Random Topic
                </>
              )}
            </button>

            <button
              className={styles.uploadNewButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload size={16} />
              Upload Different File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
              className={styles.fileInput}
            />
          </div>

          {uploadData.selectedTopic && (
            <div className={styles.selectedTopic}>
              <h5 className={styles.selectedTitle}>Selected Topic:</h5>
              <div className={styles.selectedTopicText}>
                {uploadData.selectedTopic}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}