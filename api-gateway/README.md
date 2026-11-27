# API Gateway

The API monolith for frontend backend requests, reached through Nginx. It
serves `GET /health` and `GET /api/health` for its own health checks and
publishes application events to Kafka using `POST /api/events`. It has no
HTTP dependency on the health service.

## Local development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` to override defaults. The gateway defaults to
port `3000`, allows the frontend origin at `http://localhost:5173`, and expects
Kafka at `localhost:9094`. For local development, start Kafka and initialize
its topic from `hexora-backend` with
`docker compose up -d kafka kafka-init`; the default broker address is
`localhost:9094`.

## Publishing events

Send a JSON object with an event type and object payload. The gateway returns
`202 Accepted` after Kafka acknowledges the message:

```sh
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"eventType":"order.created","payload":{"orderId":"order-123"}}'
```

Events include an ID, occurrence time, source service, and payload. The default
topic is `hexora.events`; the health service consumes it as a starter consumer.
