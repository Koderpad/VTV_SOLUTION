import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = useUser();
  const location = useLocation();

  return user &&
    user.roles?.find((role: string) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
