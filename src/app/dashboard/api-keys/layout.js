"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { usePathname } from "next/navigation";

export default function APIKeysLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
              <p className="mt-3 text-sm text-gray-500">
                Manage your API keys for programmatic access to Argus.
              </p>
            </div>
            {pathname === "/dashboard/api-keys" && (
              <Link href="/dashboard/api-keys/new">
                <Button>Create API Key</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
