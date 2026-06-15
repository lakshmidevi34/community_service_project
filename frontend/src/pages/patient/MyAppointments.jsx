import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

export default function MyAppointments() {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios
      .get(`/patient-api/my-appointments/${user._id}`)
      .then(res => setApps(res.data.payload));
  }, []);

  return (
    <div className="card p-3 shadow">
      <h5>My Appointments</h5>

      {apps.map(a => (
        <div key={a._id} className="border p-2 mb-2">
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}
