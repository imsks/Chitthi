# 📬 Chitthi — Email Sending Microservice (Beta)

Chitthi is a lightweight email-sending microservice built in Go.  
It supports multiple third-party providers like Breevo, SendGrid, and MailerSend with features like BYOK (Bring Your Own Key), request logging, Redis caching, and more.

---

## ✅ Features (Beta)

-   Send HTML emails via multiple providers (Breevo, SendGrid, MailerSend)
-   **BYOK (Bring Your Own Key)** - Users can pass their own API keys
-   Fallback to configured API keys when user keys not provided
-   Cache usage in Redis
-   Log send events in Postgres
-   Pluggable payload mapping for different providers

---

## 🚀 API Usage

### User-Provided API Keys (Recommended)

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

1. **Breevo** - Use `breevo_api_key` in request
2. **SendGrid** - Use `sendgrid_api_key` in request
3. **MailerSend** - Use `mailersend_api_key` in request

### API Key Priority

When multiple API keys are provided, the system uses this priority order:

1. `breevo_api_key` (highest priority)
2. `sendgrid_api_key`
3. `mailersend_api_key` (lowest priority)

Only the first valid API key will be used.

### Fallback Mode

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

### Check Email Logs

```bash
curl http://localhost:8080/email-logs?limit=10
```

---

### Folder Structure

```
chitthi/
├── cmd/ # Entry point
│ └── main.go
├── internal/ # All core business logic
│ ├── api/ # HTTP handlers
│ ├── config/ # .env loading
│ ├── email/ # Provider-specific logic (Breevo, SendGrid, MailerSend)
│ ├── queue/ # RabbitMQ logic
│ ├── cache/ # Redis helpers
│ ├── db/ # Postgres logic
│ └── model/ # Structs: EmailJob, Logs etc.
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

👀 Roadmap
• Provider Adapter Interface
• Usage stats (GET /usage)
• Rate limiting via Redis
• RabbitMQ-based queue system
• Admin Dashboard (V2)
• Templates, Contacts, Logs (V2)

### Tech Stack

    •	Golang
    •	Redis (usage tracking)
    •	Postgres (logging)
    •	Docker + Compose
    •	Breevo (Email API)
    •	SendGrid (Email API)
    •	MailerSend (Email API)

### 👋 Contribute

Want to contribute? Fork this repo or reach out at sachinkshuklaoo7@email.com
