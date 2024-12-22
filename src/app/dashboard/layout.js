"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="px-4">
          <div className="flex justify-between h-12">
            <div className="flex items-center gap-8">
              <span className="text-md font-medium">Argus Dashboard</span>
              {/* <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <p className="text-sm text-gray-600 hover:text-gray-800">
                    Home
                  </p>
                </Link>
                <Link href="/dashboard/api-keys">
                  <p className="text-sm text-gray-600 hover:text-gray-800">
                    API Keys
                  </p>
                </Link>
                <Link href="/dashboard/monitors">
                  <p className="text-sm text-gray-600 hover:text-gray-800">
                    Monitors
                  </p>
                </Link>
                <Link href="/dashboard/logs">
                  <p className="text-sm text-gray-600 hover:text-gray-800">
                    Logs
                  </p>
                </Link>
              </div> */}
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">{user.email}</span>
              )}
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <nav className="bg-white border-b">
        <div className="px-4">
          <div className="flex items-center gap-4 h-12">
            <Link href="/dashboard">
              <p className="text-sm text-gray-600 hover:text-gray-800">Home</p>
            </Link>
            <Link href="/dashboard/applications">
              <p className="text-sm text-gray-600 hover:text-gray-800">
                Applications
              </p>
            </Link>
            <Link href="/dashboard/logs">
              <p className="text-sm text-gray-600 hover:text-gray-800">Logs</p>
            </Link>
            <Link href="/dashboard/monitors">
              <p className="text-sm text-gray-600 hover:text-gray-800">
                Monitors
              </p>
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
