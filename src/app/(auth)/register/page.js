import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-md border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-800 hover:text-blue-1000"
            >
              Sign in
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
