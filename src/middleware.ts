import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Always allow the login page
  if (pathname === "/login") return NextResponse.next();

  // Check cookie
  const auth = request.cookies.get("admin_auth")?.value;

  if (auth !== process.env.ADMIN_SECRET) {
    // Redirect everything else to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};