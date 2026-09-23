import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Contrast, Maximize2, FileCheck, Eye } from 'lucide-react';

export default function DocumentViewer({
  imageUrl,
  filename,
  boundingBoxes = {},
  activeHoverField = null,
  onHoverField
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [highContrast, setHighContrast] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setHighContrast(false);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Render bounding box SVG overlays (Gemini 0-1000 scale coordinates)
  const renderBoundingBoxes = () => {
    if (!boundingBoxes || Object.keys(boundingBoxes).length === 0) return null;

    return Object.entries(boundingBoxes).map(([fieldKey, box]) => {
      if (!Array.isArray(box) || box.length !== 4) return null;

      // box: [ymin, xmin, ymax, xmax] in 0-1000 scale
      const [ymin, xmin, ymax, xmax] = box;
      const topPct = (ymin / 10).toFixed(2);
      const leftPct = (xmin / 10).toFixed(2);
      const heightPct = ((ymax - ymin) / 10).toFixed(2);
      const widthPct = ((xmax - xmin) / 10).toFixed(2);

      const isActive = activeHoverField === fieldKey;

      return (
        <div
          key={fieldKey}
          onMouseEnter={() => onHoverField && onHoverField(fieldKey)}
          onMouseLeave={() => onHoverField && onHoverField(null)}
          style={{
            top: `${topPct}%`,
            left: `${leftPct}%`,
            height: `${heightPct}%`,
            width: `${widthPct}%`,
          }}
          className={`absolute pointer-events-auto rounded transition-all duration-200 cursor-pointer ${
            isActive
              ? 'border-2 border-cyan-400 bg-cyan-400/25 shadow-lg shadow-cyan-500/40 z-20 scale-[1.02]'
              : 'border border-blue-500/50 bg-blue-500/10 hover:border-cyan-400 hover:bg-cyan-400/20 z-10'
          }`}
        >
          <span
            className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-bold rounded shadow transition-all ${
              isActive
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'bg-slate-900/90 text-blue-300 border border-blue-500/30'
            }`}
          >
            {fieldKey.replace('_', ' ')}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden relative">
      {/* Toolbar Header */}
      <div className="h-12 border-b border-slate-800 bg-slate-950/60 px-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium truncate max-w-[200px]">
          <FileCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="truncate">{filename || 'Document Preview'}</span>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Toggle High Contrast Boost"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              highContrast
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            title="Rotate 90°"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-800 my-auto" />
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-400 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className="px-2 py-1 text-[11px] font-medium rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Document Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-slate-950/40">
        {imageUrl ? (
          <div
            className="relative transition-transform duration-200 ease-out origin-center"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              filter: highContrast ? 'contrast(160%) brightness(95%) grayscale(20%)' : 'none',
            }}
          >
            <img
              src={imageUrl}
              alt="Document Preview"
              className="max-h-[75vh] w-auto rounded-lg shadow-2xl border border-slate-800 select-none"
            />
            {/* Overlay bounding boxes */}
            <div className="absolute inset-0 pointer-events-none">
              {renderBoundingBoxes()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Eye className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600 animate-pulse" />
            <p className="text-sm font-medium">No document loaded</p>
            <p className="text-xs mt-1 text-slate-600">Select a sample document above or upload your file to begin.</p>
          </div>
        )}
      </div>

      {/* Footer Bounding Box Legend */}
      {boundingBoxes && Object.keys(boundingBoxes).length > 0 && (
        <div className="h-8 border-t border-slate-800/80 bg-slate-950/80 px-4 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Visual Grounding Active ({Object.keys(boundingBoxes).length} bounding regions detected)</span>
          </div>
          <span className="text-slate-500 font-mono">Gemini 0-1000 scale `box_2d`</span>
        </div>
      )}
    </div>
  );
}
