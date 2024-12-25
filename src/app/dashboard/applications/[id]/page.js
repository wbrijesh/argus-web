"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/shared/Button";

export default function ApplicationDetailsPage({ params }) {
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const resolvedParams = use(params);

  useEffect(() => {
    fetchApplication();
  }, []);

  async function fetchApplication() {
    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/applications.ApplicationsService/GetApplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            application_id: resolvedParams.id,
          }),
        },
      );

      const data = await response.json();
      if (data.code || data.msg) {
        throw new Error(data.msg || "Failed to fetch application");
      }

      setApplication(data.application);
    } catch (error) {
      setError(error.message || "Failed to load application");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!application) return <div>Application not found</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {application.description}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href={`/dashboard/applications/${resolvedParams.id}/edit`}>
              <Button variant="secondary">Edit Application</Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Application ID
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{application.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(application.created_at).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(application.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">
            Usage Instructions
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Use this application's API key to send logs to Argus. Refer to our
            documentation for detailed integration instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
