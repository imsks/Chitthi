/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static exports for platforms like GitHub Pages
    output: "export",

    // Disable image optimization for static export
    images: {
        unoptimized: true
    },

    // Trailing slash for static hosting
    trailingSlash: true,

    // Disable server-side features for static export
    experimental: {
        appDir: true
    }
}

module.exports = nextConfig
