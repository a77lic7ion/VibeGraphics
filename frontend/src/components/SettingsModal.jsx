import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import { testApiKey } from '../services/api';
import { X, Key, Check, AlertCircle } from 'lucide-react';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
  const { apiKey, setApiKey } = useAppStore();
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    if (!tempKey) {
      setTestResult({ ok: false, message: 'Please enter an API key' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const result = await testApiKey(tempKey);
      setTestResult({ ok: true, message: 'API key is valid!' });
    } catch (err) {
      setTestResult({ 
        ok: false, 
        message: err.response?.data?.error || 'Invalid API key'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setApiKey(tempKey);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="setting-section">
            <label className="setting-label">
              <Key size={18} />
              Gemini API Key
            </label>
            <p className="setting-help">
              Get your API key from{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">
                Google AI Studio
              </a>
            </p>
            <div className="input-group">
              <input
                type={showKey ? 'text' : 'password'}
                className="input"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Enter your Gemini API key"
              />
              <button
                className="btn btn-secondary"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            {testResult && (
              <div className={`test-result ${testResult.ok ? 'success' : 'error'}`}>
                {testResult.ok ? <Check size={18} /> : <AlertCircle size={18} />}
                <span>{testResult.message}</span>
              </div>
            )}

            <button
              className="btn btn-secondary"
              onClick={handleTestConnection}
              disabled={testing || !tempKey}
            >
              {testing ? (
                <>
                  <div className="spinner"></div>
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
