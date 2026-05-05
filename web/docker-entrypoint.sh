#!/bin/sh
set -e
if [ ! -d node_modules/next ]; then
    npm ci
fi
exec "$@"
