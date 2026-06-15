import TodayCondition from "./TodayCondition";
import RequestAppointment from "./RequestAppointment";
import MyAppointments from "./MyAppointments";

export default function PatientDashboard() {
  return (
    <div className="container mt-4">
      <h2>Patient Dashboard</h2>

      <div className="row mt-3">
        <div className="col-md-4"><TodayCondition /></div>
        <div className="col-md-4"><RequestAppointment /></div>
        <div className="col-md-4"><MyAppointments /></div>
      </div>
    </div>
  );
}
