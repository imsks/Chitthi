import type { Metadata } from "next"
import ProvidersContent from "./content"

export const metadata: Metadata = {
    title: "Email Providers",
    description:
        "Chitthi supports SendGrid, Breevo, and MailerSend with automatic detection and failover. Learn how to configure providers for Cloud or Self-Host.",
    openGraph: {
        title: "Email Providers | Chitthi Docs",
        description:
            "Configure SendGrid, Breevo, or MailerSend with Chitthi's multi-provider support.",
        url: "/docs/providers"
    }
}

export default function ProvidersPage() {
    return <ProvidersContent />
}
