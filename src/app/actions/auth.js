"use server";

export async function login(formData) {
  try {
    const response = await fetch(
      `https://argus-core.brijesh.dev/twirp/auth.AuthService/Login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    // Note: We'll need to handle token storage on the client side
    // as we can't access localStorage from server actions
    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Invalid credentials" };
  }
}

export async function register(formData) {
  try {
    const response = await fetch(
      `https://argus-core.brijesh.dev/twirp/auth.AuthService/Register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed " + error };
  }
}
