# 📬 Chitthi — Email Sending Microservice (Beta)

Chitthi is a lightweight email-sending microservice built in Go.  
It supports third-party providers like Breevo, with features like API key auth, request logging, Redis caching, and more.

---

## ✅ Features (Beta)

-   Send HTML emails via provider (e.g., Breevo)
-   API Key support (BYOK – Bring Your Own Key)
-   Cache usage in Redis
-   Log send events in Postgres (coming)
-   Pluggable payload mapping for different providers

---

### Folder Structure

```
chitthi/
├── cmd/ # Entry point
│ └── main.go
├── internal/ # All core business logic
│ ├── api/ # HTTP handlers
│ ├── config/ # .env loading
│ ├── email/ # Provider-specific logic (SendGrid, etc)
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

go run cmd/main.go

### cURL

```
curl --request POST \
  --url https://api.brevo.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key:key' \
  --header 'content-type: application/json' \
  --data '{
   "sender":{
      "name":"Sender Alex",
      "email":"sachinkshuklaoo7@gmail.com"
   },
   "to":[
      {
         "email":"sachin@fletch.co",
         "name":"John Doe"
      }
   ],
   "headers": {
      "X-Sib-Sandbox": "drop"
   },
   "subject":"Hello world",
   "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"
}'
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

### 👋 Contribute

Want to contribute? Fork this repo or reach out at sachinkshuklaoo7@email.com
