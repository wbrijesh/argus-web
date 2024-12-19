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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        },
      );

      if (!response.ok) throw new Error("Failed to create API key");

      const data = await response.json();
      setNewKey(data.key);
    } catch (error) {
      setError("Failed to create API key");
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
              API Key Created
            </h2>
            <p className="text-sm text-gray-500">
              Please copy your API key now. You won't be able to see it again!
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <code className="text-sm break-all">{newKey}</code>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(newKey);
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
