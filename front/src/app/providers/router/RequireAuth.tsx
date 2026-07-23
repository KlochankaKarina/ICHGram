import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store.ts";
import { AppRoutes, RoutePath } from "../../../shared/config/RouteConfig.tsx";

interface RequireAuthProps {
  children: React.ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const token = localStorage.getItem("token");
  if (!user && !token) {
    alert("Please Sign up");
    return <Navigate to={RoutePath[AppRoutes.MAIN]} replace />;
  }

  return children;
}

export default RequireAuth;
