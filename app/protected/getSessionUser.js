import { cookies } from "next/headers";

// Lee y parsea la cookie "userData" desde el servidor (Server Components y
// Server Actions). Solo úsese server-side: cookies() de next/headers no
// funciona en un Client Component.
export async function getSessionUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("userData")?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
