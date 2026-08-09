"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import { getCurrentUser } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load user:", error);

        removeToken();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <p className="text-gray-400">
          Loading your workspace...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      <Sidebar />

      <Topbar />

      <section className="ml-64 pt-20">

        <div className="mx-auto max-w-7xl px-8 py-10">

          {/* Welcome */}
          <div className="mb-10">

            <p className="mb-2 text-sm font-medium text-cyan-400">
              Personal Knowledge Workspace
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Hello, {user.name.split(" ")[0]} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              What would you like to explore today?
              Upload a document and start a conversation with your knowledge.
            </p>

          </div>

          {/* Statistics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Documents"
              value="0"
              description="Uploaded documents"
              icon="▤"
            />

            <StatCard
              title="Conversations"
              value="0"
              description="Chat sessions"
              icon="◷"
            />

            <StatCard
              title="Questions"
              value="0"
              description="Questions asked"
              icon="?"
            />

            <StatCard
              title="Knowledge Chunks"
              value="0"
              description="Indexed chunks"
              icon="◇"
            />

          </div>

          {/* Main area */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* Start section */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 lg:col-span-2">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-cyan-400">
                    Get started
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Build your knowledge space
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                    Upload your first document to create a searchable
                    knowledge base and start asking questions about it.
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-400 sm:flex">
                  +
                </div>

              </div>

              <button className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400">
                Upload Document
              </button>

            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">

              <h2 className="text-lg font-semibold">
                Recent Activity
              </h2>

              <div className="mt-6 flex min-h-40 items-center justify-center text-center">

                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-gray-500">
                    ◷
                  </div>

                  <p className="mt-4 text-sm text-gray-400">
                    No activity yet
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Your recent activity will appear here.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.06]">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
}