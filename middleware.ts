import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Toggle for password protection.
// Set PASSWORD_PROTECTION_ENABLED=false in your .env.local
// to completely disable the password check.
const PASSWORD_PROTECTION_ENABLED =
  process.env.PASSWORD_PROTECTION_ENABLED !== "false";

// Simple password gate for the whole site.
// The actual password is checked in /api/auth/login;
// here we only verify that a valid auth cookie exists.
export function middleware(request: NextRequest) {
  // If protection is disabled, let all requests pass
  if (!PASSWORD_PROTECTION_ENABLED) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("site_auth");

  if (authCookie?.value === "1") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/password";
  url.search = "";

  return NextResponse.redirect(url);
}

// Run middleware on all routes except:
// - Next.js internals and static assets
// - API routes
// - the password page itself
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|password).*)"],
};

