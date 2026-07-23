import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store/store";
import { getProfile } from "../../entities/User/api/api";
import { logout, setUserWithToken } from "../../entities/User/model/userSlice";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await getProfile(token);

        dispatch(
          setUserWithToken({
            user: response.data,
            token,
          }),
        );
      } catch {
        localStorage.removeItem("token");
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};
