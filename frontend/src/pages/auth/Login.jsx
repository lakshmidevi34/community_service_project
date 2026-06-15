import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        role === "patient"
          ? "/patient-api/patientlogin"
          : "/hsworker-api/hswlogin";

      const res = await axios.post(url, form);

      login({ role, ...res.data.payload });
      navigate(`/${role}`);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container col-md-4 mt-5 shadow p-4 rounded">
      <h3 className="text-center">Login</h3>

      <select
        className="form-select mb-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="patient">Patient</option>
        <option value="hsworker">Health Worker</option>
      </select>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-primary w-100">Login</button>
      </form>

      <div className="text-center mt-3">
        {role === "patient" ? (
          <Link to="/register-patient">New Patient? Register</Link>
        ) : (
          <Link to="/register-hsw">New Health Worker? Register</Link>
        )}
      </div>
    </div>
  );
}
