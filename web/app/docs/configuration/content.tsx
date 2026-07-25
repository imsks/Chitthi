"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Database, Zap } from "lucide-react"
import { CodeBlock } from "@/lib/docs"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function ConfigurationContent() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                        Configuration
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>
                        Environment variables and infrastructure setup for
                        self-hosted deployments.
                    </p>
                    <Card className='bg-purple-50 border-purple-200'>
                        <CardContent className='py-4 px-5'>
                            <p className='text-sm text-purple-800'>
                                <strong>Cloud users:</strong> You don&apos;t need
                                to configure any of this. Your infrastructure is
                                managed for you.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Environment Variables</CardTitle>
                        <CardDescription>
                            Create a <code>.env</code> file in the root directory
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='env-variables'
                            language='env'
                            code={`# Server Configuration
PORT=8080
APP_ENV=production

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable

# Redis Configuration
REDIS_URL=redis://redis:6379

# Auth & Encryption
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-32-byte-key

# Server-to-server auth (Next.js ↔ Go API)
CHITTHI_BFF_SECRET=generate-with-openssl-rand-hex-32

# NextAuth (Google OAuth)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Email Provider Keys (Optional - environment-level fallback)
SENDGRID_API_KEY=your_sendgrid_api_key
BREEVO_API_KEY=your_breevo_api_key
MAILERSEND_API_KEY=your_mailersend_api_key

# Message Queue (Optional)
RABBITMQ_URL=amqp://guest:guest@localhost:5672/`}
                        />
                    </CardContent>
                </Card>

                <div className='grid md:grid-cols-2 gap-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <Database className='w-5 h-5 mr-2 text-blue-600' />
                                PostgreSQL
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-gray-600 mb-3'>
                                Stores users, providers, unified API keys, and
                                daily metrics.
                            </p>
                            <CodeBlock
                                id='postgres-setup'
                                code={`docker run -d \\
  --name chitthi-postgres \\
  -e POSTGRES_PASSWORD=postgres \\
  -e POSTGRES_DB=chitthi \\
  -p 5432:5432 \\
  postgres:15`}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <Zap className='w-5 h-5 mr-2 text-red-600' />
                                Redis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-gray-600 mb-3'>
                                Used for caching and rate limiting.
                            </p>
                            <CodeBlock
                                id='redis-setup'
                                code={`docker run -d \\
  --name chitthi-redis \\
  -p 6379:6379 \\
  redis:7-alpine`}
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Database Migrations</CardTitle>
                        <CardDescription>
                            Run migrations to set up the required tables
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
                                CLI. Run from the repository root.
                            </p>
                            <div>
                                <h4 className='font-semibold mb-2'>
                                    Run Migrations
                                </h4>
                                <CodeBlock
                                    id='run-migrations'
                                    code={`migrate -path migrations \\
  -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up`}
                                />
                            </div>
                            <div>
                                <h4 className='font-semibold mb-2'>
                                    Rollback One Step
                                </h4>
                                <CodeBlock
                                    id='rollback-migrations'
                                    code={`migrate -path migrations \\
  -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" down 1`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DocsShell>
    )
}
