import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DebateSettings, Team } from '../types';
import {
  getSettingsOrDefaults,
  saveSettings,
  loadTeams,
  saveTeams,
  loadTopicsHistory,
  saveTopicToHistory,
  loadLastTopic,
  saveLastTopic
} from '../utils';

interface SettingsContextType {
  settings: DebateSettings;
  updateSettings: (settings: Partial<DebateSettings>) => void;
  resetSettings: () => void;
  savedTeams: { teamA: Team | null; teamB: Team | null };
  saveTeamConfiguration: (teamA: Team, teamB: Team) => void;
  topicsHistory: string[];
  addToTopicsHistory: (topic: string) => void;
  lastTopic: string | null;
  setLastTopic: (topic: string) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DebateSettings>(getSettingsOrDefaults());
  const [savedTeams, setSavedTeams] = useState<{ teamA: Team | null; teamB: Team | null }>({ teamA: null, teamB: null });
  const [topicsHistory, setTopicsHistory] = useState<string[]>([]);
  const [lastTopic, setLastTopicState] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = getSettingsOrDefaults();
    setSettings(loadedSettings);
  }, []);

  // Load saved teams on mount
  useEffect(() => {
    const teams = loadTeams();
    setSavedTeams(teams);
  }, []);

  // Load topics history on mount
  useEffect(() => {
    const history = loadTopicsHistory();
    setTopicsHistory(history);
  }, []);

  // Load last topic on mount
  useEffect(() => {
    const topic = loadLastTopic();
    setLastTopicState(topic);
  }, []);

  // Update settings
  const updateSettings = (newSettings: Partial<DebateSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  // Reset settings to defaults
  const resetSettings = () => {
    const defaultSettings = {
      researchTime: 10,
      warningThreshold: 25,
      autoAdvance: true,
      breakDuration: 5,
      soundNotifications: false
    };
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  };

  // Save team configuration
  const saveTeamConfiguration = (teamA: Team, teamB: Team) => {
    setSavedTeams({ teamA, teamB });
    saveTeams(teamA, teamB);
  };

  // Add topic to history
  const addToTopicsHistory = (topic: string) => {
    saveTopicToHistory(topic);
    setTopicsHistory(prev => {
      const updated = [topic, ...prev.filter(t => t !== topic)].slice(0, 5);
      return updated;
    });
  };

  // Set last topic
  const setLastTopic = (topic: string) => {
    saveLastTopic(topic);
    setLastTopicState(topic);
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    savedTeams,
    saveTeamConfiguration,
    topicsHistory,
    addToTopicsHistory,
    lastTopic,
    setLastTopic
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}