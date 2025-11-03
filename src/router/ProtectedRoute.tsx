import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";
import { useAuthContext } from "@context/AuthContext";
import { Loader } from "@modules/shared/components/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { isLoading, isSessionValid } = useAuthContext();
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return fallback || <Loader fullScreen />;
  }

  if (!isSessionValid || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
