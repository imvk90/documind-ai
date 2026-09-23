import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Download, Plus, Trash2, Edit3, ShieldCheck, RefreshCw, ChevronDown } from 'lucide-react';

export default function ExtractionForm({
  extractionResult,
  onExport,
  onHoverField,
  activeHoverField
}) {
  const [formData, setFormData] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (extractionResult) {
      setFormData(extractionResult.data || {});
      setLineItems(extractionResult.data?.line_items || []);
      setDiscrepancies(extractionResult.discrepancies || []);
    } else {
      setFormData(null);
      setLineItems([]);
      setDiscrepancies([]);
    }
  }, [extractionResult]);

  if (!extractionResult || !formData) {
    return (
      <div className="h-full bg-slate-900/60 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 text-slate-400">
          <Edit3 className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">Structured Data Workbench</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Select a sample document or upload a file to view auto-classified fields, visual grounding, and math validation.
        </p>
      </div>
    );
  }

  const {
    document_type = 'receipt',
    confidence_score = 0.95,
    status = 'Verified',
    status_color = 'green'
  } = extractionResult;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineItemChange = (index, key, val) => {
    const updated = [...lineItems];
    updated[index][key] = val;

    // Recalculate line total automatically
    if (key === 'quantity' || key === 'unit_price') {
      const q = parseFloat(updated[index].quantity) || 0;
      const p = parseFloat(updated[index].unit_price) || 0;
      updated[index].total_price = parseFloat((q * p).toFixed(2));
    }

    setLineItems(updated);
    
    // Recalculate grand subtotal and total amount
    const newSubtotal = updated.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0);
    const tax = parseFloat(formData.tax) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const newTotal = parseFloat((newSubtotal + tax - discount).toFixed(2));

    setFormData((prev) => ({
      ...prev,
      subtotal: parseFloat(newSubtotal.toFixed(2)),
      total_amount: newTotal,
      line_items: updated
    }));
  };

  const addLineItem = () => {
    const newItem = { description: 'New Item', quantity: 1, unit_price: 0.0, total_price: 0.0 };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (index) => {
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
  };

  const handleTriggerExport = async () => {
    setIsExporting(true);
    await onExport(exportFormat, { ...formData, line_items: lineItems });
    setIsExporting(false);
  };

  const getStatusBadge = () => {
    if (status_color === 'green') {
      return (
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>🟢 Verified</span>
        </div>
      );
    } else if (status_color === 'yellow') {
      return (
        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center space-x-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>🟡 Review Recommended</span>
        </div>
      );
    } else {
      return (
        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center space-x-1.5">
          <XCircle className="w-3.5 h-3.5" />
          <span>🔴 Discrepancy Detected</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Form Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {document_type.replace('_', ' ')}
          </span>
          {getStatusBadge()}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AI Confidence: <strong className="text-slate-200">{Math.round(confidence_score * 100)}%</strong></span>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepancies.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3.5 px-4 text-xs text-amber-300 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-200">Validation Engine Warning:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {discrepancies.map((d, i) => (
                <li key={i}>{d.issue}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Body Fields */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* Main Entity Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div
            onMouseEnter={() => onHoverField && onHoverField('vendor_name')}
            onMouseLeave={() => onHoverField && onHoverField(null)}
            className={`p-3 rounded-xl border transition-all ${
              activeHoverField === 'vendor_name'
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
            }`}
          >
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Vendor / Issuer Name
            </label>
            <input
              type="text"
              value={formData.vendor_name || formData.issuer_name || ''}
              onChange={(e) => handleFieldChange('vendor_name', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div
            onMouseEnter={() => onHoverField && onHoverField('date')}
            onMouseLeave={() => onHoverField && onHoverField(null)}
            className={`p-3 rounded-xl border transition-all ${
              activeHoverField === 'date'
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
            }`}
          >
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Document Date (ISO)
            </label>
            <input
              type="text"
              value={formData.date || formData.issue_date || ''}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* ID Card Specific Fields */}
        {document_type === 'id_card' && formData.id_card_fields && (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">ID Card Metadata</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block">Full Name</label>
                <input
                  type="text"
                  value={formData.id_card_fields.full_name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_card_fields: { ...formData.id_card_fields, full_name: e.target.value }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block">ID / License Number</label>
                <input
                  type="text"
                  value={formData.id_card_fields.id_number || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_card_fields: { ...formData.id_card_fields, id_number: e.target.value }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block">Date of Birth</label>
                <input
                  type="text"
                  value={formData.id_card_fields.date_of_birth || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_card_fields: { ...formData.id_card_fields, date_of_birth: e.target.value }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block">Expiration Date</label>
                <input
                  type="text"
                  value={formData.id_card_fields.expiration_date || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_card_fields: { ...formData.id_card_fields, expiration_date: e.target.value }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Line Items Table */}
        {(document_type === 'receipt' || document_type === 'invoice') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300">Extracted Line Items</h4>
              <button
                onClick={addLineItem}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase">
                    <th className="p-2.5 pl-3">Description</th>
                    <th className="p-2.5 w-16">Qty</th>
                    <th className="p-2.5 w-24">Price</th>
                    <th className="p-2.5 w-24">Total</th>
                    <th className="p-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2 pl-3">
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-transparent text-slate-200 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.quantity || 1}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price || 0}
                          onChange={(e) => handleLineItemChange(idx, 'unit_price', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200"
                        />
                      </td>
                      <td className="p-2 font-mono text-emerald-400 font-medium">
                        ${(parseFloat(item.total_price) || 0).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeLineItem(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-xs text-slate-500">
                        No line items detected. Click 'Add Item' to insert manually.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Totals Reconciliation */}
        {(document_type === 'receipt' || document_type === 'invoice') && (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 text-xs">
            <div
              onMouseEnter={() => onHoverField && onHoverField('subtotal')}
              onMouseLeave={() => onHoverField && onHoverField(null)}
              className="flex justify-between items-center text-slate-400"
            >
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">${(parseFloat(formData.subtotal) || 0).toFixed(2)}</span>
            </div>

            <div
              onMouseEnter={() => onHoverField && onHoverField('tax')}
              onMouseLeave={() => onHoverField && onHoverField(null)}
              className="flex justify-between items-center text-slate-400"
            >
              <span>Tax</span>
              <div className="flex items-center space-x-1">
                <span>$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tax || 0}
                  onChange={(e) => {
                    const taxVal = parseFloat(e.target.value) || 0;
                    const subtotal = parseFloat(formData.subtotal) || 0;
                    setFormData({
                      ...formData,
                      tax: taxVal,
                      total_amount: parseFloat((subtotal + taxVal).toFixed(2))
                    });
                  }}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right text-slate-200"
                />
              </div>
            </div>

            <div className="h-px bg-slate-800 my-2" />

            <div
              onMouseEnter={() => onHoverField && onHoverField('total_amount')}
              onMouseLeave={() => onHoverField && onHoverField(null)}
              className={`flex justify-between items-center p-2.5 rounded-lg border transition-all ${
                activeHoverField === 'total_amount'
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                  : 'border-slate-800 bg-slate-900 text-slate-100'
              }`}
            >
              <span className="font-bold">Total Amount</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                ${(parseFloat(formData.total_amount) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Export Footer Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400">Format:</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="json">JSON (.json)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </div>

        <button
          onClick={handleTriggerExport}
          disabled={isExporting}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span>Export Extracted Data</span>
        </button>
      </div>
    </div>
  );
}
