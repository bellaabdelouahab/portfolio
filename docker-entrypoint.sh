#!/bin/sh
set -e

# Same convention .github/workflows/deploy.yml and src/shared/lib/firebaseAdmin.js
# already use: a base64-encoded service account JSON in an env var, decoded to a
# file and pointed at via GOOGLE_APPLICATION_CREDENTIALS. Runtime-only (never
# baked into the image) — set as a Coolify runtime env var, not a build variable.
if [ -n "$FIREBASE_SERVICE_ACCOUNT_B64" ]; then
  echo "$FIREBASE_SERVICE_ACCOUNT_B64" | base64 -d > /app/serviceAccountKey.json
  export GOOGLE_APPLICATION_CREDENTIALS=/app/serviceAccountKey.json
fi

exec node server/index.mjs
