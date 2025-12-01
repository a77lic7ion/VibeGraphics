import React from 'react';
import useAppStore from '../store/appStore';
import { Globe, FileText, Layout, Sparkles, Zap, Palette } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const { setCurrentView, apiKey } = useAppStore();

  const features = [
    {
      icon: Globe,
      title: 'Topic Research',
      description: 'Enter a topic and let AI research and design for you',
      action: 'topic',
      color: '#8b5cf6'
    },
    {
      icon: FileText,
      title: 'Manual Creation',
      description: 'Design custom infographics from scratch',
      action: 'manual',
      color: '#3b82f6'
    },
    {
      icon: Layout,
      title: 'Template Gallery',
      description: 'Browse and customize professional templates',
      action: 'templates',
      color: '#06b6d4'
    }
  ];

  const highlights = [
    { icon: Sparkles, text: 'AI-Powered Design' },
    { icon: Zap, text: 'Export to PNG, SVG, PDF' },
    { icon: Palette, text: '8+ Theme Styles' },
  ];

  return (
    <div className="home-page fade-in">
      <div className="hero-section">
        <h2 className="hero-title">
          Transform Ideas into
          <span className="gradient-text"> Visual Stories</span>
        </h2>
        <p className="hero-subtitle">
          Create stunning, AI-generated infographics from GitHub repositories or custom content.
          Choose from beautiful templates, customize every detail, and export in multiple formats.
        </p>

        {!apiKey && (
          <div className="alert-box">
            <span>⚠️ No API key set. Click Settings to configure your Gemini API key.</span>
          </div>
        )}

        <div className="highlights">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="highlight-item">
                <Icon size={18} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="feature-grid">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="feature-card glass-card"
              onClick={() => setCurrentView(feature.action)}
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon">
                <Icon size={32} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="btn btn-primary">
                Get Started →
              </button>
            </div>
          );
        })}
      </div>

      <div className="workflow-section glass-card">
        <h3>How It Works</h3>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <h4>Choose Input</h4>
            <p>GitHub repo or manual text</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <h4>Select Template</h4>
            <p>Pick from 8+ themes</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <h4>AI Generation</h4>
            <p>Let AI design your infographic</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">4</div>
            <h4>Customize & Export</h4>
            <p>Edit and download</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
