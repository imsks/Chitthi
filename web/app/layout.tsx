import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Chitthi - Email Microservice",
    description:
        "A BYOK (Bring Your Own Key) email microservice with multi-provider support. Send emails via Breevo, SendGrid, MailerSend, and SMTP with plug-and-play simplicity.",
    keywords:
        "email, microservice, API, SendGrid, SMTP, Breevo, MailerSend, Go, developer tools",
    authors: [{ name: "Sachin" }],
    creator: "Sachin",
    openGraph: {
        title: "Chitthi - Email Microservice",
        description:
            "A BYOK (Bring Your Own Key) email microservice with multi-provider support.",
        type: "website",
        url: "https://chitthi-by-tbe.netlify.app",
        siteName: "Chitthi",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Chitthi - Email Microservice"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Chitthi - Email Microservice",
        description:
            "A BYOK (Bring Your Own Key) email microservice with multi-provider support.",
        creator: "@imsks"
    },
    robots: {
        index: true,
        follow: true
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png"
    },
    manifest: "/site.webmanifest",
    viewport: "width=device-width, initial-scale=1"
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' className='scroll-smooth'>
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    )
}
