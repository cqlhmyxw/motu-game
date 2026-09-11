const CACHE='motu-v10';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-72.png','./icon-96.png','./icon-128.png','./icon-144.png','./icon-152.png','./icon-192.png','./icon-384.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  // P216: network-first — 优先拉线上新版，离线才回退缓存
  e.respondWith(fetch(e.request).then(res=>{
    const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return res;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});