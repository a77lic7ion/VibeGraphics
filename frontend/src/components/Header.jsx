import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import './Header.css';

const Header = ({ onOpenSettings, backendStatus }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <Sparkles size={32} className="brand-icon" />
          <div>
            <h1>VibeGraphics</h1>
            <p className="brand-tagline">AI-Powered Infographic Creator</p>
          </div>
        </div>
        <div className="header-actions">
          <div className={`status-indicator status-${backendStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {backendStatus === 'online' ? 'Connected' : 
               backendStatus === 'offline' ? 'Backend Offline' : 
               'Checking...'}
            </span>
          </div>
          <button className="btn btn-ghost" onClick={onOpenSettings}>
            <Settings size={20} />
            Settings
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
