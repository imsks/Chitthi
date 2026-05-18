import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck, ShieldCheck, Settings2 } from "lucide-react"

export default function DashboardPage() {
	return (
		<div className='space-y-6'>
			<div>
				<Badge className='mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100'>Workspace</Badge>
				<h1 className='text-3xl font-bold text-gray-900'>Welcome to your dashboard</h1>
				<p className='mt-2 max-w-2xl text-gray-600'>
					Your authenticated workspace is ready. Complete onboarding if prompted. Use API Keys for Chitthi unified keys and Providers for provider keys and verified
					sender email.
				</p>
			</div>
			<div className='grid gap-6 md:grid-cols-3'>
				<Card className='border-blue-100 bg-white/95'>
					<CardHeader>
						<MailCheck className='h-8 w-8 text-blue-600' />
						<CardTitle>Provider ready</CardTitle>
						<CardDescription>Add or replace your email provider key from onboarding or Providers.</CardDescription>
					</CardHeader>
				</Card>
				<Card className='border-blue-100 bg-white/95'>
					<CardHeader>
						<ShieldCheck className='h-8 w-8 text-green-600' />
						<CardTitle>Unified API keys</CardTitle>
						<CardDescription>Issue Chitthi API keys for your applications and keep access scoped to your account.</CardDescription>
					</CardHeader>
				</Card>
				<Card className='border-blue-100 bg-white/95'>
					<CardHeader>
						<Settings2 className='h-8 w-8 text-purple-600' />
						<CardTitle>Providers</CardTitle>
						<CardDescription>Use the sidebar to open Providers and review the credentials you have already added.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</div>
	)
}