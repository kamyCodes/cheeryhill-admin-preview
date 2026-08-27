import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./component/Auth/Login";
import ProtectedRoute from "./context/ProtectedRoute";
import Dashboard from "./component/Dashboard/Dashboard";

// Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminMnagement from "./pages/AdminMnagement";
import AdminRegister from "./component/Auth/Register";
import AdminServices from "./pages/AdminServices";
import AdminTestimonials from "./pages/AdminTestimonials";
import Webinars from "./pages/Webinars";
import PressRelease from "./pages/PressRelease";
import Faqs from "./pages/Faqs";
import Contacts from "./pages/Contacts";
import Leadership from "./pages/Leadership";
import Awards from "./pages/Awards";
import CompanySettings from "./pages/CompanySettings";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#1a1a2e",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<AdminRegister />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
             <ProtectedRoute>
              <Dashboard />
             </ProtectedRoute>
          }
        >
          {/* Default route: /dashboard */}
          <Route index element={<AdminDashboard/>} />

          {/* Content Management Routes */}
          <Route path="admin-manage" element={<AdminMnagement />} />
          <Route path="services" element={<AdminServices/>} />
          <Route path="testimonials" element={<AdminTestimonials/>} />
          <Route path="webinars" element={<Webinars/>} />
          <Route path="press-release" element={<PressRelease/>} />
          <Route path="faqs" element={<Faqs/>} />
          <Route path="contacts" element={<Contacts/>} />
          <Route path="leadership" element={<Leadership/>} />
          <Route path="awards" element={<Awards/>} />
          <Route path="company-info" element={<CompanySettings/>} />
          
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
