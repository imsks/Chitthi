"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle,
    Code,
    Database,
    Shield,
    Globe,
    Settings,
    Cloud,
    Server
} from "lucide-react"
import Link from "next/link"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function DocsOverviewPage() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                        Chitthi Documentation
                    </h1>
                    <p className='text-xl text-gray-600 mb-6'>
                        A lightweight, production-ready email microservice built
                        in Go with BYOK approach and multi-provider support.
                    </p>

                    <div className='flex flex-wrap gap-2 mb-8'>
                        <Badge className='bg-blue-100 text-blue-800'>
                            Go 1.24.3
                        </Badge>
                        <Badge className='bg-green-100 text-green-800'>
                            MIT License
                        </Badge>
                        <Badge className='bg-purple-100 text-purple-800'>
                            Docker Ready
                        </Badge>
                        <Badge className='bg-yellow-100 text-yellow-800'>
                            Production Ready
                        </Badge>
                    </div>
                </div>

                {/* Two Modes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Two Ways to Use Chitthi</CardTitle>
                        <CardDescription>
                            Pick the integration that matches your needs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-6'>
                            <Link
                                href='/docs/cloud'
                                className='p-5 rounded-lg border-2 border-purple-200 bg-purple-50 hover:shadow-md transition-shadow block'>
                                <div className='flex items-center space-x-3 mb-3'>
                                    <Cloud className='w-6 h-6 text-purple-600' />
                                    <h3 className='font-semibold text-lg'>
                                        Cloud (Hosted)
                                    </h3>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                    Sign up on the Dashboard, add your provider
                                    key, generate a Chitthi API key, and start
                                    sending. No servers needed.
                                </p>
                                <Badge className='bg-purple-100 text-purple-800 text-xs'>
                                    Fastest setup · ~5 min
                                </Badge>
                            </Link>
                            <Link
                                href='/docs/self-host'
                                className='p-5 rounded-lg border-2 border-blue-200 bg-blue-50 hover:shadow-md transition-shadow block'>
                                <div className='flex items-center space-x-3 mb-3'>
                                    <Server className='w-6 h-6 text-blue-600' />
                                    <h3 className='font-semibold text-lg'>
                                        Self-Host
                                    </h3>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                    Clone the repo, run with Docker Compose, and
                                    own your entire email infrastructure. Full
                                    data control.
                                </p>
                                <Badge className='bg-blue-100 text-blue-800 text-xs'>
                                    Full control · Open Source
                                </Badge>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Shield className='w-5 h-5 mr-2 text-green-600' />
                            Key Benefits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-4'>
                            {[
                                "🔐 BYOK Security - Your keys stay secure",
                                "🔄 Multi-Provider Support - 4+ email providers",
                                "⚡ Header-based Credentials - Secure management",
                                "🧠 Smart Routing - Automatic provider detection",
                                "📊 PostgreSQL Logging - Email tracking",
                                "🚀 Redis Caching - Performance optimization"
                            ].map((benefit, index) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-2'>
                                    <CheckCircle className='w-5 h-5 text-green-600' />
                                    <span className='text-gray-700'>
                                        {benefit.split(" - ")[0]}
                                    </span>
                                    <span className='text-gray-500'>
                                        - {benefit.split(" - ")[1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Architecture Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-gray-600 mb-4'>
                            Chitthi follows a microservice architecture with
                            clean separation of concerns:
                        </p>
                        <div className='space-y-2'>
                            <div className='flex items-center space-x-2'>
                                <Code className='w-4 h-4 text-blue-600' />
                                <span>
                                    <strong>REST API Layer:</strong> Clean HTTP
                                    endpoints for email operations
                                </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Globe className='w-4 h-4 text-green-600' />
                                <span>
                                    <strong>Provider Abstraction:</strong>{" "}
                                    Unified interface for multiple email
                                    providers
                                </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Database className='w-4 h-4 text-purple-600' />
                                <span>
                                    <strong>Data Layer:</strong> PostgreSQL for
                                    logging, Redis for caching
                                </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Settings className='w-4 h-4 text-orange-600' />
                                <span>
                                    <strong>Configuration:</strong>{" "}
                                    Environment-based configuration management
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DocsShell>
    )
}
