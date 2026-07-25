import {
    Book,
    Cloud,
    Server,
    Code,
    Globe,
    Settings,
    Database,
    Zap
} from "lucide-react"
import type { SidebarItem, ExternalLink } from "./types"

export const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Overview", href: "/docs", icon: Book },
    { id: "cloud", label: "Cloud (Hosted)", href: "/docs/cloud", icon: Cloud },
    {
        id: "self-host",
        label: "Self-Host",
        href: "/docs/self-host",
        icon: Server
    },
    {
        id: "api-reference",
        label: "API Reference",
        href: "/docs/api-reference",
        icon: Code
    },
    {
        id: "providers",
        label: "Email Providers",
        href: "/docs/providers",
        icon: Globe
    },
    {
        id: "configuration",
        label: "Configuration",
        href: "/docs/configuration",
        icon: Settings
    },
    {
        id: "deployment",
        label: "Deployment",
        href: "/docs/deployment",
        icon: Database
    }
]

export const externalLinks: ExternalLink[] = [
    { href: "/quick-start", label: "Quick Start Guide", icon: Zap }
]

export const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const docsMetaBase = {
    siteName: "Chitthi",
    locale: "en_US",
    type: "website" as const
}
