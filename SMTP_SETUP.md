# SMTP Configuration Guide

## Overview

The email service now supports SMTP as an additional email provider alongside Breevo, SendGrid, and MailerSend. SMTP will be used as a fallback option if other providers fail.

## Configuration

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

## Popular SMTP Providers

### Gmail

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password
SMTP_FROM=your-email@gmail.com
SMTP_USE_TLS=true
```

### Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
SMTP_USE_TLS=true
```

### Yahoo

```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@yahoo.com
SMTP_USE_TLS=true
```

### Custom SMTP Server

```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@your-domain.com
SMTP_USE_TLS=true
```

## How It Works

1. **Fallback System**: SMTP will be used as a fallback if other providers (Breevo, SendGrid, MailerSend) fail
2. **Priority Order**: Breevo → SendGrid → MailerSend → SMTP
3. **No API Changes**: The existing API endpoints remain unchanged
4. **Automatic Selection**: The system automatically tries each available provider until one succeeds

## Security Notes

-   For Gmail, use App Passwords instead of your regular password
-   Enable 2-factor authentication on your email account
-   Use environment variables for sensitive information
-   Consider using dedicated email services for production

## Testing

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
