const CACHE = "gezi-harcama-v21";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png", "couple1.png", "logo.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Uygulama kabuğu: ÖNBELLEK-ÖNCELİKLİ (stale-while-revalidate).
// Önbellekte varsa anında onu döndür (hızlı açılış), bu sırada arka planda
// güncel sürümü indirip önbelleği tazele → güncellemeler bir sonraki açılışta gelir.
// API istekleri (Supabase, kur) sw'ye takılmaz; onlar her zaman ağdan.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match("index.html"));
      return cached || network; // önbellekte varsa anında; yoksa ağı bekle
    })
  );
});
