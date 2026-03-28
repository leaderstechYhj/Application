import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const [tab, setTab] = useState('home');
  const { isDarkMode } = useApp();

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="top-spacer" />
      <div className="page-content">
        {tab === 'home' ? <HomePage /> : <SettingsPage />}
      </div>
      <nav className="tab-bar">
        <button
          className={`tab-btn${tab === 'home' ? ' active' : ''}`}
          onClick={() => setTab('home')}
        >
          <span className="tab-icon">⊞</span>
          <span className="tab-text">홈</span>
        </button>
        <button
          className={`tab-btn${tab === 'settings' ? ' active' : ''}`}
          onClick={() => setTab('settings')}
        >
          <span className="tab-icon">⚙</span>
          <span className="tab-text">설정</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
