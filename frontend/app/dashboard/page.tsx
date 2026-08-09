"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] flex items-center justify-center">
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
    <main className="min-h-screen bg-[#07111f] flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-4xl font-bold text-white">
          Know<span className="text-cyan-400">Flow</span>
        </h1>

        <h2 className="mt-8 text-3xl font-semibold text-white">
          Hello, {user.name} 👋
        </h2>

        <p className="mt-3 text-gray-400">
          What would you like to explore today?
        </p>

        <p className="mt-6 text-sm text-gray-500">
          {user.email}
        </p>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400"
        >
          Logout
        </button>

      </div>
    </main>
  );
}