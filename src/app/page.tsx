"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  role: string;
  subscription: string;
}

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, premium: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/allUsersGet`,
        );
        const data: User[] = await res.json();
        setStats({
          total: data.length,
          premium: data.filter((u) => u.subscription === "PREMIUM").length,
          admins: data.filter(
            (u) => u.role === "ADMIN" || u.role === "SUPERADMIN",
          ).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Нийт хэрэглэгч", value: stats.total, color: "text-white" },
    { label: "Premium захиалга", value: stats.premium, color: "text-yellow-400" },
    { label: "Админ", value: stats.admins, color: "text-red-400" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-red-500">HEY</span>MOVIE Admin
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Удирдлагын самбар</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {card.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${card.color}`}>
              {loading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/allUserGet"
        className="inline-flex rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Хэрэглэгчид харах →
      </Link>
    </main>
  );
}
