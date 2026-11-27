# Health Service

An independently runnable service exposing `GET /health`. It consumes events
from the Kafka topic configured by `KAFKA_TOPIC` (default: `hexora.events`)
and logs the received event envelope, providing a starting point for
event-driven service handlers. It has no HTTP dependency on the API gateway.

## Local development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` to override defaults. The service defaults to
port `3001`. For local development, start Kafka and initialize its topic from
`hexora-backend` with `docker compose up -d kafka kafka-init`; the default
broker address is `localhost:9094`.
