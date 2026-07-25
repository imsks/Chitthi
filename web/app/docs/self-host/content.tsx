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
    Database,
    Shield,
    Zap,
    Settings,
    Server,
    Terminal,
    GitBranch,
    HardDrive,
    Mail
} from "lucide-react"
import { CodeBlock } from "@/lib/docs"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function SelfHostPageContent() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <div className='flex items-center space-x-3 mb-4'>
                        <Server className='w-8 h-8 text-blue-600' />
                        <h1 className='text-4xl font-bold text-gray-900'>
                            Self-Host Chitthi
                        </h1>
                    </div>
                    <p className='text-xl text-gray-600 mb-6'>
                        Run Chitthi on your own infrastructure. Full control over
                        data, keys, and email delivery. MIT licensed.
                    </p>

                    <div className='flex flex-wrap gap-2 mb-8'>
                        <Badge className='bg-blue-100 text-blue-800'>
                            Open Source
                        </Badge>
                        <Badge className='bg-green-100 text-green-800'>
                            MIT License
                        </Badge>
                        <Badge className='bg-purple-100 text-purple-800'>
                            Docker Ready
                        </Badge>
                        <Badge className='bg-yellow-100 text-yellow-800'>
                            BYOK
                        </Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Shield className='w-5 h-5 mr-2 text-green-600' />
                            Why Self-Host?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-4'>
                            {[
                                "🔐 Full data ownership - emails never leave your servers",
                                "🔑 BYOK - bring your own provider API keys",
                                "💰 No per-email fees - only pay your provider",
                                "🛠️ Customize and extend - source is yours",
                                "🌍 Deploy anywhere - cloud, VPS, or on-prem",
                                "📜 MIT licensed - use in commercial products"
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
                        <CardTitle className='flex items-center'>
                            <HardDrive className='w-5 h-5 mr-2 text-blue-600' />
                            Prerequisites
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-3'>
                            <div className='flex items-center space-x-2'>
                                <CheckCircle className='w-4 h-4 text-green-600' />
                                <span>
                                    <strong>Docker</strong> & Docker Compose
                                </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <CheckCircle className='w-4 h-4 text-green-600' />
                                <span>
                                    <strong>Go 1.24+</strong> (building from
                                    source)
                                </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <CheckCircle className='w-4 h-4 text-green-600' />
                                <span>
                                    <strong>PostgreSQL</strong> for logs & user
                                    data
                                </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <CheckCircle className='w-4 h-4 text-green-600' />
                                <span>
                                    <strong>Redis</strong> for caching & rate
                                    limiting
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <GitBranch className='w-5 h-5 mr-2 text-purple-600' />
                            1. Clone the Repository
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='self-host-clone'
                            code={`git clone https://github.com/imsks/chitthi.git
cd chitthi`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Settings className='w-5 h-5 mr-2 text-green-600' />
                            2. Configure Environment
                        </CardTitle>
                        <CardDescription>
                            Create a{" "}
                            <code className='px-1 py-0.5 bg-gray-100 rounded text-sm'>
                                .env
                            </code>{" "}
                            file in the project root
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='self-host-env'
                            language='env'
                            code={`# App
APP_ENV=production
PORT=8080

# Database
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable

# Redis
REDIS_URL=redis://redis:6379

# Auth / Encryption
JWT_SECRET=change-me-to-a-long-random-string
ENCRYPTION_KEY=change-me-32-byte-key

# Message Queue (optional)
RABBITMQ_URL=amqp://guest:guest@localhost:5672/`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Database className='w-5 h-5 mr-2 text-blue-600' />
                            3. Start with Docker Compose
                        </CardTitle>
                        <CardDescription>
                            The fastest way to get Chitthi running
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='self-host-compose'
                            code={`# Build and start all services (API, web dashboard, postgres, redis)
docker compose up --build -d

# Follow logs
docker compose logs -f

# Stop services
docker compose down`}
                        />
                        <p className='text-sm text-gray-600 mt-4'>
                            API:{" "}
                            <code className='px-1 py-0.5 bg-gray-100 rounded'>
                                http://localhost:8080
                            </code>{" "}
                            · Dashboard:{" "}
                            <code className='px-1 py-0.5 bg-gray-100 rounded'>
                                http://localhost:3000
                            </code>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Terminal className='w-5 h-5 mr-2 text-orange-600' />
                            4. Run Migrations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='self-host-migrate'
                            code={`# Install golang-migrate: https://github.com/golang-migrate/migrate
migrate -path migrations \\
  -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Mail className='w-5 h-5 mr-2 text-green-600' />
                            5. Send an Email
                        </CardTitle>
                        <CardDescription>
                            Pass your provider API key directly in the header
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='self-host-test'
                            code={`curl -X POST http://localhost:8080/send-email \\
  -H "Content-Type: application/json" \\
  -H "X-SendGrid-API-Key: your-sendgrid-key" \\
  -d '{
    "from_email": "verified@yourdomain.com",
    "to_email": "recipient@example.com",
    "subject": "Hello from Chitthi!",
    "html_content": "<h1>It works!</h1>"
  }'`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Terminal className='w-5 h-5 mr-2 text-gray-600' />
                            Alternative: Build From Source
                        </CardTitle>
                        <CardDescription>
                            Run the Go API and Next.js web app directly (without
                            Docker)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div>
                                <h4 className='font-semibold mb-2'>
                                    Run the API
                                </h4>
                                <CodeBlock
                                    id='self-host-api-source'
                                    code={`go mod download
go run cmd/main.go`}
                                />
                            </div>
                            <div>
                                <h4 className='font-semibold mb-2'>
                                    Run the Web Dashboard
                                </h4>
                                <CodeBlock
                                    id='self-host-web-source'
                                    language='bash'
                                    code={`cd web
npm install
npm run build
npm run start`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Shield className='w-5 h-5 mr-2 text-red-600' />
                            Hardening for Production
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-4'>
                            {[
                                "Terminate TLS at a reverse proxy (nginx, Caddy, Traefik)",
                                "Rotate JWT_SECRET and ENCRYPTION_KEY regularly",
                                "Use managed Postgres/Redis or enable persistent volumes",
                                "Restrict CORS origins to your domains",
                                "Enable rate limiting at the proxy layer",
                                "Back up the Postgres volume regularly",
                                "Pin Docker image tags instead of latest",
                                "Monitor logs and set up alerting"
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-2'>
                                    <CheckCircle className='w-4 h-4 text-green-600' />
                                    <span className='text-sm'>{item}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-blue-50 border-blue-200'>
                    <CardContent className='pt-6'>
                        <div className='flex items-start space-x-3'>
                            <Zap className='w-6 h-6 text-blue-600 mt-0.5' />
                            <div>
                                <h4 className='font-semibold text-blue-900 mb-1'>
                                    Dashboard works here too
                                </h4>
                                <p className='text-blue-800 text-sm'>
                                    When self-hosting, you also get the web
                                    dashboard at{" "}
                                    <code className='bg-blue-200 px-1 rounded'>
                                        localhost:3000
                                    </code>
                                    . You can manage providers and create unified
                                    API keys just like Cloud users — useful if
                                    you want a single Chitthi key instead of
                                    passing provider headers every time.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DocsShell>
    )
}
