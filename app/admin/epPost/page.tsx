"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SeriesOption { id: string; name: string; }

const Page = () => {
  const router = useRouter();
  const [info, setInfo] = useState({ episodeNumber: "" });
  const [seriesId, setSeriesId] = useState("");
  const [seriesSearch, setSeriesSearch] = useState("");
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [subscription, setSubscription] = useState<"PREMIUM" | "NORMAL">("PREMIUM");
  const [seriesList, setSeriesList] = useState<SeriesOption[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submittingRef = useRef(false);
  const seriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series`)
      .then((r) => r.json())
      .then((data: SeriesOption[]) => setSeriesList(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (seriesRef.current && !seriesRef.current.contains(e.target as Node)) {
        setSeriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const uploadVideo = async (file: File, title: string): Promise<string> => {
    const initRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/videoUpload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, collection: "series" }),
    });
    const initData = await initRes.json();
    if (!initRes.ok) throw new Error(initData.error || "Upload амжилтгүй");
    const { videoGuid, libraryId } = initData as { videoGuid: string; libraryId: string };

    const uploadRes = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoGuid}`,
      {
        method: "PUT",
        headers: {
          AccessKey: process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY!,
          "Content-Type": file.type,
        },
        body: file,
      }
    );
    if (!uploadRes.ok) throw new Error("Видео upload амжилтгүй");
    return videoGuid;
  };

  const createEpisode = async () => {
    if (submittingRef.current) return;
    setError("");
    if (!seriesId) { setError("Series сонгоно уу"); return; }
    if (!info.episodeNumber) { setError("Анги дугаар оруулна уу"); return; }
    submittingRef.current = true;
    setLoading(true);
    const episodeName = `${info.episodeNumber}-р анги`;
    try {
      let videoUrl: string | undefined;
      if (videoFile) videoUrl = await uploadVideo(videoFile, episodeName);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series/${seriesId}/episode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeNumber: info.episodeNumber, videoUrl, subscription }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Алдаа гарлаа"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Серверийн алдаа гарлаа");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-[52px] bg-[#2C2C2A] border border-[#3a3a38] rounded-lg px-4 text-[14px] text-[#F4F1DE] outline-none transition-colors placeholder:text-[#A8A29E]/40 focus:border-[#38bdf8]";

  return (
    <div className="min-h-screen bg-[#1F1F1E] flex items-center justify-center font-sans px-4 py-12">
      <div className="w-full max-w-[420px]">

        {success ? (
          <div className="text-center py-12">
            <div className="text-[48px] mb-4" style={{ color: "#81B29A" }}>✓</div>
            <div className="text-[22px] font-bold text-[#F4F1DE] mb-2">Амжилттай нэмлээ!</div>
            <p className="text-[13px] text-[#A8A29E]">Нүүр хуудас руу шилжиж байна…</p>
          </div>
        ) : (
          <>
            <h1 className="text-[24px] font-bold text-[#F4F1DE] mb-1">Анги нэмэх</h1>
            <p className="text-[13px] text-[#A8A29E] mb-8">Series сонгоод мэдээллийг бөглөнө үү</p>

            {error && (
              <div className="bg-[#2C2C2A] border border-red-500/30 rounded-lg px-4 py-3 text-[13px] text-red-400 mb-5">
                ⚠ {error}
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-[#A8A29E]">Series (шаардлагатай)</label>
                <div className="relative" ref={seriesRef}>
                  <input
                    className={inputClass}
                    placeholder="Series хайх…"
                    value={seriesSearch}
                    onChange={(e) => {
                      setSeriesSearch(e.target.value);
                      setSeriesId("");
                      setSeriesOpen(true);
                    }}
                    onFocus={() => setSeriesOpen(true)}
                  />
                  {seriesOpen && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[100] bg-[#1F1F1E] border border-[#3a3a38] rounded-lg overflow-hidden max-h-[200px] overflow-y-auto shadow-lg">
                      {seriesList
                        .filter((s) => s.name.toLowerCase().includes(seriesSearch.toLowerCase()))
                        .map((s) => (
                          <div
                            key={s.id}
                            className={`px-4 py-[11px] text-[14px] cursor-pointer transition-colors ${
                              seriesId === s.id
                                ? "bg-[#38bdf8]/15 text-[#38bdf8]"
                                : "text-[#F4F1DE] hover:bg-[#38bdf8]/10"
                            }`}
                            onMouseDown={() => {
                              setSeriesId(s.id);
                              setSeriesSearch(s.name);
                              setSeriesOpen(false);
                            }}
                          >
                            {s.name}
                          </div>
                        ))}
                      {seriesList.filter((s) => s.name.toLowerCase().includes(seriesSearch.toLowerCase())).length === 0 && (
                        <div className="px-4 py-[11px] text-[13px] text-[#A8A29E]">Олдсонгүй</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-[#A8A29E]">Анги дугаар</label>
                <input
                  className={inputClass}
                  name="episodeNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="1"
                  value={info.episodeNumber}
                  onChange={handleInput}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-[#A8A29E]">Subscription</label>
                <select
                  className="w-full h-[52px] bg-[#2C2C2A] border border-[#3a3a38] rounded-lg px-4 text-[14px] text-[#F4F1DE] outline-none transition-colors cursor-pointer focus:border-[#38bdf8]"
                  value={subscription}
                  onChange={(e) => setSubscription(e.target.value as "PREMIUM" | "NORMAL")}
                >
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="NORMAL">NORMAL</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-[#A8A29E]">Видео (сонголтот)</label>
                <div className="flex gap-2">
                  <label
                    className={`flex-1 flex items-center gap-2 rounded-lg px-4 py-3 cursor-pointer text-[13px] border border-dashed transition-colors ${
                      videoFile
                        ? "border-[#81B29A] text-[#81B29A] bg-[#81B29A]/5"
                        : "border-[#3a3a38] text-[#A8A29E] bg-[#2C2C2A] hover:border-[#38bdf8]/50 hover:text-[#38bdf8]"
                    }`}
                  >
                    <input
                      className="hidden"
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                    />
                    {videoFile ? `✓ ${videoFile.name}` : "Видео сонгох…"}
                  </label>
                  {videoFile && (
                    <button
                      className="w-10 flex items-center justify-center rounded-lg border border-[#3a3a38] bg-transparent text-[#A8A29E] cursor-pointer hover:border-red-500/40 hover:text-red-400 transition-colors"
                      onClick={() => setVideoFile(null)}
                    >✕</button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3.5 rounded-lg border border-[#3a3a38] bg-transparent text-[#A8A29E] text-[14px] font-medium cursor-pointer hover:border-[#38bdf8]/50 hover:text-[#F4F1DE] transition-colors"
                onClick={() => router.push("/admin/adminHome")}
              >
                Буцах
              </button>
              <button
                className="flex-[2] py-3.5 rounded-lg border-none text-[#1F1F1E] text-[14px] font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 active:enabled:scale-[0.98]"
                style={{ background: "#38bdf8" }}
                onClick={createEpisode}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1F1F1E]/20 border-t-[#1F1F1E] rounded-full animate-spin" />
                    Хадгалж байна…
                  </span>
                ) : (
                  "Нэмэх →"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
