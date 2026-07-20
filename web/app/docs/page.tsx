"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Mail,
    ArrowLeft,
    Copy,
    CheckCircle,
    ExternalLink,
    Code,
    Database,
    Shield,
    Globe,
    Zap,
    Settings,
    Book,
    FileText,
    Link as LinkIcon,
    Hash,
    ChevronRight
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

export default function DocsPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const sidebarItems = [
        { id: "overview", label: "Overview", icon: Book },
        { id: "quick-start", label: "Quick Start", icon: Zap },
        // TODO: Add API Ref in future
        // { id: "api", label: "API Reference", icon: Code },
        { id: "providers", label: "Email Providers", icon: Globe },
        { id: "configuration", label: "Configuration", icon: Settings },
        { id: "deployment", label: "Deployment", icon: Database }
    ]

    const externalLinks = [
        { href: "/quick-start", label: "Integration Guide", icon: Zap }
    ]

    const [activeSection, setActiveSection] = useState("overview")

    const CodeBlock = ({
        code,
        language = "bash",
        id
    }: {
        code: string
        language?: string
        id: string
    }) => (
        <div className='relative'>
            <Card className='bg-gray-900 text-white border-0 overflow-hidden'>
                <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                            <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                            <span className='ml-4 text-sm text-gray-400'>
                                {language}
                            </span>
                        </div>
                        <Button
                            size='sm'
                            variant='ghost'
                            className='text-gray-400 hover:text-white h-8 px-2'
                            onClick={() => copyToClipboard(code, id)}>
                            {copiedCode === id ? (
                                <CheckCircle className='w-4 h-4' />
                            ) : (
                                <Copy className='w-4 h-4' />
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='pt-0'>
                    <pre className='text-sm overflow-x-auto'>
                        <code>{code}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='border-b bg-white sticky top-0 z-50'>
                <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                        <Button asChild variant='ghost' size='sm'>
                            <Link href='/'>
                                <ArrowLeft className='w-4 h-4 mr-2' />
                                Back to Home
                            </Link>
                        </Button>
                        <Separator orientation='vertical' className='h-6' />
                        <div className='flex items-center space-x-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                                <Mail className='w-4 h-4 text-white' />
                            </div>
                            <div className='flex items-center space-x-2'>
                                <span className='text-xl font-bold'>
                                    Chitthi Docs
                                </span>
                                <Badge className='bg-green-100 text-green-800 text-xs font-medium'>
                                    v1.0.0
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                        <Button asChild variant='outline' size='sm'>
                            <a
                                href='https://github.com/imsks/chitthi'
                                target='_blank'
                                rel='noopener noreferrer'>
                                GitHub
                                <ExternalLink className='w-4 h-4 ml-2' />
                            </a>
                        </Button>
                    </div>
                </div>
            </header>

            <div className='container mx-auto px-4 py-8 grid lg:grid-cols-4 gap-8'>
                {/* Sidebar */}
                <div className='lg:col-span-1'>
                    <Card className='sticky top-24'>
                        <CardHeader>
                            <CardTitle className='text-lg'>
                                Documentation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className='h-96'>
                                <nav className='space-y-1'>
                                    {sidebarItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                setActiveSection(item.id)
                                            }
                                            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                                                activeSection === item.id
                                                    ? "bg-blue-100 text-blue-700 font-medium"
                                                    : "hover:bg-gray-100 text-gray-700"
                                            }`}>
                                            <item.icon className='w-4 h-4' />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}

                                    <Separator className='my-4' />

                                    <div className='space-y-1'>
                                        <div className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                            External Links
                                        </div>
                                        {externalLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className='w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 hover:bg-gray-100 text-gray-700'>
                                                <link.icon className='w-4 h-4' />
                                                <span>{link.label}</span>
                                                <ExternalLink className='w-3 h-3 ml-auto' />
                                            </Link>
                                        ))}
                                    </div>
                                </nav>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className='lg:col-span-3'>
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}>
                        {activeSection === "overview" && (
                            <div className='space-y-8'>
                                <div>
                                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                        Chitthi Documentation
                                    </h1>
                                    <p className='text-xl text-gray-600 mb-6'>
                                        A lightweight, production-ready email
                                        microservice built in Go with BYOK
                                        approach and multi-provider support.
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
                                                        {
                                                            benefit.split(
                                                                " - "
                                                            )[0]
                                                        }
                                                    </span>
                                                    <span className='text-gray-500'>
                                                        -{" "}
                                                        {
                                                            benefit.split(
                                                                " - "
                                                            )[1]
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Architecture Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-gray-600 mb-4'>
                                            Chitthi follows a microservice
                                            architecture with clean separation
                                            of concerns:
                                        </p>
                                        <div className='space-y-2'>
                                            <div className='flex items-center space-x-2'>
                                                <Code className='w-4 h-4 text-blue-600' />
                                                <span>
                                                    <strong>
                                                        REST API Layer:
                                                    </strong>{" "}
                                                    Clean HTTP endpoints for
                                                    email operations
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Globe className='w-4 h-4 text-green-600' />
                                                <span>
                                                    <strong>
                                                        Provider Abstraction:
                                                    </strong>{" "}
                                                    Unified interface for
                                                    multiple email providers
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Database className='w-4 h-4 text-purple-600' />
                                                <span>
                                                    <strong>Data Layer:</strong>{" "}
                                                    PostgreSQL for logging,
                                                    Redis for caching
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Settings className='w-4 h-4 text-orange-600' />
                                                <span>
                                                    <strong>
                                                        Configuration:
                                                    </strong>{" "}
                                                    Environment-based
                                                    configuration management
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeSection === "quick-start" && (
                            <div className='space-y-8'>
                                <div>
                                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                        Quick Start
                                    </h1>
                                    <p className='text-xl text-gray-600 mb-8'>
                                        Get Chitthi up and running in minutes
                                        with Docker and Go.
                                    </p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Prerequisites</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-2'>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-5 h-5 text-green-600' />
                                                <span>
                                                    Docker & Docker Compose
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-5 h-5 text-green-600' />
                                                <span>
                                                    Go 1.24.3+ (for development)
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-5 h-5 text-green-600' />
                                                <span>Git</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                            <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                                1
                                            </span>
                                            Clone Repository
                                        </h3>
                                        <CodeBlock
                                            id='clone'
                                            code={`git clone https://github.com/imsks/chitthi.git
cd chitthi`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                            <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                                2
                                            </span>
                                            Start Infrastructure
                                        </h3>
                                        <CodeBlock
                                            id='infrastructure'
                                            code={`# Start Redis and PostgreSQL
docker compose up redis db -d`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                            <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                                3
                                            </span>
                                            Run the Service
                                        </h3>
                                        <CodeBlock
                                            id='run-service'
                                            code={`# Development with hot reload
air

# Or run directly
go run cmd/main.go`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                            <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                                4
                                            </span>
                                            Test the API
                                        </h3>
                                        <CodeBlock
                                            id='test-api'
                                            code={`curl -X POST http://localhost:8080/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-SendGrid-API-Key: your-sendgrid-key" \\
  -d '{
    "from_email": "verified@yourdomain.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'`}
                                        />
                                    </div>
                                </div>

                                <Card className='bg-green-50 border-green-200'>
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start space-x-3'>
                                            <CheckCircle className='w-6 h-6 text-green-600 mt-0.5' />
                                            <div>
                                                <h4 className='font-semibold text-green-900 mb-1'>
                                                    Success!
                                                </h4>
                                                <p className='text-green-800'>
                                                    Your Chitthi email service
                                                    is now running on{" "}
                                                    <code className='bg-green-200 px-1 rounded'>
                                                        https://YOUR_APP.up.railway.app
                                                    </code>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeSection === "api" && (
                            <div className='space-y-8'>
                                <div>
                                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                        API Reference
                                    </h1>
                                    <p className='text-xl text-gray-600 mb-8'>
                                        Complete reference for all Chitthi API
                                        endpoints.
                                    </p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Base URL</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <code className='bg-gray-100 px-3 py-1 rounded text-sm'>
                                            https://YOUR_APP.up.railway.app
                                        </code>
                                    </CardContent>
                                </Card>

                                <div className='space-y-8'>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='flex items-center'>
                                                <Badge className='mr-3 bg-green-100 text-green-800'>
                                                    POST
                                                </Badge>
                                                Send Email
                                            </CardTitle>
                                            <CardDescription>
                                                Send an email via any configured
                                                provider
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className='space-y-4'>
                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Endpoint
                                                </h4>
                                                <code className='bg-gray-100 px-3 py-1 rounded text-sm'>
                                                    POST /send-email
                                                </code>
                                            </div>

                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Headers
                                                </h4>
                                                <div className='bg-gray-50 p-4 rounded-lg'>
                                                    <div className='space-y-2 text-sm'>
                                                        <div>
                                                            <code>
                                                                Content-Type:
                                                                application/json
                                                            </code>
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                Chitthi API key:
                                                            </strong>
                                                            <div className='ml-4 mt-1 space-y-1'>
                                                                <code>Authorization: Bearer {'<chitthi_key>'}</code>
                                                                <div>
                                                                    or{" "}
                                                                    <code>X-Chitthi-API-Key: {'<chitthi_key>'}</code>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='pt-2'>
                                                            <strong>Or explicit provider:</strong>
                                                        </div>
                                                        <div className='ml-4 space-y-1'>
                                                            <code>X-SendGrid-API-Key</code>, <code>X-Breevo-API-Key</code>,{" "}
                                                            <code>X-MailerSend-API-Key</code>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Request Body
                                                </h4>
                                                <CodeBlock
                                                    id='send-email-body'
                                                    language='json'
                                                    code={`{
  "from_email": "sender@example.com",
  "from_name": "Sender Name",
  "to_email": "recipient@example.com", 
  "to_name": "Recipient Name",
  "subject": "Email Subject",
  "html_content": "<h1>Hello World!</h1>"
}`}
                                                />
                                            </div>

                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Response
                                                </h4>
                                                <CodeBlock
                                                    id='send-email-response'
                                                    language='json'
                                                    code={`{
  "status": true,
  "message": "Email sent successfully",
  "data": {
    "sent_to": "recipient@example.com",
    "sent_from": "sender@example.com", 
    "subject": "Email Subject",
    "provider": "sendgrid"
  }
}`}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeSection === "providers" && (
                            <div className='space-y-8'>
                                <div>
                                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                        Email Providers
                                    </h1>
                                    <p className='text-xl text-gray-600 mb-8'>
                                        Chitthi supports multiple email
                                        providers with automatic detection and
                                        fallback mechanisms.
                                    </p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Supported Providers
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='grid md:grid-cols-2 gap-4'>
                                            {[
                                                {
                                                    name: "Chitthi API key",
                                                    header: "Authorization: Bearer or X-Chitthi-API-Key",
                                                    desc: "Dashboard-stored provider + verified sender for unified POST /send-email"
                                                },
                                                {
                                                    name: "SendGrid",
                                                    header: "X-SendGrid-API-Key",
                                                    desc: "SendGrid v3 API"
                                                },
                                                {
                                                    name: "Breevo",
                                                    header: "X-Breevo-API-Key",
                                                    desc: "Breevo Email API"
                                                },
                                                {
                                                    name: "MailerSend",
                                                    header: "X-MailerSend-API-Key",
                                                    desc: "MailerSend API"
                                                }
                                            ].map((provider, index) => (
                                                <div
                                                    key={index}
                                                    className='p-4 bg-gray-50 rounded-lg'>
                                                    <h4 className='font-semibold text-lg mb-2'>
                                                        {provider.name}
                                                    </h4>
                                                    <div className='text-sm text-gray-600 mb-2'>
                                                        <strong>Header:</strong>{" "}
                                                        <code className='bg-white px-2 py-1 rounded'>
                                                            {provider.header}
                                                        </code>
                                                    </div>
                                                    <p className='text-gray-600'>
                                                        {provider.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Tabs defaultValue='sendgrid' className='w-full'>
                                    <TabsList className='grid w-full grid-cols-3'>
                                        <TabsTrigger value='sendgrid'>
                                            SendGrid
                                        </TabsTrigger>
                                        <TabsTrigger value='breevo'>
                                            Breevo
                                        </TabsTrigger>
                                        <TabsTrigger value='mailersend'>
                                            MailerSend
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value='sendgrid'
                                        className='space-y-4'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    SendGrid Configuration
                                                </CardTitle>
                                                <CardDescription>
                                                    SendGrid v3 API integration
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='space-y-4'>
                                                    <div>
                                                        <h4 className='font-semibold mb-2'>
                                                            Required Headers
                                                        </h4>
                                                        <div className='text-sm'>
                                                            <code>
                                                                X-SendGrid-API-Key:
                                                                your-sendgrid-api-key
                                                            </code>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold mb-2'>
                                                            Example
                                                        </h4>
                                                        <CodeBlock
                                                            id='sendgrid-example'
                                                            code={`curl -X POST https://YOUR_APP.up.railway.app/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-SendGrid-API-Key: your-sendgrid-api-key" \\
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'`}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent
                                        value='breevo'
                                        className='space-y-4'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    Breevo Configuration
                                                </CardTitle>
                                                <CardDescription>
                                                    Breevo Email API integration
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='space-y-4'>
                                                    <div>
                                                        <h4 className='font-semibold mb-2'>
                                                            Required Headers
                                                        </h4>
                                                        <div className='text-sm'>
                                                            <code>
                                                                X-Breevo-API-Key:
                                                                your-breevo-api-key
                                                            </code>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold mb-2'>
                                                            Example
                                                        </h4>
                                                        <CodeBlock
                                                            id='breevo-example'
                                                            code={`curl -X POST https://YOUR_APP.up.railway.app/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-Breevo-API-Key: your-breevo-api-key" \\
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'`}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent
                                        value='mailersend'
                                        className='space-y-4'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    MailerSend Configuration
                                                </CardTitle>
                                                <CardDescription>
                                                    MailerSend API integration
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='space-y-4'>
                                                    <div>
                                                        <h4 className='font-semibold mb-2'>
                                                            Required Headers
                                                        </h4>
                                                        <div className='text-sm'>
                                                            <code>
                                                                X-MailerSend-API-Key:
                                                                your-mailersend-api-key
                                                            </code>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold mb-2'>
                                                            Example
                                                        </h4>
                                                        <CodeBlock
                                                            id='mailersend-example'
                                                            code={`curl -X POST https://YOUR_APP.up.railway.app/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-MailerSend-API-Key: your-mailersend-api-key" \\
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'`}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                                <Card className='bg-blue-50 border-blue-200'>
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start space-x-3'>
                                            <Zap className='w-6 h-6 text-blue-600 mt-0.5' />
                                            <div>
                                                <h4 className='font-semibold text-blue-900 mb-1'>
                                                    Provider Priority
                                                </h4>
                                                <div className='text-blue-800 space-y-1'>
                                                    <div>
                                                        1.{" "}
                                                        <strong>
                                                            Header-based
                                                            providers
                                                        </strong>{" "}
                                                        (highest priority)
                                                    </div>
                                                    <div>
                                                        2.{" "}
                                                        <strong>
                                                            Request body API
                                                            keys
                                                        </strong>{" "}
                                                        (legacy support)
                                                    </div>
                                                    <div>
                                                        3.{" "}
                                                        <strong>
                                                            Environment-configured
                                                            providers
                                                        </strong>{" "}
                                                        (fallback)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeSection === "configuration" && (
                            <div className='space-y-8'>
                                <div>
                                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                        Configuration
                                    </h1>
                                    <p className='text-xl text-gray-600 mb-8'>
                                        Configure Chitthi for your environment
                                        with environment variables and Docker
                                        setup.
                                    </p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Environment Variables
                                        </CardTitle>
                                        <CardDescription>
                                            Create a <code>.env</code> file in
                                            the root directory
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CodeBlock
                                            id='env-variables'
                                            language='env'
                                            code={`# Server Configuration
PORT=8080

# Database Configuration  
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Provider Configuration (Optional - for fallback)
BREEVO_API_KEY=your_breevo_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_REGION=global
MAILERSEND_API_KEY=your_mailersend_api_key`}
                                        />
                                    </CardContent>
                                </Card>

                                <div className='grid md:grid-cols-2 gap-6'>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='flex items-center'>
                                                <Database className='w-5 h-5 mr-2 text-blue-600' />
                                                Database Setup
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='space-y-3'>
                                                <div>
                                                    <h4 className='font-semibold mb-2'>
                                                        PostgreSQL
                                                    </h4>
                                                    <p className='text-sm text-gray-600 mb-2'>
                                                        Stores users, providers,
                                                        unified API keys, and daily
                                                        metrics
                                                    </p>
                                                    <CodeBlock
                                                        id='postgres-setup'
                                                        code={`docker run -d \\
  --name chitthi-postgres \\
  -e POSTGRES_PASSWORD=postgres \\
  -e POSTGRES_DB=chitthi \\
  -p 5432:5432 \\
  postgres:13`}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='flex items-center'>
                                                <Zap className='w-5 h-5 mr-2 text-red-600' />
                                                Redis Setup
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='space-y-3'>
                                                <div>
                                                    <h4 className='font-semibold mb-2'>
                                                        Redis Cache
                                                    </h4>
                                                    <p className='text-sm text-gray-600 mb-2'>
                                                        Used for performance
                                                        optimization
                                                    </p>
                                                    <CodeBlock
                                                        id='redis-setup'
                                                        code={`docker run -d \\
  --name chitthi-redis \\
  -p 6379:6379 \\
  redis:7-alpine`}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Database Migrations
                                        </CardTitle>
                                        <CardDescription>
                                            Run database migrations to set up
                                            the required tables
                                        </CardDescription>
                                    </CardHeader>
                                        <CardContent>
                                        <div className='space-y-4'>
                                            <p className='text-sm text-gray-600'>
                                                Install the{" "}
                                                <a
                                                    href='https://github.com/golang-migrate/migrate'
                                                    className='text-blue-600 underline'
                                                    target='_blank'
                                                    rel='noopener noreferrer'>
                                                    golang-migrate
                                                </a>{" "}
                                                CLI. Run from the repository root
                                                (not from{" "}
                                                <code className='bg-gray-100 px-1 rounded'>
                                                    web/
                                                </code>
                                                ).
                                            </p>
                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Run Migrations
                                                </h4>
                                                <CodeBlock
                                                    id='run-migrations'
                                                    code={`migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up`}
                                                />
                                            </div>

                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Rollback One Step
                                                </h4>
                                                <CodeBlock
                                                    id='rollback-migrations'
                                                    code={`migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" down 1`}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeSection === "deployment" && (
                            <div className='space-y-8'>
                                <div>
                                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                        Deployment
                                    </h1>
                                    <p className='text-xl text-gray-600 mb-8'>
                                        Deploy Chitthi to production with Docker
                                        and best practices.
                                    </p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center'>
                                            <Database className='w-5 h-5 mr-2 text-blue-600' />
                                            Docker Deployment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-4'>
                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Start All Services
                                                </h4>
                                                <CodeBlock
                                                    id='docker-start'
                                                    code={`# Start all services
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f`}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center'>
                                            <Settings className='w-5 h-5 mr-2 text-green-600' />
                                            Production Deployment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='space-y-4'>
                                            <div>
                                                <h4 className='font-semibold mb-2'>
                                                    Build Production Image
                                                </h4>
                                                <CodeBlock
                                                    id='build-production'
                                                    code={`# Build production image
docker build -t chitthi-app .

# Run with environment variables
docker run -p 8080:8080 \\
  -e DATABASE_URL="postgres://..." \\
  -e REDIS_URL="redis://..." \\
  chitthi-app`}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Production Checklist
                                        </CardTitle>
                                        <CardDescription>
                                            Essential steps before deploying to
                                            production
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='grid md:grid-cols-2 gap-4'>
                                            {[
                                                "Set APP_ENV=production",
                                                "Configure database URLs",
                                                "Set API keys for email providers",
                                                "Set up Redis for caching",
                                                "Configure logging levels",
                                                "Set up monitoring and alerting",
                                                "Enable HTTPS/SSL",
                                                "Set up load balancing"
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className='flex items-center space-x-2'>
                                                    <CheckCircle className='w-4 h-4 text-green-600' />
                                                    <span className='text-sm'>
                                                        {item}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className='bg-yellow-50 border-yellow-200'>
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start space-x-3'>
                                            <Settings className='w-6 h-6 text-yellow-600 mt-0.5' />
                                            <div>
                                                <h4 className='font-semibold text-yellow-900 mb-1'>
                                                    Production Tips
                                                </h4>
                                                <div className='text-yellow-800 space-y-1 text-sm'>
                                                    <div>
                                                        • Use environment
                                                        variables for all
                                                        sensitive configuration
                                                    </div>
                                                    <div>
                                                        • Enable connection
                                                        pooling for database
                                                        connections
                                                    </div>
                                                    <div>
                                                        • Set up proper logging
                                                        and monitoring
                                                    </div>
                                                    <div>
                                                        • Use reverse proxy
                                                        (nginx) for better
                                                        performance
                                                    </div>
                                                    <div>
                                                        • Implement rate
                                                        limiting to prevent
                                                        abuse
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
