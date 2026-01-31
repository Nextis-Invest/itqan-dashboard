import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next()
  }

  // Allow auth pages
  if (pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // All other routes pass through (auth checked in layouts)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
