import cors from 'cors'
import express from 'express'

const app = express()
const healthServiceUrl =
  process.env.HEALTH_SERVICE_URL ?? 'http://localhost:3001'

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  }),
)

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'api-gateway' })
})

app.get('/api/health', async (_request, response) => {
  try {
    const upstream = await fetch(`${healthServiceUrl}/health`, {
      signal: AbortSignal.timeout(5000),
    })
    const body = await upstream.text()
    const contentType = upstream.headers.get('content-type')

    if (contentType) {
      response.setHeader('content-type', contentType)
    }

    response.status(upstream.status).send(body)
  } catch (error) {
    console.error('Health service request failed', error)
    response.status(503).json({ error: 'Health service unavailable' })
  }
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

export { app }
