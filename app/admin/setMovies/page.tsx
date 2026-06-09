"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MovieItem {
  id: string;
  name: string;
  movieNumber: string | null;
}

interface SeriesItem {
  id: string;
  name: string;
  seriesNumber: string;
}

interface Package {
  name: string;
  movies: MovieItem[];
  series: SeriesItem[];
}

const Page = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [packageName, setPackageName] = useState("");
  const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set());
  const [selectedSeries, setSelectedSeries] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingPkg, setEditingPkg] = useState<string | null>(null);
  const [editMovies, setEditMovies] = useState<Set<string>>(new Set());
  const [editSeries, setEditSeries] = useState<Set<string>>(new Set());
  const [editSearch, setEditSearch] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [deletingPkg, setDeletingPkg] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/setMovies`)
      .then((r) => r.json())
      .then((data) => {
        setMovies(data.movies ?? []);
        setSeries(data.series ?? []);
      })
      .catch(() => flash("Өгөгдөл татахад алдаа гарлаа", true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const packages: Package[] = (() => {
    const map = new Map<string, Package>();
    movies.forEach((m) => {
      if (!m.movieNumber) return;
      const pkg = map.get(m.movieNumber) ?? { name: m.movieNumber, movies: [], series: [] };
      pkg.movies.push(m);
      map.set(m.movieNumber, pkg);
    });
    series.forEach((s) => {
      if (!s.seriesNumber) return;
      const pkg = map.get(s.seriesNumber) ?? { name: s.seriesNumber, movies: [], series: [] };
      pkg.series.push(s);
      map.set(s.seriesNumber, pkg);
    });
    return [...map.values()];
  })();

  const flash = (msg: string, isErr = false) => {
    isErr ? setError(msg) : setSuccess(msg);
    setTimeout(() => isErr ? setError("") : setSuccess(""), 3000);
  };

  const post = async (body: object) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/setMovies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error();
  };

  const handleCreate = async () => {
    if (!packageName.trim()) { flash("Багцын нэр оруулна уу", true); return; }
    if (selectedMovies.size === 0 && selectedSeries.size === 0) { flash("Кино эсвэл цуврал сонгоно уу", true); return; }
    setSaving(true);
    try {
      await post({
        movies: movies.filter((m) => selectedMovies.has(m.id)).map((m) => ({ id: m.id, movieNumber: packageName.trim() })),
        series: series.filter((s) => selectedSeries.has(s.id)).map((s) => ({ id: s.id, seriesNumber: packageName.trim() })),
      });
      setSelectedMovies(new Set());
      setSelectedSeries(new Set());
      setPackageName("");
      flash("Багц үүслээ");
      fetchData();
    } catch { flash("Хадгалахад алдаа гарлаа", true); }
    finally { setSaving(false); }
  };

  const handleDelete = async (pkg: Package) => {
    setDeletingPkg(pkg.name);
    try {
      await post({
        movies: pkg.movies.map((m) => ({ id: m.id, movieNumber: "" })),
        series: pkg.series.map((s) => ({ id: s.id, seriesNumber: "" })),
      });
      flash(`"${pkg.name}" устлаа`);
      fetchData();
    } catch { flash("Устгахад алдаа гарлаа", true); }
    finally { setDeletingPkg(null); }
  };

  const openEdit = (pkg: Package) => {
    setEditingPkg(pkg.name);
    setEditMovies(new Set(pkg.movies.map((m) => m.id)));
    setEditSeries(new Set(pkg.series.map((s) => s.id)));
    setEditSearch("");
  };

  const handleEditSave = async (pkg: Package) => {
    setEditSaving(true);
    try {
      const addMovies = movies.filter((m) => editMovies.has(m.id) && m.movieNumber !== pkg.name);
      const addSeries = series.filter((s) => editSeries.has(s.id) && s.seriesNumber !== pkg.name);
      const removeMovies = pkg.movies.filter((m) => !editMovies.has(m.id));
      const removeSeries = pkg.series.filter((s) => !editSeries.has(s.id));

      await post({
        movies: [
          ...addMovies.map((m) => ({ id: m.id, movieNumber: pkg.name })),
          ...removeMovies.map((m) => ({ id: m.id, movieNumber: "" })),
        ],
        series: [
          ...addSeries.map((s) => ({ id: s.id, seriesNumber: pkg.name })),
          ...removeSeries.map((s) => ({ id: s.id, seriesNumber: "" })),
        ],
      });
      flash("Хадгалалаа");
      setEditingPkg(null);
      fetchData();
    } catch { flash("Хадгалахад алдаа гарлаа", true); }
    finally { setEditSaving(false); }
  };

  const rowClass = "flex items-center gap-3 px-4 py-3 border-b border-[#1e1e22] last:border-b-0 cursor-pointer hover:bg-white/[0.03] transition-colors select-none";

  return (
    <div className="min-h-screen bg-[#111113] font-sans text-[#c0c0c8]">
      <div className="max-w-[720px] mx-auto px-6 py-12 sm:px-4 sm:py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">Багц удирдах</h1>
            <p className="text-[13px] text-[#555] mt-0.5">Кино, цувралыг багцаар бүлэглэнэ</p>
          </div>
          <button onClick={() => router.push("/admin/adminHome")}
            className="px-4 py-2 rounded-lg border border-[#2a2a2e] text-[#777] text-[13px] hover:border-[#444] hover:text-white transition-all cursor-pointer bg-transparent">
            ← Буцах
          </button>
        </div>

        {error && <div className="bg-[#1a1a1e] border border-red-500/30 rounded-lg px-4 py-3 text-[13px] text-red-400 mb-5">⚠ {error}</div>}
        {success && <div className="bg-[#1a1a1e] border border-[#81B29A]/30 rounded-lg px-4 py-3 text-[13px] text-[#81B29A] mb-5">✓ {success}</div>}

        {loading ? (
          <div className="text-center py-16 text-[12px] text-[#333]">Уншиж байна…</div>
        ) : (
          <>

            {packages.length > 0 && (
              <div className="mb-10">
                <p className="text-[11px] uppercase tracking-widest text-[#333] mb-3">Одоогийн багцууд</p>
                <div className="flex flex-col gap-2">
                  {packages.map((pkg) => (
                    <div key={pkg.name} className="rounded-xl border border-[#1e1e22] bg-[#0d0d0f] overflow-hidden">
<div className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-[14px] font-semibold text-white">{pkg.name}</p>
                          <p className="text-[11px] text-[#555] mt-0.5">
                            {pkg.movies.length > 0 && `${pkg.movies.length} кино`}
                            {pkg.movies.length > 0 && pkg.series.length > 0 && " · "}
                            {pkg.series.length > 0 && `${pkg.series.length} цуврал`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editingPkg === pkg.name ? setEditingPkg(null) : openEdit(pkg)}
                            className={`px-3 py-1.5 rounded-lg border text-[12px] transition-all cursor-pointer bg-transparent ${editingPkg === pkg.name ? "border-[#38bdf8]/50 text-[#38bdf8]" : "border-[#2a2a2e] text-[#777] hover:border-[#444] hover:text-white"}`}
                          >
                            {editingPkg === pkg.name ? "Хаах" : "Засах"}
                          </button>
                          <button
                            onClick={() => handleDelete(pkg)}
                            disabled={deletingPkg === pkg.name}
                            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-[12px] hover:bg-red-500/10 hover:border-red-500/50 transition-all cursor-pointer bg-transparent disabled:opacity-40"
                          >
                            {deletingPkg === pkg.name ? "…" : "Устгах"}
                          </button>
                        </div>
                      </div>

{editingPkg === pkg.name && (
                        <div className="border-t border-[#1e1e22] px-4 py-4">
                          <input
                            className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-[#38bdf8] transition-colors mb-3 placeholder:text-[#555]"
                            placeholder="Нэрээр хайх…"
                            value={editSearch}
                            onChange={(e) => setEditSearch(e.target.value)}
                          />

                          {movies.filter((m) => m.name.toLowerCase().includes(editSearch.toLowerCase())).length > 0 && (
                            <div className="mb-3">
                              <p className="text-[10px] uppercase tracking-widest text-[#444] mb-2">Кинонууд</p>
                              <div className="rounded-lg border border-[#1e1e22] overflow-hidden">
                                {movies.filter((m) => m.name.toLowerCase().includes(editSearch.toLowerCase())).map((m) => (
                                  <div key={m.id} className={rowClass}
                                    onClick={() => setEditMovies((prev) => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; })}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${editMovies.has(m.id) ? "bg-[#38bdf8] border-[#38bdf8]" : "border-[#3a3a38]"}`}>
                                      {editMovies.has(m.id) && <span className="text-black text-[11px] font-bold">✓</span>}
                                    </div>
                                    <span className="text-[13px] text-[#ccc] flex-1">{m.name}</span>
                                    {m.movieNumber && m.movieNumber !== pkg.name && (
                                      <span className="text-[10px] text-[#555] font-mono">{m.movieNumber}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {series.filter((s) => s.name.toLowerCase().includes(editSearch.toLowerCase())).length > 0 && (
                            <div className="mb-4">
                              <p className="text-[10px] uppercase tracking-widest text-[#444] mb-2">Цувралууд</p>
                              <div className="rounded-lg border border-[#1e1e22] overflow-hidden">
                                {series.filter((s) => s.name.toLowerCase().includes(editSearch.toLowerCase())).map((s) => (
                                  <div key={s.id} className={rowClass}
                                    onClick={() => setEditSeries((prev) => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${editSeries.has(s.id) ? "bg-[#38bdf8] border-[#38bdf8]" : "border-[#3a3a38]"}`}>
                                      {editSeries.has(s.id) && <span className="text-black text-[11px] font-bold">✓</span>}
                                    </div>
                                    <span className="text-[13px] text-[#ccc] flex-1">{s.name}</span>
                                    {s.seriesNumber && s.seriesNumber !== pkg.name && (
                                      <span className="text-[10px] text-[#555] font-mono">{s.seriesNumber}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleEditSave(pkg)}
                            disabled={editSaving}
                            className="w-full py-2.5 rounded-lg border-none text-[#1F1F1E] text-[13px] font-bold cursor-pointer disabled:opacity-40 hover:enabled:opacity-90"
                            style={{ background: "#38bdf8" }}
                          >
                            {editSaving ? "Хадгалж байна…" : "Хадгалах →"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

<div className="mb-6">
              <p className="text-[11px] uppercase tracking-widest text-[#333] mb-3">Шинэ багц үүсгэх</p>
              <input
                className="w-full bg-[#1F1F1E] border border-[#3a3a38] rounded-lg px-4 py-3 text-[14px] text-white outline-none focus:border-[#38bdf8] transition-colors mb-3"
                placeholder="Багцын нэр — жишээ: Шинээр нэмэгдсэн"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
              <input
                className="w-full bg-[#1F1F1E] border border-[#3a3a38] rounded-lg px-4 py-2.5 text-[13px] text-white outline-none focus:border-[#38bdf8] transition-colors mb-4 placeholder:text-[#555]"
                placeholder="Нэрээр хайх…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {movies.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-widest text-[#444] mb-2">Кинонууд · {selectedMovies.size} сонгосон</p>
                  <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
                    {movies.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())).map((m) => (
                      <div key={m.id} className={rowClass}
                        onClick={() => setSelectedMovies((prev) => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; })}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedMovies.has(m.id) ? "bg-[#38bdf8] border-[#38bdf8]" : "border-[#3a3a38]"}`}>
                          {selectedMovies.has(m.id) && <span className="text-black text-[11px] font-bold">✓</span>}
                        </div>
                        <span className="text-[13px] text-[#ccc] flex-1">{m.name}</span>
                        {m.movieNumber && <span className="text-[11px] text-[#555] font-mono">{m.movieNumber}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {series.length > 0 && (
                <div className="mb-6">
                  <p className="text-[11px] uppercase tracking-widest text-[#444] mb-2">Цувралууд · {selectedSeries.size} сонгосон</p>
                  <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
                    {series.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).map((s) => (
                      <div key={s.id} className={rowClass}
                        onClick={() => setSelectedSeries((prev) => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedSeries.has(s.id) ? "bg-[#38bdf8] border-[#38bdf8]" : "border-[#3a3a38]"}`}>
                          {selectedSeries.has(s.id) && <span className="text-black text-[11px] font-bold">✓</span>}
                        </div>
                        <span className="text-[13px] text-[#ccc] flex-1">{s.name}</span>
                        {s.seriesNumber && <span className="text-[11px] text-[#555] font-mono">{s.seriesNumber}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movies.length === 0 && series.length === 0 && (
                <p className="text-center py-8 text-[12px] text-[#333]">Контент байхгүй байна</p>
              )}

              <button
                className="w-full py-3.5 rounded-lg border-none text-[#1F1F1E] text-[14px] font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 active:enabled:scale-[0.98]"
                style={{ background: "#38bdf8" }}
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "Үүсгэж байна…" : "Багц үүсгэх →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
