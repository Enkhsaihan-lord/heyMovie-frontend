"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
  { label: "Movie Post", path: "/admin/moviePost" },
  { label: "Series Post", path: "/admin/seriesPost" },
  { label: "Ep Post", path: "/admin/epPost" },
  { label: "Pay Request", path: "/admin/payRequest" },
  { label: "Movie Sub", path: "/admin/movieSub" },
  { label: "User Sub", path: "/admin/userSub" },
  { label: "User Detail", path: "/admin/userDetail" },
  { label: "Set Movies", path: "/admin/setMovies" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

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
        if (data.role === "ADMIN" || data.role === "SUPERADMIN") {
          setReady(true);
        } else {
          router.replace("/user/signIn");
        }
      })
      .catch(() => router.replace("/user/signIn"));
  }, [router]);

  if (!ready) return null;

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border-b border-[#333]">
        <button
          onClick={() => router.push("/")}
          className="px-3.5 py-1.5 border border-[#333] rounded cursor-pointer text-[13px] bg-transparent text-[#555] hover:text-[#aaa] hover:border-[#555] transition-colors"
        >
          ← Home
        </button>
        <button
          onClick={() => router.push("/admin/adminHome")}
          className={`px-3.5 py-1.5 border border-[#333] rounded cursor-pointer text-[13px] ${pathname === "/admin/adminHome" ? "bg-[#22d3ee] text-black" : "bg-transparent text-[#aaa]"}`}
        >
          Dashboard
        </button>
        <div className="w-px h-5 bg-[#2a2a2a] mx-1" />
        {NAV.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`px-3.5 py-1.5 border border-[#333] rounded cursor-pointer text-[13px] ${pathname === item.path ? "bg-[#22d3ee] text-black" : "bg-transparent text-[#aaa]"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div>{children}</div>
    </div>
  );
}
