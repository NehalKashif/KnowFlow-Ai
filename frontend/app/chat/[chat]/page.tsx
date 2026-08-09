"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

export default function ChatPage() {
  const params = useParams();

  const chatId = params.chatId as string;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      <Sidebar />

      <Topbar />

      <section className="ml-64 pt-20">

        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-cyan-400">
              Knowledge Chat
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              New Chat
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Upload a document to begin your conversation.
            </p>
          </div>

          {/* Empty state */}
          <div className="flex flex-1 items-center justify-center">

            <div className="max-w-md text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
                +
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Start your knowledge session
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Upload a document and KnowFlow will create a
                searchable knowledge space for this conversation.
              </p>

              <button
                className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Upload Document
              </button>

              <p className="mt-4 text-xs text-gray-600">
                Chat ID: {chatId}
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}