import React from 'react';
import { Calendar, RotateCcw, BookmarkPlus } from 'lucide-react';
import { LDInputs } from '../types/calculator';

interface CalculatorFormProps {
  inputs: LDInputs;
  setInputs: React.Dispatch<React.SetStateAction<LDInputs>>;
  onSave: () => void;
  onClear: () => void;
  canSave: boolean;
  isSavedJustNow: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  setInputs,
  onSave,
  onClear,
  canSave,
  isSavedJustNow,
}) => {
  const handleChange = (field: keyof LDInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Contract Inputs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dates and contract amount in INR (₹)
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition-colors py-1 px-2.5 rounded-md hover:bg-rose-50 cursor-pointer"
          title="Clear inputs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (canSave) onSave(); }} className="space-y-4">
        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Start Date (Contractual)
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={inputs.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full text-sm px-3 py-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            End Date (Actual Handover)
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={inputs.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full text-sm px-3 py-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Contract Amount (INR Only) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount (₹ INR)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              required
              value={inputs.amount}
              onChange={(e) =>
                handleChange('amount', e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))
              }
              className="w-full text-sm px-3 py-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm pointer-events-none">
              ₹
            </span>
          </div>
        </div>

        {/* Optional Reference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reference <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={inputs.contractRef || ''}
            onChange={(e) => handleChange('contractRef', e.target.value)}
            placeholder="e.g. Contract #IND-2026"
            className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
              isSavedJustNow
                ? 'bg-emerald-600 text-white shadow-xs'
                : canSave
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isSavedJustNow ? 'Saved in History!' : 'Save Calculation to History'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
