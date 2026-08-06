import React from 'react';

export default function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-500/60 bg-ink-800">
      <div className="shimmer-bg aspect-[2/3] w-full animate-shimmer" />
      <div className="space-y-3 p-4">
        <div className="shimmer-bg h-5 w-3/4 animate-shimmer rounded" />
        <div className="shimmer-bg h-3 w-1/2 animate-shimmer rounded" />
        <div className="shimmer-bg h-9 w-full animate-shimmer rounded-lg" />
      </div>
    </div>
  );
}
