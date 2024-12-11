"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token");
        if (token) {
          // Verify token by making a request to /auth/me
          const response = await fetch("http://localhost:8080/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Token is valid, redirect to dashboard
            router.replace("/dashboard");
            return;
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("token");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return children;
}
