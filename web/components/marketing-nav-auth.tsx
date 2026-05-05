"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

function initialsFrom(name: string, email: string) {
	const n = name.trim()
	if (n.length >= 2) {
		return n.slice(0, 2).toUpperCase()
	}
	if (email.length >= 2) {
		return email.slice(0, 2).toUpperCase()
	}
	return "?"
}

export function MarketingNavAuth() {
	const { data: session, status } = useSession()
	const { user, logout } = useAuth()

	if (status === "loading") {
		return (
			<div
				className='h-10 w-[200px] max-w-[45vw] animate-pulse rounded-xl border border-gray-100 bg-gray-100/80'
				aria-hidden
			/>
		)
	}

	if (status === "authenticated" && session?.user) {
		const displayName = user?.name ?? session.user.name ?? "Account"
		const email = user?.email ?? session.user.email ?? ""
		const image = session.user.image ?? undefined
		const initials = initialsFrom(displayName, email)

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type='button'
						className='flex max-w-[min(100%,220px)] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-left shadow-sm outline-none ring-offset-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500'>
						<Avatar className='h-9 w-9 shrink-0'>
							{image ? <AvatarImage src={image} alt='' referrerPolicy='no-referrer' /> : null}
							<AvatarFallback className='bg-blue-100 text-sm font-medium text-blue-800'>
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className='hidden min-w-0 flex-1 sm:block'>
							<p className='truncate text-sm font-semibold text-gray-900'>{displayName}</p>
							{email ? <p className='truncate text-xs text-gray-500'>{email}</p> : null}
						</div>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-56'>
					<DropdownMenuLabel className='font-normal'>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>{displayName}</p>
							{email ? <p className='text-xs leading-none text-muted-foreground'>{email}</p> : null}
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href='/dashboard' className='cursor-pointer'>
							<LayoutDashboard className='mr-2 h-4 w-4' />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer'
						onSelect={() => {
							void logout()
						}}>
						<LogOut className='mr-2 h-4 w-4' />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	return (
		<Button asChild className='bg-blue-600 hover:bg-blue-700'>
			<Link href='/login'>Sign in with Google</Link>
		</Button>
	)
}
