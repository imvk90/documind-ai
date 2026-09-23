import React from 'react';
import { FileText, History, BarChart3, Key, Sparkles, LayoutGrid, Home, Wrench } from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  onOpenApiKey,
  hasApiKey
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">DocuMind AI</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Gemini 3.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Shyam TechLabs</p>
          </div>
        </div>

        {/* Dynamic Segment Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 ml-6 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('workbench')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'workbench'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Workbench</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History Log</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* API Key Status */}
        <button
          onClick={onOpenApiKey}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center space-x-2 ${
            hasApiKey
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{hasApiKey ? 'Gemini API Active' : 'Configure API Key'}</span>
        </button>
      </div>
    </header>
  );
}
