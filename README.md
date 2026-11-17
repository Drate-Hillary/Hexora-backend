# Hexora Application Stack

The backend is organized as independently buildable Node.js/TypeScript services.
Nginx serves the frontend and routes API requests to the API gateway.

## Run with Docker Compose

Requires Docker Compose. Run this command from the `hexora-backend` folder:

```sh
docker compose up --build
```

Open `http://localhost:8080` for the frontend. Requests to `/api/` are proxied
by Nginx to the API gateway. `GET /api/health` checks the health service through
the gateway. The gateway and health service stay on the internal Compose
network.

Set `WEB_PORT` to change the published web port. If you change it, also set
`FRONTEND_ORIGIN` to the corresponding origin for the gateway's CORS policy.

## Run locally

Requires Node.js 20.6 or newer and npm. In separate terminals:

```sh
cd services/health-service
npm install
npm run dev
```

```sh
cd services/api-gateway
npm install
npm run dev
```

## Services

- `nginx` builds the Vite app from `hexora-frontend`, serves its static files,
  provides SPA route fallback, and proxies `/api/` to the gateway.
- `services/api-gateway` is the frontend-facing API entry point and forwards
  health checks to the health service.
- `services/health-service` exposes its internal `GET /health` endpoint.

Each service has its own package manifest, TypeScript config, environment
example, and Dockerfile. See each service README for its local configuration.
