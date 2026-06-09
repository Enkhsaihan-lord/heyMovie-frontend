"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Page = () => {
  const router = useRouter();
  const [info, setInfo] = useState({
    name: "",
    description: "",
    seriesNumber: "",
  });
  const [subscription, setSubscription] = useState<"PREMIUM" | "NORMAL">(
    "PREMIUM",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submittingRef = useRef(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const base64 = await toBase64(file);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/movie/imageUpload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, contentType: file.type }),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Зураг upload амжилтгүй");
    return data.url as string;
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const initRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/movie/videoUpload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: info.name, collection: "series" }),
      },
    );
    const initData = await initRes.json();
    if (!initRes.ok) throw new Error(initData.error || "Upload амжилтгүй");
    const { videoGuid, libraryId } = initData as {
      videoGuid: string;
      libraryId: string;
    };

    const uploadRes = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoGuid}`,
      {
        method: "PUT",
        headers: {
          AccessKey: process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY!,
          "Content-Type": file.type,
        },
        body: file,
      },
    );
    if (!uploadRes.ok) throw new Error("Видео upload амжилтгүй");
    return videoGuid;
  };

  const createSeries = async () => {
    if (submittingRef.current) return;
    setError("");
    if (!info.name || !info.description || !info.seriesNumber) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (!imageFile) {
      setError("Зураг сонгоно уу");
      return;
    }
    submittingRef.current = true;
    setLoading(true);
    try {
      setUploadStep("Зураг upload хийж байна…");
      const image = await uploadImage(imageFile);

      let videoGuid: string | undefined;
      if (videoFile) {
        setUploadStep("Видео upload хийж байна…");
        videoGuid = await uploadVideo(videoFile);
      }

      setUploadStep("Series хадгалж байна…");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...info, image, subscription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");

      if (videoGuid) {
        setUploadStep("1-р анги нэмж байна…");
        const epRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/series/${data.id}/episode`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              episodeNumber: "1",
              image,
              videoUrl: videoGuid,
              subscription,
            }),
          },
        );
        if (!epRes.ok) throw new Error("1-р анги үүсгэхэд алдаа гарлаа");
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Серверийн алдаа гарлаа");
    } finally {
      submittingRef.current = false;
      setLoading(false);
      setUploadStep("");
    }
  };

  return (
    <div className="min-h-screen bg-[#020c18] flex items-stretch font-sans relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div
        className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden border-r border-cyan-500/10"
        style={{ background: "linear-gradient(160deg, #041628 0%, #020c18 100%)" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 p-12 max-w-[400px]">
          <div
            className="text-[22px] font-extrabold text-[#22d3ee] tracking-[-0.04em] mb-14"
            style={{ textShadow: "0 0 20px rgba(34,211,238,0.4)" }}
          >
            ◈ platform
          </div>
          <h2 className="font-extrabold text-[38px] text-[#e0f7ff] leading-[1.1] tracking-[-0.04em] mb-4">
            Add a new
            <br />
            <span
              style={{
                background: "linear-gradient(120deg, #22d3ee, #67e8f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              series
            </span>
          </h2>
          <p className="text-[15px] text-[#2d6a82] leading-relaxed font-light">
            Upload your series with cover image and optional trailer video.
          </p>
          <div className="flex gap-2 mt-12">
            <div className="w-2 h-2 rounded-full" style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }} />
            <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
            <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
          </div>
        </div>
      </div>

      <div className="flex-none w-full md:w-[480px] flex items-center justify-center px-6 py-12 bg-[#020c18] relative">
        <div className="relative z-10 w-full max-w-[360px]">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 bg-cyan-500/[0.08] border border-cyan-500/20 rounded-[20px] px-3 py-1 text-[10px] font-semibold text-[#67e8f9] tracking-[0.1em] uppercase mb-[18px]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#22d3ee]" style={{ boxShadow: "0 0 8px #22d3ee, 0 0 16px rgba(34,211,238,0.5)" }} />
              New Series
            </div>
            <h1 className="font-extrabold text-[26px] text-[#e0f7ff] leading-[1.2] tracking-[-0.03em] mb-1.5">Series нэмэх</h1>
            <p className="text-[13px] text-[#1e4a5e] font-light">Мэдээллийг бөглөж upload хийнэ үү</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="text-[52px] mb-3.5" style={{ filter: "drop-shadow(0 0 18px rgba(34,211,238,0.7))" }}>✦</div>
              <div className="font-extrabold text-[22px] text-[#e0f7ff] mb-1.5">Амжилттай нэмлээ!</div>
              <p className="text-[13px] text-[#2d6a82]">Жагсаалт руу шилжиж байна…</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 bg-red-500/[0.07] border border-red-500/20 rounded-lg px-3.5 py-2.5 text-[13px] text-[#fca5a5] mb-4 before:content-['⚠'] before:text-[13px]">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] font-semibold text-[#2d6a82] tracking-[0.09em] uppercase">Нэр</label>
                  <input
                    className="w-full h-[52px] bg-[#f0f9ff] border-[1.5px] border-cyan-500/20 rounded-[10px] px-4 text-[15px] text-black outline-none transition-all duration-200 placeholder:text-[#94a3b8] focus:border-[#22d3ee] focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12),0_0_20px_rgba(34,211,238,0.08)]"
                    name="name"
                    placeholder="Series нэр"
                    value={info.name}
                    onChange={handleInput}
                  />
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] font-semibold text-[#2d6a82] tracking-[0.09em] uppercase">Дугаар</label>
                  <input
                    className="w-full h-[52px] bg-[#f0f9ff] border-[1.5px] border-cyan-500/20 rounded-[10px] px-4 text-[15px] text-black outline-none transition-all duration-200 placeholder:text-[#94a3b8] focus:border-[#22d3ee] focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12),0_0_20px_rgba(34,211,238,0.08)]"
                    name="seriesNumber"
                    placeholder="1"
                    value={info.seriesNumber}
                    onChange={handleInput}
                  />
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] font-semibold text-[#2d6a82] tracking-[0.09em] uppercase">Тайлбар</label>
                  <textarea
                    className="w-full min-h-[88px] bg-[#f0f9ff] border-[1.5px] border-cyan-500/20 rounded-[10px] px-4 py-3.5 text-[15px] text-black outline-none transition-all duration-200 placeholder:text-[#94a3b8] resize-y focus:border-[#22d3ee] focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12),0_0_20px_rgba(34,211,238,0.08)]"
                    name="description"
                    placeholder="Series тухай товч тайлбар"
                    value={info.description}
                    onChange={handleInput}
                  />
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] font-semibold text-[#2d6a82] tracking-[0.09em] uppercase">Subscription</label>
                  <select
                    className="w-full h-[52px] bg-[#f0f9ff] border-[1.5px] border-cyan-500/20 rounded-[10px] px-4 text-[15px] text-black outline-none transition-all duration-200 cursor-pointer focus:border-[#22d3ee] focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]"
                    value={subscription}
                    onChange={(e) =>
                      setSubscription(e.target.value as "PREMIUM" | "NORMAL")
                    }
                  >
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="NORMAL">NORMAL</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] font-semibold text-[#2d6a82] tracking-[0.09em] uppercase">Зураг (шаардлагатай)</label>
                  <div className="flex gap-2 items-stretch">
                    <label
                      className={`flex-1 flex items-center gap-2.5 rounded-[10px] px-4 py-3.5 cursor-pointer text-[13px] transition-all duration-200 border-[1.5px] border-dashed${imageFile ? " border-cyan-500/40 text-[#22d3ee]" : " border-cyan-500/25 bg-cyan-500/[0.04] text-[#2d6a82] hover:border-cyan-500/50 hover:bg-cyan-500/[0.08] hover:text-[#67e8f9]"}`}
                    >
                      <input
                        className="hidden"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] ?? null)
                        }
                      />
                      {imageFile ? `✓ ${imageFile.name}` : "Зураг сонгох…"}
                    </label>
                    {imageFile && (
                      <button
                        className="flex items-center justify-center w-10 rounded-[10px] border-[1.5px] border-red-500/30 bg-transparent text-[#f87171] text-base cursor-pointer flex-shrink-0 transition-all duration-[180ms] hover:bg-red-500/[0.08] hover:border-red-500/50"
                        onClick={() => setImageFile(null)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] font-semibold text-[#2d6a82] tracking-[0.09em] uppercase">
                    1-р анги видео (сонголтот)
                  </label>
                  <div className="flex gap-2 items-stretch">
                    <label
                      className={`flex-1 flex items-center gap-2.5 rounded-[10px] px-4 py-3.5 cursor-pointer text-[13px] transition-all duration-200 border-[1.5px] border-dashed${videoFile ? " border-cyan-500/40 text-[#22d3ee]" : " border-cyan-500/25 bg-cyan-500/[0.04] text-[#2d6a82] hover:border-cyan-500/50 hover:bg-cyan-500/[0.08] hover:text-[#67e8f9]"}`}
                    >
                      <input
                        className="hidden"
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(e) =>
                          setVideoFile(e.target.files?.[0] ?? null)
                        }
                      />
                      {videoFile ? `✓ ${videoFile.name}` : "Видео сонгох…"}
                    </label>
                    {videoFile && (
                      <button
                        className="flex items-center justify-center w-10 rounded-[10px] border-[1.5px] border-red-500/30 bg-transparent text-[#f87171] text-base cursor-pointer flex-shrink-0 transition-all duration-[180ms] hover:bg-red-500/[0.08] hover:border-red-500/50"
                        onClick={() => setVideoFile(null)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_2fr] gap-2.5 mb-5">
                <button
                  className="py-3.5 px-4 rounded-[10px] border-[1.5px] border-cyan-500/30 bg-transparent text-[#22d3ee] text-[14px] font-medium cursor-pointer transition-all duration-[180ms] hover:bg-cyan-500/[0.06] hover:border-cyan-500/50"
                  onClick={() => router.push("/admin/epPost")}
                >
                  Буцах
                </button>
                <button
                  className="py-3.5 px-5 rounded-[10px] border-none text-white text-[15px] font-bold tracking-[0.01em] cursor-pointer transition-all duration-[180ms] shadow-[0_4px_20px_rgba(6,182,212,0.3)] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-[0.88] hover:enabled:-translate-y-px hover:enabled:shadow-[0_8px_28px_rgba(6,182,212,0.45)] active:enabled:translate-y-0"
                  style={{ background: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)" }}
                  onClick={createSeries}
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-[15px] h-[15px] border-2 border-white/25 border-t-white rounded-full animate-spin" />
                        {uploadStep || "Хадгалж байна…"}
                      </>
                    ) : (
                      "Нэмэх →"
                    )}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
