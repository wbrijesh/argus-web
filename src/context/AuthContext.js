"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to fetch user data using the token
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/auth.AuthService/ValidateToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data" + response.statusText);
      }

      const userData = await response.json();
      setUser(userData.user);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
    }
  };

  // Check for token and fetch user data on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
