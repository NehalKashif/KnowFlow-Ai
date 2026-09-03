"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import {
  getChat,
  getChatMessages,
  getChatDocuments,
  sendMessage,
  uploadDocument,
  deleteDocument,
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

interface Document {
  id: string;
  filename: string;
  chunks: number;
  uploaded_at: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();

  const chatId = params.chatId as string;

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // Load chat, messages and documents
  // --------------------------------------------------

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
        const documentData = await getChatDocuments(chatId);

        setChat(chatData);
        setMessages(messageData);
        setDocuments(documentData);
      } catch (error) {
        console.error("Failed to load chat:", error);

        setError("Unable to load this chat.");
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [chatId, router]);

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <p className="text-gray-400">
          Loading conversation...
        </p>
      </main>
    );
  }

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  if (!chat) {
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
                This conversation may have been deleted or you may not
                have access to it.
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

  // --------------------------------------------------
  // Upload document
  // --------------------------------------------------

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const result = await uploadDocument(chatId, file);

      // Refresh documents after successful upload
      const updatedDocuments = await getChatDocuments(chatId);

      setDocuments(updatedDocuments);
    } catch (error) {
      console.error("Upload failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );
    } finally {
      setUploading(false);

      // Allows the user to select the same file again
      event.target.value = "";
    }
  };

  // --------------------------------------------------
  // Delete document
  // --------------------------------------------------

  const handleDeleteDocument = async (documentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document? This will remove it from this chat's knowledge base."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingDocumentId(documentId);
      setError("");

      await deleteDocument(documentId);

      // Remove the document immediately from UI
      setDocuments((prev) =>
        prev.filter((document) => document.id !== documentId)
      );

    } catch (error) {
      console.error("Delete failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete document."
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  // --------------------------------------------------
  // Chat
  // --------------------------------------------------

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!input.trim() || sending) {
      return;
    }

    const question = input.trim();

    setInput("");
    setSending(true);
    setError("");

    try {
      // Add user's message immediately to UI
      const userMessage: Message = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: question,
        created_at: new Date().toISOString(),
        sources: null,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send question to backend
      const result = await sendMessage(
        chatId,
        question
      );

      // Add AI response
      const aiMessage: Message = {
        id: `temp-ai-${Date.now()}`,
        role: "assistant",
        content: result.answer,
        created_at: new Date().toISOString(),
        sources: result.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Sidebar />

      <Topbar />

      <section className="ml-64 pt-20">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col px-8 py-10">

          {/* ---------------------------------------- */}
          {/* Chat Header */}
          {/* ---------------------------------------- */}

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

          {/* ---------------------------------------- */}
          {/* Hidden File Input */}
          {/* ---------------------------------------- */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.pptx"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* ---------------------------------------- */}
          {/* Error message */}
          {/* ---------------------------------------- */}

          {error && documents.length === 0 && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* ======================================== */}
          {/* NO DOCUMENTS */}
          {/* ======================================== */}

          {documents.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">

              <div className="w-full max-w-xl text-center">

                <div className="rounded-3xl border border-dashed border-cyan-400/30 bg-white/[0.03] px-8 py-14">

                  {/* Icon */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                    📄
                  </div>

                  {/* Heading */}
                  <h2 className="mt-6 text-2xl font-semibold">
                    Upload a document to get started
                  </h2>

                  {/* Description */}
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
                    Upload a document to create your knowledge
                    space. Once uploaded, you can ask questions
                    about its contents.
                  </p>

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? "Uploading..."
                      : "Choose Document"}
                  </button>

                  {/* Supported formats */}
                  <p className="mt-5 text-xs text-gray-500">
                    Supported formats: PDF, DOCX, TXT, MD
                  </p>

                </div>

              </div>

            </div>
          ) : (

            /* ====================================== */
            /* DOCUMENTS EXIST → SHOW CHAT */
            /* ====================================== */

            <>
              {/* ------------------------------------ */}
              {/* Documents Section */}
              {/* ------------------------------------ */}

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h2 className="font-semibold text-white">
                      Documents in this chat
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Documents available to your knowledge assistant
                    </p>
                  </div>

                  {/* Upload another document */}
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? "Uploading..."
                      : "+ Upload"}
                  </button>

                </div>

                {/* Document list */}
                <div className="space-y-2">

                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3"
                    >

                      {/* File icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                        📄
                      </div>

                      {/* File information */}
                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium text-white">
                          {document.filename}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {document.chunks} chunks
                        </p>

                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteDocument(document.id)
                        }
                        disabled={
                          deletingDocumentId === document.id ||
                          uploading ||
                          sending
                        }
                        className="shrink-0 rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-400/30 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingDocumentId === document.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  ))}

                </div>
              </div>

              {/* ------------------------------------ */}
              {/* Messages */}
              {/* ------------------------------------ */}

              <div className="flex-1 space-y-4 overflow-y-auto py-6">

                {messages.length === 0 ? (

                  <div className="flex h-full items-center justify-center">

                    <div className="max-w-md text-center">

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
                        +
                      </div>

                      <h2 className="mt-6 text-2xl font-semibold">
                        Start your knowledge session
                      </h2>

                      <p className="mt-3 leading-6 text-gray-400">
                        Your document is ready. Ask a question
                        about its contents.
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

                        {/* Message content */}
                        <p className="whitespace-pre-wrap leading-6">
                          {message.content}
                        </p>

                        {/* Sources */}
                        {message.role === "assistant" &&
                          message.sources &&
                          message.sources.length > 0 && (

                            <div className="mt-4 border-t border-white/10 pt-3">

                              <p className="mb-2 text-xs font-semibold text-cyan-400">
                                Sources
                              </p>

                              <div className="space-y-2">

                                {message.sources.map(
                                  (source, index) => (

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
                                  )
                                )}

                              </div>

                            </div>
                          )}

                      </div>

                    </div>
                  ))
                )}

              </div>

              {/* ------------------------------------ */}
              {/* Chat Input */}
              {/* ------------------------------------ */}

              <div className="mt-6">
                {error && (
                  <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
                    <p className="text-sm text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex gap-3"
                >

                {/* Upload another document */}
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading || sending}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload"}
                </button>

                {/* Message input */}
                <input
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
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
                  {sending
                    ? "Thinking..."
                    : "Send"}
                </button>

                </form>
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  );
}