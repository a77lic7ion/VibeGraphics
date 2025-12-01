import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import { generatePlan } from '../services/api';
import { FileText, Plus, Trash2 } from 'lucide-react';
import './ManualInput.css';

const ManualInput = () => {
  const {
    customTitle, setCustomTitle,
    customText, setCustomText,
    customSections, setCustomSections,
    selectedTemplate,
    apiKey, setLoading, setError,
    setSpec, setCurrentView
  } = useAppStore();

  const addSection = () => {
    setCustomSections([
      ...customSections,
      { id: Date.now(), title: '', content: '' }
    ]);
  };

  const removeSection = (id) => {
    setCustomSections(customSections.filter(s => s.id !== id));
  };

  const updateSection = (id, field, value) => {
    setCustomSections(
      customSections.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  const handleGenerate = async () => {
   if (!apiKey) {
      setError('Please set your API key in Settings');
      return;
    }

    if (!customTitle || !customText) {
      setError('Please provide a title and content');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template first');
      setCurrentView('templates');
      return;
    }

    setLoading(true, 'Generating infographic...');

    try {
      const result = await generatePlan(apiKey, 'manual', {
        title: customTitle,
        custom_text: customText,
        sections: customSections,
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
    <div className="manual-input fade-in">
      <div className="input-header">
        <FileText size={32} />
        <div>
          <h2>Manual Infographic Creation</h2>
          <p className="text-muted">Create custom infographics from your own content</p>
        </div>
      </div>

      <div className="glass-card">
        <div className="form-group">
          <label className="form-label">Infographic Title</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your infographic title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Main Content</label>
          <textarea
            className="input"
            rows={8}
            placeholder="Enter the main content for your infographic..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
        </div>

        <div className="sections">
          <div className="sections-header">
            <label className="form-label">Additional Sections (Optional)</label>
            <button className="btn btn-secondary btn-sm" onClick={addSection}>
              <Plus size={16} />
              Add Section
            </button>
          </div>

          {customSections.map((section) => (
            <div key={section.id} className="section-card glass-card">
              <div className="section-header">
                <input
                  type="text"
                  className="input"
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                />
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeSection(section.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                className="input"
                rows={4}
                placeholder="Section content"
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
              />
            </div>
          ))}
        </div>

        {selectedTemplate ? (
          <div className="template-info">
            <p>
              <strong>Template:</strong> {selectedTemplate.name}
            </p>
            <button className="btn btn-primary" onClick={handleGenerate}>
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
    </div>
  );
};

export default ManualInput;
