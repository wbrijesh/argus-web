import { NextResponse } from "next/server";

export function middleware(request) {
  // We'll handle auth checks in the components instead
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
