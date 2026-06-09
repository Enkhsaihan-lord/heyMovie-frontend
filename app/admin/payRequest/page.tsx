"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SubPayment {
  id: number;
  email: string;
  duration: string;
  status: string;
  createdAt: string;
}

const durationLabel = (d: string) => {
  if (d === "1month") return "1сар";
  if (d === "3month") return "3сар";
  if (d === "1year") return "1жил";
  return d;
};

const Page = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<SubPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/movie/movieSubPay`)
      .then((r) => r.json())
      .then((data: SubPayment[]) => setPayments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: number) => {
    if (approvingId !== null) return;
    setApprovingId(id);
    try {
      const res = await fetch(`/api/movie/subPayApprove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p)));
    } catch {
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (deletingId !== null) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/movie/subPayDelete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const [search, setSearch] = useState("");
  const filtered = payments.filter((p) => p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#111113] font-sans text-[#c0c0c8]">
      <div className="max-w-[860px] mx-auto px-6 py-12 sm:px-4 sm:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">Pay Requests</h1>
            <p className="text-[13px] text-[#555] mt-0.5">
              {loading ? "Ачааллаж байна…" : `${payments.length} нийт хүсэлт`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="text-[11px] px-3 py-1 rounded-lg bg-yellow-950 text-yellow-400 border border-yellow-900">
                ⏳ {pendingCount} хүлээгдэж байна
              </span>
            )}
            <button
              onClick={() => router.push("/admin/adminHome")}
              className="px-4 py-2 rounded-lg border border-[#2a2a2e] text-[#777] text-[13px] hover:border-[#444] hover:text-white transition-all cursor-pointer bg-transparent"
            >
              ← Буцах
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444] text-[13px]">⌕</span>
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-[#0d0d0f] border border-[#2a2a2e] rounded-lg text-[13px] text-white outline-none placeholder:text-[#333] transition-colors focus:border-[#444]"
            placeholder="Email хайх…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] text-[13px] bg-transparent border-0 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
          {loading ? (
            <div className="text-center py-16 text-[12px] text-[#333]">Ачааллаж байна…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[12px] text-[#333]">{search ? `"${search}" — олдсонгүй` : "Хүсэлт олдсонгүй"}</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Email", "Төлөвлөгөө", "Статус", "Огноо", "Үйлдэл"].map((h) => (
                    <th key={h} className="text-[10px] uppercase tracking-wider text-[#444] px-4 py-3 text-left border-b border-[#1e1e22] bg-[#111113]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] [&:last-child_td]:border-b-0">
                    <td className="text-[12px] text-[#555] px-4 py-3 border-b border-[#1a1a1e]">{i + 1}</td>
                    <td className="text-[12px] text-[#ccc] px-4 py-3 border-b border-[#1a1a1e]">{p.email}</td>
                    <td className="text-[12px] text-[#ccc] px-4 py-3 border-b border-[#1a1a1e]">{durationLabel(p.duration)}</td>
                    <td className="px-4 py-3 border-b border-[#1a1a1e]">
                      <span className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${p.status === "APPROVED" ? "bg-green-950 text-green-400 border border-green-900" : "bg-yellow-950 text-yellow-400 border border-yellow-900"}`}>
                        {p.status === "APPROVED" ? "Зөвшөөрсөн" : "Хүлээгдэж байна"}
                      </span>
                    </td>
                    <td className="text-[11px] text-[#444] px-4 py-3 border-b border-[#1a1a1e]">
                      {new Date(p.createdAt).toLocaleDateString("mn-MN")}
                    </td>
                    <td className="px-4 py-3 border-b border-[#1a1a1e]">
                      <div className="flex items-center gap-2">
                        {p.status === "PENDING" && (
                          <button
                            onClick={() => handleApprove(p.id)}
                            disabled={approvingId === p.id}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white bg-green-800 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer border-0"
                          >
                            {approvingId === p.id ? "…" : "Зөвшөөрөх"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="px-3 py-1.5 rounded-lg text-[11px] text-[#666] hover:text-red-400 hover:bg-red-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-transparent border border-[#2a2a2e] hover:border-red-900"
                        >
                          {deletingId === p.id ? "…" : "Устгах"}
                        </button>
                      </div>
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
};

export default Page;
