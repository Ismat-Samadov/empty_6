import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET ?? "kreditor-fallback-secret"
  );

async function parseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { role?: string; bankSlug?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("kreditor_token")?.value;

  // Super admin routes — everything under /admin except /admin/login and /admin/bank/*
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/bank/")
  ) {
    if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
    const payload = await parseToken(token);
    if (!payload || payload.role !== "super_admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Bank admin routes — /admin/bank/[slug]/* except the login page
  const bankMatch = pathname.match(/^\/admin\/bank\/([^/]+)/);
  if (bankMatch) {
    const slug = bankMatch[1];
    const loginPath = `/admin/bank/${slug}/login`;
    if (pathname !== loginPath) {
      const loginUrl = new URL(loginPath, req.url);
      if (!token) return NextResponse.redirect(loginUrl);
      const payload = await parseToken(token);
      if (!payload || payload.role !== "bank_admin" || payload.bankSlug !== slug) {
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
