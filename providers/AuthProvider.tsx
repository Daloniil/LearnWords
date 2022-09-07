import React, { useCallback, useState } from "react";
import { Auth, AuthContextType } from "../Interfaces/ProvidersInterface";
import { ContextKey } from "../services/localKey";
import { LocalStorageService } from "../services/localStorageService";

export const AuthContext = React.createContext<AuthContextType>({
  authContext: { user: { displayName: "", uid: "" } },
  setAuth: () => {},
  removeAuth: () => {},
});

const appGetAuth = (key: string): Auth => {
  return (
    LocalStorageService.getItem<Auth>(key) ?? {
      user: { displayName: "", uid: "" },
    }
  );
};

export const AuthProvider: React.FC = ({ children }) => {
  const [authContext, setAuth] = useState(appGetAuth(ContextKey.AUTH));

  const updateState = () => {
    setAuth(appGetAuth(ContextKey.AUTH));
  };

  const handleSetAuth = (auth: Auth) => {
    LocalStorageService.setAuth(auth);
    updateState();
  };

  const handleRemoveAuth = () => {
    LocalStorageService.removeAuth();
    updateState();
  };

  const value = {
    authContext,
    setAuth: useCallback((auth: Auth) => handleSetAuth(auth), []),

    removeAuth: useCallback(() => handleRemoveAuth(), []),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
