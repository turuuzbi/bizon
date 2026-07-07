"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
};

type HeroCarouselProps = {
  slides: Slide[];
  accentLabels: string[];
};

const slideGradients = [
  "from-[#f5eefc] via-[#ece0fa] to-[#d8c3f3]",
  "from-[#fff4ec] via-[#fce6d3] to-[#f3c9a5]",
  "from-[#eaf3f0] via-[#d2e6df] to-[#a7c8bd]",
];

const slideShapes = [
  "bg-[radial-gradient(circle_at_70%_30%,rgba(142,85,207,0.35),transparent_55%)]",
  "bg-[radial-gradient(circle_at_30%_70%,rgba(234,160,90,0.35),transparent_55%)]",
  "bg-[radial-gradient(circle_at_60%_60%,rgba(70,140,116,0.35),transparent_55%)]",
];

export function HeroCarousel({ slides, accentLabels }: HeroCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-[#e4e4e7] bg-white">
      <div className="relative h-[220px] sm:h-[260px] lg:h-[300px]">
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={slide.title}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  slideGradients[index % slideGradients.length]
                }`}
              />
              <div
                className={`absolute inset-0 ${
                  slideShapes[index % slideShapes.length]
                }`}
              />

              <div className="relative flex h-full flex-col justify-center gap-3 px-6 py-6 sm:px-10 sm:py-8 lg:max-w-[55%] lg:px-12">
                <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7e4cb8] backdrop-blur">
                  {slide.eyebrow}
                </span>
                <h2 className="font-[family:var(--font-display)] text-2xl leading-[1.1] tracking-[-0.02em] text-[#18181b] sm:text-3xl lg:text-4xl">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-sm leading-6 text-[#3f3548] sm:text-base">
                  {slide.copy}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#18181b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8e55cf]"
                  >
                    {slide.cta}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3f3548]/70 sm:inline">
                    {accentLabels[index % accentLabels.length]}
                  </span>
                </div>
              </div>

              {/* Decorative product shape */}
              <div className="pointer-events-none absolute right-[-40px] top-1/2 hidden h-[220px] w-[220px] -translate-y-1/2 rounded-[36px] bg-white/40 backdrop-blur lg:block">
                <div className="absolute inset-4 rounded-[26px] border border-white/60" />
                <div className="absolute inset-8 rounded-[18px] bg-white/60" />
                <div className="absolute inset-14 rounded-xl bg-[#18181b]/8" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              index === active
                ? "w-8 bg-[#8e55cf]"
                : "w-2 bg-[#1f1828]/30 hover:bg-[#1f1828]/60"
            }`}
          />
        ))}
      </div>

      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() =>
            setActive((current) =>
              current === 0 ? slides.length - 1 : current - 1,
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1f1828] backdrop-blur transition-colors hover:bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setActive((current) => (current + 1) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1f1828] backdrop-blur transition-colors hover:bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
