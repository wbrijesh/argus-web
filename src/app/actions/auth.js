"use server";

import { redirect } from "next/navigation";

export async function login(formData) {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    // Note: We'll need to handle token storage on the client side
    // as we can't access localStorage from server actions
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Invalid credentials" };
  }
}

export async function register(formData) {
  try {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    redirect("/login");
  } catch (error) {
    return { success: false, error: "Registration failed" };
  }
}
