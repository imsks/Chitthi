# Chitthi API Test Examples

## User-Provided API Keys

### 1. Send Email with Breevo API Key

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

### 2. Send Email with SendGrid API Key

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
    "sendgrid_api_key": "your_sendgrid_api_key_here"
  }'
```

### 3. Send Email with MailerSend API Key

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
    "mailersend_api_key": "your_mailersend_api_key_here"
  }'
```

## Fallback Mode (Config-based API Keys)

If no user-provided API keys are sent, the system will use the configured API keys from environment variables:

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

## Check Email Logs

```bash
curl http://localhost:8080/email-logs?limit=10
```

## API Key Priority

When multiple API keys are provided, the system uses this priority order:

1. `breevo_api_key` (highest priority)
2. `sendgrid_api_key`
3. `mailersend_api_key` (lowest priority)

Only the first valid API key will be used.
