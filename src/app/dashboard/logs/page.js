"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Terminal } from "lucide-react";

export default function LogsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/applications.ApplicationsService/ListApplications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
          }),
        },
      );

      const data = await response.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  }

  const handleApplicationClick = (appId) => {
    router.push(`/dashboard/logs/${appId}`);
  };

  return (
    <div className="bg-gray-50/50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold mb-6">Logs</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => handleApplicationClick(app.id)}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{app.name}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Description:</span>
                      <span className="text-right">{app.description}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span>{new Date(app.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
