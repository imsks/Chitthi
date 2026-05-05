#!/bin/bash
# Optional helper — same as: docker compose up --build / down
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose "$@"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        echo "Install Docker Compose." >&2
        exit 1
    fi
}

ensure_docker() {
    command -v docker >/dev/null 2>&1 || { echo "Docker not found." >&2; exit 1; }
    docker info >/dev/null 2>&1 || { echo "Start Docker (daemon not reachable)." >&2; exit 1; }
}

create_env_if_missing() {
    [[ -f .env ]] && return 0
    echo "Creating .env — edit for provider keys if needed."
    cat > .env << 'EOF'
PORT=8080
JWT_SECRET=change-me-generate-with-openssl-rand-hex-32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
CHITTHI_BFF_SECRET=
DATABASE_URL=postgres://postgres:postgres@db:5432/chitthi?sslmode=disable
REDIS_URL=redis://redis:6379
RABBITMQ_URL=
BREEVO_API_KEY=
SENDGRID_API_KEY=
SENDGRID_REGION=global
MAILERSEND_API_KEY=
EOF
}

usage() {
    echo "Usage: $0 up | down"
    echo "  up    docker compose up --build (API, web, Postgres, Redis — logs in foreground)"
    echo "  down  docker compose down"
}

main() {
    case "${1:-up}" in
        up|start|"")
            ensure_docker
            create_env_if_missing
            compose up --build
            ;;
        down|stop)
            ensure_docker
            compose down
            ;;
        help|-h|--help)
            usage
            ;;
        *)
            echo "Unknown: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
}

main "$@"
