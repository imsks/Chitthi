"use client"

import { useState } from "react"
import { CheckCircle2, Copy, KeyRound, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { addProviderAPIKey, completeOnboarding, createAPIKey } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { getDefaultExpiryDate, providerOptions } from "@/lib/dashboard"
import { toast } from "@/hooks/use-toast"

export function OnboardingModal() {
	const { user, setUser } = useAuth()
	const [step, setStep] = useState<1 | 2>(1)
	const [provider, setProvider] = useState(providerOptions[0].value)
	const [providerKey, setProviderKey] = useState("")
	const [expiry, setExpiry] = useState(getDefaultExpiryDate())
	const [generatedKey, setGeneratedKey] = useState("")
	const [error, setError] = useState("")
	const [savingProvider, setSavingProvider] = useState(false)
	const [generating, setGenerating] = useState(false)
	const [completing, setCompleting] = useState(false)

	const handleProviderSave = async () => {
		if (!providerKey.trim()) {
			setError("Enter your provider API key to continue.")
			return
		}

		setError("")
		setSavingProvider(true)
		try {
			await addProviderAPIKey(provider, providerKey.trim())
			setStep(2)
			toast({ title: "Provider key saved", description: "You can update it later from Settings." })
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Unable to save provider key")
		} finally {
			setSavingProvider(false)
		}
	}

	const handleGenerate = async () => {
		setError("")
		setGenerating(true)
		try {
			const response = await createAPIKey(expiry)
			setGeneratedKey(response.api_key)
			toast({ title: "API key generated", description: "Copy it now and keep it secure." })
		} catch (generateError) {
			setError(generateError instanceof Error ? generateError.message : "Unable to generate API key")
		} finally {
			setGenerating(false)
		}
	}

	const handleCopy = async () => {
		if (!generatedKey) {
			return
		}

		await navigator.clipboard.writeText(generatedKey)
		toast({ title: "Copied", description: "Chitthi API key copied to your clipboard." })
	}

	const handleComplete = async () => {
		setError("")
		setCompleting(true)
		try {
			await completeOnboarding()
			if (user) {
				setUser({ ...user, is_onboarded: true })
			}
			toast({ title: "Onboarding complete", description: "Your workspace is ready." })
		} catch (completeError) {
			setError(completeError instanceof Error ? completeError.message : "Unable to complete onboarding")
		} finally {
			setCompleting(false)
		}
	}

	return (
		<Dialog open={!user?.is_onboarded} onOpenChange={() => undefined}>
			<DialogContent
				className='border-blue-100 bg-white sm:max-w-2xl [&>button]:hidden'
				onInteractOutside={(event) => event.preventDefault()}
				onEscapeKeyDown={(event) => event.preventDefault()}>
				<DialogHeader>
					<div className='inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
						<Sparkles className='mr-2 h-4 w-4' />
						Finish setup
					</div>
					<DialogTitle className='text-2xl text-gray-900'>Complete your Chitthi onboarding</DialogTitle>
					<DialogDescription className='text-gray-600'>
						Add one provider key, generate your Chitthi API key, and you are ready to route email through your account.
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4 lg:grid-cols-[1.1fr,0.9fr]'>
					<Card className='border-blue-100 bg-gradient-to-br from-slate-50 via-white to-blue-50'>
						<CardContent className='space-y-4 p-5'>
							<div className='flex items-center gap-3'>
								<div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 1 ? "bg-blue-600 text-white" : "bg-green-100 text-green-700"}`}>
									1
								</div>
								<div>
									<p className='font-medium text-gray-900'>Add provider credentials</p>
									<p className='text-sm text-gray-600'>Store the provider key you want Chitthi to use.</p>
								</div>
							</div>
							<div className='flex items-center gap-3'>
								<div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 2 ? "bg-blue-600 text-white" : generatedKey ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
									2
								</div>
								<div>
									<p className='font-medium text-gray-900'>Generate Chitthi key</p>
									<p className='text-sm text-gray-600'>Create and copy the unified API key for your apps.</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className='space-y-4'>
						{error ? (
							<Alert variant='destructive'>
								<AlertTitle>Setup issue</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}

						{step === 1 ? (
							<div className='space-y-4'>
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
									<Label htmlFor='provider-key'>Provider API key</Label>
									<Input
										id='provider-key'
										type='password'
										placeholder='Paste your provider key'
										value={providerKey}
										onChange={(event) => setProviderKey(event.target.value)}
									/>
								</div>
								<Button disabled={savingProvider} onClick={() => void handleProviderSave()} className='w-full bg-blue-600 hover:bg-blue-700'>
									{savingProvider ? "Saving..." : "Save and continue"}
								</Button>
							</div>
						) : (
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='expiry'>Expiry date</Label>
									<Input id='expiry' type='date' value={expiry} onChange={(event) => setExpiry(event.target.value)} />
								</div>
								<Button disabled={generating} onClick={() => void handleGenerate()} className='w-full bg-blue-600 hover:bg-blue-700'>
									<KeyRound className='mr-2 h-4 w-4' />
									{generating ? "Generating..." : "Generate Chitthi API key"}
								</Button>
								{generatedKey ? (
									<Card className='border-green-200 bg-green-50'>
										<CardContent className='space-y-3 p-4'>
											<div className='flex items-start justify-between gap-3'>
												<div>
													<p className='font-medium text-green-800'>Generated API key</p>
													<p className='text-sm text-green-700'>Copy this key now. You will only see the full value at creation time.</p>
												</div>
												<CheckCircle2 className='h-5 w-5 text-green-700' />
											</div>
											<Input readOnly value={generatedKey} className='font-mono text-xs' />
											<Button variant='outline' className='w-full border-green-200 hover:bg-white' onClick={() => void handleCopy()}>
												<Copy className='mr-2 h-4 w-4' />
												Copy API key
											</Button>
										</CardContent>
									</Card>
								) : null}
							</div>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' disabled={step === 1} onClick={() => setStep(1)} className='border-blue-200 hover:bg-blue-50'>
						Back
					</Button>
					<Button disabled={!generatedKey || completing} onClick={() => void handleComplete()} className='bg-blue-600 hover:bg-blue-700'>
						{completing ? "Finishing..." : "Complete setup"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}