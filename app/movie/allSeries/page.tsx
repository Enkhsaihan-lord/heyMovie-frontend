"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SeriesInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  subscription: string;
}

const NAV_LINKS = [
  { label: "Кино", path: "/movie/allMovies" },
  { label: "Цуврал", path: "/movie/allSeries" },
  { label: "Эрх", path: "/movie/movieSubPay" },
  { label: "Home", path: "/" },
];

const Page = () => {
  const router = useRouter();
  const [series, setSeries] = useState<SeriesInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userSub, setUserSub] = useState<"PREMIUM" | "NORMAL" | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const fetchAll = async () => {
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/allSeries`,
        ).then((r) => r.json());
        setSeries(data);
        if (email) {
          const userData = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/userDetail?email=${email}`,
          ).then((r) => r.json());
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

  const goToSeries = (id: string, subscription: string) => {
    if (subscription === "PREMIUM" && !userSub) {
      setShowSignInPrompt(true);
      return;
    }
    router.push(`/series/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {showSignInPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSignInPrompt(false)}
        >
          <div
            className="bg-[#161b22] border border-white/10 rounded-2xl p-8 w-[320px] flex flex-col items-center gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl">◈</div>
            <h2 className="text-lg font-bold text-white">
              Нэвтрэх шаардлагатай
            </h2>
            <p className="text-[13px] text-[#9ca3af] text-center leading-relaxed">
              Premium контентийг үзэхийн тулд эхлээд нэвтэрнэ үү.
            </p>
            <button
              onClick={() => router.push("/user/signIn")}
              className="w-full py-2.5 rounded-full bg-cyan-500 text-white text-sm font-bold border-none cursor-pointer hover:bg-cyan-400 transition-colors"
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

      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-10 lg:px-16 h-14 bg-[rgba(13,17,23,0.85)] backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => router.push("/")}
          className="text-[15px] md:text-[17px] font-black tracking-tight text-white bg-transparent border-none cursor-pointer shrink-0"
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

      <div className="pt-20 pb-16 px-4 md:px-10 lg:px-16 max-w-[1600px] mx-auto">
        <h1 className="text-[22px] md:text-[28px] font-bold text-white mb-6">
          Бүх цуврал
        </h1>

        {loading && <p className="text-[#444] text-sm">Ачааллаж байна…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && series.length === 0 && (
          <p className="text-[#6b7280] text-sm">Цуврал байхгүй байна</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {series.map((s) => (
            <div
              key={s.id}
              onClick={() => goToSeries(s.id, s.subscription)}
              className="cursor-pointer group"
            >
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg shadow-black/40">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full aspect-2/3 object-cover block transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-cyan-500/80 text-white backdrop-blur-sm">
                    {s.subscription === "PREMIUM" ? "PRE" : "FREE"}
                  </span>
                </div>
              </div>
              <div className="pt-2 px-0.5">
                <p className="text-[12px] md:text-[13px] font-medium text-white truncate group-hover:text-cyan-400 transition-colors duration-200">
                  {s.name}
                </p>
                <p className="text-[10px] text-[#6b7280] mt-0.5 uppercase tracking-wide">
                  Цуврал
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
