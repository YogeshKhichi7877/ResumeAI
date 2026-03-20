import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap, WifiOff } from 'lucide-react';

/**
 * InstallBanner
 * Shows a beautiful install-as-app banner when the browser
 * fires the beforeinstallprompt event (Chrome/Edge/Android).
 * Remembers if user dismissed it.
 */
export const InstallBanner = () => {
  const [prompt, setPrompt]       = useState(null);
  const [visible, setVisible]     = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or installed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone;
    if (dismissed || isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      // Show banner after 3 seconds on first visit
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setVisible(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    setInstalling(true);
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setVisible(false);
    } else {
      setInstalling(false);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!visible || installed) return null;

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={handleDismiss}
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-50"
        style={{ animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        <div className="bg-black border-3 border-neo-yellow shadow-[8px_8px_0px_#FFE566] p-5">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neo-yellow border-2 border-neo-yellow flex items-center justify-center flex-shrink-0">
                <span className="font-space font-extrabold text-xl text-black">R</span>
              </div>
              <div>
                <p className="font-space font-extrabold text-white text-base uppercase leading-tight">
                  Install Resume AI
                </p>
                <p className="text-neo-yellow/70 text-xs uppercase tracking-wide">
                  Add to Home Screen
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-white transition-colors p-1 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { icon: <Zap className="w-4 h-4" />, label: 'Faster\nLaunch' },
              { icon: <WifiOff className="w-4 h-4" />, label: 'Works\nOffline' },
              { icon: <Smartphone className="w-4 h-4" />, label: 'App\nExperience' },
            ].map((f, i) => (
              <div key={i} className="border border-neo-yellow/30 p-2 text-center">
                <div className="text-neo-yellow flex justify-center mb-1">{f.icon}</div>
                <p className="text-white text-xs font-bold whitespace-pre-line leading-tight">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              disabled={installing}
              className="flex-1 bg-neo-yellow text-black border-2 border-neo-yellow py-3 font-space font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-60"
            >
              {installing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install App
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 border-2 border-gray-700 text-gray-400 font-bold text-sm uppercase hover:border-gray-500 hover:text-gray-300 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </>
  );
};