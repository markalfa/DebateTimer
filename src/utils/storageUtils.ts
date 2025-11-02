import { DebateState, DebateSettings, Team, Speaker } from '../types';

// Storage keys
const STORAGE_KEYS = {
  DEBATE_STATE: 'debateTimer_state',
  SETTINGS: 'debateTimer_settings',
  TEAMS: 'debateTimer_teams',
  TOPICS_HISTORY: 'debateTimer_topicsHistory',
  LAST_TOPIC: 'debateTimer_lastTopic'
} as const;

/**
 * Save debate state to localStorage
 */
export function saveDebateState(state: DebateState): void {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEYS.DEBATE_STATE, serializedState);
  } catch (error) {
    console.warn('Failed to save debate state:', error);
  }
}

/**
 * Load debate state from localStorage
 */
export function loadDebateState(): DebateState | null {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEYS.DEBATE_STATE);
    if (!serializedState) return null;

    return JSON.parse(serializedState) as DebateState;
  } catch (error) {
    console.warn('Failed to load debate state:', error);
    return null;
  }
}

/**
 * Clear debate state from localStorage
 */
export function clearDebateState(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DEBATE_STATE);
  } catch (error) {
    console.warn('Failed to clear debate state:', error);
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: DebateSettings): void {
  try {
    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, serializedSettings);
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): DebateSettings | null {
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!serializedSettings) return null;

    return JSON.parse(serializedSettings) as DebateSettings;
  } catch (error) {
    console.warn('Failed to load settings:', error);
    return null;
  }
}

/**
 * Save teams configuration to localStorage
 */
export function saveTeams(teamA: Team, teamB: Team): void {
  try {
    const teamsData = JSON.stringify({ teamA, teamB });
    localStorage.setItem(STORAGE_KEYS.TEAMS, teamsData);
  } catch (error) {
    console.warn('Failed to save teams:', error);
  }
}

/**
 * Load teams configuration from localStorage
 */
export function loadTeams(): { teamA: Team | null; teamB: Team | null } {
  try {
    const teamsData = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!teamsData) return { teamA: null, teamB: null };

    const { teamA, teamB } = JSON.parse(teamsData);
    return { teamA, teamB };
  } catch (error) {
    console.warn('Failed to load teams:', error);
    return { teamA: null, teamB: null };
  }
}

/**
 * Save topic to history
 */
export function saveTopicToHistory(topic: string): void {
  try {
    const history = loadTopicsHistory();
    const updatedHistory = [topic, ...history.filter(t => t !== topic)].slice(0, 5); // Keep last 5 topics
    localStorage.setItem(STORAGE_KEYS.TOPICS_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to save topic to history:', error);
  }
}

/**
 * Load topics history from localStorage
 */
export function loadTopicsHistory(): string[] {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.TOPICS_HISTORY);
    return history ? JSON.parse(history) as string[] : [];
  } catch (error) {
    console.warn('Failed to load topics history:', error);
    return [];
  }
}

/**
 * Save last used topic
 */
export function saveLastTopic(topic: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_TOPIC, topic);
  } catch (error) {
    console.warn('Failed to save last topic:', error);
  }
}

/**
 * Load last used topic
 */
export function loadLastTopic(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_TOPIC);
  } catch (error) {
    console.warn('Failed to load last topic:', error);
    return null;
  }
}

/**
 * Get default settings
 */
export function getDefaultSettings(): DebateSettings {
  return {
    researchTime: 10, // 10 minutes
    warningThreshold: 25, // 25%
    autoAdvance: true,
    breakDuration: 5, // 5 seconds
    soundNotifications: false
  };
}

/**
 * Get settings from localStorage or return defaults
 */
export function getSettingsOrDefaults(): DebateSettings {
  const savedSettings = loadSettings();
  return savedSettings || getDefaultSettings();
}

/**
 * Create default team structure
 */
export function createDefaultTeam(name: string, teamId: string): Team {
  return {
    id: teamId,
    name,
    speakers: [
      {
        id: `${teamId}_speaker_1`,
        name: 'Speaker 1',
        role: 'Opening Speaker',
        timeLimit: 180, // 3 minutes
        speakingOrder: 1
      }
    ]
  };
}

/**
 * Migrate old settings format if needed
 */
export function migrateSettings(): void {
  try {
    // Check if we need to migrate from old format
    const oldSettings = localStorage.getItem('debateSettings'); // hypothetical old key
    if (oldSettings && !localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      // Migration logic here if needed
      console.log('Migrating settings to new format');
      // For now, just save with new format using defaults
      saveSettings(getDefaultSettings());
    }
  } catch (error) {
    console.warn('Settings migration failed:', error);
  }
}

/**
 * Clear all debate timer data from localStorage
 */
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear all data:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}