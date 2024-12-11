"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/app/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError("");

    const result = await login(formData);

    if (result.success) {
      // Handle successful login on the client side
      await authLogin(result.data.user, result.data.token);
      router.push("/dashboard");
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form action={handleSubmit} ref={formRef}>
        <div className="space-y-8">
          <div className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              required
              error={error}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              minLength={6}
              error={error}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-800 hover:bg-blue-900 transition text-white px-4 py-2 rounded-md font-medium"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
