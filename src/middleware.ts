import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth-edge";

const protectedPaths = ["/transporter", "/business", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/transporter") && user.role !== "transporter") {
    return NextResponse.redirect(new URL(`/${user.role}/dashboard`, request.url));
  }
  if (pathname.startsWith("/business") && user.role !== "business") {
    return NextResponse.redirect(new URL(`/${user.role}/dashboard`, request.url));
  }
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL(`/${user.role}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/transporter/:path*", "/business/:path*", "/admin/:path*"],
};
