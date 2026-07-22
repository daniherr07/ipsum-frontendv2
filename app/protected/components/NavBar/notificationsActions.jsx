"use server";

export async function getNotifications(userId) {
  const endpoint = process.env.BACKEND_URL + `/notifications/${userId}`;

  console.log(`[getNotifications] consultando notificaciones del usuario ${userId}`);

  const res = await fetch(endpoint, { cache: "no-store" }).catch((error) => {
    console.error(`[getNotifications] fetch falló a nivel de red (usuario ${userId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[getNotifications] no se pudieron obtener notificaciones del usuario ${userId} (status ${res?.status})`);
    return { notifications: [], unreadCount: 0 };
  }

  return res.json();
}

export async function markNotificationRead(id, usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/markNotificationRead";

  console.log(`[markNotificationRead] marcando notificación ${id} como leída (usuario ${usuarioId})`);

  // NOTA (no corregido): no se revisa res.ok acá, así que si el backend
  // rechaza la petición esto falla en silencio (la notificación queda como
  // no leída pero no se informa a quien llamó).
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, usuario_id: usuarioId }),
  }).catch((error) => {
    console.error(`[markNotificationRead] fetch falló a nivel de red (notificación ${id}, usuario ${usuarioId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[markNotificationRead] el backend no pudo marcar la notificación ${id} como leída (status ${res?.status})`);
  }
}

export async function markAllNotificationsRead(usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/markAllNotificationsRead";

  console.log(`[markAllNotificationsRead] marcando todas las notificaciones como leídas (usuario ${usuarioId})`);

  // NOTA (no corregido): no se revisa res.ok acá, igual que en
  // markNotificationRead — un fallo del backend pasa desapercibido para
  // quien llamó.
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId }),
  }).catch((error) => {
    console.error(`[markAllNotificationsRead] fetch falló a nivel de red (usuario ${usuarioId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[markAllNotificationsRead] el backend no pudo marcar todas como leídas (usuario ${usuarioId}, status ${res?.status})`);
  }
}

export async function deleteNotification(id, usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/deleteNotification";

  console.log(`[deleteNotification] borrando notificación ${id} (usuario ${usuarioId})`);

  // NOTA (no corregido): no se revisa res.ok acá — un fallo del backend
  // pasa desapercibido para quien llamó.
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, usuario_id: usuarioId }),
  }).catch((error) => {
    console.error(`[deleteNotification] fetch falló a nivel de red (notificación ${id}, usuario ${usuarioId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[deleteNotification] el backend no pudo borrar la notificación ${id} (status ${res?.status})`);
  }
}

export async function deleteAllNotifications(usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/deleteAllNotifications";

  console.log(`[deleteAllNotifications] borrando todas las notificaciones (usuario ${usuarioId})`);

  // NOTA (no corregido): no se revisa res.ok acá — un fallo del backend
  // pasa desapercibido para quien llamó.
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId }),
  }).catch((error) => {
    console.error(`[deleteAllNotifications] fetch falló a nivel de red (usuario ${usuarioId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[deleteAllNotifications] el backend no pudo borrar todas las notificaciones (usuario ${usuarioId}, status ${res?.status})`);
  }
}
