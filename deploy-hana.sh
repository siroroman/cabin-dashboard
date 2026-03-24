#!/bin/bash
# Deploy web dashboard to hana Mac and expose via Cloudflare tunnel.
# Usage: ./deploy-hana.sh
set -e

REMOTE="hana"
REMOTE_DIR="~/web-dashboard"
PORT=3000

echo "==> Syncing code to $REMOTE..."
rsync -a --exclude='node_modules' --exclude='dist' --exclude='.git' \
  --exclude='server.log' --exclude='server.pid' \
  . "$REMOTE:$REMOTE_DIR/"

echo "==> Building on $REMOTE..."
ssh "$REMOTE" "
  export PATH=\"\$HOME/node-local/bin:\$PATH\"
  cd $REMOTE_DIR
  npm run build
"

echo "==> Patching reusePort (not supported on this macOS)..."
ssh "$REMOTE" "
  sed -i '' 's/reusePort:!0/reusePort:!1/g' $REMOTE_DIR/dist/index.cjs
"

echo "==> Stopping old processes..."
ssh "$REMOTE" "
  pkill -f 'node dist/index.cjs' 2>/dev/null || true
  pkill -f cloudflared 2>/dev/null || true
  sleep 2
"

echo "==> Starting production server..."
ssh "$REMOTE" "
  export PATH=\"\$HOME/node-local/bin:\$PATH\"
  rm -f $REMOTE_DIR/server.log
  cd $REMOTE_DIR
  PORT=$PORT NODE_ENV=production nohup node dist/index.cjs > $REMOTE_DIR/server.log 2>&1 &
  echo \$! > $REMOTE_DIR/server.pid
  sleep 3
  grep -q 'serving on port' $REMOTE_DIR/server.log || { echo 'ERROR: server failed to start:'; cat $REMOTE_DIR/server.log; exit 1; }
  echo 'Server running on port $PORT'
"

echo "==> Starting Cloudflare tunnel..."
URL=$(ssh "$REMOTE" "
  export PATH=\"\$HOME/node-local/bin:\$PATH\"
  rm -f ~/cloudflared.log
  nohup cloudflared tunnel --url http://localhost:$PORT --no-autoupdate > ~/cloudflared.log 2>&1 &
  echo \$! > ~/cloudflared.pid
  for i in \$(seq 1 20); do
    url=\$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' ~/cloudflared.log 2>/dev/null | tail -1)
    if [ -n \"\$url\" ]; then
      echo \"\$url\"
      exit 0
    fi
    sleep 2
  done
  echo 'ERROR: timed out waiting for tunnel URL' >&2
  exit 1
")

echo ""
echo "==> Dashboard live at: $URL"
