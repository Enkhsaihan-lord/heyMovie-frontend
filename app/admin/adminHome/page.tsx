"use client";

import { useRouter } from "next/navigation";

const PAGES = [
  { label: "Movie Post", path: "/admin/moviePost", icon: "🎬", desc: "Кино нэмэх" },
  { label: "Series Post", path: "/admin/seriesPost", icon: "📺", desc: "Цуврал нэмэх" },
  { label: "Ep Post", path: "/admin/epPost", icon: "🎞️", desc: "Анги нэмэх" },
  { label: "Pay Request", path: "/admin/payRequest", icon: "💳", desc: "Төлбөр хүсэлт" },
  { label: "Movie Sub", path: "/admin/movieSub", icon: "🔒", desc: "Кино subscription" },
  { label: "User Sub", path: "/admin/userSub", icon: "👤", desc: "Хэрэглэгч subscription" },
  { label: "User Detail", path: "/admin/userDetail", icon: "📋", desc: "Хэрэглэгч дэлгэрэнгүй" },
  { label: "Set Movies", path: "/admin/setMovies", icon: "📦", desc: "Багц удирдах" },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-[#666] text-sm mt-1">Удирдах самбар</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl">
        {PAGES.map((p) => (
          <button
            key={p.path}
            onClick={() => router.push(p.path)}
            className="flex flex-col items-start gap-2 px-5 py-4 bg-[#161616] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#444] rounded-xl text-left transition-all cursor-pointer group"
          >
            <span className="text-2xl">{p.icon}</span>
            <div>
              <p className="text-white text-sm font-semibold group-hover:text-[#e5a00d] transition-colors">{p.label}</p>
              <p className="text-[#555] text-xs mt-0.5">{p.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
