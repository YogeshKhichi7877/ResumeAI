import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, ArrowLeft, Search, FileText, Zap } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  // Auto redirect after 10 seconds
  useEffect(() => {
    if (count <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  const quickLinks = [
    { label: 'Home',         to: '/',           icon: <Home className="w-4 h-4" />,     color: 'bg-neo-yellow' },
    { label: 'Features',     to: '/features',   icon: <Zap className="w-4 h-4" />,      color: 'bg-neo-green' },
    { label: 'Pricing',      to: '/pricing',    icon: <FileText className="w-4 h-4" />, color: 'bg-neo-blue' },
    { label: 'Analyse Resume', to: '/dashboard', icon: <Search className="w-4 h-4" />,  color: 'bg-neo-purple' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top bar */}
      <nav className="bg-white border-b-3 border-black px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
            <span className="font-space font-extrabold text-lg">R</span>
          </div>
          <span className="font-space font-extrabold text-xl uppercase">Resume AI</span>
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border-3 border-black px-4 py-2 font-bold hover:bg-neo-yellow transition-colors shadow-[3px_3px_0px_#000]"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">

          {/* Big 404 */}
          <div className="relative inline-block mb-8">
            <div className="font-space font-extrabold text-[10rem] leading-none text-white border-3 border-black bg-black px-8 shadow-[12px_12px_0px_#FFE566]">
              404
            </div>
            <div className="absolute -top-4 -right-4 bg-neo-red border-3 border-black px-3 py-1 rotate-12">
              <span className="font-space font-extrabold text-sm uppercase text-white">Oops!</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="font-space text-3xl md:text-4xl font-extrabold uppercase mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-2 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm mb-10">
            Redirecting to home in{' '}
            <span className="font-space font-extrabold text-black bg-neo-yellow px-2 py-0.5 border-2 border-black">
              {count}s
            </span>
          </p>

          {/* Quick links */}
          <div className="mb-10">
            <p className="font-bold uppercase tracking-widest text-sm text-gray-500 mb-4">
              Quick Links
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${link.color} border-3 border-black p-3 flex flex-col items-center gap-2 font-bold text-sm uppercase shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all duration-100`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link to="/" className="neo-button inline-flex items-center gap-2 text-base">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 px-4 border-t-3 border-black text-center text-gray-400 text-sm">
        © 2026 Resume AI. All rights reserved.
      </footer>
    </div>
  );
}