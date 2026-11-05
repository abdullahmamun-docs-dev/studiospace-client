import { createAuthClient } from "better-auth/react";

const AUTH_BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : "https://studiospace-server-ajny.onrender.com/api/auth";

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});