"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { login, signup } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

type SignupForm = {
	name: string
	email: string
	password: string
	profession: string
}

export default function SignupPage() {
	const router = useRouter()
	const { user, setUser, loading } = useAuth()
	const [error, setError] = useState("")
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<SignupForm>()

	useEffect(() => {
		if (!loading && user) {
			router.replace("/dashboard")
		}
	}, [loading, router, user])

	const onSubmit = async (values: SignupForm) => {
		setError("")
		try {
			await signup(values.name, values.email, values.password, values.profession)
			const loginResponse = await login(values.email, values.password)
			setUser(loginResponse.user)
			router.push("/dashboard")
			router.refresh()
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to create account")
		}
	}

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Card className='border-blue-100 bg-white/95 shadow-sm'>
				<CardHeader className='space-y-3'>
					<div className='inline-flex w-fit items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800'>
						Create your account
					</div>
					<CardTitle className='text-3xl text-gray-900'>Start with Chitthi</CardTitle>
					<CardDescription className='text-base text-gray-600'>
						Create an account, connect your provider, and start issuing Chitthi API keys.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
						{error ? (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Signup failed</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}
						<div className='space-y-2'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' placeholder='Jane Doe' {...register("name", { required: "Name is required" })} />
							{errors.name ? <p className='text-sm text-red-600'>{errors.name.message}</p> : null}
						</div>
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
								placeholder='Create a password'
								{...register("password", { required: "Password is required", minLength: { value: 6, message: "Use at least 6 characters" } })}
							/>
							{errors.password ? <p className='text-sm text-red-600'>{errors.password.message}</p> : null}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='profession'>Profession</Label>
							<Input id='profession' placeholder='Developer, founder, ops engineer...' {...register("profession")} />
						</div>
						<Button type='submit' disabled={isSubmitting} className='w-full bg-blue-600 hover:bg-blue-700'>
							{isSubmitting ? "Creating account..." : "Sign Up"}
							<ArrowRight className='ml-2 h-4 w-4' />
						</Button>
					</form>
					<p className='mt-6 text-center text-sm text-gray-600'>
						Already have an account?{" "}
						<Link href='/login' className='font-medium text-blue-600 hover:text-blue-700'>
							Login
						</Link>
					</p>
				</CardContent>
			</Card>
		</motion.div>
	)
}