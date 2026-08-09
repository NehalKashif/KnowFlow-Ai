"use client";

export default function DashboardPage() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  return (
    <main className="min-h-screen bg-[#07111f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">
          Know<span className="text-cyan-400">Flow</span>
        </h1>

        <p className="mt-4 text-gray-400">
          Dashboard
        </p>

        <p className="mt-2 text-sm text-green-400">
          {token
            ? "You are authenticated."
            : "No authentication token found."}
        </p>
      </div>
    </main>
  );
}