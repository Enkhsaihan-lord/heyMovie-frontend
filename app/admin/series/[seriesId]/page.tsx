"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Episode {
  id: string;
  episodeNumber: string;
  videoUrl: string | null;
}

interface SeriesDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  subscription: string;
  videoUrl: string | null;
  episodes: Episode[];
}

const NAV_LINKS = [
  { label: "Кино", path: "/movie/allMovies" },
  { label: "Цуврал", path: "/movie/allSeries" },
  { label: "Эрх", path: "/movie/movieSubPay" },
  { label: "Home", path: "/" },
];

const Page = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const router = useRouter();
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  const handlePlay = async (episodeId: string) => {
    if (series?.subscription !== "PREMIUM") {
      router.push(`/series/seriesPlay/${episodeId}`);
      return;
    }
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/user/signIn");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userDetail?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.subscription === "PREMIUM") {
        router.push(`/series/seriesPlay/${episodeId}`);
      } else {
        setShowPremiumPrompt(true);
      }
    } catch {
      setShowPremiumPrompt(true);
    }
  };

  useEffect(() => {
    if (!seriesId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series/${seriesId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Series олдсонгүй");
        return r.json();
      })
      .then((data: SeriesDetail) => setSeries(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [seriesId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#888] font-sans">
        Ачааллаж байна…
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#888] font-sans">
        {error || "Series олдсонгүй"}
      </div>
    );
  }

  return (
    <>
      {showPremiumPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPremiumPrompt(false)}
        >
          <div
            className="bg-[#161b22] border border-white/10 rounded-2xl p-8 w-[320px] flex flex-col items-center gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 text-xl">★</div>
            <h2 className="text-lg font-bold text-white">Premium эрх шаардлагатай</h2>
            <p className="text-[13px] text-[#9ca3af] text-center leading-relaxed">
              Энэ цувралыг үзэхийн тулд Premium эрх худалдан авна уу.
            </p>
            <button
              onClick={() => router.push("/movie/movieSubPay")}
              className="w-full py-2.5 rounded-full bg-cyan-500 text-white text-sm font-bold border-none cursor-pointer hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.35)]"
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

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 lg:px-16 h-14 bg-black/60 backdrop-blur-md">
        <button
          onClick={() => router.push("/")}
          className="text-[15px] font-black tracking-tight text-white bg-transparent border-none cursor-pointer shrink-0"
        >
          HeyMovie
        </button>
        <div className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="text-[#9ca3af] text-[13px] px-3 md:px-4 py-2 bg-transparent border-none cursor-pointer hover:text-white transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => router.back()}
          className="text-[#9ca3af] text-[13px] px-3 py-1.5 bg-transparent border-none cursor-pointer hover:text-white transition-colors"
        >
          ← Буцах
        </button>
      </nav>

      <div className="bg-black min-h-screen">
        <div className="relative min-h-[55vh] flex flex-col justify-end overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover pointer-events-none blur-[18px] brightness-[0.25] scale-[1.06]"
            src={series.image}
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/[0.92] pointer-events-none" />

          <div className="relative z-10 px-6 pb-9 md:px-12 md:pb-12 max-w-[680px]">
            <div className={`inline-flex items-center border rounded px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase mb-3 ${
              series.subscription === "PREMIUM"
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-white/10 border-white/20 text-white"
            }`}>
              {series.subscription}
            </div>
            <h1
              className="text-[clamp(28px,4vw,48px)] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-3"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              {series.name}
            </h1>
            <p className="text-[15px] text-white/65 leading-[1.65] font-light max-w-[520px]">
              {series.description}
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] px-6 pt-10 pb-16 md:px-6">
          <div className="max-w-[860px] mx-auto">
            <div className="text-[18px] font-bold text-white tracking-[-0.02em] mb-5">
              Ангиуд · {series.episodes.length}
            </div>

            {series.episodes.length === 0 ? (
              <div className="text-center py-10 text-white/25 text-[14px]">Анги байхгүй байна</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {series.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center gap-4 bg-[#111] border border-white/[0.06] rounded-[10px] px-5 py-4 cursor-pointer hover:border-white/[0.18] hover:bg-[#161616] transition-all"
                  >
                    <div className="text-[20px] font-extrabold text-white/15 min-w-[40px] text-center shrink-0">
                      {ep.episodeNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium text-white truncate">
                        {ep.episodeNumber}-р анги
                      </div>
                    </div>
                    <button
                      className="px-[18px] py-2 rounded-lg border border-purple-500/35 bg-transparent text-purple-400 text-[13px] font-medium cursor-pointer shrink-0 hover:bg-purple-500/10 hover:border-purple-500/60 transition-all whitespace-nowrap"
                      onClick={() => handlePlay(ep.id)}
                    >
                      ▶ Үзэх
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
