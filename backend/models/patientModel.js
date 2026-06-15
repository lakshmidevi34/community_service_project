import { Schema, model } from "mongoose"

const patientSchema = new Schema(
  {
    name: {
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

    todayCondition: [
      {
        description: {
          type: String,
          required: true
        },

        updatedBy: {
          type: String,
          enum: ["patient", "hsworker"],
          required: true
        },

        updatedById: {
          type: Schema.Types.ObjectId,
          ref: "hsworker",
          default: null
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    prescriptions: [
      {
        hswId: {
          type: Schema.Types.ObjectId,
          ref: "hsworker"
        },

        suggestion: {
          type: String,
          required: true
        },

        date: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true,
    strict: true
  }
)

export const patientModel = model("patient", patientSchema)
