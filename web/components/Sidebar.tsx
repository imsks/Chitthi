"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    ChevronRight,
    ChevronDown,
    Search,
    BookOpen,
    Code,
    Zap,
    Mail,
    Shield,
    Settings,
    Github,
    ExternalLink
} from "lucide-react"

interface SidebarItem {
    title: string
    href: string
    icon?: React.ComponentType<{ size?: number | string }>
    children?: SidebarItem[]
}

interface SidebarProps {
    className?: string
}

export default function Sidebar({ className = "" }: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([
        "getting-started",
        "api-reference"
    ])
    const [searchQuery, setSearchQuery] = useState("")

    const sidebarItems: SidebarItem[] = [
        {
            title: "Getting Started",
            href: "#getting-started",
            icon: Zap,
            children: [
                { title: "Quick Start", href: "#quick-start" },
                { title: "Installation", href: "#installation" },
                { title: "Configuration", href: "#configuration" }
            ]
        },
        {
            title: "API Reference",
            href: "#api-reference",
            icon: Code,
            children: [
                { title: "Send Email", href: "#send-email" },
                { title: "Email Logs", href: "#email-logs" },
                { title: "Health Check", href: "#health-check" }
            ]
        },
        {
            title: "Email Providers",
            href: "#email-providers",
            icon: Mail,
            children: [
                { title: "SMTP", href: "#smtp" },
                { title: "SendGrid", href: "#sendgrid" },
                { title: "Breevo", href: "#breevo" },
                { title: "MailerSend", href: "#mailersend" }
            ]
        },
        {
            title: "Configuration",
            href: "#configuration",
            icon: Settings,
            children: [
                { title: "Environment Variables", href: "#env-vars" },
                { title: "Provider Priority", href: "#provider-priority" },
                { title: "Security", href: "#security" }
            ]
        },
        {
            title: "Deployment",
            href: "#deployment",
            icon: Shield,
            children: [
                { title: "Docker", href: "#docker" },
                { title: "Production", href: "#production" },
                { title: "Environment Setup", href: "#env-setup" }
            ]
        }
    ]

    const toggleItem = (title: string) => {
        setExpandedItems((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title]
        )
    }

    const filteredItems = sidebarItems.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.children?.some((child) =>
                child.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
    )

    const SidebarItem = ({
        item,
        level = 0
    }: {
        item: SidebarItem
        level?: number
    }) => {
        const isExpanded = expandedItems.includes(item.title)
        const hasChildren = item.children && item.children.length > 0

        return (
            <div className='space-y-1'>
                <div className='flex items-center justify-between'>
                    <Link
                        href={item.href}
                        className={`sidebar-item ${
                            level === 0 ? "font-medium" : ""
                        }`}>
                        {item.icon && <item.icon size={16} />}
                        <span>{item.title}</span>
                    </Link>
                    {hasChildren && (
                        <button
                            onClick={() => toggleItem(item.title)}
                            className='p-1 hover:bg-gray-100 rounded transition-colors'>
                            {isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className='ml-6 space-y-1'>
                        {item.children!.map((child, index) => (
                            <SidebarItem
                                key={index}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        )
    }

    return (
        <div className={`sidebar ${className}`}>
            <div className='p-4 space-y-6'>
                {/* Search */}
                <div className='relative'>
                    <Search
                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                        size={16}
                    />
                    <input
                        type='text'
                        placeholder='Search documentation...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='search-input pl-10 pr-4 w-full'
                    />
                </div>

                {/* Navigation */}
                <nav className='space-y-4'>
                    {filteredItems.map((item, index) => (
                        <SidebarItem key={index} item={item} />
                    ))}
                </nav>

                {/* Quick Links */}
                <div className='pt-6 border-t border-gray-200'>
                    <h3 className='sidebar-title'>Quick Links</h3>
                    <div className='space-y-2'>
                        <Link
                            href='https://github.com/imsks/chitthi'
                            className='sidebar-item'>
                            <Github size={16} />
                            GitHub Repository
                            <ExternalLink size={12} />
                        </Link>
                        <Link
                            href='https://github.com/imsks/chitthi/issues'
                            className='sidebar-item'>
                            <BookOpen size={16} />
                            Report Issues
                            <ExternalLink size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
