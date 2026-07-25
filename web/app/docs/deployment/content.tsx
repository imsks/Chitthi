"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { CheckCircle, Database, Settings } from "lucide-react"
import { CodeBlock } from "@/lib/docs"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function DeploymentContent() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                        Deployment
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>
                        Deploy your self-hosted Chitthi instance to production.
                    </p>
                    <Card className='bg-purple-50 border-purple-200'>
                        <CardContent className='py-4 px-5'>
                            <p className='text-sm text-purple-800'>
                                <strong>Cloud users:</strong> Deployment is
                                handled for you. This section is for self-host
                                users only.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Database className='w-5 h-5 mr-2 text-blue-600' />
                            Docker Deployment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='docker-start'
                            code={`# Start all services
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Settings className='w-5 h-5 mr-2 text-green-600' />
                            Production Image
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='build-production'
                            code={`# Build production image
docker build -t chitthi-app .

# Run with environment variables
docker run -p 8080:8080 \\
  -e DATABASE_URL="postgres://..." \\
  -e REDIS_URL="redis://..." \\
  -e JWT_SECRET="..." \\
  -e ENCRYPTION_KEY="..." \\
  chitthi-app`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Production Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-4'>
                            {[
                                "Set APP_ENV=production",
                                "Configure production DATABASE_URL",
                                "Set strong JWT_SECRET & ENCRYPTION_KEY",
                                "Set up Redis for caching",
                                "Configure logging levels",
                                "Set up monitoring and alerting",
                                "Enable HTTPS/TLS via reverse proxy",
                                "Enable rate limiting"
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
                                        • Use environment variables for all
                                        sensitive config
                                    </div>
                                    <div>
                                        • Enable connection pooling for database
                                    </div>
                                    <div>
                                        • Use reverse proxy (nginx/Caddy) for
                                        TLS termination
                                    </div>
                                    <div>
                                        • Pin Docker image tags instead of
                                        latest
                                    </div>
                                    <div>
                                        • Back up the Postgres volume regularly
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DocsShell>
    )
}
