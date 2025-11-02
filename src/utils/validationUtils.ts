import { ValidationResult, SettingsValidationError, SpeakerFormData, TeamFormData } from '../types';
import { Speaker, Team } from '../types';

/**
 * Validate time format (MM:SS)
 */
export function validateTimeFormat(timeString: string): ValidationResult {
  const errors: SettingsValidationError[] = [];

  // Check if format is correct (MM:SS)
  const timePattern = /^([0-9]?[0-9]):([0-5][0-9])$/;
  if (!timePattern.test(timeString)) {
    errors.push({
      field: 'timeFormat',
      message: 'Please enter valid time in MM:SS format'
    });
    return { isValid: false, errors };
  }

  // Parse time and check ranges
  const parts = timeString.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  const totalSeconds = minutes * 60 + seconds;

  if (totalSeconds < 30) {
    errors.push({
      field: 'timeMinimum',
      message: 'Time must be at least 30 seconds'
    });
  }

  if (totalSeconds > 3600) {
    errors.push({
      field: 'timeMaximum',
      message: 'Time cannot exceed 60 minutes'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate speaker name
 */
export function validateSpeakerName(name: string, teamSpeakers: Speaker[] = [], excludeId?: string): ValidationResult {
  const errors: SettingsValidationError[] = [];

  const trimmedName = name.trim();

  if (!trimmedName) {
    errors.push({
      field: 'speakerName',
      message: 'Speaker name is required'
    });
  }

  if (trimmedName.length > 50) {
    errors.push({
      field: 'speakerName',
      message: 'Speaker name cannot exceed 50 characters'
    });
  }

  // Check for uniqueness within team
  const isDuplicate = teamSpeakers.some(speaker =>
    speaker.name.toLowerCase() === trimmedName.toLowerCase() && speaker.id !== excludeId
  );

  if (isDuplicate) {
    errors.push({
      field: 'speakerName',
      message: 'Speaker names must be unique within each team'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate speaker role
 */
export function validateSpeakerRole(role: string): ValidationResult {
  const errors: SettingsValidationError[] = [];

  const trimmedRole = role.trim();

  if (!trimmedRole) {
    errors.push({
      field: 'speakerRole',
      message: 'Speaker role is required'
    });
  }

  if (trimmedRole.length > 100) {
    errors.push({
      field: 'speakerRole',
      message: 'Speaker role cannot exceed 100 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate team name
 */
export function validateTeamName(name: string): ValidationResult {
  const errors: SettingsValidationError[] = [];

  const trimmedName = name.trim();

  if (!trimmedName) {
    errors.push({
      field: 'teamName',
      message: 'Team name is required'
    });
  }

  if (trimmedName.length > 100) {
    errors.push({
      field: 'teamName',
      message: 'Team name cannot exceed 100 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate debate topic
 */
export function validateTopic(topic: string): ValidationResult {
  const errors: SettingsValidationError[] = [];

  const trimmedTopic = topic.trim();

  if (!trimmedTopic) {
    errors.push({
      field: 'topic',
      message: 'Please select or enter a topic before starting'
    });
  }

  if (trimmedTopic.length > 200) {
    errors.push({
      field: 'topic',
      message: 'Topic cannot exceed 200 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate research time
 */
export function validateResearchTime(minutes: number): ValidationResult {
  const errors: SettingsValidationError[] = [];

  if (minutes < 0) {
    errors.push({
      field: 'researchTime',
      message: 'Research time cannot be negative'
    });
  }

  if (minutes > 60) {
    errors.push({
      field: 'researchTime',
      message: 'Research time cannot exceed 60 minutes'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate complete speaker form
 */
export function validateSpeakerForm(formData: SpeakerFormData, teamSpeakers: Speaker[] = [], excludeId?: string): ValidationResult {
  const timeValidation = validateTimeFormat(formData.timeLimit);
  const nameValidation = validateSpeakerName(formData.name, teamSpeakers, excludeId);
  const roleValidation = validateSpeakerRole(formData.role);

  const allErrors = [
    ...timeValidation.errors,
    ...nameValidation.errors,
    ...roleValidation.errors
  ];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

/**
 * Validate complete team form
 */
export function validateTeamForm(formData: TeamFormData, existingTeams: Team[] = [], excludeTeamId?: string): ValidationResult {
  const errors: SettingsValidationError[] = [];

  // Validate team name
  const nameValidation = validateTeamName(formData.name);
  errors.push(...nameValidation.errors);

  // Check for team name uniqueness
  const isDuplicateTeam = existingTeams.some(team =>
    team.name.toLowerCase() === formData.name.trim().toLowerCase() && team.id !== excludeTeamId
  );

  if (isDuplicateTeam) {
    errors.push({
      field: 'teamName',
      message: 'Team names must be unique'
    });
  }

  // Validate each speaker
  formData.speakers.forEach((speaker, index) => {
    const speakerValidation = validateSpeakerForm(speaker);
    speakerValidation.errors.forEach(error => {
      errors.push({
        ...error,
        field: `speaker${index}${error.field.charAt(0).toUpperCase() + error.field.slice(1)}`
      });
    });
  });

  // Check if team has at least one speaker
  if (formData.speakers.length === 0) {
    errors.push({
      field: 'speakers',
      message: 'Each team must have at least one speaker'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate complete debate configuration
 */
export function validateDebateConfiguration(
  topic: string,
  teamA: Team,
  teamB: Team,
  researchTime: number
): ValidationResult {
  const errors: SettingsValidationError[] = [];

  // Validate topic
  const topicValidation = validateTopic(topic);
  errors.push(...topicValidation.errors);

  // Validate teams
  const teamAValidation = validateTeamForm({
    name: teamA.name,
    speakers: teamA.speakers.map(s => ({
      name: s.name,
      role: s.role,
      timeLimit: formatTime(s.timeLimit)
    }))
  }, [teamB], teamA.id);

  const teamBValidation = validateTeamForm({
    name: teamB.name,
    speakers: teamB.speakers.map(s => ({
      name: s.name,
      role: s.role,
      timeLimit: formatTime(s.timeLimit)
    }))
  }, [teamA], teamB.id);

  errors.push(...teamAValidation.errors, ...teamBValidation.errors);

  // Validate research time
  const researchValidation = validateResearchTime(researchTime);
  errors.push(...researchValidation.errors);

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper function to format time for validation (reuse from timerUtils)
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}