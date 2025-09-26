import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/useAuth";
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
