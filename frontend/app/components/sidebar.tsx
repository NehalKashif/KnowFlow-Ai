"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { createChat } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };
  const handleNewChat = async () => {
    try {
        const chat = await createChat("New Chat");

        router.push(`/chat/${chat.id}`);
    } catch (error) {
        console.error("Failed to create chat:", error);
    }
  };
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "⌂",
    },
    {
      name: "History",
      href: "/history",
      icon: "◷",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: "▤",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#081421]">

      {/* Brand */}
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link
          href="/dashboard"
          className="text-2xl font-bold tracking-tight text-white"
        >
          Know<span className="text-cyan-400">Flow</span>
        </Link>
      </div>

      {/* New Chat */}
      <div className="px-4 pt-5">
        <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
            <span className="text-lg">+</span>
            New Chat
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>

                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">

        <Link
          href="/profile"
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
            U
          </div>

          <div className="flex-1">
            <p className="text-sm text-white">
              Profile
            </p>

            <p className="text-xs text-gray-500">
              Account settings
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="w-5 text-center">
            ↪
          </span>

          Logout
        </button>

      </div>
    </aside>
  );
}