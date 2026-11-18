# Hexora Application Stack

The backend contains the API gateway and health service as independently
buildable Node.js/TypeScript projects. Docker and Nginx configuration lives at
the backend root.

## Run with Docker Compose

Requires Docker Compose. Run this command from `hexora-backend`:

```sh
docker compose up --build
```

Open `http://localhost:8080`. Nginx builds and serves the frontend, and is the
only service exposed to the host. It routes all `/api/` requests to the API
gateway; backend services stay on the internal Compose network.

## Run locally

Requires Node.js 20.6 or newer and npm. In separate terminals:

```sh
cd health-service
npm install
npm run dev
```

```sh
cd api-gateway
npm install
npm run dev
```

## Services

- `nginx` builds the Vite app from `hexora-frontend`, serves its static files,
  using `Dockerfile.nginx` and `nginx.conf`, and proxies `/api/` to the gateway.
- `api-gateway` is the single entry point for backend APIs and forwards
  health checks to the health service.
- `health-service` exposes its internal `GET /health` endpoint.

Each service has its own package manifest, TypeScript config, environment
example, and Dockerfile. See the service READMEs for local configuration.
