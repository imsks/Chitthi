import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_API_PREFIXES = [
	"/api/v1/auth/google",
	"/api/v1/auth/logout",
	"/api/v1/auth/upsert"
] as const

function isPublicApiV1(pathname: string): boolean {
	return PUBLIC_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
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

	const token = await getToken({ req: request, secret })
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
