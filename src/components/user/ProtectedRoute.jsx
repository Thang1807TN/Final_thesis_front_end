import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../common/Loader";

function ProtectedRoute({ children, adminOnly = false }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <Loader text="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
