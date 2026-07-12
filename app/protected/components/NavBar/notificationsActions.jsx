"use server";

export async function getNotifications(userId) {
  const endpoint = process.env.BACKEND_URL + `/notifications/${userId}`;

  const res = await fetch(endpoint, { cache: "no-store" }).catch(() => null);

  if (!res || !res.ok) {
    return { notifications: [], unreadCount: 0 };
  }

  return res.json();
}

export async function markNotificationRead(id, usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/markNotificationRead";

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, usuario_id: usuarioId }),
  }).catch(() => null);
}

export async function markAllNotificationsRead(usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/markAllNotificationsRead";

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId }),
  }).catch(() => null);
}

export async function deleteNotification(id, usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/deleteNotification";

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, usuario_id: usuarioId }),
  }).catch(() => null);
}

export async function deleteAllNotifications(usuarioId) {
  const endpoint = process.env.BACKEND_URL + "/deleteAllNotifications";

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId }),
  }).catch(() => null);
}
