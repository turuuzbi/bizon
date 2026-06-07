"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getInitials, type PdpMedia } from "./types";

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function PlayBadge({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.74-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

type ProductGalleryProps = {
  media: PdpMedia[];
  name: string;
  isNew?: boolean;
  newLabel?: string;
  discountLabel?: string | null;
};

export function ProductGallery({
  media,
  name,
  isNew,
  newLabel,
  discountLabel,
}: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 50,
    y: 50,
  });
  const touchStartX = useRef<number | null>(null);

  const count = media.length;
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;
  const current = media[safeIndex] ?? null;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Prefetch neighbouring images so navigation feels instant.
  useEffect(() => {
    if (count <= 1) return;
    [safeIndex + 1, safeIndex - 1].forEach((i) => {
      const item = media[((i % count) + count) % count];
      if (item && item.kind === "image") {
        const img = new Image();
        img.src = item.url;
      }
    });
  }, [safeIndex, media, count]);

  // Fullscreen keyboard + scroll lock.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") go(safeIndex + 1);
      if (e.key === "ArrowLeft") go(safeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [fullscreen, go, safeIndex]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? safeIndex + 1 : safeIndex - 1);
    touchStartX.current = null;
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  }

  const stageMedia = (item: PdpMedia | null, options?: { zoomable?: boolean }) => {
    if (!item) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white text-3xl font-semibold uppercase tracking-[0.1em] text-[#7c3aed]">
            {getInitials(name)}
          </div>
        </div>
      );
    }
    if (item.kind === "video") {
      return (
        <video
          key={item.url}
          src={item.url}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full rounded-lg bg-black object-contain"
        />
      );
    }
    return (
      <img
        src={item.url}
        alt={item.altText?.trim() || name}
        loading={safeIndex === 0 ? "eager" : "lazy"}
        fetchPriority={safeIndex === 0 ? "high" : "auto"}
        decoding="async"
        draggable={false}
        className="h-full w-full object-contain transition-transform duration-200 ease-out"
        style={
          options?.zoomable && zoom.active
            ? {
                transform: "scale(2)",
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
              }
            : undefined
        }
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main stage */}
      <div
        className="group relative aspect-square overflow-hidden rounded-lg border border-black/8 bg-[#f5f5f7] p-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="h-full w-full"
          onMouseMove={current?.kind === "image" ? onMouseMove : undefined}
          onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
        >
          {stageMedia(current, { zoomable: true })}
        </div>

        {/* badges */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          {discountLabel ? (
            <span className="rounded-lg bg-[#7c3aed] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {discountLabel}
            </span>
          ) : null}
          {isNew ? (
            <span className="rounded-lg bg-[#1d1d1f] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {newLabel}
            </span>
          ) : null}
        </div>

        {/* fullscreen */}
        {count > 0 ? (
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="Open fullscreen gallery"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
        ) : null}

        {/* arrows */}
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(safeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] opacity-0 shadow-sm backdrop-blur transition-all hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(safeIndex + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] opacity-0 shadow-sm backdrop-blur transition-all hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight />
            </button>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {count > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={`${item.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === safeIndex}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-[#f5f5f7] p-2 transition-colors ${
                i === safeIndex
                  ? "border-[#7c3aed] ring-1 ring-[#7c3aed]"
                  : "border-black/8 hover:border-[#7c3aed]/50"
              }`}
            >
              {item.kind === "video" ? (
                <span className="flex h-full w-full items-center justify-center rounded-md bg-[#1d1d1f] text-white">
                  <PlayBadge className="h-4 w-4" />
                </span>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      ) : null}

      {/* Fullscreen overlay */}
      {fullscreen ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-[#0a0a0c]/95 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-sm font-medium text-white/70">
              {safeIndex + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close gallery"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="max-h-full max-w-4xl">{stageMedia(current)}</div>
            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(safeIndex - 1)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => go(safeIndex + 1)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight />
                </button>
              </>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="flex justify-center gap-2 px-4 pb-6">
              {media.map((item, i) => (
                <button
                  key={`fs-${item.url}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === safeIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
