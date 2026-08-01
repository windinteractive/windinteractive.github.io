// Bump to invalidate the precache; the activate handler drops older versions.
const CACHE = 'dingdong-v10';

// The app shell. The 192/512 manifest icons are deliberately absent: the OS
// fetches those at install time, and precaching them would add ~530 KB the
// running app never reads.
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './router.js',
  './opfs.js',
  './manifest.json',
  './vendor/preact-standalone.mjs',
  './components/Icon.js',
  './components/Nav.js',
  './components/Splash.js',
  './components/Onboarding.js',
  './components/Login.js',
  './components/Keypad.js',
  './components/Loading.js',
  './components/Home.js',
  './components/Contacts.js',
  './components/Chat.js',
  './icons/waves/soundwave-01.svg',
  './icons/waves/soundwave-02.svg',
  './icons/waves/soundwave-03.svg',
  './icons/waves/soundwave-04.svg',
  './icons/waves/soundwave-05.svg',
  './icons/logo.webp',
  './icons/btn-bg.webp',
  './icons/bg.webp',
  './icons/get-start-bg.webp',
  './img/login_logo.png',
  './img/bg.png',
  './icons/apple-touch-icon-180.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  // Cache-first: the shell is fully versioned, so a hit is always current for
  // this CACHE generation.
  event.respondWith(
    caches.match(request).then(hit => {
      if (hit) return hit;
      return fetch(request)
        .then(response => {
          if (response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        // A navigation that misses the cache while offline still gets the shell,
        // which can route itself from the URL hash.
        .catch(() => (request.mode === 'navigate' ? caches.match('./index.html') : Promise.reject()));
    })
  );
});
