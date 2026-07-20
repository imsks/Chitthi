"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { OnboardingModal } from "@/components/onboarding-modal"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()
	const { user, loading, logout } = useAuth()

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login")
		}
	}, [loading, router, user])

	if (loading || !user) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center'>
				<div className='rounded-full border-4 border-blue-100 border-t-blue-600 h-12 w-12 animate-spin' />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 lg:flex'>
			<div className='hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0 lg:self-start'>
				<DashboardSidebar />
			</div>
			<div className='flex min-h-screen flex-1 flex-col'>
				<header className='border-b bg-white/80 px-4 py-4 backdrop-blur-md lg:hidden'>
					<div className='flex items-center justify-between gap-3'>
						<p className='text-lg font-semibold text-gray-900'>Chitthi Dashboard</p>
						<Button variant='outline' size='sm' className='border-blue-200 hover:bg-blue-50' onClick={() => void logout()}>
							Logout
						</Button>
					</div>
					<div className='mt-4 flex gap-2'>
						<Button asChild variant={pathname === "/dashboard" ? "default" : "outline"} size='sm' className={pathname === "/dashboard" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 hover:bg-blue-50"}>
							<Link href='/dashboard'>Dashboard</Link>
						</Button>
						<Button asChild variant={pathname === "/dashboard/providers" ? "default" : "outline"} size='sm' className={pathname === "/dashboard/providers" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 hover:bg-blue-50"}>
							<Link href='/dashboard/providers'>Providers</Link>
						</Button>
					</div>
				</header>
				<main className='flex-1 px-4 py-6 lg:px-8 lg:py-8'>{children}</main>
			</div>
			<OnboardingModal />
		</div>
	)
}