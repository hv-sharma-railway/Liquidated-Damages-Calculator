import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { LDCalculationResult } from '../types/calculator';
import { formatCurrency, formatDatePretty } from '../utils/calculator';

interface ResultsDisplayProps {
  result: LDCalculationResult | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">
          Awaiting Inputs
        </h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Enter Start Date, End Date, and Amount to calculate delay and liquidated damages.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Result Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Final Liquidated Damages Amount
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white mt-1">
              {formatCurrency(result.finalLDAmount)}
            </div>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-5">
            <div className="text-[11px] text-slate-400">Net Payable Amount</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {formatCurrency(result.netPayableAmount)}
            </div>
          </div>
        </div>

        {result.isCapped && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              10.00% Statutory Cap applied (Raw delay: {result.roundedWeeks} weeks / {result.rawPercentage.toFixed(1)}%).
            </span>
          </div>
        )}

        {result.isEarlyOrOnTime && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-emerald-300">
            Completed on time or early. 0% liquidated damages.
          </div>
        )}
      </div>

      {/* 8 Core Outputs Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Calculation Details
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Start Date */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium block">Start Date</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 font-mono block mt-1">
              {result.startDate}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {formatDatePretty(result.startDate)}
            </span>
          </div>

          {/* 2. End Date */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium block">End Date</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 font-mono block mt-1">
              {result.endDate}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {formatDatePretty(result.endDate)}
            </span>
          </div>

          {/* 3. Total delay in days */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium block">Total Delay</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono block mt-1">
              {result.totalDelayDays} days
            </span>
            <span className="text-[10px] text-slate-400 block">
              Calendar days
            </span>
          </div>

          {/* 4. Calculated delay in weeks */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium block">Delay in Weeks</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 font-mono block mt-1">
              {result.calculatedDelayWeeks.toFixed(2)} wks
            </span>
            <span className="text-[10px] text-slate-400 block">
              Exact (Days ÷ 7)
            </span>
          </div>

          {/* 5. Rounded-up weeks */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg">
            <span className="text-[11px] text-blue-900 font-semibold block">Rounded-Up Weeks</span>
            <span className="text-xs sm:text-sm font-bold text-blue-700 font-mono block mt-1">
              {result.roundedWeeks} weeks
            </span>
            <span className="text-[10px] text-blue-600/70 block">
              Partial week = full week
            </span>
          </div>

          {/* 6. Applicable LD % */}
          <div className={`p-3 rounded-lg border ${result.isCapped ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200/70'}`}>
            <span className={`text-[11px] font-semibold block ${result.isCapped ? 'text-amber-900' : 'text-slate-500'}`}>
              Applicable LD %
            </span>
            <span className={`text-xs sm:text-sm font-bold font-mono block mt-1 ${result.isCapped ? 'text-amber-700' : 'text-slate-900'}`}>
              {result.applicablePercentage.toFixed(2)}%
            </span>
            <span className={`text-[10px] block ${result.isCapped ? 'text-amber-700 font-medium' : 'text-slate-400'}`}>
              {result.isCapped ? '10% Max Cap' : '0.5% / week'}
            </span>
          </div>

          {/* 7. Amount */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium block">Contract Amount</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono tabular-nums block mt-1 truncate">
              {formatCurrency(result.contractAmount)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              INR Base
            </span>
          </div>

          {/* 8. Final LD Amount */}
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
            <span className="text-[11px] text-rose-800 font-semibold block">Final LD Amount</span>
            <span className="text-xs sm:text-sm font-bold text-rose-700 font-mono tabular-nums block mt-1 truncate">
              {formatCurrency(result.finalLDAmount)}
            </span>
            <span className="text-[10px] text-rose-600/70 block">
              Amount × % / 100
            </span>
          </div>
        </div>
      </div>

      {/* Transparent Derivation Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Transparent Derivation
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 bg-slate-50">
                <th className="py-2 px-2.5 font-semibold w-10 text-center">Step</th>
                <th className="py-2 px-2.5 font-semibold">Rule / Description</th>
                <th className="py-2 px-2.5 font-semibold">Formula</th>
                <th className="py-2 px-2.5 font-semibold">Calculation</th>
                <th className="py-2 px-2.5 font-semibold text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.derivationSteps.map((step) => (
                <tr key={step.stepNumber} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-2.5 font-mono font-bold text-slate-400 text-center">
                    {step.stepNumber}
                  </td>
                  <td className="py-2.5 px-2.5">
                    <div className="font-semibold text-slate-900">{step.title}</div>
                    {step.ruleReference && (
                      <div className="text-[10px] text-slate-400">{step.ruleReference}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-500">
                    {step.formula}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-800">
                    {step.calculation}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono font-bold text-slate-900 text-right tabular-nums">
                    {step.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
