"use client";

import { useState } from "react";
import { toggleBackgroundMusic } from "@/lib/backgroundMusic";

export default function MusicToggle() {
  // MusicToggle only mounts once the door has been knocked open, at which
  // point the background music has already started playing audibly.
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    setPlaying(toggleBackgroundMusic());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-rose/50 bg-card/90 text-rose-deep shadow-[0_8px_24px_-10px_rgba(140,66,88,0.5)] backdrop-blur transition hover:border-rose"
    >
      {playing && (
        <span className="absolute inset-0 animate-ping rounded-full border border-rose-light/70" />
      )}
      {playing ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
