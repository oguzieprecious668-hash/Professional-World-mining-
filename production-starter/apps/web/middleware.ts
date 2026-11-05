import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isProtectedRoute = isAdminRoute
    || path.startsWith("/dashboard")
    || path.startsWith("/account");
  const user = request.auth?.user;

  if (isProtectedRoute && !user) {
    const login = new URL("/login", request.nextUrl);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (isAdminRoute) {
    if (!user?.roles?.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/forbidden", request.nextUrl));
    }
    if (!user.mfaAuthenticated) {
      return NextResponse.redirect(new URL("/mfa-required", request.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/admin/:path*"],
};
