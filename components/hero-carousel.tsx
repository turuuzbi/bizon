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

// Calm, near-monochrome slide surfaces — one faint violet, the rest neutral.
const slideSurfaces = ["bg-[#f3f0fe]", "bg-[#f5f5f7]", "bg-[#f5f5f7]"];

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
    <div className="relative overflow-hidden rounded-xl border border-black/8 bg-white shadow-sm">
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
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
                className={`absolute inset-0 ${
                  slideSurfaces[index % slideSurfaces.length]
                }`}
              />

              <div className="relative mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-5 px-6 py-12 text-center sm:px-10">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6d28d9]">
                  {slide.eyebrow}
                </span>
                <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl lg:text-[3.5rem]">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-lg leading-8 text-[#6e6e73]">
                  {slide.copy}
                </p>
                <div className="mt-6 flex flex-col items-center gap-5 sm:mt-8 sm:flex-row sm:gap-8">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1d1d1f] px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
                  >
                    {slide.cta}
                  </Link>
                  <Link
                    href={slide.href}
                    className="group inline-flex items-center gap-1.5 text-lg font-semibold text-[#7c3aed] transition-colors hover:text-[#6d28d9] sm:text-xl"
                  >
                    {accentLabels[index % accentLabels.length]}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 sm:h-5 sm:w-5"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <>
          {/* Arrows — one on each side, vertically centered */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() =>
              setActive((current) =>
                current === 0 ? slides.length - 1 : current - 1,
              )
            }
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/90 text-[#1d1d1f] shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md sm:left-5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setActive((current) => (current + 1) % slides.length)}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/90 text-[#1d1d1f] shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md sm:right-5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Dots — clearly spaced, no surrounding box */}
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Slide ${index + 1}`}
                aria-current={index === active}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === active
                    ? "w-7 bg-[#7c3aed]"
                    : "w-2.5 bg-[#1d1d1f]/25 hover:bg-[#1d1d1f]/45"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
