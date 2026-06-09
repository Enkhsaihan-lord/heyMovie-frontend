"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription: string;
  subscriptionExpiresAt: string | null;
}

const NAV_LINKS = [
  { label: "Кино", path: "/movie/allMovies" },
  { label: "Цуврал", path: "/movie/allSeries" },
  { label: "Эрх", path: "/movie/movieSubPay" },
  { label: "Home", path: "/" },
];

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renewDuration, setRenewDuration] = useState<
    "1month" | "3month" | "1year"
  >("1month");
  const [renewing, setRenewing] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.replace("/user/signIn");
      return;
    }
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userDetail?email=${encodeURIComponent(email)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setUser(data);
      })
      .catch(() => setError("Серверийн алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, [router]);

  const signOut = () => {
    localStorage.removeItem("userEmail");
    router.push("/user/signIn");
  };

  const handleRenew = async () => {
    if (!user) return;
    setRenewing(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/movieSubPay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, duration: renewDuration }),
      });
      setRenewSuccess(true);
    } finally {
      setRenewing(false);
    }
  };

  const isExpired =
    !!user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) < new Date();

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-10 lg:px-16 h-14 bg-[#111]/90 backdrop-blur-md border-b border-white/[0.06]">
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

      <div className="pt-14">
        {loading && (
          <div className="min-h-screen flex items-center justify-center text-[#555] text-sm">
            Ачааллаж байна…
          </div>
        )}
        {error && (
          <div className="min-h-screen flex items-center justify-center text-red-400 text-sm">
            {error}
          </div>
        )}

        {user && (
          <div className="max-w-[960px] mx-auto px-4 md:px-8 py-6">
            <p className="text-[13px] text-[#6b7280] mb-5">
              My Profile <span className="mx-1">•</span> {user.name}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
              <div className="w-[150px] h-[190px] sm:w-[160px] sm:h-[200px] rounded-lg bg-[#c27a3a] flex items-center justify-center shrink-0 shadow-xl">
                <span className="text-[96px] font-black text-white leading-none select-none">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full">
                <div className="flex-1">
                  <h1 className="text-[28px] md:text-[34px] font-bold text-white leading-tight mb-1">
                    {user.name}
                  </h1>
                  <p className="text-[14px] text-[#6b7280] mb-3">
                    {user.email}
                  </p>

                  <div className="flex items-center gap-1.5 mb-5">
                    <span className="text-[#6b7280] text-[13px]">📅</span>
                    <span className="text-[13px] text-[#9ca3af]">
                      Joined 2026
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push("/")}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-white/20 bg-white/[0.06] text-[13px] text-white cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      ◈ Home
                    </button>
                    {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                      <button
                        onClick={() => router.push("/admin/adminHome")}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/[0.07] text-[13px] text-cyan-400 cursor-pointer hover:bg-cyan-500/15 transition-colors"
                      >
                        ⚙ Admin
                      </button>
                    )}
                    <button
                      onClick={() => router.push("/movie/movieSubPay")}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-amber-500/30 bg-amber-500/[0.07] text-[13px] text-amber-400 cursor-pointer hover:bg-amber-500/15 transition-colors"
                    >
                      ★ Эрх авах
                    </button>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-red-500/25 bg-transparent text-[13px] text-[#7a3a3a] cursor-pointer hover:border-red-500/50 hover:text-red-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-6 sm:gap-4 sm:items-end sm:text-right">
                  <div>
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wide mb-0.5">
                      Subscription
                    </p>
                    <p
                      className={`text-[18px] font-bold ${user.subscription === "PREMIUM" ? "text-amber-400" : "text-[#9ca3af]"}`}
                    >
                      {user.subscription}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wide mb-0.5">
                      Role
                    </p>
                    <p className="text-[18px] font-bold text-white">
                      {user.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wide mb-0.5">
                      Дуусах огноо
                    </p>
                    <p
                      className={`text-[15px] font-medium ${isExpired ? "text-red-400" : "text-[#9ca3af]"}`}
                    >
                      {user.subscriptionExpiresAt
                        ? new Date(
                            user.subscriptionExpiresAt,
                          ).toLocaleDateString("mn-MN")
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isExpired && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                <p className="text-[14px] font-semibold text-amber-400 mb-1">
                  Premium эрх дууссан
                </p>
                <p className="text-[12px] text-[#9ca3af] mb-4">
                  {new Date(user.subscriptionExpiresAt!).toLocaleDateString(
                    "mn-MN",
                  )}
                  -нд дууссан. Сунгах хүсэлт илгээнэ үү.
                </p>
                {renewSuccess ? (
                  <p className="text-[13px] text-green-400">
                    ✓ Хүсэлт илгээгдлээ. Админ батлах болно.
                  </p>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={renewDuration}
                      onChange={(e) =>
                        setRenewDuration(
                          e.target.value as "1month" | "3month" | "1year",
                        )
                      }
                      className="h-9 px-3 rounded bg-white/[0.07] border border-white/15 text-white text-[13px] outline-none cursor-pointer"
                    >
                      <option value="1month">1 сар</option>
                      <option value="3month">3 сар</option>
                      <option value="1year">1 жил</option>
                    </select>
                    <button
                      onClick={handleRenew}
                      disabled={renewing}
                      className="px-5 py-2 rounded bg-amber-500 text-black text-[13px] font-bold border-none cursor-pointer hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {renewing ? "Илгээж байна…" : "Сунгах хүсэлт илгээх"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-white">
                  Дэлгэрэнгүй
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-4 bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-[18px] shrink-0">
                    👤
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white mb-1">
                      Профайл мэдээлэл
                    </p>
                    <p className="text-[12px] text-[#6b7280] leading-relaxed">
                      ID: #{user.id} · {user.email}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-start gap-4 bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 cursor-pointer hover:border-amber-500/20 transition-colors"
                  onClick={() => router.push("/movie/movieSubPay")}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-[18px] shrink-0">
                    ★
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white mb-1">
                      {user.subscription === "PREMIUM"
                        ? "Premium идэвхтэй"
                        : "Premium эрх авах"}
                    </p>
                    <p className="text-[12px] text-amber-400/70 leading-relaxed">
                      {user.subscription === "PREMIUM"
                        ? "Та бүх контентийг саадгүй үзэх боломжтой"
                        : "Premium эрх авч бүх контентийг үзэх →"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
