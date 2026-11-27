import cors from 'cors'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { publishEvent } from './kafka.js'

const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  }),
)

const healthCheck = (_request: express.Request, response: express.Response) => {
  response.json({ status: 'ok', service: 'api-gateway' })
}

app.get('/health', healthCheck)
app.get('/api/health', healthCheck)

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
