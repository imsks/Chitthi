/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    eslint: {
        ignoreDuringBuilds: true
    },
    images: { unoptimized: true },
    trailingSlash: true
}

module.exports = nextConfig
