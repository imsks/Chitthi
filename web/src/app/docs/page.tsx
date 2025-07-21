"use client"

import { motion } from "framer-motion"
import {
    ArrowLeft,
    Mail,
    Code,
    Zap,
    Shield,
    Github,
    Copy,
    Check
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Navigation from "@/components/Navigation"
import Sidebar from "@/components/Sidebar"
import TableOfContents from "@/components/TableOfContents"

export default function DocsPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const copyToClipboard = async (code: string, id: string) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCode(id)
            setTimeout(() => setCopiedCode(null), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    const CodeBlock = ({
        code,
        language,
        id
    }: {
        code: string
        language: string
        id: string
    }) => (
        <div className='relative'>
            <div className='flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 rounded-t-lg'>
                <span className='text-sm text-gray-400'>{language}</span>
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className='flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors'>
                    {copiedCode === id ? (
                        <>
                            <Check size={16} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className='code-block rounded-b-lg'>
                <code>{code}</code>
            </pre>
        </div>
    )

    return (
        <div className='min-h-screen'>
            {/* Navigation */}
            <Navigation isDocs={true} />

            {/* Main Layout */}
            <div className='flex pt-16'>
                {/* Sidebar */}
                <div className='hidden lg:block'>
                    <Sidebar className='fixed top-16 left-0 h-[calc(100vh-4rem)]' />
                </div>

                {/* Main Content */}
                <div className='flex-1 lg:ml-80'>
                    <div className='main-content'>
                        <div className='content-wrapper'>
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className='mb-12'>
                                <div className='flex items-center gap-4 mb-6'>
                                    <Link
                                        href='/'
                                        className='text-gray-400 hover:text-gray-600 transition-colors'>
                                        <ArrowLeft size={20} />
                                    </Link>
                                    <h1 className='text-4xl font-bold'>
                                        Documentation
                                    </h1>
                                </div>
                                <p className='text-xl text-gray-600 max-w-2xl'>
                                    Everything you need to integrate Chitthi
                                    into your application
                                </p>
                            </motion.div>

                            {/* Quick Start */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className='mb-16'
                                id='getting-started'>
                                <h2
                                    className='text-2xl font-bold mb-6 flex items-center gap-3'
                                    id='quick-start'>
                                    <Zap className='text-blue-600' size={24} />
                                    Quick Start
                                </h2>

                                <div className='space-y-6'>
                                    <div className='card'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            1. Clone the Repository
                                        </h3>
                                        <CodeBlock
                                            id='clone'
                                            language='bash'
                                            code={`git clone https://github.com/imsks/chitthi.git
cd chitthi`}
                                        />
                                    </div>

                                    <div className='card'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            2. Start Infrastructure
                                        </h3>
                                        <CodeBlock
                                            id='docker'
                                            language='bash'
                                            code={`# Start Redis and PostgreSQL
docker compose up redis db -d`}
                                        />
                                    </div>

                                    <div className='card'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            3. Run the Service
                                        </h3>
                                        <CodeBlock
                                            id='run'
                                            language='bash'
                                            code={`# Development with hot reload
air

# Or run directly
go run cmd/main.go`}
                                        />
                                    </div>

                                    <div className='card'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            4. Test the API
                                        </h3>
                                        <CodeBlock
                                            id='test'
                                            language='bash'
                                            code={`curl -X POST http://localhost:8080/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-SMTP-Host: smtp.gmail.com" \\
  -H "X-SMTP-Port: 587" \\
  -H "X-SMTP-Username: your-email@gmail.com" \\
  -H "X-SMTP-Password: your-app-password" \\
  -H "X-SMTP-From: your-email@gmail.com" \\
  -H "X-SMTP-Use-TLS: true" \\
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'`}
                                        />
                                    </div>
                                </div>
                            </motion.section>

                            {/* API Reference */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className='mb-16'
                                id='api-reference'>
                                <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                                    <Code className='text-blue-600' size={24} />
                                    API Reference
                                </h2>

                                <div className='space-y-8'>
                                    {/* Send Email Endpoint */}
                                    <div className='card' id='send-email'>
                                        <h3 className='text-xl font-semibold mb-4'>
                                            Send Email
                                        </h3>
                                        <div className='mb-4'>
                                            <span className='inline-block bg-green-500 text-white px-2 py-1 rounded text-sm font-mono'>
                                                POST
                                            </span>
                                            <span className='ml-2 text-gray-600 font-mono'>
                                                /send-email
                                            </span>
                                        </div>

                                        <h4 className='font-semibold mb-2'>
                                            Headers
                                        </h4>
                                        <div className='mb-4 space-y-2'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-blue-600 font-mono'>
                                                    X-SMTP-*
                                                </span>
                                                <span className='text-gray-500'>
                                                    (for SMTP)
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-blue-600 font-mono'>
                                                    X-SendGrid-API-Key
                                                </span>
                                                <span className='text-gray-500'>
                                                    (for SendGrid)
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-blue-600 font-mono'>
                                                    X-Breevo-API-Key
                                                </span>
                                                <span className='text-gray-500'>
                                                    (for Breevo)
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-blue-600 font-mono'>
                                                    X-MailerSend-API-Key
                                                </span>
                                                <span className='text-gray-500'>
                                                    (for MailerSend)
                                                </span>
                                            </div>
                                        </div>

                                        <h4 className='font-semibold mb-2'>
                                            Request Body
                                        </h4>
                                        <CodeBlock
                                            id='request'
                                            language='json'
                                            code={`{
  "from_email": "sender@example.com",
  "from_name": "Sender Name",
  "to_email": "recipient@example.com",
  "to_name": "Recipient Name",
  "subject": "Email Subject",
  "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
}`}
                                        />

                                        <h4 className='font-semibold mb-2 mt-4'>
                                            Response
                                        </h4>
                                        <CodeBlock
                                            id='response'
                                            language='json'
                                            code={`{
  "status": true,
  "message": "Email sent successfully",
  "data": {
    "sent_to": "recipient@example.com",
    "sent_from": "sender@example.com",
    "subject": "Email Subject",
    "provider": "smtp",
    "log_saved": true,
    "log_id": 123
  }
}`}
                                        />
                                    </div>

                                    {/* Get Logs Endpoint */}
                                    <div className='card' id='get-logs'>
                                        <h3 className='text-xl font-semibold mb-4'>
                                            Get Email Logs
                                        </h3>
                                        <div className='mb-4'>
                                            <span className='inline-block bg-blue-500 text-white px-2 py-1 rounded text-sm font-mono'>
                                                GET
                                            </span>
                                            <span className='ml-2 text-gray-600 font-mono'>
                                                /email-logs
                                            </span>
                                        </div>

                                        <h4 className='font-semibold mb-2'>
                                            Query Parameters
                                        </h4>
                                        <div className='mb-4 space-y-2'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-blue-600 font-mono'>
                                                    limit
                                                </span>
                                                <span className='text-gray-500'>
                                                    (optional): Number of logs
                                                    to return (default: 10)
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-blue-600 font-mono'>
                                                    offset
                                                </span>
                                                <span className='text-gray-500'>
                                                    (optional): Number of logs
                                                    to skip (default: 0)
                                                </span>
                                            </div>
                                        </div>

                                        <h4 className='font-semibold mb-2'>
                                            Example Request
                                        </h4>
                                        <CodeBlock
                                            id='logs'
                                            language='bash'
                                            code={`curl http://localhost:8080/email-logs?limit=10`}
                                        />

                                        <h4 className='font-semibold mb-2 mt-4'>
                                            Response
                                        </h4>
                                        <CodeBlock
                                            id='logs-response'
                                            language='json'
                                            code={`{
  "status": true,
  "data": [
    {
      "id": 1,
      "recipient_email": "recipient@example.com",
      "subject": "Test Email",
      "provider": "smtp",
      "status": "sent",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}`}
                                        />
                                    </div>
                                </div>
                            </motion.section>

                            {/* Provider Examples */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className='mb-16'
                                id='providers'>
                                <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                                    <Mail className='text-blue-600' size={24} />
                                    Provider Examples
                                </h2>

                                <div className='space-y-6'>
                                    {/* SendGrid */}
                                    <div className='card' id='sendgrid'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            SendGrid
                                        </h3>
                                        <CodeBlock
                                            id='sendgrid'
                                            language='bash'
                                            code={`curl -X POST http://localhost:8080/send-email \\
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

                                    {/* Breevo */}
                                    <div className='card' id='breevo'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            Breevo
                                        </h3>
                                        <CodeBlock
                                            id='breevo'
                                            language='bash'
                                            code={`curl -X POST http://localhost:8080/send-email \\
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

                                    {/* MailerSend */}
                                    <div className='card' id='mailersend'>
                                        <h3 className='text-lg font-semibold mb-3'>
                                            MailerSend
                                        </h3>
                                        <CodeBlock
                                            id='mailersend'
                                            language='bash'
                                            code={`curl -X POST http://localhost:8080/send-email \\
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
                            </motion.section>

                            {/* Environment Configuration */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className='mb-16'
                                id='deployment'>
                                <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                                    <Shield
                                        className='text-blue-600'
                                        size={24}
                                    />
                                    Environment Configuration
                                </h2>

                                <div className='card'>
                                    <p className='text-gray-600 mb-4'>
                                        Create a{" "}
                                        <code className='bg-gray-100 px-2 py-1 rounded'>
                                            .env
                                        </code>{" "}
                                        file in the root directory:
                                    </p>
                                    <CodeBlock
                                        id='env'
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
MAILERSEND_API_KEY=your_mailersend_api_key

# SMTP Configuration (Optional - for fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_USE_TLS=true`}
                                    />
                                </div>
                            </motion.section>

                            {/* Contributing */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className='mb-16'>
                                <h2 className='text-2xl font-bold mb-6'>
                                    Contributing
                                </h2>

                                <div className='card'>
                                    <p className='text-gray-600 mb-4'>
                                        We welcome contributions! Here&apos;s
                                        how you can help:
                                    </p>

                                    <div className='space-y-4'>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                                            <div>
                                                <h4 className='font-semibold'>
                                                    Fork the repository
                                                </h4>
                                                <p className='text-gray-500 text-sm'>
                                                    Create your own copy of the
                                                    project
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex items-start gap-3'>
                                            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                                            <div>
                                                <h4 className='font-semibold'>
                                                    Create a feature branch
                                                </h4>
                                                <p className='text-gray-500 text-sm'>
                                                    Work on your changes in
                                                    isolation
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex items-start gap-3'>
                                            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                                            <div>
                                                <h4 className='font-semibold'>
                                                    Submit a pull request
                                                </h4>
                                                <p className='text-gray-500 text-sm'>
                                                    Share your improvements with
                                                    the community
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mt-6'>
                                        <Link href='https://github.com/imsks/chitthi'>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className='btn-secondary'>
                                                <Github size={20} />
                                                Contribute on GitHub
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.section>
                        </div>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className='hidden xl:block'>
                    <TableOfContents className='fixed top-16 right-0 h-[calc(100vh-4rem)]' />
                </div>
            </div>

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
