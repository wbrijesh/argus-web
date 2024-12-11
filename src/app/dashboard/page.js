"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-lg mb-4">Welcome to your dashboard</h1>
      <div className="space-y-4">
        <div>
          <h2 className="mb-2">Profile</h2>
          <div className="space-y-1">
            <div className="flex">
              <span className="text-sm text-gray-500 w-24">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24">Member since:</span>
              <span className="text-sm">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24">User ID:</span>
              <span className="text-sm font-mono bg-gray-50 px-2 rounded">
                {user.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
