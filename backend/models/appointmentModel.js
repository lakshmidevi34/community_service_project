import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "patient",
    required: true
  },

  hswId: {
    type: Schema.Types.ObjectId,
    ref: "hsworker",
    required: true
  },

  appointmentDate: {
    type: Date,
    required: true
  },

  reason: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export const appointmentModel = model("appointment", appointmentSchema);
