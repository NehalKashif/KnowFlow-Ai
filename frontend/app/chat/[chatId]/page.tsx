"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import {
    getChat,
    getChatMessages,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Chat {
  id: string;
  title: string;
  created_at: string;
}
interface Message {
    id: string;
    role: string;
    content: string;
    created_at: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();

  const chatId = params.chatId as string;

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
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
        const chatData = await getChat(chatId);
        const messageData = await getChatMessages(chatId);

        setChat(chatData);
        setMessages(messageData);
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

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto py-6">

              {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                      <div className="max-w-md text-center">

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
                              +
                          </div>

                          <h2 className="mt-6 text-2xl font-semibold">
                              Continue your knowledge session
                          </h2>

                          <p className="mt-3 leading-6 text-gray-400">
                              This conversation doesn't have any
                              messages yet.
                          </p>

                      </div>
                  </div>
              ) : (
                  messages.map((message) => (
                      <div
                          key={message.id}
                          className={`flex ${
                              message.role === "user"
                                  ? "justify-end"
                                  : "justify-start"
                          }`}
                      >
                          <div
                              className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                                  message.role === "user"
                                      ? "bg-cyan-500 text-black"
                                      : "border border-white/10 bg-white/[0.05] text-white"
                              }`}
                          >
                              <p className="whitespace-pre-wrap leading-6">
                                  {message.content}
                              </p>
                          </div>
                      </div>
                  ))
              )}

          </div>

        </div>

      </section>

    </main>
  );
}