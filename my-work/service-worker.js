var cacheName = 'weatherPWA-step-6-1'; // The cache for app shell
var dataCacheName = 'weatherData-v1'; // The dynamic cache content for weather data get from API. Ref: https://github.com/GoogleChromeLabs/sw-precache/blob/master/GettingStarted.md#dynamic-content

var filesToCache = [    //app shells (static files)
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

self.addEventListener('install', function(e) {
  console.log('[Service worker] install');
  e.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('[Service worker] caching app shell');
        return cache.addAll(filesToCache);
      })
  )
});

self.addEventListener('activate', function(e) {
  console.log('[Service worker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key != cacheName && key != dataCacheName) { // Removing old cache, current sw cache and dynamic cache are excluded
          console.log('Removing old cache');
          return caches.delete(key);
        }
      }))
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';

  // Separate applications data (weather live data) from the app shell

  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(                            // For dynamic content (API data), use cache-first-then-network strategy. Ref: https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
      caches.open(dataCacheName)
        .then(function(cache) {
          return fetch(e.request).then(function(response) {
            cache.put(e.request.url, response.clone());

            return response;
          })
        })
    )
  } else {                                    // Cache all app shells
    e.respondWith(
      caches.match(e.request)
        .then(function (response) {
          return response || fetch(e.request);
        })
    )
  }
});

