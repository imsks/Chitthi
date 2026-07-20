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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Mail,
    ArrowLeft,
    Copy,
    CheckCircle,
    Code,
    Database,
    Globe,
    Zap,
    Settings,
    Download,
    Terminal,
    Server,
    FileText,
    ChevronRight,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

export default function QuickStartPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

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
                                    Quick Start
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

            <div className='container mx-auto px-4 py-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}>
                    {/* Introduction */}
                    <div className='text-center mb-12'>
                        <Badge className='mb-4 bg-blue-100 text-blue-800'>
                            Choose Your Integration Method
                        </Badge>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                            How would you like to integrate Chitthi?
                        </h1>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                            Select the integration method that best fits your
                            needs. You can either set up the project locally
                            with full control, or use our hosted APIs for quick
                            integration.
                        </p>
                    </div>

                    {/* Integration Options */}
                    <div className='max-w-4xl mx-auto mb-12'>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}>
                            <Card
                                className='h-full transition-all duration-300 hover:shadow-lg'>
                                <CardHeader>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                            <Terminal className='w-6 h-6 text-blue-600' />
                                        </div>
                                        <div>
                                            <CardTitle className='text-xl'>
                                                Local Setup
                                            </CardTitle>
                                            <CardDescription>
                                                Full control with local
                                                infrastructure
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-3'>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Complete control over
                                                your infrastructure
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Setup Redis and
                                                PostgreSQL yourself
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Customize as per your
                                                needs
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Perfect for production
                                                deployments
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className='space-y-8'>
                            <div className='text-center'>
                                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                                    Local Setup Guide
                                </h2>
                                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                                    Set up Chitthi locally with full
                                    control over your infrastructure
                                </p>
                            </div>

                            {/* Prerequisites */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center'>
                                        <Settings className='w-5 h-5 mr-2 text-blue-600' />
                                        Prerequisites
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid md:grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-4 h-4 text-green-600' />
                                                <span>
                                                    Docker & Docker
                                                    Compose
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-4 h-4 text-green-600' />
                                                <span>
                                                    Go 1.24.3+ (for
                                                    development)
                                                </span>
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-4 h-4 text-green-600' />
                                                <span>Git</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <CheckCircle className='w-4 h-4 text-green-600' />
                                                <span>
                                                    PostgreSQL & Redis
                                                    (or Docker)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Steps */}
                            <div className='space-y-6'>
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            1
                                        </span>
                                        Clone Repository
                                    </h3>
                                    <CodeBlock
                                        id='clone-repo'
                                        code={`git clone https://github.com/imsks/chitthi.git
cd chitthi`}
                                    />
                                </div>

                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            2
                                        </span>
                                        Environment Configuration
                                    </h3>
                                    <div className='space-y-4'>
                                        <p className='text-gray-600'>
                                            Create a{" "}
                                            <code className='bg-gray-100 px-2 py-1 rounded'>
                                                .env
                                            </code>{" "}
                                            file in the root directory:
                                        </p>
                                        <CodeBlock
                                            id='env-config'
                                            language='env'
                                            code={`PORT=8080

# Redis config
REDIS_URL=redis://redis:6379

# Postgres config
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chitthi
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable

# Platform API Keys
BREEVO_API_KEY=
SENDGRID_API_KEY=
MAILERSEND_API_KEY=

# Message Queue
RABBITMQ_URL=amqp://guest:guest@localhost:5672/`}
                                        />
                                        <div className='flex items-center space-x-2'>
                                            <Download className='w-4 h-4 text-blue-600' />
                                            <Button
                                                variant='link'
                                                className='p-0 h-auto text-blue-600'
                                                onClick={() =>
                                                    copyToClipboard(
                                                        `PORT=8080

# Redis config
REDIS_URL=redis://redis:6379

# Postgres config
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chitthi
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable

# Platform API Keys
BREEVO_API_KEY=
SENDGRID_API_KEY=
MAILERSEND_API_KEY=

# Message Queue
RABBITMQ_URL=amqp://guest:guest@localhost:5672/`,
                                                        "env-download"
                                                    )
                                                }>
                                                Download .env.example
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            3
                                        </span>
                                        Start Infrastructure
                                    </h3>
                                    <CodeBlock
                                        id='start-infra'
                                        code={`# Start Redis and PostgreSQL
docker compose up redis db -d`}
                                    />
                                </div>

                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            4
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
                                            5
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
                                                Your local Chitthi
                                                service is now running
                                                on{" "}
                                                <code className='bg-green-200 px-1 rounded'>
                                                    http://localhost:8080
                                                </code>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Navigation */}
                        <div className='flex justify-center space-x-4 mt-12'>
                            <Button
                                asChild
                                variant='outline'
                                className='px-8'>
                                <Link href='/docs'>
                                    <FileText className='w-4 h-4 mr-2' />
                                    View Full Documentation
                                </Link>
                            </Button>
                            <Button asChild className='px-8'>
                                <a
                                    href='https://github.com/imsks/chitthi'
                                    target='_blank'
                                    rel='noopener noreferrer'>
                                    <ExternalLink className='w-4 h-4 mr-2' />
                                    View on GitHub
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
