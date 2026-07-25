import type { Metadata } from "next"
import SelfHostPageContent from "./content"

export const metadata: Metadata = {
    title: "Self-Host Guide",
    description:
        "Run Chitthi on your own infrastructure. Clone the repo, run with Docker Compose, and own your entire email setup. MIT licensed.",
    openGraph: {
        title: "Self-Host Guide | Chitthi Docs",
        description:
            "Run Chitthi on your own infrastructure with Docker Compose. Full data control, MIT licensed.",
        url: "/docs/self-host"
    }
}

export default function SelfHostPage() {
    return <SelfHostPageContent />
}
