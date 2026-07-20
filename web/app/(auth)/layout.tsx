import type { ReactNode } from "react"
import { ChitthiLogo } from "@/components/chitthi-logo"

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
			<header className='border-b bg-white/80 backdrop-blur-md sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-4 flex items-center justify-between'>
					<ChitthiLogo />
				</div>
			</header>
			<div className='container mx-auto px-4 py-16 lg:py-24'>
				<div className='mx-auto max-w-md'>{children}</div>
			</div>
		</div>
	)
}