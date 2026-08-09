import { getToken } from "./auth";

const API_URL = "http://127.0.0.1:8000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");

    window.location.href = "/login";

    throw new Error("Authentication required.");
  }

  return response;
}

export async function getCurrentUser() {
  const response = await apiFetch("/auth/me");

  if (!response.ok) {
    throw new Error("Failed to get current user.");
  }

  return response.json();
}