const CACHE_NAME = "learnbridge-v47";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=47",
  "./app.js",
  "./app.js?v=47",
  "./lessons.json",
  "./lessons.json?v=47",
  "./resources.json",
  "./resources.json?v=47",
  "./assets/arakan-landscape.jfif",
  "./manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(event.request);
    })
  );
});
