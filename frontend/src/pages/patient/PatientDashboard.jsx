import TodayCondition from "./TodayCondition";
import RequestAppointment from "./RequestAppointment";
import MyAppointments from "./MyAppointments";
import MyPrescriptions from "./MyPrescriptions";

export default function PatientDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Patient Dashboard</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <TodayCondition />
        </div>
        <div className="col-md-6 mb-4">
          <RequestAppointment />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <MyAppointments />
        </div>
        <div className="col-md-6 mb-4">
          <MyPrescriptions />
        </div>
      </div>
    </div>
  );
}
