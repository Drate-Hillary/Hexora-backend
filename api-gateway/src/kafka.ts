import { Kafka, Partitioners } from 'kafkajs'

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

const kafka = new Kafka({ clientId: 'hexora-api-gateway', brokers })
const producer = kafka.producer({
  idempotent: true,
  createPartitioner: Partitioners.DefaultPartitioner,
})

export async function connectEventProducer() {
  await producer.connect()
}

export async function publishEvent(event: {
  id: string
  type: string
  occurredAt: string
  source: string
  payload: Record<string, unknown>
}) {
  await producer.send({
    topic,
    acks: -1,
    messages: [{ key: event.type, value: JSON.stringify(event) }],
  })
}

export async function disconnectEventProducer() {
  await producer.disconnect()
}
