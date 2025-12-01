import React, { useState, useEffect } from 'react';
import useAppStore from './store/appStore';
import { healthCheck } from './services/api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import TemplateGallery from './components/TemplateGallery';
import TopicInput from './components/TopicInput';
import ManualInput from './components/ManualInput';
import InfographicEditor from './components/InfographicEditor';
import SettingsModal from './components/SettingsModal';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const {
    currentView,
    loading, loadingMessage,
    error, setError
  } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  const checkBackend = async () => {
    try {
      await healthCheck();
      setBackendStatus('online');
    } catch (err) {
      console.error(err); // Added console.error
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'templates':
        return <TemplateGallery />;
      case 'topic':
        return <TopicInput />;
      case 'manual':
        return <ManualInput />;
      case 'editor':
        return <InfographicEditor />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container"> {/* Changed class from "app" to "app-container" */}
        <Header
          backendStatus={backendStatus}
          onOpenSettings={() => setShowSettings(true)}
        />

        <div className="main-layout"> {/* Changed class from "app-container" to "main-layout" */}
          <Sidebar />
          <main className="content-area"> {/* Changed class from "app-main" to "content-area" */}
            {error && (
              <div className="error-banner">
                <span>{error}</span> {/* Removed ⚠️ emoji */}
                <button onClick={() => setError(null)}>Dismiss</button> {/* Changed button text and setError call */}
              </div>
            )}

            {renderContent()} {/* Changed renderView() to renderContent() */}
          </main>
        </div>

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>{loadingMessage}</p> {/* Simplified loading message */}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
