"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Copy, KeyRound, RefreshCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { addProviderAPIKey, createAPIKey, getAPIKeys, getProviderAPIKeys } from "@/lib/api"
import { getDefaultExpiryDate, maskApiKey, providerOptions } from "@/lib/dashboard"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
	const [providers, setProviders] = useState<string[]>([])
	const [apiKeys, setApiKeys] = useState<string[]>([])
	const [provider, setProvider] = useState(providerOptions[0].value)
	const [providerKey, setProviderKey] = useState("")
	const [expiry, setExpiry] = useState(getDefaultExpiryDate())
	const [newKey, setNewKey] = useState("")
	const [loading, setLoading] = useState(true)
	const [providerSaving, setProviderSaving] = useState(false)
	const [keySaving, setKeySaving] = useState(false)
	const [error, setError] = useState("")

	const loadData = async () => {
		setLoading(true)
		setError("")
		try {
			const [providerResponse, keyResponse] = await Promise.all([getProviderAPIKeys(), getAPIKeys()])
			setProviders(providerResponse.providers)
			setApiKeys(keyResponse.api_keys)
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

		setProviderSaving(true)
		setError("")
		try {
			await addProviderAPIKey(provider, providerKey.trim())
			setProviderKey("")
			await loadData()
			toast({ title: "Provider key saved", description: "Adding the same provider again replaces the previous key." })
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to save provider key")
		} finally {
			setProviderSaving(false)
		}
	}

	const handleCreateKey = async () => {
		setKeySaving(true)
		setError("")
		try {
			const response = await createAPIKey(expiry)
			setNewKey(response.api_key)
			await loadData()
			toast({ title: "API key generated", description: "Copy the key now and store it securely." })
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to create API key")
		} finally {
			setKeySaving(false)
		}
	}

	const copyValue = async (value: string, label: string) => {
		await navigator.clipboard.writeText(value)
		toast({ title: `${label} copied`, description: "The value has been copied to your clipboard." })
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
					<p className='mt-2 text-gray-600'>Manage provider credentials and the Chitthi API keys issued for your account.</p>
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

			<div className='grid gap-6 xl:grid-cols-2'>
				<Card className='border-blue-100 bg-white/95'>
					<CardHeader>
						<CardTitle>Provider API Keys</CardTitle>
						<CardDescription>Add or replace provider credentials connected to your Chitthi account.</CardDescription>
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
						<Button disabled={providerSaving} onClick={() => void handleProviderSave()} className='w-full bg-blue-600 hover:bg-blue-700'>
							{providerSaving ? "Saving..." : "Add or replace provider key"}
						</Button>
					</CardContent>
				</Card>

				<Card className='border-blue-100 bg-white/95'>
					<CardHeader>
						<CardTitle>Chitthi API Keys</CardTitle>
						<CardDescription>Generate unified API keys for applications that call into Chitthi.</CardDescription>
					</CardHeader>
					<CardContent className='space-y-5'>
						<div className='space-y-3'>
							{loading ? (
								<p className='text-sm text-gray-600'>Loading API keys...</p>
							) : apiKeys.length ? (
								apiKeys.map((key) => (
									<div key={key} className='flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
										<code className='text-sm text-gray-700'>{maskApiKey(key)}</code>
										<Button variant='outline' size='sm' className='border-blue-200 hover:bg-blue-50' onClick={() => void copyValue(key, "API key")}>
											<Copy className='mr-2 h-4 w-4' />
											Copy
										</Button>
									</div>
								))
							) : (
								<p className='text-sm text-gray-600'>No Chitthi API keys created yet.</p>
							)}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='settings-expiry'>Expiry date</Label>
							<Input id='settings-expiry' type='date' value={expiry} onChange={(event) => setExpiry(event.target.value)} />
						</div>
						<Button disabled={keySaving} onClick={() => void handleCreateKey()} className='w-full bg-blue-600 hover:bg-blue-700'>
							<KeyRound className='mr-2 h-4 w-4' />
							{keySaving ? "Generating..." : "Generate new API key"}
						</Button>
						{newKey ? (
							<Card className='border-green-200 bg-green-50'>
								<CardContent className='space-y-3 p-4'>
									<p className='font-medium text-green-800'>Newest generated key</p>
									<Input readOnly value={newKey} className='font-mono text-xs' />
									<Button variant='outline' className='w-full border-green-200 hover:bg-white' onClick={() => void copyValue(newKey, "Newest API key")}>
										<Copy className='mr-2 h-4 w-4' />
										Copy newest key
									</Button>
								</CardContent>
							</Card>
						) : null}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}