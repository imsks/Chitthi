"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Mail,
    ArrowLeft,
    Copy,
    CheckCircle,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { sidebarItems, externalLinks } from "./constants"

/** Reusable code block with copy-to-clipboard */
export function CodeBlock({
    code,
    language = "bash",
    id
}: {
    code: string
    language?: string
    id: string
}) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className='relative'>
            <Card className='bg-gray-900 text-white border-0 overflow-hidden'>
                <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                            <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                            <span className='ml-4 text-sm text-gray-400'>
                                {language}
                            </span>
                        </div>
                        <Button
                            size='sm'
                            variant='ghost'
                            className='text-gray-400 hover:text-white h-8 px-2'
                            onClick={copyToClipboard}>
                            {copied ? (
                                <CheckCircle className='w-4 h-4' />
                            ) : (
                                <Copy className='w-4 h-4' />
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='pt-0'>
                    <pre className='text-sm overflow-x-auto'>
                        <code>{code}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}

/** Shared header for docs and quick-start */
export function DocsHeader({
    title,
    version = "v1.0.0"
}: {
    title: string
    version?: string
}) {
    return (
        <header className='border-b bg-white sticky top-0 z-50'>
            <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                    <Button asChild variant='ghost' size='sm'>
                        <Link href='/'>
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back to Home
                        </Link>
                    </Button>
                    <Separator orientation='vertical' className='h-6' />
                    <div className='flex items-center space-x-2'>
                        <div className='w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                            <Mail className='w-4 h-4 text-white' />
                        </div>
                        <div className='flex items-center space-x-2'>
                            <span className='text-xl font-bold'>{title}</span>
                            <Badge className='bg-green-100 text-green-800 text-xs font-medium'>
                                {version}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className='flex items-center space-x-4'>
                    <Button asChild variant='outline' size='sm'>
                        <a
                            href='https://github.com/imsks/chitthi'
                            target='_blank'
                            rel='noopener noreferrer'>
                            GitHub
                            <ExternalLink className='w-4 h-4 ml-2' />
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    )
}

/** Sidebar navigation for docs */
export function DocsSidebar() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === "/docs") return pathname === "/docs"
        return pathname.startsWith(href)
    }

    return (
        <div className='sticky top-24 min-w-[200px]'>
            <Card>
                <CardHeader className='pb-3'>
                    <h2 className='text-lg font-semibold'>Documentation</h2>
                </CardHeader>
                <CardContent>
                    <ScrollArea className='h-96'>
                        <nav className='space-y-1'>
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 whitespace-nowrap ${
                                        isActive(item.href)
                                            ? "bg-blue-100 text-blue-700 font-medium"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}>
                                    <item.icon className='w-4 h-4 shrink-0' />
                                    <span>{item.label}</span>
                                </Link>
                            ))}

                            <Separator className='my-4' />

                            <div className='space-y-1'>
                                <div className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    External Links
                                </div>
                                {externalLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className='w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 whitespace-nowrap hover:bg-gray-100 text-gray-700'>
                                        <link.icon className='w-4 h-4 shrink-0' />
                                        <span>{link.label}</span>
                                        <ExternalLink className='w-3 h-3 ml-auto shrink-0' />
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
