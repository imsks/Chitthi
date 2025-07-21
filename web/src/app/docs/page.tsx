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
                    className='flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors'>
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
            <nav className='fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center'>
                            <Link
                                href='/'
                                className='terminal-text text-xl font-bold'>
                                chitthi
                            </Link>
                        </div>
                        <div className='hidden md:flex space-x-8'>
                            <Link
                                href='/'
                                className='nav-link flex items-center gap-2'>
                                <ArrowLeft size={16} />
                                Back to Home
                            </Link>
                            <Link
                                href='https://github.com/imsks/chitthi'
                                className='nav-link flex items-center gap-2'>
                                <Github size={16} />
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className='pt-20 pb-20 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto'>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='text-center mb-16'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-6'>
                            <span className='terminal-text'>Documentation</span>
                        </h1>
                        <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
                            Everything you need to integrate Chitthi into your
                            application
                        </p>
                    </motion.div>

                    {/* Quick Start */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className='mb-16'>
                        <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                            <Zap className='text-green-400' size={24} />
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
                        className='mb-16'>
                        <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                            <Code className='text-green-400' size={24} />
                            API Reference
                        </h2>

                        <div className='space-y-8'>
                            {/* Send Email Endpoint */}
                            <div className='card'>
                                <h3 className='text-xl font-semibold mb-4'>
                                    Send Email
                                </h3>
                                <div className='mb-4'>
                                    <span className='inline-block bg-green-500 text-black px-2 py-1 rounded text-sm font-mono'>
                                        POST
                                    </span>
                                    <span className='ml-2 text-gray-300 font-mono'>
                                        /send-email
                                    </span>
                                </div>

                                <h4 className='font-semibold mb-2'>Headers</h4>
                                <div className='mb-4 space-y-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-400 font-mono'>
                                            X-SMTP-*
                                        </span>
                                        <span className='text-gray-400'>
                                            (for SMTP)
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-400 font-mono'>
                                            X-SendGrid-API-Key
                                        </span>
                                        <span className='text-gray-400'>
                                            (for SendGrid)
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-400 font-mono'>
                                            X-Breevo-API-Key
                                        </span>
                                        <span className='text-gray-400'>
                                            (for Breevo)
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-400 font-mono'>
                                            X-MailerSend-API-Key
                                        </span>
                                        <span className='text-gray-400'>
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
                            <div className='card'>
                                <h3 className='text-xl font-semibold mb-4'>
                                    Get Email Logs
                                </h3>
                                <div className='mb-4'>
                                    <span className='inline-block bg-blue-500 text-black px-2 py-1 rounded text-sm font-mono'>
                                        GET
                                    </span>
                                    <span className='ml-2 text-gray-300 font-mono'>
                                        /email-logs
                                    </span>
                                </div>

                                <h4 className='font-semibold mb-2'>
                                    Query Parameters
                                </h4>
                                <div className='mb-4 space-y-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-400 font-mono'>
                                            limit
                                        </span>
                                        <span className='text-gray-400'>
                                            (optional): Number of logs to return
                                            (default: 10)
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-400 font-mono'>
                                            offset
                                        </span>
                                        <span className='text-gray-400'>
                                            (optional): Number of logs to skip
                                            (default: 0)
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
                        className='mb-16'>
                        <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                            <Mail className='text-green-400' size={24} />
                            Provider Examples
                        </h2>

                        <div className='space-y-6'>
                            {/* SendGrid */}
                            <div className='card'>
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
                            <div className='card'>
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
                            <div className='card'>
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
                        className='mb-16'>
                        <h2 className='text-2xl font-bold mb-6 flex items-center gap-3'>
                            <Shield className='text-green-400' size={24} />
                            Environment Configuration
                        </h2>

                        <div className='card'>
                            <p className='text-gray-300 mb-4'>
                                Create a{" "}
                                <code className='bg-gray-800 px-2 py-1 rounded'>
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

                    {/* Deployment */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className='mb-16'>
                        <h2 className='text-2xl font-bold mb-6'>Deployment</h2>

                        <div className='space-y-6'>
                            <div className='card'>
                                <h3 className='text-lg font-semibold mb-3'>
                                    Docker Deployment
                                </h3>
                                <CodeBlock
                                    id='docker-deploy'
                                    language='bash'
                                    code={`# Start all services
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f`}
                                />
                            </div>

                            <div className='card'>
                                <h3 className='text-lg font-semibold mb-3'>
                                    Production Deployment
                                </h3>
                                <CodeBlock
                                    id='prod-deploy'
                                    language='bash'
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
                            <p className='text-gray-300 mb-4'>
                                We welcome contributions! Here&apos;s how you
                                can help:
                            </p>

                            <div className='space-y-4'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-2 h-2 bg-green-400 rounded-full mt-2'></div>
                                    <div>
                                        <h4 className='font-semibold'>
                                            Fork the repository
                                        </h4>
                                        <p className='text-gray-400 text-sm'>
                                            Create your own copy of the project
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <div className='w-2 h-2 bg-green-400 rounded-full mt-2'></div>
                                    <div>
                                        <h4 className='font-semibold'>
                                            Create a feature branch
                                        </h4>
                                        <p className='text-gray-400 text-sm'>
                                            Work on your changes in isolation
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <div className='w-2 h-2 bg-green-400 rounded-full mt-2'></div>
                                    <div>
                                        <h4 className='font-semibold'>
                                            Submit a pull request
                                        </h4>
                                        <p className='text-gray-400 text-sm'>
                                            Share your improvements with the
                                            community
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6'>
                                <Link href='https://github.com/imsks/chitthi'>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className='btn-secondary flex items-center gap-2'>
                                        <Github size={20} />
                                        Contribute on GitHub
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>

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
