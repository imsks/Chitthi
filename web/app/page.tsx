"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight,
    Mail,
    Shield,
    Zap,
    Code,
    Globe,
    Database,
    Dock as Docker,
    CheckCircle,
    Star,
    GitBranch,
    Users,
    TrendingUp
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export default function Home() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
            {/* Header */}
            <header className='border-b bg-white/80 backdrop-blur-md sticky top-0 z-50'>
                <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
                    <motion.div
                        className='flex items-center space-x-2'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}>
                        <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                            <Mail className='w-5 h-5 text-white' />
                        </div>
                        <div className='flex items-center space-x-2'>
                            <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                Chitthi
                            </span>
                            <Badge className='bg-green-100 text-green-800 text-xs font-medium'>
                                v1.0.0
                            </Badge>
                        </div>
                    </motion.div>

                    <motion.nav
                        className='hidden md:flex items-center space-x-8'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}>
                        <Link
                            href='#features'
                            className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Features
                        </Link>
                        <Link
                            href='/quick-start'
                            className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Quick Start
                        </Link>
                        <Link
                            href='/docs'
                            className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Docs
                        </Link>
                        <Button asChild className='bg-blue-600 hover:bg-blue-700'>
                            <Link href='/login'>Sign in with Google</Link>
                        </Button>
                        <Button
                            asChild
                            variant='outline'
                            className='border-blue-200 hover:bg-blue-50'>
                            <a
                                href='https://github.com/imsks/chitthi'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <GitBranch className='w-4 h-4 mr-2' />
                                GitHub
                            </a>
                        </Button>
                    </motion.nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className='relative overflow-hidden py-20 lg:py-32'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5' />
                <div className='container mx-auto px-4 text-center relative'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}>
                        <Badge className='mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200'>
                            <Zap className='w-3 h-3 mr-1' />
                            Production Ready
                        </Badge>

                        <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
                            <span className='block'>Send emails without limits.</span>
                            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            Self-hosted. Dev-friendly.
                            </span>
                        </h1>

                        <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
                            A modern email microservice built in Go with BYOK
                            approach and multi-provider support. Send emails
                            securely through SendGrid, Breevo, MailerSend, or
                            SMTP.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                            <Button
                                asChild
                                size='lg'
                                className='bg-blue-600 hover:bg-blue-700 text-lg px-8'>
                                <Link href='/login'>
                                    Sign in with Google
                                    <ArrowRight className='ml-2 w-5 h-5' />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant='outline'
                                size='lg'
                                className='text-lg px-8 border-blue-200 hover:bg-blue-50'>
                                <Link href='/quick-start'>
                                    Quick Start
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className='mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}>
                        {[
                            {
                                icon: Shield,
                                label: "BYOK Security",
                                desc: "Bring Your Own Key"
                            },
                            {
                                icon: Globe,
                                label: "4+ Providers",
                                desc: "Multi-provider support"
                            },
                            {
                                icon: Zap,
                                label: "Production Ready",
                                desc: "Redis & PostgreSQL"
                            },
                            {
                                icon: Docker,
                                label: "Docker Ready",
                                desc: "Containerized deployment"
                            }
                        ].map((stat, index) => (
                            <div key={index} className='text-center'>
                                <stat.icon className='w-8 h-8 mx-auto mb-2 text-blue-600' />
                                <div className='font-semibold text-gray-900'>
                                    {stat.label}
                                </div>
                                <div className='text-sm text-gray-600'>
                                    {stat.desc}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id='features' className='py-20 bg-white'>
                <div className='container mx-auto px-4'>
                    <motion.div className='text-center mb-16' {...fadeInUp}>
                        <Badge className='mb-4 bg-purple-100 text-purple-800'>
                            Features
                        </Badge>
                        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
                            Everything you need to send emails
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Powerful features designed for developers who want
                            simplicity without sacrificing control
                        </p>
                    </motion.div>

                    <motion.div
                        className='grid lg:grid-cols-3 gap-8'
                        variants={staggerChildren}
                        initial='initial'
                        whileInView='animate'
                        viewport={{ once: true }}>
                        {[
                            {
                                icon: Shield,
                                title: "BYOK Security",
                                description:
                                    "Bring Your Own Key approach ensures your API keys stay secure with header-based credential management.",
                                color: "text-green-600",
                                bgColor: "bg-green-50"
                            },
                            {
                                icon: Globe,
                                title: "Multi-Provider Support",
                                description:
                                    "Support for Breevo, SendGrid, MailerSend, and SMTP with automatic provider detection.",
                                color: "text-blue-600",
                                bgColor: "bg-blue-50"
                            },
                            {
                                icon: Zap,
                                title: "Smart Routing(Coming soon)",
                                description:
                                    "Intelligent provider detection based on credentials with fallback mechanisms.",
                                color: "text-yellow-600",
                                bgColor: "bg-yellow-50"
                            },
                            {
                                icon: Database,
                                title: "PostgreSQL Logging",
                                description:
                                    "Comprehensive email tracking and analytics with detailed logging capabilities.",
                                color: "text-purple-600",
                                bgColor: "bg-purple-50"
                            },
                            {
                                icon: TrendingUp,
                                title: "Redis Caching(Coming soon)",
                                description:
                                    "Performance optimization with Redis caching for improved response times.",
                                color: "text-red-600",
                                bgColor: "bg-red-50"
                            },
                            {
                                icon: Docker,
                                title: "Production Ready",
                                description:
                                    "Docker containerization with error handling, monitoring, and logging built-in.",
                                color: "text-indigo-600",
                                bgColor: "bg-indigo-50"
                            }
                        ].map((feature, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className='h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm'>
                                    <CardHeader>
                                        <div
                                            className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                                            <feature.icon
                                                className={`w-6 h-6 ${feature.color}`}
                                            />
                                        </div>
                                        <CardTitle className='text-xl font-semibold'>
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className='text-gray-600 leading-relaxed'>
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Quick Start Section */}
            <section id='quickstart' className='py-20 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <motion.div className='text-center mb-16' {...fadeInUp}>
                        <Badge className='mb-4 bg-blue-100 text-blue-800'>
                            Quick Start
                        </Badge>
                        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
                            Get started in minutes
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Simple setup process to get your email service
                            running
                        </p>
                    </motion.div>

                    <div className='max-w-4xl mx-auto'>
                        <motion.div
                            className='grid lg:grid-cols-2 gap-8 items-start'
                            variants={staggerChildren}
                            initial='initial'
                            whileInView='animate'
                            viewport={{ once: true }}>
                            {/* Steps */}
                            <motion.div variants={fadeInUp}>
                                <h3 className='text-2xl font-bold mb-6'>
                                    Installation Steps
                                </h3>
                                <div className='space-y-4'>
                                    {[
                                        {
                                            step: "1",
                                            title: "Clone Repository",
                                            desc: "git clone https://github.com/imsks/chitthi.git"
                                        },
                                        {
                                            step: "2",
                                            title: "Start Infrastructure",
                                            desc: "docker compose up redis db -d"
                                        },
                                        {
                                            step: "3",
                                            title: "Run Service",
                                            desc: "air (or go run cmd/main.go)"
                                        },
                                        {
                                            step: "4",
                                            title: "Test API",
                                            desc: "Send your first email via REST API"
                                        }
                                    ].map((item) => (
                                        <div
                                            key={item.step}
                                            className='flex items-start space-x-4'>
                                            <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm'>
                                                {item.step}
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-900'>
                                                    {item.title}
                                                </div>
                                                <div className='text-gray-600 text-sm font-mono'>
                                                    {item.desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Code Example */}
                            <motion.div variants={fadeInUp}>
                                <Card className='bg-gray-900 text-white border-0 overflow-hidden'>
                                    <CardHeader className='pb-4'>
                                        <div className='flex items-center space-x-2'>
                                            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                            <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                            <span className='ml-4 text-sm text-gray-400'>
                                                Send Email API
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='pt-0'>
                                        <pre className='text-sm overflow-x-auto'>
                                            <code>{`curl -X POST https://localhost:8000/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-SMTP-Host: smtp.gmail.com" \\
  -H "X-SMTP-Username: your-email@gmail.com" \\
  -H "X-SMTP-Password: your-app-password" \\
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com", 
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'`}</code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contribute Section */}
            <section id='contribute' className='py-20 bg-white'>
                <div className='container mx-auto px-4'>
                    <motion.div className='text-center mb-16' {...fadeInUp}>
                        <Badge className='mb-4 bg-green-100 text-green-800'>
                            Join the Community
                        </Badge>
                        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
                            Contribute to Chitthi
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Help us build the best open-source email service.
                            Every contribution makes a difference!
                        </p>
                    </motion.div>

                    <motion.div
                        className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'
                        variants={staggerChildren}
                        initial='initial'
                        whileInView='animate'
                        viewport={{ once: true }}>
                        {[
                            {
                                icon: Code,
                                title: "Code Contributions",
                                description:
                                    "Submit pull requests for bug fixes, new features, or improvements to the codebase.",
                                link: "https://github.com/imsks/chitthi/pulls",
                                linkText: "Create PR",
                                color: "text-blue-600",
                                bgColor: "bg-blue-50"
                            },
                            {
                                icon: GitBranch,
                                title: "Report Issues",
                                description:
                                    "Found a bug or have a feature request? Let us know by opening an issue.",
                                link: "https://github.com/imsks/chitthi/issues",
                                linkText: "Open Issue",
                                color: "text-red-600",
                                bgColor: "bg-red-50"
                            },
                            {
                                icon: Users,
                                title: "Join Discussions",
                                description:
                                    "Share ideas, ask questions, and engage with the community in our discussions.",
                                link: "https://github.com/imsks/chitthi/discussions",
                                linkText: "Start Discussion",
                                color: "text-purple-600",
                                bgColor: "bg-purple-50"
                            },
                            {
                                icon: Star,
                                title: "Star & Share",
                                description:
                                    "Show your support by starring the repo and sharing Chitthi with others.",
                                link: "https://github.com/imsks/chitthi",
                                linkText: "Star on GitHub",
                                color: "text-yellow-600",
                                bgColor: "bg-yellow-50"
                            }
                        ].map((item, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className='h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm group'>
                                    <CardHeader className='pb-4'>
                                        <div
                                            className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <item.icon
                                                className={`w-6 h-6 ${item.color}`}
                                            />
                                        </div>
                                        <CardTitle className='text-lg font-semibold'>
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <CardDescription className='text-gray-600 text-sm leading-relaxed'>
                                            {item.description}
                                        </CardDescription>
                                        <a
                                            href={item.link}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className={`inline-flex items-center text-sm font-medium ${item.color} hover:underline`}>
                                            {item.linkText}
                                            <ArrowRight className='ml-1 w-4 h-4' />
                                        </a>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className='mt-12 text-center'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}>
                        <p className='text-gray-600 mb-4'>
                            Check out our contributing guidelines to get started
                        </p>
                        <Button
                            asChild
                            variant='outline'
                            className='border-gray-300 hover:bg-gray-50'>
                            <a
                                href='https://github.com/imsks/chitthi/blob/production/CONTRIBUTING.md'
                                target='_blank'
                                rel='noopener noreferrer'>
                                View Contributing Guide
                                <ArrowRight className='ml-2 w-4 h-4' />
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                <div className='container mx-auto px-4 text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}>
                        <h2 className='text-3xl lg:text-4xl font-bold mb-6'>
                            Ready to start sending emails?
                        </h2>
                        <p className='text-xl mb-8 text-blue-100 max-w-2xl mx-auto'>
                            Join developers who trust Chitthi for their email
                            infrastructure
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                            <Button
                                asChild
                                size='lg'
                                className='bg-white text-blue-600 hover:bg-gray-100 text-lg px-8'>
                                <Link href='/docs'>
                                    View Documentation
                                    <ArrowRight className='ml-2 w-5 h-5' />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant='outline'
                                size='lg'
                                className='bg-white text-blue-600 hover:bg-gray-100 text-lg px-8'
                                >
                                <a
                                    href='https://github.com/imsks/chitthi'
                                    target='_blank'
                                    rel='noopener noreferrer'>
                                    <Star className='mr-2 w-5 h-5' />
                                    Star on GitHub
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-gray-900 text-white py-12'>
                <div className='container mx-auto px-4'>
                    <div className='grid lg:grid-cols-4 gap-8'>
                        <div className='lg:col-span-2'>
                            <div className='flex items-center space-x-2 mb-4'>
                                <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                                    <Mail className='w-5 h-5 text-white' />
                                </div>
                                <span className='text-xl font-bold'>
                                    Chitthi
                                </span>
                            </div>
                            <p className='text-gray-400 mb-4 max-w-md'>
                                A lightweight, production-ready email
                                microservice built with Go. Empowering
                                developers with simple email solutions.
                            </p>
                            <div className='text-sm text-gray-500'>
                                Built with ❤️ by <a href="https://github.com/imsks" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Sachin</a> in 🇮🇳
                            </div>
                        </div>

                        <div>
                            <h4 className='font-semibold mb-4'>Resources</h4>
                            <div className='space-y-2 text-sm'>
                                <Link
                                    href='/docs'
                                    className='text-gray-400 hover:text-white block transition-colors'>
                                    Documentation
                                </Link>
                                <a
                                    href='https://github.com/imsks/chitthi'
                                    className='text-gray-400 hover:text-white block transition-colors'>
                                    GitHub
                                </a>
                                <a
                                    href='https://github.com/imsks/chitthi/issues'
                                    className='text-gray-400 hover:text-white block transition-colors'>
                                    Issues
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className='font-semibold mb-4'>Support</h4>
                            <div className='space-y-2 text-sm'>
                                <a
                                    href='mailto:sachinkshuklaoo7@email.com'
                                    className='text-gray-400 hover:text-white block transition-colors'>
                                    Contact
                                </a>
                                <a
                                    href='https://github.com/imsks/chitthi/discussions'
                                    className='text-gray-400 hover:text-white block transition-colors'>
                                    Discussions
                                </a>
                                <Link
                                    href='/quick-start'
                                    className='text-gray-400 hover:text-white block transition-colors'>
                                    Getting Started
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500'>
                        © {new Date().getFullYear()} Chitthi. Licensed under the MIT License.
                    </div>
                </div>
            </footer>
        </div>
    )
}
