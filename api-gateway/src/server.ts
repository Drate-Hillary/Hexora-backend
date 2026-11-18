import 'dotenv/config'
import { app } from './app.js'

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '127.0.0.1'

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

const server = app.listen(port, host, () => {
  console.log(`API gateway listening on http://${host}:${port}`)
})

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received; closing API gateway`)
  server.close((error) => {
    if (error) {
      console.error('Failed to close API gateway cleanly', error)
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
