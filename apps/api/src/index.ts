import express from 'express'
import cors from 'cors'
import { config } from './config'
import auditRouter from './routes/audit'
import leadsRouter from './routes/leads'

const app = express()

// middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}))
app.use(express.json())

// health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// routes
app.use('/audit', auditRouter)
app.use('/leads', leadsRouter)

// 404 handler
app.use((_, res) => {
  res.status(404).json({ error: 'Not found' })
})

// start server
app.listen(config.port, () => {
  console.log(`✅ API running on http://localhost:${config.port}`)
})

export default app
