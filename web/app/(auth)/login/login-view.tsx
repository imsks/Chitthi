"use client"

import { useEffect, useMemo, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function LoginView() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { status } = useSession()
	const { user, loading: chitthiLoading, refreshUser } = useAuth()
	const [error, setError] = useState("")

	const paramError = searchParams.get("error")
	const bannerError = useMemo(() => {
		if (!paramError) {
			return ""
		}
		const map: Record<string, string> = {
			session: "Could not complete sign-in. Try again.",
			backend: "Could not connect your account to the API. Check the server.",
			config: "Server is missing NEXTAUTH_SECRET or auth configuration."
		}
		return map[paramError] || "Sign-in failed."
	}, [paramError])

	useEffect(() => {
		if (status === "authenticated") {
			void refreshUser()
		}
	}, [status, refreshUser])

	useEffect(() => {
		if (status !== "authenticated" || chitthiLoading) {
			return
		}
		if (user) {
			const dest = searchParams.get("redirect") || "/dashboard"
			router.replace(dest)
		}
	}, [status, chitthiLoading, user, router, searchParams])

	if (status === "loading") {
		return (
			<div className='flex min-h-[200px] flex-col items-center justify-center gap-3 text-gray-600'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-600' />
				<p className='text-sm'>Loading…</p>
			</div>
		)
	}

	if (status === "authenticated" && (chitthiLoading || user)) {
		return (
			<div className='flex min-h-[200px] flex-col items-center justify-center gap-3 text-gray-600'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-600' />
				<p className='text-sm'>{user ? "Redirecting…" : "Finishing sign-in…"}</p>
			</div>
		)
	}

	if (status === "authenticated" && !chitthiLoading && !user) {
		return (
			<Alert className='border-amber-200 bg-amber-50'>
				<AlertCircle className='h-4 w-4 text-amber-800' />
				<AlertTitle className='text-amber-900'>Could not load profile</AlertTitle>
				<AlertDescription className='flex flex-col gap-3 text-amber-900'>
					<p>The Chitthi API did not return your account. Check that the backend is running.</p>
					<Button type='button' variant='outline' className='w-fit' onClick={() => void refreshUser()}>
						Retry
					</Button>
				</AlertDescription>
			</Alert>
		)
	}

	const callbackUrl = searchParams.get("redirect") || "/dashboard"

	return (
		<>
			{bannerError ? (
				<Alert variant='destructive' className='mb-4'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Sign-in</AlertTitle>
					<AlertDescription>{bannerError}</AlertDescription>
				</Alert>
			) : null}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<Card className='border-blue-100 bg-white/95 shadow-sm'>
					<CardHeader className='space-y-3'>
						<div className='inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
							Access your workspace
						</div>
						<CardTitle className='text-3xl text-gray-900'>Sign in to Chitthi</CardTitle>
						<CardDescription className='text-base text-gray-600'>
							Continue with Google. Email and password sign-in is not available.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						{error ? (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Sign-in failed</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}
						<Button
							type='button'
							className='w-full bg-blue-600 hover:bg-blue-700'
							onClick={() =>
								void signIn("google", {
									callbackUrl,
									redirect: true
								}).catch(() => setError("Could not start Google sign-in."))
							}>
							Continue with Google
						</Button>
					</CardContent>
				</Card>
			</motion.div>
		</>
	)
}
