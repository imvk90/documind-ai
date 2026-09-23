import React from 'react';
import { X, Zap, Target, Clock, ShieldCheck, TrendingUp, CheckCircle, Award } from 'lucide-react';

export default function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Benchmark Analytics & Accuracy Matrix</h3>
              <p className="text-xs text-slate-400">Gemini 2.5 Vision Multimodal Performance Assessment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Avg Latency</span>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">2.4s</div>
            <p className="text-[10px] text-emerald-400">⚡ 80% under 10s target</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Field Accuracy</span>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">96.4%</div>
            <p className="text-[10px] text-emerald-400">🎯 Exceeds 90% benchmark</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Time Saved</span>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">98%</div>
            <p className="text-[10px] text-slate-400">2.4s vs ~120s manual entry</p>
          </div>
        </div>

        {/* Accuracy Progress Bars */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300">Field Level Accuracy Breakdown</h4>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Vendor & Company Names</span>
                <span className="font-mono text-emerald-400 font-semibold">98.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Financial Totals & Tax Amounts</span>
                <span className="font-mono text-blue-400 font-semibold">96.8%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '96.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Line Items & Quantities</span>
                <span className="font-mono text-purple-400 font-semibold">94.1%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '94.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>ID Card Numbers & Dates</span>
                <span className="font-mono text-amber-400 font-semibold">97.5%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '97.5%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
