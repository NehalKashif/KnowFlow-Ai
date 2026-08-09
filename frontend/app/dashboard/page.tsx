"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#07111f] flex items-center justify-center">
        <p className="text-gray-400">
          Checking authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">
          Know<span className="text-cyan-400">Flow</span>
        </h1>

        <p className="mt-4 text-gray-400">
          You are authenticated.
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </main>
  );
}