import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
	const jwt = request.cookies.get("jwt")?.value

	if (!jwt) {
		const loginUrl = new URL("/login", request.url)
		loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/dashboard/:path*"]
}