import { BrowserRouter, Routes, Route } from "react-router-dom";
import HSWDashboard from "./pages/hsw/HSWDashboard.jsx";
import Login from "./pages/auth/Login.jsx";
import RegisterPatient from "./pages/auth/RegisterPatient.jsx";
import RegisterHSW from "./pages/auth/RegisterHSW.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-hsw" element={<RegisterHSW />} />

        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
          
        />
        <Route
  path="/hsworker"
  element={
    <ProtectedRoute role="hsworker">
      <HSWDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}
