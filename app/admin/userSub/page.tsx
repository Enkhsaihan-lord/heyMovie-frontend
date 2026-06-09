"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription: string;
  subscriptionExpiresAt: string | null;
}

type Duration = "1month" | "3month" | "1year";

const DURATIONS: { value: Duration; label: string }[] = [
  { value: "1month", label: "1 сар" },
  { value: "3month", label: "3 сар" },
  { value: "1year", label: "1 жил" },
];

const UserCard = ({
  user,
  onUpdate,
  onRoleUpdate,
  onDelete,
}: {
  user: User;
  onUpdate: (id: number, sub: string, expiresAt: string | null) => void;
  onRoleUpdate: (id: number, role: string) => void;
  onDelete: (id: number) => void;
}) => {
  const router = useRouter();
  const [duration, setDuration] = useState<Duration>("1month");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [canceling, setCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [role, setRole] = useState<"USER" | "ADMIN" | "SUPERADMIN">(user.role as "USER" | "ADMIN" | "SUPERADMIN");
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleSuccess, setRoleSuccess] = useState(false);
  const [roleError, setRoleError] = useState("");

  const cancelSub = async () => {
    if (canceling) return;
    setCanceling(true);
    setCancelSuccess(false);
    setCancelError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/userSubNormal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (!res.ok) throw new Error();
      onUpdate(user.id, "NORMAL", null);
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 2500);
    } catch {
      setCancelError("Алдаа гарлаа");
      setTimeout(() => setCancelError(""), 2500);
    } finally {
      setCanceling(false);
    }
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/userSub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      onUpdate(user.id, "PREMIUM", data.subscriptionExpiresAt);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError("Алдаа гарлаа");
      setTimeout(() => setError(""), 2500);
    } finally {
      setSaving(false);
    }
  };

  const saveRole = async () => {
    if (roleSaving || role === user.role) return;
    const requesterEmail = localStorage.getItem("userEmail");
    if (!requesterEmail) return;
    setRoleSaving(true);
    setRoleSuccess(false);
    setRoleError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/userRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail, email: user.email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRoleError(data.error || "Алдаа гарлаа");
        setTimeout(() => setRoleError(""), 3500);
        return;
      }
      onRoleUpdate(user.id, role);
      setRoleSuccess(true);
      setTimeout(() => setRoleSuccess(false), 2500);
    } catch {
      setRoleError("Алдаа гарлаа");
      setTimeout(() => setRoleError(""), 2500);
    } finally {
      setRoleSaving(false);
    }
  };

  const roleChanged = role !== user.role;

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    const requesterEmail = localStorage.getItem("userEmail");
    if (!requesterEmail) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteUser`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail, email: user.email }),
      });
      if (!res.ok) throw new Error();
      onDelete(user.id);
    } catch {
      setDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="bg-[rgba(8,12,22,0.98)] border border-[rgba(30,58,100,0.45)] border-l-2 border-l-[rgba(220,38,38,0.45)] rounded-[4px] p-5 relative transition-all duration-200 hover:border-[rgba(30,58,100,0.7)] hover:shadow-[0_0_32px_rgba(220,38,38,0.05)]"
      style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
    >
      <div className="absolute top-0 right-0 w-4 h-4 border-l border-b border-[rgba(249,115,22,0.3)]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-r border-t border-[rgba(71,85,105,0.35)]" />

      <div className="flex gap-3.5 mb-4">
        <div
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-[rgba(220,38,38,0.07)] border border-[rgba(220,38,38,0.28)] text-[#dc2626] font-extrabold text-lg"
          style={{
            fontFamily: "'Syne', sans-serif",
            clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
            textShadow: "0 0 10px rgba(220,38,38,0.45)",
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-[15px] text-[#dde8f5] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {user.name}
          </div>
          <div
            className="text-[10px] text-[#1e3a52] mb-2 whitespace-nowrap overflow-hidden text-ellipsis tracking-[0.03em]"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {user.email}
          </div>
          <div className="flex gap-[5px] flex-wrap">
            <span
              className="font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-[2px] rounded-[2px] border border-[rgba(30,58,100,0.5)] bg-[rgba(30,58,100,0.1)] text-[#3a5a7a]"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {user.role}
            </span>
            <span
              className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-[2px] rounded-[2px] border${user.subscription === "PREMIUM" ? " border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.06)] text-[#f97316]" : " border-[rgba(71,85,105,0.3)] bg-[rgba(71,85,105,0.06)] text-[#475569]"}`}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {user.subscription}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mb-1">
        {DURATIONS.map((d) => (
          <button
            key={d.value}
            className={`flex-1 py-[7px] px-1 text-[11px] bg-transparent border rounded-[3px] cursor-pointer${duration === d.value ? " border-[#dc2626] bg-[#1a0000] text-[#f87171]" : " border-[#333] text-[#aaa]"}`}
            onClick={() => { setDuration(d.value); setSuccess(false); }}
          >
            {d.label}
          </button>
        ))}
        <button
          className={`w-[42px] h-[38px] border rounded-[3px] font-mono text-[13px] flex-shrink-0 transition-all duration-[180ms]${
            success
              ? " border-[rgba(249,115,22,0.4)] bg-[rgba(249,115,22,0.07)] text-[#fb923c] cursor-default"
              : " border-[rgba(220,38,38,0.5)] bg-[rgba(220,38,38,0.08)] text-[#f87171] cursor-pointer hover:bg-[rgba(220,38,38,0.15)] hover:border-[rgba(220,38,38,0.7)] hover:shadow-[0_0_12px_rgba(220,38,38,0.15)]"
          }`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
          onClick={save}
          disabled={saving}
        >
          {saving ? "…" : success ? "✓" : error ? "✕" : "OK"}
        </button>
      </div>

      {user.subscriptionExpiresAt && (
        <div className="text-[11px] text-[#f97316] mt-1 mb-1.5">
          ⏱ {new Date(user.subscriptionExpiresAt).toLocaleDateString("mn-MN")} хүртэл
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <select
          className="flex-1 bg-[rgba(6,10,18,0.95)] border border-[rgba(30,58,100,0.45)] rounded-[3px] px-3 py-2 text-[12px] text-[#dde8f5] outline-none cursor-pointer transition-colors duration-[180ms] focus:border-[rgba(220,38,38,0.4)]"
          style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.06em" }}
          value={role}
          onChange={(e) => { setRole(e.target.value as "USER" | "ADMIN" | "SUPERADMIN"); setRoleSuccess(false); setRoleError(""); }}
        >
          <option value="USER" style={{ background: "#0a0f1c" }}>USER</option>
          <option value="ADMIN" style={{ background: "#0a0f1c" }}>ADMIN</option>
          <option value="SUPERADMIN" style={{ background: "#0a0f1c" }}>SUPERADMIN</option>
        </select>
        <button
          className={`w-[42px] h-[38px] border rounded-[3px] font-mono text-[13px] flex-shrink-0 transition-all duration-[180ms]${
            roleError
              ? " border-[rgba(71,85,105,0.35)] bg-transparent text-[#3a5a7a] cursor-not-allowed"
              : roleSuccess
              ? " border-[rgba(249,115,22,0.4)] bg-[rgba(249,115,22,0.07)] text-[#fb923c] cursor-default"
              : roleChanged
              ? " border-[rgba(220,38,38,0.5)] bg-[rgba(220,38,38,0.08)] text-[#f87171] cursor-pointer hover:bg-[rgba(220,38,38,0.15)] hover:border-[rgba(220,38,38,0.7)] hover:shadow-[0_0_12px_rgba(220,38,38,0.15)]"
              : " border-[rgba(71,85,105,0.35)] bg-transparent text-[#3a5a7a] cursor-not-allowed"
          }`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
          onClick={saveRole}
          disabled={roleSaving || !roleChanged}
        >
          {roleSaving ? "…" : roleSuccess ? "✓" : roleError ? "✕" : "OK"}
        </button>
      </div>
      {roleError && (
        <div className="mt-1.5 text-[10px] text-[#f87171] tracking-[0.04em]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          ⚠ {roleError}
        </div>
      )}

      {user.subscription === "PREMIUM" && (
        <button
          className={`mt-2.5 w-full py-2 px-3 border rounded-[3px] font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-[180ms]${
            cancelSuccess
              ? " border-[rgba(71,85,105,0.4)] bg-[rgba(71,85,105,0.07)] text-[#94a3b8] cursor-default"
              : " border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.06)] text-[#f87171] hover:bg-[rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.6)] hover:shadow-[0_0_10px_rgba(220,38,38,0.1)]"
          }`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
          onClick={cancelSub}
          disabled={canceling}
        >
          {canceling ? "…" : cancelSuccess ? "✓ NORMAL болсон" : cancelError ? "✕ Алдаа" : "NORMAL болгох"}
        </button>
      )}

      <button
        className="mt-2.5 w-full py-2 px-3 bg-transparent border border-[rgba(30,58,100,0.5)] rounded-[3px] text-[#3a6a8a] font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-[180ms] hover:border-[rgba(6,182,212,0.45)] hover:text-[#22d3ee] hover:bg-[rgba(6,182,212,0.06)] hover:shadow-[0_0_10px_rgba(6,182,212,0.08)]"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
        onClick={() => {
          localStorage.setItem("userEmail", user.email);
          router.push("/user/userDetail");
        }}
      >
        Detail →
      </button>

      <button
        className={`mt-1.5 w-full py-2 px-3 border rounded-[3px] font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-[180ms] ${
          deleteConfirm
            ? "border-[rgba(220,38,38,0.7)] bg-[rgba(220,38,38,0.12)] text-[#f87171] hover:bg-[rgba(220,38,38,0.22)]"
            : "border-[rgba(220,38,38,0.25)] bg-transparent text-[#7a2a2a] hover:border-[rgba(220,38,38,0.5)] hover:text-[#f87171] hover:bg-[rgba(220,38,38,0.07)]"
        }`}
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
        onClick={handleDelete}
        disabled={deleting}
        onBlur={() => setDeleteConfirm(false)}
      >
        {deleting ? "…" : deleteConfirm ? "⚠ CONFIRM DELETE" : "DELETE USER"}
      </button>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PREMIUM" | "NORMAL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/allUsersGet`)
      .then((r) => r.json())
      .then((data: User[]) => setUsers(data))
      .catch(() => setError("Хэрэглэгчид татахад алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (id: number, sub: string, expiresAt: string | null) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, subscription: sub, subscriptionExpiresAt: expiresAt } : u)));
  };

  const handleRoleUpdate = (id: number, role: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const filtered = users.filter((u) => {
    if (filter !== "ALL" && u.subscription !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filterBtnClass = (f: string) => {
    const base = "font-mono text-[10px] tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-[3px] cursor-pointer border border-[rgba(71,85,105,0.4)] bg-transparent text-[#3a5a7a] transition-all duration-[150ms] hover:border-[rgba(220,38,38,0.4)] hover:text-[#f87171]";
    if (filter === f) {
      if (f === "ALL") return base + " !border-[rgba(71,100,140,0.6)] !bg-[rgba(71,100,140,0.1)] !text-[#7aabcc]";
      if (f === "PREMIUM") return base + " !border-[rgba(249,115,22,0.5)] !bg-[rgba(249,115,22,0.08)] !text-[#f97316]";
      if (f === "NORMAL") return base + " !border-[rgba(71,85,105,0.6)] !bg-[rgba(71,85,105,0.1)] !text-[#94a3b8]";
    }
    return base;
  };

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#b0bfd4] relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)" }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(30,58,100,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,100,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="fixed top-[-140px] left-1/2 -translate-x-1/2 w-[800px] h-[340px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(185,28,28,0.09) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-[-100px] right-[-80px] w-[450px] h-[450px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-6 py-12 sm:px-3.5 sm:py-7">
        <div className="flex items-center justify-between mb-10">
          <div
            className="flex flex-col gap-0.5 text-[13px] text-[#dc2626] tracking-[0.18em] uppercase"
            style={{ fontFamily: "'Share Tech Mono', monospace", textShadow: "0 0 14px rgba(220,38,38,0.55)" }}
          >
            ◈ PPDC COMMAND
            <span className="text-[10px] text-[rgba(100,130,170,0.5)] tracking-[0.22em]">JAEGER PILOT REGISTRY</span>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-transparent border border-[rgba(71,85,105,0.5)] rounded-[4px] px-4 py-2 text-[rgba(148,163,184,0.7)] text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-[180ms] hover:border-[rgba(220,38,38,0.5)] hover:text-[#f87171] hover:bg-[rgba(220,38,38,0.05)]"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
            onClick={() => router.push("/admin/adminHome")}
          >
            ← RETURN
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mb-7 flex-wrap sm:flex-col sm:items-start">
          <div>
            <h2
              className="text-[24px] font-extrabold text-[#dde8f5] tracking-[-0.02em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              PILOT{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, #dc2626, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                CLEARANCE
              </span>
            </h2>
            {!loading && (
              <div className="text-[11px] text-[rgba(100,130,170,0.5)] tracking-[0.12em]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {filtered.length} UNITS FOUND
              </div>
            )}
          </div>
          <div className="relative flex-1 min-w-[200px] max-w-[320px] sm:max-w-full sm:w-full">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[14px] text-[rgba(71,100,140,0.5)] pointer-events-none">⌕</span>
            <input
              className="w-full pl-10 pr-4 py-[11px] bg-[rgba(10,15,28,0.95)] border border-[rgba(30,58,100,0.6)] rounded-[4px] text-[13px] text-[#dde8f5] outline-none transition-all duration-200 placeholder:text-[#1e3352] focus:border-[rgba(220,38,38,0.45)] focus:shadow-[0_0_0_2px_rgba(220,38,38,0.07)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              placeholder="SCAN NAME / EMAIL…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-1.5 mb-5">
          {(["ALL", "PREMIUM", "NORMAL"] as const).map((f) => (
            <button
              key={f}
              className={filterBtnClass(f)}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center min-h-[60vh] font-mono text-[12px] text-[#1a2a3a] tracking-[0.1em]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            SCANNING DATABASE…
          </div>
        )}
        {!loading && error && (
          <div className="flex items-center justify-center min-h-[60vh] font-mono text-[12px] text-[#1a2a3a] tracking-[0.1em]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-[60px] font-mono text-[11px] text-[#1a2a3a] tracking-[0.12em] uppercase" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            NO PILOTS FOUND
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 sm:grid-cols-1">
            {filtered.map((u) => (
              <UserCard key={u.id} user={u} onUpdate={handleUpdate} onRoleUpdate={handleRoleUpdate} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
