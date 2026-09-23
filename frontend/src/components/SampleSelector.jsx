import React from 'react';
import { FileText, CreditCard, Receipt, Upload, Sparkles } from 'lucide-react';

export default function SampleSelector({
  samples = [],
  onSelectSample,
  onUploadFile,
  isExtracting,
  activeSampleId
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'receipt':
        return <Receipt className="w-4 h-4 text-emerald-400" />;
      case 'invoice':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'id_card':
        return <CreditCard className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Sample Presets Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        <div className="flex items-center space-x-1 text-xs font-semibold text-slate-400 mr-2 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Preset Demo Samples:</span>
        </div>

        {samples.map((sample) => {
          const isActive = activeSampleId === sample.id;
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              disabled={isExtracting}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center space-x-2 flex-shrink-0 ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-md shadow-blue-500/10'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
              } disabled:opacity-50`}
            >
              {getIcon(sample.type)}
              <span>{sample.name}</span>
            </button>
          );
        })}
      </div>

      {/* Direct File Upload Trigger */}
      <div className="flex items-center space-x-3 w-full md:w-auto flex-shrink-0">
        <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-2">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image or PDF</span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, application/pdf"
            onChange={onUploadFile}
            className="hidden"
            disabled={isExtracting}
          />
        </label>
      </div>
    </div>
  );
}
