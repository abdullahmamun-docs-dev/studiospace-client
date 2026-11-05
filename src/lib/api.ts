const API_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
}