import React, { useState } from 'react';
import { Smartphone, Download, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const AndroidInstallBanner: React.FC = () => {
  const { isInstalled, install, hasNativePrompt } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      await install();
    } else {
      setShowAndroidGuide(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2.5 border-b border-slate-700 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="font-semibold text-white block truncate">
              Install Android App
            </span>
            <span className="text-[11px] text-slate-300 hidden sm:inline">
              Instant offline calculation &amp; home screen access
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Install on Android Device</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAndroidGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">
                To install directly as an Android App:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>Open this page in <strong>Chrome</strong> on your Android phone.</li>
                <li>Tap the <strong>three dots menu (⋮)</strong> at the top-right corner.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>Tap <strong>"Install"</strong> when prompted.</li>
              </ol>
              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 mt-2 text-[11px]">
                Once installed, the app will appear in your Android app drawer and home screen, working 100% offline!
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAndroidGuide(false)}
              className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded hover:bg-slate-800 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
