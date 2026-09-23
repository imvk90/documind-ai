import React from 'react';
import { FileText, Cpu, History, BarChart3, Key, Sparkles, FolderOpen } from 'lucide-react';

export default function Navbar({
  onOpenHistory,
  onOpenAnalytics,
  onOpenApiKey,
  apiKey,
  hasApiKey
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-slate-100 tracking-tight">DocuMind AI</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Gemini 2.5 Vision
            </span>
          </div>
          <p className="text-xs text-slate-400">Form & Document Data Extraction Workbench</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* API Key Status */}
        <button
          onClick={onOpenApiKey}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center space-x-2 ${
            hasApiKey
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{hasApiKey ? 'Gemini API Active' : 'Configure API Key'}</span>
        </button>

        {/* Analytics Benchmark Button */}
        <button
          onClick={onOpenAnalytics}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 transition-all flex items-center space-x-2"
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Benchmark Analytics</span>
        </button>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 transition-all flex items-center space-x-2"
        >
          <History className="w-3.5 h-3.5 text-purple-400" />
          <span>Extraction History</span>
        </button>
      </div>
    </header>
  );
}
