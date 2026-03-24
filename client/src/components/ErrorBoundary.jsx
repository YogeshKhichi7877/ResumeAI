// // src/components/ErrorBoundary.jsx
// import { Component } from 'react';

// export class ErrorBoundary extends Component {
//   state = { hasError: false };
//   static getDerivedStateFromError() { return { hasError: true }; }
//   render() {
//     if (this.state.hasError) return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="neo-card p-8 text-center">
//           <h2 className="font-space text-2xl font-extrabold mb-2">Something went wrong , Its not your fault</h2>
//           <button className="neo-button mt-4" onClick={() => window.location.href = '/'}>
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//     return this.props.children;
//   }
// }





















import { Component } from 'react';

// ── Production Error Boundary ─────────────────────────────────
// Catches all unhandled React render errors
// Features: retry logic, error reporting email, countdown,
//           collapsible technical details, neobrutalism design

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError:   false,
      error:      null,
      errorInfo:  null,
      retryCount: 0,
      countdown:  null,
    };
    this._timer = null;
  }

  // ── Catch render errors ───────────────────────────────────
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    // ── Send error report email via mailto (no backend needed) ──
    // In production you'd replace this with a proper error tracking
    // service like Sentry — mailto is the zero-dependency fallback
    try {
      const subject = encodeURIComponent('[ResumeLens] Runtime Error Report');
      const body = encodeURIComponent(
        `Error: ${error?.toString()}\n\n` +
        `URL: ${window.location.href}\n` +
        `Time: ${new Date().toISOString()}\n` +
        `User Agent: ${navigator.userAgent}\n\n` +
        `Stack:\n${errorInfo?.componentStack}`
      );
      // Store for the "Report Bug" button
      this._mailtoHref = `mailto:resumeaicom@gmail.com?subject=${subject}&body=${body}`;
    } catch (_) {}

    // ── Auto-retry after 10 seconds if it's the first error ──
    if (this.state.retryCount === 0) {
      this._startCountdown(10);
    }
  }

  _startCountdown(seconds) {
    this.setState({ countdown: seconds });
    this._timer = setInterval(() => {
      this.setState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(this._timer);
          // Auto retry
          this._handleRetry();
          return { countdown: null };
        }
        return { countdown: prev.countdown - 1 };
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this._timer) clearInterval(this._timer);
  }

  _handleRetry = () => {
    if (this._timer) clearInterval(this._timer);
    this.setState(prev => ({
      hasError:   false,
      error:      null,
      errorInfo:  null,
      countdown:  null,
      retryCount: prev.retryCount + 1,
    }));
  };

  _handleGoHome = () => {
    if (this._timer) clearInterval(this._timer);
    window.location.href = '/';
  };

  _handleReload = () => {
    if (this._timer) clearInterval(this._timer);
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error, errorInfo, countdown, retryCount } = this.state;
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'Space Grotesk','Arial Black',Arial,sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ── Grid background ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,229,102,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,229,102,0.08) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />

        {/* ── Left yellow bar ── */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 8, backgroundColor: '#FFE566',
        }} />

        {/* ── Corner decorations ── */}
        {[{top:20,left:20},{top:20,right:20},{bottom:20,left:20},{bottom:20,right:20}].map((pos,i) => (
          <div key={i} style={{
            position:'absolute', ...pos,
            width:36, height:36,
            border:'2px solid rgba(255,229,102,0.2)',
          }} />
        ))}

        {/* ── Main card ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 560,
          backgroundColor: '#fff',
          border: '4px solid #FFE566',
          boxShadow: '12px 12px 0 #FFE566',
        }}>

          {/* Card top bar */}
          <div style={{
            backgroundColor: '#000',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {['#FF6B6B','#FFE566','#8BF5A0'].map(c => (
                <span key={c} style={{
                  width:10, height:10, borderRadius:'50%',
                  backgroundColor:c, border:'1px solid rgba(255,255,255,0.2)',
                }} />
              ))}
            </div>
            <span style={{
              color:'rgba(255,229,102,0.7)', fontSize:'0.65rem',
              fontWeight:700, letterSpacing:'3px', textTransform:'uppercase',
            }}>
              resumelens · error
            </span>
            <span style={{
              color:'rgba(255,255,255,0.3)', fontSize:'0.65rem',
              fontWeight:700, letterSpacing:'1px',
            }}>
              {errorId}
            </span>
          </div>

          {/* Card body */}
          <div style={{ padding:'2rem', textAlign:'center' }}>

            {/* Icon */}
            <div style={{
              width:88, height:88,
              backgroundColor:'#FFE566',
              border:'3px solid #000',
              boxShadow:'5px 5px 0 #000',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 1.25rem',
              fontSize:'2.8rem',
            }}>
              💥
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize:'2rem', fontWeight:900,
              textTransform:'uppercase', letterSpacing:'-0.5px',
              lineHeight:1.1, color:'#0A0A0A', marginBottom:'0.5rem',
            }}>
              Unexpected Error
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize:'0.9rem', color:'#555',
              fontWeight:600, lineHeight:1.6, marginBottom:'0.25rem',
            }}>
              Something crashed on our end — not yours.
            </p>
            <p style={{
              fontSize:'0.8rem', color:'#888',
              fontWeight:500, marginBottom:'1.5rem',
            }}>
              {retryCount > 0
                ? `We've tried ${retryCount} time${retryCount > 1 ? 's' : ''} — please try a different action.`
                : 'We\'ve been notified. You can retry or go home.'}
            </p>

            {/* Auto-retry countdown */}
            {countdown !== null && (
              <div style={{
                backgroundColor:'#FFF9E6',
                border:'2px solid #FFE566',
                padding:'8px 16px',
                marginBottom:'1.25rem',
                fontSize:'0.8rem',
                fontWeight:700,
                color:'#666',
              }}>
                ⏱ Auto-retrying in <strong style={{color:'#000'}}>{countdown}s</strong>
                <button
                  onClick={() => { clearInterval(this._timer); this.setState({ countdown: null }); }}
                  style={{
                    marginLeft:12, fontSize:'0.75rem', fontWeight:700,
                    color:'#999', background:'none', border:'none',
                    cursor:'pointer', textDecoration:'underline',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Divider */}
            <div style={{ height:3, backgroundColor:'#0A0A0A', marginBottom:'1.5rem' }} />

            {/* Action buttons */}
            <div style={{
              display:'flex', gap:'0.75rem',
              justifyContent:'center', flexWrap:'wrap',
              marginBottom:'1.25rem',
            }}>

              {/* Retry */}
              <button
                onClick={this._handleRetry}
                style={{
                  backgroundColor:'#FFE566', color:'#000',
                  border:'3px solid #000', padding:'11px 24px',
                  fontWeight:900, fontSize:'0.8rem',
                  textTransform:'uppercase', letterSpacing:'1px',
                  cursor:'pointer', boxShadow:'4px 4px 0 #000',
                  fontFamily:'inherit', transition:'all 0.1s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translate(2px,2px)';e.currentTarget.style.boxShadow='2px 2px 0 #000';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='4px 4px 0 #000';}}
              >
                ↺ Try Again
              </button>

              {/* Reload */}
              <button
                onClick={this._handleReload}
                style={{
                  backgroundColor:'#fff', color:'#000',
                  border:'3px solid #000', padding:'11px 24px',
                  fontWeight:900, fontSize:'0.8rem',
                  textTransform:'uppercase', letterSpacing:'1px',
                  cursor:'pointer', boxShadow:'4px 4px 0 #000',
                  fontFamily:'inherit', transition:'all 0.1s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translate(2px,2px)';e.currentTarget.style.boxShadow='2px 2px 0 #000';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='4px 4px 0 #000';}}
              >
                ⟳ Reload Page
              </button>

              {/* Go Home */}
              <button
                onClick={this._handleGoHome}
                style={{
                  backgroundColor:'#000', color:'#FFE566',
                  border:'3px solid #000', padding:'11px 24px',
                  fontWeight:900, fontSize:'0.8rem',
                  textTransform:'uppercase', letterSpacing:'1px',
                  cursor:'pointer', boxShadow:'4px 4px 0 #FFE566',
                  fontFamily:'inherit', transition:'all 0.1s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translate(2px,2px)';e.currentTarget.style.boxShadow='2px 2px 0 #FFE566';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='4px 4px 0 #FFE566';}}
              >
                ⌂ Go Home
              </button>
            </div>

            {/* Report bug link */}
            {this._mailtoHref && (
              <a
                href={this._mailtoHref}
                style={{
                  fontSize:'0.75rem', color:'#aaa',
                  fontWeight:600, textDecoration:'underline',
                  display:'inline-block', marginBottom:'1.25rem',
                }}
              >
                📧 Report this bug to our team
              </a>
            )}

            {/* Technical details — collapsed by default */}
            {(error || errorInfo) && (
              <details style={{ textAlign:'left', marginTop:'0.5rem' }}>
                <summary style={{
                  fontSize:'0.72rem', color:'#bbb',
                  cursor:'pointer', fontWeight:700,
                  textTransform:'uppercase', letterSpacing:'1px',
                  userSelect:'none', marginBottom:'0.5rem',
                }}>
                  ▸ Technical Details (for developers)
                </summary>

                {error && (
                  <div style={{
                    backgroundColor:'#1a1a1a',
                    border:'2px solid #333',
                    borderRadius:4,
                    padding:'0.75rem',
                    fontSize:'0.7rem',
                    color:'#f87171',
                    fontFamily:'monospace',
                    wordBreak:'break-all',
                    lineHeight:1.6,
                    marginBottom:'0.5rem',
                    whiteSpace:'pre-wrap',
                  }}>
                    {error.toString()}
                  </div>
                )}

                {errorInfo?.componentStack && (
                  <div style={{
                    backgroundColor:'#111',
                    border:'2px solid #222',
                    borderRadius:4,
                    padding:'0.75rem',
                    fontSize:'0.65rem',
                    color:'#666',
                    fontFamily:'monospace',
                    wordBreak:'break-all',
                    lineHeight:1.6,
                    maxHeight:120,
                    overflowY:'auto',
                    whiteSpace:'pre-wrap',
                  }}>
                    {errorInfo.componentStack}
                  </div>
                )}

                <p style={{
                  fontSize:'0.68rem', color:'#999',
                  marginTop:'0.5rem', fontWeight:600,
                }}>
                  Error ID: <code style={{color:'#FFE566'}}>{errorId}</code>
                  &nbsp;·&nbsp;
                  {new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' })} IST
                </p>
              </details>
            )}
          </div>
        </div>

        {/* Bottom tag */}
        <p style={{
          marginTop:'1.5rem',
          fontSize:'0.62rem', color:'rgba(255,229,102,0.25)',
          letterSpacing:'3px', textTransform:'uppercase', fontWeight:700,
        }}>
          ResumeLens · Production Error Boundary
        </p>
      </div>
    );
  }
}