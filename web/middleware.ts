import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecrypt } from "jose"

const PUBLIC_API_PREFIXES = [
	"/api/v1/auth/google",
	"/api/v1/auth/logout",
	"/api/v1/auth/upsert"
] as const

function isPublicApiV1(pathname: string): boolean {
	return PUBLIC_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

async function deriveEncryptionKey(secret: string): Promise<Uint8Array> {
	const encoder = new TextEncoder()
	const ikm = encoder.encode(secret)
	const info = encoder.encode("NextAuth.js Generated Encryption Key")
	const salt = new Uint8Array(32)

	// HKDF-Extract: PRK = HMAC(salt, ikm) — salt is the HMAC key per RFC 5869
	const saltKey = await crypto.subtle.importKey("raw", salt, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
	const prkBuffer = await crypto.subtle.sign("HMAC", saltKey, ikm)
	const prk = await crypto.subtle.importKey("raw", prkBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

	// HKDF-Expand: OKM = HMAC(PRK, info || 0x01)
	const infoAndCounter = new Uint8Array(info.length + 1)
	infoAndCounter.set(info, 0)
	infoAndCounter[info.length] = 1

	const okm = await crypto.subtle.sign("HMAC", prk, infoAndCounter)
	return new Uint8Array(okm).slice(0, 32)
}

async function getNextAuthToken(
	request: NextRequest,
	secret: string
): Promise<Record<string, unknown> | null> {
	const cookie =
		request.cookies.get("__Secure-next-auth.session-token")?.value ??
		request.cookies.get("next-auth.session-token")?.value

	if (!cookie) return null

	try {
		const encryptionKey = await deriveEncryptionKey(secret)
		const { payload } = await jwtDecrypt(cookie, encryptionKey, { clockTolerance: 15 })
		return payload as Record<string, unknown>
	} catch {
		return null
	}
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const isLogin = pathname === "/login"
	const isDashboard = pathname.startsWith("/dashboard")
	const isProtectedApi = pathname.startsWith("/api/v1/") && !isPublicApiV1(pathname)

	if (!isLogin && !isDashboard && !isProtectedApi) {
		return NextResponse.next()
	}

	const secret = process.env.NEXTAUTH_SECRET
	if (!secret) {
		if (isProtectedApi) {
			return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
		}
		return NextResponse.next()
	}

	const token = await getNextAuthToken(request, secret)
	const chitthiUserId = token?.chitthiUserId as number | undefined

	if (isProtectedApi) {
		const bff = process.env.CHITTHI_BFF_SECRET
		if (!bff) {
			return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
		}
		if (chitthiUserId == null) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}
		const requestHeaders = new Headers(request.headers)
		requestHeaders.set("X-User-ID", String(chitthiUserId))
		requestHeaders.set("X-Chitthi-BFF-Secret", bff)
		return NextResponse.next({ request: { headers: requestHeaders } })
	}

	if (isDashboard) {
		if (chitthiUserId == null) {
			const login = new URL("/login", request.url)
			login.searchParams.set("redirect", pathname + request.nextUrl.search)
			return NextResponse.redirect(login)
		}
		return NextResponse.next()
	}

	if (isLogin) {
		const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/dashboard"
		if (chitthiUserId != null) {
			return NextResponse.redirect(new URL(redirectTarget, request.url))
		}
		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/dashboard/:path*", "/login", "/api/v1/:path*"]
}
