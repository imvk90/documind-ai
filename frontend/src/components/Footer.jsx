import React from 'react';
import { FileText, Heart, Shield, Sparkles, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-8 px-6 mt-12">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand Details */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">DocuMind AI</div>
            <div className="text-[11px] text-slate-500">Autonomous Form & Document Data Extractor</div>
          </div>
        </div>

        {/* Center Tech Badge */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Powered by Google Gemini 3.6 Multimodal Vision</span>
        </div>

        {/* Right Copyright Notice */}
        <div className="text-right">
          <p className="font-medium text-slate-300">
            © 2026 <span className="text-blue-400 font-semibold">Shyam TechLabs</span>. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Enterprise Generative AI & Automation Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
