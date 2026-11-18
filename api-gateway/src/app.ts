import cors from 'cors'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { publishEvent } from './kafka.js'

const app = express()
const healthServiceUrl =
  process.env.HEALTH_SERVICE_URL ?? 'http://localhost:3001'

app.use(express.json({ limit: '1mb' }))
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

app.post('/api/events', async (request, response) => {
  const { eventType, payload } = request.body ?? {}

  if (
    typeof eventType !== 'string' ||
    eventType.trim().length === 0 ||
    eventType.length > 100 ||
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload)
  ) {
    response.status(400).json({
      error: 'eventType must be a non-empty string (up to 100 characters) and payload must be an object',
    })
    return
  }

  const event = {
    id: randomUUID(),
    type: eventType.trim(),
    occurredAt: new Date().toISOString(),
    source: 'api-gateway',
    payload,
  }

  try {
    await publishEvent(event)
    response.status(202).json({ eventId: event.id, status: 'accepted' })
  } catch (error) {
    console.error('Failed to publish Kafka event', error)
    response.status(503).json({ error: 'Event service unavailable' })
  }
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

export { app }
