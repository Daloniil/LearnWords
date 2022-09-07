import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const useAuth = () => {
  const { authContext, setAuth, removeAuth } = useContext(AuthContext);

  return {
    authContext,
    setAuth,
    removeAuth,
  };
};
