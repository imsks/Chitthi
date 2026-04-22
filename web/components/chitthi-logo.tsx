import { Mail } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ChitthiLogo({ href = "/", className = "" }: { href?: string; className?: string }) {
	return (
		<Link href={href} className={cn("flex items-center space-x-2", className)}>
			<div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
				<Mail className='w-5 h-5 text-white' />
			</div>
			<span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
				Chitthi
			</span>
		</Link>
	)
}