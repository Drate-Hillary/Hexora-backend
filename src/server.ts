import 'dotenv/config'
import { app } from './app.js'

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '0.0.0.0'

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

const server = app.listen(port, host, () => {
  console.log(`Hexora API listening on http://${host}:${port}`)
})

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received; closing HTTP server`)
  server.close((error) => {
    if (error) {
      console.error('Failed to close HTTP server cleanly', error)
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
