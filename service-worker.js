const CACHE_NAME = "sudoku-pwa-v1";
const FILES_TO_CACHE = [
  "./index.html",
  "./manifest.json"
];

// 安装：缓存页面
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：离线读取缓存，在线更新
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cached) => {
      return cached || fetch(evt.request);
    })
  );
});
