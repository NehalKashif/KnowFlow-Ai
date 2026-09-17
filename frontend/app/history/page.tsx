"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import { deleteChat, getChatSessions } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

export default function HistoryPage() {
  const router = useRouter();

  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadChats = async () => {
      try {
        const data = await getChatSessions();

        setChats(data);
      } catch (error) {
        console.error("Failed to load chat history:", error);

        setError("Unable to load your chat history.");
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [router]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredChats = normalizedSearchQuery
    ? chats.filter((chat) =>
        chat.title.toLowerCase().includes(normalizedSearchQuery)
      )
    : chats;

  const handleDeleteChat = async (chatId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat? This action cannot be undone."
    );

    if (!confirmed || deletingChatId) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      setError("");

      await deleteChat(chatId);

      setChats((currentChats) =>
        currentChats.filter((chat) => chat.id !== chatId)
      );
    } catch (error) {
      console.error("Failed to delete chat:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete chat."
      );
    } finally {
      setDeletingChatId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      <Sidebar />

      <Topbar />

      <section className="ml-64 pt-20">

        <div className="mx-auto max-w-7xl px-8 py-10">

          {/* Header */}
          <div className="mb-8">

            <p className="text-sm font-medium text-cyan-400">
              Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Chat History
            </h1>

            <p className="mt-2 text-gray-400">
              Continue your previous knowledge sessions.
            </p>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-gray-400">
                Loading your conversations...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
              <p className="text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && chats.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl text-cyan-400">
                ◷
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No conversations yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create a new chat to start building your knowledge space.
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Create New Chat
              </button>

            </div>
          )}

          {/* Chat list */}
          {!loading && !error && chats.length > 0 && (
            <>
              <div className="relative mb-5">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  ⌕
                </span>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search chats..."
                  aria-label="Search chats"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-gray-500 hover:border-white/20 focus:border-cyan-400/40"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear chat search"
                    title="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  >
                    ×
                  </button>
                )}
              </div>

              {filteredChats.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
                  <p className="text-gray-400">
                    No chats found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">

                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
                    >

                      {/* Icon */}
                      <button
                        type="button"
                        onClick={() => router.push(`/chat/${chat.id}`)}
                        className="flex min-w-0 flex-1 items-center gap-4 text-left"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                          ◷
                        </div>

                        {/* Chat information */}
                        <div className="min-w-0 flex-1">

                          <h2 className="truncate font-semibold text-white">
                            {chat.title}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            Created {formatDate(chat.created_at)}
                          </p>

                        </div>

                        {/* Arrow */}
                        <div className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                          →
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteChat(chat.id)}
                        disabled={deletingChatId !== null}
                        aria-label={`Delete chat ${chat.title}`}
                        title="Delete chat"
                        className="shrink-0 rounded-lg border border-transparent px-3 py-2 text-sm text-gray-500 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400 focus:border-red-400/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingChatId === chat.id ? "Deleting..." : "Delete"}
                      </button>

                    </div>
                  ))}

                </div>
              )}
            </>
          )}

        </div>

      </section>

    </main>
  );
}