import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { patientRoute } from './APIs/patientAPI.js'
import { hswRoute } from './APIs/healthWorkerAPI.js'
import {adminRoute} from './APIs/adminAPI.js'

const app = express()

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true
}))

//  Patient API
app.use('/patient-api', patientRoute)

//HS Worker API
app.use('/hsworker-api',hswRoute)

app.use('/admin-api',adminRoute)

// Serve React Frontend static files in production
const frontendDistPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendDistPath))

// Wildcard fallback route for React Router (SPA)
app.get('*splat', (req, res, next) => {
  // Do not redirect API requests to React index.html
  if (req.path.startsWith('/patient-api') || req.path.startsWith('/hsworker-api') || req.path.startsWith('/admin-api')) {
    return next()
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send("Backend is running! Frontend build is not deployed yet or not found.")
    }
  })
})

// ✅ DB + SERVER
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medservicedb'
const PORT = process.env.PORT || 8000

async function connectDBandStartServer() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("DB connected successfully")

    app.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    )

  } catch (err) {
    console.log("Error in DB connection", err)
  }
}

connectDBandStartServer()
