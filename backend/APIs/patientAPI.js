import express from 'express'
import { hash, compare } from 'bcryptjs'
import { patientModel } from '../models/patientModel.js'
import jwt from 'jsonwebtoken'
import { appointmentModel } from '../models/appointmentModel.js'

export const patientRoute = express.Router()

// PATIENT REGISTER
patientRoute.post('/patient', async (req, res) => {
  try {
    req.body.password = await hash(req.body.password, 12)
    await new patientModel(req.body).save()
    res.status(201).json({ message: "Patient created successfully" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PATIENT LOGIN
patientRoute.post('/patientlogin', async (req, res) => {
  try {
    let patient = await patientModel.findOne({ email: req.body.email })
    if (!patient) return res.status(404).json({ message: "Invalid email" })

    let valid = await compare(req.body.password, patient.password)
    if (!valid) return res.status(404).json({ message: "Invalid password" })

    let token = jwt.sign(
      { role: "patient", patientId: patient._id },
      "abcdef",
      { expiresIn: "1h" }
    )

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })

    res.json({ message: "Login success", payload: patient })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PATIENT ADD CONDITION
patientRoute.put('/todaycondi/:userid', async (req, res) => {
  try {
    let updated = await patientModel.findByIdAndUpdate(
      req.params.userid,
      { $push: { todayCondition: { description: req.body.description, updatedBy: "patient" } } },
      { new: true }
    )

    res.json({ message: "Condition added", payload: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATIENT EDIT TODAY CONDITION (SELF)
patientRoute.put(
  "/edit-todaycondi/:userid/:todaycondiid",
  async (req, res) => {
    try {
      let updatedPatient = await patientModel.findOneAndUpdate(
        {
          _id: req.params.userid,
          "todayCondition._id": req.params.todaycondiid
        },
        {
          $set: {
            "todayCondition.$.description": req.body.description,
            "todayCondition.$.updatedBy": "patient"
          }
        },
        { new: true }
      )

      if (!updatedPatient)
        return res.status(404).json({
          message: "Patient or condition not found"
        })

      res.json({
        message: "Condition updated successfully",
        payload: updatedPatient
      })

    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
)

// PATIENT REQUEST APPOINTMENT
patientRoute.post("/request-appointment", async (req, res) => {
  try {
    let newApp = await new appointmentModel(req.body).save()
    res.status(201).json({ message: "Appointment requested", payload: newApp })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATIENT VIEW OWN APPOINTMENTS
patientRoute.get("/my-appointments/:patientId", async (req, res) => {
  try {
    let apps = await appointmentModel
      .find({ patientId: req.params.patientId })
      .populate("hswId", "hswname email")

    res.json({ message: "My Appointments", payload: apps })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})