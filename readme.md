# 📬 Chitthi — Email Sending Microservice

Chitthi is a lightweight email-sending microservice built in Go.  
It supports multiple third-party providers like Breevo, SendGrid, MailerSend, and SMTP with features like BYOK (Bring Your Own Key), header-based credentials, request logging, Redis caching, and more.

---

## ✅ Features

-   Send HTML emails via multiple providers (Breevo, SendGrid, MailerSend, SMTP)
-   **BYOK (Bring Your Own Key)** - Users can pass their own API keys
-   **Header-based Credentials** - Secure credential management via HTTP headers
-   **SMTP Support** - Direct SMTP integration with STARTTLS support
-   **Provider Selection** - Choose specific email providers
-   Fallback to configured API keys when user keys not provided
-   Cache usage in Redis
-   Log send events in Postgres
-   Pluggable payload mapping for different providers

---

## 🚀 API Usage

### Method 1: Header-based Credentials (Recommended)

Users can pass their credentials securely via HTTP headers:

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-SMTP-Host: smtp.gmail.com" \
  -H "X-SMTP-Port: 587" \
  -H "X-SMTP-Username: your-email@gmail.com" \
  -H "X-SMTP-Password: your-app-password" \
  -H "X-SMTP-From: your-email@gmail.com" \
  -H "X-SMTP-Use-TLS: true" \
  -d '{
    "from_email": "sender@example.com",
    "from_name": "Sender Name",
    "to_email": "recipient@example.com",
    "to_name": "Recipient Name",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>",
    "provider": "smtp"
  }'
```

### Method 2: API Keys in Request Body (Legacy)

Users can pass their own API keys in the request body:

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "from_email": "sender@example.com",
    "from_name": "Sender Name",
    "to_email": "recipient@example.com",
    "to_name": "Recipient Name",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>",
    "breevo_api_key": "your_breevo_api_key_here"
  }'
```

### Supported Providers

1. **SMTP** - Use SMTP headers or configure in environment
2. **Breevo** - Use `X-Breevo-API-Key` header or `breevo_api_key` in request
3. **SendGrid** - Use `X-SendGrid-API-Key` header or `sendgrid_api_key` in request
4. **MailerSend** - Use `X-MailerSend-API-Key` header or `mailersend_api_key` in request

### Available Header Credentials

#### API Keys

-   `X-Breevo-API-Key`: Breevo API key
-   `X-SendGrid-API-Key`: SendGrid API key
-   `X-SendGrid-Region`: SendGrid region (`global` or `eu`, defaults to `global`)
-   `X-MailerSend-API-Key`: MailerSend API key

#### SMTP Credentials

-   `X-SMTP-Host`: SMTP server hostname
-   `X-SMTP-Port`: SMTP port (default: 587)
-   `X-SMTP-Username`: SMTP username
-   `X-SMTP-Password`: SMTP password
-   `X-SMTP-From`: From email address
-   `X-SMTP-Use-TLS`: Use TLS (true/false, default: true)

### Automatic Provider Detection

The system automatically detects which provider to use based on the credentials you provide in the headers. **No need to specify the provider in the request body!**

#### Examples:

**SendGrid (detected automatically):**

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-SendGrid-API-Key: your-sendgrid-api-key" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
  }'
```

**SMTP (detected automatically):**

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-SMTP-Host: smtp.gmail.com" \
  -H "X-SMTP-Username: your-email@gmail.com" \
  -H "X-SMTP-Password: your-app-password" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
  }'
```

**Breevo (detected automatically):**

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-Breevo-API-Key: your-breevo-api-key" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
  }'
```

### Provider Selection (Optional)

You can still specify which provider to use by adding the `provider` field, but it must match the detected provider from headers:

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-SMTP-Host: smtp.gmail.com" \
  -H "X-SMTP-Username: your-email@gmail.com" \
  -H "X-SMTP-Password: your-app-password" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>",
    "provider": "smtp"
  }'
```

### Priority Order

When multiple providers are available, the system uses this priority order:

1. **Header-based providers** (highest priority)
2. **Request body API keys** (legacy support)
3. **Environment-configured providers** (fallback)

### Fallback Mode

If no credentials are provided, the system will use the configured credentials from environment variables:

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "from_email": "sender@example.com",
    "from_name": "Sender Name",
    "to_email": "recipient@example.com",
    "to_name": "Recipient Name",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
  }'
```

### Check Email Logs

```bash
curl http://localhost:8080/email-logs?limit=10
```

### Example: Send Email with SMTP

```bash
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--header 'X-SMTP-Host: smtp.gmail.com' \
--header 'X-SMTP-Port: 587' \
--header 'X-SMTP-Username: your-email@gmail.com' \
--header 'X-SMTP-Password: your-app-password' \
--header 'X-SMTP-From: your-email@gmail.com' \
--header 'X-SMTP-Use-TLS: true' \
--data-raw '{
   "from_email": "your-email@gmail.com",
   "from_name": "Your Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject": "Test Email",
   "html_content": "<html><body><h1>Hello!</h1><p>This is a test email sent via SMTP.</p></body></html>"
}'
```

### Example: Send Email with Breevo

```bash
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--header 'X-Breevo-API-Key: your-breevo-api-key' \
--data-raw '{
   "from_email": "sender@example.com",
   "from_name": "Sender Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject": "Test Email",
   "html_content": "<html><body><h1>Hello!</h1><p>This is a test email sent via Breevo.</p></body></html>"
}'
```

### Example: Send Email with SendGrid

#### Global Region (Default)

```bash
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--header 'X-SendGrid-API-Key: your-sendgrid-api-key' \
--data-raw '{
   "from_email": "sender@example.com",
   "from_name": "Sender Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject": "Test Email",
   "html_content": "<html><body><h1>Hello!</h1><p>This is a test email sent via SendGrid.</p></body></html>"
}'
```

#### EU Region

```bash
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--header 'X-SendGrid-API-Key: your-sendgrid-api-key' \
--header 'X-SendGrid-Region: eu' \
--data-raw '{
   "from_email": "sender@example.com",
   "from_name": "Sender Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject": "Test Email",
   "html_content": "<html><body><h1>Hello!</h1><p>This is a test email sent via SendGrid EU.</p></body></html>"
}'
```

---

### Folder Structure

```
chitthi/
├── cmd/ # Entry point
│ └── main.go
├── internal/ # All core business logic
│ ├── config/ # .env loading
│ ├── database/ # Postgres logic
│ ├── email/ # Provider-specific logic (Breevo, SendGrid, MailerSend, SMTP)
│ ├── handler/ # HTTP handlers
│ ├── model/ # Structs: EmailJob, Logs etc.
│ └── modules/ # Business logic modules
│   └── email/ # Email service and handlers
├── migrations/ # Database migrations
├── .env
├── go.mod
├── go.sum
└── README.md
```

### Run the App

```bash
go run cmd/main.go
```

## 🚀 Run Locally (for Development)

### 1. Clone the repo & setup Go modules

```bash
git clone https://github.com/yourname/chitthi.git
cd chitthi
go mod tidy
```

### 2. Start Redis & Postgres with Docker

```bash
docker compose up redis db
```

### 3. Run the Go app with hot reload (requires air)

```bash
air
```

## 🐳 Run with Docker (no hot reload)

```bash
docker compose up --build
```

## 📦 Production Build

```bash
docker build -t chitthi-app .
```

## Migration Guide

### Create Email Logs Table

```
migrate create -ext sql -dir migrations -seq create_email_logs_table
```

### Run Migrations

1. Locally

```
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up
```

## Connect to DB

1. Connect using Docker CLI

```bash
docker exec -it chitthi_db psql -U postgres -d chitthi
```

2. Inside the Postgres CLI:

```sql
\dt
```

3. Check the structure of the a table:

```
\d email_logs
```

4. Run SQL Query in Postgres CLI

```sql
SELECT * FROM email_logs LIMIT 5;
```

### Roadmap

🔌 API Endpoints (WIP)
• POST /send-email: Send email via configured provider
• GET /usage: View usage stats (coming)
• POST /register-key: (optional for public launch)

### 👀 Roadmap

• Usage stats (GET /usage)
• Rate limiting via Redis
• RabbitMQ-based queue system
• Admin Dashboard (V2)
• Templates, Contacts, Logs (V2)
• Multi-tenant support
• Email templates
• Bulk email sending

### Tech Stack

    •	Golang
    •	Redis (usage tracking)
    •	Postgres (logging)
    •	Docker + Compose
    •	Breevo (Email API)
    •	SendGrid (Email API)
    •	MailerSend (Email API)
    •	SMTP (Direct email sending)

## 🔐 Security Best Practices

### SMTP Configuration

When using SMTP, follow these security guidelines:

1. **Use App Passwords**: For Gmail, use App Passwords instead of your regular password
2. **Enable 2FA**: Enable two-factor authentication on your email account
3. **Use Environment Variables**: Store sensitive credentials in environment variables for production
4. **HTTPS Only**: Always use HTTPS in production to protect credentials in headers

### Popular SMTP Providers

#### Gmail

```bash
X-SMTP-Host: smtp.gmail.com
X-SMTP-Port: 587
X-SMTP-Username: your-email@gmail.com
X-SMTP-Password: your-app-password
X-SMTP-From: your-email@gmail.com
X-SMTP-Use-TLS: true
```

#### Outlook/Hotmail

```bash
X-SMTP-Host: smtp-mail.outlook.com
X-SMTP-Port: 587
X-SMTP-Username: your-email@outlook.com
X-SMTP-Password: your-password
X-SMTP-From: your-email@outlook.com
X-SMTP-Use-TLS: true
```

#### Yahoo

```bash
X-SMTP-Host: smtp.mail.yahoo.com
X-SMTP-Port: 587
X-SMTP-Username: your-email@yahoo.com
X-SMTP-Password: your-app-password
X-SMTP-From: your-email@yahoo.com
X-SMTP-Use-TLS: true
```

## 📚 SendGrid Configuration Guide

### Overview

SendGrid is a powerful email delivery service that provides reliable email sending capabilities. The Chitthi email service integrates with SendGrid's v3 Mail Send API, supporting both global and EU regional endpoints.

### SendGrid v3 API Integration

The system uses SendGrid's v3 Mail Send API:

-   **Global Endpoint**: `https://api.sendgrid.com/v3/mail/send`
-   **EU Endpoint**: `https://api.eu.sendgrid.com/v3/mail/send`

### Environment Configuration

Add the following environment variables to your `.env` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_REGION=global  # or "eu" for EU region
```

### API Key Setup

1. **Create SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **Generate API Key**:
    - Go to Settings → API Keys
    - Create a new API Key with "Mail Send" permissions
    - Copy the generated API key
3. **Verify Sender**: Add and verify your sender email address in SendGrid

### Regional Endpoints

#### Global Region (Default)

-   **Base URL**: `https://api.sendgrid.com`
-   **Use for**: Global users and subusers
-   **Configuration**: `SENDGRID_REGION=global` or omit the variable

#### EU Region

-   **Base URL**: `https://api.eu.sendgrid.com`
-   **Use for**: EU regional subusers
-   **Configuration**: `SENDGRID_REGION=eu`

### Header-based Configuration

You can also configure SendGrid via HTTP headers:

```bash
# Global Region
X-SendGrid-API-Key: your_sendgrid_api_key
X-SendGrid-Region: global  # Optional, defaults to global

# EU Region
X-SendGrid-API-Key: your_sendgrid_api_key
X-SendGrid-Region: eu
```

### Error Handling

The SendGrid integration includes comprehensive error handling:

-   **Authentication Errors**: Invalid API keys
-   **Validation Errors**: Missing required fields
-   **Rate Limiting**: Automatic retry handling
-   **Regional Errors**: Proper endpoint selection

### Testing SendGrid Integration

Test your SendGrid setup:

```bash
# Test with Global Region
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--header 'X-SendGrid-API-Key: your-sendgrid-api-key' \
--data-raw '{
   "from_email": "verified-sender@yourdomain.com",
   "from_name": "Your Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject": "SendGrid Test",
   "html_content": "<h1>Hello from SendGrid!</h1><p>This email was sent via SendGrid v3 API.</p>",
   "provider": "sendgrid"
}'

# Test with EU Region
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--header 'X-SendGrid-API-Key: your-sendgrid-api-key' \
--header 'X-SendGrid-Region: eu' \
--data-raw '{
   "from_email": "verified-sender@yourdomain.com",
   "from_name": "Your Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject": "SendGrid EU Test",
   "html_content": "<h1>Hello from SendGrid EU!</h1><p>This email was sent via SendGrid EU endpoint.</p>",
   "provider": "sendgrid"
}'
```

### SendGrid Best Practices

1. **Verify Senders**: Always verify your sender email addresses in SendGrid
2. **Use App Passwords**: For production, use dedicated API keys with minimal permissions
3. **Monitor Deliverability**: Check SendGrid's Activity Feed for delivery status
4. **Rate Limits**: Be aware of SendGrid's rate limits (100 emails/second by default)
5. **Regional Compliance**: Use EU endpoint if you need GDPR compliance

### SendGrid Response Format

When using SendGrid, you'll receive structured JSON responses:

```json
{
    "status": true,
    "message": "Email sent successfully",
    "data": {
        "sent_to": "recipient@example.com",
        "sent_from": "sender@example.com",
        "subject": "SendGrid Test",
        "provider": "sendgrid",
        "log_saved": true,
        "log_id": 123,
        "log_error": null
    }
}
```

The response includes:

-   **Provider**: Always shows "sendgrid" for SendGrid emails
-   **Region**: The region used (global/eu) is logged in the database
-   **Error Details**: Any SendGrid-specific errors are captured and reported

## 📚 SMTP Configuration Guide

### Overview

The email service supports SMTP as an additional email provider alongside Breevo, SendGrid, and MailerSend. SMTP will be used as a fallback option if other providers fail.

### Environment Configuration

Add the following environment variables to your `.env` file:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_USE_TLS=true
```

### Popular SMTP Providers

#### Gmail

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password
SMTP_FROM=your-email@gmail.com
SMTP_USE_TLS=true
```

#### Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
SMTP_USE_TLS=true
```

#### Yahoo

```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@yahoo.com
SMTP_USE_TLS=true
```

#### Custom SMTP Server

```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@your-domain.com
SMTP_USE_TLS=true
```

### How It Works

1. **Fallback System**: SMTP will be used as a fallback if other providers (Breevo, SendGrid, MailerSend) fail
2. **Priority Order**: Breevo → SendGrid → MailerSend → SMTP
3. **No API Changes**: The existing API endpoints remain unchanged
4. **Automatic Selection**: The system automatically tries each available provider until one succeeds

### Security Notes

-   For Gmail, use App Passwords instead of your regular password
-   Enable 2-factor authentication on your email account
-   Use environment variables for sensitive information
-   Consider using dedicated email services for production

### Testing

After configuration, test with:

```bash
curl --location 'http://localhost:8080/send-email' \
--header 'Content-Type: application/json' \
--data-raw '{
   "from_email": "your-email@gmail.com",
   "from_name": "Your Name",
   "to_email": "recipient@example.com",
   "to_name": "Recipient Name",
   "subject":"Test Email",
   "html_content":"<html><body><h1>Hello!</h1><p>This is a test email sent via SMTP.</p></body></html>"
}'
```

## 👋 Contribute

Want to contribute? Fork this repo or reach out at sachinkshuklaoo7@email.com
