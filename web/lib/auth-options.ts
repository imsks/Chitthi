import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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
			if (account?.id_token) {
				token.googleIdToken = account.id_token
			}
			return token
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub
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
