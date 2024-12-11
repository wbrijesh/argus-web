"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  async function fetchAPIKeys() {
    try {
      const response = await fetch("http://localhost:8080/api-keys", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      setError("Failed to load API keys");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading API keys...</div>
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

  async function handleRevokeKey(keyId) {
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api-keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to revoke API key");

      await fetchAPIKeys(); // Refresh the list
    } catch (error) {
      setError("Failed to revoke API key");
      console.error("Error:", error);
    }
  }

  if (!apiKeys) {
    return (
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-12 my-0">
          <div className="text-center">
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              No API keys
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create an API key to get started with programmatic access.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/api-keys/new">
                <Button variant="secondary">Create API Key</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {apiKeys &&
          apiKeys.map((key) => (
            <APIKeyItem
              key={key.id}
              apiKey={key}
              onRevoke={() => handleRevokeKey(key.id)}
            />
          ))}
      </div>
    </>
  );
}

function APIKeyItem({ apiKey, onRevoke }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900 capitalize w-48 truncate">
            {apiKey.name}
          </h3>
          <div className="mt-1 text-sm text-gray-500">
            Created on {new Date(apiKey.created_at).toLocaleDateString()}
          </div>
          {apiKey.last_used_at && (
            <div className="mt-1 text-sm text-gray-500">
              Last used on {new Date(apiKey.last_used_at).toLocaleDateString()}
            </div>
          )}
        </div>
        <button
          onClick={onRevoke}
          className="text-sm text-red-600 hover:text-red-900"
        >
          Revoke
        </button>
      </div>
    </div>
  );
}
