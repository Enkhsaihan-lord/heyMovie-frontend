"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (userInfo.password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password,
          role: "USER",
          subscription: "NORMAL",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Алдаа гарлаа");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/signIn"), 2000);
    } catch {
      setError("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl">✓</p>
          <h2 className="mt-4 text-xl font-semibold text-white">
            Амжилттай бүртгэгдлээ
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Нэвтрэх хуудас руу шилжиж байна...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Бүртгүүлэх</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Шинэ акаунт үүсгэх
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Нэр
            </label>
            <input
              name="name"
              placeholder="Нэрээ оруулна уу"
              value={userInfo.name}
              onChange={handleInput}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Имэйл
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={userInfo.email}
              onChange={handleInput}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Нууц үг
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={userInfo.password}
              onChange={handleInput}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Нууц үг давтах
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Үүсгэж байна..." : "Акаунт үүсгэх"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Акаунт байна уу?{" "}
          <Link
            href="/signIn"
            className="font-medium text-white transition-colors hover:text-zinc-300"
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
    </main>
  );
}
