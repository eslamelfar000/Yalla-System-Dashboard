"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/header";
import SettingsHeader from "./components/settings-header";
import { getUserData } from "@/lib/auth-utils";

// Create User Data Context
const UserDataContext = createContext();

// Custom hook to use user data context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};

// User Data Provider component
const UserDataProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data on mount
    loadUserData();
  }, []);

  const loadUserData = () => {
    setIsLoading(true);
    const user = getUserData();
    setUserDataState(user);
    setIsLoading(false);
  };

  const updateUserData = (newUserData) => {
    setUserDataState(newUserData);

    // Dispatch custom event to notify other components (like header) about profile update
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: newUserData,
        })
      );
    }
  };

  const value = {
    userData,
    isLoading,
    loadUserData,
    updateUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

const ProfileLayout = ({ children }) => {
  const location = usePathname();

  if (location === "/user-profile/settings") {
    return (
      <UserDataProvider>
        <React.Fragment>
          <SettingsHeader />
          <div className="mt-6">{children}</div>
        </React.Fragment>
      </UserDataProvider>
    );
  }

  return (
    <UserDataProvider>
      <React.Fragment>
        <Header />
        {children}
      </React.Fragment>
    </UserDataProvider>
  );
};

export default ProfileLayout;
