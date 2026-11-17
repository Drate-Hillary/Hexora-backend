# API Gateway

The frontend-facing entry point. It serves `GET /health` for its own liveness
check and forwards `GET /api/health` to the health service.

## Local development

Start the health service first, then run:

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` to override defaults. The gateway defaults to
port `3000`, allows the frontend origin at `http://localhost:5173`, and expects
the health service at `http://localhost:3001`.
