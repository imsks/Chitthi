"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider refetchOnWindowFocus={false}>
			<AuthProvider>{children}</AuthProvider>
		</SessionProvider>
	)
}
