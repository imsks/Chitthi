"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Copy, KeyRound, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createAPIKey, getAPIKeys } from "@/lib/api"
import { maskApiKey } from "@/lib/dashboard"
import { toast } from "@/hooks/use-toast"

export default function ApiKeysPage() {
	const [apiKeys, setApiKeys] = useState<string[]>([])
	const [newKey, setNewKey] = useState("")
	const [loading, setLoading] = useState(true)
	const [keySaving, setKeySaving] = useState(false)
	const [error, setError] = useState("")

	const loadKeys = async () => {
		setLoading(true)
		setError("")
		try {
			const keyResponse = await getAPIKeys()
			setApiKeys(keyResponse.api_keys)
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load API keys")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadKeys()
	}, [])

	const handleCreateKey = async () => {
		setKeySaving(true)
		setError("")
		try {
			const response = await createAPIKey()
			setNewKey(response.api_key)
			await loadKeys()
			toast({ title: "API key generated", description: "Copy the key now. Default expiry is one year." })
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
					<h1 className='text-3xl font-bold text-gray-900'>Chitthi API keys</h1>
					<p className='mt-2 text-gray-600'>
						Unified keys for calling Chitthi. Use{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>Authorization: Bearer {'<key>'}</code> or{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>X-Chitthi-API-Key</code> on{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>POST /send-email</code> alongside your payload. Defaults for provider credentials and sender
						email come from{" "}
						<Link href='/dashboard/settings' className='font-medium text-blue-700 underline'>
							Settings
						</Link>
						.
					</p>
				</div>
				<Button variant='outline' className='border-blue-200 hover:bg-blue-50' onClick={() => void loadKeys()}>
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
					<CardTitle>Your keys</CardTitle>
					<CardDescription>Each active key expires one year after creation unless you supplied a custom expiry via the API. Only the full value is visible at creation time.</CardDescription>
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
					<Button disabled={keySaving} onClick={() => void handleCreateKey()} className='w-full bg-blue-600 hover:bg-blue-700'>
						<KeyRound className='mr-2 h-4 w-4' />
						{keySaving ? "Generating..." : "Generate new API key"}
					</Button>
					{newKey ? (
						<Card className='border-green-200 bg-green-50'>
							<CardContent className='space-y-3 p-4'>
								<p className='font-medium text-green-800'>New key (copy now)</p>
								<Input readOnly value={newKey} className='font-mono text-xs' />
								<Button variant='outline' className='w-full border-green-200 hover:bg-white' onClick={() => void copyValue(newKey, "New API key")}>
									<Copy className='mr-2 h-4 w-4' />
									Copy new key
								</Button>
							</CardContent>
						</Card>
					) : null}
				</CardContent>
			</Card>
		</div>
	)
}
