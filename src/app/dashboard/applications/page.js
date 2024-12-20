"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";

export default function ApplicationsPage() {
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

  async function handleDeleteApplication(appId) {
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

      await fetchApplications(); // Refresh the list
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
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      {applications.map((app) => (
        <ApplicationItem
          key={app.id}
          application={app}
          onDelete={() => handleDeleteApplication(app.id)}
          isDeleting={deletingApps.has(app.id)}
        />
      ))}
    </div>
  );
}

function ApplicationItem({ application, onDelete, isDeleting }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">
            {application.name}
          </h3>
          <p className="text-sm text-gray-500">{application.description}</p>
          <div className="text-xs text-gray-400">
            Created on {new Date(application.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/applications/${application.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            View Details
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={`text-sm text-red-600 hover:text-red-900 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
