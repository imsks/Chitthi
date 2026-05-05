"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { getMe, logout as logoutRequest, type User } from "@/lib/api"

type AuthContextValue = {
	user: User | null
	loading: boolean
	setUser: (user: User | null) => void
	refreshUser: () => Promise<User | null>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	const refreshUser = async () => {
		try {
			const response = await getMe()
			setUser(response.user)
			return response.user
		} catch {
			setUser(null)
			return null
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void refreshUser()
	}, [])

	const logout = async () => {
		try {
			await logoutRequest()
		} catch {
			/* still sign out of NextAuth */
		}
		setUser(null)
		await signOut({ callbackUrl: "/login" })
	}

	return (
		<AuthContext.Provider value={{ user, loading, setUser, refreshUser, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider")
	}

	return context
}