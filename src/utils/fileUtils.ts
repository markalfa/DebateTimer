import { ValidationResult, TopicUploadData } from '../types';

/**
 * Validate uploaded file format and size
 */
export function validateTopicFile(file: File): ValidationResult {
  const errors: { field: string; message: string }[] = [];

  // Check file type
  const validTypes = ['text/plain', 'text/csv', 'application/vnd.ms-excel'];
  const validExtensions = ['.txt', '.csv'];

  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidType && !hasValidExtension) {
    errors.push({
      field: 'file',
      message: 'Please upload a .txt or .csv file'
    });
  }

  // Check file size (1MB limit)
  const maxSize = 1024 * 1024; // 1MB in bytes
  if (file.size > maxSize) {
    errors.push({
      field: 'file',
      message: 'File must be smaller than 1MB'
    });
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push({
      field: 'file',
      message: 'File cannot be empty'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Parse uploaded file for topics
 */
export async function parseTopicFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const topics = parseTopicContent(content);
        resolve(topics);
      } catch (error) {
        reject(new Error('Failed to parse file content'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Parse topic content from text
 */
export function parseTopicContent(content: string): string[] {
  // Split by lines and filter out empty lines and whitespace
  const lines = content.split(/\r?\n/);

  const topics = lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith('#')) // Filter out comment lines
    .map(line => line.replace(/^[-*•]\s*/, '')); // Remove list markers

  return topics;
}

/**
 * Select random topic from array
 */
export function selectRandomTopic(topics: string[]): string {
  if (topics.length === 0) {
    throw new Error('No topics available to select from');
  }

  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics[randomIndex];
}

/**
 * Create topic upload data object
 */
export function createTopicUploadData(file: File, topics: string[]): TopicUploadData {
  return {
    file,
    topics,
    selectedTopic: null
  };
}

/**
 * Extract filename without extension for display
 */
export function getDisplayFileName(file: File): string {
  const name = file.name;
  const lastDotIndex = name.lastIndexOf('.');
  return lastDotIndex > 0 ? name.substring(0, lastDotIndex) : name;
}