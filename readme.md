# 📬 Chitthi

[![Version](https://img.shields.io/badge/Version-v1.0.0-green.svg)](https://github.com/imsks/chitthi)
[![Go Version](https://img.shields.io/badge/Go-1.25.0-blue.svg)](https://golang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)

Email microservice in Go with **BYOK** (bring your own provider keys), optional **Next.js** UI in `web/`, **Postgres**, and **Redis** — all runnable with **Docker Compose**.

---

## Table of contents

- [Quick start](#quick-start)
- [PostgreSQL (single DATABASE_URL)](#postgresql-single-database_url)
- [API](#api)
- [Providers](#providers)
- [Configuration](#configuration)
- [Migrations & testing](#migrations--testing)

---

## Quick start

**Requires:** [Docker](https://docs.docker.com/get-docker/) with Compose.

```bash
git clone https://github.com/imsks/chitthi.git
cd chitthi
```

Create schema (Postgres must be up; run this once after first `docker compose up` or start only `db` first):

```bash
docker compose up -d db
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up
```

Start the stack (Go API with Air, Next.js, Postgres, Redis):

```bash
docker compose up --build
# or: ./dev.sh up
```

Or in the background:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
# or: ./dev.sh down
```

**URLs**

| Service | URL |
| ------- | --- |
| API | http://localhost:8080 |
| Web | http://localhost:3000 |
| Docs (in app) | http://localhost:3000/docs |

The `web` container sets `NEXT_PUBLIC_API_URL=http://app:8080` so Next.js can proxy `/api/*` to the Go service inside the Compose network. The browser still uses `localhost:3000` and `localhost:8080` for direct API calls (e.g. curl).

---

## PostgreSQL (single DATABASE_URL)

The **`db`** service does not use separate `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` in Compose. It reads **only `DATABASE_URL`** from `.env` and `scripts/pg-docker-entrypoint.sh` turns that into the env vars the official Postgres image expects.

Use the **Docker service name `db`** in the URL so other containers resolve it:

```env
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable
```

### Connect from your computer

Compose publishes Postgres on **`localhost:5432`**. Same user, password, and database name as in `DATABASE_URL` — only the host changes.

From a shell (after `source .env` or paste your URL):

```bash
# Replace host db → localhost (keep user, password, port, database)
psql "${DATABASE_URL/@db:/@localhost:}"
```

**GUI (DBeaver, TablePlus, etc.):** host `localhost`, port `5432`, database `chitthi`, user `postgres`, password `postgres` (or whatever you put in `DATABASE_URL`).

**Inside the DB container** (no URL tweak):

```bash
docker compose exec db psql -U postgres -d chitthi
```

Use the `-U` / `-d` values that match your `DATABASE_URL`. Passwords with special characters must be **URL-encoded** inside `DATABASE_URL`.

---

**Send a test email**

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
    "html_content": "<h1>Hello</h1>"
  }'
```

---

## API

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/send-email` | Send via SMTP, SendGrid, Breevo, or MailerSend (headers) |
| `GET` | `/` | Health |

### `POST /send-email`

**Headers (pick one provider):** `Content-Type: application/json`, plus `X-SMTP-*`, or `X-SendGrid-API-Key`, or `X-Breevo-API-Key`, or `X-MailerSend-API-Key`.

**Body (example):**

```json
{
    "from_email": "sender@example.com",
    "from_name": "Sender",
    "to_email": "recipient@example.com",
    "to_name": "Recipient",
    "subject": "Subject",
    "html_content": "<h1>Hello</h1>"
}
```

**Success (example):**

```json
{
    "status": true,
    "message": "Email sent successfully",
    "data": {
        "sent_to": "recipient@example.com",
        "sent_from": "sender@example.com",
        "subject": "Subject",
        "provider": "smtp"
    }
}
```

---

## Providers

| Provider | Header |
| -------- | ------ |
| SMTP | `X-SMTP-Host`, `X-SMTP-Port`, `X-SMTP-Username`, `X-SMTP-Password`, `X-SMTP-From`, `X-SMTP-Use-TLS` |
| SendGrid | `X-SendGrid-API-Key` |
| Breevo | `X-Breevo-API-Key` |
| MailerSend | `X-MailerSend-API-Key` |

**SendGrid example**

```bash
curl -X POST http://localhost:8080/send-email \
  -H "Content-Type: application/json" \
  -H "X-SendGrid-API-Key: your-key" \
  -d '{"from_email":"a@b.com","to_email":"c@d.com","subject":"Hi","html_content":"<p>Hi</p>"}'
```

Resolution order: header-based credentials first, then optional env-configured provider keys in `.env`.

---

## Configuration

If `.env` is missing, `./dev.sh up` creates a starter file.

**Postgres** is configured from **`DATABASE_URL` only** for the `db` container (see [PostgreSQL](#postgresql-single-database_url)). Use host **`db`** so `app` and `db` agree inside Compose.

**Same `.env`** also supplies the Go app and optional provider keys:

```env
PORT=8080
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable
REDIS_URL=redis://redis:6379
```

Optional fallbacks / SMTP:

```env
BREEVO_API_KEY=
SENDGRID_API_KEY=
SENDGRID_REGION=global
MAILERSEND_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=
SMTP_USE_TLS=true
```

---

## Migrations & testing

Install [golang-migrate](https://github.com/golang-migrate/migrate) CLI. With Compose exposing Postgres on **localhost:5432**, connect using the same credentials as `DATABASE_URL` but host **`localhost`**:

```bash
migrate -path migrations -database "${DATABASE_URL/@db:/@localhost:}" up
migrate -path migrations -database "${DATABASE_URL/@db:/@localhost:}" down 1
```

Or explicitly:

```bash
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable" up
```

On the host (Go toolchain):

```bash
go test ./...
```

### Layout

```
chitthi/
├── cmd/              # main
├── internal/         # API, DB, email providers
├── migrations/
├── scripts/          # pg-docker-entrypoint.sh
├── web/              # Next.js (Dockerfile + docker-compose service `web`)
├── Dockerfile        # Go + Air (service `app`)
├── docker-compose.yml
├── dev.sh            # optional: ./dev.sh up | down
└── go.mod
```

---

## License

MIT — see [LICENSE](LICENSE).

Issues: [github.com/imsks/chitthi/issues](https://github.com/imsks/chitthi/issues)
