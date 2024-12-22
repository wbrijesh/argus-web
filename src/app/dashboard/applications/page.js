"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { Terminal, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingApps, setDeletingApps] = useState(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const response = await fetch(
        "http://localhost:8080/twirp/applications.ApplicationsService/ListApplications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch applications");

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      setError("Failed to load applications");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteApplication(appId, e) {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to delete this application? This action cannot be undone and will delete all associated logs.",
      )
    ) {
      return;
    }

    setDeletingApps((prev) => new Set([...prev, appId]));

    try {
      const response = await fetch(
        `http://localhost:8080/twirp/applications.ApplicationsService/DeleteApplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            application_id: appId,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to delete application");

      await fetchApplications();
    } catch (error) {
      setError("Failed to delete application");
      console.error("Error:", error);
    } finally {
      setDeletingApps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(appId);
        return newSet;
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white shadow p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-12 my-0">
          <div className="text-center">
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              No applications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first application to start sending logs to Argus.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/applications/new">
                <Button variant="secondary">Create Application</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => router.push(`/dashboard/applications/${app.id}`)}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer relative"
          >
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/applications/${app.id}/edit`);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleDeleteApplication(app.id, e)}
                    disabled={deletingApps.has(app.id)}
                  >
                    {deletingApps.has(app.id) ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
    </div>
  );
}
