import { useContext, useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

export default function Appointments() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    try {
      const res = await axios.get(
        `/hsworker-api/appointments/${user._id}`
      );
      setAppointments(res.data.payload);
    } catch (err) {
      alert("Error loading appointments");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/hsworker-api/update-appointment/${id}`, {
        status,
      });
      loadAppointments(); // refresh list
    } catch (err) {
      alert("Failed to update appointment");
    }
  };

  return (
    <div className="card p-3 shadow">
      <h5>My Appointments</h5>

      {appointments.length === 0 && (
        <p className="text-muted">No appointments yet</p>
      )}

      {appointments.map((app) => (
        <div
          key={app._id}
          className="border rounded p-3 mb-3"
        >
          <p><b>Patient:</b> {app.patientId?.name}</p>
          <p><b>Email:</b> {app.patientId?.email}</p>
          <p><b>Date:</b> {new Date(app.appointmentDate).toDateString()}</p>
          <p><b>Reason:</b> {app.reason}</p>
          <p>
            <b>Status:</b>{" "}
            <span
              className={
                app.status === "pending"
                  ? "text-warning"
                  : app.status === "accepted"
                  ? "text-success"
                  : "text-danger"
              }
            >
              {app.status}
            </span>
          </p>

          {app.status === "pending" && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => updateStatus(app._id, "accepted")}
              >
                Accept
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => updateStatus(app._id, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
