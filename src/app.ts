import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { healthRouter } from './routes/health.js'

export const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use('/api/health', healthRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  console.error(error)

  if (response.headersSent) {
    next(error)
    return
  }

  const status =
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
      ? error.status
      : 500

  response.status(status).json({
    error: status >= 500 ? 'Internal server error' : 'Invalid request',
  })
}

app.use(errorHandler)
