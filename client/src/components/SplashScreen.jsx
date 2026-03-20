import { useEffect, useState } from 'react';

/**
 * SplashScreen
 * Only shown when the app is launched in standalone/PWA mode.
 * Automatically fades out after 2.5 seconds.
 */
export const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('enter'); // enter → visible → exit

  useEffect(() => {
    // Phase 1: animate in (0 → 600ms)
    const t1 = setTimeout(() => setPhase('visible'), 600);
    // Phase 2: start exit (2000ms)
    const t2 = setTimeout(() => setPhase('exit'), 2000);
    // Phase 3: unmount (2500ms)
    const t3 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s ease',
        opacity: phase === 'exit' ? 0 : 1,
      }}
    >
      {/* Animated grid background */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.08,
        backgroundImage: 'linear-gradient(#FFE566 1px, transparent 1px), linear-gradient(90deg, #FFE566 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Logo block */}
      <div style={{
        position: 'relative',
        transform: phase === 'enter' ? 'scale(0.7) translateY(20px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: phase === 'enter' ? 0 : 1,
      }}>
        {/* Big R icon */}
        <div style={{
          width: 100, height: 100,
          background: '#FFE566',
          border: '4px solid #FFE566',
          boxShadow: '8px 8px 0px #FFE566, 16px 16px 0px rgba(255,229,102,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, marginLeft: 'auto', marginRight: 'auto',
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: '3.5rem',
            color: '#000',
            letterSpacing: '-2px',
          }}>R</span>
        </div>

        {/* Brand name */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: '2rem',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            marginBottom: 6,
          }}>RESUME PRO</p>
          <p style={{
            fontFamily: 'monospace',
            color: '#FFE566',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '6px',
            opacity: 0.8,
          }}>AI CAREER TOOLKIT</p>
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        width: 200,
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 0.4s',
      }}>
        <div style={{
          width: '100%', height: 4, background: 'rgba(255,229,102,0.2)',
          border: '1px solid rgba(255,229,102,0.3)',
        }}>
          <div style={{
            height: '100%',
            background: '#FFE566',
            width: phase === 'exit' ? '100%' : '60%',
            transition: 'width 1.5s ease',
          }} />
        </div>
        <p style={{
          fontFamily: 'monospace',
          color: 'rgba(255,229,102,0.6)',
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginTop: 8,
          textAlign: 'center',
        }}>Loading{phase === 'exit' ? '...' : '..'}</p>
      </div>

      {/* Corner decoration */}
      <div style={{
        position: 'absolute', top: 24, right: 24,
        width: 48, height: 48,
        border: '3px solid rgba(255,229,102,0.3)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 0.6s',
      }} />
      <div style={{
        position: 'absolute', bottom: 24, left: 24,
        width: 32, height: 32,
        background: 'rgba(255,229,102,0.15)',
        border: '2px solid rgba(255,229,102,0.3)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 0.8s',
      }} />
    </div>
  );
};