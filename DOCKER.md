# Docker Setup Guide

This guide explains how to run the Emaar E-commerce platform using Docker.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

## Quick Start

### 1. Production Mode (Optimized Build)

Build and run the production-optimized container:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at: **http://localhost:3000**

### 2. Development Mode (Hot Reload)

Run in development mode with hot module replacement:

```bash
# Start development container
docker-compose --profile dev up frontend-dev

# Or run in detached mode
docker-compose --profile dev up -d frontend-dev

# View logs
docker-compose logs -f frontend-dev
```

The development server will be available at: **http://localhost:3001**

## Docker Commands

### Build the Image

```bash
# Build the production image
docker-compose build

# Build without cache
docker-compose build --no-cache
```

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs -f frontend

# Execute commands inside container
docker-compose exec frontend sh
```

### Clean Up

```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove all (including images)
docker-compose down --rmi all
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` to configure your environment:

```env
VITE_API_BASE_URL=http://localhost:3002
VITE_APP_NAME=Emaar E-commerce
VITE_DEFAULT_LANGUAGE=ar
VITE_CURRENCY=SDG
VITE_CURRENCY_SYMBOL=جنيه سوداني
```

## Architecture

### Production Setup (Dockerfile)

- **Stage 1**: Build stage using Node.js 18 Alpine
  - Installs dependencies
  - Builds the Vite application
  - Optimizes assets

- **Stage 2**: Production stage using Nginx Alpine
  - Serves static files
  - Handles client-side routing
  - Gzip compression enabled
  - Security headers configured

### Docker Compose Services

1. **frontend** (Production)
   - Port: 3000 → 80 (nginx)
   - Multi-stage build with Nginx
   - Optimized for production

2. **frontend-dev** (Development)
   - Port: 3001 → 3000 (Vite dev server)
   - Hot module replacement
   - Volume mounted for live code changes
   - Only starts with `--profile dev` flag

## Nginx Configuration

The production container uses Nginx with:
- Client-side routing support
- Gzip compression
- Static asset caching (1 year)
- Security headers
- No cache for index.html

## Performance Features

✅ Multi-stage build (small image size)
✅ Alpine Linux base (minimal footprint)
✅ Nginx for fast static file serving
✅ Gzip compression enabled
✅ Asset caching optimized
✅ Security headers configured

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 3000 to 8080
```

### View Container Logs

```bash
docker-compose logs -f frontend
```

### Rebuild After Code Changes

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Connect to Backend API

Make sure your backend API is running on port 3002 or update the `VITE_API_BASE_URL` in your `.env` file.

If your backend is also in Docker, add it to the same network in `docker-compose.yml`.

## Production Deployment

For production deployment:

1. Set environment variables properly
2. Use production API URL
3. Enable HTTPS with reverse proxy (Nginx/Traefik)
4. Set up proper backup and monitoring
5. Use Docker secrets for sensitive data

## Image Size

The production image is optimized:
- Base image: ~23 MB (Nginx Alpine)
- Built application: ~5-10 MB
- Total: ~30-35 MB

## Support

For issues or questions, refer to the main README.md or project documentation.
