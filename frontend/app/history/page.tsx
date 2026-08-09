"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import { getChatSessions } from "@/lib/api";
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
            <div className="space-y-3">

              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
                >

                  {/* Icon */}
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
              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}