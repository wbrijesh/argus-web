"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { usePathname } from "next/navigation";

export default function ApplicationsLayout({ children }) {
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
              <h1 className="text-2xl font-semibold text-gray-900">
                Applications
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Manage your applications and their logging configurations.
              </p>
            </div>
            {pathname === "/dashboard/applications" && (
              <Link href="/dashboard/applications/new">
                <Button>Create Application</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
