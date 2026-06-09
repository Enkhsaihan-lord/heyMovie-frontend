"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const signIn = async () => {
    setError("");
    if (!email || !password) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/signIn', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Алдаа гарлаа");
        return;
      }
      localStorage.setItem("userEmail", email);
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } catch {
      setError("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center border-b border-[#e5e5e5] relative">
          <button className="flex-1 py-4 text-[14px] font-bold text-black border-b-2 border-black bg-transparent cursor-pointer">
            Нэвтрэх
          </button>
          <button
            onClick={() => router.push("/user/signUp")}
            className="flex-1 py-4 text-[14px] font-medium text-[#888] border-b-2 border-transparent bg-transparent cursor-pointer hover:text-black transition-colors"
          >
            Бүртгүүлэх
          </button>
          <button
            onClick={() => router.push("/")}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-[#888] hover:text-black hover:bg-[#f0f0f0] bg-transparent border-none cursor-pointer text-[18px] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-8 py-7">
          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✓</div>
              <p className="font-bold text-black text-[16px]">
                Амжилттай нэвтэрлээ!
              </p>
              <p className="text-[13px] text-[#888] mt-1">Redirecting…</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 mb-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && signIn()}
                    className="w-full h-10 px-3 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">
                    Нууц үг
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && signIn()}
                      className="w-full h-10 px-3 pr-10 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] bg-transparent border-none cursor-pointer p-0"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={signIn}
                disabled={loading}
                className="w-full h-11 rounded-full bg-[#e5a00d] text-white font-bold text-[14px] border-none cursor-pointer hover:bg-[#d4940c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Нэвтрэж байна…" : "Нэвтрэх"}
              </button>

              <p className="text-center mt-4 text-[13px]">
                <a
                  href="/user/forgotPass/sendCode"
                  className="text-[#888] hover:text-black transition-colors"
                >
                  Нууц үг мартсан
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
