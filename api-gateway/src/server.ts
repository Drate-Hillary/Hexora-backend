import 'dotenv/config'
import { app } from './app.js'
import {
  connectEventProducer,
  disconnectEventProducer,
} from './kafka.js'

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '127.0.0.1'

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

const start = async () => {
  await connectEventProducer()
  const server = app.listen(port, host, () => {
    console.log(`API gateway listening on http://${host}:${port}`)
  })

  const shutdown = (signal: NodeJS.Signals) => {
    console.log(`${signal} received; closing API gateway`)
    server.close(async (error) => {
      if (error) {
        console.error('Failed to close API gateway cleanly', error)
        process.exitCode = 1
      }

      try {
        await disconnectEventProducer()
      } catch (disconnectError) {
        console.error('Failed to disconnect Kafka producer', disconnectError)
        process.exitCode = 1
      }
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((error: unknown) => {
  console.error('Failed to start API gateway', error)
  process.exitCode = 1
})
