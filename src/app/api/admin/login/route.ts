import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { verifyPassword } from "@/lib/password";
import { createAdminSessionToken } from "@/lib/adminSession";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`admin-login:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429 },
    );
  }

  const { email, password } = await req.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await db.admin.findUnique({ where: { email: email.trim().toLowerCase() } });

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (admin.status === "PENDING_VERIFICATION") {
    return NextResponse.json(
      { error: "Please verify your email before signing in." },
      { status: 403 },
    );
  }
  if (admin.status === "PENDING_APPROVAL") {
    return NextResponse.json(
      { error: "Your account is awaiting approval from an existing admin." },
      { status: 403 },
    );
  }
  if (admin.status === "REJECTED") {
    return NextResponse.json({ error: "This account is not authorized." }, { status: 403 });
  }

  const token = await createAdminSessionToken(admin.id);
  const res = NextResponse.json({ ok: true });

  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24h, matches session token TTL
    path: "/",
  });

  return res;
}
