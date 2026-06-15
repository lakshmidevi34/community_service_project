import PendingHSW from "./PendingHSW";

export default function AdminDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row">
        <div className="col-md-12">
          <PendingHSW />
        </div>
      </div>
    </div>
  );
}
