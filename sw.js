/* ============================================================
   안쌤의 기타나무숲 — Service Worker (PWA)
   전략:
     - 내비게이션(HTML): 네트워크 우선 → 오프라인이면 캐시 폴백.
       (GitHub Pages 가 자주 업데이트되므로 온라인일 땐 항상 최신.)
     - 동일 출처 정적 자원(GET): stale-while-revalidate
       (캐시 즉시 응답 + 백그라운드 갱신.)
     - 교차 출처(CDN·Supabase·gtag 등): 관여하지 않음(브라우저 기본).
   캐시 버전을 올리면 이전 캐시는 activate 에서 정리됨.
   ============================================================ */
const VERSION = 'gtns-v1';
const CACHE = 'gtns-cache-' + VERSION;

// 설치 시 미리 담아둘 핵심 셸 (오프라인 최초 진입 대비)
const PRECACHE = [
  '/tools.html',
  '/index.html',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-maskable-192.png',
  '/images/icon-maskable-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // 일부 URL 이 실패해도 설치가 통째로 깨지지 않도록 개별 처리
      return Promise.allSettled(PRECACHE.map(function (u) { return cache.add(u); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;                 // GET 만 처리

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;  // 교차 출처는 패스

  // 내비게이션(페이지 이동) → 네트워크 우선, 실패 시 캐시
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('/tools.html') || caches.match('/index.html');
        });
      })
    );
    return;
  }

  // 그 외 동일 출처 정적 자원 → stale-while-revalidate
  event.respondWith(
    caches.match(req).then(function (cached) {
      const network = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
