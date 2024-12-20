"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingKeys, setDeletingKeys] = useState(new Set());

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  async function fetchAPIKeys() {
    try {
      const response = await fetch(
        "http://localhost:8080/twirp/apikeys.APIKeysService/ListAPIKeys",
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

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data.api_keys || []);
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

  async function handleDeleteKey(keyId) {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingKeys((prev) => new Set([...prev, keyId]));

    try {
      const response = await fetch(
        `http://localhost:8080/twirp/apikeys.APIKeysService/DeleteAPIKey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            key_id: keyId,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to delete API key: ", response);

      await fetchAPIKeys(); // Refresh the list
    } catch (error) {
      setError("Failed to delete API key");
      console.error("Error:", error);
    } finally {
      setDeletingKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
    }
  }

  if (!apiKeys.length) {
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
              onDelete={() => handleDeleteKey(key.id)}
              isDeleting={deletingKeys.has(key.id)}
            />
          ))}
      </div>
    </>
  );
}

function APIKeyItem({ apiKey, onDelete, isDeleting }) {
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
          onClick={onDelete}
          disabled={isDeleting}
          className={`text-sm text-red-600 hover:text-red-900 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
