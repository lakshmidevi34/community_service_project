import { Schema, model } from "mongoose";

const hswSchema = new Schema({
  hswname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
  },

  approved: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    default: "hsworker"
  },

  patientList: [
    {
      patientId: {
        type: Schema.Types.ObjectId,
        ref: "patient"
      },

      assignedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, {
  versionKey: false,
  timestamps: true
});

export const hswModel = model("hsworker", hswSchema);
