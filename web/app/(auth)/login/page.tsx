"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { login } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

type LoginForm = {
	email: string
	password: string
}

export default function LoginPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { user, setUser, loading } = useAuth()
	const [error, setError] = useState("")
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<LoginForm>()

	useEffect(() => {
		if (!loading && user) {
			router.replace(searchParams.get("redirect") || "/dashboard")
		}
	}, [loading, router, searchParams, user])

	const onSubmit = async (values: LoginForm) => {
		setError("")
		try {
			const response = await login(values.email, values.password)
			setUser(response.user)
			router.push(searchParams.get("redirect") || "/dashboard")
			router.refresh()
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to login")
		}
	}

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Card className='border-blue-100 bg-white/95 shadow-sm'>
				<CardHeader className='space-y-3'>
					<div className='inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
						Access your workspace
					</div>
					<CardTitle className='text-3xl text-gray-900'>Login to Chitthi</CardTitle>
					<CardDescription className='text-base text-gray-600'>
						Sign in to manage provider credentials, unified API keys, and onboarding.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
						{error ? (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Login failed</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='you@company.com'
								{...register("email", { required: "Email is required" })}
							/>
							{errors.email ? <p className='text-sm text-red-600'>{errors.email.message}</p> : null}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='Enter your password'
								{...register("password", { required: "Password is required" })}
							/>
							{errors.password ? <p className='text-sm text-red-600'>{errors.password.message}</p> : null}
						</div>
						<Button type='submit' disabled={isSubmitting} className='w-full bg-blue-600 hover:bg-blue-700'>
							{isSubmitting ? "Logging in..." : "Login"}
							<ArrowRight className='ml-2 h-4 w-4' />
						</Button>
					</form>
					<p className='mt-6 text-center text-sm text-gray-600'>
						New to Chitthi?{" "}
						<Link href='/signup' className='font-medium text-blue-600 hover:text-blue-700'>
							Create an account
						</Link>
					</p>
				</CardContent>
			</Card>
		</motion.div>
	)
}