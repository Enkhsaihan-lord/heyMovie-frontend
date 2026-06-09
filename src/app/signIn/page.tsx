"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

import { useRouter } from "next/navigation";
export default function SignInPage() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fetchStatus === "fetching") return;
    setError("");
    setLoading(true);
    try {
      const { error: createError } = await signIn.create({ identifier: email, password });
      if (createError) {
        setError(createError.message ?? "Серверийн алдаа гарлаа");
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize();
        router.push("/");
      } else {
        setError("Нэвтрэх явц дуусаагүй байна");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-8 bg-black">
      <main className="w-full max-w-[380px] flex flex-col gap-16 md:gap-24">
        <header className="flex flex-col items-center text-center gap-12">
          <div className="text-white/60 font-sans text-sm tracking-[0.4em] uppercase">
            PROSCENIUM
          </div>
          <div className="space-y-4">
            <h1 className="font-sans font-bold text-3xl text-white tracking-tight">
              Sign In
            </h1>
            <p className="font-sans text-white/50 text-sm max-w-[280px] mx-auto leading-relaxed">
              Return to your collection and continue the narrative.
            </p>
          </div>
        </header>

        {/* Form Section */}
        <section className="flex flex-col gap-10">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1">
              <label
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-3 text-white focus:ring-0 transition-all placeholder:text-white/10 rounded-none outline-none"
                id="email"
                placeholder="name@domain.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <input
                className="w-full bg-transparent border-b border-white/10 focus:border-white px-0 py-3 text-white focus:ring-0 transition-all placeholder:text-white/10 rounded-none outline-none"
                id="password"
                placeholder="••••••••"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* CTA Button */}
            <button
              className="w-full bg-white py-4 text-black font-bold uppercase tracking-[0.3em] text-[11px] mt-4 hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entering..." : "Enter Vault"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-6">
            <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
              Forgot password?
            </button>

            <div className="flex items-center gap-4 w-full opacity-20">
              <div className="flex-grow border-t border-white"></div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-white">
                OR
              </span>
              <div className="flex-grow border-t border-white"></div>
            </div>

            <div className="flex gap-12">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                Google
              </button>
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                Apple
              </button>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <footer className="text-center pt-8">
          <p className="text-xs text-white/40 tracking-wide">
            New to the premiere?
            <a
              className="text-white font-bold hover:opacity-70 transition-opacity ml-2 border-b border-white/30"
              href="#"
            >
              Create an account
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
