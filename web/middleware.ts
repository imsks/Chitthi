import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const isLogin = pathname === "/login"
	const isDashboard = pathname.startsWith("/dashboard")

	if (!isLogin && !isDashboard) {
		return NextResponse.next()
	}

	const secret = process.env.NEXTAUTH_SECRET
	const token = secret ? await getToken({ req: request, secret }) : null
	const chitthiJwt = request.cookies.get("jwt")?.value

	const syncUrl = (nextPath: string) => {
		const u = new URL("/api/chitthi/sync", request.url)
		u.searchParams.set("next", nextPath)
		return u
	}

	if (isDashboard) {
		if (!token && !chitthiJwt) {
			const login = new URL("/login", request.url)
			login.searchParams.set("redirect", pathname + request.nextUrl.search)
			return NextResponse.redirect(login)
		}
		if (token && !chitthiJwt) {
			return NextResponse.redirect(syncUrl(pathname + request.nextUrl.search))
		}
		return NextResponse.next()
	}

	if (isLogin) {
		const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/dashboard"
		if (token && chitthiJwt) {
			return NextResponse.redirect(new URL(redirectTarget, request.url))
		}
		if (token && !chitthiJwt) {
			return NextResponse.redirect(syncUrl(redirectTarget))
		}
		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/dashboard/:path*", "/login"]
}
