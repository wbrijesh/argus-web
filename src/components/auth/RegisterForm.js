"use client";

import { useRef, useState } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { register } from "@/app/actions/auth";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError("");

    // Check if passwords match
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const result = await register(formData);

    if (!result?.success && result?.error) {
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
              pattern="[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i"
              error={error}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              minLength={6}
              ref={passwordRef}
              error={error}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              error={error}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-800 hover:bg-blue-900 transition text-white px-4 py-2 rounded-md font-medium"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </div>
  );
}
