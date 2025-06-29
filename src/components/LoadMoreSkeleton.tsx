
import { Skeleton } from "@/components/ui/skeleton";

export const LoadMoreSkeleton = () => {
  return (
    <div className="space-y-6 mt-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card-premium dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <Skeleton className="aspect-[16/9] w-full dark:bg-gray-700" />
          
          {/* Content skeleton */}
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-3 dark:bg-gray-700" />
            <Skeleton className="h-4 w-full mb-2 dark:bg-gray-700" />
            <Skeleton className="h-4 w-2/3 mb-4 dark:bg-gray-700" />
            
            {/* Meta info skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-4 w-16 dark:bg-gray-700" />
            </div>
          </div>
          
          {/* Button skeleton */}
          <div className="px-6 pb-4">
            <div className="pt-4 border-t border-premium-gray-100 dark:border-gray-700">
              <Skeleton className="h-10 w-32 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
