import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, origin } = req.nextUrl;

  // Only handle onboarding route
  if (!pathname.startsWith("/onboarding")) {
    return NextResponse.next();
  }

  // Probe auth state by hitting backend via Next rewrite with incoming cookies
  try {
    const meRes = await fetch(`${origin}/api/v1/users-auth/me`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        accept: "application/json",
      },
      cache: "no-store",
      credentials: "include",
    });

    let isLoggedIn = false;

    if (meRes.ok) {
      // When unauthenticated, backend returns 200 with empty body (content-length: 0)
      // When authenticated, it returns JSON (often chunked)
      const contentLength = meRes.headers.get("content-length");
      const contentType = meRes.headers.get("content-type") || "";

      if (contentType.includes("application/json") || contentLength === null) {
        // Try to parse; if it fails it's likely empty
        try {
          const data = await meRes.json();
          if (data) isLoggedIn = true;
        } catch {
          isLoggedIn = false;
        }
      } else if (contentLength && contentLength !== "0") {
        isLoggedIn = true;
      }
    }

    if (isLoggedIn) {
      const redirectTo = searchParams.get("redirectTo") || "/";
      const url = new URL(redirectTo, origin);
      return NextResponse.redirect(url);
    }
  } catch {
    // On error, allow onboarding to load
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding"],
};


