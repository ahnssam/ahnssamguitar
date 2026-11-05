/* ============================================================
   안쌤의 기타나무숲 — Service Worker (PWA)
   전략:
     - 내비게이션(HTML): 네트워크 우선(매번 서버에 바뀌었는지 확인) → 오프라인이면 캐시 폴백.
       (GitHub Pages 가 자주 업데이트되므로 온라인일 땐 항상 최신.)
     - 동일 출처 정적 자원(GET): stale-while-revalidate
       (캐시 즉시 응답 + 백그라운드 갱신.)
     - 교차 출처(CDN·Supabase·gtag 등): 관여하지 않음(브라우저 기본).
   캐시 버전을 올리면 이전 캐시는 activate 에서 정리됨.
   ============================================================ */
const VERSION = 'gtns-v2';   // v2 (2026-11-06): 페이지를 매번 서버에 확인 — 올리면 예전 캐시도 비운다
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

  // 내비게이션(페이지 이동) → 네트워크 우선, 실패 시 캐시.
  // 그냥 fetch(req) 하면 브라우저 HTTP 캐시(GitHub Pages max-age=600)를 써서 새로 올린 페이지가 10분 동안 예전 것으로 보인다.
  // 그래서 매번 서버에 바뀌었는지 묻는다(cache: 'no-cache' — 안 바뀌었으면 304 라 가볍다). 2026-11-06 사용자 요청.
  // 내비게이션 요청은 옵션을 붙여 다시 만들 수 없어서 주소로 새로 만들고, 넘겨주기(redirect)는 브라우저가 따라가게 manual 로 둔다
  if (req.mode === 'navigate') {
    const fresh = new Request(req.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'manual' });
    event.respondWith(
      fetch(fresh).then(function (res) {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
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
