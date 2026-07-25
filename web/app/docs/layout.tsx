import type { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Documentation",
        template: "%s | Chitthi Docs"
    },
    description:
        "Chitthi documentation — learn how to integrate the email microservice via Cloud or Self-Host.",
    openGraph: {
        title: "Chitthi Documentation",
        description:
            "Learn how to integrate Chitthi email microservice via Cloud or Self-Host.",
        url: "/docs"
    }
}

export default function DocsLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
