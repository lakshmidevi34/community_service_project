import express from 'express'
import { hash, compare } from 'bcryptjs'
import { hswModel } from '../models/healthWorkerModel.js'
import { appointmentModel } from '../models/appointmentModel.js'
import { patientModel } from '../models/patientModel.js'
import jwt from 'jsonwebtoken'

export const hswRoute = express.Router()

// HS WORKER REGISTER (PENDING APPROVAL)
hswRoute.post('/hsworker', async (req, res) => {
  try {
    req.body.password = await hash(req.body.password, 12)
    await new hswModel(req.body).save()
    res.status(201).json({ message: "HS Worker registered – pending admin approval" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// HS WORKER LOGIN (BLOCK IF NOT APPROVED)
hswRoute.post('/hswlogin', async (req, res) => {
  try {
    let hsw = await hswModel.findOne({ email: req.body.email })
    if (!hsw) return res.status(404).json({ message: "Invalid email" })

    if (!hsw.approved)
      return res.status(403).json({ message: "Admin approval pending" })

    let valid = await compare(req.body.password, hsw.password)
    if (!valid) return res.status(404).json({ message: "Invalid password" })

    let token = jwt.sign(
      { role: "hsworker", hswid: hsw._id },
      process.env.JWT_SECRET || "abcdef",
      { expiresIn: "1h" }
    )

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })

    res.json({ message: "Login success", payload: hsw })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// HS WORKER VIEW APPOINTMENTS
hswRoute.get("/appointments/:hswid", async (req, res) => {
  try {
    let apps = await appointmentModel
      .find({ hswId: req.params.hswid })
      .populate({
        path: "patientId",
        select: "name email todayCondition prescriptions",
        populate: {
          path: "prescriptions.hswId",
          select: "hswname email"
        }
      })

    res.json({ message: "Appointments", payload: apps })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// HS WORKER ACCEPT / REJECT APPOINTMENT
hswRoute.put("/update-appointment/:appointmentId", async (req, res) => {
  try {
    let updated = await appointmentModel.findByIdAndUpdate(
      req.params.appointmentId,
      { status: req.body.status },
      { new: true }
    )

    res.json({ message: "Appointment updated", payload: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// HS WORKER ADD PRESCRIPTION
hswRoute.post("/add-prescription/:patientId", async (req, res) => {
  try {
    const { hswId, suggestion } = req.body
    if (!suggestion || !suggestion.trim()) {
      return res.status(400).json({ message: "Prescription suggestion is required" })
    }

    const updatedPatient = await patientModel.findByIdAndUpdate(
      req.params.patientId,
      {
        $push: {
          prescriptions: {
            hswId,
            suggestion,
            date: new Date()
          }
        }
      },
      { new: true }
    ).populate("prescriptions.hswId", "hswname email")

    res.json({ message: "Prescription added successfully", payload: updatedPatient })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
