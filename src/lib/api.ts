const SERVER_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://studiospace-server-ajny.onrender.com";

const API_URL =
  typeof window !== "undefined"
    ? ""
    : SERVER_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
}