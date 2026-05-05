"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/contexts/auth-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
	return (
		<GoogleOAuthProvider clientId={clientId}>
			<AuthProvider>{children}</AuthProvider>
		</GoogleOAuthProvider>
	)
}
