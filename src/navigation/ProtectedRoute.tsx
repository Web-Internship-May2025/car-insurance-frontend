import type React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { UserRoleType } from "../types/UserServiceTypes";
import { getUserRoleType } from "../services/jwtService";

type ProtectedRouteProps = {
  allowedRoles?: UserRoleType[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const role = getUserRoleType();

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
