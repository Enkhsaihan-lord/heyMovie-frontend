"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  name: string;
  image: string;
  subscription: string;
}
interface Series {
  id: string;
  name: string;
  image: string;
  subscription: string;
}

const ContentCard = ({
  id,
  name,
  image,
  subscription,
  endpoint,
  onUpdate,
  onDelete,
  kind,
}: {
  id: string;
  name: string;
  image: string;
  subscription: string;
  endpoint: string;
  onUpdate: (id: string, sub: string) => void;
  onDelete?: (id: string) => void;
  kind: "movie" | "series";
}) => {
  const [sub, setSub] = useState<"PREMIUM" | "NORMAL">(
    subscription as "PREMIUM" | "NORMAL",
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    if (saving || sub === subscription) return;
    setSaving(true);
    setSuccess(false);
    setErr("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, subscription: sub }),
      });
      if (!res.ok) throw new Error();
      onUpdate(id, sub);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setErr("Алдаа");
      setTimeout(() => setErr(""), 2500);
    } finally {
      setSaving(false);
    }
  };

  const changed = sub !== subscription;

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      onDelete?.(id);
    } catch {
      setErr("Алдаа");
      setTimeout(() => setErr(""), 2500);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className={`bg-[rgba(8,12,22,0.98)] border border-[rgba(30,58,100,0.45)] rounded-[4px] relative overflow-hidden transition-all duration-200 hover:border-[rgba(30,58,100,0.7)] hover:shadow-[0_0_32px_rgba(220,38,38,0.05)]${kind === "series" ? " border-l-2 border-l-[rgba(168,85,247,0.45)]" : " border-l-2 border-l-[rgba(220,38,38,0.45)]"}`}
      style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
    >
      <div className="absolute top-0 right-0 w-[14px] h-[14px] border-l border-b border-[rgba(249,115,22,0.3)] z-[2]" />
      <div className="absolute bottom-0 left-0 w-[14px] h-[14px] border-r border-t border-[rgba(71,85,105,0.35)] z-[2]" />

      <div className="relative w-full aspect-[2/3]">
        <img className="w-full h-full object-cover block bg-[#0a0f1c]" src={image} alt={name} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(8,12,22,0.95) 0%, rgba(8,12,22,0.2) 50%, transparent 100%)" }}
        />
        <div
          className={`absolute top-2 left-2 z-[2] font-mono text-[8px] tracking-[0.12em] uppercase px-[7px] py-[2px] rounded-[2px] border${kind === "series" ? " border-[rgba(168,85,247,0.4)] bg-[rgba(8,12,22,0.85)] text-[#c084fc]" : " border-[rgba(71,100,140,0.5)] bg-[rgba(8,12,22,0.85)] text-[#4a7aaa]"}`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {kind}
        </div>
        {kind === "movie" && (
          <button
            className={`absolute top-2 right-2 z-[3] w-[26px] h-[26px] rounded-[3px] border flex items-center justify-center text-[13px] transition-all duration-150 cursor-pointer ${
              confirmDelete
                ? "border-[rgba(220,38,38,0.9)] bg-[rgba(220,38,38,0.5)] text-white"
                : "border-[rgba(220,38,38,0.5)] bg-[rgba(8,12,22,0.75)] text-[#f87171] hover:bg-[rgba(220,38,38,0.3)]"
            }`}
            onClick={handleDelete}
            disabled={deleting}
            title={confirmDelete ? "Дахин дарж устга" : "Устгах"}
          >
            {deleting ? "…" : confirmDelete ? "!" : "🗑"}
          </button>
        )}
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <div
          className="font-bold text-[14px] text-[#dde8f5] mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {name}
        </div>
        <span
          className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-[2px] rounded-[2px] mb-3 border${subscription === "PREMIUM" ? " border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.06)] text-[#f97316]" : " border-[rgba(71,85,105,0.3)] bg-[rgba(71,85,105,0.06)] text-[#475569]"}`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {subscription}
        </span>
        <div className="flex gap-1.5">
          <select
            className="flex-1 bg-[rgba(6,10,18,0.95)] border border-[rgba(30,58,100,0.45)] rounded-[3px] px-2.5 py-[7px] text-[11px] text-[#dde8f5] outline-none cursor-pointer transition-colors duration-[180ms] focus:border-[rgba(220,38,38,0.4)]"
            style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.06em" }}
            value={sub}
            onChange={(e) => {
              setSub(e.target.value as "PREMIUM" | "NORMAL");
              setSuccess(false);
            }}
          >
            <option value="PREMIUM" style={{ background: "#0a0f1c" }}>PREMIUM</option>
            <option value="NORMAL" style={{ background: "#0a0f1c" }}>NORMAL</option>
          </select>
          <button
            className={`w-[38px] h-[34px] border rounded-[3px] font-mono text-[12px] flex-shrink-0 transition-all duration-[180ms]${
              err
                ? " border-[rgba(239,68,68,0.4)] text-[#f87171] cursor-default bg-transparent"
                : success
                ? " border-[rgba(249,115,22,0.4)] bg-[rgba(249,115,22,0.07)] text-[#fb923c] cursor-default"
                : changed
                ? " border-[rgba(220,38,38,0.5)] bg-[rgba(220,38,38,0.08)] text-[#f87171] cursor-pointer hover:bg-[rgba(220,38,38,0.15)] hover:border-[rgba(220,38,38,0.7)] hover:shadow-[0_0_12px_rgba(220,38,38,0.15)]"
                : " border-[rgba(71,85,105,0.35)] bg-transparent text-[#3a5a7a] cursor-not-allowed"
            }`}
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
            onClick={save}
            disabled={saving || !changed}
          >
            {saving ? "…" : success ? "✓" : err ? "✕" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "MOVIE" | "SERIES">(
    "ALL",
  );
  const [subFilter, setSubFilter] = useState<"ALL" | "PREMIUM" | "NORMAL">(
    "ALL",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/allMovies`).then(
        (r) => r.json(),
      ),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series`).then((r) =>
        r.json(),
      ),
    ])
      .then(([movieData, seriesData]: [Movie[], Series[]]) => {
        setMovies(movieData);
        setSeries(seriesData);
      })
      .catch(() => setError("Татахад алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, []);

  const updateMovie = (id: string, sub: string) =>
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, subscription: sub } : m)),
    );
  const updateSeries = (id: string, sub: string) =>
    setSeries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, subscription: sub } : s)),
    );
  const deleteMovie = (id: string) =>
    setMovies((prev) => prev.filter((m) => m.id !== id));

  type Item = {
    id: string;
    name: string;
    image: string;
    subscription: string;
    kind: "movie" | "series";
  };

  const combined: Item[] = [
    ...(typeFilter !== "SERIES"
      ? movies.map((m) => ({ ...m, kind: "movie" as const }))
      : []),
    ...(typeFilter !== "MOVIE"
      ? series.map((s) => ({ ...s, kind: "series" as const }))
      : []),
  ].filter((item) => {
    if (subFilter !== "ALL" && item.subscription !== subFilter) return false;
    if (search.trim())
      return item.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const typeFilterClass = (f: string) => {
    if (typeFilter === f) {
      if (f === "ALL" || f === "MOVIE") return " border-[rgba(71,100,140,0.6)] bg-[rgba(71,100,140,0.1)] text-[#7aabcc]";
      if (f === "SERIES") return " border-[rgba(168,85,247,0.5)] bg-[rgba(168,85,247,0.08)] text-[#c084fc]";
    }
    return "";
  };
  const subFilterClass = (f: string) => {
    if (subFilter === f) {
      if (f === "ALL") return " border-[rgba(71,100,140,0.6)] bg-[rgba(71,100,140,0.1)] text-[#7aabcc]";
      if (f === "PREMIUM") return " border-[rgba(249,115,22,0.5)] bg-[rgba(249,115,22,0.08)] text-[#f97316]";
      if (f === "NORMAL") return " border-[rgba(71,85,105,0.6)] bg-[rgba(71,85,105,0.1)] text-[#94a3b8]";
    }
    return "";
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

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-12 sm:px-3.5 sm:py-7">
        <div className="flex items-center justify-between mb-10">
          <div
            className="flex flex-col gap-0.5 text-[13px] text-[#dc2626] tracking-[0.18em] uppercase"
            style={{ fontFamily: "'Share Tech Mono', monospace", textShadow: "0 0 14px rgba(220,38,38,0.55)" }}
          >
            ◈ PPDC COMMAND
            <span className="text-[10px] text-[rgba(100,130,170,0.5)] tracking-[0.22em]">CONTENT CLEARANCE</span>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-transparent border border-[rgba(71,85,105,0.5)] rounded-[4px] px-4 py-2 text-[rgba(148,163,184,0.7)] text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-[180ms] hover:border-[rgba(220,38,38,0.5)] hover:text-[#f87171] hover:bg-[rgba(220,38,38,0.05)]"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
            onClick={() => router.push("/admin/adminHome")}
          >
            ← RETURN
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap sm:flex-col sm:items-start">
          <div>
            <h2
              className="text-[24px] font-extrabold text-[#dde8f5] tracking-[-0.02em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              CONTENT{" "}
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
                {combined.length} TITLES FOUND
              </div>
            )}
          </div>
          <div className="relative flex-1 min-w-[200px] max-w-[300px] sm:max-w-full sm:w-full">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[14px] text-[rgba(71,100,140,0.5)] pointer-events-none">⌕</span>
            <input
              className="w-full pl-10 pr-4 py-[11px] bg-[rgba(10,15,28,0.95)] border border-[rgba(30,58,100,0.6)] rounded-[4px] text-[13px] text-[#dde8f5] outline-none transition-all duration-200 placeholder:text-[#1e3352] focus:border-[rgba(220,38,38,0.45)] focus:shadow-[0_0_0_2px_rgba(220,38,38,0.07)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              placeholder="SCAN TITLE…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <div className="flex gap-[5px]">
            {(["ALL", "MOVIE", "SERIES"] as const).map((f) => (
              <button
                key={f}
                className={`font-mono text-[10px] tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-[3px] cursor-pointer border border-[rgba(71,85,105,0.4)] bg-transparent text-[#3a5a7a] transition-all duration-[150ms] hover:border-[rgba(220,38,38,0.4)] hover:text-[#f87171]${typeFilterClass(f)}`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
                onClick={() => setTypeFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="w-px self-stretch bg-[rgba(30,58,100,0.4)]" />
          <div className="flex gap-[5px]">
            {(["ALL", "PREMIUM", "NORMAL"] as const).map((f) => (
              <button
                key={f}
                className={`font-mono text-[10px] tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-[3px] cursor-pointer border border-[rgba(71,85,105,0.4)] bg-transparent text-[#3a5a7a] transition-all duration-[150ms] hover:border-[rgba(220,38,38,0.4)] hover:text-[#f87171]${subFilterClass(f)}`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
                onClick={() => setSubFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
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
        {!loading && !error && combined.length === 0 && (
          <div className="text-center py-[60px] font-mono text-[11px] text-[#1a2a3a] tracking-[0.12em] uppercase" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            NO TITLES FOUND
          </div>
        )}
        {!loading && !error && combined.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 sm:grid-cols-3 sm:gap-2.5">
            {combined.map((item) => (
              <ContentCard
                key={`${item.kind}-${item.id}`}
                id={item.id}
                name={item.name}
                image={item.image}
                subscription={item.subscription}
                kind={item.kind}
                endpoint={
                  item.kind === "movie"
                    ? "/api/admin/movieSub"
                    : "/api/admin/seriesSub"
                }
                onUpdate={item.kind === "movie" ? updateMovie : updateSeries}
                onDelete={item.kind === "movie" ? deleteMovie : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
