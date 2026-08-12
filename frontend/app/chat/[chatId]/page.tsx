"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import {
  getChat,
  getChatMessages,
  sendMessage,
  uploadDocument,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Chat {
  id: string;
  title: string;
  created_at: string;
}
interface Source {
  filename: string;
  page: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  sources: Source[] | null;
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
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        console.log("MESSAGES FROM GET CHAT:", messageData);
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
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const result = await uploadDocument(chatId, file);

      console.log("Upload successful:", result);

      alert(`${file.name} uploaded successfully.`);
    } catch (error) {
      console.error("Upload failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

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
                              {message.role === "assistant" &&
                              message.sources &&
                              message.sources.length > 0 && (
                                <div className="mt-4 border-t border-white/10 pt-3">
                                  <p className="mb-2 text-xs font-semibold text-cyan-400">
                                    Sources
                                  </p>

                                  <div className="space-y-2">
                                    {message.sources.map((source, index) => (
                                      <div
                                        key={`${source.filename}-${source.page}-${index}`}
                                        className="rounded-lg bg-white/[0.04] px-3 py-2"
                                      >
                                        <p className="text-xs font-medium text-gray-300">
                                          {source.filename}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                          Page {source.page}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                      </div>
                  ))
              )}

          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!input.trim() || sending) {
                return;
              }

              const question = input.trim();

              setInput("");
              setSending(true);

              try {
                const userMessage: Message = {
                  id: `temp-user-${Date.now()}`,
                  role: "user",
                  content: question,
                  created_at: new Date().toISOString(),
                  sources: null,
                };

                setMessages((prev) => [...prev, userMessage]);

                const result = await sendMessage(
                  chatId,
                  question
                );

                const aiMessage: Message = {
                  id: `temp-ai-${Date.now()}`,
                  role: "assistant",
                  content: result.answer,
                  created_at: new Date().toISOString(),
                  sources: result.sources,
                };

                setMessages((prev) => [...prev, aiMessage]);

              } catch (error) {
                console.error(
                  "Failed to send message:",
                  error
                );
              } finally {
                setSending(false);
              }
            }}
            className="mt-6 flex gap-3"
          >
            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || sending}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.pptx"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Message input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about your documents..."
              disabled={sending}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400/40"
            />

            {/* Send */}
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Thinking..." : "Send"}
            </button>
          </form>

        </div>

      </section>

    </main>
  );
}