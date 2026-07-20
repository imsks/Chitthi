"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Copy, KeyRound, RefreshCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createAPIKey, deleteAPIKey, getAPIKeys } from "@/lib/api"
import { maskApiKey } from "@/lib/dashboard"
import { toast } from "@/hooks/use-toast"

export default function ApiKeysPage() {
	const [apiKeys, setApiKeys] = useState<string[]>([])
	const [newKey, setNewKey] = useState("")
	const [loading, setLoading] = useState(true)
	const [keySaving, setKeySaving] = useState(false)
	const [revokingKey, setRevokingKey] = useState<string | null>(null)
	const [error, setError] = useState("")

	const loadKeys = async () => {
		setLoading(true)
		setError("")
		try {
			const keyResponse = await getAPIKeys()
			const list = keyResponse.api_keys
			setApiKeys(Array.isArray(list) ? list : [])
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

	const handleRevokeKey = async (key: string) => {
		const ok =
			typeof window !== "undefined"
				? window.confirm("Revoke this Chitthi API key? Apps using it will stop working immediately.")
				: false
		if (!ok) {
			return
		}

		setRevokingKey(key)
		setError("")
		try {
			await deleteAPIKey(key)
			if (newKey === key) {
				setNewKey("")
			}
			await loadKeys()
			toast({ title: "Key revoked", description: "The API key has been removed." })
		} catch (revokeErr) {
			setError(revokeErr instanceof Error ? revokeErr.message : "Unable to revoke API key")
		} finally {
			setRevokingKey(null)
		}
	}

	const listedKeys = Array.isArray(apiKeys) ? apiKeys : []

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Chitthi API keys</h1>
					<p className='mt-2 text-gray-600'>
						Unified keys for calling Chitthi. Send{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>Authorization: Bearer {'<key>'}</code>,{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>X-Chitthi-API-Key</code>, or{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>api_key</code> in the JSON body on{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>POST /send-email</code>. The API base URL is typically{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>NEXT_PUBLIC_API_URL</code> (e.g.{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>http://localhost:8080</code>). Configure provider credentials in{" "}
						<Link href='/dashboard/providers' className='font-medium text-blue-700 underline'>
							Providers
						</Link>
						. Run a provider test send from there.
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
				<CardHeader className='flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between'>
					<div className='space-y-1.5'>
						<CardTitle>Your keys</CardTitle>
						<CardDescription>Each active key expires one year after creation unless you supplied a custom expiry via the API. Only the full value is visible at creation time.</CardDescription>
					</div>
					<Button disabled={keySaving} onClick={() => void handleCreateKey()} className='w-full shrink-0 bg-blue-600 hover:bg-blue-700 sm:w-auto'>
						<KeyRound className='mr-2 h-4 w-4' />
						{keySaving ? "Generating..." : "Generate new API key"}
					</Button>
				</CardHeader>
				<CardContent className='space-y-5'>
					<div className='space-y-3'>
						{loading ? (
							<p className='text-sm text-gray-600'>Loading API keys...</p>
						) : listedKeys.length ? (
							listedKeys.map((key) => (
								<div key={key} className='flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
									<code className='min-w-0 flex-1 truncate text-sm text-gray-700'>{maskApiKey(key)}</code>
									<div className='flex shrink-0 gap-2'>
										<Button variant='outline' size='sm' className='border-blue-200 hover:bg-blue-50' onClick={() => void copyValue(key, "API key")}>
											<Copy className='mr-2 h-4 w-4' />
											Copy
										</Button>
										<Button variant='outline' size='sm' className='border-red-200 text-red-700 hover:bg-red-50' disabled={revokingKey === key} onClick={() => void handleRevokeKey(key)}>
											<Trash2 className='mr-2 h-4 w-4' />
											Revoke
										</Button>
									</div>
								</div>
							))
						) : (
							<p className='text-sm text-gray-600'>No Chitthi API keys created yet.</p>
						)}
					</div>
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
