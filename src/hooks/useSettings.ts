import { useCallback } from 'react';
import { useSettingsContext } from '../context';
import { DebateSettings, Team } from '../types';

export function useSettings() {
  const {
    settings,
    updateSettings,
    resetSettings,
    savedTeams,
    saveTeamConfiguration,
    topicsHistory,
    addToTopicsHistory,
    lastTopic,
    setLastTopic
  } = useSettingsContext();

  // Individual setting update functions
  const updateResearchTime = useCallback((researchTime: number) => {
    updateSettings({ researchTime });
  }, [updateSettings]);

  const updateWarningThreshold = useCallback((warningThreshold: number) => {
    updateSettings({ warningThreshold });
  }, [updateSettings]);

  const updateAutoAdvance = useCallback((autoAdvance: boolean) => {
    updateSettings({ autoAdvance });
  }, [updateSettings]);

  const updateBreakDuration = useCallback((breakDuration: number) => {
    updateSettings({ breakDuration });
  }, [updateSettings]);

  const updateSoundNotifications = useCallback((soundNotifications: boolean) => {
    updateSettings({ soundNotifications });
  }, [updateSettings]);

  // Batch update function
  const updateMultipleSettings = useCallback((newSettings: Partial<DebateSettings>) => {
    updateSettings(newSettings);
  }, [updateSettings]);

  // Team management
  const loadSavedTeams = useCallback((): { teamA: Team | null; teamB: Team | null } => {
    return savedTeams;
  }, [savedTeams]);

  const hasSavedTeams = useCallback((): boolean => {
    return !!(savedTeams.teamA && savedTeams.teamB);
  }, [savedTeams]);

  const clearSavedTeams = useCallback(() => {
    saveTeamConfiguration({} as Team, {} as Team);
  }, [saveTeamConfiguration]);

  // Topic history management
  const addTopicToHistory = useCallback((topic: string) => {
    addToTopicsHistory(topic);
  }, [addToTopicsHistory]);

  const clearTopicHistory = useCallback(() => {
    // This would require extending the context to include clearing history
    // For now, users can only add to history
    console.log('Clear topic history functionality not implemented');
  }, []);

  const getRecentTopics = useCallback((limit: number = 5): string[] => {
    return topicsHistory.slice(0, limit);
  }, [topicsHistory]);

  const hasTopicHistory = useCallback((): boolean => {
    return topicsHistory.length > 0;
  }, [topicsHistory]);

  // Validation helpers
  const validateResearchTime = useCallback((time: number): boolean => {
    return time >= 0 && time <= 60;
  }, []);

  const validateWarningThreshold = useCallback((threshold: number): boolean => {
    return threshold >= 5 && threshold <= 50;
  }, []);

  const validateBreakDuration = useCallback((duration: number): boolean => {
    return duration >= 0 && duration <= 300; // 0 to 5 minutes
  }, []);

  // Settings export/import
  const exportSettings = useCallback((): string => {
    const exportData = {
      settings,
      teams: savedTeams,
      topicsHistory,
      lastTopic,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }, [settings, savedTeams, topicsHistory, lastTopic]);

  const importSettings = useCallback((settingsJson: string): boolean => {
    try {
      const importData = JSON.parse(settingsJson);

      // Validate imported data structure
      if (importData.settings) {
        updateSettings(importData.settings);
      }

      if (importData.teams && importData.teams.teamA && importData.teams.teamB) {
        saveTeamConfiguration(importData.teams.teamA, importData.teams.teamB);
      }

      if (importData.topicsHistory && Array.isArray(importData.topicsHistory)) {
        importData.topicsHistory.forEach((topic: string) => {
          addToTopicsHistory(topic);
        });
      }

      if (importData.lastTopic) {
        setLastTopic(importData.lastTopic);
      }

      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }, [updateSettings, saveTeamConfiguration, addToTopicsHistory, setLastTopic]);

  // Settings presets
  const applyPreset = useCallback((preset: 'beginner' | 'standard' | 'tournament') => {
    const presets = {
      beginner: {
        researchTime: 15,
        warningThreshold: 30,
        autoAdvance: false,
        breakDuration: 10,
        soundNotifications: true
      },
      standard: {
        researchTime: 10,
        warningThreshold: 25,
        autoAdvance: true,
        breakDuration: 5,
        soundNotifications: false
      },
      tournament: {
        researchTime: 5,
        warningThreshold: 20,
        autoAdvance: true,
        breakDuration: 3,
        soundNotifications: true
      }
    };

    updateSettings(presets[preset]);
  }, [updateSettings]);

  return {
    // Current settings
    settings,

    // Update functions
    updateResearchTime,
    updateWarningThreshold,
    updateAutoAdvance,
    updateBreakDuration,
    updateSoundNotifications,
    updateMultipleSettings,

    // Reset
    resetSettings,

    // Team management
    savedTeams,
    saveTeamConfiguration,
    loadSavedTeams,
    hasSavedTeams,
    clearSavedTeams,

    // Topic history
    topicsHistory,
    lastTopic,
    addTopicToHistory,
    setLastTopic,
    getRecentTopics,
    hasTopicHistory,
    clearTopicHistory,

    // Validation
    validateResearchTime,
    validateWarningThreshold,
    validateBreakDuration,

    // Export/Import
    exportSettings,
    importSettings,

    // Presets
    applyPreset
  };
}