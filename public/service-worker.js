
    // Based off of https://github.com/pwa-builder/PWABuilder/blob/main/docs/sw.js

    /*
      Welcome to our basic Service Worker! This Service Worker offers a basic offline experience
      while also being easily customizeable. You can add in your own code to implement the capabilities
      listed below, or change anything else you would like.


      Need an introduction to Service Workers? Check our docs here: https://docs.pwabuilder.com/#/home/sw-intro
      Want to learn more about how our Service Worker generation works? Check our docs here: https://docs.pwabuilder.com/#/studio/existing-app?id=add-a-service-worker

      Did you know that Service Workers offer many more capabilities than just offline? 
        - Background Sync: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/06
        - Periodic Background Sync: https://web.dev/periodic-background-sync/
        - Push Notifications: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07?id=push-notifications-on-the-web
        - Badges: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07?id=application-badges
    */

    const HOSTNAME_WHITELIST = [
        self.location.hostname,
        'fonts.gstatic.com',
        'fonts.googleapis.com',
        'cdn.jsdelivr.net'
    ];

    const STATIC_ASSETS = [
      '/',
      '/index.html',
      '/manifest.json',
      '/icons/icon-192.png',
      '/icons/icon-512.png'
    ];

    const APP_SHELL_CACHE = 'app-shell-v2'; // Bump version to force update

    // The Util Function to hack URLs of intercepted requests
    const getFixedUrl = (req) => {
        const url = new URL(req.url);

        // Do NOT modify versioned asset URLs (Vite hashed chunks)
        if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
            return url.href;
        }

        // 1. fixed http URL
        // Just keep syncing with location.protocol
        // fetch(httpURL) belongs to active mixed content.
        // And fetch(httpRequest) is not supported yet.
        url.protocol = self.location.protocol;

        // 2. add query for caching-busting on same-origin HTML/JSON/etc.
        // Avoid breaking cache keys for static hashed assets.
        if (url.hostname === self.location.hostname) {
            url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();
        }
        return url.href;
    }

    /**
     *  @Lifecycle Activate
     *  New one activated when old isnt being used.
     *
     *  waitUntil(): activating ====> activated
     */
        self.addEventListener('install', event => {
            // Skip waiting immediately to activate new SW faster
            self.skipWaiting();
            event.waitUntil(
                caches.open(APP_SHELL_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
            );
        });

        self.addEventListener('activate', event => {
            event.waitUntil(
                (async () => {
                    const keys = await caches.keys();
                    await Promise.all(
                        keys.filter(k => k !== APP_SHELL_CACHE && k !== 'pwa-cache').map(k => caches.delete(k))
                    );
                    // Claim all clients immediately
                    await self.clients.claim();
                })()
            );
        });

    /**
     *  @Functional Fetch
     *  All network requests are being intercepted here.
     *
     *  void respondWith(Promise<Response> r)
     */
    self.addEventListener('fetch', event => {
    // Skip some of cross-origin requests, like those for Google Analytics.
        if (event.request.method !== 'GET') return;

        // Return app shell for navigation requests (SPA offline support)
        // ALWAYS fetch fresh from network for navigation to avoid stale shell
        if (event.request.mode === 'navigate') {
            event.respondWith(
                (async () => {
                    try {
                        // Force fresh network fetch for HTML to avoid stale cache
                        const networkResp = await fetch(event.request, { cache: 'no-cache' });
                        return networkResp;
                    } catch (e) {
                        // Only use cached shell if network fails (true offline)
                        const cache = await caches.open(APP_SHELL_CACHE);
                        return await cache.match('/index.html');
                    }
                })()
            );
            return;
        }

        if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        // Stale-while-revalidate
        // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
        // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
        const cached = caches.match(event.request)
        const fixedUrl = getFixedUrl(event.request)
        const fetched = fetch(fixedUrl, { cache: 'no-store' })
        const fetchedCopy = fetched.then(resp => resp.clone())

        // Call respondWith() with whatever we get first.
        // If the fetch fails (e.g disconnected), wait for the cache.
        // If there’s nothing in cache, wait for the fetch.
        // If neither yields a response, return offline pages.
        event.respondWith(
        Promise.race([fetched.catch(_ => cached), cached])
            .then(resp => resp || fetched)
            .catch(_ => { /* eat any errors */ })
        )

        // Update the cache with the version we fetched (only for ok status)
        event.waitUntil(
                Promise.all([fetchedCopy, caches.open("pwa-cache")])
            .then(([response, cache]) => response.ok && cache.put(event.request, response))
            .catch(_ => { /* eat any errors */ })
        )
    }
    })

        // Message listener for future extensibility (e.g., skipWaiting)
        self.addEventListener('message', event => {
            if (event.data && event.data.type === 'SKIP_WAITING') {
                self.skipWaiting();
            }
        });
