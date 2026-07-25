"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Globe, KeyRound, ExternalLink, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CodeBlock } from "@/lib/docs"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function CloudPageContent() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <div className='flex items-center space-x-3 mb-4'>
                        <Cloud className='w-8 h-8 text-purple-600' />
                        <h1 className='text-4xl font-bold text-gray-900'>
                            Cloud (Hosted)
                        </h1>
                    </div>
                    <p className='text-xl text-gray-600 mb-6'>
                        Use Chitthi&apos;s hosted API — no infrastructure to set
                        up. Just configure your provider on the Dashboard and
                        start sending emails.
                    </p>
                    <Badge className='bg-purple-100 text-purple-800'>
                        Best for: Quick integrations, prototypes, teams without
                        DevOps
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='flex items-start space-x-4'>
                                <span className='w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0'>
                                    1
                                </span>
                                <div>
                                    <h4 className='font-semibold'>
                                        Sign up on the Dashboard
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        Use Google OAuth to create an account.
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-start space-x-4'>
                                <span className='w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0'>
                                    2
                                </span>
                                <div>
                                    <h4 className='font-semibold'>
                                        Add your email provider
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        Go to Providers → add your
                                        SendGrid/Breevo/MailerSend API key +
                                        verified sender email.
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-start space-x-4'>
                                <span className='w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0'>
                                    3
                                </span>
                                <div>
                                    <h4 className='font-semibold'>
                                        Generate a Chitthi API key
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        Go to API Keys → Generate. This unified
                                        key authenticates all your requests.
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-start space-x-4'>
                                <span className='w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0'>
                                    4
                                </span>
                                <div>
                                    <h4 className='font-semibold'>
                                        Call POST /send-email
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        Send your Chitthi API key in the
                                        Authorization header. Chitthi routes to
                                        your configured provider automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Send an Email</CardTitle>
                        <CardDescription>
                            Use your Chitthi API key — no provider header needed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <CodeBlock
                            id='cloud-send-email'
                            code={`curl -X POST https://chitthi-572964795629.asia-south1.run.app/send-email \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_CHITTHI_API_KEY" \\
  -d '{
    "to_email": "recipient@example.com",
    "subject": "Hello from Chitthi!",
    "html_content": "<h1>It works!</h1>"
  }'`}
                        />
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <h4 className='font-semibold text-sm mb-2'>
                                Authentication Options
                            </h4>
                            <div className='space-y-1 text-sm text-gray-600'>
                                <div>
                                    <code className='bg-white px-1.5 py-0.5 rounded text-xs'>
                                        Authorization: Bearer &lt;key&gt;
                                    </code>
                                </div>
                                <div>
                                    <code className='bg-white px-1.5 py-0.5 rounded text-xs'>
                                        X-Chitthi-API-Key: &lt;key&gt;
                                    </code>
                                </div>
                                <div>
                                    <code className='bg-white px-1.5 py-0.5 rounded text-xs'>
                                        {`"api_key": "<key>"`}
                                    </code>{" "}
                                    in JSON body
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-purple-50 border-purple-200'>
                    <CardContent className='pt-6'>
                        <div className='flex items-start space-x-3'>
                            <KeyRound className='w-6 h-6 text-purple-600 mt-0.5' />
                            <div>
                                <h4 className='font-semibold text-purple-900 mb-1'>
                                    No from_email needed
                                </h4>
                                <p className='text-purple-800 text-sm'>
                                    When using a Chitthi API key, the sender
                                    email is automatically resolved from the
                                    verified sender you configured in the
                                    Dashboard. You can still override it if
                                    needed.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className='flex justify-center'>
                    <Button
                        asChild
                        className='bg-purple-600 hover:bg-purple-700 px-8'>
                        <Link href='/dashboard'>
                            Open Dashboard
                            <ExternalLink className='w-4 h-4 ml-2' />
                        </Link>
                    </Button>
                </div>
            </div>
        </DocsShell>
    )
}
