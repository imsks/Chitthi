"use client"

import { motion } from "framer-motion"
import {
    ArrowRight,
    Mail,
    Zap,
    Shield,
    Code,
    Github,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

export default function Home() {
    return (
        <div className='min-h-screen'>
            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className='hero'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='text-center'>
                        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6'>
                            Sending emails shouldn&apos;t be a pain
                        </h1>

                        <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90'>
                            A BYOK (Bring Your Own Key) email microservice with
                            multi-provider support. Plug and play simplicity for
                            developers.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                            <Link href='/docs'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-primary'>
                                    Get Started
                                    <ArrowRight size={20} />
                                </motion.button>
                            </Link>

                            <Link href='https://github.com/imsks/chitthi'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-secondary'>
                                    <Github size={20} />
                                    View on GitHub
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className='py-20 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                            Why Chitthi?
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Built for developers who want simplicity without
                            sacrificing power
                        </p>
                    </motion.div>

                    <div className='features-grid'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-blue-100 rounded-lg mr-4'>
                                    <Zap className='text-blue-600' size={24} />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Multi-Provider
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Support for Breevo, SendGrid, MailerSend, and
                                SMTP. Switch providers seamlessly with
                                header-based credentials.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-green-100 rounded-lg mr-4'>
                                    <Shield
                                        className='text-green-600'
                                        size={24}
                                    />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    BYOK Security
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Bring Your Own Key approach ensures your API
                                keys stay secure. No vendor lock-in, complete
                                control.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-purple-100 rounded-lg mr-4'>
                                    <Code
                                        className='text-purple-600'
                                        size={24}
                                    />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Production Ready
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Built in Go with Redis caching, PostgreSQL
                                logging, and comprehensive error handling. Ready
                                for scale.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-cyan-100 rounded-lg mr-4'>
                                    <Mail className='text-cyan-600' size={24} />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Smart Routing
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Automatic provider detection based on
                                credentials. Intelligent fallback and load
                                balancing.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-yellow-100 rounded-lg mr-4'>
                                    <ExternalLink
                                        className='text-yellow-600'
                                        size={24}
                                    />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Docker Ready
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Containerized deployment with Docker Compose.
                                Easy setup and deployment to any environment.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-red-100 rounded-lg mr-4'>
                                    <Code className='text-red-600' size={24} />
                                </div>
                                <h3 className='text-xl font-bold'>
                                    Simple API
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Clean REST API with comprehensive documentation.
                                Get started in minutes, not hours.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-50'>
                <div className='max-w-4xl mx-auto text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}>
                        <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                            Ready to simplify your email infrastructure?
                        </h2>
                        <p className='text-xl text-gray-600 mb-8'>
                            Join developers who&apos;ve already made the switch
                            to Chitthi
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link href='/docs'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-primary'>
                                    Get Started
                                    <ArrowRight size={20} />
                                </motion.button>
                            </Link>
                            <Link href='https://github.com/imsks/chitthi'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-secondary'>
                                    <Github size={20} />
                                    Star on GitHub
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className='footer'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center'>
                        <div className='mb-4 md:mb-0'>
                            <p className='text-gray-600'>
                                Made with ❤️ by{" "}
                                <span className='text-blue-600'>Sachin</span> in
                                🇮🇳
                            </p>
                        </div>
                        <div className='flex items-center space-x-6'>
                            <Link
                                href='https://github.com/imsks'
                                className='nav-link'>
                                @imsks
                            </Link>
                            <Link
                                href='https://github.com/imsks/chitthi'
                                className='nav-link'>
                                <Github size={20} />
                            </Link>
                            <Link href='/docs' className='nav-link'>
                                Documentation
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
