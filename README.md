# Hexora Backend

TypeScript REST API built with Express.

## Requirements

- Node.js 20.6 or newer
- npm

## Getting started

```sh
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:3000` by default. Check `GET /api/health`
to verify it is running.

## Scripts

- `npm run dev` starts the API with watch mode.
- `npm run build` type-checks and compiles the API to `dist/`.
- `npm start` starts the compiled API.
- `npm run lint` checks the TypeScript source.

## Configuration

- `PORT` sets the listening port (default `3000`).
- `HOST` sets the listening host (default `0.0.0.0`).
- `FRONTEND_ORIGIN` sets the frontend origin allowed by CORS (default
  `http://localhost:5173`).
