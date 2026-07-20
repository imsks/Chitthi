#!/usr/bin/env bash
# Reads DATABASE_URL and sets POSTGRES_* for the official postgres Docker entrypoint.
set -euo pipefail

url="${DATABASE_URL:-}"
if [[ -z "$url" ]]; then
    echo "DATABASE_URL is required, e.g. postgres://postgres:postgres@db:5432/chitthi?sslmode=disable" >&2
    exit 1
fi

if [[ "$url" != postgres://* && "$url" != postgresql://* ]]; then
    echo "DATABASE_URL must start with postgres:// or postgresql://" >&2
    exit 1
fi

url="${url#postgres://}"
url="${url#postgresql://}"

userinfo="${url%%@*}"
rest="${url#*@}"
path="${rest#*/}"
path="${path%%\?*}"

if [[ "$userinfo" == *:* ]]; then
    export POSTGRES_USER="${userinfo%%:*}"
    export POSTGRES_PASSWORD="${userinfo#*:}"
else
    export POSTGRES_USER="$userinfo"
    export POSTGRES_PASSWORD=""
fi

export POSTGRES_DB="${path:-postgres}"

exec /usr/local/bin/docker-entrypoint.sh postgres "$@"
