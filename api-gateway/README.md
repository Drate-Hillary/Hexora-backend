# API Gateway

The single entry point for backend APIs. Frontend API traffic reaches this
service through Nginx. It serves `GET /health` for its own liveness check and
forwards `GET /api/health` to the health service. It also publishes application
events to Kafka using `POST /api/events`.

## Local development

Start the health service first, then run:

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` to override defaults. The gateway defaults to
port `3000`, allows the frontend origin at `http://localhost:5173`, and expects
the health service at `http://localhost:3001`. For local development, start
Kafka and initialize its topic from `hexora-backend` with
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
