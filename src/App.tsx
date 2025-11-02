import React from 'react';
import { DebateProvider, SettingsProvider } from './context';
import { StartScreen } from './components/StartScreen';
import { DebateScreen } from './components/DebateScreen';
import { useDebateState } from './hooks';
import styles from './App.css';

function AppContent() {
  const { state } = useDebateState();

  // Simple routing based on current screen
  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'start':
        return <StartScreen />;
      case 'debate':
        return <DebateScreen />;
      case 'settings':
        return <div>Settings Screen (Coming Soon)</div>;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className={styles.app}>
      {renderCurrentScreen()}
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <DebateProvider>
        <AppContent />
      </DebateProvider>
    </SettingsProvider>
  );
}

export default App;