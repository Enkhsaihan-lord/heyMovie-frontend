"use client";

import { useRouter, usePathname } from "next/navigation";

const NAV = [
  { label: "Series List", path: "/" },
  { label: "Series Post", path: "/admin/series/seriesPost" },
  { label: "Episode Post", path: "/admin/episodePost" },
];

export default function SeriesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <div className="flex gap-2 px-4 py-2.5 bg-[#111] border-b border-[#333]">
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
