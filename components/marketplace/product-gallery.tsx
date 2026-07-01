"use client";

import { useState } from "react";

type GalleryImage = {
  url: string;
  altText: string | null;
};

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "P"
  );
}

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-[10px] border border-[#e4e4e7] bg-[#f6f6f7]">
        {current ? (
          <div
            role="img"
            aria-label={current.altText || productName}
            className="absolute inset-6 bg-no-repeat"
            style={{
              backgroundImage: `url("${current.url}")`,
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[10px] bg-white text-2xl font-semibold uppercase tracking-wide text-[#8e55cf]">
              {getInitials(productName)}
            </div>
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${productName} ${index + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border bg-[#f6f6f7] ${
                index === active ? "border-[#8e55cf]" : "border-[#e4e4e7]"
              }`}
            >
              <div
                className="absolute inset-2 bg-no-repeat"
                style={{
                  backgroundImage: `url("${image.url}")`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
