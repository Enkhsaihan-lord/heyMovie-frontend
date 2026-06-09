"use client";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const c = {
    border: "rgba(56,189,248,0.5)",
    bg: "rgba(56,189,248,0.07)",
    glow: "rgba(56,189,248,0.2)",
    bullet: "#38bdf8",
    btn: "#0284c7",
    accent: "#7dd3fc",
  };

  return (
    <div className="min-h-screen bg-[#111113] font-sans text-[#c0c0c8] flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-6 left-6 flex gap-2">
        <button
          onClick={() => router.push(`/movie/movieSubPay`)}
          className="px-4 py-2 rounded-lg border border-[#2a2a2e] text-[#777] text-[13px] hover:border-[#444] hover:text-white transition-all cursor-pointer bg-transparent"
        >
          ← Буцах
        </button>
       
      </div>

      <div
        className="w-full max-w-[550px] rounded-xl overflow-hidden border"
        style={{ borderColor: c.border, background: c.bg, boxShadow: `0 0 28px ${c.glow}` }}
      >
        <div className="flex flex-col p-6">
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60" style={{ color: c.accent }}>
            Telegram
          </p>
          <p className="text-[26px] font-bold text-white mb-1 leading-none">General</p>
        
          <div className="h-px mb-4" style={{ background: c.border }} />
          <ul className="flex flex-col gap-1.5 mb-6">
            {["хүсэлт илгээсэнээ мэдэгдэх"].map((f) => (
              <li key={f} className="flex items-start gap-1.5 text-[12px] text-[#aaa]">
                <span className="mt-[2px] shrink-0" style={{ color: c.bullet }}>•</span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href="https://t.me/+V8rVpBMrInBhOWFl"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-lg text-[12px] font-semibold text-white text-center no-underline block transition-opacity hover:opacity-80"
            style={{ background: c.btn }}
          >
            Админ бичих →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
