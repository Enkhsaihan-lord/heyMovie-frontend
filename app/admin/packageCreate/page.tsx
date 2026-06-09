"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  name: string;
  movieNumber: string | null;
}

interface Series {
  id: string;
  name: string;
  seriesNumber: string;
}

const Page = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [packageName, setPackageName] = useState("");
  const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set());
  const [selectedSeries, setSelectedSeries] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/setMovies`).then((r) => r.json()),
    ])
      .then(([data]) => {
        setMovies(data.movies ?? []);
        setSeries(data.series ?? []);
      })
      .catch(() => setError("Өгөгдөл татахад алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, []);

  const toggleMovie = (id: string) =>
    setSelectedMovies((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSeries = (id: string) =>
    setSelectedSeries((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCreate = async () => {
    if (!packageName.trim()) { setError("Багцын нэр оруулна уу"); return; }
    if (selectedMovies.size === 0 && selectedSeries.size === 0) { setError("Кино эсвэл цуврал сонгоно уу"); return; }

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/setMovies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movies: movies
            .filter((m) => selectedMovies.has(m.id))
            .map((m) => ({ id: m.id, movieNumber: packageName.trim() })),
          series: series
            .filter((s) => selectedSeries.has(s.id))
            .map((s) => ({ id: s.id, seriesNumber: packageName.trim() })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setSelectedMovies(new Set());
      setSelectedSeries(new Set());
      setPackageName("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const rowClass = "flex items-center gap-3 px-4 py-3 border-b border-[#1e1e22] last:border-b-0 cursor-pointer hover:bg-white/[0.03] transition-colors";

  return (
    <div className="min-h-screen bg-[#111113] font-sans text-[#c0c0c8]">
      <div className="max-w-[720px] mx-auto px-6 py-12 sm:px-4 sm:py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">Багц үүсгэх</h1>
            <p className="text-[13px] text-[#555] mt-0.5">Кино, цуврал сонгоод нэр өгнө үү</p>
          </div>
          <button
            onClick={() => router.push("/admin/adminHome")}
            className="px-4 py-2 rounded-lg border border-[#2a2a2e] text-[#777] text-[13px] hover:border-[#444] hover:text-white transition-all cursor-pointer bg-transparent"
          >
            ← Буцах
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-[11px] uppercase tracking-widest text-[#555] mb-2">Багцын нэр</label>
          <input
            className="w-full bg-[#1F1F1E] border border-[#3a3a38] rounded-lg px-4 py-3 text-[14px] text-white outline-none focus:border-[#38bdf8] transition-colors"
            placeholder="Жишээ: Шинээр нэмэгдсэн"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-[#1a1a1e] border border-red-500/30 rounded-lg px-4 py-3 text-[13px] text-red-400 mb-5">
            ⚠ {error}
          </div>
        )}
        {success && (
          <div className="bg-[#1a1a1e] border border-[#81B29A]/30 rounded-lg px-4 py-3 text-[13px] text-[#81B29A] mb-5">
            ✓ Амжилттай үүсгэлээ
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[12px] text-[#333]">Уншиж байна…</div>
        ) : (
          <>
            {movies.length > 0 && (
              <div className="mb-6">
                <p className="text-[11px] uppercase tracking-widest text-[#333] mb-3">
                  Кинонууд · {selectedMovies.size} сонгосон
                </p>
                <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
                  {movies.map((m) => (
                    <div key={m.id} className={rowClass} onClick={() => toggleMovie(m.id)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedMovies.has(m.id) ? "bg-[#38bdf8] border-[#38bdf8]" : "border-[#3a3a38] bg-transparent"}`}>
                        {selectedMovies.has(m.id) && <span className="text-black text-[11px] font-bold">✓</span>}
                      </div>
                      <span className="text-[13px] text-[#ccc] flex-1">{m.name}</span>
                      {m.movieNumber && (
                        <span className="text-[11px] text-[#555] font-mono">{m.movieNumber}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {series.length > 0 && (
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-widest text-[#333] mb-3">
                  Цувралууд · {selectedSeries.size} сонгосон
                </p>
                <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
                  {series.map((s) => (
                    <div key={s.id} className={rowClass} onClick={() => toggleSeries(s.id)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedSeries.has(s.id) ? "bg-[#38bdf8] border-[#38bdf8]" : "border-[#3a3a38] bg-transparent"}`}>
                        {selectedSeries.has(s.id) && <span className="text-black text-[11px] font-bold">✓</span>}
                      </div>
                      <span className="text-[13px] text-[#ccc] flex-1">{s.name}</span>
                      {s.seriesNumber && (
                        <span className="text-[11px] text-[#555] font-mono">{s.seriesNumber}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="w-full py-3.5 rounded-lg border-none text-[#1F1F1E] text-[14px] font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 active:enabled:scale-[0.98]"
              style={{ background: "#38bdf8" }}
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? "Үүсгэж байна…" : "Багц үүсгэх →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
