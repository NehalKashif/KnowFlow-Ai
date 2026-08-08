const stats = [
  {
    label: "Documents",
    value: "0",
    icon: "▣",
    description: "Uploaded documents",
  },
  {
    label: "Conversations",
    value: "0",
    icon: "◌",
    description: "Active chat sessions",
  },
  {
    label: "Messages",
    value: "0",
    icon: "✦",
    description: "Questions answered",
  },
];

const recentDocuments = [
  {
    name: "No documents yet",
    chat: "Upload a document to get started",
    date: "",
    icon: "📄",
  },
];

const recentChats = [
  {
    title: "No conversations yet",
    preview: "Your conversations will appear here.",
    date: "",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080b16] text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.07] bg-[#0d1120] lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-[76px] items-center px-6">
            <div className="relative mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
              <span className="text-lg font-bold text-white">K</span>

              <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" />
            </div>

            <div>
              <h1 className="text-[16px] font-semibold tracking-tight">
                KnowFlow
              </h1>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                AI Workspace
              </p>
            </div>
          </div>

          {/* New Chat */}
          <div className="px-4 pt-3">
            <button className="group flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:scale-[1.01] hover:shadow-indigo-500/20">
              <span className="text-lg">+</span>
              <span>New Chat</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-7 px-3">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Workspace
            </p>

            <div className="space-y-1">
              <NavItem icon="⌂" label="Dashboard" active />
              <NavItem icon="◌" label="History" />
              <NavItem icon="▣" label="Documents" />
            </div>
          </nav>

          {/* Bottom */}
          <div className="mt-auto border-t border-white/[0.07] p-3">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.04]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-sm font-semibold text-white">
                N
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">
                  Nehal
                </p>
                <p className="text-xs text-slate-500">Personal workspace</p>
              </div>

              <span className="text-slate-600">•••</span>
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-sm font-bold">
                K
              </div>

              <span className="font-semibold">KnowFlow</span>
            </div>

            {/* Search */}
            <div className="relative hidden w-full max-w-md md:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search your knowledge..."
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-indigo-500/40 focus:bg-white/[0.04]"
              />
            </div>

            {/* Right */}
            <div className="ml-auto flex items-center gap-3">
              <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200 sm:flex">
                ?
              </button>

              <div className="h-8 w-px bg-white/[0.07]" />

              <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.04]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-sm font-semibold">
                  N
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-slate-200">Nehal</p>
                  <p className="text-[10px] text-slate-500">Personal</p>
                </div>

                <span className="hidden text-xs text-slate-600 sm:block">
                  ▾
                </span>
              </button>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
              {/* Greeting */}
              <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.13] via-violet-500/[0.06] to-cyan-500/[0.04] p-7 sm:p-9">
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-cyan-400/[0.07] blur-3xl" />

                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-400/[0.07] px-3 py-1.5 text-xs text-indigo-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                    Your knowledge workspace
                  </div>

                  <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Hello, Nehal{" "}
                    <span className="inline-block animate-pulse">👋</span>
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                    What would you like to explore today? Upload a document
                    and turn your files into an interactive conversation.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                      <span className="text-lg">+</span>
                      New Chat
                    </button>

                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.07]">
                      <span>↑</span>
                      Upload Document
                    </button>
                  </div>
                </div>
              </section>

              {/* Statistics */}
              <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    description={stat.description}
                  />
                ))}
              </section>

              {/* Continue */}
              <section className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Continue where you left off
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Jump back into your latest conversation.
                    </p>
                  </div>
                </div>

                <div className="group rounded-2xl border border-white/[0.07] bg-[#11172a] p-5 transition hover:border-indigo-500/20 hover:bg-[#151d34]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
                      ◌
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-slate-300">
                        No recent conversation
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Upload a document and your latest conversation will
                        appear here.
                      </p>
                    </div>

                    <button className="rounded-xl border border-white/[0.07] px-4 py-2.5 text-xs font-medium text-slate-400 transition group-hover:border-indigo-500/20 group-hover:text-indigo-300">
                      Start exploring →
                    </button>
                  </div>
                </div>
              </section>

              {/* Documents + Chats */}
              <section className="mt-8 grid gap-6 xl:grid-cols-2">
                {/* Documents */}
                <div>
                  <SectionHeader title="Recent Documents" action="View all" />

                  <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11172a]">
                    {recentDocuments.map((document) => (
                      <DocumentRow
                        key={document.name}
                        name={document.name}
                        chat={document.chat}
                        date={document.date}
                        icon={document.icon}
                      />
                    ))}
                  </div>
                </div>

                {/* Chats */}
                <div>
                  <SectionHeader title="Recent Conversations" action="View all" />

                  <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11172a]">
                    {recentChats.map((chat) => (
                      <ChatRow
                        key={chat.title}
                        title={chat.title}
                        preview={chat.preview}
                        date={chat.date}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Quick actions */}
              <section className="mt-8 pb-10">
                <h3 className="mb-4 text-base font-semibold text-white">
                  Quick Actions
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">
                  <QuickAction
                    icon="↑"
                    title="Upload Document"
                    description="Add a new source to your knowledge."
                  />

                  <QuickAction
                    icon="◌"
                    title="View History"
                    description="Return to an earlier conversation."
                  />

                  <QuickAction
                    icon="▣"
                    title="Browse Documents"
                    description="Manage all your uploaded files."
                  />
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable UI pieces                                                         */
/* -------------------------------------------------------------------------- */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-indigo-500/10 text-indigo-300"
          : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-300"
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center text-base">
        {icon}
      </span>

      <span>{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
      )}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#11172a] p-5 transition hover:-translate-y-0.5 hover:border-indigo-500/20 hover:bg-[#151d34]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-300">
          {icon}
        </div>

        <span className="text-xs text-slate-700">•••</span>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-300">{label}</p>

        <p className="mt-1 text-xs text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-base font-semibold text-white">{title}</h3>

      <button className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300">
        {action} →
      </button>
    </div>
  );
}

function DocumentRow({
  name,
  chat,
  date,
  icon,
}: {
  name: string;
  chat: string;
  date: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.05] p-5 last:border-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-lg">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-300">{name}</p>

        <p className="mt-1 truncate text-xs text-slate-600">{chat}</p>
      </div>

      {date && <span className="text-xs text-slate-600">{date}</span>}
    </div>
  );
}

function ChatRow({
  title,
  preview,
  date,
}: {
  title: string;
  preview: string;
  date: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.05] p-5 last:border-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-lg text-violet-300">
        ◌
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-300">{title}</p>

        <p className="mt-1 truncate text-xs text-slate-600">{preview}</p>
      </div>

      {date && <span className="text-xs text-slate-600">{date}</span>}
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-[#11172a] p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-500/20 hover:bg-[#151d34]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-indigo-300">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-300">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
      </div>
    </button>
  );
}