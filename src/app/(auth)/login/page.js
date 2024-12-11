import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-md border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Sign in to your account</h2>
          <p className="text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-blue-800 hover:text-blue-1000"
            >
              create a new account
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
