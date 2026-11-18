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
only application service exposed to the host. It routes all `/api/` requests
to the API gateway. Kafka is available on host port `9094` for local tools and
on `kafka:9092` to services inside the Compose network.

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
  health checks to the health service. It publishes validated events at
  `POST /api/events`.
- `health-service` exposes its internal `GET /health` endpoint and consumes
  events from Kafka's `hexora.events` topic.
- `kafka-init` creates the configured event topic before either backend
  service starts, using the `kafka.init` script.
- `kafka` is a single-node KRaft broker with persistent local data, configured
  for development. It uses plaintext listeners and should be secured and
  clustered appropriately before production use.

Kafka topic data and consumer offsets are stored in the Docker volume
`hexora_kafka-data`, so they survive container restarts and the regular
`docker compose down` command. Avoid `docker compose down -v` unless you
intend to delete that data.

Each service has its own package manifest, TypeScript config, environment
example, and Dockerfile. See the service READMEs for local configuration.
