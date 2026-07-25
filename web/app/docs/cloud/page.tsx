import type { Metadata } from "next"
import CloudPageContent from "./content"

export const metadata: Metadata = {
    title: "Cloud Integration",
    description:
        "Use Chitthi's hosted API — no infrastructure to set up. Configure your provider on the Dashboard and start sending emails in minutes.",
    openGraph: {
        title: "Cloud Integration | Chitthi Docs",
        description:
            "Use Chitthi's hosted API with zero infrastructure. Sign up, add provider, send emails.",
        url: "/docs/cloud"
    }
}

export default function CloudPage() {
    return <CloudPageContent />
}
