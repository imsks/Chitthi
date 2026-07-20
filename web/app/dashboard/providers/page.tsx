"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, KeyRound, Pencil, RefreshCcw, Send, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { addProviderAPIKey, deleteProviderAPIKey, getAPIKeys, getMe, getProviderAPIKeys } from "@/lib/api"
import { providerOptions } from "@/lib/dashboard"
import { normalizeProviderCredentialRows, providersNotYetConfigured, type ProviderCredentialSummary } from "@/lib/provider-summaries"
import { sendTestEmailViaChitthi } from "@/lib/send-test-email"
import { toast } from "@/hooks/use-toast"

function labelForProvider(id: string) {
	return providerOptions.find((o) => o.value === id)?.label ?? id
}

type TestPhase = "idle" | "sending" | "sent" | "failed"

export default function ProvidersPage() {
	const [rows, setRows] = useState<ProviderCredentialSummary[]>([])
	const [chitthiKeys, setChitthiKeys] = useState<string[]>([])
	const [accountEmail, setAccountEmail] = useState("")
	const [testByProvider, setTestByProvider] = useState<Record<string, { phase: TestPhase; detail?: string }>>({})
	const [addProvider, setAddProvider] = useState(providerOptions[0].value)
	const [addKey, setAddKey] = useState("")
	const [addSenderEmail, setAddSenderEmail] = useState("")
	const [loading, setLoading] = useState(true)
	const [addSaving, setAddSaving] = useState(false)
	const [removingProvider, setRemovingProvider] = useState<string | null>(null)
	const [error, setError] = useState("")

	const [editOpen, setEditOpen] = useState(false)
	const [editing, setEditing] = useState<ProviderCredentialSummary | null>(null)
	const [editEmail, setEditEmail] = useState("")
	const [editKey, setEditKey] = useState("")
	const [editSaving, setEditSaving] = useState(false)

	const configuredIds = useMemo(() => new Set(rows.map((r) => r.provider)), [rows])
	const availableToAdd = useMemo(() => providersNotYetConfigured(providerOptions, configuredIds), [configuredIds])

	const loadData = useCallback(async () => {
		setLoading(true)
		setError("")
		try {
			const [res, keysRes, meRes] = await Promise.all([getProviderAPIKeys(), getAPIKeys(), getMe()])
			setRows(normalizeProviderCredentialRows(res))
			const list = keysRes.api_keys
			setChitthiKeys(Array.isArray(list) ? list : [])
			const acc = typeof meRes.user?.email === "string" ? meRes.user.email.trim() : ""
			setAccountEmail(acc)
			setTestByProvider({})
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load providers")
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		void loadData()
	}, [loadData])

	useEffect(() => {
		setAddProvider((prev) => (availableToAdd.some((o) => o.value === prev) ? prev : availableToAdd[0]?.value ?? providerOptions[0].value))
	}, [availableToAdd])

	const openEdit = (row: ProviderCredentialSummary) => {
		setEditing(row)
		setEditEmail(row.sender_email)
		setEditKey("")
		setEditOpen(true)
	}

	const handleAdd = async () => {
		if (!addKey.trim()) {
			setError("Enter the provider API key before saving.")
			return
		}
		const email = addSenderEmail.trim()
		if (!email || !email.includes("@")) {
			setError("Enter the verified sender email your provider expects.")
			return
		}
		setAddSaving(true)
		setError("")
		try {
			await addProviderAPIKey(addProvider, addKey.trim(), email)
			setAddKey("")
			setAddSenderEmail("")
			await loadData()
			toast({ title: "Provider saved", description: "You can update credentials or sender email anytime from this table." })
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to save provider key")
		} finally {
			setAddSaving(false)
		}
	}

	const handleEditSave = async () => {
		if (!editing) {
			return
		}
		const email = editEmail.trim()
		if (!email || !email.includes("@")) {
			setError("Enter the verified sender email your provider expects.")
			return
		}
		setEditSaving(true)
		setError("")
		try {
			await addProviderAPIKey(editing.provider, editKey, email)
			setEditOpen(false)
			setEditing(null)
			await loadData()
			toast({
				title: "Provider updated",
				description: editKey.trim() ? "Key and sender email were saved." : "Sender email was saved; the existing API key was kept."
			})
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to update provider")
		} finally {
			setEditSaving(false)
		}
	}

	const chitthiKeyForTest = chitthiKeys[0] ?? ""
	const canRunTest = Boolean(chitthiKeyForTest && accountEmail.includes("@"))

	const handleSendTest = async (row: ProviderCredentialSummary) => {
		const sender = row.sender_email.trim()
		if (!chitthiKeyForTest) {
			setError("Create a Chitthi API key first to run a test send.")
			return
		}
		if (!accountEmail.includes("@")) {
			setError("Your account has no sign-in email available for the test recipient.")
			return
		}
		if (!sender) {
			setError(`Add a verified sender email for ${labelForProvider(row.provider)} before testing.`)
			return
		}

		setTestByProvider((prev) => ({
			...prev,
			[row.provider]: { phase: "sending" }
		}))
		setError("")
		const result = await sendTestEmailViaChitthi({
			chitthiApiKey: chitthiKeyForTest,
			toEmail: accountEmail,
			provider: row.provider,
			fromEmail: sender
		})
		if (result.ok) {
			setTestByProvider((prev) => ({
				...prev,
				[row.provider]: { phase: "sent" }
			}))
			toast({ title: "Test email sent", description: `Check ${accountEmail} for the message from ${labelForProvider(row.provider)}.` })
			return
		}
		setTestByProvider((prev) => ({
			...prev,
			[row.provider]: { phase: "failed", detail: result.message }
		}))
		toast({ title: "Test send failed", description: result.message, variant: "destructive" })
	}

	const handleRemoveProvider = async (name: string) => {
		const ok =
			typeof window !== "undefined"
				? window.confirm(`Remove saved credentials for ${labelForProvider(name)}? Sends that use defaults will stop until you add a key again.`)
				: false
		if (!ok) {
			return
		}

		setRemovingProvider(name)
		setError("")
		try {
			await deleteProviderAPIKey(name)
			await loadData()
			toast({ title: "Provider removed", description: `${labelForProvider(name)} credentials were deleted.` })
		} catch (removeErr) {
			setError(removeErr instanceof Error ? removeErr.message : "Unable to remove provider")
		} finally {
			setRemovingProvider(null)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Providers</h1>
					<p className='mt-2 text-gray-600'>
						Manage email provider credentials and verified sender addresses used when sending with your Chitthi API key.
					</p>
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
					<CardTitle>Provider credentials</CardTitle>
					<CardDescription>
						Configured providers appear below. Rotate keys or change the verified sender anytime. Use <strong>Send test</strong> to deliver a sample message to your
						sign-in email ({accountEmail || "—"}) using your first active Chitthi API key.{" "}
						{chitthiKeys.length === 0 ? (
							<Link href='/dashboard/api-keys' className='font-medium text-blue-700 underline'>
								Create an API key
							</Link>
						) : chitthiKeys.length > 1 ? (
							<span> If you have multiple Chitthi keys, tests use the first key listed on the API Keys page.</span>
						) : null}
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='overflow-x-auto rounded-md border border-slate-200'>
						{loading ? (
							<p className='p-4 text-sm text-gray-600'>Loading providers...</p>
						) : rows.length === 0 ? (
							<p className='p-4 text-sm text-gray-600'>No provider credentials yet. Add your first provider below.</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='min-w-[8rem]'>Provider</TableHead>
										<TableHead className='min-w-[12rem]'>Verified sender email</TableHead>
										<TableHead className='min-w-[6rem]'>API key</TableHead>
										<TableHead className='min-w-[11rem] text-right'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((row) => (
										<TableRow key={row.provider}>
											<TableCell className='font-medium'>{labelForProvider(row.provider)}</TableCell>
											<TableCell className='text-gray-700'>{row.sender_email || "—"}</TableCell>
											<TableCell>
												<Badge variant='secondary' className='font-normal'>
													Saved
												</Badge>
												<span className='ml-2 text-xs text-muted-foreground'>Use Edit to rotate</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex flex-wrap items-start justify-end gap-1'>
													<div className='flex flex-col items-end gap-0.5'>
														<Button
															type='button'
															variant='outline'
															size='sm'
															className='border-emerald-200 text-emerald-900 hover:bg-emerald-50'
															disabled={
																testByProvider[row.provider]?.phase === "sending" ||
																!canRunTest ||
																!row.sender_email.trim()
															}
															title={
																!chitthiKeyForTest
																	? "Create a Chitthi API key first"
																	: !accountEmail.includes("@")
																		? "Account email missing"
																		: !row.sender_email.trim()
																			? "Add a verified sender for this provider"
																			: "POST /send-email using this row’s provider and sender"
															}
															onClick={() => void handleSendTest(row)}
														>
															<Send className='mr-1 h-3.5 w-3.5' />
															{testByProvider[row.provider]?.phase === "sending" ? "Sending…" : "Send test"}
														</Button>
														{testByProvider[row.provider]?.phase === "sent" ? (
															<span className='text-xs font-medium text-green-700'>Sent</span>
														) : testByProvider[row.provider]?.phase === "failed" ? (
															<span className='max-w-[10rem] text-right text-xs font-medium text-red-700' title={testByProvider[row.provider]?.detail}>
																Failed
															</span>
														) : null}
													</div>
													<Button type='button' variant='outline' size='sm' className='border-blue-200 hover:bg-blue-50' onClick={() => openEdit(row)}>
														<Pencil className='mr-1 h-3.5 w-3.5' />
														Edit
													</Button>
													<Button
														type='button'
														variant='outline'
														size='sm'
														className='border-red-200 text-red-700 hover:bg-red-50'
														disabled={removingProvider === row.provider}
														aria-label={`Remove ${row.provider}`}
														onClick={() => void handleRemoveProvider(row.provider)}
													>
														<Trash2 className='h-3.5 w-3.5' />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>

					<div className='space-y-4 border-t border-slate-100 pt-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900'>Add provider</h3>
							<p className='text-sm text-muted-foreground'>Connect a provider you have not configured yet. You need a valid API key from that provider.</p>
						</div>
						{availableToAdd.length === 0 ? (
							<p className='text-sm text-gray-600'>All supported providers are already configured. Remove one above to switch or re-add.</p>
						) : (
							<>
								<div className='space-y-2'>
									<Label>Provider</Label>
									<Select value={addProvider} onValueChange={setAddProvider}>
										<SelectTrigger>
											<SelectValue placeholder='Choose a provider' />
										</SelectTrigger>
										<SelectContent>
											{availableToAdd.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='add-provider-key'>Provider API key</Label>
									<Input
										id='add-provider-key'
										type='password'
										autoComplete='off'
										placeholder='Paste provider API key'
										value={addKey}
										onChange={(e) => setAddKey(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='add-sender-email'>Verified sender email</Label>
									<Input
										id='add-sender-email'
										type='email'
										autoComplete='email'
										placeholder='e.g. newsletters@yourdomain.com'
										value={addSenderEmail}
										onChange={(e) => setAddSenderEmail(e.target.value)}
									/>
									<p className='text-xs text-muted-foreground'>Stored for default From when sending with your Chitthi API key.</p>
								</div>
								<Button disabled={addSaving} onClick={() => void handleAdd()} className='w-full bg-blue-600 hover:bg-blue-700'>
									{addSaving ? "Saving..." : "Add provider"}
								</Button>
							</>
						)}
					</div>
				</CardContent>
			</Card>

			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Edit {editing ? labelForProvider(editing.provider) : "provider"}</DialogTitle>
						<DialogDescription>
							Update the verified sender email. Leave API key blank to keep your current key, or paste a new key to rotate it.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-3 py-2'>
						<div className='space-y-2'>
							<Label htmlFor='edit-sender-email'>Verified sender email</Label>
							<Input
								id='edit-sender-email'
								type='email'
								autoComplete='email'
								value={editEmail}
								onChange={(e) => setEditEmail(e.target.value)}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='edit-provider-key'>Provider API key (optional)</Label>
							<Input
								id='edit-provider-key'
								type='password'
								autoComplete='off'
								placeholder='Leave blank to keep existing key'
								value={editKey}
								onChange={(e) => setEditKey(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter className='gap-2 sm:gap-0'>
						<Button type='button' variant='outline' onClick={() => setEditOpen(false)}>
							Cancel
						</Button>
						<Button type='button' disabled={editSaving} className='bg-blue-600 hover:bg-blue-700' onClick={() => void handleEditSave()}>
							{editSaving ? "Saving..." : "Save changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
