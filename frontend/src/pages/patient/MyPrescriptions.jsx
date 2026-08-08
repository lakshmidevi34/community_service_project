import { useContext, useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

export default function MyPrescriptions() {
  const { user } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/patient-api/prescriptions/${user._id}`);
      setPrescriptions(res.data.payload || []);
    } catch (err) {
      console.error("Error loading prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  return (
    <div className="card p-3 shadow mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">💊 My Medical Prescriptions</h5>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchPrescriptions}
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-muted small">Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <p className="text-muted small">No prescriptions issued by doctors yet.</p>
      ) : (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {prescriptions.slice().reverse().map((p, idx) => (
            <div key={idx} className="border rounded p-3 mb-2 bg-light border-primary">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-0 text-primary fw-bold">
                    👨‍⚕️ {p.hswId?.hswname || "Doctor / Health Worker"}
                  </h6>
                  <small className="text-muted">{p.hswId?.email}</small>
                </div>
                <span className="badge bg-secondary">
                  📅 {new Date(p.date).toLocaleDateString()}
                </span>
              </div>
              <div className="p-2 bg-white rounded border">
                <p className="mb-0 small fw-semibold text-dark" style={{ whiteSpace: "pre-wrap" }}>
                  {p.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
