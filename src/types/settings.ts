export interface SettingsValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: SettingsValidationError[];
}

export interface TopicUploadData {
  file: File;
  topics: string[];
  selectedTopic: string | null;
}

export interface SpeakerFormData {
  name: string;
  role: string;
  timeLimit: string; // MM:SS format
}

export interface TeamFormData {
  name: string;
  speakers: SpeakerFormData[];
}