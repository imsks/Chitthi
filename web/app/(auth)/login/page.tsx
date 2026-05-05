"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GoogleLogin } from "@react-oauth/google"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { googleSignIn } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { user, setUser, loading } = useAuth()
	const [error, setError] = useState("")

	useEffect(() => {
		if (!loading && user) {
			router.replace(searchParams.get("redirect") || "/dashboard")
		}
	}, [loading, router, searchParams, user])

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Card className='border-blue-100 bg-white/95 shadow-sm'>
				<CardHeader className='space-y-3'>
					<div className='inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
						Access your workspace
					</div>
					<CardTitle className='text-3xl text-gray-900'>Sign in to Chitthi</CardTitle>
					<CardDescription className='text-base text-gray-600'>
						Use your Google account. Email and password sign-in is not available.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Configuration</AlertTitle>
							<AlertDescription>
								Set NEXT_PUBLIC_GOOGLE_CLIENT_ID (and GOOGLE_CLIENT_ID for the API) in your environment.
							</AlertDescription>
						</Alert>
					) : null}
					{error ? (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Sign-in failed</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					) : null}
					<div className='flex flex-col items-center justify-center py-2'>
						<GoogleLogin
							onSuccess={async cred => {
								if (!cred.credential) {
									setError("No credential from Google")
									return
								}
								setError("")
								try {
									const res = await googleSignIn(cred.credential)
									setUser(res.user)
									router.push(searchParams.get("redirect") || "/dashboard")
									router.refresh()
								} catch (e) {
									setError(e instanceof Error ? e.message : "Unable to sign in")
								}
							}}
							onError={() => setError("Google sign-in was cancelled or failed")}
							useOneTap={false}
							theme='outline'
							size='large'
							text='continue_with'
							shape='rectangular'
							width='320'
						/>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
