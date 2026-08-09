"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";

interface User {
  name: string;
  email: string;
}

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#07111f]/90 px-8 backdrop-blur-xl">

      {/* Search */}
      <div className="flex w-full max-w-xl items-center">

        <div className="relative w-full">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search your chats, documents, and knowledge..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/50 focus:bg-white/[0.07]"
          />

        </div>

      </div>

      {/* User */}
      <div className="ml-6 flex items-center gap-3">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">
            {firstName}
          </p>

          <p className="text-xs text-gray-500">
            Personal workspace
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-semibold text-black">
          {firstName.charAt(0).toUpperCase()}
        </div>

      </div>

    </header>
  );
}