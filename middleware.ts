import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rotas da API Auth — sempre deixar passar
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }
  // Webhooks — deixar passar e não cachear
  if (pathname.startsWith("/api/webhooks/")) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Rotas da área autenticada (app): sem sessão → login com callbackUrl
  const isAppRoute =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/profile") ||
    (/^\/[^/]+(\/.*)?$/.test(pathname) &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/verify") &&
      !pathname.startsWith("/api"));

  if (isAppRoute && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rotas de auth (login, register, verify): com sessão ativa → onboarding
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify");
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
