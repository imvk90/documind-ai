import React, { useState } from 'react';
import { X, Key, CheckCircle, Sparkles } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, currentApiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(currentApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-slate-100 font-bold text-sm">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Configure Gemini API Key</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Enter your Google Gemini API key to enable live single-pass multimodal vision processing.
          </p>

          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
          />

          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Your key is stored locally in your session header and backend `.env`.</span>
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-1.5"
          >
            {savedSuccess ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Key className="w-4 h-4" />}
            <span>{savedSuccess ? 'Key Saved!' : 'Save Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
