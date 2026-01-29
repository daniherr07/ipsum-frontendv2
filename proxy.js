import { NextResponse } from "next/server";

export function proxy(request) {
  const userData = request.cookies.get("userData");

  // Si NO existe la cookie → redirigir a /login
  if (!userData) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si existe → permitir el acceso
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"],
};
