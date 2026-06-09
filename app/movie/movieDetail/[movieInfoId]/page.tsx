"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface MovieInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  videoUrl: string | null;
  subscription: string;
  releaseDate: string | null;
}

const NAV_LINKS = [
  { label: "Кино", path: "/movie/allMovies" },
  { label: "Цуврал", path: "/movie/allSeries" },
  { label: "Эрх", path: "/movie/movieSubPay" },
  { label: "Home", path: "/" },
];

const Page = () => {
  const { movieInfoId } = useParams<{ movieInfoId: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [similar, setSimilar] = useState<MovieInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  const handlePlay = async () => {
    if (movie?.subscription !== "PREMIUM") {
      router.push(`/movie/moviePlay/${movieInfoId}`);
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
        router.push(`/movie/moviePlay/${movieInfoId}`);
      } else {
        setShowPremiumPrompt(true);
      }
    } catch {
      setShowPremiumPrompt(true);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/movieDetail/${movieInfoId}`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/allMovies`).then((r) => r.json()),
    ])
      .then(([detail, all]: [MovieInfo, MovieInfo[]]) => {
        setMovie(detail);
        setSimilar((all as MovieInfo[]).filter((m) => m.id !== movieInfoId).slice(0, 12));
      })
      .catch(() => setError("Кино татахад алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, [movieInfoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#888] font-sans">
        Ачааллаж байна…
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#888] font-sans">
        {error || "Кино олдсонгүй"}
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
              Энэ киног үзэхийн тулд Premium эрх худалдан авна уу.
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

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 lg:px-16 h-14">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/80 text-[22px] bg-transparent border-none cursor-pointer hover:text-white transition-colors leading-none"
        >
          ‹
        </button>
        <button
          onClick={() => router.push("/")}
          className="text-[15px] font-black tracking-tight text-white bg-transparent border-none cursor-pointer"
        >
          HeyMovie
        </button>
        <div className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="text-white/70 text-[13px] px-3 py-2 bg-transparent border-none cursor-pointer hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="bg-[#111] min-h-screen">
        <div className="relative h-screen min-h-[560px] overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            src={movie.image}
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-14 md:px-14 md:pb-16 max-w-[620px]">
            <h1
              className="text-[clamp(36px,6vw,64px)] font-black text-white leading-[1.0] tracking-tight mb-3"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
            >
              {movie.name}
            </h1>

            <div className="flex items-center gap-2 mb-4 flex-wrap text-[13px] text-white/60">
              {movie.releaseDate && (
                <>
                  <span>{movie.releaseDate}</span>
                  <span className="text-white/25">|</span>
                </>
              )}
              <span>{movie.subscription === "PREMIUM" ? "HD" : "SD"}</span>
              <span className="text-white/25">|</span>
              <span className={`font-semibold ${movie.subscription === "PREMIUM" ? "text-amber-400" : "text-white/60"}`}>
                {movie.subscription}
              </span>
            </div>

            <p className="text-[14px] text-white/70 leading-relaxed mb-6 max-w-[500px] line-clamp-3">
              {movie.description}
            </p>

            <div className="flex gap-3 flex-wrap">
              {movie.videoUrl && (
                <button
                  className="inline-flex items-center gap-2 bg-white border-none rounded px-6 py-2.5 text-black text-[14px] font-bold cursor-pointer hover:bg-white/90 transition-colors"
                  onClick={handlePlay}
                >
                  ▶ Үзэх
                </button>
              )}
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="px-6 md:px-14 pt-8 pb-16">
            <h2 className="text-[16px] font-bold text-white mb-4">Төстэй контент</h2>
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
              {similar.map((m) => (
                <div
                  key={m.id}
                  onClick={() => router.push(`/movie/movieDetail/${m.id}`)}
                  className="flex-shrink-0 w-[110px] sm:w-[130px] md:w-[150px] cursor-pointer group"
                >
                  <div className="relative rounded overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full aspect-[2/3] object-cover block transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    {m.subscription === "PREMIUM" && (
                      <div className="absolute top-0 left-0">
                        <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-amber-500 text-white">PREMIUM</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-[#aaa] truncate group-hover:text-white transition-colors mt-1.5">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
