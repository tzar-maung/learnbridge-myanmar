const CACHE_NAME = "learnbridge-v95";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=93",
  "./app.js",
  "./app.js?v=92",
  "./lessons.json",
  "./lessons.json?v=92",
  "./resources.json",
  "./resources.json?v=92",
  "./assets/learnbridge-mark.svg",
  "./assets/learnbridge-temple-hero.png",
  "./assets/paths/english-foundations.png",
  "./assets/paths/everyday-mathematics.png",
  "./assets/paths/practical-japanese.png",
  "./assets/paths/thai-foundations.png",
  "./assets/paths/reading-practice.png",
  "./assets/paths/science-explorer.png",
  "./assets/paths/digital-skills.png",
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
