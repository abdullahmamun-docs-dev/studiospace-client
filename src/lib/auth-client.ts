import { createAuthClient } from "better-auth/react";

const SERVER_AUTH_URL =
  "https://studiospace-server-ajny.onrender.com/api/auth";

const AUTH_BASE_URL = SERVER_AUTH_URL;

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,

  fetchOptions: {
    credentials: "include",
  },
});