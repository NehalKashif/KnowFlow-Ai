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

export async function createChat(title: string) {
  const response = await apiFetch("/chat/session", {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to create chat."
    );
  }

  return response.json();
}

export async function getChatSessions() {
  const response = await apiFetch("/chat/sessions");

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to fetch chat history."
    );
  }

  return response.json();
}

export async function getChat(chatId: string) {
  const response = await apiFetch(`/chat/${chatId}`);
  console.log(response, "RESPONSE FROM GET CHAT");
  if (!response.ok) {
    const data = await response.json();
    console.log("Failed to load chat:", data);

    throw new Error(
      data.detail || "Failed to load chat."
    );
  }

  return response.json();
}

export async function getChatMessages(chatId: string) {
    const response = await apiFetch(
        `/chat/${chatId}/messages`
    );

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.detail || "Failed to load messages."
        );
    }
    console.log(await response, "RESPONSE FROM GET CHAT MESSAGES");
    return response.json();
}

export async function sendMessage(
  chatId: string,
  question: string,
  topK: number = 5
) {
  const response = await apiFetch(`/chat/${chatId}`, {
    method: "POST",
    body: JSON.stringify({
      question,
      top_k: topK,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to send message."
    );
  }

  return response.json();
}

export async function uploadDocument(
  chatId: string,
  file: File
) {
  const token = getToken();

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/chat/${chatId}/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to upload document."
    );
  }

  return response.json();
}