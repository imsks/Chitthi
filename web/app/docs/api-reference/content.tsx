"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/lib/docs"
import { DocsShell } from "@/lib/docs/docs-shell"

export default function ApiReferenceContent() {
    return (
        <DocsShell>
            <div className='space-y-8'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                        API Reference
                    </h1>
                    <p className='text-xl text-gray-600 mb-8'>
                        The same API works for both Cloud and Self-Host. Only the
                        base URL and authentication method differ.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Base URL</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            <div className='flex items-center space-x-3'>
                                <Badge className='bg-purple-100 text-purple-800'>
                                    Cloud
                                </Badge>
                                <code className='bg-gray-100 px-3 py-1 rounded text-sm'>
                                    https://chitthi-572964795629.asia-south1.run.app
                                </code>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Badge className='bg-blue-100 text-blue-800'>
                                    Self-Host
                                </Badge>
                                <code className='bg-gray-100 px-3 py-1 rounded text-sm'>
                                    http://localhost:8080
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Authentication</CardTitle>
                        <CardDescription>
                            Two authentication approaches depending on your setup
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue='cloud-auth' className='w-full'>
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='cloud-auth'>
                                    Cloud Users
                                </TabsTrigger>
                                <TabsTrigger value='selfhost-auth'>
                                    Self-Host Users
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='cloud-auth' className='mt-4'>
                                <div className='space-y-3'>
                                    <p className='text-sm text-gray-600'>
                                        Use your{" "}
                                        <strong>Chitthi API key</strong>{" "}
                                        (generated on the Dashboard). Chitthi
                                        resolves the provider and sender
                                        automatically.
                                    </p>
                                    <div className='bg-gray-50 p-4 rounded-lg space-y-1 text-sm'>
                                        <div>
                                            <code>
                                                Authorization: Bearer
                                                &lt;chitthi_key&gt;
                                            </code>
                                        </div>
                                        <div>
                                            or{" "}
                                            <code>
                                                X-Chitthi-API-Key:
                                                &lt;chitthi_key&gt;
                                            </code>
                                        </div>
                                        <div>
                                            or{" "}
                                            <code>
                                                {`"api_key": "<chitthi_key>"`}
                                            </code>{" "}
                                            in body
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent
                                value='selfhost-auth'
                                className='mt-4'>
                                <div className='space-y-3'>
                                    <p className='text-sm text-gray-600'>
                                        Pass your{" "}
                                        <strong>
                                            email provider API key
                                        </strong>{" "}
                                        directly in a header. Chitthi detects the
                                        provider from the header name.
                                    </p>
                                    <div className='bg-gray-50 p-4 rounded-lg space-y-1 text-sm'>
                                        <div>
                                            <code>
                                                X-SendGrid-API-Key: &lt;key&gt;
                                            </code>
                                        </div>
                                        <div>
                                            <code>
                                                X-Breevo-API-Key: &lt;key&gt;
                                            </code>
                                        </div>
                                        <div>
                                            <code>
                                                X-MailerSend-API-Key:
                                                &lt;key&gt;
                                            </code>
                                        </div>
                                    </div>
                                    <p className='text-xs text-gray-500'>
                                        You can also use the Dashboard approach
                                        (Chitthi key) if you set it up locally.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Badge className='mr-3 bg-green-100 text-green-800'>
                                POST
                            </Badge>
                            /send-email
                        </CardTitle>
                        <CardDescription>
                            Send an email via any configured provider
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <h4 className='font-semibold mb-2'>Request Body</h4>
                            <CodeBlock
                                id='api-send-body'
                                language='json'
                                code={`{
  "from_email": "sender@example.com",
  "from_name": "Sender Name",
  "to_email": "recipient@example.com",
  "to_name": "Recipient Name",
  "subject": "Email Subject",
  "html_content": "<h1>Hello World!</h1>"
}`}
                            />
                            <p className='text-xs text-gray-500 mt-2'>
                                <strong>Cloud users:</strong>{" "}
                                <code>from_email</code> is optional — resolved
                                from your verified sender.
                            </p>
                        </div>

                        <div>
                            <h4 className='font-semibold mb-2'>
                                Success Response
                            </h4>
                            <CodeBlock
                                id='api-send-response'
                                language='json'
                                code={`{
  "status": true,
  "message": "Email sent successfully",
  "data": {
    "sent_to": "recipient@example.com",
    "sent_from": "sender@example.com",
    "subject": "Email Subject",
    "provider": "sendgrid"
  }
}`}
                            />
                        </div>

                        <div>
                            <h4 className='font-semibold mb-2'>
                                Error Response
                            </h4>
                            <CodeBlock
                                id='api-error-response'
                                language='json'
                                code={`{
  "status": false,
  "message": "Failed to send email",
  "error": "Invalid API key or no providers configured"
}`}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Badge className='mr-3 bg-blue-100 text-blue-800'>
                                GET
                            </Badge>
                            /
                        </CardTitle>
                        <CardDescription>Health check endpoint</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock
                            id='api-health'
                            language='json'
                            code={`{
  "status": true,
  "message": "Chitthi is running"
}`}
                        />
                    </CardContent>
                </Card>
            </div>
        </DocsShell>
    )
}
