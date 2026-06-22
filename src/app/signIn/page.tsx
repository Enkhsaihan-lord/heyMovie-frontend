"use client";

import { useSignIn, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { signIn, fetchStatus } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fetchStatus === "fetching" || !signIn) return;
    setError("");
    setLoading(true);
    try {
      const { error } = await signIn.create({ identifier: email, password });
      if (error) {
        setError(error.message);
        return;
      }
      if (signIn.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        router.push("/");
      } else {
        setError("Нэвтрэх явц дуусаагүй байна");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : "Серверийн алдаа гарлаа";
      setError(msg ?? "Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Нэвтрэх</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Акаунтдаа нэвтэрч үргэлжлүүлнэ үү
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Имэйл
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Нууц үг
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Акаунт байхгүй юу?{" "}
          <Link
            href="/signUp"
            className="font-medium text-white transition-colors hover:text-zinc-300"
          >
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </main>
  );
}
