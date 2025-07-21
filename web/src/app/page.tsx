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
import MatrixRain from "@/components/MatrixRain"
import Navigation from "@/components/Navigation"

export default function Home() {
    return (
        <div className='min-h-screen'>
            {/* Matrix Background Effect */}
            <div className='matrix-bg'>
                <MatrixRain />
            </div>

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}>
                        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6'>
                            <span className='terminal-text'>
                                Sending emails
                            </span>
                            <br />
                            <span className='text-white'>
                                shouldn&apos;t be a pain
                            </span>
                        </h1>

                        <p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto'>
                            A BYOK (Bring Your Own Key) email microservice with
                            multi-provider support.
                            <span className='text-green-400 font-mono'>
                                {" "}
                                Plug and play
                            </span>{" "}
                            simplicity for developers.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                            <Link href='/docs'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-primary flex items-center gap-2'>
                                    Explore Documentation
                                    <ArrowRight size={20} />
                                </motion.button>
                            </Link>

                            <Link href='https://github.com/imsks/chitthi'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-secondary flex items-center gap-2'>
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
                            <span className='terminal-text'>Why Chitthi?</span>
                        </h2>
                        <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
                            Built for developers who want simplicity without
                            sacrificing power
                        </p>
                    </motion.div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className='card'>
                            <div className='flex items-center mb-4'>
                                <div className='p-3 bg-green-500/20 rounded-lg mr-4'>
                                    <Zap className='text-green-400' size={24} />
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                    Multi-Provider
                                </h3>
                            </div>
                            <p className='text-gray-300'>
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
                                <div className='p-3 bg-blue-500/20 rounded-lg mr-4'>
                                    <Shield
                                        className='text-blue-400'
                                        size={24}
                                    />
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                    BYOK Security
                                </h3>
                            </div>
                            <p className='text-gray-300'>
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
                                <div className='p-3 bg-purple-500/20 rounded-lg mr-4'>
                                    <Code
                                        className='text-purple-400'
                                        size={24}
                                    />
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                    Production Ready
                                </h3>
                            </div>
                            <p className='text-gray-300'>
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
                                <div className='p-3 bg-cyan-500/20 rounded-lg mr-4'>
                                    <Mail className='text-cyan-400' size={24} />
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                    Smart Routing
                                </h3>
                            </div>
                            <p className='text-gray-300'>
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
                                <div className='p-3 bg-yellow-500/20 rounded-lg mr-4'>
                                    <ExternalLink
                                        className='text-yellow-400'
                                        size={24}
                                    />
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                    Docker Ready
                                </h3>
                            </div>
                            <p className='text-gray-300'>
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
                                <div className='p-3 bg-red-500/20 rounded-lg mr-4'>
                                    <Code className='text-red-400' size={24} />
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                    Simple API
                                </h3>
                            </div>
                            <p className='text-gray-300'>
                                Clean REST API with comprehensive documentation.
                                Get started in minutes, not hours.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}>
                        <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                            <span className='terminal-text'>
                                Ready to simplify your email infrastructure?
                            </span>
                        </h2>
                        <p className='text-xl text-gray-300 mb-8'>
                            Join developers who&apos;ve already made the switch
                            to Chitthi
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link href='/docs'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-primary flex items-center gap-2'>
                                    Get Started
                                    <ArrowRight size={20} />
                                </motion.button>
                            </Link>
                            <Link href='https://github.com/imsks/chitthi'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='btn-secondary flex items-center gap-2'>
                                    <Github size={20} />
                                    Star on GitHub
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className='footer py-8 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center'>
                        <div className='mb-4 md:mb-0'>
                            <p className='text-gray-400'>
                                Made with ❤️ by{" "}
                                <span className='text-green-400'>Sachin</span>{" "}
                                in 🇮🇳
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
