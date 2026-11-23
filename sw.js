/* Service worker da Manutencao R2: abre sem internet e mantem o app atualizado.
   HTML: rede primeiro (sempre a versao nova), cache se estiver offline.
   Bibliotecas e icones: cache primeiro. API do Supabase e Google Drive: nunca em cache. */
const CACHE = 'r2-manutencao-v2';
const BASE = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './stilo-centro.html','./stilo-borges.html','./stilo-vita.html','./stilo-garden.html','./chateau.html','./golden.html','./pedras-altas.html',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return;
  // Fotos e script do Drive: sempre direto da rede (lista sempre atualizada, sem encher o celular)
  if (url.hostname === 'script.google.com' || url.hostname === 'drive.google.com' || url.hostname.endsWith('googleusercontent.com')) return;
  const ehPagina = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (ehPagina && url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })
      .catch(() => caches.match(req, {ignoreSearch: false}).then(r => r || caches.match(req, {ignoreSearch: true})).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  }).catch(() => hit)));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(cs => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow(e.notification.data && e.notification.data.url || './');
  }));
});
