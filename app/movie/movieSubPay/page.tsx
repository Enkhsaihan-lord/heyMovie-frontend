"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Duration = "1month" | "3month" | "1year";

interface SubPayment {
  id: number;
  email: string;
  duration: string;
  status: string;
  createdAt: string;
}

type PlanColor = {
  border: string;
  bg: string;
  glow: string;
  bullet: string;
  btn: string;
  btnHover: string;
  accent: string;
  badgeBg: string;
};

const PLANS: {
  value: Duration;
  label: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  color: PlanColor;
}[] = [
  {
    value: "1month",
    label: "1сар",
    price: "₮20,000",
    period: "/ сар",
    features: ["Бүх кино үзэх", "HD чанар"],
    color: {
      border: "rgba(244,114,182,0.5)",
      bg: "rgba(244,114,182,0.07)",
      glow: "rgba(244,114,182,0.2)",
      bullet: "#f472b6",
      btn: "#db2777",
      btnHover: "#be185d",
      accent: "#f9a8d4",
      badgeBg: "rgba(244,114,182,0.12)",
    },
  },
  {
    value: "3month",
    label: "3сар",
    price: "₮59,000",
    period: "/ 3 сар",
    badge: "АЛДАРТАЙ",
    features: ["Бүх кино үзэх", "HD чанар", "Шинэ контент"],
    color: {
      border: "rgba(168,85,247,0.5)",
      bg: "rgba(168,85,247,0.07)",
      glow: "rgba(168,85,247,0.2)",
      bullet: "#a855f7",
      btn: "#9333ea",
      btnHover: "#7e22ce",
      accent: "#c084fc",
      badgeBg: "rgba(168,85,247,0.12)",
    },
  },
  {
    value: "1year",
    label: "1жил",
    price: "₮178,000",
    period: "/ жил",
    badge: "ХЯМДРАЛ",
    features: ["Бүх кино үзэх", "4K чанар", "4 төхөөрөмж", "Шинэ контент"],
    color: {
      border: "rgba(234,179,8,0.5)",
      bg: "rgba(234,179,8,0.07)",
      glow: "rgba(234,179,8,0.2)",
      bullet: "#eab308",
      btn: "#ca8a04",
      btnHover: "#a16207",
      accent: "#fde047",
      badgeBg: "rgba(234,179,8,0.12)",
    },
  },
];

const durationLabel = (d: string) => {
  if (d === "1month") return "Individual";
  if (d === "3month") return "Student";
  if (d === "1year") return "Duo";
  return d;
};

const Page = () => {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [duration, setDuration] = useState<Duration>("1month");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");

  const [payments, setPayments] = useState<SubPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const activePlan = PLANS.find((p) => p.value === duration)!;

  useEffect(() => {
    const saved = localStorage.getItem("userEmail");
    if (saved) {
      setEmail(saved);
      fetch(`/api/userDetail?email=${encodeURIComponent(saved)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.role === "ADMIN" || data.role === "SUPERADMIN")
            setIsAdmin(true);
          if (data.subscription === "PREMIUM") setIsPremium(true);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetch(`/api/movie/movieSubPay`)
      .then((r) => r.json())
      .then((data: SubPayment[]) =>
        setPayments(Array.isArray(data) ? data : []),
      )
      .catch(() => {})
      .finally(() => setLoadingPayments(false));
  }, []);

  const selectPlan = (value: Duration) => {
    setDuration(value);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSend = async () => {
    if (sending || !email.trim()) return;
    setSending(true);
    setSendSuccess(false);
    setSendError("");
    try {
      const res = await fetch(`/api/movie/movieSubPay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "");
      setSendSuccess(true);
      setPayments((prev) => [
        {
          id: data.id,
          email: email.trim(),
          duration,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setTimeout(() => router.push("/movie/pushTelegram"), 1500);
    } catch (e: unknown) {
      setSendError(e instanceof Error ? e.message : "Алдаа гарлаа");
      setTimeout(() => setSendError(""), 2500);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111113] font-sans text-[#c0c0c8]">
      <div className="max-w-[860px] mx-auto px-6 py-12 sm:px-4 sm:py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">
              Premium Plans
            </h1>
            <p className="text-[13px] text-[#555] mt-0.5">
              Хугацаагаа сонгоод хүсэлт илгээнэ үү
            </p>
          </div>
          <button
            onClick={() => router.push(`/`)}
            className="px-4 py-2 rounded-lg border border-[#2a2a2e] text-[#777] text-[13px]        
  hover:border-[#444] hover:text-white transition-all cursor-pointer bg-transparent"
          >
            ← Буцах
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => {
            const active = duration === plan.value;
            const c = plan.color;
            return (
              <div
                key={plan.value}
                className="relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: active ? c.border : "rgba(255,255,255,0.07)",
                  background: active ? c.bg : "rgba(255,255,255,0.02)",
                  boxShadow: active ? `0 0 28px ${c.glow}` : "none",
                }}
                onClick={() => selectPlan(plan.value)}
              >
                {plan.badge && (
                  <div
                    className="text-center text-[9px] tracking-[0.14em] uppercase py-1 border-b"
                    style={{
                      color: c.accent,
                      background: c.badgeBg,
                      borderColor: active ? c.border : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <p
                    className="text-[10px] uppercase tracking-widest mb-1 opacity-60"
                    style={{ color: c.accent }}
                  >
                    Premium
                  </p>
                  <p className="text-[26px] font-bold text-white mb-2 leading-none">
                    {plan.label}
                  </p>
                  <p className="text-[14px] font-semibold text-white mb-1">
                    {plan.price}
                    <span className="text-[11px] text-[#555] font-normal ml-1">
                      {plan.period}
                    </span>
                  </p>
                  <div
                    className="h-px my-3"
                    style={{
                      background: active ? c.border : "rgba(255,255,255,0.06)",
                    }}
                  />
                  <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-1.5 text-[12px] text-[#aaa]"
                      >
                        <span
                          className="mt-[2px] shrink-0"
                          style={{ color: c.bullet }}
                        >
                          •
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-2.5 rounded-lg text-[12px] font-semibold text-white transition-all duration-150 cursor-pointer border-0"
                    style={{
                      background: active ? c.btn : "rgba(255,255,255,0.07)",
                    }}
                  >
                    {active ? "✓ Сонгогдсон" : "Сонгох"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div
          ref={formRef}
          className="rounded-xl border p-6 mb-8 transition-all duration-300"
          style={{
            borderColor: activePlan.color.border,
            background: activePlan.color.bg,
          }}
        >
          <p
            className="text-[11px] uppercase tracking-widest mb-4 opacity-80"
            style={{ color: activePlan.color.accent }}
          >
            {activePlan.label} — хүсэлт илгээх
          </p>

          <label className="block text-[11px] text-[#555] uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            className="w-full px-3.5 py-3 bg-[#0d0d0f] border border-[#2a2a2e] rounded-lg text-[13px] text-white outline-none mb-4 placeholder:text-[#333] transition-colors"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = activePlan.color.border)
            }
            onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2e")}
          />

          {isPremium ? (
            <div className="w-full py-3 rounded-lg text-[13px] font-semibold text-center border border-[#2a2a2e] text-[#555] bg-[#0d0d0f]">
              ✓ Та Premium гишүүн байна
            </div>
          ) : (
            <>
              <button
                className="w-full py-3 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: sendSuccess ? "#16a34a" : activePlan.color.btn,
                }}
                onClick={handleSend}
                disabled={sending || !email.trim()}
              >
                {sending
                  ? "Илгээж байна…"
                  : sendSuccess
                    ? "✓ Хүсэлт илгээгдлээ"
                    : "Хүсэлт илгээх"}
              </button>

              {sendSuccess && (
                <p className="mt-2 text-[12px] text-green-400">
                  ✓ Admin зөвшөөрөхийг хүлээнэ үү.
                </p>
              )}
              {sendError && (
                <p className="mt-2 text-[12px] text-red-400">⚠ {sendError}</p>
              )}
            </>
          )}
        </div>

        {isAdmin && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-[#333] mb-3">
              Хүсэлтүүдийн жагсаалт (Admin)
            </p>
            <div className="rounded-xl border border-[#1e1e22] overflow-hidden bg-[#0d0d0f]">
              {loadingPayments ? (
                <div className="text-center py-10 text-[12px] text-[#333]">
                  Loading…
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-10 text-[12px] text-[#333]">
                  Хүсэлт олдсонгүй
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {["#", "Email", "Төлөвлөгөө", "Статус", "Огноо"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-[10px] uppercase tracking-wider text-[#444] px-4 py-3 text-left border-b border-[#1e1e22] bg-[#111113]"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr
                        key={p.id}
                        className="hover:bg-white/[0.02] [&:last-child_td]:border-b-0"
                      >
                        <td className="text-[12px] text-[#555] px-4 py-3 border-b border-[#1a1a1e]">
                          {i + 1}
                        </td>
                        <td className="text-[12px] text-[#ccc] px-4 py-3 border-b border-[#1a1a1e]">
                          {p.email}
                        </td>
                        <td className="text-[12px] text-[#ccc] px-4 py-3 border-b border-[#1a1a1e]">
                          {durationLabel(p.duration)}
                        </td>
                        <td className="px-4 py-3 border-b border-[#1a1a1e]">
                          <span
                            className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${p.status === "APPROVED" ? "bg-green-950 text-green-400 border border-green-900" : "bg-yellow-950 text-yellow-400 border border-yellow-900"}`}
                          >
                            {p.status === "APPROVED"
                              ? "Зөвшөөрсөн"
                              : "Хүлээгдэж байна"}
                          </span>
                        </td>
                        <td className="text-[11px] text-[#444] px-4 py-3 border-b border-[#1a1a1e]">
                          {new Date(p.createdAt).toLocaleDateString("mn-MN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
