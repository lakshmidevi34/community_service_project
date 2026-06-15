import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { patientRoute } from './APIs/patientAPI.js'
import { hswRoute } from './APIs/healthWorkerAPI.js'
import {adminRoute} from './APIs/adminAPI.js'
const app = express()

// ✅ JSON MIDDLEWARE (YOU FORGOT THIS)
app.use(express.json())

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))

//  Patient API
app.use('/patient-api', patientRoute)


//HS Worker API
app.use('/hsworker-api',hswRoute)

app.use('/admin-api',adminRoute)
// ✅ DB + SERVER
async function connectDBandStartServer() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/medservicedb')
    console.log("DB connected successfully")

    app.listen(8000, () =>
      console.log("Server started on port 8000")   // ✅ FIXED LOG
    )

  } catch (err) {
    console.log("Error in DB connection", err)
  }
}

connectDBandStartServer()
