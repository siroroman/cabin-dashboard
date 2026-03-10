#!/bin/bash
set -e

MODE="${1:-dev}"
PORT=3000

check_deps() {
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
  fi
}

check_build() {
  if [ ! -f "dist/index.cjs" ]; then
    echo "Error: dist/index.cjs not found. Run './dev.sh build' first."
    exit 1
  fi
}

warn_db() {
  if [ -z "$DATABASE_URL" ]; then
    echo "Warning: DATABASE_URL is not set. Database features will not work."
  fi
}

case "$MODE" in
  dev)
    check_deps
    warn_db
    echo "Starting dev server..."
    echo "  Local: http://localhost:$PORT"
    PORT=$PORT NODE_ENV=development npx tsx server/index.ts
    ;;

  build)
    check_deps
    echo "Building project..."
    npm run build
    echo "Build complete. Output: dist/"
    ;;

  start)
    check_build
    warn_db
    echo "Starting production server..."
    echo "  Local: http://localhost:$PORT"
    PORT=$PORT NODE_ENV=production node dist/index.cjs
    ;;

  "build start")
    check_deps
    warn_db
    echo "Building project..."
    npm run build
    echo "Build complete."
    echo "Starting production server..."
    echo "  Local: http://localhost:$PORT"
    PORT=$PORT NODE_ENV=production node dist/index.cjs
    ;;

  *)
    echo "Usage: $0 [dev|build|start|'build start']"
    echo ""
    echo "  dev          Start development server with HMR (default)"
    echo "  build        Build for production (output: dist/)"
    echo "  start        Run the production build"
    echo "  build start  Build then run production"
    exit 1
    ;;
esac
