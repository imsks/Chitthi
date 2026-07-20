import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

async function upsertChitthiUser(idToken: string): Promise<number> {
	const base =
		process.env.INTERNAL_API_URL ||
		process.env.NEXT_PUBLIC_API_URL ||
		"http://localhost:8080"
	const res = await fetch(`${base.replace(/\/$/, "")}/api/v1/auth/upsert`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ credential: idToken })
	})
	if (!res.ok) {
		const text = await res.text().catch(() => "")
		throw new Error(`Chitthi user sync failed (${res.status}) ${text}`)
	}
	const data = (await res.json()) as { user: { id: number } }
	return data.user.id
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
		})
	],
	pages: {
		signIn: "/login"
	},
	callbacks: {
		async signIn({ profile }) {
			const p = profile as { email?: string; email_verified?: boolean } | null | undefined
			if (!p?.email) {
				return false
			}
			if (p.email_verified === false) {
				return false
			}
			return true
		},
		async jwt({ token, account }) {
			if (account?.provider === "google" && account.id_token) {
				const id = await upsertChitthiUser(account.id_token)
				token.chitthiUserId = id
			}
			return token
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub
			}
			if (session.user && token.chitthiUserId != null) {
				session.user.chitthiUserId = token.chitthiUserId as number
			}
			return session
		}
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60
	},
	secret: process.env.NEXTAUTH_SECRET
}
