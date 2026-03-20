import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi, RefreshCw, Home, Zap, BookOpen, DollarSign } from 'lucide-react';

export default function OfflinePage() {
  const isOnline  = useOnlineStatus();
  const [retrying, setRetrying] = useState(false);
  const [dots, setDots]         = useState('');

  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isOnline) setTimeout(() => window.location.reload(), 800);
  }, [isOnline]);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) window.location.reload();
      else setRetrying(false);
    }, 2000);
  };

  // Use <a href> not <Link> — so the SW can intercept and serve cached shell
  const cached = [
    { label: 'Home',         href: '/',             icon: <Home className="w-4 h-4" />,       color: 'bg-neo-yellow' },
    { label: 'Features',     href: '/features',     icon: <Zap className="w-4 h-4" />,        color: 'bg-neo-green' },
    { label: 'How It Works', href: '/how-it-works', icon: <BookOpen className="w-4 h-4" />,   color: 'bg-neo-blue' },
    { label: 'Pricing',      href: '/pricing',      icon: <DollarSign className="w-4 h-4" />, color: 'bg-neo-purple' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b-3 border-black px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
            <span className="font-space font-extrabold text-lg">R</span>
          </div>
          <span className="font-space font-extrabold text-xl uppercase">Resume AI</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">

          {/* Connection status pill */}
          <div className={`inline-flex items-center gap-2 border-3 border-black px-4 py-2 mb-8 shadow-[4px_4px_0px_#000] transition-all duration-500 ${isOnline ? 'bg-neo-green' : 'bg-neo-red'}`}>
            {isOnline
              ? <><Wifi className="w-4 h-4" /><span className="font-bold text-sm uppercase">Back Online! Reloading{dots}</span></>
              : <><WifiOff className="w-4 h-4 text-white" /><span className="font-bold text-sm uppercase text-white">No Connection</span></>
            }
          </div>

          {/* Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-black border-3 border-black flex items-center justify-center shadow-[10px_10px_0px_#FFE566] mx-auto">
              <WifiOff className="w-14 h-14 text-neo-yellow" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-neo-red border-3 border-black flex items-center justify-center rotate-12">
              <span className="font-extrabold text-white text-xs">!</span>
            </div>
          </div>

          <h1 className="font-space text-4xl font-extrabold uppercase mb-3">You're Offline</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Resume analysis needs a live connection. Some pages are available from cache below.
          </p>

          {/* Retry */}
          <button
            onClick={handleRetry}
            disabled={retrying}
            className={`neo-button inline-flex items-center gap-2 mb-10 ${retrying ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? `Checking${dots}` : 'Try Again'}
          </button>

          {/* Cached pages — use plain <a> tags so SW can serve cached shell */}
          <div>
            <p className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">
              📦 Available Offline
            </p>
            <div className="grid grid-cols-2 gap-3">
              {cached.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className={`${p.color} border-3 border-black p-4 flex items-center gap-3 font-bold text-sm uppercase shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all duration-100 no-underline text-black`}
                >
                  {p.icon} {p.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-5 border-3 border-black bg-neo-yellow/20 text-left shadow-[4px_4px_0px_#000]">
            <p className="font-space font-extrabold uppercase text-sm mb-3">💡 Quick Fixes</p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>• Toggle airplane mode off and on</li>
              <li>• Switch between Wi-Fi and mobile data</li>
              <li>• Move closer to your router</li>
              <li>• Page will reload automatically when back online</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-black text-white py-4 px-4 text-center text-gray-500 text-xs border-t-3 border-black">
        © 2026 Resume AI — AI features require internet connection
      </footer>
    </div>
  );
}