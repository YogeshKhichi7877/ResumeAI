const CACHE_NAME = 'resumepro-v2';
const STATIC_CACHE = 'resumepro-static-v2';

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Offline — ResumeLens</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',sans-serif;background:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem}
    .wrap{text-align:center;max-width:400px}
    .icon{font-size:5rem;display:block;margin-bottom:1.5rem}
    h1{font-size:2.5rem;font-weight:900;text-transform:uppercase;letter-spacing:-1px;margin-bottom:.75rem}
    p{color:#555;margin-bottom:2rem;line-height:1.6}
    .btn{display:inline-block;background:#000;color:#FFE566;border:3px solid #000;padding:14px 36px;font-weight:800;font-size:1rem;text-transform:uppercase;cursor:pointer;box-shadow:5px 5px 0 #FFE566;text-decoration:none;transition:all .1s}
    .btn:hover{transform:translate(2px,2px);box-shadow:3px 3px 0 #FFE566}
    .links{margin-top:2rem;display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .link{background:#FFE566;border:2px solid #000;padding:12px;font-weight:700;text-decoration:none;color:#000;font-size:.85rem;text-transform:uppercase;box-shadow:3px 3px 0 #000}
  </style>
</head>
<body>
  <div class="wrap">
    <span class="icon">📶</span>
    <h1>You're Offline</h1>
    <p>No internet connection. Check your network and try again.</p>
    <a class="btn" onclick="location.reload()">↺ Retry</a>
    <div class="links">
      <a class="link" href="/">🏠 Home</a>
      <a class="link" href="/features">⚡ Features</a>
      <a class="link" href="/pricing">💰 Pricing</a>
      <a class="link" href="/how-it-works">📖 How It Works</a>
    </div>
  </div>
</body>
</html>`;

// ── Install ───────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      // Always cache the offline fallback inline
      await staticCache.put(
        new Request('/offline.html'),
        new Response(OFFLINE_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      );
      // Cache the SPA shell (index.html) so all routes work offline
      try {
        const res = await fetch('/');
        if (res.ok) {
          await staticCache.put(new Request('/'), res.clone());
          await staticCache.put(new Request('/index.html'), res.clone());
        }
      } catch (_) {}
      self.skipWaiting();
    })()
  );
});

// ── Activate ──────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/@vite/') || url.pathname.includes('/@react-refresh')) return;

  // HTML / navigation — network first, then cached SPA shell, then offline page
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(request);
          if (net.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, net.clone());
            return net;
          }
          throw new Error('bad response');
        } catch {
          // Serve cached SPA shell — React Router handles the route client-side
          const shell = await caches.match('/') || await caches.match('/index.html');
          if (shell) return shell;
          return caches.match('/offline.html');
        }
      })()
    );
    return;
  }

  // Static assets — cache first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|webmanifest)$/) ||
      url.pathname.startsWith('/assets/')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const net = await fetch(request);
          if (net.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, net.clone());
          }
          return net;
        } catch {
          return new Response('', { status: 503 });
        }
      })()
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});