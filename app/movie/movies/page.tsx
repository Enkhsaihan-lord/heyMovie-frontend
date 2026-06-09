"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SeriesInfo {
  id: string;
  name: string;
  image: string;
  subscription: string;
}

interface MovieInfo {
  id: string;
  name: string;
  number: string;
  image: string;
  subscription: string;
  seriesId: string | null;
}

const Page = () => {
  const router = useRouter();
  const [series, setSeries] = useState<SeriesInfo[]>([]);
  const [movies, setMovies] = useState<MovieInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userSub, setUserSub] = useState<"PREMIUM" | "NORMAL" | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const fetchAll = async () => {
      try {
        const [seriesData, moviesData] = await Promise.all([
          fetch(`/api/series`).then((r) => r.json()),
          fetch(`/api/movie/allMovies`).then((r) => r.json()),
        ]);
        setSeries(seriesData);
        setMovies(moviesData.filter((m: MovieInfo) => !m.seriesId));
        if (email) {
          const userData = await fetch(
            `/api/userDetail?email=${email}`
          ).then((r) => r.json());
          setUserSub(userData.subscription ?? "NORMAL");
          if (userData.role === "ADMIN" || userData.role === "SUPERADMIN") setIsAdmin(true);
        }
      } catch {
        setError("Мэдээлэл татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const goToContent = (path: string, subscription: string) => {
    if (subscription === "PREMIUM") {
      if (!userSub) { setShowSignInPrompt(true); return; }
      if (userSub !== "PREMIUM") { router.push(path); return; }
    }
    router.push(path);
  };

  return (
    <>
      {showSignInPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSignInPrompt(false)}>
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-8 w-[320px] flex flex-col items-center gap-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-3xl">◈</div>
            <h2 className="text-lg font-bold text-white">Нэвтрэх шаардлагатай</h2>
            <p className="text-[13px] text-[#9ca3af] text-center leading-relaxed">Premium контентийг үзэхийн тулд эхлээд нэвтэрнэ үү.</p>
            <button onClick={() => router.push("/user/signIn")} className="w-full py-2.5 rounded-full bg-cyan-500 text-white text-sm font-bold border-none cursor-pointer hover:bg-cyan-400 transition-colors">Нэвтрэх</button>
            <button onClick={() => setShowSignInPrompt(false)} className="text-[12px] text-[#6b7280] cursor-pointer hover:text-white transition-colors bg-transparent border-none">Болих</button>
          </div>
        </div>
      )}

      {showPremiumPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPremiumPrompt(false)}>
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-8 w-[320px] flex flex-col items-center gap-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 text-xl">★</div>
            <h2 className="text-lg font-bold text-white">Premium эрх шаардлагатай</h2>
            <p className="text-[13px] text-[#9ca3af] text-center leading-relaxed">Энэ контентийг үзэхийн тулд Premium эрх худалдан авна уу.</p>
            <button onClick={() => router.push("/movie/movieSubPay")} className="w-full py-2.5 rounded-full bg-cyan-500 text-white text-sm font-bold border-none cursor-pointer hover:bg-cyan-400 transition-colors">Premium эрх авах</button>
            <button onClick={() => setShowPremiumPrompt(false)} className="text-[12px] text-[#6b7280] cursor-pointer hover:text-white transition-colors bg-transparent border-none">Болих</button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#020c18] font-sans text-[#e0f7ff] relative overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-12 sm:px-3.5 sm:py-7">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
            <div
              className="text-[22px] font-extrabold text-[#c084fc] tracking-[-0.04em]"
              style={{ textShadow: "0 0 20px rgba(192,132,252,0.4)" }}
            >
              ◈ platform
            </div>
            {isAdmin && (
              <div className="flex gap-2 flex-wrap">
                <button
                  className="inline-flex items-center gap-1.5 bg-transparent border-[1.5px] border-purple-500/30 rounded-[8px] px-[18px] py-[9px] text-[#c084fc] text-[13px] font-medium cursor-pointer transition-all duration-[180ms] hover:bg-purple-500/[0.07] hover:border-purple-500/50"
                  onClick={() => router.push("/admin/seriesPost")}
                >
                  + Series
                </button>
                <button
                  className="inline-flex items-center gap-1.5 bg-transparent border-[1.5px] border-purple-500/30 rounded-[8px] px-[18px] py-[9px] text-[#c084fc] text-[13px] font-medium cursor-pointer transition-all duration-[180ms] hover:bg-purple-500/[0.07] hover:border-purple-500/50"
                  onClick={() => router.push("/movie/moviePost")}
                >
                  + Кино
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh] text-[14px] text-[#2d6a82]">Ачааллаж байна…</div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[60vh] text-[14px] text-[#2d6a82]">{error}</div>
          ) : (
            <>
              {series.length > 0 && (
                <>
                  <div
                    className="font-extrabold text-[22px] text-[#e0f7ff] tracking-[-0.03em] mb-5 sm:text-[18px] sm:mb-3.5"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    <span
                      style={{
                        background: "linear-gradient(120deg, #a855f7, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Цуврал
                    </span>{" "}
                    кино
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[18px] mb-12 sm:grid-cols-2 sm:gap-3">
                    {series.map((s) => (
                      <div
                        key={s.id}
                        className="bg-[#041628] border border-purple-500/[0.12] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-200 hover:border-purple-500/35 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]"
                        onClick={() => router.push(`/series/${s.id}`)}
                      >
                        <img className="w-full aspect-[2/3] object-cover block bg-[#020c18]" src={s.image} alt={s.name} />
                        <div className="px-3.5 pt-3 pb-3.5 sm:p-2.5">
                          <div
                            className={`inline-flex items-center rounded-[20px] px-2.5 py-[2px] text-[9px] font-semibold tracking-[0.1em] uppercase mb-2 border${s.subscription === "PREMIUM" ? " bg-yellow-500/[0.08] border-yellow-500/25 text-[#fbbf24]" : " bg-purple-500/10 border-purple-500/30 text-[#c084fc]"}`}
                          >
                            {s.subscription}
                          </div>
                          <div
                            className="font-bold text-[15px] text-[#e0f7ff] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis sm:text-[13px]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {s.name}
                          </div>
                          <button
                            className="block w-full mt-3 py-[9px] rounded-[8px] border-[1.5px] border-purple-500/30 bg-transparent text-[#c084fc] text-[13px] font-medium cursor-pointer transition-all duration-[180ms] text-center hover:bg-purple-500/[0.07] hover:border-purple-500/50 sm:py-[7px] sm:text-[12px] sm:mt-2"
                            onClick={(e) => { e.stopPropagation(); router.push(`/series/${s.id}`); }}
                          >
                            ▶ Үзэх
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {movies.length > 0 && (
                <>
                  {series.length > 0 && <hr className="border-none border-t border-purple-500/[0.08] mb-9" />}
                  <div
                    className="font-extrabold text-[22px] text-[#e0f7ff] tracking-[-0.03em] mb-5 sm:text-[18px] sm:mb-3.5"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    <span
                      style={{
                        background: "linear-gradient(120deg, #a855f7, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Ганц
                    </span>{" "}
                    кино
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[18px] mb-12 sm:grid-cols-2 sm:gap-3">
                    {movies.map((m) => (
                      <div
                        key={m.id}
                        className="bg-[#041628] border border-purple-500/[0.12] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-200 hover:border-purple-500/35 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]"
                        onClick={() => goToContent(`/movie/movieDetail/${m.id}`, m.subscription)}
                      >
                        <img className="w-full aspect-[2/3] object-cover block bg-[#020c18]" src={m.image} alt={m.name} />
                        <div className="px-3.5 pt-3 pb-3.5 sm:p-2.5">
                          <div
                            className={`inline-flex items-center rounded-[20px] px-2.5 py-[2px] text-[9px] font-semibold tracking-[0.1em] uppercase mb-2 border${m.subscription === "PREMIUM" ? " bg-yellow-500/[0.08] border-yellow-500/25 text-[#fbbf24]" : " bg-purple-500/10 border-purple-500/30 text-[#c084fc]"}`}
                          >
                            {m.subscription}
                          </div>
                          <div
                            className="font-bold text-[15px] text-[#e0f7ff] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis sm:text-[13px]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {m.name}
                          </div>
                          <button
                            className="block w-full mt-3 py-[9px] rounded-[8px] border-[1.5px] border-purple-500/30 bg-transparent text-[#c084fc] text-[13px] font-medium cursor-pointer transition-all duration-[180ms] text-center hover:bg-purple-500/[0.07] hover:border-purple-500/50 sm:py-[7px] sm:text-[12px] sm:mt-2"
                            onClick={(e) => { e.stopPropagation(); goToContent(`/movie/movieDetail/${m.id}`, m.subscription); }}
                          >
                            ▶ Үзэх
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {series.length === 0 && movies.length === 0 && (
                <div className="text-center py-[60px] text-[#2d6a82] text-[14px]">Контент байхгүй байна</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
