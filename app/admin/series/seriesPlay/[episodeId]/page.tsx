"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface EpisodeInfo {
  id: string;
  episodeNumber: string;
  videoUrl: string | null;
}

const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID!;

const Page = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const router = useRouter();
  const [episode, setEpisode] = useState<EpisodeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!episodeId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series/episodeDetail/${episodeId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Анги олдсонгүй");
        return r.json();
      })
      .then((data: EpisodeInfo) => setEpisode(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [episodeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#888] font-sans">
        Ачааллаж байна…
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#888] font-sans">
        {error || "Анги олдсонгүй"}
      </div>
    );
  }

  const embedUrl = episode.videoUrl
    ? `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${episode.videoUrl}?defaultQuality=720`
    : null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center gap-4 px-6 py-4 bg-black/80 backdrop-blur-[12px] border-b border-white/[0.06] flex-shrink-0 sm:px-3.5 sm:py-2.5 sm:gap-2.5">
        <button
          className="inline-flex items-center gap-1.5 bg-transparent border border-white/15 rounded-[7px] px-3.5 py-[7px] text-white/70 text-[13px] cursor-pointer transition-all duration-[180ms] flex-shrink-0 hover:border-white/35 hover:text-white sm:px-2.5 sm:py-1.5 sm:text-[12px]"
          onClick={() => router.back()}
        >
          ← Буцах
        </button>
        <div className="font-bold text-[16px] text-white tracking-[-0.02em] whitespace-nowrap overflow-hidden text-ellipsis sm:text-[14px]">
          {episode.episodeNumber}-р анги
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8 sm:p-0 sm:items-start">
        {embedUrl ? (
          playing ? (
            <div className="w-full max-w-[1100px] aspect-video rounded-[10px] overflow-hidden bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.8)] sm:rounded-none sm:shadow-none">
              <iframe
                className="w-full h-full border-none block"
                src={embedUrl}
                allowFullScreen
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              />
            </div>
          ) : (
            <div className="w-full max-w-[1100px] aspect-video rounded-[10px] overflow-hidden relative bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-5">
              <div className="w-12 h-12 border-[3px] border-white/[0.08] border-t-white/60 rounded-full animate-spin" />
              <div className="text-[14px] text-white/40 tracking-[0.02em]">Уншиж байна…</div>
              <button
                className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/20 rounded-[8px] px-[22px] py-2.5 cursor-pointer transition-colors duration-[180ms] text-[14px] text-white/70 hover:bg-white/[0.14] hover:text-white"
                onClick={() => setPlaying(true)}
              >
                ▶ Тоглуулах
              </button>
            </div>
          )
        ) : (
          <div className="w-full max-w-[1100px] aspect-video rounded-[10px] border-[1.5px] border-dashed border-white/[0.08] flex items-center justify-center text-[#444] text-[14px] sm:rounded-none">
            Видео байхгүй байна
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
