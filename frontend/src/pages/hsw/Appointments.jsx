import { useContext, useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

export default function Appointments() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const res = await axios.get(
        `/hsworker-api/appointments/${user._id}`
      );
      setAppointments(res.data.payload || []);
    } catch (err) {
      alert("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadAppointments();
    }
  }, [user]);

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
      <h5 className="mb-3">🩺 My Consultations & Appointments</h5>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted">No appointments requested yet.</p>
      ) : (
        appointments.map((app) => (
          <div
            key={app._id}
            className="border rounded p-3 mb-3 bg-white shadow-sm"
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5>Patient: {app.patientId?.name || "Unknown"}</h5>
                <p className="text-muted mb-1 small">Email: {app.patientId?.email}</p>
                <p className="mb-1">
                  <b>Appointment Date:</b> {new Date(app.appointmentDate).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <b>Reason for Visit:</b> {app.reason}
                </p>
              </div>

              <div>
                <span
                  className={`badge px-3 py-2 ${
                    app.status === "pending"
                      ? "bg-warning text-dark"
                      : app.status === "accepted"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {app.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Patient Health Condition Logs */}
            <div className="mt-3 p-3 bg-light rounded border">
              <h6 className="fw-bold mb-2">📋 Patient's Health & Condition History:</h6>
              {!app.patientId?.todayCondition || app.patientId.todayCondition.length === 0 ? (
                <p className="text-muted small mb-0">No health condition logs recorded by this patient.</p>
              ) : (
                <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                  {app.patientId.todayCondition.slice().reverse().map((c, idx) => (
                    <div key={idx} className="border-bottom pb-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          className={`badge ${
                            c.status === "Well"
                              ? "bg-success"
                              : c.status === "Recovering"
                              ? "bg-info text-dark"
                              : c.status === "Critical"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {c.status || "Sick"}
                        </span>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                      <p className="small text-dark mt-1 mb-0">{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {app.status === "pending" && (
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-success btn-sm px-3"
                  onClick={() => updateStatus(app._id, "accepted")}
                >
                  ✓ Accept Appointment
                </button>

                <button
                  className="btn btn-danger btn-sm px-3"
                  onClick={() => updateStatus(app._id, "rejected")}
                >
                  ✕ Reject Appointment
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
