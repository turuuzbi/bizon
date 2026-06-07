function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#f0f0f2] ${className}`}
      aria-hidden
    />
  );
}

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-340 px-4 py-8 sm:px-6 lg:px-8">
      <Block className="h-4 w-64" />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
        <div className="md:col-span-1 lg:col-span-5">
          <Block className="aspect-square w-full rounded-lg" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Block key={index} className="h-16 w-16 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4 md:col-span-1 lg:col-span-4">
          <Block className="h-4 w-24" />
          <Block className="h-9 w-full" />
          <Block className="h-9 w-3/4" />
          <Block className="h-5 w-40" />
          <Block className="h-20 w-full rounded-lg" />
          <Block className="h-12 w-48" />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <Block className="h-80 w-full rounded-lg" />
        </div>
      </div>
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Block key={index} className="h-28 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
