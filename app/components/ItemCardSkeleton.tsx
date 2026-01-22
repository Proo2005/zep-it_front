"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ItemCardSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl p-4 shadow-sm flex flex-col min-h-[320px]">

      {/* badge */}
      <Skeleton className="absolute top-3 right-3 h-4 w-14 rounded-full" />

      {/* image */}
      <Skeleton className="h-36 rounded-full mb-3" />

      {/* title */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-3" />

      {/* price + stock */}
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>

      {/* quantity input */}
      <Skeleton className="h-8 w-full rounded-lg mb-3" />

      {/* add button */}
      <Skeleton className="h-10 w-full rounded-xl mt-auto" />
    </div>
  );
}
