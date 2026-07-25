import type { Metadata } from "next"
import ApiReferenceContent from "./content"

export const metadata: Metadata = {
    title: "API Reference",
    description:
        "Complete API reference for Chitthi email service. POST /send-email endpoint with authentication options for Cloud and Self-Host users.",
    openGraph: {
        title: "API Reference | Chitthi Docs",
        description:
            "Complete API reference for Chitthi — POST /send-email with Cloud and Self-Host auth.",
        url: "/docs/api-reference"
    }
}

export default function ApiReferencePage() {
    return <ApiReferenceContent />
}
