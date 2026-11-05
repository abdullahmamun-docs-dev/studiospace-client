const API_URL = "";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
}