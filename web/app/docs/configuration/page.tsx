import type { Metadata } from "next"
import ConfigurationContent from "./content"

export const metadata: Metadata = {
    title: "Configuration",
    description:
        "Environment variables, database setup, and Redis configuration for self-hosted Chitthi deployments.",
    openGraph: {
        title: "Configuration | Chitthi Docs",
        description:
            "Environment variables and infrastructure setup for self-hosted Chitthi.",
        url: "/docs/configuration"
    }
}

export default function ConfigurationPage() {
    return <ConfigurationContent />
}
