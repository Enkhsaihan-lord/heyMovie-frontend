"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verifyCode = async () => {
    setError("");
    if (!email || !code) { setError("И-мэйл болон кодоо оруулна уу"); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/forgotPassword/verifyCode', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Алдаа гарлаа"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/user/forgotPass/changePass"), 2000);
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
            onClick={() => router.push("/user/forgotPass/sendCode")}
            className="text-[13px] text-[#888] hover:text-black transition-colors bg-transparent border-none cursor-pointer"
          >
            ← Буцах
          </button>
          <span className="mx-auto text-[14px] font-bold text-black">Код баталгаажуулах</span>
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
              <p className="font-bold text-black text-[16px]">Код баталгаажлаа!</p>
              <p className="text-[13px] text-[#888] mt-1">Нууц үг солих хуудас руу шилжиж байна…</p>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-[#666] mb-5">
                И-мэйл хаяг болон хүлээн авсан 6 оронтой кодоо оруулна уу.
              </p>

              {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 mb-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">Баталгаажуулах код</label>
                  <input
                    type="text"
                    placeholder="6 оронтой код"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                    maxLength={6}
                    className="w-full h-12 px-3 border border-[#ddd] rounded-md text-[22px] font-bold text-black text-center tracking-[0.3em] outline-none focus:border-[#e5a00d] transition-colors bg-white"
                  />
                </div>
              </div>

              <button
                onClick={verifyCode}
                disabled={loading}
                className="w-full h-11 rounded-full bg-[#e5a00d] text-white font-bold text-[14px] border-none cursor-pointer hover:bg-[#d4940c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Шалгаж байна…" : "Баталгаажуулах"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
