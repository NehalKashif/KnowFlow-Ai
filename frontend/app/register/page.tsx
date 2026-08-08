"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Backend registration will be connected later.
    console.log("Registration submitted");
  };

  return (
    <main className="min-h-screen bg-[#080b16] text-slate-100">
      <div className="flex min-h-screen">
        {/* Left visual section */}
        <section className="relative hidden w-1/2 overflow-hidden lg:flex">
          {/* Background glow */}
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-lg font-bold shadow-lg shadow-indigo-500/20">
                K

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" />
              </div>

              <div>
                <p className="font-semibold tracking-tight">KnowFlow</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  AI Workspace
                </p>
              </div>
            </Link>

            {/* Main message */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-400/[0.07] px-3 py-1.5 text-xs text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Your knowledge, organized.
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
                Turn your documents
                <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  into conversations.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Upload your documents, ask questions, explore your knowledge,
                and get answers grounded in your own files.
              </p>

              {/* Feature highlights */}
              <div className="mt-10 space-y-4">
                <Feature
                  icon="▣"
                  title="Your documents"
                  description="Keep your important knowledge in one workspace."
                />

                <Feature
                  icon="✦"
                  title="Intelligent answers"
                  description="Ask questions and get answers from your uploaded files."
                />

                <Feature
                  icon="◌"
                  title="Persistent conversations"
                  description="Return to your previous chats whenever you need them."
                />
              </div>
            </div>

            <p className="text-xs text-slate-600">
              © 2026 KnowFlow AI · Personal knowledge workspace
            </p>
          </div>
        </section>

        {/* Register section */}
        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 font-bold">
                K
              </div>

              <div>
                <p className="font-semibold">KnowFlow</p>
                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  AI Workspace
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-indigo-400">
                Get started
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start building your personal knowledge workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nehal Kashif"
                  required
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-600 transition hover:text-slate-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    required
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-600 transition hover:text-slate-300"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-white/10 bg-white/[0.03] accent-indigo-500"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-slate-500"
                >
                  I understand that KnowFlow will use my account to securely
                  manage my documents and conversations.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/20"
              >
                Create Account
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-700">
              <span>⌁</span>
              Your workspace is private and protected.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-sm text-indigo-300">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-300">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}