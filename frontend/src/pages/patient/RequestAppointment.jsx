import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

export default function RequestAppointment() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ hswId: "", appointmentDate: "", reason: "" });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("/patient-api/hsworkers");
        setWorkers(response.data.payload || []);
      } catch (err) {
        console.error("Error fetching health workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const submit = async () => {
    if (!form.hswId) {
      alert("Please select a Health Worker");
      return;
    }
    await axios.post("/patient-api/request-appointment", {
      patientId: user._id,
      ...form
    });
    alert("Appointment requested");
  };

  return (
    <div className="card p-3 shadow">
      <h5>Request Appointment</h5>

      {loading ? (
        <p>Loading health workers...</p>
      ) : (
        <select
          className="form-select mb-2"
          value={form.hswId}
          onChange={(e) => setForm({ ...form, hswId: e.target.value })}
        >
          <option value="">-- Select Health Worker --</option>
          {workers.map((w) => (
            <option key={w._id} value={w._id}>
              {w.hswname} ({w.email})
            </option>
          ))}
        </select>
      )}

      <input type="date" className="form-control mb-2"
        onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} />

      <textarea className="form-control mb-2" placeholder="Reason"
        onChange={(e) => setForm({ ...form, reason: e.target.value })} />

      <button onClick={submit} className="btn btn-success">Request</button>
    </div>
  );
}
