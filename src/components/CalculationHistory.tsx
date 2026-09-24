import React from 'react';
import { Trash2, ArrowUpRight, Download, History, Calendar, CheckCircle2 } from 'lucide-react';
import { CalculationHistoryItem } from '../types/calculator';
import { formatCurrency, formatDatePretty } from '../utils/calculator';

interface CalculationHistoryProps {
  history: CalculationHistoryItem[];
  onLoadItem: (item: CalculationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onClearHistory,
}) => {
  const exportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Reference',
      'Start Date',
      'End Date',
      'Delay Days',
      'Calculated Weeks',
      'Rounded Weeks',
      'Applicable LD %',
      'Contract Amount',
      'Final LD Amount',
      'Net Payable',
      'Timestamp',
    ];

    const rows = history.map((h) => [
      `"${h.contractRef.replace(/"/g, '""')}"`,
      h.result.startDate,
      h.result.endDate,
      h.result.totalDelayDays,
      h.result.calculatedDelayWeeks.toFixed(2),
      h.result.roundedWeeks,
      h.result.applicablePercentage.toFixed(2) + '%',
      h.result.contractAmount,
      h.result.finalLDAmount,
      h.result.netPayableAmount,
      new Date(h.timestamp).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Liquidated-Damages-History-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 sm:p-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No Saved Calculations Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          When you calculate liquidated damages, click "Save Calculation to History" to archive your assessments here for future reference, re-loading, or CSV export.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Calculation History & Records
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {history.length} saved assessment{history.length === 1 ? '' : 's'} stored locally in your browser
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
              <th className="py-2.5 px-3 font-semibold">Reference</th>
              <th className="py-2.5 px-3 font-semibold">Dates (Start → End)</th>
              <th className="py-2.5 px-3 font-semibold">Delay</th>
              <th className="py-2.5 px-3 font-semibold">Weeks (Round-Up)</th>
              <th className="py-2.5 px-3 font-semibold text-right">LD %</th>
              <th className="py-2.5 px-3 font-semibold text-right">Contract Amount</th>
              <th className="py-2.5 px-3 font-semibold text-right">Final LD Amount</th>
              <th className="py-2.5 px-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900">
                    {item.contractRef || 'Standard Calculation'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>

                <td className="py-3 px-3 font-mono text-slate-700">
                  <div>{item.result.startDate}</div>
                  <div className="text-slate-400 text-[10px]">to {item.result.endDate}</div>
                </td>

                <td className="py-3 px-3 font-mono tabular-nums text-slate-800">
                  {item.result.totalDelayDays} days
                </td>

                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-blue-700">
                    {item.result.roundedWeeks} wks
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ({item.result.calculatedDelayWeeks.toFixed(2)} exact)
                  </span>
                </td>

                <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-slate-900">
                  {item.result.applicablePercentage.toFixed(2)}%
                  {item.result.isCapped && (
                    <span className="block text-[10px] text-amber-600 font-sans">Cap</span>
                  )}
                </td>

                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                  {formatCurrency(item.result.contractAmount)}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-rose-600">
                  {formatCurrency(item.result.finalLDAmount)}
                </td>

                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onLoadItem(item)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors"
                      title="Load into calculator"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
