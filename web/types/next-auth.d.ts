import type { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
	interface JWT {
		chitthiUserId?: number
	}
}

declare module "next-auth" {
	interface Session {
		user?: DefaultSession["user"] & {
			id?: string
			chitthiUserId?: number
		}
	}
}
