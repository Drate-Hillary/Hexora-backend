import 'dotenv/config'
import {
  app,
  connectEventConsumer,
  disconnectEventConsumer,
} from './app.js'

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '127.0.0.1'

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

const start = async () => {
  await connectEventConsumer()
  const server = app.listen(port, host, () => {
    console.log(`Health service listening on http://${host}:${port}`)
  })

  const shutdown = (signal: NodeJS.Signals) => {
    console.log(`${signal} received; closing health service`)
    server.close(async (error) => {
      if (error) {
        console.error('Failed to close health service cleanly', error)
        process.exitCode = 1
      }

      try {
        await disconnectEventConsumer()
      } catch (disconnectError) {
        console.error('Failed to disconnect Kafka consumer', disconnectError)
        process.exitCode = 1
      }
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((error: unknown) => {
  console.error('Failed to start health service', error)
  process.exitCode = 1
})
