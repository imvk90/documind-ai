import React from 'react';
import { Sparkles, Eye, ShieldCheck, Zap, ArrowRight, FileSearch, CheckCircle2, Layers } from 'lucide-react';

export default function HeroBanner({ onGetStarted, onSelectSample }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 p-8 md:p-10 shadow-2xl">
      {/* Background Glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Next-Gen GenAI Document Vision • Powered by Shyam TechLabs</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Transform Unstructured Documents into <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Validated Data</span> in Seconds.
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
          DocuMind AI uses Google's Gemini Multimodal Vision API to parse, classify, and audit financial receipts, invoices, ID cards, and forms. Features single-pass AI inference, visual grounding overlays, and math reconciliation.
        </p>

        {/* Key Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">&lt; 3s Latency</div>
              <div className="text-[10px] text-slate-400">Single-Pass Vision</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Visual Grounding</div>
              <div className="text-[10px] text-slate-400">`box_2d` Overlays</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Math Audit Engine</div>
              <div className="text-[10px] text-slate-400">Reconciles Totals</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Multi-Format</div>
              <div className="text-[10px] text-slate-400">JSON, CSV & Excel</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center space-x-2 group"
          >
            <span>Launch Extraction Workbench</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onSelectSample('sample_receipt_coffee')}
            className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-2xl border border-slate-700 transition-all flex items-center space-x-2"
          >
            <FileSearch className="w-4 h-4 text-blue-400" />
            <span>Try Sample Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
