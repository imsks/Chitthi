/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    images: { unoptimized: true },
    async rewrites() {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

        return [
            {
                source: "/api/:path*",
                destination: `${apiBase}/api/:path*`
            }
        ]
    }
}

module.exports = nextConfig
