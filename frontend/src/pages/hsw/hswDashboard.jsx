import Appointments from "./Appointments";

export default function HSWDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Health Worker Dashboard</h2>

      <div className="row">
        <div className="col-md-12">
          <Appointments />
        </div>
      </div>
    </div>
  );
}
