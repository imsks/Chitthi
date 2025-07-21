# 🚀 Chitthi & Saransh - Full-Stack AI Platform

[![Go Version](https://img.shields.io/badge/Go-1.24.3-blue.svg)](https://golang.org)
[![Python Version](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)

A comprehensive platform featuring **Chitthi** - a BYOK (Bring Your Own Key) email microservice, and **Saransh** - an AI-powered news aggregation app inspired by InShorts.

---

## 📋 Table of Contents

-   [Overview](#overview)
-   [Architecture](#architecture)
-   [Quick Start](#quick-start)
-   [Chitthi - Email Microservice](#chitthi---email-microservice)
-   [Saransh - AI News App](#saransh---ai-news-app)
-   [Development](#development)
-   [Deployment](#deployment)
-   [API Documentation](#api-documentation)
-   [Contributing](#contributing)

---

## 🎯 Overview

This repository contains two powerful applications:

### 📬 Chitthi

A lightweight, production-ready email microservice built in Go with:

-   **BYOK (Bring Your Own Key)** - Users provide their own API keys
-   **Multi-provider support** - Breevo, SendGrid, MailerSend, SMTP
-   **Header-based credentials** - Secure credential management
-   **Automatic provider detection** - Smart routing based on credentials
-   **Redis caching** - Performance optimization
-   **PostgreSQL logging** - Comprehensive email tracking

### 📰 Saransh

An AI-powered news aggregation platform built with FastAPI:

-   **Intelligent scraping** - Automated news collection
-   **AI summarization** - 60-word summaries using OpenAI
-   **Content categorization** - Smart news organization
-   **RAG system** - Retrieval-Augmented Generation
-   **Modern UI** - Clean, responsive interface

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Chitthi       │    │   Saransh       │
│   (Go)          │    │   (Python)      │
│                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Email       ││    │  │ News        ││
│  │ Service     ││    │  │ Processing  ││
│  └─────────────┘│    │  └─────────────┘│
│                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Multi-      ││    │  │ AI Agents   ││
│  │ Provider    ││    │  │ (LangChain) ││
│  └─────────────┘│    │  └─────────────┘│
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│           Shared Infrastructure         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │ Redis   │  │PostgreSQL│  │ Docker  ││
│  │(Cache)  │  │(Logging) │  │(Deploy) ││
│  └─────────┘  └─────────┘  └─────────┘│
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

-   **Docker & Docker Compose**
-   **Go 1.24.3+** (for Chitthi development)
-   **Python 3.8+** (for Saransh development)
-   **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chitthi.git
cd chitthi
```

### 2. Start Infrastructure

```bash
# Start Redis and PostgreSQL
docker compose up redis db -d
```

### 3. Run Chitthi (Email Service)

```bash
# Development with hot reload
air

# Or run directly
go run cmd/main.go
```

### 4. Run Saransh (AI News App)

```bash
cd Saransh

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Verify Installation

-   **Chitthi**: http://localhost:8080
-   **Saransh**: http://localhost:8000
-   **Saransh API Docs**: http://localhost:8000/docs

---

## 📬 Chitthi - Email Microservice

### Features

-   ✅ **Multi-Provider Support**: Breevo, SendGrid, MailerSend, SMTP
-   ✅ **BYOK (Bring Your Own Key)**: Users provide their own API keys
-   ✅ **Header-based Credentials**: Secure credential management
-   ✅ **Automatic Provider Detection**: Smart routing based on credentials
-   ✅ **Redis Caching**: Performance optimization
-   ✅ **PostgreSQL Logging**: Comprehensive email tracking
-   ✅ **Docker Ready**: Containerized deployment
-   ✅ **Production Ready**: Error handling, logging, monitoring

### API Endpoints

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| `POST` | `/send-email` | Send email via any provider |
| `GET`  | `/email-logs` | Retrieve email logs         |
| `GET`  | `/`           | Health check                |

### Quick API Examples

#### Send Email with SMTP

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
    "html_content": "<h1>Hello World!</h1><p>This is a test email.</p>"
  }'
```

#### Send Email with SendGrid

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

#### Check Email Logs

```bash
curl http://localhost:8080/email-logs?limit=10
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8080

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Provider Configuration (Optional - for fallback)
BREEVO_API_KEY=your_breevo_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_REGION=global
MAILERSEND_API_KEY=your_mailersend_api_key

# SMTP Configuration (Optional - for fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_USE_TLS=true
```

### Supported Email Providers

| Provider       | Header Key             | Description               |
| -------------- | ---------------------- | ------------------------- |
| **SMTP**       | `X-SMTP-*`             | Direct SMTP with STARTTLS |
| **SendGrid**   | `X-SendGrid-API-Key`   | SendGrid v3 API           |
| **Breevo**     | `X-Breevo-API-Key`     | Breevo Email API          |
| **MailerSend** | `X-MailerSend-API-Key` | MailerSend API            |

### Provider Priority

1. **Header-based providers** (highest priority)
2. **Request body API keys** (legacy support)
3. **Environment-configured providers** (fallback)

---

## 📰 Saransh - AI News App

### Features

-   ✅ **AI-Powered Summarization**: 60-word summaries using OpenAI
-   ✅ **Intelligent Scraping**: Automated news collection from multiple sources
-   ✅ **Content Categorization**: Smart news organization
-   ✅ **RAG System**: Retrieval-Augmented Generation
-   ✅ **Modern FastAPI**: High-performance API framework
-   ✅ **LangChain Integration**: Advanced AI agent capabilities
-   ✅ **Docker Ready**: Containerized deployment

### API Endpoints

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| `GET`  | `/health`             | Health check         |
| `GET`  | `/articles`           | Get news articles    |
| `GET`  | `/articles/{id}`      | Get specific article |
| `POST` | `/articles/summarize` | Summarize article    |
| `GET`  | `/docs`               | API documentation    |

### Quick API Examples

#### Health Check

```bash
curl http://localhost:8000/health
```

#### Get Articles

```bash
curl http://localhost:8000/articles
```

#### Summarize Article

```bash
curl -X POST http://localhost:8000/articles/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article",
    "max_words": 60
  }'
```

### Environment Configuration

Create a `.env` file in the `Saransh/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/saransh_db

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
APP_ENV=development
DEBUG=True
LOG_LEVEL=INFO

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
```

---

## 🛠️ Development

### Project Structure

```
chitthi/
├── cmd/                    # Application entry point
│   └── main.go
├── internal/               # Core business logic
│   ├── config/            # Configuration management
│   ├── database/          # Database connections
│   ├── email/             # Email provider implementations
│   ├── handler/           # HTTP handlers
│   ├── model/             # Data models
│   └── modules/           # Business logic modules
├── migrations/            # Database migrations
├── docker-compose.yml     # Infrastructure setup
├── Dockerfile            # Container configuration
└── go.mod               # Go dependencies

Saransh/
├── app/
│   ├── agents/           # AI agents and LangChain
│   ├── api/              # API routes and endpoints
│   ├── db/               # Database models
│   ├── processors/       # News processing
│   ├── scrapers/         # News scraping modules
│   └── utils/            # Utility functions
├── main.py              # Application entry point
├── requirements.txt     # Python dependencies
└── readme.md           # Saransh documentation
```

### Development Commands

#### Chitthi (Go)

```bash
# Run with hot reload (requires air)
air

# Run directly
go run cmd/main.go

# Run tests
go test ./...

# Build for production
go build -o main cmd/main.go
```

#### Saransh (Python)

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run with hot reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run tests
pytest

# Install development dependencies
pip install -r requirements.txt
```

### Database Migrations

```bash
# Run migrations
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up

# Rollback migrations
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" down
```

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

#### Chitthi

```bash
# Build production image
docker build -t chitthi-app .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL="postgres://..." \
  -e REDIS_URL="redis://..." \
  chitthi-app
```

#### Saransh

```bash
# Build production image
cd Saransh
docker build -t saransh-app .

# Run with environment variables
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e OPENAI_API_KEY="your-key" \
  saransh-app
```

### Environment Variables

#### Production Checklist

-   [ ] Set `APP_ENV=production`
-   [ ] Configure database URLs
-   [ ] Set API keys for email providers
-   [ ] Configure OpenAI API key for Saransh
-   [ ] Set up Redis for caching
-   [ ] Configure logging levels
-   [ ] Set up monitoring and alerting

---

## 📚 API Documentation

### Chitthi API

#### Send Email

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
    "html_content": "<h1>Hello World!</h1>"
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
        "provider": "smtp",
        "log_saved": true,
        "log_id": 123
    }
}
```

#### Get Email Logs

**Endpoint**: `GET /email-logs`

**Query Parameters**:

-   `limit` (optional): Number of logs to return (default: 10)
-   `offset` (optional): Number of logs to skip (default: 0)

**Response**:

```json
{
    "status": true,
    "data": [
        {
            "id": 1,
            "recipient_email": "recipient@example.com",
            "subject": "Test Email",
            "provider": "smtp",
            "status": "sent",
            "created_at": "2024-01-01T12:00:00Z"
        }
    ]
}
```

### Saransh API

#### Health Check

**Endpoint**: `GET /health`

**Response**:

```json
{
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00",
    "service": "saransh-news-app",
    "environment": "development"
}
```

#### Get Articles

**Endpoint**: `GET /articles`

**Query Parameters**:

-   `category` (optional): Filter by category
-   `limit` (optional): Number of articles to return
-   `offset` (optional): Number of articles to skip

**Response**:

```json
{
    "articles": [
        {
            "id": 1,
            "title": "Article Title",
            "summary": "60-word summary...",
            "url": "https://example.com/article",
            "category": "technology",
            "published_at": "2024-01-01T12:00:00Z"
        }
    ]
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/yourusername/chitthi.git
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
# Test Chitthi
go test ./...

# Test Saransh
cd Saransh
pytest
```

### 5. Submit a Pull Request

-   Provide a clear description of your changes
-   Include any relevant issue numbers
-   Ensure all tests pass

### Development Guidelines

-   **Code Style**: Follow Go and Python conventions
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

#### Chitthi Issues

-   **Database Connection**: Ensure PostgreSQL is running and accessible
-   **Email Delivery**: Check provider API keys and credentials
-   **Redis Connection**: Verify Redis is running on the correct port

#### Saransh Issues

-   **OpenAI API**: Ensure valid API key is configured
-   **Database**: Check PostgreSQL connection and migrations
-   **Dependencies**: Verify all Python packages are installed

### Contact

-   **Email**: sachinkshuklaoo7@email.com
-   **Issues**: [GitHub Issues](https://github.com/yourusername/chitthi/issues)
-   **Discussions**: [GitHub Discussions](https://github.com/yourusername/chitthi/discussions)

---

## 🎯 Roadmap

### Chitthi (Email Service)

-   [ ] **Rate Limiting**: Redis-based rate limiting
-   [ ] **Queue System**: RabbitMQ integration for async processing
-   [ ] **Admin Dashboard**: Web interface for monitoring
-   [ ] **Email Templates**: Template management system
-   [ ] **Bulk Sending**: Support for bulk email operations
-   [ ] **Analytics**: Email delivery analytics and reporting
-   [ ] **Multi-tenant**: Support for multiple organizations

### Saransh (AI News App)

-   [ ] **User Authentication**: User management system
-   [ ] **Personalization**: AI-powered news recommendations
-   [ ] **Mobile App**: React Native mobile application
-   [ ] **Real-time Updates**: WebSocket integration
-   [ ] **Content Moderation**: AI-powered content filtering
-   [ ] **Internationalization**: Multi-language support
-   [ ] **Advanced Analytics**: User behavior analytics

---

**Built with ❤️ for the developer community**

_Chitthi & Saransh - Empowering developers with AI-driven solutions_
