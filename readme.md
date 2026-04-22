# 📬 Chitthi

[![Version](https://img.shields.io/badge/Version-v1.0.0-green.svg)](https://github.com/imsks/chitthi)
[![Go Version](https://img.shields.io/badge/Go-1.25.0-blue.svg)](https://golang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)

A lightweight, production-ready email microservice built in Go with **BYOK (Bring Your Own Key)** approach and multi-provider support.

---

## 📋 Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Quick Start](#quick-start)
-   [API Documentation](#api-documentation)
-   [Email Providers](#email-providers)
-   [Configuration](#configuration)
-   [Development](#development)
-   [Deployment](#deployment)
-   [Contributing](#contributing)

---

## 🎯 Overview

Chitthi is a modern email microservice designed for developers who want simplicity without sacrificing power. Built with Go, it provides a clean REST API for sending emails through multiple providers while maintaining complete control over your API keys.

### Key Benefits

-   **🔐 BYOK Security**: Bring Your Own Key approach ensures your API keys stay secure
-   **🔄 Multi-Provider**: Support for Breevo, SendGrid, MailerSend, and SMTP
-   **⚡ Header-based Credentials**: Secure credential management via HTTP headers
-   **🧠 Smart Routing**: Automatic provider detection based on credentials
-   **📊 Postgres schema**: Users, providers, unified API keys, and daily aggregates (`user_logs`)
-   **🚀 Production Ready**: Redis caching, error handling, and monitoring

---

## ✨ Features

-   ✅ **Multi-Provider Support**: Breevo, SendGrid, MailerSend, SMTP
-   ✅ **BYOK (Bring Your Own Key)**: Users provide their own API keys
-   ✅ **Header-based Credentials**: Secure credential management
-   ✅ **Automatic Provider Detection**: Smart routing based on credentials
-   ✅ **Redis Caching**: Performance optimization
-   ✅ **PostgreSQL**: Unified API keys, providers, and daily user metrics
-   ✅ **Docker Ready**: Containerized deployment
-   ✅ **Production Ready**: Error handling, logging, monitoring

---

## 🚀 Quick Start

### Prerequisites

-   **Docker & Docker Compose** (backend API, PostgreSQL, and Redis run in containers)
-   **Node.js 18+** (for the `web/` frontend; `npm install` runs automatically on first `./dev.sh frontend`)
-   **Go 1.25+** (only if you run the API on the host with `go run` / `air` instead of Docker)
-   **Git**

### Option 1: Development script (recommended)

From the repo root, use two terminals:

```bash
# Terminal 1 — Postgres, Redis, and Go API (Air) via docker-compose.yml
./dev.sh backend

# Terminal 2 — Next.js app in ./web
./dev.sh frontend
```

Other commands:

```bash
./dev.sh infra    # only db + redis (detached), for local Go without the app container
./dev.sh down     # docker compose down
./dev.sh help     # usage
```

On first `./dev.sh backend`, if `.env` is missing it is created with `DATABASE_URL` / `REDIS_URL` pointing at Docker service names (`db`, `redis`), which is what the `app` container expects.

### Option 2: Manual setup

#### 1. Clone the Repository

```bash
git clone https://github.com/imsks/chitthi.git
cd chitthi
```

#### 2. Start infrastructure

```bash
docker compose up redis db -d
```

#### 3. Run database migrations

Requires [golang-migrate](https://github.com/golang-migrate/migrate). From the repo root (Postgres must be reachable on `localhost:5432` when ports are published as in `docker-compose.yml`):

```bash
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up
```

#### 4. Install web dependencies

```bash
cd web && npm install && cd ..
```

#### 5. Run the services

**API in Docker (matches `./dev.sh backend`):**

```bash
docker compose up --build app
```

**API on the host** (use `localhost` in `.env` for `DATABASE_URL` and `REDIS_URL`):

```bash
go run cmd/main.go
# or: air
```

**Frontend** (either way):

```bash
cd web && npm run dev
```

#### 6. Access the applications

-   **Backend API**: http://localhost:8080
-   **Web Frontend**: http://localhost:3000
-   **Documentation**: http://localhost:3000/docs
-   **Quick Start Guide**: http://localhost:3000/quick-start

#### 7. Test the API

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
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'
```

---

## 📚 API Documentation

### Endpoints

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| `POST` | `/send-email` | Send email via any provider |
| `GET`  | `/`           | Health check                |

### Send Email

**Endpoint**: `POST /send-email`

**Headers**:

-   `Content-Type: application/json`
-   `X-SMTP-*` (for SMTP)
-   `X-SendGrid-API-Key` (for SendGrid)
-   `X-Breevo-API-Key` (for Breevo)
-   `X-MailerSend-API-Key` (for MailerSend)

**Request Body**:

```json
{
    "from_email": "sender@example.com",
    "from_name": "Sender Name",
    "to_email": "recipient@example.com",
    "to_name": "Recipient Name",
    "subject": "Email Subject",
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
}
```

**Response**:

```json
{
    "status": true,
    "message": "Email sent successfully",
    "data": {
        "sent_to": "recipient@example.com",
        "sent_from": "sender@example.com",
        "subject": "Email Subject",
        "provider": "smtp"
    }
}
```

---

## 📧 Email Providers

### Supported Providers

| Provider       | Header Key             | Description               |
| -------------- | ---------------------- | ------------------------- |
| **SMTP**       | `X-SMTP-*`             | Direct SMTP with STARTTLS |
| **SendGrid**   | `X-SendGrid-API-Key`   | SendGrid v3 API           |
| **Breevo**     | `X-Breevo-API-Key`     | Breevo Email API          |
| **MailerSend** | `X-MailerSend-API-Key` | MailerSend API            |

### Provider Examples

#### SendGrid

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-SendGrid-API-Key: your-sendgrid-api-key" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'
```

#### Breevo

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-Breevo-API-Key: your-breevo-api-key" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'
```

#### MailerSend

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-MailerSend-API-Key: your-mailersend-api-key" \
  -d '{
    "from_email": "sender@example.com",
    "to_email": "recipient@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World!</h1>"
  }'
```

### Provider Priority

1. **Header-based providers** (highest priority)
2. **Request body API keys** (legacy support)
3. **Environment-configured providers** (fallback)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the repository root (or let `./dev.sh backend` create a starter file if none exists).

**Docker Compose (`app` container):** use the Postgres and Redis **service names** so the API resolves them on the Compose network:

```env
PORT=8080
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable
REDIS_URL=redis://redis:6379
```

**Running the API on your machine** (`go run`, `air`): use **localhost** and exposed ports:

```env
PORT=8080
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable
REDIS_URL=redis://localhost:6379
```

Shared optional variables (fallback providers, SMTP):

```env
BREEVO_API_KEY=your_breevo_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_REGION=global
MAILERSEND_API_KEY=your_mailersend_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_USE_TLS=true
```

---

## 🛠️ Development

### Project Structure

```
chitthi/
├── cmd/                    # Application entry point
│   └── main.go
├── internal/               # Core business logic
│   ├── config/             # Configuration management
│   ├── database/           # Database connections
│   ├── email/              # Email provider implementations
│   ├── handler/            # HTTP handlers
│   ├── model/              # Data models
│   └── modules/            # Business logic modules
├── web/                    # Next.js frontend
├── migrations/             # Database migrations
├── docker-compose.yml      # app, db, redis
├── Dockerfile              # API image (Air for dev)
├── dev.sh                  # ./dev.sh backend | frontend | infra | down
└── go.mod                  # Go dependencies
```

### Development commands

```bash
# Recommended: API + DB + Redis in Docker, frontend locally
./dev.sh backend
./dev.sh frontend

# Or run the API stack with Compose directly
docker compose up --build app

# Host-only API (set DATABASE_URL/REDIS_URL to localhost in .env)
air
# or: go run cmd/main.go

# Tests and build
go test ./...
go build -o main cmd/main.go
```

### Database Migrations

Install [golang-migrate](https://github.com/golang-migrate/migrate) (CLI) if you do not have it yet. Ensure PostgreSQL is running and the `chitthi` database exists (for example via `docker compose up db -d`).

From the repository root:

```bash
# Apply all migrations (users, providers, unified API keys, etc.; legacy per-email `email_logs` is removed in migration 000003)
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up

# Roll back one step (repeat to roll back further)
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" down 1
```

Use the same `postgres://...` connection string as your `DATABASE_URL` when not using localhost (adjust host, user, password, and database name accordingly).

---

## 🚀 Deployment

### Docker Deployment

```bash
# Start all services
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f
```

### Production Deployment

```bash
# Build production image
docker build -t chitthi-app .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL="postgres://..." \
  -e REDIS_URL="redis://..." \
  chitthi-app
```

### Production Checklist

-   [ ] Set `APP_ENV=production`
-   [ ] Configure database URLs
-   [ ] Set API keys for email providers
-   [ ] Set up Redis for caching
-   [ ] Configure logging levels
-   [ ] Set up monitoring and alerting

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/imsks/chitthi.git
cd chitthi
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

-   Follow the existing code style
-   Add tests for new functionality
-   Update documentation as needed

### 4. Test Your Changes

```bash
go test ./...
```

### 5. Submit a Pull Request

-   Provide a clear description of your changes
-   Include any relevant issue numbers
-   Ensure all tests pass

### Development Guidelines

-   **Code Style**: Follow Go conventions
-   **Documentation**: Update README and API docs
-   **Testing**: Add tests for new features
-   **Security**: Follow security best practices
-   **Performance**: Consider performance implications

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Getting Help

1. **Check Documentation**: Review this README and API docs
2. **Search Issues**: Look for similar issues in the repository
3. **Create Issue**: Open a new issue with detailed information
4. **Community**: Join our community discussions

### Common Issues

-   **Database Connection**: Ensure PostgreSQL is running and accessible
-   **Email Delivery**: Check provider API keys and credentials
-   **Redis Connection**: Verify Redis is running on the correct port

### Contact

-   **Email**: sachinkshuklaoo7@email.com
-   **Issues**: [GitHub Issues](https://github.com/imsks/chitthi/issues)
-   **Discussions**: [GitHub Discussions](https://github.com/imsks/chitthi/discussions)

---

## 🎯 Roadmap

-   [ ] **Rate Limiting**: Redis-based rate limiting
-   [ ] **Queue System**: RabbitMQ integration for async processing
-   [ ] **Admin Dashboard**: Web interface for monitoring
-   [ ] **Email Templates**: Template management system
-   [ ] **Bulk Sending**: Support for bulk email operations
-   [ ] **Analytics**: Email delivery analytics and reporting
-   [ ] **Multi-tenant**: Support for multiple organizations

---

**Built with ❤️ by Sachin in 🇮🇳**

_Chitthi - Empowering developers with simple email solutions_
