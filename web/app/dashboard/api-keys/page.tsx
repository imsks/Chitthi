"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, Copy, KeyRound, RefreshCcw, Terminal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createAPIKey, deleteAPIKey, getAPIKeys, getMe, getProviderAPIKeys } from "@/lib/api"
import { buildSendEmailCurl, type SendEmailCurlBody } from "@/lib/build-send-email-curl"
import { maskApiKey } from "@/lib/dashboard"
import { toast } from "@/hooks/use-toast"

const PLACEHOLDER_CHITTHI_KEY = "YOUR_CHITTHI_API_KEY"

export default function ApiKeysPage() {
	const [apiKeys, setApiKeys] = useState<string[]>([])
	const [defaultSenderEmail, setDefaultSenderEmail] = useState("")
	const [testToEmail, setTestToEmail] = useState("")
	const [newKey, setNewKey] = useState("")
	const [loading, setLoading] = useState(true)
	const [keySaving, setKeySaving] = useState(false)
	const [revokingKey, setRevokingKey] = useState<string | null>(null)
	const [error, setError] = useState("")

	const loadKeys = async () => {
		setLoading(true)
		setError("")
		try {
			const [keyResponse, providerResponse, meResponse] = await Promise.all([getAPIKeys(), getProviderAPIKeys(), getMe()])
			const list = keyResponse.api_keys
			setApiKeys(Array.isArray(list) ? list : [])
			const sender = providerResponse.default_sender_email
			setDefaultSenderEmail(typeof sender === "string" ? sender.trim() : "")
			const accountEmail = typeof meResponse.user?.email === "string" ? meResponse.user.email.trim() : ""
			setTestToEmail((prev) => (prev.trim() !== "" ? prev : accountEmail))
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

	const inferredBearer =
		newKey.trim() ||
		(listedKeys.length === 1 ? listedKeys[0] : "")

	const sampleCurl = useMemo(() => {
		const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
		const apiBase = rawBase.replace(/\/$/, "")
		const bearer = inferredBearer || PLACEHOLDER_CHITTHI_KEY
		const to = testToEmail.trim() || "recipient@example.com" // fallback if account has no email and field cleared
		const body: SendEmailCurlBody = {
			to_email: to,
			subject: "Chitthi API test",
			html_content: "<p>Hello from cURL.</p>",
			from_name: "Chitthi"
		}
		const from = defaultSenderEmail.trim()
		if (from) {
			body.from_email = from
		}
		return buildSendEmailCurl({ apiBaseUrl: apiBase, bearerToken: bearer, body })
	}, [inferredBearer, testToEmail, defaultSenderEmail])

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
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>POST /send-email</code>. The Chitthi backend URL is typically{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>NEXT_PUBLIC_API_URL</code> (e.g.{" "}
						<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>http://localhost:8080</code>). Defaults for provider credentials and verified sender email come from{" "}
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
						) : listedKeys.length ? (
							listedKeys.map((key) => (
								<div key={key} className='flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
									<code className='min-w-0 flex-1 truncate text-sm text-gray-700'>{maskApiKey(key)}</code>
									<div className='flex shrink-0 gap-2'>
										<Button variant='outline' size='sm' className='border-blue-200 hover:bg-blue-50' onClick={() => void copyValue(key, "API key")}>
											<Copy className='mr-2 h-4 w-4' />
											Copy
										</Button>
										<Button
											variant='outline'
											size='sm'
											className='border-red-200 text-red-700 hover:bg-red-50'
											disabled={revokingKey === key}
											onClick={() => void handleRevokeKey(key)}
										>
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

			<Card className='border-blue-100 bg-white/95'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Terminal className='h-5 w-5 text-blue-600' />
						Test with cURL
					</CardTitle>
					<CardDescription>
						Copy the command and run it in a terminal. Requests go to your Chitthi API base URL (not the Next.js dashboard port). Auth uses a Bearer token; you can swap in{" "}
						<code className='rounded bg-slate-100 px-1 py-0.5 text-xs'>X-Chitthi-API-Key</code> or <code className='rounded bg-slate-100 px-1 py-0.5 text-xs'>api_key</code> in the
						body if you prefer.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{defaultSenderEmail ? (
						<p className='text-sm text-gray-600'>
							<code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>from_email</code> is set to your verified sender from Settings:{" "}
							<span className='font-medium text-gray-800'>{defaultSenderEmail}</span>
						</p>
					) : (
						<p className='text-sm text-gray-600'>
							No verified sender on file. You can still send—Chitthi will use the sender from Settings when resolving your key—or add one in{" "}
							<Link href='/dashboard/settings' className='font-medium text-blue-700 underline'>
								Settings
							</Link>
							.
						</p>
					)}
					{listedKeys.length > 1 && !newKey ? (
						<p className='text-sm text-amber-800'>
							Several keys are listed. The sample uses <code className='rounded bg-amber-100 px-1 py-0.5 text-xs'>{PLACEHOLDER_CHITTHI_KEY}</code>—replace it with a key you
							copy above, or revoke extras so only one remains to auto-fill.
						</p>
					) : null}
					<div className='space-y-2'>
						<Label htmlFor='api-keys-test-to'>Recipient (to_email)</Label>
						<p className='text-xs text-muted-foreground'>Prefilled with your Chitthi account email; change it to send a test anywhere else.</p>
						<Input
							id='api-keys-test-to'
							type='email'
							autoComplete='off'
							placeholder='recipient@example.com'
							value={testToEmail}
							onChange={(e) => setTestToEmail(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='api-keys-curl-sample'>Sample command</Label>
						<Textarea id='api-keys-curl-sample' readOnly className='min-h-[11rem] font-mono text-xs' value={sampleCurl} />
					</div>
					<Button variant='outline' className='w-full border-blue-200 hover:bg-blue-50 sm:w-auto' type='button' onClick={() => void copyValue(sampleCurl, "cURL")}>
						<Copy className='mr-2 h-4 w-4' />
						Copy cURL
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
