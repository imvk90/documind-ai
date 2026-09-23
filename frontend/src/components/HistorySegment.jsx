import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, Download, Calendar, ShieldCheck, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function HistorySegment({ onLoadRecord, onSelectTab }) {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/history');
      setHistory(res.data || []);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.document_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-slate-100">Document Extractions Log & History</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            SQLite persistent records of all parsed invoices, receipts, and ID documents.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by filename, vendor, or document type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Document Types</option>
            <option value="receipt">Receipts Only</option>
            <option value="invoice">Invoices Only</option>
            <option value="id_card">ID Cards Only</option>
          </select>
        </div>
      </div>

      {/* Table / List View */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-3.5 pl-4">Document File</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Extraction Date</th>
              <th className="p-3.5">AI Confidence</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs text-slate-500">
                  Loading extraction history...
                </td>
              </tr>
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs text-slate-500">
                  No matching extractions found in database logs.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5 pl-4 font-medium text-slate-200 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{item.filename}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {item.document_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {item.extraction_date}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-medium">
                    {Math.round(item.confidence_score * 100)}%
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1 w-fit ${
                      item.status === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-4 space-x-2">
                    <button
                      onClick={() => {
                        onLoadRecord(item);
                        onSelectTab('workbench');
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg border border-blue-500/30 transition-all"
                    >
                      Open Workbench
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
