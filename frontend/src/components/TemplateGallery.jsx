import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import { getTemplates, getTemplateCategories } from '../services/api';
import { Filter } from 'lucide-react';
import './TemplateGallery.css';

const TemplateGallery = () => {
  const { selectedTemplate, setSelectedTemplate, setCurrentView } = useAppStore();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, []);

  const loadTemplates = async (category = null) => {
    setLoading(true);
    try {
      const data = await getTemplates(category);
      setTemplates(data.templates);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getTemplateCategories();
      setCategories(['All', ...data.categories]);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadTemplates(category === 'All' ? null : category);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    // Navigate to either GitHub or Manual input based on user preference
    // For now, just store the selection
  };

  return (
    <div className="template-gallery fade-in">
      <div className="gallery-header">
        <h2>Template Gallery</h2>
        <p className="text-muted">Choose a template to get started</p>
      </div>

      <div className="category-filter">
        <Filter size={18} />
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading templates...</p>
        </div>
      ) : (
        <div className="template-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-card glass-card ${
                selectedTemplate?.id === template.id ? 'selected' : ''
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="template-preview">
                <div className="template-placeholder">
                  <span>{template.name}</span>
                </div>
              </div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p className="template-desc">{template.description}</p>
                <span className="badge">{template.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <div className="selection-actions">
          <div className="glass-card" style={{ padding: 'var(--spacing-lg)' }}>
            <h3>Selected: {selectedTemplate.name}</h3>
            <p className="text-muted">{selectedTemplate.description}</p>
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => setCurrentView('topic')}
              >
                Use with Topic Research
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentView('manual')}
              >
                Use with Manual Input
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
