import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import SampleSelector from './components/SampleSelector';
import DocumentViewer from './components/DocumentViewer';
import ExtractionForm from './components/ExtractionForm';
import HistoryDrawer from './components/HistoryDrawer';
import AnalyticsModal from './components/AnalyticsModal';
import ApiKeyModal from './components/ApiKeyModal';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [samples, setSamples] = useState([]);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [extractionResult, setExtractionResult] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeHoverField, setActiveHoverField] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // API Key management
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || 'AQ.Ab8RN6ILMbJEYr3i2Rs0UdwkrY90--d4GRQIL1JbgWoNIbCgww';
  });

  useEffect(() => {
    fetchSamples();
    // Auto load first sample on startup for instant presentation
    handleSelectSample('sample_receipt_coffee');
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await axios.get('/api/samples');
      setSamples(res.data || []);
    } catch (e) {
      console.error("Failed to fetch samples", e);
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleSelectSample = async (sampleId) => {
    setActiveSampleId(sampleId);
    setIsExtracting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('sample_id', sampleId);

      const res = await axios.post('/api/extract', formData, {
        headers: {
          'x-api-key': apiKey
        }
      });
      setExtractionResult(res.data);
    } catch (err) {
      console.error("Extraction failed", err);
      setErrorMsg(err.response?.data?.detail || "Document extraction failed. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setActiveSampleId(null);
    setIsExtracting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/extract', formData, {
        headers: {
          'x-api-key': apiKey
        }
      });
      setExtractionResult(res.data);
    } catch (err) {
      console.error("Extraction failed", err);
      setErrorMsg(err.response?.data?.detail || "File extraction failed. Ensure it is a valid image or PDF.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExport = async (format, updatedData) => {
    try {
      const filename = extractionResult?.filename || "extracted_data";
      const response = await axios.post(
        '/api/export',
        {
          format,
          data: updatedData,
          filename: filename.split('.')[0]
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${filename.split('.')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error", err);
    }
  };

  const handleLoadHistoryRecord = (record) => {
    setExtractionResult({
      record_id: record.id,
      filename: record.filename,
      image_url: record.file_path,
      document_type: record.document_type,
      data: record.data,
      discrepancies: [],
      confidence_score: record.confidence_score,
      has_discrepancy: record.has_discrepancy,
      status: record.status,
      status_color: record.status === 'Verified' ? 'green' : 'yellow',
      bounding_boxes: record.bounding_boxes || {}
    });
    setActiveSampleId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        apiKey={apiKey}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 p-6 space-y-5 max-w-[1700px] w-full mx-auto flex flex-col">
        {/* Sample Selection Bar */}
        <SampleSelector
          samples={samples}
          onSelectSample={handleSelectSample}
          onUploadFile={handleFileUpload}
          isExtracting={isExtracting}
          activeSampleId={activeSampleId}
        />

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Split-Screen Workbench Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px] relative">
          {/* Extracting Overlay Spinner */}
          {isExtracting && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <Loader2 className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-200">Gemini Vision Single-Pass Extraction in Progress...</p>
                <p className="text-xs text-slate-400 font-mono">Analyzing layout, visual grounding boxes & math validation</p>
              </div>
            </div>
          )}

          {/* Left Canvas Pane (Document Viewer) */}
          <div className="lg:col-span-6 h-[720px]">
            <DocumentViewer
              imageUrl={extractionResult?.image_url}
              filename={extractionResult?.filename}
              boundingBoxes={extractionResult?.bounding_boxes}
              activeHoverField={activeHoverField}
              onHoverField={setActiveHoverField}
            />
          </div>

          {/* Right Workbench Pane (Structured Editable Form) */}
          <div className="lg:col-span-6 h-[720px]">
            <ExtractionForm
              extractionResult={extractionResult}
              onExport={handleExport}
              onHoverField={setActiveHoverField}
              activeHoverField={activeHoverField}
            />
          </div>
        </div>
      </main>

      {/* Drawers & Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadRecord={handleLoadHistoryRecord}
      />
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        currentApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
