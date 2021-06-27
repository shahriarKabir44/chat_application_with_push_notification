self.addEventListener('push', (e) => {
    console.log(e.data.text())
    var dat = JSON.parse(e.data.text())
    self.registration.showNotification(dat.title, {
        body: dat.body,
        icon: 'https://firebasestorage.googleapis.com/v0/b/pqrs-9e8eb.appspot.com/o/167322533_2991921411089144_4216783957994531514_n.jpg?alt=media&token=ca2241fe-eef4-4b44-993c-670d8401afcb',
    })
})

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll([
                "/",
                'css/index.css',
                'js/index.js',
                'js/registerWorker.js',
                'logo.png',
                'index.html',
                'manifest.json'
            ])
        })
    )
})

self.onfetch = function (event) {
    event.respondWith(
        (async function () {
            var cache = await caches.open('static');
            var cachedFiles = await cache.match(event.request);
            if (cachedFiles) {
                return cachedFiles;
            } else {
                try {
                    var response = await fetch(event.request);
                    await cache.put(event.request, response.clone());
                    return response;
                } catch (e) { /* ... */ }
            }
        }())
    )
}