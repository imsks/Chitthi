import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { LoginView } from "./login-view"

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className='flex min-h-[200px] flex-col items-center justify-center gap-3 text-gray-600'>
					<Loader2 className='h-8 w-8 animate-spin text-blue-600' />
					<p className='text-sm'>Loading…</p>
				</div>
			}>
			<LoginView />
		</Suspense>
	)
}
