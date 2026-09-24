/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AndroidInstallBanner } from './components/AndroidInstallBanner';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CalculationHistory } from './components/CalculationHistory';
import { LDInputs, CalculationHistoryItem } from './types/calculator';
import { calculateLD } from './utils/calculator';

const STORAGE_KEY = 'ld_calculator_history_v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [isSavedJustNow, setIsSavedJustNow] = useState(false);

  // Core Inputs
  const [inputs, setInputs] = useState<LDInputs>(() => {
    return {
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      amount: 5000000,
      contractRef: '',
    };
  });

  // History State
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Save history to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Live calculation
  const currentResult = useMemo(() => {
    const amt = typeof inputs.amount === 'number' ? inputs.amount : 0;
    return calculateLD(inputs.startDate, inputs.endDate, amt);
  }, [inputs.startDate, inputs.endDate, inputs.amount]);

  const canSave = Boolean(
    inputs.startDate &&
    inputs.endDate &&
    typeof inputs.amount === 'number' &&
    inputs.amount >= 0 &&
    currentResult
  );

  const handleSaveToHistory = () => {
    if (!canSave || !currentResult) return;

    const newItem: CalculationHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      contractRef: inputs.contractRef || 'Calculation Record',
      inputs: {
        startDate: inputs.startDate,
        endDate: inputs.endDate,
        amount: typeof inputs.amount === 'number' ? inputs.amount : 0,
      },
      result: currentResult,
    };

    setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
    setIsSavedJustNow(true);
    setTimeout(() => setIsSavedJustNow(false), 2000);
  };

  const handleClearInputs = () => {
    setInputs({
      startDate: '',
      endDate: '',
      amount: '',
      contractRef: '',
    });
  };

  const handleLoadHistoryItem = (item: CalculationHistoryItem) => {
    setInputs({
      startDate: item.inputs.startDate,
      endDate: item.inputs.endDate,
      amount: item.inputs.amount,
      contractRef: item.contractRef,
    });
    setActiveTab('calculator');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all saved calculations?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Android Install Banner */}
      <AndroidInstallBanner />

      {/* Minimal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-7">
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Inputs (5 cols on lg) */}
            <div className="lg:col-span-5">
              <CalculatorForm
                inputs={inputs}
                setInputs={setInputs}
                onSave={handleSaveToHistory}
                onClear={handleClearInputs}
                canSave={canSave}
                isSavedJustNow={isSavedJustNow}
              />
            </div>

            {/* Outputs & Derivation (7 cols on lg) */}
            <div className="lg:col-span-7">
              <ResultsDisplay result={currentResult} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <CalculationHistory
              history={history}
              onLoadItem={handleLoadHistoryItem}
              onDeleteItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Ultra-minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <p>Liquidated Damages Calculator · INR (₹) · 0.5%/week · 10% Cap</p>
      </footer>
    </div>
  );
}
