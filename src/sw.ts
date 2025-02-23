import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {  CacheFirst, NetworkFirst,  } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

const routesToPrefetch = ['/','/about', '/contact', '/other-route'];

// Prefetch the specified routes during activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('prefetch-routes');
      await Promise.all(
        routesToPrefetch.map(url => 
          // Fetch and cache each route, ignoring failures
          cache.add(url).catch(() => {})
        )
      );
    })()
  );
});

// Register routes for prefetched pages with CacheFirst strategy
registerRoute(
  ({ url }) => routesToPrefetch.includes(url.pathname),
  new CacheFirst({
    cacheName: 'prefetch-routes',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], 
      }),
    ],
  })
);

const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation",
    networkTimeoutSeconds: 3,
  })
);
registerRoute(navigationRoute);


// Add font caching strategy
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // Optional: Add expiration plugin
      // new ExpirationPlugin({
      //   maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      // }),
    ],
  })
);