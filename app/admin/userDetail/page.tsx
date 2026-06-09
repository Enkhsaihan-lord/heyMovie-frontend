"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription: string;
}

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/allUsersGet")
      .then((r) => r.json())
      .then((data: User[]) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#111113] font-sans text-[#c0c0c8]">
      <div className="max-w-[860px] mx-auto px-6 py-12 sm:px-4 sm:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">
              Хэрэглэгчид
            </h1>
            <p className="text-[13px] text-[#555] mt-0.5">
              Нийт {users.length} хэрэглэгч
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/adminHome")}
            className="px-4 py-2 rounded-lg border border-[#2a2a2e] text-[#777] text-[13px] hover:border-[#444] hover:text-white transition-all cursor-pointer bg-transparent"
          >
            ← Буцах
          </button>
        </div>

        <input
          className="w-full px-3.5 py-3 bg-[#0d0d0f] border border-[#2a2a2e] rounded-lg text-[13px] text-white outline-none mb-6 placeholder:text-[#333] transition-colors focus:border-[#444]"
          placeholder="Нэр эсвэл email хайх…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
          {loading ? (
            <div className="text-center py-10 text-[12px] text-[#333]">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-[12px] text-[#333]">
              Хэрэглэгч олдсонгүй
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Нэр", "Email", "Эрх", "Захиалга"].map((h) => (
                    <th
                      key={h}
                      className="text-[10px] uppercase tracking-wider text-[#444] px-4 py-3 text-left border-b border-[#1e1e22] bg-[#111113]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    onClick={() => {
                      localStorage.setItem("userEmail", u.email);
                      router.push("/user/userDetail");
                    }}
                    className="hover:bg-white/[0.02] [&:last-child_td]:border-b-0 cursor-pointer"
                  >
                    <td className="text-[12px] text-[#555] px-4 py-3 border-b border-[#1a1a1e]">
                      {i + 1}
                    </td>
                    <td className="text-[12px] text-[#ccc] px-4 py-3 border-b border-[#1a1a1e]">
                      {u.name}
                    </td>
                    <td className="text-[12px] text-[#888] px-4 py-3 border-b border-[#1a1a1e]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 border-b border-[#1a1a1e]">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
                          u.role === "SUPERADMIN"
                            ? "bg-purple-950 text-purple-400 border border-purple-900"
                            : u.role === "ADMIN"
                              ? "bg-blue-950 text-blue-400 border border-blue-900"
                              : "bg-[#1a1a1e] text-[#555] border border-[#2a2a2e]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-[#1a1a1e]">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
                          u.subscription === "PREMIUM"
                            ? "bg-yellow-950 text-yellow-400 border border-yellow-900"
                            : "bg-[#1a1a1e] text-[#555] border border-[#2a2a2e]"
                        }`}
                      >
                        {u.subscription}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
