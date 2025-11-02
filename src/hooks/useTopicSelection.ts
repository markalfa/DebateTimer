import { useState, useCallback } from 'react';
import { TopicUploadData, ValidationResult } from '../types';
import { validateTopicFile, parseTopicFile, selectRandomTopic, createTopicUploadData } from '../utils';

interface UseTopicSelectionOptions {
  onTopicSelected?: (topic: string) => void;
  onError?: (error: string) => void;
}

export function useTopicSelection(options: UseTopicSelectionOptions = {}) {
  const { onTopicSelected, onError } = options;

  const [topicType, setTopicType] = useState<'random' | 'specific'>('specific');
  const [specificTopic, setSpecificTopic] = useState('');
  const [uploadData, setUploadData] = useState<TopicUploadData | null>(null);
  const [selectedRandomTopic, setSelectedRandomTopic] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSelectingRandom, setIsSelectingRandom] = useState(false);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);

    try {
      // Validate file
      const validation = validateTopicFile(file);
      if (!validation.isValid) {
        const errorMessage = validation.errors.map(error => error.message).join(', ');
        onError?.(errorMessage);
        setIsUploading(false);
        return;
      }

      // Parse file contents
      const topics = await parseTopicFile(file);

      if (topics.length === 0) {
        onError?.('File must contain at least one valid topic');
        setIsUploading(false);
        return;
      }

      // Create upload data
      const data = createTopicUploadData(file, topics);
      setUploadData(data);

      // Auto-select first topic if no topic is currently selected
      if (!selectedRandomTopic) {
        const randomTopic = selectRandomTopic(topics);
        setSelectedRandomTopic(randomTopic);
        onTopicSelected?.(randomTopic);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [onTopicSelected, onError, selectedRandomTopic]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f => f.type.startsWith('text/') || f.name.endsWith('.csv'));

    if (file) {
      handleFileUpload(file);
    } else {
      onError?.('Please upload a text file (.txt or .csv)');
    }
  }, [handleFileUpload, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Select random topic
  const selectRandomTopicFromUpload = useCallback(() => {
    if (!uploadData || uploadData.topics.length === 0) {
      onError?.('No topics available for random selection');
      return;
    }

    setIsSelectingRandom(true);

    // Simulate random selection animation
    setTimeout(() => {
      try {
        const randomTopic = selectRandomTopic(uploadData.topics);
        setSelectedRandomTopic(randomTopic);
        setUploadData({ ...uploadData, selectedTopic: randomTopic });
        onTopicSelected?.(randomTopic);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to select random topic';
        onError?.(errorMessage);
      } finally {
        setIsSelectingRandom(false);
      }
    }, 1000); // 1 second animation
  }, [uploadData, onTopicSelected, onError]);

  // Select specific topic
  const selectSpecificTopic = useCallback((topic: string) => {
    setSpecificTopic(topic);
    onTopicSelected?.(topic);
  }, [onTopicSelected]);

  // Get current selected topic
  const getCurrentTopic = useCallback((): string | null => {
    if (topicType === 'specific') {
      return specificTopic.trim() || null;
    } else {
      return selectedRandomTopic;
    }
  }, [topicType, specificTopic, selectedRandomTopic]);

  // Validate current selection
  const validateCurrentSelection = useCallback((): ValidationResult => {
    const currentTopic = getCurrentTopic();

    if (!currentTopic) {
      return {
        isValid: false,
        errors: [{
          field: 'topic',
          message: 'Please select or enter a topic'
        }]
      };
    }

    if (currentTopic.length > 200) {
      return {
        isValid: false,
        errors: [{
          field: 'topic',
          message: 'Topic cannot exceed 200 characters'
        }]
      };
    }

    return {
      isValid: true,
      errors: []
    };
  }, [getCurrentTopic]);

  // Reset topic selection
  const resetSelection = useCallback(() => {
    setTopicType('specific');
    setSpecificTopic('');
    setUploadData(null);
    setSelectedRandomTopic(null);
  }, []);

  // Clear upload data
  const clearUploadData = useCallback(() => {
    setUploadData(null);
    setSelectedRandomTopic(null);
  }, []);

  // Get topic statistics from upload
  const getTopicStats = useCallback(() => {
    if (!uploadData) {
      return null;
    }

    return {
      totalTopics: uploadData.topics.length,
      fileName: uploadData.file.name,
      fileSize: uploadData.file.size,
      selectedTopic: selectedRandomTopic
    };
  }, [uploadData, selectedRandomTopic]);

  // Search topics in upload data
  const searchTopics = useCallback((query: string): string[] => {
    if (!uploadData) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return uploadData.topics.filter(topic =>
      topic.toLowerCase().includes(lowerQuery)
    );
  }, [uploadData]);

  // Check if topic selection is valid for starting debate
  const canStartDebate = useCallback((): boolean => {
    const validation = validateCurrentSelection();
    return validation.isValid;
  }, [validateCurrentSelection]);

  return {
    // State
    topicType,
    specificTopic,
    uploadData,
    selectedRandomTopic,
    isUploading,
    isSelectingRandom,

    // Actions
    setTopicType,
    setSpecificTopic,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    selectRandomTopicFromUpload,
    selectSpecificTopic,
    resetSelection,
    clearUploadData,

    // Helpers
    getCurrentTopic,
    validateCurrentSelection,
    getTopicStats,
    searchTopics,
    canStartDebate
  };
}