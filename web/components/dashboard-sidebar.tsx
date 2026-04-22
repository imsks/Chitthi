"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChitthiLogo } from "@/components/chitthi-logo"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const navigation = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/dashboard/settings", label: "Settings", icon: Settings }
]

export function DashboardSidebar() {
	const pathname = usePathname()
	const { user, logout } = useAuth()

	return (
		<aside className='flex h-screen w-full max-w-xs flex-col border-r bg-white'>
			<div className='border-b px-6 py-5'>
				<ChitthiLogo href='/dashboard' />
			</div>
			<nav className='flex-1 space-y-2 px-4 py-6'>
				{navigation.map((item) => {
					const active = pathname === item.href
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
								active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
							)}>
							<item.icon className='mr-3 h-4 w-4' />
							{item.label}
						</Link>
					)
				})}
			</nav>
			<div className='border-t px-4 py-5'>
				<div className='mb-4 rounded-lg bg-slate-50 px-4 py-3'>
					<p className='text-sm font-medium text-gray-900'>{user?.name || "Chitthi user"}</p>
					<p className='text-sm text-gray-600'>{user?.email || ""}</p>
				</div>
				<Button variant='outline' className='w-full border-blue-200 hover:bg-blue-50' onClick={() => void logout()}>
					<LogOut className='mr-2 h-4 w-4' />
					Logout
				</Button>
			</div>
		</aside>
	)
}