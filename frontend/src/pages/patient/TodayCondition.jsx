import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

export default function TodayCondition() {
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Sick");
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConditions = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/patient-api/todaycondi/${user._id}`);
      setConditions(res.data.payload || []);
    } catch (err) {
      console.error("Failed to load condition history", err);
    }
  };

  useEffect(() => {
    fetchConditions();
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please enter a description of your condition");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`/patient-api/todaycondi/${user._id}`, { description, status });
      alert("Condition logged successfully!");
      setDescription("");
      fetchConditions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to log condition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 shadow mb-4">
      <h5 className="mb-3">🩺 Log Health Condition</h5>
      <form onSubmit={submit}>
        <label className="form-label fw-bold small">Status:</label>
        <select
          className="form-select mb-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Sick">🤒 Sick / Unwell</option>
          <option value="Well">😊 Feeling Well</option>
          <option value="Recovering">🩹 Recovering / Improving</option>
          <option value="Critical">🚨 Critical / Severe Symptoms</option>
        </select>

        <label className="form-label fw-bold small">Symptoms / Details:</label>
        <textarea
          className="form-control mb-3"
          rows="2"
          placeholder="e.g. Fever 101F, headache..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
          {loading ? "Submitting..." : "Submit Condition"}
        </button>
      </form>

      <h6 className="border-top pt-3 fw-bold small">📋 Condition History:</h6>
      {conditions.length === 0 ? (
        <p className="text-muted small">No past health logs recorded yet.</p>
      ) : (
        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          {conditions.slice().reverse().map((c, idx) => (
            <div key={idx} className="border rounded p-2 mb-2 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-1">
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
              <p className="mb-0 small text-dark">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
