"use client";

import { useEffect, useRef } from "react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [src]);

  return <audio ref={audioRef} src={src} loop />;
}