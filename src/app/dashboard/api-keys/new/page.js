"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function NewAPIKeyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [newKey, setNewKey] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/twirp/apikeys.APIKeysService/CreateAPIKey",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            name: name,
            expires_at: "", // Optional, you can add a date picker if needed
          }),
        },
      );

      const data = await response.json();

      // Check for Twirp error response
      if (data.code || data.msg) {
        throw new Error(data.msg || "Failed to create API key");
      }

      if (!data.key) {
        throw new Error("No API key received");
      }

      setNewKey({
        key: data.key,
        name: data.api_key.name,
        created_at: data.api_key.created_at,
      });
    } catch (error) {
      setError(error.message || "Failed to create API key");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {newKey ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              API Key Created: {newKey.name}
            </h2>
            <p className="text-sm text-gray-500">
              Please copy your API key now. You won't be able to see it again!
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <code className="text-sm break-all">{newKey.key}</code>
            </div>
            <p className="text-xs text-gray-500">
              Created on: {new Date(newKey.created_at).toLocaleString()}
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(newKey.key);
                }}
              >
                Copy to Clipboard
              </Button>
              <Button onClick={() => router.push("/dashboard/api-keys")}>
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
                Create New API Key
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Give your API key a name to help you identify it later.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <Input
                label="API Key Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Development Server"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.push("/dashboard/api-keys")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create API Key"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
