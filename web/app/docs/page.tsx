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
                            <section id='getting-started' className='mb-16'>
                                <h2 className='text-3xl font-bold mb-6'>
                                    Getting Started
                                </h2>

                                <div id='quick-start' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        Quick Start
                                    </h3>
                                    <p className='text-gray-600 mb-6'>
                                        Get Chitthi running in minutes with
                                        Docker and start sending emails
                                        immediately.
                                    </p>

                                    <div className='space-y-4'>
                                        <div className='card'>
                                            <h4 className='font-semibold mb-2'>
                                                1. Clone the repository
                                            </h4>
                                            <CodeBlock
                                                code='git clone https://github.com/imsks/chitthi.git\ncd chitthi'
                                                language='bash'
                                                id='clone-repo'
                                            />
                                        </div>

                                        <div className='card'>
                                            <h4 className='font-semibold mb-2'>
                                                2. Start infrastructure
                                            </h4>
                                            <CodeBlock
                                                code='docker compose up redis db -d'
                                                language='bash'
                                                id='start-infra'
                                            />
                                        </div>

                                        <div className='card'>
                                            <h4 className='font-semibold mb-2'>
                                                3. Run the service
                                            </h4>
                                            <CodeBlock
                                                code='air\n# or\ngo run cmd/main.go'
                                                language='bash'
                                                id='run-service'
                                            />
                                        </div>

                                        <div className='card'>
                                            <h4 className='font-semibold mb-2'>
                                                4. Test the API
                                            </h4>
                                            <CodeBlock
                                                code={`curl -X POST http://localhost:8080/send-email \\\n  -H "Content-Type: application/json" \\\n  -H "X-SMTP-Host: smtp.gmail.com" \\\n  -H "X-SMTP-Port: 587" \\\n  -H "X-SMTP-Username: your-email@gmail.com" \\\n  -H "X-SMTP-Password: your-app-password" \\\n  -H "X-SMTP-From: your-email@gmail.com" \\\n  -H "X-SMTP-Use-TLS: true" \\\n  -d '{ \\\n    "from_email": "sender@example.com", \\\n    "to_email": "recipient@example.com", \\\n    "subject": "Test Email", \\\n    "html_content": "<h1>Hello World!</h1>" \\\n  }'`}
                                                language='bash'
                                                id='test-api'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* API Reference */}
                            <section id='api-reference' className='mb-16'>
                                <h2 className='text-3xl font-bold mb-6'>
                                    API Reference
                                </h2>

                                <div id='send-email' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        Send Email
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Send emails through any supported
                                        provider using a single endpoint.
                                    </p>

                                    <div className='card mb-6'>
                                        <h4 className='font-semibold mb-2'>
                                            Endpoint
                                        </h4>
                                        <CodeBlock
                                            code='POST /send-email'
                                            language='http'
                                            id='endpoint'
                                        />
                                    </div>

                                    <div className='card mb-6'>
                                        <h4 className='font-semibold mb-2'>
                                            Headers
                                        </h4>
                                        <CodeBlock
                                            code={`Content-Type: application/json\nX-SMTP-Host: smtp.gmail.com\nX-SMTP-Port: 587\nX-SMTP-Username: your-email@gmail.com\nX-SMTP-Password: your-app-password\nX-SMTP-From: your-email@gmail.com\nX-SMTP-Use-TLS: true`}
                                            language='http'
                                            id='headers'
                                        />
                                    </div>

                                    <div className='card mb-6'>
                                        <h4 className='font-semibold mb-2'>
                                            Request Body
                                        </h4>
                                        <CodeBlock
                                            code={`{\n  "from_email": "sender@example.com",\n  "from_name": "Sender Name",\n  "to_email": "recipient@example.com",\n  "to_name": "Recipient Name",\n  "subject": "Email Subject",\n  "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"\n}`}
                                            language='json'
                                            id='request-body'
                                        />
                                    </div>

                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            Response
                                        </h4>
                                        <CodeBlock
                                            code={`{\n  "status": true,\n  "message": "Email sent successfully",\n  "data": {\n    "sent_to": "recipient@example.com",\n    "sent_from": "sender@example.com",\n    "subject": "Email Subject",\n    "provider": "smtp",\n    "log_saved": true,\n    "log_id": 123\n  }\n}`}
                                            language='json'
                                            id='response'
                                        />
                                    </div>
                                </div>

                                <div id='email-logs' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        Get Email Logs
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Retrieve email logs for monitoring and
                                        analytics.
                                    </p>

                                    <div className='card mb-6'>
                                        <h4 className='font-semibold mb-2'>
                                            Endpoint
                                        </h4>
                                        <CodeBlock
                                            code='GET /email-logs?limit=10&offset=0'
                                            language='http'
                                            id='logs-endpoint'
                                        />
                                    </div>

                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            Response
                                        </h4>
                                        <CodeBlock
                                            code={`{\n  "status": true,\n  "data": [\n    {\n      "id": 1,\n      "recipient_email": "recipient@example.com",\n      "subject": "Test Email",\n      "provider": "smtp",\n      "status": "sent",\n      "created_at": "2024-01-01T12:00:00Z"\n    }\n  ]\n}`}
                                            language='json'
                                            id='logs-response'
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Email Providers */}
                            <section id='email-providers' className='mb-16'>
                                <h2 className='text-3xl font-bold mb-6'>
                                    Email Providers
                                </h2>

                                <div id='smtp' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        SMTP
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Direct SMTP connection with STARTTLS
                                        support.
                                    </p>
                                    <CodeBlock
                                        code={`curl -X POST http://localhost:8080/send-email \\\n  -H "Content-Type: application/json" \\\n  -H "X-SMTP-Host: smtp.gmail.com" \\\n  -H "X-SMTP-Port: 587" \\\n  -H "X-SMTP-Username: your-email@gmail.com" \\\n  -H "X-SMTP-Password: your-app-password" \\\n  -H "X-SMTP-From: your-email@gmail.com" \\\n  -H "X-SMTP-Use-TLS: true" \\\n  -d '{ \\\n    "from_email": "sender@example.com", \\\n    "to_email": "recipient@example.com", \\\n    "subject": "Test Email", \\\n    "html_content": "<h1>Hello World!</h1>" \\\n  }'`}
                                        language='bash'
                                        id='smtp-example'
                                    />
                                </div>

                                <div id='sendgrid' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        SendGrid
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        SendGrid v3 API integration.
                                    </p>
                                    <CodeBlock
                                        code={`curl -X POST http://localhost:8080/send-email \\\n  -H "Content-Type: application/json" \\\n  -H "X-SendGrid-API-Key: your-sendgrid-api-key" \\\n  -d '{ \\\n    "from_email": "sender@example.com", \\\n    "to_email": "recipient@example.com", \\\n    "subject": "Test Email", \\\n    "html_content": "<h1>Hello World!</h1>" \\\n  }'`}
                                        language='bash'
                                        id='sendgrid-example'
                                    />
                                </div>

                                <div id='breevo' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        Breevo
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Breevo Email API integration.
                                    </p>
                                    <CodeBlock
                                        code={`curl -X POST http://localhost:8080/send-email \\\n  -H "Content-Type: application/json" \\\n  -H "X-Breevo-API-Key: your-breevo-api-key" \\\n  -d '{ \\\n    "from_email": "sender@example.com", \\\n    "to_email": "recipient@example.com", \\\n    "subject": "Test Email", \\\n    "html_content": "<h1>Hello World!</h1>" \\\n  }'`}
                                        language='bash'
                                        id='breevo-example'
                                    />
                                </div>

                                <div id='mailersend' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        MailerSend
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        MailerSend API integration.
                                    </p>
                                    <CodeBlock
                                        code={`curl -X POST http://localhost:8080/send-email \\\n  -H "Content-Type: application/json" \\\n  -H "X-MailerSend-API-Key: your-mailersend-api-key" \\\n  -d '{ \\\n    "from_email": "sender@example.com", \\\n    "to_email": "recipient@example.com", \\\n    "subject": "Test Email", \\\n    "html_content": "<h1>Hello World!</h1>" \\\n  }'`}
                                        language='bash'
                                        id='mailersend-example'
                                    />
                                </div>
                            </section>

                            {/* Configuration */}
                            <section id='configuration' className='mb-16'>
                                <h2 className='text-3xl font-bold mb-6'>
                                    Configuration
                                </h2>

                                <div id='env-vars' className='mb-8'>
                                    <h3 className='text-2xl font-semibold mb-4'>
                                        Environment Variables
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Configure Chitthi using environment
                                        variables.
                                    </p>
                                    <CodeBlock
                                        code={`# Server Configuration\nPORT=8080\n\n# Database Configuration\nDATABASE_URL=postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable\n\n# Redis Configuration\nREDIS_URL=redis://localhost:6379\n\n# Email Provider Configuration (Optional - for fallback)\nBREEVO_API_KEY=your_breevo_api_key\nSENDGRID_API_KEY=your_sendgrid_api_key\nSENDGRID_REGION=global\nMAILERSEND_API_KEY=your_mailersend_api_key\n\n# SMTP Configuration (Optional - for fallback)\nSMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_USERNAME=your-email@gmail.com\nSMTP_PASSWORD=your-app-password\nSMTP_FROM=your-email@gmail.com\nSMTP_USE_TLS=true`}
                                        language='env'
                                        id='env-vars-example'
                                    />
                                </div>
                            </section>

                            {/* Contributing */}
                            <section id='contributing' className='mb-16'>
                                <h2 className='text-3xl font-bold mb-6'>
                                    Contributing
                                </h2>
                                <p className='text-gray-600 mb-6'>
                                    We welcome contributions! Please follow
                                    these steps to contribute to Chitthi.
                                </p>

                                <div className='space-y-4'>
                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            1. Fork the repository
                                        </h4>
                                        <CodeBlock
                                            code='git clone https://github.com/imsks/chitthi.git\ncd chitthi'
                                            language='bash'
                                            id='fork-repo'
                                        />
                                    </div>

                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            2. Create a feature branch
                                        </h4>
                                        <CodeBlock
                                            code='git checkout -b feature/your-feature-name'
                                            language='bash'
                                            id='create-branch'
                                        />
                                    </div>

                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            3. Make your changes
                                        </h4>
                                        <p className='text-gray-600 mb-2'>
                                            Follow the existing code style, add
                                            tests for new functionality, and
                                            update documentation as needed.
                                        </p>
                                    </div>

                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            4. Test your changes
                                        </h4>
                                        <CodeBlock
                                            code='go test ./...'
                                            language='bash'
                                            id='run-tests'
                                        />
                                    </div>

                                    <div className='card'>
                                        <h4 className='font-semibold mb-2'>
                                            5. Submit a pull request
                                        </h4>
                                        <p className='text-gray-600 mb-2'>
                                            Provide a clear description of your
                                            changes, include any relevant issue
                                            numbers, and ensure all tests pass.
                                        </p>
                                    </div>
                                </div>
                            </section>
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
