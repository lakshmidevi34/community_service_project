import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

export default function PendingHSW() {
  const [pending, setPending] = useState([]);

  const loadPending = async () => {
    try {
      const res = await axios.get("/admin-api/pending-hsworkers");
      setPending(res.data.payload);
    } catch (err) {
      alert("Error loading pending health workers");
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approveWorker = async (id) => {
    try {
      await axios.put(`/admin-api/approve-hsworker/${id}`);
      loadPending(); // refresh list
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="card p-3 shadow">
      <h5>Pending Health Workers</h5>

      {pending.length === 0 && (
        <p className="text-muted">No pending approvals</p>
      )}

      {pending.map((hsw) => (
        <div
          key={hsw._id}
          className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
        >
          <div>
            <p className="mb-1"><b>Name:</b> {hsw.hswname}</p>
            <p className="mb-1"><b>Email:</b> {hsw.email}</p>
          </div>

          <button
            className="btn btn-success"
            onClick={() => approveWorker(hsw._id)}
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}
