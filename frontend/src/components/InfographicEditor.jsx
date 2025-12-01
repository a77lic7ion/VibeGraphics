import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import { generateImage, getFileUrl } from '../services/api';
import { Image as ImageIcon, Download, Edit } from 'lucide-react';
import './InfographicEditor.css';

const InfographicEditor = () => {
  const {
    spec, setSpec,
    apiKey, setLoading, setError,
    images, addImage
  } = useAppStore();

  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerateImage = async () => {
    if (!apiKey) {
      setError('Please set your API key in Settings');
      return;
    }

    if (!spec) {
      setError('No spec available');
      return;
    }

    setLoading(true, 'Generating image (this may take 30-60 seconds)...');

    try {
      const result = await generateImage(apiKey, spec);

      if (result.ok) {
        setGeneratedImage(result);
        addImage({
          id: Date.now(),
          path: result.image_path,
          filename: result.filename,
          page: 1
        });
      } else {
        setError(result.error || 'Failed to generate image');
      }
    } catch (err) {
      setError(err.message|| 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filename) => {
    const url = getFileUrl(filename);
    window.open(url, '_blank');
  };

  return (
    <div className="infographic-editor fade-in">
      <div className="editor-header">
        <ImageIcon size={32} />
        <div>
          <h2>Infographic Editor</h2>
          <p className="text-muted">Review spec and generate your infographic</p>
        </div>
      </div>

      {spec && (
        <div className="editor-grid">
          <div className="spec-panel glass-card">
            <h3>Specification</h3>
            <div className="spec-content">
              <div className="spec-field">
                <label>Title:</label>
                <p>{spec.projectTitle || 'Untitled'}</p>
              </div>
              <div className="spec-field">
                <label>One-liner:</label>
                <p>{spec.oneLiner}</p>
              </div>

{spec.sections && spec.sections.length > 0 && (
                <div className="spec-field">
                  <label>Sections:</label>
                  <ul>
                    {spec.sections.map((section, idx) => (
                      <li key={idx}>
                        <strong>{section.title}</strong>: {section.body?.substring(0, 100)}...
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="spec-field">
                <label>Image Prompt:</label>
                <p className="prompt-text">{spec.imagePrompt}</p>
              </div>

              <button className="btn btn-primary" onClick={handleGenerateImage}>
                <ImageIcon size={18} />
                Generate Image
              </button>
            </div>
          </div>

          <div className="preview-panel glass-card">
            <h3>Preview</h3>
            {generatedImage ? (
              <div className="image-preview">
                <img 
                  src={getFileUrl(generatedImage.filename)} 
                  alt="Generated infographic"
                />
                <div className="image-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleDownload(generatedImage.filename)}
                  >
                    <Download size={18} />
                    Download PNG
                  </button>
                </div>
              </div>
            ) : (
              <div className="placeholder-preview">
                <ImageIcon size={64} className="placeholder-icon" />
                <p>No image generated yet</p>
                <p className="text-dim">Click "Generate Image" to create your infographic</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfographicEditor;
