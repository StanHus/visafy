import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedPaths = ["/onboarding", "/dashboard"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
