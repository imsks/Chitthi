"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Menu,
    X,
    Github,
    Search,
    ChevronDown,
    BookOpen,
    Home,
    Code,
    Mail,
    Settings
} from "lucide-react"

interface NavigationProps {
    isDocs?: boolean
}

export default function Navigation({ isDocs = false }: NavigationProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Documentation", href: "/docs", icon: BookOpen },
        { name: "API Reference", href: "/docs#api-reference", icon: Code },
        { name: "Examples", href: "/docs#examples", icon: Mail }
    ]

    return (
        <nav className={`nav-container ${isScrolled ? "shadow-sm" : ""}`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Link href='/' className='flex items-center space-x-2'>
                            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                                <span className='text-white font-bold text-sm'>
                                    C
                                </span>
                            </div>
                            <span className='text-xl font-bold text-gray-900'>
                                chitthi
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center space-x-8'>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className='nav-link flex items-center gap-2'>
                                <item.icon size={16} />
                                {item.name}
                            </Link>
                        ))}

                        {/* Search */}
                        <div className='relative'>
                            <Search
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                                size={16}
                            />
                            <input
                                type='text'
                                placeholder='Search docs...'
                                className='search-input pl-10 pr-4 w-64'
                            />
                        </div>

                        {/* GitHub */}
                        <Link
                            href='https://github.com/imsks/chitthi'
                            className='nav-link flex items-center gap-2'>
                            <Github size={16} />
                            <span className='hidden lg:inline'>GitHub</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='text-gray-600 hover:text-gray-900 transition-colors'>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className='md:hidden border-t border-gray-200'>
                            <div className='py-4 space-y-4'>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className='nav-link flex items-center gap-3 px-4 py-2'
                                        onClick={() => setIsOpen(false)}>
                                        <item.icon size={16} />
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Mobile Search */}
                                <div className='px-4'>
                                    <div className='relative'>
                                        <Search
                                            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                                            size={16}
                                        />
                                        <input
                                            type='text'
                                            placeholder='Search docs...'
                                            className='search-input pl-10 pr-4 w-full'
                                        />
                                    </div>
                                </div>

                                {/* Mobile GitHub */}
                                <Link
                                    href='https://github.com/imsks/chitthi'
                                    className='nav-link flex items-center gap-3 px-4 py-2'
                                    onClick={() => setIsOpen(false)}>
                                    <Github size={16} />
                                    GitHub
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}
