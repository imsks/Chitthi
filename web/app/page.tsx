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
            <section className='py-20 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                            Built for developers
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Everything you need to send emails reliably and
                            securely
                        </p>
                    </motion.div>

                    <div className='features-grid'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4'>
                                    <Shield
                                        size={24}
                                        className='text-blue-600'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold'>
                                    BYOK Security
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Bring Your Own Key approach ensures your API
                                keys stay secure. No vendor lock-in, complete
                                control over your credentials.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4'>
                                    <Mail
                                        size={24}
                                        className='text-green-600'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold'>
                                    Multi-Provider
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Support for SendGrid, Breevo, MailerSend, and
                                SMTP. Automatic provider detection and smart
                                routing.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4'>
                                    <Zap
                                        size={24}
                                        className='text-purple-600'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold'>
                                    Production Ready
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Built with Go for performance and reliability.
                                Redis caching, PostgreSQL logging, and
                                comprehensive monitoring.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4'>
                                    <Code
                                        size={24}
                                        className='text-orange-600'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold'>
                                    Simple API
                                </h3>
                            </div>
                            <p className='text-gray-600'>
                                Clean REST API with comprehensive documentation.
                                Easy integration with any application or
                                framework.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}>
                        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                            Ready to get started?
                        </h2>
                        <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
                            Join thousands of developers who trust Chitthi for
                            their email needs
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                            <Link href='/docs'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-primary'>
                                    Explore Documentation
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
                            <Link href='/' className='nav-link'>
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
