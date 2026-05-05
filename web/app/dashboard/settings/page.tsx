"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, KeyRound, RefreshCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { addProviderAPIKey, getProviderAPIKeys } from "@/lib/api"
import { providerOptions } from "@/lib/dashboard"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
	const [providers, setProviders] = useState<string[]>([])
	const [provider, setProvider] = useState(providerOptions[0].value)
	const [providerKey, setProviderKey] = useState("")
	const [senderEmail, setSenderEmail] = useState("")
	const [loading, setLoading] = useState(true)
	const [providerSaving, setProviderSaving] = useState(false)
	const [error, setError] = useState("")

	const loadData = async () => {
		setLoading(true)
		setError("")
		try {
			const providerResponse = await getProviderAPIKeys()
			setProviders(providerResponse.providers)
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load settings")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadData()
	}, [])

	const handleProviderSave = async () => {
		if (!providerKey.trim()) {
			setError("Enter a provider API key before saving.")
			return
		}
		const email = senderEmail.trim()
		if (!email || !email.includes("@")) {
			setError("Enter the verified sender email your provider expects.")
			return
		}

		setProviderSaving(true)
		setError("")
		try {
			await addProviderAPIKey(provider, providerKey.trim(), email)
			setProviderKey("")
			await loadData()
			toast({ title: "Provider key saved", description: "Adding the same provider again replaces the previous key and sender email." })
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to save provider key")
		} finally {
			setProviderSaving(false)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
					<p className='mt-2 text-gray-600'>Manage provider credentials and verified sender email for your account.</p>
				</div>
				<Button variant='outline' className='border-blue-200 hover:bg-blue-50' onClick={() => void loadData()}>
					<RefreshCcw className='mr-2 h-4 w-4' />
					Refresh
				</Button>
			</div>

			{error ? (
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Something went wrong</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}

			<Card className='border-blue-100 bg-white/95'>
				<CardHeader>
					<CardTitle>Chitthi API keys</CardTitle>
					<CardDescription>Issue, list, and copy unified keys for your applications.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild variant='outline' className='w-full border-blue-200 hover:bg-blue-50 sm:w-auto'>
						<Link href='/dashboard/api-keys'>
							<KeyRound className='mr-2 h-4 w-4' />
							Open API Keys
						</Link>
					</Button>
				</CardContent>
			</Card>

			<Card className='border-blue-100 bg-white/95'>
				<CardHeader>
					<CardTitle>Provider API keys</CardTitle>
					<CardDescription>Add or replace provider credentials and the verified sender email used for unified sends.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-5'>
					<div className='flex flex-wrap gap-2'>
						{loading ? (
							<Badge className='bg-slate-100 text-slate-700 hover:bg-slate-100'>Loading providers...</Badge>
						) : providers.length ? (
							providers.map((value) => (
								<Badge key={value} className='bg-green-100 text-green-800 hover:bg-green-100'>
									{value}
								</Badge>
							))
						) : (
							<Badge className='bg-slate-100 text-slate-700 hover:bg-slate-100'>No provider keys saved yet</Badge>
						)}
					</div>
					<div className='space-y-2'>
						<Label>Provider</Label>
						<Select value={provider} onValueChange={setProvider}>
							<SelectTrigger>
								<SelectValue placeholder='Choose a provider' />
							</SelectTrigger>
							<SelectContent>
								{providerOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='settings-provider-key'>Provider API key</Label>
						<Input
							id='settings-provider-key'
							type='password'
							placeholder='Paste new or replacement provider key'
							value={providerKey}
							onChange={(event) => setProviderKey(event.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='settings-sender-email'>Verified sender email</Label>
						<Input
							id='settings-sender-email'
							type='email'
							autoComplete='email'
							placeholder='e.g. newsletters@yourdomain.com'
							value={senderEmail}
							onChange={(event) => setSenderEmail(event.target.value)}
						/>
						<p className='text-xs text-muted-foreground'>Stored for default From when sending with your Chitthi API key.</p>
					</div>
					<Button disabled={providerSaving} onClick={() => void handleProviderSave()} className='w-full bg-blue-600 hover:bg-blue-700'>
						{providerSaving ? "Saving..." : "Add or replace provider key"}
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
