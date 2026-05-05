import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

/**
 * Sets the Go API `jwt` cookie by forwarding the Google ID token from the NextAuth session.
 * Call after NextAuth sign-in when middleware detects session but no Chitthi cookie.
 */
export async function GET(req: NextRequest) {
	const secret = process.env.NEXTAUTH_SECRET
	if (!secret) {
		return NextResponse.redirect(new URL("/login?error=config", req.url))
	}

	const token = await getToken({ req, secret })
	const idToken = token?.googleIdToken as string | undefined
	if (!idToken) {
		return NextResponse.redirect(new URL("/login?error=session", req.url))
	}

	const apiBase = process.env.INTERNAL_API_URL || "http://localhost:8080"
	const res = await fetch(`${apiBase}/api/v1/auth/google`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ credential: idToken })
	})

	if (!res.ok) {
		return NextResponse.redirect(new URL("/login?error=backend", req.url))
	}

	const nextParam = req.nextUrl.searchParams.get("next") || "/dashboard"
	let nextUrl: URL
	try {
		nextUrl = new URL(nextParam, req.url)
	} catch {
		nextUrl = new URL("/dashboard", req.url)
	}
	if (nextUrl.origin !== new URL(req.url).origin) {
		nextUrl = new URL("/dashboard", req.url)
	}

	const out = NextResponse.redirect(nextUrl)
	const hdrs = res.headers as Headers & { getSetCookie?: () => string[] }
	const cookies = typeof hdrs.getSetCookie === "function" ? hdrs.getSetCookie() : []
	if (cookies.length > 0) {
		for (const c of cookies) {
			out.headers.append("Set-Cookie", c)
		}
	} else {
		const single = res.headers.get("set-cookie")
		if (single) {
			out.headers.append("Set-Cookie", single)
		}
	}
	return out
}
