import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"

// Optimize font loading with display swap
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
})

// Production metadata
export const metadata: Metadata = {
    title: {
        default: "Chitthi - Email Service",
        template: "%s | Chitthi"
    },
    description:
        "Professional email service platform for reliable communication",
    keywords: ["email", "communication", "service", "chitthi"],
    authors: [{ name: "Chitthi Team" }],
    creator: "Chitthi",
    publisher: "Chitthi",
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ),
    alternates: {
        canonical: "/"
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "Chitthi - Email Service",
        description:
            "Professional email service platform for reliable communication",
        siteName: "Chitthi"
    },
    twitter: {
        card: "summary_large_image",
        title: "Chitthi - Email Service",
        description:
            "Professional email service platform for reliable communication"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    }
}

// Viewport configuration
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" }
    ]
} as const

// Root layout component
export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' className={inter.variable} suppressHydrationWarning>
            <head>
                {/* Preconnect to external domains for performance */}
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin='anonymous'
                />

                {/* Security headers */}
                <meta httpEquiv='X-Content-Type-Options' content='nosniff' />
                <meta httpEquiv='X-Frame-Options' content='DENY' />
                <meta httpEquiv='X-XSS-Protection' content='1; mode=block' />
                <meta
                    httpEquiv='Referrer-Policy'
                    content='strict-origin-when-cross-origin'
                />

                {/* Performance optimizations */}
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
                <link rel='dns-prefetch' href='//fonts.gstatic.com' />
            </head>
            <body className={`${inter.className} antialiased`}>
                <AuthProvider>
                    {children}
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    )
}
