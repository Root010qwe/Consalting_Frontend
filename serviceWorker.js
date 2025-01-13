self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static-cache').then((cache) => {
            return cache.addAll([
              '/',
              '/index.html',
              '/logo192.png',
              '/logo512.png',
              '/manifest.json'
            ]);
          }))
        });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
// self.addEventListener('fetch',() => console.log("fetch"));
  // В a href="" не учитывается basename, поэтому их нужно заменить на Link to="", который будет автоматически подставлять basename