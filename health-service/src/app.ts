import express from 'express'

const app = express()

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'health-service' })
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

export { app }
