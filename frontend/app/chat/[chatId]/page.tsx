"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import { getChat } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();

  const chatId = params.chatId as string;

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }
    
    const loadChat = async () => {
      try {
        const data = await getChat(chatId);

        setChat(data);
      } catch (error) {
        console.error("Failed to load chat:", error);

        setError("Unable to load this chat.");
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [chatId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] flex items-center justify-center">
        <p className="text-gray-400">
          Loading conversation...
        </p>
      </main>
    );
  }

  if (error || !chat) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <Sidebar />
        <Topbar />

        <section className="ml-64 pt-20">
          <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">

            <div className="text-center">

              <h1 className="text-2xl font-semibold">
                Chat not found
              </h1>

              <p className="mt-2 text-gray-400">
                This conversation may have been deleted or you may not have access to it.
              </p>

              <button
                onClick={() => router.push("/history")}
                className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                Back to History
              </button>

            </div>

          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      <Sidebar />

      <Topbar />

      <section className="ml-64 pt-20">

        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col px-8 py-10">

          {/* Chat header */}
          <div className="mb-8">

            <p className="text-sm font-medium text-cyan-400">
              Knowledge Chat
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {chat.title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Created{" "}
              {new Date(chat.created_at).toLocaleDateString()}
            </p>

          </div>

          {/* Empty chat */}
          <div className="flex flex-1 items-center justify-center">

            <div className="max-w-md text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
                +
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Continue your knowledge session
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Upload a document to this chat and start
                asking questions about your knowledge.
              </p>

              <button
                className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Upload Document
              </button>

              <p className="mt-4 text-xs text-gray-600">
                Chat ID: {chat.id}
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}