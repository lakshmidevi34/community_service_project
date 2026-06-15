import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

export default function RequestAppointment() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ hswId: "", appointmentDate: "", reason: "" });

  const submit = async () => {
    await axios.post("/patient-api/request-appointment", {
      patientId: user._id,
      ...form
    });
    alert("Appointment requested");
  };

  return (
    <div className="card p-3 shadow">
      <h5>Request Appointment</h5>

      <input className="form-control mb-2" placeholder="HS Worker ID"
        onChange={(e) => setForm({ ...form, hswId: e.target.value })} />

      <input type="date" className="form-control mb-2"
        onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} />

      <textarea className="form-control mb-2" placeholder="Reason"
        onChange={(e) => setForm({ ...form, reason: e.target.value })} />

      <button onClick={submit} className="btn btn-success">Request</button>
    </div>
  );
}
