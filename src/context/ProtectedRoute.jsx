import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-medium">
        Authenticating...
      </div>
    );
  }

  // Check both context and localStorage as fallback
  const hasToken = auth?.token || localStorage.getItem("token");
  const hasAdmin = auth?.admin || localStorage.getItem("admin");

  console.log("[ProtectedRoute] Auth Check:", {
    contextHasToken: !!auth?.token,
    lsHasToken: !!localStorage.getItem("token"),
    contextHasAdmin: !!auth?.admin,
    lsHasAdmin: !!localStorage.getItem("admin"),
  });

  if (!hasToken || !hasAdmin) {
    console.warn("[ProtectedRoute] → No valid auth, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
}