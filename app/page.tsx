"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface MovieInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  videoUrl: string | null;
  subscription: "PREMIUM" | "NORMAL";
  movieNumber: string | null;
}

interface SeriesInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  subscription: "PREMIUM" | "NORMAL";
  seriesNumber: string;
}

const Page = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<MovieInfo[]>([]);
  const [series, setSeries] = useState<SeriesInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userSub, setUserSub] = useState<"PREMIUM" | "NORMAL" | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const fetchAll = async () => {
      try {
        const [movieData, seriesData] = await Promise.all([
          fetch(`/api/movie/allMovies`).then((r) => r.json()),
          fetch(`/api/series`).then((r) => r.json()),
        ]);
        setMovies(movieData);
        setSeries(seriesData);
        if (email) {
          const userData = await fetch(`/api/userDetail?email=${email}`).then(
            (r) => r.json(),
          );
          setUserSub(userData.subscription ?? "NORMAL");
        }
      } catch {
        setError("Мэдээлэл татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const logout = () => {
    localStorage.removeItem("userEmail");
    setUserSub(null);
  };

  const goToContent = (path: string, subscription: string) => {
    if (subscription === "PREMIUM" && !userSub) {
      setShowSignInPrompt(true);
      return;
    }
    if (subscription === "PREMIUM" && userSub === "NORMAL") {
      setShowPremiumPrompt(true);
      return;
    }
    router.push(path);
  };

  const q = searchQuery.trim().toLowerCase();
  const searchResults =
    q.length < 1
      ? []
      : [
          ...series
            .filter((s) => s.name.toLowerCase().includes(q))
            .map((s) => ({
              id: s.id,
              name: s.name,
              image: s.image,
              subscription: s.subscription,
              type: "series" as const,
            })),
          ...movies
            .filter((m) => m.name.toLowerCase().includes(q))
            .map((m) => ({
              id: m.id,
              name: m.name,
              image: m.image,
              subscription: m.subscription,
              type: "movie" as const,
            })),
        ].slice(0, 8);

  const heroItems = [
    ...series.map((s) => ({ ...s, type: "series" as const })),
    ...movies.map((m) => ({ ...m, type: "movie" as const })),
  ];
  const hero = heroItems[heroIdx] ?? null;

  const NAV = [
    { label: "Нүүр", path: "/" },
    { label: "Кино", path: "/movie/allMovies" },
    { label: "Цуврал", path: "/movie/allSeries" },
    { label: "Эрх", path: "/movie/movieSubPay" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {showSignInPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSignInPrompt(false)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 w-[320px] flex flex-col items-center gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl">◈</div>
            <h2 className="text-lg font-bold">Нэвтрэх шаардлагатай</h2>
            <p className="text-[13px] text-[#9ca3af] text-center leading-relaxed">
              Premium контентийг үзэхийн тулд эхлээд нэвтэрнэ үү.
            </p>
            <button
              onClick={() => router.push("/user/signIn")}
              className="w-full py-2.5 rounded-full bg-white text-black text-sm font-bold border-none cursor-pointer hover:bg-white/90 transition-colors"
            >
              Нэвтрэх
            </button>
            <button
              onClick={() => setShowSignInPrompt(false)}
              className="text-[12px] text-[#6b7280] cursor-pointer hover:text-white transition-colors bg-transparent border-none"
            >
              Болих
            </button>
          </div>
        </div>
      )}

      {showPremiumPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPremiumPrompt(false)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 w-[320px] flex flex-col items-center gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-xl">
              ★
            </div>
            <h2 className="text-lg font-bold">Premium эрх шаардлагатай</h2>
            <p className="text-[13px] text-[#9ca3af] text-center leading-relaxed">
              Энэ контентийг үзэхийн тулд Premium эрх худалдан авна уу.
            </p>
            <button
              onClick={() => router.push("/movie/movieSubPay")}
              className="w-full py-2.5 rounded-full bg-white text-black text-sm font-bold border-none cursor-pointer hover:bg-white/90 transition-colors"
            >
              Premium эрх авах
            </button>
            <button
              onClick={() => setShowPremiumPrompt(false)}
              className="text-[12px] text-[#6b7280] cursor-pointer hover:text-white transition-colors bg-transparent border-none"
            >
              Болих
            </button>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center px-6 md:px-10 h-[56px] bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <button
          onClick={() => router.push("/")}
          className="text-[26px] tracking-widest text-white bg-transparent border-none cursor-pointer shrink-0 mr-8"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          HEYMOVIE
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="text-[14px] px-3 py-1.5 bg-transparent border-none cursor-pointer text-white/80 hover:text-white transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div ref={searchRef} className="relative">
            {showSearch ? (
              <div className="flex items-center gap-2 bg-black/60 border border-white/20 rounded-md px-3 h-8 w-[220px]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-[#6b7280] shrink-0"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 15l3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Хайх…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="bg-transparent border-none outline-none text-[13px] text-white placeholder-[#555] w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="text-[#555] hover:text-white bg-transparent border-none cursor-pointer text-[16px] leading-none shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <circle
                    cx="9"
                    cy="9"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 15l3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-[calc(100%+6px)] right-0 w-[300px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery("");
                      setShowSearch(false);
                      goToContent(
                        item.type === "series"
                          ? `/series/${item.id}`
                          : `/movie/movieDetail/${item.id}`,
                        item.subscription,
                      );
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.06] cursor-pointer transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-12 object-cover rounded shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#6b7280] mt-0.5">
                        {item.type === "series" ? "Цуврал" : "Кино"}
                        {item.subscription === "PREMIUM" && (
                          <span className="ml-1.5 text-amber-400">· PRE</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showDropdown && q.length > 0 && searchResults.length === 0 && (
              <div className="absolute top-[calc(100%+6px)] right-0 w-[260px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl px-4 py-6 text-center z-50">
                <p className="text-[13px] text-[#6b7280]">Илэрц олдсонгүй</p>
              </div>
            )}
          </div>

          {userSub !== null ? (
            <button
              onClick={logout}
              className="text-white/60 text-[13px] px-3 py-1.5 bg-transparent border-none cursor-pointer hover:text-white transition-colors whitespace-nowrap hidden sm:block"
            >
              Гарах
            </button>
          ) : (
            <button
              onClick={() => router.push("/user/signIn")}
              className="text-[13px] px-4 py-1.5 rounded-full bg-white text-black font-semibold border-none cursor-pointer hover:bg-white/90 transition-colors whitespace-nowrap hidden sm:block"
            >
              Нэвтрэх
            </button>
          )}
          <button
            onClick={() =>
              router.push(
                userSub !== null ? "/user/userDetail" : "/user/signIn",
              )
            }
            className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white font-bold text-[13px] flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors shrink-0"
          >
            П
          </button>
        </div>
      </nav>

      {loading && (
        <p className="pt-32 pl-6 text-[#555] text-sm">Ачааллаж байна…</p>
      )}
      {error && <p className="pt-32 pl-6 text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          {hero && (
            <div className="relative w-full h-[88vh] min-h-[540px] overflow-hidden">
              <img
                src={hero.image}
                alt={hero.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

              <div className="absolute bottom-0 left-0 px-6 md:px-14 pb-12 max-w-[580px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-3">
                  {hero.type === "series" ? "Цуврал" : "Кино"} ·{" "}
                  {hero.subscription === "PREMIUM" ? "Premium" : "Үнэгүй"}
                </p>
                <h1
                  className="text-[36px] md:text-[52px] font-black leading-[1.0] tracking-tight text-white mb-4 uppercase"
                  style={{ textShadow: "0 2px 32px rgba(0,0,0,0.9)" }}
                >
                  {hero.name}
                </h1>
                <p className="text-[13px] md:text-[14px] text-white/65 leading-relaxed mb-6 line-clamp-3">
                  {hero.description}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() =>
                      goToContent(
                        hero.type === "series"
                          ? `/series/${hero.id}`
                          : `/movie/movieDetail/${hero.id}`,
                        hero.subscription,
                      )
                    }
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/30 text-white text-[14px] font-semibold cursor-pointer hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Дэлгэрэнгүй
                  </button>
                </div>
              </div>

              {heroItems.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setHeroIdx(
                        (heroIdx - 1 + heroItems.length) % heroItems.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/10 text-white text-xl flex items-center justify-center cursor-pointer hover:bg-black/75 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setHeroIdx((heroIdx + 1) % heroItems.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/10 text-white text-xl flex items-center justify-center cursor-pointer hover:bg-black/75 transition-colors"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-5 right-6 flex gap-1.5">
                    {heroItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroIdx(i)}
                        className={`h-[3px] rounded-full border-none cursor-pointer transition-all duration-300 ${i === heroIdx ? "bg-white w-6" : "bg-white/30 w-2.5"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="pb-16 pt-6 bg-gradient-to-b from-black to-[#0f0f0f]">
            {(() => {
              const pkgMap = new Map<string, { movies: MovieInfo[]; series: SeriesInfo[] }>();
              series.forEach((s) => {
                if (!s.seriesNumber) return;
                const pkg = pkgMap.get(s.seriesNumber) ?? { movies: [], series: [] };
                pkg.series.push(s);
                pkgMap.set(s.seriesNumber, pkg);
              });
              movies.forEach((m) => {
                if (!m.movieNumber) return;
                const pkg = pkgMap.get(m.movieNumber) ?? { movies: [], series: [] };
                pkg.movies.push(m);
                pkgMap.set(m.movieNumber, pkg);
              });
              const pkgEntries = [...pkgMap.entries()];
              if (pkgEntries.length === 0) return (
                <p className="pt-20 text-center text-[#555] text-sm">Контент байхгүй байна</p>
              );
              return pkgEntries.map(([pkgName, items]) => (
                <section key={pkgName} className="mb-10">
                  <div className="px-6 md:px-14 mb-4">
                    <h2 className="text-[16px] font-bold text-white">{pkgName}</h2>
                  </div>
                  <div className="flex gap-3 overflow-x-auto px-6 md:px-14 pb-2 [scrollbar-width:none]">
                    {items.series.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => goToContent(`/series/${s.id}`, s.subscription)}
                        className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[175px] cursor-pointer group"
                      >
                        <div className="relative rounded-lg overflow-hidden">
                          <img src={s.image} alt={s.name} className="w-full aspect-[2/3] object-cover block transition-transform duration-300 group-hover:scale-[1.05]" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                          {s.subscription === "PREMIUM" && (
                            <div className="absolute top-1.5 left-1.5">
                              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-amber-500 text-white rounded-sm">PRE</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[12px] font-medium text-white/70 truncate group-hover:text-white transition-colors mt-2">{s.name}</p>
                      </div>
                    ))}
                    {items.movies.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => goToContent(`/movie/movieDetail/${m.id}`, m.subscription)}
                        className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[175px] cursor-pointer group"
                      >
                        <div className="relative rounded-lg overflow-hidden">
                          <img src={m.image} alt={m.name} className="w-full aspect-[2/3] object-cover block transition-transform duration-300 group-hover:scale-[1.05]" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                          {m.subscription === "PREMIUM" && (
                            <div className="absolute top-1.5 left-1.5">
                              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-amber-500 text-white rounded-sm">PRE</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[12px] font-medium text-white/70 truncate group-hover:text-white transition-colors mt-2">{m.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ));
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
