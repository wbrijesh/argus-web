"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function NewApplicationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [newApplication, setNewApplication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/applications.ApplicationsService/CreateApplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            name,
            description,
          }),
        },
      );

      const data = await response.json();

      // Check for Twirp error response
      if (data.code || data.msg) {
        throw new Error(data.msg || "Failed to create application");
      }

      if (!data.key) {
        throw new Error("No API key received");
      }

      setNewApplication({
        key: data.key,
        name: data.application.name,
        description: data.application.description,
        created_at: data.application.created_at,
      });
    } catch (error) {
      setError(error.message || "Failed to create application");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {newApplication ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Application Created: {newApplication.name}
            </h2>
            <div className="text-sm text-gray-500">
              <p className="font-medium">Description:</p>
              <p>{newApplication.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Please copy your API key now. You won't be able to see it again!
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <code className="text-sm break-all">{newApplication.key}</code>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Created on: {new Date(newApplication.created_at).toLocaleString()}
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(newApplication.key);
                }}
              >
                Copy API Key
              </Button>
              <Button onClick={() => router.push("/dashboard/applications")}>
                Done
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Create New Application
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new application to start sending logs to Argus.
              </p>
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
                placeholder="e.g., My Production App"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your application"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.push("/dashboard/applications")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Application"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
