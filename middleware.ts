import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function genNonce() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Buffer.from(bytes).toString("base64");
}

export async function middleware(req: NextRequest) {
    const { pathname, searchParams, origin } = req.nextUrl;

    const nonce = genNonce();
    const res = NextResponse.next();

    const imgSrcList = [`'self'`, `data:`];
    const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/images";
    try {
        const u = new URL(base);
        imgSrcList.push(`${u.protocol}//${u.host}`);
    } catch {}

    const csp = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.clarity.ms`,
        `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net`,
        `img-src ${imgSrcList.join(" ")}`,
        `font-src 'self' https://cdn.jsdelivr.net data:`,
        `connect-src 'self' http://localhost:8080 https://www.clarity.ms https://region1.analytics.azure.com`,
        `frame-src https://www.googletagmanager.com`,
        `frame-ancestors 'none'`,
        `object-src 'none'`,
        `base-uri 'self'`,
    ].join("; ");
    res.headers.set("Content-Security-Policy", csp);
    res.headers.set("x-nonce", nonce);
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("Permissions-Policy", "geolocation=()");

    // Only handle onboarding route
    if (!pathname.startsWith("/onboarding")) {
        return res;
    }

    // Probe auth state by hitting backend via Next rewrite with incoming cookies
    try {
        const meRes = await fetch(`${origin}/api/v1/users-auth/me`, {
            method: "GET",
            headers: {
                // forward cookies to backend so session is recognized
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

    return res;
}

export const config = {
    matcher: ["/onboarding"],
};
