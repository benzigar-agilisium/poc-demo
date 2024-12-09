"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { BrowserAuthError } from "@azure/msal-browser";
import { getOrigin } from "@/utils/urls";

const msalConfig = {
  auth: {
    clientId: "2b2b47a2-2a79-4aba-bcce-d625dcbb32cb",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: getOrigin() + "/login",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userAccount, setUserAccount] = useState(() => {
    if (typeof window !== "undefined") {
      const storedAccount = localStorage.getItem("userAccount");
      return storedAccount ? JSON.parse(storedAccount) : null;
    } else return null;
  });

  useEffect(() => {
    if (userAccount) {
      localStorage.setItem("userAccount", JSON.stringify(userAccount));
    } else {
      localStorage.removeItem("userAccount");
    }
  }, [userAccount]);

  const login = async () => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        setUserAccount(accounts[0]);
        return;
      }

      await msalInstance.initialize();

      const response = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "User.Read"],
      });

      setUserAccount(response.account);
    } catch (error) {
      if (
        error instanceof BrowserAuthError &&
        error.errorCode === "interaction_in_progress"
      ) {
        console.warn("Login is already in progress. Please try again later.");
      } else {
        console.error("Login error", error);
      }
    }
  };

  const logout = async () => {
    try {
      await msalInstance.initialize();
      await msalInstance.logoutPopup({
        postLogoutRedirectUri: window.location.href,
      });
      setUserAccount(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userAccount, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
