// Service worker mínimo: lo justo para que el navegador considere la app
// "instalable" (criterio de Chrome/Android para el banner de instalación).
// A propósito NO cachea nada: este sistema depende de datos en vivo
// (proyectos, notificaciones, etc.) y cachear agresivamente podría mostrar
// información desactualizada o vieja a los usuarios.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Passthrough: cada request sigue su curso normal a la red.
});
