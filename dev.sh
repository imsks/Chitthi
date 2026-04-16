#!/bin/bash
# Chitthi dev — docker-compose for API + data; local Node for the web app.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose "$@"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        echo -e "${RED}Docker Compose not found. Install Docker Desktop or docker-compose.${NC}" >&2
        exit 1
    fi
}

ensure_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${RED}Docker not found.${NC}" >&2
        exit 1
    fi
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Docker daemon is not running. Start Docker Desktop (or the Docker service).${NC}" >&2
        exit 1
    fi
}

# Hostnames db / redis match docker-compose.yml (app runs inside the network).
create_env_if_missing() {
    if [[ -f .env ]]; then
        return 0
    fi
    echo -e "${YELLOW}Creating .env (edit if needed).${NC}"
    cat > .env << 'EOF'
PORT=8080
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable
REDIS_URL=redis://redis:6379
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chitthi
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
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
EOF
    echo -e "${GREEN}.env created.${NC}"
}

cmd_backend() {
    ensure_docker
    create_env_if_missing
    echo -e "${BLUE}Starting PostgreSQL, Redis, and API (Air) — logs follow. Ctrl+C stops the API container.${NC}"
    # depends_on pulls up db + redis; --build ensures image exists on first run
    compose up --build app
}

cmd_frontend() {
    if [[ ! -d web ]]; then
        echo -e "${RED}web/ not found.${NC}" >&2
        exit 1
    fi
    if ! command -v npm >/dev/null 2>&1; then
        echo -e "${RED}npm not found. Install Node.js LTS.${NC}" >&2
        exit 1
    fi
    cd web
    if [[ ! -d node_modules ]]; then
        echo -e "${BLUE}Installing frontend dependencies…${NC}"
        npm install
    fi
    echo -e "${GREEN}Frontend: http://localhost:3000 (API expected at http://localhost:8080)${NC}"
    npm run dev
}

cmd_infra() {
    ensure_docker
    create_env_if_missing
    echo -e "${BLUE}Starting only db + redis (detached).${NC}"
    compose up -d db redis
    echo -e "${GREEN}PostgreSQL: localhost:5432 · Redis: localhost:6379${NC}"
}

cmd_down() {
    ensure_docker
    compose down
    echo -e "${GREEN}Compose stack stopped.${NC}"
}

usage() {
    echo -e "${BLUE}Chitthi dev${NC}"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "  backend   API + Postgres + Redis via Docker Compose (same as docker-compose.yml: app, db, redis)"
    echo "  frontend  Next.js dev server in ./web"
    echo "  infra     only db + redis (detached)"
    echo "  down      docker compose down"
    echo ""
    echo "Typical: one terminal → $0 backend   another → $0 frontend"
}

main() {
    case "${1:-}" in
        backend|api|back)
            cmd_backend
            ;;
        frontend|fe|front|ui)
            cmd_frontend
            ;;
        infra|infrastructure)
            cmd_infra
            ;;
        down|stop)
            cmd_down
            ;;
        help|-h|--help|"")
            usage
            ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}" >&2
            usage >&2
            exit 1
            ;;
    esac
}

main "$@"
