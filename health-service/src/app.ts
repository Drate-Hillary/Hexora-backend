import express from 'express'
import { Kafka } from 'kafkajs'

const app = express()

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'health-service' })
})

const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9094')
  .split(',')
  .map((broker) => broker.trim())
  .filter(Boolean)
if (brokers.length === 0) {
  throw new Error('KAFKA_BROKERS must contain at least one broker')
}
const topic = (process.env.KAFKA_TOPIC ?? 'hexora.events').trim()
if (topic.length === 0) {
  throw new Error('KAFKA_TOPIC must not be empty')
}
const consumer = new Kafka({
  clientId: 'hexora-health-service',
  brokers,
}).consumer({ groupId: 'hexora-health-service' })

function isKafkaEvent(
  value: unknown,
): value is {
  id: string
  type: string
  occurredAt: string
  source: string
  payload: Record<string, unknown>
} {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const event = value as Record<string, unknown>
  return (
    typeof event.id === 'string' &&
    typeof event.type === 'string' &&
    typeof event.occurredAt === 'string' &&
    typeof event.source === 'string' &&
    typeof event.payload === 'object' &&
    event.payload !== null &&
    !Array.isArray(event.payload)
  )
}

export async function connectEventConsumer() {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: false })
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value === null) {
        throw new Error('Received Kafka event without a value')
      }

      const event: unknown = JSON.parse(message.value.toString())
      if (!isKafkaEvent(event)) {
        throw new Error('Received Kafka event with an invalid envelope')
      }

      console.info('Received Kafka event', {
        eventId: event.id,
        eventType: event.type,
        source: event.source,
      })
    },
  })
}

export async function disconnectEventConsumer() {
  await consumer.disconnect()
}

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

export { app }
