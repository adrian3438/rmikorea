#!/usr/bin/env bash
# Build and publish rmikorea.com.
#
# Uploads to a staging directory first and swaps it in, so the live root is never
# a half-written tree. The build it replaces is kept at $REMOTE_ROOT.prev.
#
# The target host is deliberately NOT hard-coded — this repo is public, and a
# literal "root@<ip>" here would publish exactly where to aim an SSH brute force.
# Put the real values in scripts/deploy.env (gitignored), or export them yourself:
#
#   RMI_HOST=user@host  RMI_SSH_KEY=~/.ssh/some_key  ./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

# Optional untracked file holding the deployment target, e.g.
#   RMI_HOST=root@203.0.113.10
#   RMI_SSH_KEY=$HOME/.ssh/id_ed25519_rmikorea
if [ -f scripts/deploy.env ]; then
  # shellcheck disable=SC1091
  . scripts/deploy.env
fi

HOST="${RMI_HOST:-}"
KEY="${RMI_SSH_KEY:-}"
REMOTE_ROOT="${RMI_REMOTE_ROOT:-/var/www/rmikorea}"
SITE="${RMI_SITE:-https://rmikorea.com/}"

if [ -z "$HOST" ] || [ -z "$KEY" ]; then
  echo "RMI_HOST and RMI_SSH_KEY must be set (see scripts/deploy.env.example)." >&2
  exit 1
fi

echo "==> building"
npm run build

echo "==> uploading to ${REMOTE_ROOT}.new"
rsync -a --delete -e "ssh -i $KEY" out/ "$HOST:${REMOTE_ROOT}.new/"

echo "==> verifying upload"
# Both sides must list paths the same way, so run find from inside each tree —
# "find out -type f" would prefix every local path with "out/" and never match.
(cd out && find . -type f -exec shasum -a 256 {} \; | awk '{print $2" "$1}') | LC_ALL=C sort > /tmp/rmi-local.sha
ssh -i "$KEY" "$HOST" "cd ${REMOTE_ROOT}.new && find . -type f -exec sha256sum {} \; | awk '{print \$2\" \"\$1}' | LC_ALL=C sort" > /tmp/rmi-remote.sha
if ! diff -q /tmp/rmi-local.sha /tmp/rmi-remote.sha > /dev/null; then
  echo "upload mismatch — leaving the live site untouched" >&2
  diff /tmp/rmi-local.sha /tmp/rmi-remote.sha >&2 || true
  exit 1
fi

echo "==> swapping in"
ssh -i "$KEY" "$HOST" "set -e
  chown -R www-data:www-data ${REMOTE_ROOT}.new
  rm -rf ${REMOTE_ROOT}.prev
  mv ${REMOTE_ROOT} ${REMOTE_ROOT}.prev
  mv ${REMOTE_ROOT}.new ${REMOTE_ROOT}
  nginx -t && systemctl reload nginx"

echo "==> checking ${SITE}"
code=$(curl -sS -o /dev/null -w '%{http_code}' -m 20 "$SITE")
if [ "$code" != "200" ]; then
  echo "site returned $code — roll back with:" >&2
  echo "  ssh -i $KEY $HOST 'mv ${REMOTE_ROOT} ${REMOTE_ROOT}.bad && mv ${REMOTE_ROOT}.prev ${REMOTE_ROOT} && systemctl reload nginx'" >&2
  exit 1
fi

echo "==> done (previous build kept at ${REMOTE_ROOT}.prev)"
