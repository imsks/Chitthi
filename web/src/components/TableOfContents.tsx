"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Hash } from "lucide-react"

interface TocItem {
    id: string
    title: string
    level: number
}

interface TableOfContentsProps {
    className?: string
}

export default function TableOfContents({
    className = ""
}: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const elements = Array.from(
            document.querySelectorAll("h1, h2, h3, h4, h5, h6")
        )
        const items: TocItem[] = elements.map((element) => ({
            id: element.id,
            title: element.textContent || "",
            level: parseInt(element.tagName.charAt(1))
        }))
        setHeadings(items)
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-20% 0px -35% 0px" }
        )

        headings.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [headings])

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    if (headings.length === 0) return null

    return (
        <div
            className={`w-64 bg-gray-900/50 border-l border-gray-800 h-full overflow-y-auto ${className}`}>
            <div className='p-4'>
                <h3 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4'>
                    On this page
                </h3>
                <nav className='space-y-1'>
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                                activeId === heading.id
                                    ? "text-green-400 bg-green-400/10"
                                    : "text-gray-400 hover:text-gray-200"
                            }`}
                            style={{
                                paddingLeft: `${(heading.level - 1) * 12 + 8}px`
                            }}>
                            <Hash size={12} />
                            {heading.title}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
