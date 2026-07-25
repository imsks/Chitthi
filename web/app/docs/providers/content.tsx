"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Server, Zap } from "lucide-react"
import { CodeBlock } from "@/lib/docs"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function ProvidersContent() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                        Email Providers
                    </h1>
                    <p className='text-xl text-gray-600 mb-8'>
                        Chitthi supports multiple email providers. How you
                        configure them depends on your integration mode.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Provider Setup by Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-2 gap-6'>
                            <div className='p-4 rounded-lg bg-purple-50 border border-purple-200'>
                                <div className='flex items-center space-x-2 mb-3'>
                                    <Cloud className='w-5 h-5 text-purple-600' />
                                    <h4 className='font-semibold'>
                                        Cloud Users
                                    </h4>
                                </div>
                                <p className='text-sm text-gray-600'>
                                    Add provider keys via{" "}
                                    <strong>Dashboard → Providers</strong>. Your
                                    keys are encrypted and stored securely.
                                    Chitthi handles routing automatically when
                                    you use your Chitthi API key.
                                </p>
                            </div>
                            <div className='p-4 rounded-lg bg-blue-50 border border-blue-200'>
                                <div className='flex items-center space-x-2 mb-3'>
                                    <Server className='w-5 h-5 text-blue-600' />
                                    <h4 className='font-semibold'>
                                        Self-Host Users
                                    </h4>
                                </div>
                                <p className='text-sm text-gray-600'>
                                    Pass provider keys directly in request
                                    headers (e.g.{" "}
                                    <code className='text-xs'>
                                        X-SendGrid-API-Key
                                    </code>
                                    ). Or use the local Dashboard to configure
                                    providers persistently.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Supported Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid md:grid-cols-3 gap-4'>
                            {[
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
                                        <code className='bg-white px-2 py-1 rounded text-xs'>
                                            {provider.header}
                                        </code>
                                    </div>
                                    <p className='text-gray-600 text-sm'>
                                        {provider.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue='sendgrid' className='w-full'>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='sendgrid'>SendGrid</TabsTrigger>
                        <TabsTrigger value='breevo'>Breevo</TabsTrigger>
                        <TabsTrigger value='mailersend'>MailerSend</TabsTrigger>
                    </TabsList>

                    <TabsContent value='sendgrid' className='space-y-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>SendGrid Example</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id='sendgrid-example'
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
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='breevo' className='space-y-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Breevo Example</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id='breevo-example'
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
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='mailersend' className='space-y-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>MailerSend Example</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id='mailersend-example'
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
                                    Provider Priority & Failover
                                </h4>
                                <div className='text-blue-800 space-y-1 text-sm'>
                                    <div>
                                        1.{" "}
                                        <strong>Chitthi API key</strong>{" "}
                                        (Dashboard-configured provider)
                                    </div>
                                    <div>
                                        2.{" "}
                                        <strong>
                                            Header-based provider keys
                                        </strong>{" "}
                                        (explicit in request)
                                    </div>
                                    <div>
                                        3.{" "}
                                        <strong>
                                            Environment-configured providers
                                        </strong>{" "}
                                        (fallback)
                                    </div>
                                </div>
                                <p className='text-blue-700 text-xs mt-2'>
                                    Failover order: SendGrid → Breevo →
                                    MailerSend
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DocsShell>
    )
}
