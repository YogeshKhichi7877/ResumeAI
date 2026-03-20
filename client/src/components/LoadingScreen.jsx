import { useEffect, useState } from 'react';

/**
 * LoadingScreen
 *
 * Used in TWO places:
 * 1. App-wide initial load (pass onDone prop — auto-dismisses after load)
 * 2. PWA splash screen (standalone mode)
 * 3. As a standalone page loader (no onDone — shown indefinitely)
 *
 * Props:
 *   onDone     — callback fired when animation completes (optional)
 *   minTime    — minimum ms to show (default 2200)
 *   message    — custom message below logo (optional)
 */
export const LoadingScreen = ({ onDone, minTime = 2200, message = '' }) => {
  const [phase, setPhase]       = useState('enter');   // enter → run → exit
  const [progress, setProgress] = useState(0);
  const [tip, setTip]           = useState(0);

  const tips = [
    'Analysing ATS patterns...',
    'Loading AI models...',
    'Preparing career tools...',
    'Almost ready...',
  ];

  useEffect(() => {
    // Phase 1: slide in (0 → 400ms)
    const t1 = setTimeout(() => setPhase('run'), 400);

    // Progress bar animation
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / minTime) * 100);
      setProgress(pct);
      setTip(Math.floor((pct / 100) * tips.length));
    }, 50);

    // Phase 2: finish + exit
    const t2 = setTimeout(() => {
      setProgress(100);
      setPhase('exit');
      clearInterval(interval);
    }, minTime);

    // Phase 3: unmount
    const t3 = onDone ? setTimeout(onDone, minTime + 500) : null;

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
      clearInterval(interval);
    };
  }, [minTime, onDone]);

  return (
    <>
      <style>{`
        @keyframes rp-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rp-scaleIn {
          from { opacity: 0; transform: scale(0.75); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes rp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes rp-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes rp-scanline {
          0%   { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes rp-cornerSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(90deg); }
        }
        .rp-logo-wrap {
          animation: rp-scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        .rp-tagline {
          animation: rp-fadeUp 0.4s ease 0.6s both;
        }
        .rp-progress-wrap {
          animation: rp-fadeUp 0.4s ease 0.8s both;
        }
        .rp-tip {
          animation: rp-fadeUp 0.4s ease 1s both;
        }
        .rp-shimmer {
          background: linear-gradient(90deg,transparent 0%,rgba(255,229,102,0.4) 50%,transparent 100%);
          background-size: 400px 100%;
          animation: rp-shimmer 1.5s infinite linear;
        }
        .rp-scanline {
          position: absolute; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,transparent,#FFE566,transparent);
          animation: rp-scanline 2s linear infinite;
          opacity: 0.5;
        }
      `}</style>

      <div
        style={{
          position:   'fixed',
          inset:      0,
          background: '#000',
          zIndex:     9999,
          display:    'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding:    '2rem',
          transition: 'opacity 0.5s ease',
          opacity:    phase === 'exit' ? 0 : 1,
          pointerEvents: phase === 'exit' ? 'none' : 'all',
        }}
      >

        {/* ── Scanline effect ─────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="rp-scanline" />
        </div>

        {/* ── Grid background ─────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#FFE566 1px,transparent 1px),linear-gradient(90deg,#FFE566 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />

        {/* ── Corner decorations ──────────────────────────────── */}
        {[
          { top: 20, left: 20 },
          { top: 20, right: 20 },
          { bottom: 20, left: 20 },
          { bottom: 20, right: 20 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 40, height: 40,
            border: '3px solid rgba(255,229,102,0.25)',
            opacity: phase === 'enter' ? 0 : 1,
            transition: `opacity 0.4s ease ${0.3 + i * 0.1}s`,
          }} />
        ))}

        {/* ── Main content ────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 340, textAlign: 'center' }}>

          {/* Logo box */}
          <div className="rp-logo-wrap" style={{ marginBottom: 28 }}>
            <div style={{
              display: 'inline-block',
              background: '#FFE566',
              border: '4px solid #FFE566',
              boxShadow: '8px 8px 0 #FFE566, 16px 16px 0 rgba(255,229,102,0.2)',
              padding: '20px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Shimmer overlay */}
              <div className="rp-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

              {/* Your actual logo */}
              <img
                src="/full_logo_navbar.svg"
                alt="Resume AI"
                style={{
                  height: 52,
                  width: 'auto',
                  display: 'block',
                  filter: 'brightness(0)',  // makes logo black (works on any color logo)
                  imageRendering: 'crisp-edges',
                }}
                onError={(e) => {
                  // Fallback if logo SVG not found
                  e.target.style.display = 'none';
                  document.getElementById('rp-text-logo').style.display = 'flex';
                }}
              />

              {/* Text fallback */}
              <div
                id="rp-text-logo"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.8rem', color: '#FFE566' }}>R</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.6rem', color: '#000', textTransform: 'uppercase', letterSpacing: 2 }}>
                  RESUME PRO
                </span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="rp-tagline" style={{ marginBottom: 36 }}>
            <p style={{
              fontFamily: 'monospace',
              color: 'rgba(255,229,102,0.7)',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '5px',
              margin: 0,
            }}>
              AI CAREER TOOLKIT · INDIA
            </p>
          </div>

          {/* Progress bar */}
          <div className="rp-progress-wrap" style={{ marginBottom: 16 }}>
            {/* Track */}
            <div style={{
              width: '100%',
              height: 6,
              background: 'rgba(255,229,102,0.15)',
              border: '1px solid rgba(255,229,102,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Fill */}
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: `${progress}%`,
                background: '#FFE566',
                transition: 'width 0.1s linear',
                boxShadow: '0 0 12px rgba(255,229,102,0.6)',
              }} />
            </div>

            {/* Percentage */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}>
              <span style={{
                fontFamily: 'monospace',
                color: 'rgba(255,229,102,0.5)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                {message || tips[Math.min(tip, tips.length - 1)]}
              </span>
              <span style={{
                fontFamily: 'monospace',
                color: '#FFE566',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="rp-tip" style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 6,
                height: 6,
                background: i === (Math.floor(progress / 34) % 3) ? '#FFE566' : 'rgba(255,229,102,0.2)',
                border: '1px solid rgba(255,229,102,0.4)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Bottom version tag */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 24,
          fontFamily: 'monospace',
          color: 'rgba(255,229,102,0.2)',
          fontSize: '0.6rem',
          letterSpacing: '2px',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 0.4s ease 1s',
        }}>
          v3.0 · resumeai.in
        </div>
      </div>
    </>
  );
};