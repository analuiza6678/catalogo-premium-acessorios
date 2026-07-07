export function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[24px] border border-rosa-bebe/70 bg-white p-3 shadow-soft">
          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-rosa-bebe/50" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-rosa-bebe/60" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-rosa-bebe/50" />
          <div className="mt-5 h-11 animate-pulse rounded-full bg-rosa-bebe/50" />
        </div>
      ))}
    </div>
  );
}
