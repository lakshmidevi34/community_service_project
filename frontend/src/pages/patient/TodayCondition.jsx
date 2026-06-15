import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

export default function TodayCondition() {
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState("");

  const submit = async () => {
    await axios.put(`/patient-api/todaycondi/${user._id}`, { description });
    alert("Condition added");
    setDescription("");
  };

  return (
    <div className="card p-3 shadow">
      <h5>Today Condition</h5>
      <textarea className="form-control mb-2"
        onChange={(e) => setDescription(e.target.value)} />
      <button onClick={submit} className="btn btn-primary">Submit</button>
    </div>
  );
}
