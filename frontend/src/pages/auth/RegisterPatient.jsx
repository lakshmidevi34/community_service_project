import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

export default function RegisterPatient() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("/patient-api/patient", form);
    alert("Registered successfully");
    navigate("/");
  };

  return (
    <div className="container col-md-4 mt-5 shadow p-4 rounded">
      <h3>Patient Registration</h3>

      <input className="form-control mb-3" placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input className="form-control mb-3" placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input type="password" className="form-control mb-3" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button onClick={submit} className="btn btn-success w-100">Register</button>
    </div>
  );
}
