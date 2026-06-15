import express from "express";
import { hswModel } from "../models/healthWorkerModel.js";

export const adminRoute = express.Router();

// GET PENDING HS WORKERS
adminRoute.get("/pending-hsworkers", async (req, res) => {
  let pending = await hswModel.find({ approved: false });
  res.json({ payload: pending });
});

// APPROVE HS WORKER
adminRoute.put("/approve-hsworker/:id", async (req, res) => {
  let updated = await hswModel.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );

  res.json({ message: "HS Worker approved", payload: updated });
});
