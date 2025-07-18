import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserRoleType } from "../services/jwtService"; 

const PublicRoute: React.FC = () => {
  const role = getUserRoleType(); 
  const location = useLocation();

  if (role) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;