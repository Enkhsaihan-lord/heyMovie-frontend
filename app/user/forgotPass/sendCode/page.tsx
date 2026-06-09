"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sendCode = async () => {
    setError("");
    if (!email) { setError("И-мэйл хаягаа оруулна уу"); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/forgotPassword/sendCode', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Алдаа гарлаа"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/user/forgotPass/verifyCode"), 2000);
    } catch {
      setError("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center border-b border-[#e5e5e5] px-6 py-4">
          <button
            onClick={() => router.push("/user/signIn")}
            className="text-[13px] text-[#888] hover:text-black transition-colors bg-transparent border-none cursor-pointer"
          >
            ← Буцах
          </button>
          <span className="mx-auto text-[14px] font-bold text-black">Нууц үг сэргээх</span>
          <button
            onClick={() => router.push("/")}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#888] hover:text-black hover:bg-[#f0f0f0] bg-transparent border-none cursor-pointer text-[18px] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-8 py-7">
          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✓</div>
              <p className="font-bold text-black text-[16px]">Код илгээгдлээ!</p>
              <p className="text-[13px] text-[#888] mt-1">Баталгаажуулах хуудас руу шилжиж байна…</p>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-[#666] mb-5">
                Бүртгэлтэй и-мэйл хаягаа оруулна уу. Баталгаажуулах код илгээнэ.
              </p>

              {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-[12px] font-semibold text-[#444] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendCode()}
                  className="w-full h-10 px-3 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                />
              </div>

              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full h-11 rounded-full bg-[#e5a00d] text-white font-bold text-[14px] border-none cursor-pointer hover:bg-[#d4940c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Илгээж байна…" : "Код илгээх"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
