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

// ADMIN LOGIN
adminRoute.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@medservice.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email === adminEmail && password === adminPassword) {
    res.json({
      message: "Admin login success",
      payload: { email: adminEmail, role: "admin" }
    });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});
