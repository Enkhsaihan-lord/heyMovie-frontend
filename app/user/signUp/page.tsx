"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    subscription: "NORMAL",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const createUser = async () => {
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
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password,
          role: userInfo.role,
          subscription: userInfo.subscription,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Алдаа гарлаа");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/user/signIn"), 2000);
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
          <button
            onClick={() => router.push("/user/signIn")}
            className="flex-1 py-4 text-[14px] font-medium text-[#888] border-b-2 border-transparent bg-transparent cursor-pointer hover:text-black transition-colors"
          >
            Нэвтрэх
          </button>
          <button className="flex-1 py-4 text-[14px] font-bold text-black border-b-2 border-black bg-transparent cursor-pointer">
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
                Бүртгэл үүслээ!
              </p>
              <p className="text-[13px] text-[#888] mt-1">
                Sign In руу шилжиж байна…
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3.5 mb-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">
                    Нэр
                  </label>
                  <input
                    name="name"
                    placeholder="Нэрээ оруулна уу"
                    value={userInfo.name}
                    onChange={handleInput}
                    className="w-full h-10 px-3 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={userInfo.email}
                    onChange={handleInput}
                    className="w-full h-10 px-3 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">
                    Нууц үг
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={userInfo.password}
                      onChange={handleInput}
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
                <div>
                  <label className="block text-[12px] font-semibold text-[#444] mb-1.5">
                    Нууц үг давтах
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createUser()}
                      className="w-full h-10 px-3 pr-10 border border-[#ddd] rounded-md text-[14px] text-black outline-none focus:border-[#e5a00d] transition-colors bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] bg-transparent border-none cursor-pointer p-0"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={createUser}
                disabled={loading}
                className="w-full h-11 rounded-full bg-[#e5a00d] text-white font-bold text-[14px] border-none cursor-pointer hover:bg-[#d4940c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Үүсгэж байна…" : "Бүртгүүлэх"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
