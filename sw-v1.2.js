/* global noConnection:false */
var CACHE_NAME = 'youcount-cache-1.1';
var urlsToCache = [
  '/index.html',
  '/images/social.png',
  '/js/script.js'
];
function retrieve(event) {
  if (event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          return cache.addAll(urlsToCache);
        })
    );
  } else {
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    });
  }
}
self.addEventListener('install', retrieve(event));
self.addEventListener('fetch', function (event) {
  try {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          retrieve();
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  } catch (err) {
    noConnection('Service Worker failed to fetch!');
  }
});
