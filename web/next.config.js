/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    images: { unoptimized: true },
    async redirects() {
        return [
            {
                source: "/dashboard/settings",
                destination: "/dashboard/providers",
                permanent: true
            }
        ]
    },
    async rewrites() {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

        // Keep /api/auth/* for NextAuth — proxy only the Go API under /api/v1/*
        return [
            {
                source: "/api/v1/:path*",
                destination: `${apiBase}/api/v1/:path*`
            }
        ]
    }
}

module.exports = nextConfig
