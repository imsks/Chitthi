import { LucideIcon } from "lucide-react"

export interface SidebarItem {
    id: string
    label: string
    href: string
    icon: LucideIcon
}

export interface ExternalLink {
    href: string
    label: string
    icon: LucideIcon
}
