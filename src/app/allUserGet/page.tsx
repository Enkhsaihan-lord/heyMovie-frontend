"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  subscription: string;
  clerkId: string | null;
}

const ROLE_FILTERS = ["Бүгд", "SUPERADMIN", "ADMIN", "NORMAL"];
const SUB_FILTERS = ["Бүгд", "PREMIUM", "NORMAL"];

const roleBadge: Record<string, string> = {
  SUPERADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
  ADMIN: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  NORMAL: "bg-zinc-700/50 text-zinc-400 border-zinc-700",
};

const subBadge: Record<string, string> = {
  PREMIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  NORMAL: "bg-zinc-700/50 text-zinc-400 border-zinc-700",
};

export default function AllUserGetPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Бүгд");
  const [subFilter, setSubFilter] = useState("Бүгд");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/allUsersGet`,
        );
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Хэрэглэгч татахад алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Бүгд" || u.role === roleFilter;
    const matchSub = subFilter === "Бүгд" || u.subscription === subFilter;
    return matchSearch && matchRole && matchSub;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Хэрэглэгчид</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Нийт {users.length} хэрэглэгч
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Нэр эсвэл имэйлээр хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Эрх:</span>
            <div className="flex gap-1">
              {ROLE_FILTERS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    roleFilter === r
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Захиалга:</span>
            <div className="flex gap-1">
              {SUB_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubFilter(s)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    subFilter === s
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            <span className="text-sm">Ачааллаж байна...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            <span className="text-sm">Хэрэглэгч олдсонгүй</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Нэр
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Имэйл
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Эрх
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Захиалга
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="bg-zinc-900/20 transition-colors hover:bg-zinc-800/40"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${roleBadge[user.role] ?? "bg-zinc-800 text-zinc-400"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${subBadge[user.subscription] ?? "bg-zinc-800 text-zinc-400"}`}
                    >
                      {user.subscription}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
