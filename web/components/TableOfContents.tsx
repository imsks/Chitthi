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
        <div className={`toc ${className}`}>
            <h3 className='toc-title'>On this page</h3>
            <nav className='space-y-1'>
                {headings.map((heading) => (
                    <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`toc-item ${
                            activeId === heading.id ? "active" : ""
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
    )
}
