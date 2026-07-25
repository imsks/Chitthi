import type { Metadata } from "next"
import QuickStartPage from "./content"

export const metadata: Metadata = {
    title: "Quick Start",
    description:
        "Get started with Chitthi in minutes. Choose Cloud (hosted) for zero-infra setup or Self-Host for full control over your email infrastructure.",
    openGraph: {
        title: "Quick Start | Chitthi",
        description:
            "Integrate Chitthi in under 5 minutes — Cloud or Self-Host.",
        url: "/quick-start"
    },
    alternates: {
        canonical: "/quick-start"
    }
}

export default function Page() {
    return <QuickStartPage />
}
