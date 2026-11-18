# Health Service

An independently runnable service exposing `GET /health`. The API gateway
proxies its health response at `GET /api/health`.

## Local development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` to override defaults. The service defaults to
port `3001`.
