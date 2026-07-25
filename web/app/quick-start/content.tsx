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
import {
    CheckCircle,
    Globe,
    Settings,
    Server,
    Cloud,
    FileText,
    ChevronRight,
    ExternalLink,
    KeyRound,
    Shield,
    UserPlus
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CodeBlock, DocsHeader } from "@/lib/docs"

type IntegrationMode = "cloud" | "self-host"

export default function QuickStartPage() {
    const [mode, setMode] = useState<IntegrationMode | null>(null)

    return (
        <div className='min-h-screen bg-gray-50'>
            <DocsHeader title='Quick Start' />

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
                            How would you like to use Chitthi?
                        </h1>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                            Chitthi works in two modes. Pick the one that fits your setup.
                        </p>
                    </div>

                    {/* Integration Options */}
                    <div className='max-w-5xl mx-auto mb-12 grid md:grid-cols-2 gap-6'>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}>
                            <Card
                                className={`h-full transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                    mode === "cloud"
                                        ? "ring-2 ring-purple-500 shadow-lg"
                                        : ""
                                }`}
                                onClick={() => setMode("cloud")}>
                                <CardHeader>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                            <Cloud className='w-6 h-6 text-purple-600' />
                                        </div>
                                        <div>
                                            <CardTitle className='text-xl'>
                                                Cloud (Hosted)
                                            </CardTitle>
                                            <CardDescription>
                                                Fastest way to get started
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-3'>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                No infrastructure to manage
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Setup your provider keys on Dashboard
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Get a Chitthi API key & start sending
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Ideal for quick integrations & prototypes
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className='mt-4 bg-purple-100 text-purple-800'>
                                        Recommended for most users
                                    </Badge>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}>
                            <Card
                                className={`h-full transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                    mode === "self-host"
                                        ? "ring-2 ring-blue-500 shadow-lg"
                                        : ""
                                }`}
                                onClick={() => setMode("self-host")}>
                                <CardHeader>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                            <Server className='w-6 h-6 text-blue-600' />
                                        </div>
                                        <div>
                                            <CardTitle className='text-xl'>
                                                Self-Host
                                            </CardTitle>
                                            <CardDescription>
                                                Full control on your infra
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-3'>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Clone the repo & run with Docker
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Your data never leaves your servers
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Customize & extend the source code
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <CheckCircle className='w-4 h-4 text-green-600' />
                                            <span className='text-sm text-gray-600'>
                                                Ideal for production & privacy-first teams
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className='mt-4 bg-blue-100 text-blue-800'>
                                        Open Source · MIT License
                                    </Badge>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Cloud Guide */}
                    {mode === "cloud" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}>
                            <div className='max-w-4xl mx-auto space-y-8'>
                                <div className='text-center'>
                                    <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                                        Cloud Integration Guide
                                    </h2>
                                    <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                                        Start sending emails in under 5 minutes. Sign up, configure your provider, and call the API.
                                    </p>
                                </div>

                                {/* Step 1 - Sign Up */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            1
                                        </span>
                                        Create an Account
                                    </h3>
                                    <Card>
                                        <CardContent className='pt-6'>
                                            <div className='flex items-start space-x-4'>
                                                <UserPlus className='w-6 h-6 text-purple-600 mt-1' />
                                                <div className='space-y-3'>
                                                    <p className='text-gray-700'>
                                                        Sign up on the Chitthi Dashboard with your Google account. This gives you access to manage providers and API keys.
                                                    </p>
                                                    <Button asChild className='bg-purple-600 hover:bg-purple-700'>
                                                        <Link href='/dashboard'>
                                                            Go to Dashboard
                                                            <ChevronRight className='w-4 h-4 ml-2' />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Step 2 - Add Provider */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            2
                                        </span>
                                        Add Your Email Provider
                                    </h3>
                                    <Card>
                                        <CardContent className='pt-6'>
                                            <div className='flex items-start space-x-4'>
                                                <Globe className='w-6 h-6 text-purple-600 mt-1' />
                                                <div className='space-y-3'>
                                                    <p className='text-gray-700'>
                                                        Go to <strong>Dashboard → Providers</strong> and add your email provider credentials:
                                                    </p>
                                                    <ul className='space-y-2 text-gray-600 text-sm'>
                                                        <li className='flex items-center space-x-2'>
                                                            <ChevronRight className='w-4 h-4 text-purple-500' />
                                                            <span>Select a provider (SendGrid, Breevo, or MailerSend)</span>
                                                        </li>
                                                        <li className='flex items-center space-x-2'>
                                                            <ChevronRight className='w-4 h-4 text-purple-500' />
                                                            <span>Enter your provider API key</span>
                                                        </li>
                                                        <li className='flex items-center space-x-2'>
                                                            <ChevronRight className='w-4 h-4 text-purple-500' />
                                                            <span>Add a verified sender email address</span>
                                                        </li>
                                                    </ul>
                                                    <Card className='bg-yellow-50 border-yellow-200'>
                                                        <CardContent className='py-3 px-4'>
                                                            <p className='text-sm text-yellow-800'>
                                                                <strong>Note:</strong> Make sure your sender email is verified with your email provider before adding it here.
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Step 3 - Generate API Key */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            3
                                        </span>
                                        Generate a Chitthi API Key
                                    </h3>
                                    <Card>
                                        <CardContent className='pt-6'>
                                            <div className='flex items-start space-x-4'>
                                                <KeyRound className='w-6 h-6 text-purple-600 mt-1' />
                                                <div className='space-y-3'>
                                                    <p className='text-gray-700'>
                                                        Go to <strong>Dashboard → API Keys</strong> and click <strong>Generate New Key</strong>. Copy and store this key securely — you won&apos;t be able to see it again.
                                                    </p>
                                                    <p className='text-sm text-gray-500'>
                                                        This unified key authenticates your requests and automatically routes to your configured provider.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Step 4 - Send Email */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            4
                                        </span>
                                        Send Your First Email
                                    </h3>
                                    <CodeBlock
                                        id='cloud-send-email'
                                        code={`curl -X POST https://chitthi-572964795629.asia-south1.run.app/send-email \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_CHITTHI_API_KEY" \\
  -d '{
    "to_email": "recipient@example.com",
    "subject": "Hello from Chitthi!",
    "html_content": "<h1>It works!</h1><p>Sent via Chitthi Cloud.</p>"
  }'`}
                                    />
                                    <Card className='mt-4 bg-gray-50'>
                                        <CardContent className='py-4 px-5'>
                                            <p className='text-sm text-gray-600 mb-2'>
                                                <strong>Authentication options:</strong>
                                            </p>
                                            <ul className='space-y-1 text-sm text-gray-600'>
                                                <li><code className='bg-white px-1.5 py-0.5 rounded text-xs'>Authorization: Bearer &lt;key&gt;</code></li>
                                                <li><code className='bg-white px-1.5 py-0.5 rounded text-xs'>X-Chitthi-API-Key: &lt;key&gt;</code></li>
                                                <li><code className='bg-white px-1.5 py-0.5 rounded text-xs'>{`"api_key": "<key>"`}</code> in the JSON body</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Success */}
                                <Card className='bg-green-50 border-green-200'>
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start space-x-3'>
                                            <CheckCircle className='w-6 h-6 text-green-600 mt-0.5' />
                                            <div>
                                                <h4 className='font-semibold text-green-900 mb-1'>
                                                    That&apos;s it!
                                                </h4>
                                                <p className='text-green-800'>
                                                    No servers to manage. No Docker. Just your provider key + Chitthi API key = emails sent.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* Self-Host Guide */}
                    {mode === "self-host" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}>
                            <div className='max-w-4xl mx-auto space-y-8'>
                                <div className='text-center'>
                                    <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                                        Self-Host Setup Guide
                                    </h2>
                                    <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                                        Run Chitthi on your own infrastructure with full control over data and configuration.
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
                                                        Docker & Docker Compose
                                                    </span>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <CheckCircle className='w-4 h-4 text-green-600' />
                                                    <span>
                                                        Go 1.24+ (for development)
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
                                                        API key from an email provider
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Step 1 */}
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

                                {/* Step 2 */}
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

# Database
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable

# Redis
REDIS_URL=redis://redis:6379

# Auth / Encryption (change these!)
JWT_SECRET=change-me-to-a-long-random-string
ENCRYPTION_KEY=change-me-32-byte-key

# Message Queue
RABBITMQ_URL=amqp://guest:guest@localhost:5672/`}
                                        />
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            3
                                        </span>
                                        Start with Docker Compose
                                    </h3>
                                    <CodeBlock
                                        id='start-infra'
                                        code={`# Start all services (API, Web Dashboard, Postgres, Redis)
docker compose up --build

# Or run in background
docker compose up -d --build`}
                                    />
                                    <p className='text-sm text-gray-500 mt-3'>
                                        API runs on <code className='bg-gray-100 px-1 rounded'>http://localhost:8080</code>, Web Dashboard on <code className='bg-gray-100 px-1 rounded'>http://localhost:3000</code>
                                    </p>
                                </div>

                                {/* Step 4 */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            4
                                        </span>
                                        Run Database Migrations
                                    </h3>
                                    <CodeBlock
                                        id='run-migrations'
                                        code={`# Install golang-migrate if you don't have it
# https://github.com/golang-migrate/migrate

migrate -path migrations \\
  -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up`}
                                    />
                                </div>

                                {/* Step 5 */}
                                <div>
                                    <h3 className='text-2xl font-semibold mb-4 flex items-center'>
                                        <span className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                            5
                                        </span>
                                        Send Your First Email
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Pass your email provider API key directly in the request header:
                                    </p>
                                    <CodeBlock
                                        id='test-api'
                                        code={`curl -X POST http://localhost:8080/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-SendGrid-API-Key: your-sendgrid-key" \\
  -d '{
    "from_email": "verified@yourdomain.com",
    "to_email": "recipient@example.com",
    "subject": "Hello from Chitthi!",
    "html_content": "<h1>It works!</h1><p>Sent via self-hosted Chitthi.</p>"
  }'`}
                                    />
                                    <Card className='mt-4 bg-gray-50'>
                                        <CardContent className='py-4 px-5'>
                                            <p className='text-sm text-gray-600 mb-2'>
                                                <strong>Provider headers:</strong>
                                            </p>
                                            <ul className='space-y-1 text-sm text-gray-600'>
                                                <li><code className='bg-white px-1.5 py-0.5 rounded text-xs'>X-SendGrid-API-Key</code> — for SendGrid</li>
                                                <li><code className='bg-white px-1.5 py-0.5 rounded text-xs'>X-Breevo-API-Key</code> — for Breevo</li>
                                                <li><code className='bg-white px-1.5 py-0.5 rounded text-xs'>X-MailerSend-API-Key</code> — for MailerSend</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Success */}
                                <Card className='bg-green-50 border-green-200'>
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start space-x-3'>
                                            <CheckCircle className='w-6 h-6 text-green-600 mt-0.5' />
                                            <div>
                                                <h4 className='font-semibold text-green-900 mb-1'>
                                                    You&apos;re up and running!
                                                </h4>
                                                <p className='text-green-800'>
                                                    Your self-hosted Chitthi service is live at{" "}
                                                    <code className='bg-green-200 px-1 rounded'>
                                                        http://localhost:8080
                                                    </code>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tip */}
                                <Card className='bg-blue-50 border-blue-200'>
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start space-x-3'>
                                            <Shield className='w-6 h-6 text-blue-600 mt-0.5' />
                                            <div>
                                                <h4 className='font-semibold text-blue-900 mb-1'>
                                                    Optional: Use the Dashboard
                                                </h4>
                                                <p className='text-blue-800 text-sm'>
                                                    Even when self-hosting, you can use the web dashboard at <code className='bg-blue-200 px-1 rounded'>localhost:3000</code> to manage providers and generate unified Chitthi API keys — just like Cloud users do.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <div className='flex justify-center space-x-4 mt-12'>
                        <Button
                            asChild
                            variant='outline'
                            className='px-8'>
                            <Link href='/docs'>
                                <FileText className='w-4 h-4 mr-2' />
                                Full Documentation
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
            </div>
        </div>
    )
}
