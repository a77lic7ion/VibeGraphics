import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import { researchTopic, generatePlan } from '../services/api';
import { Search, Globe, FileText, Download } from 'lucide-react';
import './TopicInput.css';

const TopicInput = () => {
  const { 
    topic, setTopic,
    bundle, setBundle,
    selectedTemplate, setSelectedTemplate,
    apiKey, setLoading, setError,
    setSpec, setCurrentView
  } = useAppStore();

  const [localTopic, setLocalTopic] = useState(topic);
  const [references, setReferences] = useState('');

  const handleResearch = async () => {
    if (!localTopic) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true, 'Researching topic online...');
    setTopic(localTopic);

    try {
      const result = await researchTopic(localTopic);
      if (result.ok) {
        setBundle(result.bundle);
        setError(null);
      } else {
        setError(result.error || 'Failed to research topic');
      }
    } catch (err) {
      setError(err.message || 'Failed to research topic');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSpec = async () => {
    if (!apiKey) {
      setError('Please set your API key in Settings');
      return;
    }

    if (!bundle) {
      setError('Please research a topic first');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template first');
      setCurrentView('templates');
      return;
    }

    setLoading(true, 'Generating infographic spec...');

    try {
      const result = await generatePlan(apiKey, 'research', {
        bundle,
        template_id: selectedTemplate.id
      });

      if (result.ok) {
        setSpec(result.spec);
        setCurrentView('editor');
      } else {
        setError(result.error || 'Failed to generate spec');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate spec');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topic-input fade-in">
      <div className="input-header">
        <Globe size={32} />
        <div>
          <h2>Research & Create</h2>
          <p className="text-muted">Enter a topic and let AI research and design your infographic</p>
        </div>
      </div>

      <div className="glass-card">
        <div className="form-group">
          <label className="form-label">Topic</label>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="input search-input"
              placeholder="e.g., History of Artificial Intelligence"
              value={localTopic}
              onChange={(e) => setLocalTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            />
          </div>
          <p className="form-help">The AI will search the web for information about this topic.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Reference URLs (Optional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Paste specific URLs you want to include (one per line)..."
            value={references}
            onChange={(e) => setReferences(e.target.value)}
          />
          <p className="form-help">Provide specific sources if you have them.</p>
        </div>

        <button className="btn btn-primary" onClick={handleResearch}>
          <Search size={18} />
          Start Research
        </button>
      </div>

      {bundle && (
        <div className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
          <h3>Research Complete</h3>
          <div className="bundle-info">
            <p>
              <strong>Topic:</strong> {bundle.topic}<br />
              <strong>Captured:</strong> {new Date(bundle.captured_at).toLocaleString()}
            </p>
            <div className="research-preview">
              <h4>Research Summary:</h4>
              <pre>{bundle.research_data?.substring(0, 300)}...</pre>
            </div>
          </div>

          {selectedTemplate ? (
            <div className="template-selected">
              <p>
                <strong>Template:</strong> {selectedTemplate.name}
              </p>
              <button className="btn btn-primary" onClick={handleGenerateSpec}>
                Generate Infographic
              </button>
            </div>
          ) : (
            <div>
              <p className="text-muted">Please select a template to continue</p>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentView('templates')}
              >
                Choose Template
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicInput;
