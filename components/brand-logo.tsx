import Image from "next/image";

type BrandLogoSize = "sm" | "md" | "lg";

type BrandLogoProps = {
  size?: BrandLogoSize;
  priority?: boolean;
  className?: string;
};

const logoSizes: Record<BrandLogoSize, { width: number; height: number }> = {
  sm: { width: 112, height: 102 },
  md: { width: 144, height: 131 },
  lg: { width: 176, height: 160 },
};

export function BrandLogo({
  size = "md",
  priority = false,
  className,
}: BrandLogoProps) {
  const dimensions = logoSizes[size];

  return (
    <Image
      src="/erkas-logo.svg"
      alt="Erka's Building Materials"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={className}
    />
  );
}
