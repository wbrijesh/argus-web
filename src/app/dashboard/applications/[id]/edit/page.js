"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function EditApplicationPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newKey, setNewKey] = useState(null);

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
      setName(data.application.name);
      setDescription(data.application.description);
    } catch (error) {
      setError(error.message || "Failed to load application");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/applications.ApplicationsService/UpdateApplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            application_id: resolvedParams.id,
            name,
            description,
          }),
        },
      );

      const data = await response.json();
      if (data.code || data.msg) {
        throw new Error(data.msg || "Failed to update application");
      }

      router.push(`/dashboard/applications/${resolvedParams.id}`);
    } catch (error) {
      setError(error.message || "Failed to update application");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegenerateKey() {
    if (
      !confirm(
        "Are you sure you want to regenerate the API key? The old key will stop working immediately.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/applications.ApplicationsService/RegenerateKey`,
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
        throw new Error(data.msg || "Failed to regenerate key");
      }

      setNewKey(data.key);
    } catch (error) {
      setError(error.message || "Failed to regenerate key");
      console.error("Error:", error);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (!application) return <div>Application not found</div>;

  return (
    <div className="space-y-6">
      {newKey && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            New API Key Generated
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Please copy your new API key now. You won't be able to see it again!
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <code className="text-sm break-all">{newKey}</code>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(newKey);
            }}
          >
            Copy to Clipboard
          </Button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Edit Application
            </h2>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Application Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">API Key</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate a new API key if the current one has been
                  compromised.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleRegenerateKey}
              >
                Generate New Key
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() =>
                router.push(`/dashboard/applications/${resolvedParams.id}`)
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
