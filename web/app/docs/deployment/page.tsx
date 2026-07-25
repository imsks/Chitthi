import type { Metadata } from "next"
import DeploymentContent from "./content"

export const metadata: Metadata = {
    title: "Deployment",
    description:
        "Deploy your self-hosted Chitthi instance to production with Docker, best practices, and a production checklist.",
    openGraph: {
        title: "Deployment | Chitthi Docs",
        description:
            "Deploy Chitthi to production with Docker and production-hardening best practices.",
        url: "/docs/deployment"
    }
}

export default function DeploymentPage() {
    return <DeploymentContent />
}
