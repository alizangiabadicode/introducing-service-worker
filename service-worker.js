const expectedCaches = ["static-v2"];

self.addEventListener("install", (event) => {
  console.log("V1 installing…");
  self.skipWaiting();
  // cache a cat SVG
  event.waitUntil(
    Promise.all([
      caches.open("static-v2").then((cache) => cache.add("/horse.jpeg")),
    ])
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all([
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, 5000);
          }),
          ...keys.map((key) => {
            if (!expectedCaches.includes(key)) {
              return caches.delete(key);
            }
          }),
        ])
      )
      .then(() => {
        console.log("V2 now ready to handle fetches!");
        clients.claim();
      })
  );
});

// self.addEventListener("fetch", (event) => {
//   const url = new URL(event.request.url);
//   console.log(
//     "fetch url",
//     event.request.url,
//     url.pathname,
//     url.origin,
//     location.origin,
//     event,
//     caches
//   );

//   if (url.pathname.endsWith('jpeg') && !caches.match(url.pathname))
//     caches.open("static-v2").then((cache) => cache.add(url.pathname))

//   // serve the cat SVG from the cache if the request is
//   // same-origin and the path is '/dog.svg'
//   //   if (url.origin == location.origin && url.pathname == "/dog.jpeg") {
//   //     event.respondWith(caches.match("/cat.jpeg"));
//   //   }
//   if (url.origin == location.origin && url.pathname == "/dog.jpeg") {
//     event.respondWith(caches.match("/horse.jpeg"));
//   }

//   else if (url.pathname.endsWith('jpeg') && caches.match(url.pathname))
//     event.respondWith(caches.match(url.pathname))

// //   if (url.pathname == "/todos/1") {
// //     event.respondWith({ hi: 1 });
// //   }
// });

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);
  console.log(
    "fetch url",
    event.request.url,
    url.pathname,
    url.origin,
    location.origin,
    event,
    caches
  );

  event.respondWith(
    caches.open("mysite-dynamic").then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
        //   response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          }).catch(function (error) {
            console.error("error in service worker")
        })
        );
      });
    })
  )
});

self.addEventListener("sync", function (event) {
  if (event.tag == "myFirstSync") {
    console.log("myFirstSync fired!");
  }
});
